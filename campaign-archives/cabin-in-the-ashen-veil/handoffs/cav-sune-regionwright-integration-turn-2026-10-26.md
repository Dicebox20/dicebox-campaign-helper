# Cabin in the Ashen Veil — Sune/Regionwright Integration Turn Handoff (2026-10-26)

Status: TWO BOUNDED INSTALLATION CHANGES VERIFIED STRUCTURALLY. Gameplay tests deferred until full campaign chain installed by owner directive. The Sune GM Winder listener is active; the SG-05 sliding puzzle is configured but intentionally remains disabled pending explicit click and rewards.

## Owner-authorized workflow
- Maximum 25 minutes per work turn; end with GitHub handoff, metadata, and an available-message reconstructed transcript. Current turn completed these.
- Install in the order players interact: Oars -> Mirror -> Vanity Keys -> Carriage/Attic Winder -> four Sune busts -> SG-05 Sliding Mosaic -> Brass Study Key -> Study 587 -> Sluice and onwards.
- Regionwright interactive artwork, controls, game engines and UIs can be modified as needed under latest owner approval, with an update log. Campaign Helper handles static images and compatibility. No full player gameplay tests until chain installation is complete. Structural source tests, exact GM/world guards and document readbacks still required.

## Completed source changes and remote Regionwright commit
Regionwright branch: https://github.com/Dicebox20/regionwright/tree/codex/cav-sune-integration-20261026
Commit: 99d5474ab12a0ff7227380cebdd38cee34be1a0a
Update log: https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/regionwright-puzzle-update-log-2026-10-26.md
- Studio now includes an automatic active-GM-only Sune Winder service, attached by studio-campaign.js and studio-cav-sune.js. The exact four Region IDs are preserved. Authenticates the user via the server-sourced message author, checks player-owned token, item provenance and lowered ladder, and executes SW Rose -> NE Star -> NW Moon -> SE Sun. Incorrect step clears earlier completed Region flags and resets expected SW. Does not consume Winder. Existing legacy manual Macro marker prevents double arming.
- Tests: four deterministic Sune state-unit checks PASS; Studio client reload and after-server-restart verified service marker __CAV_SUNE_GM_MESSAGE_HOOK_v002 with version 3 and Regionwright Studio owner. No simulated player click/sequence.
- Regionwright Sliding Mosaic engine now accepts optional canonical initialOrder with solvability/permutation validation; defaults to original shuffle for unrelated games. Sune preset is 3x3 [4,5,1,2,0,8,7,6,3]. Tests: three fixed-start/backcompat/invalid-layout checks PASS. Updated source/installed engine, UI, preset matched by SHA256.

## Foundry runtime registration incident — resolved
- World cabin-in-the-ashen-veil, Foundry 14.367/dnd5e 5.3.3, exact active Gamemaster 1 confirmed.
- Puzzles & Locks 0.1.2 on-disk module.json contained UTF-8 BOM (first bytes 239,187,191), rejected by Foundry JSON parser; existing game.modules lookup was absent even though world moduleConfiguration requested it active.
- Installed manifest backed up, rewritten without BOM while preserving exact JSON. Gracefully restarted Foundry. Server returned to administrator setup, so temporary reversible FoundryVTT Config options.json world startup selection was used to relaunch exact Cabin world; original config was restored byte-for-byte with matching SHA256. Administrator credentials never changed; no player accounts were active during restart. After GM rejoin blank password, Puzzles & Locks registered/active v0.1.2 with catalog, slide API, etc. Studio active 0.2.0, DCH active 0.1.15. Unrelated pre-existing startuptup warning unchanged.

## SG-05 live Region migration — configured not activated
- Sune 900x900 original complete portrait master PNG exists in source and installed assets, inspected visually (golden Sune portrait with roses and stars).
- Exact Region: Scene.CAVSG05Scene0001.Region.L15BdSqcbCOLPnIN. Prior regionwright.slidingMosaic.config.size=4 was incorrect. Active GM replaced only the vendor config with size=3 and fixed initialOrder [4,5,1,2,0,8,7,6,3], retaining seed, image, persistent.status=locked, and same Region ID.
- Confirmed native readback; behavior Q8Hr2Dnw6hBpWNjr remains DISABLED and uses tokenEnter. This is INTENTIONAL: enabling tokenEnter would violate the explicit-click/discovery separation and could pop the puzzle automatically when token enters. No Tile documents existed in prior live inventory. Do not mark SG-05 player-ready yet.
- Receipt: C:/Users/rujie/AppData/Local/Programs/Chrome for Testing Dev/utility-harness/artifacts/cav-sg05-regionwright-config-receipt-20261026.json. Source/installed backups under C:/Users/rujie/Documents/Region Editor/docs/cabin-ashen-veil/backups/sune-service-20261026.

## Next player-order installation work
1. Finish SG-05 discovery versus deliberate click: inspect exact approved statue/pedestal image geometry and static reveal artwork, configure Regionwright opening on actual click only AFTER cavSuneBustSequence.status=completed. Keep Sune four corner busts Region-only, not a second puzzle UI. Preserve IDs and allow separate nonspoiler static hint image.
2. Wire Regionwright solved state to elected-GM durable completion and TWO independently claimable rewards: one 1,000gp bag and a separate original Brass Study Key from beneath the bag. Validate once-only claim ledgers, actual source IDs, no automatic Region-enter grants; no full player gameplay simulation yet.
3. Reactivate/correct later listeners only when their prerequisite stages are reached: Roof Clock GM service, Pond Felix GM service, Study/Donovan 587 GM service are saved Macros but previously unarmed; fix lifecycle. Reconcile distinct 024 chest Macro versus documented 027 pellet Great Room quest chest before changing either.
4. Progress in order to Study -> 587 -> Crank -> synchronized Pond/Bath draining -> Bath Screwdriver/Weathered Key/Rosewater -> Aqueduct gate/first chase; then remaining Regionwright puzzle branches. Preserve owner 2026-10-24 Greenhouse lye-only override and Bowl/Keystone distinctions.

## Completion/recovery boundaries
- Foundry scene/world backups were not globally rewritten. Backup exact changed module files and installation manifests; original startup options restored. No PC or actor reward was created, no new Region or Tile, no player puzzle solved.
- Source checks 7/7 PASS plus active-GM readback; NO player regression/playthrough tests.
- Two repo branches distinguish product source from campaign handoff. Do not silently merge side-campaign decisions into core product canon.
- End each future <=25-minute turn by adding new handoff/metadata/transcript to Cabin GitHub archive; never call reconstructed transcript lossless.