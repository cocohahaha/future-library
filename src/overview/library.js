import { Group, Mesh, MeshStandardMaterial, MeshBasicMaterial, InstancedMesh, InstancedBufferAttribute, Object3D, Vector3, Color, AdditiveBlending, DoubleSide, Plane } from 'three';
import { Mesher, roundBox, cylinder, lathe, ringSector, tube, sphere, merge, xf, plane } from '../core/geo.js';
import { Part, Y0, C, glazing, beam, bookcase, pendant, floorLamp, deskLamp, table, roundTable, chair, stool, lounge, plant, ladder, openBook, thread, cardWall, press, magnifier, curtain, mats as kitMats } from '../diorama/kit.js';
import { makeFigure } from '../diorama/figures.js';
import { patch } from './atmos.js';

// The Library of Open Questions as one building, in metres, north = -z (the
// plates' north arrows), the plaza to the south. ARCH_PLAN.md is the brief;
// in short: a 7.2 m grid (lines A-F at x = -18 … 18, 1-5 at z = -18 … 10.8),
// floors at +0.6 and +4.2 (3.6 m floor to floor: the book's 3.2 m walls meet
// the slab soffit), and each of the book's five rooms (src/diorama/scenes.js)
// placed unrotated with its two walls on grid lines, as the corner of a whole
// room that is built around it with the book's own kit:
//   1 Question Well      C x M, double height under a glass lantern
//   2 Provenance Stacks  A-B x N1-M, blind to the west, borrowed light only
//   3 Dialogue Alcoves   D-E x S, glazed to the east garden and the plaza
//   4 Unassisted Room    L1, B-C x N2, the book's north window run long
//   5 Verification       A-B x S, glazed to the plaza and the entrance hall
// with the entrance hall (C x S) and the top-lit stair hall (C x N1) on one
// axis, a dog-leg stair, an L1 gallery and a bridge across the Well.
//
// LOD: each zone's shell (walls, glazing, slab and roof) is split by side;
// every side has its own clipping plane, so index.js can section a zone at
// its slab soffit and drop the walls between it and the camera to a low
// sill, the way the book's plates are cut. The spine (halls, stair, gallery,
// bridge) is sectioned at L1 + 1.1 m. Furniture beyond the book's crop is
// built with the room, on approach (furnish()).

const PI = Math.PI;
export const FFL0 = 0.6;
export const FFL1 = 4.2;
const CLEAR = 3.2; // floor to slab soffit = the book's wall height
const SILL = 1.1; // near walls are cut down to this in section
// a section is drawn just under a level, never on it: a clipping plane that
// lies exactly in a slab soffit or a wall top keeps or drops that face pixel
// by pixel (float noise), a speckled veil over the room and its shadows
const CUT = 0.02;
const ROOF = 7.8; // top of the two-storey roofs
const PAR0 = FFL0 + CLEAR + 0.4 + 0.5; // one-storey parapet top (4.7)
const PAR1 = ROOF + 0.5; // two-storey parapet top (8.3)
const S0 = FFL0 + CLEAR; // L0 slab soffit (3.8)
const S1 = FFL1 + CLEAR; // L1 slab soffit (7.4)

// diorama origins: book wall centre lines (local x 2.75, z -3.25) on grid lines
export const ROOMS = {
  well: { x: 0.85, y: FFL0 - Y0, z: -0.35, ry: 0 },
  provenance: { x: -6.35, y: FFL0 - Y0, z: -7.55, ry: 0 },
  dialogue: { x: 15.25, y: FFL0 - Y0, z: 6.85, ry: 0 },
  quiet: { x: 0.85, y: FFL1 - Y0, z: -15.15, ry: 0 },
  verify: { x: -6.35, y: FFL0 - Y0, z: 6.85, ry: 0 }
};
// whole rooms, on grid lines
export const PLAN = {
  well: { x0: -3.6, x1: 3.6, z0: -3.6, z1: 3.6, f: FFL0, floor: 'floor' },
  provenance: { x0: -18, x1: -3.6, z0: -10.8, z1: 3.6, f: FFL0, floor: 'planks' },
  dialogue: { x0: 3.6, x1: 18, z0: 3.6, z1: 10.8, f: FFL0, floor: 'planks' },
  quiet: { x0: -10.8, x1: 3.6, z0: -18, z1: -10.8, f: FFL1, floor: 'planks' },
  verify: { x0: -18, x1: -3.6, z0: 3.6, z1: 10.8, f: FFL0, floor: 'floor' }
};
// the book's crop of each room (its 5.7 x 6.7 m plinth), kept clear of extension furniture
const crop = (id) => {
  const r = ROOMS[id];
  return { x0: r.x - 2.85, x1: r.x + 2.85, z0: r.z - 3.35, z1: r.z + 3.35 };
};

// ---------------------------------------------------------------- materials
// The shell uses the book's kit materials (cloned, so they can carry a
// clipping plane and the overview's haze) plus a few of its own.
const std = (o, key, p = {}) => patch(new MeshStandardMaterial(o), { key, ...p });
const SHELL = {
  stone: () => std({ color: 0xe4ddd0, roughness: 0.82 }, 'lib-stone'),
  paving: () => std({ color: 0xd8d0c2, roughness: 0.86 }, 'lib-stone'),
  fins: () => std({ color: 0xb4593a, roughness: 0.45, metalness: 0.4, envMapIntensity: 1.6 }, 'lib-fins'),
  green: () => std({ vertexColors: true, roughness: 0.95 }, 'lib-green'),
  roof: () => std({ color: 0xd3cdc2, roughness: 0.9 }, 'lib-stone'),
  // the lantern: dark glass with a warm room glow
  lantern: () =>
    std({ color: 0x24302f, roughness: 0.05, metalness: 0.3, envMapIntensity: 2.6, emissive: 0xffb070, emissiveIntensity: 0.18 }, 'lib-lantern'),
  canopy: () =>
    std({ color: 0xf1eee8, roughness: 0.55, metalness: 0.05 }, 'lib-canopy', {
      vHead: 'varying float vUpN;',
      vEnd: 'vUpN = normalize( mat3( modelMatrix ) * objectNormal ).y;',
      fHead: 'varying float vUpN;',
      fColor: /* glsl */ `
        if ( vUpN < -0.2 ) {
          float s = fract( vAtmW.x / 0.9 );
          float aa = fwidth( vAtmW.x / 0.9 ) * 1.5;
          float gap = smoothstep( 0.0, aa + 0.08, s ) * smoothstep( 1.0, 0.92 - aa, s );
          diffuseColor.rgb = mix( vec3( 0.16, 0.09, 0.05 ), vec3( 0.62, 0.4, 0.22 ), gap );
        }
      `
    }),
  glowCool: () => patch(new MeshBasicMaterial({ color: new Color(1.5, 2.3, 2.4) }), { key: 'lib-glow' })
};
const KIT = kitMats();
const kitKey = new Map(Object.entries(KIT).map(([k, m]) => [m, k]));

// one material per key and clipping plane (null = never cut)
function matSet(clip) {
  const cache = {};
  return (k) => {
    if (cache[k]) return cache[k];
    let m;
    if (SHELL[k]) m = SHELL[k]();
    else {
      const src = KIT[k];
      m = src.clone();
      if (k === 'books') {
        m.onBeforeCompile = src.onBeforeCompile;
        m.customProgramCacheKey = src.customProgramCacheKey;
      } else patch(m, { key: `kit-${k}`, additive: false });
    }
    if (clip) {
      m.clippingPlanes = [clip];
      m.clipShadows = true;
      // a cut wall shows its inner faces, so it reads solid from above
      if (k !== 'glass' && k !== 'lantern') m.side = DoubleSide;
    }
    return (cache[k] = m);
  };
}

// a kit Part (world coordinates) as meshes with the given material set
function emit(part, parent, get, name) {
  for (const k in part.g) {
    const mesh = new Mesh(merge(part.g[k]), get(k));
    const lit = k !== 'glowCool' && k !== 'glow';
    mesh.castShadow = lit && k !== 'glass';
    mesh.receiveShadow = lit;
    mesh.name = `${name}-${k}`;
    parent.add(mesh);
  }
}

// ---------------------------------------------------------------- drawing helpers
const at = (p, y, fn) => p.at(0, 0, 0, fn, y);

// an axis-aligned concrete wall centred on a line; holes are [a0, a1, sill, head]
// in absolute coordinates along the wall and up
function run(p, ax, line, a, b, y0, y1, holes = [], { t = 0.2, k = 'concrete', c = C.concrete } = {}) {
  const seg = (s0, s1, b0, b1) => {
    if (s1 - s0 < 0.005 || b1 - b0 < 0.005) return;
    const m = (s0 + s1) / 2;
    if (ax) p.box(k, c, s1 - s0, b1 - b0, t, m, b0, line);
    else p.box(k, c, t, b1 - b0, s1 - s0, line, b0, m);
  };
  let s = a;
  for (const [h0, h1, hb, ht] of [...holes].sort((u, v) => u[0] - v[0])) {
    seg(s, h0, y0, y1);
    seg(h0, h1, y0, hb);
    seg(h0, h1, ht, y1);
    s = h1;
  }
  seg(s, b, y0, y1);
}
const wallX = (p, z, xa, xb, y0, y1, holes, o) => run(p, true, z, xa, xb, y0, y1, holes, o);
const wallZ = (p, x, za, zb, y0, y1, holes, o) => run(p, false, x, za, zb, y0, y1, holes, o);
// the kit's steel glazing between two points of a line
const glassX = (p, z, xa, xb, y0, y1, cols, rows) => glazing(p, { x: (xa + xb) / 2, z, y: y0, w: xb - xa, h: y1 - y0, cols, rows });
const glassZ = (p, x, za, zb, y0, y1, cols, rows) => glazing(p, { x, z: (za + zb) / 2, ry: -PI / 2, y: y0, w: zb - za, h: y1 - y0, cols, rows });
const column = (p, x, z, y0, y1) => p.cyl('concrete', C.concrete, 0.225, y1 - y0, x, y0, z, 20);
const slab = (p, x0, x1, z0, z1, y0, y1, k = 'concrete', c = C.concrete) => p.box(k, c, x1 - x0, y1 - y0, z1 - z0, (x0 + x1) / 2, y0, (z0 + z1) / 2);
// 1.1 m glass balustrade with an oak handrail
function railX(p, z, xa, xb, y) {
  p.box('glass', 0xffffff, xb - xa, 1.02, 0.015, (xa + xb) / 2, y, z);
  p.box('wood', C.oak, xb - xa, 0.05, 0.07, (xa + xb) / 2, y + 1.05, z, 0.01);
}
function railZ(p, x, za, zb, y) {
  p.box('glass', 0xffffff, 0.015, 1.02, zb - za, x, y, (za + zb) / 2);
  p.box('wood', C.oak, 0.07, 0.05, zb - za, x, y + 1.05, (za + zb) / 2, 0.01);
}
// a green roof: sedum over a pale gravel margin, a few low mounds
function greenRoof(p, x0, x1, z0, z1, y, rnd) {
  slab(p, x0 + 0.2, x1 - 0.2, z0 + 0.2, z1 - 0.2, y, y + 0.06, 'roof', 0xffffff);
  const greens = [0x6f8450, 0x7d8f58, 0x657a48, 0x8a9a62];
  slab(p, x0 + 0.8, x1 - 0.8, z0 + 0.8, z1 - 0.8, y + 0.06, y + 0.12, 'green', greens[0]);
  const n = Math.round(((x1 - x0) * (z1 - z0)) / 14);
  for (let i = 0; i < n; i++) {
    const x = x0 + 1.2 + rnd() * (x1 - x0 - 2.4);
    const z = z0 + 1.2 + rnd() * (z1 - z0 - 2.4);
    const r = 0.5 + rnd() * 0.9;
    p.add('green', xf(roundBox(r * 2, 0.22, r * 1.6, 0.1, 1), { t: [x, y + 0.12, z], r: [0, rnd() * 3, 0] }), greens[(rnd() * 4) | 0]);
  }
}
// thin twisted terracotta fin, w x d, swept up h, turning a0 -> a1
function twistedFin(w, d, h, a0, a1, segs = 8) {
  const m = new Mesher();
  const Cn = [
    [-w / 2, -d / 2],
    [w / 2, -d / 2],
    [w / 2, d / 2],
    [-w / 2, d / 2]
  ];
  for (let s = 0; s < 4; s++) {
    const c0 = Cn[s];
    const c1 = Cn[(s + 1) % 4];
    let nx = c1[1] - c0[1];
    let nz = -(c1[0] - c0[0]);
    const l = Math.hypot(nx, nz);
    nx /= l;
    nz /= l;
    const base = m.p.length / 3;
    for (let i = 0; i <= segs; i++) {
      const f = i / segs;
      const y = f * h;
      const a = a0 + (a1 - a0) * f;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const r = (x, z) => [x * ca - z * sa, x * sa + z * ca];
      const p0 = r(c0[0], c0[1]);
      const p1 = r(c1[0], c1[1]);
      const n = r(nx, nz);
      m.v(p0[0], y, p0[1], n[0], 0, n[1], 0, y);
      m.v(p1[0], y, p1[1], n[0], 0, n[1], 1, y);
    }
    for (let i = 0; i < segs; i++) {
      const a = base + i * 2;
      m.quad(a, a + 2, a + 3, a + 1);
    }
  }
  return m.build();
}
// the red thread drawn large: a run of twisted terracotta fins along the blind west front
function westFins(p, za, zb, y0, y1, step, phase) {
  for (let z = za + step / 2; z < zb; z += step) {
    const u = (z + phase) * 2.2;
    const a0 = 0.95 * Math.sin(u * 0.085);
    const a1 = 0.95 * Math.sin(u * 0.085 + 1.9);
    p.add('fins', xf(twistedFin(0.1, 0.42 + 0.16 * Math.sin(u * 0.05 + 1), y1 - y0, a0, a1, 6), { t: [-18.45, y0, z], r: [0, PI / 2, 0] }), 0xffffff);
  }
}
// oak fins outside the Well's glass (the book's slats: 0.12 deep, 45 mm, 0.4755 m pitch)
function wellFins(p, za, zb, y0, y1) {
  for (let i = -12; i < 40; i++) {
    const z = -3.4775 + i * 0.4755;
    if (z > za && z < zb) p.box('wood', C.oak, 0.12, y1 - y0, 0.045, 3.65, y0, z);
  }
}
// undulating canopy over the entrance terrace: heightfield over a rounded rectangle
function canopyGeo(cx, cz, hx, hz, yOf, thick, nu, nv) {
  const m = new Mesher();
  const k = 0.45;
  const P = (u, v) => [cx + hx * (u * (1 - k) + k * u * Math.sqrt(1 - (v * v) / 2)), cz + hz * (v * (1 - k) + k * v * Math.sqrt(1 - (u * u) / 2))];
  const nrm = (x, z) => {
    const e = 0.5;
    const dx = (yOf(x + e, z) - yOf(x - e, z)) / (2 * e);
    const dz = (yOf(x, z + e) - yOf(x, z - e)) / (2 * e);
    const l = Math.hypot(dx, 1, dz);
    return [-dx / l, 1 / l, -dz / l];
  };
  const cols = nu + 1;
  for (const top of [true, false]) {
    const base = m.p.length / 3;
    for (let j = 0; j <= nv; j++)
      for (let i = 0; i <= nu; i++) {
        const [x, z] = P((i / nu) * 2 - 1, (j / nv) * 2 - 1);
        const n = nrm(x, z);
        const s = top ? 1 : -1;
        m.v(x, yOf(x, z) - (top ? 0 : thick), z, n[0] * s, n[1] * s, n[2] * s, x, z);
      }
    for (let j = 0; j < nv; j++)
      for (let i = 0; i < nu; i++) {
        const a = base + j * cols + i;
        if (top) m.quad(a, a + cols, a + cols + 1, a + 1);
        else m.quad(a, a + 1, a + cols + 1, a + cols);
      }
  }
  const ring = [];
  for (let i = 0; i < nu; i++) ring.push([(i / nu) * 2 - 1, -1]);
  for (let j = 0; j < nv; j++) ring.push([1, (j / nv) * 2 - 1]);
  for (let i = nu; i > 0; i--) ring.push([(i / nu) * 2 - 1, 1]);
  for (let j = nv; j > 0; j--) ring.push([-1, (j / nv) * 2 - 1]);
  const pts = ring.map(([u, v]) => P(u, v));
  for (let i = 0; i < pts.length; i++) {
    const [x0, z0] = pts[i];
    const [x1, z1] = pts[(i + 1) % pts.length];
    let nx = z1 - z0;
    let nz = -(x1 - x0);
    const l = Math.hypot(nx, nz) || 1;
    nx /= l;
    nz /= l;
    const b = m.p.length / 3;
    m.v(x0, yOf(x0, z0) - thick, z0, nx, 0, nz, 0, 0);
    m.v(x1, yOf(x1, z1) - thick, z1, nx, 0, nz, 1, 0);
    m.v(x1, yOf(x1, z1), z1, nx, 0, nz, 1, 1);
    m.v(x0, yOf(x0, z0), z0, nx, 0, nz, 0, 1);
    m.quad(b, b + 3, b + 2, b + 1);
  }
  return m.build();
}
// floor finish of a room around the book's plinth (which already is that finish)
function floorAround(p, R, D, y, k) {
  const c = k === 'planks' ? C.oak : C.terrazzo;
  const put = (x0, x1, z0, z1) => x1 - x0 > 0.01 && z1 - z0 > 0.01 && slab(p, x0, x1, z0, z1, y - 0.12, y, k, c);
  if (!D) return put(R.x0, R.x1, R.z0, R.z1);
  const dz0 = Math.max(R.z0, D.z0);
  const dz1 = Math.min(R.z1, D.z1);
  put(R.x0, R.x1, R.z0, dz0);
  put(R.x0, R.x1, dz1, R.z1);
  put(R.x0, Math.max(R.x0, D.x0), dz0, dz1);
  put(Math.min(R.x1, D.x1), R.x1, dz0, dz1);
}

// the main stair: n risers of 150 mm on 280 mm goings, rising along dir (±1 in z)
function flight(p, x0, x1, z0, dir, y0, solid, n = 12, rise = 0.15, going = 0.28) {
  const xc = (x0 + x1) / 2;
  for (let i = 0; i < n - 1; i++) {
    const top = y0 + rise * (i + 1);
    const zc = z0 + dir * going * (i + 0.5);
    const bot = solid ? y0 : top - 0.22;
    p.box('concrete', C.concrete, x1 - x0, top - 0.03 - bot, going, xc, bot, zc);
    p.box('wood', C.oak, x1 - x0 - 0.02, 0.03, going + 0.015, xc, top - 0.03, zc);
  }
  // steel posts and an oak handrail on the open side
  const ang = Math.atan2(rise, going);
  const len = Math.hypot((n - 1) * going, (n - 1) * rise);
  return { xc, ang, len, zMid: z0 + dir * going * (n - 1) * 0.5, yMid: y0 + rise * (n - 1) * 0.5 + rise };
}
function stairRail(p, x, f, dir, y0, n = 12, rise = 0.15, going = 0.28) {
  for (let i = 0; i < n - 1; i += 2) p.box('metal', C.steel, 0.03, 1.0, 0.03, x, y0 + rise * (i + 1), f.zMid - dir * going * (n - 1) * 0.5 + dir * going * (i + 0.5));
  p.box('wood', C.oak, 0.06, 0.05, f.len, x, f.yMid + 0.95, f.zMid, 0.01, [dir * f.ang, 0, 0]);
}

// ---------------------------------------------------------------- the building
export function buildLibrary({ tier }) {
  let seed = 4041;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const hi = tier.name === 'high';
  const group = new Group();
  group.name = 'library';
  const figs = [];

  // ---- never cut: podium, terrace, floors, the closed north range, gardens
  const base = new Part();
  const baseSet = matSet(null);
  {
    const p = base;
    // podium under the L-shaped footprint and the entrance terrace
    slab(p, -18.4, 18.4, 3.5, 15.0, 0, FFL0 - 0.12, 'stone', 0xffffff);
    slab(p, -18.4, 3.7, -18.7, 3.5, 0, FFL0 - 0.12, 'stone', 0xffffff);
    slab(p, -18.4, 18.4, 10.9, 15.0, FFL0 - 0.12, FFL0, 'paving', 0xffffff);
    // four 150 mm steps down to the plaza, and a 1:20 ramp running west
    for (let i = 0; i < 4; i++) slab(p, -12, 18.4, 15.0 + i * 0.4, 15.4 + i * 0.4, 0, FFL0 - 0.15 * (i + 1), 'paving', 0xffffff);
    const ra = Math.atan2(FFL0, 12);
    p.add('paving', xf(roundBox(12.05, 0.3, 1.6, 0, 0), { t: [-18, FFL0 / 2 - 0.15, 15.8], r: [0, 0, ra] }), 0xffffff);
    for (let x = -23.5; x <= -12.5; x += 1.5) p.box('metal', C.steel, 0.04, 1.1, 0.04, x, ((x + 24) / 12) * FFL0, 16.55);
    p.add('wood', xf(roundBox(12.05, 0.05, 0.07, 0, 0), { t: [-18, FFL0 / 2 + 1.1, 16.55], r: [0, 0, ra] }), C.oak);
    // floors: each room's finish around the book's plinth; halls in terrazzo
    for (const id of Object.keys(PLAN)) {
      const R = PLAN[id];
      floorAround(p, { x0: R.x0 + 0.1, x1: R.x1 - 0.1, z0: R.z0 + 0.1, z1: R.z1 - 0.1 }, crop(id), R.f, R.floor);
    }
    floorAround(p, { x0: -3.5, x1: 3.5, z0: 3.6, z1: 10.7 }, null, FFL0, 'floor'); // entrance hall
    floorAround(p, { x0: -3.5, x1: 3.5, z0: -10.7, z1: -3.6 }, null, FFL0, 'floor'); // stair hall
    // the closed north range at L0 (archive, core) and the slab carrying the Unassisted Room
    wallX(p, -18, -18, 3.6, FFL0, S0, [[-7.3, -7.0, FFL0 + 0.6, FFL0 + 3.0], [-3.7, -3.4, FFL0 + 0.6, FFL0 + 3.0], [-0.1, 0.2, FFL0 + 0.6, FFL0 + 3.0]]);
    wallX(p, -18, -18, -10.8, S0, PAR0);
    wallZ(p, 3.6, -18, -10.8, FFL0, S0);
    wallZ(p, -18, -18, -10.8, FFL0, PAR0);
    slab(p, -18, -10.8, -18, -10.8, S0, S0 + 0.4);
    greenRoof(p, -18, -10.8, -18, -10.8, S0 + 0.4, rnd);
    slab(p, -10.8, 3.6, -18, -10.8, S0, FFL1 - 0.12); // L1 structural slab
    slab(p, -10.8, 3.7, -18.55, -18.1, S0, FFL1, 'concrete', C.concreteDk); // planter ledge
    westFins(p, -18, -10.8, FFL0, PAR0 - 0.1, hi ? 0.5 : 0.7, 0);
    // east garden and north garden
    const gardens = [
      [4.6, 17.2, -17.4, 2.4],
      [-17, 2.8, -24, -19.6]
    ];
    for (const [x0, x1, z0, z1] of gardens) slab(p, x0, x1, z0, z1, 0, 0.05, 'green', 0x7a8c56);
    const trees = [[8.5, -13.5, 3.0], [14.5, -9.5, 2.6], [9.5, -4.5, 2.4], [15.5, -1.0, 2.8], [12.0, -16.0, 2.2], [-12.5, -22, 2.4], [-4.0, -22.5, 2.0], [-15.5, 18.5, 2.2], [16.5, 19.0, 2.4]];
    trees.forEach(([x, z, s], i) => plant(p, x, z, { s, tree: true, seed: 60 + i, pot: 0x8a7f70 }));
    for (let i = 0; i < (hi ? 26 : 14); i++) {
      const x = 5 + rnd() * 12;
      const z = -17 + rnd() * 19;
      const r = 0.35 + rnd() * 0.45;
      p.add('green', xf(roundBox(r * 2, r * 1.2, r * 2, r * 0.5, 1), { t: [x, 0.05 + r * 0.6, z], r: [0, rnd() * 3, 0] }), [0x4f6b3a, 0x6a8448, 0x3f5a35][(rnd() * 3) | 0]);
    }
    // entrance hall: reception counter, a bench, plants
    at(p, FFL0, () => {
      p.box('wood', C.oak, 2.6, 1.05, 0.7, 1.6, 0, 5.4, 0.01);
      p.box('metal', C.brass, 2.62, 0.02, 0.72, 1.6, 1.05, 5.4);
      p.box('wood', C.walnut, 2.2, 0.45, 0.45, 0.4, 0, 8.4, 0.01);
      plant(p, 3.0, 10.2, { seed: 71, tree: true });
      plant(p, -1.0, 4.2, { seed: 72 });
      floorLamp(p, -0.6, 9.0);
    });
  }
  emit(base, group, baseSet, 'library-base');
  const ppl = [
    [{ pose: 'stand', skin: 0xe2b48c, hair: 0x3a2a1f, hairStyle: 'long', top: 0x6f806c, topStyle: 'coat', bottom: 0x2b2b2d, shoes: 0x1e1e1e, height: 1.68, prop: 'bag' }, 0.9, FFL0, 9.8, PI + 0.2],
    [{ pose: 'talk', skin: 0x5e3b26, hair: 0x1c1714, hairStyle: 'short', top: 0xe8dfcc, topStyle: 'shirt', bottom: 0x45556c, shoes: 0x3a2a1f, height: 1.78 }, 1.6, FFL0, 6.1, PI],
    [{ pose: 'stand', skin: 0xf0c9a4, hair: 0xa88a5c, hairStyle: 'bob', top: 0xa4502f, topStyle: 'sweater', bottom: 0xcdb48c, shoes: 0x6b4a34, height: 1.64, prop: 'book' }, -2.75, FFL1, 1.2, PI],
    [{ pose: 'stand', skin: 0xc68a5a, hair: 0x6a4c30, hairStyle: 'short', top: 0x36507f, topStyle: 'coat', bottom: 0x2b2b2d, shoes: 0x222222, height: 1.75 }, -1.0, FFL1, -6.5, PI]
  ];
  for (const [o, x, y, z, ry] of ppl) {
    const f = makeFigure({ seed: 90 + figs.length, ...o });
    f.traverse((m) => {
      if (m.isMesh) m.castShadow = m.receiveShadow = true;
    });
    const g = new Group();
    g.add(f);
    g.position.set(x, y, z);
    g.rotation.y = ry;
    group.add(g);
    figs.push(f);
  }

  // ---- zones: one group each, a clipping plane per side and one for the rest
  const zones = {};
  function zone(id, top, floor, center, build, { sides = true, to = floor + CLEAR - CUT } = {}) {
    const P = { main: new Part() };
    if (sides) for (const s of ['N', 'E', 'S', 'W']) P[s] = new Part();
    build(P);
    const g = new Group();
    g.name = `shell-${id}`;
    const cuts = [];
    const NRM = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
    for (const [s, part] of Object.entries(P)) {
      const clip = new Plane(new Vector3(0, -1, 0), top + 1);
      emit(part, g, matSet(clip), `shell-${id}-${s}`);
      const hi = floor + CLEAR - CUT;
      cuts.push(s === 'main' ? { plane: clip, to } : { plane: clip, side: NRM[s], lo: floor + SILL - CUT, hi, cur: hi });
    }
    group.add(g);
    zones[id] = { group: g, top, floor, center, cuts };
  }

  // 1 Question Well: double height, the glass wall and its oak fins up both
  // storeys, a glass lantern straight over the pool
  const LX = 0.5;
  const LZ = 0.1;
  zone('well', 10, FFL0, new Vector3(0, FFL0 + 1.5, 0), (P) => {
    // north: the book's bookcase wall stands at L0 east of x -2.0; a door beside it to the stair hall
    wallX(P.N, -3.6, -3.7, -2.0, FFL0, S0, [[-3.5, -2.0, FFL0, FFL0 + 2.4]]);
    wallX(P.N, -3.6, -3.7, 3.7, S0, ROOF, [[-3.5, -2.0, FFL1, FFL1 + 2.4]]);
    // east: glass and fins continue south of the book's and up through L1
    glassZ(P.E, 3.55, 1.3, 3.5, FFL0, S0, 2, 2);
    glassZ(P.E, 3.55, -3.5, 3.5, S0 + 0.1, S1, 6, 2);
    P.E.box('metal', C.steel, 0.1, 0.1, 7.1, 3.55, S0, 0);
    wellFins(P.E, 1.3, 3.55, FFL0, S0);
    wellFins(P.E, -3.55, 3.55, S0, S1 + 0.3);
    wallZ(P.E, 3.6, -3.7, 3.7, S1, PAR1);
    // south: a 4.8 m portal to the entrance hall; the bridge goes through at L1
    wallX(P.S, 3.6, -3.7, 3.7, FFL0, ROOF, [
      [-2.4, 2.4, FFL0, FFL0 + 2.8],
      [-3.5, -2.0, FFL1, FFL1 + 2.4]
    ]);
    // west: shared with the stacks
    wallZ(P.W, -3.6, -3.6, 3.6, FFL0, PAR1);
    // roof with a square well for the lantern
    const m = P.main;
    slab(m, -3.6, 3.6, -3.6, LZ - 2.5, S1, ROOF);
    slab(m, -3.6, 3.6, LZ + 2.5, 3.6, S1, ROOF);
    slab(m, -3.6, LX - 2.5, LZ - 2.5, LZ + 2.5, S1, ROOF);
    slab(m, LX + 2.5, 3.6, LZ - 2.5, LZ + 2.5, S1, ROOF);
    slab(m, -3.4, 3.4, -3.4, 3.4, ROOF, ROOF + 0.05, 'roof', 0xffffff);
    m.add('concrete', xf(ringSector(2.3, 2.55, 0, 2 * PI, 0.35, 48), { t: [LX, ROOF, LZ] }), C.concrete);
    m.add('lantern', xf(cylinder(2.35, 1.1, 48, { caps: false }), { t: [LX, ROOF + 0.35, LZ] }), 0xffffff);
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * 2 * PI;
      m.box('metal', C.steel, 0.05, 1.1, 0.12, LX + Math.sin(a) * 2.37, ROOF + 0.35, LZ + Math.cos(a) * 2.37, 0, [0, a, 0]);
    }
    m.add('concrete', xf(ringSector(1.7, 2.6, 0, 2 * PI, 0.3, 48), { t: [LX, ROOF + 1.45, LZ] }), C.concrete);
    m.add('metal', xf(ringSector(1.6, 1.72, 0, 2 * PI, 0.32, 48), { t: [LX, ROOF + 1.45, LZ] }), C.brass);
    m.add('glowCool', xf(ringSector(1.45, 1.6, 0, 2 * PI, 0.12, 48), { t: [LX, ROOF + 1.62, LZ] }), 0xffffff);
    const dome = [];
    for (let i = 0; i <= 8; i++) dome.push([Math.cos((i / 8) * (PI / 2)) * 1.6, Math.sin((i / 8) * (PI / 2)) * 0.5]);
    m.add('lantern', xf(lathe(dome, 40), { t: [LX, ROOF + 1.7, LZ] }), 0xffffff);
  });

  // 2 Provenance Stacks: blind west front behind terracotta fins, the north
  // book wall run long, borrowed light from the stair hall
  zone('provenance', 5.6, FFL0, new Vector3(-10.8, FFL0 + 1.5, -3.6), (P) => {
    wallX(P.N, -10.8, -18.1, -9.2, FFL0, S0);
    wallZ(P.E, -3.6, -6.1, -3.7, S0 - 0.4, S0); // lintel over the opening from the stair hall
    wallZ(P.W, -18, -10.8, 3.6, FFL0, PAR0);
    westFins(P.W, -10.8, 3.6, FFL0, PAR0 - 0.1, hi ? 0.5 : 0.7, 7);
    const m = P.main;
    column(m, -10.8, -3.6, FFL0, S0);
    slab(m, -18, -3.6, -10.8, 3.6, S0, S0 + 0.4);
    greenRoof(m, -18, -3.6, -10.8, 3.6, S0 + 0.4, rnd);
  });

  // 5 Verification Commons: glazed to the plaza, a door to the stacks
  zone('verify', 5.6, FFL0, new Vector3(-10.8, FFL0 + 1.5, 7.2), (P) => {
    wallX(P.N, 3.6, -18.1, -9.2, FFL0, S0, [[-16.4, -14.8, FFL0, FFL0 + 2.4]]);
    wallZ(P.E, -3.6, 8.3, 10.7, S0 - 0.4, S0);
    // south front: columns on the grid, steel glazing between, a fascia
    for (const x of [-18, -10.8, -3.6]) column(P.S, x, 10.8, FFL0, S0);
    glassX(P.S, 10.8, -17.75, -11.05, FFL0, S0, 4, 2);
    glassX(P.S, 10.8, -10.55, -3.85, FFL0, S0, 4, 2);
    wallX(P.S, 10.8, -18.1, -3.6, S0, PAR0, [], { t: 0.3 });
    wallZ(P.W, -18, 3.6, 10.9, FFL0, PAR0);
    westFins(P.W, 3.6, 10.8, FFL0, PAR0 - 0.1, hi ? 0.5 : 0.7, 21);
    slab(P.main, -18, -3.6, 3.6, 10.8, S0, S0 + 0.4);
    greenRoof(P.main, -18, -3.6, 3.6, 10.8, S0 + 0.4, rnd);
  });

  // 3 Dialogue Alcoves: the felt wall run long, glazed east and south
  zone('dialogue', 5.6, FFL0, new Vector3(10.8, FFL0 + 1.5, 7.2), (P) => {
    wallX(P.N, 3.6, 3.5, 12.4, FFL0, S0);
    wallX(P.N, 3.6, 3.5, 18.1, S0, PAR0);
    glassZ(P.E, 18.0, 8.9, 10.7, FFL0, S0, 2, 2);
    wallZ(P.E, 18.0, 3.5, 10.9, S0, PAR0, [], { t: 0.3 });
    for (const x of [10.8, 18]) column(P.S, x, 10.8, FFL0, S0);
    glassX(P.S, 10.8, 3.8, 10.55, FFL0, S0, 4, 2);
    glassX(P.S, 10.8, 11.05, 17.75, FFL0, S0, 4, 2);
    wallX(P.S, 10.8, 3.6, 18.1, S0, PAR0, [], { t: 0.3 });
    wallZ(P.W, 3.6, 3.6, 10.8, FFL0, S0, [[8.0, 9.8, FFL0, FFL0 + 2.4]]);
    slab(P.main, 3.6, 18, 3.6, 10.8, S0, S0 + 0.4);
    greenRoof(P.main, 3.6, 18, 3.6, 10.8, S0 + 0.4, rnd);
  });

  // 4 Unassisted Room (L1): the book's north window module repeated west
  zone('quiet', 9, FFL1, new Vector3(-3.6, FFL1 + 1.5, -14.4), (P) => {
    const n = P.N;
    for (const x of [-7.25, -10.65]) n.box('concrete', C.concrete, 0.3, CLEAR, 0.3, x, FFL1, -18);
    for (const [x0, x1, cols] of [[-7.1, -2.0, 6], [-10.5, -7.4, 4]]) {
      n.box('concrete', C.concrete, x1 - x0, 0.45, 0.3, (x0 + x1) / 2, FFL1, -18);
      n.box('concrete', C.concrete, x1 - x0, 0.18, 0.3, (x0 + x1) / 2, S1 - 0.18, -18);
      glassX(n, -18, x0, x1, FFL1 + 0.45, S1 - 0.18, cols, 3);
    }
    wallX(n, -18, -10.8, 3.7, S1, PAR1, [], { t: 0.3 });
    wallZ(P.E, 3.6, -13.9, -10.7, FFL1, S1);
    wallZ(P.E, 3.6, -18.15, -10.7, S1, PAR1);
    wallX(P.S, -10.8, -10.9, 3.7, FFL1, PAR1, [[-1.6, -0.4, FFL1, FFL1 + 2.2]]);
    wallZ(P.W, -10.8, -18.15, -10.8, FFL1, PAR1);
    slab(P.main, -10.8, 3.6, -18, -10.8, S1, ROOF);
    slab(P.main, -10.6, 3.4, -17.8, -11.0, ROOF, ROOF + 0.05, 'roof', 0xffffff);
  });

  // the spine: entrance hall, stair hall, stair, L1 gallery, bridge, balcony
  zone(
    'spine',
    9,
    FFL0,
    new Vector3(0, FFL0 + 1.5, -1),
    (P) => {
      const m = P.main;
      // entrance hall: double-height glass front with two pairs of doors
      glassX(m, 10.8, -3.5, 3.5, FFL0, FFL0 + 2.4, 4, 1);
      glassX(m, 10.8, -3.5, 3.5, FFL0 + 2.4, S1, 4, 3);
      for (const x0 of [-1.75, 0]) {
        for (const dx of [0.44, 1.31]) m.box('metal', C.brass, 0.03, 0.03, 0.5, x0 + dx, FFL0 + 1.05, 10.85, 0, [PI / 2, 0, 0]);
        m.box('metal', C.steel, 0.06, 2.4, 0.08, x0 + 0.875, FFL0, 10.8);
      }
      wallX(m, 10.8, -3.7, 3.7, S1, PAR1, [], { t: 0.3 });
      for (const x of [-3.6, 3.6]) wallZ(m, x, 3.6, 10.9, S0, PAR1);
      slab(m, -3.6, 3.6, 3.6, 10.8, S1, ROOF);
      // reading balcony over the hall, reached over the bridge
      slab(m, -3.5, -1.5, 3.7, 10.5, S0, FFL1);
      railZ(m, -1.5, 3.7, 10.5, FFL1);
      railX(m, 10.45, -3.5, -1.5, FFL1);
      // bridge across the Well void along its west wall
      slab(m, -3.5, -2.0, -3.6, 3.7, S0 + 0.05, FFL1);
      railZ(m, -2.0, -3.5, 3.6, FFL1);
      // stair hall: east and north walls, west wall above the stacks, rooflight
      wallZ(m, 3.6, -10.8, -3.6, FFL0, PAR1);
      wallX(m, -10.8, -3.6, 3.6, FFL0, S0);
      wallZ(m, -3.6, -10.8, -3.6, S0, PAR1);
      slab(m, -3.6, 3.6, -10.8, -9.4, S1, ROOF);
      slab(m, -3.6, 3.6, -5.0, -3.6, S1, ROOF);
      slab(m, -3.6, -2.4, -9.4, -5.0, S1, ROOF);
      slab(m, 2.4, 3.6, -9.4, -5.0, S1, ROOF);
      m.box('glass', 0xffffff, 4.8, 0.02, 4.4, 0, ROOF + 0.45, -7.2);
      for (const x of [-2.4, 2.4]) m.box('metal', C.steel, 0.08, 0.45, 4.4, x, ROOF, -7.2);
      for (let z = -9.2; z <= -5.1; z += 1.1) m.box('metal', C.steel, 4.8, 0.06, 0.06, 0, ROOF + 0.4, z);
      // dog-leg stair: up north on the east side to a landing at +2.40, back south to L1
      const f1 = flight(m, 1.8, 3.4, -4.4, -1, FFL0, true);
      slab(m, 0.0, 3.5, -9.08, -7.48, FFL0 + 1.6, FFL0 + 1.8);
      const f2 = flight(m, 0.0, 1.6, -7.48, 1, FFL0 + 1.8, false);
      stairRail(m, 1.75, f1, -1, FFL0);
      stairRail(m, 1.65, f2, 1, FFL0 + 1.8);
      railX(m, -9.06, 0.0, 3.5, FFL0 + 1.8);
      // L1 gallery along the west side to the Unassisted Room's door, lift beside it
      slab(m, -3.5, -0.2, -8.8, -3.6, S0, FFL1);
      slab(m, -1.8, -0.2, -10.7, -8.8, S0, FFL1);
      slab(m, -0.2, 1.6, -4.4, -3.6, S0, FFL1);
      railZ(m, -0.2, -10.7, -4.4, FFL1);
      railZ(m, 1.62, -4.4, -3.7, FFL1);
      for (const [x, z] of [[-3.4, -10.6], [-1.8, -10.6], [-3.4, -8.8], [-1.8, -8.8]]) m.box('metal', C.steel, 0.08, ROOF - FFL0, 0.08, x, FFL0, z);
      for (const y of [S0, FFL1 + 2.3, S1]) slab(m, -3.4, -1.8, -10.6, -8.8, y, y + 0.06, 'metal', C.steel);
      m.box('glass', 0xffffff, 1.6, ROOF - FFL0, 0.015, -2.6, FFL0, -8.8);
      m.box('glass', 0xffffff, 0.015, ROOF - FFL0, 1.8, -1.8, FFL0, -9.7);
      m.box('wood', C.ash, 1.3, 2.3, 1.5, -2.6, FFL0 + 0.05, -9.7, 0.02);
    },
    { sides: false, to: FFL1 + SILL + 0.06 }
  );

  // the canopy over the terrace: lifted off as soon as the building is opened
  const canopyY = (x, z) => 4.75 + 0.3 * Math.sin(x * 0.3 + 0.5) * Math.cos((z - 13) * 0.6) + 0.12 * Math.sin(x * 0.7 + z * 0.4);
  zone(
    'canopy',
    6,
    FFL0,
    new Vector3(0, FFL0 + 1.5, 10),
    (P) => {
      const m = P.main;
      m.add('canopy', canopyGeo(0, 13.1, 13.5, 2.7, canopyY, 0.28, hi ? 64 : 40, hi ? 14 : 10), 0xffffff);
      for (const x of [-9, -1.5, 6.5]) {
        const z = 14.2;
        const yb = 3.0;
        m.add('stone', xf(cylinder(0.16, yb - FFL0, 10, { rTop: 0.12 }), { t: [x, FFL0, z] }), 0xffffff);
        for (let b = 0; b < 4; b++) {
          const a = b * (PI / 2) + 0.4;
          const ex = x + Math.cos(a) * 1.4;
          const ez = z + Math.sin(a) * 1.1;
          m.add('stone', tube([new Vector3(x, yb - 0.1, z), new Vector3((x + ex) / 2, yb + 0.8, (z + ez) / 2), new Vector3(ex, canopyY(ex, ez) - 0.27, ez)], 0.07, 6), 0xffffff);
        }
      }
    },
    { sides: false, to: -1 }
  );

  // ---- question slips rising out of the lantern's oculus (one instanced draw)
  const NS = hi ? 90 : 50;
  const slipGeo = plane(0.3, 0.4);
  xf(slipGeo, { r: [PI / 2, 0, 0] });
  const seeds = new Float32Array(NS * 4);
  for (let i = 0; i < NS; i++) {
    seeds[i * 4] = rnd() * PI * 2;
    seeds[i * 4 + 1] = rnd() * 1.3;
    seeds[i * 4 + 2] = rnd();
    seeds[i * 4 + 3] = 0.7 + rnd() * 0.6;
  }
  const slipMat = patch(new MeshBasicMaterial({ color: new Color(1.9, 1.6, 1.15), transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide }), {
    key: 'lib-slips',
    additive: true,
    uniforms: { uOrigin: { value: new Vector3(LX, ROOF + 1.9, LZ) } },
    vHead: /* glsl */ `
      attribute vec4 aSeed;
      uniform vec3 uOrigin;
      varying float vFade;
    `,
    vBegin: /* glsl */ `
      {
        float life = fract( aSeed.z + uTime * 0.03 * aSeed.w );
        float h = life * 22.0;
        float a = aSeed.x + life * 2.2;
        float r = aSeed.y * ( 1.0 + life * 2.4 );
        vec3 c = uOrigin + vec3( sin( a ) * r + life * life * 7.0, h, cos( a ) * r + life * life * 2.5 );
        float spin = uTime * ( 0.6 + aSeed.w ) + aSeed.x * 3.0;
        float cs = cos( spin ), sn = sin( spin );
        vec3 p = transformed;
        p = vec3( p.x * cs - p.z * sn, p.y, p.x * sn + p.z * cs );
        float tilt = 0.4 * sin( uTime * 1.3 + aSeed.x * 5.0 );
        p = vec3( p.x, p.y * cos( tilt ) - p.z * sin( tilt ), p.y * sin( tilt ) + p.z * cos( tilt ) );
        transformed = c + p * ( 0.6 + 0.4 * smoothstep( 0.0, 0.1, life ) );
        vFade = smoothstep( 0.0, 0.06, life ) * smoothstep( 1.0, 0.55, life );
      }
    `,
    fHead: 'varying float vFade;',
    fColor: 'diffuseColor.rgb *= vFade; diffuseColor.a *= vFade;'
  });
  const slips = new InstancedMesh(slipGeo, slipMat, NS);
  slips.geometry.setAttribute('aSeed', new InstancedBufferAttribute(seeds, 4));
  const dummy = new Object3D();
  for (let i = 0; i < NS; i++) slips.setMatrixAt(i, dummy.matrix);
  slips.frustumCulled = false;
  slips.renderOrder = 2;
  group.add(slips);

  // label anchors: over each zone's roof from afar, over its room once cut
  // open; close framings look into the whole room from the south-west, the
  // way the plates are drawn
  const shellAnchors = {
    well: new Vector3(LX, ROOF + 2.6, LZ),
    provenance: new Vector3(-12.5, PAR0 + 1.2, -5),
    dialogue: new Vector3(12.5, PAR0 + 1.2, 7.2),
    quiet: new Vector3(-4.5, PAR1 + 1.2, -14.4),
    verify: new Vector3(-12.5, PAR0 + 1.2, 7.2)
  };
  const anchors = {};
  const roomAnchors = {};
  const focus = {};
  for (const id of Object.keys(ROOMS)) {
    const R = PLAN[id];
    const cx = (R.x0 + R.x1) / 2;
    const cz = (R.z0 + R.z1) / 2;
    const size = Math.max(R.x1 - R.x0, (R.z1 - R.z0) * 1.25);
    anchors[id] = shellAnchors[id].clone();
    roomAnchors[id] = new Vector3(cx, R.f + 3.6, cz);
    focus[id] = { target: new Vector3(cx, R.f + 0.8, cz), radius: 6 + size * 1.05, phi: 0.92, theta: -0.45 };
  }
  return {
    group,
    zones,
    anchors,
    shellAnchors,
    roomAnchors,
    focus,
    rooms: ROOMS,
    footprint: { x0: -24, x1: 18.4, z0: -24, z1: 16.6 },
    tick(t) {
      for (const f of figs) if (f.userData.tick) f.userData.tick(t);
    },
    furnish
  };
}

// ---------------------------------------------------------------- furniture beyond the crop
// Built with the room, on approach. Same kit, same palette, same modules as
// the book; nothing is placed inside the book's own crop.
const SK = [0x8a5a3c, 0xc68a5a, 0xe2b48c, 0xf0c9a4, 0x5e3b26, 0xd29f78];
const HR = [0x1c1714, 0x3a2a1f, 0x6a4c30, 0xa88a5c, 0x9a9a98];

function alcove(p, cx, cz, k) {
  p.cyl('felt', 0xb9a98c, 1.55, 0.01, cx, 0, cz, 48);
  for (const [a0, a1, c] of [[2.5, 3.4, C.felt[(k * 3 + 4) % 7]], [3.55, 4.55, C.felt[(k * 3 + 5) % 7]]]) {
    p.add('felt', xf(ringSector(1.97, 2.03, a0, a1, 1.75, 18), { t: [cx, 0, cz] }), c);
    p.add('wood', xf(ringSector(1.96, 2.04, a0, a1, 0.025, 18), { t: [cx, 1.75, cz] }), C.oak);
  }
  roundTable(p, cx, cz, { r: 0.62 });
  for (const a of [2.05, 3.25, 4.45, 0.6]) chair(p, cx + Math.sin(a) * 0.92, cz + Math.cos(a) * 0.92, a + PI, { seat: C.felt[(a * 3) % 7 | 0] });
  pendant(p, cx, 2.05, cz, { r: 0.4, top: 2.96, kind: 'drum', c: 0xd9cdb5 });
  beam(p, cx, 2.96, 3.7, cz + 0.3);
  const glaze = [0x9fbfa8, 0xc9a13b, 0x5d7290];
  glaze.forEach((c, i) => {
    const a = i * 2.094 + 0.5;
    p.cyl('metal', C.brass, 0.03, 0.06, cx + Math.sin(a) * 0.2, 0.74, cz + Math.cos(a) * 0.2, 10, 0.012);
    p.add('glaze', xf(sphere(0.06, 16, 12), { t: [cx + Math.sin(a) * 0.2, 0.86, cz + Math.cos(a) * 0.2] }), c);
  });
}

const FURNISH = {
  well({ p, fig }) {
    at(p, FFL0, () => {
      beam(p, 0.5, 2.96, 0.35, 3.5); // the book's beam, on to the portal
      lounge(p, -2.9, -1.3, PI / 2, { c: C.felt[0] });
      lounge(p, -2.9, 0.4, PI / 2, { c: C.felt[3] });
      plant(p, -3.05, 3.0, { seed: 9, tree: true });
      floorLamp(p, -3.1, -2.5);
    });
    fig({ pose: 'stand', skin: SK[5], hair: HR[1], hairStyle: 'curly', top: 0x2f4b3b, topStyle: 'coat', bottom: 0x3a3a3c, shoes: 0x1c1c1c, height: 1.7, prop: 'bag' }, -0.6, FFL0, 3.2, PI + 0.3);
    fig({ pose: 'sit', seat: 0.45, skin: SK[3], hair: HR[3], hairStyle: 'bun', top: 0xe8dfcc, topStyle: 'sweater', bottom: 0x45556c, shoes: 0x6b4a34, prop: 'book', height: 1.66 }, -2.95, FFL0, 0.4, PI / 2);
  },
  provenance({ p, fig, dens }) {
    at(p, FFL0, () => {
      // the north book wall runs on west: same 3.05 m cases, brass rail, a second ladder
      for (let i = 0; i < 3; i++) {
        const x = -10.59 - i * 2.88;
        bookcase(p, { x, z: -10.52, w: 2.88, h: 3.05, d: 0.36, rows: 9, seed: 50 + i, dens });
        p.box('metal', C.brass, 2.86, 0.02, 0.02, x, 2.86, -10.3);
      }
      ladder(p, -14.2, -10.32, 0, 2.86);
      // cases along the blind west wall, at stack height
      for (let i = 0; i < 4; i++) bookcase(p, { x: -17.72, z: -8.8 + i * 3.1, ry: PI / 2, w: 3.0, h: 2.2, d: 0.34, rows: 6, seed: 60 + i, dens });
      // more ranges of the book's module (2.5 x 0.6 x 2.2 m), 1.8 m centres (1.2 m aisles)
      const ranges = [
        [-8.6, [-10.5, -12.3, -14.1, -15.9]],
        [-4.6, [-12.3, -14.1, -15.9]],
        [-0.6, [-8.7, -10.5, -12.3, -14.1, -15.9]]
      ];
      let s = 70;
      for (const [zc, xs] of ranges)
        for (const x of xs)
          p.at(x, zc, PI / 2, () => {
            bookcase(p, { w: 2.5, h: 2.2, d: 0.3, rows: 6, seed: s++, z: 0.15, dens });
            bookcase(p, { w: 2.5, h: 2.2, d: 0.3, rows: 6, seed: s++, z: -0.15, ry: PI, dens });
          });
      // a second lineage table under the book's beam, red threads to the ranges
      table(p, { x: -5.45, z: -0.6, w: 2.5, d: 0.95, h: 0.76, ry: PI / 2, leg: C.oak, legK: 'wood' });
      openBook(p, -5.4, 0.76, -1.1, 0.2);
      openBook(p, -5.55, 0.76, 0.0, -0.3, 0x27344e);
      for (let i = 0; i < 5; i++) p.box('solid', C.paper, 0.1, 0.004, 0.14, -5.2 - (i % 2) * 0.4, 0.76, -0.9 + i * 0.12, 0, [0, i * 0.4, 0]);
      for (const [a, b] of [
        [[-5.3, 0.82, -1.0], [-8.4, 1.9, -1.4]],
        [[-5.6, 0.82, 0.2], [-8.4, 1.2, 0.3]],
        [[-5.5, 0.82, -0.4], [-10.2, 2.0, -0.9]],
        [[-5.4, 0.82, -1.6], [-3.8, 1.6, -3.3]]
      ])
        thread(p, a, b, 0.14, C.red, 0.006);
      chair(p, -6.1, -1.0, PI / 2);
      chair(p, -6.1, 0.1, PI / 2);
      chair(p, -4.8, -0.5, -PI / 2);
      beam(p, -5.45, 2.96, -6.15, 3.5);
      pendant(p, -5.45, 1.75, -1.2, { r: 0.2, top: 2.96 });
      pendant(p, -5.45, 1.75, 0.1, { r: 0.2, top: 2.96, i: 0.8 });
      // reading corner by the south wall
      lounge(p, -16.4, 2.5, PI, { c: C.felt[2] });
      lounge(p, -15.2, 2.5, PI, { c: C.felt[5] });
      floorLamp(p, -17.2, 2.9);
      plant(p, -4.2, 3.05, { seed: 21, tree: true });
    });
    fig({ pose: 'read', skin: SK[2], hair: HR[0], hairStyle: 'short', top: 0x6f806c, topStyle: 'sweater', bottom: 0x2d3a52, shoes: 0x3a2a1f, prop: 'book', height: 1.72 }, -11.4, FFL0, -8.2, -PI / 2 + 0.3);
    fig({ pose: 'sit', seat: 0.45, skin: SK[1], hair: HR[2], hairStyle: 'long', top: 0xa0604a, topStyle: 'sweater', bottom: 0x3a2a1f, shoes: 0x222222, prop: 'book', height: 1.64 }, -6.16, FFL0, -1.0, PI / 2);
    fig({ pose: 'reach', skin: SK[4], hair: HR[1], hairStyle: 'bob', top: 0xe9e1d0, topStyle: 'shirt', bottom: 0x4a6380, shoes: 0x6b4a34, height: 1.7 }, -13.5, FFL0, -9.6, PI);
  },
  verify({ p, fig }) {
    at(p, FFL0, () => {
      // evidence wall and archive cases alternate west along the north wall
      bookcase(p, { x: -10.1, z: 3.91, w: 1.6, h: 2.7, d: 0.4, rows: 6, seed: 81, items: 'boxes', c: C.ash });
      cardWall(p, { x: -12.8, z: 3.72, w: 3.6, h: 1.5, y: 0.95, seed: 13 });
      bookcase(p, { x: -17.2, z: 3.91, w: 1.2, h: 2.7, d: 0.4, rows: 6, seed: 83, items: 'boxes', c: C.ash });
      // a second verification bench, as the book's
      const bx = -12.4;
      const bz = 5.9;
      table(p, { x: bx, z: bz, w: 3.2, d: 0.9, h: 0.9, shelf: true });
      for (let i = 0; i < 6; i++) p.box('solid', C.paper, 0.21, 0.003, 0.297, bx - 1.15 + i * 0.45, 0.9, bz + 0.05 + (i % 2) * 0.08, 0, [0, (i % 3) * 0.2 - 0.2, 0]);
      for (let i = 0; i < 4; i++) p.box('solid', 0xc4a67c, 0.36, 0.26, 0.3, bx - 1.15 + i * 0.75, 0.25, bz, 0.01);
      deskLamp(p, bx - 1.1, 0.9, bz - 0.3, 0);
      deskLamp(p, bx + 0.85, 0.9, bz - 0.3, 0, { i: 0.5 });
      magnifier(p, bx - 0.3, 0.9, bz - 0.2, 0);
      press(p, bx + 1.3, 0.9, bz + 0.05, -0.4);
      for (const x of [-0.65, 0.45]) stool(p, bx + x, bz - 0.68);
      stool(p, bx - 0.05, bz + 0.72);
      beam(p, bx, 2.96, 3.7, 10.7);
      p.box('metal', C.steel, 1.8, 0.05, 0.09, bx, 2.0, bz);
      p.box('glow', 0xffffff, 1.74, 0.01, 0.06, bx, 1.995, bz);
      for (const sx of [-0.8, 0.8]) p.rod('metal', C.steel, [[bx + sx, 2.05, bz], [bx, 2.96, bz]], 0.004, 4);
      beam(p, -6.8, 2.96, 6.5, 10.7); // the book's beam, on to the front
      // public seats by the south glass
      lounge(p, -16.0, 9.7, PI, { c: C.felt[2] });
      lounge(p, -14.8, 9.7, PI, { c: C.felt[4] });
      table(p, { x: -15.4, z: 8.85, w: 0.9, d: 0.5, h: 0.4, leg: C.walnut, legK: 'wood' });
      plant(p, -17.3, 10.0, { seed: 17, tree: true });
      plant(p, -9.7, 10.1, { seed: 19 });
    });
    fig({ pose: 'sit', seat: 0.65, skin: SK[0], hair: HR[4], hairStyle: 'short', top: 0x45556c, topStyle: 'coat', bottom: 0x3a3a3c, shoes: 0x1c1c1c, prop: 'book', height: 1.74 }, -13.05, FFL0, 5.2, 0);
    fig({ pose: 'stand', skin: SK[2], hair: HR[2], hairStyle: 'long', top: 0xc7a85e, topStyle: 'sweater', bottom: 0x2b2b2d, shoes: 0x3a2a1f, prop: 'tablet', height: 1.66 }, -10.4, FFL0, 6.1, -PI / 2 + 0.3);
    fig({ pose: 'reach', skin: SK[5], hair: HR[0], hairStyle: 'bun', top: 0x36507f, topStyle: 'shirt', bottom: 0xcdb48c, shoes: 0x222222, height: 1.7 }, -12.6, FFL0, 4.35, PI);
  },
  dialogue({ p, fig }) {
    at(p, FFL0, () => {
      // the felt panel grid runs on west along the north wall
      for (let i = -6; i < 0; i++) for (let j = 0; j < 2; j++) p.box('felt', C.felt[(((i + j * 2) % 7) + 7) % 7], 1.18, 1.0, 0.05, 13.25 + i * 1.33, 0.9 + j * 1.1, 3.73, 0.03);
      alcove(p, 10.3, 7.2, 1);
      alcove(p, 5.9, 7.2, 2);
      beam(p, 14.8, 2.96, 7.5, 10.7); // the book's beam, on to the front
      plant(p, 17.3, 10.2, { seed: 23, tree: true });
      plant(p, 8.1, 10.2, { seed: 25 });
    });
    const sit = (cx, a, o) => fig({ seat: 0.45, ...o }, cx + Math.sin(a) * 0.98, FFL0, 7.2 + Math.cos(a) * 0.98, a + PI);
    sit(10.3, 2.05, { pose: 'sitTalk', skin: SK[3], hair: HR[1], hairStyle: 'bob', top: 0x2f4b3b, topStyle: 'sweater', bottom: 0x2b2b2d, shoes: 0x1e1e1e, height: 1.66 });
    sit(10.3, 4.45, { pose: 'sit', skin: SK[0], hair: HR[0], hairStyle: 'short', top: 0xe8dfcc, topStyle: 'shirt', bottom: 0x45556c, shoes: 0x6b4a34, prop: 'cup', height: 1.8 });
    sit(5.9, 3.25, { pose: 'sitTalk', skin: SK[1], hair: HR[3], hairStyle: 'long', top: 0xa4502f, topStyle: 'coat', bottom: 0x8c8070, shoes: 0x2a2a2a, height: 1.68 });
  },
  quiet({ p, fig, dens }) {
    at(p, FFL1, () => {
      // planters on the ledge under the continued window
      for (const [x0, x1] of [[-10.6, -7.4], [-7.1, -2.0]]) {
        p.box('concrete', C.concreteDk, x1 - x0, 0.32, 0.3, (x0 + x1) / 2, 0, -18.35);
        for (let x = x0 + 0.5; x < x1 - 0.3; x += 1.15) plant(p, x, -18.29, { s: 0.45, pot: C.concreteDk, seed: 30 + Math.round(-x * 10), y: 0.1, tree: true });
      }
      curtain(p, { x: -6.3, z: -17.76, w: 1.2, h: 2.85 });
      curtain(p, { x: -9.9, z: -17.76, w: 1.0, h: 2.85 });
      bookcase(p, { x: -4.4, z: -17.68, w: 2.2, h: 0.9, d: 0.32, rows: 2, seed: 91, dens });
      bookcase(p, { x: -8.4, z: -17.68, w: 1.8, h: 0.9, d: 0.32, rows: 2, seed: 93, dens });
      // the long table repeats west, with its chairs and lamps
      const tz = -14.85;
      for (const tx of [-4.3, -8.6]) {
        table(p, { x: tx, z: tz, w: 3.4, d: 1.0 });
        for (const dx of [-1.1, 0, 1.1]) chair(p, tx + dx, tz - 0.62, 0);
        for (const dx of [-1.1, 1.1]) chair(p, tx + dx, tz + 0.58, PI);
        deskLamp(p, tx - 1.1, 0.74, tz - 0.15, PI);
        deskLamp(p, tx + 1.1, 0.74, tz - 0.15, PI, { i: 0.5 });
        openBook(p, tx, 0.74, tz - 0.2);
      }
      lounge(p, -9.8, -12.0, 2.4, { c: C.felt[3] });
      floorLamp(p, -10.3, -11.4);
      plant(p, -3.0, -11.35, { seed: 8 });
    });
    fig({ pose: 'sit', seat: 0.45, skin: SK[3], hair: HR[2], hairStyle: 'long', top: 0xe9e1d0, topStyle: 'sweater', bottom: 0x45556c, shoes: 0x6b4a34, prop: 'book', height: 1.64 }, -4.3, FFL1, -15.53, 0);
    fig({ pose: 'sit', seat: 0.45, skin: SK[4], hair: HR[0], hairStyle: 'short', top: 0x66784a, topStyle: 'shirt', bottom: 0x3a3a3c, shoes: 0x1c1c1c, prop: 'book', height: 1.78 }, -7.5, FFL1, -14.21, PI);
  }
};

export function furnish(id, { tier } = {}) {
  const group = new Group();
  group.name = `furnish-${id}`;
  const figs = [];
  const p = new Part();
  const fig = (o, x, y, z, ry) => {
    const f = makeFigure({ seed: 40 + figs.length * 3 + id.length, ...o });
    f.traverse((m) => {
      if (m.isMesh) m.castShadow = m.receiveShadow = true;
    });
    const g = new Group();
    g.add(f);
    g.position.set(x, y, z);
    g.rotation.y = ry;
    group.add(g);
    figs.push(f);
  };
  if (FURNISH[id]) FURNISH[id]({ p, fig, dens: (tier && tier.books) || 1 });
  group.add(p.build(0, 0, 0, 0));
  return {
    group,
    tick(t) {
      for (const f of figs) if (f.userData.tick) f.userData.tick(t);
    }
  };
}
