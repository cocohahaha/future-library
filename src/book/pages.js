import { CanvasTexture, SRGBColorSpace, NoColorSpace, LinearMipmapLinearFilter, LinearFilter, Vector4 } from 'three';
import { W, H, WB, HB, T, BT } from './curve.js';
import { setFont, paragraph, tracked, fitSize, rule, wrap } from './type.js';
import { getLang, zoneText, bookText, t, ZONE_ORDER } from '../i18n.js';
import { ZONE_COLORS, PAL } from '../core/config.js';

// Every page of the book is a canvas drawn in millimetres (white paper with
// ink; the paper colour and fibres come from the shader). Pages near the
// open spread are drawn at full density, the rest at a low one; a language
// switch redraws them all, nearest first. Layout functions also record tap
// targets ("hits") in page millimetres.

export const PLATE = { x0: 26, y0: 30, x1: 182, y1: 214 }; // recto, page mm
export const COVER_PLATE = { x0: 50, y0: 100, x1: 146, y1: 213.3 }; // board mm
export const SPINE_W = T + 2 * BT + 4.5; // cloth spine strip width (mm)

const INK = '#26231f';
const INK2 = '#6d665c';
const ROMAN = ['I', 'II', 'III', 'IV', 'V'];
const FOLIO = { r1: 1, v1: 2, r2: 3, v2: 4, r3: 5, v3: 6, r4: 7, v4: 8, r5: 9, v5: 10, r6: 11, v6: 12, bk: 13 };

export const spreadOfZone = (i) => i + 2;
export const zoneOfSpread = (s) => (s >= 2 && s <= 6 ? s - 2 : -1);

// page id → what to draw
function kindOf(id) {
  if (id === 'p0') return { kind: 'title' };
  if (id === 'r1') return { kind: 'contents' };
  if (id === 'v6') return { kind: 'after' };
  if (id === 'bk') return { kind: 'card' };
  if (id === 'cover' || id === 'spine') return { kind: id };
  const n = Number(id.slice(1));
  if (id[0] === 'v') return { kind: 'zone', zone: n - 1 };
  return { kind: 'plate', zone: n - 2 };
}

const isVerso = (id) => id === 'p0' || id[0] === 'v';

// ---------------------------------------------------------------- helpers
function margins(id) {
  // inner (gutter) margin is wider; verso pages have the gutter on the right
  const inner = 24;
  const outer = 19;
  return isVerso(id) ? { l: outer, r: W - inner } : { l: inner, r: W - outer };
}

function runningHead(ctx, id, text, lang) {
  const m = margins(id);
  ctx.fillStyle = INK2;
  setFont(ctx, lang, 2.6, { kind: 'sans', weight: 500 });
  const tr = lang === 'zh' ? 0.6 : 0.55;
  const s = lang === 'zh' ? text : text.toUpperCase();
  if (isVerso(id)) tracked(ctx, s, m.l, 14, tr);
  else tracked(ctx, s, m.r, 14, tr, { align: 'right' });
}

function folio(ctx, id, lang) {
  const n = FOLIO[id];
  if (!n) return;
  const m = margins(id);
  ctx.fillStyle = INK2;
  setFont(ctx, lang, 3.2, { weight: 400 });
  ctx.textAlign = isVerso(id) ? 'left' : 'right';
  ctx.fillText(String(n), isVerso(id) ? m.l : m.r, H - 13);
  ctx.textAlign = 'left';
}

// press mark: a small open book under an arc with a question-mark hook
function pressMark(ctx, cx, cy, r, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = r * 0.08;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  // open book
  const w = r * 0.62;
  const yb = cy + r * 0.38;
  ctx.lineWidth = r * 0.07;
  ctx.beginPath();
  ctx.moveTo(cx, yb);
  ctx.quadraticCurveTo(cx - w * 0.5, yb - r * 0.16, cx - w, yb - r * 0.02);
  ctx.lineTo(cx - w, yb - r * 0.32);
  ctx.quadraticCurveTo(cx - w * 0.5, yb - r * 0.46, cx, yb - r * 0.3);
  ctx.quadraticCurveTo(cx + w * 0.5, yb - r * 0.46, cx + w, yb - r * 0.32);
  ctx.lineTo(cx + w, yb - r * 0.02);
  ctx.quadraticCurveTo(cx + w * 0.5, yb - r * 0.16, cx, yb);
  ctx.moveTo(cx, yb);
  ctx.lineTo(cx, yb - r * 0.3);
  ctx.stroke();
  // question hook rising from the book
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.32, r * 0.2, Math.PI * 1.05, Math.PI * 2.35);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.0, r * 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- page kinds
function drawTitle(ctx, id, lang, hits) {
  const b = bookText();
  const cx = W / 2 - 2; // optical centre, nudged away from the gutter
  pressMark(ctx, cx, 34, 6.5, INK);
  ctx.fillStyle = INK;
  setFont(ctx, lang, 2.9, { kind: 'sans', weight: 500 });
  tracked(ctx, lang === 'zh' ? b.press : b.press.toUpperCase(), cx, 50, lang === 'zh' ? 1.2 : 0.8, { align: 'center' });

  // title
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  if (lang === 'zh') {
    setFont(ctx, lang, 21, { weight: 600 });
    tracked(ctx, b.title[0], cx, 104, 3.2, { align: 'center' });
    tracked(ctx, b.title[1], cx, 132, 3.2, { align: 'center' });
  } else {
    const s1 = fitSize(ctx, lang, b.title[0], 150, 1, 13, 8, { weight: 400 });
    ctx.fillText(b.title[0], cx, 100);
    setFont(ctx, lang, s1 * 1.32, { weight: 400, italic: true });
    if (ctx.measureText(b.title[1]).width > 152) setFont(ctx, lang, (s1 * 1.32 * 152) / ctx.measureText(b.title[1]).width, { italic: true });
    ctx.fillText(b.title[1], cx, 100 + s1 * 1.55);
  }
  ctx.textAlign = 'left';
  ctx.strokeStyle = ZONE_COLORS.well;
  rule(ctx, cx - 10, 147, cx + 10, 147, 0.5);
  ctx.fillStyle = INK2;
  setFont(ctx, lang, 4.4, { italic: lang !== 'zh' });
  ctx.textAlign = 'center';
  ctx.fillText(b.subtitle, cx, 158);
  ctx.textAlign = 'left';

  // epigraph
  ctx.fillStyle = INK;
  setFont(ctx, lang, 4.0, { italic: lang !== 'zh' });
  const lines = b.epigraph.split('\n');
  lines.forEach((l, i) => {
    ctx.textAlign = 'center';
    ctx.fillText(l, cx, 196 + i * 6.4);
  });
  ctx.textAlign = 'left';
  ctx.fillStyle = INK2;
  setFont(ctx, lang, 2.9, { kind: 'sans', weight: 500 });
  tracked(ctx, lang === 'zh' ? b.edition : b.edition.toUpperCase(), cx, H - 22, lang === 'zh' ? 0.9 : 0.6, { align: 'center' });
}

function drawContents(ctx, id, lang, hits) {
  const b = bookText();
  const m = margins(id);
  runningHead(ctx, id, t('brand'), lang);
  ctx.fillStyle = INK;
  setFont(ctx, lang, lang === 'zh' ? 10 : 11, { weight: lang === 'zh' ? 600 : 400 });
  ctx.fillText(b.contents, m.l, 44);
  ctx.strokeStyle = INK;
  rule(ctx, m.l, 51, m.r, 51, 0.3);
  let y = 66;
  ZONE_ORDER.forEach((zid, i) => {
    const z = zoneText(zid);
    const col = ZONE_COLORS[zid];
    const top = y - 9;
    // numeral
    ctx.fillStyle = col;
    setFont(ctx, lang, 9, { weight: 300 });
    ctx.fillText(String(i + 1), m.l, y + 1);
    // name + kicker
    const nx = m.l + 13;
    ctx.fillStyle = INK;
    setFont(ctx, lang, lang === 'zh' ? 5.6 : 5.8, { weight: lang === 'zh' ? 600 : 500 });
    ctx.fillText(z.name, nx, y - 1);
    const nameW = ctx.measureText(z.name).width;
    ctx.fillStyle = INK2;
    setFont(ctx, lang, 2.7, { kind: 'sans', weight: 500 });
    tracked(ctx, lang === 'zh' ? z.kicker : z.kicker.toUpperCase(), nx, y + 5.2, lang === 'zh' ? 0.5 : 0.35);
    // dotted leader + page number
    const page = String(FOLIO[`v${i + 1}`]);
    setFont(ctx, lang, 4.4, { weight: 400 });
    const pw = ctx.measureText(page).width;
    ctx.fillStyle = INK;
    ctx.fillText(page, m.r - pw, y - 1);
    ctx.fillStyle = INK2;
    for (let x = nx + nameW + 3; x < m.r - pw - 3; x += 2.2) {
      ctx.beginPath();
      ctx.arc(x, y - 2.2, 0.22, 0, Math.PI * 2);
      ctx.fill();
    }
    hits.push({ x: m.l - 2, y: top, w: m.r - m.l + 4, h: 18, action: { type: 'goto', spread: spreadOfZone(i) } });
    y += 22;
  });
  // afterword line
  ctx.fillStyle = INK2;
  setFont(ctx, lang, 4.4, { italic: lang !== 'zh' });
  ctx.fillText(b.afterTitle.replace(/\s/g, lang === 'zh' ? '' : ' '), m.l + 13, y - 1);
  setFont(ctx, lang, 4.4);
  const ap = String(FOLIO.v6);
  ctx.fillText(ap, m.r - ctx.measureText(ap).width, y - 1);
  hits.push({ x: m.l - 2, y: y - 9, w: m.r - m.l + 4, h: 13, action: { type: 'goto', spread: 7 } });

  // how to read
  y = 196;
  ctx.strokeStyle = INK2;
  rule(ctx, m.l, y - 9, m.l + 18, y - 9, 0.25);
  ctx.fillStyle = INK;
  setFont(ctx, lang, 3.3, { kind: 'sans', weight: 600 });
  ctx.fillText(b.howTo, m.l, y - 2);
  ctx.fillStyle = INK2;
  setFont(ctx, lang, 3.3, { weight: 400 });
  y += 5;
  for (const line of b.howLines) {
    const r = paragraph(ctx, line, m.l, y, m.r - m.l, { size: 3.3, leading: 1.45 });
    y = r.y + 1.2;
  }
  folio(ctx, id, lang);
}

function drawZone(ctx, id, lang, hits, zi) {
  const zid = ZONE_ORDER[zi];
  const z = zoneText(zid);
  const col = ZONE_COLORS[zid];
  const m = margins(id);
  const w = m.r - m.l;
  runningHead(ctx, id, t('brand'), lang);

  // big numeral and kicker
  ctx.fillStyle = col;
  setFont(ctx, lang, 34, { weight: 300 });
  ctx.fillText(String(zi + 1).padStart(2, '0'), m.l - 1.5, 52);
  setFont(ctx, lang, 2.9, { kind: 'sans', weight: 600 });
  tracked(ctx, lang === 'zh' ? z.kicker : z.kicker.toUpperCase(), m.l, 61, lang === 'zh' ? 0.7 : 0.45);

  // title
  ctx.fillStyle = INK;
  const ts = fitSize(ctx, lang, z.name, w, 1, lang === 'zh' ? 10.5 : 11, 6, { weight: lang === 'zh' ? 600 : 400 });
  ctx.fillText(z.name, m.l, 61 + ts * 1.25);
  let y = 61 + ts * 1.25 + 6;
  ctx.strokeStyle = INK;
  rule(ctx, m.l, y, m.l + 22, y, 0.35);
  y += 10;

  // body
  const bs = lang === 'zh' ? 4.05 : 4.25;
  setFont(ctx, lang, bs);
  ctx.fillStyle = INK;
  y = paragraph(ctx, z.body, m.l, y, w, { size: bs, leading: lang === 'zh' ? 1.75 : 1.48, justify: lang === 'zh' }).y + 4;

  // before / now, two columns
  const colW = (w - 8) / 2;
  const cs = lang === 'zh' ? 3.35 : 3.45;
  ctx.strokeStyle = 'rgba(38,35,31,0.35)';
  rule(ctx, m.l, y - 3, m.r, y - 3, 0.2);
  const yTop = y + 3;
  [
    [t('before'), z.before, m.l],
    [t('now'), z.after, m.l + colW + 8]
  ].forEach(([label, text, x], k) => {
    ctx.fillStyle = k ? col : INK2;
    setFont(ctx, lang, 2.6, { kind: 'sans', weight: 700 });
    tracked(ctx, lang === 'zh' ? label : label.toUpperCase(), x, yTop, lang === 'zh' ? 0.5 : 0.4);
    ctx.fillStyle = k ? INK : INK2;
    setFont(ctx, lang, cs, { italic: !k && lang !== 'zh' });
    const r = paragraph(ctx, text, x, yTop + 6, colW, { size: cs, leading: 1.5 });
    if (k === 0) y = r.y;
    else y = Math.max(y, r.y);
  });
  rule(ctx, m.l + colW + 4, yTop - 3, m.l + colW + 4, y - 3, 0.2);

  // the open question, set low on the page
  const qy = Math.max(y + 12, H - 62);
  ctx.fillStyle = col;
  setFont(ctx, lang, 2.6, { kind: 'sans', weight: 700 });
  tracked(ctx, lang === 'zh' ? t('openQuestion') : t('openQuestion').toUpperCase(), m.l, qy, lang === 'zh' ? 0.6 : 0.45);
  ctx.fillStyle = INK;
  const qs = fitSize(ctx, lang, z.question, w, 2, lang === 'zh' ? 6.2 : 6.6, 4.5, { italic: lang !== 'zh', weight: 400 });
  const qr = paragraph(ctx, z.question, m.l, qy + qs * 1.5, w, { size: qs, leading: 1.3 });

  // printed action: a small arrow link that sets the plate moving
  const ay = Math.min(H - 24, qr.y + 5);
  ctx.fillStyle = col;
  setFont(ctx, lang, 3.4, { kind: 'sans', weight: 600 });
  const label = `→  ${z.action}`;
  ctx.fillText(label, m.l, ay);
  const lw = ctx.measureText(label).width;
  ctx.strokeStyle = col;
  rule(ctx, m.l, ay + 1.4, m.l + lw, ay + 1.4, 0.25);
  hits.push({ x: m.l - 3, y: ay - 6, w: lw + 6, h: 10, action: { type: 'zone', zone: zi } });
  folio(ctx, id, lang);
}

function drawPlate(ctx, id, lang, hits, zi) {
  const zid = ZONE_ORDER[zi];
  const z = zoneText(zid);
  const col = ZONE_COLORS[zid];
  const m = margins(id);
  runningHead(ctx, id, z.name, lang);
  const P = PLATE;
  // the plate is a slightly cooler, smoother insert
  ctx.fillStyle = '#f7f6f2';
  ctx.fillRect(P.x0, P.y0, P.x1 - P.x0, P.y1 - P.y0);
  ctx.strokeStyle = 'rgba(38,35,31,0.55)';
  ctx.lineWidth = 0.22;
  ctx.strokeRect(P.x0, P.y0, P.x1 - P.x0, P.y1 - P.y0);
  // crop marks
  ctx.lineWidth = 0.15;
  for (const [x, y, sx, sy] of [
    [P.x0, P.y0, -1, -1],
    [P.x1, P.y0, 1, -1],
    [P.x0, P.y1, -1, 1],
    [P.x1, P.y1, 1, 1]
  ]) {
    rule(ctx, x + sx * 1.5, y, x + sx * 5, y, 0.15);
    rule(ctx, x, y + sy * 1.5, x, y + sy * 5, 0.15);
  }
  // plate label
  ctx.fillStyle = INK2;
  setFont(ctx, lang, 2.6, { kind: 'sans', weight: 600 });
  const lab = lang === 'zh' ? `${t('plate')} ${ROMAN[zi]}` : `${t('plate').toUpperCase()} ${ROMAN[zi]}`;
  tracked(ctx, lab, P.x0, P.y0 - 3.5, 0.5);
  // north arrow
  const nx = P.x0 + 4;
  const ny = P.y1 + 9;
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.moveTo(nx, ny - 4);
  ctx.lineTo(nx + 1.6, ny + 1.5);
  ctx.lineTo(nx, ny + 0.6);
  ctx.lineTo(nx - 1.6, ny + 1.5);
  ctx.closePath();
  ctx.fill();
  setFont(ctx, lang, 2.4, { kind: 'sans', weight: 600 });
  ctx.textAlign = 'center';
  ctx.fillText('N', nx, ny + 5);
  ctx.textAlign = 'left';
  // scale bar: 1:40, 0 – 1 – 2 m (25 mm per metre)
  const sx = P.x1 - 50;
  const sy = P.y1 + 7;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 0.2;
  ctx.strokeRect(sx, sy, 50, 1.4);
  ctx.fillStyle = INK;
  ctx.fillRect(sx, sy, 12.5, 1.4);
  ctx.fillRect(sx + 25, sy, 12.5, 1.4);
  setFont(ctx, lang, 2.3, { kind: 'sans', weight: 500 });
  ctx.fillText('0', sx - 0.6, sy + 5);
  ctx.fillText('1', sx + 24.4, sy + 5);
  ctx.fillText('2 m', sx + 48.8, sy + 5);
  ctx.textAlign = 'right';
  ctx.fillText('1 : 40', sx - 3, sy + 1.6);
  ctx.textAlign = 'left';
  // caption
  const cy = P.y1 + 20;
  const w = m.r - m.l;
  ctx.fillStyle = INK;
  setFont(ctx, lang, 3.5, { weight: 600, italic: lang !== 'zh' });
  const head = lang === 'zh' ? `${t('plate')} ${ROMAN[zi]}　${z.name}。` : `Plate ${ROMAN[zi]}. ${z.name}.`;
  ctx.fillText(head, m.l, cy);
  const hw = ctx.measureText(head + ' ').width;
  setFont(ctx, lang, 3.5, { weight: 400 });
  const lines = wrap(ctx, z.caption, w - hw);
  if (lines.length === 1) ctx.fillText(z.caption, m.l + hw, cy);
  else paragraph(ctx, z.caption, m.l, cy + 5.2, w, { size: 3.5, leading: 1.45, maxLines: 2 });
  ctx.fillStyle = col;
  ctx.fillRect(m.l, cy - 9, 6, 0.6);
  folio(ctx, id, lang);
}

function drawAfter(ctx, id, lang) {
  const b = bookText();
  const m = margins(id);
  const w = m.r - m.l;
  runningHead(ctx, id, t('brand'), lang);
  ctx.fillStyle = INK;
  setFont(ctx, lang, lang === 'zh' ? 9 : 10, { weight: lang === 'zh' ? 600 : 400, italic: lang !== 'zh' });
  ctx.fillText(b.afterTitle, m.l, 50);
  ctx.strokeStyle = INK;
  rule(ctx, m.l, 57, m.l + 22, 57, 0.35);
  const bs = lang === 'zh' ? 4.05 : 4.25;
  setFont(ctx, lang, bs);
  let y = 70;
  for (const para of b.afterBody.split('\n\n')) {
    y = paragraph(ctx, para, m.l, y, w, { size: bs, leading: lang === 'zh' ? 1.75 : 1.48, justify: lang === 'zh' }).y + 3;
  }
  pressMark(ctx, m.l + 6, H - 60, 5, INK2);
  ctx.fillStyle = INK2;
  setFont(ctx, lang, 3.0, { weight: 400, italic: lang !== 'zh' });
  paragraph(ctx, b.colophon, m.l + 16, H - 63, w - 16, { size: 3.0, leading: 1.5 });
  folio(ctx, id, lang);
}

function drawCard(ctx, id, lang) {
  const b = bookText();
  const m = margins(id);
  runningHead(ctx, id, b.cardTitle, lang);
  // the card
  const cx0 = 46;
  const cy0 = 40;
  const cw = 104;
  const ch = 150;
  ctx.save();
  ctx.translate(cx0 + cw / 2, cy0 + ch / 2);
  ctx.rotate(-0.025);
  ctx.translate(-cw / 2, -ch / 2);
  ctx.fillStyle = 'rgba(70,55,30,0.07)';
  ctx.fillRect(1.2, 1.6, cw, ch);
  ctx.fillStyle = '#fbf6ea';
  ctx.fillRect(0, 0, cw, ch);
  ctx.strokeStyle = 'rgba(38,35,31,0.5)';
  ctx.lineWidth = 0.2;
  ctx.strokeRect(0, 0, cw, ch);
  ctx.fillStyle = INK;
  setFont(ctx, lang, 4.4, { weight: 600 });
  ctx.fillText(b.cardTitle, 7, 12);
  ctx.fillStyle = INK2;
  setFont(ctx, lang, 2.6, { kind: 'sans', weight: 600 });
  tracked(ctx, lang === 'zh' ? b.cardSub : b.cardSub.toUpperCase(), 7, 19, 0.5);
  ctx.strokeStyle = 'rgba(54,80,127,0.45)';
  for (let i = 0; i < 11; i++) rule(ctx, 6, 26 + i * 10.5, cw - 6, 26 + i * 10.5, 0.18);
  rule(ctx, 46, 22, 46, ch - 8, 0.18);
  // stamped dates, a little crooked, in violet ink
  b.cardStamps.forEach((s, i) => {
    ctx.save();
    ctx.translate(9, 34 + i * 10.5);
    ctx.rotate((((i * 37) % 7) - 3) * 0.012);
    ctx.fillStyle = i % 2 ? 'rgba(84,62,140,0.78)' : 'rgba(54,80,127,0.8)';
    setFont(ctx, lang, 3.2, { kind: 'sans', weight: 700 });
    tracked(ctx, s, 0, 0, 0.35);
    ctx.restore();
  });
  ctx.restore();
  // the pocket
  const py = 150;
  ctx.fillStyle = '#efe2c4';
  ctx.beginPath();
  ctx.moveTo(38, py);
  ctx.lineTo(158, py);
  ctx.lineTo(158, 214);
  ctx.lineTo(38, 214);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(38,35,31,0.45)';
  ctx.lineWidth = 0.25;
  ctx.stroke();
  ctx.fillStyle = INK;
  setFont(ctx, lang, 3.0, { kind: 'sans', weight: 700 });
  tracked(ctx, lang === 'zh' ? t('brand') : t('brand').toUpperCase(), 98, py + 16, lang === 'zh' ? 0.8 : 0.4, { align: 'center' });
  ctx.fillStyle = INK2;
  setFont(ctx, lang, 3.4, { italic: lang !== 'zh' });
  ctx.textAlign = 'center';
  ctx.fillText(b.cardRule, 98, py + 27);
  ctx.textAlign = 'left';
  pressMark(ctx, 98, py + 44, 5, INK2);
  ctx.fillStyle = INK2;
  setFont(ctx, lang, 3.3, { italic: lang !== 'zh' });
  paragraph(ctx, b.cardFoot, m.l, H - 30, m.r - m.l, { size: 3.3, leading: 1.4, align: 'center' });
  folio(ctx, id, lang);
}

// ---------------------------------------------------------------- cover + spine
// art: cloth + foil colours. mask: R foil, G deboss depth, B cloth (0 = paper)
function drawCover(art, mask, lang) {
  const b = bookText();
  const cloth = '#' + PAL.cloth.toString(16).padStart(6, '0');
  art.fillStyle = cloth;
  art.fillRect(0, 0, WB, HB);
  mask.fillStyle = 'rgb(0,0,255)';
  mask.fillRect(0, 0, WB, HB);
  const both = (fn) => {
    art.fillStyle = art.strokeStyle = '#d9b46a';
    fn(art);
    mask.globalCompositeOperation = 'lighter';
    mask.fillStyle = mask.strokeStyle = 'rgb(255,170,0)';
    fn(mask);
    mask.globalCompositeOperation = 'source-over';
  };
  const blind = (fn) => {
    mask.globalCompositeOperation = 'lighter';
    mask.fillStyle = mask.strokeStyle = 'rgb(0,150,0)';
    fn(mask);
    mask.globalCompositeOperation = 'source-over';
  };
  const cx = WB / 2 + 2; // the hinge eats a little on the left
  // frames: foil rule + blind rule
  both((c) => {
    c.lineWidth = 0.5;
    c.strokeRect(10, 10, WB - 20, HB - 20);
  });
  blind((c) => {
    c.lineWidth = 0.6;
    c.strokeRect(13, 13, WB - 26, HB - 26);
  });
  // title
  both((c) => {
    c.textAlign = 'center';
    if (lang === 'zh') {
      setFont(c, lang, 15.5, { weight: 600 });
      tracked(c, b.titleRun, cx, 54, 1.6, { align: 'center' });
      setFont(c, lang, 4.2, { kind: 'sans', weight: 500 });
      tracked(c, b.subtitle, cx, 72, 1.4, { align: 'center' });
    } else {
      setFont(c, lang, 9, { weight: 400, italic: true });
      c.fillText(b.title[0], cx, 44);
      const s = fitSize(c, lang, b.title[1], WB - 44, 1, 15, 9, { weight: 400 });
      void s;
      c.fillText(b.title[1], cx, 63);
      setFont(c, lang, 3.4, { kind: 'sans', weight: 600 });
      tracked(c, b.subtitle.toUpperCase(), cx, 77, 0.9, { align: 'center' });
    }
    c.textAlign = 'left';
  });
  // recessed plate: paper, debossed
  const P = COVER_PLATE;
  art.fillStyle = '#f2ece0';
  art.fillRect(P.x0, P.y0, P.x1 - P.x0, P.y1 - P.y0);
  mask.fillStyle = 'rgb(0,90,0)';
  mask.fillRect(P.x0 - 3, P.y0 - 3, P.x1 - P.x0 + 6, P.y1 - P.y0 + 6);
  mask.fillStyle = 'rgb(0,255,0)';
  mask.fillRect(P.x0, P.y0, P.x1 - P.x0, P.y1 - P.y0);
  // press line
  both((c) => {
    setFont(c, lang, 3.0, { kind: 'sans', weight: 600 });
    tracked(c, lang === 'zh' ? b.press : b.press.toUpperCase(), cx, HB - 24, lang === 'zh' ? 1.2 : 0.8, { align: 'center' });
  });
  both((c) => pressMark(c, cx, HB - 37, 4.2, c.fillStyle));
}

function drawSpine(art, mask, lang) {
  const b = bookText();
  const cloth = '#' + PAL.cloth.toString(16).padStart(6, '0');
  art.fillStyle = cloth;
  art.fillRect(0, 0, SPINE_W, HB);
  mask.fillStyle = 'rgb(0,0,255)';
  mask.fillRect(0, 0, SPINE_W, HB);
  const both = (fn) => {
    art.fillStyle = art.strokeStyle = '#d9b46a';
    fn(art);
    mask.globalCompositeOperation = 'lighter';
    mask.fillStyle = mask.strokeStyle = 'rgb(255,170,0)';
    fn(mask);
    mask.globalCompositeOperation = 'source-over';
  };
  const mid = SPINE_W / 2;
  both((c) => {
    for (const y of [11, 13.2, HB - 13.2, HB - 11]) {
      c.fillRect(3, y - 0.25, SPINE_W - 6, 0.5);
    }
  });
  both((c) => {
    if (lang === 'zh') {
      setFont(c, lang, 6.4, { weight: 600 });
      c.textAlign = 'center';
      Array.from(b.titleRun).forEach((ch, i) => c.fillText(ch, mid, 36 + i * 8.6));
      c.textAlign = 'left';
    } else {
      c.save();
      c.translate(mid + 1.8, 28);
      c.rotate(Math.PI / 2);
      setFont(c, lang, 4.8, { weight: 500 });
      tracked(c, b.titleRun.toUpperCase(), 0, 0, 0.9);
      c.restore();
    }
    pressMark(c, mid, HB - 26, 3.3, c.fillStyle);
  });
}

// ---------------------------------------------------------------- registry
export function createPages({ tier, anisotropy = 8 }) {
  const entries = new Map();
  const ids = ['p0', 'r1', 'v1', 'r2', 'v2', 'r3', 'v3', 'r4', 'v4', 'r5', 'v5', 'r6', 'v6', 'bk'];
  const queue = [];

  function makeTex(canvas, srgb = true) {
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = srgb ? SRGBColorSpace : NoColorSpace;
    tex.flipY = false;
    tex.anisotropy = anisotropy;
    tex.minFilter = LinearMipmapLinearFilter;
    tex.magFilter = LinearFilter;
    tex.generateMipmaps = true;
    return tex;
  }

  for (const id of ids)
    entries.set(id, {
      id,
      ...kindOf(id),
      canvas: null,
      tex: null,
      density: 0,
      want: tier.pagePxFar,
      hits: [],
      print: null,
      printAlpha: 0,
      rect: new Vector4(PLATE.x0, PLATE.y0, PLATE.x1, PLATE.y1)
    });
  // cover and spine: art + mask canvases
  for (const id of ['cover', 'spine'])
    entries.set(id, { id, kind: id, canvas: null, mcanvas: null, tex: null, mask: null, density: 0, want: 0, hits: [], print: null, printAlpha: 0, rect: new Vector4() });

  function render(e) {
    const lang = getLang();
    const special = e.kind === 'cover' || e.kind === 'spine';
    const wmm = e.kind === 'cover' ? WB : e.kind === 'spine' ? SPINE_W : W;
    const hmm = special ? HB : H;
    const d = special ? (tier.name === 'high' ? 5 : 3) : e.want;
    const cw = Math.max(8, Math.round(wmm * d));
    const ch = Math.max(8, Math.round(hmm * d));
    const resized = !e.canvas || e.canvas.width !== cw || e.canvas.height !== ch;
    if (resized) {
      e.canvas = document.createElement('canvas');
      e.canvas.width = cw;
      e.canvas.height = ch;
      if (special) {
        e.mcanvas = document.createElement('canvas');
        e.mcanvas.width = cw;
        e.mcanvas.height = ch;
      }
    }
    const ctx = e.canvas.getContext('2d');
    ctx.setTransform(cw / wmm, 0, 0, ch / hmm, 0, 0);
    ctx.textBaseline = 'alphabetic';
    e.hits = [];
    if (special) {
      const mctx = e.mcanvas.getContext('2d');
      mctx.setTransform(cw / wmm, 0, 0, ch / hmm, 0, 0);
      if (e.kind === 'cover') drawCover(ctx, mctx, lang);
      else drawSpine(ctx, mctx, lang);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = INK;
      ctx.strokeStyle = INK;
      if (e.kind === 'title') drawTitle(ctx, e.id, lang, e.hits);
      else if (e.kind === 'contents') drawContents(ctx, e.id, lang, e.hits);
      else if (e.kind === 'zone') drawZone(ctx, e.id, lang, e.hits, e.zone);
      else if (e.kind === 'plate') drawPlate(ctx, e.id, lang, e.hits, e.zone);
      else if (e.kind === 'after') drawAfter(ctx, e.id, lang);
      else if (e.kind === 'card') drawCard(ctx, e.id, lang);
    }
    if (resized || !e.tex) {
      if (e.tex) e.tex.dispose();
      e.tex = makeTex(e.canvas);
      if (special) {
        if (e.mask) e.mask.dispose();
        e.mask = makeTex(e.mcanvas, false);
      }
    } else {
      e.tex.needsUpdate = true;
      if (special) e.mask.needsUpdate = true;
    }
    e.density = d;
    e.lang = lang;
  }

  // densities for a spread: its pages and the next/previous ones high
  function focus(s) {
    const near = new Set();
    for (const k of [s - 1, s, s + 1]) {
      if (k < 0 || k > 7) continue;
      near.add(k <= 1 ? 'p0' : `v${k - 1}`);
      near.add(k >= 7 ? 'bk' : `r${Math.max(1, k)}`);
    }
    queue.length = 0;
    const order = [];
    for (const e of entries.values()) {
      if (e.kind === 'cover' || e.kind === 'spine') continue;
      e.want = near.has(e.id) ? tier.pagePx : tier.pagePxFar;
      if (!e.canvas || Math.abs(e.density - e.want) > 0.01 || e.lang !== getLang()) order.push(e);
    }
    order.sort((a, b) => (near.has(b.id) ? 1 : 0) - (near.has(a.id) ? 1 : 0));
    queue.push(...order);
  }

  // redraw everything (language switch); cover and spine at once
  function invalidate() {
    for (const e of entries.values()) e.lang = null;
    render(entries.get('cover'));
    render(entries.get('spine'));
  }

  return {
    get: (id) => {
      const e = entries.get(id);
      if (!e.tex) render(e);
      return e;
    },
    entries,
    focus,
    invalidate,
    // draw up to n queued pages (call once per frame)
    step(n = 1) {
      let done = 0;
      while (queue.length && done < n) {
        const e = queue.shift();
        if (e.canvas && Math.abs(e.density - e.want) < 0.01 && e.lang === getLang()) continue;
        render(e);
        done++;
      }
      return queue.length;
    },
    renderNow(id) {
      render(entries.get(id));
    },
    setPrint(id, tex) {
      const e = entries.get(id);
      e.print = tex;
    },
    // hit test in page mm → action or null
    hitAt(id, x, y) {
      const e = entries.get(id);
      if (!e) return null;
      for (const h of e.hits) if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h.action;
      return null;
    }
  };
}
