# H-G06 Great Room — approved artwork transferred to Foundry Data

**Date:** 2026-10-23 America/Los_Angeles
**Campaign:** Cabin in the Ashen Veil
**Owner direction:** Transfer the approved artwork from this ChatGPT thread into Foundry's campaign Maps directory.
**Status:** EXACT ART INSTALLED / READ-BACK HASH VERIFIED / FOUNDRY ASSET HTTP 200; **NO FOUNDRY SCENE BUILD**.

## Creative asset authority
- The owner-approved H-G06 Great Room player-background PNG, from the ChatGPT conversation artifact, was available with 1173 × 1341 pixels and SHA-256 `c7e5305718d5aea1ddbcd374d0374f51b714bf6d860adf0cc0aabb3a29a4f0ee`.
- Local artifact filename `h-g06-great-room-owner-approved.png`, source-equivalent to `cozy_great_room_interior_map.png`; exact byte count **2,800,071**.
- This image is **NOT** the historically rejected `top_down_cozy_manor_great_room.png`, whose SHA-256 was `ecd8c401f6dc13cfc8306bfaa5b29d29d904b846691214a377ffd85811cb8a88`. Inspection crops, grayscale geometry candidates, and rejected renders have not been deployed as playable maps.
- The 2026-10-23 approved playable ZIP includes 20 images but **does not include** this separately later-approved H-G06 image.

## Transfer
- ChatGPT conversation source artifact was materialized through the connected Google Drive as a **private temporary staging copy**, preserving exact 2,800,071-byte PNG, not a recompressed version.
- Connector-private signed download URL was used in one bounded Dicebox Bridge PowerShell execution. Do **not** preserve the signed URL in repository records.
- Remote source read size, PNG signature, IHDR dimensions, and **SHA-256** all passed before atomic move to Foundry Data. No existing target file was overwritten.
- **Destination local absolute path:** `C:\Users\rujie\AppData\Local\FoundryVTT\Data\Maps\cabin-in-the-ashen-veil\h-g06-great-room-owner-approved.png`.
- **Foundry relative background path:** `Maps/cabin-in-the-ashen-veil/h-g06-great-room-owner-approved.png`.
- Source file's SHA-256 after remote copy: `c7e5305718d5aea1ddbcd374d0374f51b714bf6d860adf0cc0aabb3a29a4f0ee`.
- Foundry HTTP HEAD: `200`; `Content-Type: image/png`.
- The private temporary Drive staging copy created solely for transfer was subsequently **deleted successfully**; it is not a durable backup.
- No manual download and no browser-policy circumvention occurred.
- Bridge request id: `cav-transfer-approved-hg06-from-staged-private-file-20261023-v1`. Response: `Succeeded`, `completed`, exit 0, `RESULT=INSTALLED_EXACT`.
- Final Bridge reread request: `cav-transfer-chat-approved-art-final-filecount-20261023-v1`. Found **21 PNGs**, `GREATROOM_EXACT=True`, `FOYER_EXACT=True`, `MANIFEST_PRESENT=True`, `TRANSFER_TMP_COUNT=0`.
- The original 20 playable files from the earlier ZIP transfer remain intact alongside H-G06; their original `approved-playable-manifest.json` continues to describe those 20, not the separately added Great Room.

## Boundaries and next step
This is a **file deployment receipt**, not a Foundry Scene injection. The prior room Scene count was zero, and no Scene, Wall, Region, RegionBehavior, Actor, Item, or lighting documents were created in this action. The owner has directed the **Phase 1 structure-only build** (necessary walls, physical doors, named inert Regions with no puzzle behaviors). The actual build remains pending reconciled physical geometry, validated DiceBox single-macro BUILD and current elected active-GM readback. Last Foundry identity verification confirmed Gamemaster 2 had elected active-GM authority; recheck at mutation time.
