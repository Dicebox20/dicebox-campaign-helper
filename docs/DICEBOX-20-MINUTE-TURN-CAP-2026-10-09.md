# DiceBox — 20-minute work-turn cap (accepted 2026-10-09)

**Status:** USER-ACCEPTED / active operations rule.  
**Applies to:** Every DiceBox Campaign Helper / Codex Foreman work turn processing one user instruction, including creative scene work, Github/KB synchronization, diagnostics, Bridge coordination, software work, and remote-runtime review.  
**Intent:** Prevent context and connection failures from consuming unbounded time or leaving an unrecoverable state. This policy is about **elapsed work time**, not a timed notification or an authorization to perform background activity.

## Hard limit

1. **20 minutes maximum elapsed wall-clock per user turn**, starting when work on that user's request begins. Finish sooner whenever practical. This is not a request to artificially extend work to 20 minutes.
2. Reserve the final available minute(s) for the handoff rather than launch new long-running work near the limit. At or before the cap **stop**, even if the task remains incomplete. Do not continue indefinitely through successive tool calls or make undocumented asynchronous plans.
3. If a requested step cannot safely be interrupted (transaction in progress, exact-run verification, external side effect), prefer not to start it unless there is sufficient time to finish and verify. If a remote action times out or its outcome is unknown, report **OUTCOME_UNKNOWN** with the exact target and receipt reconciliation needed. Do not retry blindly.
4. Provide user-visible progress during significant work and **always leave a checkpoint** at the cap or at task completion:
   - User goal and exact asset / source version/hash.
   - Completed, durable files/links and commits; distinguish verified persisted state from local or proposed state.
   - Tests performed and results, including tests **not** performed and whether a PASS was only structural/proxy.
   - Current stage/gate: PASS / NEEDS_RECONCILIATION / REDO / BLOCKED, with specific reasons.
   - Unfinished next steps, blockers, state authority, rollback/recovery instructions if relevant.
   - Side effects or confirmation of no live-world changes.
5. For meaningful work that changes repo/KB or runtime artifacts, save **versioned, chronological checkpoints** on the authorized project authority plane. Do not overwrite historical evidence. A checkpoint can be a branch commit or an explicit report of why persistence failed; don't claim publication without a verifying reread.
6. **Next user turn = new independent 20-minute budget.** Continuing the unfinished task requires user follow-up or a separately authorized scheduled workflow; never imply an agent is still working after delivering its capped answer.
7. Do not omit safety, approval, source-check, destructive-action, or player-canary gates simply to finish within the cap. If a gate cannot complete, stop at the gate with a bounded handoff.
8. The cap governs agents that actually load this repository contract. It **does not automatically reconfigure the ChatGPT platform, project settings, Codex runtime deadlines or a background task scheduler**. A future chat should load this file (or the root AGENTS.md link). If the clock cannot be read precisely, use the host time if available and a conservative elapsed estimate; report timing as unverified rather than falsely claiming exact enforcement.

## M02 recovery example

At the user's 2026-10-09 request, the M02 attempt #5 v003 candidate data and prior QA survived in `maps/btr-m02-tallcap-forest-prepare-20261009`: 203 walls, six Regions and anchors, non-self-crossing main/north/south candidate routes with **modeled** five-foot Medium sweeps. PR #13 merged the dated v003 KB evidence to `main`. The gate remains **NEEDS_RECONCILIATION** because critical ground-wall alignment was estimated at ~0.703ft uncertainty, above the accepted 0.5ft preference; do not claim live Foundry verification or PAINTERLY RENDER readiness.

## Evidence and precedence

Explicit user request: "put a 20 minute cap for each turn" in DiceBox project chat 2026-10-09. This rule is additive to `AGENTS.md`, project mission/Foreman procedures, database-first chronology and all existing Foundry and image prompt clean-restart safety gates. It does not increase tool permissions, change billing, or authorize background work.
