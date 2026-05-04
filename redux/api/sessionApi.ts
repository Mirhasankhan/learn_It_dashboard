import { baseApi } from "./baseApi";

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSessions: builder.query({
      query: ({page, status, searchTerm}) => ({
        url: `/admin/sessions?page=${page}&status=${status}&search=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["session"],
    }),
    mockSession: builder.query({
      query: () => ({
        url: `/mock-session`,
        method: "GET",
      }),
      providesTags: ["session"],
    }),
    updatemockSession: builder.mutation({
      query: (data) => ({
        url: `/mock-session/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["session"],
    }),
    getAllOrders: builder.query({
      query: ({page,status, searchTerm}) => ({
        url: `/admin/orders?page=${page}&status=${status}&search=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["session"],
    }),
  }),
});

export const {
  useGetAllSessionsQuery,
  useGetAllOrdersQuery,
  useMockSessionQuery,
  useUpdatemockSessionMutation
} = sessionApi;
