-- Pending machine-verified database rebuild: M02 v7 source geometry and local inspection evidence.
-- Keep chronology and distinguish user-approved v6 geometry from new v7 local scale reconciliation.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('SRC-2026-10-17-KURTH-M02-M01-REGISTERED-V7',
 'M02 unified bridge-to-tower calibration and independent geometry inspection',
 'verification','project','approved M01 artwork + M01 accepted blueprint + M01 later macro + user-approved M02 v6','recorded',
 'handoffs/2026-10-16-kurth-tower-reception-m02/geometry-calibrated-v7/FINAL-GEOMETRY-RECONCILIATION.md',
 '2026-10-17','m02-calibrated-geometry-v7',
 'Approved M02 v6 blueprint SHA256 f822725e697e39a07241f6ff8219a6a4321cab7a84b32766774fce0a83e66fd6. New v7 local model SHA256 f3bdcfb3c8ed73648e1a7f98c59e09e94c19a5b76ad208f88b35716f382b3add. SIFT affine registration 526 inliers median 0.290px; image join 19.859 logical squares; original M01 gate x29.4 in design vs x29.88 in later macro, latter used for proposed overlap. One external tower entrance, three tested clear routes, stair source elevations +31/+18/-8ft; no Foundry reread or live mutation.');

INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-17-KURTH-M02-CALIBRATED-V7',
 'scene',NULL,'M02 accepted v6 geometry locally calibrated to M01 source art/walls and source-elevation stairs',
 'Using v6 user-approved M02 design, the approved M01 painterly image, original M01 semantic blueprint and later macro WALL_SPEC, v7 authored a native-proportions art join at x19.859 logical cells, preserving the single west-side tower exterior door, continuous building roof, cliffside path, and three interior routes. 28/28 independent local geometry checks passed: public 10ft Large, northern inspector 5ft, southern staff 5ft; each crosses the authored secure door and seam without wall collision. Source M01 stair geometry records 31 to 18ft upper and -8 to 18ft lower; new level datum +18ft is an authored continuity inference. Inherited intended Wall planes not live verified; no runtime/Foundry/Levels certification or creative render. Pending user review before grayscale.',
 'project','local','provisional',
 'SRC-2026-10-17-KURTH-M02-M01-REGISTERED-V7',NULL,
 'm02,dark-arch,geometry,registration,source-elevations,offline-pass,runtime-unverified');