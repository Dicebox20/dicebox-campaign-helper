# CL-91 Early QA — Canonical State-Path Repairs and Unresolved Progression Gates

Captured 2026-10-07 at Foundry 14.367, dnd5e 5.3.3, `the-lost-mine-of-phandalin`. All live work undertaken under a bounded governed continuation. Baseline **21 Scenes / 202 Regions / 115 RegionBehaviors / 33 canonical Items**, ledger revision 0. No gameplay canary.

## Six source-certified state-path corrections (completed)

| Scene | Behavior ID | Old field | New canonical field |
|---|---|---|---|
| M1 | `5vB7Rsqi5XxfjKjQ` | `puzzles.m1.clockEmblemInserted` | `puzzles.m1.silverFamilyEmblemInstalled` |
| M1 | `OcRjOu5UK9Jq1XfI` | `puzzles.m1.clockSettingSolved` | `puzzles.m1.clockSettingResolved` |
| M1 | `8vtIgrjGwYaxjL07` | `puzzles.m1.clockSettingSolved` | `puzzles.m1.clockSettingResolved` |
| M2 | `re48ahV2D14sF4Ln` | `puzzles.m2.portraitEyeRestored` | `puzzles.m2.glassEyeInstalled` |
| M2 | `aGn2ZJSSH0WNzxzz` | `puzzles.m2.playerPianoSolved` | `puzzles.m2.pianoRollInstalled` |
| M2 | `dgr5x5y5Df8GuX1d` | `puzzles.m2.familyReliquaryOpened` | `puzzles.m2.reliquaryUnlocked` |

`cl91-m1-m2-statepath-preview-v001.page.js` returned PASS no-write; guarded `cl91-m1-m2-alias-apply-v001.page.js` PASS changed precisely six sources; separate `cl91-m1-m2-alias-final-verify-v001.page.js` PASS. All six exact new source SHA values frozen in APPLY and verifier. No Region count, behavior count, event, kernel, Actor, Item or ledger changes.

**Unresolved:** M1 `clockSettingResolved` still has no verified behavior to set it. Therefore the grandfather clock and its reliquary-key / baggage-token pickups are NOT gameplay-complete. M2 `founderPortraitOpened` and U2 `servantHistoryObserved` were not renamed automatically because their intended semantics differ from canonical `founderPortraitObserved` and `servantHistoryInterpreted`. Do not silently harmonize these until narrative/state authority is reconciled. B1 `underworksUnlocked`, M3 `serviceRouteUnlocked`, and C1 `c2Unlocked` need stage authoring/verification; no source direct `statePath` found, but may be reserved for later route integration.

## CL-91 N3-T3 progression gap

`puzzles.n3.t3BranchUnlocked` is false. No **literal reference** was found anywhere in the 115 Lodge RegionBehavior sources, shared DiceBox kernel, or 132 world macros. The N3 Branch Railway has no RegionBehavior. Thus no existing DiceBox code was found to set the branch unlock; this does not authorize inventing its prerequisites. The T3→N3 return and T3→F1 exits are installed and independently source-verified, but N3→T3 travel remains intentionally gated/unimplemented.

## CL-51 corrected fixture ownership (v003)

The initial world.dicebox-only managed audit undercounted fixture ownership. Canonical register `work/foundry-playwright-harness/receipts/cl51-fixture-register-v003.json` includes **86 unique light stable IDs** across **54 legacy namespace** and **32 world.dicebox namespace** fixtures. **68 explicitly labeled owners** and **18 inferred-only inactive tunnel placeholders**. State group counts: 28 event-driven day/night, 26 local/power, 14 ritual/encounter, and 18 inactive tunnel. All 86 hidden; no light modified. 18 inferred are not licensed for automatic activation. The exact night trigger is explicitly unresolved by `AUTOMATION-RULES.md`. Do not install one without GM choice.

## CL-50 geometric evidence (not binding authority)

Read-only `cl50-tunnel-spatial-anchor-evidence-v001.page.js` confirms T1 Mouth A is the left-edge rectangle, Mouth B right; T2 Mouth A left and Mouth B right. N1 East/West, N2 A/B and N3 West/East Regions are also spatially resolved. This alone is **not** source authorization for world-to-world pairings. Scene connection orientation and safe teleport/return still require an approved map/topology match. No T1/T2 route installed this turn.

## Next governed tasks

1. Recheck live 21/202/115/33 plus source SHA, kernel hash and ledger rev before any install; never rerun already PASSed patches.
2. Recover exact authored M1 clock setting interaction, M2 Founder Portrait/U2 servant history semantics, and three pending route-state flags; design no-softlock behavior PREVIEW and independent verify.
3. Reconcile N3 branch unlock from canon; define switch/route-overlay prerequisite authority and progression staging, then add safe N3→T3 only under governed installer.
4. Bind T1/T2 tunnel mouths only after original map-topology / GM confirmation; preserve current T3 exits.
5. Explicitly ask user for the **event** that initiates one-way night transition; the authored rules forbid real-time sunset and manual ad-hoc guessing.
6. Continue CL-52 pacing, CL-90 full audit, CL-91 simulations and CL-92 controlled real gameplay canaries. No tests in this report substitute for a real player/GM canary.
