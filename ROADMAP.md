# VEILBOUND — MASTER PRODUCTION ROADMAP

**Document owner:** ORACLE — Game Director & Planning  
**Repository:** `OuterHeavenX/VEILBOUND`  
**Current development branch:** `feature/sunken-archive-foundation`  
**Current playable version:** `v0.3.0-archive`  
**Roadmap status:** ACTIVE  
**Last roadmap update:** 2026-08-30

---

## 0. Production rule

Before meaningful implementation work, read this file plus:

- `AGENTS.md`
- `docs/CANON.md`
- `docs/ARCHITECTURE.md`
- `docs/VERTICAL_SLICE.md`
- `docs/PROGRESS.md`
- `docs/COMBAT.md`
- `docs/PROGRESSION.md`
- `docs/SUNKEN_ARCHIVE.md`

Every meaningful milestone updates the relevant documentation. Implementation completion and owner-device acceptance are separate states.

---

## 1. North star

VEILBOUND is an original top-down browser action-adventure RPG set in **Eidol**. Kael, a masked relic hunter carrying the damaged **Shardblade**, becomes bound to an ancient mechanical gauntlet called **The Axiom** as the underground relic network known as **The Vein** begins waking after centuries of silence.

The vertical slice must prove:

**Greyhaven → Hollow March → Axiom Awakening → Sunken Archive → Tether → The Archivist → `WELCOME BACK.`**

One codebase must remain first-class on phone, tablet, desktop, keyboard, touch and controller.

---

## 2. Non-negotiable rules

- `index.html` remains the canonical zero-build launch path.
- Static hosting must work without npm/bundling for the game runtime.
- Mobile is a primary target, not a later port.
- Backtracking must reward memory rather than create travel tax.
- Persistent world state uses stable authored IDs and Save V1 flags.
- Ordinary enemies may repopulate; bosses/story kills opt into persistence.
- Axiom powers should affect more than one system where practical.
- Resonance is selective authored interaction, not generic detective vision.
- Cutscenes stay concise and retry-aware.
- Third-party art currently in the repository remains placeholder/development material until licensing and final-art direction are resolved.
- No major full-game expansion until the complete vertical slice is stable and accepted.

---

## 3. Current playable state — v0.3.0-archive

### Foundation / presentation
- [x] zero-build Canvas 2D runtime
- [x] responsive authored 960×540 world
- [x] title / Continue / New Game / Settings
- [x] safe save inspection and resume
- [x] touch, keyboard and controller movement
- [x] development diagnostics
- [x] procedural title ambience
- [x] character/enemy sprite pipeline with fallbacks

### Greyhaven / overworld
- [x] six Greyhaven exterior landmarks
- [x] five world-state-reactive NPCs
- [x] Wayfarer's Rest save/rest point
- [x] Old Lift Station backtracking hook
- [x] Hollow March Field 1 and Field 2
- [x] authored terrain/scenery
- [x] Forgotten Relic Chamber

### Combat
- [x] Shardblade melee
- [x] health, damage, knockback and i-frames
- [x] March Husk melee pursuit
- [x] Vein Sentry ranged state machine
- [x] telegraph/projectile/recovery loop
- [x] Resonance interruption of Sentry telegraph
- [x] enemy death animation pipeline
- [x] ordinary-enemy repopulation

### Progression / menu
- [x] Character pause menu
- [x] Vitality, XP, JP, Coins, Shardblade level and Axiom protocols
- [x] +2 XP per enemy defeat
- [x] +1 JP per enemy defeat
- [x] one physical coin drop per enemy defeat
- [x] coin pickup and persistence
- [ ] XP spending / player level curve
- [ ] JP spending / mastery system
- [ ] Inventory tab
- [ ] Equipment tab

### Axiom / story
- [x] Axiom awakening
- [x] `RESONANCE DETECTED`
- [x] `BOUND USER CONFIRMED`
- [x] Resonance grant and persistence
- [x] authored Resonance nodes
- [x] Hollow March buried Vein route reveal
- [x] Greyhaven return discovery
- [x] Forgotten chamber core memory

### Sunken Archive opening
- [x] Resonance-gated route from Hollow March Field 2
- [x] Eastern Descent
- [x] one-time `archive.entered` acknowledgement
- [x] drowned side chambers with matching art/collision geometry
- [x] Vestibule
- [x] mixed Husk + Vein Sentry dungeon encounter
- [x] persistent floor-switch primitive
- [x] persistent door/seal primitive
- [x] flag-gated room exit
- [x] Catalog Rotunda
- [x] Rotunda Resonance memory
- [x] `PROTOCOL TRACE: TETHER.` foreshadowing
- [x] deeper Archive bulkhead intentionally sealed
- [ ] owner-device acceptance of v0.3.0

---

# 4. Phase map

```text
PHASE 0 — FOUNDATION                         MOSTLY COMPLETE
        |
PHASE 1 — OPENING GAMEPLAY LOOP             FUNCTIONALLY COMPLETE / ACCEPTANCE ONGOING
        |
PHASE 2 — SUNKEN ARCHIVE                    ACTIVE
        |
PHASE 3 — THE ARCHIVIST + WELCOME BACK      PLANNED
        |
PHASE 4 — VERTICAL SLICE POLISH             PLANNED
        |
        +---- FIRST MAJOR PRODUCTION GATE ----+
                                               |
PHASE 5 — FULL GAME SYSTEM EXPANSION           |
PHASE 6 — WORLD / DUNGEON PRODUCTION           |
PHASE 7 — ALPHA                                |
PHASE 8 — BETA / CONTENT LOCK                  |
PHASE 9 — RELEASE CANDIDATE / 1.0 <------------+
```

---

# 5. Phase 1 — Opening gameplay loop

**Status:** FUNCTIONALLY COMPLETE; owner-device checklist still has deferred items.

The opening now proves title/resume, Greyhaven NPCs, rest/save, Hollow March traversal, melee/ranged combat, Axiom awakening, Resonance, progression rewards and the route into the first dungeon.

Remaining Phase 1 work is refinement/acceptance rather than another foundational system:

- [ ] complete deferred iPhone checks
- [ ] iPad acceptance
- [ ] desktop acceptance
- [ ] controller acceptance
- [ ] region ambience and authored combat/Axiom sound
- [ ] optional Hollow March collectible/side route

Do not block Sunken Archive production on cosmetic Phase 1 polish unless a regression appears.

---

# 6. Phase 2 — The Sunken Archive

**Status:** ACTIVE

Owners: ARCHITECT + FORGE + WRAITH + SCRIBE + ECHO, with SPECTER on acquisition/cinematic beats.

The dungeon follows:

**Teach → Test → Combine → Twist → Master**

## 6.1 Opening — v0.3.0

- [x] Resonance-revealed overworld entrance
- [x] Eastern Descent arrival room
- [x] persistent dungeon-entered flag
- [x] drowned visual/collision language
- [x] Vestibule mixed encounter
- [x] floor switch
- [x] persistent seal/door
- [x] flag-gated exit
- [x] Catalog Rotunda
- [x] authored Resonance memory
- [x] Tether foreshadowing
- [ ] owner-device acceptance

See `docs/SUNKEN_ARCHIVE.md` for exact room behavior and test checklist.

## 6.2 Reusable puzzle language — next

- [x] switch primitive v1
- [x] persistent door primitive v1
- [x] flag-gated exit v1
- [x] Resonance-reactive mechanism v1
- [ ] push/manipulation block
- [ ] rotating mechanism
- [ ] energy/water route state
- [ ] multi-room puzzle state where justified
- [ ] first meaningful shortcut

Once the opening is accepted, move the generic puzzle behavior out of `src/main.js` before the dungeon grows enough to make that file the permanent puzzle engine.

## 6.3 Tether acquisition

Tether is acquired roughly halfway through the dungeon, not at the entrance.

Required:

- [ ] establish manipulation problem before acquisition
- [ ] acquisition chamber
- [ ] narrative reason / Axiom protocol restoration
- [ ] concise activation cinematic
- [ ] signature audiovisual identity
- [ ] safe first use
- [ ] anchor target contract
- [ ] valid/invalid targeting feedback
- [ ] traversal pull
- [ ] object pull
- [ ] machinery manipulation
- [ ] combat interaction
- [ ] touch targeting
- [ ] controller targeting

## 6.4 Tether teaching sequence

Planned progression:

1. cross a gap
2. pull an object
3. combine object + traversal
4. use Tether under enemy pressure
5. manipulate moving Archive machinery
6. mastery room combining traversal + machinery + combat

## 6.5 Backtracking / optionality

- [ ] earlier visible route becomes reachable with Tether
- [ ] optional lore room
- [ ] optional treasure
- [ ] major shortcut
- [ ] loop to a recognized landmark
- [ ] pre-boss recovery/save point

## Phase 2 gate

Before boss production is considered stable:

- [ ] dungeon route completable from a fresh save
- [ ] mid-dungeon reload safe
- [ ] no required puzzle soft-lock
- [ ] Tether understandable with minimal text
- [ ] touch/keyboard/controller Tether acceptance
- [ ] shortcut materially reduces backtracking

---

# 7. Phase 3 — The Archivist

**Status:** PLANNED

The first major boss is an ancient six-limbed Archive machine with a rotating-ring head and glowing core.

Required encounter arc:

- [ ] Phase 1: readable legs/core vulnerability
- [ ] Phase 2 at ~60%: flooding/platform/Tether anchors/beam pressure
- [ ] Phase 3 at ~25%: freed body, faster aggression, open core, collapsing arena
- [ ] Tether-to-core punish sequence
- [ ] clear restart/checkpoint
- [ ] first-view intro with shortened/skippable retry behavior
- [ ] defeat persistence
- [ ] post-boss recognition sequence

Canon payoff:

`BOUND USER IDENTIFIED`  
`AXIOM LINEAGE...`  
`CONFIRMED`  
`WELCOME BACK.`

Kael: `What does that mean?`

---

# 8. Phase 4 — Vertical slice polish / acceptance

Before broad production expansion:

- [ ] full Greyhaven → Archivist route coherent
- [ ] iPhone acceptance
- [ ] iPad acceptance
- [ ] desktop acceptance
- [ ] controller acceptance
- [ ] stable performance in combat/boss effects
- [ ] save/reload across all critical progression points
- [ ] no soft locks
- [ ] concise retry-aware cinematics
- [ ] distinct Greyhaven / Hollow March / Archive presentation
- [ ] asset licensing/public-repository risk resolved
- [ ] final-or-approved-placeholder art boundary documented

---

# 9. Post-slice direction — HOLD until gate

After the first vertical slice proves itself, expand deliberately into:

- larger Eidol overworld structure
- additional settlements
- additional Axiom protocols: Impulse, Phase, Shatter and late-game restoration
- additional dungeons
- equipment/inventory systems
- XP-level and JP-mastery spending
- deeper Shardblade progression
- more enemy families and bosses
- expanded quests/lore
- full soundtrack and SFX identity
- release-quality original art pipeline

Still held until justified:

- multiplayer
- cloud accounts/saves
- monetization
- giant crafting systems
- massive skill trees
- procedural world generation

---

# 10. Immediate production order

1. Test `v0.3.0-archive` on iPhone using the checklist in `docs/SUNKEN_ARCHIVE.md`.
2. Fix any collision/readability/save regressions found in the three Archive opening rooms.
3. Build push/manipulation block v1.
4. Build water/energy-routing state and first shortcut loop.
5. Create the Tether acquisition chamber.
6. Implement and teach Tether across traversal/object/combat use.
7. Build deeper mastery rooms.
8. Build The Archivist framework.
9. Produce the `WELCOME BACK.` sequence.
10. Run full vertical-slice device acceptance before expanding world scale.
