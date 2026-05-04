import { baseApi } from "./baseApi";

export const jobSeekerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllExperts: builder.query({
      query: ({ page, searchTerm }) => ({
        url: `/admin/experts?page=${page}&search=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getAllRefunds: builder.query({
      query: (page) => ({
        url: `/admin/refunds?page=${page}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: `/admin/all-users`,
        method: "GET",
      }),
    }),
    getExpertDetails: builder.query({
      query: (id) => ({
        url: `/admin//expert-details/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getExpertBookingWithdraw: builder.query({
      query: (id) => ({
        url: `/admin/booking-withdraw-history/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getAllExpertApplications: builder.query({
      query: ({ page, searchTerm }) => ({
        url: `/admin/experts-applications?page=${page}&search=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    acceptUser: builder.mutation({
      query: (id) => ({
        url: `/admin/accept-application/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetAllExpertsQuery,
  useGetExpertDetailsQuery,
  useGetAllUsersQuery,
  useGetAllExpertApplicationsQuery,
  useGetExpertBookingWithdrawQuery,
  useGetAllRefundsQuery,
  useAcceptUserMutation,
} = jobSeekerApi;
