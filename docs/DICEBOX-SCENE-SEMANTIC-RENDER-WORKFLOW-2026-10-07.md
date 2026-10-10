# DiceBox Scene Semantic Render Workflow — 2026-10-07

**Status:** current canonical Scene Creation rendering rendition  
**Version:** 2026-10-07.2  
**Scope:** new DiceBox Campaign Helper Scene Creation map generation unless PREPARE records an explicit user-approved exception

## User-facing workflow compatibility

The named Scene Injector API remains:

`PREPARE → RENDER → INSPECT(PASS = APPROVED | REDO) → BUILD`

`APPROVE` remains optional and redundant after a final INSPECT PASS.

RENDER and INSPECT now contain a mandatory two-pass semantic rendering process:

`PREPARE → STRUCTURAL_RENDER → STRUCTURAL_INSPECT → FEATURE_MANIFEST → PAINT_RENDER → FINAL_INSPECT(PASS = APPROVED | REDO) → BUILD`

The outer workflow names are retained for compatibility with the existing state machine and validator. A Scene is not considered `RENDERED` for BUILD purposes until the painterly live render exists and the required structural artifacts have been preserved.

## 1. PREPARE

PREPARE locks the scene intent before image generation:

- scene identity and campaign continuity;
- logical dimensions, scale, and camera;
- required topology, entrances/exits, and route relationships;
- must-have rooms, objects, landmarks, and interaction anchors;
- forbidden or intentionally absent features;
- discoveries, hazards, transitions, and stateful requirements;
- art direction and acceptance criteria.

If an authoritative Spatial Blueprint already exists, the render must conform to it. If the Blueprint is incomplete, the structural render may propose missing visual structure, but it cannot become Foundry geometry directly from pixels.

## 2. STRUCTURAL_RENDER

Generate a strict overhead grayscale structural map that reads like a clean 3D model or Blender-style graybox viewed from directly above.

Required qualities:

- strict 90-degree overhead orthographic camera;
- clear wall thickness, openings, room boundaries, floor changes, elevation cues, and major object footprints;
- recognizable furniture and environmental objects;
- readable object separation and silhouettes;
- grayscale materials and lighting that clarify form rather than create mood;
- no baked grid, labels, tokens, UI, or decorative paint that hides geometry;
- wall, barrier, shoreline, and elevation boundaries that can be traced as intentional line segments or polylines for later Foundry projection;
- curved architecture expressed with stable, deliberate vertices/segmented arcs rather than fuzzy circular brushwork as the sole collision boundary;
- doors, gates, windows, and other openings with clear endpoints and widths rather than ambiguous gaps.

The structural pass is not final art. Its purpose is semantic readability.

A 3D modeled look is encouraged, but the camera must not tilt. Depth should come from top planes, bevels, ambient occlusion, contact shadows, material relief, and object height cues rather than perspective.

### Route width and geometry tolerances (accepted 2026-10-09)

Apply [DiceBox Geometry Tolerance Standard](DICEBOX-GEOMETRY-TOLERANCE-STANDARD-2026-10-09.md) at PREPARE/STRUCTURAL_INSPECT/Blueprint reconciliation. Preferred main road is 15ft (10–20ft preferred), forest trail 10ft (5–15ft preferred); no upper width rejection. Short, authored 5ft bottlenecks are not automatic REDOs when intended Medium tokens can traverse them. Route-specific Large/Huge access retains its **required** 10ft/15ft functional clearance. Measure and record uncertainty, categorize walkable *ground* separately from decorative road paint, overhead caps and solid trunks/rock. An uncertain dimension triggers internal NEEDS_RECONCILIATION, not an automatic image rerender. Structural PASS may document acceptable width variance; it never alone certifies swept token movement. Preserve clean-restart rule on genuine REDO and existing FINAL_INSPECT approval semantics.

## 3. STRUCTURAL_INSPECT

The grayscale structural render must be inspected before any coloring or painterly treatment.

The inspection compares the render against PREPARE and produces a machine-readable or structured Feature Manifest. It must identify, where present:

- solid movement-and-vision walls;
- terrain or conditional vision boundaries;
- doors, gates, secret doors, and openings;
- windows, grates, railings, bars, and partial barriers;
- movement-only blockers and clearance constraints;
- vision-only blockers;
- stairs, ramps, ledges, pits, bridges, balconies, and elevation changes;
- water, difficult terrain, hazardous terrain, and traversable terrain;
- fixed architectural objects;
- baked environmental objects;
- stateful or separately placeable objects;
- overhead/roof/canopy elements;
- likely light sources and emissive fixtures;
- likely ambient sound sources;
- hazards and traps;
- interactables and puzzle apparatus;
- scene transitions and portals;
- discovery anchors;
- candidate Regions and triggers;
- uncertain or ambiguous features requiring explicit review.

### Provisional Feature Manifest entry contract

Until the dedicated machine schema is implemented, every consequential manifest entry must still carry enough structure to make later Foundry projection deterministic:

- stable provisional feature ID;
- source structural-render identity/hash;
- semantic class and authored purpose;
- geometry primitive (point, line segment, polyline, polygon, or area) plus coordinates in the locked render/logical coordinate space;
- separate movement, vision, sound, and light restriction intent where relevant;
- opening/portal state such as ordinary opening, door, gate, secret door, window, grate, or conditional barrier;
- environmental state such as water, difficult terrain, hazard, elevation edge, stairs, bridge, pit, or overhead obstruction;
- presentation ownership: baked/static background, semantic-only Region anchor, or separately stateful/placeable object;
- candidate Foundry projection type: Wall/door Wall, Region, RegionBehavior, AmbientLight, AmbientSound, Tile/placeable, transition/teleport, Note/interaction anchor, or none;
- relationships to other features, such as a torch mounted on a wall, a door occupying a wall opening, or a bridge spanning water;
- confidence, ambiguity, and explicit review notes.

A Foundry projection hint is a proposal, not runtime authority. It becomes deterministic only after reconciliation with PREPARE and any existing Spatial Blueprint.

Structural inspection may propose semantic classifications from visible evidence. Those classifications become authoritative only after they are recorded in the Feature Manifest and reconciled with PREPARE and any existing Spatial Blueprint.

Raw pixels alone are never Foundry geometry authority.

### Permanent clean-restart requirement (all image stages)

The locked, project-global authority is [DICEBOX-IMAGE-PROMPT-CLEAN-RESTART-RULE-2026-10-09.md](DICEBOX-IMAGE-PROMPT-CLEAN-RESTART-RULE-2026-10-09.md). No retry may reuse a variation of any preceding image prompt. Archive prior generations and prompts only as evidence; on REDO, independently design the new prompt from accepted canonical inputs without looking at, rephrasing, or submitting the previous prompt/failed image. Original structural requirements remain binding even as the new creative composition and wording are entirely rebuilt. For painterly REDO, the approved structural render (not the failed painted image) remains a valid canonical input. Apply across all other DiceBox image types as well, not solely maps.

## 4. STRUCTURAL_CORRECTION

If structural inspection finds missing, ambiguous, merged, or contradictory features, correct the structural pass before coloring.

A structural REDO:

- starts from PREPARE and the accepted structural requirements;
- uses a fresh prompt rather than patching the failed prompt;
- may preserve explicitly accepted requirements, but does not ask the model to preserve a failed composition;
- repeats STRUCTURAL_INSPECT before advancing.

Do not use paint, texture, shadow, fog, or color to conceal a structural failure.

## 5. FEATURE_MANIFEST AND BLUEPRINT LOCK

Before PAINT_RENDER, reconcile the inspected Feature Manifest with the Spatial Blueprint.

Authority rule:

- an existing explicit Spatial Blueprint remains geometry authority;
- inspected grayscale features may fill previously unspecified semantic details only after reconciliation;
- contradictions between Blueprint and inspected structure block advancement until resolved;
- the reconciled Feature Manifest/Blueprint pair is the deterministic source for later Foundry Wall, door, Region, light, sound, Tile/placeable, transition, and interaction planning.

The painterly image does not own those semantics.

## 6. PAINT_RENDER

Create the live painterly map from the approved structural render and reconciled Feature Manifest.

The paint pass should:

- preserve topology, object count, object placement, openings, clearances, and interaction affordances;
- use clear color separation and readable materials;
- paint walls as physical walls with material variation, surface detail, wear, trim, and depth rather than flat single-color bands;
- paint floors, furniture, books, shelves, tables, fixtures, vegetation, water, stone, wood, metal, and other objects as recognizable materials;
- keep important objects individually identifiable;
- visibly distinguish lit versus unlit torches, braziers, lamps, crystals, fireplaces, windows, and other emitter candidates without letting bloom obscure the fixture or nearby openings;
- keep water, hazards, difficult terrain, pits, ledges, and other Region-relevant boundaries readable after texture and color are added;
- add mood, wear, grime, age, or elegance without obscuring semantic features;
- preserve strict overhead orthographic composition.

The paint pass must not silently add, delete, move, merge, split, open, close, or reclassify a feature recorded in the approved Feature Manifest.

## 7. FINAL_INSPECT

The painterly live render is inspected a second time against:

1. PREPARE;
2. the approved structural render;
3. the reconciled Feature Manifest/Spatial Blueprint.

FINAL_INSPECT checks both aesthetics and semantic preservation.

It must verify that:

- walls and openings still match;
- doors/windows/barriers remain identifiable;
- stateful objects remain identifiable;
- important light/sound/hazard/transition anchors remain legible;
- every visibly lit fixture still corresponds to an intended lighting-candidate manifest entry, and decorative unlit fixtures have not gained misleading emissive treatment;
- paint has not created false openings, blockers, or traversable areas;
- no required object disappeared into texture or shadow;
- no unapproved semantic object appeared;
- strict overhead orthographic geometry was preserved.

Only a **FINAL_INSPECT PASS** approves the painterly render and moves the outer workflow to `APPROVED`.

A structural inspection PASS does not approve final art.

If the final pass fails only because of paint/material drift, redo PAINT_RENDER from the approved structural render and Feature Manifest using a fresh paint prompt. If the failure exposes a real structural error, return to STRUCTURAL_CORRECTION and invalidate downstream paint approval.

## 8. BUILD AND FOUNDRY PROJECTION

BUILD consumes the approved painterly art plus the reconciled Feature Manifest/Spatial Blueprint.

Foundry configuration is derived from the deterministic semantic records, not guessed ad hoc from final pixels.

The projection may include, as applicable:

- native Walls and door states/types;
- movement/vision restrictions;
- Terrain/Region logic;
- AmbientLights;
- AmbientSounds;
- Tiles/placeables for objects that need separate state or positioning;
- Regions and RegionBehaviors;
- Notes or interaction anchors;
- transitions/teleports;
- overhead objects;
- hazards, discoveries, and puzzle apparatus.

`Foundry Tile` means the native document type. A fixed object may remain baked into the background while still having a semantic Region/interaction record when it does not require independent visual state.

## REDO scope rule

REDO is stage-scoped:

- structural failure → fresh STRUCTURAL_RENDER from PREPARE;
- paint-only failure → fresh PAINT_RENDER from the approved structural render + Feature Manifest;
- final inspection that discovers structural drift → return to STRUCTURAL_CORRECTION.

Never patch the failed generation prompt. Recompose the prompt from the current canonical inputs for that stage.

## Compatibility with existing automation

Until a newer state-schema validator introduces explicit substate enums, the existing outer durable states remain valid:

- `PREPARED`
- `RENDERED`
- `INSPECTED_REDO`
- `APPROVED`
- `BUILT`
- later automation states

The structural render, structural inspection, Feature Manifest, painterly render, and final inspection are required artifacts inside the outer RENDER/INSPECT phase. A structural PASS may keep the outer state at `PREPARED` while painting completes; a structural REDO may use existing `INSPECTED_REDO` with the structural render as its bound failed-render evidence; the state becomes `RENDERED` only when the painterly candidate exists. No new unvalidated outer state name is required.

## Current style lock

The default visual target for new tactical maps is:

**strict overhead orthographic, Blender-like grayscale structural clarity first, then a painterly live treatment with clearly differentiated materials and identifiable objects.**

Walls and environmental objects must remain visually physical and readable after coloring. The final map should not collapse the structural model into flat graphic bands or simplified symbols.
