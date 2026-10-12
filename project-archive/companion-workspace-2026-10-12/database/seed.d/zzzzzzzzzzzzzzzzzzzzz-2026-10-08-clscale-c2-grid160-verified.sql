-- CL-SCALE C2 Cult Records & Ritual Undercroft grid-only source verification, 2026-10-08 successor Foreman.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL-SCALE-C2-GRID160-INDEPENDENT-FINAL',
 'C2 Cult Undercroft 160px grid-only independent Foundry verification',
 'verification','campaign','Foundry 14.367 authorized Assistant Gamemaster exact Scene/ledger normalized readback','active',
 'work/foundry-playwright-harness/clscale-c2-final-readonly-v001.page.js',
 '2026-10-08','CL-SCALE-C2-grid160-final-9d37ba2f',
 'Grid-only bounded Scene.update with autoReposition:false after exact original backup and no-write preview; gameplay/visual canaries deferred.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL-SCALE-C2-GRID160-INSTALLED',
 'central-lodge',NULL,'C2 Cult Undercroft gridless 120 to 160 source-installed and independently verified',
 'Foundry 14.367 dnd5e 5.3.3 world the-lost-mine-of-phandalin. Authorized Assistant Gamemaster performed one guarded Scene.update grid.size 120 to 160 for C2 Cult Records & Ritual Undercroft Scene UNySMm7YkyYfh41x with autoReposition:false after full original Scene.toObject snapshot outputs/foreman-checkpoints/clscale-c2-before-grid160-v001.json. Four door spans 200/260/260/600px and smallest Region span450px passed the adopted conservative candidate clearance check. Before SHA-256 fa29f5a8e5bde7648657c240271608be7d5adf5dfec5fe879dfdf2b2b030a661; after SHA-256 9d37ba2fa86191a3405ccec2aae6642d3abf278da968fd4d7d79783434ad775a. Reversing only grid.size and Scene _stats audit metadata in complete Scene source reproduces exact original SHA. 4320x2880 image, gridless type0, distance5ft, all 30 Walls, 11 Regions, 3 lights, scripts and other stored geometry unchanged; zero tokens. No-write PREVIEW PASS, one APPLY PASS, separate independent final readback PASS, CL90 v013 PASS_WITH_KNOWN_BLOCKERS zero unexpected failures. Whole campaign roster 21 Scenes 202 Regions 119 behaviors including intentionally disabled M2 Notice and 33 Items unchanged; ledger revision3 SHA e8485e53ea171208894098b263b0223940140e1d52284e26e0546043543977d9 unchanged. C1 240 and four earlier completed calibration scenes untouched. CL50 railway installers quarantined, no audio, no final player or GM gameplay canary, no visual-fit certification.',
 'campaign','local','active','SRC-2026-10-08-CL-SCALE-C2-GRID160-INDEPENDENT-FINAL',
 'CL-SCALE,C2,grid-only,source-verified,puzzle-state-preserved,no-player-test')
ON CONFLICT(fact_id) DO NOTHING;

UPDATE kb_open_items SET
 problem='Six interiors now independently backed up and verified: M2=320, M3=240, B2=240, B1=150, C1=240 and C2 Cult Undercroft=160. Outstanding candidate interiors require new separate geometry and sovereign-state guards; M1 includes Ret token, N3 must stay120, F2 lacks reliable art clearance, CL50 landing receipts stale.',
 next_action='Checkpoint independently verified C2 before another live Scene action. Next bounded candidate U1 Guest Rooms grid120 to proposed180 only after fresh door/Region/source and ledger preflight, full backup, no-write preview, single authorized Scene.update autoReposition:false, entire source and ledger independent readback, CL90, KB and checkpoint. Preserve CL50 quarantine, do not trigger audio or player gameplay testing.',
 source_id='SRC-2026-10-08-CL-SCALE-C2-GRID160-INDEPENDENT-FINAL'
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION' AND status='in_progress';

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-08-CL-SCALE-C2-GRID160-INSTALLED'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL-SCALE-C2-GRID160-INSTALLED');
UPDATE open_items_fts SET
 problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION')
WHERE item_id='O-2026-10-08-CL-SCALE-INTERIOR-CALIBRATION';
