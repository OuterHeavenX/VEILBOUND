# VEILBOUND — Technical Architecture Foundation

Owner: **FORGE**

This document defines the intended architecture before implementation expands.

## Core Principles

- Modular systems over monolithic files.
- Data-driven rooms, enemies, items, puzzles, and story events.
- Device-independent input abstraction.
- Explicit world-state persistence.
- Deterministic room lifecycle where practical.
- Strong debug visibility for collisions, room state, transitions, and performance.
- Content code should not need to patch engine internals.

## Zero-Setup Launch Contract

`index.html` is the canonical launch point for the project.

Requirements:
- Opening `index.html` directly must boot the game without a package install or build step.
- Static hosting on GitHub Pages, Cloudflare Pages, or equivalent must work from the repository root.
- The launch shell must not depend on a local dev server for basic startup.
- The initial runtime uses classic browser scripts and Canvas 2D so `file://` startup remains viable while the modular engine is being established.
- Any future dependency or module-system change must preserve an out-of-box launch path, either by committing browser-ready output or by maintaining a zero-build runtime entry.
- Startup failures must present a visible user-facing error instead of leaving a blank screen.
- Mobile safe areas and responsive canvas sizing are required from the first playable build.

The current foundation boot files are:
- `index.html`
- `styles.css`
- `src/main.js`

## Proposed Source Layout

```text
src/
  core/
    Game.js
    GameLoop.js
    Input.js
    Audio.js
    SaveManager.js
    EventBus.js

  world/
    World.js
    Room.js
    RoomManager.js
    TileMap.js
    Collision.js
    WorldState.js

  entities/
    Entity.js
    Player.js
    NPC.js
    Enemy.js
    Boss.js

  combat/
    CombatSystem.js
    Hitbox.js
    Hurtbox.js
    Projectile.js
    DamageSystem.js

  abilities/
    AxiomSystem.js
    Resonance.js
    Tether.js

  puzzles/
    PuzzleSystem.js
    Switch.js
    PushBlock.js
    Door.js
    Anchor.js

  items/
    ItemRegistry.js
    Inventory.js
    Equipment.js

  story/
    DialogueSystem.js
    CutsceneSystem.js
    QuestSystem.js

  ui/
    HUD.js
    DialogueUI.js
    MapScreen.js
    InventoryScreen.js
    TouchControls.js

  data/
    rooms/
    enemies/
    items/
    quests/
    cutscenes/
```

The module boundaries are the important contract. Any future library adoption must preserve the zero-setup launch contract above.

## Runtime Ownership

### Game
Top-level lifecycle and service composition. It should not become a catch-all gameplay file.

### GameLoop
Owns update cadence and render scheduling. Gameplay systems receive time deltas through explicit update calls.

### Input
Normalizes keyboard, touch, and controller inputs into actions such as:
- moveX / moveY
- attack
- interact
- axiom
- menu
- map
- cancel

Gameplay systems should not directly query raw keyboard/touch/gamepad APIs.

### RoomManager
Loads room definitions, creates runtime entities, manages transitions, and tears down transient room state safely.

### WorldState
Owns persistent flags and room-level persistence. Examples:
- opened chest
- solved puzzle
- defeated boss
- opened shortcut
- activated mechanism

### SaveManager
Serializes versioned player/world state and validates loaded data. Save format must include a schema version from the beginning.

`inspect()` reports what is in storage without touching it, so the title can offer a safe
resume. It returns one of:

- `ready` — a valid save, with the normalized data.
- `empty` — nothing stored.
- `unreadable` — stored bytes that will not parse.
- `incompatible` — a save from a different schema version.
- `unavailable` — storage itself is blocked or throwing.

A save that cannot be resumed is never silently discarded. It stays on disk until the player
explicitly replaces or erases it.

Device-level preferences live outside the save, under `veilbound.settings.v1`, via
`loadSettings()` / `saveSettings()`. They belong to the device rather than to a journey, so
they must survive erasing or replacing a save, and must be settable before any save exists.
The save's own `settings` field stays reserved for per-journey settings.

### Character sprites
The uploaded characters are 3D glTF models, and the runtime is Canvas 2D. Rather than
replace the renderer, `tools/prerender-characters.mjs` renders each model once, offline,
into 8-direction sprite sheets that the 2D runtime draws like any image.

- The tool is dev-only. It needs `npm install` inside `tools/`; the game itself still has
  no dependencies, no build step, and launches from `file://`.
- Sheets load as plain `<img>`, and the manifest is generated as `src/data/characterSprites.js`
  rather than JSON, because `fetch()` is blocked on `file://`.
- Direction index 0 faces the camera and turns clockwise, so a facing vector maps onto a
  sheet row directly through `atan2(facingX, facingY)`.
- Sprites are anchored on the feet, measured from the generated sheets, so they stand on the
  same ground line the procedural figures used.
- Every draw reports whether it succeeded. When a sheet is missing or still loading the
  runtime falls back to its procedural figures, so a fresh clone is playable before anyone
  runs the prerenderer.

The KayKit models carry no clips of their own; the clips live in the shared-rig files under
`Animations/`, keyed by node name, so a clip bound to a character's skeleton plays without
retargeting. There is no attack clip in the pack, so the Shardblade swing borrows `Use_Item`.

Casting is placeholder, recorded in the tool's `CAST` table: Kael is `Rogue_Hooded`, and the
five Greyhaven NPCs take the remaining five models. See `assets/ATTRIBUTION.md`.

### Authored sprite sheets and scenery
Two sheet layouts coexist, both drawn through `src/core/Sprites.js`:

- **Generated**, from `tools/prerender-characters.mjs`: 8 direction rows, one sheet per clip,
  described by `src/data/characterSprites.js`.
- **Authored**, shipped in the upload: 64px cells, four direction rows in the order south,
  north, west, east, one row-major sheet per clip, described by `src/data/enemySprites.js`.
  With only four rows, a facing vector picks the dominant axis rather than the nearest of
  eight.

Enemy clips are chosen from what the enemy is actually doing, so the sheet follows the
existing state machine rather than duplicating it. A defeated enemy plays its death clip
before leaving the field; defeat is recorded the moment health reaches zero, so persistence
never depends on the animation finishing.

Scenery lives in `src/data/props.js` as ground-anchored single images. Anything that reads as
an obstacle is placed over a collision rectangle that already exists in the room, so the art
and the collision agree without retuning traversal that is already accepted; those rectangles
are marked `hidden` so the generic wall fill does not paint a slab underneath the art.

Every sprite path reports whether it drew. When a sheet is missing the runtime falls back to
its procedural figures, so the game is never blocked on art.

### Terrain
Ground and paths tile from the uploaded 16px sets, described in `src/data/terrain.js`.

Those sheets are autotile sets: mostly edge, corner and junction pieces meant to be assembled
in Tiled. Rather than reimplement autotiling, the runtime uses each sheet's interior field
tile, chosen by seam analysis — a tile qualifies when it is fully opaque and its right edge
continues into its own left edge, and likewise top into bottom. Edges are handled by authored
geometry instead, so every path rectangle is verified clear of the room's collision
rectangles before it is authored.

The tile sets are brighter and more saturated than Eidol, so a wash is painted over the tiled
terrain only, never over props or characters. Its alpha is a single value in `terrain.js`; set
it to 0 to see the sheets untouched.

When a tile sheet is missing the room falls back to its flat authored colour and the
hand-drawn roads, so the game still reads.

### Enemy repopulation
Ordinary enemies repopulate their room on every entry. Persistence is kept as an explicit
per-enemy opt-in (`persistent: true` on the placement) so a boss or a story kill can still
stay defeated, and the `defeatedEnemies` machinery in Save Schema V1 is unchanged. Saves that
still carry old defeat flags no longer suppress spawns, because the flag is only consulted for
enemies that opt in.

Note that a player death inside `updateEnemies` or `updateProjectiles` repopulates those
arrays mid-iteration, so both loops tolerate an index that has gone away.

### Pause menu
`src/ui/PauseMenu.js`. Opens on `M`, `Tab`, `Escape`, or the touch button; closes on the same
keys, the RESUME button, or a click outside the frame.

Pause suspends the simulation without stopping the frame, so the world stays visible behind
the menu rather than freezing to a blank. It is a separate flag from `running`, so saving and
the title handover are unaffected.

Everything the menu shows is real save state: vitality, XP, JP, coins, Shardblade level, held
Axiom protocols, and the authored journey milestones. Unearned milestones are shown only as a
count, so the list stays tidy and does not spoil its own labels.

It is built in the UI language the title screen, HUD and dialogue already establish: near
black, thin cyan and amber rules, monospace caps. The uploaded menu kit's wooden panels are a
different palette family and would fight that, so what it contributes is its icon sheet —
rows 0-5 of `Icons.png` are amber monochrome glyphs that sit naturally on a dark ground,
addressed by cell through a CSS custom property. Kael's portrait is his own prerendered idle
sheet, stepped frame by frame with a `steps()` animation off one `--cell` value.

### Progression
`src/core/Progression.js` owns the rules in `docs/PROGRESSION.md`: the reward values, coin
world-drops and their pickup, reward toasts, and the controller's menu button. It holds no
reference to the menu, so presentation can change without touching the contract. XP and JP
land the moment an enemy enters its death state; the coin is a physical drop that must be
walked over, is room-local, and is cleared on transitions and on recovery.

### Progression counters
XP, JP and coins live in `player` and are awarded on enemy defeat. They were added after Save
V1 shipped; `normalize()` merges over defaults, so saves written before they existed load with
zeroes and need no migration. The reward values sit in one `DEFEAT_REWARD` constant.

### Audio
Every voice is synthesised through Web Audio. VEILBOUND ships zero-build and
file://-friendly, so there are no audio assets to fetch, and procedural synthesis keeps
the sound original by construction.

- Browsers refuse audio before a user gesture. Nothing is created until `unlock()` is
  called from a real interaction; that is a platform rule, not a bug, and a player who
  never interacts with the title correctly hears nothing.
- The bed and the bell are built against whatever context they are handed, so the same
  synthesis serves live playback and `render()`, an offline audition of the mix.
- A pass-through analyser sits after the master gain, so the real output level is
  observable in the diagnostics overlay and in tests rather than assumed.
- Transitions fade rather than cut, per ECHO's pillars.
- The context is suspended while the tab is hidden.
- Mixes are checked against a lowpassed phone speaker, not just full range. A bed that is
  all sub-100 Hz is inaudible on the device this project targets first.

### Title / boot
Owns the entry point into play. Gameplay does not update until the title hands over, and the
runtime never autosaves while the title is up — otherwise a player who never pressed anything
would be given a save they did not start.

- `CONTINUE` appears only for a `ready` save, labelled with its room and health.
- `NEW GAME` over an existing save requires explicit confirmation.
- `SETTINGS` is reachable before any save exists, because its preferences are device-level.
- Title ambience gives way to play with a fade, and never starts if the gesture that
  unlocked audio was itself the one starting the game.
- The control hint is chosen from the active input: gamepad, coarse pointer, or keyboard.

The world is restored before the title is shown, so the menu sits over a live still of the
room the player would resume into.

### CombatSystem
Coordinates attacks, hit/hurt overlap, damage, knockback, invulnerability windows, and combat events. Visual/audio feedback should subscribe through events rather than being hard-coded into damage math.

### AxiomSystem
Owns acquired abilities and common Axiom rules. Individual abilities implement their own targeting/execution contracts.

### CutsceneSystem
Runs data/script-driven cinematic sequences while preserving clear control over player input, camera, dialogue, animation, sound/music cues, and skip behavior.

### InteractionSystem

Resolves the player's current interactable target and plays its authored response.

- Interaction content is data, not code: `src/data/interactables.js` maps a room id to an
  ordered list of interactables, each with a stable authored id.
- Kinds: `npc`, `object`, `rest`. `solid: true` gives an entry a body the player collides with.
- Targeting picks the nearest entry within `reach`, and is suppressed while dialogue is open
  or the player is down. The action control resolves to `interact` when a target is in reach
  and falls back to `attack` otherwise, so touch keeps a single action button.
- `lines` is an ordered variant list. The first variant whose `when` clause passes is the one
  that plays, so world-state reactions are authored above the defaults. Clauses read
  `flag`, `notFlag`, and `ability`.
- Effects run when the dialogue closes: `set` writes world flags, `rest` restores health and
  saves. Every interactable may also declare a `metFlag` for first-meeting variants.

Dialogue that reacts to world state is the mechanism behind canon's requirement that Greyhaven
changes over the course of the game.

## Data-Driven Room Contract

A room definition should be capable of describing at minimum:
- id
- display name
- environment/theme
- collision/tile data reference
- exits and entry points
- enemy placements
- interactables
- puzzle objects
- persistent object ids
- music/ambience key
- scripted triggers

Conceptual example:

```js
{
  id: 'sunken-archive-03',
  exits: {
    north: { room: 'sunken-archive-04', entry: 'south' },
    south: { room: 'sunken-archive-02', entry: 'north' }
  },
  enemies: [
    { type: 'archive-sentry', x: 8, y: 5 }
  ],
  puzzles: [
    { type: 'tether-anchor', id: 'anchor-a', x: 6, y: 3 }
  ]
}
```

## Persistent IDs

Any object whose state survives room reloads must have a stable authored id. Runtime array index is never an acceptable persistent identity.

Examples:
- `greyhaven.chest.workshop_alley`
- `archive.puzzle.water_ring_01`
- `archive.shortcut.west_gate`
- `boss.archivist.defeated`

## Save Schema V1 — Initial Contract

Conceptual shape:

```js
{
  version: 1,
  player: {
    roomId: 'greyhaven',
    entryId: 'spawn',
    health: 6,
    maxHealth: 6,
    shardbladeLevel: 1,
    abilities: ['resonance'],
    inventory: []
  },
  world: {
    flags: {}
  },
  settings: {}
}
```

Migration functions should be introduced before any breaking save changes are shipped publicly.

## Combat Feel Requirements

Even simple attacks should support presentation hooks for:
- hit pause
- impact particles
- target flash
- camera impulse/shake
- knockback
- weapon trail
- impact audio

These effects must be bounded so stacked effects cannot destabilize performance.

## Cutscene Contract

A cutscene sequence should be declarative enough to express operations such as:
- lock/unlock player control
- camera focus/pan
- move actor
- face actor
- play animation
- show dialogue
- wait
- emit world event
- change lighting
- play/transition music
- play sound
- shake camera
- set persistent flag
- start boss
- fade in/out

Viewed-state should be persistable for major cinematics so retry behavior can shorten or skip repeated sequences.

## Development Diagnostics

Implemented as an optional overlay that is off by default and never ships enabled.

**Toggle**
- `F3` or `` ` `` on a keyboard.
- `?debug` appended to the URL, for touch devices with no keyboard.
- The keyboard toggle is persisted in `settings.debugOverlay`, so a device stays in
  development mode across reloads. `?debug` forces the overlay on for one session
  without writing the setting.

**Text panel** (DOM, refreshed on a fixed interval rather than every frame)
- FPS, rolling average frame time, and worst frame time in the sample window
- room id and entry id
- player coordinates and facing
- health, invulnerability, attack and cooldown timers
- Resonance availability, cooldown, and live pulse radius
- entity counts for enemies, projectiles, and particles
- current interactable target and whether it has already been read
- per-enemy id, health, current state with state timer, and distance
- active world flags

**World shapes** (canvas, drawn in world space)
- collision rectangles and exit rectangles
- authored Resonance node radii, including undiscovered ones
- enemy hurtboxes plus Vein Sentry engage and retreat ranges
- projectile hitboxes and the player hurtbox
- the Shardblade arc; a hit lands when that arc overlaps an enemy hurtbox

The reach, arc, active window, and husk aggro range used by the overlay are the same
constants the simulation reads, so the drawn boxes cannot drift from real behaviour.

## Production Gate

Do not dramatically expand room count until the architecture can demonstrate:
1. stable transitions
2. stable save/reload
3. persistent room state
4. device-independent input
5. reusable combat
6. reusable puzzle primitives
7. cutscene skip/replay behavior
8. stable mobile performance
