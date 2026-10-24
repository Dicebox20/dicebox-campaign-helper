# Dicebox Campaign Helper — Foundry access and scene setup operating rules
Date: 2026-10-24
Status: OWNER-SUPPLIED PROCEDURE, documented for durable project reference. This file supplements established workflows; it does not independently alter ChatGPT Project Instructions, native module gates, or tested production harness scope.

## Separation of responsibilities
- Dicebox Campaign Helper is the Foundry VTT module display name; package ID `dicebox-campaign-helper`.
- Its independent in-Foundry scene setup tool creates new, inactive map Scenes, with preview, image attestation, approval and reread.
- Broader typed document operations belong to the local Chrome for Testing Dev PowerShell harness: `preview → apply → reread`; never substitute arbitrary direct database edits or unreviewed scripts.
- Inspect existing documents and owner approvals before creating anything. Preserve unrelated scenes, walls, regions and content. Reconcile unknown results before retrying.

## Original Regionwright-tested environment
- Local Foundry origin: `http://127.0.0.1:30000`; Regionwright test world ID `regionwright-puzzle-test`, title `Regionwright Puzzle Test`.
- Foundry `14.367`; dnd5e `5.3.3`. Ensure the Dicebox module is enabled, the selected Gamemaster is authenticated with a blank user password where configured, and that account is the elected active GM.
- Regionwright module scene setup implementation is **hard-coded to that world**; it must not be treated as a multiworld installer merely because the package is present elsewhere.
- Foundry UI: Token controls → map icon “DiceBox: Set up a scene or map” → name, served map via File Browser, width/height pixels, square/gridless, grid pixel size, distance and units → Preview scene → Create scene → open from Scenes sidebar. Scene remains inactive until separately activated.
- Supported source images: PNG, JPEG, WebP, AVIF. Upload first through Foundry File Browser or verified local asset workflow.
- Native module API:
```js
const preview = await game.diceboxSceneSetup.preview({
  name: "New map",
  map: "worlds/regionwright-puzzle-test/maps/map.webp",
  width: 3000, height: 2000, gridType: 1,
  gridSize: 100, distance: 5, units: "ft"
});
// Review preview and image hash before approval:
const receipt = await game.diceboxSceneSetup.create({
  operationId: preview.operationId, approved: true
});
const check = game.diceboxSceneSetup.reread(preview.operationId);
```

## Chrome for Testing Dev access
- Use a functioning PowerShell connector (e.g. Dicebox Bridge) with the *existing* utility harness. Never use ordinary Chrome, a personal Chrome profile, or a competing Foundry server. Do not restart Foundry simply to attach.
- Regionwright-tested harness path:
  `C:\Users\rujie\.codex\worktrees\dch-wp02-typed-harness\dicebox-campaign-helper\tools\dch-local-operations\Invoke-DchHarness.ps1`
- Run one command at a time, inspect structured receipts:
```powershell
$Harness = 'C:\Users\rujie\.codex\worktrees\dch-wp02-typed-harness\dicebox-campaign-helper\tools\dch-local-operations\Invoke-DchHarness.ps1'
'{"command":"ready"}' | & $Harness
'{"command":"inspect"}' | & $Harness
'{"command":"list","type":"Scene"}' | & $Harness
```
- Harness manages Dev Chrome identity and isolated automation profile, with loopback DevTools/CDP endpoint `http://127.0.0.1:9224`. `ready` may launch/reuse it, fix one about:blank tab, go to `/join`, and perform a blank-password join under its exact-world conditions. Browser remains open; temporary automation client disconnects.
- For another world, first verify server/browser state, switch or launch via normal Foundry Setup, and authenticate the intended active GM. If Setup authentication is required, use the saved Windows credential named `DiceBoxCampaignHelper/FoundrySetup` without printing it. Explicitly reconfigure the **entire** world-target contract (world ID/title, accepted user, module, image destination and every access guard), then run `ready`, `inspect`, `list` against that exact target. The original Regionwright `ready` does **not** automatically switch worlds.
- When an operation blocks or times out, inspect its exact receipt and observed state before deciding whether a retry is safe. An unresolved mutation must never be blindly replayed.

## Cabin in the Ashen Veil — confirmed owner-directed target exception
- Intended world ID `cabin-in-the-ashen-veil`; Foundry 14.367 / dnd5e 5.3.3; module 0.1.15 active at the time of the 2026-10-24 check.
- Preserve the unmodified Regionwright harness. The separate Cabin-specific harness copy has been created at:
  `C:\Users\rujie\.codex\worktrees\dch-wp02-typed-harness\dicebox-campaign-helper\tools\dch-cabin-local-operations\Invoke-DchHarness.ps1`
- At time of last verified `ready`/`inspect`/`list`, the authenticated, elected Cabin GM was `Gamemaster 1` and 20 scenes existed. This is an *observation*, not permission to assume identity remains unchanged later. Always verify fresh current state. Owner previously permitted `GameMaster 2` as an alternative, subject to an actual elected-GM check; do not evict or silently change accounts.
- The Cabin copy is a task-scoped experimental target adaptation. It is **not** a blanket permanent promotion or validated replacement for the original Regionwright harness. The module's `game.diceboxSceneSetup` API remains Regionwright-gated; for Cabin use independently verified digest-approved native document operations from the Cabin harness only, until a supported multiworld module change is adopted.
- 12 owner-approved Chat B source PNGs were copied and SHA-256 verified under `FoundryVTT/Data/Maps/cabin-in-the-ashen-veil`. This is only **asset staging**, not scene installation. Create separately with native preview/apply/reread, then implement and verify Walls/Regions through the established workflow. Keep UND-03's owner-approved large-room final art and measure tactical scale from artwork before choosing final grid parameters.

## Maintenance
Owner directions override defaults for their declared scope; keep production canon, side-campaign canon and experiments distinct. Record source versions, receipts, image hashes, world/user verification and subsequent revisions chronologically. Do not describe this reference file as an automatic update to ChatGPT's Settings → Project Instructions; that UI needs its own explicit edit.
