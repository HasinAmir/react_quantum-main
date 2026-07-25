import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { supabase } from '../config/supabase.js';

export default function VoteButtons({ post, onVoteChange }) {
  const { user, isAuthenticated } = useAuth();
  const [currentVote, setCurrentVote] = useState(0);
  const [voteCount, setVoteCount] = useState(post.upvotes || 0);
  const [isVoting, setIsVoting] = useState(false);
  const votingRef = useRef(false);

  useEffect(() => {
    setVoteCount(Math.max(0, post.upvotes || 0));
  }, [post.upvotes]);

  useEffect(() => {
    if (!user) { setCurrentVote(0); return; }
    let isMounted = true;
    (async () => {
      const { data } = await supabase.from('votes').select('value')
        .eq('post_id', post.id).eq('user_id', user.uid).single();
      if (isMounted) {
        setCurrentVote(data ? data.value : 0);
      }
    })();
    return () => { isMounted = false; };
  }, [user, post.id]);

  // Recompute vote total from the votes table (source of truth), floored at 0
  async function recomputeVoteTotal() {
    const { data: allVotes } = await supabase.from('votes').select('value')
      .eq('post_id', post.id);
    const total = (allVotes || []).reduce((sum, v) => sum + v.value, 0);
    const flooredTotal = Math.max(0, total);
    await supabase.from('posts').update({ upvotes: flooredTotal }).eq('id', post.id);
    return flooredTotal;
  }

  async function handleVote(value) {
    // Double guard: both state and ref to prevent rapid clicks
    if (!isAuthenticated || isVoting || votingRef.current) return;
    setIsVoting(true);
    votingRef.current = true;

    const prevVote = currentVote;
    const newVote = currentVote === value ? 0 : value;
    const diff = newVote - prevVote;

    // Optimistic UI update (floored at 0)
    setCurrentVote(newVote);
    setVoteCount(prev => Math.max(0, prev + diff));

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
      // Recompute from source of truth — floored at 0
      const accurateTotal = await recomputeVoteTotal();
      setVoteCount(accurateTotal);
      if (onVoteChange) onVoteChange(accurateTotal);
    } catch (err) {
      // Rollback on failure
      setCurrentVote(prevVote);
      setVoteCount(prev => Math.max(0, prev - diff));
      console.error('Vote failed:', err);
    }
    setIsVoting(false);
    votingRef.current = false;
  }

  return (
    <div className="vote-buttons">
      <button className={`vote-btn vote-btn--up ${currentVote === 1 ? 'vote-btn--active' : ''}`}
        onClick={() => handleVote(1)} disabled={!isAuthenticated || isVoting}
        title={isAuthenticated ? 'Upvote' : 'Sign in to vote'} aria-label="Upvote">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
      </button>
      <span className={`vote-count ${voteCount > 0 ? 'vote-count--positive' : ''}`}>
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
