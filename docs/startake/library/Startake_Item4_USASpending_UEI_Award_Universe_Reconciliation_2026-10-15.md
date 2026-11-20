# Item 4 — USAspending Recipient-UEI Award-Universe Reconciliation

**Research date:** 15 October 2026 UTC  
**Claim:** STARTAKE-20261015-WORK-ITEM4-UEI-STARLINK-3a4f91  
**Status:** Bounded research and bill-integration pass complete; formal Item 4 and named-topic acceptance remain pending.  
**Scope:** Prime-recipient UEI C6M7C2FLKER5; action dates 2019-10-01 through 2026-10-15; USAspending award-summary and transaction records; exact-recipient post-filter; procurement/IDV/assistance classification; selected candidate screening and parent/child reconciliation.  
**Out of scope:** a nationwide or cross-government support census; state/local/foreign, tax, regulatory, indirect or off-budget support; valuation; invoice and disbursement audit; direct supplier receipts; assigning mixed SpaceX, Starshield or launch awards to Starlink without a reproducible source allocation.

## Finding

The public USAspending v2 search returned **347 award-summary rows** with exact recipient UEI C6M7C2FLKER5 and **2,043 exact-recipient action rows** across **348 distinct award identifiers**, within the specified action-date period and queried award-type groups. The API's award-data freshness endpoint reported 15 October 2026 as its last update date. These counts describe retrieved records; they are not totals of spending, appropriations, revenue, subsidy, public investment, service delivered, payment, or cash received. The API documents support award and transaction searches with fields and filters, but the data are not a recipient ledger of verified receipts.[^1][^2][^3]

The award-summary rows comprise 272 generated contract/IDV records (251 contract-award summaries and 21 IDV-parent summaries) and 75 financial-assistance records. Assistance records comprise 74 Universal Service Fund Schools and Libraries records and one NASA research-assistance record. A description screen selected 74 candidate records for closer inspection: 62 contain the literal term STARLINK, 11 use generic satellite/low-earth-orbit wording without that literal, and one expressly concerns STARSHIELD and was excluded from the commercial target. The 62+11+1 split is a text-screening result, not a determination that those records bought Starlink service or paid SpaceX. The remaining 273 award rows were not selected by the text screen; that does not prove they were unrelated.

No single all-award amount is reported. The dataset contains parent IDVs and child awards, mixed company work, assistance, different award types and non-equivalent monetary fields. Summing those fields would misstate scope and may double count. The only separately retained bounded procurement obligation result remains the prior exact-history cross-check for the three selected PIIDs, $8,688,665.26; it is not expanded by this pass and is not a nationwide or Starlink-only public-support total.

## Search method and reproducibility

USAspending's public API describes itself as a U.S. Department of the Treasury service for accessing federal spending data and identifies v2 as the current API in its live documentation.[^1] API contract documents specify POST award search at /api/v2/search/spending_by_award/, POST transaction search at /api/v2/search/spending_by_transaction/, and a recipient search endpoint. Award and transaction search return paginated result records for supplied filters and fields.[^2][^3][^4]

The recipient lookup POSTed keyword UEI C6M7C2FLKER5 to /api/v2/recipient/ with award type all and a 1,000-row limit, retrieved 2026-10-15T15:28:25.4276106Z. It returned two exact-UEI records for SPACE EXPLORATION TECHNOLOGIES CORP., with the same DUNS number 120406462 and recipient-level values C and P. The rolling 12-month amounts on this endpoint were not used. Recipient search output was used to confirm returned entity/level variants, not as a spending universe.

The award and transaction searches used recipient-search text C6M7C2FLKER5, action-date period 2019-10-01 through 2026-10-15, and separate mutually supported award-type groups because the API rejected combining all type groups in one request. Requests paginated at 100 rows, and results were screened again for the exact Recipient UEI field. Award summary requests retrieved 2026-10-15T15:19:22.1061997Z; the six award-type groups produced the following fuzzy-search rows/pages and exact-UEI rows:

| Award-type group | Search rows / pages | Exact-UEI rows |
|---|---:|---:|
| Contracts A, B, C, D | 263 / 3 | 251 |
| IDVs IDV_A, IDV_B, IDV_B_A, IDV_B_B, IDV_B_C, IDV_C, IDV_D, IDV_E | 22 / 1 | 21 |
| Loans 07, 08, F003, F004 | 0 / 1 | 0 |
| Grants 02, 03, 04, 05, F001, F002 | 0 / 1 | 0 |
| Other financial assistance 06, 10, F006, F007 | 74 / 1 | 74 |
| Direct-payment group 09, 11, -1, F005, F008, F009, F010 | 1 / 1 | 1 |
| **Total** | **360 / 8** | **347** |

The 13 false positives from fuzzy recipient-name/UEI matching were discarded by the exact-UEI field check. The result set contained 272 generated CONT rows and 75 ASST rows. Pagination was complete for the reported queries. USAspending /api/v2/awards/last_updated/ returned 10/15/2026.

The transaction searches used the same date window and exact-recipient post-filter, six award-type groups and 100-row pages. They were retrieved at 2026-10-15T15:22:36.7366005Z. The exact-recipient result set contains 2,043 rows, with 348 distinct award identifiers. The complete rows and IDV relationships were used only for classification and selected award-level/action-level reconciliation; no total across transaction amounts was calculated because records include parent/child structures, different award types and mixed SpaceX purposes.

| Transaction group | Exact-UEI action rows | Pages |
|---|---:|---:|
| Contracts | 1,364 | 14 |
| IDVs | 554 | 6 |
| Loans | 0 | 1 |
| Grants | 0 | 1 |
| Other financial assistance | 123 | 2 |
| Direct-payment group | 2 | 1 |
| **Total** | **2,043** | **25** |

## Record classification and limits

### Procurement awards and parent vehicles

The award-summary universe contains 251 contract-award records and 21 IDV parent records. Fifteen IDVs have child records in this filtered period, with 164 linked child award rows; six parent summaries had no child rows in the filtered search. The public IDV child-award endpoint was separately queried for parent key CONT_IDV_47QRAA21D007N_4732 on 15 October 2026 and returned 23 child awards. All 23 appear in the exact-UEI award result set.[^5] The parent IDV row is not added to the sum of its child orders. Parent/child identifier parsing was used for the wider family map; the direct child endpoint was independently checked only for this GSA vehicle.

The three PIIDs from the prior primary-record pass were independently matched in the current action set. Their five returned actions net to $8,688,665.26: 19AQMM25F1270, $8,209,572.00; 19AQMM25F1269, $348,513.86; and FA254126FB049, $130,579.40. Parent IDV 47QRAA21D007N has 52 transaction records in this date-filtered search with net transaction amount $0 and a $0 award amount; this parent is not added to child-order obligations. As documented in the prior report, action obligations are not evidence that an agency paid an invoice or SpaceX received cash.

Description screening found 62 literal STARLINK references and 11 generic satellite/LEO references among 74 candidate records. One candidate expressly states STARSHIELD and is excluded. Even a literal STARLINK description is a lead: the public award row alone does not establish service performance, acceptance, a payment, revenue recognition, or the final covered-business attribution. The 273 unscreened-by-text rows remain unclassified as to Starlink service. No mixed company, launch, Starshield or broad satellite award is apportioned.

### Financial-assistance records

The 74 USAspending Universal Service Fund — Schools and Libraries records have a combined award-summary Award Amount field of **$82,519.70**. Thirty-one rows have a nonzero Award Amount. Fifty-six rows report a non-null Total Outlays field, seven of those are nonzero, and their displayed Total Outlays sum to **$16,288.33**. Those are API award-summary fields; they are not a completed schedule of program payments to SpaceX and do not prove Starlink use, eligible-service status, a particular school or library beneficiary, or supplier receipts.

The exact-UEI transaction search returned 123 USF action rows: 76 positive and 47 negative transaction amounts, net **$98,719.70**. One action record for award identifier SL-2499057486 is not represented among the 74 USF award summaries retrieved; its A1 action is $16,200 dated 2025-07-15. The $16,200 difference between the 123-row transaction net and the 74-summary Award Amount field is reported as an unresolved cross-endpoint discrepancy, not added to the award summary as support or cash. The available records do not identify a Starlink service line, underlying application, subscriber beneficiary, service provider/payee on the relevant invoice, eligible monthly charges, completed reimbursement, or cash received by SpaceX.

One NASA CFDA 12.910 research-assistance summary reports an Award Amount of **$971,324.64** and Total Outlays of **$0**; its two action rows net to $971,324.64. Its award-type label is an other reimbursable, contingent, intangible, or indirect financial-assistance category. Nothing in this recipient-level record establishes that it funds Starlink commercial connectivity, and it is not attributed to the covered commercial business here.

The assistance categories are kept separate from procurement. No aggregate across the 74 USF summaries, NASA record, transaction actions, outlays and award fields is meaningful as a subsidy, receipt or public-support total. A recipient UEI can identify a legal entity while leaving the program, beneficiary, supplier and service application unresolved.

## Reconciliation findings and contrary readings

A reader might treat the presence of SpaceX's exact UEI in an assistance table as proof that all listed amounts are support to the company's Starlink business. The records do not support that inference: the UEI identifies a recipient record, while assistance attribution requires a link from program and approved application/service through intended beneficiary and provider/payee to an award action, outlay and payment status. The USAspending data in this pass do not supply those links for the E-Rate/USF entries.

A reader might alternatively treat the non-null Total Outlays summaries as completed payments to SpaceX. The reported field belongs to the award record and has no invoice-level payee or receipt corroboration in this pass. It cannot be promoted to cash received by the contractor. The reverse inference is also unwarranted: zero or null account/outlay values do not establish that no payment occurred. Actual receipts remain unknown.

A reader might classify the three procurement orders as subsidies because government agencies bought Starlink equipment or service. They are recorded as procurement awards; purchasing a public service is not by itself a grant or subsidy. Those orders show bounded obligations and contract purposes, not a cash receipt or offset to a potential acquisition price. The earlier three-PIID exact action reconciliation remains a separate bounded finding.

A reader might sum IDV parent and child rows, or total every USAspending monetary field as a single number. That would mix vehicle and order values, award amount and transaction action fields, assistance and procurement, and mixed or unrelated SpaceX work. Parent vehicles and child orders must be identified and counted once. No aggregate federal amount is produced.

## Legislative revision

Bill v0.6 already proposed a source-indexed award ledger, action-level reconciliation, separate assistance and procurement categories, differentiated outlays/obligations/appropriations/receipts, parent/child de-duplication, limits on allocating mixed SpaceX awards, and annual updates. The new records reveal a further specific attribution gap: a recipient UEI can return assistance records without connecting an underlying benefit or service to Starlink, its beneficiary, or a payment to SpaceX.

Bill v0.7 therefore adds proposed §302(d)(5). It requires an agency preparing the public ledger to reconcile each recipient-level assistance lead to the program, application/award, approved service/project, beneficiary, provider/payee, action history, outlays and payment status where source records are available. If the source record does not establish a covered-business connection, the entry remains an unresolved lead and no attributed amount may be reported. If payment is not established, no cash receipt may be reported and the amount stays unknown. Parent, child, action and program records remain cross-referenced and each obligation is counted once. This is proposed legislation, not current law, an administrative finding, or a promise that the underlying source records exist.

## Completion-criteria crosswalk

| Requirement | Evidence from this pass | Status and remaining gap |
|---|---|---|
| Practical Item 4 — Verified public-funding ledger | Exact-UEI award-summary/action search across supported award-type groups; 347 summary rows, 2,043 action rows; procurement/assistance classification; 23 GSA IDV children direct-endpoint check; prior three PIIDs cross-matched. | **Formal acceptance remains No.** This is a bounded federal recipient search, not the complete public-funding ledger. Receipts, exhaustive assistance allocation, non-federal and indirect support, and a verified Starlink-only total remain open. |
| Legal topic — Starlink-only historic funding ledger | Exact-recipient universe and keyword candidate screen provide additional research leads. | Named topic remains formally unchecked; 273 rows were not selected by the description screen; 11 generic satellite rows and the 62 literal matches need source-record service/payment validation. |
| Fiscal policy and economic impact | Keeps award amount, obligations, action amounts and displayed outlays in separate field/category contexts. | No enacted or available appropriation, budget score, account-wide allocation, economic multiplier, or actual recipient-receipt determination. |
| Public Investment, Reciprocity, and the Social Contract | Separates procurement from assistance, and keeps UEI-level assistance as unresolved without underlying-benefit/provider links. | No wealth attribution, grant/subsidy total, indirect-support valuation or causal public-return conclusion. |
| Work v2.2 coordination | Reservation v180 was independently read at v181; this report and bill are saved/read back before release. | Assignment closeout is recorded in tracker after deliverables and checksum checks. |
| Draft maturity and readiness | Proposed §302(d)(5) responds to an authenticated attribution gap. | Descriptive drafting maturity remains 29/50; original formal acceptance remains 0/7 practical and 0/36 named. Overall congressional readiness remains unestablished. |

## Sources and retrieval log

1. **USAspending API v2 landing page and overview:** https://api.usaspending.gov/ — Treasury explains that the public API provides federal award data and that API v2 is current.
2. **Spending by award contract:** https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/search/spending_by_award.md — POST /api/v2/search/spending_by_award/; filters, fields, limit and pagination.
3. **Spending by transaction contract:** https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/search/spending_by_transaction.md — POST /api/v2/search/spending_by_transaction/; action-level fields and pagination.
4. **Recipient contract:** https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/recipient.md — POST /api/v2/recipient/; recipient keyword/UEI search.
5. **IDV child-award contract:** https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/idvs/awards.md — POST /api/v2/idvs/awards/; child_awards request for CONT_IDV_47QRAA21D007N_4732 returned 23 children.
6. **USAspending award data last-updated endpoint:** https://api.usaspending.gov/api/v2/awards/last_updated/ — returned {"last_updated":"10/15/2026"} on retrieval.
7. **Recipient records endpoint:** https://api.usaspending.gov/api/v2/recipient/ — keyword UEI search; retrieved 2026-10-15T15:28:25.4276106Z.
8. **Award-summary query endpoint:** https://api.usaspending.gov/api/v2/search/spending_by_award/ — six supported award-type requests, pagination to completion; retrieved 2026-10-15T15:19:22.1061997Z.
9. **Action search endpoint:** https://api.usaspending.gov/api/v2/search/spending_by_transaction/ — six supported award-type requests, pagination to completion; retrieved 2026-10-15T15:22:36.7366005Z.
10. **Prior exact three-PIID reconciliation:** [USAspending Transaction API Primary-Record Follow-Up](Startake_Item4_USASpending_Transaction_API_Primary_Record_Followup_2026-10-15.md), Library ID libfile_bd2589412f9c819198970f5e3cde9b42.
11. **Supporting screen:** [Candidate awards CSV](Startake_Item4_UEI_Starlink_Candidate_Awards_2026-10-15.csv), containing exact-UEI candidate rows and the reason each row was selected; it does not certify Starlink attribution or cash receipt.
12. **Requirements and workflow:** current canonical STARTAKE tracker, active Workflow v2.2, and The Starlink and Stripes Act Completion Checklist v2.0.

[^1]: The API's public documentation describes v2 as the current API and states that Treasury supplies public award-spending data. It does not certify the completeness or audit status of each individual record.
[^2]: Award endpoint: POST /api/v2/search/spending_by_award/; supplied filters and selected fields with limit 100 and page-number pagination.
[^3]: Transaction endpoint: POST /api/v2/search/spending_by_transaction/; supplied recipient-search text and action-date period, selected action fields, and paginated.
[^4]: Recipient search was fuzzy by keyword and therefore exact Recipient UEI post-filtering was applied to award and transaction rows. Thirteen award-summary false positives were removed.
[^5]: Generated award IDs were parsed for the broad parent/child map; the /api/v2/idvs/awards/ child-award endpoint was directly checked for the GSA 47QRAA21D007N parent only.