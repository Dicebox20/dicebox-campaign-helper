from pathlib import Path
import json,hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
v1=(r/'cl13-seventh-winter-clock-region-source-v001.js').read_text(encoding='utf-8')
v2=(r/'cl13-seventh-winter-clock-region-source-v002.js').read_text(encoding='utf-8')
oldhash=hashlib.sha256(v1.encode()).hexdigest()
newhash=hashlib.sha256(v2.encode()).hexdigest()
if oldhash!='1ed1ceedefec1460ff82384f672c84f96f079b8ccfab2ec5cdf23be0398f88af':
 raise SystemExit('STOP unrecognized v001 source')
p=r/'cl13-clock-preview-v001.page.js'
s=p.read_text(encoding='utf-8')
o=json.dumps(v1,ensure_ascii=False)
n=json.dumps(v2,ensure_ascii=False)
if s.count('const source='+o)!=1:raise SystemExit('STOP original preview source not matched')
if s.count(oldhash)!=1:raise SystemExit('STOP original preview hash not matched')
updated=s.replace('const source='+o,'const source='+n,1).replace(oldhash,newhash,1)
updated=updated.replace("status:'PASS',sourceSha:expectedSha","status:'PASS_STAGED_NOT_INSTALLED',sourceSha:expectedSha",1)
updated=updated.replace("expectedBehaviorsAfter:117,ledgerRevision:ledger.revision","expectedBehaviorsAfter:117,runtimeCompatibilityVerified:false,ledgerRevision:ledger.revision",1)
dest=r/'cl13-clock-preview-v002.page.js'
if dest.exists():raise SystemExit('STOP v002 preview already exists')
dest.write_text(updated,encoding='utf-8')
print('SOURCE_V002_SHA',newhash)
print('PREVIEW_V002_SHA',hashlib.sha256(updated.encode()).hexdigest())
print('PREVIEW_STAGED',dest.name)
