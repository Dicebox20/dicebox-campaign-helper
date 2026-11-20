# DiceBox canonical workflow reconciliation — evidence pass 2

**Date:** 2026-10-12, America/Los_Angeles  
**Work type:** bounded read-only GitHub source/branch/archive audit and review-branch checkpoint  
**Status:** **PARTIAL / STOP AT PROMOTION GATE**  
**Evidence layer:** repository source inspection + archived, labelled local/fixture historical receipts; **no DB rebuild, execution tests, live Foundry readback or mutations**  
**Canonical repository:** `Dicebox20/dicebox-campaign-helper`  
**Accepted main commit (refreshed):** `1137241a7df431a5cc4bc775ab56dcd283e1db29`  
**Review branch:** `reconcile/canonical-workflows-2026-10-12`; starting head `cd5c890a73df214d86dcd908099d304b999b6bc5`, five commits ahead of main at inspection

This checkpoint extends, and does **not supersede or amend**, [START-HERE.md](START-HERE.md), [FILE-SEARCH-PROTOCOL.md](FILE-SEARCH-PROTOCOL.md) and [the review-only proposal](../../docs/proposals/CANONICAL-WORKFLOW-RECONCILIATION-2026-10-12.md). It is a durable evidence receipt, **not accepted governance, KB migration, runtime authority, approval or stage promotion**.

## 1. Ref and authority verification

- GitHub API branch inspection verified `main` remains `1137241a7df431a5cc4bc775ab56dcd283e1db29`.
- PR [#7](https://github.com/Dicebox20/dicebox-campaign-helper/pull/7) remains **open/draft/unmerged**, head `46ad6f8ebacd9de7b5399d6725de49da65522d3b` (Injector 2.0/scene proposal).
- PR [#16](https://github.com/Dicebox20/dicebox-campaign-helper/pull/16) remains **open/draft/unmerged**, head `97556e35f4e93f231d9b9c23527d58273c58c946` (companion archive/onboarding). Its PR description still reports **6 failing assertions across 5 test files**, with 298 files passing and 5 failing, 1,284 total tests; this pass did **not** rerun those tests.
- A recursive Git tree of `main` returned `truncated:false`, **11,889 entries**; PR #16 head returned `truncated:false`, **13,351 entries**. Main's dated `database/seed.d/*.sql` paths count **17** (Oct 6: 4, Oct 7: 5, Oct 9: 8). PR #16 companion archive contains **82** corresponding paths (Oct 6: 4, Oct 8: 74, Oct 9: 4); most Oct 8 content is campaign-scoped rather than project-wide. These are **Git path counts**, not database-row acceptances.
- `main:AGENTS.md` blob `ec6cd9ec46df104c73d8d38654eb39b717699ef9` retains GitHub repository authority and a **20-minute per-turn maximum**, database-first read/accepted-change order, one active slice, exact-GM/world approval, preservation and authoritative reread. PR #16 root `AGENTS.md` blob `8f930497b3d061e048e78d8459a6b59704644892` still references a Windows-local foundation; **main wins**. Archived root `docs/FOREMAN-WORKFLOW-CURRENT.md` and companion copy have *different* blobs; do not conflate them.
- The current source precedence is `main:AGENTS.md` + current accepted ADRs/KB/active card, then exact-runtime receipts, then project-scoped and archived history. Git timestamps, filenames, seed `captured_at`, runtime event dates and import dates are different fields, never inferred to be equivalent.

## 2. Large-file gate reproduced, not waived

The GitHub file reader returned an empty `content` even for requested small **line slices** of these files, with valid Git tree/blob hashes:

| Accepted-main path | Blob SHA | Git tree size |
|---|---|---:|
| `database/seed.sql` | `f59f13522205a2c5dff9a504db71fd95860d250f` | ~30 MB (exact tree value not independently recorded in this pass) |
| `docs/ACTIVE-PROGRAM-SLICE.json` | `d88ac9df752688d4b5414c44e00a66cf3875cf49` | 2,668,232 bytes |
| `docs/DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md` | `83494631647c8f75736933f57c3e6ac3a27ce25b` | 1,603,720 bytes |

The empty response is a **reader limitation**, not file absence. `main:database/build_database.py` blob `be995a719c18f69124e9ca615c8f6541358fa895` specifies lexical `seed.d` application; `database/query_knowledge.py` blob `aedfb03b082325dbf198ce2ef42ac2c4eade40e1` opens SQLite with `mode=ro`. Without a trusted full-source checkout, **current active stage, full baseline decision collision check, complete archived chronology, SQL replay and KB integrity remain UNVERIFIED**. A prior fixture checkpoint says Stage 12 active and Stage 11 partial; that is **not accepted as proof of the current main card**.

## 3. Reconciled chronological chain (scope-aware)

| Event/date | Claim and direct source witness | Current disposition |
|---|---|---|
| 2026-09-19 | Former BTR NPC handoff `beyond-the-realms-bridge/reference/Beyond_the_Realms_NPC_Injector_Reconciliation_Handoff_2026-09-19.md` blob `8901394018a6cb4c59739307ccc60f8b8855cb72` reports **three fresh Engine 1.0 Actor creations**, Engine 2.0/Tharvek not yet exercised. | `HISTORICAL_CARRIED` — requires current runtime verification; not a general Actor Injector promotion. |
| 2026-10-01 | `docs/DICEBOX-CAMPAIGN-HELPER-UNIFICATION-2026-10-01.md` blob `f5b355d0f78d0a2ba2cecd0958a759dc0dbd0c9a`: unified product/repo naming; BTR is a campaign, Dicebox Injector is the subsystem. | `MAIN_ACCEPTED`. |
| 2026-10-05 / Oct 6 SQL | Automated scene pipeline, hardened BUILD one `.md`/one self-contained macro, default `battlemap-120`, sparse discovery; `database/seed.d/2026-10-06-dicebox-scene-workflow.sql` blob `0025700e224a017df569621c58234fdb0d52014d`; `D-2026-10-06-INSPECT-PASS-APPROVES`. | `MAIN_ACCEPTED`. Art final-inspect PASS auto-approves; standalone APPROVE optional. BUILD validator is not a Foundry install. |
| 2026-10-07 | `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md` v2026-10-07.2 blob `43be6afa60295a8522b0fedeade4be7268c36d27` + `database/seed.d/2026-10-07-zzz-rule-conflict-reconciliation-v2.sql` blob `34030e53f5a6f683cf828e9dbf0b0be5e6e35b01`, decisions `D-2026-10-07-RULE-CONFLICT-PRECEDENCE-V2` and `D-2026-10-07-SCENE-SEMANTIC-RENDER-V2`. | `MAIN_ACCEPTED`: PREPARE → overhead grayscale → structural inspect → Feature Manifest/Spatial Blueprint reconcile → paint → final inspect → one-macro BUILD; inspected pixels are proposals until recorded/reconciled. |
| 2026-10-09 | `docs/DICEBOX-GEOMETRY-TOLERANCE-STANDARD-2026-10-09.md` blob `bf071612e2ac17e27aa4e677c9fc0e17ba90efce` and dated SQL blob `11d245ef9b0c5c7c0a246101f8420f18c80380ab`: `D-2026-10-09-GEOMETRY-TOLERANCE-V01`. | `MAIN_ACCEPTED`: actual walkable ground and swept-footprint clearance, width uncertainty, no aesthetic-only automatic REDO; M02 still evidence-blocked. |
| 2026-10-09 | `docs/DICEBOX-IMAGE-PROMPT-CLEAN-RESTART-RULE-2026-10-09.md` blob `0032290f30f11956b57f2681eeefe73ec6dfe81e`, SQL blob `1bb2a113caddffc0ebae8331aa9979f8bb22600e`: `D-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART`. | `MAIN_ACCEPTED`: wholly independent new prompt from approved inputs on retry, not iterative patch; lexical guard not proof of creative independence. |
| 2026-10-09 | Companion `project-archive/companion-workspace-2026-10-12/docs/DICEBOX-PREPARE-TEXT-LAYOUT-RULE-2026-10-09.md` blob `7278c78a06cca22d63c174528cbb470eebb0009d`; archived migration `2026-10-09-prepare-text-layout.sql` blob `9187077630d7f9edc64f6b76c7059824d90beaa3`, source `S-2026-10-09-PREPARE-TEXT-LAYOUT`, fact `F-2026-10-09-PREPARE-TEXT-LAYOUT`, decision `D-2026-10-09-PREPARE-TEXT-LAYOUT` marked `locked`. | `LOCALLY_ACCEPTED_PROMOTION_PENDING`. Mandatory monospaced spatial diagram + cardinal directions, ingress, exits, paths, obstacles, legend and location table; **not** scaled geometry. The same document rejects experimental render v3.1. |
| 2026-10-11 | Migration fixture receipt `outputs/foreman-checkpoints/20261012T044238958Z-mysterious-lodge-all-world-macro-limited-access-20261011.json`, blob `fa0a69769a1bf3464dd5add9a81112bf8cbb6ceb`, claims test-world Macro `LIMITED` and two player execute readbacks after reload; E1 gameplay retest still pending. | `FIXTURE_EVIDENCE`; **not** production/worldwide permission or real gameplay certification. |
| 2026-10-12 | Companion Foreman doc `project-archive/.../docs/FOREMAN-WORKFLOW-CURRENT.md` blob `956297d56979cbe2cc91546d5cdc92a9e91bbefd`, and checkpoint `project-archive/.../outputs/foreman-checkpoints/20261012T073826829Z-region-macro-execution-contract-20261012.json` blob `e05efe14c6770bbee129995d9ca5c02e1567b4d6`. | `LOCALLY_ACCEPTED_PROMOTION_PENDING`; checkpoint is `PARTIAL/STOP/local`, no world write. `everyone=true` is not native Macro execute permission. Require exact Region/event/Macro/user/world and preflight + postinstall + fresh-reload per-user executability, least privilege, preserve GM-only operations. **Trial lineage distinction:** `T-190` = prior exact-world observation; checkpoint reports **new `T-209`** in its local DB and FTS. Neither row independently verified against full source/rebuild here. |

## 4. Five-subsystem implementation/evidence pass

### Map/Scene Injector — `MAIN_ACCEPTED` core + `PROPOSAL` extensions

Direct code/test witnesses present on `main`: `packages/dicebox-compiler/src/spatial-blueprint.ts`, `spatial-projection-plan.ts`, `geometry-tolerance.ts`, `tools/validate-dicebox-build.mjs`, `tools/validate-dicebox-build-self-test.mjs`, and corresponding `tests/spatial-blueprint.test.ts`, `tests/spatial-projection-plan.test.ts`, `tests/geometry-tolerance.test.ts`. The self-test contains examples asserting required one-macro markers, scale and discovery rules. **Existence and source inspection are not a fresh test run.** Oct 7 Feature Manifest contract still calls its machine schema provisional. The M02 attempt-005 physical ground/wall proof and source image availability remain unresolved; painterly BUILD/INJECT blocked for that chain. PR #7 Injector 2.0 proposal remains draft; no historical ZIP, 64px layout or script-in-chat precedent overrides the validated v2 macro format.

### Actor/NPC Injector — `HISTORICAL_CARRIED`, present typed components

`beyond-the-realms-bridge/knowledge/WORKFLOW.md` blob `f2ab4b74d8e3aa3639145654d98ff119adbe62aa` sets the historical order: NPC intent → constrained Manifest → art → balance → runtime/compendium/image resolution → Actor/Items → native Activities/Effects → reread and diagnostics. `CURRENT_STATE.md` blob `cd54405e301e7c18f0d6df6fef3c543ade75f513` explicitly calls Engine 2.0 `PENDING_RUNTIME_TEST`, Engine 1.0 `CARRIED_HANDOFF`. The current repo contains `packages/dicebox-compiler/src/activity-operation-plan.ts` blob `eaf2b3193601d32b72da0a1dd1c1b40c0139adad`, `packages/dicebox-bridge/src/foundry-activity-read.ts` blob `0c7ffe85ab8149ef26a2f84453b6b8aed0d63fbe`, and `tests/activity-operation-plan.test.ts` blob `75edd9561dfbd5b96da9e398ba62bc7fa86bc215`. These typed activity/read surfaces do **not** demonstrate a fully integrated current Actor Injector creation pipeline. Preserve native D&D5e single-owner mechanics, public CRUD, stable IDs, asset hashes and exact-runtime reread.

### Puzzle Matrix — `DESIGN_AND_TEST_INCOMPLETE`

`packages/dicebox-core/src/in-scene-puzzles.ts` blob `e5c00c9d43d651712a603fa0e988c08c2b91ef64` and `tests/in-scene-puzzles.test.ts` blob `4887a09c6a598b4b5302b2572a991bc0c8541588` show deterministic frequency circuit, Tram board, rune sequence and six-station primitives (test source includes fixed six-move Tram expectation). `docs/CAMPAIGN-HELPER-MAP-LAB-PLAN-2026-09-06.md` blob `6babcc322639d71494bad675fa734565e8c7a5a1` explicitly retires Tram from the **active test path**, not source history. Draft branch `docs/CENTRAL-LODGE-PUZZLE-DIRECTIONS-2026-10-12.md` blob `a170278deb5c1e82d3e9ceb507bd76fd1fbcfd05` identifies missing garden configuration, Bell Board order, ritual rhythm, Glass Eye visible result and Reliquary contents; N3 travel/finale and player canaries still uncertain. Do not infer a generic Puzzle Matrix from puzzle-specific examples or invent clues/solutions.

### Desktop application — `MAIN_ACCEPTED_ARCHITECTURE` + `IMPLEMENTATION_PARTIAL`

`docs/ADR-0004-desktop-editor-foundation.md` blob `c07853c184367a4377bba9567280517b619fd558` accepts Tauri 2 + React/TS + PixiJS 8 + Rust service boundaries, with cross-platform WebView acceptance still required. `docs/ADR-0007-ai-and-codex-account-integration.md` blob `41158d5ce5eff5648b03184aa9caacad3169afbf` accepts subscription-primary Codex App Server with explicitly user-selected, separately billed API fallback and AI-offline editor operation; typed no-write Campaign Director proposals are not authority. `apps/campaign-helper-desktop/` holds source, Rust crates/capabilities and generated artifacts. These are not proof of release-grade image-provider enforcement, operating-system coverage or current active stage. The fixture Stage 12 claim is not a substitute for full `ACTIVE-PROGRAM-SLICE.json`.

### Foundry VTT module/connector — `SOURCE_PRESENT` + `RUNTIME_UNVERIFIED`

`packages/dicebox-foundry/module.json` blob `7a541da4633b90a158a3d165c928707f98a71283` declares package `dicebox-campaign-helper`, version `0.1.15`, Foundry minimum 14/verified 14.367, D&D5e minimum/verified 5.3.3. `packages/dicebox-foundry/src/module.js` blob `610d1c73b078e780d0f6cd9c377db9ec229e57ca` is a substantial source module; its cache-query tokens alone are **not** a deployed-version certificate. `src/foundry-live-bridge.js` blob `68e26d4c39bff52e83a97671ea40e858946ea885` describes fixed opt-in loopback operations and rejects arbitrary scripts; `packages/dicebox-bridge/` contains typed Foundry read adapters. PR #16's `docs/REMOTE-FOUNDRY-CONNECTOR-HARDENING-2026-10-07.md` blob `6cc76b39cffddf0c4fe50da671b0ca77b46392a1` and `docs/CHATGPT-FOUNDRY-PLUGIN.md` blob `334c89db9c192ee2107ae4dba0f20ec479add8c9` expressly disclaim live OAuth/plugin/Foundry installation certification. Those documents are **draft-branch-only** at inspection, not accepted main. No live GM/world or player-readback operation was performed.

## 5. Proposed minimum promotion test matrix — NOT RUN / NOT APPROVED

| Candidate | Preflight needed before any `main` change | Local regression needed | Live acceptance boundary |
|---|---|---|---|
| PREPARE schematic | Full main seed decision/source search for ID collisions; current active card/roadmap gate; verify accepted existing PREPARE schema and current skill/validator. | Reject missing diagram/cardinals/exits/paths/legend/location table; accept diagram as schematic only; prevent v3.1 stage adoption; ensure blueprint conflict blocks; regression one-MD/one-macro still passes. | Scene creation canary only when separately selected, art generation approved and exact runtime gates met. |
| Region→Macro permission | Full main seed + archive local seed comparison incl. `T-190` vs claimed `T-209`, source/hash verification, active card; validate Foundry exact API semantics. | Permission-gate test: `everyone=true` + default NONE blocks intended player; intended-player LIMITED grants execute but not OWNER; deny privileged Macro broadening; assert stable IDs, events, no foreign ownership overwrite; verify post-readback/reload. | Exact world/system/active GM and identified player accounts, separate preview/approval, explicit authorized test-world check, postinstall and fresh reload reread. Never use fixture authorization for production. |
| Actor Injector integration | Locate current Actor CRUD/asset/manifest code and all recent KB decisions. | Verify duplicate-match abort, missing compendium/image abort before mutation, idempotent rerun, activity one-mechanical-owner, Actor/item exact API and hash/readback, no raw schema guess. | Fresh exact-runtime create/update with GM authorization and rollback; Engine 2.0 has no carried pass. |
| Puzzle Matrix | Choose and accept general schema/ownership and exact interaction contract; segregate Lodge canon. | Pure deterministic solutions/fail states, evidence locks, no undesired item consumption, idempotence and Region non-reentrance; missing puzzle details fail closed. | Campaign-specific test and independent general Matrix canary; neither implied by Tram tests. |
| Desktop + Foundry | Read current stage and gate proofs; verify module/installer/bridge artifacts and status drift. | Typed adapter + preview/approval/deny/stale-state/readback, exact runtime hashes, source-to-served attestation, AI-offline path, failure recovery, OS shell coverage. | Active-GM/world, loaded module and player canaries; no live claim from build/fixture tests. |

## 6. Test/authority receipt and next safe action

**Performed:** connected GitHub branch/PR status, recursive tree non-truncation, path/blob provenance comparisons, targeted source and test *reading*, and rerun of bounded large-file read attempts. Code search returned no hits for a few default-branch terms; that is **not** evidence of absence (index/branch limits). The project has no verified trusted checkout in this tool session.

**Not performed:** full SQL/SQLite rebuild, FTS/read-only DB queries on a rebuilt instance, full roadmap/active-stage machine-check, `npm run check`, `node tools/validate-dicebox-build.mjs`, installer/runtime tests, browser/player tests, source-to-served hash attestation, or any Foundry/production change.

**Current authorization:** research/document reconciliation only. No canonical rule, governed KB, roadmap, active card, `main`, PR #7/#16, archive digest or runtime was modified by this pass.

**Next safe bounded action:** with a trusted source-capable checkout from exact main commit, read/parse the **full** three large files and query `seed.sql` plus every main `seed.d` for exact IDs, source pointers and supersession; rebuild a disposable KB from schema + seed + sorted deltas; verify/traverse `T-190` and archived claimed `T-209` provenance; run active-slice checker without mutating the project. Only then prepare the narrow separately reviewable PREPARE/Region-Macro promotion patch against the selected stage and run focused tests. Stop if source retrieval, permissions or the stage gate cannot be proven.

**Disposition:** documentation-only checkpoint on the independent review branch; preserve findings and stop before implementation/promotion.
