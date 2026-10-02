# Universal Battlemap Importer — Candidate Import Checklist

These files are **candidate** imports for the Universal Battlemap Importer.
They may create a new Foundry Scene with a flattened background, native Walls,
and native door portals. They do not create DiceBox Regions, RegionBehaviors,
puzzle state, or UUID bindings.

1. In the Foundry Scene sidebar, choose **Universal Battlemap Import** and
   select the room's `.uvtt` file.
2. Before saving or installing any follow-up module content, visually check the
   imported Scene is 1536×1024 and that the native Walls and doors match the
   imported background. Do not scale the background to force a fit.
3. Open the paired `REGION-PLACEMENT.md`. For every row, create one rectangular
   Foundry Region, set its Foundry Region name exactly as shown, and enter the
   listed x, y, width, and height in Scene pixels.
4. Record the resulting Foundry Region UUID beside the stable DiceBox ID in the
   paired `.dicebox-regions.json` sidecar. The stable DiceBox ID remains the
   canonical identity; the UUID is only its runtime binding for Regionwright.
5. Reread the Scene and its Walls/doors/Regions before giving the bindings to
   Regionwright. Preserve any foreign documents and do not create player-facing
   Macros as part of import.

The current Signal and Rune files are manual-review candidates only. The Core
file is intentionally not exported until its renderer is measured against the
locked west rail entry and six station rectangles. Import success is not
Ready-to-Play certification.
