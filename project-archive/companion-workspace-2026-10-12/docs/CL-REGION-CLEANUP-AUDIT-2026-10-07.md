# Central Lodge — Region Clutter and Reversible Cleanup Audit (2026-10-07)

**Result: NO REGION DELETIONS PERFORMED.** No source-verified abandoned Region identified. This is deliberately conservative: RegionBehavior count 0 does not establish unneeded; planned lighting, travel, puzzle, and runtime anchors are normal empty Regions before integration.

## Snapshot and restore evidence

- Snapshot: `work/foundry-playwright-harness/receipts/region-cleanup-2026-10-07/all-21-scenes-all-202-regions-full-backup-v001.json`
- Integrity manifest: `work/foundry-playwright-harness/receipts/region-cleanup-2026-10-07/manifest-v001.json`
- Full file SHA-256: `761b64d5aaf67c8893ca6526e9997a18830bbb7c8c469e83eaf2ba6245549fa6`
- Size: 843,225 bytes; 21 Scenes; full `toObject()` Region data including shapes, flags, ownership, elevation, visual settings, embedded behaviors and original IDs for **202** Regions / **115** behaviors.
- `verify-region-backup-v001.cjs` independently reloaded backup, verified hash, Region/Behavior counts, uniqueness and byte length; **BACKUP_VERIFIED**.
- Restore contract if actual removal is subsequently authorized: use snapshot for the **exact deleted Scene/Region IDs only**, recreation with original `_id` and embedded behaviors (using Foundry controlled `createEmbeddedDocuments("Region", regionData, {keepId:true})`), then compare per-Region original data/hashes and whole-Scene counts. Backup existence is certified; **no restore transaction has been tested live** because no Regions were deleted. Do not call this restore contract a tested rollback yet. Preserve the backup immutable.

## Live preflight

- Foundry 14.367 / dnd5e 5.3.3; world `the-lost-mine-of-phandalin`.
- 21 Scenes, 202 Regions, 115 enabled RegionBehaviors, 115 unique behavior stable IDs, 33 canonical Items; ledger revision 0, kernel SHA unchanged; read-only safety smoke **PASS_WITH_KNOWN_BLOCKERS**.
- **95 zero-Behavior Regions**, classified by actual campaign metadata:

| Owner purpose | Number | Classification |
| --- | ---: | --- |
| Transition anchor | 42 | Reserved, many pending CL-50 |
| Additional scene-transition anchor | 4 | Reserved T1/T2 tunnel mouths |
| Lighting owner | 28 | Reserved CL-51 fixture/group control |
| System state | 11 | Reserved power, water, rail, ritual or ambient state |
| Puzzle mechanism | 3 | Reserved M1 clock / M3 bell / B1 water spindle |
| Item/pickup anchor | 3 | Reserved M2 separate object anchors |
| Horror/scare runtime anchor | 3 | Reserved tunnel/campaign scare beats |
| Sound/ambience runtime anchor | 1 | Reserved tunnel sound |
| **TOTAL** | **95** | **0 proven orphan/abandoned** |

- Read-only scans of all Lodge RegionBehavior sources, world Macro commands, and Scene flags found **7 zero-Behavior Regions with literal references**, including F1/F2 arrival anchors and N3 Branch Railway. Of the remaining 88, **absence of a literal reference is not proof of orphanage**, because they are canonically named future implementations or lighting groups. No Region had missing-purpose metadata.
- Visual display: Foundry V14 `CONST.REGION_VISIBILITY`, 201/202 Regions are **LAYER (0)** and visible only on the Regions edit layer; one B1 Waterwheel Region with an active behavior is `LAYER_UNLOCKED (4)`. The inspected Assistant GM canvas is on **Tokens** layer, not the Regions layer. Current Regions editor intentionally shows the reserved areas; switching the GM controls to **Token layer** removes Region editing overlay without deleting or disabling any Region.
- Keeping all empty Regions maintains future CL-50 travel, CL-51 lighting, CL-52 horror, and CL-91 puzzle work. Deleting 88 presently-unreferenced anchors would require an explicit *archive reserved/unused-now* instruction and a live-restoration drill, because they have known future roles.

## Next safe option

If user confirms they want **all presently inactive placeholders archived even though they are reserved for future features**, create a candidate exact-ID manifest excluding 7 active references, test restore in a disposable nonproduction Scene, then bounded guarded deletion with per-Scene hash guards, independent final verify and ready rollback. Do **not** silently interpret zero behaviors as abandoned. For the immediate visual clutter, use the Tokens layer rather than Regions layer. No gameplay change.
