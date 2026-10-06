# DiceBox Exploration Discovery Standard — 2026-10-05

**Status:** user-accepted hardened workflow rule
**Scope:** hidden exploration discoveries, Discovery Regions, notice rolls, hinting, follow-up checks, and item recovery.

## 1. Discovery density

Ordinary maps use discoveries sparingly.

- Default: 0–1 discovery per map.
- Hard cap: 2 discoveries per ordinary map.
- More than 2 requires an explicitly approved discovery-dense special scene.
- Several maps in a sequence should contain no discoveries.
- The previous pattern of roughly 60 discoveries across about 15 maps is rejected as too dense.

## 2. Visible-anchor rule

A Discovery Region must make sense relative to the approved map art.

- The clue should correspond to a visible or environmentally plausible feature.
- Placement is forgiving; it does not need pixel-perfect alignment.
- The Region and clue only need to be close enough that the fiction makes sense.
- Do not use broad invisible sweep Regions merely to guarantee triggering.
- If no plausible visual anchor exists, move the discovery, revise the art, or remove the discovery.

Examples: unusual stone for a fossil, a distinct plant patch for herbs, roots/disturbed ground for a buried cache, or a visible worked edge for a relic.

## 3. Three-stage discovery model

Discovery uses three separate stages:

NOTICE -> INTERPRET / SEARCH -> RECOVER

A successful Stage 1 or Stage 2 check never automatically awards the item.

### Stage 1 — Notice

Entering the Discovery Region triggers exactly one automatic Notice roll for that character until the discovery is explicitly reset.

- Roll exactly 1d20.
- Add no Perception modifier, Wisdom modifier, proficiency, expertise, passive Perception, item bonus, or other character-sheet modifier.
- Do not call the actor's normal Perception skill roll for this stage.
- Failure is silent.
- Re-entering the Region does not reroll the same automatic Notice check.
- Success records the character as having noticed the anomaly and sends the environmental hint privately to that character and the GM where practical.

Base Notice DC by rarity:

| Rarity | Base DC | Success |
| --- | ---: | ---: |
| Common | 6 | 75% |
| Uncommon | 8 | 65% |
| Rare | 12 | 45% |
| Very Rare | 14 | 35% |
| Legendary | 16 | 25% |

Optional value adjustment within rarity:

- lower-value example: -1 DC;
- typical: +0;
- especially valuable/desirable: +1;
- exceptional for its rarity: +2.

Final Notice DC = rarity base DC + value adjustment.

Natural 1 and natural 20 have no special effect on the Notice stage.

### Stage 2 — Interpret / Search

A successful Notice roll reveals an environmental hint plus a clear suggested follow-up skill.

Hint rules:

- describe the anomaly, not the hidden item's identity;
- refer to something visible or environmentally plausible on the map;
- point toward the intended skill;
- when clarity helps, include a separate UI line such as Suggested check: Nature;
- Perception is not reused as the Stage 2 check.

Default skill families:

- Investigation — concealed objects, buried caches, hidden equipment, suspicious construction, documents, dropped valuables;
- Nature — fossils, minerals, unusual plants/specimens, natural anomalies;
- Survival — medicinal herbs, foraging, tracks, useful wilderness materials;
- Arcana — magical residue or enchanted objects;
- History — archaeological or historical relics;
- Religion — devotional, sacred, or profane relics;
- Medicine — anatomical remains or medically relevant material.

Example fossil Notice hint:

The rocks here are discolored and shaped differently, almost like one of them doesn't belong.

Suggested follow-up: Nature.

### Stage 3 — Recover

After the object is successfully identified/located, physical acquisition is handled separately.

Rules:

- recovery checks model the physical task, not item rarity;
- recovery may use one check or several checks;
- Stage 3 should not reuse Perception merely because Perception handled Stage 1;
- failure should produce a context-appropriate consequence such as delay, damage risk, reduced quality, tool requirement, or inability to free the item;
- the item enters inventory only when the recovery profile says acquisition is complete.

Locked example:

- fossil embedded in rock: Nature identifies it; Sleight of Hand + Strength recover it carefully.

The wider recovery-profile roster remains open for later design.

## 4. State and anti-farming

- Each character has independent Notice state for each discovery.
- The automatic Notice roll happens once per character per discovery until explicitly reset.
- Repeated Region crossings do not create repeated rolls or hint spam.
- A successful Notice persists for that character so the same clue is not repeatedly announced.
- Failure remains silent so the Region is not exposed by system messaging.

## 5. Authoring order

Discovery content is authored after the map renderer is accepted.

Recommended order:

1. approve renderer;
2. choose a plausible visible anchor;
3. assign item type, rarity, and value tier;
4. calculate Notice DC;
5. author immersive hint;
6. assign Stage 2 skill;
7. assign recovery profile;
8. place a reasonably local Discovery Region;
9. INSPECT the visual-anchor relationship;
10. BUILD the Region and state logic.

## 6. BUILD metadata

Every new BUILD uses discovery contract version dicebox-discovery/v1 and records:

- discovery count;
- density mode;
- visible-anchor compliance;
- per-character Notice state;
- one-roll anti-farming behavior.

Ordinary scenes with more than 2 discoveries fail closed unless the BUILD records an explicit user-approved special-scene exception.

## 7. Open design area

The catalog of Stage 3 recovery profiles is intentionally not fully hardened yet. Add profiles only as they are reviewed and accepted; do not invent a large automatic roster.
