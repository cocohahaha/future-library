import * as THREE from 'three';
import { createZoneBase, darkStone, viewFor, easeOutCubic } from './common.js';
import { makeGlowSprite } from '../scene/textures.js';
import { PALETTE } from './data.js';

const CLAIM = ['“Street trees cool', 'summer pavements by', 'up to 5 °C.”'];
const SOURCES = ['Field survey, 2031', 'Satellite thermal set', 'Model summary (AI)', 'Peer replication'];

function drawTablet(verified) {
  const W = 512;
  const H = 680;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  const accent = verified ? '#5fe3a1' : '#ffb454';

  g.fillStyle = 'rgba(8,12,30,0.92)';
  g.fillRect(0, 0, W, H);
  g.strokeStyle = accent;
  g.lineWidth = 6;
  g.strokeRect(14, 14, W - 28, H - 28);

  g.fillStyle = accent;
  g.font = '600 26px ui-monospace, Menlo, monospace';
  g.fillText('CLAIM № 2041-117', 44, 74);

  g.fillStyle = '#eef0ff';
  g.font = 'italic 40px Georgia, "Iowan Old Style", serif';
  CLAIM.forEach((l, i) => g.fillText(l, 44, 150 + i * 50));

  g.font = '24px ui-monospace, Menlo, monospace';
  SOURCES.forEach((s, i) => {
    const y = 340 + i * 46;
    g.fillStyle = verified ? accent : 'rgba(255,255,255,0.35)';
    g.fillText(verified ? '✓' : '○', 44, y);
    g.fillStyle = 'rgba(220,225,255,0.8)';
    g.fillText(s, 84, y);
  });

  // stamp
  g.save();
  g.translate(W / 2, 590);
  g.rotate(-0.06);
  g.strokeStyle = accent;
  g.lineWidth = 5;
  g.strokeRect(-170, -44, 340, 80);
  g.fillStyle = accent;
  g.font = '700 42px ui-monospace, Menlo, monospace';
  g.textAlign = 'center';
  g.fillText(verified ? 'VERIFIED' : 'UNVERIFIED', 0, 12);
  g.restore();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createVerify(def, ctx) {
  const zone = createZoneBase(def, { hitRadius: 5.5, hitHeight: 8, lightY: 4.5, lightIntensity: 30 });
  const g = zone.group;
  const amber = new THREE.Color(PALETTE.amber);
  const green = new THREE.Color(def.color);

  // bench + pedestal
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 1.2, 6), darkStone());
  pedestal.position.y = 0.6;
  const cap = new THREE.Mesh(
    new THREE.TorusGeometry(1.15, 0.04, 6, 6),
    new THREE.MeshBasicMaterial({ color: PALETTE.teal })
  );
  cap.rotation.x = -Math.PI / 2;
  cap.position.y = 1.22;
  g.add(pedestal, cap);

  [-3.2, 3.2].forEach((x) => {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 0.6), darkStone());
    bench.position.set(x, 0.25, 1.4);
    bench.rotation.y = x > 0 ? -0.5 : 0.5;
    g.add(bench);
  });

  // examiners
  const personMat = new THREE.MeshStandardMaterial({ color: 0x1a2440, emissive: 0x0f3a3a, emissiveIntensity: 0.6 });
  [-3, -2.3, 2.4, 3.1].forEach((x, i) => {
    const p = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.6, 4, 8), personMat);
    p.position.set(x, 0.9, 1.3 + (i % 2) * 0.15);
    g.add(p);
  });

  // floating claim tablet
  const texUnverified = drawTablet(false);
  const texVerified = drawTablet(true);
  const tabletMat = new THREE.MeshBasicMaterial({ map: texUnverified, transparent: true, side: THREE.DoubleSide });
  const tablet = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 3.2), tabletMat);
  tablet.position.y = 3.4;
  g.add(tablet);
  const tabletGlow = makeGlowSprite(ctx.glow, PALETTE.amber, 6, 0.35);
  tabletGlow.position.set(0, 3.4, -0.3);
  g.add(tabletGlow);

  // scanning ring
  const scanMat = new THREE.MeshBasicMaterial({ color: PALETTE.teal, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const scan = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.05, 8, 96), scanMat);
  scan.rotation.x = Math.PI / 2;
  g.add(scan);
  const scanDisc = new THREE.Mesh(
    new THREE.CircleGeometry(1.9, 64),
    new THREE.MeshBasicMaterial({ color: PALETTE.teal, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  );
  scanDisc.rotation.x = -Math.PI / 2;
  g.add(scanDisc);

  // evidence cards orbiting the claim
  const cards = [];
  const cardGeo = new THREE.PlaneGeometry(0.5, 0.65);
  for (let i = 0; i < 6; i++) {
    const m = new THREE.MeshBasicMaterial({ color: PALETTE.amber, transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false });
    const c = new THREE.Mesh(cardGeo, m);
    c.userData.a = (i / 6) * Math.PI * 2;
    g.add(c);
    cards.push(c);
  }

  // hexagonal seals that appear once verified
  const seals = [];
  const sealGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.06, 6);
  for (let i = 0; i < 5; i++) {
    const s = new THREE.Mesh(sealGeo, new THREE.MeshBasicMaterial({ color: def.color, transparent: true, opacity: 0 }));
    s.rotation.x = Math.PI / 2;
    s.userData.a = (i / 5) * Math.PI * 2;
    g.add(s);
    seals.push(s);
  }

  // state machine: idle → scanning → verified → (fade back) idle
  let state = 'idle';
  let stateT = 0;
  let verifiedMix = 0;
  const setState = (s) => {
    state = s;
    stateT = 0;
  };

  zone.activate = () => {
    zone.trigger();
    tabletMat.map = texUnverified;
    verifiedMix = 0;
    setState('scanning');
  };

  const tmp = new THREE.Color();
  zone.update = (t, dt) => {
    zone.baseUpdate(dt);
    stateT += dt;
    const SCAN = 2.6;

    if (state === 'scanning') {
      const k = Math.min(1, stateT / SCAN);
      const y = 1.6 + easeOutCubic(k) * 3.6;
      scan.position.y = scanDisc.position.y = y;
      const fade = Math.sin(k * Math.PI);
      scanMat.opacity = 0.9 * fade + 0.1;
      scanDisc.material.opacity = 0.12 * fade;
      if (k >= 1) {
        tabletMat.map = texVerified;
        setState('verified');
        ctx.env.pulse();
      }
    } else {
      scanMat.opacity = Math.max(0, scanMat.opacity - dt * 1.5);
      scanDisc.material.opacity = Math.max(0, scanDisc.material.opacity - dt);
    }

    if (state === 'verified') {
      verifiedMix = Math.min(1, verifiedMix + dt * 1.5);
      if (stateT > 12) setState('fading');
    } else if (state === 'fading') {
      verifiedMix = Math.max(0, verifiedMix - dt * 0.6);
      if (verifiedMix <= 0) {
        tabletMat.map = texUnverified;
        setState('idle');
      }
    }

    tablet.position.y = 3.4 + Math.sin(t * 0.8) * 0.1;
    tablet.rotation.y = Math.sin(t * 0.3) * 0.18;
    tabletGlow.material.color.copy(tmp.copy(amber).lerp(green, verifiedMix));
    tabletGlow.material.opacity = 0.3 + zone.focusMix * 0.15 + zone.energy * 0.3;

    const cardR = 2.6 - (state === 'scanning' ? 0.6 : 0);
    cards.forEach((c, i) => {
      const a = c.userData.a + t * 0.25 * ctx.world.speed;
      c.position.set(Math.cos(a) * cardR, 2.6 + Math.sin(t * 0.9 + i) * 0.35, Math.sin(a) * cardR - 0.4);
      c.lookAt(g.localToWorld(tmpV.set(0, c.position.y, 0)));
      c.material.color.copy(amber).lerp(green, verifiedMix);
    });

    seals.forEach((s, i) => {
      const a = s.userData.a + t * 0.6;
      s.position.set(Math.cos(a) * 1.6, 3.4 + Math.sin(a) * 1.9, 0.25);
      s.material.opacity = verifiedMix * 0.9;
      s.scale.setScalar(0.4 + verifiedMix * 0.6);
    });
  };

  const tmpV = new THREE.Vector3();
  zone.cameraView = viewFor(zone, 9.5, 4.8, 0.3, 3.0);
  return zone;
}
