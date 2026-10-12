from pathlib import Path
import hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-playwright-harness')
p=r/'cl91-m2-founder-portrait-serialized-source-v001.js'
x=p.read_text(encoding='utf-8')
expected='4b341ee93374af01b64b07061b4f509ea701d5cd2b1d02f8ee98562a17f98cf6'
assert hashlib.sha256(x.encode('utf-8')).hexdigest()==expected,'Source changed beyond CRLF'
p.write_bytes(x.encode('utf-8'))
print('NORMALIZED_COMPOSED_TO_EXACT_LF',hashlib.sha256(p.read_bytes()).hexdigest())
p=r/'cl91-m2-single-event-offline-v001.cjs'
t=p.read_text(encoding='utf-8')
old="getFlag:()=> 'dbx:central-lodge:item:founders-signet'"
new="getFlag:()=> ({stableId:'dbx:central-lodge:item:founders-signet'})"
assert t.count(old)==1,'Item mock anchor drift'
p.write_bytes(t.replace(old,new,1).encode('utf-8'))
print('ITEM_FLAG_MOCK_MATCHES_FOUNDRY')
