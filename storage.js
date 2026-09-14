(()=>{
  const KEY="miniArcadeV7.save",CURRENT=2;
  const defaults=()=>({schemaVersion:CURRENT,profile:{level:1,xp:0,coins:0},scores:{},statistics:{gamesPlayed:0,gamesCompleted:0,totalPlayTimeMs:0,bestScore:0,favoriteGameId:null,bestReactionMs:null},favorites:[],recentlyPlayed:[],achievements:{},dailyChallenge:{},streak:{current:0,longest:0,lastPlayedDate:null},settings:{theme:"neon",graphicsQuality:"auto",soundEnabled:true,musicEnabled:true,volume:1,reducedMotion:false,showControls:true},gameData:{},economy:{xpToday:0,coinsToday:0,date:null,repeat:{},lastEventAt:0}});
  function migrate(x){
    const d=defaults(); if(!x||typeof x!=="object")return d;
    Object.assign(d,x); d.profile=Object.assign(d.profile,x.profile||{}); d.statistics=Object.assign(d.statistics,x.statistics||{}); d.settings=Object.assign(d.settings,x.settings||{}); d.streak=Object.assign(d.streak,x.streak||{}); d.economy=Object.assign(d.economy,x.economy||{});
    d.scores=(x.scores&&typeof x.scores==="object")?x.scores:{}; d.favorites=Array.isArray(x.favorites)?x.favorites:[]; d.recentlyPlayed=Array.isArray(x.recentlyPlayed)?x.recentlyPlayed:[]; d.achievements=x.achievements&&typeof x.achievements==="object"?x.achievements:{}; d.gameData=x.gameData&&typeof x.gameData==="object"?x.gameData:{}; d.economy.repeat=d.economy.repeat&&typeof d.economy.repeat==="object"?d.economy.repeat:{}; d.schemaVersion=CURRENT;
    d.profile.level=Math.max(1,Math.floor(Number(d.profile.level)||1)); d.profile.xp=Math.max(0,Number(d.profile.xp)||0); d.profile.coins=Math.max(0,Number(d.profile.coins)||0); d.settings.volume=Math.max(0,Math.min(1,Number(d.settings.volume)||0));
    return d;
  }
  let save;try{save=migrate(JSON.parse(localStorage.getItem(KEY)||"null"))}catch{save=defaults()}
  function persist(){try{localStorage.setItem(KEY,JSON.stringify(save))}catch{}}
  window.MAStorage={get:()=>save,set:x=>{save=migrate(x);persist();return save},persist,reset:()=>{save=defaults();persist();return save},export:()=>JSON.stringify(save,null,2),import:txt=>{const b=JSON.parse(txt);if(!b||typeof b!=="object")throw Error("Invalid save");const old=save;try{save=migrate(b);persist();return true}catch(e){save=old;throw e}},defaults,migrate};
})();
