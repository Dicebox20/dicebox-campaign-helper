# H-U07 Dahlia's Art Studio — V017 independently prompted single render and FINAL ART PASS

**Date:** 2026-10-24 Pacific. **Campaign:** Cabin in the Ashen Veil (separate from core Dicebox/Central Lodge).  
**State:** `PREPARE_REVIEWED → ONE_FRESH_PROMPT → ONE_RENDER → PIXEL_INSPECT_FINAL_PASS → EXACT_ART_ARCHIVED → FOUNDARY_BUILD_PENDING`.  
**Visual authority:** Owner explicitly delegated final art PASS/FAIL to this assistant on 2026-10-24. This record exercises that authority **for this exact PNG only**.  
**World writes:** **NONE**. Native Foundry Scene H-U07, Level, Portal Regions, Wall geometry and puzzle documents are **not** installed or verified just because the artwork is approved.

## 1. Source-of-truth and prompt provenance

Before the single render, re-read:
- [Latest room PREPARE](../prepares/h-u07-dahlia-art-studio-current-owner-pre-render-v1-2026-10-23.md) including owner supersessions, H-U07 upper/east-wing location, H-U02 west entry, hidden separate H-U08 Candle Workshop, vanity, `027` painting and Sune shrine;
- [canonical image-space geometry guide](../render-guides/h-u07-upper-studio-geometry-anchor-v001.json), whose coordinates are **not** Foundry wall/feet measurements;
- [actual owner-approved 50-year aged H-G06 Great Room style](../visual-standards/approved-50-year-abandoned-lodge-interiors-hg06-reference-2026-10-23.md), exact local canonical PNG `h-g06-great-room-aged-50-years-owner-approved-2026-10-23.png`; basement exception remains intact;
- [V016 failed visual inspection and workflow improvement](./h-u07-single-render-v016-final-inspect-fail-2026-10-24.md).

New positive-only independent image-facing prompt (not a modification of prior rejected prompts) was archived **before rendering**: [H-U07 V017 geometry-focused minimalist prompt](../render-prompts/h-u07-v017-geometry-focused-minimal-fresh-positive-2026-10-24.md), GitHub commit `d03c4c7ed24d538c0e01b1613f17541c0b70b03f`. Previous failed image compositions are not canon; the approved H-G06 artwork governs weathering, neutral lighting and battlemap legibility.

ImageGen was called **exactly once** in this turn. Returned fresh generation `bed5fc27-7433-469b-b23b-0b35a842078d`, `edit_op:null`, `parent_gen_id:null`, output `top_down_isometric_overhead_fantasy_rpg_map_style.png`. Exact result visually INSPECTED in the same work unit; five 2× enlarged **non-art** inspection crops derived from unchanged original PNG for wall/fixture verification. **No second image render.**

## 2. Exact approved raster / durable handoff

- **PNG dimensions:** **1536×1024 RGB**, **2,888,738 bytes**; SHA-256 **`67c9e5c84ff120d65600648ddb014e30a00f1ec6226c6e309e994db54aab4704`**, verified locally with Pillow/hashlib readback. Despite the requested portrait framing, actual output is landscape; PREPARE does not fix physical room dimensions or portrait aspect, so this is not a blocking room-specific constraint. Preserve the image's intrinsic aspect ratio when building Foundry scene dimensions.
- **Exact approved original PNG:** [H-U07 Dahlia Art Studio — owner-delegated approved V017](https://drive.google.com/file/d/1fk1B0uLessRYczAj9XV7y9v7z77HpksY/view?usp=drivesdk), in owner-connected private [Approved Cabin Map Art folder](https://drive.google.com/drive/folders/1S4Gj3YYWv33PulkBMY5QDnJ64c-oH7P-). Google Drive independent metadata returned **2,888,738 bytes, image/png**, correct exact approved folder. Do not substitute earlier private **unapproved** V001–V016 images.
- **Local staging source (when container session still active):** `/mnt/data/top_down_isometric_overhead_fantasy_rpg_map_style.png`. Future runs must verify local path before linking/using; repository and private Drive record are durable authority.
- Approved status is **art-only**; no physical feet/unit size, grid, portal coordinates, lighting light source, scene UUID or any active gameplay state has been inferred by this aesthetic approval.

## 3. Actual image inspection against canonical room

| PREPARE hard gate | Final PASS | Specific observation |
|---|---|---|
| Normal WEST entry into H-U02 Upper Landing | **PASS** | Open entry in mid-left/west perimeter with clearly visible pale flagstone landing outside; full north/south flank walls |
| Continuous SOUTH perimeter | **PASS** | Full-width black-capped stone/wood masonry from corner to corner, verified on 2× crop |
| EAST disguised boundary to separate prayer-gated H-U08 | **PASS** | Continuous right/east wall behind Sune altar, no initial crossing / reward in raster |
| Distinct NW vanity with **vacant mirror fitting** | **PASS** | Gilt oval frame contains dark diamond-tufted dusty **nonreflective fabric backing**, preserving empty mounting state; no mirror reflection |
| NE framed **chest clue `027`** | **PASS** | Large legible framed image clearly depicts ironbound chests; numerals `027` on plaque **inside the same painting** below the depicted chest. This is an acceptable visual representation of the PREPARE's inspectable numbered-chest painting; actual player click should open a handout/chat card to confirm exact clue and avoid reliance solely on raster microtext |
| Distinct east-wall Sune carved rose shrine | **PASS** | White-cloth devotional table and separate sculpted rose relief with identifiable spiraling-petal icon, tarnished votives and dead flowers, physically separated from painting and vanity |
| Authentic 50-year neglect comparable to H-G06 | **PASS** | Heavy corner cobwebs, pervasive dust, dead plants, split/aged parquet, cracked/peeling plaster, frayed rugs and red drapery, dull metals and leaf debris; still preserves traversability and playable furniture silhouettes |
| Neutral even ambient baked light | **PASS** | Subdued, diffuse cool-neutral ambience, local window-sill highlights but **no spanning directional light shafts**; comparable readability to canonical H-G06. Dynamic interactive light will be native Foundry later |
| Single-level overhead usable floor | **PASS** | Complete one-room tabletop floor layout with reachable vanity, numbered painting, shrine and artist workbench. The painterly/isometric wall-cap effect is consistent with H-G06's top-down scene style |

**Definitive visual determination:** **PASS**, subject to no replacement, cropping, scaling distortion, re-render or hidden map alterations after this specific file's verified hash. This is the first accepted H-U07 base image; prior rejected attempts remain historical evidence only.

## 4. Count and next build dependency

- At last census there were **45** logical base-art targets (with an extra EXT-TRAIL map outside that count), **19** target backgrounds accepted, **26** missing. This new accepted H-U07 V017 raises **approved base-art count to 20/45; remaining 25**. The installed native **Foundry Scene** count remains **20**, as V017 artwork has **NOT** yet been injected. Separate trail Scene remains outside the 45 census; the dated prior group PREPARE register is historically stale for both 18/45 and H-U07 status.
- **Next bounded task: BUILD/STAGE/INJECT and native VERIFY of H-U07.** First confirm exact live Foundry world `cabin-in-the-ashen-veil`, Foundry 14 / dnd5e, elected GM, that H-U07 has not already been installed or modified by owner, then transfer **exact hash** approved original PNG to Foundry Data under versioned H-U07 approved asset filename, create a **separate** H-U07 Scene with one Ground Level background matching intrinsic image ratio and read back its document/asset checksum. Do not infer grid/walls from raster; owner has retained manual Wall/door placement (broad mutation authorization notwithstanding, avoid overwriting existing owner geometry). If native asset transfer is unavailable, mark `BUILD_BLOCKED_ASSET_TRANSFER`; never claim injection happened. Recheck scene/world on next run before any write.
- After actual Scene preparation, build protected Region/Item/Journal interactions only from separate puzzle continuity/LOCK docs. Mirror insertion → distinct one-time Carriage Key/Brass Tiny Key #1 pickups; painting inspect → readable `027` clue without shared spoiler hints; Sune's Prayer of Protection → H-U08 concealed eastern access; Prayer of Devotion → separate Sune emblem half. Player thought clues should be ephemeral token-overhead bubbles only on intended player client; explicit actions may use chat cards. All must be GM-authoritative and non-GM playtested.
- **Do not auto-promote v017 art approval to gameplay implementation/playtest.** The main campaign stage and other scenes remain unchanged.

## 5. Evidence classes

`OWNER-DELEGATED_VISUAL_APPROVED`: final image art only.  
`DOCUMENTED`: H-U07 PREPARE, puzzle dependency contract and source geometry guide.  
`RENDERED`: original V017 PNG exactly as hashed.  
`INSPECTED`: full image and actual five inspection crops.  
`NOT_IMPLEMENTED/UNVERIFIED`: H-U07 Foundry Scene, entry/secret passage behaviors, item key rewards, player testing.  


## 6. Post-approval native Foundry preflight result (same bounded turn)

After archiving the exact approved PNG, a single read-only preflight `cav-hu07-v017-approved-art-native-readonly-stage-preflight-20261024-v1` attempted to inspect the exact local Foundry `/game` origin and world via the established Chrome for Testing Dev Playwright CDP utility harness. The host-returned Node result was `BLOCKED browserType.connectOverCDP: connect ECONNREFUSED 127.0.0.1:9224`. The PowerShell wrapper itself reported execution, but the CDP endpoint refused connections. **No authoritative live Foundry Scene readback occurred and no Foundry write/injection was attempted.** Next BUILD turn must re-probe exact world and elected GM, check H-U07 uniqueness and source transfer route before any staging or scene creation. Maintain distinction between **ART PASS** and **NATIVE INSTALL UNVERIFIED**.

A reproducible KB seed exists as `database/seed.d/2026-10-24-cav-hu07-v017-visual-pass-build-pending.sql`, but was not executed against the live knowledge database this turn.
