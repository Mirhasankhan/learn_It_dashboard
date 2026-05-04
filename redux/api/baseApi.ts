import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { JWTDecodeToken } from "@/lib/jwtDecode";

const baseUrl = "http://localhost:4012/api/v1";
// const baseUrl = "https://api.sefr.sa/api/v1";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      // const token = state?.auth?.token;
      // console.log(token);

     const {token} = JWTDecodeToken()

      headers.set(
        "Authorization",
        `${token}`
      );

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "profile",
    "jobseeker",
    "notification",
    "expert",
    "report",
    "user",
    "withdraw",
    "admin",
    "content",
    "session",
    "review",
    "subscription",
  ],
});
