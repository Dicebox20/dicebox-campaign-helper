# DiceBox Universal Representative-Wall Battlemap Standard — 2026-10-22

**Status:** PERMANENT OWNER-APPROVED PROJECT-WIDE DEFAULT / mandatory battlemap quality gate.
**Authority:** Owner explicitly instructed: “lock in the New mapmaking rules as universal permanent guidance and a requirement for all maps project wide, then re-render the failures.” This changes the global *map-art requirements*, not the permission boundary for Foundry or the chronology of historical renders.
**Applies:** Every future DiceBox tactical/scene battlemap across Campaign Helper, any DiceBox campaign and side campaign, all rendering providers, global Map Creation PREPARE/RENDER/INSPECT/BUILD, map revisions and stage variants. Existing installed maps remain historical and are not retroactively modified merely because the standard was adopted. Explicit later owner exceptions can be narrowly scoped and must be recorded.

## 1. Top-down gameplay surface, not a dollhouse

Every tactical map image must read as a **90-degree plan-view tabletop battlemap**, with visible traversable floor/terrain, clearly distinguished objects, roads, water, changes in elevation, doors, walls and interactive landmarks. It must not look like a diorama, isometric/three-quarter-view room, side-elevation illustration or cutaway of tall interior walls. Strict orthographic framing, consistent across connected scenes and stage variants. No painted grid, character/token art, coordinate labels or UI.

## 2. REPRESENTATIVE WALLS — universal hard gate

An interior/exterior structure’s art shows **representative physical wall *footprints***, not the full vertical height of the walls as facades. Depict each wall as a consistently narrow, legible **top-facing stone/timber/masonry cap, band or plan-view material strip**, with restrained bevel, contact occlusion and localized material relief that communicates thickness/texture. Only very small, overhead-readable edge/facing cues are allowed; no looming side-facing plaster walls, exposed interior elevations, dollhouse-style wall cutaway, forced perspective, towering backdrop or painted wall verticals covering traversable floors.

Walls are *visually representative* but real doors/secret doors/windows/openings must still be positioned according to the approved Spatial Blueprint. A representative wall band is **not** itself the authoritative Foundry Wall. Mechanics still derive from semantic wall segments, physical collision/vision restrictions, approved door anchor coordinates and Feature Manifest. Never turn every dark border, cliff cap, roof/canopy or furnishing into a blocking mechanical Wall based solely on its painted pixels. Exterior stonework and pathways follow the same low/plan-view illustrative grammar where applicable.

### Concrete wall inspection checks
- All mandatory entrances/exits land at the expected walls and correct facing directions; no extra decorative door reading as a travel portal.
- Thickness/material readable without giant exposed side faces; consistent representative-wall proportions for related rooms.
- No stairs/doors/critical clues obstructed by invented vertical walls.
- Hidden rooms remain invisible until their authorized transition; no cutaway reveals secret construction.
- Wall art and proposed collision geometry are reconciled within the accepted DiceBox geometry-tolerance standard; a mechanically misleading portal or sightline is a hard REDO/structural blocker.

## 3. Painterly TTRPG environment art and tactical readability

Use a polished, **richly textured painterly battlemap** aesthetic, not generic photo-real interiors, AI dollhouse miniatures, simplified blueprint graphics or exaggerated decorative dioramas. The owner-selected positive stylistic reference is *Overgrown Forest Shrine Clearing.png* (2026-10-22)—a style/readability exemplar, not an authority for any room's geometry.

Preserve organic surface variation, discernible material edges, tasteful vegetation/furnishings, and strong object separation. Art must remain **game-map-first**: enough open traversable area to place/move party tokens, legible routes at Foundry zoom, recognizable puzzle and story fixtures, and nonessential ornament allowed only when it does not conceal an interaction. “Good enough” cosmetic tolerance never waives essential landmark legibility or actual door/route/function correctness.

## 4. Neutral baked illumination — Foundry owns lighting

The permanent map background uses **even, broadly neutral, diffuse illumination** with subtle local contact shading for shape; preserve natural *material* hue (colored flowers, warm wood, copper, cloth). No baked sunlight direction, strong moonlight, exaggerated warm glow, flickering light, dynamic torches, vivid colored spell light, Crimson Veil grading, heavy darkness, lens bloom or long shadows that contradict Foundry dynamic lights. Show lantern/fireplace/candle/torch as a neutral **physical fixture** only. Create active glow, time-of-day, darkness, red Veil ambience, emitter state, particles, sound or weather using separate runtime/overlay assets. A specific owner-approved exception can justify an intentionally emissive permanent fixture, but the image must still preserve functional visibility and the light metadata must be explicit.

## 5. Permanent vs stateful assets

**Background/baked:** stable floors, permanent architecture, appropriately representative wall caps, fixed furnishings, static environmental landmarks and structural supports.

**Independent placeable / visual state:** player-removable loot, keys, Bowl, tools, collected pages/items, changing clock hands/eyes, moveable items, door panels that open/close, secret openings, puzzle pieces/rotating rings, water-level/terrain changes and other pieces that become absent/revealed during play. A permanently painted housing (e.g. plinth, lockbox case, clock body, wall recess) may have a separate lid, removable component or animated overlay. Use the *least complex* correct implementation: Foundry illumination for lighting only; controlled Tile for local visual states; native Wall/Region for interaction/collision; staged art for substantial terrain geometry changes. Do not paint a permanently visible reward that should disappear after pickup.

## 6. Must-see story / gameplay fixtures

PREPARE must identify 3–7 consequential visible anchors or link a verified shared manifest. Images must make key objects **recognizable from a normal tabletop zoom**—not just mentioned in prompt text. A hidden discovery still needs an appropriately visible fair physical clue when the correct stage is reached; no early spoiler leakage. Fully detailed inspectable text/code belongs in a Journal/handout, not impossible-to-read tiny labels baked into artwork.

## 7. Rendering and inspection integration

The current `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md` remains the global structural-to-painterly pipeline. This document is its **mandatory stylistic/functional overlay** on both stages and final inspection:

- **PREPARE** includes style reference ID, representative-wall grammar, the authoritative geometry/doors, lighting ownership, must-see fixtures and independent stateful assets.
- **STRUCTURAL_RENDER / INSPECT** verifies wall cap projections, openings, overhead camera, route clearances, stair/elevation design and semantic wall geometry (blueprint first).
- **PAINT_RENDER** inherits reconciled structure and this locked painterly neutral art language; no cutaway drift, material ambiguity or invented doors.
- **FINAL_INSPECT** issues `PASS` (cosmetic notes allowed by relevant campaign exception) only if wall representation, camera, lighting separation, item legibility, spoilers and geometry are correct. Perspective drift, tall cutaway walls, unapproved portals, missing critical objects and false traversal are hard `REDO`.
- **BUILD** preserves native Foundry Wall/Region/Tile/Light semantics separately from background paint, with normal active-GM/runtime verification. No claimed runtime proof from render quality alone.

The Cabin in the Ashen Veil campaign's authorized **FAST creative workflow** may derive structural evidence directly from its accepted architectural blueprint rather than newly generating grayscale art for every plain room, but the *same global final artwork gates* apply. This global standard does **not** universally adopt that campaign's speed exception.

**Clean-restart remains universal:** After a rejected image, archive historical image/prompt but never reuse, edit, paraphrase or submit them as reference for the next image. Construct a new independent generation from canonical blueprint, this style standard and **accepted positive owner reference**. Do not mark an image approved merely because a new prompt was sent.

## 8. Quality check / release receipt

For every map: `styleVersion=dicebox-representative-wall-battlemap/v1`, `geometryAuthority`, `styleReference`, `wallPerspective=PASS|REDO`, `requiredAnchors=PASS|REDO`, `portals=PASS|REDO`, `lightingOwnership=PASS|REDO`, `states=PASS|REDO`, `visualVerdict=PASS|REDO`, `foundryReceipt=unverified|verified`. A Final Inspect PASS certifies **art only**, not Stage/Inject completion. Preserve image ID/hash and source provenance. Failed images are labeled `rejected style attempt`, not redefined as valid and not used as positive reference.

## 9. Source and implementation boundary

Authority: owner's 2026-10-22 explicit global instruction, user-provided positive shrine map, 2026-10-07 semantic-render workflow, 2026-10-05 Map/Token scale, accepted 2026-10-09 clean restart and geometry tolerance, plus recorded Reddit/Foundry community findings in `campaign-archives/cabin-in-the-ashen-veil/map-style-research-representative-walls-2026-10-22.md`.

This repository document + `AGENTS.md` + dated `database/seed.d/` source record express the normative rule. Merely editing them does **not** remotely edit platform ChatGPT Project Instructions or automatically modify the desktop app's provider adapters. Those are separate synchronization/implementation tests and must not be misrepresented as completed.

## Permanent render-prompt inclusion-only rule (owner-locked 2026-10-22)

**OWNER RULE: “DO NOT MENTION ANYTHING YOU DON'T WANT ON THE MAP.”** This is a mandatory **project-wide** DiceBox map generation constraint, independent of campaign. A live render prompt is an **authorization list of actual visible ingredients**. Every named noun, furnishing, symbol, light, person, room, terrain feature, label, decorative item, or architectural element in it is presumed eligible to appear. Authors must include only things intended to appear in the resulting background or authorized asset layer.

**Separation of concerns:** Keep forbidden objects, historical failures, speculative alternatives, prior rejected output descriptions, exclusion/negative prompts, and inspection-failure examples in **PREPARE exclusions, inspection policy, or notes kept outside the image-provider prompt**. The positive provider prompt contains only desired camera/style/geometry/materials, approved static fixtures, appropriate room-specific positive puzzle visuals and framing. Keep independent stateful loot, reveals, Wall/Region behavior and nonvisual facts in their proper manifest/asset jobs rather than naming them as objects in a background-image generation prompt unless they must appear in that image. Never pass the rejected image or prompt as a creative reference for its retry.

**Hard preflight:** Extract proposed visible scene nouns/fixtures from the actual prompt and compare against the accepted render-layer feature manifest. Remove extraneous or speculative nouns before provider submission. If any named object is unauthorized or contradicts asset ownership, block generation and independently compose a new positive-only prompt from accepted canonical sources. Keep the standard's strict overhead representative-wall grammar, neutral diffuse painterly art and geometry fidelity through **positive constraints**, for example “single rectangular foyer shown directly overhead, thin top-facing timber wall caps, centered south threshold, visible grandfather clock,” rather than listing unwanted art forms or props.

This guidance governs image authoring, **not** technical documentation's ability to describe failed conditions and explicit REDO thresholds; those stay in inspection/QA documents. Even a positive-only prompt still requires artifact-level inspection because generators can invent objects or miss geometry.
