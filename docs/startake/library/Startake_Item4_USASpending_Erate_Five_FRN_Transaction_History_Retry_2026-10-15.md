# Item 4 — USAspending transaction-history reconciliation for five E-Rate FRNs

**Claim:** `STARTAKE-20261015-WORK-ITEM4-ERATE-TXN-5-9fc042`  
**Retrieved:** 15 October 2026 UTC  
**Status:** Bounded research pass complete; formal verification pending  
**Purpose:** Resolve the five current-funded USAC FRNs that lacked same-suffix USAspending award-summary rows by testing the official award-detail and transaction-history endpoints. This report supplements, and does not replace, the 74-row application/payment audit and 80-row crosswalk v1.

## Conclusion

All five current-funded USAC FRNs now have a verified same-suffix USAspending award identity and a per-award transaction-history response. USAspending award-detail responses echoed the generated award key and the public `SL-{FRN}` FAIN, classified each record under CFDA 32.004, and returned the corresponding beneficiary-level recipient. The five therefore fill the transaction-history side of the six formerly unmatched current-funded FRNs; the sixth, `SL-2499057486`, was linked in the preceding E-Rate audit. Together with the 68 exact same-suffix award-summary joins, all 74 current-funded USAC FRN identifiers are now linked to a USAspending summary or award/action record. Six USAspending summary-only identifiers still have no same-suffix FRN in the current-funded USAC extract.

The five award histories contain five A1 actions totaling **$32,066.50** and three later EX actions totaling **−$5,269.50**, for a net of **$26,797.00**. USAspending per-award detail reports $26,797.00 in total obligation and $26,797.00 in total outlay. The five USAC commitments total **$32,194.00**. The 30 associated applicant BEAR invoice lines total **$26,797.00 requested and approved** and carry status `SENT TO USAC`. These field totals reconcile numerically, but their meanings differ: USAC commitments, applicant reimbursement requests/approvals, USAspending award actions, and USAspending award-level outlays are separate records. None is transaction-level evidence that SpaceX received the money.

The USAspending award recipients are applicant-side entities, not SpaceX. For the two Hopi Public Library FRNs, the USAspending recipient is County of Navajo while USAC identifies Hopi Public Library as the applicant/beneficiary. The available records establish the award/FRN/service-provider link but do not explain that legal or fiscal relationship. The USAspending summary search and exact-SpaceX-UEI action search missed these five because the award recipient UEIs differ from SpaceX’s UEI; exact recipient-UEI searches alone are therefore incomplete for E-Rate support.

## Method and endpoint results

The official USAspending API contract documents POST `/api/v2/search/spending_by_transaction/` for filtered action records and POST `/api/v2/transactions/` for an individual award’s transaction history. The latter accepts a generated award identifier or database surrogate; a public `SL-…` display ID alone is not a usable per-award key. Search-filter documentation describes `award_ids` and the quoted exact-match form. See Sources S1–S3.

The following exact-award-ID transaction-search request returned HTTP 503. A previous request for these five IDs also returned HTTP 503. A separate, valid recipient-level action search succeeded: `award_type_codes=["06"]`, `recipient_search_text=["C6M7C2FLKER5"]`, action-date period `2019-10-01`–`2026-10-15`, 100 rows/page, sorted by Action Date ascending. Both pages returned 123 rows; exact post-filtering found 123 rows for UEI `C6M7C2FLKER5` and CFDA `32.004`, but none of the five FRN suffixes. This was not proof that no actions exist: the five award-detail recipients have different UEIs from SpaceX.

For each target, the per-award transaction endpoint queried a generated-ID candidate of form `ASST_NON_SL-{FRN}_027`, based on the generated IDs returned for other CFDA 32.004 records. Each award-detail response independently echoed that generated ID as `generated_unique_award_id`, returned `fain=SL-{FRN}`, type `06`, CFDA `32.004`, recipient name/UEI, and award totals. That readback validates each generated-key query; it is not an inferred join based only on a matching count. The transaction results also contain action IDs beginning `ASST_TX_2700_SL-{FRN}_-NONE-_32.004_…`.

Direct `/api/v2/transactions/` queries using public display IDs returned HTTP 200 with empty results for all five and for two controls: one transaction-only award with a previously verified action and one same-suffix summary-match award. Those empty results were not treated as nonexistence; the generated-ID route was required. All five generated-ID histories returned HTTP 200 with complete single-page results. Award-detail GET requests returned HTTP 200 for all five and echoed the requested generated ID.

## Record-by-record crosswalk

| USAC FRN | Applicant / beneficiary | USAspending recipient (UEI) | Per-award actions | USAspending award detail | USAC commitment | BEAR requested / approved |
|---|---|---|---|---:|---:|---:|
| 2499031960 | Clm Community Action Agency, MI (BEN 17032122) | CHIPPEWA-LUCE-MACKINAC COMMUNITY ACTION HUMAN RESOURCES AUTHORITY, INC. (G4TEAHYL63E6) | A1 2025-07-15 +$1,512.00; EX mod 1 2025-12-31 −$112.50 | Obligation/outlay $1,399.50 | $1,512.00 | $1,399.50 / $1,399.50 |
| 2499042130 | Riverdale Academy, LA (BEN 16044954) | RIVERDALE ACADEMY_443031191 (UGBYVUQH8C85) | A1 2025-07-15 +$2,845.00 | Obligation/outlay $2,845.00 | $2,845.00 | $2,845.00 / $2,845.00 |
| 2499050062 | High Desert ESD, OR (BEN 145093) | HIGH DESERT EDUCATION SVC (TAY2B22ATNF5) | A1 2026-09-15 +$952.50 | Obligation/outlay $952.50 | $1,080.00 | $952.50 / $952.50 |
| 2499056696 | Hopi Public Library, AZ (BEN 154188) | COUNTY OF NAVAJO (FH3HTA8K5456) | A1 2025-07-15 +$13,378.50; EX mod 1 2026-03-31 −$2,578.50 | Obligation/outlay $10,800.00 | $13,378.50 | $10,800.00 / $10,800.00 |
| 2499056732 | Hopi Public Library, AZ (BEN 154188) | COUNTY OF NAVAJO (FH3HTA8K5456) | A1 2025-07-15 +$13,378.50; EX mod 1 2026-03-31 −$2,578.50 | Obligation/outlay $10,800.00 | $13,378.50 | $10,800.00 / $10,800.00 |

All five are FY2024 Funded FRNs for Data Transmission and/or Internet Access from Space Exploration Technologies Corp., SPIN 143053761, with service dates 2024-07-01 through 2025-06-30. The USAC invoice extract identifies applicant BEAR lines, not provider-filed SPI invoices. BEAR lines have status `SENT TO USAC`; the dataset excludes in-process, pending, and cancelled lines. The USAC invoice dataset’s Form 472 instructions require an applicant seeking BEAR reimbursement to have received the service and paid the provider in full before filing, but the public rows do not provide bank-transfer evidence for these five records. This evidence describes the certification required by the program, not proof of SpaceX’s actual cash receipt.

USAspending labels the EX actions “Other Action, Non-Financial” while returning nonzero or negative federal-action-obligation values. Those response fields are reported as returned and netted only to reproduce the award-detail totals; this report does not reclassify them as cash payments or assert why the adjustments occurred. The 2499050062 USAspending action/outlay and approved invoice amount are $952.50 against a USAC commitment of $1,080.00; no source reviewed explains the $127.50 difference. For the two Hopi records, the County of Navajo versus library applicant/beneficiary difference is also unresolved.

## Legislative implication

No new operative bill edit is supported by this pass. Proposed Bill v0.8 §302(d)(2), (3), and (5) already separates award recipient identity, intended beneficiary, service provider/payee, actions, outlays, invoicing route, requested/authorized/disbursed amounts, and verified supplier cash receipts. The newly verified records demonstrate why those separate fields matter. Bill v0.8 remains the current proposal; this research pass does not populate an acquisition amount, appropriation, budget score, subsidy total, or SpaceX receipt.

## Status and limits

This is a verified set of five USAspending award-detail/transaction-history joins to five current-funded USAC FRNs. It resolves the record-identity gap for those five; it does not formally accept Item 4 or any named topic. The six USAspending summary-only identifiers remain unmatched to the current-funded FRN set; those records may require historical/status review. No estimate is made for federal support outside the scoped USF/E-Rate records. No inference of cash receipt by SpaceX is made from USAspending outlays, USAC approval status, the BEAR filing rule, or the matching numeric totals.

Formal acceptance remains **0/7 practical and 0/36 named**. Initial coverage remains **7/7**. The 36 frameworks and 311 proposed scope texts remain recovered but unaudited. Descriptive drafting maturity remains **29/50**; overall congressional readiness remains unestablished.

## Sources

1. USAspending, Spending by Transaction API contract, POST `/api/v2/search/spending_by_transaction/`: <https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/search/spending_by_transaction.md>.
2. USAspending, Transactions API contract, POST `/api/v2/transactions/`, including supported generated award IDs and transaction-history fields: <https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/transactions.md>.
3. USAspending, Search Filters v2, Award ID exact-match and recipient/time filters: <https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/search_filters.md>.
4. USAspending official action search endpoint: <https://api.usaspending.gov/api/v2/search/spending_by_transaction/>.
5. USAspending official award-detail and per-award transaction endpoints: <https://api.usaspending.gov/api/v2/awards/{generated_award_id}/> and <https://api.usaspending.gov/api/v2/transactions/>. Five generated IDs and eight action rows are preserved in the accompanying crosswalk CSV; responses were retrieved 2026-10-15 UTC.
6. USAC, E-Rate FRN source and authorized invoice data, as filtered and documented in the preceding Item 4 audit: [Item 4 USAC E-Rate audit](Startake_Item4_USAC_Erate_USF_Application_and_Payment_Link_Audit_2026-10-15.md), Library ID `libfile_186da839568c819190d35b48808c367b`; [original 80-row crosswalk](Startake_Item4_USAC_USASpending_ERate_Crosswalk_2026-10-15.csv), Library ID `libfile_8341278e07188191a9bf3675417fe908`; [authorized invoice-line extract](Startake_Item4_USAC_ERate_Authorized_Invoice_Lines_2026-10-15.csv), Library ID `libfile_4c5f2ead7a2081919db1c6b2ac93e29a`.