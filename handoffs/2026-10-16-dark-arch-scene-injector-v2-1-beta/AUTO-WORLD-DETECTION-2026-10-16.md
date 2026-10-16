# Dark Arch M01 — Automatic Foundry World Identification

**Date:** 2026-10-16
**Authority:** Direct user correction — "this isn't acceptable... the macro should be able to tell what world it is".
**Scope:** New DiceBox-generated scene injector macros; exact-target safety gates remain mandatory.

## Accepted UX rule

A Scene Injector running in Foundry must identify its current world by reading `game.world.id`. Never demand that a GM manually retype the currently loaded world ID as a required approval mechanism. Before any asset upload or document mutation, compare the automatically detected ID against the exact authorized world identity from the current scene specification; if it differs, reject safely and display both expected/detected values. Confirm the target and proposed changes in **one native Foundry DialogV2.confirm preview**. Reread world, module, exact stack, active/sole GM and collision checks after the approval promise resolves and immediately before writes. Closing/cancelling preview means no writes. This replaces the 2026-10-16 manually typed DialogV2.input gate, not the strict exact-world requirement.

## Dark Arch current implementation

- Authoritative exact world: `world-template-2` (user console confirmed).
- Macro identifies the world with `game.world.id`, checks against pinned `TARGET_WORLD_ID = "world-template-2"`; wrong target stops before dialog or upload.
- Macro uses a **single** `DialogV2.confirm` listing automatically detected world and one-Scene/14-Wall/2-Region installation plan; manual text input dialog removed.
- `checkStack()` runs before dialog, when entering preview, after approval, and again before Scene creation.
- Full previewable Library Markdown overwritten **in place**, stable library ID `libfile_a0680cb8b2c881919789a881b4299377`, file title `DiceBox-Dark-Arch-M01-Painterly-Injector-V2.1-Beta-PREVIEW-FIX.md`.
- Updated Markdown SHA256 `c57f0469c17fe3f6782f543dbdf16f867faccd361fb17933b5d897c834f1fde3`; previous SHA256 `c474f184e49fb61f2cd4c989ee99ca737399770dd8f03198f2642e6d1037f0a6`.
- Embedded painterly WebP SHA256 `f31d9bf2850ed853ac9af35d672a44cb2ed18a1fa1dadde8735e16d6fbfee2b2`; base64 image and exact WALL_SPEC/REGION_SPEC source blocks unchanged.

## Offline local tests (no live Foundry execution in this turn)

- Single Markdown/JavaScript block, required DiceBox markers and JavaScript `node --check`: PASS.
- Image Base64 decode 156770 bytes, SHA256, 1619×971 dimensions: PASS.
- 10 deterministic VM cases passed: approved preview reaches post-approval boundary (test harness stops before upload), decline, close, wrong world, inactive module, wrong module version, non-GM, missing DialogV2.confirm, world changes during preview, GM authority disappears during preview.
- The exact current GitHub repo validator was not available on the ChatGPT container; do **not** claim that validator PASS.
- No Foundry installation, map/token movement or native RuntimeProfile certification performed.

**Next gate:** Existing registered Macro contains prior code; user must replace the JavaScript from the updated Library Markdown, save the Macro, run once, review the native preview, inspect runtime receipt, then complete post-install authoritative rereads/movement canaries. No Ready-to-Play claim. The active program-slice checker remains FAIL on retired O-112, so no program-stage promotion.
