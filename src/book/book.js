import { Group, Mesh, BufferGeometry, BufferAttribute, Float32BufferAttribute, Uint16BufferAttribute, Vector3, DynamicDrawUsage, DoubleSide } from 'three';
import * as C from './curve.js';
import { pageMaterial, edgeMaterial, clothMaterial } from './materials.js';
import { roundBox } from '../core/geo.js';

// The hardback: two boards, a cloth spine that rolls from rounded (closed)
// to flat (open), the text block split into a left and a right stack, and a
// small pool of leaves that curl over during a turn.
//
// Turn units: 0 = the cover with the front block of pages; 1..6 = paper
// leaves. tau[u] is 0 when a unit lies on the right, 1 when on the left.
// Spread s (0..7) is settled when units < s lie left and the rest lie right:
//   spread 0 closed · 1 title + contents · 2..6 the five zones · 7 afterword

const UNITS = C.NL + 1;
export const SPREADS = UNITS + 1; // 0..7
const NSG = 6; // leaf samples across a stack's thickness
const NZ_LEAF = 10;

export const leftPageId = (s) => (s <= 1 ? 'p0' : `v${s - 1}`);
export const rightPageId = (s) => (s >= UNITS ? 'bk' : `r${s}`);

// ---------------------------------------------------------------- stack
// A fan of leaves σ = 0 (on the board) … 1 (the visible page), as one
// dynamic mesh: top surface (group 0, page material) + head, tail and
// fore-edge faces (group 1, edge material).
class Stack {
  constructor(pageMat, edgeMat, mirrored) {
    this.mirrored = mirrored;
    const NS = C.NS;
    const top = (NS + 1) * 3;
    const side = (NS + 1) * (NSG + 1);
    const fore = (NSG + 1) * 3;
    this.nTop = top;
    this.nSide = side;
    const count = top + side * 2 + fore;
    // BufferAttribute (not Float32BufferAttribute, which copies) so the
    // arrays written in update() are the ones the GPU sees
    const g = new BufferGeometry();
    this.pos = new Float32Array(count * 3);
    this.nrm = new Float32Array(count * 3);
    this.uv = new Float32Array(count * 2);
    g.setAttribute('position', new BufferAttribute(this.pos, 3).setUsage(DynamicDrawUsage));
    g.setAttribute('normal', new BufferAttribute(this.nrm, 3).setUsage(DynamicDrawUsage));
    g.setAttribute('uv', new BufferAttribute(this.uv, 2).setUsage(DynamicDrawUsage));
    const idx = [];
    // top: 3 rows along z
    for (let j = 0; j < 2; j++)
      for (let k = 0; k < NS; k++) {
        const a = j * (NS + 1) + k;
        const b = a + NS + 1;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
    const topCount = idx.length;
    // head (z = -H/2, faces -z) and tail (z = +H/2, faces +z)
    for (const [base, flip] of [
      [top, true],
      [top + side, false]
    ]) {
      for (let i = 0; i < NSG; i++)
        for (let k = 0; k < NS; k++) {
          const a = base + i * (NS + 1) + k;
          const b = a + NS + 1;
          if (flip) idx.push(a, a + 1, b, a + 1, b + 1, b);
          else idx.push(a, b, a + 1, a + 1, b, b + 1);
        }
    }
    // fore-edge: σ rows × 3 z columns
    const fb = top + side * 2;
    for (let i = 0; i < NSG; i++)
      for (let j = 0; j < 2; j++) {
        const a = fb + i * 3 + j;
        const b = a + 3;
        idx.push(a, a + 1, b, a + 1, b + 1, b);
      }
    g.setIndex(new Uint16BufferAttribute(idx, 1));
    g.addGroup(0, topCount, 0);
    g.addGroup(topCount, idx.length - topCount, 1);
    this.geo = g;
    this.mesh = new Mesh(g, [pageMat, edgeMat]);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
    this.th = new Float32Array(NS + 1);
    this.xs = [];
    this.ys = [];
    this.ths = [];
    for (let i = 0; i <= NSG; i++) {
      this.xs.push(new Float32Array(NS + 1));
      this.ys.push(new Float32Array(NS + 1));
      this.ths.push(new Float32Array(NS + 1));
    }
    this.key = '';
  }

  // thickness Ts of the stack, openness w (0 closed slab → 1 open fan)
  update(Ts, w) {
    const key = `${Ts.toFixed(3)}:${w.toFixed(4)}`;
    if (key === this.key) return false;
    this.key = key;
    const NS = C.NS;
    for (let i = 0; i <= NSG; i++) {
      const sg = i / NSG;
      const yf = C.BT + sg * Ts;
      const rx = C.T / 2 - sg * Ts * w;
      const ry = yf + (C.YSP - yf) * w;
      C.restingAngles(this.ths[i], ry, yf);
      C.integrate(this.ths[i], rx, ry, this.xs[i], this.ys[i]);
    }
    const P = this.pos;
    const N = this.nrm;
    const U = this.uv;
    const z3 = [-C.H / 2, 0, C.H / 2];
    // top surface = the σ = 1 curve
    const xs = this.xs[NSG];
    const ys = this.ys[NSG];
    const th = this.ths[NSG];
    let v = 0;
    for (let j = 0; j < 3; j++)
      for (let k = 0; k <= NS; k++, v++) {
        P[v * 3] = xs[k];
        P[v * 3 + 1] = ys[k];
        P[v * 3 + 2] = z3[j];
        N[v * 3] = -Math.sin(th[k]);
        N[v * 3 + 1] = Math.cos(th[k]);
        N[v * 3 + 2] = 0;
        U[v * 2] = C.S[k];
        U[v * 2 + 1] = z3[j] + C.H / 2;
      }
    // head and tail
    for (const z of [-C.H / 2, C.H / 2]) {
      for (let i = 0; i <= NSG; i++)
        for (let k = 0; k <= NS; k++, v++) {
          P[v * 3] = this.xs[i][k];
          P[v * 3 + 1] = this.ys[i][k];
          P[v * 3 + 2] = z;
          N[v * 3] = 0;
          N[v * 3 + 1] = 0;
          N[v * 3 + 2] = Math.sign(z);
          U[v * 2] = C.S[k];
          U[v * 2 + 1] = i / NSG;
        }
    }
    // fore-edge
    for (let i = 0; i <= NSG; i++)
      for (let j = 0; j < 3; j++, v++) {
        const t = this.ths[i][NS];
        P[v * 3] = this.xs[i][NS];
        P[v * 3 + 1] = this.ys[i][NS];
        P[v * 3 + 2] = z3[j];
        N[v * 3] = Math.cos(t);
        N[v * 3 + 1] = Math.sin(t);
        N[v * 3 + 2] = 0;
        U[v * 2] = z3[j] + C.H / 2;
        U[v * 2 + 1] = i / NSG;
      }
    const a = this.geo.attributes;
    a.position.needsUpdate = true;
    a.normal.needsUpdate = true;
    a.uv.needsUpdate = true;
    this.Ts = Ts;
    return true;
  }

  // top page curve in stack-local coordinates (x along the page, y up)
  topAt(s) {
    const NS = C.NS;
    let k = 0;
    while (k < NS - 1 && C.S[k + 1] < s) k++;
    const t = Math.min(1, Math.max(0, (s - C.S[k]) / (C.S[k + 1] - C.S[k])));
    const xs = this.xs[NSG];
    const ys = this.ys[NSG];
    return [xs[k] + (xs[k + 1] - xs[k]) * t, ys[k] + (ys[k + 1] - ys[k]) * t];
  }
}

// ---------------------------------------------------------------- turning leaf
class Leaf {
  constructor(mat) {
    const NS = C.NS;
    const count = (NS + 1) * (NZ_LEAF + 1);
    const g = new BufferGeometry();
    this.pos = new Float32Array(count * 3);
    const uv = new Float32Array(count * 2);
    for (let j = 0; j <= NZ_LEAF; j++)
      for (let k = 0; k <= NS; k++) {
        const v = j * (NS + 1) + k;
        uv[v * 2] = C.S[k];
        uv[v * 2 + 1] = (C.H * j) / NZ_LEAF;
      }
    g.setAttribute('position', new BufferAttribute(this.pos, 3).setUsage(DynamicDrawUsage));
    g.setAttribute('normal', new Float32BufferAttribute(new Float32Array(count * 3), 3).setUsage(DynamicDrawUsage));
    g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
    const idx = [];
    for (let j = 0; j < NZ_LEAF; j++)
      for (let k = 0; k < NS; k++) {
        const a = j * (NS + 1) + k;
        const b = a + NS + 1;
        // front face (recto) points up when the leaf lies on the right
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
    g.setIndex(new Uint16BufferAttribute(idx, 1));
    this.geo = g;
    this.mat = mat;
    this.mesh = new Mesh(g, mat);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;
    this.thR = new Float32Array(NS + 1);
    this.thL = new Float32Array(NS + 1);
    this.th = new Float32Array(NS + 1);
    this.xs = new Float32Array(NS + 1);
    this.ys = new Float32Array(NS + 1);
    this.unit = -1;
  }

  // tau: 0 right … 1 left; TR / TL: stack thickness under it on each side
  update(tau, TR, TL, e) {
    const NS = C.NS;
    // resting shapes it leaves from and lands on
    const rxR = C.T / 2 - TR - C.LT;
    const rxL = -C.T / 2 + TL + C.LT;
    C.restingAngles(this.thR, C.YSP, C.BT + TR + C.LT);
    C.restingAngles(this.thL, C.YSP, C.BT + TL + C.LT);
    for (let k = 0; k <= NS; k++) this.thL[k] = Math.PI - this.thL[k];
    const rx = rxR + (rxL - rxR) * e;
    const P = this.pos;
    for (let j = 0; j <= NZ_LEAF; j++) {
      const zn = j / NZ_LEAF - 0.5;
      C.turningAngles(this.th, this.thR, this.thL, e, tau, zn);
      C.integrate(this.th, rx, C.YSP, this.xs, this.ys);
      const z = -C.H / 2 + C.H * (j / NZ_LEAF);
      for (let k = 0; k <= NS; k++) {
        const v = (j * (NS + 1) + k) * 3;
        P[v] = this.xs[k];
        P[v + 1] = this.ys[k];
        P[v + 2] = z;
      }
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.computeVertexNormals();
  }
}

// ---------------------------------------------------------------- book
export function createBook({ textures, pages }) {
  const group = new Group();
  group.name = 'book';
  const paperN = textures.paper.normalMap;

  // materials
  const pageR = pageMaterial({ paperNormal: paperN });
  const pageL = pageMaterial({ paperNormal: paperN });
  pageL.userData.u.uMirrorA.value = 1;
  const edge = edgeMaterial(paperN);
  const leafMats = [0, 1, 2, 3].map(() => pageMaterial({ paperNormal: paperN, leaf: true }));
  const coverArt = pages.get('cover');
  const coverMat = clothMaterial({ weave: textures.weave, art: coverArt.tex, mask: coverArt.mask });
  coverMat.userData.u.uArtSize.value.set(C.WB, C.HB);
  const backMat = clothMaterial({ weave: textures.weave });
  backMat.userData.u.uArtSize.value.set(C.WB, C.HB);
  const spineArt = pages.get('spine');
  const spineMat = clothMaterial({ weave: textures.weave, art: spineArt.tex, mask: spineArt.mask });
  spineMat.side = DoubleSide;
  spineMat.userData.u.uArtSize.value.set(C.T + 2 * C.BT + 4, C.HB);

  // boards: rounded slabs. uv: u from the hinge edge (0) to the fore-edge (1),
  // v from the head (0) to the tail (1)
  function board(side) {
    const g = roundBox(C.WB, C.BT, C.HB, 0.7, 2);
    const p = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) + C.WB / 2; // 0 … WB from the hinge
      uv.setXY(i, x / C.WB, (p.getZ(i) + C.HB / 2) / C.HB);
      p.setX(i, side * (x + C.XH));
      p.setY(i, p.getY(i) + C.BT / 2);
    }
    if (side < 0) {
      // mirrored in x: flip the winding so faces still point outward
      const ix = g.index.array;
      for (let i = 0; i < ix.length; i += 3) {
        const t = ix[i + 1];
        ix[i + 1] = ix[i + 2];
        ix[i + 2] = t;
      }
      const n = g.attributes.normal;
      for (let i = 0; i < n.count; i++) n.setX(i, -n.getX(i));
    }
    return g;
  }
  const backBoard = new Mesh(board(1), backMat);
  backBoard.castShadow = backBoard.receiveShadow = true;
  group.add(backBoard);

  // the left assembly (front board + left stack) swings about the spine
  const leftAsm = new Group();
  group.add(leftAsm);
  const frontBoard = new Mesh(board(-1), coverMat);
  frontBoard.castShadow = frontBoard.receiveShadow = true;
  frontBoard.name = 'cover';
  leftAsm.add(frontBoard);

  const right = new Stack(pageR, edge, false);
  const left = new Stack(pageL, edge, true);
  left.mesh.scale.x = -1;
  group.add(right.mesh);
  leftAsm.add(left.mesh);

  const leaves = leafMats.map((m) => {
    const l = new Leaf(m);
    group.add(l.mesh);
    return l;
  });

  // cloth spine: a strip from the back board's hinge edge to the front
  // board's, bulging out when closed and lying flat when open
  const SP = 18;
  const spineGeo = new BufferGeometry();
  const spPos = new Float32Array((SP + 1) * 2 * 3);
  const spUv = new Float32Array((SP + 1) * 2 * 2);
  const spIdx = [];
  for (let i = 0; i <= SP; i++) {
    spUv[i * 4] = i / SP;
    spUv[i * 4 + 1] = 0;
    spUv[i * 4 + 2] = i / SP;
    spUv[i * 4 + 3] = 1;
    if (i < SP) {
      const a = i * 2;
      spIdx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  spineGeo.setAttribute('position', new BufferAttribute(spPos, 3).setUsage(DynamicDrawUsage));
  spineGeo.setAttribute('normal', new Float32BufferAttribute(new Float32Array(spPos.length), 3).setUsage(DynamicDrawUsage));
  spineGeo.setAttribute('uv', new Float32BufferAttribute(spUv, 2));
  spineGeo.setIndex(spIdx);
  const spine = new Mesh(spineGeo, spineMat);
  spine.castShadow = spine.receiveShadow = true;
  spine.frustumCulled = false;
  group.add(spine);

  // ---------------------------------------------------------------- state
  const tau = new Float32Array(UNITS);
  let turns = [];
  let clock = 0;
  let settled = 0;
  let target = 0;
  const listeners = { settle: [], start: [] };
  let lastKey = '';

  function placeLeftAsm() {
    // rotate about P = (0, PIVOT_Y): position = P - R(gamma)·P
    const gamma = -(Math.PI - Math.PI * tau[0]);
    leftAsm.rotation.z = gamma;
    leftAsm.position.set(C.PIVOT_Y * Math.sin(gamma), C.PIVOT_Y - C.PIVOT_Y * Math.cos(gamma), 0);
    leftAsm.updateMatrix();
    leftAsm.updateMatrixWorld(true);
  }

  const vA = new Vector3();
  const vB = new Vector3();
  function placeSpine(w) {
    vA.set(C.XH, 0, 0);
    vB.set(-C.XH, 0, 0).applyMatrix4(leftAsm.matrix);
    const dx = vB.x - vA.x;
    const dy = vB.y - vA.y;
    const l = Math.hypot(dx, dy) || 1;
    const ox = -dy / l;
    const oy = dx / l;
    const bulge = 7.5 * (1 - w);
    const cx = (vA.x + vB.x) / 2 + ox * bulge * 2;
    const cy = (vA.y + vB.y) / 2 + oy * bulge * 2;
    const N = spineGeo.attributes.normal.array;
    for (let i = 0; i <= SP; i++) {
      const t = i / SP;
      const a = (1 - t) * (1 - t);
      const b = 2 * (1 - t) * t;
      const c = t * t;
      const x = a * vA.x + b * cx + c * vB.x;
      const y = a * vA.y + b * cy + c * vB.y;
      // derivative → outward normal
      const tx = 2 * (1 - t) * (cx - vA.x) + 2 * t * (vB.x - cx);
      const ty = 2 * (1 - t) * (cy - vA.y) + 2 * t * (vB.y - cy);
      const tl = Math.hypot(tx, ty) || 1;
      for (let s = 0; s < 2; s++) {
        const o = (i * 2 + s) * 3;
        spPos[o] = x;
        spPos[o + 1] = Math.max(0.05, y);
        spPos[o + 2] = (s ? 1 : -1) * (C.HB / 2);
        N[o] = -ty / tl;
        N[o + 1] = tx / tl;
        N[o + 2] = 0;
      }
    }
    spineGeo.attributes.position.needsUpdate = true;
    spineGeo.attributes.normal.needsUpdate = true;
  }

  // which page textures the stacks and leaves show
  function bindPage(mat, side, id) {
    const e = pages.get(id);
    const u = mat.userData.u;
    if (side === 'A') {
      u.uPageA.value = e.tex;
      u.uPrintA.value = e.print || u.uPrintA.value;
      u.uRectA.value = e.rect;
      u.uPrintAlphaA.value = e.print ? e.printAlpha : 0;
    } else {
      u.uPageB.value = e.tex;
      u.uPrintB.value = e.print || u.uPrintB.value;
      u.uRectB.value = e.rect;
      u.uPrintAlphaB.value = e.print ? e.printAlpha : 0;
    }
  }

  let topL = 'p0';
  let topR = 'r1';
  let TL = C.F;
  let TR = C.T - C.F;
  let omega = 0;

  function layout() {
    placeLeftAsm();
    omega = C.smoothstep(0.35, 1, tau[0]);
    let nL = 0;
    let nR = 0;
    let lastL = 0;
    let firstR = UNITS;
    for (let u = 1; u < UNITS; u++) {
      if (tau[u] >= 1) {
        nL++;
        lastL = u;
      } else if (tau[u] <= 0) {
        nR++;
        if (u < firstR) firstR = u;
      }
    }
    TL = C.F + nL * C.LT;
    TR = C.BK + nR * C.LT;
    const changedR = right.update(TR, omega);
    const changedL = left.update(TL, omega);
    if (changedR || changedL || tau[0] < 1) placeSpine(omega);
    topL = lastL ? `v${lastL}` : 'p0';
    topR = firstR < UNITS ? `r${firstR}` : 'bk';
    bindPage(pageL, 'A', topL);
    bindPage(pageR, 'A', topR);
    // turning leaves (units ≥ 1 between the stacks)
    let li = 0;
    for (let u = 1; u < UNITS; u++) {
      const t = tau[u];
      if (t <= 0 || t >= 1) continue;
      const leaf = leaves[li++];
      if (!leaf) break;
      leaf.mesh.visible = true;
      leaf.unit = u;
      leaf.update(t, TR, TL, t);
      bindPage(leaf.mat, 'A', `r${u}`);
      bindPage(leaf.mat, 'B', `v${u}`);
    }
    for (; li < leaves.length; li++) {
      leaves[li].mesh.visible = false;
      leaves[li].unit = -1;
    }
  }

  // ---------------------------------------------------------------- turning
  function spreadOf() {
    let s = 0;
    while (s < UNITS && tau[s] >= 1) s++;
    return s;
  }

  function goTo(s, { instant = false, single = 1.15, riffle = 0.55, stagger = 0.085 } = {}) {
    s = Math.max(0, Math.min(SPREADS - 1, s));
    target = s;
    if (instant) {
      turns = [];
      for (let u = 0; u < UNITS; u++) tau[u] = u < s ? 1 : 0;
      layout();
      settled = s;
      listeners.settle.forEach((f) => f(s));
      return;
    }
    // restart from wherever each unit is now (a new request can interrupt)
    turns = [];
    const plan = [];
    for (let u = 0; u < UNITS; u++) if (tau[u] !== (u < s ? 1 : 0)) plan.push(u);
    if (!plan.length) return;
    const forward = plan[0] < s;
    const order = forward ? plan : plan.slice().reverse();
    const many = order.length > 1;
    order.forEach((u, i) => {
      const to = u < s ? 1 : 0;
      const from = tau[u];
      let dur = u === 0 ? (many ? 1.0 : 1.45) : many ? riffle : single;
      dur *= Math.max(0.35, Math.abs(to - from));
      let delay = i * stagger;
      // paper leaves wait until the cover is most of the way over (and the
      // cover waits for the leaves when closing)
      if (forward && order[0] === 0 && u > 0) delay += 0.5;
      if (!forward && u === 0 && many) delay += 0.3;
      turns.push({ u, from, to, t0: clock + delay, dur, ease: u === 0 || !many ? C.easeInOutCubic : C.easeInOutQuad });
    });
    listeners.start.forEach((f) => f(s));
  }

  function update(dt) {
    clock += dt;
    let moving = false;
    for (const t of turns) {
      const k = Math.min(1, Math.max(0, (clock - t.t0) / t.dur));
      tau[t.u] = t.from + (t.to - t.from) * t.ease(k);
      if (k < 1) moving = true;
    }
    if (turns.length && !moving) {
      turns = [];
      settled = spreadOf();
      layout();
      listeners.settle.forEach((f) => f(settled));
      return;
    }
    const key = Array.from(tau).join(',');
    if (key !== lastKey || moving) {
      lastKey = key;
      layout();
    } else {
      // print alpha may change while a miniature lifts
      bindPage(pageL, 'A', topL);
      bindPage(pageR, 'A', topR);
    }
  }

  // a point on the right-hand page (page mm: x from the gutter, y from the
  // head) in book coordinates, for anchoring the miniatures
  const tmp = new Vector3();
  function rightPagePoint(px, py, out = tmp) {
    const [x, y] = right.topAt(px);
    return out.set(x, y, -C.H / 2 + py);
  }

  layout();

  return {
    group,
    right,
    left,
    leaves,
    frontBoard,
    tau,
    materials: { pageL, pageR, edge, coverMat, backMat, spineMat, leafMats },
    goTo,
    update,
    rightPagePoint,
    get settled() {
      return settled;
    },
    get target() {
      return target;
    },
    get turning() {
      return turns.length > 0;
    },
    get openness() {
      return tau[0];
    },
    get topIds() {
      return [topL, topR];
    },
    get thickness() {
      return { TL, TR };
    },
    pickMeshes: () => [left.mesh, right.mesh, frontBoard],
    on(ev, fn) {
      listeners[ev].push(fn);
    },
    relayout: layout
  };
}

export { C };
