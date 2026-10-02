# Ballad Ascendancy Region Bindings

Target world: **The Ballad of Chauser Bill** (`the-ballad-of-chauser-bill`).

This is target-bound installation data supplied by the active campaign GM.
DiceBox stable IDs remain canonical; the Foundry Region UUID is the runtime
binding. Regionwright must bind only the listed Regions, preserve all other
Region state and behaviors, and never create replacement Regions.

## Signal / Frequency Chamber

Scene: `Scene.spVI07qS6NwPAKkn` (display name: `Meltdown - Sigil`)

| Stable DiceBox ID | Foundry Region UUID |
| --- | --- |
| `dbx:region:signal-aleister-frequency` | `Scene.spVI07qS6NwPAKkn.Region.GJyUUBwlV0Knetw1` |
| `dbx:region:signal-sprocket-circuit` | `Scene.spVI07qS6NwPAKkn.Region.CrqjKpSGnr95sw3Q` |
| `dbx:region:signal-cooperative-left` | `Scene.spVI07qS6NwPAKkn.Region.coSluDpWkeak5np1` |
| `dbx:region:signal-cooperative-right` | `Scene.spVI07qS6NwPAKkn.Region.kjxyKFCd60ZWCr9I` |
| `dbx:region:signal-entry` | `Scene.spVI07qS6NwPAKkn.Region.31ALlkCZeThJG9it` |
| `dbx:region:signal-exit` | `Scene.spVI07qS6NwPAKkn.Region.fywKUn5bavEGJfCT` |

## Rune Mechanism Chamber

Scene: `Scene.Pu025lbCjgkxrUJj` (display name: `Meltdown - Rune`)

| Stable DiceBox ID | Foundry Region UUID |
| --- | --- |
| `dbx:region:rune-lawson-memory` | `Scene.Pu025lbCjgkxrUJj.Region.KVEF3yLlvPQF1Z0k` |
| `dbx:region:rune-tactal-slotting` | `Scene.Pu025lbCjgkxrUJj.Region.NKS9md0FksiX9id7` |
| `dbx:region:rune-order-left` | `Scene.Pu025lbCjgkxrUJj.Region.cHwRROISJFJuhI2S` |
| `dbx:region:rune-order-right` | `Scene.Pu025lbCjgkxrUJj.Region.djXZqAwG95vAMVIJ` |
| `dbx:region:rune-entry` | `Scene.Pu025lbCjgkxrUJj.Region.LZDX4PyFfUUTFgBv` |
| `dbx:region:rune-exit` | `Scene.Pu025lbCjgkxrUJj.Region.dLUj203sYWZKOqX7` |

## Central Core Control Chamber

Scene: `Scene.Vk6IMQh7jTxmKBtH` (display name: `Meltdown - Core`)

| Stable DiceBox ID | Foundry Region UUID |
| --- | --- |
| `dbx:region:core-aleister-station` | `Scene.Vk6IMQh7jTxmKBtH.Region.E1inBLaGExfbXJlH` |
| `dbx:region:core-sprocket-station` | `Scene.Vk6IMQh7jTxmKBtH.Region.L9RGK4PVWFxviFKI` |
| `dbx:region:core-dalton-station` | `Scene.Vk6IMQh7jTxmKBtH.Region.1hodVystymrGfXiE` |
| `dbx:region:core-andrew-station` | `Scene.Vk6IMQh7jTxmKBtH.Region.IQk4ZC1kkZuU7jZz` |
| `dbx:region:core-lawson-station` | `Scene.Vk6IMQh7jTxmKBtH.Region.DlEfXcy8BZrvEn92` |
| `dbx:region:core-tactal-station` | `Scene.Vk6IMQh7jTxmKBtH.Region.ERo6ClVR9WKCKw1q` |
| `dbx:region:core-security-room` | `Scene.Vk6IMQh7jTxmKBtH.Region.BkHBgMSkkhxJF69J` |
| `dbx:region:core-entry` | `Scene.Vk6IMQh7jTxmKBtH.Region.XhgdHv0pBzWriD2y` |
| `dbx:region:core-exit` | `Scene.Vk6IMQh7jTxmKBtH.Region.CQWuglCQvBfrQe6L` |

`dbx:region:core-entry-west` remains deliberately **unbound**. Its Region is
the west-side rail blast gate that corresponds to the Tram Depot, but its
Foundry UUID has not yet been supplied. Do not infer or substitute a Region.

## Regionwright requirements

- This is the official Ballad target, not `dbx-test-world`.
- Dalton remains the canonical puzzle identity; the Andrew controller is
  authorized for both Dalton and Andrew puzzle work this session.
- Every teleport Region must first display the exact player confirmation:
  **“Do you wish to proceed?”**. Cancelling must leave the token in place.
- The confirmation must precede every native teleport behavior; no entry or
  exit Region may teleport immediately.
- Preview exact UUID/stable-ID bindings and active-GM authority before a write,
  then reread each owned binding and report foreign-state preservation.
