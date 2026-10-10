# DiceBox Injector 2.0 — Prototype and Recovery Record (2026-10-09)

**Lifecycle status:** PROTOTYPE / READ-ONLY PREFLIGHT. Not production-certified.  
**Accepted scale rule:** DiceBox defaults to Gridless at 120 scene pixels per 5-foot logical space; token-art source targets remain unchanged.  
**Implementation:** `tools/dicebox-injector-v2-core.mjs`  
**Regression checks:** `tools/dicebox-injector-v2-self-test.mjs`  
**Workflow proposal:** `docs/DICEBOX-SCENE-INJECTOR-RECONCILIATION-PROPOSAL-2026-10-09.md`  
**Source research:** `docs/DICEBOX-GRID-TOKEN-RESOLUTION-RESEARCH-2026-10-09.md`  
**KB migration:** `database/seed.d/2026-10-09-injector-2-scale-preflight.sql`  
**Repository review:** Draft PR #7, `workflow/scene-injector-reconciliation-20261009`.

## Goal

Harden the existing DiceBox Scene Injector without losing the already-accepted single-macro BUILD v2 contract. A finished BUILD continues to contain **one Markdown file with exactly one self-contained executable user-run JavaScript macro**. Internal asset, Scene, default Level, Wall, AmbientLight, Region, RegionBehavior, route, readback and receipt phases must occur inside that one macro, not in separate GM-run macros.

Injector 2.0 adds deterministic and testable **PREPARE/BUILD preflight** before installation is attempted. The pure validator is not yet an installer and must never be represented as having installed Regions or verified player interaction.

## Already accepted scaling invariants

1. The physical width/height in feet are an explicit PREPARE decision; the source-art raster dimensions alone do not establish physical battlefield size.
2. Logical columns/rows are positive integers; `physical feet = logical cells × distance feet`.
3. Default Foundry scale is Gridless (`gridType=0`), `gridSize=120`, `distance=5`, `units="ft"`.
4. Final Scene size is `logicalColumns × gridSize` by `logicalRows × gridSize`.
5. Original art size, SHA-256, served Foundry path and final Scene size remain independently recorded. Raster upscaling does **not** add source detail.
6. A uniform coordinate transformation is applied to image-space wall, light, Region, arrival and other geometry anchors. Reject aspect-warping and implicit crop/offset.
7. Mechanical token footprint is owned by the D&D5e system/actor. Token artwork resolution and visual Scale (Ratio) cannot repair an incorrect grid size.
8. Nonstandard scale requires an explicitly approved PREPARE exception, reason and corresponding BUILD metadata. Changing an installed Scene's grid size alone is prohibited.
9. Existing GM-edited, foreign, depleted and other runtime-owned state is preserved; uncertain writes require an authoritative reread before retries.

## Pure prototype API

`previewInjector2(spec, observation)` returns a JSON-compatible preview with `status`, `blockers`, `warnings`, `scale`, `projection`, and `writes:0`.

- A `spec` must have a canonical semantic key, exact Scene name/folder, independently approved physical footprint, locked logical/grid dimensions, source-art identity, reconciled geometry authority, and explicit object inventories. An empty array means intentionally no objects; a missing inventory is invalid.
- `observation` may report the exact runtime profile, current elected active GM, served art/hash verification, candidate Scenes resolved by name or semantic key, and an existing Scene's background/geometry/scale. The prototype performs **no Foundry mutations**.
- Block on wrong world/GM/runtime, unknown physical size, unapproved grid exception, warped coordinate transform, unresolved required Region behavior, stale UUID binding, ambiguous Scene identity, foreign/changed Scene artwork, or unsafe existing-scale migration.
- `mapImagePointToScene(point, projection)` maps points using the preflight-certified uniform transform, but does not itself compile/install Walls or Regions.

**Prototype readiness semantics:** `READY` and `READY_WITH_WARNINGS` from this function mean **preflight-only**, not Foundry runtime success. `BLOCKED` means the installer must not write.

## Initial exact-stack canary (2026-10-09)

Read-only inspection of the connected Foundry world:

| Field | Observation |
|---|---|
| World | `the-forgotten-realms` |
| Foundry / system | 14.367 / dnd5e 5.3.3 |
| Logged-in inspection account | Assistant Gamemaster, GM permissions |
| Elected active GM | Gamemaster (different from the assistant account) |
| Scene | `M01 — The Forgotten Road`, unique exact-name and semantic-key match |
| Folder | `Beyond the Realms — Underdark Expedition` under `The Underdark` |
| Image | Approved M01 raster served and attached to the default Level |
| Scene canvas and grid | 1536 × 1024, Gridless, 64 px, 5 ft |
| Installed Walls / Lights / Regions | 0 / 0 / 0 |
| Live writes during test | **0** |

**Do not infer approval of a 24 × 16 / 120 × 80-foot battlefield from this installed 64px grid.** That footprint is a mathematical consequence of the current Scene configuration, not evidence of the intended PREPARE footprint. If 24 × 16 is approved, the standard 120px canvas would be 2880 × 1920 and image-coordinate geometry would be projected at 1.875×. Neither the migration nor the image resize has been authorized or performed here.

## Regression record

The first prototype self-test on 2026-10-09 returned:

```text
{"operation":"dicebox-injector-2.0.prototype-preflight-self-test","status":"PASS","cases":26,"sourceRaster":"1536x1024","candidateScale":"24x16 logical spaces => 2880x1920","liveWrites":0}
```

The existing BUILD v2 packaging validator's self-test returned:

```text
{"operation":"dicebox.injector-build-contract.self-test","status":"PASS","contract":"v2","cases":18}
```

Following a connection interruption, the above two test suites were rerun on 2026-10-09 and again returned PASS. The additive KB SQL delta was applied **only to a memory-backed copy of the local database**, with `PRAGMA integrity_check=ok`, no foreign-key failures, and all six expected source/decision/fact/open-item records present. **That does not equal a full clean canonical database rebuild from the GitHub seed sources.**

## Known blockers / certification work

- Resolve **M01's approved physical footprint** before any 120px conversion or geometric injection.
- Reconcile current vs intended Scene scale and explicit source-to-target transform. Test doorway, corridor and excavation access with actual token footprints.
- Obtain and validate the Regionwright-specific mining/hunting adapters, permissions, shapes and state-preserving behavior configuration. A named Region is not a functioning mechanic.
- Build the **complete** single-Markdown/single-JavaScript macro from approved MapSpec + Feature Manifest + art, including Level, wall overlay, lights, Regions, RegionBehaviors, transitions and local readback.
- Test an installation and a repeat installation in an isolated Foundry v14.367/dnd5e 5.3.3 fixture. Verify interruption recovery, preservation of GM/player state, asset hashes, default-Level bindings, RegionBehavior state, and exact receipt identity. No production live injection until this fixture demonstrates the critical gates.
- Resolve route destinations by unambiguous semantic key/exact name at runtime, then use the actual found document ID/UUID as a binding. Do not hardcode a previous scene's random runtime UUID as new authority.
- Keep the work in draft review until the source migration, fixture receipts and workflow updates are accepted/reconciled.

## Connection recovery procedure

1. Read the current GitHub PR #7 and its changed files; verify the core module, 26-test suite, research, KB delta and this document exist on the same branch.
2. Rerun the pure prototype self-test and the canonical BUILD validator self-test.
3. Query the KB authority, distinguish staged SQL from merged/rebuilt authority, and check interrupted writes without replay.
4. Perform a **read-only** Foundry preflight to compare exact world, elected GM, Scene/Level background, scale and component counts with the previous receipt.
5. If any operation's outcome is ambiguous, mark it `OUTCOME_UNKNOWN`; do not retry installation until authoritative reread proves safe.
6. Resume from the smallest missing gate, not from the beginning. Do not create separate repair macros that bypass the one-macro contract.

**Scope note:** The acceptance on 2026-10-09 locked the scaling/preflight rule and authorized building a prototype. It did **not** approve a specific M01 physical footprint, an M01 live migration, or production promotion of Injector 2.0.
