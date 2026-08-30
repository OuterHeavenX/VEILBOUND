#!/usr/bin/env node
/**
 * Offline title-screen portrait renderer.
 *
 * The game is Canvas 2D with a zero-build, file://-friendly launch, so it cannot draw the
 * .glb character models directly. This renders one tall, front-lit hero portrait per title
 * character, once, offline, into a PNG with transparency. Nothing here runs in the game.
 *
 * The character sheets in prerender-characters.mjs are 96px top-down gameplay cells; a title
 * portrait needs a different camera (near-eye-level, perspective, full body) and different
 * light, so it is a separate pass rather than a bigger cell in the same one.
 *
 * Dev-only dependencies, installed in this directory, never in the game:
 *   npm install three playwright
 *
 * Usage:  node tools/prerender-portraits.mjs [--out assets/sprites] [--width 512]
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const THREE_DIR = findThree();

// Placeholder casting, as with the gameplay sheets: see docs/ARCHITECTURE.md > Character
// sprites. `rim` is each character's signature backlight, which is what keeps three figures
// cut from the same six-model pack reading as three different people.
const CAST = [
  { id: 'kael', model: 'Rogue_Hooded', clip: 'Idle_B', at: 0.34, yaw: -14, rim: 0x7fe7e1, key: 0xdff6f2 },
  { id: 'lyra', model: 'Mage', clip: 'Throw', at: 0.42, yaw: 12, rim: 0xb58cf0, key: 0xf2e8ff },
  { id: 'mira', model: 'Knight', clip: 'Interact', at: 0.30, yaw: 18, rim: 0xf0b46a, key: 0xfff0dc },
];
const ANIMATION_SOURCES = [
  'Animations/gltf/Rig_Medium/Rig_Medium_General.glb',
  'Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb',
];

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const OUT_DIR = join(ROOT, argOf('--out', 'assets/sprites'));
const WIDTH = Number(argOf('--width', '512'));
const HEIGHT = Math.round(WIDTH * 1.5);

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

window.portrait = async ({ modelUrl, animationUrls, clip, at, yaw, rim, key, width, height }) => {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const gltf = await load(modelUrl);
  const root = gltf.scene;
  const library = new Map();
  for (const url of animationUrls) {
    const source = await load(url);
    for (const c of source.animations) library.set(c.name, c);
  }

  const scene = new THREE.Scene();
  const pivot = new THREE.Group();
  pivot.add(root);
  pivot.rotation.y = THREE.MathUtils.degToRad(yaw);
  scene.add(pivot);

  // Dim cool ambient, a soft front key, and two coloured rims placed almost side-on. A rim
  // set behind the model lights only the faces turned away from the camera, so it reads as
  // nothing at all; grazing the silhouette is what actually separates the figure from a
  // dark title background without an outline pass.
  scene.add(new THREE.AmbientLight(0x6f8ea3, 0.55));
  const keyLight = new THREE.DirectionalLight(key, 1.25);
  keyLight.position.set(-2.2, 4.0, 4.5);
  scene.add(keyLight);
  const rimRight = new THREE.DirectionalLight(rim, 3.6);
  rimRight.position.set(4.2, 1.4, -0.5);
  scene.add(rimRight);
  const rimLeft = new THREE.DirectionalLight(rim, 2.4);
  rimLeft.position.set(-4.2, 1.1, -0.5);
  scene.add(rimLeft);
  const bounce = new THREE.DirectionalLight(0x3c5f72, 0.9);
  bounce.position.set(0, -3, 2.4);
  scene.add(bounce);

  // Pose first, then measure: an outstretched arm changes the bounds the frame is built from.
  const posed = library.get(clip);
  if (posed) {
    const mixer = new THREE.AnimationMixer(root);
    const action = mixer.clipAction(posed);
    action.reset().play();
    mixer.setTime(0);
    mixer.update(at * posed.duration);
  }
  root.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3(); box.getSize(size);
  const centre = new THREE.Vector3(); box.getCenter(centre);

  // Near eye level rather than the gameplay 3/4 tilt, and framed to the taller of the two
  // axes so a wide pose is never cropped at the hands.
  const camera = new THREE.PerspectiveCamera(26, width / height, 0.1, 100);
  const fit = Math.max(size.y * 1.16, (size.x * 1.2) * (height / width));
  const dist = (fit / 2) / Math.tan(THREE.MathUtils.degToRad(13));
  const elevation = THREE.MathUtils.degToRad(7);
  camera.position.set(0, centre.y + Math.sin(elevation) * dist, Math.cos(elevation) * dist);
  camera.lookAt(0, centre.y, 0);

  renderer.render(scene, camera);
  const data = canvas.toDataURL('image/png');
  renderer.dispose();
  return { data, height: size.y };
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
await page.route('**/portrait.html', route => route.fulfill({ contentType: 'text/html', body: PAGE }));
await page.goto(`${base}/portrait.html`);
await page.waitForFunction(() => window.ready, null, { timeout: 30000 });

await mkdir(OUT_DIR, { recursive: true });
for (const entry of CAST) {
  const result = await page.evaluate(opts => window.portrait(opts), {
    modelUrl: `${base}/assets/characters/Characters/gltf/${entry.model}.glb`,
    animationUrls: ANIMATION_SOURCES.map(p => `${base}/${p}`),
    clip: entry.clip,
    at: entry.at,
    yaw: entry.yaw,
    rim: entry.rim,
    key: entry.key,
    width: WIDTH,
    height: HEIGHT,
  });
  const file = `portrait_${entry.id}.png`;
  await writeFile(join(OUT_DIR, file), Buffer.from(result.data.split(',')[1], 'base64'));
  console.log(`  ${entry.id.padEnd(6)} ${entry.model.padEnd(13)} ${entry.clip.padEnd(9)} ${WIDTH}x${HEIGHT} -> ${file}`);
}

await browser.close();
server.close();
if (failures.length) {
  console.error('page errors:', failures);
  process.exit(1);
}
console.log('portraits written to', OUT_DIR);
