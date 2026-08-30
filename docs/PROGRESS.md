# VEILBOUND — Development Progress Log

This is the chronological implementation log for meaningful production milestones.

Use this file together with `ROADMAP.md`, `docs/VERTICAL_SLICE.md`, `docs/CANON.md`, `docs/ARCHITECTURE.md`, `docs/COMBAT.md`, `docs/PROGRESSION.md`, `docs/SUNKEN_ARCHIVE.md`, and `AGENTS.md`. Implementation completion and owner-device acceptance are always tracked separately.

---

## 2026-08-30 — v0.4.6 Kael walks, and the cast has faces

The owner said they felt stuck on Kael's sprites. The block turned out to be a false premise
I had helped install.

### Four directions were always supported

I had been saying an eight-direction sheet needed seven views nobody had. But the character
draw path takes `directions` from the manifest and `directionIndex` divides a full turn by it:
`directions: 4` has always worked, and gives rows S, E, N, W. Eight was an artefact of the
KayKit prerenderer, not a requirement of the engine. Nobody needed to draw eight views; they
needed a smaller number and a way to get there.

### One figure, four directions

`tools/make-chibi-sheet.mjs` builds a four-direction sheet from a single front-facing figure.
South is the art. East is the figure narrowed, which reads as a body turned away. North is
mirrored with the hood darkened to a shadow — a back view is the mirror of a front view for
anything asymmetric, and a deep hood seen from behind is exactly a shadow. West is mirrored
and narrowed so the blade stays on the same hand through a turn. Idle, walk and attack motion
is bob, lean and squash applied per frame, so a still figure is never merely slid around.

These are stand-ins, not a forged turnaround, and they hold up at 58px. The tool takes
`--east` and `--north` and skips deriving whichever is supplied, so authored views drop in
later without rework.

Kael now walks as himself. The sheet falls back to the old prerender if it fails to load,
which is the contract every other sprite works to.

### The bigger unlock

The upload was eight characters in one consistent style, not one. That closes the portrait gap
outright: Kael, Mira and Young Kael have faces in the dialogue box, and the whole cast has
busts ready.

Each image carried the character's name rendered into the bottom. That band is its own run of
non-empty rows, so it is detected and dropped rather than cropped by a guessed fraction.

### Caught before shipping: Elara must not have a face

Wiring her portrait in made the opening line of the game read `ELARA — Kael, look at me.` with
her face beside it. That contradicts the plot. Her face is precisely what was taken; Caldris
says so two scenes later — *without her face, he will never find the door* — and the blueprint
stages the memory with her face concealed.

A line can now set `portrait: false`, and Elara's memory lines, her bell whispers, and Caldris
and Serac's voices over the black screen all do. They have busts for wherever they are actually
present. The system had to learn to withhold, which is a better feature than the one I set out
to build.

### New names

Orin and Tomas arrived with the cast and appear in no script. `docs/CANON.md` records that
nothing about either is canon, the same way it did for Mira before the opening defined her.

### Verification
- The `portrait` suite now checks the withholding as well as the showing: Kael and Mira are
  seen, Elara is not in the memory, the void is voices rather than faces, and Elara still has
  a bust for later.
- Kael's four directions were walked in-game and captured.
- Every suite passes.


## 2026-08-30 — v0.4.4 Both Kaels

The owner supplied adult Kael, which resolves the question the previous entry raised the wrong
way round. The two labels — "Young Kael", then "Adult Kael" — map exactly onto the two speakers
the opening script already has, `YOUNG KAEL` and `KAEL`, so both now have a face.

I had reasoned that the first figure could not be the younger Kael because it carries the
Axiom, and left the child speaker without a portrait on that basis. It was the younger Kael;
the gauntlet on him is the owner's design, not an error.

### The figures

Adult Kael is dark scaled and tattered layers, a steel half-mask, the Axiom set with blue
stones, and the Shardblade lit and crackling. The younger is the green hood with green stones.
Both arrived as RGB with the background painted in rather than as alpha, and both were keyed,
trimmed and cropped the same way.

The bust crop needed rethinking. The flare heuristic that found the shoulder line on the pixel
figure — the first row wider than two-thirds of the frame — reads a gradual painted cloak as a
shoulder and cut a half-body. Both busts are now anchored on the head: centred on the figure's
own axis measured from the top rows, where only the hood is in frame.

### Wired

`KAEL` takes the adult bust, `YOUNG KAEL` the younger, and every other speaker still correctly
shows none. The character menu takes the adult. Nearest-neighbour scaling came off both slots:
it is right for the pixel figure and wrong for the painted one, and the painted one is what the
menu shows.

### The register conflict got sharper, not softer

The two figures are drawn in different registers — the younger in pixel art, the adult
painted — and they now appear in the same dialogue box within one scene of each other. The
adult agrees with `ROADMAP.md` 2.14; the younger does not. Recorded in `docs/OPENING.md` and
`assets/ATTRIBUTION.md` rather than resolved unilaterally.

Also noted in `docs/CANON.md`: the Axiom's stones read green on the younger figure and blue on
the adult. If that is deliberate it is a good visible marker of the gauntlet waking, which is
what `AGENTS.md` asks for under progression being visible on the hero. If it is an artefact of
how the two were made, it should be reconciled.

### Verification
- The `portrait` suite now covers both: adult Kael's lines take the adult bust in the Hunter
  Hall, young Kael's take the younger in the memory, and Elara and Mira still show none.
- Every suite passes.


## 2026-08-30 — v0.4.3 Kael has a face, or the absence of one

The owner supplied two images of Kael and the blueprint's portrait system finally had
something to show.

### Getting the art usable

The first image's transparency was a checkerboard **painted into the picture** — it arrived as
RGB with no alpha channel at all, so dropping it in would have put a grey chequered square
behind him. The checkerboard was keyed out by colour, the figure trimmed to its own bounds,
and a head-and-shoulders bust cut by measuring where the cloak first flares wider than the
shoulders rather than by guessing a fraction of the height.

### Portraits

`src/data/portraits.js` maps a speaker to expression art, which is the blueprint's "expression
frame swappers" contract. Kael has `neutral`; every other speaker has no entry and correctly
shows no portrait, so the box lays out exactly as it did before for them. That matters more
than it sounds: art for one character must never oblige art for the rest.

The character menu's portrait frame had been stepping through Kael's placeholder KayKit idle
sheet. It now shows the authored figure.

### Two things flagged rather than decided

**The art is pixel art, and `ROADMAP.md` 2.14 settles the register as painted** — a rule the
owner set two milestones ago. Both cannot be right. It is wired in as-is because it is
enormously better than what it replaced, and the conflict is recorded in `docs/OPENING.md`.

**It was labelled "Young Kael", but it is adult Kael.** It carries the Axiom gauntlet and, in
the second image, the mask and the Shardblade — and the child in Scene 1 has none of those:
the Axiom awakens years later in the Forgotten Relic Chamber. `YOUNG KAEL` is a separate
speaker in the script and is deliberately left without a portrait rather than given one that
contradicts the story it appears in.

### Verification
- A new `portrait` suite: Kael's lines show the bust, it is the file we cut, Mira's lines show
  none, and the image actually decodes.
- Every suite passes.

### Owner-device acceptance — PENDING
- [ ] The portrait reads at phone scale beside the text.
- [ ] The hooded void face is legible rather than muddy at the smallest size.


## 2026-08-30 — v0.4.2 The opening, made survivable

Asked what else the opening needed, I probed it instead of guessing, and found three real
defects.

### A player could miss the entire opening without noticing

Coming off the title the thumb is already on the action button. There was no minimum display
time on a dialogue line, so mashing dismissed each one the frame it appeared: a measured
masher saw **0 of 15 lines**. Lines now hold 420 ms before they can be dismissed. The same
masher now sees ten in six seconds.

### Nothing was skippable

`docs/ARCHITECTURE.md` has required retry-aware, skippable cinematics since v0.1.0, and a
readable playthrough of the first two scenes ran **47 seconds with no way out**. Holding the
action control for 0.9 s now fast-forwards the running scene, with a fill bar that only
appears once a hold has begun so it never advertises itself over a first read. On touch the
hold works anywhere on screen, because the action button is hidden during a scene.

Skipping runs every remaining beat's flag writes and callbacks, so a skipped scene and a
watched one leave the world identical — only the dialogue and the waits are dropped. A skip
must be faster, not different.

### Closing the tab during the opening lost it permanently

The intro only ran from a new game, and the save had already recorded the forest path with no
flags. Reopening and pressing Continue dropped the player onto the path having never seen the
memory or the void, with no way to reach them. `playSequence` now chains the scenes and skips
the ones already seen, so an interrupted opening resumes.

### The bug in the fix

Keying the resume on "the completion flags are missing" was wrong, and the suites caught it
immediately: **every save written before v0.4.0 is also missing them**, so loading an existing
journey teleported it to the forest path and played the intro at it. Nine suites failed at
once. The resume now keys on an explicit `prologue.started` marker, written and saved before
the first beat, which distinguishes "part-way through the opening" from "predates it".

### Verification
- A new `prologue3` suite: mashing still shows the lines, a hold skips and records the scene,
  skipping the whole intro lands in a lit playable world, an interrupted opening resumes, and
  a finished one does not replay.
- Every suite passes. Five had dialogue-advance timings faster than the new 420 ms hold; those
  were encoding the old behaviour and were updated, not the gate.

### Owner-device acceptance — PENDING
- [ ] The hold-to-skip feels deliberate rather than fiddly on a phone.
- [ ] 420 ms per line does not feel sticky when re-reading.


## 2026-08-30 — v0.4.1 Painted, and the screen comes back

Two owner corrections.

### The screen stayed black after the intro

Real bug, and mine. The sequencer was only ticked while a scene was running: the runtime asked
`Cutscene.active()` before calling `update()`, and `update()` returned early with no script.
So when the last scene called `finish()` and blanked its effect targets, nothing ever moved
the current state toward them. The veil sat at 1 and the player was left walking an invisible
forest path.

Three fixes, because one would have been the narrow one:

- The sequencer now eases every frame, whether or not a scene owns the screen, and the runtime
  ticks it until it reports `settled()`. A leftover effect can no longer strand the view.
- The ease snaps its tail. An exponential ease never reaches zero, and a veil resting at 0.004
  is still a veil.
- `play()` no longer resets the current effect state, only the targets. Chaining the memory
  straight into the void had been blinking the world into view for a few frames between them.

And in the data, the void now lifts deliberately onto the forest path rather than ending on
full black and hoping — which is what exposed the engine bug in the first place.

`prologue` now measures the mean luminance of the canvas after the intro and fails if the
screen is dark, which is the assertion that would have caught this.

### VEILBOUND is painted

The owner settled the direction conflict raised in the previous entry: **painted, not pixel
art.** Recorded as `ROADMAP.md` 2.14, in `docs/CANON.md` under a new Visual register section,
and in `AGENTS.md`, whose WRAITH rule had said only "avoid generic fantasy pixel art" and now
states the register outright.

`docs/OPENING.md` keeps the blueprint's beat prompts verbatim as staging direction — shot,
framing, subject, mood — with a note that every "16-bit", "SNES" and "pixel" in them is
superseded. It also records what this settles beyond the opening: the procedural rooms with no
plate yet are placeholders for painted plates, not for pixel tilesets.

### Verification
- Every suite passes, including the new luminance check.

### Owner-device acceptance — PENDING
- [ ] The intro hands the screen back cleanly on device.
- [ ] The lift onto the forest path reads as a fade, not a cut.


## 2026-08-30 — v0.4.0 The opening

The owner supplied the complete opening as a six-scene production blueprint. All of it is in,
every line of dialogue word for word, and the game no longer begins in Greyhaven — it begins in
a dark room with Kael's mother.

### A cutscene sequencer, at last

`src/core/Cutscene.js` and `src/data/prologue.js`. Scenes are authored as data: each beat may
carry screen effects, an audio cue, a flag write, a callback, dialogue that holds the beat
until it is read, or a timed wait. `ARCHITECTURE.md` has specified a cutscene contract since
v0.1.0 and the runtime had been meeting it with one hand-rolled function; this generalises that
function and the Axiom awakening is the obvious next thing to move onto it.

The effect layer is veil, letterbox, shake, colour inversion, glitch blocks, static, flash,
red vein lines and the broken-circle glyph — enough to stage every beat the blueprint asks for
that does not need a camera or an animated actor. What it cannot do is written down in
`docs/OPENING.md` beside the prompt that asked for it, rather than quietly skipped.

Every scene is guarded by a Save V1 world flag, so none replays — including after a reload
mid-prologue.

### What the blueprint asked for that this is not

The blueprint is written for generated pixel video and generated audio, and specifies 16-bit
SNES pixel art. This game has no video pipeline, synthesises all its audio, and now ships
high-resolution painted plates. The prompts are preserved in `docs/OPENING.md` as art and audio
direction, each with the substitution named. The pixel-art-versus-painted question is a real
direction conflict and is flagged there rather than decided here.

Three things in the blueprint are deliberately unbuilt, and listed: Scene 4's four interactive
points, because no dialogue was written for them and inventing it would put words in SCRIBE's
mouth; character portraits and expression frames; and Elara's melody, which should be the theme
the bell later rings.

### New canon

`docs/CANON.md` gains Elara, Caldris, Serac, Kael's removed memory, and — at last — Mira, who
had been on the title screen for two milestones with a note saying nothing about her was
established. Lyra still has nothing, and still says so.

### Bugs found while building

- The black veil was painted over the effects rather than under them, so it buried the very
  glitch blocks and vein lines it was meant to sit behind. That had forced the veil to be
  partial, which let the world show through a scene it is not in — adult Kael standing in his
  own childhood.
- The HUD and touch controls stayed up through the cinematics.
- Diagnostics stopped updating during a cutscene, because the update loop returns early. A
  cutscene was the one thing in the game that could not be debugged, which cost real time
  here: a stale overlay made a working transition look broken.
- The Hunter Hall door was authored twice into something solid — first inside the house's own
  collision rect, then directly behind a solid NPC standing at (645,328). The second one was
  invisible to the offline geometry audit, which only knew about walls.

### Verification
- The geometry audit now also knows about solid interactables, and checks that an exit is
  reachable rather than that its centre is standable — a door flush against a building has an
  unstandable centre by design.
- Two new suites. `prologue` plays a new game and checks all fifteen lines of Scenes 1 and 2
  against the blueprint verbatim, in order, and that it ends with Kael on the forest path.
  `prologue2` covers the rest: the vision firing once and not twice, the creature's line after
  its defeat, the title card raising and lowering itself, and all twelve lines of the Hunter
  Hall and the tolls, ending with the objective banner.
- Every existing suite passes. One audio assertion was updated rather than deleted: it
  expected New Game to hand the title bed to Greyhaven's, and a new game now opens on the
  memory instead.

### Owner-device acceptance — PENDING
- [ ] The opening reads at phone scale, and the dialogue is legible over the effects.
- [ ] The bell toll has weight on a phone speaker.
- [ ] The glitch and inversion do not induce discomfort at full brightness.
- [ ] The prologue can be reloaded partway through without replaying what was seen.


## 2026-08-30 — v0.3.6 The right Field 1

The owner supplied the actual Field 1 plate and said plainly what the previous entry got
wrong: the roads-and-walls picture is town land, not a field. Both mistakes were mine, in
opposite directions — first I called it the town's ground layer, then, told the remaining two
plates were the fields, I moved it to Hollow March rather than questioning which two.

The two fields are a matched pair of rainswept wilderness: one with a sunken jogged road and
its Vein shrine south-east, one with a straight road and its shrine standing north of it.
They share a palette, a weather, and a scale, which the roads plate never did — it shares all
of those with Greyhaven, which is what misled me twice.

- **Field 1** takes the straight-road plate. Its shrine stands north of the road as scenery.
- **Field 2** keeps the sunken-road plate, whose shrine sits south of the road on the same
  side as the Archive descent that `march.field2.veinMarker` reveals.
- `greyhaven/town-ground-only.png` goes back to being a Greyhaven reference layer, unwired.

### Field 1's collision, authored to the real painting

Six obstacles rather than the four corner trees the roads plate had: the Vein shrine, a stump
and a boulder north of the road, the pine's trunk, and a boulder and stump south of it. The
road is clear across the full width, and both exit bands sit on it.

The pine blocks at its trunk, not its canopy — the lesson from the previous entry, applied
first time here rather than after a suite failed two rooms away.

### Note for a later pass

Field 1's Vein shrine is prominent, lit, and carries a glowing rune tablet, and Field 1 has no
Resonance node. Reading it is an obvious beat, but it is authored content nobody has asked
for, so it is recorded here rather than invented.

### Verification
- The offline geometry audit passes on both fields, including every position the browser
  suites seed.
- `fields2` still walks the whole route: Field 1 west to Greyhaven and back, east to Field 2,
  Resonance at Field 2's shrine, the descent into the Archive.
- Every suite passes with no change to any assertion. Nothing in the previous milestone's
  machinery needed rework — only which file each field names.

### Owner-device acceptance — PENDING
- [ ] Field 1 and Field 2 read as different places rather than one plate reused.
- [ ] Kael reads against both at phone scale.
- [ ] The Field 1 shrine does not look like it should do something yet.


## 2026-08-30 — v0.3.5 The Hollow March is painted

Correction to the previous entry: two of the eleven uploads were Hollow March fields, not a
town base layer and a spare. I read the roads-and-walls plate as Greyhaven with its buildings
stripped out, because it shares the town's stonework. It is a field.

### Which painting is which field

Both plates run their road through the west and east exit bands the fields already had, so
either assignment works structurally and the choice is an authoring one. As assigned:

- **Field 1 — the crossroads.** Continuous with the Greyhaven plate: same stonework, same
  boundary walls, same fences. It reads as the field immediately outside town.
- **Field 2 — the rainswept one.** It carries the Vein crystal shrine, which is exactly what
  `march.field2.veinMarker` reads, and CANON has the March begin peaceful and grow unsettling
  as Vein activity returns.

Swapping them is exchanging two `file` values in `src/data/roomArt.js`, and the module says so.

### Collision now follows the paintings

Both fields previously carried arbitrary invisible obstacle boxes — three each, in places
nothing was ever drawn. Those are gone. What blocks now is what the paintings show: four
corner trees in Field 1; the pine's trunk, the Vein shrine, and two boulders in Field 2.

`march.field2.veinMarker` moved from empty grass at (555,260) onto the painted shrine at
(712,356), and its radius went from 34 to 86 — the shrine is solid now, so the pulse has to
reach it from outside its own collision box. The Archive descent still opens where it did.

### Bugs found while building

- The props pass was still drawing the old CraftPix forest scenery over the paintings: bright
  cartoon bushes and boulders in a different art style, on top of a painted field that has its
  own. A painted room now skips its decorative props for the same reason it skips its terrain
  and its wall fill.
- The pine's collision box covered the whole canopy down to the base, which blocked open
  ground the painting shows as walkable — including a spot the `all` suite has always seeded.
  Save recovery correctly rescued the player to Greyhaven, which surfaced as an unrelated
  sentry-readout failure two suites away. A tree blocks at its trunk, not its canopy.

### Verification
- The offline geometry audit now also checks every position the browser suites seed directly,
  so re-authoring a field's obstacles can never again quietly strand one of them in a wall.
- A new `fields2` suite walks the real route: Field 1 west to Greyhaven and back, east to
  Field 2, Resonance at the painted shrine writing the route flag, the descent into the
  Archive, and the shrine stopping Kael rather than being scenery.
- Every existing suite passes. Two `roomart` assertions were updated rather than deleted:
  they hardcoded a single plate and there are three.

### Owner-device acceptance — PENDING
- [ ] Both fields read at phone scale, and Kael reads against them.
- [ ] The sunken road in Field 2 does not look like it should block movement.
- [ ] The Vein shrine reads as the thing to use Resonance on.
- [ ] Three ~430 KB plates do not stall room transitions on mobile data.


## 2026-08-30 — v0.3.4 Greyhaven is painted

The owner supplied eleven map images "to try and replicate greyhaven". Three of them are
full-town plates, and the layout in them is not a coincidence: they were painted from this
room's authored collision. Overlaying the room's eight building rects on the plate stretched
to 960x540 puts every one of them on its building — inn, lift gate, three market stalls,
workshop, house, bell tower. A uniform crop does not do that. So the plate is stretched, and
Greyhaven now paints it instead of its procedural art.

Two measurements decided the approach before any code was written:

- **Scale.** The figures painted into the town measure 61-69 world units tall. Kael draws at
  58 and NPCs at 54. The plate's implied character scale is the game's own, so nobody stands
  in this town looking like a giant. That was the single biggest risk and it was already right.
- **Aspect.** The plate is 2.16 against the world's 1.78, so stretching squashes it about 18%
  horizontally. Visibly fine, and it is what keeps art and collision agreeing.

### Which plate, and why the gate is drawn rather than swapped

Of the three town plates, only the dormant one is usable: the lit one has NPCs painted into
it that would fight the game's own NPC sprites at the same positions.

The obvious idea — ship both and swap on `story.axiomAwakened` — does not survive contact
with the files. Diffing them, 14% of pixels differ and the changed region covers the whole
image, so they are independent generations, not one render with the gate relit. Their grass,
puddles and lighting do not match, so neither compositing a crop nor cross-fading them works.

Instead the town keeps one plate and the engine lights the gate: a flag-gated radial glow
composited in `lighter`, shaped as a core inside an annulus because the painted door is
concentric rings and an even blob just fogs the stone. `docs/CANON.md` asks that Greyhaven
change over the course of the game; this is the first time it visibly does.

### The general mechanism

`src/data/roomArt.js` and `src/core/RoomArt.js` are new and reusable — any room can name a
plate. Painting one skips that room's ground fill, terrain tiler and details pass, and its
wall-rect fill, since in a painted room the buildings are the art. Collision is untouched.

### Bug found while building

- The room's wall rects were still being filled with flat `#111817` over the plate, hiding
  the painted buildings and the gate glow with them. Only visible once real art was behind
  them; the procedural rooms had always drawn their walls that way because there was nothing
  underneath to hide.

### What is not wired, and why

`march-field.png` is a rainy field with a broken road, a pine and a Vein crystal shrine. Its
obstacles do not line up with the authored collision of either Hollow March field — checked
the same way as Greyhaven, and the boxes land on open grass while the real obstacles sit
elsewhere. Wiring it would ship art that disagrees with the walls, which is the thing
`docs/SUNKEN_ARCHIVE.md` forbids. It needs a room authored to it, or its walls re-authored to
the painting; either is a deliberate piece of work rather than a drop-in.

The seven building elevations are likewise unused. They are front-facing sprites of the
structures already baked into the town plate, so they are material for a future room, not for
this one.

### Also
- The eleven uploads had UUID filenames and a stray 5-byte `Files`. Renamed to what they are;
  the junk file is gone.
- `/favicon.ico` had always 404'd, which surfaced as a console error in the `town` suite once
  timings shifted. An inline SVG diamond replaces it, so the suites stay trustworthy.

### Verification
- A new `roomart` suite: the plate loads and paints, buildings are art rather than flat wall
  blocks, the gate is measurably cyan only once the Axiom wakes (delta 117 on the blue/green
  axis), a blocked plate falls back to the procedural town with no fatal error, and rooms
  with no plate are untouched.
- Every existing suite passes. Two failures during development were the test's fault, not the
  code's: both seeded the Vestibule at a position inside a wall — one of them inside the
  closed south seal — and the save-recovery path correctly rescued the player to Greyhaven.

### Owner-device acceptance — PENDING
- [ ] The painted town reads at phone scale, and Kael reads against it.
- [ ] The horizontal squash is not noticeable in play.
- [ ] The lift gate visibly wakes after the Axiom does.
- [ ] The 423 KB plate does not stall the first entry to Greyhaven on mobile data.


## 2026-08-30 — v0.3.3 The threshold: landscape lock and a cast on the plate

### The game now insists on landscape

Two mechanisms, because neither works everywhere. The real `screen.orientation.lock` is
attempted quietly on the first user gesture; Android Chrome grants it to a fullscreen
document, and iOS Safari has no such API at all. Underneath it sits a blocking overlay for
any portrait viewport, which is what actually holds on iPhone and also covers the moment
before a granted lock takes effect. Neither is announced to the player when it fails.

Only devices that can rotate are held — touch capability and no fine pointer. A tall desktop
window has a mouse, and telling someone with a mouse to rotate their monitor is nonsense.

While the gate is up the simulation does not advance, held input is cleared, a running game
autosaves and audio suspends: the same treatment as backgrounding the tab. It uses its own
flag rather than the pause-menu flag, so rotating with the menu open comes back to the menu.

### A start screen built on the owner's key art

The title is the supplied painting — Kael hooded and masked between Lyra and Mira, above a
ruined Eidol under an eclipse — with the menu set into the empty right third over a scrim, as
asked. START, CONTINUE (naming the room and health it resumes to, shown only when a save
exists) and SETTINGS, right-aligned with the accent and the hover motion mirroring that edge.

The painting is 16:9. Anything narrower crops horizontally, so `object-position` biases the
crop up and to the left: the three figures sit left of centre, and the right third is ruins
the menu covers anyway. Without that bias a 4:3 tablet cut Lyra in half at the left edge.
Committed as a 315 KB JPEG rather than the original 2.9 MB PNG, because it is the first thing
a phone downloads.

This pass first shipped three offline-rendered character portraits in a lineup; the key art
replaced them the same day. The portraits and `tools/prerender-portraits.mjs` were removed
rather than left as dead assets, and are in git history if that approach is wanted again.

### Lyra and Mira are named and gendered, not defined

Neither name existed anywhere in the repository before this milestone. Both are women; Kael is
a man, as `docs/CANON.md` already had him. Nothing else about them is canon — no role, no
relationship to Kael, no dialogue — and CANON records that explicitly rather than letting an
invented backstory settle in by default.

### Bug found while building

- The orientation module named its overlay element `screen`, shadowing the global `screen`
  the lock call needs. Caught before it ran; `window.screen` is now addressed explicitly.

### Verification
- A new `orientation` suite: a portrait phone is gated and its taps are intercepted, rotating
  clears the gate and restores the title, a tall desktop window is never gated, and a running
  game neither advances nor loses its position across the gate.
- A new `titlecast` suite: the key art decodes, covers the plate, and every visible button
  lands in the right half without clipping the edge; START/CONTINUE/SETTINGS behave with and
  without a save; Settings still opens and returns.
- Every existing suite passes. The three portrait-mode phone cases were rewritten rather than
  deleted: in portrait they now assert the gate, which is the new correct behaviour, and their
  landscape cases are unchanged. `title-phone` was also calling an `enterGame` helper it never
  defined; that call is gone.

### Owner-device acceptance — PENDING
- [ ] Turning the phone upright during play shows the gate and gives the game back on return.
- [ ] The lock holds on Android; the overlay is the whole story on iPhone.
- [ ] The key art crops well on a real phone, with all three figures kept.
- [ ] The menu stays legible against the painting in daylight.
- [ ] START / CONTINUE / SETTINGS are all reachable one-handed in landscape.


## 2026-08-30 — v0.3.2 The Cistern wing

Three new Sunken Archive rooms, and the puzzle module the design doc had been asking for.

### The primitives moved out of the runtime

`src/core/Puzzles.js` now owns doors, switches, push blocks and routed water for every room.
`src/main.js` supplies the wall query and reacts to activation — feedback, flags, saving — and no
longer implements mechanism behavior. `docs/SUNKEN_ARCHIVE.md` and `docs/ARCHITECTURE.md` had both
recorded this as the thing to do before the dungeon grew more puzzle types; it grew three today.

### Cistern Walk — teach the block

A plate that ignores the player entirely (`needsBlock`) and one block heavy enough to hold it. The
plate cannot be solved by standing on it, which is what makes the block the answer rather than a
thing to stand on. Seating it latches `archive.cistern.sealOpen`; the seal and its exit read that one
flag, so they cannot desynchronize.

### Sluice Gallery — teach the valve

Resonance has only ever read things. Here it operates one: a channel of deep water is impassable
until `archive.sluice.drained`, and the valve node north of it writes that flag. Water art and
collision still come from a single authored rectangle, as with the static Archive water.

### Reliquary Span — combine, and close the loop

Valve, block and plate together, under a live Husk and Vein Sentry. Drain the channel, push the
block south across it onto the plate, and `archive.span.shortcutOpen` opens a two-way door back to
the Vestibule. The wing becomes a loop rather than a corridor walked twice.

### Bugs found while building

- Pushing crawled at half speed: the block and the player were advancing on alternate frames.
  `push()` now returns the distance the block actually moved and the pusher travels with it.
- Removing the old inline door handling left two debug call sites referring to the deleted local
  `closedDoors`, which threw only inside Archive rooms. Rewired to `Puzzles.closedDoors(room)`.
- The Span's shortcut door had no gap in the west wall to sit in — the wall was one unbroken rect.
  Split into two.
- Arriving in the Vestibule through the shortcut landed Kael 7px from the return trigger, which
  bounced him straight back. The west exit moved south of the alcove and the arrival spawn with it.

### Verification
- 76 checks across ten suites, zero failures, no page errors.
- Every new room's geometry checked programmatically before authoring: no plate, block, valve, spawn
  or door overlaps a wall, and every block has clearance on the axis it must be pushed along.
- The block cannot be pushed into a wall, into another block, or across undrained water.
- Flags survive room change and Save V1 reload; blocks reset on entry, per rule 2.5.

### Owner-device acceptance — PENDING
- [ ] The plate reads as needing weight, not a footstep, at phone scale.
- [ ] Pushing feels responsive on touch, including against a wall.
- [ ] Flooded and drained channels are distinguishable at a glance.
- [ ] The Span stays fair with both enemies live while pushing.
- [ ] The shortcut is understood as a shortcut rather than a wrong turn.


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

Lives in `ROADMAP.md` § 10, which is the single copy. This log records what happened; the
roadmap records what happens next.
