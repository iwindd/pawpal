import { HomeLayoutResponse } from "@pawpal/shared";
import { AxiosInstance } from "axios";

export default class HomeLayoutApi {
  constructor(private readonly client: AxiosInstance) {}

  public async getPublished(): Promise<HomeLayoutResponse> {
    const res = await this.client.get(`/home-layout`);
    return res.data;
  }
}
