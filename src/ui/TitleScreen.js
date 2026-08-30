(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  const NOTICE = {
    unreadable: 'A saved journey was found, but it could not be read. Starting a new journey will replace it.',
    incompatible: 'A saved journey was found from an older build. It cannot be resumed. Starting a new journey will replace it.',
    unavailable: 'This browser is not allowing local storage. You can play, but nothing will be saved.',
  };

  const el = id => document.getElementById(id);

  // The title never destroys a save on its own. Anything that replaces stored progress
  // routes through confirm(), so an unreadable save survives until the player says otherwise.
  const TitleScreen = {
    present({ version, inspection, describeSave, settings, onSettingsChange, onStart }) {
      const screen = el('title-screen');
      const settingsScreen = el('settings-screen');
      const confirmPanel = el('title-confirm');
      const menu = el('title-menu');
      const continueButton = el('title-continue');
      const continueDetail = el('title-continue-detail');
      const newButton = el('title-new');
      const settingsButton = el('title-settings');
      const notice = el('title-notice');
      const hint = el('title-hint');
      const versionLabel = el('title-version');
      const confirmText = el('title-confirm-text');
      const confirmYes = el('title-confirm-yes');
      const confirmNo = el('title-confirm-no');
      const audioButton = el('settings-audio');
      const diagnosticsButton = el('settings-diagnostics');
      const eraseButton = el('settings-erase');
      const backButton = el('settings-back');
      if (!screen) throw new Error('Title screen markup is missing.');

      let state = { ...settings };
      let status = inspection.status;
      let padConnected = false;
      let pendingConfirm = null;

      function controlHint() {
        if (padConnected) return 'LEFT STICK MOVE    A SHARDBLADE    B RESONANCE';
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
          return 'STICK TO MOVE    ⚔ SHARDBLADE    ◇ RESONANCE';
        }
        return 'WASD / ARROWS    SPACE SHARDBLADE    E RESONANCE';
      }

      function refresh() {
        const resumable = status === 'ready';
        continueButton.hidden = !resumable;
        if (resumable) continueDetail.textContent = describeSave(inspection.data);
        eraseButton.hidden = status === 'empty' || status === 'unavailable';
        const message = NOTICE[status];
        notice.hidden = !message;
        if (message) notice.textContent = message;
        hint.textContent = controlHint();
        audioButton.textContent = `AUDIO  ${state.audio ? 'ON' : 'OFF'}`;
        audioButton.setAttribute('aria-pressed', String(Boolean(state.audio)));
        diagnosticsButton.textContent = `DIAGNOSTICS OVERLAY  ${state.debugOverlay ? 'ON' : 'OFF'}`;
        diagnosticsButton.setAttribute('aria-pressed', String(Boolean(state.debugOverlay)));
      }

      function showConfirm(text, confirmLabel, action) {
        pendingConfirm = action;
        confirmText.textContent = text;
        confirmYes.textContent = confirmLabel;
        menu.hidden = true;
        confirmPanel.hidden = false;
        confirmYes.focus({ preventScroll: true });
      }

      function closeConfirm() {
        pendingConfirm = null;
        confirmPanel.hidden = true;
        menu.hidden = false;
        focusPrimary();
      }

      function focusPrimary() {
        const target = continueButton.hidden ? newButton : continueButton;
        target.focus({ preventScroll: true });
      }

      function begin(mode) {
        screen.hidden = true;
        settingsScreen.hidden = true;
        onStart(mode);
      }

      function startNewGame() {
        if (status === 'ready') {
          showConfirm('This replaces your saved journey. It cannot be recovered.', 'REPLACE AND BEGIN', () => begin('new'));
          return;
        }
        begin('new');
      }

      continueButton.addEventListener('click', () => begin('continue'));
      newButton.addEventListener('click', startNewGame);
      settingsButton.addEventListener('click', () => {
        screen.hidden = true;
        settingsScreen.hidden = false;
        audioButton.focus({ preventScroll: true });
      });
      confirmYes.addEventListener('click', () => {
        const action = pendingConfirm;
        closeConfirm();
        if (action) action();
      });
      confirmNo.addEventListener('click', closeConfirm);

      audioButton.addEventListener('click', () => {
        state = { ...state, audio: !state.audio };
        onSettingsChange(state);
        refresh();
      });
      diagnosticsButton.addEventListener('click', () => {
        state = { ...state, debugOverlay: !state.debugOverlay };
        onSettingsChange(state);
        refresh();
      });
      eraseButton.addEventListener('click', () => {
        settingsScreen.hidden = true;
        screen.hidden = false;
        showConfirm('This erases your saved journey. It cannot be recovered.', 'ERASE', () => {
          window.Veilbound.SaveManager.reset();
          status = 'empty';
          inspection = { status: 'empty' };
          refresh();
        });
      });
      backButton.addEventListener('click', () => {
        settingsScreen.hidden = true;
        screen.hidden = false;
        focusPrimary();
      });

      addEventListener('gamepadconnected', () => { padConnected = true; refresh(); });
      addEventListener('gamepaddisconnected', () => { padConnected = false; refresh(); });

      // Key art that fails to load would leave a broken-image box across the whole plate.
      // Hiding it falls back to the gradient the section already paints.
      const art = el('title-art');
      if (art) {
        if (art.complete && art.naturalWidth === 0) art.classList.add('is-missing');
        art.addEventListener('error', () => art.classList.add('is-missing'));
      }

      versionLabel.textContent = `v${version}`;
      refresh();
      screen.hidden = false;
      focusPrimary();
    },
  };

  window.Veilbound.TitleScreen = TitleScreen;
})();
