// ─── Redux slice สำหรับ table: User_image ────────────────────────────────────
// Backend: CreateUserImageSchema
// Fields: imageUrl (เก็บ local uri ไว้ก่อน แล้วค่อย upload ตอน signup จริง)

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserImageState {
  profileImage: string | null;    // local uri ของรูปที่เลือก
}

const initialState: UserImageState = {
  profileImage: null,
};

export const userImageSlice = createSlice({
  name: 'userImage',
  initialState,
  reducers: {
    setProfileImage: (state, action: PayloadAction<string | null>) => {
      state.profileImage = action.payload;
    },
    clearUserImage: () => initialState,
  },
});

export const {
  setProfileImage,
  clearUserImage,
} = userImageSlice.actions;

export default userImageSlice.reducer;
