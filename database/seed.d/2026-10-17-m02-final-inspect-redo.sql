-- DiceBox final-inspect chronology 2026-10-17. This seed is review-branch evidence,
-- not a claim that canonical SQLite was rebuilt or verified.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('SRC-2026-10-17-M02-FINAL-INSPECT-REDO',
 'M02 final art pixel-structure match but approved v7 geometry mismatch',
 'verification','project','local reproducible image and blueprint comparison','recorded',
 'handoffs/2026-10-17-m02-final-inspect-redo/FINAL-INSPECT.md',
 '2026-10-17','kurth-m02-final-inspect-redo/v1',
 'Grayscale and color both 1619x971, candidate local/Library SHA exact match, edge agreement .973154; however M01 gate, tower D01 at x29.39215 y20-23, and D02-D04 checkpoint openings at x36.07463 do not align with painted architecture. Prior structural PASS is superseded within its visual scope. No Foundry mutation.');
INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-17-M02-FINAL-INSPECT-REDO',
 'scene',NULL,'M02 painterly color candidate rejected: prior structural pass insufficient against v7',
 'FINAL INSPECT REDO: deterministic recolor of source grayscale 418df8bb3431db1984d0d9def8655ad882074f8d6fdbcce373ef20ab67d921be produced Library image 82096aaa2f5783a5b0b8ec21d2b5acef5acc1a8fb51b005fcc4621319fafbff7 with no warp, 97.3154 percent Canny edge agreement, but both images conflict with approved v7 blueprint f3bdcfb3c8ed73648e1a7f98c59e09e94c19a5b76ad208f88b35716f382b3add: inherited M01 gate registered x~394 px, tower D01 should be x~1190/y809-931, interior D02-D04 should be x~1460, but painted architecture is elsewhere. Prior structural PASS claim superseded for this image pair. Structural render fresh clean restart required before any painterly final pass. No Foundry runtime mutation or Ready-to-Play evidence.',
 'project','deterministic','active',
 'SRC-2026-10-17-M02-FINAL-INSPECT-REDO',NULL,
 'kurth-tower,m02,final-inspect,redo,structure-mismatch,geometry-registration,no-live-mutation');