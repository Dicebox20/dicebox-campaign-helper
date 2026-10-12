from pathlib import Path
import hashlib
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
source=r/'work/foundry-playwright-harness/cl91-m2-u2-ledger-final-evidence-v001.sql'
target=r/'database/seed.d/zzzzzz-2026-10-08-cl91-m2-u2-source-migration-final.sql'
if target.exists():raise SystemExit('STOP: target already exists, do not replay')
b=source.read_bytes().replace(b'source hashes bb f7 etc: M2',b'source hashes: M2')
target.write_bytes(b)
print('KB_FINAL_DELTA_STAGED',target.name,'SHA',hashlib.sha256(b).hexdigest())
