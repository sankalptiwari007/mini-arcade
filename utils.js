window.MAUtils={
 clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),
 lerp:(a,b,t)=>a+(b-a)*t,
 rand:(a,b)=>Math.random()*(b-a)+a,
 randi:(a,b)=>Math.floor(Math.random()*(b-a+1))+a,
 choice:a=>a.length?a[Math.floor(Math.random()*a.length)]:undefined,
 today:()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`},
 uid:()=>Math.random().toString(36).slice(2)+Date.now().toString(36),
 fmtTime:ms=>{let s=Math.floor(ms/1000),m=Math.floor(s/60);s%=60;return `${m}:${String(s).padStart(2,"0")}`},
 safeNum:(x,d=0)=>Number.isFinite(Number(x))?Number(x):d
};
