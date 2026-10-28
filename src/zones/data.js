import { WELL, LIBRARY, DIALOGUE, QUIET, VERIFY } from '../world/layout.js';

// Zone identity and placement. All text (both languages) lives in ../i18n.js,
// keyed by the same zone `id`; positions come from the site plan.
export const ZONES = [
  { id: 'well', color: '#3e5c76', x: WELL.x, z: WELL.z, labelHeight: 10.2 },
  { id: 'provenance', color: '#b0432c', x: LIBRARY.x, z: LIBRARY.z, labelHeight: 17.8 },
  { id: 'dialogue', color: '#6b8a4e', x: DIALOGUE.x, z: DIALOGUE.z, labelHeight: 9.6 },
  { id: 'quiet', color: '#b07a2e', x: QUIET.x, z: QUIET.z, labelHeight: 10.6 },
  { id: 'verify', color: '#4f7d74', x: VERIFY.x, z: VERIFY.z, labelHeight: 11.4 }
];
