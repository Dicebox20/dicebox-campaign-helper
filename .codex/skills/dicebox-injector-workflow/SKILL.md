---
name: dicebox-injector-workflow
description: Use for DiceBox Campaign Helper scene/map workflow commands PREPARE, RENDER, INSPECT, APPROVE, or BUILD, especially Foundry VTT Scene Injector deliverables. Enforces the canonical single-Markdown/single-injection-macro BUILD contract and fail-closed recovery instead of improvised packaging.
---

# DiceBox Injector Workflow

Treat the named workflow commands as API operations, not ordinary-language suggestions:

`PREPARE -> RENDER -> INSPECT -> APPROVE -> BUILD`

Do not silently substitute another pipeline.

## Mandatory source checks

For Foundry Scene Injector work, read the current scene specification plus:

- `beyond-the-realms-bridge/reference/BTR_Prototype5_Scene_Injector_Handoff_2026-09-21.md`, especially sections 2 and 4;
- `references/scene-injector-contract.md` in this skill;
- any newer accepted Injector workflow source explicitly identified by the project contract.

If those sources conflict, stop and reconcile. If the canonical workflow cannot be loaded, stop as BLOCKED rather than inventing a replacement format.

## Operation meanings

- **PREPARE**: produce/specify the scene package, topology, clue/encounter intent, injection fields, art prompt, and acceptance criteria. Do not generate final art unless requested.
- **RENDER**: generate the candidate map art from the approved preparation package.
- **INSPECT**: compare rendered art against the prepared acceptance criteria and call out deviations.
- **APPROVE**: record the user's accepted art/spec state. Approval does not itself create Foundry content.
- **BUILD**: compile the approved scene into the canonical Foundry Scene Injector handoff artifact described below.

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
// DICEBOX_BUILD_CONTRACT: dicebox-scene-injector-build/v1
// DICEBOX_SINGLE_MACRO: true
// DICEBOX_SCENE_ID: <stable scene id>
// DICEBOX_ART_MODE: embedded-webp | embedded-png | verified-path
// DICEBOX_WORKFLOW: PREPARE -> RENDER -> INSPECT -> APPROVE -> BUILD
```

Prefer `embedded-webp` for large map art when compression is needed. The BTR prototype history established that compact WebP embedding plus byte/hash/path verification is more reliable than very large raw macro sources.

## Pre-delivery validation

Before presenting or publishing a BUILD artifact, run:

`node tools/validate-dicebox-build.mjs <artifact.md>`

A FAIL result blocks delivery. Do not describe a failed artifact as BUILT.

The deterministic validator is intentionally narrower than runtime certification. Passing it proves only the packaging contract; it does not prove Foundry installation or gameplay.

## Regression rule

The 2026-10-05 ZIP packaging incident is a permanent regression case. Any future BUILD that produces a ZIP, more than one macro, a non-Markdown primary artifact, or a manual sequence of macro parts is a workflow failure and must be corrected before delivery.
