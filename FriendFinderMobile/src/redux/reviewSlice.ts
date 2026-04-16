import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReviewState {
  reviewMatchId: string | null;
}

const initialState: ReviewState = {
  reviewMatchId: null,
};

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    setReviewMatchId: (state, action: PayloadAction<string>) => {
      state.reviewMatchId = action.payload;
    },
    clearReviewMatchId: (state) => {
      state.reviewMatchId = null;
    },
  },
});

export const {
  setReviewMatchId,
  clearReviewMatchId,
} = reviewSlice.actions;

export default reviewSlice.reducer;
