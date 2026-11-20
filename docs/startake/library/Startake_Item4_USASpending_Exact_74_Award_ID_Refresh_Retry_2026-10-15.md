# Item 4 — USAspending exact 74-award refresh

**Assignment:** STARTAKE-20261015-WORK-ITEM4-USAS-REFRESH-74-a941cd  
**Status:** Research pass complete; current USAspending refresh verified; claim release and dashboard closeout pending.  
**Owner:** Sole STARTAKE inheritor / Codex Work.  
**Research and retrieval date:** 15 October 2026 UTC.  
**Workflow:** v2.2. The reservation was conditionally committed from actual tracker CAS 198 and independently verified at v199. A pre-query identifier-format clarification was conditionally committed from actual v199 to v200 and independently read back before external source retrieval.

## Question and scope

Can the saved 74-record USAspending award-summary cohort be refreshed from the current official source after the prior exact-ID batch returned HTTP 503, and do the returned award keys and summary fields agree with the saved record-level crosswalk?

This assignment queried only the 74 exact USAspending Award ID values present in the saved v0.4 crosswalk. It did not repeat the completed cross-system join or broaden to a recipient census. It does not establish all Federal support associated with Starlink.

## Sources and method

The official USAspending API endpoint index lists the Advanced Award Search route as a POST endpoint; its award retrieval route accepts GET for one award identifier. Documentation: [USAspending API endpoints](https://api.usaspending.gov/docs/endpoints/) and [API introductory tutorial](https://api.usaspending.gov/docs/intro-tutorial/).

The exact search route was https://api.usaspending.gov/api/v2/search/spending_by_award/. The query used award_ids from the saved USAspending_Award_ID column, award-type codes 06, 10, F006 and F007, page 1, limit 100, ascending sort by Award ID, and fields Award ID, Recipient UEI, Recipient Name, CFDA Number, Award Amount, Total Outlays, and Description. Four sequential POST requests contained 20, 20, 20, and 14 IDs. Request and response bodies, status codes, and retrieval timestamps are preserved in the API response appendix.

The saved prior refresh-attempt JSON contains the same 74 IDs with literal quote characters around each value. The authoritative saved crosswalk contains 74 unique unquoted Award ID values; removing only those outer serialization wrappers from the earlier request values yields the same ID set. This pass used the unquoted values from the crosswalk. The formatting difference is recorded as a request-construction issue; it is not evidence that the quote wrappers caused the earlier HTTP 503.

The official USAspending awards last-updated endpoint, https://api.usaspending.gov/api/v2/awards/last_updated/, returned 10/15/2026. It was queried from 2026-10-15T17:44:37.648Z through 2026-10-15T17:44:40.795Z UTC.

## Verified results

All four POST batches returned HTTP 200 and the expected row counts. The API returned 74 rows, with 74 unique Award IDs; the returned ID set exactly equals the submitted set. There were no missing, extra, or duplicate IDs.

| Batch | IDs submitted | Rows returned | HTTP status | Retrieved UTC |
|---:|---:|---:|---:|---|
| 1 | 20 | 20 | 200 | 2026-10-15T17:41:00.871108+00:00 |
| 2 | 20 | 20 | 200 | 2026-10-15T17:41:01.818599+00:00 |
| 3 | 20 | 20 | 200 | 2026-10-15T17:41:02.749135+00:00 |
| 4 | 14 | 14 | 200 | 2026-10-15T17:41:03.656485+00:00 |

All 74 records report recipient UEI C6M7C2FLKER5, recipient name SPACE EXPLORATION TECHNOLOGIES CORP., and CFDA Number 32.004. The prior v0.4 crosswalk was compared record by record on five fields:

| Field | Records compared | Identical | Mismatched |
|---|---:|---:|---:|
| Award ID | 74 | 74 | 0 |
| CFDA Number | 74 | 74 | 0 |
| Award Amount | 74 | 74 | 0 |
| Total Outlays | 74 | 74 | 0 |
| Description | 74 | 74 | 0 |

The refreshed values reproduce the prior crosswalk values exactly after numeric normalization. The new [v0.5 80-row crosswalk](Startake_Item4_USAC_USASpending_ERate_Crosswalk_v0.5_2026-10-15.csv) preserves all 80 original records and fields, adds the fresh recipient and query metadata for the 74 exact-ID rows, and leaves the six rows without a saved USAspending Award ID marked as not queried by this bounded assignment. It does not treat those six rows as proof that USAspending has no related record.

Within this exact 74-award query only, returned Award Amount values have 30 positive and 44 zero entries, with 0 null entries; the reported nonnull field values sum to USD 82,519.70. Returned Total Outlays values have 7 positive, 49 zero, and 18 null entries; the reported nonnull values sum to USD 16,288.33. Zero and null remain distinct. These are sums of the specified USAspending award-summary fields for this saved cohort, not a complete Starlink public-support total, not provider payment evidence, and not transaction-level proof of cash received by SpaceX.

The prior cross-system cohort comparison remains unchanged: the 74-row USAspending summary cohort had 68 exact suffix joins to the queried 74 current-funded USAC FRNs, six USAspending IDs unmatched to that filtered set, and six current-funded USAC FRNs absent from the saved summary cohort. This refresh does not resolve or relabel those differences.

## Legislative implication

No bill amendment is supported by this pass. Integrated Working Bill v1.0 already requires the public-funding schedule to state source coverage, data-as-of and retrieval dates, attribution method, known gaps and limits (§302(d)(1)); preserve recipient and award-summary fields (§302(d)(2)); distinguish award amounts, outlays and verified cash receipts (§302(d)(3)); reconcile program, beneficiary, provider, payee, invoice and payment status (§302(d)(5)); and record persistent source identifiers, join keys/methods, exact or unresolved link status, unmatched and duplicate/one-to-many records, and distinct null/zero/unavailable states (§302(d)(6)). This source refresh confirms the existing reproducibility controls are adequate for the observed issue; it does not prove cash receipt or close the wider public-funding gap.

## Deliverables and status

- Refreshed 80-row crosswalk: Startake_Item4_USAC_USASpending_ERate_Crosswalk_v0.5_2026-10-15.csv, SHA-256 af84e5778593eb7176cdc2482d6a52f4ebcc1e08e48bf45f9831e17c5369dce1.
- Complete four-batch API request/response appendix: Startake_Item4_USASpending_Exact_74_Award_ID_Refresh_API_Responses_2026-10-15.json, SHA-256 afbe2bd569fabe5cf933ea34670cff761f2408ddc8e404dcc761a5b0e931dc24.
- QA manifest: Startake_Item4_USASpending_Exact_74_Award_ID_Refresh_QA_2026-10-15.json, SHA-256 ef7f359767b3247706632559586eaa3857dc85a545fc1e191c365f64e6cd01b7.
- Prior 74-ID refresh failure and source records remain preserved; the existing Bill v1.0 is unchanged at 31 numbered sections.

This assignment does not certify Item 4 or any named topic. Initial research coverage remains 7/7; formal practical-item acceptance remains 0/7; formal named-topic acceptance remains 0/36; the 311 proposed scope texts remain unaudited; descriptive drafting maturity remains 29/50 (58%); overall congressional readiness remains unestablished. Payment/remittance proof, a complete commercial-only public-funding ledger, actual service receipts and operating costs, populated valuation/compensation/appropriation schedules, commercial title/permission records, source-complete original criteria review, and independent professional review remain open.

## Saved source files

- [USAspending API endpoint index](https://api.usaspending.gov/docs/endpoints/)
- [USAspending API introductory tutorial](https://api.usaspending.gov/docs/intro-tutorial/)
- [USAspending award-summary endpoint](https://api.usaspending.gov/api/v2/search/spending_by_award/)
- [USAspending award-data last-updated endpoint](https://api.usaspending.gov/api/v2/awards/last_updated/)
- Prior report: Startake_Item4_USASpending_USAC_CurrentFunded_RecordLevel_Crosswalk_Audit_2026-10-15.md (Library ID libfile_bdfb5eb11c788191ba941c2a677f9a71).
- Prior detailed crosswalk: Startake_Item4_USAC_USASpending_ERate_Crosswalk_v0.4_2026-10-15.csv (Library ID libfile_004683ddd44081919fc8877a474d00fd).
- Proposed bill: The_Starlink_and_Stripes_Act_Integrated_Working_Bill_v1.0_2026-10-15.md (Library ID libfile_d738eaa0f1648191ac0f8ad8446e2243).