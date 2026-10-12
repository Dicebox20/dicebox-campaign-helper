from pathlib import Path
p=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness\cl91-m2-u2-additive-preview-v001.page.js')
out=p.with_name('cl91-m2-u2-additive-preview-v002.page.js')
if out.exists():raise SystemExit('Already staged, stop')
s=p.read_text(encoding='utf-8')
old='owned==="dbx:central-lodge:ledger"'
new='owned==="dbx:central-lodge:state"'
if s.count(old)!=1:raise SystemExit('Unexpected preview source, stop')
out.write_text(s.replace(old,new,1).replace('cl91.m2-u2-additive-preview-v001','cl91.m2-u2-additive-preview-v002',1),encoding='utf-8')
print('STAGED',out.name)
