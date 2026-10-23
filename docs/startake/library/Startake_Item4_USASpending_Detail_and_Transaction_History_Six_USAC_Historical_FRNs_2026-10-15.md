# Item 4 — USAspending detail and transaction-history reconciliation for six historical E-Rate FRNs

**Research date:** 15 October 2026 UTC. **Assignment:** STARTAKE-20261015-WORK-ITEM4-USA-DTL-6-3b9ad2, reserved at tracker v190 and closed by conditional tracker update to v191. **Scope:** six USAspending summary award IDs previously matched to USAC FRNs by exact suffix; USAspending award details, transaction histories, federal-account links, and comparison to the already saved USAC Original/Current records and SPI-line reconciliation.

## Finding

All six generated USAspending award keys and FAINs were verified against their respective USAspending detail records and exactly match the six numeric suffixes in USAC FRN Status. Each detail record identifies the award recipient as SPACE EXPLORATION TECHNOLOGIES CORP., UEI C6M7C2FLKER5, awarding and funding agency Federal Communications Commission, and CFDA 32.004, Universal Service Fund — Schools and Libraries (E-Rate). The detail record type is “Direct payment for specified use, as a subsidy or other non-reimbursable direct financial aid.” This establishes the identity of the recipient shown in the award database; it does not by itself establish which applicant, school/library beneficiary, provider, payee, or bank account ultimately received money.

For the two current-funded USAC FRNs, USAC Current records show approved provider changes away from SpaceX: FRN 2599016895 is for Yavapai County Educational Technology Consortium (BEN 16063462), with OrbitLink, LLC (SPIN 143054717) as Current provider; FRN 2599045223 is for Valley View School District 35 (BEN 135149), with Ronan Telephone Company (SPIN 143002541) as Current provider. The nine and twelve SPI lines respectively are recorded as SENT TO USAC. Their $4,050.00 and $4,555.92 authorized/requested line totals match both USAC total-authorized-disbursement fields and USAspending outlays. That is an accounting reconciliation, not proof of bank receipt by either current provider or SpaceX.

The other four Current USAC records are Cancelled with current commitment zero and a null authorized-disbursement source value. No authorized invoice rows were returned for those four FRNs in the published invoice dataset. USAspending shows zero summary award amount/outlays for them; award-detail total_outlay is null while account-level outlay is zero. Historical service and payment remain unresolved. The null detail values are preserved as null and are not converted to zero.

## Record-level joins and award detail

| FRN / generated award key | FAIN | USAspending recipient / UEI | Current USAC applicant and provider status | Summary award amount / outlays | USAspending detail obligation / outlay |
|---|---|---|---|---:|---:|
| SL-2599016895 / ASST_NON_SL-2599016895_027 | SL-2599016895 | SPACE EXPLORATION TECHNOLOGIES CORP. / C6M7C2FLKER5 | Yavapai County Educational Technology Consortium; Funded; OrbitLink, LLC | $5,400.00 / $4,050.00 | $5,400.00 / $4,050.00 |
| SL-2599045223 / ASST_NON_SL-2599045223_027 | SL-2599045223 | SPACE EXPLORATION TECHNOLOGIES CORP. / C6M7C2FLKER5 | Valley View School District 35; Funded; Ronan Telephone Company | $4,556.00 / $4,555.92 | $4,556.00 / $4,555.92 |
| SL-2599029317 / ASST_NON_SL-2599029317_027 | SL-2599029317 | SPACE EXPLORATION TECHNOLOGIES CORP. / C6M7C2FLKER5 | Valentine School District 22; Cancelled; Space Exploration Technologies Corp. | $0.00 / $0.00 | $0.00 / NULL |
| SL-2599016877 / ASST_NON_SL-2599016877_027 | SL-2599016877 | SPACE EXPLORATION TECHNOLOGIES CORP. / C6M7C2FLKER5 | Painted Desert Demonstration Project DBA The Star School; Cancelled; Space Exploration Technologies Corp. | $0.00 / $0.00 | $0.00 / NULL |
| SL-2599016356 / ASST_NON_SL-2599016356_027 | SL-2599016356 | SPACE EXPLORATION TECHNOLOGIES CORP. / C6M7C2FLKER5 | Double Adobe School; Cancelled; Space Exploration Technologies Corp. | $0.00 / $0.00 | $0.00 / NULL |
| SL-2499028163 / ASST_NON_SL-2499028163_027 | SL-2499028163 | SPACE EXPLORATION TECHNOLOGIES CORP. / C6M7C2FLKER5 | Humboldt County Library; Cancelled; Space Exploration Technologies Corp. | $0.00 / $0.00 | $0.00 / NULL |

All six generated IDs are of the form ASST_NON_SL-{FRN}_027 and each FAIN is SL-{FRN}. The source-response appendix records the official generated key, internal detail ID, complete transaction-page rows, transaction IDs, account-list results, endpoint counts, page metadata, and the API’s last-updated date.

## Complete USAspending action histories

The transaction-history endpoint returned one page per award, with hasNext=false for all six. A separate transaction-count endpoint returned the same 1, 1, 2, 2, 2, and 3 rows as the respective history pages. Amounts below are the federal_action_obligation field; action descriptions are reproduced as the API returned them.

| FAIN | Date | Action / modification | API action description | Federal action obligation |
|---|---|---|---|---:|
| SL-2499028163 | 2024-10-31 | A1 / — | New Award | $1,800.00 |
| SL-2599016356 | 2025-04-30 | A1 / 0 | New Award | $2,400.00 |
| SL-2599016877 | 2025-04-30 | A1 / 0 | New Award | $4,800.00 |
| SL-2599029317 | 2025-04-30 | A1 / 0 | New Award | $4,800.00 |
| SL-2599016877 | 2025-05-15 | EX / 1 | Other Action, Non-Financial | $-4,800.00 |
| SL-2599016356 | 2025-05-31 | EX / 1 | Other Action, Non-Financial | $-2,400.00 |
| SL-2599016895 | 2025-05-31 | A1 / 0 | New Award | $5,400.00 |
| SL-2599029317 | 2025-06-30 | EX / 1 | Other Action, Non-Financial | $-4,800.00 |
| SL-2499028163 | 2025-07-15 | EX / 2 | Other Action, Non-Financial | $2,988.00 |
| SL-2599045223 | 2025-08-31 | A1 / 0 | New Award | $4,556.00 |
| SL-2499028163 | 2026-04-15 | EX / 3 | Other Action, Non-Financial | $-4,788.00 |

Across these eleven rows, A1 New Award obligations total $23,756.00; positive EX amounts total $2,988.00; negative EX amounts total $-16,788.00; net federal-action obligations total $9,956.00. USAspending labels the EX actions “Other Action, Non-Financial” even where it reports a nonzero obligation value. This report preserves those reported codes and amounts and does not infer the underlying reason, cash movement, service delivery, or USAC cancellation rationale from them.

## Federal-account link and endpoint discrepancy

The official POST /awards/accounts/ response returned one list result for each of the six award keys. All six results identify Federal account 027-5183, titled “Universal Service Fund, Federal Communications Commission.” Its listed total_transaction_obligated_amount is $5,400, $4,556, and $0 for each of the four other records.

However, the separate GET /awards/count/federal_account/{award_id}/ endpoint returned counts 11, 7, 2, 2, 2, and 3 respectively, while POST /awards/accounts/ returned one list result and page_metadata.count=1 for every award. The transactions themselves number 1, 1, 2, 2, 2, and 3. The count endpoint’s meaning is therefore not treated as a count of distinct federal-account list results; the account-count discrepancy remains unresolved. The reproducible data appendix retains both API responses.

## Crosswalk and legislative effect

The v0.3 crosswalk is preserved. Version 0.4 retains all 80 rows and adds the six USAspending award-detail and history records, exact transaction identifiers, federal-account results, and the account-count discrepancy. The previously verified 74 current-funded same-suffix links are unchanged. The six historical records now have both USAspending detail/history and USAC Original/Current FRN records joined by exact numeric suffix.

Integrated Working Bill v0.8 remains a 31-section working draft. Proposed section 302(d)(2) requires the recipient/beneficiary distinction; section 302(d)(3) distinguishes budget authority, award obligations, outlays and verified cash receipts; and section 302(d)(5) requires program, application, beneficiary, provider/payee, invoicing-route, requested/authorized/disbursed, and payment-status reconciliation. This pass confirms those drafting controls fit the record evidence. No new statutory gap was identified, so no bill text changed. This finding is not formal legal review and does not certify introduction readiness.

## Remaining evidence gaps

- No remittance statements, Treasury settlement records, provider bank records, or equivalent transaction-level proof establishes cash receipt by SpaceX, OrbitLink, Ronan Telephone, or the applicants.
- The federal-account count endpoint and account-list endpoint conflict; the count is not represented as a number of distinct accounts.
- The four cancelled awards have historical A1/EX actions but no returned authorized-invoice lines and null USAspending award-detail outlay fields. No inference of no prior service or payment is supported.
- The disclosed award recipient, USAC applicant/beneficiary, and current provider/payee remain separate roles. This six-award result is not a national federal-support total, does not resolve all related payment paths, and does not establish a Starlink-only cash-receipt total.
- The bill’s appropriation amounts, federal score, compensation/value inputs, complete asset/title/permission schedules, substantive audit of the 311 proposed scopes, and independent legal/appraisal/engineering/budget review remain open.

## Sources and reproducibility

- USAspending API v2 public documentation: [API index](https://api.usaspending.gov/), [official transaction-history contract](https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/transactions.md), and [published endpoint index](https://api.usaspending.gov/docs/endpoints/federal_accounts/). Queries used GET /awards/{generated_unique_award_id}/, POST /transactions/ (page 1, limit 5000, action_date ascending), POST /awards/accounts/, GET /awards/count/federal_account/{generated_unique_award_id}/, GET /awards/count/transaction/{generated_unique_award_id}/, and GET /awards/last_updated/. The API reported last_updated=10/15/2026.
- Official USAC E-Rate FRN Status and Invoice/Authorized Disbursement source extracts and interpretations are documented in the prior [six-FRN historical USAC reconciliation](Startake_Item4_USAC_Historical_FRN_Status_and_SPI_Disbursement_Reconciliation_2026-10-15.md), Library ID libfile_fffd8d9796388191be966c20d9556938. That report used [USAC FRN Status data](https://opendata.usac.org/E-Rate/E-Rate-FRN-Status-Tool-2016/qdmp-ygft) and [USAC Authorized Invoices data](https://opendata.usac.org/E-Rate/E-Rate-Invoices-and-Authorized-Disbursements-FCC-F/jpiu-tj8h).
- Source API-response extract: [six-award JSON appendix](Startake_Item4_USASpending_Six_Award_Detail_and_Transaction_Histories_2026-10-15.json), SHA-256 0110717893084f0619ca144cbca1c844fea75ba86d8ac4672bdc59516ec0e648. Updated crosswalk v0.4 SHA-256 2ffd579ca6bb463072efdc3612094f6bb7792398952e5467b2ebfee21c64dd66. Preserved source crosswalk v0.3 SHA-256 738e2741b0b2da345e31d87bbd58761a780e7d0d78bbe07d61ad28f4abc0e0d2.

## Checkpoint status

- Research verification: six of six record-level award-detail/history-to-FRN joins verified; 80 of 80 same-suffix identity links retained in the crosswalk. This assignment verifies only six USAspending detail/history records plus their joined USAC history.
- Initial research coverage: 7/7. Formal acceptance: 0/7 practical and 0/36 named. The 36 topic frameworks and 311 proposed scope texts are recovered, not substantively audited or accepted.
- Bill: v0.8, 31 sections, unchanged. Descriptive document maturity: 29/50. Overall congressional readiness remains unestablished; no defensible aggregate readiness score is available.
- Next: close and read back this assignment under Workflow v2.2, refresh the completion dashboard, and proceed to another unblocked evidence or modeling gap.