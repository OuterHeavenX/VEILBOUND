# VEILBOUND — Technical Architecture Foundation

Owner: **FORGE**  
Current runtime: **v0.4.7-views**

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

Current launch chain includes SaveManager, Audio, Sprites, RoomArt, Puzzles, sprite/data registries, orientation/interaction/title/pause UI, Progression, and `src/main.js`.

Startup failure must surface visibly rather than leaving a blank canvas. Mobile safe areas and responsive canvas sizing are required.

## Current runtime boundary

The vertical-slice prototype is still concentrated in `src/main.js`, but new reusable systems should increasingly be extracted rather than allowing the file to become the permanent engine.

Already separated:

- `src/core/SaveManager.js`
- `src/core/Audio.js`
- `src/core/Sprites.js`
- `src/core/Progression.js`
- `src/core/Puzzles.js`
- `src/core/RoomArt.js`
- `src/core/Cutscene.js`
- `src/ui/Orientation.js`
- `src/ui/TitleScreen.js`
- `src/ui/PauseMenu.js`
- data registries for enemies, sprites, terrain, props and interactables

Dungeon puzzle/mechanism handling was the last extraction, in v0.3.2. Next priority: room/encounter
authoring, which is still the largest remaining block of `src/main.js`.

## Landscape contract

The world is authored at 960x540, so a phone held upright has nowhere to put it. Two
mechanisms, because neither is sufficient alone:

- `screen.orientation.lock('landscape')` is the real lock, attempted quietly on the first
  user gesture. Android Chrome grants it only to a fullscreen document; iOS Safari does not
  implement it at all. It is never depended upon, and a refusal is the normal case.
- A blocking overlay (`#rotate-screen`) whenever the viewport is portrait. This is what
  actually holds on iOS, and it covers the moment before a granted lock takes effect.

Only devices that can rotate are held: touch capability *and* no fine pointer. A desktop
window that happens to be tall has a mouse, and telling someone with a mouse to rotate their
monitor is nonsense.

While the gate is up the simulation does not advance, held input is cleared, a running game
autosaves, and audio suspends — the same treatment as backgrounding the tab. The gate uses
its own flag rather than the pause-menu flag, so rotating with the menu open returns to the
menu rather than to play.

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
  doors: [],
  blocks: [],
  water: []
}
```

`switches`, `doors`, `blocks` and `water` are read by `src/core/Puzzles.js`, not by the room
loader; their shapes are specified under **Sunken Archive puzzle primitives** below.

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

### Push block

```js
{ id: 'archive.cistern.block', x: 560, y: 270, size: 52 }
```

A block moves only when walking into it and only when its own destination is clear of walls and
other blocks, so a push either succeeds whole or not at all. The pusher advances by exactly the
distance the block moved; without that the two alternate frames and pushing crawls at half speed.

Block positions are room-local and reset on entry. Anything that must outlive the room is a world
flag (rule 2.5), so a solved puzzle stays solved without the block itself being persisted.

A switch may declare `needsBlock`, which makes it ignore the player entirely and latch only under a
seated block. That is what makes the block the answer rather than a thing to stand on.

### Routed water

```js
{ x: 38, y: 248, w: 884, h: 92, flag: 'archive.sluice.drained' }
```

Deep water inside a puzzle room reads its flag: impassable while false, walkable and drawn as a dry
channel once true. Art and collision come from the one rectangle, as with the static Archive water.

### Extraction rule

This logic now lives in `src/core/Puzzles.js`, which owns doors, switches, blocks and routed water
for every room. `src/main.js` supplies the wall query and reacts to activation (feedback, flags,
saving); it no longer implements mechanism behavior. New puzzle types belong in that module.

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

## Room art

A room may declare an authored background plate in `src/data/roomArt.js`. When
`src/core/RoomArt.js` has that image decoded it paints the whole plate and the runtime skips
every procedural pass that would draw over it: the flat ground fill, the terrain tiler, the
`details` overlay, the decorative props, and the fill of the room's own wall rects. In a
painted room the scenery and the buildings *are* the art, so drawing any of that on top only
hides the painting — and the props are a different art style besides.

Collision is untouched by any of this. Walls, exits, mechanisms, props, interactables and
figures all still draw and simulate exactly as before, so a plate is presentation only.

The fallback is the default rather than the exception: `draw()` returns false for a room with
no plate, and for a plate still loading or failed, and every one of those cases keeps the
procedural art it had before. A missing background can never take a room out of play.

Collision is authored to what the plate paints, not the other way round. The Hollow March
fields previously carried arbitrary invisible obstacle boxes; those are now the trees, the
pine's trunk, the Vein crystal shrine and the boulders that the paintings actually show. A
tree blocks at its trunk rather than its canopy, because a canopy-sized box blocks open
ground the painting shows as walkable.

`fit: 'stretch'` maps the image onto the full 960x540 world. Greyhaven's plate is 1844x853
(2.16) against the world's 1.78, so it squashes about 18% horizontally. That is deliberate:
the plate was painted from this room's authored layout, and stretched, every building lands on
the collision box that already existed, which a uniform crop does not do.

A plate may also declare `awakenGlow` — a flag-gated radial light composited over the plate in
`lighter`. Greyhaven's lift gate uses it so the town visibly answers `story.axiomAwakened`,
which `docs/CANON.md` asks of Greyhaven, without shipping a second multi-megabyte plate.

## Title presentation

The title screen uses no runtime rendering at all. It is a single piece of authored key art
(`assets/title/keyart.jpg`) drawn as a plain `<img>` with `object-fit: cover`, with the menu
layered into the empty right third of the painting over a scrim.

The painting is 16:9, so anything narrower crops horizontally; `object-position` biases the
crop up and to the left, because the three figures sit left of centre and the right third is
ruins the menu covers anyway. Art that fails to load hides itself and falls back to the
gradient the section already paints, so a missing file costs the painting and nothing else.

## Dialogue portraits

`src/data/portraits.js` maps a speaker name to expression art. A line may name a mood with
`{ speaker, text, mood }`; an unknown mood falls back to `neutral`, and a speaker with no
entry hides the portrait slot entirely, so art for one character never obliges art for the
rest. The box is a flex row: with no portrait it lays out exactly as it did before.

Portraits are DOM images rather than canvas draws, so they stay sharp at any device scale and
carry the speaker's name as alt text.

A line may set `portrait: false` to withhold the portrait even when its speaker has one. The
opening needs this and it is not decoration: Elara's face is the thing that was taken from
Kael, and Caldris says so aloud two scenes later, so showing it in the memory would contradict
the plot. Caldris and Serac are voices over a black screen for the same reason. All three have
busts, for wherever they are actually present.

## Sprite directions

The character draw path takes `directions` from the manifest and `directionIndex` divides a
full turn by it, so **four directions have always been supported** — eight was an artefact of
the KayKit prerenderer, not a requirement of the engine. With `directions: 4` the row order is
S, E, N, W.

`tools/make-chibi-sheet.mjs` builds a four-direction sheet from a single front-facing figure.
Only south is drawn art; east is the figure narrowed, north is mirrored with the hood darkened
to a shadow, and west is mirrored and narrowed so the blade stays on the same hand through a
turn. Idle, walk and attack motion is applied per frame as bob, lean and squash, so a still
figure is never simply slid around.

The back holds up. The side does not, and the reason is anatomical rather than a matter of
tuning: a profile shows one arm, and a squeezed front view shows two, with both gauntlets.
East and west are honest placeholders until a side view is drawn. `docs/SPRITE_VIEWS.md`
carries the prompt for generating one.

The tool takes `--east` and `--north`, and skips deriving whichever is supplied, so authored
views drop in without rework.

Hand-authored sheets live in `src/data/chibiSprites.js` rather than `characterSprites.js`,
because the latter is rewritten by the prerenderer. `Sprites` merges the two with the
hand-authored entries winning.

## Sprite architecture

Generated 8-direction character sheets and authored enemy sheets both flow through `src/core/Sprites.js`. Missing art must fall back safely rather than block game startup.

The current third-party packs are placeholders and remain subject to the licensing/public-repository concerns recorded in `assets/ATTRIBUTION.md`.

## Audio architecture

Web Audio is created only after a user gesture, all of it synthesised, and it suspends while
hidden and fades rather than hard-cutting.

Every region has its own bed in `REGIONS`, differing in root, colour, wind and whether a bell
sounds, so locations are recognisable by ear. `setRegion()` crossfades between them and is a
no-op when the region has not changed. In-game beds carry a `level` under the title's, so
music sits beneath play rather than competing with it.

One-shot cues live in `CUES` and run through their own bus with its own analyser. The bed's
wind moves more than a cue adds, so a cue cannot be measured on the master tap; `sfxLevel()`
exists so cue output is observable in diagnostics and in tests rather than assumed.

The bed and the bell are built against whatever context they are handed, so the same
synthesis serves live playback and `render(seconds, rate, region)`, an offline audition.

## Viewport

`#app` is `position: fixed; inset: 0`, and the canvas backing store is sized from the canvas's
own measured box rather than `innerWidth`/`innerHeight`. Those can disagree on mobile, where
`100vh` exceeds `100svh` and the element ends up taller than the window; the browser then
rescales the backing store to fit the element, and the world draws off-centre and clipped.
Measuring the element makes that mismatch impossible.

## Touch

The movement stick is summoned wherever the left half of the screen is touched and follows the
drag from there, rather than living in a fixed corner, so the thumb never has to find it. Its
origin is clamped inside the viewport so a touch near an edge still has room to push in every
direction. The right half stays with the action buttons.

## Title / pause lifecycle

Gameplay does not update until the title starts a journey. The title never autosaves by itself.

Opening the Character menu pauses the gameplay simulation while leaving the world visible behind the UI. Menu state reads directly from the current save/player state rather than maintaining a competing progression copy.

## Development diagnostics

Optional diagnostics report frame timing, room/entry/player state, health/combat timers, progression, Resonance, entities, interactables, Resonance nodes, enemy states and flags.

World overlays include collision, exits, enemy/player hit areas, Sentry ranges, projectiles, switches and closed Archive doors.

Diagnostics remain off by default and should not add per-frame work while disabled.

## Cutscene contract

Major cinematic sequences should support input lock, camera focus, actor movement/facing, animation, dialogue, sound/music cues, world events, persistent flags, boss start and fade/shake operations. Retry behavior must be shortened/skippable where repetition would waste the player's time.

`src/core/Cutscene.js` implements the part of that contract the runtime can honour today:
input lock, dialogue, cue playback, flag writes, callbacks, and a screen-effect layer of
veil, letterbox, shake, colour inversion, glitch blocks, static, flash, vein lines and the
broken-circle glyph. Scenes are authored as data (`src/data/prologue.js`) rather than
hand-rolled in the runtime the way the Axiom awakening was.

Not yet supported, and named here rather than implied: camera focus and movement, actor
movement, facing and animation, and prop animation. Anything a scene needs from those is
currently staged with effects instead, and `docs/OPENING.md` records each substitution.

Cutscenes are skippable: holding the action control for 0.9 s fast-forwards the running
scene. A hold rather than a press, so a first-time reader can never skip by accident, and the
prompt only appears once a hold has begun so it does not advertise itself over a first read.
Skipping runs every remaining beat's flag writes and callbacks, so a skipped scene and a
watched one leave the world in the same state — only the dialogue and the waits are dropped.

Dialogue holds each line for a minimum of 420 ms before it can be dismissed. Without it a
player arriving from the title with a thumb already on the action button could mash past every
line of a scene without seeing one.

A scene is played through `playScene(scene, { once })`. The `once` flag is a Save V1 world
flag, so a scene the player has seen never replays — including after reloading mid-scene.
`playSequence` chains scenes and skips any already seen, which is what lets an opening
interrupted part-way resume rather than being lost. Resuming keys on an explicit
`prologue.started` marker, not on the absence of the completion flags — every save written
before the opening existed is also missing those, and resuming on that basis would teleport an
existing journey into the prologue.

While a scene runs the HUD and touch controls are hidden, the world does not simulate, and
movement, attack, Resonance, interaction and room transitions are all held. Diagnostics keep
running, because a cutscene is otherwise the one thing in the game that cannot be debugged.

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
