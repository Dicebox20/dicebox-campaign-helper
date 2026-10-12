# Full tracked-file inventory — frozen 2026-10-12 source snapshot

**Repository:** Dicebox20/dicebox-campaign-helper  
**Canonical baseline:** `main` tree `1137241a7df431a5cc4bc775ab56dcd283e1db29`  
**Draft migration snapshot:** commit `912ae844d9d0f26a663f34fb6342c5f5ebb6b057`, tree `912ae844d9d0f26a663f34fb6342c5f5ebb6b057` used by the Git-tree endpoint (Git may resolve the supplied commit/ref to its tree).  
**Snapshot file count:** 12,302 tracked blobs.  
**Baseline count:** 10,981 tracked blobs.

## Branch reconciliation totals

| Comparison | Files |
|---|---:|
| Identical blob in main and draft | 10,959 |
| Modified in draft compared with main | 22 |
| New in draft | 1,321 |
| Present in main but absent in draft | 0 |
| **Total draft snapshot files** | **12,302** |

## Physical inventory

Fourteen CSV files, `FILES-01.csv` … `FILES-14.csv`, sorted by descending date hint then category and path. Each row includes:

`path`, `git_blob_sha`, `main_blob_sha`, `bytes`, `category`, `branch_comparison`, `path_date_hint`.

Part sizes: parts 01–13 contain 900 files each; part 14 contains 602 files. **Every row is file metadata, not a semantic verification of its content.**

## Date-confidence rule

The `path_date_hint` column is derived from a valid `YYYY-MM-DD` or `YYYYMMDD` date appearing in the path. It is **not** an implementation, approval, modification, or deployment timestamp. Where multiple date tokens exist, the latest valid date is selected as an index hint only. The common archive parent `project-archive/companion-workspace-2026-10-12/` is stripped before extracting the hint, to avoid falsely dating all historical files October 12.

- 718 files have at least one date in their effective path.
- **11,584 files do not have a date hint** and remain date-unresolved; do not invent one.
- Dated 2026-10-09: 88; 2026-10-08: 142; 2026-10-07: 94; 2026-10-03: 113; 2026-09-26: 117. These are *path-hint counts*, not confirmed implementations.
- The 2026-10-12 archived companion snapshot is a snapshot date, not its contents' implementation date.
- Verified workflow adoption milestones are maintained separately in [Implementation chronology](../IMPLEMENTATION-CHRONOLOGY.md).

## Directory sizes (files, draft snapshot)

`work`: 8,573; `outputs`: 1,520; `project-archive`: 1,159; `tests`: 311; `apps`: 217; `packages`: 187; `tools`: 100; `docs`: 97; `assets`: 53; `database`: 32; additional source/config folders and root files complete the 12,302.

## How to use

1. Search CSV by exact relative path or Git blob SHA for identity.
2. Use `branch_comparison` to prioritize the 22 changed and 1,321 new files.
3. Use `path_date_hint` only as a first pass to locate dated source material.
4. Open the relevant original source, check its status/approval provenance and runtime/test receipt.
5. Promote no archival snapshot or draft file into current rules on the basis of a newer filename or this inventory alone.

## Integrity and scope

All 14 inventories were generated from one Git-tree snapshot, not successive moving-head scans. The catalog files created **after** the frozen SHA are intentionally not recursively included in their own source inventory. For any later repository mutations, regenerate a new dated inventory rather than editing this one to imply it represented a later head. The Git-tree listing confirms tracked paths and Git blob identity, not the external archive's SHA-256 hashes; archive digest verification remains outstanding.

See [high-risk modified files](../HIGH-RISK-DIFFS.md) and [canonical workflows](../CANONICAL-WORKFLOWS.md).
