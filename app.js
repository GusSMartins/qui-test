/* =====================================================================
   REAGENTE — Plataforma de Química
   Design system: dark lab premium (tema único, pintado explicitamente)
   ===================================================================== */

:root{
  /* --- cores --- */
  --bg:            #05070f;
  --bg-2:          #080c1c;
  --surface:       #0d1226;
  --surface-2:     #121a33;
  --glass:         rgba(255,255,255,.045);
  --glass-strong:  rgba(255,255,255,.08);
  --line:          rgba(140,165,255,.16);
  --line-soft:     rgba(140,165,255,.09);

  --ink:           #eaeefb;
  --ink-2:         #b9c4e6;
  --muted:         #8391bd;   /* neutro com viés azul */

  --blue:          #4c6fff;
  --cyan:          #22d3ee;
  --violet:        #a855f7;
  --green:         #34d399;
  --amber:         #fbbf24;
  --rose:          #fb7185;

  --grad-primary:  linear-gradient(135deg, #4c6fff 0%, #22d3ee 100%);
  --grad-violet:   linear-gradient(135deg, #a855f7 0%, #4c6fff 100%);
  --grad-heat:     linear-gradient(135deg, #fb7185 0%, #fbbf24 100%);

  /* --- tipografia --- */
  --font-display: "Sora", "Trebuchet MS", sans-serif;
  --font-body: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, "SF Mono", Consolas, monospace;

  --step--1: clamp(.78rem, .76rem + .1vw, .84rem);
  --step-0:  clamp(.95rem, .92rem + .15vw, 1.02rem);
  --step-1:  clamp(1.1rem, 1.04rem + .3vw, 1.28rem);
  --step-2:  clamp(1.35rem, 1.22rem + .6vw, 1.72rem);
  --step-3:  clamp(1.7rem, 1.4rem + 1.3vw, 2.5rem);
  --step-4:  clamp(2.1rem, 1.5rem + 2.6vw, 3.6rem);

  /* --- espaço / forma --- */
  --r-sm: 10px;  --r-md: 16px;  --r-lg: 24px;  --r-pill: 999px;
  --rail-w: 244px;
  --shadow-1: 0 1px 2px rgba(0,0,0,.4);
  --shadow-2: 0 18px 40px -22px rgba(0,0,0,.9);
  --shadow-glow: 0 0 0 1px rgba(76,111,255,.25), 0 14px 40px -18px rgba(76,111,255,.55);
}

*,*::before,*::after{ box-sizing:border-box; }

html{ -webkit-text-size-adjust:100%; scroll-behavior:smooth; }

body{
  margin:0;
  min-height:100vh;
  background:
    radial-gradient(1100px 620px at 12% -8%, rgba(76,111,255,.20), transparent 62%),
    radial-gradient(900px 560px at 92% 4%, rgba(168,85,247,.16), transparent 60%),
    radial-gradient(800px 500px at 60% 110%, rgba(34,211,238,.10), transparent 60%),
    var(--bg);
  background-attachment: fixed;
  color:var(--ink);
  font-family:var(--font-body);
  font-size:var(--step-0);
  line-height:1.62;
  -webkit-font-smoothing:antialiased;
}

h1,h2,h3,h4{ font-family:var(--font-display); font-weight:700; line-height:1.15; text-wrap:balance; margin:0; letter-spacing:-.01em; }
p{ margin:0; }
img{ max-width:100%; }
button, input, select, textarea{ font:inherit; color:inherit; }

a{ color:var(--cyan); text-decoration-color:rgba(34,211,238,.4); text-underline-offset:3px; }

:focus-visible{ outline:2px solid var(--cyan); outline-offset:3px; border-radius:6px; }

.skip-link{
  position:fixed; left:12px; top:-60px; z-index:200;
  background:var(--surface-2); color:var(--ink);
  padding:10px 16px; border-radius:var(--r-sm); border:1px solid var(--line);
  transition:top .2s;
}
.skip-link:focus{ top:12px; }

.sr-only{
  position:absolute; width:1px; height:1px; padding:0; margin:-1px;
  overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0;
}

/* =====================================================================
   SHELL
   ===================================================================== */
.app{ min-height:100vh; }

.topbar{
  position:sticky; top:0; z-index:60;
  display:flex; align-items:center; gap:14px;
  padding:10px clamp(12px,3vw,24px);
  background:rgba(5,7,15,.78);
  backdrop-filter:blur(16px);
  -webkit-backdrop-filter:blur(16px);
  border-bottom:1px solid var(--line-soft);
}

.menu-btn{
  display:grid; place-content:center; gap:4px;
  width:40px; height:40px; padding:0;
  background:var(--glass); border:1px solid var(--line); border-radius:12px; cursor:pointer;
}
.menu-btn span{ display:block; width:16px; height:2px; background:var(--ink-2); border-radius:2px; }

.brand{ display:flex; align-items:center; gap:10px; text-decoration:none; color:var(--ink); margin-right:auto; }
.brand-mark{
  width:30px; height:30px; border-radius:9px; background:var(--grad-primary);
  box-shadow:var(--shadow-glow); position:relative; flex:none;
}
.brand-mark::after{
  content:""; position:absolute; inset:7px; border-radius:50%;
  border:2px solid rgba(5,7,15,.75); border-right-color:transparent; transform:rotate(20deg);
}
.brand-text{ font-family:var(--font-display); font-weight:800; letter-spacing:.14em; font-size:.82rem; display:flex; flex-direction:column; }
.brand-text em{ font-style:normal; font-family:var(--font-body); font-weight:400; letter-spacing:.02em; font-size:.66rem; color:var(--muted); }

.topbar-stats{ display:flex; align-items:center; gap:8px; }
.chip{
  display:inline-flex; align-items:center; gap:6px;
  padding:5px 11px; border-radius:var(--r-pill);
  background:var(--glass); border:1px solid var(--line);
  font-size:var(--step--1); font-family:var(--font-mono); white-space:nowrap;
}
.chip b{ font-weight:600; color:var(--ink); }
.chip.level{ background:linear-gradient(135deg, rgba(76,111,255,.28), rgba(34,211,238,.18)); border-color:rgba(76,111,255,.5); }
.chip.streak b{ color:var(--amber); }

/* --- rail --- */
.rail{
  position:fixed; inset:56px auto 0 0; width:var(--rail-w); z-index:70;
  transform:translateX(-102%); transition:transform .28s cubic-bezier(.2,.8,.2,1);
  background:rgba(8,12,28,.96);
  border-right:1px solid var(--line-soft);
  overflow-y:auto;
}
.rail.open{ transform:none; }
.rail-inner{ padding:16px 12px 28px; display:flex; flex-direction:column; gap:2px; }
.rail-label{
  font-size:.68rem; letter-spacing:.16em; text-transform:uppercase;
  color:var(--muted); margin:16px 0 6px 12px;
}
.rail-link{
  display:flex; align-items:center; gap:11px;
  padding:9px 12px; border-radius:12px;
  color:var(--ink-2); text-decoration:none; font-size:.92rem;
  border:1px solid transparent;
  transition:background .18s, color .18s, border-color .18s;
}
.rail-link .ri{ width:20px; text-align:center; opacity:.85; font-size:.95em; }
.rail-link:hover{ background:var(--glass); color:var(--ink); }
.rail-link.active{
  background:linear-gradient(90deg, rgba(76,111,255,.22), rgba(76,111,255,.02));
  border-color:rgba(76,111,255,.35); color:#fff;
}
.rail-foot{ margin-top:22px; padding:0 12px; }
.ghost-btn{
  width:100%; padding:8px 12px; border-radius:10px; cursor:pointer;
  background:transparent; border:1px dashed var(--line); color:var(--muted); font-size:.82rem;
}
.ghost-btn:hover{ color:var(--rose); border-color:rgba(251,113,133,.5); }

.rail-scrim{ position:fixed; inset:0; z-index:65; background:rgba(3,5,12,.6); backdrop-filter:blur(2px); }

.main{ padding:22px clamp(14px,3.4vw,34px) 96px; max-width:1180px; margin-inline:auto; }
.main:focus{ outline:none; }

/* --- tabbar mobile --- */
.tabbar{
  position:fixed; left:0; right:0; bottom:0; z-index:60;
  display:grid; grid-template-columns:repeat(5,1fr);
  background:rgba(8,12,28,.94); backdrop-filter:blur(14px);
  border-top:1px solid var(--line-soft);
  padding-bottom:env(safe-area-inset-bottom);
}
.tabbar a{
  display:flex; flex-direction:column; align-items:center; gap:3px;
  padding:9px 4px 8px; font-size:.66rem; letter-spacing:.03em;
  color:var(--muted); text-decoration:none;
}
.tabbar a span{ font-size:1.05rem; line-height:1; }
.tabbar a.active{ color:var(--cyan); }

@media (min-width:1000px){
  .menu-btn{ display:none; }
  .rail{ transform:none; background:transparent; border-right:1px solid var(--line-soft); }
  .rail-scrim{ display:none !important; }
  .main{ margin-left:var(--rail-w); max-width:1240px; padding-bottom:60px; }
  .tabbar{ display:none; }
}

/* =====================================================================
   BLOCOS BÁSICOS
   ===================================================================== */
.view{ display:flex; flex-direction:column; gap:clamp(18px,2.6vw,30px); }

.panel{
  background:linear-gradient(180deg, var(--glass), rgba(255,255,255,.015));
  border:1px solid var(--line-soft);
  border-radius:var(--r-lg);
  padding:clamp(16px,2.4vw,26px);
  box-shadow:var(--shadow-2);
}
.panel.flat{ box-shadow:none; background:rgba(255,255,255,.025); }

.eyebrow{
  font-family:var(--font-mono); font-size:.72rem; letter-spacing:.2em; text-transform:uppercase;
  color:var(--cyan); margin-bottom:8px;
}
.lead{ color:var(--ink-2); max-width:66ch; }
.muted{ color:var(--muted); }
.small{ font-size:var(--step--1); }
.mono{ font-family:var(--font-mono); }
.center{ text-align:center; }

.section-title{ font-size:var(--step-2); margin-bottom:4px; }
.section-head{ display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:14px; }

.grid{ display:grid; gap:14px; }
.grid.two{ grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); }
.grid.three{ grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); }
.grid.four{ grid-template-columns:repeat(auto-fit,minmax(165px,1fr)); }
.row{ display:flex; gap:10px; flex-wrap:wrap; align-items:center; }

/* --- botões --- */
.btn{
  display:inline-flex; align-items:center; justify-content:center; gap:9px;
  padding:12px 22px; border-radius:var(--r-pill); cursor:pointer;
  border:1px solid transparent; font-weight:600; font-family:var(--font-display);
  font-size:.94rem; letter-spacing:.01em; text-decoration:none;
  transition:transform .16s, box-shadow .2s, background .2s, border-color .2s;
}
.btn:active{ transform:translateY(1px) scale(.995); }
.btn-primary{ background:var(--grad-primary); color:#03060f; box-shadow:var(--shadow-glow); }
.btn-primary:hover{ box-shadow:0 0 0 1px rgba(76,111,255,.4), 0 18px 44px -14px rgba(34,211,238,.7); }
.btn-ghost{ background:var(--glass); border-color:var(--line); color:var(--ink); }
.btn-ghost:hover{ background:var(--glass-strong); border-color:rgba(140,165,255,.36); }
.btn-sm{ padding:8px 15px; font-size:.85rem; }
.btn[disabled]{ opacity:.45; cursor:not-allowed; }

/* --- barras de progresso --- */
.bar{ height:9px; border-radius:var(--r-pill); background:rgba(255,255,255,.07); overflow:hidden; }
.bar > i{ display:block; height:100%; border-radius:inherit; background:var(--grad-primary); transition:width .7s cubic-bezier(.2,.8,.2,1); }
.bar.thin{ height:6px; }
.bar.green > i{ background:linear-gradient(90deg,#34d399,#22d3ee); }
.bar.violet > i{ background:var(--grad-violet); }

.meter-row{ display:grid; grid-template-columns:minmax(120px,1.1fr) 3fr auto; gap:12px; align-items:center; padding:9px 0; border-bottom:1px solid var(--line-soft); }
.meter-row:last-child{ border-bottom:0; }
.meter-row b{ font-weight:500; font-size:.9rem; }
.meter-row .val{ font-family:var(--font-mono); font-size:.84rem; color:var(--ink-2); font-variant-numeric:tabular-nums; }

/* --- stats --- */
.stat{
  padding:16px 18px; border-radius:var(--r-md);
  background:rgba(255,255,255,.03); border:1px solid var(--line-soft);
  display:flex; flex-direction:column; gap:2px;
}
.stat .k{ font-family:var(--font-mono); font-size:1.7rem; font-weight:600; line-height:1.1; font-variant-numeric:tabular-nums; }
.stat .l{ font-size:.76rem; letter-spacing:.09em; text-transform:uppercase; color:var(--muted); }
.stat.accent .k{ background:var(--grad-primary); -webkit-background-clip:text; background-clip:text; color:transparent; }
.stat.warm .k{ color:var(--amber); }
.stat.good .k{ color:var(--green); }

/* =====================================================================
   HERO
   ===================================================================== */
.hero{
  position:relative; overflow:hidden;
  border-radius:var(--r-lg); border:1px solid var(--line);
  background:
    radial-gradient(720px 340px at 80% 0%, rgba(168,85,247,.28), transparent 65%),
    radial-gradient(620px 320px at 8% 100%, rgba(34,211,238,.22), transparent 62%),
    linear-gradient(160deg, #0b1128, #070a18);
  padding:clamp(24px,4vw,46px);
}
.hero canvas{ position:absolute; inset:0; width:100%; height:100%; opacity:.55; }
.hero-content{ position:relative; display:flex; flex-direction:column; gap:16px; max-width:64ch; }
.hero h1{ font-size:var(--step-4); font-weight:800; letter-spacing:-.025em; }
.hero h1 .grad{ background:var(--grad-primary); -webkit-background-clip:text; background-clip:text; color:transparent; }
.hero .verbs{ display:flex; gap:10px; flex-wrap:wrap; font-family:var(--font-display); font-weight:600; color:var(--ink-2); }
.hero .verbs span{ padding:4px 12px; border-radius:var(--r-pill); background:rgba(255,255,255,.05); border:1px solid var(--line-soft); font-size:.82rem; }

/* =====================================================================
   MAPA DA JORNADA
   ===================================================================== */
.journey{ display:flex; flex-direction:column; gap:0; align-items:center; }
.jnode{
  width:min(520px,100%); display:grid; grid-template-columns:56px 1fr auto; gap:16px; align-items:center;
  padding:16px 18px; border-radius:var(--r-md);
  background:rgba(255,255,255,.035); border:1px solid var(--line-soft);
  text-decoration:none; color:var(--ink); position:relative;
  transition:transform .18s, border-color .18s, background .18s;
}
.jnode:hover{ transform:translateY(-2px); border-color:rgba(76,111,255,.45); background:rgba(76,111,255,.09); }
.jnode .badge{
  width:56px; height:56px; border-radius:18px; display:grid; place-content:center; font-size:1.5rem;
  background:linear-gradient(150deg, rgba(255,255,255,.1), rgba(255,255,255,.02)); border:1px solid var(--line);
}
.jnode.done .badge{ background:linear-gradient(150deg, rgba(52,211,153,.3), rgba(52,211,153,.05)); border-color:rgba(52,211,153,.5); }
.jnode.current{ border-color:rgba(34,211,238,.55); box-shadow:0 0 0 1px rgba(34,211,238,.2), 0 18px 50px -30px rgba(34,211,238,.9); }
.jnode h3{ font-size:1.05rem; }
.jnode p{ font-size:.84rem; color:var(--muted); }
.jnode .state{ font-family:var(--font-mono); font-size:.75rem; color:var(--muted); text-align:right; }
.jnode.done .state{ color:var(--green); }
.jline{ width:2px; height:34px; background:linear-gradient(180deg, rgba(76,111,255,.6), rgba(34,211,238,.15)); position:relative; }
.jline::after{ content:"▼"; position:absolute; bottom:-6px; left:-5px; font-size:.6rem; color:rgba(34,211,238,.6); }

/* =====================================================================
   AULA — estrutura pedagógica
   ===================================================================== */
.lesson{ display:flex; flex-direction:column; gap:16px; }

.block{ border-radius:var(--r-md); padding:clamp(15px,2vw,22px); border:1px solid var(--line-soft); background:rgba(255,255,255,.028); }
.block h3{ font-size:var(--step-1); margin-bottom:8px; }
.block p + p{ margin-top:10px; }

.block-hook{
  border-left:3px solid var(--cyan);
  background:linear-gradient(100deg, rgba(34,211,238,.12), rgba(255,255,255,.02) 60%);
}
.block-hook .q{ font-family:var(--font-display); font-size:var(--step-1); font-weight:600; }

.block-formal{ border-color:rgba(140,165,255,.22); background:rgba(76,111,255,.07); }
.block-formal .def{ font-family:var(--font-mono); font-size:.92rem; color:var(--ink); }

.block-macete{
  border:1px solid rgba(251,191,36,.35);
  background:linear-gradient(120deg, rgba(251,191,36,.14), rgba(251,113,133,.06));
}
.block-macete .phrase{ font-family:var(--font-display); font-weight:700; font-size:var(--step-2); line-height:1.25; letter-spacing:-.01em; }

.block-trap{
  border:1px solid rgba(251,113,133,.32);
  background:linear-gradient(120deg, rgba(251,113,133,.12), rgba(255,255,255,.02));
}

.block-life{ border-color:rgba(52,211,153,.28); background:rgba(52,211,153,.07); }

.tag{
  display:inline-flex; align-items:center; gap:6px; padding:3px 10px; border-radius:var(--r-pill);
  font-family:var(--font-mono); font-size:.68rem; letter-spacing:.12em; text-transform:uppercase;
  border:1px solid var(--line); color:var(--ink-2); background:rgba(255,255,255,.04); margin-bottom:10px;
}
.tag.cyan{ color:var(--cyan); border-color:rgba(34,211,238,.4); }
.tag.amber{ color:var(--amber); border-color:rgba(251,191,36,.4); }
.tag.rose{ color:var(--rose); border-color:rgba(251,113,133,.4); }
.tag.green{ color:var(--green); border-color:rgba(52,211,153,.4); }
.tag.violet{ color:var(--violet); border-color:rgba(168,85,247,.4); }

.summary-list{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:9px; }
.summary-list li{ display:flex; gap:10px; align-items:flex-start; font-size:.94rem; }
.summary-list li::before{ content:"→"; color:var(--cyan); font-family:var(--font-mono); flex:none; }

.formula{
  font-family:var(--font-mono); font-size:1.18rem; font-weight:500;
  padding:14px 18px; border-radius:var(--r-sm); text-align:center;
  background:rgba(5,8,20,.6); border:1px solid var(--line);
  overflow-x:auto; white-space:nowrap;
}
.formula sub{ font-size:.72em; }
.var-list{ display:grid; gap:8px; margin-top:12px; }
.var-list div{ display:grid; grid-template-columns:64px 1fr; gap:12px; align-items:baseline; font-size:.88rem; }
.var-list b{ font-family:var(--font-mono); color:var(--cyan); font-weight:600; }

/* --- navegação de aulas --- */
.lesson-nav{ display:flex; gap:8px; flex-wrap:wrap; }
.lesson-pill{
  padding:8px 14px; border-radius:var(--r-pill); cursor:pointer; font-size:.84rem;
  background:rgba(255,255,255,.04); border:1px solid var(--line-soft); color:var(--ink-2);
  display:inline-flex; align-items:center; gap:7px; text-decoration:none;
}
.lesson-pill:hover{ background:var(--glass-strong); color:var(--ink); }
.lesson-pill.active{ background:var(--grad-primary); color:#04070f; border-color:transparent; font-weight:600; }
.lesson-pill .dot{ width:7px; height:7px; border-radius:50%; background:rgba(255,255,255,.25); }
.lesson-pill.done .dot{ background:var(--green); }
.lesson-pill.active .dot{ background:rgba(0,0,0,.4); }

.next-action{
  display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap;
  padding:16px 20px; border-radius:var(--r-md);
  background:linear-gradient(100deg, rgba(76,111,255,.16), rgba(34,211,238,.06));
  border:1px solid rgba(76,111,255,.32);
}
.next-action p{ font-size:.9rem; color:var(--ink-2); }

/* =====================================================================
   SIMULAÇÕES / CONTROLES
   ===================================================================== */
.sim{ display:grid; gap:16px; }
.sim-stage{
  position:relative; border-radius:var(--r-md); overflow:hidden;
  background:radial-gradient(120% 90% at 50% 0%, #0f1733, #070a18);
  border:1px solid var(--line-soft);
}
.sim-stage canvas, .sim-stage svg{ display:block; width:100%; height:auto; }
.sim-readout{
  display:flex; gap:10px; flex-wrap:wrap; align-items:center;
  font-family:var(--font-mono); font-size:.84rem; color:var(--ink-2);
}
.readout-item{ padding:6px 12px; border-radius:var(--r-sm); background:rgba(5,8,20,.6); border:1px solid var(--line-soft); font-variant-numeric:tabular-nums; }
.readout-item b{ color:var(--cyan); font-weight:600; }
.readout-item.state-sol b{ color:#7dd3fc; }
.readout-item.state-liq b{ color:var(--blue); }
.readout-item.state-gas b{ color:var(--rose); }

.control{ display:flex; flex-direction:column; gap:6px; }
.control label{ font-size:.82rem; color:var(--ink-2); display:flex; justify-content:space-between; gap:10px; }
.control label b{ font-family:var(--font-mono); color:var(--cyan); font-variant-numeric:tabular-nums; }

input[type=range]{
  -webkit-appearance:none; appearance:none; width:100%; height:28px; background:transparent; cursor:pointer;
}
input[type=range]::-webkit-slider-runnable-track{ height:6px; border-radius:var(--r-pill); background:linear-gradient(90deg, rgba(76,111,255,.7), rgba(34,211,238,.7)); }
input[type=range]::-webkit-slider-thumb{
  -webkit-appearance:none; width:20px; height:20px; margin-top:-7px; border-radius:50%;
  background:#fff; border:3px solid var(--blue); box-shadow:0 3px 12px rgba(0,0,0,.6);
}
input[type=range]::-moz-range-track{ height:6px; border-radius:999px; background:linear-gradient(90deg, rgba(76,111,255,.7), rgba(34,211,238,.7)); }
input[type=range]::-moz-range-thumb{ width:18px; height:18px; border-radius:50%; background:#fff; border:3px solid var(--blue); }

input[type=number], input[type=text], select{
  width:100%; padding:10px 12px; border-radius:var(--r-sm);
  background:rgba(5,8,20,.65); border:1px solid var(--line); color:var(--ink);
  font-family:var(--font-mono); font-size:.92rem;
}
input[type=number]:focus, input[type=text]:focus, select:focus{ border-color:var(--blue); outline:none; box-shadow:0 0 0 3px rgba(76,111,255,.22); }

.field{ display:flex; flex-direction:column; gap:5px; }
.field span{ font-size:.78rem; color:var(--muted); letter-spacing:.03em; }

.result-box{
  border-radius:var(--r-md); padding:16px 18px; text-align:center;
  background:linear-gradient(135deg, rgba(52,211,153,.14), rgba(34,211,238,.08));
  border:1px solid rgba(52,211,153,.35);
}
.result-box .big{ font-family:var(--font-mono); font-size:1.8rem; font-weight:600; color:var(--green); font-variant-numeric:tabular-nums; }
.result-box .steps{ font-family:var(--font-mono); font-size:.8rem; color:var(--ink-2); margin-top:8px; }

/* --- diagrama de mudanças de estado --- */
.phase-diagram-wrap{ display:grid; gap:14px; }
.transitions{ display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; }
.trans-btn{
  padding:12px 14px; border-radius:var(--r-md); cursor:pointer; text-align:left;
  background:rgba(255,255,255,.035); border:1px solid var(--line-soft); color:var(--ink);
  display:flex; flex-direction:column; gap:3px; transition:transform .16s, border-color .18s, background .18s;
}
.trans-btn:hover{ transform:translateY(-2px); background:var(--glass-strong); }
.trans-btn.endo{ border-left:3px solid var(--rose); }
.trans-btn.exo{ border-left:3px solid #7dd3fc; }
.trans-btn.active{ border-color:var(--cyan); background:rgba(34,211,238,.12); }
.trans-btn b{ font-size:.95rem; }
.trans-btn span{ font-family:var(--font-mono); font-size:.74rem; color:var(--muted); }

.energy-cols{ display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:14px; }
.energy-col{ border-radius:var(--r-md); padding:16px 18px; border:1px solid var(--line-soft); }
.energy-col.in{ background:linear-gradient(135deg, rgba(251,113,133,.14), transparent); border-color:rgba(251,113,133,.35); }
.energy-col.out{ background:linear-gradient(135deg, rgba(125,211,252,.14), transparent); border-color:rgba(125,211,252,.35); }
.energy-col h4{ font-size:.95rem; margin-bottom:8px; }
.energy-col ul{ margin:0; padding-left:18px; font-size:.9rem; color:var(--ink-2); }

/* =====================================================================
   EXERCÍCIOS
   ===================================================================== */
.quiz{ display:flex; flex-direction:column; gap:16px; }
.quiz-head{ display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; }
.level-badge{
  display:inline-flex; align-items:center; gap:7px; padding:5px 12px; border-radius:var(--r-pill);
  font-size:.74rem; font-family:var(--font-mono); letter-spacing:.06em; text-transform:uppercase;
  border:1px solid var(--line); background:rgba(255,255,255,.04);
}
.level-1{ color:#86efac; border-color:rgba(134,239,172,.4); }
.level-2{ color:#fde68a; border-color:rgba(253,230,138,.4); }
.level-3{ color:#fdba74; border-color:rgba(253,186,116,.4); }
.level-4{ color:#fda4af; border-color:rgba(253,164,175,.4); }
.level-5{ color:#d8b4fe; border-color:rgba(216,180,254,.4); }

.q-prompt{ font-size:var(--step-1); font-family:var(--font-display); font-weight:600; line-height:1.4; }
.q-context{ color:var(--ink-2); font-size:.94rem; }

.options{ display:flex; flex-direction:column; gap:9px; }
.option{
  display:flex; align-items:flex-start; gap:12px; width:100%; text-align:left;
  padding:13px 16px; border-radius:var(--r-md); cursor:pointer;
  background:rgba(255,255,255,.032); border:1px solid var(--line-soft); color:var(--ink);
  transition:background .16s, border-color .16s, transform .16s;
}
.option:hover:not(:disabled){ background:var(--glass-strong); border-color:rgba(140,165,255,.35); transform:translateX(2px); }
.option .key{
  flex:none; width:26px; height:26px; border-radius:8px; display:grid; place-content:center;
  font-family:var(--font-mono); font-size:.78rem; background:rgba(255,255,255,.07); border:1px solid var(--line);
}
.option.correct{ background:rgba(52,211,153,.16); border-color:rgba(52,211,153,.6); }
.option.correct .key{ background:var(--green); color:#04120c; border-color:transparent; }
.option.wrong{ background:rgba(251,113,133,.14); border-color:rgba(251,113,133,.55); }
.option.wrong .key{ background:var(--rose); color:#2a0710; border-color:transparent; }
.option:disabled{ cursor:default; }
.option.dim{ opacity:.55; }

.feedback{ border-radius:var(--r-md); padding:16px 18px; border:1px solid var(--line-soft); display:flex; flex-direction:column; gap:10px; }
.feedback.ok{ background:rgba(52,211,153,.1); border-color:rgba(52,211,153,.4); }
.feedback.no{ background:rgba(251,113,133,.09); border-color:rgba(251,113,133,.4); }
.feedback .fb-title{ font-family:var(--font-display); font-weight:700; font-size:1.05rem; display:flex; align-items:center; gap:9px; }
.feedback.ok .fb-title{ color:var(--green); }
.feedback.no .fb-title{ color:var(--rose); }
.feedback .why{ font-size:.93rem; color:var(--ink-2); }
.feedback .hint{ font-size:.88rem; color:var(--amber); border-left:2px solid rgba(251,191,36,.5); padding-left:12px; }

/* --- tipos especiais --- */
.match-grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.match-col{ display:flex; flex-direction:column; gap:8px; }
.match-item{
  padding:11px 14px; border-radius:var(--r-sm); cursor:pointer; text-align:left; font-size:.88rem;
  background:rgba(255,255,255,.035); border:1px solid var(--line-soft); color:var(--ink);
}
.match-item:hover:not(:disabled){ background:var(--glass-strong); }
.match-item.sel{ border-color:var(--cyan); background:rgba(34,211,238,.14); }
.match-item.paired{ opacity:.5; }
.match-item.correct{ border-color:rgba(52,211,153,.6); background:rgba(52,211,153,.14); }
.match-item.wrong{ border-color:rgba(251,113,133,.6); background:rgba(251,113,133,.12); }

.order-list{ display:flex; flex-direction:column; gap:8px; }
.order-item{
  display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:var(--r-sm);
  background:rgba(255,255,255,.035); border:1px solid var(--line-soft); cursor:grab; font-size:.9rem;
}
.order-item[draggable=true]:active{ cursor:grabbing; }
.order-item.dragging{ opacity:.4; border-style:dashed; }
.order-item .num{ font-family:var(--font-mono); color:var(--cyan); font-size:.8rem; width:20px; }
.order-item .moves{ margin-left:auto; display:flex; gap:4px; }
.order-item .moves button{
  width:28px; height:28px; border-radius:8px; cursor:pointer; line-height:1;
  background:rgba(255,255,255,.06); border:1px solid var(--line); color:var(--ink-2);
}
.order-item.correct{ border-color:rgba(52,211,153,.55); background:rgba(52,211,153,.12); }
.order-item.wrong{ border-color:rgba(251,113,133,.5); background:rgba(251,113,133,.1); }

.fill-slots{ display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:center; font-family:var(--font-mono); font-size:1.2rem; padding:14px; background:rgba(5,8,20,.55); border-radius:var(--r-sm); border:1px solid var(--line); }
.slot{
  min-width:74px; padding:6px 12px; border-radius:8px; cursor:pointer;
  border:1px dashed rgba(140,165,255,.5); background:rgba(76,111,255,.1); color:var(--ink-2); text-align:center;
}
.slot.filled{ border-style:solid; color:var(--cyan); background:rgba(34,211,238,.12); }
.slot.correct{ border-color:var(--green); color:var(--green); background:rgba(52,211,153,.14); }
.slot.wrong{ border-color:var(--rose); color:var(--rose); background:rgba(251,113,133,.12); }
.token-bank{ display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
.token{
  padding:7px 14px; border-radius:var(--r-pill); cursor:pointer; font-family:var(--font-mono); font-size:.9rem;
  background:rgba(255,255,255,.06); border:1px solid var(--line); color:var(--ink);
}
.token:hover:not(:disabled){ background:var(--glass-strong); }
.token.used{ opacity:.3; }

.num-answer{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.num-answer input{ max-width:180px; }
.num-answer .unit{ font-family:var(--font-mono); color:var(--muted); }

/* =====================================================================
   FLASHCARDS
   ===================================================================== */
.flashcard{
  perspective:1400px; cursor:pointer; min-height:230px; background:none; border:0; padding:0; width:100%;
}
.flash-inner{
  position:relative; width:100%; min-height:230px; transition:transform .6s cubic-bezier(.3,.9,.3,1); transform-style:preserve-3d;
}
.flashcard.flipped .flash-inner{ transform:rotateY(180deg); }
.flash-face{
  position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden;
  border-radius:var(--r-lg); padding:26px; display:flex; flex-direction:column; justify-content:center; gap:12px; text-align:center;
  border:1px solid var(--line); background:linear-gradient(150deg, rgba(76,111,255,.14), rgba(255,255,255,.02));
}
.flash-face.back{ transform:rotateY(180deg); background:linear-gradient(150deg, rgba(34,211,238,.16), rgba(168,85,247,.08)); }
.flash-face .fq{ font-family:var(--font-display); font-size:var(--step-1); font-weight:600; }
.flash-face .fa{ font-family:var(--font-display); font-size:var(--step-2); font-weight:700; color:var(--cyan); }
.flash-face .fw{ font-size:.9rem; color:var(--ink-2); }
.flash-hint{ font-family:var(--font-mono); font-size:.72rem; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }

/* =====================================================================
   ÁRVORE DE DECISÃO / MAPA MENTAL
   ===================================================================== */
.tree{ display:flex; flex-direction:column; gap:10px; }
.tree-q{ font-family:var(--font-display); font-weight:600; font-size:var(--step-1); }
.tree-opt{
  display:flex; justify-content:space-between; align-items:center; gap:14px; text-align:left; width:100%;
  padding:13px 16px; border-radius:var(--r-md); cursor:pointer;
  background:rgba(255,255,255,.035); border:1px solid var(--line-soft); color:var(--ink);
}
.tree-opt:hover{ background:rgba(76,111,255,.12); border-color:rgba(76,111,255,.4); }
.tree-opt .arrow{ font-family:var(--font-mono); color:var(--cyan); }

.mindmap{ display:flex; flex-direction:column; align-items:center; gap:0; }
.mm-node{
  width:min(430px,100%); padding:14px 18px; border-radius:var(--r-md); cursor:pointer; text-align:left;
  background:rgba(255,255,255,.035); border:1px solid var(--line-soft); color:var(--ink);
  display:flex; justify-content:space-between; align-items:center; gap:12px;
}
.mm-node:hover{ border-color:rgba(34,211,238,.5); background:rgba(34,211,238,.09); }
.mm-node b{ font-family:var(--font-display); font-size:.98rem; }
.mm-node span{ font-size:.78rem; color:var(--muted); font-family:var(--font-mono); }
.mm-link{ width:2px; height:22px; background:linear-gradient(180deg, rgba(34,211,238,.6), rgba(76,111,255,.2)); }
.mm-detail{
  width:min(430px,100%); margin-top:-2px; padding:14px 18px; border-radius:0 0 var(--r-md) var(--r-md);
  background:rgba(34,211,238,.07); border:1px solid rgba(34,211,238,.3); border-top:0; font-size:.9rem; color:var(--ink-2);
}

/* =====================================================================
   SIMULADO
   ===================================================================== */
.exam-bar{ display:flex; justify-content:space-between; align-items:center; gap:14px; flex-wrap:wrap; }
.timer{ font-family:var(--font-mono); font-size:1.1rem; font-variant-numeric:tabular-nums; color:var(--amber); }
.exam-dots{ display:flex; gap:5px; flex-wrap:wrap; }
.exam-dots i{ width:9px; height:9px; border-radius:50%; background:rgba(255,255,255,.15); display:block; }
.exam-dots i.ok{ background:var(--green); }
.exam-dots i.no{ background:var(--rose); }
.exam-dots i.now{ background:var(--cyan); box-shadow:0 0 0 3px rgba(34,211,238,.2); }

.score-ring{ display:grid; place-items:center; }
.score-ring .val{ font-family:var(--font-mono); font-size:2.4rem; font-weight:600; }

/* --- toasts --- */
.toast-area{ position:fixed; right:16px; bottom:80px; z-index:120; display:flex; flex-direction:column; gap:8px; pointer-events:none; }
@media (min-width:1000px){ .toast-area{ bottom:24px; } }
.toast{
  padding:11px 16px; border-radius:var(--r-pill); font-size:.86rem; font-weight:500;
  background:rgba(13,18,38,.96); border:1px solid var(--line); box-shadow:var(--shadow-2);
  animation:toastIn .35s cubic-bezier(.2,.9,.3,1);
}
.toast.xp{ border-color:rgba(52,211,153,.55); color:var(--green); font-family:var(--font-mono); }
.toast.level{ border-color:rgba(168,85,247,.6); color:#e9d5ff; }
@keyframes toastIn{ from{ opacity:0; transform:translateY(12px) scale(.96);} to{ opacity:1; transform:none;} }

.confetti{ position:fixed; inset:0; z-index:110; pointer-events:none; width:100%; height:100%; display:none; }
.confetti.on{ display:block; }

/* --- tabelas / listas de dados --- */
.table-wrap{ overflow-x:auto; border-radius:var(--r-md); border:1px solid var(--line-soft); }
table{ width:100%; border-collapse:collapse; font-size:.88rem; min-width:420px; }
th,td{ padding:10px 14px; text-align:left; border-bottom:1px solid var(--line-soft); }
th{ font-family:var(--font-mono); font-size:.72rem; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); background:rgba(255,255,255,.03); }
td.num{ font-family:var(--font-mono); font-variant-numeric:tabular-nums; }
tr:last-child td{ border-bottom:0; }

/* --- acordeão --- */
.acc{ border:1px solid var(--line-soft); border-radius:var(--r-md); overflow:hidden; background:rgba(255,255,255,.025); }
.acc + .acc{ margin-top:10px; }
.acc summary{
  padding:14px 18px; cursor:pointer; font-family:var(--font-display); font-weight:600; font-size:.98rem;
  display:flex; align-items:center; gap:10px; list-style:none;
}
.acc summary::-webkit-details-marker{ display:none; }
.acc summary::after{ content:"+"; margin-left:auto; font-family:var(--font-mono); color:var(--cyan); font-size:1.2rem; }
.acc[open] summary::after{ content:"−"; }
.acc .acc-body{ padding:0 18px 18px; color:var(--ink-2); font-size:.92rem; display:flex; flex-direction:column; gap:10px; }

/* --- badges de conclusão --- */
.chapter-end{
  text-align:center; padding:clamp(24px,4vw,44px);
  background:radial-gradient(600px 300px at 50% 0%, rgba(52,211,153,.18), transparent 70%), rgba(255,255,255,.03);
  border:1px solid rgba(52,211,153,.35); border-radius:var(--r-lg);
}
.chapter-end .big{ font-size:var(--step-3); font-family:var(--font-display); font-weight:800; }
.check-list{ list-style:none; padding:0; margin:16px auto; max-width:420px; display:flex; flex-direction:column; gap:8px; text-align:left; }
.check-list li{ display:flex; gap:10px; align-items:center; font-size:.94rem; }
.check-list li::before{ content:"✓"; color:var(--green); font-weight:700; }

/* --- animações discretas --- */
@keyframes pulse{ 0%,100%{ opacity:.55; } 50%{ opacity:1; } }
.pulse{ animation:pulse 2.4s ease-in-out infinite; }
@keyframes riseIn{ from{ opacity:.001; transform:translateY(10px);} to{ opacity:1; transform:none;} }
.rise{ animation:riseIn .4s ease-out both; }

@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{ animation-duration:.001ms !important; animation-iteration-count:1 !important; transition-duration:.001ms !important; scroll-behavior:auto !important; }
  .flash-inner{ transition:none; }
}

@media (max-width:620px){
  .topbar{ gap:8px; padding:8px 12px; }
  .topbar-stats .chip:nth-child(2){ display:none; }
  .brand-text{ font-size:.72rem; }
  .brand-text em{ display:none; }
  .chip{ padding:4px 9px; font-size:.72rem; }
}

@media (max-width:560px){
  .match-grid{ grid-template-columns:1fr; }
  .meter-row{ grid-template-columns:1fr auto; }
  .meter-row .bar{ grid-column:1 / -1; }
}
