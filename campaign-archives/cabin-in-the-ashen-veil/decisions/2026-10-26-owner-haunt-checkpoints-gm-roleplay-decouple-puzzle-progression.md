# Owner canon / workflow override — Haunt encounters are GM-roleplayed checkpoint events; Crooked Man encounters last

**Date:** October 26, 2026, America/Los_Angeles.
**Scope:** Cabin in the Ashen Veil only.
**Authority:** Latest explicit owner direction supersedes older chase-as-necessary-puzzle-prerequisite specifications. This supplements the owner's existing Cabin creative/technical authority delegation and installation-first compatibility-test sequencing.

## Owner's statement (verbatim)

> we will finish the Crooked Man encounters last, haunt encounters will be checkpoint related, not directly tied to the puzzle chains. ill be roleplaying those bits

## Binding design rule

1. **Implementation order:** Complete the main puzzle chains, item/Region rewards, scene navigation, final-game content and stable campaign source before implementing/finalizing Crooked Man encounters or other haunt mechanics. **Crooked Man encounters are LAST in the content installation schedule**. Once all content including haunts is installed, run the previously requested full compatibility diagnostic and non-GM player testing.
2. **Architectural separation:** Haunts are **story/checkpoint-layer events**, not mechanical prerequisites for puzzle-chain unlocks, rewards, traversals, Sune/Study/Aqueduct/Gondian source/Crimson Veil/Vault/Undercroft progression. A player need not complete a Crooked Man encounter to receive ordinary puzzle rewards. Checkpoint readiness is distinct from an encounter being GM-started, completed, escaped or survived.
3. **Owner roleplay authority:** Owner is GM and personally portrays Crooked Man/other haunt encounters. Never substitute automatic AI dialogue, an autonomous chase outcome, or a mandatory scripted trigger that starts/solves a haunt without an explicit GM action. GM-facing readiness cues, manual launch/stop/reset controls, scene/audio/lighting staging, optional encounter records and discretionary consequences are appropriate once the haunt phase is implemented.
4. **Progression safety:** No fake player Item receipts, Crank/water, chase or haunt outcomes to unblock a chain. Instead, find and implement **independent genuine puzzle provenance** for each reward/portal that previously depended on chase resolution. Preserve unique original Items, complete once-only GM transaction safety, approved Scene artwork and accurate provenance.
5. **Checkpoint policy:** Which scenes/story moments cue a haunt can be chosen/designated in the later encounter phase under delegated Cabin creative/technical authority, but the GM must decide whether/when to play it. Checkpoint reached != haunt automatically initiated.
6. **Scope:** Existing separately constructed dormant chase Behaviors may remain safely disabled during puzzle installation; don't enable or execute them as a workaround. Do not erase historical designs or change unrelated campaigns' encounter systems.

## Known old dependencies to revisit (not silently fixed by this document)

- **First Aqueduct chase → Forest Well and Sophia capture/rescue.** Existing `studio-cav-first-chase.js` has a chase completion/escape path that calls `unlockForestWellAfterChaseGM`. Reconcile this with the independent physical, narrative and puzzle travel requirements so ordinary progression/return does not require the owner to run a haunt. Optional GM-authored capture/rescue consequence remains a separate event. **No live behavior was changed in this decision-recording turn.**
- **Second SG-01 northwest bust chase → visible Silver Tiny Key → Parents Hope Chest → Ornate Music Box and Prayer of Protection → Workshop Wick.** Older Chat B contracts require a chase outcome before Silver Tiny Key drop. Under this new owner instruction, design and implement a **separately obtainable, genuine physical Silver Tiny Key** and persistent claim ledger without requiring a completed chase. The late SG-01 haunt may be linked to a checkpoint but must remain optional/GM-initiated. Keep the established Silver Key identity and Hope Chest chain; do not simply grant the key.
- **Other chase status consumers**, including early first-chase completion as a prerequisite for late chase and any Crooked Man hostile shutoff at Crimson Veil, must be inventoried. Treat haunt narrative sequencing as GM-controlled optional state rather than a puzzle dependency.
- **Source governance:** Chat A and Chat B use separate Regionwright branches/checkpoints in one live Foundry world. Reconcile source contracts and install changes with original IDs and guarded verification; do not assume this decision has already been coded or deployed.

## Evidence and adoption state

Existing late-game evidence matrix on `Dicebox20/regionwright` branch `codex/cav-late-game-chat-b-20261026` explicitly lists the SG-01 second chase → Silver Key and Hope Chest dependency. Existing `studio-cav-first-chase.js` contains the Forest Well unlocking call. These are **superseded design dependencies** and need source/native adjustment in a future installation batch.

**Current action in this conversation:** OWNER DECISION RECORDED; SOURCE / NATIVE / PLAYER-SCENE CHANGES **NOT YET PERFORMED**. The earlier planning figure of roughly 70% substantial puzzle setup is an unaudited estimate and is not an acceptance result; the new haunt separation changes scope/order, not evidence of already installed mechanics.

## Related records

- [Owner's earlier Cabin creative/technical delegation](./2026-10-26-owner-cabin-creative-technical-delegation-and-fixtures.md)
- [Implementation continuation handoff](../handoffs/cav-owner-haunts-last-checkpoint-driven-puzzle-decoupling-handoff-2026-10-26.md)
