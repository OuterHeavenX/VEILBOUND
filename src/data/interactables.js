(() => {
  'use strict';

  window.Veilbound = window.Veilbound || {};

  // Authored interaction content, keyed by room id.
  //
  // Every entry needs a stable authored id (docs/ARCHITECTURE.md > Persistent IDs).
  // `lines` is an ordered variant list: the first variant whose `when` clause passes
  // is the one that plays, so world-state reactions are written above the defaults.
  //
  // Condition clauses: { flag, notFlag, ability } — all present keys must pass.
  // Effects: { set: ['flag'], rest: true }.

  const AXIOM_AWAKENED = 'story.axiomAwakened';
  const ARCHIVE_OPENED = 'story.archiveOpened';
  const ARCHIVIST_DEFEATED = 'boss.archivist.defeated';

  window.Veilbound.Interactables = Object.freeze({
    greyhaven: Object.freeze([
      {
        id: 'greyhaven.npc.innkeeper',
        kind: 'npc',
        sprite: 'innkeeper',
        name: 'MARETH',
        place: "WAYFARER'S REST",
        x: 182, y: 230, radius: 13, reach: 46, solid: true,
        prompt: 'TALK',
        mark: 'apron',
        palette: { body: '#4c4034', trim: '#b9a075', skin: '#c8b49a' },
        metFlag: 'greyhaven.met.innkeeper',
        lines: [
          {
            when: { flag: ARCHIVIST_DEFEATED },
            say: [
              { speaker: 'MARETH', text: 'Something under the March stopped moving. The whole town felt it stop.' },
              { speaker: 'MARETH', text: 'Room’s yours for nothing tonight. Don’t argue with me.' },
            ],
          },
          {
            when: { flag: ARCHIVE_OPENED },
            say: [
              { speaker: 'MARETH', text: 'They say the ground opened past the second field.' },
              { speaker: 'MARETH', text: 'You look like a man who already knows that.' },
            ],
          },
          {
            when: { flag: AXIOM_AWAKENED },
            say: [
              { speaker: 'MARETH', text: 'Every lamp in Greyhaven flickered last night. All of them, the same moment.' },
              { speaker: 'MARETH', text: 'Nobody slept well.' },
              { speaker: 'KAEL', text: '…I know.' },
            ],
          },
          {
            when: { notFlag: 'greyhaven.met.innkeeper' },
            say: [
              { speaker: 'MARETH', text: 'Relic hunter. You’ve got the walk for it.' },
              { speaker: 'MARETH', text: 'Bed’s yours if you want it. Hearth’s lit either way.' },
              { speaker: 'KAEL', text: 'The hearth is enough.' },
            ],
          },
          {
            say: [{ speaker: 'MARETH', text: 'Hearth’s still lit. Use it before you go.' }],
          },
        ],
      },

      {
        id: 'greyhaven.rest.wayfarers_hearth',
        kind: 'rest',
        name: 'THE HEARTH',
        place: "WAYFARER'S REST",
        x: 254, y: 226, radius: 12, reach: 44, solid: false,
        prompt: 'REST',
        lines: [
          {
            when: { notFlag: 'greyhaven.rested' },
            say: [
              { speaker: "WAYFARER'S REST", text: 'You sit. The hearth takes the cold out of the gauntlet, and the ache out of your shoulders.' },
              { speaker: 'MARETH', text: 'Anyone who makes it back this far gets the fire. That’s the whole rule.' },
            ],
            effect: { rest: true, set: ['greyhaven.rested'] },
          },
          {
            say: [{ speaker: "WAYFARER'S REST", text: 'You sit by the fire until the ache goes out of you.' }],
            effect: { rest: true },
          },
        ],
      },

      {
        id: 'greyhaven.npc.workshop',
        kind: 'npc',
        sprite: 'workshop',
        name: 'TOLL',
        place: 'RELIC WORKSHOP',
        x: 186, y: 332, radius: 13, reach: 46, solid: true,
        prompt: 'TALK',
        mark: 'goggles',
        palette: { body: '#3f4a48', trim: '#c0a24f', skin: '#b9a68d' },
        metFlag: 'greyhaven.met.workshop',
        lines: [
          {
            when: { flag: AXIOM_AWAKENED },
            say: [
              { speaker: 'TOLL', text: 'Every dead relic on my bench twitched this morning. Ninety years of nothing, then a twitch.' },
              { speaker: 'TOLL', text: 'Yours do that?' },
              { speaker: 'KAEL', text: 'Something like that.' },
              { speaker: 'TOLL', text: 'Then keep it off my bench.' },
            ],
          },
          {
            when: { notFlag: 'greyhaven.met.workshop' },
            say: [
              { speaker: 'TOLL', text: 'That gauntlet. Fused, isn’t it? Right through to the bone.' },
              { speaker: 'KAEL', text: 'It came off a dead man. It stayed on.' },
              { speaker: 'TOLL', text: 'Then it’s yours now, whatever it is. Half this town runs on things nobody can read.' },
              { speaker: 'TOLL', text: 'Your blade’s fractured too. Conductor’s split clean through the middle.' },
              { speaker: 'TOLL', text: 'Bring me a whole conductor and I’ll make it sing again. Won’t be cheap.' },
            ],
            effect: { set: ['greyhaven.service.shardbladeRepairOffered'] },
          },
          {
            say: [{ speaker: 'TOLL', text: 'No conductor, no repair. I don’t work miracles. Only metal.' }],
          },
        ],
      },

      {
        id: 'greyhaven.npc.researcher',
        kind: 'npc',
        sprite: 'researcher',
        name: 'ISEN',
        place: "ARCHIVIST'S HOUSE",
        x: 645, y: 328, radius: 13, reach: 46, solid: true,
        prompt: 'TALK',
        mark: 'hood',
        palette: { body: '#2f3a46', trim: '#7fa8b8', skin: '#c2ae95' },
        metFlag: 'greyhaven.met.researcher',
        lines: [
          {
            when: { flag: AXIOM_AWAKENED },
            say: [
              { speaker: 'ISEN', text: 'You went in dormant and came back humming. I can hear it from here.' },
              { speaker: 'KAEL', text: 'You can’t hear anything.' },
              { speaker: 'ISEN', text: 'I can hear the bell. It has no clapper and it rang at dawn.' },
              { speaker: 'ISEN', text: 'Whatever you woke, it is not finished waking.' },
            ],
          },
          {
            when: { notFlag: 'greyhaven.met.researcher' },
            say: [
              { speaker: 'ISEN', text: 'You’re going east. Everyone carrying a blade goes east eventually.' },
              { speaker: 'ISEN', text: 'There’s a chamber past the second field. A relay of some kind. Sealed since before Greyhaven had a name.' },
              { speaker: 'ISEN', text: 'I have mapped the approach twice and never once got inside.' },
              { speaker: 'ISEN', text: 'If you can open it, I want to know what is written on the walls.' },
              { speaker: 'KAEL', text: 'If there’s anything worth carrying, I’m carrying it.' },
              { speaker: 'ISEN', text: 'Take all of it. Just remember the walls.' },
            ],
            effect: { set: ['greyhaven.quest.reasonToLeave'] },
          },
          {
            say: [{ speaker: 'ISEN', text: 'East. Past the second field. The sealed door. Remember the walls.' }],
          },
        ],
      },

      {
        id: 'greyhaven.npc.resident',
        kind: 'npc',
        sprite: 'resident',
        name: 'BRAY',
        place: 'MARKET ROW',
        x: 718, y: 196, radius: 13, reach: 46, solid: true,
        prompt: 'TALK',
        mark: 'belt',
        palette: { body: '#4a3f45', trim: '#9c8a6a', skin: '#c6b096' },
        metFlag: 'greyhaven.met.resident',
        lines: [
          {
            when: { flag: AXIOM_AWAKENED },
            say: [
              { speaker: 'BRAY', text: 'The lift shook. I felt it come up through the stall legs.' },
              { speaker: 'BRAY', text: 'Ninety years of nothing and it picks today to move.' },
            ],
          },
          {
            when: { notFlag: 'greyhaven.met.resident' },
            say: [
              { speaker: 'BRAY', text: 'Careful round the lift. Children climb it. It’s dead, but it’s dead heavy.' },
              { speaker: 'BRAY', text: 'Dead since before my mother. Whole town grew up around the corpse of it.' },
            ],
          },
          {
            say: [{ speaker: 'BRAY', text: 'Buy something or move along. Preferably both.' }],
          },
        ],
      },

      {
        id: 'greyhaven.npc.wren',
        kind: 'npc',
        sprite: 'wren',
        name: 'WREN',
        place: 'GREYHAVEN',
        x: 330, y: 152, radius: 11, reach: 44, solid: true,
        prompt: 'TALK',
        mark: 'small',
        palette: { body: '#54463c', trim: '#cf8f6a', skin: '#cbb69c' },
        metFlag: 'greyhaven.met.wren',
        lines: [
          {
            when: { flag: AXIOM_AWAKENED },
            say: [
              { speaker: 'WREN', text: 'The bell rang. With no clapper in it.' },
              { speaker: 'WREN', text: 'So either you fixed it, or you shouldn’t have gone.' },
            ],
          },
          {
            when: { notFlag: 'greyhaven.met.wren' },
            say: [
              { speaker: 'WREN', text: 'You’re the one with the metal arm.' },
              { speaker: 'KAEL', text: 'It’s a gauntlet.' },
              { speaker: 'WREN', text: 'That’s what I said.' },
              { speaker: 'WREN', text: 'If you find a bell-clapper out there, bring it back. Ours went missing and nobody will climb up to look.' },
            ],
            effect: { set: ['greyhaven.quest.wrenClapper'] },
          },
          {
            say: [{ speaker: 'WREN', text: 'Still no clapper?' }],
          },
        ],
      },

      {
        id: 'greyhaven.object.lift_station',
        kind: 'object',
        name: 'OLD LIFT STATION',
        place: 'GREYHAVEN',
        x: 502, y: 216, radius: 16, reach: 52, solid: false,
        prompt: 'INSPECT',
        lines: [
          {
            when: { flag: 'greyhaven.liftStationScanned' },
            say: [
              { speaker: 'THE AXIOM', text: 'TRANSIT NODE — GREYHAVEN. STILL DORMANT.' },
              { speaker: 'KAEL', text: 'Then we come back when it isn’t.' },
            ],
          },
          {
            when: { flag: AXIOM_AWAKENED },
            say: [
              { speaker: 'THE AXIOM', text: 'TRANSIT NODE — GREYHAVEN. STATUS: DORMANT.', flash: true },
              { speaker: 'THE AXIOM', text: 'INSUFFICIENT AUTHORITY. RETURN WHEN THE ARCHIVE ANSWERS.' },
              { speaker: 'KAEL', text: 'The whole town is built on this thing.' },
            ],
          },
          {
            say: [
              { speaker: 'KAEL', text: 'A transit lift. Greyhaven grew up around its corpse and called it a foundation.' },
              { speaker: 'KAEL', text: 'Dead. Nothing in it answers.' },
            ],
          },
        ],
      },

      {
        id: 'greyhaven.object.bell_tower',
        kind: 'object',
        name: 'BELL TOWER',
        place: 'GREYHAVEN',
        x: 835, y: 318, radius: 16, reach: 50, solid: false,
        prompt: 'INSPECT',
        lines: [
          {
            when: { flag: AXIOM_AWAKENED },
            say: [
              { speaker: 'KAEL', text: 'It rang while I was gone. With nothing left inside to strike it.' },
            ],
          },
          {
            say: [
              { speaker: 'KAEL', text: 'The clapper is gone. Someone took it, or something did.' },
            ],
          },
        ],
      },
    ]),
  });
})();
