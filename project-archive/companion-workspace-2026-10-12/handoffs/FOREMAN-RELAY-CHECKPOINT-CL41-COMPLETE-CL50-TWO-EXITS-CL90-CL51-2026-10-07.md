# Foreman checkpoint — CL-41 F2 compatible / CL-50 two T3 exits / CL-90 preaudit / CL-51 light survey

**Work window:** 2026-10-07 18:23:40 PDT onward. **Foundry:** 14.367 / dnd5e 5.3.3 / world `the-lost-mine-of-phandalin`.
**Last independent live baseline:** **21 Scenes / 202 Regions / 115 RegionBehaviors / 33 canonical Items**; ledger `xhlXv6CCH34HVga3` revision 0, notices empty; kernel `FHQiFYx6OntZVo9d` SHA `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`.
**No gameplay canary** and no outcome-unknown Foundry write.

## Completed in this turn

- Re-read latest CL-33/CL-40 checkpoint and CL-41 F2 storyline. F2 compatibility phase closed as *existing four behavior preservation* (8 Regions/4 enabled observations; F1 arrival known). F2 ritual escalation, Fiend Machine actors and final encounter not fabricated.
- CL-50 global read-only transition inventory at 202/113 found many bare transition anchors; one known F1→F2 script, T1/T2 mouth orientations unresolved. New F1 `t3-arrival` Region and T3 ancient mouth cross-validated with live exact scene flags.
- CL-50 T3→F1: read-only exact authority check and PREVIEW PASS; 8/8 offline mocked contract tests; guarded APPLY PASS created behavior `tSqhDN5CtAHzccmf`, source hash `c179ae83855e6eb136a1225bfbb882ab9c6b7bcd3f0773df3654f82b2b23d6cb`; independent FINAL VERIFY PASS at 202/114. Source `Tkg7XpsF7X1P3ZVJ`, destination F1 arrival `zKNU1R3JGIMMt017`. GM confirmation.
- CL-50 T3→N3 safe return: live explicit authority check, PREVIEW PASS; 8/8 offline mocked tests; guarded APPLY PASS created behavior `pZpcYXFn517t6L5U`, source SHA `051c669835aaed94f0497ebe6e54590d37df97eceb271b611b0263ca95b8f963`; independent FINAL VERIFY PASS at 202/115. Source `YElrtisbXN3DJ2Sw`, destination N3 Branch Railway `RP1jYOH738xl9hks`. GM confirmation; no N3→T3 unlock or changed `t3BranchUnlocked=false`.
- CL-90 preparatory whole-campaign read-only inspection PASS_WITH_DEFERRED_QA: 115 nonempty enabled sources; 115 unique stable IDs (separate stable-ID coverage test), 33 canonical Items, 86 AmbientLights, 8 placed Tokens; known three route scripts present. **Not** the final CL-90 audit or gameplay canary.
- CL-51 read-only light inventory: all 86 installed AmbientLights hidden, 0 visible; F1 and F2 ritual-state lights explicitly grouped; simple metadata heuristic established only 14 managed/campaign lights, rest unclassified. No global night trigger in inspected state. Left all lights and ledger untouched.
- KB rebuilt + verified integrity PASS: **377 sources / 1,155 facts / 460 decisions / 535 open items / 199 trials**, metadata 21/202/115/33, current gate `CL-50 Remaining Authoritative Route Reconciliation`.
- Detailed plan at `docs/CL50-ROUTE-AUTHORITY-2026-10-07.md`.

## Blockers and next safe action

- T1/T2 mouth A/B orientations unresolved; cannot assign N1/N2 or N2/N3 endpoints without approved topology.
- N3→T3 branch unlock state and return behaviors unverified; branch remains false.
- F1→T3 reverse travel may need a GM-confirmed voluntary interaction that avoids bouncing into the newly installed T3→F1 entrance; not implemented.
- CL-51 requires user/GM choice of global night trigger and exact per-light ownership; do not toggle the 86 hidden lights.
- CL-52 horror pacing, CL-90 final audit, CL-91 dependency simulations, CL-92 controlled player/GM canaries still pending.

Continue with exact-authority route matrix; preview/install only safe bounded edges with rollback and independent FINAL VERIFY. Do not rerun CL-33/CL-40 or the two CL-50 installers. Confirm active native bridge session before a relay; fail closed if unavailable.

**User-requested finish signal:** play `C:\Windows\Media\Windows Shutdown.wav` once via PowerShell *at end of turn*. Do not shut down Windows.

## Native live bridge result
Bridge session ses-c076a0d2-5a98-4156-a86c-40a344b423e3 active; native bridge_communicate correlation foreman-cl50-t3-exits-20261007-1838 returned host_accepted, delivered=false, timedOut=true. Native injection was accepted by host, but delivery to Codex was not confirmed. No inbox transport substituted.
