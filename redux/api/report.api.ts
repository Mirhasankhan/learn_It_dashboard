import { baseApi } from "./baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserReports: builder.query({
      query: (page) => ({
        url: `/admin/user-reports?page=${page}`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    getExpertReports: builder.query({
      query: (page) => ({
        url: `/admin/expert-reports?page=${page}`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    getUserReport: builder.query({
      query: (id) => ({
        url: `/report/user-wise/${id}`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    respondUserReport: builder.mutation({
      query: (data) => ({
        url: `/admin/response/user-report`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["report"],
    }),
    respondExpertReport: builder.mutation({
      query: (data) => ({
        url: `/admin/response/expert-report`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["report"],
    }),
    getExpertReport: builder.query({
      query: (id) => ({
        url: `/report/expert-wise/${id}`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
  }),
});

export const {
  useGetUserReportsQuery,
  useGetUserReportQuery,
  useGetExpertReportsQuery,
  useGetExpertReportQuery,
  useRespondUserReportMutation,
  useRespondExpertReportMutation
} = reportApi;
