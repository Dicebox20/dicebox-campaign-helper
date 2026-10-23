# Unified Bathhouse — REDO Attempt 3 Render Inspection

**Date:** 2026-10-23
**Owner instruction:** “REDO.”
**Pre-render gate:** Re-opened active BATH-01..08 master PREPARE, owner single-surface exception, preceding Attempt 2 REDO and mandated scene-specific recheck rule. [Recorded v3 PREPARE recheck](./bathhouse-unified-surface-pre-render-gate-v3-2026-10-23.md).
**New image generation:** `f5832fdf-5009-4b02-a052-6fe8e4684544` (original conversation file `top_down_high_resolution_isometric_ish_architectu.png`, 1536×1024 px).
**Status:** `RENDERED_INSPECT_REDO` — not owner-approved, not added to approved archive, no Foundry build or runtime test. Exactly one render this turn.

## Spatial inspection

| Feature | Expected | Observed | Verdict |
|---|---|---|---|
| Estate entrance | North into Changing Room | At top, stair/approach enters northern Changing Room, then central Main Bath | PASS |
| NW Herbal | Small ingredient room | NW shelves, herbal table | PASS |
| W Boiler + SW Mechanical | Two service rooms to left of Main Bath | Both correct west-side positions | PASS |
| Boiler–Mechanical personnel door | Direct visible internal threshold | Opening apparent through shared wall near east part of partition | PASS visually |
| Mechanical only via Boiler | Mechanical lacks direct Main Bath connection | Additional right/east door from Mechanical into central main hall | FAIL |
| NE Warm & SE Cold Baths | Distinct private plunge rooms on eastern side | Both in correct east-side zones | PASS |
| Northeast Aqueduct personnel access | Walkable dry passage from Warm/service threshold to AQ-02 | Exterior canal/bridge near northeast, but Warm Bath east exterior wall remains continuous/sealed; no usable connection | FAIL |
| Public exterior approach | North public; separate northeast gated service | Also south steps lead directly out of Main Bath | FAIL |
| Base light & boiler state | Neutral diffuse base light, unlit inert utility furnace | Orange fire baked in visible Boiler aperture | FAIL |
| Pool states | Initially full Main pool, conditional drain/rose mosaic and screwdriver tiles | Filled pool and floral inset plausible for dormant condition | CONDITIONAL PASS |
| Underfloor Reliquary | Protected access and dry boiler egress after puzzle | Not depicted on surface raster; must be supported by staged/hidden lower layer | PENDING STRUCTURAL DESIGN |

**Conclusion:** Spatial room assignment is a strong improvement over previous renders, but the extra mechanical→main route, extra south exit, sealed NE service connection and lit furnace cannot be promoted under the owner's topology/state fidelity rule. Preserve rejected image only as chronological visual evidence; next prompt must independently derive a correct composition from accepted PREPARE and use only positive visible desired features.

**Next action:** Await owner instruction. On next REDO reopen PREPARE and repeat one image/one inspection; do not transform or reference failed raster. The owner-approved single-surface Bathhouse exception remains active. Puzzle/Region/Water overlays stay planned, uninstalled.
