# DiceBox Grid, Token, and Background Resolution — Source Research (2026-10-09)

**Status:** RESEARCH / PROPOSED WORKFLOW GUIDANCE — not a merged change to the accepted scale contract.  
**Scope:** Foundry v14 Scene Creator/Injector scaling; D&D5e 5.3.3 world semantics; M01 migration.  
**Related review:** `docs/DICEBOX-SCENE-INJECTOR-RECONCILIATION-PROPOSAL-2026-10-09.md` (draft PR #7).

## Official Foundry findings (source-derived)

1. Foundry **Scenes** says default grid size is **100px**, supported minimum is **50px**, and maps commonly use 70/100/140/200px; changing a Scene's grid size may move or misalign walls, lights, notes and tiles. **Gridless** removes visible fixed grids but does not remove grid size/distance measurement semantics. Source: https://foundryvtt.com/article/scenes/
2. The **Content Creation Style Guide** states Foundry does **not** use image DPI/PPI for canvas image sharpness. Instead use pixel resolution and pixels per intended grid space. The scene pixel width/height, logical grid count and aspect ratio should match. For snap precision, documented thresholds are **>=50px: quarters**, **>=64px: eighths**, **>=128px: sixteenths**. Source: https://foundryvtt.com/article/content-creation-guide/
3. **Tokens** documents that Width/Height are in grid units (occupied footprint) and Scale (Ratio) modifies only visual artwork size, not occupied footprint. Source: https://foundryvtt.com/article/tokens/
4. **Media Optimization Guide** recommends WebP for scene backgrounds and transparent overhead tokens, square token art facing south. For ordinary static token art it describes **200–400px** as a conventional Medium/Large source range, and approximately **3× the displayed grid size** as a useful zoom-quality heuristic. Source: https://foundryvtt.com/article/media/
5. **Dynamic Token Rings** supplies a separate higher-detail suggested subject-art table: **Tiny 256px, Small/Medium 512px, Large 1024px, Huge 1024px, Gargantuan 2048px**. These are **art file sizes**, not physical footprint. Source: https://foundryvtt.com/article/dynamic-token-rings/
6. **Troubleshooting Scene Loading Issues** warns that overly large source textures can exceed client GPU limits, typically ~8000px on older hardware, ~16000px on newer hardware, causing black canvas. This is a hardware consideration, not a blanket guarantee below those dimensions. Source: https://foundryvtt.com/article/ts-scene-loading/
7. **Foundry DnD5e settings** defines `tokenSizeSync` (Sync Token Size) as a system-level behavior, default enabled in the documented 6.0.x source. The target DiceBox world's exact 5.3.3 runtime values/settings should be reread before assuming enabled; no live writes needed. Sources: https://github.com/foundryvtt/dnd5e/blob/6.0.x/module/settings.mjs and https://github.com/foundryvtt/dnd5e/blob/6.0.x/module/documents/actor/actor.mjs

## Findings compared with DiceBox's existing official standard

The existing `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md` chooses **Gridless, 120px per five-foot logical cell**. This is a **DiceBox project convention**, not a Foundry-mandated global optimum. It sits above Foundry's common 100px and within sensible VTT quality/performance norms. **Retain 120px** absent a better measured reason or an explicit user-approved override. In particular, do not silently switch to 128px. The 128px threshold improves official snap precision to sixteenths vs 120px eighths on snapping grids, but introduces additional pixels and does not alone justify changing an accepted Gridless campaign scale.

For physical/token footprint, use D&D system-owned token dimensions where supported and avoid editing token art Scale (Ratio) to repair map geometry. Do not conflate artwork file resolution with token grid occupancy.

### Recommended source artwork targets for 120px Gridless scenes

| Creature | Typical 5e occupancy (cells) | Display footprint at 120px (square pixels) | DiceBox high-quality token source (square pixels) |
|---|---:|---:|---:|
| Tiny | 0.5 | 60 | 256 |
| Small | 1 | 120 | 512 |
| Medium | 1 | 120 | 512 |
| Large | 2 | 240 | 1024 |
| Huge | 3 | 360 | 1024 |
| Gargantuan | 4+ | 480+ | 2048 |

The occupancy values are standard 5e tactical conventions, subject to exact system settings/actor overrides. The last column is Foundry's high-quality Dynamic Token Rings subject-art guidance; ordinary static tokens can be smaller where practical, provided zoom quality remains acceptable.

### Recommended rectangular battle-map targets (example tiers; NOT required universal sizes)

| Logical spaces | World footprint at 5ft per space | Intended 120px Scene/image resolution | Nominal RGBA8 texture storage |
|---|---|---|---|
| 24×16 | 120ft×80ft | 2880×1920 | ~21 MiB |
| 36×24 | 180ft×120ft | 4320×2880 | ~47.5 MiB |
| 48×32 | 240ft×160ft | 5760×3840 | ~84.4 MiB |

These decoded-RGBA8 estimates are raw texture-size comparisons only, **not total Foundry RAM/VRAM budgets**; the browser, mipmaps, light maps, other assets, and renderer may use much more. Do not mistake WebP's smaller **transfer file size** for equivalently small **decoded GPU texture memory**. These recommended sizes are derived engineering examples, not prescribed by Foundry.

## M01 exact mathematics (read-only migration planning)

The approved M01 source raster is **1536×1024** (3:2). The previously staged Scene's logical grid size **64px/5ft** implies exactly **24×16 logical cells**, a **120×80-foot** footprint **if** the Scene was intentionally authored at 64px. This is a mathematical implication of its installed configuration, not evidence that PREPARE intended that physical size.

- At the unchanged 1536×1024 raster, simply changing grid from 64→120 shrinks the interpreted area to **12.8×8.533 cells (~64×42.67ft)**. **Prohibit grid-size-only fixes**.
- If the intended area truly is **24×16**, a 120px Scene requires **2880×1920**; all existing pixel anchors must be uniformly transformed by **1.875×**.
- If PREPARE intended **36×24**, a 120px Scene requires **4320×2880**; source-asset anchors would uniformly scale by **2.8125×**. The original artwork would then provide only **42.67 source pixels per 5ft**, which will look softer at high zoom.
- Resampling an approved raster to larger dimensions preserves alignment but **cannot invent the original fine detail**. Retouch/redraw/regenerate detail from the accepted layout if true high-resolution sharpness is required; do not change the map topology or paint without the approved creative workflow.
- WALL, REGION, LIGHT, POINT OF ENTRY and TILE/NOTE coordinates must all use the **same** locked affine transform from MapSpec/image source coordinates; verify traversable widths and alignment before persistence. Foundry's auto-reposition is not a sufficient final geometry-verification receipt.

Because M01 already exists in the world, any actual scale migration requires a no-write Scene snapshot, authority reconciliation and precise rollout test. This research creates **no live-world change**.

## Proposed additions to the official workflow

1. In PREPARE, lock *logical cells*, *physical feet*, *grid px*, *art raster px*, and *planned Scene px* separately. Enforce `scene_width = columns * px_per_cell` and `scene_height = rows * px_per_cell`.
2. INSPECT verifies door/corridor/token clearance at **mechanical footprint** rather than aesthetic judgment alone. A 1-cell Medium character must fit its intended path; larger planned creatures require authored wider routes.
3. Final art check confirms native effective pixel density. Treat resampling as a transport/display transform and report original source resolution; never claim it adds image detail.
4. BUILD lints aspect-ratio agreement, scale arithmetic, any coordinate transform, expected token occupancy and WebP image dimensions, and rejects grid-size-only Scene fixes.
5. Record Foundry/D&D5e exact runtime token-size-sync setting in the preflight receipt, but do not mutate it automatically.
6. Use WebP by default, track both compressed bytes and raster/GPU-relevant dimensions, and keep large scenes within conservative client texture constraints.
7. On existing Scene scale changes, snapshot World state and verify relocated Level background, Walls, Regions, Lights, Tokens and crossings after the update. No blind mutation of placed token footprints.

**Disposition:** Keep the accepted battlemap-120 default and existing DiceBox token art table. Tighten the mathematical and performance/geometry validation instead of changing a useful convention without evidence.
