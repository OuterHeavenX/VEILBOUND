(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // Draws the prerendered character sheets produced by tools/prerender-characters.mjs.
  //
  // Sheets are loaded as plain <img>, and the manifest is a .js module rather than JSON,
  // so the game still runs straight off the filesystem with no fetch() and no build step.
  // Every draw call reports whether it succeeded; the runtime falls back to its procedural
  // figures when a sheet is missing or still loading, so the game is never blocked on art.

  // Measured from the generated sheets: the figure occupies ~0.70 of the cell and its feet
  // sit at ~0.84 of the cell height. Anchoring on the feet keeps sprites standing on the
  // same ground line the procedural figures used.
  const FEET_ANCHOR = 0.84;
  const ENEMY_FEET_ANCHOR = 0.80;

  const images = new Map();
  let pending = 0, failed = 0;

  // Generated sheets, with hand-authored ones layered over them: characterSprites.js is
  // rewritten by the prerenderer, so anything authored by hand lives in chibiSprites.js
  // and wins here.
  const manifest = () => ({ ...(window.Veilbound.CharacterSprites || {}), ...(window.Veilbound.ChibiSprites || {}) });
  const enemies = () => window.Veilbound.EnemySprites || {};

  // `src` is a path relative to the page, so both the generated sheets and the authored
  // ones in assets/ load the same way, and both work from file://.
  function sheet(src) {
    let record = images.get(src);
    if (record) return record;
    record = { image: new Image(), ready: false };
    images.set(src, record);
    pending++;
    record.image.onload = () => { record.ready = true; pending--; };
    record.image.onerror = () => { pending--; failed++; console.warn(`[VEILBOUND] Sprite sheet missing: ${src}`); };
    record.image.src = `./${src}`;
    return record;
  }

  const Sprites = {
    preload() {
      for (const entry of Object.values(manifest())) {
        for (const clip of Object.values(entry.clips)) sheet(`assets/sprites/${clip.file}`);
      }
      for (const entry of Object.values(enemies())) {
        for (const clip of Object.values(entry.clips)) sheet(clip.file);
      }
      return Sprites.state();
    },

    // The prerenderer put index 0 facing the camera and turned clockwise, so a facing
    // vector maps onto a row directly.
    directionIndex(facingX, facingY, directions = 8) {
      const angle = Math.atan2(facingX, facingY);
      const turns = (angle < 0 ? angle + Math.PI * 2 : angle) / (Math.PI * 2);
      return Math.round(turns * directions) % directions;
    },

    ready(id, clipName) {
      const entry = manifest()[id];
      const clip = entry && entry.clips[clipName];
      if (!clip) return false;
      const record = images.get(`assets/sprites/${clip.file}`);
      return Boolean(record && record.ready);
    },

    // Authored grid sheets: four direction rows, one sheet per clip, row-major frames.
    enemyReady(type, clipName) {
      const entry = enemies()[type];
      const clip = entry && entry.clips[clipName];
      if (!clip) return false;
      const record = images.get(clip.file);
      return Boolean(record && record.ready);
    },

    // The authored sheets carry only four directions, so a facing vector picks the
    // dominant axis rather than the nearest of eight.
    cardinalRow(entry, facingX, facingY) {
      if (Math.abs(facingX) > Math.abs(facingY)) return facingX < 0 ? entry.rows.west : entry.rows.east;
      return facingY < 0 ? entry.rows.north : entry.rows.south;
    },

    // Returns the frame index a clip is on, and whether a non-looping clip has finished.
    clipFrame(entry, clipName, seconds) {
      const clip = entry.clips[clipName];
      if (!clip) return { frame: 0, done: true };
      const raw = Math.floor(seconds * clip.fps);
      if (clip.loop === false) {
        return { frame: Math.min(raw, clip.frames - 1), done: raw >= clip.frames };
      }
      return { frame: ((raw % clip.frames) + clip.frames) % clip.frames, done: false };
    },

    drawEnemy(ctx, type, clipName, { x, y, facingX = 0, facingY = 1, seconds = 0, size = 74, groundOffset = 12 }) {
      const entry = enemies()[type];
      const clip = entry && entry.clips[clipName];
      if (!clip) return false;
      const record = images.get(clip.file);
      if (!record || !record.ready) return false;
      const cell = entry.cell;
      const row = Sprites.cardinalRow(entry, facingX, facingY);
      const { frame } = Sprites.clipFrame(entry, clipName, seconds);
      const drawn = size * (entry.scale || 1);
      ctx.drawImage(
        record.image,
        frame * cell, row * cell, cell, cell,
        x - drawn / 2, y + groundOffset - drawn * ENEMY_FEET_ANCHOR, drawn, drawn
      );
      return true;
    },

    // Returns false when it could not draw, so callers can fall back.
    draw(ctx, id, clipName, { x, y, facingX = 0, facingY = 1, frame = 0, size = 56, groundOffset = 14 }) {
      const entry = manifest()[id];
      const clip = entry && entry.clips[clipName];
      if (!clip) return false;
      const record = images.get(`assets/sprites/${clip.file}`);
      if (!record || !record.ready) return false;
      const cell = entry.cell;
      const row = Sprites.directionIndex(facingX, facingY, entry.directions);
      const column = ((Math.floor(frame) % clip.frames) + clip.frames) % clip.frames;
      ctx.drawImage(
        record.image,
        column * cell, row * cell, cell, cell,
        x - size / 2, y + groundOffset - size * FEET_ANCHOR, size, size
      );
      return true;
    },

    // Fills a rectangle by repeating one 16px tile. Used for ground and paths; the tile
    // sets are autotile sheets, so only interior field tiles tile cleanly this way.
    fillTiles(ctx, file, tx, ty, x, y, w, h, tile = 16) {
      const record = sheet(file);
      if (!record.ready) return false;
      const sx = tx * tile, sy = ty * tile;
      for (let py = y; py < y + h; py += tile) {
        const sh = Math.min(tile, y + h - py);
        for (let px = x; px < x + w; px += tile) {
          const sw = Math.min(tile, x + w - px);
          ctx.drawImage(record.image, sx, sy, sw, sh, px, py, sw, sh);
        }
      }
      return true;
    },

    // Single-image scenery. Ground-anchored like the characters, so props sit on the
    // world rather than floating over it.
    prop(ctx, file, { x, y, size, sway = 0, seconds = 0 }) {
      const record = sheet(file);
      if (!record.ready) return false;
      const lean = sway ? Math.sin(seconds * .7 + x) * sway : 0;
      if (lean) { ctx.save(); ctx.translate(x, y); ctx.rotate(lean * .012); ctx.translate(-x, -y); }
      ctx.drawImage(record.image, x - size / 2, y - size, size, size);
      if (lean) ctx.restore();
      return true;
    },

    state() {
      let ready = 0;
      for (const record of images.values()) if (record.ready) ready++;
      return { sheets: images.size, ready, pending, failed };
    },
  };

  window.Veilbound.Sprites = Sprites;
})();
