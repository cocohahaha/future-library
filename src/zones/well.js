import * as THREE from 'three';
import { createZoneBase, stone, figure, shadows } from './common.js';
import { makeBrushTexture, makeSlipTexture, rng } from '../scene/textures.js';
import { PALETTE } from './data.js';

// The Question Well: a limestone basin of still, ink-dark water. Above it hangs
// an ensō (圆相), a single brush circle left deliberately unclosed: an open
// question. Paper slips carrying refined questions rise from the water toward it.

const waterVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const waterFrag = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  uniform vec3 uDeep;
  uniform vec3 uSky;
  varying vec2 vUv;
  void main() {
    vec2 d = vUv - 0.5;
    float r = length(d) * 2.0;
    // calm, slow rings like a dropped pebble long ago
    float rip = smoothstep(0.85, 1.0, sin(r * 14.0 - uTime * 0.9)) * smoothstep(1.0, 0.3, r) * 0.07;
    float ring = exp(-pow((r - uPulse * 0.75) * 10.0, 2.0)) * (1.0 - smoothstep(0.5, 1.4, uPulse));
    // sky reflection brightens toward the rim, like a fresnel glance
    vec3 col = mix(uDeep, uSky, smoothstep(0.0, 1.0, r) * 0.42 + d.y * 0.18 + 0.08);
    col += uSky * (rip + ring * 0.45);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function ensoGeometry(radius = 2.3, sweep = Math.PI * 1.84, segments = 160) {
  const pos = [];
  const uv = [];
  const idx = [];
  const start = Math.PI * 0.42;
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const a = start - u * sweep; // brush travels clockwise
    // press hard at the start, lift and thin toward the dry tail
    const w = 0.5 * Math.min(1, u * 9) * (1 - 0.62 * Math.pow(u, 1.6)) + 0.05;
    const r = radius * (1 + Math.sin(u * 9.0) * 0.012 + u * 0.035);
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    pos.push(ca * (r - w / 2), sa * (r - w / 2), 0, ca * (r + w / 2), sa * (r + w / 2), 0);
    uv.push(u, 0, u, 1);
    if (i < segments) {
      const k = i * 2;
      idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

export function createWell(def, ctx) {
  const zone = createZoneBase(def, { hitRadius: 5, hitHeight: 9.5, lightY: 3.2, lightIntensity: 8, lightDistance: 14 });
  const g = zone.group;
  const rand = rng(5);

  // basin: one lathe profile, from the inner wall over a rounded lip to a low step
  const profile = [
    [3.72, 0.5], [3.78, 0.9], [3.9, 1.03], [4.1, 1.08], [4.3, 1.02], [4.42, 0.86],
    [4.48, 0.34], [5.5, 0.32], [5.62, 0.24], [5.64, 0.0]
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const basinMat = stone(0xdcd1bd);
  basinMat.side = THREE.DoubleSide; // lathe winding depends on profile order
  const basin = new THREE.Mesh(new THREE.LatheGeometry(profile, 72), basinMat);
  shadows(basin);
  g.add(basin);

  const waterMat = new THREE.ShaderMaterial({
    vertexShader: waterVert,
    fragmentShader: waterFrag,
    uniforms: {
      uTime: { value: 0 },
      uPulse: { value: 10 },
      uDeep: { value: new THREE.Color(0x1f2a2e) },
      uSky: { value: new THREE.Color(0xd9d6c8) }
    }
  });
  const water = new THREE.Mesh(new THREE.CircleGeometry(3.8, 72), waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.8;
  g.add(water);

  // stone stools with a few people sitting at the rim
  const stoolGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.5, 14);
  const stoolMat = stone(0xc8bba5);
  [0.4, 1.9, 3.3, 4.6].forEach((a, i) => {
    const r = 6.6;
    const stool = new THREE.Mesh(stoolGeo, stoolMat);
    stool.position.set(Math.cos(a) * r, 0.25, Math.sin(a) * r);
    shadows(stool);
    g.add(stool);
    if (i !== 2) {
      const f = figure(i);
      f.position.set(stool.position.x, 0.5, stool.position.z);
      f.rotation.y = Math.atan2(-stool.position.x, -stool.position.z);
      g.add(f);
    }
  });

  // the ensō
  const ensoMat = new THREE.MeshBasicMaterial({
    map: makeBrushTexture(),
    color: PALETTE.ink,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const enso = new THREE.Mesh(ensoGeometry(), ensoMat);
  enso.position.y = 6.9;
  g.add(enso);
  // a small cinnabar seal floating at its open gap, the artist's mark
  const seal = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.32, 0.08),
    new THREE.MeshStandardMaterial({ color: PALETTE.cinnabar, roughness: 0.7 })
  );
  seal.position.set(2.45, -1.95, 0);
  enso.add(seal);

  // rising question slips
  const slipCount = ctx.quality === 'low' ? 16 : 26;
  const slipMat = new THREE.MeshStandardMaterial({ map: makeSlipTexture(), roughness: 0.95, side: THREE.DoubleSide });
  const slips = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.32, 0.48), slipMat, slipCount);
  slips.castShadow = true;
  slips.frustumCulled = false;
  const slipState = Array.from({ length: slipCount }, (_, i) => ({
    p: i / slipCount,
    a: rand() * Math.PI * 2,
    r: 0.6 + rand() * 2.4,
    sp: 0.75 + rand() * 0.5,
    ph: rand() * 6
  }));
  g.add(slips);

  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const eul = new THREE.Euler();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();

  let spin = 0;
  zone.activate = () => {
    zone.trigger();
    waterMat.uniforms.uPulse.value = 0;
    ctx.env.pulse(0, 0, 18);
  };

  zone.update = (t, dt) => {
    zone.baseUpdate(dt);
    const e = zone.energy;
    const speed = ctx.world.speed;
    waterMat.uniforms.uTime.value = t;
    waterMat.uniforms.uPulse.value += dt;

    // the ensō turns slowly; an event gives it a deliberate half-turn
    spin += dt * speed * (0.08 + e * 1.1);
    enso.rotation.y = spin;
    enso.position.y = 6.9 + Math.sin(t * 0.4) * 0.12;

    slipState.forEach((st, i) => {
      st.p += dt * speed * 0.055 * st.sp * (1 + e * 4);
      if (st.p > 1) {
        st.p -= 1;
        st.a = rand() * Math.PI * 2;
        st.r = 0.6 + rand() * 2.4;
      }
      const k = st.p;
      const a = st.a + k * 2.4;
      const r = THREE.MathUtils.lerp(st.r, 2.3, k * k);
      p.set(Math.cos(a) * r, 0.85 + k * 6.1, Math.sin(a) * r);
      eul.set(Math.sin(t * 1.3 + st.ph) * 0.35, -a, Math.cos(t + st.ph) * 0.25);
      const grow = Math.min(1, k * 10) * (1 - THREE.MathUtils.smoothstep(k, 0.82, 1));
      s.setScalar(Math.max(0.001, grow));
      slips.setMatrixAt(i, m4.compose(p, q.setFromEuler(eul), s));
    });
    slips.instanceMatrix.needsUpdate = true;
  };

  zone.cameraView = { target: new THREE.Vector3(0, 3.8, 0), position: new THREE.Vector3(2.5, 6.5, 14.5) };
  return zone;
}
