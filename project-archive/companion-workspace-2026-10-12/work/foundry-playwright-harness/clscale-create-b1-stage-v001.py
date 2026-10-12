from pathlib import Path
w=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
p=w/'clscale-stage-b2-v001.py'
dst=w/'clscale-stage-b1-v001.py'
if dst.exists():raise SystemExit('STOP staged B1 generator exists: reconcile')
s=p.read_text(encoding='utf-8')
subs=[
 ("ID='5K1uASAARnX8aZhP';label='B2';target=240","ID='0CSBwzcszPKyaB8u';label='B1';target=150"),
 ("'B2' in s['name']","'B1' in s['name']"),
 ("clscale-b2","clscale-b1"),

 ("'B2_SCENE_DRIFT'","'B1_SCENE_DRIFT'"),
 ("'OUTCOME_UNKNOWN_B2_NO_RETRY'","'OUTCOME_UNKNOWN_B1_NO_RETRY'"),
 ("// B2 exact snapshot","// B1 exact snapshot"),
 ("grid240","grid150"),
]
for old,new in subs:
 if old not in s:raise SystemExit('STOP missing replacement anchor '+old)
 s=s.replace(old,new)
# Do not replace B2 ID inside canonical list! Verify it remains there exactly once.
assert s.count('"5K1uASAARnX8aZhP"')==1
assert s.count('"LXTA8mx1rJ2L6e2J"')==1
assert s.count('"0CSBwzcszPKyaB8u"')==1
assert s.count("ID='0CSBwzcszPKyaB8u'")==1
assert 'target=150' in s
dst.write_bytes(s.encode('utf-8'))
print('STAGED_B1_GENERATOR',dst.name,'CANONICAL_IDS_INTACT')
