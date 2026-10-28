import { Vector3 } from 'three';
import { t, zoneText, getLang, onLangChange, ZONE_ORDER } from '../i18n.js';
import { ZONE_COLORS } from '../core/config.js';

// Floating labels for the five zones: a numbered chip on a hairline stem,
// pinned to a point on the building and re-projected every frame. Tapping a
// chip flies the camera to that part and opens a small card with the zone's
// open question and a link back to its spread in the book.

export function createLabels({ root, anchors, onPick, onRead }) {
  const pins = ZONE_ORDER.map((id, i) => {
    const pin = document.createElement('div');
    pin.className = 'ov-pin';
    pin.style.setProperty('--zc', ZONE_COLORS[id]);
    pin.innerHTML = `
      <button class="ov-label" type="button"><span class="ov-num">${i + 1}</span><span class="ov-text"><span class="ov-name"></span><span class="ov-kick"></span></span></button>
      <div class="ov-card"><p class="ov-q"></p><button class="ov-read" type="button"></button></div>`;
    root.appendChild(pin);
    const label = pin.querySelector('.ov-label');
    label.addEventListener('click', (e) => {
      e.stopPropagation();
      onPick(id);
    });
    pin.querySelector('.ov-read').addEventListener('click', (e) => {
      e.stopPropagation();
      onRead(id);
    });
    return { id, pin, label, anchor: anchors[id], v: new Vector3(), shown: true, half: 0, dx: 0 };
  });
  let open = null;

  function render() {
    const zh = getLang() === 'zh';
    for (const p of pins) {
      const z = zoneText(p.id);
      p.pin.querySelector('.ov-name').textContent = z.name;
      p.pin.querySelector('.ov-kick').textContent = zh ? z.kicker : z.kicker.toUpperCase();
      p.pin.querySelector('.ov-q').textContent = z.question;
      p.pin.querySelector('.ov-read').textContent = `${t('ovReadPage')} →`;
      p.label.setAttribute('aria-label', `${z.name}，${z.kicker}`);
      p.label.setAttribute('aria-expanded', String(open === p.id));
      p.half = 0; // re-measure after the text changed
    }
  }
  onLangChange(render);
  render();

  return {
    setOpen(id) {
      open = id;
      for (const p of pins) p.half = 0;
      for (const p of pins) p.pin.classList.toggle('is-open', p.id === id);
      render();
    },
    get open() {
      return open;
    },
    update(camera, w, h) {
      for (const p of pins) {
        p.v.copy(p.anchor).project(camera);
        const vis = p.v.z < 1 && Math.abs(p.v.x) < 1.15 && Math.abs(p.v.y) < 1.15;
        if (vis !== p.shown) {
          p.pin.style.visibility = vis ? '' : 'hidden';
          p.shown = vis;
        }
        if (!vis) continue;
        const x = (p.v.x * 0.5 + 0.5) * w;
        const y = (-p.v.y * 0.5 + 0.5) * h;
        // keep the chip (and its card) on screen; the stem stays on the anchor
        if (!p.half) p.half = Math.max(p.label.offsetWidth, open === p.id ? Math.min(290, w * 0.72) : 0) / 2 + 8;
        const dx = Math.round(Math.min(w - p.half, Math.max(p.half, x)) - x);
        if (dx !== p.dx) {
          p.pin.style.setProperty('--dx', `${dx}px`);
          p.dx = dx;
        }
        // nearer pins sit on top
        p.pin.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        p.pin.style.zIndex = String(1000 - Math.round(p.v.z * 1000) + (p.id === open ? 1000 : 0));
      }
    }
  };
}
