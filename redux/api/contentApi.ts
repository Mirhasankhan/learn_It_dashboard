import { baseApi } from "./baseApi";

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTermsAndConditions: builder.query({
      query: (key) => ({
        url: `/admin/get-all-terms-and-condition?key=${key}`,
        method: "GET",
      }),
      providesTags: ["content"],
    }),
    getAllPrivacyPolicy: builder.query({
      query: (key) => ({
        url: `/admin/privacy-policy?key=${key}`,
        method: "GET",
      }),
      providesTags: ["content"],
    }),
    updateTerms: builder.mutation({
      query: (body) => ({
        url: `/admin/create-terms-and-condition`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["content"],
    }),
    updatePrivay: builder.mutation({
      query: (body) => ({
        url: `/admin/create-privacy-policy`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["content"],
    }),
    createFAQ: builder.mutation({
      query: (body) => ({
        url: `/admin/faq-create`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["content"],
    }),
    getAllFAQs: builder.query({
      query: (key) => ({
        url: `/admin/all-faqs?key=${key}`,
        method: "GET",
      }),
      providesTags: ["content"],
    }),
    getSingleFAQ: builder.query({
      query: (id) => ({
        url: `/admin/faq/${id}`,
        method: "GET",
      }),
      providesTags: ["content"],
    }),
    updateFAQ: builder.mutation({
      query: (body) => ({
        url: `/admin/faq/update`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["content"],
    }),
    deleteFAQ: builder.mutation({
      query: (id) => ({
        url: `/admin/faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["content"],
    }),
  }),
});

export const {
  useGetAllTermsAndConditionsQuery,
  useGetAllPrivacyPolicyQuery,
  useUpdatePrivayMutation,
  useCreateFAQMutation,
  useGetAllFAQsQuery,
  useGetSingleFAQQuery,
  useUpdateFAQMutation,
  useUpdateTermsMutation,
  useDeleteFAQMutation,
} = contentApi;
