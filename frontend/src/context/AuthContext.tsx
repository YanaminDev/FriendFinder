import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../apis/main.api';
import { ADMIN_VERIFY, USER_SET_OFFLINE } from '../apis/endpoint.api';

export interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  username: string | null;
  userId: string | null;
  role: string | null;
  isAdmin: boolean;
  login: (token: string, username: string, userId: string, role: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'));
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem('userId'));
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('role'));

  const isAuthenticated = !!(accessToken && username && userId && role);

  // Verify token against backend on mount — clears stale/expired/invalid tokens
  useEffect(() => {
    if (!accessToken) return;
    axiosInstance.get(ADMIN_VERIFY).catch(() => {
      // 401 → axios interceptor handles redirect; 403 → not admin, clear manually
      localStorage.removeItem('accessToken');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      setAccessToken(null);
      setUsername(null);
      setUserId(null);
      setRole(null);
      window.location.replace('/login');
    });
  }, []);

  // Set user offline when tab/browser is closed
  useEffect(() => {
    const handleUnload = () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      navigator.sendBeacon(
        `${baseUrl}${USER_SET_OFFLINE}`,
        new Blob([JSON.stringify({ token })], { type: 'application/json' })
      );
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const checkAuth = () => {
    setAccessToken(localStorage.getItem('accessToken'));
    setUsername(localStorage.getItem('username'));
    setUserId(localStorage.getItem('userId'));
    setRole(localStorage.getItem('role'));
  };

  const login = (token: string, username: string, userId: string, role: string) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('username', username);
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);
    
    setAccessToken(token);
    setUsername(username);
    setUserId(userId);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    
    setAccessToken(null);
    setUsername(null);
    setUserId(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, username, userId, role, isAdmin: role === 'admin', login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
