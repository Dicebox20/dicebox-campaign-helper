-- User-accepted post-structural-BUILD paint order and Dark Arch painterly injector draft.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('SRC-2026-10-16-SCENE-INJECTOR-POST-BUILD-PAINT',
 'V2.1 Beta structural BUILD before painterly rendering and final injection assembly',
 'conversation','global','explicit current user direction','accepted',
 'DiceBox Campaign Helper conversation 2026-10-16',
 '2026-10-16','dicebox-scene-injector/v2.1-beta-post-build-paint',
 'User corrected prior sequence: grayscale-based structural BUILD, then painterly RENDER + FINAL INSPECT, then final art binding, STAGE/INJECT/VERIFY. The accepted painterly Dark Arch image SHA256 is 02cdd354371721961ce277f00b8bfe2a322d2678000f7c44d8596800194cab61.');

INSERT INTO kb_decisions
(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES
('D-2026-10-16-SCENE-INJECTOR-POST-BUILD-PAINT',
 'Scene Injector V2.1 Beta post-structural-BUILD painterly rendering',
 'Use PREPARE -> GEOMETRY INSPECT -> EMBOSSED GRAYSCALE -> STRUCTURAL INSPECT -> FEATURE RECONCILIATION -> structural BUILD -> PAINTERLY RENDER -> FINAL INSPECT -> FINAL INJECTION ASSEMBLY -> STAGE -> INJECT -> VERIFY -> RECEIPT. Structural BUILD is offline draft geometry; injection assembles the exact approved painterly background into the single-v2-contract macro. Preserve existing runtime approval and Foundry canaries.',
 'User requested geometry wall creation from grayscale and later corrected the scene installer to follow the painterly finish; prevents preliminary grayscale from being silently installed as final image.',
 'global','locked','DiceBox Campaign Helper Foreman',
 'SRC-2026-10-16-SCENE-INJECTOR-POST-BUILD-PAINT',NULL);

INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-16-DARK-ARCH-PAINTERLY-INJECTOR-LOCAL',
 'scene',NULL,'Dark Arch painterly image approved for injection and offline macro assembled',
 'User selected painterly Dark Arch scene image SHA256 02cdd354371721961ce277f00b8bfe2a322d2678000f7c44d8596800194cab61 instead of grayscale. Local alignment review 191 inliers ~0.95px median, one self-contained single-Markdown v2 macro candidate SHA256 efdad8978ee82ad6a9720282a1cb3f7bd81da2aa3db5d78b1e5386cb4985b35a including compressed image SHA256 f31d9bf2850ed853ac9af35d672a44cb2ed18a1fa1dadde8735e16d6fbfee2b2. Contract parity and Node syntax checks passed. The artifact exists in the conversation environment but is not in GitHub. Exact canonical validator, live runtime installation and gameplay are not verified.',
 'project','local','active',
 'SRC-2026-10-16-SCENE-INJECTOR-POST-BUILD-PAINT',NULL,
 'dark-arch,scene-injector,v2.1-beta,painterly,offline-build,unverified-install');
