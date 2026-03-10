import { CarouselResponse } from "@pawpal/shared";
import { AxiosInstance } from "axios";

class CarouselApi {
  constructor(private readonly client: AxiosInstance) {}

  async getPublished(): Promise<CarouselResponse[]> {
    try {
      const response = await this.client.get("/carousel");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching carousel data:", error);
      return [];
    }
  }
}

export default CarouselApi;
