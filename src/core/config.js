import { Vector3 } from 'three';

// World units are millimetres: the desk top is y = 0, the book is about the
// size of a real art book (196 × 256 mm pages) and the miniatures on its
// plates are at 1:40 (a 1.7 m person stands 42.5 mm tall).

// ---------------------------------------------------------------- palette
// sRGB hex; THREE.Color converts to linear on .set()
export const PAL = {
  bg: 0xb4aa9a, // the far desk dissolves into this
  oak: 0xcfb796,
  lino: 0x5f6f78, // slate-blue linoleum desk pad
  linoEdge: 0x4b5358,
  cloth: 0xa4502f, // terracotta bookcloth
  clothSheen: 0xf0b08a,
  foil: 0xd9b46a, // warm gold foil
  paper: 0xf6f0e3,
  paperEdge: 0xeee5d2,
  ink: 0x24211e,
  inkSoft: 0x5b554d,
  ribbon: 0x2d3a52
};

// one accent per zone, used for printed numerals, rules and small details
export const ZONE_COLORS = {
  well: '#2f6f73',
  provenance: '#b0452f',
  dialogue: '#b9822a',
  quiet: '#66784a',
  verify: '#36507f'
};

// The window is on the reader's left, a little in front of the desk, so the
// key light rakes across the pages and the miniatures' back walls are lit.
export const WINDOW_DIR = new Vector3(-0.6, 0.7, 0.26).normalize();

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
    megapixels: 1.7, // render-pixel budget (the pixel ratio is capped to fit it)
    minScale: 0.6, // floor for the adaptive governor
    msaa: 4,
    shadow: 1024,
    shadowRadius: 2,
    ao: false,
    bloomStart: 4, // first bloom level = 1/4 resolution
    bloomLevels: 3,
    pagePx: 3.6, // px/mm for the pages of the open spread
    pagePxFar: 1.2, // px/mm for every other page
    texScale: 0.5, // procedural texture resolution
    figureDetail: 0.7,
    books: 0.6,
    env: 128
  },
  high: {
    name: 'high',
    maxDpr: 2,
    megapixels: 4.2,
    minScale: 0.65,
    msaa: 4,
    shadow: 2048,
    shadowRadius: 3,
    ao: true,
    bloomStart: 2,
    bloomLevels: 5,
    pagePx: 6,
    pagePxFar: 1.6,
    texScale: 1,
    figureDetail: 1,
    books: 1,
    env: 256
  }
};
