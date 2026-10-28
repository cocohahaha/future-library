import { t, getLang, setLang, zoneText, ZONE_ORDER, onLangChange } from '../i18n.js';
import { zoneOfSpread } from '../book/pages.js';

// The DOM layer: a small running title (top left, hidden while the cover is
// shut since the cover already carries it), the 中文 / EN switch (top right),
// a bottom capsule with ‹ where › and look-closer, and an aria-live mirror.

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

export function createHud({ go, toggleZoom }) {
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
    }
  };
}
