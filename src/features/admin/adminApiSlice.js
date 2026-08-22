import { apiSlice } from "../api/apiSlice";

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdminUsers: builder.query({
            query: (params) => ({
                url: '/admin/users',
                method: 'GET',
                params
            }),
            providesTags: ['User']
        }),
        getAdminDonors: builder.query({
            query: (params) => ({
                url: '/admin/donors',
                method: 'GET',
                params
            }),
            providesTags: ['User']
        }),
        updateUserStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/admin/users/${id}/status`,
                method: 'PATCH',
                data: { status }
            }),
            invalidatesTags: ['User']
        }),
        verifyDonor: builder.mutation({
            query: (id) => ({
                url: `/admin/donors/${id}/verify`,
                method: 'PATCH'
            }),
            invalidatesTags: ['User']
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/admin/users/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['User']
        }),
        getAdminRequests: builder.query({
            query: (params) => ({
                url: '/admin/requests',
                method: 'GET',
                params
            }),
            providesTags: ['BloodRequest']
        }),
        reviewRequest: builder.mutation({
            query: ({ id, status }) => ({
                url: `/admin/requests/${id}/review`,
                method: 'PATCH',
                data: { status }
            }),
            invalidatesTags: ['BloodRequest']
        }),
        getAdminDonations: builder.query({
            query: (params) => ({
                url: '/admin/donations',
                method: 'GET',
                params
            }),
            providesTags: ['BloodRequest', 'User']
        }),
        getAdminInventory: builder.query({
            query: () => ({
                url: '/admin/inventory',
                method: 'GET'
            }),
            providesTags: ['Inventory']
        }),
        updateAdminInventory: builder.mutation({
            query: (data) => ({
                url: '/admin/inventory/update',
                method: 'PATCH',
                data
            }),
            invalidatesTags: ['Inventory']
        }),
        fulfillRequestFromStock: builder.mutation({
            query: (id) => ({
                url: `/requests/${id}/fulfill`,
                method: 'POST'
            }),
            invalidatesTags: ['BloodRequest', 'Inventory']
        }),
        getAdminSettings: builder.query({
            query: () => ({
                url: '/admin/settings',
                method: 'GET'
            }),
            providesTags: ['Settings']
        }),
        updateAdminSettings: builder.mutation({
            query: (settingsData) => ({
                url: '/admin/settings',
                method: 'PATCH',
                data: settingsData
            }),
            invalidatesTags: ['Settings']
        }),
        getAdminTeam: builder.query({
            query: () => ({
                url: '/admin/team',
                method: 'GET'
            }),
            providesTags: ['User']
        }),
        addAdmin: builder.mutation({
            query: (adminData) => ({
                url: '/admin/team/invite',
                method: 'POST',
                data: adminData
            }),
            invalidatesTags: ['User']
        }),
        revokeSessions: builder.mutation({
            query: () => ({
                url: '/admin/security/revoke-sessions',
                method: 'POST'
            })
        }),
        getMessages: builder.query({
            query: () => ({
                url: '/admin/messages',
                method: 'GET'
            }),
            providesTags: ['ContactMessage']
        }),
        resolveMessage: builder.mutation({
            query: (id) => ({
                url: `/admin/messages/${id}/resolve`,
                method: 'PATCH'
            }),
            invalidatesTags: ['ContactMessage']
        }),
        getAdminDashboard: builder.query({
            query: () => ({
                url: '/admin/dashboard',
                method: 'GET'
            }),
            providesTags: ['User', 'Inventory', 'BloodRequest']
        }),
        getAdminReports: builder.query({
            query: (period = '6_months') => ({
                url: `/admin/reports?period=${period}`,
                method: 'GET'
            }),
            providesTags: ['BloodRequest', 'User', 'Inventory']
        }),
        getBroadcasts: builder.query({
            query: () => ({
                url: '/admin/broadcasts',
                method: 'GET'
            }),
            providesTags: ['Notification']
        }),
        sendBroadcast: builder.mutation({
            query: (broadcastData) => ({
                url: '/admin/broadcasts',
                method: 'POST',
                data: broadcastData
            }),
            invalidatesTags: ['Notification']
        })
    })
});

export const {
    useGetAdminUsersQuery,
    useGetAdminDonorsQuery,
    useUpdateUserStatusMutation,
    useVerifyDonorMutation,
    useDeleteUserMutation,
    useGetAdminRequestsQuery,
    useReviewRequestMutation,
    useGetAdminDonationsQuery,
    useGetAdminInventoryQuery,
    useUpdateAdminInventoryMutation,
    useFulfillRequestFromStockMutation,
    useGetAdminSettingsQuery,
    useUpdateAdminSettingsMutation,
    useGetAdminTeamQuery,
    useAddAdminMutation,
    useRevokeSessionsMutation,
    useGetMessagesQuery,
    useResolveMessageMutation,
    useGetAdminDashboardQuery,
    useGetAdminReportsQuery,
    useGetBroadcastsQuery,
    useSendBroadcastMutation
} = adminApiSlice;
