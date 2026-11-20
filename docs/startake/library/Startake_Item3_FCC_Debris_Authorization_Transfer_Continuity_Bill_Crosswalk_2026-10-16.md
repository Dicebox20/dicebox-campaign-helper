# Item 3 — FCC Debris-Authorization Transfer Continuity and Bill Crosswalk

**Claim:** `STARTAKE-20261016-WORK-ITEM3-DEBRIS-TRANSFER-CROSSWALK-5c91ae`  
**Date:** 16 October 2026 UTC  
**Method:** Bounded direct-primary-source review and legislative integration using official FCC, U.S. Code, and Government Publishing Office records plus the saved orbital-debris audits and Bill v1.4. This report is not a legal opinion.

## Question and result

What must the transaction plan do to preserve FCC debris-related authorization duties when the proposed public acquisition changes who owns or controls the licensee, assigns a station authorization, or changes authorization terms? How should the existing duties map to Bill v1.4 and the authenticated original scope rows 05.09 and M16.01?

**Result:** Communications Act §310(d) and 47 C.F.R. §25.119 establish an FCC approval or filing process for covered license assignments and transfers of control, including indirect changes in control of the licensee. A material change to authorization parameters or terms also ordinarily requires an FCC modification application and grant under §25.117, subject to the rule’s exceptions. Those steps leave the Commission’s decision with the FCC; the Act cannot itself transfer or amend these authorizations. The exact route depends on the licensee and transaction. No reviewed source establishes a complete Starlink authorization-holder inventory or the transfer treatment of every Starlink asset. [S1–S4]

Bill v1.4 §107(a) already prevents the Act from itself transferring radio authorizations and says required permissions must be obtained before affected operations transfer. Section 107(b) also requires a published, transaction-specific domestic authorization plan that addresses Communications Act §§301, 305, and 310. It does not expressly require the plan to inventory each affected authorization’s debris plans and conditions, recurring or outstanding reports, record custodian, or designated post-close responsible official. A narrow plan-content clarification is recommended below for a future drafting decision; **Bill v1.4 is unchanged in this pass**. [S1–S3, S11]

Section 208 authorizes specified lawful operating, maintenance, replenishment, and public-service costs, but it supplies no verified orbital-debris or end-of-life disposal amount. This review does not decide whether a particular disposal expenditure is chargeable to a specific appropriation or operating-account category. No deorbit cost, compliance status, or workbook input is added. [S9, S11]

## Transfer and authorization mechanics

1. **Statutory gate.** Section 310(d) covers transfer, assignment, or disposal of a construction permit or station license and its rights, including direct or indirect transfer of control of a corporation holding the authorization. An FCC application and public-interest finding are required. The statute does not make a Government acquisition itself an FCC consent or resolve what the exact transaction would require for each authorization. [S1]
2. **Part 25 transfer rule.** Section 25.119 requires prior Commission authorization for covered assignment or control transfers and defines a change in the party controlling the licensee or a change in controlling legal or equitable ownership as a transfer of control. The rule prescribes application steps and post-consummation notices; it includes limited pro forma and receive-only-registration exceptions. Whether an exception applies depends on the authorization, transaction, and status of the licensee. No exception is assumed for the proposed public acquisition. [S2]
3. **Authorization modifications.** Under §25.117(a), a modification affecting station parameters or authorization terms and conditions generally requires an application and Commission grant, except where §25.118 permits otherwise. The FCC’s orbital-debris rulemaking explains that a post-grant change to a debris-mitigation plan is to be submitted through a request to modify the station authorization. This makes the plan and authorization condition relevant to the transaction record; it does not establish that a particular change or transfer is pending. [S3, S4]
4. **Keep transfer separate from service transfer.** These FCC rules concern station authorizations and associated rights. They do not by themselves establish transfer of customer contracts, equipment title, foreign permissions, or every non-radio property interest. Exact licensee and authorization mapping remains a pre-close due-diligence task. [S1–S3]

The official 2025 CFR edition reproduces §§25.117 and 25.119 as revised through 1 October 2025. The prior 16 October orbital-debris audit separately reviewed the current eCFR, Starlink-specific FCC orders, and the then-pending Part 100 replacement; this crosswalk does not treat proposed or not-yet-effective replacement text as governing. [S2, S5–S8]

## Debris duties to carry into the transfer plan

The previous primary-source audit establishes the bounded rule set: the five-year disposal deadline applies to a defined below-2,000-km uncontrolled-reentry cohort, with legacy transition categories; other disposal-success and stored-energy requirements remain distinct. It separately records the Gen2 reporting and deployment-pause condition. The January 2026 Gen2 authorization identifies Space Exploration Holdings, LLC as licensee for call signs S2992/S3069 and expressly preserves conditions in that authorization. These records establish regulatory and authorization terms, not the status or compliance of individual spacecraft. [S5–S8]

The follow-up public-record audit did **not** authenticate any actual Gen2 filing entry, receipt metadata, report attachment, report-period filing date, or public-availability status. An inaccessible or unindexed filing is not evidence of nonfiling. The FCC filing record and substantive contents therefore remain an open records gap. [S10]

A transaction-specific plan should identify, for each affected FCC space-station authorization:

- current authorization holder and relevant FCC file/call-sign identifiers;
- required assignment, transfer-of-control, modification, waiver, or other filing, with approval/effective status;
- applicable debris-mitigation plans and authorization conditions, including reporting periods, next due dates, outstanding submissions, and any pause or deployment trigger;
- the source records obtained, missing records, record custodian, and method for preserving and delivering those records; and
- the proposed post-close entity and official responsible for each continuing duty, **subject to the Commission’s required action**.

This is a planning recommendation. It does not deem an assignment approved, a plan amended, a duty satisfied, a report filed, or a pause trigger met.

## Bill crosswalk and drafting disposition

| Bill location | Existing text/effect | Result of this pass |
|---|---|---|
| §107(a) | Disclaims automatic transfer or FCC approval; requires permissions before affected operations transfer. | Retain. It preserves the Commission’s role, but does not identify debris-specific handoff records. |
| §107(b) | Requires a public, transaction-specific domestic authorization plan and names Communications Act §§301, 305, and 310. | Retain the statutory approval gate; for a future revision, expressly list authorization-by-authorization debris-plan, condition, report, record-custodian, and successor-responsibility fields. |
| §208(a)(1), (c) | Allows legally available operating, maintenance, replenishment, and public-service costs; requires budget identification of launch and replacement costs and other specified costs. | No deorbit amount or category is added. Specific cost eligibility and actual lifecycle cost remain unverified. |
| §§403, 401–403 topic mappings | Existing topic-level placements in the 05.09 and M16.01 rows. | Preserve the established topic mappings; add §107 as the transfer/authorization interface and §208 as a cost-evidence interface only. No substantive audit of all sections 401–403 is made. |

**Optional narrow §107(b) drafting language for counsel and the next bill revision:**

> The plan shall identify, for each affected Commission authorization, the authorization holder and identifying records; required assignment, transfer-of-control, modification, or other filings and the status of any required Commission action; each applicable orbital-debris mitigation plan, authorization condition, reporting duty and deadline, outstanding filing, and deployment restriction; the custodian and transfer method for related records; and the post-closing entity and official proposed to perform each continuing duty, subject to Commission action. The plan shall identify unavailable or unverified records and shall not presume that any authorization, modification, waiver, or approval is effective without action required by law.

The text is a recommendation, not adopted bill language or a legal conclusion that every listed field is independently required by current law. It strengthens traceability without changing the FCC’s statutory authority or converting a reporting requirement into proof of performance. No Bill redline is made here.

## Original-scope crosswalk changes

The companion 311-row CSV v0.4 changes **only** these two rows relative to v0.3:

- **05.09 — Space sustainability** (*Space and international law*): adds FCC orbital-debris authorization/transfer support, the §107 and limited §208 interfaces, and the report reference. The audit covers regulatory debris duties and authorization continuity; astronomical interference, foreign-permission questions, and broader space-law acceptance remain open.
- **M16.01 — Orbital debris and collision risk** (*Orbital Commons and Future Generations*): adds the same bounded FCC transfer/authorization evidence and Bill interfaces. Collision probabilities, fleet-specific performance, actual reporting, and physical-risk findings remain unverified.

The exact source titles, full scope text, source archive/member hashes, and original custody/formal-status fields are preserved. No row is accepted, and no 311 denominator is created. The practical Item 3 checkbox and both named parent topics remain formally unchecked. [S12]

## Limits and status

- No complete FCC license/authorization inventory, transaction application, or authorization-by-authorization debris-plan file was examined.
- No actual Starlink spacecraft performance, disposal, failure rate, report filing, report accuracy, deployment-pause status, or operator compliance is established.
- No deorbit/disposal cost, valuation, cash-flow input, appropriation eligibility opinion, or Bill v1.4 edit is made.
- This pass is supporting evidence for practical Item 3 and the two named subcategories only. It does not complete a practical requirement, named topic, or original scope.
- Initial coverage: 7/7. Formal acceptance: 0/7 practical; 0/36 named. The 311 proposed scope rows remain outside formal acceptance. Drafting maturity remains 29/50 (58%); overall congressional readiness remains unestablished. [S11, S12]

## Sources and retrieval record

**Primary authorities**

- **S1.** 47 U.S.C. §310(d), Office of the Law Revision Counsel, U.S. House of Representatives, preliminary Code, retrieved 16 Oct. 2026. [Official U.S. Code](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title47-section310&num=0&edition=prelim).
- **S2.** 47 C.F.R. §25.119, *Assignment or transfer of control of station authorization*, in *Code of Federal Regulations, Title 47, Parts 20–39*, revised 1 Oct. 2025, official GPO edition. The same official volume contains §25.117. [Official CFR PDF](https://www.govinfo.gov/content/pkg/CFR-2025-title47-vol2/pdf/CFR-2025-title47-vol2.pdf).
- **S3.** 47 C.F.R. §25.117(a), *Modification of station license*, same official CFR volume as S2.
- **S4.** FCC, *Mitigation of Orbital Debris in the New Space Age*, FCC 04-130, discussion of changes to orbital-debris plans after authorization, official FCC PDF. [FCC 04-130](https://docs.fcc.gov/public/attachments/FCC-04-130A1.pdf).
- **S5.** FCC, *Mitigation of Orbital Debris in the New Space Age*, FCC 22-74, Second Report and Order, official FCC record version. [FCC 22-74](https://docs.fcc.gov/public/attachments/FCC-22-74A1_Rcd.pdf).
- **S6.** 89 Fed. Reg. 65217 (9 Aug. 2024), *Space Innovation; Mitigation of Orbital Debris in the New Space Age*, effective dates and codified §25.283(e) amendment. [Official GovInfo PDF](https://www.govinfo.gov/content/pkg/FR-2024-08-09/pdf/2024-17093.pdf).
- **S7.** FCC, *Space Exploration Holdings, LLC*, FCC 22-91, Gen2 authorization conditions and disposal-failure reporting/deployment pause, official FCC PDF. [FCC 22-91](https://docs.fcc.gov/public/attachments/FCC-22-91A1.pdf).
- **S8.** FCC Space Bureau, *Space Exploration Holdings, LLC*, DA 26-36, Order and Authorization, 9 Jan. 2026, official FCC record version. [DA 26-36](https://docs.fcc.gov/public/attachments/DA-26-36A1_Rcd.pdf). FCC, DA 24-1193, para. 71, continuation of Gen2 semiannual reporting. [DA 24-1193](https://docs.fcc.gov/public/attachments/DA-24-1193A1.pdf).

**Internal records**

- **S9.** *The Starlink and Stripes Act*, Integrated Working Bill v1.4, §§107, 208 (Library ID `libfile_03ca9a5a45288191a4b45522926265aa`); read directly for this crosswalk.
- **S10.** [Gen2 Orbital-Debris Semiannual Reports: Public-Record Access Audit](/Startake/Startake_Item3_Gen2_Orbital_Debris_Semiannual_Report_Public_Record_Audit_2026-10-16.md), Library ID `libfile_bc6443ee51908191bdb5c2aa1724992d`.
- **S11.** [U.S. Orbital-Debris Disposal Rules and Starlink FCC Conditions Audit](/Startake/Startake_Item3_US_Orbital_Debris_Disposal_Compliance_Starlink_FCC_Audit_2026-10-16.md), Library ID `libfile_7203cf9127288191a3b01d5c174d1766`.
- **S12.** *Original Requirements to Bill Crosswalk v0.3*, 311-row CSV (Library ID `libfile_ce3bcbd0912081918de24544b8eb0e90`) and Markdown (Library ID `libfile_9bfbef8b5b2c819186000eb84033eac3`); original rows 05.09 and M16.01 are preserved in v0.4.