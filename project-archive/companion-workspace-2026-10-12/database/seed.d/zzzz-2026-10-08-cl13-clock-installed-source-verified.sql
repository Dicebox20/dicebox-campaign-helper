-- 2026-10-08 CL13 The Seventh Winter: source-installed, gameplay untested.
-- Reconciles prior user-approved design with exact independently reread Foundry 14.367 state.
INSERT INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES('SRC-2026-10-08-CL13-CLOCK-SOURCE-FINAL-READBACK',
 'M1 clock source-installed independently verified read-only receipt',
 'verification','campaign','Exact Foundry 14.367 Assistant Gamemaster read-only source equality and checksum, no player canary','active',
 'work/foundry-playwright-harness/cl13-clock-final-readonly-v002.page.js','2026-10-08',
 'CL13-source-verified-stored-5ee8f97403d5144c',
 'One approved M1 RegionBehavior was created; Foundry trimmed exactly one final newline, and byte-exact normalized source comparison passed. Does not certify player input or ledger commit.')
ON CONFLICT(source_id) DO NOTHING;

INSERT INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,tags)
VALUES('F-2026-10-08-CL13-CLOCK-INSTALLED-SOURCE-VERIFIED',
 'central-lodge',NULL,'M1 Seventh Winter clock handler installed, exact source verified',
 'One enabled executeScript RegionBehavior OUMWc1YjJ5DTSFzM with stableId dbx:central-lodge:m1:behavior:clock-setting-seventh-winter-v001 and tokenMoveIn was created in Region 3tIrR12uv8ppFkOb. Independently reread source exactly matches approved v002 except for one trimmed terminal newline, SHA-256 5ee8f97403d5144cbacf64e57ea58862bf4daf4ec4643088531e7f27e12ac997. M1 notice, U1 family clue and E4 memorial dates remain at independently checked approved source SHA-256 values; canonical reward pickup handlers unchanged. Installed totals 21 Scenes, 202 Regions, 117 enabled RegionBehaviors, 33 Items, ledger revision 1; clockSettingResolved false and emblemInserted false. Source-only implementation evidence, not gameplay acceptance.',
 'campaign','local','active','SRC-2026-10-08-CL13-CLOCK-SOURCE-FINAL-READBACK',
 'M1,CL13,4:35,source-verified,pending-player-test')
ON CONFLICT(fact_id) DO NOTHING;

UPDATE kb_metadata SET value='117'
WHERE key='central_lodge_region_behavior_count' AND value='116';

UPDATE kb_open_items
SET problem='M1 clock solution 4:35, three clues, and one tokenMoveIn clock-setting handler are now installed and independently source-verified. The user has not performed their final campaign gameplay canary, so player dialog delivery, exact 4:35 commit, and separate reward pickups remain unverified in play.',
next_action='Preserve installed behavior (never replay the installer). During final user-run campaign playtest, verify emblem prerequisite, canceled/wrong answer no-write, exact 4:35 accepted, ledger flag commit, separate Family Reliquary Key and Brass Baggage Token collection, and reload/reconnect semantics. Record actual player acceptance before closing.',
evidence_needed='User-run real-player/GM event receipt, source hash equality after any game update, ledger authorized commit and no foreign Item/Actor drift, independent end-to-end readback.',
source_id='SRC-2026-10-08-CL13-CLOCK-SOURCE-FINAL-READBACK'
WHERE item_id='O-2026-10-08-CL13-CLOCK-RUNTIME-PREVIEW'
AND status='in_progress';

UPDATE open_items_fts
SET problem=(SELECT problem FROM kb_open_items WHERE item_id='O-2026-10-08-CL13-CLOCK-RUNTIME-PREVIEW'),
 next_action=(SELECT next_action FROM kb_open_items WHERE item_id='O-2026-10-08-CL13-CLOCK-RUNTIME-PREVIEW'),
 evidence_needed=(SELECT evidence_needed FROM kb_open_items WHERE item_id='O-2026-10-08-CL13-CLOCK-RUNTIME-PREVIEW')
WHERE item_id='O-2026-10-08-CL13-CLOCK-RUNTIME-PREVIEW';

INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-08-CL13-CLOCK-INSTALLED-SOURCE-VERIFIED'
AND NOT EXISTS (SELECT 1 FROM facts_fts WHERE fact_id='F-2026-10-08-CL13-CLOCK-INSTALLED-SOURCE-VERIFIED');
