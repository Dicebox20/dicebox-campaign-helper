# OWNER LOCK — Fifty-year-abandoned Lodge Interior Visual Reference (except basement)

**Recorded:** 2026-10-23 America/Los_Angeles  
**Campaign scope:** Cabin in the Ashen Veil — Blackwood cabin/lodge rooms, **above-ground interiors only**.  
**Owner direction:** “It was done, save this as the example used to create all the lodge rooms going forward, except the basement.”  
**Status:** **OWNER-APPROVED VISUAL PRECEDENT / LOCKED STYLE REFERENCE**. Subject to later explicit owner override; not permission to replace existing other maps without their own INSPECT PASS.

## Authoritative visual reference: H-G06 Great Room, fifty years abandoned

- **Generation source:** `602b78d7-a171-4bc4-a5ed-02ada4f82be8` (`abandoned_manor_great_room_map.png`).
- **Canonical PNG in Foundry Data:** `Maps/cabin-in-the-ashen-veil/h-g06-great-room-aged-fifty-years-approved-2026-10-23.png` (under `C:\Users\rujie\AppData\Local\FoundryVTT\Data\`).
- **Original canonical PNG SHA-256:** `1835cc734ad75fb7d4b0eb8ca441f5d3f78d6f075d9797a4e2b33a412db2ddbe`.
- **Original bytes / size:** `3,239,365` bytes; `1199 × 1312` pixels.
- **Owner's newly uploaded reference image:** `image.png`, `1199 × 1312`, SHA-256 `4b5deab5e71566ede827f4702becf4e3e5372227f96138bd68e221bc7ef231f5`; local RGBA pixel-by-pixel comparison against canonical PNG **PASS with 100% identical pixels**. Distinct compressed PNG file encoding explains differing file digests. The installed original PNG is the canonical reference and should not be overwritten by the re-encoded copy.
- **Provenance:** [approved art native Level background replacement](../h-g06-great-room-aged-art-live-background-swap-2026-10-23.md). Existing `CAVHG06GreatRoom` level currently references the canonical PNG.

## What to carry forward when rendering other above-ground rooms

Use the accepted art as a **visual styling and material-age precedent**, not as reusable room geometry:

1. **Camera and readability:** Strict overhead orthographic, tabletop battlemap, framed room boundaries and legible walkable floor. Clearly readable furniture and entrances.
2. **Fifty years uninhabited:** Worn/split herringbone or appropriate room-specific woodwork, cracked/discolored plaster, aged masonry and timber, accumulated dry dust, cobwebs on corners and furniture, dried leaves and debris concentrated around edges and thresholds, scuffed finishes, frayed rugs and stair runners, tarnished objects, with furnishings retaining their recognizable form.
3. **Palette:** Restrained earthy browns, charcoal stone, faded olive and muted burgundy, subdued patina; rich enough to read as once-pleasant, lived-in historic domestic space, now neglected.
4. **Lighting:** Even, neutral ambient lighting baked into map paint. Window(s) can be drawn as physical architectural openings when fitting a room, with uniform exposure across the floor. Dynamic source illumination, window light reflections and shadows, changing conditions, clocks/interactive states belong in Foundry configuration, not baked into artwork.
5. **Positive feature-only renderer wording:** List only desired visible geometry and furnishings in image-provider prompts; never list banned-feature nouns or names of destinations outside the room. Describe doorway **positions within the room**. For any room with a stair to the next story, use the relevant precise owner-approved stair placement; H-G06 specific user wording was `Stairs on the right siding leaving to the second level`.
6. **Preserve room-specific canon:** Prepare each room from its own approved architecture, entrance openings, puzzle landmarks and item-state boundaries. Do not copy the Great Room's clock, hearth, blueprint table, trunk, sofa or staircase into unrelated rooms just because they appear in the example.
7. **Rendering workflow:** PREPARE → structural verification (as applicable) → feature manifest → RENDER → **owner** INSPECT; revisions remain candidates until owner PASS. When owner-approved, transfer exact new image art with a SHA-256 receipt, and update only approved Scene background references while preserving manual Wall/Region work.

## Explicit scope exception: basement

**All basement maps (H-B01 workshop, H-B02 vault, H-B03 supply closet and any explicitly basement-designated environments) are EXEMPT from this lodge-interior reference rule.** Their visual direction remains governed by their own PREPARE/canon and can be developed separately. This exception does **not** exclude upper floors, attic or other above-ground rooms. Exterior Estate/Grove/Forest/Undercroft maps are outside this specific indoor room-style rule unless the owner expands its scope.

## Do not promote or overwrite other projects

This is a campaign-local visual precedent for Cabin in the Ashen Veil. It does not automatically change the separate Mysterious Lodge / Central Lodge primary campaign or other Dicebox production workflows. Existing older approved images stay preserved until individually replaced with owner approval.

## Implementation status

The owner approved this **example image as the future above-ground look**. It does **not** establish final Great Room wall/door collision certification or authorize replacement of any other installed background. The project's current owner-directed practice lets the owner perform visual INSPECT and manually place Walls/doors; runtime technology can verify documents but may not interpret that as an owner art approval.
