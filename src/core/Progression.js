(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  const KILL_XP = 2;
  const KILL_JP = 1;
  const KILL_COINS = 1;
  const PICKUP_RADIUS = 26;
  const drops = [];
  let getSaveData = null;
  let getPlayer = null;
  let getRoomName = null;
  let saveGame = null;
  let touchControls = null;
  let onMenuButton = null;
  let menuGamepadWasDown = false;

  function data() { return getSaveData ? getSaveData() : null; }
  function player() { return getPlayer ? getPlayer() : null; }

  function ensure() {
    const save = data();
    if (!save || !save.player) return;
    if (!Number.isFinite(save.player.xp)) save.player.xp = 0;
    if (!Number.isFinite(save.player.jp)) save.player.jp = 0;
    if (!Number.isFinite(save.player.coins)) save.player.coins = 0;
  }

  // A kill can raise two rewards in the same frame, so stack them instead of letting the
  // second land on top of the first.
  function toast(text) {
    const app = document.getElementById('app');
    if (!app) return;
    const el = document.createElement('div');
    el.className = 'reward-toast';
    el.style.setProperty('--stack', String(app.querySelectorAll('.reward-toast').length));
    el.textContent = text;
    app.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }

  function snapshot() {
    ensure();
    const save = data();
    const p = player();
    return {
      health: p ? p.health : save.player.health,
      maxHealth: p ? p.maxHealth : save.player.maxHealth,
      xp: save.player.xp,
      jp: save.player.jp,
      coins: save.player.coins,
      shardbladeLevel: save.player.shardbladeLevel || 1,
      abilities: Array.isArray(save.player.abilities) ? save.player.abilities : [],
      location: getRoomName ? getRoomName() : save.player.roomId,
    };
  }

  function init(options) {
    getSaveData = options.getSaveData;
    getPlayer = options.getPlayer;
    getRoomName = options.getRoomName;
    saveGame = options.saveGame;
    touchControls = options.touchControls || null;
    onMenuButton = options.onMenuButton || null;
    ensure();
  }

  function setActive(active) {
    if (touchControls) touchControls.hidden = !active;
  }

  function onEnemyDefeated(enemy) {
    if (!enemy || enemy.progressionRewarded) return;
    enemy.progressionRewarded = true;
    ensure();
    const save = data();
    save.player.xp += KILL_XP;
    save.player.jp += KILL_JP;
    drops.push({ x: enemy.x, y: enemy.y, value: KILL_COINS, life: 0, phase: Math.random() * Math.PI * 2 });
    toast(`+${KILL_XP} XP   +${KILL_JP} JP`);
  }

  function updateWorld(dt) {
    const p = player();
    if (!p) return;
    for (let i = drops.length - 1; i >= 0; i -= 1) {
      const drop = drops[i];
      drop.life += dt;
      if (Math.hypot(p.x - drop.x, p.y - drop.y) <= PICKUP_RADIUS + p.radius) {
        ensure();
        data().player.coins += drop.value;
        drops.splice(i, 1);
        toast(`+${drop.value} COIN`);
        if (saveGame) saveGame('COIN COLLECTED');
      }
    }
  }

  function clearDrops() { drops.length = 0; }

  function draw(ctx) {
    const now = performance.now() * 0.004;
    for (const drop of drops) {
      const bob = Math.sin(now + drop.phase) * 3;
      ctx.save();
      ctx.translate(drop.x, drop.y + bob);
      ctx.fillStyle = 'rgba(0,0,0,.28)';
      ctx.beginPath(); ctx.ellipse(0, 8, 9, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(214,182,111,.18)';
      ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d6b66f';
      ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#f1dfaa'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#6d572d';
      ctx.fillRect(-1, -4, 2, 8);
      ctx.restore();
    }
  }

  // Controller Start opens the menu, per docs/PROGRESSION.md.
  function updateControls() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const pad = pads && pads[0];
    const down = Boolean(pad && pad.buttons && pad.buttons[9] && pad.buttons[9].pressed);
    if (down && !menuGamepadWasDown && onMenuButton) onMenuButton();
    menuGamepadWasDown = down;
  }

  window.Veilbound.Progression = {
    init,
    setActive,
    onEnemyDefeated,
    updateWorld,
    updateControls,
    clearDrops,
    draw,
    snapshot,
    rewards: Object.freeze({ xp: KILL_XP, jp: KILL_JP, coins: KILL_COINS }),
  };
})();