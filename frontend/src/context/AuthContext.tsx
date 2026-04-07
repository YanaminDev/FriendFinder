import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  username: string | null;
  userId: string | null;
  login: (token: string, username: string, userId: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // ตรวจสอบ token จาก localStorage ตอน mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    
    if (token && storedUsername && storedUserId) {
      setAccessToken(token);
      setUsername(storedUsername);
      setUserId(storedUserId);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  const login = (token: string, username: string, userId: string) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('username', username);
    localStorage.setItem('userId', userId);
    
    setAccessToken(token);
    setUsername(username);
    setUserId(userId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    
    setAccessToken(null);
    setUsername(null);
    setUserId(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, username, userId, login, logout, checkAuth }}>
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
