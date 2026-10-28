import {
  Group,
  Mesh,
  MeshStandardMaterial,
  InstancedMesh,
  InstancedBufferAttribute,
  Object3D,
  Vector3,
  Color,
  ShaderMaterial,
  PerspectiveCamera,
  WebGLRenderTarget,
  HalfFloatType,
  Matrix4,
  Plane,
  Vector2,
  Vector4,
  Float32BufferAttribute
} from 'three';
import { roundBox, box, cylinder, sphere, merge, xf, tint, plane, prism, roundRectPoly, smoothPath, Mesher } from '../core/geo.js';
import { patch, ATM, FOG_GLSL } from './atmos.js';

// The city around the library, in metres. A street grid (96 × 84 m pitch,
// 18 m streets) is drawn procedurally on one ground plane; the towers on its
// blocks are a single instanced box whose facades (glass, punched stone,
// fins, balcony bands) and lit windows are drawn in its fragment shader from
// local metres, so a 200 m tower costs 12 triangles. Heights stay low around
// the civic plaza (the library is the landmark, and the low sun has to reach
// it) and rise into a skyline behind it.

export const GRID = { px: 96, pz: 84, ox: 48, oz: 42, street: 18 };
export const SITE = { x0: -135, z0: -117, x1: 135, z1: 117 };
const SUN_AZ = Math.atan2(-0.72, 0.42); // azimuth of the sun (atan2(x, z))

function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

// ---------------------------------------------------------------- materials
function towerMaterial() {
  return patch(new MeshStandardMaterial({ color: 0xffffff, roughness: 0.7, metalness: 0.0, envMapIntensity: 2.2 }), {
    key: 'towers',
    vHead: /* glsl */ `
      attribute vec4 aStyle;
      attribute vec3 aFlat;
      attribute vec3 aFace;
      varying vec4 vStyle;
      varying vec3 vLoc;
      varying vec3 vNl;
    `,
    // the facade grid is laid out on the undeformed form (aFlat / aFace), so
    // it twists and tapers with the tower
    vEnd: /* glsl */ `
      vec3 sz = vec3( length( instanceMatrix[ 0 ].xyz ), length( instanceMatrix[ 1 ].xyz ), length( instanceMatrix[ 2 ].xyz ) );
      vLoc = aFlat * sz;
      vNl = aFace;
      vStyle = aStyle;
    `,
    fHead: /* glsl */ `
      varying vec4 vStyle;
      varying vec3 vLoc;
      varying vec3 vNl;
      float tGlass; float tLit; vec3 tWarm; float tRough; float tGreen;
      float th( vec3 p ) { p = fract( p * vec3( 0.1031, 0.103, 0.0973 ) ); p += dot( p, p.yxz + 33.33 ); return fract( ( p.x + p.y ) * p.z ); }
      float band( float x, float a, float b, float aa ) { return smoothstep( a - aa, a + aa, x ) * ( 1.0 - smoothstep( b - aa, b + aa, x ) ); }
    `,
    // styles: 0 curtain wall, 1 punched, 2 fins, 3 balcony bands, 4 vertical
    // farm (planted floors under grow lights); aStyle.w = 1: a roof garden
    fColor: /* glsl */ `
      {
        float style = vStyle.x;
        float seed = vStyle.y;
        float wall = 1.0 - step( 0.5, abs( vNl.y ) );
        float u = abs( vNl.x ) > 0.5 ? vLoc.z : vLoc.x;
        float fh = style < 0.5 ? 3.9 : style < 1.5 ? 3.2 : style < 2.5 ? 4.2 : style < 3.5 ? 3.4 : 4.4;
        float bw = style < 0.5 ? 1.8 : style < 1.5 ? 3.6 : style < 2.5 ? 1.3 : style < 3.5 ? 2.4 : 3.0;
        vec2 g = vec2( u / bw, vAtmW.y / fh );
        vec2 cell = floor( g );
        vec2 f = fract( g );
        vec2 aa = fwidth( g ) * 1.2;
        float m;
        if ( style < 0.5 ) m = band( f.y, 0.24, 0.98, aa.y ) * band( f.x, 0.05, 0.97, aa.x );
        else if ( style < 1.5 ) m = band( f.y, 0.3, 0.86, aa.y ) * band( f.x, 0.2, 0.8, aa.x );
        else if ( style < 2.5 ) m = band( f.x, 0.3, 0.96, aa.x ) * band( f.y, 0.04, 0.98, aa.y );
        else if ( style < 3.5 ) m = band( f.y, 0.36, 0.94, aa.y ) * band( f.x, 0.02, 0.99, aa.x );
        else m = band( f.y, 0.4, 0.97, aa.y ) * band( f.x, 0.03, 0.97, aa.x );
        // far away the grid is sub-pixel: use its average coverage instead
        float cover = style < 0.5 ? 0.68 : style < 1.5 ? 0.34 : style < 2.5 ? 0.62 : style < 3.5 ? 0.56 : 0.55;
        m = mix( m, cover, smoothstep( 0.25, 0.7, max( aa.x, aa.y ) ) );
        // ground floor: shopfronts
        float shop = 1.0 - smoothstep( 5.2, 5.6, vAtmW.y );
        m = mix( m, band( f.x, 0.03, 0.97, aa.x ) * 0.95, shop );
        tGlass = m * wall;
        float r = th( vec3( cell, seed * 97.0 ) );
        tLit = step( r, vStyle.z ) * tGlass;
        tLit = max( tLit, shop * tGlass * step( 0.25, r ) );
        float k = th( vec3( cell.yx, seed * 31.0 + 4.0 ) );
        tWarm = mix( vec3( 1.0, 0.58, 0.26 ), vec3( 1.0, 0.82, 0.6 ), k ) * ( 0.5 + 1.1 * k * k );
        vec3 wallC = diffuseColor.rgb;
        // glass, tinted per tower: cool blue-grey, sea green, bronze or
        // champagne (the warm ones turn gold in the low sun); a little
        // lighter toward the top, where it holds more sky
        float gk = th( vec3( seed * 113.0, 7.0, 3.0 ) );
        vec3 glassT = gk < 0.34 ? vec3( 0.22, 0.31, 0.4 ) : gk < 0.56 ? vec3( 0.16, 0.3, 0.3 ) : gk < 0.8 ? vec3( 0.42, 0.3, 0.19 ) : vec3( 0.52, 0.45, 0.34 );
        glassT *= 0.85 + 0.3 * smoothstep( 20.0, 220.0, vAtmW.y );
        vec3 glassC = mix( glassT, wallC * 0.6 + vec3( 0.04, 0.06, 0.08 ), style < 0.5 ? 0.12 : 0.25 );
        tRough = 0.05 + 0.16 * th( vec3( seed * 71.0, 1.0, 9.0 ) );
        // leafy noise for the farms' planted floors and the roof gardens
        float leaf = th( vec3( floor( vAtmW.xz / 1.4 ), floor( vAtmW.y / 1.4 ) ) );
        vec3 greenC = mix( vec3( 0.12, 0.2, 0.06 ), vec3( 0.32, 0.4, 0.13 ), leaf );
        tGreen = 0.0;
        if ( style > 3.5 ) {
          wallC = mix( greenC, wallC, band( f.y, 0.33, 0.4, aa.y ) );
          tGreen = 1.0 - tGlass;
          // magenta-white grow lights on most floors
          tWarm = mix( vec3( 1.0, 0.45, 0.75 ), vec3( 1.0, 0.85, 0.75 ), step( 0.6, k ) ) * 0.9;
          tLit = tGlass * step( 0.3, th( vec3( cell.y, seed * 17.0, 2.0 ) ) );
        }
        vec3 roofC = wallC * 0.55;
        if ( vStyle.w > 0.5 ) {
          // planted roof with paths
          vec2 rp = abs( fract( vAtmW.xz / 7.0 ) - 0.5 );
          float path = step( 0.44, max( rp.x, rp.y ) );
          roofC = mix( greenC * 1.15, vec3( 0.42, 0.39, 0.34 ), path );
          if ( wall < 0.5 ) tGreen = 1.0 - path;
        }
        diffuseColor.rgb = wall > 0.5 ? mix( wallC, glassC, tGlass ) : roofC;
      }
    `,
    fRough: /* glsl */ `
      roughnessFactor = mix( mix( 0.72, 0.95, tGreen ), tRough, tGlass );
      metalnessFactor = mix( 0.0, 0.8, tGlass );
    `,
    // windows lit from inside, and a broad warm glare where the glass turns
    // the low sun toward the camera
    fEmissive: /* glsl */ `
      totalEmissiveRadiance += tWarm * tLit * 0.9;
      {
        vec3 sv = normalize( ( viewMatrix * vec4( uSunDir, 0.0 ) ).xyz );
        vec3 rv = reflect( normalize( -vViewPosition ), normal );
        float gl = pow( max( dot( rv, sv ), 0.0 ), 10.0 ) * step( 0.0, dot( normal, sv ) );
        totalEmissiveRadiance += vec3( 1.0, 0.6, 0.3 ) * gl * tGlass * 1.3;
      }
    `
  });
}

// ---------------------------------------------------------------- tower forms
// Unit towers (plan in [-0.5, 0.5]², height 0..1), each one instanced draw.
// A plan polygon is lofted through rows [y, scale, twist, offset x, offset z];
// several tiers make a stepped tower. aFlat / aFace hold the facade
// coordinates before any twist, so the window grid winds round with the form;
// `arc` lays it out along the perimeter instead (round plans).
const SQ = [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]];
const chamfer = (c) => [[-0.5 + c, -0.5], [0.5 - c, -0.5], [0.5, -0.5 + c], [0.5, 0.5 - c], [0.5 - c, 0.5], [-0.5 + c, 0.5], [-0.5, 0.5 - c], [-0.5, -0.5 + c]];
const circle = (n) => Array.from({ length: n }, (_, i) => [-Math.sin((i / n) * Math.PI * 2) * 0.5, Math.cos((i / n) * Math.PI * 2) * 0.5]);

function towerForm(poly, tiers, { smooth = false, arc = false } = {}) {
  const m = new Mesher();
  const flat = [];
  const face = [];
  const n = poly.length;
  const per = [0];
  for (let i = 0; i < n; i++) per.push(per[i] + Math.hypot(poly[(i + 1) % n][0] - poly[i][0], poly[(i + 1) % n][1] - poly[i][1]));
  const put = (p, nrm, fl, fc) => {
    flat.push(...fl);
    face.push(...fc);
    return m.v(p[0], p[1], p[2], nrm[0], nrm[1], nrm[2], 0, 0);
  };
  for (const rows of tiers) {
    const at = ([y, s, a, ox = 0, oz = 0], x, z) => {
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      return { p: [ox + (x * ca - z * sa) * s, y, oz + (x * sa + z * ca) * s], f: [ox + x * s, y, oz + z * s], ca, sa };
    };
    for (let e = 0; e < n; e++) {
      const c0 = poly[e];
      const c1 = poly[(e + 1) % n];
      let ex = c1[1] - c0[1];
      let ez = -(c1[0] - c0[0]);
      const l = Math.hypot(ex, ez);
      ex /= l;
      ez /= l;
      const base = m.p.length / 3;
      for (const row of rows) {
        for (const [c, k] of [[c0, e], [c1, e + 1]]) {
          const q = at(row, c[0], c[1]);
          let nx = ex;
          let nz = ez;
          if (smooth) {
            const lc = Math.hypot(c[0], c[1]) || 1;
            nx = c[0] / lc;
            nz = c[1] / lc;
          }
          const nr = [nx * q.ca - nz * q.sa, 0, nx * q.sa + nz * q.ca];
          if (arc) put(q.p, nr, [per[k], row[0], 0], [0, 0, 1]);
          else put(q.p, nr, q.f, [ex, 0, ez]);
        }
      }
      for (let i = 0; i < rows.length - 1; i++) {
        const a = base + i * 2;
        m.quad(a, a + 2, a + 3, a + 1);
      }
    }
    // the tier's roof
    const top = rows[rows.length - 1];
    const c = put([top[3] || 0, top[0], top[4] || 0], [0, 1, 0], [top[3] || 0, top[0], top[4] || 0], [0, 1, 0]);
    const ring = poly.map(([x, z]) => {
      const q = at(top, x, z);
      return put(q.p, [0, 1, 0], q.f, [0, 1, 0]);
    });
    for (let i = 0; i < n; i++) m.tri(c, ring[(i + 1) % n], ring[i]);
  }
  const g = m.build();
  g.setAttribute('aFlat', new Float32BufferAttribute(flat, 3));
  g.setAttribute('aFace', new Float32BufferAttribute(face, 3));
  return g;
}

function towerForms() {
  const twistRows = [];
  for (let i = 0; i <= 10; i++) twistRows.push([i / 10, 1 - 0.12 * (i / 10), (i / 10) * 1.2]);
  return {
    box: towerForm(SQ, [[[0, 1, 0], [1, 1, 0]]]),
    // tapering, chamfered: an obelisk of glass
    taper: towerForm(chamfer(0.13), [[[0, 1, 0], [1, 0.6, 0]]]),
    // twisting a quarter turn as it rises
    twist: towerForm(chamfer(0.09), [twistRows]),
    // a round tower, slightly tapered
    round: towerForm(circle(20), [[[0, 1, 0], [1, 0.84, 0]]], { smooth: true, arc: true }),
    // stepping back in three planted tiers, off-centre
    stepped: towerForm(SQ, [
      [[0, 1, 0], [0.5, 1, 0]],
      [[0.5, 0.78, 0, 0.08, -0.07], [0.78, 0.78, 0, 0.08, -0.07]],
      [[0.78, 0.52, 0, -0.06, 0.05], [1, 0.52, 0, -0.06, 0.05]]
    ])
  };
}

// ground: asphalt, sidewalks, markings, courtyards — all from world xz
function groundMaterial() {
  return patch(new MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0 }), {
    key: 'ground',
    uniforms: {
      uPitch: { value: new Vector2(GRID.px, GRID.pz) },
      uOff: { value: new Vector2(GRID.ox, GRID.oz) },
      uSite: { value: new Vector4(SITE.x0, SITE.z0, SITE.x1, SITE.z1) }
    },
    fHead: /* glsl */ `
      uniform vec2 uPitch;
      uniform vec2 uOff;
      uniform vec4 uSite;
      float gh( vec2 p ) { return fract( sin( dot( p, vec2( 27.1, 61.7 ) ) ) * 43758.5453 ); }
      float gn( vec2 p ) { vec2 i = floor( p ); vec2 f = fract( p ); f = f * f * ( 3.0 - 2.0 * f );
        return mix( mix( gh( i ), gh( i + vec2( 1, 0 ) ), f.x ), mix( gh( i + vec2( 0, 1 ) ), gh( i + vec2( 1, 1 ) ), f.x ), f.y ); }
      float gRough;
      float band2( float x, float a, float b ) { return step( a, x ) * step( x, b ); }
    `,
    fColor: /* glsl */ `
      {
        vec2 p = vAtmW.xz;
        vec2 c = mod( p - uOff, uPitch );
        c = min( c, uPitch - c );
        vec2 aa = fwidth( p ) * 1.2;
        float site = step( uSite.x, p.x ) * step( p.x, uSite.z ) * step( uSite.y, p.y ) * step( p.y, uSite.w );
        float rx = 1.0 - smoothstep( 6.0 - aa.x, 6.0 + aa.x, c.x );
        float rz = 1.0 - smoothstep( 6.0 - aa.y, 6.0 + aa.y, c.y );
        float wx = 1.0 - smoothstep( 9.0 - aa.x, 9.0 + aa.x, c.x );
        float wz = 1.0 - smoothstep( 9.0 - aa.y, 9.0 + aa.y, c.y );
        float road = max( rx, rz ) * ( 1.0 - site );
        float walk = max( wx, wz ) * ( 1.0 - road ) * ( 1.0 - site );
        float n = gn( p * 0.35 ) * 0.5 + gn( p * 2.3 ) * 0.5;
        vec3 asphalt = vec3( 0.05, 0.05, 0.055 ) * ( 0.85 + 0.3 * n );
        // lane lines and zebra crossings
        float dashX = ( 1.0 - smoothstep( 0.1, 0.1 + aa.x, abs( c.x ) ) ) * step( 0.5, fract( p.y / 9.0 ) ) * step( 9.5, c.y );
        float dashZ = ( 1.0 - smoothstep( 0.1, 0.1 + aa.y, abs( c.y ) ) ) * step( 0.5, fract( p.x / 9.0 ) ) * step( 9.5, c.x );
        float zebX = rx * band2( c.y, 9.6, 13.0 ) * step( 0.5, fract( p.x / 1.1 ) );
        float zebZ = rz * band2( c.x, 9.6, 13.0 ) * step( 0.5, fract( p.y / 1.1 ) );
        float mark = clamp( max( max( dashX * rx, dashZ * rz ), max( zebX, zebZ ) ), 0.0, 1.0 );
        mark *= 1.0 - smoothstep( 0.4, 1.0, max( aa.x, aa.y ) );
        asphalt = mix( asphalt, vec3( 0.62, 0.6, 0.55 ), mark * 0.8 );
        vec3 pave = vec3( 0.34, 0.32, 0.29 ) * ( 0.9 + 0.2 * n );
        vec3 yard = mix( vec3( 0.13, 0.16, 0.09 ), vec3( 0.3, 0.28, 0.24 ), step( 0.55, gn( p * 0.08 ) ) ) * ( 0.85 + 0.3 * n );
        vec3 col = mix( yard, pave, walk );
        col = mix( col, asphalt, road );
        diffuseColor.rgb = mix( col, vec3( 0.42, 0.4, 0.37 ), site );
        gRough = mix( 0.95, 0.75, road );
      }
    `,
    fRough: 'roughnessFactor = gRough;'
  });
}

// ---------------------------------------------------------------- towers
function heightCap(x, z) {
  const r = Math.hypot(x, z);
  // keep the low sun on the library: nothing tall between it and the sun
  const az = Math.atan2(x, z);
  let d = Math.abs(az - SUN_AZ);
  d = Math.min(d, Math.PI * 2 - d);
  const sunCap = d < 0.7 ? Math.max(14, r / 3.6) : 1e9;
  const near = 18 + Math.max(0, r - 170) * 0.28;
  return Math.min(sunCap, near);
}

function buildTowers({ tier, rnd, bridges }) {
  const N = tier.name === 'high' ? 12 : 7;
  const list = []; // { x, z, w, d, h, y, style, seed, lit, color }
  const roof = [];
  const parks = [];
  // [wall / spandrel colour, facade style: 0 curtain wall, 1 punched, 2 fins, 3 balcony bands]
  const tints = [
    [0xe8e4dc, 3], [0xd9d2c6, 2], [0x4a5660, 0], [0x6c7a84, 0], [0x8f9ba3, 0], [0xc9b79c, 2],
    [0xb98d6a, 1], [0xa7a097, 2], [0x2f3a42, 0], [0xdcd6ca, 3], [0xf0eee8, 2], [0x5d6770, 0]
  ];
  const spires = [];
  // contemporary forms for most of the taller towers; the low ones stay boxes
  const pickKind = (h) => {
    const r = rnd();
    if (h > 70) return r < 0.22 ? 'twist' : r < 0.44 ? 'taper' : r < 0.62 ? 'round' : r < 0.8 ? 'stepped' : 'box';
    if (h > 34) return r < 0.2 ? 'stepped' : r < 0.32 ? 'round' : r < 0.42 ? 'taper' : 'box';
    return 'box';
  };
  const push = (x, z, w, d, h, y0, cap) => {
    const [col, style] = tints[Math.floor(rnd() * tints.length)];
    let st = rnd() < 0.25 ? Math.floor(rnd() * 4) : style;
    const seed = rnd();
    const lit = 0.04 + rnd() * 0.16;
    const kind = pickKind(h);
    if (kind === 'twist' || kind === 'round') w = d = Math.min(w, d);
    if (kind !== 'box' && st === 1) st = 0;
    // a few vertical farms
    if (h > 30 && rnd() < 0.08) st = 4;
    const garden = kind === 'stepped' || st === 4 || rnd() < 0.3 ? 1 : 0;
    const main = { x, z, w, d, h, y: y0, style: st, seed, lit, color: col, kind, garden };
    list.push(main);
    // a slender spire on some of the tall new forms
    if (kind !== 'box' && kind !== 'stepped' && h > 80 && rnd() < 0.55) {
      const top = kind === 'taper' ? 0.6 : 0.84;
      spires.push({ x, z, r: Math.min(w, d) * top * 0.09, h: h * (0.16 + rnd() * 0.16), y: y0 + h });
    }
    if (kind !== 'box') return main;
    // setback crown on taller towers
    if (h > 55 && rnd() < 0.7) {
      const f = 0.62 + rnd() * 0.2;
      const hh = Math.min(cap - (y0 + h), h * (0.15 + rnd() * 0.25));
      if (hh > 6) list.push({ x, z, w: w * f, d: d * f, h: hh, y: y0 + h, style: st, seed, lit, color: col, kind, garden });
    }
    // rooftop plant (not on gardens)
    const top = list[list.length - 1];
    const units = garden ? 0 : 1 + Math.floor(rnd() * 3);
    for (let k = 0; k < units; k++)
      roof.push({ x: top.x + (rnd() - 0.5) * top.w * 0.5, z: top.z + (rnd() - 0.5) * top.d * 0.5, w: 3 + rnd() * 6, d: 3 + rnd() * 6, h: 2 + rnd() * 3, y: top.y + top.h });
    return main;
  };
  // glazed sky bridges between twin towers, planted on top
  const skyBridge = (a, b, y0) => {
    const z0 = Math.max(a.z - a.d / 2, b.z - b.d / 2);
    const z1 = Math.min(a.z + a.d / 2, b.z + b.d / 2);
    const top = Math.min(a.h, b.h);
    if (z1 - z0 < 12 || top < 40) return;
    // centre to centre, so it meets any form (its ends are hidden inside)
    const xa = a.x;
    const xb = b.x;
    const n = top > 90 && rnd() < 0.5 ? 2 : 1;
    for (let k = 0; k < n; k++) {
      const y = y0 + top * (n === 2 ? (k ? 0.78 : 0.45) : 0.55 + rnd() * 0.25);
      list.push({ x: (xa + xb) / 2, z: (z0 + z1) / 2, w: xb - xa, d: Math.min(9, z1 - z0 - 3), h: 7.5, y, style: 0, seed: rnd(), lit: 0.5, color: 0xe8e4dc, kind: 'box', garden: 1 });
    }
  };
  for (let i = -N; i <= N; i++)
    for (let j = -N; j <= N; j++) {
      if (Math.abs(i) <= 1 && Math.abs(j) <= 1) continue; // the civic superblock
      const cx = i * GRID.px;
      const cz = j * GRID.pz;
      const bx = GRID.px - GRID.street - 2;
      const bz = GRID.pz - GRID.street - 2;
      const r = Math.hypot(cx, cz);
      if (r > N * GRID.px * 1.02) continue;
      const cap = heightCap(cx, cz);
      // a skyline: taller to the north and east, a downtown knot to the north-east
      const dt = Math.exp(-((cx - 520) ** 2 + (cz + 560) ** 2) / (2 * 380 ** 2));
      const base = 24 + 70 * Math.min(1, Math.max(0, (r - 200) / 600)) + 170 * dt;
      const hOf = (k = 1) => Math.min(cap, Math.max(10, base * k * (0.45 + rnd() * 0.9)));
      if (rnd() < 0.07 && r > 250) {
        parks.push({ x: cx, z: cz, w: bx, d: bz });
        continue;
      }
      const bridged = bridges.find((b) => b.cell[0] === i && b.cell[1] === j);
      const podium = bridged ? bridged.y : rnd() < 0.55 ? 6 + Math.floor(rnd() * 3) * 3.5 : 0;
      if (podium > 0) list.push({ x: cx, z: cz, w: bx, d: bz, h: podium, y: 0, style: 0, seed: rnd(), lit: 0.6, color: 0xb9b2a6, kind: 'box', garden: rnd() < 0.4 ? 1 : 0 });
      const t = rnd();
      if (t < 0.38) {
        const w = 26 + rnd() * 16;
        const d = 22 + rnd() * 14;
        push(cx + (rnd() - 0.5) * (bx - w) * 0.8, cz + (rnd() - 0.5) * (bz - d) * 0.8, w, d, hOf(1.25), podium, cap);
      } else if (t < 0.72) {
        const twins = [-1, 1].map((s) => {
          const w = bx / 2 - 4 - rnd() * 6;
          const d = 20 + rnd() * (bz - 26);
          return push(cx + s * bx * 0.25, cz + (rnd() - 0.5) * (bz - d) * 0.7, w, d, hOf(1), podium, cap);
        });
        skyBridge(twins[0], twins[1], podium);
      } else {
        for (const sx of [-1, 1])
          for (const sz of [-1, 1]) {
            const w = bx / 2 - 3 - rnd() * 8;
            const d = bz / 2 - 3 - rnd() * 7;
            push(cx + sx * bx * 0.25, cz + sz * bz * 0.25, w, d, hOf(0.6), podium, cap);
          }
      }
    }
  return { list, roof, parks, spires, N };
}

// one instanced draw per form, all on the one facade material
function towerMeshes(list, mat, forms, name) {
  const out = [];
  for (const kind of Object.keys(forms)) {
    const sub = list.filter((b) => (b.kind || 'box') === kind);
    if (!sub.length) continue;
    const m = towerMesh(sub, mat, forms[kind]);
    m.name = `${name}-${kind}`;
    out.push(m);
  }
  return out;
}

function towerMesh(list, mat, g) {
  const mesh = new InstancedMesh(g.clone(), mat, list.length);
  const style = new Float32Array(list.length * 4);
  const o = new Object3D();
  const c = new Color();
  list.forEach((b, i) => {
    o.position.set(b.x, b.y, b.z);
    o.scale.set(b.w, b.h, b.d);
    o.updateMatrix();
    mesh.setMatrixAt(i, o.matrix);
    mesh.setColorAt(i, c.set(b.color));
    style.set([b.style, b.seed, b.lit, b.garden || 0], i * 4);
  });
  mesh.geometry.setAttribute('aStyle', new InstancedBufferAttribute(style, 4));
  mesh.instanceColor.needsUpdate = true;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.computeBoundingSphere();
  return mesh;
}

// ---------------------------------------------------------------- trees
// a few thousand of these are instanced, so keep them coarse (~150 triangles)
function treeGeometry() {
  const trunk = tint(xf(cylinder(0.22, 3.4, 5, { rTop: 0.16, caps: false }), { t: [0, 0, 0] }), 0x4a3a2c);
  const lumps = [
    [0, 4.6, 0, 2.3],
    [0.9, 4.0, 0.5, 1.6],
    [-0.8, 4.2, -0.6, 1.7],
    [0.1, 5.7, -0.2, 1.5]
  ].map(([x, y, z, r]) => tint(xf(sphere(r, 6, 4), { t: [x, y, z], s: [1, 0.85, 1] }), 0xffffff));
  return merge([trunk, ...lumps]);
}

function treeMaterial() {
  return patch(new MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0 }), {
    key: 'trees',
    vBegin: /* glsl */ `
      {
        vec3 ip = instanceMatrix[ 3 ].xyz;
        float sway = smoothstep( 2.5, 7.0, position.y );
        transformed.x += sin( uTime * 1.1 + ip.x * 0.13 + ip.z * 0.07 ) * 0.18 * sway;
        transformed.z += cos( uTime * 0.9 + ip.z * 0.11 ) * 0.12 * sway;
      }
    `
  });
}

function placeTrees(mesh, pts, rnd) {
  const o = new Object3D();
  const c = new Color();
  const greens = [0x5d7a3c, 0x6f8a45, 0x4e6b38, 0x7c9150, 0x8a8a3e, 0xb08a3a, 0x6a7f3f];
  pts.forEach(([x, z, s], i) => {
    o.position.set(x, 0, z);
    o.rotation.set(0, rnd() * 6.28, 0);
    o.scale.setScalar(s);
    o.updateMatrix();
    mesh.setMatrixAt(i, o.matrix);
    c.set(greens[Math.floor(rnd() * greens.length)]);
    mesh.setColorAt(i, c);
  });
  mesh.count = pts.length;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
}

// ---------------------------------------------------------------- water
const WATER_FRAG = /* glsl */ `
  uniform sampler2D tReflect;
  uniform float uHasReflect;
  uniform mat4 uTexMat;
  uniform float uTime;
  varying vec3 vW;
  ${FOG_GLSL}
  float wh( vec2 p ) { return fract( sin( dot( p, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 ); }
  float wn( vec2 p ) { vec2 i = floor( p ); vec2 f = fract( p ); f = f * f * ( 3.0 - 2.0 * f );
    return mix( mix( wh( i ), wh( i + vec2( 1, 0 ) ), f.x ), mix( wh( i + vec2( 0, 1 ) ), wh( i + vec2( 1, 1 ) ), f.x ), f.y ); }
  vec3 skyApprox( vec3 d ) {
    float h = max( d.y, 0.0 );
    vec3 hz = hazeColor( d );
    vec3 zen = vec3( 0.16, 0.27, 0.52 );
    return mix( hz, zen, smoothstep( 0.05, 0.8, h ) );
  }
  void main() {
    vec2 p = vW.xz;
    float t = uTime;
    vec2 g = vec2( wn( p * 0.9 + t * 0.35 ) - wn( p * 0.9 - vec2( 3.1, 1.7 ) - t * 0.3 ),
                   wn( p * 1.3 + vec2( 7.0, 2.0 ) + t * 0.27 ) - wn( p * 1.1 - t * 0.33 ) );
    g += 0.5 * vec2( wn( p * 3.7 + t ), wn( p * 3.3 - t * 1.1 ) ) - 0.25;
    vec3 n = normalize( vec3( g.x * 0.08, 1.0, g.y * 0.08 ) );
    vec3 v = normalize( vW - cameraPosition );
    vec3 r = reflect( v, n );
    float fres = 0.04 + 0.96 * pow( 1.0 - max( dot( -v, n ), 0.0 ), 5.0 );
    vec3 refl = skyApprox( r );
    if ( uHasReflect > 0.5 ) {
      vec4 uvp = uTexMat * vec4( vW, 1.0 );
      vec2 uv = uvp.xy / uvp.w + n.xz * 0.025;
      refl = texture2D( tReflect, uv ).rgb;
    }
    // the sun's glitter path
    float sp = pow( max( dot( r, uSunDir ), 0.0 ), 700.0 ) * 40.0;
    vec3 deep = vec3( 0.025, 0.05, 0.055 );
    vec3 c = mix( deep, refl, clamp( fres + 0.35, 0.0, 1.0 ) ) + vec3( 1.0, 0.78, 0.5 ) * sp;
    gl_FragColor = vec4( atmFog( c, vW ), 1.0 );
  }
`;
const WATER_VERT = /* glsl */ `
  varying vec3 vW;
  void main() {
    vec4 w = modelMatrix * vec4( position, 1.0 );
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

function createReflector(scale) {
  const rt = new WebGLRenderTarget(4, 4, { type: HalfFloatType, depthBuffer: true, generateMipmaps: false });
  const cam = new PerspectiveCamera();
  const texMat = new Matrix4();
  const plane = new Plane();
  const clip = new Vector4();
  const q = new Vector4();
  const mirrorPos = new Vector3();
  const look = new Vector3();
  const tgt = new Vector3();
  const N = new Vector3(0, 1, 0);
  return {
    rt,
    texMat,
    setSize(w, h) {
      rt.setSize(Math.max(2, Math.round(w * scale)), Math.max(2, Math.round(h * scale)));
    },
    render(renderer, scene, camera, y, hide, sky) {
      const P = new Vector3(0, y, 0);
      mirrorPos.copy(P).sub(camera.position).reflect(N).negate().add(P);
      look.set(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
      tgt.copy(P).sub(look).reflect(N).negate().add(P);
      cam.position.copy(mirrorPos);
      cam.up.set(0, 1, 0).applyQuaternion(camera.quaternion).reflect(N);
      cam.lookAt(tgt);
      cam.far = camera.far;
      cam.updateMatrixWorld();
      cam.projectionMatrix.copy(camera.projectionMatrix);
      texMat.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
      texMat.multiply(cam.projectionMatrix).multiply(cam.matrixWorldInverse);
      // oblique near plane on the water surface
      plane.setFromNormalAndCoplanarPoint(N, P).applyMatrix4(cam.matrixWorldInverse);
      clip.set(plane.normal.x, plane.normal.y, plane.normal.z, plane.constant);
      const e = cam.projectionMatrix.elements;
      q.x = (Math.sign(clip.x) + e[8]) / e[0];
      q.y = (Math.sign(clip.y) + e[9]) / e[5];
      q.z = -1;
      q.w = (1 + e[10]) / e[14];
      clip.multiplyScalar(2 / clip.dot(q));
      e[2] = clip.x;
      e[6] = clip.y;
      e[10] = clip.z + 1;
      e[14] = clip.w;
      cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
      hide.forEach((o) => (o.visible = false));
      const skyPos = sky.position.clone();
      sky.position.copy(cam.position);
      const prev = renderer.getRenderTarget();
      const shadowAuto = renderer.shadowMap.autoUpdate;
      renderer.shadowMap.autoUpdate = false;
      renderer.setRenderTarget(rt);
      renderer.clear();
      renderer.render(scene, cam);
      renderer.setRenderTarget(prev);
      renderer.shadowMap.autoUpdate = shadowAuto;
      sky.position.copy(skyPos);
      hide.forEach((o) => (o.visible = true));
    }
  };
}

// ---------------------------------------------------------------- transit
// the guideway follows two streets: west–east along z = -126, a quarter turn,
// then north–south along x = 240
function transitPath() {
  const pts = [];
  const y = 13.2;
  for (let x = -1400; x <= 180; x += 20) pts.push(new Vector3(x, y, -126));
  for (let i = 1; i < 12; i++) {
    const a = (i / 12) * (Math.PI / 2);
    pts.push(new Vector3(180 + Math.sin(a) * 60, y, -66 - Math.cos(a) * 60));
  }
  for (let z = -66; z <= 1400; z += 20) pts.push(new Vector3(240, y, z));
  const len = [0];
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + pts[i].distanceTo(pts[i - 1]));
  return {
    pts,
    total: len[len.length - 1],
    at(s, out, dir) {
      s = Math.max(0, Math.min(len[len.length - 1] - 1e-3, s));
      let lo = 0;
      let hi = len.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (len[mid] <= s) lo = mid;
        else hi = mid;
      }
      const f = (s - len[lo]) / (len[hi] - len[lo]);
      out.lerpVectors(pts[lo], pts[hi], f);
      if (dir) dir.subVectors(pts[hi], pts[lo]).normalize();
      return out;
    }
  };
}

// ---------------------------------------------------------------- build
export function buildCity({ renderer, tier, library }) {
  const rnd = rng(9173);
  const hi = tier.name === 'high';
  const group = new Group();
  group.name = 'city';
  const std = (o, key) => patch(new MeshStandardMaterial(o), { key });
  const M = {
    concrete: std({ color: 0xd8d2c8, roughness: 0.8 }, 'c-concrete'),
    paving: patch(new MeshStandardMaterial({ color: 0xd9cfbf, roughness: 0.85 }), {
      key: 'c-paving',
      fColor: /* glsl */ `
        {
          vec2 p = vAtmW.xz;
          vec2 q = vec2( p.x / 1.6 + 0.5 * step( 0.5, fract( p.y / 1.6 ) ), p.y / 0.8 );
          vec2 g = abs( fract( q ) - 0.5 );
          vec2 aa = fwidth( q ) * 1.2;
          float j = 1.0 - min( smoothstep( 0.0, aa.x + 0.03, 0.5 - g.x ), smoothstep( 0.0, aa.y + 0.03, 0.5 - g.y ) );
          j *= 1.0 - smoothstep( 0.3, 0.8, max( aa.x, aa.y ) );
          float stripe = step( 0.92, fract( ( p.x + p.y * 0.0 ) / 12.0 ) );
          float tone = fract( sin( dot( floor( q ), vec2( 12.9, 78.2 ) ) ) * 43758.5 );
          diffuseColor.rgb *= ( 0.92 + 0.12 * tone ) * ( 1.0 - j * 0.28 );
          diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.36, 0.33, 0.3 ), stripe * 0.6 );
        }
      `
    }),
    lawn: patch(new MeshStandardMaterial({ color: 0x5f7a3a, roughness: 0.95 }), {
      key: 'c-lawn',
      fColor: /* glsl */ `
        {
          vec2 p = vAtmW.xz;
          float n = fract( sin( dot( floor( p * 1.5 ), vec2( 12.9, 78.2 ) ) ) * 43758.5 );
          float m = 0.5 + 0.5 * sin( p.x * 0.11 + sin( p.y * 0.07 ) * 2.0 );
          diffuseColor.rgb *= 0.82 + 0.16 * n + 0.14 * m;
        }
      `
    }),
    glass: std({ color: 0x2a363c, roughness: 0.06, metalness: 0.4, envMapIntensity: 2.4 }, 'c-glass'),
    metal: std({ color: 0x8c8f91, roughness: 0.35, metalness: 0.8 }, 'c-metal'),
    roofUnits: std({ color: 0x9a978f, roughness: 0.7 }, 'c-roof'),
    green: std({ vertexColors: true, roughness: 0.92 }, 'c-green'),
    train: patch(new MeshStandardMaterial({ color: 0xf3f1ec, roughness: 0.25, metalness: 0.3, vertexColors: true }), {
      key: 'c-train',
      // the window band is tinted near-black in the vertex colours
      fEmissive: 'totalEmissiveRadiance += vec3( 1.0, 0.75, 0.45 ) * step( vColor.r, 0.02 ) * 1.4;'
    })
  };

  // ---- ground
  const ground = new Mesh(plane(9000, 9000), groundMaterial());
  ground.receiveShadow = true;
  ground.position.y = -0.02;
  group.add(ground);

  // ---- bridges into neighbouring podiums (forced to deck height)
  const bridges = [
    { cell: [-2, 0], y: 10.5 },
    { cell: [2, -1], y: 10.5 }
  ];
  const T = buildTowers({ tier, rnd, bridges });
  const forms = towerForms();
  const towerMat = towerMaterial();
  const towers = towerMeshes(T.list, towerMat, forms, 'towers');
  group.add(...towers);
  // spires: slender tapering masts on some of the tall towers
  if (T.spires.length) {
    const m = new InstancedMesh(cylinder(0.5, 1, 8, { rTop: 0.03 }), M.metal, T.spires.length);
    const o = new Object3D();
    T.spires.forEach((s, i) => {
      o.position.set(s.x, s.y - 0.5, s.z);
      o.scale.set(s.r * 2, s.h, s.r * 2);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.castShadow = true;
    m.computeBoundingSphere();
    m.name = 'spires';
    group.add(m);
  }
  // roof plant
  let roofPlant = null;
  {
    const g = xf(box(1, 1, 1), { t: [0, 0.5, 0] });
    const m = new InstancedMesh(g, M.roofUnits, T.roof.length);
    const o = new Object3D();
    T.roof.forEach((r, i) => {
      o.position.set(r.x, r.y, r.z);
      o.scale.set(r.w, r.h, r.d);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.castShadow = true;
    m.receiveShadow = true;
    m.computeBoundingSphere();
    m.name = 'roof-plant';
    group.add(m);
    roofPlant = m;
  }

  // ---- far silhouettes beyond the grid, for the haze to swallow
  let farTowers = null;
  {
    const far = [];
    const R0 = T.N * GRID.px + 60;
    for (let i = 0; i < (hi ? 900 : 420); i++) {
      const a = rnd() * Math.PI * 2;
      const r = R0 + Math.pow(rnd(), 0.7) * 2200;
      const x = Math.sin(a) * r;
      const z = Math.cos(a) * r;
      const dt = Math.exp(-((x - 520) ** 2 + (z + 560) ** 2) / (2 * 900 ** 2));
      const h = 20 + rnd() * 70 + 160 * dt * rnd();
      const k = rnd();
      const kind = h < 45 ? 'box' : k < 0.25 ? 'taper' : k < 0.45 ? 'round' : k < 0.6 ? 'twist' : k < 0.72 ? 'stepped' : 'box';
      const w = 20 + rnd() * 40;
      const d = kind === 'round' || kind === 'twist' ? w : 20 + rnd() * 40;
      far.push({ x, z, w, d, h, y: 0, style: Math.floor(rnd() * 3) === 1 ? 0 : Math.floor(rnd() * 4), seed: rnd(), lit: 0.2, color: [0xb8b2a8, 0x9aa3a8, 0xc9c3b8][Math.floor(rnd() * 3)], kind, garden: 0 });
    }
    farTowers = towerMeshes(far, towerMat, forms, 'towers-far');
    for (const m of farTowers) {
      m.castShadow = false;
      m.receiveShadow = false;
      group.add(m);
    }
  }

  // ---- civic plaza: paving, lawns, planters, the reflecting pool
  const lib = library.footprint;
  group.add(Object.assign(new Mesh(xf(plane(SITE.x1 - SITE.x0, SITE.z1 - SITE.z0), { t: [0, 0.03, 0] }), M.paving), { receiveShadow: true }));
  const lawns = [
    [-104, -84, 46, 50], [104, -84, 46, 50], [-106, 78, 42, 60], [106, 78, 42, 60], [-104, 4, 30, 60], [104, 4, 30, 60]
  ];
  const lawnGeo = [];
  const edgeGeo = [];
  for (const [x, z, w, d] of lawns) {
    lawnGeo.push(xf(prism(roundRectPoly(w, d, 9, 5), 0.45), { t: [x, 0, z] }));
    edgeGeo.push(xf(prism(roundRectPoly(w + 1.2, d + 1.2, 9.5, 5), 0.5), { t: [x, 0, z] }));
  }
  const lawnMesh = new Mesh(merge(lawnGeo), M.lawn);
  lawnMesh.receiveShadow = true;
  lawnMesh.position.y = 0.08;
  group.add(lawnMesh);
  group.add(Object.assign(new Mesh(merge(edgeGeo), M.concrete), { receiveShadow: true, castShadow: true }));

  // reflecting pool with a stone coping and a line of jets
  const pool = { x: 0, z: 86, w: 124, d: 24, y: 0.32 };
  const coping = merge([
    xf(box(pool.w + 2.4, 0.7, 1.2), { t: [0, 0.35, pool.z - pool.d / 2 - 0.6] }),
    xf(box(pool.w + 2.4, 0.7, 1.2), { t: [0, 0.35, pool.z + pool.d / 2 + 0.6] }),
    xf(box(1.2, 0.7, pool.d), { t: [-pool.w / 2 - 0.6, 0.35, pool.z] }),
    xf(box(1.2, 0.7, pool.d), { t: [pool.w / 2 + 0.6, 0.35, pool.z] })
  ]);
  group.add(Object.assign(new Mesh(coping, M.concrete), { castShadow: true, receiveShadow: true }));
  const reflector = hi ? createReflector(0.5) : null;
  const waterMat = new ShaderMaterial({
    vertexShader: WATER_VERT,
    fragmentShader: WATER_FRAG,
    uniforms: {
      ...ATM,
      tReflect: { value: reflector ? reflector.rt.texture : null },
      uHasReflect: { value: reflector ? 1 : 0 },
      uTexMat: { value: reflector ? reflector.texMat : new Matrix4() }
    }
  });
  const water = new Mesh(xf(plane(pool.w, pool.d), { t: [pool.x, pool.y, pool.z] }), waterMat);
  water.name = 'water';
  group.add(water);
  // jets: thin glowing columns that breathe
  const NJ = 14;
  const jetMat = patch(new MeshStandardMaterial({ color: 0xe8f2f4, roughness: 0.2, transparent: true, opacity: 0.55, depthWrite: false }), {
    key: 'c-jets',
    vBegin: /* glsl */ `
      {
        vec3 ip = instanceMatrix[ 3 ].xyz;
        float k = 0.55 + 0.45 * sin( uTime * 1.6 + ip.x * 0.21 );
        transformed.y *= k;
        transformed.xz *= 1.0 + ( 1.0 - k ) * 0.6 * smoothstep( 0.7, 1.0, position.y / 4.0 );
      }
    `
  });
  const jets = new InstancedMesh(cylinder(0.14, 4.2, 8, { rTop: 0.05 }), jetMat, NJ);
  {
    const o = new Object3D();
    for (let i = 0; i < NJ; i++) {
      o.position.set(-52 + (104 * i) / (NJ - 1), pool.y, pool.z);
      o.updateMatrix();
      jets.setMatrixAt(i, o.matrix);
    }
    jets.computeBoundingSphere();
  }
  group.add(jets);

  // ---- trees: plaza groves, edge rows, street trees
  const treePts = [];
  for (const [x, z, w, d] of lawns) {
    const n = Math.round((w * d) / (hi ? 110 : 190));
    for (let k = 0; k < n; k++) treePts.push([x + (rnd() - 0.5) * (w - 8), z + (rnd() - 0.5) * (d - 8), 0.8 + rnd() * 0.55]);
  }
  for (let z = -108; z <= 108; z += 9) {
    treePts.push([-128, z, 0.95 + rnd() * 0.2]);
    treePts.push([128, z, 0.95 + rnd() * 0.2]);
  }
  for (let x = -120; x <= 120; x += 10) if (Math.abs(x) > 20) treePts.push([x, -110, 0.9 + rnd() * 0.2]);
  for (let x = -60; x <= 60; x += 10) {
    treePts.push([x, 104, 0.85 + rnd() * 0.25]);
    treePts.push([x + 5, 68, 0.75 + rnd() * 0.2]);
  }
  const streetR = hi ? 620 : 360;
  const stepT = hi ? 13 : 20;
  for (let k = -8; k <= 8; k++) {
    const sx = GRID.ox + k * GRID.px;
    const sz = GRID.oz + k * GRID.pz;
    for (let t = -streetR; t <= streetR; t += stepT) {
      for (const side of [-7.6, 7.6]) {
        const a = [sx + side, t];
        const b = [t, sz + side];
        for (const [x, z] of [a, b]) {
          if (Math.hypot(x, z) > streetR) continue;
          if (x > SITE.x0 - 4 && x < SITE.x1 + 4 && z > SITE.z0 - 4 && z < SITE.z1 + 4) continue;
          // skip intersections
          const cx = Math.abs(((x - GRID.ox) % GRID.px + GRID.px) % GRID.px);
          const cz = Math.abs(((z - GRID.oz) % GRID.pz + GRID.pz) % GRID.pz);
          if (Math.min(cx, GRID.px - cx) < 10 && Math.min(cz, GRID.pz - cz) < 10) continue;
          if (rnd() < 0.18) continue;
          treePts.push([x, z, 0.7 + rnd() * 0.3]);
        }
      }
    }
  }
  for (const p of T.parks) {
    const n = Math.round((p.w * p.d) / 160);
    for (let k = 0; k < n; k++) treePts.push([p.x + (rnd() - 0.5) * p.w, p.z + (rnd() - 0.5) * p.d, 0.9 + rnd() * 0.5]);
  }
  // two draws: trees near the library cast shadows; the street trees further
  // out (most of them, and mostly outside the sun's shadow frustum) do not
  const treeGeo = treeGeometry();
  const treeMat = treeMaterial();
  const treeSets = [];
  for (const near of [true, false]) {
    const pts = treePts.filter(([x, z]) => (Math.hypot(x, z) < 300) === near);
    const m = new InstancedMesh(treeGeo, treeMat, pts.length);
    placeTrees(m, pts, rnd);
    m.castShadow = near;
    m.receiveShadow = true;
    m.computeBoundingSphere();
    m.name = near ? 'trees' : 'trees-far';
    group.add(m);
    treeSets.push(m);
  }
  {
    // park lawns
    const g = T.parks.map((p) => xf(prism(roundRectPoly(p.w, p.d, 6, 4), 0.3), { t: [p.x, 0, p.z] }));
    if (g.length) group.add(Object.assign(new Mesh(merge(g), M.lawn), { receiveShadow: true }));
  }

  // ---- elevated walkways: west deck, the green loop to the east, the
  // station link to the north
  const deck = [];
  const rail = [];
  const greens = [];
  const deckAlong = (path, w, y0fn, posts = 18) => {
    const m = new Mesher();
    let u = 0;
    const cols = 2;
    for (let i = 0; i < path.length; i++) {
      const p = path[i];
      const q = path[Math.min(path.length - 1, i + 1)];
      const o = path[Math.max(0, i - 1)];
      const tx = q.x - o.x;
      const tz = q.z - o.z;
      const l = Math.hypot(tx, tz) || 1;
      const nx = -tz / l;
      const nz = tx / l;
      if (i) u += p.distanceTo(path[i - 1]);
      m.v(p.x + nx * w / 2, p.y, p.z + nz * w / 2, 0, 1, 0, 0, u);
      m.v(p.x - nx * w / 2, p.y, p.z - nz * w / 2, 0, 1, 0, w, u);
    }
    for (let i = 0; i < path.length - 1; i++) {
      const a = i * cols;
      m.quad(a, a + 2, a + 3, a + 1);
    }
    const top = m.build();
    deck.push(top);
    // underside + edges as a thin box chain, glass rails, posts
    let acc = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const p = path[i];
      const q = path[i + 1];
      const L = p.distanceTo(q);
      const mid = p.clone().add(q).multiplyScalar(0.5);
      const yaw = Math.atan2(q.x - p.x, q.z - p.z);
      const pitch = Math.atan2(q.y - p.y, Math.hypot(q.x - p.x, q.z - p.z));
      deck.push(xf(box(w, 0.9, L + 0.05), { t: [mid.x, mid.y - 0.46, mid.z], r: [-pitch, yaw, 0] }));
      for (const s of [-1, 1]) {
        const ox = Math.cos(yaw) * s * (w / 2 - 0.1);
        const oz = -Math.sin(yaw) * s * (w / 2 - 0.1);
        rail.push(xf(box(0.08, 1.1, L), { t: [mid.x + ox, mid.y + 0.55, mid.z + oz], r: [-pitch, yaw, 0] }));
      }
      acc += L;
      if (acc > posts && y0fn(mid) > 3) {
        acc = 0;
        deck.push(xf(cylinder(0.45, mid.y - 0.9, 10), { t: [mid.x, 0, mid.z] }));
      }
    }
  };
  // west: library first floor → across the street into the podium
  deckAlong([new Vector3(-58, 10.5, 4), new Vector3(-100, 10.5, 4), new Vector3(-150, 10.5, 4), new Vector3(-158, 10.5, 4)], 7, () => 10);
  // east: a planted loop that leaves the alcoves, swings over the plaza and lands across the street
  const loop = smoothPath(
    [new Vector3(56, 10.5, 18), new Vector3(78, 10.5, 30), new Vector3(104, 10.5, 30), new Vector3(122, 10.5, 8), new Vector3(150, 10.5, -30), new Vector3(170, 10.5, -42)],
    10
  );
  deckAlong(loop, 9, () => 10, 16);
  for (let i = 2; i < loop.length - 2; i += 2) {
    const p = loop[i];
    const q = loop[i + 1];
    const yaw = Math.atan2(q.x - p.x, q.z - p.z);
    for (const s of [-1, 1]) {
      const g = [];
      const ox = Math.cos(yaw) * s * 3.2;
      const oz = -Math.sin(yaw) * s * 3.2;
      const r = 0.6 + rnd() * 0.6;
      g.push(tint(xf(roundBox(r * 2, r * 1.2, r * 2, r * 0.6, 1), { t: [p.x + ox, 10.5 + r * 0.6, p.z + oz] }), [0x5d7a3c, 0x7c9150, 0x8a8a3e][Math.floor(rnd() * 3)]));
      greens.push(...g);
    }
  }
  // north: from the library's north door up to the transit platform
  deckAlong([new Vector3(0, 10.5, -37), new Vector3(0, 11.4, -80), new Vector3(0, 12.6, -118)], 8, () => 10, 20);
  group.add(Object.assign(new Mesh(merge(deck), M.concrete), { castShadow: true, receiveShadow: true }));
  group.add(new Mesh(merge(rail), M.glass));
  if (greens.length) group.add(Object.assign(new Mesh(merge(greens), M.green), { castShadow: true }));

  // ---- transit: guideway on T-piers, a glass station, two trains
  const path = transitPath();
  {
    const g = [];
    for (let i = 0; i < path.pts.length - 1; i++) {
      const p = path.pts[i];
      const q = path.pts[i + 1];
      const L = p.distanceTo(q);
      const mid = p.clone().add(q).multiplyScalar(0.5);
      const yaw = Math.atan2(q.x - p.x, q.z - p.z);
      g.push(xf(roundBox(7.2, 1.5, L + 0.1, 0.4, 1), { t: [mid.x, p.y - 0.95, mid.z], r: [0, yaw, 0] }));
      if (i % 2 === 0) {
        g.push(xf(cylinder(0.8, p.y - 1.6, 10, { rTop: 0.65 }), { t: [p.x, 0, p.z] }));
        g.push(xf(roundBox(5, 0.9, 2, 0.3, 1), { t: [p.x, p.y - 1.9, p.z], r: [0, yaw, 0] }));
      }
    }
    group.add(Object.assign(new Mesh(merge(g), M.concrete), { castShadow: true, receiveShadow: true }));
    // station: platforms and a gently arched glass roof on slim columns
    const st = [];
    for (const s of [-1, 1]) st.push(xf(box(84, 0.6, 4), { t: [0, 12.6, -126 + s * 6] }));
    for (let x = -40; x <= 40; x += 10) for (const s of [-1, 1]) st.push(xf(cylinder(0.25, 7.5, 8), { t: [x, 12.9, -126 + s * 7.4] }));
    group.add(Object.assign(new Mesh(merge(st), M.metal), { castShadow: true }));
    const roofM = new Mesher();
    const nu = 40;
    const nv = 8;
    for (let j = 0; j <= nv; j++)
      for (let i = 0; i <= nu; i++) {
        const x = -44 + (88 * i) / nu;
        const zz = -126 - 9 + (18 * j) / nv;
        const y = 20.4 + 1.6 * Math.cos(((zz + 126) / 9) * (Math.PI / 2)) - 0.0004 * x * x;
        roofM.v(x, y, zz, 0, 1, 0, x, zz);
      }
    for (let j = 0; j < nv; j++)
      for (let i = 0; i < nu; i++) {
        const a = j * (nu + 1) + i;
        roofM.quad(a, a + nu + 1, a + nu + 2, a + 1);
      }
    const roofG = roofM.build();
    roofG.computeVertexNormals();
    group.add(Object.assign(new Mesh(roofG, M.glass), { castShadow: true }));
  }
  // trains: 2 × 4 cars, one each way; white bodies, a warm-lit window band
  const CARS = 4;
  const carLen = 17;
  const carGeo = (() => {
    const body = tint(roundBox(3.1, 3.3, carLen, 1.1, 2), 0xffffff);
    const band = tint(xf(roundBox(3.16, 1.0, carLen - 2.4, 0.3, 1), { t: [0, 0.35, 0] }), 0x1a2028);
    const skirt = tint(xf(box(2.6, 0.5, carLen - 1), { t: [0, -1.8, 0] }), 0x333333);
    return xf(merge([body, band, skirt]), { t: [0, 1.95, 0] });
  })();
  const trains = new InstancedMesh(carGeo, M.train, CARS * 2);
  trains.castShadow = true;
  trains.frustumCulled = false;
  group.add(trains);
  const tp = new Vector3();
  const td = new Vector3();
  const to = new Object3D();
  function updateTrains(t) {
    for (let k = 0; k < 2; k++) {
      const dir = k ? -1 : 1;
      const speed = 21;
      const span = path.total;
      const head = (((t * speed + k * span * 0.37) % span) + span) % span;
      for (let c = 0; c < CARS; c++) {
        let s = dir > 0 ? head - c * (carLen + 0.8) : span - head + c * (carLen + 0.8);
        s = Math.max(1, Math.min(span - 1, s));
        path.at(s, tp, td);
        const nx = -td.z;
        const nz = td.x;
        to.position.set(tp.x + nx * 1.9 * dir, tp.y - 0.2, tp.z + nz * 1.9 * dir);
        to.rotation.set(0, Math.atan2(td.x, td.z), 0);
        to.updateMatrix();
        trains.setMatrixAt(k * CARS + c, to.matrix);
      }
    }
    trains.instanceMatrix.needsUpdate = true;
  }
  updateTrains(0);

  // the pool mirrors the library, the plaza, the near towers and the sky; the
  // thousands of small things (trees, roof plant, far skyline, life) are left
  // out of that second pass, and it is redrawn every other frame
  const reflectHide = [water, ...treeSets, roofPlant, ...farTowers];
  let frameNo = 0;
  return {
    group,
    water,
    reflector,
    path,
    pool,
    towers,
    update(t, renderer, scene, camera, sky, extraHide = []) {
      updateTrains(t);
      if (reflector && frameNo++ % 2 === 0) reflector.render(renderer, scene, camera, pool.y, reflectHide.concat(extraHide), sky);
    },
    resize(w, h) {
      if (reflector) reflector.setSize(w, h);
    }
  };
}
