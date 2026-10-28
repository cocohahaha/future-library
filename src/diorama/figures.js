import { Group, Mesh, BufferGeometry, BufferAttribute, Float32BufferAttribute, BoxGeometry, CylinderGeometry, MeshStandardMaterial, Color, Matrix4, Vector3, Euler, Quaternion } from 'three';

// People for the miniatures, in metres: feet on y = 0, facing +z. A sitting
// figure's origin is the floor point under its hip joints, with the seat at
// opts.seat (0.45 m) and the thighs pointing +z.
//
// Every part is a loft of elliptical rings whose front and back depths
// differ (chest, seat and calves get their profile) or a deformed sphere
// (head, hair, hands, shoes). Parts are vertex-coloured and merged per joint,
// so a figure is about a dozen meshes sharing one material. Poses are joint
// rotations; userData.tick(t) breathes, sways and glances.

let MAT;
const material = () => MAT || (MAT = new MeshStandardMaterial({ vertexColors: true, roughness: 0.74, metalness: 0 }));
const sstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// ---------------------------------------------------------------- geometry
// closed surface of (m + 1) rings × n segments; f(i, angle, out) places a vertex
function surf(m, n, f) {
  const pos = new Float32Array((m + 1) * n * 3);
  const v = new Vector3();
  for (let i = 0; i <= m; i++)
    for (let j = 0; j < n; j++) {
      f(i, (j / n) * Math.PI * 2, v);
      v.toArray(pos, (i * n + j) * 3);
    }
  const idx = [];
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) {
      const a = i * n + j;
      const b = i * n + ((j + 1) % n);
      idx.push(a, a + n, b, b, a + n, b + n);
    }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// rings [y, rx, front depth, back depth, z offset], ascending y; r = 0 closes
const loft = (R, n = 14) =>
  surf(R.length - 1, n, (i, a, v) => {
    const r = R[i];
    const s = Math.sin(a);
    v.set(Math.cos(a) * r[1], r[0], (r[4] || 0) + s * (s > 0 ? r[2] ?? r[1] : r[3] ?? r[2] ?? r[1]));
  });
const sc = (R, kx, kz = kx) => R.map(([y, x, f, b, c]) => [y, x * kx, (f ?? x) * kz, (b ?? f ?? x) * kz, (c || 0) * kz]);

// ellipsoid, or any sphere-like shape via warp(unit direction → position)
const ell = (rx, ry, rz, m = 8, n = 12, warp) =>
  surf(m, n, (i, a, v) => {
    const p = Math.PI * (1 - i / m);
    v.set(Math.sin(p) * Math.cos(a), Math.cos(p), Math.sin(p) * Math.sin(a));
    if (warp) warp(v);
    else v.set(v.x * rx, v.y * ry, v.z * rz);
  });

const _m = new Matrix4();
const _q = new Quaternion();
const _e = new Euler();
const _v = new Vector3();
const _one = new Vector3(1, 1, 1);
const xf = (g, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => g.applyMatrix4(_m.compose(_v.set(x, y, z), _q.setFromEuler(_e.set(rx, ry, rz)), _one));

// [[geometry, hex | (x, y, z) => hex]] → one indexed, vertex-coloured geometry
function merge(parts) {
  let nv = 0;
  let ni = 0;
  for (const [g] of parts) {
    nv += g.attributes.position.count;
    ni += g.index.count;
  }
  const pos = new Float32Array(nv * 3);
  const nrm = new Float32Array(nv * 3);
  const col = new Float32Array(nv * 3);
  const idx = new (nv > 65535 ? Uint32Array : Uint16Array)(ni);
  const c = new Color();
  let ov = 0;
  let oi = 0;
  for (const [g, hex] of parts) {
    const p = g.attributes.position.array;
    const n = g.attributes.position.count;
    pos.set(p, ov * 3);
    nrm.set(g.attributes.normal.array, ov * 3);
    if (typeof hex !== 'function') c.setHex(hex);
    for (let k = 0; k < n; k++) {
      if (typeof hex === 'function') c.setHex(hex(p[k * 3], p[k * 3 + 1], p[k * 3 + 2]));
      c.toArray(col, (ov + k) * 3);
    }
    const gi = g.index.array;
    for (let k = 0; k < gi.length; k++) idx[oi + k] = gi[k] + ov;
    ov += n;
    oi += gi.length;
    g.dispose();
  }
  const out = new BufferGeometry();
  out.setAttribute('position', new Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new Float32BufferAttribute(nrm, 3));
  out.setAttribute('color', new Float32BufferAttribute(col, 3));
  out.setIndex(new BufferAttribute(idx, 1));
  return out;
}

// ---------------------------------------------------------------- head + hair
// unit direction → head surface (head-local, centre of the cranium at 0)
function headWarp(v) {
  const u = v.x;
  const y = v.y;
  const t = v.z;
  const lo = Math.max(0, -y);
  const x = u * 0.073 * (1 - 0.3 * lo * lo); // jaw narrows to the chin
  let z = t * 0.093;
  if (t < 0) z *= (1 + 0.06 * sstep(-0.45, -0.05, y)) * (1 - 0.38 * sstep(0.3, 0.9, lo)); // occiput, nape
  else {
    z *= 1 - 0.03 * sstep(0.1, 0.4, y); // flatter brow
    z += t * (0.02 * Math.exp(-(u * u) / 0.01 - (y + 0.2) ** 2 / 0.018)); // nose
    z += t * t * t * 0.005 * Math.exp(-((y - 0.14) ** 2) / 0.004); // brow ridge
    z -= t * 0.006 * Math.exp(-((Math.abs(u) - 0.36) ** 2) / 0.012 - (y - 0.03) ** 2 / 0.008); // eye sockets
  }
  z += 0.034 * sstep(0.5, 1, lo); // chin forward, jaw line back to the neck
  v.set(x, y * 0.113, z - 0.004);
}

// the hair shell follows the head; below the hairline it tucks inside
function hairWarp(style) {
  return (v) => {
    const u = v.x;
    const y = v.y;
    const t = v.z;
    const face = sstep(0.2, 0.55, t) * (1 - sstep(0.55, 0.85, Math.abs(u)));
    let h;
    let s = 1.062;
    if (style === 'bob' || style === 'long') {
      h = (style === 'bob' ? -0.75 : -1.2) * (1 - face) + 0.32 * face;
      s = (style === 'bob' ? 1.1 : 1.085) + 0.09 * sstep(0, -0.75, y);
    } else if (style === 'bun') h = 0.05 + (t > 0 ? 0.33 : 0.6) * t;
    else if (style === 'curly') {
      h = t > 0 ? 0.12 + 0.26 * t : 0.1 + 0.6 * t;
      s = 1.13 + 0.045 * Math.sin(17 * u + 3) * Math.sin(15 * y + 1) * Math.sin(13 * t + 2);
    } else h = t > 0 ? 0.1 + 0.3 * t : 0.1 + 0.68 * t;
    let wgt = sstep(h - 0.07, h + 0.07, y);
    wgt *= 1 - sstep(-0.45, -0.7, y) * sstep(-0.45, -0.15, t); // never under the jaw
    headWarp(v);
    v.multiplyScalar(0.86 + (s - 0.86) * wgt);
  };
}

// ---------------------------------------------------------------- props
const PAPER = 0xf1ebdd;
function propParts(kind, open, bookC) {
  if (kind === 'book' && open)
    return [
      [xf(new BoxGeometry(0.3, 0.004, 0.215), 0, -0.004, 0), bookC],
      [xf(new BoxGeometry(0.142, 0.012, 0.205), -0.073, 0.005, 0, 0, 0, 0.1), PAPER],
      [xf(new BoxGeometry(0.142, 0.012, 0.205), 0.073, 0.005, 0, 0, 0, -0.1), PAPER]
    ];
  if (kind === 'book') return [[new BoxGeometry(0.16, 0.03, 0.23), bookC], [xf(new BoxGeometry(0.15, 0.024, 0.222), 0.007, 0, 0), PAPER]];
  if (kind === 'tablet') return [[new BoxGeometry(0.17, 0.008, 0.24), 0x2c2e33], [xf(new BoxGeometry(0.152, 0.002, 0.222), 0, 0.0045, 0), 0xa9bccb]];
  if (kind === 'cup') return [[new CylinderGeometry(0.038, 0.032, 0.1, 12), 0xf0ece4], [xf(new CylinderGeometry(0.034, 0.034, 0.004, 12), 0, 0.047, 0), 0x4a3528]];
  if (kind === 'bag')
    return [
      [new BoxGeometry(0.09, 0.34, 0.3), 0xcdb995],
      [xf(new BoxGeometry(0.014, 0.2, 0.014), 0, 0.24, -0.07, -0.45, 0, 0), 0xb6a07a],
      [xf(new BoxGeometry(0.014, 0.2, 0.014), 0, 0.24, 0.07, 0.45, 0, 0), 0xb6a07a]
    ];
  return [];
}

// ---------------------------------------------------------------- figure
export function makeFigure(o = {}) {
  const pose = o.pose || 'stand';
  const sit = pose === 'sit' || pose === 'read' || pose === 'sitTalk';
  const k = (o.height || 1.72) / 1.72;
  const b = o.build ?? 0.5;
  const style = o.topStyle || 'shirt';
  const dress = style === 'dress';
  const fem = o.shape ?? (dress ? 0.8 : 0.3);
  const w = 0.9 + 0.2 * b; // girth
  const sw = w * (1.05 - 0.12 * fem); // shoulders
  const hw = w * (0.95 + 0.09 * fem); // hips
  const skin = o.skin ?? 0xc8a07e;
  const hair = o.hair ?? 0x3b2b22;
  const top = o.top ?? 0x56708a;
  const bot = o.bottom ?? 0x33373e;
  const shoe = o.shoes ?? 0x2b2623;
  const sole = new Color(shoe).getHSL({}).l > 0.35 ? 0x3a3530 : 0xd9d3c7;
  let sd = (Math.abs(Math.floor(o.seed ?? 1)) * 7919 + 104729) % 2147483647;
  const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;

  // joints (standard 1.72 m body, scaled as a whole)
  const root = new Group();
  root.name = 'figure';
  const body = new Group();
  body.scale.setScalar(k);
  root.add(body);
  const J = {};
  const P = {};
  const joint = (n, parent, x, y, z) => {
    const g = new Group();
    g.position.set(x, y, z);
    (parent.isObject3D ? parent : J[parent]).add(g);
    J[n] = g;
    P[n] = [];
  };
  joint('pelvis', body, 0, 0.88, 0);
  joint('spine', 'pelvis', 0, 0.14, 0);
  joint('neck', 'spine', 0, 0.425, 0.004);
  joint('head', 'neck', 0, 0.155, 0.014);
  for (const s of [1, -1]) {
    const n = s > 0 ? 'L' : 'R';
    joint('sh' + n, 'spine', s * 0.18 * sw, 0.362, -0.012);
    joint('el' + n, 'sh' + n, 0, -0.3, 0);
    joint('wr' + n, 'el' + n, 0, -0.25, 0);
    joint('hip' + n, 'pelvis', s * 0.087 * hw, 0, 0);
    joint('kn' + n, 'hip' + n, 0, -0.41, 0);
    joint('an' + n, 'kn' + n, 0, -0.4, 0);
  }

  // ---- pelvis: seat and hips (trousers, or the dress), belt, skirt, coat hem
  P.pelvis.push([loft(sc([[-0.105, 0], [-0.1, 0.075, 0.05, 0.065], [-0.065, 0.138, 0.08, 0.1], [0, 0.158, 0.088, 0.106], [0.07, 0.15, 0.087, 0.094], [0.14, 0.138, 0.085, 0.083], [0.205, 0.134, 0.084, 0.08], [0.215, 0]], hw, w)), dress ? top : bot]);
  if (style === 'shirt') P.pelvis.push([loft(sc([[0.18, 0], [0.18, 0.141, 0.089, 0.085], [0.212, 0.139, 0.088, 0.084], [0.212, 0]], hw, w)), 0x2e2621]);
  if (dress && !sit) P.pelvis.push([loft(sc([[-0.47, 0], [-0.47, 0.2, 0.17, 0.19], [-0.3, 0.188, 0.152, 0.172], [-0.14, 0.18, 0.126, 0.142], [-0.02, 0.172, 0.1, 0.116], [0.04, 0.162, 0.095, 0.108], [0.1, 0]], hw, w), 16), top]);
  if (style === 'coat')
    P.pelvis.push([
      loft(sc(sit ? [[-0.03, 0], [-0.03, 0.172, 0.104, 0.12], [0.06, 0.162, 0.097, 0.108], [0.12, 0]] : [[-0.25, 0], [-0.25, 0.19, 0.13, 0.15], [-0.12, 0.186, 0.118, 0.135], [0, 0.178, 0.104, 0.118], [0.06, 0.166, 0.098, 0.108], [0.12, 0]], hw, w), 16),
      top
    ]);

  // ---- torso (spine-local): hem or tuck, waist, ribs, chest, shoulders
  const low = style === 'shirt' ? [[0.055, 0], [0.055, 0.136, 0.087, 0.083], [0.09, 0.135, 0.087, 0.082]] : dress ? [[-0.02, 0], [-0.02, 0.146, 0.09, 0.088], [0.09, 0.139, 0.089, 0.085]] : [[-0.07, 0], [-0.07, 0.162, 0.102, 0.104], [-0.03, 0.158, 0.098, 0.1], [0.03, 0.148, 0.093, 0.09], [0.1, 0.141, 0.09, 0.086]];
  const upper = [[0.17, 0.147, 0.097, 0.086], [0.26, 0.158, 0.11 + 0.018 * fem, 0.09], [0.32, 0.166, 0.104 + 0.01 * fem, 0.09], [0.362, 0.17, 0.084, 0.082], [0.392, 0.148, 0.07, 0.072], [0.414, 0.094, 0.056, 0.06], [0.432, 0.058, 0.046, 0.05], [0.44, 0]];
  const pad = style === 'coat' ? 1.05 : style === 'sweater' ? 1.025 : 1;
  const torso = low.concat(upper).map(([y, x, f, bk]) => {
    const kx = (hw + (sw - hw) * sstep(0.1, 0.36, y)) * pad;
    return [y, x * kx, (f ?? x) * w * pad, (bk ?? f ?? x) * w * pad];
  });
  const inner = o.inner ?? 0xe8e3d8;
  const torsoCol =
    style === 'coat' ? (x, y, z) => (z > 0 && y > 0.26 && Math.abs(x) < (0.09 * (y - 0.26)) / 0.18 ? inner : top) : dress ? (x, y) => (y > 0.405 ? skin : top) : top;
  P.spine.push([loft(torso, 16), torsoCol]);
  if (style === 'shirt') P.spine.push([loft(sc([[0.39, 0], [0.39, 0.068, 0.06, 0.064], [0.428, 0.062, 0.056, 0.06], [0.45, 0.057, 0.054, 0.057], [0.45, 0]], w)), top]);
  else if (style === 'sweater') P.spine.push([loft(sc([[0.4, 0], [0.4, 0.066, 0.058, 0.062], [0.442, 0.056, 0.05, 0.055], [0.442, 0]], w)), top]);
  else if (style === 'coat') P.spine.push([loft(sc([[0.38, 0], [0.38, 0.086, 0.07, 0.076], [0.43, 0.076, 0.062, 0.07], [0.462, 0.07, 0.058, 0.068], [0.462, 0]], w)), top]);

  // ---- neck and head
  P.neck.push([loft(sc([[-0.03, 0], [-0.03, 0.05, 0.047, 0.05], [0.03, 0.046, 0.044, 0.048], [0.1, 0.043, 0.041, 0.046], [0.11, 0]], w * (1 - 0.12 * fem)), 12), skin]);
  P.head.push([ell(0, 0, 0, 14, 18, headWarp), skin]);
  for (const s of [1, -1]) P.head.push([xf(ell(0.011, 0.027, 0.019, 6, 8), s * 0.071, -0.012, -0.01, 0, s * 0.25, s * 0.1), skin]);
  const hs = o.hairStyle || 'short';
  if (hs !== 'bald') {
    P.head.push([ell(0, 0, 0, 16, 20, hairWarp(hs)), hair]);
    if (hs === 'bun') P.head.push([xf(ell(0.042, 0.04, 0.038, 6, 10), 0, 0.06, -0.1), hair]);
    if (hs === 'long') P.head.push([loft([[-0.36, 0, 0, 0, -0.12], [-0.355, 0.075, 0.012, 0.02, -0.115], [-0.25, 0.085, 0.015, 0.025, -0.105], [-0.12, 0.085, 0.02, 0.03, -0.09], [0, 0.08, 0.03, 0.035, -0.07], [0.04, 0, 0, 0, -0.06]], 12), hair]);
  }

  // ---- arms and legs
  const fullSleeve = style === 'sweater' || style === 'coat';
  const sl = style === 'coat' ? 1.16 : 1.08;
  for (const s of [1, -1]) {
    const n = s > 0 ? 'L' : 'R';
    const UA = [[-0.34, 0], [-0.325, 0.026], [-0.3, 0.037], [-0.27, 0.04], [-0.17, 0.045, 0.048, 0.044], [-0.06, 0.048, 0.05, 0.046], [0, 0.047], [0.025, 0.034], [0.04, 0]];
    P['sh' + n].push([loft(sc(UA, w * (dress ? 0.92 : sl))), dress ? skin : top]);
    if (dress) P['sh' + n].push([loft(sc([[-0.13, 0], [-0.13, 0.05], [0, 0.056], [0.04, 0.042], [0.058, 0]], w)), top]);
    const FA = [[-0.255, 0], [-0.25, 0.025], [-0.22, 0.027], [-0.12, 0.034, 0.036, 0.033], [-0.04, 0.039], [0, 0.037], [0.025, 0.028], [0.04, 0]];
    P['el' + n].push([loft(sc(FA, w * (fullSleeve ? 1 : 0.95))), skin]);
    if (fullSleeve) P['el' + n].push([loft(sc([[-0.235, 0], [-0.235, 0.034], [-0.2, 0.035], [-0.1, 0.041], [0, 0.045], [0.04, 0]], (w * sl) / 1.08)), top]);
    else if (style === 'shirt') P['el' + n].push([loft(sc([[-0.07, 0], [-0.07, 0.044], [-0.03, 0.047], [0.01, 0.046], [0.03, 0]], w)), top]); // rolled cuff
    // hand: palm and fingers as one flattened mitten, thumb to the front
    P['wr' + n].push([xf(ell(0.014, 0.088, 0.04, 8, 10), 0, -0.084, 0.004), skin]);
    P['wr' + n].push([xf(ell(0.011, 0.031, 0.012, 5, 8), -s * 0.01, -0.044, 0.032, 0.55, 0, 0), skin]);

    const TH = [[-0.47, 0], [-0.455, 0.035], [-0.43, 0.05], [-0.38, 0.055], [-0.26, 0.067, 0.07, 0.065], [-0.13, 0.079, 0.082, 0.079], [-0.02, 0.085], [0.03, 0.07], [0.06, 0]];
    P['hip' + n].push([loft(sc(TH, hw * (dress && !sit ? 0.8 : 1), w)), dress && sit ? top : bot]);
    const SH = dress
      ? [[-0.405, 0], [-0.4, 0.029], [-0.34, 0.031], [-0.2, 0.044, 0.042, 0.052], [-0.08, 0.047], [0, 0.046], [0.03, 0.035], [0.05, 0]]
      : [[-0.405, 0], [-0.4, 0.047], [-0.3, 0.049], [-0.18, 0.054, 0.052, 0.058], [-0.06, 0.055], [0, 0.052], [0.03, 0.04], [0.05, 0]];
    P['kn' + n].push([loft(sc(SH, w)), bot]);
    // shoe: a flat-soled last, toe forward and a little lower than the heel
    const sh = ell(0, 0, 0, 8, 12, (v) => v.set(v.x * 0.042 * (1 - 0.15 * Math.max(0, v.z)), Math.max(-0.07, v.y * 0.065 - 0.02 - 0.012 * Math.max(0, v.z)), v.z * 0.128 + 0.048));
    P['an' + n].push([sh, (x, y) => (y < -0.064 ? sole : shoe)]);
  }

  // ---- pose
  const R = { shL: [0.03, 0, 0.1], shR: [0.02, 0, -0.1], elL: [-0.16], elR: [-0.13], wrL: [-0.05], wrR: [-0.05], head: [0.02, (rnd() - 0.5) * 0.2, 0] };
  const set = (x) => Object.assign(R, x);
  if (sit) set({ spine: [-0.05], neck: [0.08], shL: [-0.32, 0, 0.1], elL: [-0.6], wrL: [-0.5], shR: [-0.32, 0, -0.1], elR: [-0.6], wrR: [-0.5] });
  if (pose === 'stand') set({ pelvis: [0, 0, 0.02], spine: [0, 0, -0.015], hipR: [-0.04, 0, -0.015], knR: [0.07] });
  else if (pose === 'walk') set({ pelvis: [0, 0.06, 0], spine: [0.05, -0.06, 0], hipL: [-0.36], knL: [0.08], hipR: [0.26], knR: [0.42], shL: [0.22, 0, 0.08], elL: [-0.12], shR: [-0.26, 0, -0.08], elR: [-0.3] });
  else if (pose === 'read') set({ spine: [0.1], neck: [0.32], head: [0.18, 0, 0], shL: [-0.5, 0, 0.04], elL: [-1.0, -0.32, 0], wrL: [-0.35], shR: [-0.5, 0, -0.04], elR: [-1.0, 0.32, 0], wrR: [-0.35] });
  else if (pose === 'sitTalk') set({ spine: [-0.06, 0.1, 0], head: [0, 0.3, 0], shR: [-0.55, 0, -0.1], elR: [-1.3, 0.4, 0], wrR: [-0.3, 0, 0.25] });
  else if (pose === 'talk') set({ pelvis: [0, 0, 0.02], hipR: [-0.04], knR: [0.06], head: [0, 0.25, 0.04], shR: [-0.32, 0, -0.14], elR: [-1.35, 0.3, 0], wrR: [-0.25, 0, 0.2] });
  else if (pose === 'lean')
    set({ pelvis: [0, 0, 0.05], spine: [0.06, 0, -0.07], hipL: [0, 0, 0.02], hipR: [-0.1, 0, -0.03], knR: [0.2], neck: [0.22], head: [0.18, 0, 0], shL: [-0.32, 0, 0.06], elL: [-1.2, -0.42, 0], wrL: [-0.25], shR: [-0.32, 0, -0.06], elR: [-1.2, 0.42, 0], wrR: [-0.25] });
  else if (pose === 'reach') set({ spine: [-0.06], neck: [-0.1], head: [-0.32, 0, 0], shR: [-2.7, 0, -0.12], elR: [-0.22], wrR: [-0.1] });
  const prop = o.prop ?? (pose === 'lean' ? 'tablet' : pose === 'read' ? 'book' : null);
  const twoHand = pose === 'read' || pose === 'lean';
  if (prop === 'cup' && !twoHand) set({ elL: [-1.5, -0.2, 0], wrL: [-0.1] });
  if (sit) {
    // thighs forward (sloping a little to the knee), shins solved to reach the floor
    const py = (J.pelvis.position.y = (o.seat ?? 0.45) / k + 0.085);
    const d = Math.min(0.45, Math.max(0.06, Math.asin(Math.min(1, Math.max(-1, (py - 0.46) / 0.41)))));
    const a = -(Math.PI / 2 - d);
    const ky = py - 0.41 * Math.sin(d);
    const A = -Math.acos(Math.min(1, (ky - 0.07) / 0.4));
    set({ hipL: [a, 0, 0.05], hipR: [a, 0, -0.05], knL: [A - a], knR: [A - a] });
  }
  for (const n of ['L', 'R']) {
    const hr = R['hip' + n] || [0];
    const kr = R['kn' + n] || [0];
    // feet flat; the trailing foot of a stride is on its toes
    R['an' + n] = [-((hr[0] || 0) + (kr[0] || 0)) + (pose === 'walk' && n === 'R' ? 0.3 : 0)];
  }
  for (const n in R) J[n].rotation.set(R[n][0] || 0, R[n][1] || 0, R[n][2] || 0);

  body.updateMatrixWorld(true);
  const inv = new Matrix4().copy(body.matrixWorld).invert();
  const rel = (n) => new Matrix4().multiplyMatrices(inv, J[n].matrixWorld);
  if (!sit) {
    // plant the lowest sole on the floor
    let lo = Infinity;
    for (const n of ['anL', 'anR']) {
      const m = rel(n);
      for (const z of [-0.08, 0.17]) lo = Math.min(lo, _v.set(0, -0.07, z).applyMatrix4(m).y);
    }
    J.pelvis.position.y -= lo;
    body.updateMatrixWorld(true);
  }

  // ---- props, placed in body space and baked into the holding joint
  if (prop) {
    const bookC = [0x9a3b2c, 0x2f4f6f, 0x3f6b4a, 0xc49a3a, 0x6b4c7a][Math.floor(rnd() * 5)];
    const hand = (n) => _v.set(0, -0.085, 0.004).applyMatrix4(rel(n)).clone();
    const M = new Matrix4();
    let at;
    if (twoHand) {
      // held in both hands, tilted toward the face
      at = 'spine';
      const c = hand('wrL').add(hand('wrR')).multiplyScalar(0.5);
      c.y += 0.012;
      M.compose(c, _q.setFromEuler(_e.set(pose === 'read' ? -0.62 : -0.95, 0, 0)), _one);
    } else {
      at = pose === 'reach' && prop === 'book' ? 'wrR' : 'wrL';
      const c = hand(at);
      const s = at === 'wrL' ? 1 : -1;
      if (prop === 'cup') M.compose(c.add(_v.set(0, 0.03, 0.01)), _q.identity(), _one);
      else if (prop === 'bag') M.compose(c.add(_v.set(s * 0.04, -0.2, 0)), _q.identity(), _one);
      else {
        // upright at the side (or on the raised hand), pinched near its top edge
        M.makeBasis(_v.set(0, 0, 1), new Vector3(1, 0, 0), new Vector3(0, 1, 0));
        M.setPosition(c.add(_v.set(s * 0.004, pose === 'reach' ? 0.07 : -0.07, 0)));
      }
    }
    const L = new Matrix4().copy(rel(at)).invert().multiply(M);
    for (const [g, col] of propParts(prop, pose === 'read', bookC)) P[at].push([g.applyMatrix4(L), col]);
  }

  // wrists and ankles don't move after posing: bake them into their parents
  for (const n of ['L', 'R'])
    for (const [c, p] of [
      ['wr' + n, 'el' + n],
      ['an' + n, 'kn' + n]
    ]) {
      J[c].updateMatrix();
      for (const [g, col] of P[c]) P[p].push([g.applyMatrix4(J[c].matrix), col]);
      P[c] = [];
    }
  const meshes = {};
  for (const n in P)
    if (P[n].length) {
      const mesh = new Mesh(merge(P[n]), material());
      mesh.castShadow = mesh.receiveShadow = true;
      J[n].add(mesh);
      meshes[n] = mesh;
    }

  // ---- idle: breath, a slow sway, glances; readers look up now and then
  const base = {};
  for (const n in J) base[n] = J[n].rotation.clone();
  const ph = rnd() * 20;
  const chest = meshes.spine;
  root.userData.tick = (time) => {
    const t = time + ph;
    const br = Math.sin(t * 1.45);
    chest.scale.set(1 + 0.008 * br, 1, 1 + 0.014 * br);
    J.head.rotation.y = base.head.y + 0.2 * Math.sin(t * 0.21) * Math.sin(t * 0.13 + 1.3);
    if (!sit) {
      J.pelvis.rotation.z = base.pelvis.z + 0.012 * Math.sin(t * 0.7);
      J.spine.rotation.z = base.spine.z - 0.01 * Math.sin(t * 0.7);
    } else J.spine.rotation.x = base.spine.x + 0.012 * br;
    if (pose === 'read') J.neck.rotation.x = base.neck.x - 0.28 * Math.pow(Math.max(0, Math.sin(t * 0.27)), 8);
    else if (pose === 'talk' || pose === 'sitTalk') {
      J.elR.rotation.x = base.elR.x + 0.13 * Math.sin(t * 1.9) + 0.05 * Math.sin(t * 3.3);
      J.shR.rotation.z = base.shR.z - 0.04 * Math.sin(t * 1.1);
    } else if (pose === 'reach') J.shR.rotation.z = base.shR.z + 0.05 * Math.sin(t * 0.9);
    else if (pose === 'lean') J.neck.rotation.x = base.neck.x + 0.06 * Math.sin(t * 0.5);
  };
  root.userData.joints = J;
  root.rotation.y = o.facing || 0;
  return root;
}
