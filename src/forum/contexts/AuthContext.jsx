import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { supabase } from '../config/supabase.js';

const googleProvider = new GoogleAuthProvider();

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

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchProfile(currentUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch user profile from Supabase or create if new
  async function fetchProfile(currentUser) {
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.uid)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      
      if (data) {
        setProfile(data);
      } else {
        // Auto-create profile for first-time login
        const newProfile = {
          id: currentUser.uid,
          name: currentUser.displayName || 'New User',
          email: currentUser.email || '',
          avatar: currentUser.photoURL || '',
          role: 'student',
          experience: 'beginner',
          bio: '',
          created_at: new Date().toISOString()
        };
        
        const { data: createdData, error: createError } = await supabase
          .from('users')
          .upsert(newProfile, { onConflict: 'id' })
          .select()
          .single();
          
        if (createError) {
          console.error('Error auto-creating profile:', createError);
          setProfile(null);
        } else {
          setProfile(createdData);
        }
      }
    } catch (err) {
      console.error('Profile fetch failed:', err);
      setProfile(null);
    }
    setProfileLoading(false);
  }

  // Sign in with Google
  async function handleSignIn() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      console.error('Sign in failed:', err);
      alert(`Sign in error: ${err.message}`);
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
    if (user) await fetchProfile(user);
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
