# Maintaining creative continuity

This is the operating procedure for keeping The Mysterious Lodge understandable across all future chats. The user-approved story is authoritative; technical implementation and assistant inventions are not canon merely because they appear in code or an earlier summary.

## Starting any replacement conversation

1. Read START-HERE.md and the foundation/repository safety rules. Run the local verifier without --seal; on STOP do not mutate Foundry or rebuild evidence blindly.
2. Read CHANGELOG.md and NEW-CHAT-WORKFLOW.md, then CREATIVE-CANON.md, PUZZLE-ROUTES.md, CURRENT-STATE.json and SESSION-HANDOFF.md. Verify that the exact next-action ID and latest unit match between the JSON and Markdown. Do not treat an installed code change as a gameplay-tested one.
3. In a genuinely new chat, answer COLD-START-EXAM.json without reading its separately stored rubric. The independent Codex CLI partner already passed once; a new chat still needs to orient from the documents.
4. Distinguish owner-approved facts, proposed ideas, recovered implementation, current game/runtime evidence and unknowns.
5. Recover the next small task. Never use the product-wide latest checkpoint as an unconditional campaign pointer.

## When a creative decision is made

Record the owner's exact newly approved idea in CREATIVE-CANON.md only after explicit approval. Add a **new** decision row to DECISIONS.jsonl; never delete the old decision. Each decision must include a stable eventId, date, authority (OWNER_APPROVED, PROPOSED, REJECTED, SUPERSEDED, RECOVERED_IMPL or VERIFIED_RUNTIME), source, affected scenes/items/relationships, the creative purpose/desired player experience, prerequisites and consequences, and the earlier decision it supersedes when applicable.

Never invent a reason when the owner has not specified one. Mark unknown or inference explicitly. Keep the campaign identity and original name Central Lodge; House of the Damned is separate. Record item/puzzle links in PUZZLE-ROUTES.md with which Scene supplies it, where it is used, what gate/result it affects, and whether the connection is only a recovered script or live-tested.

Suggested short decision entry: `{"eventId":"MLODGE-2026XXXX-...","date":"YYYY-MM-DD","authority":"OWNER_APPROVED","scope":"creative","source":"user statement in [specific chat/date]","fact":"...","creativePurpose":"... or UNKNOWN","affectedIds":["E1","M2"],"dependsOn":[],"supersedes":null}`. Entries in the log are JSON objects, one per line, with no commas between lines.

## Closing one bounded work unit

1. Save actual new/source evidence (receipts, tested behaviors and source paths). Append one concise CHANGELOG.md entry when an actual change or confirmed player blocker occurred, with its strongest proven level. Never rewrite the old audit snapshot as if it represented current live state.
2. Append decisions and provenance. Update the appropriate canon and PUZZLE-ROUTES.md only when creative and technical authority permit.
3. Update CURRENT-STATE.json with the exact latest bounded work unit, status, blockers, next actionable unit and evidence receipt.
4. Update SESSION-HANDOFF.md with matching current and next work IDs, the essential newly learned facts and unknowns. Avoid adding another independent 'latest' file.
5. Run `python tools/verify_mysterious_lodge_handoff.py` without --seal; if it reports only expected intentional handoff hash drift, review and then explicitly run `python tools/verify_mysterious_lodge_handoff.py --seal`, followed by a clean non-seal run. Sealing is NOT approval or a way to silence a creative/source conflict.
6. After meaningful approved changes, build a NEW versioned portable ZIP and check its manifest; never overwrite an existing release. Update PORTABLE-HANDOFF.md and CURRENT-STATE.json before sealing and packaging.
7. Follow existing Campaign Helper roadmap/KB/commit/checkpoint/mirror rules at the appropriate coordination boundary without displacing unrelated product work or silently rewriting the global checkpoint.

## Failure and recovery

File missing, changed hash, conflicting canon, missing owner approval or unknown outcome means STOP. Independently inspect original source/runtime and historical receipts; never replay a native Foundry transfer based only on a timeout. A passed read-only candidate exam is not a playtest. The persistent Codex partner's session memory is a convenience, not the project's authority.

## Completion standards

The **handoff system** can be complete with locally sealed records, a separately graded independent candidate recovery, adversarial checks and a portable fallback. **Campaign implementation** is a different milestone: maps, item pickups, railway links, F1/F2, runtime and group playtesting remain open until verified.
