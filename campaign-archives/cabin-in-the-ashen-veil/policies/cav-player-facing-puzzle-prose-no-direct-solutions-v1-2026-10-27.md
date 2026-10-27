# Cabin in the Ashen Veil — Player-Facing Puzzle Writing Standard (Owner-Directed)

**Adopted:** October 27, 2026 Pacific. **Authority:** Owner's explicit instruction to audit all player-facing text and remove direct puzzle-solution instructions. Applies to Chat A and Chat B, existing material, staged Regions, future puzzle installation, journal/scene descriptions, dialog windows, buttons, prompts, notifications, private/public chat, and player-accessible item text. This is a player-facing writing rule, not a change to underlying puzzle mechanics or GM control.

## Non-spoiler rule

**Describe what characters perceive, never tell players how to solve a puzzle.** Present visible wear, materials, shapes, scratches, smells, noises, mechanisms, danger and observable changes. Preserve meaningful *discoverable clues* without naming the intended exact reward, tool, key, character, origin location, solution order, numerical answer, explicit success threshold or check DC before the players learn it organically. Avoid phrases such as "Bring the character holding the carriage key up to the door to open it," "The drawer needs the Screwdriver from the Bathhouse," "Drain the water first," or "You need the old iron key from the Parents' coat."

Where the player must choose an action, offer a concise neutral UI label (for example, "Examine the Fastener," "Try the Square Socket," "Try the Lock") without advertising the intended puzzle item or providing the solution. Do not remove a control that is necessary for genuine gameplay, nor obscure ordinary operational error reporting beyond safe use. When a player **has already solved** or earned something, describe the actual outcome, including what was revealed. GM-only verification prompts, ledger-reconciliation messages, code comments, administrative names, and real mechanical source checks are permitted to state the underlying rules; they are **not** player-facing guidance.

### Approved Family Carriage example

**Before (rejected):**
> The family carriage sits beneath its rotten canopy. A substantial iron lock holds the door shut. The keyhole is shaped for a long, old-fashioned key. Bring the character holding the carriage key up to the door to open it.

**After (installed on original enabled RegionBehavior):**
> The family carriage sags beneath its rotting canopy, its lacquered panels dulled by years of neglect. A heavy iron lock holds the door fast, its surface pitted with rust. Beyond the warped glass, the interior waits in darkness. The handle rattles beneath your touch, but the door refuses to yield.

## Implementation QA gate

Retain original campaign story/lock/claim/item provenance, puzzle DC and validation, actor custody, GM authorization, disabled gates and staged content. When modifying a live script: establish exact source and original Document UUID, edit quoted player-facing text only, verify source/Behavior events/flags/disabled state, perform independent elected-GM readback and all applicable source regression tests, catalogue old/new wording chronologically. Avoid replaying progression or granting a reward to test prose. Preserve historical ChatMessages and source snapshots, not rewrite them. Validate *actual non-GM output* when scheduled; string-source verification alone is not real player acceptance.

**Runtime caveat:** Foundry in-session module imports or installed pointer handlers may retain pre-update strings. Source-file updates are not proof an already-open player dialog has refreshed. Coordinate any required module/browser reload with Chat B rather than disrupting concurrent work.

## Current implementation checkpoint

Regionwright [source report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-player-facing-puzzle-text-anti-spoiler-audit-2026-10-27.md) and [complete before/after manifest](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/player-facing-puzzle-nonspoiler-text-audit-manifest-2026-10-27.json). Source commit **`83401ee6cacb45e2ab81ab9f83853c62f9ff4a56`** independently remote-verified. **70** text passages revised across **11** original native RegionBehaviors, **8** Regionwright modules and **1** existing First Chest macro; **278/278** source tests passed, no mechanical/player progress changes. Not certified exhaustively through every runtime UI route.
