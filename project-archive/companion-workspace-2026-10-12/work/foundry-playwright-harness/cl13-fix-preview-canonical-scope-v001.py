from pathlib import Path
import re
root=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
p=root/'cl13-seventh-winter-preview-bundle-v001.py'
s=p.read_text(encoding='utf-8')
old="const baseline={countAllRegions:game.scenes.reduce((n,s)=>n+s.regions.size,0), countAllBehaviors:game.scenes.reduce((n,s)=>n+s.regions.reduce((m,r)=>m+r.behaviors.size,0),0)};"
ids=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"]
import json
new="const canonicalIds="+json.dumps(ids)+";const scopedScenes=canonicalIds.map(id=>game.scenes.get(id));if(scopedScenes.some(s=>!s))throw Error('CANONICAL_SCENE_MISSING');const baseline={countAllRegions:scopedScenes.reduce((n,s)=>n+s.regions.size,0),countAllBehaviors:scopedScenes.reduce((n,s)=>n+Array.from(s.regions).reduce((m,r)=>m+r.behaviors.size,0),0)};"
if s.count(old)!=1:raise SystemExit('STOP scope guard anchor mismatch '+str(s.count(old)))
p.write_text(s.replace(old,new),encoding='utf-8')
print('CORRECTED_SCOPED_COUNT',len(ids))
