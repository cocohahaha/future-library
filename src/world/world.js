import * as THREE from 'three';
import { SUN_DIR, PAL, LAYER_REFLECT } from '../core/config.js';
import { U, ensurePatched } from '../core/materials.js';
import { createKit } from '../core/kit.js';
import { Builder } from '../core/builder.js';
import { createSky } from './sky.js';
import { createMountains } from './mountains.js';
import { createTerrain } from './terrain.js';
import { createWater } from './water.js';
import { buildSite } from './site.js';
import { plantWorld } from './planting.js';
import { furnish } from './furnish.js';
import { createFx } from './fx.js';
import * as layout from './layout.js';
import { createTrees } from '../nature/trees.js';
import { createBamboo, createGrass, createRocks, createWaterPlants } from '../nature/ground.js';
import { defineProps, createHalos } from '../props/props.js';
import { createCrowd } from '../props/figures.js';
import { createLife } from '../life/life.js';
import { ZONES } from '../zones/data.js';
import { createWell } from '../zones/well.js';
import { createProvenance } from '../zones/provenance.js';
import { createDialogue } from '../zones/dialogue.js';
import { createQuiet } from '../zones/quiet.js';
import { createVerify } from '../zones/verify.js';

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

// Builds the whole valley into `scene`, reporting progress (0..1).
export async function buildWorld({ scene, tier, world, onProgress = () => {} }) {
  const t0 = performance.now();
  const step = async (p, label) => {
    onProgress(p, label);
    await nextFrame();
  };

  const kit = createKit(tier);
  defineProps(kit, tier);
  scene.fog = new THREE.FogExp2(0xffffff, 0.00125);

  // ---- sky, ranges, terrain
  const sky = createSky();
  sky.mesh.layers.enable(LAYER_REFLECT);
  scene.add(sky.mesh);
  const mountains = createMountains({ low: tier.name === 'low' });
  mountains.traverse((o) => o.layers.enable(LAYER_REFLECT));
  scene.add(mountains);
  const terrain = createTerrain({ tier });
  scene.add(terrain.mesh);
  await step(0.12, 'terrain');

  // ---- architecture
  const site = buildSite(kit, tier);
  for (const g of site.groups) scene.add(g);
  scene.add(site.plaques);
  await step(0.4, 'architecture');

  // ---- zones (interiors, events), people and furnishing
  const crowd = createCrowd(tier, { terrainHeight: layout.terrainHeight });
  const fx = createFx();
  scene.add(fx.group);
  const ZB = new Builder(21);
  ZB.instancer = kit.instancer;
  const ctx = { tier, kit, B: ZB, crowd, fx, world, anchors: site.anchors };
  const builders = { well: createWell, provenance: createProvenance, dialogue: createDialogue, quiet: createQuiet, verify: createVerify };
  const zones = ZONES.map((def) => builders[def.id](def, ctx));
  for (const z of zones) scene.add(z.group);
  furnish({ B: ZB, kit, crowd, tier, anchors: site.anchors });
  scene.add(ZB.build(kit.buckets, 'furnishing'));
  await step(0.55, 'interiors');

  // ---- vegetation
  const trees = createTrees(tier);
  const bamboo = createBamboo(tier);
  const grass = createGrass(tier);
  const rocks = createRocks(tier);
  const plants = createWaterPlants(tier);
  plantWorld({ trees, bamboo, grass, rocks, plants, tier, groundMap: terrain.map, anchors: site.anchors });
  for (const x of [trees, bamboo, grass, rocks, plants]) scene.add(x.build().group);
  await step(0.75, 'gardens');

  // ---- water, instanced parts, people, life
  const water = createWater(tier);
  scene.add(water.group);
  scene.add(kit.instancer.build().group);
  scene.add(createHalos(kit.halos));
  scene.add(crowd.build().group);
  const life = createLife({ tier, kit, layout, water, anchors: site.anchors });
  scene.add(life.group);
  await step(0.88, 'life');

  // ---- light: one low warm sun (static shadow map) + sky fill + a roaming zone lamp
  const hemi = new THREE.HemisphereLight(0xb4c2d2, 0x8a6a4c, 2.1);
  const sun = new THREE.DirectionalLight(PAL.sun, 3.4);
  const focus = new THREE.Vector3(-2, 0, 12);
  sun.position.copy(focus).addScaledVector(SUN_DIR, 420);
  sun.target.position.copy(focus);
  sun.castShadow = true;
  sun.shadow.mapSize.set(tier.shadow[0], tier.shadow[1]);
  const sc = sun.shadow.camera;
  sc.left = -112;
  sc.right = 112;
  sc.top = 52;
  sc.bottom = -52;
  sc.near = 250;
  sc.far = 640;
  sun.shadow.bias = -0.00035;
  sun.shadow.normalBias = 0.045;
  sun.shadow.radius = tier.shadowSoft ? 3 : 1;
  scene.add(hemi, sun, sun.target);
  let zoneLamp = null;
  if (tier.name === 'high') {
    zoneLamp = new THREE.PointLight(PAL.lamp, 0, 14, 1.6);
    zoneLamp.position.set(0, 3, 0);
    scene.add(zoneLamp);
  }

  // every material gets the shared uniforms (fog, sky, wind, lamps)
  scene.traverse((o) => {
    if (!o.material) return;
    (Array.isArray(o.material) ? o.material : [o.material]).forEach(ensurePatched);
  });
  await step(0.95, 'lights');
  console.info(`[world] built in ${(performance.now() - t0).toFixed(0)} ms`);

  // ---- per-frame
  let lampTarget = null;
  const lampPos = new THREE.Vector3();
  return {
    kit,
    zones,
    water,
    sun,
    hemi,
    sky,
    terrain,
    crowd,
    fx,
    anchors: site.anchors,
    setFocusZone(zone) {
      lampTarget = zone;
      if (zone && zoneLamp) zoneLamp.position.set(zone.lamp.x, zone.lamp.y, zone.lamp.z);
    },
    update(t, dt, speed, hush) {
      // global mood: the hush dims the sun a little and calms the wind
      sun.intensity = 3.4 - hush * 0.8;
      U.uSkyDim.value = 1 - hush * 0.08;
      U.uWind.value.set(0.75, 0.32).multiplyScalar(1 - hush * 0.7);
      U.uLamp.value = 1 + hush * 0.35;
      crowd.update(dt, speed, t);
      life.update(dt, speed);
      fx.update(dt);
      for (const z of zones) z.update(t, dt);
      if (zoneLamp) {
        const z = lampTarget;
        const target = z ? z.lamp.intensity * (0.5 + z.focusMix * 0.6 + z.energy * 1.4) : 0;
        zoneLamp.intensity += (target - zoneLamp.intensity) * Math.min(1, dt * 3);
        if (z) zoneLamp.distance = z.lamp.distance;
      }
    }
  };
}
