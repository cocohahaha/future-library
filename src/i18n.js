// Every user-facing string lives here, Chinese and English side by side so the
// two languages stay in sync. Chinese (zh-CN) is the default; the choice is
// remembered in localStorage ('loq-lang') and can be forced with ?lang=en / ?lang=zh.
// The book's pages are typeset from these strings and re-set on a switch.

export const LANGS = ['zh', 'en'];
const STORAGE_KEY = 'loq-lang';

// ---------------------------------------------------------------- interface copy
export const UI = {
  docTitle: { zh: '开放问题图书馆', en: 'The Library of Open Questions' },
  metaDescription: {
    zh: '开放问题图书馆：一本摊在书桌上的书。翻开每一页，一座 AI 之后的公共图书馆便从纸上立起。',
    en: 'The Library of Open Questions: a book open on a desk. Turn a page and a public library after AI stands up from the paper.'
  },
  eyebrow: { zh: 'AI 之后的公共图书馆', en: 'A public library, after AI' },
  brand: { zh: '开放问题图书馆', en: 'The Library of Open Questions' },
  canvas: { zh: '一本摊开在书桌上的立体书', en: 'A pop-up book lying open on a desk' },
  langToggle: { zh: '切换语言', en: 'Switch language' },
  contents: { zh: '目录', en: 'Contents' },
  prev: { zh: '上一页', en: 'Previous page' },
  next: { zh: '下一页', en: 'Next page' },
  closer: { zh: '近看', en: 'Look closer' },
  farther: { zh: '退后', en: 'Step back' },
  read: { zh: '文字', en: 'Text' },
  readAria: { zh: '显示本页文字', en: 'Show this page as text' },
  closeSheet: { zh: '收起', en: 'Hide text' },
  soundOn: { zh: '声音已开', en: 'Sound on' },
  soundOff: { zh: '声音已关', en: 'Sound off' },
  hintTouch: { zh: '左右轻扫翻页 · 轻点模型', en: 'Swipe to turn the page · tap the model' },
  hintMouse: { zh: '← → 翻页 · 点击模型 · 拖动转动视角', en: '← → to turn · click the model · drag to look around' },
  openBook: { zh: '打开这本书', en: 'Open the book' },
  loader: { zh: '装订中……', en: 'Binding the book…' },
  noWebGL: { zh: '此设备不支持 WebGL 2。', en: 'WebGL 2 is not available on this device.' },
  cover: { zh: '封面', en: 'Cover' },
  titleContents: { zh: '扉页与目录', en: 'Title & contents' },
  afterword: { zh: '后记', en: 'Afterword' },
  spreadOf: { zh: '第 {n} / {m} 页', en: 'Spread {n} of {m}' },
  before: { zh: 'AI 之前', en: 'Before AI' },
  now: { zh: '如今', en: 'Now' },
  openQuestion: { zh: '开放问题', en: 'Open question' },
  plate: { zh: '图版', en: 'Plate' },
  goTo: { zh: '翻到', en: 'Go to' }
};

// ---------------------------------------------------------------- the book
export const BOOK_COPY = {
  zh: {
    press: '开放问题出版社',
    title: ['开放问题', '图书馆'],
    titleRun: '开放问题图书馆',
    subtitle: 'AI 之后的公共图书馆',
    epigraph: '答案如今唾手可得。\n图书馆，是让答案慢下来的地方。',
    edition: '二〇四一年 · 初版',
    contents: '目 录',
    howTo: '怎样读这本书',
    howLines: ['左右轻扫、方向键或 ‹ › 按钮翻页。', '每张图版上的模型会从纸面立起；轻点它，让它动起来。', '右上角可切换中文 / EN，每一页都会随之重排。'],
    afterTitle: '后 记',
    afterBody:
      '这本书是一份提案：当答案变得廉价，公共图书馆可以成为什么。书中的五处空间都还没有建成，它们仍是开放的问题。\n\n图书馆曾经替我们保存答案。如今它要替我们保护别的东西：提问的耐心、出处的线索、彼此争论的余地、不被打扰的专注，以及在众人面前核对事实的习惯。',
    colophon: '书页以系统字体排版；模型、纸张与布面全部由代码生成（three.js）。翻页与立体图版的手法，受 Techartist 的 Every Joule 与 Fold 启发。',
    cardTitle: '借阅卡',
    cardSub: '应还日期',
    cardRule: '问题可无限续借。',
    cardStamps: ['2041 年 3 月 14 日', '2041 年 4 月 2 日', '2041 年 5 月 27 日', '2041 年 9 月 9 日'],
    cardFoot: '请把你的问题留在这里，后来的读者会接着问下去。'
  },
  en: {
    press: 'Open Questions Press',
    title: ['The Library of', 'Open Questions'],
    titleRun: 'The Library of Open Questions',
    subtitle: 'A public library, after AI',
    epigraph: 'Answers are cheap now.\nA library is where they are slowed down.',
    edition: 'First edition · 2041',
    contents: 'Contents',
    howTo: 'How to read this book',
    howLines: [
      'Turn the pages with a swipe, the arrow keys or the ‹ › buttons.',
      'Each plate stands up from the paper. Tap the model to set it moving.',
      'Switch 中文 / EN at the top right and every page is reset in that language.'
    ],
    afterTitle: 'Afterword',
    afterBody:
      'This book is a proposal for what a public library could become once answers are cheap. None of its five rooms has been built yet; they are still open questions.\n\nLibraries used to keep answers for us. Now they can protect other things: the patience to ask, the thread back to a source, room to disagree, attention nobody interrupts, and the habit of checking facts in front of each other.',
    colophon: 'Set in system typefaces. Every model, paper and cloth is generated in code with three.js. The page turns and lift-off plates are inspired by Every Joule and Fold by Techartist.',
    cardTitle: 'Reader’s card',
    cardSub: 'Date due',
    cardRule: 'Questions may be renewed indefinitely.',
    cardStamps: ['14 MAR 2041', '02 APR 2041', '27 MAY 2041', '09 SEP 2041'],
    cardFoot: 'Leave your question here. The next reader will keep asking it.'
  }
};

// ---------------------------------------------------------------- zone copy
export const ZONE_COPY = {
  well: {
    zh: {
      short: '问题井',
      name: '问题之井',
      kicker: '中庭 · 中心',
      body: '下沉的阅读圆环围着一池静水。来访者把尚未成形的问题投进水里；打磨过的问题写成纸笺，缓缓升向天窗。答案如今唾手可得，图书馆于是把力气花在更好的问题上。',
      before: '检索台与目录卡：带着关键词进来，借走几本书离开。',
      after: '问题工作室：馆员陪你想清楚，你真正想问的是什么。',
      action: '泛起涟漪',
      question: '什么样的问题，值得一问？',
      caption: '下沉阅读圆环与静水池。水磨石、白橡木、玻璃天窗。'
    },
    en: {
      short: 'Well',
      name: 'The Question Well',
      kicker: 'Centre · Atrium',
      body: 'A sunken reading ring surrounds a pool of still water. Visitors drop half-formed questions into it; refined ones rise as paper slips toward the skylight. Answers are cheap now, so the library spends its effort on better questions.',
      before: 'A search desk and a card catalogue: you came with a keyword and left with a few books.',
      after: 'A question studio: librarians help you work out what you are really asking.',
      action: 'Ripple the pool',
      question: 'What makes a question worth asking?',
      caption: 'Sunken reading ring and still pool. Terrazzo, white oak, glass skylight.'
    }
  },
  provenance: {
    zh: {
      short: '溯源',
      name: '溯源书库',
      kicker: '第二区 · 源流',
      body: '每一本书、每一篇论文、每一份 AI 生成的摘要，都用一根红线系回它的出处，无论来源是人还是机器。来访者既读文字，也读红线。',
      before: '书架按学科排列，出处藏在没人翻看的脚注里。',
      after: '书架按源流排列，每一条论断都看得见它从何而来。',
      action: '循线溯源',
      question: '这些话，究竟出自谁？',
      caption: '高书架、滑轨梯与谱系长桌。白橡木、黄铜、红线。'
    },
    en: {
      short: 'Stacks',
      name: 'Provenance Stacks',
      kicker: 'Zone 2 · Lineage',
      body: 'Every book, paper and machine-written summary is tied by a red thread back to its sources, human or machine. Visitors read the threads as well as the text.',
      before: 'Shelves sorted by subject; sources buried in footnotes nobody followed.',
      after: 'Shelves sorted by lineage; every claim visibly tethered to where it came from.',
      action: 'Follow the threads',
      question: 'Whose words are these, really?',
      caption: 'Tall stacks, rolling ladder and lineage table. White oak, brass, red thread.'
    }
  },
  dialogue: {
    zh: {
      short: '对话',
      name: '对话龛',
      kicker: '第三区 · 研讨',
      body: '毛毡围合的小圆龛里，几个人与三位“刻意意见不合”的 AI 导师同坐一桌。这里没有唯一的神谕：人们看着观点相撞，再选择自己的立场。',
      before: '供独自苦读的安静隔间，小组讨论室按小时预约。',
      after: '研讨圆龛：由人来主持机器之间的公开争论。',
      action: '开始辩论',
      question: '机器意见相左时，由谁裁断？',
      caption: '毛毡声学屏、圆桌与三位导师。羊毛毡、橡木、玻璃。'
    },
    en: {
      short: 'Dialogue',
      name: 'Dialogue Alcoves',
      kicker: 'Zone 3 · Seminar',
      body: 'In a felt-lined alcove, a few people share a table with three AI tutors built to disagree. Nobody gets one oracle: people watch arguments collide, then take a side.',
      before: 'Quiet carrels for solitary study; group rooms booked by the hour.',
      after: 'Seminar rings where people chair the machines’ disagreements out loud.',
      action: 'Start the argument',
      question: 'When the machines disagree, who decides?',
      caption: 'Acoustic felt screens, round table and three tutors. Wool felt, oak, glass.'
    }
  },
  quiet: {
    zh: {
      short: '静读',
      name: '无辅助阅览室',
      kicker: '第四区 · 避静',
      body: '没有屏幕，没有助手，只有纸、台灯和长桌。不借外力的专注如今最为稀缺，图书馆有意守护它。',
      before: '安静是一条规定，靠“嘘”声维持。',
      after: '安静是一处精心设计的避难所，也是全馆最抢手的房间。',
      action: '让全馆静下来',
      question: '专注若不用在这里，又该用在哪里？',
      caption: '北窗、长桌与台灯。橡木、亚麻、钢窗。',
      sign: '无屏幕 · 无助手'
    },
    en: {
      short: 'Unassisted',
      name: 'The Unassisted Room',
      kicker: 'Zone 4 · Refuge',
      body: 'No screens and no assistants: only paper, reading lamps and long tables. Unaided attention is the scarce resource now, and the library protects it on purpose.',
      before: 'Silence was a rule, enforced by shushing.',
      after: 'Silence is a designed refuge, and the most requested room in the building.',
      action: 'Hush the library',
      question: 'If attention is not for this, what is it for?',
      caption: 'North window, long table and reading lamps. Oak, linen, steel glazing.',
      sign: 'No screens · No assistants'
    }
  },
  verify: {
    zh: {
      short: '核验',
      name: '公共核验台',
      kicker: '第五区 · 信任',
      body: '无论是否由 AI 生成，每一条论断都摆上核验台公开检验：逐条核对出处，再当众盖章。谁核验了什么，记录对所有人公开。',
      before: '信任来自书脊上出版社的标志。',
      after: '信任在公开处赢得，一次一枚印章。',
      action: '进行一次核验',
      question: '核验到什么程度，才算足够？',
      caption: '核验长桌、证据墙与盖章机。橡木、软木、黄铜。'
    },
    en: {
      short: 'Verify',
      name: 'Verification Commons',
      kicker: 'Zone 5 · Trust',
      body: 'Claims, machine-made or not, are laid on the bench and tested in public: each source is checked, then the result is stamped in front of everyone. The record of who checked what stays open.',
      before: 'Trust was implied by the publisher’s logo on the spine.',
      after: 'Trust is earned in the open, one stamp at a time.',
      action: 'Run a verification',
      question: 'How much checking is enough?',
      caption: 'Verification bench, evidence wall and stamping press. Oak, cork, brass.'
    }
  }
};

export const ZONE_ORDER = ['well', 'provenance', 'dialogue', 'quiet', 'verify'];

// Text printed on the claim card in the Verification Commons.
export const CLAIM_COPY = {
  zh: {
    number: '论断 第 2041-117 号',
    claim: ['“行道树可使夏日', '人行道降温', '最多 5 °C。”'],
    sources: ['2031 年实地测量', '卫星热成像数据', 'AI 模型摘要', '同行独立复现'],
    pending: '待核验',
    stamp: '核验无误'
  },
  en: {
    number: 'CLAIM No. 2041-117',
    claim: ['“Street trees cool', 'summer pavements by', 'up to 5 °C.”'],
    sources: ['Field survey, 2031', 'Satellite thermal set', 'Model summary (AI)', 'Peer replication'],
    pending: 'UNVERIFIED',
    stamp: 'VERIFIED'
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
export const t = (key, vars) => {
  let s = UI[key] ? UI[key][lang] : key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  return s;
};
export const zoneText = (id) => ZONE_COPY[id][lang];
export const bookText = () => BOOK_COPY[lang];
export const claimText = () => CLAIM_COPY[lang];

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
  const a = Object.keys(BOOK_COPY.zh).sort().join();
  const b = Object.keys(BOOK_COPY.en).sort().join();
  if (a !== b) console.warn('[i18n] book copy keys differ between zh and en');
}
