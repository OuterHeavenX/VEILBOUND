# VEILBOUND — MASTER PRODUCTION ROADMAP

**Document owner:** ORACLE — Game Director & Planning  
**Repository:** `OuterHeavenX/VEILBOUND`  
**Current development branch:** `feature/vertical-slice-foundation`  
**Current playable version:** `v0.1.3-resonance`  
**Roadmap status:** ACTIVE  
**Last roadmap update:** 2026-08-29

---

# 0. READ THIS FIRST

This is the master production roadmap for VEILBOUND.

Before meaningful implementation work, read this file and then consult:

- `AGENTS.md` — discipline ownership and handoff rules.
- `docs/CANON.md` — established world/story truth.
- `docs/ARCHITECTURE.md` — engine, save, input, room, and system contracts.
- `docs/VERTICAL_SLICE.md` — exact requirements for the first complete playable slice.
- `docs/PROGRESS.md` — chronological implementation history and owner-device findings.

This roadmap answers:

1. What are we building?
2. What exists now?
3. What comes next?
4. What must be proven before expansion?
5. What are we intentionally not building yet?

**Documentation rule:** every meaningful implementation milestone must update the relevant MD files. The roadmap, vertical-slice status, progress log, architecture, agent handbook, and canon must never silently drift away from the code.

---

# 1. PRODUCT VISION

VEILBOUND is an original top-down browser action-adventure RPG set in **Eidol**, a melancholy post-collapse world built over the remains of an ancient underground system called **The Vein**.

The player controls **Kael**, a masked relic hunter carrying:

- the damaged relic weapon **Shardblade**,
- the ancient mechanical gauntlet **The Axiom**.

The player experience should combine:

- deliberate top-down exploration,
- responsive melee combat,
- puzzle-driven dungeons,
- ability-based backtracking,
- evolving settlements and NPCs,
- environmental storytelling,
- ancient machinery that reacts to Kael,
- persistent world-state change,
- concise cinematic storytelling,
- strong visual and sonic identity,
- phone, tablet, desktop, keyboard, touch, and controller play from one codebase.

The first major promise is:

> Explore a forgotten world, awaken something ancient, gain powers that change traversal, puzzles, combat, and discovery, then learn that ancient systems recognize Kael in ways they should not.

---

# 2. NON-NEGOTIABLE PRODUCTION RULES

## 2.1 Zero-setup launch

`index.html` is the canonical launch point.

The shipped browser version must remain static-host friendly and playable without requiring npm install, a local bundler, or a development server.

## 2.2 One codebase, first-class devices

Support from the beginning:

- iPhone,
- iPad,
- Android phone/tablet,
- desktop browser,
- keyboard,
- touch,
- controller/gamepad.

Mobile is not a future port.

## 2.3 Vertical slice before scale

Do not aggressively expand the full game until the route from **Greyhaven to The Archivist** is coherent, satisfying, stable, and accepted on owner devices.

Room count alone is not progress.

## 2.4 Abilities must affect multiple systems

Whenever practical, an Axiom ability should matter in at least two of:

- traversal,
- puzzles,
- combat,
- secrets,
- environmental interaction,
- story presentation.

## 2.5 Backtracking must reward memory

Returning to earlier spaces should reveal new routes, secrets, shortcuts, NPC changes, optional fights, lore, treasure, or altered world state.

## 2.6 Persistent state must be explicit

Anything that matters after leaving a room uses authored IDs and Save Schema state.

Examples:

- Axiom awakened,
- Resonance route revealed,
- opened chest,
- solved puzzle,
- defeated enemy/boss,
- opened shortcut,
- activated mechanism,
- completed quest stage.

## 2.7 Major mysteries require real answers

SCRIBE must define hidden answers before narrative payoff production reaches them.

The central early mystery is why The Archivist says:

**WELCOME BACK.**

## 2.8 Cutscenes respect the player

Cinematics are short, intentional, and replay-aware. Boss intros must not become long mandatory repeats after death.

## 2.9 Original identity

VEILBOUND may learn structural lessons from classic action-adventure games but must not reproduce another game's proprietary art, maps, code, music, characters, or distinctive copyrighted content.

## 2.10 Truthful documentation

A checkbox is marked complete only when the feature exists in the active branch. Owner-device acceptance is separate from implementation completion.

---

# 3. STATUS LEGEND

- `[x]` implemented in active development branch
- `[~]` prototype or implemented but still requires refinement/acceptance
- `[ ]` not implemented
- `[HOLD]` deliberately deferred
- `[GATE]` required before major expansion

---

# 4. CURRENT STATE — v0.1.3-resonance

## Foundation

- [x] Repository initialized.
- [x] `AGENTS.md` studio handbook.
- [x] `docs/CANON.md` canon foundation.
- [x] `docs/ARCHITECTURE.md` architecture contract.
- [x] `docs/VERTICAL_SLICE.md` vertical-slice definition/status.
- [x] `docs/PROGRESS.md` chronological implementation log.
- [x] Master roadmap.
- [x] Zero-build `index.html` launch.
- [x] Static-host/browser launch contract.
- [x] Visible runtime version.
- [x] Fatal startup error screen.

## Runtime / movement

- [x] Canvas game loop.
- [x] Responsive 960×540 authored world viewport.
- [x] Keyboard movement.
- [x] Touch virtual joystick.
- [x] Controller analog movement.
- [x] Four-direction facing.
- [x] Authored collision rectangles.
- [x] Room transitions.
- [x] Greyhaven prototype.
- [x] Hollow March Field 1 prototype.
- [x] Hollow March Field 2 prototype.
- [x] Forgotten Relic Chamber prototype.

## Combat

- [x] Shardblade attack input.
- [x] Directional melee overlap.
- [x] Enemy health.
- [x] Enemy hurt flash.
- [x] Enemy knockback.
- [x] Player health.
- [x] Player damage.
- [x] Player knockback.
- [x] Invulnerability frames.
- [x] Bounded impact particles.
- [x] First melee enemy behavior.
- [~] Sentry prototype exists but does not yet satisfy final ranged/area-control enemy acceptance.

## Persistence

- [x] Save Schema V1.
- [x] LocalStorage save/load normalization.
- [x] Room/position persistence.
- [x] Health persistence.
- [x] Axiom ability list persistence.
- [x] World flags.
- [x] Stable defeated-enemy IDs.
- [x] Defeated-enemy persistence.
- [x] Room-transition autosave.
- [x] Autosave on page hide.
- [x] Autosave when app/tab becomes hidden.
- [ ] Full owner-device refresh/reopen acceptance.

## Axiom / story

- [x] Axiom awakening trigger.
- [x] `RESONANCE DETECTED` presentation.
- [x] `BOUND USER CONFIRMED` presentation.
- [x] Persistent Axiom-awakened flag.
- [x] Resonance ability grant persisted.

## Resonance v1

- [x] Dedicated Resonance input separate from Shardblade.
- [x] Touch `◇` Resonance button.
- [x] Keyboard `E` / `R` / Shift mapping.
- [x] Controller secondary-face-button mapping.
- [x] Expanding pulse visualization.
- [x] Cooldown behavior.
- [x] Authored per-room Resonance nodes.
- [x] Persistent discovery flags.
- [x] Hollow March Field 2 buried Vein route discovery.
- [x] Forgotten Relic Chamber core-memory response.
- [x] Resonance remains selective instead of a global detective-vision overlay.
- [ ] Owner-device acceptance of touch Resonance and persistence.

## Portrait rendering correction

The v0.1.2 iPhone test exposed cyan cinematic flash bleeding into portrait letterbox regions.

- [x] Full physical canvas clears to void black each frame.
- [x] Gameplay stays inside scaled world viewport.
- [x] Cinematic flash clips to gameplay viewport.
- [ ] iPhone confirmation that cyan letterbox contamination is gone.

---

# 5. MASTER PHASE MAP

```text
PHASE 0 — FOUNDATION
        |
PHASE 1 — OPENING GAMEPLAY LOOP
        |
PHASE 2 — SUNKEN ARCHIVE
        |
PHASE 3 — THE ARCHIVIST + WELCOME BACK
        |
PHASE 4 — VERTICAL SLICE POLISH / ACCEPTANCE
        |
        +---- FIRST MAJOR PRODUCTION GATE ----+
                                               |
PHASE 5 — FULL GAME SYSTEM EXPANSION           |
        |                                      |
PHASE 6 — WORLD / DUNGEON PRODUCTION           |
        |                                      |
PHASE 7 — ALPHA                                |
        |                                      |
PHASE 8 — BETA / CONTENT LOCK                  |
        |                                      |
PHASE 9 — RELEASE CANDIDATE / 1.0 <------------+
```

Phases 0–4 are the committed production target. Phases 5–9 remain directional until the vertical slice is approved.

---

# PHASE 0 — FOUNDATION

**Status:** MOSTLY COMPLETE

## ORACLE

- [x] Prime directive.
- [x] Agent ownership.
- [x] Canon change rules.
- [x] Vertical-slice scope.
- [x] Master roadmap.
- [x] Progress-log convention.
- [ ] Formal changelog/release-note convention.
- [ ] Dedicated owner-device acceptance checklist file.

## FORGE

- [x] Zero-build launch.
- [x] Game loop.
- [x] Input foundation.
- [x] Room system.
- [x] Collision.
- [x] Save V1.
- [ ] Event bus/presentation hooks.
- [x] Debug overlay.
- [x] Runtime diagnostics.
- [x] Development-mode toggle.
- [ ] Save migration registry before schema-breaking public changes.

## Phase 0 gate

- [GATE] `index.html` launches from static hosting.
- [GATE] no build server required.
- [GATE] startup errors surface visibly.
- [GATE] phone/tablet canvas scaling does not corrupt world rendering.

---

# PHASE 1 — OPENING GAMEPLAY LOOP

**Status:** ACTIVE  
**Target experience:** first 5–15 minutes.

The player should launch VEILBOUND, understand Kael's immediate purpose, travel from Greyhaven through the Hollow March, survive early enemies, awaken the Axiom, learn Resonance, and discover the direction of the Sunken Archive.

## 1.1 Title / boot

Owners: SPECTER + WRAITH + ECHO + FORGE

- [~] Boot identity.
- [x] Version display.
- [ ] Proper title screen.
- [ ] New Game / Continue logic.
- [ ] Settings entry.
- [ ] device-appropriate control hint.
- [ ] title ambience/music.
- [ ] safe resume flow.

## 1.2 Greyhaven

Owners: WRAITH + SCRIBE + ARCHITECT + FORGE

### Core exterior

- [~] Main exterior prototype.
- [ ] Wayfarer's Rest.
- [ ] Relic Workshop.
- [ ] Market Row.
- [ ] Old Lift Station.
- [ ] Archivist's House.
- [ ] Bell Tower landmark.

### NPC layer

- [ ] Innkeeper.
- [ ] Workshop NPC.
- [ ] Archivist/researcher NPC.
- [ ] ordinary resident.
- [ ] optional side-story NPC.

### Gameplay purpose

- [ ] establish Kael as relic hunter.
- [ ] establish ancient technology as common but poorly understood.
- [ ] give concrete reason to leave town.
- [ ] show one inactive mechanism for future backtracking.
- [ ] first save/rest location.
- [ ] one future upgrade/service hook.

### Future persistent evolution flags

- [ ] Greyhaven reaction to awakened Axiom.
- [ ] Greyhaven reaction to Archive opening.
- [ ] Greyhaven reaction to Archivist defeat.
- [ ] service unlocks.
- [ ] NPC quest-stage flags.

## 1.3 Hollow March Field 1

- [~] Traversal/collision prototype.
- [x] first melee enemy.
- [ ] stronger landmark guiding eastward progression.
- [ ] optional side route.
- [ ] first collectible/chest.
- [ ] environmental motion.
- [ ] region ambience/music.

## 1.4 Hollow March Field 2

- [~] Traversal/collision prototype.
- [~] second enemy prototype.
- [x] route to Forgotten Relic Chamber.
- [x] authored hidden Resonance node.
- [x] persistent buried Vein route reveal.
- [ ] fully authored ranged/area-control behavior.
- [ ] readable telegraph.
- [ ] visible future Tether anchor.
- [ ] optional lore object.
- [ ] actual Sunken Archive overworld entrance route.

## 1.5 Shardblade combat

Owners: FORGE + WRAITH + ECHO

- [x] basic attack.
- [x] directional hit overlap.
- [x] health/damage.
- [x] knockback.
- [x] i-frames.
- [~] attack arc placeholder.
- [ ] polished anticipation/contact/recovery timing.
- [ ] bounded hit pause.
- [ ] authored weapon trail.
- [ ] impact audio.
- [ ] enemy-hit vs environment-hit distinction.
- [ ] stronger death/defeat presentation.
- [ ] controller acceptance.

## 1.6 Forgotten Relic Chamber

Owners: SCRIBE + SPECTER + WRAITH + FORGE + ECHO

- [x] chamber.
- [x] awakening trigger.
- [x] first dialogue/cinematic pass.
- [x] persistent awakening flag.
- [x] Resonance granted.
- [x] core Resonance node.
- [~] chamber visual composition.
- [ ] camera staging.
- [ ] authored lighting reaction.
- [ ] large-scale Vein activation pulse presentation.
- [ ] Axiom sound design.
- [ ] music/silence cue.
- [ ] replay/skip policy.

Canon beats retained:

- `RESONANCE DETECTED`
- `BOUND USER CONFIRMED`
- Kael realizes the system responds specifically to him.
- The Vein begins waking across Eidol.

## 1.7 Resonance v1

Owners: FORGE + ARCHITECT + WRAITH + ECHO

**Design rule:** Resonance is not a generic detective-vision filter. It reveals authored compatible Vein structures and mechanisms only.

### Implemented

- [x] separate input.
- [x] expanding pulse.
- [x] cooldown.
- [x] dedicated mobile control.
- [x] controller mapping.
- [x] authored node contract.
- [x] persistent discovered-state flags.
- [x] first overworld route clue.
- [x] first chamber memory response.

### Still required

- [ ] owner-device usability confirmation.
- [ ] first truly interactive ancient mechanism, not only a clue/marker.
- [ ] hidden circuitry visual language refinement.
- [ ] later enemy-vulnerability integration where appropriate.
- [ ] Resonance sound identity.

## Phase 1 exit gate

Before full Sunken Archive production:

- [ ] title/New Game/Continue flow works.
- [ ] save reload is owner-device accepted.
- [ ] Greyhaven basic NPC interaction exists.
- [ ] opening motivation is clear.
- [ ] melee enemy accepted.
- [ ] ranged/area-control enemy accepted.
- [ ] awakening is persistent.
- [ ] Resonance is playable and understood.
- [ ] Resonance reveals the Archive direction.
- [ ] iPhone Phase 1 acceptance.
- [ ] iPad Phase 1 acceptance.
- [ ] desktop acceptance.
- [ ] controller acceptance.

---

# PHASE 2 — THE SUNKEN ARCHIVE

**Status:** PLANNED — starts after Phase 1 exit conditions are sufficiently stable.

The Sunken Archive is the first complete dungeon and must prove VEILBOUND's reusable dungeon language.

## 2.1 Identity

Owners: WRAITH + ECHO

Visual pillars:

- monumental stone halls,
- turquoise flooded chambers,
- rotating archive cylinders/rings,
- luminous submerged script,
- hanging roots,
- broken bridges,
- corroded metal integrated into stone,
- ancient engineered doors.

Sonic pillars:

- dripping water,
- enormous distant mechanisms,
- low Vein resonance,
- restrained musical motif,
- stronger music layer after Tether acquisition.

## 2.2 Entrance

- [ ] overworld route opened/revealed through Resonance progression.
- [ ] location reveal/title treatment.
- [ ] safe threshold room.
- [ ] dungeon-entered persistent flag.
- [ ] first dungeon save/checkpoint behavior.
- [ ] visible future locks/shortcuts.

## 2.3 Puzzle primitives

Owners: ARCHITECT + FORGE

- [ ] switch.
- [ ] persistent door.
- [ ] push/manipulation block.
- [ ] Resonance-reactive mechanism.
- [ ] rotating mechanism.
- [ ] energy/water route state.
- [ ] authored multi-room state if needed.

## 2.4 Teaching doctrine

Every major mechanic follows:

**Teach → Test → Combine → Twist → Master**

Early rooms:

- [ ] movement/environment reading.
- [ ] switch + persistent door.
- [ ] push object.
- [ ] water/energy routing introduction.
- [ ] Resonance reveal room.

Mid rooms:

- [ ] combined mechanism + enemy pressure.
- [ ] environmental hazard.
- [ ] optional treasure.
- [ ] first major shortcut.
- [ ] Tether acquisition.

## 2.5 Tether acquisition

Owners: ARCHITECT + FORGE + SCRIBE + SPECTER + WRAITH + ECHO

- [ ] narrative reason.
- [ ] activation cinematic.
- [ ] authored Axiom transformation.
- [ ] signature sound.
- [ ] immediate safe use.

Technical requirements:

- [ ] anchor targets.
- [ ] valid/invalid targeting feedback.
- [ ] traversal pull.
- [ ] object pull.
- [ ] machinery manipulation.
- [ ] combat interaction.
- [ ] touch targeting.
- [ ] controller targeting.

## 2.6 Tether teaching sequence

- [ ] Room 1: cross gap.
- [ ] Room 2: pull object.
- [ ] Room 3: combine object + traversal.
- [ ] Room 4: use in combat.
- [ ] Room 5: manipulate moving machinery.
- [ ] Room 6: combine traversal + machinery + enemy pressure.

## 2.7 Backtracking / secrets

- [ ] earlier route becomes reachable with Tether.
- [ ] optional lore room.
- [ ] optional treasure.
- [ ] meaningful shortcut.
- [ ] loop back to recognized landmark.

## Phase 2 exit gate

- [ ] dungeon completable from fresh save.
- [ ] dungeon completable after mid-dungeon reload.
- [ ] no required puzzle soft-lock.
- [ ] Tether understandable with minimal text.
- [ ] Tether accepted on touch/controller/keyboard.
- [ ] shortcut/backtracking reduces friction.

---

# PHASE 3 — THE ARCHIVIST

**Status:** PLANNED

Goal: prove multi-phase boss architecture and land the first major narrative mystery.

## 3.1 Boss visual identity

The Archivist combines:

- massive stone guardian language,
- spider-like segmented locomotion,
- six segmented limbs,
- rotating astronomical/mechanical rings,
- luminous core.

## 3.2 Arena

- [ ] authored boss arena.
- [ ] readable Tether anchors.
- [ ] phase-change geometry.
- [ ] floodable arena state.
- [ ] immediate pre-boss checkpoint.

## 3.3 Phase 1 — leg joints

- [ ] limb telegraphs.
- [ ] joint damage.
- [ ] protected core.
- [ ] readable vulnerability windows.

## 3.4 Phase 2 — flooded arena

Approximate trigger: 60% health, subject to playtesting.

- [ ] arena floods partially.
- [ ] safe ground segments.
- [ ] Tether traversal required.
- [ ] beam/line attacks.
- [ ] music escalation.

## 3.5 Phase 3 — severed guardian

Approximate trigger: 25% health, subject to playtesting.

- [ ] boss tears free.
- [ ] movement accelerates.
- [ ] core opens aggressively.
- [ ] arena fails/collapses.
- [ ] player Tethers to exposed core.
- [ ] Shardblade final punish window.

## 3.6 Retry behavior

Owners: FORGE + SPECTER

- [ ] checkpoint before fight.
- [ ] viewed-intro flag.
- [ ] full first-view intro.
- [ ] reduced/skip-friendly retry.
- [ ] deterministic reset.
- [ ] no duplicate permanent reward.

## 3.7 Post-boss reveal

Owners: SCRIBE + SPECTER + ECHO

Established sequence includes:

- `BOUND USER IDENTIFIED`
- `AXIOM LINEAGE...`
- `CONFIRMED`
- **`WELCOME BACK.`**

Requirements:

- [ ] quiet after combat.
- [ ] meaningful pause.
- [ ] minimal exposition.
- [ ] readable Kael confusion.
- [ ] deliberate music/silence.
- [ ] boss-defeated persistent flag.
- [ ] reveal-viewed flag.

---

# PHASE 4 — VERTICAL SLICE POLISH & ACCEPTANCE

**Planning target:** `v0.2.0-vertical-slice`

This is the first major production gate.

## Complete route

```text
TITLE
  ↓
GREYHAVEN
  ↓
HOLLOW MARCH FIELD 1
  ↓
HOLLOW MARCH FIELD 2
  ↓
AXIOM AWAKENING
  ↓
RESONANCE RETURN / DISCOVERY
  ↓
SUNKEN ARCHIVE
  ↓
TETHER ACQUISITION / MASTERY
  ↓
THE ARCHIVIST
  ↓
WELCOME BACK.
  ↓
ALTERED GREYHAVEN / OVERWORLD
```

## Visual polish — WRAITH

- [ ] authored Kael gameplay sprite.
- [ ] idle/walk frames.
- [ ] authored Shardblade attacks.
- [ ] Axiom glow states.
- [ ] final slice enemy art.
- [ ] Greyhaven visual kit.
- [ ] Hollow March visual kit.
- [ ] Sunken Archive visual kit.
- [ ] Archivist production slice art.
- [ ] UI/HUD pass.
- [ ] location-title treatments.

## Audio polish — ECHO

- [ ] title identity.
- [ ] Greyhaven ambience/theme.
- [ ] Hollow March ambience/theme.
- [ ] Sunken Archive theme.
- [ ] combat layer/stingers.
- [ ] Shardblade swing/hit.
- [ ] Resonance signature.
- [ ] Tether signature.
- [ ] Archivist adaptive score.
- [ ] reveal cue.
- [ ] UI audio.

## Story polish — SCRIBE

- [ ] Greyhaven dialogue pass.
- [ ] opening motivation.
- [ ] Kael voice consistency.
- [ ] restrained environmental lore.
- [ ] Archive mystery support.
- [ ] private explanation for `WELCOME BACK.`
- [ ] terminology audit.

## Cinematics — SPECTER

- [ ] title/opening transition.
- [ ] final awakening staging.
- [ ] Archive reveal.
- [ ] Tether acquisition.
- [ ] Archivist entrance.
- [ ] Phase 2 transition.
- [ ] Phase 3 transition.
- [ ] `WELCOME BACK.` sequence.
- [ ] retry/skipping acceptance.

## UX/device — FORGE + ORACLE

- [x] portrait gameplay viewport preserves dark letterbox by design in code.
- [ ] owner-device confirmation of portrait fix.
- [ ] touch controls avoid critical content.
- [ ] safe areas accepted on notched devices.
- [ ] explicit portrait/landscape policy.
- [ ] controller mappings documented.
- [ ] pause/settings.
- [ ] audio controls.
- [ ] shake option.
- [ ] readable phone typography.

## Save acceptance matrix

- [ ] Greyhaven refresh/reopen.
- [ ] enemy defeat refresh.
- [ ] awakening refresh.
- [ ] Resonance discovery refresh.
- [ ] Archive mid-progress refresh.
- [ ] puzzle solve refresh.
- [ ] Tether acquisition refresh.
- [ ] pre-Archivist refresh.
- [ ] post-Archivist refresh.
- [ ] corrupted data fallback.
- [ ] schema mismatch migration behavior before public save promises.

## Stability acceptance

- [ ] 30-minute session.
- [ ] repeated transitions.
- [ ] repeated boss retries.
- [ ] effect/particle stress.
- [ ] no runaway arrays/timers.
- [ ] touch interruption recovery.
- [ ] controller reconnect.

## Owner-device matrix

### iPhone

- [x] static-host launch demonstrated.
- [x] touch movement demonstrated.
- [x] Forgotten Relic Chamber reached.
- [~] combat/save build demonstrated; full behavior still needs explicit confirmation.
- [ ] portrait letterbox fix confirmation on v0.1.3.
- [ ] Resonance touch action.
- [ ] save/reload persistence.
- [ ] dialogue.
- [ ] dungeon.
- [ ] boss.

### iPad

- [ ] launch.
- [ ] movement.
- [ ] attack.
- [ ] Resonance.
- [ ] dialogue.
- [ ] save/reload.
- [ ] dungeon.
- [ ] boss.

### Desktop

- [ ] keyboard full route.
- [ ] resize behavior.
- [ ] full slice playthrough.

### Controller

- [ ] movement.
- [ ] attack.
- [ ] Resonance.
- [ ] Tether.
- [ ] dialogue.
- [ ] menus/pause.

# FIRST MAJOR PRODUCTION GATE

The vertical slice is approved only when:

- the complete route is playable,
- movement feels good,
- combat feels good,
- Resonance is useful and selective,
- Tether is understandable,
- puzzles do not soft-lock,
- saves are reliable,
- boss retries are fair,
- mobile is comfortable,
- visual/audio identity is recognizable,
- `WELCOME BACK.` creates curiosity,
- architecture can scale without major rewrites.

---

# PHASE 5 — FULL GAME SYSTEM EXPANSION

**Status:** HOLD UNTIL VERTICAL SLICE GATE.

## Axiom progression direction

1. Resonance — established and playable v1.
2. Tether — established design target.
3. Impulse — concept.
4. Phase — concept.
5. Shatter — concept.
6. restoration-oriented late-game ability — concept only.

Each ability must earn its place through traversal, puzzle, combat/tactical, backtracking, story, visual/audio, and device value.

## Shardblade progression

- [ ] upgrade philosophy.
- [ ] visible reconstruction stages.
- [ ] damage/moveset/utility role.
- [ ] Relic Shard/component relationship.

## Focused inventory/equipment

Potential categories only after slice approval:

- key relics,
- recovery items,
- limited equipment modifiers,
- quest items,
- map/lore artifacts.

Avoid turning VEILBOUND into inventory management for its own sake.

## Quest system

- [ ] main quest states.
- [ ] Greyhaven side quests.
- [ ] NPC chains.
- [ ] persistent dialogue changes.
- [ ] rewards and world consequences.

## Map system

Generate from authored room connectivity/discovery:

- discovered rooms,
- unresolved POIs,
- known ability gates,
- shortcuts,
- important NPCs where useful.

The map supports memory; it does not solve puzzles.

## Greyhaven evolution

After major milestones, consider:

- repaired structures,
- workshop growth,
- new residents/travelers,
- changed dialogue,
- market changes,
- Old Lift activation,
- side quests,
- visible Vein activity.

---

# PHASE 6 — WORLD & DUNGEON PRODUCTION

**Status:** DIRECTIONAL ONLY.

Do not invent regions merely to fill a biome checklist.

Every region requires:

- distinct visual materials,
- distinct traversal identity,
- distinct sonic identity,
- major landmark,
- NPC/world story,
- ability-gated return path,
- secrets/optional content,
- links to established world systems.

Every major dungeon requires:

- clear gameplay thesis,
- new or expanded mechanic,
- Teach → Test → Combine → Twist → Master,
- shortcuts,
- persistence,
- optional discovery,
- boss-mechanic integration,
- story relevance.

---

# PHASE 7 — ALPHA

Alpha means feature-complete main progression with unfinished polish allowed.

- [ ] full main story playable.
- [ ] required Axiom abilities.
- [ ] major dungeons.
- [ ] major bosses.
- [ ] side-quest architecture.
- [ ] Greyhaven evolution.
- [ ] save migrations.
- [ ] map progression.
- [ ] no known main-story blocker.
- [ ] full game completable on supported device classes.

---

# PHASE 8 — BETA / CONTENT LOCK

Priorities:

- balance,
- pacing,
- bug fixing,
- accessibility,
- device performance,
- save reliability,
- audio mix,
- visual consistency,
- dialogue cleanup,
- hint tuning,
- boss tuning,
- progression clarity.

Rules:

- no casual large-system additions,
- no unnecessary major story rewrites,
- prioritize confusion/frustration reports,
- soft-lock/save bugs are immediate priority.

---

# PHASE 9 — RELEASE CANDIDATE / 1.0

- [ ] full game phone completion.
- [ ] full game tablet completion.
- [ ] full game desktop completion.
- [ ] full game controller completion.
- [ ] promised save migrations.
- [ ] no known progression soft-lock.
- [ ] no known save-corruption path.
- [ ] no repeatable normal-play crash/freeze.
- [ ] worst-case boss/effects performance stable.
- [ ] credits complete.
- [ ] release metadata correct.
- [ ] clean-checkout deployment verified.
- [ ] static hosting verified.

---

# 6. DEPARTMENT ROADMAP

## ORACLE — Planning

Immediate:

- [x] master roadmap.
- [x] progress log.
- [x] truthful milestone update rule.
- [ ] dedicated acceptance checklist.
- [ ] formal release-note convention.

Long-term: sequencing, dependencies, scope, version targets, release gates, documentation audits.

## FORGE — Technical

Immediate:

- [x] runtime.
- [x] input.
- [x] collision.
- [x] transitions.
- [x] Save V1.
- [x] melee combat foundation.
- [x] Resonance v1.
- [x] portrait flash clipping.
- [ ] second enemy/projectile or area-control foundation.
- [ ] NPC interaction cleanup.
- [x] debug overlay.
- [ ] event bus.
- [ ] dungeon object primitives.

Before slice completion:

- [ ] Tether.
- [ ] boss-phase framework.
- [ ] deterministic checkpoint/retry.
- [ ] cutscene viewed-state.
- [ ] settings persistence.
- [ ] save migrations.
- [~] performance diagnostics.

## WRAITH — Visuals

Immediate:

- [ ] Kael gameplay sprite spec.
- [ ] Shardblade authored attacks.
- [ ] Greyhaven authored pass.
- [ ] Hollow March authored pass.
- [ ] first enemies.
- [~] Resonance pulse language prototype exists.
- [ ] Resonance final visual language.

Vertical slice:

- [ ] Archive kit.
- [ ] Tether language.
- [ ] Archivist concept/production art.
- [ ] UI/HUD pass.
- [ ] cinematic lighting states.

## ECHO — Audio

Immediate:

- [ ] Greyhaven identity.
- [ ] Hollow March identity.
- [ ] Shardblade SFX.
- [ ] Axiom awakening identity.
- [ ] Resonance signature.

Vertical slice:

- [ ] Tether sound.
- [ ] Archive score.
- [ ] Archivist adaptive phases.
- [ ] reveal cue.
- [ ] UI sound.

## SCRIBE — Story

Immediate:

- [ ] opening motivation.
- [ ] Greyhaven NPC identities.
- [ ] dialogue voices.
- [x] awakening beat.
- [ ] private Story Bible.

Before Archivist completion:

- [ ] exact reason for recognition.
- [ ] Axiom lineage meaning.
- [ ] Axiom/Vein relationship.
- [ ] public vs true Silence history.
- [ ] Archivist's actual knowledge.

## ARCHITECT — Puzzle/dungeon

Immediate:

- [x] first Resonance discovery prototype.
- [ ] interactive Resonance mechanism.
- [ ] first switch.
- [ ] first push object.
- [ ] Archive room graph.
- [ ] shortcut plan.

Vertical slice:

- [ ] Tether teaching chain.
- [ ] optional Tether secret.
- [ ] boss-mechanic teaching audit.
- [ ] soft-lock audit.

## SPECTER — Cinematics

Immediate:

- [~] awakening first pass.
- [x] portrait flash behavior corrected in engine.
- [ ] final awakening camera/blocking.
- [ ] title/start transition.

Vertical slice:

- [ ] Archive reveal.
- [ ] Tether acquisition.
- [ ] Archivist introduction.
- [ ] boss phase transitions.
- [ ] `WELCOME BACK.` reveal.
- [ ] retry-aware cinematic behavior.

---

# 7. CURRENT EXACT DEVELOPMENT ORDER

This is the authoritative immediate sequence from `v0.1.3-resonance`.

## NEXT 1 — owner-device acceptance v0.1.3

On iPhone:

- [ ] confirm cyan portrait letterbox contamination is gone.
- [ ] confirm Shardblade still works.
- [ ] confirm `◇` appears after awakening.
- [ ] confirm Resonance pulse works.
- [ ] confirm Hollow March Field 2 buried Vein route reveals.
- [ ] refresh/reopen and confirm route remains revealed.
- [ ] confirm chamber/position/health state survives refresh as expected.
- [ ] confirm awakening does not replay after persisted completion.

## NEXT 2 — second enemy archetype

- [ ] ranged or area-control behavior.
- [ ] readable windup/telegraph.
- [ ] projectile/hazard technical primitive if selected.
- [ ] hit response.
- [ ] persistent defeat.
- [ ] touch-screen readability.

## NEXT 3 — Greyhaven interaction layer

- [ ] interaction action/targeting.
- [ ] NPC dialogue primitive.
- [ ] first named NPCs.
- [ ] first save/rest point.
- [ ] opening motivation.
- [ ] post-Axiom reaction flag/dialogue.

## NEXT 4 — Sunken Archive entrance

- [ ] turn Resonance clue into world progression.
- [ ] entrance area.
- [ ] location reveal.
- [ ] persistent Archive-entered flag.
- [ ] first dungeon checkpoint.

## NEXT 5 — puzzle primitives

- [ ] switch.
- [ ] persistent door.
- [ ] push/manipulation object.
- [ ] interactive Resonance mechanism.

## NEXT 6 — Tether

- [ ] target system.
- [ ] traversal.
- [ ] object manipulation.
- [ ] combat use.
- [ ] six-stage teaching chain.

## NEXT 7 — Archivist framework

- [ ] boss state machine.
- [ ] phase transitions.
- [ ] checkpoint/retry.
- [ ] arena state changes.
- [ ] Tether/core interaction.

## NEXT 8 — vertical-slice presentation and acceptance

- [ ] authored art.
- [ ] audio.
- [ ] cinematics.
- [ ] UI.
- [ ] device polish.
- [ ] full acceptance matrix.

---

# 8. EXPLICITLY DEFERRED

Until the vertical slice passes its major gate:

- [HOLD] cloud accounts.
- [HOLD] multiplayer.
- [HOLD] leaderboards.
- [HOLD] large crafting system.
- [HOLD] huge inventory.
- [HOLD] procedural world generation.
- [HOLD] dozens of enemies/weapons.
- [HOLD] large skill trees.
- [HOLD] monetization.
- [HOLD] extensive achievements.
- [HOLD] full soundtrack production.
- [HOLD] final late-game-region art.
- [HOLD] large cloud-save infrastructure.
- [HOLD] unrelated side systems that do not improve the vertical slice.

---

# 9. DEFINITION OF DONE

A feature is not done merely because code exists.

Where applicable, it must:

- work in normal play,
- avoid progression blockers,
- persist correctly,
- survive room reload,
- survive save reload,
- support touch,
- support keyboard,
- support controller,
- have readable visual feedback,
- expose audio hooks,
- remain performant,
- update architecture/canon docs when contracts change,
- update roadmap/progress trackers truthfully,
- pass owner-device acceptance when device-critical.

---

# 10. CHANGE CONTROL

Canon changes → update `docs/CANON.md`.  
Architecture changes → update `docs/ARCHITECTURE.md`.  
Agent ownership changes → update `AGENTS.md`.  
Vertical-slice requirement/status changes → update `docs/VERTICAL_SLICE.md`.  
Meaningful implementation milestone → append/update `docs/PROGRESS.md`.  
Phase/current-version/priority changes → update `ROADMAP.md`.

---

# 11. THE VEILBOUND PROMISE

Development repeatedly returns to:

> Does this make VEILBOUND feel more like an atmospheric, mysterious, responsive adventure where exploration, ancient mechanisms, combat, puzzles, music, visuals, and story all belong to the same world?

If not, it probably does not belong in the current build.

The mission is not to build the largest possible game first.

The mission is to make **Greyhaven → Hollow March → Axiom Awakening → Resonance → Sunken Archive → Tether → The Archivist → WELCOME BACK.** so coherent, satisfying, mysterious, and technically stable that the rest of Eidol has a foundation worth expanding.
