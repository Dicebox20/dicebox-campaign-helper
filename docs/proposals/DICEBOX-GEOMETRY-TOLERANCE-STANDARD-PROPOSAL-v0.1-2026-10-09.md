# DiceBox Geometry Tolerance Standard — Proposal v0.1 (2026-10-09)

**Authority status:** PROPOSAL / REVIEW ONLY. **Not an accepted canonical rule or live workflow change.**  
**Scope:** DiceBox structural map generation, grayscale INSPECT, Feature Manifest / Spatial Blueprint reconciliation, Injector geometry preflight, Foundry runtime tests.  
**User request:** Define natural variation bands for road/trail widths, intentional bottlenecks, creature sizes and wall placement; propose changes to the official workflow **before** changing canonical contracts.  
**Sources consulted:** Repo `AGENTS.md`; `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md`; `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md`; `.codex/skills/dicebox-injector-workflow/SKILL.md`; M02 attempts 004/005 and Blueprint Reconciliation v002; Foundry official docs at https://foundryvtt.com/article/content-creation-guide/ , https://foundryvtt.com/article/scenes/ , https://foundryvtt.com/article/tokens/ ; D&D 5e official Basic Rules at https://www.dndbeyond.com/sources/dnd/br-2024/playing-the-game . **Numerical tolerance bands below are proposed DiceBox design policy, not official Foundry/D&D rules.**

## 1. Principle

**Be strict about topology and actual game movement; permit reasonable artistic and natural variation in apparent path widths.** Target width is a design goal. A narrower observed segment is not by itself a hard structural REDO. The actual blocking *ground* surfaces, approved route purpose, token footprint and continuous traversability decide usability. Bright road paint, a mushroom cap canopy, and wall-collision geometry are not identical boundaries.

This proposal does not change `battlemap-120`: Gridless / 120 scene pixels per five-foot logical space, with token footprint managed by D&D5e and uniform source-image → Scene coordinate mapping. **Pixel scale arithmetic remains exact; only authored aesthetic geometry gets tolerance.**

## 2. Width profiles (proposal, feet)

| Route profile | Target | Natural accepted band | Short local constriction | Required access |
|---|---:|---:|---|---|
| Primary road | 15 ft | **10–20 ft**; **no hard maximum** | **5–<10 ft** only when intentional, short and clearly documented | Medium/Small 5ft footprint must have continuous passable route |
| Secondary forest trail | 10 ft | **5–15 ft**; **no hard maximum** | 5ft is normal single-file terrain; <5ft cannot be certified for Medium unless route excludes them | Medium/Small 5ft on intended loop |
| Explicit Large-access route | Contextual target, usually ≥10 ft | **At least 10 ft at all required points** (not a ±5ft license) | <10ft requires a separately approved squeeze/alternate-route policy; don't assume automation handles squeezing | Large 10ft swept token footprint |
| Explicit Huge-access route | Contextual target, usually ≥15 ft | **At least 15 ft where advertised** | Narrower only with explicit designed restriction or alternate route | Huge 15ft |
| Other creatures/special routes | Character/encounter-specific | Authored minimum tied to token footprint | No inferred fit from image dimensions | Sized as specified in the Actor/encounter |

**No width maximum:** a road opening into a 30ft clearing should remain PASS. For narrow routes, don't impose a 10ft width on a trail that was intentionally designed for Medium explorers.

### Intentional chokepoints

- A planned 5–<10ft narrow segment on a primary road is **allowed** if it is visually understandable, bounded by real terrain, navigable by the required Medium party, and tagged `intentionalBottleneck:true` with position, reason, expected creature size and any movement consequences.
- Recommended default for natural forest scenes: keep any **single** main-road constriction around **10ft of travel length or less** and generally no more than **two** such points in a scene. These are **design review heuristics, not auto-REDO thresholds**. Unusual longer bottlenecks require an explicit authored note or route alternate.
- A required large-creature path cannot count a 5ft bottleneck as adequate merely because Large creatures might be able to squeeze under tabletop rules. Squeezing needs specific rules/runtime support and a separate acceptance test.
- Width should be assessed along the route, not as an average across the map. No wide area elsewhere compensates for an actual impassable chokepoint.

## 3. Token footprint and traversability

The Foundry **Token Dimensions (Grid Units)** are mechanical; `Scale (Ratio)` changes art only and is not a clearance correction. D&D5e typical combat-footprint dimensions are Tiny 2.5ft, Small/Medium 5ft, Large 10ft, Huge 15ft, Gargantuan 20ft (specific Actor overrides may change this).

Acceptance for a designated route requires:
1. Explicit required mover sizes/footprint for that route.
2. A continuous centerline/usable **walkable surface** from the source to destination. Textured unpaved ground may be traversable even when it is not visibly the brightest road stripe; solid cliffs/stalagmites/trunk bases are not.
3. A swept/token-footprint collision test against **actual** approved solid obstacles and closed boundaries, including bends and connectors, not only sparse sample points or a decorative route line.
4. Spawn/arrival Region large enough for the intended token footprint and safe landing, without overlap with blockers.
5. Foundry client/player canary on exact stack once installed; a pure Blueprint/proxy check alone is not certification.

Never shrink token visuals or mechanical width to make clearance tests pass.

## 4. Wall and object alignment tolerances (proposal)

At default `battlemap-120`, one foot equals 24 **target Foundry scene pixels**. For a 1536×1024 inspection preview authored as 36×24 5ft cells, one foot equals ~8.533 **source pixels** and reprojection is 2.8125×.

| Semantic wall feature | Target alignment error to accepted *ground footprint* | Disposition |
|---|---|---|
| Verified solid walls/grounded trunks/rock edges on ordinary terrain | **≤0.5 ft (~12 scene px)** | PASS if collision & sight behavior is correct |
| Ordinary blocker with **0.5–1 ft (~12–24 scene px)** disagreement or fuzzy source edge | **REVIEW**, re-trace or document render uncertainty | Don't automatically regenerate image |
| Ordinary blocker with **>1 ft** error | **BLOCK geometry lock** | Reconcile the trace/approved footprint before BUILD |
| Door/portal endpoints, joins, thin bridge edges, pinch points, and teleport landings | **No functional penetration, false opening, LOS leakage, invalid width or trapped arrival** | Functional failure BLOCKS regardless of numeric tolerance; target ≤0.5ft where image resolution allows |
| Overhead mushroom caps, cast shadows, decorative edging, frills | **No collision wall** | A wall traced along canopy art instead of the ground base is WRONG even if close in pixels |

**Important:** Visual raster boundaries can be uncertain or antialiased. Record an approximate `boundaryUncertaintyFt` for each critical class. If the image is too ambiguous to locate a ground footprint within the tolerance, require semantic review or a fresh structural render; do not fabricate precision. Exact authored scale/coordinate conversion is never relaxed by alignment tolerance.

### Coordinate verification

For a measurement `w` with uncertainty `u`, use interval `[w-u, w+u]`, not a fake exact pixel width:
- Entire interval satisfies required functional minimum → geometry PASS candidate.
- Interval straddles the functional minimum → REVIEW / resolve uncertainty, don't auto REDO.
- Entire interval is below functional minimum → FAIL for that *required* route unless PREPARE records a different intended mover/route.

This uncertainty is **not** a license to invent a walkable path through solid rock.

## 5. Distinguish PASS, WARNING/REVIEW, and FAILURE

| Finding | Internal grading | Workflow consequence |
|---|---|---|
| Topology correct, movement routes pass, minor target-width variation | `PASS` / `PASS_WITH_DOCUMENTED_VARIANCE` | Continue to Feature Manifest; note deviations |
| Intentional narrow passage, clearly traversable by required party, authored as bottleneck | `PASS_WITH_DOCUMENTED_VARIANCE` | Continue; document gameplay consequence |
| Width visually ambiguous, insufficient raster precision, boundary not classified, anchor uncertainty | `NEEDS_RECONCILIATION` | Hold semantic Blueprint lock; inspect/trace/test **before deciding on REDO** |
| Pure route proxy clears walls but leaves actually impassable rock/cliff surface | `FAIL_WALKABLE_SURFACE` | Fix route geometry or return to structural REDO if no valid route exists; can't pass by shifting math line into rock |
| Required route physically blocked, essential entrance missing, no playable 5ft route for required Medium party | `REDO_REQUIRED` | Structural REDO from accepted PREPARE, with fully fresh independent prompt |
| User deliberately changes accepted requirements | `PREPARE_REVISION_REQUIRED` | Reconcile and version PREPARE; new inspection is a new receipt, original failure/history not erased |
| Geometry passes but runtime token/collision/Region behavior fails | `IMPLEMENTATION_FAILURE` | Correct owned runtime mapping / build, don't default to regenerating art |

The **outer** DiceBox workflow still has `INSPECT: PASS | REDO`. Internal grading is evidence, not an unauthorized new durable workflow state: a resolved `PASS_WITH_DOCUMENTED_VARIANCE` counts as a structural PASS, while `NEEDS_RECONCILIATION` holds inside the current substage without painting. FINAL_INSPECT PASS still automatically approves **final art only** under existing policy.

## 6. Proposed inspection data contract

A `routeClearancePolicy` record should accompany each required navigable route:

```json
{
  "routeId": "m02-main-road",
  "targetWidthFt": 15,
  "preferredMinWidthFt": 10,
  "preferredMaxWidthFt": 20,
  "hardPassableWidthFt": 5,
  "requiredCreatureSizes": ["Medium"],
  "intendedBottlenecks": [
    {
      "semanticId": "m02-root-bottleneck-west",
      "positionFt": 57,
      "widthFt": 7,
      "lengthFt": 6,
      "intentional": true,
      "clearanceConfirmed": false
    }
  ],
  "noHardMaximumWidth": true,
  "surfaceClass": "walkable-forest-floor",
  "measurementUncertaintyFt": 0.5,
  "validation": {
    "visualInspection": "pending",
    "semanticGeometry": "pending",
    "sweptTokenCanary": "pending"
  }
}
```

**Example only, not M02 field evidence.** No true 7ft bottleneck at 57ft is being asserted. Formal schema changes must be reviewed after this proposal is accepted. Whenever a route is tagged Large-accessible, its actual hard minimum is 10ft, not the generic 5ft.

Additional geometric metadata proposals: `boundaryUncertaintyFt`, `wallAlignmentErrorFt`, `blockingClass`, `groundFootprintSource`, `sourceImageSHA256`, `routeObservedMinFt`, `routeClearanceConfidence`, `encounterSpecificRequiredFootprintFt`, and `bottleneckConsequence`.

## 7. Exact official workflow changes proposed (not applied)

- **PREPARE:** Define per-route `targetWidthFt`, preferred tolerance, intended mover sizes, bottlenecks/route restrictions and walkable terrain class. Keep existing map physical area and `battlemap-120` invariant.
- **STRUCTURAL_RENDER:** Treat width bands as *composition goals*, not prompt hard-coded exact pixels. Strict orthographic and other structure requirements remain. **All REDOs still obey the permanent DiceBox image-prompt clean-restart rule:** discard the rejected prompt entirely and author a new independent prompt from accepted PREPARE. Tolerance changes never license prompt variations or editing failed images.
- **STRUCTURAL_INSPECT:** Produce visual width estimates with uncertainty; apply functional vs preferred bands; grade `PASS`, documented variation, or `NEEDS_RECONCILIATION`. Fail a render only on actual unmet required accessibility/topology/semantics, not a narrower-but-playable road.
- **FEATURE_MANIFEST / SPATIAL_BLUEPRINT:** Trace ground blockers vs canopy shadows; record route walkable-surface class, passage clearance, short bottlenecks, wall alignment error/uncertainty, spawn footprint and sweep test. Resolve `NEEDS_RECONCILIATION` before painting.
- **PAINT_RENDER / FINAL_INSPECT:** Preserve functional clearances, readable intended bottlenecks and region/lighting anchors; painterly details cannot conceal a blocked route. Do not enforce bright paint stripe as the entire walkable band.
- **BUILD / INJECT / VERIFY:** Extend static scene QA with documented route policy, uncertainty and swept-token clearance checks; exact Foundry player-client movement, vision and arrival canaries verify runtime behavior. Maintain one macro per map, safeguards and idempotent world writes.
- **Knowledge base:** On user acceptance, add an additive chronological seed delta and test fixture; avoid rewriting the five previous M02 REDO historical receipts. A new re-inspection receipt may supersede interpretation but preserves provenance.
- **Project settings:** Only after acceptance, update canonical documents, affected validators and App map-creation pipeline with profile/version and tests; don't create this rule solely in chat memory.

## 8. M02-specific review implications — NOT an automatic PASS

M02's fifth grayscale REDO records source-road spans estimated at ~**80–110px** at 1536×1024 for a 36×24 intended map. That is about **9.375–12.89ft** (42.67px / 5ft). At proposed primary-road preferences, most samples are inside the 10–20ft band; the narrowest sample falls just below the preferred 10ft, **not** automatically below a Medium creature's 5ft functional minimum. This is a candidate **documented narrowing**, not an automatic overall structural PASS.

Previously the secondary loops were recorded as “not reliably 10ft everywhere.” The new 5–15ft preference could allow narrower loops if there is a continuous genuinely walkable 5ft Medium route. That remains **unproven** from available widths alone. We must still inspect:
- Continuous traversable loop on actual cavern floor rather than a drawn line through stalks/cliffs;
- Correct physical mushroom trunk-base vs overhead canopy classification;
- Travel/forage/hunting Region access; 
- Any intentional primary-road bottlenecks and exact measurements;
- Wall overlays and runtime canaries when geometry is installed.

**M02 next evidence gate only after acceptance:** Version M02 PREPARE with the new route policy (do not mutate past evidence), re-inspect attempt 005 as a separate report, then reconcile/lock blueprint if it genuinely supports Medium movement. Do **not** automatically recolor it or bypass required tests.

## 9. Approval gate and open choices

**Proposed defaults:** 15±5ft main roads, 10±5ft side trails, intentional documented minimum 5ft Medium chokepoints, route-size-specific hard clearance for Large/Huge, ordinary grounded-wall alignment target ≤0.5ft and review to 1ft, functional hard-block invariants. Maintain a non-destructive `NEEDS_RECONCILIATION` resolution step before deciding REDO.

**On user approval**: create chronological KB decision, update canonical workflow/skill and compiler/injector inspection fixtures, verify all tests, then promote to `main` and app. Until that point this draft is not authoritative and no existing M02 verdict is changed.
