-- 2026-10-16 user-accepted DiceBox Scene Injector V2.1 Beta creative workflow.
-- Add new geometry-first gate; preserve BUILD artifact v2 and historic v2 evidence.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('SRC-2026-10-16-SCENE-INJECTOR-V2-1-BETA',
 'User acceptance of Scene Injector V2.1 Beta and restart of Dark Arch from PREPARE',
 'conversation','global','explicit current user instruction','accepted',
 'DiceBox Campaign Helper conversation 2026-10-16',
 '2026-10-16','dicebox-scene-injector-workflow/v2.1-beta',
 'The workflow consists of Geometry, Embossed Grayscale, and Painterly Render with stage-specific inspections. Existing BUILD contract v2 remains unchanged. The user ordered Dark Arch M01 to restart from PREPARE.');

INSERT INTO kb_decisions
(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES
('D-2026-10-16-SCENE-INJECTOR-V2-1-BETA',
 'DiceBox Scene Injector V2.1 Beta accepted creative workflow',
 'Use PREPARE then explicitly authored and validated geometry, then embossed grayscale render and structural inspection, then painterly render and final inspection. Preserve geometry/Feature Manifest as authority, forbid prompt carryover on REDO, and continue with the existing single-Markdown/single-JavaScript BUILD contract v2 and Foundry safety gates. Restart Dark Arch M01 from PREPARE; no rejected render or graybox becomes approved geometry merely because it exists.',
 'Multiple Dark Arch render candidates failed actual bridge bypass connectivity, introduced baked skiffs and visible grids, or repeated failed compositions. Geometry validation must precede artistic generation, while preserving all previously accepted contracts.',
 'global','locked','DiceBox Campaign Helper Foreman',
 'SRC-2026-10-16-SCENE-INJECTOR-V2-1-BETA',NULL);

INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-16-SCENE-INJECTOR-V2-1-BETA',
 'scene',NULL,'Scene Injector V2.1 Beta geometry-first three-stage creative rendering',
 'On 2026-10-16 the user accepted Scene Injector V2.1 Beta: PREPARE, GEOMETRY + geometry inspection, EMBOSSED GRAYSCALE + structural inspection, PAINTERLY + final inspection, and unchanged BUILD v2. Dark Arch M01 restarts at PREPARE; no Scene is approved, installed, or player-tested by that acceptance.',
 'global','created_document','active',
 'SRC-2026-10-16-SCENE-INJECTOR-V2-1-BETA',NULL,
 'scene-injector,v2.1-beta,geometry,grayscale,painterly,prepare,workflow');

INSERT INTO kb_relationships
(relationship_id,from_type,from_id,relation,to_type,to_id,notes)
VALUES
('R-2026-10-16-SCENE-INJECTOR-SOURCE-DECISION',
 'source','SRC-2026-10-16-SCENE-INJECTOR-V2-1-BETA','supports',
 'decision','D-2026-10-16-SCENE-INJECTOR-V2-1-BETA','User acceptance'),
('R-2026-10-16-SCENE-INJECTOR-DECISION-FACT',
 'decision','D-2026-10-16-SCENE-INJECTOR-V2-1-BETA','governs',
 'fact','F-2026-10-16-SCENE-INJECTOR-V2-1-BETA','Workflow Beta acceptance, not runtime certification');
