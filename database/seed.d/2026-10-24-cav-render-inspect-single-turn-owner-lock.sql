-- Owner-authorized campaign workflow scheduling change on 2026-10-24.
-- Reproducible source/decision seed, not applied to live KB in this turn.
-- Cabin in the Ashen Veil only; other campaigns retain their separate workflows.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('S-2026-10-24-CAV-RENDER-INSPECT-ONE-TURN',
 'Owner-locked render plus inspect mandatory combined 20-minute work turn',
 'campaign','Campaign: Cabin in the Ashen Veil visual production workflow',
 'Direct owner instruction 2026-10-24: every render turn must include inspect; combine them',
 'active',
 'campaign-archives/cabin-in-the-ashen-veil/roadmaps/owner-approved-codex-continuation-and-foundry-execution-rules-2026-10-23.md',
 '2026-10-24','cav-render-inspect-one-turn/v001',
 'Also indexed in AGENTS.md and campaign README; this is a scheduling/verification rule, not automatic owner art approval.');

INSERT INTO kb_decisions
(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES
('D-2026-10-24-CAV-RENDER-INSPECT-SINGLE-TURN',
 'Cabin in the Ashen Veil: no standalone rendering turn without same-turn inspection',
 'Every Cabin image RENDER turn must visually INSPECT its exact generated or edited output in the same 20-minute turn, checking room topology, mandatory props, puzzle continuity, neutral lighting, aging and spoilers, with a saved PASS, REDO or BLOCKED result. Every second revision in that turn needs its own inspection. Owner final art approval remains a separate gate where required before Foundry installation. Next H-U07 render must use authoritative geometry guide and inspect the west entrance, unbroken east/south wall, absence of stairs and the three independent quest anchors.',
 'The owner explicitly combined image rendering and inspection to avoid wasted continuation turns and uninspected or incorrect artwork.',
 'campaign','locked','Cabin in the Ashen Veil owner',
 'S-2026-10-24-CAV-RENDER-INSPECT-ONE-TURN',NULL);

INSERT INTO decisions_fts (decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions
WHERE decision_id='D-2026-10-24-CAV-RENDER-INSPECT-SINGLE-TURN';
