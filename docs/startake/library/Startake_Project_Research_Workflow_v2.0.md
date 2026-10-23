# Startake Project Research Workflow v2.0 — Mandatory Multi-Chat Operating Protocol

**Adopted:** 2026-10-14  
**Status:** Mandatory research operating policy in the Startake documentation corpus  
**Supersedes:** `Startake_Research_Workflow_v1.2.md` for future research cycles  
**Canonical research tracker:** `/Startake/Starlink_Communications_Research_Progress_Tracker_v1.4.md` in ChatGPT Library  
**Activation phrase (exact):** `STARTAKE: RESUME RESEARCH`

## 1. Binding scope and source of truth

This protocol applies to **every Startake chat that starts, resumes, or hands off research**, including parallel chats. A participating chat must load this document and the **latest live** tracker before choosing work. Document precedence for research operations: (1) explicit current user direction; (2) this project research governance; (3) the live v1.4 tracker, including its current work-claims register; (4) each original legal/moral topic document, approved subcategories and acceptance gate; (5) source evidence, research reports and older drafts. For evidence claims, primary sources control over unsourced summaries; this order does not make the tracker evidence of the underlying law or facts.

The seven **numbered practical completion-checklist items** and the 36 **named research topics** (17 legal and 19 moral) are distinct. Use full titles for named topics; numeric prefixes on their archival paths are not topic identifiers. Preserve original subcategory titles, all historical reports and project counts. Do not change substantive source records to make a pass appear complete.

**Acquisition boundary:** Hypothetical congressionally authorized and compensated acquisition of Starlink communications operations/infrastructure only. Not all SpaceX; Starshield/classified and other unrelated businesses are not presumptively in the perimeter. Clearly distinguish research hypotheses, factual evidence, legal uncertainty and policy alternatives.

## 2. One exact trigger for new chats

When a user sends **`STARTAKE: RESUME RESEARCH`**, treat it as authorization to execute **one** available research pass under this protocol. No clarifying question is needed merely to choose the next item; choose the earliest *Available* numbered practical checklist item in the live reset-run queue, unless the user explicitly names another item. In a new chat, first retrieve this protocol and the tracker from `/Startake/` ChatGPT Library; never infer the queue from memory or a pasted historical snapshot.

**Before doing substantive research, create an `In progress` active claim** with owner/claim token, timestamp, item title, exact scope, intended report path and claimed pass. Save and reread to confirm. Another chat's active claim takes priority over queue order; choose the next Available item and note the skip. Do not quietly reclaim another chat's task. If all items are claimed, blocked or complete, report the condition and offer the user an explicit reassignment option.

If the live shared record is inaccessible or cannot be safely changed, **do not call an item reserved** and do not initiate a potentially duplicative research run. Report the coordination blocker. A trigger is an instruction to attempt this workflow, **not** a magic platform command or an atomic lock.

## 2A. Standing authorization: execute the complete pass without permission ping-pong

**Project-wide standing instruction, amended October 14, 2026:** The trigger `STARTAKE: RESUME RESEARCH` is the user's authorization for the entire **one research pass** from selection through verified claim, evidence gathering, report drafting, saving, tracker integration, claim release, and reporting the next-item action. **Do not ask for separate permission, confirmation, or a Yes/No checkpoint for any ordinary step in that pass.** This also applies when the user expressly requests a particular Startake research item without repeating the trigger.

Proceed autonomously through routine, already-authorized actions, including:

- Searching, reading, downloading and cross-checking public evidence, project Library files and prior saved reports; choosing and using available relevant connected apps and tools, and switching to other available sources if one fails.
- Preparing/revising directions and research documents, invoking an **actually available** Deep Research capability, or performing a clearly labeled direct primary-source pass when it is not available. Never ask a redundant 'May I research?' or 'Should I use the app?' question.
- Writing new Startake research artifacts; making **scoped, version-checked changes** to the authorized shared tracker; claiming **In progress**; cross-referencing related named topics; logging gaps and research results; and releasing only the chat's own verified claim.
- Fixing routine technical errors, searching alternate sources, and resuming an interrupted *authorized* step, provided the live tracker still confirms no ownership conflict.

**No unnecessary checkpoints:** A plan or intermediate observation is informative only, **not a request for approval**. Do not ask whether to read a file, check citations, run the next tool, prepare a brief, use a connected app, integrate findings, or release an assignment. Do not declare a workflow blocked merely because one optional tool is unavailable when an authorized and honest alternative exists. Execute what is available within the current turn; do not promise background research.

**Actual limits (not optional questions):** Do not bypass the platform's required app permissions, OAuth connections, security approvals or service-side confirmation. Project standing authorization does not install/connect an app on the user's behalf, override missing access, or grant authority for unrelated destructive actions (deleting source evidence, changing account-wide permissions, publishing outside the project, spending money, sending messages to outsiders, or transferring another chat's claim). Stop or ask only when a **genuinely necessary** user decision or platform approval cannot be completed any other authorized way, or when shared claim coordination fails. Report the specific blocker once rather than requesting permission for each preliminary action.

**Research-pass boundary:** One trigger completes one coordinated pass and ends with a **user-controlled Start Next Research Item** action to prevent cross-chat duplication. This next-pass action is the only ordinary workflow opt-in; it must not be multiplied into approvals within a pass. A user instruction explicitly authorizing several passes in one turn may change the pass boundary, subject to separate verified claims and conflicts.

## 3. State machine, never conflate progress

There are **three separate axes**:

- **Research-pass state:** `Available` → `In progress` → `Research pass complete — verification pending` or `Blocked/Paused`; targeted follow-ups can open a new explicitly scoped pass later.
- **Active work claim:** `Unclaimed` → `Claimed` → `Released`. A `Blocked/Paused` assignment can retain its owner until explicit release/transfer. Release after report integration and acceptance decision, even when the item remains unchecked.
- **Formal acceptance state:** `Unchecked` until all original applicable evidence/subcategory criteria pass a documented audit; only then `Verified complete` with checkbox `[x]`. A completed report, a direct research pass, a Deep Research invocation or a placeholder link does not, by itself, meet that gate.

For any named research topic, its historical `In progress` label alone is **not a live reservation**. Track active work in a separate full-title named-topic claim ledger when needed. If a practical item and named topic overlap, cross-reference both active claims and avoid two chats independently pursuing the same scoped work.

## 4. Required reservation record

Store this data in the live v1.4 tracker; do not rely on this document's starting snapshot:

| Field | Required treatment |
|---|---|
| Item identifier | Practical item 1–7 **or full title** of an independently researched named topic |
| Work status | Exact marker `In progress` during live work |
| Claim ID | Unique human-readable identifier chosen for this attempt, e.g. `STARTAKE-20261014-item2-<unique-suffix>`; do not fabricate ChatGPT conversation IDs |
| Claimed at | ISO 8601 UTC timestamp |
| Owner reference | Chat label or actual conversation URL if provided/available; do not invent |
| Scope/intent | Pass number, approved subtopics being addressed, intended deliverables and report destination |
| Updated at | ISO 8601 UTC timestamp at every meaningful state change |
| Source/version seen | Tracker file ID or version/revision when provided by the file system; note absence explicitly |
| Result | Output path(s), open gaps, formal acceptance decision, released at |

Never display a claim without verifying its persistence in the **current** shared record. Never overwrite an item already `In progress` under a different claim. Recheck tracker after reserving, immediately before launching costly research, and before final write/release.

## 5. Concurrency hardening and limitations

The ChatGPT Library is **not** a transactional database. Read-modify-write/readback alone cannot provide guaranteed mutual exclusion if two chats race. These are **best-effort coordination controls**, not a claim of a distributed lock:

1. Read the latest tracker and record its exact file ID/version when available.
2. Prefer conditional/version-checked update where the underlying tool exposes it. Never assume overwrite-by-path is conditional; if no such safeguard exists, treat the operation as **non-atomic**.
3. Write only the intended claim/state change; preserve other rows and append rather than replacing prior research. Keep original tracker backup/source identity for rollback.
4. Immediately re-read the live tracker and confirm that your claim persists and all unrelated claims/states remain intact. If they differ, **STOP**, reconcile and ask the user for arbitration where ownership is ambiguous.
5. Re-read immediately before Deep Research or direct research execution. If any other claim for the same scope appears, **do not launch duplicate work**.
6. Re-read before saving final changes. Merge new findings and state changes against the current document, never against a stale cached tracker.
7. If a document update may have overwritten another chat's changes, stop and log an explicit **coordination conflict** and recover/merge from the known prior version. No silent last-writer-wins behavior.

**Important:** Two chats can still race *after* an apparently successful readback. Where strict no-duplicate guarantees matter, the user must stagger claim actions or move claim acquisition to a transactionally enforced service. Do not portray this file protocol as mathematically preventing simultaneous claims.

## 6. Exact five-stage execution

**Stage 1 — SELECT:** Load current tracker, this policy, applicable original research requirements, and recent saved reports. Identify earliest unclaimed available pass; skip confirmed active claims. Confirm requested scope and avoid duplicated completed passes.

**Stage 2 — CLAIM:** Save `In progress` with full reservation fields. Verify by reread. If not verified, stop rather than silently researching. Resolve stale/blocked work by explicit user reassignment, not time-based auto-expiration.

**Stage 3 — RESEARCH:** Prepare precise directions. Invoke Deep Research **only if an actual Deep Research action is available**; do not confuse drafting a prompt with launching an app. If unavailable, a user-authorized **direct primary-source research pass** is permitted, clearly labeled as such. Preserve primary citations, reporting/filing dates, contrary evidence, confidence, factual uncertainties and nonpublic diligence needs. Do not repeat prior research without a documented specific gap.

**Stage 4 — INTEGRATE AND RELEASE:** Add versioned research report, evidence index, checklist/subcategory matrix, source URLs, limitations and missing-evidence queue to `/Startake/`. Reconcile against current tracker and source docs, record research-pass completion (even with unresolved gaps), and separately evaluate formal acceptance. Set `Research pass complete — verification pending`, release the claim, and advance the research-pass queue without checking the formal completion box. If blocked, record `Blocked/Paused`, owner and concrete recovery action; do not misstate the report as finished.

**Stage 5 — WAIT FOR USER:** Present concise findings, exact item processed, saved output reference, unresolved gaps, research-pass and formal acceptance tallies, plus **Start Next Research Item** control. Do not automatically research another item. Pressing that control is functionally equivalent to sending `STARTAKE: RESUME RESEARCH` and must perform Stage 1 anew.

## 7. Recovery / handoff rules

- On new chat or resumed chat, never assume what another chat completed; **retrieve** the current tracker and recent report files and compare to the current claims register.
- A surviving `In progress` entry is **not automatically stale** merely because time elapsed. With no live-session visibility, retain it until the user authorizes takeover or the recorded owner releases it.
- Where the owner cannot complete, save a handoff note and mark `Blocked/Paused` (or `Transferred` with a documented new claim) before starting another owner's pass.
- If a claim is present but there is no report, do **not** mark the pass complete. If a report exists but claim release failed, reconcile and release that same claim only after checking report integrity and other active claims.
- Preserve original document wording, taxonomy and provenance; prior reports are not “lost” just because they do not appear in the first file search. Search the relevant ChatGPT Library folder before unrelated storage; never use a user's computer/Google Drive as an automatic fallback for this internal-project task.
- Cite project files and external primary sources appropriately; label unsupported report assertions as unverified.
- Retain dated session log and explicit failure/partial-write receipts, not just a success claim.

## 8. Project-instruction installation and verification

This file and the canonical tracker establish **documented Startake research governance**. A ChatGPT Project's own UI-level **Project Instructions** are a separate setting. When an interface/tool does not expose a Project Instructions edit action, the assistant **cannot verify that the UI setting changed**. In that case, provide the short exact instructions contained in `Startake_Project_Instructions_Bootstrap.md` for the project owner to paste into Project Instructions; do not claim automatic enforcement across every new chat.

**Bootstrap text location:** `/Startake/Startake_Project_Instructions_Bootstrap.md`.

## 9. Adoption state (does not start a research item)

At adoption: no new claim is made. The last verified reset-run snapshot recorded research pass 1 (**Ownership and acquisition perimeter**) as *research pass complete — verification pending*; practical item 2 (**Constitutional and statutory acquisition authority**) as the next available pass; formal acceptance **0/7** and named-topic acceptance **0/36**. All these are **historical adoption values**; new chats must refresh the live tracker.