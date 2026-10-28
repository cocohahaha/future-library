// Deterministic randomness and cheap noise, so the painted world is the same
// on every visit and every device.

export function rng(seed = 1) {
  // mulberry32
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// integer-lattice hash in [0, 1)
export function hash2(x, y) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const smooth = (t) => t * t * (3 - 2 * t);

// smooth value noise in [0, 1)
export function noise2(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const fx = smooth(x - xi);
  const fy = smooth(y - yi);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

// fractal sum in roughly [0, 1)
export function fbm2(x, y, octaves = 4, lacunarity = 2.03, gain = 0.5) {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += noise2(x, y) * amp;
    norm += amp;
    x = x * lacunarity + 17.3;
    y = y * lacunarity - 9.1;
    amp *= gain;
  }
  return sum / norm;
}

// ridged noise: sharp crests, good for mountain spines
export function ridged2(x, y, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    const n = 1 - Math.abs(noise2(x, y) * 2 - 1);
    sum += n * n * amp;
    norm += amp;
    x = x * 2.1 + 5.7;
    y = y * 2.1 - 3.3;
    amp *= 0.5;
  }
  return sum / norm;
}

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

// pick from an array with a random source
export const pick = (arr, r) => arr[Math.floor(r() * arr.length) % arr.length];
export const range = (r, a, b) => a + (b - a) * r();
