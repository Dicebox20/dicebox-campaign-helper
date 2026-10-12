-- 2026-10-07 complete source catalogue + successor handoff receipt. Documentary only.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-COMPLETE-SUCCESSOR-HANDOFF-CATALOG','DiceBox full project knowledge and file-metadata successor catalog, bounded 2026-10-07 checkpoint','verification','DiceBox Campaign Helper whole project and Central Lodge','Local authoritative AGENTS, latest checkpoint, read-only Foundry, 10 KB tables, source tree, full hash inventory and read-only bridge scope queries','active','handoffs/FOREMAN-NEXT-CHAT-COMPLETE-CATALOG-2026-10-07.md; handoffs/catalog-2026-10-07/','2026-10-07','live 21 scenes 202 regions 116 behaviors 33 items 134 macros, ledger rev1, kernel SHA6264c4..., bridge ChatGPT scope blocked','This is a handoff/index and metadata snapshot only, not Foundry data mutation. Reproducible database holds primary full KB. Successor must verify current authority and live state before new writes; old bridge live session is bound to old conversation and must not be assumed valid for successor.');
INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-COMPLETE-SUCCESSOR-HANDOFF-CATALOG','project.governance',NULL,'Current complete DiceBox project, KB and file metadata catalog for successor','A comprehensive successor handoff and machine-readable catalogue were written to handoffs/FOREMAN-NEXT-CHAT-COMPLETE-CATALOG-2026-10-07.md and handoffs/catalog-2026-10-07. The reproducible full KB remains in database schema/seed and SQLite, and the machine export inventories KB records and project/source-tree files with SHA256, byte counts and modification metadata. Last read-only Foundry verification PASS at 21 scenes, 202 Regions, 116 RegionBehaviors, 33 Items, 134 world Macros; ledger revision 1 with E1 recentUseObserved true. Codex Wide Bridge exact ChatGPT Foreman scope was observed BLOCKED with an unresolved acceptance receipt; Codex Foreman off; do not auto-send or reuse old session when starting a new conversation. This is documentation-only, not permission for gameplay canary or new installer replay.','project','static','locked','S-2026-10-07-COMPLETE-SUCCESSOR-HANDOFF-CATALOG',NULL,'dicebox full index successor handoff codex wide bridge runtime ledger revision1');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-07-COMPLETE-SUCCESSOR-HANDOFF-CATALOG'
AND NOT EXISTS(SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('dicebox_latest_nextchat_handoff','handoffs/FOREMAN-NEXT-CHAT-COMPLETE-CATALOG-2026-10-07.md'),
('dicebox_latest_full_kb_json_snapshot','handoffs/catalog-2026-10-07/all-kb-data-and-metadata.json'),
('dicebox_latest_full_project_file_manifest','handoffs/catalog-2026-10-07/project-file-metadata-sha256.json'),
('central_lodge_last_observed_ledger_revision','1'),
('central_lodge_region_behavior_count','116'),
('central_lodge_cl52_m2_audio_status','LIVE_ASSET_AND_GM_MACRO_INSTALLED_SOURCE_VERIFIED; CANARY_PENDING'),
('dicebox_bridge_handoff_status','READ_ONLY: legacy ChatGPT Foreman scope BLOCKED on unresolved acceptance; no relay sent');
