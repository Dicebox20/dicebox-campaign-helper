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
