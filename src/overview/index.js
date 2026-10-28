import { Scene, PerspectiveCamera, SpotLight, HemisphereLight, Vector3, Matrix4 } from 'three';
import { ATM, SUN_DIR, createSky, bakeEnvironment } from './atmos.js';
import { buildLibrary } from './library.js';
import { buildCity } from './city.js';
import { buildLife } from './life.js';
import { createOrbit } from './controls.js';
import { createLabels } from './labels.js';

// 图书馆全貌 / Library overview: the building of the book standing in its
// city at golden hour. Loaded on demand (dynamic import from main.js), so the
// book's first load never pays for it. Metres throughout. The book's post
// pipeline renders it; main.js swaps the AO radius and bloom for this scale.

export const POST = { aoRadius: 2.4, aoPower: 1.25, bloom: 0.3, threshold: 1.25, exposure: 1.0, vignette: 0.24 };

export function createOverview({ renderer, tier, canvas, labelRoot, onRead }) {
  const hi = tier.name === 'high';
  const scene = new Scene();
  scene.name = 'overview';
  scene.environment = bakeEnvironment(renderer);
  scene.environmentIntensity = 0.4;
  const camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1.5, 7000);

  const sky = createSky();
  scene.add(sky);

  // ---- light: a low warm sun. It is a spot 6 km away (near-parallel rays,
  // and the book already ships SpotLight, so the shared three chunk does not
  // grow); its shadow frustum follows the orbit target, tighter when zoomed
  // in and texel-snapped so it never shimmers.
  const SUN_D = 6000;
  const SUN_ANGLE = 0.6;
  const sun = new SpotLight(0xffc48a, 6.6, 0, SUN_ANGLE, 0.25, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(tier.shadow * (hi ? 2 : 1), tier.shadow * (hi ? 2 : 1));
  sun.shadow.bias = -0.00025;
  sun.shadow.normalBias = 0.6;
  sun.shadow.radius = tier.shadowRadius;
  sun.shadow.camera.near = SUN_D - 700;
  sun.shadow.camera.far = SUN_D + 900;
  scene.add(sun, sun.target);
  const hemi = new HemisphereLight(0x9fb8dd, 0x6b5544, 0.3);
  scene.add(hemi);

  const library = buildLibrary({ tier });
  scene.add(library.group);
  const city = buildCity({ renderer, tier, library });
  scene.add(city.group);
  const life = buildLife({ tier });
  scene.add(life.group);

  // ---- controls and labels
  let active = false;
  const labels = createLabels({
    root: labelRoot,
    anchors: library.anchors,
    onPick(id) {
      if (labels.open === id) {
        labels.setOpen(null);
        return;
      }
      labels.setOpen(id);
      const f = library.focus[id];
      orbit.setGoal({ target: f.target, radius: f.radius, phi: f.phi, theta: f.theta ?? orbit.cur.theta }, 1.9);
    },
    onRead
  });
  const orbit = createOrbit({
    dom: canvas,
    camera,
    isActive: () => active,
    onTap: () => labels.open && labels.setOpen(null)
  });

  const lightSpace = new Matrix4();
  const tmp = new Vector3();
  function placeSun() {
    const ext = Math.min(420, Math.max(130, orbit.cur.radius * 0.95));
    sun.shadow.focus = Math.atan(ext / SUN_D) / SUN_ANGLE;
    // snap the focus to whole shadow texels in light space
    const texel = (2 * ext) / sun.shadow.mapSize.x;
    lightSpace.lookAt(SUN_DIR, new Vector3(0, 0, 0), new Vector3(0, 1, 0));
    tmp.copy(orbit.cur.target).setY(0).applyMatrix4(lightSpace.clone().invert());
    tmp.x = Math.round(tmp.x / texel) * texel;
    tmp.y = Math.round(tmp.y / texel) * texel;
    tmp.applyMatrix4(lightSpace);
    sun.target.position.copy(tmp);
    sun.position.copy(SUN_DIR).multiplyScalar(SUN_D).add(tmp);
    sun.target.updateMatrixWorld();
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
      const g = orbit.home;
      if (instant) orbit.snap({ ...g, target: g.target });
      else {
        orbit.snap({ theta: g.theta - 0.55, phi: 0.2, radius: 820, target: g.target });
        orbit.setGoal(g, 1.25);
      }
      labelRoot.hidden = false;
    },
    leave() {
      active = false;
      labels.setOpen(null);
      orbit.setGoal({ phi: 0.2, radius: Math.min(950, orbit.cur.radius * 2.2) }, 2.2);
    },
    hideLabels() {
      labelRoot.hidden = true;
    },
    get active() {
      return active;
    },
    key(k) {
      return orbit.key(k);
    },
    resize(width, height, dbw, dbh) {
      w = width;
      h = height;
      camera.aspect = width / height;
      // portrait screens: a wider lens so the building and its labels fit
      camera.fov = width / height < 0.8 ? 52 : 40;
      camera.updateProjectionMatrix();
      city.resize(dbw, dbh);
    },
    update(dt, now) {
      clock += dt;
      ATM.uTime.value = clock;
      orbit.update(dt, now);
      camera.updateMatrixWorld();
      sky.position.copy(camera.position);
      placeSun();
      city.update(clock, renderer, scene, camera, sky);
      if (!labelRoot.hidden) labels.update(camera, w, h);
    }
  };
}
