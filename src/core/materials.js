import * as THREE from 'three';
import { PAL, SUN_DIR } from './config.js';

// Shared uniforms: one set of values restyles every material in the world
// (sky, fog, sun, lamps, wind). Colours are linear (THREE.Color.set converts).
export const U = {
  uTime: { value: 0 }, // world time (slows during the hush)
  uWindTime: { value: 0 },
  uWind: { value: new THREE.Vector2(0.75, 0.32) }, // direction × strength (world xz)
  uSunDir: { value: SUN_DIR.clone() },
  uSunColor: { value: new THREE.Color(PAL.sun) },
  uLamp: { value: 1 }, // global lamplight level
  uLampColor: { value: new THREE.Color(PAL.lamp) },
  uZenith: { value: new THREE.Color(0x7d9cbc) },
  uHorizonWarm: { value: new THREE.Color(0xffc27a) },
  uHorizonCool: { value: new THREE.Color(0xe6c3b4) },
  uBelt: { value: new THREE.Color(0x40232c) },
  uSunGlow: { value: new THREE.Color(0xff9a45) },
  uSkyDim: { value: 1 },
  uFogFalloff: { value: 0.035 },
  uFogBase: { value: -2 },
  uFogFar: { value: 0.00034 },
  uRoofUnder: { value: new THREE.Color(0x5a2e22) }
};

// ---------------------------------------------------------------- GLSL snippets
export const SKY_GLSL = /* glsl */ `
#ifndef LOQ_SKY
#define LOQ_SKY
uniform vec3 uSunDir;
uniform vec3 uZenith;
uniform vec3 uHorizonWarm;
uniform vec3 uHorizonCool;
uniform vec3 uBelt;
uniform vec3 uSunGlow;
uniform float uSkyDim;
// painterly sunset sky; also used for fog colour and water reflections so the
// land always dissolves into exactly the sky behind it
vec3 skyColor( vec3 dir ) {
  float y = clamp( dir.y, 0.0, 1.0 );
  float s = dot( dir, uSunDir );
  vec2 hd = normalize( dir.xz + vec2( 1e-5 ) );
  vec2 hs = normalize( uSunDir.xz );
  float az = dot( hd, hs ) * 0.5 + 0.5;
  vec3 horizon = mix( uHorizonCool, uHorizonWarm, pow( az, 2.4 ) );
  float t = pow( y, 0.42 );
  vec3 col = mix( horizon, uZenith, t );
  col += uBelt * smoothstep( 0.015, 0.09, y ) * smoothstep( 0.34, 0.1, y ) * pow( 1.0 - az, 1.4 );
  float sg = max( s, 0.0 );
  col += uSunGlow * ( pow( sg, 5.0 ) * 0.42 + pow( sg, 42.0 ) * 0.85 ) * ( 1.0 - 0.55 * t );
  return col * uSkyDim;
}
#endif
`;

export const NOISE_GLSL = /* glsl */ `
#ifndef LOQ_NOISE
#define LOQ_NOISE
float hash12( vec2 p ) {
  vec3 p3 = fract( vec3( p.xyx ) * 0.1031 );
  p3 += dot( p3, p3.yzx + 33.33 );
  return fract( ( p3.x + p3.y ) * p3.z );
}
float vnoise( vec2 p ) {
  vec2 i = floor( p );
  vec2 f = fract( p );
  f = f * f * ( 3.0 - 2.0 * f );
  float a = hash12( i );
  float b = hash12( i + vec2( 1.0, 0.0 ) );
  float c = hash12( i + vec2( 0.0, 1.0 ) );
  float d = hash12( i + vec2( 1.0, 1.0 ) );
  return mix( mix( a, b, f.x ), mix( c, d, f.x ), f.y );
}
#endif
`;

// ---------------------------------------------------------------- global fog override
// Height fog integrated along the view ray + distance haze, coloured by the
// sky in that direction (warm toward the sun, rose-grey away from it).
THREE.ShaderChunk.fog_pars_vertex = /* glsl */ `
#ifdef USE_FOG
  varying float vFogDepth;
  varying vec3 vFogWorld;
#endif
`;
THREE.ShaderChunk.fog_vertex = /* glsl */ `
#ifdef USE_FOG
  vFogDepth = - mvPosition.z;
  vFogWorld = ( vec4( mvPosition.xyz, 0.0 ) * viewMatrix ).xyz;
#endif
`;
THREE.ShaderChunk.fog_pars_fragment = /* glsl */ `
#ifdef USE_FOG
  uniform vec3 fogColor;
  varying float vFogDepth;
  varying vec3 vFogWorld;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear;
    uniform float fogFar;
  #endif
  uniform float uFogFalloff;
  uniform float uFogBase;
  uniform float uFogFar;
  ${SKY_GLSL}
#endif
`;
THREE.ShaderChunk.fog_fragment = /* glsl */ `
#ifdef USE_FOG
  {
    float fogDist = length( vFogWorld );
    vec3 fogDir = vFogWorld / max( fogDist, 1e-4 );
    #ifdef FOG_EXP2
      float fogD = fogDensity;
    #else
      float fogD = 0.0;
    #endif
    float fkd = uFogFalloff * vFogWorld.y;
    float fint = exp( - uFogFalloff * max( cameraPosition.y - uFogBase, -15.0 ) );
    fint *= abs( fkd ) > 1e-3 ? ( 1.0 - exp( - fkd ) ) / fkd : 1.0;
    float od = fogD * fogDist * fint + uFogFar * fogDist;
    float fogFactor = 1.0 - exp( - od );
    vec3 fcol = skyColor( normalize( vec3( fogDir.x, max( fogDir.y, 0.0 ) * 0.3, fogDir.z ) ) );
    gl_FragColor.rgb = mix( gl_FragColor.rgb, fcol * fogColor, fogFactor );
  }
#endif
`;

// ---------------------------------------------------------------- patch helpers
function inject(src, anchor, code, where = 'after') {
  if (!src.includes(anchor)) {
    if (import.meta.env && import.meta.env.DEV) console.warn('[materials] anchor not found:', anchor);
    return src;
  }
  if (where === 'replace') return src.replace(anchor, code);
  return src.replace(anchor, where === 'after' ? `${anchor}\n${code}` : `${code}\n${anchor}`);
}

// Attach shared uniforms (and optional per-material extras) + a patch body.
// Every material in the scene goes through here (main.js walks the scene and
// patches anything left over), so the fog uniforms always exist.
export function patch(material, kind, body = null, extra = {}) {
  const prev = material.onBeforeCompile;
  material.userData.loqPatched = true;
  material.onBeforeCompile = (shader, renderer) => {
    Object.assign(shader.uniforms, U, extra);
    if (body) body(shader);
    if (prev && prev !== THREE.Material.prototype.onBeforeCompile) prev(shader, renderer);
  };
  const key = `${kind}|${Object.keys(extra).join(',')}|${material.defines ? JSON.stringify(material.defines) : ''}`;
  material.customProgramCacheKey = () => key;
  return material;
}

export function ensurePatched(material) {
  if (!material || material.userData.loqPatched) return;
  if (material.isShaderMaterial) {
    material.uniforms = Object.assign(material.uniforms || {}, U);
    material.userData.loqPatched = true;
    return;
  }
  patch(material, 'auto');
}

// ---------------------------------------------------------------- shared vertex/fragment pieces
const INFO_VERT_PARS = /* glsl */ `
attribute vec4 aInfo;
varying vec4 vInfo;
#ifdef LOQ_DETAIL
varying vec3 vWorldPos;
varying vec2 vUvS;
#endif
`;
const INFO_VERT_MAIN = /* glsl */ `
vInfo = aInfo;
#ifdef LOQ_DETAIL
{
  vec4 swp = vec4( transformed, 1.0 );
  #ifdef USE_INSTANCING
    swp = instanceMatrix * swp;
  #endif
  vWorldPos = ( modelMatrix * swp ).xyz;
  vUvS = uv;
}
#endif
`;
const INFO_FRAG_PARS = /* glsl */ `
varying vec4 vInfo;
#ifdef LOQ_DETAIL
varying vec3 vWorldPos;
varying vec2 vUvS;
#endif
uniform vec3 uLampColor;
uniform float uLamp;
${NOISE_GLSL}
`;
// ambient occlusion only dims the sky/bounce light, not the sun
const AO_FRAG = /* glsl */ `
irradiance *= vInfo.w;
`;
const GLOW_FRAG = /* glsl */ `
totalEmissiveRadiance += diffuseColor.rgb * uLampColor * ( vInfo.x * uLamp );
`;

// procedural surface detail by material kind (vInfo.y), desktop tier only
const DETAIL_FRAG = /* glsl */ `
#ifdef LOQ_DETAIL
{
  float kind = vInfo.y;
  vec3 wp = vWorldPos;
  if ( kind > 0.5 && kind < 1.5 ) { // wood
    float g = vnoise( vec2( ( wp.x + wp.z ) * 2.5, wp.y * 0.9 ) ) * 0.6 + vnoise( vec2( wp.y * 2.0 + wp.x, ( wp.z - wp.x ) * 9.0 ) ) * 0.4;
    diffuseColor.rgb *= 0.86 + 0.24 * g;
  } else if ( kind > 1.5 && kind < 2.5 ) { // whitewash with weathering streaks
    float mott = vnoise( wp.xz * 0.8 + wp.y * 0.6 ) * 0.6 + vnoise( ( wp.xz + wp.y ) * 3.7 ) * 0.4;
    float streak = vnoise( vec2( ( wp.x + wp.z ) * 2.6, wp.y * 0.45 ) );
    float top = smoothstep( 0.6, 1.0, vUvS.y );
    float bot = smoothstep( 0.22, 0.0, vUvS.y );
    vec3 c = diffuseColor.rgb * ( 0.95 + 0.08 * mott );
    c *= 1.0 - top * ( 0.32 * streak * streak + 0.05 );
    c = mix( c, c * vec3( 0.74, 0.77, 0.7 ), bot * ( 0.45 + 0.55 * mott ) );
    diffuseColor.rgb = c;
  } else if ( kind > 2.5 && kind < 3.5 ) { // stone
    float n1 = vnoise( wp.xz * 1.6 + wp.y * 1.3 );
    float n2 = vnoise( ( wp.xz - wp.y ) * 9.0 );
    diffuseColor.rgb *= 0.84 + 0.2 * n1 + 0.08 * n2;
  } else if ( kind > 3.5 && kind < 4.5 ) { // lacquer
    diffuseColor.rgb *= 0.9 + 0.14 * vnoise( vec2( ( wp.x + wp.z ) * 6.0, wp.y * 1.5 ) );
  } else if ( kind > 4.5 && kind < 5.5 ) { // square floor bricks 0.6 m
    vec2 c = wp.xz / 0.6;
    vec2 f = fract( c );
    float e = min( min( f.x, 1.0 - f.x ), min( f.y, 1.0 - f.y ) );
    float aa = 1.0 - smoothstep( 0.05, 0.25, fwidth( c.x ) );
    float id = hash12( floor( c ) );
    diffuseColor.rgb *= mix( 1.0, ( 0.86 + 0.2 * id ) * mix( 0.62, 1.0, smoothstep( 0.0, 0.04, e ) ), aa );
  } else if ( kind > 5.5 && kind < 6.5 ) { // floor boards
    float r = wp.z / 0.24;
    float row = floor( r );
    float id = hash12( vec2( row, floor( wp.x / 2.7 + hash12( vec2( row, 7.0 ) ) * 3.0 ) ) );
    float e = min( fract( r ), 1.0 - fract( r ) );
    float aa = 1.0 - smoothstep( 0.05, 0.3, fwidth( r ) );
    diffuseColor.rgb *= mix( 1.0, ( 0.82 + 0.24 * id ) * mix( 0.65, 1.0, smoothstep( 0.0, 0.07, e ) ), aa );
  } else if ( kind > 9.5 && kind < 10.5 ) { // ashlar blocks (platform sides)
    vec2 c = vec2( ( wp.x + wp.z ) / 0.9, wp.y / 0.32 );
    c.x += floor( c.y ) * 0.5;
    vec2 f = fract( c );
    float e = min( min( f.x, 1.0 - f.x ) * 2.8, min( f.y, 1.0 - f.y ) );
    float aa = 1.0 - smoothstep( 0.05, 0.3, fwidth( c.y ) );
    diffuseColor.rgb *= mix( 1.0, ( 0.86 + 0.18 * hash12( floor( c ) ) ) * mix( 0.7, 1.0, smoothstep( 0.0, 0.06, e ) ), aa );
  } else if ( kind > 10.5 && kind < 11.5 ) { // ground
    float n = vnoise( wp.xz * 0.35 ) * 0.5 + vnoise( wp.xz * 2.1 ) * 0.3 + vnoise( wp.xz * 9.0 ) * 0.2;
    diffuseColor.rgb *= 0.86 + 0.26 * n;
  }
}
#endif
`;

// ---------------------------------------------------------------- solid (vertex-coloured, merged architecture)
export function makeSolid({ detail = false, roughness = 0.86, map = null, side = THREE.FrontSide } = {}) {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness, metalness: 0, map, side });
  if (detail) m.defines = { LOQ_DETAIL: '' };
  return patch(m, 'solid', (s) => {
    s.vertexShader = inject(s.vertexShader, '#include <common>', INFO_VERT_PARS);
    s.vertexShader = inject(s.vertexShader, '#include <fog_vertex>', INFO_VERT_MAIN);
    s.fragmentShader = inject(s.fragmentShader, '#include <common>', INFO_FRAG_PARS);
    s.fragmentShader = inject(s.fragmentShader, '#include <color_fragment>', DETAIL_FRAG);
    s.fragmentShader = inject(
      s.fragmentShader,
      '#include <roughnessmap_fragment>',
      `roughnessFactor *= ( vInfo.y > 3.5 && vInfo.y < 4.5 ) ? 0.55 : ( vInfo.y > 7.5 && vInfo.y < 8.5 ) ? 0.45 : 1.0;`
    );
    s.fragmentShader = inject(s.fragmentShader, '#include <emissivemap_fragment>', GLOW_FRAG);
    s.fragmentShader = inject(s.fragmentShader, '#include <lights_fragment_begin>', AO_FRAG);
  });
}

// ---------------------------------------------------------------- roof tiles
// uv = (metres along the eave, metres up the slope). Pan and roll tiles are
// drawn procedurally with a derivative-based normal perturbation; the back
// face is the painted rafter ceiling seen from under the eaves.
export function makeRoof({ detail = false } = {}) {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78, metalness: 0, side: THREE.DoubleSide });
  if (detail) m.defines = { LOQ_DETAIL: '' };
  return patch(m, 'roof', (s) => {
    s.vertexShader = inject(s.vertexShader, '#include <common>', INFO_VERT_PARS + 'varying vec2 vTileUv;');
    s.vertexShader = inject(s.vertexShader, '#include <fog_vertex>', INFO_VERT_MAIN + 'vTileUv = uv;');
    s.fragmentShader = inject(
      s.fragmentShader,
      '#include <common>',
      INFO_FRAG_PARS +
        /* glsl */ `
      varying vec2 vTileUv;
      uniform vec3 uRoofUnder;
      mat3 roofFrame( vec3 eye, vec3 N, vec2 uv ) {
        vec3 q0 = dFdx( eye ); vec3 q1 = dFdy( eye );
        vec2 st0 = dFdx( uv ); vec2 st1 = dFdy( uv );
        vec3 q1p = cross( q1, N ); vec3 q0p = cross( N, q0 );
        vec3 T = q1p * st0.x + q0p * st1.x;
        vec3 B = q1p * st0.y + q0p * st1.y;
        float det = max( dot( T, T ), dot( B, B ) );
        float sc = det == 0.0 ? 0.0 : inversesqrt( det );
        return mat3( T * sc, B * sc, N );
      }
    `
    );
    s.fragmentShader = inject(
      s.fragmentShader,
      '#include <color_fragment>',
      /* glsl */ `
      float tU = vTileUv.x / 0.27;
      float tV = vTileUv.y / 0.25;
      float tAA = 1.0 - smoothstep( 0.2, 0.6, fwidth( tU ) );
      if ( gl_FrontFacing ) {
        float fu = fract( tU );
        float fv = fract( tV );
        float roll = smoothstep( 0.58, 0.66, fu ) * ( 1.0 - smoothstep( 0.95, 1.0, fu ) );
        float id = hash12( floor( vec2( tU, tV ) ) + vec2( roll * 31.0, 0.0 ) );
        vec3 tc = diffuseColor.rgb;
        tc *= mix( 1.0, mix( 0.8, 1.04, roll ) * ( 0.9 + 0.18 * id ), tAA );
        tc *= mix( 1.0, 0.8 + 0.2 * smoothstep( 0.0, 0.2, fv ), tAA * ( 1.0 - 0.6 * roll ) );
        float lic = vnoise( vTileUv * vec2( 0.9, 0.6 ) ) * 0.7 + vnoise( vTileUv * 3.1 ) * 0.3;
        tc = mix( tc, tc * vec3( 0.95, 0.97, 0.84 ), smoothstep( 0.55, 0.85, lic ) * 0.55 );
        diffuseColor.rgb = tc;
      } else {
        float rf = fract( vTileUv.x / 0.34 );
        float rafter = smoothstep( 0.3, 0.38, rf ) * ( 1.0 - smoothstep( 0.62, 0.7, rf ) );
        diffuseColor.rgb = uRoofUnder * mix( 0.62, 1.0, rafter * tAA + ( 1.0 - tAA ) * 0.5 );
      }
    `
    );
    s.fragmentShader = inject(
      s.fragmentShader,
      '#include <normal_fragment_begin>',
      /* glsl */ `
      if ( gl_FrontFacing ) {
        mat3 tf = roofFrame( - vViewPosition, normal, vTileUv );
        float fu2 = fract( vTileUv.x / 0.27 );
        float dh = fu2 < 0.62 ? - cos( fu2 / 0.62 * 3.14159 ) * 0.8 : cos( ( fu2 - 0.62 ) / 0.38 * 3.14159 ) * 1.5;
        float aa2 = 1.0 - smoothstep( 0.2, 0.6, fwidth( vTileUv.x / 0.27 ) );
        float fv2 = fract( vTileUv.y / 0.25 );
        float step2 = ( 1.0 - smoothstep( 0.0, 0.12, fv2 ) ) * 0.9;
        normal = normalize( normal - tf[0] * dh * 0.42 * aa2 + tf[1] * step2 * aa2 );
      }
    `
    );
    s.fragmentShader = inject(s.fragmentShader, '#include <emissivemap_fragment>', GLOW_FRAG);
    s.fragmentShader = inject(s.fragmentShader, '#include <lights_fragment_begin>', AO_FRAG);
  });
}

// ---------------------------------------------------------------- foliage (wind + backlight)
// aInfo.z is the per-vertex bend weight; uFlex/uFlutter tune the species.
export function makeFoliage({ flex = 1, flutter = 0.05, translucency = 0.35, side = THREE.DoubleSide, map = null, alphaTest = 0, roughness = 0.9 } = {}) {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness, metalness: 0, side, map, alphaTest });
  const extra = { uFlex: { value: flex }, uFlutter: { value: flutter }, uTranslucency: { value: translucency } };
  return patch(
    m,
    'foliage',
    (s) => {
      s.vertexShader = inject(
        s.vertexShader,
        '#include <common>',
        INFO_VERT_PARS +
          /* glsl */ `
        uniform float uWindTime;
        uniform vec2 uWind;
        uniform float uFlex;
        uniform float uFlutter;
        uniform vec3 uSunDir;
        varying vec3 vSunView;
      `
      );
      s.vertexShader = inject(
        s.vertexShader,
        '#include <begin_vertex>',
        /* glsl */ `
        {
          #ifdef USE_INSTANCING
            vec3 iPos = instanceMatrix[3].xyz;
            float iS2 = max( dot( instanceMatrix[0].xyz, instanceMatrix[0].xyz ), 1e-4 );
          #else
            vec3 iPos = ( modelMatrix * vec4( position, 1.0 ) ).xyz * 0.15;
            float iS2 = 1.0;
          #endif
          float fl = aInfo.z * uFlex;
          float ph = uWindTime * 1.35 + dot( iPos.xz, vec2( 0.37, 0.23 ) );
          float gust = pow( 0.5 + 0.5 * sin( dot( iPos.xz, uWind ) * 0.045 - uWindTime * 0.75 ), 3.0 );
          vec2 sway = uWind * ( 0.22 + gust * 0.95 ) + vec2( sin( ph ), cos( ph * 0.77 ) ) * 0.16;
          float flut = sin( uWindTime * 6.5 + dot( position, vec3( 7.1, 5.3, 6.7 ) ) ) * uFlutter * aInfo.z;
          vec3 off = vec3( sway.x, - 0.15 * length( sway ) * fl, sway.y ) * fl + vec3( flut, flut * 0.5, - flut );
          #ifdef USE_INSTANCING
            off = ( transpose( mat3( instanceMatrix ) ) * off ) / iS2;
          #endif
          transformed += off;
        }
      `
      );
      s.vertexShader = inject(s.vertexShader, '#include <fog_vertex>', INFO_VERT_MAIN + 'vSunView = normalize( ( viewMatrix * vec4( uSunDir, 0.0 ) ).xyz );');
      s.fragmentShader = inject(
        s.fragmentShader,
        '#include <common>',
        INFO_FRAG_PARS + 'uniform vec3 uSunColor; uniform float uTranslucency; varying vec3 vSunView;'
      );
      s.fragmentShader = inject(s.fragmentShader, '#include <color_fragment>', 'diffuseColor.rgb *= mix( 0.72, 1.0, vInfo.w );');
      s.fragmentShader = inject(
        s.fragmentShader,
        '#include <emissivemap_fragment>',
        GLOW_FRAG +
          /* glsl */ `
        {
          float back = pow( max( dot( normalize( vViewPosition ), - vSunView ), 0.0 ), 3.0 );
          totalEmissiveRadiance += diffuseColor.rgb * uSunColor * back * uTranslucency * ( 0.35 + 0.65 * vInfo.w );
        }
      `
      );
      s.fragmentShader = inject(s.fragmentShader, '#include <lights_fragment_begin>', AO_FRAG);
    },
    extra
  );
}

// ---------------------------------------------------------------- lattice screens (paper behind wood)
// uv = metres across the panel; vInfo.y picks one of four atlas patterns.
// Paper glows warmly from lamps inside (uPaperGlow, per material).
export function makeLattice(atlas, { open = false, glow = 0.55 } = {}) {
  const m = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.92,
    metalness: 0,
    side: THREE.DoubleSide,
    alphaTest: open ? 0.5 : 0
  });
  const extra = {
    tLattice: { value: atlas },
    uPaperGlow: { value: glow },
    uLatWood: { value: new THREE.Color(0x4a2a1c) },
    uLatPaper: { value: new THREE.Color(0xf0e4cc) }
  };
  m.userData.paperGlow = extra.uPaperGlow;
  if (open) m.defines = { LATTICE_OPEN: '' };
  return patch(
    m,
    open ? 'latticeOpen' : 'lattice',
    (s) => {
      s.vertexShader = inject(s.vertexShader, '#include <common>', INFO_VERT_PARS + 'varying vec2 vLatUv;');
      s.vertexShader = inject(s.vertexShader, '#include <fog_vertex>', INFO_VERT_MAIN + 'vLatUv = uv;');
      s.fragmentShader = inject(
        s.fragmentShader,
        '#include <common>',
        INFO_FRAG_PARS + 'uniform sampler2D tLattice; uniform float uPaperGlow; uniform vec3 uLatWood; uniform vec3 uLatPaper; varying vec2 vLatUv; float latPaper;'
      );
      s.fragmentShader = inject(
        s.fragmentShader,
        '#include <color_fragment>',
        /* glsl */ `
        {
          float cell = floor( vInfo.y + 0.5 );
          vec2 base = vec2( mod( cell, 2.0 ), floor( cell / 2.0 ) ) * 0.5;
          vec2 luv = vLatUv / 0.62;
          vec2 auv = base + fract( luv ) * 0.5;
          vec4 L = textureGrad( tLattice, auv, dFdx( luv ) * 0.5, dFdy( luv ) * 0.5 );
          latPaper = smoothstep( 0.25, 0.75, L.r );
          vec3 woodC = uLatWood * ( 0.75 + 0.5 * L.b );
          vec3 paperC = uLatPaper * ( 0.9 + 0.2 * L.g );
          diffuseColor.rgb *= mix( woodC, paperC, latPaper );
          #ifdef LATTICE_OPEN
            diffuseColor.a = 1.0 - latPaper;
          #endif
        }
      `
      );
      s.fragmentShader = inject(
        s.fragmentShader,
        '#include <emissivemap_fragment>',
        GLOW_FRAG +
          /* glsl */ `
        #ifndef LATTICE_OPEN
          totalEmissiveRadiance += diffuseColor.rgb * uLampColor * latPaper * uPaperGlow * uLamp;
        #endif
      `
      );
      s.fragmentShader = inject(s.fragmentShader, '#include <lights_fragment_begin>', AO_FRAG);
    },
    extra
  );
}

// ---------------------------------------------------------------- instanced, colour-masked (people, books, cushions)
// aMask (0..1) decides how much of the per-instance colour a vertex takes:
// robes take it, skin and hair keep their own vertex colour.
export function makeMasked({ roughness = 0.9, map = null, walk = false } = {}) {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness, metalness: 0, map });
  if (walk) m.defines = { LOQ_WALK: '' };
  return patch(m, walk ? 'maskedWalk' : 'masked', (s) => {
    s.vertexShader = inject(
      s.vertexShader,
      '#include <common>',
      /* glsl */ `
      attribute float aMask;
      attribute vec4 aInfo;
      varying vec4 vInfo;
      uniform float uTime;
      #ifdef LOQ_WALK
        attribute vec2 iWalk; // phase, stride amount
      #endif
    `
    );
    s.vertexShader = inject(
      s.vertexShader,
      '#include <color_vertex>',
      /* glsl */ `
      #ifdef USE_INSTANCING_COLOR
        vColor.xyz = color.xyz * mix( vec3( 1.0 ), instanceColor.xyz, aMask );
      #endif
      vInfo = aInfo;
    `,
      'replace'
    );
    s.vertexShader = inject(
      s.vertexShader,
      '#include <begin_vertex>',
      /* glsl */ `
      #ifdef LOQ_WALK
        {
          float hem = 1.0 - smoothstep( 0.0, 0.75, position.y );
          float sw = sin( uTime * 5.2 + iWalk.x ) * iWalk.y;
          transformed.z += sw * hem * 0.09;
          transformed.x += cos( uTime * 5.2 + iWalk.x ) * iWalk.y * hem * 0.03;
        }
      #endif
    `
    );
    s.fragmentShader = inject(s.fragmentShader, '#include <common>', 'varying vec4 vInfo; uniform vec3 uLampColor; uniform float uLamp;');
    s.fragmentShader = inject(s.fragmentShader, '#include <emissivemap_fragment>', GLOW_FRAG);
    s.fragmentShader = inject(s.fragmentShader, '#include <lights_fragment_begin>', AO_FRAG);
  });
}

// ---------------------------------------------------------------- glowing lantern bodies (unlit, HDR, flicker)
export function makeGlow({ intensity = 3, color = PAL.lamp, vertexColors = false } = {}) {
  const m = new THREE.MeshBasicMaterial({ color, vertexColors });
  m.color.multiplyScalar(intensity);
  const extra = { uGlowK: { value: 1 } };
  m.userData.glowK = extra.uGlowK;
  return patch(
    m,
    'glow',
    (s) => {
      s.vertexShader = inject(s.vertexShader, '#include <common>', 'uniform float uTime; varying float vFlick;');
      s.vertexShader = inject(
        s.vertexShader,
        '#include <begin_vertex>',
        /* glsl */ `
        {
          #ifdef USE_INSTANCING
            vec2 seed = instanceMatrix[3].xz;
          #else
            vec2 seed = position.xz;
          #endif
          float ph = dot( seed, vec2( 1.7, 2.3 ) );
          vFlick = 0.86 + 0.08 * sin( uTime * 7.3 + ph ) + 0.06 * sin( uTime * 13.1 + ph * 1.7 );
        }
      `
      );
      s.fragmentShader = inject(s.fragmentShader, '#include <common>', 'uniform float uLamp; uniform float uGlowK; varying float vFlick;');
      s.fragmentShader = inject(s.fragmentShader, '#include <color_fragment>', 'diffuseColor.rgb *= vFlick * uLamp * uGlowK;');
    },
    extra
  );
}

// ---------------------------------------------------------------- plain helpers
export function makeBasic(params) {
  return patch(new THREE.MeshBasicMaterial(params), 'basic');
}
export function makeStandard(params) {
  return patch(new THREE.MeshStandardMaterial(params), 'std');
}
