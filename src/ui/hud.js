import * as THREE from 'three';

// HTML layer: zone bar (big tap targets), floating 3D-anchored labels and the
// info panel. Everything is plain DOM so it stays crisp and accessible.
export function createHUD({ zones, onSelect, onActivate, onOverview }) {
  const $ = (id) => document.getElementById(id);
  const bar = $('zonebar');
  const labelsRoot = $('labels');
  const panel = $('panel');

  const entries = zones.map((zone, i) => {
    const d = zone.def;

    const btn = document.createElement('button');
    btn.className = 'zone-btn';
    btn.style.setProperty('--zc', d.color);
    btn.innerHTML = `<span class="zone-num">${i + 1}</span><span class="zone-name">${d.short}</span>`;
    btn.setAttribute('aria-label', d.name);
    btn.addEventListener('click', () => onSelect(d.id));
    bar.appendChild(btn);

    const label = document.createElement('button');
    label.className = 'label';
    label.tabIndex = -1;
    label.style.setProperty('--zc', d.color);
    label.innerHTML = `<span class="label-dot"></span><span class="label-text">${d.name}</span>`;
    label.addEventListener('click', () => onSelect(d.id));
    labelsRoot.appendChild(label);

    return { zone, btn, label, anchor: new THREE.Vector3(), ndc: new THREE.Vector3() };
  });

  $('panel-close').addEventListener('click', () => onOverview());
  $('panel-overview').addEventListener('click', () => onOverview());
  $('panel-activate').addEventListener('click', () => onActivate());

  const toCam = new THREE.Vector3();
  const camDir = new THREE.Vector3();

  return {
    show(zone) {
      const d = zone.def;
      panel.style.setProperty('--zc', d.color);
      $('panel-kicker').textContent = d.kicker;
      $('panel-title').textContent = d.name;
      $('panel-body').textContent = d.body;
      $('panel-before').textContent = d.before;
      $('panel-after').textContent = d.after;
      $('panel-activate').textContent = d.action;
      panel.hidden = false;
      // restart the entrance animation
      panel.classList.remove('is-in');
      void panel.offsetWidth;
      panel.classList.add('is-in');
      document.body.classList.add('has-panel');
    },
    hide() {
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
        const near = THREE.MathUtils.clamp(1.25 - dist / 55, 0.55, 1);
        e.label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%) scale(${near.toFixed(3)})`;
        e.label.style.opacity = String(THREE.MathUtils.clamp(1.4 - dist / 45, 0.35, 1));
        e.label.style.pointerEvents = 'auto';
      }
    }
  };
}
