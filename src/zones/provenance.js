import * as THREE from 'three';
import { createZoneBase, viewFor } from './common.js';
import { PALETTE } from './data.js';

const threadVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const threadFrag = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float pulse = pow(fract(vUv.x * 1.5 - uTime * 0.35 + uSeed), 10.0);
    float a = (0.18 + pulse * 1.4) * uIntensity;
    gl_FragColor = vec4(uColor * (0.6 + pulse * 1.2), a);
    #include <colorspace_fragment>
  }
`;

export function createProvenance(def, ctx) {
  const zone = createZoneBase(def, { hitRadius: 6.5, hitHeight: 9, lightY: 5, lightIntensity: 34 });
  const g = zone.group;

  const towers = 5;
  const shelves = 6;
  const perShelf = ctx.quality === 'low' ? 7 : 10;
  const towerW = 1.9;
  const towerH = 7.2;

  const backMat = new THREE.MeshStandardMaterial({ color: 0x0b0e28, roughness: 0.7, metalness: 0.2 });
  const shelfMat = new THREE.MeshBasicMaterial({ color: PALETTE.teal, transparent: true, opacity: 0.45 });
  const bookMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const bookCount = towers * shelves * perShelf;
  const books = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), bookMat, bookCount);
  const shelfLines = new THREE.InstancedMesh(new THREE.BoxGeometry(towerW, 0.04, 0.06), shelfMat, towers * (shelves + 1));
  const bookPositions = [];

  const palette = [new THREE.Color(PALETTE.teal), new THREE.Color(PALETTE.indigo), new THREE.Color(PALETTE.amber), new THREE.Color(PALETTE.violet)];
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();
  const col = new THREE.Color();
  let bi = 0;
  let si = 0;

  for (let t = 0; t < towers; t++) {
    const x = (t - (towers - 1) / 2) * 2.5;
    const z = -(x * x) / 10; // gentle arc embracing the viewer
    const yaw = Math.atan2(x, 10) * 0.8;
    const tower = new THREE.Group();
    tower.position.set(x, 0, z);
    tower.rotation.y = -yaw;
    g.add(tower);

    const back = new THREE.Mesh(new THREE.BoxGeometry(towerW + 0.2, towerH, 0.25), backMat);
    back.position.set(0, towerH / 2, -0.4);
    tower.add(back);
    tower.updateMatrix();

    for (let s = 0; s <= shelves; s++) {
      const y = 0.35 + s * 1.1;
      m.compose(pos.set(0, y - 0.05, 0.1), q.identity(), scl.set(1, 1, 1));
      m.premultiply(tower.matrix);
      shelfLines.setMatrixAt(si++, m);
      if (s === shelves) break;

      let cx = -towerW / 2 + 0.08;
      for (let b = 0; b < perShelf; b++) {
        const w = 0.1 + Math.random() * 0.1;
        const h = 0.55 + Math.random() * 0.35;
        const lean = Math.random() < 0.12 ? (Math.random() - 0.5) * 0.4 : 0;
        cx += w / 2;
        if (cx > towerW / 2 - 0.08) break;
        pos.set(cx, y + h / 2, -0.05);
        q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), lean);
        m.compose(pos, q, scl.set(w, h, 0.55));
        m.premultiply(tower.matrix);
        books.setMatrixAt(bi, m);
        const base = palette[Math.floor(Math.random() * palette.length)];
        col.copy(base).multiplyScalar(0.12 + Math.random() * 0.4);
        books.setColorAt(bi, col);
        bookPositions.push(new THREE.Vector3(pos.x, pos.y, 0.25).applyMatrix4(tower.matrix));
        bi++;
        cx += w / 2 + 0.02;
      }
    }
  }
  books.count = bi;
  shelfLines.count = si;
  g.add(books, shelfLines);

  // lineage threads: arcs between books on different towers
  const threadCount = ctx.quality === 'low' ? 12 : 18;
  const threads = [];
  const threadColors = [PALETTE.teal, PALETTE.amber, PALETTE.violet];
  for (let i = 0; i < threadCount; i++) {
    const a = bookPositions[Math.floor(Math.random() * bookPositions.length)];
    let b = bookPositions[Math.floor(Math.random() * bookPositions.length)];
    let guard = 0;
    while (Math.abs(a.x - b.x) < 2 && guard++ < 20) b = bookPositions[Math.floor(Math.random() * bookPositions.length)];
    const mid = a.clone().lerp(b, 0.5);
    mid.y += 1.2 + Math.random() * 2.2;
    mid.z += 1.5 + Math.random() * 1.5;
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const mat = new THREE.ShaderMaterial({
      vertexShader: threadVert,
      fragmentShader: threadFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSeed: { value: Math.random() },
        uIntensity: { value: 0.4 },
        uColor: { value: new THREE.Color(threadColors[i % threadColors.length]) }
      }
    });
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.022, 4, false), mat);
    g.add(mesh);
    threads.push(mat);
  }

  zone.activate = () => zone.trigger();

  zone.update = (t, dt) => {
    zone.baseUpdate(dt);
    const e = zone.energy;
    const intensity = 0.35 + zone.focusMix * 0.25 + e * 1.6;
    for (const mat of threads) {
      mat.uniforms.uTime.value = t * (1 + e * 2.5);
      mat.uniforms.uIntensity.value = intensity;
    }
    shelfMat.opacity = 0.35 + 0.1 * Math.sin(t * 1.1) + e * 0.4;
  };

  zone.cameraView = viewFor(zone, 12, 5.5, 0.4);
  return zone;
}
