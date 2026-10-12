# Central Lodge Region/Puzzle Installation Handoff — 2026-10-06

**Project:** Dicebox Campaign Helper  
**Campaign:** Central Lodge  
**Runtime:** Foundry VTT 14.367 / D&D5e 5.3.3 / world `the-lost-mine-of-phandalin`  
**Current phase:** CL-10C — E2 live runtime canary  
**Next installer after canary PASS:** CL-11 — U2 Servants’ Quarters, Nursery & Attic  
**Governing plan:** `work/lodge-campaign/REGION-PUZZLE-INSTALL-PLAN-v001.md`

## Current authoritative baseline

The puzzle/Region installation foundation is complete.

- 21 canonical Central Lodge Scenes.
- 201 Regions.
- 201/201 Regions have unique stable IDs.
- 21 RegionBehaviors total: 16 pre-existing verified T1/T2/T3/F1/F2 behaviors plus 5 new E2 behaviors.
- 33/33 canonical progression Items installed and independently verified.
- Central Lodge runtime ledger exists at `JournalEntry.xhlXv6CCH34HVga3`.
- Ledger stable ID: `dbx:central-lodge:state`.
- Ledger schema: 1.0.0.
- Ledger revision at handoff: 0.
- Runtime kernel exists at `Macro.FHQiFYx6OntZVo9d`.
- Kernel stable ID: `dbx:central-lodge:macro:runtime`.
- Kernel source hash: `1e45da0c5fdaec7ec8e229593b7408e3060a21ef45381ccd0f973227851e8205`.
- Region manifest hash: `368c22e61d6bd6b6af1ef3cb8982b23cbd4119d0d924af06b4b8ac6183f7e39a`.

## Completed installation gates

### Required Item Registry

PASS.

- 33 canonical world Items.
- Folder: `Central Lodge — Required Items`.
- Folder ID: `x8NZ4m1bBBWsAK82`.
- Item identity is by `flags.world.dicebox.stableId`, never visible name or mutable document ID.
- The unrelated pre-existing world Item named `Glass Eye` remains untouched.

Receipts:
- `work/lodge-campaign/required-items/IMPLEMENT-v003-PASS.json`
- `work/lodge-campaign/required-items/VERIFY-v001-PASS.json`

### CL-00 Preflight Snapshot

PASS.

Baseline locked at 21 Scenes / 201 Regions / 16 existing RegionBehaviors / 33 canonical Items.

Receipt:
- `work/lodge-campaign/region-install/CL-00-PREFLIGHT-SNAPSHOT-v001-PASS.json`

### CL-02 State Ledger

IMPLEMENT PASS + independent VERIFY PASS.

Receipts:
- `work/lodge-campaign/region-install/CL-02-STATE-LEDGER-IMPLEMENT-v001-PASS.json`
- `work/lodge-campaign/region-install/CL-02-STATE-LEDGER-VERIFY-v001-PASS.json`

### CL-03 Runtime Kernel

IMPLEMENT PASS + independent VERIFY PASS.

Kernel actions:
- `selfTest`
- `notice`
- `observe`
- `pickup`
- `socket`
- `gate`
- `transition`
- `readState`

Receipts:
- `work/lodge-campaign/region-install/CL-03-RUNTIME-KERNEL-IMPLEMENT-v001-PASS.json`
- `work/lodge-campaign/region-install/CL-03-RUNTIME-KERNEL-VERIFY-v001-PASS.json`

### CL-04 Region Metadata Normalizer

IMPLEMENT PASS + independent VERIFY PASS.

- 169 older Regions normalized.
- 32 already-managed T1/T2/T3/F1/F2 Regions protected from writes.
- 201/201 stable Region IDs.
- Geometry and existing behavior hashes preserved.

Receipts:
- `work/lodge-campaign/region-install/CL-04-REGION-METADATA-IMPLEMENT-v001-PASS.json`
- `work/lodge-campaign/region-install/CL-04-REGION-METADATA-VERIFY-v001-PASS.json`

### CL-10 E2 Rear Service Yard

IMPLEMENT PASS + independent FINAL VERIFY PASS.

E2 Scene:
- ID: `sI4YVZZChgey1qNi`
- Regions: 9
- RegionBehaviors: 5

Installed behaviors:
1. Well Carving Notice
   - behavior ID `SM65sWIwzApSmuVU`
   - stable ID `dbx:central-lodge:e2:behavior:well-carving-notice`
   - action `notice`
   - DC 6
   - Stage 2 suggestion: Investigation
   - exactly one flat 1d20 per character until reset
   - failure silent
   - no automatic Item award
2. Well Carving Pattern Recovery
   - behavior ID `sJr01Q1alQcHYuta`
   - stable ID `dbx:central-lodge:e2:behavior:well-carving-pattern`
   - action `pickup`
3. Iron Hand Crank Recovery
   - behavior ID `6w34Q0FKIzeJeEqj`
   - stable ID `dbx:central-lodge:e2:behavior:iron-hand-crank-recovery`
   - action `pickup`
4. Servant Bell Pull Recovery
   - behavior ID `XiqToYOeXs84ABIs`
   - stable ID `dbx:central-lodge:e2:behavior:servant-bell-pull-recovery`
   - action `pickup`
5. Recent Use Observation
   - behavior ID `n5vjSnkcmCzvZvD5`
   - stable ID `dbx:central-lodge:e2:behavior:recent-use-observation`
   - action `observe`

E2 transition Regions have metadata only and remain unbound. E2 light Regions remain passive.

Receipts:
- `work/lodge-campaign/region-install/CL-10-E2-IMPLEMENT-v001-PASS.json`
- `work/lodge-campaign/region-install/CL-10-E2-VERIFY-v001-PASS.json`

## Current gate: CL-10C E2 runtime canary

**No deliberate runtime canary has been performed yet.**

This is the next action. Do not begin CL-11 until the shared runtime has been exercised safely through live E2 Region events.

Use one designated disposable/test Actor and token. Before triggering anything:

1. record the ledger revision and the selected Actor's inventory;
2. author the canary cleanup/reset path first;
3. keep transition Regions and light Regions out of the test;
4. do not use a real player progression state unless the user explicitly chooses to.

The canary should prove one representative instance of each newly connected runtime behavior family:

- **Notice:** live Region event reaches the kernel; exactly one flat 1d20 attempt is recorded for that Actor; re-entry does not reroll; failure is silent; success does not award an Item.
- **Pickup:** one E2 pickup clones the correct canonical Item to the Actor; ledger recovery state updates; duplicate recovery is blocked.
- **Observation:** Recent Use writes its state once and does not repeatedly spam.
- **Preservation:** no Region geometry, visibility, lock state, transition metadata, light behavior, kernel source, or unrelated ledger state changes.

Because the canary is state-changing, its completion receipt must explicitly state the resulting ledger revision and whether test state was reset or intentionally retained.

## Next installer after canary PASS: CL-11 U2

CL-11 targets U2 Servants’ Quarters, Nursery & Attic.

Planned behaviors:
- Servant Room Absence Notice;
- Nursery Contradiction Notice;
- Servant History observation;
- Glass Eye recovery;
- Brass Gnomon recovery;
- Piano Roll recovery;
- story/horror metadata for nursery and attic.

Lighting remains passive until the global lighting phase.

Before authoring CL-11, query the project database and re-read:
- this handoff;
- `REGION-PUZZLE-INSTALL-PLAN-v001.md`;
- the CL-10 runtime canary receipt once it exists;
- the current U2 Region manifest.

Do not assume U2 Notice DCs, Stage 2 skills, or exact Region behavior ownership if the plan does not explicitly define them. Unknown means unknown; resolve those authoring choices deliberately.

## Remaining sequence after CL-11

Phase 1:
- CL-12 M2
- CL-13 M1
- CL-14 B1
- CL-15 E3
- CL-16 M3
- CL-17 U1

Phase 2:
- CL-20 E4
- CL-21 E1 backtrack
- CL-22 B2
- CL-23 C1
- CL-24 C2

Phase 3:
- CL-30 N1
- CL-31 N2
- CL-32 N3
- CL-33 existing T1/T2/T3 reconciliation

Phase 4:
- CL-40 F1 compatibility
- CL-41 F2 compatibility

Phase 5:
- CL-50 known transition binder
- CL-51 day/night and lighting binder
- CL-52 horror/story pacing pass

Campaign closure:
- CL-90 full behavior audit v002
- CL-91 dependency simulation
- CL-92 final live canary suite

## Locked rules

- Never recreate Region geometry.
- Preserve the verified T1/T2/T3/F1/F2 behaviors unless a narrow diagnostic proves a defect.
- Use stable IDs for runtime identity.
- Cross-Scene progression lives in the ledger.
- True Notice Regions use exactly 1d20 with no Perception/Wisdom/proficiency/expertise modifier.
- Notice never automatically awards an Item.
- Failed Notice must not permanently remove a progression-critical clue.
- Do not guess transition destinations.
- T1/T2 mouth A/B orientation remains unresolved.
- The global day-to-night trigger remains unresolved.
- Unknown write outcome means stop and inspect; never blind-retry.

## Historical handoff reconciliation

This handoff supersedes `work/lodge-campaign/HANDOFF-2026-10-06-REMAINING-MAPS.md` for the **current execution point**. The older handoff remains valid historical evidence for the map-production sequence, but its N3/T1/T2/T3/F1/F2 pending state is obsolete. Those maps now exist and the active work is Region/puzzle behavior installation.


## Project database catalogue sync

The project knowledge database was rebuilt and verified after the CL-10 FINAL VERIFY.

Database catalogue version:
- `2026-10-06.comprehensive-v1`

Deterministic rebuild now applies `database/seed.sql` followed by all lexical `database/seed.d/*.sql` deltas.

Verified database totals after the catalogue sync:
- integrity: `ok`
- sources: 335
- facts: 1110
- decisions: 444
- open items: 530
- trials: 198
- research subjects: 40
- milestones: 19
- tools: 7
- supplemental seed deltas applied: 4

Central Lodge catalogue coverage:
- 53 repository source artifacts catalogued with path, Git blob SHA, and file size metadata;
- 21 exact Scene identity/count facts;
- 33 exact canonical Item identity/source/use facts;
- 5 exact E2 RegionBehavior identity/action/source-hash facts;
- 31 macro/install phase status facts from CL-00 through CL-92;
- current runtime ledger, runtime kernel, Item registry, Region manifest, unresolved bindings, milestones, and current continuation gate.

The canonical Region manifest is represented by the verified 201-Region manifest identity and SHA-256 `368c22e61d6bd6b6af1ef3cb8982b23cbd4119d0d924af06b4b8ac6183f7e39a`. Live Foundry Region documents remain authoritative for row-level geometry and runtime state.

Rebuild/verify receipts:
- catalog seed: `database/seed.d/2026-10-06-zz-central-lodge-project-catalog.sql`
- database build: `database/build_database.py`
- database verify: `database/verify_database.py`
- project sync receipt: `work/lodge-campaign/region-install/PROJECT-DATABASE-SYNC-2026-10-06-PASS.json`

The current continuation is unchanged: **CL-10C E2 runtime canary**, then **CL-11 U2** after canary PASS.


## 2026-10-08 superseding continuation note

This note is later than the original 2026-10-06 handoff and supersedes its stale CL-10C/current-count fields while preserving the earlier history.

- Current certified pre-CL-15-APPLY baseline: **21 Scenes / 202 Regions / 43 RegionBehaviors / 33 canonical Items**.
- Runtime kernel `Macro.FHQiFYx6OntZVo9d` SHA-256 is `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`; message arbitration v1.0.0 is certified.
- CL-11 U2 and CL-12 M2 are complete. CL-13 M1 remains safe-partial with exact clock-setting literal deferred. CL-14 B1 remains partial only for water/flood/underworks state semantics, while **B1 recovery → E3 installation** for the Water Control Wheel is certified.
- B1 now contains the intentional manual Region `Scene.0CSBwzcszPKyaB8u.Region.xIFjdjHmF2qn5Nij`, stable ID `dbx:central-lodge:b1:region:b1-water-control-wheel`; B1 is 11 Regions / 4 behaviors.
- CL-15 E3 Behavior PREVIEW v002 passed under the isolated Playwright developer harness. E3 is 12 Regions / 0 behaviors before APPLY; certified stable-sorted geometry hash is `d409885c23e5777808c5bb0964ccb3b855b2957a5e750f2b18d2a593d4c13a5d`.
- Current gate: **CL-15 E3 Behavior APPLY**, then independent FINAL VERIFY, then CL-16 M3.
- Project authorization revision: the dedicated **Assistant Gamemaster** developer/automation session is an explicitly authorized DiceBox project executor in addition to the normal Gamemaster. The older project-local primary-active-GM-only convention is superseded for this designated session; exact target/version/hash/PREVIEW/rollback/reread gates remain mandatory.
- The Playwright/CDP harness lives at `work/foundry-playwright-harness` and is developer-only. It may execute bounded reviewed page scripts for governed project work; it must not become a public arbitrary-evaluation or generic execute-as-GM surface.
- If a blocker materially stalls or repeats, inspect local evidence and then research alternate methods in current official documentation and relevant technical community sources before another promoted attempt.
- Route separable Worker tasks to the currently recommended model for the task class when routing is available; the Foreman remains the sole integration authority.


**PAUSE CHECKPOINT (2026-10-08):** Resume from `handoffs/CENTRAL-LODGE-PAUSE-CHECKPOINT-2026-10-08.md` (machine-readable mirror: `.json`). It records CL-15 FINAL VERIFY PASS, baseline 21/202/51/33, and exact CL-16 M3 read-only resume instructions.
