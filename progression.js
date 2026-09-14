
(()=>{const U=window.MAUtils,S=window.MAStorage;
function need(l){return 100+(l-1)*50}
function addXP(n){let p=S.get().profile;p.xp+=Math.max(0,Math.floor(n));while(p.xp>=need(p.level)){p.xp-=need(p.level);p.level++;window.MAAudio?.levelUp()}}
function reward(r){let s=S.get(), now=Date.now();let date=U.today();if(s.economy.date!==date){s.economy.date=date;s.economy.xpToday=0;s.economy.coinsToday=0;s.economy.repeat={}}
let base=0,coins=0;if(r.eligible!==false){base=10+Math.min(25,Math.floor((r.ratio||0)*25))+(r.completed?10:0)+(r.personalBest?15:0);coins=5+Math.min(15,Math.floor((r.ratio||0)*15))+(r.completed?5:0)+(r.personalBest?10:0);if((r.durationMs||0)<900||r.activity<2){base=0;coins=0}}
let k=r.gameId, rep=s.economy.repeat[k]||0;rep++;s.economy.repeat[k]=rep;if(rep>=6){base=Math.floor(base*.25);coins=Math.floor(coins*.25)}
let cap=Math.max(0,2000-s.economy.xpToday);let awarded=Math.min(base,cap);if(s.economy.xpToday>=2000)awarded=Math.floor(base*.25);s.economy.xpToday+=awarded;
let ccap=Math.max(0,1000-s.economy.coinsToday);let ca=Math.min(coins,ccap);if(s.economy.coinsToday>=1000)ca=Math.floor(coins*.25);s.economy.coinsToday+=ca;
s.profile.coins+=ca;addXP(awarded);if(r.daily){addXP(50);s.profile.coins+=50}s.statistics.gamesPlayed++;if(r.completed)s.statistics.gamesCompleted++;s.statistics.totalPlayTimeMs+=(r.durationMs||0);s.statistics.bestScore=Math.max(s.statistics.bestScore,r.score||0);
if(!s.scores[k]||r.score>s.scores[k]){s.scores[k]=r.score||0} s.recentlyPlayed=[k,...s.recentlyPlayed.filter(x=>x!==k)].slice(0,8);if(s.streak.lastPlayedDate!==date){let prev=new Date();prev.setDate(prev.getDate()-1);let ps=prev.toISOString().slice(0,10);s.streak.current=s.streak.lastPlayedDate===ps?s.streak.current+1:1;s.streak.longest=Math.max(s.streak.longest,s.streak.current);s.streak.lastPlayedDate=date}
S.persist();window.dispatchEvent(new CustomEvent("ma-save"));return {xp:awarded,coins:ca}}
window.MAProgression={need,reward,addXP};
})();
