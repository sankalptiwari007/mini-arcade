
(()=>{const S=window.MAStorage;const defs=[
{id:"first-play",title:"First Steps",desc:"Play your first game.",reward:25},
{id:"ten-games",title:"Arcade Regular",desc:"Play 10 games.",reward:25},
{id:"hundred-games",title:"Arcade Veteran",desc:"Play 100 games.",reward:50},
{id:"score-1000",title:"Four Digits",desc:"Score 1,000 in any game.",reward:25},
{id:"streak-7",title:"On Fire",desc:"Reach a 7-day streak.",reward:25},
{id:"five-bests",title:"Personal Best",desc:"Set five personal bests.",reward:25},
{id:"all-rounder",title:"All-Rounder",desc:"Play every game.",reward:50}];
function check(){let s=S.get(),un=[];defs.forEach(d=>{if(s.achievements[d.id])return;let ok=d.id==="first-play"?s.statistics.gamesPlayed>=1:d.id==="ten-games"?s.statistics.gamesPlayed>=10:d.id==="hundred-games"?s.statistics.gamesPlayed>=100:d.id==="score-1000"?s.statistics.bestScore>=1000:d.id==="streak-7"?s.streak.current>=7:d.id==="five-bests"?Object.keys(s.scores).filter(k=>s.scores[k]>0).length>=5:d.id==="all-rounder"?Object.keys(s.scores).length>=25:false;if(ok){s.achievements[d.id]={date:new Date().toISOString()};s.profile.coins+=d.reward;s.profile.xp+=d.reward;un.push(d)}});S.persist();un.forEach(x=>window.MAAudio?.achievement());return un}window.MAAchievements={defs,check};
})();
