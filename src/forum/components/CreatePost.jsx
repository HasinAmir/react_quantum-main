import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [type, setType] = useState('question');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [media, setMedia] = useState([]); // { name, type, data (base64), preview }
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  async function processFiles(files) {
    const fileList = Array.from(files);
    const remaining = MAX_FILES - media.length;
    if (remaining <= 0) {
      setError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }
    const toProcess = fileList.slice(0, remaining);
    const newMedia = [];

    for (const file of toProcess) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setError('Only image and video files are allowed');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" exceeds 5 MB limit`);
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        newMedia.push({
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          data: base64,
        });
      } catch {
        setError(`Failed to process "${file.name}"`);
        return;
      }
    }

    setError('');
    setMedia(prev => [...prev, ...newMedia]);
  }

  function handleFileSelect(e) {
    if (e.target.files) processFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  }

  function removeMedia(index) {
    setMedia(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!title.trim()) { setError('Title is required'); return; }
    if (!body.trim()) { setError('Body is required'); return; }
    if (title.trim().length < 5) { setError('Title must be at least 5 characters'); return; }
    if (body.trim().length < 10) { setError('Body must be at least 10 characters'); return; }

    setSubmitting(true);
    const postData = {
      user_id: user.uid,
      type,
      title: title.trim(),
      body: body.trim(),
    };
    // Only include media if there are attachments
    if (media.length > 0) {
      postData.media = media.map(m => ({ name: m.name, type: m.type, data: m.data }));
    }

    const { data, error: insertError } = await supabase
      .from('posts')
      .insert(postData)
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

        {/* Media Upload Zone */}
        <div className="create-post__field">
          <label className="create-post__label">
            Attachments <span className="profile-setup__optional">(optional · max {MAX_FILES} files, 5 MB each)</span>
          </label>
          <div
            className={`media-dropzone ${dragActive ? 'media-dropzone--active' : ''} ${media.length >= MAX_FILES ? 'media-dropzone--disabled' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => media.length < MAX_FILES && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="media-dropzone__input"
            />
            <div className="media-dropzone__content">
              <svg className="media-dropzone__icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p className="media-dropzone__text">
                {media.length >= MAX_FILES
                  ? 'Maximum files reached'
                  : 'Drag & drop photos or videos here, or click to browse'}
              </p>
              <span className="media-dropzone__hint">
                {media.length}/{MAX_FILES} files
              </span>
            </div>
          </div>

          {/* Media Previews */}
          {media.length > 0 && (
            <div className="media-preview-grid">
              {media.map((item, idx) => (
                <div key={idx} className="media-preview-item">
                  {item.type === 'image' ? (
                    <img src={item.data} alt={item.name} className="media-preview-item__img" />
                  ) : (
                    <video src={item.data} className="media-preview-item__video" muted />
                  )}
                  <div className="media-preview-item__overlay">
                    <span className="media-preview-item__name">{item.name}</span>
                    <button
                      type="button"
                      className="media-preview-item__remove"
                      onClick={(e) => { e.stopPropagation(); removeMedia(idx); }}
                      title="Remove"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                  {item.type === 'video' && (
                    <div className="media-preview-item__badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      Video
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
