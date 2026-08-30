# Generating Kael's side and back views

Owner: **WRAITH / FORGE**
Status: **BACK DERIVED — SIDE NEEDS ART**

## Where this stands

Kael's four-direction sheet is built from a single front-facing figure by
`tools/make-chibi-sheet.mjs`. Two of the three derived views are honest; one is not.

**North (back) — good enough to keep.** Mirroring is correct for anything asymmetric, so the
blade and the Axiom land on the right sides. The hood is closed with fabric sampled from the
hood itself, shaded top-to-bottom and given the centre seam a hood has. It reads as the back
of a head rather than a hole punched in the character.

**East and west (side) — placeholders.** They are the front view narrowed to 74%, with the
hood closed. The giveaway is anatomical and no amount of tuning fixes it: **a profile shows
one arm, and a squeezed front view shows two**, with both gauntlets. Squeezing harder was
tried at 52% and is worse — it reads as a compression artefact rather than a turn.

So a side view has to be drawn. It is the one thing the derivation cannot invent.

## What to generate

One image is enough to fix both east and west, because west is the mirror of east.

Ask for **the same character, same style, same scale, seen from his left side in strict
profile**, and include the details the front view establishes so the generator keeps them:

> Full-body pixel-art chibi character, strict side profile facing right, same art style and
> proportions as the reference. Hooded figure in a tattered dark-olive cloak over black
> layered armour, steel half-mask under a deep hood, ornate dark-metal gauntlet with glowing
> blue stones on his left arm, holding a jagged sword with a crackling blue energy blade in
> his right hand. Only the near arm visible; far arm hidden behind the body. Plain
> transparent background, no text, no name label, character centred, full body head to boots.

Two things to insist on, because both have already cost a pass:

- **Transparent background, no text.** Earlier uploads arrived with the transparency drawn in
  as a checkerboard, and with the character's name rendered at the bottom. Both are handled
  now — the checkerboard is keyed out by colour and the name band is detected as its own run
  of rows and dropped — but a clean file skips the guessing.
- **Same scale and pose height.** The sheet fits by height, so a figure drawn much larger or
  smaller in frame will not match south and north.

A back view is optional: the derived one is good. If you generate one anyway, ask for the same
thing "seen from directly behind, hood closed, no face visible".

## Then run

```sh
node tools/make-chibi-sheet.mjs \
  --in assets/characters/chibi/kael.png \
  --id kael_chibi \
  --east path/to/side.png            # and --north path/to/back.png if you have it
```

The tool skips deriving whichever views you supply and keeps deriving the rest, so a side view
alone is a worthwhile drop-in. Nothing else needs changing: the sheet name and the manifest in
`src/data/chibiSprites.js` stay as they are.

## Doing the same for anyone else

Every character in `assets/characters/chibi/` can become a walking sprite the same way — the
NPCs in Greyhaven are still the placeholder prerenders. Casting which chibi plays which NPC is
an authoring decision nobody has made yet, so it is not done here.
