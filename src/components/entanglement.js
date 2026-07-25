/**
 * Quantum Entanglement Visualizer
 */
import { bellState, measureMulti, Complex } from '../utils/quantumMath.js';

export function initEntanglement() {
  const container = document.getElementById('entanglement-container');
  if (!container) return;

  let currentBell = 'Φ+';
  let state = bellState(currentBell);
  let counts = { '00': 0, '01': 0, '10': 0, '11': 0 };
  let isMeasuring = false;
  let animPulseFrame = null;

  const superpositionHTML_A = `
    <div class="superposition-wrap">
      <svg class="superposition-ring-svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" class="superposition-ring-path" />
      </svg>
      <span class="superposition-text">|ψ⟩</span>
    </div>
  `;

  const superpositionHTML_B = `
    <div class="superposition-wrap">
      <svg class="superposition-ring-svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" class="superposition-ring-path" />
      </svg>
      <span class="superposition-text">|ψ⟩</span>
    </div>
  `;

  container.innerHTML = `
    <div class="ent-visual glass-card">
      <h3 style="font-family:var(--font-heading);font-size:20px;">Entangled Qubits</h3>
      <p style="font-size:13px;color:var(--text-muted);max-width:340px;text-align:center;margin-bottom:8px;">
        Two entangled qubits share a mysterious connection. Measuring one instantly determines the other.
      </p>
      <div class="ent-qubits">
        <div class="ent-qubit qubit-a" id="ent-qa" title="Click to measure Qubit A">
          ${superpositionHTML_A}
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
          ${superpositionHTML_B}
        </div>
      </div>
      <div style="display:flex;gap:8px;font-size:13px;color:var(--text-muted);width:100%;max-width:300px;justify-content:space-between;padding:0 8px;">
        <span>Qubit A</span>
        <span>Qubit B</span>
      </div>
      <div class="state-display" id="ent-state" style="font-size:15px;width:100%;">
        |${currentBell}⟩ — Click a qubit to measure!
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
  `;

  const qa = document.getElementById('ent-qa');
  const qb = document.getElementById('ent-qb');
  const stateEl = document.getElementById('ent-state');
  const batchSlider = document.getElementById('ent-batch');
  const batchVal = document.getElementById('ent-batch-val');

  function updateTable() {
    const total = counts['00'] + counts['01'] + counts['10'] + counts['11'];
    for (const k of ['00', '01', '10', '11']) {
      document.getElementById(`c-${k}`).textContent = counts[k];
      document.getElementById(`p-${k}`).textContent = total > 0
        ? `${(counts[k] / total * 100).toFixed(1)}%` : '—';
    }
    document.getElementById('ent-total').textContent = total;
  }

  function animateSignalPulse(onComplete) {
    const path = document.getElementById('ent-link-path');
    const pulseDot = document.getElementById('ent-pulse-dot');
    if (!path || !pulseDot) {
      if (onComplete) onComplete();
      return;
    }

    const totalLength = path.getTotalLength();
    const duration = 450; // milliseconds travel time
    const startTime = performance.now();

    pulseDot.setAttribute('opacity', '1');

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease in-out curve
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const point = path.getPointAtLength(eased * totalLength);
      pulseDot.setAttribute('cx', point.x);
      pulseDot.setAttribute('cy', point.y);

      if (progress < 1) {
        animPulseFrame = requestAnimationFrame(step);
      } else {
        pulseDot.setAttribute('opacity', '0');
        animPulseFrame = null;
        if (onComplete) onComplete();
      }
    }

    animPulseFrame = requestAnimationFrame(step);
  }

  function doMeasure() {
    if (isMeasuring) return;
    isMeasuring = true;

    state = bellState(currentBell);
    const result = measureMulti(state);
    const a = (result >> 1) & 1;
    const b = result & 1;

    // 1. Qubit A measures first
    qa.innerHTML = `|${a}⟩`;
    qa.classList.add('measured');
    stateEl.textContent = `Qubit A measured: |${a}⟩ — Entanglement wave propagating...`;
    stateEl.style.color = 'var(--accent-cyan)';

    // 2. Pulse travels along link from Qubit A to Qubit B
    animateSignalPulse(() => {
      // 3. Qubit B collapses upon pulse arrival
      qb.innerHTML = `|${b}⟩`;
      qb.classList.add('measured');

      const key = `${a}${b}`;
      counts[key]++;
      updateTable();

      stateEl.textContent = `Measured: |${a}${b}⟩`;
      stateEl.style.color = 'var(--accent-green)';

      setTimeout(() => {
        qa.classList.remove('measured');
        qb.classList.remove('measured');
        isMeasuring = false;
      }, 500);
    });
  }

  function reset() {
    if (animPulseFrame) {
      cancelAnimationFrame(animPulseFrame);
      animPulseFrame = null;
    }
    const pulseDot = document.getElementById('ent-pulse-dot');
    if (pulseDot) pulseDot.setAttribute('opacity', '0');

    isMeasuring = false;
    qa.innerHTML = superpositionHTML_A;
    qb.innerHTML = superpositionHTML_B;
    qa.classList.remove('measured');
    qb.classList.remove('measured');

    state = bellState(currentBell);
    stateEl.textContent = `|${currentBell}⟩ — Click a qubit to measure!`;
    stateEl.style.color = 'var(--accent-cyan)';
  }

  // Measure button & qubit clicks
  document.getElementById('ent-measure').addEventListener('click', doMeasure);
  qa.addEventListener('click', doMeasure);
  qb.addEventListener('click', doMeasure);

  // Reset button
  document.getElementById('ent-reset').addEventListener('click', () => {
    counts = { '00': 0, '01': 0, '10': 0, '11': 0 };
    updateTable();
    reset();
  });

  // Bell state buttons
  container.querySelectorAll('[data-bell]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-bell]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBell = btn.dataset.bell;
      counts = { '00': 0, '01': 0, '10': 0, '11': 0 };
      updateTable();
      reset();
    });
  });

  // Batch slider
  batchSlider.addEventListener('input', (e) => { batchVal.textContent = e.target.value; });

  // Batch measurement
  document.getElementById('ent-run-batch').addEventListener('click', () => {
    if (isMeasuring) return;
    const n = parseInt(batchSlider.value);
    for (let i = 0; i < n; i++) {
      const st = bellState(currentBell);
      const result = measureMulti(st);
      const a = (result >> 1) & 1;
      const b = result & 1;
      counts[`${a}${b}`]++;
    }
    updateTable();

    // Show last result
    const lastSt = bellState(currentBell);
    const lastR = measureMulti(lastSt);
    const lastA = (lastR >> 1) & 1;
    const lastB = lastR & 1;
    qa.innerHTML = `|${lastA}⟩`;
    qb.innerHTML = `|${lastB}⟩`;
    stateEl.textContent = `Batch complete — ${n} measurements done`;
    stateEl.style.color = 'var(--accent-green)';
  });
}
