import { baseQuery } from "@/configs/api";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Employees", "Customers"],
  baseQuery: baseQuery({
    baseUrl: `/admin/`,
  }),
  endpoints: (builder) => ({
    updateUserProfile: builder.mutation<
      void,
      { id: string; profile: any; type: "customer" | "employee" }
    >({
      query: ({ id, profile, type }) => ({
        url: `${type}/${id}/profile`,
        method: "PATCH",
        body: profile,
      }),
      invalidatesTags: (result, error, { type }) => [
        type === "customer" ? "Customers" : "Employees",
      ],
    }),
    adminResetEmail: builder.mutation<
      void,
      { id: string; newEmail: string; type: "customer" | "employee" }
    >({
      query: ({ id, newEmail, type }) => ({
        url: `${type}/${id}/email`,
        method: "PATCH",
        body: { newEmail },
      }),
      invalidatesTags: (result, error, { type }) => [
        type === "customer" ? "Customers" : "Employees",
      ],
    }),
    adminResetPassword: builder.mutation<
      void,
      { id: string; newPassword: string; type: "customer" | "employee" }
    >({
      query: ({ id, newPassword, type }) => ({
        url: `${type}/${id}/password`,
        method: "PATCH",
        body: { newPassword },
      }),
    }),
  }),
});

export const {
  useUpdateUserProfileMutation,
  useAdminResetEmailMutation,
  useAdminResetPasswordMutation,
} = userApi;
