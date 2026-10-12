# Blackglass Delve — PREPARE Packet

Status: PREPARED FOR RENDER
Map: 6 / Blackglass Delve
Branch: Northeast / Mineshaft terminal
Scene mapId: blackglass-delve
Canvas: 1536 × 1024, gridless
Runtime: Foundry VTT 14.367 / D&D5e 5.3.3

## Geography and purpose
Deepest mine scene in the Northeast branch. Dark glossy mineral bands, rare deposits, abandoned deep workings, survey remnants, and high-value discoveries. It is the branch's richest scene, but not an unlimited jackpot farm.

Read west-to-east/depth:
- west: arrival from Broken Gallery;
- center: broad deep-working chamber with blackglass bands;
- north: rare-deposit cut and old survey station;
- south: abandoned deep tool/cache pocket;
- east: terminal blackglass shelf / natural fault with no mandatory forward route.

The main chamber remains broad enough for exploration and encounter play.

## Travel
Previous: Broken Gallery
Route key: broken-gallery-blackglass
Terminal map: no forward route required.

Travel Regions:
- blackglass-arrival-broken
- blackglass-return-broken

## Visual landmarks
- glossy black mineral bands with reflective surfaces;
- deep worked ore cuts;
- abandoned survey station / measuring frame;
- one collapsed side working;
- sparse cold crystal light balanced by old amber lamps;
- terminal fault shelf with visual depth;
- no supernatural architecture required.

## Interaction Regions

### Ore
Use existing mining system. Rare outcomes remain inside mining.
- blackglass-ore-deep-01 — uncommon deep vein.
- blackglass-ore-deep-02 — uncommon/rare-profile vein if supported by existing mining data.
- blackglass-ore-deep-03 — common/uncommon secondary face.
Do not duplicate mining loot in exploration rewards.

### Fishing
None.

### Renewable resources
Per character; reset after long rest.
- blackglass-resource-ghostlichen-01 — cold dark wall growth.
- blackglass-resource-dreamcap-02 — sheltered abandoned cut, modest quantity.

### Salvage
Global one-time by default.
- blackglass-salvage-survey-01 — abandoned deep survey equipment.
- blackglass-salvage-toolcache-02 — sealed maintenance/tool cache.

### Single-time discoveries
Global one-time.
- blackglass-discovery-hammer-01 — Surveyor's Resonance Hammer.
- blackglass-discovery-compass-02 — Cartographer's Crystal Compass or comparable useful survey device.
- blackglass-discovery-gem-03 — Uncut Star Sapphire / valuable non-ore gemstone specimen.
- blackglass-puzzle-fragment-01 — puzzle fragment for the 15-map set.

Puzzle fragment should be off the direct mining route and reward examination of the terminal fault/survey area. Negligible sale value.

### Creature harvesting
- blackglass-creature-zone-deepcut-01 — abandoned deep cut for encountered subterranean creatures.
Context only unless existing harvest interface is identified.

### Environmental opportunities
- blackglass-environment-resonance-01 — blackglass formation that can reveal acoustic/structural information or a temporary exploration advantage.
- blackglass-environment-safe-ledge-02 — defensible dry ledge / staging point.

## Encounter space
Keep the main deep-working chamber open for six PCs plus several creatures. Side cuts create tactical options without forcing combat.

## Economy envelope
Outside mining:
- renewable gathering: about 8–15 gp party-equivalent per long rest;
- one-time salvage/discoveries: about 170–240 gp total sale-equivalent;
- puzzle fragment: negligible sale value.
High-value discoveries should favor useful keep-vs-sell choices. Mining remains the recurring value engine.

## Persistence
- Mining: existing mining system.
- Renewables: per character, long-rest reset.
- Salvage/discoveries/puzzle: global one-time.
- Environmental opportunities: reusable.
- Creature harvesting: existing interface if found.

## Injector responsibilities
1. Upsert scene by mapId blackglass-delve.
2. Apply approved renderer.
3. Upsert only Dicebox-managed Regions above.
4. Preserve all foreign/manual scene state.
5. Configure ore through installed mining interface only.
6. Keep unsupported interactions as managed placeholders.
7. Link Broken Gallery only on unambiguous resolution.
8. Be rerunnable/idempotent and pass syntax/integrity checks.
9. Require live Foundry verification before live-success claims.

## Render acceptance
Top-down 1536 × 1024 gridless deep mine with broad chamber, glossy black mineral bands, three readable worked faces, abandoned survey station, old cache pocket, terminal fault shelf, cold crystal light, and sparse warm lamps. Dark and valuable, but not magical-palace architecture.

PREPARE decision: LOCKED. Proceed to RENDER.