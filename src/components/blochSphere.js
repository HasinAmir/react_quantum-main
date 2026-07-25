/**
 * Bloch Sphere Visualizer — Interactive qubit state on a 3D sphere
 */
import { stateFromAngles, probabilities, formatState, Complex } from '../utils/quantumMath.js';
import { drawBlochSphere } from '../utils/canvasHelpers.js';

export function initBlochSphere() {
  const container = document.getElementById('bloch-container');
  if (!container) return;

  let theta = Math.PI / 3;
  let phi = Math.PI / 4;

  container.innerHTML = `
    <div class="bloch-canvas-wrap">
      <canvas id="bloch-canvas" width="400" height="400"></canvas>
    </div>
    <div class="bloch-controls glass-card">
      <h3 style="font-family:var(--font-heading);font-size:20px;margin-bottom:4px;">Qubit State Controls</h3>
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">
        Adjust θ (polar) and φ (azimuthal) angles to explore all possible single-qubit states.
      </p>
      <div class="slider-group">
        <div class="slider-label"><span>θ (Theta)</span><span id="theta-val">${(theta / Math.PI).toFixed(2)}π</span></div>
        <input type="range" id="theta-slider" min="0" max="${Math.PI}" step="0.01" value="${theta}" />
      </div>
      <div class="slider-group">
        <div class="slider-label"><span>φ (Phi)</span><span id="phi-val">${(phi / Math.PI).toFixed(2)}π</span></div>
        <input type="range" id="phi-slider" min="0" max="${2 * Math.PI}" step="0.01" value="${phi}" />
      </div>
      <div class="state-display" id="bloch-state">|ψ⟩ = ${formatState(stateFromAngles(theta, phi))}</div>
      <div style="display:flex;gap:12px;">
        <div class="prob-bars" style="flex:1;">
          <div class="prob-bar-group">
            <div class="prob-bar-track">
              <div class="prob-bar-fill zero" id="bloch-p0" style="height:${probabilities(stateFromAngles(theta, phi))[0] * 100}%"></div>
            </div>
            <span class="prob-label">|0⟩</span>
            <span class="prob-value" id="bloch-pv0">${(probabilities(stateFromAngles(theta, phi))[0] * 100).toFixed(1)}%</span>
          </div>
          <div class="prob-bar-group">
            <div class="prob-bar-track">
              <div class="prob-bar-fill one" id="bloch-p1" style="height:${probabilities(stateFromAngles(theta, phi))[1] * 100}%"></div>
            </div>
            <span class="prob-label">|1⟩</span>
            <span class="prob-value" id="bloch-pv1">${(probabilities(stateFromAngles(theta, phi))[1] * 100).toFixed(1)}%</span>
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
  `;

  const canvas = document.getElementById('bloch-canvas');
  const ctx = canvas.getContext('2d');
  const thetaSlider = document.getElementById('theta-slider');
  const phiSlider = document.getElementById('phi-slider');
  const thetaVal = document.getElementById('theta-val');
  const phiVal = document.getElementById('phi-val');
  const stateEl = document.getElementById('bloch-state');
  const p0 = document.getElementById('bloch-p0');
  const p1 = document.getElementById('bloch-p1');
  const pv0 = document.getElementById('bloch-pv0');
  const pv1 = document.getElementById('bloch-pv1');

  function update() {
    drawBlochSphere(ctx, 200, 200, 150, theta, phi, {
      onFrame: (curTheta, curPhi) => {
        const curState = stateFromAngles(curTheta, curPhi);
        const curProbs = probabilities(curState);

        thetaVal.textContent = `${(curTheta / Math.PI).toFixed(2)}π`;
        phiVal.textContent = `${(curPhi / Math.PI).toFixed(2)}π`;
        stateEl.textContent = `|ψ⟩ = ${formatState(curState)}`;

        p0.style.height = `${curProbs[0] * 100}%`;
        p1.style.height = `${curProbs[1] * 100}%`;
        pv0.textContent = `${(curProbs[0] * 100).toFixed(1)}%`;
        pv1.textContent = `${(curProbs[1] * 100).toFixed(1)}%`;
      }
    });
  }

  thetaSlider.addEventListener('input', (e) => { theta = parseFloat(e.target.value); update(); });
  phiSlider.addEventListener('input', (e) => { phi = parseFloat(e.target.value); update(); });

  // Preset buttons
  container.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const [t, p] = btn.dataset.preset.split(',').map(Number);
      theta = t; phi = p;
      thetaSlider.value = theta;
      phiSlider.value = phi;
      update();
    });
  });

  update();
}
