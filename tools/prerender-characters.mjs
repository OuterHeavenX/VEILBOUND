#!/usr/bin/env node
/**
 * Offline sprite prerenderer.
 *
 * VEILBOUND ships as a Canvas 2D game with a zero-build, file://-friendly launch, so it
 * cannot draw the uploaded .glb character models directly. This tool renders them once,
 * offline, into 8-direction sprite sheets that the 2D runtime can draw like any image.
 * Nothing here runs in the shipped game.
 *
 * The KayKit characters carry no animation clips of their own; the clips live in
 * Animations/gltf/Rig_Medium/*.glb and share the same 23-joint rig, so a clip bound to a
 * character's skeleton by node name plays without retargeting.
 *
 * Dev-only dependencies, installed in this directory, never in the game:
 *   npm install three playwright
 *
 * Usage:  node tools/prerender-characters.mjs [--out assets/sprites] [--cell 96]
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const THREE_DIR = findThree();

// Which model plays whom. Placeholder casting: see docs/ARCHITECTURE.md > Character sprites.
const CAST = [
  { id: 'kael', model: 'Rogue_Hooded', clips: ['Idle_A', 'Walking_A', 'Use_Item'] },
  { id: 'innkeeper', model: 'Barbarian', clips: ['Idle_A'] },
  { id: 'workshop', model: 'Knight', clips: ['Idle_A'] },
  { id: 'researcher', model: 'Mage', clips: ['Idle_A'] },
  { id: 'resident', model: 'Ranger', clips: ['Idle_A'] },
  { id: 'wren', model: 'Rogue', clips: ['Idle_A'] },
];
const ANIMATION_SOURCES = [
  'Animations/gltf/Rig_Medium/Rig_Medium_General.glb',
  'Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb',
];
// Eight yaw steps, starting at south (toward the camera) and turning clockwise, so the
// index maps straight onto the runtime's facing vector.
const DIRECTIONS = 8;
const FRAMES = { Idle_A: 6, Walking_A: 8, Use_Item: 6 };

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const OUT_DIR = join(ROOT, argOf('--out', 'assets/sprites'));
const CELL = Number(argOf('--cell', '96'));

function findThree() {
  for (const base of [join(ROOT, 'tools'), ROOT, process.cwd()]) {
    const dir = join(base, 'node_modules', 'three');
    if (existsSync(join(dir, 'build', 'three.module.js'))) return dir;
  }
  console.error('three.js not found. Run:  npm install three playwright');
  process.exit(1);
}

const MIME = { '.js': 'text/javascript', '.glb': 'model/gltf-binary', '.png': 'image/png', '.html': 'text/html' };
function serve() {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(req.url.split('?')[0]);
    const file = path.startsWith('/vendor/three/')
      ? join(THREE_DIR, path.slice('/vendor/three/'.length))
      : join(ROOT, path);
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

const PAGE = `<!doctype html><meta charset="utf-8">
<script type="importmap">{"imports":{
  "three":"/vendor/three/build/three.module.js",
  "three/addons/":"/vendor/three/examples/jsm/"
}}</script>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const load = url => new Promise((ok, fail) => loader.load(url, ok, undefined, fail));

window.prerender = async ({ modelUrl, animationUrls, clips, cell, directions, frames }) => {
  const canvas = document.createElement('canvas');
  canvas.width = cell; canvas.height = cell;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const gltf = await load(modelUrl);
  const root = gltf.scene;

  // Every clip in the pack lives in the shared-rig files, keyed by node name.
  const library = new Map();
  for (const url of animationUrls) {
    const source = await load(url);
    for (const clip of source.animations) library.set(clip.name, clip);
  }

  const scene = new THREE.Scene();
  const pivot = new THREE.Group();
  pivot.add(root);
  scene.add(pivot);
  // Flat, directional key plus fill: readable silhouettes at gameplay scale, which is
  // what WRAITH's rules ask of characters, and it keeps the sprite from going muddy.
  scene.add(new THREE.AmbientLight(0xffffff, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(-3, 6, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbfe6e0, 0.7);
  rim.position.set(3, 2, -4);
  scene.add(rim);

  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3(); box.getSize(size);
  const centre = new THREE.Vector3(); box.getCenter(centre);
  const span = Math.max(size.x, size.y, size.z) * 1.15;

  // Orthographic and tilted: the game is a 3/4 top-down view, not a side view.
  const camera = new THREE.OrthographicCamera(-span / 2, span / 2, span / 2, -span / 2, 0.01, 100);
  const elevation = THREE.MathUtils.degToRad(52);
  const dist = 12;
  camera.position.set(0, centre.y + Math.sin(elevation) * dist, Math.cos(elevation) * dist);
  camera.lookAt(0, centre.y, 0);

  const mixer = new THREE.AnimationMixer(root);
  const sheets = {};
  for (const clipName of clips) {
    const clip = library.get(clipName);
    if (!clip) { sheets[clipName] = null; continue; }
    const count = frames[clipName] || 6;
    const action = mixer.clipAction(clip);
    action.reset().play();

    const sheet = document.createElement('canvas');
    sheet.width = cell * count;
    sheet.height = cell * directions;
    const ctx = sheet.getContext('2d');

    for (let d = 0; d < directions; d++) {
      // Index 0 faces the camera (south). Rotating +Y takes the model's +Z facing toward
      // +X, which is screen-east, so index 2 is east and the runtime can map its facing
      // vector straight onto the index with atan2(facingX, facingY).
      pivot.rotation.y = (d / directions) * Math.PI * 2;
      for (let f = 0; f < count; f++) {
        mixer.setTime(0);
        mixer.update((f / count) * clip.duration);
        root.updateMatrixWorld(true);
        renderer.render(scene, camera);
        ctx.clearRect(f * cell, d * cell, cell, cell);
        ctx.drawImage(canvas, f * cell, d * cell);
      }
    }
    action.stop();
    sheets[clipName] = { data: sheet.toDataURL('image/png'), frames: count, directions, cell };
  }
  renderer.dispose();
  return sheets;
};
window.ready = true;
</script>`;

const server = await serve();
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
const failures = [];
page.on('pageerror', e => failures.push(e.message));
await page.route('**/prerender.html', route => route.fulfill({ contentType: 'text/html', body: PAGE }));
await page.goto(`${base}/prerender.html`);
await page.waitForFunction(() => window.ready, null, { timeout: 30000 });

await mkdir(OUT_DIR, { recursive: true });
const manifest = {};
for (const entry of CAST) {
  const modelUrl = `${base}/assets/characters/Characters/gltf/${entry.model}.glb`;
  const sheets = await page.evaluate(opts => window.prerender(opts), {
    modelUrl,
    animationUrls: ANIMATION_SOURCES.map(p => `${base}/${p}`),
    clips: entry.clips,
    cell: CELL,
    directions: DIRECTIONS,
    frames: FRAMES,
  });
  manifest[entry.id] = { model: entry.model, cell: CELL, directions: DIRECTIONS, clips: {} };
  for (const [clipName, sheet] of Object.entries(sheets)) {
    if (!sheet) { console.warn(`  ! ${entry.id}: clip ${clipName} not found in the animation library`); continue; }
    const file = `${entry.id}_${clipName}.png`;
    await writeFile(join(OUT_DIR, file), Buffer.from(sheet.data.split(',')[1], 'base64'));
    manifest[entry.id].clips[clipName] = { file, frames: sheet.frames };
    console.log(`  ${entry.id.padEnd(11)} ${clipName.padEnd(11)} ${sheet.frames} frames x ${DIRECTIONS} dirs -> ${file}`);
  }
}

// A .js manifest, not .json: fetch() is blocked on file:// and the launch contract
// requires the game to run straight off the filesystem.
const banner = '// Generated by tools/prerender-characters.mjs. Do not edit by hand.\n';
await writeFile(
  join(ROOT, 'src/data/characterSprites.js'),
  `${banner}(() => {\n  'use strict';\n  window.Veilbound = window.Veilbound || {};\n  window.Veilbound.CharacterSprites = Object.freeze(${JSON.stringify(manifest, null, 2).replace(/\n/g, '\n  ')});\n})();\n`
);

await browser.close();
server.close();
if (failures.length) { console.error('page errors:', failures); process.exit(1); }
console.log(`\nWrote ${Object.keys(manifest).length} character sheets to ${OUT_DIR} and src/data/characterSprites.js`);
