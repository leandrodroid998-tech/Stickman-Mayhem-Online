'use strict';
const GFX = {low: false}; // gráficos: Baixo = menos partículas/animações/resolução
/* STICK MAYHEM — dados: armas, arenas, cosméticos, desafios */
const WORLD_W = 1280, WORLD_H = 720, VERSION = 'v1.4.0';
const GRAV = 2300;

/* ---------- ícones vetoriais (traço 24x24, estilo linha) ---------- */
const _c = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const ICO = {
  globe: [_c(12, 12, 10), 'M2 12h20', 'M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2z'],
  copy: ['M9 9h11v11H9z', 'M5 15H4V4h11v1'],
  wifi: ['M2 9a15 15 0 0 1 20 0', 'M5 12.5a10 10 0 0 1 14 0', 'M8.5 16a5 5 0 0 1 7 0', _c(12, 19.2, 1)],
  play: ['M7 4.5v15l12-7.5z'],
  swords: ['M14.5 17.5L3 6V3h3l11.5 11.5', 'M13 19l6-6', 'M16 16l4 4', 'M19 21l2-2', 'M14.5 6.5L18 3h3v3l-3.5 3.5', 'M5 14l4 4', 'M7 17l-3 3', 'M3 19l2 2'],
  palette: ['M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A3.7 3.7 0 0 0 21 10.7C21 6.4 17 3 12 3z', _c(7.5, 11, .8), _c(10, 7.5, .8), _c(15, 7.5, .8)],
  arena: ['M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z', 'M9 4v14', 'M15 6v14'],
  sliders: ['M4 6h9', 'M17 6h3', 'M4 12h3', 'M11 12h9', 'M4 18h11', 'M19 18h1', _c(15, 6, 2), _c(9, 12, 2), _c(17, 18, 2)],
  chart: ['M4 20V10', 'M10 20V4', 'M16 20v-8', 'M21 20H3'],
  coin: [_c(12, 12, 9), _c(12, 12, 5.2), 'M12 9.6v4.8'],
  back: ['M15 5l-7 7 7 7'],
  bot: ['M5 9h14v11H5z', 'M12 9V5', _c(12, 4, 1), 'M2 14h3', 'M19 14h3', 'M9 14v2', 'M15 14v2'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', _c(9, 7, 4), 'M22 21v-2a4 4 0 0 0-3-3.9', 'M16 3.1a4 4 0 0 1 0 7.8'],
  burst: ['M12 2l2.3 5.7L20 6l-2.2 5.3L22 14l-5.7.8L15 21l-3-4.3L9 21l-1.3-6.2L2 14l4.2-2.7L4 6l5.7 1.7z'],
  restart: ['M3 12a9 9 0 1 0 3-6.7L3 8', 'M3 3v5h5'],
  pause: ['M8 5v14', 'M16 5v14'],
  vol: ['M11 5L6 9H3v6h3l5 4z', 'M15.5 8.5a5 5 0 0 1 0 7', 'M18.5 5.5a9 9 0 0 1 0 13'],
  mute: ['M11 5L6 9H3v6h3l5 4z', 'M22 9l-6 6', 'M16 9l6 6'],
  full: ['M8 3H5a2 2 0 0 0-2 2v3', 'M21 8V5a2 2 0 0 0-2-2h-3', 'M3 16v3a2 2 0 0 0 2 2h3', 'M16 21h3a2 2 0 0 0 2-2v-3'],
  home: ['M3 11l9-8 9 8', 'M5 10v10h14V10', 'M10 20v-6h4v6'],
  gamepad: ['M17.3 5H6.7a4 4 0 0 0-3.9 3.2L1.5 16a3 3 0 0 0 5.2 1.8L8 16h8l1.3 1.8a3 3 0 0 0 5.2-1.8l-1.3-7.8A4 4 0 0 0 17.3 5z', 'M6.5 10.5h4', 'M8.5 8.5v4', 'M15.5 11h.01', 'M18 9.5h.01'],
  lock: ['M5 11h14v10H5z', 'M8 11V7a4 4 0 0 1 8 0v4'],
  warn: ['M12 3l10 18H2z', 'M12 10v5', 'M12 18h.01'],
  check: ['M5 12.5l4.5 4.5L19 7'],
  crown: ['M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z'],
  skull: ['M12 3a8 8 0 0 0-8 8c0 2.6 1.3 4.2 3 5.2V20h10v-3.8c1.7-1 3-2.6 3-5.2a8 8 0 0 0-8-8z', _c(9, 11.5, 1.3), _c(15, 11.5, 1.3), 'M10.5 20v-2', 'M13.5 20v-2'],
  bolt: ['M13 2L4 14h7l-1 8 9-12h-7z'],
  arrow: ['M4 12h15', 'M13 6l6 6-6 6'],
  jump: ['M6 14l6-6 6 6', 'M6 19l6-6 6 6'],
  sword: ['M14.5 17.5L3 6V3h3l11.5 11.5', 'M13 19l6-6', 'M16 16l4 4', 'M19 21l2-2'],
  down: ['M12 4v12', 'M6 11l6 6 6-6', 'M5 21h14'],
  awk: ['M12 2l2.2 6.3L21 9l-5 4.4L17.5 21 12 17.3 6.5 21 8 13.4 3 9l6.8-.7z'],
  users2: ['M12 3l2 5 5 .5-3.8 3.4 1.2 5.1L12 14.4 7.6 17l1.2-5.1L5 8.5 10 8z'],
  plus: ['M12 5v14','M5 12h14'],
  minus: ['M5 12h14'],
  keyb: ['M3 6h18v12H3z','M7 10h.01','M11 10h.01','M15 10h.01','M7 14h10'],
  info: [_c(12,12,9),'M12 11v5','M12 7.5h.01'],
  rotate: ['M7 2h10v20H7z', 'M11 18h2'],
};
function ico(n, cls) { return `<svg class="ic ic-${n}${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true">${(ICO[n] || []).map(p => `<path d="${p}"/>`).join('')}</svg>`; }
const _p2d = {};
function drawIcon(ctx, n, x, y, size, col) {
  if (!_p2d[n]) _p2d[n] = ICO[n].map(p => new Path2D(p));
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 24, size / 24); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const pass of [0, 1]) { ctx.lineWidth = pass ? 2.4 : 5.4; ctx.strokeStyle = pass ? col : '#0a0c18'; for (const p of _p2d[n]) ctx.stroke(p); }
  ctx.restore();
}


const WEAPONS = {
  fist:     {name:'Punho', cat:'', type:'melee', style:'punch', len:16, dmg:5, swing:0.24, cd:0.1, knock:260, uses:9999, color:'#f2c9a0', rar:0, snd:'punch'},
  // ---- corpo a corpo
  sword:    {name:'Espada', cat:'Corpo a corpo', type:'melee', style:'swing', len:56, dmg:15, swing:0.38, cd:0.14, knock:440, uses:28, color:'#d8ecff', color2:'#ffcf5a', rar:10, snd:'slash', desc:'Alcance médio e dano equilibrado.'},
  katana:   {name:'Katana', cat:'Corpo a corpo', type:'melee', style:'swing', len:62, dmg:11, swing:0.24, cd:0.05, knock:540, uses:28, color:'#e9f1ff', color2:'#b91c1c', rar:9, snd:'slash', desc:'Golpes rápidos e ótimo empurrão.'},
  hammer:   {name:'Martelo', cat:'Corpo a corpo', type:'melee', style:'swing', len:58, dmg:30, swing:0.8, cd:0.3, knock:1200, uses:14, color:'#9ca3af', color2:'#7c4a1e', rar:5, snd:'thud', slow:0.62, upKnock:0.5, desc:'Lento, impacto devastador.'},
  axe:      {name:'Machado', cat:'Corpo a corpo', type:'melee', style:'swing', len:52, dmg:23, swing:0.54, cd:0.2, knock:720, uses:20, color:'#cbd5e1', color2:'#7c4a1e', rar:7, snd:'slash', slow:0.8, desc:'Dano alto, velocidade moderada.'},
  spear:    {name:'Lança', cat:'Corpo a corpo', type:'melee', style:'thrust', len:88, dmg:14, swing:0.42, cd:0.14, knock:480, uses:26, color:'#e2e8f0', color2:'#92400e', rar:8, snd:'slash', desc:'Grande alcance em estocadas.'},
  bat:      {name:'Bastão', cat:'Corpo a corpo', type:'melee', style:'swing', len:50, dmg:10, swing:0.26, cd:0.08, knock:640, uses:30, color:'#d6a461', color2:'#7c4a1e', rar:9, snd:'thud', desc:'Rápido, dano moderado.'},
  daggers:  {name:'Adaga dupla', cat:'Corpo a corpo', type:'melee', style:'swing', len:28, dmg:6.5, swing:0.15, cd:0.02, knock:190, uses:45, color:'#dbeafe', color2:'#1e293b', rar:8, snd:'slash', desc:'Curtas e muito rápidas.'},
  scythe:   {name:'Foice', cat:'Corpo a corpo', type:'melee', style:'swing', len:70, dmg:16, swing:0.48, cd:0.18, knock:720, uses:20, color:'#c4b5fd', color2:'#5b3a1a', rar:6, snd:'slash', upKnock:0.9, desc:'Amplo alcance, lança o alvo para cima.'},
  nunchaku: {name:'Nunchaku', cat:'Corpo a corpo', type:'melee', style:'swing', len:46, dmg:8, swing:0.2, cd:0.02, knock:330, uses:40, color:'#9a6b3a', color2:'#d4d4d8', rar:8, snd:'slash', desc:'Golpes muito rápidos, empurrão baixo.'},
  mace:     {name:'Maça', cat:'Corpo a corpo', type:'melee', style:'swing', len:54, dmg:24, swing:0.62, cd:0.22, knock:900, uses:18, color:'#94a3b8', color2:'#5b3a1a', rar:6, snd:'thud', slow:0.78, desc:'Pesada: dano alto e bom empurrão.'},
  trident:  {name:'Tridente', cat:'Corpo a corpo', type:'melee', style:'thrust', len:82, dmg:17, swing:0.46, cd:0.14, knock:560, uses:24, color:'#67e8f9', color2:'#0e7490', rar:6, snd:'slash', desc:'Estocada longa de três pontas.'},
  whip:     {name:'Chicote', cat:'Corpo a corpo', type:'melee', style:'swing', len:104, dmg:8.5, swing:0.36, cd:0.1, knock:260, uses:26, color:'#a16207', color2:'#451a03', rar:7, snd:'whip', desc:'O maior alcance corpo a corpo.'},
  chainsaw: {name:'Motosserra', cat:'Corpo a corpo', type:'melee', style:'swing', len:44, dmg:4.6, swing:0.15, cd:0, knock:150, uses:50, color:'#cbd5e1', color2:'#dc2626', rar:4, snd:'saw', desc:'Cortes ultrarrápidos e contínuos.'},
  // ---- projéteis
  pistol:   {name:'Pistola', cat:'Projéteis', type:'gun', proj:'bullet', dmg:9, cd:0.26, speed:1300, life:0.9, ammo:16, spread:0.03, knock:260, recoil:60, muzzle:30, rng:650, color:'#94a3b8', color2:'#334155', rar:10, snd:'pistol', desc:'Disparos rápidos, dano moderado.'},
  revolver: {name:'Revólver', cat:'Projéteis', type:'gun', proj:'bullet', dmg:26, cd:0.72, speed:1500, life:0.9, ammo:6, spread:0.015, knock:640, recoil:150, muzzle:34, rng:700, color:'#cbd5e1', color2:'#7c4a1e', rar:7, snd:'revolver', desc:'Lento e poderoso.'},
  smg:      {name:'Submetralhadora', cat:'Projéteis', type:'gun', proj:'bullet', dmg:4.5, cd:0.07, speed:1250, life:0.7, ammo:44, spread:0.09, knock:120, recoil:30, muzzle:34, rng:520, color:'#64748b', color2:'#0f172a', rar:8, snd:'smg', desc:'Altíssima cadência.'},
  rifle:    {name:'Rifle', cat:'Projéteis', type:'gun', proj:'bullet', dmg:19, cd:0.58, speed:2200, life:1.2, ammo:10, spread:0.004, knock:500, recoil:110, muzzle:56, rng:1100, color:'#78716c', color2:'#44331b', rar:6, snd:'rifle', desc:'Precisão e longo alcance.'},
  shotgun:  {name:'Espingarda', cat:'Projéteis', type:'gun', proj:'bullet', pellets:8, dmg:4.6, cd:0.95, speed:1150, life:0.3, ammo:6, spread:0.24, knock:210, recoil:320, muzzle:48, rng:340, color:'#a8a29e', color2:'#6b3f1d', rar:7, snd:'shotgun', desc:'Vários projéteis a curta distância.'},
  bow:      {name:'Arco', cat:'Projéteis', type:'gun', proj:'arrow', charge:true, dmgMin:7, dmgMax:27, speedMin:500, speedMax:1500, grav:620, life:1.6, ammo:10, knock:400, muzzle:20, rng:800, color:'#d6a461', color2:'#f8fafc', rar:8, snd:'bow', desc:'Segure para carregar o disparo.'},
  crossbow: {name:'Besta', cat:'Projéteis', type:'gun', proj:'bolt', dmg:27, cd:1.0, speed:1100, grav:260, life:1.4, ammo:6, knock:600, recoil:100, muzzle:30, rng:760, color:'#a16207', color2:'#334155', rar:6, snd:'crossbow', desc:'Virotes lentos e fortes.'},
  rocket:   {name:'Lança-foguetes', cat:'Projéteis', type:'gun', proj:'rocket', dmg:12, expDmg:34, expR:105, cd:1.3, speed:640, life:2.2, ammo:3, knock:950, recoil:260, muzzle:52, rng:800, color:'#4d7c0f', color2:'#ef4444', rar:3, snd:'rocket', desc:'Explosão em área.'},
  cannon:   {name:'Canhão de energia', cat:'Projéteis', type:'gun', proj:'orb', dmg:18, expDmg:14, expR:62, cd:0.9, speed:780, life:1.6, ammo:7, knock:720, recoil:130, muzzle:46, rng:650, color:'#7c3aed', color2:'#22d3ee', rar:4, snd:'orb', desc:'Orbes de energia explosivos.'},
  laser:    {name:'Laser', cat:'Projéteis', type:'beam', dmg:3.4, tick:0.06, dur:0.34, len:520, cd:1.3, ammo:7, knock:70, recoil:20, muzzle:40, rng:520, color:'#0ea5e9', color2:'#e0f2fe', rar:4, snd:'laser', desc:'Feixe curto e instantâneo.'},
  boomerang:{name:'Bumerangue', cat:'Projéteis', type:'gun', proj:'boomerang', dmg:13, cd:0.45, speed:1050, life:4, ammo:14, spread:0.02, knock:380, recoil:20, muzzle:24, rng:620, color:'#f59e0b', color2:'#7c2d12', rar:7, snd:'boom', desc:'Vai e volta: acerta na ida e na volta.'},
  shuriken: {name:'Shuriken', cat:'Projéteis', type:'gun', proj:'shuriken', pellets:3, dmg:5.2, cd:0.55, speed:1500, life:0.7, ammo:20, spread:0.2, knock:160, recoil:10, muzzle:22, rng:520, color:'#cbd5e1', color2:'#334155', rar:8, snd:'throw', desc:'Leque de 3 estrelas ninja.'},
  flamer:   {name:'Lança-chamas', cat:'Projéteis', type:'gun', proj:'fire', dmg:2.4, cd:0.06, speed:560, life:0.38, ammo:70, spread:0.12, knock:90, recoil:6, muzzle:40, rng:260, color:'#dc2626', color2:'#f97316', rar:5, snd:'flame', desc:'Jato de fogo de curto alcance.'},
  sniper:   {name:'Sniper', cat:'Projéteis', type:'gun', proj:'bullet', dmg:38, cd:1.4, speed:3600, life:1, ammo:4, spread:0, knock:900, recoil:220, muzzle:64, rng:1300, color:'#57534e', color2:'#1c1917', rar:3, snd:'rifle', desc:'Um tiro de grande dano à distância.'},
  glauncher:{name:'Lança-granadas', cat:'Projéteis', type:'gun', proj:'rocket', dmg:6, expDmg:30, expR:95, grav:650, cd:1.0, speed:820, life:2, ammo:5, knock:850, recoil:160, muzzle:40, rng:650, color:'#3f6212', color2:'#facc15', rar:4, snd:'rocket', desc:'Granadas em arco, explodem ao tocar.'},
  zapper:   {name:'Raio Tesla', cat:'Projéteis', type:'beam', dmg:2.6, tick:0.05, dur:0.5, len:420, cd:1.4, ammo:6, knock:60, recoil:20, muzzle:34, rng:420, color:'#facc15', color2:'#fef9c3', rar:4, snd:'zap', desc:'Descarga elétrica contínua.'},
  // ---- especiais
  grenade:  {name:'Granada', cat:'Especiais', type:'throw', fuse:1.7, expDmg:38, expR:110, cd:0.6, ammo:3, knock:950, rng:420, color:'#4d7c0f', color2:'#fbbf24', rar:5, snd:'throw', desc:'Explode após 1,7 s.'},
  dynamite: {name:'Dinamite', cat:'Especiais', type:'throw', fuse:2.4, expDmg:55, expR:150, cd:0.7, ammo:2, knock:1200, rng:460, color:'#b91c1c', color2:'#fbbf24', rar:3, snd:'throw', desc:'Explosão enorme após 2,4 s.'},
  mine:     {name:'Mina', cat:'Especiais', type:'mine', expDmg:42, expR:95, cd:0.6, ammo:3, arm:0.9, trig:46, knock:900, rng:0, color:'#475569', color2:'#ef4444', rar:4, snd:'beep', desc:'Ativa quando alguém se aproxima.'},
};
for (const k in WEAPONS) WEAPONS[k].id = k;
const WEAPON_IDS = Object.keys(WEAPONS).filter(k => k !== 'fist');
const WEAPON_CAT_COLOR = {'Corpo a corpo':'#fb923c', 'Projéteis':'#22d3ee', 'Especiais':'#c084fc'};

const S = (x, y, w, h, o) => Object.assign({x, y, w, h, solid: true}, o || {});
const O = (x, y, w, o) => Object.assign({x, y, w, h: 16, solid: false}, o || {});

const ARENAS = {
  neon: {id:'neon', name:'Neon District', desc:'Cidade noturna com letreiros. Muro central bloqueia tiros.', hazard:'Abismos nas laterais',
    theme:{plat:'#2b2f5a', top:'#ff3df2', glow:'#00e5ff', a:'#1a0b3b', b:'#0a1030'}, killY:860,
    plats:[S(150,600,980,120), O(250,455,230), O(800,455,230), O(530,330,220), S(607,540,66,60)],
    spawns:[{x:260,y:600},{x:1020,y:600},{x:360,y:455},{x:920,y:455}]},
  sky: {id:'sky', name:'Sky Ruins', desc:'Ilhas suspensas e plataformas flutuantes.', hazard:'Queda no céu · plataformas móveis',
    theme:{plat:'#7a6a8a', top:'#fde68a', glow:'#fff', a:'#60a5fa', b:'#fbcfe8'}, killY:800,
    plats:[S(100,520,300,50), S(880,520,300,50), S(490,400,300,50),
      O(280,270,170,{move:{ax:120,ay:0,spd:0.8,ph:0}}), O(830,270,170,{move:{ax:120,ay:0,spd:0.8,ph:3}}), O(555,170,170),
      O(560,640,160,{move:{ax:0,ay:50,spd:0.7,ph:1}})],
    spawns:[{x:200,y:520},{x:1080,y:520},{x:560,y:400},{x:720,y:400}]},
  volcano: {id:'volcano', name:'Volcanic Core', desc:'Lava mortal e bolas de fogo caindo.', hazard:'Lava (morte) · bolas de fogo',
    theme:{plat:'#3b2320', top:'#fb923c', glow:'#ff5a1f', a:'#2a0a0a', b:'#7f1d1d'}, killY:700, lavaY:690, fire:true,
    plats:[S(60,560,260,60), S(960,560,260,60), S(450,480,380,40), O(180,380,200), O(900,380,200), O(560,340,160)],
    spawns:[{x:160,y:560},{x:1120,y:560},{x:560,y:480},{x:720,y:480}]},
  industrial: {id:'industrial', name:'Industrial Chaos', desc:'Fábrica com elevadores e esteiras móveis.', hazard:'Plataformas móveis · poço central',
    theme:{plat:'#4b5563', top:'#facc15', glow:'#f59e0b', a:'#1f2937', b:'#374151'}, killY:860,
    plats:[S(60,600,380,120), S(840,600,380,120), S(414,530,26,70), S(840,530,26,70),
      O(540,520,200,{move:{ax:0,ay:110,spd:0.9,ph:0}}), O(200,440,200), O(880,440,200),
      O(280,300,160,{move:{ax:140,ay:0,spd:0.7,ph:0}}), O(840,300,160,{move:{ax:140,ay:0,spd:0.7,ph:2}}), O(520,230,240)],
    spawns:[{x:150,y:600},{x:1130,y:600},{x:300,y:440},{x:980,y:440}]},
  frozen: {id:'frozen', name:'Frozen Arena', desc:'Gelo escorregadio: pouca aderência.', hazard:'Superfícies escorregadias',
    theme:{plat:'#7dd3fc', top:'#e0f2fe', glow:'#fff', a:'#0c4a6e', b:'#7dd3fc'}, killY:860,
    plats:[S(140,600,1000,120,{ice:true}), O(250,460,240,{ice:true}), O(790,460,240,{ice:true}), O(520,330,240,{ice:true}), S(610,540,60,60,{ice:true})],
    spawns:[{x:260,y:600},{x:1020,y:600},{x:370,y:460},{x:910,y:460}]},
  cyber: {id:'cyber', name:'Cyber Stadium', desc:'Estádio futurista com piso elétrico.', hazard:'Piso elétrico pulsante',
    theme:{plat:'#1e293b', top:'#22d3ee', glow:'#a78bfa', a:'#020617', b:'#1e1b4b'}, killY:880,
    plats:[S(40,610,1200,110), O(140,470,220), O(920,470,220), O(500,360,280), O(120,300,170), O(990,300,170)],
    zaps:[{x:520,y:560,w:240,h:50,period:7,on:1.4}],
    spawns:[{x:200,y:610},{x:1080,y:610},{x:250,y:470},{x:1030,y:470}]},
  abyss: {id:'abyss', name:'The Abyss', desc:'Plataformas pequenas sobre o abismo.', hazard:'Abismo sem fundo',
    theme:{plat:'#3f3a5a', top:'#c084fc', glow:'#a855f7', a:'#05030f', b:'#2b1055'}, killY:780,
    plats:[S(120,560,150,24), S(1010,560,150,24), S(560,520,160,24), S(330,410,130,24), S(820,410,130,24), S(560,290,160,24), S(150,290,110,24), S(1020,290,110,24),
      O(440,200,110,{move:{ax:110,ay:0,spd:0.8,ph:0}})],
    spawns:[{x:195,y:560},{x:1085,y:560},{x:395,y:410},{x:885,y:410}]},
  training: {id:'training', name:'Training Room', desc:'Sala simples, com paredes. Ideal para aprender.', hazard:'Nenhum',
    theme:{plat:'#475569', top:'#93c5fd', glow:'#fff', a:'#cbd5e1', b:'#94a3b8'}, killY:900, training:true,
    plats:[S(0,600,1280,120), S(-60,-200,80,1000), S(1260,-200,80,1000), O(280,450,220), O(780,450,220), O(520,320,240)],
    spawns:[{x:240,y:600},{x:1040,y:600},{x:380,y:450},{x:900,y:450}]},
};
const ARENA_IDS = Object.keys(ARENAS);

// ---- cosméticos: [id, nome, preço, valor]

// skins prontas (pacotes completos). 'style' = corpo especial desenhado à parte. Nomes originais (sem marcas registradas).
const SKINS = {
  none:    {name:'PERSONALIZADA', price:0, desc:'Monte o visual com as abas Corpo, Chapéus, Máscaras e outras.'},
  tung:    {name:'TUNG TUNG TUNG SAHUR', price:0, style:'tung', desc:'Tronco de madeira sorridente com bastão. A batida da madrugada!', tags:['Grátis','Corpo de madeira','Bastão'], preset:{color:'#d98a3d', accent:'#c9792b', hat:'none', mask:'none', glasses:'none', acc:'none', clothes:'none', fx:'none'}},
  block:   {name:'BLOCK MINER', price:0, style:'block', desc:'Explorador de blocos 3D: cabeça cúbica, camisa azul-turquesa e calça índigo.', tags:['Grátis','Estilo pixel','Cúbico'], preset:{color:'#17a9c1', accent:'#6b7280', hat:'none', mask:'none', glasses:'none', acc:'none', clothes:'none', fx:'none'}},
  ninja:   {name:'SOMBRA NINJA', price:400, desc:'Discreto e veloz. Máscara, cachecol e detalhes carmesim.', tags:['Máscara ninja','Cachecol'], preset:{color:'#2d3142', accent:'#f43f5e', hat:'none', mask:'ninja', glasses:'none', acc:'scarf', clothes:'none', fx:'none'}},
  party:   {name:'FESTEIRO', price:300, desc:'Cartola, óculos de estrela e rastro arco-íris.', tags:['Cartola','Arco-íris'], preset:{color:'#f472b6', accent:'#facc15', hat:'top', mask:'none', glasses:'star', acc:'none', clothes:'jacket', fx:'rainbow'}},
  samurai: {name:'SAMURAI ONI', price:600, desc:'Máscara de demônio e faixa de guerra.', tags:['Máscara oni','Cachecol'], preset:{color:'#f1f5f9', accent:'#dc2626', hat:'none', mask:'oni', glasses:'none', acc:'scarf', clothes:'jacket', fx:'none'}},
  knight:  {name:'CAVALEIRO REAL', price:600, desc:'Armadura de aço, elmo e capa dourada.', tags:['Armadura','Elmo','Capa'], preset:{color:'#cbd5e1', accent:'#fbbf24', hat:'helmet', mask:'none', glasses:'none', cape:'classic', acc:'none', clothes:'armor', fx:'none'}},
  cyber:   {name:'CIBORGUE', price:700, desc:'Visor de neon e aura tecnológica.', tags:['Visor','Aura'], preset:{color:'#f1f5f9', accent:'#22d3ee', hat:'none', mask:'visor', glasses:'none', acc:'backpack', clothes:'armor', fx:'aura'}},
  magma:   {name:'LORDE MAGMA', price:800, desc:'Chifres e chamas vivas no topo da cabeça.', tags:['Chifres','Chamas'], preset:{color:'#ef4444', accent:'#fb923c', hat:'horns', mask:'none', glasses:'none', acc:'none', clothes:'none', fx:'flame'}},
  frost:   {name:'REI DO GELO', price:800, desc:'Coroa congelada, capa e faíscas de cristal.', tags:['Coroa','Capa','Faíscas'], preset:{color:'#22d3ee', accent:'#f8fafc', hat:'crown', mask:'none', glasses:'none', cape:'classic', acc:'none', clothes:'none', fx:'sparks'}},
  gold:    {name:'IMPERADOR DOURADO', price:1200, desc:'Tudo em ouro: coroa, óculos escuros, capa e brilho.', tags:['Coroa','Capa','Aura'], preset:{color:'#fbbf24', accent:'#fcd34d', hat:'crown', mask:'none', glasses:'shades', cape:'classic', acc:'none', clothes:'none', fx:'aura'}},
  shadowninja:{name:'SHADOW NINJA', price:700, desc:'Capuz, máscara e capa curta. Sombras roxas escorrem das lâminas.', tags:['Capuz','Capa curta','Névoa'], preset:{color:'#14121f', accent:'#a855f7', hat:'hood', mask:'ninja', glasses:'none', cape:'short', acc:'none', clothes:'none', fx:'void', deco:'ninja'}},
  cyberwarrior:{name:'CYBER WARRIOR', price:900, desc:'Armadura de circuitos, visor e jetpack. Energia elétrica nos membros.', tags:['Circuitos','Jetpack','Elétrico'], preset:{color:'#0e3b43', accent:'#22d3ee', hat:'none', mask:'visor', glasses:'none', cape:'none', acc:'jetpack', clothes:'armor', fx:'electric', deco:'circuit'}},
  infernal:{name:'INFERNAL', price:1000, desc:'Pele em brasa, chifres e capa esfarrapada. Chamas nas veias.', tags:['Chifres','Capa rasgada','Brasas'], preset:{color:'#7f1d1d', accent:'#fb923c', hat:'horns', mask:'none', glasses:'none', cape:'tattered', acc:'none', clothes:'none', fx:'embers', deco:'flameveins'}},
  frostknight:{name:'FROST KNIGHT', price:1100, desc:'Armadura de cristal, elmo e capa longa. Cada passo congela o ar.', tags:['Elmo','Capa longa','Gelo'], preset:{color:'#bfdbfe', accent:'#38bdf8', hat:'helmet', mask:'none', glasses:'none', cape:'long', acc:'none', clothes:'armor', fx:'frost', deco:'icespikes'}},
  neonphantom:{name:'NEON PHANTOM', price:1000, desc:'Silhueta negra contornada de neon, auréola e rosto em glitch.', tags:['Contorno neon','Auréola','Glitch'], preset:{color:'#0a0612', accent:'#f0abfc', hat:'halo', mask:'glitch', glasses:'none', cape:'none', acc:'none', clothes:'none', fx:'stars', deco:'neonoutline'}},
  goldchamp:{name:'GOLDEN CHAMPION', price:1800, desc:'O campeão supremo: ouro maciço, coroa, capa real e cinturão.', tags:['Coroa','Capa real','Cinturão'], preset:{color:'#f5c542', accent:'#fff1a8', hat:'crown', mask:'none', glasses:'shades', cape:'royal', acc:'none', clothes:'none', fx:'aura', deco:'champion'}},
  voidwalker:{name:'VOID WALKER', price:1500, desc:'Anda entre dimensões: capuz, capa cósmica e fenda no peito.', tags:['Capuz','Capa cósmica','Fenda'], preset:{color:'#2e1065', accent:'#c084fc', hat:'hood', mask:'none', glasses:'none', cape:'cosmic', acc:'none', clothes:'none', fx:'void', deco:'voidrift'}},
  brawler:{name:'STREET BRAWLER', price:500, desc:'Lutador de rua: faixa vermelha, camiseta branca e mãos enfaixadas.', tags:['Faixa','Mãos enfaixadas'], preset:{color:'#f8fafc', accent:'#ef4444', hat:'band', mask:'none', glasses:'none', cape:'none', acc:'none', clothes:'tshirt', fx:'none', deco:'wraps'}},
  ranger:{name:'GALACTIC RANGER', price:1300, desc:'Capacete espacial, jetpack e distintivo estelar.', tags:['Capacete','Jetpack','Estrelas'], preset:{color:'#f1f5f9', accent:'#f97316', hat:'spacehelm', mask:'none', glasses:'none', cape:'none', acc:'jetpack', clothes:'jacket', fx:'stars', deco:'badge'}},
  thunderlord:{name:'THUNDER LORD', price:1600, desc:'Senhor das tempestades: crista, capa e raios nos braços.', tags:['Crista','Capa','Raios'], preset:{color:'#1e3a8a', accent:'#fde047', hat:'crest', mask:'none', glasses:'none', cape:'classic', acc:'none', clothes:'none', fx:'electric', deco:'thunderbolt'}},
  glitchentity:{name:'GLITCH ENTITY', price:1400, desc:'Uma falha no sistema: corpo dividido em canais RGB tremendo.', tags:['RGB','Glitch'], preset:{color:'#111827', accent:'#22d3ee', hat:'none', mask:'glitch', glasses:'none', cape:'none', acc:'none', clothes:'none', fx:'none', deco:'glitch'}},
  mayhemlegend:{name:'MAYHEM LEGEND', price:2500, desc:'A lenda da MayhemGames: asas de luz, auréola, capa real e emblema M.', tags:['Asas','Auréola','Capa real','Emblema M'], preset:{color:'#6d28d9', accent:'#fde047', hat:'halo', mask:'none', glasses:'none', cape:'royal', acc:'wingsA', clothes:'none', fx:'aura', deco:'mayhemM'}},
};
const SKIN_IDS = Object.keys(SKINS);
function rarOf(p) { return p < 250 ? 'comum' : p < 600 ? 'raro' : p < 1200 ? 'épico' : 'lendário'; }
const RAR_COL = {comum: '#94a3b8', raro: '#38bdf8', épico: '#c084fc', lendário: '#fbbf24'};

/* ---------- FATALITIES (v1.3.0): finalizações cinematográficas, só após vencer a partida inteira ---------- */
const FATS = {
  iron:    {id:'iron',    name:'IRON FIST',          price:0,    rar:'comum',    c:'#fbbf24', c2:'#f97316', desc:'Combo de socos de ferro e um golpe final que arremessa o oponente.', fx:['Combo de 5 socos','Ragdoll lançado','Ondas de impacto']},
  thunder: {id:'thunder', name:'THUNDER GOD',        price:300,  rar:'raro',     c:'#fde047', c2:'#60a5fa', desc:'Braços ao céu, arena escura e um raio colossal cai sobre o oponente.', fx:['Arena escurece','Raio gigante','Trovão']},
  meteor:  {id:'meteor',  name:'METEOR CRASH',       price:500,  rar:'raro',     c:'#fb923c', c2:'#ef4444', desc:'Um meteoro real despenca com rastro de fogo. Câmera lenta e onda de choque.', fx:['Meteoro de fogo','Câmera lenta','Cratera']},
  shadow:  {id:'shadow',  name:'SHADOW EXECUTION',   price:400,  rar:'raro',     c:'#a78bfa', c2:'#0f0720', desc:'Some nas sombras, golpeia de vários ângulos e reaparece nas costas do alvo.', fx:['Escuridão','Pós-imagens','Cortes atrasados']},
  gravity: {id:'gravity', name:'GRAVITY BREAKER',    price:600,  rar:'épico',    c:'#38bdf8', c2:'#818cf8', desc:'Levitação, objetos flutuando e uma pancada de gravidade que racha o chão.', fx:['Levitação','Detritos flutuantes','Rachaduras']},
  blade:   {id:'blade',   name:'BLADE STORM',        price:700,  rar:'épico',    c:'#67e8f9', c2:'#e0f2fe', desc:'Lâminas de energia orbitam, cruzam o oponente e o lançam.', fx:['Lâminas orbitais','Travessia coreografada','Sem gore']},
  void:    {id:'void',    name:'VOID CONSUMPTION',   price:900,  rar:'épico',    c:'#c084fc', c2:'#1e0b3a', desc:'Uma esfera sombria cresce, distorce o espaço e engole o oponente.', fx:['Esfera do vazio','Distorção','Explosão de partículas']},
  god:     {id:'god',     name:'GOD OF MAYHEM',      price:1500, rar:'lendário', c:'#f0abfc', c2:'#fde047', desc:'A finalização suprema: runas, aura em camadas, câmera girando e explosão divina.', fx:['Runas de energia','Aura multicamadas','Câmera rotacionada']},
};
const FAT_IDS = Object.keys(FATS);
const COSM = {
  skin:   {label:'SKINS', list:SKIN_IDS.map(k => [k, SKINS[k].name, SKINS[k].price])},
  color:  {label:'Corpo', list:[['blue','Azul',0,'#3b82f6'],['red','Vermelho',0,'#ef4444'],['green','Verde',0,'#22c55e'],['yellow','Amarelo',0,'#facc15'],['orange','Laranja',40,'#fb923c'],['purple','Roxo',40,'#a855f7'],['pink','Rosa',60,'#f472b6'],['cyan','Ciano',60,'#22d3ee'],['white','Branco',80,'#f1f5f9'],['black','Sombra',100,'#2d3142'],['gold','Ouro',250,'#fbbf24']]},
  accent: {label:'Detalhes', list:[['cyan','Ciano',0,'#22d3ee'],['orange','Laranja',0,'#fb923c'],['white','Branco',0,'#f8fafc'],['magenta','Magenta',30,'#e879f9'],['lime','Lima',30,'#a3e635'],['rose','Rosa',40,'#f43f5e'],['dark','Grafite',50,'#1f2937'],['gold','Ouro',120,'#fcd34d']]},
  hat:    {label:'Chapéus', list:[['none','Nenhum',0],['cap','Boné',0],['band','Faixa',30],['helmet','Capacete',80],['top','Cartola',90],['viking','Viking',100],['horns','Chifres',120],['crown','Coroa',220],['halo','Auréola',160],['hood','Capuz',90],['crest','Crista',110],['kabuto','Kabuto',180],['spacehelm','Capacete espacial',200]]},
  mask:   {label:'Máscaras', list:[['none','Nenhuma',0],['bandana','Bandana',0],['ninja','Ninja',70],['visor','Visor',90],['oni','Oni',150],['skull','Caveira',140],['glitch','Glitch',160]]},
  glasses:{label:'Óculos', list:[['none','Nenhum',0],['shades','Escuros',0],['round','Redondos',40],['goggles','Googles',80],['star','Estrelas',120]]},
  cape:   {label:'CAPAS', list:[['none','Sem capa',0],['classic','Capa clássica',150],['short','Capa curta',90],['long','Capa longa',200],['royal','Capa real',320],['tattered','Capa rasgada',180],['cosmic','Capa cósmica',380]]},
  acc:    {label:'Acessórios', list:[['none','Nenhum',0],['scarf','Cachecol',60],['backpack','Mochila',90],['jetpack','Jetpack',260],['wingsA','Asas de luz',300],['wingsD','Asas sombrias',300]]},
  clothes:{label:'Roupas', list:[['none','Nenhuma',0],['tshirt','Camiseta',0],['jacket','Jaqueta',70],['armor','Armadura',160]]},
  fx:     {label:'Efeitos', list:[['none','Nenhum',0],['sparks','Faíscas',100],['aura','Aura',150],['flame','Chamas',200],['rainbow','Arco-íris',250],['embers','Brasas',180],['frost','Gelo',180],['stars','Estrelas',200],['void','Névoa do vazio',220],['electric','Eletricidade',240]]},
  win:    {label:'ANIMAÇÕES DE VITÓRIA', list:[['wave','Aceno',0],['flex','Músculos',0],['dance','Dança',60],['hop','Pulos',90],['champion','Pose de Campeão',120],['shadow','Entrada Sombria',140],['thunder','Golpe do Trovão',160],['cosmic','Flutuação Cósmica',180],['spin','Giro de Arma',150],['burst','Explosão de Energia',200],['royal','Vitória Real',220],['mayhem','Celebração Mayhem',260]]},
  fat:    {label:'FATALITIES', list:FAT_IDS.map(k => [k, FATS[k].name, FATS[k].price])},
  awk:    {label:'AWAKENING SKINS', list:[['void','VOID BREAKER',0],['inferno','INFERNO OVERDRIVE',500],['celestial','CELESTIAL IMPACT',800],['rage','INFERNAL RAGE',900],['ascension','VOID ASCENSION',1100],['soul','THUNDER SOUL',1000],['emperor','FROZEN EMPEROR',1100],['breaker','CELESTIAL BREAKER',1300],['overdrive','MAYHEM OVERDRIVE',1500]]},
};
const COSM_DEFAULT = {skin:'none', color:'blue', accent:'cyan', hat:'none', mask:'none', glasses:'none', cape:'none', acc:'none', clothes:'tshirt', fx:'none', win:'wave', awk:'void', fat:'iron'};
const COSM_DEFAULT_P2 = Object.assign({}, COSM_DEFAULT, {color:'red', accent:'orange', awk:'void'});
/* ---------- AWAKENING: balanceamento (valores ajustáveis) ---------- */
const AWK = {
  hp: 300,            // vida máxima no modo AWAKENING
  weaponMul: 1.7,     // multiplicador do dano comum (armas/socos) quando a vida é 300
  needFrac: 0.40,     // fração da vida do adversário em dano efetivo para encher a barra (100%)
  chargeMul: {slow: 0.65, normal: 1, fast: 1.6},
  dmgMul: {low: 0.7, normal: 1, high: 1.3},
  maxFrac: 0.55,      // teto: nenhum superataque tira mais que isso da vida máxima
  chainWin: 1.0, chainDecay: 0.10, chainMin: 0.35,   // anti-farm: golpes seguidos sem revide rendem menos
  lockT: 0.25,        // trava curta após terminar (evita ativação dupla)
  maxT: 4.0,          // watchdog: nenhuma sequência passa disso
};
const AWK_TYPES = {
  void: {id:'void', name:'VOID BREAKER', short:'Void', price:0, c:'#a78bfa', c2:'#1e0b3a', c3:'#f0abfc', frac:0.42,
    desc:'Energia sombria que dobra o espaço. Investida relâmpago e golpe que explode em onda de choque.',
    fx:['Aura escura','Distorção espacial','Partículas atraídas','Onda de choque']},
  inferno: {id:'inferno', name:'INFERNO OVERDRIVE', short:'Inferno', price:500, c:'#fb923c', c2:'#7f1d1d', c3:'#fde047', frac:0.40,
    desc:'Fúria incandescente. Avanço em combo de 3 golpes e finalização com explosão.',
    fx:['Combo em chamas','Calor no cenário','Faíscas','Explosão estilizada']},
  celestial: {id:'celestial', name:'CELESTIAL IMPACT', short:'Celestial', price:800, c:'#fde68a', c2:'#bae6fd', c3:'#ffffff', frac:0.40,
    desc:'Luz concentrada em órbita. Teletransporte de luz e pilar celestial que varre a arena.',
    fx:['Partículas orbitais','Anéis de energia','Pilar de luz','Flash cinematográfico']},
};
Object.assign(AWK_TYPES, {
  rage: {id:'rage', name:'INFERNAL RAGE', short:'Rage', price:900, c:'#ef4444', c2:'#450a0a', c3:'#fb923c', frac:0.42,
    desc:'Um rugido de fúria: o chão entra em chamas, garras em 5 cortes e uma erupção de pilares de fogo.',
    fx:['Rugido','Garras em chamas','Pilares de fogo','Vinheta vermelha']},
  ascension: {id:'ascension', name:'VOID ASCENSION', short:'Ascension', price:1100, c:'#7c3aed', c2:'#020008', c3:'#e879f9', frac:0.43,
    desc:'Ascende flutuando entre orbes sombrios e mergulha como um cometa, puxando o alvo para o poço.',
    fx:['Levitação','Orbes do vazio','Mergulho cometa','Poço gravitacional']},
  soul: {id:'soul', name:'THUNDER SOUL', short:'Thunder', price:1000, c:'#facc15', c2:'#1e3a8a', c3:'#93c5fd', frac:0.40,
    desc:'Vira relâmpago: três teletransportes em zigue-zague e um raio final que cai do céu.',
    fx:['Zigue-zague elétrico','Corrente de raios','Raio do céu','Trovão']},
  emperor: {id:'emperor', name:'FROZEN EMPEROR', short:'Emperor', price:1100, c:'#67e8f9', c2:'#0c4a6e', c3:'#ffffff', frac:0.41,
    desc:'Coroa de gelo, onda glacial pelo chão, alvo congelado em cristal e estilhaçado.',
    fx:['Coroa de gelo','Espinhos no chão','Congelamento','Estilhaços']},
  breaker: {id:'breaker', name:'CELESTIAL BREAKER', short:'Breaker', price:1300, c:'#fef08a', c2:'#7dd3fc', c3:'#ffffff', frac:0.42,
    desc:'Asas de luz e uma espada gigante que desce do céu sobre o alvo, cruzando a arena em feixes.',
    fx:['Asas de luz','Espada celestial','Cruz de feixes','Flash']},
  overdrive: {id:'overdrive', name:'MAYHEM OVERDRIVE', short:'Overdrive', price:1500, c:'#f0abfc', c2:'#fde047', c3:'#67e8f9', frac:0.43,
    desc:'A explosão MayhemGames: 3 investidas arco-íris atravessam o alvo e um carimbo M estoura a arena.',
    fx:['Rastros arco-íris','Runas M','3 investidas','Onda final']},
});
const AWK_IDS = ['void', 'inferno', 'celestial', 'rage', 'ascension', 'soul', 'emperor', 'breaker', 'overdrive'];
const CAPES = {
  classic:  {n:5, hw:[5,7,9,10.5,11.5]},
  short:    {n:3, hw:[5,7,8.5]},
  long:     {n:7, hw:[5,6.5,8,9.5,11,12,13]},
  royal:    {n:7, hw:[5,7,9,11,12.5,13.5,14.5]},
  tattered: {n:6, hw:[5,7,9,10,11,11.5]},
  cosmic:   {n:6, hw:[5,7,9.5,11,12,12.5]},
};
const WIN_IDS = COSM.win.list.map(x => x[0]);
function cosmVal(cat, id) { const e = COSM[cat].list.find(x => x[0] === id); return e ? e[3] : null; }

const ENEMY_SKINS = [
  {color:'#ef4444', accent:'#fca5a5', hat:'none', mask:'none', glasses:'none', acc:'none', clothes:'tshirt', fx:'none', win:'flex'},
  {color:'#f97316', accent:'#fde68a', hat:'band', mask:'none', glasses:'shades', acc:'scarf', clothes:'jacket', fx:'none', win:'dance'},
  {color:'#22c55e', accent:'#bbf7d0', hat:'cap', mask:'bandana', glasses:'none', acc:'none', clothes:'tshirt', fx:'none', win:'hop'},
  {color:'#a855f7', accent:'#f0abfc', hat:'horns', mask:'none', glasses:'none', cape:'classic', acc:'none', clothes:'armor', fx:'none', win:'wave'},
];

const CHALLENGES = [
  {id:'duel3', text:'Vença 3 duelos 1v1', goal:3, reward:120},
  {id:'awk3', text:'Vença 3 duelos AWAKENING contra a CPU', goal:3, reward:130},
  {id:'chaos2', text:'Derrote 2 adversários em uma partida de 4 jogadores', goal:1, reward:100},
  {id:'chaos5', text:'Jogue 5 partidas de Chaos Arena', goal:5, reward:80},
  {id:'kills50', text:'Acumule 50 eliminações', goal:50, reward:150},
  {id:'weap5', text:'Elimine alguém com 5 armas diferentes', goal:5, reward:120},
  {id:'surv90', text:'Sobreviva 90 s em uma partida Chaos Arena', goal:1, reward:90},
];
