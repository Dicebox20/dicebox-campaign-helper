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


## Map consolidation rule

Day/night is a **state change inside one geography Scene**, never a reason to create a second map.

- No `-night`, `-haunted`, or other time-of-day duplicate Scene is created for an area that already has an approved geography Scene.
- If an older draft assigned story, puzzle, scare, or traversal purpose to a separate time-state map, that purpose must be absorbed into the surviving Scene through stateful Regions, Tiles/Background Objects, AmbientLights, sounds, weather, doors, and flags.
- Geometry changes require a separate Scene only when the physical layout genuinely becomes a different navigable space that cannot be represented safely as stateful Foundry documents.
- A day/night change alone never qualifies as new geography.
- The current canonical Lodge roster therefore remains the **21 unique geography Scenes**. The event-driven day/night system prevents additional duplicate night counterparts from being added.
- Before removing or declining a duplicate map, record its intended gameplay purpose and the exact surviving Scene/state that now owns that purpose.

### Purpose absorption for removed time-state maps

The surviving Scene must absorb any former duplicate-map purpose in the following order:

1. **Visual mood** → aligned night reshade + Scene darkness.
2. **Fire/fixture illumination** → authored Lighting Regions + native torch-style AmbientLights.
3. **Night-only scares** → state-gated one-shot Horror Regions.
4. **Night-only clues or manifestations** → state-gated Notice/Story Regions.
5. **Changed access or blockers** → stateful doors, Tiles/Background Objects, or Wall/Region logic.
6. **Changed sound/weather** → state-owned soundscape/weather controls.
7. **Evidence that the cult is active** → state-gated props, lights, sounds, and recent-use clues on the same geography.
8. **Escalation pacing** → campaign-state gates, not duplicate Scenes.

The result should feel like the same real place changing around the party, which is preferable for this campaign's horror continuity.

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


### Lighting pacing and sconce standard

Day/night-capable areas must be authored with the lighting transition in mind from PREPARE onward.

- Permanent architecture may include **visible but unlit wall sconces, lantern brackets, porch lamps, or similar fixtures** wherever a real building would plausibly have them.
- The fixture itself may be part of the approved background renderer when it never needs to move. Do not paint an active flame, glow halo, or baked illumination into the day renderer.
- At runtime, each authored fixture receives a Foundry AmbientLight aligned to the fixture.
- The preferred fire simulation is Foundry's native **torch-style animated lighting effect**, with restrained flicker and no rapid cycling.
- Day state keeps transition-controlled sconces disabled.
- Night activation enables only the authored lights for that Scene. Large portions of the Lodge should remain dark; night does not mean every fixture ignites.
- Light placement follows believable architecture and horror pacing rather than uniform spacing.
- Light sources must not reveal hidden rooms, puzzle answers, or areas beyond intended Wall sight boundaries.
- Photosensitivity-safe behavior is mandatory: no strobe, no rapid on/off loop, no high-frequency intensity changes.

#### Transition pacing

The event-driven day-to-night transition uses a paced sequence instead of enabling every light simultaneously:

1. **Dimming:** the night plate begins to crossfade and Scene darkness rises while all transition-controlled sconces remain off.
2. **Threshold lights:** exterior entry, porch, gate, or other primary circulation fixtures ignite first.
3. **Interior response:** a limited number of authored window/interior sconces ignite next where the current horror/story state justifies signs of activity.
4. **Peripheral response:** selected secondary-route fixtures ignite last, leaving deliberate dark pockets.
5. **Settle:** Scene darkness, night plate opacity, active light set, soundscape, and campaign state are authoritatively persisted as `night`.

The transition should feel gradual and uncanny, not like a building-wide electrical switch.

#### Lighting-density progression

Use lighting density to reinforce the campaign's horror progression:

- **E1-E2 — Abandoned:** very sparse. Entry/circulation fixtures only; most of the estate remains black.
- **E3-E4 — Haunted:** sparse, with a few isolated fixtures creating separated pools of light and stronger darkness between them.
- **M1-M3 — Haunted / Sacrificial approach:** sparse-to-moderate. Main circulation may have usable sconces, but side rooms and service areas retain darkness.
- **U1-U2 — Haunted / victim history:** sparse and uneven. Avoid comfortable residential coverage; nursery/attic spaces remain especially restrained.
- **B1-B2 — Sacrificial:** practical utility light becomes less architectural and more selective. Day/night reaction may be minimal where daylight never mattered.
- **C1-C2 — Active cult:** ritual/cult-controlled flame may exist independently of the day/night cycle. Do not automatically tie every ritual flame to sunset.
- **N1-N3 / T1-T3 — Railway:** use railway/utility lighting logic rather than domestic sconces. Day/night state may alter ambience, but underground illumination is owned by railway/cult state.
- **F1-F2 — Infernal:** lighting is encounter/ritual-state owned, not ordinary day/night illumination.

PREPARE for each Scene records the lighting class, fixture anchors, which lights are controlled by day/night, which are controlled by puzzle/story state, and which deliberately remain dark.

#### VERIFY requirements for lighting

For every day/night-capable Scene, VERIFY must confirm:
- every enabled AmbientLight is aligned to a visible/plausible fixture;
- disabled day-state sconces emit no light;
- torch animation reads as fire without strobing;
- staged ignition order matches the authored pacing group;
- Walls correctly contain light and sight;
- intentionally dark pockets remain dark;
- reload/reconnect restores the correct active-light set without replaying the transition.


## Render-context firewall

Image generation is a **visual rendering lane**, not a story-design lane. The image model must never receive the full campaign/puzzle specification.

Before every RENDER call, generate or read a dedicated **clean render capsule** containing only current-map visible physical information.

The clean render capsule may contain:
- camera/view;
- time of day and broad weather/illumination;
- terrain and permanent architecture;
- permanent visible props;
- visible exits that end at the map edge;
- broad material/condition cues such as wet, ruined, overgrown, cracked, or abandoned;
- the minimum generic exclusions needed for a player-facing battlemap.

The clean render capsule must not contain:
- campaign plot, mystery ladder, cult identity, Fiend Machine, victim history, or future reveals;
- puzzle purpose, item dependency, clue meaning, solution logic, or object destination;
- Region IDs, Region classes, trigger logic, DCs, skills, cooldowns, state flags, or VERIFY instructions;
- Foundry implementation details, macros, Walls, AmbientLight behavior, automation, or scene-state code;
- adjacent-map names, destinations beyond exits, future rooms/areas, or route explanations;
- explanatory annotations such as “this is the puzzle,” “recent-use clue,” “night trigger,” “story beat,” or “player should notice”;
- negative references to specific forbidden neighboring content when a generic exclusion is sufficient.

A physical object may be named only by what it visibly is, not by its gameplay role. For example:
- use “an old iron hand crank on a workbench,” not “the Iron Hand Crank that operates the well”;
- use “a weathered bell fixture,” not “the Servant Bell Pull puzzle”;
- use “faintly disturbed mud,” not “recent-use evidence proving the cult is active.”

The render capsule is the **only creative authority passed to image generation**. Story and puzzle documents remain outside the render call.

If a generated image contains diagrams, labels, story exposition, puzzle annotations, UI, or other non-map information, INSPECT automatically returns REDO and the next render must use a freshly rewritten clean capsule rather than patching the contaminated prompt.

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
