-- User-accepted automatic world detection instead of typed Foundry world confirmation.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('SRC-2026-10-16-INJECTOR-AUTO-WORLD',
 'Dark Arch M01 user correction: auto-detect exact Foundry world without typed ID',
 'conversation','global','explicit current user direction','accepted',
 'handoffs/2026-10-16-dark-arch-scene-injector-v2-1-beta/AUTO-WORLD-DETECTION-2026-10-16.md',
 '2026-10-16','dicebox-scene-injector-autodetect-world/v1',
 'User rejects manual typing of world ID. Use game.world.id to detect the active world, enforce exact authorized target, show a single DialogV2.confirm preview; cancellation and changed authority must remain fail-closed.');

INSERT INTO kb_decisions
(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES
('D-2026-10-16-INJECTOR-AUTO-WORLD',
 'DiceBox Injector native active world identification and preview',
 'Automatically determine the running Foundry world through game.world.id; reject any mismatch with explicitly authorized target; show a single DialogV2.confirm review and require active-GM authority reread after the dialog; do not ask the GM to retype the known world ID.',
 'Foundry already supplies the current world ID, so manual transcription adds friction without stronger target safety; exact authorization and preview remain mandatory.',
 'global','locked','DiceBox Campaign Helper Foreman',
 'SRC-2026-10-16-INJECTOR-AUTO-WORLD',NULL);

INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-16-DARK-ARCH-AUTO-WORLD-PATCH',
 'foundry',NULL,'Dark Arch M01 preview auto-detect hotfix tested offline, not injected',
 'User-corrected Dark Arch Injector Markdown auto-detects exact world-template-2 via game.world.id and presents one native DialogV2.confirm preview, removing typed world ID input. Same Library file overwritten in place, ID libfile_a0680cb8b2c881919789a881b4299377, SHA256 c57f0469c17fe3f6782f543dbdf16f867faccd361fb17933b5d897c834f1fde3. Embedded WebP hash f31d9bf2850ed853ac9af35d672a44cb2ed18a1fa1dadde8735e16d6fbfee2b2 and 14-Wall/2-Region geometry unchanged. Node syntax, local contract markers, image/hash tests pass, 10 simulated fail-closed preview tests pass. Full canonical repo validator and live Foundry installation remain unverified.',
 'project','local','active',
 'SRC-2026-10-16-INJECTOR-AUTO-WORLD',NULL,
 'dark-arch,scene-injector,world-id,dialogv2,preview,local-only,no-live-mutation');
