import { LoginInput, Session } from "@pawpal/shared";
import { AxiosError, AxiosInstance } from "axios";
import { PawApiResponse } from "../api";

class AuthApi {
  constructor(private readonly client: AxiosInstance) {}

  public async getProfile(): Promise<PawApiResponse<Session>> {
    try {
      const response = await this.client.get("/auth/profile");
      return { success: true, data: response.data };
    } catch (error) {
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
      await this.client.post("/auth/logout");
      return { success: true, data: null };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }
}

export default AuthApi;
