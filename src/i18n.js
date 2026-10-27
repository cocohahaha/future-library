// Every user-facing string lives here, Chinese and English side by side so the
// two languages stay in sync. Chinese (zh-CN) is the default; the choice is
// remembered in localStorage and can be forced with ?lang=en / ?lang=zh.

export const LANGS = ['zh', 'en'];
const STORAGE_KEY = 'loq-lang';

// ---------------------------------------------------------------- interface copy
export const UI = {
  docTitle: { zh: '开放问题图书馆', en: 'The Library of Open Questions' },
  metaDescription: {
    zh: '开放问题图书馆：一座 AI 时代之后的公共图书馆，以交互式程序化 3D 场景呈现。',
    en: 'The Library of Open Questions: an interactive, procedural 3D vision of a public library after AI.'
  },
  eyebrow: { zh: 'AI 之后的公共图书馆', en: 'A public library, after AI' },
  // trusted static markup (rendered with innerHTML)
  titleHtml: { zh: '<em>开放问题</em>图书馆', en: 'The Library of <em>Open Questions</em>' },
  hintTouch: { zh: '单指拖动环视 · 双指缩放 · 轻点一处区域', en: 'Drag to orbit · pinch to zoom · tap a zone' },
  hintMouse: { zh: '拖动环视 · 滚轮缩放 · 点击一处区域', en: 'Drag to orbit · scroll to zoom · click a zone' },
  before: { zh: 'AI 之前', en: 'Before AI' },
  now: { zh: '如今', en: 'Now' },
  overview: { zh: '回到全景', en: 'Overview' },
  close: { zh: '关闭', en: 'Close panel' },
  zonebar: { zh: '图书馆分区', en: 'Library zones' },
  canvas: { zh: '可交互的 3D 图书馆庭院', en: 'Interactive 3D library courtyard' },
  langToggle: { zh: '切换语言', en: 'Switch language' },
  loader: { zh: '研墨中……', en: 'Grinding the ink…' },
  noWebGL: { zh: '此设备不支持 WebGL。', en: 'WebGL is not available on this device.' }
};

// ---------------------------------------------------------------- zone copy
export const ZONE_COPY = {
  well: {
    zh: {
      short: '问题井',
      name: '问题之井',
      kicker: '中庭 · 中心',
      body: '来访者把尚未成形的问题投入井中，打磨过的问题化作纸笺，缓缓升向井上那一笔未合拢的圆相。答案如今唾手可得，图书馆于是把力气花在更好的问题上。',
      before: '检索台与目录卡：带着关键词进来，借走几本书离开。',
      after: '问题工作室：馆员帮你想清楚，你真正想问的是什么。',
      action: '泛起涟漪'
    },
    en: {
      short: 'Well',
      name: 'The Question Well',
      kicker: 'Centre · Courtyard',
      body: 'Visitors drop half-formed questions into the well. Refined versions rise as paper slips toward the unclosed brush circle above. Answers are cheap now, so the library spends its effort on better questions.',
      before: 'A search desk and a catalogue: you arrived with a query and left with items.',
      after: 'A question studio: librarians help you sharpen what you are actually asking.',
      action: 'Ripple the well'
    }
  },
  provenance: {
    zh: {
      short: '溯源',
      name: '溯源书库',
      kicker: '第二区 · 源流',
      body: '每一本书、每一篇论文、每一份 AI 生成的摘要，都用红线系回它的出处，无论来源是人还是机器。来访者既读文字，也读红线。',
      before: '书架按学科排列，出处藏在没人翻看的脚注里。',
      after: '书架按源流排列，每一条论断都看得见它从何而来。',
      action: '循线溯源'
    },
    en: {
      short: 'Stacks',
      name: 'Provenance Stacks',
      kicker: 'Zone 2 · Lineage',
      body: 'Every book, paper and generated summary is tied by red thread back to its sources, human or machine. Visitors read the threads as well as the text.',
      before: 'Shelves sorted by subject; sources hidden in footnotes nobody followed.',
      after: 'Shelves sorted by lineage; every claim visibly tethered to where it came from.',
      action: 'Follow the threads'
    }
  },
  dialogue: {
    zh: {
      short: '对话',
      name: '对话龛',
      kicker: '第三区 · 研讨',
      body: '纸屏围成的小圆龛里，几个人与几位“刻意意见不合”的 AI 导师同坐。这里没有唯一的神谕：人们看着观点相撞，再选择自己的立场。',
      before: '供独自苦读的安静隔间，小组讨论室按小时预约。',
      after: '研讨圆龛：由人来主持机器之间的公开争论。',
      action: '开始辩论'
    },
    en: {
      short: 'Dialogue',
      name: 'Dialogue Alcoves',
      kicker: 'Zone 3 · Seminar',
      body: 'Inside small alcoves of curved paper screens, a few people sit with several AI tutors that are designed to disagree. Nobody gets one oracle; people learn by watching arguments collide and then taking a side.',
      before: 'Quiet carrels for solitary study; group rooms booked by the hour.',
      after: 'Seminar rings where humans moderate machine disagreement out loud.',
      action: 'Start the argument'
    }
  },
  quiet: {
    zh: {
      short: '静读',
      name: '无辅助阅览室',
      kicker: '第四区 · 避静',
      body: '没有屏幕，没有助手，只有纸、灯笼和长桌。不借外力的专注如今最为稀缺，图书馆有意守护它。',
      before: '安静是一条规定，靠“嘘”声维持。',
      after: '安静是一处精心设计的避难所，也是全馆最抢手的房间。',
      action: '让全馆静下来'
    },
    en: {
      short: 'Unassisted',
      name: 'The Unassisted Room',
      kicker: 'Zone 4 · Refuge',
      body: 'There are no screens or assistants here, only paper, lanterns and long tables. Slow, unaided attention is the scarce resource now, and the library protects it on purpose.',
      before: 'Silence was a rule enforced by shushing.',
      after: 'Silence is a designed refuge, and the most requested room in the building.',
      action: 'Hush the library'
    }
  },
  verify: {
    zh: {
      short: '核验',
      name: '公共核验台',
      kicker: '第五区 · 信任',
      body: '无论是否由 AI 生成，每一条论断都挂上核验台公开检验：逐条核对出处，盖上朱红印章。谁核验了什么，记录对所有人公开。',
      before: '信任来自书脊上出版社的标志。',
      after: '信任在公开处赢得，一次一枚印章。',
      action: '进行一次核验'
    },
    en: {
      short: 'Verify',
      name: 'Verification Commons',
      kicker: 'Zone 5 · Trust',
      body: 'Claims, generated or not, are hung on the bench and tested in public. Each source is checked and the result is sealed in cinnabar. The record of who checked what stays open to everyone.',
      before: 'Trust was implied by the publisher’s logo on the spine.',
      after: 'Trust is earned in the open, one seal at a time.',
      action: 'Run a verification'
    }
  }
};

// Text painted onto the claim scroll in the Verification Commons.
export const SCROLL_COPY = {
  zh: {
    number: '论断 第 2041-117 号',
    claim: ['“行道树可使夏日', '人行道降温', '最多 5 °C。”'],
    sources: ['2031 年实地测量', '卫星热成像数据', 'AI 模型摘要', '同行独立复现'],
    pending: '待核验',
    seal: ['核验', '无误']
  },
  en: {
    number: 'CLAIM No. 2041-117',
    claim: ['“Street trees cool', 'summer pavements by', 'up to 5 °C.”'],
    sources: ['Field survey, 2031', 'Satellite thermal set', 'Model summary (AI)', 'Peer replication'],
    pending: 'UNVERIFIED',
    seal: ['VERI', 'FIED']
  }
};

// ---------------------------------------------------------------- state
function initialLang() {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q && LANGS.includes(q.slice(0, 2))) return q.slice(0, 2);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(stored)) return stored;
  } catch (_) {
    /* storage may be blocked (private mode) */
  }
  return 'zh';
}

let lang = initialLang();
const listeners = new Set();

export const getLang = () => lang;
export const t = (key) => (UI[key] ? UI[key][lang] : key);
export const zoneText = (id) => ZONE_COPY[id][lang];
export const scrollText = () => SCROLL_COPY[lang];

export function setLang(next) {
  if (!LANGS.includes(next) || next === lang) return;
  lang = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch (_) {
    /* ignore */
  }
  applyStatic();
  for (const fn of listeners) fn(lang);
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Static DOM: [data-i18n] → textContent, [data-i18n-html] → innerHTML,
// [data-i18n-aria] → aria-label.
export function applyStatic(root = document) {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = t('docTitle');
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', t('metaDescription'));
  root.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  root.querySelectorAll('[data-i18n-html]').forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  root.querySelectorAll('[data-lang]').forEach((el) => {
    const on = el.dataset.lang === lang;
    el.classList.toggle('is-active', on);
    el.setAttribute('aria-pressed', String(on));
  });
}

// dev-time guard: both languages must define the same keys
if (import.meta.env && import.meta.env.DEV) {
  for (const [id, copy] of Object.entries(ZONE_COPY)) {
    const a = Object.keys(copy.zh).sort().join();
    const b = Object.keys(copy.en).sort().join();
    if (a !== b) console.warn(`[i18n] zone "${id}" keys differ between zh and en`);
  }
  for (const [k, v] of Object.entries(UI)) if (!v.zh || !v.en) console.warn(`[i18n] UI key "${k}" missing a language`);
}
