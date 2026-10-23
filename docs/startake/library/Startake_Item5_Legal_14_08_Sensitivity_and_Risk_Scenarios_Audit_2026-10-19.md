# Item 5 — Original legal scope 14.08: Sensitivity and risk scenarios audit

**Date:** 19 October 2026 UTC  
**Claim:** STARTAKE-20261019-WORK-ITEM5-LEGAL-14-08-SENSITIVITY-RISK-a3aec4ea  
**Status:** Bounded direct-primary-source and model-evidence audit; formal verification remains pending. No quantitative stress values, probabilities, valuation, federal score, or formal acceptance is established.

## Executive finding

The authenticated scope names six risk dimensions: demand, replacement costs, outages, interest rates, foreign permissions, and geopolitical stress. The proposed bill already directs a ten-year budget to include scenarios and sensitivity ranges and calls for replacement and launch needs, debt assumptions, a common financial basis, and separate federal cash measures. The present gap is evidence and model linkage: the financial workbook v0.4 has 34 required Actual driver groups, and all 34 remain missing or invalid. Its Actual-case valuation, closing-use, and federal-cash outputs are unavailable; its two-variable WACC/terminal-growth grid also displays unavailable results.

The workbook’s synthetic cases and rate grid test calculation behavior. They are not evidence-based risk scenarios. The grid changes only the private valuation discount rate and terminal growth; it does not vary demand, fleet replacement, outages, permissions, or geopolitical conditions. The Historical Calibration sheet is unlinked from forecast formulas. It therefore supplies historical context, not actual forecast inputs.

Public evidence can inform limited baselines but cannot yet support a decision-grade scenario set. The 2026 Q2 SEC filing reports issuer-defined historical subscriber and ARPU measures, while expressly defining subscriber lines to exclude managed enterprise and government customers. It also shows subscriber growth and ARPU moving in opposite directions as geographic and plan mix changed. Public replacement-cost observations remain peer/program comparisons, not Starlink unit costs. Prior research records limits on public outage, foreign-permission, and conflict evidence; this audit reuses those records and does not re-audit their assigned scopes.

GAO’s cost-estimating guidance supports documented, traceable factor ranges for sensitivity analysis and source-grounded risk distributions with correlation analysis when the evidence can support them. It cautions against arbitrary percentage swings. CBO’s legislative estimate is a separate point estimate against a current-law baseline, not the output of this workbook’s sensitivity table. No probability-weighted estimate is produced here.

**Disposition:** No Bill or workbook edit is recommended or made. The next useful deliverable is a sourced scenario register that identifies the baseline, evidence owner, model drivers, affected outputs, dependencies, and update trigger for each factor. Do not populate the Actual case until the underlying source records and valuation perimeter are authenticated.

## Authenticated scope and method

The authenticated original legal requirement is 14.08, **“Sensitivity and risk scenarios”**: “Demand, replacement costs, outages, interest rates, foreign permissions and geopolitical stress.” Its evidence prompt calls for legal instruments, factual records, attributable figures, relevant technical information, and competing interpretations specific to this subject.

The authenticated source is Starlink_Research_Topic_Documents_17.zip, member Starlink_Research_Topics/14_fiscal_policy_and_economic_impact.md, member SHA-256 133f4b3b38e43fa0eb5b4ad29c4aa228319eeb0afa93aeef1b73f0edc6bde08c. Evidence prompt: develop legal instruments, factual records, attributable figures, relevant technical information, and competing interpretations specific to this subject. Crosswalk v1.27 maps this scope to proposed Bill §§208 and 301–303 and records no prior individual scope report or Library ID. The parent named topic, Fiscal policy and economic impact, remains formally unchecked.

This pass compared the exact scope, proposed Bill v1.14 §§208 and 301–303, and workbook v0.4 with current official GAO, CBO, and SEC sources and relevant saved Startake reports. It is a direct-source review, not an executed Deep Research job, official CBO score, legal opinion, or independent appraisal. The workbook was opened read-only; no cell, formula, or metadata was changed.

## Current bill and workbook fit

Proposed §208(c) requires the annual Corporation budget to identify launch and replacement costs, affordability support, security costs, depreciation, reserves, actual obligations and outlays, and unfunded requirements. Proposed §301(b) calls for a ten-year budget with sources and uses, operating receipts, replacement satellites and launch needs, cybersecurity, debt assumptions, scenarios, sensitivity ranges, and independent-appraisal limits. Proposed §301(c) requires a common price/currency/date and nominal-or-real basis; separate annual federal obligations, outlays, receipts, contingent exposure and discounted measures; and traceable acquisition, financing, interest, transition, operations, replenishment, and subsidy flows without duplicate counting. Those are proposed provisions, not current law.

The workbook v0.4 is consistent with the stated incomplete-data posture:

- The selected case is “Actual — inputs missing.” Assumptions reports 34 missing/invalid driver groups. Each of the 34 Actual rows is blank and marked missing.
- Summary values for enterprise value, equity value, closing uses, ten-year nominal and discounted federal cash, and ending operator cash are “n.a.” Forecast indicates “Missing or invalid inputs.”
- The sensitivity grid varies WACC across 8%, 10%, and 12% and terminal growth across −1%, 0%, and 1%. The grid is “n.a.” for the Actual case.
- The model includes demand and capital drivers, separate private WACC and fiscal discount rate, and financing/closing fields. It has no dedicated outage, foreign-permission, or geopolitical driver. It has no debt-issuance or interest-rate schedule; its Summary says no debt issuance is modeled.
- Historical Calibration holds six issuer-reported subscriber/ARPU observations, but a formula scan found no forecast links to that sheet.

The 34 fields are forecast-driver groups, not 34 total year-by-year values. They include opening service lines; WACC and terminal growth; fiscal discount rate; net debt and other equity claims; purchase consideration and closing uses; gross line additions, churn, ARPU, and other revenue; operating costs, depreciation, taxes; satellites manufactured, manufacturing cost, launches purchased, launch cost and other capex; working capital, reserves, federal customer cash receipts and Treasury distributions. All Actual groups remain missing; synthetic values are not substitutes.

## Six-factor evidence and scenario map

### 1. Demand

**Present model drivers:** opening service lines, gross additions, annual churn, monthly net ARPU, and other revenue.

**Verified baseline and limit:** Space Exploration Technologies Corp.’s Q2 2026 Form 10-Q reports 12.0 million Starlink service lines as of 30 June 2026, compared with 6.0 million a year earlier. Its Starlink subscriber ARPU was $66 per month in Q2 and H1 2026 versus $85 in the corresponding 2025 periods. The filing defines a subscriber as a unique service line and excludes managed enterprise and government customers with negotiated sales agreements. ARPU is based on average subscribers during the period, while the subscriber count is a period-end measure. The filing also attributes 101.2% subscriber growth alongside a 22.4% Q2 ARPU decline, primarily to international expansion and lower-priced plans, with separate growth in government, aviation, maritime, and other enterprise businesses. These issuer-reported historical figures demonstrate mix interaction; they do not establish a price elasticity, demand curve, forecast, or commercial-only revenue series.

**Scenario gate:** Use dated, perimeter-matched line cohorts and price/plan, churn, additions, geography, and customer-class evidence. Separate consumer/service-line metrics from negotiated enterprise and government contracts. Do not convert period-end lines into annual revenue by multiplying by ARPU and 12, or apply a single unsupported “demand shock” percentage.

### 2. Replacement costs

**Present model drivers:** satellites manufactured, manufacturing unit cost, launches purchased, launch unit cost, other capex, and depreciation.

**Verified baseline and limit:** The SEC filing describes aggregate Connectivity costs, including depreciation associated with capitalized satellite and launch costs, and kit-production spending. It does not isolate a commercial-Starlink unit replacement cost, satellite production schedule, or purchased-launch cost series. The earlier Comparable and Replacement-Cost Evidence report contains dated OneWeb and Iridium program observations, expressly bounded as peer/program evidence rather than target unit costs. The fleet-replacement and capacity/terminal reports validate synthetic mechanics only; they do not authenticate actual ages, costs, capacity, supplier access, or a sustainable replacement cycle.

**Scenario gate:** Require a commercial fleet generation/vintage and condition record, engineering survival and service-capacity assumptions, manufacturing/launch contracts or other cost evidence, delivery timing, failures, commissioning, spares, ground and terminal renewal, and consistent cash/accrual treatment. Replacement cost and available launch capacity should be treated as dependent when the source record indicates a shared constraint. Do not use peer cost ratios or synthetic fleet cases as Starlink estimates.

### 3. Outages

**Present model drivers:** none specifically measures outage occurrence, duration, affected service lines or regions, recovery, failover, credits, or restoration expense. Annual revenue or operating-cost rows could contain an effect only if supported by a separate evidence bridge; they do not identify an outage event or its cause.

**Verified baseline and limit:** The saved M04.08 audit distinguishes conditional federal satellite-outage reporting from a general customer uptime or restoration guarantee and identifies missing provider telemetry and confidential outage records. The saved M06.05 report examines defense-user continuity obligations and contract-specific duties; it does not establish present provider uptime or a public outage history. This assignment does not repeat those legal audits.

**Scenario gate:** Define the event, covered facility/service, start and end time, affected geography and user/mission class, backup path, lost or deferred revenue, mitigation and service-credit costs, and recovery evidence. Separate legally triggered reporting from customer performance and financial effects. Do not infer outage duration, user harm, or restoration cost from the existence of a reporting rule.

### 4. Interest rates and financing

**Present model drivers:** private WACC, terminal growth, fiscal discount rate, and net debt. The current grid tests WACC and growth only; no actual rate is supplied, and no debt-issuance or interest expense schedule is modeled.

**Verified baseline and limit:** CBO explains that rate selection can materially affect present values and that its federal discount-rate methods draw on financial-market, BEA, Federal Reserve, and academic data. A private-company WACC, a federal fiscal discount rate, and an assumed borrowing rate answer different questions and must not be merged. Proposed §208(b) and §302(a) create no bond/debt authority or federal guarantee; §301(c) treats debt assumptions as analytical scenarios and requires traceable financing and interest flows.

**Scenario gate:** State the analytical purpose, date, currency, nominal/real basis, term, source, and risk treatment for every rate. If a future financing alternative is modeled, first establish separate legal borrowing authority and its debt-service, refinancing, and fiscal treatment. Do not add a risk premium to WACC for a risk already represented in cash flows without documenting why; otherwise the same risk may be counted twice.

### 5. Foreign permissions

**Present model drivers:** none. There is no jurisdiction-level permission, renewal, ownership/change-of-control, service-availability, or authorization-risk input.

**Verified baseline and limit:** Prior Item 3 and Item 1 reports remain the source for their assigned foreign-permission and ITU-filing findings. They identify specific, limited UK and Canadian regulatory evidence and distinguish international filings from host-country operating permissions; they do not establish a global, current Starlink authorization/consent census or a complete purchaser-control path. This pass uses those reports only as existing evidence and does not re-audit their country- or filing-specific claims.

**Scenario gate:** Build a country/service authorization register with the instrument and holder, service and facility scope, conditions, status and expiry, renewal/assignment/change-of-control requirements, and the decision-maker and notice path. Link any actual loss, delay, or conditional approval to affected service area, customers, revenue, operating cost, and transition alternatives. Treat permission as a jurisdiction-specific legal condition, not a global percentage discount or unsupported binary assumption.

### 6. Geopolitical stress

**Present model drivers:** none identifies a conflict, sanctions action, government restriction, supplier disruption, or other geopolitical trigger.

**Verified baseline and limit:** The saved Ukraine/Starlink timeline report preserves materially different attributed public accounts and states that no underlying order, contract, telemetry, or independent operational-impact record was located for the disputed service-restriction episode. This report uses that source-quality boundary only; it does not re-investigate the incident or infer political motive, causation, or commercial customer effects.

**Scenario gate:** Define a documented trigger and distinguish an observed action from an allegation, forecast, or causal inference. Map only evidence-supported effects to permissions, service availability, demand, replacement/launch supply, insurance or operating cost. Model related effects jointly when evidence supports correlation, and do not assign event likelihoods from timing or from a single disputed account.

## Scenario design and decision rules

Sensitivity, event scenarios, and probabilistic risk analysis answer different questions:

1. A **sensitivity test** changes one supported assumption at a time while holding others constant, so the decision-maker can see which input drives an output. GAO says the range and sources of variation must be documented; an arbitrary plus/minus percentage is not a useful sensitivity analysis.
2. A **coherent stress scenario** changes several inputs together only when they describe one defined condition or event. It should preserve dependencies—for example, a permission restriction may affect regional demand, churn, and operating cost at once; a launch constraint may coincide with replacement delay and capacity loss.
3. A **probabilistic risk analysis** requires defensible distributions and correlations based on data quality and variability. GAO describes simulation or another modeling technique and periodic updates as best practices. This audit has no evidence from which to assign probabilities or calibrated distributions, so none is produced.

For any later scenario, record: (a) the dated baseline and acquisition perimeter; (b) the source, measurement basis, retrieval date, owner, and evidence status of every changed input; (c) the legal/operational trigger; (d) the model rows and outputs affected; (e) dependencies and any shared cost or double-count risk; (f) contrary evidence and limitations; and (g) the event or date that requires refresh. Report enterprise value, equity value, acquisition consideration, closing uses, annual federal obligations/outlays, and discounted federal measures separately. A sensitivity table is not an official budget score or compensation opinion.

## Bill implication

This text comparison found broad scenario and sensitivity instructions already in proposed §301(b), common-basis and separate-fiscal-flow controls in §301(c), and launch/replacement, reserves, and unfunded-requirement reporting in §208(c). The work remaining is evidence collection, scenario definitions, source-to-input mapping, and model execution after the Actual case is supportable. This audit does not establish whether Congress should add a more explicit six-factor scenario register. No Bill edit was authorized or made; any future drafting language should be separately scoped and reviewed by Legislative Counsel, budget staff, and relevant technical reviewers.

## Primary sources reviewed

1. U.S. Government Accountability Office, GAO-20-195G, *Cost Estimating and Assessment Guide*, published 12 March 2020, ch. 11 (sensitivity analysis, pp. 131–138) and ch. 12 (risk and uncertainty analysis, pp. 145–165): https://www.gao.gov/products/gao-20-195g and https://www.gao.gov/assets/d20195G.pdf. Used as nonbinding cost-estimating methodology, not as transaction approval or a Starlink estimate.
2. Congressional Budget Office, *CBO Explains Common Sources of Uncertainty in Cost Estimates for Legislation*, February 2025: https://www.cbo.gov/publication/61205. It describes point estimates against a current-law baseline and uncertainty sources including data gaps and dependence on future events.
3. Congressional Budget Office, *How CBO Uses Discount Rates to Estimate the Present Value of Future Costs or Savings*, 7 October 2024: https://www.cbo.gov/publication/60815. Used to distinguish rate selection and present-value analysis; no rate is selected here.
4. Space Exploration Technologies Corp., Form 10-Q for the quarter ended 30 June 2026, filed 4 August 2026, SEC accession 000162828026052535, MD&A “Key Business Metrics” and Connectivity discussion: https://www.sec.gov/Archives/edgar/data/1181412/000162828026052535/spcx-20260630.htm. The reported metrics and explanations are company statements; no commercial carve-out or independent financial assurance is implied.

## Pinned project records

- Bill v1.14: Library ID libfile_0fb03f28404c8191a6c549b3c0abb8f0; 150,978 bytes; SHA-256 848e3dc59d671a56241f379ba9b9dcd427c679ca4051467674a5517edea6977e.
- Financial workbook v0.4: Library ID libfile_2a66a31519cc8191ba7786da678b1d87; file ID file_0000000029c481fdbe1fbcbf761d08af; 48,117 bytes; SHA-256 91f4689cc61abfdbaa87488bfde26c792110267071550bde91fc9bc741b300d8.
- Crosswalk v1.27 Markdown/CSV: Library IDs libfile_6f54141ec7848191896292c4af6c2959 / libfile_0559ebf8c4108191a7672dc959176c05; 93,706 / 449,581 bytes; SHA-256 a7a39b5184b7f65ce4daa0bf36b7f979382d75c8f353b201554a6819c6816fda / cad5f742c13bad381fbb3946b7f7133e2e2c180af07c92c3597a78453bf6ff3c.
- Authenticated requirements: Library ID libfile_9027017d96d88191b360fbc3bff197d8; 94,285 bytes; SHA-256 3eccc9000e2c5a6a5ecff3a9212540c9907be88a2c3f05eaad7f1f022ff64e3f.

## Project records reviewed and overlap limits

- Bill v1.14 and workbook v0.4, read-only.
- Item 5 §303 funding-choice and cost-input audit (Library ID libfile_9465b131ae048191998ef12dee9ebde8), limited to funding choices under 14.01.
- Item 5 SEC financial-input eligibility reconciliation (libfile_f030e07cf62881919a9ad3b62c7a27c4), which remains the source for its 34-driver eligibility map and issuer-data limits.
- Item 5 valuation model report (libfile_7044c12f19388191b1521817a9c52f96) and workbook report (libfile_8be028ff6c9481919986957ac4e4a810), limited to model structure, synthetic tests, and calculation behavior.
- Item 5 Comparable and Replacement-Cost Evidence (libfile_8e6537bdfbf08191b74df68053962bf5), fleet-replacement model validation (libfile_e03d99661e288191a726fded84797da1), and capacity/terminal consistency validation (libfile_d0d3561d53fc819193a14be40957d4dc), reused for peer-cost and synthetic-mechanics limits.
- Saved M04.08 reliability, M06.05 defense-continuity, Item 3 international-permissions, Item 1 ITU-filing, and Item 6 Ukraine-timeline reports are cited only for their existing assigned findings and limits; none is re-audited here.

## Status and remaining evidence

The bounded audit supports original legal scope 14.08 only to the extent described above; it does not complete the scope or establish formal acceptance. Practical Item 5, legal 14.08, and Fiscal policy and economic impact remain unchecked. Initial research coverage remains 7/7; formal acceptance remains 0/7 practical and 0/36 named; 311 proposed scopes remain outside formal acceptance; descriptive maturity remains 29/50; congressional readiness remains unestablished. Practical Item 1 remains excluded.

Not reviewed: nonpublic Starlink contracts, private fleet and supplier schedules, private outage/telemetry logs, customer cohorts, country-by-country regulatory instruments, individual mission requirements, and any independent appraisal or cost, engineering, accounting, budget, or legal opinion. No outside party was contacted. No Bill, workbook, or formal-acceptance record changed.