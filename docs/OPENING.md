# VEILBOUND — The Opening

Owners: **SCRIBE / SPECTER / ECHO / WRAITH**
Status: **IMPLEMENTED — v0.4.1-prologue**

The opening was supplied by the owner as a six-scene production blueprint. Every line of
dialogue in `src/data/prologue.js` is reproduced from it word for word, and no line has been
added, cut or paraphrased.

## What the blueprint asked for, and what shipped

The blueprint is written for a generated-video and generated-audio pipeline: each beat carries
a *Visual Prompt* and an *Audio Prompt*. VEILBOUND has neither. It is a zero-build Canvas 2D
game whose audio is wholly synthesised at runtime and whose launch contract forbids a build
step (`ROADMAP.md` 2.1–2.2).

So the beats are staged with the effects the engine actually has, and the prompts are kept
below as the art and audio direction for whoever produces the final assets. Where a prompt
asks for something the runtime cannot draw, the substitution is named.

## Art direction — SETTLED

The blueprint's beat prompts specify **16-bit SNES pixel art**. The owner has since settled
this the other way: **VEILBOUND is painted, not pixel art.**

That decision is authoritative and applies to everything, not only the opening. The prompts
below are kept verbatim as staging direction — shot, framing, subject, mood — but every
"16-bit", "SNES" and "pixel" in them is superseded. When these beats are finally produced,
they are produced in the same high-resolution painted register as the title key art, the
Greyhaven plate and the two Hollow March fields.

This also resolves what the runtime should aim at. The procedural rooms that have no plate
yet — The Forest Path, the Hunter Hall, the Sunken Archive — are placeholders for painted
plates, not for pixel tilesets.

## The scenes as implemented

| Scene | Where it plays | Trigger | Flag |
|---|---|---|---|
| 1. Remember My Face | full screen, black | starting a new journey | `prologue.memorySeen` |
| 2. The Void | full screen, black | straight after Scene 1 | `prologue.voidSeen` |
| 3. The Flash Vision | The Forest Path | walking east past x 320 | `prologue.visionSeen` |
| 4a. The Creature | The Forest Path | defeating the Vein-Corrupted | `prologue.creatureHeard` |
| 4b. Title Drop | Greyhaven | arriving from the west | `prologue.titleShown` |
| 5. Hunter Hall | Hunter Hall | first entry | `prologue.hallMet` |
| 6. The First Toll | Hunter Hall | straight after Scene 5 | `prologue.tolled` |

Each flag is a Save V1 world flag, so a scene the player has seen never replays — including
after a reload mid-prologue. That is the retry-aware behaviour `docs/ARCHITECTURE.md`'s
cutscene contract asks for.

## Beat direction, preserved

### Scene 1 — "Remember My Face"

**Beat 1 — The Dark Room.** *Visual:* cinematic letterbox, dark
pitch-black room, subtle soft rain particle effects overlays, deep shadows, dramatic rim
lighting. *Audio:* soft rain falling, low female voice humming a haunting minor-key melody,
quiet child breathing.
*Shipped as:* full black veil, letterbox bars, the Archive/ruin bed. No rain particles and no
hum: the audio engine synthesises tones and filtered noise, and has no voice.

**Beat 2 — The Glitched Memory.** *Visual:* low-angle medium shot, young pixel child sitting
on floor, mother figure kneeling holding his face, heavy tears, animated black glitching pixel
blocks concealing the mother's face, moving red energy lines pulsing through cracks in wooden
floorboards. *Audio:* subtle mechanical rhythmic thrumming swelling from below, wood creaking.
*Shipped as:* the glitch-block and red vein-line effects, both animated, over the black. There
are no character sprites for Elara or young Kael, so the scene is played entirely in the
concealment the blueprint describes — the face is never shown because there is no face yet.

**Beat 3 — The Departure.** *Visual:* camera jitter, heavy screen shake, silhouette of door
shaking under violent heavy pounding, high contrast pixel lighting, mother placing hand on
child's forehead. *Audio:* heavy muffled wood door pounding.
*Shipped as:* two screen-shake impulses with the impact cue, veins driven up under them.

**Beat 4 — Erased.** *Visual:* flash of a glowing white pixelated broken-circle symbol across
black, mother sprite dissolves into static noise pixels, screen violently cuts to pitch black.
*Audio:* abrupt sharp audio glitch cut to dead silence.
*Shipped as:* the broken-circle glyph is drawn procedurally, then replaced by the static
field, then hard black.

### Scene 2 — The Void

*Visual:* pure black screen, subtle CRT monitor scanline overlay, static noise artifacts.
*Audio:* heavy analogue radio static, deep metallic hums, cold mechanical voice distortion.
*Shipped as:* the static effect, which is scanlines plus noise, over full black.

### Scene 3 — The Forest Path

**Beat 1 — Walking the Mud.** *Visual:* side-scrolling tracking shot, adult protagonist in
green hood and face mask, damaged sword across back, walking alone in dark forest, heavy rain,
red vein of light moving under mud. *Audio:* rain on leaves, wet footsteps, low mechanical
whine under the earth.
*Shipped as:* playable rather than a tracking shot — the room is `THE FOREST PATH`, and Kael's
sprite already carries the hood, mask and blade. The room uses procedural field art; no plate
has been painted for it.

**Beat 2 — The Flash Vision.** *Visual:* rapid one-frame strobe cuts of five images.
*Shipped as:* five hard flashes, each with the image named in a line of text. The runtime
cannot show five painted images it does not have, and a nameless strobe communicates nothing,
so the vision is read rather than watched. **Replace these with the images when they exist.**

### Scene 4 — Interactive Segment & Greyhaven Reveal

*Directives:* player takes control; interactive points (blank tombstone, broken star symbol,
cart, humming roots); defeat a Vein-corrupted creature.
*Shipped as:* the creature, as enemy type `corrupted`, and its post-combat line. **The four
interactive points are not built** — they are authored content with no dialogue written for
them in the blueprint, and inventing it would put words in SCRIBE's mouth.

**Beat 2 — Title Drop.** *Visual:* wide cinematic pull-back, hilltop overlooking the town at
dusk, cozy orange window lights against dark wet forest, dead bell tower, faint red glow
beneath the mountain. *Audio:* soft melancholic piano/synth playing Elara's melody.
*Shipped as:* the letterboxed Greyhaven plate — which already has the lit windows and the bell
tower — dimmed, with the title card over it. There is no camera, so no pull-back. **Elara's
melody does not exist yet**; ECHO owns writing it, and it should be the theme the bell later
rings.

### Scene 5 — Hunter Hall

*Visual:* medium interior shot, wooden tavern/hunter hall, character portrait dialogue boxes,
expression frame swappers (Kael neutral/tired, Mira stern/concerned).
*Shipped as:* a real room, `GREYHAVEN — HUNTER HALL`, entered from the front of the house on
the south side of the town square. **No portraits and no expression frames** — the dialogue
system is a speaker name and a line. Portraits are a WRAITH deliverable.

### Scene 6 — The First Toll

**Beat 1 — The Ring.** *Visual:* screen shake, full-screen colour inversion pulse, characters
freezing. *Audio:* massive deep echoing bronze bell toll with heavy reverb.
*Shipped as:* shake plus a real colour-inversion pass, and a new `bell` audio cue built from
the same partials as the ambient bell in the region beds — so the tower Kael can see in
Greyhaven and the toll he hears here are audibly one instrument, an octave lower and far
longer.

**Beat 2 — The Second Toll & Flashback.** *Visual:* second bell impact, ghosted childhood home
overlaid. *Shipped as:* the second toll with the glitch and black of Scene 1 briefly returning.

**Beat 3 — The Relic Breaks.** *Visual:* wooden case drops and shatters, glowing broken-circle
artifact hovers and pulls hard toward screen left, all town lights black out.
*Shipped as:* the broken-circle glyph returns, then the veil closes. **The case, the hover and
the leftward pull are not animated** — there is no prop or actor animation system.

**Beat 4 — The Third Toll & Underground Awakening.** *Visual:* screen dark except glowing red
veins under the floorboards. *Audio:* third toll blending into a deep bass roar from beneath.
*Shipped as:* exactly that — third toll, near-full black, veins at full.
*UI:* `OBJECTIVE UPDATED: FOLLOW THE BELL'S MEMORY`, as specified.

## What this adds to canon

`docs/CANON.md` records the new names and what is and is not established about them. In short:
**Elara** is Kael's mother and the source of the memory; **Caldris** and **Serac** removed it;
**Mira** is now defined, which she was not before. Kael's amnesia, the broken-circle symbol and
the bell as a summons are all new and all load-bearing.

## Still to build

- The four Scene 4 interactive points, once someone writes what they say.
- Character portraits and expression frames for the dialogue box.
- Elara's melody, and the bell ringing it.
- Painted plates for The Forest Path and the Hunter Hall.
- Art for the Vein-Corrupted, which currently borrows the March Husk's sheet.
