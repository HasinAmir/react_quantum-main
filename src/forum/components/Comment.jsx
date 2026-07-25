import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

export default function Comment({ 
  comment, 
  postType, 
  postAuthorId, 
  currentUser, 
  onMarkBestAnswer, 
  allReactions = [], 
  onReply, 
  onReact 
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const author = comment.users || {};
  const currentUserId = currentUser ? (currentUser.id || currentUser.uid) : null;
  
  const canMarkBest = postType === 'question'
    && currentUser
    && (currentUser.role === 'educator' || currentUserId === postAuthorId)
    && !comment.is_best_answer;

  const myReactions = allReactions.filter(r => r.comment_id === comment.id);
  const reactionTypes = ['👍', '❤️', '🚀', '😄'];
  
  const reactionCounts = {};
  const userReacted = {};
  
  reactionTypes.forEach(t => {
    reactionCounts[t] = 0;
    userReacted[t] = false;
  });

  myReactions.forEach(r => {
    if (reactionCounts[r.type] !== undefined) {
      reactionCounts[r.type]++;
      if (currentUserId && r.user_id === currentUserId) {
        userReacted[r.type] = true;
      }
    }
  });

  function handleSubmitReply(e) {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (onReply) {
      onReply(comment.id, replyText);
      setReplyText('');
      setIsReplying(false);
    }
  }

  return (
    <div className={`comment-wrapper ${comment.parent_id ? 'comment-wrapper--reply' : ''}`}>
      <div className={`comment ${comment.is_best_answer ? 'comment--best-answer' : ''}`}>
        {comment.is_best_answer && (
          <div className="comment__best-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Best Answer
          </div>
        )}
        <div className="comment__header">
          <Link to={`/user/${author.id}`} className="comment__author" style={{ textDecoration: 'none' }}>
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
          </Link>
          {canMarkBest && (
            <button className="comment__mark-best" onClick={() => onMarkBestAnswer(comment.id)} title="Mark as Best Answer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Mark Best
            </button>
          )}
        </div>
        <p className="comment__body">{comment.body}</p>
        
        <div className="comment__actions">
          <div className="comment__reactions">
            {reactionTypes.map(type => (
              <button 
                key={type} 
                className={`reaction-btn ${userReacted[type] ? 'reaction-btn--active' : ''}`}
                onClick={() => onReact && onReact(comment.id, type)}
                title={currentUser ? "React" : "Sign in to react"}
                disabled={!currentUser}
              >
                <span className="reaction-btn__emoji">{type}</span>
                {reactionCounts[type] > 0 && <span className="reaction-btn__count">{reactionCounts[type]}</span>}
              </button>
            ))}
          </div>
          <button 
            className="comment__reply-btn" 
            onClick={() => setIsReplying(!isReplying)}
            disabled={!currentUser}
            title={currentUser ? "Reply to this comment" : "Sign in to reply"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg>
            Reply
          </button>
        </div>
        
        {isReplying && (
          <form className="comment__reply-form" onSubmit={handleSubmitReply}>
            <textarea 
              className="comment__reply-input" 
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              autoFocus
            />
            <div className="comment__reply-form-actions">
              <button type="button" className="forum-btn forum-btn--ghost forum-btn--sm" onClick={() => setIsReplying(false)}>Cancel</button>
              <button type="submit" className="forum-btn forum-btn--primary forum-btn--sm" disabled={!replyText.trim()}>Reply</button>
            </div>
          </form>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="comment__replies-container">
          {comment.replies.map(reply => (
            <Comment 
              key={reply.id} 
              comment={reply} 
              postType={postType}
              postAuthorId={postAuthorId} 
              currentUser={currentUser}
              onMarkBestAnswer={onMarkBestAnswer}
              allReactions={allReactions}
              onReply={onReply}
              onReact={onReact}
            />
          ))}
        </div>
      )}
    </div>
  );
}
