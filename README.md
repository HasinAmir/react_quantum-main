<p align="center">
  <img src="public/favicon.svg" alt="QuantumSim Logo" width="80" />
</p>

<h1 align="center">⚛ QuantumSim & Community Forum</h1>

<p align="center">
  <strong>An interactive visual journey through the foundations of quantum computing, with a built-in community forum for discussion and Q&A.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/License-MIT-22D3EE" alt="License" />
</p>

---

## ✨ Overview

**QuantumSim** is a sleek educational platform that lets you explore core quantum computing concepts through real-time interactive simulations. 

It now includes the **Quantum Community Forum**, a React-based platform where users can log in via Google, ask questions, share insights, upload media attachments, and discuss quantum mechanics together in real-time.

---

## 🚀 Features

### Quantum Simulations (Vanilla JS & Canvas)
| # | Module | What It Does |
|---|--------|-------------|
| 01 | **Bloch Sphere** | Visualize any single-qubit state on a 3D Bloch sphere with fluid animations and vector trails. |
| 02 | **Quantum Gates** | Apply quantum gates (X, Y, Z, H, S, T) to a qubit and watch its state transform seamlessly. |
| 03 | **Superposition** | Adjust superposition amplitudes with a slider and run repeated measurements to see probability distributions. |
| 04 | **Entanglement** | Create entangled Bell pairs and observe correlated measurement outcomes with glowing visual connections. |
| 05 | **Circuit Builder** | Drag-and-drop quantum gates onto qubit wires to construct your own quantum circuit. |

### Community Forum (React)
| # | Feature | What It Does |
|---|---------|-------------|
| 01 | **User Profiles & Auth** | Google Authentication via Firebase. Set up your public profile, bio, and experience level. |
| 02 | **Rich Discussions** | Create posts, categorize by tags (Theory, Algorithms, Hardware), and upload images/videos. |
| 03 | **Q&A System** | Upvote/downvote posts, react to comments, and mark specific replies as the "Best Answer". |

---

## 🛠️ Tech Stack

- **Frontend Build Tool** — [Vite](https://vitejs.dev/) 5.4
- **Core Simulators** — Vanilla JavaScript & HTML5 Canvas
- **Forum UI** — React 18 & React Router
- **Authentication** — [Firebase Auth](https://firebase.google.com/products/auth) (Google Provider)
- **Database** — [Supabase](https://supabase.com/) (PostgreSQL for users, posts, comments, and votes)
- **Styling** — Pure CSS with custom properties, glassmorphism, and responsive layouts
- **Math Engine** — Custom `quantumMath.js` for complex-number arithmetic and gate matrices

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- A [Firebase Project](https://console.firebase.google.com/) (for Google Authentication)
- A [Supabase Project](https://supabase.com/) (for the PostgreSQL database)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/react_quantum.git
cd react_quantum
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Environment Variables**
Create a `.env.local` file in the root directory and add your Firebase and Supabase credentials:

```env
# Firebase Auth
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"

# Supabase Database
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

4. **Initialize Supabase Schema**
Execute the SQL script located at `src/forum/sql/schema.sql` inside your Supabase project's SQL Editor to create the necessary tables (`users`, `posts`, `comments`, etc.).

5. **Start the dev server**
```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## 📄 License

This project is released under the [MIT License](LICENSE).

---

<p align="center">
  Made with 💜 for quantum education
</p>
