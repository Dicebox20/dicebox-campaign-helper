from pathlib import Path
p=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness\clscale-stage-m3-v001.py')
s=p.read_text(encoding='utf-8')
ids=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"]
import json
js="const canonical="+json.dumps(ids)+" .map(id=>game.scenes.get(id));"
old="rp=w/'clscale-m3-baseline-readonly-v001.page.js'"
new="""# The world includes unrelated Scenes; scope roster only to the 21 canonical Central Lodge ids.
oldRead=read
read=read.replace("const ledger=", jsCanonical+"\\nconst ledger=", 1)
read=read.replace("game.scenes.size","canonical.length").replace("game.scenes.reduce(", "canonical.reduce(")
"""+old
# Make source valid when code runs: use string literal for jsCanonical
new=new.replace('oldRead=read','jsCanonical='+repr(js)+'\noldRead=read')
if s.count(old)!=1:raise SystemExit('STOP source roster patch anchor')
s=s.replace(old,new,1)
old="""if rp.exists():
 if rp.read_bytes()!=read.encode('utf-8'):raise SystemExit('STOP existing M3 baseline differs')
else:rp.write_bytes(read.encode('utf-8'))"""
new="""if rp.exists() and rp.read_bytes()!=oldRead.encode('utf-8') and rp.read_bytes()!=read.encode('utf-8'):
 raise SystemExit('STOP unexpected existing baseline file')
if not rp.exists() or rp.read_bytes()!=read.encode('utf-8'):rp.write_bytes(read.encode('utf-8'))"""
if s.count(old)!=1:raise SystemExit('STOP existing baseline reuse anchor')
s=s.replace(old,new,1)
old="preview=head+f"
new="""# Keep live install guard scoped to the canonical campaign roster, not unrelated Foundry Scenes.
head=jsCanonical+"\\n"+head.replace("game.scenes.size","canonical.length").replace("game.scenes.reduce(", "canonical.reduce(")
preview=head+f"""
if s.count(old)!=1:raise SystemExit('STOP preview head anchor')
s=s.replace(old,new,1)
p.write_bytes(s.encode('utf-8'))
print('M3_CAMPAIGN_ROSTER_SCOPE_PATCHED',len(ids))
