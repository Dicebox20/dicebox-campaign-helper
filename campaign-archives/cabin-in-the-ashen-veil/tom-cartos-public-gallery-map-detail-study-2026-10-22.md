# Cabin in the Ashen Veil — Tom Cartos Public Gallery Art-Direction Study
**Research date:** 2026-10-22  
**Status:** RESEARCH / STYLE RECOMMENDATION pending visual trial; **not** an override of the established Dicebox map workflow.  
**User intent:** Earlier “minimalistic on details” corrected by the owner to “we're just not going hard core in the details”; research Tom Cartos Patreon work for inspiration. **Do not interpret as bare, abstract or empty rooms.**

## Access and research scope
Reviewed **publicly visible previews and gallery listings** across Tom Cartos's website and linked public Patreon posts. This is a **representative cross-category survey**, not a claim to have accessed every patron-only image or all archive maps. The full Patron master library contains gated content. Tom describes an architectural/design background and an emphasis on immersive, story-supporting, multi-level locations:
- Creator/Patreon overview: https://www.patreon.com/tomcartos/about
- Map gallery index: https://www.tomcartos.com/map-gallery
- Official Foundry creator page: https://foundryvtt.com/creators/tomcartos/
- Open map license: https://www.tomcartos.com/toms-open-map-license (the license has terms; this study authorizes neither republishing his maps nor importing his assets).
  
### Closest public exemplars, observed design lessons
| Source | Relevant public gallery | Applicable inference |
|---|---|---|
| Essenheim Manor | https://www.tomcartos.com/essenheim-manor | Clear permanent masonry/room topology, restrained functional furniture, distinct but readable floor materials; multi-level and night/clean options. |
| Gothic Mansion | https://www.tomcartos.com/gothic-mansion | Room identity through a few obvious props and palette, useful for the cabin's domestic horror. |
| Manor House | https://www.tomcartos.com/manor-house | Coherent scale across residence/upper/basement/roof, rooms legible at VTT zoom. |
| Gilded Dragon Tavern | https://www.tomcartos.com/gilded-dragon-tavern | Basement passages remain understandable even in subdued lighting. |
| Into the Wilds — Forest | https://www.tomcartos.com/into-the-wilds-forest | Trees and ground are stylized enough for reliable tactical readability. |
| Into the Wilds — Winter | https://www.tomcartos.com/into-the-wilds-winter | Snow/mud/environment mix conveyed with strategic ground texture and strong trail/cabin silhouettes rather than dense individual ground marks. |
| Into the Wilds — Caves | https://www.tomcartos.com/into-the-wilds-caves | Tunnel flow and geological mass visible from far zoom. |
| Modern Sewers & Modular Sewers | https://www.tomcartos.com/sewers ; https://www.tomcartos.com/modular-sewers | Aqueduct-style channel borders, pipes, grates, and walkable space stay visibly differentiated; clean/module variants support interactivity. |
| Inn & Bath House | https://www.tomcartos.com/inn-bath-house | Meaningful wet/dry and season/night variants, compact service fixtures in plausible bath-house architecture. |
| Water Temple | https://www.tomcartos.com/water-temple | Pool rims, stone steps and water lines need clear silhouettes; one central puzzle centerpiece can provide the visual focus. |
| Rustic Cottage | https://www.tomcartos.com/rustic-cottage | Family residence dressing without making every surface a detailed illustration. |
| Manor Ruins | https://www.tomcartos.com/essenheim-manor-ruins | Damage/decay becomes storytelling through selected structural changes, not uniform visual clutter. |
| Fey Court | https://www.tomcartos.com/tuath-tennen-fey-court | Seasonal, rain and night options may be separate exports but can also suggest live Foundry effects. |

Cartos publicly offers many `Clean`, `Night`, `Snow`, `Unfurnished`, roof, tile/asset and Foundry variants. The principle for Dicebox is **separation of stable raster art from scene state and engine-managed interaction**. Do not infer that all public/free versions grant unlimited derivative or commercial rights without reading the specific license.

## Proposed art direction: **moderately detailed, story-readable painterly battlemap**

**Interpretation of owner correction:** Do not produce bare schematic/minimalist floorplans for *playable maps*. Include enough furniture, material texture, age, weather and local identity to make players believe the world exists. Omit microscopic texture work that costs production effort without affecting legibility at player zoom.

### Observable quality standard
1. **Spatial readability first:** Top-down 90-degree orthographic, identifiable room/wall/door outlines, narrow representative wall caps, believable feet-scale physical openings, routes and safe arrival areas. Approved Gondian *blueprints* remain geometry references, whereas *playable battlemaps* are fully rendered.
2. **One dominant material per surface:** Wood floorboards visibly read as wood, stone as stones/tiles, dirt as earth and fallen leaves; repeat textures/rhythm naturally. A few knots, splits, moss seams, damp edges and scratches add age. Every board need not have a unique grain.
3. **One or two signature furnishings per room:** Enough to identify the space and convey family history. Add supporting set dressing along boundaries without filling every traversable floor cell. Puzzle fixtures must be independently recognizable at normal tabletop zoom.
4. **Practical tonal contrast:** Warm residual domestic materials (muted brown, tarnished brass, greenish stone) against cold late-fall/early-winter shadows and sparse vegetation. The horror comes from abandonment and select clues, not a permanently unreadable black map.
5. **Visual hierarchy:** Primary encounter/puzzle item > doors and traversal > structural obstacles > secondary dressing > fine texture. Important devices get spatial room to interact and clear geometric shapes.
6. **Outdoor trees:** Truly overhead recognizable crowns with visible ground bases where movement matters. Dense border canopy can frame the scene; clear trails/pads and playable route width must remain visibly open. No 3-D oblique trees or top-down trunk/render mismatch.
7. **Layer separation:** Static architecture and permanent dressing can be rasterized. Collectible items, mutable rewards, lock states, doors, door/portal behaviors, water/flood effects, steam, lighting, sounds and puzzle UI remain individually stateful in Foundry as appropriate. Night or seasonal art variants only for significant geometry/terrain shifts, not minor light changes.
8. **Good Enough acceptance preserved:** Approve a map with moderate stylization if required story fixtures, art content, door/entrance direction, collision geometry and visual legibility all pass. Neither every decoration nor every pixel needs perfection. Reject invented rooms, blocked/relocated routes, warped/mutated landmarks, unreadable interactive mechanisms and wrong water-state geometry.

### Three densities for scene PREPARE (proposed targets, not locked numeric counts)
- **Sparse atmospheric** — forest trails, gazebo approach, Well, Aqueduct shafts: a major landmark, natural edge dressing, visible safe route.
- **Domestic lived-in** — Great Room, bedroom, attic storage, Herbal Room, family areas: convincing basic furnishings and a few meaningful personal objects.
- **Mechanically focused** — Study, Workshop, Waterworks, Bath, Grove Memorial: clean walkable floor surrounding a visually central mechanism with just enough engineering/wear cues to support inspection.

## Campaign-specific application
- **Cabin Foyer:** simple entry flooring, coatrack, clear Great Room and basement doors. No unapproved upward stairs.
- **Great Room:** readable stairs to Upper Landing, family hearth, lockbox/blueprint fixtures; moderate domestic warmth surviving neglect.
- **Upper rooms:** bedroom identities through minimal recognizable furniture; Sophia's six-book puzzle is an in-room compartment, Dahlia's Art Studio upstairs leads to a separately mapped Candle Workshop.
- **Attic:** north/west/east storerooms, centrally accessible three-part Mini-Robo Rufus optional bench, fixed puzzle Winder/Minute Hand/storybook.
- **Basement:** Workshop and separately locked Vault, supply closet as owner-approved; irregular footprint. Sparse machine details establish Gondian use.
- **Forest Maze and Sune's Grove:** distinct spatial groups per accepted references; late-autumn paths and vegetation with clear entrances and no invented connections.
- **Aqueducts:** well WEST, Waterworks/service Southwest per recent owner design, Pond route separate; clear blue-channel and stone-path boundaries, charger as visible engineered landmark.
- **Bathhouse:** compact owner-approved survey, north public entry, northeast Aqueduct service approach, Main Bath with physical drain/mosaic state and lower Reliquary access, Herbal Room retains former Soap Room lye puzzle. Accompanying lower Reliquary remains independently staged.

## Prompt/production policy preserved
- The **project-wide inclusion-only image prompt rule** remains authoritative: **never mention a visual element in a generation prompt if the owner does not want that element present**, even as a negative instruction. Track disallowed additions privately in PREPARE/INSPECT, never in a positive imagegen prompt.
- Fresh independent wording for each redo. Do not use a rejected image's appearance as a generation constraint where it could contaminate the next output.
- Preserve the established Dicebox semantic-render workflow and the cabin-specific FAST/COMPLEX exception; this note is a stylistic research aid, **not a new injector schema, runtime verification, product-stage change or map canon modification**.
- Use Tom Cartos work to learn from **composition and communication**, not to replicate a particular copyrighted layout or export assets without verified permission.

**Next recommended action:** Run one already-approved cabin room (such as the Foyer or Great Room) at *moderate detail* density and judge readability at full map and 5-ft cell zoom; if the owner likes the result, formally add this as a named campaign art-density preset.