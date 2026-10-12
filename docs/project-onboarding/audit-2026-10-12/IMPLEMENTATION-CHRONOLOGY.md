# Implementation and acceptance chronology — verified milestones first

Do not confuse (1) documented acceptance/effective date, (2) authored/event date, (3) Git commit time, (4) file path date hint, and (5) actual implementation/deployment date. A document can describe work years earlier or be added to Git later. The source inventory records **path date hints only**; its `date_hint` column must never be presented as a verified implementation date.

| Date verified from source text | Change/decision | Status | Evidence |
|---|---|---|---|
| 2026-10-12 | Mysterious Lodge GM puzzle directions revised | Draft content only, not live installed | Migration-only `docs/CENTRAL-LODGE-PUZZLE-DIRECTIONS-2026-10-12.md` |
| 2026-10-12 | Companion workspace snapshot | Archive evidence; not new implemented product capability | PR #16 and archive README + SHA-256 manifest |
| 2026-10-09 | 20-minute bounded work turns | User-accepted | Current `main` 20-minute cap |
| 2026-10-09 | Clean-restart image generation | User-accepted/locked | Current `main` clean restart rule |
| 2026-10-09 | Geometry tolerance standard v0.1 | User-accepted/locked | Current `main` standard; accepted proposal provenance |
| 2026-10-07 | Project data taxonomy and chronology | Canonical | Current `main` data architecture/new-data rule |
| 2026-10-07 | Semantic map/scene rendering v2026-10-07.2 | Canonical workflow | Current `main` semantic render document |
| 2026-10-05 | Scene automation and Injector BUILD hardening | Accepted | Current `main` automation/hardening |
| 2026-10-05 | Map/token scale profile battlemap-120 | User-accepted | Current `main` scale standard |
| 2026-10-05 | Discovery workflow | User-accepted | Current `main` discovery standard |
| 2026-10-01 | GitHub-centric unified Campaign Helper identity | Canonical repository decision | Current `main` unification |
| 2026-09-19 | BTR NPC Injector baseline documented, three fresh actors reportedly created | Historical live-validation record, not confirmed latest global implementation | BTR NPC Injector handoff |
| 2026-08-26 | Development workflow v2026-08-26.3 (contains later edits) | Accepted, effective version | Current `main` development workflow status |
| 2026-08-24 | Account integration/provider ADR reconciled | Accepted architecture | Current `main` ADR-0007 |
| Undetermined | Global Puzzle Matrix completion/deployment | Not established; testing and design pending | User scope + existing partial puzzle code and campaign records |

Dates for other files are **not inferred as implementation milestones**. Unresolved historical work needs a per-change commit/receipt and KB decision trail before it enters this table as implemented.
