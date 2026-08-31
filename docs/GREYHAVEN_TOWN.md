# Greyhaven town — generated source

Owner: **FORGE**
Status: **VENDORED AS DATA — NOT SHIPPED ART**

`vendor/greyhaven` is a submodule of
[`OuterHeavenX/greyhaven-town`](https://github.com/OuterHeavenX/greyhaven-town):
a full build of Greyhaven generated from a Blender pipeline
([`OuterHeavenX/greyhaven-pipeline`](https://github.com/OuterHeavenX/greyhaven-pipeline)),
plus a Phaser 3 harness that makes it walkable.

## Pull / update it

```bash
git submodule update --init --recursive     # first time
git submodule update --remote vendor/greyhaven   # take the latest
```

The submodule is data on disk. It adds no build step to `index.html`, so
**2.1** and **2.2** are unaffected — but read the next section before wiring
any of it into the runtime.

## What this repo can and cannot take from it

**Can — it is static data, and the runtime is Canvas 2D:**

| File | What it is |
|---|---|
| `public/assets/greyhaven/game/greyhaven_ground.png` | the town floor, one plate |
| `public/assets/greyhaven/game/greyhaven_canopy.png` | foliage, drawn over the player |
| `public/assets/greyhaven/game/bldg/*.png` | 20 buildings, cropped, each with a depth key |
| `public/assets/greyhaven/interiors/INT_*.png` | 19 room plates |
| `greyhaven_collision.json` | 1,141 solid + 32 water rects, world metres |
| `greyhaven_navgrid.json` | walkability bitmap, for NPC pathing |
| `greyhaven_markers.json` | 153 spawns, doors, shops, NPC posts, quests, chests |
| `greyhaven_manifest.json` | the projection, the palette, every building record |

**Cannot, without violating a rule:**

- `vendor/greyhaven/src/scenes/**` is Phaser 3 and is built with Vite. Importing
  it into the runtime would break **2.1/2.2**. It is a reference harness for
  seeing the town work, not a module to consume.

## The projection, if you do consume the plates

The art is not top-down. It is orthographic, tilted **26° off vertical**, at
**16 px per metre**:

```
px = (x - camX) * 16 + originX
py = originY - ((y - camY) * 0.8988 + z * 0.4384) * 16
```

North–south is squashed to 0.8988 and height pushes sprites *up* the screen.
Blender's +Y is north; screen +Y is down. Every constant is published in
`greyhaven_manifest.json → plate`. Movement has to be authored in metres per
second or diagonals drift.

## Open conflict with 2.14

**2.14** sets VEILBOUND's visual register as *painted, not pixel art*. Greyhaven
as generated is **pixel art** — hard-edged, un-antialiased, 16 px/m, built to a
locked 60-colour palette. The two cannot both be true of shipped art.

So this is vendored as **development material under 2.10**, not as the town's
final look. Resolving it is an owner decision and one of:

1. keep it as a blockout and repaint over the layout;
2. re-render the pipeline in a painted register (the Blender source is the
   input, so the geometry survives a change of shading);
3. supersede 2.14.

Until that is decided, nothing here should be described as VEILBOUND's shipped
art — per **2.13**, that claim would be a defect.
