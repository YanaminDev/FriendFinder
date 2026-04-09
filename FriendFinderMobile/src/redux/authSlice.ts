import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  username: string;
  password: string;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  username: '',
  password: '',
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
    // Set credentials (both)
    setCredentials: (state, action: PayloadAction<{ username: string; password: string }>) => {
      state.username = action.payload.username;
      state.password = action.payload.password;
    },
    // Set authenticated
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    // Clear auth (logout)
    clearAuth: (state) => {
      state.username = '';
      state.password = '';
      state.isAuthenticated = false;
    },
  },
});

export const { setUsername, setPassword, setCredentials, setIsAuthenticated, clearAuth } = authSlice.actions;
export default authSlice.reducer;
