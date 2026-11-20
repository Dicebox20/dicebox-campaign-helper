# Practical Item 6 / Moral M06.01 — Commercial Starlink and Starshield Boundary Audit

**Review date:** 19 October 2026  
**Assignment claim:** STARTAKE-20261019-WORK-ITEM6-M06-01-STARLINK-STARSHIELD-BOUNDARY-6b118c  
**Owner:** STARTAKE Codex Work / current conversation  
**Authenticated scope:** “Identifiable organizational and technological distinctions between the services.”  
**Parent topic:** Defense Dependence, Starshield, and Stewardship of Security  
**Review method:** Bounded direct review of public company disclosures and government records. Retrieved 19 October 2026 unless otherwise stated. This is not Legal Data Hunter-verified, independently engineered, counsel-reviewed, or a formal acceptance determination.

## Executive finding

Public sources support a real **product and service distinction**. SpaceX describes Starlink as its consumer and commercial connectivity service and Starshield as a secure network for government and national-security use, with earth-observation, secure-communications, and hosted-payload functions. Its June 2026 prospectus says Starshield adds high-assurance cryptographic capabilities to commercial-network encryption.

Those same company disclosures describe **shared foundations**: Starshield draws on Starlink technology, engineering experience, manufacturing, launch capability, and evolving Starlink-derived infrastructure. Procurement records separately describe Starshield services and commercial satellite-communications services, but identify Space Exploration Technologies Corp. as the recipient under the same Space Force PLEO indefinite-delivery contract. Such descriptions distinguish procurements and service requirements; they do not establish separate corporate ownership or physical, logical, or operational separation.

Government use is not a reliable boundary by itself. SpaceX offers commercial Starlink to U.S. government entities through commercial and GSA channels, while offering Starshield through PLEO and other government procurement routes. In one 2025 Space Force exercise, a Starshield terminal carried commercial internet in a non-classified setting. That example concerns one terminal and exercise; it does not show that all Starshield systems are non-classified, or that the two services share a particular control, routing, or data plane.

**Conclusion:** The public record establishes differentiated service purpose and some common technological and industrial foundations, but does not establish the legal-entity, title, network, control, cryptographic-key, software, ground-segment, or interface boundaries needed to treat either service as a wholly separate or wholly shared system. No change to Bill v1.14 is supported. Retain its commercial-only perimeter and require transaction-specific, owner-by-interest evidence and appropriately cleared review before drawing a transfer or separability conclusion. M06.01 and its parent topic remain formally unchecked.

## Scope, method, and exclusions

This assignment addressed only authenticated subcategory M06.01. It asked what organizational and technological distinctions between commercial Starlink and Starshield are established by current public primary sources, and what important boundary facts remain unverified.

The review inspected SpaceX product and investor disclosures, the SpaceX government-purchasing page, a U.S. Space Force exercise report, SAM.gov procurement notices, and USAspending award records. Company descriptions are treated as company claims, not independent engineering verification. Procurement descriptions are treated as evidence of the stated contract or order purpose, not proof of satellite title, architecture, performance, or actual service delivery.

The prior Item 6 Ukraine/Diesel/Starlink timeline report was checked for overlap. It addresses reported service restrictions and product-label ambiguity, but does not audit organizational or technical boundaries. This report does not repeat its chronology or incident allegations.

Excluded: classified or nonpublic material; customer-specific, mission, operational, or contract-performance facts; access-control, privileged-user, and command-credential questions; detailed classified-program structures; defense-user continuity; ownership-chain or asset-inventory conclusions; and any presumption that a government customer, product name, or procurement label proves asset ownership or system separation. No provider, agency, or customer was contacted.

## Findings

### 1. SpaceX describes different purposes and capabilities

SpaceX’s Starshield page distinguishes Starlink’s consumer/commercial purpose from Starshield’s government purpose and describes earth observation, communications, hosted payloads, and additional high-assurance cryptography. Its June 5, 2026 EU prospectus calls Starshield a network SpaceX operates separately for national-security applications; it describes three mission areas, mission-specific payloads, and cryptographic capabilities added to encryption used in the commercial network. [S1–S2]

This supports a public-facing service and capability distinction. The statements remain company representations. The words “separately operates” and “dedicated satellite network” do not, on their own, establish a separate corporation, a dedicated set of every underlying asset, or technical isolation of every service layer.

### 2. The company also describes shared industrial and technical foundations

The prospectus says Starshield is built on technology, manufacturing, and launch infrastructure that underpin Starlink, uses Starlink-derived infrastructure, and draws on engineering and operating experience from the commercial LEO constellation. [S2] This is direct evidence of company-described common foundations. It does not identify which satellites, terminals, spectrum, ground stations, software, routing functions, data paths, command systems, or personnel are shared, dedicated, licensed, or separately controlled.

The public sources do not provide architecture diagrams, asset schedules, rights schedules, key-management boundaries, interface specifications, or independent verification sufficient to map those layers. A “shared foundation” cannot be expanded into a finding that Starlink and Starshield use the same operational network or controls.

### 3. Government customer and procurement labels overlap

SpaceX says U.S. government entities can obtain Starlink through commercial channels and GSA, while Starshield is available through task orders on the Space Force CSCO PLEO contract and other government procurement routes. [S3] The prospectus also describes commercial connectivity for civil and state/local government customers separately from Starshield’s national-security network. [S2] Thus “government use” does not by itself identify Starshield, and a customer label is not a safe substitute for the service, asset, contract, or function being assessed.

The May 2026 SAM.gov Warrior Plan notice identifies a fixed-price award to SpaceX for Starshield services under the SSC PLEO contract. The September 2026 SAM.gov notice describes Starshield throughput, direct-peering, hardware-support, and on-site-support services. [S5, S7] USAspending’s record for that PLEO IDV identifies Space Exploration Technologies Corp. as recipient and lists separate delivery-order descriptions for pooled Starshield service and commercial satellite-communications service and hardware. [S6] The procurement record therefore supports distinct service/order descriptions within a shared contracting vehicle and recipient. It does not show separate ownership of spacecraft or other infrastructure, nor prove how the order descriptions are implemented technically.

### 4. One public exercise shows a non-classified Starshield-terminal use

The U.S. Space Force reported that a Starshield terminal was used in the March 2025 Freedom Shield exercise. It described the terminal as a larger version of Starlink tailored for government use and said it delivered commercial internet via satellite broadband in a non-classified exercise environment. [S4]

This is a limited but relevant qualification to any claim that the Starshield label itself means every associated activity or service is classified. It does not prove that all Starshield is unclassified, reveal the terminal’s internal design, or establish that the Starlink and Starshield networks share command, routing, encryption, or control planes. The source is an official exercise account, not a technical test report.

### 5. Public records do not establish a separate Starshield legal person or asset-title boundary

SpaceX’s prospectus identifies Space Exploration Technologies Corp. as the issuer and uses company language that it “operates” Starshield. The USAspending PLEO IDV identifies Space Exploration Technologies Corp. as the recipient for the listed Starshield and commercial-satellite-communications orders. [S2, S6] These sources support describing Starshield publicly as a SpaceX-operated product/network and show a common federal contracting recipient for the cited IDV.

They do **not** establish whether a separate Starshield subsidiary, program entity, joint venture, or other legal arrangement exists elsewhere; the sources reviewed are not a complete entity census. They also do not establish title to any particular satellite, terminal, payload, license, software, ground facility, or customer data. No inference about title or a wholly separate legal entity is made.

### 6. Ambiguous government record requires a document-level follow-up

A USAspending delivery-order record dated February 11, 2026 names Advanced Computer Concepts, Inc. as recipient and describes “X1 Starshield satellite global access” as a dedicated, government-owned LEO constellation. The record identifies a different recipient from SpaceX and is marked unlinked; no statement of work or source document tying this line to SpaceX’s Starshield offering was located in this pass. [S8]

**Open issue STARTAKE-ISSUE-M06-01-UNLINKED-X1-STARSHIELD-RECORD-20261019 (moderate; unresolved):** The competing public descriptions are SpaceX’s Starshield network/product disclosure and a separate, unlinked order to Advanced Computer Concepts that uses Starshield and government-owned-constellation wording. The latter could point to a different product, reseller/integration arrangement, or government-furnished/owned asset; the available record does not resolve which. Because this assignment makes no title or product-identity conclusion, the ambiguity does not change the bounded finding about SpaceX disclosures and the SpaceX-recipient PLEO IDV. Before formal acceptance or any asset-schedule conclusion, obtain and inspect the order’s statement of work, attachments, and documented relationship (if any) to SpaceX’s Starshield product.

## Evidence and unresolved-boundary matrix

| Question | Established by the reviewed public record | Not established; evidence needed |
|---|---|---|
| Intended service purpose | SpaceX publicly distinguishes commercial/consumer Starlink from government/national-security Starshield; it identifies Starshield mission areas and additional cryptographic capability. | Whether each product label consistently maps to a contract, mission, or technical configuration. Verify against service schedules and transaction documents. |
| Shared technology and infrastructure | SpaceX says Starshield uses Starlink technology, manufacturing and launch infrastructure, commercial-network engineering experience, and Starlink-derived infrastructure. | Which specific assets, facilities, software, or services are common or dedicated; the extent of isolation or shared control. Requires a verified asset/service schedule, diagrams, interface register, and independent engineering review. |
| Organization and legal person | SpaceX says it operates Starshield; the cited PLEO IDV recipient is Space Exploration Technologies Corp. | Complete legal-entity, program, subcontractor, joint-venture, and title relationships. Requires entity records and contract/asset documents; the public-source search is not a complete entity census. |
| Procurement distinction | Official sources describe separate Starshield and commercial Starlink channels and separate order descriptions under a common PLEO IDV. | Order-level asset ownership, exclusive-use rights, subcontracting, service implementation, or system separation. Requires orders, statements of work, modifications, and property schedules. |
| Classification and use | One Space Force exercise used a Starshield terminal for commercial internet at the non-classified level. | Classification status of other Starshield components or missions. Requires authorized, appropriately cleared review; no classified details were sought or used here. |
| Transfer and separability | Bill v1.14 excludes dedicated Starshield/classified programs and requires review of necessary interfaces. | Transaction-specific transfer rights, permissions, interfaces, shared-service dependencies, or ability to operate separately. Requires the schedules and independent assessments contemplated by the Bill. |
| “Government-owned Starshield” record | USAspending shows a separate order to Advanced Computer Concepts with that description. | Whether it refers to SpaceX Starshield, a different system, or a reseller/asset arrangement. Requires the missing order-level source documents; no ownership finding is drawn. |

## Bill v1.14 comparison and decision

The authenticated Crosswalk maps M06.01 to Bill §§3, 107, and 401.

- **Section 3(3)** limits the covered commercial business to the commercial Starlink communications business identified under §101 and excludes unrelated SpaceX businesses, dedicated Starshield and classified programs, and third-party property except specifically identified acquired interests. This is consistent with the commercial-only perimeter. Public product labels alone are insufficient to decide whether a particular interest falls inside that statutory perimeter.
- **Section 101(a)–(b)** requires an owner-by-interest schedule of proposed assets, liabilities, encumbrances, permissions, shared services, and exclusions, plus independent legal, financial, and engineering assessment. It requires verified facts to be separated from unresolved claims. This is the appropriate place to document actual transaction boundaries; this audit does not supply that schedule or claim that any particular item is transferable.
- **Section 107** preserves authorization and other permission requirements and calls for a transaction-specific authorization plan. It prevents the Bill from being read as transferring or approving regulatory permissions by itself. It does not determine the Starlink/Starshield technical boundary.
- **Section 401(b)** excludes dedicated classified and Starshield systems from acquisition, requires appropriately cleared review of necessary interfaces, and says no classified information or command credential is presumed transferable. This addresses the core transfer risk while recognizing that interfaces may require review. The public record cannot specify those interfaces.
- **Section 401(c)** governs transition-services schedules and funded exit planning. It does not itself establish network separation or a general product boundary.

**Decision:** No Bill v1.14 amendment is recommended from this evidence. Sections 3, 101, 107, and 401 already provide a commercial-only perimeter, an evidence-based schedule and independent separability review, a permissions savings rule, and a cleared interface safeguard. The evidence points to preserving these safeguards and applying them to transaction-specific interests; it does not justify declaring all Starshield assets separate, all Starlink assets common, or all government use inside or outside the proposed acquisition. The Bill remains unchanged.

## Original-criteria and formal-status disposition

This report supports only M06.01 and Practical Item 6’s public governance/security/service-protection work. It does not close M06.02–M06.08, the full parent topic, or any other practical item. The source’s exact title and scope, archive/member hash, custody state, proposed-section mapping, and formal-acceptance fields remain unchanged.

Initial practical-item coverage remains 7/7. Formal acceptance remains 0/7 practical items and 0/36 named topics. All 311 proposed scopes remain outside formal acceptance. Descriptive drafting maturity remains 29/50; congressional readiness remains unestablished. Practical Item 1 remains outside this instance’s scope.

## Source index

All sources below were retrieved on 19 October 2026. Company pages and filings are attributed to the company; government procurement and exercise records are attributed to their issuing agencies. The direct fetch of S1 timed out, so the core product distinction was cross-checked against S2. Direct opens of the SAM.gov and USAspending pages returned page shells; the searchable indexed record text was inspected, but linked contract attachments and statements of work were not available in this pass.

- **S1 — SpaceX, Starshield product page**, undated page, accessed 19 October 2026. Product purpose, mission areas, Starlink technology and launch capability, and security-feature descriptions. [SpaceX Starshield](https://new.spacex.com/starshield)
- **S2 — Space Exploration Technologies Corp., EU Prospectus**, approved June 5, 2026, especially printed p. 115 / extracted lines 11332–11340. Company description of Starshield’s purpose, mission areas, Starlink-underpinning infrastructure, and additional cryptographic capability; prospectus opening identifies the issuer and defines “SpaceX Group.” [Prospectus PDF](https://content.spacex.com/cms-assets/FINAL_Documents%20and%20Updates/SpaceX%20-%20EU%20Prospectus%20%28Approved%20by%20Bafin%29%20-%20June%205%2C%202026.pdf)
- **S3 — SpaceX Starlink Help Center, “How can a U.S. Government entity purchase Starlink?”**, accessed 19 October 2026. Separates the listed Starlink commercial/GSA channels from Starshield PLEO and other government procurement routes. [SpaceX government purchasing page](https://starlink.com/mp/support/article/e1744a37-1747-565d-c93c-9bd9afff9e48)
- **S4 — U.S. Space Force, Space Forces–Korea stands up first forward operating CJSpOC in support of FS25**, March 21, 2025. One reported terminal and exercise context; not a general architecture or classification source. [Space Force article](https://www.spaceforce.mil/News/Article-Display/Article/4131474/space-forces-korea-stands-up-first-forward-operating-cjspoc-in-support-of-fs25/)
- **S5 — SAM.gov, Warrior Plan 1 / SSC PLEO award notice**, award date May 22, 2026; original notice June 9, updated June 10, 2026. Award notice describes a SpaceX Starshield-services task order. [SAM.gov notice](https://sam.gov/opp/528df9b3997743b1973f802271312e90/view)
- **S6 — USAspending, IDV FA254125DB021**, retrieved 19 October 2026. Recipient and delivery-order descriptions under the same PLEO IDV. [USAspending IDV record](https://www.usaspending.gov/award/CONT_IDV_FA254125DB021_9700)
- **S7 — SAM.gov, Ka-band High Throughput System Ground Bounce / SSC PLEO order**, award date September 11, 2026; notice dated September 15, 2026. Starshield throughput, peering, hardware-support, and on-site-support descriptions. [SAM.gov notice](https://sam.gov/opp/ebf8133ac9aa49ffb00d3a084ec0de78/view)
- **S8 — USAspending delivery order FA877326F0029**, February 11, 2026; recipient Advanced Computer Concepts, Inc.; $65,812.48; unlinked award record. The description uses “X1 Starshield” and government-owned-constellation wording; no SOW was located. [USAspending order record](https://www.usaspending.gov/award/CONT_AWD_FA877326F0029_9700_NNG15SD60B_8000)

## Transaction receipt — baseline and reservation

- **UTC review timestamp:** 2026-10-19T05:31:06Z at source/baseline refresh; report and artifact saves follow.
- **Claim verified at actual tracker version:** canonical tracker stable Library ID libfile_590fd34e579c819189c02261fe34c456, file ID file_00000000e4d88230b8396ec1bbc6131a, version 367, 658,712 bytes, SHA-256 d48aa1d41e476a6b35507b06aff541e6177215f6910fcaf3d6832c2ffb2ac9a1. The unique claim token occurs once and the assignment text matches the authenticated M06.01 scope.
- **Authenticated original:** archive Starlink_Moral_Foundation_Research_Topics_19.zip, Library ID libfile_d51e095c82b88191807ddb3d6f4bdcfd, file ID file_000000009ba482308976d59a99fa4de8, 35,389 bytes, archive SHA-256 26ab27f27c0099f19ee0ac32d02e3245ba32555196d001fd4b60756fac66c8e0. Extracted member size 3,082 bytes, SHA-256 4d52d6a2afa0875cd7734ccf198db18f1357100b70007b584769e1508aa7318b.
- **Pinned baselines freshly materialized and hash-matched:**
  - Research Workflow v2.2: Library ID libfile_c61da08367148191ad4e5d76ce7aeff0, 7,613 bytes, SHA-256 b08372363ec1cb7ff8364a72cecfc2484071c2f86042446c3535be120b445d31.
  - Consistency Workflow v1.0: Library ID libfile_24fa6dd38c4481919375a3026ed06a62, 12,206 bytes, SHA-256 6c31bf961e4d7b31ea20b014ae030290e4996319b3022b759347bff3b04e8bcf.
  - Authenticated requirements: Library ID libfile_9027017d96d88191b360fbc3bff197d8, file ID file_00000000383c8230ba7e151f9ad64707, 94,285 bytes, SHA-256 3eccc9000e2c5a6a5ecff3a9212540c9907be88a2c3f05eaad7f1f022ff64e3f.
  - Bill v1.14: Library ID libfile_0fb03f28404c8191a6c549b3c0abb8f0, file ID file_000000008b2081fda4b214c6e3424500, 150,978 bytes, SHA-256 848e3dc59d671a56241f379ba9b9dcd427c679ca4051467674a5517edea6977e.
  - Crosswalk v1.24 Markdown / CSV: Library IDs libfile_a923231984288191a305dc466decbbc4 / libfile_eb2878fbb4208191956a5654696de863; sizes 87,755 / 443,724 bytes; SHA-256 89ea655078b0d806ad02dacb0409cf5cb534eda83d28d69e25694d559293b6b3 / d698f87c6d0ad9f6dcef2da008326ffec7adfa14f9db2c080ba3b966bca90111.
  - Dashboard v97: Library ID libfile_cc7518a16af48191815df91c0bc809da, file ID file_000000004e0881fdbf4824cfadf4b89c, version 97, 260,835 bytes, SHA-256 6f9f98196816d05e344ead80423e380cf57e80fd8f8e6f1b3e5bc890027df941.
- **Protected package invariants:** Bill v1.14 reviewed and unchanged; workbook v0.4 untouched; only M06.01 evidence/reference fields may change in Crosswalk v1.25; keep 311 unique labels; preserve original wording, custody and formal-status fields; retain M06.01, its parent and Practical Item 6 as unchecked; do not alter Item 1.
- **Dependency disposition:** Bill v1.14 was reviewed and left unchanged because the public evidence supports neither a text amendment nor an asset-transfer/technical-separation conclusion. Workbook v0.4 was not modified or examined; this boundary pass has no identified financial-model dependency. Only M06.01 Crosswalk evidence/reference fields, the additive report, tracker claim closeout, and dashboard checkpoint are in scope.
- **Source limits:** no private contract/SOW for the X1 anomaly, internal architecture, cleared technical review, title schedule, company/customer interview, or operational performance records. These remain open evidence needs.
- **Saved candidate IDs, revisions, exact-byte readbacks, and final tracker/dashboard receipt:** recorded in the final integration receipt appended after the report and Crosswalk saves.

## Final transaction receipt

### Report and Crosswalk receipt

- Report v0 was saved under stable Library ID libfile_300042d607e08191b3359c0ddbfe8859, file ID file_000000000d1881fda898716dcfdb198e, version 0, 23,651 bytes, SHA-256 01b1207d874429e0b914d4f2a1a78c64dcb4013effd9d14720439a2b9eed54ee. Fresh Library materialization exactly matched the submitted bytes. The current report version adds this transaction receipt; the v0 history remains preserved in Library.
- Crosswalk v1.25 Markdown was saved under Library ID libfile_5cbd2a75fb748191b68fe0fe531ed859, file ID file_00000000b18481fdab0a38fca4e326d0, version 0, 90,805 bytes, SHA-256 d5be3f2c9cd5ae63abed1118f4317379ce0bf3d68f3d1ce70e25e723f359b09e. Fresh Library materialization exactly matched the candidate, and the complete v1.24 Markdown is an exact byte suffix.
- Crosswalk v1.25 CSV was saved under Library ID libfile_043e162d94708191a36a9e9676ed3c02, file ID file_000000008b7c81fd8bf70fe6cb961448, version 0, 445,608 bytes, SHA-256 fb33663517e96455212cba56e1f82f1cb038e3fa83b9ba6bda96b3469aacc5df. Fresh Library materialization exactly matched the candidate. It retains 311 unique source labels and differs from v1.24 in exactly the five authorized M06.01 evidence/reference fields; the other 310 rows are field-identical, and all other M06.01 fields—including original wording, custody, proposed sections, and formal status—are unchanged.
- The report’s final content is submitted as version 1 under the same stable Library ID after a guarded replacement expecting current version 0. Its exact-byte readback is part of the canonical tracker closeout. The report’s own final byte count and digest are recorded there to avoid a self-referential hash.

### Tracker and dashboard closeout

The guarded release is tracker v367→v368, releasing only claim STARTAKE-20261019-WORK-ITEM6-M06-01-STARLINK-STARSHIELD-BOUNDARY-6b118c after report and Crosswalk readbacks. Dashboard v97→v98 adds the M06.01 checkpoint and preserves v97 as an exact suffix. Final tracker v368→v369 records the exact Dashboard v98 receipt and is independently read back. Exact current IDs, sizes, hashes, byte-preservation checks, and claim-release status are recorded in those canonical closeout entries. Formal acceptance, drafting maturity, and readiness remain unchanged.
