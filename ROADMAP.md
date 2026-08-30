# VEILBOUND — MASTER PRODUCTION ROADMAP

**Document owner:** ORACLE — Game Director & Planning  
**Repository:** `OuterHeavenX/VEILBOUND`  
**Integration branch:** `main` — carries the full slice as of `v0.3.4-greyhaven`  
**Current development branch:** `claude/todo-implementation-td5zeq`  
**Current playable version:** `v0.3.4-greyhaven`  
**Roadmap status:** ACTIVE  
**Last roadmap update:** 2026-08-30

---

## 0. Production rule

Before meaningful implementation work, read this file plus:

- `README.md`
- `AGENTS.md`
- `docs/CANON.md`
- `docs/ARCHITECTURE.md`
- `docs/VERTICAL_SLICE.md`
- `docs/PROGRESS.md`
- `docs/COMBAT.md`
- `docs/PROGRESSION.md`
- `docs/SUNKEN_ARCHIVE.md`
- `assets/ATTRIBUTION.md`

Every meaningful milestone updates the relevant documentation. Implementation completion and owner-device acceptance are separate states.

---

## 1. North star

VEILBOUND is an original top-down browser action-adventure RPG set in **Eidol**. Kael, a masked relic hunter carrying the damaged **Shardblade**, becomes bound to an ancient mechanical gauntlet called **The Axiom** as the underground relic network known as **The Vein** begins waking after centuries of silence.

The vertical slice must prove:

**Greyhaven → Hollow March → Axiom Awakening → Sunken Archive → Tether → The Archivist → `WELCOME BACK.`**

One codebase must remain first-class on phone, tablet, desktop, keyboard, touch and controller.

---

## 2. Non-negotiable rules

These are numbered so other documents can cite one and be checked. Do not renumber a rule
that is already cited; add new rules at the end.

- **2.1** `index.html` remains the canonical zero-build launch path.
- **2.2** Static hosting must work without npm/bundling for the game runtime.
- **2.3** Mobile is a primary target, not a later port.
- **2.4** Backtracking must reward memory rather than create travel tax.
- **2.5** Persistent world state uses stable authored IDs and Save V1 flags.
- **2.6** Ordinary enemies may repopulate; bosses/story kills opt into persistence.
- **2.7** Axiom powers should affect more than one system where practical.
- **2.8** Resonance is selective authored interaction, not generic detective vision.
- **2.9** Cutscenes stay concise and retry-aware.
- **2.10** Third-party art currently in the repository remains placeholder/development material until licensing and final-art direction are resolved.
- **2.11** No major full-game expansion until the complete vertical slice is stable and accepted.
- **2.12** VEILBOUND's shipped art, audio and UI must be an original identity rather than another game's visual language. (`AGENTS.md` design pillar 9.)
- **2.13** Documentation states what is true of the current build. A claim that has stopped being true is a defect, not stale prose.

---

## 3. Current playable state — v0.3.4-greyhaven

### Foundation / presentation
- [x] zero-build Canvas 2D runtime
- [x] responsive authored 960×540 world
- [x] title key art with Kael, Lyra and Mira, and START / CONTINUE / SETTINGS
- [x] landscape enforced: orientation lock where granted, rotate gate everywhere else
- [x] safe save inspection and resume
- [x] touch, keyboard and controller movement
- [x] development diagnostics
- [x] procedural audio: per-region beds and gameplay cues
- [x] viewport measured from the canvas box, so the world stays centred
- [x] movement stick summoned wherever the left of the screen is touched
- [x] character/enemy sprite pipeline with fallbacks

### Greyhaven / overworld
- [x] six Greyhaven exterior landmarks
- [x] five world-state-reactive NPCs
- [x] Wayfarer's Rest save/rest point
- [x] Old Lift Station backtracking hook
- [x] Hollow March Field 1 and Field 2
- [x] authored terrain/scenery
- [x] painted Greyhaven map plate, with the lift gate waking on `story.axiomAwakened`
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

### Sunken Archive cistern wing
- [x] reusable puzzle primitives in `src/core/Puzzles.js`
- [x] push/manipulation block
- [x] weight-only floor plate
- [x] routed water state
- [x] Resonance-operated valve
- [x] Cistern Walk, Sluice Gallery and Reliquary Span
- [x] two-way shortcut back to the Vestibule
- [ ] owner-device acceptance of v0.3.2

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

## 3.1 Owner-device acceptance backlog

Implementation completion and owner-device acceptance are separate states, and the gap is now
five releases wide. Nothing below is a code defect; all of it is untested on the owner's
hardware.

| Version | What it added | Checklist |
|---|---|---|
| `v0.3.0-archive` | Eastern Descent, Vestibule, Catalog Rotunda | `docs/SUNKEN_ARCHIVE.md` § Acceptance — opening pass |
| `v0.3.1-sound` | region beds, gameplay cues, centring, summoned stick | `docs/PROGRESS.md` § v0.3.1 |
| `v0.3.2-cistern` | Cistern Walk, Sluice Gallery, Reliquary Span, shortcut | `docs/SUNKEN_ARCHIVE.md` § Cistern wing acceptance |
| `v0.3.3-threshold` | landscape gate, key-art title | `docs/PROGRESS.md` § v0.3.3 |
| `v0.3.4-greyhaven` | painted Greyhaven town plate | `docs/PROGRESS.md` § v0.3.4 |

One device pass on `v0.3.4-greyhaven` covers all five, since each release carries the ones
before it. That pass is the single largest open item in this roadmap.

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
- [x] region ambience and authored combat/Axiom sound
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
- [x] push/manipulation block
- [ ] rotating mechanism
- [x] energy/water route state
- [x] multi-room puzzle state where justified
- [x] first meaningful shortcut

Generic puzzle behavior now lives in `src/core/Puzzles.js` rather than `src/main.js`.

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

1. Test `v0.3.4-greyhaven` on iPhone using the checklist in `docs/SUNKEN_ARCHIVE.md`, plus:
   the world sits centred with even letterboxing; the stick appears under the thumb
   anywhere on the left; each region sounds distinct and music sits under the cues; the
   rotate gate appears upright and hands the game back on turning.
2. Fix any collision/readability/save regressions found in the three Archive opening rooms.
3. Create the Tether acquisition chamber.
4. Implement and teach Tether across traversal/object/combat use.
5. Build deeper mastery rooms.
6. Build The Archivist framework.
7. Produce the `WELCOME BACK.` sequence.
8. Run full vertical-slice device acceptance before expanding world scale.
