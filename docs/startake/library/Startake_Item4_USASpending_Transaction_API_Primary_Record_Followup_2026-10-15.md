# STARTAKE Item 4 — USAspending Transaction API Primary-Record Follow-Up

**Research date:** 15 October 2026 UTC  
**Claim:** STARTAKE-20261015-WORK-PIIDAPI-38c20b  
**Method:** Direct review of the public USAspending v2 award-summary and transaction APIs; not a Deep Research-app job, payment audit, or nationwide award census.  
**Perimeter:** Three previously flagged federal procurement child PIIDs for commercial Starlink equipment/service. Starshield, launch, other SpaceX business, grants, and indirect assistance are not presumed part of these awards.

## Result

The official USAspending v2 award-summary and transaction endpoints return officially published award and action records for all three exact child PIIDs. The records identify Space Exploration Technologies Corp. (UEI C6M7C2FLKER5) as recipient and link all three children to GSA Federal Acquisition Service IDV 47QRAA21D007N. The transaction histories show net federal action obligations of **$8,209,572.00**, **$348,513.86**, and **$130,579.40**. Their arithmetic sum is **$8,688,665.26** for these three selected child awards only. It is not a nationwide Starlink funding total, an appropriation, a contract-vehicle ceiling, revenue, or verified cash received.

The prior third-party index figure of $348,514 for 19AQMM25F1269 is 14 cents above the official transaction total. The official amount is $348,513.86. Neither the award obligation nor the account-outlay field establishes how much SpaceX actually received in cash.

## Award-summary crosswalk

| Child PIID | Official USAspending award key | Purpose and agency | Recipient / UEI | Parent IDV | Award-summary obligation |
|---|---|---|---|---|---:|
| 19AQMM25F1270 | CONT_AWD_19AQMM25F1270_1900_47QRAA21D007N_4732 | “STARLINK KITS AND SERVICE”; Department of State | SPACE EXPLORATION TECHNOLOGIES CORP. / C6M7C2FLKER5 | CONT_IDV_47QRAA21D007N_4732 | $8,209,572.00 |
| 19AQMM25F1269 | CONT_AWD_19AQMM25F1269_1900_47QRAA21D007N_4732 | “STARLINK KITS AND SERVICE”; Department of State | SPACE EXPLORATION TECHNOLOGIES CORP. / C6M7C2FLKER5 | CONT_IDV_47QRAA21D007N_4732 | $348,513.86 |
| FA254126FB049 | CONT_AWD_FA254126FB049_9700_47QRAA21D007N_4732 | Starlink local-priority service for the White House Communications Agency; Department of Defense | SPACE EXPLORATION TECHNOLOGIES CORP. / C6M7C2FLKER5 | CONT_IDV_47QRAA21D007N_4732 | $130,579.40 |

The two Department of State award summaries report a 2 September 2025 signed date and start date; their reported performance end dates are 14 October 2026 and 7 October 2026, respectively. The DoD/WHCA summary reports a 23 March 2026 signed date and 24 March 2026 start date, with a 23 March 2027 end date. These are database fields, not proof of completed performance or invoice payment.

## Transaction-history reconciliation

The official transaction-count endpoint reports two actions for each State child and one for the DoD/WHCA child. Each transaction-history response returned one page with no next page.

| PIID | Modification | Action date | Description / action type | Federal action obligation |
|---|---|---|---|---:|
| 19AQMM25F1270 | 0 | 2 Sep 2025 | Initial delivery-order action; “STARLINK KITS AND SERVICE” | $8,209,572.00 |
| 19AQMM25F1270 | P00001 | 30 Sep 2025 | Supplemental agreement for work within scope | $0.00 |
| 19AQMM25F1269 | 0 | 2 Sep 2025 | Initial delivery-order action; “STARLINK KITS AND SERVICE” | $348,513.86 |
| 19AQMM25F1269 | P00001 | 30 Sep 2025 | Supplemental agreement for work within scope | $0.00 |
| FA254126FB049 | 0 | 23 Mar 2026 | Initial delivery-order action; Starlink local-priority service for WHCA | $130,579.40 |

There are no negative federal-action-obligation values in these returned histories. The State P00001 actions have zero-dollar changes; they are not de-obligations. For each PIID, the sum of returned action obligations equals the award-summary total obligation. The three distinct child award keys were counted once each; the common parent IDV and any parent-level aggregate were excluded from the $8,688,665.26 calculation.

## Award/account fields and outlay limit

| PIID | Associated federal-account count | Total obligation | Account obligation | Account outlay | Award total outlay |
|---|---:|---:|---:|---:|---|
| 19AQMM25F1270 | 1 | $8,209,572.00 | $8,209,572.00 | $0.00 | null |
| 19AQMM25F1269 | 2 | $348,513.86 | $348,513.86 | $0.00 | null |
| FA254126FB049 | 0 | $130,579.40 | $0.00 | $0.00 | null |

The first two awards have account-linked obligations matching their transaction histories, with zero account outlays displayed. For FA254126FB049, USAspending reports zero associated federal accounts: its award/action obligation is $130,579.40 while the account-linked obligation and outlay fields are $0.00. The USAspending analyst guide explains that award records can be unlinked from account records when a shared identifier is unavailable. The zero account fields for this third PIID therefore disclose the available linked-account result; they do not negate its transaction-level obligation and do not establish whether the supplier was or was not paid.

USAspending defines an obligation as a government promise to spend, and an outlay as money actually paid out. The returned award-summary total_outlay field is null for all three records; account-linked outlays are shown as $0.00. No Treasury payment file, agency invoice/acceptance record, remittance record, or SpaceX receipt ledger was obtained. Accordingly, actual supplier cash receipts remain **unknown**. The records also do not establish appropriated budget authority, final delivered quantities, service acceptance, recognized revenue, or an unexercised contract ceiling.

## Accounting and legislative implication

These are procurement delivery orders describing purchased equipment/connectivity services, not grants or financial assistance on the records retrieved. Procurement obligations should not be described as subsidies merely because a public agency is the buyer. The three record amounts are a limited obligation sample, not all public support or public investment and do not imply that federal payments offset just compensation.

Bill v0.5 adds proposed subsection 302(d) to require an evidence-graded public-funding ledger. It requires the Secretary to preserve award keys and action history, reconcile positive and negative actions, distinguish obligations, account-reported outlays, award amounts, ceilings, appropriations, and verified receipts, avoid parent/child double counting, and keep mixed/unallocated SpaceX awards out of Starlink-only totals absent a reproducible allocation. It permits unknown amounts to remain unknown and does not insert this three-award subtotal into the bill or appropriate money.

## Authenticated-criteria crosswalk

| Original requirement | Evidence from this pass | Remaining gap / status |
|---|---|---|
| Practical Item 4 — Verified public-funding ledger | Three exact federal procurement child PIIDs now have USAspending summary records, action counts, transaction histories, recipient UEI, parent links, award-level obligations, and account-link fields. | Seven-item checkbox remains **unchecked**. No national/all-years census, complete grants/assistance/indirect-support schedule, certified receipts, or complete account reconciliation. |
| Legal topic 06.02 — Federal procurement and service revenue | Two State orders and one DoD/WHCA order classified from official award/transaction records; actions reconciled to the three summary obligations. | Obligations do not prove realized supplier receipts or revenue and do not complete the topic's nine subcategories. |
| Legal topic 06.01 — Direct federal grants and subsidies | Procurement evidence only; no grant/subsidy inference made. | Separate assistance and grant census remains open. |
| Legal topic 06.04 — Rejected, canceled and undisbursed awards | The three returned histories contain no negative obligation; the two P00001 changes are zero-dollar supplemental agreements. | No wider canceled, rejected, de-obligated, or undisbursed award review. |
| Legal topic 06.09 — Public investment attribution and accounting | Distinguishes three unique child keys, shared parent IDV, action obligations, account fields, and unknown receipts. | No transfer-pricing, indirect-support, wealth attribution, or national accounting model. |

The full-title overlaps remain **Starlink-only historic funding ledger**, **Fiscal policy and economic impact**, and **Public Investment, Reciprocity, and the Social Contract**. This limited evidence pass formally accepts no topic. The separate cross-cutting Public Funding and Wealth Attribution requirement remains open and is not a 37th named topic.

## Source and retrieval log

1. **USAspending API v2 overview and endpoint index.** The endpoint index identifies award detail, award transaction counts, federal-account counts, and transaction history. Retrieved 15 Oct 2026:  
   - <https://api.usaspending.gov/>  
   - <https://api.usaspending.gov/docs/endpoints>
2. **Transaction-history contract.** The official USAspending API repository documents POST /api/v2/transactions/, which returns action date, action type, modification number, description, and federal action obligation. Request used: {"award_id":"<exact generated award key>","page":1,"limit":5000,"sort":"action_date","order":"asc"}. Retrieved 15 Oct 2026:  
   - <https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/transactions.md>
3. **Award-summary API records.** Direct GETs, one per exact award key:  
   - <https://api.usaspending.gov/api/v2/awards/CONT_AWD_19AQMM25F1270_1900_47QRAA21D007N_4732/>  
   - <https://api.usaspending.gov/api/v2/awards/CONT_AWD_19AQMM25F1269_1900_47QRAA21D007N_4732/>  
   - <https://api.usaspending.gov/api/v2/awards/CONT_AWD_FA254126FB049_9700_47QRAA21D007N_4732/>
4. **Transaction counts and page completeness.** Direct GETs to <https://api.usaspending.gov/api/v2/awards/count/transaction/> followed by each exact award key returned 2, 2, and 1 transactions. The transaction API query was retrieved at **2026-10-15T14:46:37.9113207Z**; all three responses reported hasNext=false.
5. **Federal-account linkage.** Direct GETs to <https://api.usaspending.gov/api/v2/awards/count/federal_account/> followed by each exact award key returned 1, 2, and 0 accounts. The award-summary API returned the account obligation and outlay fields shown above.
6. **API data update date.** <https://api.usaspending.gov/api/v2/awards/last_updated/> returned {"last_updated":"10/15/2026"}.
7. **USAspending Analyst’s Guide to Federal Spending Data.** Award and account spending are separate data layers; obligations and outlays have distinct meanings; missing shared IDs can leave an award unlinked to account spending; award outlay submissions are required monthly from FY2022. Retrieved 15 Oct 2026:  
   - <https://www.usaspending.gov/federal-spending-guide>
8. **Prior research preserved and reconciled:** [Item 4 procurement PIID audit](Startake_Item4_Federal_Procurement_PIID_Primary_Record_Audit_2026-10-15.md) and [Item 4 public-funding starter ledger](Startake_Item4_Public_Funding_Ledger_Takeover_Research_Pass_2026-10-14.md). Earlier unverified aggregator amounts remain provenance; the exact 19AQMM25F1269 amount is refined to $348,513.86 by the official transaction record.
9. **Original requirements:** [authenticated 36-topic and 311-proposed-subcategory requirements report](Startake_Original_Requirements_Authentication_36_Topics_311_Subcategories_2026-10-15.md), Item 4 and legal topic 06.
10. **Bill contribution:** [Integrated Working Bill v0.5](The_Starlink_and_Stripes_Act_Integrated_Working_Bill_v0.5_2026-10-15.md), proposed §302(d).

## Formal status and remaining diligence

**Research pass complete — verification pending; claim released only after the report and bill were saved and read back.** The bounded three-PIID award-history verification is closed. Item 4 remains unchecked; formal acceptance remains **0/7 practical items and 0/36 named topics**. The original 311 subcategory proposals remain unaudited. Initial research coverage remains 7/7. Drafting maturity remains separate and overall congressional readiness remains unestablished.

Open diligence includes: source-complete federal/state/local/foreign award inventory; official recipient and account linkage review for the FSS parent and child actions; invoices, deliverable acceptance and agency/Treasury payment evidence; actual recipient cash receipts; BEAD and other indirect demand support; tax/regulatory-credit attribution; parent-company/mixed-award allocation; and CBO/OMB, appropriations, GAO, legal, engineering, appraisal and legislative-counsel review.