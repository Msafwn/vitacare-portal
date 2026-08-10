import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  donors: [],
  loading: false,
  error: null,
};

const donorSlice = createSlice({
  name: 'donor',
  initialState,
  reducers: {
    // Add donor related sync actions if needed
  },
});

export default donorSlice.reducer;
