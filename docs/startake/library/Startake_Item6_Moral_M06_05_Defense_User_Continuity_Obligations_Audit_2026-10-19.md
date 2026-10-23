# Practical Item 6 / Moral M06.05 — Defense User Continuity and Contract Change Controls Audit

**Prepared:** 19 October 2026 (UTC)  
**Assignment:** `STARTAKE-20261019-WORK-ITEM6-M06-05-DEFENSE-CONTINUITY-6679a7bb`  
**Status:** Bounded direct official-source review complete; formal acceptance unchecked.  
**Intended path:** `/Startake/Startake_Item6_Moral_M06_05_Defense_User_Continuity_Obligations_Audit_2026-10-19.md`

## 1. Scope and method

The authenticated M06.05 scope is **“Uptime commitments, incident escalation, change control, and coordinated intervention.”** It is a subcategory under the full-title named topic **“Defense Dependence, Starshield, and Stewardship of Security.”** This audit asks what public U.S. statutes, DoD policy, acquisition rules, and standard contract clauses establish for continuity of services supporting defense users, and how proposed Bill v1.14 addresses those duties across acquisition and transition.

The source record is member `starlink_moral_research_topics/06_defense_dependence_starshield_and_stewardship_of_security.md` in `Starlink_Moral_Foundation_Research_Topics_19.zip`; its authenticated member SHA-256 is `4d52d6a2afa0875cd7734ccf198db18f1357100b70007b584769e1508aa7318b`. The exact scope and source member were verified in the authenticated Crosswalk v1.26. The unique M06.05 reservation was independently verified in canonical tracker v373 before research.

This is direct review of official public sources retrieved on 19 October 2026. Legal Data Hunter verification was unavailable because the daily search quota had already been exhausted; it was not retried. No actual Starlink/SpaceX/Starshield contract, task order, SLA, incident record, classified mission requirement, provider practice, or operational record was examined. This review therefore makes no finding about any provider's present uptime, escalation path, change process, intervention rights, or defense-user treatment.

**Deliberate exclusions:** generic outage/reliability and alternative-path analysis under M04.08; general TSA service metrics, remedies, and funded exit under Item 7/legal scope 15.02; spectrum-sharing, interference rules, and user-class priority under M06.06; Starlink/Starshield product or architecture boundaries under M06.01; classified compartmentalization, privileged access, oversight, and Item 1. M06.06 is referenced only where DoD SATCOM policy requires contract-based EMI support; its priority/interference rules are not re-audited here.

## 2. Executive findings

1. **DoD policy imposes agency-side continuity and procurement duties, then relies on contracts for provider performance.** DoDI 8420.02 applies to DoD Components and directs designated DoD offices to ensure commercial SATCOM contracts support integration with Enterprise SATCOM Management and Control (ESC-MC) and include provider assistance for DoD electromagnetic-interference detection, characterization, geolocation, and mitigation. It does not itself set a universal numeric uptime target or a standard provider outage/escalation schedule. The provider-facing obligations depend on the actual procurement and contract. [S1]

2. **DoD continuity policy is not a private-provider SLA.** DoDI 3020.26 directs DoD Component heads to maintain and exercise continuity plans, identify and prioritize essential ICT services, and document maintenance, disaster-recovery, and restoration procedures. Those are DoD organizational duties. A commercial provider's corresponding operational duties must be found in an applicable contract or other binding instrument. [S2]

3. **Federal service acquisition standards support measurable, monitored contract performance, but do not set defense-SATCOM uptime or incident terms.** For performance-based service contracts, FAR 37.601 calls for measurable performance standards and assessment methods; FAR 37.602 ties performance to stated results and mission scope. DFARS 237.172 directs preparation of service-contract surveillance plans tailored to the contract's performance risks. These rules govern acquisition design and contract administration; they do not supply a one-size-fits-all availability percentage, response time, or network-intervention right. [S3–S4]

4. **Contract modification controls and provider network change controls are different.** FAR 43.102 reserves authority to execute Government contract modifications to contracting officers acting within their authority. FAR 52.243-7, when included, concerns prompt notice of Government conduct that the contractor regards as a contract change and a written Contracting Officer response. Neither provision, by itself, controls a provider's ordinary software releases, maintenance, routing, or other operational network changes; those controls need to be written into the relevant service agreement. [S5]

5. **The DFARS cyber-incident clause is narrow.** DFARS 252.204-7012 defines a 72-hour report for a cyber incident affecting a covered contractor information system or covered defense information, or affecting performance of contract requirements designated as operationally critical support and identified in the contract. It is not a general outage-notification, restoration, or uptime clause. DFARS 204.7304 prescribes inclusion of the clause in covered solicitations and contracts, subject to its COTS exception; the clause's triggers still matter. [S6]

6. **Bill v1.14 covers the transition window more fully than continuing defense service.** Sections 401(c)(1), 401(d), and 402 include service-specific TSA schedules, a mission-based critical-service register, escalation/restoration/cure provisions, and pre-cutover tests for emergency coordination, software-update authority, and rollback. These controls support transition and cutover. The text does not expressly require equivalent defense-service schedules and change/escalation procedures for ongoing Defense Department service after a TSA expires. This is a bounded drafting issue for a later authorized bill review, not a finding of current provider noncompliance.

## 3. What current public rules establish

### 3.1 Continuity planning and service performance

DoDI 8420.02 applies to DoD Components. Its commercial-SATCOM responsibilities require DoD acquisition officials to procure against approved requirements and funding, improve enterprise resilience and scalability, and ensure contract provisions for ESC-MC integration and specified provider assistance with EMI. These are concrete DoD procurement and contract-design directions. They do not identify any particular provider, customer, mission, or current service level. [S1]

DoDI 3020.26 requires DoD Components to account for continuity dependencies and prioritize ICT necessary for essential functions. Its program standards include identifying maintenance, disaster-recovery, and restoration procedures for essential ICT and exercising continuity plans, including degraded critical ICT capabilities. The instruction assigns these duties to DoD components and heads; it does not turn a commercial network into a DoD system or create a provider guarantee without contract terms. [S2]

FAR service-acquisition rules provide the general contracting structure. Performance-based service contracts include measurable standards and assessment methods; agency requirements should define results, scope or mission, performance objectives, and operating constraints to the maximum extent practicable. DoD's service-surveillance rule calls for a plan tailored to contract performance risks. Together these standards support a defense-specific schedule with measurable service and mission outcomes, but none specifies a universal SATCOM availability percentage, planned-maintenance window, or outage remedy. [S3–S4]

### 3.2 Incident notification and escalation

The DFARS cyber clause's 72-hour reporting clock is tied to its defined cyber-incident triggers. It is neither a general notification deadline for loss of communications service nor a recovery-time commitment. A service outage that is not a qualifying cyber incident cannot be presumed to trigger that clause. Conversely, a cyber incident that meets the clause's definition may trigger its duties even if a separate service schedule describes availability differently. [S6]

DoDI 8420.02's specified provider-assistance provisions cover DoD SATCOM integration and EMI support; they are not a general incident-severity or outage-escalation ladder. The actual service contract must identify covered services, defense mission/customer scope, incident categories, notice recipients, response and restoration targets, cure and remedy provisions, and evidence needed for Government assessment. That is a diligence requirement, not an assumption about any existing Starlink contract.

### 3.3 Change control and authorized coordination

FAR 43.102 distinguishes Government contracting authority from ordinary agency communications: only a contracting officer acting within delegated authority may execute a Government contract modification. FAR 52.243-7, if inserted into a contract, establishes a notice and response process for conduct the contractor views as a Government-directed change; a specifically authorized representative must be designated in writing for authority under that clause. These provisions are contract-change controls, not a government right to alter a provider's network or a general provider duty to obtain approval before a software or service change. [S5]

For defense continuity, the service agreement should state what the provider must notify, when notice is due, which changes need coordination or approval, how urgent maintenance and security changes are handled, who may direct service actions, and how rollback or recovery is coordinated. Any Government intervention must rest on actual statutory authority and contract terms. This audit identifies no general authority for unilateral intervention in a commercial provider's operations.

### 3.4 Coordinated DoD SATCOM support and contrary considerations

DoDI 8420.02 specifically contemplates contract provisions that connect commercial SATCOM services to DoD ESC-MC and require provider assistance with specified EMI tasks. These clauses show that DoD continuity and integration can be made operational through procurement. They do not prescribe all uptime, incident, software-change, or emergency-coordination details needed by each mission. [S1]

GAO's March 2025 review described DoD's increasing coordination with commercial SATCOM providers and the planned hybrid SATCOM approach. It also reported that access permissions and data-sharing across DoD organizations were a challenge, and that implementing hybrid architectures remained ahead. GAO is oversight evidence, not a provider contract or legal mandate; its findings support requiring the responsible DoD offices to identify data permissions, technical dependencies, and coordination roles rather than assume seamless integration. Any status described by GAO is limited to its 2025 review period. [S7]

## 4. Proposed Bill v1.14 mapping

| Bill provision | Existing treatment | M06.05 assessment |
|---|---|---|
| §3 | Defines the covered commercial communications business and excludes dedicated Starshield/classified programs and third-party interests absent lawful acquisition. | Preserves a bounded commercial perimeter; does not itself establish a defense service schedule. |
| §107 | Preserves spectrum and other regulatory permissions and requires permissions before affected operations transfer. | Correctly prevents the Act itself from creating authorization or operational control. Service continuity terms remain a separate contract issue. |
| §401(a)–(b) | Requires the transition plan to identify customer, defense, and emergency obligations and dependencies; excludes dedicated classified and Starshield systems. | Useful obligation inventory and perimeter safeguard. It is a plan requirement, not by itself a provider-facing measured SLA. |
| §401(c)(1)–(2) | Requires each covered TSA service schedule to state service/customer or mission scope, measures and data, outage treatment, escalation, restoration/cure and remedies; also requires exit terms and funding disclosures. | Strong, measurable protection for services covered by the TSA. Its express trigger is the transition-services agreement. |
| §401(d) | Requires a mission-based register for services whose interruption could threaten life, emergency response, or essential public functions. | Supports mission-specific continuity planning without classifying every government customer as critical by status alone. |
| §402(a)–(e) | Requires pre-transfer tests including emergency coordination, software-update authority, safe rollback, mission tolerances, and independent alternative paths for critical services. | Strong acquisition/cutover safeguards; it does not expressly create an ongoing DoD contract schedule after the TSA period. |

### Bounded drafting issue for later review

Because §401(c) is framed as a TSA and §402 addresses pre-transfer tests, the bill does not expressly say what contract schedule governs a defense service the Corporation continues to provide after transition support ends. Section 401(a)'s obligation inventory and section 401(d)'s register help identify the issue, but do not supply continuing provider-facing service terms. The public sources reviewed support defining those terms contract-by-contract; they do not support inventing a uniform numerical target or intervention power.

A later, separately authorized drafting pass could consider requiring the applicable continuing DoD service agreement to identify the supported mission and service boundary; measure availability and degraded service against approved requirements; state planned-maintenance and material-change notice; set incident severity, notice, escalation, response, restoration, and remedies; name authorized Government and provider coordination contacts; and incorporate any applicable DoDI 8420.02 contract provisions. The provision should preserve contracting-officer authority, applicable regulatory permissions under §107, classified-program exclusions, and the limits of any emergency authority. This is a drafting option for review, not proposed enacted law.

**No Bill or financial-workbook edit is made.** The reservation authorized a source-supported drafting issue for later review but expressly did not authorize a Bill/workbook edit. No numeric uptime target, provider-specific finding, emergency intervention power, or default defense priority is recommended from this evidence alone.

## 5. Authenticated scope result and remaining evidence

| Exact M06.05 requirement | Public-source result | Transaction-specific evidence still needed |
|---|---|---|
| Uptime commitments | Procurement rules favor measurable service standards where performance-based acquisition is used; DoD continuity policy requires agency planning. No public source reviewed supplies the applicable provider's uptime target. | Executed DoD contract/task order, service schedule, measurement points and periods, planned-maintenance treatment, degradation thresholds, remedies, and mission-owner tolerances. |
| Incident escalation | DFARS 252.204-7012 provides a conditional 72-hour cyber reporting rule; it is not a generic outage-escalation schedule. | Incident taxonomy, reporting deadlines and contacts, after-hours escalation, response/restoration/cure targets, contract triggers, and reporting/access rights. |
| Change control | FAR rules govern Government contract modifications and a specific notice clause when included; they do not govern provider internal operational changes. | Provider notice/coordination/approval rules for material software, configuration, routing, maintenance, and security changes; emergency exceptions; rollback and documentation. |
| Coordinated intervention | DoDI 8420.02 directs defined contract provisions for ESC-MC integration and provider EMI support. DoD continuity and acquisition controls assign roles to agency officials; no general unilateral intervention authority was found. | Applicable contract terms, named mission owner/CO/technical representative, permitted directions, provider support obligations, coordination protocol, authority limits, and any approved emergency process. |

No public-source evidence in this audit establishes that a particular Starlink service is used for a defense mission or that a particular clause applies to it. Before formal acceptance or closing, obtain and review the actual covered contracts and task orders, mission requirements and classification boundary, current service schedules, applicable DoD integration/EMI terms, performance and incident records, authorized change-control contacts, and any mission-specific priority or intervention terms. Confirm whether any requirement is an agency duty, a contract term, a clause-triggered cyber duty, or a proposed statutory safeguard.

## 6. Limitations and formal status

- Direct official-source review only; no Legal Data Hunter verification, counsel review, acquisition-specialist review, classified review, engineering review, or provider/customer contact.
- DoDI 8420.02 and DoDI 3020.26 were reviewed as public DoD policy, not as a substitute for contract terms or customer mission requirements.
- FAR/DFARS provisions were reviewed at the general level; clause incorporation, scope, exclusions, contract type, and facts must be confirmed in each instrument.
- GAO-25-107034 reflects its March 2025 evidence period and is not used to state current provider or program status.
- M06.05 research status is complete for this bounded public-source pass. M06.05 formal acceptance remains unchecked. Its parent named topic and Practical Item 6 remain unchecked; no original criterion or acceptance box is changed. All 311 proposed subcategories remain outside formal acceptance.

## 7. Source index

**S1.** U.S. Department of Defense, DoD Instruction 8420.02, *DoD Satellite Communications* (Aug. 3, 2023), §§1.1–1.2 and assigned responsibilities for commercial SATCOM. Official PDF: <https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/842002p.pdf>. DoD Issuances listing: <https://www.esd.whs.mil/Directives/issuances/dodi/dodm/>.

**S2.** U.S. Department of Defense, DoD Instruction 3020.26, *DoD Continuity Policy* (June 4, 2024), continuity program standards and DoD Component planning/exercise duties. Official PDF: <https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/302026p.PDF>. DoD Issuances listing: <https://www.esd.whs.mil/Directives/issuances/dodi/Homeland/>.

**S3.** Federal Acquisition Regulation, 48 C.F.R. §§37.601–37.602, performance-based service contracts, performance standards, and performance work statements: <https://www.acquisition.gov/far/37.601> and <https://www.acquisition.gov/far/37.602>.

**S4.** Defense Federal Acquisition Regulation Supplement, 48 C.F.R. §237.172, service-contract surveillance: <https://www.acquisition.gov/dfars/237.172-service-contracts-surveillance>. See also FAR 48 C.F.R. §46.401: <https://www.acquisition.gov/far/46.401>.

**S5.** FAR 48 C.F.R. §43.102, contract modification authority: <https://www.acquisition.gov/far/43.102>; FAR 48 C.F.R. §52.243-7, *Notification of Changes*: <https://www.acquisition.gov/far/52.243-7>.

**S6.** DFARS 48 C.F.R. §204.7304, clause-prescription rule: <https://www.acquisition.gov/dfars/part-204-administrative-and-information-matters>; DFARS 48 C.F.R. §252.204-7012, *Safeguarding Covered Defense Information and Cyber Incident Reporting*: <https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting>.

**S7.** U.S. Government Accountability Office, GAO-25-107034, *DOD Satellite Communications: Reporting on Progress Needed to Provide Insight on New Approach* (Mar. 4, 2025): <https://files.gao.gov/reports/GAO-25-107034/index.html>.

## 8. Transaction receipt and consistency checks

- **Transaction / owner:** M06.05 assignment `STARTAKE-20261019-WORK-ITEM6-M06-05-DEFENSE-CONTINUITY-6679a7bb`; STARTAKE Codex Work / current conversation; 19 October 2026 UTC.
- **Claim verified:** canonical tracker stable Library ID `libfile_590fd34e579c819189c02261fe34c456`, actual v373; reservation recorded the exact authenticated M06.05 scope and exclusions. The M06.05 claim is to remain held until this report and Crosswalk v1.27 are saved and independently read back, then released only in a guarded tracker closeout.
- **Pinned baselines:** Bill v1.14, Library ID `libfile_0fb03f28404c8191a6c549b3c0abb8f0`, 150,978 bytes, SHA-256 `848e3dc59d671a56241f379ba9b9dcd427c679ca4051467674a5517edea6977e`; Crosswalk v1.26 MD/CSV IDs `libfile_8a6445c4f5ec8191b5fdbe56a6db2454` / `libfile_514c9d00ecec8191a61aecb79fb92e65`, 92,039 / 447,532 bytes; dashboard v99 ID `libfile_cc7518a16af48191815df91c0bc809da`, 267,214 bytes, SHA-256 `56ece4424d010f8d452f09dc168185c529c27f45877bf694ce86061028404a8a`; tracker v373 exact reservation is the live coordinator.
- **Intended changes:** save this report; update only the five M06.05 evidence/reference fields authorized in Crosswalk CSV; add a Crosswalk Markdown audit header while preserving v1.26 as an exact byte suffix; release only the M06.05 claim after verified report and Crosswalk saves; add the corresponding dashboard receipt; then record that dashboard receipt in a final guarded tracker update.
- **Protected cells and status:** preserve all 311 unique source labels, all original title/scope text, custody and formal-acceptance fields, parent formal status, all rows other than M06.05, and every unrelated tracker/dashboard claim. Do not change Bill v1.14, workbook v0.4, Item 1, parent M06 acceptance, Practical Item 6 acceptance, or overall acceptance totals.
- **Dependency dispositions:** §§3, 107, 401 and 402 reviewed and unchanged; §§401(c) and 402 support transition/cutover continuity, with a bounded post-TSA drafting gap identified; no amendment inserted because the reservation did not authorize one. Workbook and valuation dependencies reviewed as out of scope and unchanged.
- **Checks and expected results:** source-to-claim tracing, correct distinction among agency duties, contract terms, clause triggers and proposed law; exact scope/status preservation; CSV original-label uniqueness and protected-cell preservation; Markdown prior-version suffix; exact Library byte readbacks; conditional tracker/dashboard version checks and suffix preservation. Research supports the bounded conclusions above but cannot establish actual contract applicability or provider conduct.