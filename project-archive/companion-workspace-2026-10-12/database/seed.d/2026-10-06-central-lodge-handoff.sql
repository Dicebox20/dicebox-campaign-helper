-- DiceBox supplemental KB seed: Central Lodge remaining-maps handoff
-- 2026-10-06

INSERT OR REPLACE INTO kb_metadata(key, value) VALUES
  ('central_lodge_handoff_version', '2026-10-06.remaining-maps-v1'),
  ('central_lodge_handoff_location', 'work/lodge-campaign/HANDOFF-2026-10-06-REMAINING-MAPS.md'),
  ('central_lodge_current_scene', 'N3'),
  ('central_lodge_current_phase', 'IMPLEMENT'),
  ('central_lodge_current_status', 'PENDING'),
  ('central_lodge_next_scene_after_n3_pass', 'T1'),
  ('central_lodge_remaining_sequence', 'T1,T2,T3,F1,F2'),
  ('central_lodge_n1_build_sha256', 'b95ddb0317be8bc08d9f52ac9bc7f672111112d71e6d23385069c237f5b0c4de'),
  ('central_lodge_n2_build_sha256', '0f1cc80451838007ef90099ec4cdf4271417076d5a603e1d0f8c9cbdd0c682b2'),
  ('central_lodge_n3_build_sha256', '4fe72e4a824ed8a78400c18b721a7ed0da5bdfb8adbbd966cc40ce2224f21bdd'),
  ('central_lodge_n1_render_gen_id', '96b56cd0-0a09-4b38-9620-5a60f610acdf'),
  ('central_lodge_n2_render_gen_id', 'ebc29506-7cd1-49aa-8e1d-bf54308f6b97'),
  ('central_lodge_n3_render_gen_id', '236c1c10-c033-48bb-af80-cd558cc8c565');

INSERT OR REPLACE INTO kb_sources(
  source_id, title, source_kind, scope, authority, status, location,
  captured_at, version_fingerprint, notes
) VALUES (
  'S-2026-10-06-CENTRAL-LODGE-REMAINING-MAPS-HANDOFF',
  'Central Lodge Remaining-Maps Handoff',
  'campaign',
  'Central Lodge N1/N2/N3 continuity and T1/T2/T3/F1/F2 remaining-map workflow',
  'User-confirmed Foundry receipts plus validated Scene Injector BUILD receipts and approved render inspections',
  'active',
  'work/lodge-campaign/HANDOFF-2026-10-06-REMAINING-MAPS.md',
  '2026-10-06',
  'remaining-maps-v1',
  'GitHub AUTOMATION-STATE may be stale beyond E2; these handoff facts supersede that stale portion for N1/N2/N3 continuity.'
);

INSERT OR REPLACE INTO kb_facts(
  fact_id, domain, subject_no, title, statement, scope,
  evidence_class, status, source_id, supersedes_fact_id, tags
) VALUES
(
  'F-2026-10-06-CENTRAL-LODGE-N1-N2-INSTALLED',
  'campaign.central-lodge',
  NULL,
  'N1 and N2 are installed and locked',
  'N1 Underworks Hub / Lodge Railway Station and N2 Underground Grotto / Garden Station each received user-supplied Foundry PREVIEW PASS followed by APPLY PASS with evidenceClass created_document. Their installers must not be rerun.',
  'campaign',
  'created_document',
  'locked',
  'S-2026-10-06-CENTRAL-LODGE-REMAINING-MAPS-HANDOFF',
  NULL,
  'central lodge n1 n2 railway implemented pass created_document do not rerun'
),
(
  'F-2026-10-06-CENTRAL-LODGE-N3-BUILD-READY',
  'campaign.central-lodge',
  NULL,
  'N3 validated BUILD is ready for IMPLEMENT',
  'N3 Collection Vaults / Underground Depot has an approved neutral-light three-portal renderer and BUILD v001 PASS under dicebox-scene-injector-build/v2. Artifact central-lodge-n3-build-v001.md SHA-256 is 4fe72e4a824ed8a78400c18b721a7ed0da5bdfb8adbbd966cc40ce2224f21bdd. No Foundry APPLY receipt has yet been observed, so N3 remains at IMPLEMENT pending.',
  'campaign',
  'created_document',
  'active',
  'S-2026-10-06-CENTRAL-LODGE-REMAINING-MAPS-HANDOFF',
  NULL,
  'central lodge n3 collection vaults depot build implement pending'
),
(
  'F-2026-10-06-CENTRAL-LODGE-REMAINING-SEQUENCE',
  'campaign.central-lodge',
  NULL,
  'Remaining Central Lodge map sequence',
  'After N3 APPLY PASS, continue maps in order T1 Lodge-Grotto Walkable Railway Tunnel, T2 Grotto-Depot Walkable Railway Tunnel, T3 Abandoned Spur / Cult Railway Extension, F1 Ancient Infernal Threshold, and F2 Final Summoning Chamber using PREPARE -> RENDER -> INSPECT -> BUILD -> IMPLEMENT -> VERIFY.',
  'campaign',
  'created_document',
  'locked',
  'S-2026-10-06-CENTRAL-LODGE-REMAINING-MAPS-HANDOFF',
  NULL,
  'central lodge remaining maps t1 t2 t3 f1 f2 workflow'
),
(
  'F-2026-10-06-CENTRAL-LODGE-STYLE-GUIDES',
  'campaign.central-lodge',
  NULL,
  'N1 N2 N3 approved render style references',
  'Use approved render generations 96b56cd0-0a09-4b38-9620-5a60f610acdf (N1), ebc29506-7cd1-49aa-8e1d-bf54308f6b97 (N2), and 236c1c10-c033-48bb-af80-cd558cc8c565 (N3) as visual references. Preserve top-down tactical readability, refined private-estate railway materials, clean rail/tunnel geometry, pedestrian separation, neutral inactive fixtures, and current-map-only clean render capsules.',
  'campaign',
  'created_document',
  'locked',
  'S-2026-10-06-CENTRAL-LODGE-REMAINING-MAPS-HANDOFF',
  NULL,
  'central lodge style guide n1 n2 n3 render railway image prompt firewall'
),
(
  'F-2026-10-06-CENTRAL-LODGE-OLDER-UNRESOLVED-INSTALLS',
  'campaign.central-lodge',
  NULL,
  'E3 and B1 install state must not be inferred',
  'E3 has only a known PREVIEW PASS and no observed APPLY receipt. B1 has a validated BUILD but no observed APPLY receipt. These states remain unresolved reconciliation items and must not be silently marked installed.',
  'campaign',
  'historical',
  'active',
  'S-2026-10-06-CENTRAL-LODGE-REMAINING-MAPS-HANDOFF',
  NULL,
  'central lodge e3 b1 unresolved install reconciliation'
);

INSERT INTO facts_fts(fact_id, title, statement, tags)
SELECT fact_id, title, statement, tags
FROM kb_facts
WHERE fact_id IN (
  'F-2026-10-06-CENTRAL-LODGE-N1-N2-INSTALLED',
  'F-2026-10-06-CENTRAL-LODGE-N3-BUILD-READY',
  'F-2026-10-06-CENTRAL-LODGE-REMAINING-SEQUENCE',
  'F-2026-10-06-CENTRAL-LODGE-STYLE-GUIDES',
  'F-2026-10-06-CENTRAL-LODGE-OLDER-UNRESOLVED-INSTALLS'
)
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id = kb_facts.fact_id);

INSERT OR REPLACE INTO kb_decisions(
  decision_id, topic, decision, rationale, scope, status, owner, source_id, next_review
) VALUES
(
  'D-2026-10-06-CENTRAL-LODGE-N3-T2-ORIENTATION',
  'N3 main-line portal orientation',
  'Do not guess which N3 east/west main-line portal binds to T2. The lower branch portal is T3; T2 orientation remains unresolved until accepted global railway geography or explicit user direction resolves it.',
  'The approved N3 art establishes the three-portal topology but does not itself provide trustworthy campaign-geography orientation.',
  'campaign',
  'locked',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-06-CENTRAL-LODGE-REMAINING-MAPS-HANDOFF',
  NULL
),
(
  'D-2026-10-06-CENTRAL-LODGE-REDO-PROMPT-FIREWALL',
  'Central Lodge render REDO behavior',
  'Every REDO abandons the previous image prompt and rewrites from current-map visible physical requirements only. Do not mention failures, forbidden neighboring content, destinations, story meaning, puzzle solutions, Region logic, or future rooms in image prompts.',
  'Repeated railway-map failures showed that contaminated prompt context can reproduce unwanted geometry.',
  'campaign',
  'locked',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-06-CENTRAL-LODGE-REMAINING-MAPS-HANDOFF',
  NULL
);

INSERT INTO decisions_fts(decision_id, topic, decision, rationale)
SELECT decision_id, topic, decision, rationale
FROM kb_decisions
WHERE decision_id IN (
  'D-2026-10-06-CENTRAL-LODGE-N3-T2-ORIENTATION',
  'D-2026-10-06-CENTRAL-LODGE-REDO-PROMPT-FIREWALL'
)
AND NOT EXISTS (SELECT 1 FROM decisions_fts d WHERE d.decision_id = kb_decisions.decision_id);

INSERT OR REPLACE INTO kb_open_items(
  item_id, item_class, title, problem, next_action, evidence_needed,
  priority, status, owner, source_id
) VALUES
(
  'O-2026-10-06-CENTRAL-LODGE-N3-IMPLEMENT',
  'implementation',
  'Implement N3 Collection Vaults / Underground Depot',
  'N3 BUILD v001 is validated but no Foundry APPLY PASS has yet been observed.',
  'Run central-lodge-n3-build-v001.md once. Accept the expected first-run renderer 404 if asset is absent, require PREVIEW PASS, then APPLY PASS with evidenceClass created_document. Do not rerun after PASS.',
  'User-supplied Foundry APPLY receipt showing status PASS and evidenceClass created_document.',
  'P0',
  'in_progress',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-06-CENTRAL-LODGE-REMAINING-MAPS-HANDOFF'
),
(
  'O-2026-10-06-CENTRAL-LODGE-T1-F2',
  'implementation',
  'Complete remaining Central Lodge maps T1 through F2',
  'Five unique geography maps remain after N3: T1, T2, T3, F1, and F2.',
  'After N3 IMPLEMENT PASS, process T1 -> T2 -> T3 -> F1 -> F2 one map at a time through PREPARE, RENDER, INSPECT, BUILD, IMPLEMENT, and VERIFY.',
  'Per-map approved render inspection, DiceBox BUILD validator PASS, Node syntax PASS, and Foundry created_document receipt.',
  'P1',
  'open',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-06-CENTRAL-LODGE-REMAINING-MAPS-HANDOFF'
),
(
  'O-2026-10-06-CENTRAL-LODGE-RECONCILE-E3-B1',
  'reconciliation',
  'Reconcile unresolved E3 and B1 implementation state',
  'E3 lacks an observed APPLY receipt and B1 lacks an observed APPLY receipt despite a validated BUILD.',
  'Inspect authoritative Foundry documents/receipts before changing either state. Never infer installation from PREVIEW or BUILD alone.',
  'Foundry scene/receipt evidence or user-supplied APPLY PASS/absence evidence for E3 and B1.',
  'P2',
  'open',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-06-CENTRAL-LODGE-REMAINING-MAPS-HANDOFF'
);

INSERT INTO open_items_fts(item_id, title, problem, next_action, evidence_needed)
SELECT item_id, title, problem, next_action, evidence_needed
FROM kb_open_items
WHERE item_id IN (
  'O-2026-10-06-CENTRAL-LODGE-N3-IMPLEMENT',
  'O-2026-10-06-CENTRAL-LODGE-T1-F2',
  'O-2026-10-06-CENTRAL-LODGE-RECONCILE-E3-B1'
)
AND NOT EXISTS (SELECT 1 FROM open_items_fts o WHERE o.item_id = kb_open_items.item_id);

INSERT OR REPLACE INTO kb_relationships(
  relationship_id, from_type, from_id, relation, to_type, to_id, notes
) VALUES
(
  'R-2026-10-06-CENTRAL-LODGE-N3-NEXT',
  'fact',
  'F-2026-10-06-CENTRAL-LODGE-N3-BUILD-READY',
  'requires-next',
  'open_item',
  'O-2026-10-06-CENTRAL-LODGE-N3-IMPLEMENT',
  'Validated N3 BUILD must receive a created_document APPLY PASS before the remaining-map sequence advances.'
),
(
  'R-2026-10-06-CENTRAL-LODGE-N3-TO-REMAINING',
  'open_item',
  'O-2026-10-06-CENTRAL-LODGE-N3-IMPLEMENT',
  'unblocks',
  'open_item',
  'O-2026-10-06-CENTRAL-LODGE-T1-F2',
  'After N3 IMPLEMENT PASS, T1 becomes the next active Scene.'
);
