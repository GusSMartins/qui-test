/* =====================================================================
   state.js — progresso do aluno (localStorage)
   Toda a persistência passa por aqui. Para trocar por um banco de dados
   no futuro, basta reimplementar load() e save().
   ===================================================================== */

const STORAGE_KEY = "reagente.progresso.v1";

const DEFAULT_STATE = {
  xp: 0,
  answers: {},        // { questionId: { correct, attempts, lastAt } }
  lessons: {},        // { lessonId: true }
  chapters: {},       // { chapterId: { done:true, score:0-100 } }
  topics: {},         // { topicKey: { right:0, total:0 } }
  missions: {},       // { missionId: true }  (mini-missões dos simuladores)
  flashSeen: {},      // { flashId: true }
  exams: [],          // histórico de simulados
  streak: { count: 0, last: null },
  dailyDone: {},      // { "2026-09-02": true }
  prefs: { reducedFx: false }
};

const State = {
  data: null,

  load(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      this.data = raw ? Object.assign(structuredClone(DEFAULT_STATE), JSON.parse(raw)) : structuredClone(DEFAULT_STATE);
    }catch(e){
      this.data = structuredClone(DEFAULT_STATE);
    }
    this.touchStreak();
    return this.data;
  },

  save(){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data)); }
    catch(e){ /* modo privado / storage cheio: a sessão continua funcionando em memória */ }
    document.dispatchEvent(new CustomEvent("state:change"));
  },

  reset(){
    this.data = structuredClone(DEFAULT_STATE);
    this.touchStreak();
    this.save();
  },

  /* ---------- sequência de estudos ---------- */
  todayKey(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  },

  touchStreak(){
    const today = this.todayKey();
    const s = this.data.streak;
    if(s.last === today) return;
    const yest = new Date(); yest.setDate(yest.getDate()-1);
    const yKey = `${yest.getFullYear()}-${String(yest.getMonth()+1).padStart(2,"0")}-${String(yest.getDate()).padStart(2,"0")}`;
    s.count = (s.last === yKey) ? s.count + 1 : 1;
    s.last = today;
  },

  /* ---------- XP e níveis ---------- */
  addXP(amount, label){
    const before = this.level().index;
    this.data.xp += amount;
    this.save();
    UI.toast(`+${amount} XP${label ? " · " + label : ""}`, "xp");
    const after = this.level().index;
    if(after > before){
      UI.toast(`Novo nível: ${XP_LEVELS[after].name}`, "level");
      UI.confetti();
    }
  },

  level(){
    let idx = 0;
    XP_LEVELS.forEach((l,i)=>{ if(this.data.xp >= l.min) idx = i; });
    const cur = XP_LEVELS[idx];
    const next = XP_LEVELS[idx+1] || null;
    const span = next ? next.min - cur.min : 1;
    const into = this.data.xp - cur.min;
    return { index: idx, name: cur.name, next, pct: next ? Math.min(100, Math.round(into/span*100)) : 100, toNext: next ? next.min - this.data.xp : 0 };
  },

  /* ---------- respostas ---------- */
  recordAnswer(q, correct){
    const prev = this.data.answers[q.id] || { correct:false, attempts:0, wasWrong:false };
    const firstTime = prev.attempts === 0;
    const redemption = prev.attempts > 0 && !prev.correct && correct;
    this.data.answers[q.id] = {
      correct: correct || prev.correct,
      attempts: prev.attempts + 1,
      wasWrong: prev.wasWrong || !correct,
      lastAt: Date.now()
    };
    const t = this.data.topics[q.topic] || { right:0, total:0 };
    t.total += 1;
    if(correct) t.right += 1;
    this.data.topics[q.topic] = t;
    this.touchStreak();
    this.save();
    return { firstTime, redemption };
  },

  topicMastery(topicKey){
    const t = this.data.topics[topicKey];
    if(!t || !t.total) return 0;
    return Math.round(t.right / t.total * 100);
  },

  masteredConcepts(){
    return Object.keys(TOPICS).filter(k=>{
      const t = this.data.topics[k];
      return t && t.total >= 2 && (t.right/t.total) >= 0.7;
    }).length;
  },

  accuracy(){
    const all = Object.values(this.data.answers);
    if(!all.length) return 0;
    const right = all.filter(a=>a.correct).length;
    return Math.round(right/all.length*100);
  },

  answeredCount(){ return Object.values(this.data.answers).reduce((s,a)=>s+a.attempts,0); },
  rightCount(){ return Object.values(this.data.answers).filter(a=>a.correct).length; },

  /* ---------- aulas e capítulos ---------- */
  completeLesson(lessonId, xp=25){
    if(this.data.lessons[lessonId]) return false;
    this.data.lessons[lessonId] = true;
    this.save();
    this.addXP(xp, "conceito concluído");
    return true;
  },

  chapterProgress(ch){
    const total = ch.lessons.length;
    const done = ch.lessons.filter(l=>this.data.lessons[l.id]).length;
    return { done, total, pct: Math.round(done/total*100) };
  },

  courseProgress(){
    const all = CHAPTERS.flatMap(c=>c.lessons);
    const done = all.filter(l=>this.data.lessons[l.id]).length;
    return { done, total: all.length, pct: Math.round(done/all.length*100) };
  },

  chapterUnlocked(index){
    if(index === 0) return true;
    // desbloqueio generoso: metade do capítulo anterior já libera o próximo
    const prev = CHAPTERS[index-1];
    return this.chapterProgress(prev).pct >= 50;
  },

  nextMission(){
    for(const ch of CHAPTERS){
      for(const l of ch.lessons){
        if(!this.data.lessons[l.id]) return { chapter: ch, lesson: l };
      }
    }
    return null;
  },

  weakTopics(n=3){
    return Object.keys(TOPICS)
      .map(k=>({ key:k, name:TOPICS[k], pct:this.topicMastery(k), total:(this.data.topics[k]||{total:0}).total }))
      .sort((a,b)=>{
        if(a.total === 0 && b.total > 0) return 1;
        if(b.total === 0 && a.total > 0) return -1;
        return a.pct - b.pct;
      })
      .slice(0,n);
  },

  strongTopics(n=3){
    return Object.keys(TOPICS)
      .map(k=>({ key:k, name:TOPICS[k], pct:this.topicMastery(k), total:(this.data.topics[k]||{total:0}).total }))
      .filter(t=>t.total > 0)
      .sort((a,b)=>b.pct-a.pct)
      .slice(0,n);
  },

  recordExam(result){
    this.data.exams.unshift(result);
    this.data.exams = this.data.exams.slice(0,10);
    this.save();
  }
};

/* =====================================================================
   UI — utilidades globais (toast, confete, helpers)
   ===================================================================== */
const UI = {
  toastArea: null,

  toast(msg, kind=""){
    if(!this.toastArea) this.toastArea = document.getElementById("toastArea");
    if(!this.toastArea) return;
    const el = document.createElement("div");
    el.className = "toast " + kind;
    el.textContent = msg;
    this.toastArea.appendChild(el);
    setTimeout(()=>{ el.style.opacity="0"; el.style.transform="translateY(8px)"; }, 2400);
    setTimeout(()=> el.remove(), 2900);
  },

  confetti(){
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = document.getElementById("confetti");
    if(!cv) return;
    const ctx = cv.getContext("2d");
    cv.width = innerWidth; cv.height = innerHeight;
    cv.classList.add("on");
    const colors = ["#4c6fff","#22d3ee","#a855f7","#34d399","#fbbf24"];
    const parts = Array.from({length:90},()=>({
      x: innerWidth/2 + (Math.random()-.5)*260,
      y: innerHeight*0.35 + (Math.random()-.5)*80,
      vx:(Math.random()-.5)*7, vy:Math.random()*-9-3,
      r: 3+Math.random()*4, c: colors[(Math.random()*colors.length)|0],
      rot: Math.random()*6, vr:(Math.random()-.5)*.3, life: 1
    }));
    let t = 0;
    const tick = ()=>{
      t++;
      ctx.clearRect(0,0,cv.width,cv.height);
      parts.forEach(p=>{
        p.vy += .28; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= .008;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0,p.life);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r,-p.r*.6,p.r*2,p.r*1.2);
        ctx.restore();
      });
      if(t < 150) requestAnimationFrame(tick);
      else { ctx.clearRect(0,0,cv.width,cv.height); cv.classList.remove("on"); }
    };
    requestAnimationFrame(tick);
  },

  /* helper de criação de elementos */
  el(tag, attrs={}, html=""){
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v])=>{
      if(k === "class") e.className = v;
      else if(k === "html") e.innerHTML = v;
      else e.setAttribute(k, v);
    });
    if(html) e.innerHTML = html;
    return e;
  },

  bar(pct, cls=""){
    return `<div class="bar ${cls}"><i style="width:${Math.max(0,Math.min(100,pct))}%"></i></div>`;
  },

  shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }
};
