-- 2026-10-26 later explicit owner simplification of project-wide transcript practice.
-- Preserve the earlier decision and source as historical evidence.
INSERT INTO kb_sources (source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes) VALUES
 ('S-2026-10-26-SINGLE-LIVING-TRANSCRIPT',
  'Owner clarification: one living transcript document updated between work turns',
  'project','All DiceBox Campaign Helper project chats',
  'Explicit owner correction 2026-10-26: "The transcript just needs to be a document you update between turns"',
  'active','docs/PROJECT-WIDE-CHAT-TRANSCRIPTION-AND-INTERTURN-CONTINUITY-RULES-2026-10-26.md',
  '2026-10-26','dicebox-single-living-conversation-doc/v2',
  'Simplifies previous all-chat transcription requirement; retains exact available speech and honest source labels.');
UPDATE kb_decisions SET status='retired'
 WHERE decision_id='D-2026-10-26-ALL-CHATS-INTERTURN-TRANSCRIPTS' AND status='locked';
INSERT INTO kb_decisions (decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review) VALUES
 ('D-2026-10-26-SINGLE-LIVING-TRANSCRIPT',
  'One continuously maintained conversation document per chat',
  'Each chat updates its existing transcript document between bounded work turns, appending newly available dialogue. A new segmented transcript, index, separate metadata and per-exchange archival workflow are not required. Keep chronology, honest unavailable/reconstructed labels, privacy and verified repository storage.',
  'Owner expressly replaced a complex archive workflow with one simple living transcript document per chat.',
  'project','locked','project owner','S-2026-10-26-SINGLE-LIVING-TRANSCRIPT',NULL);
