-- 2026-10-23 Cabin in the Ashen Veil long chat archival handoff.
-- Reproducible KB additive catalogue. Historical conversation transcript is partial by disclosed
-- availability; do not invent a lossless assistant/tool transcript.
-- Scope: campaign-specific; existing universal renderer standards unchanged.

INSERT INTO kb_sources (source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-23-CAV-MAP-CHAT-HANDOFF',
 'Cabin in the Ashen Veil — owner conversation transcript, metadata and continuation handoff',
 'conversation','campaign: Cabin in the Ashen Veil / map art',
 'Exact visible owner statements plus dated owner approvals in current campaign register and receipts',
 'active','campaign-archives/cabin-in-the-ashen-veil/chat-archives/2026-10-23-map-production-available-transcript.md',
 '2026-10-24','cav-map-chat-handoff/v1',
 'Transcript is NOT lossless: skipped assistant/tool/image messages unavailable. Full set of visible owner turns recorded; separate metadata/handoff and MEDETA entry are cross-linked.'),
('S-2026-10-23-CAV-AI-BATTLEMAP-RESEARCH',
 'Campaign-specific geometry-first AI battlemap research and Tom Cartos library review',
 'research','campaign: Cabin in the Ashen Veil / H-G06 map research',
 'Owner-requested research on Oct 23; compared firsthand Tom Cartos pages with qualified Reddit production reports',
 'active','campaign-archives/cabin-in-the-ashen-veil/community-ai-battlemap-and-tom-cartos-library-workflow-audit-2026-10-23.md',
 '2026-10-23','cav-ai-battlemap-research/v1',
 'Technical geometry-first proposal; Tom Cartos license restricts actual artwork uses in AI workflows; no actual art reuse authorized.');

INSERT INTO kb_facts (fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-23-CAV-MAP-ART-CENSUS','cabin-ashen-veil.map-art',NULL,
 'Owner-approved campaign battlemap census at October 23 handoff',
 'The current structured PREPARE contains 56 logical design cards and 45 grouped base-map targets (Bathhouse minus 7, Aqueduct minus 1, Forest Maze minus 3). Owner visually approved 18 base-map targets and 27 remain: 21 other cabin room/roof scenes, 3 remaining estate grounds (EXT-03, EXT-04, EXT-08), and 3 Undercroft/finale scenes. This is ART acceptance only, not Foundry build verification.',
 'campaign','created_document','active','S-2026-10-23-CAV-MAP-CHAT-HANDOFF',NULL,
 'map count 18 45 27 approved owner cabin greenhouse foyer'),
('F-2026-10-23-CAV-FOYER-EXACT-ART','cabin-ashen-veil.map-art',NULL,
 'Foyer H-G02 approved attempt 3 is immutable exact source',
 'Owner approved third Foyer image rustic_foyer_and_hidden_stairwell_map.png (gen f6fb7e04-0835-4481-906f-35c83bb8502d, SHA-256 34c5e7dab1193893ef6e557745e85821362f76741464567a73120a689cb6b1e8), with south Foyer entry, north Great Room door and east enclosed basement stairwell behind a locked door. Foundry lock/vision collision not verified.',
 'campaign','created_document','active','S-2026-10-23-CAV-MAP-CHAT-HANDOFF',NULL,
 'foyer BWE027 owner approved stairs locked Weathered Key 3'),
('F-2026-10-23-CAV-GREATROOM-BLOCK','cabin-ashen-veil.map-art',NULL,
 'Great Room H-G06 art rejected and physical room dimensions require review',
 'Owner rejected Great Room text-only render generation a7c8bbde-a17c-4329-9997-bf7eea9c4069 as too small and generation f4150872-49e3-4a7a-ac4a-d5d2ceb01ff3 as another failure. The BWE-027 accepted survey labels the Great Room 14x16ft, approximately 9 five-foot token cells before stairs and substantial fixtures. A coherent enlarged geometry is UNAPPROVED and must be reconciled with Foyer, Dining, Study, Family and upper Landing before another image render.',
 'campaign','created_document','active','S-2026-10-23-CAV-MAP-CHAT-HANDOFF',NULL,
 'great room H-G06 undersized 14x16 5ft token room scale blocked no render'),
('F-2026-10-23-CAV-GEOMETRY-FIRST-RESEARCH','cabin-ashen-veil.map-research',NULL,
 'Community battlemap pattern favors validated layout plus controlled illustration',
 'Community reports demonstrate Donjon/Dungeondraft/structural sketch -> conditioned img2img/ControlNet / localized illustration approaches. These improve map control but do not guarantee exact geometry. Tom Cartos published room-scale composition and unfurnished/furnished layer principles are inspiration only; licensed Tom Cartos raster/asset files cannot be incorporated into this AI pipeline without confirmed rights.',
 'campaign','created_document','provisional','S-2026-10-23-CAV-AI-BATTLEMAP-RESEARCH',NULL,
 'ai battlemaps source geometry Dungeondraft ControlNet ComfyUI Tom Cartos license');

INSERT INTO kb_decisions (decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review) VALUES
('D-2026-10-23-CAV-NO-FURTHER-FREEFORM-GREATROOM',
 'Cabin in the Ashen Veil Great Room image-render gate at handoff',
 'Owner rejected two Great Room renders and directed community and Tom Cartos research. Hold additional H-G06 painterly generation pending a blueprint-scale/circulation reconciliation and an independently verified structural map. The canonical global inclusion-only, clean-restart, representative-wall and neutral-light requirements remain in force.',
 'Physical scale mismatch and invented/incorrect genre scene architecture; user expressly requested process review instead of another immediate freeform output.',
 'campaign','locked','Dicebox Campaign Helper project owner','S-2026-10-23-CAV-MAP-CHAT-HANDOFF',NULL),
('D-2026-10-23-CAV-GEOMETRY-PILOT-PROPOSAL',
 'Proposed staged geometry-first canary for H-G06',
 'Investigate two measured Great Room plan candidates (30x35ft and 35x40ft are exploratory examples only) with all five connections, fixed critical fixtures and 5ft token clearances; preserve accepted Foyer raster. Seek owner approval of coherent physical house-scale revision before source promotion and painterly render. Alternative technical approaches need tool capability/licensing tests.',
 'Recent research and cartographic examples suggest separating deterministic architecture from painterly details improves scene and token correctness.',
 'campaign','proposed','Dicebox Campaign Helper project owner','S-2026-10-23-CAV-AI-BATTLEMAP-RESEARCH',NULL);

INSERT INTO kb_open_items (item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id) VALUES
('O-2026-10-23-CAV-GREATROOM-COHERENT-SCALE',
 'reconciliation','Owner-scale revision for BWE-027 Great Room and linked house rooms',
 'Great Room 14x16ft from owner-selected plan cannot comfortably support all requested landmarks, walkable tokens and staircase; recent larger generative render attempts were rejected. No owner-approved new dimensional layout.',
 'Produce deterministic two-size structural comparison showing S Foyer, W Dining, E locked Study, N Family Area and upper staircase with safe clearances. Audit adjacent room alignment and preserve approved Foyer image. Submit layout choice to owner before painting.',
 'Measured vector/graybox plan, 5ft token clearance check, five portal comparisons, owner approval of coherent new geometry or explicit scale exception.',
 'P0','blocked','Dicebox Campaign Helper Foreman','S-2026-10-23-CAV-MAP-CHAT-HANDOFF'),
('O-2026-10-23-CAV-PROMPT-ISOLATION-PROVIDER',
 'certification','Verify inclusion-only renderer text and clean restart provenance',
 'LLM-generated prompts may leak unwanted scene terms to provider even as negations; automatic image interfaces may infer hidden prompt from broad chat context.',
 'Author separate positive-only renderer capsule; review every included object against approved PREPARE; verify adapter prompt payload and gate no reuse of rejected raster/prompt before next render.',
 'Preflight capsule and audit receipt; exact payload evidence where provider surfaces it, isolated conditioning test where available.',
 'P1','open','Dicebox Campaign Helper Foreman','S-2026-10-23-CAV-MAP-CHAT-HANDOFF'),
('O-2026-10-23-CAV-FULL-TRANSCRIPT-RETRIEVAL',
 'research','Preserve original lossless long-chat transcript if user export becomes available',
 'This archival task cannot see skipped original assistant/tool/image turns; current repo archive includes verbatim visible owner turns and honest assistant activity summaries, not a full lossless transcript.',
 'If an authorized original ChatGPT conversation export is provided later, append the untouched raw artifact and full source hash with a supersession note, retaining the partial reconstruction as historical provenance.',
 'Native conversation export and timestamps/role identifiers; independent complete count/hash.',
 'P2','open','Dicebox Campaign Helper project owner','S-2026-10-23-CAV-MAP-CHAT-HANDOFF');

INSERT INTO kb_trials (trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id) VALUES
('TR-2026-10-23-CAV-GREATROOM-FREEFORM-1','H-G06 Great Room',
 'Owner reported physically cramped Great Room',
 'Single text-to-image render a7c8bbde-a17c-4329-9997-bf7eea9c4069 of Great Room',
 'The fixed map was too small for main hub circulation and separate stair, hearth, clock, blueprint and 027 anchors.',
 'Do not reuse failed image/prompt; reconcile true dimensions and create fixed structural plan before painterly work.',
 'OWNER_REDO_DOCUMENTED','S-2026-10-23-CAV-MAP-CHAT-HANDOFF'),
('TR-2026-10-23-CAV-GREATROOM-FREEFORM-2','H-G06 Great Room',
 'Owner rejected another Great Room despite workflow prompt revision',
 'Single text-to-image render f4150872-49e3-4a7a-ac4a-d5d2ceb01ff3',
 'Uncontrolled model scene composition and the source 14x16ft physical geometry remained inadequate.',
 'Research geometry-first structural locking and isolated rendering; no automatic further candidate.',
 'OWNER_REDO_DOCUMENTED','S-2026-10-23-CAV-MAP-CHAT-HANDOFF');

INSERT INTO kb_milestones (milestone_id,milestone,goal,deliverables,exit_gate,dependencies,status,source_id) VALUES
('M-2026-10-23-CAV-GREATROOM-GEOMETRY-PILOT',
 'H-G06 Great Room structure-first canary',
 'Resolve real room scale and owner-approved architecture before any more freeform Great Room art.',
 'Two measured structural size options and comparison receipt; five paired entrances, stair/hearth/furnishing footprints; owner decision; independent future positive-only painting prompt.',
 'Owner approves a spatially coherent dimensional plan and deterministic token-clearance verifier PASS before any render.',
 'Owner BWE-027 blueprint, current master H-G06 PREPARE, accepted H-G02 exact Foyer, global DiceBox map standards.',
 'blocked','S-2026-10-23-CAV-AI-BATTLEMAP-RESEARCH');

INSERT INTO kb_relationships (relationship_id,from_type,from_id,relation,to_type,to_id,notes) VALUES
('R-2026-10-23-CAV-HANDOFF-BLOCK','source','S-2026-10-23-CAV-MAP-CHAT-HANDOFF','records','open_item','O-2026-10-23-CAV-GREATROOM-COHERENT-SCALE','Latest owner geometry blocker'),
('R-2026-10-23-CAV-RESEARCH-PILOT','source','S-2026-10-23-CAV-AI-BATTLEMAP-RESEARCH','motivates','decision','D-2026-10-23-CAV-GEOMETRY-PILOT-PROPOSAL','Research proposal; not adopted house scale'),
('R-2026-10-23-CAV-BLOCK-MILESTONE','open_item','O-2026-10-23-CAV-GREATROOM-COHERENT-SCALE','blocks','milestone','M-2026-10-23-CAV-GREATROOM-GEOMETRY-PILOT','Owner geometry authority required');

INSERT INTO facts_fts (fact_id,title,statement,tags)
 SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id IN
 ('F-2026-10-23-CAV-MAP-ART-CENSUS','F-2026-10-23-CAV-FOYER-EXACT-ART','F-2026-10-23-CAV-GREATROOM-BLOCK','F-2026-10-23-CAV-GEOMETRY-FIRST-RESEARCH');
INSERT INTO decisions_fts (decision_id,topic,decision,rationale)
 SELECT decision_id,topic,decision,rationale FROM kb_decisions WHERE decision_id IN
 ('D-2026-10-23-CAV-NO-FURTHER-FREEFORM-GREATROOM','D-2026-10-23-CAV-GEOMETRY-PILOT-PROPOSAL');
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
 SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items WHERE item_id LIKE 'O-2026-10-23-CAV-%';
INSERT INTO trials_fts (trial_id,area,symptom,attempted_approach,failure_cause,correction)
 SELECT trial_id,area,symptom,attempted_approach,failure_cause,correction FROM kb_trials WHERE trial_id LIKE 'TR-2026-10-23-CAV-%';
