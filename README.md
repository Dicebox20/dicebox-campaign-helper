> **Owner-selected product roadmap (2026-11-12):** [DCH Roadmap v2 — Executive Summary](docs/DCH-ROADMAP-v2-LIBRARY-CANONICAL.md) controls product priority: **M0 ChatGPT Bootstrap**, then M1 Conversational Desktop, M2 Diagnostics & Repair, M3 Modular Templates, M4 Complete Campaign Compiler, M5 Shared Knowledge. Earlier Stage 0–16 plans remain historical engineering evidence; Stage 12 is not current product priority.

# DiceBox Campaign Helper

Canonical source repository for Dicebox Campaign Helper: the AI-native TTRPG campaign workspace, Foundry VTT control/deployment system, campaign knowledge layer, scene/asset tooling, and associated server/runtime components.

The current product architecture and ordered implementation roadmap are [Campaign Helper Architecture Decision Report](docs/CAMPAIGN-HELPER-ARCHITECTURE-DECISION-REPORT-2026-08-23.md) and [DiceBox Campaign Helper Program Roadmap](docs/DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md). The active machine-enforced gate is [ACTIVE-PROGRAM-SLICE.json](docs/ACTIVE-PROGRAM-SLICE.json). Campaign-specific Tram work is parked with its evidence preserved while the program-first authoring spine is built.

This GitHub repository is the authoritative project source. `PROJECT_CHARTER.md`, `FOUNDATION_PLAN.md`, `GAP_RESEARCH.md`, `STATUS.md`, the reproducible SQLite knowledge base under `database/`, and the current roadmap/control documents are maintained here. Local checkouts and cloud workspaces are disposable working copies and do not outrank the repository. The October 1 unification decision is recorded in `docs/DICEBOX-CAMPAIGN-HELPER-UNIFICATION-2026-10-01.md`.

The project mission and the single-Foreman/bounded-Worker rules for all primary and isolated tasks are documented in [PROJECT-MISSION-AND-ORCHESTRATION.md](docs/PROJECT-MISSION-AND-ORCHESTRATION.md). The knowledge base record for this governance change is `SRC-M142-DICEBOX-MISSION-FOREMAN-WORKER`.

Historical milestone descriptions below are preserved where useful, but current work selection is governed by the roadmap, active program slice, and October 1 unification record. Do not infer current capability or authority from an older milestone paragraph alone.

All future Foundry-facing development is constrained by the [Foundry API Binding Matrix](docs/FOUNDRY-API-BINDING-MATRIX-2026-08-21.md); semantic compiler contracts are not substitutes for official Foundry document, collection, lifecycle, user, Scene, Region, Activity, or ActiveEffect APIs.

## Packages

- `packages/dicebox-core` — canonical IDs, versions, capabilities, results, receipts, schemas, and knowledge-base source metadata.
- `packages/dicebox-compiler` — runtime-neutral semantic plan types, validation, and the deterministic M9 release/bootstrap manifest compiler.
- `packages/dicebox-bridge` — readiness-gated, read-only bridge facade.
- `packages/dicebox-foundry` — Foundry manifest, read-only runtime probe, and diagnostics bridge shell.

The current gate is the subscription-backed AI provider spine: Codex App Server managed ChatGPT authentication is primary, while the existing OS-secured OpenAI API-key route remains an explicit, separately billed backup. The exact Foundry fixture vertical slice has passed as fixture evidence, but does not certify general desktop Foundry control or any campaign world. See the active machine-enforced slice and roadmap before selecting work.

Before a live run, perform the read-only fixture preflight with an explicit Foundry application root. Foundry stores packages and worlds below its `Data/` directory:

```powershell
$env:DICEBOX_FOUNDRY_DATA_PATH = "C:/path/to/disposable/FoundryVTT"
$env:DICEBOX_FOUNDRY_WORLD_ID = "dbx-test-world"
npm run foundry:preflight
```

The preflight reads `world.json`, `system.json`, and installed module manifests only. It does not launch Foundry or mutate a world.

To stage the reviewed module into an explicitly disposable Foundry data path:

```powershell
$env:DICEBOX_FOUNDRY_STAGE_PATH = "C:/path/to/disposable/FoundryVTT/Data"
npm run foundry:stage
```

Staging refuses to overwrite an existing `modules/dicebox-campaign-helper` directory and copies only `module.json` and `src/module.js`.

Before starting a disposable Node-hosted Foundry server, run the fail-closed launch guard. It rejects the normal local Foundry data path, verifies the requested `world.json`, and only constructs launch arguments; execution is opt-in with `DICEBOX_FOUNDRY_LAUNCH_EXECUTE=1`.

```powershell
$env:DICEBOX_FOUNDRY_DATA_PATH = "C:/path/to/disposable/FoundryVTT"
$env:DICEBOX_FOUNDRY_WORLD_ID = "dbx-test-world"
$env:DICEBOX_FOUNDRY_NODE_ENTRY = "C:/path/to/foundry/resources/app/main.mjs"
$env:DICEBOX_FOUNDRY_PORT = "3011"
npm run foundry:launch-guard
```

The guard is a launch boundary, not a module or live-runtime certification. See [foundry-smoke-14.365-static-receipt.json](outputs/foundry-smoke-14.365-static-receipt.json) for the blocked local smoke result.

## Development

```powershell
npm install
npm run check
```

The SQLite knowledge base is a read-only development source. Rebuild or verify it with:

```powershell
python database\build_database.py
python database\verify_database.py
```

Use the fixed, provenance-preserving query service without opening a write-capable SQLite connection:

```powershell
npm run kb:query -- --kind summary
npm run kb:query -- --kind facts --term "Activity Foundry"
npm run kb:query -- --kind coverage --limit 100
```

The service does not accept SQL, and live KB editing remains a separately gated capability.

The M9 release compiler is available as `createReleaseBundle`/`previewReleaseBundle` from `@dicebox/compiler`. Its `createReleaseDiffPlan`/`previewReleaseDiff` companion accepts only redacted runtime observations, preserves foreign/unknown state, and has no cleanup/delete path. The M10 `createSyncConflictPlan`/`previewSyncConflictPlan` layer compares declared managed-field fingerprints and emits only disabled native update candidates. The M11 `createReadinessCertificate` compositor requires all six evidence lanes and exact `foundry-exact` proof before it can ever return `ready`; M13 exposes the same blocked certificate through the program bridge and Foundry `readiness-certificate` queries; M14 validates browser/exact-runtime receipts before they reach that compositor; M15 adds `createStateStoreSelectionPlan` and a read-only `state-store-plan` query that separates program semantic truth from native Foundry runtime state and gates settings/flags/JournalEntry persistence on exact evidence; M16 adds the versioned append-only program StateStore with replay, idempotency, corruption boundaries, and migration preview; M17 adds `createFixedOperationStdioServer` for bounded local test orchestration with no network or mutation authority; M18 adds the runnable `bridge:stdio` safe-mode host and process-level protocol tests; M19 adds `createStdioTransportReceipt` and the `bridge:stdio:receipt` collector for redacted, target-bound process evidence; M20 adds the canonical `FoundryRuntimeEvidenceSchema`, non-certifying audit, and corrected module/program profile handoff; M21 adds `createFoundryFixturePlan` and `foundry:fixture-plan` for the blocked exact-target test handoff; M22 adds the fixed read-only `fixture-observation` query and `foundry:fixture-observation-audit` for redacted Journal/Activity/Region reads and authoritative rereads; M23 adds `createFixtureObservationBundle` and `foundry:fixture-observation-bundle-audit` to normalize those receipts into the existing harness/certificate path while keeping exact-runtime blocked; M24 adds `FoundryFixtureRoundEvidenceSchema` and `foundry:fixture-round-audit` to verify first-round Foundry API and artifact coverage without certifying it. All slices emit only reviewed Foundry API bindings and keep mutation disabled. See [m24-foundry-fixture-round-evidence-static-receipt.json](outputs/m24-foundry-fixture-round-evidence-static-receipt.json).
