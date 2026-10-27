# DiceBox Project-Wide Conversation Transcription and Interturn Continuity Rules

**Effective:** 2026-10-26. **Authority:** Explicit project-owner direction. **Scope:** Every current and future DiceBox Campaign Helper project chat, Codex/Foreman/Worker conversation, and side-campaign chat operating within the project, unless the owner explicitly grants a scoped exception. **Status:** Accepted project-wide workflow rule.

## Purpose and relationship to existing workflows

Preserve the **conversation itself**, not just implementation receipts and end-of-turn summaries. The previously established chronological GitHub handoff/metadata/source workflow remains in force. Add a durable, attributable conversation ledger alongside it: dialogue **before**, **during**, **between**, and **after** development turns must not disappear just because a bounded turn closed. Chat dialogue and inferred history are evidence, **not** an automatic promotion into campaign canon, owner approval, source-of-truth state, or successful Foundry gameplay.

This is a project-wide additive rule. Continue to use applicable established DiceBox PREPARE → RENDER/INSPECT/BUILD → VERIFY → CATALOGUE workflows, current owner exceptions, source authority and one-writer/collision restrictions. It changes **recording**, not permissions to modify a shared world.

## Mandatory operating rules

1. **One ordered conversation transcript per chat.** At the first available point, create or locate an ongoing transcript for that exact conversation, with a stable conversation/workstream identifier, project/campaign, original start date if known, timezone, source URI or immutable identifier when available, transcript version, and initial coverage boundary. Never merge Chat A and Chat B dialogue as though one chat said everything. Keep side-campaign transcripts independent of main-campaign canon.
2. **Capture *all* conversational intervals.** Include every user request, owner decision, correction, approval, clarification, status question, ordinary Q&A, interturn exchange (including conversations after a turn's handoff and before the next "continue" or "resume"), and assistant response that is available for recording. An end-of-turn technical handoff **does not** replace the dialogue transcript. Include meaningful planning, errors, blocked outcomes and final summaries; tool activity may be represented as time-ordered receipt links and concise descriptions, rather than pasted secrets or enormous raw outputs.
3. **Record source fidelity precisely.** For each message/entry record monotonically ordered sequence ID, role/speaker, exact text **only when available verbatim**, available local timestamp with timezone (otherwise `time: unknown`), provenance (`VERBATIM_FROM_VISIBLE_CHAT`, `VERIFIED_PLATFORM_EXPORT`, `RECONSTRUCTED_SUMMARY`, or `GAP_UNAVAILABLE`), development-turn or `BETWEEN_TURNS` label, and related commit/receipt links. Preserve line breaks when practical. Do not fabricate quotes, exact times, unavailable messages, tool output, or message IDs.
4. **Append as conversation proceeds.** After each material exchange, update the transcript at the **next feasible durable-write checkpoint** (prefer every exchange where the repository is accessible). At minimum, commit/push all uncatalogued exchanges **before each bounded-turn closure, handoff, chat switch, major restart or project continuation**. If the chat is only conversational, its dialogue still belongs in the transcript; do not wait for a coding turn. A transcript update can accompany other catalogue work. When durable access is unavailable, explicitly report the gap and carry it forward to the next permitted recovery checkpoint rather than claiming archival success.
5. **Preserve provenance and chronology.** Use append-only segmented files for large conversations, e.g. `campaign-archives/<campaign>/workstreams/<chat>/transcripts/<chat>-conversation-YYYY-MM-DD-partNN.md`, plus an `INDEX.md` with ordered segment ranges and explicit covered/uncovered intervals. For project/noncampaign chats use `docs/conversation-transcripts/<workstream>/<chat>/` or an established equivalent. Each file names the previous/next segment and associated technical handoff. Correct errors with append-only errata or visibly versioned corrections, not silent rewriting or backdating. The segment starts/ends at actual conversation boundaries, *not* just "Turn 12" boundaries.
6. **Maintain a coverage ledger.** Handoffs must state the transcript path/commit, last recorded user and assistant message sequence or stable referent, number/description of any unavailable gaps, and whether the artifact is `COMPLETE_VERBATIM`, `PARTIAL_VERBATIM`, or `RECONSTRUCTION_ONLY`. Never label a reconstructed account a "full transcript". If platform history is partly unavailable, preserve verified messages and explicitly mark each missing interval; do not fill gaps from memory or another chat's narrative as speech.
7. **Catalog and link without canon promotion.** Add a per-turn or per-conversation entry to the chronological log referencing the transcript, source commit, handoff and metadata. For accepted project-wide procedural changes, update the canonical project instruction contract and reproducible knowledge-base delta; for a campaign decision keep the campaign scope. Other chats must read and comply with the latest accepted project rule before performing new substantive work.
8. **Protect private/internal material.** Archive owner-visible messages only in repositories/branches the owner has approved for that workstream. Do not export private chain-of-thought, credentials, tokens, browser cookies, private unrelated chat threads, or raw private tool logs. Redact secrets and document `[REDACTED: reason]` while retaining the audit trail. A user's deletion/privacy request or platform limitation overrides speculative completeness. Preserve exact content of safe user-visible text, with sensitive details minimized.
9. **Verify durable writes.** Do not say "saved" until the file has been committed to the correct repository/branch, pushed when using a local checkout, and reread or exact commit/content path verified. Source tests are not transcription completeness tests. GitHub conflicts or transport timeouts require authoritative receipt/readback before retry; never overwrite another chat's transcript or branch.
10. **Respect explicit owner exceptions.** The owner may direct an exempt conversation or narrower retention. Record the exception, scope and reason without presuming it changes unrelated chats. Transcript creation is not permission to bridge or access another chat whose identity or content cannot be verified.

## Required segment format

```markdown
# <Chat/Workstream> — Conversation Transcript — Part <NN>
Coverage: <start anchor> to <end anchor>
Capture method: <VERIFIED_PLATFORM_EXPORT | VISIBLE_CHAT_PARTIAL | RECONSTRUCTION_ONLY>
Timezone: America/Los_Angeles (exact per-message time only when known)
Technical handoffs: <links>
Uncovered intervals: <explicit gaps or none>

### M0001 · USER · <timestamp or unknown> · BETWEEN_TURNS · VERBATIM_FROM_VISIBLE_CHAT
<safe exact user message>

### M0002 · ASSISTANT · <timestamp or unknown> · BETWEEN_TURNS · RECONSTRUCTED_SUMMARY
<clearly marked summary, not quotation>

### GAP-0001 · GAP_UNAVAILABLE
<which interval is missing; why it cannot be truthfully reconstructed>

### M0003 · ASSISTANT · <timestamp or unknown> · TURN_17 · VERBATIM_FROM_VISIBLE_CHAT
<safe exact assistant message>
```

## Acceptance checklist

A bounded turn or conversational checkpoint can be called **conversation-archived** only when an ordered segment covers new visible dialogue including **interturn material**, a coverage index identifies any gaps, the applicable project/campaign chronology points to it, and GitHub readback verifies its destination. Technical code/test/native Foundry installation acceptance is independent of transcription acceptance.

**Established workflow change:** prior "available-message transcript reconstruction at turn end" is a fallback for old/unavailable history; it is **not sufficient going forward** when exact user-visible messages are available. Use verbatim capture where available and mark reconstruction/gaps honestly.
