#!/usr/bin/env node
/**
 * Build a 4-direction sprite sheet from a single front-facing chibi figure.
 *
 * The engine's `directionIndex(fx, fy, 4)` orders rows S, E, N, W, and the character draw
 * path already takes `directions` from the manifest — so four directions have always been
 * supported. Eight was an artefact of the KayKit prerenderer, not a requirement.
 *
 * With only a front view available, the other three are derived:
 *
 *   S  the art as drawn.
 *   E  narrowed horizontally, which reads as a body turned away from the viewer.
 *   N  mirrored, with the face darkened to the inside of the hood. A back view is the
 *      mirror of a front view for anything asymmetric, and a deep hood seen from behind is
 *      a shadow — which is exactly what Kael's is.
 *   W  mirrored and narrowed, so the blade stays on his same hand through a turn.
 *
 * The back holds up: mirroring is correct for anything asymmetric, and a hood closed with
 * its own cloth genuinely reads as the back of a head.
 *
 * The side does not, and no amount of squeezing fixes it. A profile shows one arm; a squeezed
 * front view shows two, with both gauntlets, and the eye reads that immediately at any scale.
 * East and west are honest placeholders until someone draws a side view. Squeezing harder
 * makes it worse, not better - 0.52 was tried and rejected.
 *
 * When authored views exist, pass them with --east / --north and the derivation is skipped
 * for whichever are supplied.
 *
 * Usage:
 *   node tools/make-chibi-sheet.mjs --in assets/characters/chibi/kael.png --id kael_chibi
 *        [--east FILE] [--north FILE] [--cell 96] [--out assets/sprites]
 */
import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const arg = (name, fallback) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : fallback; };

const IN = arg('--in');
const ID = arg('--id');
if (!IN || !ID) { console.error('need --in and --id'); process.exit(1); }
const CELL = Number(arg('--cell', '96'));
const OUT = join(ROOT, arg('--out', 'assets/sprites'));
const EAST = arg('--east', null);
const NORTH = arg('--north', null);

// Idle breathes on two frames; walking bobs and leans across four. Both are motion the art
// does not contain, applied per frame so a still figure is never simply slid around.
const CLIPS = {
  Idle_A:    { frames: 2, bob: [0, -1], lean: [0, 0],          squash: [0, 0.006] },
  Walking_A: { frames: 4, bob: [0, -3, 0, -2], lean: [0, 0.035, 0, -0.035], squash: [0, 0.01, 0, 0.01] },
  Use_Item:  { frames: 3, bob: [0, -2, 0], lean: [0, 0.1, 0.04], squash: [0, 0, 0] },
};

const b64 = async p => (await readFile(p.startsWith('/') ? p : join(ROOT, p))).toString('base64');
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();

const sheets = await page.evaluate(async ({ front, east, north, cell, clips }) => {
  const load = async d => { const i = new Image(); i.src = 'data:image/png;base64,' + d; await i.decode(); return i; };
  const F = await load(front);
  const E = east ? await load(east) : null;
  const N = north ? await load(north) : null;

  // Where the hood's opening sits. Constrained to the middle of the head, because a loose
  // "bright pixels in the upper third" search also finds lit cloak, pauldrons and gauntlet
  // and returns a box half the figure wide — which paints the whole head out.
  const faceBox = img => {
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    const px = g.getImageData(0, 0, c.width, c.height).data;
    const top = Math.round(c.height * 0.08), bot = Math.round(c.height * 0.26);
    const left = Math.round(c.width * 0.30), right = Math.round(c.width * 0.70);
    let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
    for (let y = top; y < bot; y++) for (let x = left; x < right; x++) {
      const i = (y * c.width + x) * 4;
      if (px[i + 3] < 40) continue;
      const lum = (px[i] + px[i + 1] + px[i + 2]) / 3;
      if (lum > 112) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    if (x1 < 0) return null;
    return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  };
  const face = faceBox(F);

  // The hood's own fabric, sampled from the band just above the opening. Closing the hood
  // with a black ellipse reads as a hole punched in the character; closing it with its own
  // cloth, shaded and seamed, reads as the back of a head.
  const hoodFabric = (img, face) => {
    if (!face) return [56, 58, 42];
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    const px = g.getImageData(0, 0, c.width, c.height).data;
    const acc = [0, 0, 0]; let n = 0;
    for (let y = Math.max(0, face.y - Math.round(face.h * 0.9)); y < face.y - 2; y++)
      for (let x = face.x; x < face.x + face.w; x++) {
        const i = (y * c.width + x) * 4;
        if (px[i + 3] > 200) { acc[0] += px[i]; acc[1] += px[i + 1]; acc[2] += px[i + 2]; n++; }
      }
    return n ? acc.map(v => Math.round(v / n)) : [56, 58, 42];
  };
  const fabric = hoodFabric(F, face);
  const shade = m => `rgb(${Math.round(fabric[0] * m)}, ${Math.round(fabric[1] * m)}, ${Math.round(fabric[2] * m)})`;

  // One cell: the figure fitted by height, anchored so the feet sit on the engine's anchor.
  const FEET = 0.84;
  const drawFigure = (g, img, { mirror = false, narrow = 1, bob = 0, lean = 0, squash = 0, hideFace = false }) => {
    const scale = (cell * 0.94) / img.height;
    const w = img.width * scale * narrow, h = img.height * scale * (1 + squash);
    g.save();
    g.translate(cell / 2, cell * FEET + bob);
    if (lean) g.rotate(lean);
    if (mirror) g.scale(-1, 1);
    g.imageSmoothingEnabled = false;
    g.drawImage(img, -w / 2, -h, w, h);
    if (hideFace && face) {
      // Cloth over the back of a head: the hood's own colour, lit from above, with the seam
      // that runs down the centre of a hood.
      const fx = (face.x + face.w / 2) / img.width - 0.5;
      const cx = fx * w;
      const cy = -h + (face.y + face.h / 2) * scale * (1 + squash);
      const rx = face.w * scale * 0.54, ry = face.h * scale * 0.58;
      const grad = g.createLinearGradient(0, cy - ry, 0, cy + ry);
      grad.addColorStop(0, shade(1.06));
      grad.addColorStop(0.55, shade(0.9));
      grad.addColorStop(1, shade(0.62));
      g.save();
      g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); g.clip();
      g.fillStyle = grad;
      g.fillRect(cx - rx - 2, cy - ry - 2, rx * 2 + 4, ry * 2 + 4);
      g.strokeStyle = shade(0.5);
      g.lineWidth = Math.max(0.8, rx * 0.07);
      g.beginPath(); g.moveTo(cx, cy - ry * 0.95); g.lineTo(cx, cy + ry * 0.95); g.stroke();
      g.restore();
    }
    g.restore();
  };

  const out = {};
  for (const [name, spec] of Object.entries(clips)) {
    const c = document.createElement('canvas');
    c.width = cell * spec.frames; c.height = cell * 4;         // rows: S, E, N, W
    const g = c.getContext('2d');
    for (let f = 0; f < spec.frames; f++) {
      const common = { bob: spec.bob[f] || 0, lean: spec.lean[f] || 0, squash: spec.squash[f] || 0 };
      const rows = [
        { img: F, o: { ...common } },                                        // S
        { img: E || F, o: { ...common, narrow: E ? 1 : 0.74, hideFace: !E } }, // E
        { img: N || F, o: { ...common, mirror: !N, hideFace: !N } },         // N
        { img: E || F, o: { ...common, mirror: true, narrow: E ? 1 : 0.74, hideFace: !E } }, // W
      ];
      rows.forEach((r, row) => {
        g.save(); g.translate(f * cell, row * cell); drawFigure(g, r.img, r.o); g.restore();
      });
    }
    out[name] = { data: c.toDataURL('image/png'), frames: spec.frames };
  }
  return { face, sheets: out };
}, { front: await b64(IN), east: EAST ? await b64(EAST) : null, north: NORTH ? await b64(NORTH) : null,
     cell: CELL, clips: CLIPS });

await mkdir(OUT, { recursive: true });
const manifest = { cell: CELL, directions: 4, clips: {} };
for (const [name, s] of Object.entries(sheets.sheets)) {
  const file = `${ID}_${name}.png`;
  await writeFile(join(OUT, file), Buffer.from(s.data.split(',')[1], 'base64'));
  manifest.clips[name] = { file, frames: s.frames, fps: name === 'Walking_A' ? 8 : 4 };
  console.log(`  ${file}  ${s.frames} frames x 4 directions @ ${CELL}px`);
}
console.log('face box in source:', JSON.stringify(sheets.face));
console.log('\nmanifest entry:\n' + JSON.stringify({ [ID]: manifest }, null, 2));
await browser.close();
