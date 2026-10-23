# Item 6 Federal Cybersecurity and Incident-Reporting Applicability Audit

**Date:** 16 October 2026  
**Claim:** STARTAKE-20261016-WORK-ITEM6-CYBER-FISMA-bcc647  
**Scope:** Practical Item 6; authenticated original scope 12.07, “Cybersecurity and insider-risk governance.”  
**Status:** Bounded primary-source review complete; formal verification pending. No claim of system compliance or formal acceptance.

## Question and method

This pass tested the federal information-security and cyber-incident-reporting duties that would apply to the proposed publicly owned commercial Starlink operator under Bill v1.7 §§201(c), 206(c)–(d), and 208(c). It reviewed current federal statutes, CISA and Federal Register rulemaking materials, OMB’s published federal-incident guidance, and NIST standards. The legal analysis is limited to the proposed corporation and the systems that meet the relevant statutory definitions. It does not inspect Starlink systems, determine classification boundaries, or assess performance.

The reservation was conditionally saved from canonical tracker version 269 to version 270 and independently read back before research. The reserved scope is limited to Item 6 and original scope 12.07. Related classified-program, actual-system, and technical-testing scopes were excluded.

## Findings

1. **Bill v1.7 would subject the new corporation to federal information-security law.** Proposed §201(c) says the Corporation is to be treated as an agency for federal information-security requirements. Separately, 44 U.S.C. §3502(1) includes Government corporations in the definition of “agency.” FISMA responsibilities in 44 U.S.C. §§3551–3558 therefore provide a substantial statutory baseline if the bill is enacted. This is a conclusion about proposed law, not evidence that Starlink or the proposed operator has implemented it.

2. **FISMA’s system boundary is fact-dependent.** The agency must protect information collected or maintained by or for it and information systems used or operated by it, its contractor, or another organization on its behalf. A system inventory, categorization, and documented agency-information relationship are necessary to determine the duties for particular systems. Neither public ownership alone nor the fact that a federal customer uses a service proves that every commercial network component, customer terminal, or Starlink system is a Federal information system. The post-acquisition operator’s control of commercial network systems could make some or many systems subject to the statute, but an item-by-item boundary determination is outside this public-record review.

3. **The enacted FISMA baseline includes continuing controls, testing, reporting, and continuity.** The agency head must establish a risk-based information-security program; maintain an inventory; test controls at least annually for each inventoried system; remediate weaknesses; establish procedures to detect, report, and respond to incidents; notify and consult the Federal information security incident center; and maintain continuity procedures. For a major incident, the statute also requires specified congressional notification within seven days after there is a reasonable basis to conclude it occurred, with later updates. Section 3555 separately requires an annual independent evaluation of the information-security program and a representative subset of systems. These duties complement the bill’s annual operational audit; they are not replaced by it.

4. **Standards and national-security-system treatment require a protected implementation map.** 40 U.S.C. §11331 makes federal information-security standards compulsory and binding, subject to its statutory exceptions. NIST FIPS 200 provides minimum security requirements for federal systems. CISA’s Binding Operational Directive 23-01 states its scope is Federal Civilian Executive Branch unclassified systems, including covered systems another entity operates on an agency’s behalf; the directive excludes national security systems and certain Defense and Intelligence Community systems. The specific boundary, applicable standards, directives, and any separate national-security-system handling must be determined by responsible officials. No classified or Starshield system is included in the acquisition scope here.

5. **CIRCIA’s 72-hour and 24-hour reporting deadlines are not yet operational.** The statute establishes a 72-hour deadline for covered cyber incidents and a 24-hour deadline after ransom payment, but it makes the reporting provisions effective on dates prescribed in CISA’s final rule. “Covered entity” and “covered cyber incident” are defined through that rule. As of 16 October 2026, CISA’s published rulemaking update says it is still working on the final rule and that reporting will not be required before the final rule’s effective date. The Unified Agenda lists a September 2026 target, which is a projected rulemaking date, not proof that the final rule was issued. The proposed 2024 rule and 2026 town-hall notices are rulemaking materials, not operative reporting requirements. Whether the future Corporation or any service/system is a covered entity remains open pending the final rule and application of its criteria.

6. **The bill has a narrow accountability-drafting ambiguity, but this pass does not amend it.** Sections 201(c), 206(c)–(d), 208(c), and 402 already supply agency treatment, reporting channels for security defects, annual audits, security-cost reporting, and cutover testing. Section 201(c) does not expressly identify which corporate officer is the “head of the agency” for FISMA duties, who owns the system-boundary and categorization schedule, or the incident-reporting point of contact across cutover. The Board/CEO relationship in §202 may support an answer, but the statutory allocation is not stated. Legislative Counsel should decide whether §201(c) or the transition plan should expressly assign that role and require a protected system-boundary/incident-handoff schedule. No draft text is integrated because choosing the responsible officer is a legislative allocation rather than an existing legal fact. Bill v1.7 remains unchanged.

## Bill and original-scope crosswalk

| Record | Result |
|---|---|
| Original scope 12.07 — “Cybersecurity and insider-risk governance” | One bounded statutory and implementation-authority review completed. Security controls and annual independent assessment obligations mapped; actual privileged-access controls, system inventory, and effectiveness remain unverified. |
| Bill §201(c) | Expressly treats the Corporation as an agency for federal information-security requirements; no particular Starlink system classification or compliance result is established. |
| Bill §206(c)–(d) | Protected security-defect disclosures and annual operational/rights audit are useful complementary safeguards; they do not replace FISMA incident procedures, annual testing, or annual independent evaluation. |
| Bill §208(c) | Requires security costs to be identified in budgets; it does not establish the amount or demonstrate that required resources are funded. |
| Bill §§401–402 | Transition and cutover planning/tests address several security dependencies; no pre-close FISMA boundary, accountable agency-head role, or CIRCIA applicability determination is recorded. |
| Status | Practical Item 6 and named topic “Corporate governance and civil liberties” remain formally unchecked. This is evidence for original scope 12.07 only, not acceptance of it or its parent topic. |

**Disposition:** Retain Bill v1.7 for this pass. Add an independent legislative-counsel question on designation of the FISMA agency head and a protected system-boundary/incident-handoff schedule. Do not insert a CIRCIA 72-hour requirement as though its final-rule trigger has occurred. Do not claim FISMA/CIRCIA compliance, a breach, an incident, a control test, an appropriation, or an actual cybersecurity cost.

## Outstanding evidence and review

- Identify the accountable corporate official and map every acquired/operated system against the enacted statutory definitions, applicable FISMA/NIST/CISA requirements, and any national-security-system criteria.
- Obtain and test actual architecture, asset inventory, data flows, credential/key controls, software-update authority, supplier controls, incident procedures, continuity plans, and cutover performance through appropriately authorized independent review.
- Recheck the final CIRCIA rule and determine its applicability when issued and effective.
- Obtain Legislative Counsel’s view on the FISMA agency-head assignment, and cleared cyber/space-system professionals’ view on system boundaries and test design.

## Primary-source index

All materials were reviewed on 16 October 2026. Legal requirements, proposals, guidance, and unverified system facts are kept distinct.

1. 44 U.S.C. §3502(1), (8), definitions of agency and information system: [U.S. House Office of the Law Revision Counsel](https://uscode.house.gov/view.xhtml?edition=prelim&f=treesort&jumpTo=true&num=0&req=%28title%3A44+section%3A3502+edition%3Aprelim%29+OR+%28granuleid%3AUSC-prelim-title44-section3502%29).
2. 44 U.S.C. §§3552(b)(6), 3554, national security system definition and federal agency responsibilities: [§3552](https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title44-section3552); [§3554](https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title44-section3554).
3. 44 U.S.C. §3555, annual independent evaluation, auditor, and protected national-security-system information: [U.S. House OLRC](https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title44-section3555).
4. 44 U.S.C. §3557, agency responsibility for national security systems under special standards: [U.S. House OLRC](https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title44-section3557).
5. 40 U.S.C. §11331, mandatory federal information-system standards: [U.S. House OLRC](https://uscode.house.gov/view.xhtml?req=%28title%3A40+section%3A11331+edition%3Aprelim%29).
6. NIST, FIPS 200, *Minimum Security Requirements for Federal Information and Information Systems*: [NIST CSRC](https://csrc.nist.gov/pubs/fips/200/final).
7. CISA, Binding Operational Directive 23-01, *Improving Asset Visibility and Vulnerability Detection on Federal Networks*, including its stated scope and exclusions: [CISA](https://www.cisa.gov/news-events/directives/bod-23-01-improving-asset-visibility-and-vulnerability-detection-federal-networks).
8. CISA, *Cyber Incident Reporting for Critical Infrastructure Act of 2022 (CIRCIA)*, rulemaking status and effective-date explanation: [CISA](https://www.cisa.gov/topics/cyber-threats-and-advisories/information-sharing/cyber-incident-reporting-critical-infrastructure-act-2022-circia).
9. 6 U.S.C. §§681, 681b, CIRCIA definitions, statutory reporting deadlines, and rule-dependent effective date: [U.S. House OLRC, chapter 1/subchapter XVIII](https://uscode.house.gov/view.xhtml?edition=prelim&path=%2Fprelim%40title6%2Fchapter1%2Fsubchapter18).
10. CISA, CIRCIA Reporting Requirements NPRM, 89 Fed. Reg. 23644 (4 April 2024): [Federal Register](https://www.federalregister.gov/documents/2024/04/04/2024-06526/cyber-incident-reporting-for-critical-infrastructure-act-circia-reporting-requirements).
11. CISA, revised CIRCIA town-hall notice, 91 Fed. Reg. 30498 (26 May 2026): [Federal Register](https://www.federalregister.gov/documents/2026/05/26/2026-10417/town-hall-meetings-to-provide-input-on-cyber-incident-reporting-for-critical-infrastructure-act-circia).
12. DHS/CISA, Unified Agenda entry for RIN 1670-AA04, *CIRCIA Reporting Requirements*, final-rule stage and projected timetable: [Reginfo.gov](https://www.reginfo.gov/public/do/eAgendaViewRule?RIN=1670-AA04&operation=OPERATION_PRINT_RULE&pubId=202510). A projected timetable is not a promulgated regulation.
13. OMB Memorandum M-21-31, *Improving the Federal Government’s Investigative and Remediation Capabilities Related to Cybersecurity Incidents* (27 August 2021): [White House PDF](https://www.whitehouse.gov/wp-content/uploads/2021/08/M-21-31-Improving-the-Federal-Governments-Investigative-and-Remediation-Capabilities-Related-to-Cybersecurity-Incidents.pdf). It is federal agency guidance, excludes national-security systems under its stated scope, and is not evidence of any Starlink log or control implementation.

## Status

Initial research coverage remains 7/7. Formal acceptance remains 0/7 practical and 0/36 named. The 311 proposed scopes remain outside formal acceptance. Descriptive drafting maturity remains 29/50 (58%); congressional readiness remains unestablished. Bill v1.7 is unchanged.