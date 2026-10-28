# iamtechartist research, v2

Art reference for the redesign of *The Library of Open Questions*. v1 (a profile skim) is replaced by a code read of four cloned repos, done 2026-10-28. Profile: https://github.com/iamtechartist.

---

## 1. What was reviewed

| Repo | GitHub | Live demo | Commit read | Build / stack |
|---|---|---|---|---|
| **every-joule-lesson1** (key piece) | https://github.com/iamtechartist/every-joule-lesson1 | https://iamtechartist.github.io/every-joule-lesson1/ | `48591dd` 2026-10-22, "Publish Every Joule · Lesson 1" | Vite build, minified. three.js r170, `postprocessing` (pmndrs) and an N8AO pass, WebGL2 |
| **fold** | https://github.com/iamtechartist/fold | https://iamtechartist.github.io/fold/ | `f347650` 2026-10-20, "Publish Fold" | One Vite bundle with three r170, postprocessing, N8AO and RGBELoader inlined, plus one HDRI |
| **home-sweet-home** | https://github.com/iamtechartist/home-sweet-home | https://iamtechartist.github.io/home-sweet-home/ (from its README) | `9b69f10` 2026-09-03 | Single readable `index.html`, three r185 from a jsdelivr importmap |
| **tideglass-cove** | https://github.com/iamtechartist/tideglass-cove | https://iamtechartist.github.io/tideglass-cove/ (from its README) | `17f7d97` 2026-09-16 | Hand-written ES modules `js/*.js`, vendored three r185 WebGPU + TSL |

**Method**
- The clones are in `/workspace/ref/<repo>`. Minified bundles were formatted with Prettier into a scratch directory outside both the clones and this project. Only this file was changed.
- Minified three.js and postprocessing exports were mapped back to real classes from their `isXxx` / `type` markers and constant values (for example `NoToneMapping = 0` and `PCFShadowMap = 1`).
- **Visual check.** every-joule and fold were served from the clones and rendered in headless Chrome (SwiftShader). That confirmed an open book on an oak desk with a sage lino pad, the ink drawing standing up off the page, and fold's pop-up town and cloth cover. The github.io pages were not fetched. The clones hold the built sites (root `index.html`, `assets/`, `.nojekyll`), which is what GitHub Pages serves. The screenshots were not added to this repo.
- **Identifier caveat.** Short names such as `wr`, `Js` and `Vn` are minifier output for these exact builds and will change if the author republishes. Each one comes with a **grep anchor**: a string literal that survives minification, such as a shader cache key, uniform or property name. Every anchor below was checked against the raw files.
- **Not reviewed in v2.** v1 named other repos from a profile skim (coastal-simulation, ocean-simulation, human-cell-visualizer, Chronograph, sun-temple, obsidian, Four-Seasons, mountain-railway-diorama, memory-fading-into-watercolor, machines-inside-you, algebraic-surface-atlas). None were cloned or read for v2, so this document makes no claims about them.

---

## 2. every-joule-lesson1: a textbook lying open on a desk

Lesson 1 of a physics book about energy, shown as a real hardback on a desk. The pages are typeset in Canvas2D at millimetre scale and turn with a modelled curl. The lesson's figure is printed flat on the page and then lifts off it as a 3D pen-and-hatching drawing. Energy shows as glowing colour that spills light onto the paper.

| File | What it holds |
|---|---|
| `index.html` | Critical CSS, the loader (the "Techartist" wordmark writes itself letter by letter), `#c` canvas, `#ui`, `#a11y` text version, `#a11yLive`, `#nogl` fallback |
| `assets/main-BSpvVzGs.js` | The app: desk stage, book, page textures and typesetting, lift-off renderer, custom post effects, UI, input, camera, frame loop |
| `assets/stores-BwMXNqO6.js` | Lesson-1 module (`buildLesson1`), ink-line material and `popWorld` GLSL, line sets, pen scheduler, jars, flow tubes, the eight store colours, lazy sound loader, creased-normals util |
| `assets/post-CiGSGJXB.js` | postprocessing subset (`EffectComposer`, `RenderPass`, `EffectPass`, `SMAAEffect`, SelectiveBloom with target `Bloom.Masked`, `VignetteEffect`, `ToneMappingEffect`) and an N8AO pass (its `configuration` keys `aoSamples`, `aoRadius`, `aoTones`, `denoiseRadius`, `halfRes`, `depthAwareUpsampling`, `screenSpaceRadius` match `N8AOPostPass`) |
| `assets/three-DMk7AhfD.js` | three.js r170 |
| `assets/sound-vOpPkm07.js` | `createEngine()`: WebAudio sprite player |
| `assets/numbers-D7lU_RWT.js`, `assets/sourcelist-ugshuCEn.js`, `assets/index-Bb-Nc_xU.js` | Cited values and sources (accessed 2026-10-21), placeholder formatter, physics sims |
| `teachers.html`, `sources.html` + `assets/teachers-Bc1piqVD.js`, `assets/sources-Cdw0WM7H.js`, `assets/common-C4SHn4nF.js`, `assets/common-DQacebU9.css` | Separate teachers and sources pages |
| `audio/sfx.mp3`, `audio/sounds.json`, `audio/CREDITS.md` | One CC0 sound sprite, its cue table, credits |
| `assets/*.woff2` | Self-hosted Source Serif 4 Variable and Caveat Variable (Latin, Latin-ext, Cyrillic, Greek, Vietnamese subsets; **no CJK**) |

All identifiers below are in `assets/main-BSpvVzGs.js` unless marked *(stores)*.

### 2.1 Scale, stage, camera (`Hs()`, `Bs()`; anchors `deskTop`, `READ`, `HERO`)
- **Units are millimetres.** The page is 190 × 250, the desk pad 640 × 430 × 2.5, and the reading camera sits about 570 mm from its look-at point on the page. Camera: `PerspectiveCamera(30°, near 20, far 9000)`. Background `#b9b0a2`.
- **Renderer `Bs()`:** WebGL2 required (otherwise `#nogl`); `antialias:false` because SMAA runs in post; `stencil:false`; DPR ≤ 1.5; `PCFShadowMap`; `NoToneMapping` (tone mapping runs as a post effect); sRGB output.
- **Framing:**
  - Reading view `kn`: position (16, 430, 400), look-at (12, 24, 4). Closed view `En`: book centre + (−300, 360, 400). `au()` blends the two with a smoothstep of how far the book is open.
  - Screens narrower than 1.6:1 dolly out by (1.6/aspect)^0.9 (exponent 0.75 in portrait). Once a lesson's drawing is live, portrait instead frames its bounding box at fov 40.
  - After the book auto-opens on load, a hero close-up `Na` holds for 7.8 s on lesson 1 (landscape only).
- **Damping and orbit (`lu()`):** camera damping is `1 − 0.02^dt`. Dragging adds yaw ±0.42 and pitch −0.18…+0.14 rad, which spring back after 0.8 s idle.

### 2.2 Desk: oak and lino pad (anchors `textures:{oak`, `pad:`)
- **Oak `Is()`.** A typed-array texture (2100 × 1350 px over 1400 × 900 mm) generated on the CPU:
  - boards 95–150 mm wide, each with its own tone, cool shift and slight tilt
  - grain lines from noise-warped stripes along each board, darker late-wood stripes `[168,150,124]` and pores
  - medullary-ray flecks on about 55 % of boards
  - outputs `map`, `roughnessMap` and `normalMap`; `MirroredRepeatWrapping` hides seams; anisotropy 8
  - the desk is an 8000² plane with UVs in mm; `MeshStandardMaterial` with normalScale 0.35 and envMapIntensity 0.8
- **Lino pad `Ns()`.** A 512² tile covering 96 mm: sage-grey base `[143,154,140]` with fBm mottling and light/dark flecks, plus normal and roughness maps. The pad is a rounded-rectangle `ExtrudeGeometry` (corner 7, bevel 0.5) with a `#6f6a5d` edge. It casts and receives shadow.
- The book's back board rests on the pad: `deskTop = Yb − BOARD`.

### 2.3 Lighting (anchors `hemi:`, `spill:`, `uKeyDir`)
- **Environment `_s()`: a procedural room, not an HDRI.** A grey box room and floor, plus a window frame on `windowDir` (−0.6, 0.66, −0.48) with four emissive panes. The panes emit linear RGB (3.0, 3.2, 3.6), and the upper pair is brighter and bluer at (3.4, 3.7, 4.2). A warm bounce panel (1.5, 1.44, 1.34) sits on the far side of the room. It is baked with `PMREMGenerator.fromScene(room, 0.02)` and `environmentIntensity = 0.75`.
- **Key light: `SpotLight('#f3f7ff', 4.2, distance 0, angle 0.36, penumbra 0.35, decay 0)`,** placed 2300 mm out along the same window direction, so reflections and shadows agree.
  - Shadow: 2048², near 1400 / far 3300, bias −2e-4, normalBias 0.8, radius 2.4.
  - Its `.map` is a 512² **window cookie** from `Fs()`: each texel is unprojected through the spot's shadow camera onto the desk plane and tested against a soft-edged window with a cross mullion (mullion at (−560, −210), bars 30 and 44 mm, softness 26). The desk shows mullion shadows.
- **Fill:** `HemisphereLight('#dce7f6', '#c9ad8a', 0.35)`.
- **Spill:** three `PointLight`s that the pool `ql` moves each frame to the strongest glowing objects (hysteresis 0.2, fade rate 12, gain 2600 via `?lg`).
- During a page turn the key's `shadow.intensity` eases to 0.42 and back (frame loop `ji`).
- `Hs().update()` writes the key direction (in view space) and colour × intensity × 0.22 into shared `uKeyDir` / `uKeyColor`. The page shaders use these for translucency.

### 2.4 Book geometry and page turn (`Vs()`, `Qs()`, `Js()`, `Vn`, `wr()`; anchors `BULGE`, `CURL_Z`, `DROOP`, `DIP_N`, `HOLLOW`, `goTo`)

| Key | Value | Meaning |
|---|---|---|
| `W`, `D` | 190, 250 | Page width, height (mm) |
| `N` | 14 | Leaf units / spreads |
| `L` | 0.55 | One leaf's thickness |
| `B`, `F` | 6, 6 | Solid back and front blocks. Text block `T` = 6 + 13 × 0.55 + 6 = 19.15 mm, so the book looks thick but only 13 leaves (plus the front block) animate |
| `BOARD`, `OVER`, `JOINT` | 3, 4, 4 | Board thickness, overhang, hinge groove |
| `CX` | 9.45 | Half spine width (hinge offset) |
| `BULGE` | 1.6 | Belly of the closed block; fades as `(1−omega)²` |
| `HOLLOW`, `SPINE` | 1.2, 1.3 | Hollow-back gap, spine thickness |
| `CURL`, `CURL_Z` | 0.3, 0.5 | Turning-leaf curl, and how much it varies along the page height |
| `DIP_N` | 2.5 | Exponent of a page's dip into the gutter |
| `DROOP` | 0.002 | Gravity sag of open leaves, larger for leaves higher on the stack |
| `S` | 61 samples, `W·(0.3f + 0.7f²)` | Arc-length samples, denser at the gutter |

- **State.** There is one number per leaf unit, `tau[k]` ∈ [0, 1] (0 = lying right, 1 = lying left). `setPosition(p)` sets `tau[k] = clamp(p − k)`.
- **Spread solver `Qs()`.** It splits the block into a right stack and a left stack from the sum of `tau`. A circle–circle intersection finds where the two stacks meet over the rounded spine, so the spine rolls as leaves cross. `omega = smoothstep(0.35, 1, tau[0])` measures how open the cover is. Each side gets a page family `da()` with a root angle at the spine and a flat angle on its stack.
- **Leaf curve `Js()`.** A leaf is a 2D cross-section curve, integrated from an angle function along arc length (Simpson's rule over `S`) and then swept along the page height.
  - *Resting leaves:* the angle eases from the spine root to flat over a length solved so the page lands exactly on its stack (integral table `Ys()`/`Xs()`), plus `DROOP` and `BULGE`.
  - *Turning leaves:* the two families blend by `tau`, plus `CURL · sin(2π·tau) · (1 + CURL_Z·z) · (s/W)^1.6`. The free edge lags in the first half of the turn and leads in the second, and one corner leads.
- **Meshes `Vn`.** Each stack is one dynamic `BufferGeometry` with face b, face a, head, tail and fore-edge (`DynamicDrawUsage`, normals recomputed). Stacks use 3 rows along the height. Turning leaves come from a pool with 10 rows so the curl can vary along z. Curves are memoised per (sigma, tau, z) in `dt`.
- **Animation.** `goTo(k, {duration: 1.1, beforeTurn})` queues turns.
  - Multi-page jumps stagger leaves up to 0.085 s apart, a riffle with leaf durations capped at 0.55 s and quadratic ease-in-out.
  - The cover takes 1.25× as long. The cover and single-leaf turns use cubic ease-in-out.
  - The app opens the book to lesson 1 about 450 ms after the loader clears (`Je(Math.min($e, 2), {duration: 1.1})`). Any input during that jumps straight there.
- **Binding.**
  - Boards come from `va()`: bevelled rounded-rect extrusions with creased normals (`Ds` *(stores)*, π/5) and an `aLayout` UV on the top face.
  - The front board has a 94 × 106 mm recess with a 90 × 102 mm pasted paper plate; `ai()` draws the cover illustration.
  - The spine strip `er` follows a Chaikin-smoothed outline (`Di()`) whose roundness tracks `omega`.
  - Two headbands (tubes `wa`, navy/cream bead texture `pr()`) follow the spine.
  - A grosgrain ribbon (`tr`, `fr()`, `sr()`) is draped by `Ni()` from the page over the head edge onto the desk, but it is **hidden in this build** (`J.parts.ribbon.mesh.visible = !1`).
- **Scope of this build.** Only spread 2 is reachable: `$e = Math.max(...Hl) + 1` and only lesson 1's module exists. The contents spread and lesson 1 are live. The index, quiz and sources code is present but out of range.

### 2.5 Materials (all are `onBeforeCompile` patches on stock three materials)

| Material | Base | What it adds | Anchor |
|---|---|---|---|
| Page `or()` | `MeshStandardMaterial`, roughness 0.86, paper normal 0.22 | Three texture **slots** placed by page-mm rects: `uInk` (multiply), `uPrint` (multiply × `uPrintAlpha`), `uSpill` (adds glow light). Back-light translucency `uTrans · uKeyColor · max(0, dot(−n, keyDir))`: 0.3 on turning leaves, 0 on the stacks | `ej-page`, `uPrintRect` |
| Fore-edge `ar()` | Standard `#efe7d6` | A line every 0.11 mm with hashed tone per sheet, stronger lines at real leaf boundaries, and an `fwidth` fade so it never aliases | `ej-edge` |
| Bookcloth `go()` | `MeshPhysicalMaterial`, cloth `#c8961e`, sheen 1 `#f3d79a` | Woven texture `hr()` (72 threads, over-under, slubs). Layout texture channels: R foil, G deboss, B tone. Foil → metalness 1, roughness 0.15, env ×1.15. Layout normal from blurred foil and deboss heights (`Do()`). Threads smaller than about 2 px fade to their mean, so there is no moiré | `ej-cloth` |
| Ribbon `sr()` | Physical, navy `#1f2b52`, sheen `#8ea0d8`, DoubleSide | Grosgrain ribs `fr()` | `ej-ribbon` |
| Lifted surfaces `Sl()` | `MeshLambertMaterial` `#fbf7ee` | Engraving hatch in object space, two directions. Darkness comes from a fixed "illustration light" (−0.5, 0.78, 0.36) mixed with the real key's visibility `ejKeyVis`, so real shadows and window mullions darken the drawing. Pen width stays constant on screen, a finer hatch fades in up close, and point-light spill tints the paper | `ej-paper-v1`, `ej_hatch` |
| Fading shadow `yl()` | `MeshDepthMaterial` + `alphaHash` | Used as `customDepthMaterial` with an opacity that follows the surfaces, so their shadows fade in and out with them | `ej-fading-shadow` |

Paper itself: the normal map `lr()` is fBm plus random-walk fibres tiled about every 22 mm. The base canvas `ur()` is cream `#f5efe2` with mottling and fibre strokes, and odd spreads are mirrored to break up repetition.

### 2.6 How content gets onto the pages (anchors `setFocus`, `invalidatePage`, `hitTest`, `pageToWorld`)
- **Canvas2D, drawn in millimetres.** Each page side is a `CanvasTexture` (sRGB, `flipY:false`, anisotropy up to 8). The context is scaled by px/mm and every layout function works in mm. Fonts load before drawing (`document.fonts.load`).
- **Texture LOD `cr()`.** Every page side has a 1.6 px/mm texture. The focused spread ±1 gets 6 px/mm, built one texture per frame (`step()`) and freed once it is 2 or more spreads away. `invalidatePage(k, side)` redraws a page.
- **Pager `gl().drawPage(k, side, ctx, pxPerMm)`** dispatches by page kind (cover, contents, lesson, index, quiz, sources). The typesetting kit is all Canvas2D:

  | Function | Job |
  |---|---|
  | `j()` | Font setup, small caps, tracking |
  | `Ao()` / `yt()` | Word wrap |
  | `Ar()` | Equation setting: italic variables, sub- and superscripts |
  | `Pt()` / `Mt()` | Rich-text line breaking with non-breaking runs, symbols and colour swatches |
  | `Ca()` / `hi()` | Multi-column flow with a binary search for the largest font that fits |
  | `Kt()` | Running heads and folios |

- **Lesson layouts.** `qr()` is the left page: title, explanation, equation box, key words, predict checkboxes, a "Why?" flap area, and a margin column with the challenge stamp ring. `Er()` is the right page: figure caption, try-hint and switches.
- **Interactive without DOM overlays.** Layouts return `hits` (tap targets) and `reads` (hover regions) as page-mm rectangles. Input turns a ray into page mm with `hitTest()`.
- **Marks don't redraw the page.** Ticks, handwritten margin notes (Caveat, blue `#273463`) and stamps go on a separate 4 px/mm ink canvas (`za()`). It is applied through the `uInk` slot and refreshed at most every 80 ms.
- **Physical extras anchored to the curved page** via `pageToWorld()` / `pageNormal()`:
  - Lift-the-flap cards `gi()`: a 0.35 mm card with a printed front and a hatched back carrying an "EJ" seal. The hinge can be top, bottom or outer, and motion eases with `1 − e^(−7·dt)`.
  - Rubber stamps `vi()` / `rl()`: two rings, text, and 70 random `destination-out` specks for worn ink.

### 2.7 The drawing that lifts off the page (`Pl()`, `Uo`, `Ml`, `xl`; anchors `popWorld`, `uCab`, `uLiftAll`, `aVis`, `renderPrint`, `computeVisibility`, `lineScale`)
1. **Frame.** `Wa()` fits a basis to the right page by sampling `pageToWorld` along it and regressing height, so the drawing sits on the real curved page (anchored near page (14, 212) mm).
2. **Lift transform `popWorld(w, lift)`** *(stores, GLSL)*. In the page frame, `d` is height above the page.
   - At lift 0, height is drawn as a cabinet-oblique offset `(1−λ)·d·uCab` on the page plane, so the printed figure is an oblique technical drawing. `uCab` is (0.12, 0.32) in `Pl()`.
   - As lift rises, the drawing plane rotates up by `π/2·smoothstep(lift)` like a pop-up page, and true depth returns with `λ = lift⁸`.
   - Vertices are clamped just above the paper.
3. **Pen lines.**
   - The material (`Js` *(stores)*, anchor `uWidthMm`) draws screen-space ribbons with miter joins (capped at 2.5). Width blends from 0.34 mm on paper (printed) to the line's pixel width × 1.32 when standing (default 1.5 px).
   - A pen head (`uClock` against each line's `t0`/`dur` and arc length) reveals strokes. `aVis` hides lines that are occluded in the printed view, and `uClip` cuts away.
   - The line set `R` *(stores)* resamples at 1.6 mm, overshoots line ends (anchor `overshoot`), adds value-noise `wobble`, and varies width like pen pressure (`ds()`).
   - The pen scheduler `ks` *(stores)* times strokes by length, about 300–340 mm/s.
4. **Printed copy `Ml`.** It renders the same 3D drawing through an oblique orthographic camera into a 6 px/mm MSAA target and feeds the page's `uPrint` slot. `computeVisibility()` depth-tests every line vertex against that view (depth texture, a points pass, `readRenderTargetPixels`) to fill `aVis`.
5. **States (`Uo.update`).**
   - print → peel: lines draw on while the print fades out over 0.28 s.
   - peel → shade: hatched paper surfaces fade in over 0.45 s, then start casting shadows.
   - shade → live: the drawing is interactive.
   - Leaving the spread runs *undraw*: surfaces out over 0.15 s, the drawing folds down over 0.35 s, the print fades back in, and only then does the leaf turn.
6. **Light from content.** Glowing parts are jars (`ys` *(stores)*: rim plus slow internal currents) and flow tubes (`xe` *(stores)*: hue-circle colour blending, four flow patterns).
   - They sit in the SelectiveBloom selection.
   - They are rendered top-down into a small blurred target (`xl`: 224 × 150, three separable passes) that the page shader adds as `uSpill`.
   - They drive the three real spill lights.

### 2.8 Post-processing and tone (`Us()`, `kr`, `Mr`; anchors `aoRadius`, `HueToneMap`, `LiquidGlass`, `data-glass`)
- **Chain.** `EffectComposer` (HalfFloat, no MSAA) → `RenderPass` → N8AO → one `EffectPass`:

  | Stage | Settings |
  |---|---|
  | N8AO | aoRadius 14, distanceFalloff 2, intensity 2, 8 samples, denoise 4 / radius 6, half-res, depth-aware upsampling, colour `#2a2622` |
  | SMAA | HIGH |
  | SelectiveBloom | mipmapBlur, threshold 0, smoothing 0.2, intensity 2, radius 0.7, background ignored |
  | Vignette | offset 0.24, darkness 0.52 |
  | Tone map `kr` | see below |
  | LiquidGlass `Mr` | see below |

- **Tone map `kr` ("HueToneMap").** A hue-preserving Khronos PBR Neutral variant with exposure 0.9 (`?exp`) and desaturation 0.03. Below a peak of 0.76 it leaves colours alone apart from a tiny toe, so paper and printed ink keep their colour and only highlights compress.
- **LiquidGlass `Mr`: the HUD glass is drawn in WebGL, not CSS.** Each frame the app reads the rects of DOM elements marked `data-glass` (`Ql()`) and passes up to 8 of them to the shader. It draws a rounded-rect SDF with edge refraction and a chromatic split, a 5×5 frosted blur, rim light and a drop shadow. `data-zoom` > 1 turns an element into a clear magnifier; the lens disc uses ×1.75. The glass goes through the same Neutral curve so it matches the frame.

### 2.9 UI, interaction, accessibility (anchors `every-joule-lesson1:v1`, `every-joule-lesson1:still`, `__ready`, `__ej`, `nowatch`)
- **DOM.**
  - `Tr()`: bottom capsule with contents, prev, a "where" label or caption with a Watch button, next, sound, Still mode and a teachers link.
  - `Pr()`: magnifier disc plus an HTML lens card placed beside the hovered region's projected rect.
  - `Wl()`: a bottom sheet shown only in portrait.
  - A confirm dialog.
- **Press priority:**
  1. 3D targets in the live drawing (13 ray offsets up to 14 px on touch)
  2. flap meshes
  3. page hit regions (slop 6 / 8 / 12 px for mouse / pen / touch)
  4. otherwise, orbit drag
- **Taps and hover.** Tap ids are `goto:`, `predict:`, `switch:`, `flap`, `quiz:`, `quiz-flap:`, `source:`, `link:` and `reset`. Hovering a region opens the lens card on desktop; on touch it takes a 480 ms long press.
- **Turning.** Flick (under 350 ms and over 70 px), wheel (90 px accumulated), ←/→ or PageUp/PageDown.
- **Watch mode.** Five 2 s shots, each with its own camera, action and caption. It plays automatically the first time a lesson opens in a session (`nowatch` turns this off). Space pauses, Escape stops.
- **Accessibility.**
  - The canvas is focusable and has an aria-label.
  - `#a11y` mirrors the current spread as real HTML (links, radio groups, `<details>` flaps, buttons) via `_l()`, and `#a11yLive` announces changes.
  - Still mode is remembered, defaults from `prefers-reduced-motion`, and snaps every animation.
- **State.** Progress lives in `localStorage` (predictions, stamps, visited, watched, flaps, quiz, bookmark). Deep links: `#spread-N`, `#contents`, `?k=`.
- **Test hooks.** `window.__ready` is set once page textures are done; also `window.__bench()`, `window.__ej`, and URL params `shot`, `nowatch`, `noevent`, `tier`, `exp`, `bloom`, `vig`, `spill`, `lg`, `noao`, `cx…lz`.

### 2.10 Sound (`assets/sound-vOpPkm07.js`, anchors `createEngine`, `riffle`, `pageTurn`)
- **Engine `createEngine()`.** One sprite (`audio/sfx.mp3`) plus `audio/sounds.json`, which maps each cue to `[start, duration]` variants, loop regions or layered loops.
  - Alignment: a one-sample marker in the first 0.25 s aligns the offsets.
  - Variation: it picks a different variant from last time and jitters pitch ±30 cents and gain ±1.2 dB, more when a cue retriggers within 0.25 s.
  - Voices: capped at 6 per cue and 24 in total.
  - Loops: start at a random offset; layered loops crossfade at equal power.
  - Output: the master is limited by a `DynamicsCompressor` (ratio 20).
  - Lifecycle: off by default, unlocks on the first gesture, suspends when the tab is hidden.
- **Cues.** `pageTurn` / `riffle` on turns, a `pen` loop while the drawing draws on, `flap`, `stamp`, and `bookThud` for the lesson event.
- **Source.** `audio/CREDITS.md`: every clip is cut from CC0 Freesound recordings; "There is no music and nothing synthesised."

### 2.11 Performance (`zl()`, anchor `tier`)
- **Quality tiers** high / medium / low:
  - DPR cap 1.5 / 1.25 / 1
  - N8AO only on high
  - bloom resolution 0.5 / 0.35 / 0.25
  - on low: shadow map drops from 2048 to 1024, the second hatch direction and line breaks turn off (`uHatchQ`), and thin lines (width factor < 0.62) are dropped
- **Auto-downgrade:** 90 frame samples; if the trimmed mean is above 24 ms, step down a tier.
- **Other savings:** page-texture LOD, memoised curves, pooled leaves, the spill pass runs only while content is live (with a 40-frame tail), and `dt` is clamped to 0.05.

### 2.12 Content model: every number has a source
`assets/numbers-D7lU_RWT.js` stores each value with its source (title, publisher, URL) and the access date `2026-10-21`. Copy uses placeholders such as `{v:cyclingSpeed}` and `{n:g}`, which the formatter in `assets/index-Bb-Nc_xU.js` resolves. `assets/sourcelist-ugshuCEn.js` embeds the numbered list shown on `sources.html`. Quiz answers are computed from the same values.

---

## 3. fold: a pop-up book shop on a walnut desk

"Fold · Pop-up Press" shows a cloth-bound board book whose spreads (Clocktower Square, Jungle Falls, Night Carnival) stand up as kinematically solved paper pop-ups. They have a pull-tab tram, a draggable waterfall and a spinnable wheel. Everything is in `fold/assets/index-BnOP_ai1.js`; the app code starts after the inlined RGBELoader.

- **Stage `gE()`.**
  - Environment: `hdri/studio_small_09_2k.hdr` (6.3 MB) through RGBELoader and PMREM; `environmentIntensity 0.42`, `environmentRotation.y 1.2`.
  - Key: `DirectionalLight(#ffe9cc, 3.7)` at (−330, 560, 470) with a 2048² shadow (ortho ±320, bias −3e-4, normalBias 0.6, radius 3.5).
  - Opposite fill: `DirectionalLight(#ffe4c4, 0.6)` with no shadow. Also `HemisphereLight(#c9dcff, #8a5c3c, 0.32)`.
  - Background and `Fog(#6e4a32, 700, 2000)` match the wood, so the desk dissolves into darkness.
  - Desk `mE()`: walnut with flat-sawn "cathedral" arches (Gaussian bumps per board), pores and flecks, on a `MeshPhysicalMaterial` with clearcoat 0.45 / clearcoatRoughness 0.26 (varnish).
  - Renderer: no MSAA, DPR ≤ 1.5, PCF shadows, `NoToneMapping`; fov 30. The page is 240 × 280 mm (`dc`).
- **Post.** N8AO (aoRadius 8, distanceFalloff 3, intensity 2.2, colour `#3a2418`, half-res) → SMAA → **DepthOfField** (focus distance follows the camera keyframe each frame, range 520, bokehScale 1.4, half-res) → Vignette (0.32 / 0.34) → ToneMapping NEUTRAL → LiquidGlass (the every-joule effect without the magnifier branch, desaturation 0.15). Anchors: `worldFocusDistance`, `LiquidGlass`.
- **Paper `JE()`** (anchors `paper-`, `fold_pattern`, `aPat`, `aCol2`, `uTrans`):
  - "Printed" material: `MeshPhysicalMaterial` with vertex colours, roughness 0.78, paper normal 0.28 and sheen 0.22.
  - Procedural print patterns `fold_pattern` (stripes, dots, checks, scales, chevrons, grid) take type, scale, angle and strength from a per-vertex `aPat` and a second colour from `aCol2`, antialiased with `fwidth`.
  - Back-light translucency `uTrans` 0.35 using `pow(back, 1.4)`.
  - A "page" material (canvas map, tooth normal 0.5, sheen 0.18) and an "edge" material.
- **Cut paper.**
  - `Sn()` turns any 2D outline with holes into a card of a given thickness (front and back faces, an edge strip, the colour and pattern attributes), mirrored for the facing page.
  - Panels stack glued layers `q(color, outlines, {z, color2, pat})`. `Xh()` offsets each layer by its z plus 0.025 mm per layer and merges them.
  - Page canvas `wp()` (5 px/mm): cream `#f6f0e3`, mottling, fibres, a 26 mm gutter-shade gradient, Fraunces text.
- **Pop-up kinematics.**
  - **Spreads are data:** `{ name, thickness, pieces }`, for example `_T` "Night Carnival".
  - **Piece types:** `v` (V-fold: `at`, `phi`, `dir`, `faceOut`), `par` (parallel/box fold: `along`, `d1`, `d2`, `a`, `b`, `close: "fold" | "extend"`) and `flat` (glued flat, lifted 0.08).
  - **Hinges:** each piece names the hinge it stands on, either `gutter` or another piece's crease such as `"sky.LA"` or `"square.AB"`. Pop-ups can stand on pop-ups.
  - **Solvers:** `l0()` solves pieces in order from both page angles (`tT()` builds the page frames). `iT()` solves a V-fold on the sphere, and `nT()` solves a parallel fold as a planar four-bar linkage (circle–circle intersection). Each piece exports hinges `LA`, `AB` and `BR` for its children.
  - **Validity checks:** the solver reports paper-engineering problems, "linkage cannot reach this angle" and "does not fold flat (fold: |d1-d2| = |a-b|, extend: a+b = d1+d2)".
  - **Runtime:** `rT` builds the meshes once and on update writes each panel's matrix from its solved frame (`kh()`). It also drives spinners (a wheel disc whose hangers stay level) and sliders. The pop-ups rise purely because the pages open.
- **Mechanisms.**
  - Tram pull-tab `KE()`: drag along a track; the tram also rotates upright as the spread opens.
  - Waterfall: a vertical slider.
  - Ferris wheel: angular inertia (`Er`, velocity decays to 35 % per second).
- **Book `HE()`: a board book.** Each leaf is a rigid board pivoting about the spine (`rotation.z = π · clamp(p − i)`). The cloth spine strip is rebuilt as a quadratic Bézier each frame. There is no page curl.
- **Cover.** `GE()` is cobalt bookcloth (weave normal `vE()`, sheen `#9fb6ff`) with an arch-shaped die-cut window `kE()` that shows layered paper scenery `VE()` behind it. `WE()` makes the gold foil title "Paper Worlds" as a metallic clearcoat plane (`#f6c95c`, metalness 0.62) with a canvas alphaMap. `XE()` is a satin ribbon.
- **Input.**
  - Drag the page horizontally (`p = p0 − dx/(0.55·width)`) and release with flick velocity; the wheel needs 160 px accumulated; ←/→/Space also turn.
  - Hits on the mechanisms are tested before page drag.
  - An idle **peek** hint (anchor `peekOn`): after 2.6 s still, the next page lifts 0.045 every 4.2 s until the visitor turns once.
- **Camera.** Per-spread keyframes `Pi` (position, look-at, DOF focus) blend by smoothstep, with damping `1 − 0.0025^dt`. The aspect dolly is `(1.7/aspect)^(0.62 in portrait, 0.85 otherwise)` and fog scales with it. There is also a "Look closer" view `m0`.
- **Render on demand.** It renders only while something changes (drag, tween, inertia, camera, dirty UI) and for 12 frames after (`Dr`).
- **UI `eT()`.** Glass brand pill, bag sheet, hero headline, dock with dots, title, Look closer and a CTA, and a hint pill. Fonts come from Google Fonts.

---

## 4. home-sweet-home: "Maison Miniature, The Morphing Rooms"

One round diorama morphs through Garden → Living Room → Dining Room → Bedroom, with a day/night toggle. Everything is in `home-sweet-home/index.html`.
- **Actor morph system.**
  - `defineActor(key, forms, states)` gives each actor a state per room (position, rotation, scale) and optionally a different form per room.
  - `startMorph()` / `stepMorph()` build per-actor transitions:
    - a stagger delay (`stag`)
    - a hop of `sin(π·t)·lift`, scaled by travel distance
    - cubic ease-in-out movement and ease-out-expo scaling
    - a changing form shrinks (ease-in-quad over the first 40 %) while the new one pops in with `easeOutBack`; children can stagger 0.13 s apart (`staggerChildren`)
  - Surfaces that can't swap blend per-room colour arrays (`SP`: walls, wood, rug) by room weight.
- **Materials.**
  - `std()` gives palette materials.
  - `rimify()` adds a fresnel rim to emissive, stronger at night.
  - `swayify()` adds height-weighted vertex sway to plants and curtains.
  - `microTexture()` paints tiny weave and wood bump canvases.
- **Light.** `HemisphereLight` 0.85 + `AmbientLight` 0.22 + sun `DirectionalLight(0xfff1dc, 2.7)` with a 2048² PCF shadow, under ACES at exposure 1.02. Night lerps to hemisphere 0.22, ambient 0.07, a 0.45 moon-coloured sun and exposure 0.92.
  - The sky is a back-faced sphere shader with day and night gradients, noise bands and twinkling stars.
  - `practical()` lamps are a `PointLight` plus an additive radial-gradient glow sprite with a slight flicker, scaled by the actor's visibility (`visOf()`).
- **Camera.** `OrbitControls` limited to polar 1.12–1.46 and azimuth −0.08–1.63 with no pan. `fitDistance()` keeps a fixed bounding box (`FIT_BOX`) framed at any aspect and re-fits on resize.
- three r185 and its addons load from cdn.jsdelivr.net through an importmap; fonts come from Google Fonts.

---

## 5. tideglass-cove: a living coastal miniature

A sculpted cove with a camper van, palms, tide, ripples and two dolphins, in `js/*.js` with vendored three r185 (`vendor/three.webgpu.js`, `vendor/three.tsl.js`).
- **`js/main.js`.**
  - Renderer: `WebGPURenderer`, falling back to WebGL 2 with `?renderer=webgl`; ACES at exposure 1.03; PCF shadows.
  - Sky and environment: the sky is a TSL `backgroundNode` gradient. The environment is a procedurally filled equirect float texture (gradient plus sun blob) through PMREM; day and dusk versions are mixed in TSL (`pmremTexture` mixed by `U.night`).
  - Lights: sun `#fff1d9` 3.05, hemisphere 0.60 (ground `#9b8c72`; the frame loop sets the sky to `#d2edf2` by day, `#99afe7` at dusk) and rim `#cadfeb` 0.30, all lerped to dusk values together with exposure.
  - Shadows: the sun's shadow map is static (`shadow.autoUpdate = false`) and refreshed every third frame, and not while paused unless the camper door is moving.
  - Camera: damped, limited `OrbitControls`; named view presets adjusted for aspect; smoothstep transitions between them.
  - Clicks: on water, a ripple (ray against the displaced wave surface, 4 fixed-point iterations); on the camper, its door opens.
  - Auto quality: if the average frame time is over 25 ms on two checks in a row, DPR is multiplied by 0.78 and the reflection scale drops to 0.32.
- **`js/sculpt.js`.** SDF helpers `smin()`, `roundedBox()` and `isoSurface()` (marching tetrahedra with gradient normals). `buildGrotto()` in `js/terrain.js` uses them to mesh one smooth limestone arch.
- **`js/dolphins.js`.**
  - Bodies are lofted from a table of anatomical stations (`profile`: z, rx, ry, centre-y) with monotone cubic Hermite interpolation (`sample()`), at 84 rings × 32 sides.
  - Fins and flukes are extruded Bézier shapes.
  - TSL handles both the swim, a vertex wave that grows toward the tail, and the countershading colour gradients.
- **`js/camper.js`.** An interior `PointLight` with a 256² shadow that updates only while the door moves, an emissive lantern "practical", and soft contact-shadow planes under the van and each tyre so it sits on the sand whatever the sun angle.
- **`js/optimize.js`.** `batchStatics()` merges static meshes by material, shadow flags and layer. `mergeActorParts()` does the same inside moving actors while keeping their pivots.
- **`js/core.js`.** One set of wave coefficients drives both the CPU contact solver and the TSL water surface, and a per-texel wetness history (`updateWetness`) tracks where the tide has been.

---

## 6. Shared house style

- **The subject is a crafted object at true scale, seen close.** In every-joule and fold it lies on a desk under a fov-30 camera. home-sweet-home and tideglass-cove are dioramas in a void with constrained orbit.
- **Light:** one shadowed key and a hemisphere fill everywhere. Three of the four add an environment map; home-sweet-home uses an ambient light and a sky-dome mesh instead. Tone mapping is either `NoToneMapping` with Neutral in post (every-joule, fold) or ACES in the renderer (home-sweet-home, tideglass-cove).
- **Post:** postprocessing with N8AO, SMAA and a vignette, and the same `LiquidGlass` effect drawing DOM glass panels (every-joule, fold).
- **Assets:** procedural apart from fonts, one HDRI (fold) and a CC0 sound sprite (every-joule). Textures are painted into canvases or typed arrays at load.
- **Paper:** shaders let the key light through thin paper (`uTrans` in every-joule and fold).
- **Reliability:** `window.__ready`, `?shot`, debug globals, automatic quality steps, and reduced-motion or Still modes.
- **Human figures: none of the four repos models a person.** The nearest techniques are:
  - fold's layered paper silhouettes (tiger `aT()`, toucan `oT()`, built with `Sn()`)
  - tideglass's lofted dolphins (`js/dolphins.js`) and SDF arch (`js/sculpt.js`)
  - every-joule's ink-line and hatching renderer

---

## 7. What we adopt

**The redesign, as briefed.** *The Library of Open Questions* becomes a tangible, close-up crafted object: a physical book or diorama on a desk. It shows a contemporary, international future library, and the ink-wash courtyard with its moon gates, ensō and seal motifs (CONCEPT.md §3a) is retired. A few high-quality human figures replace the crowd.

**Working sketch** (it anchors the mapping; it is not a spec): a hardback titled *The Library of Open Questions* lies on a reading-room desk. Each spread is one of the five zones in CONCEPT.md §3.
- The left page is typeset text: the zone's question, before and after AI, and sources.
- The right page carries a printed plate that lifts into a small 3D model of that part of a contemporary library, with one or two people in it.

| # | Technique (source) | How we use it | Notes |
|---|---|---|---|
| **Staging** ||||
| 1 | Real-mm scale, desk + pad, fov-30 close camera, reading/closed views blended by how open the book is (every-joule `Hs()`, `Is()`, `Ns()`, `kn`/`En`, `au()`) | A book about 190 × 250 mm on a pale-oak desk with a lino pad; same portrait and narrow-screen framing rules | Replaces the landscape world in `src/world/`, `src/arch/` and `src/nature/` |
| 2 | Procedural window-room PMREM plus a spot key carrying a window cookie, all sharing one window direction (`_s()`, `Fs()`), plus hemisphere fill | The whole lighting rig: reflections, key and mullion shadows agree, and no HDRI file is needed | fold's 6.3 MB HDRI would break our "no image files" rule (CONCEPT.md §5) |
| 3 | Content-driven spill lights and spill texture (`ql`, `xl`, page `uSpill`) | The Question Well's glow and any lit object in a plate lights the page and desk | |
| 4 | Shadow softening while a leaf turns (frame loop `ji`) | Same | |
| **Book** ||||
| 5 | Book dims, spread solver and leaf curve (`Vs()`, `Qs()`, `Js()`, `Vn`; `CURL`, `BULGE`, `DROOP`, `DIP_N`) | The core mechanic. A curling paper book like every-joule, not fold's rigid boards, because our pages carry text. About 7 spreads (cover, contents, five zones); solid end blocks keep it thick with few animated leaves | |
| 6 | Turn queue, riffle and auto-open on load (`goTo`, `_i`, `Je`) | Contents entries and our existing `?zone=<id>` deep link map to spreads | |
| 7 | Bookcloth with foil and deboss, recessed cover plate, headbands, ribbon (`go()`, `hr()`, `Do()`, `va()`, `wa`, `tr`) | Foil title; a pasted plate of the library building; the ribbon marks the visitor's last zone | every-joule hides its ribbon; we can show ours |
| 8 | Fore-edge sheet lines (`ar()`) | Same | |
| **Pages** ||||
| 9 | Canvas2D page textures in mm with 1.6 / 6 px/mm LOD (`cr()`, `gl().drawPage`) | Zone text moves from the HUD panel onto the pages; `src/i18n.js` keeps supplying the strings | every-joule ships no CJK glyphs, so 中文 pages need a CJK-capable face (see decisions) |
| 10 | Canvas typesetting kit (`j()`, `Ao()`, `Pt()`/`Mt()`, `Ca()`/`hi()`, `Kt()`) | The five zone layouts and the contents page | |
| 11 | Hit and read regions, `hitTest()`, lens card (`Pr()`) | Replace the floating DOM labels (`#labels`) and the side panel (`#panel`); tapping a printed term opens the lens card | |
| 12 | Ink overlay canvas for marks (`za()`), worn rubber stamps (`vi()`/`rl()`), lift-the-flap cards (`gi()`) | Verification Commons: a VERIFIED stamp lands on the claim. "Before AI / Now" becomes a flap. The visitor's chosen question is ticked in handwriting | Fits the existing stamp event in CONCEPT.md §3, with a neutral ink colour |
| **Diorama** ||||
| 13 | Print → peel → shade → live: `popWorld` lift, oblique print `Ml`, pen lines `Js`/`R`/`ks`, hatched surfaces `Sl`, states `Uo` | Each zone plate is printed flat and stands up as a 3D drawing on arrival | The signature moment; line and hatch rendering also keeps small models readable |
| 14 | Pop-up kinematics with V- and parallel folds, nested hinges and validity checks (fold `iT()`, `nT()`, `l0()`, `rT`) | Optional second medium: one spread (for example the atrium) as a true paper pop-up, or standing pieces such as stacks and screens | The checks keep the folds physically plausible |
| 15 | Paper translucency (`uTrans`) and procedural print patterns (fold `fold_pattern`, `aPat`) | Contemporary surfaces (acoustic felt, perforated panels, terrazzo, timber slats) as printed patterns on paper models, with no image textures | |
| 16 | Staggered morph choreography (home-sweet-home `startMorph()`) | Zone events inside a plate, such as stacks re-ordering or alcove screens unfolding: staggered `easeOutBack` pops with hops | |
| **Figures** ||||
| 17 | Lofted anatomical stations (tideglass `js/dolphins.js` `profile` + `sample()`), SDF smooth-union meshing (`js/sculpt.js` `isoSurface()`), drawn with every-joule's ink lines and hatching (`R`, `Sl`) and given contact shadows (`yl()`, camper contact planes) | 3–5 people in total: a reader in the Unassisted Room, a provenance steward, two people in dialogue, someone at the verification bench. Each is one smooth body mesh built once at load, rendered in the plate's ink-and-hatch style, with one idle motion | Replaces the robed, faceless, instanced crowd in `src/props/figures.js`. None of the four repos has a person to copy, so this extrapolates their methods. Paper silhouettes on folds (fold `Sn()`) are the fallback |
| **Post and tone** ||||
| 18 | `NoToneMapping` plus a hue-preserving Neutral tone map in post; N8AO; SMAA; selective bloom; vignette (every-joule `Us()`, `kr`; fold) | Replaces AgX, grade and grain in `src/core/post.js`. Neutral keeps paper `#f5efe2` looking like paper; AO grounds pages, book and pad | Either add the npm packages `postprocessing` and `n8ao` (bundled by Vite, no CDN) or extend `src/core/post.js` |
| 19 | DOF focused on the camera target (fold `DepthOfField`, `worldFocusDistance`) | Desktop high tier only: soft desk background | |
| 20 | DOM glass drawn in WebGL (`LiquidGlass`: every-joule `Mr`, fold `$E`) | Optional polish for the capsule | A plain DOM capsule works without it |
| **UI, accessibility, sound, performance** ||||
| 21 | Bottom capsule with contents, prev, next, sound and Still mode (`Tr()`) | Replaces the zone bar (`#zonebar`); the 中文 / EN toggle moves into it | |
| 22 | `#a11y` text mirror, `aria-live`, keyboard turning, Still mode (`_l()`) | Every page stays readable without WebGL; CONCEPT.md §5 already honours reduced motion | |
| 23 | Sound sprite engine (`createEngine`) | Page turn, riffle, pen, flap, stamp | Where the clips come from is an open decision (below) |
| 24 | Quality tiers with auto-downgrade (`zl()`), page LOD (`cr()`), render on demand (fold `Dr`), static shadows (tideglass `shadow.autoUpdate`) | Extend the existing `detectTier()` / `TIERS` in `src/core/config.js` and the frame-time governor in `src/core/perf.js`; render on demand suits a mostly still book | |
| 25 | `window.__ready`, `?shot`, hash deep links | Our `shots/` screenshot workflow and `?zone=` links | |
| 26 | Every value tied to a dated source with `{v:key}` placeholders (`assets/numbers-D7lU_RWT.js`) | The Provenance Stacks spread cites its sources with access dates; claims on the Verification spread use the same keyed values | Content model, not visuals |

**Where each adopted technique lives (polish pass, 2026-10-28).** Numbers refer to the table above. "Not yet" means the slot exists in the design but no code ships it.

| # | File(s) | State |
|---|---|---|
| 1 | `src/stage/stage.js` (desk, lino pad, `PAD`), `src/stage/camera.js` (`createRig`: fov 30, closed / reading / close framings blended by `open` and `zoom`, portrait rules) | Adopted |
| 2 | `src/stage/stage.js` `environment()` (procedural window-room PMREM), `windowCookie()` on the spot key, hemisphere fill; one `WINDOW_DIR` in `src/core/config.js` | Adopted |
| 3 | `src/stage/stage.js` `setSpills()` (fixed pool of 3 point lights), fed each frame from the standing model's `lamps` by `src/diorama/plates.js` | Adopted |
| 4 | `uShade` uniform in `src/book/materials.js` `pageMaterial()` | Not yet (uniform present, not driven) |
| 5 | `src/book/curve.js` (`restingAngles`, `turningAngles`, `integrate`), `src/book/book.js` (`Stack`, `Leaf`, cloth spine, boards) | Adopted; 8 spreads: cover, title + contents, five zones, afterword |
| 6 | `src/book/book.js` `goTo()` / `update()` (turn queue, riffle, interruptible); deep links in `src/main.js` `startSpread()` (`?spread=0..5`, `?spread=contents`, `?zone=<id>`) | Adopted; opens on tap rather than auto-opening |
| 7 | `src/book/materials.js` `clothMaterial()` (foil, deboss from mask gradient, weave), `src/book/pages.js` `drawCover()` + `coverArt()` (the pasted plate is a canvas-drawn illustration of the library), `drawSpine()` | Adopted; headbands and ribbon not yet |
| 8 | `src/book/materials.js` `edgeMaterial()` | Adopted |
| 9 | `src/book/pages.js` `createPages()` (mm canvases, near / far density from `pagePx` / `pagePxFar` in `src/core/config.js`) | Adopted |
| 10 | `src/book/type.js` | Adopted |
| 11 | `src/book/pages.js` hit regions + `hitAt()`, `src/ui/input.js` `linkAt()` (raycast → page mm → contents links) | Adopted; lens card not yet |
| 12 | n/a | Not yet |
| 13 | `src/diorama/plates.js` (each zone model stands up from the plate, part by part); print slot `uPrintA` in `pageMaterial()` | Lift adopted; flat print, pen lines and hatching not yet |
| 14 | n/a | Not adopted (models stand rather than fold) |
| 15 | `src/book/materials.js` `uTrans` (light through a turning leaf); contemporary surfaces in `src/diorama/kit.js` | Adopted |
| 16 | `src/diorama/plates.js` (`easeOutBack` stagger, back to front) | Adopted |
| 17 | `src/diorama/figures.js` `makeFigure()` (jointed, lofted / lathed body parts, clothing, hair, idle `tick`) | Adopted; colour figures rather than ink and hatch |
| 18 | `src/core/post.js` (hand-written: SSAO, dual-filter bloom, hue-preserving Neutral curve, vignette, triangular dither) | Adopted without the npm packages |
| 19 | n/a | Not yet |
| 20 | `src/style.css` (DOM capsule with `backdrop-filter`) | DOM fallback only |
| 21 | `index.html`, `src/ui/hud.js`, `src/style.css` (capsule: ‹ place › and look closer; 中文 / EN chip top right) | Adopted |
| 22 | `#a11y` aria-live mirror in `src/ui/hud.js`; keys in `src/ui/input.js` (← → PageUp/PageDown, Space, Home/End, Z, Esc) | Adopted; Still mode not yet |
| 23 | n/a | Not yet |
| 24 | `src/core/config.js` `detectTier()` / `TIERS`, `src/core/perf.js` `createGovernor()` | Adopted; render on demand not yet |
| 25 | `src/main.js` (`window.__ready`, `window.__loq`, `?spread`, `?zone`, `?lang`, `?q`, `?zoom`) | Adopted |
| 26 | n/a | Not yet |

Decisions taken: system CJK font stacks (`src/book/type.js`), no bundled font yet; no sound yet; the hand-written post stack (keeps the bundle under 600 KB); a curling paper book with standing models; zh-CN default with the EN toggle (`src/i18n.js`, `loq-lang`, `?lang=`). The old valley modules (`src/arch`, `src/nature`, `src/world`, `src/life`, `src/zones`, `src/props`, and the old `src/core` builders) were removed.

**Not adopted**
- Libraries and fonts loaded over the network (home-sweet-home's jsdelivr importmap, fold's Google Fonts). Everything stays bundled.
- fold's HDRI. every-joule's procedural window room covers it.
- WebGPU-only code paths (tideglass). We stay on WebGL2 with three r170, our current dependency.
- Shop UI (fold) and the physics content.

**Decisions this research raises**
1. **Fonts:** bundle OFL fonts self-hosted, as every-joule does, or rely on system fonts. Either way 中文 pages need CJK coverage.
2. **Sound:** a CC0 recording sprite (every-joule's approach) or sounds synthesised in WebAudio to stay asset-free.
3. **Post stack:** adopt `postprocessing` + `n8ao` from npm, or keep the hand-written `src/core/post.js`.
4. **Medium:** a curling paper book throughout, or one fold-style rigid pop-up spread as a contrast.
5. **Default language:** an international theme suggests English-first page typesetting; the current default is zh-CN (`src/i18n.js`).
