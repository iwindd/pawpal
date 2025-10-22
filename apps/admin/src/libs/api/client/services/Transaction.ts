import {
  AdminTransactionResponse,
  DatatableInput,
  DatatableResponse,
} from "@pawpal/shared";
import { AxiosInstance, AxiosResponse } from "axios";

class TransactionApi {
  constructor(private readonly client: AxiosInstance) {}

  public async getPendingTransactions(
    params: DatatableInput
  ): Promise<AxiosResponse<DatatableResponse<AdminTransactionResponse>>> {
    return await this.client.get("/admin/wallet/pending", { params });
  }
}

export default TransactionApi;
