# Fossil Deeps — PREPARE Packet

Status: PREPARED FOR RENDER
Map: 3 / Fossil Deeps
Branch: Northwest / Shimmerdeep Reach terminal
Scene mapId: fossil-deeps
Canvas: 1536 × 1024, gridless
Runtime: Foundry VTT 14.367 / D&D5e 5.3.3

## Geography and purpose
Older limestone cavern focused on natural history, fossil beds, shell impressions, calcified remains, mineral pockets, and ancient water-cut stone. It is not a tomb and not a story dungeon.

Read west-to-east:
- west: arrival/return passage to Cascade Hollows;
- center: broad fossil-floor chamber with exposed strata and open encounter space;
- north: raised dry fossil shelf and shell-impression wall;
- south: old water-cut trench with a small remnant seep pool;
- east/northeast: terminal exploration shelves and mineral pockets with no mandatory forward route.

Traversal is mostly dry. The old watercourse creates elevation and visual interest without dividing the map.

## Travel
Previous: Cascade Hollows
Route key: cascade-fossil-deeps
Terminal map: no forward route required.

Travel Regions:
- fossil-arrival-cascade
- fossil-return-cascade

Resolve Cascade only by approved stable metadata first or exact approved name second. Never guess UUIDs.

## Visual landmarks
- broad limestone fossil bed with readable shell/trilobite impressions;
- raised northern strata shelf;
- ancient dry water-cut channel;
- one small pale-blue seep pool;
- calcified nest/egg formation;
- agate/geode-bearing wall pocket;
- sparse pale fungi/lichen;
- dry open central floor for party movement.

No graves, sarcophagi, ruins, labels, grid, UI, or technical overlays.

## Interaction Regions

### Ore
No dedicated mining vein. Small mineral specimens are exploration discoveries only, not raw ore.

### Fishing
One light fishing area only because the remnant seep supports it:
- fossil-fishing-seep-01 — small seep pool, common, biome underdark.
Use installed regionwright-fishing API.

### Renewable resources
Per character; reset after long rest.
- fossil-resource-ghostlichen-01 — pale wall growth.
- fossil-resource-stonebread-02 — dry shelf fungus.
- fossil-resource-deepmoss-03 — damp seep margin.

### Salvage
Global one-time by default.
- fossil-salvage-survey-kit-01 — abandoned geological survey kit / specimen wrapping.

### Single-time discoveries
Global one-time.
- fossil-discovery-trilobite-01 — Pristine Trilobite Fossil.
- fossil-discovery-shellbed-02 — high-quality Shell Fossil / Deep-Coral Fossil specimen.
- fossil-discovery-agate-03 — Perfect Agate Geode or equivalent specimen.
- fossil-discovery-egg-04 — Calcified Cave Egg.
- fossil-puzzle-fragment-01 — puzzle fragment for the 15-map set.

Puzzle fragment should be away from the direct return route and reward full-branch exploration. Negligible sale value.

### Creature harvesting
- fossil-creature-zone-scuttlers-01 — dry fossil shelf / crevice zone for encountered cave arthropods or similar creatures.
Context only unless an existing harvest interface is positively identified.

### Environmental opportunities
- fossil-environment-strata-01 — geological reading / information advantage from exposed layers.
- fossil-environment-dry-overlook-02 — safe elevated staging point.

## Encounter space
Central fossil floor must fit six PCs plus several creatures. Keep fossil details mostly at edges and shelves so the scene remains usable.

## Economy envelope
Outside fishing:
- renewable gathering: about 10–18 gp party-equivalent per long rest;
- one-time discoveries + salvage: about 120–180 gp total sale-equivalent;
- puzzle fragment: negligible sale value.
Value should come from curios/specimens and keep-vs-sell choices, not raw ore.

## Persistence
- Fishing: existing fishing system.
- Renewables: per character, long-rest reset.
- Salvage/discoveries/puzzle: global one-time.
- Environmental opportunities: reusable.
- Creature harvesting: existing interface if found; otherwise no invented semantics.

## Injector responsibilities
1. Upsert scene by mapId fossil-deeps.
2. Apply approved renderer.
3. Upsert only Dicebox-managed Regions by stable IDs above.
4. Preserve unrelated/manual Regions, walls, lights, drawings, tokens, notes, tiles, and other scene state.
5. Configure seep fishing through installed fishing API.
6. Keep unsupported non-fishing interactions as managed placeholders.
7. Link Cascade only when destination resolution is unambiguous.
8. Be rerunnable/idempotent and pass syntax/integrity checks.
9. Require live Foundry verification before live-success claims.

## Render acceptance
Top-down 1536 × 1024 gridless limestone cavern. West Cascade passage, broad central fossil chamber, raised fossil shelf, dry water-cut trench, small seep pool, calcified formation, mineral pocket, sparse pale fungi, open encounter space. Natural-history tone only. No tomb architecture, labels, grid, UI, or overlays.

PREPARE decision: LOCKED. Proceed to RENDER.