# Cabin in the Ashen Veil — Chat B Turn 14 Shared-World Native Install Git Review Receipt

**Pacific date:** 2026-10-26. **Live installation confirmed** of three enabled late Batch 1 native Region Behaviors. **Player interaction acceptance untested**, rewards intentionally blocked by upstream story state. Owner explicitly authorizes Chat A and B to work disjoint Foundry Scenes in same world.

**Source commit:** `5f40141afc7195ecf4349c56d3d378823a345a88` pushed to `Dicebox20/regionwright` branch `codex/cav-late-game-chat-b-20261026`, parent `adfee26b987739de4c0dc5cbf32b82d9c65192b1`. Chat A separate checkout observed `0e83bfdbdd3c13e45fc8f619e8c43a1d073f771b` without modifications by Chat B. PR #1 remains **DRAFT / unmerged**.

**Actual native RegionBehavior #1:** `Scene.CAVHU04Scene0001.Region.CAVHU04HOPECHST1.RegionBehavior.CAVHOPECHSTBEH01`. Hope Chest can handle authenticated original Silver Key `Item.IY8fuUG5P0yWIZIh` with genuine second SG-01 chase claim proof; discrete GM-confirmed unlock and original Music Box `Item.YaKs6z2AWlEAlyzx` once-only claim. Source SHA256 `c1db0b18787cb3b47f9e3a3e53454f123dbb267296867e5b6bf46b7aa1886186`.

**Actual native RegionBehavior #2:** `Scene.CAVHU08Scene0001.Region.CAVBE5639AEC2179.RegionBehavior.CAVWICKSHELFBEH1`. Wick `Item.o0g8PyGRIbdwVM3m` claim after genuine Studio Protection passage and read `Item.5jwy75XyFezukf3b` ledger. Source SHA256 `ec40a5c37bab7b6bd167fcd8c9820e6172d0b44e399b08853d1ae8070fe5b8c7`.

**Actual native RegionBehavior #3:** `Scene.CAVEXT05Scene001.Region.CAVEXT05LANTERN1.RegionBehavior.CAVLANTERNBEH001`. Original Shack Lamp Oil `Item.CAVLAMPOIL000001` and authentic Wick installed separately in any order, GM-confirmed. NO premature cobweb FX, ignition or eye#2 Item grant. Source SHA256 `3cd7547b4f941a7f7a707bb86d6977f96d45e38563fc9b247d02ef0242e8029b`.

**Partial-write incident resolved WITHOUT retry:** Initial native installer installed Hope before falsely failing because Foundry trimmed exactly one leading and one trailing newline from executeScript source. Separate independent GM readback and full normalized-source/hash proof matched. A second one-purpose installer installed ONLY missing Wick+Lantern Behaviors; existing Hope was neither overwritten nor duplicated.

**Native after-write proof:** exact elected `Gamemaster 1`, world `cabin-in-the-ashen-veil`, Foundry 14.367, exact CFT Dev local game page. Independent `cav-chatb-turn14-native-independent-postread-20261026.json` yielded `pass:true`: all three enabled `executeScript` Behaviors, correct event list, identical normalized source digests, **zero progression ledgers**, all four new original world library Items unique and still `GM_LIBRARY_ONLY`, **zero character copies**, original Study return Region and northwest Winder Behavior still present. No Chat A worktree/shared Studio registry writes.

**Tests:** 15 new native script source-compilation/guard fixture tests pass; complete Cabin suite **1170/1170 across 39 files** PASS. Native player UI, token-trigger, GM confirmation, safe scene reload, actual reward and recovery are NOT player-tested.

**Source forensic record:** `modules/regionwright/scripts/studio-cav-late-batch1-native-region-scripts.js`, tests, and install/preflight, read-only reconciliation/normalization, single-use continuation, independent GM readback and JSON receipts under `docs/cabin-ashen-veil/native-install-evidence/2026-10-26-chat-b-batch1-turn14/`. The native installers are forensic receipts **not safe to rerun**.

**Next story blockers:** original first and second Crooked Man chase and SG-01 Silver drop; original complete readable Prayer of Protection Journal and Studio altar/Workshop safe native passage; Gazebo cobweb ignition/original second eye marker; exact Rufus source dog near current Study return Region overlaps; never alter Chat A owned early/mid Behaviors or assume full playtest.

**Continuity:** unique Turn14 handoff and structured metadata plus updated chronological progress/matrix mirrored from source SHA in this independent DCH archive. PR remains draft for review; native installed Behaviors do not await PR merge.