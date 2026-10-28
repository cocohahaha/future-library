import { InstancedMesh, InstancedBufferAttribute, MeshStandardMaterial, Group, Color, Vector4 } from 'three';
import { roundBox, box, sphere, cylinder, merge, xf, tint, delay } from '../core/geo.js';
import { patch } from './atmos.js';
import { GRID, SITE } from './city.js';

// Ambient life, all animated in the vertex shader from per-instance seeds, so
// it costs nothing on the CPU: people strolling to and fro on the plaza, the
// decks and the sidewalks; traffic on the streets around the superblock;
// drones circling and crossing above the towers with blinking lights.

const PI = Math.PI;

function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

// ---------------------------------------------------------------- people
function personGeo() {
  const legs = tint(xf(roundBox(0.34, 0.86, 0.22, 0.08, 1), { t: [0, 0.43, 0] }), 0x2a2a2e);
  const torso = tint(xf(roundBox(0.46, 0.66, 0.28, 0.12, 1), { t: [0, 1.2, 0] }), 0xffffff);
  const head = tint(xf(sphere(0.12, 8, 6), { t: [0, 1.66, 0] }), 0xc8a088);
  return merge([legs, torso, head]);
}

function peopleMaterial() {
  return patch(new MeshStandardMaterial({ vertexColors: true, roughness: 0.8 }), {
    key: 'life-people',
    vHead: /* glsl */ `
      attribute vec4 aWalk;  // centre x, centre z, heading, half length
      attribute vec4 aGait;  // speed m/s, phase, ground y, cloth hue
      varying float vHue;
      float pYaw; float pPh; float pMove;
    `,
    vNormal: /* glsl */ `
      pMove = step( 0.01, aGait.x );
      pPh = aGait.y + uTime * aGait.x / max( aWalk.w, 0.5 );
      pYaw = aWalk.z + ( cos( pPh ) >= 0.0 ? 0.0 : 3.14159265 );
      {
        float cs = cos( pYaw ), sn = sin( pYaw );
        objectNormal = vec3( objectNormal.x * cs + objectNormal.z * sn, objectNormal.y, -objectNormal.x * sn + objectNormal.z * cs );
      }
      vHue = aGait.w;
    `,
    vBegin: /* glsl */ `
      {
        float s = sin( pPh ) * aWalk.w * pMove;
        vec2 d = vec2( sin( aWalk.z ), cos( aWalk.z ) );
        vec2 c = aWalk.xy + d * s;
        float cyc = uTime * aGait.x * 2.4 + aGait.y * 7.0;
        vec3 p = transformed;
        if ( p.y < 0.86 ) p.z += sin( cyc + ( p.x > 0.0 ? 0.0 : 3.14159 ) ) * 0.22 * ( 0.86 - p.y ) * pMove;
        p.y += abs( sin( cyc ) ) * 0.035 * pMove;
        float cs = cos( pYaw ), sn = sin( pYaw );
        p = vec3( p.x * cs + p.z * sn, p.y, -p.x * sn + p.z * cs );
        transformed = vec3( c.x, aGait.z, c.y ) + p * 1.15;
      }
    `,
    fHead: /* glsl */ `
      varying float vHue;
      vec3 cloth( float h ) {
        vec3 a = vec3( 0.75, 0.32, 0.18 ), b = vec3( 0.18, 0.3, 0.5 ), c = vec3( 0.85, 0.82, 0.76 ), d = vec3( 0.55, 0.6, 0.35 ), e = vec3( 0.9, 0.7, 0.3 );
        return h < 0.2 ? a : h < 0.4 ? b : h < 0.62 ? c : h < 0.8 ? d : e;
      }
    `,
    fColor: 'if ( vColor.r > 0.97 && vColor.b > 0.97 ) diffuseColor.rgb = cloth( vHue );'
  });
}

// ---------------------------------------------------------------- cars
function carGeo() {
  const body = tint(xf(roundBox(1.9, 0.75, 4.5, 0.3, 1), { t: [0, 0.6, 0] }), 0xffffff);
  const cabin = tint(xf(roundBox(1.7, 0.6, 2.5, 0.25, 1), { t: [0, 1.2, -0.2] }), 0x1b2024);
  const head = delay(tint(xf(box(1.5, 0.18, 0.1), { t: [0, 0.72, 2.26] }), 0xffffff), 0.5);
  const tail = delay(tint(xf(box(1.6, 0.16, 0.1), { t: [0, 0.78, -2.26] }), 0xffffff), 1);
  return merge([delay(body, 0), delay(cabin, 0), head, tail]);
}

function carMaterial() {
  return patch(new MeshStandardMaterial({ vertexColors: true, roughness: 0.3, metalness: 0.5 }), {
    key: 'life-cars',
    uniforms: { uSite: { value: new Vector4(SITE.x0 - 4, SITE.z0 - 4, SITE.x1 + 4, SITE.z1 + 4) } },
    vHead: /* glsl */ `
      attribute vec4 aCar;   // axis (0: runs along z), line coordinate, speed (signed), phase
      attribute float aDelay;
      varying float vGlow;
      uniform vec4 uSite;
      float cYaw;
      vec2 cPos;
    `,
    vNormal: /* glsl */ `
      {
        float L = 2400.0;
        float s = mod( aCar.w + uTime * aCar.z, L ) - L * 0.5;
        cPos = aCar.x < 0.5 ? vec2( aCar.y, s ) : vec2( s, aCar.y );
        cYaw = aCar.x < 0.5 ? ( aCar.z > 0.0 ? 0.0 : 3.14159265 ) : ( aCar.z > 0.0 ? 1.5707963 : -1.5707963 );
        float cs = cos( cYaw ), sn = sin( cYaw );
        objectNormal = vec3( objectNormal.x * cs + objectNormal.z * sn, objectNormal.y, -objectNormal.x * sn + objectNormal.z * cs );
      }
      vGlow = aDelay;
    `,
    vBegin: /* glsl */ `
      {
        float cs = cos( cYaw ), sn = sin( cYaw );
        vec3 p = transformed;
        p = vec3( p.x * cs + p.z * sn, p.y, -p.x * sn + p.z * cs );
        // no streets inside the civic superblock
        float inSite = step( uSite.x, cPos.x ) * step( cPos.x, uSite.z ) * step( uSite.y, cPos.y ) * step( cPos.y, uSite.w );
        transformed = vec3( cPos.x, 0.0, cPos.y ) + p * ( 1.0 - inSite );
      }
    `,
    fHead: 'varying float vGlow;',
    fEmissive: /* glsl */ `
      totalEmissiveRadiance += vec3( 1.0, 0.92, 0.75 ) * 3.0 * step( 0.25, vGlow ) * step( vGlow, 0.75 );
      totalEmissiveRadiance += vec3( 1.0, 0.08, 0.04 ) * 2.2 * step( 0.9, vGlow );
    `
  });
}

// ---------------------------------------------------------------- drones
function droneGeo() {
  const parts = [tint(roundBox(1.1, 0.34, 1.1, 0.12, 1), 0x30343a)];
  for (let i = 0; i < 4; i++) {
    const a = PI / 4 + (i * PI) / 2;
    const x = Math.sin(a) * 0.95;
    const z = Math.cos(a) * 0.95;
    parts.push(tint(xf(box(0.12, 0.08, 1.3), { t: [x / 2, 0, z / 2], r: [0, a, 0] }), 0x30343a));
    parts.push(tint(xf(cylinder(0.42, 0.04, 12), { t: [x, 0.12, z] }), 0x8a9096));
  }
  parts.push(delay(tint(xf(sphere(0.2, 8, 6), { t: [0, -0.28, 0] }), 0xffffff), 1));
  return merge(parts.map((g) => (g.attributes.aDelay ? g : delay(g, 0))));
}

function droneMaterial() {
  return patch(new MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0.6 }), {
    key: 'life-drones',
    vHead: /* glsl */ `
      attribute vec4 aFly;   // centre x, centre z, radius (negative: straight run of that half length), altitude
      attribute vec4 aFly2;  // angular speed, phase, heading for runs, light hue
      attribute float aDelay;
      varying float vGlow;
      varying vec2 vBlink;
      float dYaw;
      vec3 dPos;
    `,
    vNormal: /* glsl */ `
      {
        float ph = aFly2.y + uTime * aFly2.x;
        if ( aFly.z > 0.0 ) {
          dPos = vec3( aFly.x + sin( ph ) * aFly.z, aFly.w + sin( ph * 3.0 ) * 1.5, aFly.y + cos( ph ) * aFly.z );
          dYaw = ph + 1.5707963 * sign( aFly2.x );
        } else {
          float s = sin( ph ) * -aFly.z;
          dPos = vec3( aFly.x + sin( aFly2.z ) * s, aFly.w + sin( ph * 2.0 ) * 2.0, aFly.y + cos( aFly2.z ) * s );
          dYaw = aFly2.z + ( cos( ph ) >= 0.0 ? 0.0 : 3.14159265 );
        }
        float cs = cos( dYaw ), sn = sin( dYaw );
        objectNormal = vec3( objectNormal.x * cs + objectNormal.z * sn, objectNormal.y, -objectNormal.x * sn + objectNormal.z * cs );
      }
      vGlow = aDelay;
      vBlink = vec2( step( 0.72, fract( uTime * 0.9 + aFly2.y ) ), aFly2.w );
    `,
    vBegin: /* glsl */ `
      {
        float cs = cos( dYaw ), sn = sin( dYaw );
        vec3 p = transformed * 1.6;
        p = vec3( p.x * cs + p.z * sn, p.y, -p.x * sn + p.z * cs );
        transformed = dPos + p;
      }
    `,
    fHead: 'varying float vGlow; varying vec2 vBlink;',
    fEmissive: /* glsl */ `
      {
        vec3 lc = vBlink.y < 0.33 ? vec3( 1.0, 0.12, 0.08 ) : vBlink.y < 0.66 ? vec3( 0.2, 1.0, 0.45 ) : vec3( 1.0, 0.95, 0.85 );
        totalEmissiveRadiance += lc * step( 0.5, vGlow ) * ( 0.6 + 9.0 * vBlink.x );
      }
    `
  });
}

// ---------------------------------------------------------------- build
export function buildLife({ tier }) {
  const hi = tier.name === 'high';
  const rnd = rng(2207);
  const group = new Group();
  group.name = 'life';

  // ---- people
  const walkable = (x, z) => {
    if (x < SITE.x0 + 2 || x > SITE.x1 - 2 || z < SITE.z0 + 2 || z > SITE.z1 - 2) return false;
    if (x > -67 && x < 67 && z > -38 && z < 36) return false; // the building
    if (x > -64 && x < 64 && z > 72 && z < 100) return false; // the pool
    return true;
  };
  const people = [];
  const NP = hi ? 700 : 300;
  let guard = 0;
  while (people.length < NP * 0.72 && guard++ < 20000) {
    const x = SITE.x0 + rnd() * (SITE.x1 - SITE.x0);
    const z = SITE.z0 + rnd() * (SITE.z1 - SITE.z0);
    // denser toward the forecourt and the pool
    const bias = Math.exp(-((z - 60) ** 2) / (2 * 40 ** 2));
    if (rnd() > 0.35 + 0.65 * bias) continue;
    const a = rnd() * PI * 2;
    const L = rnd() < 0.18 ? 0 : 3 + rnd() * 16;
    if (!walkable(x + Math.sin(a) * L, z + Math.cos(a) * L) || !walkable(x - Math.sin(a) * L, z - Math.cos(a) * L) || !walkable(x, z)) continue;
    people.push([x, z, a, L, L ? 1.1 + rnd() * 0.5 : 0, rnd() * 6.28, 0.05, rnd()]);
  }
  // on the decks (west and north)
  for (let i = 0; i < NP * 0.08; i++) {
    const west = rnd() < 0.5;
    const s = rnd();
    const L = 4 + rnd() * 10;
    if (west) people.push([-70 - s * 80, 4 + (rnd() - 0.5) * 5, PI / 2, L, 1.2 + rnd() * 0.4, rnd() * 6.28, 10.5, rnd()]);
    else people.push([(rnd() - 0.5) * 6, -50 - s * 60, 0, L, 1.2 + rnd() * 0.4, rnd() * 6.28, 11.2 + s, rnd()]);
  }
  // on the sidewalks of the surrounding blocks
  while (people.length < NP) {
    const along = rnd() < 0.5;
    const k = Math.floor(rnd() * 9) - 4;
    const side = rnd() < 0.5 ? -7.5 : 7.5;
    const t = (rnd() - 0.5) * 760;
    const x = along ? GRID.ox + k * GRID.px + side : t;
    const z = along ? t : GRID.oz + k * GRID.pz + side;
    if (x > SITE.x0 - 2 && x < SITE.x1 + 2 && z > SITE.z0 - 2 && z < SITE.z1 + 2) continue;
    people.push([x, z, along ? 0 : PI / 2, 8 + rnd() * 30, 1.1 + rnd() * 0.5, rnd() * 6.28, 0.05, rnd()]);
  }
  {
    const geo = personGeo();
    const walk = new Float32Array(people.length * 4);
    const gait = new Float32Array(people.length * 4);
    people.forEach((p, i) => {
      walk.set([p[0], p[1], p[2], p[3]], i * 4);
      gait.set([p[4], p[5], p[6], p[7]], i * 4);
    });
    geo.setAttribute('aWalk', new InstancedBufferAttribute(walk, 4));
    geo.setAttribute('aGait', new InstancedBufferAttribute(gait, 4));
    const mesh = new InstancedMesh(geo, peopleMaterial(), people.length);
    mesh.frustumCulled = false;
    mesh.name = 'people';
    group.add(mesh);
  }

  // ---- cars on the streets
  {
    const NC = hi ? 460 : 180;
    const geo = carGeo();
    const a = new Float32Array(NC * 4);
    const colors = [0xe9e7e2, 0x22252a, 0x8a9096, 0xa4502f, 0x36507f, 0xd9d4c8, 0x51585e, 0xb9822a];
    const mesh = new InstancedMesh(geo, carMaterial(), NC);
    for (let i = 0; i < NC; i++) {
      const axis = rnd() < 0.5 ? 0 : 1;
      const k = Math.floor(rnd() * 15) - 7;
      const dir = rnd() < 0.5 ? -1 : 1;
      const line = (axis === 0 ? GRID.ox + k * GRID.px : GRID.oz + k * GRID.pz) + dir * (axis === 0 ? -2.6 : 2.6) * (rnd() < 0.5 ? 1 : 1.9);
      a.set([axis, line, dir * (9 + rnd() * 6), rnd() * 2400], i * 4);
    }
    geo.setAttribute('aCar', new InstancedBufferAttribute(a, 4));
    const c = new Color();
    for (let i = 0; i < NC; i++) mesh.setColorAt(i, c.set(colors[Math.floor(rnd() * colors.length)]));
    mesh.frustumCulled = false;
    mesh.name = 'cars';
    group.add(mesh);
  }

  // ---- drones
  {
    const ND = hi ? 70 : 34;
    const geo = droneGeo();
    const f1 = new Float32Array(ND * 4);
    const f2 = new Float32Array(ND * 4);
    for (let i = 0; i < ND; i++) {
      const run = rnd() < 0.4;
      const r = 120 + rnd() * 700;
      const a = rnd() * PI * 2;
      const cx = run ? Math.sin(a) * r * 0.5 : Math.sin(a) * r;
      const cz = run ? Math.cos(a) * r * 0.5 : Math.cos(a) * r;
      const alt = 55 + rnd() * 120;
      if (run) {
        f1.set([cx, cz, -(150 + rnd() * 450), alt], i * 4);
        f2.set([0.04 + rnd() * 0.05, rnd() * 6.28, rnd() * PI * 2, rnd()], i * 4);
      } else {
        const rad = 25 + rnd() * 90;
        f1.set([cx, cz, rad, alt], i * 4);
        f2.set([(rnd() < 0.5 ? -1 : 1) * (6 + rnd() * 6) / rad, rnd() * 6.28, 0, rnd()], i * 4);
      }
    }
    // a few circle low over the plaza
    for (let i = 0; i < 4; i++) {
      f1.set([(rnd() - 0.5) * 80, 40 + (rnd() - 0.5) * 60, 18 + rnd() * 20, 30 + rnd() * 18], i * 4);
      f2.set([0.25 + rnd() * 0.2, rnd() * 6.28, 0, 0.9], i * 4);
    }
    geo.setAttribute('aFly', new InstancedBufferAttribute(f1, 4));
    geo.setAttribute('aFly2', new InstancedBufferAttribute(f2, 4));
    const mesh = new InstancedMesh(geo, droneMaterial(), ND);
    mesh.frustumCulled = false;
    mesh.name = 'drones';
    group.add(mesh);
  }

  return { group };
}
