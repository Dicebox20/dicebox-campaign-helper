# CL91 M2 Founder Portrait: serialized single-event observation and Signet mechanism
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

## Applied and independently verified (source-only)
- M2 composite original outer Signet Behavior `IdriZEGhxUY9whcV` source SHA-256 `4b341ee93374af01b64b07061b4f509ea701d5cd2b1d02f8ee98562a17f98cf6`. Original Signet code body SHA `bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2` and original Notice body SHA `49c934bb7ef15bfeddfb6d0f76564fa7b69764a3b3b24ec043feafe1aa5a9a46` were extracted back out of installed source and independently verified.
- Inner Notice Behavior `NxUruGwqnow13Krv` intentionally disabled, but retains its original bytes/flag hash. Same Regions/IDs/geometries/Events, one active enter handler on outer Region.
- Source integration 15/15 Node tests PASS; exact no-write PREVIEW PASS; one guarded dual-Region APPLY PASS; separate source/ledger FINAL VERIFY PASS.
- Foundry source totals 21 Scenes/202 Regions/118 RegionBehaviors/33 Items, one intentionally disabled inner Notice, ledger revision 2 unchanged, observed/opened both false, Old Estate Survey unrecovered. M1 clock, U2 history, kernel unchanged.
- Unknown: real-world simultaneous GM/world/client events have not been exercised; in-memory queue only serializes this one handler on one GM client. No global server-CAS guarantee. Final actual-player canary is reserved for campaign acceptance. N3 and CL50 remain separate blockers.

