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
const PAL_CLOTH = '#a4502f'; // the bookcloth terracotta, also the HUD's call to action
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

  // library overview: leaves the book for the whole building in its city
  y += 12;
  const ovName = t('overview');
  ctx.fillStyle = PAL_CLOTH;
  setFont(ctx, lang, 4.4, { weight: 600, italic: lang !== 'zh' });
  ctx.fillText(ovName, m.l + 13, y - 1);
  const ovW = ctx.measureText(ovName).width;
  setFont(ctx, lang, 2.6, { kind: 'sans', weight: 600 });
  const ovK = lang === 'zh' ? t('ovKicker') : t('ovKicker').toUpperCase();
  tracked(ctx, ovK, m.l + 13 + ovW + 3, y - 1.4, lang === 'zh' ? 0.4 : 0.3);
  setFont(ctx, lang, 4.4, { kind: 'sans', weight: 600 });
  const arrow = '↗';
  ctx.fillText(arrow, m.r - ctx.measureText(arrow).width, y - 1);
  hits.push({ x: m.l - 2, y: y - 8, w: m.r - m.l + 4, h: 11, action: { type: 'overview' } });

  // how to read
  y = 203;
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

function drawAfter(ctx, id, lang, hits) {
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
  // printed link out of the book, set like the zone pages' action links
  const ay = Math.min(H - 76, y + 9);
  ctx.fillStyle = PAL_CLOTH;
  setFont(ctx, lang, 3.4, { kind: 'sans', weight: 600 });
  const link = `→  ${t('ovLink')}`;
  ctx.fillText(link, m.l, ay);
  const lw = ctx.measureText(link).width;
  ctx.strokeStyle = PAL_CLOTH;
  rule(ctx, m.l, ay + 1.4, m.l + lw, ay + 1.4, 0.25);
  hits.push({ x: m.l - 3, y: ay - 6, w: lw + 6, h: 10, action: { type: 'overview' } });
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
  art.save();
  art.translate(P.x0, P.y0);
  art.beginPath();
  art.rect(0, 0, P.x1 - P.x0, P.y1 - P.y0);
  art.clip();
  coverArt(art, P.x1 - P.x0, P.y1 - P.y0);
  art.restore();
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

// ---------------------------------------------------------------- cover plate
// The picture pasted into the cover's recess, drawn in plate millimetres: the
// library seen across its forecourt. A butterfly roof (an open book), timber
// fins over a ribbon window, a glazed reading hall lined with shelves, a
// reflecting pool that mirrors it all, and a few visitors.
function coverArt(c, w, h) {
  let sd = 20417;
  const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const grad = (y0, y1, stops) => {
    const g = c.createLinearGradient(0, y0, 0, y1);
    stops.forEach(([o, col]) => g.addColorStop(o, col));
    return g;
  };
  const poly = (pts, fill, stroke, lw = 0.16) => {
    c.beginPath();
    pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.closePath();
    if (fill) {
      c.fillStyle = fill;
      c.fill();
    }
    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = lw;
      c.stroke();
    }
  };
  const disc = (x, y, r, fill) => {
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fillStyle = fill;
    c.fill();
  };
  const INKC = '#2e2a26';
  const GY = 82; // ground line
  const SPINES = ['#7d2f24', '#2f4763', '#47603f', '#c08a3a', '#e9e1cf', '#3a3633', '#8a8f93', '#a4502f', '#5d4a6e', '#d6c7a4'];
  // sky, sun, a few high clouds
  c.fillStyle = grad(0, GY, [[0, '#d5dedd'], [0.55, '#ebe7dc'], [1, '#f5e9d2']]);
  c.fillRect(0, 0, w, GY);
  c.fillStyle = 'rgba(255,246,222,0.75)';
  disc(72, 17, 6.5, 'rgba(255,244,214,0.55)');
  disc(72, 17, 4.2, '#fbf1da');
  c.strokeStyle = 'rgba(255,255,255,0.6)';
  c.lineCap = 'round';
  for (let i = 0; i < 7; i++) {
    const y = 8 + rnd() * 20;
    const x = rnd() * w;
    c.lineWidth = 0.6 + rnd() * 0.9;
    c.beginPath();
    c.moveTo(x - 6 - rnd() * 8, y);
    c.lineTo(x + 6 + rnd() * 8, y);
    c.stroke();
  }
  // distant city, pale
  for (let x = -2; x < w; ) {
    const bw = 3 + rnd() * 7;
    const bh = 6 + rnd() * 16;
    c.fillStyle = pick(['#cfd5d2', '#c6cdcb', '#d8dcd6']);
    c.fillRect(x, GY - bh, bw, bh);
    x += bw + rnd() * 1.5;
  }
  // trees behind the building
  const crown = (x, y, r, dark, light) => {
    for (let i = 0; i < 9; i++) disc(x + (rnd() - 0.5) * r * 1.3, y + (rnd() - 0.5) * r * 0.9, r * (0.45 + rnd() * 0.3), dark);
    for (let i = 0; i < 6; i++) disc(x - r * 0.2 + (rnd() - 0.5) * r, y - r * 0.25 + (rnd() - 0.5) * r * 0.6, r * (0.3 + rnd() * 0.2), light);
  };
  for (const [x, y, r] of [[6, 56, 10], [17, 50, 8], [86, 52, 10], [95, 60, 8], [48, 30, 7], [33, 36, 6], [63, 35, 6]]) crown(x, y, r, '#7e8d6b', '#97a47f');
  // plinth and steps
  poly([[4, 78.2], [92, 78.2], [92, 80], [4, 80]], '#d2cabb', INKC);
  poly([[1, 80], [95, 80], [95, GY], [1, GY]], '#dcd4c5', INKC);
  // ground floor: warm reading hall behind glass
  const g0 = 13;
  const g1 = 83;
  c.fillStyle = grad(57, 78, [[0, '#f8e2b4'], [1, '#e7bf85']]);
  c.fillRect(g0, 57, g1 - g0, 21.2);
  // the shelf wall at the back of the hall
  for (let row = 0; row < 4; row++) {
    const base = 62.5 + row * 4.1;
    c.fillStyle = '#8b6844';
    c.fillRect(g0, base, g1 - g0, 0.45);
    for (let x = g0 + 0.4; x < g1 - 0.6; ) {
      if (x > 44 && x < 52) {
        x = 52;
        continue; // the stair opening
      }
      const sw = 0.45 + rnd() * 0.6;
      const sh = 2.2 + rnd() * 1.2;
      c.fillStyle = pick(SPINES);
      c.fillRect(x, base - sh, sw, sh);
      x += sw + (rnd() < 0.06 ? 1.2 : 0.06);
    }
  }
  // a stair rising through the opening
  c.strokeStyle = '#6a4b2e';
  c.lineWidth = 0.35;
  for (let i = 0; i < 9; i++) {
    const y = 77.6 - i * 2.3;
    c.beginPath();
    c.moveTo(45 + i * 0.4, y);
    c.lineTo(51.5 - i * 0.2, y);
    c.stroke();
  }
  // pendants
  for (const x of [22, 34, 62, 74]) {
    c.strokeStyle = INKC;
    c.lineWidth = 0.08;
    c.beginPath();
    c.moveTo(x, 57);
    c.lineTo(x, 59.4);
    c.stroke();
    disc(x, 60.2, 1.6, 'rgba(255,236,180,0.5)');
    poly([[x - 1, 60.3], [x + 1, 60.3], [x + 0.55, 59.3], [x - 0.55, 59.3]], '#fff4d6');
  }
  // people inside, softened by the glass
  const person = (x, y, s, col, legs, opt = {}) => {
    const k = s / 7.5; // s = standing height in mm
    c.lineCap = 'round';
    // shadow
    c.fillStyle = 'rgba(40,30,20,0.18)';
    c.beginPath();
    c.ellipse(x + 0.6 * k, y + 0.15, 1.6 * k, 0.4 * k, 0, 0, Math.PI * 2);
    c.fill();
    // legs
    c.strokeStyle = legs;
    c.lineWidth = 0.75 * k;
    const st = opt.walk ? 0.9 * k : 0.25 * k;
    c.beginPath();
    c.moveTo(x - 0.25 * k, y - 3.4 * k);
    c.lineTo(x - st, y - 0.2 * k);
    c.moveTo(x + 0.25 * k, y - 3.4 * k);
    c.lineTo(x + st, y - 0.2 * k);
    c.stroke();
    // body
    poly([[x - 0.95 * k, y - 6.1 * k], [x + 0.95 * k, y - 6.1 * k], [x + (opt.coat ? 1.2 : 0.85) * k, y - (opt.coat ? 2.4 : 3.3) * k], [x - (opt.coat ? 1.2 : 0.85) * k, y - (opt.coat ? 2.4 : 3.3) * k]], col);
    // arms
    c.strokeStyle = col;
    c.lineWidth = 0.5 * k;
    c.beginPath();
    c.moveTo(x - 0.9 * k, y - 5.8 * k);
    c.lineTo(x - (opt.walk ? 1.6 : 1.1) * k, y - 3.6 * k);
    c.moveTo(x + 0.9 * k, y - 5.8 * k);
    c.lineTo(x + (opt.book ? 0.4 : opt.walk ? 1.5 : 1.1) * k, y - (opt.book ? 4.6 : 3.6) * k);
    c.stroke();
    if (opt.book) poly([[x - 0.2 * k, y - 5.1 * k], [x + 1.1 * k, y - 5.1 * k], [x + 1.1 * k, y - 4.3 * k], [x - 0.2 * k, y - 4.3 * k]], '#f3eee2');
    // neck, head, hair
    disc(x, y - 6.9 * k, 0.72 * k, opt.skin || '#c99b77');
    c.fillStyle = opt.hair || '#2b2420';
    c.beginPath();
    c.arc(x, y - 7.05 * k, 0.76 * k, Math.PI * 1.02, Math.PI * 1.98);
    c.fill();
    if (opt.long) c.fillRect(x - 0.76 * k, y - 7.1 * k, 1.52 * k, 1.1 * k);
  };
  person(26, 78, 6.8, '#5f7480', '#3a3a3a', { skin: '#e0b896' });
  person(30, 78, 6.4, '#b5643d', '#2f3540', { book: true, skin: '#8d5a3b', hair: '#1d1714', long: true });
  person(67, 78, 7, '#e8e2d4', '#4b4f58', { skin: '#f0cdb0', hair: '#8c6a43' });
  c.fillStyle = 'rgba(255,250,238,0.16)';
  c.fillRect(g0, 57, g1 - g0, 21.2);
  // glass: mullions, transom, a couple of reflections
  c.strokeStyle = '#3b3833';
  c.lineWidth = 0.22;
  for (let x = g0; x <= g1 + 0.01; x += 7) {
    c.beginPath();
    c.moveTo(x, 57);
    c.lineTo(x, 78.2);
    c.stroke();
  }
  c.lineWidth = 0.14;
  c.beginPath();
  c.moveTo(g0, 61.2);
  c.lineTo(g1, 61.2);
  c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.22)';
  for (const x of [17, 40, 58, 77]) poly([[x, 78], [x + 3.2, 78], [x + 9, 61.2], [x + 5.8, 61.2]], c.fillStyle);
  // columns under the cantilever
  for (const x of [8, 88]) poly([[x - 0.5, 59], [x + 0.5, 59], [x + 0.5, 78.2], [x - 0.5, 78.2]], '#efebe3', INKC, 0.12);
  // upper floor: concrete band, timber fins over a ribbon window
  const roofU = (x) => 34.6 + 4.6 * (1 - Math.abs(x - 48) / 46);
  poly([[5, 56.4], [91, 56.4], [91, 59], [5, 59]], '#cfc7b8', INKC);
  poly([[5, roofU(5)], [48, roofU(48)], [91, roofU(91)], [91, 56.4], [5, 56.4]], '#9b6c43');
  c.fillStyle = grad(43, 52, [[0, '#f9e5bb'], [1, '#eec98f']]);
  c.fillRect(8, 43.5, 80, 8.4);
  for (let x = 8.6; x < 87.6; ) {
    const sw = 0.4 + rnd() * 0.5;
    const sh = 2 + rnd() * 1.6;
    c.fillStyle = pick(SPINES);
    c.fillRect(x, 51.9 - sh, sw, sh);
    x += sw + 0.07;
  }
  for (let x = 5.4; x < 91; x += 1.55) {
    const top = roofU(x) + 0.1;
    c.fillStyle = '#7c5434';
    c.fillRect(x + 0.62, top, 0.24, 56.4 - top);
    c.fillStyle = '#c3935f';
    c.fillRect(x, top, 0.62, 56.4 - top);
  }
  // the roof: a thin white slab folded like an open book, planted on top
  for (let i = 0; i < 26; i++) {
    const x = 6 + rnd() * 84;
    disc(x, roofU(x) - 2.9 - rnd() * 0.6, 0.7 + rnd() * 0.8, pick(['#7f8f6a', '#93a27c', '#6f7e5c']));
  }
  poly([[2, roofU(2) - 2.3], [48, roofU(48) - 2.3], [94, roofU(94) - 2.3], [94, roofU(94)], [48, roofU(48)], [2, roofU(2)]], '#f4f1ea', INKC, 0.16);
  c.strokeStyle = INKC;
  c.lineWidth = 0.16;
  c.strokeRect(5, roofU(91), 86, 59 - roofU(91));
  // forecourt: paving converging on the door, reflecting pool
  c.fillStyle = grad(GY, h, [[0, '#e3d9c6'], [1, '#d6c9b2']]);
  c.fillRect(0, GY, w, h - GY);
  c.strokeStyle = 'rgba(80,64,44,0.25)';
  c.lineWidth = 0.1;
  for (let i = -12; i <= 12; i++) {
    c.beginPath();
    c.moveTo(48 + i * 2.2, GY);
    c.lineTo(48 + i * 9, h);
    c.stroke();
  }
  for (let y = GY + 1.2, s = 1.2; y < h; s *= 1.25, y += s) {
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(w, y);
    c.stroke();
  }
  const py0 = 88;
  const py1 = 100;
  const m = c.getTransform();
  c.save();
  c.beginPath();
  c.rect(6, py0, 84, py1 - py0);
  c.clip();
  c.fillStyle = '#9cb0ad';
  c.fillRect(6, py0, 84, py1 - py0);
  // mirror the building into the water
  c.globalAlpha = 0.55;
  const k = 0.3; // squashed so the whole building fits the pool
  c.translate(0, py0 + k * GY);
  c.scale(1, -k);
  c.drawImage(c.canvas, m.e, m.f + m.d * 20, m.a * w, m.d * (GY - 20), 0, 20, w, GY - 20);
  c.restore();
  c.save();
  c.fillStyle = 'rgba(120,150,150,0.35)';
  c.fillRect(6, py0, 84, py1 - py0);
  c.strokeStyle = 'rgba(255,255,255,0.55)';
  c.lineWidth = 0.12;
  for (let i = 0; i < 26; i++) {
    const y = py0 + 0.6 + rnd() * (py1 - py0 - 1.2);
    const x = 8 + rnd() * 76;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + 2 + rnd() * 6, y);
    c.stroke();
  }
  c.restore();
  poly([[6, py0], [90, py0], [90, py1], [6, py1]], null, '#8c8274', 0.3);
  // visitors on the forecourt
  person(16, 86.5, 7.6, '#2f4763', '#25262a', { walk: true, skin: '#6f4a33', hair: '#141110' });
  person(78, 86, 7.4, '#c08a3a', '#3c3f46', { book: true, skin: '#e9c6a4', hair: '#5a3d2a', long: true });
  person(84, 86.3, 7.9, '#4c5e48', '#2c2a28', { coat: true, skin: '#d2a07c' });
  person(30, 108, 10.5, '#a4502f', '#2a2c33', { walk: true, skin: '#f1cfb2', hair: '#3a2a1c', long: true });
  person(64, 109, 11, '#e8e1d0', '#38404a', { coat: true, skin: '#8a5a3c', hair: '#18120f', book: true });
  // foreground trees framing the view
  const trunk = (x, y0, y1) => poly([[x - 0.5, y1], [x + 0.5, y1], [x + 0.25, y0], [x - 0.25, y0]], '#5b4532');
  trunk(3, 74, h);
  trunk(93, 70, h);
  crown(2, 70, 9, '#5f7050', '#7d8d64');
  crown(95, 66, 9, '#5f7050', '#7d8d64');
  // paper grain and a hairline frame
  for (let i = 0; i < 1400; i++) {
    c.fillStyle = rnd() < 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(60,40,20,0.08)';
    c.fillRect(rnd() * w, rnd() * h, 0.18, 0.18);
  }
  c.strokeStyle = INKC;
  c.lineWidth = 0.25;
  c.strokeRect(0.15, 0.15, w - 0.3, h - 0.3);
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
      else if (e.kind === 'after') drawAfter(ctx, e.id, lang, e.hits);
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
