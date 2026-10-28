import { Vector3, MathUtils } from 'three';

// Orbit camera for the overview: one-finger / left drag orbits, two fingers
// pinch-zoom and pan, wheel zooms, right / shift drag pans, arrow keys orbit.
// Everything eases toward a goal state; the rate is low while the camera
// sweeps in from the page (the intro) or flies to a zone, high under the
// visitor's hands. After a long idle it drifts slowly round the building.

export function createOrbit({ dom, camera, isActive, onTap }) {
  const home = { theta: 0.62, phi: 1.08, radius: 92, target: new Vector3(0, 3, 5) };
  const cur = { theta: home.theta, phi: home.phi, radius: home.radius, target: home.target.clone() };
  const goal = { theta: home.theta, phi: home.phi, radius: home.radius, target: home.target.clone() };
  const LIM = { phi0: 0.16, phi1: 1.42, r0: 5, r1: 260, pan: 40 };
  let rate = 7;
  let lastInput = -100;
  let clock = 0;
  const pts = new Map();
  let pinch = 0;
  let mid = null;
  let down = null;

  const touchInput = () => {
    lastInput = clock;
    rate = 7;
  };
  function rotate(dx, dy) {
    goal.theta -= dx * 0.0055;
    goal.phi = MathUtils.clamp(goal.phi - dy * 0.0045, LIM.phi0, LIM.phi1);
    touchInput();
  }
  function zoom(f) {
    goal.radius = MathUtils.clamp(goal.radius * f, LIM.r0, LIM.r1);
    touchInput();
  }
  const right = new Vector3();
  const fwd = new Vector3();
  function pan(dx, dy) {
    const k = (goal.radius * 2 * Math.tan(MathUtils.degToRad(camera.fov / 2))) / Math.max(1, dom.clientHeight);
    right.set(Math.cos(cur.theta), 0, -Math.sin(cur.theta));
    fwd.set(-Math.sin(cur.theta), 0, -Math.cos(cur.theta));
    goal.target.addScaledVector(right, -dx * k).addScaledVector(fwd, dy * k * 1.4);
    const l = Math.hypot(goal.target.x, goal.target.z);
    if (l > LIM.pan) {
      goal.target.x *= LIM.pan / l;
      goal.target.z *= LIM.pan / l;
    }
    touchInput();
  }

  dom.addEventListener('pointerdown', (e) => {
    if (!isActive()) return;
    try {
      dom.setPointerCapture(e.pointerId);
    } catch (_) {
      /* synthetic pointer */
    }
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY, panning: e.button === 2 || e.button === 1 || e.shiftKey });
    if (pts.size === 1) down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false };
    else {
      down = null;
      const [a, b] = [...pts.values()];
      pinch = Math.hypot(a.x - b.x, a.y - b.y);
      mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }
    touchInput();
  });
  dom.addEventListener('pointermove', (e) => {
    if (!isActive() || !pts.has(e.pointerId)) return;
    const p = pts.get(e.pointerId);
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    p.x = e.clientX;
    p.y = e.clientY;
    if (pts.size === 1) {
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) down.moved = true;
      if (p.panning) pan(dx, dy);
      else rotate(dx, dy);
    } else if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch > 0 && d > 0) zoom(pinch / d);
      pinch = d;
      const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      if (mid) pan(m.x - mid.x, m.y - mid.y);
      mid = m;
    }
  });
  const up = (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if (pts.size < 2) {
      pinch = 0;
      mid = null;
    }
    if (down && !down.moved && performance.now() - down.t < 500 && pts.size === 0 && isActive()) onTap && onTap(e);
    if (pts.size === 0) down = null;
  };
  dom.addEventListener('pointerup', up);
  dom.addEventListener('pointercancel', up);
  dom.addEventListener(
    'wheel',
    (e) => {
      if (!isActive()) return;
      e.preventDefault();
      zoom(Math.exp(e.deltaY * 0.0012));
    },
    { passive: false }
  );
  dom.addEventListener('contextmenu', (e) => {
    if (isActive()) e.preventDefault();
  });

  function setGoal(s, r = 1.8) {
    if (s.theta !== undefined) {
      // the nearest equivalent angle, so the camera never spins the long way
      let t = s.theta;
      while (t - cur.theta > Math.PI) t -= Math.PI * 2;
      while (t - cur.theta < -Math.PI) t += Math.PI * 2;
      goal.theta = t;
    }
    if (s.phi !== undefined) goal.phi = MathUtils.clamp(s.phi, LIM.phi0, LIM.phi1);
    if (s.radius !== undefined) goal.radius = MathUtils.clamp(s.radius, LIM.r0, LIM.r1);
    if (s.target) goal.target.copy(s.target);
    rate = r;
    lastInput = clock;
  }

  return {
    cur,
    goal,
    home,
    // jump: the intro starts high above the plan, as if the page had become the city
    snap(s) {
      Object.assign(cur, { theta: s.theta ?? cur.theta, phi: s.phi ?? cur.phi, radius: s.radius ?? cur.radius });
      if (s.target) cur.target.copy(s.target);
    },
    setGoal,
    // keyboard: returns true if handled
    key(k) {
      if (k === 'ArrowLeft') rotate(-40, 0);
      else if (k === 'ArrowRight') rotate(40, 0);
      else if (k === 'ArrowUp') rotate(0, -30);
      else if (k === 'ArrowDown') rotate(0, 30);
      else if (k === '+' || k === '=') zoom(0.85);
      else if (k === '-' || k === '_') zoom(1.18);
      else if (k === 'Home') setGoal(home, 2.4);
      else return false;
      return true;
    },
    update(dt, now) {
      clock = now;
      if (now - lastInput > 9) goal.theta += dt * 0.022; // idle drift
      const k = 1 - Math.exp(-dt * rate);
      cur.theta += (goal.theta - cur.theta) * k;
      cur.phi += (goal.phi - cur.phi) * k;
      cur.radius += (goal.radius - cur.radius) * k;
      cur.target.lerp(goal.target, k);
      if (rate < 7 && Math.abs(goal.phi - cur.phi) < 0.002 && Math.abs(goal.radius - cur.radius) < 0.5) rate = 7;
      const sp = Math.sin(cur.phi);
      camera.position.set(Math.sin(cur.theta) * sp, Math.cos(cur.phi), Math.cos(cur.theta) * sp).multiplyScalar(cur.radius).add(cur.target);
      camera.lookAt(cur.target);
    }
  };
}
