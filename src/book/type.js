// Canvas typesetting in millimetres. Every function takes a 2D context that
// has already been scaled to px/mm, so sizes and positions are in mm.
//
// Fonts are system fonts only: a book serif for Latin text and the platform's
// Chinese Song/Ming face for 中文 (PingFang / YaHei / Noto for sans). The
// language decides which family comes first, so Chinese pages use the CJK
// face's own Latin glyphs for digits and punctuation.

const SERIF_LATIN = `'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', 'Noto Serif', Georgia, 'Times New Roman'`;
const SERIF_CJK = `'Songti SC', STSong, 'Noto Serif CJK SC', 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif CN', SimSun`;
const SANS_LATIN = `'Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Noto Sans', Arial`;
const SANS_CJK = `'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', 'Noto Sans SC', 'Source Han Sans SC'`;

export function family(lang, kind = 'serif') {
  if (kind === 'sans') return lang === 'zh' ? `${SANS_CJK}, ${SANS_LATIN}, sans-serif` : `${SANS_LATIN}, ${SANS_CJK}, sans-serif`;
  return lang === 'zh' ? `${SERIF_CJK}, ${SERIF_LATIN}, serif` : `${SERIF_LATIN}, ${SERIF_CJK}, serif`;
}

export function setFont(ctx, lang, size, { kind = 'serif', weight = 400, italic = false } = {}) {
  ctx.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${family(lang, kind)}`;
}

// ---------------------------------------------------------------- tokens
const CJK = /[⺀-⿿　-〿぀-ヿ㐀-䶿一-鿿豈-﫿＀-￯]/;
// may not start a line
const CLOSE = '，。、；：？！）》」』〕】〉”’…—%．,.;:?!)]}·';
// may not end a line
const OPEN = '（《「『〔【〈“‘([{';

function tokenize(text) {
  const out = [];
  let word = '';
  const flush = () => {
    if (word) out.push(word);
    word = '';
  };
  for (const ch of text) {
    if (CJK.test(ch)) {
      flush();
      out.push(ch);
    } else if (ch === ' ') {
      word += ' ';
      flush();
    } else if (ch === '\n') {
      flush();
      out.push('\n');
    } else word += ch;
  }
  flush();
  // kinsoku: glue closing marks to the previous token, opening marks to the next
  const glued = [];
  for (const t of out) {
    if (glued.length && t !== '\n' && CLOSE.includes(t[0]) && glued[glued.length - 1] !== '\n') glued[glued.length - 1] += t;
    else glued.push(t);
  }
  const final = [];
  for (let i = 0; i < glued.length; i++) {
    let t = glued[i];
    while (t.length && OPEN.includes(t[t.length - 1]) && i + 1 < glued.length && glued[i + 1] !== '\n') t += glued[++i];
    final.push(t);
  }
  return final;
}

// Break text into lines no wider than maxW. Returns [{ text, width, last }].
export function wrap(ctx, text, maxW) {
  const toks = tokenize(text);
  const lines = [];
  let cur = '';
  let curW = 0;
  const push = (last) => {
    const t = cur.replace(/\s+$/, '');
    lines.push({ text: t, width: ctx.measureText(t).width, last });
    cur = '';
    curW = 0;
  };
  for (const t of toks) {
    if (t === '\n') {
      push(true);
      continue;
    }
    const w = ctx.measureText(cur + t).width;
    const trimmed = ctx.measureText((cur + t).replace(/\s+$/, '')).width;
    if (cur && trimmed > maxW) {
      push(false);
      cur = t.replace(/^\s+/, '');
      curW = ctx.measureText(cur).width;
    } else {
      cur += t;
      curW = w;
    }
  }
  if (cur.trim()) push(true);
  if (lines.length) lines[lines.length - 1].last = true;
  return lines;
}

// Draw a line; 'justify' spreads the slack between CJK characters or words.
export function drawLine(ctx, line, x, y, maxW, justify) {
  const slack = maxW - line.width;
  if (!justify || line.last || slack <= 0 || slack > maxW * 0.18) {
    ctx.fillText(line.text, x, y);
    return;
  }
  const isCJK = CJK.test(line.text);
  if (isCJK) {
    const chars = Array.from(line.text);
    const gaps = chars.length - 1;
    if (gaps <= 0) {
      ctx.fillText(line.text, x, y);
      return;
    }
    const extra = slack / gaps;
    let cx = x;
    for (const ch of chars) {
      ctx.fillText(ch, cx, y);
      cx += ctx.measureText(ch).width + extra;
    }
  } else {
    const words = line.text.split(' ');
    const gaps = words.length - 1;
    if (gaps <= 0) {
      ctx.fillText(line.text, x, y);
      return;
    }
    const space = ctx.measureText(' ').width + slack / gaps;
    let cx = x;
    for (const w of words) {
      ctx.fillText(w, cx, y);
      cx += ctx.measureText(w).width + space;
    }
  }
}

// Paragraph: returns the y of the next baseline after the block.
export function paragraph(ctx, text, x, y, maxW, { size, leading = 1.45, justify = false, align = 'left', maxLines = 99 } = {}) {
  const lines = wrap(ctx, text, maxW).slice(0, maxLines);
  const lh = size * leading;
  for (const ln of lines) {
    if (align === 'center') ctx.fillText(ln.text, x + (maxW - ln.width) / 2, y);
    else if (align === 'right') ctx.fillText(ln.text, x + maxW - ln.width, y);
    else drawLine(ctx, ln, x, y, maxW, justify);
    y += lh;
  }
  return { y, lines: lines.length, height: lines.length * lh };
}

// Letter-spaced label (small caps style). Returns the width drawn.
export function tracked(ctx, text, x, y, tracking, { align = 'left', measureOnly = false } = {}) {
  const chars = Array.from(text);
  let w = 0;
  for (const ch of chars) w += ctx.measureText(ch).width;
  w += tracking * Math.max(0, chars.length - 1);
  if (measureOnly) return w;
  let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  for (const ch of chars) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + tracking;
  }
  return w;
}

// Largest size (≤ max) at which text fits maxW within maxLines lines.
export function fitSize(ctx, lang, text, maxW, maxLines, max, min, opts = {}) {
  for (let s = max; s >= min; s -= 0.25) {
    setFont(ctx, lang, s, opts);
    if (wrap(ctx, text, maxW).length <= maxLines) return s;
  }
  setFont(ctx, lang, min, opts);
  return min;
}

export function rule(ctx, x0, y0, x1, y1, width = 0.2) {
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

export const isCJK = (s) => CJK.test(s);
