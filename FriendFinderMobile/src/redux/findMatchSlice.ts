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
  userLatitude: number | null;
  userLongitude: number | null;
  seenUserIds: string[];
}

const initialState: FindMatchState = {
  selectedActivities: [],
  isFinding: false,
  positionId: '',
  userLatitude: null,
  userLongitude: null,
  seenUserIds: [],
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
    setUserLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.userLatitude = action.payload.latitude;
      state.userLongitude = action.payload.longitude;
    },
    addSeenUserId: (state, action: PayloadAction<string>) => {
      if (!state.seenUserIds.includes(action.payload)) {
        state.seenUserIds.push(action.payload);
      }
    },
    clearFindMatch: () => initialState,
  },
});

export const {
  setSelectedActivities,
  setIsFinding,
  setPositionId,
  setUserLocation,
  addSeenUserId,
  clearFindMatch,
} = findMatchSlice.actions;

export default findMatchSlice.reducer;
