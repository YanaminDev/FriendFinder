import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  username: string;
  password: string;
  accessToken: string;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  username: '',
  password: '',
  accessToken: '',
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set username
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    // Set password
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    // Set access token
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    // Set credentials (both)
    setCredentials: (state, action: PayloadAction<{ username: string; password: string; accessToken?: string }>) => {
      state.username = action.payload.username;
      state.password = action.payload.password;
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
    },
    // Set authenticated
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    // Clear auth (logout)
    clearAuth: (state) => {
      state.username = '';
      state.password = '';
      state.accessToken = '';
      state.isAuthenticated = false;
    },
  },
});

export const { setUsername, setPassword, setAccessToken, setCredentials, setIsAuthenticated, clearAuth } = authSlice.actions;
export default authSlice.reducer;
