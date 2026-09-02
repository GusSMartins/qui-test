/* =====================================================================
   quiz.js — motor de exercícios
   Quiz.render(question, host, { onDone, examMode, showNextLabel })
   Tipos suportados: mc · vf · num · match · order · fill
   ===================================================================== */

const Quiz = {

  xpFor(q){ return q.level <= 2 ? 10 : q.level === 3 ? 15 : q.level === 4 ? 20 : 25; },

  levelBadge(q){
    const L = LEVELS[q.level];
    return `<span class="level-badge ${L.color}">${L.dot} Nível ${q.level} · ${L.name}</span>`;
  },

  render(q, host, opts={}){
    host.innerHTML = "";
    host.className = "quiz";
    const examMode = !!opts.examMode;
    let answered = false;

    const head = UI.el("div", { class:"quiz-head" });
    head.innerHTML = `${this.levelBadge(q)}<span class="small muted mono">${TOPICS[q.topic] || ""}</span>`;
    host.appendChild(head);

    const prompt = UI.el("p", { class:"q-prompt" }, q.prompt);
    host.appendChild(prompt);

    const body = UI.el("div"); host.appendChild(body);
    const fbHost = UI.el("div"); host.appendChild(fbHost);
    const actions = UI.el("div", { class:"row" }); host.appendChild(actions);

    /* ---------- conclusão ---------- */
    const finish = (correct, detail="")=>{
      if(answered) return;
      answered = true;
      const meta = State.recordAnswer(q, correct);
      if(correct) State.addXP(this.xpFor(q), "resposta certa");
      if(!examMode) this.feedback(fbHost, q, correct, detail, meta, ()=>this.render(q, host, opts), actions, opts);
      if(opts.onDone) opts.onDone(correct, q);
    };

    /* ---------- por tipo ---------- */
    if(q.type === "mc" || q.type === "vf"){
      const opts_ = q.type === "vf" ? ["Verdadeiro","Falso"] : q.options;
      const correctIdx = q.type === "vf" ? (q.answer ? 0 : 1) : q.answer;
      const list = UI.el("div", { class:"options" });
      opts_.forEach((text,i)=>{
        const b = UI.el("button", { class:"option", type:"button" });
        b.innerHTML = `<span class="key">${String.fromCharCode(65+i)}</span><span>${text}</span>`;
        b.addEventListener("click", ()=>{
          if(answered) return;
          const ok = i === correctIdx;
          list.querySelectorAll(".option").forEach((el,j)=>{
            el.disabled = true;
            if(j === correctIdx) el.classList.add("correct");
            else if(j === i) el.classList.add("wrong");
            else el.classList.add("dim");
          });
          finish(ok, (!ok && q.whyWrong && q.whyWrong[i]) ? q.whyWrong[i] : "");
        });
        list.appendChild(b);
      });
      body.appendChild(list);
    }

    else if(q.type === "num"){
      const wrap = UI.el("div", { class:"num-answer" });
      wrap.innerHTML = `<input type="number" step="any" inputmode="decimal" placeholder="sua resposta" aria-label="Resposta numérica">
        <span class="unit">${q.unit||""}</span>`;
      const btn = UI.el("button", { class:"btn btn-primary btn-sm", type:"button" }, "Responder");
      wrap.appendChild(btn);
      body.appendChild(wrap);
      const inp = wrap.querySelector("input");
      const go = ()=>{
        if(answered) return;
        const v = parseFloat(String(inp.value).replace(",","."));
        if(isNaN(v)){ UI.toast("Digite um valor numérico"); return; }
        const ok = Math.abs(v - q.answer) <= (q.tol ?? 0.01);
        inp.disabled = true; btn.disabled = true;
        inp.style.borderColor = ok ? "#34d399" : "#fb7185";
        finish(ok, ok ? "" : `Você respondeu <b>${v}</b>. O valor correto é <b>${q.answer} ${q.unit||""}</b>.`);
      };
      btn.addEventListener("click", go);
      inp.addEventListener("keydown", e=>{ if(e.key === "Enter") go(); });
    }

    else if(q.type === "match"){
      const left = q.pairs.map(p=>p[0]);
      const right = UI.shuffle(q.pairs.map(p=>p[1]));
      const grid = UI.el("div", { class:"match-grid" });
      const colL = UI.el("div", { class:"match-col" }), colR = UI.el("div", { class:"match-col" });
      grid.append(colL, colR); body.appendChild(grid);
      let selL = null;
      const links = {};   // esquerda -> direita

      const paint = ()=>{
        colL.querySelectorAll("button").forEach(b=>{
          b.classList.toggle("sel", b.dataset.v === selL);
          b.classList.toggle("paired", !!links[b.dataset.v]);
          const target = links[b.dataset.v];
          b.querySelector(".lnk").textContent = target ? " → " + target : "";
        });
        colR.querySelectorAll("button").forEach(b=>{
          b.classList.toggle("paired", Object.values(links).includes(b.dataset.v));
        });
        check.disabled = Object.keys(links).length !== left.length;
      };

      left.forEach(t=>{
        const b = UI.el("button", { class:"match-item", type:"button", "data-v":t });
        b.innerHTML = `<b>${t}</b><span class="lnk mono small" style="color:var(--cyan)"></span>`;
        b.addEventListener("click", ()=>{ if(answered) return; selL = (selL===t?null:t); paint(); });
        colL.appendChild(b);
      });
      right.forEach(t=>{
        const b = UI.el("button", { class:"match-item", type:"button", "data-v":t }, t);
        b.addEventListener("click", ()=>{
          if(answered || !selL) return;
          Object.keys(links).forEach(k=>{ if(links[k] === t) delete links[k]; });
          links[selL] = t; selL = null; paint();
        });
        colR.appendChild(b);
      });

      const check = UI.el("button", { class:"btn btn-primary btn-sm", type:"button" }, "Conferir associações");
      check.disabled = true;
      check.style.marginTop = "12px";
      body.appendChild(check);
      check.addEventListener("click", ()=>{
        if(answered) return;
        let ok = true, errs = [];
        q.pairs.forEach(([l,r])=>{
          const el = colL.querySelector(`[data-v="${CSS.escape(l)}"]`);
          if(links[l] === r) el.classList.add("correct");
          else { el.classList.add("wrong"); ok = false; errs.push(`<b>${l}</b> → ${r}`); }
        });
        colL.querySelectorAll("button").forEach(b=>b.disabled = true);
        colR.querySelectorAll("button").forEach(b=>b.disabled = true);
        check.disabled = true;
        finish(ok, ok ? "" : "Associações corretas: " + errs.join(" · "));
      });
      paint();
    }

    else if(q.type === "order"){
      let items = UI.shuffle(q.items);
      if(items.join("|") === q.items.join("|")) items = UI.shuffle(items);
      const list = UI.el("div", { class:"order-list" });
      body.appendChild(list);

      const paint = ()=>{
        list.innerHTML = "";
        items.forEach((t,i)=>{
          const row = UI.el("div", { class:"order-item", draggable:"true", "data-i":i });
          row.innerHTML = `<span class="num">${i+1}</span><span>${t}</span>
            <span class="moves">
              <button type="button" aria-label="Mover para cima" ${i===0?"disabled":""}>↑</button>
              <button type="button" aria-label="Mover para baixo" ${i===items.length-1?"disabled":""}>↓</button>
            </span>`;
          const [up,down] = row.querySelectorAll(".moves button");
          up.addEventListener("click", ()=>{ if(answered||i===0) return; [items[i-1],items[i]]=[items[i],items[i-1]]; paint(); });
          down.addEventListener("click", ()=>{ if(answered||i===items.length-1) return; [items[i+1],items[i]]=[items[i],items[i+1]]; paint(); });
          row.addEventListener("dragstart", e=>{ if(answered) return; e.dataTransfer.setData("text/plain", i); row.classList.add("dragging"); });
          row.addEventListener("dragend", ()=> row.classList.remove("dragging"));
          row.addEventListener("dragover", e=> e.preventDefault());
          row.addEventListener("drop", e=>{
            e.preventDefault(); if(answered) return;
            const from = +e.dataTransfer.getData("text/plain");
            const moved = items.splice(from,1)[0];
            items.splice(i,0,moved); paint();
          });
          list.appendChild(row);
        });
      };
      paint();

      const check = UI.el("button", { class:"btn btn-primary btn-sm", type:"button" }, "Conferir ordem");
      check.style.marginTop = "12px";
      body.appendChild(check);
      check.addEventListener("click", ()=>{
        if(answered) return;
        const ok = items.join("|") === q.items.join("|");
        list.querySelectorAll(".order-item").forEach((row,i)=>{
          row.classList.add(items[i] === q.items[i] ? "correct" : "wrong");
          row.setAttribute("draggable","false");
          row.querySelectorAll("button").forEach(b=>b.disabled = true);
        });
        check.disabled = true;
        finish(ok, ok ? "" : "Ordem correta: " + q.items.map((t,i)=>`${i+1}. ${t}`).join(" · "));
      });
    }

    else if(q.type === "fill"){
      const slots = [];
      const line = UI.el("div", { class:"fill-slots" });
      q.template.forEach(piece=>{
        if(piece === "@"){
          const s = UI.el("button", { class:"slot", type:"button" }, "____");
          s.dataset.val = "";
          s.addEventListener("click", ()=>{
            if(answered || !s.dataset.val) return;
            const tok = bank.querySelector(`[data-t="${CSS.escape(s.dataset.val)}"]`);
            if(tok) tok.classList.remove("used");
            s.dataset.val = ""; s.textContent = "____"; s.classList.remove("filled");
            check.disabled = slots.some(x=>!x.dataset.val);
          });
          slots.push(s); line.appendChild(s);
        }else{
          line.appendChild(UI.el("span", {}, piece));
        }
      });
      body.appendChild(line);

      const bank = UI.el("div", { class:"token-bank" });
      bank.style.marginTop = "14px";
      UI.shuffle(q.tokens).forEach(t=>{
        const b = UI.el("button", { class:"token", type:"button", "data-t":t }, t);
        b.addEventListener("click", ()=>{
          if(answered || b.classList.contains("used")) return;
          const free = slots.find(s=>!s.dataset.val);
          if(!free){ UI.toast("Todas as lacunas já estão preenchidas"); return; }
          free.dataset.val = t; free.textContent = t; free.classList.add("filled");
          b.classList.add("used");
          check.disabled = slots.some(s=>!s.dataset.val);
        });
        bank.appendChild(b);
      });
      body.appendChild(bank);

      const check = UI.el("button", { class:"btn btn-primary btn-sm", type:"button" }, "Conferir fórmula");
      check.disabled = true; check.style.marginTop = "14px";
      body.appendChild(check);
      check.addEventListener("click", ()=>{
        if(answered) return;
        let ok = true;
        slots.forEach((s,i)=>{
          const good = s.dataset.val === q.answer[i];
          s.classList.add(good ? "correct" : "wrong");
          if(!good) ok = false;
        });
        bank.querySelectorAll(".token").forEach(b=>b.disabled = true);
        check.disabled = true;
        finish(ok, ok ? "" : "Preenchimento correto: " + q.answer.join(" · "));
      });
    }

    return host;
  },

  /* ---------- painel de feedback ---------- */
  feedback(host, q, correct, detail, meta, retry, actions, opts){
    host.innerHTML = "";
    actions.innerHTML = "";
    const box = UI.el("div", { class:"feedback " + (correct ? "ok" : "no") });
    const redemption = meta.redemption ? `<p class="small" style="color:var(--green)">Você já tinha errado esta questão antes — e agora acertou. Isso é evolução real.</p>` : "";
    box.innerHTML = correct
      ? `<div class="fb-title">🔥 Mandou bem!</div>
         <p class="why">${q.explain}</p>${redemption}`
      : `<div class="fb-title">❌ Ainda não.</div>
         ${detail ? `<p class="why">${detail}</p>` : ""}
         <p class="hint">💡 ${q.hint}</p>`;
    host.appendChild(box);

    if(!correct){
      const tryAgain = UI.el("button", { class:"btn btn-primary btn-sm", type:"button" }, "Tentar novamente");
      tryAgain.addEventListener("click", retry);
      const seeWhy = UI.el("button", { class:"btn btn-ghost btn-sm", type:"button" }, "Ver explicação");
      seeWhy.addEventListener("click", ()=>{
        seeWhy.remove();
        const why = UI.el("p", { class:"why" }, "<b>Por que a resposta certa é a certa:</b> " + q.explain);
        box.appendChild(why);
      });
      actions.append(tryAgain, seeWhy);
    }

    if(opts.onNext){
      const next = UI.el("button", { class:"btn " + (correct?"btn-primary":"btn-ghost") + " btn-sm", type:"button" }, opts.nextLabel || "Continuar →");
      next.addEventListener("click", ()=>opts.onNext(correct));
      actions.appendChild(next);
    }
  },

  /* ---------- seleção de questões ---------- */
  pool({ topics=null, levels=null, chapters=null }={}){
    let list = QUESTIONS.slice();
    if(topics && topics.length) list = list.filter(q=>topics.includes(q.topic));
    if(levels && levels.length) list = list.filter(q=>levels.includes(q.level));
    if(chapters && chapters.length){
      const topicsOfChapters = new Set();
      CHAPTERS.filter(c=>chapters.includes(c.id)).forEach(c=>c.lessons.forEach(l=>topicsOfChapters.add(l.topic)));
      // inclui também as questões mistas dos tópicos envolvidos
      list = list.filter(q=>topicsOfChapters.has(q.topic));
    }
    return list;
  },

  /* prioriza o que o aluno ainda não domina */
  smartPick(n, filter={}){
    const pool = this.pool(filter);
    const score = q=>{
      const a = State.data.answers[q.id];
      if(!a) return 2;              // nunca vista: prioridade média-alta
      if(!a.correct) return 3;      // errada: prioridade máxima
      return 1;                     // já acertou
    };
    return UI.shuffle(pool).sort((a,b)=>score(b)-score(a)).slice(0,n);
  }
};
