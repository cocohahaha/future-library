# The Library of Open Questions

*A post-AI public library, rendered as one atmospheric, procedural Three.js scene.*

---

## 1. The choice: **Library** (over art museum or school)

AI changes all three, but it hits the library hardest at the root.

- **The library's old core job is mostly gone.** For centuries a library's main value was *access*: finding, storing and getting to information. A language model answers in seconds what used to take an afternoon in the stacks. A museum still has unique objects and a school still has a social and developmental job. A library built around retrieval has to work out what it is for, so it is the space with the most to redesign.
- **The new scarcities are library-shaped.** Once answers are abundant, the scarce things are *provenance* (where did this come from?), *trust* (is it true?), *attention* (can I think slowly?) and *good questions*. Each of these maps onto something libraries have always done quietly: citation, cataloguing, reading rooms and reference interviews. The post-AI library brings those functions to the front.
- **It is still a civic space.** A library is free, open to everyone and not a classroom. That makes it the right place to ask what a *public* relationship with AI looks like. Visitors are neither customers of a chatbot nor students being graded.
- **It suits a spatial, explorable scene.** Stacks, alcoves, reading rooms and a central atrium are easy to read as 3D zones. A school pulls toward timetables and classrooms, and a museum pulls toward displaying finished objects. A library supports wandering, which is what an orbit camera does well.

## 2. Core ideas: pre-AI vs post-AI

| | Pre-AI library | Post-AI library (this concept) |
|---|---|---|
| **Centre of gravity** | Catalogue / search desk | **The Question Well**: an atrium for forming questions, not fetching answers |
| **Books** | Containers of content | **Nodes in a visible lineage**: every text shows what it was built from |
| **Staff role** | Retrieval, lending | **Provenance stewards and dialogue hosts** |
| **Machines** | OPAC terminals, photocopiers | **Several disagreeing tutors** in group dialogue, never one oracle |
| **Silence** | A rule | **A designed refuge**: an *unassisted* room with no AI at all |
| **Trust** | Implied by the publisher | **Earned in public**: claims are tested at a verification bench |
| **Success metric** | Loans, visits | Questions refined, claims checked, hours of deep attention |

The design stance: **the library becomes the place where answers are slowed down.** AI handles abundance, and the library's job is judgment.

## 3. Zones and interactions

The scene is a circular, open-sided hall. A glowing well sits at the centre, four zones surround it at the cardinal diagonals, and a faint geodesic dome and slowly turning orrery rings hang overhead. Tapping or clicking a zone (or its HTML label, or its button in the bottom bar) flies the camera to it, opens the HUD panel and triggers that zone's own event.

| # | Zone | What it is | Interaction (tap / click) |
|---|---|---|---|
| 1 | **The Question Well** (centre, amber) | A luminous basin. Visitors drop questions in, and refined versions rise as glyphs into a turning armillary. *Answers are cheap; good questions are rare.* | A ripple ring spreads across the surface, the glyph column speeds up and the armillary spins up. |
| 2 | **Provenance Stacks** (teal) | Shelf towers whose books are joined by threads of light: every text displays its lineage of sources, human or machine. | The lineage threads brighten and pulses run along the citations. |
| 3 | **Dialogue Alcoves** (indigo/violet) | Round seminar rings where a small group argues with *several* AI tutors that are designed to disagree. | The tutor-orbs speed up and swing into a tighter, overlapping argument, and the voice arcs flare. |
| 4 | **The Unassisted Room** (warm amber) | An open pavilion with long tables and lanterns. No screens and no assistants, only paper and attention. | **Hush**: the lanterns warm up and the *whole library's* ambient glyph drift slows almost to a stop for a few seconds. |
| 5 | **Verification Commons** (teal ↔ amber) | A bench where a floating "claim" tablet is scanned in public. Sources are checked and the result is stamped. | A scan ring sweeps the tablet, which turns from amber `UNVERIFIED` to teal `VERIFIED`, and stamp-seals orbit it. |

Global interactions: drag or one-finger swipe to orbit, pinch or scroll to zoom, an **Overview** button resets the camera, and the panel's **Trigger again** button replays the zone event.

## 4. Techniques borrowed from iamtechartist

| Technique in this scene | Borrowed from |
|---|---|
| Distinct spatial zones in one coherent world, each with its own light colour and mood, and the camera flying between them | **`home-sweet-home`**: one home, four rooms with procedural geometry and dynamic lighting per room |
| Floating HTML labels anchored to 3D positions and a click-to-inspect info panel with context | **`human-cell-visualizer`** (anatomical labels and info panels), **`algebraic-surface-atlas`** (selectable objects and context/metric panels) |
| Slow, inspectable mechanisms such as the armillary rings, the orbiting tutor-orbs and the scan ring | **`Chronograph`**: real-time mechanical systems for slow inspection, aimed at museums and education |
| A central monumental object around which the architecture is organised, which reacts to an event | **`sun-temple`**: architecture that transforms around an event, with a glowing molten disc |
| Particle glyph fields drawn with custom GLSL point sprites | **`human-cell-visualizer`**: particles plus GLSL |
| Ambient motion always running: drifting glyphs, breathing emissives, a slow floor pulse, turning orrery rings | **`tideglass-cove`** / **`coastal-simulation`**: worlds that are never static |
| A nested knowledge metaphor (question → armillary → question) and a recursive ring structure | **`obsidian`**: stone → cathedral → whale → stone |
| A global mood change from one zone (the "Hush" slows the whole world) | **`mountain-railway-diorama`** / **`Four-Seasons`**: global mode or season changes on one world |

Everything is **procedural**: there are no models, no image textures and no CDN assets. The glyph atlas, glow sprites and tablet text are drawn into `<canvas>` at runtime, and the floor grid, water, threads and particles use small custom shaders.

## 5. Mobile and deployment notes

- `vite.config.js` sets `base: './'`, so `dist/` works under any GitHub Pages sub-path.
- `OrbitControls` handle one-finger rotate and two-finger pinch-zoom. Panning is disabled for simpler touch, and `touch-action: none` is set on the canvas.
- `devicePixelRatio` is capped at 1.5 on touch/small screens and 2 on desktop. Particle counts drop on phones, and antialiasing is off on small screens.
- There is no post-processing. Glow comes from emissive materials, additive sprites, ACES tone mapping and exponential fog.
- The HUD uses `env(safe-area-inset-*)`, 48px+ tap targets, a bottom-sheet panel on narrow screens and `100dvh` sizing. The instruction text switches between touch and mouse wording with `(hover: none)`.
- Motion respects `prefers-reduced-motion`.

## 6. Research summary (from `RESEARCH_IAMTECHARTIST.md`)

**iamtechartist** ([GitHub](https://github.com/iamtechartist), [site](https://iamtechartist.com)) makes "experiments in code, form, light and motion": about 30 public repos built mostly on Three.js / WebGL / GLSL plus newer TSL + WebGPU work, often as single-file HTML demos or small Vite apps with live github.io pages.

Signature themes:
1. **Procedural worlds that feel alive.** Ocean and coastal sims (shallow-water, FFT/JONSWAP waves, foam, caustics, spray) with ambient motion that never stops. These are the most-starred repos: `coastal-simulation` ~60★ and `ocean-simulation` ~42★.
2. **Morphing architecture.** `home-sweet-home` morphs one home through four rooms using procedural geometry and dynamic light.
3. **Annotated educational 3D.** `human-cell-visualizer` (particles, GLSL, morphing cell types, labels, info panels), `every-joule-lesson1` (an interactive physics lesson) and `machines-inside-you` (molecular machines).
4. **Museum and inspection UX.** `Chronograph` (slow-motion mechanical inspection) and `algebraic-surface-atlas` (selectable surfaces with context panels).
5. **Monumental event-architecture.** `sun-temple`, where architecture opens around a solar event, built with TSL/WebGPU.
6. **Recursive, poetic structure.** `obsidian`'s nested worlds of procedural shards.
7. **Art and atmosphere.** `memory-fading-into-watercolor` (shaders + tone.js), `tideglass-cove`, `Four-Seasons`.
8. **Spatial storytelling.** `fold` (a pop-up book) and `mountain-railway-diorama` (time-of-day and weather modes).

The research brief recommends these for a post-AI civic space: annotation panels, clearly separated or morphing zones, event-driven monumental architecture, a nested knowledge metaphor and an ambient living environment. All of them should be code-generated with no paid APIs or external assets. This scene adopts all five.
