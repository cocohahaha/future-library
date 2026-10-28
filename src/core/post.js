import * as THREE from 'three';

// Compact post pipeline (no EffectComposer):
//   scene → half-float target (MSAA)
//   bloom: soft-knee bright pass at 1/2 or 1/4 res → dual-filter down/up chain
//   composite: bloom + AgX tone mapping + gentle grade (cool shadows, warm
//   highlights) + vignette + faint xuan-paper grain → sRGB
// Everything after the scene pass runs on small targets except one
// full-screen composite, so it stays cheap on phones.

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4( position.xy, 0.0, 1.0 );
  }
`;

const BRIGHT = /* glsl */ `
  uniform sampler2D tSrc;
  uniform vec2 uTexel;
  uniform float uThreshold;
  uniform float uKnee;
  varying vec2 vUv;
  vec3 pick( vec2 uv ) { return texture2D( tSrc, uv ).rgb; }
  void main() {
    vec3 c = ( pick( vUv + uTexel * vec2( -1.0, -1.0 ) ) + pick( vUv + uTexel * vec2( 1.0, -1.0 ) )
             + pick( vUv + uTexel * vec2( -1.0, 1.0 ) ) + pick( vUv + uTexel * vec2( 1.0, 1.0 ) ) ) * 0.25;
    c = min( c, vec3( 40.0 ) );
    float br = max( c.r, max( c.g, c.b ) );
    float soft = clamp( br - uThreshold + uKnee, 0.0, 2.0 * uKnee );
    soft = soft * soft / ( 4.0 * uKnee + 1e-4 );
    float w = max( soft, br - uThreshold ) / max( br, 1e-4 );
    gl_FragColor = vec4( c * w, 1.0 );
  }
`;

const DOWN = /* glsl */ `
  uniform sampler2D tSrc;
  uniform vec2 uTexel;
  varying vec2 vUv;
  void main() {
    vec2 o = uTexel;
    vec3 c = texture2D( tSrc, vUv ).rgb * 4.0;
    c += texture2D( tSrc, vUv + vec2( -o.x, -o.y ) ).rgb;
    c += texture2D( tSrc, vUv + vec2( o.x, -o.y ) ).rgb;
    c += texture2D( tSrc, vUv + vec2( -o.x, o.y ) ).rgb;
    c += texture2D( tSrc, vUv + vec2( o.x, o.y ) ).rgb;
    gl_FragColor = vec4( c * 0.125, 1.0 );
  }
`;

const UP = /* glsl */ `
  uniform sampler2D tSrc;   // lower (smaller) level, already accumulated
  uniform sampler2D tBase;  // this level's downsample
  uniform vec2 uTexel;      // texel of tSrc
  uniform float uSpread;
  varying vec2 vUv;
  void main() {
    vec2 o = uTexel * uSpread;
    vec3 c = texture2D( tSrc, vUv + vec2( -o.x, 0.0 ) ).rgb * 2.0;
    c += texture2D( tSrc, vUv + vec2( o.x, 0.0 ) ).rgb * 2.0;
    c += texture2D( tSrc, vUv + vec2( 0.0, -o.y ) ).rgb * 2.0;
    c += texture2D( tSrc, vUv + vec2( 0.0, o.y ) ).rgb * 2.0;
    c += texture2D( tSrc, vUv + vec2( -o.x, -o.y ) ).rgb;
    c += texture2D( tSrc, vUv + vec2( o.x, -o.y ) ).rgb;
    c += texture2D( tSrc, vUv + vec2( -o.x, o.y ) ).rgb;
    c += texture2D( tSrc, vUv + vec2( o.x, o.y ) ).rgb;
    c += texture2D( tSrc, vUv ).rgb * 4.0;
    gl_FragColor = vec4( c / 16.0 + texture2D( tBase, vUv ).rgb, 1.0 );
  }
`;

const COMPOSITE = /* glsl */ `
  #include <tonemapping_pars_fragment>
  uniform sampler2D tScene;
  uniform sampler2D tBloom;
  uniform sampler2D tPaper;
  uniform float uBloom;
  uniform float uVignette;
  uniform float uGrain;
  uniform float uPaper;
  uniform float uSat;
  uniform float uContrast;
  uniform vec3 uShadowTint;
  uniform vec3 uHighTint;
  uniform float uTime;
  uniform float uFade;
  uniform vec2 uRes;
  varying vec2 vUv;
  float hash( vec2 p ) {
    vec3 p3 = fract( vec3( p.xyx ) * 0.1031 );
    p3 += dot( p3, p3.yzx + 33.33 );
    return fract( ( p3.x + p3.y ) * p3.z );
  }
  void main() {
    vec3 c = texture2D( tScene, vUv ).rgb;
    c += texture2D( tBloom, vUv ).rgb * uBloom;
    #if defined( TM_ACES )
      c = ACESFilmicToneMapping( c );
    #elif defined( TM_NEUTRAL )
      c = NeutralToneMapping( c );
    #else
      c = AgXToneMapping( c );
    #endif
    // grade
    float l = dot( c, vec3( 0.2126, 0.7152, 0.0722 ) );
    c = mix( vec3( l ), c, uSat );
    c = mix( c * uShadowTint, c * uHighTint, smoothstep( 0.05, 0.75, l ) );
    c = clamp( ( c - 0.5 ) * uContrast + 0.5, 0.0, 1.0 );
    // vignette (elliptical, soft)
    vec2 q = vUv - 0.5;
    q.x *= mix( 1.0, uRes.x / uRes.y, 0.5 );
    float v = smoothstep( 0.82, 0.28, length( q ) );
    c *= mix( 1.0 - uVignette, 1.0, v );
    // xuan paper: fibre texture + fine grain (also dithers gradients)
    float paper = texture2D( tPaper, vUv * uRes / 384.0 ).r - 0.5;
    c *= 1.0 + paper * uPaper;
    c += ( hash( vUv * uRes + fract( uTime ) * 61.0 ) - 0.5 ) * uGrain;
    // fade from paper colour (intro)
    c = mix( vec3( 0.93, 0.88, 0.8 ), c, uFade );
    gl_FragColor = vec4( c, 1.0 );
    #include <colorspace_fragment>
  }
`;

function paperTexture(size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = 'rgb(128,128,128)';
  g.fillRect(0, 0, size, size);
  let seed = 9;
  const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  // long soft fibres, drawn wrapped so the tile is seamless
  for (let i = 0; i < 900; i++) {
    const x = r() * size;
    const y = r() * size;
    const a = r() * Math.PI;
    const l = 6 + r() * 30;
    g.strokeStyle = r() < 0.5 ? 'rgba(170,170,170,0.18)' : 'rgba(80,80,80,0.14)';
    g.lineWidth = 0.6 + r() * 1.2;
    for (const ox of [-size, 0, size])
      for (const oy of [-size, 0, size]) {
        g.beginPath();
        g.moveTo(x + ox, y + oy);
        g.quadraticCurveTo(x + ox + Math.cos(a) * l * 0.5 + (r() - 0.5) * 6, y + oy + Math.sin(a) * l * 0.5, x + ox + Math.cos(a) * l, y + oy + Math.sin(a) * l);
        g.stroke();
      }
  }
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = r() < 0.5 ? 'rgba(160,160,160,0.25)' : 'rgba(96,96,96,0.25)';
    g.fillRect(r() * size, r() * size, 1, 1);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

export function createPost(renderer, tier) {
  const gl = renderer.getContext();
  const ext = renderer.extensions;
  const canHalf = ext.has('EXT_color_buffer_half_float') || ext.has('EXT_color_buffer_float');
  const type = canHalf ? THREE.HalfFloatType : THREE.UnsignedByteType;
  const maxSamples = gl.getParameter(gl.MAX_SAMPLES) || 0;
  const samples = Math.min(tier.msaa, maxSamples);

  const rtOpts = { type, depthBuffer: false, stencilBuffer: false, generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
  const sceneRT = new THREE.WebGLRenderTarget(4, 4, { type, samples, depthBuffer: true, stencilBuffer: false, generateMipmaps: false });
  const levels = tier.bloomLevels;
  const down = [];
  const up = [];
  for (let i = 0; i < levels; i++) {
    down.push(new THREE.WebGLRenderTarget(4, 4, rtOpts));
    up.push(new THREE.WebGLRenderTarget(4, 4, rtOpts));
  }

  const tri = new THREE.BufferGeometry();
  tri.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  tri.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(tri, null);
  quad.frustumCulled = false;
  const qscene = new THREE.Scene();
  qscene.add(quad);

  const mk = (frag, uniforms) =>
    new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false, toneMapped: false });
  const brightMat = mk(BRIGHT, { tSrc: { value: null }, uTexel: { value: new THREE.Vector2() }, uThreshold: { value: 1.05 }, uKnee: { value: 0.45 } });
  const downMat = mk(DOWN, { tSrc: { value: null }, uTexel: { value: new THREE.Vector2() } });
  const upMat = mk(UP, { tSrc: { value: null }, tBase: { value: null }, uTexel: { value: new THREE.Vector2() }, uSpread: { value: 1 } });
  const compMat = mk(COMPOSITE, {
    tScene: { value: sceneRT.texture },
    tBloom: { value: up[0].texture },
    tPaper: { value: paperTexture() },
    uBloom: { value: 0.32 },
    uVignette: { value: 0.32 },
    uGrain: { value: 0.011 },
    uPaper: { value: 0.07 },
    uSat: { value: 1.12 },
    uContrast: { value: 1.04 },
    uShadowTint: { value: new THREE.Vector3(0.9, 0.96, 1.08) },
    uHighTint: { value: new THREE.Vector3(1.04, 1.0, 0.95) },
    uTime: { value: 0 },
    uFade: { value: 1 },
    uRes: { value: new THREE.Vector2(1, 1) }
  });
  [brightMat, downMat, upMat, compMat].forEach((m) => (m.userData.loqPatched = true));
  let tm = 'aces';
  try {
    tm = new URLSearchParams(location.search).get('tm') || tm;
  } catch (_) {
    /* ignore */
  }
  if (tm === 'aces') compMat.defines = { TM_ACES: '' };
  else if (tm === 'neutral') compMat.defines = { TM_NEUTRAL: '' };

  const size = new THREE.Vector2();
  function setSize(w, h) {
    // w,h: drawing buffer pixels
    sceneRT.setSize(w, h);
    let lw = Math.max(1, Math.round(w / tier.bloomStart));
    let lh = Math.max(1, Math.round(h / tier.bloomStart));
    for (let i = 0; i < levels; i++) {
      down[i].setSize(lw, lh);
      up[i].setSize(lw, lh);
      lw = Math.max(1, Math.round(lw / 2));
      lh = Math.max(1, Math.round(lh / 2));
    }
    compMat.uniforms.uRes.value.set(w, h);
    size.set(w, h);
  }

  function pass(mat, target) {
    quad.material = mat;
    renderer.setRenderTarget(target);
    renderer.render(qscene, cam);
  }

  return {
    sceneRT,
    uniforms: compMat.uniforms,
    bright: brightMat.uniforms,
    setSize,
    render(scene, camera, time) {
      renderer.setRenderTarget(sceneRT);
      renderer.render(scene, camera);
      // bloom chain
      brightMat.uniforms.tSrc.value = sceneRT.texture;
      brightMat.uniforms.uTexel.value.set(1 / size.x, 1 / size.y);
      pass(brightMat, down[0]);
      for (let i = 1; i < levels; i++) {
        downMat.uniforms.tSrc.value = down[i - 1].texture;
        downMat.uniforms.uTexel.value.set(1 / down[i - 1].width, 1 / down[i - 1].height);
        pass(downMat, down[i]);
      }
      let src = down[levels - 1];
      for (let i = levels - 2; i >= 0; i--) {
        upMat.uniforms.tSrc.value = src.texture;
        upMat.uniforms.tBase.value = down[i].texture;
        upMat.uniforms.uTexel.value.set(1 / src.width, 1 / src.height);
        pass(upMat, up[i]);
        src = up[i];
      }
      compMat.uniforms.tBloom.value = levels > 1 ? up[0].texture : down[0].texture;
      compMat.uniforms.uTime.value = time;
      pass(compMat, null);
    }
  };
}
