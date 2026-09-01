# DiceBox Campaign Helper: First-Round Testing Guide

This is the first deterministic test round for the M3 review-first document-plan and staged-transaction slice. It does not certify live Foundry behavior and does not authorize campaign-world mutation.

The planned live adapter and test fixture must follow the [Foundry API Binding Matrix](FOUNDRY-API-BINDING-MATRIX-2026-08-21.md); this round tests the program contracts only.

## Entry criteria

- Node dependencies are installed from the checked-in lockfile.
- Python with SQLite support is available for the knowledge-base verifier.
- The working tree is treated as a user-owned snapshot; do not reset or clean it.
- No live Foundry world is required for this round.

## Run the round

From the repository root:

```text
npm run test:first-round
```

The command runs TypeScript compilation, Vitest contract/fixture tests, Foundry module syntax validation, the read-only source-boundary scan, and SQLite integrity/FTS checks.

## Expected checks

| Check | Expected result | Evidence class |
| --- | --- | --- |
| Core identity and receipt schemas | Pass | deterministic |
| Runtime capability registry | Pass | deterministic |
| Read-only bridge safe mode | Pass | deterministic |
| JournalEntry preview with exact ready profile and GM | Ready preview | deterministic |
| JournalEntry preview without write capability | Blocked | deterministic |
| JournalEntry preview without read-back capability | Blocked | deterministic |
| JournalEntry preview without GM authority | Blocked | deterministic |
| JournalEntry update without binding generation | Blocked | deterministic |
| Arbitrary document fields | Rejected | deterministic |
| Exact approval token and rechecked GM identity | Apply-ready state | deterministic |
| Mismatched/expired/changed-GM approval | Rejected | deterministic |
| Current runtime/active-GM recheck before adapter call | Required before call | deterministic |
| Adapter result plus exact read-back | Committed state | deterministic |
| Unknown outcome without reread | Remains unknown; retry forbidden | deterministic |
| Exact committed binding after reread | Committed state | deterministic |
| Missing binding or foreign conflict after reread | Recovered and preserved | deterministic |
| Versioned Foundry JournalEntry adapter marker/binding contract | Pass | deterministic |
| Foundry adapter create/read/update failure handling | Pass | deterministic |
| Program transaction journal restart/replay and append failure handling | Pass | deterministic |
| Fixed-operation bridge schemas, world scoping, and idempotency | Pass | deterministic |
| Redacted snapshot and default-disabled apply/reset boundary | Pass | deterministic |
| Fixed-operation JSON-lines framing, size limit, and response envelope | Pass | deterministic |
| Runtime fingerprint and no-write probe receipt | Pass | deterministic/static |
| Installed Foundry diagnostics `runtime-evidence` query exposes fingerprint and receipt | Pass | deterministic/static |
| Redacted active-GM observation and conservative fallback states | Pass | deterministic/static |
| Managed JournalEntry snapshot query filters ownership and redacts bindings/content | Pass | deterministic/static |
| Read-only JournalEntry API/page-schema capability probe | Pass | deterministic/static |
| Separate read-only Foundry JournalEntry adapter and authoritative reread guards | Pass | deterministic |
| Exact Foundry reference resolver and strict semantic link plan | Pass | deterministic |
| Read-only Foundry compendium index adapter and exact pack/type/UUID verification | Pass | deterministic |
| Approved media registry and bounded FilePicker browse adapter | Pass | deterministic |
| Spatial Blueprint validator and read-only Foundry Scene observation adapter | Pass | deterministic |
| Scene/Wall/Region review-first projection plan and capability/GM preview gate | Pass | deterministic |
| Read-only Foundry RegionDocument observation adapter | Pass | deterministic |
| Geometry-preserving furnishing plan and placeable/media/GM preview gate | Pass | deterministic |
| Read-only Scene embedded-placeable observation (`getEmbeddedCollection`/`getEmbeddedDocument`) | Pass | deterministic |
| Read-only D&D5e Activity observation and deterministic Activity selection plan | Pass | deterministic |
| Installed `activity-api-evidence` diagnostics query and program-bridge fallback | Pass | deterministic/static |
| Read-only Foundry ActiveEffect observation and native-owner selection plan | Pass | deterministic |
| Installed `active-effect-api-evidence` diagnostics query and program-bridge fallback | Pass | deterministic/static |
| Native ActiveEffect create/update/delete operation plan and raw-payload rejection | Pass | deterministic |
| Native D&D5e Activity use operation plan, ownership/canUse gates, and raw-config rejection | Pass | deterministic |
| Native RegionBehavior create/update/delete operation plan, identity/event gates, and raw-config rejection | Pass | deterministic |
| Read-only RegionBehavior identity/state adapter through Region embedded APIs | Pass | deterministic |
| Installed `region-behavior-api-evidence` diagnostics query and program-bridge fallback | Pass | deterministic/static |
| Installed `optional-module-api-evidence` diagnostics query and program-bridge fallback | Pass | deterministic/static |
| Blocker-based `readiness-report` through program bridge and installed Foundry namespace | Pass; remains blocked on exact-runtime gates | deterministic/static |
| Read-only `foundry:preflight` target/world/system/module manifest gate | Pass for command; current local fixture blocked at Foundry 14.365 and missing DiceBox installation | deterministic/static |
| Collision-safe `foundry:stage` module package staging and hash receipt | Pass; explicit destination only and existing module refused | deterministic/static |
| Fail-closed `foundry:launch-guard` path/world/entrypoint validation | Pass; default data path rejected and disposable fixture accepted | deterministic/static |
| Non-target Foundry 14.365 server/browser smoke | Blocked at license activation; DiceBox client `ready` and diagnostics not tested | blocked |
| Foundry settings journal registration/read/write gate | Pass | deterministic |
| Foundry module syntax and package identity | Pass | static |
| SQLite integrity and FTS | Pass | deterministic |
| Bounded read-only KB query service, provenance, coverage, and summary | Pass | deterministic |
| M9 deterministic release/bootstrap manifest, Foundry API allowlist, closure markers, and blocker preview | Pass; runtime bindings, payloads, clean-world bootstrap, and restart remain deferred | deterministic |
| M9 sovereignty-preserving release diff and no-cleanup boundary | Pass; exact runtime observations, native writes, reread, recovery, and repair remain deferred | deterministic |
| M10 managed-field sync conflict planner, sovereignty preservation, and disabled native repair candidate | Pass; exact update hooks, permissions, native write, reread, recovery, and played-world evidence remain deferred | deterministic |
| M11 six-lane blocker-based readiness certificate compositor | Pass; exact target, GM/player, native operation, reread, recovery, performance, and backup evidence remain deferred | deterministic |
| M13 program/module readiness-certificate query parity and KB blocker provenance | Pass; both runtime-facing queries remain blocked/no-write and exact Foundry evidence remains deferred | deterministic |
| M14 fail-closed Utility Harness/Chrome/exact-runtime evidence bundle validator | Pass; receipt validation is deterministic, while live artifacts, native operations, authority, reread, and recovery remain deferred | deterministic |
| M15 StateStore selection/migration preview and program/module `state-store-plan` query | Pass; program semantic truth is retained, native Foundry runtime ownership is explicit, and settings/flags/JournalEntry persistence remains blocked until exact evidence | deterministic |
| M16 versioned append-only program semantic StateStore and migration preview | Pass; restart/replay, idempotency, generation, explicit retirement, corruption, unknown-outcome, and preserve-unknown migration contracts pass without granting Foundry authority | deterministic |
| M17 guarded local stdio fixed-operation bridge | Pass; one response per JSON line, strict error envelopes, bounded transport, no-network/read-only defaults, and unknown stream/output failures are covered; live MCP/Foundry integration remains deferred | deterministic |
| M18 runnable safe-mode stdio host | Pass; the actual `tsx` child process emits a validated bridge response and stderr report for status and malformed input; it remains a local safe-mode process test, not a live Foundry or MCP certification | deterministic |
| M19 redacted stdio transport receipt and collector | Pass; the collector emits target-bound, schema-validated, no-write metadata with operation/count summaries and no raw payloads; the named Foundry API boundary remains explicitly unexercised | deterministic |
| M20 canonical Foundry runtime-evidence wire shape and audit | Pass; the module now returns the canonical runtime profile, the composite schema validates module/program evidence, and the audit blocks fingerprint drift or malformed input while permanently setting `readyClaim=false` | deterministic |
| M21 exact Foundry fixture plan and API-observation sequence | Pass; `foundry:fixture-plan` emits a blocked, no-write plan for the exact target, GM/Player3 contexts, owned reset, semantic fixture seeds, API checks, and receipt gates; no fixture mutation is attempted | deterministic |
| M22 exact Foundry fixture observation receipt and audit | Pass; the installed fixed query validates explicit M21 Journal/Activity/Region references, performs read-only native API calls plus authoritative rereads in exact mocks, emits only redacted/no-write data, and audits through a real CLI process; live Foundry execution remains deferred | deterministic |
| M23 Foundry observation bundle normalization | Pass; M22 receipts normalize into the existing `HarnessLaneReceiptSchema` and M11 certificate path with exact target/fingerprint/plan checks, GM/Player3 context validation, no-write/no-raw-data preservation, and a permanently blocked exact-runtime lane; native operation, authority recheck, recovery, and cross-client delivery remain deferred | deterministic |
| M24 exact fixture round evidence audit and harness handoff | Pass; `foundry:fixture-round-audit` validates the M21 API-check matrix, target-bound observation receipts, GM/Player3 contexts, artifact SHA-256 metadata, and receipt-to-artifact bindings, then emits a blocked artifact-aware `HarnessLaneReceiptSchema` exact-runtime receipt without raw data or readiness promotion | deterministic |

The ready preview is a plan result only. It must not be interpreted as a successful Foundry Document creation.

## First-round review questions

1. Does the plan preserve the stable DiceBox semantic ID as canonical while leaving runtime IDs/bindings unresolved?
2. Are capability, exact-version, and GM-authority failures explicit and blocker-classified?
3. Does an update require a known binding generation?
4. Does every preview produce a deterministic receipt without raw provider text, arbitrary flags, or runtime mutation?
5. Is approval bound to the exact plan fingerprint, preview receipt, expiry window, and rechecked GM user?
6. Does an unknown outcome remain non-retryable until authoritative reread resolves it?
7. Are foreign or conflicting bindings preserved instead of overwritten?

## Deferred tests

The following are intentionally not part of this round:

- Foundry import into a running world.
- Live Utility Harness or Playwright browser behavior.
- Visible Chrome GM/Player3 behavior.
- Active-GM election and cross-client socket delivery.
- Live JournalEntry creation, update, rollback, or recovery.
- Live D&D5e Activity/ActiveEffect/RegionBehavior/Midi/DAE behavior, Activity.use execution, effect and behavior create/update/delete, optional-module hook/permission/authority behavior, and Activity/Region event ordering.
- A live stdio/loopback server or MCP host negotiation.

Those require the exact disposable Foundry 14.367 + D&D5e 5.3.3 fixture, versioned adapters, and the M0/M1/M2 review gate.

## Evidence handling

The current M23 receipt is [m23-foundry-observation-bundle-static-receipt.json](../outputs/m23-foundry-observation-bundle-static-receipt.json); retain it with the M22 fixture-observation receipt, M21 fixture-plan receipt, M20 evidence-audit receipt, M19 transport receipt, M18 launcher receipt, M17 stdio bridge receipt, M16 program StateStore receipt, M15 StateStore receipt, M14 harness receipt, and earlier receipts below.

Keep the output from `npm run test:first-round` and the dated receipts in `outputs/` as deterministic/static evidence, including [m13-evidence-parity-static-receipt.json](../outputs/m13-evidence-parity-static-receipt.json), [m11-certificate-static-receipt.json](../outputs/m11-certificate-static-receipt.json), [m10-sync-conflict-static-receipt.json](../outputs/m10-sync-conflict-static-receipt.json), [m9-release-diff-static-receipt.json](../outputs/m9-release-diff-static-receipt.json), [m9-release-bundle-static-receipt.json](../outputs/m9-release-bundle-static-receipt.json), [kb-query-service-static-receipt.json](../outputs/kb-query-service-static-receipt.json), [foundry-module-stage-static-receipt.json](../outputs/foundry-module-stage-static-receipt.json), [foundry-fixture-preflight-14.365-static-receipt.json](../outputs/foundry-fixture-preflight-14.365-static-receipt.json), [foundry-smoke-14.365-static-receipt.json](../outputs/foundry-smoke-14.365-static-receipt.json), [m2-readiness-report-static-receipt.json](../outputs/m2-readiness-report-static-receipt.json), [m3-test-bridge-transport-static-receipt.json](../outputs/m3-test-bridge-transport-static-receipt.json), [m2-runtime-evidence-api-static-receipt.json](../outputs/m2-runtime-evidence-api-static-receipt.json), [m2-active-gm-evidence-static-receipt.json](../outputs/m2-active-gm-evidence-static-receipt.json), [m2-managed-journal-snapshot-static-receipt.json](../outputs/m2-managed-journal-snapshot-static-receipt.json), [m1-journal-api-probe-static-receipt.json](../outputs/m1-journal-api-probe-static-receipt.json), [m3-foundry-read-adapter-static-receipt.json](../outputs/m3-foundry-read-adapter-static-receipt.json), [m4-exact-link-static-receipt.json](../outputs/m4-exact-link-static-receipt.json), [m4-compendium-index-static-receipt.json](../outputs/m4-compendium-index-static-receipt.json), [m5-media-static-receipt.json](../outputs/m5-media-static-receipt.json), [m6-spatial-static-receipt.json](../outputs/m6-spatial-static-receipt.json), [m6-spatial-projection-static-receipt.json](../outputs/m6-spatial-projection-static-receipt.json), [m6-region-read-static-receipt.json](../outputs/m6-region-read-static-receipt.json), [m7-furnishing-static-receipt.json](../outputs/m7-furnishing-static-receipt.json), [m7-placeable-read-static-receipt.json](../outputs/m7-placeable-read-static-receipt.json), [m8-activity-static-receipt.json](../outputs/m8-activity-static-receipt.json), [m8-active-effect-static-receipt.json](../outputs/m8-active-effect-static-receipt.json), [m8-active-effect-evidence-static-receipt.json](../outputs/m8-active-effect-evidence-static-receipt.json), [m8-active-effect-operation-static-receipt.json](../outputs/m8-active-effect-operation-static-receipt.json), [m8-activity-operation-static-receipt.json](../outputs/m8-activity-operation-static-receipt.json), [m8-region-behavior-operation-static-receipt.json](../outputs/m8-region-behavior-operation-static-receipt.json), [m8-region-behavior-read-static-receipt.json](../outputs/m8-region-behavior-read-static-receipt.json), [m8-region-behavior-evidence-static-receipt.json](../outputs/m8-region-behavior-evidence-static-receipt.json), and [m8-optional-module-evidence-static-receipt.json](../outputs/m8-optional-module-evidence-static-receipt.json). If a test fails, record the failure as a new dated receipt; do not overwrite a prior receipt and do not retry a timeout without rereading the relevant state.

The installed module query is still an observation surface: it does not certify the fingerprint, permissions, settings, sockets, or document behavior until the exact Foundry world reproduces the evidence.
