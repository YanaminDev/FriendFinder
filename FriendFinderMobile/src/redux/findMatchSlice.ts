import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedActivity {
  id: string;
  name: string;
  icon: string;
}

interface FindMatchState {
  selectedActivities: SelectedActivity[];
  isFinding: boolean;
  positionId: string;
}

const initialState: FindMatchState = {
  selectedActivities: [],
  isFinding: false,
  positionId: '',
};

export const findMatchSlice = createSlice({
  name: 'findMatch',
  initialState,
  reducers: {
    setSelectedActivities: (state, action: PayloadAction<SelectedActivity[]>) => {
      state.selectedActivities = action.payload;
    },
    setIsFinding: (state, action: PayloadAction<boolean>) => {
      state.isFinding = action.payload;
    },
    setPositionId: (state, action: PayloadAction<string>) => {
      state.positionId = action.payload;
    },
    clearFindMatch: () => initialState,
  },
});

export const {
  setSelectedActivities,
  setIsFinding,
  setPositionId,
  clearFindMatch,
} = findMatchSlice.actions;

export default findMatchSlice.reducer;
