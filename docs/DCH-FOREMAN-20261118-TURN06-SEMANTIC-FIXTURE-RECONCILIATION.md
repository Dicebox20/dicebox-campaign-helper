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
