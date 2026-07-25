import React from 'react';
import { Link } from 'react-router-dom';
import VoteButtons from './VoteButtons.jsx';
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

export default function PostCard({ post }) {
  const author = post.users || {};
  const isQuestion = post.type === 'question';

  return (
    <article className="post-card">
      <div className="post-card__votes">
        <VoteButtons post={post} />
      </div>

      <div className="post-card__content">
        <div className="post-card__meta">
          <span className={`post-type-badge post-type-badge--${post.type}`}>
            {isQuestion ? '❓' : '💭'} {isQuestion ? 'Question' : 'Opinion'}
          </span>
          <span className="post-card__time">{timeAgo(post.created_at)}</span>
        </div>

        <Link to={`/post/${post.id}`} className="post-card__title-link">
          <h3 className="post-card__title">{post.title}</h3>
        </Link>

        <p className="post-card__body">{post.body.length > 200 ? post.body.slice(0, 200) + '…' : post.body}</p>

        {post.media && post.media.length > 0 && (
          <div className="post-detail__media-gallery" style={{ marginTop: '12px' }}>
            {post.media.map((item, idx) => (
              <div key={idx} className={`post-detail__media-item ${post.media.length === 1 ? 'post-detail__media-item--single' : ''}`}>
                {item.type === 'image' ? (
                  <img src={item.data} alt={item.name || 'Post attachment'} className="post-detail__media-img" loading="lazy" />
                ) : (
                  <video src={item.data} controls className="post-detail__media-video" preload="metadata">
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="post-card__footer">
          <Link to={`/user/${author.id}`} className="post-card__author" style={{ textDecoration: 'none' }}>
            {author.avatar ? (
              <img src={author.avatar} alt="" className="post-card__author-avatar" referrerPolicy="no-referrer" />
            ) : (
              <div className="post-card__author-avatar post-card__author-avatar--placeholder">
                {(author.name || '?')[0].toUpperCase()}
              </div>
            )}
            <span className="post-card__author-name">{author.name || 'Anonymous'}</span>
            {author.role === 'educator' && <EducatorBadge />}
          </Link>

          <Link to={`/post/${post.id}`} className="post-card__comments-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>{post.comment_count || 0} comments</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
