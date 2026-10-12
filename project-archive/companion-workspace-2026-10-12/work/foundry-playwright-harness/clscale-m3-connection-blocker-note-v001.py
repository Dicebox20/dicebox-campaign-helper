from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
p=r/'docs/CENTRAL-LODGE-INTERIOR-SCALE-CALIBRATION-PREVIEW-2026-10-08.md'
text=p.read_text(encoding='utf-8')
heading='## M3 automation transport blocker (post-M2 checkpoint)'
if heading in text:raise SystemExit('STOP already noted')
p.write_text(text+'''
## M3 automation transport blocker (post-M2 checkpoint)
- M2 320px grid was already applied, independently verified and checkpointed in work unit `central-lodge-clscale-m2-grid320-verified-v001`.
- During next token-free M3 Scene (candidate 120→240px) baseline-source read via `exec-page.mjs read`, two bounded reads failed before returning Foundry state. Playwright reported `browserType.connectOverCDP: Timeout 30000ms exceeded` after WebSocket establishment at `127.0.0.1:9223`. Port 9223 was still listening (owning process 30548), but CDP session attach did not complete.
- **No M3 Scene write, backup, or grid change was attempted**. Only a read-only baseline script `clscale-m3-baseline-readonly-v001.page.js` was staged; no generated apply script and no replay.
- Under Foreman repeated-same-class failure rule, stop all live Scene grid updates and preserve the M2 backup/source receipt. Recovery must inspect CDP ownership and active browser state read-only, reconcile pending operations before any restart or reconnection, obtain a new exact M3 baseline, and continue only after reliable source read succeeds.
- The user already delegated calibration authority for all interiors; no per-room approval prompt is needed. M1 Ret token needs separate center-preservation, F2 unresolved scale, N3 remains120px; CL50 route installers quarantined.
''',encoding='utf-8')
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
s=check.read_text(encoding='utf-8')
needle='- [ ] Recalculate all affected CL50 Scene-to-Scene arrival footprints, rerun route overlap tests, preserve one disabled M2 Notice and all 119 RegionBehaviors/33 Items/ledger revision2. Do not reuse stale R1–R4 landing PASS receipts.'
replacement='- [ ] Before M3 or later grid writes, reconcile the 2026-10-08 Playwright CDP connectOverCDP timeout after two read-only attempts (WebSocket connected, browser port 9223 listening). No M3 update attempted. Preserve current M2 320px success and revision3 ledger; resume only with reliable fresh exact source and independent checkpoint.\n- [ ] Recalculate all affected CL50 Scene-to-Scene arrival footprints, rerun route overlap tests, preserve one disabled M2 Notice and all 119 RegionBehaviors/33 Items/current sovereign ledger. Do not reuse stale R1–R4 landing PASS receipts.'
if s.count(needle)!=1:raise SystemExit('STOP checklist anchor drift')
check.write_text(s.replace(needle,replacement,1),encoding='utf-8')
print('M3_CDP_TIMEOUT_RECOVERY_NOTE_SAVED')
