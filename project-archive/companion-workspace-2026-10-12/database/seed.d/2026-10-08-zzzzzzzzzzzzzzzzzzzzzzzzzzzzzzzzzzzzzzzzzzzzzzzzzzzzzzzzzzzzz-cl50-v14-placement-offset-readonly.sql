-- CL-50 read-only exact v14.367 placement/offset behavior evidence.
-- No live Foundry mutation, no install, no rerun of blocked Bridge/database verifier.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CL50-V14-PLACEMENT-OFFSET-READONLY',
 'Foundry v14.367 RegionDocument ephemeral placement offset and teleport batch semantics',
 'verification','Central Lodge CL-50 source-only cross-Scene transfer placement contract',
 'Exact live authorized Foundry 14.367 RegionDocument spawnTokens(create:false) two-sample readback plus official Foundry v14 API docs',
 'active',
 'docs/CL50-V14-PLACEMENT-OFFSET-SEMANTICS-READONLY-2026-10-07.md; work/foundry-playwright-harness/cl50-placement-options-readonly-v001.page.js; https://foundryvtt.com/api/classes/foundry.documents.RegionDocument.html; https://foundryvtt.com/api/v14/functions/foundry.documents.modifyBatch.html',
 '2026-10-07','exact Foundry 14.367 dnd5e 5.3.3; T2 Mouth B Scene ez9MSQ8QIO4cW6zo Region OOmnx3XAmw95E410; noWrite',
 'No teleport invoked, no Region or Token persisted. Limited two-sample behavior is observation, not an absolute concurrency guarantee.');
INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CL50-PLACEMENT-OFFSET-NOT-PINNED',
 'campaign.central-lodge.routes',NULL,
 'Foundry v14.367 RegionDocument offset is not a proven fixed teleport-coordinate contract',
 'Exact no-write live tests on T2 Mouth B ephemeral target Region x3560/y1230/w300/h360: two repeats of center no offset and center with offset (+120,0)/(-120,0) all returned top-left (3650,1350), indicating offset did not alter center placement. Relative placement without offset threw Relative placement requires an offset. Two identical relative placement calls with offset (+120,0) returned top-left (3604,1452) and (3690,1232). Random no-snap returned (3579,1308) and (3774,1293). Temporary Token/Region objects were not persisted. Live RegionDocument spawnTokens(create:false) and teleportTokens independently call private getTokenDestinations, and teleportTokens uses foundry.documents.modifyBatch for create/delete, as seen in earlier exact runtime readback. Official v14 docs describe offset as relative and avoidOccupied for random snap placement; modifyBatch provides batched sequential modifications with cancellation on a failed operation, but does not inherently guarantee no Wall/puzzle Region/occupancy conflicts or authorized player consent. Frozen R1 handler still samples then separately recalculates teleport destination, cannot be promoted.',
 'campaign','local','active','S-2026-10-07-CL50-V14-PLACEMENT-OFFSET-READONLY',NULL,
 'CL50 v14 teleport RegionDocument relative placement offset two-run readOnly not pinned');
INSERT INTO facts_fts(fact_id,title,statement,tags)
 SELECT f.fact_id,f.title,f.statement,f.tags FROM kb_facts f WHERE f.fact_id='F-2026-10-07-CL50-PLACEMENT-OFFSET-NOT-PINNED'
 AND NOT EXISTS(SELECT 1 FROM facts_fts ff WHERE ff.fact_id=f.fact_id);

INSERT OR REPLACE INTO kb_trials(trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id) VALUES
('TR-2026-10-07-CL50-V14-PLACEMENT-MODE-OBSERVATION',
 'central-lodge.CL50',
 'Previously staged R1 handler assumes preflight ephemeral sample and subsequent teleport will use the same safe landing, but documented placement/offset semantics do not guarantee pinned coordinates.',
 'Compare center no offset, center with positive/negative offset, relative with/without offset, and random placement using exactly the same temporary Region and 1x1 Token at Foundry v14.367 with create:false; execute two repetitions per case.',
 'The documented offset is relative, center tests ignored the tested offsets, relative required offset and nevertheless returned two different locations for the same input. The teleport path recomputes destination separately.',
 'Do not use offset as fixed absolute landing. Require independently reviewed fixed-coordinate transactional alternative with body-sized geometry, occupancy race, authority, client consent, recovery and GM/player canary, or use manual GM navigation.',
 'PASS_READONLY_OBSERVATION_NO_INSTALL',
 'S-2026-10-07-CL50-V14-PLACEMENT-OFFSET-READONLY');
INSERT INTO trials_fts(trial_id,area,symptom,attempted_approach,failure_cause,correction)
 SELECT t.trial_id,t.area,t.symptom,t.attempted_approach,t.failure_cause,t.correction FROM kb_trials t
 WHERE t.trial_id='TR-2026-10-07-CL50-V14-PLACEMENT-MODE-OBSERVATION'
 AND NOT EXISTS(SELECT 1 FROM trials_fts tt WHERE tt.trial_id=t.trial_id);

UPDATE kb_open_items SET
 next_action='Live no-write v14.367 offset behavior proves neither center offset nor relative placement is a reliable fixed absolute arrival contract for CL50. Research and review direct fixed-coordinate create/delete batch with collision/ownership/lease/consent/reentry recovery, or preserve GM manual fallback. Do not install frozen R1 v001 or bypass previous installer tool safety refusal.',
 evidence_needed='Fixed-coordinate commit and whole-token proof under atomicity and occupied/door-state changes, single authorized executor GM lease and player consent, independent exact-version live test with real player, safe approved installer path.',
 source_id='S-2026-10-07-CL50-V14-PLACEMENT-OFFSET-READONLY'
 WHERE item_id='O-2026-10-07-CL50-R1-FROZEN-SOURCE-SEMANTIC';
DELETE FROM open_items_fts WHERE item_id='O-2026-10-07-CL50-R1-FROZEN-SOURCE-SEMANTIC';
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
 WHERE item_id='O-2026-10-07-CL50-R1-FROZEN-SOURCE-SEMANTIC';
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_cl50_v14_placement_evidence','NO_WRITE_OFFSET_NOT_PINNED; SPAWN_AND_TELEPORT_RECALCULATE; FROZEN_R1_INSTALL_BLOCKED'),
('central_lodge_cl50_v14_placement_receipt','docs/CL50-V14-PLACEMENT-OFFSET-SEMANTICS-READONLY-2026-10-07.md');
