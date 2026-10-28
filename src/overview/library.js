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
  DoubleSide,
  Plane
} from 'three';
import { Mesher, roundBox, box, cylinder, lathe, ringSector, tube, merge, xf, tint, plane } from '../core/geo.js';
import { patch } from './atmos.js';

// The Library of Open Questions as one small civic building, in metres,
// entrance to the south (+z), sized so that each of the book's five rooms
// (src/diorama/scenes.js, 1:1) stands inside its own legible part:
//   1 Question Well        a glass drum in the middle, its oculus breathing
//                          paper slips up into the air
//   2 Provenance Stacks    the west bar, wrapped in twisted terracotta fins
//                          (the red thread, drawn as a facade)
//   3 Dialogue Alcoves     the east wing: glazed pods stacked and cantilevered
//                          off a glass core, planted on top
//   4 Unassisted Room      a quiet, stone-clad bar raised on columns at the
//                          back, north-light sawtooth roof
//   5 Verification Commons the glazed public room at the front and the
//                          undulating canopy over the forecourt
// Each zone's shell is merged per material into its own group, whose
// materials share one clipping plane: lowering it cuts the zone open like a
// sectioned model (see index.js). The plinth, the raised floor and the
// columns are never cut. The slips are one instanced draw animated in the
// vertex shader.

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

// a hollow box: four walls t thick and an optional roof slab
function hollow(add, k, x0, x1, z0, z1, y0, y1, t = 0.25, roof = null) {
  const h = y1 - y0;
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  add(k, xf(box(x1 - x0, h, t), { t: [cx, y0 + h / 2, z1 - t / 2] }));
  add(k, xf(box(x1 - x0, h, t), { t: [cx, y0 + h / 2, z0 + t / 2] }));
  add(k, xf(box(t, h, z1 - z0 - 2 * t), { t: [x0 + t / 2, y0 + h / 2, cz] }));
  add(k, xf(box(t, h, z1 - z0 - 2 * t), { t: [x1 - t / 2, y0 + h / 2, cz] }));
  if (roof) add(roof, xf(box(x1 - x0 + 0.5, 0.45, z1 - z0 + 0.5), { t: [cx, y1 + 0.22, cz] }));
}

const BASE = 0.6; // top of the stone plinth

// where each zone's room stands: the book's miniature at 1:1 (a 5.7 × 6.7 m
// plinth, walls at its back (-z) and right (+x), open to the front and the
// left); ry turns a room so that its open sides face out of the building
export const ROOMS = {
  well: { x: 0, y: BASE, z: 0, ry: 0 },
  provenance: { x: -10.6, y: BASE, z: -0.4, ry: 0 },
  dialogue: { x: 10.6, y: BASE, z: -0.4, ry: Math.PI / 2 },
  quiet: { x: 0, y: 5.0, z: -11.8, ry: 0 },
  verify: { x: 0, y: BASE, z: 11.6, ry: 0 }
};

export function buildLibrary({ tier }) {
  let seed = 4041;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const hi = tier.name === 'high';
  const lists = () => ({ glass: [], stone: [], dark: [], fins: [], brass: [], green: [], canopy: [], glow: [], glowCool: [] });
  const group = new Group();
  group.name = 'library';
  function emit(P, M, parent, name) {
    for (const [k, list] of Object.entries(P)) {
      if (!list.length) continue;
      const mesh = new Mesh(merge(list), M[k]);
      const lit = k !== 'glow' && k !== 'glowCool';
      mesh.castShadow = lit;
      mesh.receiveShadow = lit;
      mesh.name = `${name}-${k}`;
      parent.add(mesh);
    }
  }

  // ---- never cut: plinth, forecourt steps, the quiet room's raised floor
  const base = lists();
  {
    const add = (k, g) => base[k].push(g);
    add('stone', xf(box(34, BASE, 46), { t: [0, BASE / 2, 5] }));
    for (let i = 0; i < 3; i++) add('stone', xf(box(30, BASE - (i + 1) * 0.15, 0.45), { t: [0, (BASE - (i + 1) * 0.15) / 2, 28.2 + i * 0.45] }));
    add('stone', xf(box(25, 0.4, 8.6), { t: [0, 4.8, -11.8] }));
    for (const x of [-11, -5.5, 5.5, 11]) for (const z of [-15, -8.6]) add('stone', xf(cylinder(0.26, 4.2, 12), { t: [x, BASE, z] }));
    // planters along the forecourt
    shrubs(base.green, -15.5, 18, -15.5, 27, BASE, hi ? 10 : 6, rnd, 0.5);
    shrubs(base.green, 15.5, 18, 15.5, 27, BASE, hi ? 10 : 6, rnd, 0.5);
    shrubs(base.green, -15.5, -16, -15.5, 6, BASE, hi ? 12 : 7, rnd, 0.45);
    shrubs(base.green, 15.5, -16, 15.5, 6, BASE, hi ? 12 : 7, rnd, 0.45);
  }
  const baseMats = mats();
  emit(base, baseMats, group, 'library-base');

  // ---- the five shells
  const zones = {};
  function zone(id, top, build) {
    const P = lists();
    const add = (k, g) => (P[k].push(g), g);
    build(add, P);
    const M = mats();
    const clip = new Plane(new Vector3(0, -1, 0), top + 1);
    for (const m of Object.values(M)) {
      m.clippingPlanes = [clip];
      m.clipShadows = true;
      m.side = DoubleSide;
    }
    const g = new Group();
    g.name = `shell-${id}`;
    emit(P, M, g, `shell-${id}`);
    group.add(g);
    zones[id] = { group: g, clip, top, floor: ROOMS[id].y, materials: M };
  }

  // 1 Question Well: glass drum, mullions, stone crown, glowing oculus
  const WR = 4.9;
  const W1 = 10.8;
  zone('well', W1 + 2.4, (add) => {
    add('glass', xf(cylinder(WR, W1 - BASE, 48, { caps: false }), { t: [0, BASE, 0] }));
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      add('dark', xf(box(0.1, W1 - BASE, 0.22), { t: [Math.sin(a) * (WR + 0.06), (BASE + W1) / 2, Math.cos(a) * (WR + 0.06)], r: [0, a, 0] }));
    }
    add('stone', xf(ringSector(WR - 0.05, WR + 0.3, 0, Math.PI * 2, 0.3, 48), { t: [0, BASE, 0] }));
    add('stone', xf(ringSector(WR - 0.7, WR + 0.45, 0, Math.PI * 2, 0.9, 48), { t: [0, W1, 0] }));
    add('glowCool', xf(ringSector(WR - 0.95, WR - 0.7, 0, Math.PI * 2, 0.22, 48), { t: [0, W1 + 0.95, 0] }));
    const dome = [];
    for (let i = 0; i <= 8; i++) {
      const a = (i / 8) * (Math.PI / 2);
      dome.push([Math.cos(a) * (WR - 0.95), Math.sin(a) * 1.3]);
    }
    add('glass', xf(lathe(dome, 48), { t: [0, W1 + 0.9, 0] }));
  });

  // 2 Provenance Stacks: west bar inside a screen of twisted fins
  const S = { x0: -14.6, x1: -6.6, z0: -5.4, z1: 4.6, y1: 8.4 };
  zone('provenance', S.y1 + 1, (add) => {
    hollow(add, 'dark', S.x0, S.x1, S.z0, S.z1, BASE, S.y1, 0.25, 'stone');
    for (let y = BASE + 1.0; y < S.y1 - 0.5; y += 1.25) {
      add('glow', xf(box(S.x1 - S.x0 - 0.4, 0.14, 0.05), { t: [(S.x0 + S.x1) / 2, y, S.z1 + 0.03] }));
      add('glow', xf(box(S.x1 - S.x0 - 0.4, 0.14, 0.05), { t: [(S.x0 + S.x1) / 2, y, S.z0 - 0.03] }));
      add('glow', xf(box(0.05, 0.14, S.z1 - S.z0 - 0.4), { t: [S.x0 - 0.03, y, (S.z0 + S.z1) / 2] }));
    }
    const finH = S.y1 - BASE + 0.5;
    const step = hi ? 0.5 : 0.7;
    const runs = [
      [S.x0, S.z1 + 0.45, 1, 0, S.x1 - S.x0],
      [S.x1, S.z0 - 0.45, -1, 0, S.x1 - S.x0],
      [S.x0 - 0.45, S.z0, 0, 1, S.z1 - S.z0]
    ];
    let u = 0;
    for (const [sx, sz, dx, dz, len] of runs) {
      for (let s = step / 2; s < len; s += step) {
        u += step * 2.2;
        const a0 = 0.95 * Math.sin(u * 0.085);
        const a1 = 0.95 * Math.sin(u * 0.085 + 1.9);
        const depth = 0.42 + 0.18 * Math.sin(u * 0.05 + 1.0);
        add('fins', xf(twistedFin(0.1, depth, finH, a0, a1, hi ? 10 : 6), { t: [sx + dx * s, BASE, sz + dz * s], r: [0, Math.atan2(dx, dz) + Math.PI / 2, 0] }));
      }
    }
  });
  // 3 Dialogue Alcoves: a glazed ground pod, two cantilevered pods above
  zone('dialogue', BASE + 13, (add, P) => {
    const x0 = 6.8;
    const x1 = 14.4;
    const z0 = -4.1;
    const z1 = 3.3;
    const y1 = BASE + 4.0;
    hollow(add, 'glass', x0, x1, z0, z1, BASE, y1, 0.1);
    for (let x = x0; x <= x1 + 0.01; x += 1.9) add('dark', xf(box(0.08, y1 - BASE, 0.14), { t: [x, (BASE + y1) / 2, z1] }));
    for (let z = z0; z <= z1 + 0.01; z += 1.85) add('dark', xf(box(0.14, y1 - BASE, 0.08), { t: [x1, (BASE + y1) / 2, z] }));
    add('brass', xf(roundBox(x1 - x0 + 0.4, 0.4, z1 - z0 + 0.4, 0.15, 2), { t: [(x0 + x1) / 2, y1 + 0.2, (z0 + z1) / 2] }));
    // glass core rising behind
    add('glass', xf(box(1.6, 8.6, 5.2), { t: [7.7, y1 + 0.4 + 4.3, -0.6] }));
    const pods = [
      [11.6, y1 + 2.4, -1.6, 0.12, 6.8, 3.2, 5.8],
      [10.4, y1 + 6.2, 0.9, -0.1, 6.0, 3.0, 5.4]
    ];
    for (const [x, y, z, yaw, w, h, d] of pods) {
      add('brass', xf(roundBox(w + 0.3, 0.3, d + 0.3, 0.12, 2), { t: [x, y - h / 2 - 0.15, z], r: [0, yaw, 0] }));
      add('glass', xf(roundBox(w, h, d, 0.8, 3), { t: [x, y, z], r: [0, yaw, 0] }));
      add('brass', xf(roundBox(w + 0.3, 0.3, d + 0.3, 0.12, 2), { t: [x, y + h / 2 + 0.15, z], r: [0, yaw, 0] }));
      const g = [];
      shrubs(g, -w / 2 + 0.8, -d / 2 + 0.8, w / 2 - 0.8, d / 2 - 0.8, 0, hi ? 7 : 4, rnd, 0.4);
      for (const s of g) P.green.push(xf(s, { t: [x, y + h / 2 + 0.3, z], r: [0, yaw, 0] }));
    }
  });

  // 4 Unassisted Room: a stone bar on columns, north-light sawtooth roof
  const Q = { x0: -12, x1: 12, z0: -15.8, z1: -7.8, y0: 5.0, y1: 8.6 };
  zone('quiet', Q.y1 + 2, (add) => {
    hollow(add, 'stone', Q.x0, Q.x1, Q.z0, Q.z1, Q.y0, Q.y1, 0.3);
    add('glow', xf(box(Q.x1 - Q.x0 - 4, 0.45, 0.05), { t: [0, Q.y0 + 2.2, Q.z1 + 0.03] }));
    add('dark', xf(box(Q.x1 - Q.x0 - 3.8, 0.1, 0.25), { t: [0, Q.y0 + 1.95, Q.z1 + 0.12] }));
    const teeth = 6;
    const tw = (Q.x1 - Q.x0) / teeth;
    const hgt = 1.4;
    const zN = Q.z0;
    const zS = Q.z1;
    for (let i = 0; i < teeth; i++) {
      const xa = Q.x0 + tw * i;
      const xb = Q.x0 + tw * (i + 1) - 0.1;
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
      const e = sm.v(xa, 0, zS, 0, 0, 1, 0, 0);
      const f = sm.v(xb, 0, zS, 0, 0, 1, L, 0);
      const g = sm.v(xb, hgt, zS, 0, 0, 1, L, hgt);
      sm.tri(e, f, g);
      const h = sm.v(xa, 0, zN, 0, 0, -1, 0, 0);
      const k = sm.v(xb, 0, zN, 0, 0, -1, L, 0);
      const l = sm.v(xb, hgt, zN, 0, 0, -1, L, hgt);
      sm.tri(h, l, k);
      add('stone', xf(sm.build(), { t: [0, Q.y1, 0] }));
      add('glass', xf(box(0.1, hgt, zS - zN), { t: [xb + 0.05, Q.y1 + hgt / 2, (zN + zS) / 2] }));
    }
  });

  // 5 Verification Commons: the glazed public room and the forecourt canopy
  const V = { x0: -8, x1: 8, z0: 7.4, z1: 16.2, y1: BASE + 4.0 };
  const canopyY = (x, z) => 5.6 + 0.45 * Math.sin(x * 0.3 + 0.5) * Math.cos((z - 21.6) * 0.5) + 0.2 * Math.sin(x * 0.7 + z * 0.4);
  zone('verify', 7.2, (add) => {
    hollow(add, 'glass', V.x0, V.x1, V.z0, V.z1, BASE, V.y1, 0.1, 'stone');
    for (let x = V.x0; x <= V.x1 + 0.01; x += 1.6) add('dark', xf(box(0.08, V.y1 - BASE, 0.14), { t: [x, (BASE + V.y1) / 2, V.z1] }));
    for (let z = V.z0; z <= V.z1 + 0.01; z += 1.76) {
      add('dark', xf(box(0.14, V.y1 - BASE, 0.08), { t: [V.x0, (BASE + V.y1) / 2, z] }));
      add('dark', xf(box(0.14, V.y1 - BASE, 0.08), { t: [V.x1, (BASE + V.y1) / 2, z] }));
    }
    add('canopy', canopyGeo(0, 21.8, 13, 5.4, canopyY, 0.3, hi ? 64 : 40, hi ? 20 : 14));
    for (const [x, z] of [[-9, 19.5], [-3, 24], [3.5, 19.6], [9.5, 23.8]]) {
      const yb = 3.0;
      add('stone', xf(cylinder(0.16, yb - BASE, 10, { rTop: 0.12 }), { t: [x, BASE, z] }));
      for (let b = 0; b < 4; b++) {
        const a = b * (Math.PI / 2) + 0.4;
        const ex = x + Math.cos(a) * 1.4;
        const ez = z + Math.sin(a) * 1.4;
        add('stone', tube([new Vector3(x, yb - 0.1, z), new Vector3((x + ex) / 2, yb + 0.9, (z + ez) / 2), new Vector3(ex, canopyY(ex, ez) - 0.3, ez)], 0.07, 6));
      }
    }
  });

  // ---- question slips rising out of the oculus (one instanced draw)
  const NS = hi ? 90 : 50;
  const slipGeo = plane(0.3, 0.4);
  xf(slipGeo, { r: [Math.PI / 2, 0, 0] }); // stand the quad up (facing +z)
  const seeds = new Float32Array(NS * 4);
  for (let i = 0; i < NS; i++) {
    seeds[i * 4] = rnd() * Math.PI * 2;
    seeds[i * 4 + 1] = rnd() * (WR - 1.2);
    seeds[i * 4 + 2] = rnd();
    seeds[i * 4 + 3] = 0.7 + rnd() * 0.6;
  }
  const slipMat = patch(
    new MeshBasicMaterial({ color: new Color(1.9, 1.6, 1.15), transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide }),
    {
      key: 'lib-slips',
      additive: true,
      uniforms: { uOrigin: { value: new Vector3(0, W1 + 0.6, 0) } },
      vHead: /* glsl */ `
        attribute vec4 aSeed;
        uniform vec3 uOrigin;
        varying float vFade;
      `,
      vBegin: /* glsl */ `
        {
          float life = fract( aSeed.z + uTime * 0.03 * aSeed.w );
          float h = life * 22.0;
          float a = aSeed.x + life * 2.2;
          float r = aSeed.y * ( 1.0 + life * 1.2 );
          vec3 c = uOrigin + vec3( sin( a ) * r + life * life * 7.0, h, cos( a ) * r + life * life * 2.5 );
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

  // label anchors: over each shell from afar, over its room once cut open
  // (index.js blends them); camera framings: in close, looking into the
  // room's open front from a little to its left
  const shellAnchors = {
    well: new Vector3(0, W1 + 2.6, 0),
    provenance: new Vector3(S.x0 - 0.4, S.y1 - 1.5, S.z1 - 1.5),
    dialogue: new Vector3(13.6, BASE + 11.8, 1.4),
    quiet: new Vector3(6, Q.y1 + 1.8, Q.z1 - 1),
    verify: new Vector3(2, 6.4, 22.5)
  };
  const anchors = {};
  const roomAnchors = {};
  const focus = {};
  for (const [id, r] of Object.entries(ROOMS)) {
    anchors[id] = shellAnchors[id].clone();
    roomAnchors[id] = new Vector3(r.x, r.y + 3.9, r.z);
    focus[id] = { target: new Vector3(r.x, r.y + 1.2, r.z), radius: 11.5, phi: 1.0, theta: r.ry - 0.45 };
  }
  return { group, zones, anchors, shellAnchors, roomAnchors, focus, rooms: ROOMS, materials: baseMats, footprint: { x0: -17, x1: 17, z0: -18, z1: 29 } };
}
