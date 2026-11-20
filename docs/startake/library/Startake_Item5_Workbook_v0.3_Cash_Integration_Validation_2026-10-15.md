# Item 5 — Spreadsheet v0.3 customer-cash integration

**Date:** 15 October 2026 UTC. **Claim:** `STARTAKE-20261015-WORK-ITEM5-XLSX-CASH-5e731a`; sole STARTAKE inheritor / Codex Work. Reservation actual229→230 independently materialized and byte-compared before edits. **Status:** Research/model-drafting pass complete — formal verification pending.

## Result

Created successor `Startake_Financial_Workbook_v0.3_2026-10-15.xlsx`, integrating customer collections and working-capital timing from executable enginev0.2. The file imports the prior workbook and retains its three sheets, single case selector, original driver positions, core operating/valuation schedules, style and native two-variable sensitivity table. A separately saved reproducibility bundle includes the exact builder, predecessor input workbook, case/reference data and export verification script. The earlier workbookv0.2 and all engine/bridge reports remain preserved.

This is an internal formula-model integration and regression pass. It adds no actual Starlink financial data or new external factual/legal findings. The commercial case remains incomplete and opens with unavailable valuation/fiscal results.

## Changes and integration boundary

The active input panel now requires opening/ending receivables and deferred revenue, separate **other** working-capital changes, and explicit confirmation that unsupported customer adjustments are excluded. Original aggregate-WC input is replaced by other-WC at its existing row; four customer-balance groups are appended rather than shifting every original driver. A new forecast section exposes beginning/ending customer balances, their changes, customer/other working capital, total collections and nonfederal collections.

Private FCFF uses earned revenue less customer-plus-other working-capital changes. Public operating cash uses collections less **other** working capital; customer timing is not deducted twice. Federal cash receipts are limited by collections, rather than by current earned revenue. Negative collections and distributions funded by support still block headline valuation/fiscal results. The native sensitivity continues to vary the actual active WACC and terminal-growth cells; no static sensitivity image or parallel hidden forecast is substituted.

The no-adjustments confirmation is a modeling boundary, not an authentication certificate. Writeoffs, refunds, FX, factoring, reclassifications, unmodeled contract assets and other noncash changes require a later reconciliation if present. Opening acquired balances need separate purchase-price/working-capital treatment. Detailed tax, cash/accrual cost differences, full statements, fleet-age replacement, financing and multi-method appraisals remain outside this workbook.

## Verification

| Check | Result |
|---|---|
| Three zero-timing synthetic cases | EV, equity, nominal/discounted federal cash and all annual FCFF agree with enginev0.2 |
| Four timing cases: lag, prepayment, prior federal collections, combined customer/other WC | EV and nominal/discounted federal totals match engine; all ten annual collections, FCFF, public operating cash, ending cash and net federal cash match |
| Prior federal receivable collection | Opening AR400 permits federal cash1,500 within collections1,600 despite revenue1,200 |
| Native two-variable sensitivity | Base nine-cell grid and two non-base combinations in each timing case agree with independently recomputed discounted cash flows |
| Source, explicit-zero and selected-missing controls | Source absence and missing year-ten inputs block valuation; explicit zero remains valid |
| New customer-balance controls | Missing year-ten receivable balance, unsupported-adjustment flag and negative collections block valuation |
| Funding controls and cash identity | Invalid receipts/distributions rejected; annual cash conservation retained |
| Later-year edit | Changes valuation; restored before export |
| Default commercial case | Missing inputs and unconfirmed adjustment boundary yield unavailable outputs |
| Formula scan | No unexpected spreadsheet errors in final scan |
| Layout | All three sheets and the added cash-bridge section rendered and visually inspected |
| Export/reopen | XLSX integrity and retained native table checked; Artifact Tool reimport recalculates base and prior-federal-collection case |

All numeric controls are **abstract synthetic units**, not Starlink estimates or confidence intervals. Recalculation is verified in Artifact Tool and its export/reimport route. **Desktop Microsoft Excel/LibreOffice execution remains untested**, including native-app sensitivity refresh. No independent accountant, appraiser or budget/counsel/engineering review was obtained.

## Original-requirements crosswalk

Original Item5 ten requirements and five exits remain authoritative, as read in the prior preserved passes; no new completion gate is substituted.

| Original exit | Current contribution | Still open |
|---|---|---|
|1 Perimeter/data appendix|Explicit customer input/source fields|Actual transferable perimeter, audited balances and source authentication|
|2 Transparent workbook|Draftv0.3 now includes the tested collections/WC design|Sourced inputs, detailed schedules, independent/native-application QA|
|3 Multi-method value range|DCF timing formula integration|Real DCF, market/transaction comparables and independent asset/replacement appraisal|
|4 Multi-year forecast|Ten-year collections, WC and federal cash integration|Real contractual costs/forecasts, full statements, financing and fiscal scoring|
|5 Independent review|Regressions, adverse timing cases and limits documented|Actual external professional opinions|

Named interfaces: **Standalone Starlink valuation** and **Fiscal policy and economic impact**, model mechanics only. Billv1.4 is unchanged,31sections. No Item1 title or Item4 public-receipt findings are modified.

## Disposition and remaining work

Closed at draft level: the spreadsheet/engine customer-timing mismatch and predecessor revenue-based federal-cash guard. No repeated integration assignment is needed for those same formulas absent a new defect. Source-backed financial inputs, noncash customer reconciliation where relevant, detailed cash-cost/tax schedules, fleet-age replenishment and native-application/independent review remain material gaps.

Initial coverage7/7; formal0/7 practical and0/36 named;311 proposed scopes retained, substantive audit unfinished. Ten stages3,2,3,3,3,3,3,3,3,3 remain29/50(58%) descriptive maturity. No maturity advancement or congressional readiness is claimed. Existing pursued goal remains incomplete.

Next meaningful financial-model work: fleet-age and replacement-launch schedule, using missing actual inputs and explicit synthetic controls, under its own verified reservation; obtain actual source data and independent review when lawfully available. Do not turn synthetic spreadsheet results into a proposed acquisition price.

## Sources and custody

Project sources: workbookv0.2 `libfile_b3d87082b66081919fcea9bdec187c19`, reproduction package `libfile_5105eaa48c188191bb3e006d51c9a89d`, original Item5 scope `libfile_6fb48b34b25081918d419dda66d8c402`, enginev0.2/report `libfile_40c67988185081919de74e15f6466c09` / `libfile_dd9475a89d108191bc897b2fa85f862e`, and prior bridge/report. Formula design and test controls derive from these saved project artifacts, not newly certified external data. Workflowv2.2 and live tracker229/verified230 and dashboard45 refreshed. Deliverables: successorXLSX, reproductionZIP, and this consolidated report. No external contact, spending or publication.