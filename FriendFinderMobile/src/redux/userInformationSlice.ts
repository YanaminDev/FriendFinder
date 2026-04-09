// ─── Redux slice สำหรับ table: User_Information ──────────────────────────────
// Backend: CreateUserInformationSchema
// Fields: user_height, user_bio, blood_group, language_id, education_id

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BloodGroup = 'A' | 'B' | 'AB' | 'O';

interface UserInformationState {
  user_height: number | null;
  user_bio: string;
  blood_group: BloodGroup | '';
  language_id: string;           // uuid
  education_id: string;          // uuid
}

const initialState: UserInformationState = {
  user_height: null,
  user_bio: '',
  blood_group: '',
  language_id: '',
  education_id: '',
};

export const userInformationSlice = createSlice({
  name: 'userInformation',
  initialState,
  reducers: {
    setHeight: (state, action: PayloadAction<number>) => {
      state.user_height = action.payload;
    },
    setBio: (state, action: PayloadAction<string>) => {
      state.user_bio = action.payload;
    },
    setBloodGroup: (state, action: PayloadAction<BloodGroup>) => {
      state.blood_group = action.payload;
    },
    setLanguageId: (state, action: PayloadAction<string>) => {
      state.language_id = action.payload;
    },
    setEducationId: (state, action: PayloadAction<string>) => {
      state.education_id = action.payload;
    },
    clearUserInformation: () => initialState,
  },
});

export const {
  setHeight,
  setBio,
  setBloodGroup,
  setLanguageId,
  setEducationId,
  clearUserInformation,
} = userInformationSlice.actions;

export default userInformationSlice.reducer;
