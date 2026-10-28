import * as THREE from 'three';
import { Builder, MAT, mat4 } from '../core/builder.js';
import { taperedTube, ribbon } from '../core/geom.js';
import { rng, noise2, smoothstep, clamp } from '../core/rng.js';
import { makeFoliage } from '../core/materials.js';
import { makeLeafAtlas } from '../core/textures.js';
import { LAYER_REFLECT } from '../core/config.js';

// Procedural trees. Wood is tapered tubes; crowns are clusters of
// alpha-tested leaf cards whose normals point away from the crown centre, so
// the crown shades like a soft volume with a leafy silhouette. Wood and leaves
// share one wind-flex field so they sway together. Each species variant is
// built once and instanced; distant forests are ink-wash tree silhouettes on
// crossed quads (点叶法) that melt into the mist.

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const I = new THREE.Matrix4();
const CELL = { broad: [0, 0], ginkgo: [0.5, 0], pine: [0, 0.5], maple: [0.5, 0.5] };

const _d = new THREE.Vector3();
const _u = new THREE.Vector3();
const _w = new THREE.Vector3();
const _n = new THREE.Vector3();
const _c = new THREE.Color();

// leaf-card cluster around c (radius r, vertically squashed by flat)
function cluster(B, c, r, flat, cell, color, rand, crownC, crownR, flexFn, cards, cardScale = 1) {
  for (let k = 0; k < cards; k++) {
    // direction biased upward and outward
    _d.set(rand() * 2 - 1, rand() * 1.6 - 0.6, rand() * 2 - 1).normalize();
    const depth = k < cards * 0.25 ? 0.25 + rand() * 0.35 : 0.6 + rand() * 0.45;
    const px = c.x + _d.x * r * depth;
    const py = c.y + _d.y * r * depth * flat;
    const pz = c.z + _d.z * r * depth;
    // spherical normal from the whole crown, mixed with the cluster's
    _n.set(px - crownC.x, (py - crownC.y) * 1.2, pz - crownC.z).normalize().multiplyScalar(0.7).addScaledVector(_d, 0.3).normalize();
    // random card plane
    _w.set(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize();
    _u.crossVectors(_w, Math.abs(_w.y) > 0.9 ? V(1, 0, 0) : V(0, 1, 0)).normalize();
    const vv = new THREE.Vector3().crossVectors(_u, _w).normalize();
    const s = r * (0.62 + rand() * 0.36) * cardScale;
    const corners = [
      [px - _u.x * s - vv.x * s, py - _u.y * s - vv.y * s, pz - _u.z * s - vv.z * s],
      [px + _u.x * s - vv.x * s, py + _u.y * s - vv.y * s, pz + _u.z * s - vv.z * s],
      [px + _u.x * s + vv.x * s, py + _u.y * s + vv.y * s, pz + _u.z * s + vv.z * s],
      [px - _u.x * s + vv.x * s, py - _u.y * s + vv.y * s, pz - _u.z * s + vv.z * s]
    ];
    const [cu, cv] = CELL[cell];
    const e = 0.004;
    const uv = [
      [cu + e, cv + e],
      [cu + 0.5 - e, cv + e],
      [cu + 0.5 - e, cv + 0.5 - e],
      [cu + e, cv + 0.5 - e]
    ];
    const dist = Math.hypot(px - crownC.x, (py - crownC.y) * 1.2, pz - crownC.z) / crownR;
    const ao = clamp(0.45 + 0.65 * dist, 0.4, 1);
    const shade = (0.95 + 0.3 * (rand() - 0.5)) * (0.88 + 0.22 * Math.max(0, _n.y)) * (depth < 0.6 ? 0.86 : 1);
    _c.set(color).multiplyScalar(shade);
    B.quad('cards', corners, [_n.x, _n.y, _n.z], uv, _c.clone(), 0, 0, flexFn(V(px, py, pz)), ao);
  }
}

const BARK = { pine: 0x4a3a2f, ginkgo: 0x5a4a3e, maple: 0x4d3b33, willow: 0x4f4538, osman: 0x4a4038, persim: 0x3e322b, broad: 0x50443a };

const trunkFlex = (H) => (p) => Math.pow(clamp(p.y / H, 0, 1), 1.7) * 0.9;

function barkShade(geo) {
  if (!geo) return;
  const c = geo.attributes.color;
  const p = geo.attributes.position;
  const info = geo.attributes.aInfo;
  for (let i = 0; i < p.count; i++) {
    const k = 0.72 + 0.38 * smoothstep(0, 4, p.getY(i)) + 0.12 * (noise2(p.getX(i) * 9, p.getY(i) * 3) - 0.5);
    c.setXYZ(i, c.getX(i) * k, c.getY(i) * k, c.getZ(i) * k);
    info.setW(i, 0.55 + 0.45 * smoothstep(0, 3, p.getY(i)));
  }
}

function pine(seed, H, q) {
  const r = rng(seed);
  const B = new Builder(seed);
  const lean = (r() - 0.5) * 0.7;
  const twist = r() * 6;
  const pts = [];
  for (let i = 0; i <= 6; i++) {
    const t = i / 6;
    pts.push(V(lean * H * t * t * 0.35 + Math.sin(t * 4 + twist) * 0.38 * t, H * t, Math.cos(t * 3.4 + twist) * 0.32 * t));
  }
  const trunk = new THREE.CatmullRomCurve3(pts);
  const flex = trunkFlex(H);
  B.add('wood', taperedTube(trunk, (t) => 0.42 * (1 - 0.78 * t) + 0.05, 7, 12), I, BARK.pine, { kind: MAT.wood, flexFn: flex });
  const crownC = V(lean * H * 0.2, H * 0.72, 0);
  const pads = [];
  const nb = 6 + Math.floor(r() * 3);
  for (let k = 0; k < nb; k++) {
    const t = 0.36 + 0.56 * (k / nb) + (r() - 0.5) * 0.05;
    const p0 = trunk.getPoint(t);
    const ang = k * 2.39 + r() * 0.7;
    const len = (1.25 - t) * (2.6 + r() * 1.8) * (H / 10);
    const dir = V(Math.cos(ang), 0.12 + r() * 0.22, Math.sin(ang));
    const mid = p0.clone().addScaledVector(dir, len * 0.55).add(V(0, -0.25, 0));
    const end = p0.clone().addScaledVector(dir, len).add(V(0, 0.35, 0));
    B.add('wood', taperedTube(new THREE.CatmullRomCurve3([p0, mid, end]), (u) => (0.13 * (1 - t) + 0.04) * (1 - 0.7 * u), 5, 6), I, BARK.pine, { kind: MAT.wood, flexFn: flex });
    const pr = 0.75 + len * 0.36;
    pads.push([end.clone().add(V(0, 0.12, 0)), pr]);
    if (len > 1.8) pads.push([mid.clone().add(V(dir.x * 0.2, 0.45, dir.z * 0.2)), pr * 0.7]);
  }
  const top = trunk.getPoint(1);
  pads.push([top.clone().add(V(0, 0.2, 0)), 1.45]);
  pads.push([top.clone().add(V(0.4, -0.6, -0.3)), 1.15]);
  for (const [p, pr] of pads) cluster(B, p, pr, 0.36, 'pine', r() < 0.5 ? 0x34503a : 0x3f5c3e, r, crownC, H * 0.45, flex, q.cards, 1.05);
  const wood = B.toGeometry('wood');
  barkShade(wood);
  return { wood, cards: B.toGeometry('cards') };
}

function broadleaf(seed, o, q) {
  const r = rng(seed);
  const B = new Builder(seed);
  const H = o.H * (0.85 + r() * 0.3);
  const flex = trunkFlex(H);
  const trunkH = H * o.trunkFrac;
  const lean = (r() - 0.5) * 0.35;
  const trunk = new THREE.CatmullRomCurve3([V(0, 0, 0), V(lean * 0.4, trunkH * 0.5, 0.1), V(lean, trunkH, -0.05)]);
  B.add('wood', taperedTube(trunk, (t) => o.r0 * (1 - 0.45 * t), 7, 6), I, o.bark, { kind: MAT.wood, flexFn: flex });
  const crownC = V(lean, trunkH + (H - trunkH) * 0.5, 0);
  const crownR = Math.max(o.cr, (H - trunkH) * 0.5);
  const limbs = o.limbs + Math.floor(r() * 2);
  const ends = [];
  for (let k = 0; k < limbs; k++) {
    const ang = (k / limbs) * Math.PI * 2 + r() * 0.8;
    const up = o.upright * (0.7 + r() * 0.5);
    const len = (H - trunkH) * (0.55 + r() * 0.35);
    const p0 = trunk.getPoint(1);
    const dir = V(Math.cos(ang) * (1 - up), up, Math.sin(ang) * (1 - up)).normalize();
    const end = p0.clone().addScaledVector(dir, len);
    const mid = p0.clone().lerp(end, 0.5).add(V((r() - 0.5) * 0.5, 0.2, (r() - 0.5) * 0.5));
    B.add('wood', taperedTube(new THREE.CatmullRomCurve3([p0, mid, end]), (u) => o.r0 * 0.55 * (1 - 0.75 * u), 5, 5), I, o.bark, { kind: MAT.wood, flexFn: flex });
    // a few twigs off each limb
    for (let t = 0; t < 2; t++) {
      const tp = p0.clone().lerp(end, 0.55 + r() * 0.35);
      const te = tp.clone().add(V((r() - 0.5) * 1.6, 0.4 + r() * 0.6, (r() - 0.5) * 1.6));
      B.add('wood', taperedTube(new THREE.CatmullRomCurve3([tp, tp.clone().lerp(te, 0.5), te]), (u) => o.r0 * 0.2 * (1 - 0.8 * u), 4, 3), I, o.bark, { kind: MAT.wood, flexFn: flex });
      ends.push(te);
    }
    ends.push(end, mid);
  }
  const n = o.blobs;
  for (let k = 0; k < n; k++) {
    let p;
    if (k < ends.length) p = ends[k].clone();
    else {
      const a = r() * Math.PI * 2;
      const e = (r() - 0.35) * 1.4;
      p = crownC.clone().add(V(Math.cos(a) * o.cr * (0.5 + r() * 0.5), e * (H - trunkH) * 0.4, Math.sin(a) * o.cr * (0.5 + r() * 0.5)));
    }
    const s = o.bs * (0.75 + r() * 0.5);
    const col = o.colors[Math.floor(r() * o.colors.length)];
    cluster(B, p, s, o.flat, o.cell, col, r, crownC, crownR, flex, q.cards);
  }
  if (o.fruit) {
    for (let k = 0; k < o.fruit; k++) {
      const a = r() * Math.PI * 2;
      const p = crownC.clone().add(V(Math.cos(a) * o.cr * 0.85, (r() - 0.4) * (H - trunkH) * 0.5, Math.sin(a) * o.cr * 0.85));
      B.sphere('extra', 0xe86a1c, 0.11, p.x, p.y, p.z, { seg: 6, flexFn: flex });
    }
  }
  const wood = B.toGeometry('wood');
  barkShade(wood);
  return { wood, cards: B.toGeometry('cards'), extra: B.toGeometry('extra') };
}

function willow(seed, q) {
  const r = rng(seed);
  const B = new Builder(seed);
  const H = 7.5 + r() * 2;
  const flex = trunkFlex(H);
  const lean = 0.6 + r() * 0.8;
  const trunk = new THREE.CatmullRomCurve3([V(0, 0, 0), V(lean * 0.3, H * 0.35, 0.1), V(lean * 0.8, H * 0.62, -0.1), V(lean * 1.1, H * 0.8, 0)]);
  B.add('wood', taperedTube(trunk, (t) => 0.36 * (1 - 0.6 * t) + 0.05, 7, 8), I, BARK.willow, { kind: MAT.wood, flexFn: flex });
  const top = trunk.getPoint(1);
  const crownC = V(lean, H * 0.82, 0);
  const limbs = [];
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 + r();
    const len = 1.8 + r() * 1.4;
    const end = top.clone().add(V(Math.cos(a) * len, 0.7 + r() * 0.9, Math.sin(a) * len));
    B.add('wood', taperedTube(new THREE.CatmullRomCurve3([top, top.clone().lerp(end, 0.5).add(V(0, 0.4, 0)), end]), (u) => 0.12 * (1 - 0.8 * u), 5, 5), I, BARK.willow, { kind: MAT.wood, flexFn: flex });
    limbs.push(end);
    cluster(B, end.clone().add(V(0, 0.1, 0)), 1.1, 0.6, 'broad', 0x8f9a4c, r, crownC, 3.5, flex, Math.round(q.cards * 0.6), 0.8);
  }
  // hanging strands (枝条) that swing more toward their tips
  const strands = q.strands;
  for (let k = 0; k < strands; k++) {
    const L = limbs[k % limbs.length];
    const a = r() * Math.PI * 2;
    const rr = r() * 1.5;
    const start = L.clone().add(V(Math.cos(a) * rr, -0.1 + r() * 0.4, Math.sin(a) * rr));
    const len = 2.6 + r() * 3.2;
    const drift = V(Math.cos(a) * 0.25, 0, Math.sin(a) * 0.25);
    const pts = [];
    for (let s = 0; s <= 6; s++) {
      const t = s / 6;
      pts.push(start.clone().add(V(drift.x * t * (1 + t), -len * t, drift.z * t * (1 + t))));
    }
    const side = V(Math.cos(a + Math.PI / 2), 0, Math.sin(a + Math.PI / 2));
    const g = ribbon(pts, (t) => 0.045 * (1 - 0.5 * t), side);
    const base = flex(V(0, start.y, 0));
    B.add('extra', g, I, r() < 0.5 ? 0xb4b462 : 0x9eaa56, { flexFn: (p) => base + clamp((start.y - p.y) / len, 0, 1) * 1.4, ao: 0.85 });
  }
  const wood = B.toGeometry('wood');
  barkShade(wood);
  return { wood, cards: B.toGeometry('cards'), extra: B.toGeometry('extra') };
}

export const SPECIES = {
  pine: (s, q) => pine(s, 9 + (s % 3) * 1.5, q),
  ginkgo: (s, q) =>
    broadleaf(s, { H: 14, trunkFrac: 0.4, r0: 0.38, limbs: 5, upright: 0.62, cr: 3.0, blobs: 18, bs: 1.25, flat: 0.95, cell: 'ginkgo', bark: BARK.ginkgo, colors: [0xd9a83c, 0xe0b448, 0xcf9a34, 0xc8a24a, 0xb89a4a] }, q),
  maple: (s, q) =>
    broadleaf(s, { H: 7.5, trunkFrac: 0.3, r0: 0.26, limbs: 4, upright: 0.42, cr: 3.2, blobs: 16, bs: 1.15, flat: 0.8, cell: 'maple', bark: BARK.maple, colors: [0xb5432c, 0xc45a30, 0xa8392a, 0xc8703a, 0x9a3a2c] }, q),
  osmanthus: (s, q) =>
    broadleaf(s, { H: 5.2, trunkFrac: 0.22, r0: 0.18, limbs: 4, upright: 0.5, cr: 2.2, blobs: 14, bs: 1.0, flat: 0.95, cell: 'broad', bark: BARK.osman, colors: [0x41603a, 0x4a683e, 0x3a5634, 0x58703f] }, q),
  persimmon: (s, q) =>
    broadleaf(s, { H: 6.5, trunkFrac: 0.3, r0: 0.22, limbs: 5, upright: 0.45, cr: 2.8, blobs: 10, bs: 0.85, flat: 0.75, cell: 'broad', bark: BARK.persim, colors: [0xa65a30, 0xb8763c, 0x8c4a2a, 0x9a6a38], fruit: 26 }, q),
  broad: (s, q) =>
    broadleaf(s, { H: 10, trunkFrac: 0.35, r0: 0.3, limbs: 5, upright: 0.5, cr: 3.6, blobs: 16, bs: 1.35, flat: 0.85, cell: 'broad', bark: BARK.broad, colors: [0x5d6c3c, 0x6b7342, 0x7a703c, 0x8a7a40, 0x52643a] }, q),
  willow: (s, q) => willow(s, q),
  shrub: (s, q) => shrub(s, q, [0x4d6a3c, 0x587442, 0x45603a]),
  shrubRed: (s, q) => shrub(s, q, [0x9a4a2c, 0x8a5a30, 0x6e6a3a])
};

// clipped garden shrub: no visible trunk, a few low clusters
function shrub(seed, q, colors) {
  const r = rng(seed);
  const B = new Builder(seed);
  const crownC = V(0, 0.55, 0);
  const n = 4 + Math.floor(r() * 3);
  const flex = (p) => clamp(p.y / 1.4, 0, 1) * 0.5;
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 + r();
    const rr = k === 0 ? 0 : 0.35 + r() * 0.3;
    const p = V(Math.cos(a) * rr, 0.45 + r() * 0.35, Math.sin(a) * rr);
    cluster(B, p, 0.5 + r() * 0.25, 0.8, 'broad', colors[Math.floor(r() * colors.length)], r, crownC, 1.0, flex, Math.round(q.cards * 0.7), 0.9);
  }
  return { wood: null, cards: B.toGeometry('cards'), extra: null };
}

// ---------------------------------------------------------------- far trees (a handful of leaf cards each)
// kind 0: conifer cone, 1: round broadleaf, 2: tall cypress, 3: spreading autumn tree
function farTreeGeo(kind) {
  const r = rng(500 + kind * 7);
  const B = new Builder(500 + kind);
  const H = kind === 2 ? 7 : kind === 0 ? 6 : 5;
  B.cyl('w', 0x3a2e26, 0.12, H * 0.45, 0, 0, 0, { seg: 4, rTop: 0.06 });
  const flex = (p) => clamp(p.y / H, 0, 1) * 0.5;
  const crownC = V(0, H * 0.62, 0);
  const cell = kind === 0 || kind === 2 ? 'pine' : 'broad';
  if (kind === 0 || kind === 2) {
    const tiers = kind === 2 ? 4 : 3;
    for (let k = 0; k < tiers; k++) {
      const y = H * (0.35 + (k / tiers) * 0.6);
      const rr = (kind === 2 ? 0.9 : 1.7) * (1 - k / (tiers + 0.6));
      cluster(B, V(0, y, 0), rr, 0.6, cell, 0xffffff, r, crownC, H * 0.5, flex, 5, 1.15);
    }
  } else {
    const n = kind === 3 ? 4 : 3;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + r();
      const off = k === 0 ? 0 : 0.9;
      cluster(B, V(Math.cos(a) * off, H * (0.6 + r() * 0.15), Math.sin(a) * off), kind === 3 ? 1.5 : 1.7, 0.85, cell, 0xffffff, r, crownC, H * 0.5, flex, 6, 1.1);
    }
  }
  return { wood: B.toGeometry('w'), cards: B.toGeometry('cards') };
}

// ---------------------------------------------------------------- forest manager
export function createTrees(tier) {
  const low = tier.name === 'low';
  const q = { cards: low ? 20 : 32, strands: low ? 120 : 220 };
  const leafTex = makeLeafAtlas(low ? 256 : 512);
  const wood = makeFoliage({ flex: 0.35, flutter: 0, translucency: 0, side: THREE.FrontSide });
  const cards = makeFoliage({ flex: 0.35, flutter: 0.035, translucency: 0.5, map: leafTex, alphaTest: 0.45, side: THREE.DoubleSide });
  const extra = makeFoliage({ flex: 0.55, flutter: 0.05, translucency: 0.45 });
  const far = makeFoliage({ flex: 0.15, flutter: 0, translucency: 0.3, map: leafTex, alphaTest: 0.45, side: THREE.DoubleSide });
  const variants = {};
  const nVar = low ? 2 : 3;
  for (const sp of Object.keys(SPECIES)) {
    variants[sp] = [];
    for (let v = 0; v < nVar; v++) variants[sp].push(SPECIES[sp](101 + v * 17 + sp.length * 7, q));
  }
  const farGeos = [0, 1, 2, 3].map(farTreeGeo);
  const lists = {};
  const add = (key, m, c = null) => (lists[key] ||= []).push({ m, c });
  const rand = rng(909);

  return {
    variants,
    plant(species, x, y, z, scale = 1, ry = null) {
      const vs = variants[species];
      const v = Math.floor(rand() * vs.length);
      add(`${species}${v}`, mat4(x, y, z, ry === null ? rand() * Math.PI * 2 : ry, scale * (0.9 + rand() * 0.2)));
    },
    // kind: 0 pine, 1 broadleaf, 2 cypress, 3 autumn
    farTree(kind, x, y, z, scale, color) {
      add(`far${kind}`, mat4(x, y, z, rand() * 6, scale, scale * (0.85 + rand() * 0.35), scale), color);
    },
    build() {
      const group = new THREE.Group();
      group.name = 'trees';
      const mk = (geo, mat, items, cast, reflect) => {
        if (!geo || !items || !items.length) return;
        const mesh = new THREE.InstancedMesh(geo, mat, items.length);
        const col = new THREE.Color();
        const anyC = items.some((it) => it.c !== null && it.c !== undefined);
        items.forEach((it, i) => {
          mesh.setMatrixAt(i, it.m);
          if (anyC) mesh.setColorAt(i, col.set(it.c ?? 0xffffff));
        });
        mesh.castShadow = cast;
        mesh.receiveShadow = true;
        if (reflect) mesh.layers.enable(LAYER_REFLECT);
        mesh.computeBoundingSphere();
        group.add(mesh);
      };
      for (const sp of Object.keys(variants)) {
        variants[sp].forEach((v, i) => {
          const items = lists[`${sp}${i}`];
          mk(v.wood, wood, items, true, true);
          mk(v.cards, cards, items, true, true);
          mk(v.extra, extra, items, true, true);
        });
      }
      farGeos.forEach((g, k) => {
        mk(g.wood, wood, lists[`far${k}`], false, false);
        mk(g.cards, far, lists[`far${k}`], !low, false);
      });
      return { group, materials: { wood, cards, extra, far } };
    }
  };
}
