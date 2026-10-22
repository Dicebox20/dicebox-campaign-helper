# Cabin in the Ashen Veil — Map Production Locks v1

**Accepted:** 2026-10-22. **Evidence:** Owner explicitly confirmed all four production choices: "(1) neutral lighting preset; (2) state handling rules; (3) baked vs interactive; (4) first batch = Foyer / Great Room / Studio / Study." **Scope:** campaign-only fast-map workflow exception; not a global Dicebox workflow change. This is a production decision/creative contract, not a claim that art, Foundry scenes or Regionwright behaviors have been generated or tested.

## 1 — LOCKED painterly neutral-light preset

- Painterly fantasy battlemap, strictly overhead 90° orthographic, readable ground/furniture silhouettes; approved house Blueprint v1 remains geometry authority.
- **Even, neutral, diffuse illumination in map artwork.** No directional sunbeams, torches/candles/fireplace glow, baked colored light pools, vivid red Veil ambience, colored spell glows, dramatic vignette or artificial darkness that obstructs features. Natural material colors are allowed: brown timber, worn copper, stone gray, Sune rose materials and appropriate pigments; **neutral lighting does not mean gray-only artwork**.
- Mild neutral contact shadows and ambient occlusion are permitted to communicate physical depth, object contact and stair/wall relief. Avoid long directional cast shadows that conflict with Foundry lights.
- Depict lamps, torches, fireplaces, candles, magical fixtures as **physical unlit or neutrally depicted objects** in permanent art; author glow/flicker/colors, time of day, darkness, Crimson Veil overlays, scene ambient light/sound **in Foundry**. If effects depend on changeable light fixtures, capture static fixture semantic IDs in feature manifests.
- Neutral style and correct material visibility are checked in FINAL_INSPECT; a theatrical light pool obscuring a required clue is a **hard blocker**. Harmless slight ambient value variation is a documented cosmetic variance, not REDO.

## 2 — LOCKED state strategy (cheapest technically correct method)

| Change | Default implementation | Example / boundary |
|---|---|---|
| Light / mood / weather / Veil | Foundry ambient lighting, sound, particles/overlays | Crimson Veil red atmosphere **not baked into base painting** |
| Small local visual/object change | Switchable Tile, Token/item representation, visibility/texture or corresponding controlled overlay | Insert Bowl in Sune hands; open Rufus body compartment; reveal recovered lockbox contents; retract bust |
| Traversal, locks, line of sight | Foundry Wall/door/Region state and managed transition behavior | Study lock; hidden Studio door; water/Undercroft access; never rely on raster-only secret opening |
| Major map transformation affecting terrain topology or several physical surfaces | Separate corresponding scene background/stage **when simpler and reliable** | Sune dormant→activated after Bowl **and** pellet; Pond full/drained if traversable bank changes; Bath full/drained |
| Static fixture with changed light but stable geometry | Same background plus Foundry light/particles | Boiler-restored warm Bathhouse uses full-pool art + steam/effect; no independent hot-water painted scene unless visually necessary |

**Sune transition:** Bowl placed shows controlled Bowl asset on dormant shrine; pellet inserted in placed Bowl causes world-state activation, transfer to activated version and active destination routing. A later NW bust Crooked Man chase remains possible on **either relevant map stage**. The old stage cannot become an accidental publicly reachable teleport target.

**Water state:** One canonical sluice-controlled pond-and-bath level state; no independent local overrides. Empty Bath reveals Screwdriver and Rosewater floor-ring hatch; refill covers sealed hatch, dry Boiler escape remains available. Healing only if sluice CLOSED + Bath FULL + Waterworks RESTORED + Boiler solved and water HEATED.

**Implementation caveat:** Logical-scene resolver / multi-player stage teleport and dynamic Region destination rewriting are intended behaviors, **not verified built-in Regionwright features**. Verify adapter and recovery before installation. A Foundry scene's Stage variants add physical scene assets without adding logical geography.

## 3 — LOCKED baked versus interactive policy

**Bake permanently:** fixed walls/floors (without mechanical barriers baked as interaction), permanent furnishings, static art, fixed mechanical surrounds, static unlit lantern/fireplace fixture, permanently present large reference landmark. Static clue **holders** may be painted if not meant to disappear (blueprint table, lockbox cabinet, Rufus head/eye sockets).
**Keep independent:** portable quest keys/eyes/objects; filled Dust pellet; removable Scrying Bowl; grand clock Hour Hand; lockbox contents; valuables; item rewards; actual placed/removable book; switchable ring segments; secret-door visual coverings or alternate opened states; water/steam/light overlays; puzzle-dependent relief or architectural transformations.
**Mixed-case:** The *body* of a lockbox, bookcase, altar, vanity, Rufus, grandfather clock or plinth may be baked, while its **lid/panel, inserted piece, removable reward, hidden door or stateful visual** is a managed overlay/placeable. Paintings/handouts can be permanent art anchors, but player-readable `027` and erased Studio drawings must also be available through a separate readable inspection view. When in doubt, choose independent stateful representation only if gameplay requires a different appearance; do not split every static decorative prop into expensive tiles.

**Inspection hard gates:** puzzle and story objects clearly recognizable from overhead; removable items not permanently present in post-loot state; no premature view of hidden Workshop, Spine room, Undercroft remains, ritual chamber, or inner-face excavation marks. Preserve direct Great Room access to its independent inspectable blueprint.

## 4 — LOCKED first production batch

In this order: **Foyer → Great Room → Dahlia's Art Studio → Allen's Study**.

- [Four concise six-field PREPARE cards](./ashen-veil-fast-batch-01-prepare-cards-2026-10-22.md) inherit [approved House Blueprint v1](./blueprints/house-master-v1-2026-10-22.md) and [coordinates/door IDs](./blueprints/house-master-v1-2026-10-22.json).
- **FAST** for these four under [Fast Map Creation Profile v1](./ashen-veil-fast-map-creation-profile-v1-2026-10-22.md): compact PREPARE + deterministic structural blueprint evidence/check + one neutral-lit painterly generation + one functionality/story FINAL_INSPECT PASS or blocker-specific REDO.
- On real `REDO`, independently rewrite the entire image prompt from accepted source requirements; never patch/rephrase/reuse the previous rejected prompt/image. Do not demand subjective aesthetic perfection.
- The paper blueprint found in Great Room is a **separate player-facing handout derived from true GM/master architecture** and deliberately altered near Art Studio's east wall; this does not alter source geometry.

## Acceptance and verified-production boundaries

The art inspector may PASS with documented *harmless* decorative discrepancies, but never waive architectural continuity, significant navigation, portals, spatial clearance, scene-state consistency, mandatory story cues or spoiler safety. `FINAL_INSPECT PASS` approves exact art without a separate owner checkpoint. Build/inject/verify still require original Foundry authority/validator gates, and the campaign FAST exception may need an adapter for automated structural evidence; a missing validator is not an implied PASS.

**Next authorized step:** Execute minimal PREPARE for Foyer (and related three-card batch), then accepted blueprint/manifest-backed painterly production when tooling can meet requirements. No map render was created as part of this lock.
