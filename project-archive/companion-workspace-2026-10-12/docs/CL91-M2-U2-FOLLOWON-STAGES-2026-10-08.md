# CL91 M2 and U2 follow-on narrative stages
**2026-10-08 | Accepted story-link interpretation design, source-first; no gameplay certification**

## Evidence
- M2 Portrait Notice Region `fMT43gKz5Am84FEi` already gives a separate eye-recess clue via a one-time d20 Notice, not portrait observation ledger state. M2 Founder Portrait Region `FRY091GwobgD2M5i` presently triggers Signet-gated Old Estate Survey pickup with `founderPortraitOpened`.
- U2 Servant History Region `qa4n4o834OZTKPoV` already records physical traces as `servantHistoryObserved`. Servant Room Absence Notice `UsCSlj3KWoPGpT5L` and Nursery Contradiction Notice `UXQMAhtVpmZVrwsR` independently record per-Actor `attempted` (whether success or silent failure); successful one-time rolls are NOT safe interpretation prerequisites.
- CL91 canonical ledger revision 2 contains all four distinct booleans as false. Three new story claims must not be invented: the exact culprit, the date of intervention, or the ultimate fate of the household.

## U2 bounded authored interpretation
- New `tokenMoveIn` RegionBehavior coexists with the original `tokenEnter` trace observation. Wait for `movement.finished===true` and confirm Token position, same Actor, the active primary GM, and request User ownership.
- Require canonical `servantHistoryObserved===true` and at least one household visit/attempt recorded under each of `notices['u2.servant-room-absence']` and `notices['u2.nursery-contradiction']`. Notice failures still count: physical evidence remains examinable, so no rolls are needed to unlock the interpretation. Party-wide evidence counts, not same-Actor Notice success. `servantHistoryInterpreted` must still be false.
- Completion message: taken together, the rooms were deliberately cleared, but some nursery objects were later arranged. Their sequence is inconsistent with a simple uninterrupted abandonment. The actor and purpose remain unknown.
- Use existing authoritative runtime kernel `observe` only; no Items, teleport, walls, light, or geometry. Single-flight guard and stage reread. If event ordering causes source observation to commit late, revisiting the Region is a safe fallback.

## Installed U2 evidence (source-only)
- One bounded live create installed RegionBehavior `WOiGF1WlGZM3fO8I`, stable ID `dbx:central-lodge:u2:behavior:servant-history-interpretation-v001`, and event `tokenMoveIn` in the existing U2 Servant History Region. Stored source SHA `11bbc0837bf1a4ccc20c62b523f8b9acc1061078a585a1f7e36de5cc303c4b32`.
- Exact independent no-write FINAL VERIFY PASS: 21/202/118/33; original U2 observation, M2 Signet pickup, M1 clock and shared kernel SHA unchanged; ledger revision 2, all story stages still false.
- Offline fixtures 19/19 PASS. Real-player event delivery, movement and puzzle-state commit remain **untested**, reserved for final campaign playtest.

## M2 Founder Portrait
- Observing the Founder Portrait and installing its Signet to open the hidden survey compartment remain independent; `founderPortraitObserved` cannot be aliased to `founderPortraitOpened`.
- Original Signet pickup must remain unchanged. An additional automatic enter event on its Region may overlap the existing pickup and race the global ledger writes. Do not install two overlapping asynchronous writers without a verified serialized or separate manual inspection trigger. No M2 live change in this work unit.
- Stage an observer source and an event-ownership / order safety review before promotion. The existing Portrait Notice may be used for discovery but it is not equivalent to physical opening.

## Acceptance and tests
- Exact ledger and Region hashes, 21 Scenes, 202 Regions, 117 behaviors, 33 Items, no non-GM viewers in live executor; source offline tests and no-write live preview before any U2 APPLY.
- No source override of original Notice handlers. No roll-success gate, no automatic Item recovery, no assertion of player gameplay acceptance.
- M1 clock 4:35 remains source-installed. N3-to-T3 branch and CL50 teleports remain separate quarantined work.
