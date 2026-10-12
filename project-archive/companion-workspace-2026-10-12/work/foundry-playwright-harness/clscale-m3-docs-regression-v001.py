from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
s=road.read_text(encoding='utf-8')
head=next((x for x in s.splitlines() if x.startswith('## CL-SCALE') and 'Central Lodge interior token' in x),None)
if s.count(head)!=1:raise SystemExit('STOP heading changed')
a=s.index(head);b=s.find('\n## ',a+len(head))
if b<0:raise SystemExit('STOP next heading')
new="""## CL-SCALE - Central Lodge interior token/room calibration (2026-10-08)
**Approved program and current state:** user authorized Foreman to select appropriate per-interior grid-only corrections, preserving map source art, geometry and puzzle state, without asking for permission per room. Original 120px/5ft gridless profile inherited a 36×24 footprint into differently scaled interiors.
- **M2 Study, Parlor & Formal Rooms:** 120→320px/5ft, independently source/geometry/ledger verified. Full rollback snapshot `outputs/foreman-checkpoints/clscale-m2-before-grid320-v001.json`.
- **M3 Kitchen & Service Wing:** after restored Chrome/CDP and ready Foundry world, read-only baseline, exact source backup and no-write PREVIEW PASS; 120→240px/5ft one guarded Scene.update with `autoReposition:false`. Independent full-source-normalized readback PASS. Before SHA `ffdbd64f0df881239e407c1d45fef68a655698546837a50f30b7fd6255efec8f`, after SHA `6604bdf528f9e6609f3fa2b53c94c1c49e5ba679f0dd90c0f2e9c32cf86eacc6`; 14 Walls/10 Regions/4 Lights pixel-identical, no Tokens. Snapshot `outputs/foreman-checkpoints/clscale-m3-before-grid240-v001.json`.
- All 21 canonical Scenes, 202 Regions, 119 behaviors, 33 Items and active revision3 puzzle ledger SHA `e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9` remain unchanged by the grid pilot changes. No game-screen visual acceptance claimed.
- Next: evaluate remaining candidate interior grid sizes from `docs/CENTRAL-LODGE-INTERIOR-SCALE-CALIBRATION-PREVIEW-2026-10-08.md`, one safeguarded Scene update and checkpoint at a time. N3 stays 120 due narrow doors; F2 needs stronger art evidence; M1 has Ret token and requires a dedicated character-position safety decision.
- CL50 railway installers and older landing clearances remain quarantined; player gameplay canaries deferred.
"""
road.write_text(s[:a]+new+s[b:],encoding='utf-8')
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
s=check.read_text(encoding='utf-8')
old='- [ ] Before M3 or later grid writes, reconcile the 2026-10-08 Playwright CDP connectOverCDP timeout after two read-only attempts (WebSocket connected, browser port 9223 listening). No M3 update attempted. Preserve current M2 320px success and revision3 ledger; resume only with reliable fresh exact source and independent checkpoint.'
new='- [x] Chrome restored: CDP/browser read-only source access recovered and Foundry ready. Reconciled source and current ledger revision3. M3 Kitchen grid 120→240 single guarded write PASS, exact full Scene source and geometry independent readback PASS (14 Walls/10 Regions/4 Lights pixel-identical); per-Scene rollback backup saved. No extra player canary.'
if s.count(old)!=1:raise SystemExit('STOP CDP bullet drift')
check.write_text(s.replace(old,new,1),encoding='utf-8')
doc=r/'docs/CENTRAL-LODGE-INTERIOR-SCALE-CALIBRATION-PREVIEW-2026-10-08.md'
s=doc.read_text(encoding='utf-8')
heading='## M3 Kitchen grid correction after CDP recovery (2026-10-08)'
if heading in s:raise SystemExit('STOP already logged')
s+="""\n"""+heading+"""
- Foundry developer Chrome reconnected and the game became ready; subsequent read-only source confirmed revision3 ledger SHA unchanged, but initial M3 baseline script incorrectly counted all 183 Foundry Scenes rather than only the 21 canonical Central Lodge Scenes. Fixed guard scope; no live write during those diagnostic failures.
- M3 Kitchen Scene `LXTA8mx1rJ2L6e2J` original gridless 120px/5ft, 4320×2880, no Tokens; saved exact full source backup `outputs/foreman-checkpoints/clscale-m3-before-grid240-v001.json`.
- No-write PREVIEW PASS, one authorized `Scene.update({'grid.size':240},{autoReposition:false})` PASS, independent full Scene normalized SHA PASS, preserving all 14 Walls/10 Regions/4 Lights, scene dimensions, art and other fields except authorized grid and audit timestamp.
- Original full Scene SHA `ffdbd64f0df881239e407c1d45fef68a655698546837a50f30b7fd6255efec8f`; final SHA `6604bdf528f9e6609f3fa2b53c94c1c49e5ba679f0dd90c0f2e9c32cf86eacc6`. Ledger revision3 and SHA unchanged; no player testing performed.
"""
doc.write_text(s,encoding='utf-8')
q=r/'work/foundry-playwright-harness/cl90-progress-safety-smoke-v009.page.js'
t=q.read_text(encoding='utf-8')
old='cl90.progress-safety-smoke-v009'
assert t.count(old)==1
t=t.replace(old,'cl90.progress-safety-smoke-v010',1)
anchor='const piano=game.macros.get("VHVC7yVlrNS7mWGJ"),m2=game.scenes.get("JZkxX6lUQe8Nc8xJ");'
assert t.count(anchor)==1
extra='''const scaleM3=game.scenes.get("LXTA8mx1rJ2L6e2J");
if(scaleM3?.grid?.type!==0||scaleM3?.grid?.size!==240||scaleM3?.grid?.distance!==5
||scaleM3?.width!==4320||scaleM3?.height!==2880)
 failures.push("CL-SCALE M3 grid-only calibration drift");
'''
t=t.replace(anchor,extra+anchor,1)
out=q.with_name('cl90-progress-safety-smoke-v010.page.js')
if out.exists():raise SystemExit('STOP v010 already exists')
out.write_bytes(t.encode('utf-8'))
print('M3_DOCS_AND_CL90_V010_STAGED')
