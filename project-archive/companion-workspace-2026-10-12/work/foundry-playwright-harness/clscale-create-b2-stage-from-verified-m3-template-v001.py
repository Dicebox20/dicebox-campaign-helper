from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
src=r/'clscale-stage-m3-v001.py'
dst=r/'clscale-stage-b2-v001.py'
if dst.exists():raise SystemExit('STOP B2 stage already exists')
s=src.read_text(encoding='utf-8')
for old,new in [('LXTA8mx1rJ2L6e2J','5K1uASAARnX8aZhP'),('M3','B2'),('m3','b2')]:
 if old not in s:raise SystemExit('STOP template anchor '+old)
 s=s.replace(old,new)
assert 'target=240' in s and 'autoReposition:false' in s
dst.write_bytes(s.encode('utf-8'))
print('B2_STAGE_FROM_VERIFIED_TEMPLATE',dst.name)
