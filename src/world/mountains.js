import * as THREE from 'three';
import { U, SKY_GLSL, NOISE_GLSL } from '../core/materials.js';
import { noise2, ridged2 } from '../core/rng.js';
import { SUN_DIR } from '../core/config.js';

// Distant ranges as ring meshes, painted like ink-wash (山水) layers: a dark
// ridgeline that dissolves downward into mist, vertical texture strokes
// (皴) near the crests, and more sky colour the further away a range sits.
// The far ranges part in a notch where the sun goes down.

const vert = /* glsl */ `
  attribute float aH;      // 0 at the misty foot, 1 at the crest
  attribute float aRidge;  // world height of this column's crest
  varying float vH;
  varying vec3 vWorld;
  varying float vAng;
  void main() {
    vH = aH;
    vec4 wp = modelMatrix * vec4( position, 1.0 );
    vWorld = wp.xyz;
    vAng = atan( position.z, position.x );
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const frag = /* glsl */ `
  ${SKY_GLSL}
  ${NOISE_GLSL}
  uniform vec3 uInk;
  uniform float uHaze;      // base haze for this layer (0 near … 1 far)
  uniform float uMist;      // how strongly the foot dissolves
  uniform float uSeed;
  uniform vec3 uSunColor;
  varying float vH;
  varying vec3 vWorld;
  varying float vAng;
  void main() {
    vec3 dir = normalize( vWorld - cameraPosition );
    vec3 sky = skyColor( normalize( vec3( dir.x, max( dir.y, 0.0 ) * 0.4, dir.z ) ) );
    // texture strokes: vertical streaks strongest just below the crest
    float strokes = vnoise( vec2( vAng * 260.0 + uSeed, vWorld.y * 0.035 ) ) * 0.6 + vnoise( vec2( vAng * 900.0 - uSeed, vWorld.y * 0.12 ) ) * 0.4;
    float crest = smoothstep( 0.55, 1.0, vH );
    vec3 ink = uInk * ( 0.82 + 0.32 * strokes * ( 0.4 + 0.6 * crest ) );
    // sun-facing slopes catch a little warm light
    vec2 out2 = normalize( vWorld.xz );
    float facing = max( dot( out2, - normalize( uSunDir.xz ) ), 0.0 );
    ink += uSunColor * 0.05 * facing * crest;
    // mist: the foot fades into the sky colour, drifting bands cut across
    float band = vnoise( vec2( vAng * 7.0 + uSeed, vWorld.y * 0.02 ) );
    float mist = pow( 1.0 - vH, 1.6 ) * uMist + band * 0.12 * ( 1.0 - crest );
    float haze = clamp( uHaze + mist, 0.0, 1.0 );
    vec3 col = mix( ink, sky, haze );
    gl_FragColor = vec4( col, 1.0 );
  }
`;

const LAYERS = [
  { r: 640, base: -40, h0: 40, amp: 70, freq: 3.5, seed: 11, ink: 0x56605f, haze: 0.38, mist: 0.75, sharp: 0.4 },
  { r: 980, base: -60, h0: 70, amp: 120, freq: 2.6, seed: 23, ink: 0x5c6870, haze: 0.52, mist: 0.6, sharp: 0.6 },
  { r: 1500, base: -100, h0: 110, amp: 250, freq: 2.0, seed: 37, ink: 0x6a7480, haze: 0.66, mist: 0.5, sharp: 1.0 },
  { r: 2300, base: -150, h0: 180, amp: 330, freq: 1.4, seed: 51, ink: 0x7c8590, haze: 0.8, mist: 0.4, sharp: 0.8 }
];

function ridgeHeight(L, a) {
  // sample noise on a circle so the ring is seamless
  const cx = Math.cos(a) * L.freq;
  const cz = Math.sin(a) * L.freq;
  const base = ridged2(cx + L.seed, cz - L.seed, 5);
  const soft = noise2(cx * 2.3 + 40 + L.seed, cz * 2.3);
  // occasional steep spires (karst / Huangshan peaks) on the far ranges
  const spire = Math.pow(Math.max(0, noise2(cx * 4.1 + L.seed * 2, cz * 4.1) - 0.55) / 0.45, 2.2) * L.sharp;
  let h = L.h0 + L.amp * (0.55 * base + 0.3 * soft + 0.75 * spire);
  // a notch toward the setting sun
  const sunA = Math.atan2(SUN_DIR.z, SUN_DIR.x);
  let da = Math.abs(((a - sunA + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
  const notch = Math.exp(-(da * da) / (2 * 0.09 * 0.09));
  h *= 1 - 0.62 * notch;
  return h;
}

export function createMountains({ low = false } = {}) {
  const group = new THREE.Group();
  group.name = 'mountains';
  const layers = low ? LAYERS.slice(0, 3) : LAYERS;
  layers.forEach((L, li) => {
    const seg = low ? 300 : 520;
    const rows = 7;
    const pos = [];
    const aH = [];
    const aR = [];
    const idx = [];
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      const crest = ridgeHeight(L, a);
      // the crest wanders in and out a little so ranges overlap naturally
      const rr = L.r * (1 + (noise2(Math.cos(a) * 3 + L.seed, Math.sin(a) * 3) - 0.5) * 0.12);
      for (let j = 0; j <= rows; j++) {
        const t = j / rows;
        const y = L.base + (crest - L.base) * Math.pow(t, 0.8);
        // lower rows lean outward slightly: the foot spreads into the plain
        const r = rr * (1 + (1 - t) * 0.06);
        pos.push(Math.cos(a) * r, y, Math.sin(a) * r);
        aH.push(t);
        aR.push(crest);
      }
    }
    for (let i = 0; i < seg; i++)
      for (let j = 0; j < rows; j++) {
        const a = i * (rows + 1) + j;
        const b = a + rows + 1;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aH', new THREE.Float32BufferAttribute(aH, 1));
    g.setAttribute('aRidge', new THREE.Float32BufferAttribute(aR, 1));
    g.setIndex(idx);
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: Object.assign({}, U, {
        uInk: { value: new THREE.Color(L.ink) },
        uHaze: { value: L.haze },
        uMist: { value: L.mist },
        uSeed: { value: L.seed }
      }),
      side: THREE.DoubleSide,
      fog: false,
      depthWrite: true
    });
    mat.userData.loqPatched = true;
    const mesh = new THREE.Mesh(g, mat);
    mesh.name = `range${li}`;
    mesh.frustumCulled = false;
    mesh.renderOrder = -50 + li * -1;
    group.add(mesh);
  });
  return group;
}
