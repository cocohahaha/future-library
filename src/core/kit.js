import * as THREE from 'three';
import { makeSolid, makeRoof, makeLattice, makeGlow, makeFoliage, makeMasked } from './materials.js';
import { makeLatticeAtlas, makePavingTexture } from './textures.js';
import { Instancer, MAT } from './builder.js';
import { bracketGeometry } from '../arch/parts.js';
import { LAYER_REFLECT, PAL } from './config.js';

// Shared materials and instanced-part definitions for the whole world.
// Builders emit into named buckets ('solid', 'roof', 'lattice', ...) and
// instance keys ('bracket', 'eaveTile', ...); this kit turns them into a
// small, fixed set of materials so draw calls stay low.

// give a plain geometry the attributes the solid material expects
export function prepGeo(geo, color = 0xffffff, kind = MAT.plain, ao = 1, flex = 0) {
  const g = geo.index ? geo : geo;
  const n = g.attributes.position.count;
  if (!g.attributes.color) {
    const c = new THREE.Color(color);
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  }
  if (!g.attributes.aInfo) {
    const info = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      info[i * 4 + 1] = kind;
      info[i * 4 + 2] = flex;
      info[i * 4 + 3] = ao;
    }
    g.setAttribute('aInfo', new THREE.BufferAttribute(info, 4));
  }
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
  return g;
}

export function createKit(tier) {
  const atlas = makeLatticeAtlas(tier.name === 'low' ? 512 : 1024);
  const solid = makeSolid({ detail: tier.detail });
  const solidDS = makeSolid({ detail: tier.detail, side: THREE.DoubleSide });
  const roof = makeRoof({ detail: tier.detail });
  const lattice = makeLattice(atlas, { open: false, glow: 0.32 });
  const latticeOpen = makeLattice(atlas, { open: true });
  // each zone hall glows on its own when its event fires
  const latticeLib = makeLattice(atlas, { open: false, glow: 0.35 });
  const latticeQuiet = makeLattice(atlas, { open: false, glow: 0.35 });
  const latticeDlg = makeLattice(atlas, { open: false, glow: 0.32 });
  const glow = makeGlow({ intensity: 3.2, vertexColors: true, color: 0xffffff });
  const pavTex = makePavingTexture(tier.name === 'low' ? 512 : 1024);
  pavTex.repeat.set(1, 1);
  const paving = makeSolid({ detail: false, map: pavTex, roughness: 0.92 });

  // bucket → material spec (used by Builder.build)
  const buckets = {
    solid: { material: solid, cast: true, receive: true, layers: [LAYER_REFLECT] },
    solidDS: { material: solidDS, cast: true, receive: true, layers: [LAYER_REFLECT] },
    roof: { material: roof, cast: true, receive: true, layers: [LAYER_REFLECT] },
    lattice: { material: lattice, cast: true, receive: true, layers: [LAYER_REFLECT] },
    latticeOpen: { material: latticeOpen, cast: true, receive: true },
    latticeLib: { material: latticeLib, cast: true, receive: true, layers: [LAYER_REFLECT] },
    latticeQuiet: { material: latticeQuiet, cast: true, receive: true, layers: [LAYER_REFLECT] },
    latticeDlg: { material: latticeDlg, cast: true, receive: true, layers: [LAYER_REFLECT] },
    glow: { material: glow, cast: false, receive: false, layers: [LAYER_REFLECT] },
    paving: { material: paving, cast: false, receive: true, layers: [LAYER_REFLECT] }
  };

  const instancer = new Instancer();
  instancer.define('bracket', bracketGeometry(1, true), solid, { cast: true, receive: true });
  const eave = new THREE.CylinderGeometry(0.075, 0.075, 0.07, 8, 1);
  eave.rotateX(Math.PI / 2);
  instancer.define('eaveTile', prepGeo(eave, PAL.tileDark, MAT.plain, 0.9), solid, { cast: false, receive: true });

  return { tier, atlas, mats: { solid, solidDS, roof, lattice, latticeOpen, latticeLib, latticeQuiet, latticeDlg, glow, paving }, buckets, instancer };
}

export { makeFoliage, makeMasked, makeGlow };
