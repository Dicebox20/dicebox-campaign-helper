from pathlib import Path
w=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
src=w/'clscale-stage-b1-v001.py'
dst=w/'clscale-stage-c1-v001.py'
if dst.exists():raise SystemExit('STOP existing C1 stage')
s=src.read_text(encoding='utf-8')
pairs=[
 ("ID='0CSBwzcszPKyaB8u';label='B1';target=150","ID='EDdktL7VUihbpKe9';label='C1';target=240"),
 ("'B1' in s['name']","'C1' in s['name']"),
 ("clscale-b1","clscale-c1"),
 ("grid150","grid240"),
 ("B1_SCENE_DRIFT","C1_SCENE_DRIFT"),
 ("OUTCOME_UNKNOWN_B1_NO_RETRY","OUTCOME_UNKNOWN_C1_NO_RETRY"),
 ("// B1 exact snapshot","// C1 exact snapshot"),
]
for old,new in pairs:
 if s.count(old)<1:raise SystemExit('STOP source anchor missing '+old)
 s=s.replace(old,new)
assert s.count('"0CSBwzcszPKyaB8u"')==1
assert s.count('"EDdktL7VUihbpKe9"')==1
assert s.count("ID='EDdktL7VUihbpKe9'")==1
assert s.count('"5K1uASAARnX8aZhP"')==1
assert 'target=240' in s and 'autoReposition:false' in s
dst.write_bytes(s.encode('utf-8'))
print('C1_STAGE_VERIFIED_FROM_B1',dst.name)
