# STARTAKE Item 6 / Moral M04.09 — Allocation in Scarcity Audit

**Date:** 2026-10-19  
**Claim:** STARTAKE-20261019-WORK-ITEM6-M04-09-SCARCITY-ALLOCATION-82c750  
**Status:** Bounded direct-source research complete. Package synchronization and formal verification remain pending. Moral M04.09, its parent topic, and Practical Item 6 remain unchecked. Practical Item 1 remains outside this Work instance.

## Question and scope

The authenticated M04.09 requirement is: “Prioritization when bandwidth, capacity, or equipment is constrained.” This audit asks what current U.S. federal common-carrier and broadband network-management transparency duties govern neutral allocation under scarcity, and how proposed Bill v1.14 §§104, 205 and 401–402 compare.

The review is limited to official U.S. statutes, the Sixth Circuit’s published opinion, FCC rules and orders, and the current eCFR text. It does not decide whether a particular provider or satellite service is a common carrier or BIAS, or assert any current Starlink allocation practice, congestion, shortage, customer impact, or legal violation. Political viewpoint, protected speech, coercive-government restrictions, individual service-level measurements, contract SLA values, outage measurement, funded exit-plan design, actual emergency-service priority schedules, and service-continuity test results are outside scope.

## Findings

### 1. Common-carrier nondiscrimination is conditional

Under 47 U.S.C. §202(a), a common carrier may not impose unjust or unreasonable discrimination in charges, practices, classifications, facilities, or services for like communications, nor confer an undue or unreasonable preference or disadvantage. Section 201(a) requires a covered common carrier to furnish service upon reasonable request; §201(b) requires just and reasonable charges, practices, classifications, and regulations, while recognizing that communications may be classified into categories the Commission finds just and reasonable. These provisions do not on their face establish a single queue, first-in-first-out rule, or guaranteed capacity floor for every user. Whether a scarcity distinction is lawful would depend on the service, carrier status, like-service comparison, governing FCC rules, and evidence about the practice. [47 U.S.C. §§201](https://uscode.house.gov/view.xhtml?edition=prelim&req=granuleid%3AUSC-prelim-title47-section201) and [202](https://uscode.house.gov/us/usc/119-120/t47/s202/).

The Communications Act defines “common carrier” and “telecommunications service,” and provides that a telecommunications carrier is treated as a common carrier only when providing telecommunications services. It separately states that the FCC determines whether fixed and mobile satellite service is treated as common carriage. Thus, satellite technology alone does not settle common-carrier status. The classification of the exact service and any applicable FCC determination must be established before applying §§201–202. [47 U.S.C. §153(11), (51), (53)](https://uscode.house.gov/us/usc/119-118/t47/s153/).

In *In re MCP No. 185* (the consolidated Ohio Telecom petitions), the Sixth Circuit decided on January 2, 2025 that broadband Internet access providers offer an information service and that mobile broadband is a private mobile service; it set aside the FCC’s 2024 Safeguarding Order. The court’s holding forecloses the 2024 Order’s Title II reclassification and its new conduct rules. The FCC later said those 2024 rules never took effect and restored the relevant rule text to reflect the post-vacatur state. The court/FCC record does not establish the classification of any particular satellite offering or an FCC determination about a particular fixed or mobile satellite service under §153(51). [Sixth Circuit opinion](https://www.opn.ca6.uscourts.gov/opinions.pdf/25a0002p-06.pdf); [FCC DA 25-613](https://docs.fcc.gov/public/attachments/DA-25-613A1.pdf); [Federal Register rule effective Aug. 8, 2025](https://www.federalregister.gov/documents/2025/08/08/2025-15107/delete-delete-delete-safeguarding-and-securing-the-open-internet-restoring-internet-freedom).

### 2. BIAS transparency remains a distinct disclosure duty

Current 47 C.F.R. §8.1(a) requires any person providing broadband Internet access service (BIAS) to publicly disclose accurate information about network-management practices, performance characteristics, and commercial terms, sufficient to inform consumers and small businesses. Section 8.1(b) defines BIAS as a mass-market retail service by wire or radio that enables transmission to and from all or substantially all Internet endpoints, with stated exceptions; §8.1(c) defines reasonable network management by reference to a legitimate purpose, tailoring, network architecture, and technology. This disclosure rule is written to apply to a BIAS provider, not only to a Title II common carrier. A service must still meet the rule’s definition; this audit makes no provider-specific classification. [Current 47 C.F.R. §8.1](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-8).

The rule therefore can support public disclosure of capacity-management practices and service terms when the offering qualifies as BIAS. Its text does not prescribe a universal priority order, guarantee individual access under scarcity, or itself create an emergency-user reservation. Reading §8.1 as a disclosure obligation rather than a fixed allocation algorithm is an inference from its operative text and the FCC’s post-vacatur rule restoration.

The original requirement also covers physical equipment shortages. Sections 201–202 concern covered communications services and related practices/facilities; they do not, by themselves, create a general consumer right to a particular terminal or a standalone terminal-rationing formula. Part 8 requires BIAS disclosures and does not prescribe inventory allocation. Proposed §205(a) speaks to capacity-management rules, while §402(d) identifies terminal supply as an input to specified cutover site/service testing; neither provision sets a general equipment-distribution schedule. This distinction is an inference from the cited statute, rule, and Bill v1.14 text.

The status check included the FCC’s August 2025 restoration of Part 8 and the August 2026 amendment to broadband consumer labels. The latter changed or delayed label provisions; the FCC stated that the label changes did not eliminate the separate network-transparency rule. The current eCFR reflects later amendments to §8.1, including the 2025 restoration and 2026 label update. [FCC DA 25-613 and effective rule](https://www.federalregister.gov/documents/2025/08/08/2025-15107/delete-delete-delete-safeguarding-and-securing-the-open-internet-restoring-internet-freedom); [FCC 26-48, 91 Fed. Reg. 52251 (Aug. 13, 2026)](https://www.federalregister.gov/documents/2026/08/13/2026-16503/empowering-broadband-consumers-through-transparency).

### 3. Bill v1.14 makes capacity rules more explicit but leaves allocation criteria open

Proposed §205(a) would require service terms and capacity-management rules to be accessible and published, and would require capacity limits and safety controls to follow published, technically justified rules. It also requires service without unlawful discrimination. That is a more explicit capacity-rule publication safeguard than the current federal BIAS transparency baseline. But it does not name priority classes, a tie-breaker, a minimum resource floor, or a particular queueing method. The Corporation or implementing rules would still need to specify how scarce capacity or equipment is allocated and how the criteria are audited.

Proposed §205(d) would require a measured access baseline addressing effective availability, quality, accessibility, total installed and recurring cost, affordability, geography, eligibility, expected take-up, and data gaps. That would help identify the reach and consequences of a capacity policy; it is not itself a priority schedule or service guarantee.

Proposed §104 is a transaction-closing gate: it calls for legal permissions, funded and executable continuity arrangements, operational readiness, and a record explaining the proposed transaction. It does not prescribe day-to-day resource allocation.

Proposed §§401–402 address staged transition and cutover. Section 401(d) would register contracted services whose interruption foreseeably threatens life, emergency response, or essential public functions. Section 402 requires witnessed tests and, for critical services, site/service testing that includes capacity and a diverse alternative communications path unless the stated feasibility exception is satisfied. These are transition and continuity controls, not an operational priority schedule for all users during congestion. This report does not claim any such test has occurred or that any particular service meets the critical-service criteria.

## Assessment

The present federal framework is two-track: common-carrier nondiscrimination and just-and-reasonable duties apply only where the exact service is legally subject to common carriage; BIAS transparency separately requires qualifying providers to disclose network-management practices and terms. The 2024 FCC conduct rules did not take effect after the Sixth Circuit set aside the order. The §153(51) satellite-service clause makes the provider/service classification question particularly important for fixed or mobile satellite offerings.

Bill v1.14 would add a clear public rule-making requirement for capacity limits and safety controls, plus a baseline for measuring who has usable access. It does not yet decide who receives priority, what technical conditions justify a priority, how conflicts between customer classes are resolved, or what minimum performance—if any—is guaranteed. That is an implementation gap for future rules and evidence, not proof that the bill is ineffective or that any current allocation is unlawful.

## Verification gaps and next evidence

Before any provider-specific or formal acceptance conclusion, obtain:

1. The exact service and entity boundaries, the applicable FCC classification, and any Commission determination concerning fixed or mobile satellite common carriage.
2. The actual published capacity-management, eligibility, and customer terms for the service under review.
3. Engineering evidence identifying the scarce resource, trigger conditions, technical and safety rationale, affected classes, duration, exceptions, and restoration process.
4. If the proposed Act is implemented, the adopted §205 rules and the §205(d) baseline, with data sufficient to test whether published criteria are applied consistently.
5. For a proposed cutover, the approved critical-service register, witnessed capacity/site tests, alternative-path evidence, and mission tolerances. These are prospective evidence requests, not current findings.

## Method, scope limits, and status

Research date: 2026-10-19. The statutes, court decision, FCC rulemaking materials, Federal Register publication, and current eCFR were reviewed directly. Legal Data Hunter reference resolution was unavailable because its free daily quota was exhausted; this report is not Legal Data Hunter verified. No legal counsel or independent professional review is represented. Claims are limited to the cited primary materials and the stated issue scope.

The authenticated M04.09 source member is in Starlink_Moral_Foundation_Research_Topics_19.zip (Library ID libfile_d51e095c82b88191807ddb3d6f4bdcfd, archive SHA-256 26ab27f27c0099f19ee0ac32d02e3245ba32555196d001fd4b60756fac66c8e0; member SHA-256 c86af941a2c78f1ae163f7b3c502bf9d250c514a59cb687c0b5cb15a32de10fd). Bill v1.14 was read from Library ID libfile_0fb03f28404c8191a6c549b3c0abb8f0 (150,978 bytes; SHA-256 848e3dc59d671a56241f379ba9b9dcd427c679ca4051467674a5517edea6977e). Crosswalk v1.15 identified no prior M04.09 report or Library ID. The reservation was saved in tracker v339 and independently read back byte-for-byte: 544,028 bytes, SHA-256 1ee5394f0417cba75d82acb54ef609e4d5fda906d9efda8ba9a46b97128e14ec; its v338 history suffix remains intact.

Formal status is unchanged: initial coverage 7/7; formal acceptance 0/7 practical items and 0/36 named topics; all 311 proposed scopes remain outside formal acceptance; drafting maturity 29/50; congressional readiness unestablished. Practical Item 1 remains excluded.

## Sources

**Legislation**
- [47 U.S.C. §153](https://uscode.house.gov/us/usc/119-118/t47/s153/) — definitions and satellite common-carriage clause.
- [47 U.S.C. §201](https://uscode.house.gov/view.xhtml?edition=prelim&req=granuleid%3AUSC-prelim-title47-section201) — service and charges.
- [47 U.S.C. §202](https://uscode.house.gov/us/usc/119-120/t47/s202/) — discrimination and preferences.

**Case law**
- [In re MCP No. 185, Ohio Telecom Ass’n v. FCC, Nos. 24-7000 et al. (6th Cir. Jan. 2, 2025)](https://www.opn.ca6.uscourts.gov/opinions.pdf/25a0002p-06.pdf).

**Agency rules and orders**
- [47 C.F.R. Part 8, current eCFR](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-8).
- [FCC DA 25-613, Restoring the Code of Federal Regulations](https://docs.fcc.gov/public/attachments/DA-25-613A1.pdf); [Federal Register publication, 90 Fed. Reg. 38406 (Aug. 8, 2025)](https://www.federalregister.gov/documents/2025/08/08/2025-15107/delete-delete-delete-safeguarding-and-securing-the-open-internet-restoring-internet-freedom).
- [FCC 26-48, Empowering Broadband Consumers Through Transparency, 91 Fed. Reg. 52251 (Aug. 13, 2026)](https://www.federalregister.gov/documents/2026/08/13/2026-16503/empowering-broadband-consumers-through-transparency).
