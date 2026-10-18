# Kurth Tower Reception M02 — Calibrated unified geometry v7

**Status:** `GEOMETRY_INSPECT_LOCAL_PASS_WITH_RUNTIME_BLOCKERS` — user review required before grayscale.  
**Reconciled blueprint identity (canonical sorted JSON SHA256):** `f3bdcfb3c8ed73648e1a7f98c59e09e94c19a5b76ad208f88b35716f382b3add`.  
**Scope:** approved v6 geometry refined using *accepted M01 implementation intent* and visual registration evidence. **No Foundry writes, no creative grayscale render.**

## Exact source and precedence

1. User-approved v6 M02 blueprint: `f822725e697e39a07241f6ff8219a6a4321cab7a84b32766774fce0a83e66fd6` in Library → DiceBox Campaign Helper → Heist M02 Geometry → Integrated v6.
2. **Original M01 accepted semantic blueprint:** `handoffs/2026-10-16-dark-arch-scene-injector-v2-1-beta/spatial-blueprint-render-reconciled.json`, GitHub review branch blob `64162fde8842fee029a5a2183d0679c9c5453f15`, model identity `6386442ea0e241d0f58581d66146e9177d54ebe86497b83636fffa7d12f117ab`.
3. **Later M01 implementation intent:** `DiceBox-Dark-Arch-M01-Painterly-Injector-V2.1-Beta-PREVIEW-FIX.md`, local exact macro SHA256 as recorded under `sourceReconciliation.M01LaterDeploymentMacroSha256` in `spatial-blueprint.json`. This artifact's `WALL_SPEC` includes the reviewed gate location and **does not build a seawall across the skiff route**.
4. **Visual alignment evidence:** accepted M01 painterly image (`paint-render-2026-10-16/painterly-candidate.png`) and user-provided bridge composite (`user-composite-source.png` from integrated v6). Screenshots supply **registration evidence, not native wall authority**.

## What changed since approved v6

### Single scale-correct M01-to-M02 scene

Image matching gave **526 RANSAC inliers**, a **0.290 px median residual** (native M01 artwork coordinates), and original-art horizontal crop start **x=815.203 px of 1619**. Maintaining 120px-per-five-feet and native artwork aspect means the M01 right-hand slice occupies **19.859 logical cells** of the new 40×24 M02 map, not the v6 preview's **18.45** cells. The join is an artwork provenance boundary, **not a wall, new Scene edge, or portal**. The tower's new west wall moves from x28.65 to **x29.392**, and newly authored rooms/doors/props are proportionally fitted into the remaining right-hand viewport. The original M01 portion is rendered from the approved art itself in the technical preview, not from a lower-resolution Foundry screenshot.

### Inherited M01 blocking geometry

- **9 clipped solid Wall segments** + **1 gate plane**, reproduced from the *later M01 macro's* authored `WALL_SPEC`, with exact origin/source key preserved and runtime ownership explicitly `inherited`.
- The earlier M01 semantic blueprint puts the gate at x29.4; the later macro puts it at **x29.88**. This is an accepted local source divergence; v7 uses the later macro for proposed overlay alignment. **Neither is a substitute for authoritative reread of installed Foundry Walls**.
- The earlier M01 model contained a seawall beyond the island dock; the later macro intentionally excludes it so the **skiff/water opening remains usable**. V7 does **not** reintroduce the obsolete blocking seawall.
- The selected source retains the original hoist/rope bypass and boat/dock as GM-adjudicated, not walkable-water or automatically simulated transfers.

### Upper and lower stairs/elevations

Values are **from the M01 typed geometry**, not guessed from artwork:

| Structure | Source identifier | Start | Destination | Delta | Verification level |
|---|---|---:|---:|---:|---|
| Upper terrace → island inner court | `V03` / `G12` | +31 ft | +18 ft | −13 ft | Accepted M01 source elevation intent; native levels/treads not verified |
| Lower dock → island inner court | `V02` / `G10` | −8 ft | +18 ft | +26 ft | Accepted M01 source elevation intent; native levels/treads not verified |

The inherited bridge and inner courtyard are at **+18 ft** on that same datum. To avoid inventing an 18-ft drop across the new art seam, v7 explicitly gives the M02 outdoor path and connected first-floor entrance **+18 ft** as an **authored continuity inference**. No extra external staircase is assumed. Exact treads, railing topology, Levels runtime data and arrival token landing remain outstanding.

### Architecture preserved

Continuous user-approved dark roof/corner across the source art join; distinct exterior courtyard, rock-and-water path; one **15-ft exterior front entrance** low on the west wall; reception/registry/staff interior to the right, clipped at top, bottom and right; no rear entrance. Three routes: Large 10-ft public, Medium 5-ft inspector, Medium 5-ft staff. During the independent inspect a small public-route clearance conflict with the receiving desk was corrected by a **half-foot westward waypoint shift**, then retested. No door, prop or building wall was moved in that correction.

## Independent final GEOMETRY INSPECT

`inspect_geometry_independent.py` reads the emitted blueprint and registration receipt independently of the author script. **28 checks PASS, 0 FAIL**:

- Exact 40×24 gridless geometry, pixels 4800×2880 at 120px/5ft, user-approved scene linkage and art registration.
- M01 inherited macro-provenance gate, wall count, intentional water opening, no wall at the artwork join, roof continuity, and single exterior entrance.
- Explicit +18ft first-floor datum, +31ft terrace and −8ft dock, both source-authored stair transitions.
- **Public 10ft / Inspector 5ft / Staff 5ft** swept-token clearances: all 0 intersection area with authored solid Walls, props and hazards; each route crosses the single exterior door and its respective secure-side checkpoint.
- Main approach from the M01 bridge through the **open** inherited gate reaches the M02 courtyard with a **10-ft token** in the local geometry model.
- Closing the only tower entrance blocks exterior→interior. Closing all three internal security gates separates secured and public rooms; opening any one reconnects them.
- No NPCs, Foundry documents, RegionBehavior, active teleport, image-based wall inference or world modification.

Full evidence: `FINAL-GEOMETRY-INSPECTION.json` and `REGISTRATION-RECEIPT.json`. Note that mathematical local clearance checks do not certify native Foundry wall states, elevations, Regions, or installed asset identity.

## Open authority / next gate

**Creative geometry can proceed to grayscale after user review of the v7 plan**, while the following runtime-sensitive items stay blocked until Foundry installation staging: authoritative actual M01 Wall/door/Region and loaded image reread, live stair/Levels/collision and upper/lower landing inspection, exact transition UUIDs and ownership, runtime before/after document snapshots, and final art inspection. The two original M01 stair treads remain unverified: only source-authored elevations are known. The active product-stage checker still has a retired O-112 blocker, so do not promote product stage or declare Ready-to-Play.

**Workflow:** after geometry review → EMBOSSED STRUCTURAL GRAYSCALE RENDER → STRUCTURAL INSPECT → FEATURE MANIFEST → OFFLINE STRUCTURAL BUILD → PAINTERLY RENDER → FINAL INSPECT → FINAL INJECTION ASSEMBLY → STAGE → INJECT → VERIFY → RECEIPT.

## Files

`reconcile_geometry.py` (deterministic source registration and authoring), `inspect_geometry_independent.py`, `spatial-blueprint.json`, `M01-SOURCE-EXTRACT.json`, `REGISTRATION-RECEIPT.json`, `FINAL-GEOMETRY-INSPECTION.json`, `M02-calibrated-geometry-preview.png` (technical, never final art).
