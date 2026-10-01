# DiceBox Campaign Helper fast-track release slice

Date: 2026-09-06
Owner: DiceBox Campaign Helper Foreman
Status: preparation authorized; implementation and live creation remain gated

## Purpose

Shorten the path to a useful first release by treating the current Signal/Rune work as one bounded vertical slice instead of a long chain of unrelated micro-milestones. This plan changes scheduling and release scope only. It does not relax the exact active-GM, Foundry target, package ownership, foreign-state preservation, approval, authoritative-reread, timeout-as-unknown, or no-arbitrary-execution requirements.

## First release acceptance

The first release slice is complete only when all of the following are evidenced:

1. The exact `dbx-test-world` / Foundry `14.367` / dnd5e `5.3.3` target is current.
2. A user-provided `Gamemaster` session is manually entered with a blank password and reread as `[GM]`.
3. The reviewed Signal and Rune candidate package passes source, staged, installer, worker, adapter, runtime, and RuntimeProfile/profile-diff gates.
4. One fixed approval envelope produces a preview for the two fresh package-owned Scene candidates.
5. Any live creation is explicitly approved, uses only the fixed allowlist, preserves the two existing foreign Scenes, and is followed by an authoritative reread.
6. The receipt records exact hashes, target/profile identity, approval, writes, unknowns, recovery disposition, and what the evidence does not prove.

Tram, Core, broad campaign compilation, player-facing behavior, image-provider benchmarking, and full release hardening remain post-slice work. They are not silently marked complete.

## Parallel M1142 audit bundle

All three packets are read-only and consume the already-authorized M1142 boundary. They may run in parallel because their file scopes and outputs are disjoint. The Foreman merges their receipts before selecting any live step.

### Packet A — package and installer identity

- Model route: Terra Extra High for repository exploration; Luna Extra High for exact hash extraction.
- Inspect the M1141 candidate source, compiler exports, package manifest, module bootstrap, stage/update ownership lists, and existing canonical artifact specification.
- Produce exact source hashes, ownership map, staged-parity inputs, and any installer/verifier drift.
- Stop on missing ownership, stale reviewed source, or hash ambiguity.

### Packet B — worker, adapter, and runtime profile

- Model route: Sol Medium only if the profile contract is ambiguous; otherwise Luna Extra High.
- Inspect the RuntimeProfile/profile-diff implementation, current Foundry fixture profile, adapter/runtime fingerprint evidence, and expected-versus-installed worker/adapter hashes.
- Produce a typed profile-diff result and classify every missing or drifted field.
- Do not restart Foundry, invoke the browser, inspect raw LevelDB, or create runtime documents.

### Packet C — candidate and promotion boundary

- Model route: Terra High for cross-file reconciliation; Luna Extra High for receipt replay.
- Replay the M1141 candidate preview and compare its approval/reread/no-write boundary with the Stage 9 artifact and promotion contracts.
- Produce the exact live-creation blocker or approval boundary; no payload, RuntimeBinding, IR, proposal, or dispatch artifact may be created.

## Merge and live sequence

1. Foreman reviews all three receipts and reconciles them with the read-only KB.
2. If any packet reports drift or incomplete evidence, create one narrow repair bundle; do not start live work.
3. If all gates are clean, authorize one combined fixture preparation/restart/manual `Gamemaster` login/preview observation for the release slice.
4. Only after preview approval and current reread may the exact live creation step be considered.
5. Stop after the first ambiguous outcome, same-class second failure, target/profile drift, foreign-state mismatch, or missing authoritative reread.

## Evidence labels and boundaries

Research findings remain `research`; repository results are `local`; staged package results are `staged`; Foundry observations are `fixture`. No label upgrades another layer. A successful transport response, parser, hash comparison, preview, or test does not certify live creation or Ready-to-Play.

## Research basis

- OpenAI's Symphony treats the issue tracker as the control plane, dispatches unblocked work into isolated workspaces, and reports a 500% increase in landed pull requests on some teams: https://openai.com/index/open-source-codex-orchestration-symphony/
- The AWS Codex agent-team sample requires explicit file scopes, acceptance criteria, verification commands, and a review pass before merging parallel work: https://github.com/aws-samples/sample-codex-agent-team
- A community Codex workflow report describes narrow one-task sessions with concise handoffs and substantially more predictable throughput; this is anecdotal evidence, not a project guarantee: https://www.reddit.com/r/codex/comments/1v1o463/i_drastically_reduced_my_codex_quota_usage_by/
- A Unity/Codex case study reports a one-month soft launch after moving from agent delegation to specification-driven development, fixed `AGENTS.md` assumptions, and a playable minimum: https://developers.cyberagent.co.jp/blog/archives/61930/
