/* MINI ARCADE V7 — stable app shell */
(()=>{
  "use strict";
  const $=s=>document.querySelector(s);
  const S=window.MAStorage;
  let current=null, currentId=null;

  const safe=(fn,fallback)=>{try{return fn()}catch(e){console.error(e);return fallback}};
  const setText=(sel,value)=>{const e=$(sel);if(e)e.textContent=String(value)};
  const setWidth=(sel,value)=>{const e=$(sel);if(e)e.style.width=`${Math.max(0,Math.min(100,Number(value)||0))}%`};

  function toast(text){
    const e=$("#toast"); if(!e)return;
    e.textContent=text; e.classList.add("show");
    clearTimeout(e._timer); e._timer=setTimeout(()=>e.classList.remove("show"),2200);
  }

  function applySettings(){
    const s=S.get().settings||{};
    document.documentElement.dataset.graphics=s.graphicsQuality||"auto";
    document.body.dataset.theme=s.theme||"neon";
    document.body.classList.toggle("reduced-motion",!!s.reducedMotion);
  }

  function saveUI(){
    const s=S.get(), p=s.profile||{}, n=window.MAProgression.need(p.level||1);
    setText("#coins",Math.floor(p.coins||0));
    setText("#level",p.level||1);
    setText("#xp",`${Math.floor(p.xp||0)}/${n} XP`);
    setWidth("#xpbar",(p.xp||0)/n*100);
    setText("#streak",s.streak?.current||0);
    applySettings();
  }

  function card(g){
    const fav=(S.get().favorites||[]).includes(g.id);
    return `<article class="card game-card" data-game-card="${g.id}">
      <div><div class="game-icon">${g.icon}</div><div class="game-title">${g.title}</div>
      <p class="sub">${g.description}</p><span class="pill">${g.category} · ${g.difficulty}</span></div>
      <div class="row"><button class="btn" type="button" data-play="${g.id}">Play</button>
      <button class="btn" type="button" data-favorite="${g.id}" aria-label="Favorite ${g.title}">${fav?"★":"☆"}</button></div>
    </article>`;
  }

  function page(name){
    const m=$("#content"); if(!m)return;
    document.querySelectorAll(".nav button").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
    if(name==="games"){
      m.innerHTML=`<div class="top"><div><div class="title">Games</div><div class="sub">25 complete offline arcade experiences.</div></div></div><div class="grid">${MAGameRegistry.map(card).join("")}</div>`;
    }else if(name==="favorites"){
      const fav=new Set(S.get().favorites||[]);
      m.innerHTML=`<div class="title">Favorites</div><div class="grid">${MAGameRegistry.filter(g=>fav.has(g.id)).map(card).join("")||"<div class='card'>No favorites yet.</div>"}</div>`;
    }else if(name==="achievements"){
      const s=S.get();
      m.innerHTML=`<div class="title">Achievements</div><div class="grid">${MAAchievements.defs.map(a=>`<div class="card"><b>${s.achievements[a.id]?"🏆":"🔒"} ${a.title}</b><p class="sub">${a.desc}</p><span class="pill">+${a.reward} XP/Coins</span></div>`).join("")}</div>`;
    }else if(name==="settings"){
      const s=S.get();
      m.innerHTML=`<div class="title">Settings</div><div class="settings">
      <div class="card"><h3>Gameplay</h3><label>Show controls <input id="showControls" type="checkbox" ${s.settings.showControls?"checked":""}></label></div>
      <div class="card"><h3>Graphics</h3><label>Quality <select id="quality">${["auto","low","medium","high","ultra"].map(x=>`<option value="${x}" ${s.settings.graphicsQuality===x?"selected":""}>${x}</option>`).join("")}</select></label><label>Reduced motion <input id="reduced" type="checkbox" ${s.settings.reducedMotion?"checked":""}></label></div>
      <div class="card"><h3>Audio</h3><label>Sound <input id="sound" type="checkbox" ${s.settings.soundEnabled?"checked":""}></label><label>Music <input id="music" type="checkbox" ${s.settings.musicEnabled?"checked":""}></label><label>Volume <input id="volume" type="range" min="0" max="1" step=".05" value="${s.settings.volume}"></label></div>
      <div class="card"><h3>Appearance</h3><label>Theme <select id="theme">${["neon","cyber","midnight","retro","arcade","solar"].map(x=>`<option value="${x}" ${s.settings.theme===x?"selected":""}>${x}</option>`).join("")}</select></label></div>
      <div class="card"><h3>Data</h3><div class="row"><button class="btn" type="button" id="export">Export Save</button><button class="btn" type="button" id="import">Import Save</button><button class="btn" type="button" id="reset">Reset Data</button></div></div>
      <div class="card"><h3>About</h3><p class="sub">MINI ARCADE V7 · Offline Edition · Version 7.0.0</p></div></div>`;
      bindSettings();
    }else{
      const s=S.get(), p=s.profile, challenge=s.dailyChallenge?.text||"Loading daily challenge…", done=!!s.dailyChallenge?.completed, n=MAProgression.need(p.level);
      m.innerHTML=`<div class="hero"><div class="sub">MINI ARCADE V7</div><h1>PLAY. COMPETE. LEVEL UP.</h1><p>Premium offline arcade with 25 playable games, local progression, achievements, daily challenges and responsive controls.</p><div class="row"><button class="btn" type="button" data-page-go="games">Browse Games</button><button class="btn" type="button" data-play="snake">Play Snake</button></div></div>
      <div class="stats"><div class="stat"><span class="sub">Level</span><br><b>${p.level}</b></div><div class="stat"><span class="sub">Coins</span><br><b>${Math.floor(p.coins)}</b></div><div class="stat"><span class="sub">Best Score</span><br><b>${Math.floor(s.statistics.bestScore||0)}</b></div><div class="stat"><span class="sub">Streak</span><br><b>${s.streak.current||0} 🔥</b></div></div>
      <div class="card"><h3>XP Progress</h3><div class="bar"><i id="homexp" style="width:${p.xp/n*100}%"></i></div><p class="sub">${p.xp}/${n} XP</p></div>
      <div class="card"><h3>Daily Challenge</h3><p>${challenge}</p><span class="pill">${done?"Completed":"In progress"}</span></div><h2>Featured</h2><div class="grid">${MAGameRegistry.slice(0,6).map(card).join("")}</div>`;
    }
  }

  function launch(id){
    const g=MAGameRegistry.find(q=>q.id===id);
    const factory=window.MAV6Games?.[id];
    if(!g||typeof factory!=="function"){toast("Game unavailable");return false;}
    const canvas=$("#canvas"), modal=$("#gameModal"), err=$("#gameError");
    if(!canvas||!modal){toast("Game screen unavailable");return false;}
    try{
      if(current?.destroy)current.destroy();
      current=null; currentId=id;
      if(err){err.style.display="none";err.textContent="";}
      $("#gameTitle").textContent=`${g.icon} ${g.title}`;
      $("#gameDesc").textContent=g.description;
      modal.classList.add("open");
      const ctx={gameId:id,canvas,input:MAInput,audio:MAAudio,graphics:MAGraphics,storage:S,
        reportScore:()=>{},
        reportResult:r=>finish(r),
        requestReward:()=>{},unlockAchievement:()=>{},getSettings:()=>S.get().settings};
      current=factory(ctx);
      if(!current||typeof current.create!=="function"||typeof current.start!=="function")throw Error("Invalid game module");
      current.create(); current.start();
      return true;
    }catch(e){
      console.error("Game launch failed:",e);
      if(err){err.textContent="This game could not start. Your save is safe.";err.style.display="inline-block";}
      else toast("This game could not start");
      try{current?.destroy()}catch{}
      current=null; return false;
    }
  }

  function finish(r={}){
    const result={...r,gameId:r.gameId||currentId,score:Number(r.score)||0,durationMs:Number(r.durationMs)||0,activity:Number(r.activity)||0,completed:!!r.completed,personalBest:!!r.personalBest};
    try{
      MAChallenges.progress(result);
      const out=MAProgression.reward(result);
      const ach=MAAchievements.check();
      toast(`+${out.xp} XP · +${out.coins} coins`+(ach.length?` · ${ach.length} achievement!`:""));
      saveUI();
    }catch(e){console.error("Progression error:",e);toast("Score saved with limited rewards");}
    setTimeout(()=>{closeGame();page("home")},80);
  }

  function closeGame(){
    try{current?.destroy()}catch(e){console.error(e)}
    current=null;currentId=null;
    $("#gameModal")?.classList.remove("open");
    saveUI();
  }

  function favorite(id){
    const s=S.get(), list=s.favorites||[], i=list.indexOf(id);
    if(i>=0)list.splice(i,1);else list.push(id);
    s.favorites=list;S.persist();saveUI();page("favorites");
  }

  function bindSettings(){
    const s=S.get();
    const bind=(id,key,fn)=>{const e=$(id);if(e)e[fn||"onchange"]=ev=>{s.settings[key]=fn==="oninput"?+ev.target.value:((ev.target.type==="checkbox")?ev.target.checked:ev.target.value);S.persist();applySettings()}};
    bind("#showControls","showControls");bind("#quality","graphicsQuality");bind("#reduced","reducedMotion");bind("#sound","soundEnabled");bind("#music","musicEnabled");bind("#volume","volume","oninput");bind("#theme","theme");
    $("#export")?.addEventListener("click",()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([S.export()],{type:"application/json"}));a.download="mini-arcade-save.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast("Save exported")});
    $("#import")?.addEventListener("click",()=>{const i=document.createElement("input");i.type="file";i.accept=".json,application/json";i.onchange=async()=>{try{if(!i.files?.[0])return;S.import(await i.files[0].text());saveUI();page("home");toast("Save imported")}catch{toast("Invalid save — current data preserved")}};i.click()});
    $("#reset")?.addEventListener("click",()=>{if(confirm("Reset all local progress?")){S.reset();saveUI();page("home");toast("Data reset")}});
  }

  document.addEventListener("click",e=>{
    const play=e.target.closest?.("[data-play]"); if(play){e.preventDefault();launch(play.dataset.play);return;}
    const fav=e.target.closest?.("[data-favorite]"); if(fav){e.preventDefault();favorite(fav.dataset.favorite);return;}
    const pg=e.target.closest?.("[data-page-go]"); if(pg){e.preventDefault();page(pg.dataset.pageGo);return;}
  });
  document.querySelectorAll(".nav button").forEach(b=>b.addEventListener("click",()=>page(b.dataset.page)));
  $("#closeGame")?.addEventListener("click",closeGame);
  $("#pauseGame")?.addEventListener("click",()=>current?.pause?.());
  $("#resumeGame")?.addEventListener("click",()=>current?.resume?.());
  $("#restartGame")?.addEventListener("click",()=>current?.restart?.());
  $("#gameModal")?.addEventListener("click",e=>{if(e.target.id==="gameModal")closeGame()});

  window.addEventListener("error",e=>{console.error(e.error||e.message);if($("#gameModal")?.classList.contains("open")){const x=$("#gameError");if(x){x.textContent="A game error occurred. Your save is safe.";x.style.display="inline-block"}}});
  window.addEventListener("unhandledrejection",e=>{console.error(e.reason);if($("#gameModal")?.classList.contains("open")){const x=$("#gameError");if(x){x.textContent="A game error occurred. Your save is safe.";x.style.display="inline-block"}}});

  window.MAApp={page,launch,favorite,closeGame};
  safe(()=>window.validateRegistry(),false);
  safe(()=>saveUI());
  safe(()=>page("home"));
})();

/* V7 visual runtime */
(()=>{
  const apply=()=>{try{const s=window.MAStorage?.get?.();document.documentElement.dataset.graphics=s?.settings?.graphicsQuality||"auto";document.body.classList.toggle("reduced-motion",!!s?.settings?.reducedMotion);document.body.dataset.theme=s?.settings?.theme||"neon"}catch(e){}};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",apply,{once:true});else apply();
  window.MAV7Visual={refresh:apply};
})();

/* V7 pointer depth — never blocks game input */
(()=>{
  if(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)return;
  const bind=()=>document.querySelectorAll(".game-card:not([data-ma3d-bound])").forEach(card=>{
    card.dataset.ma3dBound="1";
    card.addEventListener("pointermove",e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg) translateY(-6px)`});
    card.addEventListener("pointerleave",()=>card.style.transform="");
  });
  bind();new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});
})();
