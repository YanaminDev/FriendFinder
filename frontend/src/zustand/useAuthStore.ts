import { create } from 'zustand';

export interface AuthStore {
  isAuthenticated: boolean;
  username: string | null;
  userId: string | null;
  accessToken: string | null;
  
  // Actions
  setAuth: (isAuthenticated: boolean, username?: string | null, userId?: string | null, accessToken?: string | null) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!(localStorage.getItem('accessToken') && localStorage.getItem('username') && localStorage.getItem('userId')),
  username: localStorage.getItem('username'),
  userId: localStorage.getItem('userId'),
  accessToken: localStorage.getItem('accessToken'),

  setAuth: (isAuthenticated, username = null, userId = null, accessToken = null) => {
    set({
      isAuthenticated,
      username,
      userId,
      accessToken,
    });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');

    set({
      isAuthenticated: false,
      username: null,
      userId: null,
      accessToken: null,
    });
  },

  checkAuth: () => {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    if (token && username && userId) {
      set({
        isAuthenticated: true,
        username,
        userId,
        accessToken: token,
      });
    } else {
      set({
        isAuthenticated: false,
        username: null,
        userId: null,
        accessToken: null,
      });
    }
  },
}));
