# Region hidden=true blanket-rule retirement — 2026-10-15

## Authority and scope
- Explicit user correction: the formerly accepted assertion that hidden=true disables functional RegionBehaviors has been fixed in a recent update; retire the blanket prohibition.
- Canonical source baseline: GitHub main 1137241a7df431a5cc4bc775ab56dcd283e1db29.
- Isolated work branch: reconcile/2026-10-15-hidden-region-rule.
- Scope: accepted compatibility policy, roadmap/card, knowledge-base delta, API binding guidance. No live Foundry or campaign-world action.

## Chronology and conflicts
- Historical local snapshot used F-855 and D-393 for the legacy hidden-Region rule.
- Canonical main uses those same IDs for unrelated records; neither was overwritten or retired by identifier.
- Main contained no operative general hidden=true prohibition in active knowledge-base policy. This revision records the explicit supersession and prevents old snapshot authority regression.

## Change
- Add database/seed.d/2026-10-15-region-hidden-blanket-rule-retirement.sql with accepted user-sourced decision and fact.
- Update Foundry API binding guidance to permit hidden Regions as design candidates subject to exact-stack verification.
- Record accepted update in roadmap and current active card without changing product stage.

## Validation
- python database/build_database.py: PASS (integrity ok; sources 2168, facts 1959, decisions 1702; 18 seed.d deltas).
- python database/verify_database.py: PASS (integrity ok; Central Lodge 21 Scenes / 201 Regions / 21 behaviors / 33 Items).
- git diff --check: PASS.
- node tools/check-active-slice.mjs: BLOCKED by six preexisting baseline violations on unchanged active-stage controls (four missing required synchronization fields, 16-stage order mismatch, active lane assignment). Current result has the same violations observed before this patch; no stage was advanced.
- Exact Foundry hidden=true live behavior: NOT TESTED; user report is policy authority, not independent live certification.

## Decision and follow-up
- Obsolete blanket ban is retired as guidance and no longer enforced for the heist Lights Out Region design.
- Integration into canonical main remains gated by existing active-slice checker violations. Keep reviewable branch/commit and resolve that baseline gate in a separately authorized bounded slice.
- Do not modify existing live Foundry regions, hidden states, or behavior scripts solely on this policy update.
