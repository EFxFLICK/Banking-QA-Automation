import { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api-client';
import { Transaction } from '../models/transaction';

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

  public async getTransactionData(
    accountId: number
  ): Promise<Transaction[]> {
    const response = await this.getTransactions(accountId);

    if (!response.ok()) {
      throw new Error(
        `Failed to retrieve transactions for account ${accountId}: HTTP ${response.status()}`
      );
    }

    return response.json() as Promise<Transaction[]>;
  }
}
