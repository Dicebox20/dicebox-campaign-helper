# Mining Deposits & Extraction

Region-driven mining for Foundry VTT 14 / D&D5e 5.3.3.

## Player loop
1. Select your character token (or have a user character assigned).
2. Click a visible ore deposit on the map while Token Controls are active.
3. The Region checks for a **Miner's Pick**, **Mining Pick**, or **Pickaxe** in inventory.
4. Roll native Strength (Athletics).
5. Yield is based on the final total:
   - 1–9: 0 lb
   - 10–14: 1 lb
   - 15–19: 2 lb
   - 20–24: 3 lb
   - 25–29: 4 lb
   - 30+: 5 lb
6. Every resolved swing consumes one of the vein's five attempts. The vein is depleted after the fifth swing.

## GM setup
Draw/place a Foundry Region directly over visible ore artwork. Select the Region, then use the **Mining Veins** tool in Region Controls and choose its ore.

The module imports seven ore resource Items into the world the first time a GM loads with it active:
Iron, Copper, Tin, Silver, Gold, Mithral, Adamantite.

`game.modules.get("regionwright-mining").api` exposes configure/reset/clear/mine helpers for automated scene builders.

## Multiplayer authority
Players make the native Athletics roll. The active GM validates ownership, pickaxe presence, vein state and remaining attempts, then performs shared depletion and Item award mutations.
