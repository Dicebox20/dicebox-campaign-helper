from pathlib import Path
r=Path(r'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper')
road=r/'docs/CENTRAL-LODGE-ROADMAP.md'
check=r/'docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'
report=r/'docs/CL91-M2-FOUNDER-PORTRAIT-SERIALIZED-SINGLE-EVENT-2026-10-08.md'
if report.exists():raise SystemExit('STOP dossier exists')
report.write_text("""# CL91 M2 Founder Portrait: serialized single-event observation and Signet mechanism
**Accepted scope 2026-10-08, design/source stage.**

## Exact current source evidence
- M2 Portrait Notice Region `fMT43gKz5Am84FEi`: rectangle (440,400) 760×600; Notice behavior `NxUruGwqnow13Krv`, source SHA256 `49c934bb7ef15bfeddfb6d0f76564fa7b69764a3b3b24ec043feafe1aa5a9a46`, `tokenEnter`, 1d20 vs DC6, one attempt per Actor, silent failure and physical inspection fallback.
- M2 Founder Portrait Signet Region `FRY091GwobgD2M5i`: encompassing rectangle (420,390) 800×650; Signet pickup `IdriZEGhxUY9whcV`, source SHA256 `bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2`, `tokenEnter`. Its exact inner source/pickup payload must be preserved in the new composite: possession of canonical Founder's Signet permits one persistent Old Estate Survey pickup and `puzzles.m2.founderPortraitOpened=true`. Do not auto-give the Signet.
- Both Regions overlap almost fully. Installing a second independently writing enter handler would race the shared whole-object ledger. The kernel has no CAS/transaction for concurrent writes.
- Canonical Foundry baseline 21 Scenes, 202 Regions, 118 RegionBehaviors, 33 Items, ledger revision2 with `founderPortraitObserved=false`, `founderPortraitOpened=false`, Old Estate Survey unrecovered. Dedicated Assistant Gamemaster may perform guarded exact write; primary GM owns ledger kernel writes.

## Accepted implementation
- Keep **one** active `tokenEnter` RegionBehavior on the *outer* Founder Portrait Region, same behavior ID/stable ID and existing Item pickup semantics. Replace that source only with a **single serialized orchestrator** that invokes the **exact existing Notice body** and **exact existing Signet pickup body** in order, with a separate canonical `observe` request for `puzzles.m2.founderPortraitObserved` between. If no Signet, portrait is observed but compartment stays shut. If Signet present, portrait observation is followed by the existing physical reveal/pickup, never automatic Signet consumption.
- Disable the redundant inner Portrait Notice RegionBehavior `NxUruGwqnow13Krv` without changing its source bytes, stable ID or Region geometry. Preserve its source as read-only evidence and a recoverable rollback target. The outer Region encompasses the inner: players encounter the Notice at least as early as before.
- Preserve the one-time DC6 Notice and all critical fallback fields exactly; observation must succeed after a failed *roll*, because a one-time failed roll cannot softlock physical examination.
- Guard on exact scene/Actor and primary GM. Serialize simultaneous enters on a single primary-GM client using an in-memory queue; refuse duplicate or inappropriate events and reread state between each kernel action. Do not claim global cross-client server CAS: no cross-room races tested.
- Observation message is deliberately non-revealing: inspect the Founder Portrait and detect intentional modifications without prematurely revealing missing-eye clue, Signet socket, Survey, culprit or hidden room answer.
- One bounded two-Region document update with source/hash/count preconditions, no active non-GM players, no geometry/item/ledger changes, idempotency guard, independent fresh final readback. Apply disable-inner first, then replace outer script; if either step is outcome unknown STOP and reconcile, never blind replay.
- Negative tests: wrong-world/version, altered source, duplicate changes, no Signet, Signet pickup, repeated Notice attempt, failed Notice roll, failed kernel step, two overlapping token events serialized, no Item auto-grant and no change before actual gameplay.
- Preserve M1 4:35 clock, U2 history, N3/T3 quarantine and final-user-playtest policy.

**State:** accepted implementation design; not proof of installed behavior or gameplay certification.
""",encoding='utf-8')
s=road.read_text(encoding='utf-8-sig')
anchor='## CL-93 FINAL — Scene lighting and visual effects'
if s.count(anchor)!=1:raise SystemExit('STOP roadmap anchor drift')
s=s.replace(anchor,"""## CL91 M2 Founder Portrait serialized observation and Signet pickup (2026-10-08)
**Accepted implementation plan:** M2 Portrait Notice and Founder Portrait Signet Regions overlap almost completely. Replace the outer portrait's Signet behavior source with a single ordered, locally serialized Notice → observation → existing Signet/persistent Old Estate Survey pickup flow; disable the redundant inner Notice behavior while preserving its original source/ID/geometry. Separate `founderPortraitObserved` from `founderPortraitOpened`; failed DC6 Notice must not block discovery. No extra parallel automatic writer, and no extra Item rewards. See `docs/CL91-M2-FOUNDER-PORTRAIT-SERIALIZED-SINGLE-EVENT-2026-10-08.md`. **Status:** accepted design, KB/preflight and source verification pending. Player test deferred.
 
"""+anchor,1)
road.write_text(s,encoding='utf-8')
s=check.read_text(encoding='utf-8-sig')
anchor='## CL-93 Scene lighting and visual effects — final stage'
if s.count(anchor)!=1:raise SystemExit('STOP checklist anchor drift')
s=s.replace(anchor,"""## CL91 M2 Founder Portrait single-event safe integration
- [x] Foundry read-only geometry/source audit: inner Portrait Notice and outer Founder Portrait Regions largely overlap; original Notice and Signet source hashes frozen.
- [x] Accept one serialized, outer RegionHandler that preserves both original Notice and Signet pickup bodies and adds a distinct portrait observation step; disable only redundant inner Notice event, preserving source/IDs.
- [ ] Reconcile DB provenance and exact migration scope, then build offline race/rollback/failed-roll tests.
- [ ] Run exact-hash/read-only Foundry PREVIEW; perform guarded disable-inner then update outer only if fully authorized; independent fresh readback of both Regions, Item state, kernel and ledger.
- [ ] Final user-directed game playtest, including Signet absence/presence and portrait inspection, deferred until full campaign.

"""+anchor,1)
check.write_text(s,encoding='utf-8')
print('ACCEPTED_M2_ONE_WRITER_PLAN',report.name)
