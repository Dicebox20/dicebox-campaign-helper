# Cabin in the Ashen Veil — Chat A Enlarged Downstream Install + Boiler Inspection Handoff

**2026-10-26 Pacific, ~20:07–20:20. Owner:** “Lets start installing slightly larger batches, start doing installations and instpections in one turn.”
**Task classification:** Three adjacent early/midgame source safeguards INSTALLED + one original dual-variant Boiler INSPECTED, one unified full regression run **162 PASS / 0 FAIL**, one guarded Foundry reload + independent elected-GM positive readback, no forced puzzle progression or actual player gameplay tests.
**Chat A:** live Foundry/native GM, early/midgame, shared original Regionwright. **Chat B:** isolated late-game source, no live Foundry edits.

## Exact authoritative Git checkpoint

**Regionwright** `Dicebox20/regionwright`, branch `codex/cav-sune-integration-20261026`, new independently remote-verified SHA **`0e83bfdbdd3c13e45fc8f619e8c43a1d073f771b`**, previous **`ef569be1d4da7355f5a4499e54ec135947b8255f`**. Commit scoped to **nine** files:
- NEW `modules/regionwright/scripts/studio-cav-successor-pickup-proof.js`
- NEW `modules/regionwright/scripts/studio-cav-aqueduct-part-proof.js`
- UPDATED existing original `studio-cav-basement-nightstand.js`
- UPDATED existing original `studio-cav-aqueduct-gate.js`
- NEW 10-test `tests/cav-successor-original-drained-pickup-proof.test.mjs`
- NEW 8-test `tests/cav-aqueduct-original-parts-and-drain-proof.test.mjs`
- Source report `docs/cabin-ashen-veil/chat-a-batched-downstream-successors-boiler-inspection-2026-10-26.md`, same-basename structured JSON metadata, and append-only `regionwright-puzzle-update-log-2026-10-26.md`.

Full original source files were backed up before mutation under untracked local `docs/cabin-ashen-veil/backups/chat-a-batched-successors-20261026`; installed-before files retained there. Untracked owner art/archives were not staged. Source/install final SHA256 matches:
- new successor pure `C62F4652A3BBACE1BC9610407278A4CF54617CDF2338ACF2DC7371F2CD32E3D2`
- new Aqueduct part pure `A830DB8DF52CD5D5558C2E354F615C98C99F50D570062EFAAD8F9ED33FE0F408`
- original Basement/Nightstand `D33D5A9970C8E2930093F5FB1A4ED3A2A9177B40B5F886D74012796570533C2E`
- original Aqueduct Gate `0DFA3CD107AF2D33FABDCE04096ED7449B8D89EABD3195CFBAB1E84A42BDEE05`

## PREPARE / INSPECT (exact native owner objects)

Authenticated elected **Gamemaster 1**, Foundry **14.367** world `cabin-in-the-ashen-veil`, 47 Scenes, 54 original ChatMessages. Live audited:
- Weathered Key at existing `Scene.CAVEXT02Scene001.Region.CAVPONDWEATHER01`, original 1 enabled native Behavior `CAVPONDWEATHB001`. Original source world `Item.CAVWEATHERKEY001`, loot qty1. Pickup award ledger NULL.
- Screwdriver at existing `Scene.8yLMRDvxyw58dydh.Region.CAVBATHSCRDRY001`, 1 enabled Behavior `CAVBATHSCRBEH001`, original source world `Item.CAVBATHSCREW0001`, loot qty1. Pickup award ledger NULL.
- Original Foyer Basement door `Scene.CAVHG02Scene0001.Region.CAVFOYERBASEDR01`: click behavior enabled, original Basement teleport `CAVFOYERBASPORT1` DISABLED, unlock ledger NULL.
- Parents' Nightstand `Scene.CAVHU04Scene0001.Region.CAVPARENTNIGHT01`: original click Behavior enabled, repair and `cavNightstandHandleClaim` ledgers NULL. Original Handle world `Item.nRVZJL9JOwEwfnLq` loot qty1.
- Roof Clock `Scene.LhtyO17QenuCExsb.Region.CAVROOFCLOCKR001`, original Gear award `cavRoofClockClaim` NULL. Original Gear world `Item.wDKqETOykWEdKF1Z` loot qty1.
- Original Pond Aqueduct mechanical gate `Scene.CAVEXT02Scene001.Region.CAVPONDAQGATE001`: click Behavior `CAVPONDAQBEH0001` enabled, original traversal portal `CAVPONDAQPORT001` DISABLED, Gear/Handle/Ready flags NULL; first Crooked Man chase remains explicitly owner-DEFERRED.
- **Boiler inspection only:** existing `Scene.CAVBATHScene0001.Region.CAVBBOILERCTRL01` and `Scene.8yLMRDvxyw58dydh.Region.CAVBBOILERCTRL01`, each 1 enabled matching native `CAVBOILERSCRPT01`, original commissioned binding `ENABLED`, current session NULL on both. Actual elected GM `boiler.describe().status="ready"`, canon `[2,1]`. Boiler already healthy; **did NOT reinstall, duplicate, or rewrite either Boiler Region**.
- Sluice original `cavSluiceCrankInstall`, synchronized Pond/Bath water and prior stage transaction NULL; Pond original full art, original Trail targets **filled** Bath, Rosewater ring Behavior DISABLED. No player has been given a source-tagged Weathered Key, Screwdriver, Gear or Handle.

Native baseline on owner PC `utility-harness/artifacts/cav-chat-a-batch-original-boiler-weathered-basement-nightstand-baseline-20261026.json`; Roof Clock/AQ direct native audit `cav-chat-a-batch-aqueduct-part-source-readonly-20261026.cjs`.

## Three concrete gaps fixed in one source/install batch

**1 — Weathered Key → Basement.** Original `studio-cav-basement-nightstand.js` trusted a held provenance-tagged Weathered Key alone to unlock the Basement. An INTERRUPTED original Pond reward writes `cavDrainedPickupClaim.status=reserved`, then creates embedded Item and only afterwards writes DONE. New pure `assessCavSuccessorPickup` requires a genuine DONE pickup receipt with original exact world Item UUID/name/type/quantity, original fixture UUID, same Actor and `embeddedItemId`, exactly one source-flagged Item across world Actors and matching special/origin flags. Both player interaction availability and elected GM original door unlock now use this common proof; an orphan/reserved/duplicate Item cannot open the original portal. Transferred/reassigned embedded Item IDs require **manual GM reconciliation** rather than a silent bypass.

**2 — Screwdriver → Parents' Nightstand → Gate Handle.** Same original DONE + one owned Item identity check governs existing player/GM Screwdriver repair action. New pure `assessCavNightstandRepairProof` requires original Screwdriver pickup DONE with claimant actor matching the Nightstand DONE repair and tool source; before the original one-time Aqueduct Gate Handle Item claim, the elected GM checks that proof. Client “Take Gate Handle” also checks it. No screwdriver consumption is introduced: the tool remains a reusable Item, and handle claim can be reconciled after a genuine repair even if the screwdriver later moves.

**3 — Roof Clock Gear + Nightstand Handle → Aqueduct mechanical gate.** Original source `studio-cav-aqueduct-gate.js` trusted provenance tags without requiring DONE of the original Roof Clock Gear or Nightstand Handle award, and trusted water `status=open,transaction.status=done` without matching operation/Crank/current drained stage. New pure `assessCavAqueductPartProof` verifies original Gear/Handle reward DONE `embeddedItemId`, exact source World Item, original claimant Actor and item ID, uniqueness and provenance flags. Handle requires authentic original Screwdriver+Nightstand repair proof. The original player UI and elected GM `sourceCopy` share this. New common `gateWaterDrained()` reuses **existing fully verified** `assessCavDrainedPickupWaterReady`: source `Item.g3VYdgc1qkgkHGvn` Crank consumed DONE, exact matching committed original OPEN water transaction with Pond/Bath both drained, approved drained Pond background and unique enabled Trail portal to original dry Bath landing. No original part is deleted/consumed unless both proofs pass.

Source modifications DO NOT create any new Scene/Region/Behavior, do NOT enable Aqueduct traversal, and do NOT start Crooked Man chase; the original reserve-before-delete and source Item workflows remain unchanged.

## Integrated VERIFY — one source suite, one reload, separate GM receipt

Added **18** new focused source tests, all PASS; Cabin-wide nonbrowser source suite **162 PASS / 0 FAIL**, 144 before batch. All four installed source files syntax and SHA match. Exactly ONE active elected-GM preflight-guarded `/game` reload committed with all original null story flags, original disabled Foyer+AQ portals, 47 Scenes, 54 messages and dual Boiler ready/no sessions. Independent read-only CDP session after reload verified new pure source imports and positive/negative synthetic arguments: real exact Weathered Key DONE pure-case accepted, reserved denied; Handle DONE+repair pure-case accepted, reserved and missing repair denied. Actual original game state unchanged: Weathered/Screwdriver pickup, Basement unlock, Nightstand repair/Handle claim, Roof Gear claim, AQ part/ready, Crank/water/stage all NULL. Basement/AQ native teleports remain DISABLED; all original native interaction Behaviors still enabled; original Pond full, Trail full Bath and Rosewater disabled. Boiler still **ready on two water variants, sessions NULL, approved [2,1]**. All four original GM services (pickup, Basement, Aqueduct, Boiler) registered; zero provenance-tagged actor Items, 54 ChatMessages.

Positive original owner-PC postreload receipt:
`C:\Users\rujie\AppData\Local\Programs\Chrome for Testing Dev\utility-harness\artifacts\cav-chat-a-large-batch-three-downstream-guard-and-boiler-postreload-gm-20261026.json`

No player Action attempts, item rewards, Item deletions, Stage change, native edit, teleport, chase or playtest. Source protections are installed + GM-reloaded/verified, **not ordinary-player PLAYTESTED**.

## Owner's ongoing enlarged batch workflow
Owner explicitly revised batch size to **slightly larger batches incorporating installations AND inspections in one turn**. Going forward Chat A should prefer **2–3 adjacent source dependency fixes per bounded ~25-minute turn plus inspection of already installed native Regions/Services**, one full integrated regression suite, one guarded reload, one independent GM proof, and one chronological source report + DCH Chat A handoff/archive. Existing workflow safety requirements stay binding; this is an owner-directed batching change, NOT blanket authorization to force puzzle progress or to touch Chat B's live work.

**Next Chat A dependency batch:** continue original Roof Clock→AQ mechanical and Boiler outputs/early-midgame readiness without redoing these verified regions; source-only where actual player test is owner-deferred. Sune Gold/Brass Key/Study587/Donovan Crank stage genuinely unstarted. Boiler puzzle readiness is structural only, real valve clicks not player-playtested. Rosewater ring `CAVROSEWATERSCR1` disabled until genuine Crank drain; owner-approved symbols `rose,sun,moth,thorn` and solution `[1,3,2]`. Sune Scrying Bowl original Item `Item.1n5LONw3nYIy61O9` pickup placement undecided. Crooked Man NPC Actor/first chase owner-deferred.

**Chat B integration reference:** Regionwright Chat A pushed HEAD **`0e83bfdbdd3c13e45fc8f619e8c43a1d073f771b`**. Chat B remains independent late-game source-only, no concurrent native Foundry writes, no merge or direct partner message/ack claimed.

**Archival fidelity:** handoff/metadata/transcript are evidence-based available-message reconstructions, not lossless platform-native chat export.
