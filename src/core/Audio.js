(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // VEILBOUND ships zero-build and file://-friendly, so there are no audio assets to
  // fetch. Every voice here is synthesised through Web Audio, which also keeps the
  // sound original by construction.
  //
  // ECHO's pillars for the title bed:
  //   ancient metallic resonance  — the Greyhaven bell, struck sparsely and never on a grid
  //   restrained synthetic Vein   — a low drone that breathes rather than pulses
  //   environmental texture       — filtered noise, wind over the Hollow March
  //
  // Browsers will not start audio before a user gesture. Nothing here plays until
  // unlock() is called from a real interaction; that is a platform rule, not a bug.

  // Each region gets its own bed. Locations should be recognisable by ear, so they differ
  // in root, colour, wind and whether a bell sounds at all.
  // Inharmonic ratios are what make a struck sine read as a bell instead of a beep.
  const BELL_PARTIALS = [[1, 1], [2.76, 0.36], [5.40, 0.16], [8.93, 0.07]];

  const REGIONS = {
    title: {
      drone: [
        { freq: 55.00, type: 'sine', gain: 0.34, detune: 0 },
        { freq: 55.00, type: 'sine', gain: 0.19, detune: 7 },
        { freq: 82.41, type: 'triangle', gain: 0.11, detune: -5 },
        { freq: 130.81, type: 'sine', gain: 0.05, detune: 4 },
        { freq: 220.00, type: 'sine', gain: 0.085, detune: 3, direct: true },
        { freq: 329.63, type: 'sine', gain: 0.042, detune: -4, direct: true },
      ],
      cutoff: 340, wind: 0.22, windFreq: 520, bell: [220.00, 261.63, 329.63, 392.00, 440.00], bellGap: [7, 16], level: 1.0,
    },
    // Greyhaven: warmer, lower, and the town's bell tower answers now and then.
    greyhaven: {
      drone: [
        { freq: 49.00, type: 'sine', gain: 0.30, detune: 0 },
        { freq: 73.42, type: 'triangle', gain: 0.10, detune: 6 },
        { freq: 196.00, type: 'sine', gain: 0.070, detune: -3, direct: true },
        { freq: 293.66, type: 'sine', gain: 0.030, detune: 5, direct: true },
      ],
      cutoff: 300, wind: 0.13, windFreq: 430, bell: [196.00, 246.94, 293.66], bellGap: [14, 26], level: 0.6,
    },
    // Hollow March: open grassland, so mostly wind and a thin low drone. No bell out here.
    march: {
      drone: [
        { freq: 55.00, type: 'sine', gain: 0.22, detune: 0 },
        { freq: 82.41, type: 'sine', gain: 0.07, detune: -6 },
        { freq: 246.94, type: 'sine', gain: 0.055, detune: 4, direct: true },
      ],
      cutoff: 320, wind: 0.34, windFreq: 640, bell: null, bellGap: [0, 0], level: 0.55,
    },
    // The relic chamber: tight, metallic, and the Vein is close.
    ruin: {
      drone: [
        { freq: 41.20, type: 'sine', gain: 0.32, detune: 0 },
        { freq: 61.74, type: 'triangle', gain: 0.13, detune: 8 },
        { freq: 164.81, type: 'sine', gain: 0.075, detune: -5, direct: true },
        { freq: 246.94, type: 'sine', gain: 0.048, detune: 6, direct: true },
      ],
      cutoff: 260, wind: 0.09, windFreq: 300, bell: [164.81, 207.65, 246.94], bellGap: [9, 18], level: 0.62,
    },
    // The Sunken Archive: deepest and slowest, with water in the wind band.
    archive: {
      drone: [
        { freq: 36.71, type: 'sine', gain: 0.34, detune: 0 },
        { freq: 55.00, type: 'triangle', gain: 0.12, detune: 5 },
        { freq: 146.83, type: 'sine', gain: 0.080, detune: -4, direct: true },
        { freq: 220.00, type: 'sine', gain: 0.040, detune: 7, direct: true },
      ],
      cutoff: 240, wind: 0.20, windFreq: 900, bell: [146.83, 174.61, 220.00, 261.63], bellGap: [11, 22], level: 0.66,
    },
  };

  const FADE_IN = 2.6;
  const CROSSFADE = 1.4;

  let ctx = null;
  let master = null;
  let analyser = null;
  let levelBuffer = null;
  let bed = null;
  let pendingRegion = null;
  let sfx = null;
  let sfxAnalyser = null;
  let sfxBuffer = null;
  let noiseBuffer = null;
  let settings = { audio: true, volume: 0.7 };

  const Ctor = () => window.AudioContext || window.webkitAudioContext;

  function ensureContext() {
    if (ctx) return ctx;
    const AudioCtor = Ctor();
    if (!AudioCtor) return null;
    try {
      ctx = new AudioCtor();
    } catch (error) {
      console.warn('[VEILBOUND] Audio is unavailable.', error);
      return null;
    }
    master = ctx.createGain();
    master.gain.value = 0;
    // Pass-through analyser so the real output level is observable, in the diagnostics
    // overlay and in tests. Without it, "the bed is playing" is only ever an assumption.
    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    levelBuffer = new Float32Array(analyser.fftSize);
    master.connect(analyser);
    analyser.connect(ctx.destination);
    return ctx;
  }

  function windBuffer(c) {
    if (noiseBuffer) return noiseBuffer;
    const frames = Math.floor(c.sampleRate * 2);
    noiseBuffer = c.createBuffer(1, frames, c.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    // Lightly integrated noise: closer to wind than to static.
    let last = 0;
    for (let i = 0; i < frames; i++) {
      last = (last + (Math.random() * 2 - 1) * 0.32) * 0.94;
      data[i] = last;
    }
    return noiseBuffer;
  }

  function strike(c, dest, at, root) {
    for (const [ratio, amp] of BELL_PARTIALS) {
      const osc = c.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = root * ratio;
      osc.detune.value = (Math.random() - 0.5) * 7;
      const gain = c.createGain();
      const decay = 5.2 / Math.sqrt(ratio);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, 0.17 * amp), at + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(at);
      osc.stop(at + decay + 0.1);
    }
  }

  // Drone plus wind, built against whatever context it is handed, so the same synthesis
  // serves live playback and an offline audition render.
  function buildBed(c, dest, at, spec) {
    const nodes = [];

    const droneFilter = c.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = spec.cutoff;
    droneFilter.Q.value = 0.7;
    droneFilter.connect(dest);
    const droneGain = c.createGain();
    droneGain.gain.value = 0.5;
    droneGain.connect(droneFilter);
    const upperGain = c.createGain();
    upperGain.gain.value = 0.5;
    upperGain.connect(dest);
    for (const voice of spec.drone) {
      const osc = c.createOscillator();
      osc.type = voice.type;
      osc.frequency.value = voice.freq;
      osc.detune.value = voice.detune;
      const gain = c.createGain();
      gain.gain.value = voice.gain * 0.55;
      osc.connect(gain);
      gain.connect(voice.direct ? upperGain : droneGain);
      osc.start(at);
      nodes.push(osc);
    }

    // The drone breathes instead of holding flat.
    const breath = c.createOscillator();
    breath.type = 'sine';
    breath.frequency.value = 0.045;
    const breathDepth = c.createGain();
    breathDepth.gain.value = 0.18;
    breath.connect(breathDepth);
    breathDepth.connect(droneGain.gain);
    breathDepth.connect(upperGain.gain);
    breath.start(at);
    nodes.push(breath);

    const wind = c.createBufferSource();
    wind.buffer = windBuffer(c);
    wind.loop = true;
    const windBand = c.createBiquadFilter();
    windBand.type = 'bandpass';
    windBand.frequency.value = spec.windFreq;
    windBand.Q.value = 0.8;
    const windGain = c.createGain();
    windGain.gain.value = spec.wind;
    wind.connect(windBand);
    windBand.connect(windGain);
    windGain.connect(dest);
    wind.start(at);
    nodes.push(wind);

    const gust = c.createOscillator();
    gust.type = 'sine';
    gust.frequency.value = 0.07;
    const gustDepth = c.createGain();
    gustDepth.gain.value = 180;
    gust.connect(gustDepth);
    gustDepth.connect(windBand.frequency);
    gust.start(at);
    nodes.push(gust);

    return nodes;
  }

  function strikeBell(bed) {
    if (!ctx || !bed || !bed.spec.bell) return;
    const notes = bed.spec.bell;
    strike(ctx, bed.gain, ctx.currentTime + 0.02, notes[Math.floor(Math.random() * notes.length)]);
  }

  function scheduleBell(bed) {
    clearTimeout(bed.bellTimer);
    if (!bed.spec.bell) return;
    const [lo, hi] = bed.spec.bellGap;
    bed.bellTimer = setTimeout(() => {
      if (bed.stopped) return;
      strikeBell(bed);
      scheduleBell(bed);
    }, (lo + Math.random() * (hi - lo)) * 1000);
  }

  function startBed(key) {
    const spec = REGIONS[key];
    const c = ensureContext();
    if (!spec || !c) return null;
    const now = c.currentTime;
    const gain = c.createGain();
    gain.gain.value = 0;
    gain.connect(master);
    const bed = { key, spec, gain, nodes: buildBed(c, gain, now, spec), bellTimer: 0, stopped: false };
    gain.gain.linearRampToValueAtTime(spec.level === undefined ? 1 : spec.level, now + FADE_IN);
    scheduleBell(bed);
    return bed;
  }

  function stopBed(bed, seconds) {
    if (!bed || bed.stopped) return;
    bed.stopped = true;
    clearTimeout(bed.bellTimer);
    const now = ctx.currentTime;
    bed.gain.gain.cancelScheduledValues(now);
    bed.gain.gain.setValueAtTime(Math.max(0.0001, bed.gain.gain.value), now);
    bed.gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
    setTimeout(() => {
      for (const node of bed.nodes) { try { node.stop(); } catch (error) { /* already stopped */ } }
      try { bed.gain.disconnect(); } catch (error) { /* already detached */ }
    }, seconds * 1000 + 150);
  }

  // One-shots. Every voice is synthesised on the spot and disposes itself.
  function tone({ freq, endFreq, type = 'sine', gain = 0.2, attack = 0.006, decay = 0.2, delay = 0 }) {
    const c = ensureContext();
    if (!c || !settings.audio) return;
    const at = c.currentTime + delay;
    const osc = c.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), at + decay);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    osc.connect(g);
    g.connect(sfxBus());
    osc.start(at);
    osc.stop(at + decay + 0.05);
  }

  function noise({ gain = 0.2, decay = 0.18, freq = 1400, endFreq = 400, q = 1.1, delay = 0 }) {
    const c = ensureContext();
    if (!c || !settings.audio) return;
    const at = c.currentTime + delay;
    const src = c.createBufferSource();
    src.buffer = windBuffer(c);
    src.loop = true;
    const band = c.createBiquadFilter();
    band.type = 'bandpass';
    band.Q.value = q;
    band.frequency.setValueAtTime(freq, at);
    band.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), at + decay);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), at + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    src.connect(band); band.connect(g); g.connect(sfxBus());
    src.start(at);
    src.stop(at + decay + 0.05);
  }

  function sfxBus() {
    const c = ensureContext();
    if (!sfx) {
      sfx = c.createGain();
      sfx.gain.value = 0.9;
      sfxAnalyser = c.createAnalyser();
      sfxAnalyser.fftSize = 1024;
      sfxBuffer = new Float32Array(sfxAnalyser.fftSize);
      sfx.connect(sfxAnalyser);
      sfxAnalyser.connect(master);
    }
    return sfx;
  }

  // Sound should say what happened, so each cue is shaped from the action it reports.
  const CUES = {
    swing()   { noise({ gain: 0.13, decay: 0.16, freq: 2600, endFreq: 700, q: 0.8 }); },
    hit()     { noise({ gain: 0.20, decay: 0.10, freq: 1700, endFreq: 320, q: 1.4 }); tone({ freq: 150, endFreq: 70, type: 'triangle', gain: 0.22, decay: 0.13 }); },
    enemyDown() { tone({ freq: 320, endFreq: 70, type: 'triangle', gain: 0.20, decay: 0.5 }); noise({ gain: 0.14, decay: 0.42, freq: 1200, endFreq: 180, q: 0.9 }); },
    hurt()    { tone({ freq: 190, endFreq: 96, type: 'sawtooth', gain: 0.13, decay: 0.3 }); tone({ freq: 96, endFreq: 60, type: 'sine', gain: 0.18, decay: 0.36 }); },
    resonance() { tone({ freq: 180, endFreq: 900, type: 'sine', gain: 0.26, decay: 0.55 }); tone({ freq: 360, endFreq: 1800, type: 'sine', gain: 0.11, decay: 0.5, delay: 0.02 }); },
    coin()    { tone({ freq: 1046.5, gain: 0.13, decay: 0.09 }); tone({ freq: 1568.0, gain: 0.11, decay: 0.20, delay: 0.06 }); },
    blip()    { tone({ freq: 620, gain: 0.055, decay: 0.05, type: 'square' }); },
    interact() { tone({ freq: 480, endFreq: 720, gain: 0.075, decay: 0.13 }); },
    discover() { tone({ freq: 523.25, gain: 0.10, decay: 0.5 }); tone({ freq: 784.0, gain: 0.07, decay: 0.7, delay: 0.09 }); },
    menuOpen() { tone({ freq: 300, endFreq: 520, gain: 0.16, decay: 0.2 }); },
    menuClose() { tone({ freq: 520, endFreq: 280, gain: 0.14, decay: 0.2 }); },
    rest()    { tone({ freq: 261.63, gain: 0.09, decay: 0.8 }); tone({ freq: 392.0, gain: 0.06, decay: 1.0, delay: 0.12 }); },
  };

  const Audio = {
    isSupported() {
      return Boolean(Ctor());
    },

    configure(next) {
      const wasOff = !settings.audio;
      settings = { ...settings, ...(next || {}) };
      if (!settings.audio) Audio.fadeOut(0.4);
      else if (wasOff && pendingRegion) Audio.setRegion(pendingRegion);
      return settings;
    },

    // Must be called from a real user gesture. Safe to call repeatedly.
    unlock() {
      const c = ensureContext();
      if (!c) return Promise.resolve(false);
      if (c.state === 'suspended') return c.resume().then(() => true, () => false);
      return Promise.resolve(true);
    },

    // Crossfade to a region's bed. A dynamic transition rather than an abrupt
    // replacement, per ECHO's pillars. Calling it again with the same key is a no-op.
    setRegion(key) {
      if (!REGIONS[key]) return false;
      pendingRegion = key;
      if (!settings.audio) return false;
      const c = ensureContext();
      if (!c) return false;
      if (c.state === 'suspended') c.resume().catch(() => {});
      if (bed && bed.key === key && !bed.stopped) return true;
      const previous = bed;
      bed = startBed(key);
      if (previous) stopBed(previous, CROSSFADE);
      const now = c.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
      master.gain.linearRampToValueAtTime(settings.volume, now + 0.4);
      return Boolean(bed);
    },

    playTitleAmbience() {
      return Audio.setRegion('title');
    },

    // One-shot cue. An unknown name is ignored rather than thrown, so a caller can name a
    // cue before it is designed.
    sfx(name) {
      if (!settings.audio) return false;
      const cue = CUES[name];
      if (!cue) return false;
      const c = ensureContext();
      if (!c || c.state === 'suspended') return false;
      cue();
      return true;
    },

    region() {
      return bed ? bed.key : null;
    },

    // Silence everything; used when leaving play entirely.
    fadeOut(seconds = 1.2) {
      if (!ctx || !bed) return false;
      stopBed(bed, seconds);
      bed = null;
      pendingRegion = null;
      return true;
    },

    // Good citizen: give the audio hardware back while the tab is not visible.
    suspend() {
      if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
    },

    resume() {
      if (ctx && ctx.state === 'suspended' && bed) ctx.resume().catch(() => {});
    },

    isPlaying() {
      return Boolean(bed);
    },

    // RMS of the cue bus alone, so a one-shot can be measured without the bed's wind
    // swamping it.
    sfxLevel() {
      if (!sfxAnalyser || !sfxBuffer) return 0;
      sfxAnalyser.getFloatTimeDomainData(sfxBuffer);
      let sum = 0;
      for (let i = 0; i < sfxBuffer.length; i++) sum += sfxBuffer[i] * sfxBuffer[i];
      return Math.sqrt(sum / sfxBuffer.length);
    },

    // RMS of the live output, 0 when silent.
    level() {
      if (!analyser || !levelBuffer) return 0;
      analyser.getFloatTimeDomainData(levelBuffer);
      let sum = 0;
      for (let i = 0; i < levelBuffer.length; i++) sum += levelBuffer[i] * levelBuffer[i];
      return Math.sqrt(sum / levelBuffer.length);
    },

    // Offline audition of the same synthesis, for reviewing the bed without launching.
    // Returns mono PCM at the given sample rate, with bells struck at fixed offsets.
    render(seconds = 24, sampleRate = 44100, key = 'title') {
      const OfflineCtor = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!OfflineCtor) return Promise.resolve(null);
      const c = new OfflineCtor(1, Math.floor(seconds * sampleRate), sampleRate);
      const bus = c.createGain();
      bus.connect(c.destination);
      const spec = REGIONS[key] || REGIONS.title;
      bus.gain.value = settings.volume * (spec.level === undefined ? 1 : spec.level);
      buildBed(c, bus, 0, spec);
      if (spec.bell) {
        for (let at = 2.5; at < seconds - 2; at += spec.bellGap[0]) {
          strike(c, bus, at, spec.bell[Math.floor(Math.random() * spec.bell.length)]);
        }
      }
      return c.startRendering().then(buffer => Array.from(buffer.getChannelData(0)));
    },

    state() {
      return {
        supported: Audio.isSupported(),
        enabled: Boolean(settings.audio),
        context: ctx ? ctx.state : 'none',
        ambient: Boolean(bed),
        region: bed ? bed.key : 'none',
        gain: master ? Math.round(master.gain.value * 1000) / 1000 : 0,
        level: Math.round(Audio.level() * 10000) / 10000,
        sfx: Math.round(Audio.sfxLevel() * 10000) / 10000,
      };
    },
  };

  window.Veilbound.Audio = Audio;
})();
