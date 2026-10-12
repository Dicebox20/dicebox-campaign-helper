from pathlib import Path
w=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
old='"JZkxX6lUQe8Nc8xJ", "5K1uASAARnX8aZhP", "MAbLfBqG7qIVVuLN"'
new='"JZkxX6lUQe8Nc8xJ", "LXTA8mx1rJ2L6e2J", "MAbLfBqG7qIVVuLN"'
for name in ['clscale-stage-b2-v001.py','clscale-b2-baseline-readonly-v001.page.js']:
 p=w/name;s=p.read_text(encoding='utf-8')
 if s.count(old)!=1:raise SystemExit('STOP unexpected duplicate scoped ids in '+name)
 p.write_bytes(s.replace(old,new,1).encode('utf-8'))
 print('REPAIRED_CANONICAL_B2_SCOPE',name)
