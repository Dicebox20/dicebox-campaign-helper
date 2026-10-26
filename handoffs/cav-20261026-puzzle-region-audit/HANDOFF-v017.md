# Dicebox Cabin in the Ashen Veil — Puzzle Region Audit & Durable GitHub Handoff v017
**Checkpoint:** 2026-10-26 UTC · **Status: PARTIAL (full 57-node semantic audit still pending)**  
**Owner request:** Audit the puzzle Regions against the implementation, record all work to GitHub, and prepare a handoff.  
**Archive branch:** handoff/cav-puzzle-region-audit-20261026 (isolated from main/product release).  
**Existing authoritative work directory:** C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper (not itself a Git checkout).  
**Runtime:** Foundry VTT 14.367, dnd5e 5.3.3, world cabin-in-the-ashen-veil; Dicebox Bridge only, authenticated elected GM required for any runtime work.

## Last fully independently verified world baseline
- **46 Scenes, 203 Regions, 96 RegionBehaviors, 68 native teleport behaviors, 68/68 destinations valid** (64 enabled, 4 intentionally disabled). This is the latest completed full-world source audit, NOT a new live recheck and NOT a 57-node gameplay certification.
- The previously missing **H-G04 Pantry** was installed with owner-approved exact one-north-door image and reciprocal Kitchen south/Pantry north native travel Regions. Kitchen/Pantry currently require measured walls and eventual real non-GM traversal canary.
- Two NEW **inspection-only** book Regions: North Attic Scene.gDqaEOR4qaB5IOut.Region.CAVATTICBOOKR001.Behavior.CAVATTICBOOKB001 and Roof flue Scene.LhtyO17QenuCExsb.Region.CAVFLUEBOOKREG01.Behavior.CAVFLUEBOOKBEH01. Both show only original approved-map closeups. Book title-to-site reward assignments are not proven; disableItemGrant=true, no item awarded.
- Two **PRE-EXISTING** World Item reward nodes source-verified in Art Studio vanity Scene.CAVHU07Scene0001.Region.CAVVANITYREG0001.Behavior.CAVVANITYBEH0001: original **Brass Tiny Key #1** Item.CAVBRASSKEYVAN01 and **Carriage Key** Item.CAVCARRIAGEKEY01. Its GM event script requires genuine Mirror provenance, owned character and once-only claim ledger. It was already installed; do not duplicate. Actual non-GM award/reload test pending.
- The pond log's **Felix Fox and the Forgotten Kingdom** source is installed: Scene.CAVEXT02Scene001.Region.CAVEXT02HLOGR001.Behavior.CAVEXT02HLOGB001 + GM Macro.CAVPONDBOOKGM001; original Item.TO69wBYN8sRJuxtH. No actual player award verified.
- **027 Dust of Dryness** owner reports already completed; the last all-Region inventory could not locate the exact grant source. Original World Item.VjdQNwil7pPKzkHU exists. Do NOT create a duplicate. Distinct 024 Chest source is installed and must remain untouched.
- Sune official Regionwright Sliding Mosaic at Scene.CAVSG05Scene0001.Region.L15BdSqcbCOLPnIN: original vendor 4×4, behavior disabled pending controlled Foundry restart to configure intended 3×3. Brass Study Key authentic solved reward still pending.
- EXT-02 sluice: inspect-only image installed; **synchronized reversible pond/Bathhouse drainage remains blocked** by lack of approved drained Bathhouse art. Weathered Key and Bathhouse Screwdriver depend on authentic synchronized draining, not automatic spawn.
- Four **session-only** elected-GM service macros (Roof Clock, Study 587, Sune, Pond Felix) were rearmed after prior Chrome session reload; must reread/rearm once after any new elected-GM browser reload. Never assume persistent hooks.
- Real end-to-end non-GM player canaries deliberately deferred until puzzle chain preparation is complete.

## Storybook owner-approved transcript reconciliation
Original **1,321-message Halloween Campaign Idea transcript** located at:
C:\Users\rujie\Documents\Codex\2026-08-20\cabin-in-the-ashen-veil-recovery\campaign-chat-transcript.md.
Exact recovered local evidence receipt:
work/cav-batched-puzzle-installs-20261025/original-1321-message-storybook-canon-source-recovery-v001.json.

All SIX original titled illustrated World Items:
1. The Knight Who Befriended a Dragon — Item.Qplmy8JR7plDYLiY
2. Moonlight and the Missing Stars — Item.DLGIhHc0RDqh0YVt
3. Felix Fox and the Forgotten Kingdom — Item.TO69wBYN8sRJuxtH
4. Whispers of the Little Witch — Item.c3oKW8YkklE8slnX
5. The Clockmaker's Starless Sky — Item.HV7XjKmgqVITSEvW
6. Princess Penelope and the Sea of Stars — Item.gmTsIOqc3qFBc3zA

This order was historically an **assistant proposal**, not owner-locked publication order. Later owner modified Father's Journal from Felix's proposed numerical publication-position clue into pond location clue. **Do not assert the sequence as approved solution.**
OWNER-CONFIRMED physical distribution: **two** start on Sophia's shelf; **Felix Fox** in pond hollow log; one Attic; one separate chimney flue; the last appears on Sophia's bed when Crimson Veil begins. Other title-to-site mappings remain unresolved in recovered owner-accepted sources. Do not misstate "books untitled" or assign titles by guessing.

## Latest authoritative 57-node ledger
Local file: work/cav-puzzle-chain-installation-20261025/puzzle-node-installation-ledger-v015.json. Last semantic node statuses from this ledger:
- Source-confirmed or installed components: oars, oil, old_iron_key, book_pond, mirror, sophia_access, vanity, first_eye, books_shelf (inspection only), tiny_brass, carriage_key, hour_hand, ladder_hook, attic_access, minute_hand, winder, attic_book (inspection only), flue_book (inspection only), replacement_gear, grove_busts, study_access, code_587, sluice_crank.
- Pending/blocked partial work: pellet_027 (owner report source dispute); sliding_relief (vendor restart + official 3x3); brass_study_key (authentic solve grant); pond_drained (no dry Bathhouse approved art); crimson_veil (source uncertified).
- 30 ledger nodes marked NOT_YET_RUNTIME_CERTIFIED: weathered_key, screwdriver, basement_access, gate_handle, aqueduct_open, waterworks_access, greenhouse_water, waterworks_clue, late_nw_chase, silver_tiny, hope_chest, music_box, prayer_protection, candle_workshop, wick, second_eye, power_source, charged_power, book_six, copper_tiny, gond_half, lye, plant_killer, boathouse, prayer_devotion, sune_half, final_vault, scrying_bowl, undercroft. **These are NOT automatically 30 missing handlers; actual live-source reconciliation is incomplete.**

## Status of requested all-puzzle REGION comparison
**NOT COMPLETED in this archival turn.** Owner requested live Region-vs-ledger audit; exact 57 nodes and prior results were loaded, but no new comprehensive 57-row per-node live source matrix has been generated. Do not claim a structural tally alone proves puzzle completeness. CFT Dev browser endpoint needed restoring; separate project work was concurrently modifying the main checkpoint. This archive freezes the **last completed evidence** rather than inventing new verification.
**Next steps** (no writes until full comparison):
1. Exact elected-GM read-only audit of all current Scenes/Regions/Behaviors/Macros/World Items; check native UUIDs and current counts against last 46/203/96/68 snapshot.
2. For each of 57 ledger nodes record exact Scene.Region.Behavior IDs, events/disabled flags, source validity, original Item UUID/provenance, ownership/GM authority, once-only grant, prerequisites, player-facing clue/close-up and actual runtime acceptance level. Use statuses VERIFIED_SOURCE, INSPECT_ONLY, PARTIAL_DEPENDENCY, NOT_FOUND, OWNER_REPORT_DISPUTE, TEST_PENDING, or PLAYER_TESTED.
3. Cross-check original transcript, owner decisions, recent handoffs and knowledge database; record conflicts instead of inventing canon (especially 027).
4. Derive grounded count of actually missing puzzle installs and safe two-at-a-time batches. Leave product Roadmap v2 proposed; Stage 12/M1284 restrictions in place, PC cleanup paused, other GM unaffected.
5. Defer two-player canaries and avoid Regionwright restart, Sune premature key grant, pond physical drain, or late Crimson Veil triggers until prerequisites.

## Repository and data safety
Authoritative working SQLite: database/dicebox_campaign_helper_knowledge.sqlite. Existing additive catalogue passed integrity and **zero lost record IDs**, but historical from-seeds build omits certain Desktop/App records. Do not promote incomplete staged rebuild or replace main KB. Exclude private player inventories, credentials, full transient browser captures, raw Windows backup worlds, and large disposable images from this GitHub archive; use source IDs and SHA/receipt references.
No local Git repository exists at the active project document folder; archival GitHub branch is isolated. No main branch push, product release, GitHub merge or production certification. GitHub archive is a **handoff mirror**, not a Foundry world restore point.

## Local durable evidence index
- handoffs/cav-scene-installation-20261025/TWO-BOOK-OBSERVERS-VANITY-TWO-REWARDS-RECONCILED-v016-20261025.md
- handoffs/cav-scene-installation-20261025/HG04-PANTRY-OWNER-NORTH-DOOR-SCENE-KITCHEN-ROUTES-VERIFIED-v015-20261025.md
- handoffs/cav-scene-installation-20261025/POND-FELIX-FOX-AUTHENTIC-ONCE-REWARD-INSTALLED-v013-20261025.md
- handoffs/cav-scene-installation-20261025/ALL-REGIONS-TRUE-BOUNDS-AND-027-RECONCILIATION-v011-20261025.md
- work/cav-batched-puzzle-installs-20261025/batch-four-step-reconciled-independent-world-audit-v001.json
- work/cav-batched-puzzle-installs-20261025/original-1321-message-storybook-canon-source-recovery-v001.json
- work/cav-batched-puzzle-installs-20261025/kb-two-book-batch-additive-pass-v001.json
- work/cav-hg04-pantry-owner-approved-20261025/hg03-hg04-reciprocal-native-route-independent-readback-v002.json
- work/cav-puzzle-chain-installation-20261025/puzzle-node-installation-ledger-v015.json

**Resume prompt:** Continue 57-node Cabinet in the Ashen Veil puzzle-region semantic audit from handoff v017 and ledger v015. Use Dicebox Bridge and local authoritative SQLite, compare all live source IDs and original owner transcript. Finish an evidence-backed per-node table before any more puzzle installs. Preserve owner-approved workflows and current game state; then batch truly missing interactions in pairs.