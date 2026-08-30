(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // Dungeon mechanisms, extracted from the main runtime as docs/SUNKEN_ARCHIVE.md asks.
  //
  // Four primitives, all authored per room:
  //
  //   doors    { id, x, y, w, h, flag }            closed and solid until the flag is set
  //   switches { id, x, y, radius, flag,           latches its flag when weighted; a plate
  //              needsBlock, say }                 with needsBlock ignores the player
  //   blocks   { id, x, y, size }                  pushed by walking into them
  //   water    { x, y, w, h, flag }                impassable until the flag drains it
  //
  // Block positions are room-local and reset on entry. Anything that must outlive the room
  // is a world flag, per rule 2.6, so a solved puzzle stays solved without persisting the
  // block itself.

  const PUSH_RATE = 0.62;      // block speed as a fraction of the pusher's
  const PLATE_SETTLE = 0.55;   // how centred a block must be to count as seated

  let blocks = [];
  let roomId = null;
  let api = null;

  const rect = (r, x, y, rad) => {
    const cx = Math.max(r.x, Math.min(x, r.x + r.w));
    const cy = Math.max(r.y, Math.min(y, r.y + r.h));
    const dx = x - cx, dy = y - cy;
    return dx * dx + dy * dy < rad * rad;
  };

  const room = id => (api ? api.rooms[id] : null);
  const held = flag => Boolean(api && api.hasFlag(flag));

  function closedDoors(id) {
    const r = room(id);
    return ((r && r.doors) || []).filter(door => !held(door.flag));
  }

  function highWater(id) {
    const r = room(id);
    return ((r && r.water) || []).filter(w => !held(w.flag));
  }

  // Everything a mover can be stopped by, other than the room's own walls.
  function blocked(id, x, y, radius, ignoreBlock) {
    for (const door of closedDoors(id)) if (rect(door, x, y, radius)) return true;
    for (const w of highWater(id)) if (rect(w, x, y, radius)) return true;
    if (id !== roomId) return false;
    for (const b of blocks) {
      if (b === ignoreBlock) continue;
      if (rect(box(b), x, y, radius)) return true;
    }
    return false;
  }

  const box = b => ({ x: b.x - b.size / 2, y: b.y - b.size / 2, w: b.size, h: b.size });

  function enterRoom(id) {
    roomId = id;
    const r = room(id);
    // Authored positions every time: a half-pushed block should never be what greets a
    // player returning to a room they left.
    blocks = ((r && r.blocks) || []).map(b => ({ ...b }));
  }

  // Called when the player is stopped on an axis. Moves the block if its own path is clear,
  // so pushing succeeds or fails as a whole rather than letting a block enter a wall.
  // Returns the distance actually moved, so the pusher can travel with it and stay in
  // contact; without that the two alternate frames and pushing crawls at half speed.
  function push(id, dx, dy, pusher) {
    if (id !== roomId || (!dx && !dy)) return 0;
    for (const b of blocks) {
      if (!rect(box(b), pusher.x + dx, pusher.y + dy, pusher.radius)) continue;
      const step = { x: b.x + Math.sign(dx) * Math.abs(dx) * PUSH_RATE, y: b.y + Math.sign(dy) * Math.abs(dy) * PUSH_RATE };
      const half = b.size / 2;
      const corners = [[-half, -half], [half, -half], [-half, half], [half, half]];
      const clear = corners.every(([ox, oy]) =>
        !api.wallsBlock(id, step.x + ox, step.y + oy, 1) && !blocked(id, step.x + ox, step.y + oy, 1, b));
      if (!clear) return 0;
      const moved = dx ? step.x - b.x : step.y - b.y;
      b.x = step.x; b.y = step.y;
      return moved;
    }
    return 0;
  }

  // A plate latches when it is weighted. `needsBlock` plates ignore the player, which is
  // what makes the block the answer rather than standing on it.
  function update(player) {
    const r = room(roomId);
    if (!r || !r.switches) return;
    for (const sw of r.switches) {
      if (held(sw.flag)) continue;
      const seated = sw.needsBlock
        ? blocks.some(b => Math.hypot(b.x - sw.x, b.y - sw.y) <= sw.radius * PLATE_SETTLE + b.size * 0.2)
        : Math.hypot(player.x - sw.x, player.y - sw.y) <= player.radius + sw.radius;
      if (seated) api.onSwitch(sw);
    }
  }

  function draw(ctx) {
    const r = room(roomId);
    if (!r) return;
    const now = performance.now();
    for (const w of (r.water || [])) {
      const drained = held(w.flag);
      if (drained) {
        // Drained: a wet stone channel, visibly walkable.
        ctx.fillStyle = 'rgba(24,42,44,.85)';
        ctx.fillRect(w.x, w.y, w.w, w.h);
        ctx.strokeStyle = 'rgba(127,231,225,.16)';
        ctx.lineWidth = 2;
        ctx.strokeRect(w.x + 1, w.y + 1, w.w - 2, w.h - 2);
        continue;
      }
      ctx.fillStyle = 'rgba(18,74,84,.92)';
      ctx.fillRect(w.x, w.y, w.w, w.h);
      // Slow bands so the surface reads as water rather than a coloured slab.
      ctx.strokeStyle = 'rgba(150,226,222,.16)';
      ctx.lineWidth = 2;
      for (let i = 0; i < w.h; i += 14) {
        const wobble = Math.sin(now * 0.0011 + i * 0.35) * 7;
        ctx.beginPath();
        ctx.moveTo(w.x + 6 + wobble, w.y + i + 7);
        ctx.lineTo(w.x + w.w - 6 + wobble, w.y + i + 7);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(127,231,225,.34)';
      ctx.strokeRect(w.x + 1, w.y + 1, w.w - 2, w.h - 2);
    }

    for (const sw of (r.switches || [])) {
      const active = held(sw.flag);
      ctx.fillStyle = active ? 'rgba(127,231,225,.22)' : 'rgba(202,184,139,.12)';
      ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = active ? '#7fe7e1' : 'rgba(211,193,151,.62)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.radius - 4, 0, Math.PI * 2); ctx.stroke();
      if (sw.needsBlock && !active) {
        // A plate the player cannot solve alone says so, with a weight mark.
        ctx.strokeStyle = 'rgba(211,193,151,.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(sw.x - 9, sw.y - 9, 18, 18);
      }
    }

    for (const b of blocks) {
      const s = b.size, x = b.x - s / 2, y = b.y - s / 2;
      ctx.fillStyle = 'rgba(0,0,0,.3)';
      ctx.fillRect(x + 4, y + 6, s, s);
      ctx.fillStyle = '#3d4a4b';
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = '#4d5c5d';
      ctx.fillRect(x + 5, y + 5, s - 10, s - 10);
      ctx.strokeStyle = 'rgba(127,231,225,.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 11, y + 11, s - 22, s - 22);
    }

    for (const door of (r.doors || [])) {
      const open = held(door.flag);
      ctx.fillStyle = open ? 'rgba(127,231,225,.10)' : '#1a2426';
      ctx.fillRect(door.x, door.y, door.w, door.h);
      ctx.strokeStyle = open ? 'rgba(127,231,225,.5)' : 'rgba(150,170,168,.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(door.x + 1, door.y + 1, door.w - 2, door.h - 2);
      if (open) continue;
      ctx.strokeStyle = 'rgba(211,193,151,.45)';
      for (let i = door.x + 12; i < door.x + door.w - 6; i += 16) {
        ctx.beginPath(); ctx.moveTo(i, door.y + 5); ctx.lineTo(i, door.y + door.h - 5); ctx.stroke();
      }
    }
  }

  window.Veilbound.Puzzles = {
    init(options) { api = options; },
    enterRoom,
    update,
    push,
    blocked,
    draw,
    closedDoors,
    blocks: () => blocks,
    state: () => ({ room: roomId, blocks: blocks.length }),
  };
})();
