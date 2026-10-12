# Shellwater Basin — PREPARE Packet

Status: PREPARED FOR RENDER
Map: 8 / Shellwater Basin
Branch: West Waterway
Scene mapId: shellwater-basin
Canvas: 1536 × 1024, gridless
Runtime: Foundry VTT 14.367 / D&D5e 5.3.3

## Geography and purpose
Larger cavern basin with broad pools, shell beds, small rocky islands, washed-up debris, and deeper channels. It expands the fishing branch into a mixed aquatic gathering/exploration scene.

Read east-to-west/deeper:
- east: arrival from Siltwater Channel;
- center: broad basin with two main pools and island stepping shelves;
- north: shell/mussel beds and shallow gathering margins;
- south: washed-up debris and salvage pocket;
- west/northwest: deeper dark channel leading toward Map 9 Drowned Reach.

Dry island/shelf traversal must remain continuous enough for ordinary party movement.

## Travel
Previous: Siltwater Channel
Route key: siltwater-shellwater
Future: Drowned Reach
Forward route key: shellwater-drowned-reach

Travel Regions:
- shellwater-arrival-siltwater
- shellwater-return-siltwater
- shellwater-arrival-drowned-reach
- shellwater-exit-drowned-reach

Drowned Reach forward link must remain unlinked until Map 9 exists and resolves unambiguously. Do not build Map 9 in this workstream.

## Visual landmarks
- broad turquoise basin with at least two connected water depths;
- several low rocky islands / stepping shelves;
- extensive shell/mussel bed;
- one visually deeper dark-blue channel;
- washed-up debris pocket;
- mineral-coated shell formations;
- pale aquatic-edge fungi/lichen;
- clearly readable west/northwest Drowned Reach channel.

## Interaction Regions

### Ore
No dedicated mining vein.

### Fishing
Use installed regionwright-fishing API, biome underdark.
- shellwater-fishing-east-01 — entry-side shallows, common.
- shellwater-fishing-basin-02 — central basin, uncommon.
- shellwater-fishing-deep-03 — deep channel, uncommon.
- shellwater-fishing-islands-04 — island edge pocket, common/uncommon as supported by existing profiles.
Pearls and valuable catches remain fishing-system outcomes.

### Renewable resources
Per character; reset after long rest.
- shellwater-resource-mussels-01 — shell/mussel bed, material gathering only.
- shellwater-resource-deepmoss-02 — damp island edge.
- shellwater-resource-clay-03 — basin silt pocket.
- shellwater-resource-salt-04 — mineral/salt crust pocket if visually supported; use Salamander Salt family only if consistent with existing item definitions.

### Salvage
Global one-time by default.
- shellwater-salvage-debris-01 — washed-up expedition debris.
- shellwater-salvage-submerged-02 — shallow submerged container / tackle cache accessible from shore.

### Single-time discoveries
Global one-time.
- shellwater-discovery-shell-01 — unusual mineral-coated shell specimen.
- shellwater-discovery-cache-02 — small submerged/washed-up deep-gnome cache.
- shellwater-discovery-crystal-03 — water-polished crystal or Echo Stone specimen.
- shellwater-puzzle-fragment-01 — puzzle fragment for the 15-map set.

Puzzle fragment should be hidden away from the obvious fishing circuit, ideally on an out-of-the-way island or shell shelf. Negligible sale value.

### Creature harvesting
- shellwater-creature-zone-islands-01 — island/shallow margin for encountered aquatic-edge creatures.
Context only unless existing harvest interface is identified.

### Environmental opportunities
- shellwater-environment-island-refuge-01 — defensible dry island / safe staging point.
- shellwater-environment-deepchannel-02 — readable current/depth clue that can grant navigation or fishing-position insight without bypassing the fishing system.

## Encounter space
Central island/basin area must allow six PCs plus several creatures with mixed dry and shallow-water positioning.

## Economy envelope
Outside fishing:
- renewable gathering: about 18–30 gp party-equivalent per long rest;
- one-time salvage/discoveries: about 100–160 gp total sale-equivalent;
- puzzle fragment: negligible sale value.
Fishing remains the main recurring value and pearls stay inside fishing.

## Persistence
- Fishing: existing fishing system.
- Renewables: per character, long-rest reset.
- Salvage/discoveries/puzzle: global one-time.
- Environmental opportunities: reusable.
- Creature harvesting: existing interface if found.

## Injector responsibilities
1. Upsert scene by mapId shellwater-basin.
2. Apply approved renderer.
3. Upsert only Dicebox-managed Regions above.
4. Preserve all foreign/manual scene state.
5. Configure fishing through installed fishing API.
6. Do not duplicate fishing rewards in exploration loot.
7. Link Siltwater only when unambiguous.
8. Leave Drowned Reach forward teleport safely unlinked until Map 9 exists unambiguously.
9. Be rerunnable/idempotent and pass syntax/integrity checks.
10. Require live Foundry verification before live-success claims.

## Render acceptance
Top-down 1536 × 1024 gridless basin with broad pools, low rocky islands, shell beds, deeper channel, washed-up debris, continuous dry traversal, and clear west/northwest route toward Drowned Reach. Aquatic and expansive, but still usable by non-fishers.

PREPARE decision: LOCKED. Proceed to RENDER.