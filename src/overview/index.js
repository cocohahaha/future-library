import { Scene, PerspectiveCamera, SpotLight, HemisphereLight, Group, Vector3, Matrix4, MathUtils } from 'three';
import { ATM, SUN_DIR, bakeEnvironment } from './atmos.js';
import { buildLibrary } from './library.js';
import { buildGround, PAPER } from './ground.js';
import { buildDiorama } from '../diorama/scenes.js';
import { createOrbit } from './controls.js';
import { createLabels } from './labels.js';
import { ZONE_ORDER } from '../i18n.js';

// 图书馆全貌 / Library overview: the building of the book standing alone on
// an unexplored map. The closer the camera comes to a part of it, the more
// that part is cut open, down to a low section, and the book's own miniature
// for that zone (src/diorama, at 1:1) stands inside as the corner of its
// whole room (library.furnish), built the first time the camera comes near.
// See ARCH_PLAN.md for the building. Loaded on demand (dynamic import from main.js), so
// the book's first load never pays for it. Metres throughout. The book's
// post pipeline renders it; main.js swaps the AO radius and bloom for this
// scale.

export const POST = { aoRadius: 0.8, aoPower: 1.2, bloom: 0.2, threshold: 1.3, exposure: 1.0, vignette: 0.2 };

// a zone starts to open when the camera is CUT_FAR metres from its room and
// is fully sectioned at CUT_NEAR; its room is built from BUILD metres away
const CUT_FAR = 96;
const CUT_NEAR = 58;
const BUILD = 125;

export function createOverview({ renderer, tier, canvas, labelRoot, onRead }) {
  const hi = tier.name === 'high';
  // a high afternoon sun, so light falls into the opened rooms
  SUN_DIR.set(-0.5, 0.78, 0.38).normalize();
  ATM.uFogSun.value.copy(PAPER);
  ATM.uFogAway.value.copy(PAPER);
  ATM.uFogDensity.value = 0.0022;
  ATM.uFogHeight.value = 70;
  renderer.localClippingEnabled = true; // only the shells carry clipping planes

  const scene = new Scene();
  scene.name = 'overview';
  scene.background = PAPER;
  scene.environment = bakeEnvironment(renderer);
  scene.environmentIntensity = 0.45;
  const camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.2, 2400);

  // ---- light: the sun is a spot 400 m away (near-parallel rays, and the
  // book already ships SpotLight, so the shared three chunk does not grow);
  // its shadow frustum follows the orbit target, tighter when zoomed in and
  // texel-snapped so it never shimmers
  const SUN_D = 400;
  const SUN_ANGLE = 0.5;
  const sun = new SpotLight(0xfff0dc, 3.1, 0, SUN_ANGLE, 0.2, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(tier.shadow, tier.shadow);
  sun.shadow.autoUpdate = false;
  sun.shadow.needsUpdate = true;
  const shadowEvery = hi ? 2 : 4;
  let shadowAge = 0;
  const lastFocus = new Vector3(1e9, 0, 0);
  let lastExt = 0;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = tier.shadowRadius;
  sun.shadow.camera.near = SUN_D - 60;
  sun.shadow.camera.far = SUN_D + 60;
  scene.add(sun, sun.target);
  const hemi = new HemisphereLight(0xe4e6ea, 0x9a8a74, 1.0);
  scene.add(hemi);

  const ground = buildGround({ reveal: 50 });
  scene.add(ground.mesh);
  const library = buildLibrary({ tier });
  scene.add(library.group);

  // ---- the rooms inside: the book's dioramas, built on approach
  const rooms = {};
  const reveal = {};
  for (const id of Object.keys(library.zones)) reveal[id] = 0;
  // the book's miniature at the corner of its room, and the rest of the room
  function buildRoom(id) {
    const r = library.rooms[id];
    const d = buildDiorama(ZONE_ORDER.indexOf(id), { tier });
    d.group.position.set(r.x, r.y, r.z);
    d.group.rotation.y = r.ry;
    const ext = library.furnish(id, { tier });
    const g = new Group();
    g.name = `room-${id}`;
    g.add(d.group, ext.group);
    scene.add(g);
    rooms[id] = {
      group: g,
      tick(t) {
        d.tick(t);
        ext.tick(t);
      }
    };
    sun.shadow.needsUpdate = true;
  }

  // ---- controls and labels
  let active = false;
  const labels = createLabels({
    root: labelRoot,
    anchors: library.anchors,
    onPick(id) {
      if (labels.open === id) labels.setOpen(null);
      else focusZone(id);
    },
    onRead
  });
  const orbit = createOrbit({
    dom: canvas,
    camera,
    isActive: () => active,
    onTap: () => labels.open && labels.setOpen(null)
  });

  // a whole-room framing, pulled back on narrow (portrait) screens so the
  // room's width still fits
  function fit(f) {
    const k = MathUtils.clamp(0.65 / (Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.aspect), 1, 1.8);
    return { ...f, radius: f.radius * k };
  }
  // fly in close to a zone's room and open its card; null closes the card
  // and flies home
  function focusZone(id) {
    labels.setOpen(id || null);
    if (!id) {
      orbit.setGoal(orbit.home, 1.9);
      return;
    }
    orbit.setGoal(fit(library.focus[id]), 1.9);
  }

  // ?view=overview&zoom=far|mid|close[&zone=1..5] (screenshots, deep links)
  function preset() {
    const q = new URLSearchParams(location.search);
    const z = q.get('zoom');
    if (z === 'far') return orbit.home;
    if (z === 'mid') return fit({ theta: -0.5, phi: 0.9, radius: 54, target: new Vector3(-1.5, 2, -2.5) });
    if (z === 'close') {
      const n = MathUtils.clamp(Math.round(Number(q.get('zone')) || 1), 1, ZONE_ORDER.length);
      return fit(library.focus[ZONE_ORDER[n - 1]]);
    }
    return null;
  }

  const lightSpace = new Matrix4();
  const lightInv = new Matrix4();
  const tmp = new Vector3();
  const origin = new Vector3();
  const up = new Vector3(0, 1, 0);
  function placeSun() {
    const ext = Math.min(48, Math.max(9, orbit.cur.radius * 0.7));
    sun.shadow.focus = Math.atan(ext / SUN_D) / SUN_ANGLE;
    // snap the focus to whole shadow texels in light space
    const texel = (2 * ext) / sun.shadow.mapSize.x;
    lightSpace.lookAt(SUN_DIR, origin, up);
    lightInv.copy(lightSpace).invert();
    tmp.copy(orbit.cur.target).setY(0).applyMatrix4(lightInv);
    tmp.x = Math.round(tmp.x / texel) * texel;
    tmp.y = Math.round(tmp.y / texel) * texel;
    tmp.applyMatrix4(lightSpace);
    if (tmp.distanceToSquared(lastFocus) > 1e-6 || Math.abs(ext - lastExt) > ext * 0.02 || ++shadowAge >= shadowEvery) {
      sun.shadow.needsUpdate = true;
      shadowAge = 0;
      lastFocus.copy(tmp);
      lastExt = ext;
    }
    sun.target.position.copy(tmp);
    sun.position.copy(SUN_DIR).multiplyScalar(SUN_D).add(tmp);
    sun.target.updateMatrixWorld();
  }

  // level of detail: the nearer a zone, the deeper its section: its slab
  // and roof go, the walls between it and the camera drop to a sill and the
  // far ones stop at the soffit (as the book's plates are cut). The spine is
  // cut at L1 + 1.1 m and the canopy lifts off. Rooms are built nearest first.
  let snapCut = false; // a deep link: cut and build at once, no easing
  function cutAway(dt, clock) {
    let want = null;
    let wantD = Infinity;
    const ease = 1 - Math.exp(-dt * 5);
    const turn = 1 - Math.exp(-dt * 3);
    const cam = camera.position;
    for (const [id, z] of Object.entries(library.zones)) {
      const d = cam.distanceTo(z.center);
      const goal = 1 - MathUtils.smoothstep(d, CUT_NEAR, CUT_FAR);
      reveal[id] += (goal - reveal[id]) * ease;
      if (snapCut || Math.abs(goal - reveal[id]) < 1e-3) reveal[id] = goal;
      const k = reveal[id];
      const e = k * k * (3 - 2 * k);
      let shown = false;
      for (const c of z.cuts) {
        let to = c.to;
        if (c.side) {
          const near = c.side[0] * (cam.x - z.center.x) + c.side[1] * (cam.z - z.center.z) > 0;
          const aim = near ? c.lo : c.hi;
          c.cur = snapCut ? aim : c.cur + (aim - c.cur) * turn;
          to = c.cur;
        }
        c.plane.constant = MathUtils.lerp(z.top + 1, to, e);
        shown = shown || c.plane.constant > 0.05;
      }
      z.group.visible = shown;
      if (!library.rooms[id]) continue;
      library.anchors[id].lerpVectors(library.shellAnchors[id], library.roomAnchors[id], e);
      if (snapCut && !rooms[id] && d < BUILD) buildRoom(id);
      const room = rooms[id];
      if (room) room.tick(clock);
      else if (d < BUILD && d < wantD) {
        want = id;
        wantD = d;
      }
    }
    // one room per frame, the nearest first
    if (want && !rooms[want]) buildRoom(want);
    snapCut = false;
  }

  let clock = 0;
  let w = window.innerWidth;
  let h = window.innerHeight;
  return {
    scene,
    camera,
    orbit,
    labels,
    library,
    // the page has been dived into: start high over the plan and settle in
    enter({ instant = false } = {}) {
      active = true;
      const p = preset();
      const g = p || orbit.home;
      if (instant || p) {
        orbit.snap(g);
        orbit.setGoal(g, 7);
        snapCut = true;
      } else {
        orbit.snap({ theta: g.theta - 0.55, phi: 0.2, radius: 240, target: g.target });
        orbit.setGoal(g, 1.25);
      }
      labelRoot.hidden = false;
    },
    leave() {
      active = false;
      labels.setOpen(null);
      orbit.setGoal({ phi: 0.2, radius: Math.min(260, Math.max(120, orbit.cur.radius * 2.2)) }, 2.2);
    },
    hideLabels() {
      labelRoot.hidden = true;
    },
    get active() {
      return active;
    },
    focusZone,
    // the zone whose card is open (a ZONE_ORDER id), or null
    get zone() {
      return labels.open;
    },
    key(k) {
      return orbit.key(k);
    },
    resize(width, height) {
      w = width;
      h = height;
      camera.aspect = width / height;
      // portrait screens: a wider lens so the building and its labels fit
      camera.fov = width / height < 0.8 ? 52 : 40;
      camera.updateProjectionMatrix();
    },
    update(dt, now) {
      clock += dt;
      ATM.uTime.value = clock;
      orbit.update(dt, now);
      camera.updateMatrixWorld();
      cutAway(dt, clock);
      library.tick(clock);
      placeSun();
      if (!labelRoot.hidden) labels.update(camera, w, h);
    }
  };
}
