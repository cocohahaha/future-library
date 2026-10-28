import * as THREE from 'three';
import { MAT, mat4 } from '../core/builder.js';
import { PAL } from '../core/config.js';
import { rng } from '../core/rng.js';
import { lathe } from '../core/geom.js';
import { makeMasked, makeGlow, U, patch } from '../core/materials.js';
import { prepGeo } from '../core/kit.js';

// Props: books (instanced, thousands), scrolls, furniture, lanterns with
// halos, incense burners, vats, notice boards, Go tables, haystacks.

// ---------------------------------------------------------------- shared instanced geometry
function maskAttr(geo, fn) {
  const p = geo.attributes.position;
  const n = geo.attributes.normal;
  const m = new Float32Array(p.count);
  for (let i = 0; i < p.count; i++) m[i] = fn(p, n, i);
  geo.setAttribute('aMask', new THREE.BufferAttribute(m, 1));
  return geo;
}

// book: unit box, bottom-anchored. Spine faces +z, covers ±x, pages elsewhere.
function bookGeo() {
  const g = new THREE.BoxGeometry(1, 1, 1);
  g.translate(0, 0.5, 0);
  const n = g.attributes.normal;
  const uv = g.attributes.uv;
  const col = new Float32Array(n.count * 3);
  const page = new THREE.Color(0xe9dcc0);
  for (let i = 0; i < n.count; i++) {
    const spine = n.getZ(i) > 0.5;
    const cover = Math.abs(n.getX(i)) > 0.5;
    const c = spine || cover ? [1, 1, 1] : [page.r, page.g, page.b];
    col.set(c, i * 3);
    // spine gets the band texture (left half), everything else plain white (right half)
    if (spine) uv.setXY(i, uv.getX(i) * 0.5, uv.getY(i));
    else uv.setXY(i, 0.75, 0.5);
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  maskAttr(g, (p, nn, i) => (nn.getZ(i) > 0.5 || Math.abs(nn.getX(i)) > 0.5 ? 1 : 0));
  return g;
}

function spineTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#fff';
  g.fillRect(0, 0, 64, 128);
  // left half: spine with bands, a paper label and stitching
  g.fillStyle = 'rgba(0,0,0,0.28)';
  g.fillRect(0, 8, 32, 5);
  g.fillRect(0, 115, 32, 5);
  g.fillStyle = 'rgba(230,200,120,0.85)';
  g.fillRect(0, 16, 32, 3);
  g.fillRect(0, 108, 32, 3);
  g.fillStyle = 'rgba(245,236,214,0.95)';
  g.fillRect(8, 30, 16, 34);
  g.fillStyle = 'rgba(40,30,25,0.6)';
  for (let k = 0; k < 4; k++) g.fillRect(12, 36 + k * 7, 8, 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// scroll lying along x: paper roll + darker knobs
function scrollGeo() {
  const roll = new THREE.CylinderGeometry(1, 1, 1, 10, 1);
  roll.rotateZ(Math.PI / 2);
  const knobL = new THREE.CylinderGeometry(0.7, 0.7, 0.12, 8);
  knobL.rotateZ(Math.PI / 2);
  knobL.translate(-0.56, 0, 0);
  const knobR = knobL.clone();
  knobR.translate(1.12, 0, 0);
  const parts = [roll, knobL, knobR].map((g) => g.toNonIndexed());
  const pos = [];
  const nor = [];
  const col = [];
  const mask = [];
  parts.forEach((g, k) => {
    pos.push(...g.attributes.position.array);
    nor.push(...g.attributes.normal.array);
    for (let i = 0; i < g.attributes.position.count; i++) {
      col.push(...(k === 0 ? [1, 1, 1] : [0.2, 0.12, 0.08]));
      mask.push(k === 0 ? 1 : 0);
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('aMask', new THREE.Float32BufferAttribute(mask, 1));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(new Array((pos.length / 3) * 2).fill(0.75), 2));
  return g;
}

// silk lantern: an oval glowing body (instanced, unlit HDR)
function lanternBodyGeo(kind) {
  if (kind === 'paper') {
    const g = new THREE.CylinderGeometry(0.2, 0.2, 0.42, 14, 1);
    return g;
  }
  return lathe(
    [
      [0.05, -0.27],
      [0.2, -0.22],
      [0.28, -0.08],
      [0.29, 0.04],
      [0.26, 0.16],
      [0.18, 0.25],
      [0.05, 0.28]
    ],
    14
  );
}

export function defineProps(kit, tier) {
  const inst = kit.instancer;
  const books = makeMasked({ roughness: 0.85, map: spineTexture() });
  const masked = makeMasked({ roughness: 0.8 });
  inst.define('book', bookGeo(), books, { cast: true, receive: true });
  inst.define('scroll', scrollGeo(), masked, { cast: true, receive: true });
  const glowRed = makeGlow({ intensity: 2.6, color: 0xffffff });
  const glowPaper = makeGlow({ intensity: 2.4, color: 0xffffff });
  kit.lanternMats = [glowRed, glowPaper];
  inst.define('lanternRed', lanternBodyGeo('red'), glowRed, { cast: false, receive: false });
  inst.define('lanternPaper', lanternBodyGeo('paper'), glowPaper, { cast: false, receive: false });
  // cap + tassel for every lantern
  const cap = new THREE.CylinderGeometry(0.12, 0.15, 0.06, 10);
  cap.translate(0, 0.3, 0);
  const capB = cap.clone();
  capB.translate(0, -0.6, 0);
  const tassel = new THREE.CylinderGeometry(0.015, 0.05, 0.3, 6);
  tassel.translate(0, -0.48, 0);
  const capGeo = prepGeo(mergeNonIndexed([cap, capB, tassel]), 0x3a2418, MAT.wood, 0.9);
  inst.define('lanternCap', capGeo, kit.mats.solid, { cast: true, receive: false });
  kit.halos = [];
  return { books, masked };
}

function mergeNonIndexed(list) {
  const pos = [];
  const nor = [];
  for (const g0 of list) {
    const g = g0.index ? g0.toNonIndexed() : g0;
    pos.push(...g.attributes.position.array);
    nor.push(...g.attributes.normal.array);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  return g;
}

// ---------------------------------------------------------------- books & shelves
const CLOTH = [0x8c4a32, 0x5c6a58, 0xb08a52, 0x3f4a52, 0xcbb994, 0x7a5c48, 0x9b7b3e, 0x4d3b30, 0x2f4256, 0x6b2e26, 0xd8cfb8];
const THREAD = [0x2f4256, 0x3a4a5c, 0x26364a, 0x5a6670]; // indigo wrappers of thread-bound books

// One bookcase: frame (merged) + books (instanced). Local: centred, front +z.
export function bookcase(B, x, y, z, ry, w = 1.8, h = 3.0, d = 0.45, shelves = 5, rand = Math.random, opts = {}) {
  B.pushT(x, y, z, ry);
  const wood = opts.wood || 0x6e4a32;
  const t = 0.05;
  B.box('solid', wood, t, h, d, -w / 2 + t / 2, 0, 0, { kind: MAT.wood });
  B.box('solid', wood, t, h, d, w / 2 - t / 2, 0, 0, { kind: MAT.wood });
  if (!opts.open) B.box('solid', 0x5a3a26, w, h, 0.03, 0, 0, -d / 2 + 0.015, { kind: MAT.wood });
  B.box('solid', wood, w + 0.12, 0.08, d + 0.08, 0, h, 0, { kind: MAT.wood, chamfer: 0.015 });
  B.box('solid', wood, w, 0.1, d, 0, 0, 0, { kind: MAT.wood });
  const gap = (h - 0.15) / shelves;
  const density = opts.density !== undefined ? opts.density : 1;
  for (let s = 0; s < shelves; s++) {
    const sy = 0.1 + s * gap;
    B.box('solid', wood, w - t * 2, 0.035, d - 0.02, 0, sy, 0, { kind: MAT.wood });
    // fill: upright books, a flat stack of thread-bound volumes, or scrolls
    const mode = opts.scrolls && rand() < 0.35 ? 'scroll' : 'books';
    let cx = -w / 2 + t + 0.02;
    const maxX = w / 2 - t - 0.02;
    if (mode === 'scroll') {
      const rows = Math.max(2, Math.floor((gap - 0.06) / 0.09));
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < 3; c++) {
          if (rand() > density * 0.95) continue;
          const len = (w - 0.2) / 3 - 0.06;
          B.inst('scroll', -w / 2 + 0.12 + (c + 0.5) * ((w - 0.2) / 3), sy + 0.08 + r * 0.085, (rand() - 0.5) * 0.06, 0, 1, rand() < 0.5 ? 0xe8dcc0 : 0xd8c49a, 1, 0, 0);
          // scale: roll radius 0.035, length len
          const last = B.instancer.defs.get('scroll');
          const m = last.matrices[last.matrices.length - 1];
          m.multiply(new THREE.Matrix4().makeScale(len, 0.035, 0.035));
        }
      continue;
    }
    while (cx < maxX - 0.03) {
      if (rand() > density) {
        cx += 0.08 + rand() * 0.15;
        continue;
      }
      if (rand() < 0.12) {
        // flat stack of thread-bound books in indigo wrappers
        const sw = 0.22 + rand() * 0.08;
        if (cx + sw > maxX) break;
        const n = 2 + Math.floor(rand() * 5);
        for (let k = 0; k < n; k++) {
          const c = THREAD[Math.floor(rand() * THREAD.length)];
          const m = mat4(cx + sw / 2, sy + 0.035 + k * 0.045, 0.02, (rand() - 0.5) * 0.12, 1, 1, 1, 0, Math.PI / 2);
          m.multiply(new THREE.Matrix4().makeScale(0.042, sw, d * 0.7));
          B.instM('book', m, c);
        }
        cx += sw + 0.02;
        continue;
      }
      const bw = 0.035 + rand() * 0.05;
      const bh = Math.min(gap - 0.06, (gap - 0.06) * (0.62 + rand() * 0.35));
      const bd = d * (0.62 + rand() * 0.28);
      if (cx + bw > maxX) break;
      const lean = rand() < 0.07 ? (rand() < 0.5 ? -1 : 1) * (0.15 + rand() * 0.25) : 0;
      const c = new THREE.Color(CLOTH[Math.floor(rand() * CLOTH.length)]).multiplyScalar(0.8 + rand() * 0.35);
      const m = mat4(cx + bw / 2, sy + 0.035, d / 2 - bd / 2 - 0.02 - rand() * 0.02, 0, 1, 1, 1, 0, lean);
      m.multiply(new THREE.Matrix4().makeScale(bw, bh, bd));
      B.instM('book', m, c);
      cx += bw + 0.004 + (lean ? 0.04 : 0);
    }
  }
  B.pop();
}

// a pile or open book on a table
export function bookPile(B, x, y, z, n, rand, ry = 0) {
  for (let k = 0; k < n; k++) {
    const w = 0.18 + rand() * 0.08;
    const dd = 0.24 + rand() * 0.06;
    const m = mat4(x + (rand() - 0.5) * 0.03, y + k * 0.032, z + (rand() - 0.5) * 0.03, ry + (rand() - 0.5) * 0.3, 1, 1, 1, 0, Math.PI / 2);
    m.multiply(new THREE.Matrix4().makeScale(0.03, w, dd));
    B.instM('book', m, rand() < 0.5 ? THREAD[Math.floor(rand() * 4)] : CLOTH[Math.floor(rand() * CLOTH.length)]);
  }
}
export function openBook(B, x, y, z, ry = 0) {
  for (const s of [-1, 1]) {
    B.box('solid', 0xf0e6d0, 0.2, 0.012, 0.28, x + Math.cos(ry) * s * 0.1, y, z - Math.sin(ry) * s * 0.1, { ry, rz: -s * 0.08, kind: MAT.plain });
  }
  B.box('solid', 0x4a3a2e, 0.42, 0.008, 0.3, x, y - 0.006, z, { ry, kind: MAT.cloth });
}

// ---------------------------------------------------------------- furniture
export function table(B, x, y, z, ry, w, d, h = 0.78, wood = 0x7a5236) {
  B.pushT(x, y, z, ry);
  B.box('solid', wood, w, 0.06, d, 0, h - 0.06, 0, { kind: MAT.wood, chamfer: 0.012 });
  B.box('solid', 0x4a3020, w - 0.12, 0.08, d - 0.1, 0, h - 0.14, 0, { kind: MAT.wood });
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) B.box('solid', wood, 0.06, h - 0.06, 0.06, sx * (w / 2 - 0.08), 0, sz * (d / 2 - 0.07), { kind: MAT.wood });
  // stretchers
  for (const sz of [-1, 1]) B.box('solid', wood, w - 0.2, 0.04, 0.03, 0, 0.12, sz * (d / 2 - 0.07), { kind: MAT.wood });
  B.pop();
}
export function bench(B, x, y, z, ry, w, wood = 0x6a4630) {
  B.pushT(x, y, z, ry);
  B.box('solid', wood, w, 0.06, 0.32, 0, 0.4, 0, { kind: MAT.wood, chamfer: 0.012 });
  for (const sx of [-1, 1]) {
    B.box('solid', wood, 0.06, 0.4, 0.26, sx * (w / 2 - 0.12), 0, 0, { kind: MAT.wood });
  }
  B.pop();
}
export function chair(B, x, y, z, ry, wood = 0x5a3a26) {
  B.pushT(x, y, z, ry);
  B.box('solid', wood, 0.5, 0.05, 0.44, 0, 0.45, 0, { kind: MAT.wood });
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) B.box('solid', wood, 0.04, sz < 0 ? 1.05 : 0.45, 0.04, sx * 0.22, 0, sz * 0.19, { kind: MAT.wood });
  B.box('solid', wood, 0.36, 0.5, 0.03, 0, 0.55, -0.2, { kind: MAT.wood });
  B.box('solid', wood, 0.6, 0.05, 0.06, 0, 1.03, -0.19, { kind: MAT.wood, chamfer: 0.01 }); // yoke rail
  B.pop();
}
export function stool(B, x, y, z, color = PAL.stone, r = 0.22, h = 0.45) {
  B.cyl('solid', color, r, h, x, y, z, { rTop: r * 0.85, seg: 10, kind: MAT.stone });
}
export function cushion(B, x, y, z, color) {
  B.cyl('solid', color, 0.28, 0.1, x, y, z, { rTop: 0.25, seg: 12, kind: MAT.cloth, jitter: 0.05 });
}
export function ladder(B, x, y, z, ry, h = 2.8, lean = 0.22) {
  B.pushT(x, y, z, ry);
  for (const sx of [-1, 1]) B.box('solid', 0x7a5a3a, 0.05, h, 0.05, sx * 0.22, 0, 0, { rx: -lean, kind: MAT.wood });
  for (let k = 1; k < Math.floor(h / 0.32); k++) {
    const yy = k * 0.32;
    B.box('solid', 0x7a5a3a, 0.44, 0.03, 0.03, 0, yy, -Math.sin(lean) * yy, { kind: MAT.wood });
  }
  B.pop();
}

// ---------------------------------------------------------------- lanterns
// hanging lantern: cord from y0 down to the body at y
export function hangingLantern(kit, B, x, y, z, kind = 'red', cordTop = null) {
  const color = kind === 'red' ? 0xff5a2a : 0xffd9a0;
  B.inst(kind === 'red' ? 'lanternRed' : 'lanternPaper', x, y, z, 0, 1, color);
  B.inst('lanternCap', x, y, z, 0, kind === 'paper' ? 0.9 : 1);
  if (cordTop !== null) B.rod('solid', 0x2a1e18, x, y + 0.3, z, x, cordTop, z, 0.008, { seg: 3 });
  const p = B.toWorld(x, y, z);
  kit.halos.push({ x: p.x, y: p.y, z: p.z, s: kind === 'red' ? 1.6 : 1.4, c: kind === 'red' ? 0xff7a40 : 0xffc880 });
}

export function stoneLantern(kit, B, x, y, z, s = 1) {
  B.pushT(x, y, z, 0, s);
  B.box('solid', PAL.stone, 0.6, 0.18, 0.6, 0, 0, 0, { kind: MAT.stone, chamfer: 0.02 });
  B.cyl('solid', PAL.stone, 0.1, 0.75, 0, 0.18, 0, { seg: 8, kind: MAT.stone });
  B.box('solid', PAL.stone, 0.5, 0.1, 0.5, 0, 0.93, 0, { kind: MAT.stone });
  // light chamber with glowing openings
  B.box('solid', PAL.stoneGrey, 0.36, 0.34, 0.36, 0, 1.03, 0, { kind: MAT.stone });
  B.box('glow', 0xffb060, 0.26, 0.2, 0.38, 0, 1.1, 0, { kind: MAT.plain });
  B.box('glow', 0xffb060, 0.38, 0.2, 0.26, 0, 1.1, 0, { kind: MAT.plain });
  B.cone('solid', PAL.stone, 0.42, 0.32, 0, 1.37, 0, { seg: 6, kind: MAT.stone });
  B.sphere('solid', PAL.stone, 0.07, 0, 1.74, 0, { seg: 6, kind: MAT.stone });
  B.pop();
  const p = B.toWorld(x, y + 1.15 * s, z);
  kit.halos.push({ x: p.x, y: p.y, z: p.z, s: 1.1 * s, c: 0xffb060 });
}

export function lanternPost(kit, B, x, y, z) {
  B.box('solid', 0x4a3426, 0.12, 2.1, 0.12, x, y, z, { kind: MAT.wood });
  B.box('solid', 0x3a2a20, 0.42, 0.06, 0.42, x, y + 2.1, z, { kind: MAT.wood });
  B.box('glow', 0xffcf90, 0.3, 0.38, 0.3, x, y + 2.16, z, { kind: MAT.plain });
  B.cone('solid', 0x2e2620, 0.32, 0.22, x, y + 2.54, z, { seg: 4, ry: Math.PI / 4 });
  const p = B.toWorld(x, y + 2.35, z);
  kit.halos.push({ x: p.x, y: p.y, z: p.z, s: 1.3, c: 0xffc070 });
}

// ---------------------------------------------------------------- court furniture
export function incenseBurner(B, x, y, z) {
  // bronze tripod cauldron (鼎) on a stone base
  B.box('solid', PAL.stone, 1.5, 0.35, 1.5, x, y, z, { kind: MAT.stone, chamfer: 0.04 });
  const body = lathe(
    [
      [0, 0],
      [0.45, 0.02],
      [0.62, 0.22],
      [0.66, 0.5],
      [0.6, 0.72],
      [0.68, 0.78],
      [0.68, 0.84],
      [0.55, 0.84]
    ],
    16
  );
  B.add('solid', body, mat4(x, y + 0.75, z), 0x4a4434, { kind: MAT.gold, ao: 0.85 });
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2;
    B.cyl('solid', 0x3e3a2e, 0.07, 0.42, x + Math.cos(a) * 0.38, y + 0.35, z + Math.sin(a) * 0.38, { rTop: 0.1, seg: 6, kind: MAT.gold });
  }
  for (const s of [-1, 1]) B.box('solid', 0x4a4434, 0.08, 0.4, 0.3, x + s * 0.58, y + 1.55, z, { kind: MAT.gold }); // ears
  B.cyl('solid', 0x2a2620, 0.5, 0.05, x, y + 1.56, z, { seg: 14, kind: MAT.plain }); // ash
  return { x, y: y + 1.62, z };
}
export function waterVat(B, x, y, z) {
  const g = lathe(
    [
      [0, 0],
      [0.55, 0.05],
      [0.78, 0.4],
      [0.82, 0.8],
      [0.78, 0.98],
      [0.7, 0.98],
      [0.7, 0.9]
    ],
    18
  );
  B.box('solid', PAL.stone, 1.4, 0.3, 1.4, x, y, z, { kind: MAT.stone, chamfer: 0.03 });
  B.add('solid', g, mat4(x, y + 0.3, z), 0x5b4c36, { kind: MAT.gold, ao: 0.85 });
  B.cyl('solid', 0x22302c, 0.7, 0.02, x, y + 1.15, z, { seg: 18, kind: MAT.plain, ao: 0.6 });
}
export function noticeBoard(B, x, y, z, ry, w = 3.2, rand = Math.random) {
  B.pushT(x, y, z, ry);
  for (const sx of [-1, 1]) B.box('solid', 0x4a3020, 0.14, 2.5, 0.14, sx * (w / 2), 0, 0, { kind: MAT.wood });
  B.box('solid', 0x6a4a30, w, 1.3, 0.06, 0, 0.95, 0, { kind: MAT.wood });
  B.box('solid', 0x3a2a20, w + 0.5, 0.08, 0.5, 0, 2.5, 0, { kind: MAT.wood });
  B.cone('solid', 0x3d3c3b, (w + 0.8) * 0.72, 0.4, 0, 2.55, 0, { seg: 4, ry: Math.PI / 4, kind: MAT.plain });
  // posted claims: paper sheets, a few with a red seal
  let px = -w / 2 + 0.25;
  while (px < w / 2 - 0.3) {
    const sw = 0.36 + rand() * 0.2;
    const sh = 0.5 + rand() * 0.3;
    const sy = 1.0 + rand() * (1.15 - sh);
    B.box('solid', 0xf2e8d2, sw, sh, 0.01, px + sw / 2, sy, 0.04, { kind: MAT.plain, rz: (rand() - 0.5) * 0.05 });
    for (let l = 0; l < 4; l++) B.box('solid', 0x4a4038, sw * 0.7, 0.012, 0.012, px + sw / 2, sy + sh - 0.1 - l * 0.06, 0.05, { kind: MAT.plain });
    if (rand() < 0.5) B.box('solid', 0xb0432c, 0.07, 0.07, 0.012, px + sw - 0.1, sy + 0.08, 0.05, { kind: MAT.plain });
    px += sw + 0.08 + rand() * 0.1;
  }
  B.pop();
}
export function goTable(B, x, y, z, rand = Math.random) {
  B.cyl('solid', PAL.stone, 0.35, 0.65, x, y, z, { rTop: 0.25, seg: 10, kind: MAT.stone });
  B.box('solid', 0xb8ad98, 0.8, 0.1, 0.8, x, y + 0.65, z, { kind: MAT.stone, chamfer: 0.02 });
  // board lines + stones
  B.box('solid', 0x8a7a5a, 0.62, 0.005, 0.62, x, y + 0.75, z, { kind: MAT.plain });
  for (let k = 0; k < 26; k++) B.cyl('solid', rand() < 0.5 ? 0x1c1a18 : 0xf2efe8, 0.014, 0.012, x + (Math.floor(rand() * 13) - 6) * 0.045, y + 0.755, z + (Math.floor(rand() * 13) - 6) * 0.045, { seg: 6, kind: MAT.plain });
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
    stool(B, x + Math.cos(a) * 0.85, y, z + Math.sin(a) * 0.85, PAL.stone, 0.2, 0.42);
  }
}
export function pottedPlant(B, x, y, z, rand = Math.random) {
  B.cyl('solid', 0x6a5a48, 0.24, 0.32, x, y, z, { rTop: 0.3, seg: 10, kind: MAT.stone });
  for (let k = 0; k < 5; k++)
    B.sphere('solid', rand() < 0.3 ? 0x7a5a2a : 0x3e5a34, 0.14 + rand() * 0.1, x + (rand() - 0.5) * 0.3, y + 0.42 + rand() * 0.3, z + (rand() - 0.5) * 0.3, { seg: 6, kind: MAT.plain });
}
export function haystack(B, x, y, z, s = 1) {
  B.cyl('solid', 0xc8a860, 0.9 * s, 1.1 * s, x, y, z, { rTop: 1.0 * s, seg: 10, kind: MAT.plain, jitter: 0.06 });
  B.cone('solid', 0xb8985a, 1.05 * s, 1.0 * s, x, y + 1.1 * s, z, { seg: 10, kind: MAT.plain });
  B.cyl('solid', 0x5a4a30, 0.04, 0.6 * s, x, y + 2.0 * s, z, { seg: 4 });
}

// ---------------------------------------------------------------- halos (additive billboards for lamps)
export function createHalos(list) {
  const n = list.length;
  const base = new THREE.PlaneGeometry(1, 1);
  const g = new THREE.InstancedBufferGeometry();
  g.index = base.index;
  g.attributes.position = base.attributes.position;
  g.attributes.uv = base.attributes.uv;
  const off = new Float32Array(n * 4);
  const col = new Float32Array(n * 3);
  const c = new THREE.Color();
  list.forEach((h, i) => {
    off.set([h.x, h.y, h.z, h.s], i * 4);
    c.set(h.c);
    col.set([c.r, c.g, c.b], i * 3);
  });
  g.setAttribute('iOff', new THREE.InstancedBufferAttribute(off, 4));
  g.setAttribute('iCol', new THREE.InstancedBufferAttribute(col, 3));
  g.instanceCount = n;
  const mat = new THREE.ShaderMaterial({
    uniforms: Object.assign({}, U, { uHalo: { value: 1 } }),
    vertexShader: /* glsl */ `
      attribute vec4 iOff;
      attribute vec3 iCol;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vCol;
      varying float vFlick;
      void main() {
        vUv = uv;
        vCol = iCol;
        float ph = dot( iOff.xz, vec2( 1.7, 2.3 ) );
        vFlick = 0.85 + 0.09 * sin( uTime * 7.3 + ph ) + 0.06 * sin( uTime * 13.1 + ph * 1.7 );
        vec4 mv = viewMatrix * vec4( iOff.xyz, 1.0 );
        mv.xy += position.xy * iOff.w;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uLamp;
      uniform float uHalo;
      varying vec2 vUv;
      varying vec3 vCol;
      varying float vFlick;
      void main() {
        float d = length( vUv - 0.5 ) * 2.0;
        float a = exp( - d * d * 5.0 ) * ( 1.0 - smoothstep( 0.75, 1.0, d ) );
        gl_FragColor = vec4( vCol * a * 0.85 * vFlick * uLamp * uHalo, 1.0 );
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false
  });
  mat.userData.loqPatched = true;
  const mesh = new THREE.Mesh(g, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 5;
  mesh.name = 'halos';
  return mesh;
}

export { CLOTH, THREAD, rng };
