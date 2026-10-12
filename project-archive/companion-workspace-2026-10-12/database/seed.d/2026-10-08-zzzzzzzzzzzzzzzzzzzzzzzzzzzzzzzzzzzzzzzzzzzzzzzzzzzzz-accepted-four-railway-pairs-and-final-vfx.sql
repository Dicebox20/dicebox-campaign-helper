-- Accepted Central Lodge user change: route topologies R1-R4 and final CL-93 lighting/VFX.
-- This changes *planning authority*, not live Foundry route flags or scene effects.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('S-2026-10-07-CL50-FOUR-ROUTES-CL93-FINAL-VFX',
 'User acceptance of exact railway routes and appended final Scene lighting and visual effects phase',
 'conversation','Central Lodge campaign roadmap / CL-50 and CL-93',
 'Direct user approval in DiceBox Campaign Helper ChatGPT conversation, exact historical live Region anchors independently verified by CL-50 no-write inspections',
 'active','docs/CENTRAL-LODGE-ROADMAP.md; docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md; this ChatGPT conversation',
 '2026-10-07','Accepted R1-R4 endpoints, final CL-93 visual phase, pre-implementation',
 'Author approves endpoint *topology*, not any unverified center coordinate, trigger behavior, teleport action, live state change, or night-event selection.');

INSERT OR REPLACE INTO kb_decisions(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review) VALUES
('D-2026-10-07-CL50-FOUR-BIDIRECTIONAL-RAILWAY-PAIRS',
 'CL-50 original railway tunnel mouth orientations resolved by direct user approval',
 'LOCKED approved R1 N1 East xsitdXO94BHJkYKX <-> T1 Mouth A ewIAYppRLvgIV1b7; R2 T1 Mouth B 91XmuJ9LGbsJY52W <-> N2 Tunnel A lYps0Z5806d0W8wX; R3 N2 Tunnel B shIAThge7cNy0JjT <-> T2 Mouth A 3OGR0atcJokXJo6b; R4 T2 Mouth B OOmnx3XAmw95E410 <-> N3 West foYsFHsLXtCbfiyR. These pairs provide canonical bidirectional route TOPOLOGY ONLY. They do not authorize specific landing points, immediate installer replay, or bypass of normal guarded PREVIEW / no-bounce GM approval / independent VERIFY / real-player canary. Existing T3 branch and F1 route bindings stay intact. N1 West, N3 East and N3 branch unlock stay undecided. The legacy T1/T2 orientation flags remain UNBOUND in live Foundry until a future guarded mutation.',
 'The user directly accepted the four west-to-east railway pairs from the previous Foreman proposal after reviewing the live visual/Region audits. Reconciles only the old T1/T2 orientation uncertainty, not other historically bundled blockers such as the global night trigger.',
 'campaign','locked','User (campaign GM)','S-2026-10-07-CL50-FOUR-ROUTES-CL93-FINAL-VFX','Guarded route implementation/GM-player canary'),
('D-2026-10-07-CL93-APPEND-FINAL-SCENE-LIGHT-VFX',
 'Central Lodge final roadmap phase CL-93 Scene lighting and visual effects',
 'LOCKED roadmap sequencing: add CL-93, titled exactly Scene lighting and visual effects, to the END of the Central Lodge campaign roadmap after CL-92 testing and verification. CL-93 is a scene-by-scene visual finishing and acceptance phase for all 21 unique geography Scenes. It does not supplant earlier CL-51 ownership/night-event implementation, alter the separate 16-stage DiceBox product workflow, permit mass activation of the 86 currently hidden AmbientLights, or approve an event-driven night trigger. Require scoped ownership, photosensitivity safety, replay/restore and independent player/GM visual acceptance.',
 'The user explicitly requested final visual polish after main mechanical and gameplay QA. Existing lighting/FX artifacts and ownership policy should be reused as inputs to this final pass rather than duplicating earlier infrastructure.',
 'campaign','locked','User (campaign GM)','S-2026-10-07-CL50-FOUR-ROUTES-CL93-FINAL-VFX','Start of CL-93 after CL-92');
INSERT INTO decisions_fts(decision_id,topic,decision,rationale)
 SELECT d.decision_id,d.topic,d.decision,d.rationale FROM kb_decisions d
 WHERE d.decision_id IN ('D-2026-10-07-CL50-FOUR-BIDIRECTIONAL-RAILWAY-PAIRS','D-2026-10-07-CL93-APPEND-FINAL-SCENE-LIGHT-VFX')
 AND NOT EXISTS(SELECT 1 FROM decisions_fts f WHERE f.decision_id=d.decision_id);

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CL50-ORIENTATION-APPROVED-LIVE-UNBOUND',
 'campaign.central-lodge.routes',NULL,'User approved R1-R4 railway terminal mapping, live navigation not installed',
 'User approval now resolves the R1-R4 bidirectional T1 and T2 Scene/Region pairing decision. Earlier older locked facts called mouth orientation UNRESOLVED_DO_NOT_GUESS; that statement accurately describes the PRE-approval time and remains historical. Live T1/T2 route fields still have null terminalA/B and orientationStatus UNBOUND_DO_NOT_GUESS until a separate guarded APPLY. No destination was bound and no player moved. N1 rail-power gate and N2 story observer still overlap exploratory landing centers; token-sized no-bounce landing strategy must be previewed before installing any reciprocal transitions. Global night trigger, N3 to T3 unlock and unspecified outer station mouths stay unresolved.',
 'campaign','canonical','locked','S-2026-10-07-CL50-FOUR-ROUTES-CL93-FINAL-VFX',NULL,
 'Central Lodge CL50 approved author route topology only pre-apply safe no-bounce'),
('F-2026-10-07-CL93-FINAL-PHASE-APPENDED',
 'campaign.central-lodge.roadmap',NULL,'Scene lighting and visual effects is last Central Lodge phase CL-93',
 'User accepted CL-93 Scene lighting and visual effects as the final campaign roadmap phase after CL-92 real gameplay and regression testing. The phase concerns 21 Scenes and reuses existing fixture ownership, ambient darkness, stateful night transitions, railway/power/ritual effects and background art safely. CL-51 still owns core light/event infrastructure; 86 AmbientLights remain hidden until a separate exact-owner/event decision. No lighting, particle, fog, Scene or visual runtime change is implied by this addition.',
 'campaign','canonical','locked','S-2026-10-07-CL50-FOUR-ROUTES-CL93-FINAL-VFX',NULL,
 'Central Lodge final phase scene lighting visual effects CL93 approved roadmap');
INSERT INTO facts_fts(fact_id,title,statement,tags)
 SELECT f.fact_id,f.title,f.statement,f.tags FROM kb_facts f
 WHERE f.fact_id IN ('F-2026-10-07-CL50-ORIENTATION-APPROVED-LIVE-UNBOUND','F-2026-10-07-CL93-FINAL-PHASE-APPENDED')
 AND NOT EXISTS(SELECT 1 FROM facts_fts ft WHERE ft.fact_id=f.fact_id);

UPDATE kb_open_items SET
 problem='Exact R1-R4 bidirectional N1/T1/N2/T2/N3 railway mouth topology has now been approved by the user. The world is not yet bound; both live T1 and T2 flags still explicitly say UNBOUND_DO_NOT_GUESS. Exploratory inner landing centers in N1/N2 may overlap rail-power gate / story observe Regions; N3->T3 branch unlock and remaining unapproved mouths still undecided.',
 next_action='With accepted four exact Scene/Region pairs in docs/CENTRAL-LODGE-ROADMAP.md, perform exact live Region stableID and token-size/Wall collision inspection; devise no-bounce two-way landing/consent/cooldown and incidental RegionBehavior handling; preview a single bounded route slice, guarded APPLY only after source contract and base checks; independent readback and player/GM canary.',
 evidence_needed='Frozen exact Scene/Region stable IDs and current hashes; movement/Wall/active-token and overlapping gate/notice analysis for an actual token footprint; reciprocal no-bounce guard; approved PREVIEW and narrow reversible APPLY receipt; actual player client canary.',
 source_id='S-2026-10-07-CL50-FOUR-ROUTES-CL93-FINAL-VFX',
 status='in_progress'
 WHERE item_id='O-2026-10-07-CL33-ROUTE-TOPOLOGY';
DELETE FROM open_items_fts WHERE item_id='O-2026-10-07-CL33-ROUTE-TOPOLOGY';
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-07-CL33-ROUTE-TOPOLOGY';

INSERT OR REPLACE INTO kb_open_items(item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id)
VALUES
('O-2026-10-07-CL93-FINAL-VISUAL-PASS','implementation',
 'CL-93 Scene lighting and visual effects final stage',
 'Final 21-Scene visual/presentation pass is user-approved for the END of Central Lodge roadmap after CL-92. Existing 86 hidden lights include 18 inferred inactive tunnel placeholders; scene/event ownership and night trigger remain unresolved.',
 'After CL-92 gate, audit light fixture ownership per Scene, scene effects, authentic player-visible readability, VFX safety and night-state orchestration; use existing CL-51 infrastructure; stage bounded reversible per-Scene changes with GM/player visual acceptance, never blanket-activate fixtures.',
 'Scene-specific visual design, GM-approved night story event, authoritative fixture ownership, exact preview and apply receipts, Wall light containment, no-strobe/flash, performance and visual-player review for all 21 Scenes.',
 'P2','blocked','Foreman','S-2026-10-07-CL50-FOUR-ROUTES-CL93-FINAL-VFX');
INSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-07-CL93-FINAL-VISUAL-PASS'
 AND NOT EXISTS(SELECT 1 FROM open_items_fts ft WHERE ft.item_id=kb_open_items.item_id);

INSERT OR REPLACE INTO kb_milestones(milestone_id,milestone,goal,deliverables,exit_gate,dependencies,status,source_id) VALUES
('M-2026-10-07-CL93-SCENE-LIGHTING-AND-VFX',
 'CL-93 Scene lighting and visual effects — FINAL Central Lodge phase',
 'Finalize coherent scene lighting and visual effects after mechanical gameplay QA, without changing campaign geometry or puzzle logic.',
 '21-Scene fixture/effect ownership matrix; staged light/night/ritual/railway visual plans and bounded guarded installs; independent wall/light state, replay, performance and GM/player visual receipts.',
 'Every applicable Scene has photosensitivity-safe, state-restorable, player-accepted visual lighting and effects with verified owner and no damage to story or mechanics; unresolved defects explicitly documented.',
 'CL-92 gameplay and verification, CL-51 safe fixture/event infrastructure, explicit owner-approved night trigger if using day/night transition.',
 'planned','S-2026-10-07-CL50-FOUR-ROUTES-CL93-FINAL-VFX');
INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
 ('central_lodge_roadmap_current','docs/CENTRAL-LODGE-ROADMAP.md'),
 ('central_lodge_active_checklist_current','docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md'),
 ('central_lodge_cl50_route_topology_approval','USER_APPROVED_R1_R2_R3_R4_BIDIRECTIONAL; LIVE_UNBOUND_GUARDED_PREVIEW_REQUIRED'),
 ('central_lodge_roadmap_final_phase','CL-93 Scene lighting and visual effects; after CL-92');
