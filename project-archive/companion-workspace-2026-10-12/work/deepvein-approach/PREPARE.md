# Deepvein Approach — PREPARE Packet

Status: PREPARED FOR RENDER
Map: 4 / Deepvein Approach
Branch: Northeast / Mineshaft
Scene mapId: deepvein-approach
Canvas: 1536 × 1024, gridless
Runtime: Foundry VTT 14.367 / D&D5e 5.3.3

## Geography and purpose
First worked mining scene outside Blingdenstone. Maintained-to-aging mine approach with rails, timber supports, carts, tool staging, side cuts, and clearly readable worked ore faces. It introduces the mining branch without becoming a linear corridor.

Read southwest-to-northeast:
- southwest: arrival from Blingdenstone Outer Travel Hub Northeast Route;
- center: broad rail staging chamber with cart turnout;
- north and southeast: side cuts with worked ore faces;
- east/northeast: deeper rail passage to Broken Gallery.

Maintain at least two traversable lanes through the main chamber so mining Regions do not block travel.

## Travel
Hub: Blingdenstone — Outer Travel Hub
Hub route key: northeast-route
Forward scene: Broken Gallery
Forward route key: deepvein-broken-gallery

Travel Regions:
- deepvein-arrival-hub
- deepvein-return-hub
- deepvein-arrival-broken-gallery
- deepvein-exit-broken-gallery

Preserve the hub's manual East Route exactly. This map only resolves the approved Northeast route.

## Visual landmarks
- main rail line and broad cart turnout;
- timber support frames with visible age but mostly maintained;
- two or three worked ore faces;
- parked/abandoned ore cart and tool rack;
- damp margin with modest fungal growth;
- clear darker tunnel mouth toward Broken Gallery;
- warm mine lanterns against cool stone.

No baked labels, grid, UI, or technical overlays.

## Interaction Regions

### Ore
Use existing mining system.
- deepvein-ore-face-01 — common worked vein.
- deepvein-ore-face-02 — common worked vein.
- deepvein-ore-face-03 — uncommon/deeper side-cut profile.
Do not define raw-ore rewards outside mining.

### Fishing
None.

### Renewable resources
Per character; reset after long rest.
- deepvein-resource-ironcap-01 — damp support base.
- deepvein-resource-deepmoss-02 — wet wall margin.

### Salvage
Global one-time by default.
- deepvein-salvage-cart-01 — damaged cart fittings / usable hardware.
- deepvein-salvage-tools-02 — abandoned low-value mining tools and rope.

### Single-time discoveries
Global one-time.
- deepvein-discovery-lens-01 — Deep Gnome Prospector's Lens or similar useful survey tool.
- deepvein-discovery-token-02 — Goldwhisker Expedition Token / old mining token.

### Creature harvesting
- deepvein-creature-zone-vermin-01 — damp side cut suitable for encountered mine vermin.
Context only unless an existing harvest interface is identified.

### Environmental opportunities
- deepvein-environment-rail-route-01 — clear cart/rail route usable as a movement or hauling advantage.
- deepvein-environment-staging-02 — stable tool-staging shelf / safe short-rest location.

## Encounter space
The rail staging chamber must accommodate six PCs and several creatures. Side cuts should create flanking choices without forcing a single-file tunnel.

## Economy envelope
Outside mining:
- renewable gathering: about 6–12 gp party-equivalent per long rest;
- one-time salvage/discoveries: about 70–110 gp total sale-equivalent.
Mining is the main recurring value source.

## Persistence
- Mining: existing mining system.
- Renewables: per character, long-rest reset.
- Salvage/discoveries: global one-time.
- Environmental opportunities: reusable.
- Creature harvesting: existing interface if found.

## Injector responsibilities
1. Upsert by mapId deepvein-approach.
2. Apply approved renderer.
3. Upsert only Dicebox-managed Regions by stable IDs above.
4. Preserve all foreign/manual scene state.
5. Configure ore Regions through installed mining interface.
6. Do not invent unsupported non-mining click logic.
7. Link Hub Northeast and Broken Gallery only when destination resolution is unambiguous.
8. Never alter the hub's manual East route.
9. Be rerunnable/idempotent; syntax/integrity checks required.
10. Require live Foundry verification before live-success claims.

## Render acceptance
Top-down 1536 × 1024 gridless mine approach with broad staging chamber, rail turnout, support timbers, carts, three readable ore faces, damp fungus margins, and clear northeast deeper passage. It must feel like an aging but functional deep-gnome mine, not a dungeon corridor.

PREPARE decision: LOCKED. Proceed to RENDER.