-- 2026-10-09 -- User-accepted maximum 20-minute elapsed work turn for DiceBox agents.
-- Additive project-wide governance. Does not change tool runtimes or Foundry permissions.
INSERT INTO kb_sources (
 source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES (
 'S-2026-10-09-DICEBOX-20MIN-TURN-CAP',
 'DiceBox 20-minute maximum work-turn rule',
 'project',
 'All DiceBox Campaign Helper and Codex Foreman user work turns',
 'Explicit user authorization in DiceBox project chat on 2026-10-09: put a 20-minute cap for each turn',
 'active',
 'docs/DICEBOX-20-MINUTE-TURN-CAP-2026-10-09.md',
 '2026-10-09',
 'dicebox-turn-time-cap/20min-v001',
 'User-facing turn time limit and recovery checkpoints; repository instruction guides participating agents. It does not automatically change ChatGPT or Codex host runtime limits.'
);
INSERT INTO kb_decisions (
 decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review
) VALUES (
 'D-2026-10-09-DICEBOX-20MIN-TURN-CAP',
 'DiceBox Foreman bounded time per user turn',
 'Set a 20-minute wall-clock ceiling for each user instruction work turn. Begin work, finish as soon as practical, preserve final minutes for a verified checkpoint and stop at cap even if incomplete. Keep source hashes, persisted commits, tests and untested items, side-effect state, blockers and next action in the handoff. Subsequent user messages start separate budgets. Do not silently run in background or bypass safety gates.',
 'Prolonged multistep execution, bridge interruptions and context compaction can lose user-visible continuity unless important progress is durably catalogued within a bounded time.',
 'project','locked','DiceBox Campaign Helper Foreman','S-2026-10-09-DICEBOX-20MIN-TURN-CAP',NULL
);
INSERT INTO kb_facts (
 fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES (
 'F-2026-10-09-DICEBOX-20MIN-CHECKPOINT',
 'dicebox.governance',NULL,
 'Every DiceBox user work turn caps at twenty minutes with explicit checkpoint',
 'Each participating DiceBox agent must stop at or before 20 minutes elapsed per requested work turn, leaving a reproducible, versioned checkpoint with exact source identity, completed commits, test outcomes, unresolved gates, next action, and any live-side effects. A new user turn starts another 20 minute budget. This does not create background automations or enforce account-wide platform settings.',
 'project','canonical','locked','S-2026-10-09-DICEBOX-20MIN-TURN-CAP',NULL,
 'DiceBox 20 minutes time cap user turn Foreman checkpoint handoff provenance safety'
);
INSERT INTO decisions_fts (decision_id,topic,decision,rationale)
 SELECT decision_id,topic,decision,rationale FROM kb_decisions
 WHERE decision_id='D-2026-10-09-DICEBOX-20MIN-TURN-CAP';
INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts
 WHERE fact_id='F-2026-10-09-DICEBOX-20MIN-CHECKPOINT';
INSERT INTO kb_relationships (relationship_id,from_type,from_id,relation,to_type,to_id,notes)
 VALUES (
 'R-2026-10-09-DICEBOX-TURN-CAP-DECISION',
 'decision','D-2026-10-09-DICEBOX-20MIN-TURN-CAP','governs',
 'fact','F-2026-10-09-DICEBOX-20MIN-CHECKPOINT',
 'Time-bounded checkpoint and explicit resume boundary on every DiceBox project turn'
 );
