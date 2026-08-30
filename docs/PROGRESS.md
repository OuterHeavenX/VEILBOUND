# VEILBOUND — Development Progress Log

This is the chronological implementation log for meaningful production milestones.

Use this file together with `ROADMAP.md`, `docs/VERTICAL_SLICE.md`, `docs/CANON.md`, `docs/ARCHITECTURE.md`, `docs/COMBAT.md`, `docs/PROGRESSION.md`, `docs/SUNKEN_ARCHIVE.md`, and `AGENTS.md`. Implementation completion and owner-device acceptance are always tracked separately.

---

## 2026-08-30 — v0.3.1 Sound, centring and a summoned stick

Three owner reports off a device screenshot.

### The world drew off-centre and clipped
- `resizeCanvas` sized the canvas backing store from `innerWidth`/`innerHeight`, but the
  element was laid out by CSS from `#app`, which mixed `100vw`, `100svh` and
  `min-height: 100vh`. On mobile `100vh` exceeds `100svh`, so the element ended up taller
  than the window, the browser rescaled the backing store to fit it, and the world landed
  off-centre with the bottom cut off.
- `#app` is now `position: fixed; inset: 0`, which always matches the visual viewport, and
  the backing store is sized from the canvas's own measured box. Verified across four window
  shapes and, more usefully, by forcing the element to disagree with the window: the backing
  store follows the element, which under the old code it did not.

### The stick is summoned where the thumb lands
- Touching anywhere in the left half places the stick there and drags from that origin. The
  origin is clamped inside the viewport so a touch near an edge still has room to push in
  every direction. The right half still belongs to the action buttons.

### Sound
- Each region has its own bed, differing in root, colour, wind and whether a bell sounds:
  Greyhaven warm and low with its bell tower answering, the Hollow March mostly wind, the
  relic chamber tight and metallic, the Archive deepest with water in the wind band.
  `setRegion()` crossfades and follows the room, including on death.
- In-game beds sit at roughly 0.6 of the title's level, so music stays under play.
- Twelve gameplay cues: swing, hit, enemy down, hurt, resonance, coin, dialogue blip,
  interact, discovery, rest, and menu open/close. All synthesised, no assets.
- Cues run on their own bus with its own analyser. The bed's wind moves more than a cue adds,
  so cue output cannot be measured on the master tap; the first attempt at testing this
  produced meaningless results until the cue bus got its own tap.

### Bug found while testing
- `BELL_PARTIALS` was deleted along with the old single-region constants, so every bell
  strike would have thrown. Bells only fire 7-26s apart, so no short test reached one; the
  offline region render did. Restored, and confirmed by a 30s run with no page errors.

### Verification
- All twelve cues measured individually on the cue bus; every one produces sound.
- Region beds confirmed crossfading title → march → greyhaven as Kael moves.
- The AUDIO setting still silences beds and cues.
- Every regression suite passes. One stale assertion was updated rather than deleted:
  starting play used to fade to silence, and now crossfades into the region bed.

### Owner-device acceptance — PENDING
- [ ] The world sits centred with even letterboxing, in both orientations.
- [ ] The stick appears under the thumb anywhere on the left, and never fights the buttons.
- [ ] Each region sounds distinct, and music sits under the cues rather than over them.
- [ ] Audio survives backgrounding and returning.


## 2026-08-29 — v0.1.0 Foundation
- Initialized the repository and studio documentation.
- Established the zero-build `index.html` launch contract.

## 2026-08-29 — v0.1.1 Playable
- Added Canvas 2D runtime, Greyhaven, Hollow March Fields 1–2, movement, collision, room transitions, keyboard/touch/controller input, and prototype Kael.
- iPhone static-host launch and touch movement confirmed.

## 2026-08-29 — v0.1.2 Combat
- Added Shardblade melee, enemy/player damage, knockback, i-frames, hit feedback, Save V1, the Forgotten Relic Chamber, and Axiom awakening.
- Owner-device testing exposed portrait flash contamination and an incomplete dormant-chamber save state.

## 2026-08-29 — v0.1.3 Resonance — iPhone accepted
- Fixed portrait letterbox contamination.
- Added dedicated Resonance input/pulse, authored Resonance nodes, persistent discoveries, and background/page-hide autosave.
- Added recovery for the incomplete dormant-chamber save state.
- iPhone confirmed awakening, Resonance discovery, refresh/reopen persistence and separated Shardblade/Resonance controls.

## 2026-08-29 — v0.1.4 Vein Sentry
- Added the data-driven enemy registry and ranged Sentry state machine.
- Added readable telegraphing, projectiles, recovery and Resonance disruption.
- Added mixed Husk + Sentry combat in Hollow March Field 2.

## 2026-08-29 — Development diagnostics
- Added optional FPS/timing/entity/state/collision diagnostics.
- Added `F3` / backquote / `?debug` access without affecting the default shipping path.

## 2026-08-29 — v0.1.5 Greyhaven
- Added data-driven interaction targeting and contextual action input.
- Authored six Greyhaven exterior landmarks and five NPCs with world-state-reactive dialogue.
- Added Wayfarer's Rest as the first save/rest point.
- Added Old Lift Station and Shardblade repair backtracking/service hooks.

## 2026-08-30 — v0.1.6 Title
- Added title screen, Continue/New Game/Settings, safe resume inspection, erase confirmation and device-level settings.
- Prevented title-only visits from manufacturing saves.

## 2026-08-30 — v0.1.7 Title ambience
- Added procedural Web Audio title ambience, mobile-conscious frequency balance, autoplay handling and audio lifecycle management.

## 2026-08-30 — v0.1.8 Characters
- Added offline 3D-to-2D prerender tooling while retaining the zero-build Canvas runtime.
- Added sprite rendering and procedural fallbacks for Kael and Greyhaven NPCs.

## 2026-08-30 — v0.1.9 Bestiary and scenery
- Added authored enemy sprite sheets, death clips and Hollow March scenery.
- Recorded placeholder/licensing boundaries in `assets/ATTRIBUTION.md`.

## 2026-08-30 — v0.2.0 Terrain and repopulation
- Added tiled ground/road presentation and terrain wash.
- Changed ordinary enemies to repopulate on room entry while preserving opt-in persistence for bosses/story kills.
- Fixed enemy/projectile iteration hazards exposed by mid-loop respawn.

## 2026-08-30 — v0.2.1+ Character menu and progression
- Added persistent XP, JP and coin counters.
- Enemy defeat grants **+2 XP** and **+1 JP** and creates **one physical coin drop**.
- Coin pickup grants +1 Coin and persists.
- Added the pause/Character menu with Vitality, XP, JP, Coins, Shardblade level, Axiom protocols and journey state.
- Claude refined the menu presentation/assets and reconciled it into the latest development base before dungeon production.
- Owner screenshot confirmed a real run at 10 XP / 5 JP / 5 Coins, matching five enemy defeats.
- Owner later confirmed Claude fixed the menu presentation and requested first-dungeon production.

---

## 2026-08-30 — v0.3.0 Sunken Archive opening

Branch: `feature/sunken-archive-foundation`

### ORACLE / ARCHITECT
- Began the first major dungeon rather than adding another foundation-only system.
- Added `docs/SUNKEN_ARCHIVE.md` as the active dungeon contract.
- Opening teaching sequence is now:
  **Eastern Descent → Vestibule → Catalog Rotunda → sealed deeper Archive**.
- Preserved the dungeon doctrine **Teach → Test → Combine → Twist → Master**.
- Tether remains intentionally ungranted in this opening pass; the player sees the missing manipulation requirement first.

### FORGE — route and room lifecycle
- Added a Resonance-gated south route from Hollow March Field 2 after `march.field2.resonanceRouteRevealed`.
- Added three playable Archive rooms:
  - `archiveThreshold` — `SUNKEN ARCHIVE — EASTERN DESCENT`
  - `archiveVestibule` — `SUNKEN ARCHIVE — VESTIBULE`
  - `archiveRotunda` — `SUNKEN ARCHIVE — CATALOG ROTUNDA`
- Added one-time persistent `archive.entered` acknowledgement.
- Preserved the return path to Hollow March.
- Added `requiresFlag` support to room exits.

### WRAITH / FORGE — opening visual language
- Added procedural drowned-Archive presentation: monumental dark stone, deep teal side chambers, pale walkways, cyan circuitry and circular catalog machinery.
- Water hazards and collision use matching authored geometry rather than decorative water that Kael can walk through.
- The Field 2 Resonance route now visually leads to the Archive descent.

### ARCHITECT / FORGE — first dungeon puzzle primitive
- Added room-authored `switches` and `doors` contracts.
- Vestibule floor plate sets `archive.vestibule.sealOpen`.
- Closed doors participate in player, enemy and projectile collision.
- The opened state removes the collision and changes presentation.
- The same persistent flag gates the south exit, avoiding visual/state desynchronization.
- Switch activation saves immediately and survives through Save V1 world flags.

### Combat / progression reuse
- Vestibule contains one Husk and one Vein Sentry.
- Rotunda contains a second mixed encounter.
- Existing death, XP, JP and physical-coin reward pipeline is reused rather than adding dungeon-only reward code.

### Resonance / Tether foreshadowing
- Catalog Rotunda central node writes `archive.rotunda.resonanceRead`.
- Current response:
  - `CATALOG MEMORY LATTICE RESPONDING.`
  - `DEEPER ACCESS REQUIRES MANIPULATION AUTHORITY.`
  - `PROTOCOL TRACE: TETHER.`
- Deeper south bulkhead remains intentionally closed through `archive.depthsUnlocked`, which is not set in this milestone.

### Diagnostics / compatibility
- Debug overlay now includes authored switches and closed dungeon doors.
- Debug text reports closed door IDs.
- Existing title, fixed Character menu, progression, Greyhaven, Resonance, Sentry, sprite, terrain and Save V1 systems were carried forward.
- Runtime and HUD version are `v0.3.0-archive`.

### Code-level acceptance
- [x] Archive route is gated by the existing Field 2 Resonance discovery flag.
- [x] Three Archive rooms are connected and returnable.
- [x] `archive.entered` is persistent.
- [x] Vestibule switch and seal share a persistent flag.
- [x] Closed seal participates in normal collision.
- [x] Rotunda Resonance node persists its read state.
- [x] Tether is foreshadowed but not granted.
- [x] `index.html` still loads the existing zero-build script chain and displays `v0.3.0-archive`.
- [x] `src/main.js` begins and closes cleanly in the committed branch after reconstruction.

### Owner-device acceptance — PENDING
- [ ] Enter Eastern Descent from the revealed route on iPhone.
- [ ] Confirm first-entry Archive dialogue only happens once.
- [ ] Traverse water/causeway geometry without snagging.
- [ ] Defeat Vestibule enemies and confirm XP/JP/coin rewards.
- [ ] Trigger the floor switch and observe the seal open.
- [ ] Enter Catalog Rotunda.
- [ ] Use Resonance at the catalog core and receive the Tether trace.
- [ ] Confirm the deeper bulkhead stays closed.
- [ ] Open the Character menu inside the dungeon with no regression.
- [ ] Backtrack, refresh/Continue, and confirm the Vestibule seal remains open.

---

## Immediate production order

1. Complete `v0.3.0-archive` iPhone acceptance.
2. Fix any Archive collision/readability/save regression found by the owner-device pass.
3. Add the reusable push/manipulation block.
4. Add water/energy routing and the first meaningful shortcut loop.
5. Build the Tether acquisition chamber.
6. Implement Tether traversal/object/combat use and teach it progressively.
7. Build deeper mastery rooms.
8. Build The Archivist framework.
9. Produce the `WELCOME BACK.` sequence.
10. Run full vertical-slice acceptance on iPhone, iPad, desktop and controller before expanding world scale.
