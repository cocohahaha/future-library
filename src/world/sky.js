import * as THREE from 'three';
import { U, SKY_GLSL, NOISE_GLSL } from '../core/materials.js';

// Sky dome centred on the camera: the shared sunset gradient, a low sun
// sitting in a notch of the far ridges, soft streaky clouds lit from below
// on the sun side, and a pale moon rising in the east.

const vert = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize( position );
    vec4 p = projectionMatrix * vec4( mat3( viewMatrix ) * position, 1.0 );
    gl_Position = p.xyww;
  }
`;

const frag = /* glsl */ `
  ${SKY_GLSL}
  ${NOISE_GLSL}
  uniform float uTime;
  uniform vec3 uMoonDir;
  uniform float uClouds;
  varying vec3 vDir;

  float fbm( vec2 p ) {
    float s = 0.0;
    float a = 0.5;
    for ( int i = 0; i < 4; i++ ) {
      s += vnoise( p ) * a;
      p = p * 2.07 + vec2( 3.1, -1.7 );
      a *= 0.5;
    }
    return s;
  }

  void main() {
    vec3 dir = normalize( vDir );
    vec3 col = skyColor( dir );
    float s = dot( dir, uSunDir );

    // clouds on a virtual plane, stretched into horizontal streaks
    if ( dir.y > 0.0 && uClouds > 0.0 ) {
      vec2 cp = dir.xz / ( dir.y + 0.07 );
      cp = cp * 0.55 + vec2( uTime * 0.0035, uTime * 0.0012 );
      float c = fbm( cp * vec2( 0.55, 1.9 ) );
      c += 0.35 * fbm( cp * vec2( 1.6, 5.0 ) + 9.0 ) - 0.18;
      float band = smoothstep( 0.02, 0.1, dir.y ) * ( 1.0 - smoothstep( 0.32, 0.75, dir.y ) );
      float m = smoothstep( 0.42, 0.78, c ) * band * uClouds;
      float sunSide = pow( max( s, 0.0 ), 2.0 );
      // underside lit apricot near the sun, lilac grey away from it
      vec3 lit = mix( vec3( 0.93, 0.62, 0.46 ), vec3( 1.25, 0.82, 0.48 ), sunSide ) * uSkyDim;
      vec3 shade = mix( col * vec3( 0.86, 0.82, 0.86 ), col * 0.9, sunSide );
      float rim = smoothstep( 0.55, 0.85, c );
      vec3 cc = mix( lit, shade, rim * 0.7 );
      col = mix( col, cc, m * 0.75 );
    }

    // sun disc (HDR, so bloom catches it) with a soft corona
    float disc = smoothstep( 0.99955, 0.99975, s );
    col += vec3( 9.0, 6.4, 3.8 ) * disc * uSkyDim;
    col += vec3( 1.0, 0.62, 0.3 ) * pow( max( s, 0.0 ), 900.0 ) * 1.6 * uSkyDim;

    // moon: pale, slightly mottled
    float md = dot( dir, uMoonDir );
    float moon = smoothstep( 0.99968, 0.99982, md );
    if ( moon > 0.0 ) {
      vec3 mc = vec3( 1.0, 0.97, 0.9 ) * ( 0.82 + 0.18 * vnoise( dir.xy * 900.0 ) );
      col = mix( col, mc * 1.15, moon * 0.85 );
    }

    // gentle darkening below the horizon (only seen through gaps)
    col *= 1.0 - 0.25 * smoothstep( 0.0, -0.2, dir.y );
    gl_FragColor = vec4( col, 1.0 );
  }
`;

export function createSky() {
  const moonAz = THREE.MathUtils.degToRad(78);
  const moonEl = THREE.MathUtils.degToRad(17);
  const moonDir = new THREE.Vector3(Math.sin(moonAz) * Math.cos(moonEl), Math.sin(moonEl), -Math.cos(moonAz) * Math.cos(moonEl));
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: Object.assign({}, U, { uMoonDir: { value: moonDir }, uClouds: { value: 1 } }),
    side: THREE.BackSide,
    depthWrite: false,
    fog: false
  });
  mat.userData.loqPatched = true;
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(10, 48, 24), mat);
  mesh.name = 'sky';
  mesh.frustumCulled = false;
  mesh.renderOrder = -100;
  return { mesh, material: mat };
}
