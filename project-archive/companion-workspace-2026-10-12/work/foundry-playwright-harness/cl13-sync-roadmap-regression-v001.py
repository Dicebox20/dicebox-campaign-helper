from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
s=road.read_text(encoding='utf-8-sig')
updates=[
("Source/preflight partially passed; exact M1 clock solution, N3 branch unlock and M2/U2 semantic fields unresolved",
"CL13 4:35 clock installed and source-verified, user gameplay test deferred; N3 branch unlock and M2/U2 semantic fields unresolved"),
("global day-to-night event trigger; M1 clock literal; M2 and U2 state-path semantics",
"global day-to-night event trigger; M1 clock player acceptance; M2 and U2 state-path semantics"),
("**Implementation status:** APPROVED DESIGN; runtime installer and clue delivery require governed PREVIEW / APPLY / independent VERIFY. Prior CL-50 railway installer quarantine unaffected.",
"**Implementation status (2026-10-08):** M1 inscription, U1 fourth-heir clue and E4 1431/1438 DR grave chronology installed and independently source-verified. Exactly one enabled M1 Clock Setting RegionBehavior is installed (`OUMWc1YjJ5DTSFzM`, `tokenMoveIn`, stored source SHA-256 `5ee8f97403d5144cbacf64e57ea58862bf4daf4ec4643088531e7f27e12ac997`); Foundry removed one final source newline and exact normalized equality was verified. Current authoritative source totals: 21 Scenes, 202 Regions, 117 behaviors, 33 Items, ledger revision 1. The clock remains unsolved; no actual-player input/dialog or puzzle reward pickup certified. Source installation only, not Ready-to-Play. CL-50 installer quarantine unaffected.")
]
for old,new in updates:
 if s.count(old)!=1:raise RuntimeError('Roadmap anchor mismatch:'+old[:60])
 s=s.replace(old,new,1)
road.write_text(s,encoding='utf-8')
print('UPDATED_ROADMAP',road.name)
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
s=check.read_text(encoding='utf-8-sig')
updates=[
('- [x] Confirm live existing M1 Clock Setting Region `3tIrR12uv8ppFkOb` is empty and clock compartment already has two separate guarded reward behaviors; U1 Family Records and E4 graveyard Regions exist.',
 '- [x] Pre-install verification: M1 Clock Setting Region `3tIrR12uv8ppFkOb` was empty; both reward handlers and U1/E4 Regions existed. Now one source-verified clock behavior is installed.'),
('- [ ] Reconcile approved design, canon chronology, source provenance and exact invariant with KB; rebuild/verify before implementation.',
 '- [x] Reconcile approved 4:35 design and new authored U1/E4 dates into the canonical KB, rebuild and verify integrity; new author details do not claim recovered original chronology.'),
('- [ ] Build no-write PREVIEW for new clock behavior and clue integrations: no edits to geometry, map art, existing rewards, inventory or unrelated story sources.',
 '- [x] No-write previews for U1, E4, M1 inscription and M1 clock; exact-scoped source/hash preconditions verified.'),
('- [ ] Guarded one-action installation through authorized GM and authoritative independent reread of expected IDs, state and source.',
 '- [x] Separate guarded U1/E4/M1 clue changes and one M1 clock behavior installation independently source-verified. Foundry strips final script LF: normalized exact equality independently proven; 21/202/117/33, unchanged ledger revision 1.'),
]
for old,new in updates:
 if s.count(old)!=1:raise RuntimeError('Checklist anchor mismatch:'+old[:60])
 s=s.replace(old,new,1)
check.write_text(s,encoding='utf-8')
print('UPDATED_CHECKLIST',check.name)
old=(r/'work/foundry-playwright-harness/cl90-progress-safety-smoke-v003.page.js').read_text(encoding='utf-8')
new=old
for a,b in [
 ('behaviors!==116','behaviors!==117'),
 ('stableIds.size!==116','stableIds.size!==117'),
 ("m1?.behaviors.size!==0","m1?.behaviors.size!==1"),
 ('cl90.progress-safety-smoke-v003','cl90.progress-safety-smoke-v004'),
 ('M1 clock setting undefined numeric solution, no writer',
  'M1 clock installed and source-verified; actual player clock interaction and reward completion not yet tested')
]:
 if new.count(a)!=1:raise RuntimeError('Regression patch anchor mismatch:'+a)
 new=new.replace(a,b,1)
sourcecheck="""const cl13behavior=m1?.behaviors.find(b=>b.getFlag("world","dicebox")?.stableId==="dbx:central-lodge:m1:behavior:clock-setting-seventh-winter-v001");
if(!cl13behavior||cl13behavior.disabled||cl13behavior.system?.events?.size!==1||!cl13behavior.system?.events?.has("tokenMoveIn")
||await sha(cl13behavior.system?.source??"")!=="5ee8f97403d5144cbacf64e57ea58862bf4daf4ec4643088531e7f27e12ac997")
failures.push("CL13 installed M1 clock behavior source/event drift");
"""
anchor='const m=game.macros.get("P7mgEkmAUiJXYdUD")'
if new.count(anchor)!=1:raise RuntimeError('CL13 new regression insertion anchor mismatch')
new=new.replace(anchor,sourcecheck+anchor,1)
p=r/'work/foundry-playwright-harness/cl90-progress-safety-smoke-v004.page.js'
if p.exists():raise RuntimeError('v004 regression already exists')
p.write_text(new,encoding='utf-8')
print('CREATED_REGRESSION',p.name)
