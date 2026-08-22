import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../../lib/axios';

const axiosBaseQuery = () => async ({ url, method, data, params }) => {
  try {
    const result = await axiosInstance({ url, method, data, params });
    return { data: result.data };
  } catch (axiosError) {
    return {
      error: {
        status: axiosError.response?.status || 500,
        data: axiosError.response?.data || { 
          message: axiosError.message || "An unexpected error occurred" 
        },
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
