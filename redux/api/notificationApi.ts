import { baseApi } from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendNotification: builder.mutation({
      query: (data) => ({
        url: `/admin/send-notification`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["notification"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/admin/notification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notification"],
    }),
    adminNotifications: builder.query({
      query: (page) => ({
        url: `/admin/all-notifications?page=${page}`,
        method: "GET",
      }),
      providesTags: ["notification"],
    }),
  }),
});

export const { useSendNotificationMutation, useAdminNotificationsQuery, useDeleteNotificationMutation } =
  notificationApi;
