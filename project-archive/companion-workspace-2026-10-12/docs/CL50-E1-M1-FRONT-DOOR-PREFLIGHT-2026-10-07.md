# CL-50 — E1 Front Entrance to M1 Main Door — Staged Safe Slice
Date: 2026-10-07 PDT. **NO LIVE APPLY.** Exact route candidate has only SOURCE PREVIEW and offline contract tests.

## Authority and route
- Source `Central Lodge — E1 Arrival Clearing & Front Grounds`, Scene `Zq8iXByDVhHRbA7w`.
- `E1 Lodge Entrance` Region `QS7OpvIilyyDpmLc`, stable ID `dbx:central-lodge:e1:region:e1-lodge-entrance`, rectangle (1850,900,640,300), zero current behaviors.
- Destination `Central Lodge — M1 Entrance Hall & Great Room`, Scene `U8S5ZrTjaPIkTUIL`.
- `M1 Transition — Main Door` Region `4b8vfvKAKXBS6kfW`, stable ID `dbx:central-lodge:m1:region:m1-transition-main-door`, rectangle (1760,2180,800,700), zero current behaviors.
- Source E1 authored `build/E1-injector-v002.md` describes porch entry as a future transition; M1 PREPARE calls the front-door Region the exterior travel anchor. This is a **high-confidence physical pairing** (not an installed route).
- `cl50-e1-m1-front-door-pair-preview-v001.page.js` **PASS_SOURCE_PAIR_CANDIDATE** noWrite, no Region/puzzle/ledger mutation.

## Stage-only executable design
- `cl50-e1-m1-front-door-source-v001.txt` SHA256 **`f144c80ca7789ea0ca246a43529bea56b53776d965b1c6471670a89abf236b0f`**.
- Derived from independently source-verified T3→F1 GM-confirmed one-way transit pattern; exact E1 and M1 destination IDs, voluntary GM confirmation, decline cooldown, concurrent-entry guard, one-player ownership resolution and no forced transition.
- `cl50-e1-m1-front-door-offline-test.cjs` **8/8 PASS** (not GM, decline, success, missing source authority, missing destination, teleport exception, concurrent entry suppression).
- For a future real guarded APPLY, author scene/Region source fingerprints, freeze target stable IDs, authorize `destinationStableSceneId=dbx:central-lodge:m1` on E1 entrance, create only one owned RegionBehavior on E1 with rollback, and independently read-verify 21/202/116 after exactly one addition. Do not create a return behavior on M1 simultaneously (avoids bounce loop).
- E1↔M1 full two-way movement, user/player canary, exact owner mapping, and cross-client no-bounce behavior are NOT certified. Prepare PREVIEW → APPLY → FINAL VERIFY only in the next bounded work unit after reread.
