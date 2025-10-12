import { CarouselResponse } from "@pawpal/shared";
import { AxiosError, AxiosInstance } from "axios";
import { PawApiResponse } from "../../api";

class CarouselApi {
  constructor(private readonly client: AxiosInstance) {}

  async findAll(): Promise<PawApiResponse<CarouselResponse[]>> {
    try {
      const response = await this.client.get("/carousel");
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error("Error fetching carousel data:", error);
      return { success: false, data: error as AxiosError };
    }
  }
}

export default CarouselApi;
