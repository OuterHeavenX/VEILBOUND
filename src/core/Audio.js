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

  const DRONE = [
    { freq: 55.00, type: 'sine', gain: 0.34, detune: 0 },
    { freq: 55.00, type: 'sine', gain: 0.19, detune: 7 },
    { freq: 82.41, type: 'triangle', gain: 0.11, detune: -5 },
    { freq: 130.81, type: 'sine', gain: 0.05, detune: 4 },
    // Phone speakers roll off hard below a few hundred Hz, so the bed needs voices above
    // the drone's lowpass or it is inaudible on the device this project targets first.
    { freq: 220.00, type: 'sine', gain: 0.085, detune: 3, direct: true },
    { freq: 329.63, type: 'sine', gain: 0.042, detune: -4, direct: true },
  ];
  // A minor pentatonic, low and sparse. The bell has no clapper in Greyhaven, so it
  // should read as memory rather than melody.
  const BELL_NOTES = [220.00, 261.63, 329.63, 392.00, 440.00];
  // Inharmonic ratios are what make a struck sine read as a bell instead of a beep.
  const BELL_PARTIALS = [[1, 1], [2.76, 0.36], [5.40, 0.16], [8.93, 0.07]];
  const BELL_MIN_GAP = 7, BELL_MAX_GAP = 16;
  const FADE_IN = 2.6;

  let ctx = null;
  let master = null;
  let analyser = null;
  let levelBuffer = null;
  let ambient = null;
  let bellTimer = 0;
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
  function buildBed(c, dest, at) {
    const nodes = [];

    const droneFilter = c.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 340;
    droneFilter.Q.value = 0.7;
    droneFilter.connect(dest);
    const droneGain = c.createGain();
    droneGain.gain.value = 0.5;
    droneGain.connect(droneFilter);
    const upperGain = c.createGain();
    upperGain.gain.value = 0.5;
    upperGain.connect(dest);
    for (const voice of DRONE) {
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
    windBand.frequency.value = 520;
    windBand.Q.value = 0.8;
    const windGain = c.createGain();
    windGain.gain.value = 0.22;
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

  function strikeBell() {
    if (!ambient || !ctx) return;
    strike(ctx, ambient.bed, ctx.currentTime + 0.02, BELL_NOTES[Math.floor(Math.random() * BELL_NOTES.length)]);
  }

  function scheduleBell() {
    clearTimeout(bellTimer);
    const gap = (BELL_MIN_GAP + Math.random() * (BELL_MAX_GAP - BELL_MIN_GAP)) * 1000;
    bellTimer = setTimeout(() => {
      if (!ambient) return;
      strikeBell();
      scheduleBell();
    }, gap);
  }

  const Audio = {
    isSupported() {
      return Boolean(Ctor());
    },

    configure(next) {
      settings = { ...settings, ...(next || {}) };
      if (!settings.audio) Audio.fadeOut(0.4);
      return settings;
    },

    // Must be called from a real user gesture. Safe to call repeatedly.
    unlock() {
      const c = ensureContext();
      if (!c) return Promise.resolve(false);
      if (c.state === 'suspended') return c.resume().then(() => true, () => false);
      return Promise.resolve(true);
    },

    playTitleAmbience() {
      if (!settings.audio || ambient) return false;
      const c = ensureContext();
      if (!c) return false;
      if (c.state === 'suspended') c.resume().catch(() => {});
      const now = c.currentTime;

      const bed = c.createGain();
      bed.gain.value = 1;
      bed.connect(master);
      const nodes = buildBed(c, bed, now);

      ambient = { bed, nodes };
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(settings.volume, now + FADE_IN);
      scheduleBell();
      return true;
    },

    // Dynamic transition rather than an abrupt cut, per ECHO's pillars.
    fadeOut(seconds = 1.2) {
      clearTimeout(bellTimer);
      if (!ctx || !ambient) return false;
      const now = ctx.currentTime;
      const closing = ambient;
      ambient = null;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
      setTimeout(() => {
        for (const node of closing.nodes) {
          try { node.stop(); } catch (error) { /* already stopped */ }
        }
        try { closing.bed.disconnect(); } catch (error) { /* already detached */ }
      }, seconds * 1000 + 150);
      return true;
    },

    // Good citizen: give the audio hardware back while the tab is not visible.
    suspend() {
      if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
    },

    resume() {
      if (ctx && ctx.state === 'suspended' && ambient) ctx.resume().catch(() => {});
    },

    isPlaying() {
      return Boolean(ambient);
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
    render(seconds = 24, sampleRate = 44100) {
      const OfflineCtor = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!OfflineCtor) return Promise.resolve(null);
      const c = new OfflineCtor(1, Math.floor(seconds * sampleRate), sampleRate);
      const bus = c.createGain();
      bus.gain.value = settings.volume;
      bus.connect(c.destination);
      buildBed(c, bus, 0);
      for (let at = 2.5; at < seconds - 2; at += BELL_MIN_GAP) {
        strike(c, bus, at, BELL_NOTES[Math.floor(Math.random() * BELL_NOTES.length)]);
      }
      return c.startRendering().then(buffer => Array.from(buffer.getChannelData(0)));
    },

    state() {
      return {
        supported: Audio.isSupported(),
        enabled: Boolean(settings.audio),
        context: ctx ? ctx.state : 'none',
        ambient: Boolean(ambient),
        gain: master ? Math.round(master.gain.value * 1000) / 1000 : 0,
        level: Math.round(Audio.level() * 10000) / 10000,
      };
    },
  };

  window.Veilbound.Audio = Audio;
})();
