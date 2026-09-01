# Focused Gap Research

Date: 2026-08-20.

This was a targeted gap pass, not a rerun of all 40 numbered subjects. It checked the areas most likely to block creation of the DiceBox program/module or make the local database stale.

## Gap 1 — Foundry module packaging

Official Foundry guidance confirms that a module requires a root `module.json`, its `id` must match the module directory name, ES modules are declared through `esmodules`, and compatibility/relationships/manifest/download metadata affect installation and updates. DiceBox therefore needs a real package boundary and release manifest early, even while the runtime is still a no-op.

Action added: module ID is `dicebox-campaign-helper`; M2 includes a valid manifest, ES module bootstrap, compatibility declaration, and readiness-gated API.

## Gap 2 — Atomic versus staged document writes

Foundry v14 `foundry.documents.modifyBatch` can batch supported operations and cancels the whole batch when an operation fails, but it cannot reference the result of an earlier operation within the same batch. DiceBox therefore needs two transaction modes: true atomic batch for independent operations, and staged idempotent transactions with journal, preconditions, authoritative reread, and compensating repair when dependencies require created IDs.

Action added: this distinction is locked in `AGENTS.md`, the database decision/open-item records, and the M3/M8 plan.

## Gap 3 — FTS5 index synchronization

SQLite’s FTS5 documentation distinguishes ordinary, contentless, and external-content indexes and warns that external indexes must be kept consistent with their source tables. The current foundation uses explicit FTS tables populated during deterministic builds, which is safe for a read-only compiled KB. If DiceBox later supports live KB editing, it must add triggers or a rebuild command and a schema migration/version table before allowing updates.

Action added: the local KB is explicitly rebuildable from schema + seed; live editing is not assumed.

## Gap 4 — Activity hooks and runtime capability

The official D&D5e documentation identifies `dnd5e.preUseActivity` and `dnd5e.postUseActivity` hooks, while the Activity documentation states that Activities replace the older single-action Item model and can be extended by modules. DiceBox should probe the installed runtime’s actual registered Activity classes and hooks rather than infer capabilities from documentation, source files, or settings labels.

Action added: Activity/Midi capability discovery is a P0 implementation item before automation promotion.

## Gap 5 — package/version drift

Foundry’s module-management documentation warns that modules intended for a different Foundry version may fail or cause data loss, and package management compares manifest versions and download metadata. DiceBox needs immutable source/archive fingerprints, a compatibility receipt, and clean-install evidence before it advertises a module release.

Action added: exact-stack retargeting and release fingerprinting are P0 gates.

## Remaining gaps not solved by this quick pass

- Exact installed Midi-QOL and DAE versions and registered classes in the target world.
- Exact Foundry 14.367 `User.query` sender semantics and active-GM election behavior.
- Physical StateStore driver, migrations, concurrency, and corruption recovery.
- Transaction-ledger behavior under unknown commit and partial external failure.
- Clean-world module install/update/rollback and package signature/release workflow.
- Player-client performance budgets for large Scenes, media, Regions, Activities, and assets.
- Formal privacy/redaction policy for KB provenance and runtime receipts.

## 2026-08-21 creation pass

The official lifecycle and API references were rechecked before beginning the first runtime slice. The implementation now schedules a read-only probe at `ready`, records conservative capability states, and exposes a frozen diagnostics object without calling any Document/settings/socket mutation API. This is static/deterministic evidence only; the official documentation is not a substitute for a live 14.367 probe.

## Primary references

- https://foundryvtt.com/article/module-development/
- https://foundryvtt.com/api/v14/functions/foundry.documents.modifyBatch.html
- https://foundryvtt.com/api/v14/modules/foundry.documents.html
- https://github.com/foundryvtt/dnd5e/wiki/Activities
- https://github.com/foundryvtt/dnd5e/wiki/Hooks
- https://www.sqlite.org/fts5.html
- https://foundryvtt.com/article/modules/
- https://foundryvtt.com/article/package-management/
