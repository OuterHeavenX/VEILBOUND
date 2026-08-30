(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // The pause / character menu.
  //
  // Built in the UI language the title screen, HUD and dialogue already establish: near
  // black, thin cyan and amber rules, monospace caps. The uploaded menu kit's wooden panels
  // are a different palette family and would fight that, so what it contributes here is its
  // icon sheet: rows 0-5 of Icons.png are amber monochrome glyphs that sit naturally on a
  // dark ground. Everything the menu shows is real save state.

  // Column and row of each glyph in assets/menu_buttons/Icons.png, 16px cells.
  const ICON = {
    vitality: [5, 0], xp: [1, 1], jp: [4, 1], coins: [0, 1],
    shardblade: [1, 0], axiom: [1, 5], inventory: [2, 0], equipment: [0, 3],
    region: [2, 1], journey: [1, 1],
  };

  // Authored milestones, in the order a player meets them.
  const JOURNEY = [
    { flag: 'greyhaven.met.innkeeper', label: 'MET MARETH' },
    { flag: 'greyhaven.rested', label: 'RESTED AT THE HEARTH' },
    { flag: 'greyhaven.quest.reasonToLeave', label: "ISEN'S REQUEST" },
    { flag: 'greyhaven.service.shardbladeRepairOffered', label: "TOLL'S OFFER" },
    { flag: 'greyhaven.quest.wrenClapper', label: "WREN'S CLAPPER" },
    { flag: 'story.axiomAwakened', label: 'AXIOM AWAKENED' },
    { flag: 'ruin.resonanceCoreRead', label: 'CORE MEMORY FRAGMENT' },
    { flag: 'march.field2.resonanceRouteRevealed', label: 'BURIED VEIN ROUTE' },
    { flag: 'greyhaven.liftStationScanned', label: 'LIFT STATION SCANNED' },
  ];

  const PROTOCOLS = [
    { id: 'resonance', label: 'RESONANCE', hint: 'REVEALS DORMANT VEIN STRUCTURE' },
    { id: 'tether', label: 'TETHER', hint: 'NOT YET RECOVERED' },
  ];

  const el = id => document.getElementById(id);
  const icon = name => {
    const [x, y] = ICON[name];
    return `<i class="menu-icon" style="--ix:${x};--iy:${y}" aria-hidden="true"></i>`;
  };

  let open = false;
  let onClose = null;

  function statTile(name, label, value, extra = '') {
    return `<div class="menu-stat">
      <div class="menu-stat-label">${icon(name)}<span>${label}</span></div>
      <div class="menu-stat-value">${value}${extra ? `<span class="menu-stat-extra">${extra}</span>` : ''}</div>
    </div>`;
  }

  function render(state) {
    const pips = Array.from({ length: state.maxHealth }, (_, i) =>
      `<span class="menu-pip${i < state.health ? ' is-full' : ''}"></span>`).join('');
    const protocols = PROTOCOLS.map(p => {
      const held = state.abilities.includes(p.id);
      return `<div class="menu-protocol${held ? ' is-held' : ''}">
        <div class="menu-protocol-name">${held ? '◇' : '✕'} ${p.label}</div>
        <div class="menu-protocol-hint">${held ? p.hint : 'NOT YET RECOVERED'}</div>
      </div>`;
    }).join('');

    // Only what has actually happened is named. The rest is one count, so the list stays
    // tidy and unearned milestones are not spoiled by their own labels.
    const found = JOURNEY.filter(j => state.flags[j.flag]);
    const remaining = JOURNEY.length - found.length;
    const journey = found.map(j =>
      `<li class="menu-journey-row is-met"><span class="menu-journey-mark">◆</span>${j.label}</li>`).join('')
      + (remaining ? `<li class="menu-journey-row menu-journey-rest"><span class="menu-journey-mark">◇</span>${remaining} STILL UNDISCOVERED</li>` : '')
      + (found.length ? '' : '<li class="menu-journey-row menu-journey-rest">NOTHING RECORDED YET</li>');

    el('menu-region').textContent = state.region;
    el('menu-body').innerHTML = `
      <section class="menu-card menu-card-portrait">
        <div class="menu-portrait-frame">
          <div class="menu-portrait-glow" aria-hidden="true"></div>
        </div>
        <h2 class="menu-name">KAEL</h2>
        <p class="menu-title">RELIC HUNTER</p>
        <p class="menu-locale">${icon('region')}<span>${state.region}</span></p>
        <div class="menu-vitality-block">
          <h3 class="menu-heading">${icon('vitality')}<span>VITALITY</span></h3>
          <div class="menu-vitality">
            <div class="menu-vitality-count">${state.health}<span>/${state.maxHealth}</span></div>
            <div class="menu-pips">${pips}</div>
          </div>
        </div>
      </section>

      <section class="menu-card">
        <h3 class="menu-heading">${icon('xp')}<span>ATTAINMENT</span></h3>
        <div class="menu-stat-grid">
          ${statTile('xp', 'XP', state.xp)}
          ${statTile('jp', 'JP', state.jp)}
          ${statTile('coins', 'COINS', state.coins)}
          ${statTile('shardblade', 'SHARDBLADE', `LV ${state.shardbladeLevel}`)}
        </div>
        <h3 class="menu-heading menu-heading-spaced">${icon('axiom')}<span>AXIOM PROTOCOLS</span></h3>
        <div class="menu-protocols">${protocols}</div>
      </section>

      <section class="menu-card">
        <h3 class="menu-heading">${icon('journey')}<span>JOURNEY</span><em>${found.length}/${JOURNEY.length}</em></h3>
        <ul class="menu-journey">${journey}</ul>
      </section>`;
  }

  const PauseMenu = {
    isOpen: () => open,

    open(state, close) {
      const root = el('pause-menu');
      if (!root) return false;
      onClose = close;
      render(state);
      root.hidden = false;
      open = true;
      el('menu-close').focus({ preventScroll: true });
      return true;
    },

    close() {
      const root = el('pause-menu');
      if (!root || !open) return false;
      root.hidden = true;
      open = false;
      const done = onClose;
      onClose = null;
      if (done) done();
      return true;
    },

    // Wired once at boot. Tabs are placeholders until those systems exist, and say so
    // rather than pretending to be empty panels.
    init() {
      const root = el('pause-menu');
      if (!root) return;
      el('menu-close').addEventListener('click', () => PauseMenu.close());
      root.addEventListener('pointerdown', event => { if (event.target === root) PauseMenu.close(); });
      for (const tab of root.querySelectorAll('.menu-tab')) {
        tab.addEventListener('click', () => {
          if (tab.dataset.locked === 'true') return;
          for (const other of root.querySelectorAll('.menu-tab')) other.classList.toggle('is-active', other === tab);
        });
      }
    },
  };

  window.Veilbound.PauseMenu = PauseMenu;
})();
