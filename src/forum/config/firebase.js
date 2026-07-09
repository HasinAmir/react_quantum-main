// MOCK FIREBASE
// Bypasses real Google OAuth for local testing

const auth = {
  currentUser: null
};

const googleProvider = {};

async function signInWithPopup() {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 500));
  
  const mockUser = {
    uid: 'local-test-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: ''
  };
  auth.currentUser = mockUser;
  
  // Save to localStorage so auth state persists
  localStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
  
  return { user: mockUser };
}

async function signOut() {
  auth.currentUser = null;
  localStorage.removeItem('mock_auth_user');
}

export { auth, googleProvider, signInWithPopup, signOut };
