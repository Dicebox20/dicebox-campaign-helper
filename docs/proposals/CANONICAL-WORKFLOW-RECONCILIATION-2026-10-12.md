# DiceBox Campaign Helper — canonical workflow reconciliation

**Audit/reconciliation date:** 2026-10-12  
**Status:** **REVIEW PROPOSAL ONLY — NOT accepted, merged, operational, or Foundry-authorized**  
**Baseline:** `main` (reviewed head `1137241a7df431a5cc4bc775ab56dcd283e1db29`)  
**Evidence compared:** accepted `main` rules and dated `database/seed.d`, draft PR #7, draft PR #16, and the PR #16 companion snapshot (`project-archive/companion-workspace-2026-10-12/`). The draft archive remains immutable provenance.

## 1. Purpose and single project boundary

**Everything in this project is a contribution toward building and improving the DiceBox Campaign Helper desktop application and its accompanying Foundry VTT module.** The DiceBox Scene/Map Injector, Actor/NPC Injector, developing Puzzle Matrix, assets, campaign tests, bridge, Regionwright, database, validator and Codex/Foreman workflows are subsystems or evidence lanes, not competing projects.

- Product: **DiceBox Campaign Helper**.
- DiceBox Injector: scene/Foundry compilation and deployment subsystem; BTR Injector is a historical name.
- Beyond the Realms and The Mysterious Lodge: **campaign content**, not separate product authority.
- Historical external tools/related repositories have their own source; integration must be reviewed and versioned.
- Chat memory, a local Windows workstation, old sessions, an external coordination mirror and snapshots never outrank accepted GitHub governance.

## 2. Source-of-truth and multi-pass method

1. **Authority pass:** `main:AGENTS.md`, current ADRs, project charter, accepted development workflow and product unification.
2. **Knowledge chronology pass:** all 17 dated SQL migrations tracked on `main` (4 Oct 6, 5 Oct 7, 8 Oct 9); contrast 82 `database/seed.d/*.sql` files in the archived companion workspace (74 dated Oct 8, 4 dated Oct 9, 4 dated Oct 6). Accept `main` decisions as baseline. Archived dates or SQL labels alone do not imply merging, active authority or deployment.
3. **Runtime/implementation pass:** relevant `apps/`, `packages/`, `tools/`, `tests/`, Foundry evidence/handoffs; distinguish tested pure functions and local fixture receipts from current authenticated runtime/players.
4. **Proposal/commit pass:** merged PRs #1–6 and #8–15 vs **unmerged PR #7** (Injector proposal) and **unmerged PR #16** (workspace sync). The latter reports six failing tests and must not be treated as an accepted update.
5. **Conflict pass:** assign scope, time, canonical source, supersession and blockers; do not replace a newer accepted narrow rule with an older generic template.
6. **Promotion pass:** propose a bounded reviewed change only after checking roadmap/active card, DB rebuild/read-only query, tests, actual runtime where appropriate, and independent provenance review.

**Important limitation:** the connector could not read the complete ~30 MB `database/seed.sql`, ~2.7 MB active program slice or ~1.6 MB roadmap. This proposal cannot certify the active stage, full DB replay or that no more recent decision exists inside those large files. A trusted checkout / bounded parser is needed before actual promotion.

## 3. Reconciled latest *accepted on main* workflow chain

| Date / version | Global or narrow scope | Canonical accepted source | Normative effect |
|---|---|---|---|
| 2026-10-09 | All work turns | `docs/DICEBOX-20-MINUTE-TURN-CAP-2026-10-09.md` + main AGENTS | At most 20 minutes elapsed per user work turn, verified durable checkpoint, stop on unknown outcome. A campaign's stricter bounded sub-task can be compatible; old 15-min guidance never permits exceeding this global cap. |
| 2026-10-09 | Every DiceBox image | `docs/DICEBOX-IMAGE-PROMPT-CLEAN-RESTART-RULE-2026-10-09.md` | Failed/rejected generation: immutable archive, entirely fresh prompt/approach from accepted inputs; do not patch, paraphrase, edit or pass failed image as provider input. Approved graybox may be reused for painterly-stage restart. |
| 2026-10-09 | Map geometry & inspection | `docs/DICEBOX-GEOMETRY-TOLERANCE-STANDARD-2026-10-09.md` | Judge actual ground and route-specific token clearance rather than nominal painted path width; measure uncertainty; no automatic REDO from aesthetic band alone. |
| 2026-10-07 | Project data intake/chronology | `docs/PROJECT-DATA-ARCHITECTURE-2026-10-07.md`, `docs/NEW-DATA-IMPLEMENTATION-RULE-2026-10-07.md` | Capture → classify → reconcile → catalogue → validate input → implement → reread/test → receipt → close/carry forward; repository reproducible KB is authoritative. |
| 2026-10-07.2 | Map structural & painted rendering | `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md` and merged rule-conflict SQL | Mandatory grayscale overhead structural render → structural inspect → Feature Manifest/Spatial Blueprint reconciliation → painterly color render → final inspect. **Only final PASS approves art**. Pixels alone do not own geometry. |
| 2026-10-05 | Map/Scene automation | `docs/DICEBOX-AUTOMATED-SCENE-WORKFLOW-2026-10-05.md` | PREPARE → RENDER → INSPECT(PASS=APPROVED/REDO) → BUILD → STAGE → INJECT → VERIFY → RECEIPT. Approved renderer identity and state/receipt are durable. |
| 2026-10-05 | Scene BUILD transport | `docs/DICEBOX-INJECTOR-WORKFLOW-HARDENING-2026-10-05.md` and `.codex/skills/dicebox-injector-workflow/` | Exactly one `.md` with one self-contained JavaScript macro; validate deterministic packaging, use locked art/semantic inputs, fail closed instead of ZIP/split macros. |
| 2026-10-05 | Default battlemap geometry/scale | `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md` | Default `battlemap-120`: gridless, 120 pixels per logical 5 ft, PREPARE-owned dimensions; Actor/system-owned token footprint, not altered to repair scene dimensions. |
| 2026-10-05 | Discoveries | `docs/DICEBOX-EXPLORATION-DISCOVERY-STANDARD-2026-10-05.md` | Sparse anchored discovery; NOTICE → INTERPRET/SEARCH → RECOVER, scoped one-attempt/anti-farming protections. |
| 2026-10-01 | Project unification | `docs/DICEBOX-CAMPAIGN-HELPER-UNIFICATION-2026-10-01.md` | Canonical product and GitHub repository, not a Windows foundation repo or older BTR injector chat. |
| v2026-08-26.3 | Program development / Foreman and Workers | `docs/CAMPAIGN-HELPER-DEVELOPMENT-WORKFLOW-2026-08-26.md`, `docs/CODEX-WORKFLOW-RULES-2026-08-22.md`, `docs/PROJECT-MISSION-AND-ORCHESTRATION.md` | One active accepted stage/outcome, explicit bounded worker, KB-first consult, exact scope/preview/approval, reread, blocker-based receipt, recovery, one writer. |
| 2026-08-24 ADR | Desktop AI/provider integration | `docs/ADR-0007-ai-and-codex-account-integration.md` | Campaign Director proposes typed no-write operations; Codex technical builder is scoped; deterministic app owns changes; subscription-primary Codex App Server, explicit separately billed API backup, AI-offline support. |
| Accepted ADR-0004 | Desktop app architecture | `docs/ADR-0004-desktop-editor-foundation.md` | Tauri 2 + React/TypeScript + PixiJS 8 + Rust local services, renderer-neutral semantic Scene model; prototype/release testing still required. |

These are *composable, scope-specific* sources. They are not interchangeable document versions. For example a map's final inspection and Injector macro validation are separate gates; neither claims live installation or gameplay verification.

## 4. Recovered locally accepted decisions missing from main

### A. October 9 — map PREPARE text diagram

**Provenance:** Companion `docs/DICEBOX-PREPARE-TEXT-LAYOUT-RULE-2026-10-09.md` and `database/seed.d/2026-10-09-prepare-text-layout.sql`, decision `D-2026-10-09-PREPARE-TEXT-LAYOUT` with local `locked` status.

**Reconciliation:** An accepted PREPARE packet includes a monospaced top-down ASCII/Unicode spatial sketch, cardinal directions, ingress/egress, intended routes/branches, important obstacles/features and applicable resource areas, **plus a legend and location table**, reviewed before art. Keep the sketch with the map package for graybox/manifest checks. It is schematic, not exact World coordinates. The authoritative Spatial Blueprint wins conflicts. **Do not promote the separate experimental v3.1 rendering workflow; the archived decision expressly rejected its adoption.**

**Promotion state:** `LOCALLY_ACCEPTED / MAIN_PROMOTION_PENDING`. Requires harmonized current-scene-skill and normative PREPARE additions, dated reproducible KB delta, roadmap/active-card sync, deterministic tests and readback. The present reconciliation proposal **does not perform promotion**.

### B. October 12 — player-triggered Region→Macro execution-permission safety

**Provenance:** Archived `docs/FOREMAN-WORKFLOW-CURRENT.md`; work receipt `outputs/foreman-checkpoints/20261012T073826829Z-region-macro-execution-contract-20261012.json`; local reported KB rebuild and trial `T-190`. The latter receipt is `PARTIAL` / `STOP`, reports no Foundry mutation, and should not itself be treated as accepted GitHub authority.

**Reconciliation:** Before enabling a player-triggerable RegionBehavior calling a Macro, verify exact world/system/active-GM binding; Region, event, enabled state, linked Macro ID, Macro ownership, intended player accounts and native `canUserExecute(user)` or exact-runtime equivalent. A Region `everyone=true` is *not* Macro execute permission. Use least privilege; broad default `LIMITED` may be appropriate for a nonprivileged intended-player Macro, but do not blindly escalate `OWNER`/edit or expose GM-only code. Prefer GM-authorized typed adapter for privileged work. Reinspect the Macro/Region bindings and actual player executability **after installation and after fresh reload**. Executability does not prove safety or gameplay.

**Promotion state:** `LOCALLY_ACCEPTED / MAIN_PROMOTION_PENDING`. Requires explicit independent authorization/compatibility check, KB decision/provenance, exact-runtime tests, accepted roadmap/active-card sync and review. Preserve the original `PARTIAL` label and no-write boundary.

## 5. Resolved scope conflicts / nonpromotions

| Apparent conflict | Resolution |
|---|---|
| PR #16 `AGENTS.md` says Windows-local foundation is authoritative; current `main:AGENTS.md` says GitHub repository | **MAIN WINS.** Do not copy draft root AGENTS over main. |
| Experimental `v3.1` art workflow vs Oct 7 canonical grayscale semantics | **Not adopted.** PREPARE schematic is separable; use v2026-10-07.2 creative rendition with later accepted Oct 9 overlays. |
| PR #7 Injector 2.0 reconciled packaging proposal vs established one-MD/one-macro validator | **Proposal only.** Keep accepted transport; promotion requires tests and KB changes. |
| Central Lodge Scene `grid.size` 320/240/other fixes vs new-map `battlemap-120` | **Different scopes.** Exact authored legacy campaign calibration stays campaign-specific, not new default. |
| Older M02 painted/Ready assertions vs 2026-10-09 latest M02-005 v003 KB handoff | **M02 still blocked.** Pure clearance models pass but actual-ground/wall confidence and source image access were not proven; painterly/BUILD/INJECT not authorized for that evidence chain. |
| Archived Foreman automatic per-turn Bridge-partner trigger and local PC paths vs general project chat | **Do not globally promote.** Only in a positively verified current Bridge Foreman session with existing delegation/dispatch authority; no general background task or unverified partner replay. |
| 2026-10-11 limited Macro permission fix in disposable `dbx-test-world` vs broader campaign/prod authorization | **Fixture only.** Source/readback evidence does not grant player macro execution to other worlds or prove safe mechanics. |
| Foundry/macro transport return vs live world state | **Separate evidence planes.** Exact active-GM/target, approval, reread/receipt always required. |

## 6. Actor, Puzzle Matrix and desktop scope

**Actor Injector:** The latest clearly documented former BTR workflow is `NPC concept → constrained NPC Manifest → token art phase → balance → runtime preflight → compendium resolve → image resolve → Actor core → cloned Items → supported mechanics → native Activities/Effects → reread → diagnostics` in `beyond-the-realms-bridge/knowledge/WORKFLOW.md`. Sept 19 handoff carries three Actor create PASS reports for Engine 1.0; Engine 2.0/Tharvek Alpha is explicitly pending runtime. These are historical **carried** results, not acceptance of a globally integrated new Actor Injector. Preserve public Foundry CRUD and native D&D5e mechanical ownership (no duplicate damage/effects/resource consumption). Current code, stable IDs, idempotence, privileges and runtime must be independently tested.

**Puzzle Matrix:** `packages/dicebox-core/src/in-scene-puzzles.ts` and its tests prove bounded puzzle primitives exist, not a complete matrix platform. Mysterious Lodge clue chains, Regions, scripts and the Oct 12 directions are campaign-specific drafts/fixtures with acknowledged incomplete puzzles. Mark `DESIGN_AND_TEST_INCOMPLETE`; do not invent missing solutions, consume items or claim a fully installed matrix.

**Desktop app/Foundry module:** ADR-0004/0007 architecture is accepted, and `apps/campaign-helper-desktop/` plus `packages/dicebox-foundry/`, compiler/bridge packages and Map Lab provide source and local test surfaces. `docs/REMOTE-FOUNDRY-CONNECTOR-HARDENING-2026-10-07.md` reports focused local connector tests; its `CHATGPT-FOUNDRY-PLUGIN.md` explicitly does **not** certify a configured OAuth provider, live plugin, active browser or actual world mutation. No global alpha/release/Ready-to-Play claim may flow from these tests. `docs/CAMPAIGN-HELPER-MAP-LAB-PLAN-2026-09-06.md` retires Tram as active release/test path; historical Tram puzzle logic stays evidence only.

## 7. Promotion gates and next exact work

1. Read and machine-check the **full** roadmap and `docs/ACTIVE-PROGRAM-SLICE.json` from a trustworthy clone/local bounded parser. The connector's large-file reader did not return complete data. **Do not guess stage selection.**
2. Query the accepted read-only KB and reconcile the candidate decisions with large `database/seed.sql` and current dated migrations, detecting duplicate IDs/provenance first.
3. Build the smallest reviewed change: candidate PREPARE schematic + Region-Macro permission rule, with targeted docs/validator/test additions and narrow chronological SQL delta. Preserve supersession and source IDs.
4. Rebuild via `database/build_database.py`, run `database/verify_database.py`, FTS queries and `npm run check`. Resolve PR #16's reported failures separately rather than masking them.
5. Require exact Foundry/GM player-account canaries for the Region permission check; no live write is authorized by this proposal.
6. Advance roadmap/active card and KB according to accepted-change gate; only then seek reviewed merge and later mirror ChatGPT Project Instructions as a separate platform setting.

**This reconciliation makes source choices explicit, not runtime guarantees.** All source files and historical manifests are preserved untouched. No proposal, archive or report is automatically adopted into main just because it has a later date.
