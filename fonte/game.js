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

'use strict';
/* STICK MAYHEM — áudio sintetizado (WebAudio), sem arquivos externos */
const SFX = (() => {
  let ctx = null, master, mG, sG, nbuf, budget = 0, duckV = 1;
  const S = {music: 0.6, sfx: 0.8, muted: false};
  const M = {mode: 'none', step: 0, next: 0, timer: null, inten: 0};
  setInterval(() => { budget = 0; }, 100);

  function init() {
    if (ctx) return true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      master = ctx.createGain(); mG = ctx.createGain(); sG = ctx.createGain();
      mG.connect(master); sG.connect(master); master.connect(comp); comp.connect(ctx.destination);
      nbuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = nbuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      apply();
      return true;
    } catch (e) { ctx = null; return false; }
  }
  function resume() { init(); if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {}); }
  function apply() {
    if (!ctx) return;
    master.gain.value = S.muted ? 0 : 1;
    mG.gain.value = S.music * 0.45 * duckV;
    sG.gain.value = S.sfx;
  }
  function tone(f, d, type, v, slide, delay, dest) {
    if (!ctx) return;
    const t = ctx.currentTime + (delay || 0);
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f + slide), t + d);
    g.gain.setValueAtTime(v || 0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + d);
    o.connect(g); g.connect(dest || sG);
    o.start(t); o.stop(t + d + 0.03);
  }
  function nz(d, v, freq, type, slide, delay, dest) {
    if (!ctx) return;
    const t = ctx.currentTime + (delay || 0);
    const s = ctx.createBufferSource(); s.buffer = nbuf; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = type || 'lowpass';
    f.frequency.setValueAtTime(freq || 2000, t);
    if (slide) f.frequency.exponentialRampToValueAtTime(Math.max(60, (freq || 2000) + slide), t + d);
    const g = ctx.createGain();
    g.gain.setValueAtTime(v || 0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + d);
    s.connect(f); f.connect(g); g.connect(dest || sG);
    s.start(t); s.stop(t + d + 0.03);
  }
  const SND = {
    jump() { tone(280, .15, 'square', .1, 380); },
    land() { nz(.06, .12, 600); },
    pickup() { tone(660, .08, 'triangle', .18); tone(990, .12, 'triangle', .18, 0, .07); },
    slash() { nz(.14, .22, 3000, 'bandpass', -2000); },
    punch() { tone(120, .08, 'sine', .3, -60); nz(.05, .15, 800); },
    thud() { tone(70, .35, 'sine', .6, -40); nz(.25, .4, 300); },
    hit() { nz(.08, .3, 1500, 'bandpass'); tone(200, .07, 'square', .12, -120); },
    pistol() { nz(.12, .35, 2500, 'bandpass', -1800); tone(500, .1, 'square', .1, -380); },
    revolver() { nz(.22, .5, 1800, 'bandpass', -1400); tone(260, .2, 'sawtooth', .2, -200); },
    smg() { nz(.05, .22, 3000, 'bandpass'); tone(420, .04, 'square', .08, -200); },
    rifle() { nz(.3, .45, 1600, 'bandpass', -1200); tone(180, .25, 'sawtooth', .2, -120); },
    shotgun() { nz(.4, .7, 900, 'lowpass', -600); tone(90, .3, 'square', .3, -50); },
    bow() { tone(240, .2, 'triangle', .2, -140); nz(.1, .1, 2000); },
    crossbow() { tone(150, .18, 'sawtooth', .2, -80); nz(.08, .2, 1800); },
    rocket() { nz(.5, .4, 800, 'lowpass', -500); tone(100, .4, 'sawtooth', .2, 60); },
    explosion() { nz(.7, .8, 500, 'lowpass', -400); tone(60, .5, 'sine', .7, -35); },
    orb() { tone(700, .25, 'sawtooth', .15, -500); tone(1400, .18, 'sine', .1, -900); },
    laser() { tone(1800, .3, 'sawtooth', .12, -1400); },
    throw() { nz(.15, .15, 1200, 'bandpass'); },
    beep() { tone(1200, .05, 'square', .1); },
    die() { tone(400, .5, 'sawtooth', .2, -350); nz(.3, .3, 600); },
    win() { [523, 659, 784, 1046].forEach((f, i) => tone(f, .25, 'square', .14, 0, i * .12)); },
    lose() { [440, 370, 311, 220].forEach((f, i) => tone(f, .3, 'sawtooth', .12, 0, i * .15)); },
    click() { tone(800, .04, 'square', .08); },
    select() { tone(520, .07, 'square', .1); tone(780, .08, 'square', .1, 0, .06); },
    count() { tone(660, .12, 'square', .14); },
    go() { tone(990, .3, 'square', .2, 300); },
    spawn() { tone(300, .3, 'sine', .15, 600); },
    dash() { nz(.2, .3, 2500, 'bandpass', -1800); tone(250, .2, 'sawtooth', .1, 300); },
    break() { nz(.2, .4, 1200); tone(900, .1, 'square', .08, -500); },
    zap() { nz(.3, .2, 4000, 'highpass'); },
    // ---- AWAKENING ----
    awk_ready() { [660, 880, 1320, 1760].forEach((f, i) => tone(f, .22, 'triangle', .16, 0, i * .07)); tone(220, .5, 'sine', .18, 220); },
    awk_void_charge() { tone(50, 1.0, 'sawtooth', .22, 260); tone(80, 1.0, 'sine', .3, 200); nz(1.0, .22, 200, 'bandpass', 1800); tone(900, .9, 'triangle', .05, -700, .1); },
    awk_void_dash() { nz(.3, .45, 1200, 'bandpass', 3800); tone(160, .3, 'sawtooth', .22, 900); },
    awk_void_hit() { tone(55, .9, 'sine', .8, -30); nz(.8, .7, 700, 'lowpass', -500); tone(1200, .5, 'sawtooth', .16, -1000); tone(330, .7, 'square', .1, -250, .05); },
    awk_inferno_charge() { nz(.85, .3, 500, 'lowpass', 2500); tone(90, .85, 'sawtooth', .2, 300); [0, .2, .4, .6].forEach(d => tone(500 + d * 900, .12, 'square', .06, 300, d)); },
    awk_inferno_dash() { nz(.26, .45, 2200, 'bandpass', -1400); tone(300, .25, 'sawtooth', .2, 500); },
    awk_inferno_jab() { nz(.07, .4, 2500, 'bandpass'); tone(140, .12, 'square', .3, -90); tone(700, .08, 'sawtooth', .12, -400); },
    awk_inferno_boom() { nz(1.0, .9, 600, 'lowpass', -450); tone(48, .9, 'sine', .85, -25); tone(110, .5, 'sawtooth', .3, -80); nz(.4, .4, 3000, 'highpass'); },
    awk_celestial_charge() { [0, .15, .3, .45, .6, .75].forEach((d, i) => tone(520 * Math.pow(1.19, i), .5, 'sine', .11, 0, d)); tone(130, 1.1, 'triangle', .16, 260); nz(1.1, .1, 4000, 'highpass'); },
    awk_celestial_ring() { tone(880, .5, 'sine', .18, 700); tone(1320, .6, 'triangle', .1, 900, .05); },
    awk_celestial_dash() { tone(2400, .17, 'sine', .14, -2000); nz(.18, .3, 3000, 'bandpass', -2000); },
    awk_celestial_hit() { nz(1.0, .75, 1500, 'bandpass', -1200); tone(70, .9, 'sine', .7, -40); [1046, 1568, 2093].forEach((f, i) => tone(f, .9, 'sine', .14, 0, i * .04)); tone(220, 1.1, 'triangle', .22, 180, .1); },
    awk_rage_charge() { nz(.85, .3, 400, 'lowpass', 2000); tone(70, .85, 'sawtooth', .22, 200); [0, .2, .4, .6].forEach(dd => tone(300 + dd * 600, .12, 'square', .06, 200, dd)); },
    awk_rage_roar() { nz(.6, .5, 500, 'lowpass', -300); tone(90, .6, 'sawtooth', .35, -40); tone(135, .55, 'square', .12, -50); },
    awk_rage_dash() { nz(.24, .45, 2000, 'bandpass', -1200); tone(260, .22, 'sawtooth', .2, 400); },
    awk_rage_claw() { nz(.08, .4, 3200, 'bandpass', -1500); tone(180, .1, 'square', .25, -100); },
    awk_rage_boom() { nz(1.0, .9, 500, 'lowpass', -400); tone(46, .9, 'sine', .85, -22); tone(120, .5, 'sawtooth', .3, -80); },
    awk_ascension_charge() { tone(60, 1.0, 'sine', .3, 300); nz(1.0, .2, 300, 'bandpass', 1500); tone(700, .9, 'triangle', .06, 500, .1); },
    awk_ascension_dash() { nz(.4, .45, 1800, 'bandpass', -1500); tone(900, .4, 'sawtooth', .2, -800); },
    awk_ascension_hit() { tone(50, 1.0, 'sine', .85, -25); nz(.9, .75, 600, 'lowpass', -450); tone(1100, .5, 'sawtooth', .16, -900); },
    awk_soul_charge() { nz(.7, .3, 3000, 'highpass'); tone(80, .7, 'sawtooth', .2, 250); [0, .15, .3, .45].forEach(dd => tone(900 + dd * 800, .06, 'square', .08, 0, dd)); },
    awk_soul_hop() { nz(.1, .35, 4000, 'bandpass', -2500); tone(1800, .1, 'sine', .12, -1400); },
    awk_soul_slash() { nz(.1, .4, 3000, 'bandpass'); tone(260, .12, 'square', .2, -150); },
    awk_soul_bolt() { nz(.9, .9, 2500, 'bandpass', -2000); tone(48, 1.0, 'sine', .8, -20); tone(1500, .2, 'sawtooth', .2, -1300); nz(.5, .5, 5000, 'highpass'); },
    awk_emperor_charge() { [0, .2, .4, .6, .8].forEach((dd, i) => tone(660 + i * 150, .4, 'triangle', .08, 0, dd)); tone(90, 1.0, 'sine', .2, 150); nz(1.0, .1, 5000, 'highpass'); },
    awk_emperor_wave() { nz(.5, .5, 2200, 'bandpass', -1200); tone(400, .5, 'triangle', .15, -250); },
    awk_emperor_freeze() { tone(2200, .25, 'sine', .15, -1500); nz(.25, .4, 5000, 'highpass'); },
    awk_emperor_shatter() { nz(.9, .8, 3500, 'highpass'); tone(70, .7, 'sine', .6, -30); [1568, 2093, 2637].forEach((f, i) => tone(f, .5, 'triangle', .1, -600, i * .03)); },
    awk_breaker_charge() { [0, .18, .36, .54, .72, .9].forEach((dd, i) => tone(520 * Math.pow(1.19, i), .5, 'sine', .1, 0, dd)); tone(120, 1.2, 'triangle', .16, 260); },
    awk_breaker_wings() { tone(880, .5, 'sine', .18, 700); tone(1320, .6, 'triangle', .1, 900, .05); nz(.4, .2, 4000, 'highpass'); },
    awk_breaker_drop() { tone(2600, .3, 'sine', .14, -2300); nz(.3, .3, 3000, 'bandpass', -2200); },
    awk_breaker_hit() { nz(1.0, .8, 1500, 'bandpass', -1200); tone(64, 1.0, 'sine', .8, -30); [1046, 1568, 2093].forEach((f, i) => tone(f, .9, 'sine', .14, 0, i * .04)); },
    awk_overdrive_charge() { [0, .12, .24, .36, .48, .6].forEach((dd, i) => tone(400 * Math.pow(1.26, i), .3, 'square', .07, 0, dd)); tone(100, .8, 'sawtooth', .15, 250); },
    awk_overdrive_dash() { nz(.2, .45, 2600, 'bandpass', -1800); tone(500, .2, 'sawtooth', .18, 700); },
    awk_overdrive_hit() { nz(.12, .5, 2500, 'bandpass'); tone(120, .15, 'square', .3, -80); tone(900, .1, 'triangle', .1, 400); },
    awk_overdrive_stamp() { tone(55, .9, 'sine', .85, -25); nz(.8, .7, 900, 'lowpass', -600); [523, 659, 784, 1046].forEach((f, i) => tone(f, .6, 'square', .1, 0, i * .05)); },
    awk_end() { tone(400, .5, 'sine', .12, -250); },
    whip() { nz(.12, .35, 2600, 'highpass', 800); tone(900, .06, 'square', .1, -600); },
    saw() { tone(120, .12, 'sawtooth', .22, 40); nz(.1, .22, 1800, 'bandpass'); },
    boom() { tone(420, .25, 'sine', .16, 500); nz(.22, .15, 1200, 'bandpass', 600); },
    flame() { nz(.12, .3, 900, 'bandpass', -400); },
    zap() { tone(1800, .1, 'sawtooth', .12, -1400); nz(.08, .25, 4500, 'highpass'); tone(90, .12, 'square', .1); },
    // ---- FATALITY ----
    fat_stamp() { tone(70, .6, 'sawtooth', .4, -30); nz(.5, .5, 700, 'lowpass', -500); tone(220, .4, 'square', .2, -120, .05); },
    fat_button() { tone(330, .25, 'sawtooth', .22, 400); tone(660, .3, 'triangle', .18, 300, .08); nz(.3, .2, 2500, 'highpass'); },
    fat_punch() { tone(110, .12, 'sine', .5, -60); nz(.09, .35, 1200, 'bandpass'); tone(520, .05, 'square', .1, -300); },
    fat_mega() { tone(45, 1.0, 'sine', .9, -20); nz(.9, .8, 900, 'lowpass', -700); tone(900, .4, 'sawtooth', .2, -800); nz(.3, .4, 3500, 'highpass'); },
    fat_charge() { tone(80, 1.1, 'sawtooth', .18, 400); nz(1.1, .2, 400, 'bandpass', 2400); tone(300, 1.0, 'triangle', .08, 700, .1); },
    fat_rumble() { nz(.5, .35, 200, 'lowpass', -80); tone(55, .5, 'sine', .4, -10); },
    fat_thunder() { nz(1.4, 1.0, 3500, 'highpass', -3000); nz(1.4, .9, 500, 'lowpass', -400, .08); tone(40, 1.2, 'sine', .9, -10); tone(1800, .2, 'sawtooth', .2, -1500); },
    fat_zap() { nz(.2, .5, 4000, 'highpass'); tone(2000, .12, 'sawtooth', .16, -1700); tone(70, .3, 'sine', .4, -30); },
    fat_meteor() { nz(1.9, .5, 300, 'lowpass', 1800); tone(70, 1.9, 'sawtooth', .2, 260); tone(40, 1.9, 'sine', .4, 80); },
    fat_boom() { nz(1.3, 1.0, 600, 'lowpass', -480); tone(40, 1.2, 'sine', .95, -20); tone(100, .6, 'sawtooth', .35, -80); nz(.5, .5, 3500, 'highpass'); },
    fat_vanish() { nz(.4, .35, 2500, 'bandpass', -2000); tone(500, .4, 'sine', .15, -420); },
    fat_slash() { nz(.14, .5, 3200, 'highpass', 600); tone(1200, .1, 'sawtooth', .16, -900); tone(300, .18, 'square', .08, -150); },
    fat_grav() { tone(60, 1.6, 'sine', .5, 140); tone(90, 1.6, 'triangle', .3, 260); nz(1.5, .15, 300, 'bandpass', 900); },
    fat_slam() { tone(38, 1.0, 'sine', .95, -15); nz(.8, .9, 500, 'lowpass', -380); tone(180, .3, 'square', .25, -140); nz(.3, .4, 2500, 'highpass'); },
    fat_whoosh() { nz(.3, .5, 1500, 'bandpass', 3500); tone(260, .3, 'sawtooth', .16, 900); },
    fat_void() { tone(50, 2.4, 'sawtooth', .3, 200); tone(80, 2.4, 'sine', .35, 160); nz(2.4, .3, 200, 'bandpass', 2000); tone(900, 2.2, 'triangle', .06, -750, .2); },
    fat_god() { [0, .12, .24, .36, .48].forEach((d, i) => tone(330 * Math.pow(1.26, i), .9, 'triangle', .13, 0, d)); tone(55, 1.4, 'sine', .6, 60); nz(1.2, .3, 1500, 'bandpass', 2500); },
    winv_champion() { [392, 523, 659, 784].forEach((f, i) => tone(f, .3, 'square', .1, 0, i * .09)); tone(98, .5, 'sine', .3, 30); },
    winv_shadow() { nz(.7, .3, 400, 'lowpass', -300); tone(110, .8, 'sawtooth', .12, -60); },
    winv_thunder() { nz(.6, .5, 900, 'lowpass', -600); tone(60, .7, 'sine', .5, -20); },
    winv_thunder_hit() { nz(.45, .6, 2500, 'bandpass', -1800); tone(55, .5, 'sine', .5, -20); tone(1500, .1, 'sawtooth', .1, -1200); },
    winv_cosmic() { [523, 784, 1046, 1568].forEach((f, i) => tone(f, .7, 'sine', .09, 0, i * .12)); tone(130, 1.0, 'triangle', .1, 60); },
    winv_spin() { nz(.4, .3, 2500, 'bandpass', 1500); tone(300, .35, 'sawtooth', .12, 600); },
    winv_spin_tick() { nz(.12, .18, 3000, 'bandpass', 800); },
    winv_burst() { tone(200, .3, 'sawtooth', .15, 600); },
    winv_burst_hit() { tone(70, .5, 'sine', .45, -30); nz(.4, .35, 1800, 'bandpass', -1200); tone(880, .3, 'triangle', .1, 600); },
    winv_royal() { [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, .45, 'triangle', .12, 0, i * .11)); },
    winv_mayhem() { tone(330, .12, 'square', .1, 200); tone(660, .1, 'triangle', .08, 0, .05); },
    fat_win() { [392, 523, 659, 784, 1046].forEach((f, i) => tone(f, .35, 'square', .12, 0, i * .1)); tone(130, .8, 'sine', .3, 40); },
    buy() { tone(880, .1, 'triangle', .2); tone(1320, .2, 'triangle', .2, 0, .08); },
  };
  function play(n) {
    if (!ctx || S.muted || S.sfx <= 0) return;
    if (budget > 12 && n.slice(0, 4) !== 'awk_' && n.slice(0, 4) !== 'fat_') return;
    budget++;
    const f = SND[n]; if (f) try { f(); } catch (e) {}
  }

  // --- música: sequenciador de passos
  const BASS = [0, -1, 0, -1, 3, -1, 0, -1, 0, -1, 5, -1, 3, -1, 7, -1];
  const ROOT = [0, 0, -2, -4];
  const SCALE = [0, 3, 5, 7, 10];
  const fr = (semi, base) => (base || 55) * Math.pow(2, semi / 12);
  function playStep(s, t) {
    const st = s % 16, bar = (s >> 4) & 3, battle = M.mode === 'battle';
    const dt = t - ctx.currentTime;
    if (st % 4 === 0) tone(150, .18, 'sine', .5, -110, dt, mG);
    if (battle && (st === 4 || st === 12)) nz(.12, .25, 1800, 'bandpass', 0, dt, mG);
    if (battle ? st % 2 === 0 : st % 4 === 2) nz(.04, .08, 7000, 'highpass', 0, dt, mG);
    const b = BASS[st];
    if (b >= 0) tone(fr(b + ROOT[bar]), .18, 'sawtooth', .18, 0, dt, mG);
    if (battle ? M.inten > 0.25 : st % 2 === 0) {
      const n = SCALE[(st * 3 + bar * 2) % 5] + 24 + ROOT[bar];
      tone(fr(n), .1, 'square', battle ? .05 : .035, 0, dt, mG);
    }
    if (st === 0) tone(fr(12 + ROOT[bar]), 1.4, 'triangle', .06, 0, dt, mG);
  }
  function sched() {
    if (!ctx || M.mode === 'none') return;
    while (M.next < ctx.currentTime + 0.18) {
      playStep(M.step, M.next);
      const bpm = M.mode === 'menu' ? 104 : 136 + M.inten * 16;
      M.next += 60 / bpm / 4;
      M.step = (M.step + 1) % 64;
    }
  }
  function music(mode) {
    if (!init()) return;
    if (M.mode === mode) return;
    M.mode = mode; M.step = 0; M.inten = 0;
    M.next = ctx.currentTime + 0.1;
    if (!M.timer) M.timer = setInterval(sched, 30);
  }
  return {
    S, init, resume, apply, play, music,
    stopMusic() { M.mode = 'none'; },
    setIntensity(x) { M.inten = Math.max(0, Math.min(1, x)); },
    duck(on) { duckV = on ? 0.25 : 1; apply(); },
    get ready() { return !!ctx; },
  };
})();

'use strict';
/* STICK MAYHEM — motor: física ragdoll (verlet), lutadores, armas, projéteis, partida */
const DT = 1 / 120;
const HEAD = 0, CHEST = 1, HIP = 2, ELL = 3, HDL = 4, ELR = 5, HDR = 6, KNL = 7, FTL = 8, KNR = 9, FTR = 10;
const PR = [11, 7, 8, 4, 5, 4, 5, 5, 5, 5, 5];
const BW = 22, BH = 104;
const CONS = [
  [HEAD, CHEST, 22, 1], [CHEST, HIP, 30, 1], [CHEST, ELL, 18, 1], [ELL, HDL, 18, 1], [CHEST, ELR, 18, 1], [ELR, HDR, 18, 1],
  [HIP, KNL, 22, 1], [KNL, FTL, 22, 1], [HIP, KNR, 22, 1], [KNR, FTR, 22, 1],
  [HEAD, HIP, 50, 0.16], [CHEST, KNL, 30, 0.5, 1], [CHEST, KNR, 30, 0.5, 1],
];

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const easeO = t => 1 - (1 - t) * (1 - t);
const easeI = t => t * t;
const sgn = v => v < 0 ? -1 : 1;

function segCircle(ax, ay, bx, by, cx, cy, r) {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
  let t = l2 ? ((cx - ax) * dx + (cy - ay) * dy) / l2 : 0;
  t = clamp(t, 0, 1);
  const px = ax + dx * t - cx, py = ay + dy * t - cy;
  return px * px + py * py <= r * r;
}
// devolve t de entrada (0..1) ou -1
function segRect(ax, ay, bx, by, rx, ry, rw, rh) {
  let t0 = 0, t1 = 1;
  const dx = bx - ax, dy = by - ay;
  const p = [-dx, dx, -dy, dy], q = [ax - rx, rx + rw - ax, ay - ry, ry + rh - ay];
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) { if (q[i] < 0) return -1; }
    else {
      const t = q[i] / p[i];
      if (p[i] < 0) { if (t > t1) return -1; if (t > t0) t0 = t; }
      else { if (t < t0) return -1; if (t < t1) t1 = t; }
    }
  }
  return t0;
}
function newInput() { return {mx: 0, my: 0, face: 0, aimX: 0, aimY: 0, jumpP: false, jumpH: false, atkH: false, spP: false, dropP: false, awkP: false}; }

// IK de 2 ossos
const _o = {ex: 0, ey: 0, hx: 0, hy: 0};
function ik(ax, ay, bx, by, l1, l2, side, o) {
  let dx = bx - ax, dy = by - ay, d = Math.sqrt(dx * dx + dy * dy) || 0.001;
  const maxd = l1 + l2 - 0.5;
  if (d > maxd) { bx = ax + dx / d * maxd; by = ay + dy / d * maxd; dx = bx - ax; dy = by - ay; d = maxd; }
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const mx = ax + dx / d * a, my = ay + dy / d * a;
  o.ex = mx - dy / d * h * side; o.ey = my + dx / d * h * side; o.hx = bx; o.hy = by;
}

// ---------- movimento de caixa (lutadores e itens) ----------
function moveBody(m, b, dt, drop) {
  const plats = m.plats, hw = b.w / 2;
  b.grounded = false; b.plat = null; b.wall = 0;
  b.x += b.vx * dt;
  for (let i = 0; i < plats.length; i++) {
    const p = plats[i];
    if (!p.solid) continue;
    if (b.x + hw > p.x && b.x - hw < p.x + p.w && b.y > p.y && b.y - b.h < p.y + p.h) {
      if (b.y - p.y <= 6 && b.vy >= 0) continue;
      const pl = (b.x + hw) - p.x, pr = (p.x + p.w) - (b.x - hw);
      if (pl < pr) { b.x = p.x - hw; b.wall = 1; } else { b.x = p.x + p.w + hw; b.wall = -1; }
      b.vx = b.bounce ? -b.vx * b.bounce : 0;
    }
  }
  const pb = b.y;
  b.y += b.vy * dt;
  for (let i = 0; i < plats.length; i++) {
    const p = plats[i];
    if (!(b.x + hw > p.x && b.x - hw < p.x + p.w)) continue;
    if (p.solid) {
      if (b.y > p.y && b.y - b.h < p.y + p.h) {
        const margin = 6 + Math.max(0, p.dy || 0);
        if (pb <= p.y + margin && b.vy >= 0) {
          b.y = p.y; b.vy = (b.bounce && b.vy > 140) ? -b.vy * b.bounce : 0; b.grounded = true; b.plat = p;
        } else if (b.vy < 0 && pb - b.h >= p.y + p.h - 8) {
          b.y = p.y + p.h + b.h; b.vy = b.bounce ? -b.vy * b.bounce : 0;
        } else if (pb - b.h < p.y + p.h - 8 && pb > p.y + margin) {
          // embutido lateralmente: empurra para o lado mais próximo
          const pl = (b.x + hw) - p.x, pr = (p.x + p.w) - (b.x - hw);
          if (pl < pr) { b.x = p.x - hw; b.wall = 1; } else { b.x = p.x + p.w + hw; b.wall = -1; }
        }
      }
    } else if (!drop && b.vy >= 0 && pb <= p.y + 4 + Math.max(0, p.dy || 0) && b.y >= p.y) {
      b.y = p.y; b.vy = (b.bounce && b.vy > 140) ? -b.vy * b.bounce : 0; b.grounded = true; b.plat = p;
    }
  }
}

// ---------- partículas ----------
class FX {
  constructor() {
    this.max = 420; this.pool = []; this.i = 0;
    for (let k = 0; k < 700; k++) this.pool.push({l: 0, L: 1, x: 0, y: 0, vx: 0, vy: 0, s: 2, c: '#fff', g: 0, k: 0});
    this.rings = []; this.texts = []; this.beams = []; this.shake = 0; this.flash = 0; this.shakeOn = true;
  }
  add(x, y, vx, vy, l, s, c, g, k) {
    if (GFX.low && Math.random() < 0.55) return;
    const p = this.pool[this.i]; this.i = (this.i + 1) % this.max;
    p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.l = p.L = l; p.s = s; p.c = c; p.g = g || 0; p.k = k || 0;
  }
  burst(x, y, n, spd, l, s, c, g, k, ang, spr) {
    if (GFX.low) n = Math.ceil(n * 0.5);
    for (let i = 0; i < n; i++) {
      const a = (ang === undefined ? Math.random() * 6.283 : ang + (Math.random() - 0.5) * (spr || 1));
      const v = spd * (0.35 + Math.random() * 0.65);
      this.add(x, y, Math.cos(a) * v, Math.sin(a) * v, l * (0.6 + Math.random() * 0.4), s * (0.6 + Math.random() * 0.6), c, g, k);
    }
  }
  ring(x, y, R, l, c, w) { if (this.rings.length < (GFX.low ? 6 : 24)) this.rings.push({x, y, R, l, L: l, c, w: w || 4}); }
  text(x, y, s, c) { if (this.texts.length < (GFX.low ? 8 : 16)) this.texts.push({x, y, s, c, l: 0.8}); }
  beam(x1, y1, x2, y2, l, c) { if (this.beams.length < 8) this.beams.push({x1, y1, x2, y2, l, L: l, c}); }
  addShake(v) { if (this.shakeOn) this.shake = Math.min(18, this.shake + v); }
  update(dt) {
    for (let i = 0; i < this.max; i++) {
      const p = this.pool[i];
      if (p.l <= 0) continue;
      p.l -= dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.k === 1) { p.vx *= 0.97; p.vy *= 0.97; }
    }
    for (let i = this.rings.length - 1; i >= 0; i--) { this.rings[i].l -= dt; if (this.rings[i].l <= 0) this.rings.splice(i, 1); }
    for (let i = this.texts.length - 1; i >= 0; i--) { const t = this.texts[i]; t.l -= dt; t.y -= 40 * dt; if (t.l <= 0) this.texts.splice(i, 1); }
    for (let i = this.beams.length - 1; i >= 0; i--) { this.beams[i].l -= dt; if (this.beams[i].l <= 0) this.beams.splice(i, 1); }
    this.shake *= Math.pow(0.02, dt);
    if (this.flash > 0) this.flash -= dt;
  }
}

// ---------- Lutador ----------
function pelletA(base, i, n, w) {
  // leque regular para armas com vários projéteis de baixa dispersão (shuriken); aleatório nas demais
  if (w.proj === 'shuriken') return base + (i - (n - 1) / 2) * w.spread;
  return base + (Math.random() * 2 - 1) * (w.spread || 0);
}
class Fighter {
  constructor(m, o) {
    this.m = m; this.id = o.id; this.slot = o.slot; this.name = o.name; this.tag = o.tag || '';
    this.tcolor = o.tcolor || '#fff'; this.skin = o.skin; this.human = !!o.human; this.brain = null;
    this.input = o.input || newInput();
    this.maxhp = 100; this.hp = 100; this.lives = o.lives || 1; this.out = false; this.alive = true;
    this.w = BW; this.h = BH; this.bounce = 0;
    this.x = 0; this.y = 0; this.vx = 0; this.vy = 0; this.facing = 1; this.grounded = false; this.plat = null; this.wall = 0;
    this.pts = []; this.T = [];
    for (let i = 0; i < 11; i++) { this.pts.push({x: 0, y: 0, px: 0, py: 0}); this.T.push({x: 0, y: 0}); }
    this.kills = 0; this.deaths = 0; this.dmgDealt = 0; this.killWeapons = new Set(); this.elimTime = 0; this.surviveT = 0;
    this.phase = 0; this.celebrate = false; this.winAnim = 0; this.hopT = 0; this.celeT = 0;
    this.capeN = []; for (let i = 0; i < 7; i++) this.capeN.push({x: 0, y: 0, px: 0, py: 0});
    this.energy = 0; this.awk = null; this.awkLock = 0; this.chain = 0; this.chainT = -9; this.readyT = 0; this.dmgMul = 1;
    this.awkType = (o.skin && o.skin.awk) || 'void'; this.awkUses = 0;
    this.reset(o.spawn || {x: 640, y: 600}, true);
  }
  reset(sp, first) {
    this.x = sp.x; this.y = sp.y; this.vx = 0; this.vy = 0; this.hp = this.maxhp; this.alive = true;
    this.facing = this.x < WORLD_W / 2 ? 1 : -1;
    this.wp = null; this.ragdoll = false; this.stun = 0; this.hitstun = 0; this.invuln = first ? 0 : 2.2; this.flash = 0; this.poise = 0;
    this.atkT = -1; this.cd = 0; this.specialCd = 0; this.dashT = 0; this.charge = 0; this.beamT = 0; this.beamTick = 0; this.boomN = 0;
    this.emptyT = 0; this.coyote = 0; this.jbuf = 0; this.dropT = 0; this.airJumps = 1; this.landT = 0; this.throwT = 0; this.recoilT = 0;
    this.respawnT = 0; this.getUpT = 0; this.zapCd = 0; this.lastHit = null; this.hitSet = []; this.lunged = false; this.aimA = 0;
    this.wAng = -0.9; this.dashHit = []; this.deadT = 0; this.fell = false;
    this.pose(); for (let i = 0; i < 11; i++) { const p = this.pts[i], t = this.T[i]; p.x = p.px = t.x; p.y = p.py = t.y; }
    this.awk = null; this.awkLock = 0; if (first) { this.energy = 0; this.chain = 0; this.chainT = -9; }
    this.capeReset();
  }
  // ----- capa: tecido simplificado (verlet) com comprimento fixo => nunca estica
  capeReset() {
    const P = this.pts, c = this.capeN, ax = P[CHEST].x - this.facing * 5, ay = P[CHEST].y + 2;
    for (let i = 0; i < c.length; i++) { const n = c[i]; n.x = n.px = ax - this.facing * 1.5 * i; n.y = n.py = ay + i * 11; }
  }
  capeDef() { const d = CAPES[this.skin.cape]; return d || null; }
  capeKick(kx, ky) {
    const d = this.capeDef(); if (!d) return;
    const c = this.capeN, n = d.n;
    for (let i = 1; i < n; i++) { const k = i / n * 0.012; c[i].px -= clamp(kx * k, -3, 3); c[i].py -= clamp(ky * k, -3, 3); }
  }
  capeStep(dt) {
    const cd = this.capeDef(); if (!cd) return;
    const P = this.pts, c = this.capeN, N = cd.n, fx = this.facing, L = 11, rag = this.ragdoll || !this.alive;
    const ax = P[CHEST].x - fx * 5, ay = P[CHEST].y + 2;
    if (!(Math.abs(c[0].x - ax) < 80 && Math.abs(c[0].y - ay) < 80) || !isFinite(c[1].x)) { this.capeReset(); }
    if (this.capeFace !== fx) {                                    // virou: espelha a capa em vez de chicoteá-la por cima do corpo
      if (this.capeFace) for (let i = 1; i < N; i++) { const n = c[i]; n.x = 2 * c[0].x - n.x; n.px = 2 * c[0].x - n.px; }
      this.capeFace = fx;
    }
    c[0].x = c[0].px = ax; c[0].y = c[0].py = ay;
    const g = GRAV * 0.5 * dt * dt, damp = 0.982;
    for (let i = 1; i < N; i++) {
      const n = c[i];
      let vx = (n.x - n.px) * damp, vy = (n.y - n.py) * damp;
      vx = clamp(vx, -6, 6); vy = clamp(vy, -6, 6);
      n.px = n.x; n.py = n.y; n.x += vx; n.y += vy + g;
    }
    const plats = this.m.plats;
    for (let it = 0; it < 4; it++) {
      for (let i = 1; i < N; i++) {                               // não afunda em sólidos
        const n = c[i];
        for (let j = 0; j < plats.length; j++) {
          const p = plats[j]; if (!p.solid) continue;
          if (n.x > p.x && n.x < p.x + p.w && n.y > p.y && n.y < p.y + p.h) { n.y = p.y; }
        }
      }
      for (let i = 1; i < N; i++) {                               // comprimento rígido: sempre a última operação
        const a = c[i - 1], n = c[i];
        let dx = n.x - a.x, dy = n.y - a.y; const d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        n.x = a.x + dx / d * L; n.y = a.y + dy / d * L;
        if (!rag && (n.x - ax) * fx > 2) { n.x = ax + fx * 2; const e = n.y - a.y, h = Math.sqrt(Math.max(0, L * L - (n.x - a.x) * (n.x - a.x))); n.y = a.y + (e < 0 ? -h : h); }
      }
    }
  }
  wdef() { return this.wp ? WEAPONS[this.wp.id] : WEAPONS.fist; }
  get cx() { return this.ragdoll ? this.pts[HIP].x : this.x; }
  get cy() { return this.ragdoll ? this.pts[HIP].y : this.y - 50; }

  // ----- pose procedural (alvos dos 11 pontos)
  pose() {
    const T = this.T, fx = this.facing, t = this.m.time, sp = Math.abs(this.vx);
    const run = this.grounded ? clamp(sp / 260, 0, 1) : 0;
    const w = this.wdef();
    let hipY = this.y - 44 + (this.landT > 0 ? this.landT * 40 : 0) - Math.abs(Math.sin(this.phase)) * 3 * run;
    if (!this.grounded) hipY += 3;
    let lean = fx * run * 5;
    if (this.hitstun > 0) lean = -fx * 10;
    const u = this.atkT >= 0 ? this.atkT / w.swing : -1;
    if (u > 0.3 && u < 0.65 && w.type === 'melee') lean += fx * 9;
    const cel = this.celebrate;
    const hip = T[HIP], ch = T[CHEST], hd = T[HEAD];
    hip.x = this.x + (cel && this.winAnim === 2 ? Math.sin(t * 6) * 6 : 0); hip.y = hipY + (cel && this.winAnim === 2 ? Math.sin(t * 12) * 2 : 0);
    if (cel && this.winAnim === 7) hip.y -= 30 + Math.sin(t * 2.4) * 4;      // flutuar cósmico
    ch.x = hip.x + lean; ch.y = hip.y - 30;
    hd.x = ch.x + lean * 0.4 + fx * 2; hd.y = ch.y - 22;
    // pernas
    for (let i = 0; i < 2; i++) {
      const ph = this.phase + i * Math.PI;
      let fxp, fyp;
      if (this.grounded) {
        fxp = this.x + fx * (i ? 7 : -7) + fx * Math.sin(ph) * 20 * run;
        fyp = this.y - Math.max(0, Math.cos(ph)) * 13 * run;
      } else {
        const up = this.vy < 0;
        fxp = this.x + fx * (i ? 13 : -9); fyp = this.y - (i ? (up ? 16 : 4) : (up ? 22 : 10));
      }
      ik(hip.x, hip.y, fxp, fyp, 22, 22, -fx, _o);
      const k = T[i ? KNR : KNL], f = T[i ? FTR : FTL];
      k.x = _o.ex; k.y = _o.ey; f.x = _o.hx; f.y = _o.hy;
    }
    // braço de trás
    let bx = ch.x - fx * 4 - fx * Math.sin(this.phase) * 14 * run, by = ch.y + 30 - (this.grounded ? 0 : 12);
    // braço da frente
    let hx, hy, ang = -0.9;
    const dirx = a => fx * Math.cos(a), diry = a => Math.sin(a);
    if (cel) {
      const wa = this.winAnim;
      if (wa === 0) { hx = ch.x + fx * 12 + Math.sin(t * 10) * 10; hy = ch.y - 36; bx = ch.x - fx * 14; by = ch.y + 20; }
      else if (wa === 1) { hx = ch.x + fx * 20; hy = ch.y - 26 + Math.sin(t * 6) * 3; bx = ch.x - fx * 4; by = ch.y - 30 + Math.sin(t * 6 + 1) * 3; }
      else if (wa === 2) { hx = ch.x + fx * 16; hy = ch.y - 20 - Math.sin(t * 8) * 18; bx = ch.x - fx * 8; by = ch.y - 20 + Math.sin(t * 8) * 18; }
      else if (wa === 4) { hx = ch.x + fx * 14; hy = ch.y - 38 + Math.sin(t * 5) * 2; bx = ch.x - fx * 12; by = ch.y - 38 + Math.sin(t * 5 + 1) * 2; }
      else if (wa === 5) { hx = ch.x + fx * 12; hy = ch.y + 6; bx = ch.x - fx * 2; by = ch.y + 8; }
      else if (wa === 6) { hx = ch.x + fx * 6; hy = ch.y - 44 - Math.sin(t * 14) * 2; bx = ch.x - fx * 10; by = ch.y + 22; }
      else if (wa === 7) { hx = ch.x + fx * 26; hy = ch.y - 6 + Math.sin(t * 2) * 4; bx = ch.x - fx * 24; by = ch.y - 6 - Math.sin(t * 2) * 4; }
      else if (wa === 8) { hx = ch.x + fx * 20; hy = ch.y + 2; bx = ch.x - fx * 8; by = ch.y + 20; }
      else if (wa === 9) { const pu = (t % 2.2) < 0.5 ? 1 : 0; hx = ch.x + fx * (26 + pu * 6); hy = ch.y - 20 - pu * 8; bx = ch.x - fx * (26 + pu * 6); by = ch.y - 20 - pu * 8; }
      else if (wa === 10) { hx = ch.x + fx * 18 + Math.sin(t * 4) * 6; hy = ch.y - 30; bx = ch.x + fx * 4; by = ch.y + 2; }
      else if (wa === 11) { const s7 = Math.sin(t * 7); hx = ch.x + fx * 14; hy = ch.y - 38 + s7 * 8; bx = ch.x - fx * 14; by = ch.y - 38 - s7 * 8; }
      else { hx = ch.x + fx * 10; hy = ch.y - 38; bx = ch.x - fx * 10; by = ch.y - 38; }
      this.wAng = wa === 8 ? t * 14 : -0.9;
    } else if (w.type === 'melee') {
      if (this.atkT >= 0) {
        if (w.style === 'swing') {
          if (u < 0.3) ang = lerp(-0.6, -2.4, easeO(u / 0.3));
          else if (u < 0.62) ang = lerp(-2.4, 1.2, easeI((u - 0.3) / 0.32));
          else ang = lerp(1.2, -0.2, (u - 0.62) / 0.38);
          hx = ch.x + dirx(ang) * 30; hy = ch.y + diry(ang) * 30;
        } else if (w.style === 'thrust') {
          const e = u < 0.35 ? -easeO(u / 0.35) * 0.35 : (u < 0.6 ? lerp(-0.35, 1, (u - 0.35) / 0.25) : lerp(1, 0, (u - 0.6) / 0.4));
          ang = -0.03; hx = ch.x + fx * (14 + e * 24); hy = ch.y + 8;
        } else { // soco
          const e = u < 0.25 ? -(u / 0.25) * 0.3 : (u < 0.6 ? lerp(-0.3, 1, (u - 0.25) / 0.35) : lerp(1, 0, (u - 0.6) / 0.4));
          ang = 0; hx = ch.x + fx * (16 + e * 24); hy = ch.y + 6 - e * 2;
        }
      } else if (this.wp) {
        ang = -1.1 + Math.sin(t * 3) * 0.05 + run * Math.sin(this.phase * 2) * 0.2;
        hx = ch.x + fx * 20; hy = ch.y + 14;
      } else { hx = ch.x + fx * 8; hy = ch.y + 26; ang = 0; }
      this.wAng = ang;
      if (this.atkT >= 0 && w.style === 'swing' && this.wp && w.id === 'daggers') { bx = ch.x + fx * 16; by = ch.y + 12; }
    } else if (w.type === 'throw' || w.type === 'mine') {
      if (this.throwT > 0) { const k = 1 - this.throwT / 0.28; ang = lerp(-2.3, 0.5, k); hx = ch.x + dirx(ang) * 26; hy = ch.y + diry(ang) * 26; }
      else { ang = -0.4; hx = ch.x + fx * 18; hy = ch.y + 16; }
      this.wAng = ang;
    } else { // armas de fogo, arco, laser
      ang = this.aimA;
      const back = this.recoilT > 0 ? this.recoilT * 40 : 0;
      hx = ch.x + dirx(ang) * (28 - back); hy = ch.y + 4 + diry(ang) * (28 - back);
      if (w.charge) { const pull = this.charge * 20; bx = ch.x + dirx(ang) * (30 - pull); by = ch.y + 4 + diry(ang) * (30 - pull); }
      else if (w.id === 'rifle' || w.id === 'rocket' || w.id === 'shotgun' || w.id === 'smg' || w.id === 'crossbow') { bx = ch.x + dirx(ang) * 14; by = ch.y + 8 + diry(ang) * 14; }
      this.wAng = ang;
    }
    ik(ch.x, ch.y, bx, by, 18, 18, fx, _o); T[ELL].x = _o.ex; T[ELL].y = _o.ey; T[HDL].x = _o.hx; T[HDL].y = _o.hy;
    ik(ch.x, ch.y, hx, hy, 18, 18, fx, _o); T[ELR].x = _o.ex; T[ELR].y = _o.ey; T[HDR].x = _o.hx; T[HDR].y = _o.hy;
  }

  smoothPose(k) {
    const T = this.T, P = this.pts;
    for (let i = 0; i < 11; i++) {
      const rate = (i === HIP) ? 1 : (i === CHEST || i === HEAD) ? 0.42 : (i === HDR || i === ELR) ? 0.55 : 0.34;
      const a = this.getUpT > 0 ? 0.14 : rate * k;
      P[i].x += (T[i].x - P[i].x) * a; P[i].y += (T[i].y - P[i].y) * a;
      P[i].px = P[i].x - this.vx * DT; P[i].py = P[i].y - this.vy * DT;
    }
  }
  addImpulse(kx, ky, only) {
    for (let i = 0; i < 11; i++) {
      const k = (only === undefined || only === i) ? 1 : 0.35;
      this.pts[i].px -= kx * DT * k; this.pts[i].py -= ky * DT * k;
    }
  }
  toRagdoll(kx, ky, stun, hx, hy) {
    if (!this.ragdoll) {
      this.ragdoll = true;
      for (let i = 0; i < 11; i++) { const p = this.pts[i]; p.px = p.x - this.vx * DT; p.py = p.y - this.vy * DT; }
      if (this.atkT >= 0) { this.atkT = -1; }
      this.charge = 0; this.beamT = 0; this.dashT = 0; this.awk = null;
    }
    this.stun = Math.max(this.stun, stun);
    const hip = this.pts[HIP];
    const spin = clamp(kx / 700, -1.6, 1.6) * 90;
    for (let i = 0; i < 11; i++) {
      const p = this.pts[i], rx = p.x - hip.x, ry = p.y - hip.y;
      p.px -= (kx - ry * spin * 0.02) * DT; p.py -= (ky + rx * spin * 0.02) * DT;
    }
    if (hx !== undefined) {
      let bi = 1, bd = 1e9;
      for (let i = 0; i < 11; i++) { const d = (this.pts[i].x - hx) ** 2 + (this.pts[i].y - hy) ** 2; if (d < bd) { bd = d; bi = i; } }
      this.pts[bi].px -= kx * 0.25 * DT; this.pts[bi].py -= ky * 0.25 * DT;
    }
  }
  getUp() {
    const P = this.pts, hip = P[HIP];
    let fy = Math.max(P[FTL].y, P[FTR].y) + 4;
    this.x = hip.x; this.y = fy;
    this.vx = clamp((hip.x - hip.px) / DT, -500, 500); this.vy = clamp((hip.y - hip.py) / DT, -500, 700);
    this.ragdoll = false; this.getUpT = 0.25; this.hitstun = 0.18; this.atkT = -1; this.cd = 0.1; this.poise = 0;
    this.facing = (P[HEAD].x >= hip.x) ? 1 : -1;
    if (Math.abs(P[HEAD].x - hip.x) < 6) this.facing = this.input.mx < 0 ? -1 : 1;
    // desembutir de sólidos
    for (let k = 0; k < 20; k++) {
      let bad = false;
      for (const p of this.m.plats) {
        if (!p.solid) continue;
        if (this.x + 11 > p.x && this.x - 11 < p.x + p.w && this.y > p.y + 4 && this.y - BH < p.y + p.h) { bad = true; break; }
      }
      if (!bad) break;
      this.y -= 6;
    }
  }

  hurt(dmg, kx, ky, by, wid, hx, hy) {
    if (!this.alive || this.invuln > 0) return false;
    const m = this.m;
    if (wid !== 'awk') dmg *= by ? (by.dmgMul || 1) : (m.envMul || 1);
    if (this.awk) { dmg *= 0.5; kx *= 0.15; ky *= 0.15; }   // super armadura durante o AWAKENING
    const hp0 = this.hp;
    this.hp -= dmg; this.flash = 0.12; this.lastHit = {by, t: m.time, wid};
    if (by && by !== this && dmg > 0) by.gainEnergy(Math.min(dmg, Math.max(0, hp0)), this, wid);
    this.capeKick(kx, ky);
    if (by && by !== this) by.dmgDealt += dmg;
    if (hx !== undefined) { m.fx.burst(hx, hy, 6, 380, 0.3, 3, '#fff7c2', 600, 0); m.fx.burst(hx, hy, 3, 220, 0.4, 3, this.skin.color, 700, 2); }
    m.fx.text(this.cx + rnd(-10, 10), this.cy - 60, Math.round(dmg), '#fff');
    SFX.play('hit');
    const kmag = Math.hypot(kx, ky);
    this.poise += kmag * 0.45;
    if (this.hp <= 0) { this.die(kx, ky, by, wid); return true; }
    if (this.ragdoll) { this.toRagdoll(kx, ky, 0.5 + kmag / 2200, hx, hy); }
    else if (kmag > 560 || this.poise > 640 || (!this.grounded && kmag > 380)) {
      this.poise = 0; this.toRagdoll(kx, ky, clamp(0.4 + kmag / 1100, 0.5, 2.0), hx, hy);
    } else {
      this.hitstun = 0.16; this.vx += kx; this.vy += ky * 0.5;
      if (this.atkT >= 0 && kmag > 250) { this.atkT = -1; this.cd = 0.2; }
    }
    if (kmag > 600) { m.fx.addShake(kmag / 150); }
    if (kmag > 800) m.hitstop = Math.max(m.hitstop, 0.05);
    return true;
  }
  die(kx, ky, by, wid, cause) {
    if (!this.alive) return;
    const m = this.m;
    this.alive = false; this.hp = 0; this.lives--; this.deaths++; this.deadT = 0; this.elimTime = m.t; this.awk = null;
    let killer = by;
    if (!killer && this.lastHit && m.time - this.lastHit.t < 5) { killer = this.lastHit.by; wid = this.lastHit.wid; }
    if (killer && killer !== this) { killer.kills++; if (wid) killer.killWeapons.add(wid); m.onKill(killer, this, wid); }
    else m.onKill(null, this, null);
    this.dropWeapon(true);
    if (cause !== 'fall') this.toRagdoll(kx * 1.1, ky - 300, 99);
    else { if (!this.ragdoll) this.toRagdoll(0, 0, 99); }
    m.fx.burst(this.cx, this.cy, 18, 500, 0.7, 4, this.skin.color, 800, 2);
    m.fx.burst(this.cx, this.cy, 10, 420, 0.5, 3, '#fff', 0, 0);
    m.fx.ring(this.cx, this.cy, 90, 0.5, '#fff', 5);
    m.fx.addShake(9); m.hitstop = Math.max(m.hitstop, 0.08);
    SFX.play('die');
    if (this.lives > 0 && (m.cfg.format === 'stock' || m.cfg.mode === 'menu')) this.respawnT = m.cfg.mode === 'menu' ? 1.4 : 2.4;
    else { this.out = true; }
  }
  dropWeapon(toss, vx) {
    if (!this.wp) return;
    const m = this.m;
    m.addItem(this.wp.id, this.x, this.y - 70, (vx !== undefined ? vx : this.facing * 160) + rnd(-40, 40), -380, this.wp.ammo, this.wp.uses, 0.8);
    this.wp = null; this.charge = 0; this.beamT = 0; this.atkT = -1;
  }

  // ----- atualização
  update(dt) {
    const m = this.m, I = this.input;
    this.flash -= dt; this.invuln -= dt; this.hitstun -= dt; this.specialCd -= dt; this.cd -= dt; this.zapCd -= dt;
    this.recoilT -= dt; this.throwT -= dt; this.landT -= dt; this.getUpT -= dt; this.dropT -= dt; this.awkLock -= dt; this.readyT -= dt;
    if (m.fatMode) { this.fatBody(dt); return; }
    if (!this.alive) {
      this.deadT += dt; this.stepRagdoll(dt); this.capeStep(dt);
      if (this.respawnT > 0) { this.respawnT -= dt; if (this.respawnT <= 0) m.respawn(this); }
      this.checkBounds(); I.jumpP = I.spP = I.dropP = I.awkP = false; return;
    }
    this.surviveT += dt;
    if (this.ragdoll) {
      this.stepRagdoll(dt); this.capeStep(dt); this.stun -= dt;
      if (this.stun <= 0) { this.getUp(); }
      this.checkBounds(); I.jumpP = I.spP = I.dropP = I.awkP = false; return;
    }
    const frozen = m.frozen;
    if (I.awkP && this.canAwk()) this.startAwk();
    if (this.awk) { if (AWK2[this.awk.type]) this.updateAwk2(dt); else this.updateAwk(dt); I.jumpP = I.spP = I.dropP = I.awkP = false; return; }
    const mx = frozen ? 0 : I.mx;
    const stunned = this.hitstun > 0 || this.getUpT > 0;
    const w = this.wdef();
    // movimento
    if (this.plat && this.plat.move) { this.x += this.plat.dx; this.y += this.plat.dy; }
    const ice = this.plat && this.plat.ice;
    let maxS = 330 * ((this.atkT >= 0 && w.slow) ? w.slow : 1);
    if (this.wp && w.type === 'melee' && w.slow) maxS *= 0.92;
    if (this.dashT > 0) {
      this.dashT -= dt; this.vx = this.dashDir * 820; this.vy += GRAV * 0.35 * dt;
      this.dashFx(dt);
    } else {
      const target = (stunned || frozen) ? 0 : mx * maxS;
      const acc = this.grounded ? (ice ? 420 : 3000) : 1500;
      const dec = this.grounded ? (ice ? 260 : 3400) : 500;
      const rate = (Math.abs(target) > Math.abs(this.vx) || sgn(target) !== sgn(this.vx)) && target !== 0 ? acc : dec;
      if (this.vx < target) this.vx = Math.min(target, this.vx + rate * dt);
      else if (this.vx > target) this.vx = Math.max(target, this.vx - rate * dt);
      this.vy = Math.min(1500, this.vy + GRAV * dt);
    }
    // direção
    if (!stunned && !frozen && this.atkT < 0) {
      if (I.face) this.facing = I.face; else if ((I.aimX || I.aimY) && Math.abs(I.aimX) > 0.2) this.facing = I.aimX > 0 ? 1 : -1; else if (Math.abs(mx) > 0.25) this.facing = mx > 0 ? 1 : -1;
    }
    // pulo
    if (I.jumpP) this.jbuf = 0.14;
    this.jbuf -= dt; this.coyote -= dt;
    if (this.grounded) { this.coyote = 0.1; this.airJumps = 1; }
    if (!frozen && !stunned && this.dashT <= 0 && this.jbuf > 0) {
      if (I.my > 0.6 && this.plat && !this.plat.solid) { this.dropT = 0.28; this.vy = 120; this.jbuf = 0; this.grounded = false; this.plat = null; }
      else if (this.coyote > 0) { this.vy = -840; this.jbuf = 0; this.coyote = 0; this.grounded = false; this.plat = null; SFX.play('jump'); m.fx.burst(this.x, this.y, 5, 160, 0.3, 3, '#ffffff66', 0, 1, -1.57, 2.2); }
      else if (this.airJumps > 0) { this.vy = -720; this.airJumps--; this.jbuf = 0; SFX.play('jump'); m.fx.ring(this.x, this.y, 30, 0.25, '#fff', 3); }
    }
    if (!I.jumpH && this.vy < -330 && this.dashT <= 0) this.vy += GRAV * 0.9 * dt;
    // especial: investida
    if (I.spP && !frozen && !stunned && this.specialCd <= 0 && this.dashT <= 0) {
      this.dashT = 0.2; this.specialCd = 3.5; this.dashDir = Math.abs(mx) > 0.3 ? sgn(mx) : this.facing; this.facing = this.dashDir; this.dashHit.length = 0; this.atkT = -1;
      SFX.play('dash'); m.fx.ring(this.x, this.y - 50, 50, 0.3, this.skin.accent, 4);
    }
    if (this.dashT > 0) this.dashAttack();
    const wasG = this.grounded, vyb = this.vy;
    moveBody(m, this, dt, this.dropT > 0);
    if (this.grounded && !wasG && vyb > 500) { this.landT = 0.1; SFX.play('land'); m.fx.burst(this.x, this.y, 6, 180, 0.35, 3, '#ffffff66', 0, 1, -1.57, 2.6); }
    if (this.grounded) this.phase += Math.abs(this.vx) * dt * 0.034;
    else this.phase += dt * 4;
    // aim
    this.aimOn = !!(I.aimX || I.aimY);
    this.aimA = this.aimOn ? clamp(Math.atan2(I.aimY, Math.max(0.06, Math.abs(I.aimX))), -1.5, 1.5) : clamp(I.my * 0.75, -0.75, 0.75);
    // armas
    if (!frozen && !stunned) this.weaponLogic(dt, I, w);
    // pegar / largar
    if (!frozen) this.pickupLogic(I);
    // pose + suavização
    this.pose(); this.smoothPose(1);
    const P = this.pts;
    this.capeStep(dt);
    // efeitos de cosméticos
    if (this.skin.fx === 'sparks' && Math.random() < 0.15) m.fx.add(P[HIP].x, P[HIP].y, rnd(-60, 60), rnd(-120, -20), 0.5, 2.5, '#ffe066', 200, 0);
    // celebrar
    if (this.celebrate && (this.winAnim === 3 || this.winAnim === 11) && this.grounded) { this.hopT -= dt; if (this.hopT <= 0) { this.vy = -520; this.hopT = 0.7; if (this.winAnim === 11) SFX.play('winv_mayhem'); } }
    if (this.celebrate) {
      const t0 = this.celeT, t1 = this.celeT += dt, wa = this.winAnim, cr = per => Math.floor(t0 / per) !== Math.floor(t1 / per);
      if (t0 === 0 && wa >= 4) SFX.play('winv_' + WIN_IDS[wa]);
      if (wa === 6 && cr(1.7778)) SFX.play('winv_thunder_hit');
      else if (wa === 9 && cr(2.2)) SFX.play('winv_burst_hit');
      else if (wa === 8 && cr(0.45)) SFX.play('winv_spin_tick');
    } else this.celeT = 0;
    if (this.energy >= 85 && m.cfg.awk.on) this.readyFx();
    this.checkBounds();
    if (this.zapCd < 0) { }
    I.jumpP = I.spP = I.dropP = I.awkP = false;
  }
  dashFx(dt) {
    if (Math.random() < 0.7) this.m.fx.add(this.x - this.dashDir * 10, this.y - rnd(10, 90), -this.dashDir * 80, 0, 0.3, 4, this.skin.accent, 0, 1);
  }
  dashAttack() {
    const m = this.m;
    for (const e of m.fighters) {
      if (e === this || !e.alive || e.invuln > 0 || this.dashHit.indexOf(e) >= 0) continue;
      if (Math.abs(e.cx - this.x) < 34 && Math.abs(e.cy - (this.y - 50)) < 60) {
        this.dashHit.push(e);
        e.hurt(6, this.dashDir * 880, -400, this, 'dash', e.cx, e.cy);
        SFX.play('thud');
      }
    }
  }

  weaponLogic(dt, I, w) {
    const m = this.m, wp = this.wp;
    // ataque corpo a corpo / soco
    if (w.type === 'melee') {
      if (this.atkT < 0 && I.atkH && this.cd <= 0) { this.atkT = 0; this.hitSet.length = 0; this.lunged = false; SFX.play(wp ? w.snd : 'punch'); }
      if (this.atkT >= 0) {
        this.atkT += dt;
        const u = this.atkT / w.swing;
        if (u >= 0.3 && !this.lunged) { this.lunged = true; if (this.grounded) this.vx += this.facing * (w.id === 'spear' ? 160 : 120); }
        if (u >= 0.3 && u <= 0.7) this.meleeHit(w);
        if (this.atkT >= w.swing) { this.atkT = -1; this.cd = w.cd; }
      }
    } else if (w.type === 'gun' && w.charge) {
      if (wp.ammo > 0 && I.atkH && this.cd <= 0) { if (this.charge === 0) SFX.play('click'); this.charge = Math.min(1, this.charge + dt / 0.75); }
      else if (this.charge > 0) { if (this.charge > 0.15 && wp.ammo > 0) this.fireGun(w); this.charge = 0; this.cd = 0.25; }
    } else if (w.type === 'gun') {
      if (wp.ammo > 0 && I.atkH && this.cd <= 0 && !(w.proj === 'boomerang' && this.boomN > 0)) { this.fireGun(w); this.cd = w.cd; }
    } else if (w.type === 'beam') {
      if (wp.ammo > 0 && I.atkH && this.cd <= 0 && this.beamT <= 0) { this.beamT = w.dur; this.beamTick = 0; wp.ammo--; this.cd = w.cd; SFX.play('laser'); this.recoilT = 0.12; }
      if (this.beamT > 0) { this.beamT -= dt; this.beamTick -= dt; if (this.beamTick <= 0) { this.beamTick = w.tick; this.fireBeam(w); } }
    } else if (w.type === 'throw') {
      if (wp.ammo > 0 && I.atkH && this.cd <= 0) {
        wp.ammo--; this.cd = w.cd; this.throwT = 0.28; SFX.play('throw');
        const a = this.aimA - (this.aimOn ? 0.12 : 0.45), sp = 520;
        m.addGrenade(this.x + this.facing * 16, this.y - 85, this.facing * Math.cos(a) * sp + this.vx * 0.5, Math.sin(a) * sp, this, w.id);
      }
    } else if (w.type === 'mine') {
      if (wp.ammo > 0 && I.atkH && this.cd <= 0 && this.grounded) {
        wp.ammo--; this.cd = w.cd + 0.4; this.throwT = 0.2; SFX.play('beep');
        m.addMine(this.x + this.facing * 14, this.y, this);
      }
    }
    // arma vazia ou quebrada
    if (this.wp) {
      const ww = WEAPONS[this.wp.id];
      if (ww.type !== 'melee' && this.wp.ammo <= 0 && this.beamT <= 0 && this.atkT < 0) { this.emptyT += dt; if (this.emptyT > 0.5) { this.emptyT = 0; this.wp = null; m.fx.burst(this.x, this.y - 70, 6, 200, 0.4, 3, '#999', 500, 2); SFX.play('break'); } }
      else this.emptyT = 0;
    }
  }
  segOf(w) {
    const P = this.pts, h = P[HDR], fx = this.facing, a = this.wAng;
    let bx = h.x, by = h.y;
    const dx = fx * Math.cos(a), dy = Math.sin(a);
    if (w.id === 'fist') { bx = P[CHEST].x; by = P[CHEST].y + 6; return [bx, by, h.x + fx * 10, h.y]; }
    return [bx, by, bx + dx * w.len, by + dy * w.len];
  }
  meleeHit(w) {
    const m = this.m, sg = this.segOf(w);
    for (const e of m.fighters) {
      if (e === this || !e.alive || e.invuln > 0 || this.hitSet.indexOf(e) >= 0) continue;
      const hit = e.hitBySeg(sg[0], sg[1], sg[2], sg[3]);
      if (!hit) continue;
      this.hitSet.push(e);
      const k = w.knock, up = w.upKnock || 0.3;
      e.hurt(w.dmg * (hit.head ? 1.25 : 1), this.facing * k, -k * up, this, w.id, hit.x, hit.y);
      SFX.play(w.id === 'fist' ? 'punch' : (w.snd === 'thud' ? 'thud' : 'hit'));
      m.fx.burst(hit.x, hit.y, 8, 450, 0.3, 3, '#ffe9a8', 0, 0, this.facing > 0 ? 0 : Math.PI, 2.4);
      if (w.id === 'fist' || !w.heavy) { }
      if (w.dmg >= 20) m.hitstop = Math.max(m.hitstop, 0.06);
      if (this.wp && w.id !== 'fist') { this.wp.uses--; if (this.wp.uses <= 0) { m.fx.burst(this.x, this.y - 70, 10, 300, 0.5, 3, w.color, 500, 2); SFX.play('break'); this.wp = null; this.atkT = -1; return; } }
    }
  }
  hitBySeg(ax, ay, bx, by) {
    const P = this.pts;
    const idx = [HEAD, CHEST, HIP, KNL, KNR, FTL, FTR, ELL, ELR];
    for (const i of idx) {
      const r = i === HEAD ? 14 : (i === CHEST || i === HIP) ? 14 : 9;
      if (segCircle(ax, ay, bx, by, P[i].x, P[i].y, r)) return {x: P[i].x, y: P[i].y, head: i === HEAD};
    }
    const mx = (P[CHEST].x + P[HIP].x) / 2, my = (P[CHEST].y + P[HIP].y) / 2;
    if (segCircle(ax, ay, bx, by, mx, my, 14)) return {x: mx, y: my, head: false};
    return null;
  }
  hitByCircle(px, py, qx, qy, r) {
    const P = this.pts;
    const idx = [HEAD, CHEST, HIP, KNL, KNR, FTL, FTR];
    for (const i of idx) {
      const rr = (i === HEAD ? 13 : (i === CHEST || i === HIP) ? 13 : 8) + r;
      if (segCircle(px, py, qx, qy, P[i].x, P[i].y, rr)) return {x: P[i].x, y: P[i].y, head: i === HEAD};
    }
    return null;
  }
  muzzle(w) {
    const h = this.pts[HDR], dx = this.facing * Math.cos(this.aimA), dy = Math.sin(this.aimA);
    return {x: h.x + dx * (w.muzzle || 30) * 0.7, y: h.y + dy * (w.muzzle || 30) * 0.7, dx, dy};
  }
  fireGun(w) {
    const m = this.m, wp = this.wp, mz = this.muzzle(w);
    const base = Math.atan2(mz.dy, mz.dx);
    const n = w.pellets || 1;
    let dmg = w.dmg, sp = w.speed;
    if (w.charge) { dmg = lerp(w.dmgMin, w.dmgMax, this.charge); sp = lerp(w.speedMin, w.speedMax, this.charge); }
    if (w.proj === 'boomerang') {
      this.boomN++;
      m.addProj({kind: 'boomerang', x: mz.x, y: mz.y, vx: mz.dx * w.speed, vy: mz.dy * w.speed, dx: mz.dx, dy: mz.dy, sp0: w.speed, life: w.life, age: 0, back: false, dmg: w.dmg, knock: w.knock, owner: this, wid: w.id, rot: 0, hit: [], ret: 0});
      wp.ammo--; this.recoilT = 0.1; SFX.play(w.snd); return;
    }
    for (let i = 0; i < n; i++) {
      const a = pelletA(base, i, n, w);
      const s = sp * (n > 1 ? rnd(0.9, 1.1) : 1);
      m.addProj({kind: w.proj, x: mz.x, y: mz.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: w.life || 1, dmg, knock: w.knock, owner: this, wid: w.id,
        grav: w.grav || 0, exp: w.expR ? {r: w.expR, dmg: w.expDmg} : null});
    }
    wp.ammo--;
    this.recoilT = 0.12;
    if (this.grounded) this.vx -= mz.dx * (w.recoil || 0) * 0.5; else this.vx -= mz.dx * (w.recoil || 0) * 0.2;
    if (w.cd > 0.1) m.fx.burst(mz.x, mz.y, 5, 380, 0.15, 3, '#ffe9a8', 0, 0, base, 0.7);
    if (w.proj === 'bullet') m.fx.add(this.x, this.y - 70, -this.facing * 60, -200, 0.5, 3, '#fbbf24', 1200, 2);
    if (w.cd > 0.1 || Math.random() < 0.25) SFX.play(w.snd);
  }
  fireBeam(w) {
    const m = this.m, mz = this.muzzle(w);
    let ex = mz.x + mz.dx * w.len, ey = mz.y + mz.dy * w.len;
    let tmin = 1;
    for (const p of m.plats) { if (!p.solid) continue; const t = segRect(mz.x, mz.y, ex, ey, p.x, p.y, p.w, p.h); if (t >= 0 && t < tmin) tmin = t; }
    ex = mz.x + (ex - mz.x) * tmin; ey = mz.y + (ey - mz.y) * tmin;
    m.fx.beam(mz.x, mz.y, ex, ey, 0.09, w.color);
    m.fx.burst(ex, ey, 2, 250, 0.2, 2, w.color2, 0, 0);
    for (const e of m.fighters) {
      if (e === this || !e.alive || e.invuln > 0) continue;
      const h = e.hitBySeg(mz.x, mz.y, ex, ey);
      if (h) e.hurt(w.dmg, mz.dx * w.knock, -w.knock * 0.4 - 40, this, w.id, h.x, h.y);
    }
  }

  pickupLogic(I) {
    const m = this.m;
    if (I.dropP) {
      let near = null;
      for (const it of m.items) if (it.noPick <= 0 && Math.abs(it.x - this.x) < 44 && it.y > this.y - BH - 10 && it.y < this.y + 20) { near = it; break; }
      if (this.wp && near) { const mine = this.wp; this.wp = null; this.takeItem(near); m.addItem(mine.id, this.x, this.y - 70, -this.facing * 120, -300, mine.ammo, mine.uses, 0.7); }
      else if (this.wp) this.dropWeapon(true);
      else if (near) this.takeItem(near);
      return;
    }
    if (!this.wp) {
      for (const it of m.items) {
        if (it.noPick > 0) continue;
        if (Math.abs(it.x - this.x) < 38 && it.y > this.y - BH - 12 && it.y < this.y + 22) { this.takeItem(it); break; }
      }
    }
  }
  takeItem(it) {
    this.wp = {id: it.id, ammo: it.ammo, uses: it.uses};
    it.dead = true; this.atkT = -1; this.charge = 0;
    SFX.play('pickup');
    this.m.fx.ring(it.x, it.y, 36, 0.3, WEAPONS[it.id].color, 3);
    this.m.fx.burst(it.x, it.y, 8, 260, 0.4, 3, WEAPONS[it.id].color, 0, 0);
  }

  // ----- ragdoll verlet
  stepRagdoll(dt) {
    const P = this.pts, g = GRAV * dt * dt, damp = 0.9985;
    for (let i = 0; i < 11; i++) {
      const p = P[i];
      const vx = (p.x - p.px) * damp, vy = (p.y - p.py) * damp;
      p.px = p.x; p.py = p.y; p.x += vx; p.y += vy + g;
    }
    for (let it = 0; it < 6; it++) {
      for (let c = 0; c < CONS.length; c++) {
        const k = CONS[c], a = P[k[0]], b = P[k[1]];
        let dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        if (k[4] && d >= k[2]) continue;
        const diff = (d - k[2]) / d * 0.5 * k[3];
        a.x += dx * diff; a.y += dy * diff; b.x -= dx * diff; b.y -= dy * diff;
      }
      this.ragCollide();
    }
  }
  ragCollide() {
    const P = this.pts, plats = this.m.plats;
    for (let i = 0; i < 11; i++) {
      const p = P[i], r = PR[i];
      for (let j = 0; j < plats.length; j++) {
        const pl = plats[j], fr = pl.ice ? 0.995 : 0.82;
        if (pl.solid) {
          const x0 = pl.x - r, x1 = pl.x + pl.w + r, y0 = pl.y - r, y1 = pl.y + pl.h + r;
          if (p.x > x0 && p.x < x1 && p.y > y0 && p.y < y1) {
            const dl = p.x - x0, dr = x1 - p.x, du = p.y - y0, dd = y1 - p.y, mn = Math.min(dl, dr, du, dd);
            if (mn === du) { const v = p.y - p.py; p.y = y0; p.py = p.y + v * 0.12; p.px = p.x - (p.x - p.px) * fr; if (pl.move) { p.x += pl.dx; p.px += pl.dx; p.y += pl.dy; p.py += pl.dy; } }
            else if (mn === dd) { const v = p.y - p.py; p.y = y1; p.py = p.y + v * 0.2; }
            else if (mn === dl) { const v = p.x - p.px; p.x = x0; p.px = p.x + v * 0.3; }
            else { const v = p.x - p.px; p.x = x1; p.px = p.x + v * 0.3; }
          }
        } else if (p.x > pl.x - 2 && p.x < pl.x + pl.w + 2 && p.y > pl.y - r && p.py <= pl.y - r + 4 + Math.max(0, pl.dy || 0)) {
          const v = p.y - p.py; p.y = pl.y - r; p.py = p.y + v * 0.1; p.px = p.x - (p.x - p.px) * fr;
          if (pl.move) { p.x += pl.dx; p.px += pl.dx; p.y += pl.dy; p.py += pl.dy; }
        }
      }
    }
  }
  checkBounds() {
    if (!this.alive) return;
    const m = this.m, a = m.arena, hx = this.cx, hy = this.ragdoll ? this.pts[HIP].y : this.y;
    if (hy > a.killY || hx < -170 || hx > WORLD_W + 170 || hy < -900) {
      const lava = a.lavaY && hy > a.lavaY - 10;
      if (lava) { m.fx.burst(hx, a.lavaY, 24, 500, 0.8, 5, '#ff7a1a', 600, 0, -1.57, 1.6); m.fx.ring(hx, a.lavaY, 90, 0.5, '#ff7a1a', 6); }
      this.fell = true;
      this.die(0, 0, null, null, 'fall');
    }
  }
}

function shadeHex(h) { const n = parseInt(h.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; const f = v => Math.max(0, Math.min(255, Math.round(v * 0.72))); return '#' + ((1 << 24) | (f(r) << 16) | (f(g) << 8) | f(b)).toString(16).slice(1); }
// ---------- Partida ----------
class Match {
  constructor(cfg, env) {
    env = env || {};
    cfg.awk = cfg.awk || {on: false, charge: 'normal', dmg: 'normal'};
    this.cfg = cfg; this.env = env; this.arena = ARENAS[cfg.arena] || ARENAS.neon;
    this.envMul = (cfg.hp || 100) >= 200 ? AWK.weaponMul : 1;
    this.cine = {dim: 0, tDim: 0, flash: 0, flashC: '#fff', zoom: 1, tZoom: 1, zp: 0, zx: 640, zy: 360, cx: 640, cy: 360, light: 0, tLight: 0, lightC: '#fff', dist: 0, tDist: 0, dx: 0, dy: 0, dr: 240, dtype: 0, kick: 0, rot: 0, shocks: [], beams: [], camFx: cfg.camFx !== false};
    this.plats = this.arena.plats.map(p => { const q = Object.assign({}, p); q.bx = p.x; q.by = p.y; q.dx = 0; q.dy = 0; return q; });
    this.fx = new FX(); this.fx.shakeOn = env.shake !== false;
    this.fx.max = env.fxMax || 420;
    this.items = []; this.projs = []; this.fighters = []; this.bombs = []; this.mines = [];
    this.time = 0; this.t = 0; this.hitstop = 0; this.timeScale = 1;
    this.ended = false; this.endT = 0; this.result = null; this.cdT = 3; this.goT = 0; this.lastN = 4; this.frozen = true;
    this.spawnT = 1.2; this.recentX = []; this.fireT = 2; this.killFeed = [];
    this.state = 'countdown';
    this.buildFighters();
    const training = this.arena.training;
    const chaosLike = cfg.mode === 'chaos' || cfg.mode === 'online';
    this.maxItems = cfg.weapons === false ? 0 : (chaosLike ? 6 : 4);
    this.spawnMin = training ? 2 : (chaosLike ? 2.2 : 3.5); this.spawnMax = training ? 4 : (chaosLike ? 4.5 : 6.5);
    if (cfg.mode === 'menu') { this.state = 'play'; this.frozen = false; this.cdT = 0; this.spawnMin = 2; this.spawnMax = 4; }
    this.fatMode = cfg.mode === 'fatality'; this.fat = null;
    if (cfg.mode === 'preview' || cfg.mode === 'awkprev' || this.fatMode) { this.state = 'play'; this.frozen = false; this.cdT = 0; }
    if (env.netClient) this.frozen = true;
    else if (cfg.mode !== 'preview' && cfg.mode !== 'awkprev' && !this.fatMode) for (let i = 0; i < 2; i++) this.spawnWeapon();
  }
  buildFighters() {
    const cfg = this.cfg, env = this.env, sp = this.arena.spawns, inp = env.inputs || [newInput(), newInput()];
    const mkAI = (f, pers, d) => { f.brain = new Brain(f, pers, d); };
    const mine = env.skin || Object.assign({}, ENEMY_SKINS[0], {color: '#3b82f6'});
    const enemySkins = ENEMY_SKINS.map(s => Object.assign({}, s));
    for (const s of enemySkins) if (s.color.toLowerCase() === mine.color.toLowerCase()) s.color = '#e11d48';
    if (cfg.mode !== 'awkprev' && cfg.mode !== 'preview' && cfg.mode !== 'fatality') for (const s of enemySkins) if (Math.random() < 0.45) { // adversários às vezes usam skins prontas
      const ids = SKIN_IDS.filter(x => SKINS[x].preset && SKINS[x].preset.color.toLowerCase() !== mine.color.toLowerCase()), k = ids[(Math.random() * ids.length) | 0];
      Object.assign(s, {style: SKINS[k].style || ''}, SKINS[k].preset);
    }
    const lives = cfg.format === 'stock' ? (cfg.lives || 3) : 1;
    let id = 0;
    const mk = (o) => {
      o.id = id++; const f = new Fighter(this, o);
      if (cfg.hp && cfg.mode !== 'chaos') { f.maxhp = f.hp = cfg.hp; if (cfg.hp >= 200) f.dmgMul = AWK.weaponMul; }
      this.fighters.push(f); return f;
    };
    if (cfg.mode === 'duel_cpu') {
      mk({slot: 0, name: 'JOGADOR', tag: 'P1', tcolor: '#3b82f6', skin: mine, human: true, input: inp[0], spawn: sp[0], lives});
      enemySkins[0].awk = pick(AWK_IDS);
      const c = mk({slot: -1, name: 'CPU', tag: 'CPU', tcolor: '#ef4444', skin: enemySkins[0], spawn: sp[1], lives}); mkAI(c, 'hunter', cfg.diff);
    } else if (cfg.mode === 'duel_local') {
      mk({slot: 0, name: 'JOGADOR 1', tag: 'P1', tcolor: '#3b82f6', skin: mine, human: true, input: inp[0], spawn: sp[0], lives});
      let s2 = enemySkins[0]; s2.color = '#ef4444'; if (mine.color.toLowerCase() === '#ef4444') s2.color = '#e11d48';
      if (env.skin2) { s2 = Object.assign({}, env.skin2); if (s2.color.toLowerCase() === mine.color.toLowerCase()) s2.color = shadeHex(s2.color); }
      mk({slot: 1, name: 'JOGADOR 2', tag: 'P2', tcolor: '#ef4444', skin: s2, human: true, input: inp[1], spawn: sp[1], lives});
    } else if (cfg.mode === 'chaos') {
      const spawns = sp.slice().sort(() => Math.random() - 0.5);
      mk({slot: 0, name: 'JOGADOR', tag: 'P1', tcolor: '#3b82f6', skin: mine, human: true, input: inp[0], spawn: spawns[0], lives});
      const defs = [['HUNTER', 'hunter', '#ef4444'], ['TACTICIAN', 'tactician', '#22c55e'], ['CHAOS', 'chaos', '#facc15']];
      defs.forEach((d, i) => { const f = mk({slot: -1, name: d[0], tag: d[0], tcolor: d[2], skin: enemySkins[i + (i === 2 ? 1 : 0)], spawn: spawns[i + 1], lives}); mkAI(f, d[1], cfg.diff === undefined ? 1 : cfg.diff); });
    } else if (cfg.mode === 'online') {
      const spawns = sp.slice().sort(() => Math.random() - 0.5), me = env.netMe;
      cfg.players.forEach((p, i) => {
        const f = mk({slot: p.pid === me ? 0 : -1, name: p.name, tag: p.name, tcolor: p.color, skin: p.skin, human: true, input: env.netClient ? newInput() : (p.pid === 0 ? inp[0] : (env.netInputs && env.netInputs[p.pid]) || newInput()), spawn: spawns[i % spawns.length], lives});
        f.netPid = p.pid; f.mine = p.pid === me;
      });
    } else if (cfg.mode === 'menu') {
      const a = mk({slot: -1, name: '', skin: enemySkins[0], spawn: sp[0], lives: 999}); mkAI(a, 'hunter', 1);
      const b = mk({slot: -1, name: '', skin: Object.assign({}, enemySkins[2]), spawn: sp[1], lives: 999}); mkAI(b, 'chaos', 1);
      const c = mk({slot: -1, name: '', skin: Object.assign({}, mine, {color: '#3b82f6'}), spawn: sp[2], lives: 999}); mkAI(c, 'tactician', 1);
    } else if (cfg.mode === 'awkprev') {
      const hero = mk({slot: 0, name: '', skin: mine, human: true, input: newInput(), spawn: {x: 430, y: 600}, lives: 1});
      const dummy = mk({slot: -1, name: '', skin: Object.assign({}, ENEMY_SKINS[0]), spawn: {x: 800, y: 600}, lives: 1});
      hero.facing = 1; dummy.facing = -1; hero.maxhp = hero.hp = dummy.maxhp = dummy.hp = 300;
    } else if (cfg.mode === 'fatality') {
      const hero = mk({slot: 0, name: env.heroName || '', skin: mine, human: false, input: newInput(), spawn: {x: 400, y: 600}, lives: 1});
      const vic = mk({slot: 1, name: env.vicName || '', skin: env.skin2 || Object.assign({}, ENEMY_SKINS[0]), human: false, input: newInput(), spawn: {x: 800, y: 600}, lives: 1});
      hero.facing = 1; vic.facing = -1; hero.fatRole = 'hero'; vic.fatRole = 'victim';
    } else if (cfg.mode === 'preview') {
      mk({slot: 0, name: '', skin: mine, human: true, input: newInput(), spawn: {x: 640, y: 600}, lives: 1});
    }
    this.fighters.forEach((f, i) => { f.facing = f.x < WORLD_W / 2 ? 1 : -1; });
  }
  onKill(killer, victim, wid) {
    this.killFeed.push({k: killer, v: victim, t: this.time});
    if (this.killFeed.length > 4) this.killFeed.shift();
  }
  // ---- consultas para IA
  platBelow(x, y, maxDrop) {
    let best = null, by = 1e9;
    for (const p of this.plats) {
      if (x < p.x - 2 || x > p.x + p.w + 2) continue;
      if (p.y >= y - 4 && p.y - y <= maxDrop && p.y < by) { by = p.y; best = p; }
    }
    if (best && this.arena.lavaY && best.y > this.arena.lavaY) return null;
    return best;
  }
  groundAhead(x, y, dir) { return !!this.platBelow(x + dir * 44, y - 10, 340); }
  canCross(x, y, dir) {
    for (const p of this.plats) {
      if (p.y < y - 165 || p.y > y + 340) continue;
      if (this.arena.lavaY && p.y > this.arena.lavaY) continue;
      const near = dir > 0 ? p.x - x : x - (p.x + p.w);
      const far = dir > 0 ? p.x + p.w - x : x - p.x;
      if (far > 8 && near <= 240 && near > -4) return true;
    }
    return false;
  }
  los(x1, y1, x2, y2) {
    for (const p of this.plats) if (p.solid && segRect(x1, y1, x2, y2, p.x, p.y, p.w, p.h) >= 0) { if (p.h <= 140 && p.w <= 400) return false; }
    return true;
  }
  danger(x, y) {
    const a = this.arena;
    if (a.zaps) for (const z of a.zaps) { const ph = this.time % z.period; if (ph > z.period - z.on - 1.0 && x > z.x - 30 && x < z.x + z.w + 30 && y > z.y - 20 && y < z.y + z.h + 40) return true; }
    for (const mi of this.mines) if (mi.armed && Math.abs(mi.x - x) < 80 && Math.abs(mi.y - y) < 60) return true;
    for (const b of this.bombs) if (Math.abs(b.x - x) < 130 && Math.abs(b.y - y) < 130) return true;
    for (const pr of this.projs) if (!pr.owner && Math.abs(pr.x - x) < 70 && pr.y < y + 30 && pr.y > y - 220) return true;
    return false;
  }
  safeCenters() {
    if (this._sc) return this._sc;
    this._sc = this.arena.plats.filter(p => p.w >= 100 && !p.move && p.x > -10 && p.x + p.w < WORLD_W + 10).map(p => ({x: p.x + p.w / 2, y: p.y}));
    return this._sc;
  }
  nearestSafe(x, y) {
    let b = null, bd = 1e9;
    for (const c of this.safeCenters()) { const d = Math.abs(c.x - x) + Math.max(0, c.y - y) * 0.5; if (d < bd) { bd = d; b = c; } }
    return b || {x: WORLD_W / 2, y: 400};
  }

  // ---- itens, projéteis
  addItem(id, x, y, vx, vy, ammo, uses, noPick) {
    if (this.items.length > 14) return null;
    const w = WEAPONS[id];
    const it = {id, x, y, vx, vy, w: 30, h: 14, bounce: 0.35, rot: rnd(-1, 1), vr: rnd(-6, 6), life: 18, noPick: noPick || 0.3, dead: false,
      ammo: ammo !== undefined && ammo !== null ? ammo : (w.ammo || 0), uses: uses !== undefined && uses !== null ? uses : (w.uses || 0), grounded: false, plat: null, wall: 0};
    this.items.push(it); return it;
  }
  pickX() {
    const cands = this.arena.plats.filter(p => p.w >= 90 && p.x > -10 && p.x + p.w < WORLD_W + 10);
    let best = WORLD_W / 2, bs = -1;
    for (let k = 0; k < 8; k++) {
      const tw = cands.reduce((s, p) => s + p.w, 0); let r = Math.random() * tw, pl = cands[0];
      for (const p of cands) { r -= p.w; if (r <= 0) { pl = p; break; } }
      const x = pl.x + 25 + Math.random() * (pl.w - 50);
      let md = 1e9; for (const rx of this.recentX) md = Math.min(md, Math.abs(rx - x));
      if (md > bs) { bs = md; best = x; }
    }
    this.recentX.push(best); if (this.recentX.length > 3) this.recentX.shift();
    return best;
  }
  spawnWeapon() {
    if (this.items.length >= this.maxItems) return;
    let tot = 0; for (const id of WEAPON_IDS) tot += WEAPONS[id].rar;
    let r = Math.random() * tot, id = WEAPON_IDS[0];
    for (const k of WEAPON_IDS) { r -= WEAPONS[k].rar; if (r <= 0) { id = k; break; } }
    const x = this.pickX();
    this.addItem(id, x, -50, rnd(-20, 20), 0, null, null, 0.2);
    this.fx.ring(x, 20, 40, 0.5, WEAPONS[id].color, 3);
    SFX.play('spawn');
  }
  addProj(p) { if (this.projs.length < 80) this.projs.push(p); }
  addGrenade(x, y, vx, vy, owner, wid) {
    wid = wid || 'grenade';
    this.bombs.push({x, y, vx, vy, w: 14, h: 14, bounce: 0.45, wid, fuse: WEAPONS[wid].fuse, owner, grounded: false, plat: null, wall: 0, rot: 0});
  }
  addMine(x, y, owner) {
    if (this.mines.length > 8) this.mines.shift();
    this.mines.push({x, y, vx: 0, vy: 0, w: 18, h: 8, bounce: 0, armT: WEAPONS.mine.arm, armed: false, owner, life: 25, grounded: false, plat: null, wall: 0});
  }
  explode(x, y, R, dmg, knock, owner, wid) {
    const fx = this.fx;
    fx.burst(x, y, 26, 620, 0.7, 6, '#ff9a2e', 300, 0);
    fx.burst(x, y, 16, 420, 0.9, 10, '#444', -100, 1);
    fx.burst(x, y, 12, 700, 0.4, 3, '#fff2a8', 0, 0);
    fx.ring(x, y, R * 1.3, 0.4, '#ffd27a', 7); fx.ring(x, y, R * 0.8, 0.3, '#fff', 4);
    fx.addShake(R / 9); fx.flash = 0.08; this.hitstop = Math.max(this.hitstop, 0.04);
    SFX.play('explosion');
    for (const f of this.fighters) {
      if (!f.alive || f.invuln > 0) continue;
      const dx = f.cx - x, dy = f.cy - y, d = Math.hypot(dx, dy);
      if (d > R + 20) continue;
      const k = clamp(1 - d / (R + 20), 0.1, 1);
      const nx = dx / (d || 1), ny = dy / (d || 1);
      const self = f === owner ? 0.6 : 1;
      f.hurt(dmg * (0.4 + 0.6 * k) * self, nx * knock * (0.5 + k), ny * knock * (0.5 + k) - 260, owner, wid, f.cx, f.cy);
      if (f.alive && !f.ragdoll) f.toRagdoll(nx * knock * (0.5 + k), ny * knock * (0.5 + k) - 260, 0.8 + k * 0.8);
    }
    for (const it of this.items) { const dx = it.x - x, dy = it.y - y, d = Math.hypot(dx, dy); if (d < R * 1.4) { it.vx += dx / (d || 1) * 500; it.vy -= 300; } }
  }

  respawn(f) {
    const sp = this.arena.spawns; let best = sp[0], bd = -1;
    const alive = this.fighters.filter(e => e !== f && e.alive);
    for (const s of sp) {
      let md = 1e9; for (const e of alive) md = Math.min(md, Math.hypot(e.cx - s.x, e.cy - s.y));
      if (this.danger(s.x, s.y - 40)) md = -1;
      for (const pr of this.projs) if (Math.hypot(pr.x - s.x, pr.y - s.y) < 160) md = Math.min(md, 20);
      if (md > bd) { bd = md; best = s; }
    }
    if (bd < 0 && this.cfg.mode !== 'menu') { f.respawnT = 0.25; return; }
    f.reset(best, false); f.facing = best.x < WORLD_W / 2 ? 1 : -1;
    this.fx.ring(best.x, best.y - 50, 70, 0.5, f.tcolor, 5); this.fx.burst(best.x, best.y - 50, 14, 300, 0.6, 3, f.tcolor, 0, 0);
    SFX.play('spawn');
  }

  update(dt) {
    if (this.env.netClient) return this.updateNetClient(dt);
    this.fx.update(dt);
    if (this.hitstop > 0) { this.hitstop -= dt; return; }
    this.time += dt;
    // plataformas móveis
    for (const p of this.plats) {
      if (!p.move) continue;
      const ox = p.x, oy = p.y, mv = p.move;
      p.x = p.bx + Math.sin(this.time * mv.spd + mv.ph) * mv.ax;
      p.y = p.by + Math.sin(this.time * mv.spd + mv.ph) * mv.ay;
      p.dx = p.x - ox; p.dy = p.y - oy;
    }
    if (this.state === 'countdown') {
      this.cdT -= dt;
      const n = Math.ceil(this.cdT);
      if (n !== this.lastN) { this.lastN = n; if (n > 0) SFX.play('count'); else { SFX.play('go'); } }
      if (this.cdT <= 0) { this.state = 'play'; this.frozen = false; this.goT = 0.9; }
    } else {
      this.goT -= dt;
      if (this.state === 'play') this.t += dt;
    }
    if (!this.frozen || this.state === 'countdown') {
      // armas do céu
      if (!this.fatMode && this.state !== 'preview' && this.cfg.mode !== 'preview' && this.cfg.mode !== 'awkprev' && !this.ended) {
        this.spawnT -= dt;
        if (this.spawnT <= 0 && (this.state === 'play')) { this.spawnWeapon(); this.spawnT = rnd(this.spawnMin, this.spawnMax); }
      }
    }
    // perigos
    if (!this.fatMode) this.hazards(dt);
    // IA
    for (const f of this.fighters) if (f.brain) f.brain.update(dt, this);
    const cn = this.cine; cn.tDim = 0; cn.tZoom = 1; cn.tLight = 0; cn.tDist = 0;
    if (this.fatMode) this.fatUpdate(dt);
    for (const f of this.fighters) f.update(dt);
    this.updateCine(dt);
    this.fighterPush();
    this.updateItems(dt);
    this.updateProjs(dt);
    this.updateBombs(dt);
    this.updateMines(dt);
    // checagem de fim
    if (this.cfg.mode === 'awkprev') this.keepPreview();
    else if (!this.fatMode && this.state === 'play' && !this.ended && this.cfg.mode !== 'menu' && this.cfg.mode !== 'preview') this.checkEnd(dt);
    if (this.ended) {
      this.endT += dt / Math.max(0.2, this.timeScale);
      if (this.endT > 0.5) this.timeScale = Math.min(1, this.timeScale + dt * 0.5);
    }
    // intensidade musical
    if (this.cfg.mode !== 'menu' && !this.fatMode) {
      const hpLow = Math.min(...this.fighters.filter(f => f.alive).map(f => f.hp), 100);
      SFX.setIntensity(clamp(this.t / 90 + (100 - hpLow) / 140, 0, 1));
    }
  }
  hazards(dt) {
    const a = this.arena;
    if (a.fire && this.state === 'play') {
      this.fireT -= dt;
      if (this.fireT <= 0) { this.fireT = rnd(2.2, 3.6); this.addProj({kind: 'fire', x: rnd(120, 1160), y: -30, vx: rnd(-90, 90), vy: 420, life: 5, dmg: 14, knock: 520, owner: null, wid: 'fire', grav: 120, exp: null}); }
    }
    if (a.zaps && this.state === 'play') {
      for (const z of a.zaps) {
        const ph = this.time % z.period, on = ph > z.period - z.on;
        z.active = on; z.warn = !on && ph > z.period - z.on - 1.0;
        if (on) for (const f of this.fighters) {
          if (!f.alive || f.invuln > 0 || f.zapCd > 0) continue;
          if (f.cx > z.x && f.cx < z.x + z.w && f.y > z.y && f.y - 20 < z.y + z.h && !f.ragdoll) { f.zapCd = 0.7; f.hurt(10, (f.cx < z.x + z.w / 2 ? -1 : 1) * 500, -650, null, 'zap', f.cx, f.y - 30); SFX.play('zap'); this.fx.burst(f.cx, f.y - 20, 10, 400, 0.3, 3, '#a5f3fc', 300, 0); }
        }
      }
    }
  }
  fighterPush() {
    const F = this.fighters;
    for (let i = 0; i < F.length; i++) {
      const a = F[i]; if (!a.alive || a.ragdoll) continue;
      for (let j = i + 1; j < F.length; j++) {
        const b = F[j]; if (!b.alive || b.ragdoll) continue;
        const dx = b.x - a.x, ox = BW - Math.abs(dx);
        if (ox > 0 && Math.abs(a.y - b.y) < BH - 14) {
          const s = dx === 0 ? (i % 2 ? 1 : -1) : sgn(dx), push = ox * 0.5;
          a.x -= s * push; b.x += s * push;
        }
      }
    }
  }
  updateItems(dt) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.noPick -= dt; it.life -= dt;
      it.vy = Math.min(1400, it.vy + GRAV * 0.8 * dt);
      if (it.plat && it.plat.move) { it.x += it.plat.dx; it.y += it.plat.dy; }
      moveBody(this, it, dt, false);
      if (it.grounded) { it.vx *= Math.max(0, 1 - 7 * dt); it.vr = 0; it.rot *= 0.9; } else it.rot += it.vr * dt;
      if (it.dead || it.life <= 0 || it.y > this.arena.killY + 100 || it.x < -200 || it.x > WORLD_W + 200) {
        if (it.life <= 0 && !it.dead) this.fx.burst(it.x, it.y, 8, 200, 0.4, 3, WEAPONS[it.id].color, 0, 1);
        this.items.splice(i, 1);
      }
    }
  }
  updateProjs(dt) {
    const P = this.projs;
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      if (p.kind === 'boomerang') { if (this.updateBoom(p, dt)) { if (p.owner) p.owner.boomN = Math.max(0, p.owner.boomN - 1); P.splice(i, 1); } continue; }
      const ox = p.x, oy = p.y;
      p.vy += (p.grav || 0) * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      let dead = p.life <= 0, hitW = false, tW = 2;
      for (const pl of this.plats) {
        if (!pl.solid) continue;
        const t = segRect(ox, oy, p.x, p.y, pl.x, pl.y, pl.w, pl.h);
        if (t >= 0 && t < tW) tW = t;
      }
      if (tW <= 1) { hitW = true; p.x = ox + (p.x - ox) * tW; p.y = oy + (p.y - oy) * tW; }
      // trilhas
      if (p.kind === 'rocket') { this.fx.add(p.x, p.y, rnd(-30, 30), rnd(-30, 30), 0.4, 5, '#999', 0, 1); this.fx.add(p.x, p.y, 0, 0, 0.15, 4, '#ffb347', 0, 0); }
      else if (p.kind === 'orb') this.fx.add(p.x, p.y, rnd(-20, 20), rnd(-20, 20), 0.3, 5, '#a78bfa', 0, 0);
      else if (p.kind === 'fire') { this.fx.add(p.x, p.y, rnd(-30, 30), -60, 0.35, 6, '#ff7a1a', 0, 0); }
      else if (p.kind === 'bullet') this.fx.add(p.x, p.y, 0, 0, 0.08, 2, '#fff3b0', 0, 0);
      // lutadores
      if (!hitW || true) {
        for (const f of this.fighters) {
          if (!f.alive || f.invuln > 0 || f === p.owner) continue;
          const r = p.kind === 'fire' ? 14 : (p.kind === 'orb' ? 8 : 2);
          const h = f.hitByCircle(ox, oy, p.x, p.y, r);
          if (h) {
            if (p.kind === 'rocket' || p.kind === 'orb') { this.explode(h.x, h.y, p.exp.r, p.exp.dmg, p.knock, p.owner, p.wid); dead = true; hitW = false; break; }
            const sp = Math.hypot(p.vx, p.vy) || 1, nx = p.vx / sp, ny = p.vy / sp;
            f.hurt(p.dmg * (h.head ? 1.3 : 1), nx * p.knock, ny * p.knock * 0.5 - 90, p.owner, p.wid, h.x, h.y);
            if (p.kind === 'fire') this.fx.burst(h.x, h.y, 10, 400, 0.4, 4, '#ff7a1a', 300, 0);
            dead = true; hitW = false; break;
          }
        }
      }
      if (hitW && !dead) {
        dead = true;
        if (p.kind === 'rocket' || p.kind === 'orb') this.explode(p.x, p.y, p.exp.r, p.exp.dmg, p.knock, p.owner, p.wid);
        else if (p.kind === 'fire') { this.fx.burst(p.x, p.y, 10, 300, 0.4, 4, '#ff7a1a', 300, 0); this.fx.ring(p.x, p.y, 50, 0.3, '#ff7a1a', 4); }
        else this.fx.burst(p.x, p.y, 5, 300, 0.25, 2.5, '#ffd9a0', 500, 0);
      }
      if (p.y > this.arena.killY + 80 || p.x < -300 || p.x > WORLD_W + 300 || p.y < -800) dead = true;
      if (p.life <= 0 && (p.kind === 'rocket' || p.kind === 'orb') && !hitW && p.exp) this.explode(p.x, p.y, p.exp.r, p.exp.dmg, p.knock, p.owner, p.wid);
      if (dead) P.splice(i, 1);
    }
  }
  // bumerangue: sai desacelerando, volta acelerando até o dono; acerta na ida e na volta
  updateBoom(p, dt) {
    const o = p.owner, ox = p.x, oy = p.y;
    p.age += dt; p.rot += dt * 22;
    if (!o || !o.alive || p.age > p.life) { this.fx.burst(p.x, p.y, 5, 200, 0.3, 3, '#f59e0b', 0, 0); return true; }
    if (!p.back) {
      const k = Math.max(0, 1 - p.age / 0.5), sp = p.sp0 * k;
      p.vx = p.dx * sp; p.vy = p.dy * sp;
      if (p.age >= 0.5) { p.back = true; p.hit.length = 0; p.ret = 0; }
    } else {
      p.ret += dt;
      const tx = o.cx - p.x, ty = (o.cy - 10) - p.y, d = Math.hypot(tx, ty) || 1, sp = Math.min(1250, 250 + p.ret * 1700);
      p.vx = tx / d * sp; p.vy = ty / d * sp;
      if (d < 34) { this.fx.ring(o.cx, o.cy, 28, 0.2, '#fbbf24', 3); SFX.play('click'); return true; }
    }
    p.x += p.vx * dt; p.y += p.vy * dt;
    if (!p.back) { // parede: volta mais cedo
      for (const pl of this.plats) { if (pl.solid && segRect(ox, oy, p.x, p.y, pl.x, pl.y, pl.w, pl.h) >= 0 && segRect(ox, oy, p.x, p.y, pl.x, pl.y, pl.w, pl.h) <= 1) { p.back = true; p.hit.length = 0; p.ret = 0; this.fx.burst(p.x, p.y, 4, 260, 0.2, 2.5, '#ffd9a0', 300, 0); break; } }
    }
    if (((p.age * 30) | 0) % 2 === 0) this.fx.add(p.x, p.y, rnd(-20, 20), rnd(-20, 20), 0.18, 3, '#fbbf24', 0, 0);
    for (const f of this.fighters) {
      if (!f.alive || f.invuln > 0 || f === o || p.hit.includes(f)) continue;
      const h = f.hitByCircle(ox, oy, p.x, p.y, 13);
      if (h) {
        p.hit.push(f);
        const sp = Math.hypot(p.vx, p.vy) || 1;
        f.hurt(p.dmg * (p.back ? 0.8 : 1), p.vx / sp * p.knock, -120, o, p.wid, h.x, h.y);
        this.fx.burst(h.x, h.y, 6, 300, 0.25, 3, '#fbbf24', 200, 0);
      }
    }
    if (p.y > this.arena.killY + 80 || p.x < -300 || p.x > WORLD_W + 300 || p.y < -800) return true;
    return false;
  }
  updateBombs(dt) {
    for (let i = this.bombs.length - 1; i >= 0; i--) {
      const b = this.bombs[i];
      b.vy = Math.min(1400, b.vy + GRAV * dt); b.fuse -= dt; b.rot += b.vx * dt * 0.02;
      if (b.plat && b.plat.move) { b.x += b.plat.dx; b.y += b.plat.dy; }
      moveBody(this, b, dt, false);
      if (b.grounded) b.vx *= Math.max(0, 1 - 5 * dt);
      if (b.fuse < 0.6 && Math.random() < 0.3) this.fx.add(b.x, b.y - 10, 0, -20, 0.2, 3, '#ff4d4d', 0, 0);
      if (Math.random() < 0.3) this.fx.add(b.x, b.y - 8, rnd(-20, 20), -30, 0.25, 2, '#fbbf24', 0, 0);
      if (b.fuse <= 0 || b.y > this.arena.killY + 50) {
        if (b.fuse <= 0) { const bw = WEAPONS[b.wid || 'grenade']; this.explode(b.x, b.y - 8, bw.expR, bw.expDmg, bw.knock, b.owner, bw.id); }
        this.bombs.splice(i, 1);
      }
    }
  }
  updateMines(dt) {
    for (let i = this.mines.length - 1; i >= 0; i--) {
      const mi = this.mines[i];
      mi.vy = Math.min(1400, mi.vy + GRAV * dt); mi.life -= dt;
      moveBody(this, mi, dt, false);
      if (!mi.armed) { mi.armT -= dt; if (mi.armT <= 0) { mi.armed = true; SFX.play('beep'); } }
      let trig = false;
      if (mi.armed) for (const f of this.fighters) {
        if (!f.alive || f.invuln > 0) continue;
        if (Math.abs(f.cx - mi.x) < WEAPONS.mine.trig && f.y > mi.y - 8 && f.y - BH < mi.y && !f.ragdoll) { trig = true; break; }
      }
      if (trig) { this.explode(mi.x, mi.y - 6, WEAPONS.mine.expR, WEAPONS.mine.expDmg, WEAPONS.mine.knock, mi.owner, 'mine'); this.mines.splice(i, 1); }
      else if (mi.life <= 0 || mi.y > this.arena.killY + 50) this.mines.splice(i, 1);
    }
  }
  checkEnd(dt) {
    const F = this.fighters;
    const left = F.filter(f => !f.out);
    let timeUp = false;
    if (this.cfg.timeLimit > 0 && this.t >= this.cfg.timeLimit && left.length > 1) timeUp = true;
    if (left.length <= 1 || timeUp) {
      this.ended = true; this.timeScale = 0.35; this.state = 'ending';
      let w = left[0] || null, draw = false;
      if (timeUp) {
        // desempate: mais vidas, depois maior % de vida; empate => rodada extra / empate
        const sc = f => f.lives * 1000 + f.hp / f.maxhp * 100;
        const a = sc(left[0]), b = sc(left[1]);
        if (Math.abs(a - b) < 0.5) { w = null; draw = true; } else w = a > b ? left[0] : left[1];
        this.timeUp = true; this.frozen = true;
      }
      for (const f of F) if (f.awk) f.endAwk();
      if (w) { w.celebrate = true; w.winAnim = Math.max(0, WIN_IDS.indexOf(w.skin.win)); w.invuln = 99; }
      this.result = {winner: w, time: this.t, draw, timeUp};
      F.forEach(f => { if (!f.out) f.elimTime = this.t; });
      SFX.play(w && w.human ? 'win' : 'lose');
      this.endDelay = 2.2;
    }
  }
}

'use strict';
/* STICK MAYHEM v1.1.0 — AWAKENING: energia, ativação e os 3 superataques (VOID / INFERNO / CELESTIAL)
   Estende Fighter e Match (engine.js). Os valores de balanceamento ficam em AWK (data.js). */

// tempos de cada sequência (segundos)
const AWK_T = {
  void:      {prep: 0.95, dash: 0.27, spd: 2100, hold: 0.30, rec: 0.65},
  inferno:   {prep: 0.85, dash: 0.26, spd: 1750, hold: 0.0,  rec: 0.70},
  celestial: {prep: 1.15, dash: 0.17, spd: 0,    hold: 0.30, rec: 1.00},
};
// keyframes de pose: [u, lean, crouch, stance, rx, ry, lx, ly, lift]  (mãos relativas ao peito, no espaço do "facing")
const KF = {
  void_prep:  [[0, 0, 0, 8, 18, 10, -4, 12, 0], [0.35, -4, 8, 14, -18, 0, 22, 4, 0], [0.75, -6, 13, 16, -24, -8, 24, 0, 0], [1, -8, 15, 17, -26, -10, 24, -2, 0]],
  void_dash:  [[0, 14, 10, 14, 30, 2, -14, 6, 12], [1, 18, 10, 16, 33, 0, -18, 8, 14]],
  void_hit:   [[0, 16, 6, 18, 34, -2, -16, 8, 6], [1, 12, 5, 16, 33, -2, -12, 8, 2]],
  void_rec:   [[0, 12, 5, 16, 33, -2, -12, 8, 2], [0.5, 5, 3, 10, 22, 12, -6, 16, 0], [1, 0, 0, 8, 12, 24, -4, 26, 0]],
  inf_prep:   [[0, 0, 0, 8, 18, 10, 10, 6, 0], [0.4, 3, 9, 14, 22, -6, 20, -8, 0], [0.8, 5, 13, 16, 26, -12, 22, -14, 0], [1, 6, 14, 17, 27, -14, 24, -14, 0]],
  inf_dash:   [[0, 15, 10, 15, 30, 0, 24, 4, 12], [1, 18, 10, 16, 32, -2, 26, 2, 14]],
  inf_jabR:   [[0, 14, 7, 16, 14, 0, 28, 0, 4], [0.5, 17, 7, 17, 34, -4, 18, 4, 4], [1, 14, 7, 16, 18, 0, 26, 0, 4]],
  inf_jabL:   [[0, 14, 7, 16, 28, 0, 14, 0, 4], [0.5, 17, 7, 17, 18, 4, 34, -4, 4], [1, 14, 7, 16, 26, 0, 18, 0, 4]],
  inf_fin:    [[0, 4, 12, 17, 20, 8, 20, 2, 0], [0.35, 18, 6, 20, 34, -26, 12, 8, 6], [1, 14, 5, 18, 32, -22, 8, 10, 4]],
  inf_rec:    [[0, 12, 5, 16, 32, -20, 8, 10, 2], [0.5, 5, 3, 10, 22, 8, 6, 18, 0], [1, 0, 0, 8, 12, 24, -4, 26, 0]],
  cel_prep:   [[0, 0, 0, 8, 18, 10, -4, 12, 0], [0.3, 0, -3, 10, 10, -22, -8, -22, 0], [0.6, -2, 3, 12, 14, -30, 4, -30, 0], [1, 0, 6, 12, 22, -6, 20, -4, 0]],
  cel_hit:    [[0, 8, 6, 18, 32, -10, 28, -6, 4], [1, 6, 4, 14, 30, -6, 24, -2, 2]],
  cel_rec:    [[0, 6, 4, 14, 30, -6, 24, -2, 2], [0.5, 2, 2, 10, 20, 8, 12, 12, 0], [1, 0, 0, 8, 12, 24, -4, 26, 0]],
};
function kfs(rows, u, o) {
  u = clamp(u, 0, 1);
  let i = 0; while (i < rows.length - 2 && u > rows[i + 1][0]) i++;
  const a = rows[i], b = rows[Math.min(i + 1, rows.length - 1)], span = b[0] - a[0] || 1, k = easeO(clamp((u - a[0]) / span, 0, 1));
  for (let j = 1; j < 9; j++) o[j] = a[j] + (b[j] - a[j]) * k;
  return o;
}
const _kf = new Array(9).fill(0);

Object.assign(Fighter.prototype, {
  readyFx() {
    const full = this.energy >= 100;
    if (Math.random() < (full ? 0.18 : 0.05)) { const C = AWK_TYPES[this.awkType] || AWK_TYPES.void; this.m.fx.add(this.x + rnd(-22, 22), this.y - rnd(0, 100), rnd(-15, 15), -rnd(40, 110), rnd(0.4, 0.8), rnd(1.6, 3), full ? C.c3 : C.c, 0, 2); }
  },
  foe() {
    let b = null, bd = 1e9;
    for (const e of this.m.fighters) { if (e === this || !e.alive) continue; const d = Math.abs(e.cx - this.x); if (d < bd) { bd = d; b = e; } }
    return b;
  },
  gainEnergy(eff, v, wid) {
    const m = this.m, A = m.cfg.awk;
    if (!A || !A.on || this.awk || wid === 'awk' || !this.alive || eff <= 0 || v.invuln > 0) return;
    this.chain = 0;                                              // quem revida zera a "surra" sofrida por si
    const now = m.time;
    if (now - v.chainT > AWK.chainWin) v.chain = 0; else v.chain++;
    v.chainT = now;
    const sc = Math.max(AWK.chainMin, 1 - AWK.chainDecay * v.chain);
    const was = this.energy;
    this.energy = Math.min(100, this.energy + eff * (100 / (AWK.needFrac * v.maxhp)) * (AWK.chargeMul[A.charge] || 1) * sc);
    if (this.energy >= 100 && was < 100) this.onEnergyFull();
  },
  onEnergyFull() {
    this.readyT = 1.2;
    if (this.human) { SFX.play('awk_ready'); this.m.fx.text(this.cx, this.cy - 90, 'AWAKENING!', AWK_TYPES[this.awkType].c); }
    this.m.fx.ring(this.cx, this.cy, 80, 0.5, AWK_TYPES[this.awkType].c, 5);
  },
  canAwk() {
    const m = this.m, A = m.cfg.awk;
    return !!(A && A.on && this.energy >= 100 && this.alive && !this.ragdoll && !this.awk && this.awkLock <= 0 && this.hitstun <= 0 &&
      this.getUpT <= 0 && !m.frozen && m.state === 'play' && !m.ended && !this.celebrate && this.foe());
  },
  startAwk() {
    const m = this.m, e = this.foe(), t = this.awkType in AWK_T ? this.awkType : 'void';
    this.energy = 0; this.readyT = 0;
    this.awk = {type: t, t: 0, lt: 0, ph: 'prep', hits: 0, hit: false, whiff: false, aim: e ? e.cx : this.x + this.facing * 300, tr: [], acc: 0, aura: 0, jab: 0, ex: 0, ey: 0, did: 0};
    for (let i = 0; i < 14; i++) this.awk.tr.push({x: 0, y: 0, a: 0});
    this.awk.trI = 0;
    if (typeof AWK2 !== 'undefined' && AWK2[t]) this.awk2Init(this.awk);
    if (e) this.facing = e.cx >= this.x ? 1 : -1;
    this.atkT = -1; this.charge = 0; this.beamT = 0; this.dashT = 0; this.cd = 0.2; this.hitstun = 0; this.vx *= 0.3;
    this.awkCount = (this.awkCount || 0) + 1;
    SFX.play('awk_' + t + '_charge');
    m.fx.text(this.cx, this.cy - 90, AWK_TYPES[t].name, AWK_TYPES[t].c);
  },
  endAwk() {
    if (!this.awk) return;
    this.awk = null; this.awkLock = AWK.lockT; this.dashT = 0;
    if (!this.ragdoll) { this.vx *= 0.3; }
  },
  // dano total do superataque (fração da vida máxima do alvo, com a configuração de dano e o teto)
  awkDamage(e, share) {
    const A = this.m.cfg.awk, frac = Math.min(AWK.maxFrac, AWK_TYPES[this.awk.type].frac * (AWK.dmgMul[A.dmg] || 1));
    return frac * e.maxhp * share;
  },
  // evita eliminação imediata por queda: perto da borda sem chão, o golpe lança mais para cima/para dentro
  safeK(e, dir, kx, ky) {
    const m = this.m;
    const edge = e.cx + dir * 420;
    if (edge < 40 || edge > WORLD_W - 40) {
      const below = m.platBelow(e.cx + dir * 300, e.cy, 600);
      if (!below) { return [kx * 0.35, ky * 1.1]; }
    }
    return [kx, ky];
  },
  awkRegion(e, rx, ry) { return e && e.alive && Math.abs(e.cx - this.x) < rx && Math.abs(e.cy - (this.y - 50)) < ry; },
  awkStrike(e, o) {
    // o: {rx, ry, share, kx, ky, blast, blastShare, wid}
    const m = this.m, dir = this.facing; let hit = false;
    if (!e || !e.alive) return false;
    const inMain = this.awkRegion(e, o.rx, o.ry);
    const d = Math.hypot(e.cx - this.x, e.cy - (this.y - 50));
    if (inMain) {
      const k = this.safeK(e, dir, dir * o.kx, o.ky);
      hit = e.hurt(this.awkDamage(e, o.share), k[0], k[1], this, 'awk', e.cx, e.cy);
      if (hit && e.alive && !e.ragdoll && Math.hypot(k[0], k[1]) > 300) e.toRagdoll(k[0], k[1], 0.9 + Math.hypot(k[0], k[1]) / 1800);
    } else if (o.blast && d < o.blast) {
      const f = 1 - d / o.blast, k = this.safeK(e, dir, dir * o.kx * 0.5, o.ky * 0.6);
      hit = e.hurt(this.awkDamage(e, o.blastShare * (0.5 + 0.5 * f)), k[0], k[1], this, 'awk', e.cx, e.cy);
      if (hit && e.alive && !e.ragdoll) e.toRagdoll(k[0], k[1], 0.7);
    }
    return hit;
  },
  trailPush(a) {
    const t = a.tr[a.trI]; a.trI = (a.trI + 1) % a.tr.length; t.x = this.x; t.y = this.y - 55; t.a = 1;
  },
  fxPull(x, y, R, n, col, life) {
    const fx = this.m.fx;
    for (let i = 0; i < n; i++) {
      const th = Math.random() * 6.283, r = R * (0.6 + Math.random() * 0.5);
      fx.add(x + Math.cos(th) * r, y + Math.sin(th) * r * 0.8, -Math.cos(th) * r / life, -Math.sin(th) * r * 0.8 / life, life, 2.4, col, 0, 0);
    }
  },
  updateAwk(dt) {
    const a = this.awk, m = this.m, T = AWK_T[a.type], C = AWK_TYPES[a.type], c = m.cine, e = this.foe();
    if (!(m.state === 'play') || m.ended || a.t > AWK.maxT || (m.frozen && !m.ended)) { this.endAwk(); return; }
    a.t += dt; a.lt += dt;
    for (const p of a.tr) p.a = Math.max(0, p.a - dt * 4);
    let grav = true, dashing = false;
    const hx = this.pts[HDR].x, hy = this.pts[HDR].y;
    const cx = this.x, cy = this.y - 55;
    const ph = a.ph;
    if (ph === 'prep') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 14);
      const u = clamp(a.lt / T.prep, 0, 1);
      a.aura = Math.min(1, a.aura + dt * 2.2);
      c.zx = cx; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1 + 0.14 * easeO(u));
      if (e) { this.facing = e.cx >= this.x ? 1 : -1; }
      if (a.type === 'void') {
        c.tDim = 0.58 * Math.min(1, u * 2.2); c.tDist = u > 0.35 ? clamp((u - 0.35) * 1.5, 0, 0.85) : 0; c.dx = cx; c.dy = cy; c.dr = 220; c.dtype = 0;
        a.acc += dt * (30 + 70 * u); while (a.acc >= 1) { a.acc--; this.fxPull(cx, cy, 90 + 70 * (1 - u), 1, Math.random() < 0.3 ? '#f0abfc' : '#a78bfa', 0.34); }
      } else if (a.type === 'inferno') {
        c.tDim = 0.22 * u; c.tDist = u > 0.4 ? clamp((u - 0.4) * 1.2, 0, 0.7) : 0; c.dx = cx; c.dy = cy - 20; c.dr = 230; c.dtype = 1;
        a.acc += dt * (40 + 80 * u); while (a.acc >= 1) { a.acc--; m.fx.add(cx + rnd(-26, 26), this.y - rnd(0, 30), rnd(-40, 40), -rnd(120, 300) * (0.5 + u), rnd(0.3, 0.6), rnd(2, 4), Math.random() < 0.5 ? '#fb923c' : '#fde047', -80, 0); }
      } else {
        c.tLight = 0.42 * Math.min(1, u * 1.6); c.lightC = '#fff7d6';
        a.acc += dt * (50 + 60 * u); while (a.acc >= 1) { a.acc--; m.fx.add(cx + rnd(-50, 50), this.y - rnd(0, 110), rnd(-20, 20), -rnd(60, 200), rnd(0.5, 0.9), rnd(2, 3.5), Math.random() < 0.5 ? '#fde68a' : '#e0f2fe', -30, 1); }
        if (u > 0.55 && !a.did) { a.did = 1; SFX.play('awk_celestial_ring'); m.addShock(cx, cy, 20, 230, 0.5, '#fde68a', 6); m.addShock(cx, cy, 20, 170, 0.4, '#ffffff', 4);
          if (e && Math.abs(e.cx - cx) < 230 && !e.awk) { e.vx += Math.sign(e.cx - cx || 1) * 380; e.vy = Math.min(e.vy, -260); e.hitstun = Math.max(e.hitstun, 0.12); } }
      }
      if (a.lt >= T.prep) {
        a.ph = a.type === 'celestial' ? 'blink' : 'dash'; a.lt = 0; a.aim = e ? e.cx : this.x + this.facing * 400;
        SFX.play('awk_' + a.type + '_dash');
        if (a.type === 'celestial') { a.sx = this.x; a.sy = this.y; this.awkBlinkTarget(a, e); }
      }
    } else if (ph === 'dash') {
      dashing = true; grav = false;
      if (e && a.lt < T.dash - 0.05) a.aim = e.cx;
      const dx = a.aim - this.x, dir = dx >= 0 ? 1 : -1;
      this.facing = dir; this.vx = dir * T.spd; this.vy = 0;
      a.acc += dt; if (a.acc >= 0.011) { a.acc = 0; this.trailPush(a); }
      c.zx = cx; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1.1);
      if (a.type === 'void') { c.tDim = 0.42; c.tDist = 0.5; c.dx = cx; c.dy = cy; c.dr = 220; c.dtype = 0; m.fx.add(cx, cy + rnd(-30, 30), -dir * rnd(80, 240), rnd(-40, 40), 0.35, rnd(2, 4), Math.random() < 0.5 ? '#a78bfa' : '#1e0b3a', 0, 1); }
      else { c.tDim = 0.18; m.fx.add(cx, cy + rnd(-30, 30), -dir * rnd(100, 320), rnd(-60, 20), 0.3, rnd(2, 4), Math.random() < 0.5 ? '#fb923c' : '#fde047', -60, 1); }
      const contact = e && Math.abs(e.cx - this.x) < 46;
      if (contact || a.lt >= T.dash) {
        this.vx = 0; a.ph = 'strike'; a.lt = 0; a.hits = 0; a.hit = false;
        if (a.type === 'void') this.voidImpact(a, e); else this.infernoStart(a, e);
      }
    } else if (ph === 'blink') {               // celestial: viaja como luz
      dashing = true; grav = false;
      const u = clamp(a.lt / T.dash, 0, 1);
      a.acc += dt; if (a.acc >= 0.008) { a.acc = 0; this.trailPush(a); }
      this.x = lerp(a.sx, a.ex, easeO(u)); this.vx = 0; this.vy = 0;
      c.zx = cx; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1.12); c.tLight = 0.5; c.lightC = '#fff7d6';
      for (let i = 0; i < 2; i++) m.fx.add(this.x + rnd(-8, 8), this.y - rnd(10, 100), rnd(-60, 60), rnd(-60, 60), 0.4, rnd(2, 4), '#fff7d6', 0, 1);
      if (u >= 1) { a.ph = 'strike'; a.lt = 0; this.celestialImpact(a, e); }
    } else if (ph === 'strike') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 20);
      c.zx = a.ix || cx; c.zy = a.iy || cy;
      if (a.type === 'void') { c.tZoom = Math.max(c.tZoom, 1.16); c.tDim = 0.18; if (a.lt >= T.hold) { a.ph = 'rec'; a.lt = 0; } }
      else if (a.type === 'celestial') { c.tZoom = Math.max(c.tZoom, 1.14); c.tLight = 0.3; c.lightC = '#fff7d6'; if (a.lt >= T.hold) { a.ph = 'rec'; a.lt = 0; } }
      else this.infernoCombo(a, e, dt);
    } else if (ph === 'rec') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 10);
      a.aura = Math.max(0, a.aura - dt * 1.6);
      c.tZoom = Math.max(c.tZoom, 1 + 0.1 * (1 - a.lt / T.rec));
      if (a.type === 'celestial') c.tLight = 0.25 * (1 - a.lt / T.rec);
      if (a.lt >= T.rec + (a.whiff ? 0.35 : 0)) { this.endAwk(); return; }
    }
    if (a.ph !== 'prep' && a.ph !== 'rec') a.aura = Math.min(1, a.aura + dt * 3);
    if (grav) this.vy = Math.min(1500, this.vy + GRAV * dt);
    const px = this.x;
    moveBody(m, this, dt, false);
    if (a.ph === 'blink') this.x = px;       // o piscar controla x
    if (!dashing && this.grounded) this.phase += Math.abs(this.vx) * dt * 0.034;
    this.awkPose();
    this.smoothPose(dashing ? 1.4 : 1);
    this.capeStep(dt);
    this.checkBounds();
  },
  awkBlinkTarget(a, e) {
    const dir = e ? (e.cx >= this.x ? 1 : -1) : this.facing;
    let ex = e ? e.cx - dir * 58 : this.x + dir * 300;
    const maxR = 640; ex = clamp(ex, this.x - maxR, this.x + maxR);
    a.ex = clamp(ex, 30, WORLD_W - 30); a.dirB = dir; this.facing = dir;
  },
  // ---------- VOID BREAKER: impacto + onda de choque
  voidImpact(a, e) {
    const m = this.m, c = m.cine, dir = this.facing, ix = this.x + dir * 36, iy = this.y - 55;
    a.ix = ix; a.iy = iy;
    const hit = this.awkStrike(e, {rx: 88, ry: 95, share: 1, kx: 1450, ky: -650, blast: 215, blastShare: 0.4});
    a.hit = hit; a.whiff = !hit;
    SFX.play('awk_void_hit');
    m.fx.burst(ix, iy, 36, 760, 0.8, 4, '#a78bfa', 200, 0); m.fx.burst(ix, iy, 20, 520, 0.9, 6, '#1e0b3a', 0, 1); m.fx.burst(ix, iy, 14, 900, 0.4, 3, '#f0abfc', 0, 0);
    m.addShock(ix, iy, 10, 330, 0.55, '#c4b5fd', 8); m.addShock(ix, iy, 10, 470, 0.7, '#7c3aed', 6); m.addShock(ix, iy, 10, 620, 0.9, '#1e0b3a', 10);
    if (c.camFx) { c.flash = 0.6; c.flashC = '#e9d5ff'; c.zp = 0.16; c.kick = 1; }
    m.fx.addShake(16); m.hitstop = Math.max(m.hitstop, hit ? 0.1 : 0.05);
  },
  // ---------- INFERNO OVERDRIVE: combo de 3 + finalização
  infernoStart(a, e) {
    a.jab = 0; a.jt = 0; a.fin = false; a.whiff = false; a.ix = this.x + this.facing * 36; a.iy = this.y - 55;
  },
  infernoCombo(a, e, dt) {
    const m = this.m, c = m.cine; let dir = this.facing;
    c.tZoom = Math.max(c.tZoom, 1.14); c.tDim = 0.12; c.zx = this.x + dir * 30; c.zy = this.y - 60;
    if (e) { this.facing = dir = e.cx >= this.x ? 1 : -1; }
    a.jt += dt;
    const ix = this.x + dir * 40, iy = this.y - 60;
    if (!a.fin && a.jab < 3 && a.jt >= 0.17 * a.jab) {
      a.jab++; a.cur = a.jab;
      const hit = this.awkStrike(e, {rx: 92, ry: 100, share: 0.12, kx: 220, ky: -60, blast: 0, blastShare: 0});
      if (hit) a.hit = true;
      SFX.play('awk_inferno_jab');
      m.fx.burst(ix, iy, 10, 520, 0.3, 3, '#fde047', 100, 0, dir > 0 ? 0 : Math.PI, 2.2); m.fx.burst(ix, iy, 6, 300, 0.35, 4, '#fb923c', -50, 1);
      m.addShock(ix, iy, 6, 80, 0.2, '#fde047', 4); m.fx.addShake(5);
      if (hit) m.hitstop = Math.max(m.hitstop, 0.03);
    }
    if (!a.fin && a.jab >= 3 && a.jt >= 0.17 * 3 + 0.2) {
      a.fin = true; a.ft = 0;
      const hit = this.awkStrike(e, {rx: 95, ry: 105, share: 0.64, kx: 1250, ky: -1000, blast: 190, blastShare: 0.35});
      if (hit) a.hit = true; a.whiff = !a.hit;
      SFX.play('awk_inferno_boom');
      const fx = ix + dir * 14;
      a.ix = fx; a.iy = iy;
      m.fx.burst(fx, iy, 40, 820, 0.9, 5, '#fb923c', 400, 0); m.fx.burst(fx, iy, 22, 600, 0.7, 8, '#7f1d1d', -120, 1); m.fx.burst(fx, iy, 16, 1000, 0.4, 3, '#fde047', 0, 0);
      m.addShock(fx, iy, 10, 300, 0.5, '#fde047', 9); m.addShock(fx, iy, 10, 430, 0.7, '#fb923c', 7); m.addShock(fx, iy, 10, 560, 0.9, '#7f1d1d', 5);
      if (c.camFx) { c.flash = 0.55; c.flashC = '#ffd9a0'; c.zp = 0.18; c.kick = 1; }
      m.fx.addShake(18); m.hitstop = Math.max(m.hitstop, hit ? 0.1 : 0.05);
    }
    if (a.fin) { a.ft += dt; c.tZoom = Math.max(c.tZoom, 1.18); if (a.ft >= 0.28) { a.ph = 'rec'; a.lt = 0; } }
  },
  // ---------- CELESTIAL IMPACT: pilar de luz
  celestialImpact(a, e) {
    const m = this.m, c = m.cine, dir = this.facing, ix = this.x + dir * 34, iy = this.y - 55;
    a.ix = ix; a.iy = iy;
    const hit = this.awkStrike(e, {rx: 100, ry: 125, share: 0.85, kx: 1050, ky: -1250, blast: 270, blastShare: 0.45});
    a.hit = hit; a.whiff = !hit;
    // onda de energia varrendo a arena (empurra quem estiver no caminho, sem dano)
    if (e && e.alive && !hit) { const d = Math.abs(e.cx - ix); if (d < 700 && !this.awkRegion(e, 270, 300)) { e.vx += Math.sign(e.cx - ix || 1) * 520 * (1 - d / 700); e.vy = Math.min(e.vy, -300 * (1 - d / 700)); } }
    SFX.play('awk_celestial_hit');
    m.fx.burst(ix, iy, 40, 760, 1.0, 4, '#fde68a', 120, 1); m.fx.burst(ix, iy, 24, 900, 0.8, 3, '#ffffff', 0, 0); m.fx.burst(ix, iy, 16, 540, 1.2, 5, '#bae6fd', -80, 1);
    m.addShock(ix, iy, 10, 260, 0.45, '#ffffff', 10); m.addShock(ix, iy, 10, 480, 0.75, '#fde68a', 8); m.addShock(ix, iy, 10, 760, 1.1, '#bae6fd', 6);
    m.addBeam(ix, 0.9, '#fff7d6');
    if (c.camFx) { c.flash = 0.95; c.flashC = '#ffffff'; c.zp = 0.15; c.kick = 1; }
    m.fx.addShake(14); m.hitstop = Math.max(m.hitstop, hit ? 0.1 : 0.05);
  },
  // ---------- pose
  awkPose() {
    const a = this.awk, T = this.T, fx = this.facing, k = _kf, t = this.m.time;
    const tt = AWK_T[a.type];
    let rows, u;
    if (a.type === 'void') {
      if (a.ph === 'prep') { rows = KF.void_prep; u = a.lt / tt.prep; }
      else if (a.ph === 'dash') { rows = KF.void_dash; u = a.lt / tt.dash; }
      else if (a.ph === 'strike') { rows = KF.void_hit; u = a.lt / tt.hold; }
      else { rows = KF.void_rec; u = a.lt / tt.rec; }
    } else if (a.type === 'inferno') {
      if (a.ph === 'prep') { rows = KF.inf_prep; u = a.lt / tt.prep; }
      else if (a.ph === 'dash') { rows = KF.inf_dash; u = a.lt / tt.dash; }
      else if (a.ph === 'strike') {
        if (a.fin) { rows = KF.inf_fin; u = a.ft / 0.28; }
        else { rows = (a.jab % 2) ? KF.inf_jabR : KF.inf_jabL; u = ((a.jt - 0.17 * Math.max(0, a.jab - 1)) / 0.17); }
      } else { rows = KF.inf_rec; u = a.lt / tt.rec; }
    } else {
      if (a.ph === 'prep') { rows = KF.cel_prep; u = a.lt / tt.prep; }
      else if (a.ph === 'blink') { rows = KF.cel_prep; u = 1; }
      else if (a.ph === 'strike') { rows = KF.cel_hit; u = a.lt / tt.hold; }
      else { rows = KF.cel_rec; u = a.lt / tt.rec; }
    }
    kfs(rows, u, k);
    const lean = k[1] * fx, crouch = k[2], stance = k[3], shake = (a.ph === 'prep' ? Math.sin(t * 60) * 0.9 * a.aura : 0);
    let hipY = this.y - 44 + crouch;
    if (!this.grounded) hipY += 3;
    const hip = T[HIP], ch = T[CHEST], hd = T[HEAD];
    hip.x = this.x + shake; hip.y = hipY;
    ch.x = hip.x + lean; ch.y = hip.y - 30 + (crouch * 0.1);
    hd.x = ch.x + lean * 0.35 + fx * 2; hd.y = ch.y - 22;
    // pernas
    for (let i = 0; i < 2; i++) {
      const front = i === 1;
      const fxp = this.x + fx * (front ? stance : -stance * 0.95), fyp = this.y - (front ? 0 : k[8]);
      ik(hip.x, hip.y, fxp, fyp, 22, 22, -fx, _o);
      const kn = T[front ? KNR : KNL], ft = T[front ? FTR : FTL];
      kn.x = _o.ex; kn.y = _o.ey; ft.x = _o.hx; ft.y = _o.hy;
    }
    ik(ch.x, ch.y, ch.x + fx * k[6], ch.y + k[7], 18, 18, fx, _o); T[ELL].x = _o.ex; T[ELL].y = _o.ey; T[HDL].x = _o.hx; T[HDL].y = _o.hy;
    ik(ch.x, ch.y, ch.x + fx * k[4], ch.y + k[5], 18, 18, fx, _o); T[ELR].x = _o.ex; T[ELR].y = _o.ey; T[HDR].x = _o.hx; T[HDR].y = _o.hy;
    this.wAng = -0.9;
  },
});

Object.assign(Match.prototype, {
  addShock(x, y, r0, r1, life, col, w) { const s = this.cine.shocks; if (s.length < 14) s.push({x, y, r0, r1, l: life, L: life, c: col, w}); },
  addBeam(x, life, col) { const b = this.cine.beams; if (b.length < 3) b.push({x, l: life, L: life, c: col}); },
  updateCine(dt) {
    const c = this.cine;
    if (!c.camFx) { c.tDim = 0; c.tZoom = 1; c.tLight = 0; c.tDist = 0; c.flash = 0; c.zp = 0; c.kick = 0; }
    if (c.zoom < 1.02) { c.cx = c.zx; c.cy = c.zy; } else { const kc = Math.min(1, dt * 10); c.cx += (c.zx - c.cx) * kc; c.cy += (c.zy - c.cy) * kc; }
    const k = Math.min(1, dt * 6);
    c.dim += (c.tDim - c.dim) * k; c.light += (c.tLight - c.light) * k; c.dist += (c.tDist - c.dist) * Math.min(1, dt * 8);
    c.zp *= Math.pow(0.02, dt); c.kick *= Math.pow(0.02, dt);
    c.zoom += ((c.tZoom + c.zp) - c.zoom) * Math.min(1, dt * 9);
    if (c.flash > 0) c.flash = Math.max(0, c.flash - dt * 2.4);
    if (c.dim < 0.004) c.dim = 0; if (c.light < 0.004) c.light = 0; if (c.dist < 0.004) c.dist = 0;
    for (let i = c.shocks.length - 1; i >= 0; i--) { c.shocks[i].l -= dt; if (c.shocks[i].l <= 0) c.shocks.splice(i, 1); }
    for (let i = c.beams.length - 1; i >= 0; i--) { c.beams[i].l -= dt; if (c.beams[i].l <= 0) c.beams.splice(i, 1); }
  },
  // prévia dos cosméticos: ninguém sofre dano real, nada é consumido de partida
  keepPreview() {
    const h = this.fighters[0], d = this.fighters[1];
    h.energy = this.pvHold ? 0 : 100; d.hp = d.maxhp; h.hp = h.maxhp; h.invuln = d.invuln = 0;
    if (!d.alive) { d.reset({x: 800, y: 600}, false); d.invuln = 0; }
    if (d.cy > 760 || d.cx < 20 || d.cx > WORLD_W - 20) { d.reset({x: 800, y: 600}, false); d.invuln = 0; }
    if (!h.alive) { h.reset({x: 430, y: 600}, false); h.invuln = 0; }
  },
});

'use strict';
/* STICK MAYHEM v1.3.0 — FATALITIES: 8 finalizações cinematográficas.
   Rodam em uma cena isolada (Match mode 'fatality'): nada de dano, placar ou vidas — só coreografia + ragdoll.
   Cada sequência tem animação, efeitos, câmera e duração próprios (não são trocas de cor). */

// poses [inclinação, agachar, passada, mão frente x, y, mão trás x, y, pé trás elevado]  (mãos relativas ao peito)
const FP = {
  idle: [0, 0, 8, 12, 24, -4, 26, 0], guard: [4, 6, 12, 22, -4, 14, -2, 0], punR: [14, 7, 16, 38, -2, 8, 6, 4], punL: [14, 7, 16, 10, 4, 38, -2, 4],
  wind: [-6, 8, 14, -10, 4, 20, -4, 0], windBig: [-12, 11, 17, -20, 0, 24, -8, 0], up: [0, -2, 10, 14, -34, -10, -34, 0], upWide: [0, -3, 12, 26, -36, -18, -34, 0],
  point: [8, 4, 14, 36, -8, -6, 10, 0], slam: [14, 12, 18, 26, 28, 14, 26, 0], crouch: [4, 16, 16, 20, 14, 8, 16, 0], lev: [0, 0, 5, 30, -12, -20, -12, 10],
  hurt: [-10, 12, 10, -4, 22, -2, 24, 0], stagger: [-16, 10, 12, -8, 18, -4, 20, 0], slash: [16, 9, 20, 34, -14, -6, 4, 4], slashB: [-14, 9, 20, -30, -20, 6, 0, 4],
  fistUp: [0, 0, 10, 10, -38, -6, 22, 0], flex: [0, 2, 10, 22, -14, -22, -14, 0], shield: [-8, 10, 14, 12, -14, 6, -12, 0], thrustD: [10, 8, 16, 24, 20, 12, 24, 0],
  fist2: [6, 6, 14, 20, -30, -14, -30, 0], spread: [0, 0, 12, 30, -4, -30, -4, 0], cross: [0, 2, 10, 14, -6, -14, -6, 0], skyR: [4, 2, 12, 20, -38, -4, 22, 0],
  limp: [-4, 4, 6, 2, 30, -2, 30, 6], sheath: [-8, 14, 18, 24, 12, -10, 8, 0],
};
const easeIO = u => u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);
const ramp = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
function once(S, k) { if (S[k]) return false; S[k] = 1; return true; }
function pz(f, a, b, u) {
  const A = typeof a === 'string' ? FP[a] : a, B = b === undefined ? A : (typeof b === 'string' ? FP[b] : b);
  const o = f.fk || (f.fk = new Array(8).fill(0)); u = clamp(u === undefined ? 1 : u, 0, 1);
  for (let i = 0; i < 8; i++) o[i] = A[i] + (B[i] - A[i]) * u;
}
function fcam(m, x, y, z) { const c = m.cine; c.zx = x; c.zy = y; c.tZoom = z; }
function fflash(m, col, v) { const c = m.cine; c.flash = v; c.flashC = col; }

Object.assign(Fighter.prototype, {
  // pose por script (mesma ideia do awkPose, mas com tabela livre e caminhada opcional)
  scriptPose(k, walk) {
    const T = this.T, fx = this.facing, lean = k[0] * fx, crouch = k[1], stance = k[2];
    const hip = T[HIP], ch = T[CHEST], hd = T[HEAD];
    hip.x = this.x; hip.y = this.y - 44 + crouch;
    ch.x = hip.x + lean; ch.y = hip.y - 30 + crouch * 0.1;
    hd.x = ch.x + lean * 0.35 + fx * 2; hd.y = ch.y - 22;
    for (let i = 0; i < 2; i++) {
      const front = i === 1; let fxp, fyp;
      if (walk !== null && walk !== undefined) { const ph = walk + i * Math.PI; fxp = this.x + fx * (front ? 7 : -7) + fx * Math.sin(ph) * 20; fyp = this.y - Math.max(0, Math.cos(ph)) * 13; }
      else { fxp = this.x + fx * (front ? stance : -stance * 0.95); fyp = this.y - (front ? 0 : k[7]); }
      ik(hip.x, hip.y, fxp, fyp, 22, 22, -fx, _o);
      const kn = T[front ? KNR : KNL], ft = T[front ? FTR : FTL]; kn.x = _o.ex; kn.y = _o.ey; ft.x = _o.hx; ft.y = _o.hy;
    }
    ik(ch.x, ch.y, ch.x + fx * k[5], ch.y + k[6], 18, 18, fx, _o); T[ELL].x = _o.ex; T[ELL].y = _o.ey; T[HDL].x = _o.hx; T[HDL].y = _o.hy;
    ik(ch.x, ch.y, ch.x + fx * k[3], ch.y + k[4], 18, 18, fx, _o); T[ELR].x = _o.ex; T[ELR].y = _o.ey; T[HDR].x = _o.hx; T[HDR].y = _o.hy;
    this.wAng = -0.9;
  },
  fatBody(dt) {
    if (this.ragdoll) { this.stepRagdoll(dt); this.capeStep(dt); return; }
    if (this.fk) { this.scriptPose(this.fk, this.fw); this.smoothPose(this.fs || 1); }
    this.capeStep(dt);
  },
  fatSnap() {   // encaixa o corpo na pose atual de uma vez (sem suavização)
    this.vx = this.vy = 0; this.ragdoll = false; this.scriptPose(this.fk, this.fw);
    for (let i = 0; i < 11; i++) { const p = this.pts[i], t = this.T[i]; p.x = p.px = t.x; p.y = p.py = t.y; }
    this.capeReset();
  },
});

const FATSEQ = {};
Object.assign(Match.prototype, {
  fatStart(id) {
    const m = this, F = this.fighters, h = F[0], v = F[1];
    m.plats = m.plats.filter(p => !p.pad);                    // reinício (prévia em laço): remove o palco extra anterior
    const cn = m.cine; cn.dim = cn.tDim = cn.light = cn.tLight = cn.flash = cn.dist = cn.tDist = cn.zp = cn.kick = cn.rot = 0; cn.zoom = cn.tZoom = 1; cn.shocks.length = 0; cn.beams.length = 0;
    m.fx.rings.length = 0; m.fx.texts.length = 0; m.fx.beams.length = 0; m.fx.shake = 0; for (const p of m.fx.pool) p.l = 0;
    let best = null;
    for (const arenaPlat of this.arena.plats) { if (!arenaPlat.solid || arenaPlat.move || arenaPlat.w < 300 || arenaPlat.h > 400) continue; if (!best || arenaPlat.w > best.w) best = arenaPlat; }
    const gy = best ? best.y : 560, cx = 640;
    // palco limpo: um piso contínuo (com o visual da arena) e paredes invisíveis, para o ragdoll nunca cair no abismo
    const mk = (x, y, w, h, o) => Object.assign({x, y, w, h, solid: true, bx: x, by: y, dx: 0, dy: 0, pad: true}, o || {});
    m.plats = [mk(-60, gy, 1400, 160, best && best.ice ? {ice: true} : null), mk(-120, -600, 100, 2000, {inv: true}), mk(WORLD_W + 20, -600, 100, 2000, {inv: true})];
    const S = FATSEQ[id]; if (!S) throw new Error('fatality desconhecida: ' + id);
    this.stage = {cx, gy};
    this.fat = {id, t: 0, dur: S.dur, impact: S.impact, done: false, S: {}, bars: 0, name: FATS[id].name};
    this.timeScale = 1; this.cine.rot = 0;
    for (const f of F) { f.hidden = false; f.fScale = 1; f.fw = null; f.fs = 1; f.y = gy; f.vx = f.vy = 0; f.ragdoll = false; f.alive = true; f.hp = f.maxhp; f.invuln = 0; f.celebrate = false; f.wp = null; }
    h.facing = 1; v.facing = -1; h.x = cx - 240; v.x = cx + 90;
    pz(h, 'idle'); pz(v, 'hurt'); h.fatSnap(); v.fatSnap();
    S.init && S.init(m, h, v, this.fat.S, this.stage);
  },
  fatUpdate(dt) {
    const f = this.fat; if (!f) return;
    const h = this.fighters[0], v = this.fighters[1], st = this.stage;
    this.timeScale = 1; this.cine.rot = this.cine.rot || 0;
    f.t += dt; f.bars = Math.min(1, f.t / 0.5);
    FATSEQ[f.id].step(this, h, v, f.t, dt, f.S, st);
    // rede de segurança: oponente que sair do cenário volta ao palco, deitado
    if (v.ragdoll && !v.hidden && (v.pts[HIP].y > st.gy + 260 || v.pts[HIP].x < -120 || v.pts[HIP].x > WORLD_W + 120)) {
      v.ragdoll = false; v.x = st.cx + 160; v.y = st.gy; pz(v, 'limp'); v.fatSnap(); v.toRagdoll(40, 20, 99);
    }
    if (!f.done && f.t >= f.dur) f.done = true;
  },
  fatHit(x, y, col, big) {   // pequeno "pacote" de impacto reutilizável
    const m = this;
    m.fx.burst(x, y, big ? 26 : 12, big ? 760 : 520, big ? 0.7 : 0.4, 4, col, 200, 0);
    m.addShock(x, y, 8, big ? 360 : 140, big ? 0.6 : 0.3, col, big ? 9 : 5);
    m.fx.addShake(big ? 16 : 6);
  },
});

/* ============ 1. IRON FIST ============ */
FATSEQ.iron = {
  dur: 6.2, impact: 3.32,
  init(m, h, v, S) { S.n = 0; S.glow = 0; },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, P = [1.5, 1.72, 1.94, 2.16, 2.38], vb = cx + 90;
    const mid = (h.x + v.x) / 2;
    if (t < 1.1) {
      const u = ramp(t, 0, 1.1); h.x = lerp(cx - 240, cx - 36, easeIO(u)); h.fw = t * 15; pz(h, 'idle', 'guard', ramp(t, 0.7, 1.1)); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5));
      fcam(m, mid, gy - 90, 1.2 + 0.15 * u); m.cine.tDim = 0.25 * u;
    } else if (t < P[0]) { h.fw = null; pz(h, 'guard', 'wind', ramp(t, 1.1, 1.5)); pz(v, 'stagger'); fcam(m, mid, gy - 90, 1.4); m.cine.tDim = 0.25; }
    else if (t < 2.62) {
      h.fw = null; let i = 0; while (i < 4 && t >= P[i + 1]) i++;
      const lt = (t - P[i]) / 0.22, pulse = Math.sin(clamp(lt, 0, 1) * Math.PI);
      pz(h, 'guard', i % 2 ? 'punL' : 'punR', pulse);
      if (S.n <= i && lt >= 0.3) {
        S.n = i + 1; const hp = h.pts[i % 2 ? HDL : HDR];
        m.fatHit(hp.x + 8, hp.y, FATS.iron.c, false); SFX.play('fat_punch'); m.fx.text(v.x, gy - 150, ['POW', 'BAM', 'CRACK', 'WHAM', 'BOOM'][i], '#fde047');
        v.x = vb + 7 * S.n; m.cine.zp = 0.06; v.flash = 0.08;
      }
      pz(v, 'stagger', 'hurt', 0.5 + 0.5 * Math.sin(t * 38)); v.fk[0] = -16 - 8 * pulse;
      fcam(m, mid, gy - 90, 1.45);
    } else if (t < 3.3) {
      const u = ramp(t, 2.62, 3.3); pz(h, 'wind', 'windBig', u); S.glow = u; pz(v, 'stagger'); v.x = vb + 35;
      m.timeScale = lerp(1, 0.4, u); fcam(m, mid, gy - 100, 1.5 + 0.35 * u); m.cine.tDim = 0.25 + 0.3 * u;
      if (Math.random() < 0.6) { const hp = h.pts[HDR]; m.fx.add(hp.x + rnd(-10, 10), hp.y + rnd(-10, 10), rnd(-40, 40), -rnd(40, 140), 0.4, 3, Math.random() < 0.5 ? '#fde047' : '#fb923c', 0, 1); }
      if (t > 2.7 && once(S, 'ch')) SFX.play('fat_charge');
    } else {
      const lt = t - 3.3;
      if (once(S, 'hit')) {
        pz(h, 'punR'); h.fk[0] = 20; h.fk[3] = 42;
        const hp = h.pts[HDR]; m.fatHit(hp.x + 20, hp.y, '#ffffff', true); m.addShock(hp.x + 20, hp.y, 10, 560, 0.8, '#fbbf24', 10); m.addShock(hp.x + 20, hp.y, 10, 760, 1.0, '#f97316', 7);
        fflash(m, '#fff3c4', 0.9); SFX.play('fat_mega'); m.cine.zp = 0.2; m.cine.kick = 1;
        v.fScale = 1; v.toRagdoll(2100, -850, 99); S.glow = 0; m.fx.burst(v.pts[HIP].x, v.pts[HIP].y, 20, 600, 0.6, 4, '#fff', 0, 0);
      }
      m.timeScale = lt < 0.8 ? 0.3 : lerp(0.3, 1, ramp(lt, 0.8, 1.3));
      const vx = clamp(v.pts[HIP].x, 200, 1080), vy = clamp(v.pts[HIP].y, 120, gy);
      if (lt < 1.2) fcam(m, lerp(h.x, vx, 0.7), Math.min(gy - 100, vy), 1.25); else fcam(m, (h.x + vx) / 2, gy - 120, 1.1);
      m.cine.tDim = 0.3 * (1 - ramp(lt, 1, 2));
      if (lt < 0.45) pz(h, 'punR'); else pz(h, 'punR', 'fistUp', ramp(lt, 0.45, 1.0));
      if (lt > 2.3) pz(h, 'fistUp', 'flex', 0.5 + 0.5 * Math.sin(t * 6));
    }
  },
};

/* ============ 2. THUNDER GOD ============ */
FATSEQ.thunder = {
  dur: 6.6, impact: 3.6,
  init(m, h, v, S) { S.nf = 1.2; S.bolt = null; S.mini = [{x: 0, t0: -9}, {x: 0, t0: -9}, {x: 0, t0: -9}]; S.mn = 0; S.cl = 0; },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, c = m.cine, mid = (h.x + v.x) / 2;
    if (t < 1.0) { const u = ramp(t, 0, 1); h.x = lerp(cx - 240, cx - 150, easeIO(u)); h.fw = t * 14; pz(h, 'idle'); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5)); fcam(m, mid, gy - 100, 1.15); }
    else if (t < 3.0) {
      h.fw = null; const u = ramp(t, 1.0, 3.0); pz(h, 'idle', 'up', ramp(t, 1, 1.5)); h.fk[3] += Math.sin(t * 40) * 1.2; S.cl = ramp(t, 1, 2);
      c.tDim = 0.7 * Math.min(1, u * 2); fcam(m, h.x + 40, gy - 130, 1.25 + 0.1 * u); pz(v, 'stagger');
      if (once(S, 'c0')) SFX.play('fat_charge');
      if (t > S.nf) { S.nf = t + lerp(0.5, 0.12, u); c.flash = 0.35; c.flashC = '#bfdbfe'; m.fx.addShake(4); if (Math.random() < 0.6) SFX.play('fat_rumble'); }
      if (Math.random() < 0.5) m.fx.add(h.x + rnd(-40, 40), h.y - rnd(20, 130), rnd(-120, 120), rnd(-120, 40), 0.25, 2.5, Math.random() < 0.5 ? '#fde047' : '#93c5fd', 0, 0);
    } else if (t < 3.6) {
      pz(h, 'up', 'point', ramp(t, 3.0, 3.3)); S.cl = 1; c.tDim = 0.78; fcam(m, v.x - 40, gy - 110, 1.5); m.timeScale = lerp(1, 0.5, ramp(t, 3.2, 3.6)); pz(v, 'stagger');
      if (once(S, 'tel')) SFX.play('fat_charge');
    } else {
      const lt = t - 3.6; S.cl = 1;
      if (once(S, 'strike')) {
        S.bolt = {x: v.x, t0: t, pts: []}; let x = v.x + rnd(-30, 30); const n = 12;
        for (let i = 0; i <= n; i++) { S.bolt.pts.push(i === n ? v.x : x, -40 + (gy - 120 + 40) * i / n); x += rnd(-46, 46) * (1 - i / n); }
        m.fatHit(v.x, gy - 110, '#fde047', true); m.addShock(v.x, gy, 10, 520, 0.7, '#93c5fd', 8); m.addShock(v.x, gy, 10, 760, 0.9, '#ffffff', 5);
        fflash(m, '#ffffff', 1); c.zp = 0.15; c.kick = 1; SFX.play('fat_thunder'); m.fx.burst(v.x, gy - 100, 40, 800, 0.8, 3, '#fde047', 300, 0);
      }
      c.tDim = 0.78 * (1 - ramp(lt, 1.8, 3.0)) + 0.1;
      m.timeScale = lt < 0.7 ? 0.35 : lerp(0.35, 1, ramp(lt, 0.7, 1.2));
      if (lt < 0.9) { v.x = cx + 90 + Math.sin(t * 90) * 3; pz(v, 'stagger'); v.fk[3] = -22 + Math.sin(t * 70) * 10; v.fk[4] = -20; v.flash = 0.08 + ((t * 20) | 0) % 2 * 0.1; if (Math.random() < 0.7) m.fx.add(v.x + rnd(-24, 24), v.y - rnd(0, 100), rnd(-200, 200), rnd(-200, 100), 0.3, 3, '#fde047', 0, 0); }
      else if (once(S, 'pop')) { v.toRagdoll(260, -900, 99); m.fx.burst(v.x, v.y - 50, 14, 400, 0.5, 3, '#93c5fd', 300, 0); }
      for (let i = 0; i < 3; i++) if (lt > 1.0 + i * 0.35 && !S['m' + i]) { S['m' + i] = 1; S.mini[i].x = rnd(cx - 380, cx + 400); S.mini[i].t0 = t; m.fx.burst(S.mini[i].x, gy, 14, 500, 0.5, 3, '#fde047', 300, 0); SFX.play('fat_zap'); c.flash = 0.4; c.flashC = '#bfdbfe'; }
      if (lt < 1.2) fcam(m, v.x, gy - 100, 1.45); else fcam(m, mid, gy - 120, 1.2);
      if (lt < 1.1) pz(h, 'point'); else pz(h, 'point', 'up', ramp(lt, 1.1, 1.5));
      if (lt > 1.6 && Math.random() < 0.4) m.fx.add(h.x + rnd(-30, 30), h.y - rnd(20, 130), rnd(-100, 100), rnd(-100, 20), 0.25, 2.5, '#fde047', 0, 0);
    }
  },
};

/* ============ 3. METEOR CRASH ============ */
FATSEQ.meteor = {
  dur: 6.9, impact: 3.9,
  init(m, h, v, S, st) { S.m = {on: false, x: 0, y: 0, r: 46}; S.tr = []; for (let i = 0; i < 16; i++) S.tr.push(0, 0); S.tn = 0; S.cr = 0; S.glow = 0; },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, c = m.cine, mid = (h.x + v.x) / 2, vx0 = cx + 90, M = S.m;
    S.glow = ramp(t, 1.0, 3.9);
    if (t < 1.0) { h.x = lerp(cx - 240, cx - 150, easeIO(ramp(t, 0, 1))); h.fw = t * 14; pz(h, 'idle'); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5)); fcam(m, mid, gy - 100, 1.12); }
    else if (t < 3.9) {
      h.fw = null; pz(h, 'idle', 'crouch', ramp(t, 1, 1.4)); if (t > 1.4) pz(h, 'crouch', 'skyR', ramp(t, 1.4, 2.0));
      pz(v, 'stagger'); if (v.fk) v.fk[3] += Math.sin(t * 7) * 2;
      c.tDim = 0.5 * Math.min(1, (t - 1) / 0.8); c.tLight = 0.08 * S.glow; c.lightC = '#fb923c';
      if (once(S, 'c0')) SFX.play('fat_charge');
      if (t >= 2.0) {
        if (!M.on) { M.on = true; SFX.play('fat_meteor'); }
        const u = ramp(t, 2.0, 3.9), k = Math.pow(u, 1.7), sx = cx + 860, sy = -260, tx = vx0, ty = gy - 60;
        M.x = sx + (tx - sx) * k; M.y = sy + (ty - sy) * k; M.r = 30 + 32 * u;
        S.tn = (S.tn + 1) % 16; S.tr[S.tn * 2] = M.x; S.tr[S.tn * 2 + 1] = M.y;
        for (let i = 0; i < 3; i++) m.fx.add(M.x + rnd(-14, 14), M.y + rnd(-14, 14), rnd(60, 260) * (0.5 + u), -rnd(40, 200), rnd(0.3, 0.7), rnd(3, 7), Math.random() < 0.5 ? '#fb923c' : (Math.random() < 0.5 ? '#fde047' : '#7f1d1d'), 50, 1);
        m.timeScale = lerp(1, 0.4, ramp(t, 3.2, 3.9));
        fcam(m, lerp(mid, (M.x + vx0) / 2, 0.4 * u), lerp(gy - 110, (M.y + gy) / 2, 0.45 * u), 1.15 + 0.4 * u);
        m.fx.addShake(u * 3);
      }
    } else {
      const lt = t - 3.9;
      if (once(S, 'hit')) {
        M.on = false; S.cr = 1;
        m.fatHit(vx0, gy - 20, '#fff3c4', true); m.addShock(vx0, gy, 10, 560, 0.7, '#fb923c', 10); m.addShock(vx0, gy, 10, 820, 0.95, '#ef4444', 8); m.addShock(vx0, gy, 10, 1100, 1.2, '#7f1d1d', 6);
        m.fx.burst(vx0, gy - 20, 44, 900, 1.0, 5, '#fb923c', 600, 0); m.fx.burst(vx0, gy - 20, 24, 620, 1.2, 8, '#57534e', 900, 2); m.fx.burst(vx0, gy - 20, 18, 700, 0.8, 7, '#44403c', 900, 2);
        fflash(m, '#fff1c9', 1); c.zp = 0.22; c.kick = 1; SFX.play('fat_boom'); v.toRagdoll(720, -1500, 99);
      }
      m.timeScale = lt < 0.9 ? 0.3 : lerp(0.3, 1, ramp(lt, 0.9, 1.5));
      c.tDim = 0.5 * (1 - ramp(lt, 0.5, 2.2)); c.tLight = 0.08 * (1 - ramp(lt, 0, 0.8));
      const hip = v.pts[HIP]; if (lt < 1.4) fcam(m, lerp(vx0, clamp(hip.x, 200, 1080), 0.6), Math.min(gy - 100, hip.y), 1.3); else fcam(m, mid, gy - 110, 1.15);
      if (lt < 0.45) { pz(h, 'skyR', 'shield', ramp(lt, 0, 0.12)); h.x = lerp(cx - 150, cx - 190, easeO(ramp(lt, 0, 0.4))); } else pz(h, 'shield', 'flex', ramp(lt, 0.5, 1.4));
      if (lt > 2.1) pz(h, 'flex', 'fistUp', 0.5 + 0.5 * Math.sin(t * 5));
      if (lt > 0.2 && lt < 2.6 && Math.random() < 0.7) m.fx.add(rnd(vx0 - 600, vx0 + 500), -20, rnd(-30, 30), rnd(60, 160), 1.6, rnd(2, 4), Math.random() < 0.5 ? '#fb923c' : '#fde047', 60, 1);
      S.cr = 1 - ramp(lt, 2.5, 3.0) * 0.4;
    }
  },
};

/* ============ 4. SHADOW EXECUTION ============ */
FATSEQ.shadow = {
  dur: 6.3, impact: 3.5,
  init(m, h, v, S) {
    S.gh = []; for (let i = 0; i < 6; i++) S.gh.push(new Float32Array(22)); S.ng = 0; S.sl = []; S.smoke = 0;
    S.T = [1.45, 1.75, 2.05, 2.35, 2.65, 2.95]; S.O = [[-95, 0], [105, -70], [-60, -120], [120, 0], [-115, -45], [0, -135]]; S.burst = -9;
  },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, c = m.cine, vx0 = cx + 90, mid = (h.x + v.x) / 2;
    if (t < 0.9) { h.x = lerp(cx - 240, cx - 120, easeIO(ramp(t, 0, 0.9))); h.fw = t * 14; pz(h, 'idle'); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5)); fcam(m, mid, gy - 100, 1.15); c.tDim = 0.2 * ramp(t, 0, 0.9); }
    else if (t < 1.45) {
      h.fw = null; pz(h, 'idle', 'crouch', ramp(t, 0.9, 1.3)); c.tDim = 0.8; pz(v, 'stagger'); fcam(m, mid, gy - 100, 1.3);
      if (t > 1.3 && once(S, 'van')) { h.hidden = true; m.fx.burst(h.x, h.y - 50, 40, 420, 0.9, 6, '#1a0b33', 0, 1); m.fx.burst(h.x, h.y - 50, 20, 300, 0.8, 4, '#a78bfa', 0, 1); SFX.play('fat_vanish'); }
    } else if (t < 3.2) {
      c.tDim = 0.8; pz(v, 'stagger'); fcam(m, vx0, gy - 100, 1.5);
      for (let i = 0; i < 6; i++) {
        const T0 = S.T[i];
        if (t >= T0 && !S['s' + i]) {
          S['s' + i] = 1; const o = S.O[i], px = vx0 + o[0], py = gy + o[1];
          h.hidden = false; h.x = px; h.y = py; h.facing = o[0] < 0 ? 1 : -1; pz(h, 'slash'); h.fatSnap();
          const g = S.gh[S.ng % 6]; S.ng++; for (let k = 0; k < 11; k++) { g[k * 2] = h.pts[k].x; g[k * 2 + 1] = h.pts[k].y; }
          S.sl.push({x1: px, y1: py - 60, x2: vx0 - o[0] * 0.8, y2: gy - 60 - o[1] * 0.6 + rnd(-30, 30), t0: t});
          m.fx.burst(px, py - 55, 14, 420, 0.5, 4, '#a78bfa', 0, 1); m.addShock(vx0, gy - 60, 6, 90, 0.3, '#e9d5ff', 4); SFX.play('fat_slash'); m.fx.addShake(5);
          v.x = vx0 + (i % 2 ? 6 : -6); m.cine.zp = 0.05;
        }
        if (S['s' + i] && t > T0 + 0.13 && !S['h' + i]) { S['h' + i] = 1; h.hidden = true; m.fx.burst(h.x, h.y - 55, 8, 200, 0.5, 4, '#1a0b33', 0, 1); }
      }
      pz(v, 'stagger'); v.fk[0] = -16 + Math.sin(t * 50) * 4;
    } else if (t < 3.5) {
      if (once(S, 'back')) { h.hidden = false; h.y = gy; h.x = vx0 + 85; h.facing = 1; m.fx.burst(h.x, h.y - 55, 24, 360, 0.7, 5, '#a78bfa', 0, 1); SFX.play('fat_vanish'); }
      pz(h, 'sheath'); pz(v, 'stagger'); fcam(m, mid, gy - 90, 1.35); c.tDim = 0.8; m.timeScale = lerp(1, 0.4, ramp(t, 3.2, 3.5));
    } else {
      const lt = t - 3.5;
      if (once(S, 'boom')) {
        S.burst = t; fflash(m, '#e9d5ff', 0.9); m.addShock(vx0, gy - 60, 10, 460, 0.7, '#a78bfa', 9); m.addShock(vx0, gy - 60, 10, 700, 0.9, '#1a0b33', 7);
        m.fx.burst(vx0, gy - 60, 40, 800, 0.8, 4, '#f5f3ff', 100, 0); m.fx.burst(vx0, gy - 60, 24, 500, 1.0, 6, '#1a0b33', 0, 1); SFX.play('fat_slash'); SFX.play('fat_boom'); c.zp = 0.15; c.kick = 1; m.fx.addShake(16);
        v.toRagdoll(-650, -850, 99);
      }
      m.timeScale = lt < 0.6 ? 0.35 : lerp(0.35, 1, ramp(lt, 0.6, 1.1));
      c.tDim = 0.8 * (1 - ramp(lt, 0.8, 2.4));
      if (lt < 0.4) pz(h, 'sheath', 'idle', ramp(lt, 0.1, 0.4)); else { if (lt > 0.4 && once(S, 'turn')) h.facing = -1; pz(h, 'idle', 'fistUp', ramp(lt, 0.5, 1.2)); }
      const hip = v.pts[HIP]; fcam(m, lerp(mid, clamp(hip.x, 200, 1080), 0.5), gy - 100, lt < 1.4 ? 1.3 : 1.15);
    }
  },
};

/* ============ 5. GRAVITY BREAKER ============ */
FATSEQ.gravity = {
  dur: 6.7, impact: 3.75,
  init(m, h, v, S, st) {
    S.r = []; for (let i = 0; i < 10; i++) S.r.push({x: st.cx + rnd(-340, 360), y: st.gy, vy: 0, a: rnd(0, 6), va: rnd(-2, 2), s: rnd(10, 22), hy: rnd(80, 270), ph: rnd(0, 6), mode: 0});
    S.cr = []; for (let i = 0; i < 9; i++) S.cr.push(-3.14 + (i + rnd(0.1, 0.9)) * 3.14 / 9, rnd(110, 260)); S.cx = 0; S.on = 0; S.field = 0;
  },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, c = m.cine, vx0 = cx + 90, mid = (h.x + v.x) / 2;
    S.field = t >= 1.2 && t < 3.75 ? ramp(t, 1.2, 2.0) : 0;
    if (t < 1.0) { h.x = lerp(cx - 240, cx - 190, easeIO(ramp(t, 0, 1))); h.fw = t * 14; pz(h, 'idle'); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5)); fcam(m, mid, gy - 100, 1.12); }
    if (t >= 1.0 && t < 3.4) {
      h.fw = null; const u = ramp(t, 1.0, 1.9); h.y = gy - 70 * easeO(u) - Math.sin(t * 3) * 3; pz(h, 'idle', 'lev', u); c.tDim = 0.4 * u;
      if (once(S, 'c0')) SFX.play('fat_grav');
      const vu = easeO(ramp(t, 1.6, 2.7)); v.y = gy - 140 * vu - Math.sin(t * 2.4) * 4; pz(v, 'stagger', 'limp', vu); v.fs = 0.5;
      c.tDist = 0.5 * u; c.dtype = 0; c.dx = vx0; c.dy = v.y - 50; c.dr = 240;
      fcam(m, mid, gy - 140, 1.3);
      for (const r of S.r) {
        if (r.mode === 0 && t > 1.0 + (r.hy - 80) / 190 * 0.8) { r.mode = 1; r.vy = -rnd(220, 420); }
        if (r.mode === 1) { r.y += r.vy * dt; r.vy += (r.y > gy - r.hy ? 0 : 0) ; if (r.y < gy - r.hy) { r.y = gy - r.hy; r.mode = 2; } r.a += r.va * dt; if (Math.random() < 0.2) m.fx.add(r.x, r.y + 10, 0, 40, 0.4, 2, '#cbd5e1', 0, 1); }
        else if (r.mode === 2) { r.a += r.va * dt; r.y = gy - r.hy + Math.sin(t * 2 + r.ph) * 8; }
      }
      if (Math.random() < 0.4) m.fx.add(vx0 + rnd(-120, 120), gy, 0, -rnd(80, 220), 0.9, 2.5, '#7dd3fc', 0, 1);
      if (t > 2.8) { pz(h, 'lev', 'fist2', ramp(t, 2.8, 3.2)); S.pull = ramp(t, 2.8, 3.4); }
    }
    if (t >= 3.4) {
      const lt = t - 3.4;
      if (t < 3.75) {
        const u = ramp(t, 3.4, 3.75); v.y = gy - 140 + 140 * u * u; pz(h, 'fist2', 'thrustD', ramp(t, 3.4, 3.6)); h.y = gy - 70; v.fs = 1;
        for (const r of S.r) { r.x += (vx0 - r.x) * dt * 3 * u; r.y += (gy - 60 - r.y) * dt * 2 * u; }
        m.timeScale = lerp(1, 0.5, u); fcam(m, vx0, gy - 100, 1.4 + 0.2 * u);
      } else {
        const it = t - 3.75;
        if (once(S, 'hit')) {
          v.y = gy; pz(v, 'limp'); v.fatSnap(); v.toRagdoll(80, -420, 99); S.cx = vx0; S.on = 1;
          m.fatHit(vx0, gy - 6, '#bae6fd', true); m.addShock(vx0, gy - 6, 10, 640, 0.8, '#38bdf8', 10); m.addShock(vx0, gy - 6, 10, 960, 1.1, '#818cf8', 7);
          m.fx.burst(vx0, gy - 6, 40, 700, 0.9, 5, '#cbd5e1', 300, 1); m.fx.burst(vx0, gy - 6, 30, 900, 0.6, 3, '#7dd3fc', 400, 0);
          fflash(m, '#dbeafe', 0.8); c.zp = 0.2; c.kick = 1; SFX.play('fat_slam'); S.field = 0;
          for (const r of S.r) { r.mode = 3; r.vy = -rnd(0, 380); r.va = rnd(-5, 5); }
        }
        m.timeScale = it < 0.7 ? 0.35 : lerp(0.35, 1, ramp(it, 0.7, 1.2));
        h.y = lerp(gy - 70, gy, easeO(ramp(it, 0, 0.6))); if (it < 0.5) pz(h, 'thrustD', 'slam', ramp(it, 0, 0.3)); else pz(h, 'slam', 'flex', ramp(it, 0.7, 1.6));
        if (it > 2.2) pz(h, 'flex', 'fistUp', 0.5 + 0.5 * Math.sin(t * 5));
        c.tDim = 0.4 * (1 - ramp(it, 0, 1.6)); c.tDist = 0.6 * (1 - ramp(it, 0, 0.4)); c.dx = vx0; c.dy = gy - 40; c.dr = 300;
        for (const r of S.r) if (r.mode === 3) { r.vy += 1500 * dt; r.y += r.vy * dt; r.x += Math.sin(r.a) * 40 * dt; r.a += r.va * dt; if (r.y > gy - r.s * 0.4) { r.y = gy - r.s * 0.4; r.vy = r.vy > 160 ? -r.vy * 0.3 : 0; r.va *= 0.6; if (r.vy < -60) m.fx.burst(r.x, gy, 4, 220, 0.4, 3, '#94a3b8', 300, 1); } }
        const hip = v.pts[HIP]; fcam(m, lerp(h.x, hip.x, 0.6), gy - 110, 1.3);
      }
    }
  },
};

/* ============ 6. BLADE STORM ============ */
FATSEQ.blade = {
  dur: 6.4, impact: 3.55,
  init(m, h, v, S) { S.b = new Float32Array(18); S.on = 1; S.tr = new Float32Array(24); S.tn = 0; S.xs = 0; S.spin = 0; S.mode = 0; S.fx = -9; },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, c = m.cine, vx0 = cx + 90, mid = (h.x + v.x) / 2;
    const oc = {x: h.x, y: h.y - 62}, vc = {x: vx0, y: gy - 62};
    S.spin += dt * (t < 2.2 ? lerp(3, 13, ramp(t, 1, 2.2)) : t < 3.0 ? 14 : 6);
    if (t < 1.0) { h.x = lerp(cx - 240, cx - 130, easeIO(ramp(t, 0, 1))); h.fw = t * 14; pz(h, 'idle'); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5)); fcam(m, mid, gy - 100, 1.12); S.mode = 0; }
    else if (t < 3.0) {
      h.fw = null; pz(h, 'idle', 'spread', ramp(t, 1, 1.6)); pz(v, 'stagger'); c.tDim = 0.35 * ramp(t, 1, 1.8); fcam(m, mid, gy - 110, 1.3);
      if (once(S, 'c0')) SFX.play('fat_charge');
      const fly = easeIO(ramp(t, 2.2, 2.9));
      for (let i = 0; i < 6; i++) {
        const a = S.spin + i * 1.0472, r0 = 64, r1 = 78 + 10 * Math.sin(S.spin * 0.7 + i);
        const ox = oc.x + Math.cos(a) * r0, oy = oc.y + Math.sin(a) * r0 * 0.75, ex = vc.x + Math.cos(-a * 1.3) * r1, ey = vc.y + Math.sin(-a * 1.3) * r1 * 0.85;
        S.b[i * 3] = lerp(ox, ex, fly); S.b[i * 3 + 1] = lerp(oy, ey, fly); S.b[i * 3 + 2] = a + fly * 3;
        if (Math.random() < 0.25) m.fx.add(S.b[i * 3], S.b[i * 3 + 1], rnd(-30, 30), rnd(-30, 30), 0.3, 2.5, '#a5f3fc', 0, 1);
      }
      if (t > 2.3) { v.x = vx0 + Math.sin(t * 60) * 2; v.fk[0] = -18; }
      if (t > 2.5) pz(h, 'spread', 'slash', ramp(t, 2.5, 2.95));
    } else if (t < 3.55) {
      const u = ramp(t, 3.0, 3.22), lt = t - 3.0;
      if (once(S, 'dash')) { SFX.play('fat_whoosh'); S.xs = h.x; }
      if (t < 3.22) { h.x = lerp(S.xs, cx + 230, easeIO(u)); pz(h, 'slash'); S.tn = (S.tn + 1) % 12; S.tr[S.tn * 2] = h.x; S.tr[S.tn * 2 + 1] = h.y - 55; c.tDim = 0.35; m.fx.add(h.x, h.y - rnd(20, 90), -rnd(100, 300), 0, 0.3, 4, '#a5f3fc', 0, 1); }
      else { h.facing = 1; pz(h, 'slash', 'sheath', ramp(t, 3.22, 3.4)); }
      if (u > 0.5 && once(S, 'cross')) { m.addShock(vx0, gy - 60, 6, 130, 0.3, '#ffffff', 5); m.fx.burst(vx0, gy - 60, 16, 600, 0.4, 3, '#e0f2fe', 0, 0); m.fx.addShake(6); SFX.play('fat_slash'); }
      for (let i = 0; i < 6; i++) { const a = S.spin + i * 1.0472; S.b[i * 3] = vc.x + Math.cos(-a * 1.3) * 80; S.b[i * 3 + 1] = vc.y + Math.sin(-a * 1.3) * 68; S.b[i * 3 + 2] = a * 1.3; }
      m.timeScale = lerp(1, 0.45, ramp(t, 3.25, 3.55)); fcam(m, vx0, gy - 100, 1.45);
    } else {
      const lt = t - 3.55;
      if (once(S, 'boom')) {
        S.on = 0; S.fx = t; fflash(m, '#e0f2fe', 0.9); m.addShock(vx0, gy - 60, 10, 480, 0.7, '#67e8f9', 9); m.addShock(vx0, gy - 60, 10, 740, 0.9, '#e0f2fe', 6);
        for (let i = 0; i < 6; i++) m.fx.burst(S.b[i * 3], S.b[i * 3 + 1], 8, 600, 0.7, 3, i % 2 ? '#67e8f9' : '#ffffff', 100, 0);
        m.fx.burst(vx0, gy - 60, 30, 900, 0.7, 4, '#a5f3fc', 100, 0); SFX.play('fat_slash'); SFX.play('fat_boom'); c.zp = 0.15; c.kick = 1; m.fx.addShake(15);
        v.toRagdoll(-1300, -900, 99); h.facing = -1;
      }
      m.timeScale = lt < 0.6 ? 0.35 : lerp(0.35, 1, ramp(lt, 0.6, 1.1));
      c.tDim = 0.35 * (1 - ramp(lt, 0.5, 1.6));
      pz(h, 'sheath', 'idle', ramp(lt, 0.0, 0.5)); if (lt > 0.6) pz(h, 'idle', 'fistUp', ramp(lt, 0.6, 1.3));
      const hip = v.pts[HIP]; fcam(m, lerp(h.x, clamp(hip.x, 200, 1080), 0.5), gy - 100, lt < 1.4 ? 1.3 : 1.12);
    }
  },
};

/* ============ 7. VOID CONSUMPTION ============ */
FATSEQ.void = {
  dur: 7.0, impact: 4.3,
  init(m, h, v, S, st) { S.sx = st.cx + 70; S.sy = st.gy - 95; S.r = 0; S.core = 0; },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, c = m.cine, vx0 = cx + 90, mid = (h.x + v.x) / 2;
    if (t < 1.0) { h.x = lerp(cx - 240, cx - 170, easeIO(ramp(t, 0, 1))); h.fw = t * 14; pz(h, 'idle'); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5)); fcam(m, mid, gy - 100, 1.12); }
    else if (t < 3.2) {
      h.fw = null; pz(h, 'idle', 'point', ramp(t, 1, 1.5)); pz(v, 'stagger'); const u = ramp(t, 1.2, 3.2); S.r = 124 * easeI(u) + 8 * Math.sin(t * 9) * u;
      c.tDim = 0.62 * Math.min(1, u * 1.6 + 0.3); c.tDist = 0.9 * u; c.dtype = 0; c.dx = S.sx; c.dy = S.sy; c.dr = 120 + S.r * 1.6; fcam(m, mid, gy - 110, 1.25 + 0.25 * u);
      if (once(S, 'c0')) SFX.play('fat_void');
      h.fxPull(S.sx, S.sy, 120 + S.r * 1.6, 2, Math.random() < 0.3 ? '#f0abfc' : '#a78bfa', 0.4);
      if (u > 0.5) { v.x = vx0 - (u - 0.5) * 20; }
    } else if (t < 4.3) {
      const u = ramp(t, 3.2, 4.3), k = easeI(u);
      S.r = 124 + 14 * Math.sin(t * 20) - 30 * ramp(t, 4.0, 4.3);
      v.x = lerp(vx0 - 10, S.sx, k); v.y = lerp(gy, S.sy + 55, easeO(u)); v.fScale = lerp(1, 0.12, k);
      pz(v, 'stagger', 'limp', 0.5 + 0.5 * Math.sin(t * 24)); v.fk[3] = -20 + Math.sin(t * 30) * 14; v.fk[4] = -26 + Math.cos(t * 27) * 14; v.fs = 1;
      pz(h, 'point'); h.x = lerp(cx - 170, cx - 205, easeO(u)); h.fk[0] = -2 - 8 * u;
      c.tDim = 0.65; c.tDist = 0.95; c.dx = S.sx; c.dy = S.sy; c.dr = 300; fcam(m, S.sx - 30, gy - 105, 1.55 + 0.1 * u); m.timeScale = lerp(1, 0.6, u);
      h.fxPull(S.sx, S.sy, 280, 3, Math.random() < 0.3 ? '#f0abfc' : '#7c3aed', 0.35); m.fx.addShake(4 + 4 * u);
    } else {
      const lt = t - 4.3;
      if (once(S, 'boom')) {
        v.hidden = true; S.r = 0; fflash(m, '#f5e9ff', 1); m.addShock(S.sx, S.sy, 10, 520, 0.7, '#c084fc', 10); m.addShock(S.sx, S.sy, 10, 800, 0.95, '#1e0b3a', 9); m.addShock(S.sx, S.sy, 10, 1100, 1.2, '#f0abfc', 6);
        m.fx.burst(S.sx, S.sy, 50, 900, 1.1, 5, '#c084fc', 0, 1); m.fx.burst(S.sx, S.sy, 30, 700, 1.2, 8, '#1e0b3a', 0, 1); m.fx.burst(S.sx, S.sy, 24, 1100, 0.6, 3, '#ffffff', 0, 0);
        SFX.play('fat_boom'); c.zp = 0.2; c.kick = 1; c.dist = 1; m.fx.addShake(18);
      }
      m.timeScale = lt < 0.7 ? 0.35 : lerp(0.35, 1, ramp(lt, 0.7, 1.3));
      c.tDim = 0.65 * (1 - ramp(lt, 0.4, 2)); c.tDist = 0.7 * (1 - ramp(lt, 0, 0.6)); c.dx = S.sx; c.dy = S.sy; c.dr = 320;
      h.x = lerp(cx - 205, cx - 180, ramp(lt, 0.2, 1)); if (lt < 0.5) pz(h, 'point', 'shield', ramp(lt, 0, 0.12)); else pz(h, 'shield', 'idle', ramp(lt, 0.5, 1.1));
      if (lt > 1.2) pz(h, 'idle', 'fist2', ramp(lt, 1.2, 1.9));
      fcam(m, lerp(S.sx, mid, ramp(lt, 0.8, 1.8)), gy - 110, lerp(1.5, 1.15, ramp(lt, 0.5, 1.8)));
      if (lt < 2.2 && Math.random() < 0.5) m.fx.add(S.sx + rnd(-200, 200), S.sy + rnd(-120, 120), rnd(-30, 30), rnd(-60, 20), 1.0, rnd(2, 4), Math.random() < 0.5 ? '#c084fc' : '#1e0b3a', 0, 1);
    }
  },
};

/* ============ 8. GOD OF MAYHEM ============ */
FATSEQ.god = {
  dur: 9.8, impact: 5.1,
  init(m, h, v, S) { S.aura = 0; S.rune = 0; S.ring = 0; S.rays = 0; S.chain = 0; S.name = 0; },
  step(m, h, v, t, dt, S, st) {
    const cx = st.cx, gy = st.gy, c = m.cine, vx0 = cx + 90, mid = (h.x + v.x) / 2;
    S.rune += dt * (1 + 3 * ramp(t, 2.6, 5));
    if (t < 1.2) { h.x = lerp(cx - 240, cx - 160, easeIO(ramp(t, 0, 1.2))); h.fw = t * 14; pz(h, 'idle'); pz(v, 'hurt', 'stagger', 0.5 + 0.5 * Math.sin(t * 5)); fcam(m, mid, gy - 100, 1.12); }
    else if (t < 5.1) {
      h.fw = null; const a = ramp(t, 1.2, 2.6); S.ring = ramp(t, 1.4, 2.4); S.aura = ramp(t, 1.4, 3.0);
      if (t < 2.0) pz(h, 'idle', 'cross', ramp(t, 1.2, 1.8)); else if (t < 2.7) pz(h, 'cross', 'upWide', ramp(t, 2.0, 2.7)); else if (t < 4.4) { pz(h, 'upWide'); h.fk[3] += Math.sin(t * 7) * 3; } else pz(h, 'upWide', 'windBig', ramp(t, 4.4, 4.9));
      h.y = gy - 90 * easeO(ramp(t, 1.8, 3.4)) - Math.sin(t * 3) * 3;
      c.tDim = 0.78 * Math.min(1, a * 1.4); c.tLight = 0.05 * S.aura; c.lightC = '#f0abfc';
      c.rot = 0.13 * Math.sin(ramp(t, 1.6, 4.8) * Math.PI) * 1.0; fcam(m, mid, gy - 150, lerp(1.25, 1.65, ramp(t, 1.4, 3.0)));
      if (once(S, 'c0')) SFX.play('fat_god');
      if (t > 3.4) { S.chain = ramp(t, 3.4, 4.4); const vu = easeO(ramp(t, 3.4, 4.6)); v.y = gy - 90 * vu; pz(v, 'stagger', 'limp', vu); v.fs = 0.5; v.x = vx0 + Math.sin(t * 40) * 1.5 * S.chain; }
      else pz(v, 'stagger');
      if (Math.random() < 0.7) { const th = rnd(0, 6.283); m.fx.add(h.x + Math.cos(th) * 150, h.y - 60 + Math.sin(th) * 100, -Math.cos(th) * 140, -Math.sin(th) * 100, 0.7, rnd(2, 4), ['#f0abfc', '#fde047', '#67e8f9'][(Math.random() * 3) | 0], 0, 1); }
      if (t > 4.4) { m.timeScale = lerp(1, 0.4, ramp(t, 4.6, 5.1)); }
      if (t > 4.8 && once(S, 'tel')) SFX.play('fat_charge');
    } else {
      const lt = t - 5.1; S.aura = 1; S.rune = S.rune;
      if (once(S, 'hit')) {
        S.rays = 1; pz(h, 'point'); fflash(m, '#ffffff', 1);
        m.addShock(h.x + 30, h.y - 60, 10, 700, 0.8, '#ffffff', 12); m.addShock(h.x + 30, h.y - 60, 10, 980, 1.0, '#f0abfc', 9); m.addShock(h.x + 30, h.y - 60, 10, 1260, 1.25, '#fde047', 7); m.addShock(h.x + 30, h.y - 60, 10, 1500, 1.5, '#67e8f9', 5);
        m.fx.burst(v.x, v.y - 50, 50, 1000, 1.0, 5, '#f0abfc', 100, 0); m.fx.burst(v.x, v.y - 50, 30, 800, 1.0, 5, '#fde047', 100, 0); m.fx.burst(h.x + 30, h.y - 60, 40, 900, 0.8, 4, '#ffffff', 0, 0);
        SFX.play('fat_boom'); SFX.play('fat_god'); c.zp = 0.25; c.kick = 1; m.fx.addShake(18); S.chain = 0;
        v.fScale = 1; v.toRagdoll(2400, -1200, 99);
      }
      m.timeScale = lt < 1.0 ? 0.25 : lerp(0.25, 1, ramp(lt, 1.0, 1.7));
      const hip = v.pts[HIP]; c.rot = 0.13 * (1 - ramp(lt, 0.6, 2.6)) * Math.cos(lt * 2);
      if (lt < 0.9) fcam(m, lerp(h.x, clamp(hip.x, 200, 1080), 0.7), gy - 120, 1.35); else fcam(m, h.x + 60, gy - 130, lerp(1.35, 1.5, ramp(lt, 1, 2.5)));
      c.tDim = 0.78 - 0.4 * ramp(lt, 1.5, 3.5); c.tLight = 0.05;
      h.y = lerp(gy - 90, gy, easeO(ramp(lt, 0.9, 1.9)));
      if (lt < 0.8) pz(h, 'point'); else if (lt < 2.2) pz(h, 'point', 'fist2', ramp(lt, 0.8, 1.6)); else pz(h, 'fist2', 'fistUp', ramp(lt, 2.2, 2.9));
      S.rays = 1 - ramp(lt, 2.6, 4.2); S.ring = 1 - ramp(lt, 2.8, 4.4); S.aura = lt < 3.0 ? 1 : 1 - 0.4 * ramp(lt, 3, 4); S.name = ramp(lt, 0.9, 2.2);
      if (lt > 2.0 && lt < 4.2 && Math.random() < 0.6) m.fx.add(h.x + rnd(-60, 60), h.y - rnd(0, 130), rnd(-40, 40), -rnd(60, 200), 1.0, rnd(2, 4), ['#f0abfc', '#fde047', '#67e8f9'][(Math.random() * 3) | 0], 0, 1);
    }
  },
};

'use strict';
/* STICK MAYHEM v1.3.0 — 6 novos AWAKENINGS: INFERNAL RAGE, VOID ASCENSION, THUNDER SOUL, FROZEN EMPEROR, CELESTIAL BREAKER, MAYHEM OVERDRIVE.
   Mantêm as fases prep/dash|blink/strike/rec do sistema original (IA, energia, balanceamento e cinemática são os mesmos). */
const AWK2 = {rage: 1, ascension: 1, soul: 1, emperor: 1, breaker: 1, overdrive: 1};
Object.assign(AWK_T, {
  rage:      {prep: 0.85, dash: 0.20, spd: 1900, hold: 0.30, rec: 0.70},
  ascension: {prep: 1.00, dash: 0.45, spd: 1900, hold: 0.35, rec: 0.70},
  soul:      {prep: 0.70, dash: 0.33, spd: 0,    hold: 0.60, rec: 0.80},
  emperor:   {prep: 1.00, dash: 0.55, spd: 1500, hold: 0.55, rec: 0.90},
  breaker:   {prep: 1.10, dash: 0.30, spd: 0,    hold: 0.45, rec: 1.00},
  overdrive: {prep: 0.80, dash: 0.30, spd: 2100, hold: 0.35, rec: 0.80},
});
Object.assign(KF, {
  asc_prep:  [[0, 0, 0, 8, 18, 10, -4, 12, 0], [0.5, 0, -4, 10, 16, -26, -14, -26, 10], [1, 0, -6, 10, 18, -34, -18, -34, 14]],
  soul_hit:  [[0, 0, 0, 10, 10, -30, -8, -30, 0], [1, 0, 0, 10, 12, -36, -10, -36, 0]],
  emp_prep:  [[0, 0, 0, 8, 18, 10, -4, 12, 0], [0.5, 2, 6, 14, 22, -14, 22, -14, 0], [1, 4, 10, 16, 26, -6, 26, -6, 0]],
  emp_push:  [[0, 6, 8, 16, 28, 2, 24, 2, 0], [1, 8, 8, 16, 32, 4, 28, 4, 0]],
});
const AWKP = {
  rage:      {prep: KF.inf_prep, dash: KF.inf_dash, strike: null, rec: KF.inf_rec},
  ascension: {prep: KF.asc_prep, dash: KF.void_dash, strike: KF.void_hit, rec: KF.void_rec},
  soul:      {prep: KF.cel_prep, blink: KF.inf_dash, strike: KF.soul_hit, rec: KF.cel_rec},
  emperor:   {prep: KF.emp_prep, dash: KF.emp_push, strike: KF.emp_push, rec: KF.cel_rec},
  breaker:   {prep: KF.cel_prep, dash: KF.cel_hit, strike: KF.cel_hit, rec: KF.cel_rec},
  overdrive: {prep: KF.inf_prep, dash: KF.inf_dash, strike: KF.inf_fin, rec: KF.inf_rec},
};
function a2decay(arr, dt) { for (let i = arr.length - 1; i >= 0; i--) { arr[i].l -= dt; if (arr[i].l <= 0) arr.splice(i, 1); } }

Object.assign(Fighter.prototype, {
  awk2Init(a) { a.sl = []; a.pil = []; a.spk = []; a.zz = []; a.n = 0; a.st = 0; a.hitp = false; a.stamp = 0; a.cross = null; a.frz = 0; a.by = this.y; a.crown = 0; a.wing = 0; a.sw = 0; a.bx = 0; a.bolt = 0; },
  awkHit2(e, x, y, rx, ry, share, kx, ky, blast, bshare) {
    if (!e || !e.alive) return false;
    const dir = e.cx >= x ? 1 : -1, dx = (e.cx - x) / rx, dy = (e.cy - y) / ry;
    let sh = 0, K = 1;
    if (dx * dx + dy * dy <= 1) sh = share;
    else if (blast) { const d = Math.hypot(e.cx - x, e.cy - y); if (d < blast) { sh = bshare * (0.5 + 0.5 * (1 - d / blast)); K = 0.5; } }
    if (!sh) return false;
    const k = this.safeK(e, dir, dir * kx * K, ky * K);
    const hit = e.hurt(this.awkDamage(e, sh), k[0], k[1], this, 'awk', e.cx, e.cy);
    if (hit && e.alive && !e.ragdoll && Math.hypot(k[0], k[1]) > 300) e.toRagdoll(k[0], k[1], 0.9 + Math.hypot(k[0], k[1]) / 1800);
    return hit;
  },
  updateAwk2(dt) {
    const a = this.awk, m = this.m, T = AWK_T[a.type], c = m.cine, e = this.foe(), ty = a.type;
    if (!(m.state === 'play') || m.ended || a.t > AWK.maxT || (m.frozen && !m.ended)) { this.endAwk(); return; }
    if (!a.sl) this.awk2Init(a);
    a.t += dt; a.lt += dt;
    for (const p of a.tr) p.a = Math.max(0, p.a - dt * 4);
    a2decay(a.sl, dt); a2decay(a.pil, dt); a2decay(a.spk, dt); a2decay(a.zz, dt);
    if (a.stamp > 0) a.stamp -= dt; if (a.cross) { a.cross.l -= dt; if (a.cross.l <= 0) a.cross = null; }
    a.gv = true; a.ds = false;
    const u = clamp(a.lt / T.prep, 0, 1);
    if (a.ph === 'prep') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 14);
      a.aura = Math.min(1, a.aura + dt * 2.2);
      c.zx = this.x; c.zy = this.y - 55; c.tZoom = Math.max(c.tZoom, 1 + 0.14 * easeO(u));
      if (e && ty !== 'overdrive' || e) this.facing = e ? (e.cx >= this.x ? 1 : -1) : this.facing;
    } else if (a.ph === 'rec') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 10);
      a.aura = Math.max(0, a.aura - dt * 1.6);
      c.tZoom = Math.max(c.tZoom, 1 + 0.1 * (1 - a.lt / T.rec));
      if (a.lt >= T.rec + (a.whiff ? 0.35 : 0)) { this.endAwk(); return; }
    }
    if (a.ph !== 'rec') this['aw_' + ty](a, e, dt, T, c, u);
    if (!this.awk) return;
    if (a.ph !== 'prep' && a.ph !== 'rec') a.aura = Math.min(1, a.aura + dt * 3);
    if (a.gv) this.vy = Math.min(1500, this.vy + GRAV * dt);
    const px = this.x;
    moveBody(m, this, dt, false);
    if (a.ph === 'blink') this.x = px;
    if (!a.ds && this.grounded) this.phase += Math.abs(this.vx) * dt * 0.034;
    this.awkPose2();
    this.smoothPose(a.ds ? 1.4 : 1);
    this.capeStep(dt);
    this.checkBounds();
  },
  awkPose2() {
    const a = this.awk, P = AWKP[a.type], tt = AWK_T[a.type];
    let rows = P[a.ph] || P.prep, u;
    if (a.ph === 'prep') u = a.lt / tt.prep; else if (a.ph === 'rec') u = a.lt / tt.rec; else if (a.ph === 'strike') u = a.lt / (tt.hold || 0.4); else u = a.lt / (tt.dash || 0.2);
    if (a.type === 'rage' && a.ph === 'strike') { rows = (a.n % 2) ? KF.inf_jabR : KF.inf_jabL; u = (a.st % 0.13) / 0.13; if (a.fin) { rows = KF.inf_fin; u = a.ft / 0.3; } }
    this.awkPoseRows(rows, u, a);
  },
  awkPoseRows(rows, u, a) {
    const T = this.T, fx = this.facing, k = _kf, t = this.m.time;
    kfs(rows, u, k);
    const lean = k[1] * fx, crouch = k[2], stance = k[3], shake = (a.ph === 'prep' ? Math.sin(t * 60) * 0.9 * a.aura : 0);
    let hipY = this.y - 44 + crouch; if (!this.grounded) hipY += 3;
    const hip = T[HIP], ch = T[CHEST], hd = T[HEAD];
    hip.x = this.x + shake; hip.y = hipY; ch.x = hip.x + lean; ch.y = hip.y - 30 + crouch * 0.1; hd.x = ch.x + lean * 0.35 + fx * 2; hd.y = ch.y - 22;
    for (let i = 0; i < 2; i++) {
      const front = i === 1, fxp = this.x + fx * (front ? stance : -stance * 0.95), fyp = this.y - (front ? 0 : k[8]);
      ik(hip.x, hip.y, fxp, fyp, 22, 22, -fx, _o);
      const kn = T[front ? KNR : KNL], ft = T[front ? FTR : FTL]; kn.x = _o.ex; kn.y = _o.ey; ft.x = _o.hx; ft.y = _o.hy;
    }
    ik(ch.x, ch.y, ch.x + fx * k[6], ch.y + k[7], 18, 18, fx, _o); T[ELL].x = _o.ex; T[ELL].y = _o.ey; T[HDL].x = _o.hx; T[HDL].y = _o.hy;
    ik(ch.x, ch.y, ch.x + fx * k[4], ch.y + k[5], 18, 18, fx, _o); T[ELR].x = _o.ex; T[ELR].y = _o.ey; T[HDR].x = _o.hx; T[HDR].y = _o.hy;
    this.wAng = -0.9;
  },
  a2finish(a, hit, hold) { a.hit = hit; a.whiff = !hit; },
  // ---------- INFERNAL RAGE: rugido, 5 garras e pilar de fogo
  aw_rage(a, e, dt, T, c, u) {
    const m = this.m, dir = this.facing, cx = this.x, cy = this.y - 55;
    if (a.ph === 'prep') {
      c.tDim = 0.3 * u; c.tDist = u > 0.4 ? clamp((u - 0.4) * 1.2, 0, 0.7) : 0; c.dx = cx; c.dy = cy - 20; c.dr = 230; c.dtype = 1;
      a.acc += dt * (50 + 90 * u); while (a.acc >= 1) { a.acc--; m.fx.add(cx + rnd(-30, 30), this.y - rnd(0, 20), rnd(-50, 50), -rnd(140, 340) * (0.5 + u), rnd(0.3, 0.6), rnd(2, 4), Math.random() < 0.5 ? '#ef4444' : '#fb923c', -80, 0); }
      if (u > 0.55 && !a.did) { a.did = 1; SFX.play('awk_rage_roar'); m.addShock(cx, cy, 20, 260, 0.55, '#ef4444', 7); m.addShock(cx, cy, 20, 190, 0.4, '#fde047', 4); m.fx.addShake(9);
        for (const o of [-190, -95, 95, 190]) a.pil.push({x: cx + o, l: 0.9, L: 0.9, h: 0.7});
        if (e && Math.abs(e.cx - cx) < 240 && !e.awk) { e.vx += Math.sign(e.cx - cx || 1) * 340; e.vy = Math.min(e.vy, -220); e.hitstun = Math.max(e.hitstun, 0.1); } }
      if (a.lt >= T.prep) { a.ph = 'dash'; a.lt = 0; a.aim = e ? e.cx : cx + dir * 400; SFX.play('awk_rage_dash'); }
    } else if (a.ph === 'dash') {
      a.ds = true; a.gv = false;
      if (e && a.lt < T.dash - 0.05) a.aim = e.cx;
      const d = a.aim - this.x >= 0 ? 1 : -1; this.facing = d; this.vx = d * T.spd; this.vy = 0;
      a.acc += dt; if (a.acc >= 0.011) { a.acc = 0; this.trailPush(a); }
      c.zx = cx; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1.1); c.tDim = 0.2;
      m.fx.add(cx, cy + rnd(-30, 30), -d * rnd(100, 320), rnd(-60, 20), 0.3, rnd(2, 4), Math.random() < 0.5 ? '#ef4444' : '#fde047', -60, 1);
      if ((e && Math.abs(e.cx - this.x) < 46) || a.lt >= T.dash) { this.vx = 0; a.ph = 'strike'; a.lt = 0; a.n = 0; a.st = 0; a.fin = false; a.hit = false; a.ix = this.x + this.facing * 36; a.iy = this.y - 55; }
    } else if (a.ph === 'strike') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 20);
      let d = this.facing; if (e) this.facing = d = e.cx >= this.x ? 1 : -1;
      c.tZoom = Math.max(c.tZoom, 1.15); c.tDim = 0.14; c.zx = this.x + d * 30; c.zy = this.y - 60;
      a.st += dt; const ix = this.x + d * 40, iy = this.y - 60;
      if (!a.fin && a.n < 5 && a.st >= 0.13 * a.n) {
        a.n++;
        const hit = this.awkHit2(e, ix, iy, 100, 105, 0.1, 230, -60); if (hit) a.hit = true;
        a.sl.push({x: ix, y: iy, ang: (a.n % 2 ? 0.8 : -0.8) * d, l: 0.28, L: 0.28, d});
        SFX.play('awk_rage_claw'); m.fx.burst(ix, iy, 8, 520, 0.3, 3, '#fb923c', 100, 0, d > 0 ? 0 : Math.PI, 2.2); m.addShock(ix, iy, 6, 70, 0.18, '#fca5a5', 4); m.fx.addShake(5);
        if (hit) m.hitstop = Math.max(m.hitstop, 0.03);
      }
      if (!a.fin && a.n >= 5 && a.st >= 0.13 * 5 + 0.2) {
        a.fin = true; a.ft = 0;
        const hit = this.awkHit2(e, ix, iy, 115, 120, 0.5, 700, -1150, 200, 0.3); if (hit) a.hit = true; a.whiff = !a.hit;
        const px = hit && e ? e.cx : ix; a.pil.push({x: px, l: 1.0, L: 1.0, h: 1.0}); a.pil.push({x: ix, l: 0.9, L: 0.9, h: 0.8});
        SFX.play('awk_rage_boom'); m.fx.burst(px, this.y - 20, 40, 800, 0.9, 5, '#fb923c', 400, 0); m.fx.burst(px, this.y - 20, 22, 600, 0.7, 8, '#7f1d1d', -120, 1); m.fx.burst(px, this.y - 20, 14, 1000, 0.4, 3, '#fde047', 0, 0);
        m.addShock(px, this.y - 10, 10, 300, 0.5, '#fde047', 9); m.addShock(px, this.y - 10, 10, 460, 0.8, '#dc2626', 7);
        if (c.camFx) { c.flash = 0.55; c.flashC = '#ffb3a0'; c.zp = 0.18; c.kick = 1; }
        m.fx.addShake(18); m.hitstop = Math.max(m.hitstop, hit ? 0.1 : 0.05); a.ix = px; a.iy = iy;
      }
      if (a.fin) { a.ft += dt; c.tZoom = Math.max(c.tZoom, 1.18); if (a.ft >= 0.3) { a.ph = 'rec'; a.lt = 0; } }
    }
  },
  // ---------- VOID ASCENSION: levita, poço gravitacional e mergulho cometa
  aw_ascension(a, e, dt, T, c, u) {
    const m = this.m, cx = this.x, cy = this.y - 55;
    if (a.ph === 'prep') {
      a.gv = false; const ty = a.by - 120 * easeO(u); this.vy = clamp((ty - this.y) * 9, -520, 520);
      if (e) { a.gx = e.cx; a.gy = e.cy; if (!e.awk && !e.ragdoll) e.vx += Math.sign(this.x - e.cx || 1) * 110 * u * dt; }
      c.tDim = 0.5 * Math.min(1, u * 2); c.tDist = u > 0.3 ? clamp((u - 0.3) * 1.3, 0, 0.9) : 0; c.dx = a.gx || cx; c.dy = a.gy || cy; c.dr = 230; c.dtype = 0;
      a.acc += dt * (30 + 70 * u); while (a.acc >= 1) { a.acc--; this.fxPull(a.gx || cx, (a.gy || cy), 110 + 60 * (1 - u), 1, Math.random() < 0.3 ? '#f0abfc' : '#a78bfa', 0.4); }
      if (a.lt >= T.prep) { a.ph = 'dash'; a.lt = 0; SFX.play('awk_ascension_dash'); }
    } else if (a.ph === 'dash') {
      a.ds = true; a.gv = false;
      const tx = e ? e.cx : cx + this.facing * 300, ty = e ? e.cy - 10 : this.y;
      if (a.lt < 0.1) { let dx = tx - this.x, dy = ty - (this.y - 50); const L = Math.hypot(dx, dy) || 1; a.dvx = dx / L; a.dvy = dy / L; this.facing = dx >= 0 ? 1 : -1; }
      this.vx = a.dvx * T.spd; this.vy = a.dvy * T.spd;
      a.acc += dt; if (a.acc >= 0.011) { a.acc = 0; this.trailPush(a); }
      c.zx = cx; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1.12); c.tDim = 0.42; c.tDist = 0.5; c.dx = cx; c.dy = cy; c.dr = 220; c.dtype = 0;
      m.fx.add(cx, cy, -a.dvx * rnd(80, 240), -a.dvy * rnd(80, 240), 0.35, rnd(2, 4), Math.random() < 0.5 ? '#a78bfa' : '#1e0b3a', 0, 1);
      const near = e && Math.hypot(e.cx - this.x, e.cy - (this.y - 50)) < 62;
      if (near || (this.grounded && a.lt > 0.08) || a.lt >= T.dash) {
        this.vx = 0; this.vy = 0; a.ph = 'strike'; a.lt = 0;
        const ix = this.x + this.facing * 30, iy = this.y - 40; a.ix = ix; a.iy = iy;
        const hit = this.awkStrike(e, {rx: 115, ry: 125, share: 1, kx: 1200, ky: -800, blast: 250, blastShare: 0.4}); a.hit = hit; a.whiff = !hit;
        SFX.play('awk_ascension_hit'); m.fx.burst(ix, iy, 36, 780, 0.8, 4, '#a78bfa', 200, 0); m.fx.burst(ix, iy, 20, 520, 0.9, 6, '#1e0b3a', 0, 1); m.fx.burst(ix, iy, 14, 900, 0.4, 3, '#f0abfc', 0, 0);
        m.addShock(ix, iy, 10, 340, 0.55, '#c4b5fd', 8); m.addShock(this.x, this.y - 4, 10, 520, 0.8, '#7c3aed', 6); m.addShock(this.x, this.y - 4, 10, 680, 1.0, '#1e0b3a', 10);
        if (c.camFx) { c.flash = 0.6; c.flashC = '#e9d5ff'; c.zp = 0.16; c.kick = 1; }
        m.fx.addShake(17); m.hitstop = Math.max(m.hitstop, hit ? 0.1 : 0.05);
      }
    } else if (a.ph === 'strike') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 20); c.zx = a.ix; c.zy = a.iy; c.tZoom = Math.max(c.tZoom, 1.16); c.tDim = 0.18;
      if (a.lt >= T.hold) { a.ph = 'rec'; a.lt = 0; }
    }
  },
  // ---------- THUNDER SOUL: 3 saltos zigue-zague + raio do céu
  aw_soul(a, e, dt, T, c, u) {
    const m = this.m, cx = this.x, cy = this.y - 55;
    if (a.ph === 'prep') {
      c.tDim = 0.28 * u; c.tLight = Math.random() < 0.18 * u ? 0.35 : 0.05; c.lightC = '#fef9c3';
      a.acc += dt * (50 + 90 * u); while (a.acc >= 1) { a.acc--; m.fx.add(cx + rnd(-26, 26), this.y - rnd(0, 110), rnd(-160, 160), rnd(-160, 160), 0.16, 2.4, Math.random() < 0.5 ? '#fde047' : '#93c5fd', 0, 1); }
      if (a.lt >= T.prep) { a.ph = 'blink'; a.lt = 0; a.n = 0; a.hopT = 0; a.hitp = false; a.sx = this.x; this.soulHop(a, e); SFX.play('awk_soul_hop'); }
    } else if (a.ph === 'blink') {
      a.ds = true; a.gv = false; a.hopT += dt;
      const k = clamp(a.hopT / 0.11, 0, 1);
      this.x = lerp(a.sx, a.ex, easeO(k)); this.vx = 0; this.vy = 0;
      a.acc += dt; if (a.acc >= 0.008) { a.acc = 0; this.trailPush(a); }
      c.zx = this.x; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1.1); c.tLight = 0.18; c.lightC = '#fef9c3';
      for (let i = 0; i < 2; i++) m.fx.add(this.x + rnd(-8, 8), this.y - rnd(10, 100), rnd(-90, 90), rnd(-90, 90), 0.25, rnd(2, 3.5), '#fde047', 0, 1);
      if (k >= 1) {
        a.n++; const hit = this.awkHit2(e, this.x + this.facing * 36, this.y - 55, 100, 110, 0.12, 200, -90); if (hit) a.hit = true;
        a.zz.push({x1: a.sx, y1: this.y - 55, x2: this.x, y2: this.y - 55, l: 0.3, L: 0.3});
        SFX.play('awk_soul_slash'); m.addShock(this.x + this.facing * 36, this.y - 55, 6, 90, 0.2, '#fde047', 4); m.fx.addShake(5); if (hit) m.hitstop = Math.max(m.hitstop, 0.03);
        if (a.n >= 3) { a.ph = 'strike'; a.lt = 0; a.bolt = 0; a.bx = e ? e.cx : this.x + this.facing * 200; a.fired = false; }
        else { a.hopT = 0; a.sx = this.x; this.soulHop(a, e); SFX.play('awk_soul_hop'); }
      }
    } else if (a.ph === 'strike') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 20);
      c.zx = a.bx; c.zy = this.y - 100; c.tZoom = Math.max(c.tZoom, 1.1); c.tDim = 0.35; c.tLight = 0.1; c.lightC = '#fef9c3';
      if (e && a.lt < 0.15) a.bx = e.cx;
      if (!a.fired && a.lt >= 0.28) {
        a.fired = true; a.bolt = 0.4; const bx = a.bx;
        const hit = this.awkHit2(e, bx, this.y - 120, 120, 420, 0.64, 500, -1100, 260, 0.3); if (hit) a.hit = true; a.whiff = !a.hit;
        SFX.play('awk_soul_bolt'); m.addBeam(bx, 0.7, '#fde047'); m.addShock(bx, this.y - 6, 10, 380, 0.6, '#fde047', 9); m.addShock(bx, this.y - 6, 10, 540, 0.9, '#60a5fa', 6);
        m.fx.burst(bx, this.y - 30, 36, 800, 0.8, 4, '#fde047', 300, 0); m.fx.burst(bx, this.y - 30, 20, 600, 0.7, 4, '#93c5fd', 0, 1);
        if (c.camFx) { c.flash = 0.9; c.flashC = '#fffbe0'; c.zp = 0.14; c.kick = 1; }
        m.fx.addShake(16); m.hitstop = Math.max(m.hitstop, hit ? 0.1 : 0.05); a.ix = bx; a.iy = this.y - 60;
      }
      if (a.bolt > 0) a.bolt -= dt;
      if (a.lt >= T.hold) { a.ph = 'rec'; a.lt = 0; }
    }
  },
  soulHop(a, e) {
    const side = (a.n % 2 ? 1 : -1), tx = e ? e.cx + side * 72 : this.x + this.facing * 150;
    a.ex = clamp(tx, 30, WORLD_W - 30); this.facing = (e ? e.cx : a.ex) >= a.ex ? 1 : -1;
  },
  // ---------- FROZEN EMPEROR: coroa de gelo, onda de espinhos, congela e estilhaça
  aw_emperor(a, e, dt, T, c, u) {
    const m = this.m, cx = this.x, cy = this.y - 55;
    if (a.ph === 'prep') {
      a.crown = u; c.tDim = 0.3 * u; c.tLight = 0.1 * u; c.lightC = '#e0f2fe';
      a.acc += dt * (40 + 60 * u); while (a.acc >= 1) { a.acc--; m.fx.add(cx + rnd(-50, 50), this.y - rnd(0, 20), rnd(-20, 20), -rnd(20, 90), rnd(0.5, 0.9), rnd(2, 3.4), Math.random() < 0.5 ? '#e0f2fe' : '#7dd3fc', -20, 1); }
      if (a.lt >= T.prep) { a.ph = 'dash'; a.lt = 0; a.wx = this.x; a.wd = this.facing; a.lastS = this.x; a.hitp = false; SFX.play('awk_emperor_wave'); }
    } else if (a.ph === 'dash') {
      a.crown = 1; a.wx += a.wd * T.spd * dt; c.zx = (cx + a.wx) / 2; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1.08); c.tDim = 0.3;
      while ((a.wx - a.lastS) * a.wd > 36) { a.lastS += a.wd * 36; a.spk.push({x: a.lastS, l: 0.9, L: 0.9, h: 0.6 + 0.5 * Math.abs(Math.sin(a.lastS)), g: this.y}); m.fx.add(a.lastS, this.y - 8, rnd(-30, 30), -rnd(60, 160), 0.5, 3, '#e0f2fe', 200, 0); }
      if (e && e.alive && Math.abs(e.cx - a.wx) < 62 && e.y > this.y - 170) {
        const k = this.safeK(e, a.wd, a.wd * 120, -160);
        e.hurt(this.awkDamage(e, 0.4), k[0], k[1], this, 'awk', e.cx, e.cy); e.vx = 0; e.hitstun = Math.max(e.hitstun, 0.2);
        a.frz = T.hold; a.ph = 'strike'; a.lt = 0; a.hit = true; a.whiff = false; a.fe = e; SFX.play('awk_emperor_freeze');
        m.addShock(e.cx, e.cy, 10, 180, 0.4, '#e0f2fe', 6); m.fx.burst(e.cx, e.cy, 22, 400, 0.6, 3, '#bae6fd', 100, 0); m.fx.addShake(8);
      } else if (a.lt >= T.dash) { a.whiff = true; a.hit = false; a.ph = 'rec'; a.lt = 0; }
    } else if (a.ph === 'strike') {
      const f = a.fe; c.zx = f ? f.cx : cx; c.zy = f ? f.cy : cy; c.tZoom = Math.max(c.tZoom, 1.14); c.tDim = 0.28;
      if (f && f.alive && !f.ragdoll) { f.vx = 0; f.hitstun = Math.max(f.hitstun, 0.12); f.atkT = -1; }
      a.frz = Math.max(0, T.hold - a.lt);
      if (a.lt >= T.hold) {
        if (f && f.alive) {
          const dir = a.wd, k = this.safeK(f, dir, dir * 900, -1000), px = f.cx, py = f.cy;
          const hit = f.hurt(this.awkDamage(f, 0.6), k[0], k[1], this, 'awk', px, py); if (hit && f.alive && !f.ragdoll) f.toRagdoll(k[0], k[1], 1.0);
          SFX.play('awk_emperor_shatter'); m.fx.burst(px, py, 44, 820, 0.9, 4, '#e0f2fe', 500, 0); m.fx.burst(px, py, 20, 600, 0.8, 6, '#38bdf8', 300, 1);
          m.addShock(px, py, 10, 320, 0.55, '#ffffff', 9); m.addShock(px, py, 10, 480, 0.8, '#7dd3fc', 6);
          if (c.camFx) { c.flash = 0.6; c.flashC = '#e0f2fe'; c.zp = 0.16; c.kick = 1; }
          m.fx.addShake(15); m.hitstop = Math.max(m.hitstop, 0.1);
        }
        a.frz = 0; a.ph = 'rec'; a.lt = 0;
      }
    }
  },
  // ---------- CELESTIAL BREAKER: asas de luz + espada gigante do céu
  aw_breaker(a, e, dt, T, c, u) {
    const m = this.m, cx = this.x, cy = this.y - 55;
    if (a.ph === 'prep') {
      a.wing = easeO(u); a.sw = u; c.tLight = 0.35 * Math.min(1, u * 1.6); c.lightC = '#fff7d6';
      a.acc += dt * (50 + 60 * u); while (a.acc >= 1) { a.acc--; m.fx.add(cx + rnd(-60, 60), this.y - rnd(0, 120), rnd(-20, 20), -rnd(60, 200), rnd(0.5, 0.9), rnd(2, 3.5), Math.random() < 0.5 ? '#fde68a' : '#e0f2fe', -30, 1); }
      if (u > 0.5 && !a.did) { a.did = 1; SFX.play('awk_breaker_wings'); m.addShock(cx, cy, 20, 220, 0.5, '#fde68a', 6); }
      if (e) a.bx = e.cx;
      if (a.lt >= T.prep) { a.ph = 'dash'; a.lt = 0; SFX.play('awk_breaker_drop'); }
    } else if (a.ph === 'dash') {
      a.wing = 1; a.sw = 1; if (e && a.lt < 0.12) a.bx = e.cx; a.by2 = e ? e.y : this.y;
      c.tLight = 0.3; c.lightC = '#fff7d6'; c.zx = a.bx; c.zy = this.y - 100; c.tZoom = Math.max(c.tZoom, 1.1);
      if (a.lt >= T.dash) {
        a.ph = 'strike'; a.lt = 0; const bx = a.bx, by = a.by2;
        const hit = this.awkHit2(e, bx, by - 60, 95, 330, 1.0, 400, -1200, 280, 0.4); a.hit = hit; a.whiff = !hit;
        a.cross = {x: bx, y: by - 20, l: 0.55, L: 0.55}; a.ix = bx; a.iy = by - 50;
        SFX.play('awk_breaker_hit'); m.addBeam(bx, 0.9, '#fff7d6'); m.addShock(bx, by - 4, 10, 280, 0.45, '#ffffff', 10); m.addShock(bx, by - 4, 10, 500, 0.75, '#fde68a', 8); m.addShock(bx, by - 4, 10, 760, 1.1, '#bae6fd', 6);
        m.fx.burst(bx, by - 30, 40, 760, 1.0, 4, '#fde68a', 120, 1); m.fx.burst(bx, by - 30, 24, 900, 0.8, 3, '#ffffff', 0, 0);
        if (c.camFx) { c.flash = 0.95; c.flashC = '#ffffff'; c.zp = 0.15; c.kick = 1; }
        m.fx.addShake(15); m.hitstop = Math.max(m.hitstop, hit ? 0.1 : 0.05);
      }
    } else if (a.ph === 'strike') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 20); c.zx = a.ix; c.zy = a.iy; c.tZoom = Math.max(c.tZoom, 1.14); c.tLight = 0.3; c.lightC = '#fff7d6';
      if (a.lt >= T.hold) { a.ph = 'rec'; a.lt = 0; }
    }
  },
  // ---------- MAYHEM OVERDRIVE: 3 investidas arco-íris + carimbo M
  aw_overdrive(a, e, dt, T, c, u) {
    const m = this.m, cx = this.x, cy = this.y - 55;
    if (a.ph === 'prep') {
      c.tDim = 0.2 * u; c.tLight = 0.12 * u; c.lightC = '#fdf4ff';
      a.acc += dt * (60 + 90 * u); while (a.acc >= 1) { a.acc--; m.fx.add(cx + rnd(-40, 40), this.y - rnd(0, 110), rnd(-40, 40), -rnd(60, 220), rnd(0.4, 0.8), rnd(2, 3.4), 'hsl(' + ((Math.random() * 360) | 0) + ',90%,62%)', -40, 0); }
      if (a.lt >= T.prep) { a.ph = 'dash'; a.lt = 0; a.n = 0; a.hitp = false; SFX.play('awk_overdrive_dash'); }
    } else if (a.ph === 'dash') {
      a.ds = true; a.gv = false;
      const d = e ? (e.cx >= this.x ? 1 : -1) : this.facing;
      if (a.lt < 0.03) { this.facing = a.dd = d; }
      this.vx = a.dd * T.spd; this.vy = 0; this.facing = a.dd;
      a.acc += dt; if (a.acc >= 0.011) { a.acc = 0; this.trailPush(a); }
      c.zx = cx; c.zy = cy; c.tZoom = Math.max(c.tZoom, 1.1); c.tDim = 0.2;
      m.fx.add(cx, cy + rnd(-30, 30), -a.dd * rnd(100, 320), rnd(-60, 60), 0.35, rnd(2, 4), 'hsl(' + (((m.time * 400) + Math.random() * 90) % 360 | 0) + ',95%,62%)', 0, 1);
      if (!a.hitp && e && this.awkRegion(e, 52, 110)) {
        a.hitp = true; const hit = this.awkHit2(e, this.x + a.dd * 30, this.y - 55, 90, 110, 0.14, 240, -110); if (hit) a.hit = true;
        SFX.play('awk_overdrive_hit'); m.fx.burst(e.cx, e.cy, 16, 560, 0.4, 3, '#fde047', 0, 0); m.addShock(e.cx, e.cy, 8, 110, 0.25, '#f0abfc', 5); m.fx.addShake(7); if (hit) m.hitstop = Math.max(m.hitstop, 0.04);
        a.zz.push({x1: this.x - a.dd * 60, y1: this.y - 55, x2: this.x + a.dd * 60, y2: this.y - 55, l: 0.25, L: 0.25, m: 1});
      }
      const passed = e ? (this.x - e.cx) * a.dd > 95 : a.lt > 0.2;
      if (passed || a.lt >= T.dash) {
        a.n++; this.vx = 0;
        if (a.n >= 3) {
          a.ph = 'strike'; a.lt = 0; a.stamp = 0.8; a.ix = this.x; a.iy = this.y - 55;
          const hit = this.awkStrike(e, {rx: 135, ry: 135, share: 0.58, kx: 1100, ky: -950, blast: 300, blastShare: 0.3}); if (hit) a.hit = true; a.whiff = !a.hit;
          SFX.play('awk_overdrive_stamp'); m.addShock(this.x, this.y - 55, 10, 320, 0.5, '#fde047', 10); m.addShock(this.x, this.y - 55, 10, 500, 0.8, '#f0abfc', 8); m.addShock(this.x, this.y - 55, 10, 700, 1.1, '#67e8f9', 6);
          for (let i = 0; i < 5; i++) m.fx.burst(this.x, this.y - 55, 10, 760, 0.9, 4, 'hsl(' + (i * 72) + ',90%,62%)', 100, 0);
          if (c.camFx) { c.flash = 0.7; c.flashC = '#fdf4ff'; c.zp = 0.17; c.kick = 1; }
          m.fx.addShake(17); m.hitstop = Math.max(m.hitstop, a.hit ? 0.1 : 0.05);
        } else { a.lt = 0; a.hitp = false; }
      }
    } else if (a.ph === 'strike') {
      this.vx += (0 - this.vx) * Math.min(1, dt * 20); c.zx = a.ix; c.zy = a.iy; c.tZoom = Math.max(c.tZoom, 1.15); c.tDim = 0.15;
      if (a.lt >= T.hold) { a.ph = 'rec'; a.lt = 0; }
    }
  },
});

/* ---------- render ---------- */
function a2glow(ctx, x, y, r, c1, c2) { if (GFX.low) { ctx.fillStyle = c1; } else { const g = ctx.createRadialGradient(x, y, 2, x, y, r); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; } ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }
function a2spike(ctx, x, gy, h, w, col, edge) { ctx.fillStyle = col; ctx.strokeStyle = edge; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - w, gy); ctx.lineTo(x + w * 0.1, gy - h); ctx.lineTo(x + w, gy); ctx.closePath(); ctx.fill(); ctx.stroke(); }
function a2bolt(ctx, x1, y1, x2, y2, w, col, seed) {
  const n = 8; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1);
  for (let i = 1; i < n; i++) { const k = i / n, o = Math.sin(seed * 12.9 + i * 78.2) * 22; ctx.lineTo(x1 + (x2 - x1) * k + o * (y2 - y1 === 0 ? 0 : 1), y1 + (y2 - y1) * k + (y2 - y1 === 0 ? o : 0)); }
  ctx.lineTo(x2, y2); ctx.stroke();
}
const AWK2R = {
  rage: {
    back(ctx, f, t, k) {
      const x = f.x, y = f.y - 52, R = 64 + 50 * k; ctx.globalAlpha = 0.85 * k;
      a2glow(ctx, x, y, R, 'rgba(255,120,60,0.75)', 'rgba(120,10,10,0)');
      ctx.fillStyle = '#dc2626'; ctx.globalAlpha = 0.9 * k; const T = GFX.low ? 6 : 11;
      for (let i = 0; i < T; i++) { const bx = x + (i - (T - 1) / 2) * 9.5, h = (36 + 26 * Math.sin(t * 13 + i * 1.9)) * k + 10; ctx.beginPath(); ctx.moveTo(bx - 6, f.y); ctx.quadraticCurveTo(bx + Math.sin(t * 9 + i) * 6, f.y - h * 0.6, bx + Math.sin(t * 11 + i) * 5, f.y - h - 30 * k); ctx.quadraticCurveTo(bx + 4, f.y - h * 0.4, bx + 6, f.y); ctx.fill(); }
    },
    front(ctx, f, t, a, u) {
      for (const p of a.pil) { const k = p.l / p.L, h = 360 * p.h * Math.min(1, (1 - k) * 4) * Math.min(1, k * 2.5), w = 26 + 26 * (1 - k); ctx.globalAlpha = 0.85 * Math.min(1, k * 2); ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.moveTo(p.x - w, f.y); ctx.quadraticCurveTo(p.x - w * 0.4, f.y - h * 0.5, p.x, f.y - h); ctx.quadraticCurveTo(p.x + w * 0.4, f.y - h * 0.5, p.x + w, f.y); ctx.fill(); ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.moveTo(p.x - w * 0.5, f.y); ctx.quadraticCurveTo(p.x, f.y - h * 0.6, p.x + w * 0.5, f.y); ctx.fill(); }
      for (const s of a.sl) { const k = s.l / s.L; ctx.globalAlpha = k; ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.ang); for (let i = -1; i <= 1; i++) { ctx.strokeStyle = i ? '#fca5a5' : '#fff'; ctx.lineWidth = 6 * k + 1; ctx.beginPath(); ctx.moveTo(-55 * (1 - k * 0.3), i * 14 - 40); ctx.quadraticCurveTo(10, i * 14, 55, i * 14 + 40); ctx.stroke(); } ctx.restore(); }
      if (a.ph === 'prep' && u > 0.5) { const r = 30 + (u - 0.5) * 360; ctx.globalAlpha = 1 - (u - 0.5) * 2; ctx.strokeStyle = '#fca5a5'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(f.x, f.y - 70, r, 0, 6.283); ctx.stroke(); }
    }},
  ascension: {
    back(ctx, f, t, k) {
      const a = f.awk, wx = a.gx || f.x, wy = a.gy || f.y - 50, R = 70 + 60 * k; ctx.globalAlpha = 0.92 * k;
      a2glow(ctx, wx, wy, R, 'rgba(8,0,22,0.95)', 'rgba(124,58,237,0)');
      ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 2; for (let j = 0; j < 3; j++) { ctx.globalAlpha = (0.7 - j * 0.18) * k; ctx.beginPath(); ctx.ellipse(wx, wy, R * (0.9 - j * 0.22), R * (0.9 - j * 0.22) * 0.38, t * (1.4 + j * 0.5), 0, 6.283); ctx.stroke(); }
      ctx.globalAlpha = 0.5 * k; ctx.fillStyle = '#05010d'; ctx.beginPath(); ctx.ellipse(f.x, a.by + 2, 38, 9, 0, 0, 6.283); ctx.fill();
    },
    front(ctx, f, t, a, u) {
      if (a.ph === 'prep' && u > 0.3) a2glow(ctx, f.pts[HDR].x, f.pts[HDR].y - 10, 8 + 22 * (u - 0.3), 'rgba(240,171,252,0.95)', 'rgba(60,10,120,0)');
      if (a.ph === 'dash') { ctx.globalAlpha = 0.9; a2glow(ctx, f.x, f.y - 50, 34, 'rgba(240,171,252,0.9)', 'rgba(88,28,135,0)'); }
    }},
  soul: {
    back(ctx, f, t, k) {
      const x = f.x, y = f.y - 52; ctx.globalAlpha = 0.8 * k; a2glow(ctx, x, y, 70 + 40 * k, 'rgba(253,240,130,0.7)', 'rgba(59,130,246,0)');
      ctx.strokeStyle = '#fde047'; ctx.lineWidth = 2.2; ctx.globalAlpha = k;
      for (let i = 0; i < 4; i++) { const th = i * 1.57 + Math.floor(t * 18) * 0.7; ctx.beginPath(); ctx.moveTo(x + Math.cos(th) * 18, y + Math.sin(th) * 30); ctx.lineTo(x + Math.cos(th + 0.3) * 46, y + Math.sin(th + 0.3) * 56); ctx.lineTo(x + Math.cos(th - 0.1) * 70, y + Math.sin(th - 0.1) * 70); ctx.stroke(); }
    },
    front(ctx, f, t, a, u) {
      for (const z of a.zz) { const k = z.l / z.L; ctx.globalAlpha = k; a2bolt(ctx, z.x1, z.y1, z.x2, z.y2, 8 * k + 2, '#93c5fd', t); a2bolt(ctx, z.x1, z.y1, z.x2, z.y2, 3 * k + 1, '#fff', t + 1); }
      if (a.ph === 'strike' && a.bx) {
        if (!a.fired) { const w = 10 + 40 * (a.lt / 0.28); ctx.globalAlpha = 0.25 + 0.3 * Math.sin(t * 40) * Math.sin(t * 40); ctx.fillStyle = '#fde047'; ctx.fillRect(a.bx - w * 0.5, 0, w, f.y + 4); ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(a.bx, f.y + 2, w, 8, 0, 0, 6.283); ctx.fill(); }
        else if (a.bolt > 0) { ctx.globalAlpha = Math.min(1, a.bolt * 4); a2bolt(ctx, a.bx, -10, a.bx, f.y, 22, '#fde047', Math.floor(t * 30)); a2bolt(ctx, a.bx, -10, a.bx, f.y, 8, '#fff', Math.floor(t * 30) + 3); }
      }
    }},
  emperor: {
    back(ctx, f, t, k) { const x = f.x, y = f.y - 52; ctx.globalAlpha = 0.8 * k; a2glow(ctx, x, y, 70 + 50 * k, 'rgba(224,242,254,0.75)', 'rgba(56,189,248,0)'); ctx.globalAlpha = 0.5 * k; ctx.fillStyle = '#e0f2fe'; ctx.beginPath(); ctx.ellipse(x, f.y + 2, 90 * k, 12 * k, 0, 0, 6.283); ctx.fill(); },
    front(ctx, f, t, a, u) {
      const hp = f.pts[HEAD], cr = a.crown;
      if (cr > 0.02) { ctx.globalAlpha = Math.min(1, cr * 1.5); for (let i = -3; i <= 3; i++) { const h = (i === 0 ? 30 : 20 - Math.abs(i) * 2) * cr, bx = hp.x + i * 5.2; a2spike(ctx, bx, hp.y - 10, h, 3.6, '#e0f2fe', '#0ea5e9'); } ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hp.x - 18, hp.y - 10); ctx.lineTo(hp.x + 18, hp.y - 10); ctx.stroke(); }
      for (const s of a.spk) { const k = s.l / s.L, h = 90 * s.h * Math.min(1, (1 - k) * 5) * Math.min(1, k * 3); ctx.globalAlpha = Math.min(1, k * 2); a2spike(ctx, s.x, s.g, h, 12, '#bae6fd', '#0369a1'); }
      if (a.frz > 0 && a.fe && a.fe.alive) { const e = a.fe, P = e.pts; ctx.globalAlpha = 0.55; ctx.fillStyle = '#bae6fd'; ctx.strokeStyle = '#e0f2fe'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(P[HEAD].x - 18, P[HEAD].y - 18); ctx.lineTo(P[HEAD].x + 18, P[HEAD].y - 14); ctx.lineTo(e.x + 30, e.y - 40); ctx.lineTo(e.x + 24, e.y + 4); ctx.lineTo(e.x - 24, e.y + 4); ctx.lineTo(e.x - 30, e.y - 44); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.globalAlpha = 0.7; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(e.x - 10, e.y - 90); ctx.lineTo(e.x + 4, e.y - 40); ctx.lineTo(e.x - 8, e.y - 8); ctx.stroke(); }
    }},
  breaker: {
    back(ctx, f, t, k) {
      const a = f.awk, P = f.pts, fx = f.facing, w = a.wing || 0;
      ctx.globalAlpha = 0.9 * k; a2glow(ctx, f.x, f.y - 55, 80 + 50 * k, 'rgba(255,255,255,0.85)', 'rgba(254,240,138,0)');
      if (w > 0.02) { ctx.save(); ctx.translate(P[CHEST].x - fx * 3, P[CHEST].y + 3); ctx.scale(-fx, 1); for (const s of [1, -0.55]) for (let i = 0; i < 6; i++) { const ang = (-1.5 + i * 0.3) * w * s + Math.sin(t * 4) * 0.05, L = (48 + i * 6 - (i > 3 ? 14 : 0)) * w; ctx.save(); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(L * 0.5, -9 * w, L, 0); ctx.quadraticCurveTo(L * 0.5, 7 * w, 0, 0); ctx.globalAlpha = 0.92; ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.strokeStyle = '#fde047'; ctx.lineWidth = 1.8; ctx.stroke(); ctx.restore(); } ctx.restore(); }
    },
    front(ctx, f, t, a, u) {
      if (a.sw > 0.02 && (a.ph === 'prep' || a.ph === 'dash')) {
        const bx = a.ph === 'prep' ? f.x : a.bx, tipY = a.ph === 'dash' ? lerp(-280, (a.by2 || f.y) - 20, easeI(clamp(a.lt / 0.3, 0, 1))) : -60 + 0 * u - (1 - a.sw) * 40 + f.y - 330;
        const ty = a.ph === 'dash' ? tipY : tipY; ctx.globalAlpha = Math.min(1, a.sw * 1.4);
        const L = 260, W = 20; ctx.fillStyle = '#e0f2fe'; ctx.strokeStyle = '#fde047'; ctx.lineWidth = 3;
        const top = ty - L, bot = ty; ctx.beginPath(); ctx.moveTo(bx - W, top + 40); ctx.lineTo(bx - W, top + 20); ctx.lineTo(bx - W * 2, top + 20); ctx.lineTo(bx - W * 2, top + 4); ctx.lineTo(bx + W * 2, top + 4); ctx.lineTo(bx + W * 2, top + 20); ctx.lineTo(bx + W, top + 20); ctx.lineTo(bx + W, bot - 30); ctx.lineTo(bx, bot); ctx.lineTo(bx - W, bot - 30); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.fillRect(bx - 3, top + 40, 6, L - 80);
        if (a.ph === 'dash') { ctx.globalAlpha = 0.35; ctx.fillStyle = '#fff7d6'; ctx.fillRect(bx - 12, -10, 24, ty); }
      }
      if (a.cross) { const k = a.cross.l / a.cross.L, x = a.cross.x, y = a.cross.y; ctx.globalAlpha = k; ctx.lineCap = 'round'; for (const [dx, dy] of [[1, -0.7], [-1, -0.7], [1, 0.7], [-1, 0.7]]) { ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 22 * k; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx * 700, y + dy * 700); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8 * k; ctx.stroke(); } }
    }},
  overdrive: {
    back(ctx, f, t, k) {
      const x = f.x, y = f.y - 52, R = 70 + 56 * k; ctx.globalAlpha = 0.85 * k;
      if (!GFX.low) { const g = ctx.createRadialGradient(x, y, 4, x, y, R); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(0.3, 'hsla(' + ((t * 160) % 360 | 0) + ',95%,65%,0.6)'); g.addColorStop(0.7, 'hsla(' + ((t * 160 + 120) % 360 | 0) + ',95%,60%,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; } else ctx.fillStyle = 'rgba(240,171,252,0.5)';
      ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.fill();
    },
    front(ctx, f, t, a, u) {
      const cx = f.x, cy = f.y - 55;
      if (a.aura > 0.15) { ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 3; for (let i = 0; i < 5; i++) { const th = t * 2.4 + i / 5 * 6.283, R = 58 + 6 * Math.sin(t * 3 + i); ctx.globalAlpha = 0.9 * a.aura; ctx.strokeStyle = '#1b1030'; ctx.fillStyle = 'hsl(' + ((i * 72 + t * 200) % 360 | 0) + ',95%,65%)'; const px = cx + Math.cos(th) * R, py = cy + Math.sin(th) * R * 0.7; ctx.strokeText('M', px, py); ctx.fillText('M', px, py); } ctx.textBaseline = 'alphabetic'; }
      const tr = a.tr, n = tr.length; if (a.ph === 'dash' || a.ph === 'strike' || a.ph === 'rec') { let px = null, py = null; for (let j = 1; j <= n; j++) { const p = tr[(a.trI - j + n * 2) % n]; if (p.a <= 0.02) { px = null; continue; } if (px !== null) { ctx.globalAlpha = 0.8 * p.a; ctx.strokeStyle = 'hsl(' + ((j * 28 + t * 300) % 360 | 0) + ',95%,62%)'; ctx.lineWidth = 16 * p.a; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p.x, p.y); ctx.stroke(); } px = p.x; py = p.y; } }
      for (const z of a.zz) { const k = z.l / z.L; ctx.globalAlpha = k; ctx.strokeStyle = '#fff'; ctx.lineWidth = 8 * k; ctx.beginPath(); ctx.moveTo(z.x1, z.y1); ctx.lineTo(z.x2, z.y2); ctx.stroke(); }
      if (a.stamp > 0) { const k = a.stamp / 0.8, s = 1 + (1 - k) * 1.2; ctx.save(); ctx.translate(a.ix, a.iy - 30); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, k * 1.6); ctx.font = 'bold 120px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 10; ctx.strokeStyle = '#1b1030'; ctx.fillStyle = '#fde047'; ctx.strokeText('M', 0, 0); ctx.fillText('M', 0, 0); ctx.restore(); }
    }},
};

'use strict';
/* STICK MAYHEM — IA dos bots: máquina de estados com personalidades e dificuldades */
const DIFF = [
  {react: 0.38, aim: 0.22, atk: 0.45, dodge: 0.0, sp: 0.0, edge: 0.55, name: 'Fácil'},
  {react: 0.18, aim: 0.09, atk: 0.8, dodge: 0.45, sp: 0.5, edge: 0.95, name: 'Normal'},
  {react: 0.09, aim: 0.025, atk: 1.0, dodge: 0.9, sp: 1.0, edge: 1.0, name: 'Difícil'},
];
const PREF_DIST = {pistol: 380, revolver: 420, smg: 300, rifle: 560, shotgun: 200, bow: 450, crossbow: 480, rocket: 420, cannon: 420, laser: 380, grenade: 300, mine: 120};

class Brain {
  constructor(f, pers, diff) {
    this.f = f; this.pers = pers; this.D = DIFF[clamp(diff === undefined ? 1 : diff, 0, 2)];
    this.t = Math.random() * 0.3; this.state = 'idle'; this.target = null; this.goal = {x: 640, y: 300};
    this.retarget = 0; this.lastX = f.x; this.stuckT = 0; this.stuckAcc = 0; this.unstick = 0; this.udir = 1;
    this.atkGo = true; this.aimErr = 0; this.charging = false; this.chargeT = 0; this.dodgeCd = 0; this.jcd = 0;
    this.dx = 0; this.dy = 0; this.dist = 999; this.pause = 0; this.awkT = 0.5; this.dodgedAwk = null;
  }
  update(dt, m) {
    const f = this.f, I = f.input;
    I.jumpP = false; I.spP = false; I.dropP = false; I.awkP = false;
    if (!f.alive || m.frozen || f.ragdoll) { I.mx = 0; I.atkH = false; I.jumpH = false; I.face = 0; return; }
    this.t -= dt; this.retarget -= dt; this.dodgeCd -= dt; this.jcd -= dt; this.chargeT -= dt; this.pause -= dt;
    if (this.t <= 0) { this.decide(m); this.t = this.D.react * (0.8 + Math.random() * 0.45); }
    this.exec(dt, m);
  }
  decide(m) {
    const f = this.f, D = this.D;
    const es = m.fighters.filter(e => e !== f && e.alive && !e.out);
    if (!es.length) { this.state = 'idle'; this.target = null; return; }
    // alvo
    let best = null, bs = 1e9;
    if (this.pers === 'chaos') {
      if (!this.target || !this.target.alive || this.retarget <= 0) { this.target = pick(es); this.retarget = rnd(1.5, 4); }
      best = this.target;
    } else {
      for (const e of es) {
        const d = Math.hypot(e.cx - f.x, e.cy - (f.y - 50));
        const s = this.pers === 'tactician' ? d + e.hp * 3 : d;
        if (s < bs) { bs = s; best = e; }
      }
      if (best !== this.target) this.retarget = 0;
    }
    this.target = best;
    const e = best;
    this.dx = e.cx - f.x; this.dy = e.cy - (f.y - 50); this.dist = Math.hypot(this.dx, this.dy);
    this.atkGo = Math.random() < D.atk; this.aimErr = (Math.random() * 2 - 1) * D.aim;
    this.pause = (D.edge < 0.9 && Math.random() < 0.1) ? rnd(0.2, 0.5) : 0;
    const w = f.wdef(), ranged = f.wp && w.type !== 'melee';
    // perigo
    if (m.danger(f.x, f.y - 30)) { this.state = 'avoid'; const c = m.nearestSafe(f.x, f.y); this.goal.x = f.x + (f.x < 640 ? 160 : -160); this.goal.y = f.y; return; }
    // arma
    const empty = f.wp && w.type !== 'melee' && f.wp.ammo <= 0;
    if (!f.wp || empty) {
      let item = null, bd = 1e9;
      for (const it of m.items) { const d = Math.abs(it.x - f.x) + Math.abs(it.y - f.y) * 1.6; if (d < bd) { bd = d; item = it; } }
      if (item && (this.pers === 'hunter' || bd < 750 || this.dist > 520)) { this.state = 'seek'; this.goal.x = item.x; this.goal.y = item.y; return; }
    }
    if (ranged && !empty) {
      let pref = PREF_DIST[w.id] || 380;
      if (this.pers === 'hunter') pref *= 0.7;
      if (this.pers === 'chaos') pref *= 0.5;
      if (w.id === 'mine') { this.state = this.dist < 220 ? 'distance' : 'approach'; this.goal.x = e.cx; this.goal.y = e.cy; return; }
      if (this.dist < pref * 0.6 && this.pers !== 'chaos') this.state = 'distance';
      else if (this.dist > pref * 1.3) this.state = 'approach';
      else this.state = 'hold';
      this.goal.x = e.cx; this.goal.y = e.cy;
    } else {
      this.state = 'approach';
      const reach = w.len || 20;
      let gx = e.cx;
      if (D.react <= 0.1 && f.wp) gx = e.cx + sgn(640 - e.cx) * reach * 0.6; // difícil: empurra para fora
      this.goal.x = gx; this.goal.y = e.cy;
      if (this.pers === 'tactician' && f.hp < 30 && this.dist < 200) this.state = 'distance';
    }
  }
  exec(dt, m) {
    const f = this.f, I = f.input, D = this.D, e = this.target;
    I.atkH = false; I.my = 0; I.jumpH = false; I.mx = 0; I.face = 0;
    if (!e || !e.alive) return;
    const w = f.wdef(), g = this.goal;
    this.dx = e.cx - f.x; this.dy = e.cy - (f.y - 50); this.dist = Math.hypot(this.dx, this.dy);
    const tdir = this.dx < 0 ? -1 : 1;
    let mx = 0, dropNow = false;
    // recuperação de queda
    const below = m.platBelow(f.x, f.y, 700) || m.platBelow(f.x - 30, f.y, 700) || m.platBelow(f.x + 30, f.y, 700);
    if (!f.grounded && !below) {
      const c = m.nearestSafe(f.x, f.y);
      mx = c.x < f.x ? -1 : 1; this.state = 'recover';
      if (f.vy > 200 && f.airJumps > 0 && f.y > c.y - 40) I.jumpP = true;
      if (D.sp > 0 && f.specialCd <= 0 && Math.abs(c.x - f.x) > 220 && f.vy > 0 && Math.random() < 0.02) I.spP = true;
      I.mx = mx; I.jumpH = true; I.face = 0; return;
    }
    const dxg = g.x - f.x;
    const reach = (w.len || 20);
    switch (this.state) {
      case 'distance': mx = -tdir; I.face = tdir; break;
      case 'hold': mx = 0; I.face = tdir; break;
      case 'avoid': mx = sgn(dxg); break;
      default: {
        const stop = (this.state === 'approach' && !(f.wp && w.type !== 'melee')) ? Math.max(8, reach * 0.55) : 26;
        if (Math.abs(dxg) > stop) mx = sgn(dxg);
      }
    }
    if (this.pause > 0) mx = 0;
    // vigia de ociosidade: parado no chão querendo chegar longe => ignora a borda
    if (f.grounded && mx === 0 && this.state !== 'hold' && this.state !== 'distance' && Math.abs(dxg) > 60 && this.pause <= 0) this.idleT = (this.idleT || 0) + dt; else this.idleT = 0;
    if (this.idleT > 2.2) { this.idleT = 0; this.reckless = 1.6; this.rdir = sgn(dxg); }
    if (this.reckless > 0) { this.reckless -= dt; mx = this.rdir; if (!m.groundAhead(f.x, f.y, mx) && this.jcd <= 0) { I.jumpP = true; this.jcd = 0.45; } }
    if (this.pers === 'chaos' && Math.random() < 0.004) I.jumpP = true;
    // não cair sem querer
    if (mx !== 0 && !(this.reckless > 0) && f.grounded && !(this.pers === 'chaos' && Math.random() < 0.3)) {
      if (!m.groundAhead(f.x, f.y, mx) && Math.random() < D.edge) {
        if (m.canCross(f.x, f.y, mx) && this.jcd <= 0) { I.jumpP = true; this.jcd = 0.6; } else mx = 0;
      }
    }
    // saltar para subir / descer
    if (f.grounded && g.y < f.y - 100 && Math.abs(dxg) < 320 && this.jcd <= 0 && this.state !== 'distance') { I.jumpP = true; this.jcd = 0.55; }
    if (f.grounded && g.y > f.y + 90 && f.plat && !f.plat.solid && Math.abs(dxg) < 120 && this.jcd <= 0) { I.jumpP = true; I.my = 1; dropNow = true; this.jcd = 0.5; }
    if (f.wall !== 0 && mx === f.wall && this.jcd <= 0) { I.jumpP = true; this.jcd = 0.5; }
    // travado
    this.stuckT += dt;
    if (this.stuckT >= 0.4) {
      this.stuckT = 0;
      if (Math.abs(mx) > 0 && Math.abs(f.x - this.lastX) < 8 && f.grounded) this.stuckAcc += 0.4; else this.stuckAcc = 0;
      this.lastX = f.x;
      if (this.stuckAcc >= 0.8) { this.stuckAcc = 0; this.unstick = 0.7; this.udir = -sgn(mx || 1); I.jumpP = true; if (Math.random() < 0.5) this.state = 'approach'; }
    }
    if (this.unstick > 0) { this.unstick -= dt; mx = this.udir; }
    I.mx = mx; I.jumpH = true;
    // desvio de projéteis
    if (D.dodge > 0 && this.dodgeCd <= 0 && f.grounded) {
      for (const pr of m.projs) {
        if (pr.owner === f || pr.kind === 'fire') continue;
        const rel = pr.x - f.x;
        if (Math.abs(rel) < 280 && sgn(pr.vx) === -sgn(rel) && Math.abs(pr.y - (f.y - 50)) < 60 && Math.random() < D.dodge * 0.15) { I.jumpP = true; this.dodgeCd = 0.8; break; }
      }
    }
    // ataque
    const adx = Math.abs(this.dx), facingT = (f.facing === tdir);
    let atk = false, aimY = 0;
    if (f.wp && w.type !== 'melee' && f.wp.ammo <= 0) { /* vazia */ }
    else if (w.type === 'melee') {
      const r = w.id === 'fist' ? 44 : reach + (w.style === 'thrust' ? 10 : 22);
      atk = this.atkGo && adx < r && Math.abs(this.dy) < 70 && facingT;
      if (this.state === 'seek') atk = atk && adx < r * 0.8;
    } else {
      const ang = Math.atan2(this.dy, Math.max(30, adx));
      const range = w.rng || 500;
      const aligned = Math.abs(ang) < 0.62;
      const los = m.los(f.x, f.y - 55, e.cx, e.cy);
      aimY = clamp((ang + this.aimErr) / 0.75, -1, 1);
      const ok = aligned && adx < range && los && facingT;
      if (w.type === 'gun' && w.charge) {
        if (!this.charging && this.atkGo && ok && f.cd <= 0) { this.charging = true; this.chargeT = rnd(0.35, 0.85); }
        if (this.charging) { atk = true; if (this.chargeT <= 0) { atk = false; this.charging = false; } if (!ok && this.chargeT < 0.3) { atk = false; this.charging = false; } }
      } else if (w.type === 'throw') atk = this.atkGo && adx > 130 && adx < w.rng && Math.abs(this.dy) < 200 && facingT;
      else if (w.type === 'mine') atk = this.atkGo && adx < 260 && f.grounded && (this.state === 'distance' || Math.random() < 0.01);
      else if (w.id === 'rocket') atk = this.atkGo && ok && adx > 170;
      else atk = this.atkGo && ok;
      if (w.type !== 'mine') I.my = aimY;
    }
    if (dropNow) I.my = 1;
    I.atkH = atk;
    // habilidade especial
    if (D.sp > 0 && f.specialCd <= 0 && adx < 280 && Math.abs(this.dy) < 70 && facingT && Math.random() < 0.012 * D.sp) I.spP = true;
    // AWAKENING: usa quando carregado e há oportunidade (alvo perto, atordoado ou caído)
    if (f.canAwk()) {
      this.awkT -= dt;
      if (this.awkT <= 0) {
        this.awkT = rnd(0.25, 0.6);
        const di = DIFF.indexOf(D), foeStun = e.ragdoll || e.hitstun > 0 || e.getUpT > 0 || e.awk;
        const inRange = adx < 430 && Math.abs(this.dy) < 120;
        const p = [0.3, 0.6, 0.95][di] * (foeStun ? 1.5 : 1) * (inRange ? 1 : 0.2);
        if ((inRange || (foeStun && adx < 520)) && Math.random() < p) I.awkP = true;
      }
    }
    // defesa: salta para fora do alcance do AWAKENING inimigo
    if (e.awk && f.grounded && D.dodge > 0 && this.dodgedAwk !== e.awk) {
      const aw = e.awk, late = aw.ph === 'dash' || aw.ph === 'blink' || (aw.ph === 'prep' && aw.lt > (AWK_T[aw.type].prep - 0.25));
      if (late && adx < 620) { this.dodgedAwk = aw; if (Math.random() < D.dodge) { I.jumpP = true; this.jcd = 0.5; } }
    }
  }
}

'use strict';
/* STICK MAYHEM — renderização (Canvas 2D) */
const OUT = '#0a0c18';
const _shadeCache = new Map();
function shade(hex, a) {
  const key = hex + a; let v = _shadeCache.get(key); if (v) return v;
  let h = hex.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join('');
  let r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
  const t = a < 0 ? 0 : 255, p = Math.abs(a);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  v = `rgb(${r},${g},${b})`; _shadeCache.set(key, v); return v;
}
function srng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

// ---------- armas ----------
function wShape(ctx, id, charge) {
  const W = WEAPONS[id], c = W.color, c2 = W.color2 || '#555', L = W.len || 30;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = 2; ctx.strokeStyle = OUT;
  const rect = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.rect(x, y, w, h); ctx.fill(); ctx.stroke(); };
  const poly = (pts, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); ctx.fill(); ctx.stroke(); };
  const circ = (x, y, r, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.stroke(); };
  switch (id) {
    case 'sword': rect(-10, -2.5, 12, 5, '#6b3f1d'); rect(1, -8, 5, 16, c2); poly([[6, -4], [L - 8, -3], [L, 0], [L - 8, 3], [6, 4]], c); break;
    case 'katana': rect(-10, -2.5, 12, 5, '#1f2937'); rect(1, -6, 3, 12, c2); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(4, -3); ctx.quadraticCurveTo(L * 0.6, -6, L, -2); ctx.lineTo(L - 2, 1); ctx.quadraticCurveTo(L * 0.6, -1, 4, 3); ctx.closePath(); ctx.fill(); ctx.stroke(); break;
    case 'hammer': rect(-8, -2.5, L + 2, 5, c2); rect(L - 8, -13, 18, 26, c); rect(L - 8, -13, 5, 26, shade(c, 0.3)); break;
    case 'axe': rect(-8, -2.5, L + 2, 5, c2); poly([[L - 10, -2], [L - 6, -16], [L + 8, -12], [L + 6, 6], [L - 6, 2]], c); break;
    case 'spear': rect(-24, -2, L - 6, 4, c2); poly([[L - 30, -6], [L - 4, 0], [L - 30, 6]], c); break;
    case 'bat': poly([[-10, -2], [L * 0.5, -2.5], [L, -6], [L + 2, 6], [L * 0.5, 2.5], [-10, 2]], c); rect(-10, -2.5, 10, 5, c2); break;
    case 'daggers': for (const o of [-4, 4]) { rect(-6, o - 2, 7, 4, c2); poly([[1, o - 3.5], [L - 6, o - 2], [L, o], [L - 6, o + 2], [1, o + 3.5]], c); } break;
    case 'scythe': rect(-14, -2, L + 6, 4, c2); ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(L - 8, 14, 20, -1.9, 0.2); ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(L - 8, 14, 20, -1.9, 0.2); ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = OUT; break;
    case 'pistol': rect(-3, 0, 7, 11, c2); rect(-4, -4, 26, 8, c); rect(20, -3, 8, 4, '#222'); break;
    case 'revolver': rect(-3, 0, 7, 12, c2); rect(-4, -4, 30, 7, c); circ(8, -1, 6, shade(c, -0.2)); rect(24, -3, 10, 5, '#222'); break;
    case 'smg': rect(-4, 0, 7, 11, c2); rect(6, 2, 6, 15, shade(c, -0.3)); rect(-6, -5, 36, 9, c); rect(30, -3, 8, 4, '#222'); break;
    case 'rifle': rect(-16, -4, 14, 9, c2); rect(-4, -4, 44, 7, c); rect(40, -2, 16, 3, '#222'); rect(8, -9, 14, 5, '#111'); break;
    case 'shotgun': rect(-14, -4, 14, 9, c2); rect(-2, -4, 40, 4, c); rect(-2, 0, 40, 4, shade(c, -0.2)); rect(10, 4, 14, 4, c2); break;
    case 'bow': ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(-4, 0, 22, -1.3, 1.3); ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(-4, 0, 22, -1.3, 1.3); ctx.stroke(); {
      const px = -4 + Math.cos(1.3) * 22, py = Math.sin(1.3) * 22, pull = (charge || 0) * 16;
      ctx.strokeStyle = W.color2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px, -py); ctx.lineTo(-pull - 2, 0); ctx.lineTo(px, py); ctx.stroke();
      if (charge > 0.05) { ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-pull - 2, 0); ctx.lineTo(22, 0); ctx.stroke(); } } ctx.lineWidth = 2; ctx.strokeStyle = OUT; break;
    case 'crossbow': rect(-12, -3, 36, 6, c); ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(16, -16); ctx.quadraticCurveTo(24, 0, 16, 16); ctx.stroke(); ctx.strokeStyle = c2; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(16, -16); ctx.quadraticCurveTo(24, 0, 16, 16); ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = OUT; rect(0, 3, 6, 8, '#333'); break;
    case 'rocket': rect(-20, -6, 56, 12, c); rect(30, -8, 10, 16, c2); poly([[-20, -6], [-28, -10], [-28, 10], [-20, 6]], '#333'); rect(0, 6, 6, 9, '#222'); break;
    case 'cannon': rect(-10, -6, 40, 12, c); circ(30, 0, 8, W.color2); rect(-6, 4, 6, 9, '#222'); circ(-6, -1, 3, W.color2); break;
    case 'laser': rect(-4, 0, 7, 11, '#222'); poly([[-6, -5], [28, -5], [38, 0], [28, 5], [-6, 5]], c); circ(34, 0, 3, W.color2); break;
    case 'grenade': circ(0, 0, 8, c); rect(-3, -12, 6, 5, '#555'); ctx.strokeStyle = c2; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(5, -11, 4, 0, 6.283); ctx.stroke(); ctx.strokeStyle = OUT; break;
    case 'mine': poly([[-12, 5], [-9, -3], [9, -3], [12, 5]], c); circ(0, -4, 3, c2); break;
    case 'nunchaku': rect(-10, -2.5, 18, 5, c); ctx.strokeStyle = c2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(8, 0); ctx.quadraticCurveTo(14, 5, 20, 3); ctx.stroke(); ctx.strokeStyle = OUT; ctx.save(); ctx.translate(20, 3); ctx.rotate(0.45); rect(0, -2.5, 22, 5, c); ctx.restore(); break;
    case 'mace': rect(-8, -2.5, L - 6, 5, c2); circ(L, 0, 10, c); for (let i = 0; i < 6; i++) { const a = i * 1.047; poly([[L + Math.cos(a - 0.25) * 9, Math.sin(a - 0.25) * 9], [L + Math.cos(a) * 16, Math.sin(a) * 16], [L + Math.cos(a + 0.25) * 9, Math.sin(a + 0.25) * 9]], shade(c, -0.2)); } break;
    case 'trident': rect(-24, -2, L - 18, 4, c2); rect(L - 40, -9, 4, 18, c); for (const oy of [-8, 0, 8]) poly([[L - 40, oy - 2], [L - 8, oy - 1.5], [L - 1, oy], [L - 8, oy + 1.5], [L - 40, oy + 2]], c); break;
    case 'whip': rect(-8, -2.5, 14, 5, c2); ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(6, 0); ctx.bezierCurveTo(L * 0.4, -14, L * 0.7, 14, L, 2); ctx.stroke(); ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = OUT; break;
    case 'chainsaw': rect(-10, -6, 22, 12, c2); rect(-6, 5, 6, 9, '#222'); rect(12, -4.5, L - 12, 9, c); ctx.fillStyle = '#334155'; for (let x = 14; x < L; x += 5) ctx.fillRect(x, -7, 2.5, 3); for (let x = 14; x < L; x += 5) ctx.fillRect(x, 4, 2.5, 3); break;
    case 'boomerang': poly([[-6, -11], [10, -13], [8, -5], [-2, 0], [8, 5], [10, 13], [-6, 11], [-13, 0]], c); ctx.strokeStyle = c2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-8, -6); ctx.lineTo(-4, 0); ctx.lineTo(-8, 6); ctx.stroke(); ctx.strokeStyle = OUT; break;
    case 'shuriken': poly([[0, -12], [3.5, -3.5], [12, 0], [3.5, 3.5], [0, 12], [-3.5, 3.5], [-12, 0], [-3.5, -3.5]], c); circ(0, 0, 3, c2); break;
    case 'flamer': rect(-14, -5, 30, 10, c); rect(-12, 4, 9, 15, c2); rect(16, -3, 20, 6, '#334155'); circ(36, 0, 3, '#fde047'); rect(2, 4, 5, 9, '#222'); break;
    case 'sniper': rect(-18, -4, 16, 9, c2); rect(-4, -3, 58, 6, c); rect(50, -2, 18, 3, '#111'); rect(4, -10, 20, 6, '#111'); circ(8, -7, 2, '#22d3ee'); rect(10, 3, 5, 9, '#222'); break;
    case 'glauncher': rect(-14, -6, 40, 12, c); circ(8, 1, 9, c2); rect(26, -4.5, 14, 9, '#222'); rect(-4, 6, 6, 9, '#222'); break;
    case 'zapper': rect(-6, 0, 7, 11, '#222'); rect(-6, -5, 26, 10, c2); circ(25, 0, 7, c); ctx.strokeStyle = '#fef9c3'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(30, -3); ctx.lineTo(36, -7); ctx.lineTo(34, 0); ctx.lineTo(40, -2); ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = OUT; break;
    case 'dynamite': for (const oy of [-6, 0, 6]) rect(-13, oy - 3, 26, 6, c); rect(-3, -9, 3, 18, '#fde68a'); rect(5, -9, 3, 18, '#fde68a'); ctx.strokeStyle = '#d6d3d1'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(13, 0); ctx.quadraticCurveTo(20, -8, 24, -4); ctx.stroke(); ctx.strokeStyle = OUT; circ(24, -4, 2.5, c2); break;
    default: break; // punho
  }
}
function drawWeaponIcon(cv, id) {
  const ctx = cv.getContext('2d'), w = cv.width, h = cv.height;
  ctx.clearRect(0, 0, w, h); ctx.save();
  const W = WEAPONS[id], len = Math.max(30, (W.type === 'melee' ? W.len : ({sniper: 62, flamer: 36, glauncher: 36, rifle: 52, rocket: 46, whip: 100}[id] || 36)) + 24);
  const s = Math.min(w / (len + 24), h / 44);
  ctx.translate(w / 2 - (len / 2 - 8) * s, h / 2); ctx.scale(s, s); wShape(ctx, id, 0.5); ctx.restore();
}

// ---------- fundos das arenas ----------
const decorStatic = {
  neon(c) {
    const r = srng(7);
    for (let l = 0; l < 2; l++) {
      c.fillStyle = l ? '#150d3d' : '#0e0a2e';
      for (let x = -20; x < 1300; x += 70 + r() * 40) {
        const h = 160 + r() * (l ? 260 : 190), w = 60 + r() * 50;
        c.fillRect(x, 640 - h, w, h);
        c.fillStyle = l ? '#ffd86b' : '#8be9ff';
        for (let wy = 640 - h + 14; wy < 600; wy += 24) for (let wx = x + 8; wx < x + w - 10; wx += 16) { if (r() < 0.35) { c.globalAlpha = 0.5 + r() * 0.4; c.fillRect(wx, wy, 6, 9); } }
        c.globalAlpha = 1; c.fillStyle = l ? '#150d3d' : '#0e0a2e';
      }
    }
    c.fillStyle = '#ffffff'; for (let i = 0; i < 40; i++) { c.globalAlpha = 0.3 + r() * 0.6; c.fillRect(r() * 1280, r() * 260, 2, 2); } c.globalAlpha = 1;
    c.fillStyle = '#f9a8ff'; c.beginPath(); c.arc(1050, 110, 46, 0, 6.283); c.fill(); c.fillStyle = '#1a0b3b'; c.beginPath(); c.arc(1068, 100, 42, 0, 6.283); c.fill();
  },
  sky(c) {
    const r = srng(11);
    c.fillStyle = '#fff6c9'; c.beginPath(); c.arc(220, 150, 60, 0, 6.283); c.fill(); c.globalAlpha = 0.3; c.beginPath(); c.arc(220, 150, 95, 0, 6.283); c.fill(); c.globalAlpha = 1;
    for (let i = 0; i < 6; i++) {
      const x = 80 + i * 220 + r() * 60, y = 300 + r() * 300, w = 90 + r() * 120;
      c.fillStyle = 'rgba(80,60,130,0.35)'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w * 0.6, y + 50 + r() * 40); c.lineTo(x + w * 0.4, y + 80 + r() * 40); c.closePath(); c.fill();
      c.fillStyle = 'rgba(120,200,120,0.35)'; c.fillRect(x, y - 6, w, 8);
    }
    c.fillStyle = 'rgba(90,70,140,0.45)';
    for (const [x, w] of [[420, 70], [800, 90], [980, 50]]) { c.fillRect(x, 560, 14, -80 - r() * 60); c.fillRect(x + w - 14, 560, 14, -60 - r() * 60); c.fillRect(x - 4, 470, w + 8, 12); }
  },
  volcano(c) {
    c.fillStyle = '#1b0707'; c.beginPath(); c.moveTo(300, 720); c.lineTo(560, 230); c.lineTo(640, 260); c.lineTo(720, 230); c.lineTo(980, 720); c.closePath(); c.fill();
    const g = c.createRadialGradient(640, 235, 10, 640, 235, 260); g.addColorStop(0, 'rgba(255,120,30,0.8)'); g.addColorStop(1, 'rgba(255,60,0,0)'); c.fillStyle = g; c.fillRect(300, 0, 680, 520);
    c.fillStyle = '#ff7a1a'; c.beginPath(); c.moveTo(600, 255); c.lineTo(640, 330); c.lineTo(690, 250); c.lineTo(650, 250); c.closePath(); c.fill();
    c.strokeStyle = '#ff5a1f'; c.lineWidth = 3; c.beginPath(); c.moveTo(640, 330); c.lineTo(610, 450); c.lineTo(640, 560); c.moveTo(640, 330); c.lineTo(690, 470); c.stroke();
    const r = srng(3); c.fillStyle = '#12090a'; for (let i = 0; i < 8; i++) { const x = r() * 1280; c.beginPath(); c.moveTo(x, 720); c.lineTo(x + 40, 560 + r() * 60); c.lineTo(x + 90, 720); c.fill(); }
  },
  industrial(c) {
    const r = srng(5);
    c.fillStyle = '#2b3442'; for (let x = 0; x < 1280; x += 160) { c.fillRect(x, 0, 12, 720); }
    c.fillStyle = '#374151'; c.fillRect(0, 120, 1280, 18); c.fillRect(0, 300, 1280, 10);
    c.fillStyle = '#ffd86b'; for (let x = 20; x < 1280; x += 180) for (let y = 40; y < 100; y += 30) { c.globalAlpha = 0.4; c.fillRect(x, y, 70, 12); } c.globalAlpha = 1;
    c.fillStyle = '#1b222d'; for (let i = 0; i < 5; i++) { c.fillRect(60 + i * 250, 140 + r() * 40, 90, 100); }
    c.fillStyle = '#facc15'; for (let x = 0; x < 1280; x += 40) c.fillRect(x, 700, 20, 20);
  },
  frozen(c) {
    const r = srng(9);
    for (let l = 0; l < 3; l++) {
      c.fillStyle = ['#2a6f9b', '#4a9fc7', '#8cd0ee'][l]; c.beginPath(); c.moveTo(0, 720);
      for (let x = 0; x <= 1280; x += 90) c.lineTo(x, 430 + l * 60 - r() * (160 - l * 30)); c.lineTo(1280, 720); c.closePath(); c.fill();
    }
    c.fillStyle = '#ffffffcc'; for (let i = 0; i < 12; i++) { const x = r() * 1280, y = 420 + r() * 120; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 18, y + 40); c.lineTo(x - 18, y + 40); c.fill(); }
  },
  cyber(c) {
    const r = srng(13);
    for (let row = 0; row < 6; row++) { c.fillStyle = `rgba(80,70,200,${0.08 + row * 0.03})`; c.fillRect(0, 220 + row * 55, 1280, 50); for (let x = 10; x < 1280; x += 22) { c.fillStyle = r() < 0.5 ? '#22d3ee' : '#a78bfa'; c.globalAlpha = 0.25 + r() * 0.5; c.fillRect(x, 232 + row * 55, 6, 6); } c.globalAlpha = 1; }
    c.strokeStyle = 'rgba(167,139,250,0.4)'; c.lineWidth = 3; c.beginPath(); c.arc(640, 320, 180, 0, 6.283); c.stroke(); c.beginPath(); c.arc(640, 320, 120, 0, 6.283); c.stroke();
    c.fillStyle = '#0b1230'; c.fillRect(0, 150, 1280, 12);
  },
  abyss(c) {
    const r = srng(21);
    c.fillStyle = '#fff'; for (let i = 0; i < 70; i++) { c.globalAlpha = 0.2 + r() * 0.7; c.fillRect(r() * 1280, r() * 460, 2, 2); } c.globalAlpha = 1;
    const g = c.createRadialGradient(640, 760, 20, 640, 760, 460); g.addColorStop(0, 'rgba(255,60,120,0.65)'); g.addColorStop(1, 'rgba(120,0,200,0)'); c.fillStyle = g; c.fillRect(0, 300, 1280, 420);
    c.fillStyle = '#0a0518'; for (let i = 0; i < 7; i++) { const x = i * 200 + r() * 60; c.beginPath(); c.moveTo(x, 720); c.lineTo(x + 40, 560 - r() * 160); c.lineTo(x + 100, 720); c.fill(); }
  },
  training(c) {
    c.strokeStyle = 'rgba(71,85,105,0.25)'; c.lineWidth = 1;
    for (let x = 0; x < 1280; x += 64) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 720); c.stroke(); }
    for (let y = 0; y < 720; y += 64) { c.beginPath(); c.moveTo(0, y); c.lineTo(1280, y); c.stroke(); }
    c.fillStyle = 'rgba(30,41,59,0.8)'; c.font = 'bold 22px sans-serif'; c.textAlign = 'center';
    c.fillText('SALA DE TREINO', 640, 90);
    c.font = '18px sans-serif'; c.fillText('Mova-se, pule (duplo pulo!), pegue armas que caem e ataque.', 640, 130);
    c.fillText('Pule + stick para baixo = atravessa plataformas finas.', 640, 160);
  },
};
const decorDyn = {
  neon(c, t) {
    if (GFX.low) return;
    c.fillStyle = 'rgba(180,200,255,0.25)'; c.lineWidth = 1.5; c.strokeStyle = 'rgba(180,200,255,0.25)'; c.beginPath();
    for (let i = 0; i < 36; i++) { const x = (i * 97) % 1300, y = ((i * 53) % 800 + t * 700) % 800 - 40; c.moveTo(x, y); c.lineTo(x - 4, y + 16); } c.stroke();
    const signs = [[120, 220, 'NEON', '#ff3df2'], [920, 170, 'BAR', '#00e5ff'], [560, 120, '24H', '#ffe66d']];
    c.font = 'bold 36px sans-serif'; c.textAlign = 'center';
    for (let i = 0; i < 3; i++) { const s = signs[i], fl = (Math.sin(t * (3 + i)) > -0.7 || (t * 7 | 0) % 11 > 0) ? 1 : 0.25; c.globalAlpha = 0.9 * fl; c.fillStyle = s[3]; c.fillText(s[2], s[0], s[1]); c.globalAlpha = 0.18 * fl; c.fillRect(s[0] - 60, s[1] - 38, 120, 52); } c.globalAlpha = 1;
  },
  sky(c, t) {
    if (GFX.low) return;
    c.fillStyle = 'rgba(255,255,255,0.7)';
    for (let i = 0; i < 5; i++) { const x = ((i * 330 + t * (8 + i * 3)) % 1500) - 110, y = 60 + i * 55; c.beginPath(); c.ellipse(x, y, 70, 20, 0, 0, 6.283); c.ellipse(x + 40, y - 10, 50, 22, 0, 0, 6.283); c.ellipse(x - 40, y + 4, 44, 16, 0, 0, 6.283); c.fill(); }
  },
  volcano(c, t, m) {
    if (GFX.low) { c.fillStyle = '#ff6a1a'; c.fillRect(0, 696, 1280, 24); c.fillStyle = '#ffb347'; c.fillRect(0, 696, 1280, 5); return; }
    c.fillStyle = '#ff6a1a'; c.beginPath(); c.moveTo(0, 720); for (let x = 0; x <= 1280; x += 40) c.lineTo(x, 690 + Math.sin(x * 0.02 + t * 2) * 6 + Math.sin(x * 0.05 - t * 3) * 3); c.lineTo(1280, 720); c.closePath(); c.fill();
    c.fillStyle = '#ffd05a'; c.globalAlpha = 0.7; c.beginPath(); c.moveTo(0, 720); for (let x = 0; x <= 1280; x += 40) c.lineTo(x, 704 + Math.sin(x * 0.03 - t * 2.5) * 4); c.lineTo(1280, 720); c.closePath(); c.fill(); c.globalAlpha = 1;
    c.fillStyle = '#ffb347'; for (let i = 0; i < 24; i++) { const x = (i * 71) % 1280, y = 700 - ((t * 40 + i * 53) % 520); c.globalAlpha = 0.7; c.fillRect(x + Math.sin(t + i) * 12, y, 3, 3); } c.globalAlpha = 1;
  },
  industrial(c, t) {
    if (GFX.low) return;
    for (const [x, y, r, d] of [[200, 200, 60, 1], [330, 240, 40, -1], [1020, 180, 70, -1], [900, 250, 38, 1]]) {
      c.save(); c.translate(x, y); c.rotate(t * 0.6 * d); c.fillStyle = '#3b4658';
      for (let i = 0; i < 10; i++) { c.rotate(0.628); c.fillRect(r - 4, -7, 14, 14); }
      c.beginPath(); c.arc(0, 0, r, 0, 6.283); c.fill(); c.fillStyle = '#1b222d'; c.beginPath(); c.arc(0, 0, r * 0.35, 0, 6.283); c.fill(); c.restore();
    }
    c.fillStyle = 'rgba(255,255,255,0.12)'; for (let i = 0; i < 6; i++) { const y = 700 - ((t * 50 + i * 90) % 400); c.beginPath(); c.arc(150 + i * 4, y, 14 + (700 - y) * 0.06, 0, 6.283); c.fill(); }
  },
  frozen(c, t) {
    if (GFX.low) return;
    for (let i = 0; i < 3; i++) { c.globalAlpha = 0.12; c.fillStyle = ['#7affc2', '#7ab8ff', '#d27aff'][i]; c.beginPath(); c.moveTo(0, 60 + i * 30); for (let x = 0; x <= 1280; x += 40) c.lineTo(x, 80 + i * 40 + Math.sin(x * 0.01 + t * 0.6 + i) * 40); c.lineTo(1280, 0); c.lineTo(0, 0); c.fill(); } c.globalAlpha = 1;
    c.fillStyle = '#fff'; for (let i = 0; i < 50; i++) { const x = ((i * 83) + Math.sin(t + i) * 20 + 1280) % 1280, y = ((i * 41) + t * (30 + (i % 5) * 12)) % 740; c.fillRect(x, y, 3, 3); }
  },
  cyber(c, t, m) {
    if (!GFX.low) for (let i = 0; i < 4; i++) { const a = Math.sin(t * 0.8 + i * 1.7) * 0.5, x = 200 + i * 290; c.fillStyle = ['rgba(34,211,238,0.12)', 'rgba(167,139,250,0.12)'][i % 2]; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 360 * Math.sin(a) - 70, 640); c.lineTo(x + 360 * Math.sin(a) + 70, 640); c.closePath(); c.fill(); }
    if (m.arena.zaps) for (const z of m.arena.zaps) {
      if (z.active) { c.fillStyle = '#a5f3fc'; c.globalAlpha = 0.5 + Math.random() * 0.3; c.fillRect(z.x, z.y, z.w, z.h); c.globalAlpha = 1; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); for (let i = 0; i < 5; i++) { const x = z.x + Math.random() * z.w; c.moveTo(x, z.y + z.h); c.lineTo(x + rnd(-14, 14), z.y + z.h / 2); c.lineTo(x + rnd(-14, 14), z.y); } c.stroke(); }
      else if (z.warn) { c.fillStyle = '#facc15'; c.globalAlpha = 0.25 + 0.25 * Math.sin(t * 20); c.fillRect(z.x, z.y + z.h - 6, z.w, 6); c.globalAlpha = 1; }
    }
  },
  abyss(c, t) {
    if (GFX.low) return;
    c.fillStyle = '#c084fc'; for (let i = 0; i < 30; i++) { const x = (i * 97 + Math.sin(t * 0.5 + i) * 30) % 1280, y = 720 - ((t * 25 + i * 61) % 600); c.globalAlpha = 0.5; c.fillRect(x, y, 2, 2); } c.globalAlpha = 1;
  },
  training() {},
};
const _bg = {key: '', cv: null, map: new Map()};
function ensureBg(arena, scale) {
  const key = arena.id + '@' + scale.toFixed(2);
  const hit = _bg.map.get(key); if (hit) return hit;
  const cv = document.createElement('canvas'); cv.width = Math.ceil(WORLD_W * scale); cv.height = Math.ceil(WORLD_H * scale);
  const c = cv.getContext('2d'); c.scale(scale, scale);
  const g = c.createLinearGradient(0, 0, 0, WORLD_H); g.addColorStop(0, arena.theme.a); g.addColorStop(1, arena.theme.b);
  c.fillStyle = g; c.fillRect(0, 0, WORLD_W, WORLD_H);
  decorStatic[arena.id](c);
  if (_bg.map.size >= 6) _bg.map.delete(_bg.map.keys().next().value);
  _bg.map.set(key, cv); return cv;
}

// ---------- plataformas ----------
function drawPlatforms(ctx, m, t) {
  const th = m.arena.theme;
  for (const p of m.plats) {
    if (p.inv) continue;
    if (p.x + p.w < -40 || p.x > WORLD_W + 40) { if (p.w < 100) continue; }
    if (p.solid) {
      ctx.fillStyle = p.ice ? '#a5e1fa' : th.plat; ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(p.x, p.y + p.h * 0.55, p.w, p.h * 0.45);
      if (p.h > 40) { ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 2; ctx.beginPath(); for (let x = p.x + 60; x < p.x + p.w; x += 60) { ctx.moveTo(x, p.y + 6); ctx.lineTo(x, p.y + p.h); } ctx.stroke(); }
      ctx.fillStyle = p.ice ? '#ffffff' : th.top; ctx.fillRect(p.x, p.y, p.w, 5);
      ctx.fillStyle = th.glow; ctx.globalAlpha = 0.18; ctx.fillRect(p.x, p.y - 4, p.w, 4); ctx.globalAlpha = 1;
      ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(p.x, p.y, p.w, p.h);
    } else {
      ctx.fillStyle = p.ice ? '#c7efff' : th.plat; ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = p.ice ? '#fff' : th.top; ctx.fillRect(p.x, p.y, p.w, 4);
      ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(p.x, p.y + 10, p.w, 6);
      ctx.fillStyle = th.glow; ctx.globalAlpha = 0.22; ctx.fillRect(p.x, p.y - 3, p.w, 3); ctx.globalAlpha = 1;
      ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(p.x, p.y, p.w, p.h);
      if (p.move) { ctx.fillStyle = '#facc15'; for (let x = p.x + 12; x < p.x + p.w - 6; x += 24) { ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 6 + x); ctx.fillRect(x, p.y + 8, 6, 3); } ctx.globalAlpha = 1; }
    }
  }
}

// ---------- lutador ----------
const STYLE_PAL = {
  tung: {body: '#d98a3d', dk: '#9a5a1c', acc: '#c9792b', skin: '#e6a65c'},
  block: {body: '#17a9c1', dk: '#0e7487', acc: '#6b7280', skin: '#c68e6a', pants: '#3b30b8'},
};
const BLOCK_SHADE = [0, 0.05, -0.06, 0.03, -0.03, 0.08, -0.09, 0.02, -0.04, 0.06, -0.02, 0.04, -0.07, 0.01, 0.07, -0.05];
// cabeça especial das skins prontas (já dentro de translate/rotate/scale da cabeça; rosto para +x)
function drawStyledHead(ctx, st, pal, f, flash, t) {
  const hurt = f.hitstun > 0 || f.ragdoll, dead = !f.alive;
  if (st === 'block') {
    const S = 5.5;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const hair = r === 0 || (c === 0 && r < 3);
      const base = hair ? '#4a2f1b' : pal.skin;
      ctx.fillStyle = flash ? '#fff' : shade(base, BLOCK_SHADE[r * 4 + c]);
      ctx.fillRect(-11 + c * S, -11 + r * S, S + 0.4, S + 0.4);
    }
    if (!flash) { ctx.fillStyle = '#7a4a35'; ctx.fillRect(-0.5, 3.2, 11.5, 4.3); ctx.fillStyle = '#5b3524'; ctx.fillRect(3, 4.8, 5, 2.6); }
    if (dead) { ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1, -4); ctx.lineTo(8, 2); ctx.moveTo(8, -4); ctx.lineTo(1, 2); ctx.stroke(); }
    else { const eh = hurt ? 1.6 : 3.4; ctx.fillStyle = '#fff'; ctx.fillRect(0.5, -3, 8.5, eh); ctx.fillStyle = flash ? '#ccc' : '#5b3fd1'; ctx.fillRect(5.2, -3, 3.6, eh); }
    ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(-11, -11, 22, 22);
  } else if (st === 'tung') {
    const c1 = flash ? '#fff' : pal.body, c2 = flash ? '#eee' : '#f2b873';
    ctx.fillStyle = c1; ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, -4, 12.5, 17, 0, 0, 6.283); ctx.fill(); ctx.stroke();
    ctx.fillStyle = c2; ctx.beginPath(); ctx.ellipse(-5, -8, 3, 10, 0.1, 0, 6.283); ctx.fill();
    ctx.strokeStyle = flash ? '#ddd' : '#a8601f'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(-6, 9, 6, 0.3, 2.6); ctx.stroke(); ctx.beginPath(); ctx.arc(7, -14, 4, 2.6, 5.4); ctx.stroke();
    // olhos grandes
    const lk = hurt ? 0.5 : 1;
    for (const ex of [0.5, 8.2]) {
      ctx.fillStyle = '#fff'; ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(ex, -7, 4.2, 5.6 * lk, 0, 0, 6.283); ctx.fill(); ctx.stroke();
      if (dead) { ctx.beginPath(); ctx.moveTo(ex - 2, -9); ctx.lineTo(ex + 2, -5); ctx.moveTo(ex + 2, -9); ctx.lineTo(ex - 2, -5); ctx.stroke(); }
      else { ctx.fillStyle = '#3b2412'; ctx.beginPath(); ctx.arc(ex + 1.3, -7, 2.2, 0, 6.283); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(ex + 0.6, -8.2, 1, 1); }
    }
    ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-3, -15); ctx.quadraticCurveTo(1, -17, 4, -14); ctx.moveTo(5, -14.5); ctx.quadraticCurveTo(9, -17, 12, -14); ctx.stroke();
    ctx.fillStyle = flash ? '#eee' : '#b86a28'; ctx.beginPath(); ctx.arc(5, 0, 2.2, 0, 6.283); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.beginPath(); if (hurt || dead) { ctx.arc(5, 9, 4, 3.4, 6.0); } else { ctx.arc(4.5, 3, 7.5, 0.3, 2.9); } ctx.stroke();
  }
}
function drawFighter(ctx, f, t, tag) {
  const P = f.pts, sk = f.skin, fx = f.facing;
  ctx.save();
  if (f.invuln > 0 && f.invuln < 90 && ((t * 12) | 0) & 1) ctx.globalAlpha = 0.45;
  if (f.awk && f.awk.ph === 'blink') ctx.globalAlpha = 0.3;
  const flash = f.flash > 0;
  const st = sk.style || '', pal = STYLE_PAL[st] || null;
  const body = flash ? '#ffffff' : (pal ? pal.body : sk.color), dk = flash ? '#e5e5e5' : (pal ? pal.dk : shade(sk.color, -0.38)), acc = flash ? '#ffffff' : (pal ? pal.acc : sk.accent);
  const legC = flash ? '#ffffff' : (st === 'block' ? pal.pants : body), skinC = flash ? '#ffffff' : (pal ? pal.skin : body);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // efeitos por trás
  if (sk.fx === 'aura' && !GFX.low) { const g = ctx.createRadialGradient(P[HIP].x, P[HIP].y - 10, 10, P[HIP].x, P[HIP].y - 10, 80); g.addColorStop(0, acc + 'aa'); g.addColorStop(1, acc + '00'); ctx.fillStyle = g; ctx.fillRect(P[HIP].x - 80, P[HIP].y - 90, 160, 160); }
  if (sk.fx === 'flame' && !GFX.low && Math.random() < 0.5) f.m.fx.add(P[HEAD].x + rnd(-6, 6), P[HEAD].y - 8, rnd(-20, 20), -90, 0.4, 5, Math.random() < 0.5 ? '#ff7a1a' : '#ffd05a', 0, 0);
  if (sk.fx === 'rainbow' && !GFX.low && Math.abs(f.vx) > 100 && Math.random() < 0.8) f.m.fx.add(P[HIP].x, P[HIP].y + rnd(-20, 20), -f.vx * 0.1, 0, 0.5, 5, 'hsl(' + ((t * 300) % 360 | 0) + ',90%,60%)', 0, 0);
  cosFollowFx(f, t);
  cosDrawUnder(ctx, f, t, acc);
  cosDrawBack(ctx, f, t, acc);
  if (sk.cape && sk.cape !== 'none') cosDrawCape(ctx, f, t, acc);
  if (sk.acc === 'backpack') { ctx.save(); ctx.translate((P[CHEST].x + P[HIP].x) / 2 - fx * 8, (P[CHEST].y + P[HIP].y) / 2 - 2); ctx.rotate(Math.atan2(P[CHEST].x - P[HIP].x, P[HIP].y - P[CHEST].y) * 1); ctx.fillStyle = shade(acc, -0.2); ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.rect(-6, -13, 12, 24); ctx.fill(); ctx.stroke(); ctx.restore(); }
  const limb = (a, b, c, w, col) => {
    if (st === 'tung' && w < 11) w *= 0.62;
    ctx.lineCap = st === 'block' ? 'butt' : 'round'; ctx.lineJoin = st === 'block' ? 'miter' : 'round';
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); if (c) ctx.lineTo(c.x, c.y);
    ctx.strokeStyle = OUT; ctx.lineWidth = w + 4; ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
  };
  const foot = (p, col) => { if (st === 'block') { ctx.fillStyle = col; ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.rect(p.x - 6 + fx * 3, p.y - 3, 13, 6); ctx.fill(); ctx.stroke(); return; } if (st === 'tung') col = skinC; ctx.fillStyle = col; ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(p.x + fx * 3, p.y + 1, 7, 4.5, 0, 0, 6.283); ctx.fill(); ctx.stroke(); };
  const hand = (p, col) => { ctx.fillStyle = col; ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(p.x, p.y, 4.8, 0, 6.283); ctx.fill(); ctx.stroke(); };
  const armCol = sk.clothes === 'jacket' ? acc : body;
  // trás
  if (st === 'block') { limb(P[CHEST], P[ELL], null, 9, shade(pal.body, -0.25)); limb(P[ELL], P[HDL], null, 9, shade(pal.skin, -0.25)); }
  else { limb(P[CHEST], P[ELL], P[HDL], 7.5, shade(armCol === acc ? acc : sk.color, -0.4)); hand(P[HDL], dk); }
  limb(P[HIP], P[KNL], P[FTL], 9, st === 'block' ? shade(legC, -0.3) : dk); foot(P[FTL], shade(acc, -0.3));
  // tronco
  limb(P[HIP], P[CHEST], null, st === 'tung' ? 18 : st === 'block' ? 14.5 : 12.5, body);
  if (st === 'block') limb(P[HIP], {x: P[HIP].x + (P[CHEST].x - P[HIP].x) * 0.24, y: P[HIP].y + (P[CHEST].y - P[HIP].y) * 0.24}, null, 14.5, legC);
  if (st === 'tung') { ctx.strokeStyle = flash ? '#ddd' : '#a8601f'; ctx.lineWidth = 1.5; for (const k of [0.3, 0.62]) { const gx = P[HIP].x + (P[CHEST].x - P[HIP].x) * k, gy = P[HIP].y + (P[CHEST].y - P[HIP].y) * k; ctx.beginPath(); ctx.moveTo(gx - 5, gy); ctx.quadraticCurveTo(gx, gy + 3, gx + 5, gy); ctx.stroke(); } }
  if (sk.clothes === 'tshirt' || sk.clothes === 'jacket') { ctx.beginPath(); ctx.moveTo(P[HIP].x + (P[CHEST].x - P[HIP].x) * 0.15, P[HIP].y + (P[CHEST].y - P[HIP].y) * 0.15); ctx.lineTo(P[CHEST].x, P[CHEST].y); ctx.strokeStyle = acc; ctx.lineWidth = 9.5; ctx.stroke(); if (sk.clothes === 'jacket') { ctx.strokeStyle = OUT; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(P[CHEST].x + fx * 1, P[CHEST].y + 2); ctx.lineTo(P[HIP].x + fx * 1, P[HIP].y - 2); ctx.stroke(); } }
  if (sk.clothes === 'armor') { ctx.beginPath(); ctx.moveTo(P[HIP].x, P[HIP].y); ctx.lineTo(P[CHEST].x, P[CHEST].y); ctx.strokeStyle = flash ? '#fff' : '#94a3b8'; ctx.lineWidth = 10; ctx.stroke(); ctx.fillStyle = flash ? '#fff' : '#cbd5e1'; ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(P[CHEST].x, P[CHEST].y + 1, 7, 0, 6.283); ctx.fill(); ctx.stroke(); }
  cosDrawDeco(ctx, f, t, acc, body);
  // cinto
  ctx.beginPath(); ctx.moveTo(P[HIP].x - 5, P[HIP].y - 1); ctx.lineTo(P[HIP].x + 5, P[HIP].y - 1); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke();
  limb(P[HIP], P[KNR], P[FTR], 9, legC); foot(P[FTR], acc);
  if (sk.acc === 'scarf') { const hx = P[HEAD].x, hy = P[HEAD].y; ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(P[CHEST].x - 5, P[CHEST].y - 6); ctx.lineTo(P[CHEST].x + 5, P[CHEST].y - 6); ctx.stroke(); ctx.strokeStyle = acc; ctx.lineWidth = 5; ctx.stroke(); ctx.fillStyle = acc; ctx.beginPath(); ctx.moveTo(P[CHEST].x - fx * 4, P[CHEST].y - 4); ctx.lineTo(P[CHEST].x - fx * (16 + Math.abs(f.vx) * 0.04), P[CHEST].y + 4 + Math.sin(t * 8) * 3); ctx.lineTo(P[CHEST].x - fx * 6, P[CHEST].y + 8); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  // cabeça
  ctx.save();
  const ang = Math.atan2(P[HEAD].x - P[CHEST].x, -(P[HEAD].y - P[CHEST].y));
  ctx.translate(P[HEAD].x, P[HEAD].y); ctx.rotate(ang); ctx.scale(fx, 1);
  if (st) drawStyledHead(ctx, st, pal, f, flash, t);
  else { ctx.fillStyle = body; ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 11, 0, 6.283); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.beginPath(); ctx.arc(-3, -4, 4, 0, 6.283); ctx.fill(); }
  const dead = !f.alive, hurt = f.hitstun > 0 || f.ragdoll;
  if (!st && sk.glasses === 'none' || sk.mask === 'visor') {
    if (sk.mask !== 'visor') {
      if (dead) { ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(2, -4); ctx.lineTo(8, 2); ctx.moveTo(8, -4); ctx.lineTo(2, 2); ctx.stroke(); }
      else { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(5, -1.5, 3.4, hurt ? 1.8 : 3.8, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(6.2, -1.5, 1.7, 0, 6.283); ctx.fill(); }
    }
  }
  // máscara
  if (sk.mask === 'bandana') { ctx.fillStyle = acc; ctx.beginPath(); ctx.moveTo(-10, 3); ctx.lineTo(11, 3); ctx.lineTo(8, 10); ctx.lineTo(-6, 10); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  else if (sk.mask === 'ninja') { ctx.fillStyle = '#1f2937'; ctx.beginPath(); ctx.arc(0, 0, 11.2, -0.1, 3.3); ctx.lineTo(-11, -3); ctx.lineTo(11, -3); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#1f2937'; ctx.fillRect(-11, -3, 22, 14); ctx.fillStyle = body; ctx.fillRect(-2, -5, 13, 5); ctx.fillStyle = '#fff'; ctx.fillRect(3, -4.5, 6, 3); ctx.fillStyle = OUT; ctx.fillRect(5.5, -4.5, 2, 3); }
  else if (sk.mask === 'visor') { ctx.fillStyle = acc; ctx.globalAlpha *= 0.9; ctx.beginPath(); ctx.rect(-1, -6, 13, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.globalAlpha *= 0.6; ctx.fillRect(1, -5, 5, 2); ctx.globalAlpha = f.invuln > 0 && ((t * 12) | 0) & 1 ? 0.45 : 1; }
  else if (sk.mask === 'oni') { ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(0, 0, 11.4, 0, 6.283); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.moveTo(4, 3); ctx.lineTo(6, 9); ctx.lineTo(8, 3); ctx.fill(); ctx.beginPath(); ctx.moveTo(-3, 3); ctx.lineTo(-1, 9); ctx.lineTo(1, 3); ctx.fill(); ctx.fillStyle = '#facc15'; ctx.fillRect(2, -5, 7, 4); ctx.fillStyle = OUT; ctx.fillRect(5, -5, 2, 4); ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.moveTo(-5, -10); ctx.lineTo(-3, -17); ctx.lineTo(0, -10); ctx.fill(); }
  cosDrawMask(ctx, sk, acc, t, flash);
  // óculos
  if (sk.glasses === 'shades') { ctx.fillStyle = '#111'; ctx.fillRect(-1, -6, 13, 6); ctx.strokeRect(-1, -6, 13, 6); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(1, -5, 4, 1.5); }
  else if (sk.glasses === 'round') { ctx.strokeStyle = '#111'; ctx.lineWidth = 2; ctx.fillStyle = 'rgba(180,230,255,0.6)'; ctx.beginPath(); ctx.arc(5.5, -2, 4.2, 0, 6.283); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(1.3, -2); ctx.lineTo(-10, -3); ctx.stroke(); }
  else if (sk.glasses === 'goggles') { ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.fillStyle = 'rgba(255,200,0,0.75)'; ctx.beginPath(); ctx.arc(5, -2, 5, 0, 6.283); ctx.fill(); ctx.stroke(); ctx.strokeStyle = '#374151'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-0.5, -2); ctx.lineTo(-11, -2); ctx.stroke(); }
  else if (sk.glasses === 'star') { ctx.fillStyle = '#fde047'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.5; ctx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 2.4 : 6, a = -1.57 + i * 0.628; ctx.lineTo(5.5 + Math.cos(a) * r, -2 + Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.stroke(); }
  // chapéus
  ctx.lineWidth = 2.5; ctx.strokeStyle = OUT;
  switch (sk.hat) {
    case 'cap': ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(0, -2, 11.5, Math.PI, 0); ctx.fill(); ctx.stroke(); ctx.fillRect(4, -4, 12, 3.5); ctx.strokeRect(4, -4, 12, 3.5); break;
    case 'band': ctx.fillStyle = acc; ctx.fillRect(-11, -8, 22, 5); ctx.strokeRect(-11, -8, 22, 5); ctx.beginPath(); ctx.moveTo(-11, -6); ctx.lineTo(-20, -2 + Math.sin(t * 9) * 2); ctx.lineTo(-18, -9); ctx.closePath(); ctx.fill(); ctx.stroke(); break;
    case 'helmet': ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.arc(0, -1, 12.5, Math.PI, 0); ctx.lineTo(12, 3); ctx.lineTo(-12, 3); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = acc; ctx.fillRect(-1.5, -13, 3, 12); break;
    case 'top': ctx.fillStyle = '#1f2937'; ctx.fillRect(-14, -9, 28, 4); ctx.strokeRect(-14, -9, 28, 4); ctx.fillRect(-8, -26, 16, 18); ctx.strokeRect(-8, -26, 16, 18); ctx.fillStyle = acc; ctx.fillRect(-8, -14, 16, 4); break;
    case 'viking': ctx.fillStyle = '#9ca3af'; ctx.beginPath(); ctx.arc(0, -1, 12.5, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fef3c7'; ctx.beginPath(); ctx.moveTo(-10, -6); ctx.quadraticCurveTo(-22, -10, -18, -22); ctx.quadraticCurveTo(-14, -12, -7, -9); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(10, -6); ctx.quadraticCurveTo(22, -10, 18, -22); ctx.quadraticCurveTo(14, -12, 7, -9); ctx.fill(); ctx.stroke(); break;
    case 'horns': ctx.fillStyle = '#e5e7eb'; ctx.beginPath(); ctx.moveTo(-8, -8); ctx.lineTo(-13, -22); ctx.lineTo(-3, -10); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(8, -8); ctx.lineTo(13, -22); ctx.lineTo(3, -10); ctx.fill(); ctx.stroke(); break;
    case 'crown': ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.moveTo(-10, -8); ctx.lineTo(-11, -20); ctx.lineTo(-5, -14); ctx.lineTo(0, -22); ctx.lineTo(5, -14); ctx.lineTo(11, -20); ctx.lineTo(10, -8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(0, -12, 2, 0, 6.283); ctx.fill(); break;
    default: cosDrawHat(ctx, sk, acc, t, f); break;
  }
  ctx.restore();
  // braço da frente e arma
  const hd = P[HDR];
  if (st === 'block') { limb(P[CHEST], P[ELR], null, 9, pal.body); limb(P[ELR], hd, null, 9, skinC); }
  else limb(P[CHEST], P[ELR], hd, 7.5, armCol === acc ? acc : body);
  const w = f.wdef();
  if (f.wp && !f.celebrate) {
    ctx.save(); ctx.translate(hd.x, hd.y);
    const a = f.wAng; ctx.rotate(Math.atan2(Math.sin(a), fx * Math.cos(a))); if (fx < 0) ctx.scale(1, -1);
    if (f.atkT >= 0 && w.type === 'melee') { const u = f.atkT / w.swing; if (u > 0.3 && u < 0.7) { ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, w.len * 0.9, -0.9, 0.2); ctx.stroke(); } }
    if (!(w.proj === 'boomerang' && f.boomN > 0)) wShape(ctx, f.wp.id, f.charge);
    if (f.beamT > 0) { ctx.fillStyle = w.color2; ctx.beginPath(); ctx.arc(w.muzzle, 0, 5 + Math.random() * 3, 0, 6.283); ctx.fill(); }
    ctx.restore();
  }
  if (st === 'tung' && !f.wp && !f.celebrate) { // bastão característico quando desarmado
    ctx.save(); ctx.translate(hd.x, hd.y); const a = f.atkT >= 0 ? f.wAng : 1.25; ctx.rotate(Math.atan2(Math.sin(a), fx * Math.cos(a))); if (fx < 0) ctx.scale(1, -1); wShape(ctx, 'bat', 0); ctx.restore();
  }
  if (st === 'block') { ctx.fillStyle = skinC; ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.rect(hd.x - 4.5, hd.y - 4.5, 9, 9); ctx.fill(); ctx.stroke(); }
  else hand(hd, st === 'tung' ? skinC : body);
  if (sk.clothes === 'armor') { ctx.fillStyle = flash ? '#fff' : '#cbd5e1'; ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(P[CHEST].x, P[CHEST].y, 6, 0, 6.283); ctx.fill(); ctx.stroke(); }
  ctx.restore();
  if (f.celebrate && f.winAnim >= 4) cosDrawCele(ctx, f, t);
  if (tag && f.alive) {
    const x = P[HEAD].x, y = P[HEAD].y - 36;
    ctx.fillStyle = f.tcolor; ctx.beginPath(); ctx.moveTo(x - 6, y - 4); ctx.lineTo(x + 6, y - 4); ctx.lineTo(x, y + 4); ctx.fill();
    ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = OUT; ctx.strokeText(f.tag, x, y - 8); ctx.fillStyle = '#fff'; ctx.fillText(f.tag, x, y - 8);
    if (f.mine) { ctx.font = 'bold 11px sans-serif'; ctx.lineWidth = 3; ctx.strokeStyle = OUT; ctx.strokeText('VOCÊ', x, y - 24); ctx.fillStyle = '#fde047'; ctx.fillText('VOCÊ', x, y - 24); }
  }
}

// ---------- cena ----------
function drawItems(ctx, m, t) {
  for (const it of m.items) {
    const w = WEAPONS[it.id], cc = WEAPON_CAT_COLOR[w.cat] || '#fff';
    const blink = it.life < 4 && ((t * 8) | 0) & 1;
    if (blink) continue;
    const pulse = 0.5 + 0.5 * Math.sin(t * 5 + it.x);
    ctx.fillStyle = cc; ctx.globalAlpha = 0.18 + 0.12 * pulse; ctx.beginPath(); ctx.arc(it.x, it.y - 8, 26 + pulse * 5, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
    if (!it.grounded && it.vy > 200) { ctx.strokeStyle = cc; ctx.globalAlpha = 0.35; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(it.x, it.y - 120); ctx.lineTo(it.x, it.y - 10); ctx.stroke(); ctx.globalAlpha = 1; }
    ctx.save(); ctx.translate(it.x, it.y - 8 - (it.grounded ? Math.sin(t * 3 + it.x) * 2 : 0)); ctx.rotate(it.rot); ctx.scale(0.8, 0.8); ctx.translate(-((w.len || 30) * 0.3), 0); wShape(ctx, it.id, 0); ctx.restore();
    if (it.grounded) { ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = OUT; ctx.strokeText(w.name, it.x, it.y - 34); ctx.fillStyle = cc; ctx.fillText(w.name, it.x, it.y - 34); }
  }
}
function drawProjs(ctx, m, t) {
  for (const p of m.projs) {
    const a = Math.atan2(p.vy, p.vx);
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(a);
    switch (p.kind) {
      case 'bullet': ctx.fillStyle = '#fff3b0'; ctx.fillRect(-12, -1.5, 14, 3); ctx.fillStyle = '#fff'; ctx.fillRect(-2, -1.5, 4, 3); break;
      case 'arrow': ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(4, 0); ctx.stroke(); ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.moveTo(4, -4); ctx.lineTo(11, 0); ctx.lineTo(4, 4); ctx.fill(); ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(-27, -4); ctx.moveTo(-22, 0); ctx.lineTo(-27, 4); ctx.stroke(); break;
      case 'bolt': ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(6, 0); ctx.stroke(); ctx.fillStyle = '#e5e7eb'; ctx.beginPath(); ctx.moveTo(6, -5); ctx.lineTo(14, 0); ctx.lineTo(6, 5); ctx.fill(); break;
      case 'rocket': ctx.fillStyle = '#ef4444'; ctx.fillRect(-14, -4, 22, 8); ctx.fillStyle = '#e5e7eb'; ctx.beginPath(); ctx.moveTo(8, -4); ctx.lineTo(16, 0); ctx.lineTo(8, 4); ctx.fill(); ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.moveTo(-14, -3); ctx.lineTo(-24 - Math.random() * 6, 0); ctx.lineTo(-14, 3); ctx.fill(); break;
      case 'orb': ctx.fillStyle = 'rgba(167,139,250,0.35)'; ctx.beginPath(); ctx.arc(0, 0, 15, 0, 6.283); ctx.fill(); ctx.fillStyle = '#c4b5fd'; ctx.beginPath(); ctx.arc(0, 0, 9, 0, 6.283); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, 6.283); ctx.fill(); break;
      case 'boomerang': ctx.rotate(-a + p.rot); ctx.scale(1.3, 1.3); wShape(ctx, 'boomerang', 0); break;
      case 'shuriken': ctx.rotate(-a + t * 30); ctx.scale(0.85, 0.85); wShape(ctx, 'shuriken', 0); break;
      case 'fire': ctx.rotate(-a); ctx.fillStyle = 'rgba(255,90,20,0.4)'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, 6.283); ctx.fill(); ctx.fillStyle = '#ff7a1a'; ctx.beginPath(); ctx.arc(0, 0, 13, 0, 6.283); ctx.fill(); ctx.fillStyle = '#ffe08a'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, 6.283); ctx.fill(); break;
    }
    ctx.restore();
  }
  for (const b of m.bombs) {
    ctx.save(); ctx.translate(b.x, b.y - 8); ctx.rotate(b.rot); ctx.scale(1, 1); wShape(ctx, b.wid || 'grenade', 0); ctx.restore();
    if (b.fuse < 0.7 && ((t * 14) | 0) & 1) { ctx.fillStyle = 'rgba(255,60,60,0.6)'; ctx.beginPath(); ctx.arc(b.x, b.y - 8, 14, 0, 6.283); ctx.fill(); }
  }
  for (const mi of m.mines) {
    ctx.save(); ctx.translate(mi.x, mi.y); wShape(ctx, 'mine', 0); ctx.restore();
    ctx.fillStyle = mi.armed ? ((((t * 4) | 0) & 1) ? '#ff2d2d' : '#7f1d1d') : '#facc15'; ctx.beginPath(); ctx.arc(mi.x, mi.y - 8, 3, 0, 6.283); ctx.fill();
  }
}
function drawFX(ctx, m) {
  const fx = m.fx;
  for (const b of fx.beams) { const a = b.l / b.L; ctx.lineCap = 'round'; ctx.strokeStyle = b.c; ctx.globalAlpha = a * 0.5; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke(); ctx.globalAlpha = a; ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke(); ctx.globalAlpha = 1; }
  for (let i = 0; i < fx.max; i++) {
    const p = fx.pool[i]; if (p.l <= 0) continue;
    const a = clamp(p.l / p.L, 0, 1);
    ctx.globalAlpha = a; ctx.fillStyle = p.c; ctx.strokeStyle = p.c;
    if (p.k === 0) { ctx.lineWidth = p.s; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03); ctx.stroke(); }
    else if (p.k === 1) { ctx.beginPath(); ctx.arc(p.x, p.y, p.s * (1.6 - a * 0.6), 0, 6.283); ctx.fill(); }
    else { ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s); }
  }
  ctx.globalAlpha = 1;
  for (const r of fx.rings) { const a = r.l / r.L; ctx.globalAlpha = a; ctx.strokeStyle = r.c; ctx.lineWidth = r.w * a + 1; ctx.beginPath(); ctx.arc(r.x, r.y, r.R * (1 - a) + 6, 0, 6.283); ctx.stroke(); }
  ctx.globalAlpha = 1;
  ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeStyle = OUT;
  for (const t of fx.texts) { ctx.globalAlpha = Math.min(1, t.l * 2); ctx.strokeText(t.s, t.x, t.y); ctx.fillStyle = t.c; ctx.fillText(t.s, t.x, t.y); }
  ctx.globalAlpha = 1;
}
function drawScene(ctx, m, t, bg) {
  ctx.drawImage(bg, 0, 0, WORLD_W, WORLD_H);
  const d = decorDyn[m.arena.id]; if (d) d(ctx, t, m);
  drawPlatforms(ctx, m, t);
  drawItems(ctx, m, t);
  const showTag = m.cfg.mode !== 'menu' && m.cfg.mode !== 'preview' && m.cfg.mode !== 'awkprev' && m.cfg.mode !== 'fatality';
  for (const f of m.fighters) if (!f.alive) drawFighter(ctx, f, t, false);
  drawCineUnder(ctx, m);
  if (m.fatMode) drawFatUnder(ctx, m, t);
  for (const f of m.fighters) if (f.alive) drawAwkBack(ctx, f, t);
  for (const f of m.fighters) if (f.alive) {
    if (f.hidden) continue;
    if (f.fScale !== undefined && f.fScale < 0.999) { const fc = f.pts[CHEST]; ctx.save(); ctx.translate(fc.x, fc.y); ctx.scale(f.fScale, f.fScale); ctx.translate(-fc.x, -fc.y); drawFighter(ctx, f, t, showTag); ctx.restore(); }
    else drawFighter(ctx, f, t, showTag);
  }
  for (const f of m.fighters) if (f.alive && f.awk) drawAwkFront(ctx, f, t);
  drawProjs(ctx, m, t);
  for (const f of m.fighters) if (f.alive && f.aimOn && f.human) {
    const P = f.pts[CHEST], dx = f.facing * Math.cos(f.aimA), dy = Math.sin(f.aimA), x = P.x + dx * 95, y = P.y + dy * 95;
    ctx.globalAlpha = 0.85; ctx.strokeStyle = f.skin.color; ctx.lineWidth = 3; ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.moveTo(x - 15, y); ctx.lineTo(x - 5, y); ctx.moveTo(x + 5, y); ctx.lineTo(x + 15, y); ctx.moveTo(x, y - 15); ctx.lineTo(x, y - 5); ctx.moveTo(x, y + 5); ctx.lineTo(x, y + 15); ctx.stroke();
    ctx.beginPath(); ctx.arc(P.x + dx * 55, P.y + dy * 55, 2.5, 0, 6.283); ctx.arc(P.x + dx * 75, P.y + dy * 75, 2.5, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
  }
  drawFX(ctx, m);
  if (m.fatMode) drawFatOver(ctx, m, t);
  if (m.fx.flash > 0) { ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(0, 0, WORLD_W, WORLD_H); }
}

// ---------- HUD ----------
function hpColor(p) { return p > 0.5 ? '#4ade80' : p > 0.25 ? '#facc15' : '#ef4444'; }
function drawEnergyBar(ctx, f, x, y, w, h, flip, t) {
  const C = AWK_TYPES[f.awkType] || AWK_TYPES.void, p = clamp(f.energy / 100, 0, 1), full = p >= 1, pulse = 0.5 + 0.5 * Math.sin(t * 8);
  ctx.fillStyle = 'rgba(8,10,25,0.78)'; ctx.fillRect(x, y, w, h);
  const ww = (w - 4) * p, fxp = flip ? x + w - 2 - ww : x + 2;
  ctx.fillStyle = full ? C.c3 : C.c; ctx.globalAlpha = full ? 0.75 + 0.25 * pulse : 1; ctx.fillRect(fxp, y + 2, ww, h - 4);
  ctx.globalAlpha = 0.3; ctx.fillStyle = '#fff'; ctx.fillRect(fxp, y + 2, ww, (h - 4) / 2); ctx.globalAlpha = 1;
  if (p >= 0.8 && !full) { const sx = ((t * 160) % ww); ctx.globalAlpha = 0.5; ctx.fillStyle = '#fff'; ctx.fillRect(flip ? x + w - 2 - sx - 6 : x + 2 + sx, y + 2, 6, h - 4); ctx.globalAlpha = 1; }
  if (full) { ctx.globalAlpha = 0.35 + 0.4 * pulse; ctx.strokeStyle = C.c3; ctx.lineWidth = 6; ctx.strokeRect(x - 2, y - 2, w + 4, h + 4); ctx.globalAlpha = 1; }
  ctx.strokeStyle = full ? C.c3 : OUT; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, w, h);
  ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = OUT; ctx.fillStyle = '#fff';
  const txt = full ? 'AWAKENING PRONTO' : Math.floor(f.energy) + '%';
  ctx.strokeText(txt, x + w / 2, y + h - 2); ctx.fillText(txt, x + w / 2, y + h - 2);
}
function drawBar(ctx, x, y, w, h, p, col, flip) {
  ctx.fillStyle = 'rgba(8,10,25,0.75)'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = col; const ww = (w - 4) * clamp(p, 0, 1); ctx.fillRect(flip ? x + w - 2 - ww : x + 2, y + 2, ww, h - 4);
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(flip ? x + w - 2 - ww : x + 2, y + 2, ww, (h - 4) / 2);
  ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, w, h);
}
function weaponLine(f) {
  if (!f.wp) return 'Punhos';
  const w = WEAPONS[f.wp.id];
  if (w.type === 'melee') return w.name;
  return w.name + '  ×' + f.wp.ammo;
}
function drawHUD(ctx, m, t) {
  if (m.cfg.mode === 'menu' || m.cfg.mode === 'preview' || m.cfg.mode === 'awkprev' || m.cfg.mode === 'fatality') return;
  const F = m.fighters, stock = m.cfg.format === 'stock', aon = !!(m.cfg.awk && m.cfg.awk.on) && F.length === 2, eo = aon ? 18 : 0;
  ctx.textBaseline = 'alphabetic';
  const label = (txt, x, y, al, size, col) => { ctx.font = `bold ${size}px sans-serif`; ctx.textAlign = al; ctx.lineWidth = 4; ctx.strokeStyle = OUT; ctx.strokeText(txt, x, y); ctx.fillStyle = col || '#fff'; ctx.fillText(txt, x, y); };
  const iconLabel = (ic, txt, x, y, al, size, col) => {
    ctx.font = `bold ${size}px sans-serif`; const tw = ctx.measureText(txt).width, s = size * 1.05;
    if (al === 'right') { label(txt, x, y, 'right', size, col); drawIcon(ctx, ic, x - tw - s - 5, y - s * 0.86, s, col); }
    else { drawIcon(ctx, ic, x, y - s * 0.86, s, col); label(txt, x + s + 5, y, 'left', size, col); }
  };
  const pips = (f, x, y, flip) => {
    if (!stock) return;
    for (let i = 0; i < (m.cfg.lives || 3); i++) { const px = flip ? x - i * 20 : x + i * 20; ctx.fillStyle = i < f.lives ? f.tcolor : 'rgba(255,255,255,0.18)'; ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, y, 7, 0, 6.283); ctx.fill(); ctx.stroke(); }
  };
  if (F.length === 2) {
    for (let i = 0; i < 2; i++) {
      const f = F[i], flip = i === 1, x = flip ? WORLD_W - 30 - 440 : 30, w = 440;
      label(f.name, flip ? x + w : x, 32, flip ? 'right' : 'left', 24, f.tcolor);
      drawBar(ctx, x, 40, w, 26, f.hp / f.maxhp, hpColor(f.hp / f.maxhp), flip);
      if (f.maxhp !== 100) label(Math.ceil(Math.max(0, f.hp)) + ' / ' + f.maxhp, flip ? x + w - 10 : x + 10, 60, flip ? 'right' : 'left', 15, '#fff');
      if (aon) drawEnergyBar(ctx, f, x, 71, w, 13, flip, t);
      label(weaponLine(f), flip ? x + w : x, 92 + eo, flip ? 'right' : 'left', 20, '#e2e8f0');
      pips(f, flip ? x + w - 7 : x + 7, 112 + eo, flip);
      if (f.specialCd > 0) iconLabel('bolt', f.specialCd.toFixed(1) + 's', flip ? x + w : x, (stock ? 142 : 120) + eo, flip ? 'right' : 'left', 16, '#94a3b8');
    }
    const lim = m.cfg.timeLimit > 0, tv = lim ? Math.max(0, m.cfg.timeLimit - m.t) : m.t;
    const tm = (lim ? Math.ceil(tv) : Math.floor(tv)), low10 = lim && tv <= 10;
    label(Math.floor(tm / 60) + ':' + String(tm % 60).padStart(2, '0'), WORLD_W / 2, 90, 'center', low10 ? 30 : 24, low10 ? (((t * 3) | 0) & 1 ? '#fca5a5' : '#ef4444') : '#cbd5e1');
    if (m.cfg.rounds) {
      const sc = m.cfg.score || [0, 0], rd = m.cfg.round || 1;
      label(sc[0] + '  :  ' + sc[1], WORLD_W / 2, 126, 'center', 30, '#fde68a');
      label('ROUND ' + rd + (m.cfg.rounds.target ? '  ·  1º A ' + m.cfg.rounds.target : ''), WORLD_W / 2, 148, 'center', 14, '#a5b4fc');
    }
  } else {
    const w = 268, g2 = 14;
    F.forEach((f, i) => {
      const x = i < 2 ? 20 + i * (w + g2) : WORLD_W - 20 - w - (3 - i) * (w + g2), y = 14;
      ctx.fillStyle = f.tcolor; ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x + 10, y + 12, 9, 0, 6.283); ctx.fill(); ctx.stroke();
      label(f.name, x + 26, y + 20, 'left', 21, f.out ? '#64748b' : '#fff');
      iconLabel('skull', String(f.kills), x + w, y + 20, 'right', 21, '#fca5a5');
      drawBar(ctx, x, y + 28, w, 20, f.out ? 0 : f.hp / f.maxhp, hpColor(f.hp / f.maxhp), false);
      if (stock) pips(f, x + 8, y + 66, false);
      label(f.out ? 'ELIMINADO' : weaponLine(f), x, stock ? y + 98 : y + 74, 'left', 17, f.out ? '#ef4444' : '#e2e8f0');
    });
  }
  // contagem regressiva
  if (m.state === 'countdown') {
    const n = Math.ceil(m.cdT), fr = 1 - (m.cdT - Math.floor(m.cdT)), s = 1 + (1 - fr) * 0.6;
    ctx.save(); ctx.translate(WORLD_W / 2, 320); ctx.scale(s, s); ctx.globalAlpha = clamp(fr * 3, 0, 1) * 0.9 + 0.1;
    label(n > 0 ? String(n) : 'LUTE!', 0, 40, 'center', 130, '#fde047'); ctx.restore(); ctx.globalAlpha = 1;
  } else if (m.goT > 0) {
    ctx.save(); ctx.globalAlpha = clamp(m.goT * 2, 0, 1); label('LUTE!', WORLD_W / 2, 320, 'center', 110, '#4ade80'); ctx.restore();
  }
  // feed
  let fy = F.length === 2 ? 170 : 150;
  for (const k of m.killFeed) { if (m.time - k.t > 4) continue; ctx.globalAlpha = clamp(4 - (m.time - k.t), 0, 1); label(k.v.name, WORLD_W - 24, fy, 'right', 18, '#fff'); ctx.font = 'bold 18px sans-serif'; let kx = WORLD_W - 24 - ctx.measureText(k.v.name).width - 24;
    drawIcon(ctx, 'arrow', kx, fy - 17, 20, '#fbbf24'); label(k.k ? k.k.name : '—', kx - 6, fy, 'right', 18, '#fff'); fy += 24; }
  ctx.globalAlpha = 1;
  if (m.ended) {
    const w = m.result && m.result.winner;
    label(w ? (w.name + ' VENCE!') : 'EMPATE!', WORLD_W / 2, 330, 'center', 80, w ? w.tcolor : '#fff');
    if (m.timeUp) label('TEMPO ESGOTADO', WORLD_W / 2, 372, 'center', 28, '#e2e8f0');
  }
}

// ---------- tela completa (com letterbox) ----------
function renderFrame(ctx, cw, ch, m, t, view) {
  const bg = ensureBg(m.arena, view.pxScale);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = m.arena.theme.a; ctx.fillRect(0, 0, cw, ch);
  const s = view.scale, ox = view.ox, oy = view.oy;
  ctx.setTransform(s * view.q, 0, 0, s * view.q, ox * view.q, oy * view.q);
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, WORLD_W, WORLD_H); ctx.clip();
  const sh = m.fx.shake;
  if (sh > 0.2 && m.fx.shakeOn) ctx.translate(rnd(-sh, sh), rnd(-sh, sh));
  const cn = m.cine, cz = cn.zoom;
  if (cn.rot) { ctx.translate(WORLD_W / 2, WORLD_H / 2); ctx.rotate(cn.rot); ctx.translate(-WORLD_W / 2, -WORLD_H / 2); }
  if (cz > 1.003) { const vw = WORLD_W / cz, vh = WORLD_H / cz; ctx.scale(cz, cz); ctx.translate(-clamp(cn.cx - vw / 2, 0, WORLD_W - vw), -clamp(cn.cy - vh / 2, 0, WORLD_H - vh)); }
  drawScene(ctx, m, t, bg);
  drawCineOver(ctx, m);
  distortPass(ctx, m, t);
  ctx.restore();
  drawHUD(ctx, m, t);
  if (m.fatMode) drawFatHUD(ctx, m, t);
  // bordas escurecidas fora da arena
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
function drawArenaPreview(cv, arena) {
  const c = cv.getContext('2d'), s = cv.width / WORLD_W;
  const bg = ensureBg(arena, s);
  c.clearRect(0, 0, cv.width, cv.height); c.drawImage(bg, 0, 0, cv.width, cv.height);
  c.save(); c.scale(s, s);
  const th = arena.theme;
  for (const p of arena.plats) { c.fillStyle = p.ice ? '#bfe9fb' : th.plat; c.fillRect(p.x, p.y, p.w, p.h); c.fillStyle = p.ice ? '#fff' : th.top; c.fillRect(p.x, p.y, p.w, 6); c.strokeStyle = OUT; c.lineWidth = 3; c.strokeRect(p.x, p.y, p.w, p.h); }
  if (arena.lavaY) { c.fillStyle = '#ff6a1a'; c.fillRect(0, arena.lavaY, WORLD_W, 40); }
  c.restore();
}

/* STICK MAYHEM v1.3.0 — render de cosméticos novos: capas, asas, jetpack, chapéus, máscaras, decorações de skin, efeitos e vitória */
const COS_TAU = 6.283;
function cosDrawCape(ctx, f, t, acc) {
  const sk = f.skin, d = CAPES[sk.cape]; if (!d) return;
  const cn = f.capeN, N = d.n, HW = d.hw, kind = sk.cape;
  const col = kind === 'royal' ? '#b91c1c' : kind === 'cosmic' ? '#1e1b4b' : kind === 'tattered' ? shade(acc, -0.4) : shade(acc, -0.25);
  ctx.fillStyle = f.flash > 0 ? '#fff' : col; ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.beginPath();
  let mx = 0, my = 0;
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < N; i++) {
      const k = pass ? N - 1 - i : i, a = cn[Math.max(0, k - 1)], b = cn[Math.min(N - 1, k + 1)];
      let tx = b.x - a.x, ty = b.y - a.y; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const sg = pass ? 1 : -1;
      let w = HW[k] + (k === N - 1 ? Math.sin(t * 8 + (pass ? 1 : 0)) * 0.8 : 0);
      if (kind === 'tattered' && k >= N - 3) w *= (((k + pass) & 1) ? 0.55 : 1.05);
      const px = cn[k].x - ty * w * sg, py = cn[k].y + tx * w * sg;
      if (!pass && i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      if (kind === 'tattered' && pass === 0 && k === N - 1) { ctx.lineTo(cn[k].x + tx * 6, cn[k].y + ty * 6); }
    }
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  if (f.flash > 0) return;
  if (kind === 'royal') { // barra dourada e debrum
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3; ctx.lineCap = 'butt';
    const a = cn[N - 1], b = cn[N - 2]; let tx = a.x - b.x, ty = a.y - b.y; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    const w = HW[N - 1] - 1.5; ctx.beginPath(); ctx.moveTo(a.x + ty * w, a.y - tx * w); ctx.lineTo(a.x - ty * w, a.y + tx * w); ctx.stroke();
    ctx.fillStyle = '#fbbf24'; for (let i = 2; i < N; i += 2) { ctx.beginPath(); ctx.arc(cn[i].x, cn[i].y, 1.7, 0, COS_TAU); ctx.fill(); }
  } else if (kind === 'cosmic') {
    ctx.fillStyle = '#e9d5ff'; for (let i = 1; i < N; i++) { const tw = 0.5 + 0.5 * Math.sin(t * 4 + i * 2.1); ctx.globalAlpha = 0.5 + 0.5 * tw; ctx.beginPath(); ctx.arc(cn[i].x + ((i & 1) ? 2.5 : -2.5), cn[i].y, 1.2 + tw * 0.8, 0, COS_TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  } else if (kind === 'classic' || kind === 'long' || kind === 'short') {
    ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cn[0].x, cn[0].y); for (let i = 1; i < N; i++) ctx.lineTo(cn[i].x, cn[i].y); ctx.stroke();
  }
}
function cosDrawBack(ctx, f, t, acc) {
  const sk = f.skin, P = f.pts, fx = f.facing;
  if (sk.acc === 'wingsA' || sk.acc === 'wingsD') {
    const A = sk.acc === 'wingsA', fl = Math.sin(t * (f.grounded ? 3 : 8)) * 0.16 + (f.grounded ? 0 : 0.3);
    ctx.save(); ctx.translate(P[CHEST].x - fx * 3, P[CHEST].y + 3); ctx.scale(-fx, 1);
    const fe = [[-1.25, 30], [-0.95, 36], [-0.62, 38], [-0.3, 34], [0.0, 28]];
    for (let layer = 0; layer < 2; layer++) {
      ctx.save(); ctx.rotate(layer ? fl * 0.6 : fl); if (layer) ctx.scale(0.8, 0.8);
      for (const [a, l] of fe) {
        ctx.save(); ctx.rotate(a); ctx.beginPath();
        if (A) { ctx.moveTo(0, 0); ctx.quadraticCurveTo(l * 0.5, -7, l, 0); ctx.quadraticCurveTo(l * 0.5, 6, 0, 0); ctx.fillStyle = layer ? '#e2e8f0' : '#ffffff'; }
        else { ctx.moveTo(0, 0); ctx.lineTo(l * 0.55, -6); ctx.lineTo(l, 0); ctx.lineTo(l * 0.5, 3); ctx.closePath(); ctx.fillStyle = layer ? '#2a1646' : '#3b1d6b'; }
        ctx.fill(); ctx.strokeStyle = A ? 'rgba(250,204,21,.9)' : '#a855f7'; ctx.lineWidth = 1.8; ctx.stroke(); ctx.restore();
      }
      ctx.restore();
    }
    ctx.restore();
    if (A && !GFX.low) { const g = ctx.createRadialGradient(P[CHEST].x - fx * 14, P[CHEST].y - 8, 4, P[CHEST].x - fx * 14, P[CHEST].y - 8, 46); g.addColorStop(0, 'rgba(254,240,138,.28)'); g.addColorStop(1, 'rgba(254,240,138,0)'); ctx.fillStyle = g; ctx.fillRect(P[CHEST].x - fx * 14 - 50, P[CHEST].y - 58, 100, 100); }
  } else if (sk.acc === 'jetpack') {
    ctx.save(); const mx = (P[CHEST].x + P[HIP].x) / 2 - fx * 8, my = (P[CHEST].y + P[HIP].y) / 2 - 2;
    ctx.translate(mx, my); ctx.rotate(Math.atan2(P[CHEST].x - P[HIP].x, P[HIP].y - P[CHEST].y));
    const fire = !f.grounded && f.alive;
    for (const ox of [-4.5, 4.5]) {
      if (fire) { ctx.fillStyle = 'rgba(255,170,40,.9)'; ctx.beginPath(); ctx.moveTo(ox - 3, 13); ctx.lineTo(ox, 21 + Math.random() * 9); ctx.lineTo(ox + 3, 13); ctx.fill(); ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.moveTo(ox - 1.5, 13); ctx.lineTo(ox, 17 + Math.random() * 4); ctx.lineTo(ox + 1.5, 13); ctx.fill(); }
      ctx.fillStyle = '#94a3b8'; ctx.strokeStyle = OUT; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.rect(ox - 3.6, -13, 7.2, 26); ctx.fill(); ctx.stroke();
      ctx.fillStyle = acc; ctx.fillRect(ox - 3.6, -3, 7.2, 4);
    }
    ctx.restore();
  }
}
// camada "por baixo" do corpo (neon / glitch): contornos deslocados
function cosDrawUnder(ctx, f, t, acc) {
  const d = f.skin.deco; if (d !== 'neonoutline' && d !== 'glitch') return;
  const P = f.pts, ch = [[HIP, CHEST], [HIP, KNL, FTL], [HIP, KNR, FTR], [CHEST, ELL, HDL], [CHEST, ELR, HDR]];
  const stroke = (col, ox, oy, w, al) => {
    ctx.globalAlpha *= al; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const c of ch) { ctx.beginPath(); ctx.moveTo(P[c[0]].x + ox, P[c[0]].y + oy); for (let i = 1; i < c.length; i++) ctx.lineTo(P[c[i]].x + ox, P[c[i]].y + oy); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(P[HEAD].x + ox, P[HEAD].y + oy, 11 + w * 0.3, 0, COS_TAU); ctx.stroke();
    ctx.globalAlpha /= al;
  };
  if (d === 'neonoutline') { stroke(acc, 0, 0, 20, 0.28); stroke(acc, 0, 0, 15, 0.9); }
  else { const j = ((t * 14) | 0) % 5 === 0 ? 5 : 3; stroke('#22d3ee', -j, 0, 12, 0.6); stroke('#f43f5e', j, 1, 12, 0.6); }
}
function cosTorso(ctx, f, fn) {
  const P = f.pts, fx = f.facing; ctx.save();
  ctx.translate((P[HIP].x + P[CHEST].x) / 2, (P[HIP].y + P[CHEST].y) / 2);
  ctx.rotate(Math.atan2(P[CHEST].x - P[HIP].x, -(P[CHEST].y - P[HIP].y))); ctx.scale(fx, 1); fn(); ctx.restore();
}
// decorações do corpo (depois do tronco e roupas)
function cosDrawDeco(ctx, f, t, acc, body) {
  const d = f.skin.deco; if (!d || f.flash > 0) return;
  const P = f.pts, fx = f.facing;
  const seg = (a, b, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); };
  const mid = (a, b, k) => ({x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k});
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  switch (d) {
    case 'ninja': cosTorso(ctx, f, () => { ctx.fillStyle = acc; ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.fillRect(-7, 8, 14, 4); ctx.strokeRect(-7, 8, 14, 4); ctx.beginPath(); ctx.moveTo(-6, 11); ctx.lineTo(-15 - Math.abs(f.vx) * 0.03, 16 + Math.sin(t * 7) * 2); ctx.lineTo(-9, 13); ctx.closePath(); ctx.fill(); ctx.stroke(); }); break;
    case 'circuit': {
      ctx.strokeStyle = acc; ctx.lineWidth = 1.6; ctx.globalAlpha *= 0.55 + 0.45 * Math.sin(t * 5) * Math.sin(t * 5);
      cosTorso(ctx, f, () => { ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(0, -4); ctx.lineTo(5, 0); ctx.lineTo(5, 8); ctx.moveTo(0, -4); ctx.lineTo(-5, 1); ctx.lineTo(-5, 10); ctx.stroke(); ctx.fillStyle = acc; for (const [x, y] of [[0, -12], [5, 8], [-5, 10]]) { ctx.beginPath(); ctx.arc(x, y, 1.8, 0, COS_TAU); ctx.fill(); } });
      for (const c of [[HIP, KNL], [HIP, KNR], [CHEST, ELL], [CHEST, ELR]]) seg(mid(P[c[0]], P[c[1]], 0.25), mid(P[c[0]], P[c[1]], 0.8), 1.8, acc);
      ctx.globalAlpha = f.invuln > 0 && f.invuln < 90 && ((t * 12) | 0) & 1 ? 0.45 : (f.awk && f.awk.ph === 'blink' ? 0.3 : 1); break;
    }
    case 'flameveins': {
      const pu = 0.65 + 0.35 * Math.sin(t * 6);
      ctx.strokeStyle = '#fdba74'; ctx.lineWidth = 2; ctx.globalAlpha *= pu;
      cosTorso(ctx, f, () => { ctx.beginPath(); ctx.moveTo(-3, -12); ctx.lineTo(1, -6); ctx.lineTo(-2, 0); ctx.lineTo(3, 6); ctx.lineTo(0, 12); ctx.stroke(); });
      for (const c of [[HIP, KNL, FTL], [HIP, KNR, FTR], [CHEST, ELL, HDL], [CHEST, ELR, HDR]]) { const a = mid(P[c[0]], P[c[1]], 0.2), b = mid(P[c[0]], P[c[1]], 0.85), m = {x: (a.x + b.x) / 2 + 2, y: (a.y + b.y) / 2}; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(m.x, m.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      ctx.globalAlpha = f.invuln > 0 && f.invuln < 90 && ((t * 12) | 0) & 1 ? 0.45 : (f.awk && f.awk.ph === 'blink' ? 0.3 : 1); break;
    }
    case 'icespikes':
      ctx.fillStyle = '#e0f2fe'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.8;
      for (const [o, ang] of [[0, -0.3], [-1, -0.9], [1, 0.4]]) { const cx = P[CHEST].x + o * 6 - fx * 2, cy = P[CHEST].y - 3; ctx.beginPath(); ctx.moveTo(cx - 3, cy); ctx.lineTo(cx + Math.sin(ang) * 14, cy - 14 + o * 2); ctx.lineTo(cx + 3, cy); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      for (const k of [HDL, HDR]) { ctx.beginPath(); ctx.moveTo(P[k].x - 3, P[k].y - 3); ctx.lineTo(P[k].x, P[k].y - 11); ctx.lineTo(P[k].x + 3, P[k].y - 3); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      break;
    case 'champion':
      cosTorso(ctx, f, () => { ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.fillRect(-8, 6, 16, 5); ctx.strokeRect(-8, 6, 16, 5); ctx.fillStyle = '#fff7ad'; ctx.beginPath(); ctx.arc(0, 8.5, 4, 0, COS_TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(0, 8.5, 1.6, 0, COS_TAU); ctx.fill(); });
      for (const k of [HDL, HDR]) { ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(k === HDL ? P[HDL].x : P[HDR].x, k === HDL ? P[HDL].y : P[HDR].y, 5.6, 0.2, 2.9); ctx.fill(); }
      break;
    case 'voidrift':
      cosTorso(ctx, f, () => { ctx.fillStyle = '#05010d'; ctx.strokeStyle = acc; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(1, -3, 3.4, 11, 0.12, 0, COS_TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#f5d0fe'; for (let i = 0; i < 3; i++) { const a = t * 2 + i * 2.1; ctx.fillRect(1 + Math.sin(a) * 1.4 - 0.7, -3 + Math.cos(a * 0.8) * 7, 1.5, 1.5); } });
      break;
    case 'wraps':
      ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 4;
      for (const c of [[ELL, HDL], [ELR, HDR]]) { const a = mid(P[c[0]], P[c[1]], 0.35), b = mid(P[c[0]], P[c[1]], 0.95); seg(a, b, 6.5, '#fff'); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.3; for (let k = 0; k < 4; k++) { const p = mid(a, b, k / 3); ctx.beginPath(); ctx.moveTo(p.x - 3.5, p.y - 2); ctx.lineTo(p.x + 3.5, p.y + 2); ctx.stroke(); } }
      break;
    case 'badge':
      cosTorso(ctx, f, () => { ctx.fillStyle = acc; ctx.strokeStyle = OUT; ctx.lineWidth = 1.6; ctx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 2.4 : 6, a = -1.57 + i * 0.628; ctx.lineTo(3 + Math.cos(a) * r, -6 + Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.stroke(); });
      break;
    case 'thunderbolt':
      cosTorso(ctx, f, () => { ctx.fillStyle = acc; ctx.strokeStyle = OUT; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(2, -13); ctx.lineTo(-4, -2); ctx.lineTo(0, -2); ctx.lineTo(-3, 9); ctx.lineTo(5, -4); ctx.lineTo(1, -4); ctx.closePath(); ctx.fill(); ctx.stroke(); });
      if ((((t * 10) | 0) & 3) === 0) { ctx.strokeStyle = acc; ctx.lineWidth = 1.5; for (const k of [HDL, HDR]) { ctx.beginPath(); ctx.moveTo(P[k].x, P[k].y); ctx.lineTo(P[k].x + Math.sin(t * 70) * 9, P[k].y - 8); ctx.lineTo(P[k].x + Math.cos(t * 60) * 6, P[k].y - 15); ctx.stroke(); } }
      break;
    case 'glitch':
      ctx.fillStyle = '#22d3ee'; for (let i = 0; i < 3; i++) { const s = ((t * 9 + i * 7) | 0), y = P[CHEST].y + ((s * 37 + i * 11) % 36) - 6; if (s % 3) ctx.fillRect(P[HIP].x - 10 + ((s * 13) % 8), y, 16 + (s % 5) * 2, 2.2); }
      break;
    case 'mayhemM':
      cosTorso(ctx, f, () => { ctx.fillStyle = '#fde047'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-6, 6); ctx.lineTo(-6, -9); ctx.lineTo(0, -1); ctx.lineTo(6, -9); ctx.lineTo(6, 6); ctx.lineTo(3, 6); ctx.lineTo(3, -2); ctx.lineTo(0, 3); ctx.lineTo(-3, -2); ctx.lineTo(-3, 6); ctx.closePath(); ctx.fill(); ctx.stroke(); });
      break;
  }
}
// chapéus e máscaras novos (espaço da cabeça: +x = frente)
function cosDrawHat(ctx, sk, acc, t, f) {
  const body = sk.color;
  switch (sk.hat) {
    case 'halo': { const y = -21 + Math.sin(t * 3) * 1.4; ctx.strokeStyle = 'rgba(253,224,71,.35)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(0, y, 10, 3.4, 0, 0, COS_TAU); ctx.stroke(); ctx.strokeStyle = '#fde047'; ctx.lineWidth = 3; ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke(); break; }
    case 'hood': ctx.fillStyle = shade(body, -0.1); ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(-1, 0, 13, -1.05, 1.15, true); ctx.quadraticCurveTo(6, 6, 9, -3); ctx.quadraticCurveTo(10, -8, 8.5, -10.5); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-8, -10); ctx.lineTo(-15, -21); ctx.lineTo(-1, -12.5); ctx.closePath(); ctx.fill(); ctx.stroke(); break;
    case 'crest': ctx.fillStyle = acc; ctx.strokeStyle = OUT; ctx.lineWidth = 2; for (let i = 0; i < 5; i++) { const x = -9 + i * 4.6, h = 10 + Math.sin(i * 1.7 + t * 6) * 2 + (i === 2 ? 5 : 0); ctx.beginPath(); ctx.moveTo(x - 3, -7); ctx.lineTo(x + 0.5, -7 - h); ctx.lineTo(x + 3.5, -7); ctx.closePath(); ctx.fill(); ctx.stroke(); } break;
    case 'kabuto': ctx.fillStyle = shade(acc, -0.5); ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, -1, 12.6, Math.PI, 0); ctx.lineTo(14, 4); ctx.lineTo(-14, 4); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.moveTo(0, -12); ctx.quadraticCurveTo(-13, -14, -15, -26); ctx.quadraticCurveTo(-6, -17, 0, -13); ctx.quadraticCurveTo(6, -17, 15, -26); ctx.quadraticCurveTo(13, -14, 0, -12); ctx.fill(); ctx.stroke(); break;
    case 'spacehelm': ctx.fillStyle = 'rgba(186,230,253,.26)'; ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, 15.2, 0, COS_TAU); ctx.fill(); ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 11.5, -2.5, -1.4); ctx.stroke(); ctx.fillStyle = '#94a3b8'; ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.fillRect(-9, 11, 18, 5); ctx.strokeRect(-9, 11, 18, 5); break;
  }
}
function cosDrawMask(ctx, sk, acc, t, flash) {
  if (sk.mask === 'skull') {
    ctx.fillStyle = flash ? '#fff' : '#e5e7eb'; ctx.strokeStyle = OUT; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, 11.4, 0, COS_TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(5, -2, 3.2, 3.8, 0, 0, COS_TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-3, -2, 3.2, 3.8, 0, 0, COS_TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(1, 2); ctx.lineTo(0, 5); ctx.lineTo(2.2, 5); ctx.fill(); ctx.strokeStyle = '#111'; ctx.lineWidth = 1.4; ctx.beginPath(); for (let x = -6; x <= 8; x += 3.5) { ctx.moveTo(x, 6.5); ctx.lineTo(x, 10); } ctx.stroke();
  } else if (sk.mask === 'glitch') {
    const s = (t * 10) | 0; ctx.fillStyle = '#0b0b12'; ctx.fillRect(-1, -8, 13, 9); ctx.fillStyle = '#22d3ee'; ctx.fillRect(3 + (s % 3), -6, 7, 2); ctx.fillStyle = '#f43f5e'; ctx.fillRect(2 - (s % 2) * 2, -3, 7, 2); ctx.fillStyle = '#fff'; ctx.fillRect(5, -5, 2, 2);
    if (s % 4 === 0) { ctx.fillStyle = '#22d3ee'; ctx.fillRect(-11, 4, 22, 2); }
  }
}
// partículas que seguem o personagem (limitadas, só se qualidade permite)
function cosFollowFx(f, t) {
  const fxn = f.skin.fx; if (GFX.low || !fxn || f.hidden) return;
  const P = f.pts, m = f.m; if (!m || !m.fx || Math.random() > 0.22) return;
  const x = P[CHEST].x + rnd(-8, 8), y = P[HIP].y + rnd(-30, 14);
  if (fxn === 'embers') m.fx.add(x, y, rnd(-15, 15), -rnd(30, 70), 0.9, 3.2, Math.random() < 0.5 ? '#fb923c' : '#fde68a', 0, 0);
  else if (fxn === 'frost') m.fx.add(x, y + 10, rnd(-10, 10), rnd(10, 40), 0.9, 3, Math.random() < 0.5 ? '#e0f2fe' : '#7dd3fc', 0, 0);
  else if (fxn === 'stars') m.fx.add(x, y, rnd(-25, 25), rnd(-25, 25), 0.8, 3.4, Math.random() < 0.5 ? '#fde047' : '#f0abfc', 0, 0);
  else if (fxn === 'void') m.fx.add(x, y, rnd(-12, 12), rnd(-20, 5), 1.0, 5, Math.random() < 0.5 ? '#6d28d9' : '#1e0b3a', 0, 0);
  else if (fxn === 'electric') m.fx.add(x, y, rnd(-70, 70), rnd(-70, 70), 0.14, 2.4, Math.random() < 0.5 ? '#fde047' : '#93c5fd', 0, 0);
}
// efeitos de vitória (desenhados à frente do personagem)
function cosDrawCele(ctx, f, t0) {
  const t = f.celeT;
  const wa = f.winAnim, P = f.pts, hx = P[CHEST].x, hy = P[CHEST].y;
  const m = f.m, rate = GFX.low ? 0.06 : 0.16;
  switch (wa) {
    case 4: if (m && Math.random() < rate) m.fx.add(hx + rnd(-40, 40), hy - 90, rnd(-30, 30), rnd(30, 90), 1.6, 4, Math.random() < 0.5 ? '#fbbf24' : '#fff7ad', 0, 0); break;
    case 5: if (m && Math.random() < rate) m.fx.add(hx + rnd(-16, 16), P[HIP].y + 24, rnd(-18, 18), -rnd(10, 40), 1.1, 6, Math.random() < 0.5 ? '#3b1d6b' : '#a78bfa', 0, 0);
      ctx.globalAlpha = 0.25; ctx.fillStyle = '#a78bfa'; ctx.beginPath(); ctx.ellipse(P[HIP].x, P[HIP].y + 40, 34, 7, 0, 0, COS_TAU); ctx.fill(); ctx.globalAlpha = 1; break;
    case 6: { const ph = (t * 0.9) % 1.6; if (ph < 0.2) { const x = P[HDR].x + Math.sin(t * 50) * 4; ctx.strokeStyle = 'rgba(147,197,253,.55)'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x, -20); ctx.lineTo(x + 8, 120); ctx.lineTo(x - 6, 220); ctx.lineTo(x + 2, P[HDR].y - 4); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,' + (0.18 - ph) + ')'; ctx.fillRect(0, 0, 1280, 720); } break; }
    case 7: for (let i = 0; i < 4; i++) { const a = t * 1.8 + i * 1.57; ctx.fillStyle = i & 1 ? '#fde047' : '#c4b5fd'; ctx.beginPath(); ctx.arc(P[HIP].x + Math.cos(a) * 32, P[HIP].y + Math.sin(a) * 9 - 6, 3.6, 0, COS_TAU); ctx.fill(); }
      ctx.globalAlpha = 0.2; ctx.fillStyle = '#c4b5fd'; ctx.beginPath(); ctx.ellipse(P[HIP].x, f.y + 2, 24 - Math.sin(t * 2.4) * 3, 5, 0, 0, COS_TAU); ctx.fill(); ctx.globalAlpha = 1; break;
    case 8: { const hd = P[HDR], wid = f.wp ? f.wp.id : 'sword'; ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(hd.x, hd.y, 30, f.wAng - 1.6, f.wAng); ctx.stroke();
      ctx.save(); ctx.translate(hd.x, hd.y); ctx.rotate(f.wAng); wShape(ctx, WEAPONS[wid] && WEAPONS[wid].type === 'melee' ? wid : 'sword', 0); ctx.restore(); break; }
    case 9: { const ph = (t % 2.2); if (ph < 0.9) { const k = ph / 0.9; ctx.strokeStyle = 'rgba(103,232,249,' + (1 - k) + ')'; ctx.lineWidth = 7 * (1 - k) + 1; ctx.beginPath(); ctx.arc(P[CHEST].x, P[CHEST].y, 20 + k * 130, 0, COS_TAU); ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,' + (1 - k) + ')'; ctx.lineWidth = 2; ctx.stroke(); }
      if (ph < 0.12 && m) m.fx.burst && m.fx.burst(P[CHEST].x, P[CHEST].y, 8, 220, 0.6, 4, '#67e8f9', 0, 0); break; }
    case 10: if (m && Math.random() < rate) m.fx.add(hx + rnd(-26, 26), hy + rnd(-30, 20), rnd(-8, 8), -rnd(10, 30), 1.0, 3, '#fde68a', 0, 0);
      ctx.globalAlpha = 0.18 + 0.08 * Math.sin(t * 3); ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(P[HIP].x, P[HIP].y - 20, 54, 0, COS_TAU); ctx.fill(); ctx.globalAlpha = 1; break;
    case 11: if (m && Math.random() < rate * 1.5) m.fx.add(hx + rnd(-40, 40), hy - 80, rnd(-40, 40), rnd(20, 90), 1.5, 4, 'hsl(' + ((t * 200 + Math.random() * 120) % 360 | 0) + ',90%,60%)', 0, 0);
      ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeStyle = OUT; ctx.fillStyle = '#fde047'; ctx.strokeText('M', P[HEAD].x, P[HEAD].y - 36 - Math.abs(Math.sin(t * 7)) * 6); ctx.fillText('M', P[HEAD].x, P[HEAD].y - 36 - Math.abs(Math.sin(t * 7)) * 6); break;
  }
}

'use strict';
/* STICK MAYHEM v1.1.0 — render dos efeitos de AWAKENING (auras, trilhas, ondas, pilar de luz, distorção, zoom) */

function drawAwkBack(ctx, f, t) {
  const a = f.awk, A = f.m.cfg.awk;
  const P = f.pts, x = f.x, y = f.y - 52, low = GFX.low;
  // brilho "pronto" (barra cheia) quando fora da sequência
  if (!a) {
    if (A && A.on && f.energy >= 100 && f.alive && !f.ragdoll) {
      const C = AWK_TYPES[f.awkType] || AWK_TYPES.void, p = 0.55 + 0.45 * Math.sin(t * 6);
      ctx.save(); ctx.globalAlpha = 0.5 * p; ctx.strokeStyle = C.c; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(f.x, f.y + 2, 34 + 4 * p, 8 + p, 0, 0, 6.283); ctx.stroke();
      ctx.globalAlpha = 0.18 * p; ctx.fillStyle = C.c; ctx.beginPath(); ctx.ellipse(f.x, f.y + 2, 30, 7, 0, 0, 6.283); ctx.fill(); ctx.restore();
    }
    return;
  }
  const k = a.aura; if (k <= 0.01) return;
  ctx.save();
  if (AWK2R[a.type]) { AWK2R[a.type].back(ctx, f, t, k); ctx.restore(); return; }
  if (a.type === 'void') {
    const R = 66 + 56 * k;
    ctx.globalAlpha = 0.92 * k;
    if (!low) { const g = ctx.createRadialGradient(x, y, 6, x, y, R); g.addColorStop(0, 'rgba(8,0,22,0.96)'); g.addColorStop(0.62, 'rgba(46,12,96,0.62)'); g.addColorStop(1, 'rgba(124,58,237,0)'); ctx.fillStyle = g; }
    else ctx.fillStyle = 'rgba(30,8,70,0.6)';
    ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 2.2; ctx.globalAlpha = 0.75 * k; ctx.beginPath();
    const N = low ? 14 : 28;
    for (let i = 0; i <= N; i++) { const th = i / N * 6.283, r = R * 0.8 + Math.sin(th * 7 + t * 9) * 9 * k + Math.sin(th * 3 - t * 5) * 6, px = x + Math.cos(th) * r * 0.78, py = y + Math.sin(th) * r; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
    ctx.closePath(); ctx.stroke();
  } else if (a.type === 'inferno') {
    const R = 64 + 50 * k;
    ctx.globalAlpha = 0.85 * k;
    if (!low) { const g = ctx.createRadialGradient(x, y, 6, x, y, R); g.addColorStop(0, 'rgba(255,240,170,0.8)'); g.addColorStop(0.45, 'rgba(251,120,40,0.55)'); g.addColorStop(1, 'rgba(180,30,10,0)'); ctx.fillStyle = g; }
    else ctx.fillStyle = 'rgba(251,120,40,0.45)';
    ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.fill();
    // línguas de fogo
    ctx.globalAlpha = 0.9 * k; ctx.fillStyle = '#fb923c';
    const T = low ? 6 : 10;
    for (let i = 0; i < T; i++) {
      const bx = x + (i - (T - 1) / 2) * (56 / T) * 1.7, h = (34 + 24 * Math.sin(t * 13 + i * 1.9)) * k + 10;
      ctx.beginPath(); ctx.moveTo(bx - 6, f.y); ctx.quadraticCurveTo(bx + Math.sin(t * 9 + i) * 6, f.y - h * 0.6, bx + Math.sin(t * 11 + i) * 5, f.y - h - 30 * k); ctx.quadraticCurveTo(bx + 4, f.y - h * 0.4, bx + 6, f.y); ctx.fill();
    }
    ctx.fillStyle = '#fde047'; ctx.globalAlpha = 0.7 * k;
    for (let i = 0; i < T; i += 2) { const bx = x + (i - (T - 1) / 2) * (56 / T) * 1.7, h = (20 + 14 * Math.sin(t * 15 + i)) * k; ctx.beginPath(); ctx.moveTo(bx - 3, f.y); ctx.lineTo(bx, f.y - h - 12); ctx.lineTo(bx + 3, f.y); ctx.fill(); }
    // brilho no chão
    const fl = 0.55 + 0.45 * Math.sin(t * 18);
    ctx.globalAlpha = 0.5 * k * fl;
    if (!low) { const g2 = ctx.createRadialGradient(f.x, f.y, 4, f.x, f.y, 140 * k); g2.addColorStop(0, 'rgba(255,200,90,0.9)'); g2.addColorStop(1, 'rgba(255,80,20,0)'); ctx.fillStyle = g2; }
    else ctx.fillStyle = 'rgba(255,130,40,0.5)';
    ctx.beginPath(); ctx.ellipse(f.x, f.y + 2, 140 * k, 20 * k, 0, 0, 6.283); ctx.fill();
  } else {
    const R = 74 + 56 * k;
    ctx.globalAlpha = 0.95 * k;
    if (!low) { const g = ctx.createRadialGradient(x, y, 4, x, y, R); g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.4, 'rgba(255,240,170,0.6)'); g.addColorStop(1, 'rgba(180,230,255,0)'); ctx.fillStyle = g; }
    else ctx.fillStyle = 'rgba(255,245,190,0.5)';
    ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.fill();
    // raios giratórios
    ctx.globalAlpha = 0.5 * k; ctx.fillStyle = '#fff7d6';
    const rays = low ? 6 : 10;
    for (let i = 0; i < rays; i++) { const th = t * 0.9 + i / rays * 6.283, r1 = R * 1.1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(th - 0.07) * r1, y + Math.sin(th - 0.07) * r1); ctx.lineTo(x + Math.cos(th + 0.07) * r1, y + Math.sin(th + 0.07) * r1); ctx.fill(); }
    ctx.globalAlpha = 0.8 * k; ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(x, y, R * 0.62, R * 0.62, 0, 0, 6.283); ctx.stroke();
  }
  ctx.restore();
}

function drawAwkFront(ctx, f, t) {
  const a = f.awk; if (!a) return;
  const C = AWK_TYPES[a.type], P = f.pts, low = GFX.low, tt = AWK_T[a.type];
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // trilhas de movimento (anel de posições recentes, do mais novo para o mais antigo)
  const tr = a.tr, n = tr.length;
  if (a.ph === 'dash' || a.ph === 'blink' || a.ph === 'strike' || a.ph === 'rec') {
    let px = null, py = null;
    for (let j = 1; j <= n; j++) {
      const p = tr[(a.trI - j + n * 2) % n]; if (p.a <= 0.02) { px = null; continue; }
      if (px !== null) {
        const w = 26 * p.a;
        ctx.globalAlpha = 0.55 * p.a; ctx.strokeStyle = C.c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.globalAlpha = 0.9 * p.a; ctx.strokeStyle = a.type === 'void' ? C.c3 : '#ffffff'; ctx.lineWidth = w * 0.3; ctx.stroke();
      }
      px = p.x; py = p.y;
    }
  }
  // brilho nas mãos / orbes de concentração
  const u = clamp(a.lt / tt.prep, 0, 1);
  if (a.ph === 'prep' || (a.type === 'celestial' && a.ph === 'blink')) {
    const hR = P[HDR], hL = P[HDL];
    const glow = (x, y, r, c1, c2) => {
      ctx.globalAlpha = 0.9;
      if (!low) { const g = ctx.createRadialGradient(x, y, 1, x, y, r); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; } else ctx.fillStyle = c1;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    };
    if (a.type === 'void' && u > 0.35) glow(hR.x, hR.y, 8 + 22 * (u - 0.35) / 0.65, 'rgba(240,171,252,0.95)', 'rgba(60,10,120,0)');
    else if (a.type === 'inferno' && u > 0.3) { const r = 7 + 16 * u; glow(hR.x, hR.y, r, 'rgba(255,230,120,0.95)', 'rgba(251,90,30,0)'); glow(hL.x, hL.y, r, 'rgba(255,230,120,0.95)', 'rgba(251,90,30,0)'); }
    else if (a.type === 'celestial' && u > 0.35) { const r = 8 + 20 * u, mx = (hR.x + hL.x) / 2, my = (hR.y + hL.y) / 2; glow(mx, my, r, 'rgba(255,255,255,1)', 'rgba(255,240,170,0)'); }
  }
  // partículas orbitais (celestial)
  if (a.type === 'celestial' && a.aura > 0.2) {
    const cx = f.x, cy = f.y - 55, sp = 3.5 + 6 * (a.ph === 'prep' ? u : 1), N = low ? 6 : 12;
    ctx.fillStyle = '#fff7d6';
    for (let i = 0; i < N; i++) {
      const th = t * sp + i / N * 6.283, R = 50 + 14 * Math.sin(t * 3 + i * 2) + (a.ph === 'prep' ? (1 - u) * 20 : 0);
      ctx.globalAlpha = 0.9 * a.aura; ctx.beginPath(); ctx.arc(cx + Math.cos(th) * R, cy + Math.sin(th) * R * 0.7, 2.6 + (i % 3) * 0.7, 0, 6.283); ctx.fill();
      ctx.globalAlpha = 0.3 * a.aura; ctx.beginPath(); ctx.arc(cx + Math.cos(th - 0.25) * R, cy + Math.sin(th - 0.25) * R * 0.7, 2, 0, 6.283); ctx.fill();
    }
  }
  if (AWK2R[a.type]) AWK2R[a.type].front(ctx, f, t, a, u);
  ctx.restore();
}

// camada sob os lutadores: escurecimento do cenário
function drawCineUnder(ctx, m) {
  const c = m.cine; if (c.dim <= 0.01) return;
  ctx.fillStyle = 'rgba(3,0,16,' + c.dim.toFixed(3) + ')'; ctx.fillRect(-20, -20, WORLD_W + 40, WORLD_H + 40);
}
// camada sobre tudo: ondas de choque, pilar de luz, luz geral e flash
function drawCineOver(ctx, m) {
  const c = m.cine;
  for (const b of c.beams) {
    const a = b.l / b.L, e = 1 - a, w = (46 + 120 * easeO(Math.min(1, e * 2.2))) * Math.min(1, a * 2.2);
    ctx.fillStyle = b.c;
    ctx.globalAlpha = 0.25 * a; ctx.fillRect(b.x - w * 1.8, -10, w * 3.6, WORLD_H + 20);
    ctx.globalAlpha = 0.55 * a; ctx.fillRect(b.x - w, -10, w * 2, WORLD_H + 20);
    ctx.globalAlpha = 0.95 * a; ctx.fillRect(b.x - w * 0.42, -10, w * 0.84, WORLD_H + 20);
  }
  for (const s of c.shocks) {
    const a = s.l / s.L, r = s.r0 + (s.r1 - s.r0) * easeO(1 - a);
    ctx.globalAlpha = Math.min(1, a * 1.4); ctx.strokeStyle = s.c; ctx.lineWidth = s.w * a + 1.5;
    ctx.beginPath(); ctx.ellipse(s.x, s.y, r, r * 0.82, 0, 0, 6.283); ctx.stroke();
    ctx.globalAlpha = a * 0.7; ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(1, s.w * a * 0.3);
    ctx.beginPath(); ctx.ellipse(s.x, s.y, r * 0.97, r * 0.8, 0, 0, 6.283); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  if (c.light > 0.01) { ctx.fillStyle = c.lightC; ctx.globalAlpha = Math.min(0.7, c.light * 0.8); ctx.fillRect(-20, -20, WORLD_W + 40, WORLD_H + 40); ctx.globalAlpha = 1; }
  if (c.flash > 0.01) { ctx.fillStyle = c.flashC; ctx.globalAlpha = Math.min(1, c.flash); ctx.fillRect(-20, -20, WORLD_W + 40, WORLD_H + 40); ctx.globalAlpha = 1; }
}

// distorção do cenário: fatias da própria imagem deslocadas por uma onda (só em qualidade Alto)
function distortPass(ctx, m, t) {
  const c = m.cine;
  if (GFX.low || c.dist < 0.03) return;
  const M = ctx.getTransform(), s = M.a, cvs = ctx.canvas, W = cvs.width, H = cvs.height;
  let x0 = (c.dx - c.dr) * s + M.e, y0 = (c.dy - c.dr) * s + M.f, w = c.dr * 2 * s, h = w;
  if (x0 < 0) { w += x0; x0 = 0; } if (y0 < 0) { h += y0; y0 = 0; }
  if (x0 + w > W) w = W - x0; if (y0 + h > H) h = H - y0;
  if (w < 8 || h < 8) return;
  const step = Math.max(3, Math.round(5 * s)), amp = c.dist * 5.5 * s * (1 + c.kick * 2), n = Math.floor(h / step);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 0; i < n; i++) {
    const yy = y0 + i * step, taper = Math.sin(i / n * Math.PI);
    const off = (c.dtype === 0 ? Math.sin(t * 10 + i * 0.55) : Math.sin(t * 15 + i * 0.95) * 0.7) * amp * taper;
    ctx.drawImage(cvs, x0, yy, w, step, x0 + off, yy, w, step);
  }
  ctx.restore();
}

// prévia animada (menu de cosméticos): partida isolada, sem dano real
const AwkPreview = {
  m: null, type: null, t: 0, cycle: 0, key: '',
  ensure(type, skin) {
    const key = type + '|' + skin.color + skin.accent + skin.hat + skin.acc + skin.mask + skin.glasses + skin.clothes;
    if (this.m && this.key === key) return;
    this.key = key; this.type = type; this.t = 0; this.cycle = 0;
    const sk = Object.assign({}, skin, {awk: type});
    this.m = new Match({mode: 'awkprev', arena: 'training', awk: {on: true, charge: 'normal', dmg: 'normal'}, hp: 300, format: 'stock', lives: 99}, {skin: sk, shake: false, fxMax: GFX.low ? 90 : 260});
    this.m.pvHold = true; this.reset();
  },
  reset() {
    const m = this.m, h = m.fighters[0], d = m.fighters[1];
    h.reset({x: 430, y: 600}, true); d.reset({x: 800, y: 600}, true); h.facing = 1; d.facing = -1; h.invuln = d.invuln = 0;
    m.cine.dim = m.cine.light = m.cine.flash = m.cine.dist = 0; m.cine.zoom = 1; m.cine.shocks.length = 0; m.cine.beams.length = 0; m.fx.rings.length = 0;
    m.pvHold = true; this.t = 0;
  },
  step(dt) {
    const m = this.m; if (!m) return;
    this.t += dt;
    const h = m.fighters[0];
    if (this.t > 0.7 && m.pvHold) { m.pvHold = false; h.energy = 100; h.input.awkP = true; }
    if (!m.pvHold && !h.awk && this.t > 5.2) this.reset();
    let n = 0, acc = (this._acc || 0) + dt;
    while (acc >= DT && n < 6) { m.update(DT); acc -= DT; n++; }
    this._acc = n >= 6 ? 0 : acc;
  },
};

'use strict';
/* STICK MAYHEM v1.3.0 — render das FATALITIES (camadas sob/sobre os lutadores, HUD cinematográfico) e prévia isolada */

function fGlow(ctx, x, y, r, c0, c1) {
  if (GFX.low) { ctx.fillStyle = c0; ctx.beginPath(); ctx.arc(x, y, r * 0.7, 0, 6.283); ctx.fill(); return; }
  const g = ctx.createRadialGradient(x, y, 1, x, y, r); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
}
function fBolt(ctx, pts, a, w) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [lw, col, al] of [[w * 2.2, '#60a5fa', 0.35], [w, '#bfdbfe', 0.8], [w * 0.35, '#ffffff', 1]]) {
    ctx.globalAlpha = a * al; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
    for (let i = 0; i < pts.length; i += 2) { if (i) ctx.lineTo(pts[i], pts[i + 1]); else ctx.moveTo(pts[0], pts[1]); }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
function fGlyph(ctx, k, x, y, s, col) {
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.4;
  ctx.beginPath();
  if (k === 0) { ctx.moveTo(x, y - s); ctx.lineTo(x + s * 0.9, y + s * 0.6); ctx.lineTo(x - s * 0.9, y + s * 0.6); ctx.closePath(); ctx.stroke(); }
  else if (k === 1) { ctx.arc(x, y, s * 0.8, 0, 6.283); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, s * 0.25, 0, 6.283); ctx.fill(); }
  else if (k === 2) { ctx.moveTo(x, y - s); ctx.lineTo(x + s * 0.7, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s * 0.7, y); ctx.closePath(); ctx.stroke(); }
  else { ctx.font = 'bold ' + Math.round(s * 2) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('M', x, y + 1); ctx.textBaseline = 'alphabetic'; }
}

const FD = {};   // camadas por fatality: under(ctx,m,f,t,h,v,st) / over(...)

FD.iron = {
  over(ctx, m, f, t, h) { const S = f.S; if (S.glow > 0.02) { const p = h.pts[HDR], p2 = h.pts[HDL]; fGlow(ctx, p.x, p.y, 16 + 34 * S.glow, 'rgba(255,230,120,0.95)', 'rgba(249,115,22,0)'); fGlow(ctx, p2.x, p2.y, 8 + 14 * S.glow, 'rgba(255,230,120,0.7)', 'rgba(249,115,22,0)'); } },
};

FD.thunder = {
  under(ctx, m, f, t) {
    const k = f.S.cl; if (k < 0.02) return;
    ctx.save(); ctx.globalAlpha = 0.9 * k;
    const g = ctx.createLinearGradient(0, 0, 0, 260); g.addColorStop(0, 'rgba(8,10,30,1)'); g.addColorStop(1, 'rgba(20,24,60,0)'); ctx.fillStyle = g; ctx.fillRect(-20, -20, WORLD_W + 40, 280);
    ctx.fillStyle = 'rgba(30,36,80,0.8)';
    for (let i = 0; i < 9; i++) { const x = i * 170 - 40 + Math.sin(t * 0.5 + i) * 20, y = 40 + (i % 3) * 22; ctx.beginPath(); ctx.arc(x, y, 80, 0, 6.283); ctx.arc(x + 70, y + 12, 64, 0, 6.283); ctx.arc(x - 60, y + 14, 58, 0, 6.283); ctx.fill(); }
    ctx.restore();
  },
  over(ctx, m, f, t, h, v) {
    const S = f.S, T = f.t;
    if (S.cl > 0.3 && T < 5.2) { // arcos elétricos em volta do herói
      ctx.strokeStyle = '#fde047'; ctx.lineWidth = 2; ctx.globalAlpha = 0.9; const cx = h.x, cy = h.y - 60, n = GFX.low ? 3 : 6;
      for (let i = 0; i < n; i++) { const a = T * 9 + i * 1.05, r = 40 + 30 * Math.sin(T * 13 + i); ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 20, cy + Math.sin(a) * 40); ctx.lineTo(cx + Math.cos(a + 0.3) * r, cy + Math.sin(a + 0.3) * r * 1.5 + Math.sin(T * 40 + i) * 6); ctx.lineTo(cx + Math.cos(a - 0.2) * (r + 26), cy + Math.sin(a - 0.2) * (r + 26) * 1.4); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
    if (S.bolt) { const a = 1 - (T - S.bolt.t0) / 0.7; if (a > 0) { fBolt(ctx, S.bolt.pts, a * (0.7 + 0.3 * (((T * 40) | 0) & 1)), 18 * (0.5 + a * 0.5)); fGlow(ctx, S.bolt.x, m.stage.gy, 90 * a, 'rgba(255,255,200,0.9)', 'rgba(96,165,250,0)'); } }
    for (const b of S.mini) { const a = 1 - (T - b.t0) / 0.35; if (a > 0) { const pts = []; for (let i = 0; i <= 8; i++) pts.push(b.x + Math.sin(i * 7 + b.x) * 22 * (1 - i / 8), -20 + i * ((m.stage.gy + 20) / 8)); fBolt(ctx, pts, a, 8); } }
  },
};

FD.meteor = {
  under(ctx, m, f, t) {
    const S = f.S, st = m.stage;
    if (S.glow > 0.02) { ctx.save(); ctx.globalAlpha = 0.55 * S.glow; const g = ctx.createRadialGradient(WORLD_W * 0.85, -80, 20, WORLD_W * 0.85, -80, 900); g.addColorStop(0, 'rgba(255,140,40,0.9)'); g.addColorStop(1, 'rgba(120,20,10,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, WORLD_W, WORLD_H); ctx.restore(); }
    if (S.cr > 0.02) { const x = st.cx + 90, y = st.gy; ctx.save(); ctx.globalAlpha = Math.min(1, S.cr); ctx.fillStyle = 'rgba(25,12,8,0.9)'; ctx.beginPath(); ctx.ellipse(x, y + 2, 110, 14, 0, 0, 6.283); ctx.fill();
      ctx.strokeStyle = '#fb923c'; ctx.lineWidth = 3; ctx.globalAlpha = S.cr * (0.6 + 0.3 * Math.sin(t * 8)); for (let i = 0; i < 7; i++) { const a = -3.14 + i * 0.52, r = 60 + (i * 37 % 50); ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 20, y - 2 + Math.sin(a) * 3); ctx.lineTo(x + Math.cos(a) * r, y - 2 + Math.sin(a) * r * 0.12); ctx.stroke(); } ctx.restore(); }
  },
  over(ctx, m, f, t) {
    const S = f.S, M = S.m; if (!M.on) return;
    ctx.save();
    for (let j = 0; j < 16; j++) { const i = (S.tn - j + 32) % 16, x = S.tr[i * 2], y = S.tr[i * 2 + 1]; if (!x && !y) continue; const k = 1 - j / 16; fGlow(ctx, x, y, M.r * (0.5 + k * 1.1), 'rgba(255,' + ((120 + 100 * k) | 0) + ',40,' + (0.55 * k).toFixed(2) + ')', 'rgba(120,20,10,0)'); }
    fGlow(ctx, M.x, M.y, M.r * 2.1, 'rgba(255,200,90,0.9)', 'rgba(255,80,20,0)');
    ctx.fillStyle = '#3b2a22'; ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.beginPath();
    for (let k = 0; k < 9; k++) { const a = k / 9 * 6.283 + t * 3, r = M.r * (0.86 + 0.2 * Math.sin(k * 2.7)); const px = M.x + Math.cos(a) * r, py = M.y + Math.sin(a) * r; if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fb923c'; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(M.x - M.r * 0.18, M.y - M.r * 0.12, M.r * 0.5, 0, 6.283); ctx.fill(); ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(M.x - M.r * 0.25, M.y - M.r * 0.2, M.r * 0.22, 0, 6.283); ctx.fill();
    ctx.restore();
  },
};

FD.shadow = {
  under(ctx, m, f, t) {
    const S = f.S; ctx.save(); ctx.fillStyle = 'rgba(10,4,24,0.75)'; ctx.strokeStyle = 'rgba(167,139,250,0.9)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    for (let gi = 0; gi < 6; gi++) {
      const age = f.t - (S.T[gi] || 99); if (!S['s' + gi] || age < 0 || age > 1.2) continue; const g = S.gh[gi], a = Math.max(0, 1 - age / 1.2); ctx.globalAlpha = 0.65 * a;
      const L = (i, j) => { ctx.beginPath(); ctx.moveTo(g[i * 2], g[i * 2 + 1]); ctx.lineTo(g[j * 2], g[j * 2 + 1]); ctx.stroke(); };
      ctx.lineWidth = 9; ctx.strokeStyle = 'rgba(20,8,44,0.9)'; L(CHEST, HIP); L(HIP, KNL); L(KNL, FTL); L(HIP, KNR); L(KNR, FTR); L(CHEST, ELL); L(ELL, HDL); L(CHEST, ELR); L(ELR, HDR);
      ctx.fillStyle = 'rgba(20,8,44,0.9)'; ctx.beginPath(); ctx.arc(g[0], g[1], 11, 0, 6.283); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(196,181,253,0.9)'; L(CHEST, HIP); L(HIP, KNR); L(KNR, FTR); L(CHEST, ELR); L(ELR, HDR);
    }
    ctx.restore();
  },
  over(ctx, m, f, t) {
    const S = f.S, T = f.t; ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < S.sl.length; i++) {
      const s = S.sl[i], age = T - s.t0; const burst = S.burst > 0 ? T - S.burst : -1;
      let a = Math.max(0, 1 - age / 0.35), w = 5 * a;
      if (burst >= 0) { a = Math.max(a, 1 - burst / 0.6); w = Math.max(w, 14 * (1 - burst / 0.6)); }
      else if (age > 0.35) { a = 0.2; w = 1.5; }
      if (a <= 0.01) continue;
      ctx.globalAlpha = a; ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = w * 2; ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = Math.max(1, w * 0.5); ctx.stroke();
    }
    ctx.restore();
  },
};

FD.gravity = {
  under(ctx, m, f, t) {
    const S = f.S, st = m.stage, x = st.cx + 90;
    if (S.field > 0.02) { ctx.save(); ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { const u = ((t * 0.8 + i / 4) % 1), r = 220 * (1 - u); ctx.globalAlpha = S.field * u * 0.8; ctx.beginPath(); ctx.ellipse(x, st.gy + 2, r, r * 0.14, 0, 0, 6.283); ctx.stroke(); } ctx.restore(); }
    if (S.on) { ctx.save(); ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 4; ctx.lineCap = 'round'; const k = Math.min(1, (f.t - 3.75) / 0.25);
      for (let i = 0; i < 9; i++) { const a = S.cr[i * 2], L = S.cr[i * 2 + 1] * k; ctx.beginPath(); ctx.moveTo(S.cx, st.gy + 2); ctx.lineTo(S.cx + Math.cos(a) * L, st.gy + 2 + Math.sin(a) * L * 0.1 + Math.abs(Math.sin(i * 9)) * 6); ctx.stroke(); }
      ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.7; for (let i = 0; i < 9; i++) { const a = S.cr[i * 2], L = S.cr[i * 2 + 1] * k; ctx.beginPath(); ctx.moveTo(S.cx, st.gy + 2); ctx.lineTo(S.cx + Math.cos(a) * L, st.gy + 2 + Math.sin(a) * L * 0.1 + Math.abs(Math.sin(i * 9)) * 6); ctx.stroke(); }
      ctx.restore(); }
  },
  over(ctx, m, f, t) {
    ctx.save(); ctx.lineJoin = 'round';
    for (const r of f.S.r) {
      if (r.mode === 0) continue; ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.a); ctx.fillStyle = '#64748b'; ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.beginPath();
      for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283, q = r.s * (0.8 + 0.3 * Math.sin(k * 2.3 + r.ph)); if (k) ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q); else ctx.moveTo(Math.cos(a) * q, Math.sin(a) * q); }
      ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.beginPath(); ctx.arc(-r.s * 0.25, -r.s * 0.25, r.s * 0.3, 0, 6.283); ctx.fill(); ctx.restore();
    }
    ctx.restore();
  },
};

FD.blade = {
  over(ctx, m, f, t) {
    const S = f.S; ctx.save(); ctx.lineCap = 'round';
    if (f.t > 3.0 && f.t < 3.7) { ctx.strokeStyle = '#a5f3fc'; for (let j = 1; j < 12; j++) { const i = (S.tn - j + 24) % 12, k = (i + 11) % 12, a = 1 - j / 12; if (!S.tr[i * 2]) continue; ctx.globalAlpha = 0.6 * a; ctx.lineWidth = 22 * a; ctx.beginPath(); ctx.moveTo(S.tr[i * 2], S.tr[i * 2 + 1]); ctx.lineTo(S.tr[((i + 1) % 12) * 2], S.tr[((i + 1) % 12) * 2 + 1]); ctx.stroke(); } }
    if (S.on && f.t > 1.0) {
      for (let i = 0; i < 6; i++) {
        const x = S.b[i * 3], y = S.b[i * 3 + 1], a = S.b[i * 3 + 2] + 1.5708; ctx.save(); ctx.translate(x, y); ctx.rotate(a);
        fGlow(ctx, 0, 0, 30, 'rgba(165,243,252,0.55)', 'rgba(103,232,249,0)');
        ctx.fillStyle = '#e0f2fe'; ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2.5; ctx.globalAlpha = 1; ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(6, 0); ctx.lineTo(0, 24); ctx.lineTo(-6, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      }
    }
    const x = m.stage.cx + 90, y = m.stage.gy - 62, age = f.t - S.fx;
    if (!S.on && age >= 0 && age < 0.55) { const a = 1 - age / 0.55; ctx.globalAlpha = a; ctx.strokeStyle = '#67e8f9'; ctx.lineWidth = 16 * a; ctx.beginPath(); ctx.moveTo(x - 110, y - 90); ctx.lineTo(x + 110, y + 90); ctx.moveTo(x + 110, y - 90); ctx.lineTo(x - 110, y + 90); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 5 * a; ctx.stroke(); }
    ctx.restore();
  },
};

FD.void = {
  over(ctx, m, f, t) {
    const S = f.S, r = S.r; if (r < 3) return; const x = S.sx, y = S.sy; ctx.save();
    fGlow(ctx, x, y, r * 1.9, 'rgba(124,58,237,0.6)', 'rgba(76,29,149,0)');
    ctx.fillStyle = '#05010d'; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 4; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.stroke();
    ctx.strokeStyle = '#f0abfc'; ctx.lineWidth = 2.5; for (let i = 0; i < 3; i++) { ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(x, y, r * (0.45 + 0.17 * i), t * 4 + i * 2, t * 4 + i * 2 + 2.2); ctx.stroke(); }
    ctx.globalAlpha = 0.6; ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, r * 1.45, r * 0.34, -0.35 + Math.sin(t) * 0.1, 0, 6.283); ctx.stroke();
    ctx.restore();
  },
};

FD.god = {
  under(ctx, m, f, t, h) {
    const S = f.S, st = m.stage; const cx = h.x, cy = h.y - 60;
    if (S.rays > 0.02) { ctx.save(); ctx.globalAlpha = 0.28 * S.rays; ctx.fillStyle = '#fde68a'; const n = GFX.low ? 8 : 14; for (let i = 0; i < n; i++) { const a = t * 0.6 + i / n * 6.283; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a - 0.06) * 1400, cy + Math.sin(a - 0.06) * 1400); ctx.lineTo(cx + Math.cos(a + 0.06) * 1400, cy + Math.sin(a + 0.06) * 1400); ctx.fill(); } ctx.restore(); }
    if (S.ring > 0.02) { ctx.save(); const k = S.ring, cxx = cx, cyy = st.gy + 3; ctx.lineWidth = 3; ctx.globalAlpha = 0.85 * k;
      for (const [rx, col] of [[230, '#f0abfc'], [170, '#fde047'], [110, '#67e8f9']]) { ctx.strokeStyle = col; ctx.beginPath(); ctx.ellipse(cxx, cyy, rx * k, rx * k * 0.16, 0, 0, 6.283); ctx.stroke(); }
      for (let i = 0; i < 12; i++) { const a = S.rune * 0.6 + i / 12 * 6.283, rx = 230 * k; fGlyph(ctx, i % 4, cxx + Math.cos(a) * rx, cyy + Math.sin(a) * rx * 0.16, 7, '#f0abfc'); }
      ctx.restore(); }
    if (S.aura > 0.02) { const p = 0.85 + 0.15 * Math.sin(t * 6); ctx.save(); ctx.globalAlpha = S.aura * 0.8;
      fGlow(ctx, cx, cy, 190 * p, 'rgba(103,232,249,0.4)', 'rgba(103,232,249,0)'); fGlow(ctx, cx, cy, 130 * p, 'rgba(253,224,71,0.5)', 'rgba(253,224,71,0)'); fGlow(ctx, cx, cy, 80 * p, 'rgba(240,171,252,0.8)', 'rgba(240,171,252,0)'); ctx.restore(); }
  },
  over(ctx, m, f, t, h, v) {
    const S = f.S; const cx = h.x, cy = h.y - 60;
    if (S.ring > 0.1 && f.t < 8) {
      ctx.save(); ctx.globalAlpha = S.ring * 0.95;
      for (let i = 0; i < 8; i++) { const a = S.rune + i / 8 * 6.283; fGlyph(ctx, i % 4, cx + Math.cos(a) * 140, cy + Math.sin(a) * 96, 11, i % 2 ? '#fde047' : '#f0abfc'); }
      for (let i = 0; i < 6; i++) { const a = -S.rune * 1.3 + i / 6 * 6.283; fGlyph(ctx, (i + 1) % 4, cx + Math.cos(a) * 200, cy + Math.sin(a) * 130, 13, '#67e8f9'); }
      ctx.restore();
    }
    if (S.chain > 0.02 && !v.ragdoll) {
      ctx.save(); ctx.strokeStyle = '#f0abfc'; ctx.lineWidth = 3; ctx.globalAlpha = S.chain; const vx = v.x, vy = v.y - 50;
      for (let i = 0; i < 4; i++) { const a = S.rune + i * 1.57, sx = cx + Math.cos(a) * 140, sy = cy + Math.sin(a) * 96; ctx.beginPath(); ctx.moveTo(sx, sy); for (let k = 1; k <= 6; k++) { const u = k / 6; ctx.lineTo(lerp(sx, vx, u) + Math.sin(t * 20 + k + i) * 8 * (1 - u), lerp(sy, vy, u) + Math.cos(t * 17 + k * 2) * 8 * (1 - u)); } ctx.stroke(); }
      ctx.restore();
    }
  },
};

function drawFatUnder(ctx, m, t) { const f = m.fat; if (!f) return; const d = FD[f.id]; if (d && d.under) d.under(ctx, m, f, t, m.fighters[0], m.fighters[1]); }
function drawFatOver(ctx, m, t) { const f = m.fat; if (!f) return; const d = FD[f.id]; if (d && d.over) d.over(ctx, m, f, t, m.fighters[0], m.fighters[1]); }

// HUD cinematográfico: faixas de cinema, "FATALITY" no impacto, nome e (GOD) letras animadas
function drawFatHUD(ctx, m, t) {
  const f = m.fat; if (!f) return; const C = FATS[f.id];
  ctx.save(); ctx.textBaseline = 'alphabetic';
  const bh = 64 * easeO(f.bars);
  ctx.fillStyle = 'rgba(0,0,0,0.92)'; ctx.fillRect(0, 0, WORLD_W, bh); ctx.fillRect(0, WORLD_H - bh, WORLD_W, bh);
  const it = f.t - f.impact;
  if (it > 0 && it < 2.1) {
    const k = it < 1.6 ? 1 : (2.1 - it) * 2, sc = 1 + Math.max(0, 1 - it * 5) * 0.9, sh = Math.max(0, 1 - it * 1.4) * 5;
    ctx.save(); ctx.translate(WORLD_W / 2 + rnd(-sh, sh), 250 + rnd(-sh, sh)); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k, 0, 1);
    ctx.font = '900 128px Impact, "Arial Black", sans-serif'; ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.lineWidth = 14; ctx.strokeStyle = '#0a0c18'; ctx.strokeText('FATALITY', 0, 0);
    ctx.fillStyle = '#ef4444'; ctx.fillText('FATALITY', 0, 0); ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.strokeText('FATALITY', 0, 0); ctx.restore();
  }
  if (it > 0.6) {
    const a = clamp((it - 0.6) / 0.5, 0, 1), y = WORLD_H - 22 - (1 - a) * 20;
    ctx.globalAlpha = a; ctx.font = 'bold 34px sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 6; ctx.strokeStyle = OUT; ctx.strokeText(C.name, WORLD_W / 2, y); ctx.fillStyle = C.c; ctx.fillText(C.name, WORLD_W / 2, y);
  }
  if (f.id === 'god' && f.S.name > 0.01) {
    const txt = 'GOD OF MAYHEM', n = txt.length; ctx.font = '900 76px Impact, "Arial Black", sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 9; ctx.lineJoin = 'round';
    const w = ctx.measureText(txt).width; let x = WORLD_W / 2 - w / 2;
    for (let i = 0; i < n; i++) {
      const ch = txt[i], cw = ctx.measureText(ch).width, a = clamp(f.S.name * n - i, 0, 1); if (a > 0) {
        const bob = Math.sin(t * 5 + i * 0.6) * 4, sc = 1 + (1 - a) * 1.4; ctx.save(); ctx.translate(x + cw / 2, 410 + bob); ctx.scale(sc, sc); ctx.globalAlpha = a;
        ctx.strokeStyle = OUT; ctx.strokeText(ch, 0, 0); ctx.fillStyle = ['#f0abfc', '#fde047', '#67e8f9'][i % 3]; ctx.fillText(ch, 0, 0); ctx.restore();
      }
      x += cw;
    }
  }
  ctx.restore();
}

// prévia isolada (menu PERSONALIZAR): usa o mesmo motor, sem partida real, em laço
const FatPreview = {
  m: null, id: null, key: '', hold: 0, _acc: 0,
  ensure(id, skin) {
    const key = id + '|' + skin.color + skin.accent + skin.hat + skin.acc + skin.mask + skin.glasses + skin.clothes + (skin.style || '');
    if (this.m && this.key === key) return;
    this.key = key; this.id = id; this.hold = 0; this._acc = 0;
    const foe = Object.assign({}, ENEMY_SKINS[0]); if (foe.color.toLowerCase() === skin.color.toLowerCase()) foe.color = '#16a34a';
    this.m = new Match({mode: 'fatality', arena: 'training', weapons: false, camFx: true, hp: 100, format: 'stock', lives: 1}, {skin: Object.assign({}, skin), skin2: foe, shake: false, fxMax: GFX.low ? 90 : 260});
    this.m.fatStart(id);
  },
  restart() { this.hold = 0; this._acc = 0; if (this.m) this.m.fatStart(this.id); },
  step(dt) {
    const m = this.m; if (!m) return;
    if (m.fat.done) { this.hold += dt; if (this.hold > 1.4) this.restart(); }
    let acc = this._acc + dt * (m.timeScale || 1), n = 0;
    while (acc >= DT && n < 6) { m.update(DT); acc -= DT; n++; }
    this._acc = n >= 6 ? 0 : acc;
  },
};

'use strict';
/* STICK MAYHEM v1.4.0 — ONLINE: salas com código de convite, até 4 jogadores.
   Transporte: WebRTC (RTCDataChannel) peer-a-peer; a sinalização usa o protocolo do servidor PeerJS
   (WebSocket) — por padrão o servidor público 0.peerjs.com, configurável. O HOST é autoritativo:
   roda a simulação inteira e envia "snapshots"; os convidados enviam apenas os controles. */
const NET_PROTO = 1, NET_MAX = 4, NET_PREFIX = 'smayhem-';
const NET_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#facc15'];
const NET_ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';           // sem 0/O/1/I
const NET_ICE = [
  {urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:global.stun.twilio.com:3478']},
  {urls: ['turn:eu-0.turn.peerjs.com:3478', 'turn:us-0.turn.peerjs.com:3478'], username: 'peerjs', credential: 'peerjsp'},
];
const NET_SIG0 = {host: '0.peerjs.com', port: 443, path: '/', secure: true, key: 'peerjs'};

function netCode() { let s = ''; for (let i = 0; i < 6; i++) s += NET_ALPHA[(Math.random() * NET_ALPHA.length) | 0]; return s; }
function netNormCode(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6); }
function netRid() { return 'c' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
function netClean(s, n) { return String(s == null ? '' : s).replace(/[\u0000-\u001f<>&"'`\\]/g, '').trim().slice(0, n || 12); }
const NET_HEX = /^#[0-9a-fA-F]{6}$/;
// o que vem da rede nunca é confiado: só chaves conhecidas, com valores válidos
function netSkin(s, slot) {
  s = s && typeof s === 'object' ? s : {};
  const str = (v, d) => (typeof v === 'string' ? netClean(v, 24) : d);
  const o = {color: NET_HEX.test(s.color) ? s.color : NET_COLORS[slot], accent: NET_HEX.test(s.accent) ? s.accent : '#22d3ee',
    hat: str(s.hat, 'none'), mask: str(s.mask, 'none'), glasses: str(s.glasses, 'none'), cape: CAPES[s.cape] ? s.cape : 'none',
    acc: str(s.acc, 'none'), deco: str(s.deco, ''), clothes: str(s.clothes, 'none'), fx: str(s.fx, 'none'),
    win: WIN_IDS.includes(s.win) ? s.win : 'wave', awk: AWK_TYPES[s.awk] ? s.awk : 'void', style: str(s.style, '')};
  for (const k of ['body', 'eyes', 'belt', 'trim', 'hair']) if (NET_HEX.test(s[k])) o[k] = s[k];
  return o;
}

// ---------------------------------------------------------------- sinalização (protocolo PeerJS)
class NetSignal {
  constructor(cfg, id, h) { this.cfg = cfg; this.id = id; this.h = h; this.ws = null; this.open = false; this.hb = 0; this.dead = false; }
  url() {
    const c = this.cfg, tok = Math.random().toString(36).slice(2);
    let p = c.path || '/'; if (p[0] !== '/') p = '/' + p; if (p[p.length - 1] !== '/') p += '/';
    return (c.secure ? 'wss' : 'ws') + '://' + c.host + (c.port ? ':' + c.port : '') + p + 'peerjs?key=' + encodeURIComponent(c.key || 'peerjs') + '&id=' + encodeURIComponent(this.id) + '&token=' + tok;
  }
  connect() {
    let ws;
    try { ws = new WebSocket(this.url()); } catch (e) { this.h.error && this.h.error('socket'); return; }
    this.ws = ws;
    ws.onmessage = ev => {
      let m; try { m = JSON.parse(ev.data); } catch (e) { return; }
      if (m.type === 'OPEN') { this.open = true; clearInterval(this.hb); this.hb = setInterval(() => this.send({type: 'HEARTBEAT'}), 5000); this.h.open && this.h.open(); }
      else this.h.msg && this.h.msg(m);
    };
    ws.onerror = () => { if (!this.dead) this.h.error && this.h.error('socket'); };
    ws.onclose = () => { clearInterval(this.hb); const was = this.open; this.open = false; if (!this.dead) this.h.close && this.h.close(was); };
  }
  send(o) { if (this.ws && this.ws.readyState === 1) try { this.ws.send(JSON.stringify(o)); } catch (e) {} }
  close() { this.dead = true; clearInterval(this.hb); try { this.ws && this.ws.close(); } catch (e) {} }
}

// ---------------------------------------------------------------- ligação ponto a ponto
class NetLink {
  constructor(sig, remote, initiator, h) {
    this.sig = sig; this.remote = remote; this.h = h; this.initiator = initiator; this.pc = null; this.r = null; this.u = null;
    this.pend = []; this.haveRemote = false; this.closed = false; this.opened = false;
    const pc = this.pc = new RTCPeerConnection({iceServers: NET_ICE});
    pc.onicecandidate = e => { if (e.candidate) this.sig.send({type: 'CANDIDATE', dst: remote, payload: {candidate: e.candidate}}); };
    pc.onconnectionstatechange = () => { const s = pc.connectionState; if (s === 'failed' || s === 'closed') this.fail('ice'); else if (s === 'disconnected') { clearTimeout(this._dc); this._dc = setTimeout(() => { if (pc.connectionState === 'disconnected') this.fail('ice'); }, 5000); } };
    pc.ondatachannel = e => this.attach(e.channel);
    if (initiator) { this.attach(pc.createDataChannel('r', {ordered: true})); this.attach(pc.createDataChannel('u', {ordered: false, maxRetransmits: 0})); }
  }
  attach(ch) {
    if (ch.label === 'r') this.r = ch; else if (ch.label === 'u') this.u = ch; else return;
    ch.onopen = () => this.check();
    ch.onclose = () => { if (ch.label === 'r') this.fail('closed'); };
    ch.onmessage = e => { let m; try { m = JSON.parse(e.data); } catch (x) { return; } this.h.msg && this.h.msg(m, this); };
    if (ch.readyState === 'open') this.check();
  }
  check() { if (!this.opened && this.r && this.r.readyState === 'open' && this.u && this.u.readyState === 'open') { this.opened = true; this.h.open && this.h.open(this); } }
  async offer() {
    const o = await this.pc.createOffer(); await this.pc.setLocalDescription(o);
    this.sig.send({type: 'OFFER', dst: this.remote, payload: {sdp: this.pc.localDescription}});
  }
  async onOffer(sdp) {
    await this.pc.setRemoteDescription(sdp); this.haveRemote = true; await this.flush();
    const a = await this.pc.createAnswer(); await this.pc.setLocalDescription(a);
    this.sig.send({type: 'ANSWER', dst: this.remote, payload: {sdp: this.pc.localDescription}});
  }
  async onAnswer(sdp) { await this.pc.setRemoteDescription(sdp); this.haveRemote = true; await this.flush(); }
  async onCand(c) { if (!this.haveRemote) { this.pend.push(c); return; } try { await this.pc.addIceCandidate(c); } catch (e) {} }
  async flush() { for (const c of this.pend.splice(0)) { try { await this.pc.addIceCandidate(c); } catch (e) {} } }
  send(o, unrel) {
    const ch = unrel && this.u && this.u.readyState === 'open' ? this.u : this.r;
    if (!ch || ch.readyState !== 'open') return false;
    if (ch === this.u && ch.bufferedAmount > 300000) return false;
    try { ch.send(JSON.stringify(o)); return true; } catch (e) { return false; }
  }
  fail(why) { if (this.closed) return; this.closed = true; clearTimeout(this._dc); this.h.close && this.h.close(this, why); this.destroy(); }
  destroy() { this.closed = true; try { this.r && this.r.close(); this.u && this.u.close(); this.pc.close(); } catch (e) {} }
}

// ---------------------------------------------------------------- sala
const Net = {
  role: null,            // null | 'host' | 'client'
  code: '', pid: -1, players: [], opts: {arena: 'neon', lives: 3, weapons: true}, phase: 'idle', // idle|connecting|lobby|play|result
  ping: 0, status: '', sig: null, links: {}, hostLink: null, inputs: {}, ev: [], seq: 0, on: {}, inSim: false,
  conf() {
    // padrão: o próprio site que serve o jogo (Render) também faz a sinalização; abrindo o arquivo local (file://) cai no servidor público do PeerJS
    const c = Object.assign({}, NET_SIG0), s = (typeof save !== 'undefined' && save.net) || {}, q = new URLSearchParams(location.search);
    if (/^https?:$/.test(location.protocol)) { const sec = location.protocol === 'https:'; Object.assign(c, {host: location.hostname, port: location.port ? +location.port : (sec ? 443 : 80), path: '/', secure: sec}); }
    const host = q.get('peerhost') || s.host, port = q.get('peerport') || s.port, path = q.get('peerpath') || s.path, sec = q.get('peersecure');
    if (host) { c.host = host.trim(); c.port = port ? +port : (s.secure === false || sec === '0' ? 80 : 443); c.path = path || '/'; c.secure = sec != null ? sec !== '0' : s.secure !== false; }
    return c;
  },
  supported() { return typeof RTCPeerConnection !== 'undefined' && typeof WebSocket !== 'undefined'; },
  emit(n, a, b) { try { this.on[n] && this.on[n](a, b); } catch (e) { console.error(e); } },
  setStatus(t) { this.status = t; this.emit('status', t); },
  reset() {
    if (this.sig) this.sig.close();
    for (const k in this.links) this.links[k].destroy();
    if (this.hostLink) this.hostLink.destroy();
    clearInterval(this._iv); clearTimeout(this._to);
    this.restoreSfx();
    this.role = null; this.code = ''; this.pid = -1; this.players = []; this.phase = 'idle'; this.sig = null; this.links = {}; this.hostLink = null; this.inputs = {}; this.ev = []; this.ping = 0; this.match = null; this.snap = null;
  },
  mePlayer() { return this.players.find(p => p.pid === this.pid); },

  // ---------- HOST
  host(name, skin, tries) {
    this.reset(); this.role = 'host'; this.phase = 'connecting'; this.name = netClean(name, 12) || 'JOGADOR'; this.skin = skin;
    tries = tries || 0; const code = netCode(); this.code = code;
    this.setStatus('Criando sala…');
    let opened = false;
    const sig = this.sig = new NetSignal(this.conf(), NET_PREFIX + code, {
      open: () => {
        opened = true; clearTimeout(this._to);
        this.pid = 0; this.players = [this.mk(0, this.name, skin, 0)]; this.phase = 'lobby'; this.lastSeen = {};
        this.setStatus('Sala criada. Compartilhe o código.'); this.emit('room');
        clearInterval(this._iv); this._iv = setInterval(() => this.hostWatch(), 1000);
      },
      msg: m => this.hostSig(m),
      error: () => { if (!opened) this.fatal('Não foi possível conectar ao servidor de sinalização. Verifique a internet ou o servidor configurado.'); },
      close: was => { if (!opened) this.fatal('Não foi possível conectar ao servidor de sinalização. Verifique a internet ou o servidor configurado.'); else if (this.role === 'host') this.setStatus('Servidor de sinalização desconectado (jogadores já conectados continuam).'); },
    });
    const idTaken = m => { if (m.type === 'ID-TAKEN' && !opened) { sig.close(); if (tries < 6) this.host(name, skin, tries + 1); else this.fatal('Não foi possível reservar um código. Tente de novo.'); return true; } return false; };
    const hs = sig.h.msg; sig.h.msg = m => { if (idTaken(m)) return; if (m.type === 'INVALID-KEY') { this.fatal('Servidor de sinalização recusou a chave.'); return; } hs(m); };
    clearTimeout(this._to); this._to = setTimeout(() => { if (!opened) this.fatal('Tempo esgotado ao conectar ao servidor de sinalização.'); }, 12000);
    sig.connect();
  },
  uniq(name) { let n = name, k = 1; while (this.players.some(p => p.name === n)) { k++; n = name.slice(0, 10) + ' ' + k; } return n; },
  mk(pid, name, skin, now) { return {pid, name: this.uniq(name), skin: netSkin(skin, pid), color: NET_COLORS[pid], ping: 0, seen: now || 0}; },
  hostSig(m) {
    const src = m.src; if (!src) return;
    if (m.type === 'OFFER' && m.payload && m.payload.sdp) {
      if (this.links[src]) return;
      const L = new NetLink(this.sig, src, false, {
        open: l => {}, msg: (x, l) => this.hostMsg(x, l), close: (l, why) => this.hostDrop(l, why),
      });
      L.rid = src; L.pid = -1; this.links[src] = L; L.t0 = performance.now();
      L.onOffer(m.payload.sdp).catch(() => { L.fail('sdp'); });
    } else if (m.type === 'CANDIDATE' && this.links[src] && m.payload && m.payload.candidate) this.links[src].onCand(m.payload.candidate);
  },
  hostWatch() {
    const now = performance.now();
    for (const k in this.links) {
      const L = this.links[k];
      if (L.pid < 0) { if (now - L.t0 > 15000) L.fail('hello'); continue; }
      if (now - L.seen > 7000) L.fail('timeout');
    }
    if (this.phase === 'lobby' || this.phase === 'result') this.sendRoom();
  },
  hostMsg(m, L) {
    L.seen = performance.now();
    switch (m.k) {
      case 'hello': {
        if (L.pid >= 0) return;
        const rej = why => { L.send({k: 'rej', why}); setTimeout(() => L.fail('rejected'), 400); };
        if (m.proto !== NET_PROTO) return rej('Versão incompatível (atualize o jogo).');
        if (this.phase === 'play') return rej('Partida em andamento. Aguarde a próxima.');
        let pid = -1; for (let i = 1; i < NET_MAX; i++) if (!this.players.some(p => p.pid === i)) { pid = i; break; }
        if (pid < 0) return rej('Sala cheia (máx. 4 jogadores).');
        L.pid = pid; const p = this.mk(pid, netClean(m.name, 12) || 'JOGADOR ' + (pid + 1), m.skin, 0); this.players.push(p); this.players.sort((a, b) => a.pid - b.pid);
        L.send({k: 'wel', pid, code: this.code, v: VERSION});
        this.sendRoom(); this.emit('room'); SFX.play('select');
        break;
      }
      case 'pg': L.send({k: 'pn', t: m.t}, true); if (m.p !== undefined) { const p = this.players.find(x => x.pid === L.pid); if (p) p.ping = m.p | 0; } break;
      case 'in': {
        const inp = this.inputs[L.pid]; if (!inp) return;
        inp.mx = +m.mx || 0; inp.my = +m.my || 0; inp.face = +m.face || 0; inp.aimX = +m.aimX || 0; inp.aimY = +m.aimY || 0; inp.jumpH = !!m.jh; inp.atkH = !!m.ah;
        const c = L.cnt || (L.cnt = {j: 0, s: 0, d: 0});
        if (m.j > c.j) { inp.jumpP = true; c.j = m.j; } if (m.s > c.s) { inp.spP = true; c.s = m.s; } if (m.d > c.d) { inp.dropP = true; c.d = m.d; }
        break;
      }
      case 'bye': L.fail('bye'); break;
    }
  },
  hostDrop(L, why) {
    delete this.links[L.rid];
    if (L.pid < 0) return;
    const i = this.players.findIndex(p => p.pid === L.pid); if (i < 0) return;
    const p = this.players[i]; this.players.splice(i, 1);
    if (this.phase === 'play' && this.match) {
      const f = this.match.fighters.find(x => x.netPid === p.pid);
      if (f && !f.out) { f.lives = 0; f.hp = 0; f.out = true; f.alive = false; f.ragdoll = true; f.input = newInput(); this.match.fx.text(f.cx, f.cy - 40, 'SAIU', '#94a3b8'); }
      delete this.inputs[p.pid];
    }
    this.emit('left', p, why); this.sendRoom(); this.emit('room');
  },
  sendRoom() {
    const o = {k: 'room', players: this.players.map(p => ({pid: p.pid, name: p.name, skin: p.skin, color: p.color, ping: p.ping})), opts: this.opts, phase: this.phase, code: this.code};
    for (const k in this.links) if (this.links[k].pid >= 0) this.links[k].send(o);
  },
  setOpts(o) { Object.assign(this.opts, o); if (this.role === 'host') { this.sendRoom(); this.emit('room'); } },
  bcast(o, unrel) { for (const k in this.links) { const L = this.links[k]; if (L.pid >= 0) L.send(o, unrel); } },
  canStart() { return this.role === 'host' && this.phase === 'lobby' && this.players.length >= 2; },
  // monta a configuração da partida a partir da sala
  hostStart() {
    if (!this.canStart()) return false;
    const pl = this.players.map(p => ({pid: p.pid, name: p.name, color: p.color, skin: Object.assign({}, p.skin)}));
    const used = [];
    pl.forEach(p => { while (used.includes(p.skin.color.toLowerCase())) p.skin.color = shadeHex(p.skin.color); used.push(p.skin.color.toLowerCase()); });
    const cfg = {mode: 'online', arena: this.opts.arena, format: 'stock', lives: this.opts.lives, weapons: this.opts.weapons !== false, camFx: true, players: pl, online: true};
    this.phase = 'play'; this.inputs = {};
    for (const p of pl) if (p.pid !== 0) this.inputs[p.pid] = newInput();
    this.bcast({k: 'start', cfg: {arena: cfg.arena, lives: cfg.lives, weapons: cfg.weapons, players: pl}});
    for (const k in this.links) this.links[k].cnt = {j: 0, s: 0, d: 0};
    this.emit('room'); return cfg;
  },
  attach(m) {            // chamado pela interface logo após criar a Match do host
    this.match = m; this.snapAcc = 0; this.seq = 0; this.ev = [];
    const fx = m.fx, ev = this.ev;
    const wrap = (name, code) => { const o = fx[name].bind(fx); fx[name] = (...a) => { if (ev.length < 140) ev.push([code].concat(a)); return o(...a); }; };
    wrap('burst', 'b'); wrap('ring', 'r'); wrap('text', 't'); wrap('beam', 'm'); wrap('addShake', 'k');
    const ok = m.onKill.bind(m); m.onKill = (k, v, w) => { ev.push(['kf', k ? k.id : -1, v.id]); return ok(k, v, w); };
    if (!this._sfx) { this._sfx = SFX.play; const orig = this._sfx; const self = this; SFX.play = function (n) { if (self.inSim && self.ev.length < 140) self.ev.push(['s', n]); return orig.apply(SFX, arguments); }; }
  },
  restoreSfx() { if (this._sfx) { SFX.play = this._sfx; this._sfx = null; } this.inSim = false; },
  r1(v) { return Math.round(v * 10) / 10; },
  packF(f) {
    const r = this.r1, a = [r(f.x), r(f.y), r(f.vx), r(f.vy), f.facing, f.grounded ? 1 : 0, r(f.hp), f.lives, f.alive ? 1 : 0, f.out ? 1 : 0, f.ragdoll ? 1 : 0, r(f.hitstun), r(f.invuln),
      r(f.flash), r(f.atkT), r(f.wAng), r(f.aimA), r(f.charge), r(f.beamT), f.boomN | 0, r(f.specialCd), f.kills, f.wp ? f.wp.id : '', f.wp ? (f.wp.ammo | 0) : 0, f.celebrate ? 1 : 0, f.winAnim | 0, r(f.celeT), r(f.phase), f.deaths | 0, Math.round(f.dmgDealt)];
    for (let i = 0; i < 11; i++) a.push(r(f.pts[i].x), r(f.pts[i].y));
    return a;
  },
  packSnap(m) {
    const r = this.r1, w = m.result ? (m.result.winner ? m.result.winner.id : -2) : -1;
    return {k: 's', n: ++this.seq, T: r(m.time), t: r(m.t), st: m.state, cd: r(m.cdT), g: r(m.goT), e: m.ended ? 1 : 0, tu: m.timeUp ? 1 : 0, w,
      f: m.fighters.map(f => this.packF(f)),
      i: m.items.map(i => [i.id, r(i.x), r(i.y), r(i.vx), r(i.vy), r(i.rot), r(i.life), i.grounded ? 1 : 0]),
      p: m.projs.map(p => [p.kind, r(p.x), r(p.y), r(p.vx), r(p.vy), r(p.rot || 0)]),
      b: m.bombs.map(b => [b.wid || 'grenade', r(b.x), r(b.y), r(b.vx), r(b.vy), r(b.rot), r(b.fuse)]),
      mi: m.mines.map(x => [r(x.x), r(x.y), x.armed ? 1 : 0])};
  },
  // chamado a cada quadro de render durante a partida
  tickHost(m, dt) {
    this.snapAcc += dt;
    if (this.snapAcc >= 1 / 30) {
      this.snapAcc = this.snapAcc % (1 / 30);
      this.bcast(this.packSnap(m), true);
      if (this.ev.length) { this.bcast({k: 'ev', n: this.seq, e: this.ev.splice(0)}); }
    }
  },
  hostEnd(m) {
    const res = m.result || {}, F = m.fighters;
    const rows = F.map(f => ({pid: f.netPid, name: f.name, kills: f.kills, deaths: f.deaths, dmg: Math.round(f.dmgDealt), surv: Math.round(f.surviveT), win: res.winner === f}));
    const out = {rows, winner: res.winner ? res.winner.netPid : -1, draw: !res.winner, timeUp: !!res.timeUp, time: Math.round(m.t)};
    this.phase = 'result'; this.restoreSfx(); this.match = null;
    this.bcast({k: 'end', res: out}); return out;
  },
  backToLobby() {
    if (this.role !== 'host') return;
    this.phase = 'lobby'; this.inputs = {}; this.match = null; this.restoreSfx(); this.sendRoom(); this.emit('room');
  },

  // ---------- CLIENTE
  join(code, name, skin) {
    this.reset(); code = netNormCode(code);
    if (code.length !== 6) { this.emit('error', 'Digite o código de 6 caracteres.'); return; }
    this.role = 'client'; this.phase = 'connecting'; this.code = code; this.name = netClean(name, 12) || 'JOGADOR'; this.skin = skin;
    this.setStatus('Conectando ao servidor…');
    let got = false;
    const fail = t => { if (got) return; this.fatal(t); };
    const sig = this.sig = new NetSignal(this.conf(), netRid(), {
      open: () => {
        this.setStatus('Procurando a sala ' + code + '…');
        const L = this.hostLink = new NetLink(sig, NET_PREFIX + code, true, {
          open: l => { l.send({k: 'hello', proto: NET_PROTO, name: this.name, skin: this.skin}); this.setStatus('Entrando na sala…'); },
          msg: (m, l) => this.clientMsg(m, l, () => { got = true; }),
          close: (l, why) => { if (this.role !== 'client') return; if (!got) fail('Não foi possível conectar à sala (rede bloqueada ou sala fechada).'); else this.lost('Conexão com o host perdida.'); },
        });
        L.seen = performance.now();
        L.offer().catch(() => fail('Falha ao iniciar a conexão.'));
      },
      msg: m => {
        if (m.type === 'EXPIRE') fail('Sala não encontrada. Confira o código.');
        else if (m.type === 'ANSWER' && m.payload && m.payload.sdp && this.hostLink) this.hostLink.onAnswer(m.payload.sdp).catch(() => fail('Falha na conexão.'));
        else if (m.type === 'CANDIDATE' && this.hostLink && m.payload && m.payload.candidate) this.hostLink.onCand(m.payload.candidate);
        else if (m.type === 'ID-TAKEN') fail('Erro de identificação. Tente de novo.');
      },
      error: () => fail('Não foi possível conectar ao servidor de sinalização.'),
      close: was => { if (!was) fail('Não foi possível conectar ao servidor de sinalização.'); },
    });
    clearTimeout(this._to); this._to = setTimeout(() => fail('Tempo esgotado: a sala não respondeu.'), 14000);
    sig.connect();
  },
  clientMsg(m, L, gotCb) {
    L.seen = performance.now();
    switch (m.k) {
      case 'wel': gotCb(); clearTimeout(this._to); this.pid = m.pid; this.phase = 'lobby'; this.setStatus('Conectado à sala ' + this.code); if (this.sig) { /* sinalização não é mais necessária */ this.sig.close(); }
        clearInterval(this._iv); this._iv = setInterval(() => this.clientWatch(), 1000); break;
      case 'rej': gotCb(); this.fatal(m.why || 'Entrada recusada.'); break;
      case 'room': {
        this.players = (m.players || []).map(p => ({pid: p.pid, name: netClean(p.name, 12), skin: netSkin(p.skin, p.pid), color: NET_HEX.test(p.color) ? p.color : NET_COLORS[p.pid & 3], ping: p.ping | 0}));
        this.opts = Object.assign({}, this.opts, m.opts || {});
        if (m.phase === 'lobby' && (this.phase === 'result' || this.phase === 'lobby')) this.phase = 'lobby';
        this.emit('room'); break;
      }
      case 'start': {
        const c = m.cfg || {}; this.phase = 'play';
        const pl = (c.players || []).slice(0, NET_MAX).map(p => ({pid: p.pid | 0, name: netClean(p.name, 12), color: NET_HEX.test(p.color) ? p.color : NET_COLORS[p.pid & 3], skin: netSkin(p.skin, p.pid & 3)}));
        this.snap = null; this.ev = [];
        this.emit('start', {mode: 'online', arena: ARENAS[c.arena] ? c.arena : 'neon', format: 'stock', lives: Math.max(1, Math.min(10, c.lives | 0 || 3)), weapons: c.weapons !== false, camFx: true, players: pl, online: true, client: true});
        break;
      }
      case 's': if (this.phase === 'play' && (!this.snap || m.n > this.snap.n)) { m._at = performance.now(); this.snap = m; this.snapNew = true; } break;
      case 'ev': if (this.phase === 'play') this.evq = (this.evq || []).concat(m.e || []); break;
      case 'end': this.phase = 'result'; this.emit('end', m.res); break;
      case 'pn': this.ping = Math.round(performance.now() - m.t); break;
      case 'closed': this.lost(m.why || 'O host encerrou a sala.'); break;
    }
  },
  clientWatch() {
    if (this.role !== 'client') return;
    if (performance.now() - this.hostLink.seen > 7000) { this.lost('Conexão com o host perdida.'); return; }
    this.hostLink.send({k: 'pg', t: performance.now(), p: this.ping}, true);
  },
  // envia os controles do jogador local (cliente → host)
  tickClient(inp, dt) {
    this.inAcc = (this.inAcc || 0) + dt;
    const c = this.cnt || (this.cnt = {j: 0, s: 0, d: 0});
    if (inp.jumpP) { c.j++; inp.jumpP = false; } if (inp.spP) { c.s++; inp.spP = false; } if (inp.dropP) { c.d++; inp.dropP = false; } inp.awkP = false;
    if (this.inAcc < 0.025) return; this.inAcc = 0;
    this.hostLink.send({k: 'in', mx: inp.mx, my: inp.my, face: inp.face, aimX: inp.aimX, aimY: inp.aimY, jh: inp.jumpH ? 1 : 0, ah: inp.atkH ? 1 : 0, j: c.j, s: c.s, d: c.d}, true);
  },
  // ---------- saída
  leave(silent) {
    if (this.role === 'host') this.bcast({k: 'closed', why: 'O host encerrou a sala.'});
    else if (this.role === 'client' && this.hostLink) this.hostLink.send({k: 'bye'});
    const had = this.role;
    setTimeout(() => {}, 0);
    this.reset(); if (!silent && had) this.emit('left-room');
  },
  fatal(msg) { if (!this.role) return; const r = this.role; this.reset(); this.emit('error', msg, r); },
  lost(msg) { if (!this.role) return; this.reset(); this.emit('lost', msg); },
};
window.addEventListener('pagehide', () => { if (Net.role) { try { Net.leave(true); } catch (e) {} } });

// ---------------------------------------------------------------- cliente: partida espelhada
Match.prototype.updateNetClient = function (dt) {
  const net = Net, s = net.snap, F = this.fighters;
  this.fx.update(dt);
  { const q = net.evq; if (q && q.length) { net.evq = []; for (const e of q) this.applyEv(e); } }
  if (s) {
    if (net.snapNew) { net.snapNew = false; this.applySnap(s); }
    const el = Math.min(0.12, (performance.now() - s._at) / 1000);
    this.time = s.T + el; this.t = s.t + (s.st === 'play' ? el : 0);
  } else this.time += dt;
  const k = 1 - Math.exp(-dt * 24);
  for (const f of F) {
    const g = f._tg; if (g) {
      if (Math.abs(g[0] - f.x) + Math.abs(g[1] - f.y) > 220) { f.x = g[0]; f.y = g[1]; for (let i = 0; i < 11; i++) { f.pts[i].x = g[30 + i * 2]; f.pts[i].y = g[31 + i * 2]; } if (f.capeDef()) f.capeReset(); }
      else {
        f.x += (g[0] - f.x) * k; f.y += (g[1] - f.y) * k;
        for (let i = 0; i < 11; i++) { const p = f.pts[i]; p.x += (g[30 + i * 2] - p.x) * k; p.y += (g[31 + i * 2] - p.y) * k; }
      }
    }
    for (let i = 0; i < 11; i++) { f.pts[i].px = f.pts[i].x; f.pts[i].py = f.pts[i].y; }
    if (f.alive || f.ragdoll) f.capeStep(dt);
  }
  // plataformas móveis e zaps (determinísticos pelo tempo)
  for (const p of this.plats) {
    if (!p.move) continue; const ox = p.x, oy = p.y, mv = p.move;
    p.x = p.bx + Math.sin(this.time * mv.spd + mv.ph) * mv.ax; p.y = p.by + Math.sin(this.time * mv.spd + mv.ph) * mv.ay; p.dx = p.x - ox; p.dy = p.y - oy;
  }
  if (this.arena.zaps) for (const z of this.arena.zaps) { const ph = this.time % z.period, on = ph > z.period - z.on; z.active = on; z.warn = !on && ph > z.period - z.on - 1.0; }
  // extrapolação dos objetos entre snapshots
  for (const a of [this.items, this.projs, this.bombs]) for (const o of a) { o.x += o.vx * dt; o.y += o.vy * dt; if (o.rot !== undefined && o.vr) o.rot += o.vr * dt; }
  for (const b of this.bombs) { b.fuse -= dt; if (Math.random() < 0.3) this.fx.add(b.x, b.y - 8, rnd(-20, 20), -30, 0.25, 2, '#fbbf24', 0, 0); }
  for (const p of this.projs) {
    if (p.kind === 'rocket') { this.fx.add(p.x, p.y, rnd(-30, 30), rnd(-30, 30), 0.4, 5, '#999', 0, 1); this.fx.add(p.x, p.y, 0, 0, 0.15, 4, '#ffb347', 0, 0); }
    else if (p.kind === 'orb') this.fx.add(p.x, p.y, rnd(-20, 20), rnd(-20, 20), 0.3, 5, '#a78bfa', 0, 0);
    else if (p.kind === 'fire') this.fx.add(p.x, p.y, rnd(-30, 30), -60, 0.35, 6, '#ff7a1a', 0, 0);
    else if (p.kind === 'bullet') this.fx.add(p.x, p.y, 0, 0, 0.08, 2, '#fff3b0', 0, 0);
    else if (p.kind === 'boomerang') p.rot += dt * 22;
  }
  if (this.ended) this.endT += dt;
};
Match.prototype.applySnap = function (s) {
  this.state = s.st; this.cdT = s.cd; this.goT = s.g; this.frozen = s.st === 'countdown';
  const wasEnded = this.ended; this.ended = !!s.e; this.timeUp = !!s.tu;
  if (this.ended && !wasEnded) { this.timeScale = 1; }
  if (s.cd !== undefined) { const n = Math.ceil(s.cd); if (s.st === 'countdown' && n !== this.lastN) { this.lastN = n; if (n > 0) SFX.play('count'); } }
  if (this._lastSt === 'countdown' && s.st === 'play') SFX.play('go');
  this._lastSt = s.st;
  const F = this.fighters;
  s.f.forEach((a, i) => {
    const f = F[i]; if (!f) return;
    const first = !f._tg; f._tg = a;
    f.vx = a[2]; f.vy = a[3]; f.facing = a[4]; f.grounded = !!a[5]; f.hp = a[6]; f.lives = a[7]; f.alive = !!a[8]; f.out = !!a[9]; f.ragdoll = !!a[10]; f.hitstun = a[11]; f.invuln = a[12];
    f.flash = a[13]; f.atkT = a[14]; f.wAng = a[15]; f.aimA = a[16]; f.charge = a[17]; f.beamT = a[18]; f.boomN = a[19]; f.specialCd = a[20]; f.kills = a[21];
    f.wp = a[22] ? {id: a[22], ammo: a[23], uses: 0} : null; f.celebrate = !!a[24]; f.winAnim = a[25]; f.celeT = a[26]; f.phase = a[27]; f.deaths = a[28]; f.dmgDealt = a[29];
    f.stun = f.ragdoll ? 1 : 0; f.aimOn = false;
    if (first) { f.x = a[0]; f.y = a[1]; for (let j = 0; j < 11; j++) { f.pts[j].x = f.pts[j].px = a[30 + j * 2]; f.pts[j].y = f.pts[j].py = a[31 + j * 2]; } f.capeReset(); }
  });
  if (s.e) { const w = s.w >= 0 ? F[s.w] : null; this.result = {winner: w || null, time: s.t, draw: s.w === -2, timeUp: !!s.tu}; }
  this.items = s.i.map(a => ({id: a[0], x: a[1], y: a[2], vx: a[3], vy: a[4], rot: a[5], vr: 0, life: a[6], grounded: !!a[7]}));
  this.projs = s.p.map(a => ({kind: a[0], x: a[1], y: a[2], vx: a[3], vy: a[4], rot: a[5]}));
  this.bombs = s.b.map(a => ({wid: a[0], x: a[1], y: a[2], vx: a[3], vy: a[4], rot: a[5], fuse: a[6]}));
  this.mines = s.mi.map(a => ({x: a[0], y: a[1], armed: !!a[2]}));
};
Match.prototype.applyEv = function (e) {
  const fx = this.fx;
  switch (e[0]) {
    case 'b': fx.burst(e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11]); break;
    case 'r': fx.ring(e[1], e[2], e[3], e[4], e[5], e[6]); break;
    case 't': fx.text(e[1], e[2], e[3], e[4]); break;
    case 'm': fx.beam(e[1], e[2], e[3], e[4], e[5], e[6]); break;
    case 'k': fx.addShake(e[1]); break;
    case 's': SFX.play(e[1]); break;
    case 'kf': { const k = this.fighters[e[1]], v = this.fighters[e[2]]; if (v) this.onKill(k || null, v); break; }
  }
};

'use strict';
/* STICK MAYHEM — aplicação: menus, controles, laço principal, progressão */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
$$('[data-i]').forEach(e => { e.outerHTML = ico(e.dataset.i); });
const SAVE_KEY = 'stickmayhem_v1';

// ---------- salvamento ----------
const RULES0 = {score: 'none', cRounds: 3, lives: 3, cLives: 4, time: 0, cTime: 90, awk: false, charge: 'normal', dmg: 'normal', weapons: true, fx: true, fatality: false};
const KEYS0 = {
  p1: {l: 'KeyA', r: 'KeyD', u: 'KeyW', d: 'KeyS', atk: 'KeyF', sp: 'KeyG', awk: 'KeyR', drop: 'KeyH'},
  p2: {l: 'ArrowLeft', r: 'ArrowRight', u: 'ArrowUp', d: 'ArrowDown', atk: 'KeyK', sp: 'KeyL', awk: 'KeyO', drop: 'KeyI'},
};
const KEY_ACT = [['l', 'Esquerda'], ['r', 'Direita'], ['u', 'Pular'], ['d', 'Baixo / descer'], ['atk', 'Ataque'], ['sp', 'Especial'], ['awk', 'AWAKENING'], ['drop', 'Largar arma']];
function defaults() {
  return {coins: 0, owned: {}, eq: Object.assign({}, COSM_DEFAULT), eq2: Object.assign({}, COSM_DEFAULT_P2),
    rules: {duel: Object.assign({}, RULES0, {awk: true})},
    keys: {p1: Object.assign({}, KEYS0.p1), p2: Object.assign({}, KEYS0.p2)},
    set: {music: 0.6, sfx: 0.8, quality: 1, cs: 1, co: 0.75, shake: true, haptic: true, mirror: false},
    stats: {matches: 0, wins: 0, losses: 0, kills: 0, deaths: 0, dmg: 0, time: 0, duelWins: 0, fatalities: 0, chaosPlayed: 0, bestSurvive: 0, weaponKills: {}},
    ch: {prog: {}, done: {}}, sel: {mode: 'duel_cpu', diff: 1, format: 'elim', arena: 'neon', awkFmt: 'cpu'},
    net: {name: '', host: '', port: '', path: '', secure: true, arena: 'neon', lives: 3, weapons: true}};
}
function merge(a, b) {
  if (!b || typeof b !== 'object') return a;
  for (const k in a) if (k in b) { if (a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])) a[k] = merge(a[k], b[k]); else a[k] = b[k]; }
  for (const k in b) if (!(k in a) && (k === 'weaponKills')) a[k] = b[k];
  return a;
}
let save = defaults();
try { const d = JSON.parse(localStorage.getItem(SAVE_KEY)); save = merge(defaults(), d); if (d && d.stats && d.stats.weaponKills) save.stats.weaponKills = d.stats.weaponKills; if (d && d.owned) save.owned = d.owned; if (d && d.ch) save.ch = merge(save.ch, d.ch); if (d && d.ch && d.ch.prog) save.ch.prog = d.ch.prog; if (d && d.ch && d.ch.done) save.ch.done = d.ch.done; } catch (e) {}
if (save.set.quality > 1) save.set.quality = 1;
for (const q of [save.eq, save.eq2]) if (q) { if (q.acc === 'cape') { q.acc = 'none'; q.cape = 'classic'; } if (!q.cape) q.cape = 'none'; if (!q.fat || !FATS[q.fat]) q.fat = 'iron'; if (!WIN_IDS.includes(q.win)) q.win = 'wave'; }
if (save.owned && save.owned['acc:cape']) { save.owned['cape:classic'] = true; delete save.owned['acc:cape']; }
if (save.sel.mode === 'awk') save.sel.mode = save.sel.awkFmt === 'local' ? 'duel_local' : 'duel_cpu'; // modo AWAKENING removido: o poder vive nos duelos
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }

// ---------- utilidades ----------
let toastT = 0;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }
function buzz(ms) { if (save.set.haptic && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {} }
function mySkinBase(p) {
  const e = p ? save.eq2 : save.eq;
  return {color: cosmVal('color', e.color) || (p ? '#ef4444' : '#3b82f6'), accent: cosmVal('accent', e.accent) || '#22d3ee', hat: e.hat, mask: e.mask, glasses: e.glasses, cape: e.cape || 'none', acc: e.acc === 'cape' ? 'none' : e.acc, deco: '', clothes: e.clothes, fx: e.fx, win: e.win, awk: AWK_TYPES[e.awk] ? e.awk : 'void'};
}
// skin final: se uma skin pronta (comprada) está equipada, ela substitui as peças avulsas; AWAKENING e dança de vitória continuam do jogador
function skinPreset(id) { const k = SKINS[id]; return k && k.preset ? Object.assign({style: k.style || '', cape: 'none', deco: ''}, k.preset) : null; }
function mySkin(p) {
  const base = mySkinBase(p), e = p ? save.eq2 : save.eq, pr = e.skin && e.skin !== 'none' && owned('skin', e.skin) ? skinPreset(e.skin) : null;
  return pr ? Object.assign(base, pr) : base;
}
function owned(cat, id) { const it = COSM[cat].list.find(x => x[0] === id); return !it || it[2] === 0 || !!save.owned[cat + ':' + id]; }
function updCoins() { $('#coins-menu').textContent = save.coins; $$('.coins-val').forEach(e => e.textContent = save.coins); }

// ---------- visão / canvas ----------
const cv = $('#cv'), ctx = cv.getContext('2d', {alpha: false});
let view = {scale: 1, ox: 0, oy: 0, q: 1, pxScale: 1};
function qFactor() { return save.set.quality ? 1 : 0.6; }
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2), q = qFactor() * dpr;
  const cw = window.innerWidth, ch = window.innerHeight;
  cv.width = Math.max(2, Math.round(cw * q)); cv.height = Math.max(2, Math.round(ch * q));
  const scale = Math.min(cw / WORLD_W, ch / WORLD_H);
  view = {scale, ox: (cw - WORLD_W * scale) / 2, oy: (ch - WORLD_H * scale) / 2, q, pxScale: scale * q};
  checkOrientation();
}
function checkOrientation() {
  const portrait = window.innerHeight > window.innerWidth * 1.05;
  $('#rotate').classList.toggle('hidden', !portrait);
  if (portrait && app.state === 'game') pauseGame();
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 200));

// ---------- tela cheia ----------
function isFS() { return document.fullscreenElement || document.webkitFullscreenElement; }
function toggleFS() {
  const el = document.documentElement;
  if (!isFS()) {
    const r = el.requestFullscreen || el.webkitRequestFullscreen;
    if (r) {
      Promise.resolve(r.call(el)).then(lockLandscape).catch(() => toast('Tela cheia não permitida neste navegador. Use o menu do navegador > "Adicionar à tela inicial".'));
    } else toast('Tela cheia indisponível aqui. No iPhone: Compartilhar > Adicionar à Tela de Início.');
  } else { const x = document.exitFullscreen || document.webkitExitFullscreen; if (x) x.call(document); }
}
function lockLandscape() {
  try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => toast('Gire o aparelho manualmente para paisagem.')); } catch (e) {}
}
$('#btn-fs').onclick = () => { SFX.resume(); toggleFS(); };
$('#rot-fs').onclick = () => { toggleFS(); };
$('#btn-mute').onclick = () => { SFX.resume(); SFX.S.muted = !SFX.S.muted; SFX.apply(); $('#btn-mute').innerHTML = ico(SFX.S.muted ? 'mute' : 'vol'); };

// ---------- controles ----------
const Controls = {
  inputs: [newInput(), newInput()],
  T: [{mx: 0, my: 0, jump: 0, atk: 0, sp: 0, drop: 0, awk: 0}, {mx: 0, my: 0, jump: 0, atk: 0, sp: 0, drop: 0, awk: 0}],
  keys: {}, mode: 'none', maps: [],
  // mapas de teclado montados a partir das teclas configuradas (save.keys)
  buildMaps(m) {
    const a = x => [x];
    const k1 = save.keys.p1, k2 = save.keys.p2;
    const mk = k => ({l: a(k.l), r: a(k.r), u: a(k.u), d: a(k.d), atk: a(k.atk), sp: a(k.sp), awk: a(k.awk), drop: a(k.drop)});
    if (m === 'local') return [mk(k1), mk(k2)];
    if (m === 'single') {
      // um jogador: teclas do P1 + alternativas (setas, K/L/O, espaço) para quem joga só no teclado
      const p = mk(k1), q = mk(k2), add = (x, y) => { y.forEach(c => { if (!x.includes(c)) x.push(c); }); };
      ['l', 'r', 'u', 'd', 'atk', 'sp', 'awk', 'drop'].forEach(n => add(p[n], q[n]));
      add(p.u, ['Space']);
      return [p];
    }
    return [];
  },
  setMode(m) {
    this.mode = m; this.maps = this.buildMaps(m);
    document.body.classList.remove('m-single', 'm-local');
    if (m === 'single') document.body.classList.add('m-single');
    if (m === 'local') document.body.classList.add('m-local');
    this.reset();
  },
  reset() {
    for (let s = 0; s < 2; s++) { const T = this.T[s]; T.mx = T.my = T.jump = T.atk = T.sp = T.drop = T.awk = 0; Object.assign(this.inputs[s], newInput()); }
    $$('.cb.down').forEach(b => b.classList.remove('down'));
    $$('.joyzone').forEach(z => { z.classList.remove('active'); z._pid = null; });
    this.keys = {};
  },
  poll() {
    const G = GP.poll(this);
    const maps = this.maps;
    for (let s = 0; s < 2; s++) {
      const I = this.inputs[s], T = this.T[s], mp = maps[s], K = this.keys;
      let kx = 0, ky = 0, kj = false, ka = false;
      if (mp) {
        const any = a => a.some(c => K[c]);
        kx = (any(mp.r) ? 1 : 0) - (any(mp.l) ? 1 : 0); ky = any(mp.d) ? 1 : 0; kj = any(mp.u); ka = any(mp.atk);
      }
      const g = G[s] || {mx: 0, my: 0, jump: false, atk: false, ax: 0, ay: 0};
      I.aimX = g.ax; I.aimY = g.ay;
      I.mx = T.mx || kx || g.mx; I.my = T.my || ky || g.my; I.jumpH = !!(T.jump || kj || g.jump); I.atkH = !!(T.atk || ka || g.atk);
    }
  },
  keyEdge(code, down) {
    this.maps.forEach((mp, s) => {
      const I = this.inputs[s];
      if (down) { if (mp.u.includes(code)) I.jumpP = true; if (mp.sp.includes(code)) I.spP = true; if (mp.drop.includes(code)) I.dropP = true; if (mp.awk.includes(code)) I.awkP = true; }
    });
  },
  isGameKey(code) { return this.maps.some(mp => Object.keys(mp).some(k => mp[k].includes(code))); },
  init() {
    $$('.joyzone').forEach(z => {
      const s = +z.dataset.s, base = z.querySelector('.joybase'), knob = z.querySelector('.joyknob');
      const R = () => base.offsetWidth / 2 || 60;
      z.addEventListener('pointerdown', e => {
        if (z._pid != null) return; if (e.pointerType !== 'touch' && document.body.classList.contains('kb')) return;
        e.preventDefault(); SFX.resume(); touchUsed();
        z._pid = e.pointerId; try { z.setPointerCapture(e.pointerId); } catch (x) {}
        const r = z.getBoundingClientRect(); z._ox = e.clientX; z._oy = e.clientY;
        const rr = R(); const lx = clamp(e.clientX - r.left, rr, r.width - rr), ly = clamp(e.clientY - r.top, rr, r.height - rr);
        z._ox = r.left + lx; z._oy = r.top + ly;
        base.style.left = lx + 'px'; base.style.top = ly + 'px'; knob.style.transform = 'translate(0,0)'; z.classList.add('active');
      });
      z.addEventListener('pointermove', e => {
        if (e.pointerId !== z._pid) return; e.preventDefault();
        let dx = e.clientX - z._ox, dy = e.clientY - z._oy; const rr = R(), l = Math.hypot(dx, dy);
        if (l > rr) { dx = dx / l * rr; dy = dy / l * rr; }
        knob.style.transform = `translate(${dx}px,${dy}px)`;
        const vx = dx / rr, vy = dy / rr, T = this.T[s];
        T.mx = Math.abs(vx) < 0.16 ? 0 : clamp(vx * 1.25, -1, 1);
        T.my = Math.abs(vy) < 0.3 ? 0 : clamp(vy * 1.15, -1, 1);
      });
      const end = e => { if (e.pointerId !== z._pid) return; z._pid = null; z.classList.remove('active'); this.T[s].mx = 0; this.T[s].my = 0; };
      z.addEventListener('pointerup', end); z.addEventListener('pointercancel', end); z.addEventListener('lostpointercapture', end);
    });
    $$('.cb').forEach(b => {
      const s = +b.dataset.s, a = b.dataset.a;
      b.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'touch' && document.body.classList.contains('kb')) return;
        e.preventDefault(); SFX.resume(); touchUsed(); try { b.setPointerCapture(e.pointerId); } catch (x) {}
        b._pid = e.pointerId; this.T[s][a] = 1; b.classList.add('down'); buzz(a === 'atk' ? 12 : 8);
        const I = this.inputs[s];
        if (a === 'jump') I.jumpP = true; else if (a === 'sp') I.spP = true; else if (a === 'drop') I.dropP = true;
        else if (a === 'awk') { I.awkP = true; const f = app.scene && app.scene.fighters && app.scene.fighters.find(x => x.slot === s); if (f && !f.canAwk()) { b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); } }
      });
      const up = e => { if (b._pid !== e.pointerId) return; b._pid = null; this.T[s][a] = 0; b.classList.remove('down'); };
      b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('lostpointercapture', up);
    });
    window.addEventListener('keydown', e => {
      if (rebind.active) return;
      const st = app.state;
      if (e.code === 'Escape' || (e.code === 'KeyP' && (st === 'game' || st === 'paused'))) {
        e.preventDefault();
        if (st === 'game') pauseGame(); else if (st === 'paused') resumeGame(); else menuKey(e);
        return;
      }
      if (st === 'fatality') { e.preventDefault(); return; }
      if (st === 'victory' && app.vic && app.vic.local) {          // local: só as teclas do vencedor valem
        const k = save.keys[app.vic.winner.slot === 1 ? 'p2' : 'p1']; e.preventDefault();
        if (e.code === k.atk) startFatality(); else if (e.code === k.sp) skipFatality();
        return;
      }
      if (st !== 'game') { menuKey(e); return; }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab'].includes(e.code)) e.preventDefault();
      if (e.repeat) return;
      if (this.isGameKey(e.code)) { document.body.classList.add('kb'); this.keys[e.code] = true; this.keyEdge(e.code, true); }
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });
    window.addEventListener('blur', () => { this.keys = {}; if (app.state === 'game') pauseGame(); });
  },
};
function touchUsed() { document.body.classList.remove('kb'); }
document.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') touchUsed(); }, true);
// navegação por teclado nos menus (setas, Enter, Esc) — nunca dispara ataques
function menuKey(e) {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].indexOf(e.code) < 0) return;
  if (e.target && e.target.tagName === 'INPUT' && e.target.type !== 'range') return;
  e.preventDefault();
  GP.on = true;
  const ed = (x, y, a, b) => ({r: {x, y}, press: k => (k === 'a' && a) || (k === 'bb' && b)});
  const dx = e.code === 'ArrowRight' ? 1 : e.code === 'ArrowLeft' ? -1 : 0, dy = e.code === 'ArrowDown' ? 1 : e.code === 'ArrowUp' ? -1 : 0;
  GP.nav([ed(dx, dy, e.code === 'Enter', e.code === 'Escape')]);
  GP.nav([ed(0, 0, false, false)]); // zera a repetição
}
const rebind = {active: null};
Controls.init();

// ---------- gamepad (Gamepad API) ----------
// Jogo: P1 = 1º controle, P2 = 2º controle (duelo local). Menus: direcional/analógico + A confirma, B volta, Start pausa.
const GP = {
  prev: [], on: false, focus: null, last: {x: 0, y: 0}, hold: 0, dirKey: '', screen: null, names: [],
  list() { try { return Array.from(navigator.getGamepads ? navigator.getGamepads() : []).filter(p => p && p.connected); } catch (e) { return []; } },
  read(p) {
    const b = i => !!(p.buttons[i] && (p.buttons[i].pressed || p.buttons[i].value > 0.5));
    let x = p.axes[0] || 0, y = p.axes[1] || 0;
    if (Math.abs(x) < 0.22) x = 0; if (Math.abs(y) < 0.22) y = 0;
    const dl = b(14), dr = b(15), du = b(12), dd = b(13);
    if (dl || dr) x = dr ? 1 : -1;
    if (du || dd) y = dd ? 1 : -1;
    let rx = p.axes[2] || 0, ry = p.axes[3] || 0; const rm = Math.hypot(rx, ry);
    if (rm < 0.35) { rx = 0; ry = 0; } else { rx /= rm; ry /= rm; }
    return {rx, ry, x, y, up: du, down: dd, a: b(0), bb: b(1), atk: b(2) || b(5) || b(7), sp: b(1) || b(4) || b(6), drop: b(3), jump: b(0) || du, start: b(9), awk: b(8) || b(10) || b(11)};
  },
  // atualiza o estado de cada slot de jogador; devolve true se algum controle foi usado
  poll(ctl) {
    const pads = this.list(); this.names = pads.map(p => p.id); const wasOn = this.on;
    const out = [null, null];
    const gameMode = ctl.mode === 'local' ? 2 : (ctl.mode === 'single' ? 1 : 0);
    const edges = [];
    pads.forEach((p, i) => {
      const r = this.read(p), pv = this.prev[p.index] || {}; this.prev[p.index] = r;
      const press = k => r[k] && !pv[k];
      const used = r.rx || r.ry || r.a || r.bb || r.atk || r.sp || r.drop || r.start || r.awk || Math.abs(r.x) > 0 || Math.abs(r.y) > 0;
      if (used) this.on = true;
      edges.push({r, press, used, i});
    });
    // pausa / menus
    const st = app.state;
    edges.forEach(e => { if (e.press('start') && st === 'game') pauseGame(); else if (e.press('start') && st === 'paused') resumeGame(); });
    if (gameMode && st === 'game') {
      edges.slice(0, gameMode).forEach((e, s) => {
        const I = ctl.inputs[s];
        if (e.used) document.body.classList.add('gp' + s);
        if (e.press('jump')) I.jumpP = true;
        if (e.press('sp')) I.spP = true;
        if (e.press('drop')) I.dropP = true;
        if (e.press('awk')) I.awkP = true;
        out[s] = {mx: e.r.x, my: e.r.y > 0.5 ? 1 : 0, jump: e.r.jump, atk: e.r.atk, ax: e.r.rx, ay: e.r.ry};
      });
    } else if (st === 'fatality') { /* controles travados durante a execução */ }
    else if (st === 'victory' && app.vic && app.vic.local) {
      const e = edges[app.vic.winner.slot]; if (e) { if (e.press('a')) startFatality(); else if (e.press('bb')) skipFatality(); }
    } else if (st !== 'game' && wasOn) {
      this.nav(edges);
    }
    return out;
  },
  cands() {
    const scr = document.querySelector('.screen.active'); if (!scr) return [];
    return Array.from(scr.querySelectorAll('button:not([disabled]), .arena-chip, input[type=range]')).filter(el => { const r = el.getBoundingClientRect(); return r.width > 4 && r.height > 4 && el.offsetParent !== null; });
  },
  setFocus(el) {
    if (this.focus) this.focus.classList.remove('gp-focus');
    this.focus = el;
    if (el) { el.classList.add('gp-focus'); try { el.scrollIntoView({block: 'nearest', inline: 'nearest'}); } catch (e) {} const r = el.getBoundingClientRect(); this.last = {x: r.left + r.width / 2, y: r.top + r.height / 2}; }
  },
  nav(edges) {
    if (!this.on) return;
    const scr = document.querySelector('.screen.active'); if (!scr) return;
    const cs = this.cands(); if (!cs.length) return;
    if (this.screen !== scr || !this.focus || !this.focus.isConnected || !cs.includes(this.focus)) {
      let nf;
      if (this.screen === scr && this.last) { let bd = 1e9; cs.forEach(c => { const r = c.getBoundingClientRect(), d = Math.hypot(r.left + r.width / 2 - this.last.x, r.top + r.height / 2 - this.last.y); if (d < bd) { bd = d; nf = c; } }); }
      else nf = scr.querySelector('.primary') || scr.querySelector('.sel') || cs[0];
      this.screen = scr; this.setFocus(cs.includes(nf) ? nf : cs[0]);
    }
    let dx = 0, dy = 0, pressA = false, pressB = false;
    edges.forEach(e => { if (Math.abs(e.r.x) > 0.5) dx = Math.sign(e.r.x); if (Math.abs(e.r.y) > 0.5) dy = Math.sign(e.r.y); if (e.press('a')) pressA = true; if (e.press('bb')) pressB = true; });
    const key = dx + ',' + dy, now = performance.now();
    let step = false;
    if (key === '0,0') { this.dirKey = ''; } else if (key !== this.dirKey) { this.dirKey = key; this.hold = now + 380; step = true; } else if (now > this.hold) { this.hold = now + 120; step = true; }
    const f = this.focus;
    if (step) {
      if (f.type === 'range' && dx) {
        const st = +f.step || 1, v = Math.min(+f.max, Math.max(+f.min, +f.value + dx * st * (+f.max - +f.min > 5 ? 1 : 2)));
        f.value = v; f.dispatchEvent(new Event('input', {bubbles: true})); f.dispatchEvent(new Event('change', {bubbles: true}));
      } else {
        const fr = f.getBoundingClientRect(), cx = fr.left + fr.width / 2, cy = fr.top + fr.height / 2;
        let best = null, bs = 1e9;
        cs.forEach(c => {
          if (c === f) return; const r = c.getBoundingClientRect(), ox = r.left + r.width / 2 - cx, oy = r.top + r.height / 2 - cy;
          let main, cross;
          if (dx) { main = ox * dx; cross = Math.abs(oy); } else { main = oy * dy; cross = Math.abs(ox); }
          if (!(dx ? Math.abs(oy) <= Math.abs(ox) * 1.6 + 30 : Math.abs(ox) <= Math.abs(oy) * 1.6 + 30)) { if (main <= 4) return; }
          if (main <= 4) return;
          const sc = main + cross * 2.2; if (sc < bs) { bs = sc; best = c; }
        });
        if (best) { this.setFocus(best); SFX.play('select'); }
      }
    }
    if (pressA && f && f.type !== 'range') { SFX.resume(); f.click(); if (!(f.isConnected)) this.last = this.last; }
    if (pressB) {
      const id = scr.id;
      if (id === 's-pause') resumeGame();
      else { const bk = scr.querySelector('.back') || scr.querySelector('#set-back'); if (bk) bk.click(); }
    }
  },
};
window.addEventListener('gamepadconnected', e => { GP.on = true; toast('Controle conectado'); });
window.addEventListener('gamepaddisconnected', () => { document.body.classList.remove('gp0', 'gp1'); toast('Controle desconectado'); if (app.state === 'game') pauseGame(); });
document.addEventListener('pointerdown', e => { GP.on = false; if (GP.focus) { GP.focus.classList.remove('gp-focus'); GP.focus = null; } if (e.pointerType === 'touch') document.body.classList.remove('gp0', 'gp1'); }, true);
['gesturestart', 'gesturechange', 'dblclick', 'contextmenu'].forEach(ev => document.addEventListener(ev, e => e.preventDefault()));

// ---------- estado da aplicação ----------
const app = {state: 'menu', scene: null, game: null, last: 0, acc: 0, t: 0, fps: 60, endReal: 0, prev: null, settingsFrom: 'menu'};

function newMenuScene() {
  const pool = ARENA_IDS.filter(a => a !== 'training');
  app.scene = new Match({mode: 'menu', arena: pick(pool), format: 'stock', lives: 999}, {skin: mySkin(), shake: false, fxMax: save.set.quality ? 200 : 80});
}
function showScreen(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  if (id) $('#s-' + id).classList.add('active');
}
function go(id) {
  SFX.resume(); SFX.play('click');
  if (app.state === 'menu' || app.state === 'result') { SFX.music('menu'); }
  showScreen(id);
  if (id === 'play') buildPlay();
  if (id === 'config') buildConfig();
  if (id === 'custom') buildCustom();
  if (id === 'weapons') buildWeapons();
  if (id === 'arenas') buildArenas();
  if (id === 'settings') { app.settingsFrom = 'menu'; setTab = 'geral'; buildSettings(); }
  if (id === 'stats') buildStats();
  if (id === 'online') onlineOpen();
  if (id === 'menu') updCoins();
  updCoins();
  app.inCustom = id === 'custom';
}
$$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
document.addEventListener('pointerdown', () => { SFX.resume(); if (app.state === 'menu' || app.state === 'result') SFX.music('menu'); }, {once: false, passive: true});

// ---------- tela de seleção de modo ----------
const DIFF_NAMES = ['Fácil', 'Normal', 'Difícil'];
function chips(el, items, cur, cb) {
  el.innerHTML = '';
  items.forEach(it => { const b = document.createElement('button'); b.className = 'chip' + (it[0] === cur ? ' sel' : ''); b.textContent = it[1]; b.onclick = () => { SFX.play('select'); cb(it[0]); }; el.appendChild(b); });
}
function buildPlay() {
  const sel = save.sel;
  $$('.mode-card').forEach(c => { c.classList.toggle('sel', c.dataset.mode === sel.mode); c.onclick = () => { SFX.play('select'); sel.mode = c.dataset.mode; persist(); buildPlay(); }; });
  $('#opt-diff-row').style.display = sel.mode === 'chaos' ? 'flex' : 'none';
  $('#opt-format-row').style.display = sel.mode === 'chaos' ? 'flex' : 'none';
  chips($('#opt-diff'), DIFF_NAMES.map((n, i) => [i, n]), sel.diff, v => { sel.diff = v; persist(); buildPlay(); });
  chips($('#opt-format'), [['elim', 'ELIMINATION'], ['stock', 'STOCK BATTLE (3 vidas)']], sel.format, v => { sel.format = v; persist(); buildPlay(); });
  const ac = $('#opt-arena'); ac.innerHTML = '';
  ARENA_IDS.forEach(id => {
    const d = document.createElement('div'); d.className = 'arena-chip' + (id === sel.arena ? ' sel' : '');
    const c = document.createElement('canvas'); c.width = 160; c.height = 90; drawArenaPreview(c, ARENAS[id]); d.appendChild(c);
    const sp = document.createElement('span'); sp.textContent = ARENAS[id].name; d.appendChild(sp);
    d.onclick = () => { SFX.play('select'); sel.arena = id; persist(); buildPlay(); };
    ac.appendChild(d);
  });
  $('#arena-name').textContent = ARENAS[sel.arena].name;
  const MI = {duel_cpu: 'Depois de LUTAR você ajusta placar, vidas, tempo e o poder AWAKENING.', duel_local: 'Depois de LUTAR você ajusta placar, vidas, tempo e o poder AWAKENING. Cada jogador usa sua skin.', chaos: 'Você contra 3 bots em arena aberta, com armas caindo do céu.'};
  $('#mode-info').textContent = MI[sel.mode] + ' ' + (ARENAS[sel.arena].hazard ? 'Perigo: ' + ARENAS[sel.arena].hazard + '.' : '');
  const selEl = ac.querySelector('.sel'); if (selEl) selEl.scrollIntoView({block: 'nearest', inline: 'center'});
}
$('#btn-start').onclick = () => {
  SFX.resume(); SFX.play('go');
  if (save.sel.mode === 'chaos') startSeries(baseCfg());
  else go('config');
};

// ---------- configuração da partida 1v1 ----------
function rulesKey() { return 'duel'; }
function fmtTime(sec) { return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }
function roundTarget(R) { const n = R.score === 'custom' ? R.cRounds : +R.score; return Math.floor(n / 2) + 1; }
function baseCfg() {
  const s = save.sel;
  if (s.mode === 'chaos') return {mode: 'chaos', arena: s.arena, diff: s.diff, format: s.format, lives: 3};
  const R = save.rules[rulesKey()];
  const mode = s.mode, isAwk = !!R.awk;
  const lives = R.lives === 'custom' ? R.cLives : +R.lives;
  const time = R.time === 'custom' ? R.cTime : +R.time;
  return {mode, variant: isAwk ? 'awk' : 'duel', arena: s.arena, diff: s.diff, format: 'stock', lives, hp: isAwk ? AWK.hp : 100,
    awk: {on: !!R.awk, charge: R.charge, dmg: R.dmg}, timeLimit: time, weapons: !!R.weapons, camFx: !!R.fx,
    score: R.score, target: R.score === 'none' || R.score === 'board' ? 0 : roundTarget(R), fatality: !!R.fatality && R.score !== 'board'};
}
function buildConfig() {
  const sel = save.sel, k = rulesKey(), R = save.rules[k], b = $('#cfg-body'); b.innerHTML = '';
  const isAwk = !!R.awk, cpu = sel.mode === 'duel_cpu';
  $('#cfg-title').textContent = 'DUELO · ' + (cpu ? 'vs CPU' : 'LOCAL') + ' — CONFIGURAR';
  const rb = () => { persist(); buildConfig(); };
  const row = (label, items, key, extra, sub) => {
    const r = document.createElement('div'); r.className = 'row' + (sub ? ' sub' : ''); r.innerHTML = `<label>${label}</label><div class="chips"></div>`;
    chips(r.querySelector('.chips'), items, R[key], v => { R[key] = v; rb(); });
    if (extra) r.appendChild(extra);
    b.appendChild(r); return r;
  };
  const stepper = (key, min, max, step, fmt) => {
    const d = document.createElement('span'); d.className = 'stepper';
    d.innerHTML = `<button aria-label="menos">${ico('minus')}</button><b>${fmt(R[key])}</b><button aria-label="mais">${ico('plus')}</button>`;
    const [m, p] = d.querySelectorAll('button');
    m.onclick = () => { R[key] = Math.max(min, R[key] - step); SFX.play('select'); rb(); };
    p.onclick = () => { R[key] = Math.min(max, R[key] + step); SFX.play('select'); rb(); };
    return d;
  };
  row('Placar', [['none', 'SEM PLACAR'], ['board', 'QUADRO DE VITÓRIAS'], [3, 'MELHOR DE 3'], [5, 'MELHOR DE 5'], [7, 'MELHOR DE 7'], ['custom', 'PERSONALIZADO']], 'score', R.score === 'custom' ? stepper('cRounds', 1, 15, 2, v => 'Melhor de ' + v) : null);
  row('Vidas por rodada', [[1, '1'], [2, '2'], [3, '3'], [5, '5'], [10, '10'], ['custom', 'PERSONALIZADO']], 'lives', R.lives === 'custom' ? stepper('cLives', 1, 20, 1, v => v + ' vidas') : null);
  row('AWAKENING', [[true, 'LIGADO'], [false, 'DESLIGADO']], 'awk');
  if (R.awk) {
    row('Carga da barra', [['slow', 'LENTA'], ['normal', 'NORMAL'], ['fast', 'RÁPIDA']], 'charge', null, true);
    row('Dano AWAKENING', [['low', 'REDUZIDO'], ['normal', 'NORMAL'], ['high', 'AUMENTADO']], 'dmg', null, true);
  }
  { // FATALITY: bloqueada em partidas infinitas (quadro de vitórias não tem vencedor definitivo)
    const blocked = R.score === 'board', fr = document.createElement('div'); fr.className = 'row fat-row' + (blocked ? ' locked' : '');
    fr.innerHTML = '<label>FATALITY</label><div class="chips"></div><div class="fat-desc"></div>';
    chips(fr.querySelector('.chips'), [[true, 'ATIVADO'], [false, 'DESATIVADO']], blocked ? false : !!R.fatality, v => { if (blocked) { toast('Fatality indisponível em partidas infinitas.'); SFX.play('hit'); return; } R.fatality = v; rb(); });
    fr.querySelector('.fat-desc').textContent = blocked ? 'Bloqueado: partidas infinitas (QUADRO DE VITÓRIAS) não têm vencedor definitivo.' : 'Permite executar uma finalização especial após vencer a partida. Não pode ser alterado depois que a partida começa.';
    b.appendChild(fr);
  }
  row('Tempo', [[0, 'SEM LIMITE'], [120, '2 MIN'], [180, '3 MIN'], [300, '5 MIN'], ['custom', 'PERSONALIZADO']], 'time', R.time === 'custom' ? stepper('cTime', 30, 900, 15, fmtTime) : null);
  const ar = document.createElement('div'); ar.className = 'row'; ar.innerHTML = '<label>Arena</label><div class="chips"></div>'; b.appendChild(ar);
  chips(ar.querySelector('.chips'), ARENA_IDS.map(id => [id, ARENAS[id].name]), sel.arena, v => { sel.arena = v; rb(); });
  if (cpu) { const d = document.createElement('div'); d.className = 'row'; d.innerHTML = '<label>Nível da CPU</label><div class="chips"></div>'; b.appendChild(d); chips(d.querySelector('.chips'), DIFF_NAMES.map((n, i) => [i, n]), sel.diff, v => { sel.diff = v; rb(); }); }
  row('Armas no mapa', [[true, 'LIGADAS'], [false, 'DESLIGADAS']], 'weapons');
  row('Efeitos visuais', [[true, 'LIGADOS'], [false, 'DESLIGADOS']], 'fx');
  const ch = document.createElement('div'); ch.className = 'row';
  const nm = x => ((COSM.color.list.find(c => c[0] === save[x].color) || [0, ''])[1]) + ' · ' + AWK_TYPES[save[x].awk].short;
  ch.innerHTML = `<label>Personagens</label><span style="flex:1;font-size:.85em;opacity:.85">P1: ${nm('eq')}${cpu ? '' : ' &nbsp;|&nbsp; P2: ' + nm('eq2')}</span><button class="btn">${ico('palette')} <span>PERSONALIZAR</span></button>`;
  ch.querySelector('button').onclick = () => go('custom'); b.appendChild(ch);
  const note = document.createElement('div'); note.className = 'note';
  const hpTxt = isAwk ? 'Com AWAKENING: ' + AWK.hp + ' HP por lutador. ' : '';
  note.textContent = hpTxt + 'Placar, vidas e tempo são independentes. Se o tempo acabar: vence quem tiver mais vidas e, depois, mais vida restante; empate = rodada extra.';
  b.appendChild(note);
}
$('#btn-cfg-start').onclick = () => { SFX.resume(); SFX.play('go'); startSeries(baseCfg()); };

// ---------- personalização (v1.3.0: categorias, cards, prévias) ----------
let custTab = 'skin', custSub = 'hat', prevMatch = null, prevCelebrate = true, custP = 0, custAwk = null, custSkin = null, custFat = null, custWin = null, custFlash = 0;
const eqOf = () => custP ? save.eq2 : save.eq;
const TAB_ICO = {skin: 'crown', awk: 'awk'};
const CUST_GROUPS = [
  {id: 'skin', label: 'SKINS'}, {id: 'cape', label: 'CAPAS'},
  {id: 'acc', label: 'ACESSÓRIOS', subs: [['hat', 'Chapéus'], ['mask', 'Máscaras'], ['glasses', 'Óculos'], ['acc', 'Costas'], ['clothes', 'Roupas'], ['fx', 'Efeitos'], ['color', 'Cor do corpo'], ['accent', 'Detalhes']]},
  {id: 'awk', label: 'AWAKENINGS'}, {id: 'fat', label: 'FATALITIES'}, {id: 'win', label: 'ANIMAÇÕES DE VITÓRIA'},
];
const curCat = () => custTab === 'acc' ? custSub : custTab;
const FAT_ICO = {iron: '✊', thunder: '⚡', meteor: '☄️', shadow: '🌑', gravity: '🌀', blade: '🗡️', void: '🕳️', god: '👁️'};
const WIN_DESC = {wave: 'Um aceno simpático.', flex: 'Mostra os músculos.', dance: 'Dança animada.', hop: 'Pulinhos de alegria.', champion: 'Punhos para o alto, postura de campeão e confete dourado.', shadow: 'Braços cruzados, fumaça sombria.', thunder: 'Aponta o céu e chama raios.', cosmic: 'Flutua com estrelas orbitando.', spin: 'Gira a arma como um mestre.', burst: 'Explosões de energia em anel.', royal: 'Aceno real com brilho dourado.', mayhem: 'Pulos, confete arco-íris e o M da MayhemGames.'};
function rarBadge(price) { const r = rarOf(price || 0), sp = document.createElement('em'); sp.className = 'rar'; sp.textContent = r.toUpperCase(); sp.style.setProperty('--rc', RAR_COL[r]); return sp; }
function drawThumb(c, skinObj) {
  if (!prevMatch) prevMatch = new Match({mode: 'preview', arena: 'training'}, {skin: mySkin(0), shake: false});
  const f = prevMatch.fighters[0], g = c.getContext('2d');
  f.skin = Object.assign({}, skinObj); f.celebrate = false; for (let i = 0; i < 40; i++) prevMatch.update(DT);
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height);
  const sc = c.height / 150; g.setTransform(sc, 0, 0, sc, c.width / 2 - f.x * sc, c.height - 8 - 603 * sc);
  g.fillStyle = 'rgba(255,255,255,0.15)'; g.beginPath(); g.ellipse(f.x, 602, 34, 6, 0, 0, 6.283); g.fill();
  drawFighter(g, f, 0, false); g.setTransform(1, 0, 0, 1, 0, 0);
}
// compra/equipa (mesma economia de sempre): devolve true se equipou
function custEquip(cat, id, name, price, after) {
  const eq = eqOf();
  if (!owned(cat, id)) {
    if (save.coins < price) { toast('Moedas insuficientes (' + save.coins + '/' + price + '). Jogue partidas e complete desafios!'); SFX.play('hit'); return false; }
    save.coins -= price; save.owned[cat + ':' + id] = true; SFX.play('buy'); toast('Desbloqueado: ' + name);
  } else SFX.play('select');
  eq[cat] = id; if (cat !== 'win' && cat !== 'awk' && cat !== 'fat' && cat !== 'skin') eq.skin = 'none';
  custFlash = 0.5; persist(); updCoins(); if (after) after(); buildCustom(); return true;
}
function actBtn(cat, id, name, price, eqd, own, word) {
  const act = document.createElement('button'); act.className = 'btn' + (eqd ? '' : own ? ' primary' : '');
  if (eqd) { act.innerHTML = ico('check') + ' <span>EQUIPAD' + word + '</span>'; act.disabled = true; }
  else if (own) act.innerHTML = '<span>EQUIPAR</span>';
  else act.innerHTML = ico('lock') + ico('coin') + ' <span>' + price + '</span>';
  act.onclick = e => { e.stopPropagation(); custEquip(cat, id, name, price); };
  return act;
}
function buildCustom() {
  const eq = eqOf();
  if (!prevMatch) prevMatch = new Match({mode: 'preview', arena: 'training'}, {skin: mySkin(0), shake: false});
  chips($('#cp-tog'), [[0, 'JOGADOR 1'], [1, 'JOGADOR 2']], custP, v => { custP = v; custAwk = custSkin = custFat = custWin = null; buildCustom(); });
  const tabs = $('#cust-tabs'); tabs.innerHTML = '';
  CUST_GROUPS.forEach(G => { const b = document.createElement('button'); b.className = 'tab' + (G.id === custTab ? ' sel' : ''); b.innerHTML = (TAB_ICO[G.id] ? ico(TAB_ICO[G.id]) : '') + '<span>' + G.label + '</span>'; b.onclick = () => { SFX.play('click'); custTab = G.id; buildCustom(); }; tabs.appendChild(b); });
  const selTab = tabs.querySelector('.sel'); if (selTab) try { selTab.scrollIntoView({block: 'nearest', inline: 'center'}); } catch (e) {}
  const subs = $('#cust-subs'); subs.innerHTML = ''; subs.classList.toggle('hidden', custTab !== 'acc');
  if (custTab === 'acc') CUST_GROUPS[2].subs.forEach(([k, l]) => { const b = document.createElement('button'); b.className = 'sub' + (k === custSub ? ' sel' : ''); b.textContent = l; b.onclick = () => { SFX.play('click'); custSub = k; buildCustom(); }; subs.appendChild(b); });
  const g = $('#cust-grid'); g.innerHTML = ''; g.scrollTop = 0;
  const isAwk = custTab === 'awk', isSkin = custTab === 'skin', isFat = custTab === 'fat', isWin = custTab === 'win', wide = isAwk || isFat;
  g.classList.toggle('grid', !wide && !isWin); g.classList.toggle('awk-list', wide || isWin); g.classList.toggle('skin-grid', isSkin);
  $('.prev-wrap').classList.toggle('awk-prev', wide);
  const pc = $('#cust-prev'); const W = wide ? 480 : 360, H = wide ? 270 : 420;
  if (pc.width !== W) { pc.width = W; pc.height = H; pc.style.aspectRatio = W + '/' + H; }
  $('.prev-wrap small').textContent = isAwk ? 'Prévia: não causa dano nem gasta energia' : isFat ? 'Prévia isolada: não altera nenhuma partida' : isWin ? 'Toque no boneco para repetir a animação' : 'Toque no boneco para alternar a pose';
  const cap = $('#prev-cap');
  if (isAwk) {
    if (!custAwk) custAwk = eq.awk;
    cap.textContent = AWK_TYPES[custAwk].name;
    AWK_IDS.forEach(id => {
      const T = AWK_TYPES[id], own = owned('awk', id), equipped = eq.awk === id;
      const d = document.createElement('div'); d.className = 'awk-card' + (custAwk === id ? ' sel' : ''); d.style.setProperty('--c1', T.c);
      const main = document.createElement('button'); main.className = 'awk-main'; main.style.cssText = 'all:unset;cursor:pointer;display:flex;flex-direction:column;gap:.25em;flex:1;min-width:0';
      main.innerHTML = `<h3>${ico('awk')} ${T.name}</h3><p>${T.desc}</p><div class="fxs">${T.fx.map(x => '<span>' + x + '</span>').join('')}</div>`;
      main.querySelector('h3').appendChild(rarBadge(T.price));
      main.onclick = () => { SFX.play('select'); custAwk = id; buildCustom(); };
      const act = actBtn('awk', id, T.name, T.price, equipped, own, 'O'); act.style.cssText = 'align-self:center;white-space:nowrap;padding:.6em .9em';
      d.style.flexDirection = 'row'; d.append(main, act); g.appendChild(d);
    });
  } else if (isFat) {
    if (!custFat) custFat = eq.fat || 'iron';
    cap.textContent = FATS[custFat].name;
    FAT_IDS.forEach(id => {
      const T = FATS[id], own = owned('fat', id), equipped = (eq.fat || 'iron') === id;
      const d = document.createElement('div'); d.className = 'awk-card fat-card' + (custFat === id ? ' sel' : '') + (own ? '' : ' locked'); d.style.setProperty('--c1', T.c);
      const main = document.createElement('button'); main.className = 'awk-main'; main.style.cssText = 'all:unset;cursor:pointer;display:flex;flex-direction:column;gap:.25em;flex:1;min-width:0';
      main.innerHTML = `<h3><span class="fat-ico">${FAT_ICO[id]}</span> ${T.name}</h3><p>${T.desc}</p><div class="fxs">${T.fx.map(x => '<span>' + x + '</span>').join('')}</div>`;
      main.querySelector('h3').appendChild(rarBadge(T.price));
      main.onclick = () => { SFX.play('select'); custFat = id; FatPreview.restart && (FatPreview.key = ''); buildCustom(); };
      const act = actBtn('fat', id, T.name, T.price, equipped, own, 'A'); act.style.cssText = 'align-self:center;white-space:nowrap;padding:.6em .9em';
      d.style.flexDirection = 'row'; d.append(main, act); g.appendChild(d);
    });
  } else if (isWin) {
    if (!custWin) custWin = eq.win;
    cap.textContent = (COSM.win.list.find(x => x[0] === custWin) || [0, ''])[1];
    COSM.win.list.forEach(([id, name, price]) => {
      const own = owned('win', id), equipped = eq.win === id;
      const d = document.createElement('div'); d.className = 'awk-card win-card' + (custWin === id ? ' sel' : '') + (own ? '' : ' locked'); d.style.setProperty('--c1', RAR_COL[rarOf(price)]);
      const main = document.createElement('button'); main.className = 'awk-main'; main.style.cssText = 'all:unset;cursor:pointer;display:flex;flex-direction:column;gap:.25em;flex:1;min-width:0';
      main.innerHTML = `<h3>${name}</h3><p>${WIN_DESC[id] || ''}</p>`; main.querySelector('h3').appendChild(rarBadge(price));
      main.onclick = () => { SFX.play('select'); custWin = id; prevCelebrate = true; prevMatch.fighters[0].celeT = 0; buildCustom(); };
      const act = actBtn('win', id, name, price, equipped, own, 'A'); act.style.cssText = 'align-self:center;white-space:nowrap;padding:.6em .9em';
      d.style.flexDirection = 'row'; d.append(main, act); g.appendChild(d);
    });
  } else if (isSkin) {
    if (!custSkin) custSkin = eq.skin || 'none';
    cap.textContent = SKINS[custSkin].name;
    SKIN_IDS.forEach(id => {
      const K = SKINS[id], own = owned('skin', id), equipped = (eq.skin || 'none') === id;
      const d = document.createElement('div'); d.className = 'skin-card' + (custSkin === id ? ' sel' : '') + (equipped ? ' eqd' : '');
      const th = document.createElement('canvas'); th.className = 'th'; th.width = 150; th.height = 165;
      th.onclick = () => { SFX.play('select'); custSkin = id; buildCustom(); };
      const base = mySkinBase(custP), sk = K.preset ? Object.assign(base, skinPreset(id)) : base;
      drawThumb(th, sk);
      const h = document.createElement('h3'); h.textContent = K.name;
      const tg = document.createElement('div'); tg.className = 'tg';
      (K.tags || (id === 'none' ? ['Livre'] : [])).forEach(t => { const sp = document.createElement('span'); sp.textContent = t; if (t === 'Grátis') sp.className = 'free'; tg.appendChild(sp); });
      if (!K.tags && K.price) { const sp = document.createElement('span'); sp.textContent = 'Pacote completo'; tg.appendChild(sp); }
      if (K.price) tg.appendChild(rarBadge(K.price));
      d.append(th, h, tg, actBtn('skin', id, K.name, K.price, equipped, own, 'A')); g.appendChild(d);
    });
  } else {
    const cat = curCat();
    cap.textContent = eq.skin && eq.skin !== 'none' && SKINS[eq.skin] ? 'Skin ativa: ' + SKINS[eq.skin].name + ' (escolher uma peça avulsa a desativa)' : 'Visual personalizado';
    COSM[cat].list.forEach(it => {
      const [id, name, price, val] = it, own = owned(cat, id);
      const b = document.createElement('button'); b.className = 'item' + (eq[cat] === id ? ' sel' : '') + (own ? '' : ' locked');
      if (val) { const sw = document.createElement('div'); sw.className = 'sw'; sw.style.background = val; b.appendChild(sw); }
      const n = document.createElement('span'); n.textContent = name; b.appendChild(n);
      if (price) b.appendChild(rarBadge(price));
      if (!own) { const p = document.createElement('small'); p.innerHTML = ico('lock') + ico('coin') + ' ' + price; b.appendChild(p); }
      b.onclick = () => custEquip(cat, id, name, price);
      g.appendChild(b);
    });
  }
}
$('#cust-prev').addEventListener('pointerdown', () => {
  if (custTab === 'awk') { AwkPreview.reset(); AwkPreview.t = 0.3; }
  else if (custTab === 'fat') { FatPreview.restart(); }
  else if (custTab === 'win') { prevCelebrate = true; if (prevMatch) prevMatch.fighters[0].celeT = 0; }
  else prevCelebrate = !prevCelebrate;
  SFX.play('click');
});
function previewSkinObj() {
  const base = mySkin(custP);
  if (custTab === 'skin' && custSkin) { const K = SKINS[custSkin]; return K.preset ? Object.assign(mySkinBase(custP), skinPreset(custSkin)) : mySkinBase(custP); }
  return base;
}
let prevAcc = 0;
function renderPreview(t, dt) {
  const c = $('#cust-prev'), g = c.getContext('2d');
  const wide = (sc, m, tt) => { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#0b0820'; g.fillRect(0, 0, c.width, c.height); renderFrame(g, c.width, c.height, m, tt, {scale: sc, ox: 0, oy: (c.height - WORLD_H * sc) / 2, q: 1, pxScale: sc}); g.setTransform(1, 0, 0, 1, 0, 0); };
  if (custTab === 'awk') { AwkPreview.ensure(custAwk || eqOf().awk, mySkin(custP)); AwkPreview.step(Math.min(dt || DT, 0.05)); wide(c.width / WORLD_W, AwkPreview.m, t); return; }
  if (custTab === 'fat') { FatPreview.ensure(custFat || eqOf().fat || 'iron', mySkin(custP)); FatPreview.step(Math.min(dt || DT, 0.05)); wide(c.width / WORLD_W, FatPreview.m, t); return; }
  if (!prevMatch) return;
  const f = prevMatch.fighters[0]; f.skin = previewSkinObj();
  const winId = custTab === 'win' ? (custWin || eqOf().win) : eqOf().win;
  f.celebrate = custTab === 'win' ? prevCelebrate : (prevCelebrate && !(custTab === 'cape' || custTab === 'acc')); f.winAnim = Math.max(0, WIN_IDS.indexOf(winId));
  // capas/acessórios: o boneco se move de leve para mostrar o tecido e as asas
  if ((custTab === 'cape' || custTab === 'acc') && !f.celebrate) { const ph = (t % 4); f.input.mx = ph < 1 ? 1 : ph < 2 ? 0 : ph < 3 ? -1 : 0; if (f.x > 720) f.input.mx = -1; if (f.x < 560) f.input.mx = 1; } else { f.input.mx = 0; if (Math.abs(f.x - 640) > 4) { f.x += (640 - f.x) * 0.08; } }
  prevMatch.update(DT);
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height);
  const s = 2.7; g.setTransform(s, 0, 0, s, c.width / 2 - f.x * s, c.height * 0.88 - 600 * s);
  if (custFlash > 0) { custFlash -= dt || DT; g.fillStyle = 'rgba(250,204,21,' + (custFlash * 0.5).toFixed(2) + ')'; g.beginPath(); g.ellipse(f.x, 540, 90, 110, 0, 0, 6.283); g.fill(); }
  g.fillStyle = 'rgba(255,255,255,0.15)'; g.beginPath(); g.ellipse(f.x, 602, 46, 8, 0, 0, 6.283); g.fill();
  drawFighter(g, f, t, false); g.setTransform(1, 0, 0, 1, 0, 0);
}

// ---------- armas ----------
function norm(v, max) { return Math.round(clamp(v / max, 0.04, 1) * 100); }
function buildWeapons() {
  const g = $('#weap-grid'); if (g.children.length) return;
  WEAPON_IDS.forEach(id => {
    const w = WEAPONS[id], d = document.createElement('div'); d.className = 'card';
    const c = document.createElement('canvas'); c.width = 240; c.height = 70; drawWeaponIcon(c, id); d.appendChild(c);
    const h = document.createElement('h3'); h.textContent = w.name; d.appendChild(h);
    const tg = document.createElement('span'); tg.className = 'tag'; tg.style.background = WEAPON_CAT_COLOR[w.cat]; tg.textContent = w.cat; d.appendChild(tg);
    const p = document.createElement('p'); p.textContent = w.desc; d.appendChild(p);
    let dmg = w.type === 'melee' ? w.dmg : w.type === 'gun' ? (w.charge ? w.dmgMax : (w.expDmg || w.dmg * (w.pellets || 1))) : w.type === 'beam' ? w.dmg * (w.dur / w.tick) : w.expDmg;
    const rng = w.type === 'melee' ? w.len / 90 : w.type === 'throw' ? 0.4 : w.type === 'mine' ? 0.08 : (w.rng || 500) / 1100;
    const rate = w.type === 'melee' ? 1 / (w.swing + w.cd) : (1 / (w.cd || 0.3));
    const stats = [['Dano', dmg / 34 * 100], ['Alcance', rng * 100], ['Cadência', Math.log(1 + rate) / Math.log(15) * 100], ['Empurrão', w.knock / 1200 * 100]];
    stats.forEach(s => { const r = document.createElement('div'); r.className = 'stat'; r.innerHTML = `<i>${s[0]}</i><div class="bar"><b style="width:${clamp(s[1], 4, 100)}%"></b></div>`; d.appendChild(r); });
    const ex = document.createElement('p'); ex.textContent = w.type === 'melee' ? `Durabilidade: ${w.uses} golpes` : `Munição: ${w.ammo}` + (w.charge ? ' · carregável' : '') + (w.fuse ? ` · pavio ${w.fuse}s` : ''); d.appendChild(ex);
    g.appendChild(d);
  });
}
// ---------- arenas ----------
function buildArenas() {
  const g = $('#arena-grid'); g.innerHTML = '';
  ARENA_IDS.forEach(id => {
    const a = ARENAS[id], d = document.createElement('div'); d.className = 'card' + (save.sel.arena === id ? ' sel' : ''); d.style.cursor = 'pointer';
    const c = document.createElement('canvas'); c.width = 320; c.height = 180; drawArenaPreview(c, a); d.appendChild(c);
    d.innerHTML += `<h3>${a.name}</h3><p>${a.desc}</p><p class="hz">${ico('warn')} ${a.hazard}</p>`;
    const cc = d.querySelector('canvas'); if (!cc) { /* innerHTML recriou nós; redesenha */ }
    d.onclick = () => { save.sel.arena = id; persist(); SFX.play('select'); toast('Arena selecionada: ' + a.name); buildArenas(); };
    g.appendChild(d);
  });
  // innerHTML += recria o canvas: redesenhar
  $$('#arena-grid .card').forEach((card, i) => { const c = card.querySelector('canvas'); if (c) drawArenaPreview(c, ARENAS[ARENA_IDS[i]]); });
}
// ---------- configurações ----------
function applySettings() {
  const s = save.set;
  SFX.S.music = s.music; SFX.S.sfx = s.sfx; SFX.apply();
  document.documentElement.style.setProperty('--cs', s.cs); document.documentElement.style.setProperty('--co', s.co);
  document.body.classList.toggle('mirror', s.mirror);
  if (app.scene) app.scene.fx.shakeOn = s.shake;
  GFX.low = !s.quality;
  if (app.scene) app.scene.fx.max = s.quality ? 480 : 110;
}
let setTab = 'geral';
function keyName(c) { return !c ? '—' : c.replace('Key', '').replace('Digit', '').replace('Arrow', '').replace('Left', '←').replace('Right', '→').replace('Up', '↑').replace('Down', '↓').replace('Space', 'ESPAÇO').replace('Enter', 'ENTER').replace('Comma', ',').replace('Period', '.').replace('Slash', '/'); }
function buildKeys(b) {
  [['p1', 'JOGADOR 1'], ['p2', 'JOGADOR 2 (local)']].forEach(([pk, label]) => {
    const h = document.createElement('h4'); h.textContent = label; b.appendChild(h);
    const t = document.createElement('table'); t.className = 'kbtbl';
    KEY_ACT.forEach(([a, n]) => {
      const tr = document.createElement('tr'); tr.innerHTML = `<td>${n}</td><td></td>`;
      const bt = document.createElement('button'); bt.textContent = keyName(save.keys[pk][a]); tr.lastChild.appendChild(bt);
      bt.onclick = () => {
        bt.textContent = 'pressione...'; bt.classList.add('wait'); rebind.active = true;
        const h2 = e => {
          e.preventDefault(); e.stopImmediatePropagation(); window.removeEventListener('keydown', h2, true); rebind.active = false;
          if (e.code !== 'Escape') {
            if (e.code === 'KeyP') toast('A tecla P é reservada para pausa.');
            else {
              let used = null; ['p1', 'p2'].forEach(q => KEY_ACT.forEach(([x]) => { if (save.keys[q][x] === e.code && !(q === pk && x === a)) used = q.toUpperCase() + ' · ' + x; }));
              if (used) toast('Tecla já usada em ' + used); else { save.keys[pk][a] = e.code; persist(); }
            }
          }
          buildSettings();
        };
        window.addEventListener('keydown', h2, true);
      };
      t.appendChild(tr);
    });
    b.appendChild(t);
  });
  const r = document.createElement('div'); r.className = 'row'; r.innerHTML = '<label>Padrão</label><button class="btn"><span>RESTAURAR TECLAS</span></button>';
  r.querySelector('button').onclick = () => { save.keys = {p1: Object.assign({}, KEYS0.p1), p2: Object.assign({}, KEYS0.p2)}; persist(); buildSettings(); };
  b.appendChild(r);
  const n = document.createElement('div'); n.className = 'note'; n.textContent = 'Esc / P pausam. Um jogador (vs CPU) também aceita setas, K/L/O e Espaço. Ao usar o teclado os botões de toque somem; tocar na tela os traz de volta.'; b.appendChild(n);
}
function buildCredits(b) {
  const d = document.createElement('div'); d.className = 'credits';
  d.innerHTML = `<img class="cred-logo" src="${$(".logo-img").src}" alt="">
    <div class="cred-blk"><small>FUNDADOR E DESENVOLVEDOR</small><b>LEANDRODROID998</b></div>
    <div class="cred-blk"><small>DIREÇÃO CRIATIVA</small><b>LEANDRODROID998 &amp; Carlos Eduardo</b></div>
    <div class="cred-blk"><small>EQUIPE</small><b>MAYHEM GAMES.</b></div>
    <div class="cred-ver">STICK MAYHEM ${VERSION} — FATALITY & COSMETICS UPDATE</div>`;
  b.appendChild(d);
}
function buildSettings() {
  const b = $('#set-body'); b.innerHTML = '';
  const s = save.set;
  const tb = document.createElement('div'); tb.className = 'tabs'; tb.style.justifyContent = 'center';
  [['geral', 'GERAL'], ['teclado', 'TECLADO'], ['creditos', 'CRÉDITOS']].forEach(([k, n]) => { const t = document.createElement('button'); t.className = 'tab' + (k === setTab ? ' sel' : ''); t.textContent = n; t.onclick = () => { SFX.play('click'); setTab = k; buildSettings(); }; tb.appendChild(t); });
  b.appendChild(tb);
  if (setTab === 'teclado') { buildKeys(b); return; }
  if (setTab === 'creditos') { buildCredits(b); return; }
  const slider = (label, key, min, max, step, fmt) => {
    const r = document.createElement('div'); r.className = 'row'; r.innerHTML = `<label>${label}</label><input type="range" min="${min}" max="${max}" step="${step}" value="${s[key]}"><span class="val"></span>`;
    const inp = r.querySelector('input'), v = r.querySelector('.val'); const upd = () => v.textContent = fmt(+inp.value); upd();
    inp.oninput = () => { s[key] = +inp.value; upd(); applySettings(); };
    inp.onchange = () => { persist(); if (key === 'sfx') SFX.play('pickup'); };
    b.appendChild(r);
  };
  const toggle = (label, key, cb) => {
    const r = document.createElement('div'); r.className = 'row'; r.innerHTML = `<label>${label}</label><button class="toggle"></button>`;
    const t = r.querySelector('button'); const upd = () => { t.classList.toggle('on', !!s[key]); t.textContent = s[key] ? 'LIGADO' : 'DESLIGADO'; }; upd();
    t.onclick = () => { s[key] = !s[key]; upd(); persist(); applySettings(); if (cb) cb(); SFX.play('click'); };
    b.appendChild(r);
  };
  slider('Música', 'music', 0, 1, 0.05, v => Math.round(v * 100) + '%');
  slider('Efeitos sonoros', 'sfx', 0, 1, 0.05, v => Math.round(v * 100) + '%');
  const q = document.createElement('div'); q.className = 'row'; q.innerHTML = '<label>Gráficos</label><div class="chips"></div>'; b.appendChild(q);
  chips(q.querySelector('.chips'), [[0, 'Baixo (mais FPS)'], [1, 'Alto']], s.quality, v => { s.quality = v; persist(); applySettings(); resize(); buildSettings(); });
  slider('Tamanho dos controles', 'cs', 0.6, 1.5, 0.05, v => Math.round(v * 100) + '%');
  slider('Transparência dos botões', 'co', 0.25, 1, 0.05, v => Math.round(v * 100) + '%');
  toggle('Tremor de câmera', 'shake');
  toggle('Vibração (haptic)', 'haptic');
  toggle('Controles espelhados (canhoto)', 'mirror');
  const gpr = document.createElement('div'); gpr.className = 'row'; gpr.innerHTML = '<label>' + ico('gamepad') + ' Controle</label><span class="val" style="flex:1;text-align:right;font-size:.8em">' + (GP.list().length ? GP.list().length + ' conectado(s). A pula · analógico direito mira 360° · X/R1/RT ataca · B/L1/LT especial · Y larga · Back/clique no analógico = AWAKENING · Start pausa' : 'Conecte um controle (USB/Bluetooth) e aperte um botão.') + '</span>'; b.appendChild(gpr);
  const o = document.createElement('div'); o.className = 'row'; o.innerHTML = '<label>Tela cheia / orientação</label><button class="btn">' + ico('full') + ' <span>TELA CHEIA + PAISAGEM</span></button>'; o.querySelector('button').onclick = () => { toggleFS(); }; b.appendChild(o);
  const r = document.createElement('div'); r.className = 'row'; r.innerHTML = '<label>Dados salvos</label><button class="btn danger">APAGAR PROGRESSO</button>';
  r.querySelector('button').onclick = () => { if (confirm('Apagar moedas, itens, estatísticas e configurações?')) { save = defaults(); persist(); applySettings(); buildSettings(); updCoins(); toast('Progresso apagado.'); } };
  b.appendChild(r);
}
$('#set-back').onclick = () => { SFX.play('click'); if (app.settingsFrom === 'pause') showScreen('pause'); else go('menu'); };

// ---------- estatísticas e desafios ----------
function chalProg(c) { return save.ch.prog[c.id] || 0; }
function buildStats() {
  const s = save.stats, b = $('#stats-body');
  const tile = (v, l) => `<div class="tile"><b>${v}</b><span>${l}</span></div>`;
  const min = Math.floor(s.time / 60);
  b.innerHTML = '<div class="stats-grid">' + tile(s.matches, 'Partidas') + tile(s.wins, 'Vitórias') + tile(s.losses, 'Derrotas') + tile(s.kills, 'Eliminações') + tile(s.deaths, 'Mortes') + tile(Math.round(s.dmg), 'Dano causado') + tile(min + ' min', 'Tempo de luta') + tile(Math.round(s.bestSurvive) + ' s', 'Maior sobrevivência') + '</div><h4>DESAFIOS</h4>';
  CHALLENGES.forEach(c => {
    const p = Math.min(chalProg(c), c.goal), done = !!save.ch.done[c.id];
    b.innerHTML += `<div class="chal ${done ? 'done' : ''}"><b>${done ? ico('check') + ' ' : ''}${c.text}</b> <span style="float:right;color:#fde68a">${ico('coin')} ${c.reward}</span><div class="pb"><b style="width:${p / c.goal * 100}%"></b></div><small>${p}/${c.goal}</small></div>`;
  });
}

// ---------- partida / série de rodadas ----------
let roundTimer = 0;
function startSeries(base) {
  const multi = base.mode !== 'chaos' && (base.score === 'board' || base.target > 0);
  app.series = {base, rounds: multi, board: base.score === 'board', target: base.target || 0, score: [0, 0], round: 1, extra: 0,
    agg: {}, time: 0, names: []};
  launchRound();
}
function launchRound() {
  const sr = app.series, b = sr.base;
  const cfg = Object.assign({}, b, {rounds: sr.rounds ? {target: sr.board ? 0 : sr.target} : null, score: sr.score.slice(), round: sr.round});
  startGame(cfg);
}
function startGame(cfg) {
  SFX.resume(); SFX.duck(false); clearInterval(roundTimer);
  Controls.setMode(cfg.mode === 'duel_local' ? 'local' : 'single');
  const fxMax = cfg.camFx === false ? 70 : (save.set.quality ? 480 : 110);
  app.game = {cfg, start: performance.now()};
  app.scene = new Match(cfg, {inputs: Controls.inputs, skin: mySkin(0), skin2: mySkin(1), shake: save.set.shake, fxMax, netMe: Net.pid, netInputs: Net.inputs, netClient: !!cfg.client});
  document.body.classList.toggle('netg', !!cfg.online); app.netEnded = false;
  if (cfg.online && !cfg.client) Net.attach(app.scene);
  if (cfg.camFx === false) app.scene.fx.shakeOn = false;
  app.state = 'game'; app.endReal = 0; app.acc = 0;
  document.body.classList.toggle('awk-on', !!(cfg.awk && cfg.awk.on));
  document.body.classList.remove('kb');
  [0, 1].forEach(sl => { const f = app.scene.fighters.find(x => x.slot === sl); const c = AWK_TYPES[f ? f.awkType : 'void'].c; const h = c.replace('#', ''); const rgb = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)).join(','); $$('.cb.awk[data-s="' + sl + '"]').forEach(e => { e.style.setProperty('--c', rgb); e.style.setProperty('--p', 0); e.classList.remove('ready'); }); });
  showScreen(null); $('#hud').classList.remove('hidden'); $('#ctrl').classList.remove('hidden');
  SFX.music('battle');
  checkOrientation();
}
function leaveGame(toScreen) {
  clearInterval(roundTimer);
  app.state = 'menu'; app.game = null; app.series = null; app.vic = null;
  Controls.setMode('none'); $('#hud').classList.add('hidden'); $('#ctrl').classList.add('hidden'); document.body.classList.remove('awk-on', 'kb');
  newMenuScene(); applySettings(); SFX.duck(false); SFX.music('menu'); go(toScreen || 'menu');
}
function pauseGame() {
  if (app.state !== 'game') return;
  if (Net.role) { if (!document.hidden) { Controls.reset(); showScreen('pause'); $('#s-pause').classList.add('active'); } return; }
  app.state = 'paused'; Controls.reset(); SFX.duck(true); showScreen('pause'); $('#s-pause').classList.add('active');
}
function resumeGame() {
  if (Net.role && app.state === 'game') { Controls.reset(); showScreen(null); return; }
  if (app.state !== 'paused') return;
  app.state = 'game'; Controls.reset(); SFX.duck(false); showScreen(null); app.last = performance.now();
}
$('#btn-pause').onclick = () => { SFX.play('click'); pauseGame(); };
$('#p-resume').onclick = () => { SFX.play('click'); resumeGame(); };
$('#p-restart').onclick = () => { SFX.play('click'); startSeries(app.series.base); };
$('#p-arena').onclick = () => { SFX.play('click'); leaveGame('play'); };
$('#p-settings').onclick = () => { SFX.play('click'); app.settingsFrom = 'pause'; setTab = 'geral'; showScreen('settings'); buildSettings(); };
$('#p-menu').onclick = () => { SFX.play('click'); leaveGame('menu'); };
$('#r-again').onclick = () => { SFX.play('click'); startSeries(app.series ? app.series.base : baseCfg()); };
$('#r-arena').onclick = () => { SFX.play('click'); leaveGame('play'); };
$('#r-menu').onclick = () => { SFX.play('click'); leaveGame('menu'); };
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });
window.addEventListener('pagehide', pauseGame);

// fim de uma partida/rodada: soma estatísticas e decide o próximo passo
function onMatchEnd() {
  const sr = app.series, m = app.scene, res = m.result, F = m.fighters;
  F.forEach((f, i) => { const a = sr.agg[i] || (sr.agg[i] = {name: f.name, kills: 0, deaths: 0, dmg: 0, surv: 0, killW: []}); a.name = f.name; a.kills += f.kills; a.deaths += f.deaths; a.dmg += f.dmgDealt; a.surv += f.surviveT; a.killW = a.killW.concat([...f.killWeapons]); });
  sr.time += m.t;
  const w = res.winner;
  if (sr.base.mode === 'chaos') { finishMatch(); return; }
  if (!w) { sr.extra++; showRound(res.timeUp ? 'EMPATE NO TEMPO' : 'EMPATE', 'RODADA EXTRA para desempatar', false); return; }
  if (sr.rounds) {
    sr.score[w === F[0] ? 0 : 1]++;
    const done = !sr.board && sr.score[0] >= sr.target || !sr.board && sr.score[1] >= sr.target;
    if (done) { endOrFatality(w); return; }
    showRound(w.name + ' VENCEU A RODADA', '', true);
    sr.round++;
  } else endOrFatality(w);
}
function showRound(title, sub, scored) {
  const sr = app.series, m = app.scene;
  app.state = 'round'; Controls.reset(); $('#ctrl').classList.add('hidden');
  $('#rd-n').textContent = sr.rounds ? 'RODADA ' + (scored ? sr.round : sr.round) + (sr.board ? '' : ' · 1º A ' + sr.target + ' VITÓRIAS') : 'DESEMPATE';
  $('#rd-title').textContent = title;
  const sc = $('#rd-score'); sc.textContent = sr.rounds ? sr.score[0] + ' : ' + sr.score[1] : ''; sc.style.animation = 'none'; void sc.offsetWidth; sc.style.animation = '';
  $('#rd-sub').textContent = sub || (sr.board ? 'Quadro de vitórias — continue ou encerre.' : '');
  const next = $('#rd-next-t'), endB = $('#rd-end span');
  endB.textContent = sr.board ? 'ENCERRAR E VER RESULTADO' : 'ABANDONAR';
  $('#rd-end').onclick = () => { SFX.play('click'); if (sr.board && sr.rounds) finishMatch(); else leaveGame('menu'); };
  $('#rd-next').onclick = () => { SFX.play('go'); clearInterval(roundTimer); launchRound(); };
  clearInterval(roundTimer);
  if (!sr.board) {
    let n = 4; next.textContent = 'PRÓXIMA RODADA (' + n + ')';
    roundTimer = setInterval(() => { n--; if (n <= 0) { clearInterval(roundTimer); if (app.state === 'round') launchRound(); } else next.textContent = 'PRÓXIMA RODADA (' + n + ')'; }, 1000);
  } else next.textContent = 'PRÓXIMA RODADA';
  showScreen('round'); SFX.duck(false);
}

// ---------- FATALITY: tela de vitória especial + execução ----------
// só existe quando a PARTIDA inteira foi vencida (série fechada ou partida única decidida), com a opção ligada na configuração
function fatEligible(w) {
  const sr = app.series, cfg = app.game && app.game.cfg;
  if (!cfg || !sr || !w || !cfg.fatality || sr.board) return false;
  if (cfg.mode !== 'duel_cpu' && cfg.mode !== 'duel_local') return false;
  if (cfg.mode === 'duel_cpu' && !w.human) return false;       // contra a CPU: só se o jogador venceu
  return true;
}
function endOrFatality(w) { if (fatEligible(w)) beginFatality(w); else finishMatch(); }
const fatEq = f => f.slot === 1 ? save.eq2 : save.eq;
function fatIdOf(f) { const id = fatEq(f).fat; return FATS[id] && owned('fat', id) ? id : 'iron'; }
// Fatality automática: ao vencer a partida inteira, a finalização roda sozinha (sem botão); depois vem a tela de vitória
function beginFatality(w) {
  const m = app.scene, cfg = app.game.cfg, loser = m.fighters.find(f => f !== w);
  app.vic = {winner: w, loser, match: m, used: false, local: false};
  app.state = 'victory'; Controls.reset(); $('#hud').classList.add('hidden'); $('#ctrl').classList.add('hidden'); clearInterval(roundTimer);
  startFatality();
}
function showVictory() {   // pós-Fatality: tela de vitória com resultado / nova partida / menu
  const V = app.vic, w = V.winner, sr = app.series, cfg = app.game.cfg, local = cfg.mode === 'duel_local', F = FATS[V.fatId];
  V.post = true; V.local = false; app.state = 'victory';
  $('#vic-title').textContent = local ? w.name + ' VENCEU!' : 'VITÓRIA!';
  $('#vic-sub').textContent = 'PARTIDA VENCIDA' + (sr.rounds ? ' · ' + sr.score[0] + ' : ' + sr.score[1] : '');
  $('#vic-fat').classList.add('hidden'); $('#vic-hint').textContent = '';
  $('#vic-eq').innerHTML = ico('skull') + ' <span>Fatality:</span> <b style="color:' + F.c + '">' + F.name + '</b>';
  $('#vic-skip span').textContent = 'VER RESULTADO';
  const box = $('#s-victory'); box.classList.remove('local', 'side-r');
  const t = $('#vic-title'); t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  showScreen('victory'); SFX.duck(false); SFX.play('fat_win');
}
function fatAllowed(e) {   // duelo local: só o vencedor aciona (lado da tela dele, ou as teclas/controle dele)
  const V = app.vic; if (!V) return false; if (!V.local) return true;
  if (e && e.detail > 0) return (e.clientX < window.innerWidth / 2) === (V.winner.slot === 0);
  return false;
}
function startFatality() {
  const V = app.vic; if (!V || V.used || app.state !== 'victory') return;   // trava contra ativação dupla
  V.used = true;
  const win = V.winner, lose = V.loser, id = fatIdOf(win), old = V.match;
  const cfg = {mode: 'fatality', arena: app.game.cfg.arena, weapons: false, camFx: true, hp: 100, format: 'stock', lives: 1};
  const fxMax = save.set.quality ? 480 : 110;
  const m = new Match(cfg, {skin: Object.assign({}, win.skin), skin2: Object.assign({}, lose.skin), shake: save.set.shake, fxMax, heroName: win.name, vicName: lose.name});
  m.fatStart(id);
  V.fatId = id; V.fatMatch = m; app.scene = m; app.state = 'fatality'; app.acc = 0; app.fatWait = 0;
  Controls.reset(); showScreen(null); SFX.duck(true); save.stats.fatalities = (save.stats.fatalities || 0) + 1; persist(); buzz(30);
}
function showFatEnd() { if (!app.vic || app.state !== 'fatality') return; showVictory(); }
function closeVictory() { const V = app.vic; if (V) { app.scene = V.match; V.fatMatch = null; } app.vic = null; }
function skipFatality() { if (app.state !== 'victory' || !app.vic) return; closeVictory(); finishMatch(); }
$('#vic-fat').addEventListener('pointerdown', e => { if (app.state === 'victory') { $('#vic-fat').classList.add('hit'); buzz(25); SFX.resume(); SFX.play('fat_button'); } });
$('#vic-fat').addEventListener('click', e => {
  if (app.state !== 'victory') return;
  if (!fatAllowed(e)) { toast('Somente o vencedor pode executar a Fatality.'); SFX.play('hit'); return; }
  startFatality();
});
$('#vic-skip').onclick = () => { SFX.play('click'); skipFatality(); };
$('#vic-again').onclick = () => { SFX.play('click'); if (app.state !== 'victory') return; const b = app.series.base; closeVictory(); finishMatch(); startSeries(b); };
$('#vic-menu').onclick = () => { SFX.play('click'); if (app.state !== 'victory') return; closeVictory(); finishMatch(); leaveGame('menu'); };
$('#fe-cont').onclick = () => { SFX.play('click'); if (app.state !== 'fatend') return; closeVictory(); finishMatch(); };
$('#fe-again').onclick = () => { SFX.play('click'); if (app.state !== 'fatend') return; const b = app.series.base; closeVictory(); finishMatch(); startSeries(b); };
$('#fe-menu').onclick = () => { SFX.play('click'); if (app.state !== 'fatend') return; closeVictory(); finishMatch(); leaveGame('menu'); };

function finishMatch() {
  const sr = app.series, m = app.scene, cfg = app.game.cfg, F = m.fighters, p = F[0], A = sr.agg;
  clearInterval(roundTimer);
  app.state = 'result'; Controls.reset(); $('#hud').classList.add('hidden'); $('#ctrl').classList.add('hidden');
  let win = m.result.winner, pw;
  if (sr.rounds) { const d = sr.score[0] - sr.score[1]; win = d > 0 ? F[0] : d < 0 ? F[1] : null; }
  pw = win === p;
  const st = save.stats; let coins = 0, lines = [];
  const kills = A[0].kills, surv = A[0].surv;
  if (cfg.mode === 'duel_local') { coins = 10; lines.push('Partida local: +10'); }
  else {
    coins += 5; lines.push('Participação: +5');
    if (pw) { const v = cfg.mode === 'chaos' ? 30 : 22; coins += v; lines.push('Vitória: +' + v); }
    if (kills) { coins += kills * 8; lines.push('Eliminações (' + kills + '): +' + kills * 8); }
    const sv = Math.min(12, Math.floor(surv / 15)); if (sv) { coins += sv; lines.push('Sobrevivência: +' + sv); }
    coins = Math.min(coins, 80);
    if (cfg.diff === 0) coins = Math.ceil(coins * 0.7);
  }
  st.matches++; st.time += sr.time; st.kills += kills; st.deaths += A[0].deaths; st.dmg += A[0].dmg;
  if (pw) st.wins++; else if (win) st.losses++;
  A[0].killW.forEach(w => { st.weaponKills[w] = (st.weaponKills[w] || 0) + 1; });
  const pr = save.ch.prog;
  if (cfg.mode === 'duel_cpu' && pw) { st.duelWins++; pr.duel3 = (pr.duel3 || 0) + 1; if (cfg.variant === 'awk') pr.awk3 = (pr.awk3 || 0) + 1; }
  if (cfg.mode === 'chaos') { st.chaosPlayed++; pr.chaos5 = (pr.chaos5 || 0) + 1; if (kills >= 2) pr.chaos2 = 1; if (p.surviveT >= 90) pr.surv90 = 1; st.bestSurvive = Math.max(st.bestSurvive, p.surviveT); }
  pr.kills50 = st.kills; pr.weap5 = Object.keys(st.weaponKills).length;
  let bonus = 0;
  CHALLENGES.forEach(c => { if (!save.ch.done[c.id] && (pr[c.id] || 0) >= c.goal) { save.ch.done[c.id] = true; bonus += c.reward; toast('Desafio completo! +' + c.reward + ' moedas'); } });
  save.coins += coins + bonus; persist(); updCoins();
  // UI
  const title = $('#res-title'), local = cfg.mode === 'duel_local';
  let t, sub = '';
  if (!win) t = 'EMPATE!';
  else if (local) t = win.name + ' VENCEU!';
  else if (cfg.mode === 'duel_cpu') { t = pw ? 'VITÓRIA!' : 'DERROTA'; sub = pw ? 'Você derrotou a CPU (' + DIFF_NAMES[cfg.diff] + ')' : 'A CPU venceu desta vez.'; }
  else { t = pw ? 'VITÓRIA!' : win.name + ' VENCEU'; sub = 'Último sobrevivente: ' + win.name; }
  if (m.result.timeUp && !sr.rounds) sub = 'Tempo esgotado — ' + (sub || 'decisão por vidas/vida restante');
  title.textContent = t; title.classList.toggle('lose', !win || (!pw && !local));
  title.style.animation = 'none'; void title.offsetWidth; title.style.animation = '';
  if (sr.rounds) sub = 'Placar final ' + sr.score[0] + ' : ' + sr.score[1] + (sub ? ' · ' + sub : '');
  $('#res-sub').textContent = sub + (sub ? ' · ' : '') + 'Tempo total: ' + Math.floor(sr.time / 60) + ':' + String(Math.floor(sr.time % 60)).padStart(2, '0');
  let tb = '<table><tr><th>Lutador</th><th>Elim.</th><th>Dano</th><th>Sobreviveu</th></tr>';
  F.forEach((f, i) => { const a = A[i]; tb += `<tr class="${f === win ? 'win' : ''}"><td>${f === win ? ico('crown') + ' ' : ''}${f.name}</td><td>${a.kills}</td><td>${Math.round(a.dmg)}</td><td>${Math.round(a.surv)} s</td></tr>`; });
  $('#res-table').innerHTML = tb + '</table>';
  $('#res-coins').innerHTML = ico('coin') + ' +' + (coins + bonus) + ' moedas' + (lines.length ? '<br><small style="opacity:.8;font-weight:600">' + lines.join(' · ') + (bonus ? ' · Desafios: +' + bonus : '') + '</small>' : '');
  showScreen('result'); SFX.duck(false);
}

// ---------- laço principal ----------
function frame(ts) {
  requestAnimationFrame(frame);
  if (!app.last) app.last = ts;
  let dt = Math.min(0.1, (ts - app.last) / 1000); app.last = ts;
  if (dt <= 0) return;
  app.fps += (1 / dt - app.fps) * 0.05; app.t += dt;
  // adaptação de desempenho
  if (app.scene && app.fps < 38 && app.t > 3 && app.scene.fx.max > 120) app.scene.fx.max -= 4;
  Controls.poll();
  const sc = app.scene;
  if (app.inCustom) { renderPreview(app.t, dt); }
  if (sc) {
    if (app.state !== 'paused' && app.state !== 'result' && app.state !== 'round') {
      app.acc += dt * (sc.timeScale || 1);
      let n = 0;
      Net.inSim = Net.role === 'host';
      while (app.acc >= DT && n < 8) { sc.update(DT); app.acc -= DT; n++; }
      Net.inSim = false;
      if (n >= 8) app.acc = 0;
      if (app.state === 'game' && Net.role) { if (Net.role === 'host') Net.tickHost(sc, dt); else Net.tickClient(Controls.inputs[0], dt); }
    }
    if (app.state === 'game' && sc.ended) { app.endReal += dt; if (app.endReal > 2.8 && !Net.role) onMatchEnd(); else if (app.endReal > 2.8 && Net.role === 'host' && !app.netEnded) { app.netEnded = true; onlineHostEnd(sc); } }
    if (app.state === 'fatality' && sc.fat && sc.fat.done) { app.fatWait += dt; if (app.fatWait > 1.8) showFatEnd(); }
    if (app.state === 'game') hudAwk(sc);
    renderFrame(ctx, cv.width, cv.height, sc, app.t, view);
  } else { ctx.fillStyle = '#0b0820'; ctx.fillRect(0, 0, cv.width, cv.height); }
}

// ---------- início ----------
$('#ver').textContent = 'STICK MAYHEM ' + VERSION + ' — ONLINE UPDATE';
applySettings(); resize(); newMenuScene(); updCoins();
if (!isFinite(save.coins)) save.coins = 0;
requestAnimationFrame(frame);
function hudAwk(sc) {
  if (!sc.cfg.awk || !sc.cfg.awk.on) return;
  for (let sl = 0; sl < 2; sl++) {
    const f = sc.fighters.find(x => x.slot === sl); if (!f) continue;
    const p = Math.round(clamp(f.energy, 0, 100)), rdy = f.energy >= 100 && !f.awk;
    $$('.cb.awk[data-s="' + sl + '"]').forEach(e => { if (e._p !== p) { e._p = p; e.style.setProperty('--p', p); } if (e._r !== rdy) { e._r = rdy; e.classList.toggle('ready', rdy); } });
  }
}
window.__SM = {app, Net: typeof Net !== 'undefined' ? Net : null, save, Controls, startGame, startSeries, baseCfg};

'use strict';
/* STICK MAYHEM v1.4.0 — interface ONLINE (sala, lobby, resultado) */
const onlineScreenActive = () => $('#s-online').classList.contains('active');
function onMsg(t, cls) { const e = $('#on-msg'); e.textContent = t || ''; e.className = 'on-msg' + (cls ? ' ' + cls : ''); }
function onBusy(b) { ['#on-create', '#on-join'].forEach(s => { $(s).disabled = b; }); }
function onName() { return ($('#on-name').value || '').replace(/[<>&"'`\\]/g, '').trim().slice(0, 12) || 'JOGADOR'; }
function onlineView(room) { $('#on-home').classList.toggle('hidden', room); $('#on-room').classList.toggle('hidden', !room); }
function onlineOpen() {
  const q = new URLSearchParams(location.search).get('sala');
  $('#on-name').value = save.net.name || '';
  $('#on-h').value = save.net.host || ''; $('#on-p').value = save.net.port || ''; $('#on-path').value = save.net.path || ''; $('#on-sec').checked = save.net.secure !== false;
  if (q && !$('#on-code').value && !Net.role) $('#on-code').value = netNormCode(q);
  if (Net.role && Net.phase !== 'connecting') { onlineView(true); onlineRender(); }
  else { onlineView(false); onBusy(false); if (!Net.supported()) onMsg('Seu navegador não suporta WebRTC — o modo online não funciona aqui.', 'err'); else onMsg(''); }
}
function onSaveAdv() {
  save.net.name = onName(); save.net.host = $('#on-h').value.trim(); save.net.port = $('#on-p').value.trim().replace(/\D/g, ''); save.net.path = $('#on-path').value.trim(); save.net.secure = $('#on-sec').checked; persist();
}
['#on-name', '#on-h', '#on-p', '#on-path', '#on-sec'].forEach(s => $(s).addEventListener('change', onSaveAdv));
$('#on-code').addEventListener('input', e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6); });
$('#on-code').addEventListener('keydown', e => { if (e.key === 'Enter') $('#on-join').click(); e.stopPropagation(); });
['#on-name', '#on-h', '#on-p', '#on-path'].forEach(s => $(s).addEventListener('keydown', e => e.stopPropagation()));
$('#on-create').onclick = () => {
  SFX.resume(); SFX.play('click'); onSaveAdv(); if (!Net.supported()) { onMsg('WebRTC indisponível neste navegador.', 'err'); return; }
  onBusy(true); onMsg('Criando sala…'); Net.host(onName(), mySkin(0));
};
$('#on-join').onclick = () => {
  SFX.resume(); SFX.play('click'); onSaveAdv(); if (!Net.supported()) { onMsg('WebRTC indisponível neste navegador.', 'err'); return; }
  const c = netNormCode($('#on-code').value); if (c.length !== 6) { onMsg('Digite o código de 6 caracteres.', 'err'); return; }
  onBusy(true); onMsg('Conectando…'); Net.join(c, onName(), mySkin(0));
};
function onlineLeave() {
  SFX.play('click'); Net.leave(true);
  if (app.state === 'game' || app.state === 'result' || app.state === 'paused') leaveGame('online'); else { go('online'); }
  document.body.classList.remove('netg');
}
$('#on-leave').onclick = onlineLeave;
$('#on-back').onclick = () => { SFX.play('click'); if (Net.role) Net.leave(true); go('menu'); };
$('#or-leave').onclick = onlineLeave;
{ const old = $('#p-menu').onclick; $('#p-menu').onclick = () => { if (Net.role) onlineLeave(); else old(); }; }

function onCopy(txt) {
  const done = () => toast('Copiado!');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, () => onCopyFb(txt, done)); else onCopyFb(txt, done);
}
function onCopyFb(txt, done) { const t = document.createElement('textarea'); t.value = txt; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('Código: ' + txt); } t.remove(); }
$('#on-copy').onclick = () => { SFX.play('click'); onCopy(Net.code); };
$('#on-share').onclick = () => {
  SFX.play('click');
  const link = /^https?:/.test(location.protocol) ? location.origin + location.pathname + '?sala=' + Net.code : '';
  const txt = 'Entre na minha sala do STICK MAYHEM! Código: ' + Net.code + (link ? '\n' + link : '');
  if (navigator.share) navigator.share({title: 'STICK MAYHEM', text: txt}).catch(() => {}); else onCopy(txt);
};

function onlineRender() {
  if (!Net.role) return;
  $('#on-code-big').textContent = Net.code || '------';
  const host = Net.role === 'host', P = Net.players;
  $('#on-count').textContent = P.length + '/4';
  const box = $('#on-players'); box.innerHTML = '';
  for (let i = 0; i < NET_MAX; i++) {
    const p = P.find(x => x.pid === i), d = document.createElement('div');
    if (!p) { d.className = 'on-pl empty'; d.textContent = 'Aguardando jogador…'; }
    else {
      d.className = 'on-pl'; d.style.setProperty('--pc', p.color);
      const me = p.pid === Net.pid, ping = p.pid === 0 ? '' : (me ? (Net.ping ? Net.ping + ' ms' : '') : (p.ping ? p.ping + ' ms' : ''));
      d.innerHTML = '<i class="dot"></i><b></b>' + (p.pid === 0 ? ico('crown') : '') + '<small></small>';
      d.querySelector('b').textContent = p.name + (me ? ' (você)' : ''); d.querySelector('small').textContent = ping || (p.pid === 0 ? 'host' : '');
    }
    box.appendChild(d);
  }
  const o = Net.opts, ob = $('#on-opts'); ob.classList.toggle('ro', !host);
  const set = (id, items, cur, key) => chips($(id), items, cur, v => { if (!host) return; Net.setOpts({[key]: v}); save.net[key] = v; persist(); });
  set('#on-o-arena', ARENA_IDS.filter(a => a !== 'training').map(id => [id, ARENAS[id].name]), o.arena, 'arena');
  set('#on-o-lives', [1, 3, 5, 10].map(n => [n, String(n)]), o.lives, 'lives');
  set('#on-o-weap', [[true, 'LIGADAS'], [false, 'DESLIGADAS']], o.weapons !== false, 'weapons');
  const st = $('#on-start'); st.classList.toggle('hidden', !host); st.disabled = !Net.canStart();
  $('#on-status').textContent = host ? (P.length < 2 ? 'Aguardando pelo menos mais 1 jogador para iniciar…' : 'Pronto! Toque em INICIAR PARTIDA.') : 'Aguardando o host iniciar a partida…';
  const pg = $('#on-ping'); pg.classList.toggle('hidden', host); if (!host) pg.textContent = 'PING ' + (Net.ping || '--') + ' ms';
}
$('#on-start').onclick = () => {
  if (!Net.canStart()) return; SFX.resume(); SFX.play('go');
  const cfg = Net.hostStart(); if (cfg) { app.series = null; startGame(cfg); }
};

// ---- eventos do Net
Net.on.status = t => { if (onlineScreenActive() && !$('#on-home').classList.contains('hidden')) onMsg(t); };
Net.on.room = () => {
  if (app.state === 'result' && Net.phase === 'lobby') { onlineToLobby(); return; }
  if (onlineScreenActive()) { onlineView(true); onlineRender(); }
  else if (Net.phase === 'lobby' && !Net.opened) { /* host/cliente acabou de conectar enquanto a tela estava aberta */ }
};
Net.on.error = (msg) => {
  if (app.state === 'game' || app.state === 'result') { leaveGame('online'); }
  else if (!onlineScreenActive()) go('online');
  onlineView(false); onBusy(false); onMsg(msg, 'err'); toast(msg);
};
Net.on.lost = msg => {
  if (app.state === 'game' || app.state === 'result' || app.state === 'paused') leaveGame('online'); else go('online');
  onlineView(false); onBusy(false); onMsg(msg, 'err'); toast(msg);
};
Net.on.left = (p) => { toast(p.name + ' saiu da sala'); };
Net.on.start = cfg => { app.series = null; startGame(cfg); };
Net.on.end = res => onlineResult(res);
// o convidado entrou com sucesso → mostra a sala
{
  const _room = Net.on.room;
  Net.on.room = function () { if (Net.role && onlineScreenActive()) { onlineView(true); } _room(); };
}

function onlineToLobby() {
  app.state = 'menu'; app.game = null; app.vic = null; Controls.setMode('none'); $('#hud').classList.add('hidden'); $('#ctrl').classList.add('hidden');
  document.body.classList.remove('netg', 'awk-on', 'kb'); newMenuScene(); SFX.duck(false); SFX.music('menu');
  showScreen('online'); app.inCustom = false; onlineView(true); onlineRender();
}
function onlineHostEnd(sc) { const res = Net.hostEnd(sc); onlineResult(res); }
function onlineResult(res) {
  app.state = 'result'; Controls.reset(); $('#hud').classList.add('hidden'); $('#ctrl').classList.add('hidden'); SFX.duck(false);
  const me = Net.pid, row = res.rows.find(r => r.pid === me), win = res.winner === me, host = Net.role === 'host';
  const wname = (res.rows.find(r => r.pid === res.winner) || {}).name;
  const t = $('#or-title'); t.textContent = res.draw ? 'EMPATE!' : win ? 'VITÓRIA!' : (wname || '?') + ' VENCEU'; t.classList.toggle('lose', !win);
  t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  $('#or-sub').textContent = 'Sala ' + Net.code + ' · Duração ' + Math.floor(res.time / 60) + ':' + String(res.time % 60).padStart(2, '0');
  let tb = '<table><tr><th>Lutador</th><th>Elim.</th><th>Mortes</th><th>Dano</th></tr>';
  res.rows.forEach(r => { tb += `<tr class="${r.win ? 'win' : ''}"><td>${r.win ? ico('crown') + ' ' : ''}${String(r.name).replace(/[<>&]/g, '')}${r.pid === me ? ' (você)' : ''}</td><td>${r.kills}</td><td>${r.deaths}</td><td>${r.dmg}</td></tr>`; });
  $('#or-table').innerHTML = tb + '</table>';
  let coins = 5 + (win ? 20 : 0) + Math.min(30, (row ? row.kills : 0) * 5); coins = Math.min(coins, 45);
  const st = save.stats; st.matches++; if (win) st.wins++; else if (!res.draw) st.losses++; if (row) { st.kills += row.kills; st.deaths += row.deaths; st.dmg += row.dmg; } st.time += res.time;
  save.coins += coins; persist(); updCoins();
  $('#or-coins').innerHTML = ico('coin') + ' +' + coins + ' moedas';
  const b = $('#or-lobby'); b.classList.toggle('hidden', !host);
  showScreen('onres'); $('#s-onres').classList.add('active');
}
$('#or-lobby').onclick = () => { SFX.play('click'); Net.backToLobby(); };

// ---- indicador de ping no HUD + atualização periódica
setInterval(() => {
  const h = $('#net-hud'); if (!h) return;
  const show = !!Net.role && (app.state === 'game' || app.state === 'paused');
  h.classList.toggle('hidden', !show);
  if (show) h.textContent = 'SALA ' + Net.code + ' · ' + (Net.role === 'host' ? 'HOST' : 'PING ' + (Net.ping || '--') + ' ms');
  if (Net.role && onlineScreenActive() && !$('#on-room').classList.contains('hidden')) onlineRender();
}, 700);
window.__NET = Net;
