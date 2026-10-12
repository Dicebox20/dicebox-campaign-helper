-- Complete successor Foreman handoff reconciliation. Facts are SOURCE-ONLY, not runtime mutation authority.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES(
 'SRC-2026-10-08-FOREMAN-HANDOFF-C1-LIVE-RECONCILED',
 'Next Foreman complete KB/files/Scene metadata handoff after independently reverified C1',
 'verification','campaign',
 'Read-only Foundry 14.367 C1 full Scene source verifier, CL90 v013 and canonical SQLite state','active',
 'handoffs/FOREMAN-NEXT-CHAT-COMPLETE-CATALOG-2026-10-08.md',
 '2026-10-08','clscale-c1-live-reconciled-to-regression-v013',
 'Handoff only, not implementation: user requested complete data/metadata catalog and successor packet. C1 later applied checkpoint reconciled against live authoritative state. Machine-readable inventories in handoffs/catalog-2026-10-08. No Scene or gameplay write in this work unit.'
)
ON CONFLICT(source_id) DO NOTHING;
INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES(
 'F-2026-10-08-FOREMAN-HANDOFF-C1-CURRENT-LIVE',
 'central-lodge',NULL,
 'Latest verified campaign state at next-Foreman succession after C1 grid calibration',
 'Independently reread latest checkpoint central-lodge-clscale-c1-grid240-verified-v001 against live Foundry v14.367 dnd5e5.3.3 the-lost-mine-of-phandalin, user Assistant Gamemaster. C1 Hidden Chapel Scene EDdktL7VUihbpKe9 is ALREADY GRID 240, source SHA 80ce2a899ad5304103c6e14b8b84ad4b3fc6d9e8962534990890489df82d3c7a and independently normalized entire stored source SHA matches original 664816c5ff2c42521682f9bcdc5ec5ac7b1e52cc5760a75174f84d5c538d3fc1, 21 Walls/10 Regions/3 Lights unchanged. Read-only CL90 v013 PASS_WITH_KNOWN_BLOCKERS no unexpected failures, 21 canonical Scenes, 202 Regions, 119 RegionBehaviors with exactly one intentionally disabled M2 Notice, 33 Items. Sovereign ledger revision3 SHA e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9. Five independently verified grid-only Scene edits: B1 150, B2 240, C1 240, M2 320, M3 240 pixels per 5 foot. C2 Cult Undercroft UNySMm7YkyYfh41x remains grid120 and no token, candidate grid160 is NEXT but no C2 apply script/backup exists at handoff. N3 grid120 must remain due narrow door; M1 Ret Token requires center safeguards; F2 lacks calibrated visual scale. All Scene images 4320x2880 gridless. CL50 live railway installers and stale landing footprints quarantined, real-player acceptance deferred. This catalog work unit did not run any live Foundry write or Bridge send. The dedicated Foreman workspace is not a Git checkout and the referenced docs/ACTIVE-PROGRAM-SLICE.json is absent, both recorded warnings. Full handoff and catalog directory are authoritative continuity evidence only, not permission to replay prior APPLY actions.',
 'campaign','local','active',
 'SRC-2026-10-08-FOREMAN-HANDOFF-C1-LIVE-RECONCILED',
 'foreman,handoff,CL-SCALE,C1,C2,live-source-verified,no-runtime-write,SQLite-catalog'
)
ON CONFLICT(fact_id) DO NOTHING;
-- Existing scale program remains IN_PROGRESS; do not change its approved authority.
UPDATE kb_open_items
SET next_action='At new-Chat Foreman start, read handoffs/FOREMAN-NEXT-CHAT-COMPLETE-CATALOG-2026-10-08.md, handoffs/catalog-2026-10-08/catalog-integrity.json, docs/CENTRAL-LODGE-ROADMAP.md, docs/CENTRAL-LODGE-ACTIVE-CHECKLIST.md and the current live ledger. C1 ALREADY APPLIED/VERIFIED, never replay. Exact next bounded Scene is C2 Cult Undercroft grid120 to proposed 160, conditional on fresh source/door/Region clearance, no non-GM players, original full Scene backup, guarded no-write preview, one authorized grid-only Scene.update autoReposition:false, independent entire source/ledger/geometry readback, updated regression, KB and checkpoint. No CL50 railway installs, Bridge blind retries, or player gameplay canary.',
    source_id='SRC-2026-10-08-FOREMAN-HANDOFF-C1-LIVE-RECONCILED'
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION' AND status='in_progress';
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-08-FOREMAN-HANDOFF-C1-CURRENT-LIVE'
AND NOT EXISTS (SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-FOREMAN-HANDOFF-C1-CURRENT-LIVE');
UPDATE open_items_fts
SET next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION')
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION';
