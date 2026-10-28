import { Group, Vector3 } from 'three';
import { buildDiorama } from './scenes.js';
import { PLATE, zoneOfSpread } from '../book/pages.js';
import { H } from '../book/curve.js';

// The miniature standing on the right-hand page. Each zone's model is built
// (in metres) the first time its spread comes near, scaled to the plate at
// 1:40 and parked on the paper. When a spread settles its model lifts off
// the print: every top-level part stands up in turn, back to front, with a
// little overshoot (the staggered pop of home-sweet-home's startMorph); it
// folds flat again, all at once, before a leaf turns over it.

export const MM_PER_M = 25;
const PX = (PLATE.x0 + PLATE.x1) / 2;
const PY = (PLATE.y0 + PLATE.y1) / 2;
const STAND = 0.75; // seconds for one part to stand up
const SPREAD = 0.9; // seconds between the first and the last part starting
const easeOutBack = (x) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);

export function createPlates({ book, stage, tier }) {
  const root = new Group();
  root.name = 'plates';
  book.group.add(root);
  const built = new Map();
  let zone = -1; // the zone whose model is (or is becoming) visible
  let T = 0; // seconds into the lift
  let rising = false;
  const tmp = new Vector3();

  function get(zi) {
    let d = built.get(zi);
    if (d) return d;
    d = buildDiorama(zi, { tier });
    const g = d.group;
    g.scale.setScalar(MM_PER_M);
    g.visible = false;
    // stagger: parts at the back stand first, a little jitter in between
    const zs = g.children.map((c) => c.position.z);
    const z0 = Math.min(...zs);
    const z1 = Math.max(...zs);
    d.parts = g.children.map((c, i) => ({
      obj: c,
      sy: c.scale.y,
      delay: (SPREAD * (c.position.z - z0)) / Math.max(1e-3, z1 - z0) * 0.8 + ((i * 0.618) % 1) * SPREAD * 0.2
    }));
    root.add(g);
    built.set(zi, d);
    return d;
  }

  function pose(d) {
    for (const p of d.parts) {
      const k = Math.min(1, Math.max(0, (T - p.delay) / STAND));
      p.obj.scale.y = p.sy * Math.max(0.002, k <= 0 ? 0 : easeOutBack(k));
      p.obj.visible = k > 0;
    }
  }

  function place(d) {
    const [x, y] = book.right.topAt(PX);
    d.group.position.set(x, y, -H / 2 + PY);
  }

  return {
    root,
    get,
    // a spread settled: lift its model (instantly for deep links)
    show(spread, { instant = false } = {}) {
      const zi = zoneOfSpread(spread);
      if (zi !== zone && zone >= 0) built.get(zone).group.visible = false;
      zone = zi;
      if (zi < 0) return;
      const d = get(zi);
      place(d);
      d.group.visible = true;
      rising = true;
      T = instant ? SPREAD + STAND + 0.5 : 0;
      pose(d);
      // build the neighbours while the reader looks at this one
      setTimeout(() => {
        for (const n of [zi + 1, zi - 1]) if (n >= 0 && n < 5) get(n);
      }, 400);
    },
    // a turn started: fold the model back into the page
    hide() {
      rising = false;
    },
    update(dt, clock) {
      if (zone < 0) {
        stage.setSpills();
        return;
      }
      const d = built.get(zone);
      const was = T;
      T = rising ? Math.min(SPREAD + STAND + 0.5, T + dt) : Math.max(0, T - dt * 3.5);
      if (T !== was) {
        place(d);
        pose(d);
      }
      d.group.visible = T > 0;
      if (!d.group.visible) {
        stage.setSpills();
        return;
      }
      d.tick && d.tick(clock);
      // the model's lamps light the page and the desk
      const lit = Math.min(1, T / (SPREAD + STAND));
      d.group.updateWorldMatrix(true, false);
      stage.setSpills(
        (d.lamps || []).slice(0, 3).map((l) => ({
          pos: tmp.copy(l.pos).applyMatrix4(d.group.matrixWorld).clone(),
          color: l.color,
          intensity: 900 * (l.intensity ?? 1) * lit
        }))
      );
    },
    get zone() {
      return zone;
    },
    get lifted() {
      return T;
    }
  };
}
