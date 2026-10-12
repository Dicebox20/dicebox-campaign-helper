# Mining Deposits & Extraction

Standalone Foundry VTT v14.367 / D&D5e 5.3.3 gathering module.

## Player loop

1. A map contains visible ore artwork.
2. A GM-configured invisible Region is drawn over the ore.
3. With Token Controls active, a player clicks the visible deposit.
4. The selected/assigned actor must possess a Miner's Pick / Mining Pick / Pickaxe.
5. `actor.rollSkill({ skill: "ath" })` makes a native Strength (Athletics) check.
6. The check total determines ore per swing:
   - 1–9: 0
   - 10–14: 1
   - 15–19: 2
   - 20–24: 3
   - 25–29: 4
   - 30+: 5
7. Every resolved swing consumes one of the Region's five shared extraction attempts.
8. The active GM owns depletion and ore-award mutation. After swing five, the vein is depleted.

A cancelled roll consumes no swing.

## Ore roster and sale values

These are *Blingdenstone gathering-economy* values for one 1-lb raw ore unit, not a claim that D&D publishes a complete raw-ore price table.

| Ore | Map rarity | Sale value / 1-lb unit |
| --- | --- | ---: |
| Iron Ore | Common | 1 sp |
| Copper Ore | Common | 5 sp |
| Silver Ore | Uncommon | 2 gp |
| Gold Ore | Rare | 10 gp |
| Mithral Ore | Very Rare | 25 gp |
| Adamantine Ore | Very Rare | 50 gp |

The module includes the **Mining Resources** Item compendium and also installs managed world reference Items for an active GM. These prices are intentionally gathering-game prices for sorted raw ore chunks, not refined ingot prices.

## Configuring a Region

Enable the module and reload the world. It creates a **Configure Mining Deposit** Macro.

Select a Region on the Regions layer and run that macro, then choose an ore type. Configuring/resetting starts the Region at five attempts.

For automated map builds:

```js
const mining = game.modules.get("regionwright-mining")?.api;
await mining.configureRegion({ region, oreId: "iron-ore" });
```

Available IDs:
`iron-ore`, `copper-ore`, `silver-ore`, `gold-ore`, `mithral-ore`, `adamantine-ore`.

Reset one deposit later:

```js
await mining.resetRegion(region);
```

Reset every mining deposit on the active Scene:

```js
await mining.resetScene();
```

The module also creates a **Reset Mining Deposits — Current Scene** GM macro for repeatable hunter/gatherer outings.

## Interaction compatibility

Mining uses the same Token-layer Region-click pattern as the installed Fishing Biomes & Minigame. On a scene with fishing Regions, fishing owns the passive RegionLayer bridge and mining only attaches its own deposit handlers. On a mining-only scene, mining supplies the bridge itself. Native Region placement/editing remains Foundry-owned.

## Multiplayer authority

Players roll Athletics locally through D&D5e. Protected mutation is resolved by the active GM over the module socket:
- sender must own the actor;
- actor must still have a pickaxe;
- Region must still be a live mining deposit;
- Region must have an attempt remaining;
- GM computes yield from the roll total;
- Region state and ore award are serialized per Region.

If reward creation fails, the swing state is rolled back when safe to do so.

## Exact-runtime certification

Source syntax and pure yield tests are included. Player click behavior, socket mutation, five-swing depletion, and Fishing/Mining coexistence should be verified once in the live Foundry world after enabling the module.
