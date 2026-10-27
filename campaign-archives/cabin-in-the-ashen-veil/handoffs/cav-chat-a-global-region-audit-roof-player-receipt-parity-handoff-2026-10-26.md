# Cabin in the Ashen Veil — Chat A global RegionBehavior diagnostic and Roof Clock player parity handoff

**October 26, 2026 Pacific, ~21:10–21:23.** Owner: “Alright, if we know where we are lets continue working on the campaign. I'd like to have it done before tomorrow evening.”

**Classification:** Early/midgame Chat A source **BUILT / GitHub PUSH VERIFIED**; original Roof Clock player RegionBehavior **INSTALLED / independently elected-GM VERIFIED**. **185/185 Cabin regressions PASS, 0 failures. Ordinary Player gameplay NOT PLAYTESTED.** The stated October 27 evening deadline is a goal, not a verified completion commitment.

## Exact source and world checkpoint

- Regionwright: `Dicebox20/regionwright`, branch `codex/cav-sune-integration-20261026`, new remote-verified HEAD **`df73f0d303983e48d67d621181672ef64f368e40`**, parent `a500b0d058f9adf6240188c2b37d3e9834971359`.
- One scoped original world: Foundry **14.367**, `cabin-in-the-ashen-veil`, active elected **Gamemaster 1**. Latest postread: **47 Scenes, 232 Regions, 120 RegionBehaviors, 54 ChatMessages**. The prior 47/231/118 native snapshot is historical, not the new baseline.
- Dev Chrome debugging port 9224 went down before this batch; documented `Start-Harness.cmd` was restarted using a **persistent `cmd /k` console**, which preserved the browser's interactive stdin; Foundry server was not restarted. Stable Dev Chrome and exact /game page verified afterward.
- Original untracked owner art/archive assets not touched. Chat B source development remains separate.

## World-wide static diagnostic result

- All **45 native Execute Script** bodies compile as async JavaScript, **0 syntax failures**.
- All **75 native teleportToken** destination UUIDs resolve to existing actual Foundry Regions, **0 missing destinations**.
- **0 duplicate Behavior identity keys** in the 120-Behavior census; includes existing intentionally disabled travel, chase and Rosewater behaviors.
- Corrected audit checked all 232 Region UUIDs. An earlier intermediate heuristic checked only Regions owning Behaviors and falsely reported 74 missing destinations. **Do not quote that false intermediate count as a Foundry defect.**
- This is structural only: no real token-path/traversal/player game validation.

## Roof Clock defect and fix

Original Roof Clock native Region `Scene.LhtyO17QenuCExsb.Region.CAVROOFCLOCKR001`, player Behavior `i6UNtWSFFaZgkdZD`. Previously player UI would offer a clock engagement if provenance-tagged Hour/Minute Items were present even when original native grant ledgers were merely RESERVED or incomplete. GM Gear handler already denied these via strict DONE receipts. Player UI also lacked GM's 400px approach check.

One fail-closed, exact SHA-attested client script change now gates its Engage UI on the original Grandfather/Attic **DONE** claims, matching claimant Actor and embedded Item identities plus origin tags, and matching GM distance geometry. The original click-to-inspect close-up, `12:00` solution, elected GM request authority and once-only Gear stay unchanged. No active story state, Item, token or puzzle grant was manufactured.

- Old native script SHA: `60136c5c25faf8de4a9931889a0e6efe1468c4790dd088cc77cd9fbaa2d6a55c`.
- New native script SHA: **`212584fe6c6eb0780a711b5e9ee23a34cf854c4518cd91d53175af15158a840d`**.
- Original native source exact bytes retained in Regionwright `docs/cabin-ashen-veil/native-source-snapshots/cav-roof-player-original-20261026.js.txt`.
- One original native RegionBehavior `system.source` edited, same Behavior ID/events/enabled. Independent GM readback says **PASS**, all Hour/Minute/Roof and Pond water claim flags remain `NULL`, 47 Scenes/54 messages preserved.

## Source artifacts and receipts

[Detailed Regionwright report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-roof-player-parity-and-global-region-contract-2026-10-26.md) and adjacent machine-readable JSON.

New six-path scoped Regionwright commit: native source snapshot, Node-only fail-closed patch builder `studio-cav-roof-player-parity.js`, eight-test suite `cav-roof-player-done-receipt-ui-parity.test.mjs`, Markdown/JSON report and chronological log append. Full **185/185** tests PASS. A first snapshot attempt distorted Unicode using Windows PowerShell text conversion; the pinned SHA safely rejected the corrupted copy and the exact source was recovered using Node before installation.

Exact owner-machine read-only/positive receipts:
- `utility-harness/artifacts/cav-chat-a-all-behavior-contract-readonly-20261026.json`.
- `utility-harness/artifacts/cav-chat-a-roof-player-done-claim-native-install-20261026.json`.
- `utility-harness/artifacts/cav-chat-a-roof-player-parity-native-independent-postread-20261026.json`.

## Next dependency and deadline boundary

1. Continue the next Chat A enlarged batch in original player prerequisite order: inspect related native player vs GM acceptance for original Clock Hour/Minute and adjacent early/midgame interactions, fix only confirmed defects, preserve original Regions/items; no second Roof reinstall without new evidence.
2. Prepare genuine non-GM vertical-slice acceptance (Sune → Study587 → Crank → Pond/Bath drain → Basement/Screwdriver/Handle → Clock/Gear/Aqueduct) **only when owner lifts earlier player-test deferral**. The first Crooked Man Actor/chase was also expressly deferred; do not commission AQ traversal until its real prereqs and actor exist.
3. Rosewater native ring remains disabled until original synchronized drainage, using approved `rose/sun/moth/thorn` and `[1,3,2]`; original unique Sune Bowl pickup point remains unapproved. Original dual Boiler remains READY for `[2,1]`; no invented Boiler reward or BATH-03/04 scenes.
4. Chat B remains isolated on its late-game source work. Coordinate merge/install and full-campaign acceptance only at owner-designated integration point.
5. Continue append-only chronological source log, dated Chat A handoff, structured metadata and **between-turn coordinator conversation transcript** each substantial turn.

**Nothing in this report implies that the entire campaign is playable by October 27 evening.** The remaining major branches and actual player acceptance must still be completed.
