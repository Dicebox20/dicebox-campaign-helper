# H-G05 Allen's Study — V003, owner-corrected size-aware FINAL ART PASS

**Date:** 2026-10-24 Pacific. **Project:** Cabin in the Ashen Veil. **Art status:** `OWNER_DELEGATED_FINAL_VISUAL_PASS / VERIFIED_IMAGE_ARCHIVED / FOUNDARY_SCENE_PENDING`. **Native Foundry changes this turn:** NONE. **New image renders this owner-correction turn:** ZERO (inspection of exact existing V003, not a rerender).

## Owner corrections that supersede previous provisional V003 FAIL

1. “the eyes dont need to be missing, that can be seen with a investigation and text, you should decide the level of detail by whats too small to the image Gen, like the eyes.”
2. “too well preserved isn't a huge deal as long as its aged.”

Interpretation: the taxidermied hound Rufus must be identifiable and approachable as a **major room prop**. His two canonically absent eyes are **micro-scale story state** that will be accurately revealed on an Investigation/inspection via player-facing text and implemented in RegionBehavior/actor-item state. They are not mandatory visible holes in the 1536×1024 full-room map. Furniture need not be ruined or shredded throughout; an uninhabited fifty-year-aged Study can have intact furniture **and** pervasive old dust, webs, faded and stained wood, debris, dead plants and a generally aged atmosphere. Exact approved H-G06 aged Great Room remains the style and even-neutral light example. The H-G05 puzzle mechanics are not weakened and no rewards are revealed/awarded from map artwork.

## Latest controlling PREPARE and puzzle canon

- [H-G05 reconciled owner PREPARE with latest supersession](../prepares/h-g05-allen-study-current-synthesized-pre-render-2026-10-24.md), [house layout v2](../blueprints/house-layout-revision-v2-2026-10-22.md), [puzzle source](../authoritative-puzzle-design-and-foundry-implementation-spec-v1-2026-10-22.md), [approved aged H-G06 style](../visual-standards/approved-50-year-abandoned-lodge-interiors-hg06-reference-2026-10-23.md).
- H-G05 lies east/opposite Dining across Great Room. WEST threshold connects to H-G06. NORTH threshold exits outside to rear exterior `EXT-08`, in the previous north window's position. Both doors share the **Brass Study Key**, with separate lock states permitted. EAST/SOUTH walls are continuous.
- Desk's `587` note points to groundskeeper's Shack lockbox, not Study doors. Rufus's two eyes are independent rewards from Sophia's bear and Gazebo, installed separately. Only then can the jaw mechanism reveal one uncharged Gondian source; its compartment remains unseen in artwork.

## Exact original V003 image and visual evidence

- Existing image generated in immediately preceding distinct turn, **one render only**: ImageGen generation `118b14f9-ec13-42ea-9e75-91d799ad30e1`, `edit_op:null`, `parent_gen_id:null`.
- Original file: `isometric_top_down_angled_interior_scene_of_a_rust.png`, **1536 × 1024 RGB PNG**, **2,772,369 bytes**.
- Directly verified in current container: SHA256 **`c3ec08180f80d5d6304824840029bf46e4785d6ac95e01e2c0b43c32a02bd5a4`**, current PNG dimensions and byte count. The same raster was re-opened and visually inspected; no edits or additional rendering occurred in this correction turn.
- **Approved exact source file on connected private Google Drive:** [H-G05 Allen's Study V003 APPROVED](https://drive.google.com/file/d/17NFBP_74FEHdfp531ystCwp_-gQ_j9if/view?usp=drivesdk) in the existing private [approved Cabin map-art folder](https://drive.google.com/drive/folders/1S4Gj3YYWv33PulkBMY5QDnJ64c-oH7P-). Independent Drive metadata confirms `2,772,369` bytes, MIME `image/png`, correct approved folder. Future transfer must verify actual downloaded source SHA256, not merely file name/metadata.

## Re-inspection at practical VTT battlemap scale

| Binding element | Re-inspection | Grounded image evidence |
|---|---|---|
| Allen Study identity | **PASS** | Mechanical drawing desk, antique scholarly furniture, shelves, old globe, domestic Study palette |
| WEST H-G06 entry | **PASS** | Wide west/left doorway with adjacent flagstone threshold |
| NORTH rear-exterior exit | **PASS** | Top edge exterior doorway to flagstone landing |
| EAST/SOUTH perimeter | **PASS** | Continuous complete east/right and south/bottom wall caps |
| Major Rufus hound landmark | **PASS** | Clearly recognizable dark-furred hound lying lifeless on old rug/low mount, approachably separate from main desk. His **empty socket state is implemented later as Investigation text**, not a pixel-level prerequisite |
| Allen's `587` note | **PASS** | Clearly legible `587` parchment resting on large central desk, independent from Rufus |
| Hidden Gondian source | **PASS in art** | Source not exposed, compartment remains narratively shut; native puzzle logic not implemented |
| Fifty years of abandonment | **PASS under owner clarification** | Pervasive old cobwebs/dust, leaf drifts, dark/worn floors and carpet, dead plants, faded or stained furnishing surfaces; preserved upholstered chairs, bookshelves and desk acceptable |
| Even neutral ambient light | **PASS** | Predominantly subdued, balanced diffusion across walkable floor; windows lit locally but no conspicuous directional rays |
| Readable interactive geography | **PASS** | Clear routes between two doorways, desk and Rufus target |

**Definitive delegated FINAL VISUAL ART VERDICT: PASS**, applying the latest owner size-aware and preserved-but-aged corrections. This is a reclassification of V003 already generated earlier; it is **not** an additional render in the current work turn. The earlier initial V003 FAIL was based on superseded micro-detail and furniture-damage thresholds; preserve it for historical audit but use this receipt as latest art authority.

## Inventory and next roadmap action

The art inventory after H-U07 V017 PASS was **20/45 approved logical base targets**. This approved H-G05 V003 increases it to **21/45 approved, 24 remaining**. Installed Foundry Scene count **does not** increase merely from art approval. H-G05 has **no verified native Scene installation**. H-U07 V017 approved source has been hash-verified and staged in Foundry Data but its Scene remains GM-login gated pending native `/game` preflight. Do not claim either Study or Studio puzzle functionality is implemented.

**Next bounded step:** The next authenticated GM-native work unit stages this exact V003 H-G05 original art to versioned Foundry Data, checks SHA256 and scene uniqueness, creates a separate H-G05 image-only Scene under established GM-only preflight, preserves owner Walls/Regions, and then designs/checks **Brass Study Key** for both doors, `587` inspection and Rufus's eyes/jaw/source chain via native RegionBehavior scripts and proper player-facing private Investigation text. Puzzle functions still need actual non-GM tests. If the elected GM session is unavailable, proceed to next prepared map or read-only puzzle continuity prep.

**Rendering workflow from here:** Review room PREPARE, create fresh positive-only prompt for each new image, at most ONE generation per turn, inspect immediately, match approved H-G06-aged ambient style; at tactical scale require major feature silhouettes, reserve microscale state revelation for interactive Investigations.
