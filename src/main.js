import './style.css';
import { WebGLRenderer, PerspectiveCamera, NoToneMapping, PCFShadowMap, DataTexture, RGBAFormat, UnsignedByteType, SRGBColorSpace, Vector2 } from 'three';
import { detectTier, TIERS } from './core/config.js';
import { createBaker } from './core/tex.js';
import { createPost } from './core/post.js';
import { createGovernor } from './core/perf.js';
import { createStage, PAD } from './stage/stage.js';
import { createRig } from './stage/camera.js';
import { createBook } from './book/book.js';
import { createPages } from './book/pages.js';
import { setBlank } from './book/materials.js';
import { t, applyStatic, onLangChange } from './i18n.js';

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

onLangChange(() => {
  pages.invalidate();
  pages.focus(book.settled);
});

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
const startSpread = params.has('spread') ? Number(params.get('spread')) : 0;
book.goTo(startSpread, { instant: true });
pages.focus(startSpread);
while (pages.step(4));
const turn = params.get('turn');
if (turn) {
  const [u, tv] = turn.split(',').map(Number);
  book.tau[u] = tv;
  book.relayout();
}
if (params.has('zoom')) rig.state.zoomTarget = rig.state.zoom = Number(params.get('zoom'));
if (params.has('yaw')) rig.state.yaw = Number(params.get('yaw'));

let last = performance.now();
let clock = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const raw = (now - last) / 1000;
  last = now;
  if (document.hidden) return;
  const dt = Math.min(raw, 0.05);
  clock += dt;
  governor.sample(raw);
  if (!turn) book.update(dt);
  rig.state.open = book.openness;
  rig.update(dt, clock, camera.aspect);
  stage.update(camera);
  pages.step(1);
  post.render(scene, camera, clock);
}
requestAnimationFrame(frame);
loaderEl.classList.add('is-done');
document.body.classList.add('is-ready');

window.__loq = { scene, camera, renderer, book, pages, rig, stage, post, tier };
window.__ready = true;
