// Geometry of the book, in millimetres.
//
// Every leaf is a strip of paper hinged at the spine. Its cross-section is
// described by an angle function θ(s) along arc length s (0 at the spine,
// W at the fore-edge); positions come from integrating (cos θ, sin θ), so a
// page can bend but never stretch.
//
//  • A resting leaf leaves the spine at a root angle and eases to flat over
//    a bend length L. L and the root angle are solved so the page lands
//    exactly at the height of its stack (table lookup of ∫ sin(φ·g(u)) du).
//  • A turning leaf blends the right-hand and left-hand resting shapes and
//    adds a curl that lags in the first half of the turn and leads in the
//    second, a little more at the bottom corner (the one a reader lifts).
//    It is clamped between the two resting shapes so it never dips into a
//    stack.

export const W = 196; // page width
export const H = 256; // page height
export const BT = 2.6; // board thickness
export const OV = 3.5; // board overhang beyond the pages
export const LT = 0.42; // one paper leaf
export const F = 7; // front block: front matter that opens with the cover
export const BK = 7; // back block
export const NL = 6; // turnable paper leaves
export const JOINT = 3.5; // hinge groove between text block and board
export const YSP = 2.1; // height of the leaf roots on the open spine
export const T = F + BK + NL * LT; // text block thickness
export const XH = T / 2 + JOINT; // board hinge edge, measured from the centre
export const WB = W + OV - JOINT; // board width
export const HB = H + 2 * OV; // board height
export const PIVOT_Y = BT + T / 2; // the cover swings about (0, PIVOT_Y)

// arc-length samples along a leaf: dense near the gutter where it bends
export const NS = 48;
export const S = new Float32Array(NS + 1);
for (let k = 0; k <= NS; k++) {
  const f = k / NS;
  S[k] = W * (0.32 * f + 0.68 * f * f);
}

// angle falloff from the root (u = s / L)
const g = (u) => (u >= 1 ? 0 : 1 - u * u * (3 - 2 * u));

// I(φ) = ∫₀¹ sin(φ g(u)) du and J(φ) = ∫₀¹ cos(φ g(u)) du (Simpson)
const PHI_MAX = 1.48;
const TABLE = 128;
const IT = new Float32Array(TABLE + 1);
for (let i = 0; i <= TABLE; i++) {
  const phi = (PHI_MAX * i) / TABLE;
  const n = 64;
  let si = 0;
  for (let k = 0; k <= n; k++) {
    const w = k === 0 || k === n ? 1 : k % 2 ? 4 : 2;
    si += w * Math.sin(phi * g(k / n));
  }
  IT[i] = si / (3 * n);
}
function solvePhi(ratio) {
  if (ratio <= 0) return 0;
  if (ratio >= IT[TABLE]) return PHI_MAX;
  let lo = 0;
  let hi = TABLE;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (IT[mid] < ratio) lo = mid;
    else hi = mid;
  }
  const t = (ratio - IT[lo]) / (IT[hi] - IT[lo]);
  return (PHI_MAX * (lo + t)) / TABLE;
}

// Resting shape: a leaf rooted at height y0 that must lie flat at height yf.
// Fills theta[0..NS]; returns { L, phi }.
export function restingAngles(theta, y0, yf, open = 1) {
  const dy = (yf - y0) * open;
  const a = Math.abs(dy);
  let L = 5 + 1.05 * a;
  const maxRatio = IT[TABLE] * 0.97;
  if (a / L > maxRatio) L = a / maxRatio;
  const phi = Math.sign(dy) * solvePhi(a / L);
  for (let k = 0; k <= NS; k++) theta[k] = phi * g(S[k] / L);
  return { L, phi };
}

// integrate a sampled angle function from a root point into xs, ys
export function integrate(theta, x0, y0, xs, ys) {
  xs[0] = x0;
  ys[0] = y0;
  let c0 = Math.cos(theta[0]);
  let s0 = Math.sin(theta[0]);
  for (let k = 1; k <= NS; k++) {
    // midpoint angle of the segment keeps tight bends accurate
    const tm = 0.5 * (theta[k - 1] + theta[k]);
    const ds = S[k] - S[k - 1];
    const c1 = Math.cos(theta[k]);
    const s1 = Math.sin(theta[k]);
    xs[k] = xs[k - 1] + ds * (c0 + 4 * Math.cos(tm) + c1) / 6;
    ys[k] = ys[k - 1] + ds * (s0 + 4 * Math.sin(tm) + s1) / 6;
    c0 = c1;
    s0 = s1;
  }
}

// Turning leaf. thR / thL are the right- and left-resting angle functions
// (thL already flipped: values near π). e = blend 0..1, tau = turn phase,
// zn = row position along the page height (-0.5 head … +0.5 tail).
export function turningAngles(out, thR, thL, e, tau, zn, curl = 0.62, corner = 0.36) {
  const sw = Math.sin(2 * Math.PI * tau);
  // lag in the first half, lead in the second; the tail corner is the one
  // being lifted, so it lags less and then leads more
  const c = -curl * (sw - 2 * corner * zn * Math.abs(sw));
  for (let k = 0; k <= NS; k++) {
    const u = S[k] / W;
    let th = thR[k] + (thL[k] - thR[k]) * e + c * Math.pow(u, 1.5);
    if (th < thR[k]) th = thR[k];
    if (th > thL[k]) th = thL[k];
    out[k] = th;
  }
}

export const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeInOutQuad = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
