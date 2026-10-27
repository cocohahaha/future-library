// Layout and colour for every zone. All text (both languages) lives in
// ../i18n.js, keyed by the same zone `id`.
// `angle` places the zone on the ring around the central well (radians, 0 = +X).

// "Ink & Paper Courtyard at Dusk": mineral pigments on xuan paper.
export const PALETTE = {
  sky: 0xd9dcd4, // pale celadon-grey zenith
  haze: 0xecd9bd, // apricot horizon haze (also fog)
  paper: 0xf1e8d8, // xuan paper
  plaster: 0xe9e0d0, // whitewashed wall
  stone: 0xd2c6b2, // limestone
  tile: 0x4d4b49, // grey roof tile
  ink: 0x24201d, // sumi ink
  cedar: 0x8a5a3b, // aged cedar
  lacquer: 0x7b3624, // red-brown lacquer columns
  cinnabar: 0xb0432c, // seal red
  ochre: 0xc08a3e,
  ginkgo: 0xd8a83a,
  celadon: 0x7fa596,
  azurite: 0x3e5c76,
  bamboo: 0x6b8a4e,
  sun: 0xffd5a3,
  lamp: 0xffc98a
};

export const ZONE_RADIUS = 15;

export const ZONES = [
  { id: 'well', color: '#3e5c76', angle: null, labelHeight: 9.4 },
  { id: 'provenance', color: '#b0432c', angle: Math.PI * 0.25, labelHeight: 8.6 },
  { id: 'dialogue', color: '#6b8a4e', angle: Math.PI * 0.75, labelHeight: 5.4 },
  { id: 'quiet', color: '#b07a2e', angle: Math.PI * 1.25, labelHeight: 8.4 },
  { id: 'verify', color: '#4f7d74', angle: Math.PI * 1.75, labelHeight: 6.6 }
];
