# STARTAKE migration status — 2026-10-23 UTC

## Inventory and current result

The source `/Startake/` Library snapshot contained **405 files totaling 39,677,682 bytes (37.84 MiB)**.

| Source category | Count | Status |
|---|---:|---|
| Markdown, CSV, JSON, and plain-text records | 332 | 322 copied as original UTF-8 text; 4 large/filtered records preserved as ordered chunks with pointer files; 6 Foundry Actor JSON exports not mirrored |
| PNG images | 52 | Raw image bytes not copied |
| XLSX workbooks | 6 | Raw workbook bytes not copied |
| ZIP archives | 15 | Raw archive bytes not copied |

The source paths, types, sizes and Library identifiers are retained in `asset-manifest.json`. The mirror preserves the original folder-relative paths under `library/`.

## Split-file source records

These source documents are represented by a pointer file and ordered parts under `library/_large-file-parts/`:

- `Starlink_Communications_Research_Progress_Tracker_v1.4_receipt_v371_checklist.md`
- `The_Starlink_and_Stripes_Act_Completion_Checklist_v2.0_v80.md`
- `Startake_Item2_Section1498_IP_GovernmentUse_Audit_2026-10-17.md`
- `The_Starlink_and_Stripes_Act_Integrated_Working_Bill_v1.9_2026-10-17.md`

Each pointer gives the exact part order and source line ranges. Concatenating its parts in numeric order reconstructs the source text. These four are reconstructable text records, but not byte-identical files at the original path.

## Explicit exclusions and open migration work

1. **Binary originals are not yet in GitHub.** The connector path used here did not expose raw file bytes in a form that could be uploaded and verified. Do not infer that an image, workbook or ZIP is preserved merely because it appears in the manifest.
2. Six `fvtt-Actor-*.json` files appear in the Startake Library folder but are Foundry Actor exports rather than Starlink and Stripes Act research artifacts. They are listed in the manifest and have not been copied into the Startake package.
3. The manifest and README do not replace the live Library tracker as the canonical coordination record. This migration preserves historic evidence; it does not validate legal claims, source accuracy, or formal acceptance.
4. The repository's existing `main` branch was not changed. The migration is isolated on `startake/migration-2026-10-22` and should remain a draft PR until the binary and excluded-file decisions are resolved.

## Verification status

- Source inventory and manifest saved to the branch.
- UTF-8 source copies written to their mapped repository paths.
- Four split records have pointer files and ordered chunks.
- Original binary-byte parity has **not** been verified.
- No research assignment was reserved, no canonical tracker claim was changed, and no formal acceptance or legal-review status was advanced.
