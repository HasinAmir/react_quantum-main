import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signOut } from '../config/firebase.js';
import { supabase } from '../config/supabase.js';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);        // Firebase user
  const [profile, setProfile] = useState(null);   // Supabase profile
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Initialize mock auth state from localStorage
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('mock_auth_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        await fetchProfile(parsedUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Fetch user profile from Supabase
  async function fetchProfile(uid) {
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      setProfile(data || null);
    } catch (err) {
      console.error('Profile fetch failed:', err);
      setProfile(null);
    }
    setProfileLoading(false);
  }

  // Sign in with Google (Mocked)
  async function handleSignIn() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      await fetchProfile(result.user.uid);
      return result.user;
    } catch (err) {
      console.error('Sign in failed:', err);
      return null;
    }
  }

  // Sign out
  async function handleSignOut() {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  }

  // Save profile to Supabase (upsert)
  async function saveProfile(profileData) {
    if (!user) return null;

    const record = {
      id: user.uid,
      name: profileData.name,
      email: user.email,
      avatar: profileData.avatar !== undefined ? profileData.avatar : (user.photoURL || ''),
      role: profileData.role,
      experience: profileData.experience,
      bio: profileData.bio,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('users')
      .upsert(record, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving profile:', error);
      return null;
    }

    setProfile(data);
    return data;
  }

  // Refresh profile from Supabase
  async function refreshProfile() {
    if (user) await fetchProfile(user.uid);
  }

  const value = {
    user,
    profile,
    loading,
    profileLoading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    saveProfile,
    refreshProfile,
    isAuthenticated: !!user,
    hasProfile: !!profile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
