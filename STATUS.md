# DiceBox Campaign Helper Status

Status: M0 contract gate preserved; read-only M1/M2 runtime-probe slice and M3 preview/transaction contracts started; live exact-stack gate remains open.

All Foundry-facing plans are now audited against `docs/FOUNDRY-API-BINDING-MATRIX-2026-08-21.md`; no DiceBox abstraction is treated as a replacement for an official Foundry API.

## Complete

- Linked Campaign Assistant project overview and five project chats reviewed.
- Existing Campaign Assistant KB, Regionwright, DMF, conversations, trial ledger, audit, and 40-subject pass incorporated.
- DiceBox project charter and Codex contract written.
- SQLite KB schema, seed, FTS5 search, views, and reproducible build script created.
- Database integrity check passed.
- Focused gap research completed for module packaging, document transactions, FTS5 synchronization, Activities/hooks, and package drift.
- Creation plan written through M0-M11.
- M0 implementation checkout created with four package boundaries, canonical types/schemas, readiness-gated bridge, Foundry package, ADR-0002, and 12 passing tests.
- M0 verification recorded as static/deterministic evidence only; no live Foundry or world-mutation claim is made.
- Read-only runtime probe and frozen diagnostics API added; 11 static/deterministic tests pass.
- Research and creation sequence recorded in `docs/RESEARCH-AND-CREATION-2026-08-21.md` and ADR-0003.
- M3 JournalEntry preview, approval-token, staged-transaction, unknown-outcome recovery, native JournalEntry mapper, adapter-independent executor, append-only ledger, and a versioned Foundry JournalEntry adapter added; 49 deterministic tests pass.
- The structural adapter now calls the official `JournalEntry.create`/`JournalEntry.update` surfaces behind a bounded port, resolves through `fromUuid`/`game.journal.get`, verifies a namespaced ownership marker, preserves the managed embedded page binding, and fails closed on foreign or unknown state.
- The program engine now persists staged transaction transitions through an append-only JSON-lines file driver, replays after restart, rejects malformed history, preserves write-unknown outcomes, and exposes the same async writer boundary to the executor; 54 deterministic tests pass.
- The fixed-operation local bridge now validates `status`, `fixture.select`, `plan.preview`, `plan.applyApproved`, `snapshot.redacted`, and `reset.owned` requests, scopes them to `dbx-test-world`, redacts runtime bindings, deduplicates idempotent requests, and keeps apply/reset disabled by default; 62 deterministic tests pass.
- The read-only Foundry probe now emits a deterministic runtime fingerprint and no-write receipt, classifies exact-target mismatch, and is schema-validated in both target and mismatch fixtures; 63 deterministic tests pass.
- A gated module-side settings journal candidate now uses the official `game.settings.register/get/set` surfaces, world-scoped hidden configuration, active-GM recheck, append replay, and unknown-write handling; 68 deterministic tests pass.
- The fixed-operation bridge now has a bounded JSON-lines transport envelope with a 64 KiB default line limit, strict one-request/one-response framing, malformed-input handling, and synchronous/asynchronous line-source tests; 75 deterministic tests pass.
- The installed Foundry diagnostics namespace now exposes a named `runtime-evidence` query containing the read-only profile, deterministic fingerprint, and no-write probe receipt; 75 deterministic tests pass.
- The same diagnostics evidence now includes a redacted `game.users.activeGM` observation with conservative unknown/unavailable fallback states; 75 deterministic tests pass.
- The installed diagnostics API now exposes a `managed-journal-snapshot` query that reads only DiceBox-owned JournalEntry markers, semantic/plan IDs, page counts, and hashed bindings; foreign/unknown documents and title/content are omitted; 75 deterministic tests pass.
- The diagnostics API now exposes `journal-api-evidence`, a read-only probe of JournalEntry factory/binding/collection/update/embed surfaces and page type/format constants; no API is invoked; 75 deterministic tests pass.
- A separate `foundry.journal-entry.read@14.367` adapter now reads only through official `fromUuid` or `game.journal.get` surfaces, reuses exact ownership/page guards, preserves unknown resolution outcomes, and accepts no write-shaped dependencies; 79 deterministic tests pass.
- M4 exact reference/link resolution now has a strict semantic link plan and a separate `foundry.reference.read@14.367` adapter using official `fromUuid` or `game.journal.get`; it verifies document type/id/UUID, returns identity metadata only, and preserves missing, foreign, malformed, and unknown states; 89 deterministic tests pass.
- M4 now also has a separate `foundry.compendium.index.read@14.367` adapter using official `game.packs.get`, `pack.index.get/getName`, and `pack.getIndex`; it verifies exact pack/type/entry UUID identity, returns metadata only, and keeps import/mutation unavailable; 95 deterministic tests pass.
- M5 now has a strict approved media/variant registry requiring SHA-256, provenance, approval, and distinct identities, plus a bounded `foundry.file-browse.read@14.367` adapter using only `FilePicker.browse` beneath a reviewed root; upload/delete/cleanup remain absent; 104 deterministic tests pass.
- M6 now has a strict DiceBox-owned Spatial Blueprint validator and a read-only `foundry.scene.read@14.367` adapter using `fromUuid` or `game.scenes.get` to validate Scene identity, dimensions, grid, and embedded collection counts; Scene/Region projection writes remain gated; 114 deterministic tests pass.
- M6 now also has conservative `foundry.scene.*` and `foundry.region.*` capability IDs plus a strict create-only Spatial Projection Plan naming official `Scene.create`, `scene.createEmbeddedDocuments("Wall", ...)`, `scene.createEmbeddedDocuments("Region", ...)`, `RegionDocument`, and read-back APIs; anchors remain non-mutating intents and preview requires exact capabilities and GM authority; 118 deterministic tests pass.
- M6 now also has a separate `foundry.region.read@14.367` adapter using `fromUuid` and documented `RegionDocument.shapes`/`RegionDocument.behaviors` read surfaces to emit redacted shape and behavior summaries; malformed or uncertain fields remain unknown and no write methods are exposed; 122 deterministic tests pass.
- M7 now has conservative placeable/media capability IDs, a strict geometry-preserving furnishing plan, and a separate read-only embedded-placeable adapter for Tile, Token, AmbientLight, AmbientSound, Drawing, and Note. It resolves approved asset hashes without locators, validates footprints/clearances/anchors/Regions/relations, names official Scene embedded APIs, validates exact parent/child identity through `getEmbeddedCollection`/`getEmbeddedDocument`, and blocks preview without exact placeable/media/GM gates; the first-round receipt records the current deterministic test count.
- The current first-round gate passes with 55 test files / 241 tests, TypeScript build, tooling verification, and SQLite integrity; the live exact-stack gate remains blocked.
- The program KB query service now provides fixed read-only facts/decisions/trials/blockers/subject/plan/source/coverage/summary retrieval with parameterized FTS, provenance joins, SQLite `mode=ro`, and injection/mtime tests; O-002 is closed.
- M9 now has a deterministic release/bootstrap manifest compiler. It sorts stable component IDs, maps JournalEntry, Scene/Region, placeable, D&D5e Activity, ActiveEffect, and RegionBehavior components to a closed allowlist of official Foundry APIs, binds bootstrap to `Hooks.once("ready")`, separates semantic closure from deferred runtime bindings, rejects tampered API names, and keeps payloads/mutation disabled; 44 test files / 196 tests pass. The clean-world bootstrap/restart gate remains open.
- M9 now also has a sovereignty-preserving release diff planner. It distinguishes explicit `missing`, `managed`, `foreign`, and `unknown` observations, requires generation/fingerprint evidence for managed state, never infers missing from omission, binds only create/reread candidates to manifest APIs, preserves runtime-only/foreign/unknown state, and disables cleanup/delete; 45 test files / 200 tests pass.
- M10 now has a field-level sync conflict planner. It compares only declared DiceBox-owned field fingerprints, classifies equal/managed-drift/runtime-owned/foreign/unknown, emits `JournalEntry.update`/other native update candidates only for managed-only drift, preserves observe-only and runtime state, rejects raw payloads, and keeps repair disabled; 46 test files / 204 tests pass.
- M11 now has a six-lane blocker-based readiness certificate compositor. It requires contract, static, deterministic, Utility Harness, visible Chrome, and exact-runtime lanes; names Foundry API dependencies, preserves blocked/unknown states, gates on the exact target fingerprint and `foundry-exact` full-function evidence, and cannot promote static/API/fixture evidence to Ready-to-Play; the current suite includes this slice and passes 51 test files / 228 tests.
- M13 now exposes that certificate through matching read-only `readiness-certificate` queries in the program bridge and installed Foundry module. The KB blocker query now returns source provenance through its reproducible view; both surfaces preserve the blocked/no-write exact-runtime boundary; the current suite passes 51 test files / 228 tests.
- M14 now validates Utility Harness, visible Chrome, and exact-runtime receipts before composing the certificate. It binds artifacts and checks to the runtime fingerprint, requires canonical Foundry API names, enforces GM/Player3 and exact disposable-fixture evidence, and rejects malformed/stale bundles; the current suite passes 51 test files / 228 tests.
- M15 now defines a read-only StateStore selection and migration-preview boundary. Program JSON remains the semantic owner, native Foundry Documents remain runtime authority, `game.settings.register/get/set` is a gated transaction-recovery candidate, and `Document` flags/JournalEntry mirrors remain bounded candidates; program and installed-module `state-store-plan` queries preserve unknown/foreign state and keep all persistence writes disabled.
- M16 now makes the program-owned semantic store concrete with canonical SHA-256 JSON content hashes, append-only replay, monotonic generations, idempotency, explicit retirement, corrupt-history fail-closed handling, unknown-outcome recovery, and no-write migration previews; it grants no Foundry authority.
- M17 now binds the fixed-operation bridge to a caller-owned stdio stream with one response per bounded JSON line, strict versioned error envelopes, explicit no-network/read-only defaults, and outcome-unknown stream/output failures; it adds no Foundry or execute-as-GM authority.
- M18 now provides a runnable `bridge:stdio` safe-mode host through `tsx`; process tests validate real stdout protocol responses, stderr transport reports, and malformed-input handling. It calls no Foundry API, discovers no world, enables no mutation, and does not close the live exact-world/MCP gate.
- M19 now adds `createStdioTransportReceipt` and `bridge:stdio:receipt`, which bind safe-mode process evidence to the reviewed Foundry API boundary while explicitly marking that boundary unexercised. Receipts contain only target metadata, counts, operation names, and no-write flags; raw payloads are omitted and unknown transport outcomes remain blocked.
- M20 now fixes the Foundry module’s `runtime-evidence` profile handoff and adds `FoundryRuntimeEvidenceSchema`, `auditFoundryRuntimeEvidence`, and `foundry:evidence-audit`. The audit validates structure, fingerprint/target consistency, and named Foundry API boundaries while permanently setting `readyClaim=false`.
- M21 now adds `createFoundryFixturePlan` and `foundry:fixture-plan`, a blocked exact-target handoff for `dbx-test-world`, GM/Player3 contexts, owned-fixture-only reset, Journal/Activity/Region observation seeds, named Foundry API checks, receipt requirements, and no-write next gates.
- M22 now adds the fixed read-only `fixture-observation` query and `FoundryFixtureObservationReceiptSchema`. It validates explicit M21 Journal/Activity/Region references, calls only named Foundry read/reread APIs, redacts runtime bindings/content, never invokes `Activity.use` or native mutation, and audits through `foundry:fixture-observation-audit` with `readyClaim=false`.
- M23 now adds `createFixtureObservationBundle` and `FoundryFixtureObservationBundleAuditSchema`. It normalizes target-bound M22 GM/Player3 receipts into the existing `HarnessLaneReceiptSchema` and M11 certificate path while preserving no-write/no-raw-data guarantees; exact-runtime remains blocked until active-GM recheck, native operation/read-back, recovery, and cross-client evidence exist.
- M24 now adds `FoundryFixtureRoundEvidenceSchema`, `FoundryFixtureRoundHarnessAuditSchema`, and `foundry:fixture-round-audit`. It validates M21-required Foundry API coverage, target-bound receipts, GM/Player3 contexts, artifact SHA-256 metadata, and receipt-to-artifact bindings, then carries only redacted metadata into a blocked exact-runtime harness receipt without promoting the package to a readiness claim.
- M8 now has a read-only D&D5e Activity adapter and strict Activity selection/readiness plan. It resolves the parent Item through `fromUuid`/`game.items.get`, reads exact Activities through `item.getEmbeddedDocument("Activity", id)`, summarizes `item.system.activities.contents`, names `activity.use` and `dnd5e.preUseActivity`/`dnd5e.postUseActivity`, and keeps execution disabled until exact registry, hook, permission, active-GM, and read-back evidence exists.
- The installed module and program bridge now expose a redacted `activity-api-evidence` query for the Activity registry and read/use/hook surface presence; it invokes no Activity methods and does not certify behavior.
- M8 now also has a read-only `foundry.active-effect.read@14.367` adapter for exact Actor/Item parent bindings, using `parent.getEmbeddedCollection("ActiveEffect")` and `parent.getEmbeddedDocument("ActiveEffect", id)`, plus a strict native-owner selection plan naming future `parent.createEmbeddedDocuments("ActiveEffect", data)`, `effect.update(changed)`, and `effect.delete()` surfaces while keeping execution disabled.
- The installed module and program bridge now expose a redacted `active-effect-api-evidence` query for official ActiveEffect class/accessor, Actor/Item embedded-document, native mutation, and `applyActiveEffect` hook surface presence; it invokes no document methods and does not certify effect behavior or permissions.
- M8 now also has a strict native ActiveEffect create/update/delete operation plan. It binds exact Actor/Item generations, stable DiceBox intent fingerprints, native Foundry API names, active-GM/read/write gates, authoritative reread, and native ownership while rejecting raw `data`/`changed` payloads and keeping execution disabled.
- M8 now also has a strict native D&D5e Activity `use` operation plan. It binds exact Item/Activity generations, stable intent fingerprints, positive `canUse`/`isOwner` observations, `activity.use(usage, dialog, message)`, `dnd5e.preUseActivity`, `dnd5e.postUseActivity`, active-GM/read-back gates, and native ownership while rejecting raw usage/dialog/message payloads and keeping execution disabled.
- M8 now also has a strict native RegionBehavior create/update/delete operation plan. It binds exact Region/RegionBehavior generations, stable behavior intent and event names, `CONFIG.RegionBehavior.dataModels`, `RegionBehaviorType.events`, native embedded behavior APIs, active-GM/read-back gates, and native ownership while rejecting raw data/config/changed payloads and keeping execution disabled.
- M8 now also has a read-only `foundry.region-behavior.read@14.367` adapter. It resolves the exact parent Region through `fromUuid`, reads `getEmbeddedDocument`/`getEmbeddedCollection("RegionBehavior")`, returns only identity/type/state summaries, preserves timeout and foreign outcomes, and exposes no mutation methods.
- The installed module and program bridge now expose a redacted `region-behavior-api-evidence` query for Region/RegionBehavior class, registry, embedded-document, accessor, subtype-event, and mutation-surface presence; it invokes no RegionBehavior methods or documents and does not certify behavior.
- M8 now also has an invocation-free `optional-module-api-evidence` query using Foundry `game.modules.get`, module metadata/API presence, documented `MidiQOL.completeItemUse`/`applyTokenDamage` presence, and core `Hooks` presence. It does not invoke optional-module methods, infer DAE’s public API, or promote Midi/DAE ownership over native Foundry/D&D5e mechanics.
- M2 now has a shared blocker-based `readiness-report` in the program bridge and installed Foundry namespace. It names the official Foundry API behind each check, preserves pass/unknown/blocked states, records no-write posture and next gates, and remains blocked on exact runtime behavior, permissions, active-GM authority, recovery, and authoritative read-back.
- Added the read-only `npm run foundry:preflight` gate. Against the local Foundry data path it observed D&D5e 5.3.3 and Midi-QOL 14.0.11/DAE 14.0.13, but recorded Foundry 14.365/world 14.365 and missing DiceBox installation as blockers; it does not launch or modify a world.
- Added collision-safe `npm run foundry:stage` packaging for an explicit disposable data path. It validates the canonical module manifest, copies only `module.json` and `src/module.js`, refuses an existing destination module, and records SHA-256 hashes without touching live Foundry data by default.
- Added fail-closed `npm run foundry:launch-guard`. It rejects the normal local Foundry data path, verifies an explicit disposable world identity and Foundry Node entrypoint, constructs unambiguous `--dataPath`/`--world`/`--port` arguments, and leaves process execution opt-in. The local 14.365 smoke reached Foundry's activation page but was blocked before client `ready`; the result is recorded as non-target evidence.
- Official Foundry API binding matrix added for lifecycle, users/active GM, JournalEntry/pages, Scenes, Regions, Activities, and later document projections.
- All implementation-plan API names reconciled to official Foundry v14 surfaces; every staged plan row now names its Foundry API family and exact-runtime evidence gate, and the static audit receipt records the remaining exact-14.367 behavior gates.
- The isolated smoke lane confirmed server startup and setup-page serving on the copied 14.365 fixture, but did not test DiceBox client load or diagnostics. An unguarded default-path launch incident was stopped and disclosed in the smoke receipt; no DiceBox module was installed or activated there and no DiceBox document mutation was attempted.

## Current database counts

- 80 sources
- 95 normalized facts
- 70 decisions
- 21 open items
- 69 trial records
- 40 research subjects
- 25 milestones

## First blockers

- Exact Foundry 14.367 runtime probe.
- Local fixture preflight is blocked until a Foundry 14.367 installation/world and DiceBox module installation are available.
- Exact Midi-QOL behavior, permissions, hook ordering, active-GM routing, read-back, and DAE public API/capability inspection.
- Exact D&D5e Activity registry, Item Activity collection, `Activity.use`, hook ordering/cancellation, and Activity read-back behavior.
- Exact RegionBehavior registry, subtype schema, event configuration/ordering, permissions, active-GM routing, native writes, and authoritative behavior read-back.
- Exact ActiveEffect schema/configuration, Actor/Item embedded-effect permissions, create/update/delete behavior, active-GM routing, and authoritative effect read-back.
- Exact Foundry 14.367 runtime probe, including actual registered document/system surfaces.
- Campaign StateStore selection and migration prototype.
- Module-side Foundry transaction journal persistence choice.
- Live local/MCP bridge transport and exact-world integration.
- Exact-world runtime fingerprint capture and behavior comparison.
- Exact-world invocation of the installed `runtime-evidence` diagnostics query.
- Exact-world active-GM election and sender-semantics evidence.
- Exact-world managed JournalEntry snapshot and ownership-marker evidence.
- Exact-world JournalEntry API/page-schema observation and shape-acceptance evidence.
- Exact-world read-only JournalEntry adapter behavior, permissions, and authoritative reread evidence.
- Exact-world UUID resolution, compendium/world link closure, visibility, and stale-link behavior.
- Exact-world compendium pack permissions, index loading/shape, and import behavior.
- Exact-world FilePicker browse permissions, asset paths/hashes, rights, and deployment/read-back behavior.
- Exact-world Scene/Region document shape, permissions, geometry, Levels, behaviors, projection, and read-back behavior.
- Exact Foundry settings registration and module-side journal persistence.
- Live stdio/loopback transport and MCP host negotiation.
- Exact Foundry JournalEntry adapter behavior and permissions.
- Fresh two-client authority/reconnect test.
- DMF Region Builder settings-open defect and Region schema reconciliation.
- License activation and exact Foundry 14.367 client `ready`/diagnostics smoke in a disposable fixture.
- M9 clean-world release bootstrap, runtime binding resolution, native payload acceptance, authoritative reread, restart, and selective-repair evidence.
- Exact-world redacted observation input for the M9 sovereignty diff and one approved native create/read-back candidate.
- Exact-world managed-field update-hook observation and one approved native repair/read-back candidate.
- All six M11 evidence lanes with exact target, GM/player, recovery, performance, backup, and authoritative reread receipts.
- M13 module/program certificate-query parity and KB blocker provenance evidence.
- M14 harness evidence-bundle validation and certificate composition evidence.
- M15 exact StateStore driver selection, migration, restart, concurrency, corruption recovery, active-GM, permission, and authoritative reread evidence.
- M16 exact Foundry-backed recovery-driver selection and live-world persistence evidence; the program store is deterministic only.
- M17–M24 live stdio host/MCP negotiation, exact Foundry-side bridge connection, target-bound Foundry receipts, native operation/read-back, active-GM/recovery, cross-client evidence, and complete first-round artifact coverage remain open. M18–M24 prove only local safe-mode process, structured evidence, a blocked fixture handoff, deterministic/mock read-only observation behavior, blocked harness/certificate normalization, and a fail-closed coverage audit.

## Next action

Run the guarded server/browser lane only after an exact disposable Foundry 14.367 / D&D5e 5.3.3 fixture is available and activation is authorized; then invoke the installed `runtime-evidence`, `managed-journal-snapshot`, `journal-api-evidence`, `activity-api-evidence`, `active-effect-api-evidence`, `region-behavior-api-evidence`, `optional-module-api-evidence`, `readiness-report`, and `readiness-certificate` queries, compare fingerprint, no-write receipt, redacted active-GM observation, managed ownership markers, JournalEntry page constants, Activity/ActiveEffect/RegionBehavior surfaces, optional Midi-QOL/DAE metadata, certificate lanes, and blocker report, then exercise the read-only document, compendium, FilePicker, Scene, Activity, ActiveEffect, and RegionBehavior adapters through their official Foundry APIs. Verify exact UUID/link/index/media/Scene/effect/behavior closure, test active-GM sender semantics, and review the gated settings journal before binding the bounded JSON-lines transport. After those observations, feed only reviewed semantic component plans into the M9 manifest and sovereignty diff, resolve runtime bindings through the named native APIs, and capture clean-world bootstrap/restart/read-back receipts; do not promote mutation, automation, cleanup, or campaign compilation from static M0/M1/M2/M3/M4/M5/M6/M7/M8/M9 evidence alone.
