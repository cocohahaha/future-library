import * as THREE from 'three';
import { createZoneBase, viewFor, wood, figure, shadows } from './common.js';
import { makeLatticeTexture, rng } from '../scene/textures.js';
import { PALETTE } from './data.js';

// Three alcoves of curved paper screens, open toward the well. In each, people
// sit on cushions around three glazed ceramic tutors: three perspectives that
// orbit and contradict one another, joined by fine ink arcs.

const TUTORS = [PALETTE.celadon, PALETTE.ochre, PALETTE.cinnabar];
const ARC_SEG = 10;

export function createDialogue(def, ctx) {
  const zone = createZoneBase(def, { hitRadius: 6.5, hitHeight: 6, lightY: 3, lightIntensity: 7 });
  const g = zone.group;
  const rand = rng(23);

  const lattice = makeLatticeTexture();
  lattice.wrapS = THREE.RepeatWrapping;
  lattice.repeat.set(7, 1);
  const screenMat = new THREE.MeshStandardMaterial({
    map: lattice,
    emissiveMap: lattice,
    emissive: new THREE.Color(PALETTE.lamp),
    emissiveIntensity: 0.12,
    roughness: 0.95,
    side: THREE.DoubleSide
  });
  const railMat = wood(0x5e3c28);
  const daisMat = wood(0x9a6a45);
  const matTop = new THREE.MeshStandardMaterial({ color: 0xcdbb8a, roughness: 1 }); // woven rush mat
  const cushionGeo = new THREE.CylinderGeometry(0.3, 0.32, 0.12, 14);
  const cushionMats = [0x8f4b36, 0xb08a52, 0x5c6a58].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 1 }));
  const tutorGeo = new THREE.SphereGeometry(0.17, 20, 14);

  const GAP = Math.PI * 0.62;
  const R = 2.5;
  const H = 2.3;

  const alcoves = [
    new THREE.Vector3(-3.5, 0, 0.9),
    new THREE.Vector3(3.5, 0, 0.9),
    new THREE.Vector3(0, 0, -3.3)
  ].map((p, ai) => {
    const a = new THREE.Group();
    a.position.copy(p);
    g.add(a);

    const screen = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 48, 1, true, GAP / 2, Math.PI * 2 - GAP), screenMat);
    screen.position.y = H / 2 + 0.05;
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.03, R + 0.03, 0.1, 48, 1, true, GAP / 2, Math.PI * 2 - GAP), railMat);
    rail.position.y = H + 0.1;
    const foot = rail.clone();
    foot.position.y = 0.08;
    const dais = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 2.25, 0.22, 40), daisMat);
    dais.position.y = 0.11;
    const mat = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 1.95, 0.02, 40), matTop);
    mat.position.y = 0.23;
    a.add(shadows(screen), rail, foot, shadows(dais), shadows(mat, false, true));

    const people = [];
    const n = 4;
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + 0.4 + ai;
      const x = Math.cos(ang) * 1.45;
      const z = Math.sin(ang) * 1.45;
      const cushion = new THREE.Mesh(cushionGeo, cushionMats[(i + ai) % 3]);
      cushion.position.set(x, 0.3, z);
      a.add(shadows(cushion));
      const person = figure(i + ai);
      person.position.set(x, 0.36, z);
      person.rotation.order = 'YXZ';
      person.rotation.y = Math.atan2(-x, -z); // face the tutors
      person.userData.phase = rand() * 6;
      a.add(person);
      people.push(person);
    }

    const tutors = TUTORS.map((c, i) => {
      const orb = new THREE.Mesh(
        tutorGeo,
        new THREE.MeshStandardMaterial({ color: c, roughness: 0.22, metalness: 0, emissive: c, emissiveIntensity: 0.05 })
      );
      orb.castShadow = true;
      orb.userData = { phase: (i / 3) * Math.PI * 2, r: 0.55 + i * 0.1 };
      a.add(orb);
      return orb;
    });

    // ink arcs: one bowed curve between each pair of tutors
    const arcGeo = new THREE.BufferGeometry();
    arcGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * ARC_SEG * 2 * 3), 3));
    const arcMat = new THREE.LineBasicMaterial({ color: PALETTE.ink, transparent: true, opacity: 0.35, depthWrite: false });
    const arc = new THREE.LineSegments(arcGeo, arcMat);
    arc.frustumCulled = false;
    a.add(arc);

    return { group: a, tutors, arc, arcMat, people, spin: rand() * 10, speed: 0.4 + ai * 0.1 };
  });

  zone.activate = () => zone.trigger();

  const A = new THREE.Vector3();
  const B = new THREE.Vector3();
  const P = new THREE.Vector3();
  zone.update = (t, dt) => {
    zone.baseUpdate(dt);
    const e = zone.energy;
    screenMat.emissiveIntensity = 0.1 + zone.focusMix * 0.12 + e * 0.55;
    for (const al of alcoves) {
      al.spin += dt * al.speed * (1 + e * 3.5) * ctx.world.speed;
      al.tutors.forEach((orb, i) => {
        const u = orb.userData;
        const r = u.r * (1 - e * 0.4);
        const a = al.spin * (1 + i * 0.25) + u.phase;
        orb.position.set(Math.cos(a) * r, 1.45 + Math.sin(al.spin * 1.7 + i * 2) * 0.2, Math.sin(a) * r);
        orb.material.emissiveIntensity = 0.05 + e * 0.35 * (0.5 + 0.5 * Math.sin(t * 6 + i * 2));
      });
      const arr = al.arc.geometry.attributes.position.array;
      let o = 0;
      for (let k = 0; k < 3; k++) {
        A.copy(al.tutors[k].position);
        B.copy(al.tutors[(k + 1) % 3].position);
        const bow = 0.22 + e * 0.25;
        for (let sgm = 0; sgm < ARC_SEG; sgm++) {
          for (const u of [sgm / ARC_SEG, (sgm + 1) / ARC_SEG]) {
            P.lerpVectors(A, B, u);
            P.y += Math.sin(u * Math.PI) * bow;
            arr[o++] = P.x;
            arr[o++] = P.y;
            arr[o++] = P.z;
          }
        }
      }
      al.arc.geometry.attributes.position.needsUpdate = true;
      al.arcMat.opacity = 0.28 + zone.focusMix * 0.12 + e * 0.5 * (0.6 + 0.4 * Math.sin(t * 9));
      for (const p of al.people) {
        // people lean in when the argument heats up
        p.rotation.x = 0.06 + e * 0.3 + Math.sin(t * 0.8 + p.userData.phase) * 0.04;
      }
    }
  };

  zone.cameraView = viewFor(zone, 11, 6.2, -0.45, 1.4);
  return zone;
}
