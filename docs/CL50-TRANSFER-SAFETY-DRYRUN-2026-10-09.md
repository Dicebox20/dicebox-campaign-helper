# CL-50 / F1-F2 teleport safety, offline development checkpoint

**Authority:** Read-only and synthetic fixture analysis only. No live teleport commits authorized.

**World:** disposable `dbx-test-world`, port 30005, left stopped; Foundry v14.367 /
D&D5e 5.3.3. Production `the-lost-mine-of-phandalin` is out of scope.

## What is currently verified

- Imported 21 Central Lodge Scenes, 202 Regions, 119 executeScript behaviors, six
  referenced Actors and required artwork remain intact in offline diagnostics.
- The Windows task `DiceBox-Offline-Preflight-15m` continued passing 13 checks
  every 15 minutes; 17 consecutive passes observed at work start.
- The four source behavior IDs and exact destination Region IDs all exist in the
  fixture and the three CL-50 source/destination stable flag checks match.
- Foundry v14 documents `RegionDocument.teleportToken` with
  `placement: 'center' | 'relative' | 'random'` and optional `offset` /
  `updateData`. It does **not** document an `'exact'` placement mode.
  Cross-Scene teleports delete the old Token and create a new one:
  https://foundryvtt.com/api/classes/foundry.documents.RegionDocument.html
- Current source scripts use `placement:'random'`. The three CL-50 scripts require
  GM confirmation and implement transient in-memory reentry guards; the F1→F2
  script checks its puzzle/primary GM gate but has no confirmation dialog.
- None of the four source scripts shows persistent interrupted-transfer recovery.

## Proposed fixed-location geometry, NOT approved arrival positions

Centers derive from exactly one rectangular destination Region for each route.
All four destination Scenes use grid type 0 (gridless), with preserved pixel grid
sizes. The below alternative points use a **synthetic one-by-one square Token**
with a conservative radius (half its diagonal), 16-pixel geometric margin,
distance to existing wall segments, and approximate existing-Token footprint.

| Route | Region center (pixels) | Grid size (pixels) | Nearest wall at center | Provisional alternative (pixels) | Nearest wall at alternative |
| --- | --- | ---: | ---: | --- | ---: |
| F1→F2 | (2160, 2600) | 240 | 580px | (1920, 2580) | 340px |
| E1→M1 | (2160, 2530) | 320 | 280px | (2160, 2560) | 310px |
| T3→F1 | (2531, 2617) | 120 | **23px** | (2520, 2520) | 120px |
| T3→N3 | (2620, 2630) | 120 | 110px | (2610, 2640) | 120px |

**Important:** nearest-wall distance is only one heuristic. A Region can intersect
a wall, a different elevation, or a blocked Token footprint. No point in this table
is certified safe. In particular F1→F2 has an existing Token near the Region center,
so simple wall distance alone is insufficient. No `teleportToken`, `update`,
`create`, or `delete` operation was invoked during this review.

## Pure, non-executable transfer policy prototype

`tools/clscale-transfer-safety-policy.mjs` exports only pure functions:
`assessTransferDraft`, `assessExistingTransfer`, `rectangleCenterCandidate`
and `classifyTransferRecovery`.

It rejects a plan unless exact disposable world/Scene/Region identity, primary
GM, Token ownership, cross-Scene create/delete permissions, all puzzle gates,
explicit matching GM confirmation, independently verified destination geometry,
independent safety certificate, and fresh single-use authorization are supplied.

Even if all synthetic inputs pass, it only returns
`STATIC_CHECKS_PASSED_REQUIRES_SEPARATE_COMMIT_PROCESS`. Its result has
`committedTeleportAuthorized:false` and `neverDispatch:true`.

The recovery classifier never retries an interrupted or ambiguous transfer. It
does not infer arrival merely from a Token sharing an Actor ID. A future committed
transfer will need a **durable, uniquely linked intent marker** on the destination
Token (potentially via the documented `updateData` field), plus two-sided
exact-Scene evidence and a consumed-and-recorded approval receipt. Absent,
duplicate, conflicting, and unobservable outcomes remain blocked for human
reconciliation, not automatic rollback or recreation.

Synthetic test suite:

```powershell
Set-Location 'C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper'
node --test .\work\clscale-central-lodge-migration-v001\clscale-transfer-safety-policy.test.mjs
```

Results during this work window: **24 passed, 0 failed**.

## Evidence and explicit next gates

- `work/clscale-central-lodge-migration-v001/clscale-arrival-candidates-v001.json`
- `work/clscale-central-lodge-migration-v001/clscale-arrival-clearance-readonly-v001.json`
- `work/clscale-central-lodge-migration-v001/clscale-arrival-clearance-candidates-v001.json`
- `work/clscale-central-lodge-migration-v001/clscale-teleport-static-gate-v001.json`

1. Establish authenticated, provably private fixture network access **without
   changing Windows Firewall**; the GM user has a blank password and the fixture
   previously listened on all interfaces. Never launch it otherwise.
2. Perform **read-only** Foundry runtime verification of Region locations and
   Token geometry, elevation/levels, wall collision, existing occupants,
   ownership and CREATE/DELETE permissions.
3. Draft a **disposable-only** transaction journal/unique receipt design and
   review it independently. Do not write the design into active Region scripts.
4. Certify exact arrival positions and same-/cross-Scene identity behavior using
   no-commit tests. Preserve confirmation, denial cooldown and reentry guards.
5. Require independently passed safety gates AND separate explicit single-use
   human authorization, consumed and recorded, before **any** committed transfer.
   Neither condition has been satisfied here.

No production Scene, module activation, Token, actor, Region script, puzzle
ledger, firewall, or bridge queue was modified.
