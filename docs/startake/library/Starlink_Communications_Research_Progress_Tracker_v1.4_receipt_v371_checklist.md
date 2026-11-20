# Canonical tracker snapshot — split-file preservation

The original source file `/Startake/Starlink_Communications_Research_Progress_Tracker_v1.4_receipt_v371_checklist.md` was 722,008 bytes and 3,002 lines in the source Library snapshot. To avoid silently truncating it during migration, its exact text is preserved in ordered line chunks under `_large-file-parts/`:

1. `Starlink_Communications_Research_Progress_Tracker_v1.4_receipt_v371_checklist.part-001.txt` (source lines 1–1,000)
2. `Starlink_Communications_Research_Progress_Tracker_v1.4_receipt_v371_checklist.part-002.txt` (source lines 1,001–2,000)
3. `Starlink_Communications_Research_Progress_Tracker_v1.4_receipt_v371_checklist.part-003.txt` (source lines 2,001–3,000)
4. `Starlink_Communications_Research_Progress_Tracker_v1.4_receipt_v371_checklist.part-004.txt` (source lines 3,001–3,002)

Concatenate the four part files in numeric order to reconstruct the source text. This file is a pointer, not a byte-identical copy of the original. The canonical Library file remains the live source of truth.
