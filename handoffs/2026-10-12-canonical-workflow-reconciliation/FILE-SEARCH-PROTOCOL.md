# File search protocol — DiceBox Campaign Helper

**Date authored:** 2026-10-12  
**Audience:** A new ChatGPT/Codex conversation with access to the connected private Dicebox20 GitHub repository, or a trusted local clone.  
**Purpose:** Reproducible discovery of files, newest accepted workflows, database decisions, code, tests and past receipts. Searching does **not** confer authority or authorize a write.

## Rule zero: prove exactly what repository, branch and source you are reading

Canonical repository: \`Dicebox20/dicebox-campaign-helper\`.

Authority is **not** the newest timestamp, the fullest archive, the latest chat or the newest branch. Start with the accepted \`main:AGENTS.md\`, current ADRs, accepted roadmap/active slice, governed reproducible KB and independently verified runtime. Historical/project-scoped material never silently becomes a global rule.

Known branch roles at handoff:
- \`main\`: accepted implementation/governance baseline.
- \`reconcile/canonical-workflows-2026-10-12\`: documentation-only **proposal** created from \`main\`, including \`docs/proposals/CANONICAL-WORKFLOW-RECONCILIATION-2026-10-12.md\` and this handoff.
- \`sync/project-data-2026-10-12\` (draft PR #16): archive and onboarding/audit catalogue, **not merged** as of this handoff.
- \`workflow/scene-injector-reconciliation-20261009\` (draft PR #7): candidate Injector 2.0 reconciliation, **not merged** as of this handoff.

Always refresh branch SHA/PR state at startup; these observations can age.

## Search pass 1 — locate paths, not assumed contents

**With the connected GitHub tools:**
1. Discover available GitHub actions first (in a coding/tool-orchestration environment, filter available tool metadata for names beginning with \`mcp__GitHub__\`; do not guess arguments).
2. Use \`mcp__GitHub__search\` for terms on the **default branch**. Suggested queries: \`D-2026-10-09-PREPARE-TEXT-LAYOUT\`, \`RegionBehavior\`, \`canUserExecute\`, \`scene semantic render\`, \`Actor Injector\`, \`Puzzle Matrix\`, \`ACTIVE-PROGRAM-SLICE\`. Search result fragments locate documents, not definitive evidence.
3. For non-default branches or complete path coverage, fetch recursive Git trees and filter by path *client-side*. Example:
   \`mcp__GitHub__fetch({url:"https://api.github.com/repos/Dicebox20/dicebox-campaign-helper/git/trees/main?recursive=1"})\`
   Repeat for \`sync/project-data-2026-10-12\` and the reconciliation/PR branches as needed. JSON \`tree\` entries give \`path\`, \`type\`, \`sha\` and \`size\`. Verify \`truncated === false\`; if true, descend subtree-by-subtree.
4. Read actual content with \`mcp__GitHub__fetch_file({repository_full_name:"Dicebox20/dicebox-campaign-helper",path:"docs/...",ref:"main"})\`. Supply the **correct ref** explicitly for draft-only/archive paths. For a known small blob SHA, \`mcp__GitHub__fetch_blob\` may verify identity.
5. Use \`mcp__GitHub__search_branches\`, \`search_commits\`, \`search_prs\`, \`get_pr_info\`, \`list_pr_changed_filenames\` or \`fetch_pr_patch\` for chronological evidence and branch proposals.
6. Compare Git **blob SHAs** across branches to distinguish identical content from drift. Preserve exact path and ref in your notes.

**Important:** GitHub code search generally covers the default branch, and many companion files are **only** inside \`project-archive/companion-workspace-2026-10-12/\` on PR #16. A negative default-branch search does not establish absence from the archive.

**With a trusted local clone (optional):**
\`\`\`bash
git fetch --all --prune
git status --short
git branch --all
git ls-tree -r --name-only origin/main | rg -i 'workflow|actor|injector|puzzle|region|desktop'
git ls-tree -r --name-only origin/sync/project-data-2026-10-12 | rg -i '2026-10-09|seed.d|foreman'
rg -n -i 'canUserExecute|PREPARE-TEXT-LAYOUT|STRUCTURAL_INSPECT' docs database/seed.d .codex beyond-the-realms-bridge
git diff --name-status origin/main...origin/sync/project-data-2026-10-12
git log --all --date=iso-strict --format='%H %ad %s' -- docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md
\`\`\`
Run only read-only commands in an unmodified checkout where practical. Do not reset/clean a checkout, change branches over uncommitted work, or infer installed Foundry state from a Git commit. For archive contents, search the archive explicitly:
\`\`\`bash
rg -n -i 'PREPARE-TEXT-LAYOUT|RegionBehavior|Macro execution' project-archive/companion-workspace-2026-10-12/docs project-archive/companion-workspace-2026-10-12/database/seed.d
\`\`\`

## Search pass 2 — follow the *database chronology* carefully

The authorized KB source chain on \`main\` is:
- \`database/schema.sql\`
- \`database/seed.sql\` (large baseline)
- \`database/seed.d/*.sql\` applied in lexical filename order
- \`database/build_database.py\`, \`database/verify_database.py\`
- \`database/query_knowledge.py\` (bounded **read-only** query interface)

Known dated SQL migration comparison at handoff: \`main\` has **17** dated \`database/seed.d/*.sql\` files (Oct 6: 4, Oct 7: 5, Oct 9: 8); the companion archive has **82** paths under \`project-archive/companion-workspace-2026-10-12/database/seed.d/\` (Oct 6: 4, Oct 8: 74, Oct 9: 4). These are path counts, not row-by-row reviewed acceptances. Verify them afresh.

**Search decisions, provenance, trials and blockers, not just filenames.** Start with queries such as:
\`\`\`bash
python database/query_knowledge.py --kind summary
python database/query_knowledge.py --kind decisions --term "scene semantic render" --limit 20
python database/query_knowledge.py --kind decisions --term "image prompt" --limit 20
python database/query_knowledge.py --kind trials --term "Macro" --limit 20
python database/query_knowledge.py --kind facts --term "grayscale" --limit 20
python database/query_knowledge.py --kind blockers --term "geometry" --limit 20
\`\`\`
The query script reads a local SQLite database in \`mode=ro\`; a supplied generated database **may be stale** compared with the SQL source. Before accepting a claim from it, compare schema/seed provenance and, in a safe isolated environment, rebuild/verify with the repository scripts. Consult each script's usage; never run migrations or mutate a user's working database merely to search.

When an exact ID is known, search it in both \`database/seed.sql\` and \`database/seed.d/\`; inspect linked \`kb_sources\` and statuses. Read \`kb_decisions\`, \`kb_facts\`, \`kb_trials\`, \`kb_open_items\`, their \`source_id\` and their referenced source artifact. Record \`accepted/locked\`, \`provisional\`, \`blocked\`, \`superseded\`, or \`historical\` **as stated by the governing source**. Example IDs:
- \`D-2026-10-07-SCENE-SEMANTIC-RENDER-V2\`
- \`D-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART\`
- \`D-2026-10-09-GEOMETRY-TOLERANCE-V01\`
- Archived only so far: \`D-2026-10-09-PREPARE-TEXT-LAYOUT\`
- Archived Region→Macro test lineage: trial \`T-190\`; latest local acceptance claimed by Oct 12 checkpoint, not yet established on main.

A seed row's \`captured_at\` is not necessarily the implementation date. Discriminate:
**event/decision date ≠ document filename date ≠ Git commit date ≠ actual runtime implementation date ≠ later import date**. Preserve all known timestamps separately. Never derive acceptance or supersession solely from lexical ordering.

## Search pass 3 — link workflow to code/tests/native Foundry receipts

Prioritize:
- **Map/Scene Injector**: \`.codex/skills/dicebox-injector-workflow/SKILL.md\`; \`docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md\`; Oct 5 automation/hardening, map/token scale and discoveries; Oct 9 geometry and prompt restart; \`tools/validate-dicebox-build.mjs\`; compiler Spatial Blueprint and geometry tests.
- **Actor/NPC Injector**: \`beyond-the-realms-bridge/knowledge/WORKFLOW.md\`; \`beyond-the-realms-bridge/reference/Beyond_the_Realms_NPC_Injector_Reconciliation_Handoff_2026-09-19.md\`; Actor/Item/Activity compiler and adapters; runtime evidence. Engine 1.0 passed three *carried* fresh-creation cases; Engine 2.0 still pending exact-runtime testing at handoff.
- **Puzzle Matrix**: \`packages/dicebox-core/src/in-scene-puzzles.ts\`, \`tests/in-scene-puzzles.test.ts\`; The Mysterious Lodge \`PUZZLE-ROUTES.md\` and \`CENTRAL-LODGE-PUZZLE-DIRECTIONS-2026-10-12.md\` on draft branch. Incomplete architecture; campaign puzzle success does not establish a general Matrix.
- **Desktop/Foundry module**: \`apps/campaign-helper-desktop/\`, \`packages/dicebox-foundry/\`, \`packages/dicebox-bridge/\`, \`packages/dicebox-scene/\`; ADR-0004/0007; current active slice and exact-stack tests. Prototype/fixture success is not released/live gameplay success.
- **Foreman/Bridge**: current \`main:AGENTS.md\` and \`docs/PROJECT-MISSION-AND-ORCHESTRATION.md\`; archived \`docs/FOREMAN-WORKFLOW-CURRENT.md\` is valuable historical evidence but contains machine-specific paths/old Bridge session IDs. **Do not adopt an old Foreman identity or automatically issue new turns.**

For a change, find: accepted decision → exact source/hashes → implementing files → matching tests → fixture/exact-runtime receipts → postcondition reread. Never label a source change as \`READY\` solely because a file or test exists.

## Search pass 4 — triage large files and archives

GitHub connector sometimes returns **empty contents** for files large enough to exceed its handling limits, even when the Git tree provides a valid blob SHA. Known examples: \`database/seed.sql\` (~30 MB), \`docs/DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md\` (~1.6 MB), \`docs/ACTIVE-PROGRAM-SLICE.json\` (~2.7 MB). **Empty connector output is a read limitation, not an empty/missing file.**

In a verified checkout, inspect only bounded portions using a parser, \`rg\`, \`jq\`, or a targeted script; validate JSON and the active-slice checker without altering state. Preserve source blob hashes. Do not invent the active stage based on checkpoint summaries.

For the full companion workspace, the PR #16 \`project-archive/companion-workspace-2026-10-12/ARCHIVE-MANIFEST.csv\` records separate SHA-256 digests. Git blob hashes are **not** the same as those SHA-256 values. Do not rewrite, move, or deduplicate archived files without a separate explicit migration and digest preservation process.

PR #16 also contains \`docs/project-onboarding/audit-2026-10-12/\` with:
- \`CANONICAL-WORKFLOWS.md\`, \`DATABASE-RECONCILIATION-PASS-2026-10-12.md\`, \`IMPLEMENTATION-EVIDENCE-PASS-2026-10-12.md\`
- \`CURRENT-WORKFLOW-REGISTER.json\`
- \`SCENE-GRAYSCALE-PIPELINE.md\`
- \`inventory/FILES-01.csv\` ... \`FILES-14.csv\`: a **frozen** metadata catalogue; snapshot counts do not include the catalogue files subsequently created. These are audit/navigation tools, not accepted rules.

## Search pass 5 — produce reviewable receipts and stop at boundaries

For each discovered workflow candidate, catalogue:
\`workflow ID | subsystem | scope | event/acceptance date | Git ref/SHA/path | KB decision/source/trial IDs | prior version and supersession | status | code/test paths | evidence layer | runtime exact target and reread status | outstanding blockers | proposed next action\`.

Report **which source wins and why**, and distinguish:
\`MAIN_ACCEPTED\`, \`LOCALLY_ACCEPTED_PROMOTION_PENDING\`, \`HISTORICAL_EVIDENCE\`, \`PROPOSAL\`, \`PROTOTYPE\`, \`INCOMPLETE\`, \`BLOCKED\`.

Before **any** new implementation: consult the accepted roadmap/current active slice + read-only KB; synchronize accepted changes via the governed order and verify the lease/approval. Do not merge a draft, overwrite \`main:AGENTS.md\`, execute any Foundry mutation, change runtime permissions or send a Bridge continuation message merely to finish a catalogue.

The user has imposed a **20-minute maximum per work turn** as accepted in main's Oct 9 governance; leave a truthful source-pinned checkpoint and stop rather than continue without an audit boundary.

## Practical search starter queries

Use term variants and exact symbols:
\`PREPARE_TEXT_LAYOUT\`, \`D-2026-10-09-PREPARE-TEXT-LAYOUT\`, \`structural render\`, \`graybox\`, \`grayscale\`, \`Feature Manifest\`, \`Spatial Blueprint\`, \`PAINT_RENDER\`, \`FINAL_INSPECT\`, \`dicebox-scene-injector-build/v2\`, \`canUserExecute\`, \`everyone=true\`, \`NPC Manifest\`, \`Tharvek\`, \`in-scene-puzzles\`, \`RegionBehavior\`, \`M02 attempt #5\`, \`D-2026-10-07-RULE-CONFLICT-PRECEDENCE-V2\`, \`active program slice\`.

**If a search returns no results:** verify branch scope, case/hyphens, archive prefix, content truncation and blob identity **before** declaring a file nonexistent.
