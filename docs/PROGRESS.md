# VEILBOUND — Development Progress Log

This is the chronological implementation log for meaningful production milestones.

Use this file together with `ROADMAP.md`, `docs/VERTICAL_SLICE.md`, `docs/CANON.md`, `docs/ARCHITECTURE.md`, `docs/COMBAT.md`, and `AGENTS.md`. Do not mark owner-device acceptance complete until it has actually been tested.

---

## 2026-08-29 — v0.1.0 Foundation
- Initialized repository and `feature/vertical-slice-foundation`.
- Added agent handbook, canon, architecture, vertical-slice definition, and zero-build launch contract.

## 2026-08-29 — v0.1.1 Playable
- Added responsive Canvas 2D runtime, Greyhaven, Hollow March Fields 1–2, movement, collision, transitions, keyboard/touch/controller input, and prototype Kael.
- iPhone static-host launch and touch movement confirmed.

## 2026-08-29 — v0.1.2 Combat
- Added Shardblade melee, enemy/player damage, knockback, i-frames, hit feedback, Save V1, enemy persistence, Forgotten Relic Chamber, and Axiom awakening sequence.
- Owner device exposed portrait cinematic-flash contamination and dormant chamber save-state issue.

## 2026-08-29 — v0.1.3 Resonance — iPhone ACCEPTED
- Fixed portrait letterbox rendering.
- Added dedicated Resonance input/pulse, authored Resonance nodes, persistent discoveries, and page-hide/background autosave.
- Added targeted recovery for incomplete dormant-chamber saves.
- [x] Axiom awakening completes on iPhone.
- [x] Resonance unlock persists after refresh/reopen.
- [x] Chamber core memory response works.
- [x] Hollow March Field 2 buried Vein route discovery works and persists.
- [x] Shardblade and Resonance remain separate controls.
- [ ] Repeat equivalent acceptance on iPad later.

---

## 2026-08-29 — v0.1.4 Vein Sentry

### FORGE / ARCHITECT — ranged combat implementation
- Added data-driven EnemyRegistry consumption to the runtime.
- Added a live Vein Sentry state machine: Observe → Position → Telegraph → Fire → Recover.
- Added phone-readable amber charge ring and dashed aim-line telegraph.
- Added cyan energy projectiles with lifetime, wall collision, player collision, damage, i-frames, and knockback.
- Projectiles are cleared on room transitions and player recovery so attacks cannot leak across rooms.
- Added Resonance combat interaction: a Resonance pulse that reaches a Sentry during Telegraph interrupts the shot and enters a temporary Disrupted state.
- Added visible cyan disruption ring to communicate the successful interrupt window.
- Preserved Shardblade as the damage/finisher tool; Resonance disrupts rather than dealing direct enemy damage.
- Kept the authored mixed encounter in Hollow March Field 2: one March Husk plus one Vein Sentry.

### Owner-device acceptance — PENDING
- [ ] HUD displays `v0.1.4-sentry` after refresh.
- [ ] Vein Sentry visibly cycles into an amber telegraph before firing.
- [ ] Projectile is readable and dodgeable on iPhone landscape.
- [ ] Projectile contact removes one health diamond and applies knockback without repeated instant damage.
- [ ] Resonance during the amber telegraph cancels the shot and visibly disrupts the Sentry.
- [ ] Kael can close in and defeat the disrupted Sentry with the Shardblade.
- [ ] Defeated Sentry remains defeated after room transition/refresh because its stable enemy ID persists.
- [ ] No regression to Axiom/Resonance save state or portrait letterboxing.

---

## 2026-08-29 — Development diagnostics

### FORGE / ARCHITECT — debug overlay, runtime diagnostics, development-mode toggle
- Implemented the `docs/ARCHITECTURE.md` "Development Diagnostics" contract in full.
- Added a DOM diagnostics panel: FPS, average and peak frame time, room id, entry id,
  player position and facing, health/i-frame/attack timers, Resonance state and pulse
  radius, entity counts, current interactable target, per-enemy state with timers and
  distance, and active world flags.
- Added canvas debug shapes in world space: collision rects, exit rects, Resonance node
  radii, enemy hurtboxes, Vein Sentry engage/retreat ranges, projectile hitboxes, the
  player hurtbox, and the Shardblade arc.
- Added a development-mode toggle: `F3` or `` ` `` on keyboard, `?debug` in the URL for
  touch devices. The keyboard toggle persists in `settings.debugOverlay`; `?debug` forces
  the overlay on for one session without writing the setting.
- Extracted the melee reach, arc, active window, and husk aggro range into shared
  constants read by both the simulation and the overlay, so drawn boxes cannot drift.
- Added authored `entry` names to every room exit so the overlay can report a real entry
  id instead of a synthesized one.
- The overlay is off by default, is `pointer-events: none`, and does not run its text
  refresh or shape pass while disabled, so the shipping path is unchanged.
- Runtime version deliberately left at `v0.1.4-sentry`: this is development tooling with
  no gameplay surface, and the pending v0.1.4 owner-device acceptance checklist asserts
  that exact HUD string. ORACLE owns the call on folding it into a numbered build.

### Verification
- Chromium, 900×520: overlay hidden by default; `F3` and `` ` `` toggle it; the setting
  survives reload in both directions; `?debug` enables it without writing the setting.
- Entry id reports `west` after walking Greyhaven → Hollow March Field 1, and `restore`
  on a loaded save.
- Vein Sentry telegraph countdown, husk chase/idle, Resonance cooldown, pulse radius, and
  live attack/i-frame timers all read correctly during play.
- Combat regression: both Field 1 husks still die to the Shardblade and persist as
  defeated after the constant extraction. No console or page errors.

### Owner-device acceptance — PENDING
- [ ] `?debug` shows the diagnostics panel on iPhone without breaking touch controls.
- [ ] Panel stays legible and inside the safe area in landscape and portrait.
- [ ] Reported FPS on device matches perceived smoothness closely enough to be useful.

---

## 2026-08-29 — v0.1.5 Greyhaven

Next item in the production order after v0.1.4: the Greyhaven interaction/NPC dialogue
layer and the first save/rest point.

### ARCHITECT / FORGE — interaction system
- Added `src/data/interactables.js`: authored interaction content keyed by room id, every
  entry carrying a stable persistent id.
- Added target resolution, a contextual on-screen prompt, and a contextual action control.
  The action button and Space/Z/J resolve to `interact` when a target is in reach and fall
  back to the Shardblade otherwise, so touch keeps one action button.
- Added ordered dialogue variants gated on `flag` / `notFlag` / `ability`, so an NPC's lines
  change with world state instead of being fixed.
- Added post-dialogue effects: `set` writes world flags, `rest` restores health and saves.
- Solid interactables have collision bodies, so NPCs occupy space instead of being walked
  through.
- Save Schema V1 is unchanged. Everything new is a world flag, so existing saves load as-is.

### WRAITH / SCRIBE — Greyhaven authored
- Rebuilt the Greyhaven exterior from a three-box prototype into six named landmarks:
  Wayfarer's Rest, Relic Workshop, Market Row, Old Lift Station, Archivist's House, and the
  Bell Tower, each with its own silhouette, collision, and world-space label.
- Added five NPCs with distinct palettes and marks: MARETH (innkeeper), TOLL (workshop),
  ISEN (researcher), BRAY (resident), and WREN (side story).
- The dialogue establishes Kael as a relic hunter, shows ancient technology as common and
  poorly understood, and gives a concrete reason to leave town: ISEN names the sealed chamber
  east past the second field and asks for what is written on its walls.
- Every NPC has an awakened-Axiom variant, so returning to Greyhaven after the awakening is a
  visibly changed town. Archive-opened and Archivist-defeated variants are authored but not
  yet reachable, because nothing sets those flags yet.

### First save/rest point
- The Wayfarer's Rest hearth restores health to full and saves. It is repeatable, and its
  first use is acknowledged by MARETH.

### Backtracking hook
- The Old Lift Station is the authored inactive mechanism. Before the awakening Kael reads it
  as dead. After the awakening the Axiom reports `TRANSIT NODE — GREYHAVEN. STATUS: DORMANT`
  and `INSUFFICIENT AUTHORITY. RETURN WHEN THE ARCHIVE ANSWERS.`
- Greyhaven now has its own Resonance node on the lift station, so a returning player with
  Resonance has something to find in the starting town.

### Future upgrade/service hook
- TOLL offers to rebuild the Shardblade's fractured conductor in exchange for a whole one,
  setting `greyhaven.service.shardbladeRepairOffered`. No service is purchasable yet.

### Diagnostics
- The debug overlay's `TARGET` row now reports the real interactable target, which is what
  the architecture specified it for. The nearest Resonance node moved to its own `NODE` row.
- Debug shapes now draw interactable reach radii and solid NPC bodies.

### Verification
- Chromium, 960×560. All eight Greyhaven interactables show a prompt, play their first-meeting
  lines, and set their flags. Repeat, awakened, archive-opened, and archivist-defeated variants
  each resolve to the correct lines.
- Resting at 2 health restores to 6 and persists the save.
- Walking into MARETH stops the player at the edge of her collision body.
- A Resonance pulse at the lift station records `greyhaven.liftStationScanned` and persists it.
- Clear of any landmark the prompt hides, the button returns to the Shardblade glyph, and the
  attack fires normally.
- The east road still runs Greyhaven → Field 1 and back, reporting entry `west` and `east`.
- No console or page errors in any pass.

### Owner-device acceptance — PENDING
- [ ] HUD displays `v0.1.5-greyhaven` after refresh.
- [ ] The interact prompt is readable on iPhone and does not collide with the touch controls.
- [ ] The action button visibly changes between the Shardblade and the interact glyph.
- [ ] Tapping the action button next to an NPC starts dialogue instead of swinging.
- [ ] Resting at the hearth refills health and reports a save.
- [ ] Returning to Greyhaven after the awakening shows the changed dialogue.
- [ ] Landmark labels stay legible at phone scale in landscape and portrait.
- [ ] v0.1.4 Vein Sentry acceptance re-verified on this build, since the version string moved.

---

## 2026-08-30 — v0.1.6 Title

Pulled ahead of the Sunken Archive entrance. The Phase 1 exit gate requires the
title/New Game/Continue flow before full Archive production, and the NEXT sequence
never scheduled it. It also removes the need to clear browser storage by hand between
acceptance runs, which the pending device pass depends on.

### FORGE — title / boot lifecycle
- Gameplay updates and gameplay input are suspended until the title hands over. The
  runtime renders throughout, so the menu sits over a live still of the room the player
  would resume into.
- `CONTINUE` appears only for a resumable save, labelled with its room and health.
- `NEW GAME` over an existing save requires explicit confirmation before replacing it.
- `SETTINGS` is reachable before any save exists.
- The control hint is chosen from the active input: gamepad, coarse pointer, or keyboard,
  and updates when a controller connects.
- Added `src/ui/TitleScreen.js`, matching the `ui/` boundary in the architecture contract.

### FORGE — safe resume
- Added `SaveManager.inspect()`, which reports stored state without modifying it:
  `ready`, `empty`, `unreadable`, `incompatible`, or `unavailable`.
- A save that cannot be resumed is now reported on the title and left on disk. Previously
  `load()` silently replaced it with defaults, so a corrupt or older save was destroyed by
  the next autosave without the player ever being told.
- No autosave fires while the title is up. Without that guard, opening the game and closing
  the tab would manufacture a save the player never started, and offer `CONTINUE` next time.

### FORGE — settings persistence
- Device-level preferences moved out of the save into `veilbound.settings.v1`. They belong
  to the device rather than to a journey, so they survive erasing or replacing a save, and
  can be changed before any save exists.
- The diagnostics overlay toggle is the first such preference and is now settable without a
  keyboard, which it could not be on a phone before.
- Save Schema V1 is unchanged. The save's `settings` field stays reserved for per-journey
  settings and is simply no longer written to.

### Verification
- Chromium at 960×560 and at iPhone landscape/portrait.
- No save: no `CONTINUE`, and a hide event does not create one. `NEW GAME` starts at once.
- Valid save: `CONTINUE` shows `HOLLOW MARCH — FIELD 2    4/6 ◆` and resumes that room and health.
- `NEW GAME` over a save asks first; `CANCEL` leaves the save intact, `REPLACE` starts fresh.
- Corrupt bytes and a `version: 0` save each raise their own notice, keep `CONTINUE` hidden,
  and remain byte-for-byte on disk.
- Settings: toggling diagnostics writes only `veilbound.settings.v1`, creates no save, and the
  preference survives erasing the save. Erase asks first.
- Arrow keys and Resonance do not reach the world while the title is up. Space activates the
  focused menu button, which is intended menu behaviour and cannot destroy a save, because
  `CONTINUE` holds focus whenever a save exists.
- Gameplay regression after starting from the title: movement, interaction targeting, room
  transitions, and attack all unchanged. No console or page errors.

### Owner-device acceptance — PENDING
- [ ] HUD displays `v0.1.6-title` after refresh.
- [ ] Title screen fits and reads in both orientations.
- [ ] `CONTINUE` resumes the correct room and health.
- [ ] `NEW GAME` over an existing save asks before replacing it.
- [ ] Settings toggle for the diagnostics overlay works without a keyboard.
- [ ] Closing the tab on the title does not create a save.

---

## 2026-08-30 — v0.1.7 Title ambience

The last open item in section 1.1, and the project's first audio of any kind.

### ECHO / FORGE — procedural audio system
- Added `src/core/Audio.js`. Every voice is synthesised through Web Audio. VEILBOUND ships
  zero-build and file://-friendly, so there are no audio assets to fetch, and procedural
  synthesis also keeps the sound original by construction.
- The bed and the bell are built against whatever context they are handed, so the same
  synthesis serves live playback and `render()`, an offline audition of the mix.
- A pass-through analyser sits after the master gain, so real output level is observable in
  the diagnostics overlay and in tests rather than assumed.

### ECHO — the title bed
- Low Vein drone on A1/E2/C3, breathing on a slow LFO rather than holding flat.
- Wind texture: integrated noise through a drifting bandpass.
- The Greyhaven bell, struck every 7–16 seconds on an A minor pentatonic, built from
  inharmonic partials with per-partial decay so it reads as metal rather than a beep. The
  town's bell has no clapper in canon, so it is written as memory, not melody.
- Transitions fade. The bed rises over 2.6s and gives way to play over 1.1s.

### Mobile-first mix correction
- The first mix peaked at -20 dBFS and was almost entirely below 100 Hz. Phone speakers roll
  off hard down there, so on the device this project targets first it would have been close
  to silent. Raised the bed and added A3/E4 voices that bypass the drone's lowpass.
- Measured through a 450 Hz highpass approximating a phone speaker, 45% of full-range level
  now survives, against a small fraction before.

### Autoplay and lifecycle
- Browsers refuse audio before a user gesture, so nothing is created until a real
  interaction unlocks it. A player who never interacts with the title hears nothing, which
  is the platform rule rather than a defect.
- The unlock listener runs in the capture phase, and the bed is only raised 220ms later if
  play has not started. Tapping straight into the game therefore never blips a note.
- The context is suspended while the tab is hidden and resumed when it returns.
- Added an `AUDIO` toggle to the title settings, stored with the other device-level
  preferences outside the save.

### Verification
- Measured, not assumed: rendered output RMS and peak read back through the analyser.
- Nothing is created before a gesture; context is `none` on a fresh title.
- After a gesture the bed fades in to the configured gain and produces measurable output.
- Bell strikes peak 5.7 dB above the drone floor over a 20s window.
- Starting play fades the bed to silence and releases its nodes.
- Tapping the start button as the very first gesture never raises the bed.
- `AUDIO` off silences and persists, survives reload, and turning it back on resumes.
- Hiding the tab suspends the context; returning resumes it with output restored.
- Spectral check confirms energy at the designed frequencies, and rolloff above the
  drone's 340 Hz lowpass corner.
- Full v0.1.4, v0.1.5, and v0.1.6 regression passes unchanged. No console or page errors.

### Owner-device acceptance — PENDING
- [ ] HUD displays `v0.1.7-ambience` after refresh.
- [ ] Title ambience is audible on the phone speaker at a normal volume.
- [ ] Ambience starts after the first touch, and does not blip when tapping straight into play.
- [ ] The `AUDIO` setting silences it and is remembered.
- [ ] Backgrounding and returning does not leave audio stuck or doubled.
- [ ] Ambience does not fight the iPhone's own audio session or silent switch expectations.

---

## 2026-08-30 — v0.1.8 Characters

Asset upload landed on `main`. What arrived did not match the description, so the shape of
this milestone was decided before any code was written.

### What was actually uploaded
- `assets/characters/Characters/` holds **3D models** (`.glb`/`.fbx`) from the KayKit pack:
  Barbarian, Knight, Mage, Ranger, Rogue, Rogue_Hooded. The runtime is Canvas 2D and cannot
  draw them.
- `assets/characters/main_character/` holds **no character**. It is 2D furniture, icon,
  object and chest sheets plus a Tiled map and PSD sources, duplicated from `assets/`.
- There are **no 2D character sprites anywhere** in the upload.
- Two placeholder files were committed by accident: `assets/characters/main_character/test`
  and `assets/characters/text2`.
- `Textures/` duplicates the character textures already under `assets/characters/Characters/`.

Direction chosen: prerender the 3D models into 2D sprite sheets, keeping the Canvas 2D
renderer and the zero-build launch. The alternative, adopting a 3D renderer, would have
replaced the renderer, the authored 960x540 world contract, collision, and most of the
architecture document.

### FORGE — offline prerenderer
- Added `tools/prerender-characters.mjs`. It loads each model, binds clips from the
  shared-rig files under `Animations/`, and renders 8 directions per clip to sprite sheets.
- Dev-only. It needs `npm install` inside `tools/`; the game keeps no dependencies, no build
  step, and still launches from `file://`.
- The manifest is generated as `src/data/characterSprites.js` rather than JSON, because
  `fetch()` is blocked on `file://` and the launch contract depends on that working.

### FORGE — runtime sprites
- Added `src/core/Sprites.js`. Sheets load as plain images; every draw reports whether it
  succeeded.
- Direction index 0 faces the camera and turns clockwise, so a facing vector maps onto a
  sheet row directly through `atan2(facingX, facingY)`.
- Sprites are anchored on the feet, measured from the generated sheets rather than guessed,
  so they stand on the same ground line the procedural figures used.
- Kael draws idle, walk, and an attack stand-in. Walk reads off the existing gait phase so
  footfalls match movement that was already tuned.
- All five Greyhaven NPCs draw from sheets, each breathing on its own offset so a street of
  them never moves in lockstep.
- When a sheet is missing or still loading, the procedural figures draw instead. A fresh
  clone is playable before anyone runs the prerenderer.

### Placeholder status
- The cast is placeholder: Kael is `Rogue_Hooded`, the NPCs take the remaining five models.
  The pack is recognizable low-poly fantasy and does not match `docs/CANON.md`.
- Added `assets/ATTRIBUTION.md` recording sources and two unresolved questions: no licence
  file was committed with the KayKit upload, and the 2D sheets have no recorded origin.
- The pack contains no attack clip, so the Shardblade swing borrows `Use_Item`.

### Verification
- Prerender produces 8 sheets. Frame stepping confirmed by pixel difference: the walk cycle
  advances 7-15 per-pixel between frames, idle is a subtle 0-1, which is what those clips are.
- Direction rows verified by extracting each row: 0 south, 2 east, 4 north, 6 west.
- In-game facing checked at 3x zoom in all four cardinal directions.
- Fallback verified by serving every sheet as 404: the game boots, plays, moves, and reports
  `SPRITES 0/8 ready 8 failed` in diagnostics.
- Fixed a bug found in that fallback pass: both the sprite and procedural paths painted a
  ground shadow, so a missing sheet double-darkened it. Readiness is now checked before
  anything is painted.
- Full v0.1.4 through v0.1.7 regression passes unchanged. No console or page errors.

### Owner-device acceptance — PENDING
- [ ] HUD displays `v0.1.8-characters` after refresh.
- [ ] Character sprites are readable at phone scale and do not blur into the ground.
- [ ] Kael's facing reads correctly in all eight directions while moving.
- [ ] Sprite sheets do not cost noticeable frame time on device.

---

## Current immediate production order
1. Complete v0.1.8 iPhone acceptance, including the deferred v0.1.3 through v0.1.7 items.
2. Build Sunken Archive entrance revealed through Resonance progression.
3. Build reusable switch, persistent door, and push/manipulation primitives.
4. Build Tether acquisition and teaching sequence.
5. Build Archivist boss framework.
6. Complete vertical-slice presentation and device acceptance pass.
7. Repeat equivalent acceptance on iPad before the vertical-slice release gate.
