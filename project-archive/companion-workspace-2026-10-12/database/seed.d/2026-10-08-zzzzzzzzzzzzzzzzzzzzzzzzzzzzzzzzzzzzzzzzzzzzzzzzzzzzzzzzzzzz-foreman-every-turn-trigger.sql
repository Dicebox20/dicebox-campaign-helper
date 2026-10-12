-- Direct user accepted Foreman operational rule: mandatory verified next-turn partner request.
-- No Bridge/native dispatch results are asserted by this source record.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES ('S-2026-10-07-FOREMAN-EVERY-TURN-TRIGGER',
 'User requires next-turn trigger request to designated Codex partner at every active Foreman turn end',
 'conversation','DiceBox Campaign Helper Foreman continuity and bridge communication',
 'Direct user instruction in exact bound DiceBox Campaign Helper ChatGPT conversation',
 'active','AGENTS.md; docs/FOREMAN-WORKFLOW-CURRENT.md; docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md; docs/CENTRAL-LODGE-ROADMAP.md',
 '2026-10-07','Bridge receipt-first-v1, session ses-82468164-38fe-47f1-a198-eb13aee1cb04, verified current endpoint binding',
 'Rule is a communication duty, not implicit authorization to mutate runtime state or issue a second trigger when one is already pending.');
INSERT OR REPLACE INTO kb_decisions(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES ('D-2026-10-07-FOREMAN-TURN-TRIGGER-ALWAYS',
 'Mandatory same-chat Foreman next-turn trigger request after every active development turn',
 'LOCKED: After each active ChatGPT Foreman development turn, even if the bounded work unit completes early, save a durable checkpoint, verify the exact active Codex partner and Bridge session, and send one native live Bridge message expressly requesting exactly one next-turn continuation of the same ChatGPT conversation when the turn ends and the destination is idle. Reconcile prior receipt-first obligations before sending; an already positive reserved trigger satisfies the duty without another send. On blocked/unknown delivery or a project safety blocker, report truthful blocked delivery and request a wake only when safe; never blindly replay. Do not request turns after completion/disable. The 15-minute ceiling is a maximum duration, not the sole trigger to send.',
 'User explicitly corrected prior behavior where early milestones were checkpointed without asking the connected Codex partner for the next-turn trigger. The prior AGENTS example referenced an obsolete ChatGPT endpoint; now specify the correct current endpoint with mandatory fresh verification.',
 'project','locked','User / DiceBox Foreman','S-2026-10-07-FOREMAN-EVERY-TURN-TRIGGER','At next verified Foreman turn and when Bridge endpoint changes');
INSERT INTO decisions_fts(decision_id,topic,decision,rationale)
 SELECT d.decision_id,d.topic,d.decision,d.rationale FROM kb_decisions d
 WHERE d.decision_id='D-2026-10-07-FOREMAN-TURN-TRIGGER-ALWAYS'
 AND NOT EXISTS(SELECT 1 FROM decisions_fts f WHERE f.decision_id=d.decision_id);
INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES ('F-2026-10-07-FOREMAN-TURN-END-WAKE-CONTRACT',
 'project.foreman.continuation',NULL,
 'Every active Foreman turn ends with a checkpoint and verified Codex next-turn trigger request',
 'For this project, end each active ChatGPT Foreman development turn with a durable checkpoint and one native live message to the exact current Codex partner requesting the next same-ChatGPT-conversation trigger. Reconcile prior reservations or receipts and do not duplicate dispatched or outcome-unknown triggers. Report a blocker on transport failure; do not bypass safety requirements. Legacy older conversation and session IDs in earlier rule snapshots are historical and must not be used as current targets. Foreman may stop when goal completed, user disables it, or a blocker makes immediate wake unsafe.',
 'project','canonical','locked','S-2026-10-07-FOREMAN-EVERY-TURN-TRIGGER',NULL,
 'Bridge Foreman always trigger request end of turn checkpoint native live same chat no duplicates');
INSERT INTO facts_fts(fact_id,title,statement,tags)
 SELECT f.fact_id,f.title,f.statement,f.tags FROM kb_facts f
 WHERE f.fact_id='F-2026-10-07-FOREMAN-TURN-END-WAKE-CONTRACT'
 AND NOT EXISTS(SELECT 1 FROM facts_fts x WHERE x.fact_id=f.fact_id);
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('foreman_turn_end_trigger_rule','MANDATORY_AFTER_EVERY_ACTIVE_TURN; checkpoint -> exact live Bridge Codex message -> one native same-conversation trigger; reconcile first; never duplicates'),
 ('foreman_turn_end_trigger_rule_source','D-2026-10-07-FOREMAN-TURN-TRIGGER-ALWAYS');
