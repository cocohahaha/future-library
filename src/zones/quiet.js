import * as THREE from 'three';
import { createZoneBase, view } from './common.js';
import { rng } from '../core/rng.js';
import { makeScreenPainting } from '../core/textures.js';
import { patch } from '../core/materials.js';
import { table, bench, openBook, bookPile, bookcase, hangingLantern, pottedPlant } from '../props/props.js';

// The Unassisted Room (无辅助阅览室): a timber reading hall in a bamboo court.
// Long tables, bowed readers, paper lanterns and a folding landscape screen;
// no screens of the other kind. Its event (the Hush) slows the motion of the
// whole library and brightens the lanterns.

export function createQuiet(def, ctx) {
  const A = ctx.anchors.quiet;
  const zone = createZoneBase(def, { hit: [A.W + 3, 9, A.D + 4], hitOffset: [0, 0, 0.5] });
  const g = zone.group;
  const { B, crowd, kit } = ctx;
  const rand = rng(8);
  const X = A.x;
  const Z = A.z;
  const Y = A.floor;
  const D = A.D;
  zone.lamp = { x: X, y: Y + 2.6, z: Z - 1, intensity: 8, distance: 12 };

  // interior spans z ∈ [Z - D/2, Z + 2.5] (porch hall)
  const zBack = Z - D / 2;
  const tables = [Z - 2.2, Z + 0.5];
  let reader = 0;
  tables.forEach((tz, ti) => {
    table(B, X, Y, tz, 0, 6.4, 1.05, 0.76, 0x7a5236);
    for (const side of [-1, 1]) bench(B, X, Y, tz + side * 0.82, 0, 6.2);
    for (let i = 0; i < 5; i++) {
      const bx = X - 2.5 + i * 1.25 + (rand() - 0.5) * 0.2;
      const side = (i + ti) % 2 ? 1 : -1;
      openBook(B, bx, Y + 0.77, tz + side * 0.22, side > 0 ? Math.PI : 0);
      if (i % 2 === 0) bookPile(B, bx + 0.45, Y + 0.77, tz - side * 0.24, 2 + Math.floor(rand() * 3), rand);
      if ((i + ti) % 3 !== 2) {
        crowd.place(rand() < 0.6 ? 'sitRead' : 'sit', bx, Y, tz + side * 0.82, side > 0 ? Math.PI : 0, null, `quiet${reader++}`);
      }
    }
    // paper lanterns over each table
    for (let k = -1; k <= 1; k++) hangingLantern(kit, B, X + k * 2.3, Y + 2.7, tz, 'paper', Y + 3.9);
  });
  // wall shelves on both side walls
  for (const sx of [-1, 1])
    for (let k = 0; k < 2; k++) bookcase(B, X + sx * (A.W / 2 - 0.35), Y, Z - 3.6 + k * 2.3, -sx * Math.PI / 2, 2.0, 2.6, 0.4, 5, rand, { density: ctx.tier.books });
  pottedPlant(B, X - 5.2, Y, Z + 1.9, rand);
  pottedPlant(B, X + 5.2, Y, Z + 1.9, rand);
  // two people reading on the porch steps, one sweeping the court
  crowd.place('sitRead', X - 3.6, Y - 0.15, Z + D / 2 + 0.55, 0.15, 0xd8ccb0);
  crowd.place('stand', X + 4.5, 0, Z + 8.5, 2.8, 0x6e5440);

  // folding landscape screen against the back wall
  const painting = makeScreenPainting();
  const screenMat = patch(new THREE.MeshStandardMaterial({ map: painting, roughness: 0.95, side: THREE.DoubleSide }), 'screen');
  const frameMat = patch(new THREE.MeshStandardMaterial({ color: 0x4a2f20, roughness: 0.7 }), 'screenFrame');
  const panels = 6;
  const pw = 1.05;
  const phh = 2.1;
  let px = X - ((panels - 1) * pw * 0.94) / 2;
  for (let i = 0; i < panels; i++) {
    const geo = new THREE.PlaneGeometry(pw, phh);
    const uv = geo.attributes.uv;
    for (let k = 0; k < uv.count; k++) uv.setX(k, (i + uv.getX(k)) / panels);
    const panel = new THREE.Mesh(geo, screenMat);
    panel.position.set(px, Y + phh / 2 + 0.12, zBack + 0.75 + (i % 2 ? 0 : 0.18));
    panel.rotation.y = i % 2 ? -0.3 : 0.3;
    const frame = new THREE.Mesh(new THREE.BoxGeometry(pw + 0.08, phh + 0.08, 0.04), frameMat);
    frame.position.z = -0.03;
    panel.add(frame);
    panel.castShadow = true;
    panel.receiveShadow = true;
    g.add(panel);
    px += pw * 0.94;
  }

  zone.activate = () => {
    zone.trigger();
    ctx.world.hush(8);
  };
  zone.update = (t, dt) => {
    zone.baseUpdate(dt);
    const e = zone.energy;
    for (const m of kit.lanternMats || []) m.userData.glowK.value = 1 + e * 1.1;
    if (kit.mats.latticeQuiet) kit.mats.latticeQuiet.userData.paperGlow.value = 0.35 + zone.focusMix * 0.25 + e * 0.7;
  };

  zone.cameraView = view(X + 5.5, 3.6, Z + 16, X - 0.5, Y + 1.6, Z - 1.5);
  return zone;
}
