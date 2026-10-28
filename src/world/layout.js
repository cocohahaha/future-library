import { fbm2, ridged2, smoothstep, lerp, clamp } from '../core/rng.js';
import { smoothLoop, smoothPath, pointInPoly, distToPolyline } from '../core/geom.js';

// Site plan of the academy (书院) and its valley. +X east, -Z north.
// The compound faces south toward a river; hills close in from the north,
// west and east; fields and a village lie across the river.

export const COMPOUND = { x0: -58, x1: 54, z0: -54, z1: 46 };
export const WALL_H = 4.1;

// central axis
export const GATE = { x: 0, z: 46 };
export const PAIFANG = { x: 0, z: 23.5 };
export const COURT = { x0: -15, x1: 15, z0: -19, z1: 21 };
export const WELL = { x: 0, z: 1 };
export const LIBRARY = { x: 0, z: -32, terraceH: 1.25 };

// side courts
export const QUIET = { x: -38, z: -31 }; // reading hall in the bamboo court
export const DIALOGUE = { x: -37.5, z: 9.6 }; // waterside hall on the pond
export const VERIFY = { x: 35.5, z: -27 }; // open hall facing the public square
export const SQUARE = { x: 35.5, z: -10 };
export const OSMANTHUS = { x: 34, z: 25 }; // SE garden pavilion

export const WATER_LEVEL = -0.42; // pond and garden stream
export const RIVER_LEVEL = -1.15;

// ---------------------------------------------------------------- water shapes
export const POND = smoothLoop(
  [
    [-53, 19],
    [-47, 14.6],
    [-38, 14.2],
    [-29, 15.2],
    [-23.5, 19.5],
    [-22.5, 27],
    [-26, 34],
    [-33, 38.5],
    [-42, 39.5],
    [-50, 36],
    [-55.5, 28]
  ],
  120
);
// islet with a rock garden in the pond
export const ISLET = smoothLoop(
  [
    [-45.5, 27.5],
    [-43, 25.6],
    [-40.2, 26.6],
    [-40.4, 29.6],
    [-43.5, 31]
  ],
  32
);

// garden stream: from the north hills, through the bamboo court, into the
// pond, then out under the south wall to the river
export const STREAM_N = smoothPath(
  [
    [-78, -150],
    [-66, -112],
    [-58, -84],
    [-49, -64],
    [-47.5, -52],
    [-50, -40],
    [-53, -26],
    [-51.5, -12],
    [-53, -1],
    [-53.5, 10],
    [-52.5, 19]
  ],
  110
);
export const STREAM_S = smoothPath(
  [
    [-37, 39],
    [-38, 43],
    [-39, 47],
    [-38, 55],
    [-34, 63],
    [-30, 71],
    [-29, 77]
  ],
  40
);

export const riverZ = (x) => 79 + 6.5 * Math.sin(x * 0.011 + 0.6) + 3 * Math.sin(x * 0.031 - 1.2);
export const RIVER_HALF = 9.5;

// ---------------------------------------------------------------- paths
// polylines [[x,z]...] with half widths, painted into the ground and kept
// clear of grass and trees
export const PATHS = [
  { pts: smoothPath([[0, 46], [0, 60], [0.5, 70]], 20), w: 3.2, kind: 'stone' },
  { pts: smoothPath([[0.5, 88], [2, 104], [8, 126], [20, 150], [24, 190]], 50), w: 2.1, kind: 'earth' },
  { pts: smoothPath([[1, 96], [-20, 101], [-50, 108], [-80, 118], [-105, 128]], 50), w: 1.8, kind: 'earth' },
  { pts: smoothPath([[-2, 62], [-30, 63], [-60, 67], [-90, 70], [-130, 66]], 50), w: 1.5, kind: 'earth' },
  { pts: smoothPath([[2, 62], [30, 64], [60, 66], [90, 64], [120, 58]], 50), w: 1.5, kind: 'earth' },
  { pts: smoothPath([[-36, -54], [-44, -70], [-62, -100], [-80, -132], [-92, -160]], 60), w: 1.3, kind: 'earth' },
  { pts: smoothPath([[54, -20], [72, -26], [96, -36], [118, -44]], 40), w: 1.3, kind: 'earth' }
];

// garden paths inside the walls: pebble mosaic (花街铺地) and stepping stones
export const GARDEN_PATHS = [
  // bamboo court: moon gate → reading hall
  { pts: smoothPath([[-18.5, -9], [-24, -12], [-30, -17], [-36, -21], [-38, -24.5]], 30), w: 1.05 },
  { pts: smoothPath([[-38, -24.5], [-44, -20], [-49, -14], [-52, -8]], 20), w: 0.9 },
  // pond garden
  { pts: smoothPath([[-18.6, 13], [-21, 11], [-27, 9.5], [-31, 9.5]], 16), w: 1.0 },
  { pts: smoothPath([[-44, 9.5], [-50, 10], [-55, 14]], 12), w: 0.9 },
  { pts: smoothPath([[-21, 37], [-24, 42], [-32, 43.5], [-44, 43], [-52, 41]], 24), w: 0.95 },
  // SE garden
  { pts: smoothPath([[18.6, 12], [24, 15], [30, 20], [34, 25]], 16), w: 1.0 },
  { pts: smoothPath([[34, 25], [40, 30], [46, 36], [50, 41]], 16), w: 0.9 },
  // verification square ↔ moon gate
  { pts: smoothPath([[18.6, -8], [24, -8.5], [30, -9.5]], 10), w: 1.1 }
];

// ---------------------------------------------------------------- footprints (kept clear of scatter)
const footprints = []; // {x0,z0,x1,z1} axis-aligned rectangles
export function addFootprint(x0, z0, x1, z1, pad = 0) {
  footprints.push({ x0: Math.min(x0, x1) - pad, z0: Math.min(z0, z1) - pad, x1: Math.max(x0, x1) + pad, z1: Math.max(z0, z1) + pad });
}
export function inFootprint(x, z) {
  for (const f of footprints) if (x > f.x0 && x < f.x1 && z > f.z0 && z < f.z1) return true;
  return false;
}

// ---------------------------------------------------------------- queries
export const inCompound = (x, z, pad = 0) =>
  x > COMPOUND.x0 + pad && x < COMPOUND.x1 - pad && z > COMPOUND.z0 + pad && z < COMPOUND.z1 - pad;

// signed distance outside the compound rectangle (negative inside)
export function compoundDist(x, z) {
  const cx = (COMPOUND.x0 + COMPOUND.x1) / 2;
  const cz = (COMPOUND.z0 + COMPOUND.z1) / 2;
  const hx = (COMPOUND.x1 - COMPOUND.x0) / 2;
  const hz = (COMPOUND.z1 - COMPOUND.z0) / 2;
  const dx = Math.abs(x - cx) - hx;
  const dz = Math.abs(z - cz) - hz;
  const ox = Math.max(dx, 0);
  const oz = Math.max(dz, 0);
  return Math.hypot(ox, oz) + Math.min(Math.max(dx, dz), 0);
}

export const inPond = (x, z) => pointInPoly(x, z, POND) && !pointInPoly(x, z, ISLET);
export function pondDist(x, z) {
  const d = distToPolyline(x, z, POND, true);
  return pointInPoly(x, z, POND) ? -d : d;
}
export function isletDist(x, z) {
  const d = distToPolyline(x, z, ISLET, true);
  return pointInPoly(x, z, ISLET) ? -d : d;
}
export const streamDist = (x, z) => Math.min(distToPolyline(x, z, STREAM_N), distToPolyline(x, z, STREAM_S));
export const riverDist = (x, z) => Math.abs(z - riverZ(x));

export function pathDist(x, z) {
  let d = Infinity;
  for (const p of PATHS) d = Math.min(d, distToPolyline(x, z, p.pts) - p.w);
  return d;
}
export function gardenPathDist(x, z) {
  let d = Infinity;
  for (const p of GARDEN_PATHS) d = Math.min(d, distToPolyline(x, z, p.pts) - p.w);
  return d;
}

// stream bed height along the north stream (descends from the hills)
function streamBed(x, z, hill) {
  // inside/near the compound the stream is a level canal fed by the pond
  if (z > -60) return WATER_LEVEL - 0.65;
  return Math.max(WATER_LEVEL - 0.65, hill - 1.4);
}

// raw hills before water carving (also used for the stream bed)
function hills(x, z) {
  const outC = compoundDist(x, z);
  const shield = smoothstep(6, 34, outC);
  const north = smoothstep(-66, -300, z);
  const west = smoothstep(-76, -320, x);
  const east = smoothstep(68, 320, x);
  const south = smoothstep(230, 430, z);
  let rise = Math.max(north, west * 0.9, east * 0.85, south * 0.7);
  rise = rise * (0.6 + 0.4 * rise);
  const n = fbm2(x * 0.0058 + 3.1, z * 0.0058 - 1.7, 5);
  const r = ridged2(x * 0.0085 + 7.0, z * 0.0085 + 2.0, 4);
  const g = ridged2(x * 0.02 - 3.0, z * 0.02 + 5.0, 3);
  let h = rise * (10 + 52 * n + 30 * r + 9 * g);
  // named hills: the pagoda hill (NW) and the pavilion hill (E)
  h += 44 * Math.exp(-((x + 96) ** 2 + (z + 176) ** 2) / (2 * 42 * 42));
  h += 24 * Math.exp(-((x - 124) ** 2 + (z + 46) ** 2) / (2 * 30 * 30));
  // valley floor: soft undulation outside the walls
  h += smoothstep(0, 50, outC) * (fbm2(x * 0.021, z * 0.021, 3) - 0.42) * 2.6;
  return h * shield;
}

const PAD_TERRACES = [];

// Terrain height everywhere (metres). Courtyards are exactly 0.
export function terrainHeight(x, z) {
  let h = hills(x, z);
  // river
  const dr = Math.abs(z - riverZ(x));
  if (dr < RIVER_HALF + 7) {
    const bank = smoothstep(RIVER_HALF + 7, RIVER_HALF - 1.5, dr);
    const bed = RIVER_LEVEL - 1.6 * smoothstep(RIVER_HALF + 1, 0, dr) - 0.3;
    h = lerp(h, Math.min(h, bed), bank);
  }
  // garden stream + outflow
  const ds = streamDist(x, z);
  if (ds < 4.2) {
    const bed = z < -60 ? streamBed(x, z, hills(x, z)) : z > 46 ? lerp(WATER_LEVEL - 0.6, RIVER_LEVEL - 0.5, smoothstep(46, 76, z)) : WATER_LEVEL - 0.65;
    const k = smoothstep(4.2, 1.1, ds);
    h = lerp(h, Math.min(h, bed), k);
  }
  // pond basin
  const dp = pondDist(x, z);
  if (dp < 2) {
    const k = smoothstep(2, -4, dp);
    h = lerp(h, Math.min(h, -1.6), k);
    const di = isletDist(x, z);
    if (di < 1.5) h = lerp(h, 0.35, smoothstep(1.5, -1.2, di));
  }
  return h;
}

export function isWater(x, z) {
  return inPond(x, z) || streamDist(x, z) < 1.25 || Math.abs(z - riverZ(x)) < RIVER_HALF - 0.4;
}

// is this spot free for scattered vegetation/props?
export function isFree(x, z, { pathPad = 0.6, waterPad = 1.0 } = {}) {
  if (inFootprint(x, z)) return false;
  if (pondDist(x, z) < waterPad) return false;
  if (streamDist(x, z) < 1.4 + waterPad) return false;
  if (Math.abs(z - riverZ(x)) < RIVER_HALF + waterPad) return false;
  if (pathDist(x, z) < pathPad) return false;
  if (inCompound(x, z, -1) && gardenPathDist(x, z) < pathPad) return false;
  return true;
}

export const ZONE_POS = {
  well: { x: WELL.x, z: WELL.z },
  provenance: { x: LIBRARY.x, z: LIBRARY.z },
  dialogue: { x: DIALOGUE.x, z: DIALOGUE.z },
  quiet: { x: QUIET.x, z: QUIET.z },
  verify: { x: VERIFY.x, z: VERIFY.z }
};

export { clamp, PAD_TERRACES };
