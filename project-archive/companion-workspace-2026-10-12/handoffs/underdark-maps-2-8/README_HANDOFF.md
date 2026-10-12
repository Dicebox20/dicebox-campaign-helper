# Dicebox Campaign Helper — Underdark Gathering Maps 2–8 Handoff

## Assignment

This handoff is for a parallel ChatGPT/Codex workstream. It owns **Maps 2–8** of the 15-map Blingdenstone Underdark exploration network. Map 1, **Shimmerdeep Shelf**, is already staged and is included as the implementation/style reference. Maps 9–15 remain outside this handoff unless the Foreman explicitly reassigns them.

**Assigned maps:**

2. Cascade Hollows
3. Fossil Deeps
4. Deepvein Approach
5. Broken Gallery
6. Blackglass Delve
7. Siltwater Channel
8. Shellwater Basin

The job is **map setup for Dicebox Campaign Helper / Beyond the Realms in Foundry VTT**, not Regionwright development. Do not create another gameplay module.

## Runtime and implementation boundary

Target runtime is **Foundry VTT 14.367 / D&D5e 5.3.3**. Build each map with **native Foundry Regions + Dicebox injection macros**. Existing fishing/mining systems may be integrated with, but do not modify them unless the Foreman explicitly authorizes an interface correction.

Every map should be independently installable/rerunnable. Stable IDs, safe reruns, foreign/manual-state preservation, and honest evidence labels are mandatory. Never claim a map is live until Foundry runtime verification proves it.

Use **1536 × 1024, gridless** as the default scene canvas for these exploration maps unless a PREPARE pass establishes a concrete reason to vary it. Artwork must contain no grid, text labels, region overlays, UI panels, or baked-in technical annotations.

## Global exploration system

Seven interaction categories are in scope:

1. **Ore Nodes** — mining minigame.
2. **Fishing Areas** — fishing minigame.
3. **Renewable Resource Areas** — mushrooms, moss, herbs, silk, salts, clay, etc.
4. **Salvage / Scavenge Sites** — abandoned equipment and useful materials.
5. **Single-Time Discoveries** — visible items, hidden stashes, fossils, curios, useful/high-value finds.
6. **Creature Harvesting** — materials obtained from encountered creatures.
7. **Environmental Opportunities** — safe spots, shortcuts, information, temporary advantages, environmental interactions.

### Persistence rules

- Repeatable natural-resource Regions are **per character** and reset after a **long rest**.
- One player harvesting a renewable Region does not consume it for the other five players.
- Unique discoveries are normally **global one-time**.
- Salvage sites may be renewable or one-time according to their PREPARE design.
- Raw ore comes from the mining system, not generic exploration loot.
- Fishing rewards come from the fishing system unless an item is explicitly a unique non-fishing discovery.
- Mining and fishing each support up to **10 uses per long rest** under their respective systems.
- The approved mining concept is: visible clickable deposit, pickaxe required, Athletics determines extraction, five attempts before a vein is depleted. Do not import the discarded prototype yield table as canon.

## Economy target

The six-player party should be able to earn about **4,000 gp total over roughly seven long rests** across the whole exploration network. That averages roughly 570 gp per party/rest, but **do not force every map to pay the same amount**.

Balance the full network. Mining/fishing, renewable gathering, salvage, and one-time discoveries should all matter. Avoid a single optimal farming circuit. Valuable discoveries should sometimes create a real **keep vs. sell** choice by having a useful function. Humorous finds are encouraged in moderation.

## Puzzle layer

Across all 15 maps, scatter **6–8 unique one-time puzzle fragments**. They should have negligible sale value and visibly/thematically belong to one set. Completing the set eventually produces a strong **party-level reward**. Shimmerdeep Shelf already reserves **Puzzle Fragment — Shimmerdeep Piece** as one fragment. Do not finalize the completed artifact without Foreman approval.

## Hub authority

The existing scene is **Blingdenstone — Outer Travel Hub**, stable mapId `blingdenstone-outer-travel-hub`.

Current hub route inventory:

- Blingdenstone Gate
- Northwest Route
- Northeast Route
- **East Route — manually added by the user; preserve it exactly**
- Southeast Route
- Southern Route
- West Waterway Route

The manually added East teleport/arrival pair is authoritative foreign/manual state. Never recreate or overwrite it.

Teleport linking rule: resolve destinations by approved stable metadata first and exact approved name second. If zero or multiple safe matches exist, leave the teleport unlinked and report it. Never guess a destination UUID.

## Reference: Map 1 — Shimmerdeep Shelf

Map 1 is staged, not yet live-verified.

- Scene: `Shimmerdeep Shelf`
- mapId: `shimmerdeep-shelf`
- 1536 × 1024, gridless
- Branch: Northwest / Shimmerdeep Reach
- Return route to Hub uses routeKey `northwest-route`
- Forward route toward Map 2 uses routeKey `shimmerdeep-cascade`
- Final renderer SHA-256: `db49047bb5237e32a0d72d09b001787c629c134d7af35285121bf8adf08d6a2f`
- Two fishing Regions use the existing `regionwright-fishing` API with biome `underdark`; West Shallows = common, Lower Blue Pool = uncommon.
- Non-fishing Regions were staged as managed placeholders while the native/module-free interaction contract is being validated.

Canonical Shimmerdeep Region IDs include:

- `shimmerdeep-arrival-northwest-hub`
- `shimmerdeep-return-northwest-hub`
- `shimmerdeep-arrival-cascade`
- `shimmerdeep-exit-cascade`
- `shimmerdeep-ore-iron-01`
- `shimmerdeep-fishing-west-01`
- `shimmerdeep-fishing-lower-02`
- `shimmerdeep-resource-ironcap-01`
- `shimmerdeep-resource-deepmoss-02`
- `shimmerdeep-resource-glowcap-03`
- `shimmerdeep-salvage-basket-01`
- `shimmerdeep-discovery-fossil-01`
- `shimmerdeep-discovery-agate-02`
- `shimmerdeep-puzzle-fragment-01`
- `shimmerdeep-creature-zone-crab-01`
- `shimmerdeep-environment-rest-01`

A complete staged Shimmerdeep build is included in this handoff as `Shimmerdeep_Shelf_BUILD_REFERENCE.zip`. Use it as a reference for the injector shape, not as proof of live runtime success.

## Visual references included

`visual_references/01_Blingdenstone_Outer_Travel_Hub.png`

- Canonical visual identity for the hub: communal travel/staging area, fortified but not grand, warm lanterns, supply stalls, rails, ropes/crates, glowing crystals/fungi, multiple exits.

`visual_references/02_Shimmerdeep_Shelf_APPROVED_RENDER.png`

- Approved visual/style reference for the first gathering map: top-down cavern, glowing teal water, multiple shelf elevations, crystals/fungi, amber work lights, broad traversable platforms. Use as the strongest visual reference for Maps 2–3.

`visual_references/03_Cascade_Hollows_VISUAL_REFERENCE_NONCANON.png`

- **NON-CANON concept reference only.** It was generated prematurely before Cascade was fully PREPARED. It is useful for the desired waterfall/pool/crystal/fungus mood but must not dictate geometry, Region placement, or final map art. PREPARE Cascade first, then render a new clean image.

## Required workflow for every assigned map

### 1. PREPARE

Do this before rendering or coding. Lock:

- purpose and geography
- map branch identity
- previous/next scene connections
- route keys and arrival/exit pairs
- visual landmarks
- traversal and elevation logic
- applicable Ore Nodes
- Fishing Areas
- Renewable Resource Regions
- Salvage/Scavenge Sites
- Single-Time Discoveries
- Creature Harvesting opportunities
- Environmental Opportunities
- puzzle fragment placement if appropriate
- encounter space
- expected recurring and one-time reward value
- per-character vs global depletion
- long-rest reset behavior
- exact injector responsibilities
- stable scene/Region IDs
- foreign/manual-state preservation rules

### 2. RENDER

Generate clean map art only after PREPARE. Inspect the result against the PREPARE packet. Reject art that invents new geography, adds labels/UI, loses required exits, obscures gathering features, or turns the map into a story dungeon.

### 3. BUILD

Produce an idempotent Foundry injection macro/package. Requirements:

- Scene upsert by stable `mapId`.
- Region upsert only for Dicebox-managed Regions by stable `regionId`.
- Preserve unrelated/manual Regions, walls, lights, drawings, tokens, notes, tiles, and other scene state.
- Embed/upload renderer automatically when practical.
- Link teleports only when the destination match is unambiguous.
- Existing fishing Regions should use the installed fishing API, not cloned fishing logic.
- Do not create a new module.
- Do not guess unsupported Region click behavior.
- Syntax/integrity checks before claiming staged success.
- Runtime verification before claiming live success.

## Assigned map plans

### Map 2 — Cascade Hollows

**Branch:** Northwest / Shimmerdeep Reach  
**Identity:** wetter, deeper natural cavern beyond Shimmerdeep Shelf; waterfalls, connected turquoise pools, narrow rock passages, fungal islands, dry shelves, exposed mineral bands, crystal growths.  
**Primary activities:** fishing, renewable gathering, mixed natural discoveries; some modest ore exposure is acceptable but this is not a mine.  
**Travel:** arrive from Shimmerdeep Shelf using routeKey `shimmerdeep-cascade`; provide a safe return; create an obvious forward exit toward Fossil Deeps.  
**Forward route proposal:** `cascade-fossil-deeps`.  
**Important:** the existing non-canon visual is inspiration only. Create a fresh PREPARE geometry and fresh renderer.  
**Resource flavor:** cave fish, pale eels, shellfish, rare luminous fish, freshwater pearls, fungi, medicinal growth, clay/mineral sediment, crystals.  
**Design goal:** a natural waterfall-and-pool cavern with strong aquatic identity while still containing mixed resources.

### Map 3 — Fossil Deeps

**Branch:** Northwest / Shimmerdeep Reach terminal map.  
**Identity:** older limestone cavern, dry shelves mixed with ancient water-cut stone, fossil beds, shell impressions, calcified remains, mineral pockets.  
**Primary activities:** single-time exploration discoveries, fossils/mineral curios, renewable lichen/moss/fungi, light fishing only if geography supports it.  
**Travel:** return to Cascade Hollows using routeKey `cascade-fossil-deeps`. No mandatory forward route; this can be the current Northwest terminus.  
**Resource flavor:** fossils, calcified eggs/nests, unusual mineral specimens, agate/geode discoveries, pale moss, ancient shell beds.  
**Puzzle candidate:** good candidate for another puzzle fragment because it rewards exploring the entire Northwest branch.  
**Tone:** natural history and geological curiosity, not a tomb or story dungeon.

### Map 4 — Deepvein Approach

**Branch:** Northeast / Mineshaft.  
**Identity:** first worked mining map outside Blingdenstone; maintained-to-aging mine approach, rails, timber supports, carts, side cuts, tool staging, obvious worked ore faces.  
**Primary activities:** mining and salvage.  
**Travel:** Hub Northeast Route → Deepvein Approach. Use hub routeKey `northeast-route`; provide return to Hub and forward route to Broken Gallery.  
**Forward route proposal:** `deepvein-broken-gallery`.  
**Resource flavor:** common ore veins, abandoned tools, rails/carts, survey marks, low-value salvage, modest fungus around damp margins.  
**Design goal:** clearly communicate that Northeast is the mining branch without making the scene a linear tunnel.

### Map 5 — Broken Gallery

**Branch:** Northeast / Mineshaft.  
**Identity:** deeper and less maintained workings with cave-ins, partial rail lines, damaged supports, exposed richer ore, abandoned carts/tool caches, alternate routes around collapsed sections.  
**Primary activities:** mining, salvage, environmental opportunities around unstable/blocked terrain.  
**Travel:** return to Deepvein Approach via `deepvein-broken-gallery`; forward to Blackglass Delve.  
**Forward route proposal:** `broken-gallery-blackglass`.  
**Resource flavor:** richer ore faces, mining equipment salvage, old supply caches, support timber/metal scraps, minor fungal growth in wet cracks.  
**Design goal:** exploration and mining choices without requiring a story encounter or mandatory combat.

### Map 6 — Blackglass Delve

**Branch:** Northeast / Mineshaft terminal map.  
**Identity:** deepest mine scene in this branch, darker mineral bands, strange glossy stone, rare deposits, abandoned deep workings, high-value discoveries.  
**Primary activities:** mining, valuable one-time discoveries, environmental hazards/opportunities, salvage.  
**Travel:** return to Broken Gallery via `broken-gallery-blackglass`. No mandatory forward route.  
**Resource flavor:** rare ore outcomes belong to the mining system; exploration finds should be crafted tools, mineral specimens, old surveying devices, caches, or useful curios rather than raw ore bypasses.  
**Puzzle candidate:** strong candidate for another puzzle fragment.  
**Design goal:** highest-value Northeast scene but not an unlimited jackpot farm.

### Map 7 — Siltwater Channel

**Branch:** West Waterway.  
**Identity:** navigable underground stream/channel, shallow banks, silt bars, low ledges, damp cave walls.  
**Primary activities:** fishing, clay/sediment gathering, renewable aquatic-edge resources, small washed-up salvage.  
**Travel:** Hub West Waterway Route → Siltwater Channel using routeKey `west-waterway-route`; return to Hub; forward to Shellwater Basin.  
**Forward route proposal:** `siltwater-shellwater`.  
**Resource flavor:** fish, mussels, clay, ghostlichen/deepmoss, drifted containers, rope/hooks, mineral sediments.  
**Design goal:** strongest introduction to the fishing branch, but still useful to non-fishers.

### Map 8 — Shellwater Basin

**Branch:** West Waterway.  
**Identity:** larger cavern basin with broad pools, shell beds, little rocky islands, washed-up debris, deeper channels.  
**Primary activities:** fishing, aquatic gathering, pearls as fishing outcomes, salvage/debris, exploration discoveries.  
**Travel:** return to Siltwater Channel via `siltwater-shellwater`; create forward exit toward Map 9 Drowned Reach but leave it unlinked until Map 9 exists.  
**Forward route proposal:** `shellwater-drowned-reach`.  
**Resource flavor:** aquatic life, mussels/shellfish, valuable catches, submerged/washed-up salvage, strange shells/mineral-coated specimens.  
**Puzzle candidate:** good candidate for a fragment hidden away from the obvious fishing route.  
**Boundary:** do not build Drowned Reach in this workstream unless Foreman reassigns Map 9.

## Known item/reward families

Renewables already discussed: Ironcap Cluster, Glowcap Bundle, Deepmoss Poultice/medicinal moss, Cave Pepper Fungus, Nosewhistle Puffball, Stonebread Shelf, Dreamcap, Ghostlichen, Cave Clay, Salamander Salt, Spider Silk Bundle.

Single-time discovery ideas already discussed: Fossil Specimen, Pristine Trilobite Fossil, Shell Fossil, Deep-Coral Fossil, Perfect Agate Geode, unusual mineral specimen, Shimmerdeep Crystal Cluster, Resonant Crystal Nodule, Deep Gnome Prospector’s Lens, Surveyor’s Resonance Hammer, Masterwork Folding Pick, Cartographer’s Crystal Compass, Stone-Speaker’s Chime, Uncut Star Sapphire, Petrified Mushroom Crown, Bottle of Ancient Cave Air, The World’s Most Suspicious Rock, Old Prospector’s Charm, Goldwhisker Expedition Token, Ancient Deep-Gnome Coin Hoard, Calcified Cave Egg, Echo Stone, Pocket-Sized Stalactite.

Do not treat these as a requirement that every item appear. Choose rewards by map identity and economy budget. Keep ore rewards inside mining.

## Status / evidence boundary

- Outer Travel Hub: built previously and used as route authority.
- Shimmerdeep Shelf: renderer and staged injector package exist; **staged, not live-verified**.
- Cascade reference image: **non-canon visual reference only**.
- Maps 2–8: planning assignment; not yet rendered/built unless this receiving workstream does so.

## Completion target for this workstream

Prepare, render, inspect, and build Maps **2–8** route-by-route. Keep each map independently installable and return compact receipts with artifact paths, stable IDs, teleport dependencies, validation results, and any blockers. Do not silently take ownership of Maps 9–15.
