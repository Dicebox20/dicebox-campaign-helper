from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
p=r/'docs/CENTRAL-LODGE-INTERIOR-SCALE-CALIBRATION-PREVIEW-2026-10-08.md'
s=p.read_text(encoding='utf-8')
anchor='## Live baseline drift observed during calibration review (2026-10-08)'
if anchor in s:raise SystemExit('STOP note already exists')
note='''

## Live baseline drift observed during calibration review (2026-10-08)
- Last verified Foreman checkpoint was revision2. Read-only Foundry audit later observed ledger **revision3** at `2026-10-08T19:07:46.521Z`, SHA256 `e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9`.
- Ledger Notice keys are now `observation:e1`, `e1`, and added `m1`. Existing E1 recent-use evidence remains true; M1 clock, M2 portrait observation and N3 branch completion flags remain false.
- CL90 v008 read-only source regression **FAIL** only on the former revision2 and exact 2-notice baseline assumptions (`Kernel/ledger drift`, `E1 notice keys drift`), not on missing Scenes/Regions/behaviors/Items. This is an external live-state change relative to the last verified checkpoint, **not evidence that calibration modified Foundry**. Preserve it; do not reset or revise unrelated puzzle state, and don't certify a new baseline without fresh revalidation.
- No Scene grid or image changed. All 21 Scene grid sizes remained 120 during the drift readback. The future M2 grid pilot must use an exact fresh ledger/Scene fingerprint and keep runtime/GM-owned state intact. User-authorized visual map-scale method remains pending.
'''
p.write_text(s+note,encoding='utf-8')
p2=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
s=p2.read_text(encoding='utf-8')
a='- [ ] After author choice and KB reconciliation, verify Scene source hashes, build no-write PREVIEW, one guarded M2 scale APPLY if approved, independent readback, restore-snapshot plan and regression.'
b='- [ ] After author choice and KB reconciliation, first reconcile observed live ledger revision3 with added M1 notice (do not revert), then verify fresh Scene source hashes and ledger, build no-write PREVIEW, one guarded M2 scale APPLY if approved, independent readback, restore-snapshot plan and regression.'
if s.count(a)!=1:raise SystemExit('STOP checklist anchor mismatch')
p2.write_text(s.replace(a,b,1),encoding='utf-8')
print('DOCUMENTED_LIVE_REVISION3_NO_SCENE_CHANGES')
