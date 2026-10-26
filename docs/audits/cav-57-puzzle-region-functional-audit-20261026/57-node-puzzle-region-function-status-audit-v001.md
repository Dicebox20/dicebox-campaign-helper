# Cabin in the Ashen Veil — all 57 puzzle Region functional source comparison
Live snapshot 2026-10-26T02:49:30.001Z, Foundry 14.367 dnd5e 5.3.3, elected GM; read-only.

## Verified baseline
- 46 Scenes, 203 Regions, 96 RegionBehaviors; 68 valid native target UUIDs, no broken targets.
- All 28 Region native scripts and 19 World Macros syntax-parse; runtime behavior or player-success not implied.
- Classification: 20 source present, 6 partial/blocked, 31 without confirmed implementation in this current world.
- Four elected-GM session listeners currently unarmed after Chrome restart. Regionwright enabled in configuration but inactive; official sliding puzzle disabled.
- Enabled native teleport reachability: 24/46 from Carriage Yard, only static enabled routes, does not include future key unlocks or manual travel.
- Kitchen↔Pantry is a disconnected two-Scene teleport island, with no current Great Room→Dining→Kitchen access.
- The 027 pellet is owner-reported complete, current-world source not identified: do not re-install.

## 57-node matrix
| ID | Canonical step | Runtime source category | Key finding |
|---|---|---|---|
| oars | Wooden Oars | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Canonical first Oars reward has ledger record of previous player verification; current source exists, but no retest today. |
| oil | Lamp Oil | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Original puzzle Region/Item source documented and live reference exists; final authentic player interaction not certified. |
| old_iron_key | Old Iron Key | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Original puzzle Region/Item source documented and live reference exists; final authentic player interaction not certified. |
| book_pond | Pond hollow-log storybook | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Original Felix book source and GM macro exist, but elected GM browser session listener is currently unarmed; no actor claim. |
| pellet_027 | Water-filled Dust of Dryness pellet | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Owner reports completed, but current 203 Regions/28 native scripts/19 macros have no identifiable distinct 027 handler; 024 Chest is a different puzzle; original Dust World Item exists. Investigate provenance; do not duplicate. |
| mirror | Ornate Mirror | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Original puzzle Region/Item source documented and live reference exists; final authentic player interaction not certified. |
| sophia_access | Sophia bedroom accessible | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Native Sophia entrance teleport intentionally disabled until original Coat Key source unlock. |
| vanity | Art Studio vanity unlocked | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Original puzzle Region/Item source documented and live reference exists; final authentic player interaction not certified. |
| first_eye | Rufus First Eye | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Sophia stuffed bear original First Eye inspect/GM reward source installed; player canary deferred. |
| books_shelf | Two shelf storybooks | PARTIAL_OR_BLOCKED | Sophia bookcase original image inspection only; no two-book assignment, inventory award or six-slot Mosaic source. |
| tiny_brass | Brass Tiny Key #1 | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Paired vanity Region awards Brass Tiny Key #1 and Carriage Key; current claim absent, no new player canary. |
| carriage_key | Carriage Key | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Paired vanity Region awards two keys; source installed once, no duplicate handler. |
| hour_hand | Oversized Hour Hand | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Original puzzle Region/Item source documented and live reference exists; final authentic player interaction not certified. |
| ladder_hook | Ladder Hook | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Original puzzle Region/Item source documented and live reference exists; final authentic player interaction not certified. |
| attic_access | Attic ladder lowered | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Native Attic return/entry teleports intentionally disabled until ladder lowered with Hook. |
| minute_hand | Minute Hand | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Original puzzle Region/Item source documented and live reference exists; final authentic player interaction not certified. |
| winder | Clockwork Winder | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Original puzzle Region/Item source documented and live reference exists; final authentic player interaction not certified. |
| attic_book | Attic storybook | PARTIAL_OR_BLOCKED | New H-A03 north shelf player closeup only; exact owner-approved book title-to-location reward not wired. |
| flue_book | Chimney-flue storybook | PARTIAL_OR_BLOCKED | New H-R01 flue approach closeup only; distinct book item reward missing. |
| replacement_gear | Replacement Gear | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Roof clock Region source + GM macro exist; browser-session GM handler currently unarmed. |
| grove_busts | Four Sune busts retracted | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Four approved corner inspections and GM macro exist; GM listener unarmed and no successful player sequence. |
| sliding_relief | Sune concealed relief solved | PARTIAL_OR_BLOCKED | Official Regionwright mosaic 4x4 vendor behavior deliberately disabled, Regionwright enabled configuration but inactive runtime; owner-approved 3x3 requires coordinated restart and configure. |
| brass_study_key | Brass Key | PARTIAL_OR_BLOCKED | Original World Item exists, but SG05 solved mosaic has no authenticated once-only Key award handler. |
| study_access | Father Study unlocked | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Native Study teleport intentionally disabled until authentic Brass Key possession. |
| code_587 | 587 learned | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Study paper inspect + GM service Macro installed; listener unarmed after GM browser reload. |
| sluice_crank | Sluice Crank | SOURCE_PRESENT_NOT_PLAYER_CERTIFIED | Shack 587 click Region + original Crank item and GM service installed; listener unarmed. |
| pond_drained | Pond and bathhouse drained | PARTIAL_OR_BLOCKED | EXT02 sluice original-art inspection only; no full + drained synchronized pond/Bathhouse state and return-to-full, dry Bathhouse art not approved. |
| weathered_key | Weathered Key | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Original World Item.CAVWEATHERKEY001 exists; no drained pond floor Region/item pickup. |
| screwdriver | Screwdriver | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | No distinct original Screwdriver World Item or drained Bathhouse pool retrieval Region; Bathhouse scene has just return and arrival. |
| basement_access | Basement accessible | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Weathered Key gate/route not installed; basement scenes have passive Regions, no enabled travel into basement. |
| gate_handle | Aqueduct Gate Handle | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Original Aqueduct Gate Handle item exists, but Parents nightstand/screwdriver gated pickup Region/behavior absent. |
| aqueduct_open | Aqueduct gate open | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | AQ01 contains five passive Regions and zero behaviors; exact multi-prerequisite gate activation/route not installed. |
| waterworks_access | Waterworks Utility Room accessible | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | AQ01 Waterworks Annex observation Region passive, no gated utility-room access. |
| greenhouse_water | Greenhouse water restored | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | EXT06 controls and planting-bed Regions are passive, no water/choke/balance puzzle. |
| waterworks_clue | Later-return waterworks clue | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | No source for later return clue after greenhouse restored; AQ01 Waterworks Annex passive. |
| late_nw_chase | Second Crooked Man chase | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | SG01 Northwest bust has source only for first Winder inspection; no later Crooked Man chase trigger. |
| silver_tiny | Silver Tiny Key #2 | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | No distinct Silver Tiny Key #2 World Item or authentic later NW chase once-only recovery handler. |
| hope_chest | Hope Chest opened | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Parents room only return/arrival/old coat; no Hope Chest open Region. |
| music_box | Ornate Music Box opened | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | No World Item or Region handler for ornate Music Box. |
| prayer_protection | Prayer of Protection | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | No World Item named Prayer of Protection and no music-box reward source. |
| candle_workshop | Candle Workshop reached | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | H-U08 Candle Workshop only two passive Regions, no prayer-gated entry or crafting Region behavior. |
| wick | Gazebo lantern Wick | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | No Wick World Item, gazebo has only two passive landing Regions; no lantern-wick interaction. |
| second_eye | Rufus Second Eye | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Original Rufus Second Glass Eye item template exists; no gazebo lantern/flash reward Region. |
| power_source | Uncharged Gondian power source | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Original Uncharged Gondian Power Source exists; no two-glass-eye Rufus-compartment handler. |
| charged_power | Charged Gondian power | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Aqueduct charger Region/source and charged-power state absent; only uncharged World Item template exists. |
| crimson_veil | Crimson Veil active | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Trigger is a documented design state only; no runtime region/macro source or flag progression. |
| book_six | Sixth storybook | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Sophia bedroom has bear/bookcase inspection, not Crimson Veil bed materialization; no sixth-copy award. |
| copper_tiny | Copper Tiny Key #3 | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Original Copper Tiny Key exists; Privy has only return/arrival travel, no minigame/recovery. |
| gond_half | Gond emblem half | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Original Gond Emblem Half World Item exists; six-volume publication-order Spine Mosaic solution/reward absent. |
| lye | Lye | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Lye World Item exists; Bathhouse lacks soap room pickup Region. |
| plant_killer | Plant killer | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Plant Killer World Item exists; Greenhouse mixing/water-prerequisite handler missing. |
| boathouse | Boathouse reached | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Boathouse Clearing has passive Region staging only, no gated overgrown dock traversal. |
| prayer_devotion | Prayer of Devotion | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Original Prayer of Devotion Item exists but no boathouse inscription/pickup Region. |
| sune_half | Sune emblem half | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Original Sune emblem half exists, but Art Studio has no Devotion prayer at shrine handler (only vanity/return). |
| final_vault | Final vault open | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | H-B02 Keystone Vault has only two passive Regions, no four-gate auth/reveal source. |
| scrying_bowl | Sune Scrying Bowl | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | Original Scrying Bowl template exists, no final vault reward Region or claim. |
| undercroft | Undercroft revealed | NO_ACTIVE_PUZZLE_IMPLEMENTATION_CONFIRMED | UND01/02/03 Scenes each have passive Regions only, no scrying bowl/027 finale/reveal route. |

## Limits and next checks
- This is an independent source, Region, item, macro and native UUID audit; no non-GM player testing was run.
- Regions without behaviors can be intentional passive arrivals. A World Item template alone does not implement a pickup.
- Prioritise blocking early links: Sune 3x3 vendor activation + reward, synchronized dry visuals and sluice logic, Kitchen/Dining route, then basement and aqueduct.
- Do not alter original 024 Chest while reconciling owner-reported 027.
- Do not assert all 31 unconfirmed nodes are physically missing; some are staged geometry or stored in unverified external sources.