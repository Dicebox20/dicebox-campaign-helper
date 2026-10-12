from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
dossier=r/'docs/CENTRAL-LODGE-INTERIOR-SCALE-CALIBRATION-PREVIEW-2026-10-08.md'
s=dossier.read_text(encoding='utf-8')
if '## M2 live grid-size pilot installed and independently verified' in s:raise SystemExit('STOP already documented')
s+='''

## M2 live grid-size pilot installed and independently verified
- User-authorized grid-only correction of M2 Scene `JZkxX6lUQe8Nc8xJ`, gridless `grid.size 120→320`, distance 5ft, dimensions 4320×2880. Exactly one Foundry Scene.update using `autoReposition:false` committed through authorized Assistant Gamemaster. M2 was inactive and had no placed Tokens.
- Before write: full `Scene.toObject()` backup `outputs/foreman-checkpoints/clscale-m2-before-grid320-v001.json`, original full source SHA `c96c3026a7b5ae152871ceb5191770f3474fd9410958a1701bcff4c3c34d72d5`, geometry SHA `e6790e102c446d20f277723855465145d588190efb16f8f5bd56bb3ca9f302e0`.
- No-write PREVIEW PASS 21 Scenes/202 Regions/119 behaviors/33 Items, ledger revision 3. One authorized APPLY PASS, new M2 scene SHA `e9663751ca317c5922b4ce9ae97d2c4cda1b84f79fa23599b7a56d6140f3d305`; normalized copy restoring just grid size and expected Scene modifiedTime/lastModifiedBy exactly reproduces original scene SHA. Independent read-only FINAL PASS: all 12 Wall endpoints, 15 Region shape geometries, 6 lights and other placed documents pixel-identical; source, Scene dimensions, puzzle scripts, Items, ledger revision3 SHA `e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9` preserved. All 20 other Scene grids still 120.
- This is *source-verified* pixel geometry conservation, not yet game-screen visual fit or player pathing acceptance. Keep CL50 route installers quarantined and re-test landing clearance after new grid sizes.
'''
dossier.write_text(s,encoding='utf-8')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
s=road.read_text(encoding='utf-8')
anchor='**Author approved per-Scene grid-size calibration and delegated remaining interior choices to Foreman.**'
new='**Author approved per-Scene grid-size calibration and delegated remaining interior choices to Foreman.** M2 live grid-only pilot 120→320 is now installed, with exact rollback snapshot and independent source/geometry/ledger conservation PASS; other 20 Scene grids unchanged. '
if s.count(anchor)!=1:raise SystemExit('STOP roadmap anchor drift')
road.write_text(s.replace(anchor,new,1),encoding='utf-8')
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
s=check.read_text(encoding='utf-8')
old='- [ ] Reconcile observed live ledger revision3 and M1 notice (do not revert), verify M2 and other Scene source/geometry snapshots, build exact no-write PREVIEW, one guarded 320px M2 grid APPLY, independent readback with rollback evidence and regression. Checkpoint before changing another Scene.'
new='- [x] Reconciled live ledger revision3 and M1 notice (no revert). Backed up exact M2 Scene source; no-write PREVIEW PASS, one guarded M2 grid-size 120→320 APPLY PASS (`autoReposition:false`), independent full Scene source, all geometry and runtime ledger final readback PASS. Checkpoint before next Scene.'
if s.count(old)!=1:raise SystemExit('STOP checklist update drift')
check.write_text(s.replace(old,new,1),encoding='utf-8')
p=r/'work/foundry-playwright-harness/cl90-progress-safety-smoke-v008.page.js'
s=p.read_text(encoding='utf-8')
pairs=[
 ('ledger.revision!==2','ledger.revision!==3'),
 ('Object.keys(ledger.notices??{}).length!==2','Object.keys(ledger.notices??{}).length!==3'),
 ('"e1|observation:e1"','"e1|m1|observation:e1"'),
 ('"cl90.progress-safety-smoke-v008"','"cl90.progress-safety-smoke-v009"')
]
for old,new in pairs:
 if s.count(old)!=1:raise SystemExit('STOP CL90 anchor drift '+old)
 s=s.replace(old,new,1)
needle='const piano=game.macros.get("VHVC7yVlrNS7mWGJ"),m2=game.scenes.get("JZkxX6lUQe8Nc8xJ");'
extra='''const scaleM2=game.scenes.get("JZkxX6lUQe8Nc8xJ");
if(scaleM2?.grid?.type!==0||scaleM2?.grid?.size!==320||scaleM2?.grid?.distance!==5
||scaleM2?.width!==4320||scaleM2?.height!==2880)
 failures.push("CL-SCALE M2 grid-only calibration drift");
'''
if s.count(needle)!=1:raise SystemExit('STOP CL90 source anchor drift')
s=s.replace(needle,extra+needle,1)
out=p.with_name('cl90-progress-safety-smoke-v009.page.js')
if out.exists():raise SystemExit('STOP regression v009 already exists')
out.write_bytes(s.encode('utf-8'))
print('M2_GRID_DOCS_UPDATED_CL90_V009_STAGED')
