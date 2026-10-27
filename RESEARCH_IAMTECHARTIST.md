# iamtechartist research (pre-fetched for Claude)

GitHub: https://github.com/iamtechartist
Site: https://iamtechartist.com
Bio: Experiments in code, form, light and motion. Building interactive 3D worlds, experiences and games.
~30 public repos, ~151 followers. Heavy Three.js / WebGL / GLSL / TSL+WebGPU work; many single-file HTML demos + some Vite/JS apps. Live demos on github.io.

## Signature techniques worth borrowing
1. **Procedural worlds that feel alive** — coastal/ocean sims (shallow-water, FFT/JONSWAP waves, foam, caustics, spray); ambient motion always running.
2. **Morphing architecture / spaces** — `home-sweet-home`: one home, 4 rooms that morph via procedural geometry + dynamic lighting (Garden → Living → Dining → Bedroom).
3. **Annotated educational 3D** — `human-cell-visualizer`: particles + GLSL, morph between cell types, info panels, anatomical labels. `every-joule-lesson1`: interactive 3D physics lesson. `machines-inside-you`: PDB-inspired molecular machines with learn-by-running.
4. **Museum / inspection UX** — `Chronograph`: real-time mechanical systems, slow-motion inspection — ideal for museums/education. `algebraic-surface-atlas`: selectable surfaces + math context + metrics panels.
5. **Monumental event-architecture** — `sun-temple`: architecture transforms around an event (OPEN SOLAR COURT), molten sun disc, character walk-out; TSL/WebGPU.
6. **Recursive / poetic structure** — `obsidian`: break a stone → cathedral → whale → stone again; nested worlds, procedural shards.
7. **Art + atmosphere** — `memory-fading-into-watercolor` (shaders + tone.js), `tideglass-cove` (peaceful coastal world, Three.js+TSL), `Four-Seasons` (control seasons/sun on one mountain).
8. **Spatial storytelling** — `fold` (pop-up book in browser), `mountain-railway-diorama` (day/evening/rain/night modes on a miniature world).

## Top starred repos (approx)
- coastal-simulation (60★), ocean-simulation (42★), human-cell-visualizer (31★), every-joule-lesson1 (28★), memory-fading-into-watercolor (27★), tideglass-cove (26★), home-sweet-home (23★), mountain-railway-diorama (22★)

## Most relevant for a post-AI library / museum / school
- Educational annotation + panels (cell visualizer, chronograph, algebraic atlas, every-joule)
- Morphing multi-zone spaces (home-sweet-home)
- Event-driven monumental architecture (sun-temple)
- Nested/recursive knowledge metaphor (obsidian)
- Ambient living environment (tideglass-cove / coastal)

Borrow: orbit/walk camera, floating info labels, procedural geometry + soft emissive lighting, zone morphing or clear spatial zones, ambient particle/motion life, click-to-inspect interactions. Keep everything code-generated (no paid APIs, no external asset CDNs beyond npm three).
