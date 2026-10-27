import * as THREE from 'three';

// Every texture is painted into a <canvas> at runtime: no image downloads.

export function rng(seed = 1) {
  // mulberry32: small deterministic PRNG so the painted world is stable
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(w, h = w) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')];
}

function toTexture(c, { repeat = null, srgb = true } = {}) {
  const tex = new THREE.CanvasTexture(c);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
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
