-- 2026-10-24 Cabin in the Ashen Veil owner-directed replacement of art approval gate.
-- Seed is committed, NOT applied to the live KB in this turn.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('S-2026-10-24-CAV-ASSISTANT-FINAL-ART-GATE',
 'Owner delegates final Cabin art PASS or FAIL authorization to assistant',
 'campaign','Campaign: Cabin in the Ashen Veil visual art production only',
 'Direct owner instruction: "you\'re final pass fail is the new authorization, you can decide. start next step"',
 'active',
 'campaign-archives/cabin-in-the-ashen-veil/roadmaps/owner-approved-codex-continuation-and-foundry-execution-rules-2026-10-23.md',
 '2026-10-24','cav-assistant-final-art-gate/v001',
 'Supersedes prior separate owner final art inspection signoff within this side campaign only. Pixel inspection and game fidelity still mandatory, 20-minute bounded RENDER+INSPECT.' );
INSERT INTO kb_decisions
(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES
('D-2026-10-24-CAV-ASSISTANT-FINAL-ART-APPROVAL',
 'Cabin in the Ashen Veil — final visual artwork acceptance owner-delegated',
 'The assistant is authorized to issue the final evidence-backed PASS or FAIL for each exact rendered map image, during the same RENDER+INSPECT work turn. A PASS is final visual permission for the specific image to advance through normal BUILD/STAGE/INJECT/VERIFY/RECEIPT checks without another owner artwork approval. A FAIL/REDO/BLOCKED forbids installation and must be archived. Keep all current room topology, puzzle/canon/quest landmark, visibility, neutral lighting and ageing constraints intact; the exception does not make geometry or gameplay automatically verified.',
 'The owner explicitly replaced the earlier separate owner signoff gate with assistant final visual judgment while retaining all established functional inspection and development safeguards.',
 'campaign','locked','Cabin in the Ashen Veil owner',
 'S-2026-10-24-CAV-ASSISTANT-FINAL-ART-GATE',NULL);
INSERT INTO decisions_fts (decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions
WHERE decision_id='D-2026-10-24-CAV-ASSISTANT-FINAL-ART-APPROVAL';
