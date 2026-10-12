# The Mysterious Lodge — Change Log

**Purpose:** a human-readable ledger of meaningful changes to the campaign, not a list of every command, audit, test, or generated receipt. Read with [CURRENT-STATE.json](CURRENT-STATE.json) for the current truth. Earlier names: **Central Lodge**. **House of the Damned** is a separate campaign.

**Entry rule:** append one entry for a substantive, completed decision/change or a confirmed gameplay blocker. Include the affected Scene(s), a concise observed outcome, and the strongest actual proof. Do **not** turn ordinary read-only status checks, retries, temporary errors, or handoff packaging into new campaign milestones. Correct older entries with a dated superseding entry rather than silently rewriting history. The detailed append-only decision record remains [DECISIONS.jsonl](DECISIONS.jsonl).

## Verification meanings

- **Designed:** approved on paper, not necessarily implemented.
- **Staged / source-tested:** code or assets prepared, or unit/mocked tests passed; not installed.
- **Installed / persisted:** actual test-world documents saved and independently read back; player behavior **not** implied.
- **Gameplay-tested:** a real character in Foundry triggered the actual clue, Item, Region, and result. Record what the character did.
- **Playthrough-accepted:** a full player route, including its dependencies, was completed; individual passing scripts are insufficient.
- **Blocked / uncertain:** exact observed outcome not resolved. Do not promote to pass or blindly replay a potentially destructive operation.

## Historical changes and significant blockers

These entries were reconstructed from project receipts and handoff documents during the October 11 timeline audit, not from an exhaustive version-control history. Dates are Pacific calendar dates; they are not precise timestamps.

| Date | Scope | Actual change or observed blocker | Verification | Next implication / primary record |
| --- | --- | --- | --- | --- |
| 2026-10-06 | All 21 Scenes | Established the single-geography Scene roster and ownership of puzzle, notice, story, horror, light, transition, and system Regions. | **Designed** | Do not rebuild this architecture just to rerun diagnostics. `work/lodge-campaign/PUZZLE-REGION-PLAN.md`, `work/lodge-campaign/manifests/MAP-ROSTER.json` |
| 2026-10-06 to 2026-10-07 | E1 and other map builds | Prepared image/render and Scene build artifacts; E1 passed visual inspection after 13 recorded render attempts but its map workflow was still at IMPLEMENT. | **Staged / source-tested** | A build receipt is not proof of a usable Scene. `work/lodge-campaign/scenes/E1-arrival-front-grounds/inspect/INSPECT-v011.json`, `WORKFLOW-STATE.json` |
| 2026-10-08 to 2026-10-09 | Disposable fixture | Migrated the original Lodge Scene/Actor data into `dbx-test-world`. Recovered 21 Scenes, 202 Regions, 119 original RegionBehaviors; separately restored 33 Items, a runtime macro, and State Ledger. | **Installed / source-audited** | Real triggers, navigation, and background art remained unverified. `work/clscale-central-lodge-migration-v001/central-scene-import-receipt-v001.json`, `clscale-runtime-closure-install-receipt-v001.json` |
| 2026-10-09 | N3 depot menu | Added and reconciled a **disabled** experimental destination-menu behavior; mock/browser preview worked, but this was not an enabled, playable travel system. | **Installed disabled / component-tested** | Do not confuse menu display with token travel. `work/clscale-central-lodge-migration-v001/clscale-depot-native-reconciliation-v001.json` |
| 2026-10-09 | N3 → N1 synthetic transfer | One native disposable transfer reached an uncertain state after changing ledger state. Automation stopped rather than retrying; the test effects were subsequently cleaned up and original tokens preserved. | **Blocked / reconciled**, not certified | Actual safe physical railway transitions still need separate player-level testing. `clscale-depot-native-transfer-v001-final.json`, `clscale-fixture-transfer-cleanup-receipt-v001.json` |
| 2026-10-09 | Development process | Accepted a **playtest-first fast track**: finish essential connections, do minimum mandatory safety checks, play from arrival through finale, and fix observed gameplay blockers in order. | **Owner-approved workflow**, not a completed playtest | Avoid building new diagnostic frameworks. `docs/THE-MYSTERIOUS-LODGE-FAST-TRACK-ROADMAP-2026-10-09.md` |
| 2026-10-10 | M2 and N3 item acquisitions | Corrected an earlier audit error: the Old Estate Survey and Station Route Plate **do have embedded pickup scripts**. | **Source-verified only** | Both pickups still need actual character testing. `work/clscale-central-lodge-migration-v001/N3-DEPENDENCY-REVIEW-20261010.md` |
| 2026-10-10 | N3/T3 progression | Found a genuine circular dependency: N3 needed a T3 fragment to open T3. Owner selected two-stage cartography. Preliminary Old Estate Survey + Cult Passage Diagram allows the branch with existing board/switch proofs; T3 fragment completes the overlay on the return. | **Owner approved; 39 static tests passed** | Preserve original item locations. `work/clscale-central-lodge-migration-v001/n3-two-stage-20261010/source-only-acceptance.json` |
| 2026-10-10 | N3 live test-world scripts | Installed **exactly two** N3 RegionBehavior source changes in `dbx-test-world`, port **30005**, after a complete 181-file backup. Both saved scripts matched expected hashes after independent Foundry reload. | **Installed / persisted; NOT gameplay-tested** | Next test actual character Region and Item interactions; the physical N3 → T3 transition is **not installed**. `work/clscale-central-lodge-migration-v001/n3-two-stage-20261010/n3-two-stage-live-install-once-receipt.json` |
| 2026-10-11 | Process/continuity documentation | Following the timeline review, added a player-focused change log and quick new-chat procedure over the existing campaign handoff system. This is **documentation only**, with no Foundry or campaign implementation changes. | **Documentation**, not gameplay progress | See [NEW-CHAT-WORKFLOW.md](NEW-CHAT-WORKFLOW.md). The owner's prior pause on campaign/Foundry/product work is not lifted by this documentation request. |

## Next changelog entry template

```md
### YYYY-MM-DD — [Scene(s)] Short description
- **Observed or requested:** What a player did (or the owner explicitly approved).
- **Change:** Exact item, Region, connection, or file changed. Note if NONE.
- **Before → after:** What used to happen and what now happens.
- **Evidence level:** Designed | Staged | Installed | Gameplay-tested | Playthrough-accepted | Blocked/uncertain.
- **Proof:** One relevant test-world observation and/or source/receipt path. Do not claim more than the proof shows.
- **Still broken / next:** Exactly one player-facing next action or blocker.
```

**Rule against diagnostic drift:** once a blocker is sufficiently understood to attempt one narrow fix, stop gathering broad inventories and return to the character's interrupted playthrough. Keep mandatory backup, ownership, and non-retry protections for world mutations.

### 2026-10-11 — E1: Player-triggered Runtime Kernel permission
- **Observed:** Randal (Player 1) approached the E1 hound and received three Foundry warnings: no permission to execute Macro "Central Lodge — Runtime Kernel".
- **Before → after:** Foundry Macro `FHQiFYx6OntZVo9d` had default ownership NONE(0), GM 1 OWNER(3); live `canUserExecute` was false for Player 1/2 even though both have script-macro role permission. GM 1 changed **only** default Macro ownership to LIMITED(1), preserving GM 1 OWNER(3) and the exact JavaScript command hash.
- **Evidence level:** **Installed / persisted and API permission readback verified**, NOT gameplay-tested. Live independent reload confirms `canUserExecute` true for both players; only one native Macro update attempted and confirmed.
- **Proof:** `work/clscale-central-lodge-migration-v001/e1-kernel-limited-ownership-install-once.json`. Foundry v14 Macro `canUserExecute`, Macro ownership and Scene Region Execute Script documentation.
- **Still broken / next:** Refresh Player 1's browser if needed, move Randal out of then back into the E1 Hound Notice Region, and check that the permission warnings have stopped and the hound clue behaves correctly. Do not grant global GM privileges or redo player-owned character setup.


### 2026-10-11 — All world Macro execution permissions in disposable test world
- **Observed or requested:** Owner directed that players be able to execute every Macro in the current disposable world after the E1 Runtime Kernel denied Player 1.
- **Change:** In `dbx-test-world` on port 30005, raised the default ownership of four additional world Macros from NONE(0) to LIMITED(1). The Runtime Kernel was already LIMITED. No Macro source, ID, name, explicit ownership, actor, token, Region, Item, Scene, or settings changed. GM 1 remains OWNER(3); both player accounts can execute all five world Macros without OWNER/edit rights.
- **Before → after:** Player 1/2 could execute 1 of 5 world Macros; after reload, both can execute 5 of 5. All five source hashes match the pre-write snapshot.
- **Evidence level:** **Installed / persisted / permission readback verified**, not gameplay-tested for the underlying Macro behaviors.
- **Proof:** `work/clscale-central-lodge-migration-v001/e1-all-world-macro-limited-permissions-v002-once.json`; exact pre-write Macro snapshot `work/clscale-central-lodge-migration-v001/e1-all-world-macros-pre-permission-snapshot-v002.json`. A first preflight stopped before writes because the expected name of `MidiQOL.exportTroubleShooterData` was misspelled; its receipt records zero attempted updates.
- **Still broken / next:** Randal (Player 1) should refresh, move out of and back into the E1 Hound Notice Region, and report whether the warnings disappear and the hound clue appears. Other Macro functions remain untested; this does not grant GM permissions or touch port 30000.
