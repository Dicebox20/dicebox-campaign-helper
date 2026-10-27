# Cabin in the Ashen Veil — Cross-workstream handoff: puzzle chains independent; GM-roleplayed haunts implemented last

**October 26, 2026 Pacific.** Authoritative OWNER change, quote verbatim:

> we will finish the Crooked Man encounters last, haunt encounters will be checkpoint related, not directly tied to the puzzle chains. ill be roleplaying those bits

## Immediate new order of work
1. Finish the genuine early/mid/late **puzzle mechanics and source provenance** with full item/Region/reward/teleport progression that does **not require** an encounter.
2. Complete all remaining non-haunt content including Crimson Veil, book spine mosaic, original Silver Key physical claim, Vault Keystone, outer/inner Undercroft and ending.
3. LAST content installation stage: GM-controlled Crooked Man/haunt checkpoint system and associated manually run encounter support.
4. **After all content installed**, owner-requested combined compatibility diagnostic and actual non-GM player acceptance.

## Remove chase-as-puzzle-gate assumptions only after exact source audit
- Chat A early Aqueduct chase/Forest Well: `studio-cav-first-chase.js` invokes `unlockForestWellAfterChaseGM()` on completed escape/capture. Need an independent legitimate route/progression contract. Do NOT auto-trigger chase to unlock the well.
- Chat B late SG-01 → Silver Tiny Key → Hope Chest/Ornate Music Box/Prayer/Workshop: old contracts require chase completion to reveal key. The Silver Key must instead have a legitimate independent physical discovery/acquisition path, with original World Item identity and no duplicate/granted free key. SG-01 haunt may remain GM-triggerable from a checkpoint without being a requirement for the key.
- Any original first-chase-dependent late-chase eligibility, Sophia capture consequences, Waterworks/Veil encounter shutoff, and similar haunt-specific flags must be classified as **optional encounter-state** distinct from puzzle-state.
- Preserve existing dormant first/second chase RegionBehaviors as disabled, unless a later migration explicitly replaces them with separate manual GM controls. Do not prematurely install or play out the haunts.

## Source/approval details
- Owner is in charge of roleplaying those encounter scenes personally. Provide manual GM readiness cue and optional cinematic mechanics later; avoid scripted dialogue and autonomous outcomes by default.
- Standing delegated Cabin creative/technical approval applies to independent puzzle reward and transit redesign, but no fictional completion transactions or loss of established lore.
- Chat A source branch `codex/cav-sune-integration-20261026` last verified `f3c1bfccf077ec9d3b4d97573889289dd6b598f0` (246/246 source regressions at Bowl native commissioning). Chat B source branch `codex/cav-late-game-chat-b-20261026` contains newer late-game native evidence; exact current tip must be fetched when work resumes. Do not blindly merge shared module/world registries.
- This handoff is a **scope and plan correction**, not a runtime change or claim that old chase-dependent scripts are already fixed. Preserve chronological transcript and source receipts after subsequent work.

[Binding owner decision](../decisions/2026-10-26-owner-haunt-checkpoints-gm-roleplay-decouple-puzzle-progression.md)

## Exclusive Silver Key / Forest Well workstream ownership — coordination correction

**Coordination correction, October 26, 2026.** The owner reported that Chat B's Silver Tiny Key staging update was interrupted during verification and subsequently reconciled: its pickup Behavior was disabled again; first and second Crooked Man chase triggers remained disabled; no Silver Key or progression reward was granted. This is **owner-supplied Chat B status**, not independently verified by Chat A in the live world in this correction turn.

- **Chat B exclusively owns** the late SG-01 Silver Tiny Key source, physical marker/pickup Behavior, reconciliation and regression tests, and subsequent Hope Chest/Music Box/Prayer puzzle-chain implementation. Chat A must NOT install, retry, activate, delete, or reset a Silver Tiny Key Behavior or its claim ledgers.
- **Chat A exclusively owns** early/midgame independent Aqueduct/Forest Well progression, related route gates and puzzles. Chat B must NOT modify Forest Well unlock or original Aqueduct routing/source.
- Both work in **one shared Foundry world** despite separate Regionwright Git branches. Treat a counterpart's region as read-only, do not run competing uncoordinated reloads, and require exact live state/source SHA + handoff before any cross-owner integration.
- **Haunt/Crooked Man work** remains last and GM-directed, not a prerequisite for either worker's ordinary puzzle progress. This is an ownership separation, not proof either Silver or Forest Well is installed/working.
- Prior coordinator wording “next priority: give the Silver Tiny Key and Forest Well their independent puzzle progression paths” was a **joint backlog statement**, not permission for Chat A to work on Silver Key.
