import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import userReducer from './userSlice';
import donorReducer from './donorSlice';
import donationReducer from './donationSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: userReducer,
    donor: donorReducer,
    donation: donationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
