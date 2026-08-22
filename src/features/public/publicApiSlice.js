import { apiSlice } from "../api/apiSlice";

export const publicApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPublicInventory: builder.query({
            query: () => ({
                url: '/public/inventory',
                method: 'GET'
            }),
            providesTags: ['Inventory']
        }),
        getPublicStats: builder.query({
            query: () => ({
                url: '/public/stats',
                method: 'GET'
            }),
            providesTags: ['User', 'BloodRequest']
        }),
        submitContactMessage: builder.mutation({
            query: (data) => ({
                url: '/public/contact',
                method: 'POST',
                data: data
            })
        })
    })
});

export const {
    useGetPublicInventoryQuery,
    useGetPublicStatsQuery,
    useSubmitContactMessageMutation
} = publicApiSlice;
