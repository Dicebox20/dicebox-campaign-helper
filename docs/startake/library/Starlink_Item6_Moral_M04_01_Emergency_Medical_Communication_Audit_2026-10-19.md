# STARTAKE Item 6 / Moral M04.01 — Emergency Medical Communication Audit

**Date:** 2026-10-19  
**Claim:** STARTAKE-20261019-WORK-ITEM6-M04-01-EMERGENCY-MEDICAL-COMMUNICATION-4c85e2  
**Status:** Bounded direct official-source review complete; package synchronization and formal verification remain pending. Moral M04.01, its parent topic, and Practical Item 6 remain formally unchecked. Practical Item 1 remains outside this Work instance.

## Question and scope

The authenticated original scope is M04.01, “Emergency medical communication”: “Hospitals, ambulances, medical coordination, telehealth, and urgent health information.” This report maps selected current U.S. federal rules for healthcare-facility emergency planning, Medicare ambulance communications equipment, Medicare telehealth payment modalities, protected health information contingency planning, and the statutory public-safety broadband framework. It compares those rules with Bill v1.14 §§104, 205, 401, and 402.

The assignment does not determine whether any hospital, ambulance supplier, telehealth practice, or patient uses Starlink; establish a Starlink service classification or network condition; assess a specific clinical, emergency, or patient outcome; survey State/local ambulance or EMS rules; or decide whether every facility should receive a universal communications guarantee. It is a federal-law and legislative-design audit, not medical advice.

## Findings

### 1. Covered health facilities must plan for emergency communications and information continuity

Under 42 C.F.R. §482.15, hospitals subject to that condition of participation must maintain an all-hazards emergency-preparedness program. The required plan addresses the services available during an emergency and continuity of operations. The hospital must maintain an emergency communication plan, updated at least every two years, with specified contact information; primary and alternate communication means for staff and emergency-management agencies; methods to share patient information and medical documentation with other providers to maintain continuity of care; and means to communicate occupancy, needs, and assistance capability. The policies also address patient-record availability/confidentiality, evacuation and arrangements to receive patients when operations are limited or cease. The rule requires training and testing of the plan.

Critical access hospitals have a parallel condition under 42 C.F.R. §485.625. Rural health clinics and federally qualified health centers are covered by §491.12, which also requires an emergency-preparedness program, communication plan, and testing. These are duties on the specified provider or facility. The provisions reviewed do not require a commercial satellite, broadband, or other communications carrier to deliver a given uptime, priority, or recovery interval to those facilities. That last sentence is a bounded inference from the duties and regulated parties in these provisions, not a claim that no other statute or contract can apply.

### 2. Medicare ambulance rules require equipment, while deferring the governing standard to State/local law

42 C.F.R. §410.41(a)(3) requires a vehicle used as an ambulance by a covered Medicare ambulance supplier to have telecommunications equipment as required by State or local law, including at minimum one two-way voice radio or wireless telephone. This is a concrete equipment floor for the vehicle, but the federal text delegates the governing detail to State/local law and does not establish a network-availability, broadband, data, priority, or carrier-performance standard. State/local rules were not surveyed in this assignment.

### 3. Medicare telehealth and HIPAA protect different parts of the communication chain

42 C.F.R. §410.78 defines telehealth modalities and Medicare Part B payment conditions, including interactive two-way audio/video and specified circumstances for audio-only service. It governs covered Medicare telehealth services; the reviewed provision does not guarantee an underlying communications connection or impose an uptime duty on a network operator. This is an inference from the provision’s payment and modality scope.

The HIPAA Security Rule applies to covered entities and business associates within its scope. 45 C.F.R. §164.308(a)(7) requires contingency policies for emergencies affecting systems containing electronic protected health information (ePHI), including required data backup, disaster recovery, and emergency-mode operation procedures. Testing/revision and applications/data criticality analysis are addressable implementation specifications. HHS states that the Security Rule is not suspended during a public-health emergency. These safeguards address the regulated organization’s protection and availability of ePHI; they do not by themselves ensure a telecommunications provider’s service availability.

### 4. Federal public-safety broadband includes emergency medical response, but is not a universal health-service guarantee

47 U.S.C. §1422 directs the First Responder Network Authority to ensure establishment of a nationwide interoperable public-safety broadband network. Under 47 U.S.C. §1401(27), “public safety services” includes services provided by emergency response providers; 6 U.S.C. §101(6) includes emergency medical and hospital-emergency-facility personnel, agencies, and authorities within that defined group. The FirstNet Authority’s EMS materials describe paramedic and ambulance use cases such as patient data, mapping, and audio/video exchange with hospitals.

This is a relevant public-safety communications framework and a potential alternative to ordinary commercial connectivity for qualifying users. The statute and Authority material reviewed do not establish that every hospital, telehealth provider, ambulance, or patient is eligible, subscribed, covered at a location, or guaranteed a particular service level. No such provider, subscriber, coverage, or performance facts are asserted here. The FirstNet web material is an agency description of its intended network and use cases, not an independent service-performance audit.

### 5. Bill v1.14 supplies transaction and transition safeguards, not a general post-transition medical connectivity guarantee

- **Section 104(3)** makes funded and executable continuity arrangements for critical workforce, supplier, customer, and network-control obligations part of the closing certification. It is a closing gate, not an ongoing retail-service rule.
- **Section 205(d)** requires an access baseline that separately assesses health facilities and emergency services in rural, remote, and underserved areas, including effective availability, service quality, costs, affordability, geography, and data gaps. It calls for measurement and disclosure; it does not promise universal service or a minimum connection.
- **Section 401(a)** requires the staged transition plan to identify customer and emergency-service obligations. **Section 401(d)** requires a phase-specific register of contracted services whose interruption would foreseeably threaten life, emergency response, or essential public functions. It identifies mission needs, sites/mobile categories, dependencies, alternative paths, restoration objectives, and an accountable continuity officer. The text expressly makes classification risk-based rather than automatic because the customer is a hospital or another named institution.
- **Section 402(d)–(e)** requires site/service testing for registered critical services and a tested independently supplied alternative path, subject to a documented feasibility exception with a funded interim arrangement and mission tolerances.

These proposed safeguards can cover qualifying contracted medical communications during an operating-control transfer and require a measured health/emergency access baseline. They do not impose a standing, all-user medical-connectivity or telehealth-uptime standard after the transition gates have been satisfied.

## Assessment and decision

The current federal framework places emergency-planning and information-continuity duties chiefly on specified health facilities, ambulance suppliers, and HIPAA-regulated organizations. The ambulance rule requires equipment but leaves the standard to State/local law. Medicare telehealth rules govern payment modalities. FirstNet creates a public-safety-specific network framework that includes emergency medical response, but the reviewed materials do not establish universal access or location-specific service. None of these points establishes an actual Starlink use, classification, service level, or failure.

**Decision:** No Bill text change is recommended from this evidence pass. Bill v1.14 §§104, 205(d), 401(a)/(d), and 402(d)/(e) already provide a closing gate, an access baseline, and a risk-based transition register/test path for contracted medical services whose interruption meets the life/emergency threshold. Implementation should assess relevant hospital, ambulance, telehealth, and patient-information obligations when deciding whether a service qualifies and what tests its mission tolerances require; it should not treat every hospital subscription as automatically critical. If the Act is intended to guarantee ongoing emergency medical or telehealth connectivity after transition, that is a separate policy choice requiring defined eligible services/users, measurable targets, priority rules, funding, oversight, and exceptions. The present record has no actual service, coverage, cost, or engineering evidence to define those requirements.

**Contrary considerations:** Existing facility plans, alternate communications, record-continuity rules, and FirstNet may reduce dependence on any one commercial provider; provider-side duties may be effective even without a new network mandate. Conversely, facility obligations are not proof that an upstream network will meet the facility’s needs, and the available sources do not show what alternate paths any real facility has. This report resolves neither proposition for a specific operator or location.

**Reopening trigger:** Revisit the bill-design decision if the operating model requires an ongoing emergency-medical service duty, or if verified mission requirements show that the current risk-based register/test provisions cannot cover identified medical communications through transition. Any such proposal needs a defined service perimeter and a funded engineering standard.

## Authenticated criteria and status

| Requirement | Evidence and disposition | Formal status |
|---|---|---|
| M04.01 — hospitals, ambulances, medical coordination, telehealth, urgent health information | Bounded federal-source audit above; current provider/facility duties mapped; no actual Starlink or provider facts | Unchecked |
| Parent topic: Civilian Life, Emergency Response, and Humanitarian Dependence | M04.01 evidence only; no parent-topic completion claim | Unchecked |
| Practical Item 6 | Related evidence for the bill’s continuity/access provisions; this report does not apply the original practical-item acceptance test | Unchecked |

No acceptance criterion, 311-row count, or original wording is changed. Initial coverage remains 7/7; formal acceptance remains 0/7 practical and 0/36 named; all 311 proposed scopes remain outside formal acceptance; descriptive maturity remains 29/50; congressional readiness remains unestablished. Item 1 remains excluded.

## Method, source limits, and prior-work boundaries

Research date: 2026-10-19. The current eCFR pages displayed Title 42 as of 2026-10-15 (last amended 2026-10-13) and Title 45 as of 2026-10-15 (last amended 2026-10-06). House U.S. Code pages displayed the cited statutes with effective-text dates in September 2026. FirstNet Authority pages were reviewed on 2026-10-19. The review was direct official-source research. Legal Data Hunter citation resolution was unavailable under the current daily quota, so this report is not Legal Data Hunter verified. No counsel, emergency-medicine, EMS, engineering, or provider review is represented.

The following prior scopes were reviewed and not repeated: M04.07 access for vulnerable populations; M04.08 general reliability/redundancy and outage reporting; M04.09 scarcity allocation; M13.05 consultation mechanics; M13.06 ordinary service-harm complaints/remedies; and Item 7/legal scope 15.02 contract-level metrics, outage treatment, remedies, and funded exit planning. The M04.07–M04.09 reports expressly excluded M04.01. This audit is limited to the United States and does not revisit Practical Item 1’s commercial ownership, authorization, or service evidence.

## Source index

**Current federal regulations**
- [42 C.F.R. §482.15 — Hospital emergency preparedness](https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-B/section-482.15), current eCFR text reviewed 2026-10-19; page displayed as of 2026-10-15.
- [42 C.F.R. §485.625 — Critical access hospital emergency preparedness](https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-485/subpart-F/section-485.625), same eCFR currency date.
- [42 C.F.R. §491.12 — RHC/FQHC emergency preparedness](https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-491/subpart-A/section-491.12), same eCFR currency date.
- [42 C.F.R. §410.41 — Ambulance provider/supplier requirements](https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-410/subpart-B/section-410.41), same eCFR currency date.
- [42 C.F.R. §410.78 — Medicare telehealth services](https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-410/subpart-B/section-410.78), same eCFR currency date.
- [45 C.F.R. §164.308 — HIPAA administrative safeguards](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.308), current eCFR text reviewed 2026-10-19; page displayed as of 2026-10-15.
- [HHS OCR FAQ — HIPAA Security Rule during public-health emergencies](https://www.hhs.gov/hipaa/for-professionals/faq/is-the-security-rule-under-hipaa-suspended-during-a-public-health-emergency/index.html), reviewed 2026-10-19.

**Public-safety broadband statutes and program material**
- [47 U.S.C. §1401 — Definitions](https://uscode.house.gov/view.xhtml?req=%28title%3A47+section%3A1401+edition%3Aprelim%29), House Office of Law Revision Counsel, retrieved 2026-10-19.
- [47 U.S.C. §1422 — Public-safety broadband network](https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title47-section1422), House Office of Law Revision Counsel; page states text in effect 2026-09-17.
- [6 U.S.C. §101 — Definitions](https://uscode.house.gov/view.xhtml?req=%28title%3A6+section%3A101+edition%3Aprelim%29), House Office of Law Revision Counsel; page states text in effect 2026-09-27.
- [FirstNet EMS](https://www.firstnet.gov/public-safety/firstnet-for/ems) and [FirstNet network overview](https://firstnet.gov/network), First Responder Network Authority, retrieved 2026-10-19; program descriptions, not independent coverage or performance evidence.

**Proposed Act and authenticated requirement**
- The Starlink and Stripes Act Integrated Working Bill v1.14, Library ID libfile_0fb03f28404c8191a6c549b3c0abb8f0, version 0, 150,978 bytes, SHA-256 848e3dc59d671a56241f379ba9b9dcd427c679ca4051467674a5517edea6977e.
- Moral requirements archive Starlink_Moral_Foundation_Research_Topics_19.zip, Library ID libfile_d51e095c82b88191807ddb3d6f4bdcfd, version 0, 35,389 bytes, SHA-256 26ab27f27c0099f19ee0ac32d02e3245ba32555196d001fd4b60756fac66c8e0. Topic member starlink_moral_research_topics/04_civilian_life_emergency_response_and_humanitarian_dependence.md, 3,061 bytes, SHA-256 c86af941a2c78f1ae163f7b3c502bf9d250c514a59cb687c0b5cb15a32de10fd.
- Authentication report for the 36 topics and 311 subcategories, Library ID libfile_9027017d96d88191b360fbc3bff197d8, version 0, 94,285 bytes, SHA-256 3eccc9000e2c5a6a5ecff3a9212540c9907be88a2c3f05eaad7f1f022ff64e3f.

## Transaction receipt

Transaction: M04.01 emergency-medical communications audit / owner STARTAKE Codex Work / 2026-10-19 UTC. Claim STARTAKE-20261019-WORK-ITEM6-M04-01-EMERGENCY-MEDICAL-COMMUNICATION-4c85e2 was conditionally reserved from actual canonical tracker v348 to v349 and independently reread before research. Reservation readback: 582,670 bytes, SHA-256 1fc39e324fdebe24b767aadd31c7bf8412ce18751f6d65a2de2c61565ea9a3f6.

Pinned baselines before reservation: Research Workflow v2.2 libfile_c61da08367148191ad4e5d76ce7aeff0 v0 / 7,613 bytes / SHA-256 b08372363ec1cb7ff8364a72cecfc2484071c2f86042446c3535be120b445d31; Consistency Workflow v1.0 libfile_24fa6dd38c4481919375a3026ed06a62 v0 / 12,206 bytes / SHA-256 6c31bf961e4d7b31ea20b014ae030290e4996319b3022b759347bff3b04e8bcf; tracker v348 / 576,187 bytes / SHA-256 48e4d0c52767a99f33abc59213da7507c1482c3b9757fb8047497468b937b7ab; dashboard v91 / 242,570 bytes / SHA-256 c38afc4b0f19ced223667a01ae12b7b670e686186430910d5c1f1b72a6762025; Crosswalk v1.18 Markdown v4 / 72,633 bytes / SHA-256 f75132b66ffdd1e38e8181ff6155f0269c9177f8bb32067f5a292ae4b6bc3d49; Crosswalk v1.18 CSV v3 / 435,768 bytes / SHA-256 6b7bbd0d839d41803feb4c3476ecc681eaf992df3d8cdeb13d34649af9613252; Bill v1.14 and source archive/report details above.

Protected outputs: Bill v1.14, workbook v0.4, all crosswalk rows except M04.01's five authorized evidence/reference fields, the other 310 source labels, original source/custody fields, formal acceptance fields, and every unrelated claim. Planned dependency disposition: add one M04.01 overlay to Markdown v1.19; update exactly five permitted fields on CSV row M04.01 for paired v1.19; update dashboard after report/crosswalk readbacks; then release the claim and record the dashboard receipt in the final tracker. Current open gaps: no provider-specific classification/use/coverage or service-performance records; no state/local ambulance-law survey; no actual emergency medical mission tolerances or engineering tests; no professional review. No formal acceptance, drafting maturity, or readiness change is proposed.