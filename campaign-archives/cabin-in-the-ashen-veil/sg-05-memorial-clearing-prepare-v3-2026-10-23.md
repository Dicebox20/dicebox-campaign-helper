# SG-05 — Sune's Memorial Clearing | Replacement PREPARE v3

**Prepared:** 2026-10-23  
**Authority:** Owner request: “Do a new prepare for the Memorial Clearing, that was far too off”; latest owner-approved **square-loop nine-map Sune's Grove**; explicit relocation of **one puzzle bust to each of the four corner maps**.  
**State:** **DESIGN PREPARED / RENDER NOT AUTHORIZED BY THIS DOCUMENT ALONE**. This document supersedes earlier SG-05 content PREPARE and outdated text showing four busts inside the central clearing. **No image, exact image-space Wall coordinates, or Foundry objects are created by this revision.**

## 1. Scene purpose and story

This is the **center of the family's once-beloved devotional garden**, built with care for Dahlia's faith in Sune, now cold, neglected and unsettling. It should feel like an intimately meaningful, **small outdoor memorial garden**, neither an empty generic path junction nor a monumental ruin/dungeon arena. The one centerpiece is **Sune's statue**. A single child's grave and a readable family clue bench are individually meaningful, quiet secondary features.

**Scene identity:** `SG-05 Memorial Clearing`; one of nine Sune's Grove maps. Not the NW Forest Maze, not a corner, not a separate tenth shrine. This layout is independent of the prior generated SG-01 stone-circle failure (`ff28c7d8-dd0d-4b1e-a70d-7877f5c88a8f`), which is rejected as SG-01 and is **not an SG-05 art reference**.

## 2. Cardinal scene graph — exactly four perimeter paths

The center is enclosed by groves on all sides with four garden approaches. Each broad walk **reaches its matching map edge and enters the clearing** from the expected adjacent independent map:

| Border | Arrives from / returns to | Fixed direction |
|---|---|---|
| **NORTH / top** | `SG-02` — Northern Processional Walk | Southbound entry, northbound return |
| **WEST / left** | `SG-04` — Western Grove Walk | Eastbound entry, westbound return |
| **EAST / right** | `SG-06` — Eastern Grove Walk | Westbound entry, eastbound return |
| **SOUTH / bottom** | `SG-08` — Southern Grove Walk | Northbound entry, southbound return |

**Five graph destinations including future hidden Undercroft:** The `UND-01` transition is an **interior-of-map, state-revealed descent**, NOT a fifth exterior border road. It becomes available only after Bowl+filled-pellet activation.

**Gameplay architecture:** Four natural, gently curved 8–12-ft wide **stone-and-earth garden paths** converge on an old oval/octagonal family courtyard. A continuous walking ring **around**, rather than through, the statue provides 5-ft Medium-token free movement to every path, the panel and the seat. This is a **garden clearing with four entrances**, not a mathematically symmetric crossroad centered on a freestanding stone obelisk. Keep enough visual distinction between paths and surrounding planting/ruins for Region exit anchoring.

**Conceptual north-up floor diagram** (not a render prompt or measured wall plan):

```
                   NORTH → SG-02
                          │
              old planted approach
                          │
 WEST → SG-04 ──[OPEN GARDEN COURTYARD]── EAST → SG-06
                  ↖     SUNE     ↗
                 clue   STATUE   grave
                   bench       (1)
                          │
                   SOUTH → SG-08
```

Exact path bends, tree bases and elevations remain art-prep choices so long as there are **four and only four** perimeter boundary exits and a legible clear circuit past the central monument.

## 3. Structural object placement — selected relative zones

The following placements are a deliberate new **design PREPARE choice** within the owner's delegated discretion. They do **not** invent new quest objects:

| Relative zone | Static, player-visible map feature | Gameplay responsibility |
|---|---|---|
| **Center, slightly north of midpoint** | **One full sculpted Sune statue**, expressive female figure on a compact square or rose-shaped stone pedestal. Her **hands are visibly open, empty and cupped forward**; reached from the south courtyard | Main player-facing target for Bowl placement, then filled `027` pellet. Bowl and changes are separate overlays/Item interactions |
| **South face of statue base** | Old square stone panel with the **closed embossed floral relief cover** and seams; a small flat apron in front to inspect it | After four corner busts completed: reveal interactive **3×3 stone sliding picture**; after solution: recess, **1,000 gp cloth bag**, **Brass Study Key** separately collected. Render only the base/closed panel in default art |
| **West / southwest, just inside the courtyard rim** | A low weathered **stone family bench**, rose-and-compass carvings on back or seat, openly reachable from the western route | Primary early clue for `SW Rose → NE Star → NW Moon → SE Sun`; readable Journal/Note and optional handout, no Study/pond prerequisite |
| **Southeast garden pocket** | **Exactly one modest child's grave** with a small worn marker and restrained family care traces | The unborn son was never born alive; do not use a second baby grave or early lore-revealing spectacle |
| **From statue pedestal toward a concealed inner stone threshold** | Slim intentionally fitted **dry channel/runnel engravings** integrated into old garden paving and basin curb | Subtle foreshadowing: visible static inactive channel lines. Fluid FX/light and opened entrance are **not** always-on background art |
| **North/northeast of statue inside the courtyard edge** | Seam of a **shuttered stone service stair / disguised floor access**, stone lid visually consistent with paving and accessed without blocking the north path | After bowl+pellet: reveal a genuine safe stair landing `SG-05 ↔ UND-01` via an activated art/Tile/Region state. Safe reverse travel and access after repeated visits |

The gravel/stone floor should evoke past beauty. A few climbing roses, old boundary wall caps, scattered leaves and a small family-set flagstone ring supply character without overwhelming the statue and bench. No stateful quest items are baked as already collected or already placed.

## 4. Corner bust puzzle — explicit owner override

There is **one bust in each of the four CORNER scenes**, not four busts around the SG-05 statue:

| Ordered step | Actual scene | Visible corner bust motif | Equipment/interaction |
|---|---|---|---|
| 1 — **SW** | `SG-07 Southwest Corner` | **Rose** | Player uses Clockwork Winder on bust socket |
| 2 — **NE** | `SG-03 Northeast Corner` | **Star** | Player uses Winder |
| 3 — **NW** | `SG-01 Northwest Corner` | **Moon** | Player uses Winder |
| 4 — **SE** | `SG-09 Southeast Corner` | **Sun** | Player uses Winder |

Order is locked **SW → NE → NW → SE**. Reversible shared progress `0..4` persists *across Scene boundaries*; a wrong step resets to zero without consuming the Winder. On four correct activations, **the sliding-relief panel on SG-05 becomes interactable/exposed**. The four motifs and Winder sockets may require separate overlays or close-up UI on the already painted corner-map busts.

**This is an owner-directed geometry correction**, not a changed puzzle sequence, clue, item, or reward. The older `LOCK-01` specification's statement “four busts at SW, NE, NW, SE of SG-05” is **SUPERSEDED BY THEIR CORNER-MAP LOCATIONS**. The rest of `LOCK-01` and `LOCK-02` remains authoritative.

## 5. Early puzzle and reward chain — do not bake rewards

1. SG-05 bench clue accessible immediately from the open western approach. Engraving player text remains:  
   **“First, a rose sheltered from the northern wind. Second, the star over the eastern hills. Third, the moon above the western trees. Last, the sun returning to the southern path.”**
2. Winder from Attic operates the four distributed busts (above). All progress is explicit player action and repeat-safe.
3. Once complete, the small panel at the **Sune statue base** changes from closed decorative stonework to a **3×3 sliding family-picnic image puzzle**, via external UI. Initial arrangement and legal orthogonal slides retain `4,5,1 / 2,EMPTY,8 / 7,6,3`; solved `1,2,3 / 4,5,6 / 7,8,EMPTY`.
4. Solving reveals recessed cloth bag of **1,000 gp** and **Brass Study Key underneath its lining**, each as separate once-only claim. The Study is reachable early through this path.
5. SG-05 base art always depicts an **unsolved/nonrevealing closed panel**, one statue and bench; the 3×3 tile graphics, rewards and opened recess use independent Foundry/Regionwright state assets.

## 6. Late return, Scrying Bowl and Undercroft

- **Scrying Bowl** is independently obtained from the below-Bathhouse **Rosewater Reliquary**, not from the Basement Vault. A **filled Dust of Dryness pellet from Great Room code `027`** is the other necessary object.
- Two explicit actions at SG-05: place Bowl into statue's **empty hands**, then fit the pellet into Bowl's watertight slow-release housing. Only this sequence starts the engineered channels and **reveals `UND-01` outer access**, a traversable stair within SG-05. This does not open the ornate inner Keystone barrier; the party can return safely.
- The default map background keeps hands empty, channels dry, and access disguised. Active stage uses a controlled **small variant/Tile overlay** for fitted Bowl, flowing channels, changed lid/open stairs and safe portal Region. A full second background should be generated only if the extent of physical terrain changes merits a stage-specific render. Neutral baked light in both stages.
- **Late second Crooked Man encounter spatial reanchor:** older `LOCK-09` says trigger and Silver Tiny Key drop are at a NW bust *in SG-05*. With owner's move of the NW bust to **`SG-01`**, that actor anchor physically cannot remain SG-05. **Recommended mechanical reconciliation (pending owner confirmation or a separate approved route receipt):** keep every existing arming condition, chase rules and unique Silver Tiny Key reward, but attach the NW-bust encounter boundary and persistent key drop to `SG-01` near its NW bust. Do **not** invent a duplicate NW bust in SG-05 merely to keep the old chase location. Until this is ratified as runtime route logic, treat the chase Region anchor as a **documented migration blocker**, not gameplay-verified implementation.

## 7. Visual art direction — deliberate focus

- Original high-quality tabletop battlemap inspired by the *clarity and believable moderate-detail dressing* of public Tom Cartos examples, not an imitation/copy of a specific copyrighted image.
- Strong readable 90° **ground-plane** aerial viewpoint with the owner-allowed slight relief on **outdoor trees and fixed statuary**. Genuine paths and walls match the represented movement geometry.
- **Old, creepy, neglected late-fall/early-winter family garden**, diminished golden/red leaves, leafless limbs, surviving dark evergreens, tarnished stone flowers, some winter-worn rose tendrils and soft moss. Restrained emotional, quietly sorrowful atmosphere rather than oppressive generic occult architecture.
- **Neutral evenly diffuse base lighting only.** All supernatural light, darkness, sounds, water and scripted ambience applied in Foundry.
- Restrained decoration around a purpose-built **garden statue court**. Main readable hierarchy: **Sune figure + cupped empty hands → base puzzle panel → clue bench → one grave → four clear boundary paths**.
- Keep the central standing/walking surface relatively open. No need to render every paving crack or every leaf in the forest with high-detail perfection.

## 8. Mandatory future image-render gate & inspection

**Before any image generation:** reopen this document, the live `SG-05` PREPARE card, the relevant owner-approved site references and the current explicit four-corner bust override. **Do not recycle any prior failed prompts or render as generation input.** Author **one entirely new inclusion-only prompt** grounded in the specific desired visible scene. Do not put exclusions or rejected objects in the generation prompt, even preceded by “no”.

**Visual PASS gates** (failure of one = REDO; cosmetic imperfections fine):

1. This reads as a **Memorial Clearing/garden** whose primary object is a **recognizable Sune statue** with **empty, accessible cupped hands**, on a pedestal with a **distinct closed relief panel**.
2. There are **exactly four external traversable entrances**, visibly reaching top/N, left/W, right/E, bottom/S borders, with a continuous safe path/court around the monument.
3. A readable **stone clue bench** and **one modest child grave** are distinct; each reachable from the courtyard, and neither blocks the four paths.
4. All four corner puzzle busts and their engraved motif steps remain on the independent `SG-07/03/01/09` maps. There is **no corner bust duplicated** in this central scene.
5. The background accurately depicts the **dormant phase**: visibly empty hands, dry channels, closed hidden descent, closed/recessed relief and unopened reward cache. No premature revealed item/action state.
6. The emotional/tone and lighting standard: **old and quietly disturbing**, yet physically believable, moderate detail, neutral baked illumination, outdoor allowable perspective, readable geometry.
7. Approve only after immediate honest inspection; render **one map and stop** for owner PASS/REDO. Art PASS is not Foundry structural verification.

## 9. Production/Foundry object manifest (PREPARE only)

| Object role | Planned runtime owner / reason |
|---|---|
| `Scene` `SG-05` and stage variant overlay | Same logical physical location; dormant and activated visuals |
| `Wall` / terrain paths | Collide on stone structures/trunks only where genuinely solid; open four boundary routes |
| Four `Region` exit/entry pairs | SG-02, SG-04, SG-06, SG-08; scene-local safe arrival points, reciprocal |
| One conditional inner `Region`/door | `SG-05 ↔ UND-01`, available only after Bowl + pellet |
| `JournalEntry` / `Note` | Sune devotion, bench's exact early four-motif clue |
| `Tile`/interaction/UI: statue base | 3×3 relief opening and solve state; bag, Brass Study Key claimed separately |
| `Tile`/interaction/UI: statue hands / channels | Place Bowl then pellet, activate water and reveal access |
| Grove shared state | Corner bust progress and correct motif order across four other Scenes |
| Deferred late NW chase anchor | Current old `LOCK-09` points to SG-05; spatially migrate to SG-01 or obtain new owner override before BUILD |
| `AmbientLight`, `AmbientSound` | Foundry-driven after scene art approval, not baked into PNG |

**Expected art scale:** use campaign gridless battlemap-120 working convention when measured. Choose a **provisional 80×80-ft** environment (16×16 five-foot cells) for spacious four entry arms and ritual interactions, to be calibrated to the actual approved image and safe token landing requirements during structural PREPARE. The number is **design-selected preliminary sizing, not an owner-approved measurement**.

## 10. State and source reconciliation

This revision supersedes:
- SG-05 register's obsolete **“four distinct bust interaction quadrants”** field.
- Early SG-05 puzzle document claims that all four busts occupy the central map.
- The old `SG-05 NW-bust` late-chase Region designation at runtime *pending migration resolution*.

It preserves the original canonical meaning of Sune's devotion, the Garden bench clue, the 3×3 sliding relief/reward chain, Bowl+pellet Undercroft entry, family grave, cross-scene puzzle sequence and all recovery/anti-softlock policies.

**Sources:** [current PREPARE registry](./all-scene-preparation-register-v2-2026-10-22.json), [puzzle design/LOCK-01/02/09/13](./authoritative-puzzle-design-and-foundry-implementation-spec-v1-2026-10-22.md), [original grove split](./grove-nine-scene-and-estate-refinement-plan-2026-10-22.md), [Bowl/Keystone design](./sune-memorial-clearing-puzzle-design-v2-2026-10-21.md), [owner mandatory recheck rule](./mandatory-pre-render-prepare-recheck-rule-2026-10-22.md). Later direct owner relocation of corner busts takes precedence when historical files disagree.
