# H-G06 Fireplace GM handler canary and local token-thought bubble

**Executed:** 2026-10-23 Pacific / 2026-10-24 UTC.  
**Owner scope:** Owner authorized Foundry test scripting and reuse of placed test token, priority preservation of puzzle continuity.  
**Status:** **NATIVE_GM_HANDLER_PASS; LOCAL_BUBBLE_PASS; NON_GM_PLAYER_UNTESTED**.

## Exact runtime and subjects
- World `cabin-in-the-ashen-veil`; Foundry `14.367`, dnd5e `5.3.3`, exact active elected GM `Gamemaster 2`.
- Scene `CAVHG06GreatRoom`, Region `G0HM92QQtEfyZcFi`, Execute Script RegionBehavior `CAV06FIRECLICK01`, AmbientLight `fuWonmPqjJX2SIVG`.
- Owner test token `9Z2gZeHqIcKMTgeV` on H-G06, character Actor `XsogNG0pRJtZEy4f`, existing native equipment Item `fJwzBejKMNCEoEKH` called `Tinderbox` quantity `1`.
- There were zero connected non-GM players during this test. GM is owner of character. This is **not** a demonstration of player permission or client socket delivery.

## Script-driven GM handler exercise

`cav-fireplace-live-gm-test-token-authorized-handler-canary-20261024-v1`: located **the actual registered GM Region script socket handler** (`globalThis.__CAV_HG06_FIREPLACE_SCRIPT_V001__.socketHandler`), supplied fresh nonce, exact fixed scene/Region/Light/token and elected GM identity for these **locally invoked handler** cases:

| Case | Native before / after | Result |
|---|---|---|
| `light` with Tinderbox | `AmbientLight.hidden: true → false`, `Tinderbox.quantity: 1` | **PASS**, quantity not consumed |
| `extinguish` with Tinderbox | `AmbientLight.hidden: false → true`, `Tinderbox.quantity: 1` | **PASS** |
| `light` after temporary item quantity `1 → 0` | `AmbientLight.hidden` remains **true** | **PASS**, correctly blocked |
| Cleanup/finally | `Tinderbox.quantity: 0 → 1`, `AmbientLight.hidden: true` | **PASS / VERIFIED**, no test item/token or light left altered |

This validates real Foundry document changes and item predicates through the script's GM handler. It does **not** validate a real non-GM `canvas.stage.pointertap` click, dialog buttons, actual socket authenticity or player-side result notification.

## Local private thought bubble evidence

`cav-private-token-thought-bubble-local-ephemeral-canary-20261024-v1`: exact existing token present and `core.chatBubbles: true`. Using the native `canvas.hud.bubbles.say(token, "I should look at this more closely.", {pan:false, requireVisible:false})`, Foundry returned an HTMLDivElement bubble. Native `game.messages.size` was **0 before and 0 after**. **PASS** for local ephemeral bubble rather than persistent shared ChatMessage.

**Future player-facing hint rule:** Show subtle clues only on the intended character's own client as ephemeral overhead thought bubbles, not the persistent shared chat log. Before certifying privacy ensure message routing does **not** broadcast private text to other clients and that the recipient can see the bubble even without permission to execute a Macro.

## Next actions
- Genuine non-GM player canary from the owner's player login/token ownership; test click, dialog, Tinderbox, fire/close, GM reconnect and error handling. Keep the region Source script, GM, and exact target IDs intact.
- Start `H-U07` Studio RENDER candidate from owner-accepted aged H-G06 styling and latest upper-floor topology, then owner INSPECT. See [PREPARE](../prepares/h-u07-dahlia-art-studio-current-owner-pre-render-v1-2026-10-23.md).
- No world Item, Scene, Macro, or Journal creation occurred. Existing test token and Actor remained in place.
