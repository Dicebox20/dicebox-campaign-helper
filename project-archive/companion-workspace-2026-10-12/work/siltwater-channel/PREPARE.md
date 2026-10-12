# Siltwater Channel — PREPARE Packet

Status: PREPARED FOR RENDER
Map: 7 / Siltwater Channel
Branch: West Waterway
Scene mapId: siltwater-channel
Canvas: 1536 × 1024, gridless
Runtime: Foundry VTT 14.367 / D&D5e 5.3.3

## Geography and purpose
Navigable underground stream/channel with shallow banks, silt bars, low ledges, damp walls, and a clear aquatic identity. This is the fishing branch introduction, but non-fishers must still have useful gathering and exploration options.

Read east-to-west/deeper:
- east: arrival from Blingdenstone Outer Travel Hub West Waterway Route;
- center: broad winding channel with alternating shallow banks;
- north: silt/clay bar and damp resource shelf;
- south: drifted debris pocket / washed-up salvage;
- west: widening downstream passage toward Shellwater Basin.

Foot travel remains possible along banks/ledges; water must not force swimming to cross the map.

## Travel
Hub: Blingdenstone — Outer Travel Hub
Hub route key: west-waterway-route
Next: Shellwater Basin
Forward route key: siltwater-shellwater

Travel Regions:
- siltwater-arrival-hub
- siltwater-return-hub
- siltwater-arrival-shellwater
- siltwater-exit-shellwater

Do not modify any unrelated hub route, especially the manual East route.

## Visual landmarks
- winding underground stream with shallow turquoise/blue-green water;
- several broad silt bars;
- low rocky bank paths;
- damp lichen/moss walls;
- washed-up crate/rope debris;
- small shell/mussel bed;
- downstream widening toward Shellwater Basin;
- subtle amber route lanterns near the hub-side entry only.

## Interaction Regions

### Ore
No dedicated mining vein.

### Fishing
Use installed regionwright-fishing API, biome underdark.
- siltwater-fishing-east-01 — calm entry-side pool, common.
- siltwater-fishing-mid-02 — central current edge, uncommon.
- siltwater-fishing-west-03 — downstream deeper pocket, uncommon.

### Renewable resources
Per character; reset after long rest.
- siltwater-resource-clay-01 — broad silt/clay bar.
- siltwater-resource-ghostlichen-02 — damp north wall.
- siltwater-resource-deepmoss-03 — shaded ledge.
- siltwater-resource-mussels-04 — shell/mussel edge; material gathering only, not ordinary fishing rewards.

### Salvage
Global one-time by default.
- siltwater-salvage-driftcrate-01 — washed-up container with rope, hooks, waxed cloth, small expedition supplies.
- siltwater-salvage-tackle-02 — old snagged tackle/line hardware.

### Single-time discoveries
Global one-time.
- siltwater-discovery-token-01 — old expedition/ferry token or stamped deep-gnome route marker.
- siltwater-discovery-shell-02 — unusual mineral-coated shell specimen.

### Creature harvesting
- siltwater-creature-zone-bank-01 — shallow-bank zone for encountered cave crabs/eels or similar water-edge creatures.
Context only unless existing harvest interface is identified.

### Environmental opportunities
- siltwater-environment-drybank-01 — reliable dry bank / safe staging point.
- siltwater-environment-current-02 — readable current/ledge shortcut that grants a temporary travel/positioning advantage without being mandatory.

## Encounter space
Central channel bend plus adjacent banks must support six PCs and several creatures. Preserve enough dry area for non-swimming encounters.

## Economy envelope
Outside fishing:
- renewable gathering: about 16–26 gp party-equivalent per long rest;
- one-time salvage/discoveries: about 60–100 gp total sale-equivalent.
Fishing is the dominant recurring value.

## Persistence
- Fishing: existing fishing system.
- Renewables: per character, long-rest reset.
- Salvage/discoveries: global one-time.
- Environmental opportunities: reusable.
- Creature harvesting: existing interface if found.

## Injector responsibilities
1. Upsert scene by mapId siltwater-channel.
2. Apply approved renderer.
3. Upsert only Dicebox-managed Regions above.
4. Preserve all foreign/manual scene state.
5. Configure fishing through installed fishing API.
6. Do not invent unsupported gathering click logic.
7. Link Hub West Waterway and Shellwater Basin only when destination resolution is unambiguous.
8. Never alter the hub's manual East route.
9. Be rerunnable/idempotent and pass syntax/integrity checks.
10. Require live Foundry verification before live-success claims.

## Render acceptance
Top-down 1536 × 1024 gridless underground channel with winding water, dry bank paths, silt bars, damp growths, washed-up debris, shell edge, and a visibly widening westward/downstream exit. Strong fishing identity without making the scene water-only.

PREPARE decision: LOCKED. Proceed to RENDER.