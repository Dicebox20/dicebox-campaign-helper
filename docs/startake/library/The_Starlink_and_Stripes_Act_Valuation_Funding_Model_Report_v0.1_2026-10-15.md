# The Starlink and Stripes Act — Valuation and Federal Funding Model Report v0.1

15 October 2026 UTC. Claim STARTAKE-20261015-WORK-MODEL-9da412, owner STARTAKE Work legislative assembly. Item 5 only, fiscal integration into proposed bill. Actual conditional source version 146; reservation independently reread in canonical tracker 147. Method: direct official methodological-source review, prior-evidence reconciliation and executable model construction. No Deep Research, private due diligence, appraised price or independent sign-off claimed. No Item 1 research or Item 4 ledger work.

## Result and deliverables

A reproducible ten-year model now separates private commercial cash-flow valuation, the enterprise-to-equity bridge, seller consideration, closing uses, operating liquidity and consolidated federal cash. It has explicit missing-input controls, source/date/status fields, downside/base/upside synthetic cases, a nine-cell discount/terminal-growth sensitivity grid and ten passing validation checks.

Companion: [The_Starlink_and_Stripes_Act_Financial_Model_v0.1.zip](The_Starlink_and_Stripes_Act_Financial_Model_v0.1.zip), containing model.py, test_model.py, an unpopulated actual-input JSON template, missing-input output, three synthetic input cases, synthetic results, README and SHA256 manifest. Archive SHA256: `97d596169e3512833e7c0a294c726833e36ff0362aef7750782dfbae40277a98`. Ten members; ZIP integrity checked.

**No real Starlink purchase price, value range or appropriation amount is produced.** Every actual financial input remains missing. A zero must be supplied explicitly with provenance; absent values never silently become zero. “Assumption” entries remain assumptions even when the calculation succeeds. The program checks metadata presence, not source authenticity. All numeric examples are labeled synthetic test units.

This is an executable model build, not the transparent spreadsheet workbook or all five exit deliverables required by the original Item 5 specification. The workbook, authenticated commercial-only data, independent multi-method valuation and signed review remain outstanding. The draft is sufficiently concrete for Stage 3 output maturity; it is not formal acceptance or Stage 4 validation.

## Evidence and source findings

The [original Item 5 scope](Starlink_Only_Valuation_and_Financial_Model.md) and [saved financial verification audit](Startake_Verification_Item5_Starlink_Valuation_Model_2026-10-15.md) were read in full before model design. They require separating commercial Starlink from SpaceX/Connectivity/Starshield, using source-auditable cash flows and showing ten-year acquisition and operating funding. Prior segment numbers were NOT copied into this model as commercial-only data, and no historic SEC source finding was independently refreshed or certified here.

[GAO-20-195G, published 12 March 2020](https://www.gao.gov/products/gao-20-195g), calls for documented scope, technical baseline, assumptions, data, sensitivity/risk analysis and updating estimates. The build uses explicit input provenance and scenario controls consistent with that methodological direction. This is not a GAO certification.

[CBO's discount-rate methodology](https://www.cbo.gov/publication/60284), externally retrieved 15 October 2026, explains that rates depend on the analysis and assumptions. The model keeps private WACC separate from an explicitly supplied fiscal discount rate. Its discounted planning total is not an official score. No rate or market return has been asserted as a current fact.

## Model equations and assumptions

| Build | Equation / convention | Material limit |
|---|---|---|
| Service lines | End = beginning × (1−annual churn) + gross additions; average = (beginning+end)/2 | Churn applies to beginning lines; uniform-flow approximation, not a detailed monthly cohort model; service lines are not people |
| Revenue | Average lines × 12 × net monthly ARPU + other commercial revenue | Other revenue must not duplicate line revenue; disaggregated tiers and terminal cohorts not built |
| Capital replenishment | Satellites × fully loaded manufacturing cost + launches × contracted launch price + other capex | No free internal launch assumption; avoid manufacture/launch double counting; no vintage survival schedule |
| Private FCFF | EBIT − unlevered cash taxes + D&A − capex − change in working capital | Taxes/NOL and related-party separation require supplied schedules; D&A cancels only algebraically, not as evidence of tax basis |
| Terminal value | Year-ten FCFF × (1+g)/(WACC−g), discounted ten years | WACC must exceed g; sustainable replenishment and working capital must be embedded; negative cash flow can produce negative economic value, not compensation advice |
| Equity bridge | EV − net debt − other equity claims + nonoperating assets | Cash already inside net debt cannot be added twice; this bridge does not determine negotiated seller consideration |
| Closing uses | Consideration + separately payable debt + fees + separation + incremental WC + opening reserve | Consideration must exclude any separately counted payoff; acquired WC is not automatically incremental cash |
| Public operating cash | Revenue − cash opex − external public taxes − capex − change in WC | Federal internal tax transfers excluded; actual tax treatment unverified |
| Operating support | Positive amount needed to reach chosen minimum reserve after cash operations | A reserve is a cash use, not a recurring expense; distribution funded by top-up is rejected |
| Consolidated federal cash | Closing uses + operating support + federal customer payments − Treasury distributions | Government customer revenue remains federal outlay; private receipts already reduce support and are not subtracted twice |
| Fiscal present value | Closing uses + annual net federal cash discounted at separate fiscal rate | Planning analysis only; official scorekeeping and Treasury financing require professional review |

Currency/scale must be consistent nominal USD in real cases; period t is year t after the valuation date with year-end discounting. No probability distributions or confidence intervals are produced. Model outputs do not authorize any obligation or expenditure. The [integrated proposed bill](The_Starlink_and_Stripes_Act_Integrated_Working_Bill_v0.1_2026-10-15.md) §§103, 208, 301–303 and 404 govern proposed appraisal, account and review design; those provisions are proposed law, not an existing acquisition authorization.

## Verification performed

Executed `python3 -m unittest discover -s outputs/financial_model -p test_model.py -v`: ten tests passed. They covered missing inputs versus explicit zero; independently hand-computed constant-cash-flow perpetuity; year-by-year cash conservation; higher launch cost reducing valuation; discount/terminal sensitivity and invalid g; negative cash requiring support; prevention of distributions financed by support; source presence and nonfinite numbers; and equity-versus-purchase-price separation.

The synthetic base has FCFF 430 per year at 10% WACC and zero terminal growth; independent perpetuity control is 430/0.10 = 4,300 abstract test units. Closing uses 550 plus ten annual federal customer payments of 120 give 1,750 nominal test units. These are arithmetic controls, not Starlink estimates. The downside fixture can become economically negative, demonstrating that the program does not force an acquisition-favorable result. The actual commercial template returns `missing_or_invalid_inputs` and null valuation/public cash.

Tests establish behavior of this build, not authenticity of corporate information or economic validity of future assumptions. No native spreadsheet calculation, audited statements, independent appraisal, legal compensation conclusion, or professional model review was performed.

## Authenticated original-requirements matrix

The original Item 5 document was independently retrieved in full. The ten scope lines below are faithful condensed descriptions of its requirements, not new subcategory headings. The original nine approved named-topic subcategory texts for Standalone Starlink valuation remain unauthenticated.

| Original Item 5 requirement | Work supplied | Remaining gate |
|---|---|---|
| Valuation date, perimeter, ownership and separable assets | Date/perimeter input metadata and explicit missing status | Actual date choice, owner schedule and lawful commercial perimeter; Item 1 external |
| Historic and current financial statements, allocated costs | Source/date/status per variable | Audited/certified commercial carve-out and source appendix absent |
| Starshield/SpaceX exclusions and shared dependencies | Commercial-only input convention and exclusion warning | Evidence-based allocations and real contracts absent |
| Subscriber/ARPU/churn/expenses/replacement/launch/supply-chain drivers | Line rollforward, ARPU, cash opex, manufacture/launch/other capex inputs | Detailed cohorts, lifetime/vintages, geographic permissions, terminal economics and calibrated data absent |
| DCF, market/transaction comparable and asset/replacement valuation | Executable DCF and sensitivity | Comparable and independent replacement-cost appraisal absent |
| Assignability, IP, contracts, taxes, labor, debt and working capital | Explicit taxes, net debt, closing payoff, separation, WC/reserves | Rights/legal diligence, contingent/employee-equity liabilities and signed services absent |
| Historic procurement/support versus investment/value/fiscal cost | Separates seller price, fiscal cash and valuation; no public-support offset | Item 4 ledger/wealth attribution remains separate and incomplete |
| Base/downside/upside sensitivities and counterevidence | Synthetic three-case examples and nine-cell rate grid | Populated sourced scenarios and uncertainty bands absent |
| Ten-year sources/uses, operations, capex, financing and scoring | Ten annual periods, closing uses and ongoing cash support; no borrowing case | No debt schedule (current bill grants no debt issuance), balance sheet, official score or spreadsheet workbook |
| Separate legal compensation and independent review | Explicit non-equivalence and review queue | Appraiser, accountant, engineer, budget and counsel opinions absent |

Five exit deliverables: (1) certified perimeter/data appendix missing; (2) executable calculation supplied but required spreadsheet not delivered; (3) real multi-method range missing; (4) ten-year model structure drafted but real forecast unpopulated; (5) caveat/adverse-case memo supplied but independent review missing. **Formal Item 5 remains unchecked.**

## Contrary assumptions and gap register

- A sophisticated calculation with unsourced inputs remains unreliable. No actual-input output should be represented as an appraisal without source authentication and independent review.
- A perpetual year-ten cash flow may dominate DCF. Downward demand, higher launch prices, denial of foreign permissions, security disruption, staff loss, price constraints and depleted fleet replacement must be modeled explicitly once defensible data exist.
- Private tax assumptions differ from public external cash taxes. Federal customer receipts and internal transfers require careful consolidation to avoid understatement of fiscal burden.
- Acquisition cost is not EV, equity, net worth or historical public payments. Property-specific compensation and debt/creditor treatment remain legal and appraisal questions.
- No borrowing case is supplied because the current working bill creates no borrowing authority. A future debt-funded alternative would need new authority, amortization/interest, refinancing and fiscal-risk schedules; omission is not a conclusion that financing is free.
- No Starlink-specific numerical valuation can be defensibly published from this template alone. Public ownership remains the objective, but a negative or inconclusive valuation scenario must remain visible.

Next factual/model work: obtain authenticated commercial carve-out and contracts; populate driver and cost history; build age-cohort replacement, balance sheet and financing alternatives; obtain independent comps/replacement appraisal; deliver requested auditable spreadsheet and finance-counsel review. External contact is not performed under routine research authorization.

## Disposition and Sources

One distinct model-build/direct-primary-methodology assignment complete, verification pending. Suggested maturity: valuation 2→3 and funding 2→3 for concrete executable structure, making **26/50 = 52%**, stages **1,2,3,3,3,3,3,3,3,2**. This is draft-output maturity, not a verified value, percentage of effort or acquisition success probability. Initial research coverage remains 7/7; formal practical 0/7, named 0/36; 311 proposed not fully audited. Release only MODEL-9da412 after saving/rereading report and companion verification, fresh conditional tracker integration and readback.

- [GAO-20-195G, 12 March 2020](https://www.gao.gov/products/gao-20-195g), U.S. official cost-estimating method, checked 15 October 2026.
- [CBO discount-rate methodology](https://www.cbo.gov/publication/60284), U.S. official methodology, checked 15 October 2026; no chosen Starlink rate supplied.
- [Original Item 5 requirements](Starlink_Only_Valuation_and_Financial_Model.md), read in full; [prior verification report](Startake_Verification_Item5_Starlink_Valuation_Model_2026-10-15.md), prior financial figures not independently refreshed here.
- [Integrated working bill](The_Starlink_and_Stripes_Act_Integrated_Working_Bill_v0.1_2026-10-15.md), proposed statutory design only.