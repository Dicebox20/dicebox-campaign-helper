# Dark Arch M01 — STRUCTURAL INSPECT / Accepted Visual Variance

**Date:** 2026-10-16
**Workflow:** DiceBox Scene Injector V2.1 Beta
**Structural artwork verdict:** **PASS_WITH_DOCUMENTED_VARIANCE** (user explicitly accepted the composition); **not FINAL_INSPECT PASS**.
**Rendering identity:** original conversation grayscale PNG, native 1619×971, SHA256 `036823143bce9d2c92a818ccc9e7cc9496a08a0f99608a3cc3564115b06880f8`. The image bytes are retained in the conversation, not yet checked in with the branch.

## User acceptance, exact scope

The user stated: "I'm actually fine with that, it emphasis's that water is a viable route."

The previously detected northward displacement of the bridge (approximately 14 ft) and westward displacement of the gate (approximately 12 ft) are intentionally accepted **visual composition changes**, not silent geometry tolerance exceptions. The newly visible river space and access to two quays should encourage players to improvise a skiff crossing. Preserve this structural render; do not regenerate solely to realign it with the superseded visual composition.

Other locked PREPARE criteria remain: Luskan's South Bank on the left, Closeguard Island / Kurth Tower on the right, freeform travel with GM-set guards, no mandatory puzzle, hanging rope/hoist, separated movable skiff, connected water and rope bypasses, scale 40×24 gridless at 120px per 5 ft (final target 4800×2880), strict overhead camera, clear embossed walls, no measurement grid, no painted skiff or tokens.

## Visual inspection

- PASS: true overhead orthographic geometry and dimensional grayscale relief.
- PASS: continuous main bridge, identifiable security gate and island-side approach.
- PASS: quay stairs on the city side and dock/stairs inside the island barrier; skiff berth is empty.
- PASS: rope between hoist and island-side upper terrace with stairs connecting down to inner court.
- PASS: no preplaced guards, tokens or compulsory floor puzzle.
- ACCEPTED VARIANCE: bridge and gate art are offset from the original coordinate template. This is now purposeful map composition.
- CONDITIONAL: sight/movement Wall semantics, exact feature coordinates and elevation physics still need canonical authored implementation in Foundry, not pixel-derived tracing.

## Reconciled semantic geometry

The prior 40×24 independent geometry remains immutable provenance in `spatial-blueprint.json`. A **new** independently authored version is in `spatial-blueprint-render-reconciled.json`, regenerated with `reconcile_render_geometry.py` from human-reviewed composition intent. It does not derive authoritative Foundry Walls automatically from raster pixels.

The new semantic design anchors the bridge around the northward part of the map, places the gate on the island approach to its west, defines a 20ft semantic crossing, and retains a 15ft gate opening and a separate 20ft inlet for watercraft at a lower elevation. The skiff is a separate, movable GM-owned/Tile candidate. The rope crosses above the wall with ~6.86ft modeled overhead clearance and descends to the post-gate terrace.

**Deterministic checks:** 10/10 pass in the local semantic model. Medium and Large tokens reach the inner court when the main gate is open; gate closure prevents direct bridge crossing; the city quay remains reachable; the island dock stairs and upper rope terrace stairs independently connect to the post-gate court. Removing either stair connector blocks its respective bypass as expected.

This is design-level verification, not Foundry movement or physics. Underwater navigation, hoist rigging, stairs and exact architectural Wall mapping still require runtime-appropriate validation later. Geometry remains program-owned; painted pixels are not an authoritative wall surface.

## Feature Manifest reconciliation

See `feature-manifest-render-reconciled.json`: 9 static/interactable spatial features, GM-only guard placement, Jim as narrative companion, separate skiff asset (not background-painted), exactly the three meaningful traversal options. Gameplay remains freeform.

## Future steps and boundary

The EMBOSSED GRAYSCALE structural artwork is accepted with an explicit documented variance; the nested V2.1 Beta feature/geometry reconciliation is **PASS_LOCAL_REVIEW**.

**Next creative step:** Paint this accepted structural design with grounded wet stone, Luskan coastal timber, rusty iron and cold water while maintaining the gate, rope, both dock stairs, clear watercraft inlet and unchanged path connectivity. Bind the actual source image by SHA256 before a paint edit or final asset staging. The painterly render then requires FINAL_INSPECT, which alone approves the final map. No BUILD, STAGE, INJECT or VERIFY has occurred.

**Authority caveats:** The user acceptance is visual/layout acceptance only, not authorization to alter live Foundry. No live Game Master authority is verified.
