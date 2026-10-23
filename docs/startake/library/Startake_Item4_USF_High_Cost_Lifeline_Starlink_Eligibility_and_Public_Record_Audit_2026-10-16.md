# Item 4 §254 Universal-Service Programs: High Cost and Lifeline Eligibility and Public-Record Audit

**Project date:** 16 October 2026 UTC  
**Assignment:** `STARTAKE-20261016-WORK-ITEM4-USF-LIFELINE-HIGHCOST-9d83a2`  
**Scope:** Original requirement 04.07, *Universal service and affordability*; supporting public-funding evidence for practical Item 4. This is a bounded source audit and proposed-bill drafting pass, not formal acceptance.

## Finding

The governing statutes allow specific Federal universal-service support only to an eligible telecommunications carrier (ETC) designated under 47 U.S.C. §214(e), and restrict the support to the facilities and services for which it is intended. Commercial satellite service alone does not establish ETC designation or support eligibility. In the public records checked, the Lifeline disbursement search returned **“No Records Found Matching Your Criteria”** for the known USAC 498 ID/SPIN `143053761`, previously associated in the E-Rate record with Space Exploration Technologies Corp. The High Cost data tool's searchable 498-ID list showed no selectable value for that identifier. Those bounded results do not establish that Starlink or every related legal entity is not designated or has never received support.

No Starlink-specific ETC designation, High Cost award/commitment, Lifeline payment, provider cash receipt, service delivery, compliance, or dollar amount was established. The open Lifeline dataset is indexed by Study Area Code (SAC) and omits SPIN; the public High Cost search covers a rolling ten-year window and includes adjustments. This pass did not enumerate state/FCC ETC designation orders or search every lawfully identified related entity. The result is **unresolved at the entity/program level**.

## Statutory and program rules

1. **Support eligibility and use.** Section 254(e) provides that only an ETC designated under §214(e) is eligible for specific Federal universal-service support and requires a recipient to use support only for the facilities and services for which it is intended. Section 214(e) assigns ETC designation to a State commission in the ordinary case, with an FCC designation route for specified carriers not subject to State commission jurisdiction; designation is service-area-specific and carries service and advertising duties. See [47 U.S.C. §254](https://uscode.house.gov/us/usc/119-120/t47/s254/) and [47 U.S.C. §214(e)](https://uscode.house.gov/view.xhtml?req=%28title%3A47+section%3A214%28e%29+edition%3Aprelim%29).
2. **Provider and service-area identifiers.** USAC says carriers participating in High Cost or Lifeline need program-specific ETC designation in addition to a 498 ID (formerly SPIN). The 498 ID identifies a service provider for USAC payment; a SAC identifies an ETC's designated service area. A new Lifeline-only provider needs a SAC before obtaining its 498 ID. See USAC's [Join Lifeline as an ETC](https://www.usac.org/lifeline/get-started/join-lifeline-as-an-etc/) and [service-provider guidance](https://www.usac.org/about/tribal-nations/service-providers/).
3. **Public payment data.** USAC's legacy Lifeline search accepts a 498 ID and reports data from January 2004 onward; it says disbursements from August 2012 are based on actual FCC Form 497 claims. The separate open dataset publishes ETC disbursements and subscriber claims from January 2018 onward but displays SAC rather than SPIN. USAC's High Cost detailed payment tool covers ten years and supports filters for Form 498 ID, SAC, state, year/month and fund type; USAC cautions that amounts reflect adjustments. See [Lifeline disbursement search](https://apps.usac.org/li/tools/disbursements/default.aspx), [Lifeline data coverage](https://datahub.usac.org/stories/s/Lifeline-Tools/w5mg-izf6/), and [High Cost detailed-payment search](https://datahub.usac.org/stories/s/High-Cost-Detailed-Payment-Data-Search/xdv8-dk65/).
4. **Reporting and limits.** USAC requires participating High Cost and/or Lifeline ETCs to file FCC Form 481 annually by SAC. The current filing uses 2025 data for Program Year 2027; USAC says it makes non-confidential information public, while certain data may receive confidential treatment. This audit did not authenticate a Starlink-related Form 481 filing. See [USAC Form 481 requirements](https://www.usac.org/high-cost/annual-requirements/file-fcc-form-481/).

## Public-record method and result

| Source | Query or coverage | Observed result | What it supports |
|---|---|---|---|
| USAC Lifeline Funding Disbursement Search | Exact 498 ID `143053761`; no year, month, state or SAC filter; interface covers January 2004 onward and is updated monthly | Results page stated “No Records Found Matching Your Criteria” | No Lifeline disbursement record was returned under this identifier in that search. It is not a nonparticipation finding for other entities or identifiers. |
| USAC Lifeline Open Data | Documentation and available dataset fields | Open dataset reports monthly support and subscribers since January 2018 using SAC; it does not include SPIN | Without an authenticated SAC-to-entity match, this dataset cannot be joined to the known E-Rate SPIN for a provider-level conclusion. |
| USAC High Cost Detailed Payment Data Search | Ten-year public payment table; 498-ID filter searched for `143053761` | No selectable matching 498-ID value appeared in the filter results; no filtered payment row was available to inspect | No High Cost value was matched under this 498 ID in the public filter. The search does not rule out other identifiers, related entities, periods outside coverage, or a designation without a payment row. |
| FCC/State ETC designation orders and provider-level Form 481 | Not exhaustively searched in this pass | No designation census or Form 481-to-entity join was completed | Current ETC status, service area, conditions, support use and reporting status remain unknown. |

The `143053761` identifier comes from a prior bounded E-Rate audit that identified Space Exploration Technologies Corp. as the provider. Its E-Rate participation does not establish High Cost or Lifeline designation or participation. The identifier search above tested for a cross-program lead; it did not expand the scope into E-Rate records or resolve any earlier E-Rate payment questions.

## Current legal development

In *Consumers’ Research v. FCC*, No. 25-60535 (5th Cir. Oct. 15, 2026), the Fifth Circuit concluded that the FCC lacked specific statutory authorization under the Government Corporation Control Act to establish USAC to act as an agency, and that the FCC exceeded its statutory authority by relying on USAC projections when setting the **Fourth Quarter 2025** contribution factor. The court granted the petition, vacated that quarter's factor, and remanded to the FCC. The opinion does not vacate 47 U.S.C. §§214(e) or 254, and the remedy described is limited to the Q4 2025 contribution factor. This audit makes no conclusion about any broader effect, subsequent appeal or mandate status, other contribution quarters, or a Starlink-related provider's eligibility. [Official opinion](https://www.ca5.uscourts.gov/opinions/pub/25/25-60535-CV0.pdf).

## Bill and crosswalk disposition

Bill v1.6 §107(a)–(b) preserves required Commission action and requires a pre-close plan for affected Commission authorizations, but its enumerated checklist does not expressly cover State- or FCC-designated ETC status, universal-service support conditions, or post-close responsibility for any applicable §214(e) designation. Section 403 is a foreign-permissions register; it does not address domestic ETC status. Existing §302(d)(1)–(6) already covers public support identified in due diligence, source limits, record-level reconciliation, outlays, and verified cash receipts. No provider amount or §302 amendment is supported by this record.

A narrow proposed addition to §107(b) is included in **Bill v1.7**. It requires the pre-close plan to identify any applicable ETC designation and support obligations, the designating authority/service area, any legally required transaction or continued-eligibility action, and the post-close responsible entity and official. It requires consultation with the relevant State commission and FCC where applicable. It expressly creates no designation, support eligibility, transfer, or deemed compliance. This is a due-diligence safeguard, not a finding that any Starlink entity has ETC status or receives USF support. The change does not alter §302 or §403.

The crosswalk row 04.07 now maps to Bill §§107(b)(6) and 302(d)(1)–(6); the prior §403 reference is removed because §403 concerns foreign permissions. Only original row 04.07 changed in Crosswalk v0.8. The row, practical Item 4, and parent named topic remain formally unchecked.

## Proposed Bill v1.7 text

Add the following paragraph to §107(b), after paragraph (5):

> “(6) any designation of the covered commercial business as an eligible telecommunications carrier under section 214(e) of the Communications Act of 1934, identifying the designating authority and service area; any related Federal universal-service support and applicable use, reporting, and repayment duties; any application, notice, consent, or determination of continuing eligibility required by law for the proposed transaction; and the entity and designated official responsible after closing for each continuing duty. For this paragraph, the Secretary shall consult the Commission and each State commission with jurisdiction, as applicable.”

After paragraph (6), add: “Nothing in this Act grants or transfers an eligible-telecommunications-carrier designation or authority to receive universal-service support, or deems an applicable Federal or State requirement satisfied.”

## Limits and open evidence

- No claim is made that Starlink, Space Exploration Technologies Corp., Space Exploration Holdings, LLC, or another related entity is or is not currently an ETC.
- No High Cost or Lifeline designation order, application, commitment, award, disbursement amount, subscriber count, service delivery, provider cash receipt, bank remittance, or support-use compliance was established.
- No complete legal-entity or 498-ID universe, exhaustive State/FCC designation search, complete USF funding total, or affordability outcome was attempted.
- Public disbursement entries, if later matched, would still need to be distinguished from program eligibility, authorized service, outlay and actual recipient cash receipt.
- Formal acceptance remains 0/7 practical and 0/36 named; the 311 proposed scope texts remain outside formal acceptance. Descriptive drafting maturity remains 29/50 (58%). Overall congressional readiness remains unestablished. Counsel review of the proposed clause and the Fifth Circuit opinion's effect remains open.

## Primary sources and internal record

- [47 U.S.C. §254](https://uscode.house.gov/us/usc/119-120/t47/s254/).
- [47 U.S.C. §214(e)](https://uscode.house.gov/view.xhtml?req=%28title%3A47+section%3A214%28e%29+edition%3Aprelim%29).
- [USAC: Join Lifeline as an ETC](https://www.usac.org/lifeline/get-started/join-lifeline-as-an-etc/).
- [USAC: Lifeline Funding Disbursement Search](https://apps.usac.org/li/tools/disbursements/default.aspx).
- [USAC: Lifeline Open Data tool description](https://datahub.usac.org/stories/s/Lifeline-Tools/w5mg-izf6/).
- [USAC: High Cost Detailed Payment Data Search](https://datahub.usac.org/stories/s/High-Cost-Detailed-Payment-Data-Search/xdv8-dk65/).
- [USAC: FCC Form 481 filing requirements](https://www.usac.org/high-cost/annual-requirements/file-fcc-form-481/).
- [Fifth Circuit: *Consumers’ Research v. FCC*, No. 25-60535 (Oct. 15, 2026)](https://www.ca5.uscourts.gov/opinions/pub/25/25-60535-CV0.pdf).
- Prior internal source: *Item 4 USAC E-Rate application and payment-link audit* (Library ID `libfile_186da839568c81918d35b48808c367b`), identifying the known E-Rate 498 ID/SPIN `143053761`; this prior record is not treated as evidence of High Cost or Lifeline participation.