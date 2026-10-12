-- Central Lodge CL-16 M3 read-only preflight reconciliation
-- 2026-10-08

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
  ('central_lodge_current_gate', 'CL-16 M3 Behavior PREVIEW'),
  ('central_lodge_current_gate_status', 'PREFLIGHT_PASS'),
  ('central_lodge_current_phase', 'CL-16'),
  ('central_lodge_current_scene', 'M3'),
  ('central_lodge_current_status', 'READ_ONLY_PREFLIGHT_PASS'),
  ('central_lodge_next_installer', 'CL-16'),
  ('central_lodge_next_scene', 'M3'),
  ('central_lodge_m3_geometry_sha256', '8473a9fe2a2298839cd87f4e1ea5ba7a6f260562fe76421c711772901febf77a');

INSERT OR REPLACE INTO kb_sources(
  source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES
(
  'S-2026-10-08-CENTRAL-LODGE-M3-PREFLIGHT',
  'Central Lodge M3 PREPARE and live read-only preflight',
  'campaign',
  'Central Lodge M3',
  'Recovered M3 PREPARE-v001 semantic authority plus live Foundry/Playwright readback; later ledger/item metadata wins where representations differ',
  'active',
  'C:/Users/rujie/Documents/Codex/2026-08-20/dicebox-campaign-helper/work/lodge-campaign/scenes/M3-kitchen-service-wing/prepare/PREPARE-v001.md + work/foundry-playwright-harness/m3-readonly-preflight.page.js',
  '2026-10-08',
  'M3 Scene LXTA8mx1rJ2L6e2J / 10 Regions / 0 behaviors / geometry 8473a9fe…',
  'No write occurred. Bell Board literal correct-operation sequence remains unrecovered.'
);

INSERT OR REPLACE INTO kb_facts(
  fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES
(
  'F-2026-10-08-CENTRAL-LODGE-M3-AUTHORITY',
  'campaign.central-lodge.m3',NULL,
  'M3 recovered puzzle authority',
  'M3 PREPARE-v001 says the Bell Board receives the Servant Bell Pull from E2; restoring the pull enables the mechanism; correct operation opens the service-route state; the successful state reveals or grants access to Bell Crest; Bell Crest later contributes to E4; the opened service route later supports access toward B2. Two hidden Notice discoveries are intended: Bell-board anomaly and recent-use contradiction.',
  'campaign','static','locked','S-2026-10-08-CENTRAL-LODGE-M3-PREFLIGHT',NULL,
  'central lodge m3 bell board servant bell pull bell crest b2 route notice'
),
(
  'F-2026-10-08-CENTRAL-LODGE-M3-LIVE-MANIFEST',
  'campaign.central-lodge.m3',NULL,
  'M3 live Region and state manifest',
  'Live M3 has 10 Regions and 0 behaviors before CL-16: Bell Board Mechanism, Bell Pull Fitting, Bell Crest, Bell Board Notice, Recent Use, Service Route State, two Light Regions, and two Transition Regions. Stable-sorted geometry hash is 8473a9fe2a2298839cd87f4e1ea5ba7a6f260562fe76421c711772901febf77a. Ledger puzzles.m3 contains bellBoardNoticeResolved, servantBellPullInstalled, bellBoardResolved, serviceRouteUnlocked, and recentUseObserved, all false at preflight.',
  'campaign','full_function','locked','S-2026-10-08-CENTRAL-LODGE-M3-PREFLIGHT',NULL,
  'central lodge m3 live manifest geometry ledger'
),
(
  'F-2026-10-08-CENTRAL-LODGE-M3-DEFERRED-OPERATION',
  'campaign.central-lodge.m3',NULL,
  'M3 Bell Board literal solve remains unresolved',
  'No recovered M3 source defines the literal Bell Board correct-operation sequence beyond the phrase correct operation. CL-16 must not invent that solve. Safe install scope is Bell Board Notice, Servant Bell Pull fitting, Recent Use Notice, and Bell Crest recovery gated behind puzzles.m3.bellBoardResolved; Bell Board solve and serviceRouteUnlocked remain deferred.',
  'campaign','blocked','active','S-2026-10-08-CENTRAL-LODGE-M3-PREFLIGHT',NULL,
  'central lodge m3 deferred bell board operation service route'
);

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id IN (
  'F-2026-10-08-CENTRAL-LODGE-M3-AUTHORITY',
  'F-2026-10-08-CENTRAL-LODGE-M3-LIVE-MANIFEST',
  'F-2026-10-08-CENTRAL-LODGE-M3-DEFERRED-OPERATION'
)
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
