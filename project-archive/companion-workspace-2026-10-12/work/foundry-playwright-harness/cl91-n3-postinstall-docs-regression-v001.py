from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
doc=r/'docs/CL91-N3-T3-BRANCH-UNLOCK-CANDIDATE-2026-10-08.md'
s=road.read_text(encoding='utf-8-sig')
old=next((line for line in s.splitlines() if line.startswith('## CL91 N3-to-T3 hidden branch rule')),None)
new='## CL91 N3-to-T3 three-proof hidden branch unlock - source installed (2026-10-08)'
if s.count(old)!=1:raise SystemExit('STOP roadmap section drift')
s=s.replace(old,new,1)
old='Explicit campaign author approval was received in this conversation; gate implementation is now authorized following KB reconciliation, exact PREVIEW, one guarded install, independent verification and checkpoint. Live N3 flag `t3BranchUnlocked=false`, branch Region empty, ledger revision2 before installation.'
new='Author approval recorded, KB rebuilt, actual gate source 19/19 offline tests PASS, exact live no-write PREVIEW PASS, one scoped APPLY PASS, independent Foundry final readback PASS. One new enabled N3 Branch Railway RegionBehavior `yikneH7tFfD5zsr6` (stable ID `dbx:central-lodge:n3:behavior:t3-branch-three-proof-unlock-v001`, source SHA-256 `3ae5572a2e6df1e2a2611630163b90e73450ba400acd0a9d38ab4d4a2e6d4cbd`). Campaign 21 Scenes / 202 Regions / 119 behaviors (one intentional disabled M2 Notice) / 33 Items, ledger revision 2 unchanged; `t3BranchUnlocked=false` until players complete the prerequisites. **No N3-to-T3 teleport and no gameplay acceptance.**'
if s.count(old)!=1:raise SystemExit('STOP roadmap receipt drift')
road.write_bytes(s.replace(old,new,1).encode('utf-8'))
s=check.read_text(encoding='utf-8-sig')
old='- [ ] After approval: reconcile KB and rebuild; offline validation, guarded no-write PREVIEW, one authorized N3 RegionBehavior APPLY, independent source/ledger reread, checkpoint.'
new='- [x] User-approved three-proof rule reconciled in canonical KB and rebuilt; actual RegionBehavior 19/19 offline tests PASS, exact no-write Foundry PREVIEW PASS, one guarded N3 APPLY PASS, independent source/ledger reread PASS (one new enabled behavior, total 119, unchanged ledger revision 2). Durable checkpoint in progress.'
if s.count(old)!=1:raise SystemExit('STOP checklist gate drift')
check.write_bytes(s.replace(old,new,1).encode('utf-8'))
s=doc.read_text(encoding='utf-8-sig')
old='**Status: USER-APPROVED THREE-PROOF LOGICAL GATE (2026-10-08); NOT YET INSTALLED.**'
new='**Status: USER-APPROVED THREE-PROOF LOGICAL GATE (2026-10-08); INSTALLED AND INDEPENDENTLY SOURCE-VERIFIED, NOT PLAYER-TESTED.**'
if s.count(old)!=1:raise SystemExit('STOP dossier status drift')
s=s.replace(old,new,1)
s+='''

## Installation receipt (2026-10-08, source layer only)
- Source: `work/foundry-playwright-harness/cl91-n3-three-proof-gate-source-v001.js` normalized/stored source SHA256 `3ae5572a2e6df1e2a2611630163b90e73450ba400acd0a9d38ab4d4a2e6d4cbd`.
- Exact guarded live PREVIEW PASS at 21/202/118/33, ledger revision2, empty N3 Branch Railway and existing Departure Board/Wheel/Cartography mechanism hashes unchanged.
- One authorized Assistant Gamemaster APPLY created enabled `tokenEnter` RegionBehavior `yikneH7tFfD5zsr6` with stable ID `dbx:central-lodge:n3:behavior:t3-branch-three-proof-unlock-v001`.
- Independent source/hash/geometry/ledger final VERIFY PASS: 21 Scenes / 202 Regions / 119 RegionBehaviors (one disabled M2 duplicate Notice) / 33 Items. Exact previous ledger SHA and revision2 unchanged, and all four N3 branch states remain false until earned by players.
- Actual source offline tests 19/19 PASS, original candidate pure-logic tests 17/17 PASS. No new Items, Actor changes, travel code, token transfer, scene/macro modifications, or player gameplay test.
- CL50 route installation and N3-to-T3 teleport remain separately blocked pending exact safe-token-footprint and authorized end-to-end transit gates. Do not treat enabled branch logic as enabled travel.
'''
doc.write_bytes(s.encode('utf-8'))
p=r/'work/foundry-playwright-harness/cl90-progress-safety-smoke-v007.page.js'
t=p.read_text(encoding='utf-8')
pairs=[
('behaviors!==118','behaviors!==119'),
('stableIds.size!==118','stableIds.size!==119'),
('n3?.behaviors.size!==0','n3?.behaviors.size!==1'),
('cl90.progress-safety-smoke-v007','cl90.progress-safety-smoke-v008'),
('N3 to T3 branch unlock action not authored','N3 three-proof branch unlock installed/source-verified; actual player token entry and safe outgoing T3 teleport remain untested'),
('Unapproved blocked puzzle change','Existing M1 solved state or N3 branch prereq state drift')
]
for old,new in pairs:
 if t.count(old)!=1:raise SystemExit('STOP CL90 anchor drift '+old)
 t=t.replace(old,new,1)
anchor='const cl13behavior=m1?.behaviors.find'
extra='''const n3Gate=n3?.behaviors.find(b=>b.getFlag("world","dicebox")?.stableId==="dbx:central-lodge:n3:behavior:t3-branch-three-proof-unlock-v001");
if(!n3Gate||n3Gate.disabled||n3Gate.system?.events?.size!==1||
 !n3Gate.system?.events?.has("tokenEnter")||
 await sha(n3Gate.system?.source??"")!=="3ae5572a2e6df1e2a2611630163b90e73450ba400acd0a9d38ab4d4a2e6d4cbd"||
 n3Gate.getFlag("world","dicebox")?.sourceHash!=="3ae5572a2e6df1e2a2611630163b90e73450ba400acd0a9d38ab4d4a2e6d4cbd"||
 /teleportToken|pullUsers|spawnTokens/.test(n3Gate.system?.source??""))
 failures.push("CL91 N3 three-proof branch source or event drift");
'''
if t.count(anchor)!=1:raise SystemExit('STOP CL90 insertion anchor missing')
t=t.replace(anchor,extra+anchor,1)
out=p.with_name('cl90-progress-safety-smoke-v008.page.js')
if out.exists():raise SystemExit('STOP regression v008 already exists')
out.write_bytes(t.encode('utf-8'))
print('N3_DOCS_UPDATED_CL90_V008_STAGED')
