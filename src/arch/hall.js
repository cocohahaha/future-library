import * as THREE from 'three';
import { MAT, mat4 } from '../core/builder.js';
import { PAL } from '../core/config.js';
import { smoothstep } from '../core/rng.js';
import { buildRoof } from './roof.js';
import { column, doorLeaf, latticePanel, stairs, platform, woodRail } from './parts.js';

// Parametric timber hall (殿/堂/阁). Local frame: centre at ground level,
// front facing +z. Bays (开间) run along x, depth bays (进深) along z.
//
// spec: {
//   bays, deep, base, margin, colH, colR,
//   front/back/left/right: 'open' | 'doors' | 'doorsOpen' | 'windows' | 'wall' | 'rail'
//   porch: true → front wall set back one depth bay (前廊)
//   roof: { type, rise, over, lift, flare, vS, ridgeEnd, beasts }
//   brackets: bool, upper: { colH, front, sides, balcony, skirt: { over, rise } }
//   stairs: [{ side: 'front'|'back', w }], lamps: [[x,y,z,r,k]...]
//   colors: { col, beam, wall, panel, frame }
// }

const BEAM_PAINT = 0x2f5a62; // blue-green painted architrave (青绿)
const BEAM_PAINT2 = 0x456f4f;

export function hall(B, spec, tier) {
  const bays = spec.bays;
  const deep = spec.deep;
  const W = bays.reduce((a, b) => a + b, 0);
  const D = deep.reduce((a, b) => a + b, 0);
  const base = spec.base !== undefined ? spec.base : 0.6;
  const margin = spec.margin !== undefined ? spec.margin : 1.1;
  const colH = spec.colH || 4;
  const colR = spec.colR || 0.2;
  const C = Object.assign(
    { col: PAL.lacquer, beam: BEAM_PAINT, beam2: BEAM_PAINT2, wall: PAL.plaster, panel: 0x6a3020, frame: PAL.lacquerDark, dado: PAL.brick },
    spec.colors || {}
  );
  const xs = [-W / 2];
  for (const b of bays) xs.push(xs[xs.length - 1] + b);
  const zs = [-D / 2];
  for (const d of deep) zs.push(zs[zs.length - 1] + d);
  const seg = tier.curve;

  // ---- baked occlusion for everything in this hall (local coords)
  const inv = B.frame.clone().invert();
  const lp = new THREE.Vector3();
  const frontOpen = ['open', 'doorsOpen', 'rail'].includes(spec.front || 'doors');
  const prevAO = B.aoFn;
  const floorY = base;
  B.aoFn = (p, n) => {
    lp.copy(p).applyMatrix4(inv);
    let ao = 1;
    const above = lp.y - floorY;
    // contact shadow near the floor
    if (above > -0.05) ao *= 0.7 + 0.3 * smoothstep(0, 0.8, above);
    // deep inside the hall
    const inside = Math.abs(lp.x) < W / 2 + 0.05 && Math.abs(lp.z) < D / 2 + 0.05 && above > -0.05;
    if (inside) {
      const fromFront = D / 2 - lp.z;
      const open = frontOpen ? 1 - smoothstep(0.5, D * 1.1, fromFront) : 0.25;
      ao *= 0.58 + 0.38 * open;
    }
    // undersides (beams, eaves, brackets) see little sky
    if (n.y < -0.4) ao *= 0.78;
    return ao;
  };

  // ---- platform + stairs
  if (base > 0.05) {
    platform(B, 0, 0, W + margin * 2, D + margin * 2, base, { side: spec.platformSide, top: spec.floorColor });
    for (const st of spec.stairs || [{ side: 'front' }]) {
      const w = st.w || Math.min(bays[Math.floor(bays.length / 2)], 4);
      const run = Math.max(0.9, base * 1.8);
      if (st.side === 'front') stairs(B, st.x || 0, 0, D / 2 + margin + 0.02, w, base, run, 1);
      else if (st.side === 'back') stairs(B, st.x || 0, 0, -D / 2 - margin - 0.02, w, base, run, -1);
    }
  }

  // ---- columns
  const interior = spec.interiorCols !== false;
  const colPos = [];
  for (let i = 0; i < xs.length; i++)
    for (let j = 0; j < zs.length; j++) {
      const perim = i === 0 || i === xs.length - 1 || j === 0 || j === zs.length - 1;
      if (!perim && !interior) continue;
      if (!perim && spec.skipCol && spec.skipCol(i, j)) continue;
      const h = perim ? colH : colH + (spec.innerRise || 0.6);
      column(B, xs[i], base, zs[j], h, perim ? colR : colR * 1.08, C.col, seg);
      colPos.push([xs[i], zs[j], h]);
    }

  // ---- architraves (额枋) around the perimeter, plate on top
  const top = base + colH;
  const ring = (y, h, d, color, kind = MAT.paint) => {
    B.box('solid', color, W + colR * 2, h, d, 0, y, D / 2, { kind, chamfer: 0.02 });
    B.box('solid', color, W + colR * 2, h, d, 0, y, -D / 2, { kind, chamfer: 0.02 });
    B.box('solid', color, d, h, D + colR * 2, -W / 2, y, 0, { kind, chamfer: 0.02 });
    B.box('solid', color, d, h, D + colR * 2, W / 2, y, 0, { kind, chamfer: 0.02 });
  };
  ring(top - 0.36, 0.34, colR * 1.6, C.beam);
  ring(top - 0.7, 0.22, colR * 1.3, C.beam2);
  ring(top - 0.48, 0.12, colR * 1.0, 0x9a3a24, MAT.lacquer); // red pad board
  ring(top - 0.02, 0.1, colR * 2.2, C.frame, MAT.wood); // plate (平板枋)
  // painted end bands (箍头) near the corners
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      B.box('solid', 0xc9a24c, 0.06, 0.36, colR * 1.65, sx * (W / 2 - 0.45), top - 0.37, sz * D / 2, { kind: MAT.gold });
      B.box('solid', 0xc9a24c, colR * 1.65, 0.36, 0.06, sx * W / 2, top - 0.37, sz * (D / 2 - 0.45), { kind: MAT.gold });
    }

  // ---- brackets along the eaves
  const bracketTop = top + 0.08;
  let eaveY = top + 0.15;
  if (spec.brackets !== false) {
    const bs = spec.bracketScale || 0.85;
    const placeSide = (x0, z0, x1, z1, yaw, pts) => {
      for (const t of pts) B.inst('bracket', x0 + (x1 - x0) * t, bracketTop, z0 + (z1 - z0) * t, yaw, bs);
    };
    const between = (edges) => {
      const ts = [];
      const len = edges[edges.length - 1] - edges[0];
      for (let i = 0; i < edges.length; i++) {
        if (i > 0 && i < edges.length - 1) ts.push((edges[i] - edges[0]) / len);
        if (i < edges.length - 1) {
          const bw = edges[i + 1] - edges[i];
          const nb = bw > 3.6 ? 2 : 1;
          for (let k = 1; k <= nb; k++) ts.push((edges[i] - edges[0] + (bw * k) / (nb + 1)) / len);
        }
      }
      return ts;
    };
    const tx = between(xs);
    const tz = between(zs);
    placeSide(-W / 2, D / 2, W / 2, D / 2, 0, tx);
    placeSide(W / 2, -D / 2, -W / 2, -D / 2, Math.PI, tx);
    placeSide(W / 2, D / 2, W / 2, -D / 2, Math.PI / 2, tz);
    placeSide(-W / 2, -D / 2, -W / 2, D / 2, -Math.PI / 2, tz);
    // corner sets on the diagonals
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) B.inst('bracket', sx * W / 2, bracketTop, sz * D / 2, Math.atan2(sx, sz), bs * 1.05);
    eaveY = bracketTop + 0.86 * bs;
    // eave purlin board over the brackets
    ring(eaveY - 0.12, 0.16, 0.26, C.frame, MAT.wood);
  }

  // ---- interior roof framing (抬梁): tie beams per column line, short posts, purlins
  if (spec.framing !== false) {
    const rise = (spec.roof && spec.roof.rise) || 3;
    for (let i = 0; i < xs.length; i++) {
      const x = xs[i];
      B.box('solid', C.frame, 0.32, 0.42, D + 0.3, x, eaveY - 0.5, 0, { kind: MAT.wood, chamfer: 0.03 });
      B.box('solid', C.frame, 0.28, 0.36, D * 0.55, x, eaveY - 0.5 + rise * 0.42, 0, { kind: MAT.wood, chamfer: 0.03 });
      for (const sz of [-1, 1]) B.box('solid', C.frame, 0.2, rise * 0.42 - 0.08, 0.2, x, eaveY - 0.08, sz * D * 0.22, { kind: MAT.wood });
      B.box('solid', C.frame, 0.18, rise * 0.38, 0.18, x, eaveY - 0.14 + rise * 0.42 + 0.3, 0, { kind: MAT.wood });
      // a painted band under the main tie beam
      B.box('solid', C.beam, 0.34, 0.12, D * 0.5, x, eaveY - 0.6, 0, { kind: MAT.paint });
    }
    const prof = (v) => 0.36 * v + 0.64 * Math.pow(v, 2.35);
    for (const v of [0.18, 0.45, 0.72, 0.97]) {
      const zz = (D / 2) * (1 - v);
      const yy = eaveY + rise * prof(v) * 0.92 - 0.22;
      for (const sz of v > 0.95 ? [1] : [-1, 1])
        B.cyl('solid', C.frame, 0.12, W + 0.4, -W / 2 - 0.2, yy, sz * zz, { rz: -Math.PI / 2, seg: 8, kind: MAT.wood });
    }
  }

  // ---- walls, doors and windows
  const sides = {
    front: spec.front || 'doors',
    back: spec.back || 'wall',
    left: spec.left || spec.sides || 'wall',
    right: spec.right || spec.sides || 'wall'
  };
  const wallZ = spec.porch ? zs[zs.length - 2] : D / 2;
  const wallH = colH - 0.72;
  // fill each bay of a side
  const fillBay = (kind, x0, z0, x1, z1, outward) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    const yaw = Math.atan2(x1 - x0, z1 - z0) - Math.PI / 2;
    const mx = (x0 + x1) / 2;
    const mz = (z0 + z1) / 2;
    B.push(mat4(mx, base, mz, yaw));
    const inner = len - colR * 2;
    if (kind === 'wall') {
      // brick dado + whitewashed wall
      B.box('solid', C.dado, inner, 0.9, 0.34, 0, 0, 0, { kind: MAT.stone, chamfer: 0.02 });
      B.box('solid', C.wall, inner, wallH - 0.9, 0.28, 0, 0.9, 0, { kind: MAT.plaster, uv: (p, i, src) => [0, src ? src.getY(i) : 0.5] });
    } else if (kind === 'windows') {
      B.box('solid', C.dado, inner, 0.95, 0.32, 0, 0, 0, { kind: MAT.stone, chamfer: 0.02 });
      B.box('solid', C.frame, inner, 0.08, 0.14, 0, 0.95, 0, { kind: MAT.wood });
      const n = inner > 3 ? 4 : 2;
      const ww = inner / n;
      for (let k = 0; k < n; k++) {
        const x = -inner / 2 + ww * (k + 0.5);
        B.box('solid', C.frame, 0.06, wallH - 1.03, 0.08, x - ww / 2 + 0.03, 1.03, 0, { kind: MAT.lacquer });
        latticePanel(B, x, 1.03, 0, ww - 0.06, wallH - 1.11, spec.pattern !== undefined ? spec.pattern : 1, false);
      }
      B.box('solid', C.frame, inner, 0.08, 0.1, 0, wallH - 0.08, 0, { kind: MAT.wood });
    } else if (kind === 'doors' || kind === 'doorsOpen') {
      const n = inner > 3.3 ? 4 : 2;
      const lw = inner / n;
      const dh = wallH - 0.62;
      // transom window above the doors (横披窗)
      latticePanel(B, 0, dh + 0.08, 0, inner - 0.1, wallH - dh - 0.16, 0, false);
      B.box('solid', C.frame, inner, 0.1, 0.12, 0, dh, 0, { kind: MAT.lacquer });
      B.box('solid', C.frame, inner, 0.12, 0.14, 0, 0, 0, { kind: MAT.lacquer }); // sill
      for (let k = 0; k < n; k++) {
        const x = -inner / 2 + lw * (k + 0.5);
        if (kind === 'doorsOpen') {
          // folded back against the columns, slightly ajar
          const side = x < 0 ? -1 : 1;
          const stack = side < 0 ? k : n - 1 - k;
          const px = side * (inner / 2 - 0.06 - stack * 0.09);
          doorLeaf(B, px, 0.12, -lw / 2 * 0.92 * outward, lw, dh - 0.12, { ry: Math.PI / 2 + side * 0.12, pattern: spec.pattern || 0, frame: C.frame, panel: C.panel });
        } else {
          doorLeaf(B, x, 0.12, 0, lw - 0.02, dh - 0.12, { pattern: spec.pattern || 0, frame: C.frame, panel: C.panel });
        }
      }
    } else if (kind === 'rail') {
      woodRail(B, [
        [-inner / 2, 0, 0],
        [inner / 2, 0, 0]
      ], 0.62, C.frame, { pattern: 2 });
    }
    // hanging fretwork under the architrave in open bays (挂落)
    if (kind === 'open' || kind === 'rail' || spec.fretwork) {
      latticePanel(B, 0, wallH + 0.2 - 0.36, 0.02, inner, 0.32, 3, true);
      B.box('solid', C.frame, inner, 0.05, 0.06, 0, wallH + 0.2 - 0.4, 0, { kind: MAT.wood });
    }
    B.pop();
  };
  for (let i = 0; i < bays.length; i++) {
    fillBay(spec.frontBays ? spec.frontBays[i] : sides.front, xs[i], wallZ, xs[i + 1], wallZ, 1);
    fillBay(spec.backBays ? spec.backBays[i] : sides.back, xs[i + 1], -D / 2, xs[i], -D / 2, 1);
    if (spec.porch && sides.front !== 'open') fillBay('open', xs[i], D / 2, xs[i + 1], D / 2, 1);
  }
  for (let j = 0; j < deep.length; j++) {
    if (spec.porch && j === deep.length - 1) {
      fillBay('open', -W / 2, zs[j], -W / 2, zs[j + 1], 1);
      fillBay('open', W / 2, zs[j + 1], W / 2, zs[j], 1);
      continue;
    }
    fillBay(sides.left, -W / 2, zs[j], -W / 2, zs[j + 1], 1);
    fillBay(sides.right, W / 2, zs[j + 1], W / 2, zs[j], 1);
  }

  // ---- interior lamps (baked glow); registered before the roof so the
  //      painted ceiling picks up the warm pools too
  for (const L of spec.lamps || []) B.lamp(L[0], base + L[1], L[2], L[3] || 6, L[4] || 1);

  let ridgeY;
  let roofBase = eaveY;
  // ---- upper storey (阁)
  if (spec.upper) {
    const U = spec.upper;
    const sk = U.skirt || {};
    // pent roof around the ground floor
    buildRoof(
      B,
      {
        type: 'skirt',
        hx: W / 2 + (sk.over || 1.5),
        hz: D / 2 + (sk.over || 1.5),
        ix: W / 2 - 0.1,
        iz: D / 2 - 0.1,
        y: eaveY - 0.05,
        rise: sk.rise || 1.3,
        lift: 0.45,
        flare: 0.3,
        Lc: 3,
        ridgeW: 0.18,
        ridgeH: 0.2
      },
      tier
    );
    const floor2 = eaveY + (sk.rise || 1.3) + 0.25;
    // balcony floor (平座) and railing
    const bo = U.balcony || 0.9;
    B.box('solid', C.frame, W + bo * 2, 0.22, D + bo * 2, 0, floor2 - 0.22, 0, { kind: MAT.wood, chamfer: 0.03 });
    B.box('solid', 0x7a5a40, W + bo * 2 - 0.1, 0.03, D + bo * 2 - 0.1, 0, floor2, 0, { kind: MAT.boards });
    const rx = W / 2 + bo - 0.1;
    const rz = D / 2 + bo - 0.1;
    woodRail(
      B,
      [
        [-rx, floor2, rz],
        [rx, floor2, rz],
        [rx, floor2, -rz],
        [-rx, floor2, -rz],
        [-rx, floor2, rz]
      ],
      0.92,
      C.frame,
      { pattern: 2 }
    );
    // upper columns + walls
    const uH = U.colH || 3.4;
    for (let i = 0; i < xs.length; i++)
      for (let j = 0; j < zs.length; j++) {
        const perim = i === 0 || i === xs.length - 1 || j === 0 || j === zs.length - 1;
        if (!perim) continue;
        B.cyl('solid', C.col, colR * 0.9, uH, xs[i], floor2, zs[j], { rTop: colR * 0.8, seg, kind: MAT.lacquer });
      }
    const top2 = floor2 + uH;
    const ring2 = (y, h, d, color, kind = MAT.paint) => {
      B.box('solid', color, W + colR * 2, h, d, 0, y, D / 2, { kind, chamfer: 0.02 });
      B.box('solid', color, W + colR * 2, h, d, 0, y, -D / 2, { kind, chamfer: 0.02 });
      B.box('solid', color, d, h, D + colR * 2, -W / 2, y, 0, { kind, chamfer: 0.02 });
      B.box('solid', color, d, h, D + colR * 2, W / 2, y, 0, { kind, chamfer: 0.02 });
    };
    ring2(top2 - 0.32, 0.3, colR * 1.5, C.beam);
    ring2(top2 - 0.02, 0.1, colR * 2, C.frame, MAT.wood);
    const wH2 = uH - 0.4;
    const upFill = (kind, x0, z0, x1, z1) => {
      const len = Math.hypot(x1 - x0, z1 - z0);
      const yaw = Math.atan2(x1 - x0, z1 - z0) - Math.PI / 2;
      B.push(mat4((x0 + x1) / 2, floor2, (z0 + z1) / 2, yaw));
      const inner = len - colR * 1.8;
      if (kind === 'doors') {
        const n = inner > 3.3 ? 4 : 2;
        const lw = inner / n;
        for (let k = 0; k < n; k++) doorLeaf(B, -inner / 2 + lw * (k + 0.5), 0.05, 0, lw - 0.02, wH2 - 0.1, { pattern: 1, frame: C.frame, panel: C.panel });
      } else {
        B.box('solid', C.dado, inner, 0.7, 0.24, 0, 0, 0, { kind: MAT.wood });
        latticePanel(B, 0, 0.72, 0, inner, wH2 - 0.8, 1, false);
      }
      B.pop();
    };
    for (let i = 0; i < bays.length; i++) {
      upFill(U.front || 'doors', xs[i], D / 2, xs[i + 1], D / 2);
      upFill('windows', xs[i + 1], -D / 2, xs[i], -D / 2);
    }
    for (let j = 0; j < deep.length; j++) {
      upFill('windows', -W / 2, zs[j], -W / 2, zs[j + 1]);
      upFill('windows', W / 2, zs[j + 1], W / 2, zs[j]);
    }
    // small brackets under the upper eave
    if (spec.brackets !== false) {
      const bs2 = (spec.bracketScale || 0.85) * 0.8;
      const yb = top2 + 0.08;
      for (let i = 0; i < xs.length; i++) {
        B.inst('bracket', xs[i], yb, D / 2, 0, bs2);
        B.inst('bracket', xs[i], yb, -D / 2, Math.PI, bs2);
        if (i < xs.length - 1) {
          const xm = (xs[i] + xs[i + 1]) / 2;
          B.inst('bracket', xm, yb, D / 2, 0, bs2);
          B.inst('bracket', xm, yb, -D / 2, Math.PI, bs2);
        }
      }
      for (let j = 1; j < zs.length - 1; j++) {
        B.inst('bracket', W / 2, yb, zs[j], Math.PI / 2, bs2);
        B.inst('bracket', -W / 2, yb, zs[j], -Math.PI / 2, bs2);
      }
      roofBase = yb + 0.86 * bs2;
    } else roofBase = top2 + 0.1;
  }

  // ---- roof
  const r = spec.roof || {};
  const over = r.over !== undefined ? r.over : 1.6;
  const res = buildRoof(
    B,
    {
      type: r.type || 'xieshan',
      hx: W / 2 + over,
      hz: D / 2 + over,
      y: roofBase - 0.05,
      rise: r.rise || 3,
      lift: r.lift !== undefined ? r.lift : 0.6,
      flare: r.flare !== undefined ? r.flare : 0.4,
      Lc: r.Lc || Math.min(4.5, (D / 2 + over) * 0.8),
      vS: r.vS || 0.42,
      overhang: r.overhang,
      ridgeEnd: r.ridgeEnd || 'curl',
      ridgeW: r.ridgeW,
      ridgeH: r.ridgeH,
      ornament: r.ornament,
      beasts: r.beasts !== undefined ? r.beasts : tier.name === 'high' ? 3 : 0,
      tile: r.tile,
      gableColor: r.gableColor,
      n: r.n,
      R: r.R,
      finial: r.finial
    },
    tier
  );
  ridgeY = res.ridgeY;

  B.aoFn = prevAO;
  return {
    W,
    D,
    xs,
    zs,
    base,
    floorY: base,
    eaveY,
    roofBase,
    ridgeY,
    colPos,
    width: W + margin * 2,
    depth: D + margin * 2
  };
}
