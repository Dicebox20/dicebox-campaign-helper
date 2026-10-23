# STARTAKE migration status — 2026-10-23 UTC

## Current verified state

The source `/Startake/` inventory contains **405 files totaling 39,677,682 bytes (37.84 MiB)**. The migration remains on `startake/migration-2026-10-22` and PR #21 remains open and draft. The repository's `main` branch has not been changed.

A recursive Git-tree audit of the migration branch found **79 manifest paths not present**: 73 raw binary originals and six Foundry Actor JSON exports. All remaining manifest paths are present; four large/tool-filtered text records are represented by pointer files and ordered chunks.

| Source category | Count | Current repository state |
|---|---:|---|
| Markdown, CSV, JSON, and plain-text records | 332 | 322 copied as UTF-8 text; four more represented by pointer files and ordered chunks; six Foundry Actor exports not mirrored |
| PNG images | 52 | Manifested; raw bytes not transferred |
| XLSX workbooks | 6 | Manifested; raw bytes not transferred |
| ZIP archives | 15 | Manifested; raw bytes not transferred |

The four split text records are reconstructable by concatenating the referenced parts in numeric order. They are not byte-identical files at their original repository paths.

## Verified blocker and attempted recovery

The Library file listing and manifest provide source identifiers and sizes, but the available file-materialization operation rejected raw-byte materialization for a representative PNG with: “This Project file does not have an authorized raw-byte materialization path.” Retrying with both the projected file ID and stable Library ID returned the same denial. The original binary bytes therefore cannot be read by the available authorized connector in this session, so they cannot be faithfully uploaded or checksum-verified from here. No image/workbook/archive has been replaced with a reconstruction or falsely marked as transferred.

A local helper, [`complete-startake-binary-migration.ps1`](complete-startake-binary-migration.ps1), has been added to this branch. Once original source files are available in a local directory, it preflights expected filenames and byte sizes against the manifest, copies eligible raw files into their mapped repository paths, updates manifest/status handling, and stages the changes on this migration branch only. It does not commit, push, merge, or alter `main`. Foundry Actor exports are excluded by default; the optional `-IncludeActorExports` switch must be used only when intentionally archiving those unrelated files.

## What is and is not complete

- **Verified present:** repository README, source manifest, this status report, and the migrated text archive with its split-record pointers/parts.
- **Not transferred:** 52 PNGs, 6 XLSX workbooks, 15 ZIP archives, and 6 Foundry Actor JSON exports.
- **Not verified:** byte-for-byte parity for original binary assets, binary hashes, or archive/workbook parsing after upload.
- **Not changed:** canonical Startake Library tracker, research claims, formal acceptance metrics, bill verification status, or repository `main`.

## Required remaining step

The raw originals must be made available to a local filesystem or another authorized byte-transfer path. Run the helper from a local clone on branch `startake/migration-2026-10-22`, with the original files in a flat source directory matching the manifest filenames. For example:

```powershell
./docs/startake/complete-startake-binary-migration.ps1 -SourceRoot "C:\path\to\Startake-export" -RepoRoot "C:\path\to\dicebox-campaign-helper"
```

Add `-IncludeActorExports` only if the six unrelated Foundry exports should be archived too. Review the staged diff, verify representative PNG/XLSX/ZIP files open correctly, then commit and push the branch. Keep PR #21 draft until that review is complete. This is a migration-status report, not evidence that the Starlink and Stripes Act is legally or substantively complete.
