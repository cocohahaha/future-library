import * as THREE from 'three';
import { createZoneBase, darkStone } from './common.js';
import { createGlyphField } from '../scene/glyphField.js';
import { makeGlowSprite } from '../scene/textures.js';
import { PALETTE } from './data.js';

const waterFrag = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float rip = pow(sin(r * 26.0 - uTime * 1.8) * 0.5 + 0.5, 6.0) * (1.0 - r);
    float ring = exp(-pow((r - uPulse * 0.8) * 9.0, 2.0)) * (1.0 - smoothstep(0.6, 1.5, uPulse));
    vec3 col = vec3(0.004, 0.006, 0.03);
    col += vec3(0.12, 0.65, 0.7) * rip * 0.35;
    col += vec3(1.0, 0.55, 0.2) * exp(-r * 3.5) * 0.9;
    col += vec3(0.5, 1.0, 0.95) * ring * 1.8;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;
const waterVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

export function createWell(def, ctx) {
  const zone = createZoneBase(def, { hitRadius: 4.2, hitHeight: 9, lightY: 3, lightIntensity: 40, lightDistance: 20 });
  const g = zone.group;

  // stepped plinth + glowing rim
  const step1 = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 5.0, 0.25, 64), darkStone());
  step1.position.y = 0.125;
  const step2 = new THREE.Mesh(new THREE.CylinderGeometry(3.7, 4.1, 0.3, 64), darkStone());
  step2.position.y = 0.4;
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(3.45, 0.09, 10, 128),
    new THREE.MeshBasicMaterial({ color: PALETTE.amber })
  );
  rim.rotation.x = -Math.PI / 2;
  rim.position.y = 0.56;
  g.add(step1, step2, rim);

  const waterMat = new THREE.ShaderMaterial({
    vertexShader: waterVert,
    fragmentShader: waterFrag,
    uniforms: { uTime: { value: 0 }, uPulse: { value: 10 } }
  });
  const water = new THREE.Mesh(new THREE.CircleGeometry(3.4, 72), waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.52;
  g.add(water);

  // armillary of nested rings — a question inside a question
  const arm = new THREE.Group();
  arm.position.y = 5.6;
  const ringSpecs = [
    { r: 1.7, c: PALETTE.amber, axis: new THREE.Vector3(1, 0.2, 0).normalize(), s: 0.35 },
    { r: 1.3, c: PALETTE.teal, axis: new THREE.Vector3(0, 1, 0.3).normalize(), s: -0.5 },
    { r: 0.95, c: PALETTE.violet, axis: new THREE.Vector3(0.3, 0, 1).normalize(), s: 0.7 }
  ];
  const armRings = ringSpecs.map((sp) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(sp.r, 0.035, 8, 96), new THREE.MeshBasicMaterial({ color: sp.c }));
    arm.add(m);
    return { m, sp };
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 1), new THREE.MeshBasicMaterial({ color: 0xffe2b0 }));
  arm.add(core);
  const coreGlow = makeGlowSprite(ctx.glow, PALETTE.amber, 5, 0.9);
  arm.add(coreGlow);
  g.add(arm);

  // drifting question cards orbiting the well
  const cards = new THREE.Group();
  const cardMat = new THREE.MeshBasicMaterial({
    color: PALETTE.amber,
    transparent: true,
    opacity: 0.32,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const cardGeo = new THREE.PlaneGeometry(0.55, 0.75);
  for (let i = 0; i < 9; i++) {
    const c = new THREE.Mesh(cardGeo, cardMat);
    c.userData = { a: (i / 9) * Math.PI * 2, y: 1.6 + (i % 3) * 0.9, r: 4.6 + (i % 2) * 0.6 };
    cards.add(c);
  }
  g.add(cards);

  // rising column of glyphs
  const column = createGlyphField({
    count: ctx.quality === 'low' ? 140 : 260,
    radius: 2.6,
    height: 11,
    size: 1.25,
    glyphRatio: 0.75,
    sway: 0.35,
    speed: 0.55,
    colors: [PALETTE.amber, PALETTE.teal, 0xfff1d6],
    atlas: ctx.atlas,
    pixelRatio: ctx.pixelRatio
  });
  column.points.position.y = 0.5;
  g.add(column.points);
  ctx.fields.push(column);

  let spin = 0;
  zone.activate = () => {
    zone.trigger();
    waterMat.uniforms.uPulse.value = 0;
    ctx.env.pulse();
  };

  zone.update = (t, dt) => {
    zone.baseUpdate(dt);
    const e = zone.energy;
    waterMat.uniforms.uTime.value = t;
    waterMat.uniforms.uPulse.value += dt;
    column.boost = 1 + e * 3.5;
    spin += dt * (1 + e * 5) * ctx.world.speed;
    for (const { m, sp } of armRings) m.setRotationFromAxisAngle(sp.axis, spin * sp.s);
    arm.position.y = 5.6 + Math.sin(t * 0.6) * 0.18;
    const breathe = 1 + Math.sin(t * 1.4) * 0.08 + e * 0.6;
    coreGlow.scale.setScalar(5 * breathe);
    core.rotation.y = t * 0.5;
    cards.children.forEach((c, i) => {
      const u = c.userData;
      const a = u.a + t * 0.05 * ctx.world.speed;
      c.position.set(Math.cos(a) * u.r, u.y + Math.sin(t * 0.7 + i) * 0.2, Math.sin(a) * u.r);
      c.rotation.y = -a + Math.PI / 2;
    });
    cardMat.opacity = 0.25 + e * 0.4;
  };

  zone.cameraView = { target: new THREE.Vector3(0, 3.6, 0), position: new THREE.Vector3(0, 8.5, 14) };
  return zone;
}
