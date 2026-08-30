# VEILBOUND — Technical Architecture Foundation

Owner: **FORGE**  
Current runtime: **v0.3.0-archive**

## Core principles

- Modular systems over monolithic files.
- Data-driven rooms, enemies, items, puzzles and story events.
- Device-independent action concepts across keyboard, touch and controller.
- Explicit authored persistence for world state.
- Stable room lifecycle and cleanup.
- Strong development diagnostics.
- Content should not need to patch unrelated engine internals.
- The game remains zero-build/static-host friendly.

## Zero-setup launch contract

`index.html` is the canonical launch point.

The browser game must remain launchable from static hosting without npm, a bundler or a local development server. Development-only tools may use dependencies as long as committed browser-ready output keeps the game itself zero-build.

Current launch chain includes SaveManager, Audio, sprite/data registries, interaction/title/pause UI, Progression, and `src/main.js`.

Startup failure must surface visibly rather than leaving a blank canvas. Mobile safe areas and responsive canvas sizing are required.

## Current runtime boundary

The vertical-slice prototype is still concentrated in `src/main.js`, but new reusable systems should increasingly be extracted rather than allowing the file to become the permanent engine.

Already separated:

- `src/core/SaveManager.js`
- `src/core/Audio.js`
- `src/core/Sprites.js`
- `src/core/Progression.js`
- `src/ui/TitleScreen.js`
- `src/ui/PauseMenu.js`
- data registries for enemies, sprites, terrain, props and interactables

Next extraction priority after the Sunken Archive opening is accepted: reusable dungeon puzzle/mechanism handling.

## SaveManager

Save V1 owns persistent journey state. `inspect()` reports a stored save without modifying it, allowing safe title-screen resume. Unreadable/incompatible saves are never silently replaced.

Device preferences live separately under `veilbound.settings.v1` and survive save replacement.

Current additive player progression fields include:

```js
player: {
  xp: 0,
  jp: 0,
  coins: 0
}
```

Older Save V1 files normalize over defaults rather than requiring a breaking migration.

## World-state persistence

Any state that matters after leaving a room uses a stable authored ID/flag.

Examples:

- `story.axiomAwakened`
- `march.field2.resonanceRouteRevealed`
- `archive.entered`
- `archive.vestibule.sealOpen`
- `archive.rotunda.resonanceRead`
- future `boss.archivist.defeated`

Runtime array indexes are never persistent identities.

Ordinary enemies repopulate on room entry. Bosses/story kills may opt into persistent defeat using authored IDs.

## Room contract

A room may currently define:

```js
{
  name,
  ground,
  details,
  walls: [],
  exits: [],
  enemies: [],
  resonanceNodes: [],
  switches: [],
  doors: []
}
```

An exit may include:

```js
{
  room,
  spawnX,
  spawnY,
  entry,
  requiresFlag
}
```

`requiresFlag` is authoritative for both rendering the available exit and permitting transition. This prevents a visually closed route from remaining transition-active.

Transient combat state such as projectiles and uncollected coin drops is cleared on room transition.

## Sunken Archive puzzle primitives — v1

The first dungeon introduces reusable room-authored mechanism contracts.

### Switch

```js
{
  id: 'archive.vestibule.floorSwitch',
  x: 480,
  y: 310,
  radius: 28,
  flag: 'archive.vestibule.sealOpen'
}
```

When player overlap reaches the authored radius and the flag is false:

1. set the persistent flag,
2. emit bounded feedback,
3. request a save,
4. update mechanism rendering/collision through the flag.

### Door / seal

```js
{
  id: 'archive.vestibule.southSeal',
  x: 420,
  y: 468,
  w: 120,
  h: 34,
  flag: 'archive.vestibule.sealOpen'
}
```

A door whose flag is false participates in the same collision path used by players, enemies and projectiles. Once the flag becomes true it stops contributing collision and renders as an opened mechanism.

The switch, door and gated exit may intentionally share one flag so simulation, visuals and room transition cannot desynchronize.

### Deep water

The first Archive rooms treat deep water as impassable geometry. Water presentation and its hidden collision geometry occupy the same authored rectangles. Future swimming/falling/Tether traversal should change this contract explicitly rather than making decorative exceptions.

### Extraction rule

The above logic is currently proven inside `src/main.js`. Once owner-device testing validates the opening rooms, FORGE should extract the generic mechanism behavior before adding multiple new puzzle types.

## InteractionSystem

`src/data/interactables.js` provides stable authored NPC/object/rest definitions. Targeting selects the nearest in-reach object and reuses the main action control, while Resonance remains a separate input.

Dialogue variants may depend on flags/abilities. Effects may set flags or perform rest/save behavior.

## ProgressionSystem

Enemy defeat currently feeds a shared progression pipeline:

- +2 XP immediately
- +1 JP immediately
- spawn one physical coin drop
- +1 Coin when Kael collects it

Dungeon enemies reuse the same pipeline. Do not create dungeon-specific duplicate reward math.

## CombatSystem contract

Combat currently owns or coordinates:

- melee attack timing and directional reach
- enemy hurt state/health
- knockback
- player i-frames
- Vein Sentry state machine/projectiles
- Resonance interruption
- enemy death presentation
- progression reward callback

Presentation hooks should remain bounded so stacked particles/flash/projectiles cannot destabilize phone performance.

## Axiom contract

Abilities are persistent player capabilities. Resonance is implemented as a short expanding pulse against authored compatible targets. It is not a global visibility filter.

The next major ability is **Tether**. Its implementation must support traversal, object/machinery manipulation and combat use from the same core targeting rules, with touch and controller considered from the first pass.

## Sprite architecture

Generated 8-direction character sheets and authored enemy sheets both flow through `src/core/Sprites.js`. Missing art must fall back safely rather than block game startup.

The current third-party packs are placeholders and remain subject to the licensing/public-repository concerns recorded in `assets/ATTRIBUTION.md`.

## Audio architecture

Web Audio is created only after a user gesture. Current title ambience is procedural. Audio suspends while hidden and fades rather than hard-cutting. Future area ambience and combat/Axiom sound should preserve these lifecycle rules.

## Title / pause lifecycle

Gameplay does not update until the title starts a journey. The title never autosaves by itself.

Opening the Character menu pauses the gameplay simulation while leaving the world visible behind the UI. Menu state reads directly from the current save/player state rather than maintaining a competing progression copy.

## Development diagnostics

Optional diagnostics report frame timing, room/entry/player state, health/combat timers, progression, Resonance, entities, interactables, Resonance nodes, enemy states and flags.

World overlays include collision, exits, enemy/player hit areas, Sentry ranges, projectiles, switches and closed Archive doors.

Diagnostics remain off by default and should not add per-frame work while disabled.

## Cutscene contract

Major cinematic sequences should support input lock, camera focus, actor movement/facing, animation, dialogue, sound/music cues, world events, persistent flags, boss start and fade/shake operations. Retry behavior must be shortened/skippable where repetition would waste the player's time.

## Production gate

Do not dramatically expand world room count until the vertical slice demonstrates:

1. stable transitions
2. stable save/reload
3. persistent puzzle/world state
4. touch/keyboard/controller input
5. reusable combat
6. reusable puzzle primitives
7. Tether across traversal/object/combat use
8. retry-aware cinematic behavior
9. stable phone/tablet performance
10. The Archivist route and `WELCOME BACK.` payoff
