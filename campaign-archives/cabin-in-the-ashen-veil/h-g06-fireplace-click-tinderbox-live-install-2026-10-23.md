# H-G06 Fireplace — owner-requested click-to-light Region Execute Script

**Date:** 2026-10-23 Pacific / 2026-10-24 UTC  
**Owner direction:** Use existing `Scene.CAVHG06GreatRoom.Region.G0HM92QQtEfyZcFi` as a clickable fireplace interaction; only a character carrying a Tinderbox can ignite it; click same area to extinguish; display the prescribed descriptive modal; control existing `Scene.CAVHG06GreatRoom.AmbientLight.fuWonmPqjJX2SIVG`; do not use a Macro document.
**Status:** **INSTALLED_TECHNICALLY_VERIFIED_PLAYER_PLAYTEST_PENDING**.

## Stable inputs and exact objects
- World `cabin-in-the-ashen-veil`, Foundry `14.367`, dnd5e `5.3.3`, elected active GM `Gamemaster 2`.
- Scene `CAVHG06GreatRoom`.
- Existing Region ID `G0HM92QQtEfyZcFi`, owner-specified name **H-G06 - Fireplace**. The Region was originally named `Region` in native readback and was updated to the owner-specified name; existing rectangular shape is retained, coords `x=151,y=21,width=180,height=180`, one ground-level binding, Region visibility 0 (the Region outline need not be shown).
- Existing AmbientLight ID `fuWonmPqjJX2SIVG`. Original status `hidden=false`; deliberately changed to **`hidden=true`** initially so it starts unlit. All other Light properties retained (fire-colored, flame animation preserved).
- Native child RegionBehavior `CAV06FIRECLICK01`, name `H-G06 - Fireplace · Click and Tinderbox`, type **`executeScript`**, disabled false. No Macro was created.
- Native behavior event subscriptions: `behaviorActivated`, `behaviorViewed`, `behaviorUnviewed`, `behaviorDeactivated`. Core has **no Region Click event** at Foundry 14.367; the embedded script installs a `canvas.stage` `pointertap` handler during viewing and tests the target Region's exact shape via `region.testPoint({x,y,elevation:0})` independently of Region outline visibility, fog, and canvas tool.
- Behavior source: [h-g06-fireplace-click-tinderbox-execute-script-v001.js](./behaviors/h-g06-fireplace-click-tinderbox-execute-script-v001.js), SHA-256 `5819a2f2719def8d2ed5442d8b88fad651f66ec2797357fe3339b34dbda57fb9`. Foundry normalizes the final newline from source when storing, so it compares equal with `trimEnd()`, not byte-for-byte unnormalized.
- Exact socket channel `module.dicebox-campaign-helper` and namespace `cav.hg06.fireplace.v001`. The registered click handler is per client when viewing, the socket listener accepts narrow typed `request` messages, and only the **elected active GM** can call `AmbientLight.update({hidden:...})` on this exact document. The GM checks that the initiating user exists, is active and owns a character Token on the same Scene; a nonzero-quantity item named `Tinderbox` or `Tinder Box` is required when lighting. The item is **not consumed**.
- UI wording while unlit:
  - `The wood in the fireplace is old and dry, but it should still burn.`
  - `Do you wish to light the fire?`
  - `Required: Tinderbox`
  - `Light Fire` / `Cancel` confirmation.
- UI when lit: `The old wood is burning in the fireplace.` followed by `Do you wish to put out the fire?` and `Put Out Fire` / `Cancel`; no Tinderbox requirement to extinguish.

## Installation sequence and native receipt
1. Read-only confirmed exact Region and AmbientLight exist, Region had no behaviors, light was visible/on, module active, user was elected GM, scene was viewed.
2. GitHub source staged in local Foundry Data under `dicebox-campaign-helper/h-g06-fireplace-v001/fireplace-execute-script.js`.
3. `node --check` and native unsaved `RegionBehaviorDocument.validate({strict:true})` both **PASS** before any world writes, with all four supported event subscriptions.
4. Single installer call `cav-hg06-fireplace-install-click-tinderbox-native-behavior-20261023-v1` created the native RegionBehavior, renamed Region, and set target AmbientLight hidden. Original report `VERIFY_PARTIAL` because it required strict source equality, while Foundry trims the final newline. No retry/reinstallation was performed.
5. Subsequent independent read `cav-hg06-fireplace-script-native-postread-normalized-20261023-v1` **PASS** with `sourceNormalizedEqual=true`, `scriptGMListener=function`, `scriptClickListener=function`, `lightHidden=true`, and exactly **one** RegionBehavior `executeScript`. The Region geometric hit test for an in-rectangle point passed; socket listener count 1. No Fireplace Macro was created.
6. Native readback at final check: **25 Walls / 7 Regions**, unchanged by this installer (owner continued manual wall/Region placement since earlier snapshot), six other Regions including `H-G06 - Grandfather Clock` preserved, Scene/Level dimensions/config unchanged; all other Wall, Region, Level, Light config and Scene flags matched before/after snapshot.
7. Durable JSON receipt and state are stored locally at `FoundryVTT\Data\dicebox-campaign-helper\h-g06-fireplace-v001\verification-receipt.json` and `state.json`; final request `cav-hg06-fireplace-behavior-final-durable-verification-20261023-v1` **PASS**.

## Limitations, required real-player canary
- **No actors and no tokens** existed in this Foundry world at verification. The mechanism is installed and the GM listener registered, but actual Player click modal, DialogV2 confirmation, carried Tinderbox resolution, socket roundtrip, and light toggle are **not yet PLAYTESTED** and must not be labeled such.
- The script is built to start its handler on the behavior's `behaviorViewed` / `behaviorActivated` events. When an elected GM rejoins the world on an unrelated Scene, they may need to view H-G06 once to bootstrap their GM socket listener. Once registered in the session, it persists across Scene views until behavior deactivation or client reload.
- Pixel clicks are intentionally hit-tested without checking Region overlay visibility or line of sight. This includes fog-obscured area positions **while still on the Great Room canvas**. A player cannot interact with a Scene they have not opened.
- The installer has **no Macro document or Execute Macro behavior** and does not rely on player Macro permissions. The elected active GM performs the exact light mutation; scripted request messages are guarded by exact IDs, actor ownership, scene token presence, Tinderbox checks and duplicate request nonces. Socket sender identity itself was **not independently cryptographically attested**; this is not a security certification for adversarial socket injection.
- The installed script currently leaves a client-side result callback listening if the elected GM never responds; this is a minor reliability refinement candidate (response timeout / listener cleanup) for a future owner-approved patch, not a known functional success/failure yet.
- Player canary recommended: place a character Token in H-G06, give its linked character `Tinderbox` gear quantity 1, click the fireplace with Region overlay hidden, verify dialog and successful light activation, click again to extinguish, remove or zero the Tinderbox and verify the fire cannot be reignited. Perform these with a genuine non-GM connection while an elected GM is online.

**Separation of evidence:** OWNER-DIRECTED design and native behavior installation are VERIFIED; actual PLAYER interaction remains UNTESTED.
