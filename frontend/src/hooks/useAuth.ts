import { useState } from 'react';
import { authService } from '../services';
import { useAuthStore } from '../zustand/useAuthStore';
import type { LoginRequest, RegisterRequest, ForgotPasswordRequest } from '../types/requests';

export const useAuth = () => {
  const { isAuthenticated, username, userId, setAuth, logout: zustandLogout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      
      // Mock response for frontend development
      const mockResponse = {
        username: credentials.username,
        user_id: 'mock-user-id-' + Date.now(),
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        role: 'user'
      };
      
      // Update Zustand store
      setAuth(
        true,
        mockResponse.username,
        mockResponse.user_id,
        mockResponse.accessToken
      );
      
      console.log('✅ Mock login successful:', mockResponse);
      return mockResponse;
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
