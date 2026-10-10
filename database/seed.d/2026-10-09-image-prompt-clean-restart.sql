-- 2026-10-09 user-accepted permanent DiceBox image-generation rule.
-- Additive reproducible knowledge-base delta; does not modify earlier decisions or history.
INSERT INTO kb_sources (
 source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes
) VALUES (
 'S-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART',
 'DiceBox universal image-prompt clean restart, user-accepted',
 'project',
 'All DiceBox image attempts in ChatGPT, Codex, Campaign Helper desktop, scene workflows, assets and future image providers',
 'Explicit user permanent rule on 2026-10-09; canonical GitHub normative instructions and reproducible project KB',
 'active',
 'docs/DICEBOX-IMAGE-PROMPT-CLEAN-RESTART-RULE-2026-10-09.md',
 '2026-10-09',
 'dicebox-image-prompt-clean-restart/v1',
 'Never create a variation of an earlier image prompt. Archive failed prompt and image as evidence only; write a wholly new independent prompt from accepted source specification. Preserve accepted requirements, not previous wording/composition. Programmatic lexical guard is necessary but cannot independently prove semantic novelty.'
);
INSERT INTO kb_decisions (
 decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review
) VALUES (
 'D-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART',
 'Permanent project-wide image-generation retry rule',
 'Never use a variation, paraphrase, corrected extension, negative revision, reused seed or failed-image edit of an earlier image prompt. Discard the prior prompt completely as creative input and independently re-author each subsequent image prompt from canonical accepted task specifications. Applies to all DiceBox image categories and all ChatGPT/Codex project chats and desktop app image workflows. Archive immutable prior attempts; preflight before provider calls. Preserve separately accepted grayscale reference on painterly stage when canonical.',
 'Repeated minor prompt edits reinforced unsuccessful map topology and failed to solve recurring road-clearance/milestone problems in M02. The user explicitly requested permanent project-wide adoption in both chats and app.',
 'project','locked','DiceBox Campaign Helper Foreman','S-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART',NULL
);
INSERT INTO kb_facts (
 fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags
) VALUES (
 'F-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART',
 'dicebox.image-generation',NULL,
 'All image retries use independent prompts from canonical inputs',
 'Every subsequent DiceBox image-generation attempt must use a wholly independently authored new prompt derived from the authoritative accepted task specification, never a reused/varied/rephrased failed prompt, previous seed or failed output image. Archive past attempts as evidence only; review independent composition before generation. Same established map layout requirements and accepted grayscale may remain binding. The compiler and desktop app must enforce a fail-closed preflight at any implemented provider boundary. Project Instructions are separately configured in ChatGPT; repo edits cannot remotely change them.',
 'project','canonical','locked','S-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART',NULL,
 'image prompt clean restart project-wide permanent maps tokens portraits UI art scene REDO'
);
INSERT INTO kb_open_items (
 item_id,item_class,title,problem,next_action,evidence_needed,priority,status,owner,source_id
) VALUES (
 'O-2026-10-09-CHATGPT-PROJECT-INSTRUCTIONS-IMAGE-RULE',
 'implementation',
 'Synchronize locked clean-restart rule into ChatGPT Project Instructions',
 'Canonical GitHub docs and KB do not automatically modify the separate ChatGPT Project Instructions platform setting; not every project chat may load AGENTS.md.',
 'Add the exact short clause from docs/DICEBOX-IMAGE-PROMPT-CLEAN-RESTART-RULE-2026-10-09.md to ChatGPT Project Instructions through authorized project settings. Until then, load canonical rule at beginning of each DiceBox image job.',
 'Project Instructions readback by an authorized user/admin with policy version reference, and a fresh chat confirming the rule is loaded.',
 'P1','open','DiceBox Campaign Helper project owner','S-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART'
),(
 'O-2026-10-09-IMAGE-PROVIDER-GUARD-INTEGRATION',
 'certification',
 'Certify prompt-clean-restart gate at all desktop image-provider invocation boundaries',
 'The image-provider rendering integration remains a future implementation; a pure compiler gate and Map Lab adapter are not production proof that all provider calls are blocked.',
 'Wire authorizeDesktopImageGeneration into every concrete provider before dispatch; add integration fixture that attempts a near-copy redo and shows no outbound provider request.',
 'Provider adapter call-site evidence, attempted-retry blocked receipt and independent persisted provider-call audit.',
 'P1','open','DiceBox Campaign Helper Foreman','S-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART'
);
INSERT INTO decisions_fts (decision_id,topic,decision,rationale)
SELECT decision_id,topic,decision,rationale FROM kb_decisions
WHERE decision_id='D-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART';
INSERT INTO facts_fts (fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART';
INSERT INTO open_items_fts (item_id,title,problem,next_action,evidence_needed)
SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items
WHERE item_id IN ('O-2026-10-09-CHATGPT-PROJECT-INSTRUCTIONS-IMAGE-RULE','O-2026-10-09-IMAGE-PROVIDER-GUARD-INTEGRATION');
INSERT INTO kb_relationships (relationship_id,from_type,from_id,relation,to_type,to_id,notes)
VALUES (
 'R-2026-10-09-IMAGE-RESTART-DECISION',
 'decision','D-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART','governs',
 'fact','F-2026-10-09-IMAGE-PROMPT-CLEAN-RESTART',
 'Permanent user rule is normative authority for all project images.'
);
