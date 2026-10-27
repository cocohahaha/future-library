import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { PALETTE, ZONES } from './zones/data.js';
import { t, applyStatic, onLangChange } from './i18n.js';
import { createEnvironment } from './scene/environment.js';
import { createLeaves } from './scene/leaves.js';
import { createWell } from './zones/well.js';
import { createProvenance } from './zones/provenance.js';
import { createDialogue } from './zones/dialogue.js';
import { createQuiet } from './zones/quiet.js';
import { createVerify } from './zones/verify.js';
import { createHUD } from './ui/hud.js';

// language first, so the loader and HUD never flash the wrong copy
applyStatic();

// ---------------------------------------------------------------- device tier
const coarse = matchMedia('(pointer: coarse)').matches;
const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 720;
const quality = coarse || smallScreen ? 'low' : 'high';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const maxPR = quality === 'low' ? 1.5 : 2;
const pixelRatio = () => Math.min(window.devicePixelRatio || 1, maxPR);

// ---------------------------------------------------------------- renderer
const canvas = document.getElementById('scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: quality === 'high', powerPreference: 'high-performance' });
} catch (err) {
  document.getElementById('loader').innerHTML = `<span>${t('noWebGL')}</span>`;
  throw err;
}
renderer.setPixelRatio(pixelRatio());
renderer.setSize(window.innerWidth, window.innerHeight, false);
// Neutral tone mapping keeps paper, stone and pigment colours honest
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = quality === 'low' ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(PALETTE.haze);
scene.fog = new THREE.Fog(PALETTE.haze, 34, 175);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 220);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.enablePan = false;
controls.minDistance = 6;
controls.maxDistance = 44;
controls.maxPolarAngle = Math.PI * 0.47;
controls.minPolarAngle = Math.PI * 0.12;
controls.rotateSpeed = coarse ? 0.6 : 0.5;
controls.zoomSpeed = 0.8;
controls.autoRotate = !reducedMotion;
controls.autoRotateSpeed = 0.25;
controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE };

// ---------------------------------------------------------------- shared context
const world = {
  speed: 1,
  hushUntil: 0,
  hush(seconds) {
    world.hushUntil = clockTime + seconds;
  }
};

const ctx = { quality, world, env: null };

const env = createEnvironment({ quality });
ctx.env = env;
scene.add(env.group);

// ginkgo leaves drifting through the whole courtyard
const leaves = createLeaves({ count: quality === 'low' ? 90 : 170, radius: 32, height: 15 });
scene.add(leaves.mesh);

// ---------------------------------------------------------------- zones
const builders = {
  well: createWell,
  provenance: createProvenance,
  dialogue: createDialogue,
  quiet: createQuiet,
  verify: createVerify
};
const zones = ZONES.map((def) => builders[def.id](def, ctx));
const zoneById = Object.fromEntries(zones.map((z) => [z.def.id, z]));
for (const z of zones) scene.add(z.group);
scene.updateMatrixWorld(true);
// views depend on world positions, so finalise them after placement
const hitMeshes = zones.flatMap((z) => z.hits);
// zones that paint text into the scene (the claim scroll) repaint on toggle
onLangChange(() => zones.forEach((z) => z.onLang && z.onLang()));

// ---------------------------------------------------------------- camera views
const overview = { position: new THREE.Vector3(), target: new THREE.Vector3(0, 2.5, 0) };
function computeOverview() {
  const portrait = camera.aspect < 0.85;
  camera.fov = portrait ? 64 : 50;
  camera.updateProjectionMatrix();
  // pull back further on tall phones so the whole ring fits
  const d = portrait ? 38 : 26;
  overview.position.set(0, portrait ? 19 : 15, d);
}
computeOverview();
camera.position.set(-14, 30, 30); // intro: descend from above into the overview
controls.target.copy(overview.target);

let tween = null;
function flyTo(view, duration = 1.7) {
  tween = {
    fromPos: camera.position.clone(),
    fromTarget: controls.target.clone(),
    toPos: view.position.clone(),
    toTarget: view.target.clone(),
    t: 0,
    duration: reducedMotion ? 0.01 : duration
  };
}
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
controls.addEventListener('start', () => {
  tween = null; // user takes over
  controls.autoRotate = false;
});

// ---------------------------------------------------------------- selection
let active = null;
const hud = createHUD({
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
  hud.setActive(id);
  hud.show(zone);
  controls.autoRotate = false;
  // tall phone screens need more distance to frame the same zone
  const v = zone.cameraView;
  const k = camera.aspect < 0.85 ? 1.5 : 1;
  flyTo({ target: v.target, position: v.position.clone().sub(v.target).multiplyScalar(k).add(v.target) });
}

function clearSelection() {
  if (active) active.focused = false;
  active = null;
  hud.setActive(null);
  hud.hide();
  flyTo(overview, 1.9);
}

// tap / click picking — distinguishes taps from orbit drags
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const pointers = new Map();
let tapCandidate = null;

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

  const rect = canvas.getBoundingClientRect();
  ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObjects(hitMeshes, false)[0];
  if (hit) select(hit.object.userData.zoneId);
});
canvas.addEventListener('pointercancel', (e) => {
  pointers.delete(e.pointerId);
  tapCandidate = null;
});

// hover cursor on desktop
if (!coarse) {
  canvas.addEventListener('pointermove', (e) => {
    if (pointers.size) return;
    const rect = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    canvas.style.cursor = raycaster.intersectObjects(hitMeshes, false).length ? 'pointer' : 'grab';
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') clearSelection();
  const n = Number(e.key);
  if (n >= 1 && n <= zones.length) select(zones[n - 1].def.id);
});

// ---------------------------------------------------------------- resize
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setPixelRatio(pixelRatio());
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  computeOverview();
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 150));
resize();

// ---------------------------------------------------------------- loop
let clockTime = 0;
let last = performance.now();
let introDone = false;
let viewShift = 0;

function frame(now) {
  const dt = Math.min((now - last) / 1000, 1 / 20);
  last = now;
  const motion = reducedMotion ? 0.35 : 1;
  clockTime += dt * motion;
  const t = clockTime;

  // global hush from the Unassisted Room eases the whole library's motion
  const targetSpeed = t < world.hushUntil ? 0.08 : 1;
  world.speed += (targetSpeed - world.speed) * Math.min(1, dt * (targetSpeed < world.speed ? 2.2 : 0.8));
  document.body.classList.toggle('is-hushed', t < world.hushUntil);

  // On narrow screens the panel is a bottom sheet: shift the projection centre
  // up so the focused zone sits in the visible area above it.
  const sheetOpen = active && window.innerWidth <= 720;
  const offTarget = sheetOpen ? window.innerHeight * 0.2 : 0;
  viewShift += (offTarget - viewShift) * Math.min(1, dt * 4);
  if (Math.abs(viewShift) > 0.5) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.setViewOffset(w, h, 0, viewShift, w, h);
  } else if (camera.view && camera.view.enabled) {
    camera.clearViewOffset();
  }

  if (tween) {
    tween.t += dt / tween.duration;
    const k = easeInOut(Math.min(1, tween.t));
    camera.position.lerpVectors(tween.fromPos, tween.toPos, k);
    controls.target.lerpVectors(tween.fromTarget, tween.toTarget, k);
    if (tween.t >= 1) tween = null;
  }

  const hush = 1 - (world.speed - 0.08) / 0.92;
  env.update(t, dt * world.speed, hush);
  leaves.update(dt, world.speed);
  for (const z of zones) z.update(t, dt);

  controls.update(dt);
  renderer.render(scene, camera);
  hud.updateLabels(camera, window.innerWidth, window.innerHeight);

  if (!introDone) {
    introDone = true;
    document.getElementById('loader').classList.add('is-done');
    // deep link: ?zone=verify opens straight onto a zone
    const deep = new URLSearchParams(location.search).get('zone');
    if (zoneById[deep]) select(deep);
    else flyTo(overview, 3.2);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
