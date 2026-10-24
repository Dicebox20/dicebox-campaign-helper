# H-G06 Great Room — larger render after owner scale complaint

**Date:** 2026-10-23
**Owner latest:** “that's too small for the greatroom”, rejecting prior compact image `gothic_manor_great_hall_map.png` generation `a7c8bbde-a17c-4329-9997-bf7eea9c4069`.
**Pre-render evidence:** [fresh recheck and source geometry/size caveat](./h-g06-great-room-oversize-redo-pre-render-gate-2026-10-23.md), BWE-027 original owner floor plan, current 56-card H-G06 scene PREPARE, representative wall guide.
**New image source:** `top_down_highly_detailed_isometric_plan_view_inte.png`, gen `d2e018d9-14f3-41eb-a687-7b002dc3b765`, **1536×1024**, RGB, **3,102,667 bytes**, SHA-256 `402180500f5fa6a126c9134a677afedb3ba5fbe6cf8114afd76ab7ad6b3eab39`.

**Visual status:** `RENDERED_INSPECT_REDO_RECOMMENDED_OWNER_NOT_APPROVED`. STOP this render cycle; do not archive as accepted.

### PASS
- Excellent spatial increase vs initial compact art: wide family great hall, generous playable circulation around seating, sizable hearth and large upper stair along east wall; larger house scale visually convincing.
- Top-down wall caps and overhead flooring generally better preserve source style than elevated cutaway.
- Plausible grandfather clock near east/north hearth, left side large drawing/blueprint table, ambient old manor details.

### Architectural hard blockers
- **Required north doorway to H-G09 Rear Family Room is missing/unrecognizable**: north wall is mostly windows and centered hearth; no passable reciprocal Family Room entry appears. This is hard under present House-v2 PREPARE regardless of aesthetic size improvement.
- **West H-G01 Dining and east H-G05 locked Study boundary portals are uncertain**: wall apertures near outer sides may not align with BWE-027 central side doors; east features staircase and a side door but it needs clear separate locked Study anchor. Do not certify paired physical portal coordinates by looking only at art.
- **The separate little `027` lockbox** isn't unambiguously distinguishable from generic table chests and clutter; the blueprint/table and 027 must be separately inspectable. Placeable item model can help, but initial hard gate should reserve clearly independent anchor.
- **Style caveat:** strongly illuminated fireplace and candle glows baked into art despite Foundry owning dynamic fire/light; grand hall is much wider than BWE-027 labeled 14×16 ft, so changed shell/adjacent rooms and upper alignment require owner-directed dimension reconciliation before technical build.
- **Exterior/crop caveat:** extra bay-window façades, foyer projection and peripheral ground beyond core Great Room introduce geometry outside the single interior footprint and would need reconciliation if accepted.

**Next user decision:** accept the size direction (not this whole topology) and perform a fresh independent scene PREPARE for an enlarged hall with clearly located **S Foyer**, **N Family Room**, **W Dining**, **E locked Study**, **E upstairs landing stair**, fireplace offset from north door and two distinct clue anchors, under neutral light and thin wall caps. Owner may explicitly override any issue; otherwise next REDO must meet all required entrance positions. Do not reprocess this rejected image/prompt into another generation unless the owner authorizes a style-transfer edit. No Foundry writes.

**Count:** 18/45 owner-accepted base map artworks, 27 remain (H-G06 still unapproved).
