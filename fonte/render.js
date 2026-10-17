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
