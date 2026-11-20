# Item 4 — DARPA CFDA 12.910 Assistance Award Identity and Attribution Audit

**Assignment:** `STARTAKE-20261015-WORK-ITEM4-NASA-12910-6e81bd`  
**Owner:** Sole STARTAKE inheritor / Codex Work  
**Workflow:** Activated STARTAKE Workflow v2.2  
**Research date:** 15 October 2026 UTC  
**Status:** Bounded direct-primary-source research complete; formal Item 4 and named-topic acceptance remain pending. The owned claim is released after the conditional closeout and independent readback recorded in the tracker.

## Question and scope

The existing recipient-level USAspending report described one record under CFDA 12.910 as “NASA research assistance.” This audit identifies that exact award, compares the current USAspending summary, detail, and action records, checks the applicable program listing, and searches for an original agency project record that could connect the funding to commercial Starlink.

The scope is one assistance award associated with exact recipient UEI `C6M7C2FLKER5`; it does not expand the prior 347-row recipient search or attribute an amount to Starlink.

## Findings

### The award is DoD/DARPA, not NASA

The current USAspending award search returned one exact-recipient row for FAIN `HR00112430314`, generated award key `ASST_NON_HR00112430314_097`. The row identifies Space Exploration Technologies Corp. (UEI `C6M7C2FLKER5`), the Department of Defense as awarding and funding agency, and the Defense Advanced Research Projects Agency (DARPA) as awarding and funding subagency. The assistance listing is `12.910`, “Research and Technology Development.” The prior “NASA CFDA 12.910” label was a classification error.

OMB’s Federal Program Inventory independently identifies program 12.910 as a Department of Defense program administered by DARPA. Its stated objective covers basic, applied, and advanced research at educational institutions, nonprofits, and commercial firms, including work with military or dual-use applications. It allows grants, cooperative agreements, or technology investment agreements. This is broad program-level purpose, not the scope of SpaceX’s individual award.

### Current award and transaction fields

| Field | Current official record |
|---|---|
| FAIN / award ID | `HR00112430314` |
| Generated USAspending award key | `ASST_NON_HR00112430314_097` |
| Recipient | SPACE EXPLORATION TECHNOLOGIES CORP.; UEI `C6M7C2FLKER5` |
| Awarding and funding agency | Department of Defense; subagency DARPA |
| Assistance listing | `12.910` — Research and Technology Development |
| USAspending award type | Other reimbursable, contingent, intangible, or indirect financial assistance (type `11`) |
| Period of performance | 21 November 2023–21 June 2024 |
| Award-summary Award Amount | $971,324.64 |
| Award-summary Total Outlays | $0.00 |
| Detail total obligation / account obligation | $971,324.64 / $971,324.64 |
| Detail total account outlay | $0.00 |
| Detail `total_outlay` field | `null` |
| Subaward count in detail | 0 |
| Reported transaction count | 2 |

The two action rows are an A1 “New Award” dated 21 November 2023 for $171,834.00 and a B1 “Continuation” dated 22 December 2023 for $799,490.64. Their federal-action-obligation values sum to $971,324.64. The continuation description says incremental funding fully funded CLIN 0001 and that Attachment 3, a schedule of milestones and payments, was updated. The award detail and search result contain no project title; the `funding_opportunity.number` and `funding_opportunity.goals` fields are null.

The award-summary zero, account-outlay zero, and detail `total_outlay: null` are distinct API fields. They show no positive outlay in these returned records; they do not establish that no payment occurred, and they do not prove that SpaceX received cash. The award amount and action obligations are not receipts.

### Agency purpose and possible project relationship

The award-level description says the agreement’s principal purpose is a coordinated government-performer effort to advance research and technology goals, not primarily to acquire property or services for the direct benefit or use of the Government. That description supports classifying this as a research-assistance lead rather than a procurement purchase of Starlink service. It does not identify the technical subject, the funded assets, the beneficiary, an approved service, or a Starlink business unit.

DARPA’s public Space-BACN announcement states that SpaceX was selected in the program’s third technical area, which addressed cross-constellation command and control and interfaces between Space-BACN and commercial partner constellations. DARPA’s program page describes optical intersatellite-link interoperability. Those public records make Space-BACN a plausible thematic lead for a 2023–2024 DARPA research award to SpaceX. They do not name FAIN `HR00112430314`, and the award API does not identify Space-BACN. The link between this award and that program is therefore an inference and remains unverified. Neither source specifically identifies commercial Starlink as the project beneficiary or funded business.

No award-specific original DARPA agreement, statement of work, or technical milestone schedule was located in the public sources reviewed. The reference to an updated milestone/payment schedule in transaction P00001 does not supply that schedule. The official award record does not expose a specific SpaceX task or a Starlink cost allocation.

## Attribution conclusion

- **Verified:** Exact recipient, FAIN, generated award key, DoD/DARPA agency, CFDA 12.910, assistance classification, performance dates, award-summary fields, two action rows, and the reported obligation arithmetic.
- **Corrected:** This is not a NASA award. CFDA 12.910 is administered by DARPA within the Department of Defense.
- **Plausible but unverified:** A connection to DARPA’s Space-BACN intersatellite communications work, based on the separate DARPA announcement naming SpaceX and the award’s agency and timing. There is no source-level join from this FAIN to Space-BACN.
- **Unresolved:** Whether the award supports any commercial Starlink asset, service, business unit, or project cost; its intended beneficiary; actual invoice/payment status; and cash received by SpaceX.
- **Attribution:** Keep the $971,324.64 award value as an unallocated DoD/DARPA recipient-level research-assistance lead. Do not report it as a Starlink public-support total, subsidy, Starlink revenue, payment, or receipt. No aggregate across it and other procurement or assistance records is warranted.

## Legislative contribution

Proposed Bill §302(d)(2)–(6) already separates assistance from procurement, bars entity-only attribution, requires program/project and payment-path reconciliation where records exist, distinguishes obligations, outlays, and receipts, and keeps an unlinked award as an unresolved lead with no attributed amount. This record tests and fits those controls; no operative amendment is warranted.

Bill v1.2 corrects the explanatory crosswalk’s prior “NASA” label to “DoD/DARPA CFDA 12.910,” adds FAIN `HR00112430314`, and states the unresolved project and Starlink nexus. All 31 operative sections are unchanged from Bill v1.1. No bill amount, appropriation, score, formal acceptance, or maturity increase is claimed.

## Original criteria and project status

This is one bounded Item 4 research pass, not formal verification of the practical gate or the full named topic. Initial research coverage remains 7/7. Original formal acceptance remains 0/7 practical items and 0/36 named topics. The 311 source-recovered scope texts remain proposed scopes, with no invented acceptance denominator. Drafting maturity remains 29/50 descriptive document maturity; overall congressional readiness remains unestablished. Independent legal, fiscal, appraisal, engineering, and other professional review is not represented as complete.

## Sources and reproducibility

1. **USAspending v2 award summary, award detail, transaction history, transaction count, and last-updated API responses**, retrieved 15 October 2026 18:11:16 UTC. The exact requests and unabridged relevant responses are preserved in [the JSON response appendix](Startake_Item4_DARPA_12_910_USASpending_API_Responses_2026-10-15.json). Official award page: [USAspending award record](https://www.usaspending.gov/award/ASST_NON_HR00112430314_097). API endpoints: [award search](https://api.usaspending.gov/api/v2/search/spending_by_award/), [award detail](https://api.usaspending.gov/api/v2/awards/ASST_NON_HR00112430314_097/), [transaction history](https://api.usaspending.gov/api/v2/transactions/), and [award search API contract](https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/search/spending_by_award.md).
2. **OMB Federal Program Inventory, Program 12.910 — Research and Technology Development**, accessed 15 October 2026: <https://fpi.omb.gov/program/12.910.html>. Identifies Department of Defense/DARPA and the program-level research objective.
3. **DARPA, “DARPA Kicks Off Program to Develop Low-Earth Orbit Satellite ‘Translator’,” 10 August 2022**: <https://www.darpa.mil/news/2022/low-earth-orbit-translator>. Names SpaceX in the third Space-BACN technical area; it does not cite this FAIN.
4. **DARPA, Space-BACN program page**, accessed 15 October 2026: <https://www.darpa.mil/research/programs/space-based-adaptive-communications-node>. Program-level description of optical intersatellite-link interoperability; not an award-level record.

Search results for the exact FAIN and generated award key did not locate an original DARPA agreement or a project record that links this award to Space-BACN. That search result is not proof that no such record exists. The award-specific technical scope and any commercial-Starlink allocation remain unresolved.

## Next useful work

Continue with a separate unclaimed Item 2–7 evidence gap. For this award, attribution can be revisited only if an authoritative award-specific scope, milestone schedule, or transaction-level payment record becomes available through public records; the existing record is sufficient to correct the agency and program label now.