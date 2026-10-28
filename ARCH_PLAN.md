# The Library of Open Questions — architectural plan (overview, pass F)

The book (`src/diorama/scenes.js`) is the source of truth. Each plate is a
cropped corner of a real room, drawn as a sectional model: concrete walls on
the room's **north (−z)** and **east (+x)** sides, open to the south and west,
3.2 m tall, glulam beams at 2.96–3.2 m, every plate with a north arrow pointing
at the back wall. The overview builds the whole building those corners belong
to. Each book room is placed **without rotation** (`ry = 0`), so every north
arrow stays true. Each room's two book walls sit on structural grid lines.

## 1. Site and orientation

- North = −z, east = +x, metres. The public plaza is to the **south**
  (+z). The afternoon sun comes from the south-west (`SUN_DIR`).
- The building stands on a stone podium (top +0.48 structural, +0.60 finished).
  An entrance terrace (+0.60, z 10.8–15.0) runs along the south front. Four
  150 mm steps lead down to the plaza, and a 1:20 ramp runs east along the
  terrace edge.
- There is a planted garden to the east (bays D–E × N2–M), which the Well's
  timber-finned glass wall looks onto, and a north garden under the quiet
  room's window.

## 2. Structural grid

- 7.2 m square grid. Lines **A–F** are at x = −18, −10.8, −3.6, 3.6, 10.8, 18.
  Lines **1–5** are at z = −18, −10.8, −3.6, 3.6, 10.8. The building is
  36 × 28.8 m: 5 bays by 4.
- The structure combines 200 mm in-situ concrete walls on grid lines (the
  book's walls are exactly these: 0.2 m thick, centred on lines) with
  Ø450 mm concrete columns at the free grid intersections (glazed fronts, the
  stacks floor).
- The slabs are 400 mm concrete. The book's 0.24 m glulam beams are downstand
  secondary beams under them, running N–S. Each book beam continues to the
  next wall or facade line.

## 3. Levels

| level | FFL | use |
|---|---|---|
| plaza | ±0.00 | |
| L0 | +0.60 | all public rooms |
| L1 | +4.20 | Unassisted Room, stair landing, gallery, bridge, reading balcony |
| roof | +7.80 (parapet +8.30) | two-storey spine and north bar; the one-storey base has a green roof at +4.20 |

- Floor-to-floor is **3.6 m**. The clear height is 3.2 m to the slab soffit,
  which is the book's wall height. In the close view the model is sectioned at
  that soffit.
- **Double-height spaces** (7.2 m clear): the entrance hall, the Question Well
  (crowned by a glass lantern, top +9.6) and the stair hall (top-lit).

## 4. Zones: book fragment → place in the full plan

The diorama origin is shown as (x, y, z). The plinth top Y0 = 0.12 is the
floor build-up, so origin y = FFL − 0.12. "Crop" is the 5.7 × 6.7 m plinth the
book shows.

| zone | builder | origin | room (bays, extent) | book walls on | how the fragment is extended |
|---|---|---|---|---|---|
| 1 Question Well (atrium · centre) | `well()` | (0.85, 0.48, −0.35) | C × M, x −3.6…3.6, z −3.6…3.6, **double height** | bookcase wall on line 3 (z −3.6); glass + oak fins on line D (x 3.6) | The glass wall with oak fins outside runs on to the room's full depth and up both storeys (east garden; morning light, fins shade it). A circular glass lantern sits directly above the pool and glowing ring. The book beam runs on to the south portal. A 1.5 m door at the NW corner (beside the bookcase) leads to the stair hall. A 4.8 m portal opens south to the entrance hall. At L1 a bridge crosses the void along the west wall. |
| 2 Provenance Stacks (source) | `provenance()` | (−6.35, 0.48, −7.55) | A–B × N1–M, x −18…−3.6, z −10.8…3.6 | book wall + rail + ladder on line 2 (z −10.8); window wall on line C (x −3.6) | The north book wall (same 3.05 m oak cases, brass rail, ladders) continues west, and a perimeter case runs along the west wall. More double-sided ranges use the book's module (2.5 × 0.6 × 2.2 m); new ranges are at 1.8 m centres, giving **1.2 m aisles** (the book's own pair stays 0.7 m apart). A second lineage table with red threads stands in the south bay. A door leads to the Verification Commons. The book's east window looks into the **top-lit stair hall**: borrowed light only. The west facade is solid behind terracotta fins, so **no direct sun reaches the stacks**. One free column (B/3). |
| 3 Dialogue Alcoves (debate) | `dialogue()` | (15.25, 0.48, 6.85) | D–E × S, x 3.6…18, z 3.6…10.8 | felt-panel wall on line 4 (z 3.6); full glazing on line F (x 18, east facade) | The felt panel grid continues west along the north wall. The east glazing runs to the south front. Two more alcoves repeat the book's (rug, two curved felt screens, round table, chairs, drum pendant). The south front is glazed to the plaza. A 1.8 × 2.4 m door opens from the entrance hall. It is the noisy room, so it sits by the entrance. |
| 4 Unassisted Room (quiet) | `quiet()` | (0.85, 4.08, −15.15) | **L1**, B–C × N2, x −10.8…3.6, z −18…−10.8 | north window on line 1 (z −18, north facade); solid east wall on line D | The book's window module (5.4 m bays: piers, 0.45 m sill, lintel, 6 × 3 steel glazing) repeats along the whole north front, with a planter ledge outside. **North light only**: steady, no glare. Long tables with chairs and lamps repeat westward, with low shelves under each window. A door (1.2 × 2.2 m) opens from the L1 gallery. It is quietest: upstairs, at the far end of the axis. |
| 5 Verification Commons (trust) | `verify()` | (−6.35, 0.48, 6.85) | A–B × S, x −18…−3.6, z 3.6…10.8 | cork evidence wall + archive case on line 4 (z 3.6); window wall on line C | The evidence wall and archive cases alternate along the north wall. A second verification bench repeats the book's (lamp bar, papers, press, stools). The south front is glazed to the plaza under the canopy, and the book's east window looks into the entrance hall, so checking happens **in public view**. The 2.5 m gap the book leaves at the south end of its east wall is the entrance from the hall. |

Support (never cut away): closed archive and core (WC, lift lobby, escape
stair) in A–C × N2 at L0, under the Unassisted Room.

## 5. Circulation

The building is laid out as one north–south axis that gets quieter as you
go: plaza → entrance hall → Well → stair hall → L1 → Unassisted Room.

- **Entrances.** The plaza steps and the 1:20 ramp lead to the terrace under
  the canopy. Two pairs of 1.8 × 2.4 m doors in the double-height glass front
  open into the entrance hall (C × S).
- **Entrance hall.** Verification is to the west (2.5 m opening) and Dialogue
  to the east (door). The Well is ahead, through the 4.8 m portal.
- **Well → stair hall.** A 1.5 m door at the Well's NW corner leads into the
  stair hall (C × N1). There a 2.5 m opening leads west into the Provenance
  Stacks.
- **Main stair.** A dog-leg: 2 × 12 risers of 150 mm, 280 mm goings, 1.6 m
  flights, a landing at +2.40, and 1.1 m balustrades. There is a lift beside
  it.
- **L1.** A 1.5–3 m gallery along the stair hall's west side leads north to
  the Unassisted Room's door. A **bridge** (1.5 m wide) crosses the Well void
  along its west wall to a reading balcony over the entrance hall.
- **Clearances.** Doors are ≥ 2.2 m high and main aisles ≥ 1.2 m. Railings
  and balustrades are 1.1 m.

## 6. Daylight

| room | light |
|---|---|
| Well | Glass lantern straight above the pool (the book's "glass skylight"). The two-storey east glass wall is shaded by oak fins. |
| Provenance | No exterior glazing. The west and north walls are solid, and the book's window takes borrowed light from the top-lit stair hall. |
| Dialogue | East glazing (morning) and a south front shaded by the canopy and the overhang. |
| Unassisted | Continuous north window (the book's), with diffuse light and no sun on the desks. |
| Verification | South front under the canopy, plus the internal window to the hall. |
| Stair hall | Rooflight, 5 × 5 m. |

## 7. Materials (from the book's palette, `C` in `src/diorama/kit.js`)

- **Concrete:** walls and columns (`C.concrete`, board-marked kit texture).
- **White oak:** floors in the stacks, dialogue and quiet rooms (planks);
  fins, beams, rails, shelving.
- **Terrazzo:** public floors (Well, Verification, halls).
- **Steel:** dark window frames and balustrades (`C.steel`).
- **Brass:** accents and the lantern ring.
- **Terracotta:** fins on the stacks' blind west facade, the red thread drawn
  large.
- **Linen, felt and cork** as in the plates. Sedum green roofs.

## 8. Level of detail

- **Far.** Coherent massing. A one-storey base with green roofs. A
  two-storey cross formed by the north bar and the spine (entrance hall, Well,
  stair hall). The Well's lantern and the canopy. Rooms are visible through
  the glass.
- **Mid.** Sectional cutaway. Each room is cut at its slab soffit (FFL + 3.2).
  Walls on the side facing the camera are cut to 1.1 m. The spine is cut at
  L1 + 1.1 m, so the stair, landing, gallery, bridge and balcony read. The
  canopy is lifted off.
- **Close.** The full room: the book's diorama at its core plus its extension
  (furniture, walls, doors, glazing). The camera frames the whole room from
  the south-west, the way the plate is drawn.

A wall's "near" or "far" side is chosen from the camera's bearing every frame,
so any orbit angle stays readable.
