# H-G05 Allen's Study — V001 one-render, immediate FINAL INSPECT FAIL (wrong room)

**2026-10-24 Pacific.** **Campaign:** Cabin in the Ashen Veil. **Owner workflow:** mandatory PREPARE reread, new independent affirmative-only prompt, exactly ONE image RENDER in this work turn, immediate actual-pixel INSPECT, assistant final art PASS/FAIL, no Foundry injection on FAIL. **Final verdict: FAIL.** This is not an approved H-G05 scene background and MUST NOT be staged as the Study. No Foundry world data changed in this art-only work unit.

## PREPARE and new prompt provenance

- Checked owner-approved H-G05 consolidated row in `all-scene-preparation-register-v2-2026-10-22.json`, house topology correction in `blueprints/house-layout-revision-v2-2026-10-22.md`, hard-gate details in `all-map-preparation-preflight-v2-2026-10-22.md`, and `authoritative-puzzle-design-and-foundry-implementation-spec-v1-2026-10-22.md`, as well as the owner-approved aged H-G06 Great Room art standard.
- No separate newer H-G05 room PREPARE existed in `prepares/`; created [current H-G05 synthesized PREPARE](../prepares/h-g05-allen-study-current-synthesized-pre-render-2026-10-24.md), commit `ed3235ddd0cec4b5247a2fbbf18788b3b42452e6`.
- The [V001 fresh positive-only Study image prompt](../render-prompts/h-g05-allen-study-fresh-affirmative-render-v001-2026-10-24.md), commit `2e88b1bde20d8a953b78705e1a84d064c85bf4b2`, explicitly specified WEST Great Room doorway, NORTH exterior door, drafting desk and `587` note, taxidermied dark hunting hound Rufus with **two empty eye sockets**, fifty-year abandonment and neutral ambient light.
- **Source hierarchy:** latest owner-canon Study PREPARE and puzzle rules govern topology; approved H-G06 Great Room is the mandatory visual aging/neutral-light example. Prior H-U07 Studio artwork is **not** an H-G05 arrangement source.

## One ImageGen call / exact image

- The assistant invoked image generation **once** after archiving the new Study prompt. ImageGen returned generation `1028419c-81ad-47be-8421-1bd71c5f3086`, `edit_op:null`, `parent_gen_id:null`, original output `a_highly_detailed_moody_isometric_top_down_inter.png`.
- Verified file: **1536×1024 RGB PNG**, **2,791,556 bytes**, SHA-256 **`2c14e4958539d3eba71d1d340e226431a3397c73790a5c34a0bb368ed1655ecf`**, obtained by in-session image file/Pillow/hashlib readback.
- Original exact PNG [archived in private connected Drive unapproved folder](https://drive.google.com/file/d/1LKZYHHZXva1YbUWvEBRQ6aMVbqrGCaLh/view?usp=drivesdk), independent Drive metadata readback confirmed PNG MIME, **2,791,556 bytes** and the expected unapproved folder `1ganNpKYPh53_OgEV9jOU-iMfjgovXpo8`.
- **Critical renderer identity drift:** Despite the freshly committed H-G05 Study prompt, the generation was visibly a carryover of **H-U07 Dahlia's Art Studio**. The generation metadata's displayed prompt describes an *artist's atelier* with vanity, easel, 027 painting, Sune shrine, curtained windows, candles and busts. It therefore cannot be treated as a valid Study render. The visible H-G05 text was not effectively honored by the image-generation operation.

## Actual image INSPECT — mandatory Study scene requirements

| Binding requirement | Final status | Visible finding |
|---|---|---|
| Distinct WEST Study↔Great Room entrance | **PARTIAL** | One wide open threshold exists at the west/left side; however it belongs to an otherwise wrong Studio composition |
| Correct NORTH exterior Study doorway to rear estate / EXT-08 | **FAIL** | Upper/north perimeter has a row of leaded windows, not the required separate exterior door |
| No extra physical passage that bypasses Study key | **FAIL** | Lower/south edge also has a large threshold unrelated to approved Study topology |
| Rufus taxidermied hound with **two vacant eye sockets** | **FAIL** | Rufus is absent; instead room contains busts, easel and Studio-like furnishings |
| Drafting desk carrying an inspectable **587** note | **FAIL** | Study clue prop is absent; the dominant framed clue shows **027** on a painted chest, a separate H-U07 Studio clue |
| Hidden power source remains unrevealed | **PASS as absence only** | No openly visible uncharged Gondian source; but the intended secret hound/body interaction has not been represented |
| Genuine fifty-year disrepair matching aged H-G06 | **PARTIAL** | Dust, cobwebs, ragged rugs and leaves present, while furnishings retain comparatively ornate preserved appearance |
| Uniform neutral diffuse baked lighting | **PARTIAL/FAIL** | Local warm candles and bright leaded-window highlights create an uneven baked-light effect |
| Distinct playable Study, correct orientation | **FAIL** | The map is recognizably an Art Studio, not Allen's Study |

**FINAL: FAIL**, without accepting any accidentally satisfactory isolated visual element. The image belongs to the rejected attempt archive only. No same-turn rerender or pixel edit was performed. This prevents a mistaken H-G05 map approval, false Stage transfer and puzzle continuity corruption.

## Next independent bounded roadmap unit

1. **Review the dedicated H-G05 PREPARE again** and ground only in H-G05 study narrative and the approved H-G06 aged Great Room image. Author a wholly NEW affirmative-only visible-feature prompt. Prior failed generation prompts are abandoned.
2. Explicitly center the **taxidermied Rufus hound with two empty sockets**, Allen's **587** desk note, and the **NORTH exterior doorway** and **WEST Great Room doorway**. Use owner-approved aged Great Room solely to control severe aged material and even neutral lighting. Avoid reusing any H-U07 Studio arrangement example; prior generated Studio images are rejected as Study inputs.
3. The image-generation tool apparently reused older Studio context; for next fresh turn ensure the immediately adjacent image-generation instructions and selected reference imagery are about **Study + aged Great Room only**, and verify returned generated subject before any further step. If tool cannot target Study reliably, use actual geometry-locked Study control as the next distinct single render instead of free-form repeating. This is a technique refinement, **not** a change to the binding positive-only prompt policy.
4. **Exactly ONE new image generation in the next independent turn**, immediate actual-pixel INSPECT and hard PASS/FAIL. On FAIL archive, no Foundry installation. The user explicitly requires a distinct new turn before any second image attempt.
5. Separate **H-U07** source remains owner-delegated VISUAL PASS and **fully staged under exact SHA** on Foundry Data, but its native image-only Scene BUILD is still **blocked at the unauthenticated Foundry `/join` page**. Do not conflate unrelated world work.
6. Canonical accepted base-art census **remains 20/45**; H-G05 not accepted, so 25 base arts remain (including H-G05). No campaign scene or character mutation made.

## Relay delivery contract

This bounded unit originated as an exact **correlated MESSAGE_ACTION relay** with correlation `foreman-idle-continue-45cc64c4-cc75-4c3c-9ad7-8d535663c29c-20261024-01` and origin message `msg-7ef5d34d-5110-4167-b718-806a8c907566`. The final tool action for this exact turn is **exactly one** `bridge_send` using the supplied exact correlated `bridge_message` return route, with a concise result/failure. No new `native_roundtrip`; no retries of pending/unknown sends without fresh exact-target evidence.
