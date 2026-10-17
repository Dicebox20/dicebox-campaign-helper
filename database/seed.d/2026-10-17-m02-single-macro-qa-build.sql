-- DiceBox Campaign Helper M02 provisional macro build, 2026-10-17. No Foundry runtime mutation.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('SRC-2026-10-17-M02-BUILD-QA-PROVISIONAL',
 'M02 selected-art single-macro QA injector build',
 'verification','project','local deterministic build and nine mocked runtime scenarios','recorded',
 'handoffs/2026-10-17-m02-injector-build-qa/BUILD-TEST-RECEIPT.json',
 '2026-10-17','m02-single-macro-qa-build/b9dc848335d32cf',
 'Selected grayscale PNG SHA256 a342988f238b42162af2052ed37fc4513c9dff1553e6c64a83273aeb5c4371f4; one 587KB Markdown file includes one self-contained JS macro with quality 85 WebP payload. Node syntax and offline marker/payload checks PASS, nine Foundry mock scenarios PASS; exact repository validator not run. Candidate geometry has only 11 authored Walls including 3 security Doors and 4 intent Regions, zero RegionBehaviors. Exterior doorway and inherited M01 wall coverage unresolved. Do not mark Ready-to-Play.');

INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-17-M02-QA-MACRO-BUILT',
 'foundry',NULL,'Kurth Tower Reception M02 provisional single-macro injector built offline',
 'A QA-only M02 single-Markdown/one-JavaScript Foundry Scene injector was built against user-selected grayscale (PNG SHA256 a342988f238b42162af2052ed37fc4513c9dff1553e6c64a83273aeb5c4371f4). Build SHA256 22e562dfd03daa1172d4632fc3f020463705a0c2ee90b4ae59fde80e4bab005d; embedded native 1619x971 WebP SHA256 95aca5e9010def8d9d8ffea2e11dde2a5f8c0948de2970b461e779175620234a, compressed lossy; installs only a QA Scene with 11 Walls/3 interior security Doors/4 hidden GM Regions, no Region behaviors. Preflight requires exact world-template-2, core 14.367, dnd5e 5.3.3, active DiceBox module 0.1.15 and sole active GM; uses native DialogV2.confirm and automatic game.world.id, fails closed on collision/cancellation. Nine local mocked runs pass. Canonical repository BUILD validator and real Foundry runtime tests unrun; selected-art exterior entrance and complete original M01 wall coverage unverified; painterly stage not complete. STAGE/INJECT and Ready-to-Play blocked pending review.',
 'project','local','provisional',
 'SRC-2026-10-17-M02-BUILD-QA-PROVISIONAL',NULL,
 'm02,scene-injector,qa,embedded-art,foundry,blocked-stage,not-ready');
