import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import PostFeed from './components/PostFeed.jsx';
import PostDetail from './components/PostDetail.jsx';
import CreatePost from './components/CreatePost.jsx';
import ProfileSetup from './components/ProfileSetup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="forum-app">
          <Navbar />
          <main className="forum-main">
            <div className="forum-container">
              <Routes>
                <Route path="/" element={<PostFeed />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <CreatePost />
                    </ProtectedRoute>
                  }
                />
                <Route path="/profile" element={<ProfileSetup />} />
              </Routes>
            </div>
          </main>

          {/* Footer */}
          <footer className="forum-footer">
            <div className="forum-footer__inner">
              <a href="/" className="forum-footer__brand">
                <span>⚛</span> QuantumSim
              </a>
              <p>Community Forum — Discuss quantum computing together</p>
              <p className="forum-footer__copy">© 2026 QuantumSim</p>
            </div>
          </footer>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}
