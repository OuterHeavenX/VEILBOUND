(() => {
  'use strict';

  const VERSION = '0.1.0-foundation';
  const canvas = document.getElementById('game-canvas');
  const boot = document.getElementById('boot-screen');
  const status = document.getElementById('boot-status');
  const hud = document.getElementById('hud');
  const fatal = document.getElementById('fatal-error');
  const fatalMessage = document.getElementById('fatal-error-message');

  function fail(error) {
    console.error('[VEILBOUND] boot failure', error);
    if (boot) boot.hidden = true;
    if (hud) hud.hidden = true;
    if (fatal) fatal.hidden = false;
    if (fatalMessage) {
      fatalMessage.textContent = error instanceof Error ? error.message : String(error);
    }
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(window.innerWidth * dpr));
    const height = Math.max(1, Math.floor(window.innerHeight * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    return dpr;
  }

  function drawFoundation(ctx, dpr, timeMs) {
    const w = canvas.width;
    const h = canvas.height;
    const t = timeMs * 0.001;

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#121b1d');
    bg.addColorStop(0.55, '#111513');
    bg.addColorStop(1, '#080a09');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Hollow March placeholder atmosphere: quiet field, buried geometry, distant Vein glow.
    const horizon = h * 0.44;
    ctx.fillStyle = '#1d2720';
    ctx.fillRect(0, horizon, w, h - horizon);

    ctx.strokeStyle = 'rgba(127, 231, 225, 0.10)';
    ctx.lineWidth = Math.max(1, dpr);
    const spacing = 48 * dpr;
    const offset = (t * 6 * dpr) % spacing;
    for (let x = -spacing + offset; x < w + spacing; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, horizon);
      ctx.lineTo(x - (h - horizon) * 0.32, h);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(232, 237, 240, 0.06)';
    for (let y = horizon + spacing; y < h; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const cx = w * 0.5;
    const cy = h * 0.61;
    const pulse = 0.55 + Math.sin(t * 2.2) * 0.15;

    ctx.save();
    ctx.translate(cx, cy);

    // Temporary Kael marker. WRAITH replaces this with authored sprite work.
    ctx.fillStyle = '#14191b';
    ctx.beginPath();
    ctx.arc(0, -20 * dpr, 10 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-9 * dpr, -10 * dpr, 18 * dpr, 28 * dpr);

    ctx.strokeStyle = '#d8dee1';
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.arc(0, -20 * dpr, 8 * dpr, Math.PI * 0.05, Math.PI * 0.95);
    ctx.stroke();

    ctx.strokeStyle = `rgba(127, 231, 225, ${pulse})`;
    ctx.lineWidth = 3 * dpr;
    ctx.beginPath();
    ctx.arc(-11 * dpr, 1 * dpr, 6 * dpr, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    ctx.fillStyle = 'rgba(232, 237, 240, 0.72)';
    ctx.textAlign = 'center';
    ctx.font = `${Math.max(12, 14 * dpr)}px ui-monospace, monospace`;
    ctx.fillText('GREYHAVEN APPROACH — FOUNDATION RUNTIME', cx, h * 0.82);
    ctx.fillStyle = 'rgba(141, 154, 163, 0.8)';
    ctx.font = `${Math.max(10, 11 * dpr)}px ui-monospace, monospace`;
    ctx.fillText('FORGE ONLINE • WORLD SYSTEMS NEXT', cx, h * 0.82 + 24 * dpr);
  }

  function start() {
    if (!canvas) throw new Error('Game canvas was not found.');
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D is unavailable in this browser.');

    document.documentElement.dataset.veilboundVersion = VERSION;
    if (status) status.textContent = 'Bound user confirmed.';

    setTimeout(() => {
      if (boot) boot.hidden = true;
      if (hud) hud.hidden = false;
      canvas.focus({ preventScroll: true });
    }, 450);

    const frame = (timeMs) => {
      const dpr = resizeCanvas();
      drawFoundation(ctx, dpr, timeMs);
      window.requestAnimationFrame(frame);
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.requestAnimationFrame(frame);

    console.info(`[VEILBOUND] v${VERSION} booted successfully.`);
  }

  try {
    start();
  } catch (error) {
    fail(error);
  }
})();
