import { createSlice } from '@reduxjs/toolkit';
import { donations as mockDonations } from '@/data/donations';

const initialState = {
  donations: mockDonations,
  selectedDonation: null,
  loading: false,
  error: null,
};

const donationSlice = createSlice({
  name: 'donation',
  initialState,
  reducers: {
    selectDonation: (state, action) => {
      state.selectedDonation = state.donations.find(d => d.id === action.payload) || null;
    }
  },
});

export const { selectDonation } = donationSlice.actions;
export default donationSlice.reducer;
