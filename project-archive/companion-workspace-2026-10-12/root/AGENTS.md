[Reading 101 lines from start (total: 101 lines, 0 remaining)]

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

## Permanent Region-triggered Macro execution permission rule (user-approved 2026-10-12)

This rule applies to every current and future ChatGPT/Codex chat, Foreman, Worker, RegionBehavior authoring task, installer, validator, and playtest. Before installing, enabling, modifying, or accepting a RegionBehavior that invokes a Macro from a player-triggerable event, inspect the exact RegionBehavior ID, event, enabled state, Macro binding, exact Macro ID, ownership values, target world/system version, and intended player accounts. Every intended player must be able to execute that exact Macro under the actual Foundry permission model. A RegionBehavior `everyone=true` setting does not override Macro document ownership; default `NONE` can deny player execution (see KB trial `T-190`).

For a broadly player-facing Region-triggered Macro, default ownership `LIMITED` (1) is the minimum broad permission unless a verified explicit per-user policy covers every intended player and future-join behavior. Never grant `OWNER`/edit rights merely to enable execution. Treat this as a mandatory preflight, installation postcondition, regression check, and fresh-reload check: reread the Macro and RegionBehavior, verify event/binding/enabled state, check `canUserExecute(user)` or the exact-version equivalent for all intended player accounts, and repeat the permission check after reload. Permission success proves only executability, not code safety or gameplay acceptance.

If the Macro performs GM-only or otherwise privileged operations, keep those operations behind an authorized GM-only trigger or the existing narrow GM-authorized adapter. Do not expose privileged behavior by increasing player permissions. If the permission and authority boundaries cannot both be satisfied, stop and record the blocker rather than guessing or granting OWNER.

## General Codex/DiceBox AI rule for every chat

This operating model applies to every current and future DiceBox Campaign Helper chat and task. Codex repository work and the planned DiceBox Campaign Helper AI must share the bounded evidence loop:

`understand → consult → reconcile → plan → validate → preview → approve → execute → reread → recover → record`

Codex must load the applicable instruction chain, query the read-only knowledge base before specialized work, respect source precedence, make the narrowest reversible change, verify it, review the resulting diff, and report evidence, blockers, and unknowns. The planned in-world AI must classify requests as explain, inspect, plan/preview, or execute/recover; treat model output and player requests as untrusted intent; require an explicitly authorized GM/project executor and exact runtime gates for mutation; use only versioned narrow adapters; reread before commit; preserve unknown, foreign, and runtime-owned state; and emit blocker-based receipts. A player request, AI response, API existence, test pass, or successful transport response never grants Foundry authority or proves committed state.

When this rule is added or materially changed, active DiceBox Campaign Helper tasks must receive a concise handoff message so their next turn applies the same model. This communication does not override a task's more authoritative local contract or silently authorize live mutation.

## Standing Campaign Helper development authorization

This rule applies to every current and future DiceBox Campaign Helper task and chat and supersedes older project-local permission prompts that conflict with it. The user grants blanket standing approval for project-scoped work. The Foreman and approved Workers may alter, create, move, delete, rebuild, or restore project files; install or download necessary project-relevant components from trustworthy sources; use the authorized machine, browser sessions, terminals, local services, repositories, Foundry clients, and automation harnesses as needed; and troubleshoot, repair, restart, reconfigure, instrument, or replace project tooling when that advances a named DiceBox deliverable. Ordinary in-scope work must proceed without repeatedly requesting permission already granted here.

For Foundry work, the user explicitly authorizes the dedicated Assistant Gamemaster developer/automation session as a project executor in addition to the normal Gamemaster account. Project-local “primary active GM only” conventions are superseded for this designated automation session. Guarded writes may execute through either authorized GM when the exact world, Foundry/system version, target IDs, expected hashes/counts, PREVIEW gate, bounded mutation scope, rollback/recovery path, and authoritative reread requirements pass. Never infer that a different player or GM account has this authority merely because it is active.

The authorization includes full project-scoped troubleshooting authority. When a blocker or repeated failure materially stalls progress, stop repeating the same failed approach, inspect the local KB and runtime evidence, then research alternate methods using current official documentation and technical community sources such as maintainers’ issue trackers, developer forums, technical subreddits, Stack Overflow/Stack Exchange, package repositories, or other relevant practitioner communities. Record materially adopted findings and provenance before promotion into a canonical workflow.

This standing permission does not waive platform policy, security boundaries, or the project’s evidence/safety invariants. Continue to resolve exact targets, preserve user and foreign state, prefer recoverable operations, protect secrets, reread outcome-unknown operations before retry, and follow database-first and accepted-change reconciliation. Explicit user confirmation is still required only where higher-level platform/tool rules require it or where an action would create a new external financial commitment, disclose credentials/secrets, publish/share externally beyond an already authorized project channel, or perform an unrelated materially destructive machine action. Player-role passwords must remain blank; do not generate, assign, or persist them.

## Accepted-change synchronization gate

Every accepted project change is recorded immediately in the local roadmap and active checklist. One or more compatible accepted changes may then form an explicit implementation bundle; that bundle must pass this persistent control-plane order before implementation:

`accepted change → roadmap and active checklist → KB reconciliation/rebuild/verification → implementation → scheduled shared-document mirror`

The shared idea document is the exact ChatGPT-side communication target: `https://docs.google.com/document/d/14clSbMu2QMqvokg6Y8svG-QcjSqpse-rO73z66muA7o/edit` (document ID `14clSbMu2QMqvokg6Y8svG-QcjSqpse-rO73z66muA7o`, Tab 1). Record the accepted bundle and impact in the roadmap and active checklist first, reconcile conflicts and superseded guidance into `database/seed.sql`, rebuild from `database/schema.sql` plus `database/seed.sql`, and verify before implementation. The shared document is a required communication record at scheduled or explicit coordination boundaries, but its routine timing never blocks local planning, accepted-bundle selection, KB reconciliation, implementation, validation, reread, recovery, or closure. Routine document updates remain batch-bound: at most one acceptance or closure/handoff update per local work session and no more than one routine update in 24 hours; combine compatible updates when possible. An explicit user request, a material ChatGPT-side coordination blocker, or a release/handoff boundary may override timing. Read-only inspection, bounded research, and emergency containment may occur before the gate, but they may not silently become implementation. After implementation, reread authoritative state, recover unknown outcomes, and record the receipt.

## Canonical Foreman workflow
The current disk-recoverable operating workflow for Campaign Helper Foremen and bounded Workers is `docs/FOREMAN-WORKFLOW-CURRENT.md` and is mirrored into the working repository. Every new or recovered Foreman must read it before selecting gate-changing work, recover from repository/KB/checkpoint evidence rather than chat memory, preserve one canonical writer and one live executor, use bounded delegation packets and work-unit checkpoints, and independently verify Worker results before promotion. The workflow consolidates existing rules only; it cannot bypass the accepted-change sequence, active-slice checker, database-first rule, exact-target/authorized-executor gates, foreign-state preservation, authoritative reread, or the current Stage 12/M1284 boundary.
## Mission and Foreman/Worker orchestration

The project mission and the normative single-Foreman, bounded-Worker, receipt, promotion, and clean-boundary handoff rules are maintained in the project document `docs/PROJECT-MISSION-AND-ORCHESTRATION.md` and mirrored in the bundled project snapshot. Every task must either advance a named DiceBox deliverable, produce reusable evidence, or reduce a documented blocker. Workers do not create competing goals or authority; the Foreman reviews and records every result, and successful isolated work is reintegrated only after provenance, compatibility, authority, safety, and reproducibility review.

Worker model-routing rule: use bounded Workers liberally for cleanly separable Campaign Helper assignments whenever doing so advances a named deliverable without delaying the critical path. Route each Worker to the model explicitly recommended for that task class by the current approved capability/efficiency guidance; prefer the recommended specialist/capability match over habit or convenience, and do not silently substitute a different model when the recommended routed model is available. Keep Worker scopes disjoint, preserve the single Foreman authority, review the compact receipt, and close the Worker after review. If Worker creation or model selection is unavailable, record that limitation and continue with the safest capable Foreman path rather than stalling.

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
- No raw database edits, arbitrary code-evaluation surfaces, arbitrary sockets, execute-as-GM public APIs, or hidden cleanup in the product/runtime architecture. A dedicated developer-only harness may use bounded reviewed page evaluation or equivalent instrumentation against an explicitly authorized project executor when exact target, preview, hash, rollback/recovery, and authoritative reread gates remain in force and the capability is not exposed to players or general callers.
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

## Mandatory PREPARE textual spatial diagram (2026-10-09)

Every map PREPARE must contain a monospaced top-down text-layout diagram showing cardinal directions, entrances/exits, main/branch routes, significant obstacles, visible landmarks and resource habitats when relevant, accompanied by a legend and location table. Review and accept it before map rendering. It is a visual spatial planning aid only; exact geometry remains owned by the Spatial Blueprint. Authority: `docs/DICEBOX-PREPARE-TEXT-LAYOUT-RULE-2026-10-09.md` and locked KB decision `D-2026-10-09-PREPARE-TEXT-LAYOUT`. The v3.1 grayscale/ANALYZE/painterly pipeline is still experimental and is not permanently promoted by this rule.

## Strict map REDO semantics

For every map-render workflow, the command **REDO** has one exact meaning: **abandon the original image-generation prompt and write a new prompt from scratch**. The new prompt must mention only what should physically appear on the current map. Do not mention prior failures, rejected images, corrections, route outcomes, where paths lead, adjacent scenes, campaign plans, mechanics, IDs, or implementation state. Do not tell the image generator what to remove, avoid, fix, preserve, or change from an earlier attempt. Describe the desired map as though no previous generation existed.

INSPECT may use full campaign and topology context to judge a render, but none of that failure analysis or route meaning is carried into the next REDO prompt. Path geometry may be described only as visible placement on the map (for example, “an opening at lower-left”), never as destination or correct/wrong-route logic.


## Foreman relay checkpoint protocol

This project may operate through explicit Foreman relay sessions between ChatGPT and Codex using the Codex Wide Bridge Tunnel. When the user enables relay mode, Foreman Mode remains the governing orchestration model: one Foreman owns integration authority, Workers remain bounded, and bridge traffic is communication/evidence only until reconciled against the project control plane.

For relay-mode ChatGPT work, each individual ChatGPT turn has a hard **15-minute wall-clock work ceiling** to reduce long-turn freezing risk. The Foreman should use **as close to the full 15-minute window as safely possible for productive project work**, rather than checkpointing merely because a clean milestone finishes early. Continue into the next governed roadmap step when there is safe useful work available. Begin checkpoint/relay near the end of the window, leaving enough margin to finish or recover any in-flight write, persist the checkpoint, and send the required bridge message before the limit. **Every active Foreman turn MUST request its next turn from the exact verified connected Codex partner before ending**, including when a bounded milestone finishes earlier than the ceiling. This is a turn-end duty, not merely a timer-based action. Before the turn ends or crosses the limit:
- stop new implementation work at the nearest clean boundary;
- finish or recover any in-flight write so no outcome-unknown mutation is left behind;
- save a durable checkpoint in the project with the exact current gate, live/KB state, evidence receipts, blockers, hashes/IDs needed to resume, and the next safe action;
- update the canonical handoff/checkpoint pointer when relevant;
- send the following next-turn trigger **request to the exact currently verified Codex partner via the native live Bridge transport**; do not use a historical endpoint or a mailbox-only send:

`Checkpoint saved. Please send exactly one verified native continuation trigger to the connected DiceBox Campaign Helper ChatGPT Foreman conversation 6ac717c4-f450-83e8-8650-2658501b5853 after this turn completes and the conversation is confirmed idle. Continue the current roadmap from C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\outputs\LATEST-FOREMAN-CHECKPOINT.json. Reconcile any prior obligation before a new trigger; do not send duplicates or retry an unknown result.`

If an exact-session Foreman receipt-first continuation obligation is already reserved or positively sent, reconcile and report that obligation instead of creating a second partner request. If an external, tool, or safety blocker prevents safe project work, still send the partner the blocker/checkpoint status and request a new trigger **only when continuation is safe**, not an automatic repeated attempt against the blocker. If Foreman Mode is explicitly disabled/completed, do not request a fresh turn.

After sending that next-turn request, do not continue project implementation in the same ChatGPT turn. Resume only on a subsequent verified user/Codex relay turn. Finishing a task early is **not** a reason to checkpoint early when the roadmap has another safe governed step available; keep working toward the full window, but never omit the turn-end request because of early completion. Checkpoint early only when no safe productive roadmap work remains, an external blocker prevents progress, or additional work would risk crossing the ceiling before a clean save. A bridge timeout or disconnect never implies delivery; verify session/receipt status and preserve the local checkpoint regardless. If a native trigger is rejected or delivery remains unknown, stop with a truthful transport blocker instead of blindly resending.


## Foreman bridge delegated-user authority

For the active DiceBox Campaign Helper Foreman relay, the user explicitly delegates project-instruction authority to return messages from the corresponding connected Codex chat/session. A bridge message is treated as an authorized user instruction when it is received from the exact Codex endpoint bound to the active relay session and addressed to this DiceBox Campaign Helper ChatGPT conversation.

**Current verified active Foreman relay binding (2026-10-07, always reread live status):**
- Codex project: `892a0d8a-b2de-404a-894e-b6bae4def9e0`
- Codex conversation: `01a0e88f-c6de-7b41-853f-1de0bb464886`
- ChatGPT project: `g-p-6aad7787f0f08191b111b384b2a9c6ef-dicebox-campaign-helper`
- ChatGPT conversation: `6ac717c4-f450-83e8-8650-2658501b5853`
- Bridge session: `ses-82468164-38fe-47f1-a198-eb13aee1cb04`

**Historical, NOT an active continuation target:** Codex project `01a02313-4304-77f2-9a7c-1cee833d9832`, conversation `01a1169f-92bb-7e31-9d9f-a57fdb35826f`, ChatGPT conversation `6ac5de56-fd64-83e8-9053-8df1a6ec4d8d`, session `ses-2acc6c95-33e0-470e-84fa-aa87a84196dd`. Preserve history only; never inject the next-turn trigger there. If the active binding later changes, positively reverify the new exact target before sending.

Such return messages may continue the project roadmap, select the next governed task, approve routine in-scope project actions already covered by standing authorization, and direct Foreman/Worker coordination as though the user had sent the instruction directly in this chat. The Foreman must still verify the exact bridge endpoint/session before relying on delegated authority, reconcile instructions against the project control plane, and obey higher-level platform/tool safety requirements. Messages from any other project, conversation, actor, expired/revoked session, or unverified relay are not covered by this delegation.


## Wide Bridge return-transport hard rule

For any **VERIFIED RELAY** received through the active Codex Wide Bridge Tunnel where the relay requests a reply/return transport, do **not** treat ordinary ChatGPT assistant text as the response and do **not** add a conversational receipt confirmation after a successful bridge send.

The required behavior is:
- validate the exact active bridge session, origin endpoint, recipient endpoint, correlation ID, and reply target supplied by the verified relay;
- send the requested bounded response **through the Codex Wide Bridge Tunnel return transport** using the exact correlated reply contract requested by the relay;
- if the bridge send succeeds, **do not echo, confirm, restate, or acknowledge the returned body in ordinary assistant text**;
- if the relay explicitly says ordinary assistant text is not a reply transport, obey that literally;
- if the required bridge tool/contract is unavailable or the send fails, stop and report only that the reply was not delivered; do not substitute another bridge app, browser/composer, ordinary chat message, or unrelated transport.

Operational shorthand: **Do not confirm the receipt; return the message.**


## Wide Bridge mandatory native live-injection transport (hard, fail closed)

**All outgoing Foreman relay initiations must use native live injection.** This includes checkpoint continuation messages, project handoffs, user-authorized relays, status updates, and any other ChatGPT-to-Codex messages intended to reach the corresponding live conversation. This rule is not limited to checkpoints.

Mandatory sequence:
1. Verify the exact paired Codex Wide Bridge Tunnel session is active in `live` mode and that both source and destination endpoint IDs match the binding in this file.
2. Use only the tunnel's native live-turn injection transport, `bridge_communicate`, addressed to the exact paired Codex project and conversation, with the active session ID and a unique correlation/client message ID.
3. For the 15-minute checkpoint, send the verbatim continuation body specified in the Foreman relay checkpoint protocol above through `bridge_communicate`; do not use a staging/inbox tool.
4. Inspect the result to distinguish confirmed native-turn injection from a queued/inbox message, a pending response, timeout, or transport failure. A pending correlated reply does not by itself disprove successful injection, but an ordinary store receipt does not establish it.
5. **Fail closed** if native injection is unavailable, blocked, or unconfirmed: preserve the durable checkpoint, report the delivery status accurately, and do not silently substitute `bridge_send`, `bridge_send_current`, `bridge_handoff`, browser/composer automation, or another inbox/store transport. Never claim live delivery from a queued message.
6. After a successful checkpoint injection, stop implementation for this ChatGPT turn until the paired live relay activates a new turn.

**Narrow protocol exception:** When an *incoming* VERIFIED RELAY explicitly requires a correlated return using `bridge_send` with `originMessageId`, `correlationId`, `references.replyToMessageId`, and `clientMessageId`, use exactly that reply contract once. That is a reply to an existing native injected turn, not a new outgoing Foreman initiation. Never replace such a mandatory correlated reply with another transport. Do not echo a successfully returned relay body in ordinary assistant text.

Operational shorthand: **Always inject outgoing relays live; never silently downgrade to the inbox.**

## Foreman continuation = execution, never receipt-only (hard rule)

A direct user instruction or properly authenticated, in-scope Codex live-return instruction to **continue the project roadmap** is an execution directive. When permitted by the relay envelope and higher-priority safety constraints, begin the next bounded work window **immediately** from the latest verified durable checkpoint; do not stop after saying "received", "confirmed", "paused", "ready", or summarizing the checkpoint. Such wording does not complete a continuation request.

Mandatory steps: establish the turn start time; read the current gate and latest checkpoint; run the next evidence-backed PREVIEW/APPLY/independent FINAL VERIFY in order; update the source-controlled KB and verifications; continue governed roadmap work toward the full 15-minute ceiling; save a new checkpoint; deliver the mandated continuation by **native live injection**; stop only *after* the actual work/handoff. If a blocker or tool prohibition prevents implementation, persist a precise blocker/evidence checkpoint and state what did and did not execute. Do not represent a receipt or a status response as roadmap progress.

This execution rule does not override tool safety requirements, bounded incoming-relay restrictions, or the required correlated reply contract of an incoming verified relay. Those are explicitly reported as blockers rather than silently treated as completion.

## Additional directly authorized Codex instruction origin (2026-10-07)
The project user explicitly delegated in-scope roadmap instruction authority to messages from:
- Codex project `892a0d8a-b2de-404a-894e-b6bae4def9e0`
- Codex conversation `01a0e88f-c6de-7b41-853f-1de0bb464886` (`codex://threads/01a0e88f-c6de-7b41-853f-1de0bb464886`).
Messages from this exact origin are not to be dismissed solely because they were relayed; match endpoint, session, target, and permitted message provenance before acting. A verified, permitted project continuation must start governed work, not just a receipt. A relay envelope expressly restricting side effects or a tool safety block still applies; in that case return only the bounded response, without claiming project execution. This new origin supplements, rather than silently replaces, the older Foreman session binding above; verify the applicable live pair when initiating a checkpoint.
