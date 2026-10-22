-- 2026-10-22 owner-approved permanent universal DiceBox image-map prompt authoring constraint.
-- This strengthens existing clean restart and inclusion-only rules; no assertion of image cache cause.
INSERT INTO kb_sources (source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES (
 'S-2026-10-22-MAP-PROMPT-SINGLE-USE',
 'Owner lock: all consecutive map prompts use distinct wording',
 'project','All DiceBox maps and visual generation providers',
 'Explicit owner instruction of 2026-10-22 following repeated failed Foyer and Art Studio generation',
 'active','docs/DICEBOX-UNIVERSAL-REPRESENTATIVE-WALL-BATTLEMAP-STANDARD-2026-10-22.md',
 '2026-10-22','dicebox-map-prompt-single-use/v1',
 'Owner suspects cache/prompt blending; underlying cause is unproven. This is a creative authoring guard, not a cache-purge mechanism.'
);
INSERT INTO kb_decisions (decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review) VALUES (
 'D-2026-10-22-MAP-PROMPT-SINGLE-USE',
 'Permanent unique wording for every consecutive DiceBox map prompt',
 'Every map image generation prompt is independently authored using accepted Blueprint and visible render-layer feature manifest; do not repeat preceding image prompt language, copy style boilerplate, or use substitute-the-room-name templates. The image provider only receives positively specified elements intended on that map. Failed prompts/images remain historical evidence and never become reference input for rework.',
 'Prevent cross-scene instruction carryover and prompt drift under the owner-authorized workflow, without claiming that undocumented model cache behavior has been proven.',
 'project','locked','DiceBox Campaign Helper project owner','S-2026-10-22-MAP-PROMPT-SINGLE-USE',NULL
);
INSERT INTO kb_facts (fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES (
 'F-2026-10-22-MAP-PROMPT-UNIQUE',
 'dicebox.image-generation',NULL,'All consecutive map prompts are single-use',
 'Every prompt is a fresh single-use scene authorization list with materially distinct descriptive language while preserving identical accepted spatial facts/style and mandatory features. Repeated language is prohibited as project policy; no empirical internal image model cache diagnosis or reset capability is asserted.',
 'project','canonical','locked','S-2026-10-22-MAP-PROMPT-SINGLE-USE',NULL,
 'map prompting unique language single use inclusion only clean restart render scene'
);
INSERT INTO decisions_fts (decision_id,topic,decision,rationale)
 SELECT decision_id,topic,decision,rationale FROM kb_decisions WHERE decision_id='D-2026-10-22-MAP-PROMPT-SINGLE-USE';
INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-22-MAP-PROMPT-UNIQUE';
