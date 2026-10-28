import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { detectTier, TIERS } from './core/config.js';
import { U } from './core/materials.js';
import { createPost } from './core/post.js';
import { createGovernor } from './core/perf.js';
import { buildWorld } from './world/world.js';
import { terrainHeight } from './world/layout.js';
import { t, applyStatic, onLangChange } from './i18n.js';
import { createHUD } from './ui/hud.js';

// language first, so the loader and HUD never flash the wrong copy
applyStatic();

// ---------------------------------------------------------------- device tier
const tier = TIERS[detectTier()];
const coarse = matchMedia('(pointer: coarse)').matches;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.dataset.tier = tier.name;

// ---------------------------------------------------------------- renderer
const canvas = document.getElementById('scene');
const loaderEl = document.getElementById('loader');
const progressEl = document.getElementById('loader-progress');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
} catch (err) {
  loaderEl.innerHTML = `<span>${t('noWebGL')}</span>`;
  throw err;
}
renderer.toneMapping = THREE.NoToneMapping; // the post pass tone-maps
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = tier.shadowSoft ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
renderer.shadowMap.autoUpdate = false; // the world is static; shadows render once

// render-pixel budget: cap the pixel ratio so the frame stays within the tier's megapixels
const governor = createGovernor({ minScale: tier.minScale, onChange: () => resize() });
function pixelRatio() {
  const dpr = window.devicePixelRatio || 1;
  const mpCap = Math.sqrt((tier.megapixels * 1e6) / (window.innerWidth * window.innerHeight));
  return Math.max(0.5, Math.min(dpr, tier.maxDpr, mpCap) * governor.scale);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.3, 4000);
const post = createPost(renderer, tier);

// ---------------------------------------------------------------- controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.enablePan = true;
controls.screenSpacePanning = false; // pan across the ground
controls.panSpeed = coarse ? 1.1 : 0.9;
controls.minDistance = 3.5;
controls.maxDistance = 300;
controls.maxPolarAngle = Math.PI * 0.485;
controls.minPolarAngle = Math.PI * 0.06;
controls.rotateSpeed = coarse ? 0.65 : 0.5;
controls.zoomSpeed = 0.9;
controls.zoomToCursor = !coarse;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.18;
controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
controls.enabled = false; // until the intro lands

// ---------------------------------------------------------------- shared state
let clockTime = 0;
const world = {
  speed: 1,
  hushUntil: 0,
  hush(seconds) {
    world.hushUntil = clockTime + seconds;
  }
};

// ---------------------------------------------------------------- camera views
const overview = { position: new THREE.Vector3(), target: new THREE.Vector3() };
function computeOverview() {
  const portrait = camera.aspect < 0.85;
  camera.fov = portrait ? 62 : 48;
  camera.updateProjectionMatrix();
  if (portrait) {
    overview.position.set(70, 92, 128);
    overview.target.set(-8, 0, 0);
  } else {
    overview.position.set(56, 46, 82);
    overview.target.set(-7, 2, -4);
  }
}
computeOverview();
camera.position.set(260, 210, 380);
controls.target.set(-20, 0, -40);
camera.lookAt(controls.target);

let tween = null;
function flyTo(view, duration = 1.9) {
  const from = camera.position.clone();
  const dist = from.distanceTo(view.position);
  tween = {
    fromPos: from,
    fromTarget: controls.target.clone(),
    toPos: view.position.clone(),
    toTarget: view.target.clone(),
    lift: Math.min(28, dist * 0.22),
    t: 0,
    duration: reducedMotion ? 0.01 : duration
  };
  controls.autoRotate = false;
}
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
controls.addEventListener('start', () => {
  tween = null; // the user takes over
  controls.autoRotate = false;
  idleSince = clockTime;
});

// ---------------------------------------------------------------- build the world
let W = null;
let hud = null;
let active = null;
let idleSince = 0;

function setProgress(p) {
  if (progressEl) progressEl.style.transform = `scaleX(${Math.max(0.04, p).toFixed(3)})`;
}

async function start() {
  resize();
  W = await buildWorld({ scene, tier, world, onProgress: (p) => setProgress(p) });
  const zones = W.zones;
  const zoneById = Object.fromEntries(zones.map((z) => [z.def.id, z]));
  const hitMeshes = zones.flatMap((z) => z.hits);
  onLangChange(() => zones.forEach((z) => z.onLang && z.onLang()));

  hud = createHUD({
    zones,
    onSelect: (id) => select(id),
    onActivate: () => active && active.activate(),
    onOverview: () => clearSelection()
  });

  function select(id) {
    const zone = zoneById[id];
    if (!zone) return;
    if (active && active !== zone) active.focused = false;
    active = zone;
    zone.focused = true;
    zone.activate();
    W.setFocusZone(zone);
    hud.setActive(id);
    hud.show(zone);
    // tall phone screens need more distance to frame the same zone
    const v = zone.cameraView;
    const k = camera.aspect < 0.85 ? 1.55 : 1;
    flyTo({ target: v.target, position: v.position.clone().sub(v.target).multiplyScalar(k).add(v.target) });
  }
  function clearSelection() {
    if (active) active.focused = false;
    active = null;
    W.setFocusZone(null);
    hud.setActive(null);
    hud.hide();
    flyTo(overview, 2.2);
  }
  window.__select = select;

  // ---- tap / click picking (distinguishes taps from orbit drags), double-tap travel
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pointers = new Map();
  let tapCandidate = null;
  let lastTap = { time: 0, x: 0, y: 0 };
  const toNDC = (e) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
  };
  canvas.addEventListener('pointerdown', (e) => {
    pointers.set(e.pointerId, true);
    tapCandidate = pointers.size === 1 ? { x: e.clientX, y: e.clientY, time: performance.now(), id: e.pointerId } : null;
  });
  canvas.addEventListener('pointerup', (e) => {
    pointers.delete(e.pointerId);
    if (!tapCandidate || tapCandidate.id !== e.pointerId) return;
    const moved = Math.hypot(e.clientX - tapCandidate.x, e.clientY - tapCandidate.y);
    const quick = performance.now() - tapCandidate.time < 450;
    tapCandidate = null;
    if (moved > (coarse ? 12 : 6) || !quick) return;
    toNDC(e);
    raycaster.setFromCamera(ndc, camera);
    const now = performance.now();
    const dbl = now - lastTap.time < 360 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 30;
    lastTap = { time: now, x: e.clientX, y: e.clientY };
    if (dbl) {
      // travel: glide to the tapped spot on the ground, keeping the view direction
      const hit = raycaster.intersectObject(W.terrain.mesh, false)[0];
      if (hit) {
        const dir = camera.position.clone().sub(controls.target).normalize();
        const dist = THREE.MathUtils.clamp(camera.position.distanceTo(controls.target), 14, 40);
        const target = hit.point.clone().add(new THREE.Vector3(0, 1.4, 0));
        flyTo({ target, position: target.clone().addScaledVector(dir, dist) }, 1.6);
      }
      return;
    }
    const hit = raycaster.intersectObjects(hitMeshes, false)[0];
    if (hit) select(hit.object.userData.zoneId);
  });
  canvas.addEventListener('pointercancel', (e) => {
    pointers.delete(e.pointerId);
    tapCandidate = null;
  });
  if (!coarse) {
    canvas.addEventListener('pointermove', (e) => {
      if (pointers.size) return;
      toNDC(e);
      raycaster.setFromCamera(ndc, camera);
      canvas.style.cursor = raycaster.intersectObjects(hitMeshes, false).length ? 'pointer' : 'grab';
    });
  }

  // ---- keyboard: 1–5 zones, Esc overview, WASD / arrows to walk the view
  const keys = new Set();
  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'Escape') clearSelection();
    const n = Number(e.key);
    if (n >= 1 && n <= zones.length) select(zones[n - 1].def.id);
    keys.add(e.key.toLowerCase());
  });
  window.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
  window.addEventListener('blur', () => keys.clear());
  W.walkKeys = keys;

  // ---- first frame: compile, render shadows once, reveal
  await renderer.compileAsync(scene, camera).catch(() => {});
  renderer.shadowMap.needsUpdate = true;
  setProgress(1);
  loaderEl.classList.add('is-done');
  document.body.classList.add('is-ready');
  const params = new URLSearchParams(location.search);
  const deep = params.get('zone');
  const camParam = params.get('cam');
  if (camParam) {
    const c = camParam.split(',').map(Number);
    camera.position.set(c[0], c[1], c[2]);
    controls.target.set(c[3], c[4], c[5]);
  } else if (zoneById[deep]) {
    camera.position.copy(overview.position).add(new THREE.Vector3(0, 30, 40));
    if (params.get('intro') === '0') tween = null;
    select(deep);
    if (params.get('intro') === '0') tween.duration = 0.01;
  } else if (params.get('intro') === '0') {
    camera.position.copy(overview.position);
    controls.target.copy(overview.target);
  } else flyTo(overview, reducedMotion ? 0.01 : 4.2);
  if (params.get('stats')) {
    renderer.info.autoReset = false;
    window.__stats = () => ({ ...renderer.info.render });
  }
  controls.enabled = true;
  idleSince = clockTime;
}

// ---------------------------------------------------------------- resize
const db = new THREE.Vector2();
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setPixelRatio(pixelRatio());
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  computeOverview();
  renderer.getDrawingBufferSize(db);
  post.setSize(db.x, db.y);
  if (W && W.water.mirror) W.water.mirror.setSize(db.x, db.y);
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 200));

// ---------------------------------------------------------------- loop
let last = performance.now();
let viewShift = 0;
let windFlow = 0;
const move = new THREE.Vector3();
const fwd = new THREE.Vector3();
const right = new THREE.Vector3();

function frame(now) {
  requestAnimationFrame(frame);
  const rawDt = (now - last) / 1000;
  last = now;
  if (document.hidden) return;
  const dt = Math.min(rawDt, 1 / 20);
  governor.sample(rawDt);
  const motion = reducedMotion ? 0.35 : 1;
  clockTime += dt * motion;

  // the Unassisted Room's hush eases the whole library's motion
  const hushed = clockTime < world.hushUntil;
  const targetSpeed = hushed ? 0.08 : 1;
  world.speed += (targetSpeed - world.speed) * Math.min(1, dt * (targetSpeed < world.speed ? 2.2 : 0.8));
  document.body.classList.toggle('is-hushed', hushed);
  const hush = 1 - (world.speed - 0.08) / 0.92;
  U.uTime.value += dt * motion * world.speed;
  windFlow += dt * motion * (0.35 + 0.65 * world.speed);
  U.uWindTime.value = windFlow;

  // narrow screens: the panel is a bottom sheet, so lift the projection centre
  const sheetOpen = active && window.innerWidth <= 720;
  const offTarget = sheetOpen ? window.innerHeight * 0.2 : 0;
  viewShift += (offTarget - viewShift) * Math.min(1, dt * 4);
  if (Math.abs(viewShift) > 0.5) camera.setViewOffset(window.innerWidth, window.innerHeight, 0, viewShift, window.innerWidth, window.innerHeight);
  else if (camera.view && camera.view.enabled) camera.clearViewOffset();

  if (tween) {
    tween.t += dt / tween.duration;
    const k = easeInOut(Math.min(1, tween.t));
    camera.position.lerpVectors(tween.fromPos, tween.toPos, k);
    camera.position.y += Math.sin(k * Math.PI) * tween.lift;
    controls.target.lerpVectors(tween.fromTarget, tween.toTarget, k);
    if (tween.t >= 1) tween = null;
  }

  // keyboard walking (desktop)
  if (W && W.walkKeys && W.walkKeys.size && !tween) {
    camera.getWorldDirection(fwd);
    fwd.y = 0;
    fwd.normalize();
    right.crossVectors(fwd, camera.up).normalize();
    move.set(0, 0, 0);
    const k = W.walkKeys;
    if (k.has('w') || k.has('arrowup')) move.add(fwd);
    if (k.has('s') || k.has('arrowdown')) move.sub(fwd);
    if (k.has('d') || k.has('arrowright')) move.add(right);
    if (k.has('a') || k.has('arrowleft')) move.sub(right);
    if (move.lengthSq() > 0) {
      const sp = THREE.MathUtils.clamp(camera.position.distanceTo(controls.target) * 0.9, 6, 60) * dt;
      move.normalize().multiplyScalar(sp);
      camera.position.add(move);
      controls.target.add(move);
    }
  }

  // idle in the overview: drift slowly around the valley
  if (W && !active && !tween && clockTime - idleSince > 14 && !reducedMotion) controls.autoRotate = true;

  controls.update(dt);
  // keep the view inside the valley and above the ground
  controls.target.x = THREE.MathUtils.clamp(controls.target.x, -190, 190);
  controls.target.z = THREE.MathUtils.clamp(controls.target.z, -210, 210);
  controls.target.y = THREE.MathUtils.clamp(controls.target.y, -1, 28);
  const ground = terrainHeight(camera.position.x, camera.position.z) + 1.2;
  if (camera.position.y < ground) camera.position.y = ground;

  if (W) {
    W.update(clockTime, dt, world.speed, hush);
    if (W.water.mirror && governor.scale > 0.75) W.water.mirror.update(renderer, scene, camera);
  }
  if (!renderer.info.autoReset) renderer.info.reset();
  post.render(scene, camera, clockTime);
  if (hud) hud.updateLabels(camera, window.innerWidth, window.innerHeight);
}
requestAnimationFrame(frame);
start().catch((err) => {
  console.error(err);
  loaderEl.innerHTML = `<span>${t('noWebGL')}</span>`;
});

// debugging handle
window.__loq = { scene, camera, renderer, U, post, controls, governor, tier, get world() { return W; } };
