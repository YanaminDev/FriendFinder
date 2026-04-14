import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocationProposal } from '../service/location_proposal.service';

interface LocationProposalState {
  incomingProposal: LocationProposal | null;
  incomingProposalImage: string | undefined;
}

const initialState: LocationProposalState = {
  incomingProposal: null,
  incomingProposalImage: undefined,
};

export const locationProposalSlice = createSlice({
  name: 'locationProposal',
  initialState,
  reducers: {
    setIncomingProposal: (state, action: PayloadAction<LocationProposal | null>) => {
      state.incomingProposal = action.payload;
    },
    setIncomingProposalImage: (state, action: PayloadAction<string | undefined>) => {
      state.incomingProposalImage = action.payload;
    },
    clearIncomingProposal: (state) => {
      state.incomingProposal = null;
      state.incomingProposalImage = undefined;
    },
  },
});

export const {
  setIncomingProposal,
  setIncomingProposalImage,
  clearIncomingProposal,
} = locationProposalSlice.actions;

export default locationProposalSlice.reducer;
