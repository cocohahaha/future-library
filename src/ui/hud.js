import * as THREE from 'three';
import { zoneText, setLang, onLangChange, applyStatic } from '../i18n.js';

// HTML layer: zone bar (big tap targets), floating 3D-anchored labels, the
// info panel and the 中文 / EN toggle. Everything is plain DOM so it stays
// crisp, accessible and translatable.
export function createHUD({ zones, onSelect, onActivate, onOverview }) {
  const $ = (id) => document.getElementById(id);
  const bar = $('zonebar');
  const labelsRoot = $('labels');
  const panel = $('panel');
  let shownZone = null;

  const entries = zones.map((zone, i) => {
    const d = zone.def;

    const btn = document.createElement('button');
    btn.className = 'zone-btn';
    btn.style.setProperty('--zc', d.color);
    btn.innerHTML = `<span class="zone-num">${i + 1}</span><span class="zone-name"></span>`;
    btn.addEventListener('click', () => onSelect(d.id));
    bar.appendChild(btn);

    const label = document.createElement('button');
    label.className = 'label';
    label.tabIndex = -1;
    label.style.setProperty('--zc', d.color);
    label.innerHTML = `<span class="label-dot"></span><span class="label-text"></span>`;
    label.addEventListener('click', () => onSelect(d.id));
    labelsRoot.appendChild(label);

    return { zone, btn, label, anchor: new THREE.Vector3(), ndc: new THREE.Vector3() };
  });

  function renderText() {
    for (const e of entries) {
      const copy = zoneText(e.zone.def.id);
      e.btn.querySelector('.zone-name').textContent = copy.short;
      e.btn.setAttribute('aria-label', copy.name);
      e.label.querySelector('.label-text').textContent = copy.name;
    }
    if (shownZone) fillPanel(shownZone);
  }

  function fillPanel(zone) {
    const copy = zoneText(zone.def.id);
    panel.style.setProperty('--zc', zone.def.color);
    $('panel-kicker').textContent = copy.kicker;
    $('panel-title').textContent = copy.name;
    $('panel-body').textContent = copy.body;
    $('panel-before').textContent = copy.before;
    $('panel-after').textContent = copy.after;
    $('panel-activate').textContent = copy.action;
  }

  $('panel-close').addEventListener('click', () => onOverview());
  $('panel-overview').addEventListener('click', () => onOverview());
  $('panel-activate').addEventListener('click', () => onActivate());
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  applyStatic();
  renderText();
  onLangChange(renderText);

  const toCam = new THREE.Vector3();
  const camDir = new THREE.Vector3();

  return {
    show(zone) {
      shownZone = zone;
      fillPanel(zone);
      panel.hidden = false;
      // restart the entrance animation
      panel.classList.remove('is-in');
      void panel.offsetWidth;
      panel.classList.add('is-in');
      document.body.classList.add('has-panel');
    },
    hide() {
      shownZone = null;
      panel.hidden = true;
      panel.classList.remove('is-in');
      document.body.classList.remove('has-panel');
    },
    setActive(id) {
      for (const e of entries) {
        const on = e.zone.def.id === id;
        e.btn.classList.toggle('is-active', on);
        e.btn.setAttribute('aria-pressed', String(on));
        e.label.classList.toggle('is-active', on);
      }
    },
    updateLabels(camera, width, height) {
      camera.getWorldDirection(camDir);
      for (const e of entries) {
        e.zone.anchor(e.anchor);
        toCam.copy(e.anchor).sub(camera.position);
        const dist = toCam.length();
        const behind = toCam.dot(camDir) <= 0;
        e.ndc.copy(e.anchor).project(camera);
        const off = behind || Math.abs(e.ndc.x) > 1.1 || Math.abs(e.ndc.y) > 1.1;
        if (off) {
          e.label.style.opacity = '0';
          e.label.style.pointerEvents = 'none';
          continue;
        }
        const x = (e.ndc.x * 0.5 + 0.5) * width;
        const y = (-e.ndc.y * 0.5 + 0.5) * height;
        const near = THREE.MathUtils.clamp(1.25 - dist / 55, 0.6, 1);
        e.label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%) scale(${near.toFixed(3)})`;
        e.label.style.opacity = String(THREE.MathUtils.clamp(1.5 - dist / 45, 0.45, 1));
        e.label.style.pointerEvents = 'auto';
      }
    }
  };
}
