import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdmin: builder.mutation({
      query: (formData) => ({
        url: `/admin/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["admin"],
    }),
    getAllAdmins: builder.query({
      query: (currentPage) => ({
        url: `/admin/all-admins?page=${currentPage}`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    getAdminBookingEarnings: builder.query({
      query: (page) => ({
        url: `/admin/admin-earnings/bookings?page=${page}`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    getAdminSubscriptionEarnings: builder.query({
      query: (page) => ({
        url: `/admin/admin-earnings/subscriptions?page=${page}`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    getAllChats: builder.query({
      query: (search) => ({
        url: `/admin/all-chats?search=${search}`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    deleteChat: builder.mutation({
      query: (id) => ({
        url: `/message/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin"],
    }),
    flagChat: builder.mutation({
      query: (id) => ({
        url: `/message/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["admin"],
    }),
    adminProfile: builder.query({
      query: () => ({
        url: `/admin/profile`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    adminDetails: builder.query({
      query: (id) => ({
        url: `/admin/details/${id}`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    overview: builder.query({
      query: () => ({
        url: `/admin/dashboard-overview`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    summary: builder.query({
      query: (type) => ({
        url: `/admin/earnings-summary?type=${type}`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    sessionSummary: builder.query({
      query: (type) => ({
        url: `/admin/session-summary?type=${type}`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    transactions: builder.query({
      query: (page) => ({
        url: `/admin/all-transactions?page=${page}`,
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin"],
    }),
    updateAdmin: builder.mutation({
      query: (data) => ({
        url: `/admin/profile/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["admin"],
    }),
    updateByAdmin: builder.mutation({
      query: (data) => ({
        url: `/admin/details/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["admin"],
    }),
  }),
});

export const {
  useCreateAdminMutation,
  useTransactionsQuery,
  useDeleteChatMutation,
  useFlagChatMutation,
  useAdminProfileQuery,
  useUpdateByAdminMutation,
  useGetAdminBookingEarningsQuery,
  useGetAdminSubscriptionEarningsQuery,
  useSessionSummaryQuery,
  useGetAllAdminsQuery,
  useAdminDetailsQuery,
  useDeleteAdminMutation,
  useSummaryQuery,
  useOverviewQuery,
  useUpdateAdminMutation,
  useGetAllChatsQuery,
} = adminApi;
