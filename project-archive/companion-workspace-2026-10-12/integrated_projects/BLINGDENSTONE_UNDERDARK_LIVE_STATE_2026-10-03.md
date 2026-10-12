# Blingdenstone / Underdark live-state reconciliation — 2026-10-03

## Scope and evidence boundary

This document reconciles the successful Blingdenstone / Underdark work performed against the live Foundry world `the-forgotten-realms` on Foundry VTT 14.367 / D&D5e 5.3.3. It combines read-only LevelDB snapshots, completed runtime diagnostics/receipts supplied in the working conversation, and generated project artifacts. Facts marked **live-verified** were reread from the current world database during this reconciliation. Facts marked **diagnostic-verified** come from a completed diagnostic or verification receipt. Generated-but-not-executed macros are explicitly not promoted to live success.

## Fifteen-map exploration set — live-verified

All 15 exploration Scenes resolve by stable `mapId` / exact Scene identity. Current live Scene IDs are:

| # | Map | mapId | Scene ID | Regions | Fishing | Mining |
|---|---|---|---|---:|---:|---:|
| 1 | Shimmerdeep Shelf | `shimmerdeep-shelf` | `kQCQBA6HV1OJSVV9` | 16 | 2 | 1 |
| 2 | Cascade Hollows | `cascade-hollows` | `FOP6lUmKv07ReHms` | 19 | 3 | 1 |
| 3 | Fossil Deeps | `fossil-deeps` | `RPPDHrnMqxteQakp` | 15 | 1 | 0 |
| 4 | Deepvein Approach | `deepvein-approach` | `hsABhipN3QBh08a8` | 16 | 0 | 3 |
| 5 | Broken Gallery | `broken-gallery` | `kTxwcZamvgn1Qgxt` | 16 | 0 | 3 |
| 6 | Blackglass Delve | `blackglass-delve` | `rptSRaiuaRIEl9xs` | 16 | 0 | 3 |
| 7 | Siltwater Channel | `siltwater-channel` | `0jwY5S4y38QpShCn` | 18 | 3 | 0 |
| 8 | Shellwater Basin | `shellwater-basin` | `bIsvqkZ34I6TPesQ` | 23 | 4 | 2 |
| 9 | Drowned Reach | `drowned-reach` | `TFHJUCsXtr6htcml` | 16 | 3 | 0 |
| 10 | Glowcap Warrens | `glowcap-warrens` | `UfFF6oK3KzcYMeLq` | 18 | 2 | 0 |
| 11 | Silkroot Grove | `silkroot-grove` | `Q0f7OmBJWAAGI6MS` | 22 | 3 | 0 |
| 12 | Steamstone Pools | `steamstone-pools` | `S8xxiJ8bp7IvnCsD` | 21 | 2 | 2 |
| 13 | Brimstone Gardens | `brimstone-gardens` | `gYajJL9SRqTkQp5Q` | 21 | 1 | 2 |
| 14 | Forgotten Waystation | `forgotten-waystation` | `zKoROMo2fXugrZAq` | 21 | 0 | 3 |
| 15 | Rubblefield Crossing | `rubblefield-crossing` | `9YP8slvtVvMmUGKO` | 20 | 0 | 4 |

Current aggregate: **15 Scenes, 278 Regions, 252 RegionBehaviors, 24 fishing Regions, 24 mining Regions**.

## Scene visibility and Underdark environment — live-verified

Every exploration Scene currently has:

- `tokenVision = false`
- `fog.mode = 0` (Fog Exploration disabled)
- `environment.darknessLevel = 0.84`
- `environment.darknessLock = true`
- `environment.cycle = false`
- `environment.globalLight.enabled = false`

This is the intended Underdark presentation: dark, locked ambience, no artificial day/night cycle, no global illumination, but the whole map remains viewable because Token Vision and Fog Exploration are disabled.

## Region Levels diagnostic — diagnostic-verified

The dedicated 15-map Region Level diagnostic disproved the hypothesis that the exploration Regions were assigned to the wrong Scene Level. At the time of that diagnostic, **0 Regions were flagged as wrong-Level assignments**. Empty Region `levels` sets were correctly treated as unrestricted across Levels. The interaction failure was instead associated with missing RegionBehaviors and later with click-target permissions/visibility.

## Region visibility policy — current live state

The user selected `Scene.Q0f7OmBJWAAGI6MS.Region.t9b9ZQWoNGhmgViC` as the visual template for hidden Region overlays. That template uses `visibility = GAMEMASTER (1)`, `hidden = false`, and no default player ownership.

A bulk visibility macro successfully applied GM-only visibility to all 278 exploration Regions. Subsequent fishing repair changed all **24 fishing Regions** to the intended invisible-clickable contract:

- Region visibility: `ALWAYS (2)`
- `hidden = false`
- default player ownership: `OBSERVER (2)`
- Regionwright Fishing forces clickable fishing placeables to `alpha = 0.001` while Token Controls are active.

Current live snapshot confirms **24/24 fishing Regions** are `ALWAYS + Observer`.

Mining is only partially repaired. Current live snapshot confirms **24/24 mining Regions** have player Observer ownership but still use `GAMEMASTER (1)` visibility. Regionwright Mining has the same invisible-hitbox design (`alpha = 0.001`) but its click predicate requires Observer permission and its visibility override needs the placeable to survive player visibility. The prior repair macro looked for `miningVein`, while the live module actually stores mining configuration under `flags.regionwright-mining.miningDeposit`. Therefore mining clickability must be re-repaired with the correct flag key and then player-tested.

## Fishing and mining systems — live/diagnostic evidence

- Current live world contains **24 fishing Regions** configured through `regionwright-fishing`.
- Current live world contains **24 mining Regions** configured through `regionwright-mining` using `miningDeposit`.
- The full Blingdenstone long-rest reset reported: `24 mining nodes reset, 24 fishing spots ready, exploration reset.`
- Fishing and mining are mechanical owners of their respective rewards. General exploration logic must not duplicate fishing catches or raw mining ore.

## Teleport network — diagnostic-verified

The 15-map network macro created and verified **15 bidirectional connections / 30 directed teleports** across the approved Northwest, Northeast, West Waterway, and East branches. Verification reported all 30 directions PASS.

The Blingdenstone Outer Travel Hub is Scene `Q82JT7N2wpli0rKR`.

The manually preserved East pair is:

- `Teleport — East Route` — Region `5P9vLZZ2kGF2HW9w`
- `Arrival — East Route` — Region `SZVDGAGvpmNR1oY4`

These lack the stable managed Region metadata used by the generated branches and must be preserved exactly unless explicitly migrated.

### Southeast and Southern routes — unresolved

The hub contains a Southeast pair but no destination was found in the current 15-map network:

- `Teleport — Southeast Route` — Region `MftD9DQDD771BEuo`, stable Region ID `southeast-exit`
- `Arrival — Southeast Route` — Region `c696MkxTcpeCsM0v`
- route key `southeast-route`

Their stored coordinates were authored against a 2048×1536 coordinate space while the current hub artwork is 1448×1086. Their approximate scaled positions on current art are Teleport `(1231, 846, 80×120)` and Arrival `(1158, 836, 78×78)`. No Southeast destination should be guessed. The Southern route is also intentionally unresolved.

## General exploration interaction gap — diagnostic-verified

The earlier diagnostic found a large set of Regions with no RegionBehavior. That is a separate issue from Scene Level assignment. Fishing/mining have dedicated module interaction layers; many general forage, salvage, discovery, creature-harvest, puzzle, and opportunity Regions still require an explicit exploration interaction implementation. Do not solve this by moving Regions between Levels.

## Blingdenstone Exploration Items — diagnostic-verified

Folder `Blingdenstone Exploration Items`:

- root folder ID `BrvexietoHgpksSy`
- 6 folders total: root plus 5 children
- **127 Items**, all type `loot`
- all 127 originally used `systems/dnd5e/icons/svg/items/loot.svg` and therefore needed artwork
- child folders: Creature Harvests (15), Discoveries (42), Puzzle Fragments (10), Renewable Resources (32), Salvage (28)
- one duplicate display name: `Washed-Up Expedition Debris` (two distinct Items)
- exploration Items carry stable metadata under `flags.world.diceboxExploration`, including canonical `itemId`, category, source Region IDs/UUIDs, source Scene, reset policy, quantity formula, rarity, and schema version

**Targeting rule:** future artwork selectors and reward wiring must target `flags.world.diceboxExploration.itemId` first, not Item name. Name-only targeting is unsafe because duplicate names exist.

## Blingdenstone vendors and gathering-contract design — created artifacts, deployment not certified here

Ten-vendor allocation is established:

1. Nimri "Nine-Eyes" Gemcutter — Ruby in the Rough — gems, agates, geodes, pearls, crystals
2. Brannik Flintheel — Deepdelver Outfitters — fish, eels, shellfish, useful waterway catches; not pearls
3. Durnik Coalbrow — Blackstone Forge — raw ore, usable metal, smithing scrap; mining prices authoritative
4. Zibbin Fizztwist — Glitterblind Alchemicals — cave clay, salts, sediment, alchemical reagents
5. Melli Mosscheek — The Spore & Stem — forage, fungi, moss, lichen, herbs
6. Korrin Deepmeasure — Pick & Lantern Mining Supply — specialist survey/mining equipment, not ordinary ore
7. Velka Nackle — Whisperstone Curios — fossils, ancient shells, eggs, specimens
8. Boddynock "Bod" Scrapsprocket — Goldwhisker Salvage & Exchange — salvage, abandoned equipment, caches, hardware
9. Talla Threadstone — Stone-Sewn Clothiers — cave silk, Silkroot fibers, webbing, hides, textile materials
10. Orvin Dustquill — The Buried Book — tokens, records, maps, inscriptions, lore, puzzle-fragment research; never buys or consumes puzzle fragments

The `Blingdenstone Gathering Contracts` Journal design has stable ID `blingdenstone-gathering-contracts`, one index page plus ten vendor pages. A corrected one-block injector artifact exists with zero Markdown fences/backticks and passed JavaScript syntax validation. Runtime deployment is not promoted to certified state by this reconciliation because no execution receipt is included here.

## Generated maintenance/diagnostic artifacts from this work

- 15-map player visibility/no-fog macro
- 15-map Region-Level diagnostic
- 15-map dark Underdark environment macro
- 15-map hide-Regions-from-players macro
- fishing/mining invisible-clickable repair macro (must be corrected for live mining flag `miningDeposit` before use as a complete repair)
- Blingdenstone Exploration Items diagnostic
- corrected Blingdenstone Gathering Contracts injector
- 15-map teleport-network macro/receipt

Generated artifacts are implementation aids. A generated macro is not treated as live success unless execution/read-back evidence exists.

## Known unrelated console noise

Observed but not attributed to this map work:

- missing `icons/svg/fish.svg` 404s
- some missing legacy icon/container resources
- WebGL READ-usage/performance warnings
- DAE/Midi-related Active Effect `system.strength` override resolution warnings
- Grammarly telemetry warnings

These should not be conflated with successful/failed Underdark Region operations.

## Next safe actions

1. Repair mining Region clickability using the actual `flags.regionwright-mining.miningDeposit` contract, preserving mining state and setting the same invisible clickable semantics as fishing; verify as a player.
2. Implement the general exploration interaction layer for non-fishing/non-mining Regions using stable exploration IDs and existing reward Items.
3. Keep Southeast and Southern hub routes unresolved until destinations are explicitly selected; do not guess.
4. Build the exploration-item artwork selector using stable `diceboxExploration.itemId` targeting and preserve manually selected artwork on reruns.
5. If the Gathering Contracts Journal injector is run, capture a runtime receipt and then promote its deployment state in the KB.
