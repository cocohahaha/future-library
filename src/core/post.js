import {
  WebGLRenderTarget,
  ShaderMaterial,
  Mesh,
  Scene,
  OrthographicCamera,
  BufferGeometry,
  Float32BufferAttribute,
  HalfFloatType,
  UnsignedByteType,
  LinearFilter,
  NearestFilter,
  DepthTexture,
  UnsignedIntType,
  Vector2,
  Vector3,
  Matrix4
} from 'three';

// Compact post pipeline (no EffectComposer, no extra dependencies):
//   scene → half-float MSAA target (+ resolved depth texture)
//   AO     : half-res screen-space ambient occlusion from depth, then a
//            depth-aware separable blur (high tier only)
//   bloom  : soft-knee bright pass → dual-filter down/up chain (only lamp
//            shades and glowing slips are bright enough to bloom)
//   final  : AO × colour + bloom → exposure → hue-preserving Neutral tone
//            curve (paper and printed ink keep their colour; only highlights
//            roll off) → vignette → dither → sRGB
// The renderer itself runs with NoToneMapping; the curve lives here.

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
  varying vec2 vUv;
  void main() {
    vec2 o = uTexel;
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

// Ambient occlusion: view-space position from depth, a normal from the
// flatter neighbour on each axis, then cosine-weighted hemisphere samples on
// a rotated golden-angle spiral, each tested against the depth buffer with a
// range check so distant occluders don't halo.
const AO = /* glsl */ `
  uniform sampler2D tDepth;
  uniform mat4 uProj;
  uniform mat4 uProjInv;
  uniform vec2 uTexel;     // full-resolution depth texel
  uniform float uRadius;   // world units (mm)
  uniform float uPower;
  varying vec2 vUv;
  vec3 viewPos( vec2 uv ) {
    float d = texture2D( tDepth, uv ).x;
    vec4 v = uProjInv * vec4( uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0 );
    return v.xyz / v.w;
  }
  float ign( vec2 p ) { return fract( 52.9829189 * fract( dot( p, vec2( 0.06711056, 0.00583715 ) ) ) ); }
  void main() {
    float d = texture2D( tDepth, vUv ).x;
    if ( d >= 1.0 ) { gl_FragColor = vec4( 1.0 ); return; }
    vec3 P = viewPos( vUv );
    vec2 t = uTexel * 1.5;
    vec3 pr = viewPos( vUv + vec2( t.x, 0.0 ) ) - P;
    vec3 pl = P - viewPos( vUv - vec2( t.x, 0.0 ) );
    vec3 pu = viewPos( vUv + vec2( 0.0, t.y ) ) - P;
    vec3 pd = P - viewPos( vUv - vec2( 0.0, t.y ) );
    vec3 dx = abs( pr.z ) < abs( pl.z ) ? pr : pl;
    vec3 dy = abs( pu.z ) < abs( pd.z ) ? pu : pd;
    vec3 N = normalize( cross( dx, dy ) );
    vec3 Tg = normalize( cross( N, abs( N.y ) < 0.95 ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 ) ) );
    vec3 Bt = cross( N, Tg );
    float rot = ign( gl_FragCoord.xy ) * 6.2831853;
    float occ = 0.0;
    const int SAMPLES = 12;
    for ( int i = 0; i < SAMPLES; i ++ ) {
      float f = ( float( i ) + 0.5 ) / float( SAMPLES );
      float a = float( i ) * 2.3999632 + rot;
      float r = sqrt( f );
      vec3 h = vec3( cos( a ) * r, sin( a ) * r, sqrt( max( 0.0, 1.0 - f ) ) );
      float sc = mix( 0.15, 1.0, f * f );
      vec3 S = P + ( Tg * h.x + Bt * h.y + N * h.z ) * uRadius * sc;
      vec4 c = uProj * vec4( S, 1.0 );
      vec2 suv = c.xy / c.w * 0.5 + 0.5;
      float sz = viewPos( suv ).z;
      float range = smoothstep( 0.0, 1.0, uRadius / max( abs( P.z - sz ), 1e-3 ) );
      occ += ( sz >= S.z + uRadius * 0.03 ? 1.0 : 0.0 ) * range;
    }
    float ao = 1.0 - occ / float( SAMPLES );
    gl_FragColor = vec4( pow( clamp( ao, 0.0, 1.0 ), uPower ), 0.0, 0.0, 1.0 );
  }
`;

const AO_BLUR = /* glsl */ `
  uniform sampler2D tAO;
  uniform sampler2D tDepth;
  uniform mat4 uProjInv;
  uniform vec2 uDir;     // texel step in the AO target
  varying vec2 vUv;
  float vz( vec2 uv ) {
    float d = texture2D( tDepth, uv ).x;
    vec4 v = uProjInv * vec4( uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0 );
    return v.z / v.w;
  }
  void main() {
    float z0 = vz( vUv );
    float sum = 0.0;
    float wsum = 0.0;
    for ( int i = -3; i <= 3; i ++ ) {
      vec2 uv = vUv + uDir * float( i );
      float w = exp( -float( i * i ) / 8.0 ) * exp( -abs( vz( uv ) - z0 ) * 0.35 );
      sum += texture2D( tAO, uv ).r * w;
      wsum += w;
    }
    gl_FragColor = vec4( sum / wsum, 0.0, 0.0, 1.0 );
  }
`;

const COMPOSITE = /* glsl */ `
  uniform sampler2D tScene;
  uniform sampler2D tBloom;
  uniform sampler2D tAO;
  uniform float uAO;
  uniform float uBloom;
  uniform float uExposure;
  uniform float uVignette;
  uniform float uFade;
  uniform vec3 uFadeColor;
  uniform vec2 uRes;
  uniform float uTime;
  varying vec2 vUv;
  // Khronos PBR Neutral, with a gentler desaturation: below ~0.76 colours
  // pass through untouched apart from a tiny toe, highlights compress
  vec3 neutral( vec3 c ) {
    const float start = 0.76;
    const float desat = 0.06;
    float x = min( c.r, min( c.g, c.b ) );
    float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
    c -= offset;
    float peak = max( c.r, max( c.g, c.b ) );
    if ( peak < start ) return c;
    float d = 1.0 - start;
    float np = 1.0 - d * d / ( peak + d - start );
    c *= np / peak;
    float g = 1.0 - 1.0 / ( desat * ( peak - np ) + 1.0 );
    return mix( c, vec3( np ), g );
  }
  float hash( vec2 p ) {
    vec3 p3 = fract( vec3( p.xyx ) * 0.1031 );
    p3 += dot( p3, p3.yzx + 33.33 );
    return fract( ( p3.x + p3.y ) * p3.z );
  }
  void main() {
    vec3 c = texture2D( tScene, vUv ).rgb;
    float ao = texture2D( tAO, vUv ).r;
    c *= mix( 1.0, ao, uAO );
    c += texture2D( tBloom, vUv ).rgb * uBloom;
    c = neutral( c * uExposure );
    // vignette: soft ellipse, a little stronger at the bottom corners
    vec2 q = vUv - 0.5;
    q.x *= mix( 1.0, uRes.x / uRes.y, 0.6 );
    c *= mix( 1.0 - uVignette, 1.0, smoothstep( 0.86, 0.22, length( q ) ) );
    c = mix( uFadeColor, c, uFade );
    // sRGB encode, then dither to hide banding in the soft gradients
    c = clamp( c, 0.0, 1.0 );
    c = mix( c * 12.92, 1.055 * pow( c, vec3( 1.0 / 2.4 ) ) - 0.055, step( 0.0031308, c ) );
    c += ( hash( vUv * uRes + fract( uTime ) * 37.0 ) - 0.5 ) / 255.0;
    gl_FragColor = vec4( c, 1.0 );
  }
`;

export function createPost(renderer, tier) {
  const gl = renderer.getContext();
  const ext = renderer.extensions;
  const canHalf = ext.has('EXT_color_buffer_half_float') || ext.has('EXT_color_buffer_float');
  const type = canHalf ? HalfFloatType : UnsignedByteType;
  const maxSamples = gl.getParameter(gl.MAX_SAMPLES) || 0;
  const samples = Math.min(tier.msaa, maxSamples);
  let aoOn = !!tier.ao;

  const rtOpts = { type, depthBuffer: false, stencilBuffer: false, generateMipmaps: false, minFilter: LinearFilter, magFilter: LinearFilter };
  const sceneRT = new WebGLRenderTarget(4, 4, { type, samples, depthBuffer: true, stencilBuffer: false, generateMipmaps: false });
  sceneRT.depthTexture = new DepthTexture(4, 4, UnsignedIntType);
  sceneRT.depthTexture.minFilter = sceneRT.depthTexture.magFilter = NearestFilter;
  const aoRT = new WebGLRenderTarget(4, 4, { type: UnsignedByteType, depthBuffer: false, generateMipmaps: false, minFilter: LinearFilter, magFilter: LinearFilter });
  const aoRT2 = aoRT.clone();
  const levels = tier.bloomLevels;
  const down = [];
  const up = [];
  for (let i = 0; i < levels; i++) {
    down.push(new WebGLRenderTarget(4, 4, rtOpts));
    up.push(new WebGLRenderTarget(4, 4, rtOpts));
  }

  const tri = new BufferGeometry();
  tri.setAttribute('position', new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  tri.setAttribute('uv', new Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
  const cam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new Mesh(tri, null);
  quad.frustumCulled = false;
  const qscene = new Scene();
  qscene.add(quad);

  const mk = (frag, uniforms) => new ShaderMaterial({ vertexShader: VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false, toneMapped: false });
  const brightMat = mk(BRIGHT, { tSrc: { value: null }, uTexel: { value: new Vector2() }, uThreshold: { value: 1.1 }, uKnee: { value: 0.5 } });
  const downMat = mk(DOWN, { tSrc: { value: null }, uTexel: { value: new Vector2() } });
  const upMat = mk(UP, { tSrc: { value: null }, tBase: { value: null }, uTexel: { value: new Vector2() } });
  const aoMat = mk(AO, {
    tDepth: { value: sceneRT.depthTexture },
    uProj: { value: new Matrix4() },
    uProjInv: { value: new Matrix4() },
    uTexel: { value: new Vector2() },
    uRadius: { value: 7 },
    uPower: { value: 1.5 }
  });
  const blurMat = mk(AO_BLUR, { tAO: { value: null }, tDepth: { value: sceneRT.depthTexture }, uProjInv: { value: aoMat.uniforms.uProjInv.value }, uDir: { value: new Vector2() } });
  const white = new WebGLRenderTarget(1, 1, { type: UnsignedByteType });
  const compMat = mk(COMPOSITE, {
    tScene: { value: sceneRT.texture },
    tBloom: { value: up[0].texture },
    tAO: { value: white.texture },
    uAO: { value: 0.85 },
    uBloom: { value: 0.22 },
    uExposure: { value: 1.0 },
    uVignette: { value: 0.26 },
    uFade: { value: 1 },
    uFadeColor: { value: new Vector3(0.94, 0.91, 0.86) },
    uRes: { value: new Vector2(1, 1) },
    uTime: { value: 0 }
  });

  const size = new Vector2();
  function setSize(w, h) {
    sceneRT.setSize(w, h);
    aoRT.setSize(Math.max(1, w >> 1), Math.max(1, h >> 1));
    aoRT2.setSize(Math.max(1, w >> 1), Math.max(1, h >> 1));
    let lw = Math.max(1, Math.round(w / tier.bloomStart));
    let lh = Math.max(1, Math.round(h / tier.bloomStart));
    for (let i = 0; i < levels; i++) {
      down[i].setSize(lw, lh);
      up[i].setSize(lw, lh);
      lw = Math.max(1, Math.round(lw / 2));
      lh = Math.max(1, Math.round(lh / 2));
    }
    compMat.uniforms.uRes.value.set(w, h);
    aoMat.uniforms.uTexel.value.set(1 / w, 1 / h);
    size.set(w, h);
  }

  function pass(mat, target) {
    quad.material = mat;
    renderer.setRenderTarget(target);
    renderer.render(qscene, cam);
  }

  // clear the white 1×1 once
  renderer.setRenderTarget(white);
  renderer.setClearColor(0xffffff, 1);
  renderer.clear();
  renderer.setRenderTarget(null);

  return {
    sceneRT,
    uniforms: compMat.uniforms,
    ao: aoMat.uniforms,
    bright: brightMat.uniforms,
    setSize,
    get aoEnabled() {
      return aoOn;
    },
    set aoEnabled(v) {
      aoOn = !!v;
    },
    render(scene, camera, time) {
      renderer.setRenderTarget(sceneRT);
      renderer.render(scene, camera);
      // ambient occlusion
      if (aoOn) {
        aoMat.uniforms.uProj.value.copy(camera.projectionMatrix);
        aoMat.uniforms.uProjInv.value.copy(camera.projectionMatrixInverse);
        pass(aoMat, aoRT);
        blurMat.uniforms.tAO.value = aoRT.texture;
        blurMat.uniforms.uDir.value.set(1 / aoRT.width, 0);
        pass(blurMat, aoRT2);
        blurMat.uniforms.tAO.value = aoRT2.texture;
        blurMat.uniforms.uDir.value.set(0, 1 / aoRT.height);
        pass(blurMat, aoRT);
        compMat.uniforms.tAO.value = aoRT.texture;
      } else compMat.uniforms.tAO.value = white.texture;
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
