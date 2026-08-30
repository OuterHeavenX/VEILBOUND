(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  const WORLD = { width: 960, height: 540 };
  const data = () => window.Veilbound.RoomArtData || {};
  const images = new Map();

  // Loading never blocks startup and never throws: a room whose plate is missing or still
  // in flight draws its procedural art instead, which is the same contract the sprite
  // pipeline works to.
  function load(entry) {
    if (images.has(entry.file)) return images.get(entry.file);
    const record = { image: new Image(), ready: false, failed: false };
    record.image.addEventListener('load', () => { record.ready = true; });
    record.image.addEventListener('error', () => { record.failed = true; });
    record.image.src = entry.file;
    images.set(entry.file, record);
    return record;
  }

  const RoomArt = {
    preload() {
      for (const entry of Object.values(data())) load(entry);
    },

    // True when the plate was painted, so the caller can skip its procedural ground pass.
    // False for every other case, so the fallback is the default rather than the exception.
    draw(ctx, roomId) {
      const entry = data()[roomId];
      if (!entry) return false;
      const record = load(entry);
      if (!record.ready) return false;
      ctx.drawImage(record.image, 0, 0, WORLD.width, WORLD.height);
      return true;
    },

    // Painted after the plate but under everything the room simulates, so figures and
    // mechanisms still read on top of it.
    drawOverlay(ctx, roomId, hasFlag, seconds) {
      const entry = data()[roomId];
      const glow = entry && entry.awakenGlow;
      if (!glow || !hasFlag(glow.flag)) return;
      const record = load(entry);
      if (!record.ready) return;
      // The painted door is a set of concentric rings, so the woken state is a bright core
      // inside a brighter annulus rather than an even blob, which would just fog the stone.
      const pulse = 0.72 + Math.sin(seconds * 1.7) * 0.14;
      const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.radius);
      gradient.addColorStop(0, `rgba(${glow.colour}, ${(0.95 * pulse).toFixed(3)})`);
      gradient.addColorStop(0.18, `rgba(${glow.colour}, ${(0.42 * pulse).toFixed(3)})`);
      gradient.addColorStop(0.44, `rgba(${glow.colour}, ${(0.16 * pulse).toFixed(3)})`);
      gradient.addColorStop(0.62, `rgba(${glow.colour}, ${(0.34 * pulse).toFixed(3)})`);
      gradient.addColorStop(0.78, `rgba(${glow.colour}, ${(0.12 * pulse).toFixed(3)})`);
      gradient.addColorStop(1, `rgba(${glow.colour}, 0)`);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(glow.x, glow.y, glow.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },

    state() {
      let ready = 0, failed = 0;
      for (const record of images.values()) { if (record.ready) ready++; if (record.failed) failed++; }
      return { plates: images.size, ready, failed };
    },
  };

  window.Veilbound.RoomArt = RoomArt;
})();
