import * as THREE from 'three';
import { createZoneBase, viewFor } from './common.js';
import { createGlyphField } from '../scene/glyphField.js';
import { makeGlowSprite } from '../scene/textures.js';
import { PALETTE } from './data.js';

// A warm, open pavilion with long tables, paper and lanterns, and no screens.
// Its event ("Hush") slows the ambient motion of the entire library.
export function createQuiet(def, ctx) {
  const zone = createZoneBase(def, { hitRadius: 6, hitHeight: 7, lightY: 3, lightIntensity: 38, lightDistance: 16 });
  const g = zone.group;

  const warm = new THREE.MeshStandardMaterial({ color: 0x2a1d17, roughness: 0.85, metalness: 0.05 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x3a261a, roughness: 0.7, emissive: 0x2a1408, emissiveIntensity: 0.4 });
  const paper = new THREE.MeshStandardMaterial({ color: 0xf2e2c4, roughness: 0.9, emissive: 0x6b4a22, emissiveIntensity: 0.35 });

  const slab = new THREE.Mesh(new THREE.BoxGeometry(9, 0.25, 7), warm);
  slab.position.y = 0.125;
  const back = new THREE.Mesh(new THREE.BoxGeometry(9, 5, 0.3), warm);
  back.position.set(0, 2.5, -3.35);
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 3.6), warm);
  left.position.set(-4.35, 2.5, -1.6);
  const right = left.clone();
  right.position.x = 4.35;
  const roof = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.18, 7.4), warm);
  roof.position.y = 5.4;
  // thin amber seam where roof floats above walls
  const seam = new THREE.Mesh(
    new THREE.BoxGeometry(9.4, 0.04, 7.2),
    new THREE.MeshBasicMaterial({ color: PALETTE.amber, transparent: true, opacity: 0.6 })
  );
  seam.position.y = 5.22;
  g.add(slab, back, left, right, roof, seam);

  // long tables with benches, open books and stacks
  const tableGeo = new THREE.BoxGeometry(6, 0.12, 1.1);
  const legGeo = new THREE.BoxGeometry(0.1, 0.75, 0.9);
  const benchGeo = new THREE.BoxGeometry(6, 0.1, 0.4);
  [-0.6, 1.6].forEach((z) => {
    const table = new THREE.Mesh(tableGeo, wood);
    table.position.set(0, 0.95, z);
    g.add(table);
    [-2.7, 2.7].forEach((x) => {
      const leg = new THREE.Mesh(legGeo, wood);
      leg.position.set(x, 0.55, z);
      g.add(leg);
    });
    [-0.85, 0.85].forEach((dz) => {
      const bench = new THREE.Mesh(benchGeo, wood);
      bench.position.set(0, 0.6, z + dz);
      g.add(bench);
    });
    for (let i = 0; i < 5; i++) {
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.03, 0.38), paper);
      book.position.set(-2.4 + i * 1.2 + (Math.random() - 0.5) * 0.3, 1.03, z + (Math.random() - 0.5) * 0.3);
      book.rotation.y = (Math.random() - 0.5) * 0.5;
      g.add(book);
      if (i % 2 === 0) {
        for (let k = 0; k < 3; k++) {
          const s = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.3), k % 2 ? wood : paper);
          s.position.set(book.position.x + 0.45, 1.05 + k * 0.085, z - 0.3);
          s.rotation.y = (Math.random() - 0.5) * 0.4;
          g.add(s);
        }
      }
    }
  });

  // hanging lanterns
  const lanterns = [];
  const cordMat = new THREE.LineBasicMaterial({ color: 0x5a4030, transparent: true, opacity: 0.6 });
  for (let i = 0; i < 6; i++) {
    const x = -2.5 + (i % 3) * 2.5;
    const z = i < 3 ? -0.6 : 1.6;
    const y = 3.0 + Math.random() * 0.4;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffd9a0 }));
    bulb.position.set(x, y, z);
    const glow = makeGlowSprite(ctx.glow, PALETTE.amber, 1.6, 0.8);
    bulb.add(glow);
    const cord = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, y, z), new THREE.Vector3(x, 5.3, z)]),
      cordMat
    );
    g.add(bulb, cord);
    lanterns.push({ bulb, glow, phase: Math.random() * 6, y });
  }

  // slow warm dust — no glyphs in here, only motes
  const dust = createGlyphField({
    count: ctx.quality === 'low' ? 60 : 120,
    radius: 4,
    height: 5,
    size: 0.9,
    glyphRatio: 0,
    sway: 0.4,
    speed: 0.08,
    colors: [0xffcf8a, 0xffb454, 0xfff0d0],
    atlas: ctx.atlas,
    pixelRatio: ctx.pixelRatio
  });
  dust.points.position.y = 0.3;
  g.add(dust.points);
  ctx.fields.push(dust);

  zone.activate = () => {
    zone.trigger();
    ctx.world.hush(7);
  };

  zone.update = (t, dt) => {
    zone.baseUpdate(dt);
    const e = zone.energy;
    for (const l of lanterns) {
      const flicker = 1 + Math.sin(t * 2.3 + l.phase) * 0.05 + Math.sin(t * 7.1 + l.phase) * 0.03;
      l.glow.scale.setScalar((1.6 + e * 1.4 + zone.focusMix * 0.3) * flicker);
      l.bulb.position.y = l.y + Math.sin(t * 0.5 + l.phase) * 0.04;
    }
    seam.material.opacity = 0.45 + e * 0.5;
  };

  zone.cameraView = viewFor(zone, 10.5, 4.6, 0.25, 2.0);
  return zone;
}
