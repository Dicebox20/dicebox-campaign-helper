# Cabin in the Ashen Veil — Regionwright puzzle guidance checkpoint (2026-10-24)

Status: OWNER-APPROVED ARTWORK / DESIGN GUIDANCE. Not implemented, installed, or playtested.

The approved artwork package and moveable-part cutouts are provided to owner as `regionwright_puzzle_working_assets_2026-10-24.zip`. Store approved originals separate from extracted drafts. Contains 6 individually cropped book spines, 8 individually cropped Sune picture tiles, five approved reference images, extraction manifest and detailed guidance. Local sandbox ZIP is not a GitHub repository binary asset and must be transferred/checked in by Regionwright when ready.

## Established engine reuse
Local Regionwright checkout `C:\Users\rujie\Documents\Region Editor\modules\regionwright-puzzles-locks\scripts` has `spine-mosaic-engine.js`, `sliding-mosaic-engine.js`, `ingredient-mixing-engine.js` and corresponding interfaces. Spine engine validates distinct IDs and the solution order; it does not establish the six-books publication chronology. Sliding engine accepts an image, sizes 3/4/5, legal adjacent moves and blank=0. No pressure balancing script was found during read-only audit. Use established workflow: inventory/inspect, author bounded source changes, test, approval, Foundry scoped preview→apply→reread. 15-minute turns with checkpoint.

## Individual puzzle contracts
- **Book Spine Mosaic — approved:** six images must become individually draggable book sprites using the exact story titles. Two begin on Sophia shelf, others from pond hollow log, attic, chimney, and last appears on Sophia bed at Crimson Veil. Do not assume that printed left-to-right image order is canonical publication order. Inventory insertion gating needs integration; hidden room with Gond emblem half on solve.
- **Greenhouse Ingredient Mixing — approved:** split four reservoir controls, levels, pipes/indicators and collectable result as actual interactive visuals, not whole image dragging. Existing mixing evaluator may be reused; restore water through Waterworks and fetch lye from Bathhouse soap room with Copper Tiny Key during Crimson Veil. Exact recipe targets remain unapproved.
- **Waterworks Pressure Balancing — approved:** create a pure state/valve solver and standalone configurable UI adapter, separate from physical blockage-clearing and sluice prerequisites. Keep targets unknown/configurable until approved. Restore Greenhouse supply and reveal inner utility compartment containing father's journal and Rufus's Collar.
- **Sune Sliding Portrait — approved:** separate eight tiles, retain static relief frame, normalize square geometry, obtain a complete original image for the missing ninth cell; approved rendering itself contains an empty bottom-right corner and MUST NOT be treated as full master. Existing sliding engine supports 3×3. Sune bust sequence is a different **Region-only** mechanic on four Grove corner maps, SW→NE→NW→SE. No bust popup/UI.
- **Roof Chimney Clock — approved:** background and hour/minute hands must be separable; obtain both hands from grandfather clock and attic, insert, set 12:00, press center button, reveal Replacement Gear. Existing timing-dial family might be useful but no proven direct clock adapter.
- **Blocked Greenhouse pipe** is not an approved independent artwork yet; one attempt accidentally regenerated Greenhouse mixing. **Rufus's Eyes** not approved. No extra artwork requested for the four Sune busts.

## Sprite-slicing caveats
Existing extraction is a preview with real separate PNGs, not completed transparency masks. Individual book crop bounds and eight Sune tile crop bounds are recorded in the package `asset-manifest.json`. Book edge masking, Sune gap reconstruction, uniform hitboxes, semantic stable IDs, keyboard accessibility and no reward writes before documented authorization remain to be completed.

## Next bounded development order
1. Refine spine sprites + add inventory-aware draggable image UI on existing spine engine.
2. Reconstruct Sune complete master then use legal shuffled tile order.
3. Separate Greenhouse controls with water/lye gates.
4. Implement test-driven new pressure engine after owner settles numerical targets.
5. Separate clock hands and test insertion/noon activation.
Preserve source/installed module checksums and distinct OWNER_APPROVED vs IMPLEMENTED vs PLAYTESTED evidence statuses.