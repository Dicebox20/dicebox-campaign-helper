# Dark Arch M01 — GEOMETRY / GEOMETRY INSPECT

**Workflow:** DiceBox Scene Injector V2.1 Beta, geometry-first creative stage.
**Date:** 2026-10-16. **Verdict:** **PASS (local pure geometry; live runtime not certified)**.
**Authority:** 2026-10-16 restarted PREPARE, `spec.json`, and accepted geometry-tolerance/scale rules. Prior render attempts #001–#011 are excluded from generation sources and spatial authority.

## Coordinate model

- Exactly **40 × 24 logical 5-ft spaces**, equal to 200 × 120 ft and future **4800 × 2880 px** at battlemap-120, gridless.
- All geometry encoded in `spatial-blueprint.json`, in 5-foot logical coordinates with origin upper-left, x east/right and y south/down; elevations separate in feet.
- Thirteen typed traversable surfaces, 11 candidate Wall/door/coastline segments, four planned vertical transitions, two nonwalking transfers, 11 stable anchors, six props including a planned separately movable skiff.
- The preview PNG is **only an annotated geometric review diagram**, not grayscale art, final background, image-generation input from rejected attempts, Foundry Wall data read from pixels, or proof of runtime installation.

## Main crossing

South Bank, x 0–9, connects to a bridge deck from x 8–32.5, 20 ft clear between y 10–14, with a widened central passing bay and northern freight-crane platform. A fortified **vertical wall at x 32** divides the exterior bridge and an inner island approach. Its ordinary gate opening is y 10.5–13.5 (**15 ft**). All later door locks and alarms are GM-managed; the gate is not a required puzzle.

At x>32, the island inner court joins the transition candidate at x 38–40. A Large 10-ft square token is test-reachable along the main bridge and through the gate when open. The gate-plane collision rule rejects a through-gate path when the gate is closed.

## Independent alternative A — water/skiff

City plaza x 0–9 connects to a switchback stair footprint x 3–8 / y 15.5–20.5; the stairs descend from +18 ft to the city quay (-8 ft), x 2–9 / y 19–22. A skiff can leave the empty mooring at [6.3,20.5]. A **15-ft opening** through the island seawall plane x 32 / y 19–22 is physically open at the waterline, well below the main gate. The separate skiff is a planned GM-positionable/native Tile with a 10-ft proposed hull envelope, not baked scenery.

It arrives at the island dock [35.5,20.5] inside the gate-side barrier. The island dock x 33–38 / y 19–22 meets switchback stairs x 33.5–38.5 / y 16–20.5, ascending -8 to +18 ft, directly into the post-gate inner approach. The source and destination **are not falsely connected by walkable water**: the intermediate edge is typed `water-vessel`, requiring GM adjudication and eventually dedicated boat movement testing.

## Independent alternative B — rope/hoist

The main bridge joins a northern crane access platform near [26,9]; the hoist rises from +18 ft bridge level to +45 ft attachment. An aerial rope reaches [35,7] on the island service terrace at +31 ft. It crosses wall x 32 at approx. +35.667 ft, **5.667 ft above the wall top at +30 ft**. Thus the rope does not require an unseen tunnel or an invented ordinary gate opening.

A north service walkway x 36–38 / y 8–12 connects the terrace down to +18 ft inner court via a visible stone stair route behind the main gate. The rope remains a **GM-adjudicated** climb/swing/drop; falling, magic, rope strength and skill checks are not automatically implemented by geometry alone.

## Static and separately owned features

The checkpoint booth, wagon, cargo cover, alarm bell, crane, parapets, dock fixtures and fixed stairs are candidate static background features. Solid cargo is located **outside the required 20-ft central bridge lane**. Movable skiff is excluded from both grayscale and painterly background artwork. No guards, Jim Darkmagic tokens, measurements, or baked labels in the future artwork. The corresponding Foundry Wall/door/Region/Tile semantics are candidate projections only.

## Deterministic inspection evidence

`author_geometry.py` generates:
- `spatial-blueprint.json` — exact rectangles expanded to semantic polygons, walls, anchor IDs, elevations, water/rope transfers, no image-derived pixel geometry.
- `geometry-inspection.json` — machine-readable PASS and evidence hashes.
- `geometry-preview.png` — readable colored/annotated GEOMETRY-only QA map.

Validation exercises exact square-footprint coverage against axis-aligned union geometry, checking movement on a **1.25-ft sampling lattice**, including open/closed gate behavior. Results:
- Open gate, Medium (5-ft) and Large (10-ft): **PASS**.
- Closed gate: normal route **blocked** for Medium and Large: **PASS**.
- South Bank to city quay and island dock up into post-gate area with closed gate: **PASS**.
- South Bank to rope hoist and upper terrace down into inner area with closed gate: **PASS**.
- Water transfer is a separate skiff crossing; no walk-across-water claim.
- Rope crosses above wall top by at least 5 ft and lands on the postgate side: **PASS**.
- 15-ft gate and 15-ft waterline boat opening check: **PASS**.
- Exact scene scale, no skiff painted, no player tokens, no mandatory puzzle: **PASS**.
- Negative controls: removing the island stair or upper terrace walkway makes its respective bypass unreachable: **PASS**. A 10-ft skiff hull fits through the 15-ft tidal opening: **PASS**.

## Known limits and the next gate

This PASS validates **authored semantic geometry, typed transfer conditions and sampled square-token reachability**. It is *not* a physical/simulation certification of swing dynamics, actual skiff pathfinding, exact stair rise/run/rail collision, Foundry v14 Wall/Region projection or gameplay. The four vertical transitions carry planned elevations and switchback runs but their detailed tread shapes must be represented clearly in embossed grayscale and reconciled into the Feature Manifest before BUILD. Portcullis and sea inlet openings are separate planes and elevations.

Current outer scene state remains `PREPARED`, with **GEOMETRY INSPECT PASS** recorded as a nested V2.1 Beta gate. The next step is an independently authored **EMBOSSED GRAYSCALE RENDER** based on this approved geometric layout. Its prompt must contain grayscale structural details only, with no reference to subsequent painting, and may not incorporate prior rejected renders.

**No live Foundry documents were written. No scene has been approved by FINAL INSPECT.**
