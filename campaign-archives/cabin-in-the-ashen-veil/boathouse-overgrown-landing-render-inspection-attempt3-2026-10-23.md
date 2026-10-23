# EXT-07 — Boathouse fresh REDO attempt 3: immediate visual inspection

**Date:** 2026-10-23
**Owner command:** REDO after Attempt 2 `RENDERED_INSPECT_REDO`.
**Fresh PREPARE receipt:** [attempt 3](./boathouse-attempt3-pre-render-gate-2026-10-23.md); controlled by [v3 land-dominant](./boathouse-prepare-v3-land-dominant-2026-10-23.md) and owner small-water/short-dock constraint. Rejected candidate artwork was NOT used as source.
**New image:** `a_highly_detailed_atmospheric_isometric_top_down.png`, generated ID `6c2996e6-49fb-4f22-9a73-00af8fcd4e59`; 1536×1024, RGB, SHA-256 `2346df47a0e17058a26e6b8db107e6ea02ec5097f7cbfc550db632b74ad2ecaa`. Locally verified, not uploaded into GitHub.
**Status: `RENDERED_INSPECT_REDO`. No approval, Foundry write, or Item implementation.**

## Inspected results

**PASS local details:** Small bare disturbed soil patch at right center near stump and spade; unlike Attempt 2 the doll itself is absent from visible ground. Eerie autumn landscape and damaged timber structure. Legible dock and boat.

**HARD REDO:**
1. Boathouse occupies upper-left immediately **adjacent to the west/bottom-left landing dock**. The planned spatial route of safe west arrival → single narrow choke → east/northeast Boathouse is absent. The east side has only an open path, not the destination.
2. Magenta thorn vines mostly coat the Boathouse roof and surrounding overgrown fence. They do not form a **single obligatory blocker across a land route**. A removable Plant-Killer Region/Tile would not provide a nonbypassable entry gate without imposing artificial collision across a broad clearance.
3. Water fills much of the lower-left quadrant and extends across much of bottom border. The owner explicitly asked for a **small amount of water by a short dock**; water remains more dominant than wanted. The broad dock and moored boat lead directly to Boathouse.
4. Three-quarter view / pitched roof leans isometric instead of 90-degree orthographic. Upper building is visually inaccessible from a true overhead floor path; Prayer of Devotion interior staging would be awkward.
5. Return Region could plausibly be near the dock, but a clear edge-crossing arrival and land route is not substantiated by the painted geometry.

## Next-step design improvement (only if owner commands another REDO)
Use deterministic geometry first: start from landscape where west *edge* has a 1–2 plank short pier in a thin water strip, majority central ground occupied by a single fenced/root-bounded eastward path, isolated roofless/open-floor boathouse at east end, a genuine choke gap before boathouse, tiny plain patch of dirt at reward side. Prior attempts repeatedly pulled the Boathouse toward waterfront and made colorful vines part of building; cannot claim this is compatible with planned removable plant-growth logic. If re-rendered, freshly reread current PREPARE and use an independently composed inclusion-only image direction, one candidate then inspect.

**Optional Item still planned:** Sophie's Favorite Doll, +1 saving throws and +1 attack rolls while worn per explicit owner decision; neither item nor Dig Region has been built.
