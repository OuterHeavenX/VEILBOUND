(() => {
  'use strict';

  const VERSION = '0.1.7-ambience';
  const canvas = document.getElementById('game-canvas');
  const boot = document.getElementById('boot-screen');
  const status = document.getElementById('boot-status');
  const hud = document.getElementById('hud');
  const hudRoom = document.getElementById('hud-room');
  const hudHealth = document.getElementById('hud-health');
  const hudAbility = document.getElementById('hud-ability');
  const saveStatus = document.getElementById('save-status');
  const dialogue = document.getElementById('dialogue');
  const dialogueSpeaker = document.getElementById('dialogue-speaker');
  const dialogueText = document.getElementById('dialogue-text');
  const touchControls = document.getElementById('touch-controls');
  const touchStick = document.getElementById('touch-stick');
  const touchKnob = document.getElementById('touch-knob');
  const actionButton = document.getElementById('action-button');
  const resonanceButton = document.getElementById('resonance-button');
  const fatal = document.getElementById('fatal-error');
  const fatalMessage = document.getElementById('fatal-error-message');
  const debugOverlay = document.getElementById('debug-overlay');
  const interactPrompt = document.getElementById('interact-prompt');
  const interactPromptVerb = document.getElementById('interact-prompt-verb');
  const interactPromptName = document.getElementById('interact-prompt-name');

  const SaveManager = window.Veilbound && window.Veilbound.SaveManager;
  const EnemyRegistry = window.Veilbound && window.Veilbound.EnemyRegistry;
  const Interactables = window.Veilbound && window.Veilbound.Interactables;
  const TitleScreen = window.Veilbound && window.Veilbound.TitleScreen;
  const Audio = window.Veilbound && window.Veilbound.Audio;
  if (!SaveManager) throw new Error('SaveManager failed to load.');
  if (!EnemyRegistry) throw new Error('Enemy registry failed to load.');
  if (!Interactables) throw new Error('Interaction registry failed to load.');
  if (!TitleScreen) throw new Error('Title screen failed to load.');
  if (!Audio) throw new Error('Audio system failed to load.');

  const WORLD = { width: 960, height: 540 };
  // Shared by the live combat checks and the debug overlay so drawn boxes
  // always describe the values the simulation actually uses.
  const ATTACK_REACH = 62, ATTACK_ARC_DOT = .15, ATTACK_ACTIVE_UNTIL = .07, HUSK_CHASE_RANGE = 270;
  const DEBUG_FRAME_SAMPLES = 45, DEBUG_TEXT_INTERVAL = .12;
  const ACTION_GLYPH = { attack: '\u2694', TALK: '\u2299', INSPECT: '\u2299', REST: '\u2299' };
  const particles = [];
  const enemies = [];
  const projectiles = [];

  const rooms = {
    greyhaven: { name:'GREYHAVEN', ground:'#233128', details:'town', walls:[{x:0,y:0,w:960,h:38},{x:0,y:502,w:960,h:38},{x:0,y:0,w:38,h:540},{x:922,y:0,w:38,h:210},{x:922,y:330,w:38,h:210},{x:90,y:95,w:185,h:105},{x:395,y:60,w:215,h:140},{x:672,y:96,w:70,h:56},{x:762,y:96,w:70,h:56},{x:852,y:96,w:58,h:56},{x:96,y:355,w:180,h:105},{x:560,y:350,w:170,h:105},{x:790,y:330,w:90,h:140}], exits:[{x:920,y:210,w:40,h:120,room:'hollowMarch1',spawnX:62,spawnY:270,entry:'west'}], enemies:[], resonanceNodes:[{id:'greyhaven.liftStation',x:502,y:130,radius:62,flag:'greyhaven.liftStationScanned',label:'OLD LIFT STATION'}] },

    hollowMarch1: { name:'HOLLOW MARCH — FIELD 1', ground:'#1b2921', details:'field', walls:[{x:0,y:0,w:960,h:38},{x:0,y:502,w:960,h:38},{x:0,y:0,w:38,h:205},{x:0,y:335,w:38,h:205},{x:922,y:0,w:38,h:205},{x:922,y:335,w:38,h:205},{x:210,y:118,w:130,h:46},{x:610,y:365,w:145,h:52},{x:430,y:225,w:90,h:90}], exits:[{x:0,y:205,w:40,h:130,room:'greyhaven',spawnX:895,spawnY:270,entry:'east'},{x:920,y:205,w:40,h:130,room:'hollowMarch2',spawnX:62,spawnY:270,entry:'west'}], enemies:[{id:'march.field1.husk.01',type:'husk',x:675,y:225},{id:'march.field1.husk.02',type:'husk',x:785,y:310}], resonanceNodes:[] },
    hollowMarch2: { name:'HOLLOW MARCH — FIELD 2', ground:'#19251f', details:'field2', walls:[{x:0,y:0,w:960,h:38},{x:0,y:502,w:960,h:38},{x:0,y:0,w:38,h:205},{x:0,y:335,w:38,h:205},{x:922,y:0,w:38,h:205},{x:922,y:335,w:38,h:205},{x:175,y:300,w:170,h:42},{x:480,y:115,w:210,h:52},{x:690,y:344,w:95,h:95}], exits:[{x:0,y:205,w:40,h:130,room:'hollowMarch1',spawnX:895,spawnY:270,entry:'east'},{x:920,y:205,w:40,h:130,room:'awakeningRuin',spawnX:62,spawnY:270,entry:'west'}], enemies:[{id:'march.field2.husk.01',type:'husk',x:390,y:220},{id:'march.field2.sentry.01',type:'sentry',x:760,y:215}], resonanceNodes:[{id:'march.field2.veinMarker',x:555,y:260,radius:34,flag:'march.field2.resonanceRouteRevealed',label:'BURIED VEIN ROUTE'}] },
    awakeningRuin: { name:'FORGOTTEN RELIC CHAMBER', ground:'#11191a', details:'ruin', walls:[{x:0,y:0,w:960,h:38},{x:0,y:502,w:960,h:38},{x:0,y:0,w:38,h:205},{x:0,y:335,w:38,h:205},{x:922,y:0,w:38,h:540},{x:205,y:105,w:80,h:130},{x:205,y:305,w:80,h:130},{x:675,y:105,w:80,h:130},{x:675,y:305,w:80,h:130}], exits:[{x:0,y:205,w:40,h:130,room:'hollowMarch2',spawnX:895,spawnY:270,entry:'east'}], enemies:[], resonanceNodes:[{id:'ruin.core',x:480,y:270,radius:55,flag:'ruin.resonanceCoreRead',label:'AXIOM CORE SIGNATURE'}] },
  };

  let saveInspection = SaveManager.inspect();
  let saveData = saveInspection.status==='ready'?saveInspection.data:SaveManager.createDefault();
  let deviceSettings = SaveManager.loadSettings();
  let running=false;
  let saveStatusTimer=0, pendingAwakening=0, dialogueSequence=null, dialogueIndex=-1, dialogueOnComplete=null;
  let interactTarget=null, promptedTargetId=null;
  let debugEnabled=false, debugTextTimer=0, frameCursor=0;
  const frameTimes=new Array(DEBUG_FRAME_SAMPLES).fill(16.7);
  let gamepadAttackWasDown=false, gamepadResonanceWasDown=false, screenFlash=0, resonanceTimer=0, resonanceCooldown=0, resonanceRadius=0;
  const player={x:470,y:300,radius:15,speed:205,facingX:0,facingY:1,room:'greyhaven',entryId:'start',walkPhase:0,health:6,maxHealth:6,invuln:0,attackTimer:0,attackCooldown:0,attackSerial:0,knockX:0,knockY:0};
  const input={keys:new Set(),moveX:0,moveY:0,touchX:0,touchY:0};

  function fail(error){console.error('[VEILBOUND] runtime failure',error);if(boot)boot.hidden=true;if(hud)hud.hidden=true;if(touchControls)touchControls.hidden=true;if(fatal)fatal.hidden=false;if(fatalMessage)fatalMessage.textContent=error instanceof Error?error.message:String(error);}
  function hasAbility(id){return Array.isArray(saveData.player.abilities)&&saveData.player.abilities.includes(id);}
  function hasFlag(flag){return Boolean(saveData.world.flags[flag]);}
  function setFlag(flag,value=true){saveData.world.flags[flag]=value;}
  function grantAbility(id){if(!Array.isArray(saveData.player.abilities))saveData.player.abilities=[];if(!saveData.player.abilities.includes(id))saveData.player.abilities.push(id);}
  function rectCircleOverlap(r,x,y,rad){const cx=Math.max(r.x,Math.min(x,r.x+r.w)),cy=Math.max(r.y,Math.min(y,r.y+r.h)),dx=x-cx,dy=y-cy;return dx*dx+dy*dy<rad*rad;}
  function collidesWithWalls(roomId,x,y,radius){return rooms[roomId].walls.some(w=>rectCircleOverlap(w,x,y,radius));}
  function roomInteractables(roomId){return Interactables[roomId]||[];}
  function collidesWithActors(roomId,x,y,radius){for(const it of roomInteractables(roomId)){if(!it.solid)continue;const d=Math.hypot(it.x-x,it.y-y);if(d<it.radius+radius)return true;}return false;}
  function playerBlocked(x,y){return collidesWithWalls(player.room,x,y,player.radius)||collidesWithActors(player.room,x,y,player.radius);}
  function restoreSave(){const p=saveData.player||{};player.room=rooms[p.roomId]?p.roomId:'greyhaven';player.x=Number.isFinite(p.x)?p.x:470;player.y=Number.isFinite(p.y)?p.y:300;player.maxHealth=Number.isFinite(p.maxHealth)?Math.max(1,p.maxHealth):6;player.health=Number.isFinite(p.health)?Math.max(1,Math.min(player.maxHealth,p.health)):player.maxHealth;player.entryId='restore';if(collidesWithWalls(player.room,player.x,player.y,player.radius)){player.room='greyhaven';player.x=470;player.y=300;player.entryId='recovered';}spawnRoomEnemies();refreshHud();}
  function snapshotSave(){saveData.player.roomId=player.room;saveData.player.x=Math.round(player.x*10)/10;saveData.player.y=Math.round(player.y*10)/10;saveData.player.health=player.health;saveData.player.maxHealth=player.maxHealth;return saveData;}
  function saveGame(message='SAVED'){const ok=SaveManager.save(snapshotSave());if(saveStatus)saveStatus.textContent=ok?message:'SAVE FAILED';saveStatusTimer=1.5;return ok;}
  function resizeCanvas(){const dpr=Math.min(window.devicePixelRatio||1,2),w=Math.max(1,Math.floor(innerWidth*dpr)),h=Math.max(1,Math.floor(innerHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}}
  function getView(){const scale=Math.min(canvas.width/WORLD.width,canvas.height/WORLD.height),drawW=WORLD.width*scale,drawH=WORLD.height*scale;return{scale,drawW,drawH,offsetX:(canvas.width-drawW)*.5,offsetY:(canvas.height-drawH)*.5};}
  function tryMovePlayer(dx,dy){const nx=player.x+dx,ny=player.y+dy;if(!playerBlocked(nx,player.y))player.x=nx;if(!playerBlocked(player.x,ny))player.y=ny;}
  function tryMoveEnemy(e,dx,dy){const nx=e.x+dx,ny=e.y+dy;if(!collidesWithWalls(player.room,nx,e.y,e.radius))e.x=nx;if(!collidesWithWalls(player.room,e.x,ny,e.radius))e.y=ny;}
  function transitionIfNeeded(){for(const exit of rooms[player.room].exits){if(player.x+player.radius>exit.x&&player.x-player.radius<exit.x+exit.w&&player.y+player.radius>exit.y&&player.y-player.radius<exit.y+exit.h){player.room=exit.room;player.entryId=exit.entry||'unnamed';player.x=exit.spawnX;player.y=exit.spawnY;projectiles.length=0;spawnRoomEnemies();refreshHud();saveGame('AUTOSAVED');if(player.room==='awakeningRuin'&&!hasFlag('story.axiomAwakened'))pendingAwakening=.7;return;}}}
  function spawnRoomEnemies(){enemies.length=0;projectiles.length=0;for(const def of rooms[player.room].enemies||[]){if(saveData.world.defeatedEnemies[def.id])continue;const cfg=EnemyRegistry[def.type];enemies.push({...def,radius:cfg.radius,hp:cfg.maxHp,maxHp:cfg.maxHp,speed:cfg.moveSpeed,flash:0,stun:0,lastHitSerial:-1,phase:Math.random()*Math.PI*2,state:'observe',stateTimer:.45+Math.random()*.35,aimX:0,aimY:1});}}
  function readGamepad(){const pads=navigator.getGamepads?navigator.getGamepads():[],pad=pads&&pads[0];if(!pad)return{x:0,y:0,attack:false,resonance:false};const dead=.18;return{x:Math.abs(pad.axes[0]||0)>dead?pad.axes[0]:0,y:Math.abs(pad.axes[1]||0)>dead?pad.axes[1]:0,attack:Boolean(pad.buttons[0]&&pad.buttons[0].pressed),resonance:Boolean(pad.buttons[1]&&pad.buttons[1].pressed)};}
  function updateInput(){let x=0,y=0;if(input.keys.has('ArrowLeft')||input.keys.has('KeyA'))x--;if(input.keys.has('ArrowRight')||input.keys.has('KeyD'))x++;if(input.keys.has('ArrowUp')||input.keys.has('KeyW'))y--;if(input.keys.has('ArrowDown')||input.keys.has('KeyS'))y++;const pad=readGamepad();x+=input.touchX+pad.x;y+=input.touchY+pad.y;const len=Math.hypot(x,y);if(len>1){x/=len;y/=len;}input.moveX=x;input.moveY=y;if(pad.attack&&!gamepadAttackWasDown)actionPressed();if(pad.resonance&&!gamepadResonanceWasDown)resonancePressed();gamepadAttackWasDown=pad.attack;gamepadResonanceWasDown=pad.resonance;}
  function actionPressed(){if(dialogueSequence){advanceDialogue();return;}if(interactTarget){interactPressed(interactTarget);return;}attack();}
  function conditionMet(cond){if(!cond)return true;if(cond.flag&&!hasFlag(cond.flag))return false;if(cond.notFlag&&hasFlag(cond.notFlag))return false;if(cond.ability&&!hasAbility(cond.ability))return false;return true;}
  function resolveVariant(it){for(const variant of it.lines){if(conditionMet(variant.when))return variant;}return null;}
  function findInteractTarget(){if(dialogueSequence||player.health<=0)return null;let best=null,bestD=Infinity;for(const it of roomInteractables(player.room)){const d=Math.hypot(it.x-player.x,it.y-player.y);if(d>(it.reach||46)+player.radius)continue;if(d<bestD){bestD=d;best=it;}}return best;}
  function refreshInteractPrompt(){const id=interactTarget?interactTarget.id:null;if(id===promptedTargetId)return;promptedTargetId=id;if(interactPrompt)interactPrompt.hidden=!interactTarget;if(interactTarget){if(interactPromptVerb)interactPromptVerb.textContent=interactTarget.prompt||'INSPECT';if(interactPromptName)interactPromptName.textContent=interactTarget.name||'';}if(actionButton){const glyph=interactTarget?(ACTION_GLYPH[interactTarget.prompt]||ACTION_GLYPH.INSPECT):ACTION_GLYPH.attack;actionButton.textContent=glyph;actionButton.setAttribute('aria-label',interactTarget?`Interact with ${interactTarget.name}`:'Attack with Shardblade');}}
  function applyInteractEffect(it,effect){let dirty=Boolean(it.metFlag&&!hasFlag(it.metFlag));if(it.metFlag)setFlag(it.metFlag,true);if(effect&&Array.isArray(effect.set))for(const flag of effect.set){if(!hasFlag(flag))dirty=true;setFlag(flag,true);}if(effect&&effect.rest){player.health=player.maxHealth;player.invuln=0;player.knockX=0;player.knockY=0;spawnParticles(player.x,player.y,'#d9b98a',18,95);refreshHud();saveGame('RESTED');return;}if(dirty)saveGame('RECORDED');}
  function interactPressed(it){const variant=resolveVariant(it);if(!variant)return;startDialogue(variant.say,()=>applyInteractEffect(it,variant.effect));}
  function attack(){if(player.attackCooldown>0||player.health<=0)return;player.attackTimer=.22;player.attackCooldown=.34;player.attackSerial++;spawnParticles(player.x+player.facingX*25,player.y+player.facingY*25,'#d9f6ef',4,75);}
  function resonancePressed(){if(dialogueSequence||!hasAbility('resonance')||resonanceCooldown>0)return;resonanceTimer=.72;resonanceCooldown=1.15;resonanceRadius=0;screenFlash=Math.max(screenFlash,.08);spawnParticles(player.x,player.y,'#7fe7e1',12,90);}
  function evaluateResonance(){for(const node of rooms[player.room].resonanceNodes||[]){if(hasFlag(node.flag))continue;const d=Math.hypot(node.x-player.x,node.y-player.y);if(d<=resonanceRadius+node.radius){setFlag(node.flag,true);spawnParticles(node.x,node.y,'#7fe7e1',22,125);saveGame('RESONANCE RECORDED');if(node.id==='march.field2.veinMarker')startDialogue([{speaker:'THE AXIOM',text:'BURIED VEIN ROUTE DETECTED.'},{speaker:'THE AXIOM',text:'ARCHIVE SIGNATURE — EASTERN DESCENT.'}]);else if(node.id==='ruin.core')startDialogue([{speaker:'THE AXIOM',text:'CORE MEMORY FRAGMENT FOUND.'},{speaker:'SYSTEM UNKNOWN',text:'ACCESS PATH: SUNKEN ARCHIVE.'}]);}}
    for(const e of enemies){if(e.type!=='sentry'||e.hp<=0)continue;const cfg=EnemyRegistry.sentry,d=Math.hypot(e.x-player.x,e.y-player.y);if(d<=resonanceRadius+e.radius&&e.state==='telegraph'&&cfg.resonance.interruptTelegraph){e.state='disrupted';e.stateTimer=cfg.resonance.stunSeconds;e.stun=cfg.resonance.stunSeconds;spawnParticles(e.x,e.y,'#7fe7e1',20,145);screenFlash=Math.max(screenFlash,.06);}}
  }
  function attackHitsEnemy(e){if(player.attackTimer<=ATTACK_ACTIVE_UNTIL||e.lastHitSerial===player.attackSerial)return false;const dx=e.x-player.x,dy=e.y-player.y,d=Math.hypot(dx,dy);if(d>ATTACK_REACH+e.radius)return false;if(d<1)return true;return(dx/d)*player.facingX+(dy/d)*player.facingY>ATTACK_ARC_DOT;}
  function damageEnemy(e){e.lastHitSerial=player.attackSerial;e.hp--;e.flash=.13;e.stun=.16;const dx=e.x-player.x,dy=e.y-player.y,len=Math.hypot(dx,dy)||1;tryMoveEnemy(e,dx/len*18,dy/len*18);spawnParticles(e.x,e.y,'#bdebe1',7,105);screenFlash=Math.max(screenFlash,.045);if(e.hp<=0){saveData.world.defeatedEnemies[e.id]=true;spawnParticles(e.x,e.y,'#7fe7e1',14,135);saveGame('ENEMY CLEARED');}}
  function hurtPlayer(fromX,fromY){if(player.invuln>0||player.health<=0)return;player.health--;player.invuln=.75;const dx=player.x-fromX,dy=player.y-fromY,len=Math.hypot(dx,dy)||1;player.knockX=dx/len*220;player.knockY=dy/len*220;spawnParticles(player.x,player.y,'#d96f6f',9,120);screenFlash=.12;refreshHud();if(player.health<=0){player.health=player.maxHealth;player.room='greyhaven';player.entryId='respawn';player.x=470;player.y=300;projectiles.length=0;spawnRoomEnemies();saveGame('RECOVERED');refreshHud();}}
  function fireSentry(e){const cfg=EnemyRegistry.sentry.attack,dx=player.x-e.x,dy=player.y-e.y,len=Math.hypot(dx,dy)||1;e.aimX=dx/len;e.aimY=dy/len;projectiles.push({x:e.x+e.aimX*(e.radius+8),y:e.y+e.aimY*(e.radius+8),vx:e.aimX*cfg.projectileSpeed,vy:e.aimY*cfg.projectileSpeed,radius:cfg.projectileRadius,life:cfg.projectileLifetime,ownerId:e.id});spawnParticles(e.x,e.y,'#dffcf8',8,95);}
  function updateSentry(e,dt,distance,dx,dy){const cfg=EnemyRegistry.sentry;if(e.stateTimer>0)e.stateTimer-=dt;if(e.state==='disrupted'){if(e.stateTimer<=0){e.state='recover';e.stateTimer=.55;}return;}if(e.state==='observe'){if(distance<cfg.engageRange&&e.stateTimer<=0){e.state='position';e.stateTimer=.35;}return;}if(e.state==='position'){if(distance<cfg.retreatRange)tryMoveEnemy(e,-dx/distance*e.speed*dt,-dy/distance*e.speed*dt);else if(distance>cfg.preferredRange+35)tryMoveEnemy(e,dx/distance*e.speed*.55*dt,dy/distance*e.speed*.55*dt);if(e.stateTimer<=0&&distance<cfg.engageRange){e.state='telegraph';e.stateTimer=cfg.attack.telegraphSeconds;e.aimX=dx/distance;e.aimY=dy/distance;}return;}if(e.state==='telegraph'){if(e.stateTimer<=0){fireSentry(e);e.state='recover';e.stateTimer=cfg.attack.recoverySeconds;}return;}if(e.state==='recover'&&e.stateTimer<=0){e.state='observe';e.stateTimer=.28;}}
  function updateEnemies(dt){for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];if(e.hp<=0){enemies.splice(i,1);continue;}e.flash=Math.max(0,e.flash-dt);e.stun=Math.max(0,e.stun-dt);e.phase+=dt;if(attackHitsEnemy(e))damageEnemy(e);if(e.stun>0&&e.state!=='disrupted')continue;const dx=player.x-e.x,dy=player.y-e.y,d=Math.hypot(dx,dy)||1;if(e.type==='husk'&&d<HUSK_CHASE_RANGE)tryMoveEnemy(e,dx/d*e.speed*dt,dy/d*e.speed*dt);if(e.type==='sentry')updateSentry(e,dt,d,dx,dy);if(d<player.radius+e.radius+3)hurtPlayer(e.x,e.y);}}
  function updateProjectiles(dt){for(let i=projectiles.length-1;i>=0;i--){const p=projectiles[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.life<=0||p.x<0||p.x>WORLD.width||p.y<0||p.y>WORLD.height||collidesWithWalls(player.room,p.x,p.y,p.radius)){projectiles.splice(i,1);continue;}if(Math.hypot(player.x-p.x,player.y-p.y)<player.radius+p.radius){hurtPlayer(p.x-p.vx*.02,p.y-p.vy*.02);projectiles.splice(i,1);}}}
  function spawnParticles(x,y,color,count,speed){for(let i=0;i<count&&particles.length<140;i++){const a=Math.random()*Math.PI*2,v=speed*(.4+Math.random()*.6);particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.25+Math.random()*.35,maxLife:.6,color});}}
  function updateParticles(dt){for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;if(p.life<=0){particles.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96;}}
  function update(dt){updateInput();saveStatusTimer=Math.max(0,saveStatusTimer-dt);if(saveStatus&&saveStatusTimer<=0)saveStatus.textContent='SAVE V1 READY';screenFlash=Math.max(0,screenFlash-dt);resonanceCooldown=Math.max(0,resonanceCooldown-dt);player.invuln=Math.max(0,player.invuln-dt);player.attackTimer=Math.max(0,player.attackTimer-dt);player.attackCooldown=Math.max(0,player.attackCooldown-dt);if(resonanceTimer>0){resonanceTimer=Math.max(0,resonanceTimer-dt);resonanceRadius=Math.min(230,resonanceRadius+dt*410);evaluateResonance();}if(resonanceButton)resonanceButton.classList.toggle('cooldown',resonanceCooldown>0);if(pendingAwakening>0){pendingAwakening-=dt;if(pendingAwakening<=0)startAwakeningCutscene();}interactTarget=findInteractTarget();refreshInteractPrompt();if(!dialogueSequence){if(Math.abs(input.moveX)>.01||Math.abs(input.moveY)>.01){player.facingX=input.moveX;player.facingY=input.moveY;const len=Math.hypot(player.facingX,player.facingY)||1;player.facingX/=len;player.facingY/=len;player.walkPhase+=dt*9;tryMovePlayer(input.moveX*player.speed*dt,input.moveY*player.speed*dt);transitionIfNeeded();}if(Math.abs(player.knockX)>1||Math.abs(player.knockY)>1){tryMovePlayer(player.knockX*dt,player.knockY*dt);player.knockX*=.82;player.knockY*=.82;}updateEnemies(dt);updateProjectiles(dt);}updateParticles(dt);if(debugEnabled){debugTextTimer-=dt;if(debugTextTimer<=0){debugTextTimer=DEBUG_TEXT_INTERVAL;refreshDebugText();}}}
  function startDialogue(lines,onComplete=null){dialogueSequence={lines};dialogueIndex=0;dialogueOnComplete=onComplete;if(dialogue)dialogue.hidden=false;showDialogueLine();}
  function showDialogueLine(){if(!dialogueSequence)return;const line=dialogueSequence.lines[dialogueIndex];if(dialogueSpeaker)dialogueSpeaker.textContent=line.speaker||'';if(dialogueText)dialogueText.textContent=line.text;if(line.flash)screenFlash=.22;}
  function advanceDialogue(){if(!dialogueSequence)return;dialogueIndex++;if(dialogueIndex>=dialogueSequence.lines.length){const done=dialogueOnComplete;dialogueSequence=null;dialogueOnComplete=null;if(dialogue)dialogue.hidden=true;if(done)done();return;}showDialogueLine();}
  function startAwakeningCutscene(){if(hasFlag('story.axiomAwakened'))return;screenFlash=.18;startDialogue([{speaker:'SYSTEM UNKNOWN',text:'RESONANCE DETECTED',flash:true},{speaker:'SYSTEM UNKNOWN',text:'BOUND USER CONFIRMED'},{speaker:'KAEL',text:'...What are you?'},{speaker:'THE AXIOM',text:'RESONANCE PROTOCOL RESTORED',flash:true},{speaker:'THE AXIOM',text:'PRESS ◇ / E / B TO EMIT RESONANCE.'}],()=>{setFlag('story.axiomAwakened',true);grantAbility('resonance');saveGame('AXIOM BOUND');spawnParticles(480,270,'#7fe7e1',30,170);screenFlash=.3;refreshHud();});}

  // --- Development diagnostics (docs/ARCHITECTURE.md > Development Diagnostics) ---
  function sampleFrameTime(ms){if(!(ms>0)||ms>1000)return;frameTimes[frameCursor]=ms;frameCursor=(frameCursor+1)%DEBUG_FRAME_SAMPLES;}
  function frameStats(){let total=0,peak=0;for(let i=0;i<DEBUG_FRAME_SAMPLES;i++){const ms=frameTimes[i];total+=ms;if(ms>peak)peak=ms;}const avg=total/DEBUG_FRAME_SAMPLES;return{avg,peak,fps:avg>0?1000/avg:0};}
  function debugRequestedByUrl(){try{return new URLSearchParams(location.search).has('debug');}catch(error){return false;}}
  function setDebugMode(on,persist=true){debugEnabled=Boolean(on);if(debugOverlay)debugOverlay.hidden=!debugEnabled;debugTextTimer=0;if(debugEnabled)refreshDebugText();if(persist){deviceSettings={...deviceSettings,debugOverlay:debugEnabled};SaveManager.saveSettings(deviceSettings);if(saveStatus)saveStatus.textContent=debugEnabled?'DIAGNOSTICS ON':'DIAGNOSTICS OFF';saveStatusTimer=1.5;}}
  function toggleDebug(){setDebugMode(!debugEnabled);}
  function debugTargetLabel(){if(dialogueSequence)return 'suppressed (dialogue active)';if(interactTarget)return `${interactTarget.id} [${interactTarget.prompt}] IN REACH`;let best=null,bestGap=Infinity;for(const it of roomInteractables(player.room)){const gap=Math.hypot(it.x-player.x,it.y-player.y)-(it.reach||46)-player.radius;if(gap<bestGap){bestGap=gap;best=it;}}if(!best)return 'none authored in room';return `${best.id} gap=${bestGap.toFixed(0)}`;}
  function debugNodeLabel(){let best=null,bestGap=Infinity;for(const n of rooms[player.room].resonanceNodes||[]){const gap=Math.hypot(n.x-player.x,n.y-player.y)-n.radius;if(gap<bestGap){bestGap=gap;best=n;}}if(!best)return 'none authored in room';return `${best.id} gap=${Math.max(0,bestGap).toFixed(0)} ${hasFlag(best.flag)?'READ':'unread'}`;}
  function debugEnemyState(e,distance){if(e.type!=='sentry')return distance<HUSK_CHASE_RANGE?'chase':'idle';return e.stateTimer>0?`${e.state} ${e.stateTimer.toFixed(2)}s`:e.state;}
  function refreshDebugText(){
    if(!debugOverlay||!debugEnabled)return;
    const stats=frameStats(),room=rooms[player.room];
    const flags=Object.keys(saveData.world.flags).filter(key=>saveData.world.flags[key]);
    const resonance=hasAbility('resonance')?(resonanceCooldown>0?`cooldown ${resonanceCooldown.toFixed(2)}s`:'ready'):'locked';
    const lines=[
      `VEILBOUND DIAGNOSTICS v${VERSION}`,
      `FPS ${stats.fps.toFixed(1)}  FRAME ${stats.avg.toFixed(1)}ms  PEAK ${stats.peak.toFixed(1)}ms`,
      `ROOM ${player.room} (${room.name})`,
      `ENTRY ${player.entryId}`,
      `POS ${player.x.toFixed(1)}, ${player.y.toFixed(1)}  FACE ${player.facingX.toFixed(2)}, ${player.facingY.toFixed(2)}`,
      `HP ${player.health}/${player.maxHealth}  IFRAME ${player.invuln.toFixed(2)}  ATK ${player.attackTimer.toFixed(2)}/${player.attackCooldown.toFixed(2)}`,
      `RESONANCE ${resonance}  PULSE r=${resonanceRadius.toFixed(0)}`,
      `ENTITIES enemy ${enemies.length}  proj ${projectiles.length}  fx ${particles.length}`,
      `AUDIO ${(()=>{const a=Audio.state();return `${a.enabled?'on':'off'} ctx=${a.context} bed=${a.ambient?'playing':'silent'} gain=${a.gain} rms=${a.level}`;})()}`,
      `TARGET ${debugTargetLabel()}`,
      `NODE ${debugNodeLabel()}`,
    ];
    for(const e of enemies){const d=Math.hypot(player.x-e.x,player.y-e.y);lines.push(`  ${e.id} ${e.hp}/${e.maxHp} ${debugEnemyState(e,d)} d=${d.toFixed(0)}`);}
    lines.push(`FLAGS ${flags.length}`);
    for(const flag of flags)lines.push(`  ${flag}`);
    debugOverlay.textContent=lines.join('\n');
  }
  function drawDebugShapes(ctx,room){
    ctx.save();ctx.lineWidth=1.5;
    ctx.strokeStyle='rgba(217,111,111,.7)';for(const w of room.walls)ctx.strokeRect(w.x+.75,w.y+.75,w.w-1.5,w.h-1.5);
    ctx.strokeStyle='rgba(255,214,137,.75)';for(const exit of room.exits)ctx.strokeRect(exit.x+.75,exit.y+.75,exit.w-1.5,exit.h-1.5);
    ctx.setLineDash([5,6]);ctx.strokeStyle='rgba(127,231,225,.6)';for(const n of room.resonanceNodes||[]){ctx.beginPath();ctx.arc(n.x,n.y,n.radius,0,Math.PI*2);ctx.stroke();}
    for(const it of roomInteractables(player.room)){ctx.strokeStyle=interactTarget===it?'rgba(232,255,249,.9)':'rgba(160,200,190,.4)';ctx.beginPath();ctx.arc(it.x,it.y,(it.reach||46)+player.radius,0,Math.PI*2);ctx.stroke();if(!it.solid)continue;ctx.strokeStyle='rgba(217,111,111,.7)';ctx.beginPath();ctx.arc(it.x,it.y,it.radius,0,Math.PI*2);ctx.stroke();}
    ctx.setLineDash([]);
    for(const e of enemies){
      ctx.setLineDash([]);ctx.strokeStyle='rgba(255,138,138,.85)';ctx.beginPath();ctx.arc(e.x,e.y,e.radius,0,Math.PI*2);ctx.stroke();
      if(e.type!=='sentry')continue;
      const cfg=EnemyRegistry.sentry;ctx.setLineDash([4,8]);
      ctx.strokeStyle='rgba(255,214,137,.3)';ctx.beginPath();ctx.arc(e.x,e.y,cfg.engageRange,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='rgba(217,111,111,.3)';ctx.beginPath();ctx.arc(e.x,e.y,cfg.retreatRange,0,Math.PI*2);ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.strokeStyle='rgba(255,214,137,.9)';for(const p of projectiles){ctx.beginPath();ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);ctx.stroke();}
    ctx.strokeStyle='rgba(127,231,225,.9)';ctx.beginPath();ctx.arc(player.x,player.y,player.radius,0,Math.PI*2);ctx.stroke();
    // Melee hitbox: a hit lands when this arc and an enemy hurtbox circle overlap.
    const angle=Math.atan2(player.facingY,player.facingX),spread=Math.acos(ATTACK_ARC_DOT);
    ctx.strokeStyle=player.attackTimer>ATTACK_ACTIVE_UNTIL?'rgba(232,255,249,.95)':'rgba(232,255,249,.25)';
    ctx.beginPath();ctx.moveTo(player.x,player.y);ctx.arc(player.x,player.y,ATTACK_REACH,angle-spread,angle+spread);ctx.closePath();ctx.stroke();
    ctx.restore();
  }

  function drawWorld(ctx){const view=getView(),room=rooms[player.room];ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#070a0d';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.save();ctx.translate(view.offsetX,view.offsetY);ctx.scale(view.scale,view.scale);ctx.fillStyle=room.ground;ctx.fillRect(0,0,WORLD.width,WORLD.height);drawRoomDetails(ctx,room);ctx.fillStyle='#111817';for(const w of room.walls){ctx.fillRect(w.x,w.y,w.w,w.h);ctx.strokeStyle='rgba(190,220,210,.08)';ctx.strokeRect(w.x+.5,w.y+.5,w.w-1,w.h-1);}for(const exit of room.exits){ctx.fillStyle='rgba(127,231,225,.08)';ctx.fillRect(exit.x,exit.y,exit.w,exit.h);}if(room.details==='town')drawTownOver(ctx);drawResonanceNodes(ctx,room);drawInteractables(ctx,player.room);drawProjectiles(ctx);drawEnemies(ctx);drawParticles(ctx);drawKael(ctx);drawResonancePulse(ctx);if(debugEnabled)drawDebugShapes(ctx,room);ctx.restore();if(screenFlash>0){ctx.fillStyle=`rgba(127,231,225,${Math.min(.34,screenFlash)})`;ctx.fillRect(view.offsetX,view.offsetY,view.drawW,view.drawH);}}
  function drawRoomDetails(ctx,room){if(room.details==='town'){ctx.fillStyle='#4a5148';ctx.fillRect(0,248,960,54);ctx.fillRect(468,190,66,190);ctx.fillStyle='#3f4842';ctx.fillRect(0,248,960,4);ctx.fillRect(0,298,960,4);ctx.fillStyle='#2b352e';ctx.fillRect(90,204,185,36);ctx.fillRect(96,316,180,32);ctx.fillRect(560,314,170,30);ctx.fillRect(660,158,260,26);ctx.strokeStyle='rgba(127,231,225,.20)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(502,270,46,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='rgba(127,231,225,.09)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(502,270,66,0,Math.PI*2);ctx.stroke();}else if(room.details==='ruin'){ctx.fillStyle='#182222';ctx.fillRect(80,70,800,400);for(let i=0;i<5;i++){ctx.strokeStyle=`rgba(127,231,225,${.08+i*.025})`;ctx.lineWidth=2;ctx.strokeRect(330-i*12,130-i*10,300+i*24,280+i*20);}ctx.fillStyle='rgba(127,231,225,.12)';ctx.beginPath();ctx.arc(480,270,72,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#7fe7e1';ctx.lineWidth=5;ctx.beginPath();ctx.arc(480,270,54,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(425,270);ctx.lineTo(535,270);ctx.moveTo(480,215);ctx.lineTo(480,325);ctx.stroke();}else{ctx.strokeStyle='rgba(116,145,126,.22)';ctx.lineWidth=2;for(let x=90;x<900;x+=130){ctx.beginPath();ctx.moveTo(x,90);ctx.lineTo(x+4,103);ctx.moveTo(x+9,94);ctx.lineTo(x+9,108);ctx.stroke();}if(room.details==='field2'){ctx.strokeStyle='rgba(127,231,225,.15)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(140,420);ctx.lineTo(360,90);ctx.lineTo(565,420);ctx.stroke();if(hasFlag('march.field2.resonanceRouteRevealed')){ctx.strokeStyle='rgba(127,231,225,.62)';ctx.lineWidth=6;ctx.setLineDash([14,12]);ctx.beginPath();ctx.moveTo(555,260);ctx.lineTo(780,300);ctx.lineTo(920,250);ctx.stroke();ctx.setLineDash([]);}}}}
  function townLabel(ctx,text,x,y){ctx.font='11px ui-monospace, SFMono-Regular, Menlo, monospace';ctx.textAlign='center';ctx.fillStyle='rgba(200,216,208,.44)';ctx.fillText(text,x,y);ctx.textAlign='left';}
  function drawTownOver(ctx){
    // Wayfarer's Rest — the settlement's rest/save point.
    ctx.fillStyle='#3b3229';ctx.fillRect(90,95,185,30);
    ctx.fillStyle='#2a3029';ctx.fillRect(98,129,169,67);
    ctx.fillStyle='#c9a25f';ctx.fillRect(120,146,26,22);ctx.fillRect(219,146,26,22);
    ctx.fillStyle='#5a4a37';ctx.fillRect(166,160,34,40);
    ctx.fillStyle='rgba(217,160,96,.30)';ctx.beginPath();ctx.arc(254,226,26,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#d9a060';ctx.beginPath();ctx.arc(254,226,7,0,Math.PI*2);ctx.fill();
    townLabel(ctx,"WAYFARER'S REST",182,88);

    // Old Lift Station — the ancient transit ruin Greyhaven was built around.
    ctx.fillStyle='#2c3639';ctx.fillRect(395,60,215,140);
    ctx.fillStyle='#3a4649';ctx.fillRect(408,72,32,128);ctx.fillRect(565,72,32,128);
    ctx.fillStyle='#1d2528';ctx.fillRect(452,86,100,114);
    ctx.strokeStyle='rgba(127,231,225,.22)';ctx.lineWidth=3;ctx.strokeRect(452,86,100,114);
    ctx.strokeStyle='rgba(127,231,225,.13)';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(502,92);ctx.lineTo(502,194);ctx.stroke();
    ctx.fillStyle=hasFlag('greyhaven.liftStationScanned')?'rgba(127,231,225,.55)':'rgba(127,231,225,.14)';
    ctx.beginPath();ctx.arc(502,140,9,0,Math.PI*2);ctx.fill();
    townLabel(ctx,'OLD LIFT STATION',502,52);

    // Market Row — three stalls under patched awnings.
    const stalls=[[672,'#7d5b46'],[762,'#5f6b52'],[852,'#6d5566']];
    for(const [x,awning] of stalls){const w=x===852?58:70;ctx.fillStyle=awning;ctx.fillRect(x,96,w,14);ctx.fillStyle='#2c3229';ctx.fillRect(x+5,112,w-10,40);ctx.fillStyle='#8b7c62';ctx.fillRect(x+11,124,w-22,9);}
    townLabel(ctx,'MARKET ROW',762,88);

    // Relic Workshop — the only lit forge in town.
    ctx.fillStyle='#333b3a';ctx.fillRect(96,355,180,28);
    ctx.fillStyle='#242c2c';ctx.fillRect(104,387,164,64);
    ctx.fillStyle='#5a4a37';ctx.fillRect(168,411,32,44);
    ctx.fillStyle='rgba(217,140,80,.22)';ctx.fillRect(112,399,42,32);
    ctx.fillStyle='#d98c50';ctx.fillRect(122,409,22,12);
    ctx.fillStyle='#8b7c62';ctx.fillRect(216,399,44,5);ctx.fillRect(216,412,44,5);
    townLabel(ctx,'RELIC WORKSHOP',186,476);

    // Archivist's House — narrow shuttered windows, crates of salvaged paper.
    ctx.fillStyle='#333a42';ctx.fillRect(560,350,170,26);
    ctx.fillStyle='#232a31';ctx.fillRect(568,380,154,68);
    ctx.fillStyle='#7fa8b8';ctx.fillRect(586,396,13,32);ctx.fillRect(616,396,13,32);ctx.fillRect(646,396,13,32);
    ctx.fillStyle='#5a4a37';ctx.fillRect(680,410,30,38);
    townLabel(ctx,"ARCHIVIST'S HOUSE",645,471);

    // Bell Tower — the landmark silhouette, and the missing clapper.
    ctx.fillStyle='#39403c';ctx.fillRect(790,330,90,140);
    ctx.fillStyle='#262c29';ctx.fillRect(800,352,70,52);
    ctx.fillStyle='#8b8172';ctx.beginPath();ctx.moveTo(818,356);ctx.lineTo(852,356);ctx.lineTo(845,388);ctx.lineTo(825,388);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#5d564b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(835,352);ctx.lineTo(835,340);ctx.stroke();
    ctx.fillStyle='#2f3532';ctx.fillRect(806,418,58,42);
    townLabel(ctx,'BELL TOWER',835,486);
  }
  function drawInteractables(ctx,roomId){
    const now=performance.now();
    for(const it of roomInteractables(roomId)){
      const targeted=interactTarget===it;
      if(it.kind==='npc')drawNpc(ctx,it,targeted,now);
      else if(targeted||it.kind!=='rest'){
        const pulse=.30+Math.sin(now*.003+it.x)*.12,alpha=targeted?.92:pulse;
        ctx.save();ctx.translate(it.x,it.y);ctx.rotate(Math.PI*.25);
        ctx.strokeStyle=`rgba(127,231,225,${alpha})`;ctx.lineWidth=2;ctx.strokeRect(-6,-6,12,12);ctx.restore();
      }
      if(!targeted)continue;
      ctx.strokeStyle='rgba(127,231,225,.55)';ctx.lineWidth=2;ctx.setLineDash([4,5]);
      ctx.beginPath();ctx.arc(it.x,it.y,it.radius+11,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
    }
  }
  function drawNpc(ctx,it,targeted,now){
    const p=it.palette,bob=Math.sin(now*.0016+it.x)*1.2,small=it.mark==='small';
    ctx.save();ctx.translate(it.x,it.y);
    ctx.fillStyle='rgba(0,0,0,.24)';ctx.beginPath();ctx.ellipse(0,13,14,6,0,0,Math.PI*2);ctx.fill();
    ctx.translate(0,bob);if(small)ctx.scale(.82,.82);
    ctx.fillStyle=p.body;ctx.beginPath();ctx.moveTo(-12,4);ctx.lineTo(-8,-14);ctx.lineTo(0,-20);ctx.lineTo(8,-14);ctx.lineTo(12,4);ctx.lineTo(6,15);ctx.lineTo(-6,15);ctx.closePath();ctx.fill();
    ctx.fillStyle=p.skin;ctx.beginPath();ctx.ellipse(0,-16,7,6.4,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=p.trim;
    if(it.mark==='apron')ctx.fillRect(-9,-3,18,12);
    else if(it.mark==='goggles'){ctx.fillRect(-9,-20,18,4);ctx.beginPath();ctx.arc(-4,-18,2.6,0,Math.PI*2);ctx.arc(4,-18,2.6,0,Math.PI*2);ctx.fill();}
    else if(it.mark==='hood'){ctx.beginPath();ctx.arc(0,-15,9.5,Math.PI,0);ctx.fill();}
    else if(it.mark==='belt')ctx.fillRect(-12,1,24,4);
    else if(it.mark==='small')ctx.fillRect(-8,-9,16,4);
    ctx.restore();
    if(!targeted)return;
    ctx.save();ctx.strokeStyle='rgba(127,231,225,.30)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(it.x,it.y+13,17,7,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  }

  function drawResonanceNodes(ctx,room){for(const n of room.resonanceNodes||[]){if(!hasFlag(n.flag))continue;const pulse=.45+Math.sin(performance.now()*.004)*.2;ctx.strokeStyle=`rgba(127,231,225,${pulse})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(n.x,n.y,n.radius,0,Math.PI*2);ctx.stroke();ctx.fillStyle='rgba(127,231,225,.10)';ctx.beginPath();ctx.arc(n.x,n.y,Math.max(7,n.radius*.22),0,Math.PI*2);ctx.fill();}}
  function drawResonancePulse(ctx){if(resonanceTimer<=0)return;const a=Math.max(.08,resonanceTimer/.72*.55);ctx.strokeStyle=`rgba(127,231,225,${a})`;ctx.lineWidth=5;ctx.beginPath();ctx.arc(player.x,player.y,resonanceRadius,0,Math.PI*2);ctx.stroke();ctx.strokeStyle=`rgba(232,255,252,${a*.45})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(player.x,player.y,Math.max(0,resonanceRadius-12),0,Math.PI*2);ctx.stroke();}
  function drawProjectiles(ctx){for(const p of projectiles){ctx.fillStyle='rgba(127,231,225,.20)';ctx.beginPath();ctx.arc(p.x,p.y,p.radius+7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#dffcf8';ctx.beginPath();ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);ctx.fill();}}
  function drawEnemies(ctx){for(const e of enemies){ctx.save();ctx.translate(e.x,e.y);ctx.fillStyle='rgba(0,0,0,.24)';ctx.beginPath();ctx.ellipse(0,10,17,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=e.flash>0?'#e8fff9':e.type==='sentry'?'#6d8079':'#665f58';ctx.beginPath();ctx.arc(0,0,e.radius,0,Math.PI*2);ctx.fill();ctx.strokeStyle=e.type==='sentry'?'#7fe7e1':'#9c8c7d';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,e.radius-4,0,Math.PI*2);ctx.stroke();if(e.type==='sentry'){const cfg=EnemyRegistry.sentry;if(e.state==='telegraph'){const progress=1-Math.max(0,e.stateTimer)/cfg.attack.telegraphSeconds;ctx.strokeStyle=`rgba(255,214,137,${.45+progress*.5})`;ctx.lineWidth=3+progress*3;ctx.beginPath();ctx.arc(0,0,25+progress*9,0,Math.PI*2);ctx.stroke();ctx.setLineDash([7,7]);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(e.aimX*155,e.aimY*155);ctx.stroke();ctx.setLineDash([]);}else if(e.state==='disrupted'){ctx.strokeStyle='#7fe7e1';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,29+Math.sin(e.phase*8)*3,0,Math.PI*2);ctx.stroke();}else{ctx.rotate(e.phase);ctx.beginPath();ctx.moveTo(-22,0);ctx.lineTo(22,0);ctx.moveTo(0,-22);ctx.lineTo(0,22);ctx.stroke();}}ctx.restore();}}
  function drawParticles(ctx){for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/p.maxLife);ctx.fillStyle=p.color;ctx.fillRect(p.x-2,p.y-2,4,4);}ctx.globalAlpha=1;}
  function drawKael(ctx){const bob=Math.sin(player.walkPhase)*1.4,fx=player.facingX,fy=player.facingY;ctx.save();ctx.translate(player.x,player.y+bob);if(player.invuln>0&&Math.floor(player.invuln*18)%2===0)ctx.globalAlpha=.42;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,14,16,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#15191a';ctx.beginPath();ctx.moveTo(-13,6);ctx.lineTo(-8,-16);ctx.lineTo(0,-23);ctx.lineTo(8,-16);ctx.lineTo(13,6);ctx.lineTo(7,16);ctx.lineTo(-7,16);ctx.closePath();ctx.fill();ctx.fillStyle='#d5d1c6';ctx.beginPath();ctx.ellipse(fx*2,-17+fy,8,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#202628';ctx.fillRect(-5+fx*3,-18+fy,10,3);ctx.strokeStyle='#7fe7e1';ctx.lineWidth=3;ctx.beginPath();ctx.arc(-11+fx*2,-1+fy*2,5,0,Math.PI*2);ctx.stroke();if(player.attackTimer>0){const angle=Math.atan2(fy,fx);ctx.strokeStyle='#d9f6ef';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,44,angle-.72,angle+.72);ctx.stroke();}else{ctx.strokeStyle='#b8b4aa';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(7,1);ctx.lineTo(18+fx*10,-8+fy*10);ctx.stroke();}ctx.restore();}
  function refreshHud(){if(hudRoom)hudRoom.textContent=rooms[player.room].name;if(hudHealth){let text='';for(let i=0;i<player.maxHealth;i++)text+=`${i<player.health?'◆':'◇'} `;hudHealth.textContent=text.trim();}const unlocked=hasAbility('resonance');if(hudAbility)hudAbility.textContent=unlocked?'AXIOM: RESONANCE ◇':'AXIOM: DORMANT';if(resonanceButton)resonanceButton.hidden=!unlocked;}
  function setupKeyboard(){addEventListener('keydown',e=>{if(!running)return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(!e.repeat&&['Space','KeyZ','KeyJ'].includes(e.code))actionPressed();if(!e.repeat&&['KeyE','KeyR','ShiftLeft','ShiftRight'].includes(e.code))resonancePressed();if(!e.repeat&&(e.code==='F3'||e.code==='Backquote')){e.preventDefault();toggleDebug();}input.keys.add(e.code);});addEventListener('keyup',e=>input.keys.delete(e.code));addEventListener('blur',()=>input.keys.clear());}
  function setupTouch(){if(!touchStick||!touchKnob)return;let pointerId=null;const max=38,updateStick=e=>{const r=touchStick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy,len=Math.hypot(dx,dy);if(len>max){dx=dx/len*max;dy=dy/len*max;}input.touchX=dx/max;input.touchY=dy/max;touchKnob.style.transform=`translate(${dx}px, ${dy}px)`;};touchStick.addEventListener('pointerdown',e=>{pointerId=e.pointerId;touchStick.setPointerCapture(pointerId);updateStick(e);});touchStick.addEventListener('pointermove',e=>{if(e.pointerId===pointerId)updateStick(e);});const release=e=>{if(pointerId!==null&&e.pointerId!==pointerId)return;pointerId=null;input.touchX=0;input.touchY=0;touchKnob.style.transform='translate(0, 0)';};touchStick.addEventListener('pointerup',release);touchStick.addEventListener('pointercancel',release);if(actionButton)actionButton.addEventListener('pointerdown',e=>{e.preventDefault();actionPressed();});if(resonanceButton)resonanceButton.addEventListener('pointerdown',e=>{e.preventDefault();resonancePressed();});if(dialogue)dialogue.addEventListener('pointerdown',e=>{e.preventDefault();if(dialogueSequence)advanceDialogue();});}
  function describeSave(data){const room=rooms[data.player.roomId];const name=room?room.name:'UNCHARTED';return `${name}    ${data.player.health}/${data.player.maxHealth} \u25c6`;}
  function beginPlay(mode){
    Audio.fadeOut(1.1);
    if(mode==='new'){saveData=SaveManager.reset();saveInspection={status:'empty'};}
    restoreSave();
    running=true;
    if(hud)hud.hidden=false;
    if(touchControls)touchControls.hidden=false;
    canvas.focus({preventScroll:true});
    if(mode==='new')saveGame('JOURNEY BEGUN');
  }
  function armAudio(){
    const kick=()=>{
      removeEventListener('pointerdown',kick,true);removeEventListener('keydown',kick,true);
      Audio.unlock();
      // If that gesture was the one starting the game, never raise the bed at all.
      setTimeout(()=>{if(!running)Audio.playTitleAmbience();},220);
    };
    addEventListener('pointerdown',kick,true);
    addEventListener('keydown',kick,true);
  }
  function presentTitle(){
    TitleScreen.present({
      version:VERSION,
      inspection:saveInspection,
      describeSave,
      settings:deviceSettings,
      onSettingsChange(next){deviceSettings=next;SaveManager.saveSettings(next);setDebugMode(Boolean(next.debugOverlay),false);Audio.configure(next);if(next.audio&&!running)Audio.playTitleAmbience();},
      onStart:beginPlay,
    });
  }
  function start(){
    if(!canvas)throw new Error('Game canvas was not found.');
    const ctx=canvas.getContext('2d',{alpha:false});
    if(!ctx)throw new Error('Canvas 2D is unavailable in this browser.');
    document.documentElement.dataset.veilboundVersion=VERSION;
    if(status)status.textContent='Bound user confirmed.';
    // The world is restored before the title so the menu sits over a live still of it.
    restoreSave();
    setDebugMode(debugRequestedByUrl()||Boolean(deviceSettings.debugOverlay),false);
    setupKeyboard();
    setupTouch();
    Audio.configure(deviceSettings);
    armAudio();
    setTimeout(()=>{if(boot)boot.hidden=true;presentTitle();},350);
    let previous=performance.now();
    const frame=t=>{resizeCanvas();const elapsed=t-previous;const dt=Math.min(elapsed/1000,.05);previous=t;sampleFrameTime(elapsed);if(running)update(dt);drawWorld(ctx);requestAnimationFrame(frame);};
    addEventListener('resize',resizeCanvas,{passive:true});
    // Never autosave from the title: that would manufacture a save the player never started.
    addEventListener('pagehide',()=>{if(running)saveGame('AUTOSAVED');});
    document.addEventListener('visibilitychange',()=>{const hidden=document.visibilityState==='hidden';if(hidden){Audio.suspend();if(running)saveGame('AUTOSAVED');}else Audio.resume();});
    requestAnimationFrame(frame);
    console.info(`[VEILBOUND] v${VERSION} booted. Save V${SaveManager.VERSION}. Stored save: ${saveInspection.status}.`);
    console.info('[VEILBOUND] Diagnostics: press F3 or ` , or append ?debug to the URL.');
  }
  try{start();}catch(error){fail(error);}
})();