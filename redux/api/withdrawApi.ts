import { baseApi } from "./baseApi";

export const withdrawApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllWithdrawRequests: builder.query({
      query: ({ page, status }) => ({
        url: `/admin/withdraw-requests?page=${page}&status=${status}`,
        method: "GET",
      }),
      providesTags: ["withdraw"],
    }),
    getWithdrawRequestDetails: builder.query({
      query: (id) => ({
        url: `/admin/withdraw-request/${id}`,
        method: "GET",
      }),
      providesTags: ["withdraw"],
    }),
    acceptUser: builder.mutation({
      query: (id) => ({
        url: `/admin/withdraw-request/accept/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["withdraw"],
    }),
    rejectUser: builder.mutation({
      query: (id) => ({
        url: `/admin/withdraw-request/reject/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["withdraw"],
    }),
  }),
});

export const {
  useGetAllWithdrawRequestsQuery,
  useGetWithdrawRequestDetailsQuery,
  useAcceptUserMutation,
  useRejectUserMutation,
} = withdrawApi;
