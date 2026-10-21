# Cabin in the Ashen Veil — Puzzle Dependency Checkpoint

Status: design audit, **not** implementation, not a repository/KB promotion. Date: 2026-10-19.

## Hard established constraints
- Old Iron Key: parents' bedroom coat pocket; unlocks Sophia's bedroom. Captured player can alternatively be released by GM after 20 minutes IRL; GM relocks room after exit.
- Brass Key: unlocks Study. Desired pacing: around mid-campaign; **location/reward not yet finally approved**. Proposed as sliding Sune portrait reward in Memorial Clearing.
- Study: note has code **587** for Donovan's Shack lockbox; Tiny Key in tinker's basket, which opens grandfather clock containing oversized chimney hour hand; Rufus taxidermy.
- Donovan's Shack lockbox `587`: sluice hand crank; crank drains pond.
- Drained pond: Weathered Key (basement spare dropped while fishing); ruined toy; exposed stone stairs and broken gear at aqueduct door.
- Basement/father's workshop: aqueduct manual handle, accessible after obtaining Weathered Key.
- Attic: chimney minute hand, one storybook. Upstairs windows → roof; chimney clock set to noon and center button pressed → replacement aqueduct gear. Chimney flue: a separate storybook independent of clock puzzle.
- Aqueduct door: replacement gear + basement handle needed; then passage → Donovan chase → forest well → reverse maze → gazebo.
- Spine Mosaic: 2 books on Sophia shelf, 1 pond hollow log (Felix Fox...), 1 attic box (well-worn), 1 gazebo, 1 chimney flue. Six-book chronology and hidden room contents TBD.
- Sune main statue: later bowl + early G02 `027` Dust of Dryness pellet → undercroft access. The portrait is a separate feature in the Memorial Clearing.

## Circular dependency detected
If **pond drainage is necessary to reveal portrait**, and **portrait rewards Brass Key**, then:
portrait → Brass Key → Study → code 587 → sluice crank → drain pond → portrait. **IMPOSSIBLE WITHOUT BYPASS**.

## Reconciliation proposal awaiting user decision
Keep portrait visible and operable from initial Memorial Clearing access; completing it rewards Brass Key, opening Study and enabling intended pond chain. This is a **proposal, not accepted canon**; the previous suggestion that pond drainage reveals the portrait is blocked by circularity. Timing becomes discovery-based rather than a hard mid-campaign gate. If mid-campaign key acquisition must be enforced, design a different upstream prerequisite **that does not depend on Study / crank / pond** or rethink code clue placement with explicit approval.

## Other open questions
- Exact gating of Brass Key and pacing.
- Remaining item/reward for Rufus, Spine Mosaic hidden room, gazebo, father final vault.
- Exact role of four final rewards and vault placement.
- Campaign skill checks deferred until per-map features and puzzles are finalized.
- All Foundry/Point Board/Regionwright implementation requires independent authority and verification.

## Dependency check rule for every change
For each proposed puzzle dependency A requires B: trace backward from B to all prerequisites. If any path returns to A, flag CYCLE and do not approve. Separately distinguish hard item gate, combination knowledge, environmental reveal, and anticipated discovery time.
