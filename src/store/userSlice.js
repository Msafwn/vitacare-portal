import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDonor: false,
  bloodGroup: null,
  availability: 'Currently Unavailable',
  lastDonationDate: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerAsDonor: (state, action) => {
      state.isDonor = true;
      state.bloodGroup = action.payload.bloodGroup;
      state.availability = action.payload.availability || 'Available';
      state.lastDonationDate = action.payload.lastDonationDate || null;
    },
    updateDonorAvailability: (state, action) => {
      state.availability = action.payload;
    },
    updateProfile: (state, action) => {
      // Mock profile update
    }
  },
});

export const { registerAsDonor, updateDonorAvailability, updateProfile } = userSlice.actions;
export default userSlice.reducer;
