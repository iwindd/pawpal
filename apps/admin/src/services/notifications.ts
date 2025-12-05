import { baseQuery } from "@/configs/api";
import { createApi } from "@reduxjs/toolkit/query/react";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  tagTypes: ["Notifications"],
  baseQuery: baseQuery({
    baseUrl: `/admin/notification`,
  }),
  endpoints: (builder) => ({
    getNotifications: builder.query<Record<string, number>, void>({
      query: () => ({
        url: `/`,
      }),
      providesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationApi;
