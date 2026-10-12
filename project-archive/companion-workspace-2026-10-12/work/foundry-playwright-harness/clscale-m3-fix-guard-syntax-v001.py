from pathlib import Path
w=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
replacements=[
 ("canonical.reduce((n,s)=>n+[...s.regions].reduce((m,r)=>m+r.behaviors.size,0)!==119)", "canonical.reduce((n,s)=>n+[...s.regions].reduce((m,r)=>m+r.behaviors.size,0),0)!==119)"),
 ("game.scenes.reduce((n,s)=>n+[...s.regions].reduce((m,r)=>m+r.behaviors.size,0)!==119)", "game.scenes.reduce((n,s)=>n+[...s.regions].reduce((m,r)=>m+r.behaviors.size,0),0)!==119)")
]
for name in ['clscale-m3-preview-v001.page.js','clscale-m3-apply-v001.page.js','clscale-stage-m3-v001.py']:
 p=w/name;s=p.read_text(encoding='utf-8')
 matches=[(a,b) for a,b in replacements if s.count(a)==1]
 if len(matches)!=1:raise SystemExit('STOP expected exactly one malformed guard '+name)
 a,b=matches[0];p.write_bytes(s.replace(a,b,1).encode('utf-8'))
 print('FIXED',name)
