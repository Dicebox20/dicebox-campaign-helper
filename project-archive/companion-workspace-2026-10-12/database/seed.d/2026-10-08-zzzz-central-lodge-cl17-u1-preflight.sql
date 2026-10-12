-- Central Lodge CL-17 U1 read-only preflight reconciliation
-- 2026-10-08

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
  ('central_lodge_current_gate', 'CL-17 U1 Behavior PREVIEW'),
  ('central_lodge_current_gate_status', 'PREFLIGHT_PASS'),
  ('central_lodge_current_status', 'READ_ONLY_PREFLIGHT_PASS'),
  ('central_lodge_u1_geometry_sha256', '51c37b027918cb3623f5dc89966cd92e41efce44b28a2893e9a32ad8d04c2815');

INSERT OR REPLACE INTO kb_sources(
  source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES
(
  'S-2026-10-08-CENTRAL-LODGE-U1-PREFLIGHT',
  'Central Lodge U1 PREPARE and live read-only preflight',
  'campaign','Central Lodge U1',
  'Recovered U1 PREPARE-v001 semantic authority plus live Foundry/Playwright readback; current ledger/item metadata used for runtime state',
  'active',
  'C:/Users/rujie/Documents/Codex/2026-08-20/dicebox-campaign-helper/work/lodge-campaign/scenes/U1-family-guest-rooms/prepare/PREPARE-v001.md + work/foundry-playwright-harness/u1-readonly-preflight.page.js',
  '2026-10-08',
  'U1 Scene if9iWDRjSwI87EeX / 10 Regions / 0 behaviors / geometry 51c37b02…',
  'No write occurred.'
);

INSERT OR REPLACE INTO kb_facts(
  fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES
(
  'F-2026-10-08-CENTRAL-LODGE-U1-AUTHORITY',
  'campaign.central-lodge.u1',NULL,
  'U1 recovered progression authority',
  'U1 PREPARE-v001 supports House Proof recovery for N1, Crown Crest recovery for E4, family records that support grandfather-clock chronology and grave/family history, a Family-record anomaly Notice, and a Guest-room absence Notice. The records remain available through deliberate search and are not lost to a failed Notice.',
  'campaign','static','locked','S-2026-10-08-CENTRAL-LODGE-U1-PREFLIGHT',NULL,
  'central lodge u1 house proof crown crest family records guest absence'
),
(
  'F-2026-10-08-CENTRAL-LODGE-U1-LIVE-MANIFEST',
  'campaign.central-lodge.u1',NULL,
  'U1 live Region and state manifest',
  'Live U1 has 10 Regions and 0 behaviors before CL-17: House Proof, Crown Crest, Family Records Notice, Guest Room Absence Notice, Family Records story Region, two Light Regions, and three Transition Regions. Stable-sorted geometry hash is 51c37b027918cb3623f5dc89966cd92e41efce44b28a2893e9a32ad8d04c2815. Ledger puzzles.u1 contains familyRecordsNoticeResolved, guestRoomAbsenceNoticeResolved, and familyRecordsInterpreted, all false.',
  'campaign','full_function','locked','S-2026-10-08-CENTRAL-LODGE-U1-PREFLIGHT',NULL,
  'central lodge u1 live manifest geometry ledger'
),
(
  'F-2026-10-08-CENTRAL-LODGE-U1-INTERPRETATION-SCOPE',
  'campaign.central-lodge.u1',NULL,
  'U1 family-record interpretation scope',
  'No recovered U1 source provides M1’s exact grandfather-clock setting. CL-17 may establish only the supported relationship: the family records provide chronology/context connecting household generations, Lodge genealogy, and the grave/family history. Any exact clock-setting literal remains deferred under CL-13.',
  'campaign','static','locked','S-2026-10-08-CENTRAL-LODGE-U1-PREFLIGHT',NULL,
  'central lodge u1 family records m1 clock setting deferred'
);

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id IN (
  'F-2026-10-08-CENTRAL-LODGE-U1-AUTHORITY',
  'F-2026-10-08-CENTRAL-LODGE-U1-LIVE-MANIFEST',
  'F-2026-10-08-CENTRAL-LODGE-U1-INTERPRETATION-SCOPE'
)
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
