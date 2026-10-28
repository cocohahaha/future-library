import * as THREE from 'three';
import { createZoneBase, view } from './common.js';
import { rng } from '../core/rng.js';
import { patch } from '../core/materials.js';
import { PAL } from '../core/config.js';
import { bookcase, table, bench, ladder, openBook, bookPile, hangingLantern } from '../props/props.js';

// Provenance Stacks (溯源书库): the two-storey library hall. Inside, cedar
// bookcases line the walls and stand in aisles, full of cloth-bound books,
// thread-bound volumes in indigo wrappers and scrolls. Red silk threads
// (红线) drape from book to book across the aisles: every text tied to its
// sources. Activation warms the threads and sends paper tags racing along them.

export function createProvenance(def, ctx) {
  const A = ctx.anchors.library;
  const zone = createZoneBase(def, { hit: [A.W + 2, 15, A.D + 2], hitOffset: [0, 0, 0] });
  const g = zone.group;
  const { B, crowd, kit } = ctx;
  const rand = rng(12);
  const X = A.x;
  const Z = A.z;
  const Y = A.floor;
  const W = A.W;
  const D = A.D;
  const dens = ctx.tier.books;
  zone.lamp = { x: X, y: Y + 3, z: Z + 1, intensity: 9, distance: 14 };

  const bookPos = []; // world positions of spines that threads can tie to
  const shelf = (x, z, ry, w, h, opts = {}) => {
    const before = kit.instancer.count('book');
    bookcase(B, x, Y, z, ry, w, h, 0.42, opts.shelves || 6, rand, { density: dens * (opts.density || 1), scrolls: opts.scrolls, open: opts.open });
    // remember a few spine positions on this case for threads
    for (let k = 0; k < 6; k++) {
      const lx = (rand() - 0.5) * (w - 0.4);
      const ly = 0.5 + rand() * (h - 0.9);
      const c = Math.cos(ry);
      const s = Math.sin(ry);
      bookPos.push({ p: new THREE.Vector3(x + lx * c + 0.24 * s, Y + ly, z - lx * s + 0.24 * c), case: `${x.toFixed(1)}:${z.toFixed(1)}:${ry.toFixed(2)}` });
    }
    return kit.instancer.count('book') - before;
  };

  // back wall: two cases per bay (centre bay keeps a niche for a hanging scroll)
  const backZ = Z - D / 2 + 0.38;
  const xs = A.xs;
  for (let i = 0; i < xs.length - 1; i++) {
    const bw = xs[i + 1] - xs[i];
    const cx = X + (xs[i] + xs[i + 1]) / 2;
    if (i === 2) {
      shelf(cx - bw / 2 + 0.95, backZ, 0, 1.5, 3.3, { scrolls: true });
      shelf(cx + bw / 2 - 0.95, backZ, 0, 1.5, 3.3, { scrolls: true });
    } else {
      shelf(cx - bw / 4 + 0.05, backZ, 0, bw / 2 - 0.25, 3.3);
      shelf(cx + bw / 4 - 0.05, backZ, 0, bw / 2 - 0.25, 3.3);
    }
  }
  // side walls
  for (const sx of [-1, 1])
    for (let k = 0; k < 3; k++) shelf(X + sx * (W / 2 - 0.36), Z - 3.0 + k * 2.4, -sx * Math.PI / 2, 2.1, 3.3, { scrolls: k === 1 });
  // freestanding double-sided cases in the side bays (aisles run front-back)
  for (const bay of [0, 1, 3, 4]) {
    const cx = X + (xs[bay] + xs[bay + 1]) / 2;
    const bw = xs[bay + 1] - xs[bay];
    for (const zz of [Z - 2.4, Z + 0.4]) {
      shelf(cx, zz + 0.23, 0, bw - 0.9, 2.6, { shelves: 5, open: true });
      shelf(cx, zz - 0.23, Math.PI, bw - 0.9, 2.6, { shelves: 5, open: true });
    }
  }
  // centre bay: long reading table, benches, readers, ladders
  table(B, X, Y, Z + 0.2, Math.PI / 2, 4.6, 1.1, 0.78);
  for (const sx of [-1, 1]) bench(B, X + sx * 0.95, Y, Z + 0.2, Math.PI / 2, 4.4);
  for (let k = 0; k < 4; k++) {
    const z = Z - 1.6 + k * 1.2;
    openBook(B, X + (k % 2 ? 0.25 : -0.25), Y + 0.79, z, Math.PI / 2 + (k % 2 ? Math.PI : 0));
    if (k % 2) bookPile(B, X - 0.3, Y + 0.79, z + 0.4, 3 + Math.floor(rand() * 3), rand, Math.PI / 2);
  }
  crowd.place('sitRead', X - 0.95, Y, Z - 1.2, Math.PI / 2, 0x3d4a5c, 'libr1');
  crowd.place('sitRead', X + 0.95, Y, Z + 0.6, -Math.PI / 2, 0xa8844a, 'libr2');
  crowd.place('sit', X - 0.95, Y, Z + 1.5, Math.PI / 2, 0x7a9a8a, 'libr3');
  ladder(B, X - 1.4, Y, backZ + 0.75, 0, 3.0);
  ladder(B, X + 5.9, Y, backZ + 0.8, 0, 3.0);
  // stewards and browsers
  crowd.place('stand', X - 5.2, Y, Z + 2.6, Math.PI * 0.95, 0x6e5440, 'steward1');
  crowd.place('stand', X + 4.6, Y, Z + 2.2, -Math.PI * 0.9, 0x9a3a2c, 'steward2');
  crowd.place('stand', X + 7.6, Y, Z - 0.9, Math.PI, 0xd8ccb0);
  crowd.place('stand', X - 7.7, Y, Z - 0.9, Math.PI, 0x5a6a7a);
  crowd.place('stand', X + 5.9, Y + 1.1, backZ + 1.05, Math.PI, 0x4f5d4a); // on the ladder
  // a reader on the balcony upstairs
  crowd.place('stand', X - 3.5, A.eaveY + 1.55, Z + D / 2 + 0.55, 0.2, 0xe8e2d4);
  // paper lanterns over the reading table and aisles
  for (const [lx, lz] of [
    [0, -1.2],
    [0, 1.6],
    [-5.4, -1],
    [5.4, -1],
    [-5.4, 2.2],
    [5.4, 2.2]
  ])
    hangingLantern(kit, B, X + lx, Y + 3.0, Z + lz, 'paper', Y + 4.6);
  // lanterns at the front eaves
  for (const sx of [-1, 1]) hangingLantern(kit, B, X + sx * 4.2, Y + 3.5, Z + D / 2 + 0.9, 'red', Y + 4.5);

  // ---- red threads between books on different cases
  const threadMat = patch(
    new THREE.MeshStandardMaterial({ color: PAL.cinnabar, roughness: 0.55, emissive: PAL.cinnabar, emissiveIntensity: 0.25 }),
    'thread'
  );
  const curves = [];
  const nThreads = ctx.tier.name === 'low' ? 10 : 16;
  let guard = 0;
  while (curves.length < nThreads && guard++ < 400) {
    const a = bookPos[Math.floor(rand() * bookPos.length)];
    const b = bookPos[Math.floor(rand() * bookPos.length)];
    if (a.case === b.case) continue;
    const d = a.p.distanceTo(b.p);
    if (d < 2.2 || d > 7.5) continue;
    const mid = a.p.clone().lerp(b.p, 0.5);
    mid.y = Math.max(Y + 0.9, Math.min(a.p.y, b.p.y) - 0.4 - rand() * 0.5);
    const c = new THREE.CatmullRomCurve3([a.p, a.p.clone().lerp(mid, 0.5).add(new THREE.Vector3(0, -0.15, 0)), mid, b.p.clone().lerp(mid, 0.5).add(new THREE.Vector3(0, -0.15, 0)), b.p]);
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(c, 40, 0.013, 5, false), threadMat);
    g.add(mesh);
    curves.push(c);
  }
  // paper tags travelling along the threads
  const tagMat = patch(new THREE.MeshStandardMaterial({ color: PAL.paper, roughness: 0.9, side: THREE.DoubleSide }), 'tag');
  const tags = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.12, 0.18), tagMat, curves.length * 2);
  tags.frustumCulled = false;
  g.add(tags);
  const tagState = [];
  curves.forEach((c, i) => {
    for (let k = 0; k < 2; k++) tagState.push({ c, u: rand(), dir: (i + k) % 2 ? 1 : -1 });
  });
  const tmp = new THREE.Vector3();
  const pos = new THREE.Vector3();
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const one = new THREE.Vector3(1, 1, 1);

  zone.update = (t, dt) => {
    zone.baseUpdate(dt);
    const en = zone.energy;
    threadMat.emissiveIntensity = 0.25 + zone.focusMix * 0.3 + en * 2.2;
    tagState.forEach((s, i) => {
      s.u = (s.u + dt * ctx.world.speed * (0.025 + en * 0.32) * s.dir + 1) % 1;
      s.c.getPointAt(s.u, pos);
      s.c.getPointAt(Math.min(0.999, s.u + 0.01), tmp);
      pos.y -= 0.1;
      e.set(0, Math.atan2(tmp.x - pos.x, tmp.z - pos.z) + Math.PI / 2, Math.sin(t * 2 + s.u * 20) * 0.15);
      tags.setMatrixAt(i, m.compose(pos, q.setFromEuler(e), one));
    });
    tags.instanceMatrix.needsUpdate = true;
    if (kit.mats.latticeLib) kit.mats.latticeLib.userData.paperGlow.value = 0.35 + zone.focusMix * 0.25 + en * 0.6;
  };

  zone.cameraView = view(X + 3.2, Y + 3.4, Z + D / 2 + 9.5, X - 0.4, Y + 2.4, Z - 0.5);
  return zone;
}
