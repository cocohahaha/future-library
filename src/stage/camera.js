import { Vector3, MathUtils } from 'three';
import { XH, WB, H } from '../book/curve.js';

// Camera rig for a book on a desk (fov 30°, millimetres).
// Three framings blend continuously:
//   closed  – three-quarter view of the shut book
//   reading – the whole open spread, from in front and above
//   close   – the standing miniature on the right-hand page
// 'open' (0..1, how far the cover has swung) blends closed → reading;
// 'zoom' (0..1) blends reading → close. Narrow portrait screens frame the
// right-hand page (its text is mirrored in the bottom sheet). Dragging adds
// a yaw/pitch offset that springs back when the visitor lets go.

const FOV = 30;
const tanH = Math.tan(MathUtils.degToRad(FOV / 2));

function fitDist(hx, hy, aspect) {
  return Math.max(hy / tanH, hx / (tanH * aspect));
}

function viewFrom(target, yaw, elev, dist, out) {
  out.set(Math.sin(yaw) * Math.cos(elev), Math.sin(elev), Math.cos(yaw) * Math.cos(elev)).multiplyScalar(dist).add(target);
  return out;
}

export function createRig(camera) {
  camera.fov = FOV;
  camera.near = 12;
  camera.far = 9000;
  const state = {
    open: 0,
    zoom: 0,
    zoomTarget: 0,
    userZoom: 1,
    yaw: 0,
    pitch: 0,
    lastInput: -10,
    focus: new Vector3(104, 32, -6), // miniature centre (book coordinates + desk height)
    sheet: 0 // px of screen covered by the bottom sheet (portrait)
  };
  const pos = new Vector3();
  const tgt = new Vector3();
  const wantPos = new Vector3();
  const wantTgt = new Vector3();
  const ta = new Vector3();
  const tb = new Vector3();
  let first = true;

  function views(aspect) {
    const portrait = aspect < 0.82;
    const base = 2.5; // pad thickness: the book sits on the pad
    // closed book: three-quarter view from the front left
    const closedT = new Vector3(XH + WB / 2, base + 14, 6);
    const closedYaw = -0.5;
    const closedEl = 0.84;
    const closedD = fitDist(portrait ? 125 : 150, portrait ? 160 : 132, aspect) * 1.05;
    // open spread
    const readEl = portrait ? 1.08 : 0.98;
    const readT = portrait ? new Vector3(96, base + 22, 2) : new Vector3(0, base + 26, 4);
    const hx = portrait ? 112 : 228;
    // room above the spread for a standing miniature (~85 mm)
    const hy = (H / 2 + 12) * Math.sin(readEl) + 78 * Math.cos(readEl);
    const readD = fitDist(hx, hy, aspect);
    // close-up on the miniature
    const closeEl = portrait ? 0.78 : 0.62;
    const closeD = fitDist(portrait ? 92 : 108, 82, aspect);
    return { closedT, closedYaw, closedEl, closedD, readT, readEl, readD, closeEl, closeD, portrait };
  }

  function update(dt, now, aspect) {
    const v = views(aspect);
    // spring the drag offset back after a pause (not in the close-up)
    const idle = now - state.lastInput;
    if (idle > 1.4 && state.zoom < 0.5) {
      const k = 1 - Math.exp(-dt * 2.2);
      state.yaw += (0 - state.yaw) * k;
      state.pitch += (0 - state.pitch) * k;
    }
    state.zoom += (state.zoomTarget - state.zoom) * (1 - Math.exp(-dt * 3.2));
    const o = MathUtils.smoothstep(state.open, 0, 1);
    const z = MathUtils.smoothstep(state.zoom, 0, 1);
    // closed ↔ reading
    ta.copy(v.closedT).lerp(v.readT, o);
    const yaw0 = MathUtils.lerp(v.closedYaw, 0, o);
    const el0 = MathUtils.lerp(v.closedEl, v.readEl, o);
    const d0 = MathUtils.lerp(v.closedD, v.readD, o);
    // reading ↔ close
    tb.copy(state.focus);
    const yaw = MathUtils.lerp(yaw0, 0.16, z) + state.yaw;
    const el = MathUtils.clamp(MathUtils.lerp(el0, v.closeEl, z) + state.pitch, 0.28, 1.42);
    const d = MathUtils.lerp(d0, v.closeD, z) * state.userZoom;
    wantTgt.copy(ta).lerp(tb, z);
    viewFrom(wantTgt, yaw, el, d, wantPos);
    if (first) {
      pos.copy(wantPos);
      tgt.copy(wantTgt);
      first = false;
    }
    const k = 1 - Math.exp(-dt * 5.5);
    pos.lerp(wantPos, k);
    tgt.lerp(wantTgt, k);
    camera.position.copy(pos);
    camera.lookAt(tgt);
    // the portrait bottom sheet covers part of the screen: shift the image up
    const h = window.innerHeight;
    const w = window.innerWidth;
    if (state.sheet > 1) camera.setViewOffset(w, h, 0, state.sheet * 0.5, w, h);
    else if (camera.view && camera.view.enabled) camera.clearViewOffset();
    camera.updateProjectionMatrix();
    return v;
  }

  return {
    state,
    update,
    snap() {
      first = true;
    },
    drag(dx, dy, now) {
      state.lastInput = now;
      const close = state.zoom > 0.5;
      state.yaw = MathUtils.clamp(state.yaw - dx * 0.0042, close ? -1.0 : -0.42, close ? 1.0 : 0.42);
      state.pitch = MathUtils.clamp(state.pitch + dy * 0.003, close ? -0.3 : -0.2, close ? 0.45 : 0.16);
    },
    zoomBy(f, now) {
      state.lastInput = now;
      state.userZoom = MathUtils.clamp(state.userZoom * f, 0.55, 1.3);
    },
    get position() {
      return pos;
    },
    get target() {
      return tgt;
    }
  };
}
