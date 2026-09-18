import { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api-client';

export class CustomerService {
  public constructor(
    private readonly apiClient: ApiClient
  ) {}

  public async getCustomer(
    customerId: number
  ): Promise<APIResponse> {
    return this.apiClient.get(
      `/parabank/services/bank/customers/${customerId}`,
      {
        Accept: 'application/json'
      }
    );
  }
}
