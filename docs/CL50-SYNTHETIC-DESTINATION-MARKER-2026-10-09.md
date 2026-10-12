# CL-50: offline synthetic destination-Token marker correlation

**Gate:** RESEARCH / SIMULATOR ONLY. No game login, network use, scene mutation,
or Token teleport implementation. All outputs are review-only and return
`committedTeleportAuthorized:false`, `mayRetry:false`, and `neverDispatch:true`.

## Implemented

- `tools/clscale-synthetic-marker-validator.mjs`: pure simulated Token
  JSON serialization, canonical rehydration, exact marker/Actor/route/source
  matching, duplicate detection, and source-versus-target overlap handling.
- `tools/clscale-synthetic-foundry-flag-mock.mjs`: pure mock of a hypothetical
  destination Token creation which merges new marker fields while preserving
  unrelated module flags and existing DiceBox options. It **refuses** an already
  populated transfer marker rather than overwriting it.
- `tools/clscale-synthetic-transfer-journal.mjs`: synthetic per-intent
  hash-linked interrupted-transfer log and non-executable proposed
  `updateData.flags["dicebox-campaign-helper"].transferIntent` marker.
- `work/clscale-central-lodge-migration-v001/clscale-synthetic-marker-validator.test.mjs`:
  fake/mismatched source/target identity tests, collision and duplicate
  tests, malformed envelope tests, journal binding, and flag merge tests.

A marker carries exactly these fields:

```json
{
  "schema": 1,
  "synthetic": true,
  "worldId": "dbx-test-world",
  "intentId": "synthetic-unique-id",
  "routeId": "t3-f1",
  "actorId": "synthetic-actor-id",
  "sourceTokenId": "synthetic-source-token-id",
  "sourceSceneId": "aIKQmFiuXWipEdyb",
  "targetSceneId": "La9krMOMBhAhDLi6"
}
```

It uses the *proposed* `TokenData.flags` namespace
`dicebox-campaign-helper.transferIntent` and a separate observer-provided
destination Scene ID. The Token's Actor ID, Scene ID, source Token ID, full
route, world ID and receipt intent ID must all match. Matching just an Actor
ID is explicitly insufficient.

The journal-bound reviewer requires a hash-valid synthetic log with exactly
one matching intent and an interrupted state. Prepared-only intents, missing
journals, and corrupt receipts fail closed.

## Security and correctness boundaries

- **Neither the Token marker nor the SHA-256 journal chain is authenticated.**
  Anyone with write access could forge a matching Token flag or rewrite a
  hash chain. Their combination is evidence for review, not user consent or
  cryptographically validated provenance.
- The strict canonical JSON envelope is a **test-harness contract**, not a
  claim about Foundry TokenDocument.toObject serialization. Actual Token
  documents have many additional fields.
- The flag-merge mock does **not** prove that Foundry v14
  `RegionDocument.teleportToken` preserves or merges `updateData.flags`.
  It does not invoke Foundry. Runtime validation remains a separate gate.
- Source- and target-Scene records must be read separately from an
  independently verified, private and authenticated Foundry fixture. The
  current fixture has an unprotected GM login and previously listened beyond
  localhost, so it remains stopped.
- A single correlated destination Token is still classified as
  `UNAUTHENTICATED_CORRELATED_ARRIVAL`, or
  `JOURNAL_BOUND_UNAUTHENTICATED_CORRELATED_ARRIVAL`.
  A source Token still present plus a claimed arrival, two correlated
  arrivals, two identical Token IDs, or mismatched marker data are quarantined.
- There is **no live dispatcher, recovery worker, rollback, replay, or
  approval-consuming implementation**.
- The existing F1→F2/CL-50 Region scripts, puzzle flags, Teleport routes,
  actors and production world are unchanged.

## Test and evidence

On the connected Windows PC, run:

```powershell
$repo = 'C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper'
$dir = "$repo\work\clscale-central-lodge-migration-v001"
node --test "$dir\clscale-synthetic-marker-validator.test.mjs" "$dir\clscale-synthetic-transfer-journal.test.mjs" "$dir\clscale-transfer-safety-policy.test.mjs"
```

**Verified:** 68 tests passed, 0 failed, Node exit 0.

Latest scheduled fixture check:
`work/clscale-central-lodge-migration-v001/fixture-readonly-preflight-history.jsonl`.
It continues to report 13 passing checks for the stopped fixture.

## Next gated work

1. Further offline adverse-case testing, including cross-Actor Token copying,
   transferred versus linked Tokens, and crash/restart receipt correlation.
2. Prove a private/authenticated fixture login method without changing the
   Windows Firewall or production server.
3. On a properly isolated throwaway instance, verify Foundry v14's actual
   `updateData` flag behavior and source/destination Token identity
   semantics **without committed teleports**.
4. Certify collision-free, footprint-aware fixed arrival positions and
   elevations for all four Scene routes.
5. Keep separate, explicit single-use human authorization and independent
   safety gate mandatory before any committed teleport. Neither is present.
