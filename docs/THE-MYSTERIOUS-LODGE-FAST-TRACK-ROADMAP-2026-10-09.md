# The Mysterious Lodge — Fast-track to live playtest

Status: accepted 2026-10-09. Owner: designated ChatGPT Foreman; direct Desktop Commander workflow. The House of the Damned is a different campaign.

1. **Connect:** Finish missing railway links, scene entrances/exits, N3 travel handler, and essential puzzle/item interactions across the existing 21-Scene campaign. Reuse existing Regions and logic, no new optional features.
2. **Safety preflight:** Back up the exact campaign world, verify authorized GM and player Token consent, route identity, collision/elevation/footprint, and durable no-retry transfer recovery. Confirm all major scenes can be entered and exited without trapping or losing characters.
3. **Supervised live playtest:** Play from arrival through the final chamber, verifying puzzle sequence, revisits, railway, and ending in actual Foundry multiplayer.
4. **Fix blockers and retest:** Repair only failures found during play, check impacted flows, and declare playable only after the group completes the campaign.

**Fast-track rule:** Avoid exhaustive synthetic tests, aesthetic polish, or speculative improvements. Concentrate gameplay validation in the live playtest. Keep mandatory backups, exact-target/GM/owner safety, one-shot transfer recovery, and readback protections. No blind retries, unrelated production mutation, or Ready-to-Play claim before acceptance.

**Accepted N3 repair, 2026-10-10:** The owner selected the two-stage cartography design. Preliminary overlay from Old Estate Survey (M2) and Cult Passage Diagram (C2) unlocks the concealed T3 railway branch only after the existing N3 departure-board and switch-wheel proofs. T3 retains the Recent Route Fragment; returning to N3 completes the existing three-item cartography overlay and reveals the full hidden-route information. Keep the original T3 fragment location, existing item-grant chains and GM-authoritative safety checks. Distinguish (1) source implementation, (2) verified behavior in disposable Foundry, and (3) later player acceptance. Do not silently infer a map layout or add bypasses.

**Evidence:** one concise receipt/checkpoint per 15-minute development turn. No additional prerequisites unless a specific safety gate fails. Reusable Regionwright modules and other extras remain deferred.

**New-chat continuation:** `docs/campaigns/mysterious-lodge/START-HERE.md` is the campaign's single recovery entry. Creative canon is owner-authoritative; recovered script details are not automatically approved lore. Validate and update `CURRENT-STATE.json` and `SESSION-HANDOFF.md` for campaign-specific resumption; do not infer campaign progress from the newest product-wide checkpoint.


**Owner-directed E1 permission fix, 2026-10-11:** The player playtest exposed that the shared Runtime Kernel Macro denied execution to Player 1. The owner directed that **all world Macros in the disposable `dbx-test-world` on port 30005** be executable by all player accounts. Grant only default `LIMITED` execution where current defaults are lower, preserve higher defaults, explicit per-user ownership, GM OWNER access, and all Macro code. This includes the existing Midi-QOL support Macros and DAE sample-effect Macro. Verify the complete world Macro collection after a fresh Foundry reload. Port 30000 and production remain out of scope. This permission change does not itself prove that each Macro's underlying action is player-safe or that the Lodge is playable.
