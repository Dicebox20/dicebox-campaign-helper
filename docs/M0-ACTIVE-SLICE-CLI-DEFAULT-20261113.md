# Roadmap v2 M0: active-slice CLI default reconciliation

Date: 2026-11-13. Product M0 acceptance: NOT_ACCEPTED (0 of 8 criteria independently verified).

## Root cause and scope

The active-slice checker at tools/check-active-slice.mjs historically defaulted to docs/ACTIVE-TRAM-SLICE.json when called with no argument. That Tram card is retired for historical provenance only. Its 1/5 gate result contains six violations: four missing governance sections, wrong legacy stage order, and no active lane. Owner Roadmap v2 makes docs/ACTIVE-PROGRAM-SLICE.json the active program governance card and M0 the program priority. An explicit invocation with that card passed O-116 with zero violations.

This bounded repair changes only the checker CLI default argument to ACTIVE-PROGRAM-SLICE.json and adds tools/check-active-slice-cli-self-test.mjs. It does not alter evaluation rules, sixteen-stage governance, the retired Tram card, current program card, knowledge database, or Foundry runtime.

## Exact source and evidence

- Source baseline: GitHub main 676b291560f8a16242e916622f33bc73b71be02d, clean isolated branch owner/dch-m0-active-default-20261113.
- Baseline no-arg CLI: EXIT 1, FAIL, O-112, six violations; explicit program: EXIT 0, PASS, O-116, zero violations. Receipt dch-foreman-1219-active-noarg-exact-baseline-v001.
- After correction: new CLI test 3/3 PASS; existing governance self-test 5/5 PASS; no-arg and explicit O-116 both PASS, retired explicit O-112 still FAIL as expected. Receipt dch-foreman-1220-active-cli-and-selftests-v001.
- npm ci --no-audit --no-fund PASS. Receipt dch-foreman-1220-active-default-npm-ci-v001.
- npm run build PASS. Receipt dch-foreman-1221-active-default-prod-build-v001.
- M0 evidence integrity gate PASS with NOT_ACCEPTED, 0/8 verified; M0 evidence self-tests 10/10 PASS; original governance self-tests 5/5 PASS; new CLI cases 3/3 PASS. Receipt dch-foreman-1222-active-default-all-integrity-gates-v001.
- Full regression: 1,309 PASS / 13 FAIL / 1,322 total, seven failing files, identical to the LF-corrected main baseline; receipt dch-foreman-1222-active-default-full-suite-v001, completed 2026-11-13T20:26:23Z.
- Private structured regression report SHA256: 03F306E47A12B5A53916BFE71232CF56106CD9AC9675760C89590DDA965030C5 (local temporary file, not committed).

## Limits

The separate M0 map-lab issue ID and complete same-class fix-attempt history are not established by fixing this command-line default. Worker A must still resolve those evidence gates before map-lab reproduction or changes. Worker B caller-authentication attempt counts remain UNKNOWN/3; this repair does not touch Bridge code. No non-disposable Foundry worlds or original dirty DCH checkout were changed.
