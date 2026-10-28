import * as THREE from 'three';
import { Builder, MAT, mat4 } from '../core/builder.js';
import { rng, clamp, noise2 } from '../core/rng.js';
import { U, SKY_GLSL, NOISE_GLSL, patch, makeSolid } from '../core/materials.js';
import { makeLeafAtlas } from '../core/textures.js';
import { prepGeo } from '../core/kit.js';
import { LAYER_REFLECT, PAL } from '../core/config.js';
import { lathe } from '../core/geom.js';

// Ambient life: birds, koi, ducks, an egret, falling leaves and florets,
// incense and chimney smoke, mist banks, a water wheel and a drifting boat.
// Motion runs on world time (U.uTime), so the Unassisted Room's hush slows it.

// ---------------------------------------------------------------- birds (wing flap in the vertex shader)
function birdGeo() {
  // body + two wings; aFlap marks wing vertices (±1 = tip)
  const pos = [
    // body (thin diamond)
    0, 0, 0.32, 0.05, 0, 0, 0, 0.04, -0.22,
    0, 0, 0.32, 0, 0.04, -0.22, -0.05, 0, 0,
    // tail
    0, 0.02, -0.18, 0.09, 0.01, -0.36, -0.09, 0.01, -0.36,
    // left wing
    0, 0.01, 0.12, -0.62, 0.0, -0.02, 0, 0.01, -0.1,
    // right wing
    0, 0.01, 0.12, 0, 0.01, -0.1, 0.62, 0.0, -0.02
  ];
  const flap = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 1];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aFlap', new THREE.Float32BufferAttribute(flap, 1));
  g.computeVertexNormals();
  return g;
}

function makeBirdMaterial(color) {
  const m = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
  return patch(m, 'bird', (s) => {
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aFlap;\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          #ifdef USE_INSTANCING
            float ph = dot( instanceMatrix[3].xyz, vec3( 0.37, 0.11, 0.29 ) );
            float rate = 7.0 + fract( ph ) * 3.0;
          #else
            float ph = 0.0; float rate = 8.0;
          #endif
          float f = sin( uTime * rate + ph * 6.28 );
          transformed.y += aFlap * aFlap * f * 0.38;
          transformed.x *= 1.0 - 0.18 * aFlap * aFlap * max( f, 0.0 );
        }`
      );
  });
}

// ---------------------------------------------------------------- koi
function koiGeo() {
  const body = new THREE.SphereGeometry(1, 10, 6);
  body.scale(0.09, 0.06, 0.3);
  const tail = new THREE.ConeGeometry(0.08, 0.16, 4);
  tail.rotateX(-Math.PI / 2);
  tail.scale(1, 0.25, 1);
  tail.translate(0, 0, -0.34);
  const parts = [body.toNonIndexed(), tail.toNonIndexed()];
  const pos = [];
  for (const p of parts) pos.push(...p.attributes.position.array);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  // white belly patches baked in vertex colour, instance colour = main hue
  const n = pos.length / 3;
  const col = new Float32Array(n * 3);
  const mask = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const z = pos[i * 3 + 2];
    const x = pos[i * 3];
    const patchy = noise2(z * 14 + 3, x * 20) > 0.55;
    col.set(patchy ? [1, 0.97, 0.92] : [1, 1, 1], i * 3);
    mask[i] = patchy ? 0 : 1;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aMask', new THREE.BufferAttribute(mask, 1));
  return g;
}
function makeKoiMaterial() {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35, metalness: 0 });
  return patch(m, 'koi', (s) => {
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aMask;\nuniform float uTime;')
      .replace(
        '#include <color_vertex>',
        `#include <color_vertex>
        #ifdef USE_INSTANCING_COLOR
          vColor.xyz = color.xyz * mix( vec3( 1.0 ), instanceColor.xyz, aMask );
        #endif`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          float ph = dot( instanceMatrix[3].xz, vec2( 3.1, 1.7 ) );
          float tail = max( - position.z - 0.05, 0.0 );
          transformed.x += sin( uTime * 6.0 + ph ) * tail * tail * 0.9;
        }`
      );
  });
}

// ---------------------------------------------------------------- falling leaves (GPU)
function leafParticles(sources, count, atlas) {
  const quad = new THREE.PlaneGeometry(1, 1);
  const g = new THREE.InstancedBufferGeometry();
  g.index = quad.index;
  g.attributes.position = quad.attributes.position;
  g.attributes.uv = quad.attributes.uv;
  const seed = new Float32Array(count * 4);
  const par = new Float32Array(count * 4);
  const col = new Float32Array(count * 3);
  const r = rng(616);
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const s = sources[i % sources.length];
    const a = r() * Math.PI * 2;
    const rr = Math.sqrt(r()) * s.r;
    seed.set([s.x + Math.cos(a) * rr, s.z + Math.sin(a) * rr, s.y0 + s.h * (0.6 + r() * 0.4), r()], i * 4);
    par.set([s.ground, 7 + r() * 9, s.size * (0.8 + r() * 0.5), s.cell], i * 4);
    c.set(s.colors[Math.floor(r() * s.colors.length)]);
    col.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('iSeed', new THREE.InstancedBufferAttribute(seed, 4));
  g.setAttribute('iPar', new THREE.InstancedBufferAttribute(par, 4));
  g.setAttribute('iCol', new THREE.InstancedBufferAttribute(col, 3));
  g.instanceCount = count;
  const mat = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { tLeaf: { value: atlas } }]),
    vertexShader: /* glsl */ `
      attribute vec4 iSeed;  // x, z, top y, phase
      attribute vec4 iPar;   // ground y, period, size, atlas cell
      attribute vec3 iCol;
      uniform float uTime;
      uniform vec2 uWind;
      uniform vec3 uSunDir;
      varying vec2 vUv;
      varying vec3 vCol;
      varying float vLight;
      varying float vFade;
      #include <fog_pars_vertex>
      void main() {
        float t = fract( uTime / iPar.y + iSeed.w );
        float h = iSeed.z - iPar.x;
        float y = iSeed.z - t * h;
        float ph = iSeed.w * 40.0 + uTime * 1.3;
        vec3 p = vec3( iSeed.x, y, iSeed.y );
        p.xz += vec2( sin( ph ), cos( ph * 0.8 ) ) * 0.6 + uWind * t * h * 0.35;
        // tumbling orientation
        float a = ph * 1.7;
        float b = ph * 1.1;
        mat3 R = mat3( cos( a ), 0.0, sin( a ), 0.0, 1.0, 0.0, - sin( a ), 0.0, cos( a ) )
               * mat3( 1.0, 0.0, 0.0, 0.0, cos( b ), - sin( b ), 0.0, sin( b ), cos( b ) );
        vec3 local = R * vec3( position.xy * iPar.z, 0.0 );
        vec3 n = R * vec3( 0.0, 0.0, 1.0 );
        vLight = 0.55 + 0.6 * abs( dot( n, uSunDir ) );
        vFade = smoothstep( 0.0, 0.06, t ) * ( 1.0 - smoothstep( 0.94, 1.0, t ) );
        float cell = iPar.w;
        vUv = ( vec2( mod( cell, 2.0 ), floor( cell / 2.0 ) ) + uv ) * 0.5;
        vCol = iCol;
        vec4 mvPosition = viewMatrix * vec4( p + local, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D tLeaf;
      varying vec2 vUv;
      varying vec3 vCol;
      varying float vLight;
      varying float vFade;
      #include <fog_pars_fragment>
      void main() {
        vec4 L = texture2D( tLeaf, vUv );
        if ( L.a < 0.5 || vFade < 0.02 ) discard;
        gl_FragColor = vec4( vCol * L.rgb * vLight * vFade, 1.0 );
        #include <fog_fragment>
      }
    `,
    side: THREE.DoubleSide,
    fog: true
  });
  Object.assign(mat.uniforms, U);
  mat.userData.loqPatched = true;
  const mesh = new THREE.Mesh(g, mat);
  mesh.frustumCulled = false;
  mesh.name = 'leaves';
  return mesh;
}

// ---------------------------------------------------------------- smoke & mist (soft billboards)
function softTexture(size = 64, noisy = false) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  if (noisy) {
    const r = rng(12);
    for (let i = 0; i < 60; i++) {
      const x = size * (0.2 + r() * 0.6);
      const y = size * (0.38 + r() * 0.24);
      const rad = size * (0.1 + r() * 0.2);
      const grd = g.createRadialGradient(x, y, 0, x, y, rad);
      grd.addColorStop(0, 'rgba(255,255,255,0.12)');
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd;
      g.fillRect(0, 0, size, size);
    }
  } else {
    const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.5, 'rgba(255,255,255,0.45)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, size, size);
  }
  const t = new THREE.CanvasTexture(c);
  return t;
}

function smokeParticles(sources, perSource) {
  const quad = new THREE.PlaneGeometry(1, 1);
  const g = new THREE.InstancedBufferGeometry();
  g.index = quad.index;
  g.attributes.position = quad.attributes.position;
  g.attributes.uv = quad.attributes.uv;
  const n = sources.length * perSource;
  const seed = new Float32Array(n * 4);
  const par = new Float32Array(n * 4);
  const r = rng(91);
  let i = 0;
  for (const s of sources)
    for (let k = 0; k < perSource; k++, i++) {
      seed.set([s.x, s.y, s.z, k / perSource + r() * 0.02], i * 4);
      par.set([s.rise, s.spread, s.period, s.alpha], i * 4);
    }
  g.setAttribute('iSeed', new THREE.InstancedBufferAttribute(seed, 4));
  g.setAttribute('iPar', new THREE.InstancedBufferAttribute(par, 4));
  g.instanceCount = n;
  const mat = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { tSoft: { value: softTexture(64) } }]),
    vertexShader: /* glsl */ `
      attribute vec4 iSeed;
      attribute vec4 iPar; // rise, spread, period, alpha
      uniform float uTime;
      uniform vec2 uWind;
      varying vec2 vUv;
      varying float vA;
      #include <fog_pars_vertex>
      void main() {
        float t = fract( uTime / iPar.z + iSeed.w );
        vec3 p = iSeed.xyz + vec3( 0.0, t * iPar.x, 0.0 );
        p.xz += uWind * t * t * iPar.x * 0.5 + vec2( sin( t * 6.0 + iSeed.w * 20.0 ), cos( t * 5.0 + iSeed.w * 13.0 ) ) * 0.15 * t;
        float size = 0.25 + t * iPar.y;
        vA = iPar.w * smoothstep( 0.0, 0.12, t ) * ( 1.0 - t );
        vUv = uv;
        vec4 mvPosition = viewMatrix * vec4( p, 1.0 );
        mvPosition.xy += position.xy * size;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D tSoft;
      uniform vec3 uSunColor;
      varying vec2 vUv;
      varying float vA;
      #include <fog_pars_fragment>
      void main() {
        float a = texture2D( tSoft, vUv ).a * vA;
        gl_FragColor = vec4( mix( vec3( 0.78, 0.76, 0.74 ), uSunColor * 0.9, 0.25 ), a );
        #include <fog_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
    fog: true
  });
  Object.assign(mat.uniforms, U);
  mat.userData.loqPatched = true;
  const mesh = new THREE.Mesh(g, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 4;
  mesh.name = 'smoke';
  return mesh;
}

function mistBanks(spots) {
  const quad = new THREE.PlaneGeometry(1, 1);
  const g = new THREE.InstancedBufferGeometry();
  g.index = quad.index;
  g.attributes.position = quad.attributes.position;
  g.attributes.uv = quad.attributes.uv;
  const seed = new Float32Array(spots.length * 4);
  spots.forEach((s, i) => seed.set([s.x, s.y, s.z, s.s], i * 4));
  g.setAttribute('iSeed', new THREE.InstancedBufferAttribute(seed, 4));
  g.instanceCount = spots.length;
  const mat = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { tSoft: { value: softTexture(128, true) } }]),
    vertexShader: /* glsl */ `
      attribute vec4 iSeed;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vWorld;
      #include <fog_pars_vertex>
      void main() {
        vec3 p = iSeed.xyz + vec3( sin( uTime * 0.02 + iSeed.x ) * 6.0, 0.0, cos( uTime * 0.017 + iSeed.z ) * 3.0 );
        vUv = uv;
        vWorld = p;
        vec4 mvPosition = viewMatrix * vec4( p, 1.0 );
        mvPosition.xy += position.xy * vec2( iSeed.w, iSeed.w * 0.18 );
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,
    fragmentShader: /* glsl */ `
      ${SKY_GLSL}
      uniform sampler2D tSoft;
      uniform float uMist;
      varying vec2 vUv;
      varying vec3 vWorld;
      #include <fog_pars_fragment>
      void main() {
        float d = length( vWorld - cameraPosition );
        float a = texture2D( tSoft, vUv ).a * uMist * smoothstep( 40.0, 140.0, d );
        vec3 dir = normalize( vWorld - cameraPosition );
        vec3 c = skyColor( normalize( vec3( dir.x, 0.02, dir.z ) ) ) * 1.04;
        gl_FragColor = vec4( c, a );
      }
    `,
    transparent: true,
    depthWrite: false,
    fog: true
  });
  Object.assign(mat.uniforms, U, { uMist: { value: 0.32 } });
  mat.userData.loqPatched = true;
  const mesh = new THREE.Mesh(g, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 6;
  mesh.name = 'mist';
  return mesh;
}

// ---------------------------------------------------------------- the life system
export function createLife({ tier, kit, layout, water, anchors }) {
  const group = new THREE.Group();
  group.name = 'life';
  const rand = rng(3131);
  const low = tier.name === 'low';
  const { terrainHeight, POND, pondDist, WATER_LEVEL, RIVER_LEVEL, riverZ } = layout;

  // ---- birds: one flock wheeling over the valley + birds perched on ridges
  const nb = low ? 26 : 48;
  const birdMat = makeBirdMaterial(0x2a2624);
  const birds = new THREE.InstancedMesh(birdGeo(), birdMat, nb);
  birds.frustumCulled = false;
  birds.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  group.add(birds);
  const flock = Array.from({ length: nb }, (_, i) => ({
    off: new THREE.Vector3((rand() - 0.5) * 22, (rand() - 0.5) * 8, (rand() - 0.5) * 22),
    lag: rand() * 3,
    s: 0.9 + rand() * 0.6,
    perched: i < (low ? 4 : 9)
  }));
  // perch spots on ridges
  const perches = [
    [anchors.library.x - 6, anchors.library.ridgeY + 0.5, anchors.library.z],
    [anchors.library.x - 5.4, anchors.library.ridgeY + 0.5, anchors.library.z],
    [anchors.library.x + 4.2, anchors.library.ridgeY + 0.5, anchors.library.z],
    [0, 7.85, 46.2],
    [1.2, 7.85, 46.2],
    [-40, 4.65, -54],
    [30, 4.65, 46],
    [31, 4.65, 46],
    [-58, 4.65, 10]
  ];
  // ---- egret flying slowly over the river, and one wading
  const egretMat = makeBirdMaterial(0xf2efe8);
  const egrets = new THREE.InstancedMesh(birdGeo(), egretMat, 2);
  egrets.frustumCulled = false;
  group.add(egrets);

  // ---- koi in the pond
  const nk = low ? 10 : 18;
  const koi = new THREE.InstancedMesh(koiGeo(), makeKoiMaterial(), nk);
  koi.frustumCulled = false;
  koi.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const koiCols = [0xe0661e, 0xf0eae0, 0xd23a1e, 0xe8902e, 0x2a2420, 0xf2c060];
  const fish = [];
  const pondPoint = () => {
    for (let t = 0; t < 50; t++) {
      const i = Math.floor(rand() * POND.length);
      const cx = -38 + (POND[i][0] + 38) * rand() * 0.9;
      const cz = 27 + (POND[i][1] - 27) * rand() * 0.9;
      if (pondDist(cx, cz) < -1.2) return new THREE.Vector3(cx, 0, cz);
    }
    return new THREE.Vector3(-38, 0, 27);
  };
  for (let i = 0; i < nk; i++) {
    const p = pondPoint();
    fish.push({ p, v: new THREE.Vector3((rand() - 0.5) * 0.4, 0, (rand() - 0.5) * 0.4), target: pondPoint(), s: 0.9 + rand() * 0.6, depth: 0.12 + rand() * 0.25 });
    koi.setColorAt(i, new THREE.Color(koiCols[i % koiCols.length]));
  }
  group.add(koi);

  // ---- mandarin ducks: simple bodies on the surface
  const duckB = new Builder(4);
  duckB.sphere('d', 0xffffff, 1, 0, 0.1, 0, { sx: 0.16, sy: 0.11, sz: 0.26, seg: 8 });
  duckB.sphere('d', 0xffffff, 0.085, 0, 0.27, 0.17, { seg: 8 });
  duckB.cone('d', 0xd88a3a, 0.025, 0.08, 0, 0.26, 0.26, { rx: Math.PI / 2, seg: 4 });
  const duckGeo = duckB.toGeometry('d');
  const duckMat = makeSolid({});
  const ducks = new THREE.InstancedMesh(duckGeo, duckMat, 3);
  ducks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  ducks.frustumCulled = false;
  [0x8a5a3a, 0x6a6a72, 0xa86a3a].forEach((c, i) => ducks.setColorAt(i, new THREE.Color(c)));
  ducks.layers.enable(LAYER_REFLECT);
  group.add(ducks);

  // ---- leaves & florets drifting down around the deciduous trees
  const leafTex = makeLeafAtlas(256);
  const leafSources = [
    { x: -8.6, z: 33, y0: 6, h: 9, r: 4.5, ground: 0.1, size: 0.16, cell: 1, colors: [0xe8b83c, 0xd9a530, 0xf0c850] },
    { x: 8.6, z: 33.4, y0: 6, h: 9, r: 4.5, ground: 0.1, size: 0.16, cell: 1, colors: [0xe8b83c, 0xd9a530, 0xf0c850] },
    { x: 0.5, z: -50.5, y0: 5, h: 8, r: 4, ground: 0.1, size: 0.16, cell: 1, colors: [0xe8b83c, 0xd9a530] },
    { x: -29.5, z: 44.2, y0: 2, h: 5, r: 3.5, ground: 0.05, size: 0.15, cell: 3, colors: [0xc0402a, 0xd2552c, 0xb33424] },
    { x: -56, z: 32.5, y0: 2, h: 5, r: 3.5, ground: 0.05, size: 0.15, cell: 3, colors: [0xc0402a, 0xd86a30] },
    { x: 23.2, z: 41, y0: 2, h: 5, r: 3.5, ground: 0.05, size: 0.15, cell: 3, colors: [0xc0402a, 0xd2552c] },
    { x: 34, z: 25, y0: 1.5, h: 4, r: 7, ground: 0.6, size: 0.06, cell: 0, colors: [0xf0b030, 0xffd060] }, // osmanthus florets
    { x: 0, z: 1, y0: 4, h: 6, r: 14, ground: 0.05, size: 0.15, cell: 1, colors: [0xe8b83c, 0xd9a530] }
  ];
  group.add(leafParticles(leafSources, Math.round(520 * tier.particles), leafTex));

  // ---- smoke: incense burner, kitchen chimney, village chimneys
  const smokeSrc = [];
  if (anchors.incense) smokeSrc.push({ ...anchors.incense, rise: 7, spread: 1.6, period: 9, alpha: 0.35 });
  for (const h of (anchors.village || []).slice(0, low ? 3 : 6)) {
    const y = terrainHeight(h.x, h.z);
    smokeSrc.push({ x: h.x + h.w * 0.25, y: y + 7.2, z: h.z, rise: 16, spread: 4.5, period: 16, alpha: 0.28 });
  }
  smokeSrc.push({ x: -36, y: 5.2, z: -46.5, rise: 12, spread: 3.5, period: 14, alpha: 0.25 });
  group.add(smokeParticles(smokeSrc, low ? 14 : 24));

  // ---- mist lying along the river and in the valley folds
  const mist = [];
  for (let x = -260; x <= 260; x += 26) mist.push({ x, y: RIVER_LEVEL + 2.5 + rand() * 2, z: riverZ(x) + (rand() - 0.5) * 10, s: 60 + rand() * 40 });
  for (let k = 0; k < 10; k++) {
    const a = rand() * Math.PI - Math.PI;
    const r = 160 + rand() * 160;
    mist.push({ x: Math.cos(a) * r, y: terrainHeight(Math.cos(a) * r, Math.sin(a) * r) + 8 + rand() * 10, z: Math.sin(a) * r, s: 90 + rand() * 60 });
  }
  group.add(mistBanks(mist));

  // ---- water wheel and mill by the river (village side)
  const wx = -66;
  const wz = riverZ(wx) + 8.6;
  const wy = RIVER_LEVEL + 1.9;
  const wheelB = new Builder(6);
  const spokes = 12;
  for (let k = 0; k < spokes; k++) {
    const a = (k / spokes) * Math.PI * 2;
    wheelB.beam('w', 0x5a4030, 0, 0, 0, 0, Math.sin(a) * 2.3, Math.cos(a) * 2.3, 0.08, 0.08, { kind: MAT.wood });
    wheelB.box('w', 0x6a4a34, 0.9, 0.06, 0.5, 0, Math.sin(a) * 2.4 - 0.03, Math.cos(a) * 2.4, { rx: -a, kind: MAT.wood });
  }
  for (const s of [-0.42, 0.42]) {
    const ring = new THREE.TorusGeometry(2.3, 0.06, 4, 24);
    ring.rotateY(Math.PI / 2);
    wheelB.add('w', ring, mat4(s, 0, 0), 0x4a3426, { kind: MAT.wood });
  }
  wheelB.cyl('w', 0x3a2a20, 0.14, 1.2, -0.6, 0, 0, { rz: -Math.PI / 2, seg: 8, kind: MAT.wood });
  const wheelGeo = wheelB.toGeometry('w');
  const wheel = new THREE.Mesh(wheelGeo, kit.mats.solid);
  wheel.position.set(wx, wy, wz);
  wheel.castShadow = true;
  group.add(wheel);

  // ---- a covered sampan (乌篷船) drifting on the river, with a boatman
  const boatB = new Builder(8);
  const hull = lathe(
    [
      [0.0, -0.3],
      [0.55, -0.25],
      [0.8, 0.05],
      [0.85, 0.25]
    ],
    10
  );
  hull.scale(1, 1, 4.2);
  boatB.add('b', hull, mat4(0, 0, 0, 0, 1, 1, 1), 0x4a3a2c, { kind: MAT.wood });
  const awn = new THREE.CylinderGeometry(0.85, 0.85, 2.2, 10, 1, true, -Math.PI / 2, Math.PI);
  awn.rotateX(-Math.PI / 2);
  boatB.add('b', awn, mat4(0, 0.3, 0), 0x222020, { kind: MAT.cloth });

  // boatman with a long pole
  boatB.cyl('b', 0x3d4a5c, 0.2, 1.2, 0, 0.25, -2.4, { rTop: 0.15, seg: 8 });
  boatB.sphere('b', SKIN_C, 0.11, 0, 1.58, -2.4, { seg: 8 });
  boatB.cone('b', 0xc8a868, 0.3, 0.15, 0, 1.64, -2.4, { seg: 10 });
  boatB.rod('b', 0x6a5038, 0.2, -0.8, -2.0, -0.35, 3.2, -2.9, 0.025, { seg: 4 });
  const boatGeo = boatB.toGeometry('b');
  const boat = new THREE.Mesh(boatGeo, kit.mats.solidDS);
  boat.castShadow = true;
  boat.rotation.order = 'YXZ';
  group.add(boat);

  // ---- update
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler(0, 0, 0, 'YXZ');
  const P = new THREE.Vector3();
  const S = new THREE.Vector3();
  const lead = new THREE.Vector3();
  const prevLead = new THREE.Vector3();
  let flow = 0;
  let lastRing = 0;

  function update(dt, speed) {
    flow += dt * speed;
    const t = flow;
    // flock leader on a slow figure-eight above the valley
    const leadAt = (tt, out) => out.set(Math.sin(tt * 0.035) * 150, 48 + Math.sin(tt * 0.06) * 10, Math.sin(tt * 0.07) * 70 - 20);
    flock.forEach((b, i) => {
      if (b.perched) {
        const p = perches[i % perches.length];
        e.set(0, i * 1.7 + Math.sin(t * 0.3 + i) * 0.4, 0);
        q.setFromEuler(e);
        m.compose(P.set(p[0], p[1], p[2]), q, S.setScalar(0.45));
        birds.setMatrixAt(i, m);
        return;
      }
      leadAt(t - b.lag, lead);
      leadAt(t - b.lag - 0.2, prevLead);
      P.copy(lead).add(b.off);
      P.x += Math.sin(t * 0.4 + i) * 2;
      P.y += Math.sin(t * 0.5 + i * 2) * 1.2;
      const dx = lead.x - prevLead.x;
      const dz = lead.z - prevLead.z;
      const dy = lead.y - prevLead.y;
      e.set(-Math.atan2(dy, Math.hypot(dx, dz)), Math.atan2(dx, dz), Math.sin(t * 0.7 + i) * 0.25);
      q.setFromEuler(e);
      m.compose(P, q, S.setScalar(b.s));
      birds.setMatrixAt(i, m);
    });
    birds.instanceMatrix.needsUpdate = true;

    // egrets: one gliding slowly along the river, one standing at the pond
    const ex = ((t * 2.2) % 520) - 260;
    P.set(ex, 14 + Math.sin(t * 0.2) * 3, riverZ(ex) - 4);
    e.set(0, Math.PI / 2, Math.sin(t * 0.5) * 0.1);
    q.setFromEuler(e);
    m.compose(P, q, S.setScalar(1.8));
    egrets.setMatrixAt(0, m);
    e.set(0, -0.8, 0);
    q.setFromEuler(e);
    m.compose(P.set(-24.6, WATER_LEVEL + 0.6, 30.2), q, S.setScalar(0.0001));
    egrets.setMatrixAt(1, m);
    egrets.instanceMatrix.needsUpdate = true;

    // koi: steer toward wandering targets inside the pond
    fish.forEach((f, i) => {
      const to = P.subVectors(f.target, f.p);
      const d = to.length();
      if (d < 1.2) f.target = pondPoint();
      to.normalize().multiplyScalar(0.25 * dt * speed);
      f.v.add(to).multiplyScalar(1 - 0.6 * dt * speed);
      const sp = f.v.length();
      if (sp > 0.5) f.v.multiplyScalar(0.5 / sp);
      f.p.addScaledVector(f.v, dt * speed * 1.4);
      if (pondDist(f.p.x, f.p.z) > -0.6) {
        f.target = pondPoint();
        f.v.multiplyScalar(-0.5);
      }
      e.set(0, Math.atan2(f.v.x, f.v.z), 0);
      q.setFromEuler(e);
      m.compose(P.set(f.p.x, WATER_LEVEL - f.depth, f.p.z), q, S.setScalar(f.s));
      koi.setMatrixAt(i, m);
    });
    koi.instanceMatrix.needsUpdate = true;
    if (water && U.uTime.value - lastRing > 2.2 && speed > 0.3) {
      lastRing = U.uTime.value;
      const f = fish[Math.floor(rand() * fish.length)];
      water.ring(f.p.x, f.p.z, 0.6);
    }

    // ducks paddle slowly in loose circles
    for (let i = 0; i < 3; i++) {
      const a = t * 0.04 + i * 0.5;
      const x = -40 + Math.cos(a) * 6 + i * 0.7;
      const z = 30 + Math.sin(a * 1.3) * 4 + i * 0.4;
      e.set(0, Math.atan2(-Math.sin(a), Math.cos(a) * 1.3) + Math.PI / 2, 0);
      q.setFromEuler(e);
      m.compose(P.set(x, WATER_LEVEL - 0.05 + Math.sin(t * 2 + i) * 0.01, z), q, S.setScalar(1));
      ducks.setMatrixAt(i, m);
    }
    ducks.instanceMatrix.needsUpdate = true;

    wheel.rotation.x -= dt * speed * 0.6;
    // boat drifts downstream and back
    const bx = Math.sin(t * 0.012) * 120 - 20;
    boat.position.set(bx, RIVER_LEVEL + 0.05 + Math.sin(t * 1.3) * 0.03, riverZ(bx) + 2.5);
    boat.rotation.y = Math.PI / 2 + (Math.cos(t * 0.012) > 0 ? 0 : Math.PI) + Math.sin(t * 0.5) * 0.03;
    boat.rotation.z = Math.sin(t * 1.1) * 0.02;
  }
  update(0, 1);
  return { group, update };
}

const SKIN_C = 0xd2ad8f;
