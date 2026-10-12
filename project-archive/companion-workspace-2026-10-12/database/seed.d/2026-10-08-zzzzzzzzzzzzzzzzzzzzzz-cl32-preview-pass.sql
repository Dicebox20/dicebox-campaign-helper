-- Central Lodge CL-32 N3 PREVIEW PASS receipt
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CENTRAL-LODGE-CL32-PREVIEW','Central Lodge CL-32 N3 Behavior PREVIEW v001 PASS','verification','Central Lodge N3','Read-only Playwright PREVIEW against live Foundry baseline','active','work/foundry-playwright-harness/n3-preview-v001.page.js','2026-10-07','202 Regions / 101 behaviors / N3 12/0 / geometry 43bcb471…','Eleven source programs syntax/hash-certified. APPLY not yet run. t3BranchUnlocked, rail-car state, lighting, and transitions remain deferred.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CENTRAL-LODGE-CL32-PREVIEW','campaign.central-lodge.n3',NULL,'CL-32 N3 Behavior PREVIEW passed','CL-32 N3 PREVIEW v001 passed read-only at the canonical 21 Scenes / 202 Regions / 101 RegionBehaviors / 33 Items baseline. It certified 11 planned behaviors with exact source hashes: baggage observation, baggage-token-to-route-plate wrapper, departure-board plate socket, switch-wheel socket, Wing IV pickup, recent-use observation, walkable-railway Notice, three cartography clue sockets, and cartography completion gate. Expected post-APPLY total is 112 behaviors. No N3 write has occurred yet.','campaign','static','locked','S-2026-10-07-CENTRAL-LODGE-CL32-PREVIEW',NULL,'central lodge cl32 n3 preview pass 101 112');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CENTRAL-LODGE-CL32-PREVIEW'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
