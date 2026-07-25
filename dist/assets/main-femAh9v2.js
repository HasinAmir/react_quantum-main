import"./modulepreload-polyfill-B5Qt9EMX.js";function j(){const e=document.getElementById("hero-canvas");if(!e)return;const t=e.getContext("2d");let n=[],o=[],r=0;const i={x:-1e3,y:-1e3,active:!1};function h(v){const g=e.getBoundingClientRect();i.x=v.clientX-g.left,i.y=v.clientY-g.top,i.active=!0}function a(){i.active=!1,i.x=-1e3,i.y=-1e3}function m(){e.width=window.innerWidth,e.height=window.innerHeight,p()}function p(){const v=Math.min(Math.max(Math.floor(e.width/14),40),130);n=Array.from({length:v},()=>{const g=Math.random()<.15;return{x:Math.random()*e.width,y:Math.random()*e.height,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,radius:g?Math.random()*1+2.5:Math.random()*2+.5,opacity:g?Math.random()*.3+.7:Math.random()*.5+.2,hue:Math.random()>.5?180:270,pulse:Math.random()*Math.PI*2,isEnergyNode:g}}),o=[]}function l(v){if(v.length===0)return;const g=Math.min(v.length,Math.floor(Math.random()*2)+1);for(let c=0;c<g;c++){const s=Math.floor(Math.random()*v.length),[u,d]=v[s],y=Math.random()>.5;o.push({start:y?u:d,end:y?d:u,progress:0,speed:.012+Math.random()*.012,hue:u.hue})}}function b(v){t.clearRect(0,0,e.width,e.height);for(const s of n){if(i.active){const u=s.x-i.x,d=s.y-i.y,y=u*u+d*d;if(y<4e4&&y>0){const x=Math.sqrt(y),M=(1-x/200)*.35;s.x+=u/x*M,s.y+=d/x*M}}s.x+=s.vx,s.y+=s.vy,s.pulse+=.02,(s.x<0||s.x>e.width)&&(s.vx*=-1),(s.y<0||s.y>e.height)&&(s.vy*=-1)}const g=[],c=180;for(let s=0;s<n.length;s++)for(let u=s+1;u<n.length;u++){const d=n[s],y=n[u],x=d.x-y.x,M=d.y-y.y,B=Math.sqrt(x*x+M*M);if(B<c){g.push([d,y]);const T=1-B/c,E=Math.pow(T,2.2)*.22;t.beginPath(),t.strokeStyle=`rgba(0, 240, 255, ${E})`,t.lineWidth=T*.8+.2,t.moveTo(d.x,d.y),t.lineTo(y.x,y.y),t.stroke()}}r||(r=v),v-r>2e3&&(l(g),r=v);for(let s=o.length-1;s>=0;s--){const u=o[s];if(u.progress+=u.speed,u.progress>=1){o.splice(s,1);continue}const d=u.start.x+(u.end.x-u.start.x)*u.progress,y=u.start.y+(u.end.y-u.start.y)*u.progress,x=Math.sin(u.progress*Math.PI);t.beginPath();const M=u.hue===180?`rgba(0, 240, 255, ${x*.95})`:`rgba(216, 180, 254, ${x*.95})`;t.fillStyle=M,t.shadowColor=u.hue===180?"rgba(0, 240, 255, 1)":"rgba(192, 132, 252, 1)",t.shadowBlur=12,t.arc(d,y,2.5,0,Math.PI*2),t.fill(),t.shadowBlur=0}for(const s of n){const u=.5+.5*Math.sin(s.pulse),d=s.opacity*(.7+u*.3),y=s.hue===180?`rgba(0, 240, 255, ${d})`:`rgba(168, 85, 247, ${d})`;if(t.beginPath(),t.fillStyle=y,t.shadowColor=s.hue===180?"rgba(0, 240, 255, 0.9)":"rgba(168, 85, 247, 0.9)",s.isEnergyNode){t.shadowBlur=16+u*4;const x=s.radius*(1+u*.25);t.arc(s.x,s.y,x,0,Math.PI*2),t.fill(),t.beginPath(),t.fillStyle=`rgba(255, 255, 255, ${.85*u})`,t.arc(s.x,s.y,x*.4,0,Math.PI*2),t.fill()}else t.shadowBlur=6+u*2,t.arc(s.x,s.y,s.radius*(.85+u*.3),0,Math.PI*2),t.fill();t.shadowBlur=0}requestAnimationFrame(b)}window.addEventListener("mousemove",h),window.addEventListener("mouseleave",a),window.addEventListener("resize",m),m(),requestAnimationFrame(b)}class I{constructor(t=0,n=0){this.re=t,this.im=n}static polar(t,n){return new I(t*Math.cos(n),t*Math.sin(n))}add(t){return new I(this.re+t.re,this.im+t.im)}sub(t){return new I(this.re-t.re,this.im-t.im)}mul(t){return new I(this.re*t.re-this.im*t.im,this.re*t.im+this.im*t.re)}scale(t){return new I(this.re*t,this.im*t)}conj(){return new I(this.re,-this.im)}mag2(){return this.re*this.re+this.im*this.im}mag(){return Math.sqrt(this.mag2())}phase(){return Math.atan2(this.im,this.re)}toString(t=3){const n=this.re.toFixed(t),o=Math.abs(this.im).toFixed(t);return Math.abs(this.im)<1e-6?n:Math.abs(this.re)<1e-6?`${this.im>=0?"":"-"}${o}i`:`${n}${this.im>=0?"+":"-"}${o}i`}}const f=(e,t=0)=>new I(e,t),w=1/Math.sqrt(2),R={I:{name:"I",matrix:[[f(1),f(0)],[f(0),f(1)]],color:"#666"},X:{name:"X",matrix:[[f(0),f(1)],[f(1),f(0)]],color:"#ec4899"},Y:{name:"Y",matrix:[[f(0),f(0,-1)],[f(0,1),f(0)]],color:"#f59e0b"},Z:{name:"Z",matrix:[[f(1),f(0)],[f(0),f(-1)]],color:"#3b82f6"},H:{name:"H",matrix:[[f(w),f(w)],[f(w),f(-w)]],color:"#00f0ff"},S:{name:"S",matrix:[[f(1),f(0)],[f(0),f(0,1)]],color:"#10b981"},T:{name:"T",matrix:[[f(1),f(0)],[f(0),I.polar(1,Math.PI/4)]],color:"#8b5cf6"}};function D(e,t){const[[n,o],[r,i]]=e.matrix;return[n.mul(t[0]).add(o.mul(t[1])),r.mul(t[0]).add(i.mul(t[1]))]}function $(e,t){return[f(Math.cos(e/2)),I.polar(Math.sin(e/2),t)]}function Q(e){const t=e[0].mag();e[1].mag();const n=2*Math.acos(Math.min(1,Math.max(0,t)));let o=e[1].phase()-e[0].phase();return o<0&&(o+=2*Math.PI),{theta:n,phi:o}}function P(e){return e.map(t=>t.mag2())}function W(e){const[t]=P(e);return Math.random()<t?0:1}function V(e,t,n,o){const r=t.length,i=Array.from({length:r},()=>f(0));for(let h=0;h<r;h++){const a=h>>o-1-n&1;for(let m=0;m<2;m++){const p=h^(a^m)<<o-1-n;i[p]=i[p].add(e.matrix[m][a].mul(t[h]))}}return i}function Z(e,t,n,o){const r=e.length,i=Array.from({length:r},()=>f(0));for(let h=0;h<r;h++)if((h>>o-1-t&1)===1){const m=h^1<<o-1-n;i[m]=i[m].add(e[h])}else i[h]=i[h].add(e[h]);return i}function q(e){const t=e.map(o=>o.mag2());let n=Math.random();for(let o=0;o<t.length;o++)if(n-=t[o],n<=0)return o;return t.length-1}function z(e){switch(e){case"Φ+":return[f(w),f(0),f(0),f(w)];case"Φ-":return[f(w),f(0),f(0),f(-w)];case"Ψ+":return[f(0),f(w),f(w),f(0)];case"Ψ-":return[f(0),f(w),f(-w),f(0)];default:return[f(w),f(0),f(0),f(w)]}}function F(e){const t=e[0],n=e[1],o=A(t),r=A(n);let i="";return t.mag()>1e-6&&(i+=`${o}|0⟩`),n.mag()>1e-6&&(i&&n.re>=0&&Math.abs(n.im)<1e-6?i+=" + ":i&&n.re<0&&Math.abs(n.im)<1e-6?i+=" - ":i&&(i+=" + "),n.re<0&&Math.abs(n.im)<1e-6?i+=`${A(f(-n.re,-n.im))}|1⟩`:i+=`${r}|1⟩`),i||"0"}function A(e){const t=e.mag();return t<1e-6?"0":Math.abs(t-1)<1e-4&&Math.abs(e.im)<1e-6?e.re>0?"":"-":Math.abs(e.im)<1e-6?e.re.toFixed(3):Math.abs(e.re)<1e-6?`${e.im.toFixed(3)}i`:`(${e.toString(3)})`}function C(e,t,n,o,r,i,h=0,a=0){const m=Math.cos(h),p=Math.sin(h);let l=e*m+n*p,b=-e*p+n*m;const v=Math.cos(a),g=Math.sin(a);let c=t*v-b*g,s=t*g+b*v;const u=1+s*.15;return{x:o+l*i/u,y:r-c*i/u,z:s,scale:1/u}}const H=new WeakMap;class Y{constructor(t,n,o,r,i,h,a){this.ctx=t,this.cx=n,this.cy=o,this.radius=r,this.options={...a},this.currentTheta=i,this.currentPhi=h,this.targetTheta=i,this.targetPhi=h,this.startTheta=i,this.startPhi=h,this.animStartTime=performance.now(),this.animDuration=350,this.trail=[],this.animFrameId=null,this.loop=this.loop.bind(this),this.start()}updateTarget(t,n,o,r,i,h){this.cx=t,this.cy=n,this.radius=o,this.options={...this.options,...h};let a=i-this.currentPhi%(2*Math.PI);for(;a>Math.PI;)a-=2*Math.PI;for(;a<-Math.PI;)a+=2*Math.PI;const m=this.currentPhi+a;(Math.abs(this.targetTheta-r)>.001||Math.abs(this.targetPhi-m)>.001)&&(this.startTheta=this.currentTheta,this.startPhi=this.currentPhi,this.targetTheta=r,this.targetPhi=m,this.animStartTime=performance.now())}start(){this.animFrameId||(this.animFrameId=requestAnimationFrame(this.loop))}stop(){this.animFrameId&&(cancelAnimationFrame(this.animFrameId),this.animFrameId=null)}loop(t){if(!document.body.contains(this.ctx.canvas)){this.stop();return}const n=t-this.animStartTime,o=Math.min(1,Math.max(0,n/this.animDuration)),r=1-Math.pow(1-o,3);this.currentTheta=this.startTheta+(this.targetTheta-this.startTheta)*r,this.currentPhi=this.startPhi+(this.targetPhi-this.startPhi)*r;const i=this.options.rotY!==void 0?this.options.rotY:-.4,h=this.options.rotX!==void 0?this.options.rotX:.3,a=i+t*3e-4,m=Math.sin(this.currentTheta)*Math.cos(this.currentPhi),p=Math.cos(this.currentTheta),l=Math.sin(this.currentTheta)*Math.sin(this.currentPhi),b=this.trail[this.trail.length-1];(!b||Math.hypot(b.x-m,b.y-p,b.z-l)>.002)&&(this.trail.push({x:m,y:p,z:l}),this.trail.length>15&&this.trail.shift()),typeof this.options.onFrame=="function"&&this.options.onFrame(this.currentTheta,this.currentPhi),this.renderFrame(t,a,h,m,p,l),this.animFrameId=requestAnimationFrame(this.loop)}renderFrame(t,n,o,r,i,h){const a=this.ctx,m=this.cx,p=this.cy,l=this.radius,{showLabels:b=!0,glowColor:v="#00f0ff"}=this.options,g=a.canvas.width,c=a.canvas.height;a.clearRect(0,0,g,c);const s=a.createRadialGradient(m,p,0,m,p,l*1.8);if(s.addColorStop(0,"rgba(0,240,255,0.03)"),s.addColorStop(.5,"rgba(139,92,246,0.02)"),s.addColorStop(1,"transparent"),a.fillStyle=s,a.fillRect(0,0,g,c),U(a,m,p,l,n,o),X(a,m,p,l,n,o,b),this.trail.length>1){a.save();for(let E=0;E<this.trail.length-1;E++){const k=C(this.trail[E].x,this.trail[E].y,this.trail[E].z,m,p,l,n,o),L=C(this.trail[E+1].x,this.trail[E+1].y,this.trail[E+1].z,m,p,l,n,o),S=(E+1)/this.trail.length;a.beginPath(),a.strokeStyle=v,a.lineWidth=S*2.5+.5,a.globalAlpha=S*.5,a.moveTo(k.x,k.y),a.lineTo(L.x,L.y),a.stroke()}a.restore()}const u=C(r,i,h,m,p,l,n,o),d=C(0,0,0,m,p,l,n,o);a.save(),a.shadowColor=v,a.shadowBlur=15,a.strokeStyle=v,a.lineWidth=3,a.beginPath(),a.moveTo(d.x,d.y),a.lineTo(u.x,u.y),a.stroke(),a.fillStyle=v,a.beginPath(),a.arc(u.x,u.y,6,0,Math.PI*2),a.fill(),a.restore();const y=t%1e3/1e3*Math.PI*2,x=(Math.sin(y)+1)/2,M=8+x*5,B=.3+x*.45,T=14+x*12;a.save(),a.shadowColor=v,a.shadowBlur=T,a.strokeStyle=v,a.lineWidth=2,a.globalAlpha=B,a.beginPath(),a.arc(u.x,u.y,M,0,Math.PI*2),a.stroke(),a.restore()}}function O(e,t,n,o,r,i,h={}){let a=H.get(e.canvas);a?a.updateTarget(t,n,o,r,i,h):(a=new Y(e,t,n,o,r,i,h),H.set(e.canvas,a))}function U(e,t,n,o,r,i){e.save(),e.strokeStyle="rgba(255,255,255,0.07)",e.lineWidth=1;for(let h=-60;h<=60;h+=30){const a=Math.cos(h*Math.PI/180),m=Math.sin(h*Math.PI/180);e.beginPath();for(let p=0;p<=360;p+=5){const l=p*Math.PI/180,b=a*Math.cos(l),v=a*Math.sin(l),g=C(b,m,v,t,n,o,r,i);p===0?e.moveTo(g.x,g.y):e.lineTo(g.x,g.y)}e.stroke()}for(let h=0;h<180;h+=30){const a=h*Math.PI/180;e.beginPath();for(let m=0;m<=360;m+=5){const p=m*Math.PI/180,l=Math.cos(p)*Math.cos(a),b=Math.sin(p),v=Math.cos(p)*Math.sin(a),g=C(l,b,v,t,n,o,r,i);m===0?e.moveTo(g.x,g.y):e.lineTo(g.x,g.y)}e.stroke()}e.strokeStyle="rgba(255,255,255,0.12)",e.lineWidth=1.5,e.beginPath();for(let h=0;h<=360;h+=3){const a=h*Math.PI/180,m=C(Math.cos(a),0,Math.sin(a),t,n,o,r,i);h===0?e.moveTo(m.x,m.y):e.lineTo(m.x,m.y)}e.stroke(),e.restore()}function X(e,t,n,o,r,i,h){const a=[{dir:[1,0,0],label:"X",color:"rgba(236,72,153,0.6)"},{dir:[0,1,0],label:"|0⟩",color:"rgba(0,240,255,0.7)"},{dir:[0,-1,0],label:"|1⟩",color:"rgba(139,92,246,0.7)"},{dir:[0,0,1],label:"Y",color:"rgba(245,158,11,0.6)"}];for(const m of a){const[p,l,b]=m.dir,v=C(0,0,0,t,n,o,r,i),g=C(p*1.2,l*1.2,b*1.2,t,n,o,r,i);if(e.save(),e.strokeStyle=m.color,e.lineWidth=1.5,e.setLineDash([4,4]),e.beginPath(),e.moveTo(v.x,v.y),e.lineTo(g.x,g.y),e.stroke(),e.restore(),h){const c=C(p*1.35,l*1.35,b*1.35,t,n,o,r,i);e.save(),e.font='14px "JetBrains Mono", monospace',e.fillStyle=m.color,e.textAlign="center",e.textBaseline="middle",e.fillText(m.label,c.x,c.y),e.restore()}}}function J(){const e=document.getElementById("bloch-container");if(!e)return;let t=Math.PI/3,n=Math.PI/4;e.innerHTML=`
    <div class="bloch-canvas-wrap">
      <canvas id="bloch-canvas" width="400" height="400"></canvas>
    </div>
    <div class="bloch-controls glass-card">
      <h3 style="font-family:var(--font-heading);font-size:20px;margin-bottom:4px;">Qubit State Controls</h3>
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">
        Adjust θ (polar) and φ (azimuthal) angles to explore all possible single-qubit states.
      </p>
      <div class="slider-group">
        <div class="slider-label"><span>θ (Theta)</span><span id="theta-val">${(t/Math.PI).toFixed(2)}π</span></div>
        <input type="range" id="theta-slider" min="0" max="${Math.PI}" step="0.01" value="${t}" />
      </div>
      <div class="slider-group">
        <div class="slider-label"><span>φ (Phi)</span><span id="phi-val">${(n/Math.PI).toFixed(2)}π</span></div>
        <input type="range" id="phi-slider" min="0" max="${2*Math.PI}" step="0.01" value="${n}" />
      </div>
      <div class="state-display" id="bloch-state">|ψ⟩ = ${F($(t,n))}</div>
      <div style="display:flex;gap:12px;">
        <div class="prob-bars" style="flex:1;">
          <div class="prob-bar-group">
            <div class="prob-bar-track">
              <div class="prob-bar-fill zero" id="bloch-p0" style="height:${P($(t,n))[0]*100}%"></div>
            </div>
            <span class="prob-label">|0⟩</span>
            <span class="prob-value" id="bloch-pv0">${(P($(t,n))[0]*100).toFixed(1)}%</span>
          </div>
          <div class="prob-bar-group">
            <div class="prob-bar-track">
              <div class="prob-bar-fill one" id="bloch-p1" style="height:${P($(t,n))[1]*100}%"></div>
            </div>
            <span class="prob-label">|1⟩</span>
            <span class="prob-value" id="bloch-pv1">${(P($(t,n))[1]*100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn-sm" data-preset="0,0">|0⟩</button>
        <button class="btn-sm" data-preset="${Math.PI},0">|1⟩</button>
        <button class="btn-sm" data-preset="${Math.PI/2},0">|+⟩</button>
        <button class="btn-sm" data-preset="${Math.PI/2},${Math.PI}">|−⟩</button>
        <button class="btn-sm" data-preset="${Math.PI/2},${Math.PI/2}">|i⟩</button>
        <button class="btn-sm" data-preset="${Math.PI/2},${3*Math.PI/2}">|−i⟩</button>
      </div>
    </div>
  `;const r=document.getElementById("bloch-canvas").getContext("2d"),i=document.getElementById("theta-slider"),h=document.getElementById("phi-slider"),a=document.getElementById("theta-val"),m=document.getElementById("phi-val"),p=document.getElementById("bloch-state"),l=document.getElementById("bloch-p0"),b=document.getElementById("bloch-p1"),v=document.getElementById("bloch-pv0"),g=document.getElementById("bloch-pv1");function c(){O(r,200,200,150,t,n,{onFrame:(s,u)=>{const d=$(s,u),y=P(d);a.textContent=`${(s/Math.PI).toFixed(2)}π`,m.textContent=`${(u/Math.PI).toFixed(2)}π`,p.textContent=`|ψ⟩ = ${F(d)}`,l.style.height=`${y[0]*100}%`,b.style.height=`${y[1]*100}%`,v.textContent=`${(y[0]*100).toFixed(1)}%`,g.textContent=`${(y[1]*100).toFixed(1)}%`}})}i.addEventListener("input",s=>{t=parseFloat(s.target.value),c()}),h.addEventListener("input",s=>{n=parseFloat(s.target.value),c()}),e.querySelectorAll("[data-preset]").forEach(s=>{s.addEventListener("click",()=>{const[u,d]=s.dataset.preset.split(",").map(Number);t=u,n=d,i.value=t,h.value=n,c()})}),c()}function K(){const e=document.getElementById("gates-container");if(!e)return;let t=[new I(1),new I(0)],n=[];e.innerHTML=`
    <div class="gates-panel">
      <div class="glass-card">
        <h3 style="font-family:var(--font-heading);font-size:20px;margin-bottom:10px;">Select Initial State</h3>
        <div style="display:flex;gap:8px;margin-bottom:16px;">
          <button class="btn-sm active" data-init="0">|0⟩</button>
          <button class="btn-sm" data-init="1">|1⟩</button>
          <button class="btn-sm" data-init="+">|+⟩</button>
          <button class="btn-sm" data-init="-">|−⟩</button>
        </div>
        <h3 style="font-family:var(--font-heading);font-size:20px;margin-bottom:10px;">Apply Gates</h3>
        <div class="gates-grid" id="gates-grid">
          <button class="btn-gate" data-gate="H">H</button>
          <button class="btn-gate" data-gate="X">X</button>
          <button class="btn-gate" data-gate="Y">Y</button>
          <button class="btn-gate" data-gate="Z">Z</button>
          <button class="btn-gate" data-gate="S">S</button>
          <button class="btn-gate" data-gate="T">T</button>
        </div>
      </div>
      <div class="glass-card">
        <h4 style="font-size:14px;color:var(--text-secondary);margin-bottom:8px;">Gate History</h4>
        <div class="gate-history" id="gate-history">
          <span style="color:var(--text-muted);font-size:13px;">No gates applied yet</span>
        </div>
        <button class="btn-sm" id="reset-gates" style="margin-top:12px;">Reset</button>
      </div>
      <div class="glass-card">
        <h4 style="font-size:14px;color:var(--text-secondary);margin-bottom:8px;">Current State</h4>
        <div class="state-display" id="gates-state">|ψ⟩ = |0⟩</div>
        <div class="prob-bars" style="margin-top:16px;">
          <div class="prob-bar-group">
            <div class="prob-bar-track">
              <div class="prob-bar-fill zero" id="gates-p0" style="height:100%"></div>
            </div>
            <span class="prob-label">|0⟩</span>
            <span class="prob-value" id="gates-pv0">100.0%</span>
          </div>
          <div class="prob-bar-group">
            <div class="prob-bar-track">
              <div class="prob-bar-fill one" id="gates-p1" style="height:0%"></div>
            </div>
            <span class="prob-label">|1⟩</span>
            <span class="prob-value" id="gates-pv1">0.0%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bloch-canvas-wrap">
      <canvas id="gates-canvas" width="400" height="400"></canvas>
    </div>
  `;const r=document.getElementById("gates-canvas").getContext("2d"),i=document.getElementById("gates-state"),h=document.getElementById("gates-p0"),a=document.getElementById("gates-p1"),m=document.getElementById("gates-pv0"),p=document.getElementById("gates-pv1"),l=document.getElementById("gate-history");function b(){const c=Q(t);O(r,200,200,150,c.theta,c.phi,{glowColor:"#8b5cf6",onFrame:(s,u)=>{const d=$(s,u),y=P(d);i.textContent=`|ψ⟩ = ${F(d)}`,h.style.height=`${y[0]*100}%`,a.style.height=`${y[1]*100}%`,m.textContent=`${(y[0]*100).toFixed(1)}%`,p.textContent=`${(y[1]*100).toFixed(1)}%`}})}function v(){n.length===0?l.innerHTML='<span style="color:var(--text-muted);font-size:13px;">No gates applied yet</span>':l.innerHTML=n.map((c,s)=>`<span class="gate-history-item ${s===n.length-1?"pop-in":""}">${c}</span>`).join("")}function g(c){switch(n=[],c){case"0":t=[new I(1),new I(0)];break;case"1":t=[new I(0),new I(1)];break;case"+":t=$(Math.PI/2,0);break;case"-":t=$(Math.PI/2,Math.PI);break}v(),b()}e.querySelectorAll("[data-init]").forEach(c=>{c.addEventListener("click",()=>{e.querySelectorAll("[data-init]").forEach(s=>s.classList.remove("active")),c.classList.add("active"),g(c.dataset.init)})}),e.querySelectorAll("[data-gate]").forEach(c=>{c.addEventListener("click",()=>{const s=c.dataset.gate,u=R[s];t=D(u,t),n.push(s),v(),b(),c.style.transition="transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.35s cubic-bezier(0.25, 1, 0.5, 1)",c.style.transform="scale(1.15)",c.style.boxShadow=`0 0 24px ${u.color||"#8b5cf6"}80`,setTimeout(()=>{c.style.transform="",c.style.boxShadow=""},350)})}),document.getElementById("reset-gates").addEventListener("click",()=>{const c=e.querySelector("[data-init].active");g(c?c.dataset.init:"0")}),b()}function _(){const e=document.getElementById("superposition-container");if(!e)return;let t=Math.PI/2,n=0,o=!1,r={zero:0,one:0};e.innerHTML=`
    <div class="coin-container glass-card">
      <h3 style="font-family:var(--font-heading);font-size:20px;">Quantum Coin</h3>
      <p style="font-size:13px;color:var(--text-muted);max-width:280px;text-align:center;">
        A qubit in superposition is like a spinning coin. Click to "measure" (collapse) it!
      </p>
      <div class="coin-3d" id="quantum-coin">
        <div class="coin-inner spinning" id="coin-inner">
          <div class="coin-face coin-front">|0⟩</div>
          <div class="coin-face coin-back">|1⟩</div>
        </div>
      </div>
      <div class="state-display" id="coin-state" style="font-size:15px;width:100%;">
        Superposition — Click to measure!
      </div>
      <div class="slider-group" style="width:100%;">
        <div class="slider-label"><span>α² (P of |0⟩)</span><span id="super-prob">${(Math.cos(t/2)**2*100).toFixed(0)}%</span></div>
        <input type="range" id="super-alpha" min="0" max="${Math.PI}" step="0.01" value="${t}" />
      </div>
      <button class="btn-sm" id="super-reset-coin" style="width:100%;text-align:center;">
        Reset to Superposition
      </button>
    </div>
    <div class="measurement-panel glass-card">
      <h3 style="font-family:var(--font-heading);font-size:20px;margin-bottom:6px;">Measurement Statistics</h3>
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
        Run multiple measurements to see probabilities emerge from quantum randomness.
      </p>
      <div class="slider-group">
        <div class="slider-label"><span>Measurements per batch</span><span id="batch-val">100</span></div>
        <input type="range" id="batch-slider" min="1" max="1000" step="1" value="100" />
      </div>
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        <button class="btn btn-primary" id="run-measurements" style="flex:1;justify-content:center;padding:12px 20px;font-size:14px;">
          Run Measurements
        </button>
        <button class="btn-sm" id="clear-measurements">Clear</button>
      </div>
      <div class="histogram">
        <div class="histo-bar-group">
          <div class="histo-count" id="histo-c0">0</div>
          <div class="histo-track">
            <div class="histo-fill h-zero" id="histo-f0" style="height:0%"></div>
          </div>
          <div class="histo-label">|0⟩</div>
          <div class="prob-value" id="histo-p0">0%</div>
        </div>
        <div class="histo-bar-group">
          <div class="histo-count" id="histo-c1">0</div>
          <div class="histo-track">
            <div class="histo-fill h-one" id="histo-f1" style="height:0%"></div>
          </div>
          <div class="histo-label">|1⟩</div>
          <div class="prob-value" id="histo-p1">0%</div>
        </div>
      </div>
      <div style="margin-top:16px;padding:12px;background:rgba(0,0,0,0.3);border-radius:var(--radius-sm);border:1px solid var(--border-glass);">
        <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);">
          <span>Total measurements:</span><span id="total-m" style="color:var(--accent-cyan);font-family:var(--font-mono);">0</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);margin-top:4px;">
          <span>Theoretical P(|0⟩):</span><span id="theory-p" style="color:var(--accent-green);font-family:var(--font-mono);">50.0%</span>
        </div>
      </div>
    </div>
  `;const i=document.getElementById("coin-inner"),h=document.getElementById("coin-state"),a=document.getElementById("super-alpha"),m=document.getElementById("super-prob"),p=document.getElementById("batch-slider"),l=document.getElementById("batch-val"),b=document.getElementById("theory-p");function v(){const c=r.zero+r.one,s=document.getElementById("histo-f0"),u=document.getElementById("histo-f1"),d=document.getElementById("histo-c0"),y=document.getElementById("histo-c1"),x=document.getElementById("histo-p0"),M=document.getElementById("histo-p1"),B=document.getElementById("total-m");if(c===0){s.style.height="0%",u.style.height="0%",d.textContent="0",y.textContent="0",x.textContent="0%",M.textContent="0%",B.textContent="0";return}s.style.height=`${r.zero/c*100}%`,u.style.height=`${r.one/c*100}%`,d.textContent=r.zero,y.textContent=r.one,x.textContent=`${(r.zero/c*100).toFixed(1)}%`,M.textContent=`${(r.one/c*100).toFixed(1)}%`,B.textContent=c}function g(){o=!0,i.className="coin-inner spinning",h.textContent="Superposition — Click to measure!",h.style.color="var(--accent-cyan)"}document.getElementById("quantum-coin").addEventListener("click",()=>{if(!o){g();return}o=!1;const c=$(t,n),s=W(c);i.classList.remove("spinning"),i.className=`coin-inner collapsed-${s}`,s===0?(r.zero++,h.textContent="Collapsed to |0⟩!",h.style.color="var(--accent-cyan)"):(r.one++,h.textContent="Collapsed to |1⟩!",h.style.color="var(--accent-purple)"),v()}),a.addEventListener("input",c=>{t=parseFloat(c.target.value);const s=Math.cos(t/2)**2;m.textContent=`${(s*100).toFixed(0)}%`,b.textContent=`${(s*100).toFixed(1)}%`,g(),r={zero:0,one:0},v()}),p.addEventListener("input",c=>{l.textContent=c.target.value}),document.getElementById("run-measurements").addEventListener("click",()=>{const c=parseInt(p.value),s=$(t,n),[u]=P(s);for(let d=0;d<c;d++)Math.random()<u?r.zero++:r.one++;v(),i.className="coin-inner spinning",setTimeout(()=>{const d=Math.random()<u?0:1;i.className=`coin-inner collapsed-${d}`,h.textContent=`Last: |${d}⟩ (${c} measurements done)`,h.style.color=d===0?"var(--accent-cyan)":"var(--accent-purple)",o=!1},600)}),document.getElementById("clear-measurements").addEventListener("click",()=>{r={zero:0,one:0},v(),g()}),document.getElementById("super-reset-coin").addEventListener("click",g)}function tt(){const e=document.getElementById("entanglement-container");if(!e)return;let t="Φ+",n=z(t),o={"00":0,"01":0,10:0,11:0},r=!1,i=null;const h=`
    <div class="superposition-wrap">
      <svg class="superposition-ring-svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" class="superposition-ring-path" />
      </svg>
      <span class="superposition-text">|ψ⟩</span>
    </div>
  `,a=`
    <div class="superposition-wrap">
      <svg class="superposition-ring-svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" class="superposition-ring-path" />
      </svg>
      <span class="superposition-text">|ψ⟩</span>
    </div>
  `;e.innerHTML=`
    <div class="ent-visual glass-card">
      <h3 style="font-family:var(--font-heading);font-size:20px;">Entangled Qubits</h3>
      <p style="font-size:13px;color:var(--text-muted);max-width:340px;text-align:center;margin-bottom:8px;">
        Two entangled qubits share a mysterious connection. Measuring one instantly determines the other.
      </p>
      <div class="ent-qubits">
        <div class="ent-qubit qubit-a" id="ent-qa" title="Click to measure Qubit A">
          ${h}
        </div>
        <div class="ent-link-wrap" id="ent-link">
          <svg class="ent-link-svg" viewBox="0 0 140 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="ent-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#00f0ff" />
                <stop offset="100%" stop-color="#8b5cf6" />
              </linearGradient>
              <filter id="ent-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path id="ent-link-path" class="ent-link-line" d="M 10 20 Q 70 8, 130 20" fill="none" stroke="url(#ent-grad)" stroke-width="3.5" stroke-dasharray="10 7" filter="url(#ent-glow)" />
            <circle id="ent-pulse-dot" cx="10" cy="20" r="6.5" fill="#ffffff" opacity="0" filter="url(#ent-glow)" />
          </svg>
        </div>
        <div class="ent-qubit qubit-b" id="ent-qb" title="Click to measure Qubit B">
          ${a}
        </div>
      </div>
      <div style="display:flex;gap:8px;font-size:13px;color:var(--text-muted);width:100%;max-width:300px;justify-content:space-between;padding:0 8px;">
        <span>Qubit A</span>
        <span>Qubit B</span>
      </div>
      <div class="state-display" id="ent-state" style="font-size:15px;width:100%;">
        |${t}⟩ — Click a qubit to measure!
      </div>
      <div style="display:flex;gap:8px;width:100%;">
        <button class="btn btn-primary" id="ent-measure" style="flex:1;justify-content:center;padding:12px 20px;font-size:14px;">
          Measure Both
        </button>
        <button class="btn-sm" id="ent-reset">Reset</button>
      </div>
    </div>
    <div class="ent-controls glass-card">
      <h3 style="font-family:var(--font-heading);font-size:20px;margin-bottom:8px;">Bell State Selector</h3>
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">
        Choose different entangled states and observe their measurement correlations.
      </p>
      <div class="bell-states">
        <button class="btn-sm active" data-bell="Φ+">|Φ+⟩</button>
        <button class="btn-sm" data-bell="Φ-">|Φ−⟩</button>
        <button class="btn-sm" data-bell="Ψ+">|Ψ+⟩</button>
        <button class="btn-sm" data-bell="Ψ-">|Ψ−⟩</button>
      </div>
      <div style="margin-top:16px;">
        <h4 style="font-size:14px;color:var(--text-secondary);margin-bottom:8px;">Batch Measurements</h4>
        <div class="slider-group">
          <div class="slider-label"><span>Count</span><span id="ent-batch-val">100</span></div>
          <input type="range" id="ent-batch" min="10" max="1000" step="10" value="100" />
        </div>
        <button class="btn-sm" id="ent-run-batch" style="width:100%;text-align:center;margin-top:8px;">
          Run Batch Measurement
        </button>
      </div>
      <div style="margin-top:16px;">
        <h4 style="font-size:14px;color:var(--text-secondary);margin-bottom:8px;">Correlation Table</h4>
        <table class="correlation-table">
          <thead>
            <tr><th>Outcome</th><th>Count</th><th>Probability</th></tr>
          </thead>
          <tbody id="corr-tbody">
            <tr><td>|00⟩</td><td id="c-00">0</td><td id="p-00">—</td></tr>
            <tr><td>|01⟩</td><td id="c-01">0</td><td id="p-01">—</td></tr>
            <tr><td>|10⟩</td><td id="c-10">0</td><td id="p-10">—</td></tr>
            <tr><td>|11⟩</td><td id="c-11">0</td><td id="p-11">—</td></tr>
          </tbody>
        </table>
        <div style="margin-top:8px;font-size:12px;color:var(--text-muted);text-align:center;">
          Total: <span id="ent-total" style="color:var(--accent-cyan);font-family:var(--font-mono);">0</span>
        </div>
      </div>
    </div>
  `;const m=document.getElementById("ent-qa"),p=document.getElementById("ent-qb"),l=document.getElementById("ent-state"),b=document.getElementById("ent-batch"),v=document.getElementById("ent-batch-val");function g(){const d=o["00"]+o["01"]+o[10]+o[11];for(const y of["00","01","10","11"])document.getElementById(`c-${y}`).textContent=o[y],document.getElementById(`p-${y}`).textContent=d>0?`${(o[y]/d*100).toFixed(1)}%`:"—";document.getElementById("ent-total").textContent=d}function c(d){const y=document.getElementById("ent-link-path"),x=document.getElementById("ent-pulse-dot");if(!y||!x){d&&d();return}const M=y.getTotalLength(),B=450,T=performance.now();x.setAttribute("opacity","1");function E(k){const L=k-T,S=Math.min(L/B,1),G=S<.5?2*S*S:1-Math.pow(-2*S+2,2)/2,N=y.getPointAtLength(G*M);x.setAttribute("cx",N.x),x.setAttribute("cy",N.y),S<1?i=requestAnimationFrame(E):(x.setAttribute("opacity","0"),i=null,d&&d())}i=requestAnimationFrame(E)}function s(){if(r)return;r=!0,n=z(t);const d=q(n),y=d>>1&1,x=d&1;m.innerHTML=`|${y}⟩`,m.classList.add("measured"),l.textContent=`Qubit A measured: |${y}⟩ — Entanglement wave propagating...`,l.style.color="var(--accent-cyan)",c(()=>{p.innerHTML=`|${x}⟩`,p.classList.add("measured");const M=`${y}${x}`;o[M]++,g(),l.textContent=`Measured: |${y}${x}⟩`,l.style.color="var(--accent-green)",setTimeout(()=>{m.classList.remove("measured"),p.classList.remove("measured"),r=!1},500)})}function u(){i&&(cancelAnimationFrame(i),i=null);const d=document.getElementById("ent-pulse-dot");d&&d.setAttribute("opacity","0"),r=!1,m.innerHTML=h,p.innerHTML=a,m.classList.remove("measured"),p.classList.remove("measured"),n=z(t),l.textContent=`|${t}⟩ — Click a qubit to measure!`,l.style.color="var(--accent-cyan)"}document.getElementById("ent-measure").addEventListener("click",s),m.addEventListener("click",s),p.addEventListener("click",s),document.getElementById("ent-reset").addEventListener("click",()=>{o={"00":0,"01":0,10:0,11:0},g(),u()}),e.querySelectorAll("[data-bell]").forEach(d=>{d.addEventListener("click",()=>{e.querySelectorAll("[data-bell]").forEach(y=>y.classList.remove("active")),d.classList.add("active"),t=d.dataset.bell,o={"00":0,"01":0,10:0,11:0},g(),u()})}),b.addEventListener("input",d=>{v.textContent=d.target.value}),document.getElementById("ent-run-batch").addEventListener("click",()=>{if(r)return;const d=parseInt(b.value);for(let T=0;T<d;T++){const E=z(t),k=q(E),L=k>>1&1,S=k&1;o[`${L}${S}`]++}g();const y=z(t),x=q(y),M=x>>1&1,B=x&1;m.innerHTML=`|${M}⟩`,p.innerHTML=`|${B}⟩`,l.textContent=`Batch complete — ${d} measurements done`,l.style.color="var(--accent-green)"})}function et(){const e=document.getElementById("circuit-container");if(!e)return;const t=3,n=6;let o="H",r=Array.from({length:t},()=>Array(n).fill(null));e.innerHTML=`
    <div class="circuit-top">
      <div class="glass-card">
        <h3 style="font-family:var(--font-heading);font-size:18px;margin-bottom:12px;">Circuit Grid</h3>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
          Click cells to place the selected gate. Click an occupied cell to remove the gate.
        </p>
        <div class="circuit-grid-wrap">
          <div class="circuit-grid" id="circuit-grid" style="grid-template-columns: 60px repeat(${n}, 60px); grid-template-rows: repeat(${t}, 60px);">
            ${h()}
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;">
          <button class="btn btn-primary" id="run-circuit" style="padding:12px 28px;font-size:14px;">
            ▶ Run Circuit
          </button>
          <button class="btn-sm" id="clear-circuit">Clear All</button>
          <button class="btn-sm" id="example-circuit">Load Example</button>
        </div>
      </div>
      <div class="glass-card circuit-palette">
        <h4 style="font-family:var(--font-heading);font-size:16px;margin-bottom:12px;">Gate Palette</h4>
        <button class="btn-gate active" data-select="H" style="width:100%;">H</button>
        <button class="btn-gate" data-select="X" style="width:100%;">X</button>
        <button class="btn-gate" data-select="Y" style="width:100%;">Y</button>
        <button class="btn-gate" data-select="Z" style="width:100%;">Z</button>
        <button class="btn-gate" data-select="S" style="width:100%;">S</button>
        <button class="btn-gate" data-select="T" style="width:100%;">T</button>
        <div style="border-top:1px solid var(--border-glass);margin:4px 0;"></div>
        <button class="btn-gate" data-select="CNOT" style="width:100%;font-size:13px;">CNOT</button>
        <p style="font-size:11px;color:var(--text-muted);margin-top:4px;">
          CNOT: Click control qubit first, then target qubit in same column.
        </p>
      </div>
    </div>
    <div class="circuit-results" id="circuit-results">
      <div class="glass-card">
        <h4 style="font-size:14px;color:var(--text-secondary);margin-bottom:10px;">Output State Vector</h4>
        <div class="state-display" id="circuit-state" style="font-size:14px;">Run the circuit to see results</div>
      </div>
      <div class="glass-card">
        <h4 style="font-size:14px;color:var(--text-secondary);margin-bottom:10px;">Output Probabilities</h4>
        <div class="prob-bars" id="circuit-probs" style="flex-wrap:wrap;">
          ${a()}
        </div>
      </div>
    </div>
  `;let i=null;function h(){let p="";for(let l=0;l<t;l++){p+=`<div class="circuit-label">q${l} |0⟩</div>`;for(let b=0;b<n;b++)p+=`<div class="circuit-cell" data-q="${l}" data-s="${b}"></div>`}return p}function a(){const p=1<<t,l=["zero","one","two","three","zero","one","two","three"];let b="";for(let v=0;v<p;v++){const g=v.toString(2).padStart(t,"0");b+=`
        <div class="prob-bar-group">
          <div class="prob-bar-track" style="height:100px;">
            <div class="prob-bar-fill ${l[v%8]}" id="cp-${v}" style="height:0%"></div>
          </div>
          <span class="prob-label">|${g}⟩</span>
          <span class="prob-value" id="cpv-${v}">0%</span>
        </div>`}return b}function m(){e.querySelectorAll(".circuit-cell").forEach(l=>{const b=parseInt(l.dataset.q),v=parseInt(l.dataset.s),g=r[b][v];g?(l.classList.add("has-gate"),typeof g=="string"?l.textContent=g:g.gate==="CNOT"&&g.role==="control"?(l.textContent="●",l.style.color="var(--accent-cyan)"):g.gate==="CNOT"&&g.role==="target"&&(l.textContent="⊕",l.style.color="var(--accent-pink)")):(l.classList.remove("has-gate"),l.textContent="",l.style.color="")})}e.querySelectorAll("[data-select]").forEach(p=>{p.addEventListener("click",()=>{e.querySelectorAll("[data-select]").forEach(l=>l.classList.remove("active")),p.classList.add("active"),o=p.dataset.select,i=null})}),e.querySelector("#circuit-grid").addEventListener("click",p=>{const l=p.target.closest(".circuit-cell");if(!l)return;const b=parseInt(l.dataset.q),v=parseInt(l.dataset.s);if(r[b][v]){const g=r[b][v];if(g&&typeof g=="object"&&g.gate==="CNOT"){const c=g.role==="control"?g.target:g.control;r[c][v]=null}r[b][v]=null,i=null}else o==="CNOT"?i===null?(i={q:b,s:v},l.textContent="●",l.style.color="var(--accent-cyan)",l.style.opacity="0.5"):(i.s===v&&i.q!==b&&(r[i.q][v]={gate:"CNOT",role:"control",control:i.q,target:b},r[b][v]={gate:"CNOT",role:"target",control:i.q,target:b}),i=null):r[b][v]=o;m()}),document.getElementById("run-circuit").addEventListener("click",()=>{const p=1<<t;let l=Array.from({length:p},(c,s)=>s===0?new I(1):new I(0));for(let c=0;c<n;c++){let s=new Set;for(let u=0;u<t;u++){const d=r[u][c];d&&(typeof d=="string"?l=V(R[d],l,u,t):d.gate==="CNOT"&&!s.has(c+"-"+d.control+"-"+d.target)&&(l=Z(l,d.control,d.target,t),s.add(c+"-"+d.control+"-"+d.target)))}}const b=document.getElementById("circuit-state"),v=[];for(let c=0;c<p;c++){const s=l[c].mag();if(s>1e-6){const u=c.toString(2).padStart(t,"0"),d=s.toFixed(3);v.push(`${d}|${u}⟩`)}}b.textContent=v.join(" + ")||"0";for(let c=0;c<p;c++){const s=l[c].mag2();document.getElementById(`cp-${c}`).style.height=`${s*100}%`,document.getElementById(`cpv-${c}`).textContent=`${(s*100).toFixed(1)}%`}const g=document.getElementById("run-circuit");g.style.transform="scale(1.05)",setTimeout(()=>{g.style.transform=""},200)}),document.getElementById("clear-circuit").addEventListener("click",()=>{r=Array.from({length:t},()=>Array(n).fill(null)),i=null,m(),document.getElementById("circuit-state").textContent="Run the circuit to see results";const p=1<<t;for(let l=0;l<p;l++)document.getElementById(`cp-${l}`).style.height="0%",document.getElementById(`cpv-${l}`).textContent="0%"}),document.getElementById("example-circuit").addEventListener("click",()=>{r=Array.from({length:t},()=>Array(n).fill(null)),r[0][0]="H",r[0][1]={gate:"CNOT",role:"control",control:0,target:1},r[1][1]={gate:"CNOT",role:"target",control:0,target:1},r[2][0]="H",r[2][2]={gate:"CNOT",role:"control",control:2,target:1},r[1][2]={gate:"CNOT",role:"target",control:2,target:1},m()}),m()}document.addEventListener("DOMContentLoaded",()=>{j(),J(),K(),_(),tt(),et(),nt(),st()});function nt(){const e=document.getElementById("navbar"),t=document.querySelectorAll(".nav-link"),n=document.getElementById("nav-toggle"),o=document.querySelector(".nav-links"),r=document.querySelectorAll(".section");window.addEventListener("scroll",()=>{e.classList.toggle("scrolled",window.scrollY>50)}),n.addEventListener("click",()=>{o.classList.toggle("open")}),t.forEach(h=>{h.addEventListener("click",()=>{o.classList.remove("open")})});const i=new IntersectionObserver(h=>{h.forEach(a=>{if(a.isIntersecting){const m=a.target.id;t.forEach(p=>{p.classList.toggle("active",p.getAttribute("href")===`#${m}`)})}})},{threshold:.3});r.forEach(h=>i.observe(h))}function st(){const e=document.querySelectorAll(".section-header, .glass-card, .bloch-canvas-wrap, .coin-container, .ent-visual"),t=new IntersectionObserver(n=>{n.forEach(o=>{o.isIntersecting&&(o.target.classList.add("animate-in"),t.unobserve(o.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});e.forEach(n=>t.observe(n))}
