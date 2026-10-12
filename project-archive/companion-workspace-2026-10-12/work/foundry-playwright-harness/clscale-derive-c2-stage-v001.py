from pathlib import Path
import hashlib
w=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
src=w/'clscale-stage-c1-v001.py'
dst=w/'clscale-stage-c2-v001.py'
if dst.exists(): raise SystemExit('STOP C2 stage exists; do not overwrite')
s=src.read_text(encoding='utf-8')
needle="ID='EDdktL7VUihbpKe9';label='C1';target=240"
if s.count(needle)!=1: raise SystemExit('STOP template ID/target drift')
s=s.replace(needle,"ID='UNySMm7YkyYfh41x';label='C2';target=160")
s=s.replace('clscale-c1-', 'clscale-c2-').replace('grid240','grid160').replace('C1','C2')
needle="backup=r/'outputs/foreman-checkpoints/clscale-c2-before-grid160-v001.json'"
check="""# Independent C2 clearance measurements from Scene Wall/Region source.
import math
door_lengths=[math.hypot(wall['c'][2]-wall['c'][0],wall['c'][3]-wall['c'][1]) for wall in s['walls'] if wall.get('door',0)>0]
region_spans=[min(sh.get('width',0),sh.get('height',0)) for region in s['regions'] for sh in region.get('shapes',[]) if sh.get('type')=='rectangle']
if len(door_lengths)!=4 or min(door_lengths)<184 or not region_spans or min(region_spans)<184:
 raise SystemExit('STOP C2 narrow doorway or region measured clearance drift '+repr((door_lengths,region_spans)))
print('C2_MEASURED_CLEARANCE',{'doors':door_lengths,'smallestRegion':min(region_spans),'candidatePx':160})
"""
if s.count(needle)!=1: raise SystemExit('STOP template backup marker drift')
s=s.replace(needle,check+needle)
if 'clscale-c1' in s or 'grid240' in s or 'C1_SCENE' in s:raise SystemExit('STOP C1 references remain')
dst.write_text(s,encoding='utf-8')
print('STAGED',dst.name,'SHA256',hashlib.sha256(dst.read_bytes()).hexdigest())
