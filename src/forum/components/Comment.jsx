import React from 'react';
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
  return `${Math.floor(days / 30)}mo ago`;
}

export default function Comment({ comment, postType, postAuthorId, currentUser, onMarkBestAnswer }) {
  const author = comment.users || {};
  const canMarkBest = postType === 'question'
    && currentUser
    && (currentUser.role === 'educator' || currentUser.id === postAuthorId)
    && !comment.is_best_answer;

  return (
    <div className={`comment ${comment.is_best_answer ? 'comment--best-answer' : ''}`}>
      {comment.is_best_answer && (
        <div className="comment__best-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Best Answer
        </div>
      )}
      <div className="comment__header">
        <div className="comment__author">
          {author.avatar ? (
            <img src={author.avatar} alt="" className="comment__avatar" referrerPolicy="no-referrer" />
          ) : (
            <div className="comment__avatar comment__avatar--placeholder">
              {(author.name || '?')[0].toUpperCase()}
            </div>
          )}
          <span className="comment__author-name">{author.name || 'Anonymous'}</span>
          {author.role === 'educator' && <EducatorBadge />}
          <span className="comment__time">{timeAgo(comment.created_at)}</span>
        </div>
        {canMarkBest && (
          <button className="comment__mark-best" onClick={() => onMarkBestAnswer(comment.id)} title="Mark as Best Answer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Mark Best
          </button>
        )}
      </div>
      <p className="comment__body">{comment.body}</p>
    </div>
  );
}
