import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || '';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.user) {
        setUserState(data.user);
      } else {
        setUserState(null);
      }
    } catch {
      setUserState(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const setUser = (userData) => {
    setUserState(userData);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      /* ignore */
    }
    setUserState(null);
  };

  const displayName = user
    ? (user.name?.trim() || user.username || user.email?.split('@')[0] || 'User')
    : null;

  const value = {
    user,
    setUser,
    logout,
    isLoading,
    displayName,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
