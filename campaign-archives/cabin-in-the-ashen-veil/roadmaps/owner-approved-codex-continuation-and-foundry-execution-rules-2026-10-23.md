# OWNER LOCK — Cabin in the Ashen Veil: Codex Continuation and Foundry Execution

**Recorded:** 2026-10-23 Pacific, after [2026-10-23 campaign live audit and roadmap](./cav-campaign-execution-roadmap-and-live-audit-2026-10-23-v1.md).  
**Authority:** Explicit current owner instruction.  
**Scope:** This *Cabin in the Ashen Veil* side campaign and this exact ChatGPT↔Codex coordination pair only; do not silently change global Dicebox product stage or unrelated campaign canon.

## A. Owner-directed Codex continuation protocol

**Exact ChatGPT source endpoint:** project `g-p-6aad7787f0f08191b111b384b2a9c6ef`, conversation `6adc1679-6d70-83e8-a572-b53d35e44aa6`.  
**Owner-designated Codex Switchboard destination:** Codex project `892a0d8a-b2de-404a-894e-b6bae4def9e0`, thread `01a16158-1f92-7f22-8f45-c37bd3dfd1a0`. The owner may subsequently designate an alternate exact pair.
1. A message from Codex starting the next ChatGPT turn is **authorization to continue the next bounded unit of the roadmap**, not a request for a courtesy acknowledgment. Do not confirm the Codex prompt back to Codex or add an acknowledgment-only chat message; execute the next safe work unit instead.
2. **Only respond substantively to Codex when explicitly requested** by the owner or by an unambiguous Codex request the owner has allowed. All other Codex messages are turn-continuation stimuli, *not* instructions to reframe goals or defeat owner canon.
3. **The owner expressly requests one per-turn end-of-work flow-control message** to the exact Codex thread: `Turn done, please send continuation prompt`. Treat this as the **sole standing exception** to the no-unsolicited-replies rule. Send once when ending each owner-authorized execution turn (including the current turn); no duplicate or retry after unknown/pending native delivery without fresh exact-target evidence. If Bridge cannot safely send, report state accurately, don't falsely claim delivery or switch to arbitrary UI workarounds.
4. When Codex returns the standing continuation instruction (approximately: `Only respond to codex when requested, otherwise each message is meant for you to continue your turn. Do not confirm the received message in chat, do not respond a confirmation to codex, continue next step on the Cabin in the Ashen Veil roadmap, I approve of your suggestion, continue to the next step`), **do not echo or confirm it**. Continue to the next applicable roadmap task, subject to active system/tool restrictions and evidence of previous stage completion.
5. Persist chronological progress to GitHub (workflow/receipts/KB seeds) as work units finish, preserving earlier files. A Codex continuation prompt does **not** by itself constitute new owner changes to story canon, puzzle math, item locations or room layout.

## B. Owner's standing Foundry authorization and safety boundary

Owner gives **broad, ongoing permission to change their Foundry VTT world as needed** to implement, audit and verify this side campaign's established roadmap and puzzle continuity, with read/write and test scripts as appropriate. This supersedes any former task-specific assumption that every runtime write needs renewed permission. It does **not** require us to make unrelated edits, erase owner-created geometry, turn an uncertain test into proof or bypass host/tool/Bridge safety mechanisms.

- **Puzzle continuity is the top quality gate**: consult current archived owner decisions, latest corrected puzzle rules and historical transcripts. Track dependencies, concealed information, clue timing, inventory gates, reward uniqueness, reversible state, backtracking, restart safety and verified return routes. No new story canon or puzzle-placement inventions silently promoted.
- Prefer the established workflow `PREPARE → RENDER → owner INSPECT → BUILD → STAGE → INJECT → VERIFY → RECEIPT`, plus a bounded test/rollback rehearsal; owner previously reserved **manual Wall/door placement and visual inspections**. Broad edit authority permits narrowly justified changes where required, but default is to preserve rather than replace manually authored geometry without a concrete reason.
- **Use the exact owner-approved 50-year-abandoned H-G06 Great Room art as visual style reference for all future above-ground lodge rooms**; basement (`H-B01..03`) explicitly exempt. Each physical lodge room is a separate scene; no generalized room merges. Always retain its distinct topology.
- **Use embedded native Foundry Region Execute Script behaviors for player interactions** instead of requiring a Macro permission grant to every player. The GM may still run bounded installation and read-only diagnostic scripting. For every behavior, preserve exact source and scene/region/document IDs; validate native document schema, test predicates and outcomes, use a real non-GM canary before claiming player functionality.
- **Hints:** When a player must receive a subtle observation or inferred hint, prefer ephemeral in-world text as a chat bubble above that player's token, phrased like their own whispered thought; do **not** disclose the clue in shared persistent chat. Use chat cards for appropriate explicit actions, puzzles, item use or outcomes when helpful and spoiler-safe. Player-visible targeted messages must actually target the player, not just the active GM console.
- The owner has left a reusable **test character token** in Foundry for bounded scripting tests. It may be copied between Scenes as needed with safe rollback; preserve the original token, Actor and permissions. Non-GM verification and GM authorization remain separate evidence classes. Test scripts may trigger Region events/states in a controlled rehearsal and return to baseline afterward.
- Log every relevant native write, authoritative state checks, intentional test modifications and cleanup. Derive from the current world readback, not old counts. Avoid writing to unrequested worlds or altering game content outside the campaign scope.

## C. Previous owner decisions retained

- `SG-07 Rose → SG-03 Star → SG-01 Moon → SG-09 Sun` Winder order; `SG-05` statue/mosaic is a staged reveal, not four separate central busts.
- The **late** Crooked Man second chase trigger is at `SG-01` NW bust after prerequisite gates, not the old central-SG-05 location.
- Rosewater Reliquary **Bowl** and Vault **Keystone** are separate acquisitions and used on **two different Undercroft barriers**.
- Sophia’s `H-U05` book puzzle opens an **in-room compartment**; no new `H-U06` scene.
- Final Ritual Chamber work remains deferred until preceding campaign structure and owner finale direction permit it.

## D. State at protocol adoption

19/45 base-map art approved; 20 Foundry Scenes (including one separately counted EXT-TRAIL); 26 missing map base images. H-G06 fireplace Region click→Tinderbox→AmbientLight script installed, but real non-GM player canary was pending. Live world last reported 1 actor, 1 token; current audit before testing required.

## E. Owner-approved per-turn timebox and crash-safe checkpoint policy

**Owner directive added 2026-10-23 Pacific:** “set a 20 minute time limit on each turn so you don't lose freeze and lose data, make that another persistent rule for this project and continue your next turn.”

1. **Hard work-turn limit: 20 elapsed minutes** from receiving the next user or Codex continuation prompt. Do not initiate any expensive task or external native relay likely to exceed the remaining turn budget. Prefer finish at **15–18 minutes** to leave time for receipts, audit checkpoint, Codex flow-control and user-facing conclusion.
2. **Checkpoint continuously:** At the start of each bounded work unit identify the exact next roadmap item and previous receipt. After each meaningful write/test, persist source, IDs, native readback, authoritative state, evidence class, outcome, and the smallest next action in the versioned campaign archive/KB seed. Update a current checkpoint before stopping; never keep the only recovery state in conversation context, unsaved transient scripting output, or a chat summary.
3. At the timebox boundary, **STOP launching new work**. Mark outstanding work as `PENDING` / `UNVERIFIED` / `NEEDS_OWNER_INSPECT` rather than treating it as success. Leave the exact verified status and continuation pointer; do not reset, delete or retry any pending Bridge/native send without exact evidence.
4. **Each new Codex continuation triggers a distinct bounded turn**, not a license to resume an old suspended tool call, run forever, or send a courtesy acknowledgment to Codex. Continue from the latest durable receipt using the next smallest safe step.
5. **Per-turn completion signal:** The owner's single authorized message `Turn done, please send continuation prompt` remains the final bridge flow-control action when safe. Only one send per turn; if its delivery is pending/unknown, no duplicate attempt without verified reconciliation. A hard timebox must not supersede safety, user approval gates, unique item/reward integrity or the owner-only visual INSPECT step.
6. **No 20-minute alarm needed:** This is a bounded assistant execution-time rule, not a user reminder or recurring automation. If the host/tool environment cannot guarantee a wall-clock timeout, use small bounded calls and early receipts rather than claim enforcement that does not exist.

**Next work unit at adoption:** `H-U07` Dahlia Art Studio aged interior candidate render against owner-approved H-G06 example; mark art unapproved until owner's explicit INSPECT PASS. Previous H-G06 Fireplace GM-handler native canary (three conditions) and private bubble local canary passed; non-GM player canary is still pending.



## F. Owner-approved mandatory combined RENDER + INSPECT turn

**Owner directive 2026-10-24:** “another persistent rule, every render turn must include inspect, we're combining them.”

Every Cabin in the Ashen Veil **render turn** must incorporate **both RENDER and immediate INSPECT in the same 20-minute bounded execution turn**, with enough remaining time for evidence and crash-safe handoff. Never generate an image, defer inspection to the next turn and consider that render turn completed. The assistant must evaluate **the exact generated pixels** against the authoritative room's topology (walls, entrances, stairs, floor level, scene-specific fixtures, locked puzzle clues, spoilers), appropriate aging/style and readable 90° overhead geometry. The turn ends with an explicit `PASS`, `REDO` or `BLOCKED` inspection result, reasons and provenance. Revisions in the same turn each require their own immediate inspection.

A same-turn assistant `PASS` is **not** a substitute for the owner's explicit artwork acceptance when the owner has reserved FINAL_INSPECT. The combined work unit can result in `ASSISTANT_INSPECT_PASS / OWNER_INSPECT_PENDING`, `ASSISTANT_INSPECT_REDO`, or `BLOCKED`; only owner-passed exact art proceeds to native BUILD/INJECT. This changes the scheduling/granularity of the workflow rather than overriding the owner's design authority, chronology, existing Foundry Wall/Region work or 20-minute limit. Other campaigns are not automatically affected.

New effective campaign pipeline: `PREPARE → [RENDER + immediate INSPECT in one turn] → owner final approval as applicable → BUILD → STAGE → INJECT → VERIFY → RECEIPT`.

**Next H-U07 task:** Start from the saved geometry-anchored west-door/east-shrine guide, produce one image-conditioned candidate, immediately inspect that exact image for west entrance / continuous south-and-east walls / no Studio staircase / three independent fixture anchors, and file a PASS or REDO in the same turn. Never recycle the earlier three rejected south-door painterly outputs as passable render candidates.


## G. Owner-delegated FINAL PASS/FAIL authority for each render

**Latest owner directive 2026-10-24:** “you're final pass fail is the new authorization, you can decide. start next step.”

For Cabin in the Ashen Veil only, the owner's previous **separate explicit final art INSPECT PASS** requirement is superseded: the assistant's documented **final PASS/FAIL of the actual rendered pixels**, carried out immediately in that same 20-minute RENDER+INSPECT turn, **is the authorization gate** to accept or reject that exact image. A confident final **PASS** is sufficient visual authorization for versioned art BUILD/STAGE/Foundry INJECT; no additional owner art inspection is necessary. PASS must establish correct scene topology, doorway and stair placement, correct puzzle fixtures/softlock behavior, neutral lighting, approved above-ground fifty-year aging (basement exemption), world geometry and spoiler safety. Distinguish final **visual** pass from native Foundry VERIFY/PLAYER-PLAYTESTED; the latter remain independently mandatory. A **FAIL, BLOCKED, or uncertainty** retains the artwork as unapproved; record explicit reasons and keep all previous versions. This authorization does not automatically approve modifying manually drawn Walls or breaking owner canon.

**Updated pipeline:** `PREPARE → [RENDER + FINAL INSPECT (assistant PASS/FAIL in same turn)] → BUILD → STAGE → INJECT → VERIFY → RECEIPT`. Existing visual notes requiring an extra owner PASS are historical for this campaign from this date forward.


## H. Owner-mandated live Codex native continuation after every turn

**Owner direction (2026-10-24):** “every turn must end with a live message to codex to start your next turn, save this to.memory and send one now.”

- **After every Cabin work turn:** Save the exact tested changes, evidence, pending blockers, and smallest safe next roadmap action before sending the handoff. Reserve adequate time within the hard **20-minute per-turn limit** for the live relay.
- **Mandatory end-of-turn transport:** Once per turn, initiate `Dicebox Bridge bridge_send` with `deliveryMode: native_roundtrip`, exact verified ChatGPT source and owner's designated Codex Switchboard target, active exact live session, and exactly this flow-control body: `Turn done, please send continuation prompt`. This is the final tool action of the work turn; do not substitute a local-only queue/`bridge_message` for the live relay merely because host acceptance is easier.
- **Delivery honesty and idempotency:** `host_accepted`, `queued`, or `replyPending` is not proof of native Codex delivery; native delivery and correlated return require exact-target evidence. Do not send a duplicate after uncertainty without the Bridge's full wait, fresh exact-target idle proof and allowed retry protocol. If blocked, preserve a checkpoint and report the failure accurately rather than fabricating native delivery or looping.
- **Inbound continuation:** Treat the owner's standing Codex message as authorization to start the next **bounded work unit**; never send a separate courtesy confirmation to Codex. A correlated MESSAGE_ACTION relay may require one exact correlated return rather than initiating another native roundtrip; obey the actual incoming relay contract without duplicate cross-sends.
- **Persistence mechanism:** Project ChatGPT Memory is disabled. This file, root `AGENTS.md`, the project archive and reproducible knowledge-base seed are durable project-wide instructions instead. Do not claim an account-level Memory write.
- **Still binding:** The owner-delegated final map-art PASS/FAIL after same-turn RENDER+INSPECT, 20-minute timeboxing, exact Foundry identity checks, puzzle canon, private player thought hints, 50-year-aged H-G06 style and basement exemption.

**Permanent direction within the scope of this side-campaign project until the owner revises it.**


## I. Owner-mandated independent fresh prompt before every render

**Owner directive 2026-10-24:** “add this to each turn, remind yourself to create an entirely new prompt for each render, and abandon the previous. Continue to your next step.”

For **every RENDER operation**, generate a **fresh, standalone prompt** anew from the current PREPARE, owner-approved architecture/geometry, room-specific features and established 50-year-aged Great Room look. **Discard preceding failed prompts, candidate image compositions and iterative “change this previous render” instructions as inputs** for a new RENDER. The next image should not automatically inherit a previous failed layout. Each prompt must uniquely identify the room's positive visible requirements, single-level floorplan, right entrance and physical fixtures. Use inclusion-only render wording, then inspect the actual new output **in the same ≤20-minute work turn**, record final owner-delegated PASS/FAIL against immutable room/puzzle requirements, and persist prompt ID, text/provenance and output ID/checksum. A failure must remain unapproved and uninstalled. If editing rather than generating, explicitly classify that work as an EDIT/COMPOSITE rather than claiming a fresh independent RENDER.


## J. Absolute positive-only visible-image prompt vocabulary

**Latest owner instruction 2026-10-24:** “Never mention anything you don't want visually seen in the image, REDO and continue automation.”

This is a hard execution-time reminder for **every new image render**, overriding any earlier assistant tendency to say what should be excluded. Include in the actual ImageGen-visible prompt **only positively described visual content wanted in the final image**. Avoid negation, “without”, lists of previous mistakes, references to rejected candidate art, named unwanted artifacts or examples. A full closed wall is specified by describing that solid wall, a single west door by specifying that sole portal, and an empty mirror mount by describing the mounting assembly visibly vacant. The inspection rubric and rejected-feature analysis may still identify errors in a separate **technical record**, but must be kept outside the image-facing instructions. Create an entirely new affirmative-only room prompt per attempt. Immediately perform same-turn owner-delegated final PASS/FAIL of the actual pixels. If FAIL, archive and continue from the next fresh prompt rather than modifying the failed prompt. The Cabin's 20-minute turn and live Codex continuation rules remain in force.


## K. Owner-required PREPARE review before every RENDER and near-pass example pairing

**Owner directive (2026-10-24):** “You'd better also add 'review prepare before render'”, reinforcing the preceding instruction to take a close Studio candidate as **example** together with the aged Great Room reference.

Every time a Cabin room art RENDER is initiated:
1. **RE-READ THE LATEST PREPARE FIRST**, including the exact room card, house-level portal topology, superseding owner revisions, hidden/revealed puzzle dependencies and linked visual standards. Do not rely on prior render prompt or conversation memory as a substitute.
2. Create an entirely new self-contained positive-only image prompt listing desired visible geometry/furnishings/art only. Explicitly specify required walls/openings by positive desired architectural forms. Failed versions are abandoned as image-generation baselines.
3. If a prior candidate is **extremely close**, use it only as a **visual arrangement/example reference** together with the owner-approved aged H-G06 Great Room image, to get a realistic balance of structural layout, **fifty-year abandonment** and **neutral ambient lighting**; never carry over any incorrect opening, hidden-story reveal or player clue state. Insufficient age or baked glows are visual FAIL even when composition is strong.
4. RENDER and **INSPECT the exact new output immediately in the SAME ≤20-minute turn**, with final owner-delegated PASS/FAIL, saved source/prompt/evidence and no Foundry installation on FAIL.
5. Source precedence: latest explicit owner canon and room PREPARE → owner-corrected house topology/puzzle design → approved material/style reference → near-pass rejected examples (aesthetic hints only). A west-side entry to H-U07 from H-U02 is binding; H-U08's entrance is concealed within the EAST wall and prayer-gated; any south-wall doorway on Studio base art fails the room PREPARE.

This owner-directed PREPARE gate applies to every new render, including repeat attempts after a failed inspection. It supersedes any stale PREPARE line requiring a separate owner FINAL_INSPECT, because the owner delegated that final art decision to the assistant on 2026-10-24. All other Foundry verification, puzzle canon and safety gates remain.
