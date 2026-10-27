# Cabin in the Ashen Veil — Chat B Late-Game Development Handoff

> **LATER OWNER OVERRIDE — October 26, 2026:** The campaign owner directed that **Crooked Man encounters be implemented LAST**, all **haunt encounters be checkpoint-related rather than directly required by puzzle chains**, and **the owner personally roleplays the encounters**. Any earlier clauses here that make chase completion a requirement for Silver Tiny Key, Forest Well access, music/prayer, Rufus, book/Vault or other puzzle progress are **superseded and must be reconciled in source**. Existing dormant encounters remain safely disabled; no fake player reward or puzzle flags. The puzzle chains need independent, genuine progression and Items. Do not automatically launch encounters. [Binding owner decision](../decisions/2026-10-26-owner-haunt-checkpoints-gm-roleplay-decouple-puzzle-progression.md) and [cross-workstream updated handoff](./cav-owner-haunts-last-checkpoint-driven-puzzle-decoupling-handoff-2026-10-26.md). Full compatibility/player testing remains AFTER all content is installed.


**Handoff date:** 2026-10-26 (Pacific)
**Issued by:** Chat A — current campaign coordinator / primary integrator
**Recipient:** Chat B — bounded late-game implementation workstream
**Status:** Ready for Chat B to begin **read-only reconciliation and isolated source/test work**. **This document is not a live Foundry write authorization, a change in campaign canon, or permission to bypass owner approval.**

> **Chat B startup instruction:** Read this handoff and every current linked authority below, establish an independent Git branch and worktree, then begin with a read-only late-game Region/Item/API/contract matrix. Do not create a second Foreman or deploy directly to the live campaign. Report progress to Chat A by committed SHA and reviewable receipts.

## 1. Mandate and division of ownership

The owner has directed a two-chat division. **Chat A remains the one active coordinating Foreman/integrator** for this campaign work, owns early/midgame, live Foundry VTT writes, shared module registration/integration, gameplay commissioning, full-chain acceptance, and promotion of Chat B work. Chat B is the **independent late-game worker**: investigate, design against approved canon, add isolated source modules and pure tests, write integration contracts, and produce reviewable source artifacts and per-turn handoffs.

**Chat A workstream — DO NOT MODIFY FROM CHAT B:** initial navigation, carriage/Studio/attic, Sune busts/SG-05 sliding mosaic and Study 587, Roof Gear, original Crank/Sluice/Pond/Bath water controller, Weathered Key/Basement, Bath Screwdriver/Parents nightstand Gate Handle, Aqueduct gate/first Crooked Man chase/Forest Well, Sophia first-chase capture/release, Boiler 2/1 pressure, Rosewater Skyrim-style rings and Scrying Bowl pickup integration. All live world/Scene/Region/Item/Actor/Token writes and core module registration belong to Chat A unless the owner explicitly reassigns them.

**Chat B workstream — source-only until reviewed:** the late **second** Crooked Man chase at SG-01 and subsequent Silver Tiny Key → Hope Chest/Ornate Music Box/Prayer of Protection → Candle Workshop Wick → Gazebo oil+wick/second eye → Rufus reactivation → deliberately charging the Gondian source at Aqueduct → Crimson Veil; Veil-era six storybooks and spine mosaic, Privy copper-key retrieval, Greenhouse lye-only plant killer and far dock/Boathouse Prayer of Devotion, Sune/Gond emblem halves, Vault Keystone, outer and inner Undercroft gates and ending. Study and preserve related journals, original Items, source artwork and player prerequisites before implementing. Work in documented dependency order and split into small bounded features.

**Shared boundary:** Chat B may define interfaces for consuming Chat A's verified upstream receipts (first chase outcome, synchronized water-restored, Sophia state, authentic inventory provenance), but may **not** set, simulate in the live world, or weaken those flags. When blocked on an upstream contract or artistic/canonical ambiguity, record the exact blocker and return a proposed interface for Chat A review.

## 2. Mandatory sources and precedence

Follow newest **explicit owner decisions** first; then owner-approved dated campaign checkpoints; verified Foundry/source evidence; project knowledge base/established workflows; then older audits. Older Region inventories are snapshots, not current state. Do **not** promote a test pass to player gameplay certification.

Read in order:

1. [Current campaign usability baseline, 2026-10-26](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chain-usability-baseline-2026-10-26.md).
2. [Latest Chat A campaign status and exact blockers](https://github.com/Dicebox20/dicebox-campaign-helper/blob/codex/cabin-ashen-veil-recovery/campaign-archives/cabin-in-the-ashen-veil/handoffs/cav-campaign-chain-usability-status-handoff-2026-10-26.md).
3. [Chronological Regionwright source/install log](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/regionwright-puzzle-update-log-2026-10-26.md).
4. [Campaign Helper mission and one-Foreman/bounded-Worker protocol](https://github.com/Dicebox20/dicebox-campaign-helper/blob/codex/cabin-ashen-veil-recovery/docs/PROJECT-MISSION-AND-ORCHESTRATION.md).
5. `Documents\Region Editor\docs\cabin-ashen-veil\region-puzzle-chain-audit-2026-10-25.md` — **historical** original late-game inventory: 46 Scenes/203 Regions/96 behaviors/68 resolving teleport destinations at that time; many early/mid blockers have since been installed.
6. `Documents\Region Editor\docs\cabin-ashen-veil\puzzle-completion-regionwright-static-image-boundary-plan-2026-10-25.md` — **owner-directed Regionwright puzzle ownership and wave order**. Read full content before coding.
7. [Approved campaign specification](https://github.com/Dicebox20/dicebox-campaign-helper/blob/codex/cabin-ashen-veil-recovery/campaign-archives/cabin-in-the-ashen-veil/authoritative-puzzle-design-and-foundry-implementation-spec-v1-2026-10-22.md), **as superseded by later owner approvals**; source IDs/item UUIDs must be independently verified in the current world/source.
8. All relevant original PREPARE → RENDER → INSPECT → BUILD → VERIFY → CATALOGUE records, GitHub history and knowledge database. Preserve exact UUID and provenance, do not recreate existing Item templates or Region artwork without confirming absence.

**Continuity note:** There are real chronological logs, campaign handoffs, structured metadata and available-message transcript reconstructions. A single repository-root, project-wide `CONTINUITY.md` has **not been verified**. Treat the linked records above as the present concrete entrypoints. Do not announce a master document exists until it is actually created and audited.

## 3. Current evidence boundary — do not misreport playability

As of the latest 2026-10-26 audited reports, approximately **40% of major chain progression has substantive source/native installation**; this is a rough planning estimate, **NOT** 40% certified playable. Early chain mostly structurally installed, midgame partial, late game largely unfinished. Current pure/regression test baseline is **83/83 pass** for relevant Cabin tests, but **zero full start-to-finish ordinary non-GM player acceptance runs** are certified.

**Live source/world:** Foundry VTT **14.367**, world `cabin-in-the-ashen-veil`, elected GM `Gamemaster 1`. Original Crank `Item.g3VYdgc1qkgkHGvn` is not yet player-fitted; `cavPondBathWaterState` and `cavSluiceStageTransaction` have not been committed. Rosewater symbols **rose/sun/moth/thorn** are owner-approved; the original solution is **outer 90°, middle 270°, inner 180° / [1,3,2]**, but the native ring Behavior is disabled until a legitimate synchronized drain. Boiler 2/1 is structurally enabled, not player tested. Aqueduct travel and first chase are staged disabled, and the **Crooked Man Actor/token and all full gameplay testing are explicitly deferred by the owner until final testing**. Do not activate or manufacture these prerequisites.

The extra October 26 Pond/Bath/Trail geometry/portal audit was interrupted by Dev Chrome 9224 disconnect and remains incomplete; this is Chat A's issue, not evidence of a missing stage. The previous late-game audit may be used to form a **hypothesis** only, followed by current source readback.

## 4. Canon that Chat B MUST preserve

- **Two distinct chases.** The **first** Crooked Man encounter is at Aqueduct and tied to the Forest Well/Sophia capture/rescue; Chat A owns it. The **second** chase begins at the **SG-01 northwestern Sune bust** and is independently gated by first-chase completion, genuinely restored Waterworks, and Allen's warning read. Early Winder interaction alone must NOT start it. Crooked Man Actor creation/chase activation remain deferred.
- **Late chase rewards:** the second chase connects to **Silver Tiny Key → Hope Chest/Music Box → Prayer of Protection → Candle Workshop → Wick**. Keep original source IDs and current Item existence checks; the Oct25 audit reported some world Item templates absent (Silver Key, Ornate Music Box, Prayer of Protection, Wick)—recheck before proposing any creation.
- **Rufus:** Sophia's stuffed bear yields the first Glass Eye through its existing interaction; Gazebo's oil + Wick path provides the second eye. Gazebo's Rose/Cog/Star table is optional, **never** a mandatory gate to eye #2. Rufus then has a power-source path requiring the proper original charging stage.
- **Crimson Veil trigger:** it begins when the **Gondian source is deliberately charged at the Aqueduct**, **not** automatically at nightfall. The Veil-era sixth book appears on Sophia's bed only then.
- **Six storybooks:** genuine possession and publication-year order feed **Regionwright spine-mosaic**, and completion reveals an **in-room Sophia H-U05 compartment**—never obsolete H-U06. Existing six book Items may already exist; resolve IDs/years and avoid generic new book templates.
- **Greenhouse:** **LYE ONLY**, after actual Waterworks water is restored; older Thornroot Ash/multi-ingredient recipes are superseded. Preserve separate water-repair and plant-killer outcomes. The Greenhouse was `EXT-06` with three Regions but zero native behaviors in Oct25 audit; that is **stale until reread**.
- **Privy fishing:** copper-key retrieval through verified Regionwright Hunting & Gathering integration **or an approved native fallback**. The Regionwright Hunting & Gathering module was installed but inactive in Oct25 audit; do not silently activate it.
- **Vault and Bowl are distinct:** the original **Sune Scrying Bowl** is reached from the **drained unified Bathhouse** after Rosewater (do not build superseded separate BATH-04), not awarded by SG-05 or Vault. The four-input Vault awards the **Keystone**. Bowl + the correct **027** pellet gate the **outer** Undercroft approach; Keystone + lever gates the **inner** refuge. The **027 Great Room chest** and **587 Shack Crank** are distinct; the older live `024` chest Macro is ambiguous and must NOT be changed without reconciliation.
- **Emblem halves:** preserve distinct Gond/Sune provenance, only assemble with genuine halves, keep the outer/inner gate dependency ordering.
- **Regionwright artwork ownership:** Regionwright owns interactive puzzle graphics, movable sprites, hotspots, puzzle engine and UI. Do not substitute improvised native HTML panels or independently generate interactive artwork in DCH. Native GM controllers own item/actor preconditions, state transitions, once-only rewards, teleports, and safety. Static clue/Scene images require approved-art workflow; don't produce unsolicited campaign images or replace approved maps.

## 5. Safe parallel development and exact Git boundaries

**Repositories:**
- App/canon/handoffs: `Dicebox20/dicebox-campaign-helper`, active shared campaign branch `codex/cabin-ashen-veil-recovery`.
- Regionwright source: `Dicebox20/regionwright`, Chat A integration branch `codex/cav-sune-integration-20261026` (latest known status commit `508406a87f4d58df480da5461bd053a64924d820`, reread HEAD before branch creation).
- Current local Chat A Regionwright working checkout: `C:\Users\rujie\Documents\Region Editor` — **Chat B must not use it as a writable checkout**.

**Chat B FIRST creates a separate Git branch AND independent worktree/checkout**, suggested `codex/cav-late-game-chat-b-20261026`, based on an explicitly recorded current Regionwright integration commit. Never run concurrent `git add`, branch switching, module copying, installation, or commits in Chat A's checkout. Chat B writes new late-feature files (for example `studio-cav-late-*.js`, `tests/cav-late-*.test.mjs`) on its own branch only. **Do not directly modify shared registries** `studio-campaign.js`, `regionwright-puzzles-locks/scripts/api.js`, shared water/first-chase services, common source chronology, roadmap/governance files, or the installed Foundry module. Instead submit a precise integration patch/contract to Chat A.

**One live writer:** Chat A alone operates the live Foundry world, Dev Chrome CDP, module deployment, native Region scripts and GM state. Chat B may conduct repository/knowledge read-only audits and work with pure/local fixture tests on an isolated branch. Any expansion into live Foundry work or shared edits must be expressly delegated and coordinated, with an owner-directed exception taking precedence.

**No silent canon promotion.** Chat B changes are PROPOSED/TESTED until Chat A reviews them and records disposition: promoted, revised, provisional, blocked, superseded, or rejected. Use source SHA and explicit tests, and cite specific owner approvals for any nontrivial design decision.

## 6. Chat B execution order and deliverables

**Initial bounded turn — mandatory research/audit, no live writes:**
1. Read the sources above and original late-game Scene/Item manifests; compare Oct25 audit to latest branch source/flags.
2. Produce a table: `NODE | PLAYER PREREQUISITE | Scene/Region/Item UUIDs | EXISTING SCRIPT/ENGINE | MISSING API/GM ADAPTER | OWNER CANON | TEST STATUS | INTEGRATION BOUNDARY`.
3. Select one smallest safe, dependency-ordered work package (prefer **SG-01 second-chase prerequisites and downstream reward interface**, or **Greenhouse lye-only GM contract** if the chase is blocked by deliberately deferred NPC art). Do **not** start by building the Crooked Man Actor.
4. Return source-only implementation plan, exact stable IDs/hashes, anti-duplication and player-privacy rules, and test acceptance criteria for Chat A review.

**Subsequent isolated implementation waves:**
- Wave L1: second-chase prerequisites, Silver Key / Hope Chest / Music Box / Prayer, Candle Workshop Wick, Gazebo oil/eye, Rufus stage and deliberate Aqueduct charge interfaces—source-only with upstream gates.
- Wave L2: Veil-era book acquisition, six-book spine-mosaic adapter and Sophia H-U05 reward, original storybook data provenance and private visual clues.
- Wave L3: Privy fishing source integration/approved fallback, Greenhouse lye-only authenticated GM reward, far dock/Boathouse Devotion and Sune half.
- Wave L4: Vault four-input authenticated predicate evaluator, Keystone, Bowl+027 outer approach, Keystone+lever inner Undercroft, source-only ending gates.
- Wave L5: integration review, adversarial cases, once-only claims, replay/reload, split-party privacy, disabled scenes/return safety and eventual owner-approved ordinary-player acceptance under Chat A.

Implement 1–2 logically coupled units per bounded batch. Never invent completed player outcomes or bypass the original Crank, Waterworks, first chase or Bowl condition just to make late integration easier.

## 7. Per-turn handoff contract / durable continuity

Work in **at most 25-minute bounded turns**. At START read the current owner approvals, roadmap, Chat A current handoff and latest dedicated Chat B continuity. At END: commit/push scoped changes to Chat B's independent source branch; append a **Chat B-owned chronological log** such as `docs/cabin-ashen-veil/chat-b-late-game-progress.md`; create a unique dated DCH campaign archive handoff and structured metadata, plus available-message transcript reconstruction **clearly labeled not lossless**. Store these under **Chat B's own noncolliding campaign-archive paths** (e.g. `campaign-archives/cabin-in-the-ashen-veil/workstreams/chat-b/`) on a separate reviewed branch or nonoverlapping files; do not edit Chat A's continuity records. Preserve native identities, URLs, SHA hashes, schema/version and blockers.

**Worker receipt format:** exact work package; source base/ref/commit; canonical dependency/UUIDs; files added/changed; behavior/API signatures; tests and failure reproductions; local/fixture/runtime evidence classification; no live writes certification; unresolved upstream dependencies; and the exact proposed patch/handshake required from Chat A.

**STOP/ESCALATE:** unknown lore approval, uncertain write/timeout, mismatched stable IDs, suspected duplicate world Item/Region, unsafe shared file, missing original source provenance, actor/tokens or unauthorized Foundry deployment. Do not blindly retry writes or run unbounded browser restarts.

## 8. First message Chat B can send back to Chat A

> I have accepted the late-game bounded-worker assignment. I will work in a separate Regionwright Git branch/worktree and leave your running Foundry world, installed modules, common registry files and early/midgame untouched. My first deliverable is a source-evidence chain matrix for SG-01 second chase → Rufus/Crimson Veil and Greenhouse/Veil final branches, with the smallest independent implementation package and exact prerequisites. I will report commit SHA, tests, receipt and blockers for your review before requesting integration.

**Integration handshake:** Chat B gives Chat A the worktree branch/ref, commit SHA, a strict source-file diff list, exported contract signatures, pure test command/result, fixture evidence, provenance IDs and any approval blockers. Chat A independently reviews, updates the program roadmap if accepted, merges/adapts shared registries and performs all live native Foundry commissioning with original GM/owner authorization.

---

**Handoff integrity:** This file is a **delegation scope and starting record**, not a claim that Chat B has started, connected to Foundry, created its separate branch, run tests, or installed late-game content. Those are subsequent actions to verify and catalogue.

## Coordination notice — Chat B exclusive late-game Silver Tiny Key ownership

**October 26, 2026 owner-reported Chat B recovery:** The owner quoted Chat B reporting an interrupted Silver Key staging update safely restored: original pickup Behavior disabled, both chase triggers disabled, no Silver Key or progression reward granted. This report is **not a new independent live-world verification by Chat A**.

**Chat B alone should reconcile, develop, source-test and install the late SG-01 Silver Tiny Key physical acquisition, its RegionBehavior/marker and ledgers, plus Hope Chest/Music Box/Prayer follow-on content.** Chat A will **not** reattempt, touch or stage the Silver Key and owns the independent Aqueduct/Forest Well work instead. Dormant Crooked Man haunts remain last and under owner manual roleplay direction. Although Git branches/worktrees are separate, the live Foundry world is SHARED; check actual document state before every write, coordinate module reloads and avoid overlapping world edits. This division refines the original handoff's overly broad Chat A integrator role for the specifically named Silver Key objects. [Cross-workstream boundary](./cav-owner-haunts-last-checkpoint-driven-puzzle-decoupling-handoff-2026-10-26.md).
