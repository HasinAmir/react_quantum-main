import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../config/supabase.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import PostCard from './PostCard.jsx';

export default function PostFeed() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'question', 'opinion'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  async function fetchPosts() {
    setLoading(true);

    let query = supabase
      .from('posts')
      .select(`
        *,
        users (*),
        comments (id)
      `)
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('type', filter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } else {
      // Add comment count
      const postsWithCount = (data || []).map(p => ({
        ...p,
        comment_count: p.comments ? p.comments.length : 0,
      }));
      setPosts(postsWithCount);
    }

    setLoading(false);
  }

  const filterOptions = [
    { key: 'all', label: 'All Posts', icon: '📋' },
    { key: 'question', label: 'Questions', icon: '❓' },
    { key: 'opinion', label: 'Opinions', icon: '💭' },
  ];

  return (
    <div className="post-feed">
      {/* Header */}
      <div className="post-feed__header">
        <div className="post-feed__header-text">
          <h1 className="post-feed__title">Community Forum</h1>
          <p className="post-feed__subtitle">Ask questions, share insights, and discuss quantum computing</p>
        </div>
        {isAuthenticated && (
          <Link to="/create" className="forum-btn forum-btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Post
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="post-feed__filters">
        {filterOptions.map(opt => (
          <button
            key={opt.key}
            className={`filter-tab ${filter === opt.key ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter(opt.key)}
          >
            <span className="filter-tab__icon">{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="post-feed__list">
        {loading ? (
          <div className="forum-loading">
            <div className="forum-spinner"></div>
            <p>Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="post-feed__empty">
            <div className="post-feed__empty-icon">
              {filter === 'question' ? '❓' : filter === 'opinion' ? '💭' : '📭'}
            </div>
            <h3>No {filter === 'all' ? '' : filter} posts yet</h3>
            <p>Be the first to start a discussion!</p>
            {isAuthenticated && (
              <Link to="/create" className="forum-btn forum-btn--primary" style={{ marginTop: '16px' }}>
                Create Post
              </Link>
            )}
          </div>
        ) : (
          posts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
