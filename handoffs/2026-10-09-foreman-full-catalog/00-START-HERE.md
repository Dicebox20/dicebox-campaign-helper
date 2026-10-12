# DiceBox Campaign Helper | Next-chat handoff

**Prepared:** 2026-10-09, read-only snapshot and catalog of the authorized local project. The source files themselves have not been copied into this handoff. All paths are local Windows paths on `DESKTOP-OI30P4Q`.

## Read in this order
1. `01-NEXT-CHAT-HANDOFF.md` — scope, latest verified evidence, pending actions, and controls.
2. `02-BRIDGE-CONNECTION.md` — exact Bridge tool/runtime status and why Foreman binding is not verified.
3. `03-RECONCILIATION.md` — completed N3-to-N1 recovery and remaining acceptance gates.
4. `CATALOG-SUMMARY.json` — counts, project root summaries, Git status, exclusions, scanning warnings.
5. `ALL-FILES-SHA256.jsonl` — one JSON object per indexed project/companion file (relative path, byte size, timestamps, SHA-256).
6. `GIT-STATUS-PORCELAIN.txt` and `GIT-DIFF-STAT.txt` — snapshot of the non-clean working tree.
7. `FOLDER-SUMMARY.json` — top-level grouping; reconcile its totals against the catalog.

## Two separate workstreams
**Product-wide:** DiceBox Campaign Helper, with Desktop app, Foundry module, compiler, asset systems, SQLite KB, verification harness. Read `PROJECT_CHARTER.md`, `docs/PROJECT-MISSION-AND-ORCHESTRATION.md`, `docs/ACTIVE-PROGRAM-SLICE.json`, and `docs/DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md`. A local pass is not a live acceptance certificate.

**Current campaign fixture:** Central Lodge / N3 Depot, world `dbx-test-world` on 127.0.0.1:30005. Read `docs/CL50-DEPOT-HUB-FAST-TRAVEL-DESIGN-2026-10-09.md`, then companion checkpoint `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\outputs\LATEST-FOREMAN-CHECKPOINT.json`.

## Critical status
- Latest companion Foreman checkpoint observed at **2026-10-09T19:54:02Z**: work unit `clscale-depot-native-transfer-recovery-and-intent-durability-v001`, partial/continue, with 141/141 tests and fixture 16/16 integrity checks from that run.
- Separate current local scheduler check reported **Disabled** (2026-10-09 ~20:27Z), while the checkpoint says it was Ready earlier. Do not erase this discrepancy or blindly re-enable the task.
- Bridge local diagnostics report healthy local journal and PowerShell, but **the chat identity is missing** and matching current Codex live session has not been verified. No true Foreman bridge binding is proven.
- There is substantial **uncommitted source work**. Preserve all unrelated edits; no cleanup/reset/rebase without independent verification.
- A user earlier requested a **second Gamemaster user** on the test server and the port link. Its creation is **not established by this handoff**. Verify users first via the native Foundry user-management flow; do not duplicate or set guessed credentials. Port is 30005 on loopback, but the test server is normally stopped.

## How to continue
Open a new ChatGPT conversation with access to Remote Desktop Commander. Copy or reference `01-NEXT-CHAT-HANDOFF.md` and `02-BRIDGE-CONNECTION.md` by exact local paths. Check the current device, file mtimes, active writer/scheduler, and checkpoint before project operations. Never infer today's system state from an old receipt. Use `bridge_doctor` first, and connect Foreman only after exact session/chat identity is positively verified. Do not start a second simultaneous Foundry writer.

No credentials or Bridge message payloads are included in these handoff files.
