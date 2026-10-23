# Item 4 USAC Invoice-Cohort Revalidation — No New Evidence

**Assignment:** `STARTAKE-20261015-WORK-ITEM4-INVOICE74-9c2a51`  
**Research/revalidation date:** 15 October 2026 UTC; official-source retrieval completed before 2026-10-15T17:33:18.232Z.  
**Status:** Revalidation complete; the assigned question was already answered in the earlier Item 4 application/payment-link audit. No new invoice rows, evidence-gap closure, bill revision, or formal acceptance is claimed.

## Question and result

Does a fresh invoice/authorized-disbursement query across the complete set of current-funded USAC FRNs for Space Exploration Technologies Corp. (SPIN 143053761) disclose invoice lines beyond the previously saved 56-line extract?

**No.** The refreshed official current-funded query returned 74 unique FRNs. Its identifier set is exactly the same as the previously saved USAC current-funded snapshot (74 of 74; no added or removed FRN). Querying the official invoice dataset against all 74 identifiers returned the same 56 lines previously saved, across the same 11 FRNs. After normalizing numeric formatting (for example, `540.0` versus `540`), every overlapping field in all 56 rows matched the saved extract; there were no other field mismatches.

The current USAC FRN Status response returned a `total_authorized_disbursement` value for the same 11 FRNs. The line sums match those reported FRN amounts to the cent for every one of the 11 records. Their combined requested and approved invoice-line amounts are each **$38,529.41**. The other 63 current-funded FRNs had no invoice line in this dataset query and no `total_authorized_disbursement` value returned in the current query. Those missing rows/values are **not zero findings**.

| FRN | Invoice lines | Requested | Approved | USAC FRN total_authorized_disbursement | Invoice type and status |
|---|---:|---:|---:|---:|---|
| 2499009670 | 1 | $1,728.00 | $1,728.00 | $1,728.00 | Applicant / SENT TO USAC |
| 2499018027 | 12 | $1,296.00 | $1,296.00 | $1,296.00 | Applicant / SENT TO USAC |
| 2499031960 | 12 | $1,399.50 | $1,399.50 | $1,399.50 | Applicant / SENT TO USAC |
| 2499039197 | 10 | $1,317.91 | $1,317.91 | $1,317.91 | Applicant / SENT TO USAC |
| 2499042130 | 3 | $2,845.00 | $2,845.00 | $2,845.00 | Applicant / SENT TO USAC |
| 2499050062 | 2 | $952.50 | $952.50 | $952.50 | Applicant / SENT TO USAC |
| 2499056696 | 1 | $10,800.00 | $10,800.00 | $10,800.00 | Applicant / SENT TO USAC |
| 2499056732 | 12 | $10,800.00 | $10,800.00 | $10,800.00 | Applicant / SENT TO USAC |
| 2499057267 | 1 | $1,008.00 | $1,008.00 | $1,008.00 | Applicant / SENT TO USAC |
| 2499057486 | 1 | $4,050.00 | $4,050.00 | $4,050.00 | Applicant / SENT TO USAC |
| 2499058087 | 1 | $2,332.50 | $2,332.50 | $2,332.50 | Applicant / SENT TO USAC |
| **Total** | **56** | **$38,529.41** | **$38,529.41** | **$38,529.41** | **11 FRNs** |

All 56 records are Funding Year 2024 **Applicant** invoice lines associated with Space Exploration Technologies Corp. SPIN 143053761. USAC defines Applicant invoices as Billed Entity Applicant Reimbursement (BEAR), FCC Form 472, and Service Provider invoices as SPI, FCC Form 474. Its current filing instructions require a BEAR applicant to have received the eligible equipment/services and paid the provider in full before filing. This is a program prerequisite and an applicant claim; we did not inspect the 56 underlying BEAR forms, individual payment evidence, or remittance statements.

USAC describes `SENT TO USAC` invoice lines as completed after review and a payment decision. The invoice dataset describes the approved line amount as authorized for disbursement; the current FRN Status field is named `total_authorized_disbursement` and its field description is “Total net amount disbursed to a service provider or applicant.” Those are USAC-reported program records. No applicant bank records or remittance statements were accessed, so this report does not claim bank-confirmed receipt by applicants or SpaceX. Because all returned lines are Applicant/BEAR, the $38,529.41 is not a direct USAC payment to SpaceX and is not a Starlink cash-receipt total. The evidence also does not establish service delivery independently of the applicants’ program certifications.

## Why this is a duplicate-scope closeout

The existing [Integrated Working Bill v1.0](The_Starlink_and_Stripes_Act_Integrated_Working_Bill_v1.0_2026-10-15.md), in its v0.8 revision memorandum, already documents the 74-FRN cohort, 56 invoice lines, 11 FY2024 applicant BEAR FRNs, and $38,529.41 requested/approved totals. It also expressly says an applicant’s certification of prior provider payment is not, by itself, transaction-level proof of provider cash receipt. The existing [Item 4 application and payment-link audit](Startake_Item4_USAC_Erate_USF_Application_and_Payment_Link_Audit_2026-10-15.md) and [saved 56-line invoice extract](Startake_Item4_USAC_ERate_Authorized_Invoice_Lines_2026-10-15.csv) therefore already cover this assignment’s substantive data and distinction.

The fresh query confirms that the saved 74-FRN identifier cohort and 56-line invoice extract still match the official data returned on 15 October. It does not add a new row, payment fact, or legislative gap. Proposed §302(d)(5) already distinguishes Applicant/BEAR reimbursement from provider/SPI invoicing and requires reporting requested, authorized and disbursed amounts separately; §302(d)(3) requires transaction-level support before attributing a covered-business receipt; and §302(d)(6) requires record-level source reconciliation. No bill revision is warranted on this revalidation alone.

## Source and method

On 15 October 2026 UTC, the official USAC raw FRN Status resource `qdmp-ygft` was queried with `epc_organization_id='143053761' AND form_version='Current' AND form_471_frn_status_name='Funded'`, ordered by FRN and limited to 1,000. The query returned 74 rows and 74 unique FRNs. USAC metadata reports the FRN Status data last updated at **2026-10-15 09:37:00 UTC**.

The official invoice resource `jpiu-tj8h` was queried by the exact 74 current-funded FRN identifiers. It returned 56 rows, 56 unique invoice-line numbers and 11 unique FRNs. USAC metadata reports the invoice data last updated at **2026-10-15 08:31:20 UTC**. Each invoice line was matched by exact `funding_request_number`; line totals were grouped and reconciled to the corresponding `total_authorized_disbursement` field in the current FRN response. Numeric formatting was normalized to cents for comparisons; source values were not replaced.

Previously saved comparison inputs: [USAC current-funded FRN source snapshot](Startake_Item4_USAC_Current_Funded_FRN_Source_Snapshot_2026-10-15.json), Library ID `libfile_e259a3c5cf708191ac4f015a5958966b`; [USAC authorized invoice extract](Startake_Item4_USAC_ERate_Authorized_Invoice_Lines_2026-10-15.csv), Library ID `libfile_4c5f2ead7a2081919db1c6b2ac93e29a`; and [Bill v1.0](The_Starlink_and_Stripes_Act_Integrated_Working_Bill_v1.0_2026-10-15.md), Library ID `libfile_d738eaa0f1648191ac0f8ad8446e2243`.

Primary sources:
- [USAC E-Rate FRN Status dataset](https://opendata.usac.org/E-Rate/E-Rate-FRN-Status-Tool-FY2016-/8xzh-ytkh) and [raw FRN Status API resource](https://opendata.usac.org/resource/qdmp-ygft.json)
- [USAC E-Rate Invoices and Authorized Disbursements dataset](https://opendata.usac.org/E-Rate/E-Rate-Invoices-and-Authorized-Disbursements-FCC-F/jpiu-tj8h) and [raw invoice API resource](https://opendata.usac.org/resource/jpiu-tj8h.json)
- [USAC Data Glossary for Forms 472/474](https://opendata.usac.org/api/views/jpiu-tj8h/files/a0c7521c-bcd0-4de5-8b9c-482cea24432e?download=true&filename=E-rate+Invoices+and+Authorized+Disbursements+%28FCC+Form+472_474%29+Data+Glossary.pdf)
- [USAC FCC Form 472 (BEAR) filing requirements](https://www.usac.org/e-rate/applicant-process/invoicing/fcc-form-472-filing/)
- [USAC E-Rate Invoice dataset status explanation](https://www.usac.org/slnewsbriefs/2021/News-Brief-2021-04-23.pdf)

## Status and remaining gaps

This is a duplicate-scope validation, not a new Item 4 evidence closure. Item 4 remains unchecked. Initial research coverage remains **7/7**; formal acceptance remains **0/7 practical and 0/36 named**; the **311** recovered proposed scope texts remain unaudited; descriptive drafting maturity remains **29/50**; overall congressional readiness remains **unestablished**. USAspending refresh availability, national funding coverage, pending/cancelled invoice data, recipient remittance/bank evidence, provider cash receipt, commercial-only attribution, and professional review remain open.