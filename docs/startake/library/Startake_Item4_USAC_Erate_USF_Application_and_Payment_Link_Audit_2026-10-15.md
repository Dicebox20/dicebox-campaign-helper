# Item 4 USAC E-Rate Application and Payment-Link Audit

**Date:** 15 October 2026 UTC  
**Claim:** `STARTAKE-20261015-WORK-ITEM4-ERATE-7c52e1`  
**Status:** Bounded research and drafting pass complete; formal verification pending.  
**Prior record:** [USAspending UEI Award-Universe Reconciliation](Startake_Item4_USASpending_UEI_Award_Universe_Reconciliation_2026-10-15.md), Library ID `libfile_0b9694885ad88191bcd537654a0dc7f3`.

## Findings

The official USAC FCC Form 471 FRN Status dataset returned **74 current funded FRNs** for Space Exploration Technologies Corp. service-provider number (SPIN) **143053761**. A direct USAspending recipient-UEI award-summary query returned **74 Schools and Libraries (CFDA 32.004) summaries** for UEI **C6M7C2FLKER5**. Exact matching of the numeric FRN to the numeric suffix in an award ID of form `SL-{FRN}` produced **68 matches**. Six current funded USAC FRNs have no same-suffix award-summary row; six summary IDs have no same-suffix match in the current funded FRN set. No fuzzy applicant-name, date, or amount joins were used.

The 74 FRNs span FY2023–FY2026: 19, 32, 18 and 5, respectively. Seventy-three identify the service type “Data Transmission and/or Internet Access”; one identifies “Internal Connections.” Their USAC commitment requests sum to **$394,489.42**. These are application-level commitment fields, not cash payments or SpaceX revenue. The exact-ID-matched 68 have $346,095.42 in USAC commitment fields and $72,563.70 in USAspending Award Amount fields. Six USAC-only current-funded FRNs have $48,394.00 in commitment fields; six summary-only USAspending award amounts total $9,956.00. The differing field totals are not reconciled as the same measure and must not be summed or described as a Starlink public-support total.

The current-funded FRNs absent from the exact award-summary crosswalk are **2499031960, 2499042130, 2499050062, 2499056696, 2499056732, and 2499057486**. The USAspending summary IDs without a same-suffix current funded FRN are **SL-2599016895, SL-2599045223, SL-2599029317, SL-2599016877, SL-2599016356, and SL-2499028163**. The records do not explain why these two six-record sets differ; absence from this filtered current-funded extract does not establish that an FRN was never filed or that no historical status record exists.

The transaction-only USAspending identifier **SL-2499057486** maps exactly by suffix to USAC FRN **2499057486**, resolving the identity of the previously unmatched $16,200 action. The prior Item 4 report records the USAspending A1 action dated 2025-07-15 and the $16,200 action amount; the award identifier is absent from the 74 award-summary rows. The USAC record identifies FY2024 application **241039200**, Akiak Tribal Library (BEN **17032308**), Space Exploration Technologies Corp. (SPIN **143053761**), funding status Funded, service type Data Transmission and/or Internet Access, and a funding commitment of **$16,200**. The application nickname is “Starlink Monthly Service.” The FRN data links the program, underlying application, service request, intended applicant/beneficiary, provider, and commitment. It does not by itself prove service delivery or final payment.

USAC’s authorized-invoice dataset returned **56 invoice lines** for SPIN 143053761, all FY2024 **Applicant** invoices (FCC Form 472 / BEAR), all with line status **SENT TO USAC**. The lines cover **11** of the 74 current funded FRNs; no provider-filed Service Provider Invoices (FCC Form 474 / SPI) appear in this result. The 56 requested invoice-line amounts total **$38,529.41**; the 56 approved invoice-line amounts also total **$38,529.41**. The dataset excludes in-process, pending, and cancelled invoice lines, so the 63 FRNs without a returned authorized invoice line are not evidence that no invoice or payment exists.

For FRN 2499057486, the invoice dataset shows BEAR invoice **BEAR202603907**, line **20883866**, for Akiak Tribal Library, requested and approved line amount **$4,050**, status **SENT TO USAC**, and line completion date **2026-04-02**. USAC describes BEAR as an applicant’s reimbursement request after the applicant has received the approved eligible service and paid the provider in full. The public invoice row is an applicant-invoice record, not a provider SPI invoice, bank-account trace, or direct record of cash received by SpaceX. USAC’s Form 472 instructions say an applicant files BEAR only after paying the service provider in full; that requirement is evidence about the applicant’s certification and program rule, not independent transaction evidence in this extract. USAC’s 2025 public audit briefing documents a separate case in which a beneficiary filed a BEAR request before paying one provider invoice in full; it does not indicate any problem with the Starlink-related records reviewed here.

## Source queries and method

1. **USAC current funded FRNs.** Queried the USAC Open Data raw FCC Form 471 / FRN Status resource `qdmp-ygft` on 2026-10-15 with:
   `epc_organization_id='143053761' AND form_version='Current' AND form_471_frn_status_name='Funded'`.
   Fields retained include funding request number, application number, funding year, BEN and applicant name, state, FRN status, service type, nickname, provider SPIN/name, service dates, eligible monthly cost, commitment request, invoicing mode, and Form 486 status. The source and filter avoid counting original and current FRN versions as separate requests.

2. **USAspending award summaries.** Queried the official v2 `/api/v2/search/spending_by_award/` endpoint using recipient search text UEI `C6M7C2FLKER5`, award groups `06, 10, F006, F007`, the bounded 2019-10-01 through 2026-10-15 window, and the fields Award ID, Recipient UEI, Award Amount, Total Outlays, Description, and CFDA number/title. The response contained 74 rows and no next page. Matching used only the numeric suffix of an `SL-` award ID against the USAC FRN.

3. **USAC invoice lines.** Queried the USAC Open Data authorized-invoice resource `jpiu-tj8h` for `inv_service_provider_id_number_spin='143053761'`, returned 56 rows. The source page states the dataset covers invoice lines completed and authorized for disbursement from July 1, 2016 onward and excludes in-process, pending, and cancelled lines; its displayed last-updated date was September 23, 2026. All 56 returned rows had invoice type Applicant and line status SENT TO USAC. The invoice CSV preserves each line’s FRN, application, BEN, invoice ID and line number, SPIN and provider name, status, requested/approved amounts, completion date, and decision fields.

4. **USAspending transaction follow-up.** The earlier award-universe report contains the 123-row USF action search, the $16,200 action, date and action type. During this pass, a separate exact-ID transaction request for the other five current-funded FRNs with no award-summary match returned HTTP 503 (Service Unavailable). The record identity and payment path for those five remain unresolved until a transaction-history query succeeds.

## Proposed Act revision

The evidence tests the current §302(d)(5) rule. It already requires a program, application, approved service/project, intended beneficiary, provider/payee, action, outlay and payment-status reconciliation. The invoice records expose a material classification distinction: BEAR reimbursement is requested by an applicant after it certifies prior payment to the provider; SPI is filed by the service provider for the discounted portion. A generic payment-status field could collapse applicant reimbursement into provider receipt.

Bill v0.8 therefore adds this sentence to §302(d)(5):

> Where a program permits reimbursement to an applicant or direct payment to a provider, the schedule shall identify the invoicing route and payee and separately state amounts requested, authorized, and disbursed. An applicant’s certification of prior payment may be reported as a certification, but does not alone constitute transaction-level evidence of cash receipt by a provider under paragraph (3).

The rest of §302(d)(5) and all other sections remain unchanged. This keeps application-level commitments, invoice requests, authorization, applicant reimbursement, provider payment and verified cash receipts as distinct evidence states.

## Limits and remaining gaps

- Six current funded FRNs and six USAspending summary IDs do not form an exact one-to-one suffix crosswalk; the USAspending API returned 503 when asked for separate transaction details for five of the unmatched FRNs.
- The public USAC invoice extract contains authorized BEAR lines but no provider SPI line for this SPIN in the retrieved rows, and it contains no bank-transfer evidence. Applicant certification is not independent proof of a provider receipt.
- The USAspending award-summary Award Amount, displayed Total Outlays, transaction actions, USAC commitment requests, and USAC invoice-line amounts are separate fields and are not reconciled as one cash or subsidy total.
- A funded FRN links an approved/requested program record to an applicant, provider, and service category; it does not establish that each service was delivered, that all recipient sites used Starlink, or that every payment was made.
- No complete federal-support census, Starlink-only support total, actual SpaceX cash receipt, formal Item 4 acceptance, or formal named-topic verification is established.

## Primary-source index

- [USAC FRN Status Tool FY2016+](https://opendata.usac.org/E-Rate/E-Rate-FRN-Status-Tool-FY2016-/8xzh-ytkh) and [raw resource](https://opendata.usac.org/resource/qdmp-ygft.json)
- [USAC E-Rate Invoices and Authorized Disbursements (Forms 472/474), resource jpiu-tj8h](https://opendata.usac.org/E-Rate/E-Rate-Invoices-and-Authorized-Disbursements-FCC-F/jpiu-tj8h)
- [USAC FCC Form 472 / BEAR instructions](https://www.usac.org/e-rate/applicant-process/invoicing/fcc-form-472-filing/)
- [USAC applicant invoicing methods](https://www.usac.org/e-rate/applicant-process/invoicing/)
- [USAC 2025 public Schools and Libraries Audit Briefing Book](https://www.usac.org/wp-content/uploads/about/documents/leadership/materials/sl/2025/2025-01-27-SL-Audit-Briefing-Book-Public.pdf)
- [USAspending v2 award-summary API contract](https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/search/spending_by_award.md)
- [USAspending v2 transaction API contract](https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/search/spending_by_transaction.md)
- [Prior Item 4 USAspending UEI report](Startake_Item4_USASpending_UEI_Award_Universe_Reconciliation_2026-10-15.md)

## Deliverable integrity

The 80-row crosswalk CSV and 56-row authorized-invoice CSV are separate appendices. The crosswalk contains all 74 current funded FRNs plus six USAspending summary-only rows; an empty match field indicates an unmatched exact suffix, not a zero-value award. The invoice appendix preserves line-level statuses and amounts without converting them into bank payments. The SHA-256 values are recorded in the live tracker closeout and dashboard.