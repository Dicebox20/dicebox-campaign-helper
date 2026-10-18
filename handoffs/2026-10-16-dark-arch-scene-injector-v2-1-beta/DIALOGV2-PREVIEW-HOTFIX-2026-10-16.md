# Dark Arch M01 — Foundry 14 DialogV2 Preview Hotfix

**Event:** First live attempt blocked at module exact-stack v0.1.15/active check; after controlled module upgrade and re-enablement in `world-template-2`, the next user-run macro blocked before the preview with `Error: prompt() is not supported` in `confirmPreview()`.

**Runtime observed:** world `world-template-2`, sole active GM `true`, Core `14.367`, D&D5e `5.3.3`, DiceBox module `0.1.15` active `true`. The trace points to the browser global `prompt()` before the asset upload or Scene creation code. **No live document writes have been demonstrated; exact no-write runtime reread is still pending.**

## Bounded corrective patch (offline)

Replace the unsupported `globalThis.prompt(...)` target-confirmation call with `foundry.applications.api.DialogV2.input(...)` returning named form data (`worldId`). Require the literal `world-template-2` as a fixed world gate in `checkStack()`. After correct typed input, reread `checkStack()`, use documented `DialogV2.confirm()` to show the exact Scene/Wall/Region/art diff, require exactly `true`, and reread the stack again before any writes. Cancellation/close, wrong ID, inactive GM, wrong world, missing API or declined preview remain no-write fail-closed conditions. Browser prompt is not required. No image, geometry, scale or embedded Region data changed.

**Source:** Foundry V14 DialogV2 API docs, `https://foundryvtt.com/api/classes/foundry.applications.api.DialogV2.html` (official `DialogV2.input()`, `DialogV2.confirm()`).

**Local original artifact SHA256:** `efdad8978ee82ad6a9720282a1cb3f7bd81da2aa3db5d78b1e5386cb4985b35a`.

**Patched exact one-Markdown/one-JavaScript artifact SHA256:** `c474f184e49fb61f2cd4c989ee99ca737399770dd8f03198f2642e6d1037f0a6`.

**Image embedded WebP SHA256 unchanged:** `f31d9bf2850ed853ac9af35d672a44cb2ed18a1fa1dadde8735e16d6fbfee2b2`, 156,770 bytes. `WALL_SPEC` and `REGION_SPEC` payloads are unchanged.

**Conversation container output:** `/mnt/data/dicebox_heist_design/dark-arch-m01/final-injection/DiceBox-Dark-Arch-M01-Painterly-Injector-V2.1-Beta-PREVIEW-FIX.md`. Artifact bytes are not represented as uploaded to GitHub or to a live Foundry world.

## Tests and outstanding checks

- Offline packaging/21 required markers: PASS; one Markdown / one self-contained JS macro; `node --check`: PASS; embedded image SHA256 and dimensions: PASS.
- Deterministic Node mock scenarios **10/10 PASS**: wrong world, wrong module, non-GM, missing dialog API, cancel input, incorrect typed ID, active GM disappears during input, decline approval, close approval, successful mock installation with 14 Walls/2 Regions and repeat-run zero additional writes.
- **Exact repository validator on the patched exact bytes:** NOT RUN, artifact remains in ChatGPT conversation runtime only.
- **Foundry v14 live dialog test / Scene/Wall/Region reread:** PENDING. Do not report Ready-to-Play.
- **Active program slice:** no stage promotion; existing O-112 retired/blocked checker remains FAIL.

**Recovery:** Create a NEW Foundry Script Macro by pasting only the JavaScript block from the corrected artifact. Do not edit/retry the old one. In `world-template-2` as sole active GM, type exact world in the native input dialog, inspect confirmation preview, approve only when expected. Capture errors or installer receipt; then perform authoritative runtime verification before claiming success. No live modifications performed in this assistant turn.

**Related standing rule:** D-206 (Ballad Regionwright DialogV2 recovery) governs separate subsystem and demonstrates the documented-dialog + deterministic-promise testing requirement; not evidence that this Dark Arch macro already passed live tests.
