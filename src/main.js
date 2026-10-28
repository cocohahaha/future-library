import './style.css';
import { WebGLRenderer, PerspectiveCamera, NoToneMapping, PCFShadowMap, DataTexture, RGBAFormat, UnsignedByteType, SRGBColorSpace, Vector2, Vector3, MathUtils } from 'three';
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
// ---- library overview (图书馆全貌): a separate scene, loaded on first use.
// Opening it dives the camera into the page and fades through the paper's
// colour; the city then settles in from high above its plan. Coming back
// reverses that and lands on the book (on a zone's spread, if asked).
let ov = null; // the built overview
let ovPost = null; // its post settings (AO radius etc. at metre scale)
let ovLoading = null;
let view = 'book'; // the scene being rendered: 'book' | 'overview'
let phase = 'idle'; // 'dive' → 'wait' → 'reveal' | 'rise' → 'land'
let pt = 0; // seconds into the phase
let fade = 1; // post fade (0 = all paper colour)
let dive = 0; // 0..1 how far the book camera has fallen into the page
let diveFrom = 0;
let instantOpen = false;
let pendingZone = -1;
const PAPER = new Vector3(0.92, 0.87, 0.77); // linear page colour
const BOOK_POST = {
  aoRadius: post.ao.uRadius.value,
  aoPower: post.ao.uPower.value,
  bloom: post.uniforms.uBloom.value,
  threshold: post.bright.uThreshold.value,
  exposure: post.uniforms.uExposure.value,
  vignette: post.uniforms.uVignette.value
};
function applyPost(p) {
  post.ao.uRadius.value = p.aoRadius;
  post.ao.uPower.value = p.aoPower;
  post.uniforms.uBloom.value = p.bloom;
  post.bright.uThreshold.value = p.threshold;
  post.uniforms.uExposure.value = p.exposure;
  post.uniforms.uVignette.value = p.vignette;
}
function setViewParam(on) {
  try {
    const u = new URL(location.href);
    if (on) u.searchParams.set('view', 'overview');
    else u.searchParams.delete('view');
    history.replaceState(history.state, '', u);
  } catch (_) {
    /* file:// or sandboxed */
  }
}
const loaderText = loaderEl.querySelector('.loader-text');
function showLoader(on) {
  if (on) loaderText.textContent = t('ovLoading');
  loaderEl.classList.toggle('is-done', !on);
}
function loadOverview() {
  if (!ovLoading)
    ovLoading = import('./overview/index.js')
      .then(async (mod) => {
        const o = mod.createOverview({
          renderer,
          tier,
          canvas,
          labelRoot: document.getElementById('ov-labels'),
          onRead: (id) => closeOverview({ zone: ZONE_ORDER.indexOf(id) })
        });
        renderer.getDrawingBufferSize(db);
        o.resize(window.innerWidth, window.innerHeight, db.x, db.y);
        try {
          await renderer.compileAsync(o.scene, o.camera);
        } catch (_) {
          /* compiles on first render instead */
        }
        ovPost = mod.POST;
        ov = o;
        return o;
      })
      .catch((err) => {
        ovLoading = null;
        console.error(err);
        if (phase === 'wait') closeOverview();
      });
  return ovLoading;
}
function openOverview({ instant = false } = {}) {
  if (view === 'overview' || phase === 'dive' || phase === 'wait') return;
  loadOverview();
  if (zoomed) toggleZoom(false);
  post.uniforms.uFadeColor.value.copy(PAPER);
  instantOpen = instant;
  phase = instant ? 'wait' : 'dive';
  pt = 0;
  if (instant) fade = 0;
  hud.setView('overview');
  setViewParam(true);
}
function closeOverview({ zone = -1 } = {}) {
  if (phase === 'rise' || phase === 'land') return;
  if (view !== 'overview' && phase !== 'dive' && phase !== 'wait' && phase !== 'reveal') return;
  pendingZone = zone;
  setViewParam(false);
  hud.setView('book');
  if (view === 'overview') {
    ov.leave();
    phase = 'rise';
  } else {
    // still falling into the page (or waiting on the module): climb back out
    showLoader(false);
    diveFrom = dive;
    phase = 'land';
  }
  pt = 0;
}
const smooth = (a, b, x) => MathUtils.smoothstep(x, a, b);
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
function stepTransition(dt) {
  if (phase === 'idle') return;
  pt += dt;
  if (phase === 'dive') {
    const k = Math.min(1, pt / 1.15);
    dive = easeInOut(k);
    fade = 1 - smooth(0.45, 1, k);
    if (k >= 1) {
      phase = 'wait';
      pt = 0;
    }
  }
  if (phase === 'wait') {
    fade = 0;
    if (ov) {
      view = 'overview';
      applyPost(ovPost);
      ov.enter({ instant: instantOpen });
      debugOverviewCamera();
      showLoader(false);
      pt = 0;
      // a deep link has no page to fade out of: the loader's own fade reveals
      // the city, and the first frame drawn is already the finished view
      if (instantOpen) {
        fade = 1;
        phase = 'idle';
      } else phase = 'reveal';
    } else if (pt > 0.3 || instantOpen) showLoader(true);
  }
  if (phase === 'reveal') {
    fade = smooth(0, 1.0, pt);
    if (pt >= 1.0) phase = 'idle';
  }
  if (phase === 'rise') {
    fade = 1 - smooth(0, 0.75, pt);
    if (pt >= 0.75) {
      view = 'book';
      applyPost(BOOK_POST);
      ov.hideLabels();
      diveFrom = 1;
      phase = 'land';
      pt = 0;
    }
  }
  if (phase === 'land') {
    if (pt <= dt && pendingZone >= 0) {
      go({ zone: pendingZone });
      pendingZone = -1;
    }
    const k = Math.min(1, pt / 1.3);
    dive = diveFrom * (1 - easeInOut(k));
    fade = Math.max(fade, smooth(0, 0.85, pt));
    if (k >= 1) {
      dive = 0;
      fade = 1;
      phase = 'idle';
    }
  }
}
const diveEnd = new Vector3();
function applyDive() {
  // fall toward the paper under the look-at point, ending a few mm above it
  diveEnd.copy(rig.target).add(new Vector3(0, 24, 9));
  camera.position.lerp(diveEnd, dive);
  camera.lookAt(rig.target);
}
// ?view=overview&ovcam=theta,phi,radius pins the overview camera (screenshots)
function debugOverviewCamera() {
  const c = params.get('ovcam');
  if (!c || !ov) return;
  const [theta, phi, radius] = c.split(',').map(Number);
  const s = { theta, phi, radius };
  ov.orbit.snap(s);
  ov.orbit.setGoal(s, 7);
}
// the overview bar's zone shortcuts (and keys 1–5): fly to a part of the
// building and open its card; the open zone again, or null, flies home
function focusZone(id) {
  if (view !== 'overview' || !ov) return;
  if (id && ov.labels.open === id) id = null;
  if (ov.focusZone) {
    ov.focusZone(id);
    return;
  }
  ov.labels.setOpen(id);
  const f = id ? ov.library.focus[id] : ov.orbit.home;
  ov.orbit.setGoal({ target: f.target, radius: f.radius, phi: f.phi, theta: f.theta ?? ov.orbit.cur.theta }, 1.9);
}
window.addEventListener('keydown', (e) => {
  if (view !== 'overview' || phase !== 'idle') return;
  if (e.key === 'Escape') {
    if (ov.labels.open) focusZone(null);
    else closeOverview();
    e.preventDefault();
    return;
  }
  if (e.target && e.target.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return;
  const n = Number(e.key);
  if (n >= 1 && n <= ZONE_ORDER.length && !e.metaKey && !e.ctrlKey && !e.altKey) {
    focusZone(ZONE_ORDER[n - 1]);
    e.preventDefault();
    return;
  }
  if (ov.key(e.key)) e.preventDefault();
});

const hud = createHud({ go, toggleZoom, openOverview, closeOverview, focusZone });
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
createInput({ canvas, camera, book, pages, rig, go, toggleZoom, openOverview, isActive: () => view === 'book' && phase === 'idle' });

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
  if (ov) ov.resize(w, h, db.x, db.y);
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
  stepTransition(dt);
  post.uniforms.uFade.value = fade;
  if (view === 'overview') {
    ov.update(dt, clock);
    hud.setOvZone(ov.labels.open);
    post.render(ov.scene, ov.camera, clock);
    return;
  }
  if (!turn) book.update(dt);
  rig.state.open = book.openness;
  rig.update(dt, clock, camera.aspect);
  if (dive > 0) applyDive();
  stage.update(camera);
  plates.update(dt, clock);
  pages.step(1);
  if (phase === 'wait') return; // all paper colour: nothing to draw
  post.render(scene, camera, clock);
}
requestAnimationFrame(frame);
// ?view=overview opens straight into the overview, but only once the page has
// loaded: Chrome aborts (net::ERR_ABORTED) a dynamic import started while this
// entry module is still evaluating, and the overview chunk imports this one.
if (params.get('view') === 'overview') {
  const open = () => openOverview({ instant: true });
  if (document.readyState === 'complete') setTimeout(open, 0);
  else window.addEventListener('load', () => setTimeout(open, 0), { once: true });
} else loaderEl.classList.add('is-done');
document.body.classList.add('is-ready');

window.__loq = { scene, camera, renderer, book, pages, plates, rig, stage, post, tier, go, openOverview, closeOverview, get overview() { return ov; }, get phase() { return phase; } };
window.__ready = true;
