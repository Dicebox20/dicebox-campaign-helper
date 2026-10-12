-- DiceBox supplemental KB seed: Central Lodge Region/puzzle installation handoff
-- 2026-10-06
-- Supersedes the older remaining-maps handoff for current execution state only.

INSERT OR REPLACE INTO kb_metadata(key, value) VALUES
  ('central_lodge_handoff_version', '2026-10-06.region-install-v1'),
  ('central_lodge_handoff_location', 'work/lodge-campaign/HANDOFF-2026-10-06-REGION-INSTALL-NEXT.md'),
  ('central_lodge_plan_location', 'work/lodge-campaign/REGION-PUZZLE-INSTALL-PLAN-v001.md'),
  ('central_lodge_current_phase', 'CL-10C'),
  ('central_lodge_current_status', 'RUNTIME_CANARY_PENDING'),
  ('central_lodge_next_installer', 'CL-11'),
  ('central_lodge_next_scene', 'U2'),
  ('central_lodge_scene_count', '21'),
  ('central_lodge_region_count', '201'),
  ('central_lodge_region_behavior_count', '21'),
  ('central_lodge_canonical_item_count', '33'),
  ('central_lodge_ledger_id', 'xhlXv6CCH34HVga3'),
  ('central_lodge_ledger_stable_id', 'dbx:central-lodge:state'),
  ('central_lodge_ledger_revision', '0'),
  ('central_lodge_kernel_id', 'FHQiFYx6OntZVo9d'),
  ('central_lodge_kernel_stable_id', 'dbx:central-lodge:macro:runtime'),
  ('central_lodge_kernel_sha256', '1e45da0c5fdaec7ec8e229593b7408e3060a21ef45381ccd0f973227851e8205'),
  ('central_lodge_region_manifest_sha256', '368c22e61d6bd6b6af1ef3cb8982b23cbd4119d0d924af06b4b8ac6183f7e39a');

INSERT OR REPLACE INTO kb_sources(
  source_id, title, source_kind, scope, authority, status, location,
  captured_at, version_fingerprint, notes
) VALUES (
  'S-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-HANDOFF',
  'Central Lodge Region/Puzzle Installation Handoff',
  'campaign',
  'Central Lodge Region metadata, runtime foundation, puzzle behavior installation, and next-step continuity',
  'User-supplied Foundry PREVIEW/APPLY/VERIFY receipts plus locked project plan and repository receipts',
  'active',
  'work/lodge-campaign/HANDOFF-2026-10-06-REGION-INSTALL-NEXT.md',
  '2026-10-06',
  'region-install-v1',
  'Current execution authority for Central Lodge Region/puzzle installation. Supersedes the older remaining-maps handoff only for the current continuation point.'
);

UPDATE kb_facts
SET status = 'superseded'
WHERE fact_id IN (
  'F-2026-10-06-CENTRAL-LODGE-N3-BUILD-READY',
  'F-2026-10-06-CENTRAL-LODGE-REMAINING-SEQUENCE'
);

UPDATE kb_open_items
SET status = 'closed'
WHERE item_id IN (
  'O-2026-10-06-CENTRAL-LODGE-N3-IMPLEMENT',
  'O-2026-10-06-CENTRAL-LODGE-T1-F2',
  'O-2026-10-06-CENTRAL-LODGE-RECONCILE-E3-B1'
);

INSERT OR REPLACE INTO kb_facts(
  fact_id, domain, subject_no, title, statement, scope,
  evidence_class, status, source_id, supersedes_fact_id, tags
) VALUES
(
  'F-2026-10-06-CENTRAL-LODGE-REGION-FOUNDATION-COMPLETE',
  'campaign.central-lodge',
  NULL,
  'Central Lodge Region/puzzle foundation is complete',
  'Required Items, CL-00 preflight, CL-02 state ledger, CL-03 runtime kernel, and CL-04 Region metadata normalization all have implementation/verification PASS evidence. The live protected foundation is 21 Scenes, 201 Regions, 201 unique Region stable IDs, 33 canonical Items, ledger revision 0, and the verified runtime kernel hash 1e45da0c5fdaec7ec8e229593b7408e3060a21ef45381ccd0f973227851e8205.',
  'campaign',
  'created_document',
  'locked',
  'S-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-HANDOFF',
  NULL,
  'central lodge region foundation items ledger kernel metadata cl00 cl02 cl03 cl04 pass'
),
(
  'F-2026-10-06-CENTRAL-LODGE-CL10-E2-PASS',
  'campaign.central-lodge',
  NULL,
  'CL-10 E2 behavior installation and verification passed',
  'E2 Rear Service Yard contains 9 Regions and 5 installed RegionBehaviors: one Well Carving Notice, three pickup behaviors, and one Recent Use observation. Lodge-wide behavior count is now 21. E2 transition Regions remain metadata-only and E2 light Regions remain passive. CL-10 FINAL VERIFY reports no blockers or warnings.',
  'campaign',
  'created_document',
  'locked',
  'S-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-HANDOFF',
  NULL,
  'central lodge cl10 e2 behaviors notice pickup observation pass'
),
(
  'F-2026-10-06-CENTRAL-LODGE-CURRENT-CONTINUATION',
  'campaign.central-lodge',
  NULL,
  'Current Central Lodge continuation is CL-10C runtime canary then CL-11 U2',
  'No deliberate live runtime canary has yet exercised the new shared kernel through E2 Region events. The next gate is a controlled, resettable E2 runtime canary. After canary PASS, continue with CL-11 U2 Servants Quarters, Nursery & Attic.',
  'campaign',
  'deterministic',
  'active',
  'S-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-HANDOFF',
  'F-2026-10-06-CENTRAL-LODGE-REMAINING-SEQUENCE',
  'central lodge current continuation cl10c canary cl11 u2'
),
(
  'F-2026-10-06-CENTRAL-LODGE-UNRESOLVED-GLOBALS',
  'campaign.central-lodge',
  NULL,
  'Central Lodge unresolved global bindings remain intentionally deferred',
  'The global day-to-night trigger and T1/T2 mouth A/B orientation remain unresolved and must not be guessed. Transition Regions without proven destinations remain metadata-only until the route binder phase.',
  'campaign',
  'deterministic',
  'locked',
  'S-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-HANDOFF',
  NULL,
  'central lodge unresolved day night t1 t2 orientation transitions do not guess'
);

INSERT INTO facts_fts(fact_id, title, statement, tags)
SELECT fact_id, title, statement, tags
FROM kb_facts
WHERE fact_id IN (
  'F-2026-10-06-CENTRAL-LODGE-REGION-FOUNDATION-COMPLETE',
  'F-2026-10-06-CENTRAL-LODGE-CL10-E2-PASS',
  'F-2026-10-06-CENTRAL-LODGE-CURRENT-CONTINUATION',
  'F-2026-10-06-CENTRAL-LODGE-UNRESOLVED-GLOBALS'
)
AND NOT EXISTS (
  SELECT 1 FROM facts_fts f WHERE f.fact_id = kb_facts.fact_id
);

INSERT OR REPLACE INTO kb_decisions(
  decision_id, topic, decision, rationale, scope, status, owner, source_id, next_review
) VALUES
(
  'D-2026-10-06-CENTRAL-LODGE-SHARED-RUNTIME',
  'Central Lodge Region behavior runtime architecture',
  'Use the canonical Item registry, one persistent state ledger, one shared runtime kernel, declarative Region behaviorSpec metadata, and small ExecuteScript RegionBehavior dispatchers. Runtime identity uses stable IDs, not visible names or mutable document IDs.',
  'This architecture centralizes Notice, observation, pickup, socket, gate, transition, and state handling while protecting Region geometry and verified late-game behaviors.',
  'campaign',
  'locked',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-HANDOFF',
  NULL
),
(
  'D-2026-10-06-CENTRAL-LODGE-CANARY-BEFORE-CL11',
  'Runtime canary gate before expanding the installer pattern',
  'Do not begin CL-11 until a controlled E2 runtime canary proves representative Notice, pickup, and observation behavior through the shared kernel. Author cleanup/reset behavior before triggering the canary.',
  'CL-10 is the first old Lodge Scene wired into the new shared runtime; static verification alone does not prove live event execution and state mutation.',
  'campaign',
  'locked',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-HANDOFF',
  'After CL-10C canary receipt'
),
(
  'D-2026-10-06-CENTRAL-LODGE-PRESERVE-LATE-GAME',
  'Preservation of T1/T2/T3/F1/F2 behaviors',
  'Do not delete or wholesale recreate the verified T1/T2/T3/F1/F2 RegionBehaviors. Reconcile them later with narrow read-only diagnostics and patch only proven incompatibilities.',
  'The 16 existing late-game behavior source hashes were captured before Region metadata normalization and independently verified afterward.',
  'campaign',
  'locked',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-HANDOFF',
  NULL
);

INSERT INTO decisions_fts(decision_id, topic, decision, rationale)
SELECT decision_id, topic, decision, rationale
FROM kb_decisions
WHERE decision_id IN (
  'D-2026-10-06-CENTRAL-LODGE-SHARED-RUNTIME',
  'D-2026-10-06-CENTRAL-LODGE-CANARY-BEFORE-CL11',
  'D-2026-10-06-CENTRAL-LODGE-PRESERVE-LATE-GAME'
)
AND NOT EXISTS (
  SELECT 1 FROM decisions_fts d WHERE d.decision_id = kb_decisions.decision_id
);

INSERT OR REPLACE INTO kb_open_items(
  item_id, item_class, title, problem, next_action, evidence_needed,
  priority, status, owner, source_id
) VALUES
(
  'O-2026-10-06-CENTRAL-LODGE-CL10C-RUNTIME-CANARY',
  'certification',
  'Run controlled E2 runtime canary',
  'CL-10 static implementation and verification passed, but the shared runtime has not yet been deliberately exercised through live E2 Region events.',
  'Author a reset/cleanup path first, then use one designated test Actor/token to prove one Notice, one pickup, one observation, duplicate blocking, and preservation of unrelated state. Record pre/post ledger revision and whether canary state was reset or retained.',
  'User-supplied runtime receipt showing live event execution, expected ledger/inventory effects, duplicate blocking, preservation checks, and explicit cleanup/resulting state.',
  'P0',
  'in_progress',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-HANDOFF'
),
(
  'O-2026-10-06-CENTRAL-LODGE-CL11-U2',
  'implementation',
  'Install CL-11 U2 Servants Quarters, Nursery & Attic behaviors',
  'U2 has normalized Region metadata and canonical Item dependencies but has not yet received the planned shared-runtime behaviors.',
  'After CL-10C canary PASS, author and install U2 Servant Room Absence Notice, Nursery Contradiction Notice, Servant History observation, Glass Eye recovery, Brass Gnomon recovery, Piano Roll recovery, and story/horror metadata. Keep lighting passive.',
  'PREVIEW PASS, bounded APPLY PASS, independent FINAL VERIFY PASS, preserved geometry, correct behaviorSpec metadata, and no guessed Notice authoring values.',
  'P1',
  'open',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-HANDOFF'
),
(
  'O-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-REMAINDER',
  'implementation',
  'Complete remaining Central Lodge Region/puzzle installer sequence',
  'CL-12 through CL-52 plus CL-90/91/92 remain after CL-11.',
  'Continue one bounded installer and independent verifier at a time according to REGION-PUZZLE-INSTALL-PLAN-v001.md, preserving unresolved transitions and verified late-game behavior.',
  'Per-phase APPLY/VERIFY receipts, dependency simulation, full behavior audit v002, and final live canary suite.',
  'P1',
  'open',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-HANDOFF'
);

INSERT INTO open_items_fts(item_id, title, problem, next_action, evidence_needed)
SELECT item_id, title, problem, next_action, evidence_needed
FROM kb_open_items
WHERE item_id IN (
  'O-2026-10-06-CENTRAL-LODGE-CL10C-RUNTIME-CANARY',
  'O-2026-10-06-CENTRAL-LODGE-CL11-U2',
  'O-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-REMAINDER'
)
AND NOT EXISTS (
  SELECT 1 FROM open_items_fts o WHERE o.item_id = kb_open_items.item_id
);

INSERT OR REPLACE INTO kb_milestones(
  milestone_id, milestone, goal, deliverables, exit_gate, dependencies, status, source_id
) VALUES
(
  'M-2026-10-06-CENTRAL-LODGE-REGION-FOUNDATION',
  'Central Lodge Region/puzzle foundation',
  'Establish canonical Items, baseline, state ledger, runtime kernel, and stable Region metadata before puzzle behavior expansion.',
  'CL-01 Items; CL-00 snapshot; CL-02 ledger; CL-03 kernel; CL-04 metadata normalizer.',
  'Independent verification confirms 21 Scenes, 201 stable Regions, 33 canonical Items, preserved 16 late-game behaviors, and unchanged protected geometry.',
  'Central Lodge map production complete.',
  'complete',
  'S-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-HANDOFF'
),
(
  'M-2026-10-06-CENTRAL-LODGE-PHASE1',
  'Central Lodge Phase 1 early acquisition and local mechanisms',
  'Install and certify CL-10 through CL-17.',
  'E2, U2, M2, M1, B1, E3, M3, and U1 behavior installers plus independent verifiers.',
  'CL-17 VERIFY PASS with dependency paths intact and no unresolved implementation defects.',
  'Region/puzzle foundation complete; CL-10C canary must pass before CL-11.',
  'in_progress',
  'S-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-HANDOFF'
);

INSERT OR REPLACE INTO kb_relationships(
  relationship_id, from_type, from_id, relation, to_type, to_id, notes
) VALUES
(
  'R-2026-10-06-CENTRAL-LODGE-CL10-TO-CANARY',
  'fact',
  'F-2026-10-06-CENTRAL-LODGE-CL10-E2-PASS',
  'requires-next',
  'open_item',
  'O-2026-10-06-CENTRAL-LODGE-CL10C-RUNTIME-CANARY',
  'Static E2 PASS must be followed by live runtime certification before expansion.'
),
(
  'R-2026-10-06-CENTRAL-LODGE-CANARY-TO-CL11',
  'open_item',
  'O-2026-10-06-CENTRAL-LODGE-CL10C-RUNTIME-CANARY',
  'unblocks',
  'open_item',
  'O-2026-10-06-CENTRAL-LODGE-CL11-U2',
  'CL-11 begins only after runtime canary PASS.'
),
(
  'R-2026-10-06-CENTRAL-LODGE-CL11-TO-REMAINDER',
  'open_item',
  'O-2026-10-06-CENTRAL-LODGE-CL11-U2',
  'continues',
  'open_item',
  'O-2026-10-06-CENTRAL-LODGE-REGION-INSTALL-REMAINDER',
  'Continue the remaining installer sequence after U2 is verified.'
);
