# DCH Foreman Turn 06 — semantic fixture reconciliation (2026-11-18)

**Evidence class:** read-only source review + independently rerun disposable Node fixture. **Not** a Foundry installation, live ChatGPT model/tool call, real player view, production release, M0 acceptance, or canonical Windows checkout update.

## Authority and source states

- Governing product roadmap: `docs/DCH-ROADMAP-v2-LIBRARY-CANONICAL.md` on main, owner-aligned AI-first charter at commit `a33bd791ba1ccc1bc71bb619cc5b153b99ab3e99`. Its current near-term priority is typed Campaign Director commands, validated scene generation, authorized Foundry installation and actual player-view proof, without mandatory manual editing.
- This Foreman integration **branch** starts at public GitHub main commit `b626a88164323345aeab5a17cdbd9f7197d16b27`. It is a remote branch only: the former Foreman's uncommitted Windows changes are not contained or silently preserved here.
- Prior Worker B's review bundle from the owner's ChatGPT Library, `V001_REVIEW_BUNDLE.zip`, SHA-256 `083d8e9c70260ffab60b3405825aa9d6b422b43c85c3f8fd2e492ff2cf5290cd`. Bundle names the additive, unapplied `packages/dicebox-foundry/src/semantic-scene-v14-slice.js` and `packages/dicebox-foundry/tests/semantic-scene-v14.fixture.test.mjs`.
- Reread source SHA-256 `a8d6de4d37e97fae6ca713268c29101cb8656cc9551f1c5ec3055259983e8e58`, test SHA-256 `388d1004ec27870c32ae90e319a01059b1dc15efb930390748a70f05e86590d8`. Previous worker patch SHA-256 `436a30c64e74c76a271b56d8ae0028f1a37cefe972ae0a45e6e67782f57279a8`.
- Independent isolated rerun in an unconnected container scratch with Node v22.16.0: **83 tests passed, 0 failed**. Synthetic only. Neither original Windows checkout nor installed module/world was touched.

## Confirmed integration discrepancy

`packages/dicebox-foundry/src/program-scene-vertical-slice.js` on main:
- `collectionFor` at lines 182–187 covers Wall, Region, Tile but not AmbientLight.
- `snapshot` at lines 220–250 covers Wall, Region, Tile counts/readbacks; `foreignCounts` at 208–214 lacks lights.
- `validatePackage` at 278–294 accepts only Scene, Level, Wall, Region, Tile, with fixed old candidate counts.
- Existing embedded writes at 449–467 cover Wall, Tile, Region, not AmbientLight.

Worker B's additive semantic converter emits `documents.AmbientLight` and `foundryScene.lights`, plus Wall and Region no-write candidates. The current installer is a **fixed older fixture path**; it must not be silently generalized by simply adding a light call. A new versioned installer/adapter must validate ownership and source revision, support AmbientLight, perform model validation under exact Foundry 14.367, make all changes through the selected authorized GM, and independently reread exact created document identities. Preserve foreign documents and avoid interpreting artwork as semantic geometry.

Official Foundry v14 API documents `Scene.createEmbeddedDocuments(embeddedName, data, operation)`, `AmbientLightDocument`, and `BaseAmbientLight.defineSchema` fields including `x`, `y`, `config`, `walls`, and `vision`. Online v14 documentation may describe a later build; behavior at **14.367** remains unproven until tested there.

## Active blockers and continuity

1. Bridge PowerShell local command refused: `A canonical relay writer already owns this data directory; MCP host refused.` The Foreman did not bypass or replace that writer; local uncommitted changes need state-preserving reconciliation.
2. A direct native ChatGPT-to-Codex request returned `native_caller_context_unverified` with `nativeSendAttempted: false`. This is not evidence of delivery. The authorized desktop writer fallback also cannot currently be executed through the blocked PowerShell route.
3. Worker A/B follow-on review tasks were **staged** for Switchboard under Bridge message `msg-2238d1c4-5cea-4242-82ea-8066ee109932`; no live target transcript delivery was verified. Do not replay without reconciliation.
4. Owner-selected live ChatGPT account/tool receipt, exact elected GM in disposable Foundry 14.367, native DataModel validation, real light/vision/door/Region play, player-view screenshot and M0's security/native-return gates remain unverified. **M0 = NOT_ACCEPTED (0/8).**

## Next bounded engineering action

Reconcile one canonical Windows checkout writer and dirty source, then independently review/apply Worker B's two-file candidate under a dedicated branch with exact hash checks. Design and test an AmbientLight-aware installer path in a **disposable** world (including positive/negative cases, permissions, revision drift, id collisions, complete authoritative rereads, and recovery). Separately validate Worker A's native tool receipts through the actual selected ChatGPT account and approval staging. Do not call either synthetic source tests or a local picture the actual Foundry player view.

This is an execution/evidence receipt, **not** a competing product roadmap.

## Supplement: Foundry v14 Level and lighting contract

Official v14 `SceneData` declares optional embedded `levels` and `lights` collections, plus `initialLevel`; `AmbientLightData` declares `x`, `y`, `config`, `walls`, `vision`, and metadata. The `BaseLevel` documentation shows creation through `scene.createEmbeddedDocuments("Level", ...)` and owns the background/foreground media. The B converter currently has no approved Level/background artifact, and the Foreman disposable installer candidate intentionally does not manufacture one. **No player-visible completed scene is established by a successful synthetic Scene/Wall/AmbientLight/Region receipt.** A subsequent integration slice must bind an approved Level and artwork/asset attestation before any player-view claim. Sources: https://foundryvtt.com/api/v14/interfaces/foundry.documents.types.SceneData.html ; https://foundryvtt.com/api/v14/interfaces/foundry.documents.types.AmbientLightData.html ; https://foundryvtt.com/api/v14/classes/foundry.documents.BaseLevel.html .

The additional four-file source-only branch candidate has 99/99 combined synthetic tests in independent Node v22.16.0 scratch; none use installed Foundry or a selected ChatGPT account. The disposable installer candidate is not registered by module.json or exposed to a model tool catalog. A real runtime authorization/Level/asset and negative-player-observer test remain mandatory.

## Source-only hardening, review revision 126 (2026-11-18)

The expanded **isolated Node 22.16.0 test suite** passes **127/127**, 0 failures (including 24 complete feature-order permutations). The current feature branch contains the reviewed converter and three fixture suites; no source here is installed or exposed as a live ChatGPT tool. The original Worker B candidate stays in the Library review bundle and is not claimed to match the subsequently hardened source byte-for-byte.

Independent Foreman negative-case review found and fixed:

1. Partially overlapping collinear solid Walls and crossing/overlapping door portals were not rejected by the original converter. Seven new geometry regressions now cover these cases, retaining valid endpoint-only joins.
2. A Scene.create call can commit then throw, leaving no return ID. The receipt now conservatively marks write outcome unknown and recovery required rather than claiming no write.
3. World, build, elected GM, approved revision and blueprint source can drift during awaits. The adapter rechecks state and pins the complete blueprint across callbacks, with a full authored content snapshot passed to the trusted host approval verifier. The caller's declared SHA is not accepted as independent content authenticity.
4. Successful child API counts and ownership flags alone were insufficient. The adapter now verifies exact return IDs, rejects additional helper-owned documents, and authoritatively compares the authored Wall geometry/limits, light coordinates/config and Region polygon with reread data.
5. Approval and DataModel validation provider errors are redacted to safe error codes. Synthetic tests cannot themselves prove that those callbacks are backed by independently authenticated APIs.

Source/test SHA-256 after this review:
- semantic converter: `044c86594a3b3843e7488a8490a9a1dc7f693f74db42248d7451b47f1a01e283`
- disposable installer: `4c00555fe7531f5f4f4598ad01347db323d015a3fc185def8363eddd3b46d803`
- tests are available under `packages/dicebox-foundry/tests` on the isolated branch.

The active GitHub main checkout is older than the previous Foreman's dirty Windows source: main `apps/campaign-helper-desktop/src-tauri/src/lib.rs` contains a local transport probe but not the reported uncommitted native `siwc_app_tools.rs` integration. No automatic merge of the remote feature branch into the Windows checkout is safe until the canonical writer lock and local source divergence are reconciled.

Next acceptance gates: exact Foundry 14.367 DataModel schema and GM-controlled disposable world; approved Level/background asset and hash; real wall/door movement, vision/light, Region behavior and two-branch key/door puzzle; native ChatGPT selected-account verified proposal and permission receipts; player-view observation. The original M0 gate remains **NOT_ACCEPTED (0/8)**.

## Confirmed Foundry 14.367 → 14.370 release delta

Official release notes (read 2026-11-18):
- [14.367 / Aug 18](https://foundryvtt.com/releases/14.367) is the pinned private fixture version. It corrected Level ordering and some data/client issues relative to 14.366.
- [14.368 / Sep 16](https://foundryvtt.com/releases/14.368) changed default Level top elevation from `20` to `4 × grid distance`. Generated Levels should supply explicit elevation values instead of relying on cross-version defaults.
- [14.369 / Oct 8](https://foundryvtt.com/releases/14.369) fixed Region shape scaling when Scenes resize, a Scene import-with-Wall rendering failure, and a case in which Ambient Light darkness rendering failed in Chromium. Its release also documents an issue where scene importing Walls could require manual refresh; real player-view acceptance at 14.367 must treat rendering vs persistence as separate checks.
- [14.370 / Nov 2](https://foundryvtt.com/releases/14.370) explicitly recommends upgrading due to upstream Node.js security fixes; it adds Grid Space Region shapes, Level `_stats`, and many client changes. The current online v14 API likely describes these later changes, not a pinned 14.367 runtime.

Decision: **do not silently upgrade an owner world or installed module** during source review. Use exact 14.367 as the existing disposable test baseline, and make a separate, backed-up migration/compatibility validation decision for 14.370. Do not mistake tests under 14.370 for a 14.367 acceptance receipt or vice versa. No Foundry version was installed, updated or runtime-tested in this Turn06.

## Runtime-shape integration gap

The no-write Worker B helper `previewSemanticSceneForActiveGm` currently validates its injected runtime as a plain object (`record(runtime)` requires `Object.prototype`). Synthetic tests pass a plain `{game, Scene}` wrapper; a real browser `window/globalThis` object is not that wrapper. Future installation wiring must supply a narrowly scoped authenticated adapter object instead of silently passing the page-global runtime, and must prove the actual `game.scenes` and embedded-document interfaces under Foundry 14.367. This is not a release-ready module entry point.
