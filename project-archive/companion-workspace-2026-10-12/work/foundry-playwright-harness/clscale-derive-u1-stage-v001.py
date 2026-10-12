from pathlib import Path
import hashlib
w=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
src=w/'clscale-stage-c2-v001.py'
dst=w/'clscale-stage-u1-v001.py'
if dst.exists(): raise SystemExit('STOP U1 stage exists; no overwrite')
s=src.read_text(encoding='utf-8')
needle="ID='UNySMm7YkyYfh41x';label='C2';target=160"
if s.count(needle)!=1: raise SystemExit('STOP template drift')
s=s.replace(needle,"ID='if9iWDRjSwI87EeX';label='U1';target=180")
s=s.replace('clscale-c2-', 'clscale-u1-').replace('grid160','grid180').replace('C2','U1')
needle="if len(door_lengths)!=4 or min(door_lengths)<184 or not region_spans or min(region_spans)<184:"
if s.count(needle)!=1:raise SystemExit('STOP clearance marker drift')
s=s.replace(needle,"if len(door_lengths)!=5 or min(door_lengths)<207 or not region_spans or min(region_spans)<207:")
needle="if not 'U1' in s['name'] or s['_id']!=ID:"
if s.count(needle)!=1:raise SystemExit('STOP name guard missing')
if 'clscale-c2' in s or 'grid160' in s or 'UNySMm7YkyYfh41x' in s[s.index('ID='):s.index('jsCanonical')]:raise SystemExit('STOP C2 reference remains')
dst.write_text(s,encoding='utf-8')
print('U1_STAGE_GENERATOR',dst.name,'SHA256',hashlib.sha256(dst.read_bytes()).hexdigest())
