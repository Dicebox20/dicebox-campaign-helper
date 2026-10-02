# Beyond the Realms - Codex Repository Instructions

These instructions apply to all work in this repository.

## Purpose

This repository is the shared engineering source of truth between the Beyond the Realms ChatGPT project and Codex. Preserve runtime evidence, project rules, failed approaches, and successful implementation patterns across sessions.

## Mandatory bootstrap for map / Scene Injector work

Before modifying or generating any Beyond the Realms battlemap, Foundry Scene Injector, Region puzzle, MapSpec, Scene geometry, lighting adapter, or map revision:

1. Read `knowledge/CURRENT_STATE.md`.
2. Read `knowledge/STATUS_MODEL.md`.
3. Read `knowledge/WORKFLOW.md`.
4. Read `knowledge/RUNTIME_RESULTS.md`.
5. Read `knowledge/FAILURES_AND_LESSONS.md`.
6. Read `reference/BTR_PROJECT_RULES_MAP_INJECTOR.md`.
7. Read `reference/INJECTORS_README.md`.
8. Read the latest `reference/MAPSPEC_SCHEMA_*.md`.
9. Read any prototype/location-specific source relevant to the requested work.
10. For version-sensitive Foundry behavior, consult `reference/Beyond_the_Realms_FoundryVTT_Technical_Knowledge_Base_2026-08-26.md` and inspect the installed runtime when possible.

Do not rely on prior chat memory when these files are available.

## Evidence and status discipline

Never collapse these states:

- `RUNTIME_CONFIRMED`: observed working in the user's target Foundry runtime.
- `PACKAGE_READY`: built and statically validated, but not yet confirmed live.
- `PENDING_RUNTIME_TEST`: requires live Foundry validation.
- `EXPERIMENTAL`: adapter/design not yet promoted to the canonical schema.
- `FAILED_SUPERSEDED`: known failed approach with a documented replacement.

A static test, mock, schema validation, or successful install is not evidence that the complete live feature is runtime-confirmed.

Newer direct runtime evidence supersedes an older handoff that still says "pending."

## Source precedence

When sources conflict, use this order:

1. Current explicit user instruction.
2. Newer direct Foundry runtime evidence/logs.
3. Locked BTR project rules.
4. Newer workflow state, artifact manifest, runtime addendum, or handoff.
5. Current technical knowledge base.
6. Older prototype notes.
7. Assumptions or conversational recollection.

Do not silently overwrite a higher-authority rule.

## Locked engineering rules

- Target reference environment: Foundry VTT 14.367 Stable, D&D5e 5.3.3.
- MapSpec is geometry authority for BTR-generated maps.
- Do not generate art first and reverse-fit geometry, except a documented approved-art/legacy exception.
- Reuse Foundry's auto-created default Level. Do not create a duplicate Level without a specific validated reason.
- Explicitly Level-bind Walls and Regions.
- Preallocate stable IDs/objectKeys.
- Validate geometry and objectKey uniqueness before mutation.
- Generate and compile all dynamic RegionBehavior JavaScript before destructive or persistent Scene mutation.
- Dry-run candidate Walls, Regions+behaviors, Lights, and other new adapters before persistence.
- Verify generated/embedded asset bytes, hash, dimensions, upload path, and retrievability before Scene mutation.
- Mark a Scene `READY` only after post-install validation succeeds.
- Critical Region feedback should use runtime-confirmed ExecuteScript patterns, not the failed DisplayScrollingText behavior path.
- For `TOKEN_ENTER`, never enable another `TOKEN_ENTER` behavior on the same Region during the active event. Solved steps should become inert when appropriate.
- Shared Scene puzzle state is mechanical authority. Visual mirrors such as AmbientLights are presentation only.
- Do not blindly delete persistent GM edits or orphaned managed objects.
- Do not promote experimental adapters into the canonical MapSpec schema until live runtime validation passes.

## AI map workflow

Keep engineering mechanics and player-map rendering isolated.

For high-detail AI art, use the current checkpointed `prepare -> render -> build` workflow. The render prompt may receive only the player-facing render brief and clean visual layout reference. Never send puzzle solutions, state logic, GM notes, Region behavior code, validation metadata, or hidden clue logic to image generation.

## Change protocol

After meaningful runtime testing or a design decision:

1. Update `knowledge/CURRENT_STATE.md`.
2. Append evidence to `knowledge/RUNTIME_RESULTS.md`.
3. Record failures and replacement rules in `knowledge/FAILURES_AND_LESSONS.md`.
4. Update `knowledge/CANONICAL_SOURCES.md` if source authority changes.
5. Update `BRIDGE_MANIFEST.json` or regenerate it with `scripts/verify_bridge.py` if reference snapshots change.
6. Clearly mark whether each conclusion is runtime-confirmed, package-ready, experimental, or superseded.

Do not erase failed experiments. Preserve them as negative knowledge so future agents do not repeat them.

## Coding posture

Prefer public Foundry APIs, configured DataModels/Documents, exact UUID/ID resolution, preflight validation, dry-runs, explicit error reporting, and re-reading persisted state. Keep native Foundry/D&D5e mechanics authoritative before optional modules or custom code.

When changing an existing implementation, make the smallest change consistent with the current architecture. Do not redesign the pipeline unless the user explicitly requests it or runtime evidence proves the current design invalid.
