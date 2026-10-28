import { rng } from '../core/rng.js';
import { terrainHeight, riverZ, GARDEN_PATHS, PATHS, GATE, isFree } from './layout.js';
import { fieldAt } from './terrain.js';
import { hangingLantern, stoneLantern, lanternPost, goTable, bench, haystack, pottedPlant } from '../props/props.js';

// Everything that makes the rest of the academy and valley feel inhabited:
// lanterns at gates and along roads, benches, Go players in the osmanthus
// pavilion, visitors on the zigzag bridge, farmers in the fields, haystacks,
// and people walking the axis, the corridors, the garden paths and the road.

export function furnish({ B, kit, crowd, tier, anchors }) {
  const rand = rng(777);
  const T = terrainHeight;
  const low = tier.name === 'low';

  // ---- gate: red lanterns front and back, people on the plaza
  for (const sz of [1, -1]) for (const sx of [-1, 1]) hangingLantern(kit, B, sx * 2.6, 3.65, GATE.z + sz * 3.35, 'red', 4.55);
  crowd.place('stand', -3.2, 0, GATE.z + 8.2, 2.6, null);
  crowd.place('stand', -2.5, 0, GATE.z + 8.9, -2.9, null);
  crowd.place('stand', 5.4, 0, GATE.z + 10.5, 0.4, null);
  crowd.place('stand', 4.8, 0, GATE.z + 6.4, -0.9, null, null, 0.66);

  // ---- front court: benches beneath the ginkgos
  for (const sx of [-1, 1]) {
    bench(B, sx * 8.6, 0, 37.6, 0, 2.6, 0x5e3e2a);
    crowd.place('sit', sx * 8.6 - 0.6, 0, 37.65, Math.PI, null);
    if (sx > 0) crowd.place('sitRead', sx * 8.6 + 0.6, 0, 37.65, Math.PI, null);
  }
  crowd.place('stand', -4.6, 0, 29.6, 0.6, null);
  crowd.place('stand', -3.9, 0, 30.2, -2.4, null);

  // ---- corridors: a few people resting on the benches
  for (const [x, z, ry] of [
    [-15.75, -6.2, Math.PI / 2],
    [-15.75, 9.4, Math.PI / 2],
    [15.75, -12.6, -Math.PI / 2],
    [15.75, 3.4, -Math.PI / 2]
  ])
    crowd.place(rand() < 0.5 ? 'sitRead' : 'sit', x, 0.24, z, ry, null);

  // ---- pond garden: stone lanterns at the shore, visitors on the bridge and in the pavilion
  for (const [x, z] of [
    [-24.5, 13.8],
    [-52.4, 13.6],
    [-26.4, 38.4],
    [-44.2, 30.6]
  ])
    stoneLantern(kit, B, x, T(x, z), z, 0.9);
  crowd.place('stand', -31.2, -0.17, 23.4, 0.3, 0xe8e2d4);
  crowd.place('stand', -31.9, -0.17, 23.1, 1.1, 0x6a3a3e);
  crowd.place('stand', -38.4, -0.17, 24.9, 2.8, null, null, 0.66);
  const RP = anchors.rockPavilion;
  crowd.place('sit', RP.x + 0.9, RP.y + 0.4, RP.z + 1.2, -2.6, null);
  crowd.place('sit', RP.x - 1.1, RP.y + 0.4, RP.z + 0.8, 2.3, 0x3d4a5c);

  // ---- SE garden: Go in the osmanthus pavilion, watchers, a stone bench
  const O = anchors.osmanthus;
  goTable(B, O.x, O.floor, O.z, rand);
  const gp = [
    [O.x + 0.85, O.z + 0.85],
    [O.x - 0.85, O.z - 0.85]
  ];
  gp.forEach(([x, z], i) => crowd.place('sit', x, O.floor - 0.03, z, Math.atan2(O.x - x, O.z - z), i ? 0x3d4a5c : 0xb9a27a));
  crowd.place('stand', O.x + 1.6, O.floor, O.z - 0.9, -1.2, null);
  crowd.place('stand', O.x - 1.4, O.floor, O.z + 1.6, 2.4, 0x7a9a8a);
  goTable(B, 42.5, 0, 36.5, rand);
  crowd.place('sit', 43.35, 0, 37.35, Math.atan2(-0.85, -0.85), null);
  crowd.place('sit', 41.65, 0, 35.65, Math.atan2(0.85, 0.85), null);
  pottedPlant(B, O.x + 3.6, 0, O.z - 3.6, rand);
  pottedPlant(B, O.x - 3.6, 0, O.z - 3.6, rand);

  // ---- back garden: someone sweeping leaves, a reader under the pine
  crowd.place('stand', 3.8, 0, -47.6, 0.7, 0x6e5440);
  crowd.place('sitRead', -9.6, 0, -47.2, 0.4, null);
  bench(B, -9.6, 0, -47.6, 0, 1.8, 0x5e3e2a);

  // ---- road to the bridge: lantern posts, travellers
  for (const z of [50.5, 56, 62, 67.5]) for (const sx of [-1, 1]) lanternPost(kit, B, sx * 4.4, T(sx * 4.4, z), z);

  // ---- fields and village: haystacks, farmers in straw hats
  const nh = low ? 10 : 22;
  for (let k = 0, t = 0; k < nh && t < 600; t++) {
    const x = -60 + rand() * 180;
    const z = 100 + rand() * 90;
    if (fieldAt(x, z) !== 1) continue;
    haystack(B, x, T(x, z), z, 0.8 + rand() * 0.5);
    k++;
  }
  for (let k = 0, t = 0; k < (low ? 6 : 12) && t < 600; t++) {
    const x = -50 + rand() * 160;
    const z = 100 + rand() * 80;
    if (fieldAt(x, z) <= 0) continue;
    crowd.place('stand', x, T(x, z), z, rand() * 6.28, rand() < 0.5 ? 0x5a6a7a : 0x8a8680);
    k++;
  }
  for (const h of (anchors.village || []).slice(0, low ? 5 : 10)) {
    const x = h.x + (rand() - 0.5) * 6;
    const z = h.z + h.d / 2 + 1.5 + rand() * 2;
    if (!isFree(x, z, { pathPad: 0 })) continue;
    crowd.place('stand', x, T(x, z), z, rand() * 6.28, null, null, rand() < 0.25 ? 0.66 : 1);
  }
  // a fisherman on the bank
  const fx = -24;
  crowd.place('sit', fx, T(fx, riverZ(fx) - 11), riverZ(fx) - 11, Math.PI, 0x5a6a7a);

  // ---- walkers
  const W = (pts, o) => crowd.walker(pts, o);
  W([[0, 0.14, 21], [0.3, 0.14, 10], [3.2, 0.14, 6.5], [3.4, 0.14, -4], [0.4, 0.14, -8], [0, 0.14, -18.5]], { speed: 0.8 });
  W([[0, 0.14, 21], [-0.4, 0.14, 12], [-3.6, 0.14, 7], [-3.4, 0.14, -5], [0, 0.14, -17]], { speed: 0.7 });
  W([[0, 0, 43], [0.5, 0, 33], [0.2, 0, 24.5]], { speed: 0.9 });
  W([[-16.75, 0.24, -19], [-16.75, 0.24, 20]], { speed: 0.75 });
  W([[16.75, 0.24, 19.5], [16.75, 0.24, -19]], { speed: 0.8 });
  W([[16.75, 0.24, -5], [16.75, 0.24, 15]], { speed: 0.6, child: true });
  for (const i of [0, 2, 4, 5, 7]) W(GARDEN_PATHS[i].pts, { speed: 0.7 });
  W([[5, 0, 56], [1, 0, 62], [0.5, 0, 70]], { speed: 0.85 });
  W(PATHS[3].pts.slice(0, 30), { speed: 0.9 });
  W(PATHS[4].pts.slice(0, 26), { speed: 0.85 });
  W(PATHS[2].pts.slice(4, 40), { speed: 0.8 });
  W(PATHS[1].pts.slice(4, 36), { speed: 0.9 });
  if (!low) {
    W(PATHS[2].pts.slice(10, 48), { speed: 0.7, child: true });
    W([[25, 0, -2], [30, 0, -12], [40, 0, -14], [48, 0, -6]], { speed: 0.6 });
    W([[-34, 0, -3.5], [-28, 0, -6], [-22, 0, -9], [-18.6, 0, -9]], { speed: 0.7 });
    W(PATHS[5].pts.slice(0, 30), { speed: 0.7 });
  }
  // over the arched bridge (deck heights follow the hump)
  const bz = riverZ(0.5);
  const L = 13 / 2 + 3.5;
  const deck = (t) => {
    const u = Math.abs(t);
    const hump = u < 0.78 ? Math.pow(Math.cos(((u / 0.78) * Math.PI) / 2), 1.25) : 0;
    return 0.3 + (3.1 + 0.25) * hump;
  };
  const bridgePts = [];
  for (let i = 0; i <= 12; i++) {
    const t = (i / 12) * 2 - 1;
    bridgePts.push([0.5 + (i % 2 ? 0.3 : -0.3) * 0, deck(t) + 0.02, bz + t * L * 0.98]);
  }
  W([[0.5, T(0.5, bz - L - 6), bz - L - 6], ...bridgePts, [0.6, T(0.6, bz + L + 6), bz + L + 6]], { speed: 0.75 });
  W([[0.9, T(0.9, bz - L - 9), bz - L - 9], ...bridgePts.map(([x, y, z]) => [x + 0.8, y, z]), [1.3, T(1.3, bz + L + 9), bz + L + 9]], { speed: 0.65, u: 0.3 });
  // two people pausing at the top of the bridge
  crowd.place('stand', -0.6, deck(0) + 0.02, bz + 0.4, Math.PI / 2, 0x3d4a5c);
  crowd.place('stand', -0.5, deck(0) + 0.02, bz - 0.5, Math.PI / 2 + 0.3, 0xd8ccb0);
}
