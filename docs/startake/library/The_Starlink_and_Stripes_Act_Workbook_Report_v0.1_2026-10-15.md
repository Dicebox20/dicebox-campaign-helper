# The Starlink and Stripes Act — Financial Workbook Report v0.1

15 October 2026 UTC. Assignment `STARTAKE-20261015-WORK-WORKBOOK-83e0a4`, sole STARTAKE Work inheritor. Actual reservation source 159; claim independently verified in canonical tracker 160. This is a financial-model implementation and validation pass under activated Workflow v2.2. It is not an executed Deep Research job, a new appraisal, a legal opinion, an independent professional review or acceptance of Item 5.

## Result

An editable eight-sheet, ten-year workbook now implements subscriber and equipment/service revenue, operating cash flow, capital additions and depreciation cohorts, acquisition sources/uses, operating liquidity, hypothetical debt service, private DCF and equity bridge, consolidated federal cash and discount/terminal-growth sensitivity. It opens on the commercial case with unavailable results because required commercial inputs are missing. Three selectable synthetic fixtures exercise calculations; none is an estimate of Starlink value.

The workbook is `The_Starlink_and_Stripes_Act_Financial_Workbook_v0.1_2026-10-15.xlsx`. A reproducibility bundle accompanies this report with the builder, synthetic fixtures, test records and refresh instructions. Original Python model v0.1, financial audits, bill v0.2 and original requirements remain preserved. This successor implements additional schedules rather than overwriting those records.

## Model use and input meaning

Set **Assumptions D4** to 1 Commercial, 2 Synthetic base, 3 Synthetic downside or 4 Synthetic upside. One selected case feeds one forecast build. Each driver group shows Active followed by the four editable cases. S:U holds source/rationale, as-of date and evidence status for that driver series. The commercial value cells and provenance begin blank; statuses must distinguish Sourced from Assumption. A numeric cell alone does not authenticate its value. A source for a ten-year driver series must support or explain the entire series; materially different annual sources need an explicit schedule/reference.

Commercial valuation date and perimeter reference are editable at I7/I8 and remain blank. Years 1–10 are relative forecast periods beginning after a hypothetical closing, not claims of actual calendar-year performance. Filling the numeric model does not validate a date, perimeter, transferable assets, market access or appropriations. The Summary expressly remains a scenario, not an appraisal. All 237 required commercial numeric cells begin blank; this is an input count, not a research-acceptance denominator.

The Source data sheet retains six dated issuer reference measures with their units, scope and original URLs. They do not feed the forecast automatically. In particular, mixed reporting-segment amounts cannot silently populate commercial-only inputs. Sources were reopened on 15 October 2026; the saved disclosure audit's definitions and limitations remain controlling. Historic source data stay fixed while cases change.

**Operating-cost basis:** use operating costs before working-capital settlement timing, excluding the separately modeled manufacturing/launch capital costs and noncash depreciation. Change in working capital must consistently reconcile collections, inventory and payment timing; do not enter already cash-settled costs and then deduct the same payable adjustment again. Other contracted services and equipment revenue must be mutually exclusive from subscriber revenue. Equipment production and support costs belong in the appropriate operating/capital categories; the workbook supplies no actual terminal margins.

## Schedules and calculation conventions

| Schedule | Implemented calculation | Material boundary |
|---|---|---|
| Operations | Opening lines, churn and gross additions; midpoint average lines; subscription ARPU; separate contracted-service and equipment revenue; operating income and unlevered cash flow | Midpoint line average is an explicit simplification, not a historical weighted average; no geographic/cohort/plan detail or tax-loss model |
| Capital | Satellite manufacture and purchased launch quantities × cost, other capex, composite annual vintage depreciation, opening/ending net capital assets | Full-year straight-line depreciation, zero salvage, integer lives, no disposals/impairment; not a physical satellite-retirement or engineering-capacity model |
| Funding | Seller consideration, closing payoff/fees/separation/WC/reserve, Treasury contribution, cash reserve support, federal customer payments and distributions | Purchase consideration stays independent from enterprise/equity value; cash illustration is not an official federal score |
| Debt | Closing borrowing, retained debt, new draws, cash interest, principal and ending debt | Entirely hypothetical: bill v0.2 grants no borrowing authority. New operating draws are treated as midyear for interest; principal pays at year-end; retained/closing debt accrues full-year interest |
| Valuation | Year-end discounted unlevered cash flows, Gordon terminal value, enterprise-to-equity adjustments and terminal-value share | Discount rate must exceed terminal growth; negative economic outcomes remain visible; terminal replenishment and public-service obligations require independent sustainability analysis |
| Review | Capital, cash, debt, federal and closing sources/uses reconciliation; commercial input coverage | Terminal review area only: no assumptions, forecast or summary result reads from Review. Coverage is not evidence authenticity |

Private cash taxes and public external cash taxes are distinct inputs. No tax benefit, debt guarantee, investment return or borrowing permission is inferred. The fiscal illustration reflects Treasury closing contribution plus ongoing support and federal customer payments less distributions. Borrowing reduces current contribution but creates debt-service and potentially contingent exposures. Guarantee/subsidy valuation, Treasury-wide financing interest, tax receipts forgone, macroeconomic effects and an official budget score are not modeled. Debt outstanding after year 10 remains visible and must not be treated as discharged.

## Sensitivity compatibility

The native two-variable What-If Data Table uses the actual WACC/growth cells driving DCF on Valuation. Its nine combinations calculate correctly in the artifact engine and survive XLSX export/import. **LibreOffice's native TABLE calculation returned unavailable results**, although the core forecast recalculated. Excel desktop has not been tested. This limitation is labeled in the workbook, including Summary and the native table heading.

A separate, clearly labeled **formula sensitivity** reuses the completed ten annual private cash flows through NPV and the terminal-value formula. It does not rebuild subscribers, costs or capex. It provides a small, self-contained discount/growth calculation that can be checked across engines. It is not presented as a live operating-scenario comparison or a replacement for changing the authoritative case selector. Native-table Excel compatibility remains pending.

## Verification

The builder tests all ten years of each synthetic case against an independent calculation of the original model's private cash flow, operator cash balance, DCF and nominal federal cash. It tests capital vintage depreciation and ending net assets against separately calculated controls. It also tests scenario selection, a later-year ARPU change, a blank inactive case, selecting the incomplete case, actual zero versus blank, provenance prerequisites, invalid terminal growth, nonzero debt and over-repayment, and preservation of source actuals. All temporary edits are restored; the delivered workbook opens on Commercial.

Synthetic arithmetic controls, in **abstract test units only**: base enterprise value approximately 4,300; downside approximately −798.23; upside approximately 15,495.33. Base nominal federal cash 1,750. These numbers are test outputs, not empirical ranges, compensation or proposed appropriations. A negative case is retained rather than adjusted to favor acquisition.

The final artifact-engine formula scan found no Excel error cells. All eight sheets were rendered and visually reviewed; populated synthetic Summary, Capital, Funding and Valuation views were also checked. Tests distinguish explicit zero from missing data. A first-pass blank-comparison coercion defect was corrected with explicit blank detection before delivery.

Temporary exported copies were reopened/recalculated through LibreOfficeDev 26.8.0.0.alpha0 for additional engine verification. The commercial case retained unavailable valuation/fiscal results; the synthetic base's core calculations matched the independent controls. Formula-grid and native-table compatibility findings are recorded separately in `native_validation.json`. LibreOffice-converted test copies are not delivered as alternative final workbooks. No Excel-desktop execution, independent financial assurance or completed source due diligence is claimed.

## Original Item 5 scope and five exit deliverables

The original Item 5 specification was independently reread in full. The rows below condense its ten requirements without changing them. All remain formally unchecked.

| Original requirement | Contribution in this pass | Remaining acceptance gate |
|---|---|---|
| Valuation date, perimeter, ownership and separable assets | Explicit date/perimeter fields; commercial and synthetic scopes separated | Actual legal/economic perimeter, title and selected transaction date |
| Current/historic financials and supported allocations | Historical reference data, per-driver provenance and preserved source audit | Commercial carve-out financial statements and supported shared-cost allocations |
| Starshield and unrelated SpaceX exclusions | Commercial input convention and no automatic mixed-segment forecast links | Contract/asset/workforce/software allocation evidence |
| Subscribers, ARPU, costs, capex, lifetimes and launch | Driver build, revenue separation, capital-cost/vintage schedules | Physical fleet age/replacement, terminal economics, monthly/geographic cohorts and calibrated forecasts |
| DCF, market/transaction and replacement approaches | Editable DCF and two rate sensitivity implementations | Supported comparables, replacement-cost appraisal and defensible multi-method range |
| Assignability, IP, taxes, labor, debt and working capital | Explicit cash-tax/WC/consideration/debt fields and bridge caveats | Rights/contracts, contingent/employee claims, tax attributes and agreed services |
| Historic public receipts/support versus owner value and fiscal cost | Separate seller price, valuation and federal cash; no public-funding credit invented | Item4 transaction ledger and wealth-attribution evidence remain separate |
| Downside/base/upside and uncertainty | Selectable synthetic fixtures and live rate tests; negative outcome retained | Source-supported economic, regulatory, launch, cyber and country-interruption scenarios |
| Ten-year operating and financing pro forma | Linked ten-year workbook, capital cohorts, liquidity and debt schedule | Populated forecast, full balance-sheet/tax/fleet detail, actual financing and official scoring |
| Compensation-law and independent review | Review questions and explicit distinction from price/compensation | Appraiser, counsel, engineering, privacy, accounting and budget opinions |

Exit 1 perimeter/data appendix: partial, actual perimeter missing. Exit 2 transparent workbook: concrete editable workbook delivered with tests and provenance fields; source completion/native Excel validation remain open. Exit 3 standalone multi-method range: absent. Exit 4 real multi-year forecast: structure delivered, actual case unpopulated. Exit 5 independent-review memorandum: internal caveat/review queue provided; independent review absent. No completed formal gate follows from a file's existence.

## Original named-topic matrix

Exact nine headings below come from the authenticated Standalone Starlink valuation framework preserved in the original-requirements report/custody bundle. Subject text recovery is not completed evidence research.

| Original subject | Workbook contribution | Status |
|---|---|---|
| Commercial broadband revenue | Subscriber, contracted-service and equipment builds | Partial; no real commercial reconciliation |
| Government and Starshield revenue allocation | Source boundary and separate fiscal receipts | Partial; allocation evidence missing |
| Subscriber economics | Gross additions/churn/ARPU and midpoint convention | Partial; cohorts/acquisition cost/history missing |
| Profitability and cash generation | Cash-flow bridge, working capital and tax inputs | Partial; actual data and full accounting bridge missing |
| Constellation asset value and depreciation | Cash capex and composite vintage depreciation | Partial; physical fleet/replacement appraisal missing |
| Spectrum and intangible asset valuation | Perimeter/source fields and explicit excluded unknowns | Open; no rights appraisal |
| Debt, liabilities and nontransferable obligations | Equity bridge, closing payoff and hypothetical debt service | Partial; real liabilities/guarantees/rights evidence missing |
| Valuation approaches and compensation standard | DCF, sensitivity and price/value distinction | Partial; other methods and independent compensation review missing |
| Parent-company value attribution | No parent valuation or market-cap shortcut used | Partial; supported carve-out still needed |

## Contrary cases and professional review queue

An editable workbook can give false precision if uncertain rights, capacity, tax, replenishment or standalone cost assumptions are entered as facts. Denied permissions, replacement delays, supplier withdrawal, lower effective ARPU and public-access obligations may invalidate a terminal growth assumption. Composite depreciation is an accounting illustration and does not prove sustainable fleet replenishment. A public operator faces political and surveillance risks that a financial model does not resolve.

A common-basis acquisition-versus-regulation/contract/competition assessment still needs real quotes, equivalent missions, dates, service quality, international permissions and lifecycle costs. This workbook does not choose the winning policy. Public ownership remains the objective; unfavorable or inconclusive economic evidence must stay visible.

Before congressional use, reviewers must authenticate inputs and the carve-out; reconcile cash and accounting definitions; assess asset lives and replacement; validate public/private tax treatment; evaluate debt and guarantees against actual authority; test Excel's native Data Table; evaluate terminal sustainability and external comparables; determine compensation and fiscal scoring. No outside person was contacted or represented as having approved the model.

## Bill implications and disposition

The workbook supports proposed bill §§103,104,208,301–303 and404 by making compensation assumptions, funding needs, liquidity and alternatives costs inspectable. It supplies no dollar amount for an appropriation or seller offer. The hypothetical borrowing schedule would require appropriate new authority before use and does not amend v0.2 by implication. No bill section changed in this assignment.

After verified saving, refresh the actual canonical conditional version, release only WORKBOOK-83e0a4 and reconcile the dashboard. The ten descriptive document stages remain 3,2,3,3,3,3,3,3,3,3=29/50. A richer Stage3 model does not make it Stage4 while material factual/legal gaps remain. Overall congressional readiness is unestablished. Initial coverage 7/7; formal practical 0/7 and named 0/36; 36 original frameworks/311 proposed scopes recovered, not substantively accepted. Next unblocked research should target real comparable/replacement evidence or public-source asset/permission/legal gaps rather than silently filling private unknowns.

## Sources and preserved provenance

- [Original Item 5 specification](Starlink_Only_Valuation_and_Financial_Model.md), stable libfile_6fb48b34b25081918d419dda66d8c402; full requirements reread for this scope.
- [Model report v0.1](The_Starlink_and_Stripes_Act_Valuation_Funding_Model_Report_v0.1_2026-10-15.md), stable libfile_7044c12f19388191b1521817a9c52f96; prior ZIP libfile_4ded56fc40c08191aebd9113edc0464d. Original synthetic fixtures preserved in reproducibility bundle.
- [Current Financial Disclosure Audit](The_Starlink_and_Stripes_Act_Current_Financial_Disclosure_Audit_v0.1_2026-10-15.md), stable libfile_d1a4777817b08191820283aa4523a176; source eligibility and limitations reused rather than counted again as research.
- [Original Requirements Authentication](Startake_Original_Requirements_Authentication_36_Topics_311_Subcategories_2026-10-15.md), stable libfile_9027017d96d88191b360fbc3bff197d8; unchanged custody bundle libfile_083fe8c435148191b127f221d0e8ef5c.
- [Issuer Q2 Form10-Q](https://www.sec.gov/Archives/edgar/data/1181412/000162828026052535/spcx-20260630.htm), Note2/Note18 and MD&A business metrics/Connectivity; [issuer earnings release](https://www.sec.gov/Archives/edgar/data/1181412/000162828026052515/earningsreleaseq22608042.htm), Connectivity table. Official-hosted original documents reopened 15 October 2026; company statements remain attributed. Not independent commercial financial assurance.
- [GAO-20-195G](https://www.gao.gov/products/gao-20-195g), original cost-estimating methodology, reopened 15 October 2026; supports documenting assumptions, risk and source limitations, not approval of this transaction or rate selection.