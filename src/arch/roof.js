import * as THREE from 'three';
import { sweep, extrude } from '../core/geom.js';
import { MAT, mat4 } from '../core/builder.js';
import { PAL } from '../core/config.js';

// Chinese roof generator. Faces are parametric patches between an eave edge
// and a top edge: the slope follows a concave profile (steep near the ridge,
// flat at the eave, 举折), and the eave lifts and flares out toward each
// corner (翼角起翘). Tiles are drawn by the roof shader from uv = metres along
// the eave / up the slope, so courses run parallel and are cut by the hips.
//
// Local frame: ridge along X, eave rectangle ±hx × ±hz, eave line at y.
//
// types:  'xieshan'  hip-and-gable (歇山)   'hip' (庑殿)   'gable' (悬山)
//         'pyramid'  n-sided (攒尖)          'skirt' pent roof around an upper storey (腰檐)

const P = (v, a = 0.36, k = 2.35) => a * v + (1 - a) * Math.pow(v, k);

function cornerW(s, halfLen, Lc) {
  const d = Math.abs(2 * s - 1) * halfLen;
  const t = Math.min(1, Math.max(0, (d - (halfLen - Lc)) / Lc));
  return t * t;
}

const _a = new THREE.Vector2();

// Emit one parametric face into the roof bucket. Returns a sampler for points on it.
function face(B, f, R) {
  const { nu, nv, v0, v1 } = f;
  const pos = [];
  const uv = [];
  const idx = [];
  const sample = (s, v, out = new THREE.Vector3()) => {
    const ex = f.E0.x + (f.E1.x - f.E0.x) * s;
    const ez = f.E0.y + (f.E1.y - f.E0.y) * s;
    const tx = f.T0.x + (f.T1.x - f.T0.x) * s;
    const tz = f.T0.y + (f.T1.y - f.T0.y) * s;
    let px = ex + (tx - ex) * v;
    let pz = ez + (tz - ez) * v;
    const k = f.corners ? cornerW(s, f.halfLen, R.Lc) * (v < R.vl ? (1 - v / R.vl) ** 2 : 0) : 0;
    const sg = s < 0.5 ? -1 : 1;
    px += (f.n.x + f.t.x * sg) * R.flare * k;
    pz += (f.n.y + f.t.y * sg) * R.flare * k;
    const y = R.y + R.rise * P(v, R.pa, R.pk) + R.lift * k;
    return out.set(px, y, pz);
  };
  const p = new THREE.Vector3();
  for (let j = 0; j <= nv; j++) {
    const v = v0 + (v1 - v0) * (j / nv);
    for (let i = 0; i <= nu; i++) {
      const s = i / nu;
      sample(s, v, p);
      pos.push(p.x, p.y, p.z);
      uv.push(p.x * f.t.x + p.z * f.t.y, v * R.slopeLen);
    }
  }
  for (let j = 0; j < nv; j++)
    for (let i = 0; i < nu; i++) {
      const a = j * (nu + 1) + i;
      const b = a + 1;
      const c = a + nu + 1;
      const d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  B.add('roof', g, new THREE.Matrix4(), R.tile, { kind: MAT.plain, ao: 1 });

  // eave fascia strip (the visible thickness of the eave)
  if (f.v0 === 0 && R.fascia > 0) {
    const fp = [];
    const fi = [];
    const q = new THREE.Vector3();
    for (let i = 0; i <= nu; i++) {
      sample(i / nu, 0, q);
      fp.push(q.x, q.y + 0.02, q.z, q.x - f.n.x * 0.06, q.y - R.fascia, q.z - f.n.y * 0.06);
      if (i < nu) {
        const a = i * 2;
        fi.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
      }
    }
    const fg = new THREE.BufferGeometry();
    fg.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3));
    fg.setIndex(fi);
    fg.computeVertexNormals();
    // orient outward: flip if the computed normal points inward
    const nrm = fg.attributes.normal;
    if (nrm.getX(0) * f.n.x + nrm.getZ(0) * f.n.y < 0) {
      for (let i = 0; i < fi.length; i += 3) [fi[i + 1], fi[i + 2]] = [fi[i + 2], fi[i + 1]];
      fg.setIndex(fi);
      fg.computeVertexNormals();
    }
    B.add('solid', fg, new THREE.Matrix4(), R.fasciaColor, { kind: MAT.wood, ao: 0.85 });
  }

  // eave tile ends (瓦当) and rafter ends (椽头)
  if (f.v0 === 0 && R.eaveTiles) {
    const q = new THREE.Vector3();
    const q2 = new THREE.Vector3();
    const len = new THREE.Vector2(f.E1.x - f.E0.x, f.E1.y - f.E0.y).length();
    const n = Math.max(2, Math.floor(len / 0.27));
    const yaw = Math.atan2(f.n.x, f.n.y);
    for (let i = 0; i < n; i++) {
      const s = (i + 0.5) / n;
      sample(s, 0, q);
      sample(s, 0.04, q2);
      const pitch = Math.atan2(q2.y - q.y, Math.hypot(q2.x - q.x, q2.z - q.z));
      B.instM('eaveTile', mat4(q.x, q.y - 0.03, q.z, yaw, 1, 1, 1, pitch, 0));
    }
  }
  if (f.v0 === 0 && R.rafters) {
    const q = new THREE.Vector3();
    const q2 = new THREE.Vector3();
    const len = new THREE.Vector2(f.E1.x - f.E0.x, f.E1.y - f.E0.y).length();
    const n = Math.max(2, Math.floor(len / 0.36));
    for (let i = 1; i < n; i++) {
      const s = i / n;
      if (f.corners && cornerW(s, f.halfLen, R.Lc) > 0.05) continue;
      sample(s, 0.0, q);
      sample(s, R.rafterV, q2);
      B.rod('solid', R.rafterColor, q.x - f.n.x * 0.05, q.y - R.fascia - 0.02, q.z - f.n.y * 0.05, q2.x, q2.y - 0.22, q2.z, 0.055, { seg: 5, kind: MAT.wood, ao: 0.7 });
    }
  }
  return sample;
}

// box-section ridge swept along points; optional upturned, tapering tip
function ridgeSweep(B, pts, w, h, color, taperEnd = false, taperStart = false) {
  const profile = [
    [-w / 2, -h * 0.35],
    [w / 2, -h * 0.35],
    [w * 0.42, h * 0.65],
    [-w * 0.42, h * 0.65]
  ];
  const g = sweep(pts, profile, {
    scale: (t) => {
      let s = 1;
      if (taperEnd) s *= 1 - 0.65 * Math.max(0, (t - 0.72) / 0.28);
      if (taperStart) s *= 1 - 0.65 * Math.max(0, (0.28 - t) / 0.28);
      return s;
    }
  });
  B.add('solid', g, new THREE.Matrix4(), color, { kind: MAT.plain, ao: 0.95 });
}

// chiwen-like curled ridge ornament (吻兽), facing +x outward at origin
let _curlGeo = null;
function curlGeometry() {
  if (_curlGeo) return _curlGeo;
  const s = new THREE.Shape();
  s.moveTo(-0.32, 0);
  s.lineTo(0.18, 0);
  s.quadraticCurveTo(0.3, 0.35, 0.22, 0.72);
  s.quadraticCurveTo(0.14, 1.02, -0.18, 1.04);
  s.quadraticCurveTo(-0.42, 1.0, -0.38, 0.8);
  s.quadraticCurveTo(-0.2, 0.86, -0.12, 0.74);
  s.quadraticCurveTo(-0.04, 0.5, -0.24, 0.38);
  s.quadraticCurveTo(-0.34, 0.3, -0.32, 0);
  _curlGeo = extrude(s, 0.22, 10, 0.02);
  return _curlGeo;
}

export function ridgeOrnament(B, x, y, z, dirX, scale, color) {
  // dirX: +1 = ornament at the +x end (curl faces inward = -x)
  B.add('solid', curlGeometry(), mat4(x, y, z, dirX > 0 ? Math.PI : 0, scale), color, { kind: MAT.plain, ao: 0.95 });
}

// little ridge beasts (走兽): a row of tiny figures on the lower hip ridge
function beasts(B, from, to, count, color) {
  for (let i = 0; i < count; i++) {
    const t = 0.18 + (i / Math.max(1, count)) * 0.55;
    const x = from.x + (to.x - from.x) * t;
    const y = from.y + (to.y - from.y) * t;
    const z = from.z + (to.z - from.z) * t;
    B.box('solid', color, 0.08, 0.16, 0.12, x, y + 0.08, z, { kind: MAT.plain });
    B.sphere('solid', color, 0.06, x, y + 0.28, z, { seg: 6 });
  }
}

// ---------------------------------------------------------------- main entry
export function buildRoof(B, spec, tierOpts = {}) {
  const type = spec.type || 'xieshan';
  const R = {
    y: spec.y || 0,
    rise: spec.rise || 3,
    lift: spec.lift !== undefined ? spec.lift : 0.55,
    flare: spec.flare !== undefined ? spec.flare : 0.35,
    Lc: spec.Lc || 4.2,
    vl: spec.vl || 0.42,
    pa: spec.pa || 0.36,
    pk: spec.pk || 2.35,
    tile: spec.tile !== undefined ? spec.tile : PAL.tile,
    fascia: spec.fascia !== undefined ? spec.fascia : 0.16,
    fasciaColor: spec.fasciaColor || 0x3b2a20,
    rafterColor: spec.rafterColor || 0x6a3a26,
    rafterV: 0.28,
    eaveTiles: !!tierOpts.eaveTiles && spec.eaveTiles !== false,
    rafters: !!tierOpts.rafters && spec.rafters !== false,
    slopeLen: 1
  };
  const ridgeColor = spec.ridgeColor || PAL.tileDark;
  const segScale = tierOpts.low ? 0.6 : 1;
  const seg = (len) => Math.max(2, Math.round(len * 1.6 * segScale));
  const segV = Math.max(5, Math.round((spec.segV || 10) * segScale));
  const out = { ridgeY: R.y + R.rise };

  if (type === 'pyramid') {
    const n = spec.n || 4;
    const Rr = spec.R || 3;
    R.slopeLen = Math.hypot(Rr, R.rise) * 1.08;
    const corners = [];
    const a0 = spec.angle0 !== undefined ? spec.angle0 : Math.PI / n;
    for (let i = 0; i < n; i++) {
      const a = a0 + (i / n) * Math.PI * 2;
      corners.push(new THREE.Vector2(Math.cos(a) * Rr, Math.sin(a) * Rr));
    }
    const apex = new THREE.Vector2(0, 0);
    const edgeLen = corners[0].distanceTo(corners[1]);
    R.Lc = Math.min(R.Lc, edgeLen * 0.5);
    const samplers = [];
    for (let i = 0; i < n; i++) {
      // counter-clockwise from above (x→z) needs E0→E1 with outward normal
      const E0 = corners[(i + 1) % n];
      const E1 = corners[i];
      const t = new THREE.Vector2().subVectors(E1, E0).normalize();
      const mid = new THREE.Vector2().addVectors(E0, E1).multiplyScalar(0.5);
      const nrm = mid.clone().normalize();
      samplers.push(face(B, { E0, E1, T0: apex, T1: apex, v0: 0, v1: 0.985, nu: seg(edgeLen), nv: segV, n: nrm, t, halfLen: edgeLen / 2, corners: true }, R));
    }
    // hip ridges from apex to each corner, with upturned tips
    for (let i = 0; i < n; i++) {
      const smp = samplers[i];
      const pts = [];
      for (let k = 0; k <= 10; k++) {
        const v = 0.97 - (k / 10) * 0.97;
        const p = smp(0, v);
        p.y += 0.06;
        pts.push(p);
      }
      const tip = pts[pts.length - 1];
      const dir = new THREE.Vector3(tip.x, 0, tip.z).normalize();
      pts.push(tip.clone().addScaledVector(dir, 0.35).add(new THREE.Vector3(0, 0.22, 0)));
      pts.push(tip.clone().addScaledVector(dir, 0.6).add(new THREE.Vector3(0, 0.55, 0)));
      ridgeSweep(B, pts, spec.ridgeW || 0.2, spec.ridgeH || 0.24, ridgeColor, true);
    }
    // finial (宝顶)
    const fy = R.y + R.rise * 0.985;
    const fs = spec.finial || 0.5;
    B.cyl('solid', ridgeColor, 0.28 * fs, 0.25 * fs, 0, fy - 0.05, 0, { rTop: 0.18 * fs, seg: 10 });
    B.sphere('solid', spec.finialColor || 0x7a6a4a, 0.26 * fs, 0, fy + 0.42 * fs, 0, { seg: 12, sy: 1.15, kind: MAT.gold });
    B.cyl('solid', spec.finialColor || 0x7a6a4a, 0.05 * fs, 0.5 * fs, 0, fy + 0.6 * fs, 0, { rTop: 0.01, seg: 6, kind: MAT.gold });
    out.ridgeY = fy;
    return out;
  }

  const hx = spec.hx;
  const hz = spec.hz;
  const run = hz;
  R.slopeLen = Math.hypot(run, R.rise) * 1.08;
  const v2 = (x, z) => new THREE.Vector2(x, z);
  const nF = v2(0, 1);
  const nB = v2(0, -1);
  const nR = v2(1, 0);
  const nL = v2(-1, 0);
  const tF = v2(1, 0);
  const tB = v2(-1, 0);
  const tR = v2(0, -1);
  const tL = v2(0, 1);

  if (type === 'gable') {
    // straight ridge, no hips; small lift so the eave line smiles a little
    R.lift = spec.lift !== undefined ? spec.lift : 0.12;
    R.flare = 0;
    R.Lc = Math.min(R.Lc, hx * 0.6);
    const front = face(B, { E0: v2(-hx, hz), E1: v2(hx, hz), T0: v2(-hx, 0), T1: v2(hx, 0), v0: 0, v1: 1, nu: seg(hx * 2), nv: segV, n: nF, t: tF, halfLen: hx, corners: true }, R);
    const back = face(B, { E0: v2(hx, -hz), E1: v2(-hx, -hz), T0: v2(hx, 0), T1: v2(-hx, 0), v0: 0, v1: 1, nu: seg(hx * 2), nv: segV, n: nB, t: tB, halfLen: hx, corners: true }, R);
    // bargeboards + verge ridges along both gable edges
    for (const [sx, sF, sB] of [
      [1, 1, 0],
      [-1, 0, 1]
    ]) {
      const pts = [];
      for (let k = 0; k <= 8; k++) pts.push(front(sF, k / 8).add(new THREE.Vector3(0, 0.06, 0)));
      const ptsB = [];
      for (let k = 0; k <= 8; k++) ptsB.push(back(sB, k / 8).add(new THREE.Vector3(0, 0.06, 0)));
      ridgeSweep(B, pts, 0.16, 0.18, ridgeColor);
      ridgeSweep(B, ptsB, 0.16, 0.18, ridgeColor);
      if (spec.barge !== false) {
        const bp = pts.map((p) => p.clone().add(new THREE.Vector3(sx * 0.03, -0.12, 0)));
        const bq = ptsB.map((p) => p.clone().add(new THREE.Vector3(sx * 0.03, -0.12, 0)));
        const prof = [
          [-0.03, -0.18],
          [0.03, -0.18],
          [0.03, 0.06],
          [-0.03, 0.06]
        ];
        B.add('solid', sweep(bp, prof), new THREE.Matrix4(), spec.bargeColor || 0x4a2a1e, { kind: MAT.wood });
        B.add('solid', sweep(bq, prof), new THREE.Matrix4(), spec.bargeColor || 0x4a2a1e, { kind: MAT.wood });
      }
    }
    mainRidge(B, spec, -hx - 0.05, hx + 0.05, R.y + R.rise, ridgeColor);
    if (spec.gableWall) gableWalls(B, hx - (spec.gableInset || 0.25), hz - (spec.gableEaveIn || 0.9), R, spec);
    return out;
  }

  if (type === 'hip' || type === 'skirt') {
    const top = type === 'skirt' ? spec.vTop || 0.55 : 1;
    let T0F;
    let T1F;
    let TR;
    let TL;
    if (type === 'skirt') {
      // inner edge where the pent roof meets the upper storey
      const ix = spec.ix;
      const iz = spec.iz;
      const vt = 1; // inner edge at v = 1 of this patch
      T0F = v2(-ix, iz);
      T1F = v2(ix, iz);
      R.rise = spec.rise;
      const fF = { E0: v2(-hx, hz), E1: v2(hx, hz), T0: T0F, T1: T1F, v0: 0, v1: vt, nu: seg(hx * 2), nv: Math.max(4, Math.round(segV * 0.6)), n: nF, t: tF, halfLen: hx, corners: true };
      const fB = { E0: v2(hx, -hz), E1: v2(-hx, -hz), T0: v2(ix, -iz), T1: v2(-ix, -iz), v0: 0, v1: vt, nu: seg(hx * 2), nv: fF.nv, n: nB, t: tB, halfLen: hx, corners: true };
      const fR = { E0: v2(hx, hz), E1: v2(hx, -hz), T0: v2(ix, iz), T1: v2(ix, -iz), v0: 0, v1: vt, nu: seg(hz * 2), nv: fF.nv, n: nR, t: tR, halfLen: hz, corners: true };
      const fL = { E0: v2(-hx, -hz), E1: v2(-hx, hz), T0: v2(-ix, -iz), T1: v2(-ix, iz), v0: 0, v1: vt, nu: seg(hz * 2), nv: fF.nv, n: nL, t: tL, halfLen: hz, corners: true };
      R.pa = 0.5;
      R.pk = 1.8;
      R.slopeLen = Math.hypot(hz - iz, R.rise) * 1.05;
      const sF = face(B, fF, R);
      const sB = face(B, fB, R);
      face(B, fR, R);
      face(B, fL, R);
      // short hip ridges at the four corners
      for (const smp of [sF, sB]) {
        for (const s of [0, 1]) {
          const pts = [];
          for (let k = 0; k <= 6; k++) pts.push(smp(s, 0.95 - (k / 6) * 0.95).add(new THREE.Vector3(0, 0.05, 0)));
          const tip = pts[pts.length - 1];
          const d = new THREE.Vector3(tip.x, 0, tip.z).normalize();
          pts.push(tip.clone().addScaledVector(d, 0.3).add(new THREE.Vector3(0, 0.2, 0)));
          pts.push(tip.clone().addScaledVector(d, 0.5).add(new THREE.Vector3(0, 0.48, 0)));
          ridgeSweep(B, pts, 0.18, 0.2, ridgeColor, true);
        }
      }
      out.ridgeY = R.y + R.rise;
      return out;
    }
    // full hip roof
    const xr = Math.max(0.2, hx - hz);
    const sF = face(B, { E0: v2(-hx, hz), E1: v2(hx, hz), T0: v2(-xr, 0), T1: v2(xr, 0), v0: 0, v1: top, nu: seg(hx * 2), nv: segV, n: nF, t: tF, halfLen: hx, corners: true }, R);
    const sB = face(B, { E0: v2(hx, -hz), E1: v2(-hx, -hz), T0: v2(xr, 0), T1: v2(-xr, 0), v0: 0, v1: top, nu: seg(hx * 2), nv: segV, n: nB, t: tB, halfLen: hx, corners: true }, R);
    face(B, { E0: v2(hx, hz), E1: v2(hx, -hz), T0: v2(xr, 0), T1: v2(xr, 0), v0: 0, v1: top, nu: seg(hz * 2), nv: segV, n: nR, t: tR, halfLen: hz, corners: true }, R);
    face(B, { E0: v2(-hx, -hz), E1: v2(-hx, hz), T0: v2(-xr, 0), T1: v2(-xr, 0), v0: 0, v1: top, nu: seg(hz * 2), nv: segV, n: nL, t: tL, halfLen: hz, corners: true }, R);
    hipRidges(B, sF, sB, 0, 1, ridgeColor, spec);
    mainRidge(B, spec, -xr, xr, R.y + R.rise, ridgeColor);
    return out;
  }

  // ---------------- xieshan (hip-and-gable)
  const vS = spec.vS || 0.42;
  const over = spec.overhang !== undefined ? spec.overhang : 0.55;
  const xg = hx - hz * vS; // gable wall plane
  const xo = xg + over; // gable roof edge
  const lowF = face(B, { E0: v2(-hx, hz), E1: v2(hx, hz), T0: v2(-(hx - hz), 0), T1: v2(hx - hz, 0), v0: 0, v1: vS, nu: seg(hx * 2), nv: Math.max(3, Math.round(segV * vS)), n: nF, t: tF, halfLen: hx, corners: true }, R);
  const lowB = face(B, { E0: v2(hx, -hz), E1: v2(-hx, -hz), T0: v2(hx - hz, 0), T1: v2(-(hx - hz), 0), v0: 0, v1: vS, nu: seg(hx * 2), nv: Math.max(3, Math.round(segV * vS)), n: nB, t: tB, halfLen: hx, corners: true }, R);
  face(B, { E0: v2(hx, hz), E1: v2(hx, -hz), T0: v2(hx - hz, 0), T1: v2(hx - hz, 0), v0: 0, v1: vS, nu: seg(hz * 2), nv: Math.max(3, Math.round(segV * vS)), n: nR, t: tR, halfLen: hz, corners: true }, R);
  face(B, { E0: v2(-hx, -hz), E1: v2(-hx, hz), T0: v2(-(hx - hz), 0), T1: v2(-(hx - hz), 0), v0: 0, v1: vS, nu: seg(hz * 2), nv: Math.max(3, Math.round(segV * vS)), n: nL, t: tL, halfLen: hz, corners: true }, R);
  const upF = face(B, { E0: v2(-xo, hz), E1: v2(xo, hz), T0: v2(-xo, 0), T1: v2(xo, 0), v0: vS, v1: 1, nu: seg(xo * 2), nv: Math.max(4, Math.round(segV * (1 - vS))), n: nF, t: tF, halfLen: hx, corners: false }, R);
  const upB = face(B, { E0: v2(xo, -hz), E1: v2(-xo, -hz), T0: v2(xo, 0), T1: v2(-xo, 0), v0: vS, v1: 1, nu: seg(xo * 2), nv: Math.max(4, Math.round(segV * (1 - vS))), n: nB, t: tB, halfLen: hx, corners: false }, R);

  // gable triangles (山花) just inside the gable roof edge
  const ys = R.y + R.rise * P(vS, R.pa, R.pk);
  for (const sx of [-1, 1]) {
    const x = sx * (xg + 0.05);
    const pts = [];
    const N = 10;
    for (let k = 0; k <= N; k++) {
      const v = vS + ((1 - vS) * k) / N;
      pts.push([hz * (1 - v), R.y + R.rise * P(v, R.pa, R.pk) - 0.08]);
    }
    const pos = [];
    const uv = [];
    const top = [...pts, ...pts.slice(0, -1).reverse().map(([z, y]) => [-z, y])];
    for (let k = 0; k < top.length - 1; k++) {
      const [z0, y0] = top[k];
      const [z1, y1] = top[k + 1];
      pos.push(x, ys, 0, x, y0, z0, x, y1, z1);
      uv.push(0, 0, 0, 1, 0, 1);
    }
    // bottom band (from the skirt up to the gable base)
    const gw = new THREE.BufferGeometry();
    gw.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    gw.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    gw.computeVertexNormals();
    // make it face outward (both sides visible is fine: double the triangles)
    const flipped = gw.clone();
    const fp = flipped.attributes.position.array;
    for (let i = 0; i < fp.length; i += 9) {
      for (let c = 0; c < 3; c++) [fp[i + 3 + c], fp[i + 6 + c]] = [fp[i + 6 + c], fp[i + 3 + c]];
    }
    flipped.computeVertexNormals();
    B.add('solid', gw, new THREE.Matrix4(), spec.gableColor || 0x7c3a26, { kind: MAT.wood, ao: 0.9 });
    B.add('solid', flipped, new THREE.Matrix4(), spec.gableColor || 0x7c3a26, { kind: MAT.wood, ao: 0.9 });
    // decorative band at the gable base
    B.box('solid', spec.gableTrim || 0xe8dfcf, 0.06, 0.18, hz * (1 - vS) * 2, x + sx * 0.02, ys - 0.02, 0, { kind: MAT.plaster });
  }
  // bargeboards (博风板) + verge ridges (垂脊) on the gable edges
  for (const [sx, sF, sB] of [
    [1, 1, 0],
    [-1, 0, 1]
  ]) {
    const pts = [];
    const ptsB = [];
    for (let k = 0; k <= 8; k++) {
      const v = vS + ((1 - vS) * k) / 8;
      pts.push(upF(sF, v).add(new THREE.Vector3(0, 0.07, 0)));
      ptsB.push(upB(sB, v).add(new THREE.Vector3(0, 0.07, 0)));
    }
    ridgeSweep(B, pts, 0.2, 0.26, ridgeColor);
    ridgeSweep(B, ptsB, 0.2, 0.26, ridgeColor);
    const prof = [
      [-0.035, -0.32],
      [0.035, -0.32],
      [0.035, 0.04],
      [-0.035, 0.04]
    ];
    const bp = pts.map((p) => p.clone().add(new THREE.Vector3(sx * 0.02, -0.1, 0)));
    const bq = ptsB.map((p) => p.clone().add(new THREE.Vector3(sx * 0.02, -0.1, 0)));
    B.add('solid', sweep(bp, prof), new THREE.Matrix4(), spec.bargeColor || 0x5a2c1e, { kind: MAT.wood });
    B.add('solid', sweep(bq, prof), new THREE.Matrix4(), spec.bargeColor || 0x5a2c1e, { kind: MAT.wood });
    // a round gable ornament (悬鱼) under the ridge
    B.cyl('solid', spec.bargeColor || 0x5a2c1e, 0.16, 0.05, sx * (xo + 0.02), R.y + R.rise - 0.62, 0, { rz: Math.PI / 2, seg: 10, kind: MAT.wood });
  }
  // hip ridges (戗脊) on the skirt: from the gable foot down to each corner
  hipRidges(B, lowF, lowB, 0, vS, ridgeColor, spec);
  mainRidge(B, spec, -xo - 0.02, xo + 0.02, R.y + R.rise, ridgeColor);
  out.gableX = xg;
  out.skirtY = ys;
  return out;
}

function hipRidges(B, sF, sB, vA, vB, color, spec) {
  for (const smp of [sF, sB]) {
    for (const s of [0, 1]) {
      const pts = [];
      const N = 8;
      for (let k = 0; k <= N; k++) {
        const v = vB * 0.98 - ((vB * 0.98 - vA) * k) / N;
        pts.push(smp(s, v).add(new THREE.Vector3(0, 0.07, 0)));
      }
      const tip = pts[pts.length - 1];
      const prev = pts[pts.length - 2];
      const d = new THREE.Vector3(tip.x - prev.x, 0, tip.z - prev.z).normalize();
      pts.push(tip.clone().addScaledVector(d, 0.35).add(new THREE.Vector3(0, 0.22, 0)));
      pts.push(tip.clone().addScaledVector(d, 0.62).add(new THREE.Vector3(0, 0.6, 0)));
      ridgeSweep(B, pts, spec.ridgeW ? spec.ridgeW * 0.8 : 0.22, spec.ridgeH ? spec.ridgeH * 0.7 : 0.28, color, true);
      if (spec.beasts) beasts(B, pts[Math.floor(N * 0.45)], tip, spec.beasts, color);
    }
  }
}

function mainRidge(B, spec, x0, x1, y, color) {
  const w = spec.ridgeW || 0.3;
  const h = spec.ridgeH || 0.42;
  const style = spec.ridgeEnd || 'curl';
  const pts = [];
  const N = 12;
  for (let k = 0; k <= N; k++) {
    const t = k / N;
    // slight upward rise toward the ends (生起)
    const e = Math.pow(Math.abs(t * 2 - 1), 3) * 0.12;
    pts.push(new THREE.Vector3(x0 + (x1 - x0) * t, y + 0.02 + e, 0));
  }
  if (style === 'swallow') {
    // swallow-tail ends sweep up into points (燕尾脊)
    const L = Math.min(1.4, (x1 - x0) * 0.18);
    const left = [];
    const right = [];
    for (let k = 1; k <= 5; k++) {
      const t = k / 5;
      left.push(new THREE.Vector3(x0 - L * t, y + 0.14 + 0.85 * L * t * t, 0));
      right.push(new THREE.Vector3(x1 + L * t, y + 0.14 + 0.85 * L * t * t, 0));
    }
    const all = [...left.reverse(), ...pts, ...right];
    ridgeSweep(B, all, w, h, color, true, true);
  } else {
    ridgeSweep(B, pts, w, h, color);
    if (style === 'curl') {
      const sc = spec.ornament || 0.95;
      ridgeOrnament(B, x0 + 0.12, y + 0.02 + 0.12, 0, -1, sc, color);
      ridgeOrnament(B, x1 - 0.12, y + 0.02 + 0.12, 0, 1, sc, color);
    }
  }
  // a band of lighter tile/brick on the ridge face (花脊)
  if (spec.ridgeBand !== false) B.box('solid', spec.ridgeBandColor || 0x7a7670, x1 - x0 - 0.4, h * 0.22, w * 1.02, (x0 + x1) / 2, y + h * 0.18, 0, { kind: MAT.plain });
}

function gableWalls(B, x, hzIn, R, spec) {
  // flush gable end walls under a gable roof: plaster triangles
  for (const sx of [-1, 1]) {
    const pts = [];
    const N = 8;
    for (let k = 0; k <= N; k++) {
      const v = k / N;
      pts.push([hzIn * (1 - v), R.y + R.rise * P(v, R.pa, R.pk) - 0.12]);
    }
    const pos = [];
    const top = [...pts, ...pts.slice(0, -1).reverse().map(([z, y]) => [-z, y])];
    for (let k = 0; k < top.length - 1; k++) {
      const [z0, y0] = top[k];
      const [z1, y1] = top[k + 1];
      if (sx > 0) pos.push(sx * x, R.y, 0, sx * x, y1, z1, sx * x, y0, z0);
      else pos.push(sx * x, R.y, 0, sx * x, y0, z0, sx * x, y1, z1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(new Array((pos.length / 3) * 2).fill(0.95), 2));
    g.computeVertexNormals();
    B.add('solid', g, new THREE.Matrix4(), spec.wallColor || PAL.plaster, { kind: MAT.plaster });
  }
}

export { P as roofProfile };
