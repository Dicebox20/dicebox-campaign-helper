-- Final independent cross-feature no-write CL90 smoke and updated CL50 current route frontier.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CL90-E1M1-CL52-FINAL-SMOKE','CL90 regression smoke for E1->M1 and M1 footsteps GM cue','verification','Central Lodge whole campaign','Independent Foundry Playwright read-only source/ledger/model checks following CL50+CL52 installs','active','work/foundry-playwright-harness/cl90-progress-safety-smoke-v002.page.js; docs/CL50-E1M1-CL52-M1-AUDIO-INSTALL-RECEIPT-2026-10-07.md','2026-10-07','21/202/116/33, 116 unique IDs, 0 disabled, macro count 133','PASS_WITH_KNOWN_BLOCKERS, zero failures: 21 Scenes, 202 Regions, 116 enabled behaviors all unique stable IDs, 33 Items, ledger rev0 and kernel hash unchanged; E1M1 RegionBehavior and M1 footsteps Macro source hash pinned, Scene cue flag unconsumed. No live player/audio/teleport canary.'),
('S-2026-10-07-CL52-M1-AUDIO-LIVE-RECEIPT','CL52 M1 audio world asset and macro installation complete handoff receipt','verification','Central Lodge CL52','Source provenance/Windows SHA/Foundry static file serving/independent source verification','active','docs/CL50-E1M1-CL52-M1-AUDIO-INSTALL-RECEIPT-2026-10-07.md','2026-10-07','WAV 1056044 bytes; SHA3e29666...; GM macro P7mgEkmAUiJXYdUD','Cue installation only, one-shot consumption flag not set, no players active in M1 at verification; restore recipe documented but not executed; cross-client audio canary deferred.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CL90-E1M1-CL52-REGRESSION-SMOKE','campaign.central-lodge.qa',NULL,'CL90 read-only cross-feature regression PASS at 21/202/116/33','After independently verified CL50 E1 to M1 front door RegionBehavior installation and CL52 M1 original audio GM Macro installation, cl90-progress-safety-smoke-v002.page.js returned PASS_WITH_KNOWN_BLOCKERS with zero failures: 21 Scenes/202 Regions/116 enabled unique RegionBehaviors/33 canonical Items, macro count 133, ledger revision 0, kernel SHA 6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814, exact new source hashes unchanged, M1 one-shot Scene flag unconsumed. No player/GM audio or teleport canary. Blocking M1 clock and N3 branch states remain unchanged.','campaign','static','locked','S-2026-10-07-CL90-E1M1-CL52-FINAL-SMOKE',NULL,'central lodge cl90 regression 116 region behaviors m1 audio cue no drift');
INSERT INTO facts_fts(fact_id,title,statement,tags) SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CL90-E1M1-CL52-REGRESSION-SMOKE' AND NOT EXISTS(SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);

UPDATE kb_open_items SET status='in_progress',
 problem='CL50 has verified E1 to M1 front entrance plus previous T3 to F1, T3 to N3, and existing F1 to F2; many other cross-Scene travel anchors remain unbound or future-stage. 202/116 global state source-certified, no controlled player travel canary yet.',
 next_action='Reconcile remaining direction/topology especially T1/T2 Mouth A/B and N3 to T3 unlock. Do not infer connections from geometry alone. Plan one-way optional M1 to E1 return only after safe no-bounce event confirmation and route authority.',
 evidence_needed='Canonical adjacent Scene/Region pair topology and controlled token origin/GM confirmation/reentry testing.'
 WHERE item_id='O-2026-10-07-CL50-REMAINING-TRANSITIONS';

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_catalog_version','2026-10-07.cl50-e1m1-cl52-m1-audio-final-smoke-v001'),
('central_lodge_cl90_progress_smoke_status','PASS_WITH_KNOWN_BLOCKERS; v002; 21/202/116/33; macro count 133; one-shot false'),
('central_lodge_cl52_m1_audio_status','FOUNDRY_WAV_AND_GM_MACRO_INSTALLED_INDEPENDENTLY_VERIFIED; player playback canary pending'),
('central_lodge_cl52_m1_audio_player_canary','PENDING_NO_PLAYBACK'),
('central_lodge_region_behavior_count','116');
