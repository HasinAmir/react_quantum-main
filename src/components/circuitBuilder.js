/**
 * Mini Quantum Circuit Builder
 */
import { Complex, GATES, applyGateToQubit, applyCNOT, measureMulti } from '../utils/quantumMath.js';

export function initCircuitBuilder() {
  const container = document.getElementById('circuit-container');
  if (!container) return;

  const NUM_QUBITS = 3;
  const NUM_STEPS = 6;
  let selectedGate = 'H';
  let circuit = Array.from({ length: NUM_QUBITS }, () => Array(NUM_STEPS).fill(null));
  // For CNOT: store { gate: 'CNOT', control: qubitIndex, target: qubitIndex }

  container.innerHTML = `
    <div class="circuit-top">
      <div class="glass-card">
        <h3 style="font-family:var(--font-heading);font-size:18px;margin-bottom:12px;">Circuit Grid</h3>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
          Click cells to place the selected gate. Click an occupied cell to remove the gate.
        </p>
        <div class="circuit-grid-wrap">
          <div class="circuit-grid" id="circuit-grid" style="grid-template-columns: 60px repeat(${NUM_STEPS}, 60px); grid-template-rows: repeat(${NUM_QUBITS}, 60px);">
            ${buildGridHTML()}
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
          ${buildProbBarsHTML()}
        </div>
      </div>
    </div>
  `;

  let cnotControl = null; // track first click for CNOT

  function buildGridHTML() {
    let html = '';
    for (let q = 0; q < NUM_QUBITS; q++) {
      html += `<div class="circuit-label">q${q} |0⟩</div>`;
      for (let s = 0; s < NUM_STEPS; s++) {
        html += `<div class="circuit-cell" data-q="${q}" data-s="${s}"></div>`;
      }
    }
    return html;
  }

  function buildProbBarsHTML() {
    const n = 1 << NUM_QUBITS;
    const classes = ['zero', 'one', 'two', 'three', 'zero', 'one', 'two', 'three'];
    let html = '';
    for (let i = 0; i < n; i++) {
      const label = i.toString(2).padStart(NUM_QUBITS, '0');
      html += `
        <div class="prob-bar-group">
          <div class="prob-bar-track" style="height:100px;">
            <div class="prob-bar-fill ${classes[i % 8]}" id="cp-${i}" style="height:0%"></div>
          </div>
          <span class="prob-label">|${label}⟩</span>
          <span class="prob-value" id="cpv-${i}">0%</span>
        </div>`;
    }
    return html;
  }

  function renderGrid() {
    const cells = container.querySelectorAll('.circuit-cell');
    cells.forEach(cell => {
      const q = parseInt(cell.dataset.q);
      const s = parseInt(cell.dataset.s);
      const gate = circuit[q][s];
      if (gate) {
        cell.classList.add('has-gate');
        if (typeof gate === 'string') {
          cell.textContent = gate;
        } else if (gate.gate === 'CNOT' && gate.role === 'control') {
          cell.textContent = '●';
          cell.style.color = 'var(--accent-cyan)';
        } else if (gate.gate === 'CNOT' && gate.role === 'target') {
          cell.textContent = '⊕';
          cell.style.color = 'var(--accent-pink)';
        }
      } else {
        cell.classList.remove('has-gate');
        cell.textContent = '';
        cell.style.color = '';
      }
    });
  }

  // Gate palette
  container.querySelectorAll('[data-select]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-select]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGate = btn.dataset.select;
      cnotControl = null;
    });
  });

  // Grid clicks
  container.querySelector('#circuit-grid').addEventListener('click', (e) => {
    const cell = e.target.closest('.circuit-cell');
    if (!cell) return;
    const q = parseInt(cell.dataset.q);
    const s = parseInt(cell.dataset.s);

    if (circuit[q][s]) {
      // Remove gate (and CNOT partner)
      const existing = circuit[q][s];
      if (existing && typeof existing === 'object' && existing.gate === 'CNOT') {
        const partnerQ = existing.role === 'control' ? existing.target : existing.control;
        circuit[partnerQ][s] = null;
      }
      circuit[q][s] = null;
      cnotControl = null;
    } else if (selectedGate === 'CNOT') {
      if (cnotControl === null) {
        cnotControl = { q, s };
        cell.textContent = '●';
        cell.style.color = 'var(--accent-cyan)';
        cell.style.opacity = '0.5';
      } else {
        if (cnotControl.s === s && cnotControl.q !== q) {
          circuit[cnotControl.q][s] = { gate: 'CNOT', role: 'control', control: cnotControl.q, target: q };
          circuit[q][s] = { gate: 'CNOT', role: 'target', control: cnotControl.q, target: q };
        }
        cnotControl = null;
      }
    } else {
      circuit[q][s] = selectedGate;
    }
    renderGrid();
  });

  // Run circuit
  document.getElementById('run-circuit').addEventListener('click', () => {
    const dim = 1 << NUM_QUBITS;
    let state = Array.from({ length: dim }, (_, i) => i === 0 ? new Complex(1) : new Complex(0));

    for (let s = 0; s < NUM_STEPS; s++) {
      // Check for CNOT in this step
      let cnotDone = new Set();
      for (let q = 0; q < NUM_QUBITS; q++) {
        const gate = circuit[q][s];
        if (!gate) continue;
        if (typeof gate === 'string') {
          state = applyGateToQubit(GATES[gate], state, q, NUM_QUBITS);
        } else if (gate.gate === 'CNOT' && !cnotDone.has(s + '-' + gate.control + '-' + gate.target)) {
          state = applyCNOT(state, gate.control, gate.target, NUM_QUBITS);
          cnotDone.add(s + '-' + gate.control + '-' + gate.target);
        }
      }
    }

    // Display state
    const stateEl = document.getElementById('circuit-state');
    const terms = [];
    for (let i = 0; i < dim; i++) {
      const mag = state[i].mag();
      if (mag > 1e-6) {
        const label = i.toString(2).padStart(NUM_QUBITS, '0');
        const coeff = mag.toFixed(3);
        terms.push(`${coeff}|${label}⟩`);
      }
    }
    stateEl.textContent = terms.join(' + ') || '0';

    // Probabilities
    for (let i = 0; i < dim; i++) {
      const prob = state[i].mag2();
      document.getElementById(`cp-${i}`).style.height = `${prob * 100}%`;
      document.getElementById(`cpv-${i}`).textContent = `${(prob * 100).toFixed(1)}%`;
    }

    // Animate button
    const btn = document.getElementById('run-circuit');
    btn.style.transform = 'scale(1.05)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  });

  // Clear
  document.getElementById('clear-circuit').addEventListener('click', () => {
    circuit = Array.from({ length: NUM_QUBITS }, () => Array(NUM_STEPS).fill(null));
    cnotControl = null;
    renderGrid();
    document.getElementById('circuit-state').textContent = 'Run the circuit to see results';
    const dim = 1 << NUM_QUBITS;
    for (let i = 0; i < dim; i++) {
      document.getElementById(`cp-${i}`).style.height = '0%';
      document.getElementById(`cpv-${i}`).textContent = '0%';
    }
  });

  // Example
  document.getElementById('example-circuit').addEventListener('click', () => {
    circuit = Array.from({ length: NUM_QUBITS }, () => Array(NUM_STEPS).fill(null));
    // Bell pair on q0, q1 + H on q2
    circuit[0][0] = 'H';
    circuit[0][1] = { gate: 'CNOT', role: 'control', control: 0, target: 1 };
    circuit[1][1] = { gate: 'CNOT', role: 'target', control: 0, target: 1 };
    circuit[2][0] = 'H';
    circuit[2][2] = { gate: 'CNOT', role: 'control', control: 2, target: 1 };
    circuit[1][2] = { gate: 'CNOT', role: 'target', control: 2, target: 1 };
    renderGrid();
  });

  renderGrid();
}
