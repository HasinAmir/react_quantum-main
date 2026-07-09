/**
 * Quantum Math Utilities
 * Complex numbers, gate matrices, state operations
 */

// ===== Complex Number =====
export class Complex {
  constructor(re = 0, im = 0) { this.re = re; this.im = im; }
  static polar(r, theta) { return new Complex(r * Math.cos(theta), r * Math.sin(theta)); }
  add(b) { return new Complex(this.re + b.re, this.im + b.im); }
  sub(b) { return new Complex(this.re - b.re, this.im - b.im); }
  mul(b) { return new Complex(this.re * b.re - this.im * b.im, this.re * b.im + this.im * b.re); }
  scale(s) { return new Complex(this.re * s, this.im * s); }
  conj() { return new Complex(this.re, -this.im); }
  mag2() { return this.re * this.re + this.im * this.im; }
  mag() { return Math.sqrt(this.mag2()); }
  phase() { return Math.atan2(this.im, this.re); }
  toString(precision = 3) {
    const r = this.re.toFixed(precision);
    const i = Math.abs(this.im).toFixed(precision);
    if (Math.abs(this.im) < 1e-6) return r;
    if (Math.abs(this.re) < 1e-6) return `${this.im >= 0 ? '' : '-'}${i}i`;
    return `${r}${this.im >= 0 ? '+' : '-'}${i}i`;
  }
}

const C = (re, im = 0) => new Complex(re, im);
const SQRT2_INV = 1 / Math.sqrt(2);

// ===== Gate Matrices (2x2 for single-qubit gates) =====
export const GATES = {
  I: { name: 'I', matrix: [[C(1), C(0)], [C(0), C(1)]], color: '#666' },
  X: { name: 'X', matrix: [[C(0), C(1)], [C(1), C(0)]], color: '#ec4899' },
  Y: { name: 'Y', matrix: [[C(0), C(0, -1)], [C(0, 1), C(0)]], color: '#f59e0b' },
  Z: { name: 'Z', matrix: [[C(1), C(0)], [C(0), C(-1)]], color: '#3b82f6' },
  H: { name: 'H', matrix: [[C(SQRT2_INV), C(SQRT2_INV)], [C(SQRT2_INV), C(-SQRT2_INV)]], color: '#00f0ff' },
  S: { name: 'S', matrix: [[C(1), C(0)], [C(0), C(0, 1)]], color: '#10b981' },
  T: { name: 'T', matrix: [[C(1), C(0)], [C(0), Complex.polar(1, Math.PI / 4)]], color: '#8b5cf6' },
};

// ===== Apply a 2x2 gate to a 2-component state vector =====
export function applyGate(gate, state) {
  const [[a, b], [c, d]] = gate.matrix;
  return [
    a.mul(state[0]).add(b.mul(state[1])),
    c.mul(state[0]).add(d.mul(state[1]))
  ];
}

// ===== State from Bloch angles =====
export function stateFromAngles(theta, phi) {
  return [
    C(Math.cos(theta / 2)),
    Complex.polar(Math.sin(theta / 2), phi)
  ];
}

// ===== Bloch angles from state =====
export function anglesFromState(state) {
  const p0 = state[0].mag();
  const p1 = state[1].mag();
  const theta = 2 * Math.acos(Math.min(1, Math.max(0, p0)));
  // Remove global phase by making state[0] real and positive
  let phi = state[1].phase() - state[0].phase();
  if (phi < 0) phi += 2 * Math.PI;
  return { theta, phi };
}

// ===== Probabilities =====
export function probabilities(state) {
  return state.map(c => c.mag2());
}

// ===== Measure (collapse) =====
export function measure(state) {
  const [p0] = probabilities(state);
  return Math.random() < p0 ? 0 : 1;
}

// ===== Multi-qubit =====
export function tensorProduct(a, b) {
  const result = [];
  for (const ai of a) for (const bi of b) result.push(ai.mul(bi));
  return result;
}

// ===== Apply gate to specific qubit in multi-qubit state =====
export function applyGateToQubit(gate, state, qubitIndex, numQubits) {
  const dim = state.length;
  const newState = Array.from({ length: dim }, () => C(0));
  
  for (let i = 0; i < dim; i++) {
    const bit = (i >> (numQubits - 1 - qubitIndex)) & 1;
    for (let newBit = 0; newBit < 2; newBit++) {
      const j = i ^ ((bit ^ newBit) << (numQubits - 1 - qubitIndex));
      newState[j] = newState[j].add(gate.matrix[newBit][bit].mul(state[i]));
    }
  }
  return newState;
}

// ===== Apply CNOT (control, target) =====
export function applyCNOT(state, control, target, numQubits) {
  const dim = state.length;
  const newState = Array.from({ length: dim }, () => C(0));
  
  for (let i = 0; i < dim; i++) {
    const cBit = (i >> (numQubits - 1 - control)) & 1;
    if (cBit === 1) {
      const tBit = (i >> (numQubits - 1 - target)) & 1;
      const j = i ^ (1 << (numQubits - 1 - target));
      newState[j] = newState[j].add(state[i]);
    } else {
      newState[i] = newState[i].add(state[i]);
    }
  }
  return newState;
}

// ===== Measure multi-qubit =====
export function measureMulti(state) {
  const probs = state.map(c => c.mag2());
  let r = Math.random();
  for (let i = 0; i < probs.length; i++) {
    r -= probs[i];
    if (r <= 0) return i;
  }
  return probs.length - 1;
}

// ===== Bell states =====
export function bellState(type) {
  switch (type) {
    case 'Φ+': return [C(SQRT2_INV), C(0), C(0), C(SQRT2_INV)];
    case 'Φ-': return [C(SQRT2_INV), C(0), C(0), C(-SQRT2_INV)];
    case 'Ψ+': return [C(0), C(SQRT2_INV), C(SQRT2_INV), C(0)];
    case 'Ψ-': return [C(0), C(SQRT2_INV), C(-SQRT2_INV), C(0)];
    default: return [C(SQRT2_INV), C(0), C(0), C(SQRT2_INV)];
  }
}

// Format state nicely
export function formatState(state) {
  const a = state[0];
  const b = state[1];
  const aStr = formatComplex(a);
  const bStr = formatComplex(b);
  
  let result = '';
  if (a.mag() > 1e-6) result += `${aStr}|0⟩`;
  if (b.mag() > 1e-6) {
    if (result && b.re >= 0 && Math.abs(b.im) < 1e-6) result += ' + ';
    else if (result && b.re < 0 && Math.abs(b.im) < 1e-6) result += ' - ';
    else if (result) result += ' + ';
    
    if (b.re < 0 && Math.abs(b.im) < 1e-6) result += `${formatComplex(C(-b.re, -b.im))}|1⟩`;
    else result += `${bStr}|1⟩`;
  }
  return result || '0';
}

function formatComplex(c) {
  const mag = c.mag();
  if (mag < 1e-6) return '0';
  if (Math.abs(mag - 1) < 1e-4 && Math.abs(c.im) < 1e-6) return c.re > 0 ? '' : '-';
  if (Math.abs(c.im) < 1e-6) return c.re.toFixed(3);
  if (Math.abs(c.re) < 1e-6) return `${c.im.toFixed(3)}i`;
  return `(${c.toString(3)})`;
}
