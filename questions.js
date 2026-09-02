/* =====================================================================
   app.js — roteador e casca da aplicação
   ===================================================================== */

const App = {
  main: null,

  init(){
    this.main = document.getElementById("main");
    State.load();
    this.bindShell();
    this.renderTopbar();
    document.addEventListener("state:change", ()=>this.renderTopbar());
    window.addEventListener("hashchange", ()=>this.route());
    this.route();
  },

  /* ---------- casca ---------- */
  bindShell(){
    const rail = document.getElementById("rail");
    const scrim = document.getElementById("railScrim");
    const menuBtn = document.getElementById("menuBtn");

    const closeRail = ()=>{
      rail.classList.remove("open");
      scrim.hidden = true;
      menuBtn.setAttribute("aria-expanded","false");
    };
    menuBtn.addEventListener("click", ()=>{
      const open = rail.classList.toggle("open");
      scrim.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    scrim.addEventListener("click", closeRail);
    rail.addEventListener("click", e=>{ if(e.target.closest("a")) closeRail(); });
    document.addEventListener("keydown", e=>{ if(e.key === "Escape") closeRail(); });

    document.getElementById("resetBtn").addEventListener("click", ()=>{
      if(confirm("Isso apaga todo o seu progresso, XP e histórico neste navegador. Deseja continuar?")){
        State.reset();
        UI.toast("Progresso zerado");
        this.route();
      }
    });
  },

  renderTopbar(){
    const lvl = State.level();
    const cp = State.courseProgress();
    document.getElementById("topbarStats").innerHTML = `
      <span class="chip streak" title="Dias seguidos de estudo">🔥 <b>${State.data.streak.count}</b></span>
      <span class="chip" title="Progresso da jornada">${cp.pct}%</span>
      <span class="chip level" title="${State.data.xp} XP">Nv ${lvl.index+1} · <b>${State.data.xp} XP</b></span>`;
  },

  markNav(route){
    document.querySelectorAll("[data-route]").forEach(a=>{
      const r = a.getAttribute("data-route");
      a.classList.toggle("active", r === route || (r !== "/" && route.startsWith(r)));
    });
  },

  /* ---------- roteador ---------- */
  parse(){
    const raw = location.hash.replace(/^#/, "") || "/";
    const [pathPart, queryPart] = raw.split("?");
    const parts = pathPart.split("/").filter(Boolean);
    const params = {};
    if(queryPart) queryPart.split("&").forEach(kv=>{
      const [k,v] = kv.split("=");
      params[decodeURIComponent(k)] = decodeURIComponent(v || "");
    });
    return { parts, params, path: "/" + parts.join("/") };
  },

  route(){
    Sims.clear();
    const { parts, params } = this.parse();
    const head = parts[0] || "";
    const main = this.main;
    window.scrollTo({ top:0, behavior:"instant" in document.documentElement.style ? "instant" : "auto" });

    switch(head){
      case "":            Views.home(main); this.markNav("/"); break;
      case "jornada":     Views.jornada(main); this.markNav("/jornada"); break;
      case "capitulo-4":
      case "capitulo-5":
      case "capitulo-6":
        if(parts[1] === "fim") Views.chapterEnd(main, head);
        else Views.chapter(main, head, parts[1] || 0);
        this.markNav("/"+head);
        break;
      case "laboratorio": Views.laboratorio(main); this.markNav("/laboratorio"); break;
      case "exercicios":  Views.exercicios(main); this.markNav("/exercicios"); break;
      case "simulado":    Views.simulado(main, params); this.markNav("/simulado"); break;
      case "memoria":     Views.memoria(main); this.markNav("/memoria"); break;
      case "mapa":        Views.mapa(main); this.markNav("/mapa"); break;
      case "progresso":   Views.progresso(main); this.markNav("/progresso"); break;
      default:
        main.innerHTML = `<div class="view"><section class="panel">
          <p class="eyebrow">404</p><h1 class="section-title">Essa página não existe na jornada</h1>
          <p class="lead">Talvez o link esteja incompleto. Volte ao início e siga pelo mapa.</p>
          <div class="row" style="margin-top:16px"><a class="btn btn-primary" href="#/">Ir para o início</a></div>
        </section></div>`;
        this.markNav("/");
    }
    this.renderTopbar();
  }
};

document.addEventListener("DOMContentLoaded", ()=>App.init());
