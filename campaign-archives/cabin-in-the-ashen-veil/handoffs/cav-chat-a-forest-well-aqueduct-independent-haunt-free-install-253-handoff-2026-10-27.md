# Cabin in the Ashen Veil — Chat A independent Forest Well / Aqueduct native installation handoff

**October 27, 2026 Pacific, shortly after midnight.** Owner stated: “its doing undercroft now, you may continue”. Chat B is handling Undercroft and late game exclusively; Chat A owns early/midgame Aqueduct and Forest Well. Owner's newer canonical rule: Crooked Man encounters implemented **last**, related to checkpoints, personally GM-roleplayed and **never required puzzle-chain progression**. Full compatibility diagnostic after installation.

## Remote-verifiable checkpoint

- Regionwright `Dicebox20/regionwright`, branch `codex/cav-sune-integration-20261026`, HEAD **`f8542fec3fcab9a1f84a6c015fec9cd4d33730cb`**, independently verified on remote, prior HEAD `f3c1bfccf077ec9d3b4d97573889289dd6b598f0`.
- **253/253 source regressions PASS**, 0 failures, 45 test files, 7 new genuine mock-GM Forest Well tests; modified existing Aqueduct route tests.
- Installed current sources to original Regionwright module on disk (4 exact SHA-before/after-checked scripts, all backed up and Node syntax valid). No forced Foundry reload.
- Added exactly **one** native ExecuteScript Behavior `CAVAQWELLACCESS1` on original North Aqueduct Region `Scene.CAVAQ01Scene0001.Region.CAVAQWELLNORTH01`, events `tokenMoveIn` and `tokenMoveWithin` and enabled dispatch to `aqueductRoutes.handleForestWellNorthRegionEvent`. No new Scene, Region, Item, actor or puzzle flags.
- Guarded native first GM readback PASS; **independent second GM readback PASS**. Latest shared-world census 47 Scenes / 244 Regions / 133 Behaviors (Chat B concurrent additions preserved).
- Source report: [Detailed Regionwright audit](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-aqueduct-forest-well-independent-puzzle-route-2026-10-27.md), adjacent JSON and puzzle log.
- Source/native installation receipts on host:
  - `utility-harness/artifacts/cav-chat-a-independent-north-well-arrival-native-install-20261027.json`: `installed-native-gm-readback-pass`.
  - `utility-harness/artifacts/cav-chat-a-independent-forestwell-native-gm-postread-20261027.json`: `PASS`.

## What changed and why

Original Aqueduct commissioning required a physical Crooked Man NPC Actor and enabled an automated first chase. Original Forest Well was gated on chase escape/capture. Both violated owner's updated encounter policy.

The replacement route is a genuine **Gear → Handle → drained Pond/Bath → commissioned Aqueduct** progression, with the original reward authenticity/source checks and return-first safe travel preserved. Completing the real second part invokes commissioning in the elected-GM service, with uncertainty requiring reconciliation rather than forged puzzle state. **Crooked Man chase trigger remains disabled**. Later player presence physically within the original North Aqueduct well Region (correct player authorization and actual token) triggers once-only RESERVED → forest return enabled → outbound enabled → DONE original well claim. The Forest Well reentry remains open after subsequent Pond water refill; original Pond/AQ transitions retain water-stage gating. The old first chase source no longer invokes Forest Well unlock.

Already running Regionwright API is **cached** and does **not yet expose the new handler**. A *fresh* elected GM ESM import of updated installed disk routing code and the native Behavior both PASS, but actual live original `game.modules.get("regionwright").api.campaign.cabin.aqueductRoutes.handleForestWellNorthRegionEvent` was **undefined** in the existing session. **Coordinate module reload with Chat B** after its bounded Undercroft change before calling the handler runtime-active. Do not attempt uncoordinated competing GM login/reload.

## Original claims remain genuine, not simulated

At independent postread, Gear/Handle and commissioned route status are **NULL**, Forest Well claim **NULL**, original northern outbound teleport and Forest-side reentry **disabled**, original Pond entry/AQ return **disabled**, first Crooked Man chase **disabled**. Zero AQ tokens. No player Item, story progress, actor, haunt, or Undercroft data modified. Full compatibility diagnostic and non-GM player acceptance remain deferred per owner.

## Next Chat A focus

Continue other genuinely missing authorized early/midgame content or wait for a safe coordinated active-module reload; avoid repetitive source audits and do NOT touch Chat B's SG-01 Silver Tiny Key, Undercroft, late books, or endgame. Separate this new source setup installation from genuine player progression and later compatibility acceptance.

**End-of-turn:** source/disk installed, original North RegionBehavior native installed, 253 PASS and two GM inspections PASS, **live active API reload outstanding**.
