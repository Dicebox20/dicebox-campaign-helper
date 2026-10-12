from pathlib import Path
import json,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
old=(r/'cl13-clock-final-readonly-v001.page.js').read_text(encoding='utf-8')
src=(r/'cl13-seventh-winter-clock-region-source-v002.js').read_text(encoding='utf-8')
if not src.endswith('\n'):raise SystemExit('Source line ending changed')
normalized=src[:-1]
expected=hashlib.sha256(normalized.encode()).hexdigest()
if expected!='5ee8f97403d5144cbacf64e57ea58862bf4daf4ec4643088531e7f27e12ac997':
 raise SystemExit('Normalized source SHA drift')
oldhash='e669a6f7703eaada989886a6fd3058eab50df8d5661379aa27d10bc3ebedbeed'
if old.count(oldhash)!=1:raise SystemExit('Original verifier SHA anchor changed')
s=old.replace(oldhash,expected,1)
s=s.replace('const expected={clock:',"const exactStagedSource="+json.dumps(normalized,ensure_ascii=False)+";\nconst expected={clock:",1)
s=s.replace('const results={','const storedSource=String(clock?.system?.source??"");\nconst results={\n  exactStoredSourceEqualsStagedWithoutOneFinalNewline:storedSource===exactStagedSource,\n  storedSourceLength:storedSource.length,',1)
s=s.replace('const pass=results.missingScenes===0','const pass=results.exactStoredSourceEqualsStagedWithoutOneFinalNewline&&results.storedSourceLength===5651&&results.items===33&&results.missingScenes===0',1)
s=s.replace('cl13-clock-final-readonly-v001','cl13-clock-final-readonly-v002',2)
out=r/'cl13-clock-final-readonly-v002.page.js'
if out.exists():raise SystemExit('Do not overwrite existing normalized verifier')
out.write_text(s,encoding='utf-8')
print('NORMALIZED_SOURCE_SHA',expected)
print('VERIFIER_FILE',out.name,'SHA',hashlib.sha256(s.encode()).hexdigest())
