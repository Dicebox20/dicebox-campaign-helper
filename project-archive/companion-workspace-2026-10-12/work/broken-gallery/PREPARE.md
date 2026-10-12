# Broken Gallery — PREPARE Packet

Status: PREPARED FOR RENDER
Map: 5 / Broken Gallery
Branch: Northeast / Mineshaft
Scene mapId: broken-gallery
Canvas: 1536 × 1024, gridless
Runtime: Foundry VTT 14.367 / D&D5e 5.3.3

## Geography and purpose
Deeper, less maintained mine workings with cave-ins, damaged supports, partial rail lines, exposed richer ore, abandoned carts, and alternate routes around collapsed sections. Exploration and mining choices matter; combat is not mandatory.

Read west-to-east:
- west: arrival from Deepvein Approach;
- center: broken rail gallery split by a partial cave-in;
- north: narrow bypass shelf and richer exposed vein;
- south: abandoned cart pocket / salvage area;
- east: darker descent toward Blackglass Delve.

At least two safe routes must exist around the central collapse.

## Travel
Previous: Deepvein Approach
Route key: deepvein-broken-gallery
Next: Blackglass Delve
Forward route key: broken-gallery-blackglass

Travel Regions:
- broken-arrival-deepvein
- broken-return-deepvein
- broken-arrival-blackglass
- broken-exit-blackglass

## Visual landmarks
- fractured rail line disappearing under rubble;
- visibly damaged timber supports;
- central cave-in with two navigable bypasses;
- abandoned cart pocket;
- richer ore bands in north/east walls;
- wet cracks with sparse fungus;
- darker black-stone hints toward the Blackglass exit.

No labels, grid, UI, or technical overlays.

## Interaction Regions

### Ore
Use existing mining system.
- broken-ore-rich-01 — north bypass face, uncommon.
- broken-ore-rich-02 — east wall face, uncommon.
- broken-ore-common-03 — south working face, common.

### Fishing
None.

### Renewable resources
Per character; reset after long rest.
- broken-resource-ironcap-01 — damp collapsed timber area.
- broken-resource-cavepepper-02 — wet crack shelf.

### Salvage
Global one-time by default.
- broken-salvage-cart-01 — abandoned cart hardware and intact fittings.
- broken-salvage-cache-02 — old support/repair cache with rope, spikes, brackets, timber wedges.

### Single-time discoveries
Global one-time.
- broken-discovery-folding-pick-01 — Masterwork Folding Pick or similarly useful tool.
- broken-discovery-supply-case-02 — old sealed mining supply case.

### Creature harvesting
- broken-creature-zone-rubble-01 — rubble pocket suitable for encountered burrowing/scavenging creatures.
Context only unless existing harvest contract is identified.

### Environmental opportunities
- broken-environment-bypass-01 — stable alternate route around the central cave-in.
- broken-environment-supports-02 — damaged support section where careful inspection can reveal a temporary positional/engineering advantage.

## Encounter space
Central broken gallery and southern cart pocket together must provide enough room for six PCs plus several creatures. Bypasses should support movement choices and line-of-sight variation.

## Economy envelope
Outside mining:
- renewable gathering: about 6–12 gp party-equivalent per long rest;
- one-time salvage/discoveries: about 90–140 gp total sale-equivalent.
Mining remains the dominant recurring value.

## Persistence
- Mining: existing mining system.
- Renewables: per character, long-rest reset.
- Salvage/discoveries: global one-time.
- Environmental opportunities: reusable unless implementation requires otherwise.
- Creature harvesting: existing interface if found.

## Injector responsibilities
1. Upsert scene by mapId broken-gallery.
2. Apply approved renderer.
3. Upsert only Dicebox-managed Regions above.
4. Preserve all foreign/manual Regions and scene state.
5. Configure ore through installed mining interface.
6. Keep unsupported interactions as managed placeholders.
7. Link Deepvein and Blackglass only on unambiguous resolution.
8. Be rerunnable/idempotent and pass syntax/integrity checks.
9. Require live Foundry verification before live-success claims.

## Render acceptance
Top-down 1536 × 1024 gridless damaged mine gallery with partial cave-in, two readable bypasses, broken rails, damaged supports, abandoned cart pocket, richer ore bands, and darker eastward descent. Must remain playable and non-linear.

PREPARE decision: LOCKED. Proceed to RENDER.