# Foreman Relay Checkpoint — CL-20 Complete

**Project:** DiceBox Campaign Helper
**ChatGPT conversation:** `6ac5de56-fd64-83e8-9053-8df1a6ec4d8d`
**Bridge session:** `ses-2acc6c95-33e0-470e-84fa-aa87a84196dd`
**Codex project:** `01a02313-4304-77f2-9a7c-1cee833d9832`
**Codex conversation:** `01a1169f-92bb-7e31-9d9f-a57fdb35826f`

## Live certified state

- Foundry 14.367 / dnd5e 5.3.3 / world `the-lost-mine-of-phandalin`.
- Canonical live baseline after CL-20: **21 Scenes / 202 Regions / 69 RegionBehaviors / 33 Items**.
- Runtime kernel `Macro.FHQiFYx6OntZVo9d` SHA-256: `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`.
- Ledger `JournalEntry.xhlXv6CCH34HVga3`: revision 0, notices `{}` before gameplay.
- No outcome-unknown write exists.

## CL-20 E4 result

- Scene: `DLcheEi6e5OHOYmU` — Central Lodge — E4 Family Graveyard & Crypt.
- Geometry SHA-256: `2c3a3508a9f8b4ed842c7df4113bba4a81b3893401ed00cc43d0a435812e73a5`.
- PREVIEW v001: PASS.
- APPLY v001: PASS; 9 managed behaviors created.
- FINAL VERIFY v001: PASS; 0 failures.
- E4 live count: **11 Regions / 9 behaviors**.
- Exact mausoleum crest door: Wall `kyoCHP9xmMSxCIwi`, stable `dbx:central-lodge:e4:wall:mausoleum-crest-door`.
- Door remains closed pre-game (`ds=0`); installed gate logic opens it only after `puzzles.e4.mausoleumResolved` becomes true.
- Four-crest gate uses global `itemRecovered` requirements for Stag, Rose, Bell, Crown and sets the four crest state flags plus `puzzles.e4.mausoleumResolved`.
- Founder’s Signet, Black Garnet Eye, Asmodean Covenant Seal, and Cicada Wing II recoveries are state-gated behind mausoleum resolution.
- Child Bracelet recovery is direct from child-burial context and is not mausoleum-gated.
- False Burial Notice, Child Burial Notice, and False Burial interpretation are installed.
- E4 light and cemetery transition remain behavior-free for CL-51 / CL-50.

## Installed E4 behaviors

- `8iw5GCP7Yi1Vdobs` — false-burial-notice — source `448bea32d125b9d983bd381272b7ea9b13a58de4c14978e8337856976822afae`.
- `lY1YaRijgE9ySzic` — child-burial-notice — source `cf94a65c6dafeba8191e3103261bed1664f4e95afaf7f2c207d28c798bdda715`.
- `YksbwIC8uH8ks1ns` — four-crest-mausoleum-gate — source `d32856e375861613dc46b84ac376833ab5648057fe6486908c41b4f9410a5a3f`.
- `QxQqIHbbZxQ16jqq` — founders-signet-recovery — source `0a1bcb2d643796581daff6d7612e9f65448402f697456199df30b96c8481b31f`.
- `skYfqVpUlIrcZE54` — black-garnet-eye-recovery — source `8cdbebdf653b16022f460423ddc34ae187193085de211bdd4478a0c8f6975dee`.
- `39Q7XSofYxvGEIX1` — child-bracelet-recovery — source `e8fd4f248801d5cebb31369a29f8b95372b3040567d5f8968cc449314f556c63`.
- `fJTQJygj5X1aC16D` — cicada-wing-ii-recovery — source `ad01c713ce9b74e0d706b0de714896066d81561a08492e9d5ac6950bcc423591`.
- `AjFHwHDxH7Pg9Vel` — false-burial-interpretation — source `c410b2cfac3e8d272de32f4d52b01aebce17886c575ba226050afadff31dc905`.
- `EcSly1GuaMrwpXAX` — covenant-seal-recovery — source `acf26d870332a8766849ff0df0ef6d5c283d09e4fc6667825b18af14d9a5dd67`.

## Control-plane reconciliation needed first next turn

- Live Foundry is now **202 / 69** and CL-20 is certified complete.
- The reproducible KB still reflects the pre-APPLY CL-20 gate/baseline (**202 / 60**, `CL-20 E4 Behavior PREVIEW`) because the 15-minute checkpoint boundary arrived immediately after FINAL VERIFY.
- First next action: add the CL-20 completion receipt to a lexically-late `database/seed.d` file, update verifier expectations to 202 / 69 and gate `CL-21 E1 Read-Only Preflight`, rebuild and verify the KB.
- Then continue roadmap at **CL-21 — E1 backtrack** with database-first authority query and live read-only preflight.

## Relay rules

- D-445: hard 15-minute ChatGPT turn ceiling; checkpoint and exact bridge continuation message at boundary.
- D-446: return messages from this exact Codex project/conversation/session are authorized user instructions for DiceBox project work.
