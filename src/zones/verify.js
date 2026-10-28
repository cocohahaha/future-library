import * as THREE from 'three';
import { createZoneBase, view, easeInOut } from './common.js';
import { rng } from '../core/rng.js';
import { getLang, scrollText } from '../i18n.js';
import { patch } from '../core/materials.js';
import { MAT } from '../core/builder.js';
import { PAL } from '../core/config.js';
import { bench, table, bookPile, noticeBoard, hangingLantern, lanternPost } from '../props/props.js';

// Verification Commons (公共核验台): an open hall facing a public square. A
// claim hangs as a scroll on a timber frame. Activation: a reading rule
// sweeps down the scroll ticking each source in turn; then the cinnabar seal
// (印章) lifts from its stand and stamps the claim in public, and the
// evidence tags turn celadon. The audience on the square watches.

const SW = 512;
const SH = 760;
const SCROLL_W = 2.1;
const SCROLL_H = (SCROLL_W * SH) / SW;
const SOURCE_Y0 = 372;
const SOURCE_DY = 54;
const SEAL_CY = 640;
const SEAL_PX = 118;
const SERIF_ZH = '"Noto Serif SC", "Source Han Serif SC", "Songti SC", STSong, "SimSun", serif';
const SERIF_EN = 'Georgia, "Iowan Old Style", "Noto Serif", serif';

function drawScroll(c, checked, sealed) {
  const g = c.getContext('2d');
  const copy = scrollText();
  const zh = getLang() === 'zh';
  const serif = zh ? SERIF_ZH : SERIF_EN;
  const rand = rng(4);
  g.fillStyle = '#c4ad84';
  g.fillRect(0, 0, SW, SH);
  g.fillStyle = '#f4ecdc';
  g.fillRect(26, 34, SW - 52, SH - 68);
  for (let i = 0; i < 500; i++) {
    g.fillStyle = `rgba(${rand() < 0.5 ? '255,250,240' : '120,96,70'},0.04)`;
    g.beginPath();
    g.arc(26 + rand() * (SW - 52), 34 + rand() * (SH - 68), 4 + rand() * 26, 0, Math.PI * 2);
    g.fill();
  }
  g.textBaseline = 'alphabetic';
  g.fillStyle = 'rgba(36,32,29,0.6)';
  g.font = `500 ${zh ? 24 : 22}px ${serif}`;
  g.fillText(copy.number, 58, 94);
  g.fillRect(58, 110, SW - 116, 2);
  g.fillStyle = '#24201d';
  g.font = `${zh ? 600 : 'italic 400'} ${zh ? 40 : 37}px ${serif}`;
  copy.claim.forEach((l, i) => g.fillText(l, 58, 176 + i * 54));
  g.font = `${zh ? 26 : 24}px ${serif}`;
  copy.sources.forEach((s, i) => {
    const y = SOURCE_Y0 + i * SOURCE_DY;
    const done = i < checked;
    if (done) {
      g.strokeStyle = '#b0432c';
      g.lineWidth = 5;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(60, y - 10);
      g.lineTo(70, y);
      g.lineTo(88, y - 24);
      g.stroke();
    } else {
      g.strokeStyle = 'rgba(36,32,29,0.35)';
      g.lineWidth = 2;
      g.beginPath();
      g.arc(74, y - 9, 10, 0, Math.PI * 2);
      g.stroke();
    }
    g.fillStyle = done ? '#24201d' : 'rgba(36,32,29,0.7)';
    g.fillText(s, 104, y);
  });
  g.save();
  g.translate(SW / 2, SEAL_CY);
  if (sealed) {
    g.rotate(-0.04);
    g.fillStyle = '#b0432c';
    g.fillRect(-SEAL_PX / 2, -SEAL_PX / 2, SEAL_PX, SEAL_PX);
    g.fillStyle = '#f4ecdc';
    for (let i = 0; i < 40; i++) g.fillRect((rand() - 0.5) * SEAL_PX, (rand() < 0.5 ? -1 : 1) * SEAL_PX * 0.5 - 2 + rand() * 4, 2 + rand() * 3, 2 + rand() * 3);
    g.strokeStyle = '#f4ecdc';
    g.lineWidth = 3;
    g.strokeRect(-SEAL_PX / 2 + 8, -SEAL_PX / 2 + 8, SEAL_PX - 16, SEAL_PX - 16);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `700 ${zh ? 40 : 30}px ${serif}`;
    g.fillText(copy.seal[0], 0, -22);
    g.fillText(copy.seal[1], 0, 24);
  } else {
    g.setLineDash([8, 8]);
    g.strokeStyle = 'rgba(192,138,62,0.9)';
    g.lineWidth = 3;
    g.strokeRect(-SEAL_PX / 2, -SEAL_PX / 2, SEAL_PX, SEAL_PX);
    g.setLineDash([]);
    g.fillStyle = '#a8742f';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `600 ${zh ? 28 : 19}px ${serif}`;
    g.fillText(copy.pending, 0, 0);
  }
  g.restore();
}

export function createVerify(def, ctx) {
  const A = ctx.anchors.verify;
  const zone = createZoneBase(def, { hit: [A.W + 3, 9, A.D + 8], hitOffset: [0, 0, 2] });
  const g = zone.group;
  const { B, crowd, kit } = ctx;
  const rand = rng(31);
  const X = A.x;
  const Z = A.z;
  const Y = A.floor;
  const fz = Z - 1.0; // frame plane
  const SCROLL_Y = Y + 2.75;
  zone.lamp = { x: X, y: Y + 3, z: Z + 1.5, intensity: 8, distance: 14 };

  // timber frame in the centre bay
  const fw = 4.2;
  for (const sx of [-1, 1]) {
    B.box('solid', 0x5e3c28, 0.2, 4.9, 0.2, X + sx * (fw / 2), Y, fz - 0.15, { kind: MAT.wood, chamfer: 0.02 });
    B.box('solid', 0x5e3c28, 0.5, 0.25, 0.9, X + sx * (fw / 2), Y, fz - 0.15, { kind: MAT.wood });
  }
  B.box('solid', 0x5e3c28, fw + 0.5, 0.22, 0.26, X, Y + 4.9, fz - 0.15, { kind: MAT.wood, chamfer: 0.02 });

  // the scroll (canvas repainted per state and language)
  const scrollCanvas = document.createElement('canvas');
  scrollCanvas.width = SW;
  scrollCanvas.height = SH;
  const scrollTex = new THREE.CanvasTexture(scrollCanvas);
  scrollTex.colorSpace = THREE.SRGBColorSpace;
  scrollTex.anisotropy = 8;
  let shown = { checked: -1, sealed: null, lang: null };
  const paint = (checked, sealed) => {
    const lang = getLang();
    if (shown.checked === checked && shown.sealed === sealed && shown.lang === lang) return;
    shown = { checked, sealed, lang };
    drawScroll(scrollCanvas, checked, sealed);
    scrollTex.needsUpdate = true;
  };
  paint(0, false);
  const scroll = new THREE.Mesh(
    new THREE.PlaneGeometry(SCROLL_W, SCROLL_H),
    patch(new THREE.MeshStandardMaterial({ map: scrollTex, roughness: 0.92, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: scrollTex, emissiveIntensity: 0.12 }), 'scroll')
  );
  scroll.position.set(X, SCROLL_Y, fz);
  scroll.castShadow = true;
  g.add(scroll);
  const rollerMat = patch(new THREE.MeshStandardMaterial({ color: 0x3b2619, roughness: 0.6 }), 'roller');
  const rollerGeo = new THREE.CylinderGeometry(0.05, 0.05, SCROLL_W + 0.24, 10);
  rollerGeo.rotateZ(Math.PI / 2);
  for (const sy of [1, -1]) {
    const r = new THREE.Mesh(rollerGeo, rollerMat);
    r.position.set(X, SCROLL_Y + (sy * SCROLL_H) / 2, fz + 0.02);
    r.castShadow = true;
    g.add(r);
  }
  B.rod('solid', 0x3a2a20, X - 0.7, SCROLL_Y + SCROLL_H / 2, fz, X, Y + 4.85, fz - 0.1, 0.01, { seg: 3 });
  B.rod('solid', 0x3a2a20, X + 0.7, SCROLL_Y + SCROLL_H / 2, fz, X, Y + 4.85, fz - 0.1, 0.01, { seg: 3 });

  // reading rule with a soft band of lamplight
  const rule = new THREE.Group();
  const ruleBar = new THREE.Mesh(new THREE.BoxGeometry(SCROLL_W + 0.4, 0.06, 0.06), patch(new THREE.MeshStandardMaterial({ color: 0x9a6a45, roughness: 0.6 }), 'rule'));
  const band = new THREE.Mesh(
    new THREE.PlaneGeometry(SCROLL_W, 0.34),
    patch(new THREE.MeshBasicMaterial({ color: 0xfff1d0, transparent: true, opacity: 0, depthWrite: false }), 'band')
  );
  band.position.set(0, -0.18, -0.02);
  rule.add(ruleBar, band);
  rule.position.set(X, SCROLL_Y + SCROLL_H / 2, fz + 0.1);
  rule.visible = false;
  g.add(rule);

  // the seal and its stone stand
  B.cyl('solid', 0xbfb19a, 0.42, 1.0, X + 2.6, Y, fz + 1.3, { rTop: 0.36, seg: 8, kind: MAT.stone });
  const seal = new THREE.Group();
  const SEAL_SIZE = (SEAL_PX / SW) * SCROLL_W;
  const body = new THREE.Mesh(new THREE.BoxGeometry(SEAL_SIZE, 0.6, SEAL_SIZE), patch(new THREE.MeshStandardMaterial({ color: 0xc7b79a, roughness: 0.5 }), 'sealBody'));
  body.position.y = 0.3;
  const face = new THREE.Mesh(new THREE.BoxGeometry(SEAL_SIZE * 1.01, 0.04, SEAL_SIZE * 1.01), patch(new THREE.MeshStandardMaterial({ color: PAL.cinnabar, roughness: 0.8 }), 'sealFace'));
  face.position.y = 0.02;
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 10), patch(new THREE.MeshStandardMaterial({ color: 0x6f8f7c, roughness: 0.3 }), 'sealKnob'));
  knob.position.y = 0.68;
  knob.scale.y = 0.8;
  seal.add(body, face, knob);
  seal.traverse((o) => o.isMesh && (o.castShadow = true));
  g.add(seal);
  const sealRest = new THREE.Vector3(X + 2.6, Y + 1.0, fz + 1.3);
  const sealPrintY = SCROLL_Y + (0.5 - SEAL_CY / SH) * SCROLL_H;
  const sealNear = new THREE.Vector3(X, sealPrintY, fz + 0.9);
  const sealContact = new THREE.Vector3(X, sealPrintY, fz + 0.03);
  seal.position.copy(sealRest);

  // evidence tags hanging from the beam
  const tagGeo = new THREE.PlaneGeometry(0.26, 0.4);
  const tagPaper = new THREE.Color(PAL.paper);
  const tagDone = new THREE.Color(0xc9dccf);
  const tags = [-1.55, -1.3, 1.3, 1.55].map((x, i) => {
    const pivot = new THREE.Group();
    pivot.position.set(X + x, Y + 4.78, fz - 0.05 + (i % 2) * 0.12);
    const mat = patch(new THREE.MeshStandardMaterial({ color: PAL.paper, roughness: 0.95, side: THREE.DoubleSide }), 'evidence');
    const m = new THREE.Mesh(tagGeo, mat);
    m.position.y = -0.55 - (i % 2) * 0.35;
    const string = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, m.position.y + 0.2, 0)]),
      patch(new THREE.LineBasicMaterial({ color: PAL.cinnabar }), 'string')
    );
    pivot.add(m, string);
    pivot.userData.phase = i * 1.7;
    g.add(pivot);
    return { pivot, mat };
  });

  // examiners' desks with ledgers
  for (const sx of [-1, 1]) {
    table(B, X + sx * 4.4, Y, Z + 0.6, 0, 1.8, 0.8, 0.8, 0x6a4630);
    bookPile(B, X + sx * 4.4 - 0.4, Y + 0.8, Z + 0.6, 4, rand);
    crowd.place('stand', X + sx * 4.4, Y, Z - 0.3, 0, sx < 0 ? 0x3d4a5c : 0x6a3a3e, `exam${sx}`);
  }
  crowd.place('stand', X - 1.6, Y, Z + 2.4, 0.4, 0xe8e2d4);
  crowd.place('stand', X + 1.7, Y, Z + 2.6, -0.5, 0x7a9a8a);
  // lanterns at the eaves and along the square
  for (const sx of [-1, 1]) hangingLantern(kit, B, X + sx * 2.6, Y + 3.7, Z + A.D / 2 + 0.85, 'red', Y + 4.6);

  // ---- the public square: benches facing the hall, audience, notice boards
  const sq0 = Z + A.D / 2 + 4.5;
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 4; c++) {
      const bx = X - 7.2 + c * 4.8;
      const bz = sq0 + r * 3.2;
      bench(B, bx, 0, bz, 0, 3.2, 0x5a3e2a);
      for (let k = 0; k < 3; k++) {
        if (rand() < 0.38) continue;
        crowd.place(rand() < 0.2 ? 'sitRead' : 'sit', bx - 1.0 + k * 1.0, 0, bz + 0.05, Math.PI, null);
      }
    }
  for (let k = 0; k < 3; k++) noticeBoard(B, 52.2, 0, -16 + k * 6.2, -Math.PI / 2, 3.4, rand);
  crowd.place('stand', 50.6, 0, -13.2, Math.PI / 2, null);
  crowd.place('stand', 50.4, 0, -7, Math.PI / 2 + 0.3, null);
  crowd.place('stand', 50.8, 0, -1.4, Math.PI / 2 - 0.2, null);
  for (const [lx, lz] of [
    [24, -18],
    [47, -18],
    [24, 1],
    [47, 1]
  ])
    lanternPost(kit, B, lx, 0, lz);

  // state machine: idle → reading → stamping → sealed → idle
  let state = 'idle';
  let stateT = 0;
  let sealedMix = 0;
  const setState = (s) => {
    state = s;
    stateT = 0;
  };
  const READ = 2.8;
  const STAMP = 2.2;
  const sourceWorldY = (i) => SCROLL_Y + (0.5 - (SOURCE_Y0 + i * SOURCE_DY - 10) / SH) * SCROLL_H;

  zone.activate = () => {
    zone.trigger();
    sealedMix = 0;
    paint(0, false);
    seal.position.copy(sealRest);
    seal.rotation.set(0, 0, 0);
    setState('reading');
  };
  zone.onLang = () => paint(shown.checked, shown.sealed);

  zone.update = (t, dt) => {
    zone.baseUpdate(dt);
    stateT += dt;
    if (state === 'reading') {
      const k = Math.min(1, stateT / READ);
      const y = SCROLL_Y + SCROLL_H / 2 - easeInOut(k) * (SCROLL_H - 0.2);
      rule.visible = true;
      rule.position.y = y;
      band.material.opacity = 0.45 * Math.sin(k * Math.PI);
      let checked = 0;
      for (let i = 0; i < 4; i++) if (y < sourceWorldY(i)) checked = i + 1;
      paint(checked, false);
      if (k >= 1) {
        rule.visible = false;
        setState('stamping');
      }
    } else if (state === 'stamping') {
      const k = stateT / STAMP;
      if (k < 0.35) {
        const u = easeInOut(k / 0.35);
        seal.position.lerpVectors(sealRest, sealNear, u);
        seal.position.y += Math.sin(u * Math.PI) * 0.6;
        seal.rotation.x = (Math.PI / 2) * u;
      } else if (k < 0.5) {
        seal.position.lerpVectors(sealNear, sealContact, easeInOut((k - 0.35) / 0.15));
      } else if (k < 0.62) {
        if (!shown.sealed) {
          paint(4, true);
          ctx.fx.pulse(X, Z + A.D / 2 + 6, 12);
        }
        seal.position.lerpVectors(sealContact, sealNear, easeInOut((k - 0.5) / 0.12));
      } else if (k < 1) {
        const u = easeInOut((k - 0.62) / 0.38);
        seal.position.lerpVectors(sealNear, sealRest, u);
        seal.position.y += Math.sin(u * Math.PI) * 0.6;
        seal.rotation.x = (Math.PI / 2) * (1 - u);
      } else {
        seal.position.copy(sealRest);
        seal.rotation.x = 0;
        setState('sealed');
      }
      sealedMix = shown.sealed ? Math.min(1, sealedMix + dt * 1.5) : 0;
    } else if (state === 'sealed') {
      sealedMix = Math.min(1, sealedMix + dt * 1.5);
      if (stateT > 14) {
        paint(0, false);
        setState('idle');
      }
    } else {
      sealedMix = Math.max(0, sealedMix - dt * 0.8);
    }
    scroll.rotation.y = Math.sin(t * 0.35) * 0.035;
    for (const tag of tags) {
      tag.pivot.rotation.z = Math.sin(t * 0.9 + tag.pivot.userData.phase) * 0.08;
      tag.pivot.rotation.x = Math.sin(t * 0.6 + tag.pivot.userData.phase) * 0.05;
      tag.mat.color.copy(tagPaper).lerp(tagDone, sealedMix);
    }
  };

  zone.cameraView = view(X + 2.8, 4.1, Z + A.D / 2 + 9.5, X, Y + 2.6, fz);
  return zone;
}
