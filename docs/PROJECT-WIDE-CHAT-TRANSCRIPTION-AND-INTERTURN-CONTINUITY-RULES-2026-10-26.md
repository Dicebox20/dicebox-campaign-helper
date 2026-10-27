# DiceBox Project-Wide Chat Transcript Rule

**Owner refinement: 2026-10-26. Applies to all DiceBox Campaign Helper project chats unless the owner explicitly says otherwise.**

## Simple procedure

Each chat keeps **one continuously updated transcript document**. Between development turns, append the conversation that has occurred since the last update to that same document. Use the existing chat-specific archive location, for example:

`campaign-archives/cabin-in-the-ashen-veil/workstreams/chat-b/transcripts/chat-b-conversation-2026-10-26-part01.md`

The document can have a stable generic name for new chats; existing transcript documents need not be renamed. **Do not create a new transcript, segment, index, formal handoff, or separate metadata file for every turn or conversation exchange.** An old index or earlier segment may remain for historical reference, but it is not a required part of the routine.

Update the transcript at the ordinary **between-turn checkpoint**, including any user questions, corrections, approvals, and assistant replies since the previous update. If no technical development turn happens, continue using the same transcript document at the next reasonable checkpoint. Ordinary development handoffs, technical logs and Git receipts still follow their established workflow; the transcript itself is a simple living document, not another engineering deliverable.

Copy visible conversation faithfully and in chronological order when available. For unavailable older messages, summarize only with an explicit `RECONSTRUCTED` or `UNAVAILABLE` label; never invent quotations, exact timestamps, message IDs or claims of completeness. Record a date/time only when actually verified. Do not archive private reasoning, credentials or unrelated chat content. Keep each chat's dialogue distinct and preserve side-campaign boundaries.

Save the updated document in the approved repository/workstream and verify the GitHub update before reporting that it is saved. If repository access is unavailable, retain the pending addition as part of the next checkpoint; do not claim it was committed. There is no requirement to run a separate source test or create a new receipt solely to prove a transcript append.

## Relationship to other rules

This is an **explicit owner-authorized simplification** of the earlier detailed rule adopted on 2026-10-26. It supersedes that rule's requirements for per-segment indexing, per-exchange updates, handoff-specific transcript metadata, and elaborate sequence bookkeeping. The original rule remains visible in Git history. Its useful principles—accurate dialogue, chronological continuity, privacy and honest provenance—remain.

This change does **not** alter which chat may edit which Foundry Scene, the 25-minute development-turn limits, or the existing campaign implementation and verification workflows.
