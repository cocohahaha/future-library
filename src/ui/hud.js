import { t, getLang, setLang, zoneText, ZONE_ORDER, onLangChange } from '../i18n.js';
import { zoneOfSpread } from '../book/pages.js';
import { ZONE_COLORS } from '../core/config.js';

// The DOM layer: a small running title (top left, hidden while the cover is
// shut since the cover already carries it), the 中文 / EN switch (top right),
// a bottom capsule with ‹ where › and look-closer, and an aria-live mirror.
// The capsule also opens the library overview; while it is showing, a second
// capsule holds the way back to the book and a numbered shortcut to each zone.

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

export function createHud({ go, toggleZoom, openOverview, closeOverview, focusZone }) {
  const $ = (id) => document.getElementById(id);
  const where = $('where');
  const live = $('a11y');
  const zoomBtn = $('zoom');
  let spread = 0;
  let zoomed = false;

  $('prev').addEventListener('click', () => go(-1, true));
  $('next').addEventListener('click', () => go(+1, true));
  where.addEventListener('click', () => go(1)); // open the book / back to the contents
  zoomBtn.addEventListener('click', () => toggleZoom());
  $('lang').addEventListener('click', () => setLang(getLang() === 'zh' ? 'en' : 'zh'));
  $('overview').addEventListener('click', () => openOverview());
  $('back').addEventListener('click', () => closeOverview());
  const hint = $('ov-hint');
  let view = 'book';
  let hintTimer = 0;
  let ovZone = null;

  // overview zone shortcuts: number + name (names drop out on narrow screens)
  const zoneBtns = ZONE_ORDER.map((id, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cap-zone';
    b.style.setProperty('--zc', ZONE_COLORS[id]);
    b.innerHTML = `<span class="cap-zone-num" aria-hidden="true">${i + 1}</span><span class="cap-zone-name"></span>`;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => focusZone(id));
    $('ov-zones').appendChild(b);
    return b;
  });

  function label(s) {
    if (s === 0) return t('openBook');
    if (s === 1) return t('titleContents');
    if (s === 7) return t('afterword');
    const zi = zoneOfSpread(s);
    return `${ROMAN[zi]}${getLang() === 'zh' ? '　' : ' · '}${zoneText(ZONE_ORDER[zi]).name}`;
  }

  function render() {
    where.textContent = label(spread);
    where.classList.toggle('is-cta', spread === 0);
    document.body.classList.toggle('is-closed', spread === 0);
    $('prev').disabled = spread === 0;
    $('next').disabled = spread === 7;
    zoomBtn.hidden = zoneOfSpread(spread) < 0;
    zoomBtn.textContent = zoomed ? t('farther') : t('closer');
    $('lang').textContent = getLang() === 'zh' ? 'EN' : '中文';
    hint.textContent = matchMedia('(pointer: coarse)').matches ? t('ovHintTouch') : t('ovHintMouse');
    zoneBtns.forEach((b, i) => {
      const z = zoneText(ZONE_ORDER[i]);
      b.querySelector('.cap-zone-name').textContent = z.name;
      b.setAttribute('aria-label', `${i + 1} · ${z.name}`);
      b.title = z.name;
    });
  }

  onLangChange(render);
  render();
  return {
    setSpread(s) {
      spread = s;
      render();
      const zi = zoneOfSpread(s);
      live.textContent = zi >= 0 ? `${label(s)}。${zoneText(ZONE_ORDER[zi]).caption || ''}` : label(s);
    },
    setZoom(z) {
      zoomed = z;
      render();
    },
    // the zone whose card is open in the overview (null: none)
    setOvZone(id) {
      if (id === ovZone) return;
      ovZone = id;
      zoneBtns.forEach((b, i) => {
        const on = ZONE_ORDER[i] === id;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
    },
    // 'book' | 'overview'
    setView(v) {
      if (v === view) return;
      view = v;
      const ov = v === 'overview';
      document.body.classList.toggle('is-overview', ov);
      $('ov-bar').hidden = !ov;
      const canvas = $('scene');
      canvas.dataset.i18nAria = ov ? 'ovCanvas' : 'canvas';
      canvas.setAttribute('aria-label', t(canvas.dataset.i18nAria));
      clearTimeout(hintTimer);
      hint.classList.toggle('is-on', ov);
      if (ov) hintTimer = setTimeout(() => hint.classList.remove('is-on'), 6500);
      live.textContent = ov ? `${t('overview')}。${t('ovCanvas')}` : label(spread);
      (ov ? $('back') : $('overview')).focus({ preventScroll: true });
    }
  };
}
