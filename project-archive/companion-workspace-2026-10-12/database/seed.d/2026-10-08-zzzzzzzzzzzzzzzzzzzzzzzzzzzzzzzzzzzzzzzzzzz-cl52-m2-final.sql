-- CL52 M2 piano SOURCE VERIFIED: one Macro installed, original WAV, no live playback. Revision-1 E1 play state preserved.
INSERT OR REPLACE INTO kb_sources(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
('S-2026-10-07-CL52-M2-PIANO-INSTALL-VERIFIED','CL52 M2 original haunted piano WAV and GM one-shot Macro guarded install','verification','Central Lodge M2 CL52','Original synthesizer and SHA, nine offline tests, Foundry file serving, guarded APPLY and independent no-write FINAL VERIFY','active','docs/CL52-M2-HAUNTED-PIANO-INSTALL-RECEIPT-2026-10-07.md; work/foundry-playwright-harness/cl52-m2-macro-final-verify-v001.page.js','2026-10-07','Macro VHVC7yVlrNS7mWGJ SHA c27e902c6232b946ee36a61572ac17a88cd5fca54acbe391afd7fdbf483e0e3b; asset d450137c82e8691ea31b48d6d7786421491e017651bca2d4ba916c7d7d147ba9','Six-second original stereo WAV copied into Foundry world Data, SHA verified, FilePicker exact match HEAD 200 audio/wav 1152044 bytes. GM-only Macro guarded installation PASS and separate FINAL VERIFY PASS; 134 world Macros, 116 RegionBehaviors. CL90 smoke v003 PASS_WITH_KNOWN_BLOCKERS, ledger revision 1 with observed E1 recent-use clue intact, no playback, one-shot M2 flag absent.');

INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-CL52-M2-PIANO-FOUNDRY-INSTALLED','campaign.central-lodge.horror',NULL,'M2 original haunted piano sound is installed as GM-controlled one-shot, not played','Original six-second stereo 48kHz PCM16 WAV at worlds/the-lost-mine-of-phandalin/assets/dicebox-cl52/m2-haunted-piano-v001.wav has SHA d450137c82e8691ea31b48d6d7786421491e017651bca2d4ba916c7d7d147ba9, 1152044 bytes, no external samples; FilePicker and HEAD serving PASS. Macro VHVC7yVlrNS7mWGJ stable dbx:central-lodge:cl52:macro:m2-haunted-piano-one-shot source SHA c27e902c6232b946ee36a61572ac17a88cd5fca54acbe391afd7fdbf483e0e3b: primary GM manually confirms while GM and active players are viewing M2, targeted broadcast only to M2 audience, persistent Scene flag m2HauntedPianoPlayed recorded before play, does not change M2 Piano Roll mechanism or state. Nine offline tests PASS, Macro document model preview PASS, guarded APPLY PASS, separate independent FINAL VERIFY PASS, CL90 no-write whole-campaign smoke v003 PASS_WITH_KNOWN_BLOCKERS. Foundry current 21 Scenes/202 Regions/116 RegionBehaviors/33 Items/134 Macros, ledger revision 1 preserved from recent E1 observation, M1 and M2 one-shot flags unconsumed; no player playback canary.','campaign','full_function','locked','S-2026-10-07-CL52-M2-PIANO-INSTALL-VERIFIED',NULL,'central lodge cl52 haunted piano M2 audio GM one shot installed 134 Macros rev1');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts WHERE fact_id='F-2026-10-07-CL52-M2-PIANO-FOUNDRY-INSTALLED'
AND NOT EXISTS(SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);

INSERT OR REPLACE INTO kb_trials(trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id) VALUES
('TR-2026-10-07-CL52-M2-GENERATOR-SCENE-ROSTER','CL52 reusable GM audio Macro installer code generation','First generated M2 guarded installer contained duplicate M2 Scene ID and omitted M1 in 21-Scene baseline count array','Automated string replacement of earlier M1 Macro installer to M2 changed every occurrence, including unrelated global roster scene ID','Template transformation replaced the global roster M1 Scene ID as though it were the local target Scene and could have produced a false count baseline. No live apply occurred with that version.','Restore M1 Scene ID in global roster while keeping M2 destination, correct generator and both generated APPLY and FINAL VERIFY, add static AsyncFunction syntax and roster check PASS before one guarded live APPLY. Independent final verify and CL90 smoke passed.','recovered_verified','S-2026-10-07-CL52-M2-PIANO-INSTALL-VERIFIED');
INSERT INTO trials_fts(trial_id,area,symptom,attempted_approach,failure_cause,correction)
SELECT trial_id,area,symptom,attempted_approach,failure_cause,correction FROM kb_trials WHERE trial_id='TR-2026-10-07-CL52-M2-GENERATOR-SCENE-ROSTER'
AND NOT EXISTS(SELECT 1 FROM trials_fts f WHERE f.trial_id=kb_trials.trial_id);

UPDATE kb_open_items SET
problem='CL52 M1 footsteps and M2 haunted piano original WAVs and GM-only Macros have independent source/asset verification. M2 Macro VHVC7yVlrNS7mWGJ installed and unplayed. Actual client playback/recipient targeting, persisted one-shot flags, and post-reload suppression have not been canaried.',
next_action='At controlled session with active players viewing M1 or M2, have primary Gamemaster manually confirm the desired cue once. Validate exactly one delivery to same-scene players, no delivery across scenes, persistent one-shot state and no changes to puzzle/ledger or tokens. No automatic GM audio canary without users present.',
evidence_needed='Player/GM controlled playback, targeted recipients, consumed flag/reentry behavior, safe failure/retry and no puzzle/light side effects.'
WHERE item_id='O-2026-10-07-CL52-RUNTIME-CUE-AUTHORIZATION';

INSERT OR REPLACE INTO kb_metadata(key,value) VALUES
('central_lodge_catalog_version','2026-10-07.cl52-m2-piano-source-certified-v001'),
('central_lodge_cl52_active_slice','CL52 M2 audio installed and independently verified; player canary pending'),
('central_lodge_cl52_m2_macro_id','VHVC7yVlrNS7mWGJ'),
('central_lodge_cl52_m2_macro_sha256','c27e902c6232b946ee36a61572ac17a88cd5fca54acbe391afd7fdbf483e0e3b'),
('central_lodge_cl52_m2_audio_sha256','d450137c82e8691ea31b48d6d7786421491e017651bca2d4ba916c7d7d147ba9'),
('central_lodge_cl52_m2_audio_status','ORIGINAL_WAV_FOUNDY_SERVABLE_AND_GM_MACRO_APPLY_FINAL_VERIFY_PASS; unplayed'),
('central_lodge_cl52_m2_one_shot_consumed','false'),
('central_lodge_cl90_progress_smoke_status','PASS_WITH_KNOWN_BLOCKERS; v003; 21/202/116/33; macros134; ledger revision1 E1 recent-use preserved'),
('central_lodge_last_observed_ledger_revision','1'),
('central_lodge_region_behavior_count','116');
