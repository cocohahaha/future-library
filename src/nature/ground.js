import * as THREE from 'three';
import { Builder, MAT, mat4 } from '../core/builder.js';
import { blob, leafBlade, weld } from '../core/geom.js';
import { rng, noise2, ridged2, clamp, smoothstep } from '../core/rng.js';
import { makeFoliage, makeSolid } from '../core/materials.js';
import { LAYER_REFLECT, PAL } from '../core/config.js';

// Ground layer: bamboo, grass tufts, flowers, scholar's rocks (太湖石),
// boulders, shore stones, lotus, reeds and clipped shrubs. Everything is a
// handful of shared geometries drawn with InstancedMesh.

const I = new THREE.Matrix4();

// ---------------------------------------------------------------- bamboo (reference height 8 m)
function bambooGeos() {
  const B = new Builder(7);
  const H = 8;
  const segs = 10;
  // culm with node rings
  const culm = new THREE.CylinderGeometry(0.035, 0.05, H, 6, segs, true);
  culm.translate(0, H / 2, 0);
  B.add('culm', culm, I, 0x6f8a46, { kind: MAT.plain, flexFn: (p) => Math.pow(p.y / H, 2) * 1.2 });
  for (let k = 1; k < segs; k++) {
    const y = (k / segs) * H;
    const ring = new THREE.CylinderGeometry(0.052 - (k / segs) * 0.014, 0.052 - (k / segs) * 0.014, 0.05, 6, 1, false);
    ring.translate(0, y, 0);
    B.add('culm', ring, I, 0x5a7238, { kind: MAT.plain, flexFn: (p) => Math.pow(p.y / H, 2) * 1.2 });
  }
  // leaf sprays on the upper half: blades drooping outward
  const r = rng(13);
  const blade = leafBlade(0.32, 0.05, 3, 0.25);
  for (let k = 0; k < 46; k++) {
    const y = H * (0.42 + r() * 0.56);
    const a = r() * Math.PI * 2;
    const out = 0.1 + r() * 0.5;
    const m = mat4(Math.cos(a) * out, y, Math.sin(a) * out, -a + Math.PI / 2, 1 + r() * 0.5, 1 + r() * 0.5, 1, 1.1 + r() * 0.8, (r() - 0.5) * 0.6);
    const col = r() < 0.5 ? 0x6e8c48 : r() < 0.5 ? 0x5d7a3f : 0x8a9a52;
    B.add('leaf', blade, m, col, { flexFn: (p) => Math.pow(y / H, 2) * 1.2 + 0.15 });
  }
  const leaf = B.toGeometry('leaf');
  const cg = B.toGeometry('culm');
  // occlusion: lower culm darker
  for (const g of [leaf, cg]) {
    const info = g.attributes.aInfo;
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) info.setW(i, 0.45 + 0.55 * smoothstep(0, H, p.getY(i)));
  }
  return { culm: cg, leaf };
}

export function createBamboo(tier) {
  const g = bambooGeos();
  const culmMat = makeFoliage({ flex: 1.0, flutter: 0, translucency: 0.15, side: THREE.FrontSide, roughness: 0.6 });
  const leafMat = makeFoliage({ flex: 1.0, flutter: 0.06, translucency: 0.5 });
  const items = [];
  const rand = rng(31);
  return {
    // a grove: n culms scattered in a polygon-ish blob around (x,z)
    grove(x, z, radius, n, yFn, keep = () => true) {
      let placed = 0;
      let tries = 0;
      while (placed < n && tries++ < n * 6) {
        const a = rand() * Math.PI * 2;
        const rr = Math.sqrt(rand()) * radius;
        const px = x + Math.cos(a) * rr;
        const pz = z + Math.sin(a) * rr;
        if (!keep(px, pz)) continue;
        const h = 0.7 + rand() * 0.45;
        const thick = 0.8 + rand() * 0.5;
        const m = mat4(px, yFn(px, pz), pz, rand() * 6, thick, h, thick, (rand() - 0.5) * 0.12, (rand() - 0.5) * 0.12);
        items.push(m);
        placed++;
      }
    },
    build() {
      const group = new THREE.Group();
      group.name = 'bamboo';
      if (!items.length) return { group };
      const c = new THREE.InstancedMesh(g.culm, culmMat, items.length);
      const l = new THREE.InstancedMesh(g.leaf, leafMat, items.length);
      items.forEach((m, i) => {
        c.setMatrixAt(i, m);
        l.setMatrixAt(i, m);
      });
      for (const mesh of [c, l]) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.layers.enable(LAYER_REFLECT);
        mesh.computeBoundingSphere();
        group.add(mesh);
      }
      return { group, count: items.length };
    }
  };
}

// ---------------------------------------------------------------- grass tufts + flowers
function tuftGeo(blades = 7, h = 0.42) {
  const pos = [];
  const info = [];
  const r = rng(3);
  for (let k = 0; k < blades; k++) {
    const a = (k / blades) * Math.PI * 2 + r() * 0.6;
    const lean = 0.12 + r() * 0.22;
    const bh = h * (0.6 + r() * 0.6);
    const w = 0.028 + r() * 0.02;
    const cx = Math.cos(a) * 0.04;
    const cz = Math.sin(a) * 0.04;
    const tx = cx + Math.cos(a) * lean * bh;
    const tz = cz + Math.sin(a) * lean * bh;
    const px = -Math.sin(a) * w;
    const pz = Math.cos(a) * w;
    pos.push(cx - px, 0, cz - pz, cx + px, 0, cz + pz, tx, bh, tz);
    info.push(0, 0, 0, 0.55, 0, 0, 0, 0.55, 0, 0, 1, 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aInfo', new THREE.Float32BufferAttribute(info, 4));
  const n = pos.length / 3;
  // normals point up (soft meadow lighting); colours lighter at tips
  const nor = [];
  const col = [];
  for (let i = 0; i < n; i++) {
    nor.push(0, 1, 0);
    const tip = i % 3 === 2;
    col.push(tip ? 1.15 : 0.6, tip ? 1.15 : 0.62, tip ? 1.05 : 0.55);
  }
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(new Array(n * 2).fill(0), 2));
  return g;
}

function flowerGeo() {
  const B = new Builder(9);
  // a chrysanthemum clump: leafy base + a few round heads
  B.add('f', blob(0, 3, 0.2), mat4(0, 0.16, 0, 0, 0.26, 0.2, 0.26), 0x47603a, { flexFn: () => 0.3 });
  const r = rng(5);
  for (let k = 0; k < 4; k++) {
    const a = r() * 6.28;
    B.sphere('f', 0xffffff, 0.06, Math.cos(a) * 0.12, 0.34 + r() * 0.1, Math.sin(a) * 0.12, { seg: 6, sy: 0.6, flexFn: () => 0.8 });
  }
  return B.toGeometry('f');
}

export function createGrass(tier) {
  const mat = makeFoliage({ flex: 0.6, flutter: 0.03, translucency: 0.35, side: THREE.DoubleSide });
  const flowerMat = makeFoliage({ flex: 0.4, flutter: 0.02, translucency: 0.25, side: THREE.FrontSide });
  const tuft = tuftGeo();
  const fl = flowerGeo();
  // keep the leafy base green: flowers take the instance colour only on heads
  const fc = fl.attributes.color;
  const fp = fl.attributes.position;
  for (let i = 0; i < fp.count; i++) if (fp.getY(i) < 0.3) fc.setXYZ(i, 0.06, 0.11, 0.05);
  const items = [];
  const flowers = [];
  const rand = rng(77);
  return {
    add(x, y, z, s, color) {
      items.push({ m: mat4(x, y, z, rand() * 6.28, s, s * (0.8 + rand() * 0.5), s), c: color });
    },
    flower(x, y, z, color) {
      flowers.push({ m: mat4(x, y, z, rand() * 6.28, 0.9 + rand() * 0.5), c: color });
    },
    build() {
      const group = new THREE.Group();
      group.name = 'grass';
      const mk = (geo, m, list, cast) => {
        if (!list.length) return null;
        const mesh = new THREE.InstancedMesh(geo, m, list.length);
        const col = new THREE.Color();
        list.forEach((it, i) => {
          mesh.setMatrixAt(i, it.m);
          mesh.setColorAt(i, col.set(it.c));
        });
        mesh.castShadow = cast;
        mesh.receiveShadow = true;
        mesh.computeBoundingSphere();
        group.add(mesh);
        return mesh;
      };
      mk(tuft, mat, items, false);
      mk(fl, flowerMat, flowers, false);
      return { group, count: items.length };
    }
  };
}

// ---------------------------------------------------------------- rocks
// Taihu stone: tall, pitted, eroded limestone. Strong ridged displacement
// carves deep hollows; colour is pale grey with darker cavities.
function taihuGeo(seed) {
  const g = new THREE.IcosahedronGeometry(1, 3);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  const o = seed * 7.1;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const pit = ridged2(v.x * 2.2 + o, v.y * 2.4 + v.z * 1.7, 3);
    const lump = noise2(v.x * 1.3 - o, v.z * 1.3 + v.y);
    const k = 0.62 + 0.55 * lump - 0.45 * Math.pow(pit, 2.2);
    v.multiplyScalar(Math.max(0.18, k));
    v.x *= 0.62;
    v.z *= 0.55;
    v.y = v.y * 1.25 + 1.0;
    // waist: thinner in the middle like a classic scholar's rock
    const w = 1 - 0.28 * Math.exp(-((v.y - 0.9) ** 2) * 2.5);
    v.x *= w;
    v.z *= w;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  const m = weld(g);
  m.computeVertexNormals();
  // colours: darker in concavities (estimated by radial distance)
  const n = m.attributes.position.count;
  const col = new Float32Array(n * 3);
  const info = new Float32Array(n * 4);
  const pp = m.attributes.position;
  for (let i = 0; i < n; i++) {
    const x = pp.getX(i);
    const y = pp.getY(i) - 1;
    const z = pp.getZ(i);
    const rr = Math.sqrt((x / 0.6) ** 2 + (y / 1.25) ** 2 + (z / 0.55) ** 2);
    const k = clamp(0.45 + 0.6 * rr, 0.3, 1.05);
    const c = new THREE.Color(0xb9b6ad);
    col[i * 3] = c.r * k;
    col[i * 3 + 1] = c.g * k;
    col[i * 3 + 2] = c.b * k * 1.03;
    info[i * 4 + 1] = MAT.stone;
    info[i * 4 + 3] = clamp(0.3 + 0.75 * rr, 0, 1);
  }
  m.setAttribute('color', new THREE.BufferAttribute(col, 3));
  m.setAttribute('aInfo', new THREE.BufferAttribute(info, 4));
  return m;
}

function boulderGeo(seed, flat = 0.6) {
  const g = blob(2, seed, 0.32, 1.6);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) * flat + flat * 0.55);
  g.computeVertexNormals();
  const n = p.count;
  const col = new Float32Array(n * 3);
  const info = new Float32Array(n * 4);
  const c = new THREE.Color(0xa49c8c);
  for (let i = 0; i < n; i++) {
    const up = g.attributes.normal.getY(i);
    const k = 0.75 + 0.3 * up + 0.12 * (noise2(p.getX(i) * 3 + seed, p.getZ(i) * 3) - 0.5);
    // a little moss on top
    const moss = up > 0.6 && noise2(p.getX(i) * 2 - seed, p.getZ(i) * 2) > 0.55;
    col[i * 3] = (moss ? 0.17 : c.r) * k;
    col[i * 3 + 1] = (moss ? 0.22 : c.g) * k;
    col[i * 3 + 2] = (moss ? 0.09 : c.b) * k;
    info[i * 4 + 1] = MAT.stone;
    info[i * 4 + 3] = clamp(0.55 + 0.45 * (p.getY(i) / (flat * 1.6)), 0, 1);
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aInfo', new THREE.BufferAttribute(info, 4));
  return g;
}

export function createRocks(tier) {
  const mat = makeSolid({ detail: tier.detail, roughness: 0.95 });
  const kinds = {
    taihu: [taihuGeo(1), taihuGeo(2), taihuGeo(3)],
    boulder: [boulderGeo(4, 0.6), boulderGeo(5, 0.5), boulderGeo(6, 0.75)],
    slab: [boulderGeo(7, 0.22), boulderGeo(8, 0.18)]
  };
  const lists = {};
  const rand = rng(55);
  return {
    place(kind, x, y, z, s, sy = s, ry = null) {
      const k = `${kind}${Math.floor(rand() * kinds[kind].length)}`;
      (lists[k] ||= []).push(mat4(x, y, z, ry === null ? rand() * 6.28 : ry, s, sy, s));
    },
    build() {
      const group = new THREE.Group();
      group.name = 'rocks';
      for (const [kind, geos] of Object.entries(kinds)) {
        geos.forEach((geo, i) => {
          const list = lists[`${kind}${i}`];
          if (!list) return;
          const mesh = new THREE.InstancedMesh(geo, mat, list.length);
          list.forEach((m, j) => mesh.setMatrixAt(j, m));
          mesh.castShadow = kind !== 'slab';
          mesh.receiveShadow = true;
          mesh.layers.enable(LAYER_REFLECT);
          mesh.computeBoundingSphere();
          group.add(mesh);
        });
      }
      return { group };
    }
  };
}

// ---------------------------------------------------------------- lotus (pads, withered stalks, seed pods), reeds, shrubs
function lotusPadGeo() {
  const s = new THREE.Shape();
  const n = 20;
  for (let i = 0; i <= n; i++) {
    const a = 0.25 + (i / n) * (Math.PI * 2 - 0.5);
    const r = 1 + 0.06 * Math.sin(a * 7);
    if (i) s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    else s.moveTo(0, 0), s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  s.closePath();
  const g = new THREE.ShapeGeometry(s, 4);
  g.rotateX(-Math.PI / 2);
  // cup the pad slightly
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const r = Math.hypot(p.getX(i), p.getZ(i));
    p.setY(i, r * r * 0.08);
  }
  g.computeVertexNormals();
  const n2 = p.count;
  const col = new Float32Array(n2 * 3);
  const info = new Float32Array(n2 * 4);
  for (let i = 0; i < n2; i++) {
    const r = Math.hypot(p.getX(i), p.getZ(i));
    const k = 0.7 + 0.35 * r;
    col[i * 3] = k;
    col[i * 3 + 1] = k;
    col[i * 3 + 2] = k;
    info[i * 4 + 2] = r * 0.5;
    info[i * 4 + 3] = 1;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aInfo', new THREE.BufferAttribute(info, 4));
  return g;
}

function stalkGeo() {
  const B = new Builder(3);
  // withered lotus: bent stalk + drooping seed pod or curled dry leaf (残荷)
  const pts = [new THREE.Vector3(0, -0.3, 0), new THREE.Vector3(0.05, 0.6, 0), new THREE.Vector3(0.18, 1.1, 0.02), new THREE.Vector3(0.36, 1.18, 0.04)];
  const curve = new THREE.CatmullRomCurve3(pts);
  const tube = new THREE.TubeGeometry(curve, 6, 0.018, 4, false);
  B.add('s', tube, I, 0x6a5a3a, { flexFn: (p) => clamp(p.y, 0, 1.2) * 0.6 });
  B.add('s', new THREE.CylinderGeometry(0.09, 0.05, 0.1, 8), mat4(0.38, 1.12, 0.04, 0, 1, 1, 1, 0, -1.9), 0x5a4a30, { flexFn: () => 0.8 });
  return B.toGeometry('s');
}

function reedGeo() {
  const pos = [];
  const info = [];
  const col = [];
  const r = rng(8);
  for (let k = 0; k < 9; k++) {
    const a = r() * 6.28;
    const h = 1.0 + r() * 0.9;
    const lean = 0.08 + r() * 0.2;
    const w = 0.025;
    const x = Math.cos(a) * 0.08;
    const z = Math.sin(a) * 0.08;
    const tx = x + Math.cos(a) * lean * h;
    const tz = z + Math.sin(a) * lean * h;
    const px = -Math.sin(a) * w;
    const pz = Math.cos(a) * w;
    pos.push(x - px, 0, z - pz, x + px, 0, z + pz, tx, h, tz);
    info.push(0, 0, 0, 0.6, 0, 0, 0, 0.6, 0, 0, 1.2, 1);
    col.push(0.5, 0.48, 0.3, 0.5, 0.48, 0.3, 0.95, 0.85, 0.6);
    // plume
    if (k % 2 === 0) {
      pos.push(tx - px * 2.5, h - 0.25, tz - pz * 2.5, tx + px * 2.5, h - 0.25, tz + pz * 2.5, tx + Math.cos(a) * 0.08, h + 0.12, tz + Math.sin(a) * 0.08);
      info.push(0, 0, 1.1, 1, 0, 0, 1.1, 1, 0, 0, 1.3, 1);
      col.push(1.0, 0.92, 0.78, 1.0, 0.92, 0.78, 1.05, 1.0, 0.9);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aInfo', new THREE.Float32BufferAttribute(info, 4));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  const n = pos.length / 3;
  g.setAttribute('normal', new THREE.Float32BufferAttribute(new Array(n).fill([0, 1, 0]).flat(), 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(new Array(n * 2).fill(0), 2));
  return g;
}

function shrubGeo(seed) {
  const g = blob(2, seed, 0.2, 2.6);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) * 0.75 + 0.6);
  g.computeVertexNormals();
  const n = p.count;
  const col = new Float32Array(n * 3);
  const info = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    const up = g.attributes.normal.getY(i);
    const k = 0.7 + 0.35 * up + 0.15 * (noise2(p.getX(i) * 5 + seed, p.getY(i) * 5) - 0.5);
    col[i * 3] = k;
    col[i * 3 + 1] = k;
    col[i * 3 + 2] = k;
    info[i * 4 + 2] = clamp(p.getY(i) / 1.4, 0, 1) * 0.5;
    info[i * 4 + 3] = clamp(0.4 + 0.6 * (p.getY(i) / 1.3), 0, 1);
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aInfo', new THREE.BufferAttribute(info, 4));
  return g;
}

export function createWaterPlants(tier) {
  const padMat = makeFoliage({ flex: 0.15, flutter: 0.01, translucency: 0.25, side: THREE.DoubleSide, roughness: 0.55 });
  const stalkMat = makeFoliage({ flex: 0.5, flutter: 0.0, translucency: 0.1, side: THREE.FrontSide });
  const reedMat = makeFoliage({ flex: 0.9, flutter: 0.04, translucency: 0.4 });
  const shrubMat = makeFoliage({ flex: 0.2, flutter: 0.02, translucency: 0.3, side: THREE.FrontSide });
  const geos = { pad: lotusPadGeo(), stalk: stalkGeo(), reed: reedGeo(), shrub: shrubGeo(3), shrub2: shrubGeo(9) };
  const lists = { pad: [], stalk: [], reed: [], shrub: [], shrub2: [] };
  const rand = rng(66);
  return {
    pad(x, y, z, s, color) {
      lists.pad.push({ m: mat4(x, y, z, rand() * 6.28, s, 1, s, (rand() - 0.5) * 0.08, (rand() - 0.5) * 0.08), c: color });
    },
    stalk(x, y, z, s) {
      lists.stalk.push({ m: mat4(x, y, z, rand() * 6.28, s), c: null });
    },
    reed(x, y, z, s) {
      lists.reed.push({ m: mat4(x, y, z, rand() * 6.28, s, s * (0.8 + rand() * 0.4), s), c: null });
    },
    shrub(x, y, z, s, color) {
      lists[rand() < 0.5 ? 'shrub' : 'shrub2'].push({ m: mat4(x, y, z, rand() * 6.28, s, s * (0.75 + rand() * 0.35), s), c: color });
    },
    build() {
      const group = new THREE.Group();
      group.name = 'waterPlants';
      const mats = { pad: padMat, stalk: stalkMat, reed: reedMat, shrub: shrubMat, shrub2: shrubMat };
      for (const k of Object.keys(lists)) {
        const list = lists[k];
        if (!list.length) continue;
        const mesh = new THREE.InstancedMesh(geos[k], mats[k], list.length);
        const col = new THREE.Color();
        const anyC = list.some((it) => it.c !== null);
        list.forEach((it, i) => {
          mesh.setMatrixAt(i, it.m);
          if (anyC) mesh.setColorAt(i, col.set(it.c !== null ? it.c : 0xffffff));
        });
        mesh.castShadow = k === 'shrub' || k === 'shrub2';
        mesh.receiveShadow = true;
        if (k === 'shrub' || k === 'shrub2' || k === 'pad') mesh.layers.enable(LAYER_REFLECT);
        mesh.computeBoundingSphere();
        group.add(mesh);
      }
      return { group };
    }
  };
}
