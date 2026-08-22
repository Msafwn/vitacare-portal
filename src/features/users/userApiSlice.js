import { apiSlice } from "../api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                data: credentials
            }),
            invalidatesTags: ['User']
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                data: userData
            }),
            invalidatesTags: ['User']
        }),
        getCurrentUser: builder.query({
            query: () => ({
                url: '/auth/profile',
                method: 'GET'
            }),
            providesTags: ['User']
        }),
        getDonors: builder.query({
            query: (params) => ({
                url: '/users/donors',
                method: 'GET',
                params
            }),
            providesTags: ['User']
        }),
        getDonorById: builder.query({
            query: (id) => ({
                url: `/users/donors/${id}`,
                method: 'GET'
            }),
            providesTags: ['User']
        }),
        updateAccount: builder.mutation({
            query: (userData) => ({
                url: '/users/update-account',
                method: 'PATCH',
                data: userData
            }),
            invalidatesTags: ['User']
        }),
        updatePreferences: builder.mutation({
            query: (preferences) => ({
                url: '/users/update-preferences',
                method: 'PATCH',
                data: preferences
            }),
            invalidatesTags: ['User']
        }),
        becomeDonor: builder.mutation({
            query: (donorData) => ({
                url: '/users/become-donor',
                method: 'POST',
                data: donorData
            }),
            invalidatesTags: ['User']
        }),
        changePassword: builder.mutation({
            query: (passwords) => ({
                url: '/users/change-password',
                method: 'POST',
                data: passwords
            })
        }),
        deleteAccount: builder.mutation({
            query: () => ({
                url: '/users/delete-account',
                method: 'DELETE'
            }),
            invalidatesTags: ['User']
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            invalidatesTags: ['User']
        })
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetCurrentUserQuery,
    useGetDonorsQuery,
    useGetDonorByIdQuery,
    useUpdateAccountMutation,
    useUpdatePreferencesMutation,
    useBecomeDonorMutation,
    useChangePasswordMutation,
    useDeleteAccountMutation,
    useLogoutMutation
} = userApiSlice;
