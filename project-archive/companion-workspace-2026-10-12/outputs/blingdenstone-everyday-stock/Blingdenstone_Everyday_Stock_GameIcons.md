# Blingdenstone Everyday Vendor Stock (Game Icons)

This package uses the Dicebox random image helper to assign icons from the local `game-icons.net` SVG library, copies the selected icons into the `dicebox-campaign-helper` module asset folder, and then generates a Foundry injection macro for the Blingdenstone mundane-item catalogue.

## Build step

Run the PowerShell script:

```powershell
.\Build_Blingdenstone_Everyday_Stock_With_GameIcons.ps1
```

## Item roster summary

### Ruby in the Rough

| Item | Theme | Price | Stock | Icon Query | Generated Icon |
|---|---|---:|---:|---|---|
| Polished Geode Keepsake | souvenir | 8 gp | 3 | geode; gem; crystal; rock; polished; keepsake | ruby-in-the-rough__polished-geode-keepsake.svg |
| Cavestone Brooch | common | 15 gp | 2 | brooch; jewel; gem; badge; pin; cavestone | ruby-in-the-rough__cavestone-brooch.svg |
| Traveler's Signet Ring | common | 12 gp | 2 | ring; jewel; signet; traveler | ruby-in-the-rough__travelers-signet-ring.svg |
| Crystal Bead Bracelet | common | 6 gp | 4 | bracelet; beads; jewel; crystal; bead | ruby-in-the-rough__crystal-bead-bracelet.svg |
| Agate Luck Charm | souvenir | 5 gp | 4 | charm; gem; amulet; stone; agate; luck | ruby-in-the-rough__agate-luck-charm.svg |

### Deepdelver Outfitters

| Item | Theme | Price | Stock | Icon Query | Generated Icon |
|---|---|---:|---:|---|---|
| Hemp Rope (50 ft.) | common | 1 gp | 6 | rope; knot; coil; hemp | deepdelver-outfitters__hemp-rope-bundle.svg |
| Collapsible Camp Stool | common | 7 gp | 2 | stool; chair; camp; collapsible | deepdelver-outfitters__collapsible-camp-stool.svg |
| Piton Set (10) | common | 5 gp | 4 | piton; spike; iron; nail; set | deepdelver-outfitters__piton-set.svg |
| Chalk Pack | common | 2 sp | 8 | chalk; writing; stone; mark; pack | deepdelver-outfitters__chalk-pack.svg |
| Delver's Bedroll | common | 1 gp | 4 | bedroll; sleeping; blanket; delver | deepdelver-outfitters__delver-bedroll.svg |

### Blackstone Forge

| Item | Theme | Price | Stock | Icon Query | Generated Icon |
|---|---|---:|---:|---|---|
| Miner's Pick | common | 2 gp | 4 | pickaxe; tool; pick; miner | blackstone-forge__miners-pick.svg |
| Camp Hatchet | common | 1 gp | 4 | axe; tool; hatchet; camp | blackstone-forge__camp-hatchet.svg |
| Reinforced Crowbar | common | 3 gp | 3 | crowbar; tool; lever; reinforced | blackstone-forge__reinforced-crowbar.svg |
| Boot Spikes | common | 8 gp | 3 | spikes; crampons; boot; spike | blackstone-forge__boot-spikes.svg |
| Cookpot Tripod | common | 9 gp | 2 | tripod; cooking; campfire; cookpot | blackstone-forge__cookpot-tripod.svg |

### Glitterblind Alchemicals

| Item | Theme | Price | Stock | Icon Query | Generated Icon |
|---|---|---:|---:|---|---|
| Potion of Healing | common | 50 gp | 4 | potion; bottle; healing | glitterblind-alchemicals__potion-of-healing.svg |
| Antitoxin | common | 50 gp | 3 | antidote; potion; bottle; medicine; antitoxin | glitterblind-alchemicals__antitoxin-vial.svg |
| Alchemist's Fire | common | 50 gp | 3 | fire; bottle; flask; bomb; alchemist | glitterblind-alchemicals__alchemists-fire-flask.svg |
| Acid (Vial) | common | 25 gp | 3 | acid; bottle; potion; flask; vial | glitterblind-alchemicals__acid-vial.svg |
| Cave-Cough Tonic | common | 8 gp | 5 | medicine; bottle; potion; herbal; cave; cough; tonic | glitterblind-alchemicals__cave-cough-tonic.svg |

### The Spore & Stem

| Item | Theme | Price | Stock | Icon Query | Generated Icon |
|---|---|---:|---:|---|---|
| Underdark Trail Rations | common | 5 sp | 10 | ration; food; pack; bread; underdark; trail; rations | the-spore-&-stem__underdark-trail-rations.svg |
| Glowcap Tea | common | 3 sp | 6 | tea; cup; leaves; mushroom; glowcap | the-spore-&-stem__glowcap-tea.svg |
| Spore Poultice | common | 6 gp | 4 | herb; bundle; medicine; herbs; leaf; spore; poultice | the-spore-&-stem__spore-poultice.svg |
| Dried Mushroom Mix | common | 4 sp | 8 | mushroom; food; fungus; dried; mix | the-spore-&-stem__dried-mushroom-mix.svg |
| Lantern Lichen Bundle | common | 4 gp | 4 | lichen; plant; glowing; moss; lantern; bundle | the-spore-&-stem__lantern-lichen-bundle.svg |

### Pick & Lantern Mining Supply

| Item | Theme | Price | Stock | Icon Query | Generated Icon |
|---|---|---:|---:|---|---|
| Hooded Lantern | common | 5 gp | 4 | lantern; light; lamp; hooded | pick-&-lantern-mining-supply__hooded-lantern.svg |
| Surveyor's Twine | common | 4 gp | 5 | rope; line; string; spool; thread; surveyor; twine | pick-&-lantern-mining-supply__surveyors-twine.svg |
| Ore Sack | common | 6 sp | 6 | bag; sack; backpack; ore | pick-&-lantern-mining-supply__ore-sack.svg |
| Measuring Rod Set | common | 6 gp | 2 | ruler; tool; compass; measuring; rod; set | pick-&-lantern-mining-supply__measuring-rod-set.svg |
| Climbing Harness | common | 15 gp | 2 | harness; rope; belt; climbing | pick-&-lantern-mining-supply__climbing-harness.svg |

### Whisperstone Curios

| Item | Theme | Price | Stock | Icon Query | Generated Icon |
|---|---|---:|---:|---|---|
| Whisperstone Pendant | souvenir | 10 gp | 3 | pendant; amulet; gem; necklace; whisperstone | whisperstone-curios__whisperstone-pendant.svg |
| Fossil Paperweight | souvenir | 7 gp | 2 | fossil; shell; stone; paperweight | whisperstone-curios__fossil-paperweight.svg |
| Echo Chime | souvenir | 9 gp | 2 | wind; chime; bell; charm; echo | whisperstone-curios__echo-chime.svg |
| Cave Cricket Charm | souvenir | 4 gp | 4 | insect; charm; beetle; cave; cricket | whisperstone-curios__cave-cricket-charm.svg |
| Geode Dice Set | souvenir | 18 gp | 2 | dice; game; gem; geode; set | whisperstone-curios__geode-dice-set.svg |

### Goldwhisker Salvage & Exchange

| Item | Theme | Price | Stock | Icon Query | Generated Icon |
|---|---|---:|---:|---|---|
| Used Backpack | common | 1 gp | 4 | backpack; bag; used | goldwhisker-salvage-&-exchange__used-backpack.svg |
| Waterskin | common | 2 sp | 6 | waterskin; bottle; flask; water | goldwhisker-salvage-&-exchange__waterskin.svg |
| Patch Kit | common | 8 sp | 4 | needle; thread; sewing; kit; repair; patch | goldwhisker-salvage-&-exchange__patch-kit.svg |
| Scrap Chain Bundle | common | 1 gp | 3 | chain; metal; link; scrap; bundle | goldwhisker-salvage-&-exchange__scrap-chain-bundle.svg |
| Miscellany Pouch | common | 6 sp | 4 | pouch; bag; small; miscellany | goldwhisker-salvage-&-exchange__miscellany-pouch.svg |

### Stone-Sewn Clothiers

| Item | Theme | Price | Stock | Icon Query | Generated Icon |
|---|---|---:|---:|---|---|
| Dust Veil | common | 8 sp | 5 | scarf; cloth; mask; veil; dust | stone-sewn-clothiers__dust-veil.svg |
| Cavecloak | common | 8 gp | 3 | cloak; cloth; cape; cavecloak | stone-sewn-clothiers__cavecloak.svg |
| Reinforced Gloves | common | 1 gp | 4 | gloves; leather; glove; gauntlet; reinforced | stone-sewn-clothiers__reinforced-gloves.svg |
| Travel Scarf | common | 6 sp | 4 | scarf; cloth; travel | stone-sewn-clothiers__travel-scarf.svg |
| Sturdy Tunnel Boots | common | 4 gp | 3 | boots; leather; shoe; sturdy; tunnel | stone-sewn-clothiers__sturdy-tunnel-boots.svg |

### The Buried Book

| Item | Theme | Price | Stock | Icon Query | Generated Icon |
|---|---|---:|---:|---|---|
| Blank Journal | common | 5 sp | 6 | book; journal; blank | the-buried-book__blank-journal.svg |
| Map Case | common | 1 gp | 4 | scroll; case; map | the-buried-book__map-case.svg |
| Charcoal & Ink Kit | common | 9 sp | 5 | ink; quill; bottle; charcoal; kit | the-buried-book__charcoal-and-ink-kit.svg |
| Guide to Blingdenstone | souvenir | 2 gp | 4 | guide; book; map; blingdenstone | the-buried-book__blingdenstone-guidebook.svg |
| Illustrated Cavern Postcard Pack | souvenir | 7 sp | 5 | postcard; paper; scroll; illustrated; cavern; pack | the-buried-book__illustrated-postcard-pack.svg |

## Generated files

- Macro: `C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\outputs\blingdenstone-everyday-stock\inject_blingdenstone_everyday_stock_gameicons.js`
- Module asset folder: `C:\Users\rujie\AppData\Local\FoundryVTT\Data\modules\dicebox-campaign-helper\assets\game-icons\blingdenstone-everyday`

