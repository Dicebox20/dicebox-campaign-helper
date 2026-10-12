from pathlib import Path
root=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
spec=[
 ('docs/CENTRAL-LODGE-ROADMAP.md','## CL-93 FINAL',
 '''## CL-13 / CL-91 accepted M1 puzzle: The Seventh Winter (2026-10-08)
**User accepted:** The grandfather clock solves at **4:35** after inserting the Silver Family Emblem. The clock inscription sends players to U1 genealogy (youngest/fourth heir -> IV hour) and E4 family grave chronology (patriarch 1431 DR, matriarch 1438 DR -> seven-year interval, VII on clock -> 35 minutes). Dates and fourth-heir detail are newly authored, not historically recovered, and must be checked for existing story conflicts before live clue injection. Incorrect entries cannot consume Items or softlock the puzzle. On correct entry set only the canonical `puzzles.m1.clockSettingResolved` via a guarded authoritative writer; retain separate downstream Family Reliquary Key and Brass Baggage Token pickup behaviors. No auto-award; preserve M1 audio, U1/E4 observation content, M2/U2 stages, ledger ownership and source hashes. Exact placement of hints must not alter map art or geography. User reserves real gameplay acceptance for final campaign testing.
**Implementation status:** APPROVED DESIGN; runtime installer and clue delivery require governed PREVIEW / APPLY / independent VERIFY. Prior CL-50 railway installer quarantine unaffected.

'''),
 ('docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md','## CL-93 Scene lighting',
 '''## CL-13 / CL-91 — The Seventh Winter (accepted 2026-10-08)
- [x] Explicit user acceptance of M1 fixed-time clock design: 4:35; IV fourth/youngest heir from U1 genealogy, VII seven-year grave interval from 1431 DR and 1438 DR E4 epitaphs.
- [x] Confirm live existing M1 Clock Setting Region `3tIrR12uv8ppFkOb` is empty and clock compartment already has two separate guarded reward behaviors; U1 Family Records and E4 graveyard Regions exist.
- [ ] Reconcile approved design, canon chronology, source provenance and exact invariant with KB; rebuild/verify before implementation.
- [ ] Build no-write PREVIEW for new clock behavior and clue integrations: no edits to geometry, map art, existing rewards, inventory or unrelated story sources.
- [ ] Guarded one-action installation through authorized GM and authoritative independent reread of expected IDs, state and source.
- [ ] Player-facing final acceptance is deliberately deferred until the user completes whole-campaign testing; no automatic gameplay-certified claim.

''')];
for rel,anchor,insert in spec:
 p=root/rel;s=p.read_text(encoding='utf-8-sig')
 if insert.strip().splitlines()[0] in s:
  print('ALREADY_RECORDED',rel);continue
 if s.count(anchor)!=1:raise RuntimeError(f'Expected unique anchor in {rel}: {s.count(anchor)}')
 updated=s.replace(anchor,insert+anchor,1)
 tmp=p.with_suffix(p.suffix+'.cl13tmp');tmp.write_text(updated,encoding='utf-8');tmp.replace(p)
 print('UPDATED_ACCEPTED',rel)
