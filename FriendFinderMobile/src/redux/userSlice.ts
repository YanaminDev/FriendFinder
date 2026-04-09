// ─── Redux slice สำหรับ table: User ─────────────────────────────────────────
// Backend: UserSignupSchema
// Fields: username, password, user_show_name, sex, age, birth_of_date, interested_gender

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Sex = 'male' | 'female' | 'lgbtq';

interface UserState {
  user_id: string;
  username: string;
  password: string;
  user_show_name: string;
  sex: Sex | '';
  age: number | null;
  birth_of_date: string;         // format: YYYY-MM-DD
  interested_gender: Sex | '';
}

const initialState: UserState = {
  user_id: '',
  username: '',
  password: '',
  user_show_name: '',
  sex: '',
  age: null,
  birth_of_date: '',
  interested_gender: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setCredentials: (state, action: PayloadAction<{ username: string; password: string }>) => {
      state.username = action.payload.username;
      state.password = action.payload.password;
    },
    setShowName: (state, action: PayloadAction<string>) => {
      state.user_show_name = action.payload;
    },
    setSex: (state, action: PayloadAction<Sex>) => {
      state.sex = action.payload;
    },
    setAge: (state, action: PayloadAction<number>) => {
      state.age = action.payload;
    },
    setBirthOfDate: (state, action: PayloadAction<string>) => {
      state.birth_of_date = action.payload;
    },
    setInterestedGender: (state, action: PayloadAction<Sex>) => {
      state.interested_gender = action.payload;
    },
    clearUser: () => initialState,
  },
});

export const {
  setUserId,
  setUsername,
  setPassword,
  setCredentials,
  setShowName,
  setSex,
  setAge,
  setBirthOfDate,
  setInterestedGender,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;
