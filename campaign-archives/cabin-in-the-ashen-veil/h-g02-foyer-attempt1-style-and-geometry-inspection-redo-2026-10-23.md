# H-G02 Foyer — render 1 style and scene INSPECT

**Date:** 2026-10-23  
**User instruction:** “Alright, lets begin with the house. These ones must match the style guide.” Then “Inspect”.  
**Exact image:** `rustic_autumn_manor_foyer.png`; generator id `01f031c9-1052-415b-9e3d-b6211a132546`, **1448×1086 RGB**, **3,165,929 bytes**, SHA-256 `04433f395118889c848e5c38cc97f02d5b4843a7cf9071caae91649cc370fe60`. Local file visually reviewed this turn and hash independently computed.
**Verdict:** `RENDERED_INSPECT_REDO`. This image is **not owner-approved** and must not enter the approved ZIP. **No new map or Foundry write performed.**

## Authority for inspection
- **CURRENT** 56-card master PREPARE `H-G02`: one small south porch entrance chamber; three paired destinations only: south to `EXT-01` Carriage Yard, north to `H-G06` Great Room, east/side to **locked** basement stair behind an actual door leading to `H-B01`. Must see coat rack, front entry, Great Room door, distinct basement door frame. Only two interior doors and one front exterior door. Main stairs to `H-U02` reside in the **Great Room**, not Foyer. Weathered-Key door state owned by Foundry.
- [Current human PREPARE](./all-scene-preparation-register-v2-2026-10-22.md) confirms.
- [Style study and representative-wall rule](./map-style-research-representative-walls-2026-10-22.md): a 90° orthographic plan, thin consistent wall caps and subtle bevel/ground shadows, adequate token walkways, moderate painterly old/creepy dressing, neutral diffuse base. Wall cap is symbolic footprint, not actual tall cutaway elevation.
- [Fast map profile](./ashen-veil-fast-map-creation-profile-v1-2026-10-22.md) specifically warns the older `ashen-veil-fast-batch-01-prepare-cards-2026-10-22.md` foyer card is pre-House-v2 historical: it erroneously provides old foyer routes to Dining/Kitchen, main-upstairs stair and grandfather clock. **Those must not be resurrected**. Owner's latest house style instruction strengthens visual compliance and does not authorize bypassing mandatory PREPARE recheck.

## Inspect findings

| Check | Outcome | Observation |
|---|---|---|
| Flat overhead floor plane | PASS | Single foyer rectangular hall legible |
| South front exterior entry | PASS | Central southern open door and outside porch |
| North door to Great Room | PASS | Center north interior opening |
| East basement entrance | FAIL | East-side door appears **open**, exposing a long staircase; Weathered-Key locked initial state needs a convincing closed solid door; exact direction visually ambiguous |
| No main stairs to upper floor | PASS only in semantic intent | The one stair visible at east should be the basement shaft; its illustration resembles generic stairs and is exposed. No separate upper staircase is shown, which matches new PREPARE |
| Coatrack / modest furnishing | PASS | Coat tree near NW |
| Representative wall-cap art | **FAIL style gate** | Long full-height cream plaster wall faces, broad timber uprights/pillars, deep elevation and extra exterior construction: too close to dollhouse-style cutaway rather than narrow representative top-facing cap |
| Quiet old autumn mood | PASS | aged timber, rug, fall leaf dressing |
| Sparse controlled interior-only crop | NEEDS CORRECTION | Large porch/exterior ground and adjacent stair building consume significant frame; prefer Foyer footprint as primary scene with limited arrival threshold |
| Foundry scale/collision | NOT TESTED | Cannot certify token spacing, walls, teleport or lock from raster alone |

**Failure cause in workflow:** The foyer image was generated immediately on the user's new house-map instruction without a visible same-turn fresh PREPARE reread and structural gate receipt. This violates the project-specific mandatory PREPARE reread rule. Inspection caught the mismatch afterward. **Do not record a pre-render PASS retrospectively.**

## Corrective route / next render (only upon owner REDO request)
1. Freshly reread latest **H-G02** current master PREPARE + accepted **House Layout v2** source survey and owner positive shrine style reference, not rejected prior foyer render nor its prompt. Reconcile three door anchor positions and house room dimensions; produce deterministic structural evidence if the applicable FAST style-test workflow calls for it.
2. Construct positive/inclusion-only seed from **closed east locked wooden basement door**, **north Great Room door**, **south outside arrival door**, coat rack, entry rug and warm aged planks; room-scale low thin wall caps with slight bevel; neutral even indirect light; small foreground porch transition. Main upstairs stair and grandfather clock belong to Great Room and should simply be absent from inclusion seed.
3. One fresh image → one immediate strict visual INSPECT against measured source topology/style → owner decision. Preserve current image as historical REDO evidence only. No automatic rerender.

**Census:** unchanged **17/45 approved**, **28 remaining** (house Foyer still pending). No Foundry world object created.
