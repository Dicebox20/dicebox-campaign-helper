# Codex Fundamental Rules for DiceBox Campaign Helper

Status: project guidance, synthesized 2026-08-21 from the foundation contract, the read-only knowledge base, current project plans, and targeted official OpenAI and Foundry documentation.

This is a cross-chat rule: every current and future DiceBox Campaign Helper chat and task should apply it. The document defines how Codex should work on DiceBox Campaign Helper and how the planned DiceBox Campaign Helper AI should behave during campaign authoring and play. It does not grant live Foundry authority. The repository contract, current ADRs, exact-stack evidence, and the reproducible knowledge base remain authoritative.

## The governing model

The model may interpret intent and propose a bounded action. Deterministic validators, capability gates, ownership rules, the active authorized executor, and authoritative rereads decide whether an action is safe and real.

Codex and the planned DiceBox AI share the same control loop:

`understand → consult → reconcile → plan → validate → preview → approve → execute → reread → recover → record`

Codex applies that loop to repository work. DiceBox applies it to campaign intent and Foundry runtime work. A player request is input, not authority; an AI response is intent, not truth; a successful API call is not proof of committed state.

## Fundamental rules

1. **Load the contract before acting.**

   Codex reads the applicable `AGENTS.md`, ADRs, charter, and status before planning or editing. Nested guidance may specialize broader guidance, but neither Codex nor DiceBox may silently override a higher-authority rule. Report conflicts and preserve provenance.

2. **Use the knowledge base as the control plane.**

   Before a specialized task—content, maps, spatial blueprints, Foundry documents, adapters, harnesses, installation, or recurring workflows—query the approved read-only KB surface for relevant sources, facts, decisions, trials, open items, schemas, and existing routines. Reuse a routine when possible. If a new routine is justified, record its purpose, authority boundary, owner, provenance, evidence, recovery behavior, and risks in `database/seed.sql`, then rebuild and verify the database.

3. **Respect source precedence and reconcile conflicts explicitly.**

   Use this order: project contract and current ADRs; canonical foundation decisions and invariants; exact-stack runtime evidence; dossiers and research; historical conversations and community examples. Lower-level material can inform research but cannot silently replace an active rule.

4. **Treat AI output as untrusted intent.**

   Natural-language requests, generated code, generated Foundry payloads, extracted values, and model-suggested tool calls are proposals. They must be normalized into a reviewed schema and pass deterministic identity, reference, capability, authority, ownership, sovereignty, and postcondition checks before they can cause an effect.

5. **Keep the smallest useful scope.**

   Prefer one narrow vertical slice, one mechanic, one owner, one target, and one reversible transaction. Do not expand a request into broad campaign compilation, cleanup, synchronization, optional-module behavior, or live mutation without an explicit gate and evidence.

6. **Keep stable DiceBox identity separate from runtime bindings.**

   Stable DiceBox IDs, semantic versions, ownership markers, and plan fingerprints are canonical. Foundry IDs, UUIDs, names, paths, tab identities, and world IDs are runtime bindings that must be observed, target-bound, and reread. Never use fuzzy names as authority.

7. **Prefer native and declarative mechanics.**

   Use the narrowest reviewed native Foundry, D&D5e, or module primitive. Each mechanic has one owner; presentation, media, and helper UI do not become mechanical authority. Keep Utility and Use as separate semantic categories.

8. **Keep geometry and rendering separate.**

   The Spatial Blueprint owns origin, scale, topology, walls, doors, anchors, regions, and clearances. Images are renderers and evidence of visual intent only. Do not infer playable geometry, behavior, or puzzle state from pixels.

9. **Treat runtime state as sovereign during play.**

   Preserve runtime-owned, foreign, observe-only, omitted, malformed, and unknown state. An absent observation is not proof of missing state. Cleanup, deletion, or repair is never inferred from drift alone and remains disabled until ownership, authority, exact scope, reread, and approval are proven.

10. **Recheck authority at the point of effect.**

   A user role, a player request, a visible tab, a prior approval, or the existence of `game.users.activeGM` does not by itself authorize execution. The active authorized GM/executor must be rechecked against the current target, sender, permissions, plan fingerprint, approval, and binding generation immediately before the native operation.

11. **Preview before mutation; approval is specific.**

   Produce a human-readable, schema-valid preview naming the target, intended owned fields, official API, capability gates, authority requirement, expected postcondition, and recovery path. Approval is bound to that plan, target, generation, and expiry; it does not authorize unrelated operations.

12. **Use exact-version adapters and capability states conservatively.**

   Foundry, D&D5e, Midi, DAE, browser, and other module calls live behind versioned adapters. API presence can establish a read-only surface, not behavior, permission, hook order, authority, schema acceptance, or successful persistence. Unknown and unavailable capabilities fail closed.

13. **Never widen the execution boundary.**

   Do not use raw database edits, `eval`, `new Function`, arbitrary sockets/RPC, public execute-as-GM APIs, raw document patching, guessed UI coordinates, or hidden cleanup. The semantic API exposes only reviewed operations and read paths; adapters own runtime-specific payloads.

14. **Make failure states explicit.**

   Distinguish success, denied, invalid, unavailable, blocked, failed, and outcome-unknown. A timeout, lost stream, reconnect, stale response, or inconsistent response is outcome-unknown: reread authoritative state before retrying, compensating, or claiming failure. Never blindly retry a possible mutation.

15. **Commit only after authoritative reread.**

   A native operation is committed only when the returned binding and authoritative reread match the reviewed plan and postcondition. Record what was observed, what was not observed, and what remains unknown. A test pass, parser pass, import, API name, or chat response is not live certification.

16. **Preserve least privilege and redact evidence.**

   Read-only diagnostics are the default. Receipts should contain target/fingerprint, operation class, capability and authority result, redacted identity, outcome classification, postcondition, and artifact hashes—not raw runtime data, secrets, or unbounded payloads.

17. **Make tests and receipts part of the capability.**

   Every meaningful implementation slice includes deterministic tests, failure injection where relevant, a receipt, and an explicit evidence class. Exact-runtime, GM/player, cross-client, recovery, and Ready-to-Play claims require their own target-bound receipts.

18. **Use blocker-based readiness.**

   Ready-to-Play is a certificate over required evidence lanes and zero unresolved required blockers. It is not a test percentage, a green parser, an API inventory, or a successful chat response. When blocked, say which gate is missing and the next evidence-producing action.

19. **Record the work back into the knowledge system.**

   After research or implementation, update source provenance, facts, decisions, trials, open items, and relationships as applicable. Keep `database/schema.sql` plus `database/seed.sql` reproducible and verify the rebuilt artifact. Do not let the conversation become the only memory of a decision.

## Codex operating behavior

For each task, Codex should:

1. State the requested outcome and scope.
2. Load project guidance and query the KB before specialized planning.
3. Inspect the smallest relevant set of files, tests, schemas, and exact-version references.
4. State assumptions and surface conflicts before implementation.
5. Make focused, reversible edits with the repository’s normal editing path.
6. Run proportionate checks, inspect the diff, and distinguish deterministic evidence from live evidence.
7. Report changed files, checks run, blockers, unknowns, and the next safe step.

Codex may parallelize independent read-heavy exploration, tests, and research, but the main task retains the decisions and final synthesis. Parallel write-heavy work requires explicit coordination. Review is separate from mutation: a review should report prioritized findings without changing the working tree.

## Planned DiceBox AI behavior

The in-world AI should classify every request into one of four modes:

| Mode | AI may do | AI must not do |
| --- | --- | --- |
| Explain | Answer from approved facts and cite the source or mark uncertainty | Invent a rule or present a guess as canon |
| Inspect | Query approved state/capability surfaces and return redacted observations | Treat API presence or a player claim as runtime truth |
| Plan/preview | Normalize intent, select a narrow owner, and show the exact bounded plan | Write Foundry state or smuggle raw payloads through the plan |
| Execute/recover | Route an already approved plan to the active authorized executor, reread, and emit a receipt | Execute as GM publicly, infer authority, delete foreign state, or retry outcome-unknown blindly |

Player-facing requests can create narration, explanations, read-only queries, or a proposal. They cannot authorize world mutation. GM-facing approval still requires current target, active-GM identity, capability, permission, owned-only scope, plan fingerprint, and exact-runtime evidence. The AI should prefer a blocked explanation with the next evidence step over a plausible but unverified action.

## Shared state machine

```text
request
  ↓
classify: explain | inspect | plan | execute
  ↓
KB + contract + runtime preflight
  ↓
normalize stable intent → validate schema/identity/ownership/authority
  ↓
preview + approval (only when effectful)
  ↓
versioned narrow adapter → native operation
  ↓
authoritative reread
  ├─ match → commit receipt
  ├─ mismatch → preserve state, recover, report
  └─ timeout/lost response → outcome-unknown, reread before retry
```

## Reconciled external guidance

Official OpenAI Codex documentation confirms that Codex loads `AGENTS.md` before work and layers global, project, and nested guidance; it also describes parallel subagents as useful for bounded read-heavy work and recommends keeping the main agent focused on requirements and decisions. Its code-review workflow reports prioritized findings without modifying the working tree. These practices are adopted here as workflow guidance, subordinate to the DiceBox contract.

Official Foundry v14 documentation confirms the runtime boundary used by the project: `ready` runs after setup, persisted Documents are created through factory APIs rather than plain construction, updates are performed on Document instances, Users expose active-GM state, and Regions contain RegionBehaviors. These pages are API guidance only; they do not certify Foundry 14.367 / D&D5e 5.3.3 behavior for DiceBox. Exact runtime receipts remain required.

## Evidence and provenance

Local KB preflight used the approved read-only service:

```text
npm run kb:query -- --kind summary
npm run kb:query -- --kind facts --term AI
npm run kb:query -- --kind facts --term authority
npm run kb:query -- --kind facts --term unknown
npm run kb:query -- --kind trials --term timeout
npm run kb:query -- --kind blockers
npm run kb:query -- --kind plan
```

Key local records: `F-004`, `F-008`, `F-036`, `F-042`, `F-044`, `F-053`, `F-081`, `F-083`, `F-085`, `F-088`, `F-096`; `D-071`; `T-070`; `M25`; and the active runtime blockers returned by the preflight.

Online references:

- [OpenAI: Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [OpenAI: Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
- [OpenAI: Code review](https://learn.chatgpt.com/docs/code-review)
- [OpenAI: Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security)
- [Foundry v14: ready hook](https://foundryvtt.com/api/functions/hookEvents.ready.html)
- [Foundry v14: Documents and data](https://foundryvtt.com/api/v14/modules/foundry.documents.html)
- [Foundry v14: User](https://foundryvtt.com/api/v14/classes/foundry.documents.User.html)
- [Foundry v14: RegionDocument](https://foundryvtt.com/api/classes/foundry.documents.RegionDocument.html)
- [Foundry v14: RegionBehavior](https://foundryvtt.com/api/classes/foundry.documents.RegionBehavior.html)
