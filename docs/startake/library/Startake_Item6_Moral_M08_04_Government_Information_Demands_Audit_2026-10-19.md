# Practical Item 6 / M08.04 — Government Information Demands Audit

**Date:** 19 October 2026  
**Claim:** `STARTAKE-20261019-WORK-M08-04-INFO-REQUESTS-c27f6e` (unique token `c27f6e`)  
**Claim status at research:** Reserved in canonical tracker v327 and independently read back before substantive research.  
**Original moral scope:** M08.04, “Government demands for information” — “Legal process, cross-border demands, transparency, and contesting improper requests.”  
**Bill reviewed:** The Starlink and Stripes Act, v1.14, §§203–204, 206–207 (with §202 and §206(d) as related provisions).  
**As-of date:** 19 October 2026.

## Purpose and limits

This is a bounded audit supporting Practical Item 6 and only the authenticated M08.04 scope. It compares public U.S. primary law and a small set of controlling Supreme Court decisions with the cited bill sections. It does not establish that Starlink or SpaceX received any government request, that a particular service or data class falls within a statutory definition, or that any specific disclosure would be lawful. No private, classified, or transaction-specific records were reviewed.

Item 1 remains excluded. No other M08 subcategory or M12.05 scope is audited. This report makes no Bill or workbook amendment, formal-acceptance change, readiness finding, or professional legal opinion.

## Method and source window

The work was divided into concurrent independent checks of: (1) Stored Communications Act provider categories and domestic legal process; (2) foreign orders, the CLOUD Act framework, and location-independent process; (3) nondisclosure, public reporting, and recipient challenge procedures; and (4) constitutional and Supreme Court limits relevant to provider-held data and a federally created operator.

The checks used official U.S. Code pages, official public-law records, and official Supreme Court/GovInfo opinions. The Legal Data Hunter daily quota was active, so this is **direct official-source review, not Legal Data Hunter verified**. The OLRC release page states that the current U.S. Code release is through Public Law 119-121 (9 October 2026). The relevant OLRC section pages reviewed displayed text through Public Law 119-120 (7 October 2026); the 50 U.S.C. §1881a repeal note identifies the later 2026 extensions described below. This review does not resolve any enactment after the current release point or how a particular transition provision applies to an existing order.

## Findings

### 1. Domestic process depends on provider role, data type, and the particular statute

The Stored Communications Act (SCA) applies to specified electronic-communication-service and remote-computing-service providers, including limitations framed around services provided “to the public.” It distinguishes stored communication contents from subscriber or customer records. The statutory provider definitions and what service a particular entity provides matter; this audit has no evidence to classify Starlink, SpaceX, or any affiliate, or to classify particular terminal, account, traffic, location, or content records.

For a covered provider, 18 U.S.C. §2702 generally prohibits voluntary disclosure of covered stored contents and disclosure of covered non-content records to government, subject to enumerated exceptions. Under §2703, government may obtain covered content and records through the specified warrant, subpoena, or court-order routes and applicable standards. Basic subscriber records listed in §2703(c)(2) may be obtained by authorized subpoena or other enumerated means; §2703(d) provides a separate court-order route for other records based on specific and articulable facts. These are not interchangeable process tiers.

The SCA also permits certain voluntary disclosures. In particular, a provider may disclose contents or records to government when, in good faith, it believes an emergency involving danger of death or serious physical injury requires disclosure without delay. This is permission, not a universal disclosure mandate. Other statutory exceptions are separately limited.

**Bill comparison.** Section 204(a) allows data disclosure only to provide or secure service, fulfill a lawful customer instruction, or comply with independently applicable law. That purpose rule may be read not to preserve the SCA’s optional emergency-disclosure permission unless the disclosure is also necessary to secure service or another legal duty applies. Clarify whether the bill intentionally narrows provider discretion in emergencies. This is a drafting question, not a conclusion that §204(a) conflicts with current law.

Section 203(b) requires records of material government directions concerning service restrictions or customer-data disclosure, including legal authority and scope. It does not specify a process-by-process log schema or expressly distinguish a served legal instrument from an informal coercive communication. Counsel should check that the intended logging duty covers every material demand while protecting gagged, privileged, classified, and operationally sensitive information.

### 2. Cross-border demands have distinct routes and limits

A foreign demand standing alone is not U.S. legal process. Section 204(c)’s sentence that a foreign demand is not itself U.S. legal authority is consistent with that distinction. But federal law separately permits a covered provider to disclose contents or customer records to a foreign government pursuant to an order subject to an executive agreement that the Attorney General has determined and certified under 18 U.S.C. §2523. That framework requires specified privacy, civil-liberty, oversight, targeting, minimization, request-specificity, and serious-crime safeguards. It is a limited statutory route; it does not convert every foreign demand into U.S. process.

The SCA also reaches covered provider data within the provider’s possession, custody, or control regardless of where the data are stored. That rule addresses a valid U.S. legal obligation; it is not a general grant to foreign governments to compel data directly. Section 2703(h) provides a limited provider motion to modify or quash U.S. process where the customer is not a U.S. person and does not reside in the United States and compliance creates a material risk of violating qualifying foreign-government law. The motion generally must be filed within 14 days. Relief depends on statutory findings, including comity and justice factors. During a qualifying motion the provider must preserve the information, but production may be ordered if immediate disclosure is necessary to prevent a specified adverse result. This is not a general customer veto or a universal conflict-of-laws defense.

**Bill comparison.** Section 204(c) should make clear whether “comply with independently applicable law” includes the SCA’s specific permission for a qualifying executive-agreement order. As drafted, §204(a)’s restrictive purpose language and §204(c)’s foreign-demand sentence could be read either to preserve that narrow route or to disallow disclosure unless a separate U.S. duty compels it. The bill should not imply that an unsupported foreign demand is valid U.S. process, or that a qualifying statutory route is automatically invalid because the order originated abroad.

### 3. Notice, secrecy, and public transparency are constrained by law

Under 18 U.S.C. §2705, government may delay customer notice for specified periods where notice could cause listed adverse results; a court may also order nondisclosure under statutory criteria. The rules distinguish notice to the customer from aggregate public transparency. A provider may be unable to identify a particular order or customer publicly while an applicable restriction remains in force.

National Security Letters under 18 U.S.C. §2709 are another distinct channel, limited to specified records and statutory certifications. A recipient can seek judicial review of covered requests and nondisclosure requirements under 18 U.S.C. §3511. Section 50 U.S.C. §1874 allows a person subject to certain FISA or NSL nondisclosure requirements to report counts using prescribed bands and timing structures. It is a permission with constraints, not a guarantee of complete or quarterly public disclosure for every demand.

**Bill comparison.** Sections 204(d) and 206(a) require aggregate lawful-access or quarterly public reporting, with redactions and disclosure only to the extent lawful. Those qualifications are important. The draft does not specify how reports will apply statutory count bands, suppression periods, delayed notices, or the expiration and review of gag restrictions. The Board should adopt a process that preserves underlying records, publishes only information permitted by law, identifies a legal basis when lawful, and reviews withholding when restrictions expire. The bill should not promise a customer notice or public count that a statute or court order forbids.

### 4. A provider’s ability to challenge process is statute-specific

SCA §2703(h) supplies a limited cross-border-conflict motion. NSL recipients have the review mechanism in §3511. Other process and surveillance regimes have their own statutory review rules. This pass did not establish a universal provider right to challenge every warrant, subpoena, order, directive, or gag, and it found no general statutory right for an affected customer to intervene in every government request.

Bill §207 authorizes an adversely affected person to seek declaratory or injunctive relief **against the Corporation** for violations of §§203–205. It creates no damages remedy. It does not, by its text, create a general action against the government, replace statutory review of government process, or authorize a provider to disregard a lawful order. Section 207(c) also preserves disclosure limits for privileged or classified material. Section 203(b)’s counsel and Inspector General referrals are internal review channels, not substitutes for independent judicial review where a statute provides it.

**Bill comparison.** Preserve the distinction between (a) an action against the Corporation for its own statutory violations, (b) a provider’s statute-specific challenge to legal process, and (c) any customer’s independent challenge. Do not describe §207 as creating a universal customer process challenge.

### 5. Constitutional decisions are relevant but narrow

In *Carpenter v. United States*, the Supreme Court held that government acquisition of at least seven days of historical cell-site location information from wireless carriers was a Fourth Amendment search generally requiring a probable-cause warrant. The Court expressly treated the holding as narrow. It does not decide the classification or constitutional treatment of satellite-network telemetry, all subscriber records, content, or any particular Starlink data. Application would require the actual data, service, duration, process, and facts.

In *Lebron v. National Railroad Passenger Corp.*, the Supreme Court held for First Amendment purposes that a corporation created by special law to further governmental objectives, where government retains permanent authority to appoint a majority of directors, is part of government. Bill §202 would establish a seven-member Board appointed by the President with Senate confirmation, subject to presidential removal. The factors make governmental-status and First Amendment review a material counsel question; *Lebron* does not decide the status of this proposed corporation or whether SCA provider definitions apply. This report draws no conclusion about constitutional classification.

### 6. Section 702 current-law status requires a transition check

The latest OLRC release point is Public Law 119-121 (9 October 2026). The current §1881a text includes a repeal note providing that, except as addressed by the FISA Amendments Act’s §404 transition procedures, the §702 repeal took effect 12 June 2026. Public Laws 119-84 and 119-87 extended the authorities first through 30 April and then through 12 June 2026. The §1881a page still displays operative text, but that text alone does not establish authority for a new post-sunset acquisition. The 2026 H.R. 9115 proposal is a bill, not an enactment. This bounded review does not resolve existing orders or the transition rule, and does not imply that other FISA authorities expired.

**Bill comparison.** No §702-specific drafting change is proposed here. Before any later bill language relies on §702, verify the relevant current enactment and transition provision as of the date of that review.

## Findings against the original M08.04 scope

| Original issue | Bounded result |
|---|---|
| Legal process | Primary statutes establish differentiated content and non-content routes; actual provider/data classification remains unknown. |
| Cross-border demands | Direct foreign demands and qualifying executive-agreement orders are distinct; U.S. process can reach covered data within possession, custody, or control regardless of storage location; one foreign-law motion is narrow and deadline-bound. |
| Transparency | Gag, delayed-notice, and reporting-band rules constrain individual and aggregate disclosure; “to the extent lawful” is necessary but operational procedures remain to be specified. |
| Contesting improper requests | Challenge rights vary by statute; §207’s action is against the Corporation, not a universal government-process appeal. |
| Bill alignment | §§204, 206, and 207 provide a relevant framework but leave emergency-disclosure, qualifying foreign-order, reporting implementation, and remedy boundaries for a separate drafting/counsel pass. |

## Adverse readings and unresolved facts

A court or government could read §204(a)’s “comply with independently applicable law” to require compliance with valid process while treating a permissive emergency exception as outside that purpose unless tied to service security. It could read §204(c) to prohibit disclosure under a qualifying foreign order unless another law independently authorizes it, even though §2702 contains a specific permission. Conversely, a broad reading of §204(a) could treat any SCA permission as sufficient authority. The text does not resolve these readings.

The underlying factual unknowns include which legal entity provides which service; whether it is an ECS/RCS provider “to the public”; the kind, source, content, and storage location of each record; which entity possesses or controls it; whether a particular demand is compulsory or voluntary; customer citizenship/residence where relevant; the instrument and issuing authority; whether any gag, emergency, privilege, or classified-information restriction applies; and whether a qualifying executive agreement or FISA transition rule is in force.

## Recommended next step

Keep Bill v1.14 unchanged for this claim. In a separately reserved drafting review, ask counsel to resolve the four text issues above: (1) whether §204 preserves or deliberately narrows optional emergency disclosure; (2) how qualifying §2523 foreign orders fit §§204(a) and 204(c); (3) what minimum lawful-access logging, delayed publication, and post-gag reporting procedures §§203/204/206 require; and (4) the boundary between §207 relief and statutory process review. Independently verify current §702 status and transition rules if §702 language becomes material. Do not apply any conclusion to an actual Starlink request without transaction-specific facts.

## Official primary-source index

Source pages were accessed for this bounded review on 19 October 2026. The current OLRC release point is [Public Law 119-121 (9 October 2026)](https://uscode.house.gov/download.html).

- [18 U.S.C. §2702 — voluntary disclosure, including emergency and qualifying foreign-order exceptions](https://uscode.house.gov/us/usc/119-118/t18/s2702/)
- [18 U.S.C. §2703 — required disclosure, process tiers, foreign-law motion, preservation](https://uscode.house.gov/us/usc/119-118/t18/s2703/)
- [18 U.S.C. §2705 — delayed notice and nondisclosure](https://uscode.house.gov/us/usc/119-118/t18/s2705/)
- [18 U.S.C. §2711 — ECS/RCS and governmental-entity definitions](https://uscode.house.gov/us/usc/119-118/t18/s2711/)
- [18 U.S.C. §2713 — data within provider possession, custody, or control irrespective of storage location](https://uscode.house.gov/us/usc/119-118/t18/s2713/)
- [18 U.S.C. §2523 — qualifying executive agreements](https://uscode.house.gov/view.xhtml?edition=prelim&f=treesort&jumpTo=true&num=0&req=%28title%3A18+section%3A2523+edition%3Aprelim%29+OR+%28granuleid%3AUSC-prelim-title18-section2523%29)
- [18 U.S.C. §2709 — national-security-letter records authority and nondisclosure provisions](https://uscode.house.gov/us/usc/119-118/t18/s2709/)
- [18 U.S.C. §3511 — judicial review of requests and nondisclosure](https://uscode.house.gov/us/usc/119-118/t18/s3511/)
- [50 U.S.C. §1874 — public reporting by persons subject to orders](https://uscode.house.gov/us/usc/119-118/t50/s1874/)
- [50 U.S.C. §1881a — Section 702, including the repeal/transition note](https://uscode.house.gov/us/usc/119-118/t50/s1881a/)
- [Public Law 119-84](https://www.govinfo.gov/app/details/PLAW-119publ84) and [Public Law 119-87](https://www.govinfo.gov/app/details/PLAW-119publ87) — 2026 Title VII extensions.
- [H.R. 9115, introduced 3 June 2026](https://www.govinfo.gov/content/pkg/BILLS-119hr9115ih/xhtml/BILLS-119hr9115ih.html) — proposal only; not treated as enacted law.
- [*Carpenter v. United States*, 585 U.S. 296 (2018)](https://www.supremecourt.gov/opinions/17pdf/16-402_h315.pdf) — official Supreme Court opinion.
- [*Lebron v. National Railroad Passenger Corp.*, 513 U.S. 374 (1995)](https://www.govinfo.gov/content/pkg/USREPORTS-513/pdf/USREPORTS-513-374.pdf) — official U.S. Reports opinion.

## Assignment receipt

This report covers only claim `STARTAKE-20261019-WORK-M08-04-INFO-REQUESTS-c27f6e`, reserved at 2026-10-19T00:46:48Z UTC and independently read back in tracker v327 before research. It uses only public-source research. Item 1 remains excluded; no actual Starlink/SpaceX process, provider classification, protected record, Bill amendment, workbook change, formal acceptance, readiness determination, or professional sign-off is claimed.