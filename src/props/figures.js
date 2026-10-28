import * as THREE from 'three';
import { Builder, mat4 } from '../core/builder.js';
import { lathe } from '../core/geom.js';
import { rng, clamp } from '../core/rng.js';
import { makeMasked, patch } from '../core/materials.js';
import { LAYER_REFLECT } from '../core/config.js';

// Stylised, faceless figures in robes. Each pose is one merged geometry
// whose robe vertices take the per-instance pigment (aMask = 1) while skin
// and hair keep their own colour. Walkers sway their hems in the vertex
// shader and follow paths; everyone gets a soft contact shadow.

export const ROBES = [0x3d4a5c, 0x5a6a7a, 0xa8844a, 0xd8ccb0, 0xe8e2d4, 0x7a9a8a, 0x6a3a3e, 0x6e5440, 0x8a8680, 0x9a3a2c, 0x4f5d4a, 0xb9a27a];
const SKIN = 0xd2ad8f;
const HAIR = 0x1e1a18;

function mergeParts(parts) {
  // parts: [{ geo, mask, color }]
  const pos = [];
  const nor = [];
  const col = [];
  const msk = [];
  const c = new THREE.Color();
  for (const { geo, mask, color } of parts) {
    const g = geo.index ? geo.toNonIndexed() : geo;
    const p = g.attributes.position.array;
    const n = g.attributes.normal.array;
    c.set(color);
    for (let i = 0; i < p.length; i++) pos.push(p[i]);
    for (let i = 0; i < n.length; i++) nor.push(n[i]);
    for (let i = 0; i < p.length / 3; i++) {
      col.push(c.r, c.g, c.b);
      msk.push(mask);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('aMask', new THREE.Float32BufferAttribute(msk, 1));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(new Array((pos.length / 3) * 2).fill(0), 2));
  g.computeBoundingSphere();
  return g;
}

const xf = (geo, m) => geo.clone().applyMatrix4(m);
const sph = (r, seg = 10) => new THREE.SphereGeometry(r, seg, Math.max(5, Math.round(seg * 0.7)));
const cyl = (r0, r1, h, seg = 8) => {
  const g = new THREE.CylinderGeometry(r1, r0, h, seg, 1);
  g.translate(0, h / 2, 0);
  return g;
};
// limb between two points
function limb(a, b, r0, r1, seg = 7) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const g = cyl(r0, r1, len, seg);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return g.applyMatrix4(new THREE.Matrix4().compose(a, q, new THREE.Vector3(1, 1, 1)));
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);

function headParts(y, z, hat, bow = 0) {
  const parts = [];
  const m = new THREE.Matrix4().makeRotationX(bow);
  const at = (g, x, yy, zz) => xf(g, new THREE.Matrix4().makeTranslation(x, yy - y, zz - z).premultiply(m).premultiply(new THREE.Matrix4().makeTranslation(0, y, z)));
  parts.push({ geo: at(cyl(0.045, 0.045, 0.1, 6), 0, y - 0.12, z), mask: 0, color: SKIN });
  parts.push({ geo: at(sph(0.105, 12), 0, y, z), mask: 0, color: SKIN });
  if (hat === 'cap') {
    // scholar's square cap (方巾)
    parts.push({ geo: at(new THREE.BoxGeometry(0.2, 0.12, 0.2), 0, y + 0.1, z - 0.01), mask: 0, color: HAIR });
    parts.push({ geo: at(sph(0.108, 10).scale(1, 0.75, 1), 0, y + 0.02, z - 0.02), mask: 0, color: HAIR });
  } else if (hat === 'straw') {
    const brim = new THREE.CylinderGeometry(0.06, 0.28, 0.12, 12, 1);
    parts.push({ geo: at(brim, 0, y + 0.12, z), mask: 0, color: 0xc8a868 });
  } else {
    parts.push({ geo: at(sph(0.11, 10).scale(1, 0.85, 1.05), 0, y + 0.025, z - 0.02), mask: 0, color: HAIR });
    parts.push({ geo: at(sph(0.05, 8), 0, y + 0.11, z - 0.05), mask: 0, color: HAIR });
  }
  return parts;
}

function standing(hat = 'bun') {
  const robe = lathe(
    [
      [0.0, 0],
      [0.27, 0.0],
      [0.255, 0.12],
      [0.21, 0.52],
      [0.17, 0.9],
      [0.19, 1.15],
      [0.215, 1.31],
      [0.16, 1.4],
      [0.07, 1.45],
      [0.0, 1.46]
    ],
    12
  );
  robe.scale(1, 1, 0.74);
  const parts = [{ geo: robe, mask: 1, color: 0xffffff }];
  parts.push({ geo: xf(cyl(0.18, 0.178, 0.07, 12), new THREE.Matrix4().makeScale(1, 1, 0.76).setPosition(0, 0.87, 0)), mask: 1, color: 0x7a7570 });
  // sleeves meeting in front (hands folded in the sleeves, 拱手)
  for (const s of [-1, 1]) parts.push({ geo: limb(V(s * 0.2, 1.33, 0), V(s * 0.08, 0.98, 0.13), 0.075, 0.105, 8), mask: 1, color: 0xf0f0f0 });
  parts.push({ geo: xf(sph(0.07, 8), new THREE.Matrix4().makeScale(1.6, 0.9, 1).setPosition(0, 0.96, 0.17)), mask: 1, color: 0xf0f0f0 });
  parts.push(...headParts(1.57, 0.01, hat));
  return mergeParts(parts);
}

// seated on a bench / stool (seat at y = 0.45), facing +z
function seated(bow = 0.18, hat = 'bun') {
  const parts = [];
  const torso = lathe(
    [
      [0.0, 0.45],
      [0.22, 0.45],
      [0.2, 0.62],
      [0.175, 0.86],
      [0.2, 1.05],
      [0.21, 1.2],
      [0.15, 1.28],
      [0.06, 1.33],
      [0, 1.34]
    ],
    12
  );
  torso.scale(1, 1, 0.76);
  torso.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -0.45, 0).premultiply(new THREE.Matrix4().makeRotationX(bow)).premultiply(new THREE.Matrix4().makeTranslation(0, 0.45, -0.05)));
  parts.push({ geo: torso, mask: 1, color: 0xffffff });
  // thighs and the robe draping to the floor
  parts.push({ geo: xf(new THREE.BoxGeometry(0.4, 0.17, 0.46), new THREE.Matrix4().makeTranslation(0, 0.5, 0.17)), mask: 1, color: 0xf2f2f2 });
  parts.push({ geo: limb(V(0, 0.02, 0.43), V(0, 0.5, 0.4), 0.24, 0.2, 10).scale(1, 1, 0.55), mask: 1, color: 0xe8e8e8 });
  // forearms resting forward (on a table or the lap)
  for (const s of [-1, 1]) parts.push({ geo: limb(V(s * 0.19, 1.15 - bow * 0.3, 0.02 + bow * 0.3), V(s * 0.11, 0.78, 0.36), 0.07, 0.09, 7), mask: 1, color: 0xf0f0f0 });
  parts.push(...headParts(1.45 - bow * 0.15, 0.03 + bow * 0.5, hat, bow * 0.9));
  return mergeParts(parts);
}

// cross-legged on a cushion (floor), facing +z
function crossLegged(bow = 0.08) {
  const parts = [];
  const torso = lathe(
    [
      [0.0, 0.1],
      [0.26, 0.1],
      [0.21, 0.3],
      [0.175, 0.52],
      [0.2, 0.72],
      [0.21, 0.86],
      [0.15, 0.94],
      [0.06, 0.99],
      [0, 1.0]
    ],
    12
  );
  torso.scale(1, 1, 0.76);
  torso.applyMatrix4(new THREE.Matrix4().makeRotationX(bow));
  parts.push({ geo: torso, mask: 1, color: 0xffffff });
  parts.push({ geo: xf(sph(1, 12), new THREE.Matrix4().makeScale(0.42, 0.13, 0.3).setPosition(0, 0.13, 0.14)), mask: 1, color: 0xeeeeee });
  for (const s of [-1, 1]) parts.push({ geo: limb(V(s * 0.2, 0.82, 0.02), V(s * 0.1, 0.36, 0.26), 0.07, 0.09, 7), mask: 1, color: 0xf0f0f0 });
  parts.push(...headParts(1.11, 0.05 + bow * 0.4, 'bun', bow));
  return mergeParts(parts);
}

// ---------------------------------------------------------------- crowd
export function createCrowd(tier, { terrainHeight }) {
  const geos = {
    standA: standing('bun'),
    standB: standing('cap'),
    standC: standing('straw'),
    walk: standing('bun'),
    walkB: standing('cap'),
    sit: seated(0.12, 'bun'),
    sitRead: seated(0.38, 'cap'),
    floor: crossLegged(0.1)
  };
  const mat = makeMasked({ roughness: 0.9 });
  const walkMat = makeMasked({ roughness: 0.9, walk: true });
  const rand = rng(1717);
  const lists = {};
  const walkers = [];
  const people = {}; // id → { key, index } so zones can animate specific people
  const add = (key, m, color, id) => {
    (lists[key] ||= []).push({ m, color });
    if (id) people[id] = { key, index: lists[key].length - 1 };
  };
  const pickRobe = () => ROBES[Math.floor(rand() * ROBES.length)];

  const api = {
    people,
    meshes: {},
    // static person: pose ∈ stand | sit | sitRead | floor
    place(pose, x, y, z, ry, color = null, id = null, scale = 1) {
      const key = pose === 'stand' ? ['standA', 'standB', 'standA', 'standC'][Math.floor(rand() * 4)] : pose;
      add(key, mat4(x, y, z, ry, scale * (0.94 + rand() * 0.1)), color ?? pickRobe(), id);
    },
    // walker along a polyline of [x, z] (or [x, y, z]) points; loops back and forth
    walker(path, opts = {}) {
      const pts = path.map((p) => (p.length === 3 ? new THREE.Vector3(p[0], p[1], p[2]) : new THREE.Vector3(p[0], terrainHeight(p[0], p[1]), p[1])));
      const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
      walkers.push({
        curve,
        len: curve.getLength(),
        u: opts.u ?? rand(),
        dir: rand() < 0.5 ? 1 : -1,
        speed: (opts.speed || 0.85) * (0.8 + rand() * 0.4),
        pause: 0,
        phase: rand() * 10,
        color: opts.color ?? pickRobe(),
        key: rand() < 0.65 ? 'walk' : 'walkB',
        scale: opts.child ? 0.66 : 0.95 + rand() * 0.1,
        fixedY: path[0].length === 3
      });
    },
    build() {
      const group = new THREE.Group();
      group.name = 'crowd';
      const col = new THREE.Color();
      for (const [key, list] of Object.entries(lists)) {
        const mesh = new THREE.InstancedMesh(geos[key], mat, list.length);
        list.forEach((it, i) => {
          mesh.setMatrixAt(i, it.m);
          mesh.setColorAt(i, col.set(it.color));
        });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.layers.enable(LAYER_REFLECT);
        mesh.computeBoundingSphere();
        group.add(mesh);
        api.meshes[key] = mesh;
      }
      // walkers: two instanced meshes (bun / cap) with per-instance stride phase
      const wk = { walk: [], walkB: [] };
      walkers.forEach((w) => wk[w.key].push(w));
      const walkMeshes = [];
      for (const key of ['walk', 'walkB']) {
        const list = wk[key];
        if (!list.length) continue;
        const g = geos[key].clone();
        const iw = new Float32Array(list.length * 2);
        list.forEach((w, i) => {
          iw[i * 2] = w.phase;
          iw[i * 2 + 1] = 1;
          w.mesh = null;
          w.index = i;
        });
        const attr = new THREE.InstancedBufferAttribute(iw, 2);
        g.setAttribute('iWalk', attr);
        const mesh = new THREE.InstancedMesh(g, walkMat, list.length);
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        list.forEach((w, i) => {
          mesh.setColorAt(i, col.set(w.color));
          w.mesh = mesh;
        });
        mesh.castShadow = false;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        group.add(mesh);
        walkMeshes.push(mesh);
      }
      // soft contact shadows for walkers
      const blobTex = (() => {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const g = c.getContext('2d');
        const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grd.addColorStop(0, 'rgba(0,0,0,0.55)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = grd;
        g.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
      })();
      const blobGeo = new THREE.PlaneGeometry(1, 1);
      blobGeo.rotateX(-Math.PI / 2);
      const blobMat = patch(new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }), 'blob');
      const blobs = new THREE.InstancedMesh(blobGeo, blobMat, Math.max(1, walkers.length));
      blobs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      blobs.frustumCulled = false;
      blobs.renderOrder = 1;
      group.add(blobs);

      const P = new THREE.Vector3();
      const T = new THREE.Vector3();
      const m = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const S = new THREE.Vector3();
      const up = new THREE.Vector3(0, 1, 0);
      api.update = (dt, speed, time) => {
        walkers.forEach((w, i) => {
          if (w.pause > 0) {
            w.pause -= dt * speed;
          } else {
            w.u += (w.dir * w.speed * dt * speed) / w.len;
            if (w.u > 1 || w.u < 0) {
              w.u = clamp(w.u, 0, 1);
              w.dir *= -1;
              w.pause = 2 + rand() * 5;
            } else if (rand() < dt * 0.02) w.pause = 1.5 + rand() * 3;
          }
          w.curve.getPointAt(w.u, P);
          w.curve.getTangentAt(w.u, T);
          const yaw = Math.atan2(T.x * w.dir, T.z * w.dir);
          const moving = w.pause > 0 ? 0 : 1;
          const bob = moving * Math.abs(Math.sin(time * 5.2 + w.phase)) * 0.025;
          const y = w.fixedY ? P.y : terrainHeight(P.x, P.z);
          q.setFromAxisAngle(up, yaw);
          m.compose(P.set(P.x, y + bob, P.z), q, S.setScalar(w.scale));
          w.mesh.setMatrixAt(w.index, m);
          const iw = w.mesh.geometry.attributes.iWalk;
          iw.array[w.index * 2 + 1] = moving;
          m.compose(P.set(P.x, y + 0.03, P.z), q, S.set(0.75 * w.scale, 1, 0.75 * w.scale));
          blobs.setMatrixAt(i, m);
        });
        for (const wm of walkMeshes) {
          wm.instanceMatrix.needsUpdate = true;
          wm.geometry.attributes.iWalk.needsUpdate = true;
        }
        blobs.instanceMatrix.needsUpdate = true;
      };
      api.update(0, 1, 0);
      // lean a placed person forward (rotation about their local x axis)
      const base = {};
      const lm = new THREE.Matrix4();
      const rx = new THREE.Matrix4();
      api.lean = (id, angle) => {
        const ref = people[id];
        if (!ref) return;
        const mesh = api.meshes[ref.key];
        if (!mesh) return;
        if (!base[id]) {
          base[id] = new THREE.Matrix4();
          mesh.getMatrixAt(ref.index, base[id]);
        }
        rx.makeRotationX(angle);
        lm.multiplyMatrices(base[id], rx);
        mesh.setMatrixAt(ref.index, lm);
        mesh.instanceMatrix.needsUpdate = true;
      };
      return { group };
    },
    update() {},
    lean() {}
  };
  return api;
}
