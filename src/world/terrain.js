import * as THREE from 'three';
import { fbm2, noise2, rng, smoothstep, clamp } from '../core/rng.js';
import {
  terrainHeight,
  compoundDist,
  riverZ,
  RIVER_HALF,
  pondDist,
  streamDist,
  PATHS,
  GARDEN_PATHS,
  POND,
  STREAM_N,
  STREAM_S,
  COMPOUND
} from './layout.js';
import { distToPolyline } from '../core/geom.js';
import { patch, NOISE_GLSL } from '../core/materials.js';
import { MAT } from '../core/builder.js';

// The valley floor and hills. One grid warped so cells are ~1.3 m around the
// academy and ~12 m at the rim; colours come from region functions (meadow,
// fields, banks, forest floor, rock), and a painted ground map adds crisp
// paths, field rows, moss and leaf litter around the compound.

const EXTENT = 620; // half size
const MAP_HALF = 165; // painted map covers ±MAP_HALF

const warp = (t) => Math.sign(t) * EXTENT * (0.22 * Math.abs(t) + 0.78 * Math.abs(t) ** 3);

// fields across the river: rotated strips with alternating crops
export function fieldAt(x, z) {
  if (z < riverZ(x) + RIVER_HALF + 6 || z > 215) return -1;
  if (x < -70 && z < 175) return -1; // village grounds
  if (x < -190 || x > 160) return -1;
  // rotate field grid slightly
  const a = 0.12;
  const u = x * Math.cos(a) - z * Math.sin(a);
  const v = x * Math.sin(a) + z * Math.cos(a);
  const cu = Math.floor(u / 26);
  const cv = Math.floor(v / 15);
  const fu = u / 26 - cu;
  const fv = v / 15 - cv;
  if (fu < 0.04 || fv < 0.07) return 0; // bund
  const h = noise2(cu * 7.1, cv * 3.3);
  return h < 0.42 ? 1 : h < 0.74 ? 2 : 3; // golden stubble / green / ploughed
}

// sRGB hex → linear rgb triple
const lin = (hex) => {
  const c = new THREE.Color(hex);
  return [c.r, c.g, c.b];
};
const C = {
  meadow: lin(0x7b7f45),
  lush: lin(0x667a3c),
  dry: lin(0xa89a5e),
  forest: lin(0x4b5733),
  forestDark: lin(0x3a4529),
  rock: lin(0x8a8273),
  bund: lin(0x8a7356),
  stubble: lin(0xc4a35a),
  green: lin(0x7f8a48),
  plough: lin(0x7a5c45),
  bank: lin(0x5d5a47),
  deep: lin(0x22302d)
};
const mix3 = (out, c, t) => {
  out[0] += (c[0] - out[0]) * t;
  out[1] += (c[1] - out[1]) * t;
  out[2] += (c[2] - out[2]) * t;
};

function regionColor(x, z, h, slope, out) {
  const n = fbm2(x * 0.03, z * 0.03, 3);
  const n2 = noise2(x * 0.09, z * 0.09);
  out[0] = C.meadow[0];
  out[1] = C.meadow[1];
  out[2] = C.meadow[2];
  mix3(out, C.lush, smoothstep(0.5, 0.25, n) * 0.8);
  mix3(out, C.dry, smoothstep(0.5, 0.75, n2) * 0.7);
  // forest floor on the hills
  const hill = smoothstep(3, 22, h);
  mix3(out, n > 0.5 ? C.forest : C.forestDark, hill);
  // rock on steep faces
  mix3(out, C.rock, smoothstep(0.5, 0.9, slope));
  // fields
  const f = fieldAt(x, z);
  if (f === 0) mix3(out, C.bund, 1);
  else if (f === 1) mix3(out, C.stubble, 0.92);
  else if (f === 2) mix3(out, C.green, 0.92);
  else if (f === 3) mix3(out, C.plough, 0.92);
  // damp banks and underwater floor
  const dr = Math.abs(z - riverZ(x));
  const wet = Math.max(smoothstep(RIVER_HALF + 5, RIVER_HALF - 1, dr), smoothstep(3, -0.5, pondDist(x, z)), smoothstep(2.6, 0.8, streamDist(x, z)));
  mix3(out, C.bank, wet);
  if (h < -0.6) mix3(out, C.deep, smoothstep(-0.6, -1.8, h));
}

// ---------------------------------------------------------------- painted ground map
// Transparent canvas; painted features (paths, field rows, moss, litter) are
// absolute sRGB colours whose alpha says how much they cover the vertex colour.
function paintGround(size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const rand = rng(77);
  const S = size / (MAP_HALF * 2);
  const X = (x) => (x + MAP_HALF) * S;
  const Z = (z) => (z + MAP_HALF) * S;
  g.clearRect(0, 0, size, size);

  // soft mottling: dry and lush patches
  for (let i = 0; i < 2400; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = (2 + rand() * 18) * S;
    g.fillStyle = rand() < 0.5 ? 'rgba(178,160,112,0.13)' : 'rgba(88,100,58,0.12)';
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  // tussock specks
  for (let i = 0; i < 30000; i++) {
    g.fillStyle = rand() < 0.6 ? 'rgba(84,96,52,0.3)' : 'rgba(196,182,132,0.3)';
    g.fillRect(rand() * size, rand() * size, 1 + rand() * 2, 1 + rand() * 2);
  }

  // field rows (furrows / stubble lines)
  const step = Math.max(1, Math.round(size / 1024));
  for (let py = 0; py < size; py += step) {
    const z = py / S - MAP_HALF;
    if (z < 85) continue;
    for (let px = 0; px < size; px += step) {
      const x = px / S - MAP_HALF;
      const f = fieldAt(x, z);
      if (f <= 0) continue;
      const u = x * Math.cos(0.12) - z * Math.sin(0.12);
      if (Math.abs(Math.sin(u * 3.4)) < 0.33) {
        g.fillStyle = f === 1 ? 'rgba(120,88,46,0.4)' : f === 2 ? 'rgba(58,76,38,0.35)' : 'rgba(78,54,38,0.4)';
        g.fillRect(px, py, step, step);
      }
    }
  }

  const strokePts = (pts, closed) => {
    g.beginPath();
    pts.forEach(([x, z], i) => (i ? g.lineTo(X(x), Z(z)) : g.moveTo(X(x), Z(z))));
    if (closed) g.closePath();
  };
  const stroke = (pts, w, color, edge) => {
    g.lineCap = 'round';
    g.lineJoin = 'round';
    if (edge) {
      g.strokeStyle = edge;
      g.lineWidth = (w * 2 + 1.1) * S;
      strokePts(pts);
      g.stroke();
    }
    g.strokeStyle = color;
    g.lineWidth = w * 2 * S;
    strokePts(pts);
    g.stroke();
  };
  // damp shore rings first (paths may cross them)
  g.lineWidth = 3.4 * S;
  g.strokeStyle = 'rgba(70,72,56,0.45)';
  strokePts(POND, true);
  g.stroke();
  for (const st of [STREAM_N, STREAM_S]) {
    g.strokeStyle = 'rgba(70,72,56,0.4)';
    g.lineWidth = 4 * S;
    strokePts(st);
    g.stroke();
  }
  for (const p of PATHS) {
    if (p.kind === 'stone') stroke(p.pts, p.w, 'rgba(170,163,148,1)', 'rgba(118,108,88,0.5)');
    else stroke(p.pts, p.w, 'rgba(168,140,104,0.92)', 'rgba(120,100,74,0.35)');
  }
  // garden paths: pebble mosaic (花街铺地) — grey band with light/dark pebbles
  for (const p of GARDEN_PATHS) stroke(p.pts, p.w, 'rgba(150,146,134,1)', 'rgba(70,66,56,0.7)');
  for (const p of GARDEN_PATHS) {
    for (let i = 0; i < p.pts.length - 1; i++) {
      const [x0, z0] = p.pts[i];
      const [x1, z1] = p.pts[i + 1];
      const len = Math.hypot(x1 - x0, z1 - z0) || 1;
      const nx = -(z1 - z0) / len;
      const nz = (x1 - x0) / len;
      for (let k = 0; k < len * 60; k++) {
        const t = rand();
        const off = (rand() - 0.5) * p.w * 1.8;
        const x = x0 + (x1 - x0) * t + nx * off;
        const z = z0 + (z1 - z0) * t + nz * off;
        g.fillStyle = rand() < 0.5 ? 'rgba(92,88,78,0.75)' : 'rgba(205,200,186,0.8)';
        g.beginPath();
        g.arc(X(x), Z(z), (0.035 + rand() * 0.03) * S, 0, Math.PI * 2);
        g.fill();
      }
      // a lattice motif every metre: diamonds of dark pebbles
      for (let d = 0; d < len; d += 1.1) {
        const x = x0 + ((x1 - x0) * d) / len;
        const z = z0 + ((z1 - z0) * d) / len;
        g.strokeStyle = 'rgba(70,66,58,0.7)';
        g.lineWidth = 0.06 * S;
        g.beginPath();
        g.moveTo(X(x + nx * p.w * 0.8), Z(z + nz * p.w * 0.8));
        g.lineTo(X(x + ((x1 - x0) / len) * 0.5), Z(z + ((z1 - z0) / len) * 0.5));
        g.lineTo(X(x - nx * p.w * 0.8), Z(z - nz * p.w * 0.8));
        g.stroke();
      }
    }
  }
  // the compound floor: swept earth, a little paler, with moss in the shade
  g.fillStyle = 'rgba(160,146,116,0.35)';
  g.fillRect(X(COMPOUND.x0), Z(COMPOUND.z0), (COMPOUND.x1 - COMPOUND.x0) * S, (COMPOUND.z1 - COMPOUND.z0) * S);
  for (let i = 0; i < 1100; i++) {
    const x = COMPOUND.x0 + rand() * (COMPOUND.x1 - COMPOUND.x0);
    const z = COMPOUND.z0 + rand() * (COMPOUND.z1 - COMPOUND.z0);
    g.fillStyle = rand() < 0.7 ? 'rgba(82,104,58,0.2)' : 'rgba(112,96,70,0.18)';
    g.beginPath();
    g.ellipse(X(x), Z(z), (0.6 + rand() * 2.6) * S, (0.4 + rand() * 1.6) * S, rand() * 3, 0, Math.PI * 2);
    g.fill();
  }
  // fade out toward the rim of the painted area
  g.globalCompositeOperation = 'destination-out';
  const grad = g.createRadialGradient(size / 2, size / 2, size * 0.34, size / 2, size / 2, size * 0.5);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,1)');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  g.globalCompositeOperation = 'source-over';

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 8;
  // later features (leaf litter under trees) paint through this
  const dab = (x, z, r, color) => {
    g.fillStyle = color;
    g.beginPath();
    g.arc(X(x), Z(z), r * S, 0, Math.PI * 2);
    g.fill();
  };
  return { tex, canvas: c, ctx: g, X, Z, S, dab, rand };
}

// vertex colour (regions) under the painted map, blended by the map's alpha
function makeTerrainMaterial(tex, detail) {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.97, metalness: 0, map: tex });
  if (detail) m.defines = { LOQ_DETAIL: '' };
  return patch(m, 'terrain', (s) => {
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 aInfo;\nvarying vec4 vInfo;\nvarying vec3 vTerrWorld;')
      .replace('#include <fog_vertex>', '#include <fog_vertex>\nvInfo = aInfo;\nvTerrWorld = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;');
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec4 vInfo;\nvarying vec3 vTerrWorld;\n' + NOISE_GLSL)
      .replace('#include <map_fragment>', 'vec4 gTex = texture2D( map, vMapUv );')
      .replace(
        '#include <color_fragment>',
        `diffuseColor.rgb *= mix( vColor, gTex.rgb, gTex.a );
        #ifdef LOQ_DETAIL
          {
            vec2 wp = vTerrWorld.xz;
            float n = vnoise( wp * 0.33 ) * 0.45 + vnoise( wp * 1.9 ) * 0.33 + vnoise( wp * 8.5 ) * 0.22;
            diffuseColor.rgb *= 0.86 + 0.26 * n;
          }
        #endif`
      )
      .replace('#include <lights_fragment_begin>', '#include <lights_fragment_begin>\nirradiance *= vInfo.w;');
  });
}

export function createTerrain({ tier }) {
  const seg = tier.terrainSeg;
  const n = seg + 1;
  const pos = new Float32Array(n * n * 3);
  const col = new Float32Array(n * n * 3);
  const uv = new Float32Array(n * n * 2);
  const info = new Float32Array(n * n * 4);
  const H = new Float32Array(n * n);
  for (let j = 0; j < n; j++) {
    const z = warp((j / seg) * 2 - 1);
    for (let i = 0; i < n; i++) {
      const x = warp((i / seg) * 2 - 1);
      let h = terrainHeight(x, z);
      // keep the far rim below the first range's crest
      const r = Math.hypot(x, z);
      h += (Math.min(h, 38) - h) * smoothstep(430, 600, r);
      const k = j * n + i;
      H[k] = h;
      pos[k * 3] = x;
      pos[k * 3 + 1] = h;
      pos[k * 3 + 2] = z;
      uv[k * 2] = (x + MAP_HALF) / (MAP_HALF * 2);
      uv[k * 2 + 1] = (z + MAP_HALF) / (MAP_HALF * 2);
    }
  }
  const geo = new THREE.PlaneGeometry(1, 1, seg, seg); // for the index only
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(geo.index);
  g.computeVertexNormals();
  geo.dispose();

  const nor = g.attributes.normal;
  const rc = [0, 0, 0];
  for (let k = 0; k < n * n; k++) {
    const x = pos[k * 3];
    const h = pos[k * 3 + 1];
    const z = pos[k * 3 + 2];
    const slope = 1 - nor.getY(k);
    regionColor(x, z, h, slope * 3, rc);
    // inside the painted map region the map carries the colour; blend there
    const inMap = 1 - smoothstep(MAP_HALF * 0.72, MAP_HALF * 0.98, Math.max(Math.abs(x), Math.abs(z)));
    const cScale = 1;
    col[k * 3] = rc[0] * cScale;
    col[k * 3 + 1] = rc[1] * cScale;
    col[k * 3 + 2] = rc[2] * cScale;
    // ambient occlusion: valleys and the base of the compound wall
    const wallAO = 1 - 0.28 * (1 - smoothstep(0, 2.2, Math.abs(compoundDist(x, z))));
    info[k * 4] = 0;
    info[k * 4 + 1] = MAT.plain + 11; // ground detail kind
    info[k * 4 + 2] = 0;
    info[k * 4 + 3] = clamp(wallAO, 0, 1) * (0.9 + 0.1 * inMap);
  }
  // linear → stored as linear floats already (colour attribute is linear)
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aInfo', new THREE.BufferAttribute(info, 4));
  g.computeBoundingSphere();

  const map = paintGround(tier.name === 'low' ? 1024 : 2048);
  const mat = makeTerrainMaterial(map.tex, tier.detail);
  const mesh = new THREE.Mesh(g, mat);
  mesh.name = 'terrain';
  mesh.receiveShadow = true;
  mesh.castShadow = false;
  mesh.matrixAutoUpdate = false;
  return { mesh, map };
}

export { MAP_HALF, EXTENT, distToPolyline };
