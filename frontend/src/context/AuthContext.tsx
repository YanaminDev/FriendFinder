import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // ตรวจสอบ token จาก localStorage ตอน mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    const storedRole = localStorage.getItem('role');
    
    if (token && storedUsername && storedUserId && storedRole) {
      setAccessToken(token);
      setUsername(storedUsername);
      setUserId(storedUserId);
      setRole(storedRole);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
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
    setIsAuthenticated(true);
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
    setIsAuthenticated(false);
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
