import * as THREE from 'three';
import { createZoneBase, view } from './common.js';
import { rng } from '../core/rng.js';
import { MAT } from '../core/builder.js';
import { extrude } from '../core/geom.js';
import { patch } from '../core/materials.js';
import { PAL } from '../core/config.js';
import { cushion, hangingLantern } from '../props/props.js';

// Dialogue Alcoves (对话龛): a waterside hall on the pond, divided into three
// alcoves by round-opening partitions (圆光罩). In each, people sit on
// cushions around three glazed ceramic tutors designed to disagree; fine ink
// arcs join them. Activation: the argument heats up — tutors orbit faster
// and closer, arcs bow and darken, the paper screens glow, people lean in.

const TUTORS = [PAL.celadon, PAL.ochre, PAL.cinnabar];
const ARC_SEG = 10;

export function createDialogue(def, ctx) {
  const A = ctx.anchors.dialogue;
  const zone = createZoneBase(def, { hit: [A.W + 3, 7, A.D + 4], hitOffset: [0, 0, 1] });
  const g = zone.group;
  const { B, crowd, kit } = ctx;
  const rand = rng(23);
  const X = A.x;
  const Z = A.z;
  const Y = A.floor;
  const D = A.D;
  zone.lamp = { x: X, y: Y + 2.4, z: Z, intensity: 7, distance: 13 };

  // round-opening partitions at the two inner column lines
  const pw = D - 0.25;
  const ph = 3.5 - 0.72;
  const shape = new THREE.Shape();
  shape.moveTo(-pw / 2, 0);
  shape.lineTo(pw / 2, 0);
  shape.lineTo(pw / 2, ph);
  shape.lineTo(-pw / 2, ph);
  shape.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, ph * 0.5, Math.min(ph, pw) * 0.44, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const panel = extrude(shape, 0.12, 40);
  const ring = new THREE.TorusGeometry(Math.min(ph, pw) * 0.44, 0.06, 6, 48);
  for (const lx of [A.xs[1], A.xs[2]]) {
    const m = new THREE.Matrix4().makeRotationY(Math.PI / 2).setPosition(X + lx, Y, Z);
    B.add('solid', panel, m, 0x5a2e1f, { kind: MAT.lacquer, ao: 0.85 });
    B.add('solid', ring, new THREE.Matrix4().makeRotationY(Math.PI / 2).setPosition(X + lx, Y + ph * 0.5, Z), 0xc9a24c, { kind: MAT.gold });
  }

  // three alcoves
  const tutorGeo = new THREE.SphereGeometry(0.17, 20, 14);
  const alcoves = [];
  const centers = [(A.xs[0] + A.xs[1]) / 2, (A.xs[1] + A.xs[2]) / 2, (A.xs[2] + A.xs[3]) / 2];
  centers.forEach((lx, ai) => {
    const cx = X + lx;
    const cz = Z + 0.3;
    // woven rush mat on a low dais
    B.cyl('solid', 0x8a6a48, 1.75, 0.12, cx, Y, cz, { seg: 28, kind: MAT.wood });
    B.cyl('solid', 0xcdb98a, 1.62, 0.02, cx, Y + 0.12, cz, { seg: 28, kind: MAT.cloth });
    const people = [];
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.4 + ai;
      const x = cx + Math.cos(a) * 1.18;
      const z = cz + Math.sin(a) * 1.18;
      cushion(B, x, Y + 0.13, z, [0x8f4b36, 0xb08a52, 0x5c6a58][(i + ai) % 3]);
      const id = `dlg${ai}_${i}`;
      crowd.place('floor', x, Y + 0.18, z, Math.atan2(cx - x, cz - z), null, id);
      people.push(id);
    }
    // a hanging paper lantern over each circle
    hangingLantern(kit, B, cx, Y + 2.55, cz, 'paper', Y + 3.4);
    const tutors = TUTORS.map((c, i) => {
      const orb = new THREE.Mesh(
        tutorGeo,
        patch(new THREE.MeshStandardMaterial({ color: c, roughness: 0.18, metalness: 0, emissive: c, emissiveIntensity: 0.06 }), 'tutor')
      );
      orb.castShadow = true;
      orb.userData = { phase: (i / 3) * Math.PI * 2, r: 0.5 + i * 0.09 };
      g.add(orb);
      return orb;
    });
    const arcGeo = new THREE.BufferGeometry();
    arcGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * ARC_SEG * 2 * 3), 3));
    const arcMat = patch(new THREE.LineBasicMaterial({ color: PAL.ink, transparent: true, opacity: 0.35, depthWrite: false }), 'arc');
    const arc = new THREE.LineSegments(arcGeo, arcMat);
    arc.frustumCulled = false;
    g.add(arc);
    alcoves.push({ cx, cz, tutors, arc, arcMat, people, spin: rand() * 10, speed: 0.4 + ai * 0.1 });
  });
  // a few people on the bank watching / walking by
  crowd.place('stand', X + 7.6, 0, Z - 4.4, -2.6, null);
  crowd.place('stand', X - 8.2, 0, Z - 3.6, 2.2, null);

  const P = new THREE.Vector3();
  const Aa = new THREE.Vector3();
  const Bb = new THREE.Vector3();
  zone.activate = () => zone.trigger();
  zone.update = (t, dt) => {
    zone.baseUpdate(dt);
    const e = zone.energy;
    for (const al of alcoves) {
      al.spin += dt * al.speed * (1 + e * 3.5) * ctx.world.speed;
      al.tutors.forEach((orb, i) => {
        const u = orb.userData;
        const r = u.r * (1 - e * 0.4);
        const a = al.spin * (1 + i * 0.25) + u.phase;
        orb.position.set(al.cx + Math.cos(a) * r, Y + 1.05 + Math.sin(al.spin * 1.7 + i * 2) * 0.18, al.cz + Math.sin(a) * r);
        orb.material.emissiveIntensity = 0.06 + e * 0.5 * (0.5 + 0.5 * Math.sin(t * 6 + i * 2));
      });
      const arr = al.arc.geometry.attributes.position.array;
      let o = 0;
      for (let k = 0; k < 3; k++) {
        Aa.copy(al.tutors[k].position);
        Bb.copy(al.tutors[(k + 1) % 3].position);
        const bow = 0.22 + e * 0.28;
        for (let s = 0; s < ARC_SEG; s++)
          for (const u of [s / ARC_SEG, (s + 1) / ARC_SEG]) {
            P.lerpVectors(Aa, Bb, u);
            P.y += Math.sin(u * Math.PI) * bow;
            arr[o++] = P.x;
            arr[o++] = P.y;
            arr[o++] = P.z;
          }
      }
      al.arc.geometry.attributes.position.needsUpdate = true;
      al.arcMat.opacity = 0.3 + zone.focusMix * 0.12 + e * 0.5 * (0.6 + 0.4 * Math.sin(t * 9));
      al.people.forEach((id, i) => crowd.lean(id, 0.05 + e * 0.32 + Math.sin(t * 0.8 + i * 1.7) * 0.03));
    }
    if (kit.mats.latticeDlg) kit.mats.latticeDlg.userData.paperGlow.value = 0.32 + zone.focusMix * 0.2 + e * 0.9;
  };

  zone.cameraView = view(X + 4.5, 4.2, Z + 19, X - 0.5, Y + 1.3, Z + 0.5);
  return zone;
}
