# CL-50 R2: T1 Mouth B ↔ N2 Tunnel A, non-persistent landing diagnostics

**Work unit:** `central-lodge-cl50-r2-landing-readonly-v001`  
**Evidence:** `READONLY_DIAGNOSTIC_PASS`, **not installed or gameplay certified**.  
**Authority:** user-locked R2 topology in `D-2026-10-07-CL50-FOUR-BIDIRECTIONAL-RAILWAY-PAIRS`, exact world Foundry 14.367 / dnd5e 5.3.3.

## Exact approved route
- **T1 Mouth B:** Scene `ImeIdHbYb6kZKAdt`, Region `91XmuJ9LGbsJY52W`, stable ID `dbx:central-lodge:t1:region:mouth-b`.
- **N2 Tunnel A:** Scene `4pc5akMBieHU7GvV`, Region `lYps0Z5806d0W8wX`, stable ID `dbx:central-lodge:n2:region:n2-railway-tunnel-a`.
- Bidirectional *topology* is approved. Both RegionBehavior sets were empty at preflight. The live destination flag at T1 Mouth B remains `UNBOUND_DO_NOT_GUESS`; N2 has no destination. No runtime update was performed.

## Ephemeral one-square landing probes
The dedicated read-only browser routine `work/foundry-playwright-harness/cl50-r2-readonly-arrival-diagnostics-v001.page.js` used Foundry's non-persistent `RegionDocument.spawnTokens({create:false})` for token footprints. The ephemeral tokens did not persist and no new Region was created.

| Arrival | Temporary placement rectangle (x/y/w/h) | 1×1 token top-left | Reverse-mouth overlap | Other active Region overlap |
|---|---|---|---|---|
| N2 Tunnel A | 450/1380/110/320 | (445,1480) | **none** | **N2 Walkable Railway Margin Notice** only |
| T1 Mouth B | 3600/1240/300/400 | (3690,1380) | **none** | none |

Both one-square footprints were unoccupied, stayed beyond the destination Region's source mouth, and had no sampled blocking straight-line Wall crossing. **This is not navigability or player interaction certification.**

## Two-square findings and strict behavior rule
- On N2 Tunnel A, the two-square proposed footprint (385,1420 to 625,1660) **overlaps the reverse tunnel mouth and the N2 Grotto Station Interpretation observation Region**. The point-centered `testInsideRegion` check alone returned false at the mouth; the full rectangle overlap check correctly caught the collision.
- On T1 Mouth B, the two-square footprint (3630,1320 to 3870,1560) had no equivalent sampled mouth or Region collision.
- **Do not treat R2 as safe for 2×2 tokens.** Initial staged behavior should fail closed for anything except 1×1 and offer manual GM scene-navigation; do not suppress the established N2 notice or observation behavior.
- Prior route R1 staging already blocks >1×1. Travel consent, cooldown, reentry suppression, transfer authority, actual body/Walls collisions and player canary remain independent requirements.

## Verification and next work
- Existing official read-only database verifier: `integrity=ok`, campaign gate `CL-50`, 21 Scenes / 202 Regions / 116 behaviors / 33 Items.
- Target N2 Scene Region count 9 and T1 count 6; both terminal Scenes contained zero Tokens during inspection.
- The Foundry geometry diagnostic returned zero errors; existing CL90 runtime snapshot and macro source invariants require repeat verification at any future APPLY.
- Next bounded action: independently inspect R3 (N2 Tunnel B ↔ T2 Mouth A) in read-only mode or continue non-blocked planning. R1 installer generation was separately safety-blocked and must not be bypassed by adapting R2 source into an installer. All live routes remain unmodified here.

**Pending:** real GM/player traversal, Wall polygon/path verification beyond straight-line samples, source staging and guarded binding in an explicitly supported implementation pathway.
