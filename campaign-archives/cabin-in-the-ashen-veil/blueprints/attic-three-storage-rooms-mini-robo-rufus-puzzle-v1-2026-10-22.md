# Cabin in the Ashen Veil — Approved Attic Layout and Mini-Robo Rufus Optional Puzzle v1

**Date:** 2026-10-22  
**Status:** OWNER-SELECTED ATTIC VISUAL; OWNER-APPROVED ITEM INSCRIPTION; DESIGNER-DEFINED OPTIONAL PUZZLE SPEC under standing permission for delegated choices. No Foundry scenes, Items, actors, macros or puzzle behaviors have been installed or verified.

## Owner directives and art selection

- The owner chose the **first attic plan** generated for this exchange, titled **BLACKWOOD ESTATE CABIN — ATTIC PLAN**, with the irregular cross-shaped navigable room, **North Storage (8×10 ft)**, **West Storage (10×8 ft)**, **East Storage (12×8 ft)**, and a central **Attic (18×14 ft)**. Outer wide roof footprint is shown as dashed roof outlines; it is NOT all walkable attic floor.
- Maintain the **same clean navy-and-gold Gondian floor-plan treatment** as the accepted ground and upper sheets. The first attic plan is the owner-selected visual; the later alternate “Attic Floor Plan” with front lookout and hidden crawlspace was NOT selected.
- The original artist draft labels a central **“Stairs Down”**. The controlling established gameplay access is **Ladder Hook unlocking the ceiling hatch/pull-down ladder from the Upper Landing**. Treat that draft stair icon as a **diagrammatic descent marker**, not authority to add a permanently open staircase; correct to the true hatch/ladder in the final structural build/GM sheet.
- The owner delegated a playful three-room optional mechanic to earn **Mini-Robo Rufus, the Narrowly Missed Trauma Doll**. They specifically request the **complete item's description** to contain the *exact* sentence **“This was a better plan than the other one”**, referencing Allen's alternative plan to automate Rufus's corpse for Sophia.

## Three-storage-room optional assembly puzzle (not an extra Foundry map)

- **West Storage — Brass Hound Chassis**: discover a compact wheeled/four-legged clockwork dog's frame, folded into a storage crate. Unique pickup `attic.roboRufus.chassis`. In-fiction it is stamped with Allen's tiny maker's seal.
- **North Storage — Wind-Up Heart**: small spring-and-flywheel power unit in a box of abandoned Gondian mechanisms. Unique pickup `attic.roboRufus.heart`. The socket fits the chassis by physical shape.
- **East Storage — Voice-and-Tail Assembly**: a wagging counterweight and little chime/whistle speech assembly, wrapped carefully in Sophia's old blankets. Unique pickup `attic.roboRufus.voiceTail`.
- **Central Attic — Assembly Bench**: a fixed small worktop, offering one explicit interact action `attic.roboRufus.assemble`. With all three parts (in any order), assemble the unique complete Mini-Robo Rufus Item. Require no die roll, lock code, missing fourth component, rare reagent, prerequisite spell, or world-stage requirement.
- All locations are **within one attic Foundry Scene**. The three storage doorways are ordinary internal movement openings rendered on the background and bounded by Walls as needed. No extra logical scene, portal Region or travel loading is necessary. Players may find any component before the others.
- Established **required attic rewards** remain independently accessible without the optional assembly: **Clockwork Winder**, **Minute Hand**, and *Moonlight and the Missing Stars* (1443 DR), the attic's one *Miss Lulubug* storybook. Do NOT place any of those three inside the mechanical hound, behind the assembly bench, or in the optional bins.
- If a PC misses a component, the whole quest remains completable; completion grants a friendly little narrative companion/collectible, never a key, Gond emblem half, Rufus eye, charging source, Vault predicate, or required puzzle bypass.

## Completed Foundry Item — Description (OWNER phrase locked)

**Item name:** Mini-Robo Rufus  
**Subtitle:** *The Narrowly Missed Trauma Doll*  
**Type (implementation proposal):** unique wondrous trinket; non-attuned, no consumable charges; optional mechanical companion without formal familiar/Actor combat stats by default.

> A palm-sized brass hound, carefully assembled from polished clockwork paws, a humming spring-heart, and a little chiming voice box. Its ears perk up when spoken to, its tail ticks happily against the floor, and it makes a determined effort to follow its favorite person without tripping over its own feet.
>
> Hidden beneath its hinged brass belly is a tiny inscription in Allen’s careful hand:
>
> **“This was a better plan than the other one”**
>
> The little dog gives a single cheerful *arf* when wound. It was built to make Sophia smile.

**GM-only meaning:** “The other one” is Allen's deeply misguided attempt to mechanize preserved Rufus's corpse for Sophia. The inscription is Allen's understated recognition that making a new, harmless clockwork dog would have spared his daughter a disturbing imitation of her lost companion. Player-facing item prose intentionally does **not** spoil the true Study mechanism; reveal the connection later through Allen's notes, the Study scene, or a meaningful character inference.

**Optional interaction effect:** Once per scene when explicitly wound, Rufus waddles nearby, wags his tail and chirps a tiny affirmative sound. This is cosmetic roleplay (or a bounded ambient SFX/Tile/Token animation at build time), not an autonomous playable companion, attack, free perception roll, permanent light source or inventory search assistant. A harmless squeaky affectionate response to the name “Rufus” can be narrated at GM discretion.

**Possible kindness beat:** If carried into Sophia's room, the hound's wagging tail and small bark briefly soften the atmosphere. It does not unlock her door, replace her stuffed bear, trigger the Veil, or complete the two-eyes Rufus mechanism.

## Foundry data/verification contract for future BUILD

`attic.roboRufus.partsCollected` stores stable three-part Boolean/ownership identifiers. `attic.roboRufus.assembled` and `attic.roboRufus.itemClaimed` are persistent global campaign state; repeated bench interactions after assembly give ordinary dialogue with no item duplication. Use explicit item pickup and bench interaction, not simple Region entry.

- **Visible anchors**: one identifiable small bench in central attic; three distinct storage rooms in selected attic plan. Collectibles are separate interactive assets rather than permanently baked into map background.
- **Geometry**: the 8×10, 10×8, 12×8 storage room labels and 18×14 central floor are visual-plan candidates, not a measured House Master v2 structural survey. The dashed roof shapes are overhead projections, not walkable polygons or wall collision.
- **Atmosphere**: dry dusty rafters and light floor scatter on eventual battlemaps, neutral diffuse painted illumination; live Foundry lights/sounds control mood.
- **Workflow**: follow established PREPARE → BUILD → STAGE → INJECT → VERIFY → RECEIPT; this document defines content and requirements only.

**Preservation boundary:** the other “Rufus” is the **mandatory taxidermied Study puzzle** requiring two real collectible eye components and yielding an uncharged Gondian power source. **Mini-Robo Rufus is optional and must never displace or trigger that questline.**

**Precedence:** Direct owner directions > House Layout v2 > this optional design > archived pre-v2 House Master v1 where conflicting. Future owner edits to item description supersede this v1 sentence set only where explicitly stated.
