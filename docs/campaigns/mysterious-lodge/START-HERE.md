# The Mysterious Lodge: start here (ChatGPT / Codex handoff)

This is the ONE entrance to this campaign's continuity. Original name: **Central Lodge**. **House of the Damned is another campaign.** Do not derive campaign facts from product-wide checkpoint recency, chat memory, or similarly named projects.

**Purpose:** finish the existing 21-Scene Foundry campaign while protecting the owner's creative intent, recovered puzzle logic, player characters, and test-world data.

**Practical change history and handoff:** Read [CHANGELOG.md](CHANGELOG.md) for what actually changed and its proof level, then [NEW-CHAT-WORKFLOW.md](NEW-CHAT-WORKFLOW.md) for a short playtest-first startup and closeout. They are a lightweight index over the existing rules, not new automation or permission to resume paused Foundry work.

## On arrival, in this order

1. Locate the DiceBox Campaign Helper repository and load its root AGENTS.md and docs/FOREMAN-WORKFLOW-CURRENT.md. The campaign files here supplement, but do not override, the project's safety and implementation rules.
2. Run the local read-only verification: python tools/verify_mysterious_lodge_handoff.py (from repository root). A fresh ordinary ChatGPT chat must connect to Desktop Commander or receive the relevant files; it does NOT automatically read local AGENTS.md.
3. Read CHANGELOG.md, NEW-CHAT-WORKFLOW.md, CREATIVE-CANON.md, PUZZLE-ROUTES.md, CURRENT-STATE.json, and SESSION-HANDOFF.md. Read only the detailed audit evidence needed for the specific question. Run the candidate-only COLD-START-EXAM.json and cite paths and specific headings/fields; do not read the separate examiner grading rubric before submitting answers.
4. Independently reconcile actual Git, files and Foundry runtime before changing anything. Compare the current campaign state with the last campaign-specific record; the project-wide outputs/LATEST-FOREMAN-CHECKPOINT.json can belong to a different product or workstream.
5. Report back: (a) story/ending and what is undecided, (b) 2-3 example puzzle links, (c) latest verified implementation status, (d) unknowns/conflicts, (e) exact next safe unit. Treat an incomplete self-check as STOP for mutation.

## Authority and update discipline

- **Owner-approved canon** = user explicitly established the creative fact. Canon changes need a fresh user decision. Assistant-generated plot flavor or a recovered script can be PROPOSED / RECOVERED_IMPL, never silently OWNER_APPROVED.
- **Recovered implementation** = what the exact source or frozen test copy demonstrates, NOT proof a player can reach it. Source scripts, counts, and art files should carry paths and evidence level.
- **Live Foundry truth** = actual authorized GM/player runtime reread. Never label a source/static test Ready-to-Play.
- **Unknown** must stay unknown, not guessed. Record contradictions and superseded ideas in DECISIONS.jsonl, without erasing old entries.
- Read-only startup/research is fine. A live write requires the existing world-target, backup, owner-consent, active-GM, single-writer, exact Region landing, and no-retry safety gates.
- One small unit at a time, ~15-minute development cap. Close with an updated campaign-specific SESSION-HANDOFF.md and CURRENT-STATE.json, relevant evidence and hashes, and existing project checkpoint procedure where authorized. Do not overwrite global latest checkpoint solely to preserve campaign continuity.

## Navigational sources

- CREATIVE-CANON.md: user-authored premise, what must not be embellished as established fact.
- PUZZLE-ROUTES.md: source-recovered puzzles, cross-scene dependencies, missing links.
- CURRENT-STATE.json: machine-readable scoped status, next work and blockers.
- SESSION-HANDOFF.md: compact latest campaign continuation.
- DECISIONS.jsonl: chronological source and authority labels.
- COLD-START-EXAM.json: candidate-only recovery questions, without the answer key.
- COLD-START-TEST.md: new-chat test protocol and independent evaluator instructions.
- CODEX-PARTNER.md: exact persistent Codex CLI partner session ID, read-only resume command and verified recovery test.
- MAINTENANCE.md: how each future chat records an approved creative idea, source changes, exact next action and a refreshed versioned portable backup.
- PORTABLE-HANDOFF.md: dated ZIP fallback when the machine is disconnected.
- SOURCE-INDEX.md: exact source files and research methods.
- Recovered full data: work/clscale-central-lodge-migration-v001/story-reconstruction-audit-20261010/
- Prior road map: docs/THE-MYSTERIOUS-LODGE-FAST-TRACK-ROADMAP-2026-10-09.md

## Chat starter (paste into a fresh normal chat)

Continue **The Mysterious Lodge, formerly Central Lodge**, NOT House of the Damned. Via Desktop Commander, open `C:\Users\rujie\Documents\Codex\2026-08-20\dicebox-campaign-helper\docs\campaigns\mysterious-lodge\START-HERE.md` in my local DiceBox Campaign Helper repository. Run tools/verify_mysterious_lodge_handoff.py read-only, read the linked creative canon and current state, and answer the cold-start exam. Report confirmed/unknown/conflicting context BEFORE making changes. Follow existing safety gates; do not assume the global checkpoint belongs to this campaign. Resume the next explicitly verified bounded unit.

If Remote Desktop Commander cannot access this repository, ask the user for the dated ZIP referenced in PORTABLE-HANDOFF.md and mark all current runtime/KB checks NOT VERIFIED. This is context recovery only; no live world changes may follow from an offline bundle.

This protocol follows source-of-truth + small index from OpenAI's Harness Engineering, feature/progress reorientation from Anthropic's long-running agent harness, and spec/plan separation from GitHub Spec Kit. It is a local campaign-specific adaptation, not a vendor-installed automatic feature.
