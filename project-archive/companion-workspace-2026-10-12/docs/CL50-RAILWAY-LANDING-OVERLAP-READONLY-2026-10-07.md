# CL-50 railway landing and trigger-overlap audit (2026-10-07 PDT)
**Work unit:** `central-lodge-cl50-landing-risk-v001` | **Layer:** Foundry read-only PREVIEW + existing authored sources | **Disposition:** Preview PASS, no teleport/arrival acceptance or actual gameplay canary.

## Safety and authority
- Working live target: Foundry 14.367, dnd5e 5.3.3, world `the-lost-mine-of-phandalin`, authorized `Assistant Gamemaster` session.
- Latest CL90 smoke: 21 Scenes, 202 Regions, 116 enabled RegionBehaviors, 33 canonical Items, kernel SHA `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`, ledger revision 1 unchanged. No live Foundry mutations or Macro execution.
- Canon source forbids guessing T1/T2 destination orientation: `flags.world.dicebox.route.orientationStatus="UNBOUND_DO_NOT_GUESS"`, `terminalA=null`, `terminalB=null`; 4 west-to-east candidate pairs remain HYPOTHESES, not accepted destination bindings.
- Source files: `work/foundry-playwright-harness/cl50-railway-landing-readonly-v001.page.js` and `cl50-railway-overlap-readonly-v001.page.js`. Both executed using `node exec-page.mjs read <page.js>` and returned read-only success.
- Current connected users: primary Gamemaster and Assistant Gamemaster only, both viewing E1. No non-GM player audience present, so real travel and CL52 audio canaries were NOT attempted.

## Proposed arrival centers: exploratory ONLY
All coordinates are Scene-local Foundry pixels; x/y are proposed **token-center** coordinates, not approved token top-left positions. Every point needs clearance for actual token footprint and Wall/door movement validation.
| Candidate arrival Region | Scene | Proposed center (x, y) | Straight approach wall crossings | Nearby token collisions | Other Region overlaps |
|---|---|---|---:|---:|---|
| N1 East `xsitdXO94BHJkYKX` | N1 | (3620,1470) | 0 | 0 | Railway Notice, Three-Proof Station Power |
| T1 Mouth A `ewIAYppRLvgIV1b7` | T1 | (540,1440) | 0 | 0 | none detected |
| T1 Mouth B `91XmuJ9LGbsJY52W` | T1 | (3780,1440) | 0 | 0 | none detected |
| N2 Tunnel A `lYps0Z5806d0W8wX` | N2 | (670,1540) | 0 | 0 | Margin Notice, passive Platform Lighting, Grotto Station Interpretation |
| N2 Tunnel B `shIAThge7cNy0JjT` | N2 | (3650,1540) | 0 | 0 | same three Regions |
| T2 Mouth A `3OGR0atcJokXJo6b` | T2 | (560,1310) | 0 | 0 | none detected |
| T2 Mouth B `OOmnx3XAmw95E410` | T2 | (3760,1375) | 0 | 0 | none detected |
| N3 West `foYsFHsLXtCbfiyR` | N3 | (710,1470) | 0 | 0 | Railway Notice, passive Depot Lighting |

## Observed RegionBehavior semantics
- **N1 Three-Proof Station Power** `KzJqBPzzR8nqyETR`: source action `gate`, `TOKEN_ENTER`, writes/targets `puzzles.n1.railwayPowered` when the three house/garden/rail proof prerequisites pass. A landing here may cause a real gate evaluation. Do not classify the overlap as harmless or pre-mark it safe for automatic arrivals.
- **N2 Grotto Station Interpretation** `3U2E9roXN4fxNHba`: source action `observe`, `TOKEN_ENTER`, targets `puzzles.n2.grottoStationInterpreted`; a landing can become a story observation.
- N1 `g9OhfDhT1ooLMytV`, N2 `vOB9uxkvWqmWwtLc`, N3 `8bWw5K81DTz5wyv6`: source `notice` discovery actions; potential player-facing outputs on entry.
- Passive lighting overlaps have no RegionBehaviors. NONE of the examined overlapping behavior sources contains `teleportToken(`; that is narrower than confirming there can be no bounce once new destination behaviors are added.
- The existing T3→N3 return targets N3's **southern branch** Region, not this N3 West candidate, and must be preserved.

## Correctness limits and next approved gate
This is **not a Foundry pathfinding/movement or pixel-perfect clearance test**. Candidate center tests only rectangular Region intersections, token proximity, and straight-line Wall crossing; it does not validate token dimensions, nonrectangular Regions, dynamic door state, line of sight, navmesh, actor permissions, or player's real arrival rendering. Foundry RegionBehavior `events` is iterable: the subsequent CL-92 source-only audit showed three installed travel behaviors explicitly listen for `tokenEnter`. The earlier `events={}` JSON serialization was only a display artifact. Live event delivery still requires a GM/player canary.
Before any route APPLY: GM accepts exact orientation with Region stable IDs; approved target arrival is checked with actual token footprints and wall restrictions; consent and no-bounce cooldown are specified; incidental gate/notice triggers are deliberately permitted or suppressed by approved semantics; record accepted roadmap/checklist and KB; then no-write PREVIEW → guarded single APPLY → independent FINAL VERIFY → GM/player canary.

**No state changed:** all 202 Regions protected, 116 RegionBehaviors preserved, 86 hidden lights untouched, ledger revision 1 unchanged, M1/M2 CL52 one-shots unplayed, Bridge and Codex untouched.
