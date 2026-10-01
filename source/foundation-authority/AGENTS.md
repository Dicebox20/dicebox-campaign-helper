# DiceBox Campaign Helper Codex Contract

## Authority and scope

Use the local SQLite knowledge base and its provenance fields as the working index. Source precedence is:

1. this contract;
2. the Campaign Assistant Master Control and canonical invariants;
3. current DiceBox ADRs and schemas;
4. current exact-stack runtime evidence;
5. project dossiers and research artifacts;
6. historical conversations and community examples.

Never silently merge a conflict. Add a reconciliation record and identify which fact remains active.

## Database-first pipeline rule

The reproducible knowledge base is the governing control plane for every task DiceBox Campaign Helper specializes in, as well as for its pipelines and work routines. Before planning, creating, importing, compiling, adapting, or materially changing a JournalEntry or page, Actor, Item, Scene or map, Spatial Blueprint, Tile, Wall, door anchor, Region, RegionBehavior, Macro, teleport, puzzle, campaign package, module asset, adapter, harness routine, installation workflow, or recurring development procedure, query the local database using its approved read-only query surface and inspect the applicable sources, facts, decisions, trials, open items, and canonical schemas. Reuse an existing routine when it covers the need; if a new routine is justified, record its purpose, inputs, authority boundary, owner, provenance, evidence receipt, failure/recovery behavior, and open risks in `database/seed.sql` before implementation. Rebuild and verify the database from `database/schema.sql` and `database/seed.sql` after that change. A database conflict blocks invention until an explicit reconciliation identifies the active rule; historical conversation or community examples cannot override the database silently.

## General Codex/DiceBox AI rule for every chat

This operating model applies to every current and future DiceBox Campaign Helper chat and task. Codex repository work and the planned DiceBox Campaign Helper AI must share the bounded evidence loop:

`understand → consult → reconcile → plan → validate → preview → approve → execute → reread → recover → record`

Codex must load the applicable instruction chain, query the read-only knowledge base before specialized work, respect source precedence, make the narrowest reversible change, verify it, review the resulting diff, and report evidence, blockers, and unknowns. The planned in-world AI must classify requests as explain, inspect, plan/preview, or execute/recover; treat model output and player requests as untrusted intent; require current active-GM authority and exact runtime gates for mutation; use only versioned narrow adapters; reread before commit; preserve unknown, foreign, and runtime-owned state; and emit blocker-based receipts. A player request, AI response, API existence, test pass, or successful transport response never grants Foundry authority or proves committed state.

When this rule is added or materially changed, active DiceBox Campaign Helper tasks must receive a concise handoff message so their next turn applies the same model. This communication does not override a task's more authoritative local contract or silently authorize live mutation.

## Standing Campaign Helper development authorization

This rule applies to every current and future DiceBox Campaign Helper task and chat. The user grants standing permission to use any available tools and this machine for project-scoped development, code and document changes, testing, validation, local process and browser control, automation, runtime inspection, troubleshooting, and safe acquisition of project-relevant tools needed to complete the Campaign Helper roadmap and checklist. Ordinary in-scope work may proceed without repeatedly requesting the same approval, including diagnosing and recovering blockers with the project's bounded evidence loop. Tool acquisition must use trustworthy sources, remain project-relevant, avoid unapproved spending or account commitments, and retain rollback/provenance evidence.

This standing permission does not waive platform policy or broaden the project target. Continue to resolve exact targets, preserve user and foreign state, use recoverable operations where practical, protect secrets, reread outcome-unknown operations before retry, and follow the accepted-change, active-slice, and database-first gates. Separate explicit authority is still required when a specific action would publish externally, alter an external account or billing/spending state, disclose credentials, perform an unrelated or materially destructive machine action, or mutate Foundry without the exact current active-GM and runtime gates. Player-role passwords must remain blank; do not generate, assign, or persist them.

## Accepted-change synchronization gate

Every accepted project change is recorded immediately in the local roadmap and active checklist. One or more compatible accepted changes may then form an explicit implementation bundle; that bundle must pass this persistent control-plane order before implementation:

`accepted change → roadmap and active checklist → KB reconciliation/rebuild/verification → implementation → scheduled shared-document mirror`

The shared idea document is the exact ChatGPT-side communication target: `https://docs.google.com/document/d/14clSbMu2QMqvokg6Y8svG-QcjSqpse-rO73z66muA7o/edit` (document ID `14clSbMu2QMqvokg6Y8svG-QcjSqpse-rO73z66muA7o`, Tab 1). Record the accepted bundle and impact in the roadmap and active checklist first, reconcile conflicts and superseded guidance into `database/seed.sql`, rebuild from `database/schema.sql` plus `database/seed.sql`, and verify before implementation. The shared document is a required communication record at scheduled or explicit coordination boundaries, but its routine timing never blocks local planning, accepted-bundle selection, KB reconciliation, implementation, validation, reread, recovery, or closure. Routine document updates remain batch-bound: at most one acceptance or closure/handoff update per local work session and no more than one routine update in 24 hours; combine compatible updates when possible. An explicit user request, a material ChatGPT-side coordination blocker, or a release/handoff boundary may override timing. Read-only inspection, bounded research, and emergency containment may occur before the gate, but they may not silently become implementation. After implementation, reread authoritative state, recover unknown outcomes, and record the receipt.

## Mission and Foreman/Worker orchestration

The project mission and the normative single-Foreman, bounded-Worker, receipt, promotion, and clean-boundary handoff rules are maintained in the project document `docs/PROJECT-MISSION-AND-ORCHESTRATION.md` and mirrored in the bundled project snapshot. Every task must either advance a named DiceBox deliverable, produce reusable evidence, or reduce a documented blocker. Workers do not create competing goals or authority; the Foreman reviews and records every result, and successful isolated work is reintegrated only after provenance, compatibility, authority, safety, and reproducibility review.

Worker model-routing rule: use bounded Workers liberally for cleanly separable Campaign Helper assignments whenever doing so advances a named deliverable without delaying the critical path. Configure each Worker with the task-appropriate model from the approved capability/efficiency chart; do not silently substitute Luna Extra High where a different routed model is available and fits the assignment. Keep Worker scopes disjoint, preserve the single Foreman authority, review the compact receipt, and close the Worker after review; if hidden-worker or model selection is unavailable, record that limitation and continue only with the safest available Foreman path.

Optional isolated-workspace rule: the Foreman may use a separate Codex worktree or project-local disposable workspace for a bounded Worker assignment, risky build, or verification run when isolation materially reduces overlapping edits, build-artifact collisions, runtime-state interference, or evidence ambiguity. It is never mandatory and never creates a second authority plane. Start from an identified source state; preserve user and foreign files; exclude shared live-runtime control unless separately authorized; return one compact receipt with source state, changed paths, provenance, validation, blockers, and recovery disposition; and require clean-boundary Foreman review before promotion. An isolated workspace cannot bypass the accepted-change synchronization gate, grant Foundry authority, auto-promote results, conceal or overwrite conflicting edits, or create a competing project goal. The roadmap, active card, shared idea document, reproducible KB, source repository, and runtime retain their existing authority.

## Outcome-first efficiency rule

Keep one user-visible active outcome with a compact change card: acceptance observation, owner, exact target and authority, allowed scope, deterministic check, live check where needed, and stop/recovery condition. At most one build, one live, and one research/recovery item are active; the remaining ledger is parked. Workers have disjoint artifact or evidence scopes and return one compact receipt; the Foreman alone integrates results and authorizes live work. Label results strictly as research, local, staged, fixture, Ballad, or player-accepted—no layer implies a later one. On the second failure of the same runtime class, stop retries and new repair transports, query the KB, conduct bounded research only if needed, reduce the issue to a reproduction, and validate the narrow fix before another live attempt. Status-only checks do not create standalone KB records. The repository postmortem is `docs/CODEX-OPERATING-MODEL-POSTMORTEM-2026-08-22.md`.

When a repository provides a machine-readable active-slice card, run its read-only workflow check before selecting implementation work and after advancing a gate. Exactly one ordered acceptance stage may be active; completed stages require direct evidence and later stages remain pending. A second same-class failure stops live retries until a bounded reproduction and locally validated fix are recorded. The checker enforces execution order only and never certifies product behavior.

The current consolidated execution rules are `docs/CODEX-WORKFLOW-RULES-2026-08-22.md`. A newer accepted workflow revision supersedes older conflicting workflow conventions, but never relaxes user direction, safety invariants, source precedence, exact-target authority, foreign-state preservation, or authoritative reread requirements.

## Development workflow and communication bridge

The governing repository workflow is `docs/CAMPAIGN-HELPER-DEVELOPMENT-WORKFLOW-2026-08-26.md`, version `2026-08-26.2`, accepted under D-252/M218 and revised by D-263/M229. The active machine card must preserve six separate authority planes and the exact 16-stage order with `foundry-execution-evidence-foundation` at Stage 9 and no standalone `utility-harness` stage. Stage 9 requires asset upload/fetch/hash attestation before dependent document creation; one canonical specification for installer and verifier expectations; exact package, installer, worker, adapter, and runtime hashes; a promotion blocker on any installed-versus-expected drift; RuntimeProfile/profile-diff gates; authoritative reread; and GM/player behavior evidence. Monolithic one-click macros remain bounded transports or legacy fixtures, never product architecture or geometry authority.

The Iggwilv Final Chamber Scene/macro comparison is the first legacy fixture under this rule. Installed worker SHA-256 `60BE1AA71386C3457BD313E319E7133724E752E1077F396050A056E69E4425A2` differs from verifier expectation `460F79B11EA457EC9EFC3DCBE2C8D2C534516054D8247944F26096245DF5CF35`; therefore the result is installation evidence with a promotion blocker, not a verifier pass or gameplay certification.

The private repository `https://github.com/Dicebox20/chatgpt-codex-project-bridge` is a reusable communication/evidence mirror only. It may contain versioned schemas, templates, project registries, bounded change cards, handoffs, receipts, and point-in-time KB manifests. Routine bridge updates are weekly Monday at 09:00 America/Los_Angeles and otherwise occur only for an explicit user-requested handoff, release, or materially changed external coordination boundary; they carry compact approved artifacts, never a raw local change stream. This schedule controls publication only and never blocks governed local work. It cannot accept a change, replace the project roadmap/card or canonical KB, authorize implementation, confer Foundry authority, broaden sharing, or auto-apply an inbound artifact. Never publish hidden reasoning, secrets, credentials, unrestricted raw output, mutable KB authorities, or complete chat exports by default. A receiving agent must reread and reconcile the source project before acting.

## Locked product rules

- Stable DiceBox IDs are canonical; Foundry IDs/UUIDs are bindings.
- Native/declarative first; one mechanic, one owner.
- Utility and Use are separate semantic categories.
- Spatial Blueprint owns geometry; images render it.
- During play, runtime state is sovereign.
- AI output is untrusted intent until deterministic validation.
- Player requests are not authority; the active authorized GM/executor rechecks authority and current state.
- No raw database edits, eval, new Function, arbitrary sockets, execute-as-GM public APIs, or hidden cleanup.
- Timeout is outcome-unknown; reread before retry.
- Unknown or foreign state is preserved.
- Ready-to-Play is a blocker-based evidence result, not a test percentage.

## Implementation rules

- Build narrow vertical slices; tests and receipts are part of every capability.
- Put Foundry, D&D5e, Midi, DAE, and other module calls behind exact-version adapters.
- Use `modifyBatch` only when its no-partial-commit semantics and no-intra-batch-reference limitation fit the operation; otherwise use staged, idempotent transactions with read-back and compensation.
- Keep the local KB reproducible from `database/schema.sql` and `database/seed.sql`.
- Update the KB source index, trial ledger, and open items after every research or implementation pass.
- Apply the database-first rule before every specialized task, pipeline, or work routine; implementation may begin only after the relevant database query and provenance/reconciliation record exist.
- Do not claim live certification from source tests, API existence, a green parser, or a successful chat response.
