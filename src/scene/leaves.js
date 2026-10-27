import * as THREE from 'three';
import { PALETTE } from '../zones/data.js';
import { rng, makeLeafTexture } from './textures.js';

// Ginkgo leaves drifting down through the courtyard. Motion is accumulated
// with the world speed, so the Unassisted Room's hush slows them mid-air.
export function createLeaves({ count = 140, radius = 30, height = 14 } = {}) {
  const rand = rng(99);
  const geo = new THREE.PlaneGeometry(0.32, 0.32);
  const mat = new THREE.MeshLambertMaterial({
    map: makeLeafTexture(),
    alphaTest: 0.5,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.frustumCulled = false;

  const tones = [new THREE.Color(PALETTE.ginkgo), new THREE.Color(0xe2b84e), new THREE.Color(PALETTE.ochre), new THREE.Color(0xb5582f)];
  const leaves = [];
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * radius;
    leaves.push({
      x: Math.cos(a) * r,
      z: Math.sin(a) * r,
      y: rand() * height,
      fall: 0.35 + rand() * 0.45,
      phase: rand() * 10,
      spin: 0.8 + rand() * 1.6,
      sway: 0.4 + rand() * 0.8
    });
    c.copy(tones[i % 7 === 0 ? 3 : Math.floor(rand() * 3)]).multiplyScalar(0.9 + rand() * 0.2);
    mesh.setColorAt(i, c);
  }

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3(1, 1, 1);
  let flow = 0;

  return {
    mesh,
    update(dt, speed) {
      flow += dt * speed;
      for (let i = 0; i < count; i++) {
        const L = leaves[i];
        L.y -= dt * speed * L.fall;
        if (L.y < 0.05) {
          L.y = height;
          const a = rand() * Math.PI * 2;
          const r = Math.sqrt(rand()) * radius;
          L.x = Math.cos(a) * r;
          L.z = Math.sin(a) * r;
        }
        const ph = flow * L.spin + L.phase;
        p.set(L.x + Math.sin(ph * 0.7) * L.sway, L.y, L.z + Math.cos(ph * 0.5) * L.sway);
        e.set(Math.sin(ph) * 1.2, ph * 0.6, Math.cos(ph * 0.8) * 0.9);
        mesh.setMatrixAt(i, m.compose(p, q.setFromEuler(e), s));
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  };
}
