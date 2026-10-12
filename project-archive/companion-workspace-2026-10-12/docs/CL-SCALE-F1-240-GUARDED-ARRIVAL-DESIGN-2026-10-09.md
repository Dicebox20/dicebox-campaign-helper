# F1: 240 px / 5 ft guarded arrival proposal (not installed)

**Status:** STAGED SOURCE PROPOSAL, OFFLINE CONTRACT PASS, NO LIVE INSTALL. 
**Foreman checkpoint:** `clscale-reference-token-three-room-kb-reconciled-v001`; continuation of October 9, 2026.
**Read-only source capture:** `outputs/foreman-checkpoints/clscale-f1-arrival-source-readonly-v001.json`.

## Original audited bindings
- T3 Scene `aIKQmFiuXWipEdyb`, GM-confirmed arrival Region `Tkg7XpsF7X1P3ZVJ`, behavior `tSqhDN5CtAHzccmf`. Frozen full Scene SHA `76141690439a19d6092a2119744def0dce57c9368cd4ceaf66ccd23c1fa8eabb`; original handler SHA `c179ae83855e6eb136a1225bfbb882ab9c6b7bcd3f0773df3654f82b2b23d6cb`. Existing handler explicitly confirms with GM, then teleports using `placement:"random", snap:false`, with no token footprint or exact Wall/occupancy guard.
- F1 Scene `La9krMOMBhAhDLi6` current grid120, frozen full SHA `85ec24e6da7e5b849099fbe5b7a568693ccc71fc55842f7fefb4e584a045c235`; incoming Region `zKNU1R3JGIMMt017` is currently rectangle `(2111,2357,840,520)`, no RegionBehaviors. Existing 320px grid proposal rejected because a y2640 solid Wall intersects all possible 320-square footprints entirely within that rectangle.
- F2 Scene `HWitOe1wSid7MZ1y` already independently calibrated grid240, full SHA `5ad191d492195bf227bb099d9b356992aca44fe6d884ac940e085db8c2342639`; original F1→F2 transition remains at F1 Region `iuoEHBXWtXgzYmMh` and uses random unsnapped arrival. Its separate user/playtest safety has not been accepted.
- Sovereign puzzle ledger remains revision13 SHA `ec3f1a02887b80a342653681d217d357f7bb7f5b44fa436555d57bf12c44cfd4`. Ret remains in M1 grid320. Mr. MeowMeow remains on F1 at pixel x2524,y2151 with a 1x1 document footprint.
- F1 and F2 native background images are 1800×1200 stretched to 4320×2880 scenes. Offline preview must scale source art accordingly, not draw Scene coordinates directly into native image pixels.

## Proposed guarded 1×1 landing
- Scale F1 grid only from 120 to **240px/5ft** after a separate migration safety gate.
- Move only the F1 inbound Region rectangle to **x2390, y1860, width280, height280** so that Foundry v14 `placement:"center", snap:false` produces a standard 1×1 token top-left **(2410,1880)**. A real v14 ephemeral Scene model independently produced precisely that placement while all original live Scene/Actor/ledger hashes remained unchanged.
- Footprint `x2410..2650, y1880..2120`: clear of 27 current F1 movement Wall segments, player-measuring token x2524..2764/y2151..2391, and F1 story Region (ends y1843). No existing F1 puzzle behavior is attached to the proposed inbound Region. Artwork floor inspection suggests a plausible stone landing above the stairway, **not** the earlier unsafe western stonework/void location.
- Never perform automatic T3→F1 travel for tokens whose width or height is not exactly 1 grid square. Larger tokens require explicit manual GM adjudication. A 2×2 480-square token cannot fully fit in the 280×280 proposed arrival Region and cannot be assumed safe merely because Foundry's ephemeral placement emits a coordinate.
- Retain the existing GM consent modal, source and destination stable IDs, and owner/user pull logic. Revalidate token dimensions and actor, currently elected active GM, destination scene/grid, Region shape/behavior count, occupancy, and Wall intersections **again after** GM confirmation and before attempting teleport. If any condition drifts, stop with a GM notification instead of guessing.
- The simulation only verifies **ephemeral placement**, not the committed outcome of `teleportToken`. Do not promote to gameplay-certified based on this stage.

## Staged files and evidence
- `work/foundry-playwright-harness/clscale-f1-t3-guard-proposed-v001.js`; SHA256 `7ece308589200ede62acc7a8034b25db5d8e1201914f4463b9152ecf3fd10358`. **Not installed** in Foundry.
- `work/foundry-playwright-harness/clscale-f1-arrival-contract-v001.json`, exact-source and geometry contract; **not installed**.
- `work/foundry-playwright-harness/clscale-f1-t3-guard-fixtures-v001.test.mjs`: **19/19 PASS** after a mock Wall collection fix and three additional post-confirmation drift cases (token growth, changed GM election, changed Actor). Non-passing intermediate fixture runs are preserved in remote command history and were investigated. No Foundry writes.
- `work/foundry-playwright-harness/clscale-f1-postfixtures-readonly-v001.page.js`: **PASS_NO_WORLD_DRIFT** for frozen T3/F1/F2 Scene hashes, current ledger, Meow, and Ret. CL90 v014 remains **PASS_WITH_KNOWN_BLOCKERS** with zero unexpected failures, 21 Scenes/202 Regions/119 behaviors/33 Items.

## Migration constraints for a future distinct work unit
1. Reconcile current campaign checkpoint, exact live hashes, source schema, token/actor presence, no active non-GM players, and current sovereign ledger SHA. Full original source backups for both T3 and F1 **before any changes**.
2. **Suspend the current T3→F1 behavior before changing F1 grid or arrival Region**. Otherwise its old random landing could send tokens into unsafe geometry during a partial migration. This is a separate authorized and independently verified step, not covered by these offline fixtures.
3. Stage destination Region and F1 grid changes with no-write previews, exact expected differences, and one safeguarded apply per resource; independently verify all Wall/Region/Light geometry, F1→F2 puzzle and transition behavior unchanged, Meow token source preserved (except explicitly documented derived Region memberships), and ledger hash unchanged.
4. Install and independently hash/compile the proposed T3 handler **while disabled**, check all current source and destination predicates again, and only enable it after committed-placement behavior and 1×1/2×2 reject behavior are evidenced under a separately approved safe procedure.
5. Treat F1→F2 and CL50 R1–R4 route installers as **separate** change controls. CL50 installers remain quarantined; final player gameplay canaries deferred by the owner.
6. If any acceptance test cannot be completed, **leave the handler disabled and block** rather than applying partial travel automation. Do not move or activate the Meow measuring tokens as canaries; their Region-entry events previously caused sovereign-ledger changes.
7. The Bridge previous continuation receipt remains staged/unreconciled. The owner is updating the Bridge; **no new bridge dispatch, duplicate send, or manual reconciliation attempt** during this offline work.

**Status at end:** F1 remains grid120; original T3→F1 handler remains untouched, not disabled or replaced; no installer, teleport, player test, actor/item, Region, token, or sovereign-ledger write occurred in this study.
