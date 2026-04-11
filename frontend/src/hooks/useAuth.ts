import { useState } from 'react';
import { authService } from '../services';
import { useAuthStore } from '../zustand/useAuthStore';
import { useAuth as useAuthContext } from '../context/AuthContext';
import type { LoginRequest, RegisterRequest, ForgotPasswordRequest } from '../types/requests';

export const useAuth = () => {
  const { isAuthenticated, username, userId, setAuth, logout: zustandLogout } = useAuthStore();
  const { login: contextLogin, logout: contextLogout } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      
      // Update Zustand store
      setAuth(
        true,
        response.username || credentials.username,
        response.user_id || '',
        response.accessToken || ''
      );
      
      // Update Context store with role
      if (response.username && response.user_id && response.accessToken && response.role) {
        contextLogin(
          response.accessToken,
          response.username,
          response.user_id,
          response.role
        );
      }
      
      console.log('✅ Login successful:', response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      zustandLogout();
      contextLogout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (request: ForgotPasswordRequest) => {
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(request);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    isAuthenticated,
    username,
    userId,
    loading,
    error,

    // Methods
    login,
    register,
    logout,
    forgotPassword,
  };
};
