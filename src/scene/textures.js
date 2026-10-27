import * as THREE from 'three';

// All textures are drawn at runtime: no image downloads.

export function makeGlowTexture(size = 128) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.18, 'rgba(255,255,255,0.55)');
  grd.addColorStop(0.45, 'rgba(255,255,255,0.12)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 4×4 atlas of "knowledge glyphs" from many scripts and notations.
export const GLYPHS = ['?', '∑', 'λ', 'ψ', '∞', '文', 'א', 'Ω', '¶', '§', 'φ', 'ア', '∂', '≈', '◊', 'ॐ'];

export function makeGlyphAtlas(cell = 64) {
  const size = cell * 4;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = `${Math.round(cell * 0.62)}px "Iowan Old Style", Georgia, "Noto Serif", serif`;
  g.shadowColor = 'rgba(255,255,255,0.9)';
  g.shadowBlur = cell * 0.08;
  GLYPHS.forEach((ch, i) => {
    const x = (i % 4) * cell + cell / 2;
    const y = Math.floor(i / 4) * cell + cell / 2 + cell * 0.03;
    g.fillText(ch, x, y);
  });
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

export function makeGlowSprite(texture, color, scale = 1, opacity = 1) {
  const mat = new THREE.SpriteMaterial({
    map: texture,
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const s = new THREE.Sprite(mat);
  s.scale.setScalar(scale);
  return s;
}
