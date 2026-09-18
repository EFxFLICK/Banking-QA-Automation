import { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api-client';

export class TransferService {
  public constructor(
    private readonly apiClient: ApiClient
  ) {}

  public async transfer(
    fromAccountId: number,
    toAccountId: number,
    amount: number
  ): Promise<APIResponse> {
    return this.apiClient.post(
      '/parabank/services/bank/transfer',
      {
        params: {
          fromAccountId,
          toAccountId,
          amount
        },
        headers: {
          Accept: 'application/json'
        }
      }
    );
  }
}
