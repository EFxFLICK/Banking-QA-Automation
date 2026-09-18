import { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api-client';

export class AccountService {
  public constructor(
    private readonly apiClient: ApiClient
  ) {}

  public async getAccount(
    accountId: number
  ): Promise<APIResponse> {
    return this.apiClient.get(
      `/parabank/services/bank/accounts/${accountId}`,
      {
        Accept: 'application/json'
      }
    );
  }
}
