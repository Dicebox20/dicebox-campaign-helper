# M02 — Tallcap Forest: PREPARE geometry tolerance addendum (2026-10-09)

**Status:** ACCEPTED POLICY APPLICATION / route geometry remains **UNVERIFIED**.  
**Source design:** `M02-TALLCAP-FOREST-PREPARE-draft-2026-10-09.md` (unchanged).  
**Accepted authority:** `docs/DICEBOX-GEOMETRY-TOLERANCE-STANDARD-2026-10-09.md` merged into `main` via PR #9; accepted at user's direct request, October 9.  
**Scope:** width policy only for M02 road/branch trails. Does **not** invent new landmarks, alter the accepted image, create gameplay regions, or modify Foundry.

The original PREPARE called for >=15ft on the main road and >=10ft on each forest circuit everywhere. Under the newly approved, project-wide policy those values are **targets**, rather than unconditional rejection thresholds. The original PREPARE record remains unedited for chronology.

| M02 route | Target | Preferred natural appearance | Required physical access |
|---|---:|---|---|
| Main west–east road | 15ft | Generally 10–20ft, wider junctions allowed | At least one continuous **5ft** traversable Medium/Small route between entry and exit |
| Northern forest loop | 10ft | Generally 5–15ft | Continuous **5ft** Medium/Small branch/rejoin circuit |
| Southern forest loop | 10ft | Generally 5–15ft | Continuous **5ft** Medium/Small branch/rejoin circuit |

**Important:** This addendum does not designate either forest loop as fully Large-accessible or certify the entire main road for Large tokens. Any 10ft Large-only route, Large encounter or 15ft Huge approach must be authored separately and swept-tested before promising that functionality.

**Main-road constrictions:** Apparent <10ft segments require inspection and an explicit intentional bottleneck record (location, approximate length, cause and consequences) before being marked `PASS_WITH_DOCUMENTED_VARIANCE`; unknown dimensions remain `NEEDS_RECONCILIATION`. A short 5–<10ft pinch is a design option, not permission to cover a genuinely impassable place.

**Map scale (unchanged):** 36×24 logical five-foot cells, 180×120ft; Gridless 120px/5ft; intended 4320×2880 scene. For the 1536×1024 structural preview, 5ft corresponds to 42.6667 source pixels, 10ft to 85.3333 and 15ft to 128. A smaller painted path width may be usable if surrounding **ground-level** forest floor is traversable; solid cliff edges and anchored tallcap stalks are not.

**Geometry workflow:** Instead of automatically generating another image when a preferred aesthetic width is missed, re-inspect the existing render, record uncertainty, trace the *actual walkable surface* and grounded obstacles, then sweep-test a 5ft Medium token footprint in a matching Blueprint. Retain separate physical width, artistic texture, Blueprint proxy and Foundry canary receipts. Never move line geometry into rocks simply to make a mathematical test pass.

**Historical preservation:** M02 attempt #5's original REDO file stays unchanged. A second dated inspection against the unchanged source image establishes the *new interpretation* without editing prior evidence. Attempt #4's Blueprint v002 must **not** be blindly transferred onto the different attempt #5 artwork; re-author and revalidate coordinate geometry from the correct image.

**Current stage:** `STRUCTURAL_INSPECT_REVISIT` → `FEATURE_MANIFEST/BLUEPRINT_RECONCILIATION` only when all required visual/functional claims are supported. No painterly art or Foundry installation is authorized by this addendum alone.
