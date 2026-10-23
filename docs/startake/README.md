# STARTAKE Library Migration

This directory is a preservation mirror of the ChatGPT Library folder `/Startake/` for the Starlink and Stripes Act project.

- **Source inventory snapshot:** 2026-10-23 UTC (2026-10-22 Pacific).
- **Inventory:** 405 files across 5 listing pages; 1 subfolder.
- **Total source size:** 37.84 MiB.
- **Source types:** text/markdown: 273; image/png: 52; application/json: 14; application/vnd.openxmlformats-officedocument.spreadsheetml.sheet: 6; text/plain: 1; application/zip: 15; text/csv: 44.
- **Source tree:** `library/` preserves each Library path relative to `/Startake/`, including `starlink_research_topics/`.
- **Safety:** This migration is additive on a dedicated branch. It does not alter the source Library, the DiceBox repository's existing files, or the canonical Startake tracker.

## Authority and preservation notes

Use the latest verified workflow and live tracker before continuing Startake work. The current source set includes Research Workflow v2.2, Consistency Workflow v1.0, the current canonical tracker snapshot, completion dashboard, latest requirements-to-bill crosswalk, and bill revision history. Historical reports and older versions are intentionally retained; filenames alone do not establish current authority.

## Migration limits

Text files are copied as UTF-8 source documents. Binary originals (PNG images, XLSX workbooks, ZIP archives) are enumerated in `asset-manifest.json`; they must not be represented as byte-identical repository copies unless their raw bytes are uploaded and verified separately. Where a spreadsheet's extracted text is included, it is not a substitute for the original workbook's formulas, formatting, or embedded data. This README does not claim the binary portion is fully migrated.

## Index

- [Asset and source manifest](asset-manifest.json)
- [Library mirror](library/)
