import * as THREE from 'three';
import { U, SKY_GLSL, NOISE_GLSL } from '../core/materials.js';
import { LAYER_REFLECT } from '../core/config.js';
import { POND, STREAM_N, STREAM_S, WATER_LEVEL, RIVER_LEVEL, RIVER_HALF, riverZ, pondDist, isletDist, terrainHeight } from './layout.js';

// Pond, garden stream and river. One shader: analytic ripple normals that
// drift along the flow, fresnel between the deep colour and the sky (the same
// skyColor() that colours the fog), sun glitter, a soft shoreline, and — on
// desktop — a planar reflection of the pond (mirror camera, oblique clip).

const vert = /* glsl */ `
  attribute vec2 aFlow;
  attribute float aEdge;
  varying vec3 vWorld;
  varying vec2 vFlow;
  varying float vEdge;
  #include <fog_pars_vertex>
  void main() {
    vec4 wp = modelMatrix * vec4( position, 1.0 );
    vWorld = wp.xyz;
    vFlow = aFlow;
    vEdge = aEdge;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const frag = /* glsl */ `
  ${SKY_GLSL}
  ${NOISE_GLSL}
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uSunColor;
  uniform float uOpacity;
  uniform float uRipple;
  uniform float uF0;
  uniform vec4 uRings[4]; // xz centre, start time, strength
  #ifdef USE_MIRROR
    uniform sampler2D tMirror;
    uniform mat4 uMirrorMatrix;
  #endif
  varying vec3 vWorld;
  varying vec2 vFlow;
  varying float vEdge;
  #include <fog_pars_fragment>

  vec2 waveGrad( vec2 p, float t ) {
    vec2 g = vec2( 0.0 );
    g += vec2( 0.8, 0.6 ) * cos( dot( p, vec2( 0.8, 0.6 ) ) * 1.6 + t * 1.2 ) * 0.05;
    g += vec2( -0.5, 0.86 ) * cos( dot( p, vec2( -0.5, 0.86 ) ) * 2.7 + t * 1.7 ) * 0.035;
    g += vec2( 0.2, -0.98 ) * cos( dot( p, vec2( 0.2, -0.98 ) ) * 4.9 + t * 2.5 ) * 0.022;
    g += vec2( 0.97, -0.24 ) * cos( dot( p, vec2( 0.97, -0.24 ) ) * 8.3 + t * 3.3 ) * 0.014;
    g += vec2( -0.71, -0.7 ) * cos( dot( p, vec2( -0.71, -0.7 ) ) * 13.0 + t * 4.1 ) * 0.008;
    return g;
  }

  void main() {
    vec2 p = vWorld.xz - vFlow * uTime;
    vec2 g = waveGrad( p, uTime ) * uRipple;
    // fine value-noise ripples
    vec2 q = p * 3.1 + uTime * 0.25;
    float e = 0.05;
    float n0 = vnoise( q );
    g += vec2( vnoise( q + vec2( e, 0.0 ) ) - n0, vnoise( q + vec2( 0.0, e ) ) - n0 ) / e * 0.012 * uRipple;
    // expanding rings (fish, falling leaves, events)
    for ( int i = 0; i < 4; i++ ) {
      vec4 r = uRings[i];
      float age = uTime - r.z;
      if ( age > 0.0 && age < 4.0 && r.w > 0.0 ) {
        vec2 d = vWorld.xz - r.xy;
        float dist = length( d );
        float rad = age * 1.4;
        float w = exp( - pow( ( dist - rad ) * 3.0, 2.0 ) ) * ( 1.0 - age / 4.0 ) * r.w;
        g += normalize( d + 1e-4 ) * sin( ( dist - rad ) * 14.0 ) * w * 0.25;
      }
    }
    vec3 n = normalize( vec3( - g.x, 1.0, - g.y ) );
    vec3 V = normalize( cameraPosition - vWorld );
    float ndv = max( dot( n, V ), 0.0 );
    float fres = uF0 + ( 1.0 - uF0 ) * pow( 1.0 - ndv, 4.0 );
    vec3 R = reflect( - V, n );
    vec3 refl = skyColor( normalize( vec3( R.x, max( R.y, 0.0 ), R.z ) ) );
    #ifdef USE_MIRROR
      vec4 tc = uMirrorMatrix * vec4( vWorld, 1.0 );
      tc.xy += n.xz * tc.w * 0.06;
      vec3 mc = texture2DProj( tMirror, tc ).rgb;
      refl = mc;
      fres = mix( fres, 0.35 + 0.65 * fres, 0.6 );
    #endif
    float sd = max( dot( R, uSunDir ), 0.0 );
    float glit = pow( sd, 700.0 ) * 24.0 + pow( sd, 60.0 ) * 0.5;
    vec3 deep = mix( uShallow, uDeep, smoothstep( 0.0, 2.5, vEdge ) );
    vec3 col = mix( deep, refl, fres ) + uSunColor * glit;
    // brighter lip right at the shore
    col += vec3( 0.06, 0.055, 0.045 ) * ( 1.0 - smoothstep( 0.0, 0.5, vEdge ) );
    float alpha = mix( uOpacity, 1.0, fres ) * smoothstep( 0.0, 0.3, vEdge );
    gl_FragColor = vec4( col, alpha );
    #include <fog_fragment>
  }
`;

function makeMaterial(mirror) {
  const m = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uDeep: { value: new THREE.Color(0x2c3a37) },
        uShallow: { value: new THREE.Color(0x4f5a4c) },
        uOpacity: { value: 0.82 },
        uRipple: { value: 1 },
        uF0: { value: 0.1 },
        uRings: { value: [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()] },
        tMirror: { value: null },
        uMirrorMatrix: { value: new THREE.Matrix4() }
      }
    ]),
    transparent: true,
    depthWrite: false,
    fog: true
  });
  // shared uniforms by reference (merge() cloned the others)
  Object.assign(m.uniforms, U);
  if (mirror) m.defines = { USE_MIRROR: '' };
  m.userData.loqPatched = true;
  return m;
}

// regular grid over a region; keep quads near water, set edge distance
function gridWater(x0, z0, x1, z1, step, y, edgeFn, flowFn) {
  const nx = Math.ceil((x1 - x0) / step);
  const nz = Math.ceil((z1 - z0) / step);
  const pos = [];
  const edge = [];
  const flow = [];
  const idx = [];
  const keep = [];
  for (let j = 0; j <= nz; j++)
    for (let i = 0; i <= nx; i++) {
      const x = x0 + i * step;
      const z = z0 + j * step;
      const e = edgeFn(x, z);
      pos.push(x, y, z);
      edge.push(Math.max(0, e));
      const f = flowFn(x, z);
      flow.push(f[0], f[1]);
      keep.push(e > -1.6);
    }
  for (let j = 0; j < nz; j++)
    for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i;
      const b = a + 1;
      const c = a + nx + 1;
      const d = c + 1;
      if (keep[a] || keep[b] || keep[c] || keep[d]) idx.push(a, c, b, b, c, d);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aEdge', new THREE.Float32BufferAttribute(edge, 1));
  g.setAttribute('aFlow', new THREE.Float32BufferAttribute(flow, 2));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}

// ribbon along a polyline; yFn gives the water height at each centre point
function ribbonWater(pts, half, yFn, speed) {
  const pos = [];
  const edge = [];
  const flow = [];
  const idx = [];
  const across = [-1.25, -0.8, -0.4, 0, 0.4, 0.8, 1.25];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const [x, z] = pts[i];
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0];
    let dz = b[1] - a[1];
    const l = Math.hypot(dx, dz) || 1;
    dx /= l;
    dz /= l;
    const y = yFn(x, z, i / (n - 1));
    for (const s of across) {
      pos.push(x - dz * s * half, y, z + dx * s * half);
      edge.push(Math.max(0, (1 - Math.abs(s)) * half));
      flow.push(dx * speed, dz * speed);
    }
  }
  const m = across.length;
  for (let i = 0; i < n - 1; i++)
    for (let k = 0; k < m - 1; k++) {
      const a = i * m + k;
      const b = a + 1;
      const c = a + m;
      const d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aEdge', new THREE.Float32BufferAttribute(edge, 1));
  g.setAttribute('aFlow', new THREE.Float32BufferAttribute(flow, 2));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}

export function createWater(tier) {
  const group = new THREE.Group();
  group.name = 'water';
  const useMirror = !!tier.reflections;
  const pondMat = makeMaterial(useMirror);
  const flowMat = makeMaterial(false);
  flowMat.uniforms.uOpacity.value = 0.86;
  flowMat.uniforms.uF0.value = 0.16;

  // pond (+ the level part of the garden stream joins it)
  let px0 = Infinity;
  let px1 = -Infinity;
  let pz0 = Infinity;
  let pz1 = -Infinity;
  for (const [x, z] of POND) {
    px0 = Math.min(px0, x);
    px1 = Math.max(px1, x);
    pz0 = Math.min(pz0, z);
    pz1 = Math.max(pz1, z);
  }
  const pondGeo = gridWater(px0 - 2, pz0 - 2, px1 + 2, pz1 + 2, tier.name === 'low' ? 1.0 : 0.6, WATER_LEVEL, (x, z) => Math.min(-pondDist(x, z), isletDist(x, z)), () => [0, 0]);
  const pond = new THREE.Mesh(pondGeo, pondMat);
  pond.name = 'pond';
  pond.renderOrder = 2;
  group.add(pond);

  // garden stream (level canal inside the walls, descending outside)
  const streamY = (x, z) => {
    if (z > -58 && z < 46) return WATER_LEVEL;
    return Math.max(terrainHeight(x, z) + 0.36, RIVER_LEVEL + 0.05);
  };
  const sN = new THREE.Mesh(ribbonWater(STREAM_N.filter(([, z]) => z > -84), 0.95, streamY, 0.35), flowMat);
  const sS = new THREE.Mesh(
    ribbonWater(STREAM_S, 0.95, (x, z, t) => (z < 46 ? WATER_LEVEL : Math.max(RIVER_LEVEL + 0.05, WATER_LEVEL - (z - 46) * 0.025)), 0.4),
    flowMat
  );
  sN.renderOrder = sS.renderOrder = 2;
  group.add(sN, sS);

  // river: long ribbon flowing east
  const rpts = [];
  for (let x = -640; x <= 640; x += 6) rpts.push([x, riverZ(x)]);
  const river = new THREE.Mesh(ribbonWater(rpts, RIVER_HALF + 1.2, () => RIVER_LEVEL, 0.55), flowMat);
  river.name = 'river';
  river.renderOrder = 2;
  group.add(river);

  // ---------------------------------------------------------------- mirror (desktop)
  let mirror = null;
  if (useMirror) {
    const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, depthBuffer: true, generateMipmaps: false });
    const cam = new THREE.PerspectiveCamera();
    cam.layers.set(LAYER_REFLECT);
    const normal = new THREE.Vector3(0, 1, 0);
    const P0 = new THREE.Vector3(0, WATER_LEVEL, 0);
    const camPos = new THREE.Vector3();
    const rot = new THREE.Matrix4();
    const look = new THREE.Vector3();
    const view = new THREE.Vector3();
    const target = new THREE.Vector3();
    const plane = new THREE.Plane();
    const clip = new THREE.Vector4();
    const q = new THREE.Vector4();
    const tm = pondMat.uniforms.uMirrorMatrix.value;
    const sphere = pondGeo.boundingSphere.clone();
    const frustum = new THREE.Frustum();
    const pm = new THREE.Matrix4();
    pondMat.uniforms.tMirror.value = rt.texture;
    let frame = 0;
    mirror = {
      setSize(w, h) {
        rt.setSize(Math.max(2, Math.round(w * 0.5)), Math.max(2, Math.round(h * 0.5)));
      },
      update(renderer, scene, camera) {
        frame++;
        pm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(pm);
        pond.visible = frustum.intersectsSphere(sphere);
        if (!pond.visible || frame % 2) return;
        camPos.setFromMatrixPosition(camera.matrixWorld);
        view.subVectors(P0, camPos);
        if (view.dot(normal) > 0) return;
        view.reflect(normal).negate().add(P0);
        rot.extractRotation(camera.matrixWorld);
        look.set(0, 0, -1).applyMatrix4(rot).add(camPos);
        target.subVectors(P0, look).reflect(normal).negate().add(P0);
        cam.position.copy(view);
        cam.up.set(0, 1, 0).applyMatrix4(rot).reflect(normal);
        cam.lookAt(target);
        cam.far = camera.far;
        cam.near = camera.near;
        cam.updateMatrixWorld();
        cam.projectionMatrix.copy(camera.projectionMatrix);
        tm.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
        tm.multiply(cam.projectionMatrix).multiply(cam.matrixWorldInverse);
        plane.setFromNormalAndCoplanarPoint(normal, P0).applyMatrix4(cam.matrixWorldInverse);
        clip.set(plane.normal.x, plane.normal.y, plane.normal.z, plane.constant);
        const e = cam.projectionMatrix.elements;
        q.x = (Math.sign(clip.x) + e[8]) / e[0];
        q.y = (Math.sign(clip.y) + e[9]) / e[5];
        q.z = -1.0;
        q.w = (1.0 + e[10]) / e[14];
        clip.multiplyScalar(2.0 / clip.dot(q));
        e[2] = clip.x;
        e[6] = clip.y;
        e[10] = clip.z + 1.0 - 0.003;
        e[14] = clip.w;
        cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
        const prevTarget = renderer.getRenderTarget();
        const prevShadow = renderer.shadowMap.autoUpdate;
        renderer.shadowMap.autoUpdate = false;
        group.visible = false;
        renderer.setRenderTarget(rt);
        renderer.clear();
        renderer.render(scene, cam);
        group.visible = true;
        renderer.setRenderTarget(prevTarget);
        renderer.shadowMap.autoUpdate = prevShadow;
      }
    };
  }

  let ringIdx = 0;
  return {
    group,
    pond,
    mirror,
    materials: [pondMat, flowMat],
    // ripple ring on the pond at (x, z)
    ring(x, z, strength = 1) {
      const r = pondMat.uniforms.uRings.value[ringIdx++ % 4];
      r.set(x, z, U.uTime.value, strength);
    }
  };
}
