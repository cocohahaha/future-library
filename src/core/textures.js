import * as THREE from 'three';

// Every texture is painted into a <canvas> at runtime: no image downloads.

import { rng } from './rng.js';
export { rng };

function canvas(w, h = w) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')];
}

function toTexture(c, { repeat = null, srgb = true } = {}) {
  const tex = new THREE.CanvasTexture(c);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat, repeat);
  }
  return tex;
}

// paper fibres + soft mottling over a base colour
function paperGrain(g, w, h, rand, strength = 1) {
  for (let i = 0; i < (w * h) / 900; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 6 + rand() * 40;
    g.fillStyle = `rgba(${rand() < 0.5 ? '255,250,240' : '120,96,70'},${0.03 * strength})`;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  g.lineWidth = 1;
  for (let i = 0; i < (w * h) / 500; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const a = rand() * Math.PI;
    const l = 3 + rand() * 12;
    g.strokeStyle = `rgba(110,90,60,${0.06 * strength})`;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    g.stroke();
  }
}

// ---------------------------------------------------------------- courtyard paving
export function makePavingTexture(size = 1024) {
  const [c, g] = canvas(size);
  const rand = rng(7);
  g.fillStyle = '#b2a690'; // seam / mortar colour
  g.fillRect(0, 0, size, size);
  let y = 0;
  while (y < size) {
    const rh = size / (5 + Math.floor(rand() * 3));
    const h = Math.min(rh, size - y);
    let x = -rand() * 120;
    while (x < size) {
      const w = 110 + rand() * 190;
      const l = 74 + rand() * 4;
      const warm = rand() * 6;
      g.fillStyle = `hsl(${33 + warm}, ${15 + rand() * 6}%, ${l}%)`;
      g.fillRect(x + 1.5, y + 1.5, w - 3, h - 3);
      // weathering inside each slab
      for (let k = 0; k < 14; k++) {
        g.fillStyle = `rgba(${rand() < 0.5 ? '255,248,235' : '90,75,55'},0.035)`;
        g.beginPath();
        g.ellipse(x + rand() * w, y + rand() * h, 10 + rand() * 50, 6 + rand() * 30, rand() * 3, 0, Math.PI * 2);
        g.fill();
      }
      x += w;
    }
    y += h;
  }
  paperGrain(g, size, size, rand, 0.8);
  return toTexture(c, { repeat: 9 });
}

// ---------------------------------------------------------------- xuan paper
export function makePaperTexture(size = 256, tint = '#f1e8d8', seed = 3) {
  const [c, g] = canvas(size);
  g.fillStyle = tint;
  g.fillRect(0, 0, size, size);
  paperGrain(g, size, size, rng(seed), 1.4);
  return toTexture(c);
}

// ---------------------------------------------------------------- dry-brush stroke (u along stroke, v across)
export function makeBrushTexture(w = 1024, h = 128) {
  const [c, g] = canvas(w, h);
  const rand = rng(11);
  const img = g.createImageData(w, h);
  // each bristle is a row band that runs dry at its own point along the stroke
  const bristles = 48;
  const dryAt = Array.from({ length: bristles }, () => 0.55 + rand() * 0.5);
  const wob = Array.from({ length: bristles }, () => rand() * 10);
  for (let x = 0; x < w; x++) {
    const u = x / w;
    for (let y = 0; y < h; y++) {
      const v = y / h;
      const b = Math.min(bristles - 1, Math.floor(v * bristles));
      const edge = Math.min(v, 1 - v) * 2; // 0 at edges, 1 centre
      let a = Math.min(1, edge * 6);
      // flying-white (飞白): streaks open up toward the dry end
      const dry = THREE.MathUtils.smoothstep(u, dryAt[b] - 0.25, dryAt[b]);
      const streak = Math.sin(u * 80 + wob[b]) * 0.5 + 0.5;
      a *= 1 - dry * (0.55 + 0.45 * streak);
      // ragged edge
      a *= edge > 0.12 + rand() * 0.08 ? 1 : 0.4;
      const i = (y * w + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
      img.data[i + 3] = Math.max(0, Math.min(255, a * 255 * (0.85 + rand() * 0.15)));
    }
  }
  g.putImageData(img, 0, 0);
  return toTexture(c);
}

// ---------------------------------------------------------------- ginkgo leaf (white, tinted per instance)
export function makeLeafTexture(size = 64) {
  const [c, g] = canvas(size);
  g.translate(size / 2, size * 0.92);
  g.fillStyle = '#fff';
  g.beginPath();
  g.moveTo(0, 0);
  g.quadraticCurveTo(-size * 0.48, -size * 0.55, -size * 0.36, -size * 0.8);
  g.quadraticCurveTo(-size * 0.1, -size * 0.92, -size * 0.02, -size * 0.7);
  g.lineTo(size * 0.02, -size * 0.7);
  g.quadraticCurveTo(size * 0.1, -size * 0.92, size * 0.36, -size * 0.8);
  g.quadraticCurveTo(size * 0.48, -size * 0.55, 0, 0);
  g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.18)';
  g.lineWidth = 1;
  for (let i = -3; i <= 3; i++) {
    g.beginPath();
    g.moveTo(0, -2);
    g.lineTo(i * size * 0.09, -size * 0.75);
    g.stroke();
  }
  return toTexture(c);
}

// ---------------------------------------------------------------- ink-wash mountain band (white, alpha fades into mist)
export function makeMountainTexture({ seed = 1, peaks = 9, roughness = 0.35, w = 2048, h = 512 } = {}) {
  const [c, g] = canvas(w, h);
  const rand = rng(seed);
  const harmonics = Array.from({ length: 6 }, (_, i) => ({
    f: (i + 1) * peaks * (0.6 + rand() * 0.8),
    p: rand() * Math.PI * 2,
    a: Math.pow(roughness, i) * (0.6 + rand() * 0.6)
  }));
  // integer frequencies keep the band seamless around the cylinder
  for (const hm of harmonics) hm.f = Math.max(1, Math.round(hm.f));
  const ridge = (u) => {
    let s = 0;
    for (const hm of harmonics) s += Math.sin(u * Math.PI * 2 * hm.f + hm.p) * hm.a;
    return s;
  };
  g.beginPath();
  g.moveTo(0, h);
  for (let x = 0; x <= w; x += 4) {
    const y = h * (0.42 - ridge(x / w) * 0.22);
    g.lineTo(x, y);
  }
  g.lineTo(w, h);
  g.closePath();
  const grd = g.createLinearGradient(0, h * 0.1, 0, h);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.45, 'rgba(255,255,255,0.75)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fill();
  // drifting mist bands cut across the slopes
  g.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 14; i++) {
    const y = h * (0.5 + rand() * 0.4);
    const mg = g.createLinearGradient(0, y - 30, 0, y + 30);
    mg.addColorStop(0, 'rgba(0,0,0,0)');
    mg.addColorStop(0.5, `rgba(0,0,0,${0.25 + rand() * 0.3})`);
    mg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = mg;
    g.fillRect(rand() * w * 0.8 - w * 0.2, y - 30, w * (0.3 + rand() * 0.5), 60);
  }
  return toTexture(c);
}

// ---------------------------------------------------------------- shoji lattice: paper + wooden muntins
export function makeLatticeTexture(w = 512, h = 512) {
  const [c, g] = canvas(w, h);
  g.fillStyle = '#f4ead6';
  g.fillRect(0, 0, w, h);
  paperGrain(g, w, h, rng(5), 1.2);
  g.fillStyle = '#6b4a33';
  const cols = 4;
  const rows = 6;
  for (let i = 0; i <= cols; i++) g.fillRect((i / cols) * w - 5, 0, 10, h);
  for (let j = 0; j <= rows; j++) g.fillRect(0, (j / rows) * h - 4, w, 8);
  return toTexture(c);
}

// ---------------------------------------------------------------- landscape painting for the folding screen
export function makeScreenPainting(w = 1024, h = 384) {
  const [c, g] = canvas(w, h);
  g.fillStyle = '#efe4cf';
  g.fillRect(0, 0, w, h);
  paperGrain(g, w, h, rng(21), 1.2);
  const layers = [
    { seed: 4, tone: 'rgba(60,58,56,0.25)', base: 0.55, amp: 0.25 },
    { seed: 9, tone: 'rgba(40,38,36,0.45)', base: 0.7, amp: 0.22 },
    { seed: 2, tone: 'rgba(30,28,26,0.7)', base: 0.88, amp: 0.14 }
  ];
  for (const L of layers) {
    const rand = rng(L.seed);
    const f = [2 + rand() * 3, 5 + rand() * 6, 13 + rand() * 9];
    const p = f.map(() => rand() * 6);
    g.beginPath();
    g.moveTo(0, h);
    for (let x = 0; x <= w; x += 4) {
      const u = x / w;
      const r = Math.sin(u * f[0] + p[0]) * 0.6 + Math.sin(u * f[1] + p[1]) * 0.3 + Math.sin(u * f[2] + p[2]) * 0.1;
      g.lineTo(x, h * (L.base - r * L.amp));
    }
    g.lineTo(w, h);
    const grd = g.createLinearGradient(0, h * 0.2, 0, h);
    grd.addColorStop(0, L.tone);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fill();
  }
  // a red sun and a seal
  g.fillStyle = 'rgba(176,67,44,0.75)';
  g.beginPath();
  g.arc(w * 0.78, h * 0.22, h * 0.07, 0, Math.PI * 2);
  g.fill();
  g.fillRect(w * 0.06, h * 0.1, h * 0.07, h * 0.07);
  return toTexture(c);
}

// ---------------------------------------------------------------- roof tile channels
export function makeTileTexture(w = 256, h = 256) {
  const [c, g] = canvas(w, h);
  g.fillStyle = '#56534f';
  g.fillRect(0, 0, w, h);
  const n = 16;
  for (let i = 0; i < n; i++) {
    const x = (i / n) * w;
    const grd = g.createLinearGradient(x, 0, x + w / n, 0);
    grd.addColorStop(0, 'rgba(0,0,0,0.35)');
    grd.addColorStop(0.5, 'rgba(255,255,255,0.12)');
    grd.addColorStop(1, 'rgba(0,0,0,0.35)');
    g.fillStyle = grd;
    g.fillRect(x, 0, w / n, h);
  }
  for (let j = 0; j < 12; j++) {
    g.fillStyle = 'rgba(0,0,0,0.18)';
    g.fillRect(0, (j / 12) * h, w, 2);
  }
  return toTexture(c, { repeat: 1 });
}

// ---------------------------------------------------------------- soft ink ring (used for ripples across the paving)
export function makeInkRingTexture(size = 256) {
  const [c, g] = canvas(size);
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, 'rgba(255,255,255,0)');
  grd.addColorStop(0.72, 'rgba(255,255,255,0)');
  grd.addColorStop(0.88, 'rgba(255,255,255,0.9)');
  grd.addColorStop(0.94, 'rgba(255,255,255,0.35)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  return toTexture(c);
}

// small paper slip with a few lines of "handwriting"
export function makeSlipTexture(w = 128, h = 192) {
  const [c, g] = canvas(w, h);
  g.fillStyle = '#f6eedf';
  g.fillRect(0, 0, w, h);
  paperGrain(g, w, h, rng(17), 1.5);
  const rand = rng(31);
  g.strokeStyle = 'rgba(36,32,29,0.75)';
  g.lineCap = 'round';
  for (let col = 0; col < 3; col++) {
    // vertical columns of brush marks, read top to bottom
    const x = w * (0.72 - col * 0.24);
    let y = h * 0.12;
    while (y < h * (0.6 + rand() * 0.3)) {
      g.lineWidth = 3 + rand() * 3;
      g.beginPath();
      g.moveTo(x - 6 + rand() * 4, y);
      g.lineTo(x + 6 - rand() * 4, y + 6 + rand() * 8);
      g.stroke();
      y += 16 + rand() * 6;
    }
  }
  g.fillStyle = '#b0432c';
  g.fillRect(w * 0.12, h * 0.8, 16, 16);
  return toTexture(c);
}


// ---------------------------------------------------------------- lattice atlas (4 patterns, data texture)
// R = paper mask (1 paper / 0 wood), G = paper fibre variation, B = wood grain.
// Each 512² cell tiles seamlessly; one tile spans 0.62 m in the world.
// UV layout (flipY): cell 0 bottom-left, 1 bottom-right, 2 top-left, 3 top-right.
export function makeLatticeAtlas(size = 1024) {
  const [c, g] = canvas(size);
  const half = size / 2;
  const rand = rng(41);
  const cells = [
    [0, half],
    [half, half],
    [0, 0],
    [half, 0]
  ];
  // base: paper everywhere (R=255), fibre noise in G, grain in B
  const img = g.createImageData(size, size);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      img.data[i] = 255;
      img.data[i + 1] = 110 + Math.floor(rand() * 60 + 50 * Math.sin(x * 0.07 + y * 0.013) * Math.sin(y * 0.05));
      img.data[i + 2] = 128 + Math.floor(60 * Math.sin(x * 0.9 + Math.sin(y * 0.05) * 3) * 0.5 + rand() * 30);
      img.data[i + 3] = 255;
    }
  g.putImageData(img, 0, 0);
  // wood bars: R = 0 (keep G/B as grain): draw in rgb(0,128,160)
  const bar = 'rgb(0,128,150)';
  const S = half;
  const wrapLine = (ox, oy, x0, y0, x1, y1, w) => {
    g.save();
    g.beginPath();
    g.rect(ox, oy, S, S);
    g.clip();
    g.strokeStyle = bar;
    g.lineWidth = w;
    g.lineCap = 'square';
    for (const dx of [-S, 0, S])
      for (const dy of [-S, 0, S]) {
        g.beginPath();
        g.moveTo(ox + x0 + dx, oy + y0 + dy);
        g.lineTo(ox + x1 + dx, oy + y1 + dy);
        g.stroke();
      }
    g.restore();
  };
  // 0: square grid (方格) with a finer secondary grid
  {
    const [ox, oy] = cells[0];
    for (let k = 0; k < 4; k++) {
      const p = (k / 4) * S;
      wrapLine(ox, oy, p, 0, p, S, 16);
      wrapLine(ox, oy, 0, p, S, p, 16);
    }
    for (let k = 0; k < 4; k++) {
      const p = ((k + 0.5) / 4) * S;
      wrapLine(ox, oy, p, 0, p, S, 6);
    }
  }
  // 1: ice-crack (冰裂纹): polygons from recursive straight splits, in a frame
  {
    const [ox, oy] = cells[1];
    const m = 20;
    let polys = [[[m, m], [S - m, m], [S - m, S - m], [m, S - m]]];
    const split = (poly) => {
      // cut the polygon with a random line through its centroid
      const cx = poly.reduce((a, p) => a + p[0], 0) / poly.length;
      const cy = poly.reduce((a, p) => a + p[1], 0) / poly.length;
      const ang = rand() * Math.PI;
      const dx = Math.cos(ang);
      const dy = Math.sin(ang);
      const side = (p) => (p[0] - cx) * dy - (p[1] - cy) * dx;
      const A = [];
      const Bp = [];
      for (let i = 0; i < poly.length; i++) {
        const p = poly[i];
        const q = poly[(i + 1) % poly.length];
        const sp = side(p);
        const sq = side(q);
        (sp >= 0 ? A : Bp).push(p);
        if (sp * sq < 0) {
          const t = sp / (sp - sq);
          const ip = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
          A.push(ip);
          Bp.push(ip);
        }
      }
      return [A, Bp].filter((pp) => pp.length >= 3);
    };
    for (let it = 0; it < 4; it++) polys = polys.flatMap((pp) => (rand() < 0.92 ? split(pp) : [pp]));
    g.save();
    g.beginPath();
    g.rect(ox, oy, S, S);
    g.clip();
    g.strokeStyle = bar;
    g.lineJoin = 'miter';
    g.lineWidth = 12;
    for (const pp of polys) {
      g.beginPath();
      pp.forEach(([x, y], i) => (i ? g.lineTo(ox + x, oy + y) : g.moveTo(ox + x, oy + y)));
      g.closePath();
      g.stroke();
    }
    g.lineWidth = 2 * m;
    g.strokeRect(ox, oy, S, S);
    g.restore();
  }
  // 2: step-brocade (步步锦) — interlocking short bars
  {
    const [ox, oy] = cells[2];
    const q = S / 4;
    wrapLine(ox, oy, 0, 0, S, 0, 14);
    wrapLine(ox, oy, 0, 0, 0, S, 14);
    wrapLine(ox, oy, 0, S / 2, S, S / 2, 12);
    wrapLine(ox, oy, S / 2, 0, S / 2, S, 12);
    for (const [x0, y0, x1, y1] of [
      [q, q * 0.5, q, q * 1.5],
      [q * 3, q * 0.5, q * 3, q * 1.5],
      [q * 0.5, q * 3, q * 1.5, q * 3],
      [q * 2.5, q * 3, q * 3.5, q * 3],
      [q * 0.6, q, q * 1.6, q],
      [q * 2.4, q * 3, q * 2.4, q * 3.6]
    ])
      wrapLine(ox, oy, x0, y0, x1, y1, 11);
  }
  // 3: meander fretwork (回纹) for hanging friezes and railings
  {
    const [ox, oy] = cells[3];
    const u = S / 8;
    const path = [
      [0, 6],
      [6, 6],
      [6, 2],
      [2, 2],
      [2, 4],
      [4, 4]
    ];
    for (let i = 0; i < path.length - 1; i++) wrapLine(ox, oy, path[i][0] * u, path[i][1] * u, path[i + 1][0] * u, path[i + 1][1] * u, 12);
    wrapLine(ox, oy, 0, 7.5 * u, S, 7.5 * u, 10);
    wrapLine(ox, oy, 0, 0.5 * u, S, 0.5 * u, 10);
    wrapLine(ox, oy, 8 * u - 1, 0.5 * u, 8 * u - 1, 7.5 * u, 10);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = 8;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  return tex;
}

// text on a board: plaques (匾额) and couplets (对联)
export function makeTextBoard(text, { w = 512, h = 160, vertical = false, bg = '#2a1a12', fg = '#d8b25a', border = '#c9a24c', font = '"Noto Serif SC","Songti SC",STSong,"SimSun",serif', weight = 700 } = {}) {
  const [c, g] = canvas(w, h);
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  const rand = rng(text.length * 13 + 7);
  for (let i = 0; i < 160; i++) {
    g.fillStyle = `rgba(${rand() < 0.5 ? '255,230,200' : '0,0,0'},0.04)`;
    g.fillRect(rand() * w, rand() * h, 2 + rand() * 40, 1 + rand() * 3);
  }
  g.strokeStyle = border;
  g.lineWidth = Math.max(4, Math.min(w, h) * 0.05);
  g.strokeRect(g.lineWidth, g.lineWidth, w - g.lineWidth * 2, h - g.lineWidth * 2);
  g.fillStyle = fg;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const chars = [...text];
  if (vertical) {
    const step = (h * 0.86) / chars.length;
    g.font = `${weight} ${Math.min(w * 0.62, step * 0.86)}px ${font}`;
    chars.forEach((ch, i) => g.fillText(ch, w / 2, h * 0.07 + step * (i + 0.5)));
  } else {
    const step = (w * 0.84) / chars.length;
    g.font = `${weight} ${Math.min(h * 0.62, step * 0.9)}px ${font}`;
    chars.forEach((ch, i) => g.fillText(ch, w * 0.08 + step * (i + 0.5), h / 2 + 2));
  }
  return toTexture(c);
}

// ---------------------------------------------------------------- foliage atlases (RGBA DataTextures, no premultiply fringes)
// Paint colour on an opaque canvas and the alpha mask on a second one, then
// combine into raw RGBA so transparent texels keep a sensible colour.
function combineRGBA(colorCanvas, maskCanvas) {
  const w = colorCanvas.width;
  const h = colorCanvas.height;
  const c = colorCanvas.getContext('2d').getImageData(0, 0, w, h).data;
  const m = maskCanvas.getContext('2d').getImageData(0, 0, w, h).data;
  const out = new Uint8Array(w * h * 4);
  // canvas rows go top→bottom; flip so v=0 is the bottom like other textures
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const si = (y * w + x) * 4;
      const di = ((h - 1 - y) * w + x) * 4;
      out[di] = c[si];
      out[di + 1] = c[si + 1];
      out[di + 2] = c[si + 2];
      out[di + 3] = m[si];
    }
  const tex = new THREE.DataTexture(out, w, h, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

// 2×2 atlas of leaf clusters: 0 broadleaf, 1 ginkgo fans, 2 pine needle tufts, 3 maple stars.
// Cells (UV): 0 = (0,0) bottom-left, 1 = (0.5,0), 2 = (0,0.5), 3 = (0.5,0.5)
export function makeLeafAtlas(size = 512) {
  const [cc, cg] = canvas(size);
  const [mc, mg] = canvas(size);
  cg.fillStyle = '#d8d8d0';
  cg.fillRect(0, 0, size, size);
  mg.fillStyle = '#000';
  mg.fillRect(0, 0, size, size);
  const half = size / 2;
  const rand = rng(61);
  // canvas-space cell origins (top-left), matching the flipped UV layout
  const cells = [
    [0, half],
    [half, half],
    [0, 0],
    [half, 0]
  ];
  const leaf = (g, kind, x, y, s, a, fill) => {
    g.save();
    g.translate(x, y);
    g.rotate(a);
    g.fillStyle = fill;
    g.beginPath();
    if (kind === 0) {
      g.moveTo(0, 0);
      g.quadraticCurveTo(s * 0.42, -s * 0.45, 0, -s);
      g.quadraticCurveTo(-s * 0.42, -s * 0.45, 0, 0);
    } else if (kind === 1) {
      g.moveTo(0, 0);
      g.lineTo(-s * 0.08, -s * 0.35);
      g.quadraticCurveTo(-s * 0.62, -s * 0.62, -s * 0.42, -s * 0.95);
      g.quadraticCurveTo(0, -s * 1.1, s * 0.42, -s * 0.95);
      g.quadraticCurveTo(s * 0.62, -s * 0.62, s * 0.08, -s * 0.35);
      g.closePath();
    } else if (kind === 3) {
      for (let k = 0; k < 5; k++) {
        const aa = -Math.PI / 2 + ((k - 2) / 2) * 1.1;
        const r = k === 2 ? s : s * 0.8;
        g.lineTo(Math.cos(aa) * r, Math.sin(aa) * r);
        g.lineTo(Math.cos(aa + 0.28) * r * 0.42, Math.sin(aa + 0.28) * r * 0.42);
      }
      g.lineTo(0, 0);
    }
    g.fill();
    g.restore();
  };
  for (let cell = 0; cell < 4; cell++) {
    const [ox, oy] = cells[cell];
    const cx = ox + half / 2;
    const cy = oy + half / 2;
    const R = half * 0.42;
    if (cell === 2) {
      // pine: radiating needle tufts
      for (let t = 0; t < 26; t++) {
        const a0 = rand() * Math.PI * 2;
        const rr = Math.sqrt(rand()) * R * 0.75;
        const tx = cx + Math.cos(a0) * rr;
        const ty = cy + Math.sin(a0) * rr;
        for (let k = 0; k < 16; k++) {
          const a = rand() * Math.PI * 2;
          const l = half * (0.06 + rand() * 0.06);
          const shade = 170 + Math.floor(rand() * 85);
          for (const [g, col] of [
            [cg, `rgb(${shade},${shade},${shade - 8})`],
            [mg, '#fff']
          ]) {
            g.strokeStyle = col;
            g.lineWidth = 2;
            g.beginPath();
            g.moveTo(tx, ty);
            g.lineTo(tx + Math.cos(a) * l, ty + Math.sin(a) * l);
            g.stroke();
          }
        }
      }
      continue;
    }
    const kind = cell === 0 ? 0 : cell === 1 ? 1 : 3;
    const n = kind === 0 ? 60 : kind === 1 ? 46 : 40;
    for (let k = 0; k < n; k++) {
      const a0 = rand() * Math.PI * 2;
      const rr = Math.sqrt(rand()) * R;
      const x = cx + Math.cos(a0) * rr;
      const y = cy + Math.sin(a0) * rr;
      const s = half * (kind === 0 ? 0.13 : 0.12) * (0.75 + rand() * 0.5);
      const a = a0 + Math.PI / 2 + (rand() - 0.5) * 1.2;
      const shade = 196 + Math.floor(rand() * 59);
      leaf(cg, kind, x, y, s, a, `rgb(${shade},${shade},${shade - 6})`);
      leaf(mg, kind, x, y, s, a, '#fff');
    }
  }
  return combineRGBA(cc, mc);
}

// 2×2 atlas of ink-wash tree silhouettes for distant forests (点叶法):
// 0 layered pine, 1 round broadleaf of ink dots, 2 tall cypress, 3 sparse autumn tree
export function makeInkTreeAtlas(size = 512) {
  const [cc, cg] = canvas(size);
  const [mc, mg] = canvas(size);
  cg.fillStyle = '#808080';
  cg.fillRect(0, 0, size, size);
  mg.fillStyle = '#000';
  mg.fillRect(0, 0, size, size);
  const half = size / 2;
  const rand = rng(83);
  const cells = [
    [0, half],
    [half, half],
    [0, 0],
    [half, 0]
  ];
  const dot = (x, y, rx, ry, a, shade) => {
    for (const [g, col] of [
      [cg, `rgb(${shade},${shade},${shade})`],
      [mg, '#fff']
    ]) {
      g.fillStyle = col;
      g.beginPath();
      g.ellipse(x, y, rx, ry, a, 0, Math.PI * 2);
      g.fill();
    }
  };
  const trunk = (x0, y0, x1, y1, w) => {
    for (const [g, col] of [
      [cg, 'rgb(60,56,52)'],
      [mg, '#fff']
    ]) {
      g.strokeStyle = col;
      g.lineWidth = w;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(x0, y0);
      g.quadraticCurveTo((x0 + x1) / 2 + (rand() - 0.5) * 8, (y0 + y1) / 2, x1, y1);
      g.stroke();
    }
  };
  for (let cell = 0; cell < 4; cell++) {
    const [ox, oy] = cells[cell];
    const bx = ox + half / 2;
    const by = oy + half - 4;
    if (cell === 0) {
      trunk(bx, by, bx + 4, oy + half * 0.15, 6);
      for (let t = 0; t < 6; t++) {
        const ty = oy + half * (0.2 + t * 0.12);
        const w = half * (0.16 + t * 0.045);
        for (let k = 0; k < 22; k++) dot(bx + (rand() - 0.5) * w * 2, ty + (rand() - 0.5) * half * 0.05, 6 + rand() * 7, 3 + rand() * 3, (rand() - 0.5) * 0.4, 100 + Math.floor(rand() * 90));
      }
    } else if (cell === 1) {
      trunk(bx, by, bx - 3, oy + half * 0.5, 7);
      for (let k = 0; k < 150; k++) {
        const a = rand() * Math.PI * 2;
        const r = Math.sqrt(rand()) * half * 0.36;
        dot(bx + Math.cos(a) * r, oy + half * 0.4 + Math.sin(a) * r * 0.8, 5 + rand() * 6, 5 + rand() * 6, 0, 110 + Math.floor(rand() * 110));
      }
    } else if (cell === 2) {
      trunk(bx, by, bx, oy + half * 0.1, 5);
      for (let k = 0; k < 120; k++) {
        const t = rand();
        const w = half * 0.13 * (1 - t * 0.8);
        dot(bx + (rand() - 0.5) * w * 2, oy + half * (0.08 + t * 0.78), 4 + rand() * 4, 6 + rand() * 6, 0, 90 + Math.floor(rand() * 90));
      }
    } else {
      trunk(bx, by, bx + 6, oy + half * 0.35, 6);
      trunk(bx + 2, oy + half * 0.6, bx - half * 0.2, oy + half * 0.3, 3);
      trunk(bx + 3, oy + half * 0.55, bx + half * 0.22, oy + half * 0.25, 3);
      for (let k = 0; k < 90; k++) {
        const a = rand() * Math.PI * 2;
        const r = Math.sqrt(rand()) * half * 0.34;
        dot(bx + Math.cos(a) * r, oy + half * 0.36 + Math.sin(a) * r * 0.75, 3 + rand() * 5, 3 + rand() * 5, 0, 120 + Math.floor(rand() * 120));
      }
    }
  }
  return combineRGBA(cc, mc);
}
