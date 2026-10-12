from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
s=road.read_text(encoding='utf-8')
needle='- All 21 canonical Scenes, 202 Regions, 119 behaviors, 33 Items and active revision3 puzzle ledger SHA'
added='- **B2 Hidden Annex & Sacrificial Preparation:** 120→240px/5ft, token-free guarded Scene update PASS; independent normalized full source and geometry readback PASS. Original source SHA `9302b0144902eff5223c0904451b72790c7a6864c81b7066e604155f22435db3`, updated SHA `53e20aceaa543608212bf5e33034a47ea47ddfd34f49d8cef8e0c456f203d581`. All 22 Walls, 10 Regions, 3 Lights preserved, backup `outputs/foreman-checkpoints/clscale-b2-before-grid240-v001.json`.\n'+needle
if s.count(needle)!=1:raise SystemExit('STOP roadmap anchor drift')
road.write_text(s.replace(needle,added,1),encoding='utf-8')
doc=r/'docs/CENTRAL-LODGE-INTERIOR-SCALE-CALIBRATION-PREVIEW-2026-10-08.md'
s=doc.read_text(encoding='utf-8')
h='## B2 Hidden Annex 240px grid verification (2026-10-08)'
if h in s:raise SystemExit('STOP duplicate B2 section')
s+='''\n'''+h+'''
- Scene `5K1uASAARnX8aZhP`, gridless `grid.size: 120→240`, retained 5ft distance, same 4320×2880 art.
- Full before `Scene.toObject()` backup in `outputs/foreman-checkpoints/clscale-b2-before-grid240-v001.json`; before source SHA `9302b0144902eff5223c0904451b72790c7a6864c81b7066e604155f22435db3`.
- No-write exact roster/ledger/source PREVIEW PASS, single guarded Assistant Gamemaster Scene.update with `autoReposition:false` PASS; independent final normalized full-source readback PASS, after SHA `53e20aceaa543608212bf5e33034a47ea47ddfd34f49d8cef8e0c456f203d581`. All 22 Walls, 10 Regions, 3 Lights, all other Scene metadata, original images and pixels preserved. B2 had zero Tokens.
- Current ledger revision3 SHA `e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9` unchanged. No player gameplay acceptance, CL50 route installs remain quarantined.
'''
doc.write_text(s,encoding='utf-8')
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
s=check.read_text(encoding='utf-8')
anchor='- [x] Chrome restored: CDP/browser read-only source access recovered and Foundry ready.'
idx=s.find(anchor)
if idx<0:raise SystemExit('STOP checklist anchor')
e=s.find('\n',idx)
s=s[:e+1]+'- [x] B2 Hidden Annex grid 120→240 bounded Scene update PASS; full source backup, independent pixel-geometry readback verified 22 Walls/10 Regions/3 Lights, ledger unchanged; checkpoint required before next Scene.\n'+s[e+1:]
check.write_text(s,encoding='utf-8')
q=r/'work/foundry-playwright-harness/cl90-progress-safety-smoke-v010.page.js'
t=q.read_text(encoding='utf-8')
t=t.replace('cl90.progress-safety-smoke-v010','cl90.progress-safety-smoke-v011',1)
anchor='const piano=game.macros.get("VHVC7yVlrNS7mWGJ"),m2=game.scenes.get("JZkxX6lUQe8Nc8xJ");'
assert t.count(anchor)==1
extra='''const scaleB2=game.scenes.get("5K1uASAARnX8aZhP");
if(scaleB2?.grid?.type!==0||scaleB2?.grid?.size!==240||scaleB2?.grid?.distance!==5
||scaleB2?.width!==4320||scaleB2?.height!==2880)
 failures.push("CL-SCALE B2 grid-only calibration drift");
'''
t=t.replace(anchor,extra+anchor,1)
out=q.with_name('cl90-progress-safety-smoke-v011.page.js')
if out.exists():raise SystemExit('STOP v011 exists')
out.write_bytes(t.encode('utf-8'))
print('B2_DOCS_STAGED_CL90_V011')
