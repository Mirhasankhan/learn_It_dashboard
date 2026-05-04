import { baseApi } from "./baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPlansOfUser: builder.query({
      query: () => ({
        url: `/admin/subscription-plan/user`,
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),
    getAllPlansOfExpert: builder.query({
      query: () => ({
        url: `/admin/subscription-plan/expert`,
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),
    getAllSubscribers: builder.query({
      query: (page) => ({
        url: `/admin/subscribers?page=${page}`,
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),
    createPlanForUser: builder.mutation({
      query: (body) => ({
        url: `/admin/user-plan/create`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["subscription"],
    }),
    createPlanForExpert: builder.mutation({
      query: (payload) => ({
        url: `/admin/expert-plan/create`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["subscription"],
    }),
    updatePlanForUser: builder.mutation({
      query: (body) => ({
        url: `/admin/user-plan/update`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["subscription"],
    }),
    updatePlanForExpert: builder.mutation({
      query: (body) => ({
        url: `/admin/expert-plan/update`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["subscription"],
    }),
  }),
});

export const {
  useGetAllPlansOfUserQuery,
  useGetAllPlansOfExpertQuery,
  useCreatePlanForUserMutation,
  useCreatePlanForExpertMutation,
  useUpdatePlanForUserMutation,
  useUpdatePlanForExpertMutation,
  useGetAllSubscribersQuery
} = subscriptionApi;
