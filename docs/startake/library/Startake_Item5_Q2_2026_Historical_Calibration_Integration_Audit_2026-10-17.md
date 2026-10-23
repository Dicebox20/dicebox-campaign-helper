# Item 5 Q2 2026 Historical Subscriber Calibration Integration Audit

**Date:** 17 October 2026 UTC  
**Claim:** `STARTAKE-20261017-WORK-ITEM5-HISTORICAL-CALIBRATION-Q2-5b91c4`  
**Assignment status:** Research pass complete — formal verification pending; owned claim released after tracker and dashboard reconciliation.  
**Method:** Direct primary-source wording check and bounded integration into the existing financial workbook. This is not a new financial-disclosure audit, independent appraisal, financial assurance, legal opinion, or professional review.

## Scope and prior work

This assignment supports practical Item 5, *Starlink-only valuation and financial model*, and original named scope 07.03, *Subscriber economics*. It adds the source-reported subscriber count and subscriber ARPU comparators to the workbook as historical data. The prior SEC disclosure audit already identified these figures and definitions; this pass rechecked the source wording and addressed the separate model-integration gap rather than repeating the earlier filing audit.

Prior records reviewed: [Current Financial Disclosure Audit v0.1](/Startake/Startake_Current_Financial_Disclosure_Audit_v0.1_2026-10-15.md), Library ID `libfile_d1a4777817b08191820283aa4523a176`; [Valuation and Federal Funding Model Report v0.1](/Startake/The_Starlink_and_Stripes_Act_Valuation_Funding_Model_Report_v0.1_2026-10-15.md), Library ID `libfile_7044c12f19388191b1521817a9c52f96`; [Financial Workbook Report v0.1](/Startake/The_Starlink_and_Stripes_Act_Workbook_Report_v0.1_2026-10-15.md), Library ID `libfile_8be028ff6c9481919986957ac4e4a810`; and the prior workbook v0.3.

## Source-verified historical measures

Space Exploration Technologies Corp.’s Form 10-Q for the quarter ended 30 June 2026 defines a Starlink subscriber as a unique service line assigned to a Starlink.com account registered to a person or entity without a direct, negotiated agreement with Starlink’s sales team. The metric includes personal and business subscription plans, excludes managed enterprise and government customers with such contracts, and is not a count of people, account holders, end users, or devices. The issuer reports 12.0 million subscribers as of 30 June 2026 and 6.0 million as of 30 June 2025.

The filing defines Starlink Subscriber ARPU as service revenue generated from Starlink subscribers divided by the average number of Starlink subscribers during the period and by the number of months in that period. It reports $66 for both the three months and six months ended 30 June 2026; the corresponding 2025 values are $85. These are period-specific issuer metrics, not a separate Starlink income statement or a forward rate. The source is the 10-Q MD&A, “Key Business Metrics,” printed pages 35–36, lines 1580–1605: [SEC filing](https://www.sec.gov/Archives/edgar/data/1181412/000162828026052535/spcx-20260630.htm), retrieved 17 October 2026.

## Workbook integration and disposition

Saved [Financial Workbook v0.4](/Startake/Startake_Financial_Workbook_v0.4_2026-10-17.xlsx), Library ID `libfile_2a66a31519cc8191ba7786da678b1d87`, 48,117 bytes, SHA-256 `91f4689cc61abfdbaa87488bfde26c792110267071550bde91fc9bc741b300d8`. It adds a separate `Historical Calibration` sheet with the six disclosed values, period labels, units, source reference and URL, issuer definitions, and model-use limits. The Summary page identifies the new sheet and keeps the model version in its title.

None of the historical values is linked to the `Assumptions` or `Forecast` sheets. This preserves the distinction between the issuer’s selected subscriber population and the full proposed acquisition perimeter: the published subscriber metric excludes managed enterprise and government contracts, whose treatment in the acquisition perimeter has not been reconciled. The point-in-time subscriber count and period-average ARPU also use different time bases. The workbook therefore does not multiply 12.0 million by $66 and twelve months as reported or standalone revenue, and it does not use historical ARPU as a forecast assumption.

The Actual case remains blocked. Case selector `Assumptions!E5` remains 1; required-input status remains “Missing or invalid inputs”; 34 drivers remain missing; `Assumptions!E21` (opening service lines) and `Assumptions!E96` (Year 1 monthly net ARPU) remain blank. Existing formula counts remain unchanged (Summary 8, Assumptions 348, Forecast 456). The pre-existing two-variable sensitivity table was re-created through the documented spreadsheet API and remains in the exported workbook; actual-case sensitivity results remain unavailable. The historical sheet contains no formulas and does not feed model calculations.

The current Bill v1.7 is unchanged. This data-integration pass reveals no new operative text omission in the draft’s existing source-trace and valuation-record requirements. It does not supply a commercial-only revenue series, cost or capex allocation, churn or geographic mix, opening balance sheet, purchase price, appropriation, official score, appraisal, or expert opinion.

## Verification and limits

The workbook was rendered before and after editing. After export, the workbook was independently re-imported and inspected: the four expected sheets and all six source values were present; formulas on the three original sheets matched the input workbook; the native two-variable sensitivity table was preserved; and the Actual-case readiness gate and 34-missing-driver count were unchanged. The saved Library file was independently materialized and byte-matched the local export.

This is supporting evidence only. Practical Item 5, named topic *Standalone Starlink valuation*, and scope 07.03 remain formally unchecked. Initial research coverage remains 7/7 practical items; formal acceptance remains 0/7 practical and 0/36 named topics; all 311 proposed scope rows remain outside formal acceptance; descriptive drafting maturity remains 29/50 (58%); overall congressional readiness remains unestablished.

Remaining work includes a reconciled commercial acquisition perimeter (especially negotiated managed enterprise and government services), a multi-period source-backed revenue and subscriber schedule, churn/additions and geographic/plan mix, standalone costs, capex and depreciation cohorts, opening assets/liabilities and working capital, independent multi-method appraisal, and professional accounting and budget review. No numerical acquisition price or public funding need can be inferred from the subscriber/ARPU observations in this report.