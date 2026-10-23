# STARTAKE Item 4 — Quarterly Lifeline ETC and Disbursement Appendix Cross-check

**Research cutoff:** 16 October 2026 UTC  
**Claim:** `STARTAKE-20261016-WORK-ITEM4-USF-QUARTERLY-ETC-SEARCH-3c7f20`  
**Scope:** Original legal scope 04.07, “Universal service and affordability,” supporting practical Item 4. This is one bounded public-record pass, not formal acceptance of a scope, parent topic, or practical item.

## Finding

The latest complete public quarterly filing family located in USAC’s archive was the **4Q2026 Federal Universal Service Mechanism filing**. Its demand filing is dated 31 July 2026. Although the filing projects 4Q2026 support requirements, the Lifeline appendices **LI03** and **LI04** report through **2Q2026** (April–June 2026).

The two full Excel schedules were downloaded and read without filters. No row matched the previously authenticated E-Rate provider name **Space Exploration Technologies Corp.** or 498 ID/SPIN **143053761**. LI03 does not contain a numeric SPIN/498 ID field; it provides a study-area code and a provider-name field, among other columns. LI04 includes a SPIN column, and the exact ID was absent. This is a nonmatch in these published schedules for their covered period; it does **not** establish that Starlink or every related entity is not, or has never been, an ETC or USF recipient.

## Source files and coverage

The 4Q2026 filing’s table of contents labels LI03 “Eligible Telecommunications Carriers – 2Q2026” and LI04 “Quarterly Low Income Disbursement Amounts by Company – 2Q2026.” USAC’s 4Q2026 low-income directory lists both downloadable Excel schedules. Each schedule was read as a whole workbook: one worksheet per file, with the provider rows, headings, aggregate rows, and notes inspected.

| Schedule | Published fields and coverage | Review counts | Snapshot |
|---|---|---:|---|
| LI03 — Eligible Telecommunications Carriers | Study Area Code; SPIN NAME; ILEC; Technology; State. 2Q2026 roster; the file notes that companies no longer ETCs have been removed from the report. | 2,835 fully populated provider rows; 2,827 distinct SACs; 56 state/jurisdiction codes. No numeric SPIN/498 ID field. | `LI03_Eligible_Telecommunications_Carriers_2Q2026.xlsx`; 111,650 bytes; SHA-256 `1adc091e077ccf9906833a9a93a1ff3199c5f0863291b47bcdb9544e084dfba7`. |
| LI04 — Quarterly Low Income Disbursement Amounts by Company | State; SPIN; SAC; SPIN NAME; Lifeline, Link-Up, and total dollar columns grouped for April 30, May 31, and June 30, 2026. | 2,125 provider rows; 1,349 distinct SPINs; 2,119 distinct SACs; 56 state/jurisdiction codes. | `LI04_Low_Income_Disbursements_by_Company_2Q2026.xlsx`; 224,625 bytes; SHA-256 `28a82f5e7cb9298c9a037025957b611352e580c014cebae5196ad063b1c37380`. |

The reported provider-row counts exclude headers, state subtotal rows, blank rows, explanatory notes, and LI04’s aggregate grand-total row. The grand total is a program-level figure and was not attributed to any provider. The 2Q2026 period is the schedules’ data period; the files do not certify status or payment through the 16 October research cutoff.

## Entity matching

The comparison was limited to the provider identity already supported in STARTAKE’s E-Rate records: **Space Exploration Technologies Corp.**, with 498 ID/SPIN **143053761**.

- **LI03:** The provider-name column had no exact case-insensitive match to the authenticated name. A literal scan for “Space Exploration,” “SpaceX,” and “Starlink” also returned no rows. Because LI03 has no numeric SPIN/498 ID field, that roster cannot be tested against 143053761 directly.
- **LI04:** No provider row contained SPIN 143053761, the exact authenticated company name, or the same literal name tokens.
- No approximate name joins, related-entity assumptions, or inference from another USAC program were used.

The schedule result is narrower than a participation determination. It does not resolve State or FCC ETC designation orders, other legal entities or SPINs, service areas, other quarters, other USF programs, awards outside the listed period, or cash credited to a provider’s bank account.

## Legislative integration

Bill v1.7 §107(b)(6) already calls for a pre-close plan to identify any applicable ETC designation, designating authority and service area; related Federal universal-service support and use, reporting, and repayment duties; legally required transaction or continuing-eligibility actions; and post-close responsibility. Existing §302(d)(1)–(6) covers identified public support, source limits, record-level reconciliation, outlays, and verified cash receipts.

This schedule-only nonmatch does not support a new bill clause or a payment, eligibility, compliance, or dollar finding. Bill v1.7 is unchanged. The proposed safeguards do not grant an ETC designation or support eligibility and do not deem any regulatory requirement satisfied.

## Limits and status

This pass did not enumerate State/FCC ETC designation orders or related entities; repeat the prior exact-ID Lifeline search or High Cost filter check; examine High Cost schedules; estimate the complete Federal or State funding universe; establish a provider award, actual receipt, service delivery, program compliance, affordability outcome, or operating cost; or use nonpublic USAC records. A schedule nonmatch is not evidence of nonparticipation.

Formal statuses are unchanged: initial research coverage 7/7; formal acceptance 0/7 practical and 0/36 named; all 311 proposed scope texts remain outside formal acceptance; descriptive drafting maturity 29/50 (58%); overall congressional readiness unestablished.

## Primary sources

- [USAC FCC Filings archive](https://www.usac.org/about/reports-orders/fcc-filings/) — quarterly filing archive and USAC’s description of its filings.
- [USAC 2026 fourth-quarter filing directory](https://www.usac.org/fcc-filings/2026/fourth-quarter/).
- [USAC 4Q2026 Federal Universal Service Mechanism Quarterly Demand Filing (PDF)](https://www.usac.org/fcc-filings/2026/fourth-quarter/financials/USAC%204Q2026%20Federal%20Universal%20Service%20Mechanism%20Quarterly%20Demand%20Filing.pdf), dated 31 July 2026, 70 pages; see the LI03/LI04 entries in its table of contents.
- [USAC 4Q2026 Low-Income appendix directory](https://www.usac.org/fcc-filings/2026/fourth-quarter/low-income/).
- [LI03 Eligible Telecommunications Carriers — 2Q2026 (XLSX)](https://www.usac.org/fcc-filings/2026/fourth-quarter/low-income/LI03%20Eligible%20Telecommunications%20Carriers%20-%202Q2026.xlsx).
- [LI04 Quarterly Low Income Disbursement Amounts by Company — 2Q2026 (XLSX)](https://www.usac.org/fcc-filings/2026/fourth-quarter/low-income/LI04%20Qtrly%20Low%20Income%20Disbursement%20Amts%20by%20Company%20-%202Q2026.xlsx).
- [Prior Item 4 §254 High Cost and Lifeline public-record audit](/Startake/Startake_Item4_USF_High_Cost_Lifeline_Starlink_Eligibility_and_Public_Record_Audit_2026-10-16.md), which documents the separate bounded exact-ID Lifeline and High Cost public-tool checks.
- [Existing USAC E-Rate invoice-line extract](/Startake/Startake_Item4_USAC_ERate_Authorized_Invoice_Lines_2026-10-15.csv), which supplies the already authenticated provider name and 498 ID/SPIN used for this cross-check.