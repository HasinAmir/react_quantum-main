import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

// Resize image to max dimensions and return base64 data URL
function resizeImage(file, maxSize = 200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
        } else {
          if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user, profile, saveProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(profile?.name || user?.displayName || '');
  const [role, setRole] = useState(profile?.role || 'student');
  const [experience, setExperience] = useState(profile?.experience || 'beginner');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar || user?.photoURL || '');
  const [avatarData, setAvatarData] = useState(profile?.avatar || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!profile;

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB');
      return;
    }
    try {
      setError('');
      const base64 = await resizeImage(file, 200);
      setAvatarPreview(base64);
      setAvatarData(base64);
    } catch {
      setError('Failed to process image');
    }
  }

  function handleRemoveAvatar() {
    setAvatarPreview('');
    setAvatarData('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Name is required'); return; }
    if (name.trim().length < 2) { setError('Name must be at least 2 characters'); return; }

    setSubmitting(true);
    const result = await saveProfile({
      name: name.trim(),
      role,
      experience,
      bio: bio.trim(),
      avatar: avatarData || '',
    });
    if (!result) {
      setError('Failed to save profile. Please try again.');
      setSubmitting(false);
      return;
    }
    navigate('/');
  }

  const experienceLevels = [
    { key: 'beginner', label: 'Beginner', desc: 'Just starting to learn quantum computing', icon: '🌱' },
    { key: 'intermediate', label: 'Intermediate', desc: 'Familiar with core concepts and algorithms', icon: '⚡' },
    { key: 'researcher', label: 'Researcher', desc: 'Active research or professional experience', icon: '🔬' },
  ];

  const roles = [
    { key: 'student', label: 'Student', desc: "I'm here to learn and ask questions", icon: '📚' },
    { key: 'educator', label: 'Educator', desc: 'I teach or mentor in quantum computing', icon: '🎓' },
  ];

  return (
    <div className="profile-setup">
      <div className="profile-setup__header">
        <div className="profile-setup__avatar-section">
          <div className="profile-setup__avatar-upload" onClick={() => fileInputRef.current?.click()}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="" className="profile-setup__avatar" referrerPolicy="no-referrer" />
            ) : (
              <div className="profile-setup__avatar profile-setup__avatar--placeholder">
                {(name || '?')[0].toUpperCase()}
              </div>
            )}
            <div className="profile-setup__avatar-overlay">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="profile-setup__avatar-file-input"
            />
          </div>
          {avatarPreview && (
            <button type="button" className="profile-setup__avatar-remove" onClick={handleRemoveAvatar} title="Remove photo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
          <div>
            <h1 className="profile-setup__title">
              {isEditing ? 'Edit Your Profile' : 'Welcome to the Forum!'}
            </h1>
            <p className="profile-setup__subtitle">
              {isEditing ? 'Update your profile information' : 'Set up your profile to start participating in discussions'}
            </p>
            <p className="profile-setup__avatar-hint">Click the avatar to upload a photo <span className="profile-setup__optional">(optional)</span></p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-setup__form">
        <div className="profile-setup__field">
          <label className="profile-setup__label" htmlFor="profile-name">Display Name</label>
          <input id="profile-name" type="text" className="create-post__input"
            placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={50} />
        </div>

        <div className="profile-setup__field">
          <label className="profile-setup__label">Your Role</label>
          <div className="profile-setup__options">
            {roles.map(r => (
              <button key={r.key} type="button"
                className={`profile-setup__option ${role === r.key ? 'profile-setup__option--active' : ''}`}
                onClick={() => setRole(r.key)}>
                <span className="profile-setup__option-icon">{r.icon}</span>
                <div>
                  <span className="profile-setup__option-name">{r.label}</span>
                  <span className="profile-setup__option-desc">{r.desc}</span>
                </div>
                {role === r.key && (
                  <svg className="profile-setup__check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="profile-setup__field">
          <label className="profile-setup__label">Experience Level</label>
          <div className="profile-setup__options">
            {experienceLevels.map(exp => (
              <button key={exp.key} type="button"
                className={`profile-setup__option ${experience === exp.key ? 'profile-setup__option--active' : ''}`}
                onClick={() => setExperience(exp.key)}>
                <span className="profile-setup__option-icon">{exp.icon}</span>
                <div>
                  <span className="profile-setup__option-name">{exp.label}</span>
                  <span className="profile-setup__option-desc">{exp.desc}</span>
                </div>
                {experience === exp.key && (
                  <svg className="profile-setup__check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="profile-setup__field">
          <label className="profile-setup__label" htmlFor="profile-bio">
            Bio <span className="profile-setup__optional">(optional)</span>
          </label>
          <textarea id="profile-bio" className="create-post__textarea"
            placeholder="Tell us about your quantum computing background..."
            value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
        </div>

        {error && (
          <div className="create-post__error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {error}
          </div>
        )}

        <div className="create-post__actions">
          {isEditing && (
            <button type="button" className="forum-btn forum-btn--ghost" onClick={() => navigate('/')}>Cancel</button>
          )}
          <button type="submit" className="forum-btn forum-btn--primary" disabled={submitting}>
            {submitting ? (<><div className="forum-spinner forum-spinner--sm"></div>Saving...</>) : (isEditing ? 'Save Changes' : 'Complete Setup')}
          </button>
        </div>
      </form>
    </div>
  );
}
