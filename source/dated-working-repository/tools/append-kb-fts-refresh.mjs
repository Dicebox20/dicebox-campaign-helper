import fs from "node:fs";

const path = new URL("../database/seed.sql", import.meta.url);
const marker = "-- M1001/M1002 append-only FTS refresh";
let seed = fs.readFileSync(path, "utf8");
if (!seed.includes(marker)) {
  seed = `${seed.trimEnd()}\n\n${marker}\nDELETE FROM facts_fts;\nDELETE FROM decisions_fts;\nDELETE FROM open_items_fts;\nDELETE FROM trials_fts;\nDELETE FROM research_fts;\nINSERT INTO facts_fts(fact_id,title,statement,tags) SELECT fact_id,title,statement,tags FROM kb_facts;\nINSERT INTO decisions_fts(decision_id,topic,decision,rationale) SELECT decision_id,topic,decision,rationale FROM kb_decisions;\nINSERT INTO open_items_fts(item_id,title,problem,next_action,evidence_needed) SELECT item_id,title,problem,next_action,evidence_needed FROM kb_open_items;\nINSERT INTO trials_fts(trial_id,area,symptom,attempted_approach,failure_cause,correction) SELECT trial_id,area,symptom,attempted_approach,failure_cause,correction FROM kb_trials;\nINSERT INTO research_fts(subject_no,subject,project_delta,community_research,next_step) SELECT subject_no,subject,project_delta,community_research,next_step FROM kb_research_subjects;\n`;
  fs.writeFileSync(path, seed);
}
console.log("Appended deterministic FTS refresh block.");
