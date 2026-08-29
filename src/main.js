(() => {
  'use strict';

  const VERSION = '0.1.2-combat';
  const canvas = document.getElementById('game-canvas');
  const boot = document.getElementById('boot-screen');
  const status = document.getElementById('boot-status');
  const hud = document.getElementById('hud');
  const hudRoom = document.getElementById('hud-room');
  const hudHealth = document.getElementById('hud-health');
  const saveStatus = document.getElementById('save-status');
  const dialogue = document.getElementById('dialogue');
  const dialogueSpeaker = document.getElementById('dialogue-speaker');
  const dialogueText = document.getElementById('dialogue-text');
  const touchControls = document.getElementById('touch-controls');
  const touchStick = document.getElementById('touch-stick');
  const touchKnob = document.getElementById('touch-knob');
  const actionButton = document.getElementById('action-button');
  const fatal = document.getElementById('fatal-error');
  const fatalMessage = document.getElementById('fatal-error-message');

  const SaveManager = window.Veilbound && window.Veilbound.SaveManager;
  if (!SaveManager) throw new Error('SaveManager failed to load.');

  const WORLD = { width: 960, height: 540 };
  const particles = [];
  const enemies = [];

  const rooms = {
    greyhaven: {
      name: 'GREYHAVEN',
      ground: '#233128',
      walls: [
        { x: 0, y: 0, w: 960, h: 38 }, { x: 0, y: 502, w: 960, h: 38 },
        { x: 0, y: 0, w: 38, h: 540 }, { x: 922, y: 0, w: 38, h: 210 },
        { x: 922, y: 330, w: 38, h: 210 }, { x: 130, y: 120, w: 190, h: 92 },
        { x: 545, y: 106, w: 210, h: 106 }, { x: 330, y: 342, w: 150, h: 92 },
      ],
      exits: [{ x: 920, y: 210, w: 40, h: 120, room: 'hollowMarch1', spawnX: 62, spawnY: 270 }],
      details: 'town',
      enemies: [],
    },
    hollowMarch1: {
      name: 'HOLLOW MARCH — FIELD 1',
      ground: '#1b2921',
      walls: [
        { x: 0, y: 0, w: 960, h: 38 }, { x: 0, y: 502, w: 960, h: 38 },
        { x: 0, y: 0, w: 38, h: 205 }, { x: 0, y: 335, w: 38, h: 205 },
        { x: 922, y: 0, w: 38, h: 205 }, { x: 922, y: 335, w: 38, h: 205 },
        { x: 210, y: 118, w: 130, h: 46 }, { x: 610, y: 365, w: 145, h: 52 },
        { x: 430, y: 225, w: 90, h: 90 },
      ],
      exits: [
        { x: 0, y: 205, w: 40, h: 130, room: 'greyhaven', spawnX: 895, spawnY: 270 },
        { x: 920, y: 205, w: 40, h: 130, room: 'hollowMarch2', spawnX: 62, spawnY: 270 },
      ],
      details: 'field',
      enemies: [
        { id: 'march.field1.husk.01', type: 'husk', x: 675, y: 225 },
        { id: 'march.field1.husk.02', type: 'husk', x: 785, y: 310 },
      ],
    },
    hollowMarch2: {
      name: 'HOLLOW MARCH — FIELD 2',
      ground: '#19251f',
      walls: [
        { x: 0, y: 0, w: 960, h: 38 }, { x: 0, y: 502, w: 960, h: 38 },
        { x: 0, y: 0, w: 38, h: 205 }, { x: 0, y: 335, w: 38, h: 205 },
        { x: 922, y: 0, w: 38, h: 205 }, { x: 922, y: 335, w: 38, h: 205 },
        { x: 175, y: 300, w: 170, h: 42 }, { x: 480, y: 115, w: 210, h: 52 },
        { x: 690, y: 344, w: 95, h: 95 },
      ],
      exits: [
        { x: 0, y: 205, w: 40, h: 130, room: 'hollowMarch1', spawnX: 895, spawnY: 270 },
        { x: 920, y: 205, w: 40, h: 130, room: 'awakeningRuin', spawnX: 62, spawnY: 270 },
      ],
      details: 'field2',
      enemies: [
        { id: 'march.field2.husk.01', type: 'husk', x: 390, y: 220 },
        { id: 'march.field2.sentry.01', type: 'sentry', x: 760, y: 215 },
      ],
    },
    awakeningRuin: {
      name: 'FORGOTTEN RELIC CHAMBER',
      ground: '#11191a',
      walls: [
        { x: 0, y: 0, w: 960, h: 38 }, { x: 0, y: 502, w: 960, h: 38 },
        { x: 0, y: 0, w: 38, h: 205 }, { x: 0, y: 335, w: 38, h: 205 },
        { x: 922, y: 0, w: 38, h: 540 },
        { x: 205, y: 105, w: 80, h: 130 }, { x: 205, y: 305, w: 80, h: 130 },
        { x: 675, y: 105, w: 80, h: 130 }, { x: 675, y: 305, w: 80, h: 130 },
      ],
      exits: [{ x: 0, y: 205, w: 40, h: 130, room: 'hollowMarch2', spawnX: 895, spawnY: 270 }],
      details: 'ruin',
      enemies: [],
    },
  };

  let saveData = SaveManager.load();
  let saveStatusTimer = 0;
  let pendingAwakening = 0;
  let dialogueSequence = null;
  let dialogueIndex = -1;
  let gamepadAttackWasDown = false;
  let screenFlash = 0;

  const player = {
    x: 470, y: 300, radius: 15, speed: 205,
    facingX: 0, facingY: 1, room: 'greyhaven', walkPhase: 0,
    health: 6, maxHealth: 6, invuln: 0,
    attackTimer: 0, attackCooldown: 0, attackSerial: 0,
    knockX: 0, knockY: 0,
  };

  const input = {
    keys: new Set(), moveX: 0, moveY: 0, touchX: 0, touchY: 0,
  };

  function fail(error) {
    console.error('[VEILBOUND] runtime failure', error);
    if (boot) boot.hidden = true;
    if (hud) hud.hidden = true;
    if (touchControls) touchControls.hidden = true;
    if (fatal) fatal.hidden = false;
    if (fatalMessage) fatalMessage.textContent = error instanceof Error ? error.message : String(error);
  }

  function restoreSave() {
    const p = saveData.player || {};
    player.room = rooms[p.roomId] ? p.roomId : 'greyhaven';
    player.x = Number.isFinite(p.x) ? p.x : 470;
    player.y = Number.isFinite(p.y) ? p.y : 300;
    player.maxHealth = Number.isFinite(p.maxHealth) ? Math.max(1, p.maxHealth) : 6;
    player.health = Number.isFinite(p.health) ? Math.max(1, Math.min(player.maxHealth, p.health)) : player.maxHealth;
    if (collidesWithWalls(player.room, player.x, player.y, player.radius)) {
      player.room = 'greyhaven'; player.x = 470; player.y = 300;
    }
    spawnRoomEnemies();
    refreshHud();
  }

  function snapshotSave() {
    saveData.player.roomId = player.room;
    saveData.player.x = Math.round(player.x * 10) / 10;
    saveData.player.y = Math.round(player.y * 10) / 10;
    saveData.player.health = player.health;
    saveData.player.maxHealth = player.maxHealth;
    return saveData;
  }

  function saveGame(message = 'SAVED') {
    const ok = SaveManager.save(snapshotSave());
    if (saveStatus) saveStatus.textContent = ok ? message : 'SAVE FAILED';
    saveStatusTimer = 1.5;
  }

  function hasFlag(flag) {
    return Boolean(saveData.world.flags[flag]);
  }

  function setFlag(flag, value = true) {
    saveData.world.flags[flag] = value;
  }

  function grantAbility(id) {
    if (!Array.isArray(saveData.player.abilities)) saveData.player.abilities = [];
    if (!saveData.player.abilities.includes(id)) saveData.player.abilities.push(id);
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(window.innerWidth * dpr));
    const height = Math.max(1, Math.floor(window.innerHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    return dpr;
  }

  function getView() {
    const scale = Math.min(canvas.width / WORLD.width, canvas.height / WORLD.height);
    const drawW = WORLD.width * scale;
    const drawH = WORLD.height * scale;
    return { scale, offsetX: (canvas.width - drawW) * 0.5, offsetY: (canvas.height - drawH) * 0.5 };
  }

  function rectCircleOverlap(rect, x, y, radius) {
    const closestX = Math.max(rect.x, Math.min(x, rect.x + rect.w));
    const closestY = Math.max(rect.y, Math.min(y, rect.y + rect.h));
    const dx = x - closestX;
    const dy = y - closestY;
    return dx * dx + dy * dy < radius * radius;
  }

  function collidesWithWalls(roomId, x, y, radius) {
    return rooms[roomId].walls.some((wall) => rectCircleOverlap(wall, x, y, radius));
  }

  function tryMovePlayer(dx, dy) {
    const nextX = player.x + dx;
    const nextY = player.y + dy;
    if (!collidesWithWalls(player.room, nextX, player.y, player.radius)) player.x = nextX;
    if (!collidesWithWalls(player.room, player.x, nextY, player.radius)) player.y = nextY;
  }

  function tryMoveEnemy(enemy, dx, dy) {
    const nx = enemy.x + dx;
    const ny = enemy.y + dy;
    if (!collidesWithWalls(player.room, nx, enemy.y, enemy.radius)) enemy.x = nx;
    if (!collidesWithWalls(player.room, enemy.x, ny, enemy.radius)) enemy.y = ny;
  }

  function transitionIfNeeded() {
    const room = rooms[player.room];
    for (const exit of room.exits) {
      if (player.x + player.radius > exit.x && player.x - player.radius < exit.x + exit.w && player.y + player.radius > exit.y && player.y - player.radius < exit.y + exit.h) {
        player.room = exit.room;
        player.x = exit.spawnX;
        player.y = exit.spawnY;
        spawnRoomEnemies();
        refreshHud();
        saveGame('AUTOSAVED');
        if (player.room === 'awakeningRuin' && !hasFlag('story.axiomAwakened')) pendingAwakening = 0.7;
        return;
      }
    }
  }

  function spawnRoomEnemies() {
    enemies.length = 0;
    const definitions = rooms[player.room].enemies || [];
    for (const def of definitions) {
      if (saveData.world.defeatedEnemies[def.id]) continue;
      const isSentry = def.type === 'sentry';
      enemies.push({
        ...def,
        radius: isSentry ? 17 : 15,
        hp: isSentry ? 3 : 2,
        maxHp: isSentry ? 3 : 2,
        speed: isSentry ? 62 : 88,
        flash: 0,
        stun: 0,
        lastHitSerial: -1,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function readGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const pad = pads && pads[0];
    if (!pad) return { x: 0, y: 0, attack: false };
    const dead = 0.18;
    return {
      x: Math.abs(pad.axes[0] || 0) > dead ? pad.axes[0] : 0,
      y: Math.abs(pad.axes[1] || 0) > dead ? pad.axes[1] : 0,
      attack: Boolean(pad.buttons[0] && pad.buttons[0].pressed),
    };
  }

  function updateInput() {
    let x = 0; let y = 0;
    if (input.keys.has('ArrowLeft') || input.keys.has('KeyA')) x -= 1;
    if (input.keys.has('ArrowRight') || input.keys.has('KeyD')) x += 1;
    if (input.keys.has('ArrowUp') || input.keys.has('KeyW')) y -= 1;
    if (input.keys.has('ArrowDown') || input.keys.has('KeyS')) y += 1;
    const pad = readGamepad();
    x += input.touchX + pad.x;
    y += input.touchY + pad.y;
    const length = Math.hypot(x, y);
    if (length > 1) { x /= length; y /= length; }
    input.moveX = x; input.moveY = y;
    if (pad.attack && !gamepadAttackWasDown) actionPressed();
    gamepadAttackWasDown = pad.attack;
  }

  function actionPressed() {
    if (dialogueSequence) { advanceDialogue(); return; }
    attack();
  }

  function attack() {
    if (player.attackCooldown > 0 || player.health <= 0) return;
    player.attackTimer = 0.22;
    player.attackCooldown = 0.34;
    player.attackSerial += 1;
    spawnParticles(player.x + player.facingX * 25, player.y + player.facingY * 25, '#d9f6ef', 4, 75);
  }

  function attackHitsEnemy(enemy) {
    if (player.attackTimer <= 0.07 || enemy.lastHitSerial === player.attackSerial) return false;
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const distance = Math.hypot(dx, dy);
    if (distance > 58 + enemy.radius) return false;
    const nx = dx / (distance || 1);
    const ny = dy / (distance || 1);
    const facingDot = nx * player.facingX + ny * player.facingY;
    return facingDot > 0.15;
  }

  function damageEnemy(enemy) {
    enemy.lastHitSerial = player.attackSerial;
    enemy.hp -= 1;
    enemy.flash = 0.12;
    enemy.stun = 0.18;
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const len = Math.hypot(dx, dy) || 1;
    tryMoveEnemy(enemy, (dx / len) * 18, (dy / len) * 18);
    spawnParticles(enemy.x, enemy.y, '#bdebe1', 7, 105);
    screenFlash = Math.max(screenFlash, 0.045);

    if (enemy.hp <= 0) {
      saveData.world.defeatedEnemies[enemy.id] = true;
      spawnParticles(enemy.x, enemy.y, '#7fe7e1', 14, 135);
      saveGame('ENEMY CLEARED');
    }
  }

  function damagePlayer(fromX, fromY) {
    if (player.invuln > 0 || dialogueSequence) return;
    player.health -= 1;
    player.invuln = 0.85;
    const dx = player.x - fromX;
    const dy = player.y - fromY;
    const len = Math.hypot(dx, dy) || 1;
    player.knockX = (dx / len) * 220;
    player.knockY = (dy / len) * 220;
    spawnParticles(player.x, player.y, '#d96f6f', 9, 120);
    screenFlash = 0.12;
    refreshHud();

    if (player.health <= 0) {
      player.health = player.maxHealth;
      player.room = 'greyhaven';
      player.x = 470; player.y = 300;
      player.invuln = 1.2;
      spawnRoomEnemies();
      refreshHud();
      saveGame('RETURNED TO GREYHAVEN');
    }
  }

  function updateEnemies(dt) {
    for (const enemy of enemies) {
      enemy.flash = Math.max(0, enemy.flash - dt);
      enemy.stun = Math.max(0, enemy.stun - dt);
      enemy.phase += dt * 4;
      if (enemy.hp <= 0 || enemy.stun > 0) continue;

      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 235 && dist > enemy.radius + player.radius + 2) {
        const speedScale = enemy.type === 'sentry' ? 0.72 : 1;
        tryMoveEnemy(enemy, (dx / (dist || 1)) * enemy.speed * speedScale * dt, (dy / (dist || 1)) * enemy.speed * speedScale * dt);
      }
      if (dist < enemy.radius + player.radius + 5) damagePlayer(enemy.x, enemy.y);
      if (attackHitsEnemy(enemy)) damageEnemy(enemy);
    }

    for (let i = enemies.length - 1; i >= 0; i -= 1) {
      if (enemies[i].hp <= 0) enemies.splice(i, 1);
    }
  }

  function spawnParticles(x, y, color, count, speed) {
    for (let i = 0; i < count && particles.length < 90; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = speed * (0.45 + Math.random() * 0.65);
      particles.push({ x, y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity, life: 0.28 + Math.random() * 0.28, maxLife: 0.56, color });
    }
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i];
      p.life -= dt;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vx *= Math.pow(0.05, dt); p.vy *= Math.pow(0.05, dt);
    }
  }

  function update(dt) {
    updateInput();
    saveStatusTimer = Math.max(0, saveStatusTimer - dt);
    if (saveStatus && saveStatusTimer <= 0) saveStatus.textContent = 'SAVE V1 READY';
    screenFlash = Math.max(0, screenFlash - dt);
    player.invuln = Math.max(0, player.invuln - dt);
    player.attackTimer = Math.max(0, player.attackTimer - dt);
    player.attackCooldown = Math.max(0, player.attackCooldown - dt);

    if (pendingAwakening > 0) {
      pendingAwakening -= dt;
      if (pendingAwakening <= 0) startAwakeningCutscene();
    }

    if (!dialogueSequence) {
      if (Math.abs(player.knockX) > 1 || Math.abs(player.knockY) > 1) {
        tryMovePlayer(player.knockX * dt, player.knockY * dt);
        player.knockX *= Math.pow(0.015, dt); player.knockY *= Math.pow(0.015, dt);
      } else if (Math.abs(input.moveX) > 0.01 || Math.abs(input.moveY) > 0.01) {
        player.facingX = input.moveX; player.facingY = input.moveY;
        const len = Math.hypot(player.facingX, player.facingY) || 1;
        player.facingX /= len; player.facingY /= len;
        player.walkPhase += dt * 9;
        tryMovePlayer(input.moveX * player.speed * dt, input.moveY * player.speed * dt);
        transitionIfNeeded();
      }
      updateEnemies(dt);
    }
    updateParticles(dt);
  }

  function refreshHud() {
    if (hudRoom) hudRoom.textContent = rooms[player.room].name;
    if (hudHealth) {
      const filled = Math.max(0, player.health);
      const empty = Math.max(0, player.maxHealth - filled);
      hudHealth.textContent = `${'◆ '.repeat(filled)}${'◇ '.repeat(empty)}`.trim();
    }
  }

  function startDialogue(sequence, onComplete) {
    dialogueSequence = { lines: sequence, onComplete };
    dialogueIndex = -1;
    if (dialogue) dialogue.hidden = false;
    advanceDialogue();
  }

  function advanceDialogue() {
    if (!dialogueSequence) return;
    dialogueIndex += 1;
    if (dialogueIndex >= dialogueSequence.lines.length) {
      const done = dialogueSequence.onComplete;
      dialogueSequence = null; dialogueIndex = -1;
      if (dialogue) dialogue.hidden = true;
      if (done) done();
      return;
    }
    const line = dialogueSequence.lines[dialogueIndex];
    if (dialogueSpeaker) dialogueSpeaker.textContent = line.speaker || '';
    if (dialogueText) dialogueText.textContent = line.text;
    if (line.flash) screenFlash = 0.28;
  }

  function startAwakeningCutscene() {
    if (hasFlag('story.axiomAwakened')) return;
    screenFlash = 0.2;
    startDialogue([
      { speaker: 'SYSTEM UNKNOWN', text: 'RESONANCE DETECTED', flash: true },
      { speaker: 'SYSTEM UNKNOWN', text: 'BOUND USER CONFIRMED' },
      { speaker: 'KAEL', text: '...What are you?' },
      { speaker: 'THE AXIOM', text: 'RESONANCE PROTOCOL RESTORED', flash: true },
      { speaker: 'SYSTEM', text: 'Something far beneath Eidol has begun to wake.' },
    ], () => {
      setFlag('story.axiomAwakened', true);
      grantAbility('resonance');
      saveGame('AXIOM BOUND');
      spawnParticles(480, 270, '#7fe7e1', 30, 170);
      screenFlash = 0.35;
    });
  }

  function drawWorld(ctx) {
    const view = getView();
    const room = rooms[player.room];
    ctx.save();
    ctx.translate(view.offsetX, view.offsetY);
    ctx.scale(view.scale, view.scale);
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
      ctx.fillStyle = 'rgba(127,231,225,0.10)'; ctx.fillRect(exit.x, exit.y, exit.w, exit.h);
    }

    drawEnemies(ctx);
    drawParticles(ctx);
    drawKael(ctx);
    ctx.restore();

    if (screenFlash > 0) {
      ctx.fillStyle = `rgba(127,231,225,${Math.min(0.34, screenFlash)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function drawRoomDetails(ctx, room) {
    if (room.details === 'town') {
      ctx.fillStyle = '#4a5148'; ctx.fillRect(0, 245, 960, 50); ctx.fillRect(430, 0, 70, 540);
      ctx.fillStyle = '#29342f'; ctx.fillRect(140, 130, 170, 72); ctx.fillRect(555, 116, 190, 86); ctx.fillRect(340, 352, 130, 72);
      ctx.fillStyle = '#85755e'; ctx.fillRect(178, 185, 36, 17); ctx.fillRect(635, 185, 38, 17); ctx.fillRect(385, 352, 34, 18);
      ctx.strokeStyle = 'rgba(127,231,225,0.24)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(480, 270, 48, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(127,231,225,0.07)'; ctx.fill();
      return;
    }

    if (room.details === 'ruin') {
      ctx.fillStyle = '#1a2222'; ctx.fillRect(80, 70, 800, 400);
      ctx.strokeStyle = 'rgba(127,231,225,0.12)'; ctx.lineWidth = 3;
      for (let i = 0; i < 6; i += 1) { ctx.strokeRect(330 + i * 12, 130 + i * 9, 300 - i * 24, 280 - i * 18); }
      const active = hasFlag('story.axiomAwakened') || pendingAwakening > 0 || dialogueSequence;
      ctx.fillStyle = active ? 'rgba(127,231,225,0.12)' : 'rgba(127,231,225,0.035)';
      ctx.beginPath(); ctx.arc(480, 270, 72, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = active ? '#7fe7e1' : 'rgba(127,231,225,0.22)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(480, 270, 54, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(480, 200); ctx.lineTo(480, 340); ctx.moveTo(410, 270); ctx.lineTo(550, 270); ctx.stroke();
      return;
    }

    ctx.fillStyle = 'rgba(206,218,194,0.07)';
    for (let x = 70; x < 930; x += 86) for (let y = 74; y < 500; y += 76) {
      const sway = Math.sin((x + y) * 0.03) * 5; ctx.fillRect(x + sway, y, 2, 11); ctx.fillRect(x + sway + 5, y + 4, 2, 8);
    }
    ctx.strokeStyle = 'rgba(127,231,225,0.12)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(120, 420); ctx.lineTo(365, 100); ctx.lineTo(600, 440); ctx.stroke();
  }

  function drawEnemies(ctx) {
    for (const enemy of enemies) {
      const bob = Math.sin(enemy.phase) * 2;
      ctx.save(); ctx.translate(enemy.x, enemy.y + bob);
      ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(0, 14, 15, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = enemy.flash > 0 ? '#e8ffff' : (enemy.type === 'sentry' ? '#455d59' : '#343d36');
      if (enemy.type === 'sentry') {
        ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(16, -4); ctx.lineTo(12, 14); ctx.lineTo(-12, 14); ctx.lineTo(-16, -4); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#7fe7e1'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -4, 6, 0, Math.PI * 2); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(0, -5, 13, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-11, 1, 22, 15);
        ctx.fillStyle = '#b8c4b8'; ctx.fillRect(-7, -9, 4, 3); ctx.fillRect(4, -9, 4, 3);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(-16, -28, 32, 4);
      ctx.fillStyle = '#7fe7e1'; ctx.fillRect(-16, -28, 32 * (enemy.hp / enemy.maxHp), 4);
      ctx.restore();
    }
  }

  function drawParticles(ctx) {
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.maxLife));
      ctx.fillStyle = p.color; ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    }
    ctx.globalAlpha = 1;
  }

  function drawKael(ctx) {
    const bob = Math.sin(player.walkPhase) * 1.4;
    const fx = player.facingX; const fy = player.facingY;
    const flicker = player.invuln > 0 && Math.floor(player.invuln * 18) % 2 === 0;
    if (flicker) ctx.globalAlpha = 0.42;
    ctx.save(); ctx.translate(player.x, player.y + bob);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(0, 14, 16, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#15191a'; ctx.beginPath(); ctx.moveTo(-13, 6); ctx.lineTo(-8, -16); ctx.lineTo(0, -23); ctx.lineTo(8, -16); ctx.lineTo(13, 6); ctx.lineTo(7, 16); ctx.lineTo(-7, 16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d5d1c6'; ctx.beginPath(); ctx.ellipse(fx * 2, -17 + fy, 8, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#202628'; ctx.fillRect(-5 + fx * 3, -18 + fy, 10, 3);
    ctx.strokeStyle = '#7fe7e1'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(-11 + fx * 2, -1 + fy * 2, 5, 0, Math.PI * 2); ctx.stroke();

    if (player.attackTimer > 0) {
      const angle = Math.atan2(fy, fx);
      const progress = 1 - player.attackTimer / 0.22;
      ctx.strokeStyle = '#e2eee9'; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(0, 0, 37, angle - 1.05 + progress * 0.4, angle + 1.05 + progress * 0.4); ctx.stroke();
      ctx.strokeStyle = 'rgba(127,231,225,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 42, angle - 0.92, angle + 0.92); ctx.stroke();
    } else {
      ctx.strokeStyle = '#b8b4aa'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(7, 1); ctx.lineTo(18 + fx * 10, -8 + fy * 10); ctx.stroke();
    }
    ctx.restore(); ctx.globalAlpha = 1;
  }

  function setupKeyboard() {
    window.addEventListener('keydown', (event) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
      if (!event.repeat && ['Space', 'KeyZ', 'KeyJ', 'Enter'].includes(event.code)) actionPressed();
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
      const cx = rect.left + rect.width / 2; const cy = rect.top + rect.height / 2;
      let dx = event.clientX - cx; let dy = event.clientY - cy;
      const len = Math.hypot(dx, dy);
      if (len > max) { dx = (dx / len) * max; dy = (dy / len) * max; }
      input.touchX = dx / max; input.touchY = dy / max;
      touchKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    touchStick.addEventListener('pointerdown', (event) => { pointerId = event.pointerId; touchStick.setPointerCapture(pointerId); updateStick(event); });
    touchStick.addEventListener('pointermove', (event) => { if (event.pointerId === pointerId) updateStick(event); });
    const release = (event) => {
      if (pointerId !== null && event.pointerId !== pointerId) return;
      pointerId = null; input.touchX = 0; input.touchY = 0; touchKnob.style.transform = 'translate(0, 0)';
    };
    touchStick.addEventListener('pointerup', release); touchStick.addEventListener('pointercancel', release);
    if (actionButton) actionButton.addEventListener('pointerdown', (event) => { event.preventDefault(); actionPressed(); });
    if (dialogue) dialogue.addEventListener('pointerdown', (event) => { event.preventDefault(); advanceDialogue(); });
  }

  function start() {
    if (!canvas) throw new Error('Game canvas was not found.');
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D is unavailable in this browser.');
    document.documentElement.dataset.veilboundVersion = VERSION;
    if (status) status.textContent = 'Bound user confirmed.';

    restoreSave(); setupKeyboard(); setupTouch();
    if (player.room === 'awakeningRuin' && !hasFlag('story.axiomAwakened')) pendingAwakening = 0.7;

    setTimeout(() => {
      if (boot) boot.hidden = true;
      if (hud) hud.hidden = false;
      if (touchControls) touchControls.hidden = false;
      canvas.focus({ preventScroll: true });
    }, 350);

    let previous = performance.now();
    const frame = (timeMs) => {
      resizeCanvas();
      const dt = Math.min((timeMs - previous) / 1000, 0.05); previous = timeMs;
      update(dt); drawWorld(ctx); window.requestAnimationFrame(frame);
    };
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('pagehide', () => saveGame('AUTOSAVED'));
    window.requestAnimationFrame(frame);
    console.info(`[VEILBOUND] v${VERSION} combat runtime booted successfully.`);
  }

  try { start(); } catch (error) { fail(error); }
})();
