// Content for every zone: shown in the HUD panel, labels and zone bar.
// `angle` places the zone on the ring around the central well (radians, 0 = +X).
export const PALETTE = {
  bg: 0x05060f,
  fog: 0x080b1d,
  indigo: 0x5b4bff,
  violet: 0x8a6bff,
  teal: 0x3fd6c8,
  amber: 0xffb454,
  ember: 0xff7a3d,
  ink: 0x0c0f22
};

export const ZONE_RADIUS = 15;

export const ZONES = [
  {
    id: 'well',
    short: 'Well',
    name: 'The Question Well',
    kicker: 'Centre · Atrium',
    color: '#ffb454',
    angle: null,
    labelHeight: 8.4,
    body:
      'Visitors drop half-formed questions into the well. Refined versions rise as glyphs into the armillary above. Answers are cheap now, so the library spends its effort on better questions.',
    before: 'A search desk and a catalogue: you arrived with a query and left with items.',
    after: 'A question studio: librarians help you sharpen what you are actually asking.',
    action: 'Ripple the well'
  },
  {
    id: 'provenance',
    short: 'Stacks',
    name: 'Provenance Stacks',
    kicker: 'Zone 2 · Lineage',
    color: '#3fd6c8',
    angle: Math.PI * 0.25,
    labelHeight: 9.2,
    body:
      'Every book, paper and generated summary shows its lineage as threads of light back to its sources, human or machine. Visitors read the threads as well as the text.',
    before: 'Shelves sorted by subject; sources hidden in footnotes nobody followed.',
    after: 'Shelves sorted by lineage; every claim visibly tethered to where it came from.',
    action: 'Light the lineage'
  },
  {
    id: 'dialogue',
    short: 'Dialogue',
    name: 'Dialogue Alcoves',
    kicker: 'Zone 3 · Seminar',
    color: '#8a6bff',
    angle: Math.PI * 0.75,
    labelHeight: 6.6,
    body:
      'Small groups sit in rings with several AI tutors that are designed to disagree. Nobody gets one oracle; people learn by watching arguments collide and then taking a side.',
    before: 'Quiet carrels for solitary study; group rooms booked by the hour.',
    after: 'Seminar rings where humans moderate machine disagreement out loud.',
    action: 'Start the argument'
  },
  {
    id: 'quiet',
    short: 'Unassisted',
    name: 'The Unassisted Room',
    kicker: 'Zone 4 · Refuge',
    color: '#ffcf8a',
    angle: Math.PI * 1.25,
    labelHeight: 6.8,
    body:
      'There are no screens or assistants here, only paper, lamplight and long tables. Slow, unaided attention is the scarce resource now, and the library protects it on purpose.',
    before: 'Silence was a rule enforced by shushing.',
    after: 'Silence is a designed refuge — the most requested room in the building.',
    action: 'Hush the library'
  },
  {
    id: 'verify',
    short: 'Verify',
    name: 'Verification Commons',
    kicker: 'Zone 5 · Trust',
    color: '#5fe3a1',
    angle: Math.PI * 1.75,
    labelHeight: 7.6,
    body:
      'Claims, generated or not, are put on the bench and tested in public. Sources are checked, results are stamped, and the record of who checked what stays open to everyone.',
    before: 'Trust was implied by the publisher’s logo on the spine.',
    after: 'Trust is earned in the open, one stamped claim at a time.',
    action: 'Run a verification'
  }
];
