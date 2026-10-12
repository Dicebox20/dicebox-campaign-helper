# Regionwright Mining Roadmap

## Active accepted change ? timing puzzle (2026-10-03)

Replace the default Athletics-roll extraction with a three-strike timing puzzle while preserving the proven Region, socket, inventory, depletion, reset, and fishing-coexistence architecture.

### Locked gameplay contract
- One mining extraction attempt contains exactly three timing strikes.
- The moving ring continuously shrinks and expands; the player strikes with click or Space.
- Full pulse cycle targets: stage 1 = 1500 ms, stage 2 = 1350 ms, stage 3 = 1200 ms.
- The fixed bullseye has nested accuracy bands. The smallest/center result is worth 5 ore, then 4, 3, 2, 1, and a sufficiently bad miss is worth 0.
- Initial normalized radius thresholds: <=0.18 => 5, <=0.30 => 4, <=0.45 => 3, <=0.62 => 2, <=0.80 => 1, >0.80 => 0.
- Final extraction quantity is the rounded average of the three strike scores, clamped 0?5.
- Completing all three strikes consumes exactly one of the vein's five shared extraction attempts.
- A missing pickaxe, cancellation before all three strikes, invalid ownership, missing GM, or depleted vein awards nothing and consumes no attempt.
- The active GM remains authoritative for validating the actor/Region/pickaxe, computing final yield from the three submitted strike scores, serializing depletion, and awarding ore.
- Mining feedback remains private to the triggering player.
- Keep `yieldForAthletics()` exported for backward API compatibility, but it is no longer the default gameplay resolver.

### Work order
1. Reconcile installed v0.1.4 into durable project source without copying live world state.
2. Implement pure timing-score helpers and tests.
3. Replace the mining dialog with the three-stage pulsing-circle UI.
4. Update socket payload/GM resolution to accept and validate timing scores.
5. Bump module version and update README/manifest.
6. Run syntax/unit tests and source/runtime hash comparison.
7. Deploy to the installed module, restart Foundry, and run controlled GM/player certification.

## Accepted UI addition ? GM test button (2026-10-03)
- Add a GM-only **Test Mining Minigame** tool to Region Controls adjacent to the Fishing Ponds tool.
- The test launches the full three-stage timing puzzle without consuming vein attempts, requiring a pickaxe, awarding ore, changing inventory, or mutating Region state.
- Use a bullseye icon so it is visually distinct from Fishing Ponds and Mining Deposits.

## Accepted visual polish ? strike feedback (2026-10-03)
- The live pulsing ring should visually communicate current accuracy as it approaches the bullseye.
- Use progressively brighter/more vibrant feedback for better zones.
- A perfect 5/5 hit must be visually exceptional with a bright green flash and large **PERFECT!** callout.
- Keep the fast three-stage pacing; feedback should be readable without materially slowing the loop.

## Perfect-center correction (2026-10-03)
- Only the tiny central bullseye counts as 5/5 PERFECT.
- Perfect timing threshold is normalized radius <= 0.025, meaning only the pulse at essentially its absolute minimum qualifies.
- The former broad green 5-zone is demoted; the larger precision area is Excellent (4/5).

## Rendered-diameter scoring correction (2026-10-03)
- The moving ring base diameter is 250 px and minimum scale is 0.08, allowing it to shrink to 20 px and visibly pass deep inside the 38 px Perfect bullseye.
- Rendered ring diameter is now the scoring source of truth.
- Perfect is 20-26 px; Excellent >26-62; Great >62-103; Good >103-149; Glancing >149-200; Miss >200.
- `scoreTimingRatio()` remains as a compatibility helper but derives its result through the rendered-diameter model.

## Ore-only scope for current expansion (2026-10-03)

Current mining-catalogue design work is limited to raw metallic ore/deposit nodes. Refined metals, alloys, meteorites, crystals, and other special-resource node types are deferred to a later expansion pass.

### Active ore/deposit candidates
- Copper
- Tin
- Iron
- Silver
- Gold
- Platinum
- Mithral
- Arandur
- Hizagkuur

### Deferred refined/alloy materials
- Adamantine
- Darksteel
- Telstang / Truesilver
- Dlarun / Icesteel
- Titansteel / Relic Iron
- Baatorian Green Steel

### Deferred special-resource nodes
- Fever Iron ? magical molten/volcanic resource rather than ordinary ore
- Chardalyn ? magical mineral/crystal resource
- Star Metal / Starfall Ore ? meteorite/impact resource
- Solanian Truesteel ? planar/celestial resource; revisit when planar gathering is designed

The deferred lists are intentionally preserved for future Regionwright Mining expansion but are out of scope for the immediate ore-node implementation and balance pass.

## Fixed ore pricing principle (2026-10-03)
- Each ore type has one fixed sale price per 1 lb gathering unit.
- Mining does not use fish-style per-item value rolls, assay rolls, or vein-quality price multipliers.
- Economic variance comes from the existing timing minigame: a completed mining attempt yields 0-5 units according to the three-strike timing result.
- Ore rarity controls how often a material is available; player performance controls how many units are recovered; unit price remains stable.

## Rare ore value + crafting research proposal (2026-10-03, provisional)
Research anchors: 5e Dungeon of the Mad Mage presents crude mithral ore at 25 gp per 10 lb and worked mithral at 50 gp/lb; 3e Magic of Faerun prices mithral heavy armor at +9,000 gp and other mithral items at +500 gp/lb; 3e Underdark supersedes Hizagkuur weapon pricing to +12,500 gp; 2024 D&D magic-item crafting lists 100,000 gp raw-material cost for a legendary item; Vorpal Sword remains legendary. Community blacksmithing systems commonly use discrete ingot recipes rather than literal item-weight conversion.

Proposed Regionwright abstraction:
- 5 one-pound ore units -> 1 refined forging ingot.
- Use fixed ore prices; quantity remains controlled by the existing 0-5 timing yield.
- Provisional high-tier prices: Mithral 100 gp/ore, Arandur 1,000 gp/ore, Hizagkuur 625 gp/ore.
- This makes one refined ingot's ore input worth 500 gp Mithral, 5,000 gp Arandur, or 3,125 gp Hizagkuur.
- Proposed recipe counts adapt the well-tested Kibbles-style ingot table: 2 daggers=1; rapier/scimitar/shortsword=2; longsword/battleaxe/warhammer=4; shield=5; chain shirt=5; scale mail=6; chain mail=7; breastplate=8; splint=10; half plate=12; greatsword=12; plate=20.
- Therefore longsword ore requirements are 20 units and plate requirements are 100 units.
- Arandur remains additionally gated by dragon-blood tempering and legendary enchantment requirements; ore value is only one component of a Vorpal-grade item's total cost.
- Hizagkuur's proposed 625 gp/ore makes the 20-ore input for a 4-ingot longsword exactly 12,500 gp, matching the revised legacy Realms weapon-price modifier before labor or other crafting costs.
Status: research proposal only; do not change module prices until user locks values and conversion ratios.

## Ore difficulty + combined Gathering HUD (2026-10-03)
- Lock ore timing profiles: Common Copper/Tin/Iron = 1500/1350/1200 ms; Uncommon Silver = 1400/1250/1100; Rare Gold = 1300/1150/1000; Very Rare Platinum = 1200/1050/900; Exceptional Mithral = 1100/950/825; Legendary Hizagkuur = 1000/875/800; Legendary+ Arandur = 950/850/800.
- All ores retain the same rendered score geometry and 0-5 yield meaning; rarity changes pulse speed only.
- Mining tester must support all nine ores and local/remote online-player launching without inventory or Region mutation.
- Combine the Regionwright Fishing HUD and Mining setup/test surface into one tabbed Regionwright Gathering HUD. Fishing remains the owner of the shared HUD shell and talks to Mining through its public API.
- Mining Region control opens the shared HUD on the Mining tab when Fishing is available, with existing Mining setup as fallback. The dedicated Region-control test button becomes unnecessary because testing lives in the Mining HUD tab.
- Locked fixed ore prices for this implementation: Iron 1 sp, Tin 3 sp, Copper 5 sp, Silver 2 gp, Gold 10 gp, Platinum 25 gp, Mithral 100 gp, Hizagkuur 625 gp, Arandur 1,000 gp. Adamantine is not a mineable ore entry.
- Lock crafting abstraction for later crafting implementation: 5 ore units -> 1 refined ingot.

## High-tier mining difficulty retune (2026-10-04)
Live playtest feedback: upper-tier ores remain too easy. Preserve the common/uncommon/rare profiles and score geometry, but accelerate Very Rare and above. Proposed locked tuning for this pass: Platinum 1100/950/800 ms; Mithral 950/800/675; Hizagkuur 825/700/600; Arandur 750/625/525.

## High-tier scoring-zone retune (2026-10-04)
Live playtest direction: beginning with Gold, higher-tier ores should not only pulse faster but also have progressively smaller positive-scoring zones and larger miss zones. Copper, Tin, Iron, and Silver retain the current 26/62/103/149/200 px score thresholds. Proposed progression: Gold 25/56/92/132/175; Platinum 24/52/84/120/160; Mithral 23/48/76/108/145; Hizagkuur 22/44/70/98/132; Arandur 22/40/64/90/120. Values are max rendered ring diameters for scores 5/4/3/2/1; larger diameters miss.

## Center-acceleration timing curve (2026-10-04)
Playtest direction: make Perfect slightly harder by making the moving ring visibly accelerate as it approaches the center, while keeping the behavior deterministic enough for attentive players to compensate. Preserve each ore's existing full pulse duration and score geometry. Use a smooth center-biased curve q = r + 0.30*r*(1-r), where r is the original linear 0-1 ring ratio. This preserves endpoints exactly, makes motion about 30% faster at the center, and correspondingly slower near the outside so the full cycle duration is unchanged.
