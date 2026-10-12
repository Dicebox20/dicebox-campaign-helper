# CL-92 verified player-canary readiness: installed travel and audio (2026-10-07 PDT)
**Evidence:** Read-only Foundry audit `work/foundry-playwright-harness/cl92-player-canary-readiness-v001.page.js`. **Status:** PASS_WITH_DEFERRED_PLAYER_CANARIES. No gameplay execution or client stimulation.

## Exact runtime and invariant checks
- Foundry **14.367**, system **dnd5e 5.3.3**, world `the-lost-mine-of-phandalin`.
- Live `game.macros.size = 134`, canonical ledger revision `1`; separate CL90 smoke reports 21 Scenes / 202 Regions / 116 enabled RegionBehaviors / 33 world Items, kernel SHA `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`.
- Read-only actual connected users: two active GMs, **zero active non-GM players**. Thus no real player-facing canary was possible without fabricating a player or changing the session.
- The macro and route source hashes below were freshly computed from the actual Foundry documents and compared to the independently verified install receipts; all five match. Existing three travel RegionBehavior `system.events` are iterable and all contain `tokenEnter`. Plain JSON serialization as `events={}` in earlier evidence was misleading.

| Canary | Live document | Fresh source SHA-256 | Current state |
|---|---|---|---|
| E1 front door → M1 entrance | RegionBehavior `HBtxj5OwVSOJdqnC` | `f144c80ca7789ea0ca246a43529bea56b53776d965b1c6471670a89abf236b0f` | Enabled source-present, no non-GM player |
| T3 ancient passage → F1 | RegionBehavior `tSqhDN5CtAHzccmf` | `c179ae83855e6eb136a1225bfbb882ab9c6b7bcd3f0773df3654f82b2b23d6cb` | Enabled source-present, no non-GM player |
| T3 branch → N3 return | RegionBehavior `pZpcYXFn517t6L5U` | `051c669835aaed94f0497ebe6e54590d37df97eceb271b611b0263ca95b8f963` | Enabled source-present, no non-GM player |
| M1 footsteps | Macro `P7mgEkmAUiJXYdUD` | `4ff5a82aa5d57f8831f47063fab893eaea4d315942d59b9fbda99a0a1a9a42b6` | Unconsumed Scene one-shot flag, no player |
| M2 haunted piano | Macro `VHVC7yVlrNS7mWGJ` | `c27e902c6232b946ee36a61572ac17a88cd5fca54acbe391afd7fdbf483e0e3b` | Unconsumed Scene one-shot flag, no player |

## Safe next gameplay window
When the *primary Gamemaster* and a real non-GM player are simultaneously viewing the matching Scene, run one controlled canary at a time. For travel: assert token ownership and normal movement into the configured source Region, observe GM consent, destination arrival, client scene transition, and non-repeat/no-bounce. For M1/M2 one-shot audio: primary GM runs the exact authorized Macro **once**, after audience check and consent, and records actual player playback/flag persistence (do not replay on uncertain broadcasts). Do not attempt these tests automatically just because the source hashes match or a non-GM user logs in.

## Constraints
CL-50 new N1/T1/N2/T2/N3 bindings remain **unapproved** pending exact T1/T2 terminal mapping. M1 clock solution, N3 unlock policy, one-way night trigger, M2 Founder Portrait and U2 history semantic differences remain unresolved. No Region deletion, source installer replay, new Macro, asset playback, player teleports, ledger updates, or Bridge sends were made during this work unit.
