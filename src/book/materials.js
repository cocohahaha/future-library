import { MeshStandardMaterial, MeshPhysicalMaterial, Color, Vector2, Vector3, Vector4, DoubleSide, FrontSide } from 'three';
import { PAL } from '../core/config.js';
import { W, H } from './curve.js';

// Shared light uniforms for the paper shaders (written by the stage each
// frame): the key light's direction in view space and its colour.
export const KEY = {
  uKeyDirV: { value: new Vector3(0, 1, 0) },
  uKeyCol: { value: new Color(1, 1, 1) }
};

// one blank 1×1 texture so unused sampler slots are always bound
let blank = null;
export function setBlank(tex) {
  blank = tex;
}

// ---------------------------------------------------------------- paper
// Page material: the page is a canvas texture (white paper + ink) sampled in
// page millimetres, multiplied over a cream paper colour with a fibre normal
// map. A second slot multiplies in the printed plate (a render of the
// miniature, flat on the paper). Ink is a touch glossier than paper.
// Turning leaves are double-sided: the back face shows the verso, and light
// from behind shines through the page carrying the other side's print.
export function pageMaterial({ paperNormal, leaf = false }) {
  const mat = new MeshStandardMaterial({
    color: PAL.paper,
    roughness: 0.86,
    metalness: 0,
    normalMap: paperNormal,
    normalScale: new Vector2(0.24, 0.24),
    side: leaf ? DoubleSide : FrontSide,
    shadowSide: leaf ? DoubleSide : FrontSide,
    envMapIntensity: 0.85
  });
  const u = {
    uPageA: { value: blank },
    uPageB: { value: blank },
    uPrintA: { value: blank },
    uPrintB: { value: blank },
    uRectA: { value: new Vector4(0, 0, 1, 1) },
    uRectB: { value: new Vector4(0, 0, 1, 1) },
    uPrintAlphaA: { value: 0 },
    uPrintAlphaB: { value: 0 },
    uMirrorA: { value: 0 }, // 1 when side A is a left-hand page (u runs from the gutter)
    uPageSize: { value: new Vector2(W, H) },
    uTrans: { value: leaf ? 0.32 : 0 },
    uShade: { value: 1 } // darkens a stack slightly while a leaf shadows it
  };
  mat.userData.u = u;
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u, KEY);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vPg;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\nvPg = uv;');
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        varying vec2 vPg;
        uniform sampler2D uPageA, uPageB, uPrintA, uPrintB;
        uniform vec4 uRectA, uRectB;
        uniform float uPrintAlphaA, uPrintAlphaB, uMirrorA, uTrans, uShade;
        uniform vec2 uPageSize;
        uniform vec3 uKeyDirV, uKeyCol;
        vec3 pageSide( sampler2D page, sampler2D print, vec4 rect, float alpha, vec2 mm ) {
          vec3 c = texture2D( page, mm / uPageSize ).rgb;
          vec2 q = ( mm - rect.xy ) / ( rect.zw - rect.xy );
          if ( alpha > 0.001 && q.x > 0.0 && q.x < 1.0 && q.y > 0.0 && q.y < 1.0 )
            c *= mix( vec3( 1.0 ), texture2D( print, q ).rgb, alpha );
          return c;
        }`
      )
      .replace(
        '#include <map_fragment>',
        /* glsl */ `
        // side A: recto (front face). Its uv.x runs from the gutter, so a
        // left-hand page mirrors it to read in page coordinates.
        vec2 mmA = vec2( mix( vPg.x, uPageSize.x - vPg.x, uMirrorA ), vPg.y );
        vec2 mmB = vec2( uPageSize.x - vPg.x, vPg.y );
        vec3 sideA = pageSide( uPageA, uPrintA, uRectA, uPrintAlphaA, mmA );
        #ifdef DOUBLE_SIDED
          vec3 sideB = pageSide( uPageB, uPrintB, uRectB, uPrintAlphaB, mmB );
          vec3 ink = gl_FrontFacing ? sideA : sideB;
          vec3 through = gl_FrontFacing ? sideB : sideA;
        #else
          vec3 ink = sideA;
        #endif
        diffuseColor.rgb *= ink * uShade;
        float inkAmt = 1.0 - dot( ink, vec3( 0.299, 0.587, 0.114 ) );`
      )
      .replace(
        '#include <roughnessmap_fragment>',
        '#include <roughnessmap_fragment>\nroughnessFactor = mix( roughnessFactor, 0.5, clamp( inkAmt * 0.9, 0.0, 0.6 ) );'
      )
      .replace(
        '#include <lights_fragment_end>',
        /* glsl */ `#include <lights_fragment_end>
        #ifdef DOUBLE_SIDED
          // key light passing through the sheet, filtered by the far side's ink
          float back = max( 0.0, dot( -normal, uKeyDirV ) );
          reflectedLight.directDiffuse += uTrans * uKeyCol * pow( back, 1.3 ) * diffuse * through * 0.6;
        #endif`
      );
  };
  mat.customProgramCacheKey = () => (leaf ? 'loq-leaf' : 'loq-page');
  return mat;
}

// ---------------------------------------------------------------- page edges
// Head, tail and fore-edge of the text block: a hairline per sheet (uv.y
// carries the sheet coordinate), with a hashed tone per sheet and a
// derivative fade so the lines never alias.
export function edgeMaterial(paperNormal) {
  const mat = new MeshStandardMaterial({ color: PAL.paperEdge, roughness: 0.9, metalness: 0, normalMap: paperNormal, normalScale: new Vector2(0.15, 0.15), envMapIntensity: 0.7 });
  const u = { uSheets: { value: 60 } };
  mat.userData.u = u;
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vEd;').replace('#include <uv_vertex>', '#include <uv_vertex>\nvEd = uv;');
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec2 vEd;
        uniform float uSheets;
        float edgeHash( float n ) { return fract( sin( n * 91.345 ) * 47453.5453 ); }`
      )
      .replace(
        '#include <map_fragment>',
        `{
          float n = vEd.y * uSheets;
          float w = fwidth( n );
          float line = 1.0 - smoothstep( 0.0, 0.18 + w, abs( fract( n ) - 0.5 ) * 2.0 - 0.75 );
          float fade = 1.0 - smoothstep( 0.35, 0.9, w );
          float tone = 0.94 + 0.06 * edgeHash( floor( n ) );
          diffuseColor.rgb *= mix( 1.0, tone * ( 1.0 - 0.22 * line ), fade );
          // a soft darkening toward the inside of the block
          diffuseColor.rgb *= 0.9 + 0.1 * smoothstep( 0.0, 0.25, vEd.y ) ;
        }`
      );
  };
  mat.customProgramCacheKey = () => 'loq-edge';
  return mat;
}

// ---------------------------------------------------------------- bookcloth
// Woven cloth over the boards and spine. The art texture is the cover design
// (cloth colour, foil, pasted plate); the mask texture holds R = foil,
// G = deboss depth, B = cloth (vs paper). Foil turns metallic, debossed
// lines get a normal from the mask's gradient, and a tiled weave normal adds
// the threads (faded where they would shimmer).
export function clothMaterial({ weave, art = null, mask = null, color = PAL.cloth }) {
  const mat = new MeshPhysicalMaterial({
    color,
    roughness: 0.78,
    metalness: 0,
    sheen: 1,
    sheenColor: new Color(PAL.clothSheen),
    sheenRoughness: 0.55,
    envMapIntensity: 0.9
  });
  const u = {
    uArt: { value: art || blank },
    uMask: { value: mask || blank },
    uHasArt: { value: art ? 1 : 0 },
    uWeave: { value: weave.normalMap },
    uWeaveRep: { value: 1 / weave.size[0] },
    uArtSize: { value: new Vector2(1, 1) }, // board size in mm (uv → mm)
    uFoil: { value: new Color(PAL.foil) },
    uPrint: { value: blank },
    uPrintRect: { value: new Vector4(0, 0, 0, 0) },
    uPrintAlpha: { value: 0 }
  };
  mat.userData.u = u;
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vCl;').replace('#include <uv_vertex>', '#include <uv_vertex>\nvCl = uv;');
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec2 vCl;
        uniform sampler2D uArt, uMask, uWeave, uPrint;
        uniform float uHasArt, uWeaveRep, uPrintAlpha;
        uniform vec2 uArtSize;
        uniform vec3 uFoil;
        uniform vec4 uPrintRect;
        vec4 clothMask;`
      )
      .replace(
        '#include <map_fragment>',
        `clothMask = vec4( 0.0, 0.0, 1.0, 0.0 );
        if ( uHasArt > 0.5 ) {
          clothMask = texture2D( uMask, vCl );
          vec3 art = texture2D( uArt, vCl ).rgb;
          diffuseColor.rgb = art;
          vec2 q = ( vCl - uPrintRect.xy ) / ( uPrintRect.zw - uPrintRect.xy );
          if ( uPrintAlpha > 0.0 && q.x > 0.0 && q.x < 1.0 && q.y > 0.0 && q.y < 1.0 )
            diffuseColor.rgb *= mix( vec3( 1.0 ), texture2D( uPrint, q ).rgb, uPrintAlpha );
        }`
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        roughnessFactor = mix( 0.9, roughnessFactor, clothMask.b );
        roughnessFactor = mix( roughnessFactor, 0.3, clothMask.r );`
      )
      .replace(
        '#include <metalnessmap_fragment>',
        `#include <metalnessmap_fragment>
        metalnessFactor = clothMask.r;
        diffuseColor.rgb = mix( diffuseColor.rgb, uFoil, clothMask.r );`
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
        {
          // weave in tangent space built from screen derivatives
          vec2 wuv = vCl * uArtSize * uWeaveRep;
          vec3 wn = texture2D( uWeave, wuv ).xyz * 2.0 - 1.0;
          float px = length( fwidth( wuv ) ) * 24.0; // threads per screen pixel
          float keep = ( 1.0 - smoothstep( 0.6, 1.4, px ) ) * clothMask.b * ( 1.0 - clothMask.r );
          // deboss: gradient of the mask's depth channel
          vec2 dm = vec2( 0.0 );
          if ( uHasArt > 0.5 ) {
            vec2 tx = 1.0 / vec2( textureSize( uMask, 0 ) );
            dm.x = texture2D( uMask, vCl + vec2( tx.x, 0.0 ) ).g - texture2D( uMask, vCl - vec2( tx.x, 0.0 ) ).g;
            dm.y = texture2D( uMask, vCl + vec2( 0.0, tx.y ) ).g - texture2D( uMask, vCl - vec2( 0.0, tx.y ) ).g;
          }
          vec3 q0 = dFdx( - vViewPosition );
          vec3 q1 = dFdy( - vViewPosition );
          vec2 st0 = dFdx( vCl );
          vec2 st1 = dFdy( vCl );
          vec3 N = normal;
          vec3 q1perp = cross( q1, N );
          vec3 q0perp = cross( N, q0 );
          vec3 Tn = q1perp * st0.x + q0perp * st1.x;
          vec3 Bn = q1perp * st0.y + q0perp * st1.y;
          float det = max( dot( Tn, Tn ), dot( Bn, Bn ) );
          float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
          Tn *= scale;
          Bn *= scale;
          vec3 pert = vec3( wn.xy * 0.55 * keep - dm * 2.2, 1.0 );
          normal = normalize( Tn * pert.x + Bn * pert.y + N * pert.z );
        }`
      );
  };
  mat.customProgramCacheKey = () => 'loq-cloth';
  return mat;
}

export { FrontSide, DoubleSide };
