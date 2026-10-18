-- Reproducible local GEOMETRY evidence for the accepted V2.1 Beta Dark Arch fixture.
-- Does not promote active product stage, certify provider artwork, or mutate Foundry.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('SRC-2026-10-16-DARK-ARCH-M01-GEOMETRY-LOCAL',
 'Dark Arch M01 V2.1 Beta pure geometry and gate-invariant test receipt',
 'verification','local-geometry','deterministic local fixture','recorded',
 'handoffs/2026-10-16-dark-arch-scene-injector-v2-1-beta/geometry-inspection.json',
 '2026-10-16','dicebox-geometry-blueprint/v2.1-beta-preview',
 'The fixture also includes a typed spatial-blueprint.json, reproducible author_geometry.py, and annotated geometry-preview.png; no live Foundry canary or image-provider art.');

INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-16-DARK-ARCH-M01-GEOMETRY-LOCAL',
 'scene',NULL,'Dark Arch M01 three-route geometry local-only inspection PASS',
 'Dark Arch V2.1 Beta generated a 40x24, 120px-per-5ft gridless typed geometry fixture with 20ft main bridge, 15ft controllable gate, 15ft water opening for a separate skiff, and hoist rope clearing a 30ft wall top by 5.667ft. Medium and Large through-gate footprints passed with gate open; direct route blocked with gate shut; both the boat dock staircase and rope landing connect to the postgate approach in modeled path tests. Vertical traversal, vessel motion, imaging and Foundry runtime are unverified.',
 'project','created_document','active',
 'SRC-2026-10-16-DARK-ARCH-M01-GEOMETRY-LOCAL',NULL,
 'dark-arch,spatial-blueprint,geometry,skiff,rope,gate,local-fixture,not-runtime');

INSERT INTO kb_trials
(trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id)
VALUES
('T-2026-10-16-DARK-ARCH-M01-GEOMETRY-SWEEP',
 'Dark Arch Scene Injector V2.1 Beta geometry reachability and clearance',
 'Earlier art passes placed optional paths on the wrong side of the gate; prior render versions also baked grids/boats or repeated rejected compositions.',
 'Author independent source-driven rectangles, exact coordinate gate plane, typed separate boat and aerial rope crossings, stair elevations and stable feature anchors; test 5ft and 10ft square footprints on a 1.25ft lattice with gate open and closed.',
 'Initial local geometry had insufficient rope clearance (2.667ft) and a solid seawall across the boat channel. These draft failures were corrected before the final recorded fixture.',
 'Raise hoist anchor to +45ft for 5.667ft clearance over the +30ft wall; leave a 15ft tidal opening from y19 to y22; add explicit elevation stair links and positive postgate reachability for both alternate methods.',
 'PASS_LOCAL_GEOMETRY_ONLY',
 'SRC-2026-10-16-DARK-ARCH-M01-GEOMETRY-LOCAL');

INSERT INTO kb_relationships
(relationship_id,from_type,from_id,relation,to_type,to_id,notes)
VALUES
('R-2026-10-16-DARK-ARCH-GEOMETRY-SOURCE-FACT',
 'source','SRC-2026-10-16-DARK-ARCH-M01-GEOMETRY-LOCAL','supports',
 'fact','F-2026-10-16-DARK-ARCH-M01-GEOMETRY-LOCAL','Local reproducible evidence only'),
('R-2026-10-16-DARK-ARCH-GEOMETRY-SOURCE-TRIAL',
 'source','SRC-2026-10-16-DARK-ARCH-M01-GEOMETRY-LOCAL','supports',
 'trial','T-2026-10-16-DARK-ARCH-M01-GEOMETRY-SWEEP','First-pass defect and corrected local tests');
