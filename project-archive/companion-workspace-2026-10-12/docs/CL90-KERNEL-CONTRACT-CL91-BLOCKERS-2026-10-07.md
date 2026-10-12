# CL-90 / CL-91 Source-Only Kernel Contract Audit v001
Captured 2026-10-07, Foundry 14.367, dnd5e 5.3.3, world `the-lost-mine-of-phandalin`.

## Verified baseline and direct self-test

A new read-only repeatable safety smoke `work/foundry-playwright-harness/cl90-progress-safety-smoke-v001.page.js` returned **PASS_WITH_KNOWN_BLOCKERS**: 21 canonical Scenes, 202 Regions, 115 enabled RegionBehaviors with 115 unique stable IDs, 33 canonical Items, ledger revision 0 and zero notices; shared kernel SHA256 `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`. No gameplay canary was performed.

The shared kernel's built-in `selfTest` was invoked in **no-write mode**, returned PASS with 33 ledger Items, 33 canonical world Items, no failures and no change to ledger revision. Executing Assistant Gamemaster is not the primary active GM; this self-test does NOT certify event routing or live pickup/teleport permission.

## Literal request schema and dependency graph

The no-write parser `cl90-kernel-request-contract-audit-v001.page.js` inspected all 115 RegionBehaviors and parsed **97 literal** DiceBox action payloads: 30 pickup, 29 notice, 16 observe, 16 socket, and 6 gate. Three CL-33 GM-adjudicated pickup implementations build their request payloads dynamically; those are excluded from JSON-only inspection (but their source hashes and offline contracts were separately verified earlier).

Of the 97 literal requests, item references and state paths match the canonical ledger **except two known historical differences**:

| Scene/behavior | Current source path | Predeclared ledger field | Status |
| --- | --- | --- | --- |
| M2 Founder Portrait Signet, `IdriZEGhxUY9whcV` | `puzzles.m2.founderPortraitOpened` | `puzzles.m2.founderPortraitObserved` | **Semantic reconciliation required; not automatically renamed.** M2 PREPARE says Founder's Signet physically reveals the Old Estate Survey; live source already checks that the actor carries the canonical Signet before granting the Survey. An opened reveal and having observed a portrait are not assumed identical. |
| U2 Servant History Observation, `J11ZvQh4lqzEsvRi` | `puzzles.u2.servantHistoryObserved` | `puzzles.u2.servantHistoryInterpreted` | **Semantic reconciliation required; not automatically renamed.** Source currently presents physical servants' routine evidence. Reading traces and fully interpreting their history are not necessarily the same beat. |

A separate no-write six-gate prerequisite graph `cl91-kernel-gate-writer-graph-v001.page.js` confirms **six existing gates** have identified producer behaviors for all **state-type prerequisites that currently evaluate to false**; zero state prerequisites had no producer. Gates: C1 shrine completion, E3 fountain, E4 mausoleum crests, N1 rail power, N2 fast travel enabled, N3 route overlay. This does NOT prove live token/actor ownership across party members or all item gates. In particular E3 requires two `actorHasItem` keys and that inventory ownership needs gameplay canary.

## The two blocked progression stages

**M1 grandfather clock:** M1 PREPARE `scenes/M1-entrance-hall-great-room/prepare/PREPARE-v001.md` prescribes Silver Family Emblem first, then a setting decoded using genealogy/family/grave chronology, then revealing Family Reliquary Key and Brass Baggage Token. The source catalogue `F-2026-10-08-CENTRAL-LODGE-U1-INTERPRETATION-SCOPE` explicitly says no recovered source supplies the exact clock-hand literal; it was deferred under CL-13. Live Region `3tIrR12uv8ppFkOb` has zero behaviors; `puzzles.m1.clockSettingResolved=false`. Do **not** fabricate a clock time, unapproved GM bypass, or automatic unlock. Need author approval of the literal solution or explicitly chosen GM-adjudication mode, plus guarded implementation.

**N3 to T3:** Canonical planning fact `F-2026-10-07-N3-SAFE-SCOPE` explicitly defers `puzzles.n3.t3BranchUnlocked` because it did not decide whether Departure Board, Switch Wheel and Cartography Overlay combine and in which way. Live N3 Branch Railway Region `RP1jYOH738xl9hks` is empty and the flag remains false. T3-to-N3 and T3-to-F1 exits were installed earlier, but they do not authorize the N3-to-T3 unlock. Do **not** invent gate logic or modify this flag.

## Safe next steps

1. Obtain an authored answer for M1's numeric hand position, or explicit approval of player-demonstrated/GM-adjudicated setting; then build one GM-authoritative, no-softlock clock setting action with PREVIEW → guarded APPLY → independent FINAL VERIFY and controlled canary.
2. Obtain exact N3-to-T3 prerequisite policy that resolves Departure Board, switch and route overlay dependencies. Only then bind a route with known origin/destination Region and reversible canary.
3. Decide whether M2 Founder Portrait should set a distinct `Opened` state in a governed ledger schema revision, or only the `Observed` state; likewise clarify U2 evidence observed versus interpreted. Do not silently collapse states.
4. Continue CL-50 tunnel geometry pair reconciliation, CL-51 story event for night, CL-52 horror pacing, CL-90 final audit and CL-92 live tests. No Foundry document writes made during this source-only audit.

**Foreman / bridge:** User is handling Foreman mode recovery separately. This work window did not change bridge settings or send a relay. A future verified active Foreman session may resume native handoff.
