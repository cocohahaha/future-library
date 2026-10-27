import * as THREE from 'three';
import { PALETTE } from '../zones/data.js';
import { rng, makePavingTexture, makeMountainTexture, makeInkRingTexture } from './textures.js';

// The courtyard itself: a late-afternoon sky, ink-wash mountains in the haze,
// stone paving, a whitewashed wall pierced by moon gates, a few old trees,
// one low warm sun with soft shadows, ink ripples and distant birds.

export const SUN_DIR = new THREE.Vector3(-0.72, 0.44, -0.54).normalize();

const skyVert = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = p.xyww; // pin to the far plane
  }
`;
const skyFrag = /* glsl */ `
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uSunCol;
  uniform vec3 uSunDir;
  uniform float uHush;
  varying vec3 vDir;
  void main() {
    float h = clamp(vDir.y, 0.0, 1.0);
    vec3 col = mix(uHorizon, uZenith, pow(h, 0.55));
    float s = max(dot(vDir, uSunDir), 0.0);
    col += uSunCol * (pow(s, 6.0) * 0.22 + pow(s, 60.0) * 0.35);
    // the sun itself: a soft, paper-pale disc
    col = mix(col, vec3(1.0, 0.95, 0.85), smoothstep(0.9985, 0.9993, s));
    col = mix(col, col * vec3(0.96, 0.93, 0.92), uHush);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function createEnvironment({ quality }) {
  const group = new THREE.Group();
  const updaters = [];
  const rand = rng(42);
  const low = quality === 'low';

  // ---------- Sky ----------
  const skyMat = new THREE.ShaderMaterial({
    vertexShader: skyVert,
    fragmentShader: skyFrag,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uZenith: { value: new THREE.Color(PALETTE.sky) },
      uHorizon: { value: new THREE.Color(PALETTE.haze) },
      uSunCol: { value: new THREE.Color(0xffc07a) },
      uSunDir: { value: SUN_DIR.clone() },
      uHush: { value: 0 }
    }
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(150, 32, 16), skyMat);
  sky.renderOrder = -10;
  sky.frustumCulled = false;
  group.add(sky);

  // ---------- Ink-wash mountains (three layers receding into haze) ----------
  const haze = new THREE.Color(PALETTE.haze);
  const layers = [
    { r: 135, h: 46, y: -8, seed: 3, peaks: 4, tone: 0x8e938f, mix: 0.55 },
    { r: 112, h: 36, y: -7, seed: 8, peaks: 6, tone: 0x5d6260, mix: 0.4 },
    { r: 92, h: 22, y: -6, seed: 15, peaks: 9, tone: 0x3d403e, mix: 0.3 }
  ];
  layers.forEach((L, i) => {
    const tex = makeMountainTexture({ seed: L.seed, peaks: L.peaks, w: low ? 1024 : 2048, h: low ? 256 : 512 });
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      color: new THREE.Color(L.tone).lerp(haze, L.mix),
      transparent: true,
      depthWrite: false,
      fog: false,
      side: THREE.BackSide
    });
    const m = new THREE.Mesh(new THREE.CylinderGeometry(L.r, L.r, L.h, 96, 1, true), mat);
    m.position.y = L.y + L.h / 2;
    m.rotation.y = i * 1.7;
    m.renderOrder = -9 + i;
    group.add(m);
  });

  // ---------- Ground: paving inside the wall, dry meadow outside ----------
  const WALL_R = 46;
  const paving = new THREE.Mesh(
    new THREE.CircleGeometry(WALL_R + 1, 96),
    new THREE.MeshStandardMaterial({ map: makePavingTexture(low ? 512 : 1024), roughness: 0.95, metalness: 0 })
  );
  paving.rotation.x = -Math.PI / 2;
  paving.receiveShadow = true;
  const meadow = new THREE.Mesh(
    new THREE.RingGeometry(WALL_R, 150, 64, 1),
    new THREE.MeshLambertMaterial({ color: 0xb9ab86 })
  );
  meadow.rotation.x = -Math.PI / 2;
  meadow.position.y = -0.02;
  group.add(paving, meadow);

  // ---------- Courtyard wall with moon gates (月洞门) and leak windows ----------
  const N = low ? 18 : 22;
  const chord = 2 * WALL_R * Math.tan(Math.PI / N) + 0.05;
  const H = 6.2;
  const panelShape = (gate) => {
    const s = new THREE.Shape();
    s.moveTo(-chord / 2, 0);
    s.lineTo(chord / 2, 0);
    s.lineTo(chord / 2, H);
    s.lineTo(-chord / 2, H);
    s.closePath();
    const hole = new THREE.Path();
    if (gate) hole.absarc(0, 2.75, 2.45, 0, Math.PI * 2, true);
    else hole.absarc(0, 3.4, 0.95, 0, Math.PI * 2, true);
    s.holes.push(hole);
    return s;
  };
  const extrude = { depth: 0.7, bevelEnabled: false, curveSegments: low ? 20 : 32 };
  const gateGeo = new THREE.ExtrudeGeometry(panelShape(true), extrude);
  const winGeo = new THREE.ExtrudeGeometry(panelShape(false), extrude);
  gateGeo.translate(0, 0, -0.35);
  winGeo.translate(0, 0, -0.35);
  const plaster = new THREE.MeshStandardMaterial({ color: PALETTE.plaster, roughness: 1 });
  const gates = new THREE.InstancedMesh(gateGeo, plaster, Math.ceil(N / 2));
  const wins = new THREE.InstancedMesh(winGeo, plaster, Math.ceil(N / 2));
  const capGeo = new THREE.BoxGeometry(chord + 0.2, 0.32, 1.25);
  capGeo.translate(0, H + 0.16, 0);
  const caps = new THREE.InstancedMesh(capGeo, new THREE.MeshStandardMaterial({ color: PALETTE.tile, roughness: 0.8 }), N);
  const plinthGeo = new THREE.BoxGeometry(chord, 0.45, 0.85);
  plinthGeo.translate(0, 0.225, 0);
  const plinths = new THREE.InstancedMesh(plinthGeo, new THREE.MeshStandardMaterial({ color: 0x9c9384, roughness: 1 }), N);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const one = new THREE.Vector3(1, 1, 1);
  let gi = 0;
  let wi = 0;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    q.setFromAxisAngle(up, -a + Math.PI / 2);
    m4.compose(new THREE.Vector3(Math.cos(a) * WALL_R, 0, Math.sin(a) * WALL_R), q, one);
    if (i % 2 === 0) gates.setMatrixAt(gi++, m4);
    else wins.setMatrixAt(wi++, m4);
    caps.setMatrixAt(i, m4);
    plinths.setMatrixAt(i, m4);
  }
  gates.count = gi;
  wins.count = wi;
  group.add(gates, wins, caps, plinths);

  // ---------- Trees: two ginkgos and a pine ----------
  const bark = new THREE.MeshStandardMaterial({ color: 0x4a3a2e, roughness: 1 });
  const ginkgoMat = new THREE.MeshStandardMaterial({ color: PALETTE.ginkgo, roughness: 0.95 });
  const pineMat = new THREE.MeshStandardMaterial({ color: 0x55634a, roughness: 0.95 });
  // lumpy, smooth-shaded foliage clouds (a sphere pushed around by noise)
  const blobGeo = new THREE.IcosahedronGeometry(1, low ? 2 : 3);
  {
    const bp = blobGeo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < bp.count; i++) {
      v.fromBufferAttribute(bp, i);
      const n = 1 + 0.12 * Math.sin(v.x * 5.1 + v.y * 2.3) * Math.cos(v.z * 4.7 - v.y * 3.1) + 0.06 * Math.sin(v.y * 9 + v.x * 7);
      bp.setXYZ(i, v.x * n, v.y * n, v.z * n);
    }
    blobGeo.computeVertexNormals();
  }
  function tree(x, z, kind, scale = 1) {
    const t = new THREE.Group();
    t.position.set(x, 0, z);
    t.scale.setScalar(scale);
    const lean = (rand() - 0.5) * 1.6;
    const pts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(lean * 0.3, 2.5, 0.2),
      new THREE.Vector3(lean * 0.9, 5, -0.3),
      new THREE.Vector3(lean * 1.2, 7.4, 0)
    ];
    const trunk = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.32, 7), bark);
    trunk.castShadow = true;
    t.add(trunk);
    const top = pts[3];
    const blobs = kind === 'pine' ? 7 : 12;
    for (let i = 0; i < blobs; i++) {
      const b = new THREE.Mesh(blobGeo, kind === 'pine' ? pineMat : ginkgoMat);
      if (kind === 'pine') {
        // flat cloud-pads stepping up the trunk, the classic garden pine
        const a = i * 2.4;
        const r = i === blobs - 1 ? 0 : 1.6 + rand() * 1.2;
        b.position.set(top.x * (0.5 + i / blobs) + Math.cos(a) * r, 3.4 + i * 0.75, Math.sin(a) * r);
        b.scale.set(1.7 + rand() * 0.6, 0.38, 1.3 + rand() * 0.5);
        b.rotation.set(0, rand() * 3, 0);
      } else {
        const a = rand() * Math.PI * 2;
        const r = rand() * 1.9;
        b.position.set(top.x + Math.cos(a) * r, top.y - 1.2 + rand() * 2.8, top.z + Math.sin(a) * r);
        b.scale.setScalar(0.9 + rand() * 0.8);
        b.scale.y *= 0.85;
        b.rotation.set(rand() * 3, rand() * 3, rand() * 3);
      }
      b.castShadow = true;
      t.add(b);
    }
    group.add(t);
    return t;
  }
  tree(31, 2, 'ginkgo', 1.05);
  tree(-31, -3, 'ginkgo', 0.95);
  tree(4, -31, 'pine', 1.1);
  if (!low) tree(-21, -24, 'ginkgo', 0.75);

  // ---------- Light: one low warm sun + sky/ground bounce ----------
  const hemi = new THREE.HemisphereLight(0xc3cfd6, 0x8a7458, 1.25);
  const sun = new THREE.DirectionalLight(PALETTE.sun, 3.1);
  sun.position.copy(SUN_DIR).multiplyScalar(60);
  sun.castShadow = true;
  sun.shadow.mapSize.set(low ? 1024 : 2048, low ? 1024 : 2048);
  const sc = sun.shadow.camera;
  sc.left = sc.bottom = -36;
  sc.right = sc.top = 36;
  sc.near = 10;
  sc.far = 120;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.04;
  sun.shadow.radius = 4;
  group.add(hemi, sun, sun.target);

  // ---------- Ink ripples spreading across the paving ----------
  const ringTex = makeInkRingTexture();
  const ripples = Array.from({ length: 4 }, () => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: ringTex, color: PALETTE.ink, transparent: true, opacity: 0, depthWrite: false })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.03;
    m.visible = false;
    m.userData = { age: 0, dur: 3.2, maxR: 14 };
    group.add(m);
    return m;
  });
  let nextRipple = 0;

  // ---------- Birds: a few ink ticks circling high above ----------
  const birdCount = low ? 5 : 8;
  const birdPos = new Float32Array(birdCount * 4 * 3);
  const birdGeo = new THREE.BufferGeometry();
  birdGeo.setAttribute('position', new THREE.BufferAttribute(birdPos, 3));
  const birds = new THREE.LineSegments(
    birdGeo,
    new THREE.LineBasicMaterial({ color: 0x3a3634, transparent: true, opacity: 0.7, fog: false })
  );
  birds.frustumCulled = false;
  const birdState = Array.from({ length: birdCount }, (_, i) => ({
    r: 34 + rand() * 18,
    y: 30 + rand() * 10,
    a: rand() * Math.PI * 2,
    s: 0.03 + rand() * 0.02,
    flap: rand() * 6,
    size: 0.5 + rand() * 0.3
  }));
  group.add(birds);

  // shared accumulated motion so `world.speed` (hush) slows birds smoothly
  let flow = 0;
  updaters.push((t, dt, hush) => {
    flow += dt;
    skyMat.uniforms.uHush.value = hush;
    sun.intensity = 3.1 - hush * 0.7;

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
      r.material.opacity = 0.32 * (1 - k) * Math.min(1, k * 8);
    }

    birdState.forEach((b, i) => {
      const a = b.a + flow * b.s;
      const cx = Math.cos(a) * b.r;
      const cz = Math.sin(a) * b.r;
      const y = b.y + Math.sin(flow * 0.2 + i) * 1.5;
      // direction of travel (tangent) and its perpendicular for wings
      const tx = -Math.sin(a);
      const tz = Math.cos(a);
      const wx = -tz * b.size;
      const wz = tx * b.size;
      const f = Math.sin(flow * 5 + b.flap) * 0.35 * b.size;
      const o = i * 12;
      birdPos.set([cx + wx, y + f, cz + wz, cx, y, cz, cx, y, cz, cx - wx, y + f, cz - wz], o);
    });
    birdGeo.attributes.position.needsUpdate = true;
  });

  return {
    group,
    sun,
    // send a soft ink ripple across the paving from (x, z)
    pulse(x = 0, z = 0, maxR = 14) {
      const r = ripples[nextRipple++ % ripples.length];
      r.position.x = x;
      r.position.z = z;
      r.userData.age = 0;
      r.userData.maxR = maxR;
      r.scale.set(1, 1, 1);
      r.visible = true;
    },
    update(t, dt, hush) {
      for (const u of updaters) u(t, dt, hush);
    }
  };
}
