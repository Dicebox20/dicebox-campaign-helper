# DiceBox CL-50: synthetic durable intent/receipt journal

**Status:** OFFLINE RESEARCH PROTOTYPE. No integration into Foundry, no teleport
dispatch capability, no permission to commit or replay transfers.

## Why a journal is needed

Foundry v14 `RegionDocument.teleportToken` may delete a source Token and create a
new destination Token on cross-Scene movement. The method returns a new Token
Document for cross-Scene teleportation and accepts an optional `updateData`
partial Token object; it does not promise transactional rollback on interrupted
delivery. Source: https://foundryvtt.com/api/classes/foundry.documents.RegionDocument.html

A lost response can mean (1) source Token remains, (2) source was deleted but
destination was created, (3) source is absent and destination is absent, or
(4) duplicate/conflicting objects exist. None of these outcomes licenses
blind retry. Actor ID alone is not sufficient to correlate a created Token
because an Actor can have more than one Token.

## Offline-only implementation

- `tools/clscale-synthetic-transfer-journal.mjs`
- `tools/clscale-transfer-safety-policy.mjs`
- Tests: `work/clscale-central-lodge-migration-v001/clscale-synthetic-transfer-journal.test.mjs`
  and `.../clscale-transfer-safety-policy.test.mjs`
- All journal content is limited to immediate children of the migration work
  directory named `synthetic-ledger-*`. It **cannot** write Foundry databases
  or production world files.
- One append-only JSONL file per sandbox, exclusive filesystem lock `wx`,
  stable sequence numbers, previous-entry hash chain, full readback checks,
  and filesystem sync. Duplicate intent IDs and invalid transitions fail closed.
- Any unclean/uncertain write leaves a writer lock for manual inspection. A
  deliberately rejected input releases its lock, since no bytes were attempted.
- Record types: `synthetic.intent`, `synthetic.interruption`,
  `synthetic.observation`, and `synthetic.humanReview`. A review record
  **only** says further review is needed, not that a teleport succeeded.
- Records carry a `synthetic:true` marker and exact disposable-world,
  route, source Scene, destination Scene, Actor and source Token IDs.
  Approval, authorization, token handles, and arbitrary extra fields are
  disallowed in the draft records.
- Proposed Token correlation marker uses
  `updateData.flags["dicebox-campaign-helper"].transferIntent`, containing
  schema, intent ID, route, source Token and Scene, and target Scene. This
  returned object is a **proposal**, not an invocation. Marker survival must
  be verified independently before any transport implementation.
- SHA-256 hash chaining detects accidental modification or data drift, not a
  malicious actor who can rewrite the whole log. It is **not** signed or an
  authorization mechanism and is not a power-loss-proof distributed commit.
- No scheduled task is configured to write synthetic journal events. The
  existing 15-minute Windows task only runs the immutable-Scene preflight.

## Safety: recovery remains manual

The pure `classifyTransferRecovery` function distinguishes source-present,
source/destination-absent, multiple-arrival, uncorrelated same-Actor Token,
and single correlated arrival evidence. It always returns
`mayRetry:false`, `mayAutoRepair:false`, and
`committedTeleportAuthorized:false`.

An interrupted transfer may not be automatically reissued, reconciled as
completed, or force-repaired from these classifications. A future production
design needs a separate authoritative, durable status register, linked receipt,
idempotent commit consumption, exact Token identity verification across two
Scenes, and explicit human confirmation to close uncertain outcomes.

## Current test result

```powershell
$repo='C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper'
node --test "$repo\work\clscale-central-lodge-migration-v001\clscale-synthetic-transfer-journal.test.mjs" "$repo\work\clscale-central-lodge-migration-v001\clscale-transfer-safety-policy.test.mjs"
```

Tested: **41 passed, 0 failed**. The tests cover malformed, altered, and
truncated records; orphaned locks; simultaneous writers; scope enforcement;
duplicate IDs; state ordering; uncertain outcomes; rights, authority,
confirmation, and independent gating.

## Next steps before any runtime changes

1. Validate Foundry v14 Token creation/flag merging and the proposed
   correlation marker against a **noncommitting mock** or independently
   isolated throwaway Foundry instance. Document no-change evidence.
2. Prove the test fixture's network listener is private and the GM login is
   protected before starting it. Do not modify Windows Firewall.
3. Certify Token-size, wall, collision, elevation, and placement at the four
   proposed Region arrival locations; `'center'` is documented, `'exact'`
   is not. Alternative offsets require runtime verification.
4. Design a durable, per-intent single-use commit gate with externally
   independently verified evidence, crash consistency, replay protection
   and human-readable receipt. Keep the mock simulator separate from any
   actual Foundry dispatcher.
5. Never perform a committed teleport without **both** an independently
   passed isolation/safety gate and a separate explicit single-use user
   authorization, consumed and recorded. Neither has been granted here.

Original Tuesday Campaign, CL-50 behaviors, Regions, Actors, and puzzle
ledger were not modified. Fixture remains stopped.
