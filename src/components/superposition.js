/**
 * Superposition & Measurement Demo
 */
import { Complex, stateFromAngles, probabilities, measure
} from '../utils/quantumMath.js';

export function initSuperposition() {
  const container = document.getElementById('superposition-container');
  if (!container) return;

  let theta = Math.PI / 2; // Equal superposition by default
  let phi = 0;
  let isSpinning = false;
  let results = { zero: 0, one: 0 };
  let totalMeasurements = 0;

  container.innerHTML = `
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
        <div class="slider-label"><span>α² (P of |0⟩)</span><span id="super-prob">${(Math.cos(theta / 2) ** 2 * 100).toFixed(0)}%</span></div>
        <input type="range" id="super-alpha" min="0" max="${Math.PI}" step="0.01" value="${theta}" />
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
  `;

  const coinInner = document.getElementById('coin-inner');
  const coinState = document.getElementById('coin-state');
  const alphaSlider = document.getElementById('super-alpha');
  const superProb = document.getElementById('super-prob');
  const batchSlider = document.getElementById('batch-slider');
  const batchVal = document.getElementById('batch-val');
  const theoryP = document.getElementById('theory-p');

  function updateHistogram() {
    const total = results.zero + results.one;
    const f0 = document.getElementById('histo-f0');
    const f1 = document.getElementById('histo-f1');
    const c0 = document.getElementById('histo-c0');
    const c1 = document.getElementById('histo-c1');
    const p0 = document.getElementById('histo-p0');
    const p1 = document.getElementById('histo-p1');
    const totalEl = document.getElementById('total-m');

    if (total === 0) {
      f0.style.height = '0%'; f1.style.height = '0%';
      c0.textContent = '0'; c1.textContent = '0';
      p0.textContent = '0%'; p1.textContent = '0%';
      totalEl.textContent = '0';
      return;
    }

    f0.style.height = `${(results.zero / total) * 100}%`;
    f1.style.height = `${(results.one / total) * 100}%`;
    c0.textContent = results.zero;
    c1.textContent = results.one;
    p0.textContent = `${(results.zero / total * 100).toFixed(1)}%`;
    p1.textContent = `${(results.one / total * 100).toFixed(1)}%`;
    totalEl.textContent = total;
  }

  function resetCoin() {
    isSpinning = true;
    coinInner.className = 'coin-inner spinning';
    coinState.textContent = 'Superposition — Click to measure!';
    coinState.style.color = 'var(--accent-cyan)';
  }

  // Coin click — single measurement
  document.getElementById('quantum-coin').addEventListener('click', () => {
    if (!isSpinning) { resetCoin(); return; }
    isSpinning = false;
    const state = stateFromAngles(theta, phi);
    const result = measure(state);
    
    coinInner.classList.remove('spinning');
    coinInner.className = `coin-inner collapsed-${result}`;
    
    if (result === 0) {
      results.zero++;
      coinState.textContent = 'Collapsed to |0⟩!';
      coinState.style.color = 'var(--accent-cyan)';
    } else {
      results.one++;
      coinState.textContent = 'Collapsed to |1⟩!';
      coinState.style.color = 'var(--accent-purple)';
    }
    updateHistogram();
  });

  // Alpha slider
  alphaSlider.addEventListener('input', (e) => {
    theta = parseFloat(e.target.value);
    const prob0 = Math.cos(theta / 2) ** 2;
    superProb.textContent = `${(prob0 * 100).toFixed(0)}%`;
    theoryP.textContent = `${(prob0 * 100).toFixed(1)}%`;
    resetCoin();
    results = { zero: 0, one: 0 };
    updateHistogram();
  });

  // Batch slider
  batchSlider.addEventListener('input', (e) => { batchVal.textContent = e.target.value; });

  // Run measurements
  document.getElementById('run-measurements').addEventListener('click', () => {
    const n = parseInt(batchSlider.value);
    const state = stateFromAngles(theta, phi);
    const [p0] = probabilities(state);

    for (let i = 0; i < n; i++) {
      if (Math.random() < p0) results.zero++;
      else results.one++;
    }
    updateHistogram();

    // Animate coin quickly
    coinInner.className = 'coin-inner spinning';
    setTimeout(() => {
      const lastResult = Math.random() < p0 ? 0 : 1;
      coinInner.className = `coin-inner collapsed-${lastResult}`;
      coinState.textContent = `Last: |${lastResult}⟩ (${n} measurements done)`;
      coinState.style.color = lastResult === 0 ? 'var(--accent-cyan)' : 'var(--accent-purple)';
      isSpinning = false;
    }, 600);
  });

  // Clear
  document.getElementById('clear-measurements').addEventListener('click', () => {
    results = { zero: 0, one: 0 };
    updateHistogram();
    resetCoin();
  });

  // Reset coin button
  document.getElementById('super-reset-coin').addEventListener('click', resetCoin);
}
