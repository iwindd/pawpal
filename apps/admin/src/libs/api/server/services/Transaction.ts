import { AdminTransactionResponse } from "@pawpal/shared";
import { AxiosError, AxiosInstance } from "axios";
import { PawApiResponse } from "../../../../../../web/src/libs/api/api";

class TransactionApi {
  constructor(private readonly client: AxiosInstance) {}

  async getTransaction(
    id: string,
  ): Promise<PawApiResponse<AdminTransactionResponse>> {
    try {
      const response = await this.client.get<AdminTransactionResponse>(
        `admin/transaction/${id}`,
      );
      return {
        success: true,
        data: response.data,
      } as PawApiResponse<AdminTransactionResponse>;
    } catch (error) {
      return {
        success: false,
        data: error as AxiosError,
      };
    }
  }

  async assign(id: string): Promise<PawApiResponse<AdminTransactionResponse>> {
    try {
      const response = await this.client.patch<AdminTransactionResponse>(
        `admin/transaction/job/${id}/assign`,
      );
      return {
        success: true,
        data: response.data,
      } as PawApiResponse<AdminTransactionResponse>;
    } catch (error) {
      return {
        success: false,
        data: error as AxiosError,
      };
    }
  }
}

export default TransactionApi;
