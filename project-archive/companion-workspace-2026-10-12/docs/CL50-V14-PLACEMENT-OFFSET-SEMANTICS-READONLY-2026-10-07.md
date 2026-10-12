# CL-50 Foundry v14.367 placement/offset semantics, read-only

**Work unit:** `central-lodge-cl50-v14-placement-offset-readonly-v001`  
**Evidence:** exact live runtime readback with ephemeral Region and Token Documents, official Foundry v14 API documentation, no live gameplay mutation.  
**Location:** `work/foundry-playwright-harness/cl50-placement-options-readonly-v001.page.js`

## Exact scope
- Foundry v14.367, D&D5e v5.3.3, `the-lost-mine-of-phandalin`.
- Approved destination candidate: T2 Mouth B, Scene `ez9MSQ8QIO4cW6zo`, Region `OOmnx3XAmw95E410`, stable `dbx:central-lodge:t2:region:mouth-b`.
- Non-persisted temporary Region at x3560/y1230/w300/h360; 1x1 Token, x0/y0 source data, grid 120px.
- All invocations used `RegionDocument.spawnTokens(...,{create:false,snap:false,avoidOccupied:false})` with the placement mode stated below. Tests ran twice each. No Tokens or Regions persisted; target had zero existing Tokens and zero new route behaviors.

| Option | First position | Second position | Observation |
|---|---|---|---|
| `placement:"center"`, no offset | (3650,1350) | (3650,1350) | Deterministic for this fixture, no concurrent occupancy |
| `placement:"center",offset:{x:120,y:0}` | (3650,1350) | (3650,1350) | Offset did **not** change center result |
| `placement:"center",offset:{x:-120,y:0}` | (3650,1350) | (3650,1350) | Offset did **not** change center result |
| `placement:"relative"`, no offset | throws | throws | `Relative placement requires an offset` |
| `placement:"relative",offset:{x:120,y:0}` | (3604,1452) | (3690,1232) | Same fixture/arguments, **different position** |
| `placement:"random"`, no offset | (3579,1308) | (3774,1293) | Random as expected |

All successful examples remained outside the T2 Mouth B reverse-trigger Region by center check, but no attempt was made to certify movement permissions or replay behavior. The `center` result alone is **not** a documented hard guarantee that a later teleport under changed live state will commit the exact same whole-token-safe coordinates.

## Mechanism and evidence limits
- Exact live `RegionDocument.spawnTokens` implementation invokes private `#getTokenDestinations(...)` then, for `create:false`, returns ephemeral `TokenDocument` instances without persistence. It requires Token ownership plus `TOKEN_CREATE` permission.
- Exact live `RegionDocument.teleportTokens` independently calls `#getTokenDestinations` again, builds create/delete operations across scenes, invokes `foundry.documents.modifyBatch(operations)`, then resolves deleted→created Token references. Cross-Scene transfer requires Token ownership plus `TOKEN_CREATE` and `TOKEN_DELETE`.
- Foundry v14 API docs describe `offset` as a **relative offset** and `avoidOccupied` as avoidance for **random placement with snapping**; no fixed arbitrary absolute destination contract was found in this API.
- Foundry v14 `modifyBatch` docs promise a sequential set of operations without intervening network delay and cancellation/exception of entire batch. They do **not** establish server-enforced whole-token collision, Wall/path clearance, player consent, or a cross-client executor lease. Batched operations cannot consume results from earlier operations inside the same batch.
- Runtime sample results demonstrate that **neither a general offset assumption nor an earlier `spawnTokens(create:false)` coordinate is enough to prove an identical later teleport destination**. Current frozen R1 v001 source must remain NOT live-promotable.

## Future contract and safe next step
1. Research a **separately reviewed fixed-coordinate create/delete batch transaction** design or bounded GM manual transfer as fallback; do not assume such a design is ready or permitted to install. It must use exact destination token top-left coordinates and validate whole-body, Walls/door, current occupancy and all unauthorized story Regions before any write.
2. Prove authoritative GM/executor lease, Player ownership, explicit consent, collision/race behavior, no-bounce and outcome-unknown reread, and primary-GM/non-GM client delivery. A synthetic fixture or API documentation alone does not certify gameplay.
3. Preserve R1 installer tool safety refusal, separate previously blocked DB verifier, all existing RegionBehaviors/foreign state and ledger revision 1. No alternate transporter retry. CL-93 remains final campaign roadmap phase.
4. Current Foreman native partner request `bridge_communicate` was blocked in the preceding checkpoint; no retry was attempted as part of this research and no automatic next-turn delivery should be claimed.

**Official references:**  
https://foundryvtt.com/api/classes/foundry.documents.RegionDocument.html  
https://foundryvtt.com/api/v14/functions/foundry.documents.modifyBatch.html  
https://foundryvtt.com/api/v14/modules/foundry.documents.html
