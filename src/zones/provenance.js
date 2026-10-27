import * as THREE from 'three';
import { createZoneBase, viewFor, wood, stone, shadows, figure } from './common.js';
import { rng } from '../scene/textures.js';
import { PALETTE } from './data.js';

// Cedar bookcases in a gentle arc. Books are bound in plant-dyed cloth, and
// red silk threads (红线) drape from book to book: every text tied visibly to
// its sources. Activation sends paper tags travelling along the threads.

const CLOTH = [0x8c4a32, 0x5c6a58, 0xb08a52, 0x3f4a52, 0xcbb994, 0x7a5c48, 0x9b7b3e, 0x4d3b30];

export function createProvenance(def, ctx) {
  const zone = createZoneBase(def, { hitRadius: 6.5, hitHeight: 8.5, lightY: 4.5, lightIntensity: 7 });
  const g = zone.group;
  const rand = rng(12);
  const low = ctx.quality === 'low';

  const towers = 5;
  const shelves = 5;
  const perShelf = low ? 9 : 13;
  const towerW = 2.0;
  const shelfGap = 1.12;
  const towerH = 0.3 + shelves * shelfGap + 0.25;

  // low stone dais
  const dais = new THREE.Mesh(new THREE.BoxGeometry(13.5, 0.22, 4.4), stone(0xcdbfa8));
  dais.position.set(0, 0.11, -1.0);
  shadows(dais);
  g.add(dais);

  const cedar = wood(PALETTE.cedar);
  const cedarDark = wood(0x5e3c28);
  const bookMat = new THREE.MeshStandardMaterial({ roughness: 0.85 });
  const books = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), bookMat, towers * shelves * perShelf);
  books.castShadow = true;
  books.receiveShadow = true;
  const bookPositions = [];

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();
  const col = new THREE.Color();
  const zAxis = new THREE.Vector3(0, 0, 1);
  let bi = 0;

  const postGeo = new THREE.BoxGeometry(0.14, towerH, 0.6);
  const boardGeo = new THREE.BoxGeometry(towerW, 0.06, 0.6);
  const backGeo = new THREE.BoxGeometry(towerW, towerH, 0.06);
  const capGeo = new THREE.BoxGeometry(towerW + 0.5, 0.12, 0.85);

  for (let t = 0; t < towers; t++) {
    const x = (t - (towers - 1) / 2) * 2.55;
    const z = -(x * x) / 12 - 1.2; // gentle arc embracing the viewer
    const tower = new THREE.Group();
    tower.position.set(x, 0.22, z);
    tower.rotation.y = -Math.atan2(x, 12) * 0.9;
    g.add(tower);

    const back = new THREE.Mesh(backGeo, cedarDark);
    back.position.set(0, towerH / 2, -0.27);
    const left = new THREE.Mesh(postGeo, cedar);
    left.position.set(-towerW / 2 - 0.07, towerH / 2, 0);
    const right = left.clone();
    right.position.x = towerW / 2 + 0.07;
    // a slightly flared cap, like a small eave
    const cap = new THREE.Mesh(capGeo, cedarDark);
    cap.position.y = towerH + 0.06;
    tower.add(back, left, right, cap);
    for (let s = 0; s <= shelves; s++) {
      const b = new THREE.Mesh(boardGeo, cedar);
      b.position.y = 0.25 + s * shelfGap;
      tower.add(b);
    }
    shadows(tower);
    tower.updateMatrix();
    const towerMatrix = tower.matrix;

    for (let s = 0; s < shelves; s++) {
      const y = 0.28 + s * shelfGap;
      let cx = -towerW / 2 + 0.06;
      for (let b = 0; b < perShelf; b++) {
        const w = 0.08 + rand() * 0.08;
        const h = 0.6 + rand() * 0.32;
        const lean = rand() < 0.1 ? (rand() - 0.5) * 0.35 : 0;
        cx += w / 2;
        if (cx > towerW / 2 - 0.06) break;
        pos.set(cx, y + h / 2, rand() * 0.05);
        q.setFromAxisAngle(zAxis, lean);
        m.compose(pos, q, scl.set(w, h, 0.42 + rand() * 0.08));
        m.premultiply(towerMatrix);
        books.setMatrixAt(bi, m);
        col.setHex(CLOTH[Math.floor(rand() * CLOTH.length)]).multiplyScalar(0.8 + rand() * 0.35);
        books.setColorAt(bi, col);
        bookPositions.push(new THREE.Vector3(cx, y + h * 0.7, 0.24).applyMatrix4(towerMatrix));
        bi++;
        cx += w / 2 + 0.012;
      }
    }
  }
  books.count = bi;
  g.add(books);

  // red threads: drooping silk between books on different cases
  const threadCount = low ? 8 : 11;
  const threadMat = new THREE.MeshStandardMaterial({
    color: PALETTE.cinnabar,
    roughness: 0.6,
    emissive: PALETTE.cinnabar,
    emissiveIntensity: 0.15
  });
  const curves = [];
  const pick = () => bookPositions[Math.floor(rand() * bookPositions.length)];
  for (let i = 0; i < threadCount; i++) {
    const a = pick();
    let b = pick();
    let guard = 0;
    // neighbouring cases only, so each thread reads as one clean swag
    while ((Math.abs(a.x - b.x) < 2 || Math.abs(a.x - b.x) > 5.5) && guard++ < 40) b = pick();
    const mid = a.clone().lerp(b, 0.5);
    mid.y = Math.max(1.0, Math.min(a.y, b.y) - 0.35 - rand() * 0.5); // sag under its own weight
    mid.z += 0.5 + rand() * 0.5;
    const curve = new THREE.CatmullRomCurve3([a, a.clone().lerp(mid, 0.5).setZ(mid.z * 0.8 + a.z * 0.2), mid, b.clone().lerp(mid, 0.5).setZ(mid.z * 0.8 + b.z * 0.2), b]);
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, low ? 28 : 44, 0.014, 5, false), threadMat);
    mesh.castShadow = true;
    g.add(mesh);
    curves.push(curve);
  }

  // paper tags that travel along the threads during an event
  const tagGeo = new THREE.BoxGeometry(0.14, 0.2, 0.01);
  const tagMat = new THREE.MeshStandardMaterial({ color: PALETTE.paper, roughness: 0.9 });
  const tags = curves.map((c, i) => {
    const tag = new THREE.Mesh(tagGeo, tagMat);
    tag.userData = { curve: c, u: rand(), dir: i % 2 ? 1 : -1 };
    tag.castShadow = true;
    g.add(tag);
    return tag;
  });

  // two stewards reading the threads
  [-2.2, 3.1].forEach((x, i) => {
    const f = figure(i + 2);
    f.position.set(x, 0.22, 1.9 + i * 0.4);
    f.scale.setScalar(1.15);
    f.rotation.y = Math.PI + (i ? 0.3 : -0.2);
    g.add(f);
  });

  const tmp = new THREE.Vector3();
  zone.activate = () => zone.trigger();

  zone.update = (t, dt) => {
    zone.baseUpdate(dt);
    const e = zone.energy;
    threadMat.emissiveIntensity = 0.12 + zone.focusMix * 0.12 + e * 0.9;
    for (const tag of tags) {
      const u = tag.userData;
      // tags drift slowly at rest and race along when the lineage is lit
      u.u = (u.u + dt * ctx.world.speed * (0.03 + e * 0.35) * u.dir + 1) % 1;
      u.curve.getPointAt(u.u, tag.position);
      u.curve.getPointAt(Math.min(0.999, u.u + 0.01), tmp);
      tag.position.y -= 0.12;
      tag.rotation.y = Math.atan2(tmp.x - tag.position.x, tmp.z - tag.position.z) + Math.PI / 2;
      tag.rotation.z = Math.sin(t * 2 + u.u * 20) * 0.15;
    }
  };

  zone.cameraView = viewFor(zone, 12, 5.2, 0.35, 2.9);
  return zone;
}
