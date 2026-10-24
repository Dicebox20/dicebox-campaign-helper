# Approved Map Archive v6 — verification receipt

**Date:** 2026-10-23
**Archive:** `ashen_veil_approved_maps_2026-10-23_v6_pond_aqueduct_boathouse.zip`
**File size:** `75,884,883` bytes
**SHA-256:** `5de81171d15b086d857c3f7537f2250403a40a21e882e4e5668f47256fdcedde`
**Scope:** ChatGPT current artifact workspace only, not binary committed to GitHub. This receipt documents creation and verification.

Archive preserves the prior v5 images byte-for-byte and adds exact source copies:
- `playable/aqueducts_unified_gondian_owner-approved.png` — large owner-approved Aqueduct combined AQ-01/AQ-02.
- `playable/ext-02_pond_full_owner-approved.png` — Pond FULL initial stage.
- `playable/ext-02_pond_drained_owner-approved.png` — Pond DRAINED stage revealing Aqueduct gate.
- `playable/ext-07_boathouse_clearing_edited_owner-approved.png` — EXACT approved **edited** Boathouse, retaining accepted partial water foliage. SHA-256 `37553712296cda930faf7f8a1439cc2026bfdf498e5fddae3d0ca2185f687ba8`. Never substitute unedited parent.

Contents: **23 entries = 16 playable images + 6 blueprint references + manifest.json.** This includes one accepted non-registered trail-fork image, and the Pond has **two stage images counted as one playable scene**.

**Validation:** `ZipFile.testzip()` passed. Every manifest entry's recorded byte count and SHA-256 independently matched the archive payload after construction. The archive's own SHA-256 is recorded above. Existing v5 files copied by raw extraction/writing without changing internal image bytes.

**Latest census:** 56 logical area/feature records → **48 confirmed base-map locations** after Bathhouse/Aqueduct grouping. **14 base-map locations approved; 34 remain**, with alternate water stages accounted for separately from base-map counting. Trail fork is an additional accepted image outside the original numbered target inventory.

**Important:** This ZIP certifies owner-approved **visual artwork only**, not rendered scale, Foundry travel/teleport Regions, path blocking, flood-state switching, magical overgrowth, the player's Prayer of Devotion collection, hidden Doll bonus mechanics or wall collisions. Stage-safe runtime verification remains pending.
