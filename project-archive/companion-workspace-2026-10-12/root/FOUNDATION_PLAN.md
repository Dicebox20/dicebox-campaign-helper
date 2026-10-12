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

The first module command/query is read-only. The module must load cleanly before any world mutation is attempted.

## Phase 2 — M3 identity and document slice

Implement canonical IDs, runtime bindings, settings ownership, a tiny DocumentCreationPlan, validation, idempotency, read-back, and receipts. Start with one Folder, Journal, Actor, Item, and Scene shell. Never expose raw document patching through the public API.

## Phase 3 — M4/M5 links and media

Add exact UUID resolution, source/compendium identity, two-pass link creation, stale-link diagnostics, approved asset hashes, variants, and reference scanning. Add clean-world import tests before any production-world migration.

## Phase 4 — M6 spatial slice

Implement a small SpatialBlueprint for one room. Freeze dimensions, origin, scale, Levels, wall centerlines, Regions, door anchors, and interaction clearances before generating or importing artwork. Compile a deterministic graybox first. Verify topology, reachability, player movement, visibility, and reset.

## Phase 5 — M7 image/furnishing ports

Add role-based media provider ports and a deterministic compositor. The image provider never controls geometry. Furnishing uses functional room purpose, visual/physical/interaction/clearance footprints, relational constraints, and baked-versus-placeable policy.

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

## Phase 7 — M9 release, M10 live sync, M11 certification

Build deterministic campaign bundles, clean-world bootstrap, release diffs, selective repair, managed-field ownership, runtime-sovereignty reconciliation, migration, performance profiles, backup/restore, and blocker-based Ready-to-Play certificates.

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
