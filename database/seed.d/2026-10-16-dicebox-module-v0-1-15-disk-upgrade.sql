-- Exact-world maintenance receipt, verified on disk but not runtime activated.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('SRC-2026-10-16-MODULE-V0-1-15-DISK-UPGRADE',
 'DiceBox Foundry module v0.1.15 stopped-server replacement receipt',
 'verification','project','verified local disk and backup hashes','recorded',
 'handoffs/2026-10-16-dark-arch-scene-injector-v2-1-beta/MODULE-UPGRADE-INSTALL-RECEIPT.json',
 '2026-10-16','dicebox-foundry-module-on-disk/v0.1.15',
 'User verified world-template-2, core 14.367, system dnd5e 5.3.3, active GM. Foundry app was stopped during upgrade. Full world and v0.1.2 module rollback copies were byte-for-byte verified; new 0.1.15 package matches repository main and preserves old external assets. No world docs modified; runtime enabled state remains unknown pending restart.');

INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-16-MODULE-V0-1-15-DISK-UPGRADE',
 'foundry',NULL,'DiceBox 0.1.15 module installed on disk; pending world enable and runtime verification',
 'On 2026-10-16, after Foundry stopped and user active-GM/world identity evidence was supplied, DiceBox Campaign Helper 0.1.15 was placed in the Foundry Data/modules/dicebox-campaign-helper directory from the accepted main-equivalent source package. Installed module manifest SHA256 467b56314411c5b40d7505d5da2a0e4b2f9e8f7a182b3ab413ce7f4e1ec5673b; 41 source files match their installed hashes and 28 JS syntax tests passed. Rollback copies of preupgrade module and world-template-2 world were verified, foreign files preserved, world not modified. Module has NOT been runtime-loaded or enabled and Dark Arch Scene installation has NOT occurred.',
 'project','created_document','active',
 'SRC-2026-10-16-MODULE-V0-1-15-DISK-UPGRADE',NULL,
 'dicebox,module,0.1.15,disk-upgrade,foundry,rollback,not-runtime-verified');
