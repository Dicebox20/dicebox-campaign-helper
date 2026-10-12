from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
s=road.read_text(encoding='utf-8')
needle='- All 21 canonical Scenes, 202 Regions, 119 behaviors, 33 Items and active revision3 puzzle ledger SHA'
added='- **B1 Cellar & Utility Basement:** 120→150px per 5ft, token-free one-Scene edit; full backup and independent source/geometry check PASS. Original SHA `c23fd9e2736cd7dbde05ade5480d078f4b760756b6988dd1fd4d048bb9fb232c`; updated SHA `ec8637a25258c1e3d207b0f4f4d31aa7d40da316599e0184618bcebb67c95c20`. All 24 Walls, 11 Regions, 3 Lights preserved, backup `outputs/foreman-checkpoints/clscale-b1-before-grid150-v001.json`.\n'+needle
if s.count(needle)!=1:raise SystemExit('STOP roadmap anchor drift')
road.write_text(s.replace(needle,added,1),encoding='utf-8')
doc=r/'docs/CENTRAL-LODGE-INTERIOR-SCALE-CALIBRATION-PREVIEW-2026-10-08.md'
s=doc.read_text(encoding='utf-8')
h='## B1 Cellar 150px grid verification (2026-10-08)'
if h in s:raise SystemExit('STOP duplicate B1')
s+='\n'+h+'''
- Scene `0CSBwzcszPKyaB8u`, gridless `grid.size:120→150`, retained 5ft distance and 4320×2880 source art.
- Complete `Scene.toObject()` backup `outputs/foreman-checkpoints/clscale-b1-before-grid150-v001.json`; SHA before `c23fd9e2736cd7dbde05ade5480d078f4b760756b6988dd1fd4d048bb9fb232c`.
- Exact canonical roster/ledger/source PREVIEW PASS, one Assistant Gamemaster Scene.update `grid.size:150` with `autoReposition:false` PASS; independent normalized full Scene source readback PASS, after SHA `ec8637a25258c1e3d207b0f4f4d31aa7d40da316599e0184618bcebb67c95c20`. All 24 Walls, 11 Regions, 3 Lights, other source metadata and images unchanged except grid and audit timestamp. No placed B1 Tokens.
- Ledger revision3 SHA `e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9` unchanged. Actual player visual acceptance/pathing deferred. CL50 route installer still quarantined.
'''
doc.write_text(s,encoding='utf-8')
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
s=check.read_text(encoding='utf-8')
anchor='- [x] B2 Hidden Annex grid 120'
idx=s.find(anchor)
if idx<0:raise SystemExit('STOP checklist B2 anchor')
e=s.find('\n',idx)
s=s[:e+1]+'- [x] B1 Cellar 120→150px grid-size Scene update PASS; original source backup, independent 24-wall/11-Region/3-light source readback and unchanged ledger verified. Checkpoint before next live Scene update.\n'+s[e+1:]
check.write_text(s,encoding='utf-8')
q=r/'work/foundry-playwright-harness/cl90-progress-safety-smoke-v011.page.js'
t=q.read_text(encoding='utf-8')
old='cl90.progress-safety-smoke-v011'
if t.count(old)!=1:raise SystemExit('STOP CL90 v011 drift')
t=t.replace(old,'cl90.progress-safety-smoke-v012',1)
anchor='const piano=game.macros.get("VHVC7yVlrNS7mWGJ"),m2=game.scenes.get("JZkxX6lUQe8Nc8xJ");'
if t.count(anchor)!=1:raise SystemExit('STOP CL90 source insertion')
extra='''const scaleB1=game.scenes.get("0CSBwzcszPKyaB8u");
if(scaleB1?.grid?.type!==0||scaleB1?.grid?.size!==150||scaleB1?.grid?.distance!==5
||scaleB1?.width!==4320||scaleB1?.height!==2880)
 failures.push("CL-SCALE B1 grid-only calibration drift");
'''
t=t.replace(anchor,extra+anchor,1)
out=q.with_name('cl90-progress-safety-smoke-v012.page.js')
if out.exists():raise SystemExit('STOP v012 exists')
out.write_bytes(t.encode('utf-8'))
print('B1_DOCS_STAGED_CL90_V012')
