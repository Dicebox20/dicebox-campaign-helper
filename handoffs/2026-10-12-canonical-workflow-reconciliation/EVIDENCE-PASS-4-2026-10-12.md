# DiceBox canonical workflow reconciliation — evidence pass 4

**Date:** 2026-10-12, America/Los_Angeles  
**Type:** GitHub full-blob baseline and chronological-ID collision audit; independent documentation-only review checkpoint  
**Status:** **PARTIAL / STOP AT PROMOTION GATE**  
**Evidence layer:** complete Git blob source reading, scoped structural JSON checking, complete baseline/delta identifier scans and archived-local SQL comparison. **No SQLite rebuild, native checker/test execution, or live Foundry access.**

This checkpoint continues [START-HERE](START-HERE.md), the [search protocol](FILE-SEARCH-PROTOCOL.md), [Evidence Pass 2](EVIDENCE-PASS-2-2026-10-12.md), [Evidence Pass 3](EVIDENCE-PASS-3-2026-10-12.md), and the [review proposal](../../docs/proposals/CANONICAL-WORKFLOW-RECONCILIATION-2026-10-12.md). Its newer verified full-file findings resolve the **reader blocker** recorded in the earlier passes; they do **not** supersede `main` or prove database/runtime acceptance.

## 1. Exact repository and source identities

- Canonical repository `Dicebox20/dicebox-campaign-helper`; accepted `main` commit directly refreshed as `1137241a7df431a5cc4bc775ab56dcd283e1db29`.
- Review branch was `00296e324c5919fa36166f623aa01d676ab5a7b4` before this pass: 9 commits ahead and zero behind `main`. Refresh SHA/PRs before acting.
- `main:AGENTS.md` blob `ec6cd9ec46df104c73d8d38654eb39b717699ef9` remains controlling. `main:PROJECT_CHARTER.md` blob `f488d4ae3cba13ae2cd8b62a83f25aebd02e795d`; `main:docs/PROJECT-MISSION-AND-ORCHESTRATION.md` blob `e186686dc142e6a219d3aeaa9e243c8ca8fd1c96`; `main:docs/DICEBOX-CAMPAIGN-HELPER-UNIFICATION-2026-10-01.md` blob `f5b355d0f78d0a2ba2cecd0958a759dc0dbd0c9a` were directly opened.
- PR #7 (head `46ad6f8ebacd9de7b5399d6725de49da65522d3b`) and PR #16 (head `97556e35f4e93f231d9b9c23527d58273c58c946`) still open/draft/unmerged at inspection. PR #16's six failures in five test files remain **historically reported**, not rerun here.

## 2. Large-file reader blocker RESOLVED for source inspection

Contrary to the `fetch_file` and raw-URL empty/size-limited results in earlier passes, connected GitHub `fetch_blob` **successfully returned the complete decoded textual contents** of:

| Accepted `main` file | Exact Git blob SHA | Full decoded character count |
|---|---|---:|
| `docs/ACTIVE-PROGRAM-SLICE.json` | `d88ac9df752688d4b5414c44e00a66cf3875cf49` | 2,667,665 |
| `docs/DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md` | `83494631647c8f75736933f57c3e6ac3a27ce25b` | 1,602,666 |
| `database/seed.sql` | `f59f13522205a2c5dff9a504db71fd95860d250f` | 30,629,141 |

These are decoded **character** counts; Git tree byte sizes can differ because of Unicode. `seed.sql` was searched across its entire content, not inferred empty. `main:database/schema.sql` was directly inspected. All 17 main `database/seed.d/*.sql` dated deltas were directly read and searched. This settles **source visibility** only: no trusted local checkout/database binary was materialized, no disposable SQLite replay/FTS/foreign-key/integrity verification was run, and no native `workflow:check`/`npm run check` was executed.

## 3. Current machine-enforced active stage is now known

The full accepted-main JSON **parsed successfully**. Its `steps` array has the expected 16 stage IDs:
- Stages 1–11: `passed`, each with a required evidence-label match, non-empty observation, and artifact array under a bounded structural inspection (not independent replay of those artifacts).
- **Stage 12**: `scene-authoring-breadth`, `in_progress`.
- Stages 13–16: `pending` (Desktop Foundry Control, Campaign Content Compiler, Image Provider Benchmark, Product Hardening/Release).
- `activeLanes: {build:["scene-authoring-breadth"], live:[], research:[]}`; `failureControl.stageId` matches Stage 12 with `failures:0`.
- `goalId: O-116`; `readyClaim` must remain **false** because stages remain incomplete.

Exact `nextAction` field:
> M1284 is closed at the manual Gamemaster rejoin gate. Await manual join in browser tab 14, then continue the already-authorized single v5 loaded identity-control observation; M1271/M1272 four-Scene apply remains complete and must not be replayed.

The roadmap's M1284 entries corroborate that a source-recorded **manual** join boundary was reached; one v5 restart was reported, with no automatic authentication, identity-control invocation or world-document writes at closure. The exact runtime/player/GM is **not accessible or newly authenticated in this conversation**. Neither the historical tab/PID nor the checkpoint is a live session handle or permission to dispatch. Do not replay M1271/M1272 or restart M1284; do not invent a substitute current Foreman identity.

**Potential prose drift requiring review:** `scopeBoundary` in the same card still says `Stage 11 remains partial/blocked`, whereas the structured Stage 11 `steps[10].status` is `passed` with evidence. The checker source `tools/check-active-slice.mjs` blob `cf4763aefebacff557d6661ff4252fe491ccda73` validates ordered stage statuses/evidence but does not appear to reconcile that free-text clause. Treat this as a **possible stale narrative / distinct subgate qualifier**, not permission to alter the card. Retain both verbatim statuses pending stage-owner review.

## 4. Critical primary-key collisions between main and archived local trials

`main:database/schema.sql` makes `kb_trials.trial_id` a **TEXT PRIMARY KEY**; likewise `kb_sources.source_id`, `kb_facts.fact_id`, and `kb_decisions.decision_id` are primary keys.

The full `main:database/seed.sql` explicitly contains:
- **`T-190`** = `mission-foreman-worker-governance`, source `SRC-M142-DICEBOX-MISSION-FOREMAN-WORKER` (original seed row around line 5,261, repeated by later baseline sections). This is **NOT** the Blingdenstone live Macro failure trial.
- **`T-209`** = `tram-v6-fixture-routing-apply`, source `SRC-M161-FIXTURE-TRAM-V6-ROUTING-APPLY` (original row around line 5,863, repeated by later baseline sections). This is **NOT** a Region→Macro permission trial.

The separate **archived companion** `project-archive/companion-workspace-2026-10-12/database/seed.sql` on PR #16, blob `78cd5687c8f8d3912b2df67e3fc3e2fd85f2e9b2`, directly states:
- Local **`T-190`** = `exploration`: player failed to execute a Region-triggered Macro when Macro ownership was default NONE despite `everyone=true`; linked source `SRC-BLINGDENSTONE-RUNTIME-175` (archived seed around line 2,613).
- Local **`T-209`** = `macro-permission`: generalized user-approved rule with `S-2026-10-12-REGION-MACRO-EXECUTION-CONTRACT` (archived seed around lines 3,986–4,010), a local evidence claim and references to the different local `T-190`.

The archived companion `seed.sql` also records:
- `S-2026-10-12-REGION-MACRO-EXECUTION-CONTRACT`
- `F-2026-10-12-REGION-MACRO-EXECUTION-CONTRACT`
- `D-2026-10-12-REGION-MACRO-EXECUTION-CONTRACT`

A **complete exact-token scan** of `main:seed.sql` **and all 17 main deltas** found **no** occurrences of those three Region IDs or of companion PREPARE IDs `S/F/D-2026-10-09-PREPARE-TEXT-LAYOUT`. This provides full textual source collision coverage for **those IDs at this main commit**, not a successful database rebuild, broader semantic conflict absence or approval to promote.

**Migration safety finding:** Do **not** import companion `T-190` or `T-209` using the same trial IDs. Archived SQL uses `INSERT OR REPLACE` for `kb_trials`; copying its local `T-209` could overwrite accepted main's unrelated Tram trial, and referencing local `T-190` would falsely associate the Macro incident with the governance trial. Preserve both archived identities as *source-qualified historical IDs* (e.g. `companion-archive:seed.sql:T-190`, `companion-archive:seed.sql:T-209`), keep their independent source/fixture provenance, and **assign a new unique canonical trial ID only after a governed migration plan and database-wide uniqueness check**. Never silently redefine main trial relationships or accept a local `locked` status as global GitHub approval.

## 5. Bounded, review-only promotion separation

**PREPARE candidate (Oct 9):** The archived source/decision IDs are currently textually unoccupied in main. The approved local intent is a required monospaced top-down schematic with cardinal directions, ingress/egress, routes, obstacles, legend/location table, review before structural art and preserved PREPARE packet. Spatial Blueprint remains coordinate/geometry authority; Oct 7 two-render process and one-MD/one-macro BUILD continue. **Do not promote experimental v3.1.**

**Region→Macro candidate (Oct 12):** The archived global source/fact/decision IDs are textually unoccupied, **but both local trial IDs collide with unrelated accepted main trials**. A reviewable future delta must preserve local exact-world evidence as scoped historical provenance, map it to unique IDs, and add least-privilege preflight/post-install/fresh-reload per-player executable checks without exposing privileged GM code or claiming live-world certification. Distinguish `everyone=true`, Macro `LIMITED` vs `OWNER`, a permission canary, and genuine gameplay acceptance. Any actual world action requires separate exact-target active-GM consent and independent reread.

The **Stage 12 M1284 manual-login gate** is the current selected runtime boundary; these two cross-product candidate rules are **research/proposals**, not authority to redirect the active build lane or update accepted `main` roadmap/card/KB yet.

## 6. Test and authority receipt

**Performed:** refreshed exact branch/PR state; directly read baseline governance/mission/charter/unification and review proposal; fetched all three complete previously blocked main blobs; parsed stage-card JSON and checked stage order/status/evidence presence; read roadmap's M1284 text and latest stage cards; read complete `main:seed.sql`, `main:database/schema.sql`, all 17 main dated SQL deltas, draft PR #16 root seed and archived companion seed; verified exact ID collisions and noncollisions by text scan.

**Not performed:** actual SQLite schema+baseline+sorted-delta rebuild, `database/verify_database.py`, read-only FTS/source/foreign-key queries on rebuilt DB, native active-slice checker, `npm run check`, validator self-tests, PR #16 failing-test repairs, package/runtime hash attestations, browser/Foundry readback, actual GM login or world changes.

**Authority:** source inspection and review-branch documentation only. No `main`, governed KB, roadmap, active card, PR #7/#16, archived SHA-256 manifest or Foundry target may be promoted or mutated on this receipt.

**Next safe bounded action:** obtain/construct a **disposable, provenance-verified** exact-main execution environment, rebuild and verify SQLite with `schema.sql`, complete `seed.sql`, sorted 17 deltas and read-only source/trial/relationship/FTS queries; run `node tools/check-active-slice.mjs docs/ACTIVE-PROGRAM-SLICE.json` against that exact file. Independently review the possible Stage 11 free-text drift and choose new noncolliding trial identities before preparing two separable review-only promotion patches. Maintain M1284's manual GM rejoin stop and all active-stage, runtime and explicit authorization restrictions. **STOP before acceptance/implementation/world writes.**
