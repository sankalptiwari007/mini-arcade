/* MINI ARCADE V7 — input normalization */
(()=>{
  const keys=new Set(),touch={x:0,y:0,down:false,swipe:null};
  addEventListener("keydown",e=>{keys.add(e.key.toLowerCase());if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase()))e.preventDefault()});
  addEventListener("keyup",e=>keys.delete(e.key.toLowerCase()));
  const local=(c,e)=>{const r=c.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top}};
  const bind=c=>{
    if(!c||c.dataset.maInputBound)return;
    c.dataset.maInputBound="1";
    let sx=0,sy=0;
    c.addEventListener("pointerdown",e=>{const p=local(c,e);touch.down=true;sx=p.x;sy=p.y;touch.x=p.x;touch.y=p.y;touch.swipe=null;try{c.setPointerCapture(e.pointerId)}catch{}});
    c.addEventListener("pointermove",e=>{const p=local(c,e);touch.x=p.x;touch.y=p.y});
    const up=e=>{const p=local(c,e),dx=p.x-sx,dy=p.y-sy;if(Math.hypot(dx,dy)>30)touch.swipe=Math.abs(dx)>Math.abs(dy)?(dx>0?"right":"left"):(dy>0?"down":"up");touch.x=p.x;touch.y=p.y;touch.down=false;try{c.releasePointerCapture(e.pointerId)}catch{}};
    c.addEventListener("pointerup",up);c.addEventListener("pointercancel",up);
  };
  window.MAInput={keys,touch,bind};
})();
