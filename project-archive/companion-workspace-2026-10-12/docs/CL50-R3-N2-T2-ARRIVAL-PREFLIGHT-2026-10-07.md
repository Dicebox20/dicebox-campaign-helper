# CL-50 R3 read-only landing and route-mouth footprint audit

**Work unit:** `central-lodge-cl50-r3-landing-readonly-v001`  
**Status:** `READONLY_DIAGNOSTIC_PASS`, one-square candidate geometry only; not installed, not player-tested.  
**Governance:** user-approved R3 bidirectional topology under `D-2026-10-07-CL50-FOUR-BIDIRECTIONAL-RAILWAY-PAIRS`. No new route authority, token movement, or gameplay change.

## Authoritative route endpoints

- **N2 Tunnel B:** Scene `4pc5akMBieHU7GvV`, Region `shIAThge7cNy0JjT`, stable ID `dbx:central-lodge:n2:region:n2-railway-tunnel-b`. Physical mouth rectangle x3890/y1160/w430/h760; currently no RegionBehavior.
- **T2 Mouth A:** Scene `ez9MSQ8QIO4cW6zo`, Region `3OGR0atcJokXJo6b`, stable ID `dbx:central-lodge:t2:region:mouth-a`. Physical mouth rectangle x0/y1030/w320/h560; currently no RegionBehavior; `destinationStableSceneId=null`, `bindingStatus=UNBOUND_DO_NOT_GUESS`.

## Simulated ephemeral landings

The purpose-built, no-write `work/foundry-playwright-harness/cl50-r3-arrival-footprint-readonly-v001.page.js` uses exact Foundry 14.367 `new RegionDocument(...,{parent:scene})` and `spawnTokens({create:false,placement:"center",snap:false})`. It tests *actual token rectangular bounds*, not only token-center membership.

| Arrival | Temporary rectangle x/y/w/h | Token | Simulated token top-left | Reverse mouth | Other Regions | Result |
|---|---|---|---|---|---|---|
| N2 Tunnel B | 3730/1360/140/360 | 1×1 | (3740,1480) | No footprint overlap | N2 Walkable Railway Margin Notice only | **Geometry PASS** |
| N2 Tunnel B | 3730/1360/140/360 | 2×2 | (3680,1420) | **Footprint overlaps** | N2 notice; passive platform lighting; **N2 Grotto Station Interpretation** | **NOT SAFE** |
| T2 Mouth A | 440/1090/360/360 | 1×1 | (560,1210) | No overlap | None | **Geometry PASS** |
| T2 Mouth A | 440/1090/360/360 | 2×2 | (500,1150) | No overlap | None | **Geometry PASS** |

All four ephemeral tokens were **non-persisted**; zero occupied destinations and zero sampled straight-line move-wall intersections were found. Both Scenes had zero real Tokens at the inspected checkpoint. These observations do **not** prove full pathfinding, door state, vision, player rendering, or no-bounce behavior after handlers are installed.

**Important distinction:** For the N2 2×2 case, center-based `testInsideRegion` returned false although the full token rectangle overlapped the return-mouth rectangle and story Region. This independently corroborates the R2 diagnosis. A center-only teleport-placement check is inadequate here.

## Rules and remaining dependencies

- R3 would initially be restricted to **1×1 token footprints**, with a clear manual-GM fallback for larger tokens.
- The existing N2 margin notice must remain untouched. Do not suppress notices or inject observation/state writes to make a route pass.
- User approval resolves route **orientation**, but does not approve a live transport installer, arrival coordinates, automatic reciprocal activation, or player acceptance.
- Any future implementation requires a distinct accepted source and no-bounce/consent/cooldown design, exact version/stable ID/hash and ledger guards, single guarded APPLY, independently reread behavior, and normal GM/player canary.
- **R1 installer generation remains safety-blocked**. Do not use R3 work to recreate, bypass, or replay that blocked action through another transport.
- N3-to-T3 branch unlock, other unapproved mouths, CL-51 light triggers, CL-52 audio and CL-93 final effects remain outside this work unit.

## Continuation transport constraint

This work follows inbound Foreman correlation `foreman-15b14be4-5a64-4be6-bb57-419084449d0d`. Bridge status lists it host-accepted but the receipt reconciliation returned `deliveryVerified=false` at start of work. The exact staged receipt was **not consumed** and **no new Foreman boundary** was reserved. Reconcile positively before subsequent native dispatch; do not manufacture a receipt or resend.

**Next safe route work:** R4 T2 Mouth B ↔ N3 West no-write geometry and side-effect inspection, or independently resolve the existing Foreman receipt before another continuation boundary.
