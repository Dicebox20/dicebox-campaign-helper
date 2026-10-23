> **SG-05 OWNER CORNER-BUST GEOMETRY OVERRIDE (2026-10-23):** The owner moved the four winding busts from old SG-05 quadrants onto the four **independent perimeter-corner maps**: **SG-07 SW Rose, SG-03 NE Star, SG-01 NW Moon, SG-09 SE Sun**. Their order, Clockwork Winder, shared counter/reset behavior and LOCK-01 reward chain are unchanged. **SG-05 central Memorial Clearing** instead has *one Sune statue with empty hands, closed sliding relief at its base, a readable early clue bench, one child grave and hidden Bowl/pellet Undercroft access*. This later direction **overrides the spatial phrases in LOCK-01 and LOCK-09 naming four SG-05 busts or an NW SG-05 bust**; do not bake those older coordinates into images or Foundry. The **late NW-bust Crooked Man chase** must undergo route-anchor reconciliation to the actual NW corner bust **SG-01** while preserving original arming conditions and one-time Silver Tiny Key reward; this relocation is a documented implementation dependency, not a claim of live verification. **Controlling revised PREPARE:** [SG-05 replacement v3](./sg-05-memorial-clearing-prepare-v3-2026-10-23.md). The historical text below is retained for provenance.  

> **LATER OWNER OVERRIDE — 2026-10-22:** References below to a separate `H-U06 Spine Hidden Room`, `spineRoomOpen`, a bookcase doorway, or a Region portal are **superseded**. Six ordered books unlock a **concealed bookshelf compartment within Sophia's Bedroom (`H-U05`)** containing the single Gond emblem half; state is `spineCompartmentOpen`. The six-book chronology, Veil-only sixth book, and four-input Vault remain unchanged. See [owner correction](./blueprints/spine-mosaic-compartment-owner-correction-2026-10-22.md). This note preserves the original v1 decision text as historical evidence.

# Cabin in the Ashen Veil — Puzzle Canon, Rules and Foundry Implementation Specification v1

**Recorded:** 2026-10-22  
**Decision status:** **OWNER-DELEGATED DESIGN LOCK, version 1**. The owner explicitly authorized finishing remaining puzzle choices and writing them durably after researching Foundry/community practice. All prior explicit owner canon remains controlling. Detailed solutions below are **assistant-selected under that authorization**, not retroactive quotations from the original conversations.  
**Implementation status:** **DESIGN ONLY / no Foundry mutation or runtime verification**. Scene measurement, native capability probes, Regionwright adapter testing, and actual implementation receipts are separate gates.  
**Intended use:** Single authoritative location for puzzle solutions, clues, rewards, global state, map must-show features, softlock and test rules. Supersedes historical OPEN markers **only for the questions actually settled below**. Preserve earlier source evidence, do not erase it.  
**Scope exception:** The owner previously directed the **final Ritual Chamber to be designed last**. This locks the puzzles **up to its threshold**, plus the narrative reason Voss reached it, but does not pre-author a final combat map or invented Vharzagul encounter statistics.

## 0 — Invariants; do not reinterpret

1. One individual physical house room per Foundry scene. Sune's Grove is **nine woodland maze scenes**, SG-05 is the **center Memorial Clearing**, and no separate tenth memorial is invented. About **43 logical locations** remain a working count, with variant backgrounds counted separately.
2. The Carriage Yard painted background is **owner accepted**. The Halloween art test is **Good Enough**: required elements and links readable, and no serious mutations. This NEVER waives puzzle logic, collision, safe transitions, or persistent-state correctness.
3. Scene art contains static geometry. Moveable rewards, keys, hidden rooms, opening panels, clocks, books, phase effects and foundry lighting remain **separate interacting objects/overlays** where they change.
4. Sune: 4 busts **SW → NE → NW → SE**, early embossed stone sliding relief, reward 1,000 gp + Brass Study Key. Different late NW bust encounter yields **Silver Tiny Key**. Later Bowl + **filled 027 pellet** opens the **outer** Undercroft. Neither early Study progress nor Bowl requires the Vault.
5. Vanity Mirror → Brass Tiny Key + Carriage Key; carriage holds Dahlia remains and Ladder Hook; roof clock with Hour/Minute Hands at **12:00** yields Replacement Gear. Study 587 → Shack Sluice Crank; drained Pond Weathered Key and Bath Screwdriver; repaired parents' nightstand Gate Handle; Gear + Handle open Aqueduct.
6. Separate 3-ring **Rosewater Reliquary** beneath emptied Bath; independent Scrying Bowl. Keep dry emergency exit to Boiler Room. Waterworks first; Boiler heat second; Bath healing requires all five already established water/heat predicates.
7. Return to late NW bust → second chase/Silver Key → parents' Hope Chest/Music Box/Prayer of Protection → Studio hidden Candle Workshop/Wick → Gazebo oil+wick/Eye #2; Sophia bear contains Eye #1; Rufus both eyes → uncharged Gondian source. Charge at **Aqueduct without extra puzzle** → triggers Crimson Veil exactly once.
8. Two books originally on Sophia's shelf; Pond hollow log, Attic, chimney flue; last-acquired sixth appears **on Sophia's bed when Veil starts**. All six arranged by publication order unlock Spine Hidden Room/Gond half. Veil Privy Copper Tiny Key → Bath Soap Room lye → watered Greenhouse fictional plant killer → Boathouse Prayer of Devotion → Studio Sune shrine/Sune half.
9. **Exactly four Vault predicates:** basement access, charged source, Gond half, Sune half. Vault prize is **Keystone**, not Bowl. Keystone opens thick ornate **inner** door in Undercroft; Donovan's and Sophia's remains/scratches are **on the interior side**, with a further hall toward Voss.
10. The old house's protective haunts and the contemporary demonic intrusion are **not the same force**. Vharzagul is an **original yugoloth/yagnoloth**, not a demon. Pre-summoning visual horror uses anxiety, mourning and neglect, **not gore**. Dahlia is the last fatality **during the assault**, while Donovan and Sophia die **later** in trapped refuge.

## 1 — Explicit chosen puzzle solutions and GM-facing evidence

### LOCK-01: Four-bust puzzle clue and state machine

- **Fixture:** four recognizable busts at SW, NE, NW, SE of SG-05. Each has a Clockwork Winder socket and a unique engraving, in order: **SW = Rose**, **NE = Star**, **NW = Moon**, **SE = Sun**. Keep sockets visible and within token reach; no required arbitrary discovery roll.
- **Pre-Study clue (new locked placement):** inspectable engraving on a **stone bench at SG-05**, accessible from the west shrine approach immediately. A duplicated, weatherworn hint on **SG-02 Processional Path** is optional redundancy, not a separate prerequisite.
- **Exact player handout:** “First, a rose sheltered from the northern wind. Second, the star over the eastern hills. Third, the moon above the western trees. Last, the sun returning to the southern path.” A simple inset four-corner drawing depicts the matching rose, star, moon and sun carvings and compass orientation. GM cue: **SW→NE→NW→SE**.
- **Operation:** a player with the Winder explicitly interacts with the bust sockets in that order. Correct step advances counter 0→4, audible clockwork click via optional Sound, and a temporary brass pointer turns on that plinth. On wrong step reset counter to 0 **without consuming Winder or locking access**; all previous pointers return to idle. Completed stage permanently exposes the statue-base embossed picture relief. Repeating any use after solved is harmless.
- **Do not confuse** an early NW winding action with the later NW-bust Crooked Man chase. They have separate semantic anchors and phase predicates.

### LOCK-02: Sune statue stone relief sliding-picture puzzle

- **Visible fixture:** embossed stone **3×3 sliding relief** on Sune statue base, eight movable square stone plates and one intentional empty gap. The relief depicts a family garden picnic assembled into a single image when solved; its numbered schematic for GM/UI can be hidden from players.
- **Locked solved order (row major):** 1,2,3 / 4,5,6 / 7,8,EMPTY. The UI may use image segment fingerprints rather than showing numbers.
- **Locked initial order (guaranteed reachable by legal slide moves):** **4,5,1 / 2,EMPTY,8 / 7,6,3**. This board comes from a valid 14-move scramble of the solved arrangement. No runtime randomization.
- **Allowed move:** one square into the horizontally/vertically adjacent empty slot. No diagonal exchanges, tile duplication or unrestricted drag. Use a close-up UI separate from the base map if needed.
- **Feedback:** newly connected border engravings form an unbroken floral stem; no failure penalty. On exact solved order, stone catches retract to reveal a small recess with a cloth bag of **1,000 gp**; lifting the bag reveals the **Brass Study Key** beneath the lining. The bag and key must be separately claimed once. Refuse auto-award solely on walking near the statue.
- **Fallback:** a GM-only open/reconcile action reproduces the solved state and outstanding unclaimed rewards, with audit note, if the puzzle UI fails. Never create a second key.

### LOCK-03: Clock, clock face, 027 and 587 mechanisms

- **Brass Tiny Key #1** fits the Foyer grandfather clock glass only. Once opened, the oversized **Hour Hand** becomes explicitly recoverable; other clock objects remain intact.
- **Roof clock:** two distinct receptacles for Hour Hand and attic **Minute Hand**. Only after both inserted can the players rotate the hands; minute/hour set to **12:00**, then a separate center-button interaction unlocks the **Replacement Gear**. Button before correct time gives an ordinary mechanical resistance. Hand insertion remains persistent and reversible without dropping items.
- **Studio painting** contains the recognizable chest and the three legible digits **027**. **Great Room lockbox** explicitly accepts three digits 0-2-7; lid opens and player physically takes the water-filled Dust of Dryness pellet. No random roll to discover a code which is already readable.
- **Study's Allen note** visibly records **587** and indicates it belongs to the groundskeeper's box (not to the Study lock). Shack 587 box grants the **Sluice Crank**, with a one-use installation at the Pond sluice and unlimited open/close operation thereafter.
- **Repair semantics resolved:** Bath-floor **Screwdriver** is the actual required tool to repair the broken **Parents' Bedroom nightstand**. The Basement Workshop's separate **General Repair Kit** remains a real optional utility item that gives ordinary narrative tool assistance but **is not a second mandatory gate** for the nightstand. The repaired drawer exposes the **Gate Handle**. This avoids secretly introducing a new prereq.

### LOCK-04: Sluice and flood-state contract

- Initial sluice = **CLOSED**; Pond and Bathhouse FULL. Installing Crank unlocks its control, but does not force drainage.
- Opening sluice = **OPEN** causes Pond and Bath to switch together to drained stage, revealing the submerged Pond stair/Weathered Key and the Bath Screwdriver/mosaic. The **Aqueduct** gate becomes physically visible when drained; once separately opened it remains reachable via the SG-07 Well if the pond refills.
- Closing sluice = **CLOSED** causes both levels to refill. From then on, Waterworks pressure puzzles can run. Refilling does not unclaim drained rewards or reset Rosewater solution.
- **Safe swap interlock:** If a party token is on a drained pool floor, climbing the floor hatch stairs, or in unsafe shoreline transit, a sluice CLOSE request is held **pending** with immediate in-fiction feedback. Transfer to marked safe landings first, then complete one water-state change for all participating PCs. The dry Reliquary↔Boiler passage remains usable regardless of water level and Boiler puzzle stage. Never teleport a PC into solid water, delete a PC, or move another player's token without authorized, verified transfer.
- The opposite OPEN action likewise validates travelers on boats/far shore against the drained geometry, keeping stable route access. The vessel may remain a separate controlled transport item.
- Implement Pond/Bath visual stages through a single stage resolver; no independent per-scene truth for water level.

### LOCK-05: Rosewater three concentric rings

- **Where:** Bath pool floor, about 12–15 ft across, visible and reachable **only when drained**; a wave inlet is fixed at **north/12 o'clock**, center rose at exact center. Ring angles measured **clockwise from the canonical unrotated art**.
- **Controls:** outer, middle, inner independently increment 90° clockwise per explicit click; legal state {0,90,180,270}. Initial angles **(0,0,0)**.
- **Unique solved tuple:** **outer 90°, middle 270°, inner 180°**.
- **At the solved tuple**, water groove path joins: exterior **N inlet → outer inner E endpoint → middle inner S endpoint → central rose**. For asset construction, each unrotated ring's engraving endpoints are:
  - outer ring: outer **W**, inner **N**;
  - middle ring: outer **S**, inner **W**;
  - inner ring: outer **N**, inner **center rose**.
  Rotate these exact drawings by the solved tuple; decorative asymmetry is essential so the rendered solution is actually unique.
- On success ring alignment persists; retract central hatch and expose safe stairs to separate **BATH-04 Rosewater Reliquary**. Taking Bowl is explicit and exactly once. From inside Reliquary, unbolting the **east-side dry service door** opens a passage to Boiler Room **without** boiler or Waterworks requirements.
- Upon refill hatch re-seals watertight while the ring solution remains recorded; another drainage may reopen it. The dry Boiler route permits repeat access.
- Puzzle is visual/manual, **no screwdriver cost**, no random timer or mandatory DC. Drawing, clip and portal safety remain mechanical tests during PREPARE/BUILD.

### LOCK-06: Aqueduct main and first Crooked Man chase

- Pond Aqueduct gate opens only after player installs both Roof **Replacement Gear** and repaired-nightstand **Gate Handle**; locks once open. No additional gear pieces.
- Main Aqueduct shows the Gondian charger and Waterworks side door as discoverable fixtures, even if not yet operable. First Crooked Man chase begins only on the party's **first meaningful inward traverse** after gate completion.
- **Skill challenge (new):** three successful escape maneuvers before two failures, **DC 13** with Athletics, Acrobatics, Stealth or Survival and appropriately described actions; no one character repeats identical tactic twice consecutively. A valid creative use of environment can supply a success without rolling at GM discretion. A failure causes a momentary stumble/pressure, not direct damage; a second failure may allow the Crooked Man to seize **one** character, never all characters in an unattended automatic macro. Noncaptured players escape toward SG-07 Rootbound Well.
- Captured PC goes to **Sophia's Bedroom** through the protective haunt, with correct bedroom/stage/permission checks. Recovery by companions, suitable spell, or GM emergency release at approximately **20 real minutes**, avoiding indefinite solo confinement. Record first chase complete after successful escape or resolved capture, never repeatedly retrigger on every Region entry.
- The **well remains bidirectional** from Aqueduct even after pond refills. Enter/exit Regions require tested safe positions.

### LOCK-07: Waterworks utility pressure puzzle #1

- Supply branches remain **Pond**, **Bathhouse**, **Greenhouse** (not Grove). The **sluice must be CLOSED** to power gauges, otherwise controls give an unpressurized response.
- **Greenhouse line obstacle:** stones, roots, old dirt/debris in an accessible service opening. Explicit clear action with hands or appropriate tools: **DC 12 Athletics, Sleight of Hand, or Acrobatics**. Tool use provides advantage when narratively appropriate. Failed attempt costs a few minutes and scatters more debris; can retry, switch skill/tool or take careful time to clear without check. No consumable and no permanent hard gate.
- **Three four-position valves**, clockwise positions **0,1,2,3**: Pond P, Bath B, Greenhouse G. Gauge values are integers from 0 to 4, computed with clipping:
  - Pond gauge = clamp(1 + P + B − G, 0, 4)
  - Bath gauge = clamp(1 + B + G − P, 0, 4)
  - Greenhouse gauge = clamp(1 + G + P − B, 0, 4).
- **Locked initial valves:** (P,B,G) = **(0,1,3)**. When active and debris cleared the initial gauges read **(0,4,3)**. Before debris removal the Greenhouse gauge instead reads JAMMED, but its physical valve is visible.
- **Goal:** all three gauges simultaneously at **3 / etched safe mark**. The unique legal solution for 0..3 valves is **(2,2,2)**. As one valve moves the other gauge readings change. Press a separate **Balance/Lock** lever while gauges read 3/3/3. Wrong positions return a harmless hiss and preserve current valve positions.
- **Mechanically:** the stabilized solution restores **both** Greenhouse sprinklers/mixing water and Bathhouse Boiler feed. It also opens the **small existing same-scene** maintenance compartment containing Allen's warning note and **Rufus's Collar**. No new utility sub-scene.
- **Clue / second chase prompt (readable journal):** “The greenhouse supply is mended, but Sophia always wandered back to her mother's northwestern rose when the garden turned cold. I must see to the shrine before the night sets in. I should have told her how to find her way home.” This is the intended late return to SG-05 NW bust, **not** a Grove plumbing pipe. It should be readable even if the Collar is not taken.
- **Collar:** psychic-damage immunity **while worn**, one physical unique Item. No attunement as chosen designer default; exact dnd5e item/effect adapter must be runtime tested. Cosmetic acquisition does not grant immunity while unequipped.

### LOCK-08: Boiler pressure/heating puzzle #2 and healing

- Separate **BATH-03 Boiler Room**, with two four-position wheels **Intake I** and **Vent V**, gauges named **Boiler Pressure** and **Circulation** and a separate **Engage Boiler** lever. Waterworks restoration and closed sluice are required for operation; boiler puzzle has no authority to override source water level.
- **Initial wheels:** (I,V) = **(0,3)**. Gauges when active: Pressure = clamp(1 + I − V, 0, 4); Circulation = I + V (0..6).
- **Mechanical instructions in an inspectable bronze maintenance plate:** “Before engaging heat, bring pressure to **2**, circulation to **3**.” Exactly one valid (I,V) pair satisfies both readings: **(2,1)**. Wrong engagement causes only a hiss; knobs persist, no timed failure, no explosion.
- On correct engagement, set boilerSolved and heat capability. If water is present and supplied, waterHeated becomes true and neutral static pool art gains Foundry-controlled steam/sound/light. If sluice reopens, hot water immediately ceases and **healing eligibility** becomes false; puzzle solution remains solved so reheating automatically resumes on safe refill.
- **Healing effect locked:** A willing conscious player character deliberately chooses **Rest in heated bath** outside combat and spends **10 in-world minutes**. Recover **4d8+8 hit points**, up to maximum, **once per character per completed long-rest cycle**; it grants no short/long rest by itself, restores no spell slots or exhaustion, does not revive dead or unconscious characters, and does not cleanse conditions automatically. If GM has not verified a rest cycle, the PC stays used until reset by an explicit GM-authorized long-rest event.
- **Five mandatory eligibility gates**, checked at use: sluice CLOSED, Bath pool FULL, Waterworks restored, Boiler puzzle solved, water currently HEATED. In Crimson Veil, bath healing can still function if all physical prerequisites are met; fiend intrusion does not erase the family's aid.
- A failed eligibility check provides clear feedback but consumes no per-PC use.

### LOCK-09: Exact second chase and Silver Tiny Key timing

- Completing LOCK-07 **and reading/acknowledging Allen's exposed warning note** arms the second chase, provided the first chase finished, the late NW encounter has not occurred, and Crimson Veil is not active. A fallback **GM-recoverable “Read waterworks note” action** remains available on return so the party cannot permanently miss the note.
- The trigger is entering the **SG-05 NW bust's clearly localized late encounter perimeter or intentionally examining it** after arming. The same predicate must be installed on both Dormant and Activated SG-05 variants and guard against activation by merely creating/migrating tokens. The ordinary SW→NE→NW→SE early puzzle uses a separate state machine and never triggers the late chase.
- **Chase mechanics:** reuse LOCK-06's **3 successes before 2 failures, DC 13** with situational environment alternatives, targeting at most one player capture per chase. Route along SG-05 → SG-04 → SG-07 or SG-02/SG-03, maintaining return access; do not force non-existent direct scenery transitions. A captured player receives the same emergency release protection.
- At chase completion Crooked Man loses/drops the **Silver Tiny Key** in a clear marker by the NW bust's stone lip in SG-05; the key remains there until explicitly collected, regardless of party escape route. This once-only appearance is **recoverable even after scene swaps**.
- The Silver Tiny Key opens the Parents' Hope Chest and the **Ornate Music Box** which contains **Prayer of Protection**. Use an explicit “Read prayer?” Journal action. This all occurs **before** Aqueduct charging/Crimson Veil. After Veil, Crooked Man no longer hunts PCs; if event was skipped, a GM recovery grants the queued key without reviving hostile chase behavior.

### LOCK-10: Candle Workshop, Gazebo and Rufus eyes

- Reading **Prayer of Protection** at Dahlia's Art Studio Sune altar opens the concealed east passage to the **independent Candle Workshop**; the Studio painted background remains initially sealed. Collect one **Wick** there.
- Collect **Lantern Oil** freely from Donovan's Shack. At the Forgotten Gazebo, install oil and Wick **in either order**, then interact with the lantern to ignite it. Event clears cobwebs via a temporary Foundry effect and reveals **Rufus eye #2** as explicit single pickup. The lantern extinguishes or remains functional for ambiance after the trigger; the eye cannot respawn.
- **Optional independent gazebo puzzle (owner-delegated):** a stone family picnic table has three rotatable motif disks, **Rose, Cog, Star**. Each disk aligns its motif **toward the table center** to open a small compartment with **Allen's Folding Surveyor's Rule**, a nonmagical measuring tool useful for interpreting the intentionally altered player house blueprint. This puzzle does not gate Wick, Rufus's eye, the Shrine, emblems, Bowl, Vault or final chamber. A painted tabletop inlay shows inward arrows, so no external clue is required.
- **Rufus eye #1** is sewn inside Sophia's torn bear, accessible after unlocking her room with the Old Iron Key from Parents' coat. Rufus remains in Allen's Study with **two visibly empty sockets**. Explicit installation of distinct eyes allows jaw button interaction, then a body compartment opens yielding one **uncharged Gondian power source**.
- Bringing source to the Aqueduct charger is **one deliberate use action with no extra minigame or resource**. On success charge source once, begin Crimson Veil atomically and persist rehydration for all Scenes. The charging fixture was visible during first Aqueduct chase so it is a remembered destination.

### LOCK-11: Six storybooks and Spine Mosaic

- **Formal publication order, earliest → latest (newly locked):**
  1. **1442 DR** — *The Knight Who Befriended a Dragon*.
  2. **1443 DR** — *Moonlight and the Missing Stars*.
  3. **1444 DR** — *Felix Fox and the Forgotten Kingdom*.
  4. **1445 DR** — *Whispers of the Little Witch*.
  5. **1446 DR** — *The Clockmaker's Starless Sky*.
  6. **1447 DR** — *Princess Penelope and the Sea of Stars*.
- **Physical placements:** two preplaced on Sophia's bookshelf = *Knight* (1442) and *Whispers* (1445); Pond hollow log = *Felix* (1444); Attic = *Moonlight* (1443); chimney flue = *Clockmaker* (1446); Sophia's **bed only after Crimson Veil** = *Princess Penelope* (1447), the sixth/recovered-last book.
- **Fair clue:** each item has a **readable publication year in its inspectable Journal handout**, and the bookshelf's short spine mosaic inscription states “Put your stories in the order they came, from the oldest tale to the newest name!” The game's order is **publication year ascending** rather than alphabetic; no blind lore roll required. Two present books can be moved during solution; their starting places are not fixed.
- Player interact UI has six named/reorderable book slots; validate exact ID order and possession/presence across shelf plus inventory. Correct order reveals the separate **H-U06 Spine Hidden Room** and one **Gond half** of the interlocking emblem. An incorrect placement can always be undone; solving does not delete any storybook.
- Scene visuals hold initially **two** slots filled, four gaps; stage-specific bed book is a separate Tile/Item so Veil does not imply it has always been there. No book is added to Gazebo or Boathouse.

### LOCK-12: Privy, lye, Greenhouse mix, far dock and Boathouse

- **Privy:** becomes available at Veil. **Copper Tiny Key** (the third Tiny Key) is in a disgusting little retrieval location. **Preferred UI:** the existing Regionwright/Hunting & Gathering fishing parody if its exact integration is verified; label the resulting catch **Legendary Fish**. **Required fallback independent of module:** use Old Fishing Rod, hook, tongs or another reasonable improvisation and succeed at **DC 12 Sleight of Hand or Survival**. Failed roll costs a few minutes but can be retried; alternative careful retrieval without a roll is allowed with sufficient ordinary tools. No mandatory external module or permanent fish RNG gate.
- Copper key opens the **glass lye case in BATH-02 Soap Room**. The lye is a purely fictional in-world puzzle Item; content must not provide real-world chemical proportions or actionable caustic mixing instructions.
- **Greenhouse** has a fixed sprinkler/mixing station usable when Waterworks is restored. **Locked fictional recipe:** first activate **Greenhouse irrigation water**, second add **Thornroot Ash** from the greenhouse workbench, third add the **quest-item Lye**, then operate the **Engraved Mixing Lever**. These are story labels and game states, not a real mixture. An engraved greenhouse leaf/gear diagram clearly shows droplet → ash-leaf → sealed jar → lever, so no obscure hidden recipe. Wrong order yields a harmless reset **without consuming** unique ingredients.
- Correct action yields a single reusable **Plant-Killer Flask** (game Item) which affects only designated magical thorn-growth on the **far Pond/Boathouse dock**. Its one scripted use clears that obstacle persistently, even if the item is later lost; no real chemistry is modeled. Pond must be FULL for normal rowboat access.
- Far Boathouse contains **Prayer of Devotion**, with a player-readable full Journal and single pickup. Use this specific prayer at the **Art Studio Sune altar** to obtain **Sune emblem half**; Prayer of Protection continues to serve only the Candle Workshop. Keep both altar actions independent and idempotent.

### LOCK-13: Vault actuator, Keystone, Undercroft and Voss access

- **Four and only four Vault readiness predicates:** (A) party has legitimately reached the Basement by Weathered Key; (B) Gondian source is **charged** at Aqueduct; (C) Gond emblem half recovered from Spine Room; (D) Sune emblem half recovered from Studio altar. Physical Vault controls: charged-source socket, **two** emblem-half sockets forming one round rose-and-gear actuator, and a final **Turn Joined Emblem** action. Basement access is satisfied by location context, **not a fourth extra inserted puzzle item**. The combined operation requires no fifth earned item.
- The actuator opens **H-B02 Secured Vault** once; **Keystone** lies on one accessible plinth and is taken separately and once. The earlier Scrying Bowl-in-Vault hypothesis is superseded and forbidden.
- The Scrying Bowl in Reliquary is independent and can be collected earlier. Place Bowl in SG-05 Sune statue's **empty cupped hands**, then install Great Room's filled 027 pellet in Bowl's sealed slow-release chamber. These are two separate explicit actions. Only after both does the dry engineered-water mechanism open the **outer Undercroft Approach**; it does **not** open Keystone door or start the final fight.
- **Inner Undercroft door design (new locked art/mechanics):** a thick intricately carved stone portal with a single **rose-and-gear Keystone recess** at chest height and a stone lever. The Keystone uniquely fits; after insert and **Press Stone Lever**, door unlocks permanently. Initially it is viewable, inspectable and nontraversable. Behind it, **Donovan's broken tools, his remains near the INNER door face and Sophia's remains farther inward** communicate the later tragedy, with scratch/dig marks on the **inside** only.
- **Voss ingress consistency (designer resolution):** Voss crossed into the deeper ritual chamber through a **single-use planar transposition** performed with a consumed ash-marked focus and knowledge from his occult research, **not** a newly mapped mundane tunnel around the Keystone door. Its final ash/stone traces may be inspected **only beyond the inner door**. The transition collapsed and cannot be activated by the players as a convenient alternate route; this is a story explanation, not a second player puzzle or a false transit Region. It does not transform Vharzagul (a yugoloth) into a demon or merge the two supernatural forces.
- The Refuge onward hall ultimately transitions to Ritual Chamber. **Detailed arena, initiative, encounter choreography and Vharzagul statistics remain deferred** under owner's earlier “design last” direction. Do not silently assign a pre-finale combat puzzle.

## 2 — Global haunt and family environmental choices

- **Shadow That Sees (Dahlia):** five sparse optional sighting anchors: Studio mirror reflection, Dining Room near the sideboard wall, SG-04 Mossbound Orchard stone edge, the Gazebo column, and Bathhouse Soap Room polished copper panel. In each she appears as an ambiguous source-less partial silhouette. Only upon player's **successful recognition** does a separate eye Tile reveal and the player receive a small non-essential emotional clue. These are not five mandatory collect-a-thons. Any automatic Discovery Notice component must obey Dicebox 0–1 default, max 2 ordinary-scene density and per-PC one-time Notice rule.
- **Crooked Man:** prior to Veil may pursue/capture a single PC per encounter with GM-safe release; after Veil changes allegiance to defending against intruding demons and stops player-directed chases. Do not schedule early bust or late chase actions after this phase reversal.
- **Family traces:** Allen's dry remains near Great Room hearth and protective home repairs; Dahlia only inside locked Carriage; unborn child's single grave at SG-05; Donovan+Sophia beyond Keystone door and died after the assault. Five family haunt manifestations remain separate from demons. Never reveal internal family grief merely through gore.

## 3 — State model and transaction rules (implementation contract)

### 3A. Versioned semantic state, not unverified Foundry flags

**Campaign state namespace proposal:** ashenVeil/v1 with integer schemaVersion=1. Persist through a single GM-authorized source, not ad hoc duplicated flags on every staged Scene.

- World water: sluiceInstalled:boolean; sluiceState:CLOSED|OPEN (initial CLOSED); waterworksDebrisCleared:boolean; waterworksValves:[P,B,G]; waterworksRestored:boolean; boilerValves:[I,V]; boilerSolved:boolean. Derive pondFull=(sluiceState===CLOSED), bathFull=pondFull, greenhouseWater=waterworksRestored && pondFull, boilerFeed=waterworksRestored && pondFull, waterHeated=boilerSolved && boilerFeed, bathHealingEnabled=pondFull && waterworksRestored && boilerSolved && waterHeated.
- Shrine: bustIndex:0..4; suneReliefSolved; suneReliefBoard[9]; rosewaterAngles:[outer,middle,inner]; rosewaterSolved; reliquaryServiceOpen; groveBowlPlaced; grovePelletPlaced; groveActivated; memorialStage derived from groveActivated.
- Locks/progress: clockGlassOpen, chimneyClockSolved, carriageOpen, studyOpen, basementOpen, aqueductGateOpen, mazeIronGateOpenFromInside, greenhouseGrowthCleared, candleWorkshopOpen, spineRoomOpen, vaultOpen, keystoneDoorOpen.
- Story phase: firstChaseDone, secondChaseArmed, secondChaseDone, crimsonVeilActive, ritualPhase (reserved only).
- Items: stable logical IDs, single source disposition (world fixture | player inventory | installed in socket | claimed), optional unique item serial; never create a second source instance on scene reentry. Silver/Copper/Brass tiny keys must remain different logical items despite similarly named player labels.
- Player state: discovery notice per actor/feature, Shadow seen per actor/scene, bathHealUsed per actor/GM-approved long-rest-cycle, Crooked Man captured state and safe-release time; never store a player-only state solely in a variant Scene.
- Store all numeric dials and ring arrays with validated enumerations. Background/Tile art is a *projection*, not the authoritative state.

### 3B. Interaction protocol

1. Distinguish **Region travel** (an intentional threshold) and **Region discover** (Notice), from an **explicit interact** action (read, examine, turn, install, take, repair, pray, fish, ignite). A token merely entering a Region is **not** an item pickup, password submission, multi-step rotation or prayer.
2. Before changing state, re-read exact world, canonical Scene, actor and active authorized GM; range, permission, item ownership, expected prior state, expected stage and logical feature ID. Reject duplicate/replayed action with stable receipt and benign response.
3. Perform a bounded transaction: reserve one-time reward/slot, update state, change necessary Foundry document(s) and item inventory, then authoritative reread. If any step fails, reconcile and permit GM recovery; do **not** consume irreplaceable item before verified unlock.
4. Changing map stage: preflight **every relevant party Token** and landing point; no overwrite/duplicate, no partial party trapped; update route resolver to active logical stage; old variant must not accept stale entrances. Persist state and rehydrate lights/Tiles/sounds on load, reload, reconnect and GM handover.
5. No new publicly accessible broad execute-as-GM, arbitrary client macros, ad hoc relay sends, raw database writes, or unverified browser console code. Package a validated Dicebox single-Markdown injector only after exact runtime capabilities and permissions pass.
6. Every player-visible gate has **obvious local feedback and a GM repair**. A failed roll may cost time, not destroy the only key. Region/Note geometry must correspond to an actual painted or architecturally credible anchor; no omnipresent invisible sweep zones.

## 4 — Required Foundry object choices and external research

**Preferred smallest surface:** Built-in Scene + Wall/door for collision and locks; built-in paired Region for travel; native ambient lights and ambient sounds for live mood; built-in JournalEntry Pages/Map Notes for player-readable clues; Tiles for prop/state artwork including individual overhead tree crowns near traversable ground. Use a **single verified owner-authorized interaction adapter** for clicks and complex puzzles. Keep optional module triggers behind feature-detection rather than silently making an external module mandatory.

**Why:** Foundry v14 docs confirm that Region TOKEN_ENTER can arise from token creation/Region boundary changes/Behavior activation as well as movement. Therefore it is unsafe for auto-loot or puzzle submission. Foundry RegionDocument offers teleportToken(s), but requires permissions and cross-scene teleport can delete/create token documents; test token identity/ownership and multi-PC relocation before map stage switching.

**Candidate implementations to evaluate, not requirements:**
- **Regionwright / existing Dicebox** puzzle interface if installed and exact behavior/permissions are verified by read-only probe and canary.
- **Monk's Active Tile Triggers** supports click/entry trigger types and door/tile changes, verified for v14 per its package listing; use only if deliberately chosen and tested.
- **Glyph: Active Region Triggers** offers click/door events and visual action trees, listed verified for v14.367 in October 2026, but has a separate 3DS:ATLAS dependency and does not automatically replace existing Regionwright workflow.
- **Puzzle Locks** lists v14-supported PIN, ring alignment and switch puzzle controls but is an external/premium dependency; do not assume installed or necessary.
- **Default:** one small, module-owned semantic action dispatcher and reusable UI widgets for code, ordered busts, 3×3 slider, 3 rings, two pressure panels, books, prayer, inventory placement. Use native Foundry controls for doors, notes, lights and traversal. Static design alone cannot prove this exists; capability probe first.
- **Tree layer:** use grounded trunk Wall and overhead canopy Tile if traversal under branches is possible; do not wall the canopy silhouettes. Does not add a mandatory Region per tree.
- **Good Enough is for image appearance, not mechanism correctness.** This specification makes puzzle solutions *deterministic and testable*, not mechanically overengineered.

### Verified external reading (checked 2026-10-22)

1. Foundry official v14 Regions & event behavior: https://foundryvtt.com/article/scene-regions/ and https://foundryvtt.com/api/variables/CONST.REGION_EVENTS.html
2. RegionDocument teleportToken and teleportTokens permissions/semantics: https://foundryvtt.com/api/classes/foundry.documents.RegionDocument.html
3. Native Tiles/Overhead occlusion: https://foundryvtt.com/article/tiles/
4. Native player Journal/Page permissions and Map Notes: https://foundryvtt.com/article/journal/ and https://foundryvtt.com/article/map-notes/
5. Lighting and wall-driven vision: https://foundryvtt.com/article/lighting/
6. Monk's Active Tile Triggers package and source: https://foundryvtt.com/packages/monks-active-tiles and https://github.com/ironmonk108/monks-active-tiles
7. Glyph region events: https://foundryvtt.com/packages/glyph
8. Puzzle Locks current compatibility listing: https://foundryvtt.com/packages/puzzle-locks
9. Foundry community on timing of Region-enter stairs, requiring explicit trigger area/safe arrival testing: https://www.reddit.com/r/FoundryVTT/comments/1ur6gna/make_region_trigger_when_movement_ends_dnd5e/
10. Foundry community reports on click-to-open Journal/Tile triggers: https://www.reddit.com/r/FoundryVTT/comments/1t45s59/triggering_a_journal_page_to_open/ . Anecdotal reports warn against assuming a click integration works simply because a package exists.

## 5 — Deterministic design tests (must become runtime receipts later)

| ID | Test input or condition | Required result |
|---|---|---|
| D01 | Start shrine busts SW,NE,NW,SE with Winder | Relief reveal; early late-chase flag remains false |
| D02 | Start busts NW first | Counter resets 0; Winder retained |
| D03 | Relief board [4,5,1,2,0,8,7,6,3] | Not solved; legal adjacent slides lead to [1,2,3,4,5,6,7,8,0] |
| D04 | Rosewater initial (0,0,0) | No hatch; drain required |
| D05 | Rosewater (90,270,180), Bath empty | Opens hatch; repeat use no duplicate Bowl |
| D06 | Sluice open; Waterworks valves (2,2,2) | Pressure inoperable |
| D07 | Sluice closed, intake clear, Waterworks valves (0,1,3) | Gauges (0,4,3), not solved |
| D08 | Sluice closed, intake clear, Waterworks valves (2,2,2) | Gauges (3,3,3), only satisfying setting among 64 possibilities, restores two lines |
| D09 | Waterworks complete, Boiler wheels (2,1) | Pressure=2, circulation=3, Engage succeeds |
| D10 | Same boiler wheels while Bath drained | Solved may persist, but heated healing disallowed |
| D11 | Bath full + sluice closed + Waterworks restored + boiler solved + heated | 4d8+8, conscious PC, explicit use outside combat, once per rest cycle |
| D12 | Second chase arming note not read, early bust visit | No chase |
| D13 | Second chase armed + late NW bust on either Grove variant | Chase at most once; Silver Key appears once; post-Veil no player chase |
| D14 | Protection prayer at Studio altar | Candle Workshop unlocks; Sune emblem not awarded |
| D15 | Devotion prayer at Studio altar | Sune half awarded; no Wick auto-award |
| D16 | All six book order [Knight,Moonlight,Felix,Whispers,Clockmaker,Penelope] | Spine Room + Gond half once |
| D17 | Crimson Veil inactive | Sixth book absent from bed |
| D18 | Source charged at Aqueduct | Veil one-time, sixth book appears, all stage FX rehydrate on reload |
| D19 | Rosewater Reliquary occupied during refill | Dry Boiler exit remains; no party/token loss |
| D20 | Charged source + Gond half + Sune half + Basement access | Four-input Vault opens; awards Keystone only |
| D21 | Bowl+027 pellet at SG-05 | Outer Undercroft opens; ornate inner door stays sealed |
| D22 | Keystone at inner door | Opens Refuge; Donovan/Sophia remains and inner face damage visible only beyond |
| D23 | Two player clients target the same unclaimed item simultaneously | Exactly one reward disposition, no clone |
| D24 | Fresh token created inside an interaction Region | No automatic reward/chase solely from TOKEN_ENTER |
| D25 | Release/return from SG-07 after Pond refill | Aqueduct access preserved and safe |
| D26 | Player enters from every SG scene edge and returns | All paired links resolve; no teleport loop or incorrect landing |
| D27 | Wrong Greenhouse ingredient order | Reset without consuming one-of-a-kind lye |
| D28 | Late Copper Tiny Key minigame unavailable | Explicit alternate recovery still allows plant-killer branch |
| D29 | Optional Gazebo puzzle unsolved | Main Wick→eye chain remains completable |
| D30 | Art/Scene pixel dimensions transformed to battlemap-120 | No aspect distortion, wall deviation, false passability or token footprint change |

**Pre-injection data caveat:** Accepted Carriage Yard raster is 1536×1024 (3:2). Earlier **proposed** 160×115 ft exterior envelope is a different ratio; physical Scene bounds and paired regions MUST be reconciled before image resampling/build, never guessed from accepted appearance. No original Foundry document IDs or counts are claimed by this specification.

## 6 — Remaining non-design implementation gates, not “undecided puzzles”

- Obtain exact active Foundry/world/system/module profiles and Regionwright/Dicebox capabilities. All proposed UIs, click actions, item effects, teleport, stage switches, game-system trait bindings and persistent transactions need an actual runtime canary.
- Calibrate exact dimensions and portal landings for every approved piece of art/house blueprint, including nine Grove scenes, four Bathhouse rooms and stage variants. Keep artifacts in the established PREPARE/BUILD workflow.
- Create original full readable Prayer of Protection and Prayer of Devotion journal prose, individual Miss Lulubug story synopses and house journal pages if not already stored in earlier canon. This document locks their functions, clue texts and publication sequence; it does **not** overwrite previously accepted full player-facing scripture/literary copy with new inventions.
- Build the final **Ritual Chamber** encounter/map **last**, per owner instruction. The Voss ingress narrative is decided above; final combat scripting/canon awaits that final-stage design pass.
- Validate each bounded injector artifact as one Markdown file / one JavaScript macro under Dicebox build contract, then STAGE, authorized INJECT, VERIFY and RECEIPT; never claim design decisions prove runtime execution.

## 7 — Source / precedence ledger

1. Explicit owner instructions in the two archived conversations: [Part 1](./campaign-chat-transcript.md) and [Part 2](./map-creation-conversation-transcript-2026-10-22.md); later owner direction in this conversation to audit Foundry puzzles and **complete all remaining design choices**.
2. [Owner decision catalogue through §27](./campaign-decision-catalogue-2026-10-20.md); this document is a later **owner-authorized decision appendix** without editing prior quotations.
3. [Foundry puzzle audit, P01–P31](./foundry-puzzle-requirements-audit-2026-10-22.md); [43-scene feature register](./foundry-scene-object-register-2026-10-22.md).
4. [Sune + Keystone revision v2](./sune-memorial-clearing-puzzle-design-v2-2026-10-21.md), [Undercroft/Bathhouse v3](./undercroft-keystone-bathhouse-bowl-healing-design-v3-2026-10-21.md), [Rosewater decision](./rosewater-reliquary-bowl-decision-2026-10-21.md), [Bathhouse PREPARE](./bathhouse-map-prepare-cluster-v1-2026-10-21.md).
5. [Owner-authorized nine-scene Grove and Gazebo plan](./grove-nine-scene-and-estate-refinement-plan-2026-10-22.md), approved House Master V1 and first four PREPARE cards.
6. Global repository workflow sources: docs/DICEBOX-AUTOMATED-SCENE-WORKFLOW-2026-10-05.md, docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md, docs/DICEBOX-EXPLORATION-DISCOVERY-STANDARD-2026-10-05.md, docs/FOUNDRY-API-BINDING-MATRIX-2026-08-21.md, docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md and docs/DICEBOX-INJECTOR-WORKFLOW-HARDENING-2026-10-05.md.

**Change control:** New owner corrections override designer selections within their explicit scope. Update this document with an append-only decision chronology/next version, affected puzzle IDs and regression tests; preserve v1. Do not silently blend future side-campaign choices into global production canon.
