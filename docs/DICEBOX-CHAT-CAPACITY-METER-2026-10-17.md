# DiceBox Chat Capacity Meter and Handoff Trigger — 2026-10-17

**Status:** user-requested workflow addition, recorded on review branch pending normal accepted-change promotion. **Scope:** all DiceBox Campaign Helper development chats, especially substantial >1-step work and scene-injector handoffs. **Purpose:** reduce chat truncation and connection-related continuity loss. **Not** a Foundry authorization change, product-stage promotion, or replacement for the accepted 20-minute turn cap.

## Mandatory display at checkpoints

Add a compact line to meaningful project progress checkpoints, at the end of substantial work and before a handoff:

`Chat capacity: [??????????] N/A% (actual context fill unavailable)  |  Continuity risk: LOW/MODERATE/HIGH  |  Handoff: up to date / due`

If **both** (a) measured consumed/current context tokens and (b) verified applicable model context-window capacity are available from authoritative platform telemetry, compute `100 * used_tokens / context_capacity_tokens`, clamp to 0..100 and round to nearest whole percent. Render a ten-cell bar and label `MEASURED`, with source/time/assumptions. If either is unavailable, never display a fake precise number. Use `[??????????] N/A%` (not `0%`) and the qualitative continuity-risk status instead. **Do not use message count, total output words, generic model windows, account usage percentages, or tool-budget numbers as context-window telemetry.** If an explicitly requested proxy estimate is ever shown, label both its method and its non-comparability to actual context fill.

Examples:
- Trustworthy telemetry: `Chat capacity: [███████□□□] 72% (measured, model telemetry) | Risk: MODERATE | Handoff: due`
- No telemetry: `Chat capacity: [??????????] N/A% (unavailable) | Risk: HIGH (long/compacted history) | Handoff: ready`

## Risk and action thresholds

For **verified measured fullness only**:
- `under 60%`: normal work and checkpoints.
- `60–74%`: update durable active objective/receipt and recommend a checkpoint if substantive work remains.
- `75–84%`: generate/refesh a new-chat handoff proactively; avoid launching large uncheckpointed stages.
- `85–94%`: recommend immediate next-chat transition, verify all assets persisted before further costly calls.
- `95–100%`: prioritize durable handoff and safe stop; avoid new complex work.

For **unknown percent**, risk is independent: `LOW` for small, self-contained tasks with full current evidence; `MODERATE` for many assets/turns or active multi-step changes; `HIGH` for visible conversation compression/omitted context, known interruptions, long-running incomplete work, unresolved authority or an explicit new-chat handoff request. HIGH means checkpoint and offer new-chat continuation **even when % is N/A**. Never present a risk category as a quantitative percentage.

## Handoff minimums and gates

Each handoff preserves objective; repo/branch/commit; accepted vs proposed decisions; source filename/hash; current pipeline gate; artifact links or Library paths; passes, fails and unrun tests; exact runtime/world authorization; no-write/partial-write status; blockers and next reproducible action; relevant user visual acceptance; communication mirror/KB synchronization state. Store in dated `handoffs/<date>-.../START-HERE.md` with hashes and rereread on GitHub, and preview in Library when useful. Preserve existing versioned evidence rather than overwriting it. No unscheduled background work. A new chat must reconsult canonical `main`, stage machine, and read-only DB before resuming.

**20-minute rule remains independent:** after each user request, stop/checkpoint by accepted 20-minute limit regardless of %; conversely, a high measured fullness or missing context can require an earlier handoff.

**User authority:** requested a "chat % filled meter" and a new chat handoff, 2026-10-17. This rule improves presentation and continuity, does not claim ChatGPT actually exposes fullness telemetry or let a model inspect hidden context allocation.