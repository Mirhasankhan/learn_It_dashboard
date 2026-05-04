import { baseApi } from "./baseApi";

export const jobSeekerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobSeekers: builder.query({
      query: ({ page, searchTerm }) => ({
        url: `/admin/job-seekers?page=${page}&search=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getJobSeekersDetails: builder.query({
      query: (id) => ({
        url: `/admin/user-details/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    suspendUser: builder.mutation({
      query: (body) => ({
        url: `/admin/suspend-user`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["user"],
    }),
    unsuspendUser: builder.mutation({
      query: (id) => ({
        url: `/admin/unsuspend-user/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["user"],
    }),
    deactivateUser: builder.mutation({
      query: (id) => ({
        url: `/admin/toggle-user/deactivate/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["user"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetAllJobSeekersQuery,
  useGetJobSeekersDetailsQuery,
  useSuspendUserMutation,
  useDeactivateUserMutation,
  useUnsuspendUserMutation,
  useDeleteUserMutation,
} = jobSeekerApi;
