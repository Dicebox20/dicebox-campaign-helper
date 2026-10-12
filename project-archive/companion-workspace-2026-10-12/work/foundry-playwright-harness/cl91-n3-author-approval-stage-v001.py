from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
doc=r/'docs/CL91-N3-T3-BRANCH-UNLOCK-CANDIDATE-2026-10-08.md'
old=doc.read_text(encoding='utf-8')
a='**Status: PROPOSED — NOT AUTHOR-APPROVED / NOT INSTALLED (2026-10-08).**'
b='**Status: USER-APPROVED THREE-PROOF LOGICAL GATE (2026-10-08); NOT YET INSTALLED.** Explicit user authorization in this conversation: Departure Board resolved AND Railway Switch Wheel installed AND Cartography Overlay resolved. The N3-to-T3 teleport/route installer is separate and remains quarantined.'
if old.count(a)!=1:raise SystemExit('STOP dossier status drift')
old=old.replace(a,b,1)
heading='## Proposed three-proof rule (requires explicit user approval)'
if old.count(heading)!=1:raise SystemExit('STOP dossier section drift')
old=old.replace(heading,'## Approved three-proof logical unlock rule (2026-10-08)',1)
ask='**Approval decision requested:** Should N3→T3 require exactly the three proofs `departureBoardResolved && switchWheelInstalled && routeOverlay.resolved`, or do you want a different story prerequisite? The current branch remains untouched until accepted.'
if old.count(ask)!=1:raise SystemExit('STOP dossier approval ask changed')
old=old.replace(ask,'**Author decision received:** Approved exactly the three-proof AND gate and requested continued guarded implementation. This is explicit approval of the *logical unlock only*, not railway travel. The branch remains untouched until guarded installation completes.',1)
doc.write_text(old,encoding='utf-8')
s=road.read_text(encoding='utf-8-sig')
a='**Proposed, not installed:** Unlock N3 Branch Railway only after Departure Board resolved AND Railway Switch Wheel installed AND complete Cartography Overlay. N3-to-T3 transport remains separately quarantined under CL50.'
b='**User-approved for guarded logical gate implementation (2026-10-08):** Unlock N3 Branch Railway only after Departure Board resolved AND Railway Switch Wheel installed AND complete Cartography Overlay. N3-to-T3 transport remains separately quarantined under CL50.'
if s.count(a)!=1:raise SystemExit('STOP roadmap clause drift')
s=s.replace(a,b,1)
a='Explicit campaign author approval of this new logical prerequisite is still required. Live N3 flag `t3BranchUnlocked=false`, branch Region empty, ledger revision2.'
b='Explicit campaign author approval was received in this conversation; gate implementation is now authorized following KB reconciliation, exact PREVIEW, one guarded install, independent verification and checkpoint. Live N3 flag `t3BranchUnlocked=false`, branch Region empty, ledger revision2 before installation.'
if s.count(a)!=1:raise SystemExit('STOP roadmap approval clause drift')
road.write_text(s.replace(a,b,1),encoding='utf-8')
s=check.read_text(encoding='utf-8-sig')
a='- [ ] Obtain explicit campaign author approval or revised prerequisite logic.'
b='- [x] Explicit user approval received for exactly the three-proof AND gate; railway teleport remains separate and unapproved.'
if s.count(a)!=1:raise SystemExit('STOP checklist approval clause drift')
check.write_text(s.replace(a,b,1),encoding='utf-8')
print('N3_APPROVAL_RECORDED_IN_ROADMAP_CHECKLIST_DOSSIER')
