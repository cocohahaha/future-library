import * as THREE from 'three';

// ---------------------------------------------------------------- palette
// "Ink & paper courtyard at sunset": mineral pigments on xuan paper.
// All values are sRGB hex; THREE.Color converts them to linear on .set().
export const PAL = {
  paper: 0xf1e8d8,
  plaster: 0xeee6d6, // whitewash (粉墙)
  plasterShade: 0xd9cfbd,
  stone: 0xc9bea9, // limestone
  stoneDark: 0x9d9384,
  stoneGrey: 0xa9a49a, // bluestone (青石)
  brick: 0x8d8a85, // grey brick (青砖)
  tile: 0x5b5a58, // grey roof tile (黛瓦)
  tileDark: 0x3d3c3b,
  ink: 0x24201d,
  cedar: 0x8a5a3b,
  wood: 0x6e4a33,
  woodDark: 0x4a3122,
  woodPale: 0xa47a55,
  lacquer: 0x84321f, // red-brown lacquered columns
  lacquerDark: 0x5c2216,
  cinnabar: 0xb0432c,
  ochre: 0xc08a3e,
  ginkgo: 0xe0b03c,
  maple: 0xb8432a,
  celadon: 0x7fa596,
  azurite: 0x3e5c76,
  malachite: 0x3f6f5e,
  bamboo: 0x6f8f4a,
  pine: 0x3d5a3c,
  grass: 0x8c8f55,
  grassDry: 0xb3a26a,
  earth: 0x8b7458,
  water: 0x2b3f3f,
  gold: 0xc9a24c,
  lamp: 0xffb768,
  sun: 0xffc48a
};

// low sun in the west-south-west: warm raking light on south façades,
// long shadows reaching north-east across the courtyards
const SUN_AZ = THREE.MathUtils.degToRad(246); // compass bearing, 0 = north (-Z), 90 = east (+X)
const SUN_EL = THREE.MathUtils.degToRad(13.5);
export const SUN_DIR = new THREE.Vector3(
  Math.sin(SUN_AZ) * Math.cos(SUN_EL),
  Math.sin(SUN_EL),
  -Math.cos(SUN_AZ) * Math.cos(SUN_EL)
).normalize();

// ---------------------------------------------------------------- device tier
export function detectTier() {
  let forced = null;
  try {
    forced = new URLSearchParams(location.search).get('q');
  } catch (_) {
    /* ignore */
  }
  const coarse = matchMedia('(pointer: coarse)').matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  let tier = coarse || small || cores <= 4 || mem <= 3 ? 'low' : 'high';
  if (forced === 'low' || forced === 'high') tier = forced;
  return tier;
}

// Everything that scales with device power lives here.
export const TIERS = {
  low: {
    name: 'low',
    maxDpr: 1.5,
    megapixels: 1.6, // render-pixel budget (pixel ratio is capped to fit it)
    minScale: 0.6, // adaptive governor floor (fraction of the starting pixel ratio)
    msaa: 2,
    shadow: [2048, 1024],
    shadowSoft: false,
    bloomStart: 4, // first bloom level = 1/4 resolution
    bloomLevels: 3,
    detail: false, // per-pixel procedural material detail
    reflections: false,
    terrainSeg: 150,
    grass: 0.4,
    trees: 0.55,
    books: 0.5,
    people: 0.65,
    particles: 0.5,
    rafters: false,
    eaveTiles: false,
    curve: 8 // radial segments for round things
  },
  high: {
    name: 'high',
    maxDpr: 2,
    megapixels: 4.2,
    minScale: 0.7,
    msaa: 4,
    shadow: [4096, 2048],
    shadowSoft: true,
    bloomStart: 2,
    bloomLevels: 5,
    detail: true,
    reflections: true,
    terrainSeg: 240,
    grass: 1,
    trees: 1,
    books: 1,
    people: 1,
    particles: 1,
    rafters: true,
    eaveTiles: true,
    curve: 14
  }
};

// Layers: everything renders on layer 0; things that should also appear in
// the pond's planar reflection opt into REFLECT.
export const LAYER_REFLECT = 1;
