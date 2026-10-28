import * as THREE from 'three';
import { MAT, mat4 } from '../core/builder.js';
import { PAL } from '../core/config.js';
import { lathe, sweep, extrude } from '../core/geom.js';
import { buildRoof } from './roof.js';
import { column, latticePanel, stoneRail, woodRail, meirenkao } from './parts.js';
import { hall } from './hall.js';

// Corridors, archways, pavilions, bridges, a pagoda and village houses.

// ---------------------------------------------------------------- covered corridor (游廊)
// pts: [[x,z]...] centreline; side: which side has a wall (+1 left, -1 right, 0 none)
export function corridor(B, pts, opts = {}, tier = {}) {
  const w = opts.w || 2.4;
  const h = opts.h || 2.9;
  const y = opts.y || 0;
  const step = opts.step || 3;
  const seg = tier.curve || 10;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, z0] = pts[i];
    const [x1, z1] = pts[i + 1];
    const len = Math.hypot(x1 - x0, z1 - z0);
    const yaw = Math.atan2(x1 - x0, z1 - z0);
    B.push(mat4((x0 + x1) / 2, y, (z0 + z1) / 2, yaw));
    // local: z along the corridor, x across
    const n = Math.max(1, Math.round(len / step));
    // floor
    B.box('solid', PAL.stoneGrey, w + 0.3, 0.24, len + 0.3, 0, 0, 0, { kind: MAT.brick });
    B.box('solid', PAL.stone, w + 0.42, 0.08, len + 0.42, 0, 0.18, 0, { kind: MAT.stone });
    for (let k = 0; k <= n; k++) {
      const zz = -len / 2 + (k / n) * len;
      for (const sx of [-1, 1]) {
        if (opts.wall && sx === opts.wall) continue;
        column(B, sx * w / 2, 0.24, zz, h, 0.11, opts.colColor || 0x6e2c1c, Math.min(seg, 10));
      }
      // tie beam across
      B.box('solid', PAL.lacquerDark, w + 0.2, 0.2, 0.14, 0, 0.24 + h - 0.18, zz, { kind: MAT.wood });
    }
    for (const sx of [-1, 1]) {
      if (opts.wall && sx === opts.wall) continue;
      // longitudinal beams + painted band
      B.box('solid', PAL.lacquerDark, 0.16, 0.24, len + 0.2, sx * w / 2, 0.24 + h - 0.24, 0, { kind: MAT.wood });
      B.box('solid', 0x2f5a62, 0.17, 0.1, len + 0.1, sx * w / 2, 0.24 + h - 0.36, 0, { kind: MAT.paint });
      // hanging fretwork + benches between columns
      for (let k = 0; k < n; k++) {
        const za = -len / 2 + (k / n) * len;
        const zb = -len / 2 + ((k + 1) / n) * len;
        const m = mat4(sx * w / 2, 0, (za + zb) / 2, Math.PI / 2);
        latticePanel(B, 0, 0.24 + h - 0.62, 0, zb - za - 0.24, 0.26, 3, true, { matrix: m });
        if (opts.benches !== false && !(opts.gaps && opts.gaps.includes(`${i}:${k}`))) {
          if (opts.meirenkao) meirenkao(B, sx * w / 2, za + 0.14, sx * w / 2, zb - 0.14, 0.24, PAL.lacquerDark, sx);
          else {
            B.box('solid', PAL.lacquerDark, 0.34, 0.07, zb - za - 0.22, sx * (w / 2 - 0.05), 0.24 + 0.42, (za + zb) / 2, { kind: MAT.wood, chamfer: 0.015 });
            B.box('solid', PAL.lacquerDark, 0.3, 0.42, 0.06, sx * (w / 2 - 0.05), 0.24, za + 0.2, { kind: MAT.wood });
            B.box('solid', PAL.lacquerDark, 0.3, 0.42, 0.06, sx * (w / 2 - 0.05), 0.24, zb - 0.2, { kind: MAT.wood });
          }
        }
      }
    }
    // roof: gable along the corridor (ridge along local z → rotate 90°)
    B.push(mat4(0, 0.24 + h + 0.02, 0, Math.PI / 2));
    buildRoof(
      B,
      {
        type: 'gable',
        hx: len / 2 + (i === 0 || i === pts.length - 2 ? 0.55 : 0.75),
        hz: w / 2 + 0.75,
        y: 0,
        rise: 0.95,
        lift: 0.05,
        fascia: 0.1,
        ridgeW: 0.18,
        ridgeH: 0.2,
        ridgeEnd: opts.ridgeEnd || 'plain',
        ridgeBand: false,
        barge: true,
        segV: 6
      },
      { ...tier, low: true }
    );
    B.pop();
    B.pop();
  }
  // corner joints: small square pavilion roofs hide the seams
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, z] = pts[i];
    B.push(mat4(x, y + 0.24 + h + 0.05, z));
    buildRoof(B, { type: 'pyramid', n: 4, R: (w / 2 + 0.8) * 1.414, rise: 1.25, lift: 0.3, flare: 0.15, Lc: 1.2, angle0: Math.PI / 4, finial: 0.35 }, { ...tier, low: true });
    B.pop();
  }
}

// ---------------------------------------------------------------- memorial archway (牌坊)
export function paifang(B, x, z, ry = 0, tier = {}, opts = {}) {
  const spans = opts.spans || [3.2, 4.4, 3.2];
  const W = spans.reduce((a, b) => a + b, 0);
  const xs = [-W / 2];
  for (const s of spans) xs.push(xs[xs.length - 1] + s);
  B.pushT(x, 0, z, ry);
  const postC = opts.post || 0x5a2a1c;
  xs.forEach((px, i) => {
    const centre = i === 1 || i === 2;
    const h = centre ? 6.4 : 5.2;
    // stone drum braces (抱鼓石) at the foot
    for (const sz of [-1, 1]) {
      B.box('solid', PAL.stone, 0.36, 0.9, 0.9, px, 0, sz * 0.62, { kind: MAT.stone, chamfer: 0.03 });
      B.cyl('solid', PAL.stone, 0.4, 0.28, px, 0.85, sz * 0.68, { rz: Math.PI / 2, seg: 14, kind: MAT.stone });
    }
    B.box('solid', PAL.stone, 0.62, 0.5, 0.62, px, 0, 0, { kind: MAT.stone, chamfer: 0.03 });
    B.box('solid', postC, 0.38, h, 0.38, px, 0.5, 0, { kind: MAT.lacquer, chamfer: 0.03 });
  });
  // lintels, panels and small roofs over each span
  spans.forEach((s, i) => {
    const cx = (xs[i] + xs[i + 1]) / 2;
    const centre = i === 1;
    const top = centre ? 6.1 : 4.9;
    B.box('solid', 0x2f5a62, s + 0.3, 0.34, 0.32, cx, top - 1.3, 0, { kind: MAT.paint, chamfer: 0.02 });
    B.box('solid', 0x8a3622, s - 0.3, 0.6, 0.18, cx, top - 0.95, 0, { kind: MAT.lacquer });
    B.box('solid', 0x2f5a62, s + 0.3, 0.3, 0.32, cx, top - 0.32, 0, { kind: MAT.paint, chamfer: 0.02 });
    for (const bx of [-s * 0.3, 0, s * 0.3]) B.inst('bracket', cx + bx, top - 0.02, 0, 0, 0.55);
    for (const bx of [-s * 0.3, 0, s * 0.3]) B.inst('bracket', cx + bx, top - 0.02, 0, Math.PI, 0.55);
    B.push(mat4(cx, top + 0.42, 0));
    buildRoof(
      B,
      { type: centre ? 'xieshan' : 'hip', hx: s / 2 + 0.75, hz: 1.05, y: 0, rise: centre ? 1.3 : 1.05, lift: 0.4, flare: 0.25, Lc: 1.1, vS: 0.5, overhang: 0.25, ridgeEnd: 'curl', ornament: 0.5, ridgeW: 0.2, ridgeH: 0.26 },
      { ...tier, low: true }
    );
    B.pop();
  });
  B.pop();
  return { W, plaqueY: 5.15 };
}

// ---------------------------------------------------------------- pavilion (亭)
export function pavilion(B, x, z, ry, tier, opts = {}) {
  const n = opts.n || 6;
  const R = opts.R || 2.6;
  const base = opts.base !== undefined ? opts.base : 0.5;
  const colH = opts.colH || 3.0;
  B.pushT(x, opts.y || 0, z, ry);
  // polygonal platform
  const plat = new THREE.CylinderGeometry(R + 0.75, R + 0.85, base, n, 1);
  plat.translate(0, base / 2, 0);
  plat.rotateY(Math.PI / n);
  B.add('solid', plat, new THREE.Matrix4(), PAL.stoneGrey, { kind: 10 });
  const cap = new THREE.CylinderGeometry(R + 0.8, R + 0.8, 0.1, n, 1);
  cap.translate(0, base - 0.05, 0);
  cap.rotateY(Math.PI / n);
  B.add('solid', cap, new THREE.Matrix4(), PAL.stone, { kind: MAT.stone });
  const corners = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.PI / n;
    corners.push([Math.cos(a) * R, Math.sin(a) * R]);
  }
  corners.forEach(([cx, cz]) => column(B, cx, base, cz, colH, 0.15, opts.col || PAL.lacquer, tier.curve));
  // ring beams, fretwork and benches between columns
  for (let i = 0; i < n; i++) {
    const [ax, az] = corners[i];
    const [bx, bz] = corners[(i + 1) % n];
    B.beam('solid', 0x2f5a62, ax, base + colH - 0.2, az, bx, base + colH - 0.2, bz, 0.2, 0.28, { kind: MAT.paint });
    B.beam('solid', PAL.lacquerDark, ax, base + colH + 0.06, az, bx, base + colH + 0.06, bz, 0.26, 0.12, { kind: MAT.wood });
    const yaw = Math.atan2(bx - ax, bz - az);
    const len = Math.hypot(bx - ax, bz - az);
    const m = mat4((ax + bx) / 2, 0, (az + bz) / 2, yaw + Math.PI / 2);
    latticePanel(B, 0, base + colH - 0.62, 0, len - 0.3, 0.3, 3, true, { matrix: m });
    const openSide = opts.entry !== undefined ? i === opts.entry : false;
    if (!openSide && opts.benches !== false) {
      // bench + backrest leaning out (美人靠)
      const mxx = (ax + bx) / 2;
      const mzz = (az + bz) / 2;
      const out = new THREE.Vector2(mxx, mzz).normalize();
      meirenkao(B, ax * 0.97, az * 0.97, bx * 0.97, bz * 0.97, base, PAL.lacquerDark, Math.sign(out.x * Math.cos(yaw) - out.y * Math.sin(yaw)) || 1);
    }
  }
  B.push(mat4(0, base + colH + 0.16, 0));
  if (opts.double) {
    buildRoof(B, { type: 'pyramid', n, R: R + 1.25, rise: 0.9, lift: 0.4, flare: 0.25, Lc: 1.3, finial: 0.01 }, tier);
    B.cyl('solid', PAL.lacquer, R * 0.62, 1.1, 0, 0.5, 0, { seg: n, kind: MAT.lacquer });
    B.push(mat4(0, 1.6, 0));
    buildRoof(B, { type: 'pyramid', n, R: R + 0.6, rise: 2.0, lift: 0.5, flare: 0.3, Lc: 1.2, finial: 0.5 }, tier);
    B.pop();
  } else {
    buildRoof(B, { type: 'pyramid', n, R: R + 1.25, rise: opts.rise || 2.5, lift: 0.55, flare: 0.32, Lc: 1.3, finial: 0.5 }, tier);
  }
  B.pop();
  B.pop();
  return { top: base + colH };
}

// ---------------------------------------------------------------- arched stone bridge (拱桥)
export function archBridge(B, x, z, ry, span = 12, width = 4, rise = 3.2, waterY = -1.15, tier = {}) {
  B.pushT(x, 0, z, ry);
  // local: crossing along z
  const L = span / 2 + 3.5; // deck half length incl. approaches
  const deck = (t) => {
    const u = Math.abs(t);
    const hump = u < 0.78 ? Math.pow(Math.cos(((u / 0.78) * Math.PI) / 2), 1.25) : 0;
    return 0.3 + (rise + 0.25) * hump;
  };
  const r = span / 2;
  const cy = waterY + rise - r * 0.95;
  const bottom = waterY - 1.4;
  // spandrel walls: elevation with the arch notched out of the bottom edge
  const s = new THREE.Shape();
  const a = Math.asin(Math.min(0.999, (bottom - cy) / r));
  const foot = Math.cos(a) * r;
  s.moveTo(-L, bottom);
  s.lineTo(-foot, bottom);
  s.absarc(0, cy, r, Math.PI - a, a, true);
  s.lineTo(L, bottom);
  const N = 28;
  for (let i = N; i >= 0; i--) {
    const t = (i / N) * 2 - 1;
    s.lineTo(t * L, deck(t));
  }
  s.closePath();
  const g = extrude(s, width, 32);
  g.rotateY(Math.PI / 2);
  B.add('solid', g, new THREE.Matrix4(), 0xb3aa98, { kind: 10 });
  // arch ring stones (券脸) on both faces
  for (const sx of [-1, 1]) {
    const ring = new THREE.Shape();
    const a2 = Math.asin(Math.min(0.999, (waterY - 0.3 - cy) / r));
    ring.absarc(0, 0, r + 0.42, a2, Math.PI - a2, false);
    ring.absarc(0, 0, r, Math.PI - a2, a2, true);
    ring.closePath();
    const rg = extrude(ring, 0.16, 32);
    B.add('solid', rg, mat4(sx * (width / 2 + 0.04), cy, 0, Math.PI / 2), PAL.stone, { kind: MAT.stone });
  }
  // deck stones (steps) on top
  const steps = 22;
  for (let i = 0; i < steps; i++) {
    const t0 = (i / steps) * 2 - 1;
    const t1 = ((i + 1) / steps) * 2 - 1;
    const yy = Math.max(deck(t0), deck(t1));
    B.box('solid', PAL.stoneGrey, width - 0.1, 0.16, ((t1 - t0) * L) + 0.02, 0, yy - 0.08, ((t0 + t1) / 2) * L, { kind: MAT.stone, jitter: 0.05 });
  }
  // stone railings following the hump
  for (const sx of [-1, 1]) {
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const t = (i / 10) * 2 - 1;
      pts.push([sx * (width / 2 - 0.1), deck(t) + 0.05, t * L * 0.94]);
    }
    stoneRail(B, pts, 0.8);
  }
  B.pop();
}

// ---------------------------------------------------------------- zigzag bridge (九曲桥) of stone slabs on piers
export function zigzagBridge(B, pts, y = 0.05, width = 1.6, tier = {}) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, z0] = pts[i];
    const [x1, z1] = pts[i + 1];
    const len = Math.hypot(x1 - x0, z1 - z0);
    const yaw = Math.atan2(x1 - x0, z1 - z0);
    B.push(mat4((x0 + x1) / 2, 0, (z0 + z1) / 2, yaw));
    B.box('solid', PAL.stone, width, 0.22, len + width * 0.6, 0, y, 0, { kind: MAT.stone, chamfer: 0.03, jitter: 0.04 });
    const n = Math.max(1, Math.round(len / 3));
    for (let k = 0; k <= n; k++) {
      const zz = -len / 2 + (k / n) * len;
      B.box('solid', 0x9d9584, width * 0.7, 1.6, 0.5, 0, y - 1.6, zz, { kind: MAT.stone });
    }
    B.pop();
  }
  // low stone rails on both sides
  for (const side of [-1, 1]) {
    const rail = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const prev = pts[Math.max(0, i - 1)];
      const next = pts[Math.min(pts.length - 1, i + 1)];
      const dx = next[0] - prev[0];
      const dz = next[1] - prev[1];
      const l = Math.hypot(dx, dz) || 1;
      rail.push([p[0] - (dz / l) * side * (width / 2 - 0.08), y + 0.22, p[1] + (dx / l) * side * (width / 2 - 0.08)]);
    }
    stoneRail(B, rail, 0.5, PAL.stone);
  }
}

// ---------------------------------------------------------------- octagonal pagoda (塔)
export function pagoda(B, x, y, z, storeys = 7, tier = {}) {
  B.pushT(x, y, z, Math.PI / 8);
  let r = 4.2;
  let yy = 0;
  // stepped base
  B.cyl('solid', 0xa59c8a, r + 1.6, 1.2, 0, -0.4, 0, { seg: 8, kind: 10 });
  B.cyl('solid', PAL.stone, r + 1.2, 0.5, 0, 0.8, 0, { seg: 8, kind: MAT.stone });
  yy = 1.3;
  for (let i = 0; i < storeys; i++) {
    const h = i === 0 ? 4.2 : 3.0 - i * 0.12;
    // brick body, whitewashed with lacquer posts at the corners
    B.cyl('solid', PAL.plaster, r, h, 0, yy, 0, { rTop: r * 0.97, seg: 8, kind: MAT.plaster });
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2 + Math.PI / 8;
      B.box('solid', 0x7a3020, 0.28, h, 0.28, Math.cos(a) * r * 0.99, yy, Math.sin(a) * r * 0.99, { ry: -a, kind: MAT.lacquer });
      // arched dark openings on alternate faces
      if (k % 2 === i % 2) {
        const b = a + Math.PI / 8;
        B.box('solid', 0x2a2420, 0.9, h * 0.5, 0.1, Math.cos(b) * r * 0.93, yy + h * 0.22, Math.sin(b) * r * 0.93, { ry: Math.PI / 2 - b, kind: MAT.plain, ao: 0.5 });
      }
    }
    B.cyl('solid', 0x2f5a62, r * 1.02, 0.3, 0, yy + h - 0.3, 0, { seg: 8, kind: MAT.paint });
    // eave ring (pent roof)
    B.push(mat4(0, yy + h, 0));
    buildRoof(B, { type: 'pyramid', n: 8, R: r + 1.6, rise: 1.1, lift: 0.45, flare: 0.3, Lc: 1.0, angle0: 0, finial: 0.001 }, { ...tier, low: true, eaveTiles: false, rafters: false });
    B.pop();
    // balcony band above
    B.cyl('solid', PAL.stone, r * 0.98, 0.25, 0, yy + h + 0.75, 0, { seg: 8, kind: MAT.stone });
    yy += h + 0.95;
    r *= 0.9;
  }
  // crowning roof + spire (塔刹)
  B.push(mat4(0, yy, 0));
  buildRoof(B, { type: 'pyramid', n: 8, R: r + 1.4, rise: 2.4, lift: 0.5, flare: 0.3, Lc: 1.1, angle0: 0, finial: 0.001 }, { ...tier, low: true });
  B.pop();
  const sy = yy + 2.3;
  B.cyl('solid', 0x6e5a3a, 0.5, 0.5, 0, sy, 0, { rTop: 0.35, seg: 8, kind: MAT.gold });
  for (let k = 0; k < 5; k++) B.cyl('solid', 0x6e5a3a, 0.42 - k * 0.05, 0.12, 0, sy + 0.7 + k * 0.42, 0, { seg: 10, kind: MAT.gold });
  B.cyl('solid', 0x6e5a3a, 0.08, 2.4, 0, sy + 0.5, 0, { rTop: 0.02, seg: 6, kind: MAT.gold });
  B.sphere('solid', 0x8a7448, 0.28, 0, sy + 3.0, 0, { seg: 8, kind: MAT.gold });
  B.pop();
  return { height: sy + 3.2 };
}

// ---------------------------------------------------------------- Huizhou village house (徽派民居)
// whitewashed box, dark gable roof, stepped horse-head gable walls (马头墙)
export function house(B, x, y, z, ry, w, d, h, rand, tier = {}, opts = {}) {
  B.pushT(x, y, z, ry);
  B.box('solid', PAL.stoneGrey, w + 0.2, 0.5, d + 0.2, 0, -0.3, 0, { kind: MAT.stone });
  B.box('solid', opts.wall || PAL.plaster, w, h, d, 0, 0.2, 0, { kind: MAT.plaster, uv: (p, i, src) => [0, src ? src.getY(i) : 0.5], jitter: 0.03 });
  // door + small windows (dark), a few lit warm for dusk
  B.box('solid', 0x2c211b, 1.1, 2.0, 0.06, 0, 0.2, d / 2 + 0.01, { kind: MAT.wood });
  B.box('solid', PAL.stoneGrey, 1.5, 0.14, 0.16, 0, 2.25, d / 2 + 0.05, { kind: MAT.stone });
  const nw = Math.max(1, Math.floor(w / 3));
  for (let k = 0; k < nw; k++) {
    const wx = -w / 2 + (w / nw) * (k + 0.5);
    if (Math.abs(wx) < 1.2) continue;
    const lit = rand() < 0.45;
    B.box('solid', lit ? 0xffc77a : 0x2a2420, 0.7, 0.6, 0.05, wx, h * 0.62, d / 2 + 0.01, { kind: MAT.plain, emit: lit ? 1.4 : 0 });
  }
  // roof (ridge along x)
  B.push(mat4(0, h + 0.2, 0));
  buildRoof(B, { type: 'gable', hx: w / 2 - 0.05, hz: d / 2 + 0.55, y: 0, rise: d * 0.32, lift: 0.04, fascia: 0.08, ridgeW: 0.18, ridgeH: 0.2, ridgeEnd: 'plain', ridgeBand: false, barge: false, segV: 5, eaveTiles: false }, { ...tier, low: true, rafters: false, eaveTiles: false });
  B.pop();
  // horse-head walls: stepped gables rising above the roof at both ends
  const steps = opts.steps || 2;
  const rise = d * 0.32;
  for (const sx of [-1, 1]) {
    for (let k = 0; k <= steps; k++) {
      const half = (d / 2) * (1 - k / (steps + 1));
      const top = h + 0.2 + rise * (k / (steps + 0.4)) + 0.7;
      B.box('solid', PAL.plaster, 0.34, top - h, half * 2, sx * (w / 2 + 0.05), h, 0, { kind: MAT.plaster, uv: () => [0, 0.9] });
      // tiny tiled cap on each step
      B.box('solid', PAL.tileDark, 0.62, 0.12, half * 2 + 0.2, sx * (w / 2 + 0.05), top + 0.0, 0, { kind: MAT.plain });
      B.box('solid', PAL.tile, 0.3, 0.12, half * 2 + 0.3, sx * (w / 2 + 0.05), top + 0.12, 0, { kind: MAT.plain });
    }
  }
  B.pop();
}

export { hall };
