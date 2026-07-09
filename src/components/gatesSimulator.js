/**
 * Quantum Gates Simulator — apply gates and watch state transform
 */
import { Complex, GATES, applyGate, probabilities, formatState, anglesFromState, stateFromAngles } from '../utils/quantumMath.js';
import { drawBlochSphere } from '../utils/canvasHelpers.js';

export function initGatesSimulator() {
  const container = document.getElementById('gates-container');
  if (!container) return;

  let state = [new Complex(1), new Complex(0)]; // |0⟩
  let history = [];

  container.innerHTML = `
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
  `;

  const canvas = document.getElementById('gates-canvas');
  const ctx = canvas.getContext('2d');
  const stateEl = document.getElementById('gates-state');
  const p0 = document.getElementById('gates-p0');
  const p1 = document.getElementById('gates-p1');
  const pv0 = document.getElementById('gates-pv0');
  const pv1 = document.getElementById('gates-pv1');
  const historyEl = document.getElementById('gate-history');

  function update() {
    const probs = probabilities(state);
    const angles = anglesFromState(state);

    drawBlochSphere(ctx, 200, 200, 150, angles.theta, angles.phi, { glowColor: '#8b5cf6' });

    stateEl.textContent = `|ψ⟩ = ${formatState(state)}`;
    p0.style.height = `${probs[0] * 100}%`;
    p1.style.height = `${probs[1] * 100}%`;
    pv0.textContent = `${(probs[0] * 100).toFixed(1)}%`;
    pv1.textContent = `${(probs[1] * 100).toFixed(1)}%`;
  }

  function updateHistory() {
    if (history.length === 0) {
      historyEl.innerHTML = '<span style="color:var(--text-muted);font-size:13px;">No gates applied yet</span>';
    } else {
      historyEl.innerHTML = history.map(g => `<span class="gate-history-item">${g}</span>`).join('');
    }
  }

  function setInitState(type) {
    history = [];
    switch (type) {
      case '0': state = [new Complex(1), new Complex(0)]; break;
      case '1': state = [new Complex(0), new Complex(1)]; break;
      case '+': state = stateFromAngles(Math.PI / 2, 0); break;
      case '-': state = stateFromAngles(Math.PI / 2, Math.PI); break;
    }
    updateHistory();
    update();
  }

  // Init state buttons
  container.querySelectorAll('[data-init]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-init]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setInitState(btn.dataset.init);
    });
  });

  // Gate buttons
  container.querySelectorAll('[data-gate]').forEach(btn => {
    btn.addEventListener('click', () => {
      const gate = GATES[btn.dataset.gate];
      state = applyGate(gate, state);
      history.push(btn.dataset.gate);
      updateHistory();
      update();

      // Flash animation
      btn.style.transform = 'scale(1.15)';
      btn.style.boxShadow = `0 0 20px ${gate.color}50`;
      setTimeout(() => { btn.style.transform = ''; btn.style.boxShadow = ''; }, 200);
    });
  });

  // Reset
  document.getElementById('reset-gates').addEventListener('click', () => {
    const activeInit = container.querySelector('[data-init].active');
    setInitState(activeInit ? activeInit.dataset.init : '0');
  });

  update();
}
