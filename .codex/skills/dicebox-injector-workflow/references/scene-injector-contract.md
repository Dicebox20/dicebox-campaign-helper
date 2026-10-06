# Scene Injector Contract Reference

## Canonical transport

DiceBox Scene Injector BUILD output is a Markdown handoff containing exactly one executable JavaScript macro. Markdown is the transport wrapper; the JavaScript block is the entire user-run operation.

A single macro may internally contain compressed/encoded image chunks and reassemble them at runtime. Internal chunking is allowed; multiple user-run macros are not.

## Runtime lineage to preserve

The BTR Prototype 3/4/4.6C line established the canonical Scene Injector pattern:

- normalized MapSpec / stable scene specification;
- injector-owned artwork deployment and verification;
- stable IDs;
- reuse Foundry's default Level rather than creating a duplicate;
- Level-bound Walls and Regions;
- dry-run Wall/Region creation before persistence;
- batch persistence;
- post-install asset, geometry, UUID/behavior, and state validation;
- READY only after validation;
- no same-Region TOKEN_ENTER behavior may enable another TOKEN_ENTER behavior on that same Region during the same event.

New scenes may omit puzzle-specific elements, but BUILD must not silently abandon the established transport and validation model.

## Image transport

When self-contained embedded art is used:

- prefer a compact VTT-suitable WebP when source size would make the macro impractical;
- store the encoded image as one logical payload, optionally split into string chunks inside the same JavaScript macro;
- reassemble and decode inside that macro;
- verify expected bytes/hash/dimensions before creating dependent Foundry documents when the injector has those values;
- verify the uploaded/served asset path before binding it to the Scene.

Do not solve macro-size limits by asking the user to execute sequential macro fragments.

## Fail-closed behavior

If the approved art, stable scene ID, canonical workflow source, or required build validation is unavailable, BUILD is BLOCKED. Report the missing dependency and recover it. Do not substitute a ZIP, a generic manifest package, a loose `.js`, or several macros.


## Scale / token contract

All new generated battle maps default to `battlemap-120` as defined by `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md`.

The canonical scale is Gridless, 120px per logical 5ft space, with Scene dimensions derived from PREPARE's logical column/row count. For the current 3:2 forest-maze family, 36×24 logical spaces becomes 4320×2880 pixels.

Do not treat Gridless as “scale-free.” Foundry still uses the configured grid size/distance to establish token footprint and distance scale. Do not use 50px just because the lines are hidden.

Token width/height is a mechanical footprint. Token Scale Ratio only changes artwork rendering. Scene Injector code must not resize player/creature token footprints or visual Scale Ratio merely to compensate for a map-scale mismatch. D&D5e system size synchronization remains authoritative unless a separate Actor/token decision explicitly overrides it.

New BUILDs use contract `dicebox-scene-injector-build/v2`, the required scale markers, and a single `DICEBOX_SCENE_SCALE` constant referenced by Scene width/height/grid fields. Explicit scale exceptions must be PREPARE-approved and fail closed without an approval marker and reason.
