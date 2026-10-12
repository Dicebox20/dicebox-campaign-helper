# DiceBox Campaign Helper foreman workflow - current

Status: canonical operating workflow for DiceBox Campaign Helper foreman continuity as of 2026-10-01.

This file exists so development continuity does not depend on any one ChatGPT, Codex, browser, or local-tool session. Repository state, the roadmap, active card, reproducible knowledge base, receipts, and authoritative runtime rereads are the recovery authority. Chat memory is useful context, never the source of truth.

## Authority and precedence

Campaign Helper keeps its existing authority planes. This workflow does not create a new one.

1. The foundation implementation contract at C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\AGENTS.md and the current repository AGENTS.md define invariants and source precedence.
2. The roadmap and docs/ACTIVE-PROGRAM-SLICE.json select the accepted outcome, active product stage, and currently authorized bounded action.
3. The reproducible KB built from database/schema.sql plus database/seed.sql records reconciled provenance, decisions, trials, evidence, and blockers.
4. Canonical project files, typed plans, stable DiceBox IDs, and content-addressed assets hold program-owned campaign truth.
5. Sovereign live Foundry state owns current play state and foreign/runtime-owned fields.
6. Communication mirrors and handoffs carry bounded coordination evidence only.

Checkpoints created by this workflow are continuity evidence. They do not outrank or replace any authority plane.

## Team and authority

- The DiceBox Campaign Helper Foreman is the one canonical integrator, normal local operator, and owner of the active outcome.
- Codex or other specialist Workers receive one bounded objective. They may research, implement, or verify only within the explicit lease and may not create a competing goal or authority plane.
- Local PowerShell, browser, desktop, repository, and Foundry transports are tools used by the Foreman. A transport being reachable does not confer product or runtime authority.
- A recovery Worker may reconcile repository, process, checkpoint, or outcome-unknown state when normal recovery is insufficient. Recovery alone never advances a product stage.
- Exactly one canonical writer/resource lease exists for overlapping product state at a time. Parallel work requires disjoint paths/resources or an isolated worktree.

Workers never certify their own success. The Foreman independently reconciles source state, diff, lease, validation, runtime evidence, and closure before promotion.

## Normal control path

Foreman -> instruction chain -> roadmap/active card -> read-only KB -> bounded local work -> proportional validation -> preview/approval when required -> exact execution -> authoritative reread -> blocker-based receipt -> durable checkpoint -> project record

The transport is infrastructure, not the objective. A successful shell command, bridge response, model response, browser action, macro return, or API call is not evidence that a project or Foundry mutation committed.

## Mandatory Region-to-Macro permission gate

Before any RegionBehavior is installed, enabled, changed, or accepted when it invokes a Macro on a player-triggerable event, verify the exact RegionBehavior ID, event and enabled state, exact referenced Macro ID, target world/system version, Macro ownership, and intended player accounts. Every intended player must be able to execute that Macro under the real Foundry permission model. A RegionBehavior `everyone=true` flag does not grant Macro document permission; default ownership `NONE` can block execution (KB trial `T-190`).

For a broadly player-facing Region Macro, use default ownership `LIMITED` (1) as the minimum broad permission unless an explicit per-user policy is proven to cover every intended player and future-join behavior. Never grant `OWNER`/edit merely to make execution work. After installation, reread the exact Macro and RegionBehavior, verify the binding/event/enabled state, check `canUserExecute(user)` or the exact-version equivalent for all intended player accounts, and repeat those checks after a fresh reload. These are mandatory preflight, postcondition, and regression checks. They establish executability only, not macro safety or gameplay success.

If the Macro contains GM-only or privileged operations, do not expose them by broadening player permissions. Keep the trigger GM-only or route the operation through the existing narrow GM-authorized adapter. If player execution and the authority boundary cannot both be satisfied, stop and record the blocker.

## Startup and recovery workflow

When a Foreman conversation is new, replaced, truncated, recovered after a tool error, or uncertain about continuity:

1. Run scripts/Show-CampaignHelperRecoveryState.ps1.
2. Read the foundation AGENTS.md and current repository AGENTS.md.
3. Read this file.
4. Read the current roadmap header/current boundary, docs/ACTIVE-PROGRAM-SLICE.json, and docs/CAMPAIGN-HELPER-DEVELOPMENT-WORKFLOW-2026-08-26.md.
5. Read outputs/LATEST-FOREMAN-CHECKPOINT.json when present.
6. Inspect the working tree and preserve all unrelated dirty work.
7. Query the approved read-only KB for the active subject, decisions, open items, and latest relevant receipts.
8. Reconcile any PASS, BLOCKED, FAILED, PARTIAL, or OUTCOME_UNKNOWN checkpoint against current repository and runtime state before selecting another write or live action.
9. If remembered chat state disagrees with disk or runtime evidence, disk/runtime evidence wins and the disagreement is recorded.
10. Select exactly one bounded work unit.

A missing or unreadable latest checkpoint is a recovery warning, not permission to guess.

## Bounded work units

A substantive research pass, coherent patch plus verification, recovery/reconciliation episode, or live runtime action is one bounded work unit.

Before beginning a unit, define:
- work-unit ID and roadmap lane;
- owner;
- objective and exact acceptance observation;
- source/base fingerprint;
- allowed read/write paths and resource lease;
- evidence layer;
- deterministic checks;
- whether one live action is authorized;
- expected receipt;
- stop, rollback, and outcome-unknown conditions.

At most one live Foundry/runtime action belongs to a bounded work unit. After that live action, checkpoint before another live action begins.

## Durable checkpoints

Use scripts/Write-CampaignHelperCheckpoint.ps1 at the end of every bounded work unit.

The writer preserves:
- a timestamped history record under outputs/foreman-checkpoints/;
- an atomic latest pointer at outputs/LATEST-FOREMAN-CHECKPOINT.json;
- work-unit ID, status, evidence layer, summary, changed paths, validation, blocker, next action, and continuation;
- current Git HEAD and dirty-path snapshot when Git is available;
- current active-card identity and hashes for key control-plane files.

Allowed status values are PASS, BLOCKED, PARTIAL, FAILED, and OUTCOME_UNKNOWN.

Use CONTINUE only when the exact next bounded action is safe to resume immediately from durable evidence. Use STOP for manual/external blockers, context risk, completion, unresolved outcome-unknown work, or any point where a successor must recover from disk before continuing.

## Mandatory end-of-turn partner trigger request (active Foreman Mode)

At the end of **every active ChatGPT Foreman development turn**, including a shorter bounded unit, (1) finish or classify the current work, (2) persist a checkpoint with an exact next safe action, (3) verify the *current* Bridge session and designated Codex partner identities, and (4) **send that Codex partner an explicit native live Bridge message asking for exactly one same-conversation trigger for the next Foreman turn**. This turn-end handoff is mandatory even when the 15-minute work ceiling was not reached. The exact currently approved binding and suggested request text are in `AGENTS.md` under Foreman relay checkpoint protocol; historic ChatGPT and Codex endpoints are not permissible targets.

Reconcile existing receipt-first obligations before reserving or sending another. A positive existing next-turn trigger satisfies the obligation and **must not** produce a second send. A Bridge acceptance or pending reply is not proof that a new native ChatGPT turn occurred. Fail closed on rejected or unknown delivery, never blindly retry or downgrade to an inbox. If the roadmap is finished or Foreman disabled, do not schedule another turn; if implementation is externally blocked, communicate the checkpoint and request a wake only after safe continuation is possible, not a repeated blocked action. Once the partner request is sent, stop development in that turn. This project communication never grants further live Foundry authority.

A checkpoint is not:
- a Git commit;
- a KB acceptance record;
- a stage promotion;
- Foundry authority;
- Ready-to-Play evidence;
- permission to replay an unknown operation.

## Accepted-change synchronization

Every accepted project change follows the existing mandatory order:

accepted change -> roadmap and active card -> KB reconciliation/rebuild/verification -> implementation -> validation/reread -> closure record/checkpoint -> scheduled communication mirror

Read-only investigation, bounded research, and emergency containment may precede the gate, but they cannot silently become implementation.

Routine shared-document or bridge mirroring remains batch-bound and non-blocking for governed local work. A mirror never becomes authority merely because it is current.

When a user approves a lasting process, troubleshooting, evidence, safety, or execution rule, persist it in AGENTS.md and this workflow or the relevant governing document. Chat-only process rules are not durable.

## Delegation and Workers

Every delegated unit states:
- task/work-unit ID and roadmap lane;
- owner/model lane where relevant;
- objective and exact acceptance criterion;
- base SHA or working-tree fingerprint;
- allowed read/write paths;
- resource/write lease;
- whether one live test/action is authorized;
- required verification commands;
- expected receipt/output;
- stop and rollback conditions.

Workers return changed paths, evidence layer, validation, blockers, unknowns, and recommended next action. The Foreman reviews the packet and independently verifies it before integration.

Isolated worktrees are allowed when they reduce overlapping edits, build collisions, runtime interference, or evidence ambiguity. Isolation never bypasses the accepted-change gate or creates a second authority plane.

## Codex escalation

Codex remains a bounded development/research specialist, not a second project authority. The accepted product roadmap also defines a future integrated ChatGPT workspace in which Codex escalation is used only for work the app-owned workspace cannot safely or reliably perform.

Development-time Codex use before that product slice is still governed by the current Worker model:
- one bounded objective;
- explicit source state and lease;
- expected receipt and recovery disposition;
- no automatic promotion;
- independent Foreman verification.

A staged bridge or mailbox record proves only staging until delivery/response evidence exists.

## Troubleshooting and evidence

- Start with the simplest, lowest-risk explanation first.
- Repository/disk evidence outranks chat memory.
- Preserve unrelated local changes. Do not reset, clean, or discard them to simplify recovery.
- Unknown means unknown.
- A timeout, transport failure, missing metric, unavailable control, or stale UI is never converted into success.
- Never blindly replay an outcome-unknown command, message, runtime mutation, or control invocation.
- Use targeted diagnostics before broad recursive scans.
- After a substantive failed patch or non-trivial technical blocker, inspect exact live/source state and perform targeted research before a materially different repatch.
- On the second failure of the same runtime class, stop live retries. Query the KB, reduce the issue to a bounded reproduction, validate the narrow fix locally, and obtain a fresh target/authority reread before another live attempt.
- Evidence labels remain exact: research, local, staged, fixture, Ballad, or player-accepted. No lower lane implies a later one.

## Foundry and Regionwright boundaries

For any live or fixture Foundry action:
- resolve the exact target, Foundry version, D&D5e version, world, package/adapter identity, and explicitly authorized GM/project executor;
- preserve player passwords as blank and never invent, extract, disclose, or bypass authentication credentials;
- use a read-only preview before guarded project writes unless emergency containment requires a narrower stop/recovery action; standing project authorization satisfies routine approval for in-scope writes;
- execute only the allowlisted bounded operation;
- reread authoritative state after execution;
- preserve unknown, foreign, and runtime-owned state;
- stop on target drift, authority drift, stale plan, ambiguous reload, missing control, or outcome unknown;
- never expose raw database editing, arbitrary code evaluation, arbitrary sockets, or a generic execute-as-GM path as product/public runtime capabilities. An isolated developer-only harness may evaluate a bounded reviewed script in the explicitly authorized Assistant Gamemaster developer session when exact target/hash/preview/rollback/reread gates are retained and the capability is not exposed to players or general callers.

If a restart or reload returns an ordinary client to /join, do not bypass authentication. The dedicated Assistant Gamemaster developer profile may reuse its already-authenticated persistent session or perform the normal blank-password join flow when Foundry presents it; otherwise stop at the authentication boundary and record the exact next action.

## Current project state

This section is a recovery hint, not a substitute for rereading the roadmap and active card.

As of 2026-10-01:
- the machine-enforced active product stage is scene-authoring-breadth, Stage 12;
- readyClaim is false;
- M1284 remains the immediate runtime boundary and is stopped at manual Gamemaster rejoin after the v5 supervisor restart;
- after the manual rejoin, only the already-authorized single Regionwright premium loaded-identity observation may continue under the M1284 boundary;
- after M1284 closes and the synchronization gate passes, the accepted next product slice is the app-owned read-only ChatGPT workspace foundation followed by the calibration read-only vertical slice;
- the workspace revision does not itself authorize broad mutation.

If any current roadmap/card/KB receipt supersedes this snapshot, the newer reconciled evidence wins.

## Closure and handoff

A bounded unit closes only when:
- its acceptance observation is satisfied or it has an explicit blocker/outcome-unknown classification;
- proportional verification ran;
- the Foreman reviewed the relevant diff and preservation scope;
- required runtime actions have authoritative reread evidence;
- a durable checkpoint exists;
- roadmap/card/KB closure records are updated when the unit changes accepted project state.

A successor handoff must name the active goal, current stage/milestone, last checkpoint, working-tree state, blockers, manual boundaries, and exact next bounded action. Handoff text never overrides current repository/runtime evidence.

## Startup rule for every Foreman

On every new or recovered Campaign Helper foreman session, recover from the repository and latest checkpoint before trusting remembered chat context. Read this workflow before taking ownership of a new bounded unit.