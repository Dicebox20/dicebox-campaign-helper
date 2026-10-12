# CL-50 R4 T2 Mouth B ↔ N3 West: non-persistent arrival and overlap preflight

**Work unit:** `central-lodge-cl50-r4-landing-readonly-v001`  
**Status:** `READONLY_DIAGNOSTIC_PASS`; landing geometry evidence only. Neither route handler installed nor gameplay-tested.  
**Source:** User-approved R4 topology under canonical decision `D-2026-10-07-CL50-FOUR-BIDIRECTIONAL-RAILWAY-PAIRS`, validated against the exact live Foundry world.

## Route endpoints

| Endpoint | Scene ID | Region ID | Stable ID | Source mouth |
|---|---|---|---|---|
| T2 Mouth B | `ez9MSQ8QIO4cW6zo` | `OOmnx3XAmw95E410` | `dbx:central-lodge:t2:region:mouth-b` | x4000, y1070, w320, h610 |
| N3 West | `pHQvDUDlyWZFuNrX` | `foYsFHsLXtCbfiyR` | `dbx:central-lodge:n3:region:n3-main-railway-west` | x0, y1110, w470, h720 |

Both Regions had zero RegionBehaviors at readback. T2 Mouth B retained unbound destination flags. The approved mapping is topology authority, not installation or coordinate approval.

## Ephemeral landing geometry

No-write source: `work/foundry-playwright-harness/cl50-r4-arrival-footprint-readonly-v001.page.js`. Simulated token documents were made with `RegionDocument.spawnTokens({create:false,placement:"center",snap:false})`; no token or Region was persisted.

| Destination | Temporary rectangle x/y/w/h | Token size | Token top-left | Mouth collision | Other Region overlaps |
|---|---|---|---|---|---|
| T2 Mouth B | 3560/1230/300/360 | 1×1 | (3650,1350) | None | None |
| T2 Mouth B | 3560/1230/300/360 | 2×2 | (3590,1290) | None | None |
| N3 West | 670/1300/260/380 | 1×1 | (740,1430) | None | N3 Walkable Railway Notice; passive Depot Lighting |
| N3 West | 670/1300/260/380 | 2×2 | (680,1370) | None | N3 Walkable Railway Notice; passive Depot Lighting |

All four trial rectangles stayed in Scene bounds, with zero token occupancy and zero sampled straight-line blocking-wall intersections. Two-square arrival *geometry* at R4 passed on both ends, unlike narrower R2/R3 station corridors. This does not mean large tokens are cleared for the entire interconnected railway: R1/R2/R3 still lack safe two-square reciprocal arrivals.

The existing N3 railway notice behavior `8bWw5K81DTz5wyv6` may legitimately announce arrival, and is not to be suppressed. N3’s story/puzzle Regions and T3 southern branch travel remain untouched. The N3 depot-lighting Region is passive in this readback and is not authorized to be activated by this audit.

## Required next gates

1. Resolve the prior R1 guarded-installer generation safety block through an independently permitted, reviewed implementation route, **not** a retry or alternate transport bypass.
2. Coordinate all four route proposals in a versioned consent/cooldown/no-bounce design with full token-footprint constraints. Stop or provide manual-GM fallback when reciprocal corridors cannot safely accept a character size.
3. Future live work requires fresh exact Scene/Region stable IDs, kernel and ledger checks, guarded no-write PREVIEW, a narrow rollback-capable APPLY, independent FINAL VERIFY, and GM plus real-player canaries.
4. Full wall polygon/navmesh, dynamic doors, light occlusion, and player-client arrival behavior were not checked by straight-line geometry.
5. Existing T3↔N3 southern branch, E1→M1 and T3→F1 authoritative travel must remain unmodified.

## Foreman continuation disposition

The prior Bridge correlation `foreman-15b14be4-5a64-4be6-bb57-419084449d0d` was verified native-delivered on turn `2b579270-ac1d-4225-bd82-c3f10029fb45`, but the receipt `msg-3e9f935d-f4ec-473c-b509-2721b17407e2` remained **unconsumed** due to missing receiver host context in `bridge_foreman_reconcile(consume:true)`. No new Foreman boundary or dispatch was made for this work unit.

**Exit:** R1–R4 candidate geometry analyses complete; implementation and gameplay certification pending. Next bounded safe work is cross-route consolidated constraints and source-only verification, or restoring validated Bridge receiver context.
