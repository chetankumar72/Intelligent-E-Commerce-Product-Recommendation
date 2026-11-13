import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'nexashop_auth_user_v4';
const AUTH_LOGGED_IN_KEY = 'nexashop_is_logged_in_v4';
const REGISTERED_USERS_KEY = 'nexashop_registered_accounts_v4';

// Helper to format clean name from email if name not provided
function formatNameFromEmail(email) {
  if (!email) return 'Shopper';
  const namePart = email.split('@')[0] || 'User';
  return namePart
    .split(/[._-]/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const isLoggedIn = localStorage.getItem(AUTH_LOGGED_IN_KEY);
      if (isLoggedIn === 'true') {
        const saved = localStorage.getItem(AUTH_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse auth user:', e);
    }
    // Must login first
    return null;
  });

  const isAuthenticated = Boolean(currentUser);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
        localStorage.setItem(AUTH_LOGGED_IN_KEY, 'true');
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(AUTH_LOGGED_IN_KEY);
      }
    } catch (e) {
      console.warn('Failed to save auth user:', e);
    }
  }, [currentUser]);

  // Login with Email & Password
  const login = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // Check if registered locally
    let name = formatNameFromEmail(cleanEmail);
    try {
      const savedAccounts = localStorage.getItem(REGISTERED_USERS_KEY);
      if (savedAccounts) {
        const accounts = JSON.parse(savedAccounts);
        const match = accounts.find(a => a.email.toLowerCase() === cleanEmail);
        if (match && match.name) {
          name = match.name;
        }
      }
    } catch (e) {
      // fallback to clean formatted name
    }

    const user = {
      id: `user_${cleanEmail.replace(/[^a-z0-9]/g, '_') || Date.now()}`,
      name: name,
      email: cleanEmail,
      role: 'Member',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      badge: 'Verified Member'
    };

    setCurrentUser(user);
    return { success: true, user };
  };

  // 1-Click Quick Demo Sign In
  const quickDemoLogin = (demoName = 'Demo User', demoEmail = 'demo@nexashop.ai') => {
    const user = {
      id: 'demo_user',
      name: demoName,
      email: demoEmail,
      role: 'Demo Shopper',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(demoName)}`,
      badge: 'Demo Account'
    };
    setCurrentUser(user);
    return user;
  };

  // Register a new user
  const register = ({ name, email, preferredCategory }) => {
    const cleanName = (name || '').trim() || 'New Member';
    const cleanEmail = (email || '').trim().toLowerCase();

    const newUser = {
      id: `user_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      role: 'Member',
      preferredCategory: preferredCategory || 'All',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
      badge: 'Member'
    };

    // Store in registered accounts list
    try {
      const saved = localStorage.getItem(REGISTERED_USERS_KEY);
      const accounts = saved ? JSON.parse(saved) : [];
      accounts.push({ name: cleanName, email: cleanEmail, preferredCategory });
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.warn('Failed to save registered account:', e);
    }

    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_LOGGED_IN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        register,
        quickDemoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
