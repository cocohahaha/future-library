import './style.css';
import { WebGLRenderer, PerspectiveCamera, NoToneMapping, PCFShadowMap, DataTexture, RGBAFormat, UnsignedByteType, SRGBColorSpace, Vector2 } from 'three';
import { detectTier, TIERS } from './core/config.js';
import { createBaker } from './core/tex.js';
import { createPost } from './core/post.js';
import { createGovernor } from './core/perf.js';
import { createStage, PAD } from './stage/stage.js';
import { createRig } from './stage/camera.js';
import { createBook, SPREADS } from './book/book.js';
import { createPages, spreadOfZone } from './book/pages.js';
import { setBlank } from './book/materials.js';
import { createPlates } from './diorama/plates.js';
import { createInput } from './ui/input.js';
import { createHud } from './ui/hud.js';
import { t, applyStatic, onLangChange, ZONE_ORDER } from './i18n.js';

applyStatic();
const params = new URLSearchParams(location.search);
const tier = TIERS[detectTier()];
document.documentElement.dataset.tier = tier.name;

const canvas = document.getElementById('scene');
const loaderEl = document.getElementById('loader');
let renderer;
try {
  renderer = new WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
} catch (err) {
  loaderEl.innerHTML = `<span>${t('noWebGL')}</span>`;
  throw err;
}
renderer.toneMapping = NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFShadowMap;

const blank = new DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, RGBAFormat, UnsignedByteType);
blank.colorSpace = SRGBColorSpace;
blank.needsUpdate = true;
setBlank(blank);

const governor = createGovernor({ minScale: tier.minScale, onChange: () => resize() });
function pixelRatio() {
  const dpr = window.devicePixelRatio || 1;
  const mpCap = Math.sqrt((tier.megapixels * 1e6) / (window.innerWidth * window.innerHeight));
  return Math.max(0.5, Math.min(dpr, tier.maxDpr, mpCap) * governor.scale);
}

const camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 12, 9000);
const rig = createRig(camera);
const post = createPost(renderer, tier);

const baker = createBaker(renderer);
const R = tier.texScale;
const textures = {
  oak: baker.bake('oak', { res: Math.round(1024 * R), mirrored: true }),
  lino: baker.bake('lino', { res: 512 }),
  paper: baker.bake('paper', { res: 512 }),
  weave: baker.bake('weave', { res: 256 })
};
const stage = createStage({ renderer, tier, textures });
const scene = stage.scene;
const pages = createPages({ tier, anisotropy: baker.anisotropy });
const book = createBook({ textures, pages });
book.group.position.y = PAD.h;
scene.add(book.group);

const plates = createPlates({ book, stage, tier });

onLangChange(() => {
  pages.invalidate();
  pages.focus(book.settled);
});

// ---- turning: relative steps, absolute spreads or { zone }
let zoomed = false;
function toggleZoom(v = !zoomed) {
  zoomed = !!v && plates.zone >= 0;
  rig.state.zoomTarget = zoomed ? 1 : 0;
  hud.setZoom(zoomed);
}
function go(arg, relative = false) {
  let s = typeof arg === 'object' ? spreadOfZone(arg.zone) : relative ? book.target + arg : arg;
  s = Math.max(0, Math.min(SPREADS - 1, s));
  if (s === book.target) return;
  if (zoomed) toggleZoom(false);
  book.goTo(s);
}
const hud = createHud({ go, toggleZoom });
let instantShow = false;
book.on('start', (s) => {
  plates.hide();
  pages.focus(s);
  hud.setSpread(s);
});
book.on('settle', (s) => {
  plates.show(s, { instant: instantShow });
  pages.focus(s);
  hud.setSpread(s);
});
createInput({ canvas, camera, book, pages, rig, go, toggleZoom });

const db = new Vector2();
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setPixelRatio(pixelRatio());
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.getDrawingBufferSize(db);
  post.setSize(db.x, db.y);
}
window.addEventListener('resize', resize);
resize();

// ---- debug / deep-link state
// ?spread=0 cover, 1..5 the five zone spreads (contents / after also work);
// ?zone=<id> opens that zone's spread
function startSpread() {
  const z = ZONE_ORDER.indexOf(params.get('zone'));
  if (z >= 0) return spreadOfZone(z);
  const sp = params.get('spread');
  if (sp === 'contents') return 1;
  if (sp === 'after') return SPREADS - 1;
  const n = Math.round(Number(sp)) || 0;
  return n <= 0 ? 0 : n <= 5 ? spreadOfZone(n - 1) : SPREADS - 1;
}
instantShow = true;
book.goTo(startSpread(), { instant: true });
instantShow = false;
pages.focus(book.settled);
while (pages.step(4));
const turn = params.get('turn');
if (turn) {
  const [u, tv] = turn.split(',').map(Number);
  book.tau[u] = tv;
  book.relayout();
}
if (params.has('zoom')) {
  rig.state.zoomTarget = rig.state.zoom = Number(params.get('zoom'));
  zoomed = rig.state.zoom > 0.5;
  hud.setZoom(zoomed);
}
if (params.has('yaw')) rig.state.yaw = Number(params.get('yaw'));

let last = performance.now();
let clock = 0;
function frame() {
  requestAnimationFrame(frame);
  const now = performance.now(); // not the rAF stamp: it can lag (and stall in headless capture)
  const raw = (now - last) / 1000;
  last = now;
  if (document.hidden) return;
  const dt = Math.min(Math.max(raw, 0), 0.05);
  clock += dt;
  governor.sample(raw);
  if (!turn) book.update(dt);
  rig.state.open = book.openness;
  rig.update(dt, clock, camera.aspect);
  stage.update(camera);
  plates.update(dt, clock);
  pages.step(1);
  post.render(scene, camera, clock);
}
requestAnimationFrame(frame);
loaderEl.classList.add('is-done');
document.body.classList.add('is-ready');

window.__loq = { scene, camera, renderer, book, pages, plates, rig, stage, post, tier, go };
window.__ready = true;
