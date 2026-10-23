# Cabin in the Ashen Veil — Exterior Perspective Owner Exception

**Date:** 2026-10-22
**Authority:** Explicit owner direction: **“We can save the strict-overyhead view for the interior areas.”**
**Status:** Owner-approved campaign-specific visual-policy exception; no module runtime changes.

## Scope

- **Indoor tactical maps** (rooms of cabin, Bathhouse, Greenhouse, Workshop, Vault, Reliquary, interior aqueduct/Undercroft) **retain strict 90-degree orthographic overhead framing**, representative wall caps, legible doors, stairs and collision.
- **Outdoor estate maps** (Carriage Yard, external cabin facades, Shack/Privy roof exteriors, trees, Pond banks/docks, forest/Grove paths, gazebo exteriors) **may use restrained elevated/angled portrayal of roofs, facades and trees** to give scale and atmosphere. Traversable **ground plane** remains accurately top-down, with no perspective distortion that misstates player movement, walls, doors or Region entrances. Important boundaries and token destinations stay unobstructed and discoverable.
- Mixed maps are reviewed per actual playable ground/floor. No wholesale relaxation for all maps or replacement of production workflow.
- **Other rules are unchanged:** old, creepy, moderate-detail original painterly art; neutral diffuse *baked* illumination; Foundry handles dynamic light and states; canonical paths, item/secret visibility and geometry remain binding; positive-only generation prompts, fresh independent prompt on REDO.
- The owner also permitted a **southward branch from the west Sune Grove trail on the neighboring map**. EXT-01 need only show an unmistakable westward exit, with the Bathhouse spur on the adjoining exterior map.

## Impact on EXT-01 render v4

- Current candidate generation `4d0f9049-1426-40bd-a31e-b6e3921453d3` passes **visual FINAL_INSPECT under the explicit exterior-perspective exception**, because its roof facades and trees no longer represent a policy violation for *this outdoor scene*; the western exit is visible and the Bathhouse fork may be mapped farther south.
- Record **VISUAL PASS / READY FOR STRUCTURAL RECONCILIATION**, not Foundry BUILD or INJECT approval. Pixel-to-foot calibration, source/destination paired Regions, safe landings, actual Wall/door paths and dynamic lights remain to be verified and staged.
- If final structural inspection reveals actual blocked/misaligned routes, the affected map remains a REDO despite passing the visual style check.

Historic strict-overhead inspection v4 and prior REDOs remain available as evidence, with this later scoped owner exception taking precedence for exterior style only.
