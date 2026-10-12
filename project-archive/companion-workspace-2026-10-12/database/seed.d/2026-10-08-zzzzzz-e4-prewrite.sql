-- Central Lodge CL-20 E4 prewrite reconciliation
-- 2026-10-07

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
  ('central_lodge_current_gate','CL-20 E4 Behavior PREVIEW'),
  ('central_lodge_current_gate_status','PREFLIGHT_PASS'),
  ('central_lodge_current_status','READ_ONLY_PREFLIGHT_PASS'),
  ('central_lodge_e4_geometry_sha256','2c3a3508a9f8b4ed842c7df4113bba4a81b3893401ed00cc43d0a435812e73a5');

INSERT OR REPLACE INTO kb_sources(
  source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES
(
  'S-2026-10-07-CENTRAL-LODGE-E4-PREFLIGHT',
  'Central Lodge E4 PREPARE, BUILD receipt, and live preflight',
  'campaign','Central Lodge E4',
  'Recovered E4 PREPARE/BUILD semantic authority plus live Foundry/Playwright readback',
  'active',
  'older lodge PREPARE/BUILD + work/foundry-playwright-harness/e4-readonly-preflight.page.js',
  '2026-10-07',
  'E4 DLcheEi6e5OHOYmU / 11 Regions / 0 behaviors / geometry 2c3a3508…',
  'Exact mausoleum crest door is Wall.kyoCHP9xmMSxCIwi, stable dbx:central-lodge:e4:wall:mausoleum-crest-door.'
);

INSERT OR REPLACE INTO kb_facts(
 fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES
(
 'F-2026-10-07-E4-MAUSOLEUM-CONTRACT',
 'campaign.central-lodge.e4',NULL,
 'E4 four-crest mausoleum contract',
 'The E4 mausoleum requires Stag Crest from M2, Rose Crest from E3, Bell Crest from M3, and Crown Crest from U1. Live Wall kyoCHP9xmMSxCIwi is the exact stateful crest door and is currently closed. Use global itemRecovered requirements so cooperative party ownership cannot softlock the gate. On successful gate resolution set puzzles.e4.crests.{stag,rose,bell,crown}=true and puzzles.e4.mausoleumResolved=true, then open only that exact Wall.',
 'campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-E4-PREFLIGHT',NULL,
 'central lodge e4 four crest mausoleum door'
),
(
 'F-2026-10-07-E4-CRYPT-GATING',
 'campaign.central-lodge.e4',NULL,
 'E4 crypt reward gating',
 'Founder’s Signet, Black Garnet Eye, Asmodean Covenant Seal, and Cicada Wing II are crypt/deeper-crypt recoveries and must remain inaccessible until puzzles.e4.mausoleumResolved is true. Child Bracelet/Token is recovered from the child-burial context and is not gated by the mausoleum solve. False Burial Evidence is a story interpretation outside the reward gate.',
 'campaign','full_function','locked','S-2026-10-07-CENTRAL-LODGE-E4-PREFLIGHT',NULL,
 'central lodge e4 crypt rewards child bracelet false burial'
);

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id IN ('F-2026-10-07-E4-MAUSOLEUM-CONTRACT','F-2026-10-07-E4-CRYPT-GATING')
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
