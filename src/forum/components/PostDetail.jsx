import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import VoteButtons from './VoteButtons.jsx';
import Comment from './Comment.jsx';
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

function buildCommentTree(flatComments) {
  const commentMap = {};
  const rootComments = [];

  flatComments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  flatComments.forEach(comment => {
    if (comment.parent_id) {
      if (commentMap[comment.parent_id]) {
         commentMap[comment.parent_id].replies.push(commentMap[comment.id]);
      }
    } else {
      rootComments.push(commentMap[comment.id]);
    }
  });

  return rootComments;
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  async function fetchPost() {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*, users (*)')
      .eq('id', id)
      .single();
    if (error) { console.error('Error fetching post:', error); setPost(null); }
    else { setPost(data); }
    setLoading(false);
  }

  async function fetchComments() {
    try {
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*, users (*)')
        .eq('post_id', id)
        .order('is_best_answer', { ascending: false })
        .order('created_at', { ascending: true });
      
      if (error) { 
        console.error('Error fetching comments:', error); 
      }
      
      setComments(commentsData || []);

      // Fetch reactions separately so a failure here doesn't block comments
      try {
        const { data: reactionsData } = await supabase.from('comment_reactions').select('*');
        setReactions(reactionsData || []);
      } catch (reactionsErr) {
        console.error('Error fetching reactions:', reactionsErr);
      }
    } catch (err) {
      console.error('Error in fetchComments:', err);
      setComments([]);
    }
  }

  async function handleSubmitComment(e) {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated || submitting) return;
    setSubmitting(true);
    const { error } = await supabase.from('comments').insert({
      post_id: id, user_id: user.uid, body: newComment.trim(),
    });
    if (error) { console.error('Error posting comment:', error); }
    else { setNewComment(''); await fetchComments(); }
    setSubmitting(false);
  }

  async function handleMarkBestAnswer(commentId) {
    await supabase.from('comments').update({ is_best_answer: false })
      .eq('post_id', id).eq('is_best_answer', true);
    const { error } = await supabase.from('comments')
      .update({ is_best_answer: true }).eq('id', commentId);
    if (error) { console.error('Error marking best answer:', error); }
    else { await fetchComments(); }
  }

  async function handleReply(parentId, text) {
    if (!text.trim() || !isAuthenticated) return;
    const { error } = await supabase.from('comments').insert({
      post_id: id, user_id: user.uid, body: text.trim(), parent_id: parentId
    });
    if (error) { console.error('Error posting reply:', error); }
    else { await fetchComments(); }
  }

  async function handleReact(commentId, reactionType) {
    if (!isAuthenticated) return;
    
    const existingReaction = reactions.find(r => r.comment_id === commentId && r.user_id === user.uid && r.type === reactionType);
    
    if (existingReaction) {
      await supabase.from('comment_reactions').delete().eq('id', existingReaction.id);
    } else {
      await supabase.from('comment_reactions').insert({
        comment_id: commentId, user_id: user.uid, type: reactionType
      });
    }
    
    const { data: reactionsData } = await supabase.from('comment_reactions').select('*');
    setReactions(reactionsData || []);
  }

  if (loading) {
    return (<div className="forum-loading"><div className="forum-spinner"></div><p>Loading post...</p></div>);
  }
  if (!post) {
    return (
      <div className="post-detail__not-found">
        <h2>Post not found</h2>
        <p>This post may have been deleted or doesn't exist.</p>
        <Link to="/" className="forum-btn forum-btn--primary">Back to Feed</Link>
      </div>
    );
  }

  const author = post.users || {};
  const isQuestion = post.type === 'question';

  return (
    <div className="post-detail">
      <button onClick={() => navigate('/')} className="post-detail__back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Back to Feed
      </button>

      <article className="post-detail__post">
        <div className="post-detail__votes"><VoteButtons post={post} /></div>
        <div className="post-detail__content">
          <div className="post-detail__meta">
            <span className={`post-type-badge post-type-badge--${post.type}`}>
              {isQuestion ? '❓' : '💭'} {isQuestion ? 'Question' : 'Opinion'}
            </span>
            <span className="post-detail__time">{timeAgo(post.created_at)}</span>
          </div>
          <h1 className="post-detail__title">{post.title}</h1>
          <div className="post-detail__body">{post.body}</div>
          {post.media && post.media.length > 0 && (
            <div className="post-detail__media-gallery">
              {post.media.map((item, idx) => (
                <div key={idx} className={`post-detail__media-item ${post.media.length === 1 ? 'post-detail__media-item--single' : ''}`}>
                  {item.type === 'image' ? (
                    <img src={item.data} alt={item.name || 'Post image'} className="post-detail__media-img" loading="lazy" />
                  ) : (
                    <video src={item.data} controls className="post-detail__media-video" preload="metadata">
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="post-detail__author">
            {author.avatar ? (
              <img src={author.avatar} alt="" className="post-detail__author-avatar" referrerPolicy="no-referrer" />
            ) : (
              <div className="post-detail__author-avatar post-detail__author-avatar--placeholder">
                {(author.name || '?')[0].toUpperCase()}
              </div>
            )}
            <div className="post-detail__author-info">
              <div className="post-detail__author-name-row">
                <span className="post-detail__author-name">{author.name || 'Anonymous'}</span>
                {author.role === 'educator' && <EducatorBadge />}
              </div>
              <span className="post-detail__author-exp">
                {author.experience && `${author.experience.charAt(0).toUpperCase() + author.experience.slice(1)}`}
                {author.role && ` · ${author.role.charAt(0).toUpperCase() + author.role.slice(1)}`}
              </span>
            </div>
          </div>
        </div>
      </article>

      <section className="post-detail__comments-section">
        <h2 className="post-detail__comments-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h2>

        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="comment-form">
            <div className="comment-form__input-row">
              {(profile?.avatar || user.photoURL) ? (
                <img src={profile?.avatar || user.photoURL} alt="" className="comment-form__avatar" referrerPolicy="no-referrer" />
              ) : (
                <div className="comment-form__avatar comment-form__avatar--placeholder">
                  {(profile?.name || '?')[0].toUpperCase()}
                </div>
              )}
              <textarea className="comment-form__textarea" placeholder="Write a comment..."
                value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={3} />
            </div>
            <div className="comment-form__actions">
              <button type="submit" className="forum-btn forum-btn--primary forum-btn--sm"
                disabled={!newComment.trim() || submitting}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="comment-form__signin-prompt"><p>Sign in with Google to join the discussion.</p></div>
        )}

        <div className="post-detail__comments-list">
          {comments.length === 0 ? (
            <div className="post-detail__no-comments"><p>No comments yet. Be the first to respond!</p></div>
          ) : (
            buildCommentTree(comments).map(c => (
              <Comment key={c.id} comment={c} postType={post.type}
                postAuthorId={post.user_id} currentUser={profile || user}
                onMarkBestAnswer={handleMarkBestAnswer}
                allReactions={reactions}
                onReply={handleReply}
                onReact={handleReact} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
