# DiceBox canonical workflow reconciliation — evidence pass 3

**Date:** 2026-10-12, America/Los_Angeles  
**Work type:** connected-GitHub, bounded read-only source verification; independent documentation checkpoint  
**Status:** **PARTIAL / STOP AT PROMOTION GATE**  
**Evidence layer:** GitHub branch/ref, direct text/SQL/source inspection and failed large-file retrieval. **No database rebuild, tests, world operations, or accepted-rule promotion.**

This is an additive continuation of [START-HERE.md](START-HERE.md), [FILE-SEARCH-PROTOCOL.md](FILE-SEARCH-PROTOCOL.md), [Evidence Pass 2](EVIDENCE-PASS-2-2026-10-12.md) and the review-only [canonical reconciliation proposal](../../docs/proposals/CANONICAL-WORKFLOW-RECONCILIATION-2026-10-12.md). It does **not** supersede accepted `main`, authorize a Foundry action, or certify any deployment.

## Exact refs refreshed

- Repository: `Dicebox20/dicebox-campaign-helper`.
- Accepted `main` observed via the GitHub branch API: `1137241a7df431a5cc4bc775ab56dcd283e1db29`.
- Review branch observed before writing this checkpoint: `9fdbda4bc35a4bd27cac585d129a243f54a49629`, **seven commits ahead and zero behind** `main` at comparison. Refresh before subsequent actions.
- `main:AGENTS.md` direct blob `ec6cd9ec46df104c73d8d38654eb39b717699ef9` remains binding. The review-branch charter is `PROPOSED / REVIEW REQUIRED`, blob `152d1a9f1bb1dc099b107c138e8aa7a1800fa689`.
- PR #7: open/draft/unmerged, head `46ad6f8ebacd9de7b5399d6725de49da65522d3b`.
- PR #16: open/draft/unmerged, head `97556e35f4e93f231d9b9c23527d58273c58c946`; its description still reports **six failures in five test files**. Tests were not rerun.

## Direct source confirmation of pending candidates

### PREPARE schematic — locally accepted; main promotion pending

Companion archived document `project-archive/companion-workspace-2026-10-12/docs/DICEBOX-PREPARE-TEXT-LAYOUT-RULE-2026-10-09.md` on `sync/project-data-2026-10-12`, blob `7278c78a06cca22d63c174528cbb470eebb0009d`, explicitly says user-approved permanent rule **for map PREPARE only**; experimental v3.1 art stages were **not** promoted.

The companion SQL `project-archive/companion-workspace-2026-10-12/database/seed.d/2026-10-09-prepare-text-layout.sql`, blob `9187077630d7f9edc64f6b76c7059824d90beaa3`, declares exact IDs `S-2026-10-09-PREPARE-TEXT-LAYOUT`, `F-2026-10-09-PREPARE-TEXT-LAYOUT` and `D-2026-10-09-PREPARE-TEXT-LAYOUT`, with local fact/decision `locked`. That status belongs to the **archived local KB**, not accepted main.

The text diagram is **top-down, monospaced, cardinal-marked**, with ingress/egress, routes and branches, obstacles/landmarks, applicable resource areas, **legend and location table**. It must be reviewed before rendering and retained in PREPARE. It is **not scaled wall geometry**. Resolve discrepancies in favor of the authoritative Spatial Blueprint; map-art prompts receive only visible map features, not cross-scene destinations or mechanics.

`main:docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md` blob `43be6afa60295a8522b0fedeade4be7268c36d27` continues to mandate grayscale structural render + inspection/Feature Manifest reconciliation, followed by painterly render and **FINAL_INSPECT PASS**. `main:.codex/skills/dicebox-injector-workflow/SKILL.md` blob `03793a72d61e1ea5bdea36e72f36603fcae0781b` keeps the one Markdown/one self-contained JavaScript macro BUILD. A diagram promotion must add to, not replace, those existing gates.

### Region→Macro permission — local checkpoint only; main promotion pending

The companion `docs/FOREMAN-WORKFLOW-CURRENT.md` archive blob `956297d56979cbe2cc91546d5cdc92a9e91bbefd` directly documents preflight for exact RegionBehavior/event/enabled state, Macro ID, world/system, intended players and native executable permission, plus **post-install and fresh-reload** reread. `everyone=true` on a Region does **not** override Macro permissions. LIMITED/default ownership is described as the minimum broad **nonprivileged player-facing** permission unless per-user rules cover all intended/future players; never elevate to OWNER/editor merely to unblock execution or expose GM-privileged code.

The checkpoint `project-archive/companion-workspace-2026-10-12/outputs/foreman-checkpoints/20261012T073826829Z-region-macro-execution-contract-20261012.json`, blob `e05efe14c6770bbee129995d9ca5c02e1567b4d6`, states `status: PARTIAL`, `continuation: STOP`, `evidenceLayer: local` and **no Foundry mutation**. It reports a local SQLite rebuild with 435 sources, 1,209 facts, 479 decisions, **209 trials** and 548 open items, and a new `T-209`. This is a **reported local result**, not independent full SQL/SQLite replay. `T-190` is a separate historical exact-world trial; do not conflate the records or their scope.

`main:packages/dicebox-foundry/src/module.js` blob `610d1c73b078e780d0f6cd9c377db9ec229e57ca` exposes **static Region/RegionBehavior API evidence** and expressly says subtype schema, event behavior, permissions, authority and readback are unproven by that surface inspection. Do not claim the current module independently establishes player Macro execution or that the archived local Foreman policy has been enforced in runtime.

## Database and stage blocker reproduced

A complete, non-truncated recursive `main` Git tree gives **17** dated `database/seed.d/*.sql` paths. All **17** were fetched directly in this pass (including the larger central-Lodge SQL deltas). Exact textual searches within those files found **no** `D-2026-10-09-PREPARE-TEXT-LAYOUT`, `T-209`, `REGION-MACRO`, `canUserExecute` or `PREPARE_TEXT_LAYOUT` strings. This is only a **bounded negative search of main's dated deltas**, **not** proof of absence or collision freedom in the large baseline `main:database/seed.sql` or other source families.

`main:package.json` blob `460096d7551dbb6f5236ed81bb09307793550354` wires `workflow:check` to `node tools/check-active-slice.mjs docs/ACTIVE-PROGRAM-SLICE.json`; `check:full` chains workflow checks and normal build/tests. The checker source blob is `cf4763aefebacff557d6661ff4252fe491ccda73`; the test `tests/active-slice-workflow.test.ts` blob `c981fe296daada6403d1ebd047ff0dbef1b249b7` reads the program card. These are **source confirmations, not executed check results**.

The GitHub `fetch_file` reader again returned **empty content** for bounded initial line slices of `docs/ACTIVE-PROGRAM-SLICE.json` (blob `d88ac9df752688d4b5414c44e00a66cf3875cf49`) and `database/seed.sql` (blob `f59f13522205a2c5dff9a504db71fd95860d250f`). Direct `raw.githubusercontent.com` retrieval through the connected GitHub reader returned `INVALID_ARGUMENT / file may be too large` for both the active card and the large roadmap `docs/DICEBOX-CAMPAIGN-HELPER-ROADMAP-2026-08-23.md` (blob `83494631647c8f75736933f57c3e6ac3a27ce25b`). An unauthenticated container-side Git probe failed because `github.com` could not resolve; no trusted full checkout was established.

**Accordingly, active stage, full baseline ID collisions, lexical SQL replay, KB verification and full roadmap gate remain UNVERIFIED.** Do not infer Stage 12 or promotion permission from a fixture/README, and do not promote either candidate while these checks remain blocked.

## Five-subsystem carry-forward status

- **Scene/Map Injector:** Accepted main v2 semantic and single-macro rules remain in force; the PREPARE diagram is a narrow local candidate, not experimental v3.1 adoption. M02-005 geometry/actual-ground proof remains blocked.
- **Actor/NPC Injector:** September 19 Engine 1.0 three-Actor success remains historical carried evidence; Engine 2.0 and full current product integration have no verified fresh runtime pass.
- **Puzzle Matrix:** Bounded deterministic primitives and campaign examples are not a completed general Matrix schema, implemented module contract or player canary.
- **Desktop:** Accepted ADR boundaries and application source do not prove full image-provider safety, OS release coverage or current program stage.
- **Foundry module:** Static capability/module evidence and local disposable fixture receipts are distinct from authenticated active-GM, player execution, post-reload and production-readback acceptance.

## Validation / authorization / next action

**Performed:** live GitHub ref/PR check, direct candidate documents + SQL + local receipt reread, `main` skill/scene workflow/module/checker/test/package inspection, all 17 dated main SQL reads and bounded ID searches, renewed large-file route attempts.

**Not performed:** local checkout, SQL/SQLite rebuild, full-source collision scan, `workflow:check`, `npm run check`, scene build validator, any current module install, Foundry runtime operation, player permission readback or promotion patch.

**Authority:** research and review-branch documentation only; no accepted `main`, KB source, active card, PR #7/#16, archive manifest or Foundry world modification.

**Next safe action:** obtain a trusted exact-`main` checkout/large-file-capable reader, parse the active program card and roadmap, inspect `seed.sql` plus all 17 deltas, rebuild/verify a disposable KB and independently resolve archived `T-190`/`T-209` lineage. Run the read-only active-slice checker. Then prepare *separately reviewable*, narrow PREPARE and Region-Macro candidate patches only if the accepted stage and evidence support them; do not enable or alter player macros without an authorized exact-target test. **STOP** if retrieval, active stage, KB provenance or world authority cannot be proven.
