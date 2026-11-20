# Item 5 — Customer collections and working-capital bridge

**Date:** 15 October 2026 UTC. **Claim:** `STARTAKE-20261015-WORK-ITEM5-CASHBRIDGE-9f27e4`. **Owner:** sole STARTAKE inheritor / Codex Work. Reservation conditional source225→226 independently materialized and byte-compared before model construction. **Status:** Research/model-drafting pass complete — formal verification pending.

## Outcome

Created a separately versioned executable ten-year cash bridge, with explicit missing-real-input template, four synthetic fixtures, results, README, tests and hash manifest. The existing financial engine v0.1 and workbook v0.2 remain unchanged. No real Starlink data, valuation, official score, new acquisition authority or expert opinion is produced.

This is an internal mathematical/model-design pass based on the preserved model, workbook validation report and original Item5 requirements already reviewed. It is not an external financial-data research pass or Deep Research execution. Its conclusions concern the defined model identities and tested behavior, not the truth of corporate financial records.

## Model identities and boundaries

For each year, receivables and deferred revenue roll from the preceding closing balance. With no noncash changes, writeoffs, refunds, FX, factoring, reclassifications or unmodeled contract assets:

- **Customer collections = earned revenue − Δreceivables + Δdeferred revenue.**
- **Customer Δworking capital = Δreceivables − Δdeferred revenue.**
- **Total Δworking capital = customer Δworking capital + other Δworking capital.**
- **Private FCFF = collections − cash operating costs − private cash taxes − capex − other Δworking capital.**
- **Public operating cash** substitutes public external cash taxes.
- **Net federal annual cash = operating support + federal customer cash − Treasury distributions.**

These equations are the design assumptions of this limited bridge. They are not asserted as a complete GAAP cash-flow statement. The absence of unsupported customer-balance adjustments must be expressly confirmed; otherwise evaluation returns unavailable results. The other-working-capital schedule must exclude receivables, deferred revenue and cash already handled here. Negative other Δworking capital permits a documented release.

Opening operator cash is added once to closing uses explicitly supplied **excluding** that cash. Reserve replenishment and distribution controls preserve annual cash conservation and prevent distributions funded by federal top-ups. Federal cash receipts are a subset of total customer collections. Nonfederal collections reduce support through operating cash and are not subtracted again from consolidated federal outlays.

## Material predecessor limitation found

The old model and workbook reject federal customer cash exceeding current modeled revenue. That guard is appropriate only under their simplified timing convention; it is too restrictive for a collections bridge. For example, current revenue of1,200 and collection of400 opening receivables produces1,600 total cash. Federal collections of1,500 are then possible without exceeding total collections. The new bridge accepts this defined synthetic case and identifies100 nonfederal cash.

This does not establish that Starlink has such receivables, customers or timing. It identifies a model-design counterexample. A future integration must replace the federal-receipts-versus-revenue guard with a collections-based guard. Do not feed a valid bridge case into the old engine and treat its rejection as evidence that the transaction is impossible.

A second integration risk is double-counting: if the derived customer Δworking capital is included in total Δworking capital, subtracting it again from an already cash-converted revenue stream understates cash. Either use earned revenue minus total Δworking capital, or collections minus **other** Δworking capital, under the stated boundary. The delivered bridge tests their equality.

## Tests and synthetic controls

Executed `python3 -m unittest discover -s cashbridge/bridge -p test_bridge.py -v`: **14 tests passed**.

| Test | Result |
|---|---|
| Unpopulated commercial template | Unavailable years/public cash; missing data never becomes zero |
| Zero-timing base | Private FCFF430/year; closing uses550 plus1,200 federal customer payments gives1,750 nominal units, matching original arithmetic |
| Receivable lag then recovery | Year1/2 collections1,100/1,300; ten-year collections12,000 |
| Prepayment then recognition | Year1/2 collections1,400/1,000 |
| Federal collections above current revenue | Opening receivables400 permits federal1,500 within total collections1,600 |
| Federal receipts above total collections | Rejected |
| Working-capital identity | ΔAR100 − Δdeferred30 + other20 = total90; FCFF340 without a second timing deduction |
| Cash conservation under losses | All ten annual cash identities reconcile with operating support |
| Distribution requiring support | Rejected |
| Explicit zero versus missing year10 | Zero permitted; missing value blocks results |
| Missing source | Blocked |
| Unsupported customer adjustments not excluded | Blocked |
| Nonfinite input | Blocked |
| Negative other working-capital release | Accepted; raises test FCFF to440 |

All figures above are **abstract synthetic test units**. No financial range or confidence interval is inferred. The four fixtures, missing commercial template and machine-readable results are in the companion ZIP. Automated testing verifies this implementation against specified arithmetic; independent accounting review is still absent.

## Original requirements and bill crosswalk

Original Item5 scope: Library `libfile_6fb48b34b25081918d419dda66d8c402`; prior engine/report `libfile_4ded56fc40c08191aebd9113edc0464d` / `libfile_7044c12f19388191b1521817a9c52f96`; workbook/report `libfile_b3d87082b66081919fcea9bdec187c19` / `libfile_7c2b10165b448191846860325c6cb507`. These are project sources, not new external financial evidence.

| Original Item5 exit | Contribution | Remaining |
|---|---|---|
|1 Perimeter/data appendix|Source/status fields and missing commercial template|Actual title/perimeter and authenticated balances absent|
|2 Transparent workbook|Separate executable design and integration specification|Workbook integration, real data and native-application/finance review pending|
|3 Multi-method valuation range|No new valuation|Real DCF, comps and asset/replacement appraisal absent|
|4 Multi-year operating/financing forecast|Ten-year customer cash, other-WC and federal-cash schedules|Actual balances, collections, costs, taxes, other-WC components, financing and complete statements absent|
|5 Independent-review memo|Adverse timing examples and explicit limits recorded|Independent accounting/appraisal/legal/budget/engineering review absent|

Named interfaces: **Standalone Starlink valuation** and **Fiscal policy and economic impact**, limited to model mechanics. Original requirements are preserved; no checkbox is changed. Billv1.4 remains unchanged,31sections. This design can support the proposed §§208/301–303 financial schedules but creates no authority or verified appropriation.

## Gaps and disposition

Closed at draft level: missing explicit customer-collection rollforward; lack of a non-double-counting bridge; missing synthetic counterexample to the old federal-cash/revenue guard. **Not closed:** authenticated actual data; cash-versus-accrual cost/tax treatment; noncash adjustments; refundable deposits, contract assets, chargebacks, bad debts and FX; full receivable/deferred ledgers by customer and jurisdiction; other-WC components; full balance sheet; fleet-age replenishment; valuation; independent review. Account balances are inputs, not invented estimates.

Next useful step is separately reserved integration into the engine/workbook, with predecessor preservation and regression tests, followed by fleet-age replenishment and source-data schedules. No external contact has been made. Item1 and Item4 findings remain untouched.

Coverage7/7 initial; formal0/7 practical and0/36 named;311 retained with substantive acceptance unaudited. Ten stages3,2,3,3,3,3,3,3,3,3=29/50(58%) descriptive maturity; no stage advancement. Congressional readiness unestablished. The existing pursued goal remains incomplete.