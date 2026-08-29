# VEILBOUND — MASTER PRODUCTION ROADMAP

**Document owner:** ORACLE — Game Director & Planning  
**Repository:** `OuterHeavenX/VEILBOUND`  
**Current development branch:** `feature/vertical-slice-foundation`  
**Current playable version:** `v0.1.2-combat`  
**Roadmap status:** ACTIVE  
**Last roadmap baseline:** 2026-08-29

---

# 0. PURPOSE OF THIS DOCUMENT

This is the master production roadmap for VEILBOUND.

When there is uncertainty about what should be built next, every development agent should read this file first, then consult:

- `AGENTS.md` — who owns each discipline.
- `docs/CANON.md` — what is established story/world canon.
- `docs/ARCHITECTURE.md` — technical contracts and system boundaries.
- `docs/VERTICAL_SLICE.md` — requirements for the first complete playable slice.

This roadmap answers four questions:

1. **What are we building?**
2. **What are we building right now?**
3. **What has to be proven before we expand?**
4. **What are we deliberately not building yet?**

This is a living production document. It should be updated whenever a milestone is completed, scope meaningfully changes, or a new phase is formally approved.

---

# 1. PRODUCT VISION

VEILBOUND is an original top-down browser action-adventure RPG set in **Eidol**, a melancholy post-collapse world built over the remains of an ancient underground system known as **The Vein**.

The player controls **Kael**, a masked relic hunter carrying a damaged relic weapon called the **Shardblade** and an ancient mechanical gauntlet known as **The Axiom**.

The game should combine:

- deliberate top-down exploration,
- responsive melee combat,
- puzzle-driven dungeons,
- meaningful ability-based backtracking,
- compact cinematic storytelling,
- strong environmental identity,
- evolving towns and NPCs,
- mysterious ancient machinery,
- persistent world-state changes,
- mobile / tablet / desktop / controller play from one codebase.

The first major emotional and gameplay promise is:

> Explore a forgotten world, awaken something ancient, learn to use powers that alter traversal, puzzles, and combat, then discover that the ancient systems recognize Kael in ways they should not.

---

# 2. NON-NEGOTIABLE PRODUCTION RULES

These rules apply to every phase.

## 2.1 Zero-setup launch contract

`index.html` remains the canonical launch point.

A player or tester should be able to launch the game without installing npm packages, running a bundler, or configuring a local development environment.

Additional tooling may be introduced later, but the shipped browser build must remain static-host friendly and immediately playable.

## 2.2 One codebase, first-class devices

The same game must support:

- iPhone,
- iPad,
- Android phone/tablet,
- desktop browser,
- keyboard,
- touch,
- controller/gamepad.

Mobile is not a later port.

## 2.3 Vertical slice before scale

The full game does not expand aggressively until the first complete slice from Greyhaven through The Archivist is excellent.

Room count is not progress by itself.

## 2.4 New abilities must matter in multiple systems

Whenever practical, an Axiom ability should affect at least two of:

- traversal,
- puzzles,
- combat,
- secrets,
- environmental interaction,
- story presentation.

## 2.5 Backtracking must create discovery

Returning to earlier spaces should reveal:

- new routes,
- secrets,
- shortcuts,
- NPC changes,
- optional fights,
- lore,
- treasure,
- altered world state.

Backtracking should not exist simply to increase playtime.

## 2.6 Persistent state must be explicit

Anything that matters after leaving a room must use authored persistent IDs and be represented in Save Schema state.

Examples:

- awakened Axiom,
- opened chest,
- solved puzzle,
- defeated boss,
- unlocked shortcut,
- activated transit mechanism,
- completed quest stage.

## 2.7 Major mysteries require real answers

SCRIBE must privately define the actual explanation behind major mysteries before the story reaches their payoff.

The central example is why The Archivist says:

**WELCOME BACK.**

## 2.8 Cutscenes must respect the player

Cinematics should be short, intentional, and replay-aware.

Major boss intros should not become mandatory long repeats after death.

## 2.9 Visual identity must remain original

VEILBOUND may learn structural lessons from classic action-adventure games, but may not reproduce proprietary art, maps, characters, code, music, or distinctive copyrighted content from another game.

---

# 3. STATUS LEGEND

- `[x]` Implemented in the current development branch.
- `[~]` Partially implemented / prototype quality / requires acceptance.
- `[ ]` Not yet implemented.
- `[HOLD]` Intentionally deferred.
- `[GATE]` Must pass before the next major production phase begins.

---

# 4. CURRENT STATE — v0.1.2-combat

The following is already implemented on the current development branch.

## Foundation

- [x] Repository initialized.
- [x] `AGENTS.md` studio responsibility handbook.
- [x] `docs/CANON.md` canon foundation.
- [x] `docs/ARCHITECTURE.md` technical architecture contract.
- [x] `docs/VERTICAL_SLICE.md` first playable slice definition.
- [x] Zero-build `index.html` launch shell.
- [x] Mobile-safe responsive canvas.
- [x] Visible runtime version.
- [x] Fatal startup error screen.

## Runtime

- [x] Canvas game loop.
- [x] Keyboard movement.
- [x] Touch virtual joystick.
- [x] Controller analog movement.
- [x] Four-direction facing.
- [x] Authored room collision.
- [x] Room transitions.
- [x] Greyhaven prototype room.
- [x] Hollow March Field 1 prototype.
- [x] Hollow March Field 2 prototype.

## Combat

- [x] Shardblade attack input.
- [x] Initial directional melee hit overlap.
- [x] Enemy health.
- [x] Enemy hurt response.
- [x] Knockback.
- [x] Player health.
- [x] Player damage.
- [x] Invulnerability frames.
- [x] Basic hit particles / flashes.
- [x] First melee enemy behavior.

## Persistence

- [x] Save Schema V1 foundation.
- [x] Local persistent save data.
- [x] Save/load validation foundation.
- [x] Room-transition autosaving.
- [x] Stable enemy IDs.
- [x] Defeated-enemy persistence.
- [x] Axiom-awakening world flag.
- [x] Ability list persisted.

## Story / World

- [x] Forgotten Relic Chamber prototype.
- [x] First Axiom awakening sequence.
- [x] `RESONANCE DETECTED` presentation.
- [x] `BOUND USER CONFIRMED` presentation.
- [x] Resonance ability grant persisted.

## Still unverified

- [ ] iPhone acceptance after v0.1.2 combat/save changes.
- [ ] iPad acceptance after v0.1.2 combat/save changes.
- [ ] controller attack acceptance.
- [ ] save/reload acceptance across multiple room transitions.
- [ ] long-session stability.

---

# 5. MASTER PHASE MAP

The planned production sequence is:

```text
PHASE 0 — FOUNDATION
        |
PHASE 1 — OPENING GAMEPLAY LOOP
        |
PHASE 2 — SUNKEN ARCHIVE DUNGEON
        |
PHASE 3 — THE ARCHIVIST BOSS + REVEAL
        |
PHASE 4 — VERTICAL SLICE POLISH / ACCEPTANCE
        |
        +----> FIRST MAJOR PRODUCTION GATE
        |
PHASE 5 — FULL GAME SYSTEM EXPANSION
        |
PHASE 6 — WORLD / DUNGEON PRODUCTION
        |
PHASE 7 — ALPHA COMPLETION
        |
PHASE 8 — BETA / CONTENT LOCK
        |
PHASE 9 — RELEASE CANDIDATE / 1.0
```

Phases 0–4 are the current committed production target.

Phases 5–9 are directional planning and should remain flexible until the vertical slice proves the architecture and game identity.

---

# PHASE 0 — FOUNDATION

**Goal:** Establish a stable development structure before content scale-up.

**Status:** MOSTLY COMPLETE

## ORACLE

- [x] Define prime directive.
- [x] Establish agent ownership.
- [x] Establish canon change rules.
- [x] Define vertical-slice scope.
- [x] Create master roadmap.
- [ ] Establish formal versioning/release notes convention.
- [ ] Establish device acceptance checklist file.

## FORGE

- [x] Zero-build launch.
- [x] Game loop.
- [x] Basic input normalization.
- [x] Room system prototype.
- [x] Collision prototype.
- [x] Save Schema V1.
- [ ] Event bus / presentation hook layer.
- [ ] Debug overlay.
- [ ] Runtime diagnostics.
- [ ] Explicit development-mode toggle.
- [ ] Save migration registry.

## Production gate

- [GATE] `index.html` launches cleanly from static hosting.
- [GATE] No startup dependency on a build server.
- [GATE] Runtime failures surface visibly rather than silently blank-screening.

---

# PHASE 1 — OPENING GAMEPLAY LOOP

**Target:** Approximately the first 5–15 minutes of VEILBOUND.  
**Current focus:** ACTIVE

The player should be able to launch the game and experience a coherent opening path from Greyhaven to the Axiom awakening.

## 1.1 Title / boot experience — SPECTER + WRAITH + ECHO + FORGE

- [~] VEILBOUND boot identity.
- [ ] Proper title screen.
- [ ] New Game / Continue logic.
- [ ] Settings entry.
- [ ] Version display.
- [ ] Minimal input legend appropriate to device.
- [ ] Title ambience/music identity.
- [ ] Resume-safe flow when a save exists.

### Acceptance

- Continue never appears when no valid save exists.
- New Game clearly warns before overwriting an existing save.
- Touch and controller navigation work without keyboard dependency.

## 1.2 Greyhaven — WRAITH + SCRIBE + ARCHITECT + FORGE

Greyhaven is the emotional home base of the early game.

### Required locations for the first production pass

- [~] Main Greyhaven exterior layout.
- [ ] Wayfarer’s Rest.
- [ ] Relic Workshop.
- [ ] Market Row.
- [ ] Old Lift Station exterior.
- [ ] Archivist’s House exterior/interior as needed.
- [ ] Bell Tower landmark.

### NPC layer

- [ ] Innkeeper / Wayfarer’s Rest NPC.
- [ ] Relic Workshop NPC.
- [ ] Archivist / researcher NPC.
- [ ] One ordinary resident establishing tone.
- [ ] One optional side-story NPC.

### Greyhaven gameplay purpose

- [ ] Introduce Kael as a relic hunter.
- [ ] Establish that ancient machinery is common but poorly understood.
- [ ] Give the player a reason to leave town.
- [ ] Establish one locked/inactive ancient mechanism for later backtracking.
- [ ] Provide first save/rest point.
- [ ] Establish at least one future upgrade/service location.

### Greyhaven evolution hooks

Create persistent flags from the beginning for later town changes:

- [ ] `greyhaven.axiom_awakened_reaction`
- [ ] `greyhaven.archive_opened`
- [ ] `greyhaven.archivist_defeated_reaction`
- [ ] service unlock flags
- [ ] NPC quest stage flags

## 1.3 Hollow March traversal — ARCHITECT + WRAITH + ECHO

### Field 1

- [~] Traversable prototype.
- [~] Collision geometry.
- [x] First melee enemy.
- [ ] Readable landmark guiding player toward Field 2.
- [ ] Optional side route.
- [ ] First collectible/chest.
- [ ] Ambient wildlife/environment motion.
- [ ] Hollow March soundscape.

### Field 2

- [~] Traversable prototype.
- [~] Collision geometry.
- [ ] Second combat teaching situation.
- [ ] First ranged or area-control enemy.
- [ ] Visible future Tether anchor that is initially unreachable.
- [ ] Optional lore object.
- [ ] Route into Forgotten Relic Chamber.
- [ ] Later route toward Sunken Archive entrance.

### Combat progression

The early overworld should teach:

1. move,
2. face threat,
3. attack,
4. avoid contact damage,
5. recognize invulnerability/recovery,
6. understand one enemy telegraph,
7. encounter a second enemy requiring different spacing.

## 1.4 Shardblade combat foundation — FORGE + WRAITH + ECHO

- [x] Basic attack.
- [x] Directional hit overlap.
- [x] Enemy health.
- [x] Knockback.
- [x] Player hurt / i-frames.
- [~] Attack visual arc placeholder.
- [ ] Proper attack anticipation/contact/recovery timing.
- [ ] Bounded hit pause.
- [ ] Weapon trail.
- [ ] Impact audio.
- [ ] Distinct enemy-hit vs environment-hit feedback.
- [ ] Death / defeat presentation.
- [ ] Better enemy contact telegraphing.
- [ ] Combat controller acceptance.

### Combat feel gate

Combat should not progress into large enemy rosters until one basic enemy feels satisfying to hit and avoid.

## 1.5 Forgotten Relic Chamber — SCRIBE + SPECTER + WRAITH + FORGE

- [x] Chamber exists.
- [x] Awakening trigger.
- [x] First dialogue/cinematic sequence.
- [x] Axiom awakening persistent flag.
- [x] Resonance granted.
- [ ] Improved chamber visual composition.
- [ ] Camera staging.
- [ ] Environmental lighting reaction.
- [ ] Vein activation visual pulse.
- [ ] Axiom-specific sound design.
- [ ] Music/silence cue.
- [ ] Skip/replay behavior if revisited.

### Canon beats that must remain

- `RESONANCE DETECTED`
- `BOUND USER CONFIRMED`
- Kael realizes the system is responding specifically to him.
- The Vein begins waking across Eidol.

## 1.6 Resonance — FORGE + ARCHITECT + WRAITH + ECHO

Resonance must not become a generic “detective vision” overlay.

### Required first implementation

- [ ] Resonance input action.
- [ ] Short activation pulse.
- [ ] Nearby compatible ancient objects respond.
- [ ] Hidden circuitry appears selectively.
- [ ] One concealed route/mechanism becomes visible.
- [ ] One enemy vulnerability can be exposed later.
- [ ] Clear cooldown/usage behavior if a limiter is needed.
- [ ] Mobile Axiom control that does not interfere with Shardblade attack.

### First Resonance teaching sequence

- [ ] Introduce one obvious reactive object.
- [ ] Let player activate it safely.
- [ ] Immediately reward understanding.
- [ ] Use Resonance to reveal the route toward the Sunken Archive.

## PHASE 1 EXIT GATE

Before entering full dungeon production:

- [ ] Opening flow works from New Game.
- [ ] Continue reloads correctly.
- [ ] Greyhaven has at least basic NPC interaction.
- [ ] Shardblade combat feels responsive.
- [ ] Melee and ranged/area-control enemies both work.
- [ ] Axiom awakening is cinematic and persistent.
- [ ] Resonance is playable and understandable.
- [ ] iPhone acceptance passed.
- [ ] iPad acceptance passed.
- [ ] desktop acceptance passed.
- [ ] controller acceptance passed.

---

# PHASE 2 — THE SUNKEN ARCHIVE

**Goal:** Build the first complete VEILBOUND dungeon and prove the dungeon design language.

The Sunken Archive is partially flooded and should feel ancient, monumental, quiet, and mechanically alive.

## 2.1 Dungeon identity — WRAITH + ECHO

### Visual language

- [ ] monumental stone halls,
- [ ] turquoise flooded chambers,
- [ ] rotating archive rings/cylinders,
- [ ] luminous submerged script,
- [ ] hanging roots,
- [ ] broken bridges,
- [ ] corroded metal integrated into stone,
- [ ] ancient doors that feel engineered rather than magical.

### Sonic language

- [ ] dripping water ambience,
- [ ] enormous distant machinery,
- [ ] low Vein resonance,
- [ ] subtle archive musical motif,
- [ ] stronger musical layer after Tether acquisition.

## 2.2 Archive entrance

- [ ] Entrance reveal/title presentation.
- [ ] Safe threshold room.
- [ ] Persistent dungeon-entered flag.
- [ ] Visible locked/blocked routes communicating future ability use.
- [ ] Shortcut architecture visible early where possible.

## 2.3 Dungeon teaching sequence — ARCHITECT

Room doctrine:

**Teach → Test → Combine → Twist → Master**

### Early rooms

- [ ] Movement + environmental reading.
- [ ] Basic switch/mechanism.
- [ ] Door state persistence.
- [ ] Push/manipulation object.
- [ ] Water-level or energy-routing introduction.
- [ ] Resonance reveal room.

### Mid-dungeon rooms

- [ ] Combined switch + enemy room.
- [ ] Water/environment hazard.
- [ ] Optional treasure route.
- [ ] First significant shortcut unlock.
- [ ] Tether acquisition chamber.

## 2.4 Tether acquisition — SPECTER + SCRIBE + WRAITH + ECHO + FORGE

Tether is the first major expansion of the Axiom.

### Acquisition beat

- [ ] Narratively justified ancient mechanism.
- [ ] Short cinematic activation.
- [ ] Distinct Axiom transformation/visual language.
- [ ] Signature Tether sound.
- [ ] Immediate safe use opportunity.

### Tether technical contract

- [ ] authored anchor targets,
- [ ] target selection,
- [ ] valid/invalid target feedback,
- [ ] traversal pull,
- [ ] object pull,
- [ ] machinery manipulation,
- [ ] combat interaction,
- [ ] mobile targeting behavior,
- [ ] controller targeting behavior.

## 2.5 Tether teaching progression — ARCHITECT

- [ ] Room 1: cross a gap.
- [ ] Room 2: pull an object.
- [ ] Room 3: combine object manipulation + traversal.
- [ ] Room 4: use Tether during combat.
- [ ] Room 5: manipulate moving machinery.
- [ ] Room 6: combine traversal + machinery + enemy pressure.

The boss should require skills already taught here rather than introducing an unexplained one-off interaction.

## 2.6 Archive secrets/backtracking

- [ ] Earlier blocked route becomes reachable after Tether.
- [ ] At least one optional lore chamber.
- [ ] At least one optional treasure.
- [ ] One meaningful shortcut.
- [ ] One route visually loops back to an earlier landmark.

## 2.7 Puzzle primitives to prove

- [ ] Switch.
- [ ] Persistent door.
- [ ] Push/manipulation block.
- [ ] Tether anchor.
- [ ] Rotating mechanism.
- [ ] Energy/water route state.
- [ ] Multi-room puzzle state if needed.

## PHASE 2 EXIT GATE

- [ ] Dungeon is completable from fresh save.
- [ ] Dungeon is completable after save/reload mid-progress.
- [ ] No puzzle can hard-lock progression.
- [ ] Tether teaching requires minimal text.
- [ ] Tether works on touch/controller/keyboard.
- [ ] Backtracking reveals at least one meaningful reward.
- [ ] Shortcuts reduce frustration.

---

# PHASE 3 — THE ARCHIVIST

**Goal:** Deliver the first major boss, validate multi-phase encounter architecture, and land the first major narrative mystery.

## 3.1 Boss identity — WRAITH

The Archivist should read as:

- massive,
- ancient,
- ceremonial,
- mechanical,
- dangerous,
- intelligent enough to feel purposeful.

Established concept anchors:

- stone guardian influence,
- spider-like segmented locomotion,
- six segmented limbs,
- rotating astronomical/mechanical ring structure,
- luminous central core.

## 3.2 Boss arena — ARCHITECT + WRAITH

- [ ] Circular/structured archive arena.
- [ ] Readable Tether anchors.
- [ ] Arena geometry supports phase changes.
- [ ] Flood/water state can change.
- [ ] Safe respawn/checkpoint point before encounter.
- [ ] No long dungeon replay after death.

## 3.3 Phase 1 — Leg joints

- [ ] Archivist enters in full lower-body configuration.
- [ ] Telegraph limb attacks.
- [ ] Player attacks leg joints.
- [ ] Successful joint damage exposes vulnerability windows.
- [ ] Core remains protected most of the time.
- [ ] Teach boss rhythm without overwhelming effects.

## 3.4 Phase 2 — Flooded arena

Trigger target: approximately 60% health, subject to playtesting.

- [ ] Arena partially floods.
- [ ] Safe ground becomes segmented.
- [ ] Tether anchors become required for movement.
- [ ] Archivist adds beam/line attacks.
- [ ] Music gains intensity/layer.
- [ ] Environment visually communicates escalation.

## 3.5 Phase 3 — Severed guardian

Trigger target: approximately 25% health, subject to playtesting.

- [ ] Archivist tears free from lower structure.
- [ ] Movement becomes faster.
- [ ] Core opens more aggressively.
- [ ] Arena begins collapsing/failing.
- [ ] Player can Tether toward exposed core.
- [ ] Final Shardblade punish window.
- [ ] Music transforms decisively.

## 3.6 Boss retry behavior — FORGE + SPECTER

- [ ] Checkpoint immediately before fight.
- [ ] Viewed intro flag.
- [ ] First attempt gets full cinematic.
- [ ] Retry gets reduced/skip-friendly version.
- [ ] Player health restored appropriately.
- [ ] Arena/boss state resets deterministically.
- [ ] No duplicate permanent rewards.

## 3.7 Post-boss cinematic — SCRIBE + SPECTER + ECHO

Established narrative sequence:

- `BOUND USER IDENTIFIED`
- `AXIOM LINEAGE...`
- `CONFIRMED`
- final recognition:
- **`WELCOME BACK.`**

Kael has never knowingly been there before.

### Required direction

- [ ] Quiet after combat.
- [ ] Strong pause before recognition.
- [ ] Minimal exposition.
- [ ] Kael’s confusion is readable.
- [ ] Music/silence supports the reveal.
- [ ] Persistent boss-defeated flag.
- [ ] Persistent reveal-viewed flag.

## PHASE 3 EXIT GATE

- [ ] Boss is readable without memorizing unfair patterns.
- [ ] Tether is meaningfully required.
- [ ] All phases reset safely after death.
- [ ] Retry flow is fast.
- [ ] Reveal lands clearly.
- [ ] Defeat/reward state persists correctly.

---

# PHASE 4 — VERTICAL SLICE POLISH & ACCEPTANCE

**Goal:** Turn the functional first slice into something we would confidently show to external testers.

**Planning target:** `v0.2.0-vertical-slice`

This is the first major production gate.

## 4.1 Full playable route

The player must be able to complete:

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
SUNKEN ARCHIVE ENTRANCE
  ↓
ARCHIVE TEACHING ROOMS
  ↓
TETHER ACQUISITION
  ↓
TETHER MASTERY
  ↓
THE ARCHIVIST
  ↓
WELCOME BACK.
  ↓
RETURN TO ALTERED GREYHAVEN / OVERWORLD
```

## 4.2 Visual polish — WRAITH

- [ ] Kael authored gameplay sprite.
- [ ] Directional idle/walk frames.
- [ ] Shardblade authored attack frames/effects.
- [ ] Axiom glow states.
- [ ] Melee enemy final slice art.
- [ ] Ranged/area-control enemy final slice art.
- [ ] Greyhaven coherent tiles/material set.
- [ ] Hollow March coherent tiles/material set.
- [ ] Sunken Archive coherent tiles/material set.
- [ ] Archivist production-quality slice art.
- [ ] UI/HUD visual pass.
- [ ] Location title treatments.

## 4.3 Audio polish — ECHO

- [ ] Title identity.
- [ ] Greyhaven ambience/theme.
- [ ] Hollow March ambience/theme.
- [ ] Sunken Archive theme.
- [ ] Combat layer/stinger system.
- [ ] Shardblade swing/hit sounds.
- [ ] Axiom Resonance sounds.
- [ ] Tether sounds.
- [ ] Archivist phase score.
- [ ] Post-boss reveal cue.
- [ ] Menu/UI audio.

## 4.4 Story polish — SCRIBE

- [ ] Greyhaven NPC dialogue pass.
- [ ] Opening motivation clear.
- [ ] Kael voice consistency.
- [ ] Environmental lore text restrained.
- [ ] Archive lore supports mystery without answering too much.
- [ ] Private Story Bible defines why Archivist recognizes Kael.
- [ ] Terminology consistency audit.

## 4.5 Cinematic polish — SPECTER

- [ ] Title/opening transition.
- [ ] Axiom awakening final slice staging.
- [ ] Archive reveal.
- [ ] Tether acquisition.
- [ ] Archivist entrance.
- [ ] Phase 2 transition.
- [ ] Phase 3 transition.
- [ ] `WELCOME BACK.` sequence.
- [ ] Retry/skipping acceptance.

## 4.6 UX / accessibility / device polish — FORGE + ORACLE

- [ ] Touch controls avoid covering gameplay-critical information.
- [ ] Safe-area behavior on notched devices.
- [ ] Landscape and portrait policy explicitly defined.
- [ ] Controller button mapping documented.
- [ ] Pause/settings menu.
- [ ] Audio volume controls.
- [ ] Screen shake toggle/intensity setting.
- [ ] Text speed option if dialogue requires it.
- [ ] Readable font sizing on phone.
- [ ] Input remapping plan evaluated.

## 4.7 Save acceptance

Test all of the following:

- [ ] save in Greyhaven,
- [ ] save after enemy defeat,
- [ ] save after awakening,
- [ ] save inside Archive,
- [ ] save after puzzle solve,
- [ ] save after Tether acquisition,
- [ ] save before Archivist,
- [ ] save after Archivist,
- [ ] reload after browser refresh,
- [ ] reload after tab close/reopen,
- [ ] corrupted save fails safely,
- [ ] schema mismatch does not destroy player state silently.

## 4.8 Stability acceptance

- [ ] 30-minute continuous play test.
- [ ] repeated room transition stress test.
- [ ] repeated boss retry test.
- [ ] particle/effects stress test.
- [ ] no runaway arrays/timers.
- [ ] touch input does not get stuck after interruptions.
- [ ] controller disconnect/reconnect behaves safely.

## 4.9 Owner-device acceptance

### iPhone

- [ ] Launch.
- [ ] Movement.
- [ ] Attack.
- [ ] Axiom actions.
- [ ] Dialogue.
- [ ] Menus.
- [ ] Dungeon.
- [ ] Boss.
- [ ] Save/reload.

### iPad

- [ ] Launch.
- [ ] Movement.
- [ ] Attack.
- [ ] Axiom actions.
- [ ] Dialogue.
- [ ] Menus.
- [ ] Dungeon.
- [ ] Boss.
- [ ] Save/reload.

### Desktop

- [ ] Keyboard.
- [ ] Mouse/menu interactions.
- [ ] Resize behavior.
- [ ] Full playthrough.

### Controller

- [ ] Movement.
- [ ] Attack.
- [ ] Resonance.
- [ ] Tether targeting.
- [ ] Dialogue advance.
- [ ] Menus.
- [ ] Pause.

# FIRST MAJOR PRODUCTION GATE

The vertical slice is approved only when:

- the complete route is playable,
- movement feels good,
- combat feels good,
- Resonance is useful,
- Tether is understandable,
- puzzles do not soft-lock,
- saves are reliable,
- boss retries are fair,
- mobile works comfortably,
- the game has a recognizable visual/audio identity,
- the final reveal creates curiosity,
- the architecture does not require rewrites to add more content.

Only then does VEILBOUND enter full-game production.

---

# PHASE 5 — FULL GAME SYSTEM EXPANSION

**Status:** PLANNED — DO NOT START LARGE-SCALE WORK UNTIL VERTICAL SLICE GATE PASSES.

This phase expands reusable systems rather than immediately creating dozens of rooms.

## 5.1 Axiom progression

Established/likely sequence:

1. Resonance — established.
2. Tether — established.
3. Impulse — planned concept.
4. Phase — planned concept.
5. Shatter — planned concept.
6. Restoration-oriented late-game ability — concept only.

Each future ability requires:

- narrative reason,
- traversal use,
- puzzle use,
- combat or tactical use where appropriate,
- new backtracking opportunities,
- authored visual/audio identity,
- mobile/controller acceptance.

No future ability is mechanically canon until ORACLE + SCRIBE + ARCHITECT + FORGE approve its final role.

## 5.2 Shardblade progression

- [ ] Define upgrade philosophy.
- [ ] Define visual reconstruction stages.
- [ ] Define whether upgrades alter damage, moveset, utility, or all three.
- [ ] Tie upgrades to Relic Shards/components rather than generic stat inflation where possible.
- [ ] Ensure upgrades visibly change the weapon.

## 5.3 Inventory/equipment

Keep focused.

Potential categories:

- key relics,
- healing/recovery items,
- limited equipment modifiers,
- quest items,
- map/lore artifacts.

Avoid turning VEILBOUND into inventory-management-heavy RPG unless playtesting demonstrates a clear benefit.

## 5.4 Quest system

- [ ] Main progression quest states.
- [ ] Greyhaven side quests.
- [ ] NPC quest chains.
- [ ] persistent dialogue changes.
- [ ] quest completion rewards.
- [ ] optional world-state consequences.

## 5.5 Map system

The map should be generated from authored room connectivity and discovery state.

- [ ] discovered rooms,
- [ ] unresolved points of interest,
- [ ] known ability gates,
- [ ] shortcuts,
- [ ] important NPCs where appropriate,
- [ ] dungeon progress readability.

The map should help memory without solving puzzles automatically.

## 5.6 Greyhaven evolution

After each major story milestone, Greyhaven should visibly or socially change.

Possible changes:

- repaired structures,
- new workshop capability,
- new residents/travelers,
- changed NPC dialogue,
- market inventory changes,
- Old Lift Station activation stages,
- new side quests,
- visible Vein activity.

---

# PHASE 6 — WORLD & DUNGEON PRODUCTION

**Status:** DIRECTIONAL ONLY.

The full world structure is intentionally not completely canonized yet.

Do not invent large numbers of named regions simply to fill a roadmap.

Future region design must follow this template.

## Every region requires

- distinct visual material language,
- distinct traversal identity,
- distinct music/ambience identity,
- one major landmark,
- meaningful NPC/world story,
- at least one ability-gated return path,
- secrets and optional content,
- one or more links back to previously understood world systems.

## Every major dungeon requires

- a clear gameplay thesis,
- one new or meaningfully expanded mechanic,
- Teach → Test → Combine → Twist → Master progression,
- shortcuts,
- persistent state,
- optional discovery,
- boss/mechanic integration,
- story relevance.

## World production rule

Do not make a region because “the game needs another biome.”

A region should exist because it adds a distinct gameplay, narrative, and emotional experience.

---

# PHASE 7 — ALPHA COMPLETION

**Planning target:** feature-complete game with unfinished polish allowed.

Alpha means all major required systems and progression content exist.

## Required alpha conditions

- [ ] Full main-story route playable.
- [ ] All required Axiom abilities implemented.
- [ ] All major dungeons completable.
- [ ] All major bosses functional.
- [ ] Core side-quest architecture functional.
- [ ] Greyhaven evolution implemented.
- [ ] Save migrations proven.
- [ ] Map progression functional.
- [ ] No known main-story blockers.
- [ ] All supported devices can complete the game.

Alpha does **not** require final polish on every asset.

---

# PHASE 8 — BETA / CONTENT LOCK

Beta begins when major gameplay content is present and scope stops expanding.

## Beta priorities

- balance,
- pacing,
- bug fixing,
- accessibility,
- device performance,
- save reliability,
- audio mix,
- visual consistency,
- dialogue cleanup,
- tutorial/hint tuning,
- boss tuning,
- progression clarity,
- achievement/statistics evaluation if desired.

## Beta rules

- Avoid introducing large new systems.
- Avoid major story rewrites unless a serious problem is discovered.
- Prioritize player confusion and frustration reports.
- Fix soft-locks and save bugs immediately.

---

# PHASE 9 — RELEASE CANDIDATE / 1.0

Release Candidate begins when no known critical blocker remains.

## 1.0 requirements

- [ ] Full game completable on phone.
- [ ] Full game completable on tablet.
- [ ] Full game completable on desktop.
- [ ] Full game completable with controller.
- [ ] Save migration from supported prerelease versions works where promised.
- [ ] No known progression soft-lock.
- [ ] No known save corruption path.
- [ ] No repeatable crash/freeze in normal play.
- [ ] Performance stable in worst-case boss/effect scenes.
- [ ] Credits complete.
- [ ] Version/release metadata correct.
- [ ] Deployment build verified from clean checkout.
- [ ] Static hosting launch verified.

---

# 6. SYSTEM ROADMAP BY DEPARTMENT

# ORACLE — Planning / Direction

## Immediate

- [x] Master roadmap.
- [ ] Maintain roadmap status after every meaningful milestone.
- [ ] Add release/change log convention.
- [ ] Add device acceptance checklist.

## Long-term

- milestone sequencing,
- dependency management,
- scope protection,
- version targets,
- release gates,
- production documentation audits.

---

# FORGE — Technical Direction

## Immediate

- [x] runtime loop,
- [x] input,
- [x] collision,
- [x] room transitions,
- [x] save foundation,
- [x] melee combat foundation,
- [ ] debug overlay,
- [ ] event bus,
- [ ] ranged/projectile system,
- [ ] dialogue/interact system cleanup,
- [ ] Resonance system,
- [ ] dungeon object primitives.

## Before vertical slice completion

- [ ] Tether system,
- [ ] boss phase framework,
- [ ] deterministic checkpoint/retry,
- [ ] cutscene viewed-state system,
- [ ] settings persistence,
- [ ] save migrations,
- [ ] debug state inspection,
- [ ] performance instrumentation.

---

# WRAITH — Visual Direction

## Immediate

- [ ] Kael gameplay sprite specification,
- [ ] Shardblade attack animation,
- [ ] Greyhaven first authored visual pass,
- [ ] Hollow March first authored visual pass,
- [ ] first enemy authored silhouette,
- [ ] Resonance visual language.

## Vertical slice

- [ ] Sunken Archive kit,
- [ ] Tether visual language,
- [ ] Archivist production concept,
- [ ] UI/HUD art pass,
- [ ] cinematic lighting states.

---

# ECHO — Music / Audio

## Immediate

- [ ] Greyhaven ambience/music brief,
- [ ] Hollow March ambience/music brief,
- [ ] Shardblade SFX language,
- [ ] Axiom awakening sound identity.

## Vertical slice

- [ ] Resonance sound,
- [ ] Tether sound,
- [ ] Archive score,
- [ ] Archivist adaptive phases,
- [ ] reveal cue,
- [ ] menu/UI sound.

---

# SCRIBE — Story / Lore

## Immediate

- [ ] Opening motivation,
- [ ] Greyhaven NPC identities,
- [ ] initial dialogue voices,
- [x] Axiom awakening beat,
- [ ] private Story Bible foundation.

## Before Archivist production completes

- [ ] exact reason for Archivist recognizing Kael,
- [ ] Axiom lineage meaning,
- [ ] true relationship between Axiom and The Vein,
- [ ] public vs true history of The Silence,
- [ ] what the Archivist actually knows.

These answers may remain hidden from the player but must exist internally.

---

# ARCHITECT — Dungeon / Puzzle Design

## Immediate

- [ ] Resonance teaching encounter,
- [ ] first switch primitive,
- [ ] first push/manipulation puzzle,
- [ ] Sunken Archive room graph,
- [ ] shortcut plan.

## Vertical slice

- [ ] Tether teaching chain,
- [ ] optional Tether secret,
- [ ] boss mechanic teaching audit,
- [ ] puzzle soft-lock audit.

---

# SPECTER — Cutscenes / Cinematics

## Immediate

- [~] Axiom awakening first pass,
- [ ] final awakening camera/blocking pass,
- [ ] title/start transition.

## Vertical slice

- [ ] Archive entrance reveal,
- [ ] Tether acquisition,
- [ ] Archivist introduction,
- [ ] phase transitions,
- [ ] `WELCOME BACK.` reveal,
- [ ] retry-aware cinematic behavior.

---

# 7. FEATURE PRIORITY ORDER

When choosing work, use this priority order unless ORACLE explicitly changes it:

1. progression blockers / crashes / save corruption,
2. movement and input correctness,
3. room transitions and persistence,
4. combat feel,
5. required ability mechanics,
6. required puzzle mechanics,
7. boss systems,
8. story/cutscene integration,
9. authored visual/audio identity,
10. optional content,
11. meta systems,
12. polish that does not solve a known player problem.

---

# 8. NEXT DEVELOPMENT SEQUENCE — CURRENT EXACT ORDER

This is the current recommended implementation order from `v0.1.2-combat`.

## NEXT 1 — v0.1.2 owner-device validation

- [ ] Test attack button on iPhone.
- [ ] Confirm enemy hit detection.
- [ ] Confirm player damage/i-frames.
- [ ] Enter Forgotten Relic Chamber.
- [ ] Finish awakening sequence.
- [ ] Refresh page.
- [ ] Confirm awakened state persists.
- [ ] Confirm defeated enemies remain defeated.
- [ ] Confirm correct room/position reload.

## NEXT 2 — Resonance playable implementation

- [ ] Input mapping.
- [ ] visual pulse.
- [ ] reactive ancient object.
- [ ] hidden circuit/path reveal.
- [ ] persistent activated mechanism.
- [ ] mobile control layout.

## NEXT 3 — second enemy archetype

- [ ] ranged or area-control behavior.
- [ ] telegraph.
- [ ] projectile/hazard foundation.
- [ ] hit response.
- [ ] persistent defeat.

## NEXT 4 — Greyhaven interaction layer

- [ ] interaction action separate from attack/Axiom as needed.
- [ ] NPC dialogue primitive.
- [ ] first named NPCs.
- [ ] save/rest location.
- [ ] opening motivation.

## NEXT 5 — Sunken Archive entrance

- [ ] overworld gate revealed with Resonance.
- [ ] entrance room.
- [ ] location title/reveal.
- [ ] first dungeon save/checkpoint behavior.

## NEXT 6 — puzzle primitives

- [ ] switch.
- [ ] persistent door.
- [ ] push object.
- [ ] Resonance-authored reveal.

## NEXT 7 — Tether acquisition and teaching chain

- [ ] target system.
- [ ] traversal.
- [ ] object manipulation.
- [ ] combat interaction.
- [ ] six-step teaching progression.

## NEXT 8 — Archivist boss framework

- [ ] boss base state machine.
- [ ] phase transitions.
- [ ] checkpoint/retry.
- [ ] arena state changes.
- [ ] Tether/core interaction.

## NEXT 9 — vertical slice final presentation pass

- [ ] art,
- [ ] audio,
- [ ] cinematics,
- [ ] UI,
- [ ] device polish,
- [ ] full acceptance.

---

# 9. EXPLICITLY DEFERRED — DO NOT BUILD YET

Until the vertical slice passes its major gate, do not spend significant production time on:

- [HOLD] cloud accounts,
- [HOLD] online multiplayer,
- [HOLD] leaderboards,
- [HOLD] large crafting system,
- [HOLD] huge inventory,
- [HOLD] procedural world generation,
- [HOLD] dozens of enemies,
- [HOLD] dozens of weapons,
- [HOLD] large skill trees,
- [HOLD] monetization,
- [HOLD] extensive achievements,
- [HOLD] full soundtrack production,
- [HOLD] final art for unreached late-game regions,
- [HOLD] large-scale cloud save infrastructure,
- [HOLD] unrelated side systems that do not improve the vertical slice.

These may become appropriate later. They are not current priorities.

---

# 10. DEFINITION OF DONE FOR ANY FEATURE

A feature is not done merely because code exists.

A feature is considered complete only when applicable criteria are satisfied:

- works in normal gameplay,
- has no known progression blocker,
- persists correctly if required,
- works after room reload,
- works after save reload,
- has touch support,
- has keyboard support,
- has controller support where applicable,
- has readable visual feedback,
- has appropriate audio hooks,
- does not create obvious performance problems,
- is documented if it changes architecture/canon,
- tracker/roadmap status is updated truthfully.

---

# 11. CHANGE CONTROL

## Canon changes

Must be reflected in `docs/CANON.md` and reviewed against SCRIBE ownership.

## Technical architecture changes

Must be reflected in `docs/ARCHITECTURE.md` when they alter established system contracts.

## Agent ownership changes

Must be reflected in `AGENTS.md`.

## Roadmap changes

ORACLE should update this file whenever:

- phase order changes,
- a milestone is added/removed,
- a major feature is approved,
- scope is intentionally deferred,
- a major gate is passed,
- current version meaningfully advances.

---

# 12. THE VEILBOUND PROMISE

Development should repeatedly return to this question:

> Does this make VEILBOUND feel more like an atmospheric, mysterious, responsive adventure where exploration, ancient mechanisms, combat, puzzles, and story all belong to the same world?

If the answer is no, the feature probably does not belong in the current build.

The immediate mission is not to build the largest possible game.

The immediate mission is to make the path from **Greyhaven to The Archivist** so coherent, satisfying, mysterious, and technically stable that the rest of Eidol has a foundation worth expanding.
