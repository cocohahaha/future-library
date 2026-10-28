import { Raycaster, Vector2 } from 'three';
import { W } from '../book/curve.js';

// Pointer, touch and keyboard. A tap on a printed link follows it; any other
// tap turns forward on the right half of the screen and back on the left.
// A quick horizontal flick turns too; a slower drag looks around (the rig
// springs back). Wheel / pinch zoom, arrow keys and PageUp/PageDown turn.
// Everything is ignored while the library overview owns the canvas.

export function createInput({ canvas, camera, book, pages, rig, go, toggleZoom, openOverview, isActive = () => true }) {
  const ray = new Raycaster();
  const ndc = new Vector2();
  const pts = new Map();
  let start = null;
  let pinch = 0;

  function linkAt(x, y) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const [leftId, rightId] = book.topIds;
    const hit = ray.intersectObjects([book.left.mesh, book.right.mesh], false)[0];
    if (!hit || !hit.uv || hit.face.materialIndex !== 0) return null;
    const isLeft = hit.object === book.left.mesh;
    // stack uv is (arc length from the gutter, mm from the head)
    const px = isLeft ? W - hit.uv.x : hit.uv.x;
    return pages.hitAt(isLeft ? leftId : rightId, px, hit.uv.y);
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (!isActive()) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (_) {
      /* synthetic or already-released pointer */
    }
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 1) start = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, t: performance.now(), moved: false };
    else {
      start = null;
      const [a, b] = [...pts.values()];
      pinch = Math.hypot(a.x - b.x, a.y - b.y);
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const now = performance.now() / 1000;
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch > 0) rig.zoomBy(pinch / d, now);
      pinch = d;
      return;
    }
    if (!start) return;
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) start.moved = true;
    if (start.moved) rig.drag(e.clientX - start.lx, e.clientY - start.ly, now);
    start.lx = e.clientX;
    start.ly = e.clientY;
  });
  const end = (e) => {
    pts.delete(e.pointerId);
    if (!start || pts.size) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const dt = performance.now() - start.t;
    const s = start;
    start = null;
    if (!s.moved && dt < 600) {
      const act = book.settled > 0 ? linkAt(e.clientX, e.clientY) : null;
      if (act && act.type === 'zone') return go({ zone: act.zone });
      if (act && act.type === 'goto') return go(act.spread);
      if (act && act.type === 'overview') return openOverview();
      const r = canvas.getBoundingClientRect();
      if (book.target === 0) return go(1);
      go(e.clientX - r.left > r.width / 2 ? +1 : -1, true);
    } else if (dt < 500 && Math.abs(dx) > 50 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
      rig.state.yaw *= 0.3;
      go(dx < 0 ? +1 : -1, true);
    }
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', (e) => {
    pts.delete(e.pointerId);
    start = null;
  });
  canvas.addEventListener(
    'wheel',
    (e) => {
      if (!isActive()) return;
      e.preventDefault();
      rig.zoomBy(Math.exp(e.deltaY * 0.0012), performance.now() / 1000);
    },
    { passive: false }
  );
  window.addEventListener('keydown', (e) => {
    if (!isActive()) return;
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) go(+1, true);
    else if (k === 'ArrowLeft' || k === 'PageUp' || (k === ' ' && e.shiftKey)) go(-1, true);
    else if (k === 'Home') go(0);
    else if (k === 'End') go(7);
    else if (k === 'z' || k === 'Z') toggleZoom();
    else if (k === 'Escape') toggleZoom(false);
    else return;
    e.preventDefault();
  });
}
