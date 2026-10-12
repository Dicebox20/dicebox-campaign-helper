# Cascade Hollows — PREPARE Packet

Status: PREPARED FOR RENDER
Map: 2 / Cascade Hollows
Branch: Northwest / Shimmerdeep Reach
Scene mapId: cascade-hollows
Canvas: 1536 × 1024, gridless
Runtime: Foundry VTT 14.367 / D&D5e 5.3.3

## Geography
Natural waterfall-and-pool cavern beyond Shimmerdeep Shelf, not a story dungeon. Read west-to-east:
- west/northwest: arrival from Shimmerdeep Shelf;
- north-central: main waterfall and upper plunge pool;
- center: connected turquoise pools, stepping shelves, fungal islands;
- south-central: lower blue basin with shell/silt margins;
- northeast/east: dry mineral shelf and narrow passage to Fossil Deeps.

Dry shelves, stepping rock, and narrow crossings must form a continuous readable foot route. Water is visually dominant without isolating major playable areas.

## Travel
Previous: Shimmerdeep Shelf
Route key: shimmerdeep-cascade
Next: Fossil Deeps
Forward route key: cascade-fossil-deeps

Travel Regions:
- cascade-arrival-shimmerdeep
- cascade-return-shimmerdeep
- cascade-arrival-fossil-deeps
- cascade-exit-fossil-deeps

Resolve teleports only by approved stable metadata first or exact approved name second. Shimmerdeep may link only if unambiguous. Fossil Deeps stays unlinked until that scene exists unambiguously.

## Visual landmarks
- dominant northern waterfall into luminous turquoise plunge pool;
- broad connected central pool network;
- 2–3 low fungal/rock islands;
- one dry shelf with subtle amber expedition lights;
- exposed mineral band/crystal growth on northeast shelf;
- lower silt/clay bank;
- clearly readable eastern Fossil Deeps passage;
- teal/blue water glow, natural stone, fungi/crystals, warm amber accents.

No grid, labels, UI, Region overlays, technical markings, or baked-in icons.

## Interaction Regions

### Ore
One modest common exposure only; Cascade is not a mine.
- cascade-ore-common-01 — northeast mineral shelf.
Use the existing mining system. Never grant raw ore as generic loot.

### Fishing
Use installed regionwright-fishing API, biome underdark.
- cascade-fishing-plunge-01 — upper plunge pool, common.
- cascade-fishing-channel-02 — central channel/pool, uncommon.
- cascade-fishing-deep-03 — lower deep basin, uncommon.
Existing fishing persistence/use limits remain authoritative.

### Renewable resources
Per character; reset after long rest.
- cascade-resource-glowcap-01 — fungal island; Glowcap Bundle.
- cascade-resource-deepmoss-02 — damp shaded shelf; medicinal/deep moss.
- cascade-resource-clay-03 — lower silt bank; Cave Clay.
- cascade-resource-shellbed-04 — shallow shell edge; modest shell/material gathering, not fishing rewards or pearls.

### Salvage
- cascade-salvage-washup-01 — washed-up explorer/miner debris.
Global one-time by default. Reward flavor: rope, hooks, waterproof wrapping, useful expedition materials. No ore/fishing loot.

### Single-time discoveries
Global one-time.
- cascade-discovery-crystal-01 — Resonant Crystal Nodule or similar useful specimen.
- cascade-discovery-shellcase-02 — unusual shell specimen / old specimen case.
- cascade-discovery-cache-03 — small hidden deep-gnome expedition cache.
No puzzle fragment on Cascade; Fossil Deeps is the Northwest puzzle candidate.

### Creature harvesting
- cascade-creature-zone-crab-01 — shell-rich shallow margin.
Context/opportunity only unless an existing creature-harvest interface is positively identified during BUILD.

### Environmental opportunities
- cascade-environment-dry-shelf-01 — elevated safe staging/rest shelf.
- cascade-environment-waterfall-path-02 — optional shortcut/advantage route beside or behind waterfall shelf.

## Encounter space
Keep the central chamber and at least one dry shelf open enough for six PCs plus several creatures. Avoid turning the map into narrow chokepoints.

## Economy envelope
Outside authoritative mining/fishing systems:
- renewable gathering: about 18–30 gp party-equivalent per long rest;
- one-time discoveries + salvage: about 70–110 gp total sale-equivalent, preferably partly useful keep-vs-sell items.
Mining and fishing values remain governed by their existing systems.

## Persistence
- Fishing: existing system.
- Ore: existing system.
- Renewables: per character, long-rest reset.
- Salvage: global one-time unless BUILD finds a proven reusable salvage contract.
- Discoveries: global one-time.
- Environmental opportunities: reusable unless implementation requires otherwise.
- Creature harvesting: existing contract if found; do not invent one.

## Injector responsibilities
1. Scene upsert by mapId cascade-hollows.
2. Apply approved renderer.
3. Upsert only Dicebox-managed Regions by stable Region IDs above.
4. Preserve unrelated/manual Regions, walls, lights, drawings, tokens, notes, tiles, and scene state.
5. Configure fishing through installed fishing API.
6. Configure ore through installed mining interface if safely discoverable.
7. Unsupported non-fishing interactions remain managed placeholders rather than invented click behavior.
8. Link Shimmerdeep only when safe and unambiguous.
9. Leave Fossil Deeps forward link unresolved until safe.
10. Independently rerunnable/idempotent.
11. Syntax/integrity checks before staged-success claims.
12. Live Foundry verification before live-success claims.

## Render acceptance
Accept only a clean top-down 1536 × 1024 gridless map with west entry, east/northeast exit, dominant northern waterfall, connected turquoise pools, continuous dry traversal, fungal islands, lower silt/clay edge, modest mineral shelf, and open encounter space. Match Shimmerdeep's natural teal-water/crystal/fungus/amber-light language. Reject labels, grid, UI, overlays, story-dungeon architecture, or invented geometry that blocks the route.

PREPARE decision: LOCKED. Proceed to RENDER.
