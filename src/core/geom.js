import * as THREE from 'three';
import { noise2, rng } from './rng.js';

// Procedural geometry kit: sweeps, lathes, lumpy blobs and tapered branches.

const up = new THREE.Vector3(0, 1, 0);

// Sweep a 2D profile (array of [x, y] in the path's side/up plane) along a
// polyline of Vector3. `up` keeps frames stable for near-horizontal paths.
// opts: { closed: profile closed loop, scale: (t)=>s, caps: true, upVec }
export function sweep(points, profile, opts = {}) {
  const upVec = opts.upVec || up;
  const n = points.length;
  const m = profile.length;
  const closed = opts.closed !== false;
  const pos = [];
  const uv = [];
  const idx = [];
  const T = new THREE.Vector3();
  const S = new THREE.Vector3();
  const U = new THREE.Vector3();
  let along = 0;
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const a = points[Math.max(0, i - 1)];
    const b = points[Math.min(n - 1, i + 1)];
    T.subVectors(b, a).normalize();
    S.crossVectors(T, upVec);
    if (S.lengthSq() < 1e-6) S.set(1, 0, 0);
    S.normalize();
    U.crossVectors(S, T).normalize();
    if (i > 0) along += p.distanceTo(points[i - 1]);
    const sc = opts.scale ? opts.scale(i / (n - 1)) : 1;
    for (let j = 0; j < m; j++) {
      const [px, py] = profile[j];
      pos.push(p.x + (S.x * px + U.x * py) * sc, p.y + (S.y * px + U.y * py) * sc, p.z + (S.z * px + U.z * py) * sc);
      uv.push(j / (m - 1), along);
    }
  }
  const segs = closed ? m : m - 1;
  for (let i = 0; i < n - 1; i++)
    for (let j = 0; j < segs; j++) {
      const a = i * m + j;
      const b = i * m + ((j + 1) % m);
      const c = (i + 1) * m + j;
      const d = (i + 1) * m + ((j + 1) % m);
      idx.push(a, c, b, b, c, d);
    }
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g = g.toNonIndexed(); // flat shading keeps profile edges crisp
  g.computeVertexNormals();
  if (opts.caps !== false && closed) {
    const caps = capGeometry(points, profile, opts, upVec);
    g = mergeSimple([g, caps]);
  }
  return g;
}

function capGeometry(points, profile, opts, upVec) {
  const pos = [];
  const n = points.length;
  const T = new THREE.Vector3();
  const S = new THREE.Vector3();
  const U = new THREE.Vector3();
  for (const [i, dirSign] of [
    [0, -1],
    [n - 1, 1]
  ]) {
    const p = points[i];
    const a = points[Math.max(0, i - 1)];
    const b = points[Math.min(n - 1, i + 1)];
    T.subVectors(b, a).normalize();
    S.crossVectors(T, upVec).normalize();
    U.crossVectors(S, T).normalize();
    const sc = opts.scale ? opts.scale(i / (n - 1)) : 1;
    const ring = profile.map(([px, py]) => new THREE.Vector3(p.x + (S.x * px + U.x * py) * sc, p.y + (S.y * px + U.y * py) * sc, p.z + (S.z * px + U.z * py) * sc));
    const c = ring.reduce((acc, v) => acc.add(v), new THREE.Vector3()).multiplyScalar(1 / ring.length);
    for (let j = 0; j < ring.length; j++) {
      const v0 = ring[j];
      const v1 = ring[(j + 1) % ring.length];
      if (dirSign > 0) pos.push(c.x, c.y, c.z, v0.x, v0.y, v0.z, v1.x, v1.y, v1.z);
      else pos.push(c.x, c.y, c.z, v1.x, v1.y, v1.z, v0.x, v0.y, v0.z);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(new Array((pos.length / 3) * 2).fill(0), 2));
  g.computeVertexNormals();
  return g;
}

// merge non-indexed geometries that share position/normal/uv
export function mergeSimple(list) {
  const out = { position: [], normal: [], uv: [] };
  for (let g of list) {
    if (g.index) g = g.toNonIndexed();
    if (!g.attributes.normal) g.computeVertexNormals();
    const pa = g.attributes.position.array;
    const na = g.attributes.normal.array;
    for (let i = 0; i < pa.length; i++) out.position.push(pa[i]);
    for (let i = 0; i < na.length; i++) out.normal.push(na[i]);
    if (g.attributes.uv) {
      const ua = g.attributes.uv.array;
      for (let i = 0; i < ua.length; i++) out.uv.push(ua[i]);
    } else for (let i = 0; i < g.attributes.position.count * 2; i++) out.uv.push(0);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(out.position, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(out.normal, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(out.uv, 2));
  return g;
}

// lathe from [radius, y] pairs
export function lathe(profile, segments = 12, phi = 0, span = Math.PI * 2) {
  return new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(Math.max(0.0001, r), y)),
    segments,
    phi,
    span
  );
}

// Lumpy blob: an icosphere pushed around by value noise. Used for foliage
// clumps, shrubs and rocks. Vertex normals are smooth.
export function blob(detail = 2, seed = 1, amp = 0.25, freq = 2.2) {
  const g = new THREE.IcosahedronGeometry(1, detail);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  const o = seed * 13.17;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n =
      noise2(v.x * freq + o, v.y * freq + v.z * 0.7 * freq) * 0.65 + noise2(v.z * freq * 2.1 - o, v.y * freq * 2.1 + v.x) * 0.35;
    v.multiplyScalar(1 + (n - 0.5) * 2 * amp);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  // Icosahedron geometry is non-indexed; weld so normals come out smooth
  const merged = weld(g);
  merged.computeVertexNormals();
  return merged;
}

// weld identical positions (simple spatial hash) so normals smooth across seams
export function weld(geo, tol = 1e-4) {
  const src = geo.index ? geo.toNonIndexed() : geo;
  const p = src.attributes.position;
  const map = new Map();
  const pos = [];
  const uv = [];
  const idx = [];
  const suv = src.attributes.uv;
  const inv = 1 / tol;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    const k = `${Math.round(x * inv)},${Math.round(y * inv)},${Math.round(z * inv)}`;
    let id = map.get(k);
    if (id === undefined) {
      id = pos.length / 3;
      map.set(k, id);
      pos.push(x, y, z);
      uv.push(suv ? suv.getX(i) : 0, suv ? suv.getY(i) : 0);
    }
    idx.push(id);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

// Tapered tube along a curve: trunks, branches, bamboo culms.
// radius: (t) => r, t in [0,1] from start to end
export function taperedTube(curve, radius, radial = 6, segments = 8, closeEnd = true) {
  const frames = curve.computeFrenetFrames(segments, false);
  const pos = [];
  const uv = [];
  const idx = [];
  const P = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    curve.getPointAt(t, P);
    const N = frames.normals[i];
    const B = frames.binormals[i];
    const r = radius(t);
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const c = Math.cos(a);
      const s = Math.sin(a);
      pos.push(P.x + r * (c * N.x + s * B.x), P.y + r * (c * N.y + s * B.y), P.z + r * (c * N.z + s * B.z));
      uv.push(j / radial, t);
    }
  }
  for (let i = 0; i < segments; i++)
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j;
      const b = a + radial + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  if (closeEnd) {
    curve.getPointAt(1, P);
    const tip = pos.length / 3;
    pos.push(P.x, P.y, P.z);
    uv.push(0.5, 1);
    const last = segments * (radial + 1);
    for (let j = 0; j < radial; j++) idx.push(last + j, tip, last + j + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// A flat ribbon hanging/following points (willow strands, banners, threads).
// width: (t)=>w ; side vector fixed per ribbon
export function ribbon(points, width, side = new THREE.Vector3(1, 0, 0)) {
  const pos = [];
  const uv = [];
  const idx = [];
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const w = typeof width === 'function' ? width(t) : width;
    const p = points[i];
    pos.push(p.x - side.x * w, p.y - side.y * w, p.z - side.z * w, p.x + side.x * w, p.y + side.y * w, p.z + side.z * w);
    uv.push(0, t, 1, t);
    if (i < n - 1) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// Extrude a THREE.Shape (in x/y) by depth along +z, centred on z.
export function extrude(shape, depth, curveSegments = 12, bevel = 0) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments: 1,
    curveSegments
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

// lanceolate leaf (bamboo / willow / reed), lying in the x-y plane, base at origin, tip at +y
export function leafBlade(length = 1, width = 0.12, segs = 3, curl = 0.15) {
  const pos = [];
  const idx = [];
  const uv = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const w = width * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (1 - t * 0.3);
    const y = t * length;
    const z = -curl * t * t * length;
    pos.push(-w / 2, y, z, w / 2, y, z);
    uv.push(0, t, 1, t);
    if (i < segs) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// random point inside a polygon (array of [x,z]) by rejection
export function pointInPoly(x, z, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0];
    const zi = poly[i][1];
    const xj = poly[j][0];
    const zj = poly[j][1];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

// distance from point to polyline (array of [x,z])
export function distToPolyline(x, z, pts, closed = false) {
  let best = Infinity;
  const n = pts.length;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const l2 = dx * dx + dz * dz || 1e-9;
    let t = ((x - a[0]) * dx + (z - a[1]) * dz) / l2;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const px = a[0] + dx * t - x;
    const pz = a[1] + dz * t - z;
    const d = px * px + pz * pz;
    if (d < best) best = d;
  }
  return Math.sqrt(best);
}

// smooth closed curve through control points → dense polygon [[x,z],...]
export function smoothLoop(ctrl, samples = 96) {
  const curve = new THREE.CatmullRomCurve3(
    ctrl.map(([x, z]) => new THREE.Vector3(x, 0, z)),
    true,
    'centripetal'
  );
  return curve.getSpacedPoints(samples).slice(0, samples).map((v) => [v.x, v.z]);
}

export function smoothPath(ctrl, samples = 64) {
  const curve = new THREE.CatmullRomCurve3(ctrl.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal');
  return curve.getSpacedPoints(samples).map((v) => [v.x, v.z]);
}

export { rng };
