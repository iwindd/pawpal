import axios, { AxiosError, AxiosInstance } from "axios";

// Constants
const DEFAULT_API_URL = "http://localhost:8000";
const CONTENT_TYPE_JSON = "application/json";
const TOKEN_COOKIE_PREFIX = "token=";

export type PawApiResponse<T> =
  | { success: true; data: T }
  | { success: false; data: AxiosError };

class PawApi {
  public readonly client: AxiosInstance;
  private readonly token?: string;

  constructor(token?: string) {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL,
      withCredentials: true,
      headers: {
        "Content-Type": CONTENT_TYPE_JSON,
        ...(token && { Cookie: `${TOKEN_COOKIE_PREFIX}${token}` }),
      },
    });
  }
}

export default PawApi;
