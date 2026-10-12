-- Central Lodge CL-21 E1 prewrite reconciliation
-- 2026-10-07

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('central_lodge_current_gate','CL-21 E1 Behavior PREVIEW'),
 ('central_lodge_current_gate_status','PREFLIGHT_PASS'),
 ('central_lodge_current_status','READ_ONLY_PREFLIGHT_PASS'),
 ('central_lodge_e1_geometry_sha256','0b39046a2eb2bae365417a98b22f39611bcbfeb71c24f8a78864adf0dec9ed2e');

INSERT OR REPLACE INTO kb_sources(
 source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES
(
 'S-2026-10-07-CENTRAL-LODGE-E1-PREFLIGHT',
 'Central Lodge E1 PREPARE, puzzle plan, BUILD receipt, and live preflight',
 'campaign','Central Lodge E1',
 'Recovered E1 PREPARE/puzzle-plan/BUILD authority plus live Foundry/Playwright readback',
 'active',
 'older lodge E1 PREPARE + PUZZLE-REGION-PLAN + BUILD receipt + work/foundry-playwright-harness/e1-readonly-preflight.page.js',
 '2026-10-07',
 'E1 Zq8iXByDVhHRbA7w / 6 Regions / 0 behaviors / geometry 0b39046a…',
 'Exact stateful Hound Tile VS2E5k2zKpk1U6ee owns missing/restored eye art; existing Hound Notice Region encloses the same physical anchor.'
);

INSERT OR REPLACE INTO kb_facts(
 fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES
(
 'F-2026-10-07-E1-HOUND-BACKTRACK-CONTRACT',
 'campaign.central-lodge.e1',NULL,
 'E1 Hound and Black Garnet Eye backtrack contract',
 'E1 uses the Black Garnet Eye recovered in E4 to resolve the Hound statue and reveal the hidden estate-plan fragment. The live scene has no dedicated socket Region, but the Hound Notice Region vrJhFjH9RQyKoaXU encloses the exact stateful Hound Tile VS2E5k2zKpk1U6ee. CL-21 may bind Notice, recent-use observation, and socket behaviors to that shared physical radius without creating new geometry. Successful socket sets puzzles.e1.blackGarnetEyeInstalled, houndResolved, and estatePlanObserved, then swaps only the exact Hound Tile to its installed restored texture. The eye is not consumed unless recovered authority explicitly requires consumption; current authority does not.',
 'campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-E1-PREFLIGHT',NULL,
 'central lodge e1 hound black garnet eye estate plan backtrack'
),
(
 'F-2026-10-07-E1-RECENT-USE-SCOPE',
 'campaign.central-lodge.e1',NULL,
 'E1 recent-use story scope',
 'E1 PREPARE explicitly places recent scuffing near the Hound pedestal and distinguishes it from the hidden Hound Notice check. Because no separate live recent-use Region exists, CL-21 may use a non-roll observe behavior on the same physical Hound radius to set puzzles.e1.recentUseObserved once per actor. This remains a story clue, not a progression gate.',
 'campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-E1-PREFLIGHT',NULL,
 'central lodge e1 recent use observation'
);

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id IN ('F-2026-10-07-E1-HOUND-BACKTRACK-CONTRACT','F-2026-10-07-E1-RECENT-USE-SCOPE')
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
