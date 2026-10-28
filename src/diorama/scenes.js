import { Group, Vector3 } from 'three';
import { ringSector, cylinder, sphere, tube, xf } from '../core/geo.js';
import { Part, Y0, C, plinth, wall, glazing, slats, beam, bookcase, pendant, floorLamp, deskLamp, table, roundTable, chair, stool, lounge, plant, ladder, openBook, thread, cardWall, press, magnifier, curtain } from './kit.js';
import { makeFigure } from './figures.js';

// The five miniatures, one per zone (ZONE_ORDER in src/i18n.js), built in
// metres as cut-away rooms on a 5.7 × 6.7 m plinth: walls only at the back
// (-z) and on the right (+x), so the reader looks in from the front. Every
// top-level child stands on the floor, so the plates can stand them up one
// by one.

const PW = 5.7;
const PD = 6.7;
const HB = 3.2; // wall height
const BZ = -PD / 2 + 0.1; // back wall centre
const RX = PW / 2 - 0.1; // right wall centre
const PI = Math.PI;

function scene(tier) {
  const group = new Group();
  const figs = [];
  const lamps = [];
  const anim = [];
  const add = (p, x = 0, z = 0, ry = 0, y = Y0) => {
    const g = p.build(x, z, ry, y);
    group.add(g);
    g.updateMatrix();
    for (const L of p.lamps) lamps.push({ pos: L.p.clone().applyMatrix4(g.matrix), color: L.color, intensity: L.intensity });
    return g;
  };
  // person: o = makeFigure options; (x, z) = hip point on the floor, facing ry
  const fig = (o, x, z, ry = 0, y = 0) => {
    const f = makeFigure({ seed: figs.length + 1, ...o });
    f.traverse((m) => {
      if (m.isMesh) m.castShadow = m.receiveShadow = true;
    });
    const g = new Group();
    g.add(f);
    g.position.set(x, Y0 + y, z);
    g.rotation.y = ry;
    group.add(g);
    figs.push(f);
    return f;
  };
  const dens = (tier && tier.books) || 1;
  return { group, figs, lamps, anim, add, fig, dens };
}

// plinth, back wall (optionally with a hole) and the right wall
function shell(S, { floor = 'planks', back = true, right = true, rightHole = null, rightLen = 4.6 } = {}) {
  let p = new Part();
  plinth(p, PW, PD, floor);
  S.add(p, 0, 0, 0, 0);
  if (back) {
    p = new Part();
    wall(p, { w: PW, h: HB, z: 0 });
    S.add(p, 0, BZ);
  }
  if (right) {
    p = new Part();
    wall(p, { w: rightLen, h: HB, hole: rightHole });
    if (rightHole) glazing(p, { w: rightHole[1] - rightHole[0], h: rightHole[3] - rightHole[2], x: (rightHole[0] + rightHole[1]) / 2, y: rightHole[2], cols: 2, rows: 3 });
    S.add(p, RX, BZ + 0.1 + rightLen / 2, -PI / 2);
  }
}

// people: skin / hair / clothing palettes
const SK = [0x8a5a3c, 0xc68a5a, 0xe2b48c, 0xf0c9a4, 0x5e3b26, 0xd29f78];
const HR = [0x1c1714, 0x3a2a1f, 0x6a4c30, 0xa88a5c, 0x9a9a98];

// ---------------------------------------------------------------- 0 the question well
function well(S) {
  shell(S, { floor: 'floor', right: false });
  let p = new Part();
  bookcase(p, { w: 5.4, h: 3.0, d: 0.34, rows: 8, seed: 3, dens: S.dens });
  S.add(p, -0.05, BZ + 0.27);
  // glass curtain wall with timber fins outside
  p = new Part();
  glazing(p, { w: 4.8, h: HB, cols: 4, rows: 2 });
  slats(p, { w: 4.8, h: HB, n: 11, z: -0.1, depth: 0.12, thick: 0.045, rails: false });
  S.add(p, RX - 0.05, BZ + 0.1 + 2.4, -PI / 2);
  // reading ring around a still pool
  const cx = -0.35;
  const cz = 0.45;
  const gap = 0.6;
  p = new Part();
  p.add('wood', ringSector(1.05, 1.5, gap, 2 * PI - gap, 0.25, 44), C.oak);
  p.add('wood', ringSector(1.5, 1.98, gap + 0.12, 2 * PI - gap - 0.12, 0.7, 44), C.oak);
  p.add('floor', ringSector(0.7, 0.92, 0, 2 * PI, 0.14, 44), C.terrazzo);
  p.add('water', xf(cylinder(0.71, 0.09, 44), { t: [0, 0.01, 0] }));
  for (const [a, c] of [[2.2, C.felt[1]], [3.0, C.felt[2]], [4.4, C.felt[3]]]) p.box('felt', c, 0.42, 0.06, 0.4, Math.sin(a) * 1.74, 0.7, Math.cos(a) * 1.74, 0.025, [0, a, 0]);
  S.add(p, cx, cz);
  // beam and the glowing ring hung over the pool
  p = new Part();
  beam(p, 0, 2.96, BZ + 0.1 - cz, 0.25);
  const ring = [];
  for (let i = 0; i <= 48; i++) ring.push(new Vector3(Math.sin((i / 48) * 2 * PI) * 0.85, 2.4, Math.cos((i / 48) * 2 * PI) * 0.85));
  p.add('glow', tube(ring, 0.028, 8, { closed: true }));
  for (let i = 0; i < 3; i++) p.rod('metal', C.steel, [[Math.sin(i * 2.094) * 0.85, 2.4, Math.cos(i * 2.094) * 0.85], [0, 2.96, 0]], 0.004, 4);
  p.lamp(0, 2.3, 0, 0xffd9a8, 1);
  S.add(p, cx, cz);
  p = new Part();
  plant(p, 2.15, -2.35, { tree: true, seed: 2 });
  plant(p, -2.35, 2.7, { s: 1.1, seed: 4 });
  floorLamp(p, 2.2, 2.3);
  S.add(p);
  // people
  const seat = (a, o) => S.fig({ pose: 'sit', seat: 0.45, ...o }, cx + Math.sin(a) * 1.68, cz + Math.cos(a) * 1.68, a + PI, 0.25);
  seat(4.1, { skin: SK[1], hair: HR[0], hairStyle: 'bun', top: 0xc7a85e, topStyle: 'sweater', bottom: 0x2d3a52, shoes: 0x222222, prop: 'book', height: 1.66 });
  seat(2.35, { skin: SK[4], hair: HR[0], hairStyle: 'curly', top: 0xe8dfcc, topStyle: 'shirt', bottom: 0x4a4038, shoes: 0x6b4a34, prop: 'cup', height: 1.8 });
  S.fig({ pose: 'stand', skin: SK[3], hair: HR[3], hairStyle: 'bob', top: 0x66784a, topStyle: 'coat', bottom: 0x2b2b2d, shoes: 0x1e1e1e, height: 1.7 }, cx + 0.3, cz + 1.25, 0.24 + PI);
  S.fig({ pose: 'reach', skin: SK[2], hair: HR[1], hairStyle: 'short', top: 0x36507f, topStyle: 'shirt', bottom: 0xcdb48c, shoes: 0x3a2a1f, height: 1.76, prop: 'bag' }, 1.25, BZ + 0.85, PI);
}

// ---------------------------------------------------------------- 1 provenance stacks
function provenance(S) {
  shell(S, { rightHole: [-1.2, 0.6, 0.5, 2.9] });
  // book wall with brass rail and rolling ladder
  let p = new Part();
  bookcase(p, { w: 5.4, h: 3.05, d: 0.36, rows: 9, seed: 11, dens: S.dens });
  p.box('metal', C.brass, 5.3, 0.02, 0.02, 0, 2.86, 0.22);
  ladder(p, 1.35, 0.2, 0, 2.86);
  S.add(p, -0.05, BZ + 0.28);
  // two double-sided stacks running toward the reader
  for (const [sx, seed] of [[-2.35, 21], [-1.05, 27]]) {
    p = new Part();
    bookcase(p, { w: 2.5, h: 2.2, d: 0.3, rows: 6, seed, z: 0.15, dens: S.dens });
    bookcase(p, { w: 2.5, h: 2.2, d: 0.3, rows: 6, seed: seed + 3, z: -0.15, ry: PI, dens: S.dens });
    S.add(p, sx, -1.05, PI / 2);
  }
  // lineage table with red threads up to the shelves
  p = new Part();
  table(p, { w: 2.5, d: 0.95, h: 0.76, ry: PI / 2, leg: C.oak, legK: 'wood' });
  openBook(p, 0.05, 0.76, -0.6, 0.2);
  openBook(p, -0.15, 0.76, 0.45, -0.3, 0x27344e);
  for (let i = 0; i < 5; i++) p.box('solid', C.paper, 0.1, 0.004, 0.14, 0.25 - (i % 2) * 0.4, 0.76, -0.1 + i * 0.12, 0, [0, i * 0.4, 0]);
  S.add(p, 0.9, 0.2);
  p = new Part();
  const tops = [[0.95, 0.42, -0.4], [0.75, 0.42, 0.65], [1.05, 0.42, 0.1], [0.8, 0.42, -0.1]];
  const ends = [[-0.6, 2.2, BZ + 0.47], [0.4, 1.4, BZ + 0.47], [1.8, 2.5, BZ + 0.47], [-0.75, 1.5, -0.2], [-0.75, 1.0, 0.0], [2.05, 0.9, -2.0]];
  ends.forEach((e, i) => thread(p, tops[i % 4].map((v, k) => (k === 1 ? v + 0.4 : v)), e, 0.12 + (i % 3) * 0.06, C.red, 0.006));
  S.add(p);
  // card catalogue and a glass display case
  p = new Part();
  p.box('wood', C.oak, 1.1, 1.0, 0.5, 0, 0, 0, 0.01);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
    p.box('wood', 0xe3cca8, 0.33, 0.2, 0.02, -0.36 + j * 0.36, 0.1 + i * 0.22, 0.25, 0.004);
    p.box('metal', C.brass, 0.07, 0.025, 0.02, -0.36 + j * 0.36, 0.17 + i * 0.22, 0.27);
  }
  S.add(p, 2.3, -2.25, -PI / 2);
  p = new Part();
  p.box('wood', C.walnut, 0.9, 0.85, 0.6, 0, 0, 0, 0.01);
  p.box('glass', 0xffffff, 0.86, 0.42, 0.56, 0, 0.85, 0);
  for (const sx of [-0.43, 0.43]) for (const sz of [-0.28, 0.28]) p.box('metal', C.brass, 0.015, 0.42, 0.015, sx, 0.85, sz);
  openBook(p, 0, 0.86, 0, 0.1, 0xa4502f);
  S.add(p, 2.15, 2.25, -0.2);
  // beam and two pendants over the table
  p = new Part();
  beam(p, 0.9, 2.96, BZ + 0.1, 1.4);
  pendant(p, 0.9, 1.75, -0.35, { r: 0.2, top: 2.96 });
  pendant(p, 0.9, 1.75, 0.75, { r: 0.2, top: 2.96, i: 0.8 });
  S.add(p);
  p = new Part();
  chair(p, 0.25, -0.3, PI / 2);
  S.add(p);
  S.fig({ pose: 'reach', skin: SK[0], hair: HR[4], hairStyle: 'short', top: 0x2f4b3b, topStyle: 'coat', bottom: 0x3a3a3c, shoes: 0x1c1c1c, height: 1.74 }, 1.62, 0.35, -PI / 2);
  S.fig({ pose: 'sit', seat: 0.45, skin: SK[3], hair: HR[2], hairStyle: 'long', top: 0xe9e1d0, topStyle: 'sweater', bottom: 0x4a6380, shoes: 0x6b4a34, prop: 'book', height: 1.64 }, 0.19, -0.3, PI / 2);
  S.fig({ pose: 'read', skin: SK[5], hair: HR[0], hairStyle: 'bob', top: 0xa0604a, topStyle: 'dress', bottom: 0x3a2a1f, shoes: 0x222222, prop: 'book', height: 1.62 }, -1.7, -0.55, -PI / 2 + 0.3);
}

// ---------------------------------------------------------------- 2 dialogue alcoves
function dialogue(S) {
  shell(S, { right: false });
  // acoustic felt panels on the back wall
  let p = new Part();
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) p.box('felt', C.felt[(i + j * 2) % 7], 1.18, 1.0, 0.05, -2.0 + i * 1.33, 0.9 + j * 1.1, 0, 0.03);
  S.add(p, 0, BZ + 0.13);
  p = new Part();
  glazing(p, { w: 5.2, h: HB, cols: 5, rows: 2 });
  S.add(p, RX, BZ + 0.1 + 2.6, -PI / 2);
  // rug, curved felt screens, round table, tutors
  const cx = -0.45;
  const cz = 0.35;
  p = new Part();
  p.cyl('felt', 0xb9a98c, 1.55, 0.01, 0, 0, 0, 48);
  for (const [a0, a1, c] of [[2.5, 3.4, C.felt[0]], [3.55, 4.55, C.felt[1]]]) {
    p.add('felt', ringSector(1.97, 2.03, a0, a1, 1.75, 18), c);
    p.add('wood', xf(ringSector(1.96, 2.04, a0, a1, 0.025, 18), { t: [0, 1.75, 0] }), C.oak);
  }
  roundTable(p, 0, 0, { r: 0.62 });
  S.add(p, cx, cz);
  const tutors = new Part();
  const glaze = [0x9fbfa8, 0xc9a13b, 0x5d7290];
  const bobs = glaze.map((c, i) => {
    const a = i * 2.094 + 0.5;
    tutors.cyl('metal', C.brass, 0.03, 0.06, Math.sin(a) * 0.2, 0.74, Math.cos(a) * 0.2, 10, 0.012);
    return tutors.mesh('glaze', xf(sphere(0.06, 16, 12), { t: [Math.sin(a) * 0.2, 0.86, Math.cos(a) * 0.2] }), c);
  });
  S.add(tutors, cx, cz);
  S.anim.push((t) => bobs.forEach((m, i) => (m.position.y = Math.sin(t * 1.3 + i * 2.1) * 0.015)));
  // chairs and the three sitters, facing the table
  p = new Part();
  const seats = [2.05, 3.25, 4.45];
  for (const a of [...seats, 0.6]) chair(p, cx + Math.sin(a) * 0.92, cz + Math.cos(a) * 0.92, a + PI, { seat: C.felt[(a * 3) % 7 | 0] });
  pendant(p, cx, 2.05, cz, { r: 0.4, top: 2.96, kind: 'drum', c: 0xd9cdb5 });
  beam(p, cx, 2.96, BZ + 0.1, cz + 0.3);
  S.add(p);
  const sit = (k, o) => S.fig({ seat: 0.45, ...o }, cx + Math.sin(seats[k]) * 0.98, cz + Math.cos(seats[k]) * 0.98, seats[k] + PI);
  sit(0, { pose: 'sitTalk', skin: SK[2], hair: HR[1], hairStyle: 'short', top: 0xa4502f, topStyle: 'sweater', bottom: 0x2b2b2d, shoes: 0x1e1e1e, height: 1.78 });
  sit(1, { pose: 'sit', skin: SK[4], hair: HR[0], hairStyle: 'long', top: 0xe8dfcc, topStyle: 'shirt', bottom: 0x45556c, shoes: 0x6b4a34, prop: 'cup', height: 1.65 });
  sit(2, { pose: 'sitTalk', skin: SK[3], hair: HR[4], hairStyle: 'short', top: 0x2d3a52, topStyle: 'coat', bottom: 0x8c8070, shoes: 0x2a2a2a, height: 1.72 });
  // sofa nook behind a slat screen
  p = new Part();
  slats(p, { w: 1.7, h: 2.3, n: 14, x: 0.95, z: BZ + 0.15 + 0.85, ry: PI / 2 });
  lounge(p, 1.85, BZ + 0.6, 0, { c: C.felt[2], n: 2 });
  table(p, { x: 1.85, z: BZ + 1.45, w: 0.8, d: 0.45, h: 0.4, leg: C.walnut, legK: 'wood' });
  floorLamp(p, 2.5, BZ + 1.5);
  plant(p, 2.35, 2.6, { seed: 7, tree: true, s: 0.9 });
  S.add(p);
  S.fig({ pose: 'talk', skin: SK[1], hair: HR[2], hairStyle: 'curly', top: 0xc7a85e, topStyle: 'shirt', bottom: 0x2f4b3b, shoes: 0x3a2a1f, prop: 'tablet', height: 1.68 }, 1.25, 0.45, -PI / 2 - 0.25);
}

// ---------------------------------------------------------------- 3 the unassisted room
function quiet(S) {
  shell(S, { back: false, rightLen: 4.4 });
  // north window: piers, sill, lintel, steel glazing; planting outside
  const wz = BZ + 0.4;
  let p = new Part();
  for (const sx of [-1, 1]) p.box('concrete', C.concrete, 0.3, HB, 0.3, sx * (PW / 2 - 0.15), 0, 0);
  p.box('concrete', C.concrete, PW - 0.6, 0.45, 0.3, 0, 0, 0);
  p.box('concrete', C.concrete, PW - 0.6, 0.18, 0.3, 0, HB - 0.18, 0);
  glazing(p, { w: PW - 0.6, h: HB - 0.63, y: 0.45, cols: 6, rows: 3 });
  S.add(p, 0, wz);
  p = new Part();
  p.box('concrete', C.concreteDk, PW - 0.1, 0.32, 0.3, 0, 0, 0);
  for (let i = 0; i < 5; i++) plant(p, -2.3 + i * 1.15, 0.06, { s: 0.45, pot: C.concreteDk, seed: 30 + i, y: 0.1, tree: true });
  S.add(p, 0, BZ + 0.05);
  p = new Part();
  curtain(p, { x: -1.95, z: wz + 0.24, w: 1.2, h: 2.85 });
  S.add(p);
  // low shelves along the right wall
  p = new Part();
  bookcase(p, { w: 2.2, h: 0.9, d: 0.32, rows: 2, seed: 31, dens: S.dens });
  plant(p, 0.75, 0, { s: 0.55, seed: 12, y: 0.9 });
  p.cyl('glaze', 0x2f6f73, 0.07, 0.24, -0.7, 0.9, 0, 16, 0.05);
  S.add(p, 1.4, wz + 0.32);
  // long table, chairs, reading lamps
  const tz = 0.3;
  p = new Part();
  table(p, { x: -0.35, z: tz, w: 3.4, d: 1.0 });
  for (const x of [-1.45, -0.35, 0.75]) chair(p, x, tz - 0.62, 0);
  for (const x of [-1.45, 0.75]) chair(p, x, tz + 0.58, PI);
  deskLamp(p, -1.45, 0.74, tz - 0.15, PI);
  deskLamp(p, 0.75, 0.74, tz - 0.15, PI, { i: 0.5 });
  openBook(p, -0.35, 0.74, tz - 0.2);
  openBook(p, 0.75, 0.74, tz + 0.2, 0.15, 0x2f4b3b);
  S.add(p);
  p = new Part();
  lounge(p, -1.95, -1.6, 0.7, { c: C.felt[3] });
  floorLamp(p, -2.5, -1.05);
  plant(p, -2.35, 2.65, { seed: 8 });
  S.add(p);
  S.fig({ pose: 'sit', seat: 0.45, skin: SK[2], hair: HR[0], hairStyle: 'short', top: 0x45556c, topStyle: 'sweater', bottom: 0x3a3a3c, shoes: 0x1c1c1c, prop: 'book', height: 1.75 }, -0.35, tz - 0.68, 0);
  S.fig({ pose: 'sit', seat: 0.45, skin: SK[5], hair: HR[3], hairStyle: 'bun', top: 0xe9e1d0, topStyle: 'dress', bottom: 0x8a6b72, shoes: 0x6b4a34, prop: 'book', height: 1.63 }, -2.0, -1.66, 0.7);
  S.fig({ pose: 'read', skin: SK[0], hair: HR[1], hairStyle: 'curly', top: 0x66784a, topStyle: 'coat', bottom: 0x2d3a52, shoes: 0x3a2a1f, prop: 'book', height: 1.8 }, 1.85, 1.05, PI / 2 - 0.5);
}

// ---------------------------------------------------------------- 4 verification commons
function verify(S) {
  shell(S, { floor: 'floor', rightHole: [-1.6, 0.4, 0.6, 2.8] });
  let p = new Part();
  cardWall(p, { w: 3.6, h: 1.5, y: 0.95, x: -0.85 });
  p.box('solid', C.paper, 0.5, 0.36, 0.006, -0.85, 1.5, 0.03);
  S.add(p, 0, BZ + 0.12);
  p = new Part();
  bookcase(p, { w: 1.6, h: 2.7, d: 0.4, rows: 6, seed: 41, items: 'boxes', c: C.ash });
  S.add(p, 1.83, BZ + 0.31);
  // verification bench
  const bz = -0.95;
  p = new Part();
  table(p, { x: -0.45, z: bz, w: 3.2, d: 0.9, h: 0.9, shelf: true });
  for (let i = 0; i < 6; i++) p.box('solid', C.paper, 0.21, 0.003, 0.297, -1.6 + i * 0.45, 0.9, bz + 0.05 + (i % 2) * 0.08, 0, [0, (i % 3) * 0.2 - 0.2, 0]);
  for (let i = 0; i < 4; i++) p.box('solid', 0xc4a67c, 0.36, 0.26, 0.3, -1.6 + i * 0.75, 0.25, bz, 0.01);
  deskLamp(p, -1.55, 0.9, bz - 0.3, 0);
  deskLamp(p, 0.4, 0.9, bz - 0.3, 0, { i: 0.5 });
  magnifier(p, -0.75, 0.9, bz - 0.2, 0);
  press(p, 0.85, 0.9, bz + 0.05, -0.4);
  p.box('solid', 0x24211e, 0.12, 0.015, 0.08, 0.5, 0.9, bz + 0.25);
  for (const x of [-1.1, 0.0]) stool(p, x, bz - 0.68);
  stool(p, -0.5, bz + 0.72);
  S.add(p);
  p = new Part();
  beam(p, -0.45, 2.96, BZ + 0.1, bz + 0.6);
  p.box('metal', C.steel, 1.8, 0.05, 0.09, -0.45, 2.0, bz);
  p.box('glow', 0xffffff, 1.74, 0.01, 0.06, -0.45, 1.995, bz);
  for (const sx of [-0.8, 0.8]) p.rod('metal', C.steel, [[-0.45 + sx, 2.05, bz], [-0.45, 2.96, bz]], 0.004, 4);
  p.lamp(-0.45, 1.9, bz, 0xffe2b8, 0.9);
  plant(p, -2.35, 2.6, { seed: 15, tree: true });
  S.add(p);
  S.fig({ pose: 'sit', seat: 0.65, skin: SK[4], hair: HR[0], hairStyle: 'bun', top: 0xe8dfcc, topStyle: 'shirt', bottom: 0x27344e, shoes: 0x1c1c1c, prop: 'book', height: 1.68 }, -1.1, bz - 0.7, 0);
  S.fig({ pose: 'stand', skin: SK[3], hair: HR[2], hairStyle: 'short', top: 0x36507f, topStyle: 'sweater', bottom: 0xcdb48c, shoes: 0x3a2a1f, prop: 'tablet', height: 1.8 }, 1.55, bz + 0.15, -PI / 2 + 0.2);
  S.fig({ pose: 'reach', skin: SK[1], hair: HR[1], hairStyle: 'long', top: 0xa4502f, topStyle: 'coat', bottom: 0x2b2b2d, shoes: 0x222222, height: 1.66 }, -1.85, BZ + 0.6, PI);
}

const ZONES = [well, provenance, dialogue, quiet, verify];

export function buildDiorama(zoneIndex, { tier } = {}) {
  const S = scene(tier);
  ZONES[Math.max(0, Math.min(4, zoneIndex))](S);
  const lamps = S.lamps.sort((a, b) => b.intensity - a.intensity).slice(0, 3);
  return {
    group: S.group,
    lamps,
    tick(t) {
      for (const f of S.figs) if (f.userData.tick) f.userData.tick(t);
      for (const a of S.anim) a(t);
    }
  };
}
