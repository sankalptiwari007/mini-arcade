
window.MAGraphics={fitCanvas(c){let r=window.devicePixelRatio||1,w=c.clientWidth,h=c.clientHeight;c.width=Math.max(1,Math.floor(w*r));c.height=Math.max(1,Math.floor(h*r));let x=c.getContext("2d");x.setTransform(r,0,0,r,0,0);return {ctx:x,w,h,dpr:r}},quality(){let q=MAStorage.get().settings.graphicsQuality;if(q==="auto")return Math.min(2,Math.max(1,devicePixelRatio||1));return {low:1,medium:1.25,high:1.5,ultra:2}[q]||1}};


/* ===== MINI ARCADE V6 — OFFLINE WEBGL 3D WORLD ===== */
(function(){
  const V3D = {
    started:false,
    start(){
      if(this.started) return;
      this.started=true;
      if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
      const stage = document.querySelector('.game-stage, .game-screen, main');
      if(!stage) return;
      const c=document.createElement('canvas');
      c.className='ma-webgl-world';
      c.setAttribute('aria-hidden','true');
      stage.style.position = stage.style.position || 'relative';
      stage.insertBefore(c, stage.firstChild);
      const gl=c.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:false});
      if(!gl){ c.remove(); return; }

      const vs=`attribute vec3 p; uniform mat4 m; uniform float t; varying float z;
      void main(){ vec3 q=p; q.y += sin(q.x*0.7+t)*0.10; gl_Position=m*vec4(q,1.0); z=q.z; gl_PointSize=2.0; }`;
      const fs=`precision mediump float; varying float z; uniform float a;
      void main(){ float g=.5+.5*sin(z*1.7); gl_FragColor=vec4(.18+.25*g,.55+.25*g,1.0,a); }`;
      const sh=(type,src)=>{let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s};
      const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
      gl.useProgram(pr);
      const loc=gl.getAttribLocation(pr,'p'), ml=gl.getUniformLocation(pr,'m'), tl=gl.getUniformLocation(pr,'t'), al=gl.getUniformLocation(pr,'a');

      // Dense perspective grid plus distant stars.
      const pts=[];
      for(let x=-12;x<=12;x+=1) for(let z=-18;z<=5;z+=1) pts.push(x*1.15,-2.0,z);
      for(let i=0;i<180;i++) pts.push((Math.random()-.5)*26,Math.random()*13-1,Math.random()*-28);
      const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(pts),gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);
      gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.clearColor(0,0,0,0);

      function mat(t){
        const f=1.25, asp=c.width/c.height, near=.1, far=60;
        const pm=new Float32Array(16);
        pm[0]=f/asp; pm[5]=f; pm[10]=(far+near)/(near-far); pm[11]=-1; pm[14]=(2*far*near)/(near-far);
        const a=Math.sin(t*.00012)*.12, ca=Math.cos(a), sa=Math.sin(a);
        const v=new Float32Array(16);
        v[0]=ca;v[2]=sa;v[5]=1;v[8]=-sa;v[10]=ca;v[12]=0;v[13]=0.15;v[14]=-9;v[15]=1;
        const out=new Float32Array(16);
        for(let r=0;r<4;r++)for(let col=0;col<4;col++)out[col*4+r]=pm[0*4+r]*v[col*4+0]+pm[1*4+r]*v[col*4+1]+pm[2*4+r]*v[col*4+2]+pm[3*4+r]*v[col*4+3];
        return out;
      }
      function frame(t){
        const dpr=Math.min(devicePixelRatio||1,2), w=stage.clientWidth, h=stage.clientHeight;
        c.width=Math.max(1,w*dpr);c.height=Math.max(1,h*dpr);c.style.width=w+'px';c.style.height=h+'px';
        gl.viewport(0,0,c.width,c.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.uniformMatrix4fv(ml,false,mat(t));gl.uniform1f(tl,t*.001);gl.uniform1f(al,.23);
        gl.drawArrays(gl.POINTS,0,pts.length);
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
  };
  window.MINI_ARCADE_3D=V3D;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>V3D.start(),{once:true});
  else V3D.start();
})();
