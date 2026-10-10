# DiceBox M02 Attempt #005 — Step 7 BUILD v002 checkpoint (2026-10-10)

**Status:** `VALIDATOR_PASS / RUNTIME_NOT_TESTED / NO_FOUNDRY_WRITES`.
**Macro artifact:** [M02-ATTEMPT5-STEP7-SINGLE-MACRO-BUILD-CANDIDATE-v002-2026-10-10.md](M02-ATTEMPT5-STEP7-SINGLE-MACRO-BUILD-CANDIDATE-v002-2026-10-10.md).
**Canonical geometry input:** draft v003 (203 Walls, six Regions, six anchors, one default Level); no geometric modifications.
**Approved image identity:** PNG SHA-256 `c9ed3fd61af2db629beef5e2d771eb2c7abce86324283a02614dfec7e1bc72aa`; 1536×1024. Original grayscale hash `878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf`.
**Scene:** `btr-expedition-m02-tallcap-forest`; gridless 36×24 at 120 px/5ft, 4320×2880 pixels; original-to-Foundry multiplier 2.8125.

## Reconciliation of historical macro transport

Canonical BUILD requires one Markdown with exactly one runnable JS macro, marked `dicebox-scene-injector-build/v2`. The previous v001 preflight-only candidate was not compliant, and its historical FAIL is preserved. The new v002 contains the full blueprint geometry and one macro; `node tools/validate-dicebox-build.mjs` returned `PASS` and zero violations in an isolated checkout. JavaScript syntax `node --check` returned 0. Canonical `database/build_database.py` and `database/verify_database.py` both passed before this change (9 seed deltas; 1276 recorded trials; active blockers 115). They were **not** rerun after this receipt, which does not modify SQL.

## Image handling and known historical deviation

The approved PNG is **not yet embedded** as pre-generated compressed base64 chunks. v002 instead prompts the GM to select it **within the one macro**, verifies its exact PNG SHA-256, compresses to WebP in-browser, and uploads/reads back the compressed asset before making Scene documents. The separately produced compressed 1536×1024 WebP in this session measured **342940 bytes**, SHA-256 `09cea16c5b14c9d83e062ee6783d4dd08f45154cd1a5aff67ee3fdb70f76ae87`. That generated WebP is a proof of compressibility, not the macro's exact dynamically re-encoded output (which may differ by browser implementation). **This is not the historical pre-embedded compression/reassembly method** and must be part of the user-requested post-M02 historical comparison.

## Stage separation and unresolved acceptance

- The macro can create a new M02 scene with geometry; it refuses a same-named/semantically owned existing scene rather than overwrite GM state.
- No unapproved teleport destination, lore DC, resource/mining, auto-hunt rewards, or speculative Regionwright behavior is manufactured. Northern forage, southern manual hunt, milestone discovery, and lighting candidates require explicit behavior contracts before they can be described as functioning mechanics.
- Live Foundry APIs, asset upload, world profile, Wall movement/sight, Region schema, collision, movement, Regionwright integration, scene ownership/idempotence, and end-to-end runtime recovery have **not** been tested.
- Runtime installation should not be attempted until Step 8 validates actual Foundry version and each API. A validator PASS certifies transport only. If runtime fails after Scene creation, inspect and reconcile before retry; never blindly rerun.
- Historical v003 ground uncertainty remains recorded; user has approved usability variance but this is not a player movement canary.
- No Foundry execution/injection this turn, no world writes.
- **Catalogue:** this branch checkpoint is durable but main KB change/merge and active roadmap synchronization remain pending. Do not call canonical database synchronized until those actions and rebuild/verification occur.

## Follow-up after M02 (user-requested, independent task)

Compare previously successful DiceBox injection macros against v001/v002/current Injector workflow; verify prior 100%-successful historical sample set, embedded artwork compression/chunk reassembly behavior, stable IDs, default Level reuse, native Region/Wall APIs, validation, retries and receipts; identify divergence and restore tested elements without downgrading current safety rules. This investigation is **not a reason to abandon approved M02 art or geometry**.

## Next action

Step 8 read-only preflight and runtime API verification, then reconcile genuine missing mechanics and inspect whether the exact historical embedded-art compression method can be restored as a new versioned one-macro BUILD. Main KB/catalogue sync is pending. Stop by the accepted 20-minute work cap.
