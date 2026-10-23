# Item 5 — Transparent financial workbook and validation report

**Date:** 15 October 2026 UTC. **Claim:** `STARTAKE-20261015-WORK-ITEM5-WORKBOOK-3ca851`. **Owner:** sole STARTAKE inheritor / Codex Work. **Reservation:** conditional tracker 223→224; independently materialized and byte-compared before authoring. **Status:** Research/drafting pass complete — formal verification pending.

## Result

Created `Startake_Financial_Workbook_v0.2_2026-10-15.xlsx`, a formula-based spreadsheet companion to the preserved executable financial model v0.1. It supplies the previously missing workbook format in **draft** form. It is not a sourced commercial Starlink valuation, appropriation estimate, independent appraisal, or official budget score. The real commercial case defaults to missing inputs and unavailable outputs.

A reproducibility ZIP contains the exact builder, export verification script, original case inputs and reference outputs, and arithmetic verification results. The existing v0.1 ZIP/report are preserved, not replaced. Version v0.2 describes the new spreadsheet companion, not a changed Python engine or bill.

## Inputs, calculations and controls

Three sheets serve distinct functions:

- **Summary:** selected case, enterprise/equity measures, closing uses, nominal and discounted ten-year federal cash, ending operator cash and material limitations.
- **Assumptions:** one case selector (1 actual; 2 synthetic base; 3 synthetic downside; 4 synthetic upside), active rows above four input cases, source/date/status fields for every driver, valuation-date/perimeter/scale metadata, and a native two-variable WACC/terminal-growth sensitivity table.
- **Forecast:** ten annual service-line, revenue, cost, capex, private FCFF, public cash, operating-support, distribution, discounting, closing-use and enterprise/equity schedules. Subsequent opening balances link to prior closing balances.

The spreadsheet follows the preserved model's equations and sign/timing conventions. It checks numeric completeness, allowed sign/churn bounds, provenance-field presence/status and discount-rate restrictions. Selected blanks cannot silently become zero; explicit zero remains valid. Missing unselected actuals do not prevent a synthetic case from calculating. Unsupported distributions or federal customer receipts exceeding modeled revenue block valuation and fiscal headline results.

The sensitivity is a native two-variable What-If Data Table, using the actual active WACC/growth input cells on Assumptions and the calculated enterprise-value output. It is not an image or a hardcoded case grid. Inputs are restored after table evaluation. Cases share one forecast rather than parallel hidden forecasts. The delivered file opens with case 1 selected and unavailable real-case output.

## Verification and practical limits

| Check | Observed result |
|---|---|
| Three synthetic cases versus preserved Python engine | Enterprise value, equity, nominal federal cash and discounted federal cash matched within relative tolerance 1e-7; all 30 annual FCFF values matched |
| Independent base arithmetic | Constant FCFF 430 / WACC 0.10 = EV 4,300 abstract units; closing uses 550 + federal customer payments 1,200 = nominal fiscal cash 1,750 units |
| Adverse synthetic result retained | Downside EV approximately −798.23 abstract units; no acquisition-favorable floor inserted |
| Native sensitivity | All nine cells matched independently recomputed discounted cash flow; WACC and growth returned to selected-case values |
| Cash reconciliation | All ten base-case annual conservation differences equal zero within tolerance |
| Selected missing year-ten ARPU | Valuation became unavailable |
| Explicit zero year-ten private tax | Model remained calculable |
| Missing selected WACC source | Valuation became unavailable |
| Late-period input change | Changed enterprise value; restored afterward |
| Default actual case | Unpopulated actual inputs produced unavailable valuation and fiscal results |
| Formula error scan | No unexpected spreadsheet errors in final scan |
| Layout | Rendered and visually inspected all three sheets; input warnings, case control and all ten forecast years legible |
| Export/reopen | XLSX ZIP integrity passed; XML contains native data-table formula; Artifact Tool reimport, case change and recalculation reproduced base EV ≈4,300 and sensitivity results |

Calculation and export/reimport were verified using Artifact Tool. **Desktop Microsoft Excel and LibreOffice execution were not performed.** Native-application Data Table refresh and workbook protection/accessibility behavior therefore remain external QA items; export success alone is not claimed as that QA.

No statistical uncertainty bands are inferred from the three synthetic cases. They are arithmetic fixtures, not calibrated forecasts. All monetary examples use abstract test units; operational quantities and rates retain their own dimensions. Real inputs must use a consistent monetary scale and per-unit prices. Dates in the preserved fixture provenance are retained as ISO source text; no independent source authentication is performed by those fields.

The simplified engine treats modeled revenue as cash-equivalent, subject to supplied working-capital changes. Separate collections/accrual timing, customer deposits, detailed cohorts, fleet-age replacement, balance sheet, contingent liabilities, employee equity, detailed tax schedules, financing costs and three-statement forecasts remain absent. Current bill v1.4 grants no modeled borrowing authority; this workbook inserts no debt issuance. Private WACC and fiscal discount rate remain distinct. Cash reserves are closing/working cash uses rather than recurring expenses. Federal customer payments remain federal cash outlays even when operator receipts.

## Authenticated original Item 5 crosswalk

The original `Starlink_Only_Valuation_and_Financial_Model.md` (Library `libfile_6fb48b34b25081918d419dda66d8c402`) and existing model report (`libfile_7044c12f19388191b1521817a9c52f96`) were read in full before reservation. This table preserves the five original exit deliverables; it does not substitute new acceptance criteria.

| Original exit deliverable | Current contribution | Remaining requirement |
|---|---|---|
| 1. Versioned Starlink-only perimeter and source-auditable data appendix | Metadata locations preserved | Actual legal/economic perimeter and authenticated data absent; Item 1 untouched |
| 2. Transparent financial workbook with formulas, sources/dates and sensitivities | Draft XLSX now supplied and arithmetic checked | Populate authenticated data; add detailed schedules; independent finance and native-Excel review |
| 3. Standalone valuation range by method | DCF mechanics and synthetic sensitivities | Real DCF, market/transaction comparables and independent replacement/asset valuation absent |
| 4. Multi-year operating/financing forecast | Ten-year cash/closing/DCF structure available as formulas | Real assumptions, contractual costs, financing and fiscal scoring unresolved |
| 5. Independent-review memo | Limitations and contrary synthetic case documented | Independent appraiser, accountant, engineer, budget specialist and counsel opinions absent |

The original ten research/model requirements also remain in force: date/perimeter; source financial history; commercial/Starshield separation; operating/replacement drivers; multiple valuation methods; rights/tax/labor/debt/working capital; public-support versus value distinction; sourced scenarios/uncertainty; ten-year public finance; separate compensation and independent review. This workbook contributes to the formula/driver/scenario/cash portions only. It does not verify any parent topic or original exit deliverable as substantively complete.

Named-topic interfaces are **Standalone Starlink valuation** and **Fiscal policy and economic impact**, limited to model mechanics. No new Item 4 receipts ledger or Item 1 ownership findings. No newly verified financial/legal source claim is added; all external methodological findings remain in the prior model report rather than being silently refreshed here.

## Bill, maturity and remaining work

Bill v1.4 remains unchanged, 31 sections. §§103, 208 and 301–303 remain the proposed appraisal, account and financial framework; the workbook does not authorize a payment or decide just compensation.

No maturity stage advances: valuation and finance already stood at Stage 3 for the executable model. The workbook improves a concrete missing format while material data and review gaps prevent Stage 4. Ten stages remain **3,2,3,3,3,3,3,3,3,3 = 29/50 (58%)** descriptive maturity. Initial research coverage **7/7**; formal acceptance **0/7 practical and 0/36 named**; **311 proposed scopes retained, substantive audit pending**. Congressional readiness remains unestablished.

Next useful model work is an authenticated commercial-input/source ledger, a cash-collection and working-capital bridge, fleet-age replenishment schedule, or independent native-application/finance QA, each under its own verified scope. Do not populate the model with parent/Connectivity figures as commercial-only data without a defensible reconciliation. Do not repeat the missing workbook-format claim now that this draft exists.

## Deliverables and custody

1. `Startake_Financial_Workbook_v0.2_2026-10-15.xlsx`.
2. `Startake_Financial_Workbook_v0.2_Reproducibility.zip`.
3. This consolidated report.

Original engine source: `The_Starlink_and_Stripes_Act_Financial_Model_v0.1.zip`, Library `libfile_4ded56fc40c08191aebd9113edc0464d`; original model report and Item 5 scope identified above. Workflow v2.2, tracker actual223/verified224 and dashboard42 reviewed. Claims, evidence and prior reports preserved. No external contact, spending or publication.