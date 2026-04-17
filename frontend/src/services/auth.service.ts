import axiosInstance from '../apis/main.api';
import {
  AUTH_LOGIN,
  AUTH_REGISTER,
  AUTH_LOGOUT,
  AUTH_FORGOT_PASSWORD,
} from '../apis/endpoint.api';
import type { LoginRequest, RegisterRequest, ForgotPasswordRequest } from '../types/requests';
import type { AuthResponse } from '../types/responses';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>(AUTH_LOGIN, credentials);

      // Store tokens if returned
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      if (response.data.username) {
        localStorage.setItem('username', response.data.username);
      }
      if (response.data.user_id) {
        localStorage.setItem('userId', response.data.user_id);
      }
      if (response.data.role) {
        localStorage.setItem('role', response.data.role);
      }

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>(AUTH_REGISTER, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  },

  async logout(): Promise<void> {
    try {
      const response = await axiosInstance.post(AUTH_LOGOUT);
      console.log('✅ Logout API success:', response.data);
      // Clear storage after successful logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
    } catch (error: any) {
      console.error('❌ Logout API error:', error.response?.data || error.message);
      // Clear storage anyway on error
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      throw error;
    }
  },

  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    try {
      await axiosInstance.post(AUTH_FORGOT_PASSWORD, request);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password reset failed';
      throw new Error(message);
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  },

  getStoredUser() {
    return {
      username: localStorage.getItem('username'),
      userId: localStorage.getItem('userId'),
      accessToken: localStorage.getItem('accessToken'),
      role: localStorage.getItem('role'),
    };
  },
};
