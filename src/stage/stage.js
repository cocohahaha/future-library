import {
  Scene,
  Color,
  Fog,
  Mesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
  SpotLight,
  HemisphereLight,
  PointLight,
  Object3D,
  PMREMGenerator,
  BackSide,
  CanvasTexture,
  Vector2,
  Vector3,
  Group,
  SRGBColorSpace
} from 'three';
import { PAL, WINDOW_DIR } from '../core/config.js';
import { plane, prism, roundRectPoly, box, xf } from '../core/geo.js';
import { KEY } from '../book/materials.js';

// The desk: pale oak boards, a slate-blue linoleum pad, and daylight from a
// window on the reader's left. One window direction drives everything: the
// key light (a spot carrying a window "cookie", so mullion shadows fall on
// the desk), the environment map (a procedural grey room whose bright window
// sits in the same direction, baked with PMREM) and the hemisphere fill.
// Point lights in a small fixed pool are parked on the lamps of whichever
// miniature is standing, so the light count (and the shaders) never change.

export const PAD = { w: 660, d: 440, h: 2.5, x: 0, z: 8 };

function windowCookie(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, size, size);
  const s = size / 512;
  // four tall panes in a steel frame; soft edges come from a blur
  g.filter = `blur(${7 * s}px)`;
  g.fillStyle = '#fff';
  const x0 = 58 * s;
  const y0 = 40 * s;
  const w = 396 * s;
  const h = 432 * s;
  const bar = 15 * s;
  const cols = 2;
  const rows = 2;
  const pw = (w - bar * (cols - 1)) / cols;
  const ph = (h - bar * (rows - 1)) / rows;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) g.fillRect(x0 + i * (pw + bar), y0 + j * (ph + bar), pw, ph);
  g.filter = 'none';
  // dappled leaves of a plant outside, very faint
  g.globalCompositeOperation = 'multiply';
  let seed = 11;
  const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  g.filter = `blur(${5 * s}px)`;
  for (let i = 0; i < 38; i++) {
    const cx = x0 + w * (0.62 + r() * 0.4);
    const cy = y0 + h * (0.05 + r() * 0.5);
    g.fillStyle = `rgba(${150 + r() * 60},${150 + r() * 60},${150 + r() * 60},1)`;
    g.beginPath();
    g.ellipse(cx, cy, (8 + r() * 16) * s, (4 + r() * 8) * s, r() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
  g.filter = 'none';
  g.globalCompositeOperation = 'source-over';
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

// grey room with a bright window, for reflections (built in metres)
function environment(renderer, size) {
  const room = new Scene();
  const add = (g, color, side) => {
    const m = new Mesh(g, new MeshBasicMaterial({ color, side }));
    room.add(m);
    return m;
  };
  add(xf(box(12, 5, 12), { t: [0, 1.6, 0] }), new Color(0.36, 0.35, 0.33), BackSide);
  add(xf(box(11.9, 0.02, 11.9), { t: [0, -0.88, 0] }), new Color(0.24, 0.2, 0.16));
  // window on the left wall, in the key light's direction
  const wd = new Vector3(WINDOW_DIR.x, 0, WINDOW_DIR.z).normalize();
  const center = wd.clone().multiplyScalar(5.9);
  const yaw = Math.atan2(wd.x, wd.z);
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++) {
      const pane = add(box(1.15, 1.25, 0.02), new Color(3.1, 3.25, 3.6).multiplyScalar(j ? 1.15 : 1));
      pane.position.set(center.x, 1.05 + j * 1.35, center.z);
      pane.rotation.y = yaw;
      pane.translateX((i - 0.5) * 1.25);
    }
  // warm bounce from the far wall, a softbox above
  const bounce = add(box(5, 2.5, 0.05), new Color(1.25, 1.12, 0.96));
  bounce.position.set(-center.x, 1.2, -center.z);
  bounce.rotation.y = yaw;
  const top = add(box(3, 0.05, 3), new Color(1.1, 1.1, 1.08));
  top.position.set(0, 4, 0);
  const pm = new PMREMGenerator(renderer);
  const rt = pm.fromScene(room, 0.035, 0.1, 30);
  pm.dispose();
  room.traverse((o) => {
    if (o.isMesh) {
      o.geometry.dispose();
      o.material.dispose();
    }
  });
  void size;
  return rt.texture;
}

export function createStage({ renderer, tier, textures }) {
  const scene = new Scene();
  scene.background = new Color(PAL.bg);
  scene.fog = new Fog(PAL.bg, 1600, 6200);
  scene.environment = environment(renderer, tier.env);
  scene.environmentIntensity = 0.62;

  // ---- desk
  const oak = textures.oak;
  for (const tex of [oak.map, oak.normalMap, oak.roughnessMap]) tex.repeat.set(1 / oak.size[0], 1 / oak.size[1]);
  const deskMat = new MeshStandardMaterial({
    map: oak.map,
    normalMap: oak.normalMap,
    roughnessMap: oak.roughnessMap,
    normalScale: new Vector2(0.45, 0.45),
    roughness: 1,
    envMapIntensity: 0.75
  });
  const desk = new Mesh(xf(plane(9000, 9000), { t: [300, 0, -800] }), deskMat);
  desk.receiveShadow = true;
  scene.add(desk);

  // ---- linoleum pad
  const lino = textures.lino;
  for (const tex of [lino.map, lino.normalMap, lino.roughnessMap]) tex.repeat.set(1 / lino.size[0], 1 / lino.size[1]);
  const padMat = new MeshStandardMaterial({
    map: lino.map,
    normalMap: lino.normalMap,
    roughnessMap: lino.roughnessMap,
    normalScale: new Vector2(0.6, 0.6),
    roughness: 1,
    envMapIntensity: 0.6
  });
  const pad = new Mesh(prism(roundRectPoly(PAD.w, PAD.d, 9, 6), PAD.h), padMat);
  pad.position.set(PAD.x, 0, PAD.z);
  pad.castShadow = true;
  pad.receiveShadow = true;
  scene.add(pad);

  // ---- daylight
  const target = new Object3D();
  target.position.set(40, 0, 0);
  scene.add(target);
  const key = new SpotLight(0xfff5ec, 3.5, 0, 0.2, 0.55, 0);
  key.position.copy(WINDOW_DIR).multiplyScalar(2700).add(target.position);
  key.target = target;
  key.castShadow = true;
  key.shadow.mapSize.set(tier.shadow, tier.shadow);
  key.shadow.camera.near = 1900;
  key.shadow.camera.far = 3500;
  key.shadow.bias = -0.00012;
  key.shadow.normalBias = 0.45;
  key.shadow.radius = tier.shadowRadius;
  key.shadow.focus = 1;
  key.map = windowCookie(tier.name === 'high' ? 512 : 256);
  scene.add(key);
  const hemi = new HemisphereLight(0xdde6f2, 0xc7aa86, 0.5);
  scene.add(hemi);

  const spills = [];
  for (let i = 0; i < 3; i++) {
    const p = new PointLight(0xffc98a, 0, 0, 2);
    p.position.set(0, -500, 0);
    scene.add(p);
    spills.push(p);
  }

  const keyDirW = new Vector3();
  const keyBase = key.intensity;
  return {
    scene,
    desk,
    pad,
    key,
    hemi,
    spills,
    keyBase,
    // per frame: shared light uniforms for the paper translucency
    update(camera) {
      keyDirW.copy(key.position).sub(target.position).normalize();
      KEY.uKeyDirV.value.copy(keyDirW).transformDirection(camera.matrixWorldInverse);
      KEY.uKeyCol.value.copy(key.color).multiplyScalar(key.intensity * 0.22);
    },
    // park the spill pool on a miniature's lamps: [{ pos: Vector3, color, intensity }]
    setSpills(list = []) {
      spills.forEach((p, i) => {
        const s = list[i];
        if (!s) {
          p.intensity = 0;
          p.position.set(0, -500, 0);
          return;
        }
        p.position.copy(s.pos);
        p.color.set(s.color || 0xffc98a);
        p.intensity = s.intensity;
      });
    }
  };
}

export { Group };
