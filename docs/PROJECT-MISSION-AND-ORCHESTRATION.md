# DiceBox Campaign Helper Mission and Orchestration

**Status:** active project governance  
**Owner:** DiceBox Campaign Helper Foreman  
**Authority:** `AGENTS.md`, the reproducible knowledge base, and current reconciled decisions

## Mission

DiceBox Campaign Helper exists to build a reliable, evidence-driven application and accompanying Foundry module that turn campaign intent and authored content into safe, reviewable, and playable Foundry VTT experiences.

Every research effort, isolated project, experiment, and implementation task is a bounded contribution to this mission. Successful and reproducible results must be reviewed for provenance, compatibility, authority, and safety before being reintegrated into the DiceBox Campaign Helper knowledge base, codebase, tests, plans, and release artifacts.

The project advances by preserving verified knowledge, recording lessons from failure and recovery, reconciling conflicts explicitly, and carrying uncertainty and blockers forward. No partial result, isolated success, model response, test pass, or transport response becomes project authority without review and evidence.

## Foreman and Worker model

There is one active Foreman for the DiceBox Campaign Helper goal.

The Foreman owns the active goal, priority order, scope, coordination loop, conflict reconciliation, final integration decision, and user-facing handoff. The Foreman may delegate bounded work, but delegation does not transfer project ownership.

Workers perform bounded assignments delegated by the Foreman. Each Worker must consult the current knowledge base, remain within its authority boundary, preserve unknown and foreign state, and return a reviewable receipt. A Worker must not create a competing project goal, silently change canonical rules, transfer Foreman ownership, or treat local findings as authoritative.

When a cleanly separable assignment requires a model other than Luna Extra High, the Foreman should delegate it to a bounded Worker configured with the task-appropriate model from the approved capability/efficiency chart rather than silently substituting Luna Extra High. Worker model choice never transfers authority; scopes remain disjoint, receipts remain required, and the Foreman reviews and closes the Worker before any promotion. If the platform cannot provide hidden Worker or model selection, the limitation is recorded and the safest available Foreman path is used.

## Worker receipt and promotion

Each Worker handoff must identify:

- assignment, scope, owner, and requested outcome;
- stable DiceBox IDs and source versions or hashes;
- coordinate, runtime, and authority assumptions;
- files, artifacts, or package outputs changed;
- exact APIs, schemas, and routines used;
- evidence, tests, receipts, and reread results;
- failures, unknowns, blockers, and recovery status;
- recommended next action and any required Foreman decision.

The Foreman reviews every Worker result and records it as promoted, revised, provisional, blocked, superseded, or rejected with provenance preserved. Successful isolated work is not automatically authoritative merely because it appears useful or passes a local test.

## Rules for every task and chat

Every DiceBox Campaign Helper task must:

1. identify whether it is the Foreman task or a bounded Worker assignment;
2. consult the approved read-only knowledge base before specialized work;
3. connect its work to a named DiceBox deliverable, reusable evidence, or documented blocker;
4. follow the bounded loop `understand → consult → reconcile → plan → validate → preview → approve → execute → reread → recover → record`;
5. make the narrowest reversible change and preserve unknown, foreign, and runtime-owned state;
6. return evidence, blockers, and a rereadable receipt; and
7. update the project record so future tasks can find the result without relying on chat history.

Handoffs occur only at a clean boundary or with explicit user direction. A handoff must preserve the active goal, current plan, ownership state, provenance, blockers, and next action. There must be one active Foreman at all times.

All successful isolated work must be reviewed and reintegrated into the primary DiceBox Campaign Helper project. Work that cannot yet be promoted remains explicitly provisional or blocked in the knowledge base.

## Outcome-first execution

The Foreman keeps one active, user-visible outcome at a time. Before implementation, the outcome has a compact change card: acceptance observation, owner, exact target and authority, allowed write scope, one deterministic check, one live check where needed, and a stop/recovery condition. Work outside that card is parked rather than pursued in parallel.

Workers receive disjoint artifact or evidence scopes and return one compact receipt. They do not continuously monitor, restage, or update shared governance surfaces. The Foreman alone integrates results and authorizes the next live operation. Limit active work to one build item, one live item, and one research/recovery item.

Every result must state its evidence layer: research, local, staged, fixture, Ballad, or player-accepted. A layer never implies a later layer. On the second failure of the same runtime class, stop retries and new repair transports; capture the error, query the KB, perform bounded research if needed, reduce it to a reproduction, and validate the narrow fix before a fresh live attempt.

Use the detailed operational model in [CODEX-OPERATING-MODEL-POSTMORTEM-2026-08-22.md](CODEX-OPERATING-MODEL-POSTMORTEM-2026-08-22.md). It preserves the bounded evidence loop while reducing duplicate context, overlapping writes, and non-decision status work.

The current consolidated execution rules are [CODEX-WORKFLOW-RULES-2026-08-22.md](CODEX-WORKFLOW-RULES-2026-08-22.md). When workflow conventions conflict, the newer accepted revision wins; it never relaxes safety, target authority, preservation, or reread rules.
