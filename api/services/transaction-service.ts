import { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api-client';

export class TransactionService {
  public constructor(
    private readonly apiClient: ApiClient
  ) {}

  public async getTransactions(
    accountId: number
  ): Promise<APIResponse> {
    return this.apiClient.get(
      `/parabank/services/bank/accounts/${accountId}/transactions`,
      {
        Accept: 'application/json'
      }
    );
  }
}
