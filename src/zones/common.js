import * as THREE from 'three';
import { ZONE_RADIUS } from './data.js';

// Shared shell for every zone: placement on the ring (facing the well),
// an invisible hit volume for tap/click picking, a coloured point light that
// responds to focus + activation, and a decaying `energy` value (0..1) that
// zone animations read to show their event.
export function createZoneBase(def, { hitRadius = 5, hitHeight = 8, lightY = 4, lightIntensity = 30, lightDistance = 22 } = {}) {
  const group = new THREE.Group();
  group.name = def.id;
  if (def.angle !== null) {
    group.position.set(Math.cos(def.angle) * ZONE_RADIUS, 0, Math.sin(def.angle) * ZONE_RADIUS);
    group.lookAt(0, 0, 0); // local +Z faces the well
  }

  const hit = new THREE.Mesh(
    new THREE.CylinderGeometry(hitRadius, hitRadius, hitHeight, 16, 1),
    new THREE.MeshBasicMaterial()
  );
  hit.position.y = hitHeight / 2;
  hit.visible = false; // raycaster still tests invisible meshes
  hit.userData.zoneId = def.id;
  group.add(hit);

  const color = new THREE.Color(def.color);
  const light = new THREE.PointLight(color, lightIntensity, lightDistance, 1.6);
  light.position.y = lightY;
  group.add(light);

  const zone = {
    def,
    group,
    color,
    light,
    hits: [hit],
    focused: false,
    focusMix: 0,
    energy: 0,
    anchor(out) {
      return out.set(group.position.x, def.labelHeight, group.position.z);
    },
    trigger() {
      zone.energy = 1;
    },
    baseUpdate(dt) {
      zone.energy = Math.max(0, zone.energy - dt * 0.28);
      zone.focusMix += ((zone.focused ? 1 : 0) - zone.focusMix) * Math.min(1, dt * 3);
      light.intensity = lightIntensity * (0.75 + zone.focusMix * 0.55 + zone.energy * 1.4);
    }
  };
  return zone;
}

export const darkStone = () =>
  new THREE.MeshStandardMaterial({ color: 0x111433, roughness: 0.55, metalness: 0.25 });

export function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

// Camera framing for a ring zone: stand between the zone and the well, a bit
// off-axis, looking back at the zone's face.
export function viewFor(zone, dist = 11, height = 6, sideAngle = 0.5, targetY = 2.8) {
  const p = zone.group.position;
  const toCentre = Math.atan2(-p.z, -p.x) + sideAngle;
  return {
    target: new THREE.Vector3(p.x, targetY, p.z),
    position: new THREE.Vector3(p.x + Math.cos(toCentre) * dist, height, p.z + Math.sin(toCentre) * dist)
  };
}
