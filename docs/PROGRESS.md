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

## Current immediate production order
1. Complete v0.1.6 iPhone acceptance, including the deferred v0.1.3, v0.1.4, and v0.1.5 items.
2. Build Sunken Archive entrance revealed through Resonance progression.
3. Build reusable switch, persistent door, and push/manipulation primitives.
4. Build Tether acquisition and teaching sequence.
5. Build Archivist boss framework.
6. Complete vertical-slice presentation and device acceptance pass.
7. Repeat equivalent acceptance on iPad before the vertical-slice release gate.
