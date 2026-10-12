-- CL13 The Seventh Winter: user-approved 2026-10-08 M1 clock authoring.
-- Append once to database/seed.sql after accepted roadmap and checklist recording.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('SRC-2026-10-08-CL13-SEVENTH-WINTER-APPROVED',
'User-approved Central Lodge M1 The Seventh Winter 4:35 design',
'conversation','campaign','Explicit user approval in connected Foreman conversation','active',
'docs/CENTRAL-LODGE-ROADMAP.md','2026-10-08','CL13-Seventh-Winter-v001',
'The newly authored grandfather-clock solution supersedes only the prior absence of a numeric clock choice, not the validity of older genealogy/grave story facts. No live Foundry behavior is claimed.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_decisions(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review) VALUES
('D-2026-10-08-CL13-SEVENTH-WINTER-0435','central-lodge-m1-grandfather-clock',
'User approves M1 grandfather-clock fixed answer 4:35. After Silver Family Emblem insertion, the hour hand points to IV from the fourth/youngest inheriting family heir in U1 records; the minute hand points to VII from 1431 DR to 1438 DR patriarch/matriarch grave chronology in E4 (seven-year interval = 35 minutes). Wrong entries never consume Items or softlock. Correct solution enables puzzles.m1.clockSettingResolved using only a reviewed authoritative writer. Existing separate Family Reliquary Key and Brass Baggage Token pickups remain gated; never auto-award or edit their source. Add clues to existing U1/E4 context without altering art/topography or other story states.',
'The user explicitly approved a fixed Resident Evil-style, multi-room genealogy and graveyard puzzle with the proposed answer and clues in this conversation.',
'campaign','locked','campaign author','SRC-2026-10-08-CL13-SEVENTH-WINTER-APPROVED',
'After canonical chronology/source collision check and guarded runtime validation')
ON CONFLICT(decision_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags) VALUES
('F-2026-10-08-CL13-SEVENTH-WINTER-AUTHORED','central-lodge',NULL,
'Newly accepted 4:35 grandfather-clock puzzle',
'User-authorized new authored solution 4:35, not a previously recovered clock-hand literal. M1 clock setting Region 3tIrR12uv8ppFkOb is present and empty as of exact Foundry v14.367 read-only inspection; M1 emblem and two downstream gated reward pickup behaviors remain present. U1 Family Records and E4 Graveyard Scenes have existing narrative discovery RegionBehaviors. New 1431 DR and 1438 DR dates and fourth-heir family detail require preserving original narrative evidence and a no-conflict check; user real-player acceptance is reserved until campaign final test.',
'campaign','created_document','locked','SRC-2026-10-08-CL13-SEVENTH-WINTER-APPROVED','m1,clock,puzzle,4:35')
ON CONFLICT(fact_id) DO NOTHING;

INSERT INTO kb_open_items(item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id) VALUES
('O-2026-10-08-CL13-CLOCK-RUNTIME-PREVIEW','implementation',
'Authoritative 4:35 M1 clock behavior and U1/E4 clue integration',
'The design is accepted but no M1 Clock Setting handler is installed; old kernel observes/gates only under primary active GM and current Assistant Gamemaster is also an authorized executor. A safe one-writer protocol and stable clue delivery must be established.',
'Complete versioned source contract, PREVIEW, one guarded APPLY, independent FINAL VERIFY, and final user-run gameplay acceptance. Reject duplicate event/Actor writes; preserve existing pickup and region behaviors and exact stack baseline.',
'Exact source/hash/target/GM routing evidence, source-destination author chronology check, item and ledger regression, no-surprise clue delivery and no-softlock deterministic offline tests.',
'P1','in_progress','DiceBox Campaign Helper Foreman','SRC-2026-10-08-CL13-SEVENTH-WINTER-APPROVED')
ON CONFLICT(item_id) DO NOTHING;

INSERT INTO decisions_fts(decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions
WHERE decision_id='D-2026-10-08-CL13-SEVENTH-WINTER-0435'
AND NOT EXISTS(SELECT 1 FROM decisions_fts WHERE decision_id='D-2026-10-08-CL13-SEVENTH-WINTER-0435');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-08-CL13-SEVENTH-WINTER-AUTHORED'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL13-SEVENTH-WINTER-AUTHORED');
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
WHERE item_id='O-2026-10-08-CL13-CLOCK-RUNTIME-PREVIEW'
AND NOT EXISTS(SELECT 1 FROM open_items_fts WHERE item_id='O-2026-10-08-CL13-CLOCK-RUNTIME-PREVIEW');
