from pathlib import Path
import hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
expected={'notice':'49c934bb7ef15bfeddfb6d0f76564fa7b69764a3b3b24ec043feafe1aa5a9a46',
'signet':'bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2'}
for key,sha in expected.items():
 p=r/('cl91-m2-'+key+'-original-v001.js')
 x=p.read_text(encoding='utf-8')
 y=x.encode('utf-8')
 if hashlib.sha256(y).hexdigest()!=sha:raise SystemExit('STOP original source not just newline-normalized: '+key)
 p.write_bytes(y)
 print('REFERENCE_LF_RESTORED',key,sha)
p=r/'cl91-m2-single-event-offline-v001.cjs'
s=p.read_text(encoding='utf-8')
old="const k={getFlag:()=> 'dbx:central-lodge:macro:runtime',execute:async({speaker})=>{"
new="const k={getFlag:()=> ({stableId:'dbx:central-lodge:macro:runtime'}),execute:async({speaker})=>{"
if s.count(old)!=1:raise SystemExit('STOP mock source drift')
p.write_bytes(s.replace(old,new,1).encode('utf-8'))
print('MOCK_GETFLAG_SHAPE_CORRECTED')
