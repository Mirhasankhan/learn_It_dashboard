import { se } from "date-fns/locale";
import { baseApi } from "./baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query({
      query: (page) => ({
        url: `/admin/reviews?page=${page}`,
        method: "GET",
      }),
      providesTags: ["review"],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/admin/review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["review"],
    }),
    getAllActivity: builder.query({
      query: (page) => ({
        url: `/admin/activities?page=${page}`,
        method: "GET",
      }),
      providesTags: ["review"],
    }),
    deleteActivity: builder.mutation({
      query: (id) => ({
        url: `/admin/activity/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["review"],
    }),
    getAllFeedbacks: builder.query({
      query: (currentPage) => ({
        url: `/admin/feedbacks?page=${currentPage}`,
        method: "GET",
      }),
      providesTags: ["review"],
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useGetAllFeedbacksQuery,
  useGetAllActivityQuery,
  useDeleteActivityMutation,
  useDeleteReviewMutation
} = reviewApi;
