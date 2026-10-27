# Cabin in the Ashen Veil — Chat A original Oars → Rowboat, Vanity → Carriage, Hook → Attic Hatch

**Dated:** October 26, 2026 Pacific (~21:40–21:52). **Workstream:** Chat A EARLY/MIDGAME only. Owner said “Lets continue.” Playability goal is October 27 evening. This is an evidence-based implementation handoff, not a claim of playtest completion.

## Authoritative verified checkpoint

- Regionwright: `Dicebox20/regionwright`, branch `codex/cav-sune-integration-20261026`.
- New **remote-verified HEAD `17ea82bda1a0da04a233f9173630cb8763b7cd2a`**, parent `830d48788bcfae13a760c73ad2cbc129be68c63c`.
- Full **217/217 Cabin source regression tests PASS** (19 added, zero failed), 42 test files.
- Foundry VTT 14.367, exact `cabin-in-the-ashen-veil`, elected `Gamemaster 1`. Latest independent GM census: **47 Scenes, 232 Regions, 121 Behaviors, 46 native Execute Scripts, 75 teleportToken Behaviors, 54 ChatMessages**. All 46 scripts pass syntax.
- Three original in-place RegionBehavior `system.source` edits made and separately verified. Original Region/Behavior IDs, event lists, allowed GM, Item/reward award code, original walls/art, stage transitions and routes preserved.
- Original Oars pickup claim is **DONE with exactly one matching Actor embedded Wooden Oars Item**; no Oars Item/progress changed. Seven other relevant original reward/status flags remain NULL. Attic entry and return portals remain disabled until the real Ladder Hook interaction succeeds.
- No non-GM acceptance gameplay test, new player reward, fabricated Crank/water state, Crooked Man chase/Actor or Chat B late-game changes.

## Three confirmed defects corrected

1. **Rowboat Mirror prerequisite** `Scene.CAVEXT02Scene001.Region.CAVROWBOATREG001`, original native Behavior `CAVMIRRORBEH0001`. Previously accepted a provenance-tagged or named Wooden Oars Item without confirming the original pickup claim. Now verifies original Donovan Shack `cavOarsPickup.status=done`, same claiming Actor, exact original Item ID, source UUID, and original Region provenance. Original source SHA `55205e21926418bf764081c4f2e21d372d103fec08f834a08cb44bdfdfce71a8` → installed SHA `e310f3684eb4299cd4cc9171c0d4098e5a5c87548505f5edeac252eaac65ad09`.
2. **Family Carriage Hook prerequisite** `Scene.CAVEXT01Yard0001.Region.CAV01R0000000008`, original Behavior `3nhNHvdSWo9ix10a`. Previously trusted a tagged Carriage Key without a completed original Vanity two-key award. Now demands `cavVanityKeysClaim.status=done`, exact Actor, Mirror prerequisite, both correctly ordered original Key source UUIDs and distinct embedded Item IDs, and exact Carriage Key/provenance. Original SHA `a8b0ffc1037c5d0c65fb812bed1230a0dd22a1d00102c261d0766d9714f00d77` → installed `c0623e82535d9b0c372e31fd74a9dfd95a4e6149c0599b5b8ad0c82bd62e31`.
3. **Attic Hatch Ladder Hook prerequisite** `Scene.gGgUHlHdI7RFrbUh.Region.UOudBnxOGVlAlPoa`, original Behavior `8gISLbFWqUhxy9e8`. Previously trusted tagged Ladder Hook without completed original Carriage claim. Now demands `cavFamilyCarriageHookClaim.status=done`, matching Actor, original Item embedded ID and source/Region provenance. Original SHA `160447535fe8d31d77270c7a2b2971dab18eaa879a415115fa721f1fde739c69` → installed `6b673d12f662c0ea95570c048e32e5f0bd7da359ef1699d2931d6862b02547d0`. Preserve existing **return before entry** portal enable order.

## Verification and exact recorded limitations

- [Detailed Regionwright technical report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-rowboat-carriage-hatch-authentic-done-guards-2026-10-26.md) and adjacent JSON metadata.
- Node-only three-source original SHA attestation/pin generator `modules/regionwright/scripts/studio-cav-opening-triple-claim-proof.js`; exact three original native source snapshots; `tests/cav-opening-oars-carriage-hatch-done-claims.test.mjs` with 19 tests.
- Native guarded combined write receipt: `utility-harness/artifacts/cav-chat-a-original-rowboat-carriage-hatch-three-native-install-20261026.json`, status `installed-gm-readback-pass`, exactly 3 updates successful.
- Separate read-only elected-GM postread: `utility-harness/artifacts/cav-chat-a-opening-triple-native-independent-postread-20261026.json`, **PASS**. Includes eight specific preserved or corrected script SHAs and original claim states.
- First focused test failed before installation because native Rowboat script uses CRLF; corrected exact-line-ending match, then 19/19 focused and 217/217 full PASS.
- First installer *wrapper* failed JavaScript parse before reaching Bridge/Foundry; **no write attempted** in that step.
- First independent postread was stricter than needed about total world Behavior count. Read-only delta confirmed independently added late-game **Greenhouse Lye** native Behavior `CAVEXT06LYEMIX01` (EXT-06; Chat B domain) caused 120→121 Behaviors and 45→46 scripts. No Chat B object edited. Second independent readback positively matched 121/46 and all original Chat A hashes/claims **PASS**.
- Local Git push output raised a PowerShell stderr warning/exception *after local commit*. Exact remote HEAD `17ea82bda1a0da04a233f9173630cb8763b7cd2a` was independently verified using GitHub API. No push replay or untracked changes needed.

## Next step in Chat A and separation

Continue PREPARE → INSPECT → BUILD → VERIFY → CATALOGUE, larger batches, one guarded/native readback, append-only chat transcript plus technical handoff. Prefer **a novel high-priority player interaction or travel landing defect**, then prepare genuine non-GM vertical slice acceptance for the owner's final testing stage. Do **not** re-install proven original Oars/Vanity/Clock/Carriage/Hatch. Preserve Chat B separate until owner explicitly directs integrated acceptance/merge. Do not force any missing reward/world flag. Original Rosewater remains disabled until real synchronized Pond+Bath drain. Crooked Man chase/Actor owner-deferred. Original unique Sune Bowl pickup spot remains undecided.

**Result:** 217 source PASS; 3 original native changes installed and independently GM verified; **player-playtested state not established**.