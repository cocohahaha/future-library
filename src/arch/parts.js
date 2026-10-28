import * as THREE from 'three';
import { MAT, mat4, unitBox } from '../core/builder.js';
import { lathe, sweep } from '../core/geom.js';
import { PAL } from '../core/config.js';

// Structural parts kit: columns on drum bases, dougong bracket sets, lattice
// door leaves, railings, stairs and platforms. Everything is emitted into a
// Builder in the current local frame.

// ---------------------------------------------------------------- column + base (柱, 柱础)
let _baseGeo = null;
function baseGeo() {
  if (!_baseGeo) {
    _baseGeo = lathe(
      [
        [0.0, 0],
        [0.4, 0],
        [0.41, 0.06],
        [0.38, 0.1],
        [0.33, 0.2],
        [0.3, 0.26],
        [0.0, 0.26]
      ],
      12
    );
  }
  return _baseGeo;
}

export function column(B, x, y, z, h, r = 0.2, color = PAL.lacquer, seg = 12) {
  // stone drum base, lacquered shaft with a slight entasis, small top block
  B.add('solid', baseGeo(), mat4(x, y, z, 0, r * 2.2, 1, r * 2.2), PAL.stone, { kind: MAT.stone, ao: 0.8 });
  B.cyl('solid', color, r, h - 0.2, x, y + 0.2, z, { rTop: r * 0.88, seg, kind: MAT.lacquer, jitter: 0.03 });
}

// ---------------------------------------------------------------- dougong bracket set (斗拱)
// Built once as merged geometry (local: x along the wall, +z outward), then
// placed with instancing along every eave.
export function bracketGeometry(scale = 1, painted = true) {
  const parts = [];
  const C_BLOCK = new THREE.Color(painted ? 0x2f5560 : PAL.woodDark);
  const C_ARM = new THREE.Color(painted ? 0x3d6f5c : PAL.wood);
  const C_EDGE = new THREE.Color(painted ? 0x6c2c1e : PAL.woodDark);
  const add = (w, h, d, x, y, z, color, rx = 0) => parts.push({ w, h, d, x, y, z, color, rx });
  // seat block (坐斗)
  add(0.34, 0.12, 0.34, 0, 0, 0, C_BLOCK);
  add(0.26, 0.06, 0.26, 0, -0.05, 0, C_BLOCK);
  // tier 1: crossing arms
  add(0.96, 0.13, 0.11, 0, 0.12, 0, C_ARM);
  add(0.11, 0.13, 0.7, 0, 0.12, 0.02, C_ARM);
  // small blocks (散斗)
  for (const [x, z] of [
    [-0.42, 0],
    [0.42, 0],
    [0, 0.3],
    [0, -0.26]
  ])
    add(0.15, 0.09, 0.15, x, 0.25, z, C_BLOCK);
  // tier 2
  add(1.24, 0.13, 0.11, 0, 0.34, 0, C_ARM);
  add(0.72, 0.13, 0.11, 0, 0.34, 0.3, C_ARM);
  add(0.11, 0.13, 1.0, 0, 0.34, 0.14, C_ARM);
  for (const [x, z] of [
    [-0.56, 0],
    [0.56, 0],
    [-0.3, 0.3],
    [0.3, 0.3],
    [0, 0.6]
  ])
    add(0.14, 0.08, 0.14, x, 0.47, z, C_BLOCK);
  // tier 3: outer arm + cantilever (昂) sloping down outward
  add(0.86, 0.12, 0.11, 0, 0.55, 0.6, C_ARM);
  add(1.4, 0.12, 0.11, 0, 0.55, 0, C_ARM);
  add(0.12, 0.16, 1.5, 0, 0.5, 0.36, C_EDGE, -0.22);
  // beam head (耍头) and top board
  add(0.12, 0.16, 1.1, 0, 0.67, 0.25, C_ARM);
  add(1.5, 0.08, 0.22, 0, 0.83, 0.0, C_EDGE);
  add(1.0, 0.08, 0.2, 0, 0.83, 0.6, C_EDGE);

  const pos = [];
  const nor = [];
  const col = [];
  const idx = [];
  const box = unitBox();
  const m = new THREE.Matrix4();
  const n3 = new THREE.Matrix3();
  const v = new THREE.Vector3();
  const nn = new THREE.Vector3();
  for (const p of parts) {
    mat4(p.x * scale, p.y * scale, p.z * scale, 0, p.w * scale, p.h * scale, p.d * scale, p.rx, 0, m);
    n3.getNormalMatrix(m);
    const base = pos.length / 3;
    const bp = box.attributes.position;
    const bn = box.attributes.normal;
    for (let i = 0; i < bp.count; i++) {
      v.fromBufferAttribute(bp, i).applyMatrix4(m);
      nn.fromBufferAttribute(bn, i).applyMatrix3(n3).normalize();
      pos.push(v.x, v.y, v.z);
      nor.push(nn.x, nn.y, nn.z);
      // darker toward the wall and underneath: cheap baked occlusion
      const k = 0.7 + 0.3 * Math.min(1, Math.max(0, (p.z + 0.3) / 0.9)) * (nn.y < -0.5 ? 0.6 : 1);
      col.push(p.color.r * k, p.color.g * k, p.color.b * k);
    }
    for (let i = 0; i < box.index.count; i++) idx.push(base + box.index.array[i]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(new Array((pos.length / 3) * 2).fill(0), 2));
  const info = [];
  for (let i = 0; i < pos.length / 3; i++) info.push(0, MAT.wood, 0, 0.85);
  g.setAttribute('aInfo', new THREE.Float32BufferAttribute(info, 4));
  g.setIndex(idx);
  return g;
}

// ---------------------------------------------------------------- lattice door leaf (隔扇)
// local: leaf centred on x, bottom at y=0, in the z=0 plane. Lattice infill
// goes to the 'lattice' bucket (uv in metres, atlas pattern = kind).
export function doorLeaf(B, x, y, z, w, h, opts = {}) {
  const frame = opts.frame || PAL.lacquerDark;
  const ry = opts.ry || 0;
  const pattern = opts.pattern !== undefined ? opts.pattern : 0;
  const t = 0.06;
  B.pushT(x, y, z, ry);
  // stiles and rails
  B.box('solid', frame, t, h, 0.07, -w / 2 + t / 2, 0, 0, { kind: MAT.lacquer });
  B.box('solid', frame, t, h, 0.07, w / 2 - t / 2, 0, 0, { kind: MAT.lacquer });
  const lowH = h * 0.36;
  for (const yy of [0, lowH, lowH + 0.18, h - t])
    B.box('solid', frame, w - t * 2, t, 0.07, 0, yy, 0, { kind: MAT.lacquer });
  // lower panel (裙板) and the band (绦环板)
  B.box('solid', opts.panel || 0x6a3020, w - t * 2, lowH - t, 0.04, 0, t, 0, { kind: MAT.lacquer });
  B.box('solid', opts.panel || 0x6a3020, w - t * 2, 0.12, 0.04, 0, lowH + 0.03, 0, { kind: MAT.lacquer });
  // carved inset on the lower panel
  B.box('solid', opts.inset || 0x8a4a2c, (w - t * 2) * 0.6, (lowH - t) * 0.55, 0.05, 0, t + (lowH - t) * 0.22, 0, { kind: MAT.lacquer });
  // lattice infill
  const ly0 = lowH + 0.18 + t;
  const lh = h - t - ly0;
  latticePanel(B, 0, ly0, 0, w - t * 2, lh, pattern, opts.open);
  B.pop();
}

// a flat lattice panel (bottom-left anchored around centre x) → 'lattice' bucket
export function latticePanel(B, x, y, z, w, h, pattern = 0, open = false, o = {}) {
  const g = new THREE.PlaneGeometry(w, h);
  g.translate(x, y + h / 2, z);
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) - 0.5) * w + (o.u0 || 0), uv.getY(i) * h + (o.v0 || 0));
  B.add(open ? 'latticeOpen' : B.latticeKey || 'lattice', g, o.matrix || new THREE.Matrix4(), o.color || 0xffffff, { kind: pattern, ao: o.ao !== undefined ? o.ao : 1, emit: o.emit || 0 });
}

// ---------------------------------------------------------------- stairs (踏跺) with side slopes (垂带)
export function stairs(B, x, y0, z, w, rise, run, dir = 1, color = PAL.stone, opts = {}) {
  // steps going down toward +z (dir=1) from height rise at z to 0 at z + run
  const n = Math.max(2, Math.round(rise / 0.16));
  const sh = rise / n;
  const sd = run / n;
  for (let i = 0; i < n; i++) {
    const top = rise - i * sh;
    B.box('solid', color, w, top, sd + 0.02, x, y0, z + dir * (i + 0.5) * sd, { kind: MAT.stone, chamfer: 0.02, jitter: 0.04 });
  }
  if (opts.sides !== false) {
    const len = Math.hypot(rise, run);
    const ang = Math.atan2(rise, run);
    for (const sx of [-1, 1]) {
      B.box('solid', opts.sideColor || PAL.stoneDark, 0.32, 0.22, len, x + sx * (w / 2 + 0.16), y0 + rise / 2 - 0.16, z + dir * run / 2, {
        rx: dir * ang,
        kind: MAT.stone,
        chamfer: 0.02
      });
      // fill under the slope
      B.box('solid', opts.sideColor || PAL.stoneDark, 0.3, rise * 0.5, run * 0.5, x + sx * (w / 2 + 0.16), y0, z + dir * run * 0.25, { kind: MAT.stone });
    }
  }
}

// ---------------------------------------------------------------- platform (台基)
export function platform(B, cx, cz, w, d, h, opts = {}) {
  const top = opts.top || PAL.stoneGrey;
  // body of ashlar blocks with a lighter capstone rim (阶条石)
  B.box('solid', opts.side || 0xa49c8c, w, h - 0.12, d, cx, 0, cz, { kind: 10 });
  B.box('solid', opts.cap || PAL.stone, w + 0.12, 0.12, d + 0.12, cx, h - 0.12, cz, { kind: MAT.stone, chamfer: 0.03 });
  // floor surface: square bricks
  B.box('solid', top, w - 0.3, 0.02, d - 0.3, cx, h, cz, { kind: MAT.brick });
  // plinth at the foot
  B.box('solid', 0x8f8778, w + 0.18, 0.14, d + 0.18, cx, 0, cz, { kind: MAT.stone, ao: 0.75 });
}

// ---------------------------------------------------------------- railings
// Wooden railing along a polyline (balconies, corridors, pavilions)
export function woodRail(B, pts, h = 0.95, color = PAL.lacquerDark, opts = {}) {
  const post = opts.post || 0.09;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0, z0] = pts[i];
    const [x1, y1, z1] = pts[i + 1];
    const len = Math.hypot(x1 - x0, z1 - z0);
    const yaw = Math.atan2(x1 - x0, z1 - z0);
    // posts
    B.box('solid', color, post, h + 0.08, post, x0, y0, z0, { kind: MAT.lacquer });
    if (i === pts.length - 2) B.box('solid', color, post, h + 0.08, post, x1, y1, z1, { kind: MAT.lacquer });
    // top rail, mid rail, bottom rail
    B.beam('solid', color, x0, y0 + h, z0, x1, y1 + h, z1, 0.08, 0.07, { kind: MAT.lacquer });
    B.beam('solid', color, x0, y0 + h * 0.45, z0, x1, y1 + h * 0.45, z1, 0.05, 0.05, { kind: MAT.lacquer });
    B.beam('solid', color, x0, y0 + 0.08, z0, x1, y1 + 0.08, z1, 0.06, 0.06, { kind: MAT.lacquer });
    // open lattice between mid and bottom rails
    if (opts.lattice !== false && len > 0.3) {
      const m = mat4((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, yaw + Math.PI / 2);
      latticePanel(B, 0, 0.11, 0, len - post, h * 0.45 - 0.14, opts.pattern !== undefined ? opts.pattern : 2, true, { matrix: m });
    }
  }
}

// Stone railing (bridges, terraces): posts with capitals + solid panels
export function stoneRail(B, pts, h = 0.82, color = PAL.stone, opts = {}) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0, z0] = pts[i];
    const [x1, y1, z1] = pts[i + 1];
    const len = Math.hypot(x1 - x0, z1 - z0);
    const yaw = Math.atan2(x1 - x0, z1 - z0);
    const pitch = -Math.atan2(y1 - y0, len);
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    const mz = (z0 + z1) / 2;
    // post with a lotus/ball capital
    B.box('solid', color, 0.18, h, 0.18, x0, y0, z0, { kind: MAT.stone, chamfer: 0.02 });
    B.sphere('solid', color, 0.11, x0, y0 + h + 0.08, z0, { seg: 8, sy: 1.2, kind: MAT.stone });
    if (i === pts.length - 2) {
      B.box('solid', color, 0.18, h, 0.18, x1, y1, z1, { kind: MAT.stone, chamfer: 0.02 });
      B.sphere('solid', color, 0.11, x1, y1 + h + 0.08, z1, { seg: 8, sy: 1.2, kind: MAT.stone });
    }
    // panel with a recessed face and a top rail
    B.push(mat4(mx, my, mz, yaw, 1, 1, 1, pitch, 0));
    B.box('solid', opts.panel || color, 0.1, h * 0.72, len - 0.18, 0, 0, 0, { kind: MAT.stone });
    B.box('solid', opts.inset || 0xb5ab97, 0.12, h * 0.36, (len - 0.18) * 0.7, 0, h * 0.18, 0, { kind: MAT.stone });
    B.box('solid', color, 0.14, 0.08, len - 0.12, 0, h * 0.78, 0, { kind: MAT.stone, chamfer: 0.02 });
    B.pop();
  }
}

// "beauty's rest" bench with a curved backrest (美人靠) along a straight run
export function meirenkao(B, x0, z0, x1, z1, y, color = PAL.lacquerDark, outward = 1) {
  const len = Math.hypot(x1 - x0, z1 - z0);
  const yaw = Math.atan2(x1 - x0, z1 - z0);
  B.push(mat4((x0 + x1) / 2, y, (z0 + z1) / 2, yaw));
  // seat plank and its apron
  B.box('solid', color, 0.42, 0.06, len, 0, 0.42, 0, { kind: MAT.wood, chamfer: 0.015 });
  B.box('solid', color, 0.06, 0.4, len, outward * 0.18, 0.02, 0, { kind: MAT.wood });
  // curved backrest leaning outward: slats
  const n = Math.max(3, Math.floor(len / 0.16));
  for (let i = 0; i <= n; i++) {
    const zz = -len / 2 + (i / n) * len;
    const pts = [
      new THREE.Vector3(outward * 0.2, 0.48, zz),
      new THREE.Vector3(outward * 0.32, 0.7, zz),
      new THREE.Vector3(outward * 0.46, 0.88, zz)
    ];
    B.add('solid', sweep(pts, [
      [-0.018, -0.018],
      [0.018, -0.018],
      [0.018, 0.018],
      [-0.018, 0.018]
    ]), new THREE.Matrix4(), color, { kind: MAT.wood });
  }
  B.beam('solid', color, outward * 0.48, 0.9, -len / 2, outward * 0.48, 0.9, len / 2, 0.07, 0.06, { kind: MAT.wood });
  B.pop();
}
