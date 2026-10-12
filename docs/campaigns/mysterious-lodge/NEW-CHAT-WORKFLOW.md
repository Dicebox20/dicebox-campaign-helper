# The Mysterious Lodge — New Chat Continuity Workflow

**Goal:** let a fresh ChatGPT/Codex conversation resume the *same adventure and same next task* without repeating previous investigations, inventing new architecture, or treating static diagnostic passes as gameplay proof.

This is a **short operational index** to existing [START-HERE.md](START-HERE.md), [MAINTENANCE.md](MAINTENANCE.md), and repository/foundation rules. It does not replace their mandatory verification or Foundry authorization checks, and it creates no scheduled job, background agent, or independent state system.

## New chat: the five-minute handoff

1. **Locate the same repository.** Open [START-HERE.md](START-HERE.md) and follow the established one-time orientation and required read-only handoff verification. If the local repo is unavailable, use the versioned portable archive linked from [PORTABLE-HANDOFF.md](PORTABLE-HANDOFF.md) and label runtime status **not verified**. Do not assume the latest global product checkpoint belongs to this campaign.
2. **Read these two records first:** [CURRENT-STATE.json](CURRENT-STATE.json) (machine-readable last **verified** state, evidence receipt, and nextAction) and [CHANGELOG.md](CHANGELOG.md) (what actually changed, in sequence). Use [SESSION-HANDOFF.md](SESSION-HANDOFF.md) for context. Consult [CREATIVE-CANON.md](CREATIVE-CANON.md) and [PUZZLE-ROUTES.md](PUZZLE-ROUTES.md) for the exact Scene/puzzle being played.
3. **Reconcile, don't replay.** Confirm the latest installed change against its saved receipt and, *only when taking runtime action*, current Foundry state. A prior install receipt proves only the recorded installation, not that the current world is still running or the player trigger works. If a native action's outcome was uncertain, inspect it before any replay.
4. **Give the owner a four-part kickoff, then stop:** (a) last verified player test, if any; (b) last installed change and its proof level; (c) the one current gameplay blocker/unknown; (d) the single next character action to test. State clearly if campaign work is paused. Do **not** start testing, launching Foundry, connecting Bridge, or editing game content solely because a chat reopened.
5. **Resume only when authorized.** Follow the original player route from E1, reproduce the first actual failure, make the smallest fix necessary, and immediately retest **that** action. Resume gameplay at the interrupted point. Use any broader diagnostic only when needed to explain an observed blocker, not as an automatic development phase.

## During a playtest: player-first loop

**Play → observe → record the actual failure → narrow fix → replay the same interaction → continue.**

Use this compact entry in [CHANGELOG.md](CHANGELOG.md) for accepted changes or confirmed blockers:
- Exact Scene and player's action; expected vs. observed result.
- One precise fix (or **no fix yet**) and the test-world/behavior ID when appropriate.
- Verification level: Designed, Staged, Installed, Gameplay-tested, Playthrough-accepted, or Blocked/uncertain.
- Proof path or actual Foundry observation; remaining blocker; next character action.

Do not label a syntax check, source hash, mock test, successful UI preview, installed macro, or token transfer API response as a completed gameplay test. An actual gameplay test must observe a character performing the relevant interaction in Foundry.

**Stop/contain conditions:** one uncertain write or teleport, absent current active-GM/target/owner authority, unverified backup, or two repetitions of the same failure class. Preserve the scene and state, report the blocker, and do not automatically retry. The repository/foundation safety rules still govern edits. No automated reset of player state just to obtain a clean pass.

## End of a bounded work session

1. **Append to CHANGELOG only if something meaningfully changed or a genuine gameplay blocker was confirmed.** Don't document routine status-only probes as accomplishments.
2. **Update the existing** [CURRENT-STATE.json](CURRENT-STATE.json) **and** [SESSION-HANDOFF.md](SESSION-HANDOFF.md) with the same last completed unit, strongest proof level, exact next action, and still-unknown points. Avoid creating another 'latest' file.
3. If the owner approved a creative change, record it via the existing [DECISIONS.jsonl](DECISIONS.jsonl) and [CREATIVE-CANON.md](CREATIVE-CANON.md), then reconcile [PUZZLE-ROUTES.md](PUZZLE-ROUTES.md). Technical scripts do not automatically establish canon.
4. Use existing [MAINTENANCE.md](MAINTENANCE.md) steps for read-only verification, deliberate resealing when required, and new versioned offline backup at a real handoff boundary. Don't invent a new verifier or package for each diagnostic.
5. Report in ordinary language: **what we actually fixed, what the character proved, what remains broken, and exactly where play resumes**. A test-world backup is not a player acceptance test.

## Current inherited baseline (as of 2026-10-11 handoff)

- **Identity:** The Mysterious Lodge (formerly Central Lodge), not House of the Damned. 21-Scene puzzle-driven mystery. Creative ending unresolved.
- **World:** disposable `dbx-test-world` on **port 30005** (port 30000 is **not** this test); recheck its live status before acting.
- **Last proven install:** owner-approved two-stage N3 cartography, two existing RegionBehavior sources installed and independently reloaded, verified by `work/clscale-central-lodge-migration-v001/n3-two-stage-20261010/n3-two-stage-live-install-once-receipt.json`. A complete preinstall backup covered 181 files.
- **Not yet proven:** actual character Region/Item triggering, the physical N3→T3 Scene transfer, and an E1→F2 full playthrough. Previous 39/39 local tests were **not** a live playthrough.
- **Next unit already named:** `MLODGE-N3-TOKEN-ENTRY-001`, but only *after* the owner lifts the campaign/Foundry pause and the live test conditions are verified.
- **Current pause:** the owner previously paused campaign, Foundry, and product implementation for a Bridge check. This documentation request **does not automatically resume** them.

## Copyable opening message for a new chat

> Continue **The Mysterious Lodge** from the project repository, not from assumed chat memory. Follow `docs/campaigns/mysterious-lodge/START-HERE.md` and `NEW-CHAT-WORKFLOW.md`; read `CHANGELOG.md`, `CURRENT-STATE.json`, and `SESSION-HANDOFF.md`. First tell me the last verified player action, last installed fix and its verification level, outstanding blocker, and the single next playtest action. Distinguish staged, installed, and gameplay-tested. Do not start Foundry, perform gameplay automation, or change anything until I explicitly authorize resuming. Use the playtest-first approach, not another broad diagnostic cycle.
