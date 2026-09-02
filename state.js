/* =====================================================================
   sims.js — simulações e gráficos interativos
   Cada simulação recebe um elemento hospedeiro e se desenha dentro dele.
   Loops de animação se registram em Sims.active e são cancelados na
   troca de rota (Sims.clear()).
   ===================================================================== */

const REDUCED = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Sims = {
  active: [],
  clear(){ this.active.forEach(stop => { try{ stop(); }catch(e){} }); this.active = []; },
  loop(fn){
    let id = null, running = true;
    const step = ()=>{ if(!running) return; fn(); id = requestAnimationFrame(step); };
    id = requestAnimationFrame(step);
    this.active.push(()=>{ running = false; cancelAnimationFrame(id); });
  },
  mount(type, host, opts={}){
    const fn = this["build_"+type];
    if(typeof fn === "function") fn.call(this, host, opts);
    else host.innerHTML = `<p class="muted small">Simulação “${type}” indisponível.</p>`;
  },

  /* helper: canvas responsivo com resolução fixa */
  canvas(host, w, h, cls=""){
    const stage = document.createElement("div");
    stage.className = "sim-stage " + cls;
    const cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    cv.style.width = "100%"; cv.style.height = "auto";
    stage.appendChild(cv);
    host.appendChild(stage);
    return { stage, cv, ctx: cv.getContext("2d") };
  },

  slider(host, {label, min, max, step, value, unit="", onInput}){
    const wrap = document.createElement("div");
    wrap.className = "control";
    const id = "sl" + Math.random().toString(36).slice(2,8);
    wrap.innerHTML = `<label for="${id}">${label} <b id="${id}v">${value}${unit}</b></label>`;
    const inp = document.createElement("input");
    inp.type = "range"; inp.id = id; inp.min = min; inp.max = max; inp.step = step; inp.value = value;
    wrap.appendChild(inp);
    host.appendChild(wrap);
    const out = wrap.querySelector("#"+id+"v");
    const fire = ()=>{ const v = parseFloat(inp.value); out.textContent = (Math.round(v*100)/100) + unit; onInput(v); };
    inp.addEventListener("input", fire);
    fire();
    return inp;
  },

  readout(host, items){
    const box = document.createElement("div");
    box.className = "sim-readout";
    box.innerHTML = items.map(i=>`<span class="readout-item ${i.cls||""}">${i.label} <b>${i.value}</b></span>`).join("");
    host.appendChild(box);
    return box;
  },

/* =====================================================================
   1 · PARTÍCULAS × TEMPERATURA
   ===================================================================== */
build_particles(host){
  const { cv, ctx } = this.canvas(host, 840, 380);
  const controls = document.createElement("div"); controls.style.marginTop = "14px";
  host.appendChild(controls);
  const out = document.createElement("div"); host.appendChild(out);

  let T = -20; // °C
  const N = 90;
  const parts = [];
  for(let i=0;i<N;i++){
    const col = i % 10, row = (i/10)|0;
    parts.push({ hx: 200 + col*46, hy: 120 + row*26, x: 200 + col*46, y: 120 + row*26, vx:0, vy:0 });
  }

  const stateOf = t => t < 0 ? "SÓLIDO" : (t < 100 ? "LÍQUIDO" : "GASOSO");
  const clsOf = t => t < 0 ? "state-sol" : (t < 100 ? "state-liq" : "state-gas");

  const ro = this.readout(out, [
    { label:"Estado:", value:"SÓLIDO", cls:"state-sol" },
    { label:"Energia cinética média:", value:"baixa" },
    { label:"Organização:", value:"arranjo fixo" }
  ]);

  this.slider(controls, { label:"Temperatura", min:-40, max:160, step:1, value:-20, unit:" °C",
    onInput:v=>{
      T = v;
      const st = stateOf(T);
      ro.innerHTML = `
        <span class="readout-item ${clsOf(T)}">Estado: <b>${st}</b></span>
        <span class="readout-item">Energia cinética média: <b>${T<0?"baixa":T<100?"média":"alta"}</b></span>
        <span class="readout-item">Organização: <b>${T<0?"arranjo fixo":T<100?"desliza, mas unido":"livre e disperso"}</b></span>`;
    }
  });

  const draw = ()=>{
    ctx.clearRect(0,0,cv.width,cv.height);
    // recipiente
    ctx.strokeStyle = "rgba(140,165,255,.25)"; ctx.lineWidth = 2;
    ctx.strokeRect(40,40,760,300);

    const heat = Math.max(0,(T+40)/200);           // 0..1
    const free = T < 0 ? 0 : (T < 100 ? (T/100)*0.45 : 1);
    const jitter = T < 0 ? 1 + heat*4 : (T < 100 ? 6 + heat*10 : 16 + heat*20);

    parts.forEach((p,i)=>{
      if(free < 0.6){
        // preso: oscila em torno da posição de origem, com deriva no líquido
        const tgtX = p.hx + (free>0 ? Math.sin(performance.now()/700 + i)*free*90 : 0);
        const tgtY = p.hy + (free>0 ? Math.cos(performance.now()/900 + i*1.3)*free*50 : 0);
        p.x += (tgtX - p.x)*0.06 + (Math.random()-.5)*jitter*0.5;
        p.y += (tgtY - p.y)*0.06 + (Math.random()-.5)*jitter*0.5;
      }else{
        // gás: movimento livre com colisão nas paredes
        p.vx += (Math.random()-.5)*0.9; p.vy += (Math.random()-.5)*0.9;
        const sp = Math.hypot(p.vx,p.vy), max = 1.6 + heat*4.5;
        if(sp > max){ p.vx = p.vx/sp*max; p.vy = p.vy/sp*max; }
        p.x += p.vx; p.y += p.vy;
        if(p.x < 52 || p.x > 788) p.vx *= -1;
        if(p.y < 52 || p.y > 328) p.vy *= -1;
      }
      p.x = Math.max(50, Math.min(790, p.x));
      p.y = Math.max(50, Math.min(330, p.y));

      const hue = T < 0 ? 195 : (T < 100 ? 220 : 345);
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,9);
      g.addColorStop(0, `hsla(${hue},95%,75%,1)`);
      g.addColorStop(1, `hsla(${hue},95%,55%,0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x,p.y,9,0,7); ctx.fill();
      ctx.fillStyle = `hsl(${hue},90%,72%)`;
      ctx.beginPath(); ctx.arc(p.x,p.y,3.2,0,7); ctx.fill();
    });

    // termômetro
    const tx = 820;
    ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fillRect(tx-14,40,10,300);
    const frac = (T+40)/200;
    const grad = ctx.createLinearGradient(0,340,0,40);
    grad.addColorStop(0,"#22d3ee"); grad.addColorStop(.5,"#4c6fff"); grad.addColorStop(1,"#fb7185");
    ctx.fillStyle = grad; ctx.fillRect(tx-14, 340-300*frac, 10, 300*frac);
  };
  if(REDUCED()){ draw(); } else { this.loop(draw); }
},

/* =====================================================================
   2 · DIAGRAMA DE MUDANÇAS DE ESTADO
   ===================================================================== */
build_stateDiagram(host){
  const TRANS = [
    { id:"fusao", n:"Fusão", from:"SÓLIDO", to:"LÍQUIDO", energy:"absorve", txt:"O sólido recebe energia, as partículas vencem o arranjo rígido e passam a deslizar umas sobre as outras.", ex:"Gelo derretendo no copo." },
    { id:"solid", n:"Solidificação", from:"LÍQUIDO", to:"SÓLIDO", energy:"libera", txt:"As partículas perdem energia, se organizam em arranjo cristalino e liberam energia para a vizinhança.", ex:"Água virando gelo no congelador." },
    { id:"vapor", n:"Vaporização", from:"LÍQUIDO", to:"GÁS", energy:"absorve", txt:"As partículas ganham energia suficiente para se separar quase completamente.", ex:"Água fervendo na panela." },
    { id:"cond", n:"Condensação", from:"GÁS", to:"LÍQUIDO", energy:"libera", txt:"O vapor perde energia e as moléculas voltam a se aproximar, formando líquido.", ex:"Orvalho na garrafa gelada." },
    { id:"subl", n:"Sublimação", from:"SÓLIDO", to:"GÁS", energy:"absorve", txt:"O sólido passa direto para o estado gasoso, sem formar líquido.", ex:"Naftalina sumindo do armário." },
    { id:"depo", n:"Deposição", from:"GÁS", to:"SÓLIDO", energy:"libera", txt:"O gás passa direto para sólido. Também chamada de ressublimação.", ex:"Geada se formando na folha." }
  ];

  const wrap = document.createElement("div");
  wrap.className = "phase-diagram-wrap";
  wrap.innerHTML = `
    <div class="sim-stage" style="padding:18px">
      <svg viewBox="0 0 620 240" role="img" aria-label="Diagrama das mudanças de estado entre sólido, líquido e gás">
        <defs>
          <marker id="arw" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="#8391bd"></path>
          </marker>
        </defs>
        <g font-family="Sora, sans-serif" font-size="15" font-weight="700" text-anchor="middle">
          <rect x="30" y="90" width="130" height="56" rx="14" fill="rgba(125,211,252,.14)" stroke="rgba(125,211,252,.5)"></rect>
          <text x="95" y="124" fill="#7dd3fc">SÓLIDO</text>
          <rect x="245" y="90" width="130" height="56" rx="14" fill="rgba(76,111,255,.16)" stroke="rgba(76,111,255,.55)"></rect>
          <text x="310" y="124" fill="#93b0ff">LÍQUIDO</text>
          <rect x="460" y="90" width="130" height="56" rx="14" fill="rgba(251,113,133,.14)" stroke="rgba(251,113,133,.5)"></rect>
          <text x="525" y="124" fill="#fda4af">GÁS</text>
        </g>
        <g stroke="#8391bd" stroke-width="2" fill="none" marker-end="url(#arw)">
          <path d="M165,105 L238,105" data-t="fusao"></path>
          <path d="M240,132 L167,132" data-t="solid"></path>
          <path d="M380,105 L453,105" data-t="vapor"></path>
          <path d="M455,132 L382,132" data-t="cond"></path>
          <path d="M95,84 C95,30 525,30 525,84" data-t="subl"></path>
          <path d="M525,152 C525,212 95,212 95,152" data-t="depo"></path>
        </g>
        <g font-family="IBM Plex Mono, monospace" font-size="11" fill="#8391bd" text-anchor="middle">
          <text x="201" y="98">fusão</text>
          <text x="203" y="148">solidificação</text>
          <text x="416" y="98">vaporização</text>
          <text x="418" y="148">condensação</text>
          <text x="310" y="30">sublimação</text>
          <text x="310" y="218">deposição</text>
        </g>
      </svg>
    </div>
    <div class="transitions"></div>
    <div class="block block-formal" id="transInfo" style="min-height:96px">
      <p class="muted small">Clique em uma transformação para ver o sentido e o que acontece com a energia.</p>
    </div>
    <div class="energy-cols">
      <div class="energy-col in">
        <h4>🔥 Energia ENTRA (endotérmicas)</h4>
        <ul><li>Fusão</li><li>Vaporização</li><li>Sublimação</li></ul>
      </div>
      <div class="energy-col out">
        <h4>❄️ Energia SAI (exotérmicas)</h4>
        <ul><li>Solidificação</li><li>Condensação</li><li>Deposição</li></ul>
      </div>
    </div>`;
  host.appendChild(wrap);

  const btns = wrap.querySelector(".transitions");
  const info = wrap.querySelector("#transInfo");
  TRANS.forEach(t=>{
    const b = document.createElement("button");
    b.type = "button";
    b.className = "trans-btn " + (t.energy === "absorve" ? "endo" : "exo");
    b.innerHTML = `<b>${t.n}</b><span>${t.from} → ${t.to}</span>`;
    b.addEventListener("click", ()=>{
      wrap.querySelectorAll(".trans-btn").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      wrap.querySelectorAll("path[data-t]").forEach(p=>{
        const on = p.dataset.t === t.id;
        p.setAttribute("stroke", on ? (t.energy==="absorve" ? "#fb7185" : "#7dd3fc") : "#8391bd");
        p.setAttribute("stroke-width", on ? 3.5 : 2);
      });
      info.innerHTML = `
        <span class="tag ${t.energy==="absorve"?"rose":"cyan"}">${t.energy==="absorve"?"endotérmica":"exotérmica"}</span>
        <h3>${t.n} · ${t.from} → ${t.to}</h3>
        <p class="lead">${t.txt}</p>
        <p class="mono small" style="margin-top:10px;color:${t.energy==="absorve"?"#fda4af":"#7dd3fc"}">
          ${t.energy==="absorve" ? "ABSORVE ENERGIA · ΔH > 0" : "LIBERA ENERGIA · ΔH < 0"}</p>
        <p class="small muted" style="margin-top:6px">No dia a dia: ${t.ex}</p>`;
    });
    btns.appendChild(b);
  });
},

/* =====================================================================
   3 · DIAGRAMA DE FASES (P × T) INTERATIVO
   ===================================================================== */
build_phaseDiagram(host){
  const W = 840, H = 470, PAD = 60;
  const { cv, ctx } = this.canvas(host, W, H);
  const out = document.createElement("div"); out.style.marginTop = "14px"; host.appendChild(out);

  const TT = 35, PT = 30, TC = 78, PC = 82;              // ponto triplo e crítico (unidades relativas)
  const kv = Math.log(PC/PT)/(TC-TT), ks = 0.09;
  const vapP = t => PT*Math.exp(kv*(t-TT));
  const subP = t => PT*Math.exp(ks*(t-TT));
  const fusT = p => TT + (p-PT)*0.10;

  const X = t => PAD + (t/100)*(W-PAD-40);
  const Y = p => (H-PAD) - (p/100)*(H-PAD-40);
  const invT = x => Math.max(0, Math.min(100, (x-PAD)/(W-PAD-40)*100));
  const invP = y => Math.max(0, Math.min(100, ((H-PAD)-y)/(H-PAD-40)*100));

  let pt = { t: 20, p: 60 };
  let lastState = null, missionDone = false;

  const classify = (t,p)=>{
    if(t >= TC && p >= PC) return "FLUIDO SUPERCRÍTICO";
    if(t <= TT) return p > subP(t) ? "SÓLIDO" : "GÁS";
    if(p >= PT && t < fusT(p)) return "SÓLIDO";
    if(t < TC && p > vapP(t)) return "LÍQUIDO";
    if(t >= TC && p >= PC) return "FLUIDO SUPERCRÍTICO";
    if(t >= TC && p > vapP(TC)) return "LÍQUIDO";
    return "GÁS";
  };

  const info = document.createElement("div");
  info.className = "block block-formal";
  out.appendChild(info);

  const mission = document.createElement("div");
  mission.className = "block block-macete";
  mission.innerHTML = `<span class="tag amber">mini-missão</span>
    <p><b>Leve a substância do estado sólido ao gasoso sem passar pelo líquido.</b></p>
    <p class="small muted">Dica: mantenha a pressão abaixo da pressão do ponto triplo e aqueça.</p>`;
  out.appendChild(mission);

  const update = ()=>{
    const st = classify(pt.t, pt.p);
    let extra = "";
    const dv = Math.abs(pt.p - vapP(pt.t)), ds = Math.abs(pt.p - subP(pt.t));
    if(pt.t > TT && pt.t < TC && dv < 3) extra = "Você está sobre a curva de vaporização: <b>líquido e gás coexistem em equilíbrio</b>.";
    else if(pt.t < TT && ds < 3) extra = "Você está sobre a curva de sublimação: <b>sólido e gás coexistem em equilíbrio</b>.";
    else if(Math.abs(pt.t - fusT(pt.p)) < 1.5 && pt.p > PT) extra = "Você está sobre a curva de fusão: <b>sólido e líquido coexistem em equilíbrio</b>.";
    else if(Math.abs(pt.t-TT) < 2 && Math.abs(pt.p-PT) < 3) extra = "Esse é o <b>ponto triplo</b>: as três fases coexistem em equilíbrio.";
    else if(pt.t >= TC && pt.p >= PC) extra = "Passado o <b>ponto crítico</b>, líquido e gás deixam de ser distinguíveis — e não existe mais ebulição.";

    if(lastState && lastState !== st) {
      const pair = lastState + "→" + st;
      const names = {
        "SÓLIDO→LÍQUIDO":"fusão (absorve energia)", "LÍQUIDO→SÓLIDO":"solidificação (libera energia)",
        "LÍQUIDO→GÁS":"vaporização (absorve energia)", "GÁS→LÍQUIDO":"condensação (libera energia)",
        "SÓLIDO→GÁS":"sublimação (absorve energia)", "GÁS→SÓLIDO":"deposição (libera energia)"
      };
      if(names[pair]) extra = `Você acabou de atravessar uma fronteira: <b>${names[pair]}</b>. ` + extra;
      if(pair === "SÓLIDO→GÁS" && !missionDone && pt.p < PT){
        missionDone = true;
        mission.className = "block block-life";
        mission.innerHTML = `<span class="tag green">missão concluída</span>
          <p><b>É isso: sublimação.</b> Abaixo da pressão do ponto triplo a fase líquida não é estável, então o sólido vai direto para gás.</p>
          <p class="small muted">É exatamente o que acontece com o gelo-seco (CO₂) na pressão atmosférica.</p>`;
        State.addXP(30, "mini-missão do diagrama");
        UI.confetti();
      }
    }
    lastState = st;

    const cls = st==="SÓLIDO"?"state-sol":st==="LÍQUIDO"?"state-liq":"state-gas";
    info.innerHTML = `
      <div class="sim-readout" style="margin-bottom:10px">
        <span class="readout-item ${cls}">Fase atual: <b>${st}</b></span>
        <span class="readout-item">T <b>${pt.t.toFixed(0)}</b></span>
        <span class="readout-item">P <b>${pt.p.toFixed(0)}</b></span>
      </div>
      <p class="small">${extra || "Cada região corresponde a uma fase; cada linha representa a condição em que duas fases coexistem em equilíbrio."}</p>`;
  };

  const draw = ()=>{
    ctx.clearRect(0,0,W,H);
    // regiões
    const fill = (path, color)=>{ ctx.fillStyle = color; ctx.beginPath(); path(); ctx.closePath(); ctx.fill(); };
    // sólido
    fill(()=>{ ctx.moveTo(X(0),Y(100)); ctx.lineTo(X(fusT(100)),Y(100)); ctx.lineTo(X(TT),Y(PT));
      for(let t=TT;t>=0;t-=2) ctx.lineTo(X(t),Y(subP(t)));
      ctx.lineTo(X(0),Y(0)); ctx.lineTo(X(0),Y(100)); }, "rgba(125,211,252,.10)");
    // líquido
    fill(()=>{ ctx.moveTo(X(fusT(100)),Y(100)); ctx.lineTo(X(TT),Y(PT));
      for(let t=TT;t<=TC;t+=1) ctx.lineTo(X(t),Y(vapP(t)));
      ctx.lineTo(X(TC),Y(100)); }, "rgba(76,111,255,.13)");
    // gás
    fill(()=>{ ctx.moveTo(X(0),Y(0));
      for(let t=0;t<=TT;t+=2) ctx.lineTo(X(t),Y(subP(t)));
      for(let t=TT;t<=TC;t+=1) ctx.lineTo(X(t),Y(vapP(t)));
      ctx.lineTo(X(100),Y(PC)); ctx.lineTo(X(100),Y(0)); }, "rgba(251,113,133,.10)");
    // supercrítico
    fill(()=>{ ctx.moveTo(X(TC),Y(PC)); ctx.lineTo(X(100),Y(PC)); ctx.lineTo(X(100),Y(100)); ctx.lineTo(X(TC),Y(100)); }, "rgba(168,85,247,.12)");

    // eixos
    ctx.strokeStyle = "rgba(140,165,255,.35)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(PAD,20); ctx.lineTo(PAD,H-PAD); ctx.lineTo(W-30,H-PAD); ctx.stroke();
    ctx.fillStyle = "#8391bd"; ctx.font = "500 15px 'IBM Plex Mono', monospace";
    ctx.fillText("Temperatura →", W-190, H-PAD+34);
    ctx.save(); ctx.translate(24, 150); ctx.rotate(-Math.PI/2); ctx.fillText("Pressão →", 0, 0); ctx.restore();

    // curvas
    const curve = (from,to,f,color)=>{
      ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.beginPath();
      for(let t=from;t<=to;t+=0.5){ const x=X(t), y=Y(f(t)); t===from?ctx.moveTo(x,y):ctx.lineTo(x,y); }
      ctx.stroke();
    };
    curve(0, TT, subP, "#7dd3fc");
    curve(TT, TC, vapP, "#fb7185");
    ctx.strokeStyle = "#93b0ff"; ctx.lineWidth = 3; ctx.beginPath();
    ctx.moveTo(X(TT),Y(PT)); ctx.lineTo(X(fusT(100)),Y(100)); ctx.stroke();

    // pontos notáveis
    const dot = (t,p,color,label,dy=-14)=>{
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(X(t),Y(p),6,0,7); ctx.fill();
      ctx.fillStyle = "#eaeefb"; ctx.font = "600 14px 'IBM Plex Mono', monospace";
      ctx.fillText(label, X(t)+10, Y(p)+dy);
    };
    dot(TT,PT,"#fbbf24","ponto triplo", 22);
    dot(TC,PC,"#a855f7","ponto crítico", -8);

    // rótulos das regiões
    ctx.font = "700 17px Sora, sans-serif";
    ctx.fillStyle = "rgba(125,211,252,.85)"; ctx.fillText("SÓLIDO", X(10), Y(78));
    ctx.fillStyle = "rgba(147,176,255,.9)";  ctx.fillText("LÍQUIDO", X(50), Y(85));
    ctx.fillStyle = "rgba(253,164,175,.85)"; ctx.fillText("GÁS", X(72), Y(12));
    ctx.fillStyle = "rgba(216,180,254,.8)";  ctx.font = "600 13px Sora, sans-serif";
    ctx.fillText("fluido supercrítico", X(81), Y(97));

    // ponto do aluno
    ctx.save();
    ctx.shadowColor = "rgba(34,211,238,.9)"; ctx.shadowBlur = 18;
    ctx.fillStyle = "#22d3ee"; ctx.beginPath(); ctx.arc(X(pt.t),Y(pt.p),10,0,7); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(X(pt.t),Y(pt.p),10,0,7); ctx.stroke();
  };

  const pos = e=>{
    const r = cv.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    return { x: cx * (cv.width/r.width), y: cy * (cv.height/r.height) };
  };
  const move = e=>{
    const {x,y} = pos(e);
    pt.t = invT(x); pt.p = invP(y);
    draw(); update();
  };
  let dragging = false;
  cv.style.cursor = "grab"; cv.style.touchAction = "none";
  cv.addEventListener("pointerdown", e=>{ dragging = true; cv.setPointerCapture(e.pointerId); move(e); });
  cv.addEventListener("pointermove", e=>{ if(dragging) move(e); });
  cv.addEventListener("pointerup", ()=>{ dragging = false; });
  cv.addEventListener("click", move);
  cv.tabIndex = 0;
  cv.setAttribute("role","application");
  cv.setAttribute("aria-label","Diagrama de fases interativo. Use as setas do teclado para mover o ponto.");
  cv.addEventListener("keydown", e=>{
    const k = { ArrowLeft:[-2,0], ArrowRight:[2,0], ArrowUp:[0,2], ArrowDown:[0,-2] }[e.key];
    if(!k) return;
    e.preventDefault();
    pt.t = Math.max(0, Math.min(100, pt.t + k[0]));
    pt.p = Math.max(0, Math.min(100, pt.p + k[1]));
    draw(); update();
  });

  draw(); update();
},

/* =====================================================================
   4 · EBULIÇÃO × PRESSÃO (panela virtual)
   ===================================================================== */
build_boiling(host){
  const { cv, ctx } = this.canvas(host, 840, 400);
  const controls = document.createElement("div"); controls.style.marginTop="14px"; host.appendChild(controls);
  const out = document.createElement("div"); host.appendChild(out);

  // Antoine (água): log10(P mmHg) = A − B/(C+T)
  const A=8.07131, B=1730.63, C=233.426;
  const Tb = atm => B/(A - Math.log10(atm*760)) - C;
  const altitude = atm => atm >= 1 ? 0 : Math.round(44330*(1-Math.pow(atm,0.1903)));

  let atm = 1, heat = 0;
  const bubbles = [];

  const ro = this.readout(out, []);
  const refresh = ()=>{
    const t = Tb(atm);
    const alt = altitude(atm);
    ro.innerHTML = `
      <span class="readout-item">Pressão externa: <b>${atm.toFixed(2)} atm</b></span>
      <span class="readout-item state-gas">Temperatura de ebulição: <b>${t.toFixed(1)} °C</b></span>
      <span class="readout-item">${atm < 1 ? `Equivale a cerca de <b>${alt} m</b> de altitude` : atm > 1 ? "Situação de <b>panela de pressão</b>" : "Nível do mar · <b>1 atm</b>"}</span>`;
  };

  this.slider(controls, { label:"Pressão externa", min:0.3, max:2.2, step:0.05, value:1, unit:" atm",
    onInput:v=>{ atm = v; refresh(); } });

  const draw = ()=>{
    ctx.clearRect(0,0,cv.width,cv.height);
    const t = Tb(atm);
    heat += 0.02;

    // panela
    ctx.fillStyle = "rgba(255,255,255,.07)";
    ctx.beginPath(); ctx.moveTo(230,120); ctx.lineTo(610,120); ctx.lineTo(580,330); ctx.lineTo(260,330); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(140,165,255,.4)"; ctx.lineWidth = 3; ctx.stroke();

    // líquido
    const g = ctx.createLinearGradient(0,170,0,330);
    g.addColorStop(0,"rgba(76,111,255,.55)"); g.addColorStop(1,"rgba(34,211,238,.35)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(243,180); ctx.lineTo(597,180); ctx.lineTo(580,330); ctx.lineTo(260,330); ctx.closePath(); ctx.fill();

    // bolhas: intensidade cresce quando a pressão externa é baixa
    const rate = Math.max(0.05, 1.5 - atm*0.6);
    if(!REDUCED() && Math.random() < rate*0.5){
      bubbles.push({ x: 280+Math.random()*280, y: 320, r: 2+Math.random()*5, v: .8+Math.random()*1.4 });
    }
    for(let i=bubbles.length-1;i>=0;i--){
      const b = bubbles[i]; b.y -= b.v; b.x += Math.sin(b.y/22)*0.5; b.r *= 1.004;
      ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,7); ctx.stroke();
      if(b.y < 182) bubbles.splice(i,1);
    }

    // vapor saindo
    ctx.fillStyle = "rgba(255,255,255,.06)";
    for(let i=0;i<3;i++){
      const yy = 110 - ((heat*30 + i*30) % 90);
      ctx.beginPath(); ctx.ellipse(400+Math.sin(heat+i)*26, yy, 40-i*6, 12, 0, 0, 7); ctx.fill();
    }

    // setas de pressão externa
    const arrows = Math.round(3 + atm*4);
    ctx.strokeStyle = "rgba(251,191,36,.8)"; ctx.lineWidth = 2; ctx.fillStyle = "rgba(251,191,36,.8)";
    for(let i=0;i<arrows;i++){
      const x = 250 + i*(340/Math.max(1,arrows-1));
      ctx.beginPath(); ctx.moveTo(x,60); ctx.lineTo(x,100); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x-5,96); ctx.lineTo(x+5,96); ctx.lineTo(x,106); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle="#fbbf24"; ctx.font="600 15px 'IBM Plex Mono', monospace";
    ctx.fillText("pressão externa", 630, 84);

    // termômetro grande
    ctx.fillStyle = "#eaeefb"; ctx.font = "700 40px Sora, sans-serif";
    ctx.fillText(t.toFixed(1)+" °C", 640, 210);
    ctx.fillStyle = "#8391bd"; ctx.font = "500 14px 'IBM Plex Mono', monospace";
    ctx.fillText("temperatura de ebulição", 640, 234);

    // chama
    ctx.fillStyle = "rgba(251,113,133,.7)";
    for(let i=0;i<8;i++){
      const x = 290+i*36, h = 22+Math.sin(heat*4+i)*10;
      ctx.beginPath(); ctx.moveTo(x,352); ctx.quadraticCurveTo(x+9,352-h,x+18,352); ctx.closePath(); ctx.fill();
    }
  };
  refresh();
  if(REDUCED()) draw(); else this.loop(draw);
},

/* =====================================================================
   5 · EQUILÍBRIO LÍQUIDO ⇌ VAPOR
   ===================================================================== */
build_vapor(host){
  const { cv, ctx } = this.canvas(host, 840, 380);
  const controls = document.createElement("div"); controls.style.marginTop="14px"; host.appendChild(controls);
  const out = document.createElement("div"); host.appendChild(out);

  let T = 25, evaporated = 0, target = 0, evapCount = 0, condCount = 0;
  const mols = Array.from({length:60},()=>({ x: 120+Math.random()*600, y: 250+Math.random()*90, vx:0, vy:0, gas:false }));

  const ro = this.readout(out, []);
  const refresh = ()=>{
    const pv = 0.0603*Math.exp(0.0578*T);                 // aproximação da P vapor da água (atm)
    ro.innerHTML = `
      <span class="readout-item">Temperatura: <b>${T} °C</b></span>
      <span class="readout-item">Pressão de vapor: <b>${(pv*760).toFixed(0)} mmHg</b></span>
      <span class="readout-item">Evaporando: <b>${evapCount}</b></span>
      <span class="readout-item">Condensando: <b>${condCount}</b></span>`;
  };

  this.slider(controls, { label:"Temperatura", min:5, max:95, step:1, value:25, unit:" °C",
    onInput:v=>{ T=v; target = Math.round(6 + (v/95)*34); refresh(); } });

  const draw = ()=>{
    ctx.clearRect(0,0,cv.width,cv.height);
    // recipiente fechado
    ctx.strokeStyle="rgba(140,165,255,.35)"; ctx.lineWidth=3;
    ctx.strokeRect(100,40,620,310);
    ctx.fillStyle="rgba(76,111,255,.18)"; ctx.fillRect(102,240,616,108);

    evapCount = 0; condCount = 0;
    mols.forEach((m,i)=>{
      if(!m.gas){
        m.x += (Math.random()-.5)*1.4; m.y += (Math.random()-.5)*1.2;
        m.x = Math.max(110, Math.min(710, m.x)); m.y = Math.max(245, Math.min(342, m.y));
        if(evaporated < target && Math.random() < 0.004*(T/25) && m.y < 258){ m.gas = true; m.vy = -1.4; m.vx = (Math.random()-.5)*2; evaporated++; }
      }else{
        m.x += m.vx; m.y += m.vy; m.vy += 0.008;
        if(m.x < 110 || m.x > 710) m.vx *= -1;
        if(m.y < 50) m.vy = Math.abs(m.vy);
        if(m.y > 240 && (evaporated > target || Math.random() < 0.004)){ m.gas = false; evaporated--; }
      }
      const c = m.gas ? "#fda4af" : "#7dd3fc";
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(m.x,m.y, m.gas?3.4:4, 0, 7); ctx.fill();
      if(m.gas && m.y < 246) evapCount++;
      if(m.gas && m.vy > 0 && m.y > 200) condCount++;
    });

    // manômetro
    const frac = Math.min(1, evaporated/40);
    ctx.fillStyle="rgba(255,255,255,.08)"; ctx.fillRect(760,60,40,280);
    const g = ctx.createLinearGradient(0,340,0,60);
    g.addColorStop(0,"#22d3ee"); g.addColorStop(1,"#fb7185");
    ctx.fillStyle=g; ctx.fillRect(760, 340-280*frac, 40, 280*frac);
    ctx.fillStyle="#8391bd"; ctx.font="600 13px 'IBM Plex Mono', monospace";
    ctx.fillText("P vapor", 748, 356);

    ctx.fillStyle="#8391bd"; ctx.font="600 14px 'IBM Plex Mono', monospace";
    ctx.fillText("fase vapor", 120, 70);
    ctx.fillText("fase líquida", 120, 300);
    ctx.fillStyle = "#eaeefb"; ctx.font="700 16px Sora, sans-serif";
    ctx.fillText(evaporated >= target-1 && evaporated <= target+1 ? "EQUILÍBRIO DINÂMICO ⇌" : "buscando o equilíbrio…", 330, 26);
  };
  refresh();
  if(REDUCED()) draw(); else this.loop(draw);
},

/* =====================================================================
   6 · COMPARADOR DE LÍQUIDOS
   ===================================================================== */
build_liquids(host){
  const LIQ = [
    { n:"Éter etílico", a:0.145, b:0.0538, c:"#fb7185", note:"interações fracas (dipolo-dipolo)" },
    { n:"Álcool etílico", a:0.0175, b:0.0555, c:"#a855f7", note:"faz ligação de hidrogênio, mas menos que a água" },
    { n:"Água", a:0.0079, b:0.0578, c:"#22d3ee", note:"ligações de hidrogênio fortes e numerosas" }
  ];
  const { cv, ctx } = this.canvas(host, 840, 360);
  const controls = document.createElement("div"); controls.style.marginTop="14px"; host.appendChild(controls);
  const out = document.createElement("div"); host.appendChild(out);
  let T = 25;

  const pv = (l,t)=> l.a*Math.exp(l.b*t)*760;   // mmHg (aproximação para a faixa 0–80 °C)

  const info = document.createElement("div");
  info.className = "block block-formal";
  out.appendChild(info);

  const draw = ()=>{
    ctx.clearRect(0,0,cv.width,cv.height);
    const max = Math.max(...LIQ.map(l=>pv(l,80)));
    LIQ.forEach((l,i)=>{
      const x = 120 + i*250, v = pv(l,T), h = Math.min(230, v/max*230);
      ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.fillRect(x,60,120,230);
      ctx.fillStyle = l.c; ctx.globalAlpha = .85; ctx.fillRect(x, 290-h, 120, h); ctx.globalAlpha = 1;
      ctx.fillStyle = "#eaeefb"; ctx.font = "700 16px Sora, sans-serif"; ctx.textAlign="center";
      ctx.fillText(l.n, x+60, 318);
      ctx.font = "600 15px 'IBM Plex Mono', monospace"; ctx.fillStyle = l.c;
      ctx.fillText(v.toFixed(0)+" mmHg", x+60, 290-h-12);
      ctx.textAlign="left";
    });
    ctx.fillStyle="#8391bd"; ctx.font="600 14px 'IBM Plex Mono', monospace";
    ctx.fillText("pressão máxima de vapor a "+T+" °C", 120, 40);
    ctx.fillText("(escala relativa · aproximação didática)", 120, 344);
  };

  this.slider(controls, { label:"Temperatura", min:0, max:80, step:1, value:25, unit:" °C",
    onInput:v=>{ T=v; draw();
      const order = LIQ.slice().sort((a,b)=>pv(b,T)-pv(a,T));
      info.innerHTML = `<p><b>Mais volátil → menos volátil:</b> ${order.map(l=>l.n).join(" › ")}</p>
        <p class="small muted" style="margin-top:8px">${order[0].n}: ${order[0].note}. ${order[2].n}: ${order[2].note}.</p>
        <p class="small" style="margin-top:8px">Repare: mudar a temperatura muda os valores, mas <b>não</b> muda a ordem — essa é a assinatura das forças intermoleculares.</p>`;
    }});
  draw();

  // microdesafio embutido
  const quiz = document.createElement("div");
  quiz.className = "block block-macete";
  quiz.innerHTML = `<span class="tag amber">experimento rápido</span>
    <p><b>Três béqueres abertos, mesma temperatura, mesmo volume. Qual esvazia primeiro?</b></p>
    <div class="row" style="margin-top:10px">
      ${LIQ.map((l,i)=>`<button class="btn btn-ghost btn-sm" data-i="${i}">${l.n}</button>`).join("")}
    </div>
    <p class="small" id="liqFb" style="margin-top:10px"></p>`;
  host.appendChild(quiz);
  quiz.querySelectorAll("button").forEach(b=>{
    b.addEventListener("click", ()=>{
      const i = +b.dataset.i;
      const fb = quiz.querySelector("#liqFb");
      if(i === 0){
        fb.innerHTML = `<span style="color:#34d399">🔥 Isso!</span> O éter tem as interações intermoleculares mais fracas, então tem a maior pressão de vapor e evapora primeiro.`;
      }else{
        fb.innerHTML = `<span style="color:#fb7185">❌ Ainda não.</span> Você provavelmente pensou na quantidade de líquido ou no que é mais comum no laboratório. O critério é outro: <b>quanto mais fracas as forças intermoleculares, maior a pressão de vapor</b> — e o éter é quem tem as mais fracas.`;
      }
    });
  });
},

/* =====================================================================
   7 · LEI DE RAOULT
   ===================================================================== */
build_raoult(host){
  const { cv, ctx } = this.canvas(host, 840, 340);
  const controls = document.createElement("div"); controls.style.marginTop="14px"; host.appendChild(controls);
  const out = document.createElement("div"); host.appendChild(out);
  const P0 = 23.8;   // mmHg — água pura a 25 °C
  let X = 1;

  const ro = this.readout(out, []);
  const draw = ()=>{
    ctx.clearRect(0,0,cv.width,cv.height);
    const P = X*P0;

    // gráfico P × X
    const PAD = 60, W = 420, H = 240;
    ctx.strokeStyle="rgba(140,165,255,.35)"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(PAD,40); ctx.lineTo(PAD,40+H); ctx.lineTo(PAD+W,40+H); ctx.stroke();
    ctx.strokeStyle="#4c6fff"; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(PAD,40+H); ctx.lineTo(PAD+W,40); ctx.stroke();
    const px = PAD + X*W, py = 40+H - X*H;
    ctx.fillStyle="#22d3ee"; ctx.beginPath(); ctx.arc(px,py,7,0,7); ctx.fill();
    ctx.setLineDash([4,4]); ctx.strokeStyle="rgba(34,211,238,.5)"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(PAD,py); ctx.lineTo(px,py); ctx.lineTo(px,40+H); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle="#8391bd"; ctx.font="600 13px 'IBM Plex Mono', monospace";
    ctx.fillText("P (mmHg)", 20, 32); ctx.fillText("X solvente", PAD+W-70, 40+H+26);
    ctx.fillText("0", PAD-14, 40+H+18); ctx.fillText("1", PAD+W-4, 40+H+18);
    ctx.fillText(P0.toFixed(1), PAD-46, 46);

    // copos
    const beaker = (x, xs, label)=>{
      ctx.strokeStyle="rgba(140,165,255,.4)"; ctx.lineWidth=3;
      ctx.strokeRect(x,120,120,170);
      ctx.fillStyle="rgba(76,111,255,.3)"; ctx.fillRect(x+2,190,116,98);
      const n = Math.round((1-xs)*26);
      for(let i=0;i<n;i++){
        ctx.fillStyle="#fbbf24";
        ctx.beginPath(); ctx.arc(x+12+((i*23)%100), 200+((i*17)%80), 3.6, 0, 7); ctx.fill();
      }
      const esc = Math.round(xs*10);
      ctx.fillStyle="#7dd3fc";
      for(let i=0;i<esc;i++){ ctx.beginPath(); ctx.arc(x+14+i*11, 160-((i*13)%36), 2.8, 0, 7); ctx.fill(); }
      ctx.fillStyle="#eaeefb"; ctx.font="600 13px Sora, sans-serif"; ctx.textAlign="center";
      ctx.fillText(label, x+60, 310); ctx.textAlign="left";
    };
    beaker(540, 1, "solvente puro");
    beaker(690, X, "solução");
  };

  this.slider(controls, { label:"Fração molar do solvente (X)", min:0.5, max:1, step:0.01, value:1, unit:"",
    onInput:v=>{ X=v; draw();
      const P = X*P0;
      ro.innerHTML = `
        <span class="readout-item">P° (água pura, 25 °C): <b>${P0} mmHg</b></span>
        <span class="readout-item">X solvente: <b>${X.toFixed(2)}</b></span>
        <span class="readout-item state-liq">P solução = X · P° = <b>${P.toFixed(2)} mmHg</b></span>
        <span class="readout-item">Abaixamento: <b>${(P0-P).toFixed(2)} mmHg</b></span>`;
    }});
},

/* =====================================================================
   8 · LABORATÓRIO COLIGATIVO
   ===================================================================== */
build_colligative(host){
  const controls = document.createElement("div");
  controls.className = "grid two"; controls.style.marginBottom = "16px";
  host.appendChild(controls);
  const gauges = document.createElement("div");
  gauges.className = "grid four";
  host.appendChild(gauges);
  const { cv, ctx } = this.canvas(host, 840, 260);
  host.querySelector(".sim-stage").style.marginTop = "16px";

  let W = 0, i = 1;

  const iBox = document.createElement("div");
  iBox.className = "field";
  iBox.innerHTML = `<span>Soluto (define o fator i)</span>
    <select>
      <option value="1">Glicose — não se dissocia (i = 1)</option>
      <option value="2">NaCl → Na⁺ + Cl⁻ (i = 2)</option>
      <option value="3">CaCl₂ → Ca²⁺ + 2 Cl⁻ (i = 3)</option>
    </select>`;
  controls.appendChild(iBox);
  const wBox = document.createElement("div"); controls.appendChild(wBox);

  const render = ()=>{
    const dTb = i*0.52*W, dTc = i*1.86*W;
    const nSolv = 55.5, nSol = i*W;
    const Xs = nSolv/(nSolv+nSol);
    const P = Xs*760;
    const pi = i*W*0.082*298;
    const cell = (label,val,unit,delta,cls)=>`
      <div class="stat ${cls}">
        <span class="l">${label}</span>
        <span class="k">${val}<small style="font-size:.5em;color:var(--muted)"> ${unit}</small></span>
        <span class="small mono" style="color:${delta.startsWith("↓")?"#7dd3fc":delta.startsWith("↑")?"#fbbf24":"var(--muted)"}">${delta}</span>
      </div>`;
    gauges.innerHTML =
      cell("Pressão de vapor (100 °C)", P.toFixed(0), "mmHg", W? "↓ "+(760-P).toFixed(0)+" mmHg" : "sem soluto", "") +
      cell("Temperatura de ebulição", (100+dTb).toFixed(2), "°C", W? "↑ "+dTb.toFixed(2)+" °C" : "sem soluto", "warm") +
      cell("Temperatura de congelamento", (0-dTc).toFixed(2), "°C", W? "↓ "+dTc.toFixed(2)+" °C" : "sem soluto", "") +
      cell("Pressão osmótica (25 °C)", pi.toFixed(2), "atm", W? "↑ "+pi.toFixed(2)+" atm" : "sem soluto", "good");

    // desenho do béquer
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.strokeStyle="rgba(140,165,255,.4)"; ctx.lineWidth=3; ctx.strokeRect(300,40,240,190);
    ctx.fillStyle="rgba(76,111,255,.28)"; ctx.fillRect(302,90,236,138);
    const n = Math.round(W*i*18);
    for(let k=0;k<n;k++){
      ctx.fillStyle = i===1 ? "#fbbf24" : (k%i===0 ? "#fb7185" : "#34d399");
      const x = 312 + ((k*37)%216), y = 100 + ((k*53)%118);
      ctx.beginPath(); ctx.arc(x,y,4.2,0,7); ctx.fill();
    }
    ctx.fillStyle="#8391bd"; ctx.font="600 14px 'IBM Plex Mono', monospace";
    ctx.fillText(`${(W*i).toFixed(2)} mol de partículas por kg de água`, 300, 254);
    ctx.fillText("1 kg de água", 300, 30);
  };

  this.slider(wBox, { label:"Molalidade do soluto (W)", min:0, max:2, step:0.05, value:0, unit:" mol/kg",
    onInput:v=>{ W=v; render(); } });
  iBox.querySelector("select").addEventListener("change", e=>{ i = +e.target.value; render(); });
  render();
},

/* =====================================================================
   9 · CALCULADORA DE EBULIOSCOPIA / CRIOSCOPIA
   ===================================================================== */
build_calc(host, opts){
  const mode = opts.mode || "ebulio";     // ebulio | crio
  const K = mode === "ebulio" ? 0.52 : 1.86;
  const T0 = mode === "ebulio" ? 100 : 0;

  const form = document.createElement("div");
  form.className = "grid three";
  form.innerHTML = `
    <div class="field"><span>Massa do soluto (g)</span><input type="number" id="cm" value="58.5" step="0.1"></div>
    <div class="field"><span>Massa molar (g/mol)</span><input type="number" id="cmm" value="58.5" step="0.1"></div>
    <div class="field"><span>Massa do solvente (kg)</span><input type="number" id="cs" value="1" step="0.1"></div>
    <div class="field"><span>Constante ${mode==="ebulio"?"K<sub>b</sub>":"K<sub>c</sub>"} (°C·kg/mol)</span><input type="number" id="ck" value="${K}" step="0.01"></div>
    <div class="field"><span>Fator de Van't Hoff (i)</span>
      <select id="ci">
        <option value="1">1 — soluto molecular (glicose, sacarose, ureia)</option>
        <option value="2" selected>2 — NaCl, KCl, HCl</option>
        <option value="3">3 — CaCl₂, Na₂SO₄</option>
        <option value="5">5 — Al₂(SO₄)₃</option>
      </select></div>
    <div class="field"><span>&nbsp;</span><button class="btn btn-primary" id="cgo" type="button">Calcular</button></div>`;
  host.appendChild(form);
  const res = document.createElement("div");
  res.className = "result-box"; res.style.marginTop = "16px";
  host.appendChild(res);

  const calc = ()=>{
    const m = parseFloat(form.querySelector("#cm").value) || 0;
    const mm = parseFloat(form.querySelector("#cmm").value) || 1;
    const ks = parseFloat(form.querySelector("#cs").value) || 1;
    const k = parseFloat(form.querySelector("#ck").value) || K;
    const i = parseFloat(form.querySelector("#ci").value) || 1;
    const mols = m/mm, W = mols/ks, dT = i*k*W;
    const Tf = mode === "ebulio" ? T0 + dT : T0 - dT;
    res.innerHTML = `
      <p class="small muted">${mode==="ebulio"?"Nova temperatura de ebulição":"Nova temperatura de congelamento"}</p>
      <p class="big">${Tf.toFixed(2)} °C</p>
      <div class="steps">
        n = ${m} ÷ ${mm} = ${mols.toFixed(3)} mol<br>
        W = ${mols.toFixed(3)} ÷ ${ks} = ${W.toFixed(3)} mol/kg<br>
        Δ${mode==="ebulio"?"Tb":"Tc"} = ${i} · ${k} · ${W.toFixed(3)} = ${dT.toFixed(3)} °C<br>
        T = ${T0} ${mode==="ebulio"?"+":"−"} ${dT.toFixed(3)} = <b>${Tf.toFixed(2)} °C</b>
      </div>`;
  };
  form.querySelector("#cgo").addEventListener("click", calc);
  form.querySelectorAll("input,select").forEach(el=>el.addEventListener("input", calc));
  calc();
},

/* =====================================================================
   10 · CONGELAMENTO (crioscopia visual)
   ===================================================================== */
build_freezing(host){
  const { cv, ctx } = this.canvas(host, 840, 330);
  const controls = document.createElement("div"); controls.style.marginTop="14px"; host.appendChild(controls);
  const out = document.createElement("div"); host.appendChild(out);
  let T = 5, W = 1;     // °C e molalidade do lado direito

  const ro = this.readout(out, []);
  const refresh = ()=>{
    const dTc = 2*1.86*W;   // NaCl
    const Tc = -dTc;
    ro.innerHTML = `
      <span class="readout-item">Temperatura do congelador: <b>${T} °C</b></span>
      <span class="readout-item state-sol">Água pura congela a <b>0,00 °C</b></span>
      <span class="readout-item state-liq">Solução congela a <b>${Tc.toFixed(2)} °C</b></span>
      <span class="readout-item">ΔTc = 2 · 1,86 · ${W.toFixed(2)} = <b>${dTc.toFixed(2)} °C</b></span>`;
  };

  const draw = ()=>{
    ctx.clearRect(0,0,cv.width,cv.height);
    const Tc = -2*1.86*W;
    const beaker = (x, frozen, label, sub)=>{
      ctx.strokeStyle="rgba(140,165,255,.4)"; ctx.lineWidth=3; ctx.strokeRect(x,50,280,200);
      ctx.fillStyle = frozen ? "rgba(125,211,252,.35)" : "rgba(76,111,255,.28)";
      ctx.fillRect(x+2,90,276,158);
      if(frozen){
        ctx.strokeStyle="rgba(255,255,255,.75)"; ctx.lineWidth=1.6;
        for(let k=0;k<16;k++){
          const cx = x+30+((k*67)%230), cy = 105+((k*53)%125), r = 9;
          for(let a=0;a<6;a++){
            const ang = a*Math.PI/3;
            ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(ang)*r, cy+Math.sin(ang)*r); ctx.stroke();
          }
        }
      }else if(W>0 && x>400){
        for(let k=0;k<Math.round(W*16);k++){
          ctx.fillStyle = k%2 ? "#fb7185" : "#34d399";
          ctx.beginPath(); ctx.arc(x+24+((k*41)%236), 104+((k*61)%130), 4, 0, 7); ctx.fill();
        }
      }
      ctx.fillStyle="#eaeefb"; ctx.font="700 16px Sora, sans-serif"; ctx.textAlign="center";
      ctx.fillText(label, x+140, 282);
      ctx.font="600 13px 'IBM Plex Mono', monospace"; ctx.fillStyle = frozen ? "#7dd3fc" : "#93b0ff";
      ctx.fillText(sub, x+140, 304); ctx.textAlign="left";
    };
    beaker(60,  T <= 0,  "ÁGUA PURA",  T<=0 ? "CONGELADA" : "líquida");
    beaker(490, T <= Tc, "ÁGUA + SAL", T<=Tc ? "CONGELADA" : "ainda líquida");
    ctx.fillStyle="#8391bd"; ctx.font="600 15px 'IBM Plex Mono', monospace";
    ctx.fillText(`congelador a ${T} °C`, 60, 34);
  };

  this.slider(controls, { label:"Temperatura do congelador", min:-12, max:8, step:0.5, value:5, unit:" °C",
    onInput:v=>{ T=v; refresh(); draw(); } });
  this.slider(controls, { label:"Molalidade de NaCl na solução", min:0, max:2, step:0.1, value:1, unit:" mol/kg",
    onInput:v=>{ W=v; refresh(); draw(); } });
  refresh(); draw();
},

/* =====================================================================
   11 · OSMOSE
   ===================================================================== */
build_osmosis(host){
  const { cv, ctx } = this.canvas(host, 840, 360);
  const controls = document.createElement("div"); controls.className="grid two"; controls.style.marginTop="14px"; host.appendChild(controls);
  const out = document.createElement("div"); host.appendChild(out);

  let cL = 0.2, cR = 0.8, level = 0;
  const water = Array.from({length:70},()=>({ x: 80+Math.random()*660, y: 140+Math.random()*160, side: Math.random()<.5?0:1 }));

  const ro = this.readout(out, []);
  const refresh = ()=>{
    const dir = cR > cL ? "→ para a direita" : cL > cR ? "← para a esquerda" : "sem fluxo líquido";
    ro.innerHTML = `
      <span class="readout-item">Esquerda: <b>${cL.toFixed(2)} mol/L</b></span>
      <span class="readout-item">Direita: <b>${cR.toFixed(2)} mol/L</b></span>
      <span class="readout-item state-liq">Fluxo do solvente: <b>${dir}</b></span>
      <span class="readout-item">π (25 °C, i=1) = <b>${(Math.abs(cR-cL)*0.082*298).toFixed(2)} atm</b></span>`;
  };

  const draw = ()=>{
    ctx.clearRect(0,0,cv.width,cv.height);
    const diff = cR - cL;
    level += (diff*40 - level)*0.03;
    const baseL = 300 + level, baseR = 300 - level;

    ctx.strokeStyle="rgba(140,165,255,.4)"; ctx.lineWidth=3;
    ctx.strokeRect(60,60,720,250);
    // líquidos
    ctx.fillStyle="rgba(76,111,255,.25)"; ctx.fillRect(62, baseL-150, 356, 150-(baseL-310));
    ctx.fillRect(422, baseR-150, 356, 150-(baseR-310));
    ctx.fillStyle="rgba(76,111,255,.25)";
    ctx.fillRect(62, baseL-150, 356, 460-baseL);
    ctx.fillRect(422, baseR-150, 356, 460-baseR);

    // membrana
    ctx.fillStyle="rgba(168,85,247,.35)"; ctx.fillRect(415,60,10,250);
    ctx.strokeStyle="rgba(216,180,254,.8)"; ctx.lineWidth=2;
    for(let y=70;y<305;y+=16){ ctx.beginPath(); ctx.moveTo(415,y); ctx.lineTo(425,y); ctx.stroke(); }
    ctx.fillStyle="#d8b4fe"; ctx.font="600 12px 'IBM Plex Mono', monospace"; ctx.textAlign="center";
    ctx.fillText("membrana semipermeável", 420, 336); ctx.textAlign="left";

    // solutos (não atravessam)
    const drawSol = (n, x0, x1, top)=>{ for(let k=0;k<n;k++){ ctx.fillStyle="#fb7185";
      const yTop = Math.max(top+12, 110), span = Math.max(20, 300-yTop);
      ctx.beginPath(); ctx.arc(x0+((k*57)%(x1-x0-20))+10, yTop+((k*43)%span), 5, 0, 7); ctx.fill(); } };
    drawSol(Math.round(cL*24), 70, 410, baseL-150);
    drawSol(Math.round(cR*24), 430, 770, baseR-150);

    // solvente atravessando
    water.forEach(m=>{
      const drift = diff*0.35;
      m.x += drift + (Math.random()-.5)*1.6;
      m.y += (Math.random()-.5)*1.6;
      if(m.x < 70) m.x = 770; if(m.x > 772) m.x = 72;
      m.y = Math.max(110, Math.min(300, m.y));
      ctx.fillStyle="#7dd3fc"; ctx.beginPath(); ctx.arc(m.x,m.y,3.2,0,7); ctx.fill();
    });

    ctx.fillStyle="#8391bd"; ctx.font="600 14px 'IBM Plex Mono', monospace";
    ctx.fillText("menos concentrado", 80, 44); ctx.fillText("mais concentrado", 600, 44);
  };

  const c1 = document.createElement("div"), c2 = document.createElement("div");
  controls.append(c1,c2);
  this.slider(c1, { label:"Concentração à esquerda", min:0, max:1, step:0.05, value:0.2, unit:" mol/L", onInput:v=>{ cL=v; refresh(); }});
  this.slider(c2, { label:"Concentração à direita", min:0, max:1, step:0.05, value:0.8, unit:" mol/L", onInput:v=>{ cR=v; refresh(); }});
  refresh();
  if(REDUCED()) draw(); else this.loop(draw);
},

/* =====================================================================
   12 · CALCULADORA DE PRESSÃO OSMÓTICA
   ===================================================================== */
build_osmoCalc(host){
  const form = document.createElement("div");
  form.className = "grid three";
  form.innerHTML = `
    <div class="field"><span>Concentração M (mol/L)</span><input type="number" id="om" value="0.2" step="0.01"></div>
    <div class="field"><span>Temperatura (°C)</span><input type="number" id="ot" value="27" step="1"></div>
    <div class="field"><span>Fator de Van't Hoff (i)</span>
      <select id="oi"><option value="1">1 — glicose, sacarose, ureia</option><option value="2">2 — NaCl, KCl</option><option value="3">3 — CaCl₂</option></select></div>`;
  host.appendChild(form);
  const res = document.createElement("div"); res.className="result-box"; res.style.marginTop="16px"; host.appendChild(res);
  const calc = ()=>{
    const M = parseFloat(form.querySelector("#om").value)||0;
    const tC = parseFloat(form.querySelector("#ot").value)||0;
    const i = parseFloat(form.querySelector("#oi").value)||1;
    const T = tC + 273;
    const pi = i*M*0.082*T;
    res.innerHTML = `
      <p class="small muted">Pressão osmótica</p>
      <p class="big">${pi.toFixed(2)} atm</p>
      <div class="steps">
        T = ${tC} + 273 = <b>${T} K</b><br>
        π = i · M · R · T = ${i} · ${M} · 0,082 · ${T}<br>
        π = <b>${pi.toFixed(2)} atm</b>
      </div>`;
  };
  form.querySelectorAll("input,select").forEach(el=>el.addEventListener("input", calc));
  calc();
},

/* =====================================================================
   13 · SISTEMA × VIZINHANÇA
   ===================================================================== */
build_system(host){
  const { cv, ctx } = this.canvas(host, 840, 320);
  const row = document.createElement("div"); row.className="row"; row.style.marginTop="14px"; host.appendChild(row);
  const out = document.createElement("div"); host.appendChild(out);
  let mode = "endo", t = 0;

  const info = document.createElement("div"); info.className="block block-formal"; out.appendChild(info);
  const setInfo = ()=>{
    info.innerHTML = mode === "endo"
      ? `<span class="tag rose">endotérmico</span><h3>Energia ENTRA no sistema</h3>
         <p class="lead">O sistema absorve energia da vizinhança. Resultado: a vizinhança <b>esfria</b>. ΔH &gt; 0.</p>
         <p class="small muted" style="margin-top:8px">Exemplos: gelo derretendo, bolsa térmica instantânea de farmácia, fotossíntese.</p>`
      : `<span class="tag cyan">exotérmico</span><h3>Energia SAI do sistema</h3>
         <p class="lead">O sistema libera energia para a vizinhança. Resultado: a vizinhança <b>esquenta</b>. ΔH &lt; 0.</p>
         <p class="small muted" style="margin-top:8px">Exemplos: combustão do gás de cozinha, vapor condensando, água congelando.</p>`;
  };

  ["endo","exo"].forEach(m=>{
    const b = document.createElement("button");
    b.type="button"; b.className = "btn " + (m===mode?"btn-primary":"btn-ghost");
    b.textContent = m==="endo" ? "🔥 Endotérmico" : "❄️ Exotérmico";
    b.addEventListener("click", ()=>{
      mode = m; setInfo();
      row.querySelectorAll(".btn").forEach((x,idx)=>{
        x.className = "btn " + ((idx===0&&mode==="endo")||(idx===1&&mode==="exo") ? "btn-primary":"btn-ghost");
      });
    });
    row.appendChild(b);
  });

  const draw = ()=>{
    t += 0.02;
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.fillStyle="rgba(255,255,255,.03)"; ctx.fillRect(40,30,760,250);
    ctx.strokeStyle="rgba(140,165,255,.25)"; ctx.setLineDash([6,6]); ctx.lineWidth=2; ctx.strokeRect(40,30,760,250); ctx.setLineDash([]);
    ctx.fillStyle="#8391bd"; ctx.font="600 14px 'IBM Plex Mono', monospace"; ctx.fillText("VIZINHANÇA", 56, 56);

    const color = mode==="endo" ? "#fb7185" : "#7dd3fc";
    ctx.fillStyle = mode==="endo" ? "rgba(251,113,133,.16)" : "rgba(125,211,252,.16)";
    ctx.strokeStyle = color; ctx.lineWidth=3;
    ctx.beginPath(); ctx.roundRect(320,90,200,140,18); ctx.fill(); ctx.stroke();
    ctx.fillStyle="#eaeefb"; ctx.font="700 18px Sora, sans-serif"; ctx.textAlign="center";
    ctx.fillText("SISTEMA", 420, 150);
    ctx.font="600 13px 'IBM Plex Mono', monospace"; ctx.fillStyle=color;
    ctx.fillText(mode==="endo" ? "ΔH > 0" : "ΔH < 0", 420, 176); ctx.textAlign="left";

    // partículas de energia
    for(let i=0;i<10;i++){
      const phase = (t*0.6 + i/10) % 1;
      const ang = (i/10)*Math.PI*2;
      const rOut = 230, rIn = 115;
      const r = mode==="endo" ? rOut - phase*(rOut-rIn) : rIn + phase*(rOut-rIn);
      const x = 420 + Math.cos(ang)*r*1.35, y = 160 + Math.sin(ang)*r*0.62;
      ctx.globalAlpha = mode==="endo" ? 1-phase*0.4 : 1-phase*0.7;
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x,y,5,0,7); ctx.fill();
      ctx.globalAlpha = 1;
    }
  };
  setInfo();
  if(REDUCED()) draw(); else this.loop(draw);
},

/* =====================================================================
   14 · CURVA DE AQUECIMENTO
   ===================================================================== */
build_heatingCurve(host){
  const W=840, H=420, PAD=64;
  const { cv, ctx } = this.canvas(host, W, H);
  const out = document.createElement("div"); out.style.marginTop="14px"; host.appendChild(out);
  const info = document.createElement("div"); info.className="block block-formal"; out.appendChild(info);

  // (energia acumulada em unidades relativas, temperatura em °C)
  const pts = [ [0,-20], [10,0], [90,0], [190,100], [730,100], [780,120] ];
  const segs = [
    { i:0, n:"Aquecimento do gelo", d:"A energia aumenta a vibração das partículas do sólido: a temperatura sobe de −20 °C até 0 °C." },
    { i:1, n:"Patamar de FUSÃO (0 °C)", d:"A energia é usada para vencer as interações do cristal. Coexistem gelo e água líquida e a temperatura fica constante." },
    { i:2, n:"Aquecimento da água líquida", d:"Toda a água está líquida: a energia volta a aumentar a agitação e a temperatura sobe até 100 °C." },
    { i:3, n:"Patamar de EBULIÇÃO (100 °C)", d:"O trecho mais longo do gráfico: separar completamente as moléculas custa muito mais energia que fundir. Coexistem líquido e vapor." },
    { i:4, n:"Aquecimento do vapor", d:"Toda a água virou vapor e a temperatura volta a subir." }
  ];
  const maxE = 780;
  const X = e => PAD + e/maxE*(W-PAD-40);
  const Y = t => (H-PAD) - (t+30)/170*(H-PAD-30);
  let hover = -1;

  const draw = ()=>{
    ctx.clearRect(0,0,W,H);
    // grade
    ctx.strokeStyle="rgba(140,165,255,.10)"; ctx.lineWidth=1;
    [-20,0,25,50,75,100,120].forEach(t=>{ ctx.beginPath(); ctx.moveTo(PAD,Y(t)); ctx.lineTo(W-40,Y(t)); ctx.stroke(); });
    // eixos
    ctx.strokeStyle="rgba(140,165,255,.4)"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(PAD,20); ctx.lineTo(PAD,H-PAD); ctx.lineTo(W-30,H-PAD); ctx.stroke();
    ctx.fillStyle="#8391bd"; ctx.font="500 13px 'IBM Plex Mono', monospace";
    [-20,0,50,100,120].forEach(t=>ctx.fillText(t+"°C", 16, Y(t)+4));
    ctx.fillText("energia fornecida →", W-220, H-PAD+32);

    // segmentos
    for(let s=0;s<5;s++){
      const a = pts[s], b = pts[s+1];
      const plateau = a[1] === b[1];
      ctx.strokeStyle = hover===s ? "#22d3ee" : (plateau ? "#fbbf24" : "#4c6fff");
      ctx.lineWidth = hover===s ? 6 : 4;
      ctx.beginPath(); ctx.moveTo(X(a[0]),Y(a[1])); ctx.lineTo(X(b[0]),Y(b[1])); ctx.stroke();
    }
    // rótulos
    ctx.fillStyle="#fbbf24"; ctx.font="600 13px 'IBM Plex Mono', monospace";
    ctx.fillText("fusão", X(35), Y(0)-14);
    ctx.fillText("ebulição", X(420), Y(100)-14);
    ctx.fillStyle="#93b0ff";
    ctx.fillText("sólido", X(14), Y(-24));
    ctx.fillText("líquido", X(120), Y(48));
    ctx.fillText("vapor", X(690), Y(114));
  };

  const setInfo = s=>{
    if(s<0){ info.innerHTML = `<p class="muted small">Passe o mouse ou toque nos trechos do gráfico para ver o que acontece com as partículas em cada etapa.</p>`; return; }
    const seg = segs[s];
    const plateau = pts[s][1] === pts[s+1][1];
    info.innerHTML = `<span class="tag ${plateau?"amber":"cyan"}">${plateau?"patamar · mudança de fase":"rampa · aquecendo uma fase"}</span>
      <h3>${seg.n}</h3><p class="lead">${seg.d}</p>`;
  };

  const pick = e=>{
    const r = cv.getBoundingClientRect();
    const x = ((e.touches?e.touches[0].clientX:e.clientX) - r.left) * (cv.width/r.width);
    const e0 = (x-PAD)/(W-PAD-40)*maxE;
    hover = -1;
    for(let s=0;s<5;s++) if(e0>=pts[s][0] && e0<=pts[s+1][0]) hover = s;
    draw(); setInfo(hover);
  };
  cv.addEventListener("pointermove", pick);
  cv.addEventListener("pointerdown", pick);
  cv.style.touchAction = "none";
  draw(); setInfo(-1);
},

/* =====================================================================
   15 · DIAGRAMA DE ENTALPIA
   ===================================================================== */
build_enthalpy(host){
  const W=840,H=380;
  const { cv, ctx } = this.canvas(host, W, H);
  const controls = document.createElement("div"); controls.className="grid two"; controls.style.marginTop="14px"; host.appendChild(controls);
  const out = document.createElement("div"); host.appendChild(out);
  let Hr = 400, Hp = 150;

  const info = document.createElement("div"); info.className="block block-formal"; out.appendChild(info);
  const Yv = v => H-60 - (v/600)*(H-110);

  const refresh = ()=>{
    const dH = Hp - Hr;
    const exo = dH < 0;
    info.innerHTML = `
      <div class="sim-readout" style="margin-bottom:10px">
        <span class="readout-item">H reagentes: <b>${Hr} kJ</b></span>
        <span class="readout-item">H produtos: <b>${Hp} kJ</b></span>
        <span class="readout-item ${exo?"state-liq":"state-gas"}">ΔH = ${Hp} − ${Hr} = <b>${dH} kJ</b></span>
      </div>
      <h3>${exo ? "Reação EXOTÉRMICA" : dH===0 ? "Sem variação de entalpia" : "Reação ENDOTÉRMICA"}</h3>
      <p class="lead">${exo
        ? "Os produtos têm menor entalpia que os reagentes: o sistema <b>liberou</b> energia para a vizinhança. EXO = EXPORTA energia, ΔH &lt; 0."
        : dH===0 ? "Produtos e reagentes no mesmo nível energético."
        : "Os produtos têm maior entalpia que os reagentes: o sistema <b>absorveu</b> energia da vizinhança. ENDO = energia ENTRA, ΔH &gt; 0."}</p>`;
  };

  const draw = ()=>{
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle="rgba(140,165,255,.35)"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(80,20); ctx.lineTo(80,H-50); ctx.lineTo(W-40,H-50); ctx.stroke();
    ctx.fillStyle="#8391bd"; ctx.font="600 13px 'IBM Plex Mono', monospace";
    ctx.save(); ctx.translate(34,180); ctx.rotate(-Math.PI/2); ctx.fillText("Entalpia (kJ)",0,0); ctx.restore();
    ctx.fillText("caminho da reação →", W-230, H-22);

    const exo = Hp < Hr;
    // níveis
    ctx.strokeStyle="#93b0ff"; ctx.lineWidth=5;
    ctx.beginPath(); ctx.moveTo(140,Yv(Hr)); ctx.lineTo(360,Yv(Hr)); ctx.stroke();
    ctx.strokeStyle= exo ? "#7dd3fc" : "#fda4af";
    ctx.beginPath(); ctx.moveTo(520,Yv(Hp)); ctx.lineTo(740,Yv(Hp)); ctx.stroke();

    // seta ΔH
    ctx.strokeStyle = exo ? "#7dd3fc" : "#fb7185"; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(440,Yv(Hr)); ctx.lineTo(440,Yv(Hp)); ctx.stroke();
    const dir = Yv(Hp) > Yv(Hr) ? 1 : -1;
    ctx.beginPath(); ctx.moveTo(434,Yv(Hp)-8*dir); ctx.lineTo(446,Yv(Hp)-8*dir); ctx.lineTo(440,Yv(Hp)); ctx.closePath(); ctx.fill();
    // linha ligando
    ctx.setLineDash([5,5]); ctx.strokeStyle="rgba(255,255,255,.25)"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(360,Yv(Hr)); ctx.lineTo(520,Yv(Hp)); ctx.stroke(); ctx.setLineDash([]);

    ctx.fillStyle="#eaeefb"; ctx.font="700 15px Sora, sans-serif"; ctx.textAlign="center";
    ctx.fillText("REAGENTES", 250, Yv(Hr)-16);
    ctx.fillText("PRODUTOS", 630, Yv(Hp)-16);
    ctx.fillStyle = exo ? "#7dd3fc" : "#fb7185"; ctx.font="700 16px 'IBM Plex Mono', monospace";
    ctx.fillText(`ΔH = ${Hp-Hr} kJ`, 440, (Yv(Hr)+Yv(Hp))/2 - 10);
    ctx.font="600 13px 'IBM Plex Mono', monospace";
    ctx.fillText(exo ? "energia liberada" : "energia absorvida", 440, (Yv(Hr)+Yv(Hp))/2 + 12);
    ctx.textAlign="left";
  };

  const a = document.createElement("div"), b = document.createElement("div");
  controls.append(a,b);
  this.slider(a, { label:"Entalpia dos reagentes", min:50, max:600, step:10, value:400, unit:" kJ", onInput:v=>{ Hr=v; draw(); refresh(); }});
  this.slider(b, { label:"Entalpia dos produtos", min:50, max:600, step:10, value:150, unit:" kJ", onInput:v=>{ Hp=v; draw(); refresh(); }});
},

/* =====================================================================
   16 · ENERGIA DAS MUDANÇAS DE FASE
   ===================================================================== */
build_phaseEnergy(host){
  const DATA = [
    { n:"Fusão da água", dh:"+6,0 kJ/mol", sign:1, d:"Soltar as moléculas do arranjo cristalino." },
    { n:"Solidificação da água", dh:"−6,0 kJ/mol", sign:-1, d:"As moléculas se organizam no cristal e liberam energia." },
    { n:"Vaporização da água", dh:"+40,7 kJ/mol", sign:1, d:"Separar quase completamente as moléculas — custa muito mais que fundir." },
    { n:"Condensação da água", dh:"−40,7 kJ/mol", sign:-1, d:"Mesmo módulo da vaporização, sinal trocado. É o que agrava a queimadura por vapor." },
    { n:"Sublimação", sign:1, dh:"ΔH > 0", d:"Sólido direto para gás: absorve a soma das energias de fusão e vaporização." },
    { n:"Deposição", sign:-1, dh:"ΔH < 0", d:"Gás direto para sólido: libera energia." }
  ];
  const grid = document.createElement("div");
  grid.className = "transitions";
  host.appendChild(grid);
  const info = document.createElement("div"); info.className="block block-formal"; info.style.marginTop="14px";
  info.innerHTML = `<p class="muted small">Escolha uma transformação para ver o sinal do ΔH e o sentido do fluxo de energia.</p>`;
  host.appendChild(info);

  DATA.forEach(d=>{
    const b = document.createElement("button");
    b.type="button"; b.className = "trans-btn " + (d.sign>0?"endo":"exo");
    b.innerHTML = `<b>${d.n}</b><span>${d.dh}</span>`;
    b.addEventListener("click", ()=>{
      grid.querySelectorAll(".trans-btn").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      info.innerHTML = `<span class="tag ${d.sign>0?"rose":"cyan"}">${d.sign>0?"endotérmica · ΔH > 0":"exotérmica · ΔH < 0"}</span>
        <h3>${d.n} · ${d.dh}</h3><p class="lead">${d.d}</p>
        <p class="small mono" style="margin-top:10px;color:${d.sign>0?"#fda4af":"#7dd3fc"}">
        ${d.sign>0 ? "SISTEMA ← energia (a vizinhança esfria)" : "SISTEMA → energia (a vizinhança esquenta)"}</p>`;
    });
    grid.appendChild(b);
  });
}
};
