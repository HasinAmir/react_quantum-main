import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Navbar() {
  const { user, profile, isAuthenticated, signIn, signOut, loading } = useAuth();
  const location = useLocation();

  function isActive(path) {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  return (
    <nav className="forum-navbar">
      <div className="forum-navbar__inner">
        {/* Brand */}
        <div className="forum-navbar__brand">
          <a href="/" className="forum-navbar__home-link" title="Back to QuantumSim">
            <span className="forum-navbar__logo">⚛</span>
            <span className="forum-navbar__title">QuantumSim</span>
          </a>
          <span className="forum-navbar__separator">/</span>
          <Link to="/" className="forum-navbar__forum-label">Forum</Link>
        </div>

        {/* Nav Links */}
        <div className="forum-navbar__links">
          <Link
            to="/"
            className={`forum-navbar__link ${isActive('/') && location.pathname === '/' ? 'forum-navbar__link--active' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Feed
          </Link>
          {isAuthenticated && (
            <Link
              to="/create"
              className={`forum-navbar__link ${isActive('/create') ? 'forum-navbar__link--active' : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Post
            </Link>
          )}
        </div>

        {/* Auth Section */}
        <div className="forum-navbar__auth">
          {loading ? (
            <div className="forum-navbar__skeleton"></div>
          ) : isAuthenticated ? (
            <div className="forum-navbar__user">
              <Link to="/profile" className="forum-navbar__avatar-link" title="Profile Settings">
                {(profile?.avatar || user.photoURL) ? (
                  <img src={profile?.avatar || user.photoURL} alt="" className="forum-navbar__avatar" referrerPolicy="no-referrer" />
                ) : (
                  <div className="forum-navbar__avatar forum-navbar__avatar--placeholder">
                    {(profile?.name || user.displayName || '?')[0].toUpperCase()}
                  </div>
                )}
              </Link>
              <span className="forum-navbar__username">{profile?.name || user.displayName}</span>
              <button onClick={signOut} className="forum-btn forum-btn--ghost forum-btn--sm" title="Sign Out">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          ) : (
            <button onClick={signIn} className="forum-btn forum-btn--primary forum-btn--sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
