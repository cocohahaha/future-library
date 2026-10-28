import * as THREE from 'three';
import { MAT, mat4 } from '../core/builder.js';
import { PAL } from '../core/config.js';
import { extrude } from '../core/geom.js';
import { buildRoof } from './roof.js';
import { latticePanel } from './parts.js';

// Whitewashed garden walls (粉墙) with grey-tile copings (黛瓦), a stone
// plinth, and openings: moon gates (月洞门), vase gates (瓶门), plain doorways
// and leak windows (漏窗) filled with open lattice. Walls run along polylines;
// each straight run is an extruded elevation with its holes cut out.

// opening: { at: metres along the run, type: 'moon'|'vase'|'door'|'window'|'octagon', r, w, h, y }
// Ground-level openings are notches in the outer contour (never holes that
// touch the outline); windows are holes.
function moonGeom(o) {
  const r = o.r || 1.25;
  const cy = (o.y || 0) + r * 0.94;
  const a = Math.asin(Math.min(0.999, cy / r));
  return { r, cy, a, half: Math.cos(a) * r };
}
function elevationShape(len, H, openings) {
  const s = new THREE.Shape();
  const ground = openings.filter((o) => o.type === 'moon' || o.type === 'vase' || o.type === 'door').sort((a, b) => a.at - b.at);
  s.moveTo(0, 0);
  for (const o of ground) {
    if (o.type === 'moon') {
      const m = moonGeom(o);
      s.lineTo(o.at - m.half, 0);
      s.absarc(o.at, m.cy, m.r, Math.PI + m.a, -m.a, true);
      s.lineTo(o.at + m.half, 0);
    } else if (o.type === 'vase') {
      const w = o.w || 1.0;
      s.lineTo(o.at - w * 0.42, 0);
      s.bezierCurveTo(o.at - w * 0.95, 0.9, o.at - w * 0.9, 1.75, o.at - w * 0.3, 2.05);
      s.lineTo(o.at - w * 0.3, 2.35);
      s.quadraticCurveTo(o.at, 2.55, o.at + w * 0.3, 2.35);
      s.lineTo(o.at + w * 0.3, 2.05);
      s.bezierCurveTo(o.at + w * 0.9, 1.75, o.at + w * 0.95, 0.9, o.at + w * 0.42, 0);
    } else {
      const w = o.w || 1.4;
      const h = o.h || 2.4;
      s.lineTo(o.at - w / 2, 0);
      s.lineTo(o.at - w / 2, h);
      s.lineTo(o.at + w / 2, h);
      s.lineTo(o.at + w / 2, 0);
    }
  }
  s.lineTo(len, 0);
  s.lineTo(len, H);
  s.lineTo(0, H);
  s.closePath();
  for (const o of openings) {
    if (o.type === 'moon' || o.type === 'vase' || o.type === 'door') continue;
    const hole = new THREE.Path();
    if (o.type === 'octagon') {
      const r = o.r || 0.55;
      const cy = o.y || 1.7;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const x = o.at + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i) hole.lineTo(x, y);
        else hole.moveTo(x, y);
      }
      hole.closePath();
    } else {
      const w = o.w || 1.1;
      const h = o.h || 0.8;
      const y = o.y || 1.4;
      hole.moveTo(o.at - w / 2, y);
      hole.lineTo(o.at + w / 2, y);
      hole.lineTo(o.at + w / 2, y + h);
      hole.lineTo(o.at - w / 2, y + h);
      hole.closePath();
    }
    s.holes.push(hole);
  }
  return s;
}

// frame trims around openings: grey brick/stone surround
function openingTrim(B, o, T) {
  const c = PAL.stoneGrey;
  if (o.type === 'moon') {
    const { r, cy } = moonGeom(o);
    const ring = new THREE.Shape();
    ring.absarc(0, 0, r + 0.16, 0, Math.PI * 2, false);
    const h = new THREE.Path();
    h.absarc(0, 0, r, 0, Math.PI * 2, true);
    ring.holes.push(h);
    const g = extrude(ring, T + 0.08, 40);
    // clip the part below ground by keeping it (it's hidden under the plinth)
    B.add('solid', g, mat4(o.at, cy, 0), c, { kind: MAT.stone, ao: 0.95 });
  } else if (o.type === 'octagon' || o.type === 'window') {
    const w = o.type === 'octagon' ? (o.r || 0.55) * 2 : o.w || 1.1;
    const h = o.type === 'octagon' ? (o.r || 0.55) * 2 : o.h || 0.8;
    const y = o.type === 'octagon' ? (o.y || 1.7) - h / 2 : o.y || 1.4;
    for (const [dx, dy, ww, hh] of [
      [0, -0.08, w + 0.24, 0.12],
      [0, h - 0.04, w + 0.24, 0.12],
      [-w / 2 - 0.06, 0, 0.12, h],
      [w / 2 + 0.06, 0, 0.12, h]
    ])
      B.box('solid', c, ww, hh, T + 0.06, o.at + dx, y + dy, 0, { kind: MAT.stone });
    // open lattice infill
    latticePanel(B, o.at, y, 0, w + 0.02, h, o.pattern !== undefined ? o.pattern : 3, true);
  } else if (o.type === 'door' || o.type === 'vase') {
    const w = o.type === 'vase' ? (o.w || 1) * 1.9 : o.w || 1.4;
    const h = o.type === 'vase' ? 2.55 : o.h || 2.4;
    B.box('solid', c, w + 0.3, 0.14, T + 0.08, o.at, h, 0, { kind: MAT.stone });
    if (o.type === 'door') {
      B.box('solid', c, 0.14, h, T + 0.08, o.at - w / 2 - 0.07, 0, 0, { kind: MAT.stone });
      B.box('solid', c, 0.14, h, T + 0.08, o.at + w / 2 + 0.07, 0, 0, { kind: MAT.stone });
    }
  }
}

// Build a wall along a polyline of [x, z] points.
// opts: { H, T, openings: [[runIndex, opening], ...], wave (amplitude of a dragon wall top), coping: true }
export function wall(B, pts, opts = {}, tier = {}) {
  const H = opts.H || 3.6;
  const T = opts.T || 0.5;
  const openingsBy = new Map();
  for (const [ri, o] of opts.openings || []) {
    if (!openingsBy.has(ri)) openingsBy.set(ri, []);
    openingsBy.get(ri).push(o);
  }
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, z0] = pts[i];
    const [x1, z1] = pts[i + 1];
    const len = Math.hypot(x1 - x0, z1 - z0);
    if (len < 0.05) continue;
    const yaw = Math.atan2(x1 - x0, z1 - z0) - Math.PI / 2;
    const ops = openingsBy.get(i) || [];
    B.push(mat4(x0, opts.y || 0, z0, yaw));
    // plaster body (extruded elevation, holes cut)
    const g = extrude(elevationShape(len, H, ops), T, 24);
    const pos = g.attributes.position;
    B.add('solid', g, new THREE.Matrix4(), opts.color || PAL.plaster, {
      kind: MAT.plaster,
      uv: (p, k) => [0, pos.getY(k) / H]
    });
    // stone plinth (skip under doorways)
    const gaps = ops.filter((o) => o.type !== 'window' && o.type !== 'octagon').map((o) => {
      const half = o.type === 'moon' ? moonGeom(o).half + 0.05 : o.type === 'vase' ? (o.w || 1) * 0.5 : (o.w || 1.4) / 2;
      return [o.at - half, o.at + half];
    });
    gaps.sort((a, b) => a[0] - b[0]);
    let cur = 0;
    const plinth = (a, b) => {
      if (b - a > 0.05) B.box('solid', PAL.stoneGrey, b - a, 0.42, T + 0.1, (a + b) / 2, 0, 0, { kind: MAT.stone, ao: 0.8 });
    };
    for (const [a, b] of gaps) {
      plinth(cur, a);
      cur = b;
    }
    plinth(cur, len);
    for (const o of ops) openingTrim(B, o, T);
    // coping: a small tiled double-pitch roof on top, with a ridge
    if (opts.coping !== false) {
      B.box('solid', PAL.brick, len + 0.04, 0.16, T + 0.12, len / 2, H, 0, { kind: MAT.stone });
      B.push(mat4(len / 2, H + 0.12, 0));
      buildRoof(
        B,
        {
          type: 'gable',
          hx: len / 2 + 0.05,
          hz: T / 2 + 0.38,
          y: 0,
          rise: 0.42,
          lift: 0,
          fascia: 0.06,
          ridgeW: 0.16,
          ridgeH: 0.16,
          ridgeEnd: i === 0 || i === pts.length - 2 ? 'swallow' : 'plain',
          ridgeBand: false,
          barge: false,
          segV: 4,
          eaveTiles: true,
          rafters: false
        },
        { ...tier, rafters: false, low: true }
      );
      B.pop();
    }
    B.pop();
  }
}

// a free-standing screen wall (影壁 / 照壁) with a framed panel
export function screenWall(B, x, z, w, h, ry = 0, tier = {}) {
  B.pushT(x, 0, z, ry);
  B.box('solid', PAL.stoneGrey, w + 0.4, 0.6, 1.1, 0, 0, 0, { kind: 10 });
  B.box('solid', PAL.plaster, w, h, 0.7, 0, 0.6, 0, { kind: MAT.plaster, uv: (p, i, src) => [0, src ? src.getY(i) : 0.5] });
  // brick frame + central disc
  for (const s of [-1, 1]) B.box('solid', PAL.brick, 0.3, h, 0.76, s * (w / 2 - 0.15), 0.6, 0, { kind: MAT.stone });
  B.box('solid', PAL.brick, w, 0.3, 0.76, 0, 0.6 + h - 0.3, 0, { kind: MAT.stone });
  B.cyl('solid', PAL.stoneGrey, 0.8, 0.8, 0, 0.6 + h / 2, 0, { rx: Math.PI / 2, seg: 24, kind: MAT.stone });
  B.push(mat4(0, 0.6 + h + 0.05, 0));
  buildRoof(B, { type: 'hip', hx: w / 2 + 0.5, hz: 0.9, y: 0, rise: 0.75, lift: 0.25, flare: 0.15, Lc: 1, ridgeEnd: 'curl', ornament: 0.45, ridgeW: 0.18, ridgeH: 0.22 }, { ...tier, low: true });
  B.pop();
  B.pop();
}
