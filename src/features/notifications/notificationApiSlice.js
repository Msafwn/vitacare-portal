import { apiSlice } from '../api/apiSlice';

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: '/notifications',
        method: 'GET',
      }),
      providesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteAllNotifications: builder.mutation({
      query: () => ({
        url: '/notifications',
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
    respondToBroadcast: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/respond`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteBroadcast: builder.mutation({
      query: ({ title, message }) => ({
        url: `/notifications/broadcasts?title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
  useRespondToBroadcastMutation,
  useDeleteBroadcastMutation,
} = notificationApiSlice;
