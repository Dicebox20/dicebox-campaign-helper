from pathlib import Path
root=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=root/'docs/CENTRAL-LODGE-ROADMAP.md'
s=road.read_text(encoding='utf-8-sig')
old='**Status:** ACCEPTED SEMANTIC RECONCILIATION; guarded ledger schema migration pending evidence. The M1 clock source and existing progression Items remain unchanged.'
new='**Status (2026-10-08):** ADDITIVE LEDGER SCHEMA MIGRATION APPLIED AND INDEPENDENTLY VERIFIED. Exactly `founderPortraitOpened=false` and `servantHistoryObserved=false` were added to the existing ledger. Revision 1 → 2, verified full ledger SHA-256 `7feef0b3823ed64e52eaecd2fbe886d020a0a8b92dda2c54a334bbc8017d38f7`. M2 and U2 RegionBehavior source hashes, M1 clock and kernel, all 33 Items and 117 behaviors unchanged. The physical reveal and evidence observation are not marked complete. Authored later stages and actual player interactions remain pending.'
if s.count(old)!=1:raise SystemExit('ROADMAP unexpected anchor')
s=s.replace(old,new,1)
road.write_text(s,encoding='utf-8')
print('ROADMAP_VERIFIED')
check=root/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
s=check.read_text(encoding='utf-8-sig')
old='- [ ] Add **false** `puzzles.m2.founderPortraitOpened` and `puzzles.u2.servantHistoryObserved` to existing ledger under snapshot/hash-gated PREVIEW, one bounded authorized GM APPLY, and independent final no-write verification. Preserve every existing flag and Item.'
new='- [x] Add exactly **false** `puzzles.m2.founderPortraitOpened` and `puzzles.u2.servantHistoryObserved` to the existing ledger with exact snapshot/hash-gated PREVIEW, single authorized Assistant GM APPLY and independent final readback PASS. Ledger revision 2; all existing Items and states preserved.'
if s.count(old)!=1:raise SystemExit('CHECKLIST unexpected anchor')
check.write_text(s.replace(old,new,1),encoding='utf-8')
print('CHECKLIST_VERIFIED')
src=root/'work/foundry-playwright-harness/cl90-progress-safety-smoke-v004.page.js'
s=src.read_text(encoding='utf-8')
old='ledger.revision!==1'
if s.count(old)!=1:raise SystemExit('CL90 revision anchor missing')
s=s.replace(old,'ledger.revision!==2',1)
old='M2 Founder Portrait statePath needs semantic reconciliation'
new='M2 Founder Portrait observed/opened distinct ledger fields source-verified; separate physical player reveal untested'
if s.count(old)!=1:raise SystemExit('CL90 M2 blocker anchor missing')
s=s.replace(old,new,1)
old='U2 Servant History statePath needs semantic reconciliation'
new='U2 servant history observed/interpreted distinct ledger fields source-verified; authored interpretation still deferred'
if s.count(old)!=1:raise SystemExit('CL90 U2 blocker anchor missing')
s=s.replace(old,new,1)
old='cl90.progress-safety-smoke-v004'
if s.count(old)!=1:raise SystemExit('CL90 version anchor')
s=s.replace(old,'cl90.progress-safety-smoke-v005',1)
anchor='const m=game.macros.get("P7mgEkmAUiJXYdUD")'
if s.count(anchor)!=1:raise SystemExit('CL90 insertion anchor')
extra='''if(ledger.puzzles?.m2?.founderPortraitOpened!==false||ledger.puzzles?.m2?.founderPortraitObserved!==false||
ledger.puzzles?.u2?.servantHistoryObserved!==false||ledger.puzzles?.u2?.servantHistoryInterpreted!==false)
 failures.push("M2/U2 additive stage schema drift");
const m2portrait=game.scenes.get("JZkxX6lUQe8Nc8xJ")?.regions.get("FRY091GwobgD2M5i")?.behaviors.get("IdriZEGhxUY9whcV");
const u2scene=game.scenes.get("PVf6Gbrv9HbB88uZ");
const u2history=u2scene?.regions.find(r=>r.behaviors.has("J11ZvQh4lqzEsvRi"))?.behaviors.get("J11ZvQh4lqzEsvRi");
if(await sha(m2portrait?.system?.source??"")!=="bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2"
 ||await sha(u2history?.system?.source??"")!=="f815c0920579b163800a7bf5548d252dad398aeb245e90c48ce5363b0defd372")
 failures.push("M2/U2 installed narrative handler source drift");
'''
out=root/'work/foundry-playwright-harness/cl90-progress-safety-smoke-v005.page.js'
if out.exists():raise SystemExit('STOP v005 regression already exists')
out.write_text(s.replace(anchor,extra+anchor,1),encoding='utf-8')
print('CL90_V005_CREATED')
