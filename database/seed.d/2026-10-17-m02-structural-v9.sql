-- Calibrated M02 V9 construction render; accepted geometry only, runtime installation blocked.
-- Intake seed: canonical database rebuild/verification still required before KB synchronization receipt.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('SRC-2026-10-17-KURTH-M02-STRUCTURAL-V9',
 'M02 V9 deterministic grayscale rendering and strict structural inspection',
 'verification','project','approved user v7 blueprint and reproducible local image/mask audit','recorded',
 'handoffs/2026-10-17-m02-structural-v9/STRUCTURAL-INSPECT.md',
 '2026-10-17','m02-structural-v9-sha256-38f420ba72abed36',
 'Derived exactly from user-approved v7 geometry SHA256 f3bdcfb3c8ed73648e1a7f98c59e09e94c19a5b76ad208f88b35716f382b3add and approved M01 art SHA256 02cdd354371721961ce277f00b8bfe2a322d2678000f7c44d8596800194cab61. Pixel-registered M01 source segment exact-match after grayscale conversion. 44/44 independent local checks PASS; not Foundry verified; no live changes; structural render pending user visual acceptance.');
INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-17-KURTH-M02-STRUCTURAL-V9',
 'scene',NULL,'M02 v9 structural grayscale candidate aligns approved typed v7 geometry',
 'V9 reproducible grayscale image 4800x2880 SHA256 38f420ba72abed36a604a4292ae6b4a9f8b0323c0bde1f1cc727c62892309490. New exterior facade x29.39215 with sole D01 y20-23, security partition x36.07463 with D02-D04 exact, source-image seam x19.85911 (2383 output px). Original M01 art gray pixels preserved by registered affine crop with maximum pixel deviation 0. Native wall and door masks exact v7; 3 geometry route sweeps PASS; overall 44 local tests PASS 0 FAIL. This is structural review candidate, NOT painterly artwork or live installation; source M01 elevations verified as typed intent but exact Foundry stair treads, regions and movement remain unverified. No world write.',
 'project','local','active','SRC-2026-10-17-KURTH-M02-STRUCTURAL-V9',NULL,
 'm02,structural,grayscale,validated-local,v7-geometry,no-foundry-mutation');
