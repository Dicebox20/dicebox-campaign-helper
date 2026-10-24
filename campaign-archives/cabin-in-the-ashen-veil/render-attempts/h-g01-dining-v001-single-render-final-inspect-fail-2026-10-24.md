# H-G01 Dining Room — Fresh V001 image, same-turn final INSPECT FAIL

**Date:** 2026-10-24, America/Los_Angeles. **Owner-approved Chat A allocation:** [12/12 two-chat split](../roadmaps/two-chat-24-remaining-map-handoff-2026-10-24.md). **Art status:** `PREPARE_REVIEWED / SINGLE_RENDER_COMPLETED / ASSISTANT_FINAL_INSPECT_FAIL / ORIGINAL_ARCHIVED_UNAPPROVED / NO_FOUNDRY_MUTATION`.

## PREPARE/canon read before the one render

Reviewed [H-G01 current PREPARE](../prepares/h-g01-dining-room-foreman-current-pre-render-v001-2026-10-24.md) and [owner House Layout v2](../blueprints/house-layout-revision-v2-2026-10-22.md). Study/Great Room and Foyer shortcuts cannot affect Dining. H-G01 Dining is physically WEST of H-G06 Great Room, with an ordinary eastern/right doorway **to the Great Room**, and a separate northwestern/upper-left doorway **to H-G03 Kitchen**. Kitchen is reachable **only from Dining**; all remaining Dining walls are ordinary continuous boundaries. Dining has a central family table and old family sideboard. Dahlia's optional *Shadow That Sees* near the sideboard is a later **conditional Foundry Tile/Region** after player recognition, rather than painted permanent base art. Basement/attic/roof and H-U07 Art Studio are separate scenes.

The image reference standard was the **exact owner-approved aged H-G06 Great Room**, original PNG source `Maps/cabin-in-the-ashen-veil/h-g06-great-room-aged-fifty-years-approved-2026-10-23.png`, verified cataloged source SHA256 `1835cc734ad75fb7d4b0eb8ca441f5d3f78d6f075d9797a4e2b33a412db2ddbe`. It controls tactile fifty-year age, texture, colors, camera and neutral diffuse lighting—not the Dining architecture or furniture arrangement. The owner permits physically intact but visibly neglected dining furnishings and reserves tiny state details for player Investigation text.

## New positive-only prompt and exact original raster

- Newly authored from latest PREPARE: [H-G01 V001 standalone affirmative-only prompt](../render-prompts/h-g01-dining-room-fresh-positive-render-v001-2026-10-24.md), pre-render commit `f0b6e80d3a057090aceabbc44ec99b7f7cf803ec`. Earlier unrelated room prompts were not used as Dining-room instructions. Image-facing text positively specified the east/right Great Room door, northwest north-wall Kitchen door, central walnut dining table with six chairs, aged western sideboard, continuous south/west walls, fifty-year patina and even neutral diffuse ambient lighting.
- Exactly **ONE** image-generation operation this Chat A bounded work turn. ImageGen metadata: generation `d4d390a8-2733-4f8b-b2f4-c08d3d73ff4c`, `edit_op:null`, `parent_gen_id:null`. Output file `a_detailed_isometric_overhead_interior_scene_a_ri.png`.
- Actual original PNG verified in the active local container: **1536×1024**, RGB, **2,755,527 bytes**, SHA256 **`e2ec0d1a9cafa751537e4755f0379aca466a2c7814ffdd420ceedc7dfa964b36`**. This file is **not** the approved aged Great Room and **not** an approved H-G01 Dining source.
- Exact rejected source archived to owner-connected private [unapproved-render Google Drive folder](https://drive.google.com/drive/folders/1ganNpKYPh53_OgEV9jOU-iMfjgovXpo8): [H-G01 V001 FINAL FAIL PNG](https://drive.google.com/file/d/1agWk4zyO49vvQymdEt5V_-82K4LvO3GD/view?usp=drivesdk). Independent Drive metadata readback verified `image/png`, **2,755,527 bytes**, same private unapproved parent ID.
- Only one new rendered image and no post-render ImageGen edit/retry in this work turn.

## Same-turn actual-image final INSPECT

| Required H-G01 artwork gate | Result | Observed pixels |
|---|---|---|
| Distinct formal Dining Room with usable table | **PASS** | Rectangular walnut dining table with dining chairs/runner dominates a legible old herringbone parquet floor |
| Separate family sideboard | **PASS** | Carved serving shelves, plates/closed cabinets and sideboard treatment on left upper wall; age/weathering visible |
| **EAST/right doorway** to H-G06 Great Room | **FAIL — architectural** | At right there is a boxed-in kitchen/service annex, rather than the one east/right Great Room threshold |
| **NORTHWEST/top-left kitchen door** to H-G03 | **FAIL — architectural** | Top perimeter contains two windows and central fireplace, not the single Kitchen doorway near northwest |
| Continuous remaining walls / sole two-door topology | **FAIL — architectural** | Unwanted west/left outside porch door, distinct south/bottom doorway near left, and integrated right-side annex added; does not match the canonical two-door Dining route |
| Kitchen exclusively reachable from Dining via own door | **FAIL — route semantics** | Kitchen/service annex exists inside rendered room rather than as correct separate H-G03 Scene portal; incorrect apparent access routing |
| Significant fifty-year-age equivalent to owner H-G06 | **PASS** | Pervasive old cobwebs, dry leaves, dusty planks, worn burgundy chairs/rugs, grimed plaster, dark walnut; ordinary aged but intact room contents accepted under owner's scale-aware rule |
| Even neutral diffuse baked ambient light | **PARTIAL** | Generally muted, but several tabletop chandeliers/candles and pale top windows create local warm light accents beyond pure H-G06 neutral baseline |
| Static conditional Dahlia secret | **PASS** | No plainly visible Dahlia silhouette/recognition eye overlay; optional Shadow That Sees remains a later Foundry interaction |
| Correct cartographic perspective | **PARTIAL** | Playable overhead view overall, but painterly raised wall caps/attached annex make the scene read as a larger diorama and damage room independence |

**Owner-delegated FINAL VISUAL VERDICT: FAIL.** Macro-scale geometry and room-to-room portal topology are hard requirements that cannot be fixed by Investigation text. Despite successful domestic content and believable age, the two intended passages are absent/misplaced and more unintended routes/annexes appear. This exact image is forbidden as an H-G01 Foundry background. No Story/Scene/Region/Wall/Item/Lighting/Actor/Journal/Puzzle change was made.

## Next independently initiated Chat A turn

1. **Reread** H-G01 PREPARE and current House Layout v2. Keep two physical portals only: an east/right wall opening to H-G06 and a north-wall opening toward northwest/upper-left to H-G03. The east/west/up/down orientation must be reconciled with the current accepted H-G06 wall layout *before* any native portal placement; don't take wrong V001 geometry as source.
2. Author an entirely **NEW, affirmative-only** Dining image prompt. Stress a **small, single rectangular formal room** and **two large independently visible wall openings** as dominant composition anchors, then place plain family table/chairs and aged sideboard. Keep the permanent visible feature count minimal.
3. Use the **actual owner-approved aged H-G06 Great Room image as MATERIAL AGE/LIGHTING reference only**; preserve Dining-only positive architecture. An extra option for later is exact structural geometry-conditioned scene art; don't change established workflow without owner authorization.
4. Render **at most one new image in the next distinct turn**, inspect exact actual pixels same turn, delegate final PASS or FAIL and save image/hash/source/receipt. If FAIL, archive and stop; never do another image-generation operation in the same turn.
5. Preserve Chat A ownership of H-G01 and Chat B exclusive 12 map list; avoid cross-chat writes on overlapping Scene/Files. After approved art, separately stage by exact checksum and require elected GM authentication in Foundry, with owner-drawn Walls/Regions preserved.

**Inventory after this FAIL:** **21/45 approved base-art targets; 24 remain unapproved**, including H-G01. H-G05 V003 and H-U07 V017 retain independent approved status; the latter exact asset is staged but Foundry Scene creation remains GM-login gated. Historical live scene count must not be treated as current without native readback.

