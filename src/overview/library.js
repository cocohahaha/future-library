import {
  Group,
  Mesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
  InstancedMesh,
  InstancedBufferAttribute,
  Object3D,
  Vector3,
  Color,
  AdditiveBlending,
  DoubleSide
} from 'three';
import { Mesher, roundBox, box, cylinder, lathe, ringSector, tube, merge, xf, tint, plane } from '../core/geo.js';
import { patch } from './atmos.js';

// The Library of Open Questions as one civic building, in metres, entrance
// to the south (+z). Each of the book's five zones is its own legible part:
//   1 Question Well        a glass drum through the middle, its oculus
//                          breathing paper slips up into the evening sky
//   2 Provenance Stacks    the west bar, wrapped in twisted terracotta fins
//                          (the red thread, drawn as a facade)
//   3 Dialogue Alcoves     the east wing: glazed pods stacked and cantilevered
//                          off a glass core, planted on top
//   4 Unassisted Room      a long, quiet, stone-clad bar floating over
//                          everything, north-light sawtooth roof
//   5 Verification Commons the glazed public ground floor and the
//                          undulating canopy over the forecourt
// Static parts are merged per material; the slips are one instanced draw
// animated in the vertex shader.

const FLOOR = 4.5;

function mats() {
  const std = (o, p) => patch(new MeshStandardMaterial(o), p);
  // glass: dark, reflective at grazing angles, floor plates and warm rooms
  // behind it (world-height bands, so every glazed volume lines up)
  const glass = std(
    { color: 0x1d262c, roughness: 0.06, metalness: 0.3, envMapIntensity: 2.8 },
    {
      key: 'lib-glass',
      uniforms: { uFloor: { value: FLOOR }, uWarm: { value: new Color(1.0, 0.62, 0.32) } },
      fHead: /* glsl */ `
        uniform float uFloor;
        uniform vec3 uWarm;
        float gSlab; float gRoom;
        float h1( vec2 p ) { return fract( sin( dot( p, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 ); }
      `,
      fColor: /* glsl */ `
        {
          float fy = ( vAtmW.y - 1.2 ) / uFloor;
          float fr = fract( fy );
          float aa = fwidth( fy ) * 1.5;
          gSlab = smoothstep( 0.86 - aa, 0.86 + aa, fr );
          float bay = floor( ( vAtmW.x + vAtmW.z ) / 6.0 );
          gRoom = 0.35 + 0.65 * step( 0.3, h1( vec2( floor( fy ), bay ) ) );
          diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.56, 0.53, 0.5 ), gSlab );
        }
      `,
      fRough: /* glsl */ `
        roughnessFactor = mix( roughnessFactor, 0.8, gSlab );
        metalnessFactor = mix( metalnessFactor, 0.0, gSlab );
      `,
      fEmissive: /* glsl */ `
        {
          float facing = abs( dot( normal, normalize( vViewPosition ) ) );
          float fr = fract( ( vAtmW.y - 1.2 ) / uFloor );
          float lamp = smoothstep( 0.0, 0.5, fr ) * 0.6 + 0.4;
          totalEmissiveRadiance += uWarm * gRoom * lamp * ( 1.0 - gSlab ) * mix( 0.12, 0.62, facing * facing );
        }
      `
    }
  );
  const stone = std({ color: 0xe6dfd3, roughness: 0.78, metalness: 0 }, { key: 'lib-stone' });
  const dark = std({ color: 0x2c2a28, roughness: 0.5, metalness: 0.6 }, { key: 'lib-dark' });
  const fins = std({ color: 0xb4593a, roughness: 0.42, metalness: 0.55, envMapIntensity: 1.8 }, { key: 'lib-fins' });
  const brass = std({ color: 0xc9a46a, roughness: 0.3, metalness: 0.85, envMapIntensity: 2 }, { key: 'lib-brass' });
  const green = std({ vertexColors: true, roughness: 0.92, metalness: 0 }, { key: 'lib-green' });
  // canopy: white panels on top (with seams), timber slats underneath
  const canopy = std(
    { color: 0xf1eee8, roughness: 0.55, metalness: 0.05 },
    {
      key: 'lib-canopy',
      vHead: 'varying float vUpN;',
      vEnd: 'vUpN = normalize( mat3( modelMatrix ) * objectNormal ).y;',
      fHead: 'varying float vUpN;',
      fColor: /* glsl */ `
        {
          vec2 p = vAtmW.xz;
          if ( vUpN < -0.2 ) {
            float s = fract( p.x / 0.9 );
            float aa = fwidth( p.x / 0.9 ) * 1.5;
            float gap = smoothstep( 0.0, aa + 0.08, s ) * smoothstep( 1.0, 0.92 - aa, s );
            diffuseColor.rgb = mix( vec3( 0.16, 0.09, 0.05 ), vec3( 0.62, 0.4, 0.22 ), gap );
          } else {
            vec2 q = vec2( p.x + p.y, p.x - p.y ) / 4.2;
            vec2 g = abs( fract( q ) - 0.5 );
            vec2 aa = fwidth( q ) * 1.2;
            float seam = 1.0 - min( smoothstep( 0.0, aa.x + 0.02, 0.5 - g.x ), smoothstep( 0.0, aa.y + 0.02, 0.5 - g.y ) );
            diffuseColor.rgb *= 1.0 - seam * 0.22;
          }
        }
      `
    }
  );
  // the oculus ring and the slit windows of the quiet room glow softly
  const glow = patch(new MeshBasicMaterial({ color: new Color(2.6, 2.1, 1.5) }), { key: 'lib-glow' });
  const glowCool = patch(new MeshBasicMaterial({ color: new Color(1.5, 2.3, 2.4) }), { key: 'lib-glow' });
  return { glass, stone, dark, fins, brass, green, canopy, glow, glowCool };
}

// a thin rectangle w × d swept up h, twisting from angle a0 to a1
function twistedFin(w, d, h, a0, a1, segs = 8) {
  const m = new Mesher();
  const C = [
    [-w / 2, -d / 2],
    [w / 2, -d / 2],
    [w / 2, d / 2],
    [-w / 2, d / 2]
  ];
  for (let s = 0; s < 4; s++) {
    const c0 = C[s];
    const c1 = C[(s + 1) % 4];
    let nx = c1[1] - c0[1];
    let nz = -(c1[0] - c0[0]);
    const l = Math.hypot(nx, nz);
    nx /= l;
    nz /= l;
    const base = m.p.length / 3;
    for (let i = 0; i <= segs; i++) {
      const f = i / segs;
      const y = f * h;
      const a = a0 + (a1 - a0) * f;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const r = (x, z) => [x * ca - z * sa, x * sa + z * ca];
      const p0 = r(c0[0], c0[1]);
      const p1 = r(c1[0], c1[1]);
      const n = r(nx, nz);
      m.v(p0[0], y, p0[1], n[0], 0, n[1], 0, y);
      m.v(p1[0], y, p1[1], n[0], 0, n[1], 1, y);
    }
    for (let i = 0; i < segs; i++) {
      const a = base + i * 2;
      m.quad(a, a + 2, a + 3, a + 1);
    }
  }
  return m.build();
}

// undulating canopy: a heightfield over a rounded rectangle, top + soffit + edge
function canopyGeo(cx, cz, hx, hz, yOf, thick = 0.7, nu = 64, nv = 22) {
  const m = new Mesher();
  const k = 0.45; // 0 square … 1 disc
  const P = (u, v) => {
    const x = cx + hx * (u * (1 - k) + k * u * Math.sqrt(1 - (v * v) / 2));
    const z = cz + hz * (v * (1 - k) + k * v * Math.sqrt(1 - (u * u) / 2));
    return [x, z];
  };
  const nrm = (x, z) => {
    const e = 0.5;
    const dx = (yOf(x + e, z) - yOf(x - e, z)) / (2 * e);
    const dz = (yOf(x, z + e) - yOf(x, z - e)) / (2 * e);
    const l = Math.hypot(dx, 1, dz);
    return [-dx / l, 1 / l, -dz / l];
  };
  const cols = nu + 1;
  for (const top of [true, false]) {
    const base = m.p.length / 3;
    for (let j = 0; j <= nv; j++)
      for (let i = 0; i <= nu; i++) {
        const [x, z] = P((i / nu) * 2 - 1, (j / nv) * 2 - 1);
        const y = yOf(x, z) - (top ? 0 : thick);
        const n = nrm(x, z);
        if (top) m.v(x, y, z, n[0], n[1], n[2], x, z);
        else m.v(x, y, z, -n[0], -n[1], -n[2], x, z);
      }
    for (let j = 0; j < nv; j++)
      for (let i = 0; i < nu; i++) {
        const a = base + j * cols + i;
        if (top) m.quad(a, a + cols, a + cols + 1, a + 1);
        else m.quad(a, a + 1, a + cols + 1, a + cols);
      }
  }
  // edge band around the outline
  const ring = [];
  for (let i = 0; i < nu; i++) ring.push([(i / nu) * 2 - 1, -1]);
  for (let j = 0; j < nv; j++) ring.push([1, (j / nv) * 2 - 1]);
  for (let i = nu; i > 0; i--) ring.push([(i / nu) * 2 - 1, 1]);
  for (let j = nv; j > 0; j--) ring.push([-1, (j / nv) * 2 - 1]);
  const pts = ring.map(([u, v]) => P(u, v));
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const [x0, z0] = pts[i];
    const [x1, z1] = pts[(i + 1) % n];
    let nx = z1 - z0;
    let nz = -(x1 - x0);
    const l = Math.hypot(nx, nz) || 1;
    nx /= l;
    nz /= l;
    const y0 = yOf(x0, z0);
    const y1 = yOf(x1, z1);
    const b = m.p.length / 3;
    m.v(x0, y0 - thick, z0, nx, 0, nz, 0, 0);
    m.v(x1, y1 - thick, z1, nx, 0, nz, 1, 0);
    m.v(x1, y1, z1, nx, 0, nz, 1, 1);
    m.v(x0, y0, z0, nx, 0, nz, 0, 1);
    m.quad(b, b + 3, b + 2, b + 1);
  }
  return m.build();
}

// a planter strip of clipped shrubs and grasses (vertex-coloured blobs)
function shrubs(list, x0, z0, x1, z1, y, n, rnd, size = 1) {
  const greens = [0x4f6b3a, 0x6a8448, 0x7f9455, 0x3f5a35, 0x8c9a5a];
  for (let i = 0; i < n; i++) {
    const f = rnd();
    const x = x0 + (x1 - x0) * f + (rnd() - 0.5) * 0.8;
    const z = z0 + (z1 - z0) * f + (rnd() - 0.5) * 0.8;
    const r = (0.5 + rnd() * 0.7) * size;
    const g = xf(roundBox(r * 2, r * 1.3, r * 2, r * 0.6, 1), { t: [x, y + r * 0.6, z], r: [0, rnd() * 3, 0] });
    list.push(tint(g, greens[Math.floor(rnd() * greens.length)]));
  }
}

export function buildLibrary({ tier }) {
  const M = mats();
  const P = { glass: [], stone: [], dark: [], fins: [], brass: [], green: [], canopy: [], glow: [], glowCool: [] };
  const add = (k, g) => (P[k].push(g), g);
  let seed = 4041;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const hi = tier.name === 'high';

  // ---- plinth and the south steps
  add('stone', xf(box(132, 1.2, 70), { t: [0, 0.6, -2] }));
  for (let i = 0; i < 5; i++) add('stone', xf(box(132, 1.2 - i * 0.24, 0.5), { t: [0, (1.2 - i * 0.24) / 2, 33.25 + i * 0.5] }));

  // ---- 5 Verification Commons: glazed public floor + canopy over the forecourt
  add('glass', xf(box(110, 8, 58), { t: [0, 1.2 + 4, -2] }));
  for (let x = -54; x <= 54.01; x += 3) {
    add('dark', xf(box(0.14, 8, 0.3), { t: [x, 5.2, 27.1] }));
    add('dark', xf(box(0.14, 8, 0.3), { t: [x, 5.2, -31.1] }));
  }
  for (let z = -30; z <= 27.01; z += 3) {
    add('dark', xf(box(0.3, 8, 0.14), { t: [-55.1, 5.2, z] }));
    add('dark', xf(box(0.3, 8, 0.14), { t: [55.1, 5.2, z] }));
  }
  add('stone', xf(box(116, 1.3, 64), { t: [0, 9.85, -2] })); // first-floor slab
  const canopyY = (x, z) => 13.2 + 1.7 * Math.sin(x * 0.072 + 0.5) * Math.cos((z - 46) * 0.14) + 0.6 * Math.sin(x * 0.17 + z * 0.09);
  add('canopy', canopyGeo(0, 46, 64, 17, canopyY, 0.8, hi ? 80 : 48, hi ? 26 : 16));
  // tree columns: a trunk splitting into four branches under the canopy
  for (const [x, z] of [[-46, 40], [-26, 50], [-8, 38], [12, 50], [30, 39], [48, 49], [-40, 55], [38, 56]]) {
    const yb = 6.5;
    add('stone', xf(cylinder(0.45, yb, 12, { rTop: 0.35 }), { t: [x, 0, z] }));
    for (let b = 0; b < 4; b++) {
      const a = b * (Math.PI / 2) + 0.4;
      const ex = x + Math.cos(a) * 3.4;
      const ez = z + Math.sin(a) * 3.4;
      add('stone', tube([new Vector3(x, yb - 0.2, z), new Vector3((x + ex) / 2, yb + 2.2, (z + ez) / 2), new Vector3(ex, canopyY(ex, ez) - 0.7, ez)], 0.2, 8));
    }
  }

  // ---- 1 Question Well: glass drum, mullions, stone crown, glowing oculus
  const WX = 0;
  const WZ = 2;
  const WR = 15;
  const W0 = 10.5;
  const W1 = 55;
  add('glass', xf(cylinder(WR, W1 - W0, 64, { caps: false }), { t: [WX, W0, WZ] }));
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    add('dark', xf(box(0.18, W1 - W0, 0.4), { t: [WX + Math.sin(a) * (WR + 0.1), W0 + (W1 - W0) / 2, WZ + Math.cos(a) * (WR + 0.1)], r: [0, a, 0] }));
  }
  add('stone', xf(ringSector(WR - 1.2, WR + 0.9, 0, Math.PI * 2, 2.2, 64), { t: [WX, W1, WZ] }));
  add('glowCool', xf(ringSector(WR - 1.6, WR - 1.15, 0, Math.PI * 2, 0.5, 64), { t: [WX, W1 + 2.0, WZ] }));
  // shallow glass lantern on top of the oculus
  const dome = [];
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * (Math.PI / 2);
    dome.push([Math.cos(a) * (WR - 1.6), Math.sin(a) * 3.2]);
  }
  add('glass', xf(lathe(dome, 64), { t: [WX, W1 + 2.2, WZ] }));

  // ---- 2 Provenance Stacks: west bar inside a screen of twisted fins
  const S = { x0: -57, x1: -19, z0: -28, z1: 24, y0: 10.5, y1: 38 };
  add('dark', xf(box(S.x1 - S.x0, S.y1 - S.y0, S.z1 - S.z0), { t: [(S.x0 + S.x1) / 2, (S.y0 + S.y1) / 2, (S.z0 + S.z1) / 2] }));
  // warm shelf light seen between the fins
  for (let y = S.y0 + 1.6; y < S.y1 - 1; y += 3.4) {
    add('glow', xf(box(S.x1 - S.x0 - 0.6, 0.35, 0.1), { t: [(S.x0 + S.x1) / 2, y, S.z1 + 0.06] }));
    add('glow', xf(box(S.x1 - S.x0 - 0.6, 0.35, 0.1), { t: [(S.x0 + S.x1) / 2, y, S.z0 - 0.06] }));
    add('glow', xf(box(0.1, 0.35, S.z1 - S.z0 - 0.6), { t: [S.x0 - 0.06, y, (S.z0 + S.z1) / 2] }));
  }
  const finH = S.y1 - S.y0 + 1.5;
  const step = hi ? 1.1 : 1.6;
  const runs = [
    // [start x, start z, dir x, dir z, length, outward x, outward z]
    [S.x0, S.z1 + 1.1, 1, 0, S.x1 - S.x0, 0, 1],
    [S.x1, S.z0 - 1.1, -1, 0, S.x1 - S.x0, 0, -1],
    [S.x0 - 1.1, S.z0, 0, 1, S.z1 - S.z0, -1, 0]
  ];
  let u = 0;
  for (const [sx, sz, dx, dz, len] of runs) {
    for (let s = step / 2; s < len; s += step) {
      u += step;
      const a0 = 0.95 * Math.sin(u * 0.085);
      const a1 = 0.95 * Math.sin(u * 0.085 + 1.9);
      const yaw = Math.atan2(dx, dz);
      const depth = 1.0 + 0.45 * Math.sin(u * 0.05 + 1.0);
      add('fins', xf(twistedFin(0.22, depth, finH, a0, a1, hi ? 10 : 6), { t: [sx + dx * s, S.y0 - 0.8, sz + dz * s], r: [0, yaw + Math.PI / 2, 0] }));
    }
  }
  add('stone', xf(box(S.x1 - S.x0 + 3.4, 0.9, S.z1 - S.z0 + 3.4), { t: [(S.x0 + S.x1) / 2, S.y1 + 0.45, (S.z0 + S.z1) / 2] }));
  // cantilevered planted terrace off the stacks' south face
  add('stone', xf(box(26, 0.8, 9), { t: [-40, 24.4, S.z1 + 5.6] }));
  add('glass', xf(box(26, 1.1, 0.12), { t: [-40, 25.35, S.z1 + 10] }));
  shrubs(P.green, -52, S.z1 + 8.6, -28, S.z1 + 8.6, 24.8, hi ? 26 : 14, rnd);
  // roof garden on the exposed strips of the stacks
  shrubs(P.green, -55, S.z1 - 1, -21, S.z1 - 1, 38.9, hi ? 30 : 16, rnd, 1.2);
  shrubs(P.green, -55, S.z0 + 1.5, -21, S.z0 + 1.5, 38.9, hi ? 24 : 12, rnd, 1.1);

  // ---- 3 Dialogue Alcoves: glass core with stacked, cantilevered pods
  add('glass', xf(box(14, 30.7, 40), { t: [27, 10.5 + 15.35, -1] }));
  add('stone', xf(box(14.6, 0.8, 40.6), { t: [27, 41.6, -1] }));
  const pods = [
    [42, 13.6, -14, 0.1], [44, 13.6, 4, -0.08], [40, 13.6, 18, 0.12],
    [48, 20.8, -6, -0.12], [45, 20.8, 13, 0.06],
    [44, 28.0, -16, 0.14], [50, 28.0, 2, -0.05],
    [46, 35.2, -4, 0.09], [42, 35.2, 15, -0.1]
  ];
  pods.forEach(([x, y, z, yaw], i) => {
    const w = 13 + (i % 3) * 1.6;
    const d = 9.5 + ((i * 7) % 3);
    const t = { t: [x, y, z], r: [0, yaw, 0] };
    add('brass', xf(roundBox(w + 0.6, 0.7, d + 0.6, 0.3, 2), { t: [x, y - 2.9, z], r: [0, yaw, 0] }));
    add('glass', xf(roundBox(w, 5.4, d, 1.6, 3), t));
    add('brass', xf(roundBox(w + 0.6, 0.7, d + 0.6, 0.3, 2), { t: [x, y + 2.9, z], r: [0, yaw, 0] }));
    // planted top on pods that are not covered by the one above
    const g = [];
    shrubs(g, -w / 2 + 1.5, -d / 2 + 1.5, w / 2 - 1.5, d / 2 - 1.5, 0, hi ? 9 : 5, rnd, 0.9);
    for (const s of g) P.green.push(xf(s, { t: [x, y + 3.25, z], r: [0, yaw, 0] }));
  });

  // ---- 4 Unassisted Room: a floating stone bar with a north-light roof
  const Q = { x0: -50, x1: 66, z0: -14, z1: 12, y0: 41.6, y1: 50 };
  add('stone', xf(box(Q.x1 - Q.x0, Q.y1 - Q.y0, Q.z1 - Q.z0), { t: [(Q.x0 + Q.x1) / 2, (Q.y0 + Q.y1) / 2, (Q.z0 + Q.z1) / 2] }));
  // one long slit window to the south, warm behind
  add('glow', xf(box(Q.x1 - Q.x0 - 10, 1.1, 0.12), { t: [(Q.x0 + Q.x1) / 2 + 2, Q.y0 + 4.2, Q.z1 + 0.04] }));
  add('dark', xf(box(Q.x1 - Q.x0 - 9.6, 0.18, 0.5), { t: [(Q.x0 + Q.x1) / 2 + 2, Q.y0 + 3.55, Q.z1 + 0.2] }));
  // sawtooth roof: teeth along the bar, each a slope rising east to a
  // glazed upstand, so the skyline of the quiet room reads as a saw blade
  const teeth = 10;
  const tw = (Q.x1 - Q.x0) / teeth;
  const hgt = 3.4;
  const zN = Q.z0 + 0.8;
  const zS = Q.z1 - 0.8;
  for (let i = 0; i < teeth; i++) {
    const xa = Q.x0 + tw * i + 0.25;
    const xb = Q.x0 + tw * (i + 1) - 0.25;
    const L = xb - xa;
    const sl = Math.hypot(L, hgt);
    const sm = new Mesher();
    const nx = -hgt / sl;
    const ny = L / sl;
    const a = sm.v(xa, 0, zS, nx, ny, 0, 0, 0);
    const b = sm.v(xb, hgt, zS, nx, ny, 0, L, 0);
    const c = sm.v(xb, hgt, zN, nx, ny, 0, L, zS - zN);
    const d = sm.v(xa, 0, zN, nx, ny, 0, 0, zS - zN);
    sm.quad(a, b, c, d);
    // gable triangles, south (+z) and north (-z)
    const e = sm.v(xa, 0, zS, 0, 0, 1, 0, 0);
    const f = sm.v(xb, 0, zS, 0, 0, 1, L, 0);
    const g = sm.v(xb, hgt, zS, 0, 0, 1, L, hgt);
    sm.tri(e, f, g);
    const h = sm.v(xa, 0, zN, 0, 0, -1, 0, 0);
    const k = sm.v(xb, 0, zN, 0, 0, -1, L, 0);
    const l = sm.v(xb, hgt, zN, 0, 0, -1, L, hgt);
    sm.tri(h, l, k);
    add('stone', xf(sm.build(), { t: [0, Q.y1, 0] }));
    add('glass', xf(box(0.16, hgt, zS - zN), { t: [xb + 0.08, Q.y1 + hgt / 2, (zN + zS) / 2] }));
  }
  // timber-dark soffit under the cantilever, a planted roof edge at the east end
  add('dark', xf(box(18, 0.3, Q.z1 - Q.z0 - 1), { t: [Q.x1 - 9, Q.y0 - 0.15, (Q.z0 + Q.z1) / 2] }));
  shrubs(P.green, Q.x0 + 2, Q.z1 - 0.6, Q.x1 - 2, Q.z1 - 0.6, Q.y1, hi ? 30 : 16, rnd, 0.7);

  // ---- merge per material
  const group = new Group();
  group.name = 'library';
  for (const [k, list] of Object.entries(P)) {
    if (!list.length) continue;
    const mesh = new Mesh(merge(list), M[k]);
    mesh.castShadow = k !== 'glow' && k !== 'glowCool';
    mesh.receiveShadow = k !== 'glow' && k !== 'glowCool';
    mesh.name = `library-${k}`;
    group.add(mesh);
  }

  // ---- question slips rising out of the oculus (one instanced draw)
  const NS = hi ? 140 : 70;
  const slipGeo = plane(0.7, 0.95);
  xf(slipGeo, { r: [Math.PI / 2, 0, 0] }); // stand the quad up (facing +z)
  const seeds = new Float32Array(NS * 4);
  for (let i = 0; i < NS; i++) {
    seeds[i * 4] = rnd() * Math.PI * 2;
    seeds[i * 4 + 1] = rnd() * (WR - 3);
    seeds[i * 4 + 2] = rnd();
    seeds[i * 4 + 3] = 0.7 + rnd() * 0.6;
  }
  const slipMat = patch(
    new MeshBasicMaterial({ color: new Color(1.9, 1.6, 1.15), transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide }),
    {
      key: 'lib-slips',
      additive: true,
      uniforms: { uOrigin: { value: new Vector3(WX, W1 + 1, WZ) } },
      vHead: /* glsl */ `
        attribute vec4 aSeed;
        uniform vec3 uOrigin;
        varying float vFade;
      `,
      vBegin: /* glsl */ `
        {
          float life = fract( aSeed.z + uTime * 0.018 * aSeed.w );
          float h = life * 70.0;
          float a = aSeed.x + life * 2.2;
          float r = aSeed.y * ( 1.0 + life * 1.6 );
          vec3 c = uOrigin + vec3( sin( a ) * r + life * life * 26.0, h, cos( a ) * r + life * life * 9.0 );
          float spin = uTime * ( 0.6 + aSeed.w ) + aSeed.x * 3.0;
          float cs = cos( spin ), sn = sin( spin );
          vec3 p = transformed;
          p = vec3( p.x * cs - p.z * sn, p.y, p.x * sn + p.z * cs );
          float tilt = 0.4 * sin( uTime * 1.3 + aSeed.x * 5.0 );
          p = vec3( p.x, p.y * cos( tilt ) - p.z * sin( tilt ), p.y * sin( tilt ) + p.z * cos( tilt ) );
          transformed = c + p * ( 0.6 + 0.4 * smoothstep( 0.0, 0.1, life ) );
          vFade = smoothstep( 0.0, 0.06, life ) * smoothstep( 1.0, 0.55, life );
        }
      `,
      fHead: 'varying float vFade;',
      fColor: 'diffuseColor.rgb *= vFade; diffuseColor.a *= vFade;'
    }
  );
  const slips = new InstancedMesh(slipGeo, slipMat, NS);
  slips.geometry.setAttribute('aSeed', new InstancedBufferAttribute(seeds, 4));
  const dummy = new Object3D();
  for (let i = 0; i < NS; i++) slips.setMatrixAt(i, dummy.matrix);
  slips.frustumCulled = false;
  slips.renderOrder = 2;
  group.add(slips);

  // label anchors and camera framings per zone (zone order: well, provenance,
  // dialogue, quiet, verify)
  const anchors = {
    well: new Vector3(WX, W1 + 6, WZ),
    provenance: new Vector3(S.x0 - 2, 30, S.z1 - 6),
    dialogue: new Vector3(52, 38.5, 8),
    quiet: new Vector3(30, Q.y1 + 4.5, -2),
    verify: new Vector3(4, 15.8, 54)
  };
  const focus = {
    well: { target: new Vector3(WX, 34, WZ), radius: 120, phi: 0.95 },
    provenance: { target: new Vector3(-40, 24, 0), radius: 120, theta: -0.55, phi: 1.2 },
    dialogue: { target: new Vector3(42, 26, 0), radius: 115, theta: 1.35, phi: 1.2 },
    quiet: { target: new Vector3(10, 45, 0), radius: 135, phi: 1.05 },
    verify: { target: new Vector3(0, 8, 40), radius: 105, theta: 0.25, phi: 1.22 }
  };
  return { group, anchors, focus, materials: M, footprint: { x0: -66, x1: 66, z0: -37, z1: 62 } };
}
