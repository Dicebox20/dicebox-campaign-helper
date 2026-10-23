# Startake Project Research Workflow v2.1 — Streamlined Operating Protocol

**Effective upon verified adoption in the live tracker:** 2026-10-15 UTC  
**Supersedes:** Workflow v2.0 for future research operations; v2.0 and all reports remain immutable historical records.  
**Canonical tracker:** `/Startake/Starlink_Communications_Research_Progress_Tracker_v1.4.md`  
**Trigger:** `STARTAKE: RESUME RESEARCH` (authorizes ONE complete coordinated pass; no separate approval for routine operations).

## Mission, scope, and evidence protections

Study a hypothetical congressionally authorized, compensated acquisition of commercial Starlink communications infrastructure and operations ONLY, not SpaceX as a whole or presumptively Starshield/classified programs. Preserve all original records, 7 practical checklist items, 36 named research topics (17 legal, 19 moral, 311 proposed subcategories), original approved headings when actually available, and historic provenance. Never invent a missing original heading. Source findings must identify primary documents, dates, URLs, contrary evidence, limitations and outstanding evidence gaps. A completed research pass never automatically verifies a checklist item or topic.

## Simple user experience: one pass, no interruptions

1. **Select:** Reread this policy and the current tracker. Find the earliest numbered practical item with an unclaimed, genuinely distinct evidence gap; skip currently owned or duplicated scopes. Check overlapping full-title named-topic claims. The user can request a different item explicitly.
2. **Reserve:** One designated *write coordinator per assignment* performs tracker writes; all chats should treat the canonical tracker as a single-writer critical section for each save. Create a compact record: `In progress`, unique claim token, owner/chat label, UTC time, item, precise unique gap, named-topic overlap, intended report path and source version. Perform a conditional/version-checked update and reread the resulting live tracker before research. A coordinator is a **role held by the chat performing the successful write**, not a separate background agent or guaranteed global singleton. Parallel chats may research distinct coordinator-allocated scopes, but must never independently seize the same claim. A canonical Library document is not a distributed lock.
3. **Research:** Run one bounded pass. Use an actually executable Deep Research capability when available, otherwise direct primary-source review, honestly labeled. Research only the reserved gap; do not duplicate completed passes.
4. **Save and close:** Create ONE consolidated report containing findings, evidence-index/source URLs, contradictions, source dates, original-criteria/verification matrix where available, and unresolved-gaps register. Save in `/Startake/` and reread to verify. Refresh tracker, conditionally merge only the owned scope and mark `Research pass complete — verification pending`, release only the owned claim, verify tracker readback. Formal checkboxes stay unchecked until original acceptance requirements are independently audited.
5. **Stop:** Summarize item, findings, gaps, exact verified saved report, research and formal counts, and provide a user-controlled `STARTAKE: RESUME RESEARCH` next-item button. Do not automatically start a new assignment.

## Coordinator operation and concurrent work

- The canonical tracker remains the sole coordination register. Ordinary research chats must honor active claims; no orphaned claim transfer based solely on age.
- Keep historical narrative and unaffected rows unchanged. Prefer conditional compare-and-swap (CAS) replacing the **same stable Library file ID**, with `expected_current_version` obtained from the **Library update operation's conditional version**, not the `version_id` returned by file listing (these differ). Version conflicts must prompt refresh/reconciliation, never blind overwrite. If the conditional version is unknown, do not guess: use a supported metadata/version endpoint or an intentionally rejected conditional write on an isolated diagnostic file to distinguish semantics. Do not probe or write the production tracker with guessed numbers; establish a reliable current conditional version before a production change.
- When strict global single-writer guarantees are unavailable, **do not claim they exist**. Sequential user-driven sessions are the default. Parallel research requires distinct scopes allocated in the live register; if collision/ambiguity occurs, stop that scope and log the conflict.
- Save/readback and compare the owned claim and preservation of unrelated live claims after reservation and release. Do not erase data if the Library is inaccessible. Use one consolidated report rather than duplicate handoffs; a separate recovery note is only necessary after a genuine interruption.
- On routine tool errors, silently attempt safe technical recovery. Surface only genuine blockers, not repetitive permission requests. Standing project authorization covers routine use of connected apps, tools, Library reads/writes, and reports; platform OAuth/security constraints remain effective.

## Acceptance, custody, and audit

Three states are independently recorded: (a) research pass (`Available`, `In progress`, `Research pass complete — verification pending`, `Blocked/Paused`), (b) active claim (`Unclaimed`, `Claimed`, `Released`) and (c) formal verification (`Unchecked`, `Verified complete` only upon demonstrated original criteria). A report alone never means formal acceptance. Do not replace approved 7/36 structures with fabricated criteria. Keep earlier Workflow v2.0 and v1.2 intact. Maintain accurate reported tallies. No deletion, public dissemination, expenditure, external communications, or unrelated account setting changes.

## Migration and governance

Effective only after the canonical tracker is version-check updated and reread with a reference to this v2.1 file; merely uploading v2.1 does not install ChatGPT Project Instructions. The live tracker governs assignment ownership. This workflow creates **no research claim and executes no research pass on adoption**. Existing handoffs remain historical and source files intact. For future starts, read v2.1 and the current tracker; use this policy over v2.0 unless explicitly superseded by the user.

**Migration validation:** a separate, non-canonical diagnostic Library file underwent (1) creation/readback, (2) CAS update and readback, and (3) second CAS update. This shows conditional updates are possible but does not guarantee global serialized writes. Production changes still require fresh concurrency checks.