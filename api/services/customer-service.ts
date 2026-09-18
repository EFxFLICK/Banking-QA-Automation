import { APIResponse } from '@playwright/test';
import { ApiClient } from '../clients/api-client';
import { Customer } from '../models/customer';

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

  public async getCustomerData(
    customerId: number
  ): Promise<Customer> {
    const response = await this.getCustomer(customerId);

    if (!response.ok()) {
      throw new Error(
        `Failed to retrieve customer ${customerId}: HTTP ${response.status()}`
      );
    }

    return response.json() as Promise<Customer>;
  }
}
