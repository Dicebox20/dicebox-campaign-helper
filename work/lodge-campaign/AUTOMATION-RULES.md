# Central Lodge Campaign Automation Rules

**Status:** active campaign workflow controller  
**Campaign:** central-lodge  
**Workflow:** PREPARE -> RENDER -> INSPECT -> BUILD -> IMPLEMENT -> VERIFY

## Objective

Carry the remaining Lodge campaign maps from concept through verified Foundry Scenes with minimal user intervention while preserving DiceBox Campaign Helper safety, evidence, and Scene Injector rules.

## Control model

- One campaign map is active at a time.
- A PASS at INSPECT is automatic approval and advances directly to BUILD.
- REDO is an internal RENDER loop. A REDO prompt is rewritten from the approved PREPARE specification, not patched from the failed prompt.
- The controller may make routine spatial, decorative, and puzzle-presentation decisions that are already implied by campaign canon and the map roster.
- Stop for the user only when a choice would materially change campaign canon, puzzle dependencies, story meaning, or an accepted visual identity.
- A blocked or outcome-unknown live write never auto-retries.
- Every Desktop Commander work turn remains capped at 20 minutes. At the cap, persist exact state and stop cleanly.

## Phase contract

### PREPARE

Create the complete map specification and lock:
- map purpose and progression role;
- topology and usable routes;
- visible background-only content;
- stateful puzzle objects;
- Foundry runtime effects;
- logical dimensions and the battlemap-120 scale;
- walls, doors, Regions, transitions, and discovery count;
- acceptance checklist.

The render description may mention only what is physically visible on the current map. Never name or describe off-map neighboring structures, destinations, future rooms, or route explanations.

### RENDER

Generate only permanent background art plus stable visible landmarks. Use the current DiceBox tactical-map camera rule and the current approved art specification.

Do not bake in:
- grid;
- labels;
- UI;
- Region markers;
- dynamic lighting;
- fog behavior;
- transient apparitions;
- state-change text.

### INSPECT

Evaluate topology, permanent landmarks, scale, tactical usability, campaign isolation, readability, camera compliance, and absence of unwanted text/grid/UI.

Small stateful details do not fail an otherwise correct background when BUILD can supply them more reliably.

PASS automatically advances to BUILD. REDO returns to RENDER with a fresh prompt.

### BUILD

The only user-facing BUILD artifact is:
- exactly one Markdown file;
- exactly one fenced JavaScript block;
- exactly one self-contained executable Scene Injector macro.

The macro must:
- use `dicebox-scene-injector-build/v2`;
- use the PREPARE-approved battlemap scale;
- embed/import its own approved artwork;
- keep practical macro source near or below the historically reliable 100 KB transport range where possible;
- internally reassemble compressed art when needed;
- create/upload and served-byte/hash-attest assets before dependent document creation;
- reuse Foundry's default Level;
- use stable DiceBox IDs;
- use `CONST.EDGE_SENSE_TYPES`, not deprecated `CONST.WALL_SENSE_TYPES`;
- preview before mutation;
- exact-target and active-GM gate live writes;
- preserve foreign and unknown state;
- authoritatively reread after mutation;
- return blocker-based receipts;
- treat timeout or ambiguous writes as UNKNOWN and forbid blind retry.

Before delivery, run:

`node tools/validate-dicebox-build.mjs <artifact.md>`

A validator failure blocks BUILD.

### IMPLEMENT

One reviewed macro execution is one bounded live action.

Expected first-run 404 responses for injector-owned asset paths mean the assets are absent and may be uploaded by the same macro. They are not failures by themselves.

The macro uploads its own art, verifies served bytes, creates the Scene and managed documents, rereads them, and reports PASS, BLOCKED, or UNKNOWN.

No separate user-run upload macro is permitted.

### VERIFY

Verify:
- Scene dimensions and logical scale;
- background path and image dimensions;
- wall and door alignment;
- Region placement;
- puzzle/state tile alignment;
- transition anchors;
- current puzzle state;
- runtime behavior bindings;
- darkness, weather, sound, and scare behavior where authored;
- GM and player-facing behavior where relevant;
- no foreign-state damage.

Prefer project tooling, Playwright, or read-only runtime inspection over another user-run macro.

A visual/state alignment defect goes to a narrow patch or BUILD correction. It does not force a rerender unless the approved background itself is wrong.

## Live failure rules

- BLOCKED: reconcile the blocker before another live action.
- UNKNOWN: authoritative reread is mandatory before deciding whether anything should be retried.
- Second same-class runtime failure: stop further retries, query the project KB, reduce to a bounded reproduction, validate the narrow fix locally, then attempt one fresh live action.
- Never replay a state-changing macro merely because a response timed out.

## Campaign identity

The Foundry world is a runtime container, not creative identity. The current campaign is always `central-lodge`. Foreign campaign content in the same world must never influence PREPARE, RENDER, or INSPECT.

## Stateful art

Python/image-processing code may resize, convert, crop, composite, or hash approved artwork. It must not invent final player-facing artistic puzzle assets. Artistic state variants come from approved art or image generation/editing.

## Campaign progression

The controller processes maps in the canonical roster order unless a dependency requires a different order. Stable Scene IDs are reserved in advance, so transitions may safely target later maps without creating those maps early.

E1 is already installed from BUILD v004 and is currently at VERIFY. Do not rerun its installer.
