import * as THREE from 'three';

// Shared shell for every zone: a group at the zone's place in the academy,
// invisible hit volumes for tap/click picking, a decaying `energy` value
// (0..1) the zone's event animation reads, and a smoothed focus value.
export function createZoneBase(def, { hit = [6, 7, 6], hitOffset = [0, 0, 0] } = {}) {
  const group = new THREE.Group();
  group.name = `zone:${def.id}`;
  const hitMat = new THREE.MeshBasicMaterial();
  hitMat.userData.loqPatched = true;
  const box = new THREE.Mesh(new THREE.BoxGeometry(hit[0], hit[1], hit[2]), hitMat);
  box.position.set(def.x + hitOffset[0], hit[1] / 2 + hitOffset[1], def.z + hitOffset[2]);
  box.visible = false; // raycaster still tests invisible meshes
  box.userData.zoneId = def.id;
  group.add(box);

  const zone = {
    def,
    group,
    hits: [box],
    focused: false,
    focusMix: 0,
    energy: 0,
    lamp: { x: def.x, y: 3, z: def.z, intensity: 6, distance: 14 },
    anchor(out) {
      return out.set(def.x, def.labelHeight, def.z);
    },
    trigger() {
      zone.energy = 1;
    },
    baseUpdate(dt) {
      zone.energy = Math.max(0, zone.energy - dt * 0.26);
      zone.focusMix += ((zone.focused ? 1 : 0) - zone.focusMix) * Math.min(1, dt * 3);
    },
    activate() {
      zone.trigger();
    },
    update(t, dt) {
      zone.baseUpdate(dt);
    }
  };
  return zone;
}

export function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}
export function easeInOut(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
export const view = (px, py, pz, tx, ty, tz) => ({ position: new THREE.Vector3(px, py, pz), target: new THREE.Vector3(tx, ty, tz) });
