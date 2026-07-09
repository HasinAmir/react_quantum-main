import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { supabase } from '../config/supabase.js';

export default function VoteButtons({ post, onVoteChange }) {
  const { user, isAuthenticated } = useAuth();
  const [currentVote, setCurrentVote] = useState(0);
  const [voteCount, setVoteCount] = useState(post.upvotes || 0);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    if (!user) { setCurrentVote(0); return; }
    (async () => {
      const { data } = await supabase.from('votes').select('value')
        .eq('post_id', post.id).eq('user_id', user.uid).single();
      if (data) setCurrentVote(data.value);
    })();
  }, [user, post.id]);

  async function handleVote(value) {
    if (!isAuthenticated || isVoting) return;
    setIsVoting(true);
    const prevVote = currentVote;
    const newVote = currentVote === value ? 0 : value;
    const diff = newVote - prevVote;
    setCurrentVote(newVote);
    setVoteCount(prev => prev + diff);

    try {
      if (newVote === 0) {
        await supabase.from('votes').delete()
          .eq('post_id', post.id).eq('user_id', user.uid);
      } else {
        await supabase.from('votes').upsert(
          { post_id: post.id, user_id: user.uid, value: newVote },
          { onConflict: 'post_id,user_id' }
        );
      }
      await supabase.from('posts').update({ upvotes: voteCount + diff }).eq('id', post.id);
      if (onVoteChange) onVoteChange(voteCount + diff);
    } catch (err) {
      setCurrentVote(prevVote);
      setVoteCount(prev => prev - diff);
      console.error('Vote failed:', err);
    }
    setIsVoting(false);
  }

  return (
    <div className="vote-buttons">
      <button className={`vote-btn vote-btn--up ${currentVote === 1 ? 'vote-btn--active' : ''}`}
        onClick={() => handleVote(1)} disabled={!isAuthenticated || isVoting}
        title={isAuthenticated ? 'Upvote' : 'Sign in to vote'} aria-label="Upvote">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
      </button>
      <span className={`vote-count ${voteCount > 0 ? 'vote-count--positive' : voteCount < 0 ? 'vote-count--negative' : ''}`}>
        {voteCount}
      </span>
      <button className={`vote-btn vote-btn--down ${currentVote === -1 ? 'vote-btn--active' : ''}`}
        onClick={() => handleVote(-1)} disabled={!isAuthenticated || isVoting}
        title={isAuthenticated ? 'Downvote' : 'Sign in to vote'} aria-label="Downvote">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
    </div>
  );
}
