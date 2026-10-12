from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
contract=r/'docs/CL91-M2-U2-FOLLOWON-STAGES-2026-10-08.md'
a=road.read_text(encoding='utf-8-sig')
old='**Status:** U2 staged-design; M2 overlap risk remains open, no additional gameplay certification.'
new='**Status (2026-10-08):** U2 interpretation RegionBehavior `WOiGF1WlGZM3fO8I` installed and independently source-verified, `tokenMoveIn` on existing U2 Servant History Region, stored SHA-256 `11bbc0837bf1a4ccc20c62b523f8b9acc1061078a585a1f7e36de5cc303c4b32`. 19/19 offline tests PASS. Exact Foundry baseline now 21 Scenes, 202 Regions, 118 behaviors, 33 Items; ledger revision 2 unchanged. Both U2 story flags remain false before player interaction. M2 automatic portrait observation remains deferred for concurrent Signet pickup safety, and no user gameplay acceptance was performed.'
if a.count(old)!=1:raise SystemExit('Roadmap anchor mismatch')
road.write_text(a.replace(old,new,1),encoding='utf-8')
a=check.read_text(encoding='utf-8-sig')
old='- [ ] U2 source offline fixture tests, exact guarded no-write live PREVIEW, and one authorized RegionBehavior install followed by separate final readback/checkpoint.'
new='- [x] U2 source offline fixture tests 19/19 PASS, exact guarded no-write PREVIEW PASS, one authorized RegionBehavior install PASS, independent source/hash final readback PASS (118 behaviors, 33 Items, ledger revision 2 unchanged); no actual player canary.'
if a.count(old)!=1:raise SystemExit('Checklist anchor mismatch')
check.write_text(a.replace(old,new,1),encoding='utf-8')
a=contract.read_text(encoding='utf-8')
old='## M2 Founder Portrait'
new='''## Installed U2 evidence (source-only)
- One bounded live create installed RegionBehavior `WOiGF1WlGZM3fO8I`, stable ID `dbx:central-lodge:u2:behavior:servant-history-interpretation-v001`, and event `tokenMoveIn` in the existing U2 Servant History Region. Stored source SHA `11bbc0837bf1a4ccc20c62b523f8b9acc1061078a585a1f7e36de5cc303c4b32`.
- Exact independent no-write FINAL VERIFY PASS: 21/202/118/33; original U2 observation, M2 Signet pickup, M1 clock and shared kernel SHA unchanged; ledger revision 2, all story stages still false.
- Offline fixtures 19/19 PASS. Real-player event delivery, movement and puzzle-state commit remain **untested**, reserved for final campaign playtest.

## M2 Founder Portrait'''
if a.count(old)!=1:raise SystemExit('contract anchor mismatch')
contract.write_text(a.replace(old,new,1),encoding='utf-8')
reg=r/'work/foundry-playwright-harness/cl90-progress-safety-smoke-v005.page.js'
s=reg.read_text(encoding='utf-8')
for old,new in [('behaviors!==117','behaviors!==118'),('stableIds.size!==117','stableIds.size!==118'),
 ('cl90.progress-safety-smoke-v005','cl90.progress-safety-smoke-v006'),
 ('U2 servant history observed/interpreted distinct ledger fields source-verified; authored interpretation still deferred',
 'U2 servant-history interpretation RegionBehavior source-installed, real player evidence-gate pending')]:
 if s.count(old)!=1:raise SystemExit('regression anchor mismatch '+old)
 s=s.replace(old,new,1)
anchor='const m=game.macros.get("P7mgEkmAUiJXYdUD")'
add='''const u2r=game.scenes.get("PVf6Gbrv9HbB88uZ")?.regions.get("qa4n4o834OZTKPoV");
const u2new=u2r?.behaviors.filter(b=>b.getFlag("world","dicebox")?.stableId==="dbx:central-lodge:u2:behavior:servant-history-interpretation-v001")??[];
if(u2r?.behaviors.size!==2||u2new.length!==1||u2new[0].disabled||
 !u2new[0].system?.events?.has("tokenMoveIn")||
 await sha(u2new[0].system?.source??"")!=="11bbc0837bf1a4ccc20c62b523f8b9acc1061078a585a1f7e36de5cc303c4b32")
 failures.push("CL91 U2 interpretation source or event drift");
'''
if s.count(anchor)!=1:raise SystemExit('regression insertion anchor mismatch')
out=reg.with_name('cl90-progress-safety-smoke-v006.page.js')
if out.exists():raise SystemExit('v006 already exists')
out.write_text(s.replace(anchor,add+anchor,1),encoding='utf-8')
print('UPDATED_3_DOCS_CREATED_CL90_V006')
