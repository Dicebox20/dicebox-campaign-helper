-- CL-92 installed routes and one-shot audio: independent READ-ONLY client/canary readiness.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CL92-CLIENT-CANARY-READINESS',
 'CL-92 independent source-hash and real-player presence preflight',
 'verification','Central Lodge E1/T3 travel, M1/M2 horror cues',
 'Live Foundry 14.367/dnd5e 5.3.3 authorized Assistant Gamemaster no-write inspection against frozen installer SHA receipts',
 'active',
 'docs/CL92-PLAYER-CANARY-READINESS-2026-10-07.md; work/foundry-playwright-harness/cl92-player-canary-readiness-v001.page.js',
 '2026-10-07','21/202/116/33, 134 macros, ledgerRev1, five SHA matches; nonGM=0',
 'No Macro was executed, no Region entered by test token, no player scene movement or audio playback. Requires actual non-GM user at next test window.');
INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CL92-READONLY-FIVE-CANARIES-PENDING',
 'campaign.central-lodge.qa',NULL,
 'CL-92 five installed route/audio canaries source-verified but no real players',
 'Fresh live source SHA256 checks matched three installed RegionBehaviors E1-to-M1 HBtxj5OwVSOJdqnC, T3-to-F1 tSqhDN5CtAHzccmf, and T3-to-N3 pZpcYXFn517t6L5U, each enabled with tokenEnter event. M1 distant footsteps Macro P7mgEkmAUiJXYdUD and M2 haunted piano Macro VHVC7yVlrNS7mWGJ source hashes matched receipts and both Scene one-shot flags were absent/unconsumed. 134 world Macros and ledger revision 1 held. Two GMs were active but zero non-GM players were connected to matching Scenes; therefore all five GM/player canaries deferred. No effect was executed. Check user presence and authority anew before any canary; do not confuse static/source verification with player acceptance.',
 'campaign','local','active','S-2026-10-07-CL92-CLIENT-CANARY-READINESS',NULL,
 'CL92 player audio playback travel acceptance preflight no-player readonly');
INSERT INTO facts_fts(fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts
 WHERE fact_id='F-2026-10-07-CL92-READONLY-FIVE-CANARIES-PENDING'
 AND NOT EXISTS(SELECT 1 FROM facts_fts ff WHERE ff.fact_id=kb_facts.fact_id);
INSERT OR REPLACE INTO kb_open_items(item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id) VALUES
('O-2026-10-07-CL92-FIVE-PLAYER-CANARIES',
 'certification','CL-92 real-player travel and audio canaries outstanding',
 'All three installed travel RegionBehaviors and both GM one-shot audio Macros have certified installed source SHA, but none of the five has an actual non-GM/player confirmation; only the Gamemaster and Assistant Gamemaster were logged in during preflight.',
 'At the next game session, primary GM and player in matching Scene should conduct a single bounded E1-to-M1 or T3-to-F1/N3 travel canary, or M1/M2 cue after deliberate GM manual confirmation. Record delivery, source and destination, no bounce, one-shot flag and client observations. Never automatically fire existing one-shot audio or repeat uncertain playback.',
 'Real non-GM player online in source Scene, primary active GM, exact authorized behavior/Macro version; playback/travel readbacks and explicit player confirmation.',
 'P1','blocked','Foreman + Primary GM','S-2026-10-07-CL92-CLIENT-CANARY-READINESS');
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
 WHERE item_id='O-2026-10-07-CL92-FIVE-PLAYER-CANARIES'
 AND NOT EXISTS(SELECT 1 FROM open_items_fts ofts WHERE ofts.item_id=kb_open_items.item_id);
INSERT OR REPLACE INTO kb_tools(tool_id,project_id,project_name,tool_name,tool_kind,invocation,location,capability,authority,evidence_status,source_id,tags) VALUES
('TOOL-2026-10-07-CL92-CANARY-READINESS',
 'dicebox-campaign-helper','DiceBox Campaign Helper',
 'CL-92 live installed-cue/route source and player-presence readiness audit','verifier',
 'From work/foundry-playwright-harness: node exec-page.mjs read cl92-player-canary-readiness-v001.page.js',
 'work/foundry-playwright-harness/',
 'Reads installed RegionBehavior and Macro source SHA, tokenEnter events, audience presence and one-shot flags; never executes or sends effects.',
 'Authorized Assistant Gamemaster read-only project harness, no player spoofing or live canary authority.',
 'PASS_WITH_DEFERRED_PLAYER_CANARIES','S-2026-10-07-CL92-CLIENT-CANARY-READINESS','CL92 player canary readiness noWrite');
INSERT INTO tools_fts(tool_id,project_id,project_name,tool_name,invocation,location,capability,authority,tags)
 SELECT tool_id,project_id,project_name,tool_name,invocation,location,capability,authority,tags FROM kb_tools
 WHERE tool_id='TOOL-2026-10-07-CL92-CANARY-READINESS'
 AND NOT EXISTS(SELECT 1 FROM tools_fts tf WHERE tf.tool_id=kb_tools.tool_id);
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_cl92_canary_readiness','PASS_WITH_DEFERRED_PLAYER_CANARIES; 5/5 live SHA matches; GM=2 player=0; audio flags absent; no gameplay effected'),
('central_lodge_cl92_canary_readiness_receipt','docs/CL92-PLAYER-CANARY-READINESS-2026-10-07.md');
