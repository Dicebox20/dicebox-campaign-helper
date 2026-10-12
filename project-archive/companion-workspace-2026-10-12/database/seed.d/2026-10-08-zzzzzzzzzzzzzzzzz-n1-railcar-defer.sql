-- N1 rail-car state reconciliation
INSERT OR REPLACE INTO kb_facts(fact_id,domain,subject_no,title,statement,scope,evidence_class,status,source_id,supersedes_fact_id,tags) VALUES
('F-2026-10-07-N1-RAILCAR-DEFERRED','campaign.central-lodge.n1',NULL,'N1 rail-car activation state deferred','N1 build flags mention railCarActivated, but the canonical runtime ledger has no such key, repository search found no downstream authority for it, and N2 instead owns fastTravelEnabled plus an Estate Rail Car State Region. CL-30 must not invent puzzles.n1.railCarActivated. Install only the seven evidenced N1 behaviors through railwayPowered and estateRailwayInterpreted; leave the N1 Estate Rail Car system Region behavior-free for CL-31 fast-travel reconciliation.','campaign','blocked','active','S-2026-10-07-CENTRAL-LODGE-N1-PREFLIGHT',NULL,'central lodge n1 rail car deferred n2 fast travel no invented state');
INSERT INTO facts_fts(fact_id,title,statement,tags)
SELECT fact_id,title,statement,tags FROM kb_facts
WHERE fact_id='F-2026-10-07-N1-RAILCAR-DEFERRED'
AND NOT EXISTS (SELECT 1 FROM facts_fts f WHERE f.fact_id=kb_facts.fact_id);
