# DiceBox Campaign Helper Creation Plan

## Phase 0 — project setup and M0

Create a repository rooted around four boundaries:

```text
dicebox-core/       semantic IDs, schemas, results, provenance, state
dicebox-compiler/   intent normalization, capability selection, build plans
dicebox-bridge/     semantic public API and runtime-neutral commands/queries
dicebox-foundry/    Foundry module, adapters, authority, documents, UI
```

The first commit should include TypeScript/ESM configuration, schema validation, result/error envelopes, version constants, ADR template, the SQLite KB builder, and tests proving that names and UUIDs are not semantic identity.

## Phase 1 — M1/M2 runtime spine

Build `RuntimeProfile`, `CapabilityRegistry`, and the Foundry module shell. The module manifest must use the package ID `dicebox-campaign-helper`, load ES modules, declare Foundry compatibility, and expose a readiness-gated semantic API:

```ts
api.describe()
api.supports(capabilityId)
api.execute(runtimeCommand)
api.query(runtimeQuery)
api.resolve(caReference)
api.health()
```

Foundry binding: schedule observation from `Hooks.once("ready")` and inspect `game.version`, `game.system`, `game.modules`, `CONFIG`, `CONST`, `game.users`, and read-only document collections. The exit evidence is a frozen runtime profile, capability snapshot, fingerprint, no-write receipt, and blocker-based `readiness-report`; API presence is not behavior or permission certification, and the report never enables mutation.

The first module command/query is read-only. The module must load cleanly before any world mutation is attempted.

## Phase 2 — M3 identity and document slice

Implement canonical IDs, runtime bindings, settings ownership, a tiny DocumentCreationPlan, validation, idempotency, read-back, and receipts through the official Foundry Document and collection APIs named in the [Foundry API Binding Matrix](docs/FOUNDRY-API-BINDING-MATRIX-2026-08-21.md). Start with one native JournalEntry slice before expanding to Folder, Actor, Item, or Scene. Never expose raw document patching through the public API.

## Phase 3 — M4/M5 links and media

Add exact UUID resolution, source/compendium identity, strict semantic link plans, two-pass link creation, stale-link diagnostics, approved asset hashes, variants, and reference scanning. Add clean-world import tests before any production-world migration.

Foundry binding: resolve through `fromUuid(uuid)`, `Document.uuid`, and reviewed collection `get`/`getName` surfaces; use `game.packs.get`, `pack.index.get/getName`, and `pack.getIndex` for exact compendium reuse. The resolver/index adapters return verified identity metadata only and do not pass raw Documents or raw index entries to the compiler. Use `FilePicker` or other official file/config read surfaces only when observed in the exact runtime. Link closure, asset provenance, and deployment bindings require authoritative rereads; fuzzy names and unverified file paths remain diagnostics only.

## Phase 4 — M6 spatial slice

Implement a small SpatialBlueprint for one room. Freeze dimensions, origin, scale, Levels, wall centerlines, Regions, door anchors, and interaction clearances before generating or importing artwork. Compile a deterministic graybox first. Verify topology, reachability, player movement, visibility, and reset.

Foundry binding: first observe through `fromUuid`, `game.scenes.get`, `Scene.dimensions`, `Scene.grid`, and the Scene embedded collections. Compile a review-first create-only projection plan that names `Scene.create`, `scene.createEmbeddedDocuments("Wall", ...)`, `scene.createEmbeddedDocuments("Region", ...)`, `RegionDocument`, `RegionDocument.shapes`, `RegionDocument.behaviors`, and the read-back APIs, but keep mutation disabled until the exact shape/permission/GM probe passes. Only then project through `Scene.create`, `scene.update`, `scene.createEmbeddedDocuments(...)`, `RegionDocument`, and the exact Region behavior/configuration APIs exposed by the target build. Validate the created Scene, embedded Walls, Regions, and related bindings through collection/UUID rereads; geometry remains authoritative and images cannot substitute for the Region/Scene APIs.

## Phase 5 — M7 image/furnishing ports

Add role-based media provider ports and a deterministic compositor. The image provider never controls geometry. Furnishing uses functional room purpose, visual/physical/interaction/clearance footprints, relational constraints, and baked-versus-placeable policy.

Foundry binding: compile a geometry-preserving furnishing plan keyed to approved asset hashes and use the exact Scene embedded document APIs `scene.createEmbeddedDocuments("Tile"|"Token"|"AmbientLight"|"AmbientSound"|"Drawing"|"Note", ...)`, with `fromUuid`/`game.scenes.get`, `scene.getEmbeddedCollection`, and `scene.getEmbeddedDocument` read-back. `FilePicker.browse`-backed media bindings remain separate from deployment and require exact capability, reviewed-root, hash, and deployment checks. Read back owned projections and preserve foreign/runtime state; never infer placeable geometry from rendered art.

## Phase 6 — M8 Activity/Midi/Effect/Region runtime

Implement the selection compiler in this order:

```text
native Activity
→ Midi resolution/composition
→ native Active Effect / DAE extension
→ Region / Scene action
→ Additional Activity for an uncovered verb
→ fixed reviewed macro/adapter as last resort
```

Add exact-stack capability snapshots, active-GM routing, transaction ledger, one native Activity fixture, and one native Region fixture. Include failure injection, timeout reread, duplicate suppression, reconnect, and reset.

Foundry binding: read the parent Item through `fromUuid`/`game.items.get`, resolve exact Activities with `item.getEmbeddedDocument("Activity", id)`, summarize `item.system.activities.contents`, and compile a stable-intent `use` plan that requires positive `canUse`/`isOwner` observations and names `activity.use(usage, dialog, message)`, `dnd5e.preUseActivity`, and `dnd5e.postUseActivity`; usage/dialog/message configuration remains adapter-owned and execution is disabled until exact behavior is proven. Observe native Active Effects on an Actor or Item through `parent.getEmbeddedCollection("ActiveEffect")` and `parent.getEmbeddedDocument("ActiveEffect", id)`; compile a stable-intent operation plan for `parent.createEmbeddedDocuments("ActiveEffect", data)`, `effect.update(changed)`, and `effect.delete()` while keeping raw Foundry payloads out of the compiler. For Region mechanics, resolve the Region through `fromUuid` or `game.scenes.get`, observe exact Region/RegionBehavior identity through `region.getEmbeddedCollection("RegionBehavior")`/`region.getEmbeddedDocument("RegionBehavior", id)` using the read-only adapter, inspect the invocation-free `region-behavior-api-evidence` surface, `CONFIG.RegionBehavior.dataModels`, `behavior.type`, and `RegionBehaviorType.events`, and compile a strict native operation plan for `region.createEmbeddedDocuments("RegionBehavior", data)`, `behavior.update(changed)`, and `behavior.delete()` with adapter-owned configuration and authoritative reread. Optional-module diagnostics inspect `game.modules.get("midi-qol")`/`game.modules.get("dae")`, documented `MidiQOL.completeItemUse`/`applyTokenDamage` presence, and core `Hooks` presence without invoking them; no DAE callable API is inferred from package functionality alone. Actual writes require exact schema, permission, active-GM, event, and read-back evidence. Use Foundry user/permission APIs and optional Midi/DAE/Region APIs only behind exact-version adapters. Each fixture must prove one mechanic owner, active-GM recheck, sender semantics, runtime read-back, and timeout-unknown recovery before promotion.

## Phase 7 — M9 release, M10 live sync, M11 certification

Build deterministic campaign bundles, clean-world bootstrap, release diffs, selective repair, managed-field ownership, runtime-sovereignty reconciliation, migration, performance profiles, backup/restore, and blocker-based Ready-to-Play certificates.

Foundry binding: the release manifest may name only the reviewed native APIs: `JournalEntry.create`/`JournalEntry.update` with `entry.createEmbeddedDocuments("JournalEntryPage", ...)`; `Scene.create`/`scene.update` with `scene.createEmbeddedDocuments("Wall"|"Region"|placeable, ...)`; `activity.use(...)` with the D&D5e Activity hooks; native ActiveEffect embedded-document APIs; and native RegionBehavior embedded-document APIs. Bootstrap is placed at `Hooks.once("ready")`; Live Sync declares DiceBox-owned field IDs, compares redacted fingerprints, observes exact document update hooks, resolves through `fromUuid`/collection getters, and rereads through the corresponding document/embedded-document APIs. Only managed-only drift may become a disabled native update candidate; runtime-owned, foreign, observe-only, and unknown state is preserved. The M11 certificate composes `Hooks.once("ready")`, `game.version`, `game.system`, `game.users.activeGM`, User permission/client observations, native document/embedded-document APIs, document update hooks, cross-client evidence, and authoritative reread receipts; it permits Ready-to-Play only for exact Foundry 14.367 / D&D5e 5.3.3 `foundry-exact` full-function evidence. Release, live-sync, repair, and certification evidence must be captured against the exact Foundry fingerprint in clean and played worlds; static API existence never closes these gates.

## First implementation task

The first coding task is M0 only:

1. Create the repository/module package boundaries.
2. Add `module.json` and a no-op ES module with no mutation.
3. Add canonical ID, version, capability, result, and receipt types.
4. Add schema validation and the first ADR.
5. Add tests for identity separation, no raw patch type, and readiness-gated API.
6. Connect the local SQLite KB as a read-only development source, not as a live-world database.

Stop after M0 and review the result before implementing runtime mutation.

## Gate sequence

- **G0:** KB, source map, and plan are reproducible.
- **G1:** M0 tests pass and no arbitrary mutation surface exists.
- **G2:** Module loads cleanly in exact target Foundry/D&D5e.
- **G3:** Read-only runtime profile and capability snapshot are captured.
- **G4:** One managed document operation passes preview, authority, idempotency, read-back, reset, and receipt.
- **G5:** One player-triggered operation passes active-GM relay and reconnect tests.
- **G6:** Spatial slice passes player-view checks.
- **G7:** Release and certification gates pass with no required blockers.
