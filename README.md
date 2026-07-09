<p align="center">
  <img src="public/favicon.svg" alt="QuantumSim Logo" width="80" />
</p>

<h1 align="center">⚛ QuantumSim</h1>

<p align="center">
  <strong>An interactive visual journey through the foundations of quantum computing.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Vanilla_JS-ES2024-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/License-MIT-22D3EE" alt="License" />
</p>

---

## ✨ Overview

**QuantumSim** is a sleek, single-page educational platform that lets you explore core quantum computing concepts through real-time interactive simulations — no frameworks, no dependencies, just pure JavaScript and an HTML5 Canvas.

Whether you're a student, an educator, or simply curious, QuantumSim makes abstract quantum phenomena *tangible* by letting you tweak values, apply gates, and watch the math come alive.

---

## 🚀 Features

| # | Module | What It Does |
|---|--------|-------------|
| 01 | **Bloch Sphere** | Visualize any single-qubit state on a 3D Bloch sphere. Adjust θ and φ angles to see how the state vector moves in real time. |
| 02 | **Quantum Gates** | Apply quantum gates (X, Y, Z, H, S, T) to a qubit and watch its state transform. Chain multiple gates to build complex operations. |
| 03 | **Superposition & Measurement** | Adjust superposition amplitudes with a slider, then run repeated measurements to see probability distributions emerge from quantum randomness. |
| 04 | **Entanglement** | Create entangled Bell pairs and observe correlated measurement outcomes — measuring one qubit instantly determines the other. |
| 05 | **Circuit Builder** | Drag-and-drop quantum gates onto qubit wires to construct your own quantum circuit, then simulate it and view output probabilities. |

---

## 🛠️ Tech Stack

- **Build Tool** — [Vite](https://vitejs.dev/) 5.4 for blazing-fast HMR & builds
- **Language** — Vanilla JavaScript (ES Modules)
- **Rendering** — HTML5 Canvas for all visualizations
- **Styling** — Pure CSS with custom properties, glassmorphism effects, and smooth animations
- **Typography** — [Inter](https://fonts.google.com/specimen/Inter), [Outfit](https://fonts.google.com/specimen/Outfit), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts
- **Math Engine** — Custom `quantumMath.js` utility for complex-number arithmetic, gate matrices, and state-vector operations

---

## 📁 Project Structure

```
react_quantum/
├── index.html                  # Main entry — all sections & layout
├── vite.config.js              # Vite configuration
├── package.json
├── public/
│   └── favicon.svg             # Atom-style favicon
└── src/
    ├── main.js                 # App bootstrap & section initialization
    ├── components/
    │   ├── hero.js             # Animated particle-network hero
    │   ├── blochSphere.js      # 3D Bloch sphere visualization
    │   ├── gatesSimulator.js   # Quantum gate controls & state display
    │   ├── superposition.js    # Superposition slider & measurement sim
    │   ├── entanglement.js     # Entanglement demo with Bell states
    │   └── circuitBuilder.js   # Drag-and-drop circuit construction
    ├── styles/
    │   └── index.css           # Global styles, design tokens & animations
    └── utils/
        ├── quantumMath.js      # Complex math, gate matrices, state algebra
        └── canvasHelpers.js    # Canvas drawing utilities
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/react_quantum.git
cd react_quantum

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## 🎨 Screenshots

<p align="center">
  <em>Dark-themed landing page with animated particle network background and cyan-to-purple gradient typography.</em>
</p>

---

## 📚 Learn More

Quantum computing resources to deepen your understanding:

- [Qiskit Textbook](https://qiskit.org/learn) — IBM's open-source quantum computing textbook
- [Quantum Country](https://quantum.country/) — An interactive essay-based introduction
- [Wikipedia: Quantum Computing](https://en.wikipedia.org/wiki/Quantum_computing) — Comprehensive overview

---

## 📄 License

This project is released under the [MIT License](LICENSE).

---

<p align="center">
  Made with 💜 for quantum education
</p>
