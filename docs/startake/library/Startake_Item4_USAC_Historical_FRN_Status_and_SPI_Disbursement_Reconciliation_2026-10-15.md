# Item 4: Historical USAC FRN Status and SPI Disbursement Reconciliation

**Research date:** 15 October 2026 (UTC)  
**Claim:** STARTAKE-20261015-WORK-ITEM4-ERATE-HIST-6-2d46c1  
**Status:** Bounded assignment complete; evidence gap narrowed; Item 4 formal acceptance remains pending.

## Finding

All six USAspending summary identifiers previously lacking a same-suffix record in the current-funded USAC extract now have **record-by-record exact numeric suffix matches** to both Original and Current records in USAC's official FRN Status dataset. That result comes from querying each identifier across all returned form versions, not from matching aggregate counts.

Four current FRNs are Cancelled with current commitment 0; their USAC total-authorized-disbursement field is null and no line was returned in the published authorized-invoice dataset. The null and missing lines do not establish that no historical service or payment occurred.

Two current FRNs remain Funded, but USAC's Current records document approved provider/SPIN changes away from SpaceX to OrbitLink and Ronan Telephone. The published invoice dataset contains 21 Service Provider Invoice lines for those new providers. The line totals and USAC's total-authorized-disbursement fields match USAspending's displayed outlays exactly: $4,050.00 and $4,555.92, respectively. This verifies authorized-disbursement and accounting-field reconciliation for those records; it does **not** establish bank-level receipt by either provider or payment to SpaceX.

USAspending recipient/beneficiary detail for these six summary records was not reopened in this bounded pass. Do not attribute these federal amounts to SpaceX as supplier receipts. The integrated bill's v0.8 proposed section 302(d)(2), (3), and (5) already requires the relevant award/program, beneficiary, provider/payee, invoicing route, requested/authorized/disbursed, and receipt distinctions. No bill text change is needed on this evidence alone.

## Six record joins

| USAspending award ID | Applicant / BEN | Original USAC record | Current USAC record | Current provider and invoice evidence |
|---|---|---|---|---|
| SL-2499028163 | Humboldt County Library / 17006521 | FY2024, app 241004277; Pending; SpaceX SPIN 143053761; $4,788 request | Cancelled; commitment $0; authorized-disbursement field null | Current record names SpaceX, but there are no authorized invoice rows returned. Past service/payment remains open. |
| SL-2599016356 | Double Adobe School / 98111 | FY2025, app 251014141; Pending; SpaceX SPIN 143053761; $2,400 request | Cancelled; commitment $0; authorized-disbursement field null | Current record names SpaceX, but there are no authorized invoice rows returned. Past service/payment remains open. |
| SL-2599016877 | Painted Desert Demonstration Project DBA The Star School / 222828 | FY2025, app 251014573; Pending; SpaceX SPIN 143053761; $4,800 request | Cancelled; commitment $0; authorized-disbursement field null | Current record names SpaceX, but there are no authorized invoice rows returned. Past service/payment remains open. |
| SL-2599016895 | Yavapai County Educational Technology Consortium / 16063462 | FY2025, app 251014585; Pending; SpaceX SPIN 143053761; $5,400 request | Funded; commitment $5,400; SPI; F486 Approved; USAC authorized-disbursement field $4,050 | Current provider is OrbitLink, LLC / SPIN 143054717 after an approved SPIN change. Nine completed SPI lines total $4,050 requested and approved. |
| SL-2599029317 | Valentine School District 22 / 143217 | FY2025, app 251022771; Pending; SpaceX SPIN 143053761; $4,800 request | Cancelled; commitment $0; authorized-disbursement field null | Current record names SpaceX, but there are no authorized invoice rows returned. Past service/payment remains open. |
| SL-2599045223 | Valley View School District 35 / 135149 | FY2025, app 251032334; Pending; SpaceX SPIN 143053761; $4,556 request | Funded; commitment $4,556; SPI; F486 Approved; USAC authorized-disbursement field $4,555.92 | Current provider is Ronan Telephone Company / SPIN 143002541 after an approved SPIN change. Twelve completed SPI lines total $4,555.92 requested and approved. |

The Current records for the two funded FRNs contain explicit post-commitment notes approving each SPIN change and naming the replacement service provider. The Current records for all four cancelled FRNs contain cancellation rationales. For SL-2499028163, the record also lists an approved service-substitution request and an appeal before the cancellation.

## Invoice and award-field reconciliation

The USAC authorized-invoice dataset returned 21 lines, all Service Provider Invoice (SPI) lines with status SENT TO USAC:

| FRN | Current USAC provider | Lines | Prediscount line total | Requested and approved invoice-line total | USAC total authorized-disbursement field | USAspending Award Amount | USAspending Total Outlays |
|---|---|---:|---:|---:|---:|---:|---:|
| 2599016895 | OrbitLink, LLC (SPIN 143054717) | 9 | $4,500.00 | $4,050.00 | $4,050.00 | $5,400.00 | $4,050.00 |
| 2599045223 | Ronan Telephone Company (SPIN 143002541) | 12 | $5,694.96 | $4,555.92 | $4,555.92 | $4,556.00 | $4,555.92 |
| **Total** | | **21** | **$10,194.96** | **$8,605.92** | **$8,605.92** | **$9,956.00** | **$8,605.92** |

The four cancelled records have USAspending summary Award Amount and Total Outlays of $0 in the prior crosswalk, USAC Current commitments of $0, null (not zero) Current USAC authorized-disbursement fields, and no lines returned by the authorized-invoice query. USAC describes this dataset as covering completed invoice lines authorized for disbursement while excluding pending, in-process, and cancelled lines; therefore the no-row result is bounded to that dataset's scope. See [USAC invoice dataset](https://opendata.usac.org/E-Rate/E-Rate-Invoices-and-Authorized-Disbursements-FCC-F/jpiu-tj8h) and [USAC E-Rate Tools](https://opendata.usac.org/stories/s/E-rate-Tools/bneq-mh8b).

USAC's news brief defines SENT TO USAC as an invoice line that USAC reviewed and for which it issued a payment decision, then sent the line to be processed for payment. USAC's provider invoicing instructions explain that it sends a remittance statement after processing an SPI form. No remittance statement, bank record, or provider cash-receipt evidence was obtained here. Accordingly, this report uses the source's authorized-disbursement values and does not relabel them as verified provider receipts. See [USAC status explanation](https://www.usac.org/slnewsbriefs/2021/News-Brief-2021-04-23.pdf) and [USAC Form 474 invoicing guidance](https://www.usac.org/e-rate/service-providers/step-5-invoicing/).

## Method and reproducibility

1. Queried USAC's official [E-Rate FRN Status dataset](https://opendata.usac.org/E-Rate/E-Rate-FRN-Status-Tool-2016/qdmp-ygft) on 15 October 2026 for the six exact numeric FRNs, with no form-version or status restriction. The query returned 12 records: one Original and one Current row for each FRN. The dataset metadata showed an update time of 15 October 2026 09:37 UTC.
2. Joined each USAspending award-ID suffix SL-{FRN} to the exact funding_request_number string. Each of the six identifiers matched, and applicant, funding year, application, provider, status, commitment and current-version fields were retained.
3. Queried the official [E-Rate Invoices and Authorized Disbursements dataset](https://opendata.usac.org/E-Rate/E-Rate-Invoices-and-Authorized-Disbursements-FCC-F/jpiu-tj8h) using the same six-FRN filter. The query returned 21 line records across two FRNs. Each line's provider, SPIN, status, requested and approved line amounts, invoice ID, line number and completion date are in the accompanying [21-line extract](Startake_Item4_USAC_Historical_SPI_Invoice_Lines_Six_FRN_2026-10-15.csv). Dataset metadata showed an update time of 15 October 2026 08:31 UTC.
4. Carried forward the six USAspending summary amounts from the preceding verified [crosswalk v0.2](Startake_Item4_USAC_USASpending_ERate_Crosswalk_v0.2_2026-10-15.csv); USAspending award-detail recipient fields and transaction histories were not re-queried in this bounded USAC assignment.
5. Updated the 80-row crosswalk to v0.3. The 74 previously supported current-funded FRN-to-summary/action/detail links remain, and the other six records now have historical Original/Current USAC status matches. The new fields keep original and current provider identities, invoice authorizations and cash receipt status separate.

## Legislative relevance and limits

Proposed section 302(d)(2), (3), and (5) of Integrated Working Bill v0.8 already requires a source-indexed award record, beneficiary/program and provider/payee reconciliation, separate requested, authorized and disbursed values, and transaction-level evidence before reporting a covered-business cash receipt. It also requires an unresolved lead and no attributed amount where the covered-business nexus is not established. This evidence supports the drafted method but does not supply a verified SpaceX cash receipt or a complete federal-support total; no bill amendment is made in this pass.

This is a bounded E-Rate history and invoice reconciliation, not a national federal-funding census, finding of service delivery, proof of nonpayment on cancelled records, attribution of all six awards to a supplier, completed Item 4 acceptance, or professional accounting/legal opinion.

## Saved deliverables and verification

- Updated 80-row crosswalk v0.3.
- 21-line SPI extract.
- This report.

The original v0.2 crosswalk, the prior transaction-history report, bill v0.8 and earlier checkpoints remain preserved.