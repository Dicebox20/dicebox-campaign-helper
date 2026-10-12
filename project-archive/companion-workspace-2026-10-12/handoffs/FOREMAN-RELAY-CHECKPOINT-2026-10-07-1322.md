# Foreman Relay Checkpoint — 2026-10-07 13:22 PT

**Project:** DiceBox Campaign Helper
**ChatGPT conversation:** `6ac5de56-fd64-83e8-9053-8df1a6ec4d8d`
**Bridge session:** `ses-2acc6c95-33e0-470e-84fa-aa87a84196dd`
**Codex target project:** `01a02313-4304-77f2-9a7c-1cee833d9832`
**Codex target conversation:** `01a1169f-92bb-7e31-9d9f-a57fdb35826f`

## Relay protocol activated

- Foreman Mode remains active.
- ChatGPT relay turns now have a hard 15-minute wall-clock ceiling.
- Before crossing the ceiling: resolve/stop writes, save checkpoint, then send the exact user-mandated bridge continuation message.
- After that bridge message, ChatGPT stops implementation for the turn.
- Rule is persisted in `AGENTS.md` under `Foreman relay checkpoint protocol`.
- KB decision `D-445` and source `SRC-2026-10-07-FOREMAN-RELAY-CHECKPOINT` were added.
- Database rebuild and verification passed after the rule update.

## Current project state

- Foundry: 14.367
- D&D5e: 5.3.3
- World: `the-lost-mine-of-phandalin`
- Live canonical baseline: **21 Scenes / 202 Regions / 60 RegionBehaviors / 33 Items**
- Current KB gate: **CL-20 E4 Read-Only Preflight**
- CL-17 U1 FINAL VERIFY: PASS
- No E4 gameplay behavior or door-state mutation has occurred.

## E4 preflight evidence already recovered

- E4 Scene: `DLcheEi6e5OHOYmU`
- E4 live count: 11 Regions / 0 behaviors
- E4 geometry hash: `2c3a3508a9f8b4ed842c7df4113bba4a81b3893401ed00cc43d0a435812e73a5`
- Kernel hash: `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`
- Ledger revision 0 / notices `{}`
- Four-crest mausoleum authority recovered from PREPARE:
  - Stag Crest from M2
  - Rose Crest from E3
  - Bell Crest from M3
  - Crown Crest from U1
- Exact live crest door identified:
  - Wall ID `kyoCHP9xmMSxCIwi`
  - Stable ID `dbx:central-lodge:e4:wall:mausoleum-crest-door`
  - Foundry door state currently closed (`door=1`, `ds=0`)
- E4 BUILD receipt explicitly says the four-crest mausoleum entrance is the stateful crypt-access door.
- Deep-crypt rewards recovered in E4 authority:
  - Founder's Signet
  - Black Garnet Eye
  - Child Bracelet
  - Asmodean Covenant Seal
  - Cicada Wing II
- Two hidden Notices: false-burial contradiction and child-burial detail.
- False Burial Evidence story Region is present.
- Lighting and cemetery transition remain deferred under the global lighting/transition phases.

## Exact resume point

Resume CL-20 E4 from read-only/prewrite reconciliation:
1. Decide the bounded implementation pattern for the four-crest gate against the exact mausoleum door Wall.
2. Ensure deep-crypt rewards that should be inaccessible before the mausoleum solve are state-gated behind `puzzles.e4.mausoleumResolved` or equivalent recovered state.
3. Preserve the two Notice discoveries and false-burial story interpretation without adding extra Notice rolls.
4. Build CL-20 E4 PREVIEW with exact source hashes and wall/geometry/kernel/ledger preservation checks.
5. Only after PREVIEW PASS, APPLY through the authorized Assistant Gamemaster Playwright harness and run independent FINAL VERIFY.

## Safety

- No outcome-unknown write is pending.
- No E4 mutation has been made.
- Normal Gamemaster and Assistant Gamemaster sessions remain separate.
- Wide Bridge live session was verified active before checkpoint.