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
