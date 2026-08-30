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

  const images = new Map();
  let pending = 0, failed = 0;

  const manifest = () => window.Veilbound.CharacterSprites || {};

  function sheet(file) {
    let record = images.get(file);
    if (record) return record;
    record = { image: new Image(), ready: false };
    images.set(file, record);
    pending++;
    record.image.onload = () => { record.ready = true; pending--; };
    record.image.onerror = () => { pending--; failed++; console.warn(`[VEILBOUND] Sprite sheet missing: ${file}`); };
    record.image.src = `./assets/sprites/${file}`;
    return record;
  }

  const Sprites = {
    preload() {
      for (const entry of Object.values(manifest())) {
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
      const record = images.get(clip.file);
      return Boolean(record && record.ready);
    },

    // Returns false when it could not draw, so callers can fall back.
    draw(ctx, id, clipName, { x, y, facingX = 0, facingY = 1, frame = 0, size = 56, groundOffset = 14 }) {
      const entry = manifest()[id];
      const clip = entry && entry.clips[clipName];
      if (!clip) return false;
      const record = images.get(clip.file);
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

    state() {
      let ready = 0;
      for (const record of images.values()) if (record.ready) ready++;
      return { sheets: images.size, ready, pending, failed };
    },
  };

  window.Veilbound.Sprites = Sprites;
})();
