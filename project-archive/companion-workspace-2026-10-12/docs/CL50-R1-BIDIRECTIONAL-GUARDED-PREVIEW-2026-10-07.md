# CL-50 R1: N1 East ↔ T1 Mouth A guarded source/landing PREVIEW

**Work unit:** `central-lodge-cl50-r1-staging-v001`
**Scope:** one approved bidirectional route pair R1, no other routes.
**Evidence:** `LOCAL_STAGE_PASS` plus live `READONLY_PREVIEW_PASS`. **Not live installed**; not gameplay-certified.

## Approved origins and named destinations
- From **N1 East** Scene `MAbLfBqG7qIVVuLN`, Region `xsitdXO94BHJkYKX`, stable `dbx:central-lodge:n1:region:n1-rail-tunnel-east` → **T1 Mouth A** Scene `ImeIdHbYb6kZKAdt`, Region `ewIAYppRLvgIV1b7`, stable `dbx:central-lodge:t1:region:mouth-a`.
- Reverse from **T1 Mouth A** to **N1 East** uses the same exact IDs. This is R1 only; T1 Mouth B / N2 remains unbound until R2 is separately approved for APPLY.
- Approved user decision `D-2026-10-07-CL50-FOUR-BIDIRECTIONAL-RAILWAY-PAIRS` and campaign roadmap hold route authority. Before APPLY, current live `flags.world.dicebox` source binding fields are unbound and T1 scene route terminalA/B remain null, as expected.

## Staged behavior sources and target flags
| Source | Frozen SHA-256 | Intended behavior stableId | Source Region bindingStatus |
|---|---|---|---|
| `cl50-r1-n1-to-t1-source-v001.txt` | `0d804443760c05410678b6e1a6149da0a214758a43e8efe4ef3144b6056d2fd7` | `dbx:central-lodge:n1:behavior:r1-n1-east-to-t1-a` | `BOUND_CL50_R1_N1_TO_T1` |
| `cl50-r1-t1-to-n1-source-v001.txt` | `a03569e8b8bfcc2c1b3fedc969e84b10a30b1186c680f9fa9aad46623a34124b` | `dbx:central-lodge:t1:behavior:r1-t1-a-to-n1-east` | `BOUND_CL50_R1_T1_TO_N1` |

All staged source files are under `work/foundry-playwright-harness/`. `cl50-r1-build-staged-sources-v001.cjs` creates both, plus `cl50-r1-staged-sources-v001.manifest.json`; `cl50-r1-static-validate-v001.cjs` tested **38/38 static checks PASS**, including exact SHA, Node syntax and forbidden-write call guard.

## Non-persistent arrival Region technique
The Foundry 14.367 `RegionDocument.teleportToken()` supports non-persisted `RegionDocument` targets; exact official API signature and installed runtime implementation independently inspected. A destination Region exists only in GM memory for this teleport; no extra permanent Region is created.
- T1 arrival ephemeral rectangle: x430, y1240, width380, height400, **one-square Token top-left (560,1380)**.
- N1 arrival ephemeral rectangle: x3722, y1310, width136, height320, **one-square Token top-left (3730,1410)**.
- Both simulated 1x1 arrivals are outside reverse source-mouth activation and currently unoccupied; N1 arrival intersects only the **N1 Walkable Railway Notice** Region. It does **not** intersect the N1 Three-Proof Station Power gate. This avoids premature power-state changes.
- Two-square ephemeral probes also returned positions, but their N1 physical footprint could intrude on the power-gate zone. Therefore stage v001 **explicitly declines automatic larger-than-1x1 token movement** and refers the GM to normal Scene navigation.
- New handlers require active GM election, explicit consent dialog, source/destination Scene and Region stable ID checks, 20-second post-action cooldown, decline cooldown, destination occupancy check, and preflight `spawnTokens({create:false})`; ambiguous transfer outcomes warn GM and never auto-retry.
- Any N1 notice on legitimate arrival may still fire; intentional discovery logic preserved, not suppressed.

## Preview and corrected QA
Read-only live `cl50-r1-guarded-preview-v001.page.js` finished **PASS_STAGED_FOR_GUARDED_APPLY** with zero errors, exact target Scenes and stable IDs, both Regions initially with zero RegionBehaviors, ledger revision 1, 134 world Macros, canonical 21 Scenes / 202 Regions / 116 behaviors.
An initial version of the preview **incorrectly counted all 183 world Scenes** and 510 Regions instead of the 21 canonical campaign Scenes. It stopped before any write. The verifier was corrected to use the frozen canonical Scene-ID roster from CL90; second run passed. This is a **test-tool scope defect**, not world data drift or reason to adjust the world.

## Before live APPLY
1. Fix the source/installer/final-verifier expected hashes and exact IDs; no staging script re-generation after acceptance without new hashes and a fresh PREVIEW.
2. Add the two `executeScript` RegionBehaviors and source Region `destinationStableSceneId` / `bindingStatus` flags in one bounded, rollback-capable APPLY; update T1 Scene route metadata terminalA=N1 and `orientationStatus=PARTIALLY_BOUND_CL50_R1`, while preserving null terminalB and candidates.
3. Guard 21/202/116/33/134, ledger revision 1, kernel SHA and existing installed travel/audio receipts. Independent FINAL VERIFY expects 21/202/**118**/33/134; ledger revision 1, one behavior at each R1 mouth, nothing altered elsewhere.
4. Real player/GM directional and return canary required before claiming gameplay completion. If no player, record installed/source-verified only. Do not trigger either handler as a test against a live user without a separate canary window.
5. Failure or timeout is OUTCOME_UNKNOWN; reread exact Regions/behaviors and rollback references before any retry. Never blanket-delete Regions or rerun old installers.

**Out of scope:** R2–R4, N3→T3 branch unlock, night lighting, CL52 horror audio, gameplay flags, Actor/Item updates and unrelated foreign scenes.
