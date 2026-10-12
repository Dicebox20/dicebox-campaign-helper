# Foreman Relay Checkpoint — CL-32 Certified / CL-33 Reconciliation / CL-40-41 Intake
Date: 2026-10-07 (America/Los_Angeles). Source of truth: live Foundry independent final verifies and DB rebuild receipts.

## Completed since last checkpoint

- **CL-32 N3 APPLY PASS** created 11 RegionBehaviors (11/11), from `n3-apply-v001.page.js`; separate `n3-final-verify-v001.page.js` returned PASS, noWrite, 0 failures. N3 `pHQvDUDlyWZFuNrX` has 12 Regions / 11 behaviors. Global 21 Scenes / 202 Regions / 112 behaviors / 33 Items; kernel SHA `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814` and N3 geometry SHA `43bcb471640053e7000a8b37c6cd5243179295f5fe80f0537077646b62df1fd3`, ledger revision 0, notices empty. No canary.
- Database connection recovered; prior interrupted DB write confirmed absent, now reconciled with new `database/seed.d/2026-10-08-zzzzzzzzzzzzzzzzzzzzzzz-cl32-complete.sql`, `verify_database.py` updated.
- User-mandated continuation-execution rule appended `AGENTS.md`, decision `D-449`. Additional direct-user delegated Codex origin `892a0d8a-b2de-404a-894e-b6bae4def9e0 / 01a0e88f-c6de-7b41-853f-1de0bb464886` added to `AGENTS.md`, decision `D-450`. Honor higher-priority bounded relay envelopes.
- CL-33 T1/T2/T3 read-only Foundry preflight PASS at 202/112, 8 existing legacy behaviors, 3 critical progression mismatches. Separate source, Actor flags/inventory and guarded prewrite audits passed; **APPLY BLOCKED_DEPENDENCY_RECONCILIATION**. No tunnel write. See `docs/CL33-TUNNEL-PROGRESSION-MIGRATION-2026-10-07.md` for exact IDs, sources, hashes, ownership/softlock constraints.
- CL-40 F1 & CL-41 F2 read-only intake completed, 6/4 and 8/4 respectively, legacy code. F1 Cicada Assembly uses player.character Actor Item name match; correct canonical Wing III grant can satisfy it. Existing F1→F2 transition known; do not rewrite.
- DB rebuilt & verified integrity OK after CL-33 evidence, 367 sources / 1147 facts / 455 decisions / 532 open items / 198 trials, global metadata 21/202/112/33, gate `CL-33 T1/T2/T3 Runtime Contract Migration PREVIEW`.
- Two blockers recorded: `O-2026-10-07-CL33-CANONICAL-PICKUP-MIGRATION` (P0), `O-2026-10-07-CL33-ROUTE-TOPOLOGY` (P1).

## Next governed work

1. Recheck live baseline and `AGENTS.md` before edit. Do not repeat CL-32 or install N3 again.
2. Reconcile Foundry RegionBehavior event execution ownership (primary GM vs event.user) and safe canonical pickup invocation. Build a no-write migration PREVIEW that preserves Wing III discoverability and T2/T3 choice dialogs, prevents softlocks/double grants; do not patch on source lint alone.
3. If PREVIEW and authorized runtime safety strategy pass, guarded **in-place** T2/T3 and T1 recovery patch, then independent FINAL VERIFY (not gameplay canary). If unresolved, preserve blocker and continue safe downstream no-write research.
4. Do not assign T1/T2 tunnel mouth orientations, T3 far endpoint, N3 t3BranchUnlocked, rail-car state, CL-50 transitions or CL-51 lights without separate authority/evidence.
5. Continue roadmap toward CL-40/CL-41 as appropriate, checkpoint, and use verified **native live-injection** relay; never inbox-substitute or claim host_accepted == delivered.

**No pending/outcome-unknown live Foundry writes;** all latest Foundry actions since N3 APPLY were read-only and returned PASS. KB writes were independently rebuilt/verified. No gameplay canary.
