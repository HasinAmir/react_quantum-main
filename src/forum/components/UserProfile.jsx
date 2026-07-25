import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../config/supabase.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import PostCard from './PostCard.jsx';
import EducatorBadge from './EducatorBadge.jsx';

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

const EXPERIENCE_LABELS = {
  beginner: { label: 'Beginner', color: 'var(--f-green)' },
  intermediate: { label: 'Intermediate', color: 'var(--f-orange)' },
  researcher: { label: 'Researcher', color: 'var(--f-purple)' }
};

export default function UserProfile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = user && user.uid === userId;

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);

      // Fetch user profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      setProfileUser(userData || null);

      // Fetch user's posts (with user join for PostCard)
      const { data: userPosts } = await supabase
        .from('posts')
        .select('*, users(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Fetch comment counts for each post
      const { data: allComments } = await supabase.from('comments').select('post_id');
      const commentCounts = {};
      (allComments || []).forEach(c => {
        commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1;
      });

      const postsWithCounts = (userPosts || []).map(post => ({
        ...post,
        comment_count: commentCounts[post.id] || 0
      }));

      setPosts(postsWithCounts);
      setLoading(false);
    }

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="user-profile">
        <div className="user-profile__loading">
          <div className="user-profile__skeleton-avatar" />
          <div className="user-profile__skeleton-line" style={{ width: '180px', height: '24px' }} />
          <div className="user-profile__skeleton-line" style={{ width: '120px', height: '16px' }} />
          <div className="user-profile__skeleton-line" style={{ width: '260px', height: '14px' }} />
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="user-profile">
        <div className="user-profile__not-found">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--f-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2>User Not Found</h2>
          <p>This profile doesn't exist or has been removed.</p>
          <Link to="/" className="forum-btn forum-btn--outline">← Back to Feed</Link>
        </div>
      </div>
    );
  }

  const exp = EXPERIENCE_LABELS[profileUser.experience] || {};

  return (
    <div className="user-profile">
      {/* Profile Header Card */}
      <div className="user-profile__card">
        <div className="user-profile__header">
          <div className="user-profile__avatar-wrap">
            {profileUser.avatar ? (
              <img src={profileUser.avatar} alt="" className="user-profile__avatar" referrerPolicy="no-referrer" />
            ) : (
              <div className="user-profile__avatar user-profile__avatar--placeholder">
                {(profileUser.name || '?')[0].toUpperCase()}
              </div>
            )}
            {profileUser.role === 'educator' && (
              <div className="user-profile__badge-wrap">
                <EducatorBadge />
              </div>
            )}
          </div>

          <div className="user-profile__info">
            <h1 className="user-profile__name">
              {profileUser.name}
              {profileUser.role === 'educator' && (
                <span className="user-profile__role-tag user-profile__role-tag--educator">Educator</span>
              )}
              {profileUser.role === 'student' && (
                <span className="user-profile__role-tag user-profile__role-tag--student">Student</span>
              )}
            </h1>

            <div className="user-profile__meta">
              {profileUser.experience && (
                <span className="user-profile__meta-item" style={{ color: exp.color }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {exp.label}
                </span>
              )}
              {profileUser.email && (
                <span className="user-profile__meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                  {profileUser.email}
                </span>
              )}
              {profileUser.created_at && (
                <span className="user-profile__meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Joined {timeAgo(profileUser.created_at)}
                </span>
              )}
            </div>

            {profileUser.bio && (
              <p className="user-profile__bio">{profileUser.bio}</p>
            )}

            {isOwnProfile && (
              <Link to="/profile" className="forum-btn forum-btn--outline user-profile__edit-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="user-profile__stats">
          <div className="user-profile__stat">
            <span className="user-profile__stat-value">{posts.length}</span>
            <span className="user-profile__stat-label">Posts</span>
          </div>
          <div className="user-profile__stat">
            <span className="user-profile__stat-value">
              {posts.reduce((sum, p) => sum + (p.upvotes || 0), 0)}
            </span>
            <span className="user-profile__stat-label">Upvotes</span>
          </div>
          <div className="user-profile__stat">
            <span className="user-profile__stat-value">
              {posts.filter(p => p.type === 'question').length}
            </span>
            <span className="user-profile__stat-label">Questions</span>
          </div>
          <div className="user-profile__stat">
            <span className="user-profile__stat-value">
              {posts.filter(p => p.type === 'opinion').length}
            </span>
            <span className="user-profile__stat-label">Opinions</span>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <div className="user-profile__posts">
        <h2 className="user-profile__section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
          </svg>
          {isOwnProfile ? 'Your Posts' : `Posts by ${profileUser.name}`}
        </h2>

        {posts.length === 0 ? (
          <div className="user-profile__empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--f-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            <p>{isOwnProfile ? "You haven't posted anything yet." : "This user hasn't posted anything yet."}</p>
            {isOwnProfile && (
              <Link to="/create" className="forum-btn forum-btn--primary" style={{ marginTop: '8px' }}>
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="user-profile__posts-list">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
