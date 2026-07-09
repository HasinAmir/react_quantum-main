import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase.js';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [type, setType] = useState('question');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Title is required'); return; }
    if (!body.trim()) { setError('Body is required'); return; }
    if (title.trim().length < 5) { setError('Title must be at least 5 characters'); return; }
    if (body.trim().length < 10) { setError('Body must be at least 10 characters'); return; }

    setSubmitting(true);
    const { data, error: insertError } = await supabase
      .from('posts')
      .insert({ user_id: user.uid, type, title: title.trim(), body: body.trim() })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating post:', insertError);
      setError('Failed to create post. Please try again.');
      setSubmitting(false);
      return;
    }
    navigate(`/post/${data.id}`);
  }

  return (
    <div className="create-post">
      <div className="create-post__header">
        <h1 className="create-post__title">Create a Post</h1>
        <p className="create-post__subtitle">Share your question or opinion with the quantum computing community</p>
      </div>

      <form onSubmit={handleSubmit} className="create-post__form">
        <div className="create-post__type-selector">
          <label className="create-post__label">Post Type</label>
          <div className="create-post__type-options">
            <button type="button"
              className={`create-post__type-btn ${type === 'question' ? 'create-post__type-btn--active' : ''}`}
              onClick={() => setType('question')}>
              <span className="create-post__type-icon">❓</span>
              <div>
                <span className="create-post__type-name">Question</span>
                <span className="create-post__type-desc">Ask the community for help</span>
              </div>
            </button>
            <button type="button"
              className={`create-post__type-btn ${type === 'opinion' ? 'create-post__type-btn--active' : ''}`}
              onClick={() => setType('opinion')}>
              <span className="create-post__type-icon">💭</span>
              <div>
                <span className="create-post__type-name">Opinion</span>
                <span className="create-post__type-desc">Share your thoughts or insights</span>
              </div>
            </button>
          </div>
        </div>

        <div className="create-post__field">
          <label className="create-post__label" htmlFor="post-title">Title</label>
          <input id="post-title" type="text" className="create-post__input"
            placeholder={type === 'question' ? 'e.g. How does quantum teleportation work?' : 'e.g. Thoughts on topological qubits'}
            value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
          <span className="create-post__char-count">{title.length}/200</span>
        </div>

        <div className="create-post__field">
          <label className="create-post__label" htmlFor="post-body">Body</label>
          <textarea id="post-body" className="create-post__textarea"
            placeholder="Write your post in detail..."
            value={body} onChange={(e) => setBody(e.target.value)} rows={8} />
        </div>

        {error && (
          <div className="create-post__error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {error}
          </div>
        )}

        <div className="create-post__actions">
          <button type="button" className="forum-btn forum-btn--ghost" onClick={() => navigate('/')}>Cancel</button>
          <button type="submit" className="forum-btn forum-btn--primary" disabled={submitting}>
            {submitting ? (<><div className="forum-spinner forum-spinner--sm"></div>Publishing...</>) : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
