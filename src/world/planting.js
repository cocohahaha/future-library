import * as THREE from 'three';
import { rng, noise2, fbm2, smoothstep } from '../core/rng.js';
import {
  terrainHeight,
  isFree,
  inCompound,
  compoundDist,
  POND,
  ISLET,
  STREAM_N,
  STREAM_S,
  riverZ,
  RIVER_HALF,
  WATER_LEVEL,
  RIVER_LEVEL,
  pondDist,
  streamDist,
  pathDist,
  inFootprint,
  COMPOUND
} from './layout.js';
import { fieldAt } from './terrain.js';
import { pointInPoly } from '../core/geom.js';

// Where everything grows. Hero trees are placed by hand around courts and
// the pond; groves, rocks, lotus, reeds, grass and the hill forests are
// scattered with noise-driven density and the site's keep-out masks.

export function plantWorld({ trees, bamboo, grass, rocks, plants, tier, groundMap, anchors }) {
  const rand = rng(4242);
  const T = (x, z) => terrainHeight(x, z);
  const hero = (sp, x, z, s = 1, y = null) => {
    trees.plant(sp, x, y === null ? T(x, z) : y, z, s);
    litter(sp, x, z, s);
  };
  // leaf litter painted under deciduous trees
  const litter = (sp, x, z, s) => {
    if (!groundMap) return;
    const col = sp === 'ginkgo' ? [224, 176, 60] : sp === 'maple' ? [178, 64, 40] : sp === 'persimmon' ? [190, 110, 50] : null;
    if (!col) return;
    const R = (sp === 'ginkgo' ? 5.5 : 4) * s;
    for (let i = 0; i < 260; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.pow(rand(), 0.7) * R;
      groundMap.dab(x + Math.cos(a) * r, z + Math.sin(a) * r, 0.06 + rand() * 0.08, `rgba(${col[0]},${col[1]},${col[2]},${0.55 + rand() * 0.4})`);
    }
  };

  // ======================================================== compound hero trees
  hero('ginkgo', -8.6, 33, 1.12);
  hero('ginkgo', 8.6, 33.4, 1.05);
  hero('pine', -11.4, -13.2, 0.95);
  hero('pine', 11.4, -12.6, 1.0);
  hero('osmanthus', -11.6, 13.5, 1.0);
  hero('osmanthus', 11.6, 13.2, 1.05);
  hero('osmanthus', -11.8, 2.5, 0.85);
  hero('osmanthus', 11.8, 2.8, 0.85);
  // back garden behind the library
  hero('pine', -11.5, -48.6, 0.9);
  hero('pine', 12.5, -48.4, 0.95);
  hero('ginkgo', 0.5, -50.5, 0.9);
  // pond garden
  for (const [x, z, s] of [
    [-54.6, 22.5, 1.0],
    [-48.5, 12.6, 0.95],
    [-27.4, 15.3, 1.05],
    [-24.6, 33.6, 0.95],
    [-45.2, 41.8, 1.0],
    [-33.5, 41.4, 0.9]
  ])
    hero('willow', x, z, s);
  hero('maple', -56, 32.5, 1.0);
  hero('maple', -29.5, 44.2, 0.95);
  hero('maple', -24, 8.5, 0.9);
  hero('pine', -54.5, 44, 0.75, 2.4);
  hero('pine', -43.2, 28.4, 0.5, 0.3);
  hero('osmanthus', -29, 4.5, 0.95);
  hero('osmanthus', -47.5, 4.2, 0.9);
  // bamboo court
  hero('pine', -50.8, -6.5, 0.9);
  hero('maple', -26.5, -7.5, 0.85);
  hero('osmanthus', -28.5, -20, 0.8);
  // verification court
  hero('osmanthus', 23.4, -4.6, 1.2);
  hero('osmanthus', 47.6, -4.4, 1.2);
  hero('ginkgo', 49, -47, 1.0);
  hero('pine', 21.8, -30.5, 0.85);
  hero('pine', 50.4, -32.5, 0.85);
  // south-east garden
  for (const [x, z] of [
    [28.6, 19.4],
    [39.6, 19.6],
    [28.4, 30.8],
    [39.8, 30.6]
  ])
    hero('osmanthus', x, z, 0.95);
  hero('maple', 23.2, 41, 1.0);
  hero('maple', 44.5, 41.5, 0.95);
  hero('persimmon', 50, 9.5, 0.95);
  hero('persimmon', 24, 9.2, 0.9);
  // plaza and approach
  hero('pine', -12.5, 53.5, 1.05);
  hero('pine', 12.5, 54, 1.0);

  // ======================================================== bamboo groves
  const bFree = (x, z) => isFree(x, z, { pathPad: 0.8, waterPad: 0.6 }) && inCompound(x, z, 1.4);
  const bn = (n) => Math.round(n * (tier.name === 'low' ? 0.5 : 1));
  bamboo.grove(-53, -30, 6.5, bn(70), T, bFree);
  bamboo.grove(-52, -16, 4.5, bn(38), T, bFree);
  bamboo.grove(-44, -50, 6, bn(55), T, bFree);
  bamboo.grove(-30, -50, 5.5, bn(45), T, bFree);
  bamboo.grove(-23, -36, 4.5, bn(40), T, bFree);
  bamboo.grove(-22, -14, 3.2, bn(18), T, bFree);
  bamboo.grove(51, -18, 3.5, bn(26), T, (x, z) => bFree(x, z));
  bamboo.grove(-56, 4, 3.0, bn(20), T, bFree);
  // a stand outside, up the stream
  bamboo.grove(-60, -78, 9, bn(60), T, (x, z) => isFree(x, z));

  // ======================================================== rocks
  // feature scholar's rocks (太湖石)
  for (const [x, z, s] of [
    [-32, -17.5, 1.25],
    [-41, -18.4, 0.9],
    [40.5, 13.5, 1.3],
    [-33.5, 4.8, 1.1],
    [-44.2, 26.5, 0.9],
    [-42, 29.8, 0.7],
    [12.5, 18, 0.95],
    [-12.5, -5, 0.8],
    [27.5, -15.5, 1.0],
    [-25, 26.5, 0.8]
  ]) {
    rocks.place('taihu', x, T(x, z) - 0.1, z, s);
  }
  // rockery mound under the hexagonal pavilion
  const RP = anchors.rockPavilion;
  for (let ring = 0; ring < 3; ring++) {
    const rr = 4.6 - ring * 1.5;
    const n = 14 - ring * 4;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + ring;
      rocks.place('boulder', RP.x + Math.cos(a) * rr, -0.3 + ring * 0.75, RP.z + Math.sin(a) * rr, 1.5 - ring * 0.2, 1.4 + ring * 0.2);
    }
  }
  rocks.place('taihu', RP.x + 3.4, 1.4, RP.z - 3.2, 0.9);
  rocks.place('taihu', RP.x - 3.8, 0.8, RP.z + 1.5, 1.1);
  // shore stones along the pond, half submerged
  for (let i = 0; i < POND.length; i += tier.name === 'low' ? 2 : 1) {
    const [x, z] = POND[i];
    const nx = POND[(i + 1) % POND.length];
    if (Math.abs(x + 37.5) < 9 && z < 17) continue; // under the waterside hall
    const s = 0.55 + rand() * 0.6;
    rocks.place(rand() < 0.6 ? 'slab' : 'boulder', x + (rand() - 0.5) * 0.6, WATER_LEVEL - 0.25 - rand() * 0.2, z + (rand() - 0.5) * 0.6, s * 1.4, s, Math.atan2(nx[0] - x, nx[1] - z));
  }
  for (let i = 0; i < ISLET.length; i += 2) rocks.place('boulder', ISLET[i][0], WATER_LEVEL - 0.2, ISLET[i][1], 0.7 + rand() * 0.4, 0.6);
  // stream banks inside the walls
  for (const [x, z] of STREAM_N.filter((_, i) => i % 3 === 0)) {
    if (z < -55 || z > 18) continue;
    for (const side of [-1, 1]) rocks.place(rand() < 0.5 ? 'slab' : 'boulder', x + side * (1.5 + rand() * 0.4), WATER_LEVEL - 0.2, z + (rand() - 0.5), 0.45 + rand() * 0.4, 0.4 + rand() * 0.3);
  }
  // stepping stones across the stream in the bamboo court
  for (let k = 0; k < 4; k++) rocks.place('slab', -52.2 + k * 0.05, WATER_LEVEL + 0.12, -12.5 + k * 0.85 - 1.3, 0.42, 0.25);
  // boulders on the hills and river banks
  const nb = tier.name === 'low' ? 160 : 360;
  for (let k = 0, tries = 0; k < nb && tries < nb * 8; tries++) {
    const a = rand() * Math.PI * 2;
    const r = 70 + rand() * 330;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const h = T(x, z);
    if (h < 3 || !isFree(x, z)) continue;
    rocks.place('boulder', x, h - 0.4, z, 1 + rand() * 2.4, 0.8 + rand() * 1.8);
    k++;
  }
  for (let x = -150; x < 150; x += 4 + rand() * 6) {
    for (const side of [-1, 1]) {
      if (rand() < 0.45) continue;
      const z = riverZ(x) + side * (RIVER_HALF + 0.3 + rand() * 1.5);
      if (Math.abs(x) < 6) continue;
      rocks.place(rand() < 0.5 ? 'slab' : 'boulder', x, RIVER_LEVEL - 0.15, z, 0.6 + rand() * 0.8, 0.5 + rand() * 0.5);
    }
  }

  // ======================================================== lotus, reeds, shrubs
  const lotusPatch = (cx, cz, r, n) => {
    for (let k = 0, t = 0; k < n && t < n * 5; t++) {
      const a = rand() * Math.PI * 2;
      const rr = Math.sqrt(rand()) * r;
      const x = cx + Math.cos(a) * rr;
      const z = cz + Math.sin(a) * rr;
      if (pondDist(x, z) > -0.8) continue;
      const withered = rand() < 0.35;
      plants.pad(x, WATER_LEVEL + 0.02 + rand() * 0.03, z, 0.32 + rand() * 0.35, withered ? 0x8a7a40 : rand() < 0.5 ? 0x587a3a : 0x6a8a44);
      if (rand() < 0.3) plants.stalk(x + 0.2, WATER_LEVEL, z, 0.8 + rand() * 0.6);
      k++;
    }
  };
  const lm = tier.name === 'low' ? 0.5 : 1;
  lotusPatch(-30, 30, 5.5, Math.round(70 * lm));
  lotusPatch(-49, 31, 4.5, Math.round(50 * lm));
  lotusPatch(-36, 35.5, 3, Math.round(26 * lm));
  // reeds along the river and the outer stream
  const nr = tier.name === 'low' ? 180 : 420;
  for (let k = 0; k < nr; k++) {
    const x = -220 + rand() * 440;
    const side = rand() < 0.5 ? -1 : 1;
    const z = riverZ(x) + side * (RIVER_HALF - 0.5 + rand() * 2.2);
    if (Math.abs(x) < 7) continue;
    plants.reed(x, Math.max(RIVER_LEVEL - 0.1, T(x, z)), z, 0.8 + rand() * 0.6);
  }
  for (const [x, z] of [...STREAM_S, ...STREAM_N.filter(([, zz]) => zz < -56)]) {
    if (rand() < 0.5) continue;
    const side = rand() < 0.5 ? -1 : 1;
    plants.reed(x + side * (1.3 + rand()), T(x + side * 1.5, z) - 0.05, z, 0.7 + rand() * 0.4);
  }
  for (let k = 0; k < 26; k++) {
    const i = Math.floor(rand() * POND.length);
    const [x, z] = POND[i];
    if (z < 17 && Math.abs(x + 37.5) < 10) continue;
    plants.reed(x + (rand() - 0.5), WATER_LEVEL - 0.05, z + (rand() - 0.5), 0.6 + rand() * 0.3);
  }
  // shrubs hugging walls and halls inside the compound
  const ns = tier.name === 'low' ? 110 : 240;
  for (let k = 0, t = 0; k < ns && t < ns * 10; t++) {
    const x = COMPOUND.x0 + 1 + rand() * (COMPOUND.x1 - COMPOUND.x0 - 2);
    const z = COMPOUND.z0 + 1 + rand() * (COMPOUND.z1 - COMPOUND.z0 - 2);
    if (!isFree(x, z, { pathPad: 0.9, waterPad: 0.8 })) continue;
    // prefer spots near walls / footprints (noise mask keeps it clumpy)
    if (noise2(x * 0.15, z * 0.15) < 0.45) continue;
    trees.plant(rand() < 0.8 ? 'shrub' : 'shrubRed', x, T(x, z) - 0.05, z, 0.7 + rand() * 0.6);
    k++;
  }

  // ======================================================== grass & flowers
  const ng = Math.round(16000 * tier.grass);
  const greens = [0x8a8f52, 0x7d8a4a, 0x9a9558, 0xa69a5e, 0x6f8046];
  for (let k = 0, t = 0; k < ng && t < ng * 6; t++) {
    // denser near the compound, thinning outward
    const inside = rand() < 0.45;
    let x;
    let z;
    if (inside) {
      x = COMPOUND.x0 + rand() * (COMPOUND.x1 - COMPOUND.x0);
      z = COMPOUND.z0 + rand() * (COMPOUND.z1 - COMPOUND.z0);
    } else {
      const a = rand() * Math.PI * 2;
      const r = 50 + Math.pow(rand(), 1.6) * 150;
      x = Math.cos(a) * r;
      z = Math.sin(a) * r * 0.9 + 10;
    }
    if (!isFree(x, z, { pathPad: 0.35, waterPad: 0.3 })) continue;
    if (fieldAt(x, z) >= 0) continue;
    if (noise2(x * 0.08 + 3, z * 0.08) < 0.32) continue;
    const y = T(x, z);
    if (y < WATER_LEVEL + 0.05) continue;
    grass.add(x, y, z, 0.75 + rand() * 0.6, greens[Math.floor(rand() * greens.length)]);
    k++;
  }
  const nf = Math.round(650 * tier.grass);
  const fcols = [0xe8c040, 0xf2e6c8, 0xd9a43a, 0xb9704a, 0xc7a7d8];
  for (let k = 0, t = 0; k < nf && t < nf * 8; t++) {
    const x = COMPOUND.x0 + rand() * (COMPOUND.x1 - COMPOUND.x0);
    const z = COMPOUND.z0 + rand() * (COMPOUND.z1 - COMPOUND.z0);
    if (!isFree(x, z, { pathPad: 0.5, waterPad: 0.6 })) continue;
    if (noise2(x * 0.2 - 7, z * 0.2) < 0.58) continue;
    grass.flower(x, T(x, z), z, fcols[Math.floor(rand() * fcols.length)]);
    k++;
  }

  // ======================================================== trees outside: riverbanks, valley, village, hills
  for (let x = -110; x < 120; x += 9 + rand() * 7) {
    if (Math.abs(x) < 10) continue;
    for (const side of [-1, 1]) {
      if (rand() < 0.35) continue;
      const z = riverZ(x) + side * (RIVER_HALF + 2.5 + rand() * 3);
      if (!isFree(x, z, { waterPad: 0.5 })) continue;
      hero(rand() < 0.75 ? 'willow' : 'broad', x, z, 0.85 + rand() * 0.3);
    }
  }
  // village trees
  for (let k = 0, t = 0; k < (tier.name === 'low' ? 14 : 28) && t < 300; t++) {
    const x = -165 + rand() * 105;
    const z = 100 + rand() * 85;
    if (!isFree(x, z) || z < riverZ(x) + 14) continue;
    hero(rand() < 0.4 ? 'persimmon' : rand() < 0.6 ? 'broad' : 'ginkgo', x, z, 0.8 + rand() * 0.4);
    k++;
  }
  // scattered valley trees and hill-foot pines (hero quality, near the compound)
  for (let k = 0, t = 0; k < (tier.name === 'low' ? 40 : 90) && t < 1500; t++) {
    const a = rand() * Math.PI * 2;
    const r = 66 + rand() * 120;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    if (!isFree(x, z) || fieldAt(x, z) >= 0) continue;
    const h = T(x, z);
    const sp = h > 6 ? 'pine' : rand() < 0.5 ? 'broad' : rand() < 0.5 ? 'maple' : 'ginkgo';
    if (noise2(x * 0.03, z * 0.03) < 0.4) continue;
    hero(sp, x, z, 0.8 + rand() * 0.45);
    k++;
  }
  // forests: far low-poly trees on the hills, thick in the folds
  const nFar = Math.round(tier.name === 'low' ? 1600 : 3800);
  const autumn = [0x8a8a48, 0xa8643a, 0x6e7a44, 0xb88a3e, 0x8a5636, 0x5e6e40, 0x9a7a3a];
  for (let k = 0, t = 0; k < nFar && t < nFar * 8; t++) {
    const a = rand() * Math.PI * 2;
    const r = 120 + Math.pow(rand(), 0.8) * 420;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const h = T(x, z);
    if (h < 2.5) continue;
    const dens = fbm2(x * 0.012, z * 0.012, 3);
    if (dens < 0.47) continue;
    if (!isFree(x, z, { pathPad: 1.5 })) continue;
    const conifer = h > 22 || rand() < 0.55;
    const s = 1.0 + rand() * 0.9 + (dens - 0.47) * 2;
    const kind = conifer ? (rand() < 0.85 ? 0 : 2) : rand() < 0.5 ? 1 : 3;
    trees.farTree(kind, x, h - 0.4, z, s, conifer ? (rand() < 0.5 ? 0x3e5a44 : 0x46604a) : autumn[Math.floor(rand() * autumn.length)]);
    k++;
  }
  if (groundMap) groundMap.tex.needsUpdate = true;
}
