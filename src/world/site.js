import * as THREE from 'three';
import { Builder, MAT, mat4 } from '../core/builder.js';
import { PAL } from '../core/config.js';
import { rng } from '../core/rng.js';
import { hall } from '../arch/hall.js';
import { wall, screenWall } from '../arch/walls.js';
import { corridor, paifang, pavilion, archBridge, zigzagBridge, pagoda, house } from '../arch/structures.js';
import { stairs, stoneRail, platform } from '../arch/parts.js';
import { plaque } from '../arch/signs.js';
import {
  COMPOUND,
  GATE,
  PAIFANG,
  LIBRARY,
  QUIET,
  DIALOGUE,
  VERIFY,
  OSMANTHUS,
  riverZ,
  terrainHeight,
  addFootprint,
  WATER_LEVEL
} from './layout.js';

// Assembles the academy and its valley from the site plan. Each region is
// merged into its own set of meshes (a handful of draw calls per region) so
// frustum culling still helps when the camera is close.

export function buildSite(kit, tier, onProgress = () => {}) {
  const groups = [];
  const plaques = new THREE.Group();
  plaques.name = 'plaques';
  const anchors = {};
  const rand = rng(2024);
  const B = new Builder(11);
  B.instancer = kit.instancer;
  const low = tier.name === 'low';
  const flush = (name) => groups.push(B.build(kit.buckets, name));

  const pave = (x0, z0, x1, z1, color = 0xd6cfc2, y = 0, kind = 'paving') => {
    addFootprint(x0, z0, x1, z1, 0.2);
    B.box(kind, color, x1 - x0, 0.06 + y, z1 - z0, (x0 + x1) / 2, -0.04, (z0 + z1) / 2, {
      kind: MAT.stone,
      uv: (p) => [p.x / 7, p.z / 7]
    });
  };
  const sign = (text, x, y, z, ry = 0, w = 2.4, h = 0.8, vertical = false) => {
    const p = plaque(text, { w, h, vertical });
    p.position.set(x, y, z);
    p.rotation.y = ry;
    p.updateMatrixWorld(true);
    plaques.add(p);
    return p;
  };

  // ======================================================== outer walls
  const C = COMPOUND;
  wall(
    B,
    [
      [-6.7, C.z1],
      [C.x0, C.z1],
      [C.x0, C.z0],
      [C.x1, C.z0],
      [C.x1, C.z1],
      [6.7, C.z1]
    ],
    {
      H: 4.1,
      T: 0.6,
      openings: [
        [0, { at: -6.7 - -38 + 0, type: 'door', w: 3.0, h: 1.25 }],
        [0, { at: 18, type: 'window', w: 1.2, h: 0.9, y: 1.8, pattern: 2 }],
        [1, { at: 14, type: 'octagon', r: 0.6, y: 2.2 }],
        [1, { at: 30, type: 'window', w: 1.3, h: 0.9, y: 1.9 }],
        [1, { at: 70, type: 'window', w: 1.3, h: 0.9, y: 1.9, pattern: 2 }],
        [1, { at: 86, type: 'octagon', r: 0.6, y: 2.2 }],
        [2, { at: 10.5, type: 'door', w: 3.0, h: 1.2 }],
        [2, { at: 22, type: 'door', w: 1.7, h: 2.5 }],
        [2, { at: 60, type: 'window', w: 1.2, h: 0.9, y: 1.9 }],
        [3, { at: 20, type: 'octagon', r: 0.6, y: 2.2 }],
        [3, { at: 72, type: 'window', w: 1.3, h: 0.9, y: 1.9, pattern: 2 }],
        [4, { at: 14, type: 'window', w: 1.2, h: 0.9, y: 1.8, pattern: 2 }]
      ]
    },
    tier
  );
  flush('walls');
  onProgress(0.05);

  // ======================================================== gatehouse (大门)
  B.pushT(GATE.x, 0, GATE.z, 0);
  const gate = hall(
    B,
    {
      bays: [3.3, 4.2, 3.3],
      deep: [2.6, 2.6],
      base: 0.75,
      margin: 1.0,
      colH: 3.9,
      colR: 0.22,
      frontBays: ['wall', 'open', 'wall'],
      backBays: ['wall', 'open', 'wall'],
      sides: 'wall',
      interiorCols: true,
      skipCol: (i, j) => i === 1 || i === 2,
      stairs: [{ side: 'front', w: 4 }, { side: 'back', w: 4 }],
      roof: { type: 'xieshan', rise: 3.1, over: 1.55, lift: 0.6, flare: 0.4, ridgeEnd: 'curl' },
      lamps: [[0, 2.6, 0, 5, 0.8]]
    },
    tier
  );
  // big red doors swung open in the central bay, with brass studs
  for (const sx of [-1, 1]) {
    B.box('solid', 0x8c2c1c, 0.12, 3.0, 1.85, sx * 1.9, 0.82, -0.95, { kind: MAT.lacquer, ry: sx * 0.15 });
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 4; c++) B.sphere('solid', 0xc9a24c, 0.035, sx * 1.83, 1.2 + r * 0.5, -1.6 + c * 0.42, { seg: 5, kind: MAT.gold });
  }
  B.box('solid', PAL.stone, 4.0, 0.25, 0.6, 0, 0.75, 0, { kind: MAT.stone }); // threshold
  // stone lions on plinths
  for (const sx of [-1, 1]) {
    B.box('solid', PAL.stone, 1.0, 0.9, 1.5, sx * 3.7, 0, 4.8, { kind: MAT.stone, chamfer: 0.04 });
    B.box('solid', PAL.stoneDark, 1.1, 0.12, 1.6, sx * 3.7, 0.9, 4.8, { kind: MAT.stone });
    B.sphere('solid', 0xb3a994, 0.42, sx * 3.7, 1.55, 4.65, { sx: 0.8, sy: 1.1, kind: MAT.stone });
    B.sphere('solid', 0xb3a994, 0.34, sx * 3.7, 2.2, 4.95, { seg: 10, kind: MAT.stone });
    B.box('solid', 0xb3a994, 0.7, 0.55, 0.9, sx * 3.7, 1.0, 4.85, { kind: MAT.stone });
  }
  B.pop();
  addFootprint(-6.5, GATE.z - 3.6, 6.5, GATE.z + 3.6, 0.5);
  sign('开放问题图书馆', 0, 0.75 + 3.9 - 0.15, GATE.z + 2.75, 0, 3.3, 0.62);
  anchors.gate = { x: 0, z: GATE.z, y: 0.75 };

  // plaza outside the gate + road
  pave(-9, C.z1 + 0.3, 9, C.z1 + 11);
  // two flagpole stones
  for (const sx of [-1, 1]) {
    B.box('solid', PAL.stone, 0.7, 0.5, 0.7, sx * 7.6, 0, C.z1 + 7, { kind: MAT.stone, chamfer: 0.03 });
    B.cyl('solid', 0x5a3a26, 0.09, 9, sx * 7.6, 0.5, C.z1 + 7, { rTop: 0.06, seg: 6, kind: MAT.wood });
  }
  flush('gate');
  onProgress(0.1);

  // ======================================================== front court, paifang, central court
  pave(-18, 22.3, 18, C.z1 - 2.6);
  pave(-15.6, -20, 15.6, 22.3);
  // raised axis walk (甬道) from paifang to the library stair
  B.box('paving', 0xe2dbcf, 3.4, 0.14, 40, 0, 0, 2, { kind: MAT.stone, uv: (p) => [p.x / 2.2, p.z / 2.2] });
  B.box('solid', PAL.stoneGrey, 3.6, 0.1, 40, 0, 0, 2, { kind: MAT.stone });
  const pf = paifang(B, PAIFANG.x, PAIFANG.z, 0, tier);
  sign('问津', 0, pf.plaqueY + 0.15, PAIFANG.z + 0.2, 0, 1.6, 0.56);
  sign('问津', 0, pf.plaqueY + 0.15, PAIFANG.z - 0.2, Math.PI, 1.6, 0.56);
  // walls either side of the paifang
  wall(B, [[-18, 22], [-6.3, 22]], { H: 3.3, T: 0.45, openings: [[0, { at: 5.8, type: 'window', w: 1.4, h: 0.9, y: 1.4, pattern: 1 }]] }, tier);
  wall(B, [[6.3, 22], [18, 22]], { H: 3.3, T: 0.45, openings: [[0, { at: 5.8, type: 'window', w: 1.4, h: 0.9, y: 1.4, pattern: 1 }]] }, tier);
  // front court side walls with gates to the gardens
  wall(B, [[-18, C.z1 - 2.6], [-18, 22]], { H: 3.6, T: 0.5, openings: [[0, { at: 10, type: 'vase', w: 1.1 }]] }, tier);
  wall(B, [[18, 22], [18, C.z1 - 2.6]], { H: 3.6, T: 0.5, openings: [[0, { at: 11, type: 'door', w: 1.5, h: 2.5 }]] }, tier);
  // corridor walls along the central court
  wall(B, [[-18, 22], [-18, -20.5]], { H: 3.9, T: 0.5, openings: [[0, { at: 10, type: 'vase', w: 1.1 }], [0, { at: 31, type: 'moon', r: 1.3 }], [0, { at: 20.5, type: 'window', w: 1.2, h: 0.9, y: 1.5 }], [0, { at: 38, type: 'octagon', r: 0.5, y: 1.8 }]] }, tier);
  wall(B, [[18, -20.5], [18, 22]], { H: 3.9, T: 0.5, openings: [[0, { at: 11.5, type: 'moon', r: 1.3 }], [0, { at: 32.5, type: 'door', w: 1.5, h: 2.5 }], [0, { at: 22, type: 'window', w: 1.2, h: 0.9, y: 1.5, pattern: 2 }], [0, { at: 4, type: 'octagon', r: 0.5, y: 1.8 }]] }, tier);
  corridor(B, [[-16.75, -20.2], [-16.75, 21.6]], { w: 2.3, h: 2.85, wall: -1, step: 3.2, gaps: ['0:3', '0:9'] }, tier);
  corridor(B, [[16.75, -20.2], [16.75, 21.6]], { w: 2.3, h: 2.85, wall: 1, step: 3.2, gaps: ['0:5', '0:9'] }, tier);
  addFootprint(-18.2, -20.5, -15.5, 22, 0.2);
  addFootprint(15.5, -20.5, 18.2, 22, 0.2);
  flush('central');
  onProgress(0.2);

  // ======================================================== library terrace + Provenance Stacks (藏书楼)
  const TER = { x0: -14.5, x1: 14.5, z0: -43, z1: -20.5 };
  const th = LIBRARY.terraceH;
  B.box('solid', 0xa59d8d, TER.x1 - TER.x0, th - 0.12, TER.z1 - TER.z0, 0, 0, (TER.z0 + TER.z1) / 2, { kind: 10 });
  B.box('solid', PAL.stone, TER.x1 - TER.x0 + 0.14, 0.12, TER.z1 - TER.z0 + 0.14, 0, th - 0.12, (TER.z0 + TER.z1) / 2, { kind: MAT.stone, chamfer: 0.03 });
  pave(TER.x0 + 0.2, TER.z0 + 0.2, TER.x1 - 0.2, TER.z1 - 0.2, 0xe8e0d0, th);
  stairs(B, 0, 0, TER.z1, 6.5, th, 2.4, 1);
  for (const sx of [-1, 1]) stairs(B, sx * 11.8, 0, TER.z1, 2.2, th, 2.0, 1, PAL.stone, { sides: true });
  // front balustrade with gaps for the stairs
  stoneRail(B, [[TER.x0 + 0.1, th, TER.z1 - 0.1], [-12.9, th, TER.z1 - 0.1]], 0.78);
  stoneRail(B, [[-10.7, th, TER.z1 - 0.1], [-3.4, th, TER.z1 - 0.1]], 0.78);
  stoneRail(B, [[3.4, th, TER.z1 - 0.1], [10.7, th, TER.z1 - 0.1]], 0.78);
  stoneRail(B, [[12.9, th, TER.z1 - 0.1], [TER.x1 - 0.1, th, TER.z1 - 0.1]], 0.78);
  stoneRail(B, [[TER.x0 + 0.1, th, TER.z1 - 0.1], [TER.x0 + 0.1, th, TER.z0 + 0.1]], 0.78);
  stoneRail(B, [[TER.x1 - 0.1, th, TER.z1 - 0.1], [TER.x1 - 0.1, th, TER.z0 + 0.1]], 0.78);
  B.pushT(LIBRARY.x, th, LIBRARY.z, 0);
  B.latticeKey = 'latticeLib';
  const lib = hall(
    B,
    {
      bays: [3.2, 3.8, 4.4, 3.8, 3.2],
      deep: [2.6, 5.0, 2.6],
      base: 0.45,
      margin: 0.9,
      colH: 4.3,
      colR: 0.24,
      front: 'doorsOpen',
      back: 'windows',
      sides: 'windows',
      pattern: 1,
      interiorCols: true,
      upper: { colH: 3.3, balcony: 0.9, skirt: { over: 1.55, rise: 1.25 } },
      roof: { type: 'xieshan', rise: 3.9, over: 1.8, lift: 0.7, flare: 0.45, ridgeEnd: 'curl', ornament: 1.15 },
      stairs: [{ side: 'front', w: 4.2 }],
      lamps: [
        [-5, 3.2, -1, 6.5, 1.1],
        [5, 3.2, -1, 6.5, 1.1],
        [0, 3.3, 1.5, 6, 1.0],
        [0, 8.6, 0, 7, 0.9]
      ]
    },
    tier
  );
  B.pop();
  B.latticeKey = null;
  addFootprint(TER.x0, TER.z0, TER.x1, TER.z1, 0.3);
  anchors.library = { x: LIBRARY.x, z: LIBRARY.z, floor: th + 0.45, W: lib.W, D: lib.D, eaveY: th + lib.eaveY, ridgeY: th + lib.ridgeY, xs: lib.xs, zs: lib.zs };
  sign('溯源书库', 0, th + 0.45 + 4.3 - 0.12, LIBRARY.z + lib.D / 2 + 0.32, 0, 2.6, 0.72);
  // couplets on the central columns
  sign('一书一线皆有来处', -2.2, th + 0.45 + 2.2, LIBRARY.z + lib.D / 2 + 0.27, 0, 0.36, 2.6, true);
  sign('千问千答各溯其源', 2.2, th + 0.45 + 2.2, LIBRARY.z + lib.D / 2 + 0.27, 0, 0.36, 2.6, true);
  flush('library');
  onProgress(0.3);

  // ======================================================== Quiet court + Unassisted Room (无辅助阅览室)
  wall(B, [[C.x0, -2], [-18, -2]], { H: 3.5, T: 0.45, openings: [[0, { at: 5, type: 'door', w: 2.6, h: 1.2 }], [0, { at: 26, type: 'moon', r: 1.25 }], [0, { at: 13, type: 'octagon', r: 0.5, y: 1.7 }], [0, { at: 34, type: 'window', w: 1.2, h: 0.85, y: 1.6, pattern: 1 }]] }, tier);
  B.pushT(QUIET.x, 0, QUIET.z, 0);
  B.latticeKey = 'latticeQuiet';
  const qh = hall(
    B,
    {
      bays: [3.8, 4.4, 3.8],
      deep: [2.4, 5.0, 2.4],
      base: 0.6,
      margin: 1.0,
      colH: 3.9,
      colR: 0.21,
      porch: true,
      front: 'doorsOpen',
      back: 'wall',
      sides: 'windows',
      pattern: 0,
      colors: { col: 0x5e3322, beam: 0x3d5a4e, beam2: 0x4d6650 },
      roof: { type: 'xieshan', rise: 3.2, over: 1.6, lift: 0.6, flare: 0.4, ridgeEnd: 'swallow' },
      lamps: [
        [-3, 2.5, -1.2, 5.5, 1.1],
        [3, 2.5, -1.2, 5.5, 1.1],
        [0, 2.5, 1.0, 5, 0.9]
      ]
    },
    tier
  );
  B.pop();
  B.latticeKey = null;
  addFootprint(QUIET.x - 8, QUIET.z - 6.5, QUIET.x + 8, QUIET.z + 7.5, 0.4);
  anchors.quiet = { x: QUIET.x, z: QUIET.z, floor: 0.6, W: qh.W, D: qh.D, eaveY: qh.eaveY };
  sign('无辅助阅览室', 0 + QUIET.x, 0.6 + 3.9 - 0.12, QUIET.z + qh.D / 2 - 2.4 + 0.3, 0, 2.6, 0.62);
  // a little stone terrace + basin in front
  pave(QUIET.x - 6, QUIET.z + 7.5, QUIET.x + 6, QUIET.z + 11, 0xd8d0c0);
  flush('quiet');
  onProgress(0.38);

  // ======================================================== pond garden: Dialogue Alcoves (对话龛) waterside hall
  B.pushT(DIALOGUE.x, 0, DIALOGUE.z, 0);
  B.latticeKey = 'latticeDlg';
  const dh = hall(
    B,
    {
      bays: [4.2, 4.6, 4.2],
      deep: [2.6, 3.4],
      base: 0.55,
      margin: 1.0,
      colH: 3.5,
      colR: 0.19,
      front: 'rail',
      back: 'windows',
      sides: 'open',
      pattern: 2,
      interiorCols: false,
      colors: { col: 0x6a2e1e, beam: 0x3a5f60, beam2: 0x52714f },
      roof: { type: 'xieshan', rise: 2.7, over: 1.5, lift: 0.75, flare: 0.5, ridgeEnd: 'swallow' },
      stairs: [{ side: 'back', w: 2.4 }],
      lamps: [
        [-4.4, 2.2, 0, 4.5, 1.0],
        [0, 2.2, 0, 4.5, 1.0],
        [4.4, 2.2, 0, 4.5, 1.0]
      ]
    },
    tier
  );
  // stone piers under the front edge that stands in the water
  for (let k = -3; k <= 3; k++) B.box('solid', 0x8f887a, 0.7, 1.4, 0.7, k * 2.1, -1.3, dh.D / 2 + 0.7, { kind: MAT.stone });
  B.pop();
  B.latticeKey = null;
  addFootprint(DIALOGUE.x - 8, DIALOGUE.z - 4.5, DIALOGUE.x + 8, DIALOGUE.z + 4.5, 0.3);
  anchors.dialogue = { x: DIALOGUE.x, z: DIALOGUE.z, floor: 0.55, W: dh.W, D: dh.D, xs: dh.xs };
  sign('对话龛', DIALOGUE.x, 0.55 + 3.5 - 0.1, DIALOGUE.z + dh.D / 2 + 0.3, 0, 1.7, 0.56);
  // zigzag bridge to the islet
  zigzagBridge(B, [[-23.2, 23.5], [-27.5, 25.5], [-31, 23.2], [-35, 26.2], [-38.6, 24.6], [-41.2, 27]], WATER_LEVEL + 0.25, 1.6, tier);
  // waterside corridor (east bank)
  corridor(B, [[-20.4, 14.8], [-21.6, 21], [-20.6, 28.4], [-22.3, 35.6], [-21.2, 42.2]], { w: 2.0, h: 2.7, step: 2.8, meirenkao: true, ridgeEnd: 'swallow' }, tier);
  // hexagonal pavilion on the rockery (south-west corner)
  pavilion(B, -50.5, 39.5, 0.2, tier, { n: 6, R: 2.0, base: 0.4, colH: 2.7, y: 2.2, entry: 2, rise: 2.3 });
  anchors.rockPavilion = { x: -50.5, z: 39.5, y: 2.2 };
  // a small square pavilion with a stele by the bamboo court gate
  flush('garden');
  onProgress(0.48);

  // ======================================================== Verification Commons (公共核验台)
  wall(B, [[18, 4], [C.x1, 4]], { H: 3.5, T: 0.45, openings: [[0, { at: 18, type: 'moon', r: 1.3 }], [0, { at: 8, type: 'octagon', r: 0.5, y: 1.7 }], [0, { at: 28, type: 'window', w: 1.2, h: 0.85, y: 1.6, pattern: 2 }]] }, tier);
  B.pushT(VERIFY.x, 0, VERIFY.z, 0);
  const vh = hall(
    B,
    {
      bays: [4.0, 5.2, 4.0],
      deep: [2.8, 4.4],
      base: 0.85,
      margin: 1.2,
      colH: 4.1,
      colR: 0.22,
      front: 'open',
      back: 'wall',
      sides: 'rail',
      interiorCols: false,
      fretwork: true,
      colors: { col: 0x7a2c1c },
      roof: { type: 'xieshan', rise: 3.1, over: 1.7, lift: 0.65, flare: 0.42, ridgeEnd: 'curl' },
      stairs: [{ side: 'front', w: 5.2 }, { side: 'front', w: 2.6, x: -5.6 }, { side: 'front', w: 2.6, x: 5.6 }],
      lamps: [
        [0, 2.8, 0, 6, 1.1],
        [-4.5, 2.6, 0, 4.5, 0.8],
        [4.5, 2.6, 0, 4.5, 0.8]
      ]
    },
    tier
  );
  B.pop();
  addFootprint(VERIFY.x - 8.6, VERIFY.z - 5, VERIFY.x + 8.6, VERIFY.z + 6, 0.3);
  anchors.verify = { x: VERIFY.x, z: VERIFY.z, floor: 0.85, W: vh.W, D: vh.D };
  sign('公共核验台', VERIFY.x, 0.85 + 4.1 - 0.12, VERIFY.z + vh.D / 2 + 0.32, 0, 2.5, 0.6);
  pave(22, -19.5, 50, 2.5, 0xe0d8c8);
  // stele pavilion (碑亭) in the north-west corner of the court
  pavilion(B, 24.5, -44, 0, tier, { n: 4, R: 2.4, base: 0.6, colH: 3.0, double: true, benches: false });
  B.box('solid', 0x8a8478, 1.1, 0.5, 0.6, 24.5, 0.6, -44, { kind: MAT.stone });
  B.box('solid', 0x6f6a62, 0.9, 2.2, 0.28, 24.5, 1.1, -44, { kind: MAT.stone, chamfer: 0.03 });
  addFootprint(21, -47.5, 28, -40.5, 0.3);
  flush('verify');
  onProgress(0.56);

  // ======================================================== south-east garden
  pavilion(B, OSMANTHUS.x, OSMANTHUS.z, 0, tier, { n: 4, R: 2.7, base: 0.55, colH: 3.1, double: true, entry: 2 });
  anchors.osmanthus = { x: OSMANTHUS.x, z: OSMANTHUS.z, floor: 0.55 };
  B.pushT(47.5, 0, 25, -Math.PI / 2);
  hall(
    B,
    {
      bays: [3.4, 3.6, 3.4],
      deep: [2.0, 3.8],
      base: 0.45,
      margin: 0.8,
      colH: 3.4,
      colR: 0.18,
      porch: true,
      front: 'doors',
      back: 'wall',
      sides: 'wall',
      brackets: false,
      colors: { col: 0x5a2e20 },
      roof: { type: 'gable', rise: 2.3, over: 1.1 },
      lamps: [[0, 2.2, 0, 4, 0.6]]
    },
    tier
  );
  B.pop();
  addFootprint(42.5, 18, 52.5, 32, 0.3);
  B.pushT(-38, 0, -46.5, 0);
  hall(B, { bays: [3.2, 3.4, 3.2], deep: [2.0, 3.6], base: 0.4, colH: 3.2, porch: true, front: 'doors', back: 'wall', sides: 'wall', brackets: false, roof: { type: 'gable', rise: 2.2, over: 1.0 } }, tier);
  B.pop();
  addFootprint(-44, -50.5, -32, -42.5, 0.3);
  flush('southeast');
  onProgress(0.62);

  // ======================================================== outside the walls
  // arched bridge over the river on the axis
  const bz = riverZ(0.5);
  archBridge(B, 0.5, bz, 0, 13, 4.2, 3.1, -1.15, tier);
  addFootprint(-2.6, bz - 11, 3.6, bz + 11, 0.2);
  // slab bridge over the outflow stream
  B.box('solid', PAL.stone, 1.8, 0.25, 4.2, -32.2, 0.05, 66.2, { kind: MAT.stone, chamfer: 0.03, ry: 0.5 });
  // small water gate arch where the stream leaves the compound
  flush('river');
  onProgress(0.68);

  // pagoda on the north-west hill, pavilion on the east hill
  const pgx = -96;
  const pgz = -176;
  const pgy = terrainHeight(pgx, pgz);
  const pg = pagoda(B, pgx, pgy - 0.5, pgz, 7, tier);
  anchors.pagoda = { x: pgx, z: pgz, y: pgy, h: pg.height };
  const ehx = 124;
  const ehz = -46;
  pavilion(B, ehx, ehz, 0.3, tier, { n: 8, R: 2.6, base: 0.6, colH: 3.0, y: terrainHeight(ehx, ehz) - 0.2 });
  flush('landmarks');
  onProgress(0.74);

  // village across the river (Huizhou houses with horse-head walls)
  const houses = [];
  const vr = rng(88);
  const nHouses = low ? 12 : 22;
  let tries = 0;
  while (houses.length < nHouses && tries++ < 400) {
    const x = -160 + vr() * 92;
    const z = 102 + vr() * 76;
    if (z < riverZ(x) + 16) continue;
    const w = 7 + vr() * 5;
    const d = 6 + vr() * 3;
    if (houses.some((h) => Math.abs(h.x - x) < (h.w + w) / 2 + 2.5 && Math.abs(h.z - z) < (h.d + d) / 2 + 2.5)) continue;
    houses.push({ x, z, w, d });
  }
  for (const h of houses) {
    const y = terrainHeight(h.x, h.z);
    const ry = (vr() < 0.5 ? 0 : Math.PI) + (vr() - 0.5) * 0.15;
    house(B, h.x, y, h.z, ry, h.w, h.d, 4.2 + vr() * 1.6, vr, tier, { steps: vr() < 0.5 ? 2 : 3 });
    addFootprint(h.x - h.w / 2 - 1, h.z - h.d / 2 - 1, h.x + h.w / 2 + 1, h.z + h.d / 2 + 1);
  }
  anchors.village = houses;
  flush('village');
  onProgress(0.8);

  return { groups, plaques, anchors };
}
