import"./modulepreload-polyfill-B5Qt9EMX.js";function q(){const t=document.getElementById("hero-canvas");if(!t)return;const e=t.getContext("2d");let n=[];function o(){t.width=window.innerWidth,t.height=window.innerHeight,i()}function i(){const a=Math.floor(t.width*t.height/12e3);n=Array.from({length:Math.min(a,120)},()=>({x:Math.random()*t.width,y:Math.random()*t.height,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,radius:Math.random()*2+.5,opacity:Math.random()*.5+.2,hue:Math.random()>.5?180:270,pulse:Math.random()*Math.PI*2}))}function l(){e.clearRect(0,0,t.width,t.height);for(const a of n)a.x+=a.vx,a.y+=a.vy,a.pulse+=.02,(a.x<0||a.x>t.width)&&(a.vx*=-1),(a.y<0||a.y>t.height)&&(a.vy*=-1);for(let a=0;a<n.length;a++)for(let u=a+1;u<n.length;u++){const d=n[a].x-n[u].x,p=n[a].y-n[u].y,r=Math.sqrt(d*d+p*p);if(r<150){const v=(1-r/150)*.15;e.beginPath(),e.strokeStyle=`rgba(0, 240, 255, ${v})`,e.lineWidth=.5,e.moveTo(n[a].x,n[a].y),e.lineTo(n[u].x,n[u].y),e.stroke()}}for(const a of n){const u=.5+.5*Math.sin(a.pulse),d=a.hue===180?`rgba(0, 240, 255, ${a.opacity*u})`:`rgba(139, 92, 246, ${a.opacity*u})`;e.beginPath(),e.fillStyle=d,e.shadowColor=d,e.shadowBlur=8,e.arc(a.x,a.y,a.radius*(.8+u*.4),0,Math.PI*2),e.fill(),e.shadowBlur=0}requestAnimationFrame(l)}window.addEventListener("resize",o),o(),l()}class f{constructor(e=0,n=0){this.re=e,this.im=n}static polar(e,n){return new f(e*Math.cos(n),e*Math.sin(n))}add(e){return new f(this.re+e.re,this.im+e.im)}sub(e){return new f(this.re-e.re,this.im-e.im)}mul(e){return new f(this.re*e.re-this.im*e.im,this.re*e.im+this.im*e.re)}scale(e){return new f(this.re*e,this.im*e)}conj(){return new f(this.re,-this.im)}mag2(){return this.re*this.re+this.im*this.im}mag(){return Math.sqrt(this.mag2())}phase(){return Math.atan2(this.im,this.re)}toString(e=3){const n=this.re.toFixed(e),o=Math.abs(this.im).toFixed(e);return Math.abs(this.im)<1e-6?n:Math.abs(this.re)<1e-6?`${this.im>=0?"":"-"}${o}i`:`${n}${this.im>=0?"+":"-"}${o}i`}}const h=(t,e=0)=>new f(t,e),x=1/Math.sqrt(2),z={I:{name:"I",matrix:[[h(1),h(0)],[h(0),h(1)]],color:"#666"},X:{name:"X",matrix:[[h(0),h(1)],[h(1),h(0)]],color:"#ec4899"},Y:{name:"Y",matrix:[[h(0),h(0,-1)],[h(0,1),h(0)]],color:"#f59e0b"},Z:{name:"Z",matrix:[[h(1),h(0)],[h(0),h(-1)]],color:"#3b82f6"},H:{name:"H",matrix:[[h(x),h(x)],[h(x),h(-x)]],color:"#00f0ff"},S:{name:"S",matrix:[[h(1),h(0)],[h(0),h(0,1)]],color:"#10b981"},T:{name:"T",matrix:[[h(1),h(0)],[h(0),f.polar(1,Math.PI/4)]],color:"#8b5cf6"}};function A(t,e){const[[n,o],[i,l]]=t.matrix;return[n.mul(e[0]).add(o.mul(e[1])),i.mul(e[0]).add(l.mul(e[1]))]}function E(t,e){return[h(Math.cos(t/2)),f.polar(Math.sin(t/2),e)]}function F(t){const e=t[0].mag();t[1].mag();const n=2*Math.acos(Math.min(1,Math.max(0,e)));let o=t[1].phase()-t[0].phase();return o<0&&(o+=2*Math.PI),{theta:n,phi:o}}function M(t){return t.map(e=>e.mag2())}function N(t){const[e]=M(t);return Math.random()<e?0:1}function H(t,e,n,o){const i=e.length,l=Array.from({length:i},()=>h(0));for(let a=0;a<i;a++){const u=a>>o-1-n&1;for(let d=0;d<2;d++){const p=a^(u^d)<<o-1-n;l[p]=l[p].add(t.matrix[d][u].mul(e[a]))}}return l}function O(t,e,n,o){const i=t.length,l=Array.from({length:i},()=>h(0));for(let a=0;a<i;a++)if((a>>o-1-e&1)===1){const d=a^1<<o-1-n;l[d]=l[d].add(t[a])}else l[a]=l[a].add(t[a]);return l}function S(t){const e=t.map(o=>o.mag2());let n=Math.random();for(let o=0;o<e.length;o++)if(n-=e[o],n<=0)return o;return e.length-1}function $(t){switch(t){case"Φ+":return[h(x),h(0),h(0),h(x)];case"Φ-":return[h(x),h(0),h(0),h(-x)];case"Ψ+":return[h(0),h(x),h(x),h(0)];case"Ψ-":return[h(0),h(x),h(-x),h(0)];default:return[h(x),h(0),h(0),h(x)]}}function L(t){const e=t[0],n=t[1],o=k(e),i=k(n);let l="";return e.mag()>1e-6&&(l+=`${o}|0⟩`),n.mag()>1e-6&&(l&&n.re>=0&&Math.abs(n.im)<1e-6?l+=" + ":l&&n.re<0&&Math.abs(n.im)<1e-6?l+=" - ":l&&(l+=" + "),n.re<0&&Math.abs(n.im)<1e-6?l+=`${k(h(-n.re,-n.im))}|1⟩`:l+=`${i}|1⟩`),l||"0"}function k(t){const e=t.mag();return e<1e-6?"0":Math.abs(e-1)<1e-4&&Math.abs(t.im)<1e-6?t.re>0?"":"-":Math.abs(t.im)<1e-6?t.re.toFixed(3):Math.abs(t.re)<1e-6?`${t.im.toFixed(3)}i`:`(${t.toString(3)})`}function C(t,e,n,o,i,l,a=0,u=0){const d=Math.cos(a),p=Math.sin(a);let r=t*d+n*p,v=-t*p+n*d;const g=Math.cos(u),c=Math.sin(u);let s=e*g-v*c,m=e*c+v*g;const y=1+m*.15;return{x:o+r*l/y,y:i-s*l/y,z:m,scale:1/y}}function P(t,e,n,o,i,l,a={}){const{rotY:u=-.4,rotX:d=.3,showLabels:p=!0,glowColor:r="#00f0ff"}=a,v=t.canvas.width,g=t.canvas.height;t.clearRect(0,0,v,g);const c=t.createRadialGradient(e,n,0,e,n,o*1.8);c.addColorStop(0,"rgba(0,240,255,0.03)"),c.addColorStop(.5,"rgba(139,92,246,0.02)"),c.addColorStop(1,"transparent"),t.fillStyle=c,t.fillRect(0,0,v,g),R(t,e,n,o,u,d),j(t,e,n,o,u,d,p);const s=Math.sin(i)*Math.cos(l),m=Math.cos(i),y=Math.sin(i)*Math.sin(l),b=C(s,m,y,e,n,o,u,d),I=C(0,0,0,e,n,o,u,d);t.save(),t.shadowColor=r,t.shadowBlur=15,t.strokeStyle=r,t.lineWidth=3,t.beginPath(),t.moveTo(I.x,I.y),t.lineTo(b.x,b.y),t.stroke(),t.fillStyle=r,t.beginPath(),t.arc(b.x,b.y,6,0,Math.PI*2),t.fill(),t.restore(),t.save(),t.shadowColor=r,t.shadowBlur=20,t.strokeStyle=r,t.lineWidth=2,t.globalAlpha=.5,t.beginPath(),t.arc(b.x,b.y,10,0,Math.PI*2),t.stroke(),t.restore()}function R(t,e,n,o,i,l){t.save(),t.strokeStyle="rgba(255,255,255,0.07)",t.lineWidth=1;for(let a=-60;a<=60;a+=30){const u=Math.cos(a*Math.PI/180),d=Math.sin(a*Math.PI/180);t.beginPath();for(let p=0;p<=360;p+=5){const r=p*Math.PI/180,v=u*Math.cos(r),g=u*Math.sin(r),c=C(v,d,g,e,n,o,i,l);p===0?t.moveTo(c.x,c.y):t.lineTo(c.x,c.y)}t.stroke()}for(let a=0;a<180;a+=30){const u=a*Math.PI/180;t.beginPath();for(let d=0;d<=360;d+=5){const p=d*Math.PI/180,r=Math.cos(p)*Math.cos(u),v=Math.sin(p),g=Math.cos(p)*Math.sin(u),c=C(r,v,g,e,n,o,i,l);d===0?t.moveTo(c.x,c.y):t.lineTo(c.x,c.y)}t.stroke()}t.strokeStyle="rgba(255,255,255,0.12)",t.lineWidth=1.5,t.beginPath();for(let a=0;a<=360;a+=3){const u=a*Math.PI/180,d=C(Math.cos(u),0,Math.sin(u),e,n,o,i,l);a===0?t.moveTo(d.x,d.y):t.lineTo(d.x,d.y)}t.stroke(),t.restore()}function j(t,e,n,o,i,l,a){const u=[{dir:[1,0,0],label:"X",color:"rgba(236,72,153,0.6)"},{dir:[0,1,0],label:"|0⟩",color:"rgba(0,240,255,0.7)"},{dir:[0,-1,0],label:"|1⟩",color:"rgba(139,92,246,0.7)"},{dir:[0,0,1],label:"Y",color:"rgba(245,158,11,0.6)"}];for(const d of u){const[p,r,v]=d.dir,g=C(0,0,0,e,n,o,i,l),c=C(p*1.2,r*1.2,v*1.2,e,n,o,i,l);if(t.save(),t.strokeStyle=d.color,t.lineWidth=1.5,t.setLineDash([4,4]),t.beginPath(),t.moveTo(g.x,g.y),t.lineTo(c.x,c.y),t.stroke(),t.restore(),a){const s=C(p*1.35,r*1.35,v*1.35,e,n,o,i,l);t.save(),t.font='14px "JetBrains Mono", monospace',t.fillStyle=d.color,t.textAlign="center",t.textBaseline="middle",t.fillText(d.label,s.x,s.y),t.restore()}}}function G(){const t=document.getElementById("bloch-container");if(!t)return;let e=Math.PI/3,n=Math.PI/4;t.innerHTML=`
    <div class="bloch-canvas-wrap">
      <canvas id="bloch-canvas" width="400" height="400"></canvas>
    </div>
    <div class="bloch-controls glass-card">
      <h3 style="font-family:var(--font-heading);font-size:20px;margin-bottom:4px;">Qubit State Controls</h3>
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">
        Adjust θ (polar) and φ (azimuthal) angles to explore all possible single-qubit states.
      </p>
      <div class="slider-group">
        <div class="slider-label"><span>θ (Theta)</span><span id="theta-val">${(e/Math.PI).toFixed(2)}π</span></div>
        <input type="range" id="theta-slider" min="0" max="${Math.PI}" step="0.01" value="${e}" />
      </div>
      <div class="slider-group">
        <div class="slider-label"><span>φ (Phi)</span><span id="phi-val">${(n/Math.PI).toFixed(2)}π</span></div>
        <input type="range" id="phi-slider" min="0" max="${2*Math.PI}" step="0.01" value="${n}" />
      </div>
      <div class="state-display" id="bloch-state">|ψ⟩ = ${L(E(e,n))}</div>
      <div style="display:flex;gap:12px;">
        <div class="prob-bars" style="flex:1;">
          <div class="prob-bar-group">
            <div class="prob-bar-track">
              <div class="prob-bar-fill zero" id="bloch-p0" style="height:${M(E(e,n))[0]*100}%"></div>
            </div>
            <span class="prob-label">|0⟩</span>
            <span class="prob-value" id="bloch-pv0">${(M(E(e,n))[0]*100).toFixed(1)}%</span>
          </div>
          <div class="prob-bar-group">
            <div class="prob-bar-track">
              <div class="prob-bar-fill one" id="bloch-p1" style="height:${M(E(e,n))[1]*100}%"></div>
            </div>
            <span class="prob-label">|1⟩</span>
            <span class="prob-value" id="bloch-pv1">${(M(E(e,n))[1]*100).toFixed(1)}%</span>
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
  `;const i=document.getElementById("bloch-canvas").getContext("2d"),l=document.getElementById("theta-slider"),a=document.getElementById("phi-slider"),u=document.getElementById("theta-val"),d=document.getElementById("phi-val"),p=document.getElementById("bloch-state"),r=document.getElementById("bloch-p0"),v=document.getElementById("bloch-p1"),g=document.getElementById("bloch-pv0"),c=document.getElementById("bloch-pv1");function s(){const m=E(e,n),y=M(m);P(i,200,200,150,e,n),u.textContent=`${(e/Math.PI).toFixed(2)}π`,d.textContent=`${(n/Math.PI).toFixed(2)}π`,p.textContent=`|ψ⟩ = ${L(m)}`,r.style.height=`${y[0]*100}%`,v.style.height=`${y[1]*100}%`,g.textContent=`${(y[0]*100).toFixed(1)}%`,c.textContent=`${(y[1]*100).toFixed(1)}%`}l.addEventListener("input",m=>{e=parseFloat(m.target.value),s()}),a.addEventListener("input",m=>{n=parseFloat(m.target.value),s()}),t.querySelectorAll("[data-preset]").forEach(m=>{m.addEventListener("click",()=>{const[y,b]=m.dataset.preset.split(",").map(Number);e=y,n=b,l.value=e,a.value=n,s()})}),s()}function W(){const t=document.getElementById("gates-container");if(!t)return;let e=[new f(1),new f(0)],n=[];t.innerHTML=`
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
  `;const i=document.getElementById("gates-canvas").getContext("2d"),l=document.getElementById("gates-state"),a=document.getElementById("gates-p0"),u=document.getElementById("gates-p1"),d=document.getElementById("gates-pv0"),p=document.getElementById("gates-pv1"),r=document.getElementById("gate-history");function v(){const s=M(e),m=F(e);P(i,200,200,150,m.theta,m.phi,{glowColor:"#8b5cf6"}),l.textContent=`|ψ⟩ = ${L(e)}`,a.style.height=`${s[0]*100}%`,u.style.height=`${s[1]*100}%`,d.textContent=`${(s[0]*100).toFixed(1)}%`,p.textContent=`${(s[1]*100).toFixed(1)}%`}function g(){n.length===0?r.innerHTML='<span style="color:var(--text-muted);font-size:13px;">No gates applied yet</span>':r.innerHTML=n.map(s=>`<span class="gate-history-item">${s}</span>`).join("")}function c(s){switch(n=[],s){case"0":e=[new f(1),new f(0)];break;case"1":e=[new f(0),new f(1)];break;case"+":e=E(Math.PI/2,0);break;case"-":e=E(Math.PI/2,Math.PI);break}g(),v()}t.querySelectorAll("[data-init]").forEach(s=>{s.addEventListener("click",()=>{t.querySelectorAll("[data-init]").forEach(m=>m.classList.remove("active")),s.classList.add("active"),c(s.dataset.init)})}),t.querySelectorAll("[data-gate]").forEach(s=>{s.addEventListener("click",()=>{const m=z[s.dataset.gate];e=A(m,e),n.push(s.dataset.gate),g(),v(),s.style.transform="scale(1.15)",s.style.boxShadow=`0 0 20px ${m.color}50`,setTimeout(()=>{s.style.transform="",s.style.boxShadow=""},200)})}),document.getElementById("reset-gates").addEventListener("click",()=>{const s=t.querySelector("[data-init].active");c(s?s.dataset.init:"0")}),v()}function Q(){const t=document.getElementById("superposition-container");if(!t)return;let e=Math.PI/2,n=0,o=!1,i={zero:0,one:0};t.innerHTML=`
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
        <div class="slider-label"><span>α² (P of |0⟩)</span><span id="super-prob">${(Math.cos(e/2)**2*100).toFixed(0)}%</span></div>
        <input type="range" id="super-alpha" min="0" max="${Math.PI}" step="0.01" value="${e}" />
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
  `;const l=document.getElementById("coin-inner"),a=document.getElementById("coin-state"),u=document.getElementById("super-alpha"),d=document.getElementById("super-prob"),p=document.getElementById("batch-slider"),r=document.getElementById("batch-val"),v=document.getElementById("theory-p");function g(){const s=i.zero+i.one,m=document.getElementById("histo-f0"),y=document.getElementById("histo-f1"),b=document.getElementById("histo-c0"),I=document.getElementById("histo-c1"),w=document.getElementById("histo-p0"),B=document.getElementById("histo-p1"),T=document.getElementById("total-m");if(s===0){m.style.height="0%",y.style.height="0%",b.textContent="0",I.textContent="0",w.textContent="0%",B.textContent="0%",T.textContent="0";return}m.style.height=`${i.zero/s*100}%`,y.style.height=`${i.one/s*100}%`,b.textContent=i.zero,I.textContent=i.one,w.textContent=`${(i.zero/s*100).toFixed(1)}%`,B.textContent=`${(i.one/s*100).toFixed(1)}%`,T.textContent=s}function c(){o=!0,l.className="coin-inner spinning",a.textContent="Superposition — Click to measure!",a.style.color="var(--accent-cyan)"}document.getElementById("quantum-coin").addEventListener("click",()=>{if(!o){c();return}o=!1;const s=E(e,n),m=N(s);l.classList.remove("spinning"),l.className=`coin-inner collapsed-${m}`,m===0?(i.zero++,a.textContent="Collapsed to |0⟩!",a.style.color="var(--accent-cyan)"):(i.one++,a.textContent="Collapsed to |1⟩!",a.style.color="var(--accent-purple)"),g()}),u.addEventListener("input",s=>{e=parseFloat(s.target.value);const m=Math.cos(e/2)**2;d.textContent=`${(m*100).toFixed(0)}%`,v.textContent=`${(m*100).toFixed(1)}%`,c(),i={zero:0,one:0},g()}),p.addEventListener("input",s=>{r.textContent=s.target.value}),document.getElementById("run-measurements").addEventListener("click",()=>{const s=parseInt(p.value),m=E(e,n),[y]=M(m);for(let b=0;b<s;b++)Math.random()<y?i.zero++:i.one++;g(),l.className="coin-inner spinning",setTimeout(()=>{const b=Math.random()<y?0:1;l.className=`coin-inner collapsed-${b}`,a.textContent=`Last: |${b}⟩ (${s} measurements done)`,a.style.color=b===0?"var(--accent-cyan)":"var(--accent-purple)",o=!1},600)}),document.getElementById("clear-measurements").addEventListener("click",()=>{i={zero:0,one:0},g(),c()}),document.getElementById("super-reset-coin").addEventListener("click",c)}function V(){const t=document.getElementById("entanglement-container");if(!t)return;let e="Φ+",n=$(e),o={"00":0,"01":0,10:0,11:0};t.innerHTML=`
    <div class="ent-visual glass-card">
      <h3 style="font-family:var(--font-heading);font-size:20px;">Entangled Qubits</h3>
      <p style="font-size:13px;color:var(--text-muted);max-width:340px;text-align:center;margin-bottom:8px;">
        Two entangled qubits share a mysterious connection. Measuring one instantly determines the other.
      </p>
      <div class="ent-qubits">
        <div class="ent-qubit qubit-a" id="ent-qa">?</div>
        <div class="ent-link" id="ent-link">⟷</div>
        <div class="ent-qubit qubit-b" id="ent-qb">?</div>
      </div>
      <div style="display:flex;gap:8px;font-size:13px;color:var(--text-muted);">
        <span>Qubit A</span>
        <span style="flex:1;"></span>
        <span>Qubit B</span>
      </div>
      <div class="state-display" id="ent-state" style="font-size:15px;width:100%;">
        |${e}⟩ — Click a qubit to measure!
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
  `;const i=document.getElementById("ent-qa"),l=document.getElementById("ent-qb"),a=document.getElementById("ent-link"),u=document.getElementById("ent-state"),d=document.getElementById("ent-batch"),p=document.getElementById("ent-batch-val");function r(){const c=o["00"]+o["01"]+o[10]+o[11];for(const s of["00","01","10","11"])document.getElementById(`c-${s}`).textContent=o[s],document.getElementById(`p-${s}`).textContent=c>0?`${(o[s]/c*100).toFixed(1)}%`:"—";document.getElementById("ent-total").textContent=c}function v(){n=$(e);const c=S(n),s=c>>1&1,m=c&1;i.textContent=s,l.textContent=m,i.classList.add("measured"),l.classList.add("measured"),setTimeout(()=>{i.classList.remove("measured"),l.classList.remove("measured")},500);const y=`${s}${m}`;o[y]++,r(),u.textContent=`Measured: |${s}${m}⟩`,u.style.color="var(--accent-green)",a.textContent="⚡",a.style.color="var(--accent-green)",setTimeout(()=>{a.textContent="⟷",a.style.color=""},600)}function g(){i.textContent="?",l.textContent="?",n=$(e),u.textContent=`|${e}⟩ — Click a qubit to measure!`,u.style.color="var(--accent-cyan)",a.textContent="⟷",a.style.color=""}document.getElementById("ent-measure").addEventListener("click",v),i.addEventListener("click",v),l.addEventListener("click",v),document.getElementById("ent-reset").addEventListener("click",()=>{o={"00":0,"01":0,10:0,11:0},r(),g()}),t.querySelectorAll("[data-bell]").forEach(c=>{c.addEventListener("click",()=>{t.querySelectorAll("[data-bell]").forEach(s=>s.classList.remove("active")),c.classList.add("active"),e=c.dataset.bell,o={"00":0,"01":0,10:0,11:0},r(),g()})}),d.addEventListener("input",c=>{p.textContent=c.target.value}),document.getElementById("ent-run-batch").addEventListener("click",()=>{const c=parseInt(d.value);for(let y=0;y<c;y++){const b=$(e),I=S(b),w=I>>1&1,B=I&1;o[`${w}${B}`]++}r();const s=$(e),m=S(s);i.textContent=m>>1&1,l.textContent=m&1,u.textContent=`Batch complete — ${c} measurements done`,u.style.color="var(--accent-green)"})}function Y(){const t=document.getElementById("circuit-container");if(!t)return;const e=3,n=6;let o="H",i=Array.from({length:e},()=>Array(n).fill(null));t.innerHTML=`
    <div class="circuit-top">
      <div class="glass-card">
        <h3 style="font-family:var(--font-heading);font-size:18px;margin-bottom:12px;">Circuit Grid</h3>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
          Click cells to place the selected gate. Click an occupied cell to remove the gate.
        </p>
        <div class="circuit-grid-wrap">
          <div class="circuit-grid" id="circuit-grid" style="grid-template-columns: 60px repeat(${n}, 60px); grid-template-rows: repeat(${e}, 60px);">
            ${a()}
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
          ${u()}
        </div>
      </div>
    </div>
  `;let l=null;function a(){let p="";for(let r=0;r<e;r++){p+=`<div class="circuit-label">q${r} |0⟩</div>`;for(let v=0;v<n;v++)p+=`<div class="circuit-cell" data-q="${r}" data-s="${v}"></div>`}return p}function u(){const p=1<<e,r=["zero","one","two","three","zero","one","two","three"];let v="";for(let g=0;g<p;g++){const c=g.toString(2).padStart(e,"0");v+=`
        <div class="prob-bar-group">
          <div class="prob-bar-track" style="height:100px;">
            <div class="prob-bar-fill ${r[g%8]}" id="cp-${g}" style="height:0%"></div>
          </div>
          <span class="prob-label">|${c}⟩</span>
          <span class="prob-value" id="cpv-${g}">0%</span>
        </div>`}return v}function d(){t.querySelectorAll(".circuit-cell").forEach(r=>{const v=parseInt(r.dataset.q),g=parseInt(r.dataset.s),c=i[v][g];c?(r.classList.add("has-gate"),typeof c=="string"?r.textContent=c:c.gate==="CNOT"&&c.role==="control"?(r.textContent="●",r.style.color="var(--accent-cyan)"):c.gate==="CNOT"&&c.role==="target"&&(r.textContent="⊕",r.style.color="var(--accent-pink)")):(r.classList.remove("has-gate"),r.textContent="",r.style.color="")})}t.querySelectorAll("[data-select]").forEach(p=>{p.addEventListener("click",()=>{t.querySelectorAll("[data-select]").forEach(r=>r.classList.remove("active")),p.classList.add("active"),o=p.dataset.select,l=null})}),t.querySelector("#circuit-grid").addEventListener("click",p=>{const r=p.target.closest(".circuit-cell");if(!r)return;const v=parseInt(r.dataset.q),g=parseInt(r.dataset.s);if(i[v][g]){const c=i[v][g];if(c&&typeof c=="object"&&c.gate==="CNOT"){const s=c.role==="control"?c.target:c.control;i[s][g]=null}i[v][g]=null,l=null}else o==="CNOT"?l===null?(l={q:v,s:g},r.textContent="●",r.style.color="var(--accent-cyan)",r.style.opacity="0.5"):(l.s===g&&l.q!==v&&(i[l.q][g]={gate:"CNOT",role:"control",control:l.q,target:v},i[v][g]={gate:"CNOT",role:"target",control:l.q,target:v}),l=null):i[v][g]=o;d()}),document.getElementById("run-circuit").addEventListener("click",()=>{const p=1<<e;let r=Array.from({length:p},(s,m)=>m===0?new f(1):new f(0));for(let s=0;s<n;s++){let m=new Set;for(let y=0;y<e;y++){const b=i[y][s];b&&(typeof b=="string"?r=H(z[b],r,y,e):b.gate==="CNOT"&&!m.has(s+"-"+b.control+"-"+b.target)&&(r=O(r,b.control,b.target,e),m.add(s+"-"+b.control+"-"+b.target)))}}const v=document.getElementById("circuit-state"),g=[];for(let s=0;s<p;s++){const m=r[s].mag();if(m>1e-6){const y=s.toString(2).padStart(e,"0"),b=m.toFixed(3);g.push(`${b}|${y}⟩`)}}v.textContent=g.join(" + ")||"0";for(let s=0;s<p;s++){const m=r[s].mag2();document.getElementById(`cp-${s}`).style.height=`${m*100}%`,document.getElementById(`cpv-${s}`).textContent=`${(m*100).toFixed(1)}%`}const c=document.getElementById("run-circuit");c.style.transform="scale(1.05)",setTimeout(()=>{c.style.transform=""},200)}),document.getElementById("clear-circuit").addEventListener("click",()=>{i=Array.from({length:e},()=>Array(n).fill(null)),l=null,d(),document.getElementById("circuit-state").textContent="Run the circuit to see results";const p=1<<e;for(let r=0;r<p;r++)document.getElementById(`cp-${r}`).style.height="0%",document.getElementById(`cpv-${r}`).textContent="0%"}),document.getElementById("example-circuit").addEventListener("click",()=>{i=Array.from({length:e},()=>Array(n).fill(null)),i[0][0]="H",i[0][1]={gate:"CNOT",role:"control",control:0,target:1},i[1][1]={gate:"CNOT",role:"target",control:0,target:1},i[2][0]="H",i[2][2]={gate:"CNOT",role:"control",control:2,target:1},i[1][2]={gate:"CNOT",role:"target",control:2,target:1},d()}),d()}document.addEventListener("DOMContentLoaded",()=>{q(),G(),W(),Q(),V(),Y(),Z(),X()});function Z(){const t=document.getElementById("navbar"),e=document.querySelectorAll(".nav-link"),n=document.getElementById("nav-toggle"),o=document.querySelector(".nav-links"),i=document.querySelectorAll(".section");window.addEventListener("scroll",()=>{t.classList.toggle("scrolled",window.scrollY>50)}),n.addEventListener("click",()=>{o.classList.toggle("open")}),e.forEach(a=>{a.addEventListener("click",()=>{o.classList.remove("open")})});const l=new IntersectionObserver(a=>{a.forEach(u=>{if(u.isIntersecting){const d=u.target.id;e.forEach(p=>{p.classList.toggle("active",p.getAttribute("href")===`#${d}`)})}})},{threshold:.3});i.forEach(a=>l.observe(a))}function X(){const t=document.querySelectorAll(".section-header, .glass-card, .bloch-canvas-wrap, .coin-container, .ent-visual"),e=new IntersectionObserver(n=>{n.forEach(o=>{o.isIntersecting&&(o.target.classList.add("animate-in"),e.unobserve(o.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});t.forEach(n=>e.observe(n))}
