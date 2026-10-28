import * as THREE from 'three';
import { makeInkRingTexture } from '../core/textures.js';
import { patch } from '../core/materials.js';
import { PAL } from '../core/config.js';

// Soft ink ripples that spread across the paving from an event's origin.
export function createFx() {
  const group = new THREE.Group();
  group.name = 'fx';
  const tex = makeInkRingTexture();
  const ripples = Array.from({ length: 5 }, () => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      patch(new THREE.MeshBasicMaterial({ map: tex, color: PAL.ink, transparent: true, opacity: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 }), 'ripple')
    );
    m.rotation.x = -Math.PI / 2;
    m.visible = false;
    m.renderOrder = 2;
    m.userData = { age: 0, dur: 3.4, maxR: 14 };
    group.add(m);
    return m;
  });
  let next = 0;
  return {
    group,
    pulse(x, z, maxR = 14, y = 0.06) {
      const r = ripples[next++ % ripples.length];
      r.position.set(x, y, z);
      r.userData.age = 0;
      r.userData.maxR = maxR;
      r.scale.set(1, 1, 1);
      r.visible = true;
    },
    update(dt) {
      for (const r of ripples) {
        if (!r.visible) continue;
        const u = r.userData;
        u.age += dt;
        const k = u.age / u.dur;
        if (k >= 1) {
          r.visible = false;
          continue;
        }
        const s = 1 + (1 - Math.pow(1 - k, 2.2)) * u.maxR * 2;
        r.scale.set(s, s, 1);
        r.material.opacity = 0.34 * (1 - k) * Math.min(1, k * 8);
      }
    }
  };
}
