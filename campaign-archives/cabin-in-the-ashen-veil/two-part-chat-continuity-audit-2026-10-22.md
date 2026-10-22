# Cabin in the Ashen Veil — Two-Part Chat Continuity and Map-Production Audit

**Date:** 2026-10-22  
**Scope:** Owner-designated Part 1 + Part 2 chronological evidence, campaign continuity, owner decisions, source conflicts, and map readiness before any new render.  
**Method:** Read-only analysis of source chats and linked canon/technical records. This audit file is documentary; it does not change campaign canon, build assets, Foundry/Regionwright state, ChatGPT Project Instructions or product release stage.  
**Verdict:** **CONTINUITY PRESERVED; ART PRODUCTION NOT YET CERTIFIED.** Continue with a controlled structural Foyer canary only after stated prerequisites.

## 1. Registered primary chat sources and integrity

1. **Part 1 — “Halloween Campaign Idea”**: [campaign-chat-transcript.md](./campaign-chat-transcript.md), Git blob `3cfc4b0837ec7cc3d7fb47144e15daa7f1a9994c`; 1,439,001-character 2026-10-20 reconstruction, 1,321 distinct text entries (624 user, 697 assistant) from overlapping browser snapshots. This is not a native verbatim conversation export; message-level timestamps, certain media payloads and assistant-only nontext blocks are missing.
2. **Part 2 — “This Is Halloween” / map planning**: [map-creation-conversation-transcript-2026-10-22.md](./map-creation-conversation-transcript-2026-10-22.md), Git blob `48b19d3b074820b73f0159a39d84d22aeb0bcc7c`; 22 reconstruction sections with available user messages quoted and assistant actions summarized. Prior complete assistant/tool exchanges and image bytes are not fully included.
3. **Registration:** [two-part source index](./campaign-transcript-part-index-2026-10-22.md). Part 2 explicitly references a subsequent separately named “Halloween Campaign Handoff” chat. The owner's **two source designation** is respected: this audit **does not claim** the extra conversation is included in the two transcript exports.

**Evidence limitation:** The entire available Part 1 text was parsed for owner and assistant entry chronology and searched against later decision/topic sources, but a full exact-message/platform-media comparison remains impossible without native export and image objects. Source text is evidence of proposals and changes, not an automatic canon promotion.

## 2. Proven chronological supersessions

| Early/historical statement | Later controlling decision | Authority / outcome |
|---|---|---|
| Fiend Machine created the horror scenario; very early exploratory concept | Owner favored saving Fiend Machine for another purpose; eventual active opponent is Maldrath Voss summoning original yugoloth Vharzagul | Do not restore Fiend Machine as current primary adversary |
| Short Halloween one-shot / fixed 29 maps / later nine-box consolidation | Expanded multi-session side campaign; old 29-map roster discarded; **one individual house room per Foundry scene** remains; 31 questline rooms + 5 approved new house story rooms = **36 planned logical locations** | Working planning count, not a quota or runtime Scene count |
| Undimensioned square/flowchart as house | 2026-10-22 owner approval of dimensional House Master BP-1 and machine-readable geometry, irregular wings, double-height Great Room, upper gallery, separated stacked hidden chambers | Blueprint design approved; technical door/Wall/stair/clearance validation still open |
| Old Chauntea art/lore or grave-free shrine | Dahlia and memorial use **Sune**; one memorial grave for lost unborn son | Later owner canon wins |
| Final Vault prize was Scrying Bowl | **Keystone** is Vault prize with same four requirements; independent Bowl is in owner-delegated **Rosewater Reliquary** under drained Bathhouse | The Bowl + Great Room 027 pellet open outer Undercroft, Keystone opens inner sealed door |
| Immediate ritual after shrine water activation | Explorable Undercroft approach; sealed ornate door; Donovan/Sophia remains behind door, with hall leading toward ritual | Voss' route behind old sealed door remains unresolved |
| Generic nightfall directly triggers Crimson Veil | Charging the recovered Gondian power source at Aqueduct triggers Veil; nightfall alone is insufficient | Preserve phase/story triggers |
| Last storybook in Gazebo/Boathouse or Sune shrine charging device | Sixth storybook appears on Sophia's **bed** with Crimson Veil; charging is Gondian/Aqueduct | Old locations/actions invalid |
| Decorative atmospheric light baked in maps / generic house-perspective imagery | 90° overhead painterly tactical art, **representative low wall caps**, neutral baked illumination; Foundry owns lights/Veil; portable objects/state overlays kept independent | Global permanent map-art standard plus campaign FAST exception |
| Correcting failed image through variation or negative-prompt examples | **Fresh independent positive-only image prompts**, inclusion-only nouns, materially distinct wording, rejected prompts/images held as historical evidence | Global rule; no asserted internal cache reset |

The owner's explicit dialogue in Part 1 already objects to mentioning absent map objects in prompts; Part 2 later makes this a permanent **project-wide** policy. Treat the later global policy as reinforcement, not discovery of a new unrelated concern.

## 3. Current continuity and topology retained

- **Setting and mysteries:** Forgotten Realms / Neverwinter Wood; separate older family tragedy and present-day Voss ritual. The five family-associated haunts are Donovan/Crooked Man, Sophia/Eyeless Girl, Dahlia/Shadow That Sees, the Null Child, and Allen/House That Loves. No automatic sixth haunt; ending the ritual does not inherently dismiss family haunts.
- **Estate geography:** owner-corrected exterior sketch governs relative positions: house north of central Carriage Yard; pond/sluice east; Sune memorial west; Bathhouse branch southwest **off western shrine road**. Exact measurable outdoor geometry and whether Memorial Clearing vs Sune's Grove denotes one or two scene footprints remain OPEN.
- **House:** Great Room as central player navigation/blueprint hub; BP-1 true master geometry, BP-2 Foundry transition graph and BP-3 *deliberately altered* player handout are separate deliverables. Art Studio available early; Study Brass Key locked; Candle Workshop concealed behind Studio and Spine Room behind Sophia, not exposed until puzzle state allows.
- **Water/stages:** one sluice-controlled pool/pond water state; Bathhouse drained phase reveals screwdriver and three-ring Rosewater floor mosaic. A dry service exit from Reliquary to Boiler prevents trapping. Healing requires sluice shut, pool filled, Waterworks restored, boiler solved and water heated; exact healing benefit remains OPEN.
- **Reward states:** Hour Hand, clock glass, two Rufus eyes, bowls, keys, books, overlays and removable loot cannot be irreversibly baked into art as permanently visible reward content. Required fixture visibility applies to correct phase/asset representation.
- **Puzzle/finale chain:** early four Sune bust order SW→NE→NW→SE -> Brass Study Key; 587 shack -> sluice/Weathered Basement Key; clock hands -> roof gear, Bath screwdriver -> nightstand gate handle -> Aqueduct; late NW bust chase -> Silver Tiny Key -> music-box prayer -> Candle Workshop Wick -> Gazebo eye #2 -> Rufus source -> Aqueduct charging/Veil; Veil books and Copper Tiny Key/lye/Boathouse prayer -> emblem halves; Vault yields Keystone; independent Bowl+pellet opens outer Undercroft.

For full item chronology and latest delegated decisions, defer to [decision catalogue](./campaign-decision-catalogue-2026-10-20.md), [Rosewater Bowl decision](./rosewater-reliquary-bowl-decision-2026-10-21.md), [Undercroft v3](./undercroft-keystone-bathhouse-bowl-healing-design-v3-2026-10-21.md), and [pre-map audit](./final-pre-map-audit-2026-10-21.md).

## 4. Important source and implementation caveats

1. Older [campaign-metadata.json](./campaign-metadata.json) and [campaign-handoff.md](./campaign-handoff.md) still preserve earlier **Bowl-in-Vault** progression. They are historical recovery snapshots and are superseded by explicit 2026-10-21 owner-directed Keystone substitution and Bowl selection; do not promote old data to current.
2. The house blueprint's proposal prose still includes an original “not owner approved” drafting label, explicitly superseded by the 2026-10-22 approval annotation and decision catalogue §23.
3. Owner-delegated Rosewater ring design is accepted under delegated decision authority; it is **not** a verbatim owner-specified floor puzzle. Exact ring solution angles/orientations have yet to be mechanically designed or tested.
4. The 57-node quest dependency graph was a **bounded abstract topological check**, not a Foundry gameplay simulation, complete anti-softlock proof, or Regionwright integration test.
5. Previous attempted image outputs were **rejected**. IDs preserved in Part 2: `1f333233-d7b7-4800-b531-0a5abcbd8a45`, `06c48817-d893-49ef-ace7-504279884d5f`, `9e95e773-b284-45bd-87d6-f4069f2ae494`, `24361f45-6e9b-485a-9a02-edd96534bfb0`, `a567ee69-65f8-432a-9486-6564297c24d8`, `140b701e-536e-4d30-8586-704c01934af0`. Neither the image bytes nor all original prompt texts are supplied in Part 2. No failed output is an approved positive reference.
6. **Positive image reference located in repository:** `artifacts/library-files/Artwork/Overgrown Forest Shrine Clearing.png` (Git blob `ffd99e890f44918a0cd607922739ea09d266a4ff`, size 4,223,038 bytes, inventory SHA-256 `067cb006c4e51a365f2291cd169ac5371ea39512c3671034e6ee57d3e0b6647e`). This resolves **repository location** of the original positive reference, **not** proof that its pixels have been downloaded/visually inspected for a new renderer input.
7. Historical Part 2 refers to global document, AGENTS.md and KB seed changes. Their Git records are documentary evidence of policy adoption, not proof of ChatGPT Project setting synchronization or universal desktop-app provider enforcement.
8. **No live Foundry Scene ID, inspector PASS, Regionwright behavior verification, build receipt, cache purge, or approved new production map** follows from these transcripts.

## 5. Remaining blockers, priority by stage

| Stage | Open gate | Decision |
|---|---|---|
| Before Foyer paint | Validate BP-1 Foyer 28×16-ft rectangle (x24..52, y0..16), north-up four door centers (38,0), (38,16), (24,8), (52,8), upstairs (43,8), separately locked basement transition (31,8), a readable grandfather clock and adequate route clearances using *deterministic* control image | **OPEN** |
| Before Foyer paint | Retrieve and visually inspect the **positive shrine reference** from the newly located repo artwork file; no rejected-image reference | **OPEN / SOURCE PATH LOCATED** |
| Before any batch art approval | Confirm clean-room positive prompt, narrow top-facing representative wall strips, neutral lighting, scene-only perspective, correct story/portal placement, no leaked secret architecture | **OPEN** |
| Before automatic BUILD | Confirm the campaign FAST structural-evidence substitution is accepted by real Map Lab/BUILD validator or adapt it without falsifying image IDs/receipts | **OPEN** |
| Before Bathhouse render | Reconcile physical stairs, service exit, three-ring angles/one valid solution, shared filled/drained pool polygon, pickup visibility, portal and multi-player stage transition safety (MAP-01–04 in prior audit) | **OPEN** |
| Before Undercroft render | Resolve Voss' access behind sealed ancient Keystone door; room splits, arrival and inner-face digging evidence; preserve no early hidden reveal | **OPEN** |
| Before relevant puzzle BUILD | Confirm player-discoverable early bust order, formal six-book publication order, Gazebo independent reward/puzzle, Regionwright integrations, late chase on either Sune stage, healing amount/frequency and world-state transitions | **OPEN** |
| Before map census freeze | Clarify Grove/Clearing geography and exterior portal geometry; 36 is a working logical-location count, not a rendering quota | **OPEN** |

## 6. Release decision and recovery boundary

- **Historical chronology:** Good enough to establish current design authority and detect major supersessions across the two owner-designated chats, subject to noted missing verbatim/media elements.
- **Campaign design baseline:** Retain owner-approved House Master V1 and latest lore/puzzle/FAST locks.
- **New map art:** **NOT STARTED in this new chat**. First recovery artifact should be a BP-1 deterministic Foyer structure/control image with an independently inspected accepted shrine style reference. Only one new Foyer paint candidate may proceed after the explicit preflight gates. Full-house/dollhouse/rejected art remains excluded.
- **Foundry:** NOT VERIFIED. No assumption that visible art constitutes functional geometry or completed injection.
- **No rewrite of historical conversations or canonical quest data** from this audit; unresolved design remains explicitly OPEN.
