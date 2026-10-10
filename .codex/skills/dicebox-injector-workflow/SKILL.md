---
name: dicebox-injector-workflow
description: Use for DiceBox Campaign Helper scene/map workflow commands PREPARE, RENDER, INSPECT, APPROVE, or BUILD, especially Foundry VTT Scene Injector deliverables. Enforces the canonical single-Markdown/single-injection-macro BUILD contract and fail-closed recovery instead of improvised packaging.
---

# DiceBox Injector Workflow

Treat the named workflow commands as API operations, not ordinary-language suggestions:

`PREPARE -> RENDER -> INSPECT(PASS = APPROVED | REDO) -> BUILD`

Do not silently substitute another pipeline.

## Mandatory source checks

For Foundry Scene Injector work, read the current scene specification plus:

- `beyond-the-realms-bridge/reference/BTR_Prototype5_Scene_Injector_Handoff_2026-09-21.md`, especially sections 2 and 4;
- `references/scene-injector-contract.md` in this skill;
- `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md`;
- any newer accepted Injector workflow source explicitly identified by the project contract.

If those sources conflict, stop and reconcile. If the canonical workflow cannot be loaded, stop as BLOCKED rather than inventing a replacement format.

## Operation meanings

## Durable automation overlay

For resumable work, also apply `docs/DICEBOX-AUTOMATED-SCENE-WORKFLOW-2026-10-05.md`.

The creative API is:

`PREPARE -> RENDER -> INSPECT(PASS = APPROVED | REDO) -> BUILD`

A successful INSPECT is the approval event. Do not wait for a second user command after PASS.

After BUILD, automation may continue:

`BUILD -> STAGE -> INJECT -> VERIFY -> RECEIPT`

Hard automation rules:

- Desktop Commander is the durable workspace/state/file orchestrator, not Foundry authority.
- PowerShell Relay commands use stable idempotency request IDs for retries.
- Regionwright/Foundry is the only live Scene/Wall/Region/RegionBehavior mutation authority.
- Persist and validate one `state.json` per Scene using `dicebox-scene-automation-state/v1`.
- `INSPECT: PASS` atomically writes inspection evidence plus matching approval evidence and moves the current state directly to `APPROVED`; `INSPECTED_PASS` is not a durable wait-state.
- On resume, reread durable state and the latest receipt before selecting the next gate.
- REDO archives the failed prompt and increments the render attempt; it never patches the old prompt.
- BUILD must bind to the exact approved render identity and pass `validate-dicebox-build.mjs` before STAGE.
- Timeout or interrupted transport is outcome-unknown; poll/read the receipt before retrying.
- COMPLETE requires a Foundry/Regionwright receipt whose build SHA-256 matches the staged BUILD.
- If Desktop Commander or PowerShell Relay is unavailable, PREPARE/RENDER/INSPECT (with automatic approval on PASS)/BUILD may continue, but do not claim STAGE/INJECT/VERIFY completion.


- **PREPARE**: produce/specify the scene package, topology, clue/encounter intent, injection fields, art prompt, and acceptance criteria. Do not generate final art unless requested.
- **RENDER**: perform the current two-pass creative render process: grayscale 3D structural render, mandatory structural inspection/Feature Manifest reconciliation, then painterly live render. Preserve both render identities and prompt snapshots.
- **INSPECT**: inspection is mandatory both before coloring and after painting. Structural PASS only authorizes the paint pass. FINAL_INSPECT compares the painterly render against PREPARE + approved structural render + reconciled Feature Manifest/Spatial Blueprint; only FINAL_INSPECT `PASS` automatically records approval and moves state to `APPROVED`.
- **APPROVE**: optional redundant explicit acknowledgment of an already-passed render. It is not a required gate between PASS and BUILD.
- **BUILD**: compile the approved scene into the canonical Foundry Scene Injector handoff artifact described below.

## Tactical-map camera guardrail

For player-facing tactical or battle-map artwork:
- use a strict 90-degree overhead orthographic projection;
- the camera is perpendicular to the ground plane;
- do not use the words `isometric`, `top-down/isometric`, `bird's-eye`, `three-quarter`, `angled overhead`, or `cinematic aerial` in RENDER prompts;
- do not let aesthetic language such as `cinematic` imply a tilted camera;
- explicitly request no perspective tilt and no horizon;
- the grayscale structural pass should look like a clean 3D/Blender graybox from directly above, using wall-top thickness, bevels, object height, material relief, ambient occlusion, and contact shadows for depth without camera tilt;
- INSPECT must fail visible perspective/isometric drift even if topology and mood otherwise pass.

Canonical camera clause:

`strict 90-degree overhead orthographic battlemap, camera perpendicular to the ground plane, no perspective tilt, no horizon`

This preserves the strict top-down/orthographic requirement while allowing the current 3D-modeled structural style.

## REDO prompt reset

When INSPECT returns REDO for generated map art:
- discard the failed stage prompt;
- structural REDO: write a fresh prompt from PREPARE and locked structural requirements;
- paint-only REDO: write a fresh prompt from the approved structural render plus reconciled Feature Manifest/Spatial Blueprint;
- if final inspection exposes a real structural defect, return to structural correction and invalidate downstream painterly approval;
- never patch the failed prompt with corrective clauses;
- never reference the failed composition as something to preserve;
- treat repeated prompt revision as a regression risk because it can reinforce unwanted geometry or visual drift.

REDO is a fresh stage specification, not an edit instruction.

## Locked BUILD contract

A successful Scene Injector BUILD has exactly one user-facing deliverable:

1. exactly one `.md` file;
2. exactly one fenced JavaScript code block in that file;
3. that one code block is one self-contained executable injection macro;
4. no ZIP package, loose folder, second JavaScript file, multi-macro sequence, or “run part 2” step;
5. large embedded artwork may be compressed and split into internal string chunks, but all chunks live inside the same macro and are reassembled/decoded by that macro at runtime;
6. if the payload is too large, reduce/convert the embedded image or otherwise repair the single-macro transport—never split the workflow into multiple user-run macros;
7. the macro preserves current DiceBox safety rules: exact target/current active GM checks where applicable, no `eval`, no `new Function`, no raw WebSocket execution path, preview/validation, authoritative reread, and blocker-based result reporting;
8. the scene's approved art and specification remain the creative authority for that BUILD. BUILD must not silently regenerate or replace them.

Every BUILD macro must include these comments near the top:

```text
// DICEBOX_BUILD_CONTRACT: dicebox-scene-injector-build/v2
// DICEBOX_SINGLE_MACRO: true
// DICEBOX_SCENE_ID: <stable scene id>
// DICEBOX_ART_MODE: embedded-webp | embedded-png | verified-path
// DICEBOX_WORKFLOW: PREPARE -> RENDER -> INSPECT(PASS=APPROVED) -> BUILD
// DICEBOX_SCALE_PROFILE: battlemap-120
// DICEBOX_GRID_TYPE: gridless
// DICEBOX_GRID_SIZE: 120
// DICEBOX_GRID_DISTANCE: 5
// DICEBOX_GRID_UNITS: ft
// DICEBOX_LOGICAL_SIZE: <columns>x<rows>
// DICEBOX_SCENE_PIXELS: <width>x<height>
// DICEBOX_TOKEN_FOOTPRINT_POLICY: system-size
// DICEBOX_TOKEN_ART_SCALE_POLICY: visual-only
```

Prefer `embedded-webp` for large map art when compression is needed. The BTR prototype history established that compact WebP embedding plus byte/hash/path verification is more reliable than very large raw macro sources.

## Spatial scale and token sizing

Read and apply `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md`.

Default generated battle-map profile:

- Foundry Scene grid type: Gridless (`0`);
- logical grid size: 120px;
- logical distance: 5 ft;
- Scene pixel width = logical columns × 120;
- Scene pixel height = logical rows × 120;
- padding: 0 unless PREPARE explicitly requires off-map staging space.

PREPARE must state the logical map dimensions. BUILD must not infer a different gameplay scale from the rendered image dimensions.

For the current 3:2 forest-maze family, the default logical footprint is 36×24 five-foot spaces, which yields a 4320×2880 Scene under `battlemap-120`.

Token footprint and token artwork scale are separate:

- mechanical footprint remains Actor/system-size-owned; for D&D5e prefer the system's Sync Token Size behavior;
- Token Scale Ratio is visual-only and must never be used to repair map scale;
- DiceBox overhead art targets are 256px Tiny, 512px Small/Medium, 1024px Large/Huge, and 2048px Gargantuan.

Every new BUILD macro must include these additional markers:

```text
// DICEBOX_SCALE_PROFILE: battlemap-120
// DICEBOX_GRID_TYPE: gridless
// DICEBOX_GRID_SIZE: 120
// DICEBOX_GRID_DISTANCE: 5
// DICEBOX_GRID_UNITS: ft
// DICEBOX_LOGICAL_SIZE: <columns>x<rows>
// DICEBOX_SCENE_PIXELS: <width>x<height>
// DICEBOX_TOKEN_FOOTPRINT_POLICY: system-size
// DICEBOX_TOKEN_ART_SCALE_POLICY: visual-only
```

It must also define one scale source of truth:

```javascript
const DICEBOX_SCENE_SCALE = Object.freeze({
  gridType: 0,
  gridSize: 120,
  distance: 5,
  units: "ft",
  logicalColumns: <columns>,
  logicalRows: <rows>,
  width: <columns * 120>,
  height: <rows * 120>
});
```

Scene width, height, and grid fields must reference that constant rather than repeat literal scale values.

A nonstandard scale is allowed only when PREPARE explicitly records a user-approved exception. Use `DICEBOX_SCALE_PROFILE: explicit-exception`, `DICEBOX_SCALE_EXCEPTION_APPROVED: true`, and a meaningful `DICEBOX_SCALE_EXCEPTION` reason. Silent scale drift is a BUILD failure.

L1-01 through L1-03 are legacy v1 scale artifacts. Preserve their runtime evidence, but do not use their 50px grid size as a template for future maps.

## Exploration discovery regions

Read and apply `docs/DICEBOX-EXPLORATION-DISCOVERY-STANDARD-2026-10-05.md`.

Discovery is a three-stage system:

`NOTICE -> INTERPRET / SEARCH -> RECOVER`

Hard rules:

- ordinary maps default to 0–1 discovery and hard-cap at 2 unless the user explicitly approves a discovery-dense special-scene exception;
- every discovery must be tied to a visible or environmentally plausible renderer feature;
- placement is intentionally forgiving: the clue feature and Region only need a sensible nearby relationship, not pixel-perfect alignment;
- Stage 1 is exactly `1d20` with no character-sheet modifiers and must not call the actor's normal Perception skill roll;
- rarity base DCs are Common 6, Uncommon 8, Rare 12, Very Rare 14, Legendary 16, with the accepted within-rarity value adjustment of -1 / +0 / +1 / +2;
- Stage 1 failure is silent;
- each character receives one automatic Notice roll per discovery until explicit reset; re-entering the Region cannot farm rerolls;
- Stage 1 success records per-character Notice state and privately reveals an environmental hint plus the authored Stage 2 skill where practical;
- Stage 1 and Stage 2 never award the item;
- Stage 2 uses the authored skill appropriate to the clue, normally Investigation, Nature, Survival, Arcana, History, Religion, or Medicine; Perception is not reused;
- Stage 3 handles physical recovery separately and models the physical task, not item rarity;
- the locked fossil example is Nature to identify, then Sleight of Hand + Strength to extract carefully;
- do not invent a large Stage 3 recovery roster before those profiles are reviewed and accepted.

Every new BUILD v2 macro must include:

```text
// DICEBOX_DISCOVERY_CONTRACT: dicebox-discovery/v1
// DICEBOX_DISCOVERY_COUNT: <0|1|2|...>
// DICEBOX_DISCOVERY_DENSITY: ordinary | special
// DICEBOX_DISCOVERY_VISIBLE_ANCHORS: true
// DICEBOX_DISCOVERY_NOTICE_POLICY: flat-d20-no-modifiers
// DICEBOX_DISCOVERY_NOTICE_STATE: per-character-once-until-reset
```

If `DICEBOX_DISCOVERY_DENSITY: special` is used, the macro must also include:

```text
// DICEBOX_DISCOVERY_DENSITY_APPROVED: true
// DICEBOX_DISCOVERY_DENSITY_REASON: <meaningful user-approved reason>
```

An ordinary scene with more than two discoveries is invalid. A special scene with more than two discoveries is invalid unless the approval marker and reason are present.

User-confirmed micro-hints are authoritative when the detail is too small or blended for reliable automated visual inspection. Do not fail or rerender an otherwise valid map merely because the assistant cannot confidently resolve a tiny clue that the user has identified. Record the user's confirmation and place the Discovery Region in a sensible nearby area rather than demanding pixel-perfect localization.

INSPECT must confirm each planned discovery has a plausible visible anchor. BUILD must preserve that relationship rather than adding unsupported or arbitrary discovery Regions.


## Pre-delivery validation

Before presenting or publishing a BUILD artifact, run:

`node tools/validate-dicebox-build.mjs <artifact.md>`

A FAIL result blocks delivery. Do not describe a failed artifact as BUILT.

The deterministic validator is intentionally narrower than runtime certification. Passing it proves only the packaging contract; it does not prove Foundry installation or gameplay.

## Regression rule

The 2026-10-05 ZIP packaging incident is a permanent regression case. Any future BUILD that produces a ZIP, more than one macro, a non-Markdown primary artifact, or a manual sequence of macro parts is a workflow failure and must be corrected before delivery.


## DiceBox Injector 2.0 prototype (accepted scale preflight, not yet production-certified)

Read `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md` including the 2026-10-09 hardening, and `docs/DICEBOX-INJECTOR-2.0-PROTOTYPE-2026-10-09.md`.

Before BUILD, verify independently approved **physical feet, integer logical cells, original source-raster dimensions, final Scene dimensions, and uniform coordinates**. Art dimensions alone cannot imply game-world size. Run the read-only pure preflight and treat `BLOCKED` as a hard stop. Do not silently change an installed Scene's grid value or resize the raster without adjusting/validating all geometry.

The prototype's validator and self-tests supplement `tools/validate-dicebox-build.mjs`; they do not replace the **exactly one Markdown + one self-contained executable macro** contract or prove real Regionwright mechanic installation. M01 is the first read-only canary. Promote live installation behavior only after an isolated runtime fixture, authoritative readback, and verified recovery from interrupted writes.

Preserve the existing internal injection sequence, level binding, GM authority, Foundry document APIs, name/semantic-key resolution, state preservation and receipt requirements.
