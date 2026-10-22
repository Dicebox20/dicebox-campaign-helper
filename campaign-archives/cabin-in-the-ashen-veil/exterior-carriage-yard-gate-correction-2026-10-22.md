# Cabin in the Ashen Veil — Carriage Yard northwest maze-gate correction

**2026-10-22.** Owner evaluated the late-fall exterior map as “perfect” except that the **wrought-iron gate to the forest maze** was missing. This establishes the **NW maze-gate visual anchor as essential** for Carriage Yard inspection. The gate connects to `SG-03 Iron Gate Thicket`; its initial inward-gated / later reversible state remains a Foundry Wall/door and Region concern.

## Corrected candidate

- **Retained baseline image**: `muddy_winter_estate_entrance_map.png` (SHA-256 `22fd7d82c5aae3d03f223fed5fbc02bab6fda11d85661e847080eb3b47dfa9dc`, 1448×1086 pixels).
- **Corrected local artwork**: `/mnt/data/cabin_exterior_wrought_iron_gate_precise.png` (SHA-256 `a2ba2845d43c7c9f1d0ea07495d1d65e633beb3ad656bc838a3832b760cf523c`, 1448×1086 pixels); currently a local artifact, **not** a binary GitHub commit or Foundry background installation.
- **Localized addition**: Wrought-iron gate and two stone piers on the original NW approach, approximately pixel rectangle x166..276, y92..156. Original background pixels were retained except the localized gate/shadow composite. This addresses the single owner-identified missing map feature while avoiding complete-scene layout drift.
- **Intermediate generation**: `0611ea6d-bd4b-4694-a77e-ee0d840e8f63` visibly included a gate but revised the wider map; its full-scene composition was **not** accepted as the preserved final. The correction was assembled using the isolated gate component rather than the altered whole image. **Provenance caveat:** exact pixel-level preservation/editing was a narrow manual composite; this is not evidence the generative renderer honored region-only edits.
- **Approval state**: **VISUAL CANDIDATE, OWNER REVIEW PENDING**, not `FINAL_INSPECT PASS`. Structural BP-2 portal and Foundry runtime projection have not been verified. Dynamic door, interactable carriage, water states, lighting and regions remain separate.

This record does not modify prior owner-approved house geometry, the nine-map Sune Grove plan, or Foundry.
