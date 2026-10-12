# START HERE — next-chat handoff: DiceBox canonical workflows

**Prepared:** October 12, 2026 (America/Los_Angeles)  
**Continuation pass:** [Evidence Pass 2 (2026-10-12)](EVIDENCE-PASS-2-2026-10-12.md) — GitHub ref/PR revalidation, direct source/test witnesses for all five subsystems, trial T-190 vs locally claimed T-209, full-size file read blocker, and next safe source-capable DB/active-slice gate. This is documentation-only and carries **PARTIAL / STOP**. Read it after this handoff and protocol; it does not replace accepted main.  

**Latest continuation:** [Evidence Pass 3 (2026-10-12)](EVIDENCE-PASS-3-2026-10-12.md) — independently reread archived PREPARE and Region→Macro sources, checked all 17 accepted-main dated SQL deltas, verified workflow-check wiring, reproduced large-file/active-card blocker, and stopped before promotion. Documentation-only; read after Pass 2.  

**Current work unit:** Multi-pass workflow reconciliation and durable next-chat transfer  
**Status:** `PARTIAL — DOCUMENTED / STOP` (reconciled source findings, no full DB/active-slice test, no promotion or Foundry work)  
**Repository:** https://github.com/Dicebox20/dicebox-campaign-helper  
**Review branch:** `reconcile/canonical-workflows-2026-10-12` (started from accepted `main`)  
**Accepted main baseline previously observed:** `1137241a7df431a5cc4bc775ab56dcd283e1db29` — **refresh before acting**

## The user's goal

Build permanent, cross-chat **DiceBox Campaign Helper continuity rules** covering the Scene/Map Injector, Actor/NPC Injector, developing Puzzle Matrix, desktop application and Foundry VTT module. **Everything serves the creation and improvement of the DiceBox Campaign Helper product and its accompanying Foundry VTT module.**

The user specifically requested a **much deeper, multiple-pass reconciliation** of latest workflows using *chronological decisions in the reproducible project database* rather than relying on newer filenames. This handoff is to let a replacement conversation resume accurately, locate files, prove source authority, and continue the reconciliation. Do not replace actual investigation with vague summary.

## The next chat must read, in this order

1. `main:AGENTS.md` — **current authoritative repository implementation contract**; includes database-first, accepted-change synchronization, exact-target active-GM/Foundry, and 20-minute per-turn checkpoint gate. Preserve source precedence even when the archived root AGENTS disagrees.
2. `main:PROJECT_CHARTER.md`; `main:docs/PROJECT-MISSION-AND-ORCHESTRATION.md`; `main:docs/DICEBOX-CAMPAIGN-HELPER-UNIFICATION-2026-10-01.md`.
3. [Proposed current-workflow reconciliation](../../docs/proposals/CANONICAL-WORKFLOW-RECONCILIATION-2026-10-12.md) on this **review** branch. It contains the resolved hierarchy, conflict table, exceptions and pending-promotion gates; **it is not accepted governance**.
4. [File search protocol](FILE-SEARCH-PROTOCOL.md) — precise connected-GitHub and local clone search instructions, SQL chronology queries, source vs implementation date rules, large-file handling, and search keywords.
5. PR #16 draft branch `sync/project-data-2026-10-12`: `docs/project-onboarding/audit-2026-10-12/README.md` and linked `CANONICAL-WORKFLOWS.md`, `DATABASE-RECONCILIATION-PASS-2026-10-12.md`, `IMPLEMENTATION-EVIDENCE-PASS-2026-10-12.md`, `CURRENT-WORKFLOW-REGISTER.json`, `SCENE-GRAYSCALE-PIPELINE.md`, and `inventory/` index. All these are navigation/audit evidence, not accepted rules.
6. Accepted scene sources on `main`: `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md`, Oct 5 automated scene/Injector hardening/scale/discovery rules, Oct 9 geometry tolerance and image-prompt clean-restart rules, and `.codex/skills/dicebox-injector-workflow/SKILL.md`.
7. Re-read the **full current** roadmap `docs/DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md`, machine-enforced `docs/ACTIVE-PROGRAM-SLICE.json`, `database/seed.sql` and all applicable `database/seed.d/*.sql` using a **trusted large-file-capable path**. The GitHub file reader returned empty/truncated contents for large files, so this essential gate is **NOT YET VERIFIED**.

## Completed in this work unit

- Established the accepted GitHub-main-first source precedence without silently replacing `main:AGENTS.md`.
- Compared current accepted documents/SQL chronology with draft PR #16 companion archive, draft PR #7, former BTR Actor Injector handoffs, and selected code/tests/fixture records.
- Recovered two **locally accepted, promotion-pending** general workflow requirements:
  1. **Oct 9 PREPARE text layout:** a mandatory monospaced overhead ASCII/Unicode schematic with cardinal directions, ingress/egress, major paths, obstacles, legend and location table, reviewed before map rendering. Source: companion `docs/DICEBOX-PREPARE-TEXT-LAYOUT-RULE-2026-10-09.md`, companion `database/seed.d/2026-10-09-prepare-text-layout.sql`, `D-2026-10-09-PREPARE-TEXT-LAYOUT`. Explicitly **DO NOT** adopt a separate experimental v3.1 render pipeline.
  2. **Oct 12 player Region→Macro permission:** before RegionBehavior player-triggered macro installation, verify exact Region/event, Macro ID, owner/roles and player executability (native `canUserExecute` or equivalent); verify post-install and after a new reload. An `everyone=true` Region behavior flag does not override Macro ownership. No broad OWNER/editor grant or privileged GM macro exposure. Source: archived `docs/FOREMAN-WORKFLOW-CURRENT.md` and `outputs/foreman-checkpoints/20261012T073826829Z-region-macro-execution-contract-20261012.json`, carrying `PARTIAL`/`STOP`; trial `T-190`. **Not yet promoted on main or live-certified**.
- Reconfirmed **accepted current map creation workflow**: PREPARE → mandatory **grayscale overhead structural render** → structural inspection → Feature Manifest/Spatial Blueprint reconciliation → painterly color render → FINAL INSPECT PASS approval → BUILD one Markdown/one self-contained JS macro → STAGE → authorized INJECT → VERIFY → RECEIPT. Later Oct 9 clean-restart and geometry-tolerance rules remain binding.
- Reconciled Actor Injector as historical Engine 1.0 reported-three-creation baseline; Engine 2.0 requires verification. Puzzle Matrix remains incomplete. Desktop architecture accepted, implementation evolving.
- Recorded a documentation-only synthesis on this independent `reconcile/canonical-workflows-2026-10-12` branch in `docs/proposals/CANONICAL-WORKFLOW-RECONCILIATION-2026-10-12.md`.
- Added this handoff and exact search protocol. No source code, governed KB, active card, `main`, archive files, production world, player permissions or runtime data changed.

## Key known chronology

- `main` dated SQL migration paths inspected: **17** (Oct 6: 4, Oct 7: 5, Oct 9: 8).
- Companion archive dated SQL migration paths: **82** (Oct 6: 4, Oct 8: 74, Oct 9: 4). Oct 8 files are largely **campaign-specific** Lodge content/receipts and must not turn into global rules.
- Merged PRs #1–6 and #8–15 establish substantial accepted governance/evidence history. **PR #7** (scene workflow proposal) and **PR #16** (migration) were open drafts at handoff; refresh state.
- PR #16 last reported **six failed tests in five files** and cannot be treated as safely mergeable.
- Oct 9 M02 Attempt 005 geometry source shows local modeled clearance but unresolved actual-wall/ground evidence; painterly BUILD/INJECT explicitly blocked for that map, and missing original art hash must be recovered before pretending it can be independently inspected.
- The `docs/CAMPAIGN-HELPER-MAP-LAB-PLAN-2026-09-06.md` says Tram was retired from the *active test path*. Historical puzzle primitives remain provenance; this does not make a universal Puzzle Matrix implemented.

## Authority boundaries and stop conditions

- This chat **has not** verified a live Bridge Foreman identity. Never copy the companion archive's historically recorded ChatGPT conversation ID or Codex partner as a current live dispatch destination.
- A historical `15-minute` campaign-specific guidance or old self-trigger instructions may not supersede `main`'s accepted **20-minute maximum** and current platform constraints. Do not invent automated recurring work from a historical checkpoint.
- A checkpoint is evidence, not a Git commit, accepted KB decision, active program stage promotion, live Foundry authority or Ready-to-Play result.
- Exact world/system/active GM, preview/approval, preserve foreign state, reread/receipt and stop-on-unknown gates remain mandatory.
- An `APPROVE` named scene command after FINAL_INSPECT PASS is optional redundant acknowledgment, **not** a distinct unfulfilled gate.
- Do not merge, rewrite archive SHA-256 manifests, deduplicate archive content, reset dirty changes, expose secrets, or execute remote world/macro edits while doing document reconciliation.
- Document date and filename dates may be useful search hints, but they do not prove implementation/acceptance dates.

## Next safe bounded action

1. Read the linked protocol and baseline governance, then **re-check PR/branch status**. Determine whether the `main` roadmap, active slice and database have changed.
2. From a trusted clone or a source-capable reader, extract targeted **full** contents of `ACTIVE-PROGRAM-SLICE.json`, the current roadmap boundary and relevant `database/seed.sql` decisions. Run read-only DB query / compare with `seed.d`, and verify that neither locally accepted candidate already exists in a superseding accepted source.
3. Compare the Oct 9 PREPARE and Oct 12 Region→Macro candidate details to the accepted schema/API and existing tests. Form a **minimal separately reviewable promotion proposal** with provenance and regression requirements; do not promote experimental v3.1 or any campaign fixture-specific permission blanket.
4. Only when selected by the accepted active stage and explicitly reconciled via the normal accepted-change workflow: update the roadmap/active card and dated KB source, add targeted docs/code tests, rebuild/verify KB, run relevant tests, and seek a reviewed merge. Runtime permission tests require separate exact-target authorization.
5. Record what was verified vs still unknown, exact branch/SHA/changed paths, check results, blockers and next safe action in the next durable checkpoint.

**If large-file retrieval or a required approval gate is unavailable: STOP with a truthful blocker and the exact file/ID required. Do not use chat memory as a substitute.**

## Copy/paste first message for the next chat

> Continue DiceBox Campaign Helper canonical workflow reconciliation from the GitHub handoff `handoffs/2026-10-12-canonical-workflow-reconciliation/START-HERE.md` on branch `reconcile/canonical-workflows-2026-10-12`. First read `FILE-SEARCH-PROTOCOL.md`, `main:AGENTS.md`, and the proposed `docs/proposals/CANONICAL-WORKFLOW-RECONCILIATION-2026-10-12.md`. Use connected GitHub tools and the reproducible KB chronology, not chat guesses or file-date sorting. Verify current PRs #7/#16, full active slice/roadmap/seed, then reconcile the locally accepted Oct 9 PREPARE schematic and Oct 12 Region→Macro permission rule without promoting experimental v3.1, altering main, or touching Foundry. Report sources, tests/unknowns and a bounded next action.
