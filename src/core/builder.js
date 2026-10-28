import * as THREE from 'three';
import { rng } from './rng.js';

// Geometry builder: architecture, props and terrain features are modelled as
// thousands of small primitives, then merged into one mesh per material
// ("bucket"). Every vertex carries
//   color  – albedo (linear), with per-part jitter
//   aInfo  – vec4(lampGlow, materialKind, flex, ambientOcclusion)
// so a single shared material can render lacquer, plaster, stone and wood,
// with interior lamplight and occlusion baked at build time.

// materialKind drives the solid shader's procedural detail
export const MAT = { plain: 0, wood: 1, plaster: 2, stone: 3, lacquer: 4, brick: 5, boards: 6, paint: 7, gold: 8, cloth: 9 };

const _v = new THREE.Vector3();
const _n = new THREE.Vector3();
const _w = new THREE.Vector3();
const _m3 = new THREE.Matrix3();
const _m4 = new THREE.Matrix4();
const _m4b = new THREE.Matrix4();
const _c = new THREE.Color();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler(0, 0, 0, 'YXZ');
const _s = new THREE.Vector3();
const _p = new THREE.Vector3();
const _info = [0, 0, 1, 0];

// ---------------------------------------------------------------- shared unit primitives
const cache = new Map();
function cached(key, make) {
  let g = cache.get(key);
  if (!g) {
    g = make();
    cache.set(key, g);
  }
  return g;
}
export const unitBox = () =>
  cached('box', () => {
    const g = new THREE.BoxGeometry(1, 1, 1);
    g.translate(0, 0.5, 0); // bottom-anchored
    return g;
  });
export const unitCyl = (seg = 12, ratio = 1, open = false) =>
  cached(`cyl${seg}_${ratio.toFixed(3)}_${open}`, () => {
    const g = new THREE.CylinderGeometry(ratio, 1, 1, seg, 1, open);
    g.translate(0, 0.5, 0);
    return g;
  });
export const unitSphere = (seg = 10) =>
  cached(`sph${seg}`, () => new THREE.SphereGeometry(1, seg, Math.max(4, Math.round(seg * 0.6))));
export const unitCone = (seg = 8) =>
  cached(`cone${seg}`, () => {
    const g = new THREE.ConeGeometry(1, 1, seg, 1);
    g.translate(0, 0.5, 0);
    return g;
  });

// box with bevelled edges: the bevel strips catch the low sun and give every
// beam and slab a crafted edge (cached per size)
export function chamferBox(w, h, d, c) {
  const key = `cb${w.toFixed(3)}_${h.toFixed(3)}_${d.toFixed(3)}_${c.toFixed(3)}`;
  return cached(key, () => {
    c = Math.min(c, w * 0.45, h * 0.45, d * 0.45);
    const X = w / 2;
    const Y = h / 2;
    const Z = d / 2;
    const pos = [];
    const nor = [];
    const uv = [];
    const quad = (a, b, cc, dd, nx, ny, nz) => {
      // a,b,cc,dd counter-clockwise seen from outside
      pos.push(...a, ...b, ...cc, ...a, ...cc, ...dd);
      for (let i = 0; i < 6; i++) nor.push(nx, ny, nz);
      uv.push(0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1);
    };
    const tri = (a, b, cc, nx, ny, nz) => {
      pos.push(...a, ...b, ...cc);
      for (let i = 0; i < 3; i++) nor.push(nx, ny, nz);
      uv.push(0, 0, 1, 0, 0.5, 1);
    };
    // corner points: P(sx,sy,sz, face) where face is the axis the point lies on
    const P = (sx, sy, sz, axis) => {
      const px = axis === 0 ? sx * X : sx * (X - c);
      const py = axis === 1 ? sy * Y : sy * (Y - c);
      const pz = axis === 2 ? sz * Z : sz * (Z - c);
      return [px, py, pz];
    };
    // main faces
    quad(P(1, -1, 1, 0), P(1, -1, -1, 0), P(1, 1, -1, 0), P(1, 1, 1, 0), 1, 0, 0);
    quad(P(-1, -1, -1, 0), P(-1, -1, 1, 0), P(-1, 1, 1, 0), P(-1, 1, -1, 0), -1, 0, 0);
    quad(P(-1, 1, 1, 1), P(1, 1, 1, 1), P(1, 1, -1, 1), P(-1, 1, -1, 1), 0, 1, 0);
    quad(P(-1, -1, -1, 1), P(1, -1, -1, 1), P(1, -1, 1, 1), P(-1, -1, 1, 1), 0, -1, 0);
    quad(P(-1, -1, 1, 2), P(1, -1, 1, 2), P(1, 1, 1, 2), P(-1, 1, 1, 2), 0, 0, 1);
    quad(P(1, -1, -1, 2), P(-1, -1, -1, 2), P(-1, 1, -1, 2), P(1, 1, -1, 2), 0, 0, -1);
    const s = Math.SQRT1_2;
    // edges along z (x/y faces)
    for (const sx of [-1, 1])
      for (const sy of [-1, 1]) {
        const a = P(sx, sy, -1, 0);
        const b = P(sx, sy, 1, 0);
        const cc = P(sx, sy, 1, 1);
        const dd = P(sx, sy, -1, 1);
        if (sx * sy > 0) quad(a, dd, cc, b, sx * s, sy * s, 0);
        else quad(a, b, cc, dd, sx * s, sy * s, 0);
      }
    // edges along x (y/z faces)
    for (const sy of [-1, 1])
      for (const sz of [-1, 1]) {
        const a = P(-1, sy, sz, 1);
        const b = P(1, sy, sz, 1);
        const cc = P(1, sy, sz, 2);
        const dd = P(-1, sy, sz, 2);
        if (sy * sz > 0) quad(a, dd, cc, b, 0, sy * s, sz * s);
        else quad(a, b, cc, dd, 0, sy * s, sz * s);
      }
    // edges along y (x/z faces)
    for (const sx of [-1, 1])
      for (const sz of [-1, 1]) {
        const a = P(sx, -1, sz, 0);
        const b = P(sx, 1, sz, 0);
        const cc = P(sx, 1, sz, 2);
        const dd = P(sx, -1, sz, 2);
        if (sx * sz > 0) quad(a, b, cc, dd, sx * s, 0, sz * s);
        else quad(a, dd, cc, b, sx * s, 0, sz * s);
      }
    // corner triangles
    const k = 1 / Math.sqrt(3);
    for (const sx of [-1, 1])
      for (const sy of [-1, 1])
        for (const sz of [-1, 1]) {
          const a = P(sx, sy, sz, 0);
          const b = P(sx, sy, sz, 1);
          const cc = P(sx, sy, sz, 2);
          if (sx * sy * sz > 0) tri(a, b, cc, sx * k, sy * k, sz * k);
          else tri(a, cc, b, sx * k, sy * k, sz * k);
        }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.translate(0, Y, 0); // bottom-anchored
    return g;
  });
}

// local transform helper: translate, yaw/pitch/roll ('YXZ'), scale
export function mat4(x = 0, y = 0, z = 0, ry = 0, sx = 1, sy = sx, sz = sx, rx = 0, rz = 0, out = new THREE.Matrix4()) {
  _e.set(rx, ry, rz, 'YXZ');
  _q.setFromEuler(_e);
  return out.compose(_p.set(x, y, z), _q, _s.set(sx, sy, sz));
}

// ---------------------------------------------------------------- buckets
class Bucket {
  constructor() {
    this.p = [];
    this.n = [];
    this.uv = [];
    this.c = [];
    this.info = [];
    this.index = [];
    this.count = 0;
  }
}

export class Builder {
  constructor(seed = 1) {
    this.buckets = new Map();
    this.stack = [new THREE.Matrix4()];
    this.rand = rng(seed);
    this.lamps = []; // baked lamplight sources {p: Vector3 (world), r, k}
    this.aoFn = null; // (worldPos, worldNormal) => occlusion factor
    this.instancer = null;
  }

  get frame() {
    return this.stack[this.stack.length - 1];
  }
  push(m) {
    this.stack.push(this.frame.clone().multiply(m));
    return this;
  }
  pushT(x = 0, y = 0, z = 0, ry = 0, s = 1) {
    return this.push(mat4(x, y, z, ry, s, s, s, 0, 0, _m4b));
  }
  pop() {
    if (this.stack.length > 1) this.stack.pop();
    return this;
  }
  // world position of a local point under the current frame
  toWorld(x, y, z, out = new THREE.Vector3()) {
    return out.set(x, y, z).applyMatrix4(this.frame);
  }

  bucket(key) {
    let b = this.buckets.get(key);
    if (!b) {
      b = new Bucket();
      this.buckets.set(key, b);
    }
    return b;
  }

  // Register baked lamplight (in local coordinates of the current frame).
  lamp(x, y, z, radius = 6, strength = 1) {
    this.lamps.push({ p: this.toWorld(x, y, z), r: radius, k: strength });
  }
  clearLamps() {
    this.lamps.length = 0;
  }

  _glowAt(p, n) {
    let g = 0;
    for (const L of this.lamps) {
      const dx = L.p.x - p.x;
      const dy = L.p.y - p.y;
      const dz = L.p.z - p.z;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 > L.r * L.r) continue;
      const d = Math.sqrt(d2) + 1e-4;
      const fall = 1 - d / L.r;
      const facing = 0.35 + 0.65 * Math.max(0, (dx * n.x + dy * n.y + dz * n.z) / d);
      g += L.k * fall * fall * facing;
    }
    return Math.min(g, 2.5);
  }

  // Add any BufferGeometry under the current frame × local matrix.
  // o: { info: [glow, kind, ao, flex] | kind, jitter, uv: (worldPos, i, srcUV)=>[u,v], flexFn, glow:false }
  add(key, geo, local, color, o = {}) {
    const b = this.bucket(key);
    const M = _m4.multiplyMatrices(this.frame, local);
    _m3.getNormalMatrix(M);
    const pos = geo.attributes.position;
    const nor = geo.attributes.normal;
    const uv = geo.attributes.uv;
    const base = b.count;

    if (typeof color === 'number' || typeof color === 'string') _c.set(color);
    else _c.copy(color);
    if (o.jitter) _c.multiplyScalar(1 + (this.rand() - 0.5) * 2 * o.jitter);
    const cr = _c.r;
    const cg = _c.g;
    const cb = _c.b;

    const kind = o.kind !== undefined ? o.kind : 0;
    const baseAO = o.ao !== undefined ? o.ao : 1;
    const flex = o.flex || 0;
    const bake = o.glow !== false && this.lamps.length > 0;
    const extraGlow = o.emit || 0;

    if (import.meta.env && import.meta.env.DEV && !this._nanReported) {
      for (let i = 0; i < Math.min(pos.count, 64); i++) {
        _v.fromBufferAttribute(pos, i).applyMatrix4(M);
        if (Number.isNaN(_v.x + _v.y + _v.z)) {
          this._nanReported = true;
          console.warn('[builder] NaN vertex in bucket', key, new Error().stack.split('\n').slice(1, 6).join(' | '));
          break;
        }
      }
    }
    for (let i = 0; i < pos.count; i++) {
      _v.fromBufferAttribute(pos, i).applyMatrix4(M);
      if (nor) _n.fromBufferAttribute(nor, i).applyMatrix3(_m3).normalize();
      else _n.set(0, 1, 0);
      b.p.push(_v.x, _v.y, _v.z);
      b.n.push(_n.x, _n.y, _n.z);
      if (o.uv) {
        const r = o.uv(_v, i, uv);
        b.uv.push(r[0], r[1]);
      } else if (uv) b.uv.push(uv.getX(i), uv.getY(i));
      else b.uv.push(0, 0);
      b.c.push(cr, cg, cb);
      const glow = (bake ? this._glowAt(_v, _n) : 0) + extraGlow;
      let ao = baseAO;
      if (this.aoFn) ao *= this.aoFn(_v, _n);
      const fl = o.flexFn ? o.flexFn(_w.fromBufferAttribute(pos, i), i) : flex;
      b.info.push(glow, kind, fl, ao);
    }
    if (geo.index) {
      const idx = geo.index.array;
      for (let i = 0; i < idx.length; i++) b.index.push(base + idx[i]);
    } else {
      for (let i = 0; i < pos.count; i++) b.index.push(base + i);
    }
    // keep winding correct for mirrored transforms
    if (M.determinant() < 0) {
      const start = b.index.length - (geo.index ? geo.index.count : pos.count);
      for (let i = start; i < b.index.length; i += 3) {
        const t = b.index[i + 1];
        b.index[i + 1] = b.index[i + 2];
        b.index[i + 2] = t;
      }
    }
    b.count += pos.count;
    return this;
  }

  // raw quad in current-frame coordinates with explicit (shared) normal and uvs
  // p: 4 × [x,y,z]; n: [x,y,z] for all four; uv: 4 × [u,v]
  quad(key, p, n, uv, color, glow = 0, kind = 0, flex = 0, ao = 1) {
    const b = this.bucket(key);
    const M = this.frame;
    _m3.getNormalMatrix(M);
    _c.set(color);
    const base = b.count;
    _n.set(n[0], n[1], n[2]).applyMatrix3(_m3).normalize();
    for (let i = 0; i < 4; i++) {
      _v.set(p[i][0], p[i][1], p[i][2]).applyMatrix4(M);
      b.p.push(_v.x, _v.y, _v.z);
      b.n.push(_n.x, _n.y, _n.z);
      b.uv.push(uv[i][0], uv[i][1]);
      b.c.push(_c.r, _c.g, _c.b);
      b.info.push(glow, kind, typeof flex === 'function' ? flex(_v) : flex, ao);
    }
    b.index.push(base, base + 1, base + 2, base, base + 2, base + 3);
    b.count += 4;
    return this;
  }

  // ------------------------------------------------------------ primitive helpers (y = bottom)
  box(key, color, w, h, d, x = 0, y = 0, z = 0, o = {}) {
    const g = o.chamfer ? chamferBox(w, h, d, o.chamfer) : unitBox();
    const local = o.chamfer
      ? mat4(x, y, z, o.ry || 0, 1, 1, 1, o.rx || 0, o.rz || 0, _m4b)
      : mat4(x, y, z, o.ry || 0, w, h, d, o.rx || 0, o.rz || 0, _m4b);
    return this.add(key, g, local, color, o);
  }
  // cylinder standing on y; o.rTop = top radius (default r), o.seg
  cyl(key, color, r, h, x = 0, y = 0, z = 0, o = {}) {
    const rTop = o.rTop !== undefined ? o.rTop : r;
    const g = unitCyl(o.seg || 12, rTop / r, !!o.open);
    return this.add(key, g, mat4(x, y, z, o.ry || 0, r * (o.sx || 1), h, r * (o.sz || 1), o.rx || 0, o.rz || 0, _m4b), color, o);
  }
  sphere(key, color, r, x = 0, y = 0, z = 0, o = {}) {
    const g = unitSphere(o.seg || 10);
    return this.add(key, g, mat4(x, y, z, o.ry || 0, r * (o.sx || 1), r * (o.sy || 1), r * (o.sz || 1), o.rx || 0, o.rz || 0, _m4b), color, o);
  }
  cone(key, color, r, h, x = 0, y = 0, z = 0, o = {}) {
    const g = unitCone(o.seg || 8);
    return this.add(key, g, mat4(x, y, z, o.ry || 0, r, h, r, o.rx || 0, o.rz || 0, _m4b), color, o);
  }
  // a box spanning p0 → p1 (local coords), cross-section w × h, h along `up`
  beam(key, color, x0, y0, z0, x1, y1, z1, w, h, o = {}) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const dz = z1 - z0;
    const len = Math.hypot(dx, dy, dz);
    const yaw = Math.atan2(dx, dz);
    const pitch = -Math.atan2(dy, Math.hypot(dx, dz));
    _e.set(pitch, yaw, o.roll || 0, 'YXZ');
    _q.setFromEuler(_e);
    const g = o.chamfer ? chamferBox(w, h, len, o.chamfer) : unitBox();
    // unit box is bottom-anchored: centre it on the axis
    const pre = o.chamfer ? new THREE.Matrix4().makeTranslation(0, -h / 2, 0) : new THREE.Matrix4().makeTranslation(0, -0.5, 0);
    const scl = o.chamfer ? _s.set(1, 1, 1) : _s.set(w, h, len);
    const local = new THREE.Matrix4().compose(_p.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), _q, scl).multiply(pre);
    return this.add(key, g, local, color, o);
  }
  // round rod between two points
  rod(key, color, x0, y0, z0, x1, y1, z1, r, o = {}) {
    const a = new THREE.Vector3(x0, y0, z0);
    const b = new THREE.Vector3(x1, y1, z1);
    const dir = b.clone().sub(a);
    const len = dir.length();
    _q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    const g = unitCyl(o.seg || 6, (o.rTop !== undefined ? o.rTop : r) / r, true);
    const local = new THREE.Matrix4().compose(a, _q, _s.set(r, len, r));
    return this.add(key, g, local, color, o);
  }

  // ------------------------------------------------------------ instancing
  inst(key, x, y, z, ry = 0, s = 1, color = null, sy = s, rx = 0, rz = 0) {
    const m = new THREE.Matrix4().multiplyMatrices(this.frame, mat4(x, y, z, ry, s, sy, s, rx, rz, _m4b));
    this.instancer.add(key, m, color);
    return this;
  }
  instM(key, local, color = null) {
    this.instancer.add(key, new THREE.Matrix4().multiplyMatrices(this.frame, local), color);
    return this;
  }

  // ------------------------------------------------------------ output
  // materials: { key: { material, cast, receive, layers: [..], order } }
  build(materials, name = 'built') {
    const group = new THREE.Group();
    group.name = name;
    for (const [key, b] of this.buckets) {
      if (!b.count) continue;
      const spec = materials[key];
      if (!spec) {
        console.warn(`[builder] no material for bucket "${key}"`);
        continue;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(b.p, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(b.n, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(b.uv, 2));
      g.setAttribute('color', new THREE.Float32BufferAttribute(b.c, 3));
      g.setAttribute('aInfo', new THREE.Float32BufferAttribute(b.info, 4));
      g.setIndex(b.count > 65535 ? new THREE.Uint32BufferAttribute(b.index, 1) : new THREE.Uint16BufferAttribute(b.index, 1));
      g.computeBoundingSphere();
      g.computeBoundingBox();
      const mesh = new THREE.Mesh(g, spec.material);
      mesh.name = `${name}:${key}`;
      mesh.castShadow = spec.cast !== false;
      mesh.receiveShadow = spec.receive !== false;
      if (spec.order !== undefined) mesh.renderOrder = spec.order;
      if (spec.layers) for (const l of spec.layers) mesh.layers.enable(l);
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      group.add(mesh);
    }
    this.buckets.clear();
    return group;
  }

  // merged geometry of one bucket (for instancing); clears that bucket
  toGeometry(key) {
    const b = this.buckets.get(key);
    if (!b || !b.count) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(b.p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(b.n, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(b.uv, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(b.c, 3));
    g.setAttribute('aInfo', new THREE.Float32BufferAttribute(b.info, 4));
    g.setIndex(b.count > 65535 ? new THREE.Uint32BufferAttribute(b.index, 1) : new THREE.Uint16BufferAttribute(b.index, 1));
    g.computeBoundingSphere();
    this.buckets.delete(key);
    return g;
  }

  stats() {
    let v = 0;
    let t = 0;
    for (const b of this.buckets.values()) {
      v += b.count;
      t += b.index.length / 3;
    }
    return { vertices: v, triangles: t };
  }
}

// ---------------------------------------------------------------- instancer
// Collects transforms for shared geometry and emits one InstancedMesh per key.
export class Instancer {
  constructor() {
    this.defs = new Map();
  }
  define(key, geometry, material, opts = {}) {
    this.defs.set(key, { geometry, material, opts, matrices: [], colors: [] });
  }
  has(key) {
    return this.defs.has(key);
  }
  add(key, matrix, color = null) {
    const d = this.defs.get(key);
    if (!d) {
      console.warn(`[instancer] unknown key "${key}"`);
      return;
    }
    d.matrices.push(matrix);
    d.colors.push(color);
  }
  count(key) {
    const d = this.defs.get(key);
    return d ? d.matrices.length : 0;
  }
  build() {
    const group = new THREE.Group();
    group.name = 'instances';
    const out = {};
    const col = new THREE.Color();
    for (const [key, d] of this.defs) {
      if (!d.matrices.length) continue;
      const mesh = new THREE.InstancedMesh(d.geometry, d.material, d.matrices.length);
      mesh.name = `inst:${key}`;
      const anyColor = d.colors.some((c) => c !== null);
      d.matrices.forEach((m, i) => {
        mesh.setMatrixAt(i, m);
        if (anyColor) {
          const c = d.colors[i];
          if (c === null) col.setRGB(1, 1, 1);
          else if (typeof c === 'number') col.set(c);
          else col.copy(c);
          mesh.setColorAt(i, col);
        }
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.castShadow = d.opts.cast !== false;
      mesh.receiveShadow = d.opts.receive !== false;
      if (d.opts.layers) for (const l of d.opts.layers) mesh.layers.enable(l);
      if (d.opts.order !== undefined) mesh.renderOrder = d.opts.order;
      mesh.computeBoundingSphere();
      group.add(mesh);
      out[key] = mesh;
    }
    return { group, meshes: out };
  }
}
