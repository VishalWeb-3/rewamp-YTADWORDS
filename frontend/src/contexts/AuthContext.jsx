import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import BannedOverlay from '../components/BannedOverlay';

const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || '';

const isContactPath = (path) => path?.startsWith('/contact');

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const [user, setUserState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [banned, setBanned] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        credentials: 'include',
      });
      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (err) {
        // Skip console error for regular session checks to avoid noise
        if (!res.ok) console.error('Auth check non-JSON:', text);
        setIsLoading(false);
        return;
      }

      if (res.ok && data.user) {
        setUserState(data.user);
        setBanned(null);
      } else if (res.status === 403 && data.error === 'Account banned') {
        setUserState(null);
        setBanned({ isBanned: true, banReason: data.reason || 'Your account has been suspended.' });
      } else {
        setUserState(null);
        setBanned(null);
      }
    } catch (e) {
      console.error('Fetch user error:', e);
      setUserState(null);
      setBanned(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    fetch(`${API_BASE}/api/auth/check/${user.id}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.isBanned) {
          setBanned({ isBanned: true, banReason: data.banReason || 'Your account has been suspended.' });
        } else {
          setBanned({ isBanned: false });
        }
      })
      .catch(() => setBanned(null));
  }, [user?.id]);

  useEffect(() => {
    const onFocus = () => fetchUser();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchUser]);

  const setUser = (userData) => {
    setUserState(userData);
    if (!userData) setBanned(null);
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
    setBanned(null);
  };

  const displayName = user
    ? (user.name?.trim() || user.username || user.email?.split('@')[0] || 'User')
    : null;

  const showBannedOverlay = banned?.isBanned && !isContactPath(location.pathname);

  const value = {
    user,
    setUser,
    logout,
    isLoading,
    displayName,
    isLoggedIn: !!user,
    banned,
    setBanned,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {showBannedOverlay && <BannedOverlay reason={banned?.banReason} />}
    </AuthContext.Provider>
  );
};
