> **HOUSE V2 OWNER OVERRIDE — 2026-10-22:** P24 six-book Spine Mosaic reveals an **in-place concealed compartment inside Sophia's Bedroom** holding one Gond emblem half; there is **no `H-U06` secret-room Scene, doorway or Region**. Source audit below is historical. See [current owner correction](./blueprints/spine-mosaic-compartment-owner-correction-2026-10-22.md).

# Cabin in the Ashen Veil — Foundry Puzzle Requirements Audit

**Date:** 2026-10-22. **Status:** DESIGN / READ-ONLY AUDIT; not an implemented or runtime-verified Foundry system.  
**Sources:** Owner decision catalogue through §27, Parts 1 and 2 of the archived campaign chat, House Master V1, Sune/Keystone v2, Rosewater Bowl and Bathhouse PREPARE, Nine-Scene Grove revision, discovery and scene-creation workflows.  
**Audit result:** Quest dependencies are broadly documented, but Foundry implementation is not yet verified. The earlier 57-node dependency audit found no cycles *in its conceptual model*; it did not test actual puzzle interaction, scene travel, item recovery or softlocks.

## 1. Implementation taxonomy

| Category | Foundry implementation required | Qualification |
|---|---|---|
| Scene background and scale | Scene; canonical gridless battlemap-120 logical scale; art pixel-to-feet transform | Never derive Wall placement directly from image alone |
| Obstacles and doors | Walls; doors/locks, secret passages, vision/sound/movement controls | Keep grounded obstacles separate from overhead tree crowns |
| Entry and exit | Region shapes + verified Teleport Token behavior; matched destination and arrival anchors | Cross-scene party movement and stage-aware destination rewriting are NOT verified |
| Player use/inspect | Explicit interaction on fixture, Note, Tile, item, or a verified Regionwright UI | Entering a Region must not auto-open chests, award items, or solve puzzles |
| Changing art | Tiles or distinct Stage Scenes for major surface changes | Collectibles, altered mechanisms, opened panels and water stages must be stateful |
| Story clues | JournalEntry/Pages and canvas Notes or approved fixture inspection | Keep readable player text out of microscopic background labels |
| Lighting/weather | Native Ambient Lights, Scene darkness/weather, dynamic Regions where justified | Static art uses neutral illumination; horror mood is a runtime layer |
| Audio | Ambient Sound, playlist, sound effects | Optional unless a cue is mechanically required |
| Enemies/haunts | Actors/Tokens, guarded encounter Regions, combat/escape and narration state | Capture/return and Veil behavior changes require special testing |
| Persistent quest state | Versioned logical IDs, shared global flags, item dispositions, per-PC discovery state | Active-GM authority, permission, idempotency and authoritative reread are implementation gates |
| Verification | BUILD validator, staged injector, verified Foundry read-back, test receipt | No live runtime mutation follows from this document |

Official documentation confirms native Regions, Region Behaviors, teleporting, Overhead Tiles, Scene lighting, sound and Notes are available in Foundry v14. Their availability does NOT establish our exact installed Regionwright build or a working Dicebox cross-scene adapter. Sources: https://foundryvtt.com/article/scene-regions/ ; https://foundryvtt.com/api/v14/modules/foundry.data.regionBehaviors.html ; https://foundryvtt.com/article/tiles/ ; https://foundryvtt.com/article/lighting/ ; https://foundryvtt.com/article/ambient-sound/ .

## 2. Canonical puzzle / fixture inventory

Legend: **C** = controlling owner canon or accepted decision; **D** = assistant design under owner delegation; **OPEN** = mechanical/spec gap. All entries are **RUNTIME UNVERIFIED**.

| ID | Maps / player-visible anchors | Foundry requirement | Gate, effect, remaining issue |
|---|---|---|---|
| P01 Oars / Mirror [C] | Shack Oars; full Pond rowboat, submerged boat and Ornate Mirror | Item pickup; boat travel/region route; independent Mirror pickup | Mirror single claim; reversible pond stage must not strand actors |
| P02 Vanity [C] | Art Studio mirror socket and locked drawers | Use Mirror on vanity; keyed Tile state; Brass Tiny Key and Carriage Key items | Both keys claimed once; Studio accessible before Study |
| P03 Carriage [C] | Locked family carriage in Carriage Yard | Key/lock fixture; separate reveal/Journal for Dahlia's remains; Ladder Hook pickup | Never show remains from exterior while locked |
| P04 Attic [C] | Upper Gallery attic hatch; Hook; attic Winder, Minute Hand and one storybook | Locked/useable hatch state, portal, three separate items | Return access preserved, no duplicated rewards |
| P05 Clocks [C] | Foyer grandfather clock and removable Hour Hand; roof chimney clock | Brass Tiny Key lock; glass/hand state; place two clock hands, set noon, press center; Gear pickup | Both hands required; no pre-exposed Gear; clock interaction UI OPEN |
| P06 Four Sune busts [C/OPEN] | SG-05 SW, NE, NW, SE busts; embossed stone sliding-image relief; coin bag + Study Brass Key | Winder interaction, ordered state machine, puzzle UI, stash/reward overlay | Order SW→NE→NW→SE. Initial clue and relief move/solution/reset OPEN. Accessible before Study or pond drain |
| P07 027 [C] | Art Studio painting depicts 027; Great Room distinct 027 lockbox | Inspect painting Journal, combination control, lid Tile, water-filled Dust of Dryness pellet item | Code 027, one pellet; separate from blueprint table |
| P08 Study + 587 [C] | Great Room→Study locked door; Study 587 journal; Shack lockbox | Door Wall/Key, inspect Journal, combination UI, Sluice Crank item | Brass Key controls Study, 587 controls Shack box |
| P09 Sluice [C] | Pond Sluice Gate + crank, pond stage, Bathhouse pool | Explicit crank placement and open/close, shared Scene variant resolver | One global sluice state drains/refills **both** Pond and Bath; Aqueduct remains reachable via SG-07 well |
| P10 Drain finds [C] | Pond submerged steps and Weathered Key; Bath floor Screwdriver | Stage-visible Tiles; item pickup and distinct thresholds | Both items obtainable after one draining, each claimed once |
| P11 Rosewater mosaic [D/OPEN] | Drained Bath wave inlet→three rotatable channel rings→Sune rose→hatch; Reliquary Bowl plinth | Quarter-turn ring states, exact solved configuration, hatch/Wall/portal, Bowl item, dry Boiler Room escape door | Ring angles + physical stair/egress geometry OPEN; no refilling trap; no pressure/boiler requirement for Bowl |
| P12 Basement/nightstand [C/OPEN] | Basement Weathered Key door; Workshop repair tool; Parents broken nightstand | Door lock, repair tool & Screwdriver identity/requisite rule, drawer Tile, Gate Handle item | Correct role of both repair tools must be reconciled, without relocating screwdriver into workshop |
| P13 Aqueduct gate [C] | Drained Pond Aqueduct threshold; roof Replacement Gear and Parents Gate Handle | Two-item assembly, gate Wall, paired portal to Aqueduct | Both required; safe travel and backtracking |
| P14 First chase [C/OPEN] | Aqueduct corridor→forest well SG-07; visible Gondian charger | NPC Token, guarded event Region, encounter/audio, chase escape and return | First Crooked Man pursuit; optional capture max one player at once; runtime/escape/GM-reset OPEN |
| P15 Waterworks [C/OPEN] | Utility room valves/gauges, Greenhouse-line debris, reward compartment | Sluice CLOSED gating; debris clear via hand/tool or Athletics/Sleight of Hand/Acrobatics; pressure state; compartment Tile, warning Journal, Rufus Collar Item/equip effect | No DC yet. Restores Greenhouse water and Bathhouse boiler feed. Collar grants psychic-damage immunity **while worn** under owner canon, but precise item effect/attunement and balance are OPEN. Exact pressure solution OPEN |
| P16 Boiler healing [C/OPEN] | Boiler control; Bathing Hall pool, steam/hot-water visuals | Boiler UI, dynamic temperature FX, approved Actor heal interaction | Only when sluice CLOSED + pool FULL + Waterworks RESTORED + boiler solved + water HEATED. Amount/frequency/Veil rules OPEN |
| P17 Second chase [C/OPEN] | SG-05 NW bust during later return; Silver Tiny Key | Late-state Region condition on **both** dormant/activated Grove versions; NPC chase, drop item | Must not trigger during early four-bust sequence; exact arming timing and bypass OPEN |
| P18 Hope Chest [C] | Parents Hope Chest, Music Box and Prayer of Protection | Silver Tiny Key opens chest; box action/Journal “Read prayer?” | Separate from Prayer of Devotion; once-only items |
| P19 Candle Workshop [C] | Studio Sune altar + concealed east access; separate Workshop Wick | Explicit Protection Prayer use, Tile+secret Wall open, Studio↔Workshop travel, Wick pickup | Workshop not exposed early; prayer requires verified item/fixture interaction |
| P20 Gazebo lantern [C/D] | Gazebo lantern behind webs; oil from Shack, Wick from Workshop; Rufus eye #2 | Place oil+wick, trigger light/FX, web overlay vanishes, one eye pickup | Optional delegated picnic-table puzzle gives nonessential Surveyor's Rule; not a new story gate |
| P21 Sophia/eye 1 [C] | Parents coat Old Iron Key; Sophia bedroom door and torn bear | Door/key; inspect bear; Eye #1 pickup | Distinct from late eye #2 |
| P22 Rufus [C] | Study preserved Rufus, TWO empty sockets, jaw button, closed chest | Two specific eye sockets/Tile states, jaw reveal, source item pickup | BOTH eyes mandatory; no power source early |
| P23 Charger→Crimson Veil [C] | Aqueduct Gondian charger | Explicit charge action, Item charged variant, atomic campaign phase update; lights/weather/sounds/book-spawn/chase-policy update | **Charging alone** triggers Veil; calendar/nightfall does not. No extra charging minigame |
| P24 Six storybooks [C/OPEN] | Sophia shelf two, Pond log one, Attic one, Roof flue one, sixth Sophia **bed** only after Veil; Spine Mosaic | Six unique items/placements; publication-order interface; secret Spine Room Wall/Region; Gond emblem half | Exact formal publication order and hints OPEN. No sixth book in Gazebo/Boathouse |
| P25 Privy fishing [C/OPEN] | Privy Copper Tiny Key #3; Pond Old Fishing Rod | Veil-controlled privy door; Regionwright Hunting & Gathering minigame parody or clever alternate retrieval | Item once; exact module integration and bypass OPEN |
| P26 Lye→Greenhouse→Boathouse [C/OPEN] | Bath soap-room glass lye case, Greenhouse mixing bench, Pond far-dock vegetation, Boathouse Prayer of Devotion | Copper-key case lock; lye; recipe UI + Waterworks feed; vegetation Tile/Wall change; boat portal; Prayer Journal | Lye is Veil-gated, no Boathouse book; recipe & bypass OPEN |
| P27 Sune emblem [C] | Studio Sune shrine | Devotion Prayer use, controlled altar reward, Sune emblem half | Separate from P19; no interchangeable prayer outcomes |
| P28 Vault [C/OPEN] | Basement secured Vault, four-condition mechanism and Keystone plinth | Basement access + CHARGED power source + Gond half + Sune half; item checks, mechanism, door Wall, Keystone pickup | Exactly four Vault conditions; Scrying Bowl is not here; exact actuator/geometry OPEN |
| P29 Bowl/Undercroft [C/D] | SG-05 statue empty hands, Reliquary Bowl and 027 pellet, channels/hidden Undercroft stairs | Bowl place, pellet insert, Stage Scene switch, access portal | Opens **outer** Undercroft only; active state persists and late NW chase survives both variants |
| P30 Keystone door [C/OPEN] | Undercroft Approach sealed ornate door; Donovan/Sophia remains **behind** it in Refuge | Inspect Journal/socket, Keystone use, controlled Wall/portal, transition to Refuge, route to Ritual | No spoiler vision leak; inner-face digging only behind door; final Voss access and encounter OPEN |
| P31 Cross-campaign haunting [C/OPEN] | Occasional Shadow That Sees eye reveals, Crooked Man, five family haunts, cat/fish optional | Sparse Discovery Regions and stateful Tiles; Actor Tokens, audio, journal fragments; party/GM recovery | Per-PC one-roll Notice where Discovery standard applies. Shadow eye appears only after spotting. Crooked Man switches targets during Veil; optional buffs/cat rules OPEN |

## 3. Shared persistent state contracts (semantic proposals, not installed flags)

**Sluice and baths:** sluiceState OPEN/CLOSED → pondLevel and bathLevel together. Distinct flags: greenhouseLineClear, waterworksRestored, boilerFeedRestored, boilerSolved, waterHeated; computed bathHealingEnabled. NEVER make bathHealingEnabled a separately writable truth that can disagree with pool or pressure.

**Shrine & underground:** bustProgress, reliefSolved, four bust stage-specific states, suneBowlPlaced, pelletInserted, groveActivated, undercroftDoorUnlocked, vaultOpen, ringAngles[3], rosewaterSolved, reliquaryServiceDoorOpen.

**Progression:** studyUnlocked, basementUnlocked, aqueductGateUnlocked, mazeGateOpenedFromInside, candleWorkshopRevealed, spineMosaicSolved, firstChaseComplete, secondChaseArmed, secondChaseComplete, crimsonVeilActive.

**Item provenance:** stable logical identities and ownership histories for the Mirror, Oars, Fishing Rod, all keys, Ladder Hook, Clockwork Winder, clock hands, Replacement Gear, Sluice Crank, Screwdriver, Workshop repair tool, Gate Handle, both Rufus eyes, Lantern Oil/Wick, six books, Collar, two prayers, both emblem halves, pellet, Bowl, Gond source with charged state, lye/mix, Keystone, optional Surveyor's Rule. Do not invent real Item UUIDs. Use an explicit one-claim transaction per reward and idempotency key.

**Per-PC state:** discovery noticed/interpreted/recovered, optional Shadow sightings, capture state. Scene-only flags cannot replace the world-level stage for Pond/Bath/Veil.

**Every significant event must:** recheck active authorized GM and exact world; validate actor/range/allowed item/action/stage; update world state and item/scene documents safely; record receipt; reconcile on partial failure; on replay give no duplicate item, repeat unlock or extra chase. Region enter can also fire on token creation or behavior activation in core Foundry, so proximity alone cannot award a reward.

## 4. Required live test matrix

| Test | Functional PASS criterion |
|---|---|
| T01 Routes | Paired safe arrival Regions for all 43 logical locations, including nine Grove scenes; correct direction, Medium footprint, multi-PC movement, reversible paths |
| T02 Collision | Doors/Walls block movement/vision/sound appropriately, secret spaces stay secret; overhead trees never create false impassable trunks |
| T03 Items | All unique pickups, consumption/installation, loot state and transfers are idempotent after reload and concurrent PCs |
| T04 Early Sune | Four busts + Winder + sliding relief open Study chain **before** Study/drain; late NW chase does not fire |
| T05 Water | Single sluice control affects Pond AND Bath; return through forest well remains accessible |
| T06 Rosewater | One drain grants Screwdriver and Bowl route; wrong rotations reversible; safe Boiler exit before refill; no token trapped by stage change |
| T07 Pressure/healing | Pressure impossible while sluice open; restoring waterworks feeds both destinations; boiler/heal needs all five conditions |
| T08 Two chases | First chase toward well; later one at NW bust on either Sune scene stage, Silver Key recoverable; GM/player recovery |
| T09 Veil | Rufus requires both eyes; source charged only at Aqueduct; Veil synchronizes scenes and bed storybook exactly once |
| T10 Books/late | Six book chronology yields Gond half; Privy key→lye→Greenhouse→Boathouse→Sune half; reversible pond access |
| T11 Finale | Vault with exactly four requirements awards Keystone; Bowl+pellet open outer Undercroft; Keystone opens inner door with hidden remains behind it |
| T12 Haunts/FX | Discovery density/anti-farming; appropriate Shadow visual states, dynamic lights, ambient sound/walls/occlusion, Veil enemy behavior |

## 5. Blockers and decisions to resolve in order

**Runtime adapter gate:** Inspect connected Foundry version, dnd5e version, installed Regionwright and Dicebox modules, active GM permissions, actual Region behaviors and item-interaction provider. Upstream core documentation is *capability evidence*, not evidence our own implementation works. No tested cross-scene logical routing or party-wide stage transfer is established.

**Map calibration:** Owner-approved Carriage Yard art is 1536×1024 but PREPARE proposed 160×115ft, whose battlemap-120 canvas would be 3840×2760 and a different aspect ratio. Reconcile physical bounds, image transform and portal locations before Walls/Regions. Do not alter artwork merely for aesthetics; do not silently stretch or change token scale.

**Puzzle specs OPEN:** Early bust-order clue; sliding relief arrangement/reset; Foyer grandfather-clock fixture/stair clearance; dual repair-tool semantics; exact Waterworks valve puzzle; three Rosewater ring solution angles; late chase arming; boiler healing limits; six-book publication order; greenhouse recipe; native/Regionwright fishing adapter; Keystone/Vault final actuator and Voss access.

**Horror/reveal:** Pre-ritual maps use atmospheric dread rather than gore; Dahlia remains inside locked carriage, Allen near Great Room hearth (delegated staging), Donovan/Sophia only beyond sealed Keystone door, one unborn-child grave at SG-05, later ritual chamber layout deferred by owner.

## 6. Production and verification boundary

Follow the established Dicebox workflow with owner-authorized Halloween FAST and Good Enough art inspection: PREPARE → structural evidence and inspect → Feature Manifest/Blueprint → painted art FINAL_INSPECT PASS → validated single-Markdown-macro BUILD → STAGE → authorized INJECT → Foundry VERIFY → RECEIPT. Visual PASS is not runtime PASS. The global Discovery Standard limits ordinary scenes to 0–1 planned discovery, maximum 2 without a designated special exception. No invented rarity/DC just to populate every scene.

Every eventual runtime receipt should identify: canonical feature and puzzle IDs, image hash, Blueprint/manifest hash, build hash, Foundry runtime and system versions, active-GM authority, real Scene ID, Wall/door/Region/Tile/Light/Sound/Note/Item/Token counts and IDs, exact test outcomes and authoritative reread. The audit makes **zero** claims of deployed gameplay mechanics.

**Related:** [43-scene object register](./foundry-scene-object-register-2026-10-22.md), [Decision catalogue](./campaign-decision-catalogue-2026-10-20.md), [Bathhouse PREPARE](./bathhouse-map-prepare-cluster-v1-2026-10-21.md), [Rosewater decision](./rosewater-reliquary-bowl-decision-2026-10-21.md), [Grove plan](./grove-nine-scene-and-estate-refinement-plan-2026-10-22.md), and repository docs/DICEBOX-AUTOMATED-SCENE-WORKFLOW-2026-10-05.md, docs/DICEBOX-EXPLORATION-DISCOVERY-STANDARD-2026-10-05.md, docs/FOUNDRY-API-BINDING-MATRIX-2026-08-21.md.
