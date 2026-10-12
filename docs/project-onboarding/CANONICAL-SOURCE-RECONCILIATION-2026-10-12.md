# Canonical-source reconciliation — 2026-10-12

Status: **reviewed provisional register; not accepted governance or merge authorization**.

Scope: GitHub repository Dicebox20/dicebox-campaign-helper; default branch main, draft PR #16 source branch sync/project-data-2026-10-12, and draft PR #7 workflow proposal. Based on source reads and full recursive file inventories; **not** line-by-line validation of all 12,297 tracked files or all 17 branches.

## Authority register

| Layer | Authority | Boundary |
| --- | --- | --- |
| Current user/platform safety and explicit accepted instructions | Highest applicable instruction | Does not silently relax exact-target, state preservation or approval gates |
| Accepted repository contract | `main:AGENTS.md` plus current accepted ADRs and reconciled decisions | Migration branch AGENTS is older/different; do not promote it |
| Program selection | Current accepted roadmap and `docs/ACTIVE-PROGRAM-SLICE.json` | Must be reread and machine validated before implementation |
| Technical knowledge | Reproducible database from schema/seed with read-only query, accepted provenance and decisions | Database snapshots are not automatically accepted decision migrations |
| Canonical code | Main repository accepted source, schemas, tests and tools | Draft PR branches are proposals |
| Campaign-specific canon | Scoped dossiers and creative canon after provenance/cold-start checks | Does not override product rules or live world state |
| Live Foundry play state | Exact target and active-GM authorized authoritative runtime reread | Repository or fixture receipts do not prove live state |
| Historical evidence | Handoffs, receipts, archives, old chats, snapshots | Evidence only; no implicit promotion |
| Related repositories | Bridge/Regionwright/DMF/Warhammer own their own source | Cross-repo integration only by documented reviewed contract |

## Verified conflicts

1. **AGENTS.md differs materially.** Main says repository AGENTS is canonical and local/cloud workspaces are disposable. Migration AGENTS says an external local Windows foundation AGENTS is authoritative and repository files are a read-only project snapshot. Resolve in favor of main; do not overwrite main governance with the migration snapshot.
2. **Unification document has divergent versions.** Both assert Dicebox Campaign Helper as the unified product. Main has the explicit GitHub-repository-source-of-truth decision; migration version has separate local wording. Keep main baseline and review delta for useful nonconflicting context.
3. **New continuity files exist on migration branch but not main at inspected paths:** docs/FOREMAN-WORKFLOW-CURRENT.md, outputs/LATEST-FOREMAN-CHECKPOINT.json, docs/campaigns/mysterious-lodge/START-HERE.md. Preserve as proposals/records. Verify their referenced scripts, campaign-specific pointers and exact stack before operational adoption.
4. **PR #7 remains a separate draft.** Its scene injector reconciliation is a proposal, not a replacement accepted workflow.
5. **PR #16 remains draft and unmerged.** Its PR description reports passing build but six failing tests in five files; artifact/fixture hashes, served-worker parity, KB summary expectation, tooling-lane contract. Re-run and reconcile before merge.
6. **Archive snapshot does not supersede root canonical files.** Preserve project-archive/companion-workspace-2026-10-12 manifest and SHA-256 relationship; do not bulk move, flatten or deduplicate it.
7. **STATUS.md may contain historical milestone narration.** Use roadmap/active card/latest verified receipts over isolated older status statements.

## Confirmed agreement

PROJECT_CHARTER.md and docs/PROJECT-MISSION-AND-ORCHESTRATION.md inspected content matches on main and migration branch. Project identity: Dicebox Campaign Helper; Dicebox Injector is a subsystem, BTR a campaign; Regionwright is related tooling, not competing canonical authority.

## Acceptance gates before promotion

1. Compare branch against main file-by-file, preserving the newer contract and decision chronology.
2. Resolve the AGENTS and unification conflicts explicitly, with reviewable provenance.
3. Check actual current roadmap, active-slice JSON, accepted ADRs, and database schema/seed; prove reproducible KB queries and verify database.
4. Verify migration archive digest inventory against source bytes, including exclusions.
5. Re-run failing PR #16 tests, investigate failures and re-run the full validation suite.
6. Verify the Lodge cold-start checker and Foreman recovery procedures against available environment before using their pointers.
7. Keep live Foundry/world mutations out of this documentation reconciliation. Do not infer active GM authorization.
8. Only then propose a reviewed merge; do not auto-merge or modify main.

## Workspace migration rule (recommendation; pending user approval)

This ChatGPT project should navigate with docs/project-onboarding/README.md while treating the accepted main contract, current runtime evidence and reproducible knowledge base as authority. Chat memory is convenience context. New project instructions must not silently supersede main governance.

## Evidence constraints

This is a source-priority and known-conflict reconciliation, not a comprehensive semantic audit of every database row, receipt or branch. The migration folder provides orientation only. This file itself has no approval authority.
