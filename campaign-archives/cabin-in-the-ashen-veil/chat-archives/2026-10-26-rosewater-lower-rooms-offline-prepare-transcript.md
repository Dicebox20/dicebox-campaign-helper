# Cabin in the Ashen Veil — Full Offline World Inventory and Rosewater PREPARE Transcript Reconstruction
Date: 2026-10-26 Pacific. Fidelity: exact current owner message and grounded action summary, NOT a full native/lossless ChatGPT transcript.

## Owner
> Continue

## Carried-forward owner rules
Follow established DCH/Regionwright workflow and puzzle prerequisites. Work in <=25-minute bounded batches. Crooked Man NPC/token and first-chase gameplay deferred. No unapproved map art, native geometry, or custom puzzle UI; Regionwright owns movable puzzle elements.

## Action chronology (summaries grounded in execution receipts)
1. Checked Bridge remote PowerShell, Foundry 30000/CDP 9224 and current Regionwright commit 4942bf7. Both ports down, Foundry absent; available RAM ~2.83 GB. No additional restart loop.
2. Examined latest Foundry debug log: successful world launch, authenticated Gamemaster 1 and world data delivery around 05:38 before services disappeared; Windows event scan found no definitive crash. Previous Bridge PowerShell timeout occurred close to process disappearance; process job-coupling is a hypothesis only.
3. Confirmed Foundry installed classic-level module. With native world offline, copied world Scene and Item LevelDB folders into isolated Chrome Dev harness artifacts and opened only copies. First scan included nested LevelDB subkeys, so corrected query to root-only !scenes!ID and !items!ID to avoid inflated totals. Correct full inventory: 47 Scene roots, 73 Item roots. Saved local JSON receipts, no original database modifications.
4. Verified only Bathhouse full and Bathhouse drained Scenes exist, BATH-03 Boiler and BATH-04 Rosewater separate scenes absent. H-B03 Basement Supply Closet remains distinct. Bathhouse original background IDs, owner art hashes and native geometry provisional flags recorded.
5. Verified existing original Sune Scrying Bowl item ID 1n5LONw3nYIy61O9, its approved puzzle source flag and GM_LIBRARY_ONLY status; separate Dust of Dryness item ID VjdQNwil7pPKzkHU. No new or duplicate items created.
6. Searched local approved map filenames across Foundry Maps, Regionwright art-source/assets/outputs and Downloads. No matching approved BATH-03/BATH-04 interiors; only Bath surface and unrelated H-B03/other reliquary art found.
7. Hardened Regionwright Studio Rosewater source to require exact original Bowl template/provenance rather than attacker-supplied authenticity boolean. Added tests for original, wrong ID, wrong qty, duplicate reservation and forged boolean; removed newly proposed public raw Item-ID exposure to avoid unnecessary spoilers.
8. Deployed source JS to installed Regionwright Studio with exact SHA match, preserved prior copies, completed 39/39 full regression suite. Also directly tested exported guard against ACTUAL copied Foundry Item document, which returned verified while forged boolean failed.
9. Created detailed BATH-03/BATH-04 PREPARE document and machine-readable manifest with no invented native Scene IDs/art, existing Bath geometry constraints, future dry Boiler route and Scrying Bowl item provenance; appended chronological Regionwright log.
10. Committed and verified remote Regionwright SHA 64870b4581120e6a3271abd7f8694010efc7c5ad. Archived DCH handoff/metadata and available-message reconstruction.

## Next
Owner-approved static lower-room map artwork, Regionwright ring symbols, stable GM and safe measured geometry are prerequisites to actually installing BATH-03/04. Then wire GM ring solve receipt, drained hatch, permanent independent dry Boiler passage, inventory-safe Bowl plinth and Sluice lower-room occupancy. No native world/character writes this turn.