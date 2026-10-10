# M02 Tallcap Forest — Attempt #5 Feature Manifest & Spatial Blueprint Reconciliation v001

**Decision:** `NEEDS_RECONCILIATION`, **NO PAINTERLY RENDER YET**.  
**Policy:** accepted DiceBox geometry tolerance `dicebox-geometry-tolerance/v0.1`; strict Gridless `battlemap-120` target remains in force.  
**Chronology:** 2026-10-09, additive record after tolerance reassessment. Historical five grayscale attempts, previous attempt #5 REDO, and attempt #4 geometry are **not edited, deleted, or reused**.  
**Source image:** `grayscale_mushroom_cavern_map.png` (attempt #5) SHA-256 `878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf`; RGB 1536×1024, 3,984,274 bytes, generated as attempt `03d4569f-9f95-4a87-907f-651726cbed75`.

## Artifacts and source isolation

- `M02-ATTEMPT5-FEATURE-MANIFEST-CANDIDATE-v001.json` — **39** classified features, **22** new attempt-specific solid rock/trunk footprint groups, independent wall-source coordinates, route waypoints, glow/forage/hunting interaction candidates and uncertainty tags.
- `M02-ATTEMPT5-SPATIAL-BLUEPRINT-CANDIDATE-v001.json` — a **fresh** `spatialBlueprintSchema v0.1.0` compatible candidate, not copied from attempt #4: **193** provisional wall segments, **6** Regions, **6** anchors, one semantic default Level.
- `M02-ATTEMPT5-BLUEPRINT-RECONCILIATION-QA-RECEIPT-v001.json` — strict schema and Region enclosure results, raster-proxy sensitivity evidence, official geometry tolerance hold and outstanding proof gates.
- `M02_Attempt5_Blueprint_Review_v001.png` and `M02_Attempt5_Trace_QA_v001.py` are generated **review-only** QA artifacts held in the ChatGPT session. Both are tied to the exact above source image SHA. They are not replacements for the source grayscale and were not committed as repo binaries. The review overlay's SHA-256 is `a1d770e4502a405185efd1e890f01ccf62a37199bb00cf9564e43d45d`; Python QA's SHA-256 is `e00b0eda113d0ad3796391e697c6442a1abaa13f51ffabffb66df32bcfe04521`.

The source art's full-size native binary is not present in this M02 branch; before IMPLEMENT, content-addressed staging of the artwork must be completed and verified. Do not guess a GitHub art URL from its filename.

## Physical and authored coordinate contract

- PREPARE logical footprint **36×24 five-foot spaces** = 180×120ft.
- Source image **1536×1024 pixels**, giving **42.6667 source px per five feet**.
- Foundry target **4320×2880**, Gridless, 120px/5ft. Exact uniform affine scaling **(x, y) → (2.8125 x, 2.8125 y)**.
- **5ft** Medium-required passage means **42.6667 source pixels** full swept-token diameter. The raster-proxy test conservatively used **22.34px center distance** (21.333px radius + ~1px sample buffer). This is no substitute for certified floor/ground-wall boundaries and does not promise Large access.

### Ground blockers and decorative classifications

- The new draft traces actual visible **solid rock/cavern surfaces and grounded mushroom stalks**, not caps. Provisional groups: 22 individually named trunk/rock masses, with two high-cavern perimeter polylines (northern and southern). **193** individual lines are modelled as full-height wall candidates. Neither the previous 161-wall blueprint nor its region coordinates were imported.
- **Raised tallcap caps and their shadows:** overhead illustration, **no full collision wall**.
- **Fungal frills, fieldstones and minor rubble:** decorative; don't classify them as a full-height wall from their silhouette alone.
- **Stone milestone:** north shoulder, separate interaction Region; approved lore/DC/reward does **not** exist yet.
- **West arrival/east exit:** Region candidates, no guessed Foundry UUID or M03 teleport.
- **Foraging:** northern study area candidate only; Regionwright integration still requires exact module API evidence.
- **Hunting:** southern habitat is **manual Gamemaster initiated** only, not automatically triggered by entering Region.
- **Torch/bioluminescence:** candidates. Dynamic light source count, radius and positions have not been mechanically approved.
- No fishing, mining, or new skeletal lore/rewards introduced.

## QA results

| QA gate | Result | What it really establishes |
|---|---|---|
| Exact attempt #5 source SHA readback | **PASS** | Correct and independent grayscale used |
| Canonical `validateSpatialBlueprint` (`v0.1.0`) | **PASS** | 193 Walls, 6 Regions, 6 anchors, one Level; valid IDs, bounds and geometry shape fields |
| Region anchor **enclosure + clearances** | **PASS (draft footprints)** | Six anchor circles fit inside their provisional Regions; zero anchor centers inside the drafted solid groups |
| One uniform coordinate projection | **PASS** | x2.8125 conversion; exact target 4320×2880 |
| Raster-proxy Medium swept-radius at luminance 80 | **PASS (heuristic only)** | Main/north/south route candidates can be found within the brightness-based floor proxy |
| Raster-proxy Medium swept-radius at luminance 85 | **PASS (heuristic only)** | Main min estimated clear radius 22.36px; north 22.36px; south 22.47px (all source pixels) |
| Raster-proxy Medium swept-radius at luminance 90 | **NORTH FAIL** | Northern pixel-classified corridor disconnects from (894,173) to (988,115), though main and south continue passing |
| Raster-proxy Medium swept-radius at luminance 95 | **NORTH FAIL** | Northern candidate additionally disconnects from (423,282) to (510,162) |
| Human-confirmed solid-edge alignment ≤0.5ft | **NOT CERTIFIED** | Draft obstacle outlines represent interpreted structure; pixel-accurate ground boundaries still need independent checking |
| Official `assessRouteClearance` for each route | **NEEDS_RECONCILIATION** | Required width/uncertainty/swept ground-class evidence cannot truthfully be declared exact |
| Foundry token movement and Region behaviors | **NOT TESTED** | No scene writes or runtime canaries performed |

**Why luminance sensitivity matters:** Road/trail brightness is not synonymous with walkable ground (dark shadow can be traversable, mushroom cap can be bright and impassable underneath). A test that passes at a lenient luminance threshold but disconnects at a slightly stronger one is **not evidence the trail is physically impossible**. It also is **not enough to declare a certified 5ft continuous ground corridor**. Hence we refuse both an automatic new image REDO and an invented mechanical PASS.

### Intentional bottleneck audit

- The west/east cave-mouth road pinch points may visually narrow near source x≈0–70 and x≈1460–1536; their width, length and exact collision consequences remain **UNMEASURED**. Do not mark them approved intentional bottlenecks until grounded contours are traced and the GM/user approves the proposed encounter intent.
- Northern and southern side-trail narrow sections are allowed at 5ft for Medium, but remain candidates pending a measured, source-specific floor trace. This map is **not** advertised as uniformly Large-accessible.
- A visual estimate alone does not justify an automatic obstacle erase or a wall drift beyond ±0.5ft.

## Final decision

**Structural imagery is preserved. The fresh Feature Manifest and Spatial Blueprint are valid as DRAFTS, not final gameplay authority.** The structural/Blueprint gate is `NEEDS_RECONCILIATION` because the northern circuit fails threshold-stability checks and wall-ground alignment/continuous 5ft swept-floor proof remain uncertain. **PAINTERLY RENDER cannot begin yet.**

### Next bounded step: NORTH LOOP GROUND-BOUNDARY CONFIDENCE REVIEW

1. Re-examine source pixels for northern path segments `(894,173)→(988,115)` and `(423,282)→(510,162)`, identifying whether threshold disconnects are shadows/texture or real rock/trunk obstructions. Use an explicitly traced ground-surface polygon and note width uncertainty, not just brightness.
2. Independently compare the 22 solid group ground-footprint boundaries and cavern edge lines against the approved source. Achieve a documented 0.5ft alignment target on critical pinch points. Classify overhead caps separately.
3. Re-run the five-foot **swept disk** and Region accessibility checks on that reviewed floor, and call `assessRouteClearance` using evidence-backed width/uncertainty and true solid classification. Then require an accepted structural `PASS_WITH_DOCUMENTED_VARIANCE` and Blueprint lock before painterly work.
4. If a real impassable obstacle is established, revert to the prescribed independent grayscale REDO from PREPARE; never paraphrase old image prompts. If the ambiguity is merely pixel luminance, retain the source and reconcile its geometry.

**Foundry writes:** 0. **Image generations:** 0. **Prior M02 data overwritten:** 0.
