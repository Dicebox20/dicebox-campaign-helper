# CL-50 railway acceptance-contract fixtures: next gated development checkpoint

**Work unit:** `central-lodge-cl50-contract-acceptance-fixtures-v001`  
**Evidence layer:** offline tests + independent no-write live endpoint readback. **No live installation or player gameplay test.**

## Authority and scope

The accepted R1–R4 topology is unchanged: N1 East ⇄ T1 A; T1 B ⇄ N2 A; N2 B ⇄ T2 A; T2 B ⇄ N3 West. Its authority is locked decision `D-2026-10-07-CL50-FOUR-BIDIRECTIONAL-RAILWAY-PAIRS`. The latest comprehensive source review is `docs/CL50-RAILWAY-FOUR-ROUTE-INTEGRATION-REVIEW-2026-10-07.md`.

The existing frozen R1 staged script SHA values were rechecked and **preserved exactly**:
- N1→T1 `0d804443760c05410678b6e1a6149da0a214758a43e8efe4ef3144b6056d2fd7`
- T1→N1 `a03569e8b8bfcc2c1b3fedc969e84b10a30b1186c680f9fa9aad46623a34124b`

They remain **BLOCKED for live promotion**: sorted first-active-GM election conflicts with the current designated Assistant Gamemaster execution session, and `spawnTokens` preflight is followed by `teleportToken` independently reselecting placement. The original installer generation also hit a tool safety refusal; do not repeat it through alternate transports.

## Reproducible acceptance suite

File: `work/foundry-playwright-harness/cl50-route-contract-acceptance-fixtures-v001.cjs`

Invocation: from its folder, `node --test .\cl50-route-contract-acceptance-fixtures-v001.cjs`.

**Observed result:** Node syntax PASS; **24 tests / 24 PASS / 0 FAIL**. Uses Node core only, reads frozen staged R1 source and manifest read-only, and performs synthetic in-memory checks. It does **not** contact Foundry, generate an installer, mutate files, or simulate genuine token deletion/creation.

Coverage:
- Eight unique Region and stable IDs, four fixed canonical reciprocal pairings.
- All eight **1×1** proposed arrival footprints avoid their respective return-mouth rectangles using the full 120-pixel square, not a point-only test.
- At N2 A and B, the **2×2** proposed rectangles intersect their return mouths even when their token centers are outside.
- At R4, 2×2 candidate geometry clears the source mouths on both sides but **does not** make the entire four-route network large-token safe.
- Current GM ID ordering selects Gamemaster `JESWV6CcU7m07VW6`, whereas current separately authorized Assistant Gamemaster is `pnTxw7VYpYR4IKWE`: unsafe election rule reproduced.
- Both frozen R1 hashes match the manifests, and both staged scripts still have the independently checked preflight placement followed by an unpinned teleport call.
- Synthetic positive-case acceptance guard and **17 intentional negative cases**: unauthorized executor; no single-executor lease; no GM consent; no actor ownership; wrong/unbound mapping; in-flight; unknown previous outcome; reconnect unsafe; >1×1 token; no preflight; unpinned destination; non-atomic destination; changed destination between preflight/commit; reverse mouth collision; story/puzzle trigger overlap; destination occupied; unknown Walls.
- Existing informational notice Regions can remain eligible to fire normally, but the synthetic guard refuses any specified forbidden story/puzzle Region overlap.

## Actual live runtime readback

No-write `work/foundry-playwright-harness/cl50-eight-mouth-geometry-readonly-v001.page.js` independently reread all eight Foundry mouth shapes and stable IDs from the exact world and version: **PASS**, every Region present, behavior count **zero** at each new mouth, T1/T2 source flags **UNBOUND**, and no source/destination token currently in those terminal Scenes. This is independent of the offline acceptance suite and confirms the suite's shape fixtures have an authoritative current source. Note that geometry snapshots must be refreshed immediately before any future guarded write.

## Scope boundary and missing acceptance evidence

A passing synthetic contract **does not prove** an implementation can satisfy it. In particular, the current Foundry `teleportToken` API recomputes destination placement. An implementation must show a verified way to pin the actual committed token position to a freshly validated, whole-body-safe destination with a race/occupancy protection or must fail closed. Do not assert that `offset`, `placement:center`, or a one-tile Region alone solves this without tested exact-version evidence.

Also still required: one deterministic authorized executor without conflicting GM sessions; GM consent and real player ownership; no duplicate or reconnect-trigger bounce; outcome-unknown source/destination reread; current Wall/door access; exact source ownership/hash/count/ledger checks; installed route final verification; at least one real player two-direction canary per pair, then across the network.

**No route behavior is installed.** Existing 21 Scenes, 202 Regions, 116 enabled RegionBehaviors, 33 Items, 134 world Macros and ledger revision 1 are expected to remain unchanged until an independently approved guarded installation. N1 three-proof station gate, N2 story observation, N3 notice, T3 southern branch, and both one-shot horror cues remain protected. CL-93 Scene lighting and visual effects remains last roadmap phase.

## Next bounded work unit

Stay in **read-only review**: research exact official Foundry 14.367 cross-Scene token teleport placement guarantees (especially `offset` and source/destination atomicity) and independently characterize the player event/ownership model, recording a simple deterministic proof or an explicit impossibility/GM manual fallback. Only then propose a corrected versioned source for review. Do not retry or bypass the previously refused installer generator. The independent database verifier command was previously tool-safety-blocked and is not being retried or substituted; distinguish KB builder integrity from independent database verification.
