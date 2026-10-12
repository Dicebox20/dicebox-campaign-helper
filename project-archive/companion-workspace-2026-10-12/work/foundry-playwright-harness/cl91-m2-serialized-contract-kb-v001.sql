-- 2026-10-08 CL91 M2 one-writer accepted implementation contract, not gameplay certification.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL91-M2-SERIAL-PORTRAIT-CONTRACT',
 'M2 Founder Portrait one-writer serialized Notice/Observe/Signet source contract',
 'verification','campaign','Exact Foundry 14.367 read-only overlap/behavior source and user-authorized ongoing CL91 work','active',
 'docs/CL91-M2-FOUNDER-PORTRAIT-SERIALIZED-SINGLE-EVENT-2026-10-08.md','2026-10-08',
 'CL91-m2-one-writer-serialized-v001',
 'Portrait Notice rectangle contained by larger Signet Region. Preserve both existing source bodies as nested actions, disable inner duplicate enter event after preflight, original IDs and geometry unchanged.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_decisions(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES('D-2026-10-08-CL91-M2-SERIAL-NOTICE-OBSERVE-SIGNET',
 'central-lodge-m2-founder-portrait',
 'Use the existing outer Founder Portrait RegionBehavior IdriZEGhxUY9whcV as the single active tokenEnter handler for original DC6 Notice, an independent canonical observe setting puzzles.m2.founderPortraitObserved=true, and the original Signet-gated persistent Old Estate Survey pickup setting puzzles.m2.founderPortraitOpened=true. Preserve original Notice source verbatim in nested invocation and disable redundant inner Portrait Notice RegionBehavior NxUruGwqnow13Krv, keeping ID, source bytes, original flags and Region geometry unchanged. The original Signet pickup body must remain verbatim nested inside the orchestrator; no auto-award when Signet missing. Serialize concurrent enters on the primary GM within this handler with per-client promise queue. No extra behavior count, no kernel edit, no global server CAS claim. Failed one-time Notice result still allows physical observation; never force successful roll. Require exact hash/ledger/preflight, one bounded disable-then-replace update, independent final source and ledger verification, end-only real-player acceptance.',
 'Notice and Signet rectangles overlap; installing another autonomous observer could issue concurrent whole-ledger writes. Existing valid actions can instead be ordered under one handler, preserving original Notice, portrait-opening and Item grant contracts while adding independent observation semantics.',
 'campaign','locked','DiceBox Campaign Helper Foreman','SRC-2026-10-08-CL91-M2-SERIAL-PORTRAIT-CONTRACT',
 'After no-write source model, guarded apply and final user-player canary')
ON CONFLICT(decision_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL91-M2-PORTRAIT-OVERLAPPING-REGIONS',
'central-lodge',NULL,'M2 Notice and Signet Region event overlap confirmed',
'Exact Foundry M2 Portrait Notice Region fMT43gKz5Am84FEi is rectangle x440 y400 w760 h600 with enabled tokenEnter Notice behavior NxUruGwqnow13Krv source SHA256 49c934bb7ef15bfeddfb6d0f76564fa7b69764a3b3b24ec043feafe1aa5a9a46. Outer M2 Founder Portrait Region FRY091GwobgD2M5i rectangle x420 y390 w800 h650 with enabled tokenEnter Signet/Old Estate Survey behavior IdriZEGhxUY9whcV source SHA256 bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2. Ledger revision2 portrait observed=false, opened=false, Signet and Old Estate Survey unrecovered, world 21 Scenes 202 Regions 118 behaviors 33 Items, no non-GM users connected at source readback. Existing shared kernel writes entire ledger object without CAS; only source-level on-GM queue is planned, not a global race guarantee.',
'campaign','local','active','SRC-2026-10-08-CL91-M2-SERIAL-PORTRAIT-CONTRACT',
'CL91,M2,portrait,notice,Signet,race,overlap')
ON CONFLICT(fact_id) DO NOTHING;

UPDATE kb_open_items SET
next_action='Build and offline-test one versioned outer Founder Portrait handler composed of verbatim original Notice and Signet pickup actions plus a distinct observe; disable redundant inner Notice tokenEnter after exact-hash/ledger PREVIEW so only outer Region writer remains. Preserve original Notice source bytes and original nested reward payload, Item recovery, current ledger revision2, 118 behaviors and all scene geometry. One guarded dual-Region APPLY followed by independent readback; unknown result STOP without replay.',
source_id='SRC-2026-10-08-CL91-M2-SERIAL-PORTRAIT-CONTRACT'
WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES' AND status='open';

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-08-CL91-M2-PORTRAIT-OVERLAPPING-REGIONS'
AND NOT EXISTS(SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL91-M2-PORTRAIT-OVERLAPPING-REGIONS');
INSERT INTO decisions_fts(decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions
WHERE decision_id='D-2026-10-08-CL91-M2-SERIAL-NOTICE-OBSERVE-SIGNET'
AND NOT EXISTS(SELECT 1 FROM decisions_fts WHERE decision_id='D-2026-10-08-CL91-M2-SERIAL-NOTICE-OBSERVE-SIGNET');
UPDATE open_items_fts SET
next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES')
WHERE item_id='O-2026-10-08-CL91-M2-U2-FOLLOWON-STAGES';
