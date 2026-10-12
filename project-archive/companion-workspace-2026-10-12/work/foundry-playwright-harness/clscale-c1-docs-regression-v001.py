from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
dossier=r/'docs/CENTRAL-LODGE-INTERIOR-SCALE-CALIBRATION-PREVIEW-2026-10-08.md'
oldreg=r/'work/foundry-playwright-harness/cl90-progress-safety-smoke-v012.page.js'
newreg=oldreg.with_name('cl90-progress-safety-smoke-v013.page.js')
needle='- All 21 canonical Scenes, 202 Regions, 119 behaviors, 33 Items and active revision3 puzzle ledger SHA'
line='- **C1 Hidden Chapel / Shrine of Asmodeus:** gridless 120→240px per 5ft, token-free guarded Scene edit, PREVIEW/APPLY/independent reread PASS. Original source SHA `664816c5ff2c42521682f9bcdc5ec5ac7b1e52cc5760a75174f84d5c538d3fc1`, updated SHA `80ce2a899ad5304103c6e14b8b84ad4b3fc6d9e8962534990890489df82d3c7a`. All 21 Walls, 10 Regions, 3 Lights unchanged, backup `outputs/foreman-checkpoints/clscale-c1-before-grid240-v001.json`.\n'
rtext=road.read_text(encoding='utf-8')
ctext=check.read_text(encoding='utf-8')
dtext=dossier.read_text(encoding='utf-8')
reg=oldreg.read_text(encoding='utf-8')
checkAnchor='- [x] B1 Cellar 120'
regVersion='cl90.progress-safety-smoke-v012'
regAnchor='const piano=game.macros.get("VHVC7yVlrNS7mWGJ"),m2=game.scenes.get("JZkxX6lUQe8Nc8xJ");'
if rtext.count(needle)!=1 or checkAnchor not in ctext or '## C1 Hidden Chapel grid-size verification' in dtext or reg.count(regVersion)!=1 or reg.count(regAnchor)!=1 or newreg.exists():
 raise SystemExit('STOP document/regression anchors drift')
rtext=rtext.replace(needle,line+needle,1)
idx=ctext.index(checkAnchor);end=ctext.index('\n',idx)
ctext=ctext[:end+1]+'- [x] C1 Hidden Chapel grid 120→240px/5ft one guarded Scene update; exact backup, independent 21-wall/10-Region/3-light source readback PASS, ledger revision3 unchanged; checkpoint before next room.\n'+ctext[end+1:]
dtext+='''

## C1 Hidden Chapel grid-size verification (2026-10-08)
- User-delegated grid-only correction of C1 Scene `EDdktL7VUihbpKe9`, gridless `grid.size: 120→240`, retained 5ft distance, original 4320×2880 artwork and all pixel geometry.
- Exact full `Scene.toObject()` backup `outputs/foreman-checkpoints/clscale-c1-before-grid240-v001.json`, original SHA `664816c5ff2c42521682f9bcdc5ec5ac7b1e52cc5760a75174f84d5c538d3fc1`.
- Fresh exact canonical roster/ledger/Scene source no-write PREVIEW PASS. One Assistant Gamemaster `Scene.update({'grid.size':240},{autoReposition:false})` PASS. Independent full Scene source reread PASS with updated SHA `80ce2a899ad5304103c6e14b8b84ad4b3fc6d9e8962534990890489df82d3c7a`; normalizing grid size and Scene update audit _stats exactly reproduces the original SHA. All 21 Walls, 10 Regions, 3 Lights and other source data unchanged, no placed Tokens.
- Ledger revision3 SHA `e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9` unchanged. Final real-player/visual acceptance deferred and CL50 railway installers quarantined.
'''
reg=reg.replace(regVersion,'cl90.progress-safety-smoke-v013',1)
extra='''const scaleC1=game.scenes.get("EDdktL7VUihbpKe9");
if(scaleC1?.grid?.type!==0||scaleC1?.grid?.size!==240||scaleC1?.grid?.distance!==5
||scaleC1?.width!==4320||scaleC1?.height!==2880)
 failures.push("CL-SCALE C1 grid-only calibration drift");
'''
reg=reg.replace(regAnchor,extra+regAnchor,1)
road.write_bytes(rtext.encode('utf-8'))
check.write_bytes(ctext.encode('utf-8'))
dossier.write_bytes(dtext.encode('utf-8'))
newreg.write_bytes(reg.encode('utf-8'))
print('C1_DOCS_CHECKLIST_REGRESSION_V013_STAGED')
