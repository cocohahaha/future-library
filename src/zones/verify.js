import * as THREE from 'three';
import { createZoneBase, viewFor, wood, stone, figure, shadows, easeInOut } from './common.js';
import { rng } from '../scene/textures.js';
import { getLang, scrollText } from '../i18n.js';
import { PALETTE } from './data.js';

// A claim hangs as a scroll on a timber frame. Activation: a reading rule
// sweeps down the scroll, ticking each source in turn; then the cinnabar seal
// (印章) lifts from its stand and stamps the claim in public.

const SW = 512;
const SH = 760;
const SCROLL_W = 2.2;
const SCROLL_H = (SCROLL_W * SH) / SW;
const SCROLL_Y = 3.05;
const SOURCE_Y0 = 372; // canvas y of the first source line
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

  // silk mounting and paper
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
      // a quick cinnabar brush tick
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
    // worn edges: knock tiny flecks out of the seal print
    g.fillStyle = '#f4ecdc';
    for (let i = 0; i < 40; i++) g.fillRect((rand() - 0.5) * SEAL_PX, (rand() < 0.5 ? -1 : 1) * SEAL_PX * 0.5 - 2 + rand() * 4, 2 + rand() * 3, 2 + rand() * 3);
    g.strokeStyle = '#f4ecdc';
    g.lineWidth = 3;
    g.strokeRect(-SEAL_PX / 2 + 8, -SEAL_PX / 2 + 8, SEAL_PX - 16, SEAL_PX - 16);
    g.fillStyle = '#f4ecdc';
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
  const zone = createZoneBase(def, { hitRadius: 5.5, hitHeight: 7, lightY: 3.5, lightIntensity: 7 });
  const g = zone.group;

  const dais = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.95, 0.2, 6), stone(0xcfc3ae));
  dais.position.y = 0.1;
  g.add(shadows(dais));

  // timber frame
  const frameMat = wood(0x5e3c28);
  const postGeo = new THREE.BoxGeometry(0.2, 5.2, 0.2);
  [-1.75, 1.75].forEach((x) => {
    const p = new THREE.Mesh(postGeo, frameMat);
    p.position.set(x, 2.8, -0.15);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.9), frameMat);
    foot.position.set(x, 0.32, -0.15);
    g.add(shadows(p), shadows(foot));
  });
  const beam = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.22, 0.26), frameMat);
  beam.position.set(0, 5.3, -0.15);
  g.add(shadows(beam));

  // the scroll
  const scrollCanvas = document.createElement('canvas');
  scrollCanvas.width = SW;
  scrollCanvas.height = SH;
  const scrollTex = new THREE.CanvasTexture(scrollCanvas);
  scrollTex.colorSpace = THREE.SRGBColorSpace;
  scrollTex.anisotropy = 4;
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
    new THREE.MeshStandardMaterial({ map: scrollTex, roughness: 0.92, side: THREE.DoubleSide })
  );
  scroll.position.set(0, SCROLL_Y, 0);
  scroll.castShadow = true;
  g.add(scroll);
  const rollerGeo = new THREE.CylinderGeometry(0.05, 0.05, SCROLL_W + 0.24, 10);
  rollerGeo.rotateZ(Math.PI / 2);
  const rollerMat = wood(0x3b2619);
  const rTop = new THREE.Mesh(rollerGeo, rollerMat);
  rTop.position.set(0, SCROLL_Y + SCROLL_H / 2, 0.02);
  const rBot = rTop.clone();
  rBot.position.y = SCROLL_Y - SCROLL_H / 2;
  const cord = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.7, SCROLL_Y + SCROLL_H / 2, 0),
      new THREE.Vector3(0, 5.2, -0.1),
      new THREE.Vector3(0.7, SCROLL_Y + SCROLL_H / 2, 0)
    ]),
    new THREE.LineBasicMaterial({ color: 0x3a2a20 })
  );
  g.add(shadows(rTop), shadows(rBot), cord);

  // reading rule with a soft band of lamplight
  const rule = new THREE.Group();
  const ruleBar = new THREE.Mesh(new THREE.BoxGeometry(SCROLL_W + 0.4, 0.06, 0.06), wood(0x9a6a45));
  const band = new THREE.Mesh(
    new THREE.PlaneGeometry(SCROLL_W, 0.34),
    new THREE.MeshBasicMaterial({ color: 0xfff1d0, transparent: true, opacity: 0, depthWrite: false })
  );
  band.position.set(0, -0.18, -0.02);
  rule.add(ruleBar, band);
  rule.position.set(0, SCROLL_Y + SCROLL_H / 2, 0.1);
  rule.visible = false;
  g.add(rule);

  // the seal and its stone stand
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 1.0, 8), stone(0xbfb19a));
  stand.position.set(2.5, 0.7, 1.0);
  g.add(shadows(stand));
  const seal = new THREE.Group();
  const SEAL_SIZE = (SEAL_PX / SW) * SCROLL_W;
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(SEAL_SIZE, 0.6, SEAL_SIZE),
    new THREE.MeshStandardMaterial({ color: 0xc7b79a, roughness: 0.55 }) // soapstone
  );
  body.position.y = 0.3;
  const face = new THREE.Mesh(
    new THREE.BoxGeometry(SEAL_SIZE * 1.01, 0.04, SEAL_SIZE * 1.01),
    new THREE.MeshStandardMaterial({ color: PALETTE.cinnabar, roughness: 0.8 })
  );
  face.position.y = 0.02;
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), new THREE.MeshStandardMaterial({ color: 0x6f8f7c, roughness: 0.3 }));
  knob.position.y = 0.68;
  knob.scale.y = 0.8;
  seal.add(body, face, knob);
  shadows(seal);
  g.add(seal);
  const sealRest = new THREE.Vector3(2.5, 1.2, 1.0);
  const sealPrintY = SCROLL_Y + (0.5 - SEAL_CY / SH) * SCROLL_H;
  const sealNear = new THREE.Vector3(0, sealPrintY, 0.9);
  const sealContact = new THREE.Vector3(0, sealPrintY, 0.03);
  seal.position.copy(sealRest);

  // evidence tags hanging from the beam, tinted once the claim is sealed
  const tagGeo = new THREE.PlaneGeometry(0.26, 0.4);
  const tagPaper = new THREE.Color(PALETTE.paper);
  const tagDone = new THREE.Color(0xc9dccf);
  const tags = [-1.45, -1.25, 1.25, 1.45].map((x, i) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, 5.18, -0.05 + (i % 2) * 0.12);
    const m = new THREE.Mesh(tagGeo, new THREE.MeshStandardMaterial({ color: PALETTE.paper, roughness: 0.95, side: THREE.DoubleSide }));
    m.position.y = -0.55 - (i % 2) * 0.35;
    const string = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, m.position.y + 0.2, 0)]),
      new THREE.LineBasicMaterial({ color: PALETTE.cinnabar })
    );
    pivot.add(shadows(m), string);
    pivot.userData.phase = i * 1.7;
    g.add(pivot);
    return { pivot, mat: m.material };
  });

  // examiners on stone benches
  const benchMat = stone(0xbdb09a);
  [-2.6, 2.4].forEach((x) => {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 0.55), benchMat);
    bench.position.set(x, 0.42, 2.4);
    bench.rotation.y = x > 0 ? 0.45 : -0.45;
    g.add(shadows(bench));
    [-0.45, 0.45].forEach((dx, i) => {
      const f = figure(i + (x > 0 ? 3 : 0));
      f.position.set(x + dx * Math.cos(bench.rotation.y), 0.64, 2.4 - dx * Math.sin(bench.rotation.y));
      f.rotation.y = Math.PI + bench.rotation.y;
      g.add(f);
    });
  });

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
      // lift → approach → press → withdraw → return
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
          ctx.env.pulse(g.position.x, g.position.z, 9);
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

    scroll.rotation.y = Math.sin(t * 0.35) * 0.04;
    for (const tag of tags) {
      tag.pivot.rotation.z = Math.sin(t * 0.9 + tag.pivot.userData.phase) * 0.08;
      tag.pivot.rotation.x = Math.sin(t * 0.6 + tag.pivot.userData.phase) * 0.05;
      tag.mat.color.copy(tagPaper).lerp(tagDone, sealedMix);
    }
  };

  zone.cameraView = viewFor(zone, 9.5, 4.2, 0.3, 2.8);
  return zone;
}
