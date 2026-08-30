(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // Cutscene sequencer. ARCHITECTURE.md's cutscene contract asks for input lock, dialogue,
  // sound cues, world events, persistent flags and fade/shake; this is that, driven by data
  // so a scene is authored in src/data/ rather than hand-rolled in the runtime the way the
  // Axiom awakening was.
  //
  // A beat may carry any of:
  //   fx      { black, letterbox, shake, invert, glitch, static, flash, veins, symbol }
  //             absolute targets the effect state eases toward; shake and flash are impulses
  //   cue     an Audio.sfx name
  //   flag    ['name', value] written through the host
  //   say     [{ speaker, text }] — the beat holds until the player has read them all
  //   wait    seconds to hold before advancing (ignored when `say` is present)
  //   then    a callback fired as the beat opens
  //
  // Skipping is per-scene, not global: a scene marked `skippable` can be jumped once its
  // flag says the player has already seen it, which is the retry-aware behaviour the
  // contract asks for.
  const EASE = 3.4;

  const blank = () => ({
    black: 0, letterbox: 0, invert: 0, glitch: 0, static: 0, veins: 0, symbol: 0,
    shake: 0, flash: 0,
  });

  let host = null;
  let script = null;
  let index = -1;
  let holding = 0;
  let waitingOnDialogue = false;
  let onDone = null;
  let target = blank();
  let now = blank();
  let clock = 0;

  function applyBeat(beat) {
    if (!beat) return;
    if (beat.fx) {
      for (const [key, value] of Object.entries(beat.fx)) {
        if (key === 'shake' || key === 'flash') now[key] = Math.max(now[key], value);
        else target[key] = value;
      }
    }
    if (beat.cue && host.sfx) host.sfx(beat.cue);
    if (beat.flag && host.setFlag) host.setFlag(beat.flag[0], beat.flag[1]);
    if (beat.then) beat.then();
    if (beat.say && beat.say.length) {
      waitingOnDialogue = true;
      host.say(beat.say, () => { waitingOnDialogue = false; });
      holding = 0;
    } else {
      holding = typeof beat.wait === 'number' ? beat.wait : 0;
    }
  }

  function advance() {
    index++;
    if (index >= script.length) { finish(); return; }
    applyBeat(script[index]);
  }

  function finish() {
    const done = onDone;
    script = null; index = -1; onDone = null; waitingOnDialogue = false;
    target = blank();
    if (done) done();
  }

  const Cutscene = {
    init(hostApi) { host = hostApi; },

    play(scene, done = null) {
      if (!host) throw new Error('Cutscene.init was not called.');
      script = scene.beats || scene;
      onDone = done;
      index = -1;
      target = blank();
      clock = 0;
      advance();
      return true;
    },

    // True while a scene owns the screen. The runtime uses this to hold movement, attacks,
    // interaction and room transitions, so a scene cannot be walked out of.
    active() { return script !== null; },

    // A scene in progress must survive the player pressing on: the dialogue system is what
    // paces it, so the sequencer only ticks time when nothing is being read.
    update(dt) {
      clock += dt;
      for (const key of ['black', 'letterbox', 'invert', 'glitch', 'static', 'veins', 'symbol']) {
        const next = now[key] + (target[key] - now[key]) * Math.min(1, dt * EASE);
        // Snap the tail: an exponential ease never quite reaches zero, and a veil sitting at
        // 0.004 forever is still a veil.
        now[key] = Math.abs(next - target[key]) < 0.004 ? target[key] : next;
      }
      now.shake = Math.max(0, now.shake - dt * 1.9);
      now.flash = Math.max(0, now.flash - dt * 2.6);
      if (!script || waitingOnDialogue) return;
      holding -= dt;
      if (holding <= 0) advance();
    },

    // Screen offset for shake, applied by the renderer before it draws the world.
    offset() {
      if (!script && now.shake <= 0) return { x: 0, y: 0 };
      const s = now.shake * 9;
      return { x: (Math.random() * 2 - 1) * s, y: (Math.random() * 2 - 1) * s };
    },

    state() { return now; },

    // True once nothing is left painted over the world. The host keeps ticking the sequencer
    // until this is true, even with no scene running.
    settled() {
      return !script && !now.black && !now.letterbox && !now.invert && !now.glitch &&
        !now.static && !now.veins && !now.symbol && now.shake <= 0 && now.flash <= 0;
    },

    // Drawn over the finished frame, in screen space rather than world space, so letterbox
    // and static are not scaled by the world transform.
    draw(ctx, view) {
      const s = now;
      const { offsetX: ox, offsetY: oy, drawW: w, drawH: h } = view;
      if (s.black > 0.01) {
        ctx.fillStyle = `rgba(2, 4, 5, ${Math.min(1, s.black)})`;
        ctx.fillRect(ox, oy, w, h);
      }
      if (s.veins > 0.01) {
        ctx.save();
        ctx.globalAlpha = s.veins;
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'rgba(214, 78, 62, 0.85)';
        ctx.lineWidth = Math.max(1, h * 0.004);
        for (let i = 0; i < 7; i++) {
          const y = oy + h * (0.18 + i * 0.11);
          ctx.beginPath();
          ctx.moveTo(ox, y);
          for (let x = 0; x <= w; x += w / 12) {
            ctx.lineTo(ox + x, y + Math.sin((x / w) * 9 + clock * 1.4 + i) * h * 0.012);
          }
          ctx.stroke();
        }
        ctx.restore();
      }
      if (s.glitch > 0.01) {
        ctx.save();
        ctx.fillStyle = '#000';
        const blocks = Math.round(s.glitch * 26);
        for (let i = 0; i < blocks; i++) {
          const bw = w * (0.04 + Math.random() * 0.16), bh = h * (0.02 + Math.random() * 0.06);
          ctx.fillRect(ox + Math.random() * (w - bw), oy + Math.random() * (h - bh), bw, bh);
        }
        ctx.restore();
      }
      if (s.static > 0.01) {
        ctx.save();
        ctx.globalAlpha = s.static * 0.5;
        ctx.fillStyle = 'rgba(190, 215, 210, 0.5)';
        for (let i = 0; i < 220; i++) {
          ctx.fillRect(ox + Math.random() * w, oy + Math.random() * h, 2, 2);
        }
        ctx.globalAlpha = s.static * 0.24;
        ctx.fillStyle = '#000';
        for (let y = 0; y < h; y += 3) ctx.fillRect(ox, oy + y, w, 1);
        ctx.restore();
      }
      if (s.symbol > 0.01) {
        ctx.save();
        ctx.globalAlpha = s.symbol;
        ctx.translate(ox + w / 2, oy + h / 2);
        const r = Math.min(w, h) * 0.17;
        ctx.strokeStyle = '#f2fbf8';
        ctx.lineWidth = Math.max(2, r * 0.09);
        ctx.shadowColor = 'rgba(242, 251, 248, 0.9)';
        ctx.shadowBlur = r * 0.5;
        // A circle with a piece missing: the mark the Archive answers to.
        ctx.beginPath();
        ctx.arc(0, 0, r, Math.PI * 0.28, Math.PI * 1.72);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.42);
        ctx.lineTo(0, r * 0.42);
        ctx.stroke();
        ctx.restore();
      }
      if (s.invert > 0.01) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, s.invert);
        ctx.globalCompositeOperation = 'difference';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ox, oy, w, h);
        ctx.restore();
      }
      if (s.flash > 0.01) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.85, s.flash)})`;
        ctx.fillRect(ox, oy, w, h);
      }
      if (s.letterbox > 0.01) {
        const bar = h * 0.13 * s.letterbox;
        ctx.fillStyle = '#000';
        ctx.fillRect(ox, oy, w, bar);
        ctx.fillRect(ox, oy + h - bar, w, bar);
      }
    },
  };

  window.Veilbound.Cutscene = Cutscene;
})();
