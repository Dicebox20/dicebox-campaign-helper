# Cabin in the Ashen Veil — approved battlemap transfer to Foundry Data (verified)

**Date:** 2026-10-23 America/Los_Angeles (night of October 23).
**Owner request:** The approved images are in Downloads; transfer them into the established Foundry Data Maps folder.
**Transfer status:** `COMPLETE — 20/20 SOURCE PNGs INSTALLED AND HASH-REREAD`.

## Source and scope
- Original ZIP retained unchanged:
  `C:\Users\rujie\Downloads\Cabin_in_the_Ashen_Veil_ALL_APPROVED_BATTLEMAPS_2026-10-23.zip`.
- ZIP SHA-256: `eadc36fed5d73ec458791ad752fce10b32817fc8fa3990ea0f5601de99af1ab3`.
- ZIP entries: 20 `playable/*.png` plus `manifest.json`.
- The manifest identifies source archive `ashen_veil_approved_maps_2026-10-23_v10_foyer_approved.zip` as its approval basis. This 77MB **playable-only derivative** is not byte-for-byte the original 88MB v10 archive; it intentionally excludes planning blueprints.
- Manifest census: **18 approved base-map targets** represented by 20 PNGs (including Pond FULL/DRAINED and an extra estate trail fork). No H-G06 Great Room image exists in this ZIP.
- The recovered official approved H-G02 Foyer PNG SHA-256 is `34c5e7dab1193893ef6e557745e85821362f76741464567a73120a689cb6b1e8`.

## Destination
- Local directory: `C:\Users\rujie\AppData\Local\FoundryVTT\Data\Maps\cabin-in-the-ashen-veil`.
- Foundry File Browser directory: `Maps/cabin-in-the-ashen-veil/`.
- 20 approved PNG image files (77,184,238 bytes total) were copied with original `playable/` basenames.
- `approved-playable-manifest.json` was copied into the destination as an audit/reference artifact.
- ZIP integrity test passed. Pre-injection SHA-256, file size, and PNG IHDR dimensions matched manifest for all 20 images. Every file was **rehash-verified from the destination** after copying.
- Existing destination files were guarded against overwrites; none existed for these assets. The original ZIP remains in Downloads.
- Follow-up directory reread: **20 PNGs** plus manifest file.
- Foundry local HTTP HEAD readback succeeded (HTTP 200, `image/png`) for:
  - `Maps/cabin-in-the-ashen-veil/h-g02_foyer_with_basement-stairwell_owner-approved.png`
  - `Maps/cabin-in-the-ashen-veil/sg-05_memorial-clearing_dormant_owner-pass.png`.

## Included playable art basenames
```text
aqueducts_unified_gondian_owner-approved.png
bathhouse_unified_surface_owner-approved.png
ext-01_carriage-yard_visual-pass.png
ext-02_pond_drained_owner-approved.png
ext-02_pond_full_owner-approved.png
ext-05_forgotten-gazebo_owner-approved.png
ext-06_greenhouse-interior_owner-approved.png
ext-07_boathouse_clearing_edited_owner-approved.png
ext-trail_grove-bathhouse-fork_pass.png
fm-unified_northwestern-forest-maze_owner-approved.png
h-g02_foyer_with_basement-stairwell_owner-approved.png
sg-01_northwest-grove-corner_moon-bust_owner-pass.png
sg-02_northern-processional-walk_owner-pass.png
sg-03_northeast-grove-corner_owner-pass.png
sg-04_western-entrance_visual-pass.png
sg-05_memorial-clearing_dormant_owner-pass.png
sg-06_eastern-grove-walk_four-way_owner-pass.png
sg-07_southwest-grove-corner_bust_visual-pass.png
sg-08_southern-grove-walk_visual-pass.png
sg-09_southeast-grove-corner_sun-bust_owner-accepted.png
```

## Exact nonclaims
- **H-G06 Great Room source image NOT INCLUDED or transferred**; it was approved after this source playable archive and remains an independent binary handoff task.
- No Foundry Scene, Wall, Region, RegionBehavior, Actor, or other world document created or changed.
- Verified asset presence/HTTP serving is **not** game-side Scene installation, world active-GM authority, geometry proof, or playtest certification.
- The current scene-install workflow for interiors remains: approved artwork → reconciled scale/geometry → canonical validated single-macro BUILD → elected active GM → native injection → authoritative Foundry reread. Owner asked to defer all puzzle mechanics, leaving only named inert Regions.

## Command/receipt lineage
- Archive inventory request `cav-approved-map-download-inventory-20261023-v2`: located new ZIP in Downloads.
- Manifest inspection `cav-approved-maps-newzip-verify-manifest-20261023-v3`: verified 20 manifest-listed PNGs, archive SHA and metadata. Earlier 3.10 compatibility failure `file_digest` was retried only in a new read-only preflight using ordinary `hashlib.sha256` and corrected.
- Transfer/verification request `cav-install-20-accepted-battlemaps-20261023-v1`: `Succeeded`, `receiptStatus=completed`, exit code 0; output `status: VERIFIED`, 20 installed, 0 pre-existing, source archive kept. Temporary staging, checksums, collision guards and rollback implemented.
- HTTP readback request `cav-accepted-20-maps-http-served-verify-20261023-v1`: `Succeeded`, 20 PNG files and manifest found, HTTP 200 for both sampled assets.
