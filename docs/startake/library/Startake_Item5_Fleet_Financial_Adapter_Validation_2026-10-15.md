# Item 5 — Fleet-financial adapter validation v0.1

Project date15October2026. Claim STARTAKE-20261015-WORK-ITEM5-FLEET-BRIDGE-1d703a, sole STARTAKE inheritor/Codex Work. Reservation actual233→234 independently byte-verified after preceding fleet closeout and dashboard47 verification. Direct model integration using existing project evidence; no new external factual research, executed Deep Research or professional opinion.

## Result

Delivered a separately versioned adapter connecting fleetcompanionv0.1 to preserved financialenginev0.2. Both source modules are included unchanged. Twelve integration tests pass. It replaces five input schedules (manufactured units, manufacturing unit costs, purchased launches, launch unit costs, other capex) with lineage, then reconciles every annual capex result. It does not add duplicate costs. All remaining financial inputs are independently required. Workbookv0.3 and Billv1.4 remain unchanged.

Required alignment evidence: same currency/scale, valuation date, commercial perimeter, cash timing, no manufacturing/launch double count in other capex or cash opex, and documented review of units/service scope. Confirmations are documentary declarations, not source authentication. Different actual-versus-synthetic status is rejected. An absent late-year financial driver blocks valuation even if fleet inputs are complete. Missing fleet input blocks the adapter. Source/date/status and adapter lineage remain attached to replaced fields.

## Tests and contrary outcomes

Twelve tests passed: hand-capex190annually for the arbitrary synthetic fixture; full annual/valuation/fiscal equivalence to separately manually mapped engine inputs; year1manufacturing-unit-cost increase of1changes FCFF by20 and EV by20/(1+WACC); commissioning delay remains a visible shortfall with continuity=false; incremental paid launch increases federal support by50 when the test operating case is already cash-deficient; input objects unchanged; actual/synthetic mixing blocked; three date/currency/perimeter mismatches blocked; four absent overlap/timing/unit confirmations blocked; missing late-year ARPU blocks financial output; missing manufacturing count blocks adapter; lineage retained.

During test development the first support fixture had10available operating cash, so an extra50launch required40support, not50. The fixture was revised to a genuinely cash-deficient case to test the intended marginal-support identity. This was a test-assumption correction; no production equation was changed. It illustrates why incremental capex need not equal incremental subsidy when available cash absorbs part of the cost.

The financial result can calculate while the fleet target check is false. That is intentional disclosure: the program reports year_end_unit_target_check separately and always returns operational_continuity_verified=false. DCF/revenue does not automatically shrink with a unit shortfall: there is no validated bandwidth/geography/service-to-satellite mapping. These calculations cannot be used as an operationally feasible valuation without additional engineering/revenue reconciliation. Model terminal-value calculations are inherited from enginev0.2 and do not certify replacement economics beyond year10. Neither passing unit targets nor cost equality establishes technical independence, rights, supplier capacity, intra-year continuity or legal authority.

## Original requirements and exits

Original Item5tenrequirements remain: date/perimeter/title open; actual financials/allocations open; Starshield/shared-asset separation open; subscriber/life/replenishment mechanics partial with actual evidence missing; actual multi-method value range absent; legal/contract/tax/labor/liability controls open; public receipts and private value separate; synthetic sensitivities partial, actual uncertainty bands open; ten-year operating/financing engine with a tested replacement-cost bridge exists but actual forecast unpopulated; just-compensation and independent review outstanding.

Five exits remain unaccepted: perimeter/data appendix incomplete; transparent workbook exists with missing actual inputs and this adapter is executable-only; multi-method range absent; actual multi-year operating/financing forecast unpopulated; independent-review memo/opinions not obtained. This closes an executable interface/test gap, not actual-data or independence evidence. Named Standalone Starlink valuation, Fiscal policy and economic impact, Launch/manufacturing/technical independence remain formalNo.

## Bill, review blockers and next scope

No bill change: v1.4/31sections still requires lifecycle and transition evidence. The adapter is a proposed implementation aid. Still needed: actual vintage/life/failure register; generation/capacity/service mapping; cash-paid unit and launch costs; deposits/working capital; supplier/IP/launch compatibility; ground/terminal renewal and deorbit allocations; sustainable terminal replacement; independent appraisal/accounting/engineering/legal/budget review. Actual valuation, appropriation amount and official scoring remain unsupported.

Next authorized distinct assignment: bounded primary-source launch/manufacturing-dependency evidence update, using current official filings/operator technical materials to distinguish internal production/launch dependence from actual separability, procurement price, compatible substitutes and rights. Reserve separately after verified closeout. Do not duplicate earlier whole-company/title or peer-cost work.

Sources reviewed: original Item5 specification libfile_6fb48b34b25081918d419dda66d8c402; fleet package libfile_17f8849e38508191993091e480d28d68/report libfile_e03d99661e288191a726fded84797da1; enginev0.2 libfile_40c67988185081919de74e15f6466c09/report libfile_dd9475a89d108191bc897b2fa85f862e; workbookv0.3 libfile_f41005b4791c81918bd8896a306eb3ad; Billv1.4 libfile_03ca9a5a45288191a4b45522926265aa; activated Workflowv2.2 and live tracker. Existing source limitations remain intact. Package includes exact engine/fleet modules, fixtures, adapter, tests and receipt.

Coverage7/7; formal0/7 and0/36;311retained; stages3,2,3,3,3,3,3,3,3,3=29/50(58%) unchanged; readiness unestablished. Release only owned claim after save/readback, verify tracker and dashboard before next reservation. Goal remains active.