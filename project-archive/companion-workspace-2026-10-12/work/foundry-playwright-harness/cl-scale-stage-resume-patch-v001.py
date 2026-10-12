from pathlib import Path
p=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness\cl-scale-stage-audit-v001.py')
s=p.read_text(encoding='utf-8')
pairs=[
 ("if d.exists():raise SystemExit('STOP calibration report already exists')","if d.exists():print('RECONCILE_PARTIAL_REPORT_ALREADY_STAGED')"),
 ("anchor='## CL-93 FINAL - Scene lighting and visual effects'","anchor=next((line for line in s.splitlines() if line.startswith('## CL-93 FINAL')),None)"),
 ("anchor='## CL-93 Scene lighting and visual effects — final stage'","anchor=next((line for line in s.splitlines() if line.startswith('## CL-93 Scene lighting')),None)"),
 ("d.write_text(report,encoding='utf-8')","if d.exists() and d.read_text(encoding='utf-8')!=report:raise SystemExit('STOP existing report not exact expected draft')\nd.write_text(report,encoding='utf-8')")
]
for old,new in pairs:
 if s.count(old)!=1:raise SystemExit('STOP anchor '+old[:35])
 s=s.replace(old,new,1)
p.write_bytes(s.encode('utf-8'))
print('SAFE_SCRIPT_RESUME_PATCHED')
