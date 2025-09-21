import { LoginInput, Session } from "@pawpal/shared";
import axios, { AxiosError, AxiosInstance } from "axios";

type PawApiResponse<T> =
  | { success: true; data: T }
  | { success: false; data: AxiosError };

class PawApi {
  private readonly client: AxiosInstance;

  constructor(withToken?: string) {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        ...(withToken && { Cookie: `token=${withToken}` }),
      },
    });
  }

  public async getProfile() {
    try {
      const response = await this.client.get("/auth/profile");
      return { success: true, data: response.data };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401)
        return { success: false, data: null };

      return { success: false, data: error as AxiosError };
    }
  }

  public async login(inputs: LoginInput): Promise<PawApiResponse<Session>> {
    try {
      const response = await this.client.post("/auth/login", inputs);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }

  public async logout(): Promise<PawApiResponse<null>> {
    try {
      const response = await this.client.post("/auth/logout");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }
}

export const API = new PawApi();
export const APIWithToken = (token: string): PawApi => new PawApi(token);
