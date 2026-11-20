> **SUPERSEDED FOR NEW RESEARCH CYCLES — 2026-10-14.** This v1.2 policy is archived for provenance. The mandatory project-wide successor is [Startake Project Research Workflow v2.0](Startake_Project_Research_Workflow_v2.0.md). New-chat trigger: `STARTAKE: RESUME RESEARCH`. Do not use this archived copy as the active operating rule.

# Startake Research Workflow v1.2 — Multi-Chat Research Claims

**Adopted:** October 14, 2026  
**Status:** Operating policy for future Startake research passes  
**Canonical shared coordination register:** `Starlink_Communications_Research_Progress_Tracker_v1.4.md` in `/Startake/` ChatGPT Library.

## Purpose

Allow several Startake conversations to research different areas simultaneously **without inadvertently duplicating live assignments**, while keeping research-pass completion separate from acceptance of the seven practical checklist gates and the 36 named research-topic acceptance gates.

## Status vocabulary

- **Available:** No active work claim is recorded. Historical source material may still exist.
- **In progress:** A chat has claimed this particular item for a live research pass; record **claim ID/owner label, claimed-at timestamp, pass scope, and intended output**. This is the operational marker the user requested.
- **Blocked/Paused:** Work is not progressing; retain owner, reason, and next action until released, handed off, or resumed. Do not silently label it complete.
- **Research pass complete — verification pending:** The assigned pass finished, findings and citations are saved, remaining gaps recorded, and its active claim released. This **does not** check the formal checklist box.
- **Verified complete:** All original applicable subcategories, evidence and acceptance gates satisfied and documented; formally check the corresponding box and recompute progress totals.

The historical named-topic status (*Not started*, *In progress*, etc.) is **not** a concurrency lock. It may describe work commissioned by another chat in the past. Active claims and research pass statuses are separate.

## Five-stage workflow

1. **Read and reserve:** Open the latest authoritative v1.4 tracker (not a previously downloaded copy). Find the next **Available** practical checklist item, respecting the reset queue and any user-selected item. Check both practical and named-topic active claims, if any. If another chat owns the work, do not duplicate it; select another unclaimed assignment or request explicit reassignment.
2. **Mark In progress before research:** Record `In progress | Owner/chat label or unique claim ID | Claimed-at timestamp (UTC) | Work scope / pass | Intended report path` in the tracker. If working an independently named topic, add a named-topic claim entry identifying it **by full name**. Update its historical topic status to In progress if not already. **Save and immediately reread** to confirm your reservation exists. If the save fails or an intervening update changes the claim, resolve the conflict before spending research effort.
3. **Prepare and execute:** Draft precise directions from that item's approved requirements. Prefer the Deep Research tool when it is available. If unavailable, clearly label direct primary-source research as a **direct research pass**; never claim a Deep Research invocation you did not perform. Cite primary documents, record contrary evidence and unresolved data-room needs. Use the Starlink-only acquisition perimeter and Starshield exclusion.
4. **Integrate and release:** Write the research report, primary-source index, comparisons with existing Startake data, known gaps and acceptance decisions to Startake Library. Update the tracker **after rereading its current state**: change the item to **Research pass complete — verification pending**, or **Verified complete** only if the full evidence gate is actually met. Clear the active claim; preserve the owner and timestamp in the dated session log. If blocked, set **Blocked/Paused** and explain what happened.
5. **Next-item control:** Summarize the finished pass and show the user a **Start Next Research Item** button. The button must first reread the tracker, then claim the next available item with **In progress** before starting research; it must not automatically launch another pass.

## Shared claims register

The authoritative work-claim register is the **Active work claim** column in the `Current operating run` table of `Starlink_Communications_Research_Progress_Tracker_v1.4.md`. Each active cell must contain an explicit `In progress` marker and identify its owner/claim ID, time, and scope. Each chat should use a distinct short claim ID or identifiable chat URL when available. Do not invent or assert a platform conversation ID that cannot be read.

For standalone named-topic investigations not identical to one of the seven checklist assignments, add an equivalent **Named topic active claims** table to the tracker, with topic **full title**, status, owner/claim ID, time, scope and output path. Do not renumber the 36 original topics. This table must be checked alongside the seven-item register.

## Race and stale-work handling

The shared Library tracker is not a transactional task queue or guaranteed atomic locking system. Different chats may both read Available before either saves. Use this best-effort defense: **latest read → claim/write → readback verification → research → latest reread → reconcile and release**. If the Library reports a version conflict, reread and reconcile. Never overwrite another chat's claim just because a local copy is older. If an in-progress claim seems stale, ask the user to release or reassign it; no automatic expiry based only on elapsed time. If safe write/readback is unavailable, report that coordination is unverified and do not pretend the item has been reserved.

## Starting state at adoption

- Checklist item 1 **Ownership and acquisition perimeter**: **Research pass complete — verification pending**; no active claim. First-pass review saved and older dedicated Deep Research report retained.
- Checklist item 2 **Constitutional and statutory acquisition authority**: **Available**, first next reset-run pass; no active claim.
- Remaining checklist items: **Available** in reset run; previously commissioned work remains historical reference, not active ownership.
- **No current live claims registered by this workflow revision.** 1/7 fresh first passes saved; 0/7 practical gates and 0/36 named-topic completion gates formally verified.

**Document-control note:** This workflow governs research tracking and coordination, not acquisition policy conclusions. No new research pass is initiated merely by publishing this policy.