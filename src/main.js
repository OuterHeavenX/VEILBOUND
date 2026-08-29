(() => {
  'use strict';

  const VERSION = '0.1.1-playable';
  const canvas = document.getElementById('game-canvas');
  const boot = document.getElementById('boot-screen');
  const status = document.getElementById('boot-status');
  const hud = document.getElementById('hud');
  const hudRoom = document.getElementById('hud-room');
  const touchControls = document.getElementById('touch-controls');
  const touchStick = document.getElementById('touch-stick');
  const touchKnob = document.getElementById('touch-knob');
  const actionButton = document.getElementById('action-button');
  const fatal = document.getElementById('fatal-error');
  const fatalMessage = document.getElementById('fatal-error-message');

  const WORLD = {
    width: 960,
    height: 540,
  };

  const rooms = {
    greyhaven: {
      name: 'GREYHAVEN',
      ground: '#233128',
      accent: '#7fe7e1',
      walls: [
        { x: 0, y: 0, w: 960, h: 38 },
        { x: 0, y: 502, w: 960, h: 38 },
        { x: 0, y: 0, w: 38, h: 540 },
        { x: 922, y: 0, w: 38, h: 210 },
        { x: 922, y: 330, w: 38, h: 210 },
        { x: 130, y: 120, w: 190, h: 92 },
        { x: 545, y: 106, w: 210, h: 106 },
        { x: 330, y: 342, w: 150, h: 92 },
      ],
      exits: [
        { x: 920, y: 210, w: 40, h: 120, room: 'hollowMarch1', spawnX: 62, spawnY: 270 },
      ],
      details: 'town',
    },
    hollowMarch1: {
      name: 'HOLLOW MARCH — FIELD 1',
      ground: '#1b2921',
      accent: '#79b8a5',
      walls: [
        { x: 0, y: 0, w: 960, h: 38 },
        { x: 0, y: 502, w: 960, h: 38 },
        { x: 0, y: 0, w: 38, h: 205 },
        { x: 0, y: 335, w: 38, h: 205 },
        { x: 922, y: 0, w: 38, h: 205 },
        { x: 922, y: 335, w: 38, h: 205 },
        { x: 210, y: 118, w: 130, h: 46 },
        { x: 610, y: 365, w: 145, h: 52 },
        { x: 430, y: 225, w: 90, h: 90 },
      ],
      exits: [
        { x: 0, y: 205, w: 40, h: 130, room: 'greyhaven', spawnX: 895, spawnY: 270 },
        { x: 920, y: 205, w: 40, h: 130, room: 'hollowMarch2', spawnX: 62, spawnY: 270 },
      ],
      details: 'field',
    },
    hollowMarch2: {
      name: 'HOLLOW MARCH — FIELD 2',
      ground: '#19251f',
      accent: '#88c7b5',
      walls: [
        { x: 0, y: 0, w: 960, h: 38 },
        { x: 0, y: 502, w: 960, h: 38 },
        { x: 0, y: 0, w: 38, h: 205 },
        { x: 0, y: 335, w: 38, h: 205 },
        { x: 922, y: 0, w: 38, h: 540 },
        { x: 175, y: 300, w: 170, h: 42 },
        { x: 480, y: 115, w: 210, h: 52 },
        { x: 690, y: 344, w: 95, h: 95 },
      ],
      exits: [
        { x: 0, y: 205, w: 40, h: 130, room: 'hollowMarch1', spawnX: 895, spawnY: 270 },
      ],
      details: 'field2',
    },
  };

  const player = {
    x: 470,
    y: 300,
    radius: 15,
    speed: 205,
    facingX: 0,
    facingY: 1,
    room: 'greyhaven',
    walkPhase: 0,
  };

  const input = {
    keys: new Set(),
    moveX: 0,
    moveY: 0,
    touchX: 0,
    touchY: 0,
  };

  function fail(error) {
    console.error('[VEILBOUND] runtime failure', error);
    if (boot) boot.hidden = true;
    if (hud) hud.hidden = true;
    if (touchControls) touchControls.hidden = true;
    if (fatal) fatal.hidden = false;
    if (fatalMessage) fatalMessage.textContent = error instanceof Error ? error.message : String(error);
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

  function getView() {
    const scale = Math.min(canvas.width / WORLD.width, canvas.height / WORLD.height);
    const drawW = WORLD.width * scale;
    const drawH = WORLD.height * scale;
    return {
      scale,
      offsetX: (canvas.width - drawW) * 0.5,
      offsetY: (canvas.height - drawH) * 0.5,
    };
  }

  function rectCircleOverlap(rect, x, y, radius) {
    const closestX = Math.max(rect.x, Math.min(x, rect.x + rect.w));
    const closestY = Math.max(rect.y, Math.min(y, rect.y + rect.h));
    const dx = x - closestX;
    const dy = y - closestY;
    return dx * dx + dy * dy < radius * radius;
  }

  function tryMove(dx, dy) {
    const room = rooms[player.room];
    const nextX = player.x + dx;
    const nextY = player.y + dy;
    const blockedX = room.walls.some((wall) => rectCircleOverlap(wall, nextX, player.y, player.radius));
    const blockedY = room.walls.some((wall) => rectCircleOverlap(wall, player.x, nextY, player.radius));
    if (!blockedX) player.x = nextX;
    if (!blockedY) player.y = nextY;
  }

  function transitionIfNeeded() {
    const room = rooms[player.room];
    for (const exit of room.exits) {
      if (player.x + player.radius > exit.x && player.x - player.radius < exit.x + exit.w && player.y + player.radius > exit.y && player.y - player.radius < exit.y + exit.h) {
        player.room = exit.room;
        player.x = exit.spawnX;
        player.y = exit.spawnY;
        if (hudRoom) hudRoom.textContent = rooms[player.room].name;
        return;
      }
    }
  }

  function readGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const pad = pads && pads[0];
    if (!pad) return { x: 0, y: 0 };
    const dead = 0.18;
    const x = Math.abs(pad.axes[0] || 0) > dead ? pad.axes[0] : 0;
    const y = Math.abs(pad.axes[1] || 0) > dead ? pad.axes[1] : 0;
    return { x, y };
  }

  function updateInput() {
    let x = 0;
    let y = 0;
    if (input.keys.has('ArrowLeft') || input.keys.has('KeyA')) x -= 1;
    if (input.keys.has('ArrowRight') || input.keys.has('KeyD')) x += 1;
    if (input.keys.has('ArrowUp') || input.keys.has('KeyW')) y -= 1;
    if (input.keys.has('ArrowDown') || input.keys.has('KeyS')) y += 1;

    const pad = readGamepad();
    x += input.touchX + pad.x;
    y += input.touchY + pad.y;

    const length = Math.hypot(x, y);
    if (length > 1) {
      x /= length;
      y /= length;
    }

    input.moveX = x;
    input.moveY = y;
  }

  function update(dt) {
    updateInput();
    if (Math.abs(input.moveX) > 0.01 || Math.abs(input.moveY) > 0.01) {
      player.facingX = input.moveX;
      player.facingY = input.moveY;
      const len = Math.hypot(player.facingX, player.facingY) || 1;
      player.facingX /= len;
      player.facingY /= len;
      player.walkPhase += dt * 9;
      tryMove(input.moveX * player.speed * dt, input.moveY * player.speed * dt);
      transitionIfNeeded();
    }
  }

  function drawWorld(ctx) {
    const view = getView();
    const room = rooms[player.room];

    ctx.save();
    ctx.translate(view.offsetX, view.offsetY);
    ctx.scale(view.scale, view.scale);

    ctx.fillStyle = '#0a0e0c';
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);
    ctx.fillStyle = room.ground;
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);

    drawRoomDetails(ctx, room);

    ctx.fillStyle = '#111817';
    for (const wall of room.walls) {
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
      ctx.strokeStyle = 'rgba(190,220,210,0.08)';
      ctx.strokeRect(wall.x + 0.5, wall.y + 0.5, wall.w - 1, wall.h - 1);
    }

    for (const exit of room.exits) {
      ctx.fillStyle = 'rgba(127,231,225,0.10)';
      ctx.fillRect(exit.x, exit.y, exit.w, exit.h);
    }

    drawKael(ctx);
    ctx.restore();
  }

  function drawRoomDetails(ctx, room) {
    if (room.details === 'town') {
      ctx.fillStyle = '#4a5148';
      ctx.fillRect(0, 245, 960, 50);
      ctx.fillRect(430, 0, 70, 540);
      ctx.fillStyle = '#29342f';
      ctx.fillRect(140, 130, 170, 72);
      ctx.fillRect(555, 116, 190, 86);
      ctx.fillRect(340, 352, 130, 72);
      ctx.fillStyle = '#85755e';
      ctx.fillRect(178, 185, 36, 17);
      ctx.fillRect(635, 185, 38, 17);
      ctx.fillRect(385, 352, 34, 18);
      ctx.strokeStyle = 'rgba(127,231,225,0.24)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(480, 270, 48, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(127,231,225,0.07)';
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(206,218,194,0.07)';
      for (let x = 70; x < 930; x += 86) {
        for (let y = 74; y < 500; y += 76) {
          const sway = Math.sin((x + y) * 0.03) * 5;
          ctx.fillRect(x + sway, y, 2, 11);
          ctx.fillRect(x + sway + 5, y + 4, 2, 8);
        }
      }
      ctx.strokeStyle = 'rgba(127,231,225,0.12)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(120, 420);
      ctx.lineTo(365, 100);
      ctx.lineTo(600, 440);
      ctx.stroke();
    }
  }

  function drawKael(ctx) {
    const bob = Math.sin(player.walkPhase) * 1.4;
    const fx = player.facingX;
    const fy = player.facingY;

    ctx.save();
    ctx.translate(player.x, player.y + bob);

    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 16, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#15191a';
    ctx.beginPath();
    ctx.moveTo(-13, 6);
    ctx.lineTo(-8, -16);
    ctx.lineTo(0, -23);
    ctx.lineTo(8, -16);
    ctx.lineTo(13, 6);
    ctx.lineTo(7, 16);
    ctx.lineTo(-7, 16);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#d5d1c6';
    ctx.beginPath();
    ctx.ellipse(fx * 2, -17 + fy, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#202628';
    ctx.fillRect(-5 + fx * 3, -18 + fy, 10, 3);

    ctx.strokeStyle = '#7fe7e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-11 + fx * 2, -1 + fy * 2, 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#b8b4aa';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(7, 1);
    ctx.lineTo(18 + fx * 10, -8 + fy * 10);
    ctx.stroke();

    ctx.restore();
  }

  function setupKeyboard() {
    window.addEventListener('keydown', (event) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
      input.keys.add(event.code);
    });
    window.addEventListener('keyup', (event) => input.keys.delete(event.code));
    window.addEventListener('blur', () => input.keys.clear());
  }

  function setupTouch() {
    if (!touchStick || !touchKnob) return;
    let pointerId = null;
    const max = 38;

    const updateStick = (event) => {
      const rect = touchStick.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = event.clientX - cx;
      let dy = event.clientY - cy;
      const len = Math.hypot(dx, dy);
      if (len > max) {
        dx = (dx / len) * max;
        dy = (dy / len) * max;
      }
      input.touchX = dx / max;
      input.touchY = dy / max;
      touchKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    touchStick.addEventListener('pointerdown', (event) => {
      pointerId = event.pointerId;
      touchStick.setPointerCapture(pointerId);
      updateStick(event);
    });
    touchStick.addEventListener('pointermove', (event) => {
      if (event.pointerId === pointerId) updateStick(event);
    });
    const release = (event) => {
      if (pointerId !== null && event.pointerId !== pointerId) return;
      pointerId = null;
      input.touchX = 0;
      input.touchY = 0;
      touchKnob.style.transform = 'translate(0, 0)';
    };
    touchStick.addEventListener('pointerup', release);
    touchStick.addEventListener('pointercancel', release);

    if (actionButton) {
      actionButton.addEventListener('pointerdown', () => {
        actionButton.textContent = '◇';
      });
      actionButton.addEventListener('pointerup', () => {
        actionButton.textContent = 'A';
      });
      actionButton.addEventListener('pointercancel', () => {
        actionButton.textContent = 'A';
      });
    }
  }

  function start() {
    if (!canvas) throw new Error('Game canvas was not found.');
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D is unavailable in this browser.');

    document.documentElement.dataset.veilboundVersion = VERSION;
    if (status) status.textContent = 'Bound user confirmed.';
    if (hudRoom) hudRoom.textContent = rooms[player.room].name;

    setupKeyboard();
    setupTouch();

    setTimeout(() => {
      if (boot) boot.hidden = true;
      if (hud) hud.hidden = false;
      if (touchControls) touchControls.hidden = false;
      canvas.focus({ preventScroll: true });
    }, 350);

    let previous = performance.now();
    const frame = (timeMs) => {
      resizeCanvas();
      const dt = Math.min((timeMs - previous) / 1000, 0.05);
      previous = timeMs;
      update(dt);
      drawWorld(ctx);
      window.requestAnimationFrame(frame);
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.requestAnimationFrame(frame);
    console.info(`[VEILBOUND] v${VERSION} playable runtime booted successfully.`);
  }

  try {
    start();
  } catch (error) {
    fail(error);
  }
})();
