import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, hasProfile } = useAuth();

  if (loading) {
    return (
      <div className="forum-loading">
        <div className="forum-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="forum-auth-prompt">
        <div className="auth-prompt-card">
          <div className="auth-prompt-icon">🔒</div>
          <h2>Sign In Required</h2>
          <p>You need to sign in with Google to access this page.</p>
          <a href="/forum.html" className="forum-btn forum-btn--primary">
            Go to Forum Home
          </a>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
