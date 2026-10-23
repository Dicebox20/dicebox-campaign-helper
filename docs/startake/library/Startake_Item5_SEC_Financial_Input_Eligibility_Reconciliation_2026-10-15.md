# STARTAKE — Item 5 SEC financial-input eligibility reconciliation

**Date:** 15 October 2026 UTC  
**Claim:** `STARTAKE-20261015-WORK-ITEM5-SEC-INPUT-ELIG-41a79c`  
**Owner:** sole STARTAKE inheritor / Codex Work  
**Status:** Bounded source reconciliation complete; formal verification and original Item 5 acceptance remain pending.  
**Perimeter:** Hypothetical compensated acquisition of commercial Starlink communications operations and infrastructure. This report does not treat the SpaceX parent, all Connectivity activities, or Starshield as part of the target.

## Question and method

This pass maps the latest identified public SEC filing’s financial and operating observations to the actual-input rows in the preserved Item 5 workbook v0.3 and its engine v0.2 schema. It reuses the prior Item 5 SEC carve-out audit rather than repeating its financial-statement audit. It is not a valuation, forecast, company carve-out, appraisal, Deep Research execution, or professional opinion.

I read the original Item 5 scope, its ten research requirements and five exit deliverables, the prior SEC carve-out report, the engine and workbook reports, and the saved workbook’s Assumptions sheet. The workbook has 34 actual-case drivers. All actual-case values remain blank and are marked missing; the actual valuation date and perimeter are also unpopulated. No workbook, engine, bill, or statutory acceptance status was edited under this assignment.

The source reviewed is Space Exploration Technologies Corp.’s Form 10-Q for the six months ended 30 June 2026, filed 4 August 2026. It reports dated subscriber metrics, a combined Connectivity segment, and company-wide consolidated cash-flow and balance-sheet amounts. Those three disclosure levels are not interchangeable.

## Finding

Only two directly reported Starlink-specific metrics are potential model reference inputs, and both are definition- and date-bound:

1. **Starlink subscribers:** 12.0 million unique service lines at 30 June 2026. The filing defines a subscriber as a service line assigned to a Starlink.com account that does not have a direct negotiated agreement with Starlink’s sales team. The metric includes personal and certain business plans, but excludes managed enterprise and government customers in areas such as aviation, maritime, land mobility, fixed sites, and government. A service line is not a unique person, device, or account holder.
2. **Starlink Subscriber ARPU:** $66 per month for both the three- and six-month periods ended 30 June 2026. The filing calculates this using subscriber-generated service revenue divided by average subscribers and months in the period.

These metrics are **direct Starlink-specific evidence**, but they do not support filling the workbook’s current actual case without first setting a matching valuation date, period, and perimeter and confirming that the model’s “monthly net ARPU” uses the same revenue definition. The workbook’s “opening service lines” input must also refer to the same date and subscriber population. They are dated observations, not a churn series, cohort schedule, or ten-year forecast.

The SEC’s Connectivity amounts are **restricted segment-level proxies**. Connectivity includes Starlink broadband and mobile services and kit sales to consumer, enterprise, and government customers. The segment also records certain multi-year Starshield revenue recognized using a cost-to-cost method. Its costs include satellite, launch, ground, kit, labor, R&D, and allocated corporate expenses. Segment D&A and capital expenditure do not isolate commercial Starlink assets or replacement requirements. The prior SEC audit already records the segment amounts and concludes they are not standalone commercial Starlink cash flows; this pass does not recalculate those figures.

Company-wide cash, debt, taxes, receivables, deferred revenue, and operating cash flow are **unavailable as commercial Starlink inputs**. The filing provides consolidated company data, not a Connectivity balance sheet, cash-flow statement, tax schedule, or cash-collection bridge. No entity-level bridge allocates those balances to commercial Starlink.

## Filed data and model-use boundaries

| Filed disclosure | Period, unit, and population | Eligibility | Boundary for the workbook |
|---|---|---|---|
| Starlink subscribers | 12.0 million service lines at 30 June 2026; period-end count | Direct Starlink-specific evidence | Candidate reference for Assumptions row 20 only if the chosen valuation date and the model’s opening-line definition match. Excludes managed enterprise/government customers. Not unique people or terminals. |
| Starlink Subscriber ARPU | $66 per month for Q2 2026 and H1 2026; subscriber-generated service revenue divided by average subscribers and months | Direct Starlink-specific evidence | Candidate historical reference for row 95 only after confirming that “net ARPU” uses the same revenue numerator, customer population, period convention, and treatment of kit sales. No plan, geography, cohort, or churn split. |
| Connectivity revenue, consumer and Enterprise & Government categories | Six months ended 30 June 2026; USD millions; reported segment and business categories | Restricted segment-level proxy | Do not load as commercial Starlink “other revenue” or infer a government cash receipt. Categories do not disclose a commercial-only carve-out or the Starshield allocation. |
| Connectivity cost of revenue, R&D, and SG&A | Six months ended 30 June 2026; USD millions; segment accrual expenses | Restricted segment-level proxy | Do not load as “cash opex excluding manufacture/launch.” Segment expenses include depreciation, kits, launch/satellite/ground costs, development, and allocated functions; the filing does not provide a commercial-only allocation. |
| Connectivity D&A | Six months ended 30 June 2026; USD millions; segment amount | Restricted segment-level proxy | Does not identify commercial-only assets, useful lives, launch costs, Starshield allocation, or standalone D&A. |
| Connectivity capital expenditure | Six months ended 30 June 2026; USD millions; segment amount | Restricted segment-level proxy | Does not split commercial Starlink, Starshield, satellites, gateways, kits, manufacturing, or other capex. Not a replacement or “other capex” schedule. |
| Segment operating income | Six months ended 30 June 2026; USD millions; segment accrual measure | Restricted segment-level proxy | Not FCFF, cash flow, or a commercial Starlink margin. It does not resolve tax, working capital, cash timing, Starshield, or shared-cost allocations. |
| Consolidated balance sheet and cash-flow measures | Company-wide; point-in-time balances and six-month cash movements | Unavailable for target inputs | No Connectivity-only cash, debt, taxes, receivables, deferred revenue, or net working capital schedule. Company totals cannot be prorated into the target. |

The filing says no inter-segment revenue is recognized for launches of Starlink satellites; those launch costs are capitalized in satellite property, plant, and equipment. It also says significant launch capacity is allocated to Connectivity. Its company-wide internal-launch counts do not identify the Starlink-specific launch count or cost. No actual commercial Starlink manufacturing unit cost, satellite production count, purchased-launch schedule, or replacement-cost series is disclosed in this filing.

Revenue recognition is not a cash-receipts schedule. Broadband and mobile service revenue is recognized over time. Certain Starshield revenue is recognized over time using a cost-to-cost method; kit revenue is recognized on delivery or installation. The filing’s operating cash flow, receivables, deferred revenue, and taxes are consolidated across the company and cannot populate the workbook’s standalone customer-collection, public-cash, or tax rows.

## Input-by-input eligibility

Workbook row numbers refer to the **Assumptions** worksheet in the preserved workbook v0.3. “Direct” means the SEC filing reports the defined Starlink metric itself; it does not mean that the current actual-case forecast cell is populated or that the observation is a target-company financial statement.

| Row(s) | Workbook driver(s) | Classification | Filing-based disposition |
|---|---|---|---|
| 20 | Opening service lines | Direct, bounded | The 30 June 2026 service-line count can be a dated reference only when the model valuation date and included population match. The actual valuation date is missing, so retain the actual input as missing. |
| 25, 30, 35 | WACC; terminal growth; fiscal discount rate | Unavailable | The filing supplies no target-specific market discount rate, terminal growth, or public-fiscal discount assumption. These are valuation and policy inputs, not reported Starlink actuals. |
| 40, 45, 50 | Net debt; other equity claims; nonoperating assets | Unavailable | No standalone commercial Starlink capital structure, debt allocation, equity claims, cash, or nonoperating-asset schedule. Parent-company amounts are not a proxy for the acquired perimeter. |
| 55, 60, 65, 70, 75, 80 | Purchase consideration; debt payoff; transaction fees; separation cost; incremental opening working capital; opening reserve | Unavailable | No actual transaction, acquisition perimeter, closing terms, transferable-liability schedule, or operating cash-reserve policy exists in this filing. |
| 85, 90 | Gross line additions; annual churn | Unavailable | Period-end service-line counts do not separate gross adds, disconnects, plan changes, or subscriber cohorts. A two-point count change cannot determine churn. |
| 95 | Monthly net ARPU | Direct, bounded | The reported $66 monthly ARPU is a candidate reference only after reconciling the model’s “net” definition, date, customer exclusions, and revenue numerator to the SEC definition. Do not extend it across forecast years. |
| 100 | Other revenue | Restricted segment-level proxy | Connectivity revenue includes service revenue and kit sales across customer types and includes certain Starshield contract revenue. No commercial-only residual or target-specific category is provided. |
| 105 | Cash opex excluding manufacture and launch | Restricted segment-level proxy | Segment expense categories combine cash and noncash items, Starshield, kits, launch/satellite/ground costs, development, and allocated functions. The filing does not supply the required target split or cash basis. |
| 110 | Depreciation | Restricted segment-level proxy | Connectivity D&A is reported, but the underlying commercial, Starshield, launch, satellite, ground, and shared-asset allocations are not separated. |
| 115, 120 | Private cash taxes; public external cash taxes | Unavailable | There is no standalone Starlink cash-tax schedule or acquisition-specific public tax schedule. Consolidated tax disclosures do not allocate to the target. |
| 125, 130 | Satellites manufactured; manufacturing unit cost | Unavailable | No target-specific annual production quantity or commercial Starlink manufacturing cost per unit is reported here. |
| 135, 140 | Launches purchased; launch unit cost | Unavailable | Company-level launch counts and internal-launch classifications do not identify launches purchased by commercial Starlink or arm’s-length unit costs. Starlink launch costs are capitalized, not billed between segments. |
| 145 | Other capex | Restricted segment-level proxy | Connectivity capex is reported only in aggregate. It does not identify commercial asset classes or separate replacement, manufacturing, launch, ground, or other capital needs. |
| 150 | Delta other working capital | Unavailable | No Connectivity-only working-capital schedule is disclosed. Consolidated changes mix all reportable businesses and do not reconcile to the acquired commercial perimeter. |
| 155, 160, 165 | Minimum cash reserve; Federal customer cash receipts; treasury distributions | Unavailable | The filing does not establish a target reserve policy, commercial Starlink federal cash collections, or public-corporation distribution policy. Enterprise & Government revenue is not a cash-receipt measure. |
| 170, 175, 180, 185 | Opening/ending receivables; opening/ending deferred revenue | Unavailable | The filing provides consolidated balances and movements only. No standalone customer balance or transferability schedule is available for the commercial target. |

**Eligibility totals:** two drivers have direct but bounded Starlink metric evidence; four have restricted Connectivity segment proxies; the remaining 28 drivers are unavailable from this SEC filing for a commercial Starlink actual input. All 34 current actual-case inputs remain blank/missing in the preserved workbook.

## Original Item 5 requirements and exit deliverables

The original Item 5 specification governs. This input map advances evidence classification only; it does not close a checklist requirement.

| Original requirement | Result of this pass | Remaining evidence |
|---|---|---|
| 1. Fix valuation date, perimeter, ownership, and separable assets | Not satisfied | Dated legal and economic perimeter, owner map, asset/right schedule, and exclusions. |
| 2. Obtain current and historical Starlink-relevant financials and allocate shared costs | Partial, at public segment level | Audited or source-auditable commercial-only financial bridge with costs, cash, assets, liabilities, taxes, and shared allocations. |
| 3. Reconcile commercial Starlink and Starshield/shared operations | Partial | Revenue, costs, assets, contracts, workforce, and launches allocated to included and excluded activities. |
| 4. Model subscribers, ARPU, churn, capex and service costs | Partial | Dated cohorts, additions, churn, prices, plan mix, unit cost, cash timing, lifecycle replacement, and evidence-supported forecasts. |
| 5. Produce DCF, comparables, and asset/replacement scenarios | Not satisfied | Independently supported multi-method estimates and consistent assumptions. |
| 6. Account for rights, contracts, taxes, labor, debt, liabilities, and working capital | Not satisfied | Transferability and allocation schedules, tax and cash timing, debt/claims, opening balances, and obligations. |
| 7. Separate government receipts/support, investment funding, and owner value | Not satisfied | Source-linked Federal cash and contract ledger, allocations, financing terms, and owner-value bridge. |
| 8. Show base/downside/upside sensitivities | Not satisfied with actual inputs | Reproducible scenario inputs and adverse cases grounded in supported target data. |
| 9. Build a ten-year operating and financing forecast | Not satisfied | Source-backed operating, cash, capital, financing, and public-cost schedules. |
| 10. Reconcile to just-compensation analysis and independent review | Not satisfied | Separate legal compensation analysis plus independent accounting, appraisal, engineering, budget, and legal review. |

The five original exit deliverables remain open: a complete perimeter and source appendix; a transparent workbook with source/date per variable; supported valuation ranges by method; a multi-year operating and financing forecast; and an independent-review memo. Existing workbook v0.3 is a tested draft with synthetic fixtures, not a populated commercial model. Its actual-case missing-input guards remain appropriate.

## Bill crosswalk and disposition

The current integrated working bill v1.4 already includes the principal evidence and accounting controls raised by this reconciliation:

- **Section 103(d)–(g)** requires a dated perimeter and source-limit record, a multi-method appraisal record, reconciliation of earnings to cash including allocations, taxes and capex, replacement-cost boundaries, explicit unavailable inputs rather than zeros, and updates before commitment and closing.
- **Section 208(c)** requires the annual operating budget to identify launch and replacement costs, shared-service charges, affordability support, security, depreciation, reserves, actual obligations/outlays, and unfunded requirements.
- **Section 301(b)–(c)** requires a ten-year budget, common financial basis, cash-versus-accrual measures, service receipts and uncollected receivables, public outlays, and nonduplicative funding/valuation treatment.
- **Sections 401–402** require launch, manufacturing, replenishment and dependency planning plus tested service-continuity gates.

This evidence does not demonstrate an omission requiring a statutory edit. The cited sections are proposed bill language, not proof that the requested schedules or reviews exist. No bill change is recommended under this assignment.

## Disposition

**Research pass complete; formal verification pending. Item 5 remains unchecked.** The filing directly supports only a dated service-line count and a bounded ARPU observation. Connectivity accounting figures remain segment proxies; commercial Starlink cash flow, working capital, tax, debt, replacement costs, and acquisition terms remain unavailable. No valuation range, FCFF, standalone margin, government cash receipt, or compensation figure is derived here.

This pass contributes evidence-eligibility notes to the named topics **Standalone Starlink valuation**, **Fiscal policy and economic impact**, and **Launch/manufacturing/technical independence**. It does not complete any of those topics. Initial coverage remains 7/7; formal acceptance remains 0/7 practical and 0/36 named; all 311 proposed scope texts remain preserved and unaudited; descriptive maturity remains 29/50; overall congressional readiness remains unestablished.

## Sources and custody

- [Space Exploration Technologies Corp., Form 10-Q for the quarter ended 30 June 2026](https://www.sec.gov/Archives/edgar/data/1181412/000162828026052535/spcx-20260630.htm), filed 4 August 2026. Relevant filing sections: segment results and supplemental segment information; “Connectivity” subscriber and ARPU definitions; “Revenue—Connectivity”; “Expenses—Connectivity”; consolidated balance sheet and statements of cash flows.
- Original Item 5 specification: Library `libfile_6fb48b34b25081918d419dda66d8c402`.
- Prior Item 5 SEC carve-out audit: Library `libfile_1a766ca5fff08191b8d061d3746b784a`.
- Original requirements authentication: Library `libfile_9027017d96d88191b360fbc3bff197d8`.
- Preserved engine v0.2 report: Library `libfile_dd9475a89d108191bc897b2fa85f862e`.
- Preserved workbook v0.3 report and workbook: Library `libfile_68a8856723b08191b02b40c40e580308` and `libfile_f41005b4791c81918bd8896a306eb3ad`.
- Current integrated working bill v1.4: Library `libfile_03ca9a5a45288191a4b45522926265aa`.

No external party was contacted. No confidential or management-provided data was available. No workbook, bill, source file, or formal checklist was changed.