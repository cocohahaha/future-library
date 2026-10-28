import { BufferGeometry, Float32BufferAttribute, Uint32BufferAttribute, Uint16BufferAttribute, Matrix4, Vector3, Quaternion, Euler, Color } from 'three';

// Small geometry kit. Every primitive is indexed, has normals and UVs in
// millimetres (so a texture with repeat = 1/tileSize tiles at true scale on
// every object), and can carry two extra attributes used by the miniatures:
//   color  : per-vertex tint (white by default)
//   aDelay : 0..1 lift-off stagger (see diorama/lift.js)

class Mesher {
  constructor() {
    this.p = [];
    this.n = [];
    this.uv = [];
    this.idx = [];
  }
  v(x, y, z, nx, ny, nz, u, w) {
    this.p.push(x, y, z);
    this.n.push(nx, ny, nz);
    this.uv.push(u, w);
    return this.p.length / 3 - 1;
  }
  tri(a, b, c) {
    this.idx.push(a, b, c);
  }
  quad(a, b, c, d) {
    // a-b-c-d counter-clockwise
    this.idx.push(a, b, c, a, c, d);
  }
  build() {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(this.p, 3));
    g.setAttribute('normal', new Float32BufferAttribute(this.n, 3));
    g.setAttribute('uv', new Float32BufferAttribute(this.uv, 2));
    const count = this.p.length / 3;
    g.setIndex(count > 65535 ? new Uint32BufferAttribute(this.idx, 1) : new Uint16BufferAttribute(this.idx, 1));
    return g;
  }
}
export { Mesher };

// ---------------------------------------------------------------- box family
// Rounded box centred on the origin. r = edge radius, seg = segments per
// rounded edge (0 → sharp box). Normals are analytic, so edges catch light.
export function roundBox(w, h, d, r = 0, seg = 2) {
  const hx = w / 2;
  const hy = h / 2;
  const hz = d / 2;
  r = Math.max(0, Math.min(r, hx, hy, hz));
  if (r < 1e-4) seg = 0;
  const m = new Mesher();
  const ticks = (half) => {
    if (!seg) return [-half, half];
    const t = [];
    for (let i = 0; i <= seg; i++) t.push(-half + (r * i) / seg);
    for (let i = 0; i <= seg; i++) t.push(half - r + (r * i) / seg);
    return t;
  };
  const tx = ticks(hx);
  const ty = ticks(hy);
  const tz = ticks(hz);
  const inner = new Vector3();
  const pos = new Vector3();
  const nrm = new Vector3();
  const clamp = (v, a) => Math.max(-a, Math.min(a, v));
  // face: axis index of the normal, sign, the two in-plane tick arrays
  const faces = [
    { ax: 0, s: 1, a: 2, b: 1, ta: tz, tb: ty, flipA: true },
    { ax: 0, s: -1, a: 2, b: 1, ta: tz, tb: ty, flipA: false },
    { ax: 1, s: 1, a: 0, b: 2, ta: tx, tb: tz, flipA: true },
    { ax: 1, s: -1, a: 0, b: 2, ta: tx, tb: tz, flipA: false },
    { ax: 2, s: 1, a: 0, b: 1, ta: tx, tb: ty, flipA: false },
    { ax: 2, s: -1, a: 0, b: 1, ta: tx, tb: ty, flipA: true }
  ];
  const half = [hx, hy, hz];
  const ri = [hx - r, hy - r, hz - r];
  for (const f of faces) {
    const base = m.p.length / 3;
    const na = f.ta.length;
    const nb = f.tb.length;
    for (let j = 0; j < nb; j++) {
      for (let i = 0; i < na; i++) {
        const c = [0, 0, 0];
        c[f.ax] = f.s * half[f.ax];
        c[f.a] = f.ta[f.flipA ? na - 1 - i : i];
        c[f.b] = f.tb[j];
        pos.set(c[0], c[1], c[2]);
        inner.set(clamp(c[0], ri[0]), clamp(c[1], ri[1]), clamp(c[2], ri[2]));
        nrm.subVectors(pos, inner);
        if (nrm.lengthSq() < 1e-12) {
          nrm.set(0, 0, 0);
          nrm.setComponent(f.ax, f.s);
        }
        nrm.normalize();
        if (r > 0) pos.copy(inner).addScaledVector(nrm, r);
        // uv: unwrapped in-plane coordinates in mm
        const u = (f.flipA ? -c[f.a] : c[f.a]) + half[f.a];
        const v = c[f.b] + half[f.b];
        m.v(pos.x, pos.y, pos.z, nrm.x, nrm.y, nrm.z, u, v);
      }
    }
    for (let j = 0; j < nb - 1; j++)
      for (let i = 0; i < na - 1; i++) {
        const a = base + j * na + i;
        m.quad(a, a + 1, a + na + 1, a + na);
      }
  }
  return m.build();
}

export const box = (w, h, d) => roundBox(w, h, d, 0, 0);

// ---------------------------------------------------------------- revolve
// pts: [[radius, y], ...] from bottom to top. Caps are not added (put r = 0
// points at the ends to close the shape). Smooth normals from the profile.
export function lathe(pts, seg = 24, { a0 = 0, a1 = Math.PI * 2, flat = false } = {}) {
  const m = new Mesher();
  const n = pts.length;
  // profile normals
  const pn = [];
  for (let i = 0; i < n; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[Math.min(n - 1, i + 1)];
    let tx = p1[0] - p0[0];
    let ty = p1[1] - p0[1];
    const l = Math.hypot(tx, ty) || 1;
    tx /= l;
    ty /= l;
    pn.push([ty, -tx]); // outward for a profile that goes up
  }
  // arc length along the profile, for v
  const sl = [0];
  for (let i = 1; i < n; i++) sl.push(sl[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const full = Math.abs(a1 - a0 - Math.PI * 2) < 1e-6;
  const cols = seg + 1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= seg; j++) {
      const a = a0 + ((a1 - a0) * j) / seg;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const [r, y] = pts[i];
      const [nr, ny] = flat ? [1, 0] : pn[i];
      m.v(r * sa, y, r * ca, nr * sa, ny, nr * ca, (a - a0) * Math.max(r, 1), sl[i]);
    }
  }
  for (let i = 0; i < n - 1; i++)
    for (let j = 0; j < seg; j++) {
      const a = i * cols + j;
      m.quad(a, a + 1, a + cols + 1, a + cols);
    }
  const g = m.build();
  if (!full) g.userData.open = true;
  return g;
}

export function cylinder(r, h, seg = 24, { rTop = r, caps = true } = {}) {
  const pts = [];
  if (caps) pts.push([0, 0], [r * 0.999, 0]);
  pts.push([r, 0], [rTop, h]);
  if (caps) pts.push([rTop * 0.999, h], [0, h]);
  const g = lathe(pts, seg);
  if (caps) fixCapNormals(g, seg, pts.length);
  return g;
}

// lathe smooth normals blur the cap edge; snap cap rings to flat normals
function fixCapNormals(g, seg, rows) {
  const nrm = g.attributes.normal;
  const cols = seg + 1;
  for (let j = 0; j < cols; j++) {
    for (const row of [0, 1]) nrm.setXYZ(row * cols + j, 0, -1, 0);
    for (const row of [rows - 2, rows - 1]) nrm.setXYZ(row * cols + j, 0, 1, 0);
  }
  // the side rows keep radial normals
  const pos = g.attributes.position;
  for (const row of [2, 3]) {
    for (let j = 0; j < cols; j++) {
      const i = row * cols + j;
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const l = Math.hypot(x, z) || 1;
      nrm.setXYZ(i, x / l, 0, z / l);
    }
  }
}

export function sphere(r, wSeg = 16, hSeg = 12) {
  const pts = [];
  for (let i = 0; i <= hSeg; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / hSeg;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  const g = lathe(pts, wSeg);
  // exact sphere normals
  const p = g.attributes.position;
  const n = g.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    const l = Math.hypot(x, y, z) || 1;
    n.setXYZ(i, x / l, y / l, z / l);
  }
  return g;
}

// ---------------------------------------------------------------- sweeps
// Tube along a polyline of Vector3 (rotation-minimising frames).
export function tube(points, radius, radial = 8, { closed = false, caps = true, radii = null } = {}) {
  const m = new Mesher();
  const n = points.length;
  const T = [];
  for (let i = 0; i < n; i++) {
    const a = points[Math.max(0, i - 1)];
    const b = points[Math.min(n - 1, i + 1)];
    T.push(new Vector3().subVectors(b, a).normalize());
  }
  // initial normal
  let N = new Vector3(0, 1, 0);
  if (Math.abs(T[0].y) > 0.9) N.set(1, 0, 0);
  N.sub(T[0].clone().multiplyScalar(N.dot(T[0]))).normalize();
  const frames = [];
  for (let i = 0; i < n; i++) {
    if (i > 0) {
      // project the previous normal onto the new plane
      N = N.clone().sub(T[i].clone().multiplyScalar(N.dot(T[i]))).normalize();
    }
    const B = new Vector3().crossVectors(T[i], N);
    frames.push([N.clone(), B]);
  }
  let len = 0;
  const cols = radial + 1;
  for (let i = 0; i < n; i++) {
    if (i > 0) len += points[i].distanceTo(points[i - 1]);
    const [Ni, Bi] = frames[i];
    const r = radii ? radii[i] : radius;
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const nx = Ni.x * Math.cos(a) + Bi.x * Math.sin(a);
      const ny = Ni.y * Math.cos(a) + Bi.y * Math.sin(a);
      const nz = Ni.z * Math.cos(a) + Bi.z * Math.sin(a);
      const p = points[i];
      m.v(p.x + nx * r, p.y + ny * r, p.z + nz * r, nx, ny, nz, (j / radial) * Math.PI * 2 * r, len);
    }
  }
  for (let i = 0; i < n - 1; i++)
    for (let j = 0; j < radial; j++) {
      const a = i * cols + j;
      m.quad(a, a + 1, a + cols + 1, a + cols);
    }
  if (closed) {
    const a0 = 0;
    const b0 = (n - 1) * cols;
    for (let j = 0; j < radial; j++) m.quad(b0 + j, b0 + j + 1, a0 + j + 1, a0 + j);
  } else if (caps) {
    for (const [i, s] of [
      [0, -1],
      [n - 1, 1]
    ]) {
      const t = T[i].clone().multiplyScalar(s);
      const c = m.v(points[i].x, points[i].y, points[i].z, t.x, t.y, t.z, 0, 0);
      const [Ni, Bi] = frames[i];
      const r = radii ? radii[i] : radius;
      const ring = [];
      for (let j = 0; j <= radial; j++) {
        const a = (j / radial) * Math.PI * 2;
        const dx = Ni.x * Math.cos(a) + Bi.x * Math.sin(a);
        const dy = Ni.y * Math.cos(a) + Bi.y * Math.sin(a);
        const dz = Ni.z * Math.cos(a) + Bi.z * Math.sin(a);
        ring.push(m.v(points[i].x + dx * r, points[i].y + dy * r, points[i].z + dz * r, t.x, t.y, t.z, dx * r, dz * r));
      }
      for (let j = 0; j < radial; j++) s > 0 ? m.tri(c, ring[j], ring[j + 1]) : m.tri(c, ring[j + 1], ring[j]);
    }
  }
  return m.build();
}

// Catmull-Rom resample of control points (Vector3[]) into a smooth polyline
export function smoothPath(ctrl, perSeg = 8) {
  const out = [];
  const n = ctrl.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)];
    const p1 = ctrl[i];
    const p2 = ctrl[i + 1];
    const p3 = ctrl[Math.min(n - 1, i + 2)];
    for (let k = 0; k < perSeg; k++) {
      const t = k / perSeg;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push(new Vector3(f(p0.x, p1.x, p2.x, p3.x), f(p0.y, p1.y, p2.y, p3.y), f(p0.z, p1.z, p2.z, p3.z)));
    }
  }
  out.push(ctrl[n - 1].clone());
  return out;
}

// Extruded annular sector: inner/outer radius, angles (radians, measured
// from +z toward +x), height. For curved walls, steps and benches.
export function ringSector(r0, r1, a0, a1, h, seg = 32, { bevel = 0 } = {}) {
  const m = new Mesher();
  const ang = (j) => a0 + ((a1 - a0) * j) / seg;
  const full = Math.abs(Math.abs(a1 - a0) - Math.PI * 2) < 1e-5;
  const cols = seg + 1;
  // top and bottom
  for (const [y, ny] of [
    [h, 1],
    [0, -1]
  ]) {
    const base = m.p.length / 3;
    for (let j = 0; j <= seg; j++) {
      const a = ang(j);
      const s = Math.sin(a);
      const c = Math.cos(a);
      m.v(r0 * s, y, r0 * c, 0, ny, 0, r0 * s, r0 * c);
      m.v(r1 * s, y, r1 * c, 0, ny, 0, r1 * s, r1 * c);
    }
    for (let j = 0; j < seg; j++) {
      const a = base + j * 2;
      if (ny > 0) m.quad(a, a + 1, a + 3, a + 2);
      else m.quad(a, a + 2, a + 3, a + 1);
    }
  }
  // outer and inner walls
  for (const [r, sgn] of [
    [r1, 1],
    [r0, -1]
  ]) {
    if (r <= 0) continue;
    const base = m.p.length / 3;
    for (let j = 0; j <= seg; j++) {
      const a = ang(j);
      const s = Math.sin(a);
      const c = Math.cos(a);
      m.v(r * s, 0, r * c, s * sgn, 0, c * sgn, (a - a0) * r, 0);
      m.v(r * s, h, r * c, s * sgn, 0, c * sgn, (a - a0) * r, h);
    }
    for (let j = 0; j < seg; j++) {
      const a = base + j * 2;
      if (sgn > 0) m.quad(a, a + 2, a + 3, a + 1);
      else m.quad(a, a + 1, a + 3, a + 2);
    }
  }
  // end caps
  if (!full) {
    for (const [a, sgn] of [
      [a0, -1],
      [a1, 1]
    ]) {
      const s = Math.sin(a);
      const c = Math.cos(a);
      // tangent direction (increasing angle): (c, 0, -s)
      const nx = c * sgn;
      const nz = -s * sgn;
      const b = m.p.length / 3;
      m.v(r0 * s, 0, r0 * c, nx, 0, nz, r0, 0);
      m.v(r1 * s, 0, r1 * c, nx, 0, nz, r1, 0);
      m.v(r1 * s, h, r1 * c, nx, 0, nz, r1, h);
      m.v(r0 * s, h, r0 * c, nx, 0, nz, r0, h);
      if (sgn > 0) m.quad(b, b + 3, b + 2, b + 1);
      else m.quad(b, b + 1, b + 2, b + 3);
    }
  }
  void cols;
  void bevel;
  return m.build();
}

// Extrude a convex polygon (x, z pairs, counter-clockwise seen from +y) up by h.
export function prism(poly, h) {
  const m = new Mesher();
  const n = poly.length;
  // top / bottom fans
  for (const [y, ny] of [
    [h, 1],
    [0, -1]
  ]) {
    const base = m.p.length / 3;
    for (const [x, z] of poly) m.v(x, y, z, 0, ny, 0, x, z);
    for (let i = 1; i < n - 1; i++) (ny > 0 ? m.tri(base, base + i + 1, base + i) : m.tri(base, base + i, base + i + 1));
  }
  // sides
  let u = 0;
  for (let i = 0; i < n; i++) {
    const [x0, z0] = poly[i];
    const [x1, z1] = poly[(i + 1) % n];
    const l = Math.hypot(x1 - x0, z1 - z0) || 1;
    const nx = (z1 - z0) / l;
    const nz = -(x1 - x0) / l;
    const b = m.p.length / 3;
    m.v(x0, 0, z0, nx, 0, nz, u, 0);
    m.v(x1, 0, z1, nx, 0, nz, u + l, 0);
    m.v(x1, h, z1, nx, 0, nz, u + l, h);
    m.v(x0, h, z0, nx, 0, nz, u, h);
    m.quad(b, b + 3, b + 2, b + 1);
    u += l;
  }
  return m.build();
}

// rounded-rectangle outline (x, z), counter-clockwise from +y
export function roundRectPoly(w, d, r, seg = 4) {
  const pts = [];
  const hx = w / 2;
  const hz = d / 2;
  r = Math.min(r, hx, hz);
  const corners = [
    [hx - r, hz - r, 0],
    [hx - r, -hz + r, Math.PI / 2],
    [-hx + r, -hz + r, Math.PI],
    [-hx + r, hz - r, Math.PI * 1.5]
  ];
  for (const [cx, cz, a0] of corners) {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (Math.PI / 2) * (i / seg);
      pts.push([cx + Math.sin(a) * r, cz + Math.cos(a) * r]);
    }
  }
  // the loop above runs clockwise in (x, z) seen from +y; reverse for CCW
  return pts.reverse();
}

export function disc(r, seg = 32) {
  const pts = [];
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    pts.push([Math.sin(a) * r, Math.cos(a) * r]);
  }
  return pts.reverse();
}

// flat horizontal quad (facing +y) centred on the origin
export function plane(w, d) {
  const m = new Mesher();
  const a = m.v(-w / 2, 0, d / 2, 0, 1, 0, 0, 0);
  const b = m.v(w / 2, 0, d / 2, 0, 1, 0, w, 0);
  const c = m.v(w / 2, 0, -d / 2, 0, 1, 0, w, d);
  const e = m.v(-w / 2, 0, -d / 2, 0, 1, 0, 0, d);
  m.quad(a, b, c, e);
  return m.build();
}

// ---------------------------------------------------------------- transforms
const _m = new Matrix4();
const _q = new Quaternion();
const _e = new Euler();
const _s = new Vector3();
const _t = new Vector3();

// move / rotate (Euler xyz radians) / scale a geometry in place; returns it
export function xf(g, { t = [0, 0, 0], r = [0, 0, 0], s = 1 } = {}) {
  _e.set(r[0], r[1], r[2]);
  _q.setFromEuler(_e);
  if (typeof s === 'number') _s.set(s, s, s);
  else _s.set(s[0], s[1], s[2]);
  _t.set(t[0], t[1], t[2]);
  _m.compose(_t, _q, _s);
  g.applyMatrix4(_m);
  return g;
}
export const at = (g, x, y, z) => xf(g, { t: [x, y, z] });

// per-vertex attributes for the miniature materials
export function tint(g, color) {
  const c = new Color(color);
  const n = g.attributes.position.count;
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    a[i * 3] = c.r;
    a[i * 3 + 1] = c.g;
    a[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new Float32BufferAttribute(a, 3));
  return g;
}
export function delay(g, d) {
  const n = g.attributes.position.count;
  g.setAttribute('aDelay', new Float32BufferAttribute(new Float32Array(n).fill(d), 1));
  return g;
}

// merge indexed geometries; missing color / aDelay attributes get defaults
export function merge(list) {
  list = list.filter(Boolean);
  let vcount = 0;
  let icount = 0;
  const hasColor = list.some((g) => g.attributes.color);
  const hasDelay = list.some((g) => g.attributes.aDelay);
  for (const g of list) {
    vcount += g.attributes.position.count;
    icount += g.index ? g.index.count : g.attributes.position.count;
  }
  const pos = new Float32Array(vcount * 3);
  const nrm = new Float32Array(vcount * 3);
  const uv = new Float32Array(vcount * 2);
  const col = hasColor ? new Float32Array(vcount * 3).fill(1) : null;
  const del = hasDelay ? new Float32Array(vcount) : null;
  const idx = vcount > 65535 ? new Uint32Array(icount) : new Uint16Array(icount);
  let vo = 0;
  let io = 0;
  for (const g of list) {
    const n = g.attributes.position.count;
    pos.set(g.attributes.position.array, vo * 3);
    nrm.set(g.attributes.normal.array, vo * 3);
    if (g.attributes.uv) uv.set(g.attributes.uv.array, vo * 2);
    if (col && g.attributes.color) col.set(g.attributes.color.array, vo * 3);
    if (del && g.attributes.aDelay) del.set(g.attributes.aDelay.array, vo);
    if (g.index) {
      const src = g.index.array;
      for (let i = 0; i < src.length; i++) idx[io + i] = src[i] + vo;
      io += src.length;
    } else {
      for (let i = 0; i < n; i++) idx[io + i] = vo + i;
      io += n;
    }
    vo += n;
  }
  const out = new BufferGeometry();
  out.setAttribute('position', new Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new Float32BufferAttribute(nrm, 3));
  out.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  if (col) out.setAttribute('color', new Float32BufferAttribute(col, 3));
  if (del) out.setAttribute('aDelay', new Float32BufferAttribute(del, 1));
  out.setIndex(vcount > 65535 ? new Uint32BufferAttribute(idx, 1) : new Uint16BufferAttribute(idx, 1));
  out.computeBoundingSphere();
  out.computeBoundingBox();
  return out;
}

// Collects parts by material key, then merges each key into one geometry.
export class Parts {
  constructor() {
    this.map = new Map();
  }
  add(key, g, { color = null, d = 0 } = {}) {
    if (color !== null) tint(g, color);
    delay(g, d);
    if (!this.map.has(key)) this.map.set(key, []);
    this.map.get(key).push(g);
    return g;
  }
  merged() {
    const out = {};
    for (const [k, list] of this.map) out[k] = merge(list);
    return out;
  }
}
