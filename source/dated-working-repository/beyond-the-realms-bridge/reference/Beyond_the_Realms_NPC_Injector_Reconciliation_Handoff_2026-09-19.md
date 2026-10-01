# Beyond the Realms — Foundry VTT NPC Injector Reconciliation & Handoff
**Date:** 2026-09-19  
**Status:** Canonical project handoff for continuing NPC Injector work in a new chat  
**Target runtime:** Foundry VTT 14.367 Stable, D&D5e 5.3.3

## Purpose
This document reconciles the validated NPC-injector work from the current Beyond the Realms conversation with the existing Foundry VTT Technical Knowledge Base. It is an addendum, not a replacement for the knowledge base. Historical verification dates in the main knowledge base should remain intact.

The installed runtime is authoritative. The current project environment is:
- Foundry VTT 14.367 Stable
- D&D5e 5.3.3
- Midi-QOL 14.0.11
- DAE 14.0.12
- Sequencer 4.2.3
- Automated Animations 7.0.22
- Levels 7.0.3

The project remains native-first:
Foundry core → D&D5e native feature → public module integration → core Active Effect → native Activity → Activity Macro → Item Macro → Standalone Macro → full module.

The NPC injector remains a Standalone Script Macro because it is an explicit, user-invoked, self-contained world-building operation. If the injector grows into persistent settings, startup registration, reusable services, sockets, migrations, or ApplicationV2 UI, it should be promoted into a module.

---

# 1. Reconciled Technical Conclusions

## 1.1 Runtime and schema authority
Do not construct deep D&D5e schema from memory. The running system is authoritative.

Before generating version-sensitive Actor, Item, Activity, or Active Effect data, prefer:
- `CONFIG.Actor.dataModels`
- `CONFIG.Item.dataModels`
- `CONFIG.ActiveEffect.dataModels`
- `game.dnd5e`
- actual configured Documents already present in the installed system
- actual installed compendium content

Construct or clone configured Documents and validate them rather than inventing arbitrary property structures.

## 1.2 Native Activities own ordinary mechanics
Native D&D5e Activities are the primary surface for:
- attacks
- saving throws
- damage
- healing
- targeting
- ordinary consumption
- uses
- supported effect application
- utility actions
- summon / transform / enchant where supported

Do not hide ordinary attacks, saves, damage, healing, or consumption inside custom macros if a native Activity can represent the rule.

Every workflow must have one mechanical owner for:
- target selection
- attack roll
- hit qualification
- save
- damage
- healing
- condition/effect application
- resource consumption
- uses
- recharge
- chat result

Never double-apply damage, double-consume resources, or duplicate native and module effects.

## 1.3 Core Active Effects before DAE
Use core Active Effects first when the rule can be expressed through current registered fields and change types. Use DAE or Midi-QOL only for behavior that genuinely depends on lifecycle or workflow conditions unsupported by native D&D5e/core Foundry.

## 1.4 Public CRUD only
Use public APIs and configured Documents. Do not mutate `_source`, internal collections, module-private workflow objects, or database files.

Consequential writes should:
1. validate first
2. persist through public API
3. re-read
4. diagnose
5. preserve enough information to repair or roll back failures

---

# 2. BTR NPC Injector Engine 1.0 — Live-Validated Baseline

The simple NPC injector engine is now empirically validated in the user's exact Foundry environment.

## 2.1 Successful live tests
Three fresh Actor injections succeeded:
1. **Skriv Nettleshard**, Derro scavenger
2. **Kethra Glowcap**, Deep Gnome pathfinder
3. **Vaelith Duskspark**, hostile Drow arcanist

Observed successful behavior:
- Script macro saved
- embedded WebP decoded
- SHA-256 validation passed
- image uploaded to `images/beyond-the-realms/npcs`
- Actor created
- portrait assigned
- prototype token assigned
- D&D5e fields applied
- darkvision stored at `system.attributes.senses.ranges.darkvision`
- Actor folder assigned
- hostile disposition worked for Vaelith
- final diagnostics returned `PASS`

A rerun/idempotence test was planned as:
- Image: `REUSED`
- Actor: `UPDATED`
- Portrait: `OK`
- Token: `OK`
- Folder: `OK`
- Result: `PASS`

Even if rerun testing is performed later, the fresh-create path has already passed three times.

## 2.2 Frozen conservative JavaScript pattern
The successful macros use a deliberately conservative JavaScript subset:
- `var` declarations
- classic `function` declarations
- top-level `await`
- no unnecessary whole-macro async wrapper
- no optional chaining
- no nullish coalescing
- no arrow functions in the frozen production pattern
- no arbitrary custom flag scopes
- no guessed deep schema when a known runtime path exists

The image upload path that succeeded uses:
`foundry.helpers.media.ImageHelper.uploadBase64()`

The macro verifies embedded image integrity before creating/updating the Actor.

## 2.3 Embedded token image safeguards
Before mutation:
- Base64 must decode
- byte length must match
- bytes 0-3 must be `RIFF`
- bytes 8-11 must be `WEBP`
- SHA-256 must match expected digest

Image is installed before Actor mutation. Image failure must not create an Actor with a broken image reference.

## 2.4 Exact-name Actor behavior
Canonical behavior:
- zero exact-name matches → create
- one exact-name NPC → update
- exact-name non-NPC → abort
- multiple exact-name Actors → abort rather than guess
- never automatically delete an existing Actor

## 2.5 Diagnostics
Preferred final diagnostic columns:
- NPC
- Image
- Actor
- Portrait
- Token
- Darkvision
- Folder
- Disposition when relevant
- Items / Activities in Injector 2.0
- Result

Use clear `PASS`, `FAIL`, `OK`, `CHECK`, `CREATED`, `UPDATED`, `UPLOADED`, `REUSED`.

---

# 3. Failures and Lessons That Are Now Canonical

## 3.1 Macro parser failure
A previous macro failed on save with:
`must be valid JavaScript for an asynchronous scope: Unexpected token '=='`

The conservative syntax engine eliminated this issue and has since passed multiple live runs.

Do not casually refactor the frozen syntax style back into modern compact JavaScript unless specifically testing that change.

## 3.2 JSON import detour rejected
A JSON macro import attempt failed with:
`DataModelValidationError ... Unexpected token ':'`

The user explicitly rejected JSON as the primary workflow.

Canonical deliverable remains:
**one copy/paste Foundry Script macro**

## 3.3 Invalid custom flag scope
A previous macro used a custom flag scope like:
`beyondTheRealms`

Foundry rejected it because the flag scope was not registered/active.

Rule:
**Do not use arbitrary custom flag scopes in standalone injector content.**

## 3.4 Old image-path failure
Older deep-gnome injectors created Actors with image paths that returned 404s.

Canonical correction:
- embed token image in macro
- upload it first
- verify uploaded bytes/hash
- only then create or update Actor

## 3.5 D&D5e 5.3 senses migration
Legacy access to `senses.darkvision` emitted:
`senses.darkvision has moved to "senses.ranges.darkvision"`

Canonical path:
`system.attributes.senses.ranges.darkvision`

## 3.6 Image-generation prompt contamination
An art generation was contaminated by Actor/macro context and produced a presentation sheet containing statblock/code/UI.

Canonical rule:
**Art generation and macro creation are separate sequential phases.**

Image prompt must contain visual instructions only:
- no Foundry
- no Actor schema
- no JavaScript
- no diagnostics
- no stat block
- no UI
- no labels/text

---

# 4. Locked Token-Art Workflow

## Phase 1 — Concept
Define:
- species/race
- role
- disposition
- gear
- size
- personality/theme
- campaign canon fit

For current Underdark campaign canon:
- Drow are hostile
- do not create friendly Drow guides unless canon is intentionally revised

## Phase 2 — Art only
Default token standard:
- true overhead/top-down tactical token
- full body
- facing south/downward by default
- square canvas
- transparent background
- readable silhouette at battlemap scale
- no scenic floor/background
- no baked border
- minimal/no cast shadow
- no text/UI/code

Preferred working sizes:
- Tiny: 256
- Small/Medium: 512
- Large/Huge: 1024
- Gargantuan: 2048

WebP is preferred for the final embedded asset.

## Phase 3 — Asset preparation
For the approved art:
- preserve transparency
- convert to WebP
- record dimensions
- record exact byte count
- compute SHA-256
- use a content-addressed filename where practical

## Phase 4 — Macro
Insert the image payload and NPC data into the frozen injector engine.

Validate the exact final macro before delivery:
- parse as an async function body
- Base64 decodes
- byte length matches
- RIFF/WEBP signature matches
- SHA-256 matches
- no ellipses/truncation
- deliver one complete Script macro code block

---

# 5. AI-Assisted Actor Creation — Community Research Reconciliation

Research into current AI actor/importer workflows produced a consistent pattern:

## 5.1 AI should design, not invent Foundry internals
LLMs are useful for:
- concept
- tactics
- intended CR
- spell/feature selection
- inventory selection
- custom mechanic specification
- descriptive text

LLMs should not be trusted to freely invent arbitrary deep Foundry JSON.

Use a constrained intermediate **NPC Manifest** instead.

Example conceptual manifest:
```js
{
  name: "Example NPC",
  cr: 5,
  role: "controller",
  inventory: [
    { source: "compendium", type: "weapon", name: "Dagger" }
  ],
  spells: ["Web", "Misty Step"],
  customFeatures: [
    {
      name: "Shadow Jaunt",
      mechanic: "teleport",
      activation: "bonus",
      distance: 30
    }
  ]
}
```

The injector/compiler turns that rule-level manifest into real Foundry Documents.

## 5.2 Clone known-good Documents
For existing D&D5e content:
- locate exact installed compendium Item
- retrieve the actual Document
- call `toObject()`
- strip embedded identity only where required
- embed the clone on the target Actor

This preserves:
- Item image
- Activities
- effects
- formulas
- system fields
- metadata appropriate to the installed system

This is more reliable than recreating spells, weapons, armor, consumables, or existing features from scratch.

## 5.3 Rules-edition separation
D&D5e 5.3.3 contains content for more than one rules edition / compatibility family.

Never silently mix legacy/2014-style and 2024 content.

The injector should:
- declare the chosen rules edition/content family
- restrict compendium resolution accordingly
- fail clearly if required content cannot be resolved from the selected family

The first Injector 2.0 alpha intentionally targeted the legacy/SRD 5.1 family:
- `dnd5e.monsters`
- `dnd5e.items`
- `dnd5e.spells`

Future work must still inspect the installed packs at runtime rather than assume these IDs forever.

## 5.4 Custom mechanic factory
Only genuinely custom content should be constructed.

Maintain a small allowlisted mechanic vocabulary and tested factories, e.g.:
- passive feature
- melee attack
- ranged attack
- save + damage
- heal
- teleport
- apply condition
- grant temporary HP
- forced/self movement
- limited uses
- recharge
- simple consumable

If a requested mechanic is outside the supported vocabulary:
- create a descriptive manual feature, or
- stop and add a tested factory
- do not silently invent unsupported schema

## 5.5 Mechanical ownership
For every custom feature, identify one owner for:
- targeting
- attack/save
- damage/healing
- effect
- consumption
- uses/recharge
- cleanup

Prefer native Activity ownership whenever possible.

---

# 6. Item and Feature Image Policy

## 6.1 Existing D&D5e Items
When cloning an existing compendium Item:
**preserve its existing `img` value.**

No additional image generation is necessary.

This applies to:
- spells
- weapons
- armor/equipment
- consumables
- tools
- existing features
- loot where available

## 6.2 Custom Items
Custom spells/features/equipment should reuse a valid image reference from installed D&D5e content.

Do not invent image paths such as guessed `systems/dnd5e/icons/...` filenames.

Build the image choice from actual installed Items.

Recommended deterministic resolution order:
1. explicit analogue chosen in manifest
2. exact concept/theme match
3. mechanic match
4. damage/healing type
5. spell school / feature category
6. generic image from same Item type

Only the image path/reference is reused. Do not modify the source Item.

## 6.3 Actor image
The NPC token/portrait remains the only routine image physically embedded in the injection macro.

This keeps macro size manageable even when an NPC has many spells, actions, features, and inventory Items.

---

# 7. BTR NPC Injector Engine 2.0 — Intended Architecture

The complete game-ready pipeline should be:

```text
NPC concept
→ normalized NPC Manifest
→ token-art workflow
→ balance validation
→ runtime preflight
→ compendium resolution
→ image resolution
→ Actor core creation/update
→ clone existing Items
→ create supported custom Items
→ native Activities / effects
→ equipment and quantities
→ re-read Actor
→ mechanical diagnostics
→ PASS or precise failure
```

## 7.1 Runtime preflight
Before world mutation verify:
- GM context
- Foundry/system expected environment
- Actor/Item types needed
- required public APIs
- required compendium packs
- required compendium entries
- image helper
- selected rules edition/content family
- no duplicate exact-name Actor ambiguity

## 7.2 Pre-resolve before writing
All required compendium content should be resolved before creating/mutating the Actor.

If a required spell, weapon, armor item, consumable, template feature, or base chassis is missing:
**abort before Actor mutation.**

Optional content may be allowed to degrade only if the manifest explicitly marks it optional.

## 7.3 Actor core
Create/update:
- abilities
- HP
- AC
- movement
- senses
- CR
- alignment/type/subtype
- languages
- spellcasting ability
- biography
- prototype token
- portrait
- disposition

Prefer cloning a known-good NPC chassis when it materially reduces schema invention, then overwrite only the fields required for the target creature.

## 7.4 Embedded Items
Categories:
- compendium weapons
- compendium equipment
- compendium consumables
- compendium spells
- existing compendium features
- custom features
- loot

Use Actor embedded-document APIs rather than building disconnected world Items.

## 7.5 Idempotence
The macro must be safely rerunnable.

For managed Items:
- resolve intended set
- identify only the Items owned/managed by this injector
- update/replace those deterministically
- preserve unrelated Items/Effects where practical

Important future improvement:
Do not manage Items solely by common display name if that could delete unrelated content. A safer marker strategy is still needed that does not rely on an invalid custom flag namespace. Candidate approaches:
- stable source IDs derived from compendium provenance where available
- registered/core-supported identifiers
- deterministic identifiers in supported Item fields
- a namespaced module flag only if Injector 2.0 is eventually promoted into a real module

Until this is solved, custom Item replacement must remain conservative.

## 7.6 Transaction/failure behavior
Ideal production rule:
**deterministic success in the validated environment, or a clean abort before leaving broken state.**

Because Foundry write sequences are not automatically atomic:
- pre-resolve and validate as much as possible before writes
- record created Document IDs
- on failure, remove only Documents created by the current run when safe
- never automatically delete pre-existing user Documents
- always report partial state precisely

---

# 8. Balancing Policy

The Foundry technical KB is an implementation guide, not a complete numerical CR-balancing guide.

Balance should be a separate design stage.

For a combat NPC, assess:
- target CR / encounter role
- AC
- effective HP
- resistances/immunities
- saves
- attack bonus
- save DC
- expected three-round DPR
- nova damage
- multi-target damage
- mobility
- control
- action economy
- reactions
- recharge abilities
- spellcasting
- healing/temporary HP
- defensive spell impact

Do not set CR only from the base weapon attack while ignoring spells/features.

The final Actor's actual usable actions should be the basis for balance review.

---

# 9. Current Alpha — Tharvek Rune-Eye

## Status
**Needs runtime testing. Do not call this validated yet.**

Concept:
**Tharvek Rune-Eye**, hostile Duergar Rift Adept, armored arcane skirmisher.

Generated token:
- ash-gray duergar
- white beard with metal rings
- dark scale armor
- runed war pick
- shield
- violet crystal focus
- purple rift energy
- clean isolated overhead token

Intended CR:
- CR 6

Injector 2.0 Alpha 1 design:
- clone SRD/legacy Mage Actor as a schema/chassis source
- clear inherited Items/effects when creating the new Actor
- set Tharvek's Actor core
- clone from compendiums:
  - War Pick
  - Scale Mail
  - Shield equipment
  - Potion of Healing
  - Mage Hand
  - Ray of Frost
  - Magic Missile
  - Shield spell
  - Misty Step
  - Web
  - Shatter
  - Counterspell
  - Lightning Bolt
  - Dimension Door
- add custom features:
  - Runic Bulwark
  - Rift Pursuit
- custom feature icons are borrowed from resolved D&D5e spell/item art
- verify required weapon/spell/consumable Items have native Activities
- final diagnostic expects 16 managed Items

The exact Alpha 1 macro was produced in the prior chat but had not been run when this handoff was written.

### Important concern for the next chat
The Alpha used display-name based cleanup for managed Items. This is acceptable for an experiment but is not yet the final production solution because it could remove a pre-existing Item with the same name on an updated Actor.

The next engineering task should improve managed-Item identity before finalizing Injector 2.0.

---

# 10. Recommended Next-Chat Sequence

1. Read this handoff and the main Foundry technical knowledge base.
2. Treat Engine 1.0 as validated and frozen.
3. Treat Tharvek / Injector 2.0 Alpha 1 as **Needs runtime testing**.
4. If the user still has the Tharvek macro, run it in Foundry and capture:
   - save result
   - preflight table
   - errors/warnings
   - final diagnostic
   - Actor sheet screenshots if anything looks wrong
5. If the macro is not available, regenerate it from this architecture rather than trying to reconstruct truncated Base64 from old logs.
6. Inspect the finished Actor manually:
   - spells present
   - weapon Activities usable
   - armor/shield inventory present
   - potion quantity
   - custom features visible
   - spell slots/preparation sensible
   - token/portrait correct
7. Test at least:
   - War Pick attack
   - one attack/damage spell
   - one saving-throw spell
   - Shield
   - Misty Step
   - Web
   - consumable use
8. Record exact failures before changing architecture.
9. Fix only the failing layer.
10. Once Alpha succeeds, improve managed-Item identity and rollback behavior.
11. Run a second, mechanically different full Actor test.
12. Only then lock **BTR NPC Injector Engine 2.0**.

---

# 11. Copy/Paste New-Chat Handoff

Use the text below to begin the next conversation:

> We are continuing the Beyond the Realms Foundry VTT NPC Injector project. Please locate and use the project Library files `Beyond_the_Realms_FoundryVTT_Technical_Knowledge_Base_2026-08-26.md` and `Beyond_the_Realms_NPC_Injector_Reconciliation_Handoff_2026-09-19.md` before doing any implementation work.
>
> Target environment is Foundry VTT 14.367 Stable with D&D5e 5.3.3. The simple BTR NPC Injector Engine 1.0 is live-validated through three successful Actor injections: Skriv Nettleshard, Kethra Glowcap, and Vaelith Duskspark. Preserve its conservative macro syntax, embedded WebP verification, `ImageHelper.uploadBase64()`, exact-name create/update logic, `system.attributes.senses.ranges.darkvision`, and PASS/FAIL diagnostics.
>
> We are now developing Injector 2.0 for fully game-ready Actors. The architecture is AI manifest → runtime/compendium resolution → clone known-good D&D5e Items with `toObject()` → create only genuinely custom features through tested factories → native Activities own ordinary mechanics → system Item images are preserved/reused → final mechanical diagnostics. Do not freely invent deep Foundry JSON.
>
> The current Alpha is Tharvek Rune-Eye, a hostile CR 6 Duergar Rift Adept. An Alpha 1 macro was generated but had not yet been runtime-tested at handoff. It uses legacy/SRD-style system packs, a Mage chassis, compendium War Pick/Scale Mail/Shield/Potion of Healing, ten spells, and custom Runic Bulwark/Rift Pursuit features. Treat it as `Needs runtime testing`, not validated. The biggest unresolved architecture issue is safe managed-Item identity for reruns, because display-name cleanup is not production-safe.
>
> Continue from the reconciliation document, do not redesign Engine 1.0, and fix only evidence-backed failures observed during Injector 2.0 testing.

---

# 12. Canonical Status Summary

**Locked and validated**
- Foundry 14.367 / D&D5e 5.3.3 target
- sequential art → asset → macro workflow
- conservative Script macro syntax
- embedded token WebP with SHA verification
- upload-first / Actor-second ordering
- exact-name Actor create/update
- no automatic Actor deletion
- D&D5e 5.3 darkvision path
- final diagnostic table
- system/compendium Items retain their own images
- custom Item art should reuse valid installed D&D5e Item images
- native Activities own ordinary mechanics
- AI should specify rules, not invent arbitrary deep schema

**Research-supported, implementation in progress**
- constrained NPC Manifest
- compendium resolver
- rules-edition-specific pack selection
- Actor chassis cloning
- custom Item factories
- system image resolver
- mechanical Activity validation
- transaction/rollback record

**Not yet validated**
- Tharvek / Injector 2.0 Alpha 1 runtime behavior
- robust managed-Item identity for idempotent reruns
- complete rollback after mid-write failure
- fully automatic balance validation
- broad custom mechanic factory coverage

End of handoff.
