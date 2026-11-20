# STARTAKE Consistency Erratum — M04.09 Crosswalk and Workflow Digest

**Date:** 2026-10-19 UTC  
**Claim:** STARTAKE-20261019-WORK-CONSISTENCY-M04-09-ERRATUM-c7a14d  
**Status at report creation:** The correct source metadata is verified. Crosswalk and dashboard integration remains in progress under the reserved claim. This report makes no new legal or factual finding about Starlink.

## Purpose and disposition

This erratum addresses two metadata defects while preserving the historical artifacts that contain them:

1. Crosswalk Markdown v1.16's M04.09 narrative has four literal template placeholders for the audit path, Library ID, byte count, and SHA-256. The saved audit, its v1.16 CSV row, the tracker receipt, and Crosswalk v1.17 identify the correct report metadata. Crosswalk v1.18 will add a dated correction overlay and leave all v1.17 and earlier Markdown history unchanged.
2. Two historical tracker reservation receipts recorded an incorrect SHA-256 for Consistency Workflow v1.0. The baseline field under the M04.08 Reliability and redundancy reservation and the baseline/source-custody field under the M04.09 Allocation in scarcity reservation contain the same transposition. Those saved history entries remain unedited; this erratum and the current tracker receipt state the verified digest.

The M04.09 report itself is unchanged. The issue resolutions concern the accuracy and discoverability of saved references, not the report's research findings.

## Verified source records

The M04.09 audit is saved at:

- Path: /Startake/Starlink_Item6_Moral_M04_09_Allocation_in_Scarcity_Audit_2026-10-19.md
- Library ID: libfile_632bd577ea6c8191b53e40f8220b3abb
- Library version: 0
- Size: 13,805 bytes
- SHA-256: 883cf6ee67e057f88a1fb0b9082f62fc85c4a2e722f408e38eea02a82effee7c

A fresh materialization was independently byte-checked. The current v1.17 CSV has 311 data rows and 311 unique preserved source labels. Its M04.09 row already carries the correct report path, Library ID, size, and digest. The row also retains the original subcategory text, custody status, unchecked acceptance fields, and bounded result. The CSV's existing row values require no change.

The current saved Consistency Workflow v1.0 is Library ID libfile_24fa6dd38c4481919375a3026ed06a62, version 0, 12,206 bytes. Fresh materialization SHA-256 is:

6c31bf961e4d7b31ea20b014ae030290e4996319b3022b759347bff3b04e8bcf

The incorrect digest appearing in the two historical tracker receipts is:

6c31bf961e4d7b31ea20e014ae030290e4996319b3022b759347bff3b04e8bcf

The values differ by one character. The current workflow file's bytes and version were not changed.

## Issue records

**Existing issue:** STARTAKE-ISSUE-CROSSWALK-M04-09-PLACEHOLDERS-20261019. Crosswalk v1.17 flags the inherited placeholders and preserves the v1.16 block. The v1.18 overlay supplies the verified M04.09 receipt fields while retaining the old block as history. This issue closes only after v1.18 is independently read back and the dashboard and tracker record the correction.

**Receipt issue:** STARTAKE-ISSUE-TRACKER-CONSISTENCY-WORKFLOW-SHA-20261019. Competing propositions are the incorrect digest in the two historical tracker reservation receipts versus the digest of the current saved Workflow v1.0 bytes. The freshly materialized file supports the latter. The error is a receipt-metadata discrepancy, not a defect in the workflow's content or in the M04.08/M04.09 research. The new erratum and current tracker state resolve the discrepancy while preserving both original tracker entries.

## Reservation and baseline receipt

Owner: STARTAKE Codex Work / current conversation. Unique claim token: c7a14d. The claim was conditionally reserved against actual tracker version 345 and saved as version 346, then freshly materialized and compared byte-for-byte. The v345 tracker is preserved as an exact suffix. Reservation candidate SHA-256: c92546b2e2826bb21d2f12c5997dc876761766f175e39416cb1512b489054348; 569,639 bytes.

Pinned baselines inspected before reservation:

| Artifact | Library ID | Current version | Bytes | SHA-256 |
|---|---|---:|---:|---|
| Research Workflow v2.2 | libfile_c61da08367148191ad4e5d76ce7aeff0 | 0 | 7,613 | b08372363ec1cb7ff8364a72cecfc2484071c2f86042446c3535be120b445d31 |
| Consistency Workflow v1.0 | libfile_24fa6dd38c4481919375a3026ed06a62 | 0 | 12,206 | 6c31bf961e4d7b31ea20b014ae030290e4996319b3022b759347bff3b04e8bcf |
| Canonical tracker | libfile_590fd34e579c819189c02261fe34c456 | 345 | 564,794 | 4bf9a4f5f9654316a3f6d68a8a361a8a7687b9100236675d8f60f5736c2f0f5a |
| Completion checklist/dashboard | libfile_cc7518a16af48191815df91c0bc809da | 90 | 239,303 | c157ea05edd8392d706ad3039f3f1553c3d8bc7ad4a48c6a40f15cdb74fd239f |
| Crosswalk Markdown v1.17 | libfile_a2b64e9b16e881919334ff8139b5bc64 | 3 | 70,156 | 0d39a5a52dab6291e6ebdf9e6fea7068fd40feb28f081984f3af89285a25a936 |
| Crosswalk CSV v1.17 | libfile_811f8898813c8191abc137ad62f5e35c | 2 | 435,768 | 6b7bbd0d839d41803feb4c3476ecc681eaf992df3d8cdeb13d34649af9613252 |
| M04.09 audit | libfile_632bd577ea6c8191b53e40f8220b3abb | 0 | 13,805 | 883cf6ee67e057f88a1fb0b9082f62fc85c4a2e722f408e38eea02a82effee7c |

The applicable workflows, live ownership/release state, current checklist issue, Crosswalk v1.17, its M04.09 CSV row, and the M04.09 report were refreshed and inspected. No new legal-source research was conducted. The report remains direct official-source review, not Legal Data Hunter verified or counsel-reviewed.

## Scope, protected fields, and checks

The authenticated original requirement remains “Prioritization when bandwidth, capacity, or equipment is constrained.” No original wording, source/custody field, proposed-section mapping, substantive-evidence status, or formal-acceptance field is changed. The 311-row scope schedule is retained. The paired v1.18 CSV is an exact-byte refresh of v1.17 for release alignment; no data row or field is authorized to change.

Protected outputs and status: Bill v1.14 and workbook v0.4 remain unchanged; Item 1 remains excluded; initial coverage stays 7/7; formal acceptance stays 0/7 practical and 0/36 named; all 311 proposed scopes remain outside formal acceptance; descriptive maturity stays 29/50; congressional readiness remains unestablished. No professional sign-off, formal verification, third-party contact, or publication is represented.

Checks completed before package integration:

- Fresh baseline materialization confirmed file IDs, actual Library versions, sizes, hashes, and local version attributes.
- The M04.09 report's exact bytes and digest matched the saved receipt.
- Crosswalk v1.17 has exactly 311 data rows and 311 unique preserved source labels; its M04.09 row already contains the correct audit metadata.
- Crosswalk v1.17 has one occurrence of each of the four specified placeholders, all in the preserved v1.16 M04.09 narrative; its top-level v1.17 issue flag is present.
- The current dashboard v90 reflects the open issue and unchanged formal gates.
- The tracker v345 current receipt says the M04.08 claim is released and directs this separately controlled erratum; the new reservation readback verified tracker v346 and exact preservation of v345.

The remaining integration checks and final saved revisions are recorded in the live canonical tracker after the dependent crosswalk and dashboard writes. A byte match verifies persistence and preservation only; it is not evidence of legal sufficiency, package-wide factual validation, or professional review.

## Final status boundaries

This erratum does not change the M04.09 allocation analysis, decide any provider or satellite-service classification, establish actual Starlink allocation practices, alter a Bill provision, or close a formal acceptance criterion. It corrects traceability and metadata while leaving substantive conclusions and review limits as previously reported.