-- Explicit user-approved structural artistic variance, with local reviewed geometry.
-- Never treat raster tracing as Foundry geometry; no live runtime claim.
INSERT INTO kb_sources
(source_id,title,source_kind,scope,authority,status,location,captured_at,version_fingerprint,notes)
VALUES
('SRC-2026-10-16-DARK-ARCH-STRUCTURAL-VARIANCE',
 'Dark Arch M01 bridge north and gate west render variance accepted',
 'conversation','campaign','current user acceptance + local geometry fixture','accepted',
 'DiceBox Campaign Helper conversation 2026-10-16 / heist Dark Arch INSPECT',
 '2026-10-16','structural-render-sha256:036823143bce9d2c92a818ccc9e7cc9496a08a0f99608a3cc3564115b06880f8',
 'User is explicitly fine with a north-shifted bridge and west-shifted gate; the enlarged water area improves the perception that boat travel is viable. Original 1619x971 grayscale render is attached to the conversation, not committed as repository image bytes.');

INSERT INTO kb_decisions
(decision_id,topic,decision,rationale,scope,status,owner,source_id,next_review)
VALUES
('D-2026-10-16-DARK-ARCH-STRUCTURAL-VARIANCE',
 'Dark Arch M01 intentional visual layout deviation',
 'Retain the current embossed grayscale render despite northward bridge and westward gate placement. Treat the deviation as expressly user accepted for visual game design. Reconcile separate authored semantic Spatial Blueprint and Feature Manifest, preserving bridge, gate, two postgate bypasses and separate skiff. Do not auto-trace authoritative Foundry Walls from the rendered pixels. Structural inspection may pass with documented variance upon passing local route checks; final paint approval remains a separate final inspection.',
 'The changed composition makes the water route visually prominent and preserves the desired sandbox heist feel.',
 'campaign','locked','DiceBox Campaign Helper Foreman',
 'SRC-2026-10-16-DARK-ARCH-STRUCTURAL-VARIANCE',NULL);

INSERT INTO kb_facts
(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags)
VALUES
('F-2026-10-16-DARK-ARCH-STRUCTURAL-RECONCILED',
 'scene',NULL,'Dark Arch grayscale structural layout accepted with authored geometry reconciliation',
 'The user accepted offset bridge and gate positions in Dark Arch grayscale render (original 1619x971 image SHA256 036823143bce9d2c92a818ccc9e7cc9496a08a0f99608a3cc3564115b06880f8) to emphasize accessible water travel. A new independent semantic model, written after review rather than traced automatically from pixels, passed 10/10 pure local clearance/route checks: normal bridge when gate open, closed gate blocking, separately adjudicated skiff to island dock, overhead rope to island terrace, and connector-removal negative controls. No Foundry runtime verification or FINAL_INSPECT approval exists.',
 'campaign','deterministic','active',
 'SRC-2026-10-16-DARK-ARCH-STRUCTURAL-VARIANCE',NULL,
 'dark-arch,structural-inspect,documented-variance,geometry-reconciliation,boat-route,accepted-art');

INSERT INTO kb_trials
(trial_id,area,symptom,attempted_approach,failure_cause,correction,evidence_status,source_id)
VALUES
('T-2026-10-16-DARK-ARCH-STRUCTURAL-RECONCILIATION',
 'Dark Arch structural grayscale visual approval and map geometry drift',
 'Structural art was clearly overhead and supported both alternate entries but bridge centerline moved about 14ft north and gate around 12ft west of first geometry model.',
 'User accepted composition and explicitly preferred greater visual emphasis on viable water travel; construct a new manually authored semantic model of the accepted arrangement and run open/closed gate, medium/large token, dock stair, upper terrace and negative-control checks.',
 'Original render-generation model drift from the earlier validated layout; blindly promoting former coordinate Blueprint or pixel-derived Walls would violate geometry tolerance and precedence.',
 'Retain image as accepted structural artwork; preserve original geometry as historical evidence, record reviewed offset as accepted, and use separately validated revised semantic model plus feature manifest for downstream paint and BUILD planning.',
 'PASS_LOCAL_ART_RECONCILED_UNVERIFIED_FOUNDRY',
 'SRC-2026-10-16-DARK-ARCH-STRUCTURAL-VARIANCE');
