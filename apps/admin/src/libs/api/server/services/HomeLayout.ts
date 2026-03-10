import { AdminHomeLayoutResponse } from "@pawpal/shared";
import { AxiosInstance } from "axios";

export default class HomeLayoutApi {
  constructor(private readonly client: AxiosInstance) {}

  public async getHomeLayout(id: string): Promise<AdminHomeLayoutResponse> {
    const res = await this.client.get(`/admin/home-layout/${id}`);
    return res.data;
  }

  public async getPublishedHomeLayout(): Promise<AdminHomeLayoutResponse> {
    const res = await this.client.get(`/admin/home-layout/published`);
    return res.data;
  }
}
