from pathlib import Path
import hashlib
w=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
src=w/'clscale-stage-u1-v001.py'
dst=w/'clscale-stage-u2-v001.py'
if dst.exists():raise SystemExit('STOP U2 stage already exists')
s=src.read_text(encoding='utf-8')
needle="ID='if9iWDRjSwI87EeX';label='U1';target=180"
if s.count(needle)!=1:raise SystemExit('STOP template drift')
s=s.replace(needle,"ID='PVf6Gbrv9HbB88uZ';label='U2';target=160")
s=s.replace('clscale-u1-','clscale-u2-').replace('grid180','grid160').replace('U1','U2')
needle="if len(door_lengths)!=5 or min(door_lengths)<207 or not region_spans or min(region_spans)<207:"
if s.count(needle)!=1:raise SystemExit('STOP clearance marker drift')
s=s.replace(needle,"if len(door_lengths)!=8 or min(door_lengths)<184 or not region_spans or min(region_spans)<184:")
needle="print('U2_MEASURED_CLEARANCE'"
if s.count(needle)!=1:raise SystemExit('STOP stage print marker drift')
guard="""story_ids={b['_id'] for r0 in s['regions'] for b in r0.get('behaviors',[])}
if not {'WOiGF1WlGZM3fO8I','J11ZvQh4lqzEsvRi'}.issubset(story_ids):raise SystemExit('STOP U2 servant-history story source drift')
if x['revision']!=3:raise SystemExit('STOP U2 sovereign ledger revision drift')
"""
s=s.replace(needle,guard+needle)
if 'clscale-u1' in s or 'grid180' in s:raise SystemExit('STOP U1 references remain')
dst.write_text(s,encoding='utf-8')
print('STAGED_U2_GENERATOR',dst.name,hashlib.sha256(dst.read_bytes()).hexdigest())
