import { createApi } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import axiosInstance from '../../lib/axios';

const axiosBaseQuery = () => async ({ url, method, data, params, signal }) => {
  try {
    const result = await axiosInstance({ url, method, data, params, signal });
    return { data: result.data };
  } catch (axiosError) {
    if (axios.isCancel(axiosError) || axiosError.isCanceled || axiosError.code === 'ERR_CANCELED') {
      return { error: { status: 'CANCELLED', data: { message: 'Request was cancelled' } } };
    }
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
