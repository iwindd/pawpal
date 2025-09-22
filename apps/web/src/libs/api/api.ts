import axios, { AxiosError, AxiosInstance } from "axios";

export type PawApiResponse<T> =
  | { success: true; data: T }
  | { success: false; data: AxiosError };

class PawApi {
  public readonly client: AxiosInstance;
  private readonly token?: string;

  constructor(token?: string) {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Cookie: `token=${token}` }),
      },
    });
  }
}

export default PawApi;
