import { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api-client';
import { Account } from '../models/account';

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

  public async getAccountData(
    accountId: number
  ): Promise<Account> {
    const response = await this.getAccount(accountId);

    if (!response.ok()) {
      throw new Error(
        `Failed to retrieve account ${accountId}: HTTP ${response.status()}`
      );
    }

    return response.json() as Promise<Account>;
  }
}
