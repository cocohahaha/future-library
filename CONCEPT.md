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

The scene is an open stone courtyard enclosed by a whitewashed wall with moon gates. The Question Well sits at the centre with an ensō brush circle hanging above it, and the four other zones surround it on the diagonals. Tapping or clicking a zone (or its HTML label, or its button in the bottom bar) flies the camera to it, opens the HUD panel and triggers that zone's own event. `?zone=<id>` deep-links straight to a zone.

| # | Zone | What it is | Interaction (tap / click) |
|---|---|---|---|
| 1 | **The Question Well** 问题之井 (centre) | A limestone basin of still, ink-dark water. Paper question-slips rise from it toward an **ensō** (圆相), a single brush circle left deliberately unclosed: an open question. *Answers are cheap; good questions are rare.* | A ring spreads over the water and an ink ripple crosses the paving. The slips rise faster and the ensō makes a slow half-turn. |
| 2 | **Provenance Stacks** 溯源书库 | Cedar bookcases in an arc, with books bound in plant-dyed cloth. **Red silk threads** (红线) drape from book to book, tying every text to its sources, human or machine. | The threads warm and paper tags race along them. |
| 3 | **Dialogue Alcoves** 对话龛 | Three alcoves of curved shoji-paper screens. People sit on cushions around three glazed ceramic tutors that are designed to disagree, joined by fine ink arcs. | The tutors orbit faster and closer, the arcs bow and darken, the screens glow, and people lean in. |
| 4 | **The Unassisted Room** 无辅助阅览室 | A timber pavilion under a curved hip roof with lifted eaves. It has long tables, open books, paper lanterns and a folding landscape screen, and no AI at all. | **Hush**: the lanterns brighten and the *whole library* slows: falling leaves hang in the air, birds glide, the sun dims and the HUD fades back. |
| 5 | **Verification Commons** 公共核验台 | A claim hangs as a scroll on a timber frame. A soapstone seal with a cinnabar face waits on a stone stand. | A reading rule sweeps the scroll and ticks each source in turn. Then the seal lifts, stamps 「核验无误」/ VERIFIED in public, and the evidence tags turn celadon. |

Global interactions: drag or one-finger swipe to orbit, pinch or scroll to zoom, an **Overview** button resets the camera, and the panel's action button replays the zone event.

## 3a. Visual direction (v2): Ink & Paper Courtyard at Dusk

v1 was a dark "cyber void": polar neon grid floor, floating glyph sprites, thin glowing columns and additive glow everywhere. It read too much like a tech-art demo, so it was retired. v2 commits to one coherent, original vision: **a scholar's courtyard in late-afternoon light, painted with mineral pigments on xuan paper.**

- **Palette.** Xuan-paper cream, limestone and whitewash, sumi ink, cinnabar seal-red, ochre, ginkgo gold, celadon, azurite and aged cedar. No indigo or neon teal.
- **Light.** One low warm sun with soft shadow maps, against a cool sky-blue hemisphere fill, so shadows read cool and lit faces warm, like a painting. Neutral tone mapping keeps pigments honest. Linear haze fog fades into three layers of **ink-wash mountains** (山水) on the horizon. There are no additive glow sprites anywhere.
- **Architecture and materials.** Paving stone, plaster walls pierced by **moon gates** (月洞门) and leak windows, cedar, red-brown lacquer, grey roof tile, paper screens, cloth-bound books, soapstone and silk thread.
- **Calligraphic motion.** The dry-brush ensō (with procedural 飞白, "flying white"), ink ripples spreading across the stone, ginkgo leaves drifting down, and a few ink-tick birds circling high above.
- **HUD.** Paper cards with ink type and a cinnabar accent. Zone numbers are tiny seals and labels hang like paper tags.

## 3b. Languages: 中文 (default) / EN

- Every user-facing string lives in **`src/i18n.js`**: UI copy, the five zones' names/kickers/body/before/after/action text, and the text painted on the claim scroll. Chinese and English sit **side by side**, so the two can't drift. A dev-mode check warns if keys differ.
- The default language is **zh-CN**. The **中文 / EN** toggle sits top-right in the HUD. The choice is saved in `localStorage` (`loq-lang`), and `?lang=en` / `?lang=zh` overrides it.
- Switching language updates static DOM (`data-i18n`, `data-i18n-html`, `data-i18n-aria`), `<html lang>`, the document title and meta description, the zone bar, the floating labels and the open panel. It also **repaints the in-world claim scroll** without reloading the scene.

## 4. Techniques borrowed from iamtechartist

> v2 keeps the *structural* ideas below (zones in one world, annotated panels, slow mechanisms, a monumental centrepiece, an ambient living world, global mood change). It drops v1's visual vocabulary (glyph particles, neon rings, orrery, geodesic dome); see §3a.

| Technique in this scene | Borrowed from |
|---|---|
| Distinct spatial zones in one coherent world, each with its own material and mood, and the camera flying between them | **`home-sweet-home`**: one home, four rooms with procedural geometry and dynamic lighting per room |
| Floating HTML labels anchored to 3D positions and a click-to-inspect info panel with context | **`human-cell-visualizer`** (anatomical labels and info panels), **`algebraic-surface-atlas`** (selectable objects and context/metric panels) |
| Slow, inspectable mechanisms such as the turning ensō, the orbiting ceramic tutors and the reading-rule → seal-stamp sequence | **`Chronograph`**: real-time mechanical systems for slow inspection, aimed at museums and education |
| A central monumental object around which the architecture is organised, which reacts to an event | **`sun-temple`**: architecture that transforms around an event, with a glowing molten disc (here the Well and its ensō) |
| Small custom shaders for the sky gradient and the well water; painted canvas textures for everything else | **`human-cell-visualizer`**: GLSL plus procedural content |
| Ambient motion always running: falling ginkgo leaves, circling birds, swaying lanterns and tags, rising paper slips | **`tideglass-cove`** / **`coastal-simulation`**: worlds that are never static |
| A nested knowledge metaphor (question → paper slip → unclosed circle → new question) | **`obsidian`**: stone → cathedral → whale → stone |
| A global mood change from one zone (the "Hush" slows the whole world) | **`mountain-railway-diorama`** / **`Four-Seasons`**: global mode or season changes on one world |

Everything is **procedural**: there are no models, no image textures and no CDN assets. Paving, paper, the dry-brush stroke, leaves, mountains, the shoji lattice, the folding-screen painting and the bilingual claim scroll are all painted into `<canvas>` at runtime.

## 5. Mobile and deployment notes

- `vite.config.js` sets `base: './'`, so `dist/` works under any GitHub Pages sub-path.
- `OrbitControls` handle one-finger rotate and two-finger pinch-zoom. Panning is disabled for simpler touch, and `touch-action: none` is set on the canvas.
- `devicePixelRatio` is capped at 1.5 on touch/small screens and 2 on desktop. On phones the shadow map drops to 1024² with plain PCF, there are fewer leaves, books and threads, foliage and roofs are lower-poly, mountain textures are smaller, and antialiasing is off.
- There is no post-processing: mood comes from one shadowed sun, hemisphere fill, fog and painted canvas textures. Everything is procedural: no models, image files or CDN assets.
- The HUD uses `env(safe-area-inset-*)`, 44–52px tap targets (including the language toggle), a bottom-sheet panel on narrow screens and `100dvh` sizing. The instruction text switches between touch and mouse wording with `(hover: none)`.
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
