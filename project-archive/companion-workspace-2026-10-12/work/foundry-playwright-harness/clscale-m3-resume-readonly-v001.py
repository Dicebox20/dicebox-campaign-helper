from pathlib import Path
p=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness\clscale-stage-m3-v001.py')
s=p.read_text(encoding='utf-8')
old="if rp.exists():raise SystemExit('STOP existing M3 baseline script')\nrp.write_bytes(read.encode('utf-8'))"
new="if rp.exists():\n if rp.read_bytes()!=read.encode('utf-8'):raise SystemExit('STOP existing M3 baseline differs')\nelse:rp.write_bytes(read.encode('utf-8'))"
if s.count(old)!=1:raise SystemExit('STOP source anchor drift')
p.write_bytes(s.replace(old,new,1).encode('utf-8'))
print('M3_READONLY_SOURCE_EXACT_REUSE_ENABLED')
