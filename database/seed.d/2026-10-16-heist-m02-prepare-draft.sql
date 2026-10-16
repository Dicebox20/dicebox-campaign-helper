-- Kurth Tower Reception M02 planning intake: explicitly not a live Foundry or gameplay acceptance receipt.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('SRC-2026-10-16-HEIST-M02-PREPARE',
 'Kurth Tower Reception M02 PREPARE design candidate and M01 player usability report',
 'conversation','project','current user continuation and earlier accepted six-map sequence','recorded',
 'handoffs/2026-10-16-kurth-tower-reception-m02/PREPARE.md',
 '2026-10-16','kurth-heist-m02-prepare/v1',
 'M01 Dark Arch user says it works well enough for current play. This is player-reported usefulness, not a Foundry runtime VERIFY receipt. M02 six-map order was already agreed; credential obstacle and initial room layout are explicitly a draft proposal for Sarmenti.');
INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-16-HEIST-M02-PREPARE-DRAFT',
 'scene',NULL,'Kurth Tower Reception M02 PREPARE draft with three connected infiltration routes',
 'Kurth Tower Reception is scene 2/6 after Dark Arch M01 and before Security Machinery M03 in a Luskan Closeguard Island Acquisitions Incorporated vault heist; it spotlights Sarmenti and credential/social engineering. Proposed 40x24 battlemap-120/4800x2880 gridless scene connects public guarded entry, north records office inspector bypass and south staff service bypass to a physically post-checkpoint M03 stair/lift exit. Credential purpose/sponsor/clearance proposal allows diverse player solutions and non-permanent failure; zero discovery Regions, GM-controlled NPCs, Jim non-mechanical. PREPARE_DRAFT_REVIEW only; geometry, art, native Regions, runtime world binding and actual Foundry Scene unverified.',
 'project','local','provisional',
 'SRC-2026-10-16-HEIST-M02-PREPARE',NULL,
 'kurth-tower,m02,scene-prepare,proposed,heist,sarmenti,not-ready');
