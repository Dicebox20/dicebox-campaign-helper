-- Dark Arch M01: user-observed native prompt() macro failure, followed by a bounded uninstalled offline DialogV2 fix.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('SRC-2026-10-16-DARK-ARCH-DIALOGV2-HOTFIX',
 'Dark Arch M01 Foundry v14 preview dialog failure and offline tested hotfix',
 'verification','project','user console trace and local Node mock evidence','recorded',
 'handoffs/2026-10-16-dark-arch-scene-injector-v2-1-beta/DIALOGV2-PREVIEW-HOTFIX-2026-10-16.md',
 '2026-10-16','dark-arch-dialogv2-preview-hotfix/v1',
 'User console: prompt() is not supported at confirmPreview prior to Scene mutation. Source guidance Foundry official DialogV2.input and DialogV2.confirm. Patched one-Markdown macro digest c474f184e49fb61f2cd4c989ee99ca737399770dd8f03198f2642e6d1037f0a6; 10/10 local mock cases pass but live Foundry still not verified.');

INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-16-DARK-ARCH-DIALOGV2-HOTFIX',
 'foundry',NULL,'Dark Arch global browser prompt unsupported; DialogV2 native review patch passes mock only',
 'After Foundry DiceBox 0.1.15 active and world-template-2 active GM confirmed, Dark Arch injection macro stopped in confirmPreview with prompt() is not supported before its asset upload or Scene writes. The fixed offline one-Markdown/one-JavaScript macro SHA256 c474f184e49fb61f2cd4c989ee99ca737399770dd8f03198f2642e6d1037f0a6 replaces browser prompt with DialogV2.input plus DialogV2.confirm and fixed world-template-2 binding; preserves embedded art WebP SHA256 f31d9bf2850ed853ac9af35d672a44cb2ed18a1fa1dadde8735e16d6fbfee2b2, 14 authored Wall segments and 2 Regions. Local packaging and JS syntax PASS; 10/10 mock tests PASS including cancel, wrong world, lost GM, refusal and success. Not live Foundry verified and exact repo validator on patched bytes not run. Live installation remains blocked pending the repaired artifact and authoritative runtime reread.',
 'project','local','active',
 'SRC-2026-10-16-DARK-ARCH-DIALOGV2-HOTFIX',NULL,
 'dark-arch,foundry,dialogv2,macro,preview,fixture,local,not-installed');
