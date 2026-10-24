# Cabin in the Ashen Veil — Durable Region/Puzzle Installation Handoff
**Recorded:** 2026-10-24. **Status:** verified partial Foundry build, pending next implementation waves.
**Source conversation:** Review Great Room Plan, current ChatGPT project chat. Follow latest explicit owner decisions over older conversations, Library files or puzzle plans. This is an operational checkpoint; it does not declare the campaign player-ready.

## Active owner objectives
1. Preserve approved artwork and build all campaign Scenes, walls, Regions and puzzle systems according to established Dicebox workflows.
2. Prioritize a no-softlock session-one playable slice from arrival to **first Crooked Man chase and safe Aqueduct/SG-07 well return**, with later branches deferrable.
3. Use **measured** polygons on exact approved Scene backgrounds, macro-runner/harness via Dicebox Bridge, and established discovery-vs-click interactions. Preserve all existing owner Walls/Regions. Guard installs for re-execution.
4. Before a broad puzzle release, design a low-failure puzzle deployment procedure: PREPARE → INSPECT → BUILD → STAGE → INJECT → VERIFY → CATALOGUE. Each puzzle separates: physical Discovery Region, explicit clickable interaction target (Region proximity plus native Tile/control when necessary), authoritative GM-controlled state/reward script. Foundry Region entry is NOT a click, auto-loot or puzzle solve. Only stable, verified module adapter can handle clicks.
5. Owner requests this durable handoff and a chronological chat transcript saved to repository.

## Repository and canon
Repository `Dicebox20/dicebox-campaign-helper`, branch `codex/cabin-ashen-veil-recovery`.
- `campaign-archives/cabin-in-the-ashen-veil/authoritative-puzzle-design-and-foundry-implementation-spec-v1-2026-10-22.md` — comprehensive semantic puzzle contract; front-matter dated owner overrides prevail over conflicting older body paragraphs.
- `campaign-archives/cabin-in-the-ashen-veil/blueprints/house-layout-revision-v2-2026-10-22.md` — revised house floor/door adjacency.
- `campaign-archives/cabin-in-the-ashen-veil/blueprints/spine-mosaic-compartment-owner-correction-2026-10-22.md` — H-U05 compartment, NEVER obsolete H-U06 room.
- `campaign-archives/cabin-in-the-ashen-veil/sg-05-revealed-mosaic-region-prepare-v5-2026-10-23.md` — visible late reveal plus distinct discovery Region behind Sune.
- `campaign-archives/cabin-in-the-ashen-veil/roadmaps/two-chat-24-remaining-map-handoff-2026-10-24.md` — approved artwork split.
- `campaign-archives/cabin-in-the-ashen-veil/builds/prebuild-puzzle-continuity-audit-and-staging-roadmap-2026-10-24.md` — conflicts and waves.
- `campaign-archives/cabin-in-the-ashen-veil/builds/session-one-midgame-playable-slice-and-softlock-guards-2026-10-24.md` — release gates.
- `campaign-archives/cabin-in-the-ashen-veil/builds/live-foundry-measured-region-install-checkpoint-2026-10-24.md` — exact installed Region footprint receipts.
- `campaign-archives/cabin-in-the-ashen-veil/render-attempts/ext-08-rear-deck-family-grounds-owner-approved-final-fence-flush-2026-10-24.md` — EXT-08 accepted source.
- Original recovered `campaign-chat-transcript.md` and `conversation-capture-working.json` existed in repository index but GitHub connector returned **empty content** on this date, so a complete original 1,321-entry verbatim audit was **NOT** performed. This handoff's accompanying transcript reconstructs **this current chat only** from available context; not a replacement for recovered original transcript.

## Live Foundry observations
Via **Dicebox Bridge** persistent PowerShell, existing Chrome for Testing Dev utility harness, Playwright attached over existing local loopback CDP 127.0.0.1:9224. Foundry at 127.0.0.1:30000/game and authenticated GM, exact world `cabin-in-the-ashen-veil`; Foundry 14.367, dnd5e 5.3.3. Do not assume authentication survives or CDP remains available; verify again every operation. Utility harness path `C:\Users\rujie\AppData\Local\Programs\Chrome for Testing Dev\utility-harness`; has `harness.mjs` with `macro` op checking exact world, GM and ready status. Do not disclose browser binding endpoint. Prior Browser profile access required owner sign-in, later confirmed GM active.

**Baseline live inventory:** 32 loaded Scenes, 15 Regions, 1 behavior. EXT-01 had 8 inert Regions; H-G06 Great Room had 7, including **Fireplace** with 1 enabled `executeScript`. 30 original Scenes had no Regions. 45 base art targets ≠ 45 installed Scenes. Missing house Scenes include H-G05 Study, H-G09 Rear Family Room, H-G01 Dining, H-G03 Kitchen, H-G04 Pantry, H-U05 Sophia, EXT-03 Shack, EXT-08 backyard. Do not infer 45 Scenes present simply from Drive artwork.
Some existing Scenes had owner Walls (H-G02 Foyer 9, H-G06 Great Room 25, EXT-01 yard 7); many others had zero. Never overwrite these owner objects.

**Built and live readback verified on 2026-10-24:** 5 **geometry-only** Regions added using GM Macros, no new behaviors; live total 20 Regions, 1 behavior:
- SG-05 Memorial Clearing `CAVSG05Scene0001`, 4320×2880; new north-of-Sune mosaic discovery Region `L15BdSqcbCOLPnIN`; polygon `[2000,720,2320,720,2320,825,2000,825]`; macro `Macro.AVW228oYajM2e2pc`. Flagged `grove.bustsSolved` prerequisite, no script yet.
- SG-07 SW Rose `CAVSG07Scene0001`, 2880×2880, Region `0JAM9urrHnAxVUgM`, `[1440,700,1780,700,1780,1030,1440,1030]`.
- SG-03 NE Star `CAVSG03Scene0001`, 4320×2880, Region `BfKhb34dSEfVTf2e`, `[2920,350,3320,350,3320,820,2920,820]`.
- SG-01 NW Moon `CAVSG01Scene0001`, 4320×2880, Region `gksvZIqj8jWdqzn7`, `[1290,680,1860,680,1860,1410,1290,1410]`.
- SG-09 SE Sun `CAVSG09Scene0001`, 2880×2880, Region `BrugKqcQyDImUvwt`, `[1800,1360,2210,1360,2210,1840,1800,1840]`.
The four bust Regions were installed with macro `Macro.Ivh7g6fyaPQnVDLj`, independently reread and confirmed single instances, zero behaviors. All regions flagged with unique Dicebox object keys for idempotence. Pixels measured against actual approved PNGs; **geometric interaction tests and player access NOT YET verified**.

## Critical puzzle canon and dependency safety
- Grove bust order SW Rose (SG-07) → NE Star (SG-03) → NW Moon (SG-01) → SE Sun (SG-09), requiring explicitly used Clockwork Winder, resettable mistakes, persistent shared state. Four busts were moved off SG-05, which contains only upright Sune statue, a memorial stone, one child grave, dormant sliding mosaic and separate late Bowl interaction.
- Fourth bust reveals separate **visible mosaic Tile** on rear/north statue pedestal; gated discovery Region gives player-only notice once. The player must click the visible 3×3 Tile to solve puzzle and *separately* take bag 1,000 gp and Brass Study Key. Do not auto-trigger upon Region entry.
- H-G05 Study has two distinct doors (Great Room and north EXT-08) sharing Brass Study Key, neither connecting to H-G09. EXT-08 fence flush to house, private yard; owner-approved exact PNG SHA256 `94b24ae8b94ecc1fab597b6cdefbe9ed2db869e236528ed502e2f4d3669b4a16` in Google Drive approved art folder.
- Attic Ladder Hook; roof clock Hour+Minute Hands at 12:00 → Replacement Gear; Study note 587 → Shack box Sluice Crank; drain paired Pond/Bath safely → Weathered Key in Pond & Screwdriver in Bath; Screwdriver repairs parents' nightstand → Gate Handle; Gear+Handle open Aqueduct, first Crooked Man chase. Bidirectional well return SG-07, token safety, 20min emergency release option, only one captured PC.
- Crooked Man second NW bust chase is after first chase + Waterworks note and belongs to SG-01 (not older SG-05 position); no late chase after Crimson Veil.
- Prayer of Protection opens distinct H-U08 Candle Workshop for Wick; Prayer of Devotion awards Studio Sune emblem half. Eye 1 in Sophia bear, Eye 2 Gazebo using oil+wick, Rufus yields uncharged source. Charging it at Aqueduct triggers Crimson Veil only via explicit action.
- Six ordered books yield in-room H-U05 compartment and Gond emblem half (no obsolete H-U06 Scene); sixth appears on Sophia's bed with Veil.
- Vault has **four** prerequisites: basement entry, charged source, Gond half, Sune half. Vault yields **Keystone**. Scrying Bowl from Reliquary + 027 pellet opens outer Undercroft at Sune; Keystone opens separate inner stone door.
- Water level, pressure, Boiler state and healing eligibility separated; no irreversible item loss or dead-end roll.

## Low-failure installation SOP, pending detailed design/owner review
1. Preflight every bounded unit: authenticated world/GM, module versions/installed Regionwright clickable adapter, scene IDs/background check, exact image dimensions, existing owner walls/region collision, dependency flags, players permissions. No broad world mutations until this passes.
2. PREPARE: each logical puzzle manifest declares canonical IDs, region polygon in approved art coordinates, Discovery trigger, clickable Tile/control, eligible actors, clue tiers, prerequisites, discrete actions, persistent state schema, readback/postconditions, GM recoverability, wrong/repeat/interrupt cases, expected scene/stage variants, privacy.
3. INSPECT: preview geometry overlay with object legend; verify tokens can physically reach fixture and polygons never block passages. Compare to approved pixels and door pads. Where scene doesn't exist, install and measure background first.
4. BUILD: generate deterministic idempotent preflight and macro script for exactly one bounded puzzle or scene; avoid arbitrary hardcoded alternate IDs. Preserve existing objects by unique scoped keys and verify exact count.
5. STAGE: snapshot relevant Foundry documents; dry-run proposed deltas and conflicts. No secret broad deletes or edits.
6. INJECT: guarded GM-executed bounded transaction, with explicit player intent and repeat-safe locking. Do not automatically award on TOKEN_ENTER or create extra Keys.
7. VERIFY: native reread IDs, polygons, behavior type, disabled state, events, item UUIDs and state before/after; non-GM player canary, wrong input, duplicate, reconnect, save/reload, wrong stage, scene transit, cut power and GM repair.
8. CATALOGUE: receipts, before/after counts, diff, checksum, tested PC, outcome and next bounded unit. Mark separately ART_APPROVED, REGION_GEOMETRY_READY, BEHAVIOR_INSTALLED, PLAYER_VERIFIED, MIDGAME_RELEASE_PASS.
First pilot should be a SINGLE **Grove bust + SG-05 discovery/reveal** controlled sequence, then reuse proven template; do not deploy dozens of untested scripts at once.

## Known gaps and do-not-claim
- No comprehensive Scene-by-Scene walls/Region plan approved or measured for all missing house Scenes.
- No new behaviors/player tests; region geometry only.
- No verified clickable adapter API yet; active Region `executeScript` exists but semantics need capability read/test.
- Full original chat transcript inaccessible in prior GitHub fetch; current conversation transcript attached separately is accurate only to provided message context.
- The assistant's earlier plan response was interrupted when owner requested the handoff. Do not treat a finished technical SOP as owner-approved beyond its written principles.
- Do not claim midgame playable or all Regions installed.

## Immediate next turn
First read this handoff and accompanying transcript; reacquire exact Bridge/harness authenticated state. Resolve existing Regionwright/Dicebox click action adapter and safe native macro execution. Then draft a small, deterministic installation/recovery manifest for the SG corner busts + SG-05 overlay with dry-run and non-GM testing before behavior writes. Continue in bounded phases (~15–20 minutes each), recording receipts without assuming disconnected state survived.
