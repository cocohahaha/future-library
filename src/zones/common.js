import * as THREE from 'three';
import { PALETTE, ZONE_RADIUS } from './data.js';

// Shared shell for every zone: placement on the ring (facing the well),
// an invisible hit volume for tap/click picking, a warm lamp light that
// responds to focus + activation, and a decaying `energy` value (0..1) that
// zone animations read to show their event.
export function createZoneBase(def, { hitRadius = 5, hitHeight = 8, lightY = 4, lightIntensity = 6, lightDistance = 16 } = {}) {
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
  // lamplight, not neon: every zone gets the same warm source
  const light = new THREE.PointLight(PALETTE.lamp, lightIntensity, lightDistance, 1.8);
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
      light.intensity = lightIntensity * (0.6 + zone.focusMix * 0.6 + zone.energy * 1.2);
    }
  };
  return zone;
}

// ---------------------------------------------------------------- materials
export const stone = (color = PALETTE.stone) => new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0 });
export const wood = (color = PALETTE.cedar) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0 });
export const paper = (map) =>
  new THREE.MeshStandardMaterial({ color: PALETTE.paper, map: map || null, roughness: 0.95, side: THREE.DoubleSide });

export function shadows(obj, cast = true, receive = true) {
  obj.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = cast;
      o.receiveShadow = receive;
    }
  });
  return obj;
}

// ---------------------------------------------------------------- seated figure
// A soft, faceless figure in undyed cloth: a cone-like robe and a round head.
const robeGeo = new THREE.CylinderGeometry(0.13, 0.32, 0.72, 10, 1);
robeGeo.translate(0, 0.36, 0);
const headGeo = new THREE.SphereGeometry(0.15, 12, 10);
const skinMat = new THREE.MeshStandardMaterial({ color: 0xc9a487, roughness: 0.8 });
const ROBES = [0xe4dccb, 0x9a8b74, 0x6f6a5c, 0xb7a383, 0x8f5a43, 0x5c6b63];
const robeMats = ROBES.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.95 }));

export function figure(i = 0) {
  const f = new THREE.Group();
  const robe = new THREE.Mesh(robeGeo, robeMats[i % robeMats.length]);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 0.86;
  f.add(robe, head);
  f.userData.head = head;
  return shadows(f, true, false);
}

export function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}
export function easeInOut(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
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
