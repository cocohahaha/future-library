import * as THREE from 'three';
import { createZoneBase, darkStone, viewFor } from './common.js';
import { makeGlowSprite } from '../scene/textures.js';
import { PALETTE } from './data.js';

// Three seminar rings. In each, humans sit around a trio of tutor-orbs that
// orbit one another, each a different "perspective", joined by voice arcs.
export function createDialogue(def, ctx) {
  const zone = createZoneBase(def, { hitRadius: 6.5, hitHeight: 7, lightY: 4, lightIntensity: 32 });
  const g = zone.group;

  const personGeo = new THREE.CapsuleGeometry(0.2, 0.55, 4, 8);
  const personMat = new THREE.MeshStandardMaterial({ color: 0x1c1a3d, roughness: 0.6, emissive: 0x241a55, emissiveIntensity: 0.6 });
  const tutorColors = [PALETTE.teal, PALETTE.amber, PALETTE.violet];

  const alcoves = [
    new THREE.Vector3(-3.4, 0, 0.8),
    new THREE.Vector3(3.4, 0, 0.8),
    new THREE.Vector3(0, 0, -3.2)
  ].map((p, ai) => {
    const a = new THREE.Group();
    a.position.copy(p);
    g.add(a);

    const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.35, 0.22, 48), darkStone());
    platform.position.y = 0.11;
    const edge = new THREE.Mesh(
      new THREE.TorusGeometry(2.25, 0.04, 6, 96),
      new THREE.MeshBasicMaterial({ color: PALETTE.violet, transparent: true, opacity: 0.8 })
    );
    edge.rotation.x = -Math.PI / 2;
    edge.position.y = 0.24;
    a.add(platform, edge);

    // seated people, slight random gestures
    const people = [];
    const n = 5;
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + ai;
      const person = new THREE.Mesh(personGeo, personMat);
      person.position.set(Math.cos(ang) * 1.65, 0.72, Math.sin(ang) * 1.65);
      person.userData.phase = Math.random() * 6;
      person.rotation.order = 'YXZ';
      person.rotation.y = Math.atan2(-person.position.x, -person.position.z); // face the orbs
      a.add(person);
      people.push(person);
    }

    const orbs = tutorColors.map((c, i) => {
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), new THREE.MeshBasicMaterial({ color: c }));
      const glow = makeGlowSprite(ctx.glow, c, 1.4, 0.85);
      orb.add(glow);
      orb.userData = { phase: (i / 3) * Math.PI * 2, r: 0.75 + i * 0.12, glow };
      a.add(orb);
      return orb;
    });

    // voice arcs: closed triangle between the three orbs
    const arcGeo = new THREE.BufferGeometry();
    arcGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(4 * 3), 3));
    const arcMat = new THREE.LineBasicMaterial({
      color: 0xd9ccff,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const arc = new THREE.Line(arcGeo, arcMat);
    arc.frustumCulled = false;
    a.add(arc);

    return { group: a, orbs, arc, arcMat, people, spin: Math.random() * 10, speed: 0.5 + ai * 0.12 };
  });

  zone.activate = () => zone.trigger();

  zone.update = (t, dt) => {
    zone.baseUpdate(dt);
    const e = zone.energy;
    for (const al of alcoves) {
      al.spin += dt * al.speed * (1 + e * 4) * ctx.world.speed;
      const arr = al.arc.geometry.attributes.position.array;
      al.orbs.forEach((orb, i) => {
        const u = orb.userData;
        const r = u.r * (1 - e * 0.45);
        const a = al.spin * (1 + i * 0.25) + u.phase;
        orb.position.set(Math.cos(a) * r, 1.7 + Math.sin(al.spin * 1.7 + i * 2) * 0.25, Math.sin(a) * r);
        u.glow.scale.setScalar(1.3 + e * 1.2 + Math.sin(t * 3 + i) * 0.15);
        arr[i * 3] = orb.position.x;
        arr[i * 3 + 1] = orb.position.y;
        arr[i * 3 + 2] = orb.position.z;
      });
      arr[9] = arr[0];
      arr[10] = arr[1];
      arr[11] = arr[2];
      al.arc.geometry.attributes.position.needsUpdate = true;
      al.arcMat.opacity = 0.18 + zone.focusMix * 0.12 + e * 0.7 * (0.6 + 0.4 * Math.sin(t * 18));
      for (const p of al.people) {
        // people lean in when the argument heats up
        p.rotation.x = 0.08 + e * 0.28 + Math.sin(t * 0.8 + p.userData.phase) * 0.05;
        p.position.y = 0.72 + Math.sin(t * 1.2 + p.userData.phase) * 0.015;
      }
    }
  };

  zone.cameraView = viewFor(zone, 11, 6.5, -0.45, 1.6);
  return zone;
}
