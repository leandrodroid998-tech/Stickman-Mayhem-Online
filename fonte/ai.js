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
