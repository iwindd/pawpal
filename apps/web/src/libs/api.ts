import { LoginInput, Session } from "@pawpal/shared";
import axios, { AxiosError, AxiosInstance } from "axios";

type PawApiResponse<T> =
  | { success: true; data: T }
  | { success: false; data: AxiosError };

class PawApi {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async getProfile() {
    const response = await this.client.get("/auth/profile");
    return response.data;
  }

  public async login(inputs: LoginInput): Promise<PawApiResponse<Session>> {
    try {
      const response = await this.client.post("/auth/login", inputs);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }
}

export const API = new PawApi();
