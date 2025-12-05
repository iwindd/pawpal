import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const baseQuery = ({ baseUrl }: { baseUrl: string }) => {
  return fetchBaseQuery({
    baseUrl: `${BASE_URL}${baseUrl}`,
    credentials: "include",
  });
};
