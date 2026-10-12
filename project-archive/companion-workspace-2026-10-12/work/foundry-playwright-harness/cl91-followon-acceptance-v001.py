from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
report=r/'docs/CL91-M2-U2-FOLLOWON-STAGES-2026-10-08.md'
text='''# CL91 M2 and U2 follow-on narrative stages
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

## M2 Founder Portrait
- Observing the Founder Portrait and installing its Signet to open the hidden survey compartment remain independent; `founderPortraitObserved` cannot be aliased to `founderPortraitOpened`.
- Original Signet pickup must remain unchanged. An additional automatic enter event on its Region may overlap the existing pickup and race the global ledger writes. Do not install two overlapping asynchronous writers without a verified serialized or separate manual inspection trigger. No M2 live change in this work unit.
- Stage an observer source and an event-ownership / order safety review before promotion. The existing Portrait Notice may be used for discovery but it is not equivalent to physical opening.

## Acceptance and tests
- Exact ledger and Region hashes, 21 Scenes, 202 Regions, 117 behaviors, 33 Items, no non-GM viewers in live executor; source offline tests and no-write live preview before any U2 APPLY.
- No source override of original Notice handlers. No roll-success gate, no automatic Item recovery, no assertion of player gameplay acceptance.
- M1 clock 4:35 remains source-installed. N3-to-T3 branch and CL50 teleports remain separate quarantined work.
'''
if report.exists():raise SystemExit('STOP report exists')
report.write_text(text,encoding='utf-8')
s=road.read_text(encoding='utf-8-sig')
anchor='## CL-93 FINAL — Scene lighting and visual effects'
new='''## CL-91 U2 physical evidence → interpretation, and M2 observation event safety (2026-10-08)
**User-authorized source development:** U2 interpretation is a separate, authored conclusion reached only after physical servant-history traces and recorded visits to both the emptied servant rooms and nursery. Existing one-time Notice roll *success* is never mandatory. The precise culprit and timing remain unknown. M2 portrait observation is also separate from Founder’s Signet opening; no overlapping automatic write is allowed until the event-order safety design is validated. See `docs/CL91-M2-U2-FOLLOWON-STAGES-2026-10-08.md`. **Status:** U2 staged-design; M2 overlap risk remains open, no additional gameplay certification.

'''
if s.count(anchor)!=1:raise SystemExit('STOP roadmap anchor mismatch')
road.write_text(s.replace(anchor,new+anchor,1),encoding='utf-8')
s=check.read_text(encoding='utf-8-sig')
anchor='## CL-93 Scene lighting and visual effects — final stage'
new='''## CL-91 follow-on M2/U2 narrative interaction
- [x] Review current M2 and U2 Region source and the kernel Notice contract, preserving false-roll fallback.
- [x] Approve U2 distinct interpretation only after servant-history traces and recorded visits/attempts to both servant quarters and nursery; neither successful Notice roll nor same-Actor possession required.
- [ ] U2 source offline fixture tests, exact guarded no-write live PREVIEW, and one authorized RegionBehavior install followed by separate final readback/checkpoint.
- [ ] M2 portrait observation source and serialized input trigger design to avoid racing the existing Signet-pickup behavior.
- [ ] Actual player operation and narrative acceptance deferred until the final campaign test.

'''
if s.count(anchor)!=1:raise SystemExit('STOP checklist anchor mismatch')
check.write_text(s.replace(anchor,new+anchor,1),encoding='utf-8')
print('AUTHORING_RECORDED',report.name,road.name,check.name)
