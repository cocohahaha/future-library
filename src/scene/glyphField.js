import * as THREE from 'three';

// A cylinder of rising, swaying glyphs and dust motes as GL points.
// Vertical motion is driven by an accumulated `flow` value (not raw time), so
// speed can be changed live (boosts, hush) without particles jumping.

const vertexShader = /* glsl */ `
  uniform float uFlow;
  uniform float uTime;
  uniform float uHeight;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uSway;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  attribute float aSeed;
  attribute float aGlyph;
  attribute float aScale;
  varying float vGlyph;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec3 p = position;
    p.y = mod(p.y + uFlow * (0.45 + aSeed), uHeight);
    float ph = uTime * 0.25 + aSeed * 6.2831;
    p.x += sin(ph) * uSway;
    p.z += cos(ph * 0.8) * uSway;

    float edge = smoothstep(0.0, 0.12 * uHeight, p.y) * (1.0 - smoothstep(0.7 * uHeight, uHeight, p.y));
    vAlpha = edge * (0.55 + 0.45 * sin(uTime * 1.3 + aSeed * 40.0));
    vGlyph = aGlyph;
    vColor = aSeed < 0.5 ? uColorA : (aSeed < 0.82 ? uColorB : uColorC);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * aScale * uPixelRatio * (24.0 / -mv.z), 0.0, 64.0 * uPixelRatio);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform float uOpacity;
  varying float vGlyph;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float a;
    float gi = floor(vGlyph + 0.5);
    if (gi < 0.0) {
      float d = length(gl_PointCoord - 0.5);
      a = smoothstep(0.5, 0.0, d);
      a *= a;
    } else {
      float col = mod(gi, 4.0);
      float row = floor(gi / 4.0);
      vec2 uv = (vec2(col, 3.0 - row) + vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y)) / 4.0;
      a = texture2D(uAtlas, uv).a;
    }
    float alpha = a * vAlpha * uOpacity;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor * (0.8 + a * 0.6), alpha);
    #include <colorspace_fragment>
  }
`;

export function createGlyphField({
  count = 600,
  radius = 20,
  innerRadius = 0,
  height = 14,
  size = 1,
  glyphRatio = 0.3,
  sway = 0.6,
  speed = 0.4,
  opacity = 1,
  colors = [0x3fd6c8, 0x5b4bff, 0xffb454],
  atlas,
  pixelRatio = 1
}) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const glyph = new Float32Array(count);
  const scale = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    // sqrt for even area distribution across the annulus
    const r = Math.sqrt(innerRadius ** 2 + Math.random() * (radius ** 2 - innerRadius ** 2));
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = Math.random() * height;
    pos[i * 3 + 2] = Math.sin(a) * r;
    seed[i] = Math.random();
    const isGlyph = Math.random() < glyphRatio;
    glyph[i] = isGlyph ? Math.floor(Math.random() * 16) : -1;
    scale[i] = isGlyph ? 0.8 + Math.random() * 0.8 : 0.25 + Math.random() * 0.45;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  geo.setAttribute('aGlyph', new THREE.BufferAttribute(glyph, 1));
  geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
  // Bounds account for animation so frustum culling never pops the field.
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, height / 2, 0), Math.hypot(radius + sway, height / 2));

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uFlow: { value: Math.random() * 100 },
      uTime: { value: 0 },
      uHeight: { value: height },
      uSize: { value: size },
      uPixelRatio: { value: pixelRatio },
      uSway: { value: sway },
      uOpacity: { value: opacity },
      uAtlas: { value: atlas },
      uColorA: { value: new THREE.Color(colors[0]) },
      uColorB: { value: new THREE.Color(colors[1]) },
      uColorC: { value: new THREE.Color(colors[2]) }
    }
  });

  const points = new THREE.Points(geo, material);
  points.renderOrder = 2;

  return {
    points,
    material,
    speed,
    boost: 1,
    update(t, dt, globalSpeed = 1) {
      material.uniforms.uTime.value = t;
      material.uniforms.uFlow.value += dt * this.speed * this.boost * globalSpeed;
    },
    setPixelRatio(pr) {
      material.uniforms.uPixelRatio.value = pr;
    }
  };
}
