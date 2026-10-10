# DiceBox Geometry Tolerance Standard — v0.1 (2026-10-09)

**Status:** USER-ACCEPTED / LOCKED (2026-10-09).  
**Accepted proposal provenance:** `docs/proposals/DICEBOX-GEOMETRY-TOLERANCE-STANDARD-PROPOSAL-v0.1-2026-10-09.md`, GitHub draft PR #9, explicit approval in DiceBox project chat 2026-10-09.  
**Scope:** DiceBox Campaign Helper image PREPARE, structural grayscale INSPECT, Feature Manifest/Spatial Blueprint, wall/Region intent, Injector 2.0 preflight, future desktop image scene workflows, and Foundry runtime verification.  
**Scale:** **UNCHANGED.** Gridless `battlemap-120`, 120 target Scene pixels per 5ft cell; original artwork native raster/physical footprint/scene dimensions remain independently locked. No token Scale Ratio correction.  
**Related authorities:** Root `AGENTS.md`, canonical semantic render workflow, `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md`, and the permanent clean-restart image prompt policy.

## Principle and boundary

**Strict about actual gameplay functionality, tolerant of natural-looking geometry.** A preferred artistic route width is NOT a mandatory minimum walkable width. Do not make multiple grayscale attempts solely because the visible bright road paint is narrower than a target. Inspect the **walkable surface**, physically solid obstacles, approved route purpose, intended creature footprint, and continuous movement path. A theoretical collision-free centerline across a cliff, solid mushroom stalk or inaccessible terrain is not a valid route.

This is a DiceBox design policy, **not a claimed universal D&D5e or Foundry rule**. Foundry v14 Scene grid and D&D5e actor-owned token footprints are authoritative for their respective runtime fields. The pure compiler checks do not claim Foundry movement passed.

## 1. Preferred route bands and hard creature-clearance rules

| Route | Target | Aesthetic preference | Hard mechanical rule |
|---|---:|---|---|
| Main west–east road | **15ft** | Usually **10–20ft** | At least one continuous route for the approved required token footprint; generally Medium **5ft** |
| Side forest trail | **10ft** | Usually **5–15ft** | Continuous required Medium **5ft** route; 5ft single-file paths allowed |
| Explicit Large-access route | Per PREPARE | Typically 10ft or wider | **10ft usable footprint** along every required segment; no 5ft shortcut |
| Explicit Huge-access route | Per PREPARE | Typically 15ft or wider | **15ft usable footprint** where required |
| Other token size or bespoke passage | Per PREPARE/actor | Contextual | Use actual declared actor/encounter footprint |

These bands **do not impose hard maximum widths**. Clearings, intersections and open chambers may be wider. Full route length/width averages never compensate for a genuinely impassable narrow segment.

### Intentional bottlenecks

Main roads can locally narrow to **5–<10ft** for intended Medium passage if the narrower section is explicitly tagged as an authored bottleneck with location, approximate length, reason and mechanical effect. The typical **≤10ft travel length and roughly ≤2 bottlenecks/scene** is a review heuristic, **not an automatic failure limit**. Longer or unusual bottlenecks require an explicit note and appropriate creature/encounter choice.

Do not presume Large/Huge tokens fit narrower gaps merely because a tabletop squeezing rule could conceivably apply. A squeezing encounter must be separately authored, user-approved, and verified in actual Foundry movement/Region mechanics.

## 2. Wall placement and semantic classes

Use the accepted **ground footprint**, not shadows or elevated mushroom cap rims, as the baseline for collision. Keep solid cliff/rock/stalk Walls, movement-only barriers, decorative edges, and overhead visuals distinct. All measured errors and confidence must refer to the source art/approved blueprint.

| Boundary deviation | Geometric disposition |
|---|---|
| **≤0.5ft** (~12px at battlemap-120) | PASS candidate if mechanics/sight correct |
| **>0.5 to ≤1ft** (~12–24px) | REVIEW and reconcile trace |
| **>1ft** (>24px) | BLOCK Blueprint lock until corrected |
| **ANY functional collision, incorrect opening, vision leak, unsafe teleport landing, falsely walled canopy** | BLOCK regardless of numeric tolerance |

Measure boundary uncertainty. If the raster is too ambiguous to localize a solid ground feature, **hold for semantic review**; do not invent precision or automatically order a fresh image. Exact pixel↔feet mapping and scene scale are never loosened by tolerance.

## 3. Geometry measurement uncertainty

For an observed minimum width `w` and positive estimated measurement uncertainty `u`, evaluate `[max(0, w − u), w + u]`:
- Entire interval above the **mechanical required token footprint** and accessible continuous ground verified → functional PASS candidate (possibly with documented width variance).
- Interval crosses the mechanical minimum → `NEEDS_RECONCILIATION`, not automatic image REDO.
- Entire interval below the mechanical minimum → `REDO_REQUIRED` **if structural terrain truly lacks a route**. If the limitation is only an incorrect draft Wall or centerline, reconcile geometry instead of regenerating art.
- Preferred width bands affect **aesthetic variance notes**. Falling outside the preference is not itself a structural failure.
- Unknown walkable ground, unsure obstacle class, or low-confidence apparent route → `NEEDS_RECONCILIATION`.

Never authorize walls/Regions from a pixel-width estimate alone. Trace and independently verify a continuously walkable route in the approved raster; run swept-token shape tests in the Blueprint, then real Foundry movement/sight/arrival canaries after installation.

## 4. Inspector decision and compatibility

Maintain the accepted outer workflow `PREPARE → RENDER → INSPECT(PASS = APPROVED | REDO) → BUILD` with structural grayscale and painterly subpasses. The new values below are **internal evidence grades**, not independent durable workflow states:

- **`PASS`:** route/mechanics meet required size, surface connectivity, semantics, and stage-appropriate evidence.
- **`PASS_WITH_DOCUMENTED_VARIANCE`:** same, but width falls outside the preferred aesthetic band or an intentional Medium-accessible bottleneck is tagged. This may count as structural PASS.
- **`NEEDS_RECONCILIATION`:** visual ambiguity, measurement uncertainty, provisional obstacle footprints, missing route proof, incomplete phase-appropriate sweep/canary. Hold within structural/Blueprint stage; do NOT automatically start another image generation.
- **`REDO_REQUIRED`:** confirmed actual structural impossibility: required passable route missing, blocking canyon, absent access, or fatal topology impossible to reconcile. Structural REDO obeys the **permanent completely fresh independent prompt** rule. If implementation-only, correct Blueprint/runtime state, not image.

Only the FINAL_INSPECT of the *painterly image* automatically approves the final artwork under the accepted workflow. Pure geometry tests are preview-only and are NOT player acceptance.

## 5. Stage-by-stage requirements

1. **PREPARE:** Define each route's target, preferred band, hard footprint, required actor sizes, expected broad clearings and documented narrow chokepoints. The 36×24/120px scene scale remains exact when used.
2. **STRUCTURAL_RENDER:** Compose from accepted PREPARE. Treat preferred aesthetic bands as goals; avoid pretending painterly or grayscale road color must occupy the entire walkable surface.
3. **STRUCTURAL_INSPECT:** Record measured width and uncertainty, exact image identity, access topology, obstacle ground-vs-overhead class, physical route continuity and documented bottlenecks; grade under the categories above.
4. **FEATURE_MANIFEST + SPATIAL_BLUEPRINT:** Resolve any uncertainty; trace ground solids, Region anchors, and continuous routes; require swept-footprint movement clearance with required creature sizes; block if a proxy line traverses a cliff or rock rather than true floor.
5. **PAINT_RENDER + FINAL_INSPECT:** Preserve topology, accessible passes, and class boundaries; painted style may not produce false solid obstacles. RETRY = entirely independent fresh prompt from accepted stage canon.
6. **BUILD / STAGE / INJECT:** Keep **one Markdown artifact/one injection macro**, stable semantic keys and preserve GM edits; carry route policy metadata, Stage QA receipt and non-destructive geometry evidence.
7. **VERIFY / RECEIPT:** Assert actual Foundry token movement and vision, arrival Region safety, and native/module interaction. A no-write calculator is not a player canary.

## 6. Pure compiler evidence and desktop display

- `packages/dicebox-compiler/src/geometry-tolerance.ts`: `assessRouteClearance`, `assessWallAlignment`, `DICEBOX_ROUTE_PROFILES`, `DICEBOX_GEOMETRY_TOLERANCE_PROFILE`.
- Tests: `tests/geometry-tolerance.test.ts` plus canonical existing BUILD validator regression checks.
- The desktop Map Lab displays the accepted policy but still marks runtime footprint verification as **not modeled**. Its separate first-generation preview is a legacy 64px 1536×1024 fixture and does NOT override accepted `battlemap-120` for new builds.
- Runtime collision and provider/Foundry integration need separate certification; preflight `PASS` is **not** equivalent to installed/played success.

## 7. Historical M02 replay, without editing history

Attempt #5 originally received `STRUCTURAL_INSPECT: REDO` on the old rigid minimum interpretation. Keep the **original REDO receipt unmodified**. After this rule is accepted and implemented, write a new dated `M02-ATTEMPT5-GEOMETRY-TOLERANCE-REINSPECT-2026-10-09.md` against the exact same image hash. The 80–110px bright-road range corresponds to roughly 9.4–12.9ft at 36×24 logical cells. This is compatible with an approximately 10–20ft preference and Medium 5ft functional clearance but **not definitive visual/Blueprint proof** that both side circuits work.

A later structural PASS is allowed ONLY once the actual ground-surface and route/Region continuity is evidenced. The user has approved the policy, **not automatically approved M02 image #5 or changed historical records**.

## 8. Source references

Project proposal at `docs/proposals/DICEBOX-GEOMETRY-TOLERANCE-STANDARD-PROPOSAL-v0.1-2026-10-09.md`. Foundry documentation: https://foundryvtt.com/article/scenes/ and https://foundryvtt.com/article/content-creation-guide/ and https://foundryvtt.com/article/tokens/. D&D Basic Rules: https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game .
