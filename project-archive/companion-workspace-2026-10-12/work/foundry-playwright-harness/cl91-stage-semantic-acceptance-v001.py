from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
heading='## CL-91 additive narrative-stage schema (2026-10-08)'
entry='''## CL-91 additive narrative-stage schema (2026-10-08)
**Governed implementation decision:** Preserve M2 Founder Portrait Signet RegionBehavior `IdriZEGhxUY9whcV` as a physical opening and Old Estate Survey pickup, with `puzzles.m2.founderPortraitOpened` independent from the preexisting `puzzles.m2.founderPortraitObserved`. Preserve U2 Servant History RegionBehavior `J11ZvQh4lqzEsvRi` as observing household evidence, with `puzzles.u2.servantHistoryObserved` independent from preexisting `puzzles.u2.servantHistoryInterpreted`. The kernel can dynamically write paths, so installed handlers need **no source edits**. Add exactly two false booleans to the canonical ledger state as an additive, governed schema migration only if exact read-only preview, snapshot preservation, authorized GM, and independent final verification pass. Do not set any of these four flags true in the migration. The narrative actions required to mark Founder Portrait *observed* or Servant History *interpreted* remain separate, currently unauthored stages. No automatic GM/player canary before user final campaign acceptance.
**Status:** ACCEPTED SEMANTIC RECONCILIATION; guarded ledger schema migration pending evidence. The M1 clock source and existing progression Items remain unchanged.

'''
a=road.read_text(encoding='utf-8-sig')
if heading in a:raise SystemExit('STOP roadmap change already present')
anchor='## CL-93 FINAL — Scene lighting and visual effects'
if a.count(anchor)!=1:raise SystemExit('STOP roadmap anchor missing')
b=a.replace(anchor,entry+anchor,1)
road.write_text(b,encoding='utf-8')
print('ACCEPTED_ROADMAP',road.name)
s=check.read_text(encoding='utf-8-sig')
h='## CL-91 M2/U2 distinct story stages'
if h in s:raise SystemExit('STOP checklist change already present')
anchor='## CL-93 Scene lighting and visual effects — final stage'
if s.count(anchor)!=1:raise SystemExit('STOP checklist anchor missing')
entry='''## CL-91 M2/U2 distinct story stages
- [x] Approved additive distinction: M2 Founder Portrait observed is **not** the same as physical Signet opening and Survey pickup; U2 servant traces observed are **not** the same as interpreting their history.
- [x] Current M2/U2 installed RegionBehavior sources and canonical ledger flags independently reread; shared kernel supports dynamic nested state-path writes without altering installed scripts.
- [ ] Add **false** `puzzles.m2.founderPortraitOpened` and `puzzles.u2.servantHistoryObserved` to existing ledger under snapshot/hash-gated PREVIEW, one bounded authorized GM APPLY, and independent final no-write verification. Preserve every existing flag and Item.
- [ ] Later author separate observation/interpretation milestones if needed by campaign narrative, with no automatic claim that the player completed either.
- [ ] Defer user hands-on GM/player acceptance until final campaign testing.

'''
check.write_text(s.replace(anchor,entry+anchor,1),encoding='utf-8')
print('ACCEPTED_CHECKLIST',check.name)
