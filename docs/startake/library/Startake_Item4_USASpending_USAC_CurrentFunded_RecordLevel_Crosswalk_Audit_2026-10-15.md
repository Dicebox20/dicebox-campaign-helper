# Item 4 — USAspending award-ID to current-funded USAC FRN record-level crosswalk audit

**Research date:** 15 October 2026 UTC  
**Assignment:** STARTAKE-20261015-WORK-ITEM4-RECJOIN-74-7e1b3c, reserved and independently read back at canonical tracker v194 before new source retrieval.  
**Question:** Whether every USAspending E-Rate summary award ID in the saved cohort has an exact record-level match in the current-funded USAC FRN set for Space Exploration Technologies Corp. SPIN 143053761.

## Finding

The live official USAC query returned **74 rows and 74 unique current-funded FRNs**. The 74 USAspending award-summary IDs preserved in the prior official-source cohort were tested one by one by comparing the numeric suffix after `SL-` to each USAC `funding_request_number`. The check produced **68 exact record-level joins**, **6 summary IDs with no exact match in the filtered current-funded set**, and **6 current-funded USAC FRNs absent from the 74-ID summary cohort**. The attached 80-row CSV lists all 74 award IDs individually, every verified pair, both unmatched sets, and the reverse-set-difference rows. The result follows from explicit identifiers, not from matching totals.

This is a program-record identity result only. It does not establish service delivery, eligible use, the final payee, provider payment, SpaceX cash receipt, or total Starlink public support. Payment and cash-receipt fields remain unknown here.

## Record-level result

**Verified exact pairs:** 68 of 74 USAspending summary award IDs equal one unique current-funded USAC FRN after removal of the `SL-` prefix. Each of those 68 pairings is present as its own row in the attached crosswalk CSV with the original award ID, suffix, exact FRN, source-set match result, join rule, and source retrieval time.

**USAspending summary IDs unmatched to the filtered current-funded set:**

- `SL-2499028163`, `SL-2599016356`, `SL-2599016877`, `SL-2599016895`, `SL-2599029317`, `SL-2599045223`.

**Current-funded USAC FRNs unmatched to the 74 summary award IDs:**

- `2499031960`, `2499042130`, `2499050062`, `2499056696`, `2499056732`, `2499057486`.

The 6 summary IDs absent from the selected current-funded set must not be described as having no USAC record of any kind. The preserved v0.4 expanded crosswalk contains exact-suffix historical/current USAC rows for those six: two are Funded after the provider changed from SpaceX SPIN 143053761 to OrbitLink or Ronan, and four are Cancelled. Those rows are separately identified as prior expanded-history evidence in the CSV; they are outside the current-funded SpaceX-SPIN set queried here.

The 6 USAC-only rows mean no same-suffix identifier exists in the 74 award-summary cohort. The preserved v0.4 crosswalk records non-summary USAspending detail or action identifiers for these FRNs (five detail/transaction histories and one action-only record). Those earlier records are not summary-award matches and are not counted as such in this audit.

## Method and source status

1. **USAC current-funded set — refreshed live.** Queried the official raw FCC Form 471 / FRN Status resource `qdmp-ygft` with `epc_organization_id='143053761' AND form_version='Current' AND form_471_frn_status_name='Funded'`, ordered by `funding_request_number`, limit 1,000. HTTP status was 200. Retrieval time was 2026-10-15T16:59:44.683229+00:00. The response contained 74 rows and 74 distinct FRNs; every row returned the requested provider SPIN, version and status. USAC's public tool page says this view uses the most recent application version and was updated 12 October 2026.
2. **USAspending summary cohort — prior official result reused; refresh unavailable.** The input list is the 74 unique `USAspending_Award_ID` values in the preserved 80-row v0.4 crosswalk (Library ID `libfile_004683ddd44081919fc8877a474d00fd`; input SHA-256 `2ffd579ca6bb463072efdc3612094f6bb7792398952e5467b2ebfee21c64dd66`). The prior [USAC E-Rate application and payment-link audit](Startake_Item4_USAC_Erate_USF_Application_and_Payment_Link_Audit_2026-10-15.md) documents the USAspending v2 recipient-UEI/Schools and Libraries summary query and its 74-row result. A fresh exact-award-ID request to the official `spending_by_award` API returned HTTP 503 for the 74-ID batch. No result rows were returned. The request and response are preserved in the attached refresh-attempt JSON. Accordingly, the old saved USAspending ID cohort was not silently replaced or treated as newly refreshed.
3. **Join rule.** For every one of the 74 award IDs, remove only the exact leading text `SL-` and compare the remaining string with every row's USAC `funding_request_number`. No applicant-name, amount, date, fuzzy, or count-based join was used. The reverse set difference was computed for the full live USAC FRN set.
4. **Reproducibility.** The full live USAC response snapshot is in the [USAC source JSON](Startake_Item4_USAC_Current_Funded_FRN_Source_Snapshot_2026-10-15.json) with its query and hash; the failed USAspending attempt payload/response is in the [USAspending refresh-attempt JSON](usaspending_74_id_refresh_attempt_20261015.json). The full comparison is in the [80-row crosswalk CSV](Startake_Item4_USASpending_USAC_CurrentFunded_RecordLevel_Crosswalk_2026-10-15.csv). The [QA summary JSON](qa_summary.json) records reproducibility counts and the SHA-256 digests for the saved inputs and outputs. The 80-row output includes 74 summary-award rows and 6 additional current-funded USAC-only rows. The values `unmatched`, null, zero, and unavailable are not collapsed.

## Existing Act and limited legislative revision

Proposed §302(d)(2) already requires award-level identifiers, and §302(d)(5) requires cross-references for related parent, child, action and program records. But it does not explicitly require a source-system-to-source-system schedule to expose each identifier, join key, method, result, unmatched side, or duplicate/one-to-many link. Aggregate counts can conceal that distinction. This audit therefore adds proposed §302(d)(6) in [Integrated Working Bill v1.0](The_Starlink_and_Stripes_Act_Integrated_Working_Bill_v1.0_2026-10-15.md): every cross-source reconciliation must show each persistent source identifier, join method and exact/nonexact/unresolved/unmatched result; separately list unmatched, duplicate and one-to-many records; and distinguish null, zero and unavailable fields. The amendment is a reporting safeguard. It creates no inference of payment, no acquisition power, no money, and no official score.

Bill v1.0 retains 31 numbered sections. Only §302 changes from v0.9, by adding paragraph (d)(6); the other 30 operative sections are byte-identical. No financial amount, score, or receipt claim was added.

## Limits, status and next gaps

- A direct refresh of the 74 USAspending summary rows is blocked by HTTP 503; the exact IDs used are from the prior saved official-source cohort and are not represented as freshly revalidated here.
- The six summary-ID no-matches are only no-matches to the filtered **current funded SPIN 143053761** set. The expanded historic crosswalk records two currently funded records under different providers and four cancelled records.
- The six unmatched current-funded FRNs may have separate USAspending transaction/detail evidence; the previous crosswalk records those IDs, but this assignment did not re-test their transactions.
- No supplier bank/remittance record, final provider cash receipt, service-use proof, or complete public-funding census was reviewed. Do not infer zero payment or no service from these joins.
- Initial coverage remains 7/7. Formal acceptance remains 0/7 practical and 0/36 named. The 36 topic frameworks and 311 proposed scope texts remain recovered but unaudited. Drafting maturity remains 29/50; overall congressional readiness remains unestablished.

**Next useful work:** Retry the exact USAspending award-summary refresh through a genuinely independent official route when available; then resolve payment-level evidence only where an authoritative public source exposes it. Continue to keep commercial-only attribution and all unverified receipts unresolved.

## Sources and data integrity

- [USAC E-Rate FRN Status Tool FY2016+](https://opendata.usac.org/E-Rate/E-Rate-FRN-Status-Tool-FY2016-/8xzh-ytkh) and [raw USAC resource `qdmp-ygft`](https://opendata.usac.org/resource/qdmp-ygft.json)
- [USAspending v2 `spending_by_award` API contract](https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/search/spending_by_award.md) and [official endpoint](https://api.usaspending.gov/api/v2/search/spending_by_award/)
- Prior [Item 4 USAC E-Rate application and payment-link audit](Startake_Item4_USAC_Erate_USF_Application_and_Payment_Link_Audit_2026-10-15.md), Library ID `libfile_186da839568c819189c02261fe34c456`
- Prior [80-row USAC/USAspending crosswalk v0.4](Startake_Item4_USAC_USASpending_ERate_Crosswalk_v0.4_2026-10-15.csv), Library ID `libfile_004683ddd44081919fc8877a474d00fd`

USAC raw snapshot SHA-256: `96294e62fc49fa7c8cc45cfbb66c34c9cc8a12b5f736a6211b44b94880d17d64`.  
USAspending refresh-attempt JSON SHA-256: `ede69805eeb09d7d5eb971257b0c9acaba53c45639e1a3f20d657a553c6e51d2`.  
Record-level crosswalk CSV SHA-256: `d12109fcd2b10850254c51063f129fe39da102c258c4b4efdbb5810ac2579b87`.