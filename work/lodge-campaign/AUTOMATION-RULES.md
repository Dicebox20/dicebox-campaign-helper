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

## Campaign day/night state

The Lodge campaign uses an **event-driven** day/night transition, not a real-time clock and not a per-Scene timer.

- Campaign state begins as `day`.
- A single explicit campaign event changes the persistent campaign state from `day` to `night`.
- The exact trigger event is a canon decision and remains intentionally unresolved until the user names or approves it.
- Once the trigger fires, every exterior Scene that supports both states reads the same persistent campaign flag and restores the correct state on load/reload.
- Interior and underground Scenes may react to the same campaign flag through lighting, sound, window treatment, or ambience, but they do not require duplicate geometry.
- The transition is one-way unless a later user-approved story event explicitly introduces dawn or reversal.

### Day/night visual authority

Day/night must **not** regenerate map geometry.

For any Scene with a day/night variant:

1. the approved day renderer is the geometry and composition authority;
2. the night plate is derived from that exact approved renderer by reshading/editing only;
3. paths, buildings, walls, fountains, statues, vegetation, puzzle anchors, and framing remain pixel-aligned;
4. the day renderer remains the Scene background;
5. the night renderer is a same-size full-canvas state layer or equivalent renderer state;
6. Foundry darkness, AmbientLights, sound, weather, and Region behavior provide dynamic runtime effects on top of the aligned plates.

A new composition generated merely to depict night is invalid for production. It may be retained only as visual reference.

### Event-driven transition behavior

When the approved trigger event fires:

- persist campaign flag `timeOfDay = "transitioning"`;
- crossfade the aligned night state over the day state;
- increase Foundry Scene darkness in a controlled, photosensitivity-safe transition;
- enable authored exterior/window/porch lights at the appropriate point in the transition;
- switch or layer the night soundscape and weather ambience;
- persist `timeOfDay = "night"` only after the state change completes;
- on reconnect or Scene reload, authoritative state restores the final day/night state rather than replaying the transition.

No strobing or rapid light cycling is permitted.

## Phase contract

### PREPARE

Create the complete map specification and lock:
- map purpose and progression role;
- topology and usable routes;
- visible background-only content;
- stateful puzzle objects;
- Foundry runtime effects;
- day/night support requirements, if applicable;
- logical dimensions and the battlemap-120 scale;
- walls, doors, Regions, transitions, and discovery count;
- acceptance checklist.

The render description may mention only what is physically visible on the current map. Never name or describe off-map neighboring structures, destinations, future rooms, or route explanations.

If a Scene supports day/night, PREPARE identifies one renderer as the geometry authority. Later time-of-day variants are edits/reshades of that renderer, never independent compositions.

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

For day/night Scenes, render the geometry-authority plate once. Night conversion is a later aligned state-art operation, not a fresh map generation.

### INSPECT

Evaluate topology, permanent landmarks, scale, tactical usability, campaign isolation, readability, camera compliance, and absence of unwanted text/grid/UI.

Small stateful details do not fail an otherwise correct background when BUILD can supply them more reliably.

PASS automatically advances to BUILD. REDO returns to RENDER with a fresh prompt, except that a day/night-only correction uses the approved geometry-authority renderer and edits/reshades it instead of generating a new composition.

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

For day/night-capable Scenes, the BUILD also records:
- the day renderer path/hash;
- the night renderer path/hash;
- the persistent campaign-state key;
- the exact state-layer alignment;
- the authored transition duration and runtime effect bindings;
- the trigger event identifier once canonically selected.

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
- day/night state restoration and plate alignment where applicable;
- darkness, weather, sound, and scare behavior where authored;
- GM and player-facing behavior where relevant;
- no foreign-state damage.

Prefer project tooling, Playwright, or read-only runtime inspection over another user-run macro.

A visual/state alignment defect goes to a narrow patch or BUILD correction. It does not force a rerender unless the approved geometry-authority background itself is wrong.

## Live failure rules

- BLOCKED: reconcile the blocker before another live action.
- UNKNOWN: authoritative reread is mandatory before deciding whether anything should be retried.
- Second same-class runtime failure: stop further retries, query the project KB, reduce to a bounded reproduction, validate the narrow fix locally, then attempt one fresh live action.
- Never replay a state-changing macro merely because a response timed out.

## Campaign identity

The Foundry world is a runtime container, not creative identity. The current campaign is always `central-lodge`. Foreign campaign content in the same world must never influence PREPARE, RENDER, or INSPECT.

## Stateful art

Python/image-processing code may resize, convert, crop, composite, hash, or mechanically reshade approved artwork. It must not invent final player-facing artistic puzzle assets. Artistic state variants that materially alter depicted content come from approved art or image generation/editing.

A day/night plate that changes only illumination, color balance, shadow, haze, or wet-surface response while preserving exact geometry is a state-art transformation, not a new map composition.

## Campaign progression

The controller processes maps in the canonical roster order unless a dependency requires a different order. Stable Scene IDs are reserved in advance, so transitions may safely target later maps without creating those maps early.

E1 is already installed from BUILD v004 and is currently at VERIFY. Do not rerun its installer. Its approved installed renderer remains the E1 geometry authority. Any production night version must be derived from that exact renderer, not from the later independent night-map candidates.
