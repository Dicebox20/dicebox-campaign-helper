-- 2026-10-09 — user-approved DiceBox geometry tolerance v0.1.
-- Additive project-wide KB chronology; historical M02 attempt #5 REDO stays intact.
INSERT INTO kb_sources (
 source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES (
 'S-2026-10-09-GEOMETRY-TOLERANCE-V01',
 'DiceBox geometry tolerance standard v0.1 — accepted review PR #9',
 'project',
 'All DiceBox scene-map PREPARE, grayscale INSPECT, Blueprint/Manifest, Injector and desktop Map Lab checks',
 'Explicit user approval of proposal v0.1 in GitHub PR #9 on 2026-10-09; numeric tolerance bands are DiceBox-specific design policy',
 'active',
 'docs/DICEBOX-GEOMETRY-TOLERANCE-STANDARD-2026-10-09.md',
 '2026-10-09',
 'dicebox-geometry-tolerance/v0.1',
 'Preserve Gridless battlemap-120 scale and D&D5e Actor token footprint; enforce walkable route semantics, measurement uncertainty, authored bottlenecks, wall alignment and stage-specific validation. The historic M02 #5 REDO is archival evidence and is not overwritten.'
);
INSERT INTO kb_decisions (
 decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review
) VALUES (
 'D-2026-10-09-GEOMETRY-TOLERANCE-V01',
 'Official DiceBox structural map geometry tolerance and creature clearance',
 'User approved target 15ft main roads with preferred 10-20ft and target 10ft forest trails with preferred 5-15ft; no rigid upper width. Allow 5ft Medium-passable authored chokepoints; designated Large/Huge routes retain their required 10ft/15ft footprints. Wall ground-boundary placement target <=0.5ft, review 0.5-1ft, block >1ft or any functional collision, sight leak, false opening or trapped arrival. Ambiguous measurements/ground classes require reconciliation, not automatic image REDO. Exact battlemap-120 scaling and independent fresh-prompt REDO remain in force.',
 'Prior M02 redraws repeatedly rejected naturally narrow but potentially playable passages solely against arbitrary width targets. The accepted method separates aesthetic preferences, mechanical footprint, actual walkable surface and certainty rather than reducing quality with repeated generation.',
 'project','locked','DiceBox Campaign Helper Foreman','S-2026-10-09-GEOMETRY-TOLERANCE-V01',NULL
);
INSERT INTO kb_facts (
 fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES (
 'F-2026-10-09-GEOMETRY-TOLERANCE-POLICY',
 'dicebox.scene-geometry',NULL,
 'Inspector tolerance bands do not supersede creature collision',
 'Approved DiceBox geometry tolerance profile dicebox-geometry-tolerance/v0.1 separates appearance targets (15ft main with 10-20 preferred; 10ft trail with 5-15 preferred) from required D&D5e creature swept footprints. A passage can document natural deviation without structural REDO if continuous actual traversable ground and mechanical access are verified. Unknown paths or imprecise solid object outlines are reconciliation blockers, not automatic new image generations. Foundry token canary remains separately required.',
 'project','canonical','locked','S-2026-10-09-GEOMETRY-TOLERANCE-V01',NULL,
 'geometry tolerance route width main road trails 15ft 10ft 5ft sweep pixel uncertainty'
),(
 'F-2026-10-09-WALL-ALIGNMENT-POLICY',
 'dicebox.spatial-blueprint',NULL,
 'Grounded Wall 0.5ft target and strict functional integrity',
 'Ordinary solid ground obstacle Wall alignment <=0.5ft target, 0.5-1ft requires manual review, >1ft blocks geometry lock. Any blocked opening, collision, sight leak, trapped arrival or erroneous canopy Wall blocks regardless of width. Image visual edges are not automatically solid ground, and raster uncertainty must be recorded. Exact scale/coordinate reprojection remains unrelaxed.',
 'project','canonical','locked','S-2026-10-09-GEOMETRY-TOLERANCE-V01',NULL,
 'wall alignment spatial blueprint overhead mushroom ground collision canopy route safety'
);
INSERT INTO kb_open_items (
 item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id
) VALUES (
 'O-2026-10-09-M02-TOLERANCE-REINSPECTION',
 'reconciliation',
 'Reconcile M02 attempt five route semantics under accepted tolerance',
 'Original M02 attempt #5 REDO used universal 15ft/10ft visual minimums. New policy removes that automatic failure but does not prove both forest circuits physically navigable or certify a Blueprint.',
 'Produce separately versioned M02 attempt #5 tolerance reinspection tied to exact render hash; establish actual ground routes, 5ft Medium passage and Region access; reconcile geometry before a painterly lock.',
 'New dated visual/route receipt plus Blueprint/Region QA and ultimately swept-token fixture check; preserved original REDO.',
 'P1','open','DiceBox Campaign Helper Foreman','S-2026-10-09-GEOMETRY-TOLERANCE-V01'
),(
 'O-2026-10-09-TOLERANCE-RUNTIME-CERTIFICATION',
 'certification',
 'Certify geometry tolerance checks in Injector and Foundry movement canaries',
 'Pure TS route/wall tolerance checks and policy UI are not sufficient to prove token movement and sight in a live Foundry Scene; Map Lab is a no-write preview.',
 'Connect route tolerance evidence to a versioned spatial plan/Scene Injector runtime fixture and check swept-token footprints, arrival regions, collision and vision. Preserve current user-owned world state.',
 'Exact-stack Foundry isolated fixture independent runtime movement and sight receipts; one-macro BUILD compatibility.',
 'P1','open','DiceBox Campaign Helper Foreman','S-2026-10-09-GEOMETRY-TOLERANCE-V01'
);
INSERT INTO decisions_fts (decision_id,topic,decision,rationale)
 SELECT decision_id,topic,decision,rationale FROM kb_decisions WHERE decision_id='D-2026-10-09-GEOMETRY-TOLERANCE-V01';
INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id IN (
 'F-2026-10-09-GEOMETRY-TOLERANCE-POLICY',
 'F-2026-10-09-WALL-ALIGNMENT-POLICY'
);
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
 WHERE item_id IN (
 'O-2026-10-09-M02-TOLERANCE-REINSPECTION',
 'O-2026-10-09-TOLERANCE-RUNTIME-CERTIFICATION'
);
INSERT INTO kb_relationships (relationship_id,from_type,from_id,relation,to_type,to_id,notes) VALUES (
 'R-2026-10-09-GEOM-DECISION-FACT',
 'decision','D-2026-10-09-GEOMETRY-TOLERANCE-V01','governs',
 'fact','F-2026-10-09-GEOMETRY-TOLERANCE-POLICY',
 'Approved widths vs creature mechanical clearance'
),(
 'R-2026-10-09-GEOM-M02-FOLLOWUP',
 'fact','F-2026-10-09-GEOMETRY-TOLERANCE-POLICY','requires-next',
 'open_item','O-2026-10-09-M02-TOLERANCE-REINSPECTION',
 'Reinspect M02 without overwriting original attempt #5 REDO'
);
