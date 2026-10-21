# Cabin in the Ashen Veil — Chat Progression and Puzzle Audit
Date: 2026-10-19. Design review, NOT an implemented or runtime-verified Foundry receipt. Source: current chat decisions supersede older Library continuity and conflict-audit when explicit. No repo/KB sync performed in this review.

## Accepted milestones
- Multi-session campaign. Early game ends when Brass Key opens Study; Chimney Clock gear may already be obtained in early game.
- Mid-game: Study note 587 -> Donovan lockbox/sluice crank -> drain pond -> Weathered Key -> basement; Basement Workshop repair tool -> parents' broken nightstand drawer -> aqueduct gate handle; replacement gear from chimney clock + gate handle -> aqueduct/maze.
- Late-game target begins about 2/3 of puzzle progress; Crimson Veil about one-third through late game (roughly 77.8% total), triggered ONLY by charging Rufus power source in aqueduct. Final act after that.
- Four final vault requirements: basement access; charged Gondian power; Gond's emblem half from Spine Mosaic; Sune's emblem half from Art Studio prayer shrine (favored/agreed in conversation). Final vault gives Sune's bowl, paired with Great Room 027 water pellet at statue to open undercroft.

## Accepted early chain
1. Oars at Donovan's Shack -> newer rowboat -> old sunken rowboat -> ornate mirror (exact retrieval interaction TBD).
2. Place mirror at mother's Art Studio vanity -> drawers unlock -> Tiny Key AND unspecified additional item leading toward Sune puzzle #3. Tiny Key -> Grandfather Clock hour hand.
3. Sune puzzle #3 still undesigned, awards Ladder Hook. Hook lowers attic ladder -> attic minute hand, Clockwork Winder in storage box, missing storybook. Chimney flue contains separate missing storybook; chimney clock takes hour and minute hands, set noon, press center -> replacement aqueduct gear. Four Sune busts require winder and ordered sequence (clue and order TBD), unveil carved sliding relief in central shrine; solving yields bag 1000 gp and Brass Key beneath, to open Study. Clock and Grove are parallel once attic accessible.

## Mid-game chain
Study note 587 -> shack lockbox -> sluice crank -> drain pond -> Weathered Key -> basement access -> basement workshop repair tool -> repair parents' bedroom nightstand -> gate handle. Aqueduct submerged steps from drained pond, opening requires handle and clock replacement gear. Exact drawer repair tool, plausibility of alternative force, and basement definition of first vault requirement need clarification.

## Late / final chains
Aqueduct -> forest well -> reverse maze -> Greenhouse and Gazebo. Greenhouse puzzle gives first prayer ('Prayer of Protection') which when made usable as item and used at Sune's shrine deactivates concealment/Arcane Lock protecting Candle Workshop adjoining Art Studio -> wick. Lantern oil freely available at Donovan shack. Wick+oil at gazebo garden lantern -> apparent brief fire as cobwebs burn -> second Rufus eye falls. First eye in Sophia's stuffed bear. Both at Rufus in Study -> mouth opens, brass button, uncharged power source -> aqueduct charging station -> Crimson Veil.
Six books: 2 on Sophia shelf, one pond hollow log, one attic, one chimney flue, one gazebo. Order by publication-order clues on book item descriptions; final book currently Gazebo (available mid-game), which would permit Gond half too early. User wants Mosaic completed during Crimson Veil; gate for last book UNDECIDED. Second prayer ('Prayer of Devotion') inscribed in father's masonry, site unplaced, acquired as usable item, used at same shrine -> Sune emblem half. Timing of first/second prayers and actual text remain unfinalized; user to write them.

## Critical pacing issues
P1: Spine Mosaic final gazebo book can be collected as soon as maze accessed. Requires a specific post-Crimson-Veil retrieval gate OR a relocated final book. Neither selected.
P2: Greenhouse immediately available after aqueduct, not automatically late-game (~67%); its Protection prayer and workshop wick may be gained earlier, defeating designed ~67–78% stretch. Choose milestone/puzzle gate, not simply location.
P3: Gazebo eye held by mundane cobwebs; fire spells/torches or manual retrieval plausibly bypass wick and lantern. Decide whether improvisation permits sequence break or provide grounded restraint not circularly tied to eye.
P4: Illusory wall alone can be traversed/touched/dispelled. Protective Arcane Lock/password and authority/timing need actual behavior specification and reasonable player alternatives.
P5: Early Sune #3 does not exist; vanity second reward is unnamed; cannot guarantee hook pacing yet.
P6: Four bust order/clue absent and sliding puzzle content/solution not finalized. Both must allow opening Study without Study-derived clues.
P7: Great Room code 027 clue undisclosed; pellet comes early but needs final connection to bowl; late ritual specifics partly designed.
P8: Parents' broken drawer may be forced with mundane tools/magic without workshop repair tool; intentional bypass policy necessary.
P9: Code 587 may be guessed early, bypassing Study; decide whether allowed or enforce discovery-based lock.
P10: Phrase '2/3 progression' needs milestone-weight definition, else percentage claims cannot be objectively verified.

## Additional unfinished content
- Exact main Greenhouse puzzle; Shadow That Sees connections, Protection prayer inscription or object discovery.
- Second prayer masonry location and acquisition gate (ideally Crimson Veil, not canon placement yet).
- Sune shrine prayer-item trigger implementation: two discrete IDs/effects, authoritative Foundry fixture needed, not Regionwright-authored; transfer only proven results to Regionwright later.
- Final-vault physical location/activation and two-half emblem assembly; ensure no extra fifth collection blocker.
- Six storybook publication order and individual clues; player-safe item names.
- Intro narrative and remaining underused locations. No skill-check DCs, map renders, or Foundry writes until design approved and required workflow gates passed.

## Conflicts and supersessions requiring care
- Tiny Key moved FROM Study to early Art Studio vanity.
- Aqueduct gate handle moved FROM basement workshop to parents' broken nightstand drawer; basement now yields repair tool.
- Winder use at Gazebo rejected. It is early and used at Sune Grove, cannot gate late eye.
- Greenhouse names Glasshouse Conservatory replaced with simply Greenhouse, located maze beyond aqueduct; observatory rejected.
- Original early suggestion hook near hollow log rejected: Ladder Hook comes from undecided Sune Puzzle #3 after mirror/vanity.
- Father's family and Sune shrine details from earlier library may be stale; latest direct user decisions govern. One Null Child grave in Sune's Grove supersedes prior 'no graves'.
- This audit is design interpretation, not canonical GitHub or reproducible DB acceptance; preserve this discrepancy until synchronization authorized.

## Suggested next focused action
Design early Sune Puzzle #3: identify exact vanity secondary item -> required intermediate steps -> Ladder Hook. Then solve bust order/clue. Separately lock down Crimson-Veil book gate and late greenhouse/wick pacing before implementation.
