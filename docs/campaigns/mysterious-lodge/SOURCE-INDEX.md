# Source index and provenance

Use the minimum documents necessary; an index is not a replacement for source verification.

## Authoritative creative facts

- Direct owner statement, 2026-10-10, reflected without additions in CREATIVE-CANON.md.
- If earlier imported source material conflicts with this user statement, preserve both and request reconciliation. The owner statement has the higher creative authority.

## Technical evidence (source-recovered, fixture-only)

Root of audit evidence: work/clscale-central-lodge-migration-v001/story-reconstruction-audit-20261010/

- story-audit-continuation-receipt-20261010.json: exact counts, known issues and evidence scope.
- snapshot-provenance.json: at-copy historical hashes for 109 files. **Caveat:** 77 copied LevelDB files no longer match their original hashes or names after analysis, likely due to database compaction/opening. Do not claim the working copy remained byte-immutable. Verify the sealed extracted reports instead.
- full-evidence-catalog.json: complete installed scripts, item IDs, the State Ledger, and Macros. Use this for resolving behavior ambiguities.
- enhanced-puzzle-interaction-audit.json: 96 structured contracts, nonstandard multiline contracts and custom script notes.
- THE-MYSTERIOUS-LODGE-ASSET-AND-PUZZLE-AUDIT.md: first pass, room-by-room; some recovered multiline interactions are absent here and corrected by enhanced audit.
- THE-MYSTERIOUS-LODGE-RECONSTRUCTION-FINDINGS-20261010.md: sourced synthesis, limitations, candidate breaks.
- visual-artwork-file-manifest.json: 26 decodable WebP files and hashes.
- visual-actor-and-asset-inventory.json: Actor/Token, tile and background linkage.
- unparsed-behavior-script-review.md: 35 initially nonstandard behaviors, including ritual and GM pickups.

Supporting technical plans in repository:
- work/clscale-central-lodge-migration-v001/clscale-railway-master-route-manifest-v002.json
- tools/clscale-depot-one-shot-coordinator.mjs
- docs/CL50-RAILWAY-MASTER-MANIFEST-AND-RUNTIME-CLOSURE-2026-10-09.md
- docs/THE-MYSTERIOUS-LODGE-FAST-TRACK-ROADMAP-2026-10-09.md

## Database synchronization evidence

The seed source was updated with `D-MLODGE-HANDOFF-20261010`. The staged rebuild passed integrity and proved exactly three new records with no removed or altered records in any of 10 base tables. Ordinary file replacement failed (WinError32), but a separately rehearsed native SQLite backup operation successfully synchronized the canonical database. Its readback passes `PRAGMA integrity_check=ok` and all 10 base tables match the staged database exactly. The original canonical backup remains preserved. Authoritative completion receipt: `work/clscale-central-lodge-migration-v001/mysterious-lodge-handoff-kb-backup-20261010-v002/sqlite-backup-api-once-receipt.json`. Retain the failed file-replacement receipt as historical evidence, not as the current blocker.

## Fresh-chat recovery verification

The 12 question exam is now candidate-only; its grading rubric is separately stored under work/clscale-central-lodge-migration-v001/cold-start-recovery-20261010/COLD-START-GRADING-RUBRIC.json and must not be supplied to the candidate. COLD-START-TEST.md defines how an independent fresh conversation is graded. Disposable-copied negative tests at work/clscale-central-lodge-migration-v001/cold-start-recovery-20261010/negative-test-receipt.json verify expected STOP on unauthorized canon edits, absent sources, and inconsistent technical counts. Dated portable fallback procedure is in PORTABLE-HANDOFF.md.

## Persistent independent Codex recovery evidence

`CODEX-PARTNER.md` records the exact CLI session UUID and safe PowerShell resume command. The first sourced C01-C12 answers are in `work/clscale-central-lodge-migration-v001/cold-start-recovery-20261010/persistent-codex-partner-first-response.md`; the session rejoin was verified by `persistent-codex-partner-resume-receipt.json`; grader receipt `persistent-codex-coldstart-evaluation.json` records 11/11 critical and 1/1 optional correct, with the explicitly disclosed C07 alternative valid chains. This is not a fifth ChatGPT-app conversation and not Ready-to-Play.

## Continuity closure operations

MAINTENANCE.md defines the forward update procedure for approved creative decisions, source evidence, state and handoff, explicit hash resealing and a NEW versioned portable recovery archive. The system has passed an independently resumed persistent Codex CLI cold start. This does not establish Foundry campaign playability. The continuity closure acceptance record is `work/clscale-central-lodge-migration-v001/cold-start-recovery-20261010/continuity-final-acceptance-receipt.json`.

## N3 dependency closure evidence

`work/clscale-central-lodge-migration-v001/clscale-n3-dependency-audit-20261010.json` and `N3-DEPENDENCY-REVIEW-20261010.md` document the assertion-checked read-only N3 gate review. It recovered nested M2 Founder Portrait and N3 Baggage Locker item grants that were omitted from the 96 top-level parsed contracts; source-confirmed a T3 fragment/N3 branch gate cycle without a validated alternate entrance; and preserved three owner-choice repairs. The depot menu/transfer static mock tests passed 31/31. The historical first-pass audit is not silently rewritten; these documents supersede its two 'missing acquisition' findings.

## Two-stage N3 source patch (owner approved)

`tools/clscale-n3-two-stage-patch.mjs` creates a source-only staged two-behavior manifest from the sealed fixture with original SHA-256 and exact Scene/Region/Behavior IDs. The staged patch is `work/clscale-central-lodge-migration-v001/n3-two-stage-20261010/staged-source-patch.json`. `tests/clscale-n3-two-stage.test.mjs` exercises preliminary unlock, required board and switch, post-T3 final overlay, repeat behavior and source drift. The patch does not move Items, alter Fast Travel preview, install Scene travel or write any Foundry world. Source-only verification and KB promotion are recorded in the `n3-two-stage-20261010` evidence folder.

## External reference methodology

- OpenAI, Harness Engineering: https://openai.com/index/harness-engineering/ (short AGENTS.md index, structured repository knowledge, mechanically checked links).
- Anthropic, Effective Harnesses for Long-Running Agents: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents (initializer, persistent feature list and progress log, verify first, one bounded unit per session).
- GitHub Spec Kit: https://github.github.com/spec-kit/ (separate specification, plan, tasks and implementation evidence).

The sources above establish workflow techniques, not any creative facts about the Lodge.
