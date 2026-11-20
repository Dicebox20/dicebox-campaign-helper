# Original legal scope 17.11 — Legislative Drafting Form Consistency Audit

**Date:** 17 October 2026 UTC  
**Claim:** `STARTAKE-20261017-WORK-LEGAL-17-11-CONSISTENCY-9c7e21`  
**Status:** Research pass complete; formal verification pending; acceptance unchecked.

## Assignment and source scope

This bounded review addresses original legal subcategory 17.11, “Legislative drafting form,” under the full-title named topic *Legislative architecture and drafting standards*. The authenticated crosswalk preserves the source-member digest `ae20fb34e49a8b1797f36836186b6250564e2bcf91782766f3d16a3c79a7782f` for `Starlink_Research_Topics/17_legislative_architecture_and_drafting_standards.md` in `Starlink_Research_Topic_Documents_17.zip`. The subcategory calls for review of House Legislative Counsel style, bill section architecture, definitions and effective dates.

The assignment was conditionally reserved from canonical tracker version 290 to 291 and independently read back before analysis. It is cross-cutting drafting support only. It does not claim acceptance of a practical item, the 17.11 subcategory, or its parent topic. The earlier released Chapter 91 assignment touched only narrow §208/§301 interfaces and was not repeated.

## Method

I reviewed the full proposed statutory text in Bill v1.8, from “Proposed bill text” through §503. I compared its structure with the House Office of Legislative Counsel’s public drafting guide and Manual on Drafting Style. The House guide identifies the section as the basic unit of a bill, gives the first-section label as “SECTION 1.” and later-section label as “SEC.”, describes the section/subsection/paragraph hierarchy, and offers a general order for substantive rules, transitional provisions, definitions, effective dates and appropriations. These materials describe the Office’s conventions; this assignment does not treat them as binding House rules or substitute for a Legislative Counsel redline.

A reproducible text check compared the statutory headings with the expected sequence `1–3, 101–110, 201–208, 301–303, 401–404, 501–503`; counted duplicate/missing section numbers; extracted internal references to numbers in that section set; and scanned subsection/paragraph references against labels in the cited section. I then manually checked the flagged form issues and the effective-date, sunset, transition and appropriation interfaces. The check was limited to internal drafting form. It did not re-verify authorities, facts, legal effects, appropriation sufficiency, scorekeeping, or policy merits.

## Findings and corrections

| Finding in v1.8 | Treatment in v1.9 |
|---|---|
| The first statutory section was headed `SEC. 1.`. The House Office guide shows `SECTION 1.` for the first section and `SEC.` for later sections. | Changed the heading to `SECTION 1. SHORT TITLE.`. All later section headings retain `SEC.`. |
| Section 107 uses capitalized “Commission” as shorthand for the Federal Communications Commission, but §3 did not define that term. The first use gives the full agency name; an express definition makes the shorthand clear throughout this freestanding Act and distinct from State commissions. | Added §3(6): `“Commission” means the Federal Communications Commission.` No agency power or duty changed. |
| A paragraph beginning “Drafting instruction:” appeared between §303(e) and Title IV inside the stated proposed-bill-text block. Although plainly editorial, its placement could cause it to be mistaken for part of §303. | Moved its substance to a separately labeled `Drafting notes — not part of proposed bill text` block after §503. The five bracketed appropriations choices remain visible in §303. |
| The structure, effective-date and sunset relationships were reviewed. | No further change. Section 503 makes the Act effective on enactment but says enactment alone transfers neither property nor operating control. Deadlines tied to enactment or establishment remain distinguishable; §110’s five-year limit is stated separately. |

No internal cross-reference target was found missing. The mechanical check found 31 unique numbered sections in the expected sequence and 27 references to section numbers in that set; all pointed to an existing section. Manual checks also found all 10 intra-section subsection references and all 6 paragraph references matched a present label. This check does not validate the substantive accuracy or legal effect of a cross-reference.

## Bill revision

Bill v1.9 changes only the first statutory section label, adds the Commission definition in §3, and relocates the §303 editorial note outside the proposed statutory text. It retains 31 numbered sections and the same five titles. No acquisition authority, compensation rule, appropriation amount, deadline, remedy or policy rule changed.

The five bracketed §303 choices remain unresolved: due-diligence fiscal year, due-diligence amount, availability date, acquisition/transition amount and continuity reserve. The House Legislative Counsel redline, appropriations counsel, CBO/OMB scorekeeping and independent substantive review remain open. This pass establishes neither formal acceptance nor congressional readiness.

## Verification record

- Bill v1.8 source: `/Startake/The_Starlink_and_Stripes_Act_Integrated_Working_Bill_v1.8_2026-10-17.md`; Library ID `libfile_e4218432e12481918be0d067763feb1c`; 131,141 bytes; SHA-256 `72d549d3e7388373a1ce773bd794ca97a2862a47a44ca328a35830e8304712e4`.
- Bill v1.9 output: `/Startake/The_Starlink_and_Stripes_Act_Integrated_Working_Bill_v1.9_2026-10-17.md`; 132,255 bytes; SHA-256 `d6e87837ff833ce919d1444c24bd2c59779ede004760869d7c7f7067d34346dd` before Library upload.
- Mechanical checks on v1.9: 31 unique headings; expected sequence; no unresolved section-number targets; no subsection/paragraph reference without a corresponding label; the editorial instruction no longer occurs inside proposed bill text; all five funding placeholders remain visible.
- No external Legal Data Hunter query was needed for this internal-form pass. The House guide’s search-indexed text was available from the official House Office of Legislative Counsel page; a direct page-open request returned HTTP 403. No assertion of independent professional review is made.

## Sources

1. House Office of Legislative Counsel, [HOLC Guide to Legislative Drafting](https://legcounsel.house.gov/holc-guide-legislative-drafting), especially “Organization within a bill,” the section-format outline, and the general template for structuring content (official page; accessed through indexed official text 17 October 2026).
2. House Office of Legislative Counsel, [Manual on Drafting Style (December 2022)](https://legcounsel.house.gov/sites/evo-subsites/legcounsel-evo.house.gov/files/documents/ManualDraftStyle_2022.pdf), official House publication.
3. STARTAKE Original Requirements to Bill Crosswalk v1.4, original legal row 17.11; CSV Library ID `libfile_bdf15a8a5be08191ab14ca1a6918d6d3`.
4. STARTAKE Integrated Working Bill v1.8, Library ID `libfile_e4218432e12481918be0d067763feb1c`.