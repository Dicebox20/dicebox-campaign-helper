# SG-01 Northwest Grove Corner — Render Inspection

**Date:** 2026-10-23
**Source PREPARE gate:** [SG-01 recheck](./sg-01-northwest-corner-pre-render-recheck-2026-10-23.md) = PREPARE_RECHECK_PASS.
**Generation:** `ff28c7d8-dd0d-4b1e-a70d-7877f5c88a8f`.
**Image:** `top_down_detailed_fantasy_map_style_scene_of_a_rui.png` (conversation artifact; not approved or committed binary).
**Verdict:** **RENDERED_INSPECT_REDO**, not an owner-approved image.

## Comparison against required source plan
| Test | PREPARE requirement | Actual observed | Result |
|---|---|---|---|
| E border | connection east → SG-02 | east path present | PASS |
| S border | connection south → SG-04 | south path present | PASS |
| N border | uninterrupted garden/forest | north road exit | **FAIL** |
| W border | uninterrupted garden/forest | west road exit | **FAIL** |
| Shape | a single east-to-south 90° corner, exactly 2 border exits | four-way circular crossroads | **FAIL** |
| NW bust | human stone bust on pedestal beside bend, third puzzle step | upright cluster of menhirs/standing stones, no bust | **FAIL** |
| Old autumn garden, low walls, neutral light | believable moderate-detail outdoor terrain | recognizable aged garden atmosphere | PASS |

The generated image is unsuitable for SG-01; it cannot be fixed by simply interpreting extra paths as inaccessible, because pathways reach the actual image edges and the mandatory puzzle fixture is absent. **Do not promote this art to PASS, approve it, or add it to the playable archive.**

## Process evidence
The mandatory live PREPARE recheck was actually completed before generation and matched the latest scene register. Nonetheless, the resulting renderer composition drifted to a generic four-arm roundabout with central stones. A source check alone does not guarantee generator adherence. For next owner-requested REDO, return to original geometry and draft a completely new inclusion-only visual description focused on an **east-side arrival turning downward to the south**, a **clearly carved bust** beside that bend, and physically recognizable environmental boundary containment. **One generation only**, inspect, then stop.

No Foundry Scene/Wall/Region or lighting changes. No new owner approval.
