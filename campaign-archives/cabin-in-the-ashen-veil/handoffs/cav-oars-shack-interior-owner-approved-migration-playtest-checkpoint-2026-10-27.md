# Cabin in the Ashen Veil — One-at-a-time Oars playtest repair handoff

**Date:** October 27, 2026 Pacific. **Owner workflow (explicit):** We are now testing puzzle Regions **one at a time**. Owner reports PASS (Region activated), MISSING, or FAILURE. **ASK OWNER BEFORE BEGINNING ANY FUTURE REPAIR.** Do not automatically proceed, reset reward state or rewrite a neighboring puzzle. This Oars repair was separately and explicitly approved.

## Owner-verified results before this repair

- **Family Carriage inspection:** PASS; non-spoiler narration displayed.
- **Carriage Yard → Donovan's Shack teleport:** PASS.
- **Wooden Oars trigger inside Shack:** owner could not find it (MISSING); diagnosed original Behavior incorrectly attached to the Yard approach Region.

## Owner approval and exact target

> Shack Interior Oars: Scene.CAVEXT03Scene001.Region.TWKOyz83JjJu94E7 just copy the behavior and delete the original. We're going to be working step by step, ask me before you begin any repairs.

Assistant proposed the exact migration plus Rowboat dependency correction, explicitly preserving Skaal Tel's existing DONE Oars and deleting only the original Yard pickup Behavior, not the Yard Region. Owner replied **“Yes.”**

## Executed and independently verified

- Original Yard Region `Scene.CAVEXT01Yard0001.Region.CAV01R0000000006` **still exists**, its historical `cavOarsPickup.status=done` and Region metadata unchanged, but its original `CAVOARSBEHAV0001` Behavior has been **deleted**.
- Original Shack Interior Oars Region `Scene.CAVEXT03Scene001.Region.TWKOyz83JjJu94E7` exists with unchanged 120×300 geometry and now contains the **one enabled native ExecuteScript `CAVOARSBEHAV0001`** with tokenMoveIn event and correct Shack scene/region constants. Original source/new source SHA256 `fdfe8b39afa1fb4bf77416b05fefc11aae8936eef9436a1a593e96fbc17888e2` → `70c3a180a15e83aa0c5fd0b19dc8245d1d28ec6cdfd2a46f0841619659f3367e`.
- Authenticated completed historical Oars claim was carried to the Shack Region, tagged with `migratedFromRegionUuid` to preserve the true previous award site. **Skaal Tel still owns exactly one genuine original Oars Item** `Ggb9lJYYtaXsZS8e` sourced from world `Item.CAVOARSPOND00001`. Original Item provenance still truthfully refers to the historic Yard receipt; it was **not** retroactively rewritten.
- Original Pond Rowboat `Scene.CAVEXT02Scene001.Region.CAVROWBOATREG001`, enabled `CAVMIRRORBEH0001` now checks the canonical Shack `DONE` claim and exact Actor Item. It also accepts the existing historic Yard item provenance *only when* the original historical `DONE` claim, same Actor and exact Item ID all match. No fake loose Item tags, reissued Oars or Mirror reward. New Rowboat source SHA256 `44739c30f0dc05062a5dc501175157becfa3d0baaffca1f38ca66ad94e985242`.
- All **four** bounded live Foundry native stages PASS: carry claim, clone Behavior, revise Rowboat source, delete only original Yard Behavior last.
- A **second independent authenticated elected-GM read-only postread PASS**: exactly one Shack Oars Behavior, zero Yard Oars Behaviors, original Yard Region/claim present, migrated Shack `DONE`, single authentic Skaal Tel item unchanged, original Rowboat Behavior still enabled with revised source.
- Full Regionwright Cabin source regression **284/284 PASS** (previously 278/278; six new migration/provenance tests). All scripts compiled; no token movement, reward re-claim, actual player event, teleport edit or Chat B late-game change.
- Regionwright branch `codex/cav-sune-integration-20261026`, independently GitHub remote verified commit **`74ee7cba7791e52dc3b691600f984a694271bdb0`**.

## Original machine receipts

Host `C:\Users\rujie\AppData\Local\Programs\Chrome for Testing Dev\utility-harness\artifacts`:
- `cav-owner-oars-shack-migration-original-live-preflight-20261027.json`
- `cav-owner-approved-oars-yard-to-shack-original-behavior-migration-20261027.json`
- `cav-owner-oars-shack-migration-independent-elected-GM-postread-20261027.json`

Source [complete report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-owner-approved-original-oars-behavior-to-shack-migration-2026-10-27.md) · [immutable new source/claim manifest](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/cav-owner-approved-oars-shack-interior-migration-payload-2026-10-27.json).

## Next immediate action, no more tool writes

**Ask the owner to enter the single Region `TWKOyz83JjJu94E7` (Shack Interior Oars) with a real player-owned token and report whether Region is visible/activates or missing/fails.** The current non-GM Dyscid was in the Shack, but the genuine one-time Wooden Oars award **belongs to Skaal Tel**. Re-entry will likely give **no new pickup message** because the transferred claim remains `DONE`; that alone is not proof of a missing Region. If the owner wants a clean-state reward replay or actor Item transfer, explain and **request separate explicit owner approval** before modifying anything.

**Do NOT advance to the Rowboat or perform another repair until owner reports this checkpoint and directs continuation.**
