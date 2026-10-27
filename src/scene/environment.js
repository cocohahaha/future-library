import * as THREE from 'three';
import { PALETTE } from '../zones/data.js';

// The hall itself: glowing ring-grid floor, colonnade, geodesic dome, orrery rings.

const floorVert = /* glsl */ `
  varying vec2 vPos;
  void main() {
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const floorFrag = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  uniform vec3 uBg;
  varying vec2 vPos;

  float gridLine(float coord) {
    float w = fwidth(coord);
    return 1.0 - min(abs(fract(coord) - 0.5) / max(w, 1e-4), 1.0);
  }

  void main() {
    float r = length(vPos);
    float ang = atan(vPos.y, vPos.x);

    float ring = gridLine(r * 0.5);
    float fine = gridLine(r * 2.0) * 0.25 * smoothstep(4.0, 6.0, r) * (1.0 - smoothstep(9.0, 12.0, r));
    float spoke = gridLine(ang / 6.28318 * 48.0) * smoothstep(5.0, 9.0, r);

    // slow travelling wave outward from the well
    float wave = exp(-pow(r - mod(uTime * 2.4, 46.0), 2.0) * 0.35);
    // event shock-wave triggered by interactions
    float shock = exp(-pow(r - uPulse * 14.0, 2.0) * 0.6) * (1.0 - smoothstep(0.0, 3.0, uPulse));

    vec3 base = vec3(0.006, 0.008, 0.024);
    vec3 lineCol = mix(vec3(0.16, 0.75, 0.78), vec3(0.38, 0.32, 1.0), smoothstep(6.0, 30.0, r));
    vec3 col = base;
    col += lineCol * (ring * 0.32 + spoke * 0.10 + fine) * (1.0 + wave * 1.6 + shock * 3.0);
    col += vec3(1.0, 0.62, 0.26) * exp(-r * 0.32) * 0.35;
    col += vec3(0.25, 0.85, 0.8) * shock * 0.25;

    float fade = 1.0 - smoothstep(28.0, 56.0, r);
    gl_FragColor = vec4(mix(uBg, col, fade), 1.0);
    #include <colorspace_fragment>
  }
`;

export function createEnvironment({ quality }) {
  const group = new THREE.Group();
  const updaters = [];

  // ---------- Floor ----------
  const floorMat = new THREE.ShaderMaterial({
    vertexShader: floorVert,
    fragmentShader: floorFrag,
    uniforms: {
      uTime: { value: 0 },
      uPulse: { value: 10 },
      uBg: { value: new THREE.Color(PALETTE.fog) }
    }
  });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(66, 96), floorMat);
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  // ---------- Colonnade ----------
  const pillarCount = quality === 'low' ? 28 : 40;
  const ringR = 46;
  const pillarGeo = new THREE.BoxGeometry(0.9, 26, 0.9);
  pillarGeo.translate(0, 13, 0);
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x0d1030, roughness: 0.65, metalness: 0.3 });
  const pillars = new THREE.InstancedMesh(pillarGeo, pillarMat, pillarCount);

  const stripGeo = new THREE.BoxGeometry(0.08, 22, 0.08);
  stripGeo.translate(0, 12, 0);
  const stripMat = new THREE.MeshBasicMaterial({ color: PALETTE.teal, transparent: true, opacity: 0.7 });
  const strips = new THREE.InstancedMesh(stripGeo, stripMat, pillarCount);
  strips.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(pillarCount * 3), 3);

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3(1, 1, 1);
  const p = new THREE.Vector3();
  const cTeal = new THREE.Color(PALETTE.teal);
  const cIndigo = new THREE.Color(PALETTE.indigo);
  const tmpC = new THREE.Color();
  for (let i = 0; i < pillarCount; i++) {
    const a = (i / pillarCount) * Math.PI * 2;
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a);
    p.set(Math.cos(a) * ringR, 0, Math.sin(a) * ringR);
    m.compose(p, q, s);
    pillars.setMatrixAt(i, m);
    // emissive strip on the inner face
    p.set(Math.cos(a) * (ringR - 0.5), 0, Math.sin(a) * (ringR - 0.5));
    m.compose(p, q, s);
    strips.setMatrixAt(i, m);
    tmpC.copy(cTeal).lerp(cIndigo, 0.5 + 0.5 * Math.sin(a * 2));
    strips.setColorAt(i, tmpC);
  }
  group.add(pillars, strips);

  // ---------- Geodesic dome (faint linework) ----------
  const domeGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(62, quality === 'low' ? 2 : 3));
  const domeMat = new THREE.LineBasicMaterial({
    color: PALETTE.indigo,
    transparent: true,
    opacity: 0.09,
    fog: false,
    depthWrite: false
  });
  const dome = new THREE.LineSegments(domeGeo, domeMat);
  dome.position.y = -6;
  group.add(dome);

  // ---------- Orrery rings overhead ----------
  const orrery = new THREE.Group();
  orrery.position.y = 25;
  const ringDefs = [
    { r: 9, c: PALETTE.amber, tilt: 0.12, speed: 0.03 },
    { r: 13.5, c: PALETTE.teal, tilt: -0.08, speed: -0.02 },
    { r: 18, c: PALETTE.violet, tilt: 0.05, speed: 0.012 }
  ];
  const rings = ringDefs.map((d) => {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(d.r, 0.05, 6, 160),
      new THREE.MeshBasicMaterial({ color: d.c, transparent: true, opacity: 0.55, fog: false })
    );
    mesh.rotation.x = Math.PI / 2 + d.tilt;
    // a small "moon" bead on each ring
    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 12, 12),
      new THREE.MeshBasicMaterial({ color: d.c, fog: false })
    );
    bead.position.x = d.r;
    mesh.add(bead);
    orrery.add(mesh);
    return { mesh, d };
  });
  group.add(orrery);

  // ---------- Lighting ----------
  const hemi = new THREE.HemisphereLight(0x3a3a9a, 0x05060f, 0.9);
  const ambient = new THREE.AmbientLight(0x1b1f4a, 0.6);
  const moon = new THREE.DirectionalLight(0x7fa8ff, 0.55);
  moon.position.set(-12, 30, 8);
  group.add(hemi, ambient, moon);

  updaters.push((t, dt) => {
    floorMat.uniforms.uTime.value = t;
    floorMat.uniforms.uPulse.value += dt;
    for (const { mesh, d } of rings) mesh.rotation.z = t * d.speed * Math.PI * 2;
    stripMat.opacity = 0.55 + 0.2 * Math.sin(t * 0.8);
    dome.rotation.y = t * 0.004;
  });

  return {
    group,
    // send a shock-wave across the floor from the centre
    pulse() {
      floorMat.uniforms.uPulse.value = 0;
    },
    update(t, dt) {
      for (const u of updaters) u(t, dt);
    }
  };
}
