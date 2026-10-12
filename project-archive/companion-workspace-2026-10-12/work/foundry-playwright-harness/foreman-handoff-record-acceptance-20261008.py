from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md';s=road.read_text(encoding='utf-8')
new='''### Foreman context-capacity handoff (2026-10-08)
The user explicitly requested a complete data/metadata reconciliation and a next-Foreman handoff; all live implementation has stopped for handoff. C1 was independently reread and confirmed **already installed** grid 240, and `cl90-progress-safety-smoke-v013.page.js` independently returned `PASS_WITH_KNOWN_BLOCKERS` with zero failures, 21 Scenes/202 Regions/119 behaviors/33 Items, ledger revision3. The next bounded slice remains **C2** (gridless 120→160 candidate), but **do not start C2 during handoff**. Successor source: `handoffs/FOREMAN-NEXT-CHAT-COMPLETE-CATALOG-2026-10-08.md` and `handoffs/catalog-2026-10-08/`. No CL50 installer or final gameplay test.

'''
anchor='## CL-93 FINAL'
if s.count(anchor)!=1:raise SystemExit('STOP roadmap anchor drift')
if 'Foreman context-capacity handoff (2026-10-08)' in s:raise SystemExit('STOP already noted')
road.write_text(s.replace(anchor,new+anchor,1),encoding='utf-8')
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md';s=check.read_text(encoding='utf-8')
needle='- [x] C1 Hidden Chapel grid 120'
i=s.find(needle)
if i<0:raise SystemExit('STOP checklist anchor drift')
e=s.find('\n',i)
if e<0:raise SystemExit('STOP checklist no newline')
insert='- [x] Context-capacity handoff: reconciled later C1 applied checkpoint against independent live C1 full-Scene readback and CL90 v013 (zero failures), recorded canonical next-Foreman handoff and complete KB/file/Scene inventory plan. No C2 or CL50 live write in the cataloging turn.\n'
if 'Context-capacity handoff:' in s:raise SystemExit('STOP already noted')
check.write_text(s[:e+1]+insert+s[e+1:],encoding='utf-8')
print('HANDOFF_ACCEPTANCE_RECORDED_ROADMAP_CHECKLIST')
