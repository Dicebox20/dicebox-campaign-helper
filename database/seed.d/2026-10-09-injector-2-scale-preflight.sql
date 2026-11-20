-- 2026-10-09: Accepted DiceBox scale-preflight hardening, Injector 2.0 prototype.
-- Additive chronological delta; preserves prior scene/maze/campaign decisions.
INSERT INTO kb_sources(
  source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES (
  'S-2026-10-09-INJECTOR-2-SCALE',
  'DiceBox Injector 2.0 scaling research and first M01 preview',
  'project',
  'DiceBox Campaign Helper Scene Creation/Injector workflow',
  'User accepted retaining the 120px/5ft default and grounding grid/token/art sizes in Foundry documentation; Injector 2.0 designated prototype, not certified production injector',
  'active',
  'docs/DICEBOX-GRID-TOKEN-RESOLUTION-RESEARCH-2026-10-09.md',
  '2026-10-09',
  'injector2-scale-preview-20261009',
  'Companion prototype: tools/dicebox-injector-v2-core.mjs; exact M01 live inspection found 1536x1024, 64px/5ft, default Level image installed, 0 walls/lights/Regions, 237 world scenes. No live mutation during the preview.'
);
INSERT INTO kb_decisions(
 decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review
) VALUES (
 'D-2026-10-09-INJECTOR-2-SCALE',
 'DiceBox Injector 2.0 grid, token and art scaling',
 'Retain Gridless battlemap-120 (120px per 5ft) as project default, and existing high-quality overhead token source targets. PREPARE must explicitly lock approved physical feet, logical cells, native source raster, final Scene dimensions and map-to-scene coordinate transform. BUILD must block missing approval, mixed coordinate transforms, grid-size-only fixes and silent scene rescaling. Token Scale Ratio never repairs physical or grid scale.',
 'The user accepted the Foundry-documentation-based recommendation on 2026-10-09. M01 demonstrates that image dimensions do not independently establish the intended physical map footprint.',
 'project','locked','DiceBox Campaign Helper Foreman',
 'S-2026-10-09-INJECTOR-2-SCALE',NULL
);
INSERT INTO kb_facts(
 fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES (
 'F-2026-10-09-INJECTOR-2-PREVIEW',
 'dicebox.scene-injector',NULL,
 'Injector 2.0 prototype preflight is no-write and scale-sensitive',
 'Initial pure no-write Injector 2.0 preview checks semantic identity, GM/runtime authority, approved physical footprint, scale arithmetic, art path/hash/raster, uniform coordinate mapping, Region mechanic inventory, unresolved runtime UUIDs, and existing Scene scale conflicts. A 26-case Node self-test passed on 2026-10-09. This is not yet a full runtime installation certification.',
 'project','deterministic','provisional','S-2026-10-09-INJECTOR-2-SCALE',NULL,
 'injector 2.0 prototype preflight self-test scene scale github'
),(
 'F-2026-10-09-M01-LIVE-READBACK',
 'campaign.beyond-the-realms',NULL,
 'M01 existing scene requires scale reconciliation',
 'Read-only Foundry 14.367 / dnd5e 5.3.3 observation: M01 The Forgotten Road uniquely exists under Beyond the Realms — Underdark Expedition; approved background on default Level; 1536x1024 pixels, Gridless 64px per 5ft; walls 0, lights 0, Regions 0. 64px mathematically implies 24x16 cells, but physical footprint has not been independently approved. No resize or new objects were written.',
 'campaign','safe_use','provisional','S-2026-10-09-INJECTOR-2-SCALE',NULL,
 'M01 forgotten road footprint scale preflight 24x16 existing scene'
);
INSERT INTO kb_open_items(
 item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id
) VALUES (
 'O-2026-10-09-M01-FOOTPRINT',
 'reconciliation','M01 approved physical footprint for Injector 2.0',
 'Installed M01 is 1536x1024 at Gridless 64px; a proposed 24x16 logical footprint is inferred from its current Scene settings rather than user-approved PREPARE physical dimensions.',
 'Reconcile M01 PREPARE physical extent and image-to-map geometry. Record explicit logical dimensions and migration plan, then run no-write scale preflight before generating one validated single-macro BUILD.',
 'Approved PREPARE footprint and scale binding, uniform transform, geometry/clearance alignment checks, no-write preflight receipt.',
 'P1','open','DiceBox Campaign Helper Foreman','S-2026-10-09-INJECTOR-2-SCALE'
),(
 'O-2026-10-09-INJECTOR-2-CERTIFICATION',
 'certification','Injector 2.0 full-scene installer certification',
 'Initial prototype only proves deterministic no-write preflight and a Foundry read-only canary, not Scene/Level/Wall/Region/RegionBehavior writes or playability.',
 'Develop isolated runtime install/reconcile fixture, check full Regionwright API effects, idempotent reruns, recovery after interrupted writes, native behavior routing and authoritative receipts before calling Injector 2.0 production-ready.',
 'Canonical single-Markdown build validator, isolated Foundry fixture receipt, exact-stack active GM readback and player/GM canaries.',
 'P1','open','DiceBox Campaign Helper Foreman','S-2026-10-09-INJECTOR-2-SCALE'
);
INSERT INTO decisions_fts(decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions WHERE decision_id='D-2026-10-09-INJECTOR-2-SCALE';
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id IN (
 'F-2026-10-09-INJECTOR-2-PREVIEW','F-2026-10-09-M01-LIVE-READBACK'
);
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items WHERE item_id IN (
 'O-2026-10-09-M01-FOOTPRINT','O-2026-10-09-INJECTOR-2-CERTIFICATION'
);
INSERT INTO kb_relationships(relationship_id,from_type,from_id,relation,to_type,to_id,notes) VALUES (
 'R-2026-10-09-INJECTOR-2-DECISION','decision','D-2026-10-09-INJECTOR-2-SCALE',
 'governs','fact','F-2026-10-09-INJECTOR-2-PREVIEW','Accepted scale decision governs Injector 2.0 prototype'
),(
 'R-2026-10-09-M01-SCALE-BLOCKER','fact','F-2026-10-09-M01-LIVE-READBACK',
 'requires-next','open_item','O-2026-10-09-M01-FOOTPRINT','Do not silently infer gameplay area from image dimensions.'
);
