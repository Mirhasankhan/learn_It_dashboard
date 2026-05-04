import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        adminLogin: builder.mutation({
            query: (body) => ({
                url: `/admin/send-login/otp`,
                method: `POST`,
                body: body
            })
        }),
        forgotPassword: builder.mutation({
            query: (body) => ({
                url: `/auth/send-otp`,
                method: `POST`,
                body: body
            })
        }),
        verifyOTP: builder.mutation({
            query: (body) => ({
                url: `/admin/verify-otp`,
                method: `POST`,
                body: body
            })
        }),
        resetPassword: builder.mutation({
            query: (body) => ({
                url: `/auth/reset-password`,
                method: `PATCH`,
                body: body
            })
        }),
        changePassword: builder.mutation({
            query: (body) => ({
                url: `/auth/change-password`,
                method: `PATCH`,
                body: body
            })
        }),
        getMyProfile: builder.query({
            query: () => ({
                url: `/auth/profile`,
                method: 'GET'
            }),
            providesTags: ["profile"]
        }),
        updateMyProfile: builder.mutation({
            query: (body) => ({
                url: `/auth/set-profile`,
                method: `PUT`,
                body: body
            }),
            invalidatesTags: ["profile"]
        }),
    })
})

export const { useAdminLoginMutation, useForgotPasswordMutation, useVerifyOTPMutation, useResetPasswordMutation, useChangePasswordMutation, useGetMyProfileQuery, useUpdateMyProfileMutation } = authApi;