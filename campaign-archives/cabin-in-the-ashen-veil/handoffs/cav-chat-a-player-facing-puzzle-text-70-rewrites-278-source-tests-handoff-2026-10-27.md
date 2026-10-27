# Cabin in the Ashen Veil — Chat A puzzle player-facing prose QA handoff

**Date:** October 27, 2026 Pacific. **Owner prompt:** "I'd like to start using this chat to test the puzzles and change some things. namely this, it gives players directions on how to complete the puzzle. I need you to audit all the text and remove any direct instruction" (with a screenshot of the Family Carriage's exact key-and-character solution). The owner **now authorizes localized puzzle testing and wording iteration in this chat**, an exception to the previous test-only-after-full-install plan for this scope. Broad full-campaign cross-workstream compatibility and comprehensive non-GM acceptance remain separate.

## Installed and verified

- Original Foundry world `cabin-in-the-ashen-veil`, version 14.367, original elected Gamemaster. Read-only audit: **47 Scenes, 250 Regions**, 60 original native executable Region scripts, 5 Journals with 331 page records, 78 world items, 326 Actor-embedded items, 19 world Macros, 52 earlier ChatMessages and 32 `studio-cav-*` module scripts. Inventory preserved on the authorized host.
- **70 exact player-facing wording changes**: **30** source-string replacements in **11 native RegionBehaviors**; **39** message/dialog/label replacements in **8 original `studio-cav-*` module files**; **1** player-facing dialog string in original `CAV - First Chest (024)` macro. No new Actors, Regions, Behaviors, Scenes, Items or Macros. No character moved, item claimed, GM transaction replayed, or original puzzle logic changed.
- Carriage original enabled `Scene.CAVEXT01Yard0001.Region.CAV01R0000000008.RegionBehavior.3nhNHvdSWo9ix10a` reworded to describe worn carriage and locked door without naming Carriage Key or instructing placement. New source SHA256 `b8a8a89b1064c21ba3efdbd4cc09dce451de9775bd808b0edd973271a1c0d580`. Ladder Hook remains genuinely key/provenance gated; none awarded.
- Others: Roof Clock instructions, fireplace exact item hints, Study 587/Donovan controls, staged Privy tool+DC leak; Aqueduct gate, cellar/Parents nightstand screwdriver source, Sophia iron key source, Sluice Crank and fixture checks; Sune relief; staged/dormant First Chase narration no longer reveals its DC / success thresholds; late-facing Gazebo, Hope Chest, Wick shelf, disabled Keystone dais descriptions. First Chest macro no longer says "Enter the combination", but its `024` logic and digit wheels remain intact. GM-only approval prompts and actual dice/item rules deliberately preserved. Late-game **text only** was edited; Chat B Undercroft mechanics and Silver Tiny Key logic were not touched.
- Eleven original RegionBehaviors updated **in place** with source exact-equality preflight and per-update readbacks. Independent second elected-GM read-only source checksum verification **11/11 PASS**. Eight module files changed in source and installed Foundry module directory with before/after SHA and backup evidence; separate source/disk check **8/8 PASS**. One original GM Macro command revised and independently read back **PASS**.
- All modified source files parse and full Cabin source regression **278/278 PASS**, **0 failures across 52 test files**. New static tests enforce all source-module replacements, original native UUID/SHA manifest, macro provenance and owner non-spoiler standard. Final heuristic residual report still contains benign post-success narration, GM-only disabled confirmation text and technical strings; static scans cannot promise every dynamic UI is spoiler-free.
- Source checkout `Dicebox20/regionwright`, branch `codex/cav-sune-integration-20261026`, remote-verified HEAD **`83401ee6cacb45e2ab81ab9f83853c62f9ff4a56`** (parent `b136fb9fd64e2a16cfbafd3cd12d235dfe1aa778`). Owner untracked artifacts outside target paths were not altered.

## Evidence and source of truth

[Full source report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-player-facing-puzzle-text-anti-spoiler-audit-2026-10-27.md) · [Exact old/new 70 replacement manifest](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/player-facing-puzzle-nonspoiler-text-audit-manifest-2026-10-27.json) · [Shared permanent writing/QA rule](../policies/cav-player-facing-puzzle-prose-no-direct-solutions-v1-2026-10-27.md).

Original host local machine receipts under `C:\Users\rujie\AppData\Local\Programs\Chrome for Testing Dev\utility-harness\artifacts`:
- `cav-player-facing-comprehensive-text-inventory-20261027.json` and `cav-player-facing-comprehensive-text-inventory-final-after-70-20261027.json`;
- `cav-player-facing-all-eleven-native-sources-independent-GM-proof-20261027.json`;
- `cav-player-facing-eight-modules-and-chest-macro-independent-postread-20261027.json`;
- `cav-player-facing-native-seven-behaviors-guarded-write-20261027.json`;
- `cav-player-prose-late-native-four-guarded-updates-20261027.json`;
- `cav-player-facing-first-chest-macro-narration-original-in-place-20261027.json`;
- `cav-player-facing-final-residual-directive-quote-audit-20261027.json`;
- source-before backups and installed module exact SHA deployment receipts preserved nearby.

Failed strict preflights involved syntax/whitespace in installer scripts and test-manifest serialization **before any corresponding write**, subsequently diagnosed and corrected. No uncertain native partial transaction remains in this batch. Do not rerun the original installers or apply the same 70 replacements twice.

## Open acceptance boundaries / next owner QA interaction

**Live native Document sources and macro command are updated**, but existing open Dialogs, previously registered player pointer handlers and already-imported module JavaScript may show prior strings until the relevant client/scene or coordinated Foundry module refresh. Do NOT restart Chat B's active Undercroft work unannounced. Coordinate a safe module/client refresh, then have a real non-GM player click the Family Carriage and other representative fixtures, verify the exact visible narration, and report any remaining leaks; preserve real puzzle progression and player rewards (no synthetic claims for testing). End-to-end player acceptance has **not yet been performed**.

**Overall status:** Broad static audit and 70 targeted live/source revisions completed; code and native source verified; UI acceptance/runtime refresh still pending. Continue actual player-facing puzzle testing in this chat under the owner-approved non-spoiler rule.
