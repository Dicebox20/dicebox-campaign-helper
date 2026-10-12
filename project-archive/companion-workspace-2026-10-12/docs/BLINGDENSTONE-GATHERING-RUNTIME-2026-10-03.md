# Blingdenstone Gathering Runtime - 2026-10-03

Evidence boundary: Read-only copies of Foundry LevelDB plus installed module source/manifests. This records observed state; it does not imply every edge case is certified.

Exact stack: Foundry 14.367; D&D5e 5.3.3; world `the-forgotten-realms`.

## Network bindings

| # | Scene | UUID |
|---:|---|---|
| 1 | Shimmerdeep Shelf | `Scene.kQCQBA6HV1OJSVV9` |
| 2 | Cascade Hollows | `Scene.FOP6lUmKv07ReHms` |
| 3 | Fossil Deeps | `Scene.RPPDHrnMqxteQakp` |
| 4 | Deepvein Approach | `Scene.hsABhipN3QBh08a8` |
| 5 | Broken Gallery | `Scene.kTxwcZamvgn1Qgxt` |
| 6 | Blackglass Delve | `Scene.rptSRaiuaRIEl9xs` |
| 7 | Siltwater Channel | `Scene.0jwY5S4y38QpShCn` |
| 8 | Shellwater Basin | `Scene.bIsvqkZ34I6TPesQ` |
| 9 | Drowned Reach | `Scene.TFHJUCsXtr6htcml` |
| 10 | Glowcap Warrens | `Scene.UfFF6oK3KzcYMeLq` |
| 11 | Silkroot Grove | `Scene.Q0f7OmBJWAAGI6MS` |
| 12 | Steamstone Pools | `Scene.S8xxiJ8bp7IvnCsD` |
| 13 | Brimstone Gardens | `Scene.gYajJL9SRqTkQp5Q` |
| 14 | Forgotten Waystation | `Scene.zKoROMo2fXugrZAq` |
| 15 | Rubblefield Crossing | `Scene.9YP8slvtVvMmUGKO` |
| 16 | Blingdenstone — Outer Travel Hub | `Scene.Q82JT7N2wpli0rKR` |

Blingdenstone City is `Scene.dKsDd6Z4RTZnRLUX`.

## Current live counts

The 15 exploration maps plus the Outer Travel Hub currently contain **292 Regions** and **257 RegionBehaviors**. Of these, **177** are wired to the Dicebox exploration runtime, **24** are Regionwright Fishing spots, and **24** are Regionwright Mining deposits.

## Outer Travel Hub

`Scene.Q82JT7N2wpli0rKR` is 1448x1086 with padding `0.25` and grid size `64`. The initial Level uses `worlds/the-forgotten-realms/dicebox/maps/blingdenstone-outer-travel-hub/blingdenstone-outer-travel-hub.webp` with fit `fill`, zero offsets, and scale 1. This is the corrected alignment state; do not change scene dimensions to solve token scale.

The East Route pair is manual/foreign and must be preserved:
- `Scene.Q82JT7N2wpli0rKR.Region.5P9vLZZ2kGF2HW9w` - Teleport — East Route
- `Scene.Q82JT7N2wpli0rKR.Region.SZVDGAGvpmNR1oY4` - Arrival — East Route

City <-> Hub teleport bindings:
- City exit: `Scene.dKsDd6Z4RTZnRLUX.Region.J0WRJDDzGxjlDLkv` -> Hub arrival `Scene.Q82JT7N2wpli0rKR.Region.cDaoXAFuQkohlsfy`
- Hub exit: `Scene.Q82JT7N2wpli0rKR.Region.Q4inuDTNIm5zom3B` -> City landing `Scene.dKsDd6Z4RTZnRLUX.Region.cBvHXwiDhaSDFkcE`

## Exploration Discovery v2

Runtime Macro: `Macro.wmagIrvqTCZoLpRk` - **Dicebox — Exploration Discovery v2**. Its default ownership is `1`, which is LIMITED and is required because Foundry Macro execution rejects users below LIMITED.

Flow: **tokenEnter -> passive Perception -> private local notice -> optional Investigation self-roll -> GM-authoritative award/state write**. The runtime reads `actor.system.skills.prc.passive`, uses `rollMode: selfroll` for Investigation, uses local scrolling text plus self-whispered ChatMessage, and preserves protected world mutation on the active GM.

Exploration Item catalog: **127 Items** mapped across **146 Region references**.
Categories: {'creature': 15, 'salvage': 28, 'renewable': 32, 'discovery': 42, 'puzzle': 10}
Reset policies: {'encounter-dependent': 15, 'global-one-time': 80, 'per-character-long-rest': 32}
Rarities: {'common': 47, 'uncommon': 55, 'rare': 24, 'veryRare': 1}

At snapshot time, **4 Actors** carried v2 exploration runtime state. Observed signal states include {'perception-fail': 12, 'success': 23, 'investigation-fail': 22, 'locked': 7, 'cancelled': 9}. This is direct evidence that success/failure/cancel/lock flows executed in the exact world; it is not blanket certification of every edge case.

## Fishing

Installed module: `regionwright-fishing` v0.1.2. There are **24 fishing Regions** across 10 exploration scenes. They require Observer permission and are clicked from Token Controls. The installed module has no persistent pond-depletion or catch-count reset state; caught fish and consumed bait are inventory state and are not restored by a long rest.

Tier distribution: {'uncommon': 12, 'common': 10, 'rare': 2}

| Scene | Region | Tier | UUID |
|---|---|---|---|
| Brimstone Gardens | Fishing Area — Tempered Spring | uncommon | `Scene.gYajJL9SRqTkQp5Q.Region.nIqKMyrAfxX027mA` |
| Cascade Hollows | Central Channel | uncommon | `Scene.FOP6lUmKv07ReHms.Region.1wnxr0c4D85ZLPYu` |
| Cascade Hollows | Lower Deep Basin | uncommon | `Scene.FOP6lUmKv07ReHms.Region.MIltpnunEWdGPLpw` |
| Cascade Hollows | Upper Plunge Pool | common | `Scene.FOP6lUmKv07ReHms.Region.1Vz2Tf69sGGr1xWx` |
| Drowned Reach | Fishing Area — Blackwater Sink | rare | `Scene.TFHJUCsXtr6htcml.Region.SVjQWySw3rqhfNBu` |
| Drowned Reach | Fishing Area — Flooded Central Basin | uncommon | `Scene.TFHJUCsXtr6htcml.Region.LO7odWVBbuZRK1Uk` |
| Drowned Reach | Fishing Area — Upper Inlet | common | `Scene.TFHJUCsXtr6htcml.Region.TATaAG57NUYeVLjW` |
| Fossil Deeps | Remnant Seep Pool | common | `Scene.RPPDHrnMqxteQakp.Region.2k4SkIOEWm0Ut7Mt` |
| Glowcap Warrens | Fishing Area — Crystalwater Basin | uncommon | `Scene.UfFF6oK3KzcYMeLq.Region.hZWJewnl36svnmmE` |
| Glowcap Warrens | Fishing Area — Luminous Upper Pool | common | `Scene.UfFF6oK3KzcYMeLq.Region.O7WVMorvdxWQLmVd` |
| Shellwater Basin | Central Shellwater Basin | uncommon | `Scene.bIsvqkZ34I6TPesQ.Region.H2WOecsyp7eIuBIO` |
| Shellwater Basin | East Basin Shallows | common | `Scene.bIsvqkZ34I6TPesQ.Region.50ELjpjnSq9dBf9H` |
| Shellwater Basin | Island-Edge Fishing Pocket | common | `Scene.bIsvqkZ34I6TPesQ.Region.Mbhm9hmyAUQbSNGS` |
| Shellwater Basin | Lower Deep Channel | uncommon | `Scene.bIsvqkZ34I6TPesQ.Region.oKmwKSZXjOz7nTX0` |
| Shimmerdeep Shelf | Fishing Area — Lower Blue Pool | uncommon | `Scene.kQCQBA6HV1OJSVV9.Region.ES6CgI9Vg7D288C5` |
| Shimmerdeep Shelf | Fishing Area — West Shallows | common | `Scene.kQCQBA6HV1OJSVV9.Region.G0dcdNxA7tFAtq9j` |
| Silkroot Grove | Fishing Area — Central Terrace Basin | uncommon | `Scene.Q0f7OmBJWAAGI6MS.Region.O7166ocbwilBhDtn` |
| Silkroot Grove | Fishing Area — Lower Grotto Pool | rare | `Scene.Q0f7OmBJWAAGI6MS.Region.qeIgJA8PxZLVC164` |
| Silkroot Grove | Fishing Area — Upper Falls Pool | common | `Scene.Q0f7OmBJWAAGI6MS.Region.1CPoPeBsefpOMBKG` |
| Siltwater Channel | East Shallow Pool | common | `Scene.0jwY5S4y38QpShCn.Region.C0EQzuTyToQPTp3y` |
| Siltwater Channel | Mid-Channel Pool | uncommon | `Scene.0jwY5S4y38QpShCn.Region.S8E6Fhi8kmPqsfOC` |
| Siltwater Channel | West Waterfall Pool | uncommon | `Scene.0jwY5S4y38QpShCn.Region.f8lQdAsCaMUt7thd` |
| Steamstone Pools | Fishing Area — Central Warmwater Pool | uncommon | `Scene.S8xxiJ8bp7IvnCsD.Region.pdl2DXOLFiOnnoYn` |
| Steamstone Pools | Fishing Area — Upper Thermal Basin | common | `Scene.S8xxiJ8bp7IvnCsD.Region.Pyj6bGGjfTTtPEvJ` |

## Mining

Installed module: `regionwright-mining` v0.1.4 with socket support `True`. The project `outputs/regionwright-mining` manifest is still v0.1.0; that source drift is an open reconciliation item.

There are **24 configured deposits**: {'silver-ore': 8, 'gold-ore': 3, 'copper-ore': 4, 'iron-ore': 9}. At the snapshot, **5** deposits were fully depleted, proving shared five-swing depletion state has been exercised in live play.

Canonical yield bands: 1-9->0, 10-14->1, 15-19->2, 20-24->3, 25-29->4, 30+->5 ore units per swing.

Correct invisible-but-clickable mining state: **hidden=false, visibility=GAMEMASTER, locked=false, default permission=OBSERVER**. Foundry `hidden=true` deactivates Region behaviors; Regionwright Mining instead keeps the Region active and uses a near-transparent player hit target on Token Controls.

| Scene | Deposit | Ore | Used | Depleted | UUID |
|---|---|---|---:|---|---|
| Blackglass Delve | Blackglass Deep Vein I | silver-ore | 0/5 | no | `Scene.rptSRaiuaRIEl9xs.Region.KKewx1lDt6KMHvmS` |
| Blackglass Delve | Blackglass Rare Vein II | gold-ore | 0/5 | no | `Scene.rptSRaiuaRIEl9xs.Region.5h6nxYfacw4opl20` |
| Blackglass Delve | Blackglass Worked Vein III | copper-ore | 0/5 | no | `Scene.rptSRaiuaRIEl9xs.Region.0H2EccYO6YKJxSQo` |
| Brimstone Gardens | Ore Node — Cinnabar Vein | copper-ore | 0/5 | no | `Scene.gYajJL9SRqTkQp5Q.Region.F8BCtRW55DppngXi` |
| Brimstone Gardens | Ore Node — Volcanic Glass Seam | silver-ore | 0/5 | no | `Scene.gYajJL9SRqTkQp5Q.Region.3wBF85wRfmDxhDr8` |
| Broken Gallery | Common Worked Vein | iron-ore | 5/5 | yes | `Scene.kTxwcZamvgn1Qgxt.Region.ybkbxmHcWDz6Bp1T` |
| Broken Gallery | Rich Worked Vein I | silver-ore | 0/5 | no | `Scene.kTxwcZamvgn1Qgxt.Region.ST2Ppdpb6g10zg8h` |
| Broken Gallery | Rich Worked Vein II | silver-ore | 5/5 | yes | `Scene.kTxwcZamvgn1Qgxt.Region.cy57e38OQYm3v93X` |
| Cascade Hollows | Exposed Iron Vein | iron-ore | 5/5 | yes | `Scene.FOP6lUmKv07ReHms.Region.Izou4UsVKuOy3PTl` |
| Deepvein Approach | Deep Side-Cut Iron Face | silver-ore | 0/5 | no | `Scene.hsABhipN3QBh08a8.Region.KB2zBapd9vUB9yMk` |
| Deepvein Approach | Worked Iron Face I | iron-ore | 0/5 | no | `Scene.hsABhipN3QBh08a8.Region.1KO4NGPazDOHQyMB` |
| Deepvein Approach | Worked Iron Face II | iron-ore | 0/5 | no | `Scene.hsABhipN3QBh08a8.Region.ut2DwsDf0lAEf9zS` |
| Forgotten Waystation | Ore Node — Cliffside Vein | silver-ore | 0/5 | no | `Scene.zKoROMo2fXugrZAq.Region.taDsa4aVkZ97w6YK` |
| Forgotten Waystation | Ore Node — Liftside Vein | iron-ore | 0/5 | no | `Scene.zKoROMo2fXugrZAq.Region.ndSidXS0D8zQ1yea` |
| Forgotten Waystation | Ore Node — Waystation Gold Pocket | gold-ore | 0/5 | no | `Scene.zKoROMo2fXugrZAq.Region.QTa9aePxyoDuRsEU` |
| Rubblefield Crossing | Ore Node — Black Basalt Pocket | iron-ore | 0/5 | no | `Scene.9YP8slvtVvMmUGKO.Region.OT61XVdTzJoej4mp` |
| Rubblefield Crossing | Ore Node — Cinderiron Seam | iron-ore | 0/5 | no | `Scene.9YP8slvtVvMmUGKO.Region.FFYMF2JmK7HfyiEP` |
| Rubblefield Crossing | Ore Node — Crimson Crystal Bed | gold-ore | 0/5 | no | `Scene.9YP8slvtVvMmUGKO.Region.0uZpIBmvOfro5Rfi` |
| Rubblefield Crossing | Ore Node — Redglass Vein | silver-ore | 0/5 | no | `Scene.9YP8slvtVvMmUGKO.Region.L03iwoQlociLScqU` |
| Shellwater Basin | Ore Node — Shellwater Copper Seam | copper-ore | 5/5 | yes | `Scene.bIsvqkZ34I6TPesQ.Region.8Y4q8DU4HwGYrPNV` |
| Shellwater Basin | Ore Node — Shellwater Iron Shelf | iron-ore | 5/5 | yes | `Scene.bIsvqkZ34I6TPesQ.Region.cfKOGcJg5JSohOAB` |
| Shimmerdeep Shelf | Ore Node — Shelf Iron Vein | iron-ore | 0/5 | no | `Scene.kQCQBA6HV1OJSVV9.Region.z0prw9N5ZVpnANRI` |
| Steamstone Pools | Ore Node — Steamstone Copper Seam | copper-ore | 0/5 | no | `Scene.S8xxiJ8bp7IvnCsD.Region.7Bx0X2VRr4J9dn5u` |
| Steamstone Pools | Ore Node — Steamstone Silver Vein | silver-ore | 0/5 | no | `Scene.S8xxiJ8bp7IvnCsD.Region.uXC3QIVJSAwJufFu` |

Five manually drawn Regions added during this work were converted without changing their geometry:
- `Scene.S8xxiJ8bp7IvnCsD.Region.7Bx0X2VRr4J9dn5u` -> `copper-ore`
- `Scene.S8xxiJ8bp7IvnCsD.Region.uXC3QIVJSAwJufFu` -> `silver-ore`
- `Scene.zKoROMo2fXugrZAq.Region.QTa9aePxyoDuRsEU` -> `gold-ore`
- `Scene.bIsvqkZ34I6TPesQ.Region.cfKOGcJg5JSohOAB` -> `iron-ore`
- `Scene.bIsvqkZ34I6TPesQ.Region.8Y4q8DU4HwGYrPNV` -> `copper-ore`

Mining privacy change: installed v0.1.4 changes Athletics to `selfroll` and whispers the mining result to the triggering user. This code is present on disk but still requires a Foundry restart plus player test before it is considered runtime-certified. A temporary client-local workaround was also built for use before restart.

## Long-rest reset contract

The full reset routine:
- clear actor flags world.diceboxExplorationV2 and world.diceboxExplorationRuntime
- clear matching exploration Region claim flags
- call regionwright-mining resetRegion for every configured mining Region
- verify fishing Region readiness and permission

It deliberately preserves:
- awarded exploration items
- caught fish
- consumed bait
- Region shapes
- teleports
- map geometry

A prior live reset receipt reported 24 mining nodes reset, 24 fishing spots ready, and exploration reset. The latest comprehensive routine follows the same preservation contract.

## Known troubleshooting outcomes

- Exploration v2 originally failed because the runtime Macro had default ownership NONE. LIMITED is sufficient and is now present in the live Macro.
- Mining custom socket requests originally timed out because the module manifest lacked `socket: true`. The installed mining manifest now enables socket support.
- Hiding mining Regions with Foundry `hidden=true` breaks interaction; player invisibility must be achieved while the Region stays active.
- The D&D5e/Midi-QOL `ChatMessage#applyRollMode` deprecation warning is not itself the mining failure.
- `Active Effect ... system.strength failed to resolve` warnings are separate actor/item effect problems and are not evidence of exploration/mining failure.

## Open certification / preservation work

- Installed regionwright-mining 0.1.4 is newer than the project outputs copy (0.1.0) and must be reconciled into durable source.
- Private mining self-roll/whisper patch requires Foundry restart and player retest for certification.
- The full long-rest reset macro is designed and syntax-checked but still needs a live post-reset reread.
- Player-view Region invisibility should be checked from a non-GM client across representative fishing/mining/exploration scenes.

The machine-readable companion record is `docs/BLINGDENSTONE-GATHERING-RUNTIME-2026-10-03.json`.
