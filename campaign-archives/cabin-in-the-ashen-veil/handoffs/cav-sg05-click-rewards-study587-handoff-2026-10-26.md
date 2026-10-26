# Cabin in the Ashen Veil — SG-05 Sliding Relief and Study 587 Installation Handoff
**Turn date:** 2026-10-26, Pacific (after preceding Sune integration turn).
**Execution contract:** Maximum 25-minute work turns; install in player prerequisite order; defer full player gameplay testing until puzzle chains installed; preserve structural checks; log Regionwright modifications; GitHub handoff + metadata + available-message transcript at each turn.
**Status:** SG-05 deliberate-click controller and two separately claimable rewards INSTALLED / STRUCTURALLY VERIFIED, not PLAYTESTED. Existing Study 587 service now ARMED from Studio at world ready; no 587 player test.

## Verified live Foundry result
- World `cabin-in-the-ashen-veil`, Foundry 14.367, active elected Gamemaster 1. Regionwright Studio active; Puzzles & Locks 0.1.2 active.
- Original Region `Scene.CAVSG05Scene0001.Region.L15BdSqcbCOLPnIN` preserved, with original RegionBehavior `Q8Hr2Dnw6hBpWNjr` now enabled **only** for `behaviorViewed`, `behaviorUnviewed`, `behaviorDeactivated`. Previously disabled `tokenEnter` handler was replaced; no direct Region-entry reward or slider-opening behavior.
- Source dispatch uses `game.modules.get("regionwright").api.campaign.cabin.suneRelief.handleRegionEvent(region,event)`. Regionwright Studio installs scoped player pointertap handler when Region is visible, unregisters on unview, and checks exactly one selected owned nearby character.
- Before busts complete: descriptive non-spoiler message only. After four-bust flag completed: explicit player click opens Regionwright Puzzles & Locks Sliding Mosaic, not a competing UI. After Regionwright marks puzzle solved: explicit gold claim on click; on a **separate subsequent click**, explicit Brass Key claim. Both steps are single-use.
- Regionwright Sliding Mosaic core has an exact-target Cabin guard for SG-05: cannot open/finish before completed bust sequence; on an authenticated socket completion, verifies server-provided sender owns a character token at that Region. The campaign handler intentionally suppresses tokenEnter automatic puzzle open for this Region. Other puzzles retain their existing API and shuffle behavior.
- The Regionwright SG-05 puzzle remains `persistent.status=locked`, canonical 3×3 start `[4,5,1,2,0,8,7,6,3]`; it was not solved or state-advanced in this turn.
- New GM world source `Item.CAVSUNEGPBAG0001`: `Sune's Cloth Bag (1,000 gp)`, D&D5e `container` with actual `system.currency.gp=1000`. Existing source `Item.CAVSTUDYBRASS001` (Brass Key) preserved. No item was created on any actor during installation.
- GM Studio reward listener `__CAV_SUNE_RELIEF_GM_SERVICE_v001` v1 registered; separate `cavSuneGoldClaim` and `cavSuneBrassKeyClaim` ledgers on original Region, reserve/done and duplicate-item provenance guard. After source study door inspection, the key's embedded actor copy is now stamped with **both** downstream fields `cavStudyKeySourceUuid=Item.CAVSTUDYBRASS001` and `cavStudyKeySourceRegionUuid=Scene.CAVSG05Scene0001.Region.L15BdSqcbCOLPnIN` required by the already installed H-G06 Study door script. No changes to door Region or Key world template.
- Study/587 successor: old `CAV Study 587 and Donovan Lockbox - GM Service v001` Macro source reviewed and moved without changed logic into `studio-cav-587.js`, automatically registered on world `ready` with original marker `__CAV_587_ELECTED_GM_SERVICE_v001` (observed active Hook ID 612). The old Macro remains for historical/diagnostic reference but its marker prevents double listener registration.
- After final GM reload: Sune bust service marker v3, relief service v1, Study 587 listener active, original SG-05 Region behavior enabled/view events only, Gold source gp=1000, Brass Key original source present, Regionwright picture still locked.

## Source and product repository commits
- [Regionwright branch](https://github.com/Dicebox20/regionwright/tree/codex/cav-sune-integration-20261026)
- SG-05 controller/GM rewards: `638c4a8ae516fa9ebea0142b263ce68aa58d208f`
- Auto-arm original Study/587 GM listener: `9817700baa188627e785f14a6eba377d60797a61`
- Exact Study Key downstream provenance fix: `9aa43cdabdd64b7bf1f921971008ae52c11570c5`
- [Regionwright update log](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/regionwright-puzzle-update-log-2026-10-26.md)

## Test scope, evidence and backup
- 11/11 Node source-level tests PASS (Sune bust order/reset, fixed 3×3 solvability/default behavior, relief stage gates and reward order).
- All affected JS syntax, deployed SHA matches, and exact active-GM, listener registrations, RegionBehavior events, source Item and puzzle persistent state readbacks verified. **Zero real player gameplay interactions or puzzle solve tests** in this turn, per owner exception.
- Exact before/after Foundry receipt: `C:\Users\rujie\AppData\Local\Programs\Chrome for Testing Dev\utility-harness\artifacts\cav-sg05-click-rewards-install-receipt-20261026.json`. Source and installed scripts backed up in `C:\Users\rujie\Documents\Region Editor\docs\cabin-ashen-veil\backups\sune-relief-20261026`. Backups for earlier Sune stage also present under `sune-service-20261026`.
- Existing approved **portrait** master from the later 2026-10-24 Sune player-dialog checkpoint is used. Older 2026-10-22 design text says **family garden picnic**; reconcile only if owner chooses to supersede their later approved portrait art. Do not independently replace existing approved art.
- Caveats reserved for final end-to-end test: real non-GM click/range/visibility, socket sender propagation and final-board validation, two distinct reward pickups with partial-failure recovery, after-reload/GM handover behavior, double click, item transfer, and Study door activation. Regionwright's existing solve accepts a client-provided finished board; this turn added eligibility and location validation, not adversarial move replay. Do not label player-tested.

## Next player-prerequisite work
1. H-G06 → H-G05 keyed Study entry and secondary Study exterior path: structural audit of all door sources/destinations, key provenance contract, and actual 587 request listener. Do not award extra key/Crank or bypass sequence.
2. Validate Study 587 note → Donovan Shack 587 lockbox → Sluice Crank, preserving once-only claims and GM listener startup. Current player-facing inspection Regions and vetted service source are installed, but real player interaction deferred.
3. Reconcile separate Great Room 024 first chest versus canon 027 Dust of Dryness lockbox before editing either; 027 is a late Undercroft prerequisite.
4. Install synchronized Pond/Bath sluice flood-state controller, Bed/Pool safety and Stage imagery, Weathered Key and Bath Screwdriver, then Gate Handle/Replacement Gear → Aqueduct and first chase.
5. Finish remaining Regionwright interactive puzzles and late campaign in canonical player dependency order. Ensure owner-led 25-minute turn boundaries with updated GitHub records and Regionwright change log.

**No campaign gameplay tests were conducted. No player actor inventory, existing Scene image/walls or portal were modified during this turn.**
