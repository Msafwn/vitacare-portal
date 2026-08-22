import { apiSlice } from '../api/apiSlice';

export const donationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyDonations: builder.query({
      query: () => ({
        url: '/donations/my-donations',
        method: 'GET',
      }),
      providesTags: ['Donation'],
    }),
    logDonation: builder.mutation({
      query: (data) => ({
        url: '/donations/log',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Donation'],
    }),
  }),
});

export const {
  useGetMyDonationsQuery,
  useLogDonationMutation,
} = donationApiSlice;
