# CL-50 consolidated railway route design and pre-installation review

**Work unit:** `central-lodge-cl50-route-consolidation-v001`  
**Date:** 2026-10-07 PDT (2026-10-08 UTC)  
**Disposition:** Four user-authorized route **topology pairings** reconciled, candidate arrival geometry observed in read-only Foundry, **R1 v001 staged source BLOCKED for live promotion pending review**. No live route installation or game canary was attempted.

## Authority and source trail

Governing locked user decision: `D-2026-10-07-CL50-FOUR-BIDIRECTIONAL-RAILWAY-PAIRS`. Active campaign roadmap `docs/CENTRAL-LODGE-ROADMAP.md` lists eight exact terminal Region IDs. Source receipts:

- `docs/CL50-R1-BIDIRECTIONAL-GUARDED-PREVIEW-2026-10-07.md`
- `docs/CL50-R2-N2-T1-ARRIVAL-PREFLIGHT-2026-10-07.md`
- `docs/CL50-R3-N2-T2-ARRIVAL-PREFLIGHT-2026-10-07.md`
- `docs/CL50-R4-T2-N3-ARRIVAL-PREFLIGHT-2026-10-07.md`
- R1's two exact frozen files and source-hash manifest under `work/foundry-playwright-harness/`.

Current exact live evidence: Foundry VTT 14.367, dnd5e 5.3.3, world `the-lost-mine-of-phandalin`, canonical **21 Scenes / 202 Regions / 116 RegionBehaviors / 33 Items**, 134 world Macros in separate CL-92 source audit, campaign ledger revision 1, kernel SHA `6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814`. These are a **pre-installation baseline**, not desired after-install counts. The separate source-preflight CL90 smoke returns `PASS_WITH_KNOWN_BLOCKERS`.

## Approved end-to-end route order

`N1 East ⇄ T1 Mouth A | T1 Mouth B ⇄ N2 Tunnel A | N2 Tunnel B ⇄ T2 Mouth A | T2 Mouth B ⇄ N3 West`

| Route | First endpoint [Scene / Region] | Second endpoint [Scene / Region] | Approved |
|---|---|---|---|
| R1 | N1 East [`MAbLfBqG7qIVVuLN` / `xsitdXO94BHJkYKX`] | T1 A [`ImeIdHbYb6kZKAdt` / `ewIAYppRLvgIV1b7`] | Bidirectional topology only |
| R2 | T1 B [`ImeIdHbYb6kZKAdt` / `91XmuJ9LGbsJY52W`] | N2 A [`4pc5akMBieHU7GvV` / `lYps0Z5806d0W8wX`] | Bidirectional topology only |
| R3 | N2 B [`4pc5akMBieHU7GvV` / `shIAThge7cNy0JjT`] | T2 A [`ez9MSQ8QIO4cW6zo` / `3OGR0atcJokXJo6b`] | Bidirectional topology only |
| R4 | T2 B [`ez9MSQ8QIO4cW6zo` / `OOmnx3XAmw95E410`] | N3 West [`pHQvDUDlyWZFuNrX` / `foYsFHsLXtCbfiyR`] | Bidirectional topology only |

Every endpoint Region was present during its independent audit, with **zero newly bound travel behaviors**. Existing E1→M1 and T3→F1/N3 travel behaviors must remain untouched. N3 southern T3 branch Region `RP1jYOH738xl9hks` is a distinct connection with unresolved activation requirements; never confuse it with N3 West.

## Proposed arrivals: token **top-left** coordinates in scene-local pixels

All positions below are **read-only research outputs**, not fixed or approved teleports. Zero sampled straight-line blocking walls or occupied tokens were seen during the corresponding live geometry probe.

| Arrival destination | 1×1 token | 2×2 token | Other Region overlap at **1×1** |
|---|---|---|---|
| R1 → N1 East | (3730,1410), sample passed | **Not approved for automatic travel**; power-gate intrusion possible | N1 Walkable Railway Notice only; candidate avoids the three-proof power gate |
| R1 → T1 Mouth A | (560,1380), sample passed | **Not approved for automatic travel** | None |
| R2 → T1 Mouth B | (3690,1380), pass | Geometric sample passed at (3630,1320), **not corridor-approved** | None |
| R2 → N2 Tunnel A | (445,1480), pass | **Unsafe:** (385,1420) overlaps the return mouth and N2 station interpretation | N2 Walkable Railway Margin Notice only |
| R3 → N2 Tunnel B | (3740,1480), pass | **Unsafe:** (3680,1420) overlaps the return mouth and N2 station interpretation | N2 Walkable Railway Margin Notice only |
| R3 → T2 Mouth A | (560,1210), pass | Geometric sample passed at (500,1150), **not corridor-approved** | None |
| R4 → T2 Mouth B | (3650,1350), pass | Geometric sample passed at (3590,1290), **not corridor-approved** | None |
| R4 → N3 West | (740,1430), pass | Geometric sample passed at (680,1370), **not corridor-approved** | N3 Walkable Railway Notice, passive Depot Lighting |

**Initial system-wide size rule:** accept only rectangular **1×1 grid** player token documents for proposed automatic travel, pending independent final review, full route test and fixed landing guarantees. Other token footprints and multiple tokens must fail closed to GM manual Scene navigation. R4 alone has 2×2 candidate geometry in both directions but that does not make the interconnected railway safe for 2×2.

Arrival in informational notice Regions is intentionally preserved. No automatic arrival should trigger N1 Three-Proof Station Power or N2 Grotto Station Interpretation or change their puzzle flags by accident. Do not suppress unrelated Region behaviors, existing wall/door state, lighting, item/macros, or the N3 branch.

## Independent R1 frozen-source audit: serious pre-installation blockers

`cl50-r1-n1-to-t1-source-v001.txt` SHA-256 `0d804443760c05410678b6e1a6149da0a214758a43e8efe4ef3144b6056d2fd7` and `cl50-r1-t1-to-n1-source-v001.txt` SHA-256 `a03569e8b8bfcc2c1b3fedc969e84b10a30b1186c680f9fa9aad46623a34124b` remain immutable as **historical staged artifacts, never live-installed**. Earlier static **38/38 PASS** means selected syntax/hash/string checks, **not** semantic correctness.

1. **GM election conflicts with the authoritative executor contract.** The frozen R1 source computes `game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0]`, and returns unless `game.user.id` equals that first ID. In the fresh no-write `cl50-r1-staged-compatibility-readonly-v001.page.js`, authorized Assistant Gamemaster ID `pnTxw7VYpYR4IKWE` was active but first selected GM ID was `JESWV6CcU7m07VW6`. The current **AGENTS.md standing authorization explicitly permits the Assistant Gamemaster automation account** and supersedes older primary-GM-only rules. A correct implementation must identify one approved and leased executor deterministically without arbitrarily excluding the authorized session or running both GM clients.
2. **Placement preflight is not bound to commit.** Frozen source calls `ephemeral.spawnTokens(..., {create:false,placement:"center",...})` for `__sample` but later calls `ephemeral.teleportToken(__token,{placement:"center",...})`, which calculates its destination **again**. Exact live `teleportTokens` implementation inspection confirms a separate `#getTokenDestinations` call during the actual cross-Scene create/delete batch. The staged check therefore does **not prove** the eventual committed point equals the audited point if runtime occupancy/placement changes. Require one fixed destination per approved token and verify actual footprint at commit under an authoritative, race-aware contract; never claim an exploratory sample is a pinned teleport.
3. **The source checks Region membership using token-center `testInsideRegion`, not full footprint.** R2/R3 live read-only tests proved a 2×2 token may have a false center test while overlapping the reverse mouth and N2 story Region. The current R1 source restricts width=height=1, limiting that exposure, but the reusable route contract must explicitly check the whole footprint and reject overlaps with any reverse or story-trigger Region.
4. **Player recipient / client movement remains unverified.** Frozen source tries `event.user`, then a matching active user's character, then a uniquely owning active player before `scene.pullUsers`. The method exists in exact Foundry, but behavior when there are multiple owners, missing actor, no player, or a disconnect has no real-player canary. Owner-only Scene switching must be explicit; never broadcast to unrelated clients.
5. **Partial transfer and cooldown persistence are unproven.** `teleportToken` can execute a cross-Scene token create/delete batch. The client-side `globalThis.__diceboxCl50R1Travel` cooldown is per-client memory, not a durable cross-client source of truth. Outcome-unknown cases and reload/reconnect must stop and require authoritative reread; they cannot trigger another automatic transfer.

The live read-only compatibility probe positively found `RegionDocument.teleportToken`, `spawnTokens`, `Scene.pullUsers`, and `DialogV2.confirm` APIs; **API existence is not player acceptance**.

**Review status:** R1 frozen source is **QUARANTINED FOR LIVE PROMOTION** until the source-level conditions above are resolved and a new version is independently reviewed under an allowed implementation pathway. Do not mutate these frozen files or silently change their hashes. Previous guarded R1 installer-generation request was safety-blocked; do not bypass by changing tool transports, replaying, or disguising an install as a verifier.

## Contract for any future route implementation (planning only)

- Recheck approved source/destination *stable IDs* and Foundry bound IDs, exact stack, current canonical Scene/Region/behavior/Item/Macro counts, complete ledger, current owner and player audience, and single-executor lease immediately before each action.
- Distinguish **travel-request** by real token movement into source mouth from `TOKEN_ENTER` on arrival. Confirm actual player ownership, consent and GM decision; no surprise teleports.
- Compute a token-sized, whole-footprint candidate outside every return or unrelated state-writer Region; validate walls and access. The committed position must be the validated position; if not guaranteed by the API, stop.
- Maintain source/destination transaction identity, pending and cooldown; decline and failure are bounded. Treat missing confirmation/ambiguous batch outcome as **OUTCOME_UNKNOWN** and do not retry without checking both scenes.
- No replacement/delete of existing Regions. Scoped RegionBehavior creation and flag updates (if permitted later) must have idempotent identity, rollback, fixed SHA, exact expected delta, independent final reread, and a live primary-GM + real non-GM player canary.
- Full network acceptance needs directional and reciprocal reentry canaries for all four routes, token-sized Wall/door/navmesh evidence, refresh/reconnect behavior and truthful status labels. Existing E1/M1, T3/F1/N3 behaviors and horror audio Macro SHA must remain invariant.
- Observe `CL-93 Scene lighting and visual effects` as the final **planned** roadmap phase, not concurrent permission to change hidden lights.

## Exit and next bounded task

**Research phase complete for R1–R4 geometry, but source and implementation are not cleared.** Next approved *non-mutating* unit: reconcile the frozen source review blockers into versioned route contract acceptance tests, or study official Region API placement guarantees and player ownership semantics. The R1 installer safety block remains absolute absent a separately supported reviewed procedure. No live world write, route binding, or player canary can be claimed from these documents alone.

**Bridge continuity:** Earlier receipt `msg-3e9f935d-f4ec-473c-b509-2721b17407e2` and correlation `foreman-15b14be4-5a64-4be6-bb57-419084449d0d` have since been reported **consumed=true** by current Foreman-status inspection. Foreman enabled; this does not itself authorize a live Foundry installation.
