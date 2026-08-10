import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../lib/axios';

const axiosBaseQuery = () => async ({ url, method, data, params }) => {
  try {
    const result = await axiosInstance({ url, method, data, params });
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['User', 'BloodRequest', 'Donation', 'Notification'],
  endpoints: (builder) => ({
    // Enpoints will be added here as we migrate features
  })
});
