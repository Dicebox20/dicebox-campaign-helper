# STARTAKE — Item 1 UK Companies House charges-register evidence audit

**Evidence cutoff:** 2026-10-15 UTC. **Method:** one bounded direct official public-source research pass, not an OpenAI Deep Research execution. **Claim:** `STARTAKE-20261015-item1-ukcharges-6a3d92`, verified in canonical tracker v76. **Practical item:** 1. Ownership and acquisition perimeter. **Named overlap:** Acquisition perimeter and beneficial ownership. **Boundary:** commercial Starlink communications assets only, excluding unrelated SpaceX businesses and presumptively excluding Starshield.

## Main findings

1. The official Companies House filing-history page for **STARLINK INTERNET SERVICES UK LIMITED**, company **12794964**, displayed the accessible list of filings from its 2020 incorporation through September 2026. It includes PSC04, accounts, confirmation statements, officer and address filings. **No charge-type/MR01/MR04/MR05 entry appears in the displayed filing-history rows.** This is a narrowly described *negative observation of a particular rendered index*, not a certificate of no outstanding charges. [R1]
2. The separate company-specific `/company/12794964/charges` endpoint was requested but returned an inaccessible/internal-error response. Consequently, the authoritative charge status counters (registered, outstanding and satisfied), any exact instrument identifiers, secured parties, dates and satisfaction statuses **were not obtained**. [R2]
3. Companies House provides an official charges API at `/company/{company_number}/charges`, but its documentation says it **requires an API key**. Without an authenticated company-specific API result, we cannot conclude an empty register from a page omission or inaccessible endpoint. [R3]
4. Under official Companies House guidance, a UK company's charge is a security interest supporting borrowing; ordinarily a qualifying charge must be registered within **21 days** after its creation, and an instrument (where applicable) is placed on public record in certified-copy form. Registration and satisfaction records establish identified obligations/security filing events, not legal title to all of Starlink's satellites, gateways, spectrum authorizations, software or contracts. [R4, R5]
5. The registered UK company exists and reports satellite-telecommunications activity, but company existence, PSC control and a limited charges search cannot be substituted for entity-by-entity and asset-by-asset title diligence or verification of the commercial Starlink–Starshield carve-out. [R6]

## Primary-source evidence index

| ID | Official record and URL | Observation / limitation |
|---|---|---|
| R1 | Companies House filing history: https://find-and-update.company-information.service.gov.uk/company/12794964/filing-history | Visible filing list has no charge-type entries. Not equivalent to a charge certificate or authenticated charges API response. Accessed 2026-10-15 UTC. |
| R2 | Company-specific charges path: https://find-and-update.company-information.service.gov.uk/company/12794964/charges | Page inaccessible in available source interface; no counters, charge list or no-charge assertion obtained. |
| R3 | Companies House public data API spec: https://developer-specs.company-information.service.gov.uk/companies-house-public-data-api/reference/charges/list | GET company charges requires API-key authorization; no authenticated response available in this pass. |
| R4 | Companies House charge registration guidance: https://www.gov.uk/guidance/register-a-charge-mortgage-for-a-limited-company | Explains MR01, 21-day filing, public charge instrument, MR04 satisfaction and MR05 release. Guidance is general, not specific to company 12794964. |
| R5 | Updated MR01 instructions (2026-03-05): https://www.gov.uk/government/publications/register-particulars-of-a-charge-mr01/how-to-complete-paper-form-mr01 | Original government procedural instructions on registration of charges; cannot prove any particular company's charge history. |
| R6 | Companies House company overview: https://find-and-update.company-information.service.gov.uk/company/12794964 | UK company identifier/status and SIC descriptions; no specific asset security or title proof. |
| R7 | Companies House searching-register guidance: https://www.gov.uk/guidance/searching-the-companies-house-register | The public record can contain mortgage-charge information and filing documents; independent authenticated lookup still required. |

## Contradictions and inference controls

There is **no affirmative evidence in the retrieved company-specific source** of a registered charge, but that is not proof of an **absence of charges**. A missing charge-type row in the rendered filing-history list may reflect an empty public company charge register, but the independent charges page/API check was not completed. The previous UK PSC04 research established control-reporting leads and conflicting voting-right bands, which are separate from company security filings. No claims about UK operating-asset ownership, SpaceX consolidated debt collateral or Starshield encumbrances may be inferred from this record.

## Acceptance / outstanding-gap matrix

| Gate | State | Needed evidence |
|---|---|---|
| Identify UK company and rendered filing history | **Partially evidenced** | Official source page dated and independently reproducible |
| Obtain certified native company charges result | **Open** | Accessible authoritative charges page or authenticated API extract with retrieval timestamp, counts and charge identities; certified output if legal reliance required |
| Verify relevant original charge instruments or register absence | **Open** | Source-native instrument deeds or certified negative search, plus changes/satisfaction/release documents |
| Assess other UK and foreign Starlink legal entities | **Open** | Complete corporate-entity and security-register search for relevant obligors |
| Establish security/title of commercial Starlink-only assets | **Open** | Satellite, site, software, contractual title and financing schedules with legal entity mapping |
| Restore original approved nine topic headings | **Open** | Authenticated original legal topic source; do not substitute this report's headings |
| Formal Item 1 and named-topic verification | **No / No** | Independent full-gate audit, not merely a completed research pass |

## Handoff / disposition

**Research pass complete — verification pending.** Distinct gain: the public *filing-history* negative observation is now separately documented, while the actual company **charges register is explicitly not verified**. Preserve earlier PSC04, UK control, FCC, spectrum, UCC/USPTO, financing and legal original-taxonomy research. Report one completed scoped direct-source pass, not formal checklist acceptance. Release only `STARTAKE-20261015-item1-ukcharges-6a3d92` after saved report verification and conditional tracker integration. Tallies remain **7/7 original research passes, 0/7 formal practical verification, 0/36 formal named-topic verification**.