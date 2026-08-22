import { apiSlice } from '../api/apiSlice';

export const requestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRequest: builder.mutation({
      query: (data) => ({
        url: '/requests',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['BloodRequest'],
    }),
    getMyRequests: builder.query({
      query: () => ({
        url: '/requests/my-requests',
        method: 'GET',
      }),
      providesTags: ['BloodRequest'],
    }),
    updateRequestStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/requests/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: ['BloodRequest'],
    }),
  }),
});

export const {
  useCreateRequestMutation,
  useGetMyRequestsQuery,
  useUpdateRequestStatusMutation,
} = requestApiSlice;
