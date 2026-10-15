-- User-accepted 2026-10-15 update: retire old hidden Region behavior ban.
-- Older local snapshots labeled this F-855 / D-393; current canonical main
-- assigns those identifiers to unrelated entries. Do not touch them.
-- This decision does not certify live Region behavior in any particular world.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('SRC-2026-10-15-REGION-HIDDEN-RULE-RETIREMENT',
 'Explicit user retirement of outdated hidden Region behavior prohibition',
 'conversation','global','explicit user instruction','accepted',
 'DiceBox Campaign Helper conversation 2026-10-15',
 '2026-10-15',NULL,
 'User reports recent update corrected hidden=true RegionBehavior limitation; no new live canary supplied.');

INSERT INTO kb_decisions
(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES
('D-2026-10-15-REGION-HIDDEN-BLANKET-RULE-RETIRED',
 'Foundry hidden Regions and functional Region behaviors',
 'Retire the universal rule that hidden=true prevents RegionBehavior execution. Do not automatically reject or unhide functional Regions solely due to that historic claim. Hidden Regions are permitted design candidates, subject to exact-version runtime verification.',
 'Explicit user correction on 2026-10-15 supersedes earlier generic guidance; historical observations retain their provenance and are not current universal rules.',
 'global','locked','DiceBox Campaign Helper Foreman',
 'SRC-2026-10-15-REGION-HIDDEN-RULE-RETIREMENT',NULL);

INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-15-REGION-HIDDEN-BLANKET-RULE-RETIRED',
 'foundry',NULL,'Retired blanket hidden Region behavior-deactivation assumption',
 'The old claim that Foundry hidden=true necessarily disables a functional RegionBehavior is no longer accepted. Confirm behavior on the actual version/system/module/world and verify events, permissions, and authoritative reread; no current live canary is claimed.',
 'global','created_document','active',
 'SRC-2026-10-15-REGION-HIDDEN-RULE-RETIREMENT',NULL,
 'region,hidden,regionbehavior,accepted-correction,runtime-check');

INSERT INTO kb_relationships
(relationship_id,from_type,from_id,relation,to_type,to_id,notes)
VALUES
('R-2026-10-15-REGION-HIDDEN-USER-DECISION',
 'source','SRC-2026-10-15-REGION-HIDDEN-RULE-RETIREMENT','supports',
 'decision','D-2026-10-15-REGION-HIDDEN-BLANKET-RULE-RETIRED',
 'User-authorized removal of obsolete blanket rule'),
('R-2026-10-15-REGION-HIDDEN-DECISION-FACT',
 'decision','D-2026-10-15-REGION-HIDDEN-BLANKET-RULE-RETIRED','governs',
 'fact','F-2026-10-15-REGION-HIDDEN-BLANKET-RULE-RETIRED',
 'Do not impose hidden=false without actual versioned evidence');
