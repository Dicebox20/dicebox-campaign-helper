-- DiceBox supplemental KB seed: automated scene workflow + active Forest Maze state
-- 2026-10-06
-- This delta is intentionally small and independently replayable after database/seed.sql.

INSERT OR REPLACE INTO kb_metadata(key, value) VALUES
  ('dicebox_scene_workflow_version', '2026-10-06.pass-auto-approval'),
  ('active_campaign_workstream', 'Fiend Machine Forest Maze — Stage II'),
  ('active_scene_key', 'L2-03'),
  ('active_scene_name', 'L2-03 — Leaning Waystone Hollow'),
  ('active_scene_state', 'APPROVED'),
  ('active_scene_next_gate', 'BUILD'),
  ('active_scene_render_generation_id', 'c0f1c0d3-9084-4e59-bac4-bb29f7eaf95d'),
  ('active_scene_stable_scene_id', '50107cb31c9eb0b7'),
  ('active_scene_arrival_region_id', 'd5e065e17ab1209b'),
  ('active_scene_next_scene_id', '625ec9923b87285b'),
  ('active_scene_next_arrival_region_id', '0618551b67d0082e');

INSERT INTO kb_sources(
  source_id, title, source_kind, scope, authority, status, location,
  captured_at, version_fingerprint, notes
) VALUES (
  'S-2026-10-06-AUTOMATED-SCENE-WORKFLOW',
  'DiceBox Automated Scene Workflow and Forest Maze Stage II Handoff',
  'project',
  'DiceBox Scene Injector workflow and current Fiend Machine Forest Maze Stage II state',
  'Accepted project workflow plus campaign continuity recorded in the Campaign Design Bible',
  'active',
  'docs/DICEBOX-AUTOMATED-SCENE-WORKFLOW-2026-10-05.md',
  '2026-10-06',
  'pass-auto-approval-v1',
  'Companion continuity source: campaign Design Bible document 1o_H7zPcwM0Zb_Ecsq2x_DIX5N6AKaRdBbca7sCeFyCA.'
);

INSERT INTO kb_facts(
  fact_id, domain, subject_no, title, statement, scope,
  evidence_class, status, source_id, supersedes_fact_id, tags
) VALUES
(
  'F-2026-10-06-AUTO-APPROVE',
  'dicebox.scene-workflow',
  NULL,
  'INSPECT PASS automatically approves render',
  'The creative workflow is PREPARE -> RENDER -> INSPECT(PASS = APPROVED | REDO) -> BUILD. A PASS atomically records approval for that exact render; there is no separate approval wait-state. APPROVE remains an optional redundant acknowledgment.',
  'project',
  'created_document',
  'locked',
  'S-2026-10-06-AUTOMATED-SCENE-WORKFLOW',
  NULL,
  'dicebox injector inspect pass approve build automation'
),
(
  'F-2026-10-06-AUTOMATION-TAIL',
  'dicebox.scene-automation',
  NULL,
  'Durable automated Scene workflow tail',
  'After BUILD, the durable automation tail is BUILD -> STAGE -> INJECT -> VERIFY -> RECEIPT. Desktop Commander owns durable workspace/state and local orchestration, PowerShell Relay owns idempotent browser-free command execution/transport, and Regionwright/Foundry remains the only authority for live Foundry document mutation.',
  'project',
  'created_document',
  'locked',
  'S-2026-10-06-AUTOMATED-SCENE-WORKFLOW',
  NULL,
  'desktop commander powershell relay regionwright foundry receipt state queue'
),
(
  'F-2026-10-06-L2-03-STATE',
  'campaign.fiend-machine-forest-maze',
  NULL,
  'L2-03 Leaning Waystone Hollow current state',
  'L2-03 is PREPARED and its current REDO render generation c0f1c0d3-9084-4e59-bac4-bb29f7eaf95d passed INSPECT. Under the automatic-approval rule, the current durable creative state is APPROVED and the next valid gate is BUILD. Stable Scene ID: 50107cb31c9eb0b7. Arrival-SOUTH Region ID: d5e065e17ab1209b.',
  'campaign',
  'created_document',
  'active',
  'S-2026-10-06-AUTOMATED-SCENE-WORKFLOW',
  NULL,
  'fiend machine forest maze stage ii l2-03 leaning waystone approved build'
),
(
  'F-2026-10-06-L2-03-ROUTE',
  'campaign.fiend-machine-forest-maze',
  NULL,
  'L2-03 route and forward continuity',
  'L2-03 arrival is SOUTH and is not selectable. Selectable routes are NORTHWEST, NORTH, NORTHEAST, EAST, WEST. WEST is correct and targets future L2-04 Scene 625ec9923b87285b arrival-EAST Region 0618551b67d0082e. NORTHWEST, NORTH, NORTHEAST, and EAST are wrong and return to L2-START.',
  'campaign',
  'created_document',
  'locked',
  'S-2026-10-06-AUTOMATED-SCENE-WORKFLOW',
  NULL,
  'l2-03 route west correct l2-04 reset l2-start'
),
(
  'F-2026-10-06-STAGE-II-RUNTIME-RULES',
  'campaign.fiend-machine-forest-maze',
  NULL,
  'Stage II Disorientation and discovery rules',
  'Stage II wrong routes use the per-character Disorientation Gauge: +1 Dread per wrong turn, 5/10/20/30-second anti-cheese delay tiers for rapid wrong turns within 60 seconds, reset teleport to L2-START, private route-specific whisper, and RollTable.DBoxDisorient001 at 3 Dread with Dread reset after a successful table result. Discoveries use NOTICE -> INTERPRET/SEARCH -> RECOVER with flat 1d20 Notice and one attempt per character until reset.',
  'campaign',
  'created_document',
  'locked',
  'S-2026-10-06-AUTOMATED-SCENE-WORKFLOW',
  NULL,
  'stage ii disorientation dread rolltable discovery notice'
);

INSERT INTO facts_fts(fact_id, title, statement, tags)
SELECT fact_id, title, statement, tags
FROM kb_facts
WHERE fact_id IN (
  'F-2026-10-06-AUTO-APPROVE',
  'F-2026-10-06-AUTOMATION-TAIL',
  'F-2026-10-06-L2-03-STATE',
  'F-2026-10-06-L2-03-ROUTE',
  'F-2026-10-06-STAGE-II-RUNTIME-RULES'
);

INSERT INTO kb_decisions(
  decision_id, topic, decision, rationale, scope, status, owner, source_id, next_review
) VALUES (
  'D-2026-10-06-INSPECT-PASS-APPROVES',
  'DiceBox Scene Injector approval gate',
  'A successful INSPECT PASS is the approval event for the exact render and moves durable state directly to APPROVED. A separate APPROVE command is optional and redundant.',
  'The user requested removal of the redundant approval wait-state so the map workflow can continue consistently and be automated without an unnecessary manual gate.',
  'project',
  'locked',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-06-AUTOMATED-SCENE-WORKFLOW',
  NULL
);

INSERT INTO decisions_fts(decision_id, topic, decision, rationale)
SELECT decision_id, topic, decision, rationale
FROM kb_decisions
WHERE decision_id = 'D-2026-10-06-INSPECT-PASS-APPROVES';

INSERT INTO kb_open_items(
  item_id, item_class, title, problem, next_action, evidence_needed,
  priority, status, owner, source_id
) VALUES (
  'O-2026-10-06-L2-03-BUILD',
  'implementation',
  'Build L2-03 Leaning Waystone Hollow',
  'The approved L2-03 render has not yet been compiled into the canonical single-Markdown/single-macro BUILD artifact and therefore cannot yet be staged or injected.',
  'Run BUILD for L2-03 using approved render generation c0f1c0d3-9084-4e59-bac4-bb29f7eaf95d; validate the artifact; then continue STAGE -> INJECT -> VERIFY -> RECEIPT when the desktop/relay path is available.',
  'Canonical BUILD validator PASS, exact approved-art binding, and later Foundry/Regionwright receipt bound to the BUILD SHA-256.',
  'P1',
  'in_progress',
  'DiceBox Campaign Helper Foreman',
  'S-2026-10-06-AUTOMATED-SCENE-WORKFLOW'
);

INSERT INTO kb_tools(
  tool_id, project_id, project_name, tool_name, tool_kind, invocation,
  location, capability, authority, evidence_status, source_id, tags
) VALUES
(
  'T-2026-10-06-DESKTOP-COMMANDER',
  'dicebox-campaign-helper',
  'DiceBox Campaign Helper',
  'Desktop Commander',
  'runtime',
  'Remote Desktop Commander MCP filesystem/process actions',
  'Authorized user-controlled computer via Remote Desktop Commander connector',
  'Durable local scene workspace, state.json, file hashes, validator invocation, queue staging, and receipt reads when online.',
  'Local orchestration only; never live Foundry document authority.',
  'active capability; availability must be reread per session',
  'S-2026-10-06-AUTOMATED-SCENE-WORKFLOW',
  'desktop commander automation filesystem process state queue'
),
(
  'T-2026-10-06-POWERSHELL-RELAY',
  'dicebox-campaign-helper',
  'DiceBox Campaign Helper',
  'Star*Tup PowerShell Relay',
  'runtime',
  'execute_powershell with stable requestId; poll_events for durable receipts',
  'Authorized persistent browser-free PowerShell relay',
  'Idempotent command execution and transport for staged DiceBox jobs.',
  'Execution/transport only; never live Foundry document authority.',
  'configured capability; current tunnel availability must be reread before use',
  'S-2026-10-06-AUTOMATED-SCENE-WORKFLOW',
  'powershell relay automation idempotency transport receipts'
),
(
  'T-2026-10-06-SCENE-STATE-VALIDATOR',
  'dicebox-campaign-helper',
  'DiceBox Campaign Helper',
  'DiceBox scene automation state validator',
  'verifier',
  'npm run injector:state:validate -- <state.json>',
  'tools/validate-dicebox-scene-state.mjs',
  'Validates durable dicebox-scene-automation-state/v1 gate evidence and prevents illegal state advancement.',
  'Deterministic local verifier only; does not certify Foundry runtime state.',
  'repository implementation',
  'S-2026-10-06-AUTOMATED-SCENE-WORKFLOW',
  'scene state validator durable workflow approval build receipt'
);

INSERT INTO tools_fts(
  tool_id, project_id, project_name, tool_name, invocation, location,
  capability, authority, tags
)
SELECT tool_id, project_id, project_name, tool_name, invocation, location,
       capability, authority, tags
FROM kb_tools
WHERE tool_id IN (
  'T-2026-10-06-DESKTOP-COMMANDER',
  'T-2026-10-06-POWERSHELL-RELAY',
  'T-2026-10-06-SCENE-STATE-VALIDATOR'
);

INSERT INTO kb_relationships(
  relationship_id, from_type, from_id, relation, to_type, to_id, notes
) VALUES
(
  'R-2026-10-06-WORKFLOW-DECISION',
  'decision',
  'D-2026-10-06-INSPECT-PASS-APPROVES',
  'governs',
  'fact',
  'F-2026-10-06-AUTO-APPROVE',
  'The decision is the normative authority for automatic approval on INSPECT PASS.'
),
(
  'R-2026-10-06-L2-03-NEXT-WORK',
  'fact',
  'F-2026-10-06-L2-03-STATE',
  'requires-next',
  'open_item',
  'O-2026-10-06-L2-03-BUILD',
  'Approved L2-03 state advances next to BUILD.'
);
