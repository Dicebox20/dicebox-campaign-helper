# Cabin in the Ashen Veil — Fast Map Creation Profile v1

**LOCKED LIGHTING / LAYERS / FIRST BATCH (2026-10-22):** The later [Map Production Locks v1](./ashen-veil-map-production-locks-v1-2026-10-22.md) explicitly supersedes earlier generic wording about atmospheric/natural overhead illumination: **keep painterly style with even neutral diffuse lighting; Foundry owns all emitted/fire/candle/Crimson Veil light and darkness**. Neutral contact shadows for physical readability remain acceptable. Scene states default to Foundry effects for light, controlled tiles for local changes, managed Walls/Regions for physical gating, and separate map variants for substantial geometry/terrain change. Movable rewards and spoiler-dependent changes stay independent; permanent furnishings can remain baked. Batch 01 is LOCKED as **Foyer → Great Room → Dahlia Studio → Allen Study**. All creative acceptance and downstream authority limits in this profile remain in force.


**Date:** 2026-10-22. **Status:** OWNER-AUTHORIZED CAMPAIGN EXCEPTION / ADOPTED DESIGN WORKFLOW, not a project-wide replacement or a claim that current desktop automation/validators implement it. Applies exclusively to the independent *Cabin in the Ashen Veil* map batch until owner changes it.
**Owner authority:** Owner explicitly approved the first dimensioned multi-floor house blueprint and directed that this campaign's Map Creation Workflow be simplified for speed, with minimal PREPARE and inspector discretion about "good enough." Exceptions do not propagate to other Dicebox campaigns/products.
**Source geometry:** [Owner-approved House Master v1](./blueprints/house-master-v1-2026-10-22.md) + [coordinate data](./blueprints/house-master-v1-2026-10-22.json) for house rooms; [31-location rough atlas](./rough-layout-atlas-v1-2026-10-21.md), established continuity, and area-specific prepared specs for other places. The owner-approved house shell, doubled-height Great Room/upper gallery and both stacked hidden rooms are the **campaign's design reference**. Lower-level technical coordinates still require collision/door/stair validation before Foundry injection; owner acceptance of visual design is not a runtime receipt.

## Core principle

**Story and gameplay correctness are mandatory; decorative perfection is optional.** Use the same source geometry, same visible narrative clues, a single stable output style, and accept attractive/useful maps even when background decoration isn't perfect.

### Two explicit scene creation tracks

**FAST: ordinary stable-geometry maps** (house rooms from accepted master blueprint, small straightforward outbuildings or other locations with validated layout).

1. **Minimal PREPARE** (one index card / manifest row; derive most data mechanically from the accepted master geometry and current feature inventory).
2. **Structural evidence from accepted geometry**: use deterministic top-down plan/graybox export and coordinate + portal validation instead of commissioning a fresh generative grayscale render. This is a **campaign-specific exception** to the standard creative two-pass *generation* requirement; structural inspection and semantic reconciliation still happen, preferably in a fast automated check. Preserve an immutable structural evidence artifact and manifest/reference hash.
3. **One painterly map generation** from the accepted structure and compact story/fixture requirements.
4. **Single final visual inspection**, with a clear verdict `PASS` (with notes if needed) or `REDO` for blocker only.
5. On `PASS`, approval occurs immediately as in the existing state machine; then `BUILD → STAGE → INJECT → VERIFY → RECEIPT` when legitimate runtime authority/validator prerequisites have been satisfied.

**COMPLEX: materially transforming / mechanically dense maps.** Keep the established `STRUCTURAL_RENDER → STRUCTURAL_INSPECT → FEATURE_MANIFEST/BLUEPRINT_RECONCILIATION → PAINT_RENDER → FINAL_INSPECT` chain **only** where art/terrain/geometry can't safely be supplied by prevalidated blueprint geometry. Examples: Grove dormant/awakened; pond full/drained with altered movement; Bathhouse pool emptied/hot and floor mosaic; Aqueduct main multi-route crossings; waterworks and boiler control diagram before wiring; Undercroft Keystone door/refuge/boss approach. A complex room can later qualify FAST *if* its geometry and all critical features have already been independently validated; classification is evidence-based, not quota-based.

**Important automation contract limit:** Current global Map Lab/BUILD validators may still expect immutable generative structural-stage artifacts. This document **does not assert the production toolchain accepts a deterministic blueprint-export substitution**. Until an adapter/validator supports it, supply whatever existing artifacts the validator genuinely requires or leave automation blocked; do not fabricate a structural generation ID, validator PASS, Scene ID or Foundry receipt. This changes campaign creative policy, not product release stage.

## The six-field compact PREPARE card

A new card references existing accepted canon instead of copying extensive histories:

```text
ID / location:        [stable logical scene or stage ID]
Geometry/links:       [approved blueprint/atlas ref + access/arrival anchors]
Must see:             [3–7 gameplay fixtures and storytelling anchors]
State/spoilers:       [hidden objects, pickups, toggles or scene variant]
Style:                [campaign style preset, scale/camera; deviations only]
Inspection hard gates:[critical scene-specific dangers/required visible details]
```

**Defaults inherited automatically:** strict 90° overhead orthographic, gridless artwork, `battlemap-120` (120 pixels/5-ft logical cell), source blueprint wall/door footprints, agreed atmospheric palette/materials, separate stateful pickup/door/overlay layers, correct Sune/Gond family motifs, and no exposed hidden rooms, tokens or grid. No repeat acceptance forms or manual specification of details already in the approved master/atlas. House blueprint references include precise semantic room ID and source blob identity; standalone map dimensions remain provisional until geometry lock.

## One uniform visual-style preset

Single estate aesthetic for the batch: Forgotten Realms hand-built timber + detailed stone masonry + worn copper / iron mechanical fixtures, natural overhead illumination, desaturated wood and stone with warm domestic traces; gradual Crimson Veil red/shadow via Foundry overlays/lights where feasible; evocative but **readable** dark areas (don't obscure clues). Four types of campaign props:
- Static background: architecture and permanent furnishings.
- Independent Tiles/items: anything taken, inserted, rotated, retracted or otherwise stateful.
- Regions/Wall/Light/Audio: defined by explicit manifest, not hallucinated from image pixels.
- Player-handout art: derived from *true* blueprint, deliberately misleading near Studio east wall/upper hidden room and placed on Great Room inspection anchor — never used as GM geometry source.

**Default story control:** One strong narrative focal point per small room, plus a few relevant lived-in details. Preserve the owner-requested visual storytelling, especially nursery, Rufus, studio paintings, family machinery and Undercroft interior-side digging scars. Don't force an unrelated extra puzzle/discovery onto every map.

## Inspection = good enough when core contracts hold

**Non-negotiable BLOCK → REDO or targeted reconciliation if:**
1. Wrong room footprint, floor identity, missing essential door/arrival/portal, or inability to produce correct wall/vision/teleport behavior from the art/approved blueprint.
2. Missing, merged, obscured or prematurely visible **essential** puzzle fixture or narrative reveal (e.g. no painting 027, incorrect Rufus, Bowl already painted as taken, hidden room exposed, Donovan's scratching visible on *outer* door face).
3. Major unreadable walkable space or water level, false apparent traversal, token-scale mismatch, unsafe route/landing, or unrecoverable puzzle softlock.
4. Camera tilted, baked grid/tokens/UI, unusable legibility of walls/major interactables, incorrect geographic door alignment.
5. Conflict with approved owner canon, owner-approved master blueprint or crucial state variant correspondence.

**Inspector may PASS WITH RECORDED NOTES** for:
- Worn wood grain, masonry tile count, foliage/ornaments, precise clutter location, slight furniture rotation or object placement drift **when noninteractive, not blocking routes, not contradicted by blueprint**.
- Small mood/style/luminance variations **when game fixtures and environmental clues remain visible**.
- Minor wall/ground art uncertainty **when geometry and Foundry projection can be safely anchored to the authoritative blueprint**, within existing geometry tolerance standard (never ignore a real functional collision).
- Missing inconsequential aesthetic flourishes, provided the room still reads as a believable part of the estate.
- Local cosmetic fixes that can be done using normal Foundry overlays/placeables rather than rerendering full images.

Record notes as **evidence grades / accepted variances attached to FINAL_INSPECT `PASS`**, **not a new outer workflow state**. The existing durable state advances to `APPROVED` automatically on PASS. Aesthetic imperfections may be logged as optional future refinements, not blockers.

**Decision rule:** If it will confuse navigation, break an interaction, contradict the story, or reveal a hidden area, fix before build. Otherwise approve when visual quality is usable. Avoid perfection as an invisible sixth hard gate.

## Redo discipline and throughput

- One concise inspection per image; serious known issue may use one focused follow-up evidence review, **not** a cycle of endless subjective detail requests.
- No image regeneration for purely cosmetic notes. `REDO` only for concrete hard blockers. The user can still demand refinement of any artifact.
- If the **first redo** also fails, mark that map `BLOCKED/needs targeted design` and **continue with independent maps in the current batch**. Do not auto-waive the blocker or create unlimited retry loops.
- The **locked image prompt clean-restart rule** remains in force: archive failed prompt/image; write an **entirely new independent prompt from accepted source inputs**, never incremental "same but" editing or reuse of failed images. Painterly redo may use an independently approved structural artifact but not failed paint image. House accepted blueprint geometry is canonical input, not a failed prompt.
- Generate and inspect small batches **3–5 related logical maps at a time**, tracking separate scene IDs/state variants. No arbitrary hard per-day quota. Reuse approved shared assets and a single style kit; never force distinct stage states to share incorrect visual art.
- Present short batch receipts with map name, final PASS/REDO, essential anchors present, serious notes, next blocked item. Do not solicit repeated owner confirmation for every PASS.
- A map is **art-ready** on FINAL_INSPECT PASS; it is **Foundry-ready** only after BUILD validation, authority-bound installation and live reread/verification. Distinguish these statuses.

## Recommended batch ordering

A. **First canary:** Foyer + Great Room + Art Studio + Study (the player-return hub and early clues; BP-1 fixes their geometry). Prove scale and hub transitions once before repeating house assets.

B. **Remaining house FAST:** Dining, Kitchen, Pantry; Parents, Sophia, Guest, Nursery, Gallery, Attic, Roof; hidden Candle Workshop, Spine Room, Basement Workshop, Keystone Vault (with appropriate gates and redacted source references). Group by floor and room connection pairs; hidden rooms receive spoiler-safe player art only when reached.

C. **Bathhouse cluster:** 4 logical rooms (Bath, Soap, Boiler, Rosewater Reliquary); pool water stages are mechanically sensitive. Solve stone ring image geometry / dry escape first; dry Soap/Bowl/plumbing interiors may use FAST once geometry is validated.

D. **Exterior/navigation cluster:** Yard, Shack, Privy, Pond variants, Memorial Clearing variants, Maze, Gazebo, Greenhouse, Boathouse; render by connectivity/style reuse and stage dependency, not arbitrary 29-scene quota.

E. **Underground/finale:** Aqueduct Main + Waterworks, Undercroft Approach + Sealed Refuge + Ritual Chamber; do not produce finalized inner refuge without resolving Voss access lore and sight/portal cutoffs.

**Batch scope:** The prior **31 questline logical locations** + **5 accepted house story-room proposals** gives **36 planned logical locations** under the owner's approval of House Blueprint v1, subject to final spatial reconciliation. Each material stage variant may add an installed Foundry Scene asset beyond 36; don't conflate logical location count with rendered scene copies.

## Minimal structured evidence per map

`{ sceneKey, blueprintRef/hash, track, variant, geometryFingerprint, requiredAnchorIds, imageId/hash, inspection: { verdict:"PASS"|"REDO", blockers:[], acceptedNotes:[] }, approvalId?, buildValidator?, runtimeReceipt? }`

No long repetitive manifest for plain furniture. Carry only objects relevant to Walls, Regions, portals, lights, state/scene variants and player-story evidence. Stable semantic IDs point back to shared approved baseline.

## Boundaries

- Preserves all original approved location/quest canon, one real house room per Foundry scene, true blueprint → route layer → altered player blueprint, bath healing state, Bowl source, Keystone door and the separate old-family/modern ritual mysteries.
- Does **not** remove: provenance, clean restart rules, actual geometry and scene state verification, active-GM permissions, ID/world authority, Foundry BUILD validator, receipt/error handling, or downstream runtime tests.
- Does **not** promote the campaign exception into Dicebox global Scene SOP or silently modify product code.
- Every image attempt after a rejected prompt still obeys the 2026-10-09 global clean-restart rule. PREPARE is fast because references are reused; it is not allowed to guess missing portals/items.
- The owner retains explicit authority to change any quality, workflow, acceptance or scope choice.
