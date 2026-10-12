from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
s=road.read_text(encoding='utf-8-sig')
old='**Status:** accepted design, KB/preflight and source verification pending. Player test deferred.'
new='**Status (2026-10-08):** M2 serialized single-event orchestration installed and independently verified. Inner Portrait Notice `NxUruGwqnow13Krv` is disabled with its exact source and stable ID intact; outer Founder Portrait Signet behavior `IdriZEGhxUY9whcV` remains enabled and contains the verbatim original Notice and Signet pickup bodies plus one separate observation. New source SHA-256 `4b341ee93374af01b64b07061b4f509ea701d5cd2b1d02f8ee98562a17f98cf6`. Offline 15/15 PASS. Foundry source 21 Scenes / 202 Regions / 118 behaviors (one intentional disabled) / 33 Items; ledger revision 2, portrait observed/opened false, survey unrecovered. **Not gameplay-certified**; original M1 clock/U2 history/kernel unchanged.'
if s.count(old)!=1:raise SystemExit('STOP roadmap status drift')
road.write_bytes(s.replace(old,new,1).encode('utf-8'))
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
s=check.read_text(encoding='utf-8-sig')
old='- [ ] Reconcile DB provenance and exact migration scope, then build offline race/rollback/failed-roll tests.'
new='- [x] Reconciled KB provenance and exact migration scope; built offline source preservation, failed-roll, Signet absent/present and concurrent-entry tests (15/15 PASS).'
if s.count(old)!=1:raise SystemExit('STOP checklist gate1 drift')
s=s.replace(old,new,1)
old='- [ ] Run exact-hash/read-only Foundry PREVIEW; perform guarded disable-inner then update outer only if fully authorized; independent fresh readback of both Regions, Item state, kernel and ledger.'
new='- [x] Exact-hash/no-write Foundry PREVIEW PASS, guarded disable-inner then update outer APPLY PASS, independent fresh readback PASS. Original Notice source unchanged, original Signet pickup verbatim embedded, actor/Items/ledger/geometry unchanged; one intentional disabled Notice and 118 total behaviors.'
if s.count(old)!=1:raise SystemExit('STOP checklist gate2 drift')
check.write_bytes(s.replace(old,new,1).encode('utf-8'))
report=r/'docs/CL91-M2-FOUNDER-PORTRAIT-SERIALIZED-SINGLE-EVENT-2026-10-08.md'
s=report.read_text(encoding='utf-8')
note="""
## Applied and independently verified (source-only)
- M2 composite original outer Signet Behavior `IdriZEGhxUY9whcV` source SHA-256 `4b341ee93374af01b64b07061b4f509ea701d5cd2b1d02f8ee98562a17f98cf6`. Original Signet code body SHA `bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2` and original Notice body SHA `49c934bb7ef15bfeddfb6d0f76564fa7b69764a3b3b24ec043feafe1aa5a9a46` were extracted back out of installed source and independently verified.
- Inner Notice Behavior `NxUruGwqnow13Krv` intentionally disabled, but retains its original bytes/flag hash. Same Regions/IDs/geometries/Events, one active enter handler on outer Region.
- Source integration 15/15 Node tests PASS; exact no-write PREVIEW PASS; one guarded dual-Region APPLY PASS; separate source/ledger FINAL VERIFY PASS.
- Foundry source totals 21 Scenes/202 Regions/118 RegionBehaviors/33 Items, one intentionally disabled inner Notice, ledger revision 2 unchanged, observed/opened both false, Old Estate Survey unrecovered. M1 clock, U2 history, kernel unchanged.
- Unknown: real-world simultaneous GM/world/client events have not been exercised; in-memory queue only serializes this one handler on one GM client. No global server-CAS guarantee. Final actual-player canary is reserved for campaign acceptance. N3 and CL50 remain separate blockers.

"""
if '## Applied and independently verified' in s:raise SystemExit('STOP prior receipt present')
report.write_bytes((s+note).encode('utf-8'))
reg=r/'work/foundry-playwright-harness/cl90-progress-safety-smoke-v006.page.js'
s=reg.read_text(encoding='utf-8')
pairs=[
 ('behaviors!==118||disabled||missingIds','behaviors!==118||disabled!==1||missingIds'),
 ('cl90.progress-safety-smoke-v006','cl90.progress-safety-smoke-v007'),
 ('M2 Founder Portrait observed/opened distinct ledger fields source-verified; separate physical player reveal untested',
  'M2 single ordered Notice/observation/Signet pickup handler installed and source-verified; actual player interaction remains untested'),
 ('await sha(m2portrait?.system?.source??"")!=="bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2"',
  'await sha(m2portrait?.system?.source??"")!=="4b341ee93374af01b64b07061b4f509ea701d5cd2b1d02f8ee98562a17f98cf6"')
]
for old,new in pairs:
 if s.count(old)!=1:raise SystemExit('STOP regression drift '+old[:60])
 s=s.replace(old,new,1)
anchor='const u2r=game.scenes.get("PVf6Gbrv9HbB88uZ")'
extra='''const m2notice=game.scenes.get("JZkxX6lUQe8Nc8xJ")?.regions.get("fMT43gKz5Am84FEi")?.behaviors.get("NxUruGwqnow13Krv");
if(!m2notice?.disabled||await sha(m2notice?.system?.source??"")!=="49c934bb7ef15bfeddfb6d0f76564fa7b69764a3b3b24ec043feafe1aa5a9a46"
||m2notice.getFlag("world","dicebox")?.sourceHash!=="49c934bb7ef15bfeddfb6d0f76564fa7b69764a3b3b24ec043feafe1aa5a9a46"
||m2portrait?.disabled||m2portrait?.getFlag("world","dicebox")?.sourceHash!=="4b341ee93374af01b64b07061b4f509ea701d5cd2b1d02f8ee98562a17f98cf6")
failures.push("CL91 M2 source/deduped Notice drift");
'''
if s.count(anchor)!=1:raise SystemExit('STOP regression insertion anchor')
s=s.replace(anchor,extra+anchor,1)
out=reg.with_name('cl90-progress-safety-smoke-v007.page.js')
if out.exists():raise SystemExit('STOP v007 exists')
out.write_bytes(s.encode('utf-8'))
print('ROADMAP_CHECKLIST_DOSSIER_UPDATED_REGRESSION_V007_STAGED')
