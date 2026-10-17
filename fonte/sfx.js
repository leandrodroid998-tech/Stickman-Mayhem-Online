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
