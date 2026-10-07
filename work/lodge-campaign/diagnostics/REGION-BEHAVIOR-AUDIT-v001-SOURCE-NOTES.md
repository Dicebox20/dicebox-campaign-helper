# Central Lodge Region Behavior Audit v001 — source notes

Status: prepared, read-only diagnostic
Campaign: central-lodge
Diagnostic ID: dicebox-central-lodge-region-behavior-audit-v001

## Sources reviewed

- work/lodge-campaign/PUZZLE-REGION-PLAN.md
- work/lodge-campaign/AUTOMATION-RULES.md
- work/lodge-campaign/AUTOMATION-STATE.json
- work/lodge-campaign/HANDOFF-2026-10-06-REMAINING-MAPS.md
- docs/campaigns/CENTRAL-LODGE-STATE-2026-10-06.md
- docs/DICEBOX-EXPLORATION-DISCOVERY-STANDARD-2026-10-05.md
- docs/DICEBOX-AUTOMATED-SCENE-WORKFLOW-2026-10-05.md
- E2 PREPARE v001/v002 and BUILD receipt
- T1 behavior-repair receipts
- T2 BUILD/VERIFY receipts
- T3 BUILD/VERIFY receipts
- F1 BUILD/VERIFY receipts
- F2 PREPARE/BUILD/VERIFY receipts
- F1 -> F2 final transition verification receipt

## Audit design

The diagnostic is read-only and audits all 21 canonical Lodge Scenes and the 201-Region live baseline observed in the latest Lodge-wide Region inventory.

It distinguishes:
- FAIL: provable runtime/plan contradiction, such as disabled behavior, hidden Region with executable behavior, invalid flag scope, missing referenced UUID, missing required exact late-game behavior, malformed notice roll, or structural count drift.
- REVIEW: plan intent exists but the repository does not preserve enough exact implementation contract to prove the live Region is correct.
- DEFERRED: intentionally unresolved campaign bindings, chiefly the global day/night event and unresolved T1/T2 mouth orientation.
- PASS: static evidence proves the checked contract.

The audit does not trigger RegionBehaviors, roll dice, teleport tokens, change flags, enable lights, or mutate any Foundry document.

Notice checks follow dicebox-discovery/v1: automatic Stage 1 must be exactly 1d20 with no Perception/ability/proficiency modifier, once per character until reset, with no automatic item award.

Known exact executable behavior contracts are enforced for T1, T2, T3, F1, and F2 from their current receipts. E2 is checked against its Region Ownership Table and its BUILD note that notice/puzzle/story behaviors still required binding.

Older Lodge maps are checked against the active Puzzle/Region plan by semantic coverage and live behavior health. Where the plan names a purpose but does not preserve an exact script contract, the diagnostic reports REVIEW rather than inventing an expected implementation.
