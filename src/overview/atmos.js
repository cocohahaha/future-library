import { Vector3, Color, Mesh, Scene, ShaderMaterial, BackSide, PMREMGenerator } from 'three';
import { sphere } from '../core/geo.js';

// Golden-hour atmosphere for the city overview (world units are metres).
// One sun direction and one pair of haze colours drive everything: the sky
// dome, the aerial-perspective fog patched into every overview material and
// the environment map the glass reflects. Fog thins with altitude and is
// warmer toward the sun, and the sky's horizon band is the same colour the
// fog reaches at infinity, so far towers dissolve into the sky without a seam.

export const SUN_DIR = new Vector3(-0.72, 0.3, 0.42).normalize();

// linear RGB
export const ATM = {
  uSunDir: { value: SUN_DIR },
  uFogSun: { value: new Color(1.0, 0.66, 0.42) },
  uFogAway: { value: new Color(0.52, 0.57, 0.68) },
  uFogDensity: { value: 0.0013 },
  uFogHeight: { value: 125 },
  uTime: { value: 0 }
};

export const FOG_GLSL = /* glsl */ `
  uniform vec3 uSunDir;
  uniform vec3 uFogSun;
  uniform vec3 uFogAway;
  uniform float uFogDensity;
  uniform float uFogHeight;
  vec3 hazeColor( vec3 dir ) {
    float s = max( dot( dir, uSunDir ), 0.0 );
    return mix( uFogAway, uFogSun, pow( s, 3.0 ) );
  }
  // exponential fog whose density falls off as exp(-y / H), integrated along the ray
  float atmFogF( vec3 wp ) {
    float d = length( wp - cameraPosition );
    float h0 = max( cameraPosition.y, 0.0 );
    float h1 = max( wp.y, 0.0 );
    float dh = h1 - h0;
    float k = abs( dh ) > 0.05 ? ( exp( -h0 / uFogHeight ) - exp( -h1 / uFogHeight ) ) * uFogHeight / dh : exp( -h0 / uFogHeight );
    return clamp( 1.0 - exp( -uFogDensity * d * k ), 0.0, 1.0 );
  }
  vec3 atmFog( vec3 col, vec3 wp ) {
    return mix( col, hazeColor( normalize( wp - cameraPosition ) ), atmFogF( wp ) );
  }
`;

// Patch a stock material: aerial-perspective fog plus optional extra GLSL.
// opts: { key, additive, uniforms, vHead, vNormal (after beginnormal), vBegin (after
// begin_vertex), vEnd, fHead, fColor (after color_fragment), fRough (after
// metalnessmap_fragment), fEmissive (after emissivemap_fragment), fEnd (after
// the fog) }
export function patch(mat, opts = {}) {
  const key = opts.key || 'base';
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, ATM, opts.uniforms || {});
    let v = sh.vertexShader;
    let f = sh.fragmentShader;
    v = v.replace('#include <common>', `#include <common>\nuniform float uTime;\nvarying vec3 vAtmW;\n${opts.vHead || ''}`);
    if (opts.vNormal) v = v.replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>\n${opts.vNormal}`);
    if (opts.vBegin) v = v.replace('#include <begin_vertex>', `#include <begin_vertex>\n${opts.vBegin}`);
    v = v.replace(
      '#include <fog_vertex>',
      `#include <fog_vertex>
      {
        vec4 aw = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          aw = instanceMatrix * aw;
        #endif
        vAtmW = ( modelMatrix * aw ).xyz;
      }
      ${opts.vEnd || ''}`
    );
    f = f.replace('#include <common>', `#include <common>\nuniform float uTime;\nvarying vec3 vAtmW;\n${FOG_GLSL}\n${opts.fHead || ''}`);
    if (opts.fColor) f = f.replace('#include <color_fragment>', `#include <color_fragment>\n${opts.fColor}`);
    if (opts.fRough) f = f.replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>\n${opts.fRough}`);
    if (opts.fEmissive) f = f.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n${opts.fEmissive}`);
    // additive glows fade out with distance instead of turning into haze
    f = f.replace('#include <fog_fragment>', (opts.additive ? 'gl_FragColor.rgb *= 1.0 - atmFogF( vAtmW );' : 'gl_FragColor.rgb = atmFog( gl_FragColor.rgb, vAtmW );') + `\n${opts.fEnd || ''}`);
    sh.vertexShader = v;
    sh.fragmentShader = f;
  };
  mat.customProgramCacheKey = () => `ov:${key}`;
  return mat;
}

// ---------------------------------------------------------------- sky
const SKY_VERT = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position; // the dome is centred on the camera
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const SKY_FRAG = /* glsl */ `
  varying vec3 vDir;
  uniform float uTime;
  uniform float uSunDisc;
  uniform float uGround;
  ${FOG_GLSL}
  float h21( vec2 p ) { return fract( sin( dot( p, vec2( 41.3, 289.1 ) ) ) * 45758.5453 ); }
  float vn( vec2 p ) {
    vec2 i = floor( p ); vec2 f = fract( p ); f = f * f * ( 3.0 - 2.0 * f );
    return mix( mix( h21( i ), h21( i + vec2( 1, 0 ) ), f.x ), mix( h21( i + vec2( 0, 1 ) ), h21( i + vec2( 1, 1 ) ), f.x ), f.y );
  }
  void main() {
    vec3 d = normalize( vDir );
    float h = d.y;
    float s = max( dot( d, uSunDir ), 0.0 );
    vec3 horizon = hazeColor( d );
    vec3 zenith = vec3( 0.16, 0.27, 0.52 );
    vec3 mid = mix( vec3( 0.52, 0.55, 0.68 ), vec3( 0.95, 0.62, 0.42 ), pow( s, 2.0 ) );
    float t = clamp( h, 0.0, 1.0 );
    vec3 c = mix( horizon, mid, smoothstep( 0.0, 0.16, t ) );
    c = mix( c, zenith, smoothstep( 0.1, 0.85, t ) );
    // forward scattering around the low sun
    c += vec3( 1.0, 0.56, 0.26 ) * pow( s, 10.0 ) * 0.55;
    c += vec3( 1.0, 0.78, 0.5 ) * pow( s, 90.0 ) * 1.4;
    c += vec3( 1.0, 0.86, 0.66 ) * smoothstep( 0.99965, 0.9999, s ) * uSunDisc;
    // a few long, warm-lit cirrus streaks
    vec2 q = d.xz / max( h + 0.12, 0.05 );
    float cl = vn( q * vec2( 1.4, 5.0 ) + vec2( uTime * 0.004, 0.0 ) ) * vn( q * vec2( 3.1, 9.0 ) - 3.7 );
    cl = smoothstep( 0.32, 0.75, cl ) * smoothstep( 0.03, 0.2, h ) * smoothstep( 0.75, 0.25, h );
    c = mix( c, mix( vec3( 1.05, 0.78, 0.62 ), vec3( 1.5, 0.95, 0.6 ), pow( s, 4.0 ) ), cl * 0.45 );
    // below the horizon: the haze (or, for the reflection probe, a dark
    // warm ground, so surfaces facing down get little bounce)
    vec3 below = mix( horizon * 0.92, mix( horizon * 0.5, vec3( 0.07, 0.06, 0.05 ), smoothstep( -0.02, -0.25, h ) ), uGround );
    c = mix( c, below, smoothstep( 0.0, -0.06, h ) );
    gl_FragColor = vec4( c, 1.0 );
  }
`;

export function createSky(radius = 3600, sunDisc = 18, ground = 0) {
  const mat = new ShaderMaterial({
    vertexShader: SKY_VERT,
    fragmentShader: SKY_FRAG,
    uniforms: { ...ATM, uSunDisc: { value: sunDisc }, uGround: { value: ground } },
    side: BackSide,
    depthWrite: false,
    depthTest: false,
    fog: false
  });
  const mesh = new Mesh(sphere(radius, 48, 24), mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -10;
  mesh.name = 'sky';
  return mesh;
}

// environment for reflections: the same sky (a softer sun) over a warm ground
export function bakeEnvironment(renderer) {
  const room = new Scene();
  const sky = createSky(80, 6, 1);
  room.add(sky);
  const pm = new PMREMGenerator(renderer);
  const rt = pm.fromScene(room, 0.02, 0.1, 200);
  pm.dispose();
  sky.geometry.dispose();
  sky.material.dispose();
  return rt.texture;
}
