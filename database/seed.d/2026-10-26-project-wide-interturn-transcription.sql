-- 2026-10-26 owner-authorized global conversational continuity rule.
-- Additive chronology and provenance; no campaign canon promotion or live Foundry mutation.
INSERT INTO kb_sources
 (source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
 ('S-2026-10-26-ALL-CHATS-TRANSCRIPTS',
  'Owner-approved project-wide interturn conversation transcription workflow',
  'project',
  'All DiceBox Campaign Helper project chats and campaign/Foreman/Worker chats, except explicit owner-scoped exemptions',
  'Explicit project owner instruction 2026-10-26 to transcribe all conversations including dialogue BETWEEN bounded execution turns',
  'active',
  'docs/PROJECT-WIDE-CHAT-TRANSCRIPTION-AND-INTERTURN-CONTINUITY-RULES-2026-10-26.md',
  '2026-10-26',
  'dicebox-all-chat-interturn-transcript-v1',
  'Capture exact visible messages when available, order and timestamp responsibly, redact secrets, mark reconstruction/gaps, and durably link GitHub segments with handoffs.');
INSERT INTO kb_decisions
 (decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES
 ('D-2026-10-26-ALL-CHATS-INTERTURN-TRANSCRIPTS',
  'Continuous all-chat conversation retention through bounded-turn gaps',
  'Every project chat must chronologically archive owner-visible dialogue before, during, BETWEEN and after development turns, not only code handoffs. Prefer verbatim available text; explicitly mark unavailable history, reconstructions, privacy redactions and incomplete coverage. Commit, push, index and link verified transcript segments in canonical project/campaign records.',
  'Owner requires long-lived, resumable conversations that preserve corrections and decisions made outside programming turns; earlier per-turn reconstructed transcript summaries omitted between-turn dialogue.',
  'project','locked','project owner','S-2026-10-26-ALL-CHATS-TRANSCRIPTS',NULL);
