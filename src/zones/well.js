import * as THREE from 'three';
import { createZoneBase, view } from './common.js';
import { makeBrushTexture, makeSlipTexture, rng } from '../core/textures.js';
import { MAT } from '../core/builder.js';
import { lathe } from '../core/geom.js';
import { U, SKY_GLSL, patch } from '../core/materials.js';
import { PAL } from '../core/config.js';
import { stool, stoneLantern, incenseBurner, waterVat } from '../props/props.js';

// The Question Well: a limestone basin of still, ink-dark water at the heart
// of the academy. Above it hangs an ensō (圆相), one brush circle left
// deliberately unclosed: an open question. Paper slips carrying refined
// questions rise from the water toward it.

const waterVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  #include <fog_pars_vertex>
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4( position, 1.0 );
    vWorld = wp.xyz;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;
const waterFrag = /* glsl */ `
  ${SKY_GLSL}
  uniform float uTime;
  uniform float uPulse;
  uniform vec3 uDeep;
  varying vec2 vUv;
  varying vec3 vWorld;
  #include <fog_pars_fragment>
  void main() {
    vec2 d = vUv - 0.5;
    float r = length( d ) * 2.0;
    float rip = smoothstep( 0.86, 1.0, sin( r * 16.0 - uTime * 0.9 ) ) * smoothstep( 1.0, 0.25, r ) * 0.05;
    float ring = exp( - pow( ( r - uPulse * 0.7 ) * 9.0, 2.0 ) ) * ( 1.0 - smoothstep( 0.6, 1.5, uPulse ) );
    vec3 V = normalize( cameraPosition - vWorld );
    float fres = 0.04 + 0.96 * pow( 1.0 - max( V.y, 0.0 ), 5.0 );
    vec3 R = reflect( - V, vec3( 0.0, 1.0, 0.0 ) );
    vec3 sky = skyColor( normalize( vec3( R.x, max( R.y, 0.0 ), R.z ) ) );
    vec3 col = mix( uDeep, sky, fres * 0.85 + 0.06 );
    col += sky * ( rip + ring * 0.55 );
    gl_FragColor = vec4( col, 1.0 );
    #include <fog_fragment>
  }
`;

function ensoGeometry(radius = 2.5, sweep = Math.PI * 1.84, segments = 160) {
  const pos = [];
  const uv = [];
  const idx = [];
  const start = Math.PI * 0.42;
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const a = start - u * sweep;
    const w = 0.55 * Math.min(1, u * 9) * (1 - 0.62 * Math.pow(u, 1.6)) + 0.05;
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
  const zone = createZoneBase(def, { hit: [12, 11, 12] });
  const g = zone.group;
  const { B, crowd, kit } = ctx;
  const rand = rng(5);
  const X = def.x;
  const Z = def.z;
  zone.lamp = { x: X, y: 3.2, z: Z, intensity: 7, distance: 16 };

  // basin: one lathe profile from the inner wall over a rounded lip to a low step
  const profile = [
    [3.05, 0.45],
    [3.1, 0.85],
    [3.22, 0.98],
    [3.42, 1.03],
    [3.62, 0.97],
    [3.72, 0.82],
    [3.78, 0.32],
    [4.75, 0.3],
    [4.86, 0.22],
    [4.88, 0.0]
  ];
  B.add('solidDS', lathe(profile, 64), new THREE.Matrix4().makeTranslation(X, 0, Z), 0xd8cdb8, { kind: MAT.stone, ao: 0.95 });
  // carved band on the basin
  B.add('solid', lathe([[3.8, 0.5], [3.86, 0.52], [3.86, 0.62], [3.8, 0.64]], 64), new THREE.Matrix4().makeTranslation(X, 0, Z), 0xb9ad98, { kind: MAT.stone });

  const waterMat = new THREE.ShaderMaterial({
    vertexShader: waterVert,
    fragmentShader: waterFrag,
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uPulse: { value: 10 }, uDeep: { value: new THREE.Color(0x141c1e) } }]),
    fog: true
  });
  Object.assign(waterMat.uniforms, U);
  waterMat.userData.loqPatched = true;
  const water = new THREE.Mesh(new THREE.CircleGeometry(3.1, 64), waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(X, 0.78, Z);
  g.add(water);

  // stools around the rim, with visitors sitting on most of them
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.3;
    const r = 6.4;
    const sx = X + Math.cos(a) * r;
    const sz = Z + Math.sin(a) * r;
    stool(B, sx, 0, sz, 0xc8bba5, 0.24, 0.45);
    if (i % 3 !== 1) crowd.place('sit', sx - Math.cos(a) * 0.12, 0, sz - Math.sin(a) * 0.12, Math.atan2(-Math.cos(a), -Math.sin(a)), null, `well${i}`);
  }
  // a few standing in conversation
  crowd.place('stand', X + 5.2, 0, Z - 6.8, -2.4, null);
  crowd.place('stand', X + 6.0, 0, Z - 6.2, -2.0, null);
  crowd.place('stand', X - 7.5, 0, Z + 4.2, 1.2, null);

  // court furniture: incense burner before the library stair, vats, stone lanterns
  ctx.anchors.incense = incenseBurner(B, X, 0, -16.2);
  waterVat(B, -6.2, 0, -17.6);
  waterVat(B, 6.2, 0, -17.6);
  for (const [x, z] of [
    [-12.8, -17.5],
    [12.8, -17.5],
    [-12.8, 18.5],
    [12.8, 18.5]
  ])
    stoneLantern(kit, B, x, 0, z, 1.05);

  // the ensō
  const ensoMat = patch(
    new THREE.MeshBasicMaterial({ map: makeBrushTexture(), color: PAL.ink, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
    'enso'
  );
  const enso = new THREE.Mesh(ensoGeometry(), ensoMat);
  enso.position.set(X, 7.6, Z);
  enso.renderOrder = 3;
  g.add(enso);
  const seal = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.08), patch(new THREE.MeshStandardMaterial({ color: PAL.cinnabar, roughness: 0.7 }), 'seal'));
  seal.position.set(2.65, -2.1, 0);
  enso.add(seal);

  // rising question slips
  const slipCount = ctx.tier.name === 'low' ? 18 : 30;
  const slipMat = patch(new THREE.MeshStandardMaterial({ map: makeSlipTexture(), roughness: 0.95, side: THREE.DoubleSide }), 'slip');
  const slips = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.32, 0.48), slipMat, slipCount);
  slips.castShadow = false;
  slips.frustumCulled = false;
  const slipState = Array.from({ length: slipCount }, (_, i) => ({ p: i / slipCount, a: rand() * Math.PI * 2, r: 0.6 + rand() * 2.4, sp: 0.75 + rand() * 0.5, ph: rand() * 6 }));
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
    ctx.fx.pulse(X, Z, 20);
  };

  zone.update = (t, dt) => {
    zone.baseUpdate(dt);
    const e = zone.energy;
    const speed = ctx.world.speed;
    waterMat.uniforms.uPulse.value += dt;
    spin += dt * speed * (0.08 + e * 1.1);
    enso.rotation.y = spin;
    enso.position.y = 7.6 + Math.sin(t * 0.4) * 0.12;
    slipState.forEach((st, i) => {
      st.p += dt * speed * 0.05 * st.sp * (1 + e * 4);
      if (st.p > 1) {
        st.p -= 1;
        st.a = rand() * Math.PI * 2;
        st.r = 0.6 + rand() * 2.4;
      }
      const k = st.p;
      const a = st.a + k * 2.4;
      const r = THREE.MathUtils.lerp(st.r, 2.5, k * k);
      p.set(X + Math.cos(a) * r, 0.85 + k * 6.7, Z + Math.sin(a) * r);
      eul.set(Math.sin(t * 1.3 + st.ph) * 0.35, -a, Math.cos(t + st.ph) * 0.25);
      const grow = Math.min(1, k * 10) * (1 - THREE.MathUtils.smoothstep(k, 0.82, 1));
      s.setScalar(Math.max(0.001, grow));
      slips.setMatrixAt(i, m4.compose(p, q.setFromEuler(eul), s));
    });
    slips.instanceMatrix.needsUpdate = true;
  };

  zone.cameraView = view(X + 9, 9.5, Z + 17, X, 3.6, Z - 2);
  return zone;
}
