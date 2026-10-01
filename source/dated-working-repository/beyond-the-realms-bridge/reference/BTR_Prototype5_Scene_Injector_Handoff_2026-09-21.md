# Beyond the Realms — Prototype 5 Scene Injector Handoff

**Date:** 2026-09-21  
**Status:** Canonical continuation handoff for Prototype 5 development  
**Target runtime:** Foundry VTT 14.367 Stable, D&D5e 5.3.3  
**Project:** Beyond the Realms  
**Primary task:** Continue the BTR Scene Injector prototype series without redesigning the established workflow.

---

## 1. Mandatory continuation instruction

Continue with **Prototype 5**.

Do not redesign the BTR map / Scene Injector workflow from memory. Before implementation, retrieve and review the canonical project sources:

1. `/Beyond the Realms/Beyond_the_Realms_Campaign_Database_v3_Reconciliation.xlsx`, especially the `Scene Injector` sheet.
2. `/Beyond the Realms/Foundry VTT Technical Knowledge/Beyond_the_Realms_FoundryVTT_Technical_Knowledge_Base_2026-08-26.md`, especially the latest Production Scene Injector runtime addendum and AI map workflow.
3. `/Beyond the Realms/Injectors/README.md`.
4. The latest `/Beyond the Realms/Injectors/MAPSPEC_SCHEMA_*.md`.
5. This Prototype 5 handoff and the approved Prototype 5 map asset.

Do not silently substitute a different pipeline.

---

## 2. Locked BTR map / Scene Injector workflow

Canonical order:

`encounter purpose -> topology -> normalized MapSpec geometry -> mathematical / structural validation -> artwork generated from the same geometry -> injector-owned asset deployment and verified Foundry path -> create / reconcile Scene -> reuse / configure default Level -> bind Walls and Regions -> dry-run writes -> persist -> validate -> READY`

General rules:

- Normalized MapSpec uses logical coordinates, default `0..10000`.
- MapSpec is normally the geometry authority.
- Player maps are gridless, strict 90-degree top-down / orthographic, and contain no labels, directions, legends, solution text, compass, or UI unless explicitly requested.
- The injector owns deployment and verification of artwork generated specifically for itself.
- Reuse Foundry's automatically created default Level rather than creating a second Level.
- Walls and Regions must be explicitly Level-bound.
- Preallocate stable IDs.
- Dry-run Wall creation before persistence.
- Dry-run Region creation with embedded RegionBehaviors before persistence.
- Critical Region feedback uses `ExecuteScriptRegionBehaviorType` on `TOKEN_ENTER`, `canvas.interface.createScrollingText()` when available, plus `ui.notifications.info()` fallback.
- `DisplayScrollingTextRegionBehaviorType` is not a production dependency in Foundry 14.367.
- Native `ToggleBehaviorRegionBehaviorType` and `TeleportTokenRegionBehaviorType` are runtime-confirmed.
- READY is set only after asset, Level, geometry, UUID, behavior, and state validation succeeds.
- Complete Foundry macros / injectors should be delivered as executable JavaScript in chat. Files may supplement them.

---

## 3. Runtime-confirmed reference history

### Prototype 3

Prototype 3 remains the original runtime-confirmed single-macro Scene Injector reference.

Confirmed architecture included:

- normalized MapSpec
- exact Scene compilation
- generated / uploaded asset verification
- stable preallocated IDs
- reuse of `defaultLevel0000`
- one managed Level
- Level-bound Walls and Regions
- Wall dry-run
- Region + embedded RegionBehavior dry-run
- batch persistence
- ExecuteScript feedback
- native Toggle Behavior
- native Teleport Token
- UUID validation
- initial-state validation
- READY only after validation

### Prototype 4 — The Shattered Conduit

Prototype 4 expanded the architecture into a real multi-step resettable Region puzzle.

Final tested sequence:

**Shadow -> Stone -> Depth -> Flame**

Prototype 4.6B installed successfully with:

- exact 1440x1080 embedded player map
- injector-owned upload and path verification
- default Level reuse
- 67 Walls
- 7 Regions
- post-install asset / Level / geometry / UUID / puzzle-state validation
- READY state

### Prototype 4.6C — critical runtime lesson

4.6B revealed a RegionBehavior re-entry bug. On the Shadow Region, a correct `TOKEN_ENTER` toggle enabled new `TOKEN_ENTER` behaviors on the same Region during the same event, producing repeated alternating success / `SEQUENCE BROKEN` feedback.

4.6C fixed this and passed live runtime testing.

**Locked rule from 4.6C:**

> A RegionBehavior responding to `TOKEN_ENTER` must never enable another `TOKEN_ENTER` behavior on the same Region during that event.

For sequence puzzles:

- a correctly solved Region becomes inert after activation
- only future, still-incorrect Regions retain reset behavior
- a reset restores the initial puzzle state
- same-Region event re-entry must be structurally prevented, not merely debounced

Observed successful 4.6C runtime sequence:

- central clue fired
- Shadow fired once
- Stone fired once
- Depth fired once
- Flame fired once
- gate yielded
- no repeated sequence-break loop

Carry this rule into every later BTR Region puzzle.

---

## 4. Macro transport lessons from Prototype 4

Large Base64-embedded artwork can exceed the practical size that Foundry's Macro editor / parser path handles comfortably.

Observed behavior:

- approximately 800 KB macro source failed to visibly start
- a roughly 97-100 KB macro worked
- the successful embedded map was 1440x1080 WebP at a highly compressed quality level
- embedded image was verified before mutation by byte count, RIFF / WEBP header, SHA-256, upload rediscovery, stored-byte hash, and image dimensions

Copy / paste transport also matters:

- raw Markdown can be rendered in ways that alter copied source
- a fenced JavaScript-only Markdown preview worked more reliably
- plain `.txt` containing only exact JavaScript is a useful fallback
- no prose, headings, or Markdown syntax may be copied into a Foundry Script Macro

For future self-contained injectors, keep embedded artwork payloads compact enough for the macro editor while preserving acceptable VTT quality.

---

## 5. Prototype 5 engineering purpose

Prototype 5 should advance the Scene Injector architecture rather than merely repeat another puzzle.

**Primary new capability to validate: persistent Scene reconciliation.**

The existing v0.2 reconciliation engine is a development draft and must not be promoted to canonical production behavior until runtime-tested in Foundry 14.367.

Prototype 5 should exercise stable `objectKey` reconciliation using:

- `baselineHash`: fingerprint of the last persisted managed-field state
- `specHash`: fingerprint of the last desired MapSpec state
- `install.mode: "reconcile"`
- default `conflictPolicy: "preserve"`
- no automatic deletion of orphaned managed documents

Desired decision model:

- current unchanged + spec unchanged -> **PRESERVE**
- current unchanged + spec changed -> **UPDATE**
- current changed + spec unchanged -> **WARN / PRESERVE**
- current changed + spec changed -> **WARN / PRESERVE**
- desired managed object missing -> **CREATE**
- managed object removed from new MapSpec -> **WARN / PRESERVE as orphan**

Prototype 5 should produce meaningful CREATE / UPDATE / PRESERVE / WARN diagnostics and finish `READY_WITH_WARNINGS` when deliberate GM edits / orphans are intentionally preserved.

---

## 6. Prototype 5 creative direction

The user gave creative liberty over the encounter, map, and puzzle.

### Approved player-facing map

The user explicitly approved the following generated map for Prototype 5:

**Filename:** `BTR_Prototype5_Elemental_Confluence_Player_Map.png`  
**Dimensions:** 1448 x 1086  
**SHA-256:** `e6966308e02fc8b1dfccee609c155f4a27da24c48ca1950772d696354bc7bf44`

This file is included with this handoff.

Visual contents:

- strict top-down fantasy ruin / temple
- central blue arcane conduit / confluence
- four satellite elemental shrines:
  - **North:** blue Moon
  - **West:** green Leaf / Nature
  - **East:** gold Sun / Light
  - **South:** red Flame
- stone bridges connect the shrines to the central platform
- deep blue flooded / submerged areas surround the walkways
- waterfalls, pillars, rubble, moss, banners, torches
- no player-facing labels, legend, compass, puzzle text, or grid in the approved final player map

### Important Prototype 5 exception

This approved image was generated after the initial P5 MapSpec attempt and therefore did **not** originate cleanly from the same finalized geometry source.

The user explicitly instructed: **“this map is fine, use it.”**

For Prototype 5 only, treat this as a deliberate **approved-art / legacy-alignment exception**:

- keep the approved player map
- build / reconcile the final P5 MapSpec geometry to this approved asset
- clearly document this as an exception
- do not treat reverse-fitting BTR art as the normal workflow for future maps
- after Prototype 5, return to the normal MapSpec-first art pipeline

The earlier “Resonance Crucible” Stone / Bell / Crystal MapSpec and geometry guide are **superseded** for implementation and should not be used as the final P5 geometry.

---

## 7. Prototype 5 puzzle concept

Use the approved four-shrine artwork as the real playable wrapper around the reconciliation test.

Recommended encounter identity:

# Prototype 5 — The Elemental Confluence

The central conduit is dormant. Four elemental shrines around the flooded temple must be activated in sequence.

Recommended sequence:

**Nature / Leaf (West) -> Moon (North) -> Flame (South) -> Sun (East)**

Recommended central clue:

> “Life takes root beneath the darkened sky.  
> The moon draws the hidden tide.  
> Fire wakes what the waters carried.  
> At dawn, all paths return to light.”

This is a design recommendation, not previously runtime-confirmed canon. It may be refined while building P5.

Behavior requirements:

- central Region provides the clue
- first correct shrine activates the second
- second activates the third
- third activates the fourth
- fourth awakens the central Confluence
- entering a future shrine too early produces one `SEQUENCE BROKEN` feedback event and resets the puzzle
- solved shrines become inert
- apply the Prototype 4.6C non-reentrant invariant
- do not enable same-Region `TOKEN_ENTER` behaviors during an active `TOKEN_ENTER`
- puzzle success may simply awaken / unlock the central Confluence, because P5's primary new engineering target is reconciliation, not another teleport adapter

Optional final success effect:

- central Confluence feedback changes from dormant to awakened
- central Region can reveal a reward / lore message or enable an already-runtime-confirmed teleport
- do not introduce a new cross-Scene teleport adapter in P5 unless intentionally testing that separately

---

## 8. Prototype 5 reconciliation test plan

Prototype 5 should be a real playable Scene **and** a reconciliation test.

### Revision A — fresh install

Create:

- approved map asset
- one reused / configured default Level
- Walls matching the approved architecture
- circle Regions for:
  - central Confluence
  - West Nature
  - North Moon
  - South Flame
  - East Sun
  - any required landing / reward Region
- puzzle RegionBehaviors
- stable objectKeys
- baselineHash / specHash metadata
- READY after validation

### Simulated GM edits

Before Revision B, deliberately edit at least:

- one managed Wall coordinate
- one managed Region field such as name / color / position

Do not edit BTR baseline flags.

### Revision B — changed MapSpec

Change safe untouched managed content, for example:

- move / resize one untouched Region
- move one untouched Wall endpoint
- update one RegionBehavior feedback string
- add one new Wall
- add one new Region
- add one new RegionBehavior
- remove one old Wall / Region from the desired spec so it becomes an orphan

Expected reconciliation:

- untouched changed spec -> UPDATE
- manually changed object -> WARN / PRESERVE
- missing desired object -> CREATE
- unchanged object -> PRESERVE
- orphan -> WARN / PRESERVE
- no blind Scene deletion
- no deletion of GM edits
- Scene ends READY_WITH_WARNINGS when warnings are expected

---

## 9. Validation requirements

Before declaring P5 successful, verify:

### Asset

- approved image is deployed by the injector
- exact uploaded Foundry Data path is captured
- `foundry.utils.srcExists()` succeeds
- stored asset is readable
- dimensions match expected Scene dimensions
- embedded image transport, if used, is byte / hash verified before Scene mutation

### Scene / Level

- one managed Scene for the stable mapKey
- exactly one Level
- auto-created default Level reused
- initial Level set correctly
- background points to verified asset

### Geometry

- all desired Walls exist
- all desired Regions have positive area
- all managed Walls / Regions are Level-bound
- circle Regions remain the only production adapter unless a later prototype is explicitly testing a new shape type

### Behaviors

- all desired RegionBehaviors persist
- all embedded UUIDs resolve
- toggle target UUIDs resolve
- initial disabled / enabled states match MapSpec
- no unsafe same-Region TOKEN_ENTER enable edges exist

### Reconciliation

- stable objectKeys survive reruns
- safe changed objects UPDATE
- unchanged objects PRESERVE
- missing desired objects CREATE
- deliberate GM changes WARN / PRESERVE
- orphaned generated objects WARN / PRESERVE
- no blind deletion

### Final state

- clean install -> `READY`
- deliberate conflict / orphan reconciliation -> `READY_WITH_WARNINGS`
- failures -> `FAILED`
- console diagnostics clearly show action counts and reasons

---

## 10. Canonical files to continue from

Important existing sources:

- `/Beyond the Realms/Beyond_the_Realms_Campaign_Database_v3_Reconciliation.xlsx`
- `/Beyond the Realms/Foundry VTT Technical Knowledge/Beyond_the_Realms_FoundryVTT_Technical_Knowledge_Base_2026-08-26.md`
- `/Beyond the Realms/Injectors/README.md`
- `/Beyond the Realms/Injectors/MAPSPEC_SCHEMA_v0_1.md`
- `/Beyond the Realms/Injectors/BTR_Production_Scene_Injector_v0_1.js`
- `/Beyond the Realms/Injectors/BTR_Production_Scene_Injector_v0_2.js`
- `/Beyond the Realms/Injectors/BTR_Reconciliation_Engine_Test_v0_2.js`
- Prototype 4 injector / runtime notes
- Prototype 4.6C non-reentrant puzzle patch / runtime result
- this handoff
- `BTR_Prototype5_Elemental_Confluence_Player_Map.png`

---

## 11. Immediate next-chat task

Start the next chat with:

> We are continuing the Beyond the Realms Scene Injector prototype series. Read the canonical BTR Scene Injector files and the Prototype 5 handoff before generating code. Prototype 4.6C is runtime-confirmed and establishes the non-reentrant TOKEN_ENTER rule. Prototype 5 uses the approved Elemental Confluence player map included with the handoff and should validate persistent Scene reconciliation using stable objectKeys and CREATE / UPDATE / PRESERVE / WARN behavior while still being a real playable four-shrine puzzle. Do not redesign the workflow. Resume at final MapSpec alignment to the approved map, then build the complete self-contained Prototype 5 injector.

---

## 12. Status at handoff

**Runtime-confirmed**
- Prototype 3 injector architecture
- Prototype 4.6B full Scene installation path
- Prototype 4.6C non-reentrant puzzle-state fix
- native Toggle Behavior
- native Teleport Token
- ExecuteScript critical feedback
- default Level reuse
- Level-bound Walls / Regions
- dry-run / persist / validate / READY pipeline

**Approved for Prototype 5**
- player-facing Elemental Confluence map
- use of the approved map as a one-time art-first alignment exception
- P5 primary engineering target: persistent reconciliation

**Needs implementation / runtime validation**
- final P5 geometry aligned to approved map
- complete P5 MapSpec
- complete P5 self-contained injector
- P5 Revision A fresh install
- P5 simulated GM drift
- P5 Revision B reconciliation
- promotion or rejection of v0.2 reconciliation behavior based on live results
