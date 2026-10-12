# Mining Deposits & Extraction

Standalone Foundry VTT 14.367 / D&D5e 5.3.3 Region-driven mining module.

## Player loop

1. Select/use a player-owned token and stay on Token Controls.
2. Click a configured ore deposit.
3. The actor must have a Miner's Pick / Mining Pick / Pickaxe.
4. Complete three pulsing-circle timing strikes.
5. Strike when the moving ring is as small as possible. Nested accuracy bands score each strike from 5 down to 1; a severe miss scores 0.
6. The three stages run at approximately 1.50s, 1.35s, and 1.20s per full shrink/grow cycle.
7. The rounded average of the three strike scores produces 0-5 ore units.
8. The completed three-strike sequence consumes exactly one of the vein's five shared extraction attempts.
9. The active GM validates and applies ore/depletion state. Mining result chat is whispered only to the triggering player.

Cancelling before all three strikes consumes no attempt. Missing-pick, invalid ownership, missing-GM, and depleted-vein failures are fail-closed.

## Timing score bands

The rendered moving ring is 250 px at full size and now shrinks to 20 px at the absolute center of the pulse. Scoring is based on that rendered diameter, not a separate abstract threshold, so the visual and gameplay result cannot drift apart.

| Moving-ring diameter | Strike score |
| ---: | ---: |
| 20-26 px | 5 (Perfect) |
| >26-62 px | 4 (Excellent) |
| >62-103 px | 3 (Great) |
| >103-149 px | 2 (Good) |
| >149-200 px | 1 (Glancing) |
| >200 px | 0 (Miss) |

The visible center bullseye is 38 px wide, but **Perfect requires the moving ring to travel deep inside it**, down to 26 px or less. The animation can now continue all the way to a 20 px minimum. Click the timing circle or press Space to strike. The ring continues pulsing until the player commits a strike.

## Multiplayer authority

The timing animation and input run on the player's client. The client sends exactly three bounded strike scores. The active GM revalidates actor ownership, pickaxe presence, Region configuration, and remaining attempts; recomputes the final yield; serializes the Region mutation; and awards ore.

The public `yieldForAthletics()` helper remains available for compatibility with older Dicebox macros, but Athletics is no longer the default mining resolver.

## Deposit state

Configured deposits use `flags["regionwright-mining"].miningDeposit` and retain the existing five-attempt depletion/reset model. Region geometry is never moved by the mining module.

## API

`game.modules.get("regionwright-mining")?.api` retains the v0.1.4 configuration/reset/click helpers and adds a `timing` helper group for stage cycles, score resolution, labels, and final yield.

## Exact-runtime certification

Pure timing/state tests and syntax checks are included. After module-code changes, fully restart Foundry and run the controlled GM + non-GM fixture before calling the build runtime-certified.

## GM timing test

Region Controls includes a bullseye **Test Mining Minigame** button beside Fishing Ponds. It lists all currently online users and can launch the full three-stage timing puzzle on any selected client. Test mode requires no pickaxe and performs no ore award, inventory mutation, Region mutation, depletion, or attempt consumption.

## Strike feedback

The moving timing ring changes from muted tones through warmer/brighter zones as it approaches the bullseye, reaching vivid green in the 5-point zone. Every committed strike gets an immediate result callout. A 5/5 strike produces an oversized **PERFECT!** label and bright green full-circle flash.

## Ore difficulty profiles
Copper, Tin, and Iron use 1500/1350/1200 ms; Silver 1400/1250/1100; Gold 1300/1150/1000; Platinum 1100/950/800; Mithral 950/800/675; Hizagkuur 825/700/600; Arandur 750/625/525. Score geometry and 0-5 yield remain unchanged across ores. The no-write test API accepts an ore ID so every profile can be tested locally or on an online player.

The mineable catalogue is Iron, Tin, Copper, Silver, Gold, Platinum, Mithral, Hizagkuur, and Arandur. Adamantine is reserved for a later refining/crafting layer.
