// ─── Redux slice สำหรับ table: User_Life_Style ───────────────────────────────
// Backend: CreateUserLifeStyleSchema
// Fields: looking_for_id, drinking_id, pet_id, smoke_id, workout_id

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserLifeStyleState {
  looking_for_id: string;        // uuid
  drinking_id: string;           // uuid
  pet_id: string;                // uuid
  smoke_id: string;              // uuid
  workout_id: string;            // uuid
}

const initialState: UserLifeStyleState = {
  looking_for_id: '',
  drinking_id: '',
  pet_id: '',
  smoke_id: '',
  workout_id: '',
};

export const userLifeStyleSlice = createSlice({
  name: 'userLifeStyle',
  initialState,
  reducers: {
    setLookingForId: (state, action: PayloadAction<string>) => {
      state.looking_for_id = action.payload;
    },
    setDrinkingId: (state, action: PayloadAction<string>) => {
      state.drinking_id = action.payload;
    },
    setPetId: (state, action: PayloadAction<string>) => {
      state.pet_id = action.payload;
    },
    setSmokeId: (state, action: PayloadAction<string>) => {
      state.smoke_id = action.payload;
    },
    setWorkoutId: (state, action: PayloadAction<string>) => {
      state.workout_id = action.payload;
    },
    clearUserLifeStyle: () => initialState,
  },
});

export const {
  setLookingForId,
  setDrinkingId,
  setPetId,
  setSmokeId,
  setWorkoutId,
  clearUserLifeStyle,
} = userLifeStyleSlice.actions;

export default userLifeStyleSlice.reducer;
