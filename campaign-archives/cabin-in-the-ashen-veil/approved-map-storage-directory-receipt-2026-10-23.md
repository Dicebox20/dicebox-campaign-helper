# Cabin in the Ashen Veil — Foundry approved-map storage directory
**Date (America/Los_Angeles):** 2026-10-23
**Authority:** Owner: “we can store the approved maps there”, following verified read-only discovery of the existing Foundry Maps folder.
**Scope:** Campaign-specific binary-art deployment directory only; no change to universal Scene BUILD rules.

## Readback
- Root: `C:\Users\rujie\AppData\Local\FoundryVTT\Data\Maps`.
- Created campaign subdirectory: `C:\Users\rujie\AppData\Local\FoundryVTT\Data\Maps\cabin-in-the-ashen-veil`.
- Foundry-served relative path: `Maps/cabin-in-the-ashen-veil/`.
- Dicebox Bridge PowerShell request: `cav-create-approved-maps-destination-20261023-v1`.
- Result: `STATUS=CREATED`, `IS_DIRECTORY=True`, `CURRENT_ITEM_COUNT=0`, PowerShell exit code 0, durable command execution completed.
- No maps copied into the folder during this action; no Scene, Macro, Wall, Region, or world document mutated.
- Only owner-approved exact image assets should be placed here. Preserve originals, asset identity, hashes and byte counts, use versioned paths/filenames to avoid overwrites, and perform Foundry-side served-path verification before BUILD.
- The Foyer approved raster is recorded in `approved-map-archive-v10-foyer-receipt-2026-10-23.md` (SHA-256 `34c5e7dab1193893ef6e557745e85821362f76741464567a73120a689cb6b1e8`); **it has not been transferred into the new folder**.
- Do not claim a working background Scene until authoritative readback, scale and current elected active-GM checks are proven.

**Status:** Destination CREATED and read back; map migration PENDING; no Foundry document build.
