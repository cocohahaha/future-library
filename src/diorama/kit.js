import { Group, Mesh, InstancedMesh, MeshStandardMaterial, MeshPhysicalMaterial, CanvasTexture, RepeatWrapping, SRGBColorSpace, Color, Matrix4, Euler, Quaternion, Vector3, BufferGeometry, Float32BufferAttribute, Uint16BufferAttribute } from 'three';
import { roundBox, cylinder, sphere, lathe, tube, xf, tint, merge, Mesher } from '../core/geo.js';

// Model-making kit for the miniatures, in metres (the plates scale them by
// 25 for 1:40). A Part collects geometry by material key and merges each key
// into one mesh, so a whole furniture cluster costs a few draw calls; books
// and archive boxes on its shelves become one instanced mesh per part.

export const Y0 = 0.12; // floor level: top of the plinth

export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// sRGB palette
export const C = {
  oak: 0xdcc4a0,
  ash: 0xe8dcc6,
  walnut: 0x6b4a34,
  concrete: 0xcdc9c1,
  concreteDk: 0xaaa69e,
  terrazzo: 0xece7dd,
  steel: 0x2a2b2d,
  brass: 0xc9a35c,
  paper: 0xf4efe4,
  cork: 0xb98f5f,
  red: 0xb0452f,
  linen: 0xe9e1d0,
  pot: 0xb46b4d,
  felt: [0x6f806c, 0xa0604a, 0x45556c, 0xc7a85e, 0x8c9095, 0x7b5560, 0x5d6f78]
};
const SPINES = [0xe8dfc9, 0x6f2b25, 0x27344e, 0x2f4b3b, 0xc29b4c, 0x8f8d88, 0x242424, 0xf1eee6, 0xa4502f, 0x2f6f73, 0xcdb48c, 0x6c8098, 0x8a6b72, 0x4a3b2f];
const BOXES = [0xc4a67c, 0xb89a70, 0x9a9890, 0xd8cfbd, 0x5d6066];

export const shade = (hex, k) => new Color(hex).multiplyScalar(k).getHex();

// ---------------------------------------------------------------- materials
let M = null;
function canvasTex(rep, draw, n = 256) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = c.height = n;
  const g = c.getContext('2d');
  g.fillStyle = '#fff';
  g.fillRect(0, 0, n, n);
  draw(g, n, rng(n + rep * 97));
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(rep, rep);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
function grainLines(g, n, r, y0, h, k) {
  for (let i = 0; i < k; i++) {
    const y = y0 + r() * h;
    const a = r() * 6;
    g.strokeStyle = `rgba(110,72,38,${0.05 + r() * 0.1})`;
    g.lineWidth = 0.4 + r() * 1.4;
    g.beginPath();
    for (let x = 0; x <= n; x += 8) g.lineTo(x, y + Math.sin((x / n) * Math.PI * 2 + a) * 2.5);
    g.stroke();
  }
}

export function mats() {
  if (M) return M;
  const grain = canvasTex(2.2, (g, n, r) => grainLines(g, n, r, 0, n, 60));
  const planks = canvasTex(0.78, (g, n, r) => {
    const rows = 8;
    const h = n / rows;
    for (let j = 0; j < rows; j++) {
      let x = -r() * n;
      while (x < n) {
        const len = n * (0.45 + r() * 0.6);
        g.fillStyle = `rgba(150,105,60,${r() * 0.12})`;
        g.fillRect(x, j * h, len, h);
        g.fillStyle = 'rgba(70,45,25,0.5)';
        g.fillRect(x, j * h, 1, h);
        x += len;
      }
      g.fillStyle = 'rgba(70,45,25,0.45)';
      g.fillRect(0, j * h, n, 1);
      grainLines(g, n, r, j * h + 2, h - 4, 7);
    }
  });
  const conc = canvasTex(0.85, (g, n, r) => {
    for (let j = 0; j < 4; j++) {
      g.fillStyle = `rgba(90,88,84,${0.03 + r() * 0.06})`;
      g.fillRect(0, (j * n) / 4, n, n / 4);
      g.fillStyle = 'rgba(70,68,64,0.18)';
      g.fillRect(0, (j * n) / 4, n, 1);
      for (let i = 0; i < 4; i++) {
        g.fillStyle = 'rgba(50,48,45,0.35)';
        g.beginPath();
        g.arc(((i + 0.5) * n) / 4, ((j + 0.5) * n) / 4, 1.6, 0, 7);
        g.fill();
      }
    }
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = `rgba(60,58,55,${r() * 0.12})`;
      g.fillRect(r() * n, r() * n, 1 + r() * 2, 1 + r() * 2);
    }
  });
  const terr = canvasTex(1, (g, n, r) => {
    const cols = ['#8f8a84', '#bdb3a3', '#7a6c5e', '#b8714f', '#d6cfc0', '#5c5853', '#9fa59a'];
    for (let i = 0; i < 1100; i++) {
      g.fillStyle = cols[(r() * cols.length) | 0];
      g.globalAlpha = 0.5 + r() * 0.5;
      g.beginPath();
      g.ellipse(r() * n, r() * n, 0.6 + r() * 1.8, 0.5 + r() * 1.4, r() * 3, 0, 7);
      g.fill();
    }
    g.globalAlpha = 1;
  });
  const std = (o) => new MeshStandardMaterial({ vertexColors: true, roughness: 0.82, ...o });
  M = {
    solid: std({}),
    felt: std({ roughness: 0.97 }),
    glaze: std({ roughness: 0.16 }),
    wood: std({ roughness: 0.62, map: grain }),
    planks: std({ roughness: 0.55, map: planks }),
    concrete: std({ roughness: 0.92, map: conc }),
    floor: std({ roughness: 0.38, map: terr }),
    metal: std({ roughness: 0.32, metalness: 0.85 }),
    glass: new MeshPhysicalMaterial({ color: 0xe2eeeb, transparent: true, opacity: 0.2, roughness: 0.04, metalness: 0, envMapIntensity: 1.5, depthWrite: false }),
    glow: new MeshStandardMaterial({ color: 0xfff4e0, emissive: 0xffd9a0, emissiveIntensity: 2.6, roughness: 0.5 }),
    shade: new MeshStandardMaterial({ color: 0xf2e5cc, emissive: 0xffc98a, emissiveIntensity: 0.85, roughness: 0.9 }),
    water: new MeshStandardMaterial({ color: 0x1c2a2c, roughness: 0.03, metalness: 0.2, envMapIntensity: 1.8 }),
    books: bookMat()
  };
  return M;
}

// Books: instance colour on the boards and spine (with two lighter bands, a
// title label), paper on the top and fore-edge.
function bookMat() {
  const m = new MeshStandardMaterial({ roughness: 0.74 });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aPaper;')
      .replace('#include <color_vertex>', '#include <color_vertex>\n#ifdef USE_INSTANCING_COLOR\nvColor.rgb = mix( vColor.rgb, vec3( 0.80, 0.74, 0.62 ), aPaper );\n#endif');
  };
  m.customProgramCacheKey = () => 'loq-books';
  return m;
}
let BG = null;
function bookGeo() {
  if (BG) return BG;
  const p = [];
  const n = [];
  const a = [];
  const idx = [];
  const quad = (vs, nn, mix) => {
    const b = p.length / 3;
    for (const v of vs) p.push(...v), n.push(...nn), a.push(mix);
    idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
  };
  const ys = [0, 0.07, 0.1, 0.74, 0.84, 0.92, 0.95, 1];
  const mx = [0, 0.45, 0, 0.6, 0, 0.45, 0];
  for (let i = 0; i < 7; i++)
    quad(
      [
        [-0.5, ys[i], 0.5],
        [0.5, ys[i], 0.5],
        [0.5, ys[i + 1], 0.5],
        [-0.5, ys[i + 1], 0.5]
      ],
      [0, 0, 1],
      mx[i]
    );
  quad([[0.5, 0, -0.5], [-0.5, 0, -0.5], [-0.5, 1, -0.5], [0.5, 1, -0.5]], [0, 0, -1], 1);
  quad([[-0.5, 1, 0.5], [0.5, 1, 0.5], [0.5, 1, -0.5], [-0.5, 1, -0.5]], [0, 1, 0], 0.92);
  quad([[0.5, 0, 0.5], [0.5, 0, -0.5], [0.5, 1, -0.5], [0.5, 1, 0.5]], [1, 0, 0], 0);
  quad([[-0.5, 0, -0.5], [-0.5, 0, 0.5], [-0.5, 1, 0.5], [-0.5, 1, -0.5]], [-1, 0, 0], 0);
  BG = new BufferGeometry();
  BG.setAttribute('position', new Float32BufferAttribute(p, 3));
  BG.setAttribute('normal', new Float32BufferAttribute(n, 3));
  BG.setAttribute('aPaper', new Float32BufferAttribute(a, 1));
  BG.setIndex(new Uint16BufferAttribute(idx, 1));
  return BG;
}

// ---------------------------------------------------------------- part
const _q = new Quaternion();
const _e = new Euler();
const _v = new Vector3();
const _s = new Vector3();
export class Part {
  constructor() {
    this.g = {};
    this.kids = [];
    this.bk = [];
    this.lamps = [];
    this.T = null;
  }
  add(k, geo, c = 0xffffff) {
    if (this.T) geo.applyMatrix4(this.T);
    (this.g[k] ||= []).push(tint(geo, c));
    return geo;
  }
  // box standing on y (bottom face at y); r = chamfer
  box(k, c, w, h, d, x = 0, y = 0, z = 0, r = 0, rot = null) {
    return this.add(k, xf(roundBox(w, h, d, r, r ? 1 : 0), { t: [x, y + h / 2, z], r: rot || [0, 0, 0] }), c);
  }
  cyl(k, c, r, h, x = 0, y = 0, z = 0, seg = 16, rTop = r) {
    return this.add(k, xf(cylinder(r, h, seg, { rTop }), { t: [x, y, z] }), c);
  }
  rod(k, c, pts, r = 0.01, seg = 6) {
    return this.add(k, tube(pts.map((q) => new Vector3(...q)), r, seg), c);
  }
  // a separate (animatable) mesh
  mesh(k, geo, c = 0xffffff) {
    if (this.T) geo.applyMatrix4(this.T);
    const m = new Mesh(tint(geo, c), mats()[k]);
    m.castShadow = m.receiveShadow = true;
    this.kids.push(m);
    return m;
  }
  book(x, y, z, w, h, d, rz, col) {
    _e.set(0, 0, rz);
    _q.setFromEuler(_e);
    const m = new Matrix4().compose(_v.set(x, y, z), _q, _s.set(w, h, d));
    if (this.T) m.premultiply(this.T);
    this.bk.push(m, col);
  }
  lamp(x, y, z, color = 0xffd9a0, intensity = 1) {
    const p = new Vector3(x, y, z);
    if (this.T) p.applyMatrix4(this.T);
    this.lamps.push({ p, color, intensity });
  }
  // run fn with geometry placed at (x, y, z) turned ry about y
  at(x, z, ry, fn, y = 0) {
    const prev = this.T;
    _e.set(0, ry, 0);
    const m = new Matrix4().compose(new Vector3(x, y, z), new Quaternion().setFromEuler(_e), new Vector3(1, 1, 1));
    this.T = prev ? prev.clone().multiply(m) : m;
    fn();
    this.T = prev;
  }
  build(x = 0, z = 0, ry = 0, y = Y0) {
    const G = new Group();
    const m = mats();
    for (const k in this.g) {
      const mesh = new Mesh(merge(this.g[k]), m[k]);
      mesh.castShadow = k !== 'glass';
      mesh.receiveShadow = k !== 'glow';
      G.add(mesh);
    }
    if (this.bk.length) {
      const n = this.bk.length / 2;
      const im = new InstancedMesh(bookGeo(), m.books, n);
      for (let i = 0; i < n; i++) {
        im.setMatrixAt(i, this.bk[i * 2]);
        im.setColorAt(i, this.bk[i * 2 + 1]);
      }
      im.castShadow = im.receiveShadow = true;
      im.computeBoundingSphere();
      G.add(im);
    }
    for (const k of this.kids) G.add(k);
    G.position.set(x, y, z);
    G.rotation.y = ry;
    return G;
  }
}

// ---------------------------------------------------------------- architecture
export function plinth(p, w, d, floor = 'floor') {
  p.box('concrete', C.concreteDk, w, 0.08, d, 0, 0, 0, 0.012);
  p.box(floor, floor === 'planks' ? C.oak : C.terrazzo, w - 0.03, 0.04, d - 0.03, 0, 0.08, 0, 0.005);
}

// wall along local x, centred, thickness along z; hole = [x0, x1, y0, y1]
export function wall(p, { x = 0, z = 0, ry = 0, w, h = 3.2, t = 0.2, c = C.concrete, k = 'concrete', hole = null }) {
  p.at(x, z, ry, () => {
    if (!hole) return p.box(k, c, w, h, t, 0, 0, 0, 0.006);
    const [x0, x1, y0, y1] = hole;
    p.box(k, c, x0 + w / 2, h, t, (x0 - w / 2) / 2, 0, 0, 0.006);
    p.box(k, c, w / 2 - x1, h, t, (x1 + w / 2) / 2, 0, 0, 0.006);
    if (y0 > 0) p.box(k, c, x1 - x0, y0, t, (x0 + x1) / 2, 0, 0);
    p.box(k, c, x1 - x0, h - y1, t, (x0 + x1) / 2, y1, 0);
  });
}

// steel-framed glazing in the local x-y plane
export function glazing(p, { x = 0, z = 0, ry = 0, y = 0, w, h, cols = 3, rows = 2, c = C.steel, f = 0.045 }) {
  p.at(x, z, ry, () => {
    p.box('glass', 0xffffff, w - f, h - f, 0.01, 0, y + f / 2, 0);
    for (let i = 0; i <= cols; i++) p.box('metal', c, f, h, 0.07, -w / 2 + f / 2 + ((w - f) * i) / cols, y, 0);
    for (let j = 0; j <= rows; j++) p.box('metal', c, w, f * (j % rows ? 0.8 : 1), 0.07, 0, y + ((h - f) * j) / rows, 0);
  });
}

export function slats(p, { x = 0, z = 0, ry = 0, w, h, n, c = C.oak, depth = 0.07, thick = 0.035, rails = true }) {
  p.at(x, z, ry, () => {
    for (let i = 0; i < n; i++) p.box('wood', c, thick, h, depth, -w / 2 + thick / 2 + ((w - thick) * i) / (n - 1), 0, 0);
    if (rails) for (const y of [0, h - 0.03]) p.box('wood', shade(c, 0.9), w, 0.03, depth * 0.6, 0, y, -depth * 0.1);
  });
}

// glulam roof beam along z at height y (bottom face)
export function beam(p, x, y, z0, z1, c = C.oak) {
  p.box('wood', c, 0.1, 0.24, z1 - z0, x, y, (z0 + z1) / 2, 0.01);
}

// ---------------------------------------------------------------- shelving
// Bookcase facing +z: carcass, shelves and an instanced run of books (or
// archive boxes) with gaps, flat stacks and a leaning book at row ends.
export function bookcase(p, { x = 0, z = 0, ry = 0, w = 2, h = 2.4, d = 0.34, rows = 6, seed = 1, c = C.oak, items = 'books', fill = 0.95, ends = true, dens = 1 }) {
  p.at(x, z, ry, () => {
    const r = rng(seed);
    const t = 0.028;
    const kick = 0.07;
    const bays = Math.max(1, Math.round(w / 0.9));
    const bw = (w - t) / bays;
    const rh = (h - kick) / rows;
    if (ends) for (const s of [-1, 1]) p.box('wood', c, t, h, d, s * (w / 2 - t / 2), 0, 0, 0.004);
    for (let i = 1; i < bays; i++) p.box('wood', c, t * 0.8, h - kick, d - 0.012, -w / 2 + t / 2 + i * bw, kick, 0);
    p.box('wood', shade(c, 0.78), w - 0.01, h - 0.01, 0.012, 0, 0, -d / 2 + 0.006);
    p.box('wood', shade(c, 0.62), w - 2 * t, kick, d - 0.03, 0, 0, 0);
    for (let j = 0; j < rows; j++) p.box('wood', c, w - 0.004, t, d, 0, kick + j * rh, 0, 0.003);
    p.box('wood', c, w, t, d + 0.01, 0, h - t, 0, 0.004);
    for (let j = 0; j < rows - 1 + (h - kick - rows * rh > 0 ? 0 : 1); j++)
      for (let i = 0; i < bays; i++) {
        if (j === rows - 1 && h - (kick + j * rh + t) < 0.15) continue;
        if (r() > fill) continue;
        let cx = -w / 2 + t + i * bw + 0.004;
        const x1 = cx + bw - t - 0.006;
        const y = kick + j * rh + t;
        const ch = Math.min(rh, h - t - y) - t;
        while (cx < x1 - 0.015) {
          const roll = r();
          const room = x1 - cx;
          if (items === 'boxes') {
            const bwid = Math.min(room, 0.2 + r() * 0.14);
            if (bwid < 0.12) break;
            p.book(cx + bwid / 2, y, d / 2 - 0.02 - d * 0.42, bwid - 0.006, Math.min(ch * 0.9, 0.3 + r() * 0.04), d * 0.84, 0, new Color(BOXES[(r() * BOXES.length) | 0]).multiplyScalar(0.9 + r() * 0.2));
            cx += bwid;
            continue;
          }
          const col = () => new Color(SPINES[(r() * SPINES.length) | 0]).multiplyScalar(0.82 + r() * 0.3);
          if (roll < 0.045) {
            cx += 0.03 + r() * 0.08;
            continue;
          }
          if (roll < 0.09 && room > 0.3) {
            // a flat stack
            const sw = 0.17 + r() * 0.07;
            let yy = y;
            for (let k = 0, n = 2 + ((r() * 4) | 0); k < n; k++) {
              const th = 0.022 + r() * 0.025;
              p.book(cx + sw + r() * 0.012, yy + th / 2, d / 2 - 0.02 - d * 0.4, th, sw, d * 0.8, Math.PI / 2, col());
              yy += th;
            }
            cx += sw + 0.02;
            continue;
          }
          const bwid = (0.016 + r() * 0.034) / Math.sqrt(dens);
          if (bwid > room) {
            if (room > 0.07 + ch * 0.17) p.book(cx + 0.015 + ch * 0.17, y, d / 2 - 0.02 - d * 0.4, 0.024, ch * 0.82, d * 0.8, 0.2, col());
            break;
          }
          const bd = d * (0.72 + r() * 0.2);
          p.book(cx + bwid / 2, y, d / 2 - 0.012 - bd / 2, bwid - 0.0012, ch * (0.62 + r() * 0.33), bd, 0, col());
          cx += bwid;
        }
      }
  });
}

// ---------------------------------------------------------------- lighting
// pendant hanging from `top`; kind dome (metal) or drum (felt)
export function pendant(p, x, y, z, { r = 0.22, top = 3.1, kind = 'dome', c = C.brass, i = 1 } = {}) {
  const sh = kind === 'dome' ? r * 0.7 : 0.26;
  p.box('metal', C.steel, 0.008, top - y - sh, 0.008, x, y + sh, z);
  if (kind === 'dome') p.add('metal', xf(lathe([[0.012, sh + 0.02], [r * 0.3, sh], [r * 0.75, sh * 0.6], [r, 0.03], [r * 0.97, 0]], 24), { t: [x, y, z] }), c);
  else p.cyl('felt', c, r, sh, x, y, z, 28);
  p.cyl('glow', 0xffffff, r * 0.9, 0.012, x, y + 0.004, z, 24);
  p.lamp(x, y - 0.06, z, 0xffd2a0, i);
}

export function floorLamp(p, x, z, { c = C.steel, i = 0.7 } = {}) {
  p.cyl('metal', c, 0.13, 0.02, x, 0, z, 20);
  p.cyl('metal', c, 0.011, 1.38, x, 0.02, z, 8);
  p.cyl('shade', 0xffffff, 0.2, 0.3, x, 1.32, z, 24, 0.17);
  p.lamp(x, 1.42, z, 0xffcf96, i);
}

// articulated task lamp standing on a surface at height y, head toward +z
export function deskLamp(p, x, y, z, ry = 0, { c = C.brass, i = 0.6 } = {}) {
  p.at(x, z, ry, () => {
    p.cyl('metal', c, 0.065, 0.016, 0, 0, 0, 18);
    p.rod('metal', c, [[0, 0.01, -0.02], [0, 0.33, -0.09], [0, 0.42, 0.16]], 0.007);
    p.add('metal', xf(lathe([[0, 0.1], [0.025, 0.1], [0.045, 0.06], [0.07, 0], [0.068, -0.004]], 18), { t: [0, 0.3, 0.17], r: [0.35, 0, 0] }), C.steel);
    p.cyl('glow', 0xffffff, 0.06, 0.006, 0, 0.3, 0.17, 14);
    p.lamp(0, 0.24, 0.2, 0xffd6a2, i);
  }, y);
}

// ---------------------------------------------------------------- furniture
export function table(p, { x = 0, z = 0, ry = 0, w = 1.6, d = 0.8, h = 0.74, c = C.oak, leg = C.steel, legK = 'metal', shelf = false }) {
  p.at(x, z, ry, () => {
    p.box('wood', c, w, 0.035, d, 0, h - 0.035, 0, 0.008);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) p.box(legK, leg, 0.035, h - 0.035, 0.035, sx * (w / 2 - 0.07), 0, sz * (d / 2 - 0.07));
    if (shelf) p.box('wood', shade(c, 0.92), w - 0.12, 0.025, d - 0.12, 0, 0.22, 0);
  });
}

export function roundTable(p, x, z, { r = 0.6, h = 0.74, c = C.oak } = {}) {
  p.cyl('wood', c, r, 0.035, x, h - 0.035, z, 40);
  p.cyl('wood', shade(c, 0.85), 0.05, h - 0.035, x, 0, z, 12);
  p.cyl('metal', C.steel, 0.28, 0.02, x, 0, z, 24);
}

export function chair(p, x, z, ry = 0, { c = C.oak, seat = null } = {}) {
  p.at(x, z, ry, () => {
    for (const sx of [-1, 1]) {
      p.box('wood', c, 0.026, 0.43, 0.026, sx * 0.18, 0, 0.17);
      p.box('wood', c, 0.026, 0.8, 0.026, sx * 0.18, 0, -0.18, 0, [-0.06, 0, 0]);
    }
    p.box(seat ? 'felt' : 'wood', seat || c, 0.42, 0.035, 0.42, 0, 0.43, 0, 0.01);
    p.box('wood', c, 0.4, 0.16, 0.022, 0, 0.62, -0.205, 0.008, [-0.1, 0, 0]);
  });
}

export function stool(p, x, z, h = 0.65, c = C.oak) {
  p.cyl('wood', c, 0.17, 0.035, x, h - 0.035, z, 22);
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + 0.785;
    p.rod('metal', C.steel, [[x + Math.sin(a) * 0.17, 0, z + Math.cos(a) * 0.17], [x + Math.sin(a) * 0.1, h - 0.035, z + Math.cos(a) * 0.1]], 0.011, 5);
  }
  const ring = [];
  for (let i = 0; i <= 16; i++) ring.push([x + Math.sin(i * 0.3927) * 0.15, 0.24, z + Math.cos(i * 0.3927) * 0.15]);
  p.rod('metal', C.steel, ring, 0.006, 4);
}

// upholstered lounge chair / sofa (n seats), facing +z, seat top ≈ 0.45
export function lounge(p, x, z, ry = 0, { c = C.felt[0], n = 1 } = {}) {
  const w = 0.74 * n + 0.2;
  p.at(x, z, ry, () => {
    for (const sx of [-1, 1]) {
      p.box('felt', c, 0.12, 0.42, 0.8, sx * (w / 2 - 0.06), 0.14, 0, 0.05);
      for (const sz of [-1, 1]) p.cyl('wood', C.walnut, 0.02, 0.14, sx * (w / 2 - 0.08), 0, sz * 0.3, 8, 0.014);
    }
    p.box('felt', shade(c, 0.92), w - 0.02, 0.2, 0.8, 0, 0.14, 0, 0.05);
    for (let i = 0; i < n; i++) p.box('felt', c, (w - 0.24) / n - 0.01, 0.11, 0.64, -w / 2 + 0.12 + ((w - 0.24) / n) * (i + 0.5), 0.34, 0.06, 0.045);
    p.box('felt', c, w - 0.02, 0.48, 0.18, 0, 0.3, -0.31, 0.07, [-0.14, 0, 0]);
  });
}

export function plant(p, x, z, { s = 1, tree = false, pot = C.pot, seed = 5, y = 0 } = {}) {
  p.at(x, z, 0, () => {
    const r = rng(seed);
    p.add('solid', lathe([[0, 0], [0.12 * s, 0], [0.17 * s, 0.34 * s], [0.155 * s, 0.34 * s], [0, 0.32 * s]], 18), pot);
    const cy = tree ? 1.45 * s : 0.62 * s;
    const R = tree ? 0.42 * s : 0.3 * s;
    if (tree) p.rod('wood', C.walnut, [[0, 0.3 * s, 0], [0.04 * s, 0.9 * s, 0.02], [-0.02 * s, cy, 0]], 0.02 * s, 5);
    const greens = [0x4f6b3a, 0x5f7d45, 0x3e5a33, 0x6e8a50, 0x587340];
    for (let i = 0, n = tree ? 26 : 18; i < n; i++) {
      const a = r() * 6.283;
      const q = Math.sqrt(r());
      const lx = Math.sin(a) * R * q;
      const lz = Math.cos(a) * R * q;
      const ly = cy + (r() - 0.35) * R * (tree ? 1.1 : 1.3);
      p.add('solid', xf(sphere(0.085 * s, 7, 5), { t: [lx, ly, lz], r: [r() * 3, r() * 3, r() * 3], s: [1, 0.42, 1.6] }), greens[(r() * 5) | 0]);
    }
  }, y);
}

// rolling library ladder leaning on a shelf front at local z = 0
export function ladder(p, x, z, ry, h, c = C.brass) {
  p.at(x, z, ry, () => {
    const out = 0.55;
    for (const sx of [-0.21, 0.21]) {
      p.rod('wood', C.oak, [[sx, 0.04, out], [sx, h, 0.05]], 0.016, 6);
      p.cyl('metal', C.steel, 0.025, 0.05, sx, 0, out, 10);
      p.rod('metal', c, [[sx, h, 0.05], [sx, h + 0.06, 0.02], [sx, h + 0.04, -0.03]], 0.006, 4);
    }
    for (let y = 0.3; y < h - 0.1; y += 0.28) {
      const zz = out - (out - 0.05) * (y / h);
      p.rod('metal', c, [[-0.21, y, zz], [0.21, y, zz]], 0.009, 5);
    }
  });
}

export function openBook(p, x, y, z, ry = 0, c = 0x6f2b25) {
  p.at(x, z, ry, () => {
    p.box('solid', c, 0.33, 0.006, 0.24, 0, 0, 0);
    for (const s of [-1, 1]) p.box('solid', C.paper, 0.155, 0.012, 0.22, s * 0.08, 0.004, 0, 0, [0, 0, -s * 0.07]);
  }, y);
}

// sagging thread between two points
export function thread(p, a, b, sag = 0.08, c = C.red, r = 0.005) {
  const pts = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - sag * 4 * t * (1 - t), a[2] + (b[2] - a[2]) * t]);
  }
  p.rod('solid', c, pts, r, 4);
}

// cork evidence wall with pinned cards joined by threads (local x-y plane)
export function cardWall(p, { x = 0, z = 0, w = 4, h = 1.5, y = 1, seed = 9 }) {
  p.at(x, z, 0, () => {
    const r = rng(seed);
    p.box('solid', C.cork, w, h, 0.03, 0, y, 0, 0.008);
    p.box('wood', C.oak, w + 0.06, 0.04, 0.05, 0, y - 0.04, 0.01);
    const cards = [];
    const cols = ['#f4efe4', '#f4efe4', '#f4efe4', '#efe3c4', '#d7e3da', '#e9cfc4'].map((s) => new Color(s).getHex());
    for (let i = 0; i < 30; i++) {
      const cx = -w / 2 + 0.18 + r() * (w - 0.36);
      const cy = y + 0.12 + r() * (h - 0.3);
      if (cards.some(([qx, qy]) => Math.abs(qx - cx) < 0.16 && Math.abs(qy - cy) < 0.12)) continue;
      const big = r() < 0.12;
      p.box('solid', cols[(r() * cols.length) | 0], big ? 0.21 : 0.12, big ? 0.28 : 0.085, 0.004, cx, cy, 0.018, 0, [0, 0, (r() - 0.5) * 0.12]);
      p.cyl('glaze', r() < 0.5 ? C.red : 0x36507f, 0.008, 0.012, cx, cy + (big ? 0.26 : 0.07), 0.02, 6);
      cards.push([cx, cy + (big ? 0.26 : 0.07)]);
    }
    for (let i = 1; i < cards.length; i++) {
      const [ax, ay] = cards[i];
      let best = 0;
      let bd = 1e9;
      for (let j = 0; j < i; j++) {
        const dd = Math.hypot(cards[j][0] - ax, cards[j][1] - ay);
        if (dd < bd) (bd = dd), (best = j);
      }
      if (r() < 0.75) thread(p, [ax, ay, 0.026], [cards[best][0], cards[best][1], 0.026], 0.02 + r() * 0.03, r() < 0.7 ? C.red : 0x36507f, 0.003);
    }
  });
}

// brass lever stamping press on a walnut block, facing +z
export function press(p, x, y, z, ry = 0) {
  p.at(x, z, ry, () => {
    p.box('wood', C.walnut, 0.3, 0.06, 0.24, 0, 0, 0, 0.008);
    p.cyl('metal', C.brass, 0.024, 0.36, 0, 0.06, -0.08, 12);
    p.box('metal', C.brass, 0.06, 0.06, 0.2, 0, 0.36, -0.01, 0.01);
    p.cyl('metal', C.brass, 0.03, 0.14, 0, 0.2, 0.07, 14);
    p.cyl('glaze', C.red, 0.034, 0.02, 0, 0.18, 0.07, 14);
    p.rod('metal', C.brass, [[0, 0.42, -0.02], [0.12, 0.5, 0.06], [0.26, 0.52, 0.12]], 0.008, 5);
    p.add('glaze', xf(sphere(0.028, 10, 8), { t: [0.26, 0.52, 0.12] }), C.walnut);
  }, y);
}

export function magnifier(p, x, y, z, ry = 0) {
  p.at(x, z, ry, () => {
    p.cyl('metal', C.steel, 0.06, 0.015, 0, 0, 0, 16);
    p.rod('metal', C.brass, [[0, 0.01, 0], [0, 0.22, 0.02], [0, 0.26, 0.1]], 0.006, 5);
    const ring = [];
    for (let i = 0; i <= 20; i++) ring.push([Math.sin(i * 0.314) * 0.06, 0.2, 0.16 + Math.cos(i * 0.314) * 0.06]);
    p.rod('metal', C.brass, ring, 0.006, 4);
    p.cyl('glass', 0xffffff, 0.058, 0.004, 0, 0.198, 0.16, 18);
  }, y);
}

// a wavy linen curtain in the local x-y plane
export function curtain(p, { x = 0, z = 0, w = 1, h = 2.8, y = 0.05, c = C.linen }) {
  const m = new Mesher();
  const n = 28;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const a = u * Math.PI * 2 * (w / 0.22);
    const dz = Math.sin(a) * 0.035;
    const nx = -Math.cos(a) * 0.5;
    const l = Math.hypot(nx, 1);
    m.v(-w / 2 + u * w, y, dz, nx / l, 0, 1 / l, u * w, 0);
    m.v(-w / 2 + u * w, y + h, dz, nx / l, 0, 1 / l, u * w, h);
    if (i < n) m.quad(i * 2, i * 2 + 2, i * 2 + 3, i * 2 + 1);
  }
  p.at(x, z, 0, () => {
    p.add('felt', m.build(), c);
    p.box('metal', C.steel, w + 0.1, 0.015, 0.015, 0, y + h + 0.01, 0);
  });
}
