import * as THREE from 'three';
import { makeTextBoard } from '../core/textures.js';
import { patch } from '../core/materials.js';

// Lacquered boards with calligraphy: plaques (匾额) over doors and couplets
// (楹联) on columns. Each is a small textured mesh with a faint gilt glow.
export function plaque(text, { w = 2.4, h = 0.8, vertical = false, bg = '#2b1a12', fg = '#d9b45c', border = '#b8913f', px = 512 } = {}) {
  const pw = vertical ? Math.round(px * (w / h)) : px;
  const ph = vertical ? px : Math.round(px * (h / w));
  const tex = makeTextBoard(text, { w: pw, h: ph, vertical, bg, fg, border });
  const mat = patch(
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0.0, emissive: 0x2a1a08, emissiveMap: tex, emissiveIntensity: 0.25 }),
    'plaque'
  );
  const group = new THREE.Group();
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  face.position.z = 0.051;
  const back = new THREE.Mesh(new THREE.BoxGeometry(w + 0.08, h + 0.08, 0.1), patch(new THREE.MeshStandardMaterial({ color: 0x3a2116, roughness: 0.6 }), 'plaqueBack'));
  group.add(back, face);
  group.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return group;
}
