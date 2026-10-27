import * as THREE from 'three';
import { createZoneBase, viewFor, wood, stone, paper, figure, shadows } from './common.js';
import { makeTileTexture, makeScreenPainting, makePaperTexture, rng } from '../scene/textures.js';
import { PALETTE } from './data.js';

// A timber pavilion under a curved hip roof with lifted eaves. Long tables,
// paper, lanterns, and a folding landscape screen; no screens of the other
// kind. Its event ("Hush") slows the motion of the entire library.

function roofGeometry(W, D, low) {
  const geo = new THREE.PlaneGeometry(W, D, low ? 24 : 36, low ? 20 : 30);
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position;
  const hip = (W - D) / 2;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    const nx = Math.min(1, Math.max(0, (Math.abs(x) - hip) / (D / 2)));
    const nz = Math.abs(z) / (D / 2);
    const d = Math.max(nx, nz); // 0 on the ridge, 1 at the eave
    const corner = Math.pow(Math.abs(x) / (W / 2), 6) * Math.pow(nz, 6);
    p.setY(i, 2.1 * Math.pow(1 - d, 1.5) + 0.22 * Math.pow(d, 5) + 0.75 * corner);
  }
  geo.computeVertexNormals();
  return geo;
}

export function createQuiet(def, ctx) {
  const zone = createZoneBase(def, { hitRadius: 6.2, hitHeight: 7.5, lightY: 3.2, lightIntensity: 9, lightDistance: 13 });
  const g = zone.group;
  const rand = rng(8);
  const low = ctx.quality === 'low';

  const BASE = 0.45;
  const COL_H = 4.1;
  const TOP = BASE + COL_H;

  // stone platform and front step
  const platform = new THREE.Mesh(new THREE.BoxGeometry(10.6, BASE, 8.2), stone(0xcfc2ab));
  platform.position.set(0, BASE / 2, -0.4);
  const step = new THREE.Mesh(new THREE.BoxGeometry(3.4, BASE / 2, 0.7), stone(0xc6b8a0));
  step.position.set(0, BASE / 4, 3.55);
  g.add(shadows(platform), shadows(step));

  // lacquered columns and beams
  const lacquer = wood(PALETTE.lacquer);
  const beamMat = wood(0x5a3523);
  const colGeo = new THREE.CylinderGeometry(0.15, 0.18, COL_H, 12);
  const xs = [-4.7, -1.6, 1.6, 4.7];
  const zs = [-3.9, 3.0];
  for (const x of xs)
    for (const z of zs) {
      const c = new THREE.Mesh(colGeo, lacquer);
      c.position.set(x, BASE + COL_H / 2, z);
      g.add(shadows(c));
    }
  for (const z of zs) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.3, 0.3), beamMat);
    b.position.set(0, TOP - 0.05, z);
    g.add(shadows(b));
  }
  for (const x of [-4.7, 4.7]) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 7.2), beamMat);
    b.position.set(x, TOP - 0.05, -0.45);
    g.add(shadows(b));
  }

  // curved roof: tiles above, warm timber beneath (same surface, two faces)
  const roofGeo = roofGeometry(12.6, 10.2, low);
  const tileTex = makeTileTexture();
  const roofTop = new THREE.Mesh(roofGeo, new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.85, side: THREE.FrontSide }));
  const roofUnder = new THREE.Mesh(roofGeo, new THREE.MeshStandardMaterial({ color: 0x7a5236, roughness: 0.9, side: THREE.BackSide }));
  roofTop.position.set(0, TOP + 0.1, -0.45);
  roofUnder.position.copy(roofTop.position);
  roofTop.castShadow = true;
  roofUnder.receiveShadow = true;
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.28, 0.32), new THREE.MeshStandardMaterial({ color: 0x3e3c3a, roughness: 0.8 }));
  ridge.position.set(0, TOP + 0.1 + 2.15, -0.45);
  g.add(roofTop, roofUnder, shadows(ridge));

  // long tables, benches, open books and quiet readers
  const tableMat = wood(0x8c6040);
  const tableGeo = new THREE.BoxGeometry(6.2, 0.1, 1.1);
  const legGeo = new THREE.BoxGeometry(0.1, 0.72, 0.9);
  const benchGeo = new THREE.BoxGeometry(6.2, 0.08, 0.36);
  const benchLegGeo = new THREE.BoxGeometry(0.08, 0.4, 0.3);
  const pageMat = paper(makePaperTexture(128));
  const coverMats = [0x8c4a32, 0x5c6a58, 0x3f4a52].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 }));
  let reader = 0;
  [-1.2, 1.3].forEach((z) => {
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, BASE + 0.77, z);
    g.add(shadows(table));
    [-2.8, 2.8].forEach((x) => {
      const leg = new THREE.Mesh(legGeo, tableMat);
      leg.position.set(x, BASE + 0.36, z);
      g.add(shadows(leg));
    });
    [-0.85, 0.85].forEach((dz) => {
      const bench = new THREE.Mesh(benchGeo, tableMat);
      bench.position.set(0, BASE + 0.42, z + dz);
      g.add(shadows(bench));
      [-2.7, 2.7].forEach((x) => {
        const l = new THREE.Mesh(benchLegGeo, tableMat);
        l.position.set(x, BASE + 0.2, z + dz);
        g.add(l);
      });
    });
    for (let i = 0; i < 5; i++) {
      const bx = -2.4 + i * 1.2 + (rand() - 0.5) * 0.3;
      const side = i % 2 ? 1 : -1;
      // open book: two pages tilted like a shallow V
      const book = new THREE.Group();
      [-1, 1].forEach((s) => {
        const pg = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.012, 0.36), pageMat);
        pg.position.x = s * 0.13;
        pg.rotation.z = s * 0.1;
        book.add(pg);
      });
      book.position.set(bx, BASE + 0.84, z + side * 0.26);
      book.rotation.y = (side > 0 ? Math.PI : 0) + (rand() - 0.5) * 0.4;
      g.add(shadows(book));
      if (i % 2 === 0) {
        for (let k = 0; k < 3; k++) {
          const s = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.07, 0.28), coverMats[(k + i) % 3]);
          s.position.set(bx + 0.5, BASE + 0.86 + k * 0.072, z - side * 0.25);
          s.rotation.y = (rand() - 0.5) * 0.4;
          g.add(shadows(s));
        }
      }
      // a reader for most open books
      if ((i + (z > 0 ? 1 : 0)) % 2 === 0) {
        const f = figure(reader++);
        f.position.set(bx, BASE + 0.46, z + side * 0.85);
        f.rotation.order = 'YXZ';
        f.rotation.y = side > 0 ? Math.PI : 0;
        f.rotation.x = 0.22; // bowed over the page
        g.add(f);
      }
    }
  });

  // folding landscape screen at the back
  const painting = makeScreenPainting();
  const screenMat = new THREE.MeshStandardMaterial({ map: painting, roughness: 0.95, side: THREE.DoubleSide });
  const frameMat = wood(0x4a2f20);
  const panels = 4;
  const pw = 1.35;
  const ph = 2.3;
  let px = -((panels - 1) * pw * 0.94) / 2;
  for (let i = 0; i < panels; i++) {
    const geo = new THREE.PlaneGeometry(pw, ph);
    const uv = geo.attributes.uv;
    for (let k = 0; k < uv.count; k++) uv.setX(k, (i + uv.getX(k)) / panels);
    const panel = new THREE.Mesh(geo, screenMat);
    const yaw = i % 2 ? -0.32 : 0.32;
    panel.position.set(px, BASE + ph / 2 + 0.12, -3.35 + (i % 2 ? 0 : 0.2));
    panel.rotation.y = yaw;
    const frame = new THREE.Mesh(new THREE.BoxGeometry(pw + 0.08, ph + 0.08, 0.04), frameMat);
    frame.position.z = -0.03;
    panel.add(frame);
    g.add(shadows(panel));
    px += pw * 0.94;
  }

  // hanging paper lanterns
  const lanternGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.46, 18, 1);
  const lanternCapGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.06, 12);
  const lanternMat = new THREE.MeshStandardMaterial({
    color: 0xf7e7c8,
    emissive: new THREE.Color(PALETTE.lamp),
    emissiveIntensity: 0.8,
    roughness: 0.9
  });
  const capMat = wood(0x2e211a);
  const cordMat = new THREE.LineBasicMaterial({ color: 0x3a2a20, transparent: true, opacity: 0.7 });
  const lanterns = [];
  for (let i = 0; i < 6; i++) {
    const x = -2.6 + (i % 3) * 2.6;
    const z = i < 3 ? -1.2 : 1.3;
    const y = BASE + 3.0 + rand() * 0.3;
    const l = new THREE.Group();
    l.position.set(x, y, z);
    const body = new THREE.Mesh(lanternGeo, lanternMat);
    const capT = new THREE.Mesh(lanternCapGeo, capMat);
    capT.position.y = 0.26;
    const capB = capT.clone();
    capB.position.y = -0.26;
    l.add(body, capT, capB);
    const cord = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, y + 0.28, z), new THREE.Vector3(x, TOP + 1.5, z)]),
      cordMat
    );
    g.add(l, cord);
    lanterns.push({ l, phase: rand() * 6, y });
  }

  zone.activate = () => {
    zone.trigger();
    ctx.world.hush(7);
  };

  zone.update = (t, dt) => {
    zone.baseUpdate(dt);
    const e = zone.energy;
    const flicker = 1 + Math.sin(t * 2.3) * 0.04 + Math.sin(t * 7.1) * 0.02;
    lanternMat.emissiveIntensity = (0.8 + zone.focusMix * 0.3 + e * 1.4) * flicker;
    for (const L of lanterns) {
      L.l.position.y = L.y + Math.sin(t * 0.5 + L.phase) * 0.03;
      L.l.rotation.z = Math.sin(t * 0.4 + L.phase) * 0.03;
    }
  };

  zone.cameraView = viewFor(zone, 11, 4.4, 0.25, 2.1);
  return zone;
}
