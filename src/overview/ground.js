import { Mesh, MeshStandardMaterial, Color } from 'three';
import { plane } from '../core/geo.js';
import { patch } from './atmos.js';

// The library's surroundings as a part of the map that has not been opened
// yet: the book's paper, a faint survey grid and contour lines round the
// site, thinning out through a ragged fog-of-war edge into blank paper. The
// lit ground is blended into the background colour past that edge, so it
// has no horizon.

export const PAPER = new Color(0xe6dccb); // background and fog (linear after conversion)

export function buildGround({ reveal = 46 } = {}) {
  const mat = patch(new MeshStandardMaterial({ color: 0xf1e8d8, roughness: 0.96, metalness: 0 }), {
    key: 'ov-ground',
    uniforms: { uBg: { value: PAPER }, uReveal: { value: reveal } },
    fHead: /* glsl */ `
      uniform vec3 uBg;
      uniform float uReveal;
      float gFog;
      float gh( vec2 p ) { return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 ); }
      float gn( vec2 p ) {
        vec2 i = floor( p ); vec2 f = fract( p ); f = f * f * ( 3.0 - 2.0 * f );
        return mix( mix( gh( i ), gh( i + vec2( 1, 0 ) ), f.x ), mix( gh( i + vec2( 0, 1 ) ), gh( i + vec2( 1, 1 ) ), f.x ), f.y );
      }
      float gfbm( vec2 p ) { return gn( p ) * 0.55 + gn( p * 2.03 + 7.1 ) * 0.28 + gn( p * 4.1 - 3.3 ) * 0.17; }
      // anti-aliased line at the integers of v, w pixels wide
      float gLine( float v, float w ) { float d = abs( fract( v - 0.5 ) - 0.5 ) / max( fwidth( v ), 1e-4 ); return 1.0 - smoothstep( w - 0.5, w + 0.5, d ); }
    `,
    fColor: /* glsl */ `
      {
        vec2 p = vAtmW.xz;
        float r = length( p * vec2( 1.0, 0.86 ) - vec2( 0.0, 3.0 ) );
        // ragged edge of the explored area
        float edge = uReveal * ( 0.78 + 0.5 * gfbm( p * 0.035 ) ) ;
        float seen = 1.0 - smoothstep( edge - 14.0, edge + 6.0, r );
        // survey grid: 2 m and 10 m
        float g = gLine( p.x / 2.0, 0.5 ) * 0.25 + gLine( p.y / 2.0, 0.5 ) * 0.25;
        g = max( g, max( gLine( p.x / 10.0, 0.8 ), gLine( p.y / 10.0, 0.8 ) ) * 0.55 );
        // contours of a gentle invented terrain, flat round the building
        float h = gfbm( p * 0.018 + 3.0 ) * 24.0 + gfbm( p * 0.05 ) * 3.0;
        float flatSite = smoothstep( 22.0, 34.0, r );
        float c = gLine( h / 1.2, 0.6 ) * 0.5 + gLine( h / 6.0, 0.9 ) * 0.45;
        float ink = max( g * 0.55, c * flatSite ) * seen;
        vec3 paper = diffuseColor.rgb * ( 0.97 + 0.06 * gn( p * 1.7 ) );
        diffuseColor.rgb = mix( paper, vec3( 0.42, 0.33, 0.24 ), ink * 0.55 );
        // beyond the edge: blank paper, with a soft cloud of fog
        gFog = 1.0 - seen;
      }
    `,
    fEnd: /* glsl */ `
      gl_FragColor.rgb = mix( gl_FragColor.rgb, uBg * ( 0.98 + 0.05 * gfbm( vAtmW.xz * 0.02 ) ), gFog );
    `
  });
  const mesh = new Mesh(plane(1600, 1600), mat);
  mesh.receiveShadow = true;
  mesh.name = 'ground';
  return { mesh, material: mat };
}
